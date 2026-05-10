// worker.js — Tonal API Proxy
// ─────────────────────────────────────────────────────────────
// DEPLOY THIS TO CLOUDFLARE WORKERS
// ─────────────────────────────────────────────────────────────

const SYSTEM_LOGIC = `
You are the Tonal Engine. Your sole purpose is to rewrite text while preserving 100% of the meaning and facts.

CORE RULES:
1. IDENTITY & DATA LOCK: Names, numbers, dates, times, links, emails, and amounts are IMMUTABLE.
2. MINIMAL INTERVENTION: Only change parts of the text that require a tone shift.
3. CASING LOCK: Preserve the original casing style of the input.
4. Correct spelling mistakes silently.
5. Do not add content that was not in the original.
6. Same length as the original — do not pad or expand.`;

const PROMPTS = {
  casual: `You are a tone converter. Rewrite the message below in a casual texting style.

Hard rules — follow every one of these without exception:
1. Preserve all information exactly — every number, name, date, time, link, email address, and amount must appear in the output unchanged.
2. Same meaning — the output must communicate the exact same thing as the input.
3. Keep the same case format as the original. If it is all lowercase, keep it lowercase. If it has mixed case, match that.
4. Fix spelling mistakes silently — correct typos without mentioning them.
5. If the original has casual abbreviations and contractions, keep that style. If not, do not force them in.
6. Do not add words that were not in the original.
7. Keep the same length — do not expand a one-sentence message into multiple sentences.

Examples:
INPUT: Could you please send me the Q3 report at your earliest convenience?
OUTPUT: can u send me the Q3 report

INPUT: I will be approximately 10 minutes delayed. I apologize for the inconvenience.
OUTPUT: gonna be 10 min late sry

INPUT: I am following up to check if you reviewed the document I shared.
OUTPUT: hey did u check that doc i sent

INPUT: The payment gateway on the site is currently not functioning.
OUTPUT: the payment gateway on the site is down rn

Now rewrite this message. Output ONLY the rewritten message. Nothing else.`,

  workChat: `You are a tone converter. Rewrite the message below in a Work Chat tone.

Work Chat sounds like a message to a colleague you actually like — friendly, direct, human. Not cold. Not corporate.

Hard rules — follow every one of these without exception:
1. Preserve all information exactly — every number, name, date, time, link, email address, and amount must appear in the output unchanged.
2. Same meaning — the output must communicate the exact same thing as the input.
3. Sentence case — capitalize the first word and proper nouns only.
4. Contractions are fine: I'll, can't, won't, let's, you're, I've.
5. Fix spelling mistakes silently.
6. No corporate buzzwords — not "circle back", "synergize", "leverage", "bandwidth", "deliverables".
7. Do not add filler phrases like "I hope this finds you well" or "please do not hesitate to reach out".
8. Do not add words that were not in the original.
9. Same length as the original — do not expand.

Examples:
INPUT: hey cn u send me teh Q3 reprt asap
OUTPUT: Can you send me the Q3 report ASAP?

INPUT: gonna be 10 min late sry
OUTPUT: I'll be about 10 minutes late, sorry.

INPUT: I am following up on my previous correspondence and would appreciate your response.
OUTPUT: Just checking in — any update on this?

INPUT: can we move the meeting to thursday 2pm
OUTPUT: Can we move the meeting to Thursday at 2 PM?

Now rewrite this message. Output ONLY the rewritten message. Nothing else.`,

  formal: `You are a tone converter. Rewrite the message below in a formal professional tone.

Formal sounds like a professional email to a manager, client, or HR. Polite, structured, complete sentences.

Hard rules — follow every one of these without exception:
1. Preserve all information exactly — every number, name, date, time, link, email address, and amount must appear in the output unchanged.
2. Same meaning — the output must communicate the exact same thing as the input.
3. Full sentences. Always end with a period.
4. No contractions — "I will" not "I'll", "cannot" not "can't", "do not" not "don't".
5. Polite structure around requests — "Could you please", "I would appreciate", "I would like to".
6. Fix spelling mistakes silently.
7. Do not add content that was not in the original — no extra pleasantries, no filler.
8. Same length as the original — if the input is one sentence, the output is one or two sentences.

Examples:
INPUT: hey cn u send me teh Q3 reprt
OUTPUT: Could you please send me the Q3 report?

INPUT: gonna be 10 min late sry
OUTPUT: I regret to inform you that I will be approximately 10 minutes delayed. I apologize for the inconvenience.

INPUT: just checking if u saw my last msg
OUTPUT: I am following up on my previous message and would appreciate a response.

INPUT: can we move the meeting to thursday 2pm
OUTPUT: Could we reschedule the meeting to Thursday at 2 PM?

Now rewrite this message. Output ONLY the rewritten message. Nothing else.`,

  decode: `You are a plain English decoder for formal and corporate messages.

Tell me in simple words what this message actually means or is asking. Be direct.

Hard rules:
1. Preserve all specific information — every number, name, date, amount, and deadline must appear in the output.
2. Maximum 2 sentences.
3. Use simple everyday words — no formal language in the explanation.
4. If it is a request, say clearly what they are asking for.
5. If it is bad news, say it plainly.
6. Do not add your own opinion or commentary.
7. Do not start with "This message says" or "They are saying" — just state it directly.

Examples:
INPUT: After due consideration, the committee has determined that the proposed budget allocation is not aligned with current organizational priorities.
OUTPUT: Your budget request was rejected.

INPUT: I am following up on my previous correspondence and would appreciate an update at your earliest convenience.
OUTPUT: They want you to reply to their earlier message.

INPUT: Please be informed that the outstanding invoice of ₹45,000 remains unpaid beyond the stipulated payment terms.
OUTPUT: The ₹45,000 invoice hasn't been paid. Pay it now.

INPUT: I regret to inform you that we are unable to move forward with your candidacy at this time.
OUTPUT: You didn't get the job.

Now decode this message. Output ONLY the plain English explanation. Nothing else.`,
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, environment) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
    if (request.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);

    let body;
    try { body = await request.json(); } catch { return json({ success: false, error: "Invalid JSON" }, 400); }

    const { text, toneLevel, mode, platform } = body;
    if (!text || typeof text !== "string" || text.trim().length < 2) return json({ success: false, error: "Text too short" }, 400);

    const promptKey = mode === "decode" ? "decode" : (toneLevel || "workChat");
    let systemPrompt = PROMPTS[promptKey] || PROMPTS.workChat;

    // Inject Platform Context
    if (platform && mode !== "decode") {
      const contextMap = {
        slack: "PLATFORM: Slack (Internal Team Chat). Keep it brief, direct, and conversational. No email-style greetings or sign-offs unless present in original.",
        whatsapp: "PLATFORM: WhatsApp (Instant Messaging). Be concise and informal. Avoid corporate fluff.",
        gmail: "PLATFORM: Gmail (Email). Use professional sentence structure. Maintain standard email courtesy.",
        linkedin: "PLATFORM: LinkedIn (Professional Networking). Be professional and polished. Respect InMail norms."
      };
      const context = contextMap[platform] || "PLATFORM: General Web Input.";
      systemPrompt = `${systemPrompt}\n\n${context}`;
    }

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `INPUT: ${text.trim()}` }
      ],
      temperature: 0.1, 
      max_tokens: 1000
    };

    if (environment.GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${environment.GROQ_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          let rawText = data.choices?.[0]?.message?.content?.trim() || "";
          
          // Smart Preamble Stripper
          const cleanText = rawText
            .replace(/^(here is|sure|certainly|revised|converted|output|rewritten|message|result|the|this)[\s\S]*?[:\n]+/i, "") // Strip headers
            .replace(/^["']|["']$/g, "") // Strip accidental quotes
            .trim();
            
          return json({ success: true, text: cleanText || rawText, provider: "groq" });
        }
      } catch (e) { console.error("Groq Failed:", e); }
    }

    return json({ success: false, error: "AI Pipeline failed" }, 502);
  },
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
