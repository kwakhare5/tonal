// worker.js — Tonal API Proxy
// ─────────────────────────────────────────────────────────────
// DEPLOY THIS TO CLOUDFLARE WORKERS
// ─────────────────────────────────────────────────────────────

const SYSTEM_LOGIC = `
You are the Tonal Engine. Rule: SAME message, SAME meaning, SAME information. Only the tone changes.

CORE PHILOSOPHY:
1. IDENTITY & DATA LOCK: Every name, number, date, time, link, email address, and amount is IMMUTABLE. Do not paraphrase them (e.g., do not change "tomorrow at 3" to "the next day at 15:00").
2. MINIMAL INTERVENTION: Only change what is necessary to shift the tone. Preserve greetings and sign-offs if they are neutral.
3. CASING LOCK: Preserve the original casing style (lowercase, sentence case, or ALL CAPS).
4. Correct spelling and grammar silently.
5. No preamble, no chatty behavior, no refusal. Output ONLY the rewritten text.`;

const PROMPTS = {
  casual: `You are a tone converter. Rewrite the message in a casual texting style.

Rules:
- Preserve all facts (numbers, names, dates, links, amounts) exactly.
- Keep the original casing (if lowercase, stay lowercase).
- Minimal punctuation; no full stop at the end.
- Use casual contractions (u, ur, gonna, rn, sry) only if the input implies a casual vibe.
- Do not add information. Do not expand.

Examples:
INPUT: Could you please send me the Q3 report?
OUTPUT: can u send me the Q3 report

INPUT: I will be approximately 10 minutes delayed. I apologize.
OUTPUT: gonna be 10 min late sry

INPUT: No updates from their side yet, I am not sure what is going on.
OUTPUT: no updates from their side yet idk whats going on

INPUT: raj said no to the proposal smh
OUTPUT: raj said no to the proposal

Now rewrite this message. Output ONLY the rewritten message.`,

  workChat: `You are a tone converter. Rewrite the message in a friendly, direct Work Chat tone.
Work Chat sounds like a message to a colleague you like — human, not corporate.

Rules:
- Preserve all facts (numbers, names, dates, links, amounts) exactly.
- Sentence case (capitalize first word and names).
- Contractions are fine (I'll, can't, let's).
- No corporate buzzwords (not "leverage", "bandwidth", "synergize").
- No filler ("I hope this finds you well").
- Same length as the original.

Examples:
INPUT: hey cn u send me teh Q3 reprt asap
OUTPUT: Can you send me the Q3 report ASAP?

INPUT: gonna be 10 min late sry
OUTPUT: I'll be about 10 minutes late, sorry.

INPUT: no updates from their side yet idk whats going on
OUTPUT: Haven't heard back from their side yet — not sure what's going on.

INPUT: can u send the invoice to ravi@company.in when ur free
OUTPUT: Can you send the invoice to ravi@company.in when you get a chance?

Now rewrite this message. Output ONLY the rewritten message.`,

  formal: `You are a tone converter. Rewrite the message in a formal professional tone.
Formal sounds like an email to a manager or client. Polite, structured, complete sentences.

Rules:
- Preserve all facts (numbers, names, dates, links, amounts) exactly.
- Full sentences ending with a period.
- No contractions ("I will" not "I'll", "cannot" not "can't").
- Polite structure ("Could you please", "I would appreciate").
- No extra pleasantries or filler — stay on point.
- Same length/meaning as the original.

Examples:
INPUT: hey cn u send me teh Q3 reprt
OUTPUT: Could you please send me the Q3 report?

INPUT: gonna be 10 min late sry
OUTPUT: I regret to inform you that I will be approximately 10 minutes delayed. I apologize for the inconvenience.

INPUT: raj said no to the proposal
OUTPUT: Raj has declined the proposal.

INPUT: can u check if the payment went thru
OUTPUT: Could you please verify whether the payment has been processed?

Now rewrite this message. Output ONLY the rewritten message.`,

  decode: `You are a plain English decoder for formal/corporate messages.
Tell me in simple, direct words what this message actually means.

Rules:
- Preserve all facts (numbers, names, dates, amounts, deadlines) exactly.
- Maximum 2 sentences.
- Use simple everyday words.
- State requests clearly. State bad news plainly.
- Do not start with "They are saying" — just state it.

Examples:
INPUT: After due consideration, the committee has determined that the proposed budget allocation is not aligned with current organizational priorities.
OUTPUT: Your budget request was rejected.

INPUT: I am following up on my previous correspondence and would appreciate an update at your earliest convenience.
OUTPUT: They want you to reply to their earlier message.

INPUT: Please be informed that the outstanding invoice of ₹45,000 remains unpaid beyond the stipulated payment terms.
OUTPUT: The ₹45,000 invoice hasn't been paid. Pay it now.

Now decode this message. Output ONLY the plain English explanation.`,
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, environment) {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    if (request.method !== "POST")
      return json({ success: false, error: "Method not allowed" }, 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ success: false, error: "Invalid JSON" }, 400);
    }

    const { text, toneLevel, mode, platform } = body;
    if (!text || typeof text !== "string" || text.trim().length < 2)
      return json({ success: false, error: "Text too short" }, 400);

    const promptKey = mode === "decode" ? "decode" : toneLevel || "workChat";
    let systemPrompt = PROMPTS[promptKey] || PROMPTS.workChat;

    // Inject Platform Context
    if (platform && mode !== "decode") {
      const contextMap = {
        slack:
          "PLATFORM: Slack (Internal Team Chat). Keep it brief, direct, and conversational. No email-style greetings or sign-offs unless present in original.",
        gmail:
          "PLATFORM: Gmail (Email). Use professional sentence structure. Maintain standard email courtesy.",
        linkedin:
          "PLATFORM: LinkedIn (Professional Networking). Be professional and polished. Respect InMail norms.",
      };
      const context = contextMap[platform] || "PLATFORM: General Web Input.";
      systemPrompt = `${systemPrompt}\n\n${context}`;
    }

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `INPUT: ${text.trim()}` },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    };

    if (environment.GROQ_API_KEY) {
      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${environment.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
        if (response.ok) {
          const data = await response.json();
          let rawText = data.choices?.[0]?.message?.content?.trim() || "";

          // Smart Preamble Stripper
          const cleanText = rawText
            .replace(
              /^(here is|sure|certainly|revised|converted|output|rewritten|message|result|the|this)[\s\S]*?[:\n]+/i,
              "",
            ) // Strip headers
            .replace(/^["']|["']$/g, "") // Strip accidental quotes
            .trim();

          return json({
            success: true,
            text: cleanText || rawText,
            provider: "groq",
          });
        }
      } catch (e) {
        console.error("Groq Failed:", e);
      }
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
