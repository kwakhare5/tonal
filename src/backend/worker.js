// worker.js — Tonal API Proxy
// ─────────────────────────────────────────────────────────────
// DEPLOY THIS TO CLOUDFLARE WORKERS (not part of the extension)
//
// Steps:
// 1. Go to workers.cloudflare.com → sign up free
// 2. Create Worker → delete default code → paste this
// 3. Click "Save and Deploy"
// 4. Go to Settings → Variables → Add variable:
// The AI runs natively on Cloudflare (no API keys needed).
// ─────────────────────────────────────────────────────────────

const PROMPTS = {
  casual: `IDENTITY: Expert Linguistic Chameleon.
TASK: Transform text into "Casual" (Messaging) tone.

CONSTRAINTS:
- TARGET: Lowercase-friendly, short-form (u, r, sry), relaxed grammar.
- PRESERVE: Meaning, urgency, specific nouns.
- FORBIDDEN: Preamble, sympathetic replies, robotic formalisms, quotation marks.
- RESULT_ONLY: Return only the transformed text.

EXAMPLES:
- Input: "I apologize for the delay." -> Output: "sry for the delay"
- Input: "Please send the file." -> Output: "can u send the file?"

INPUT: {TEXT}`,

  workChat: `IDENTITY: Professional Communication Architect.
TASK: Transform text into "Work Chat" (Slack/Teams) tone.

CONSTRAINTS:
- TARGET: Professional, concise, polite but efficient.
- PRESERVE: All technical details and intent.
- FORBIDDEN: Greetings (Hi/Hey), Preamble, sympathetic replies, robotic formalisms.
- RESULT_ONLY: Return only the transformed text.

EXAMPLES:
- Input: "hey i cant make it sry" -> Output: "I won't be able to make it today, sorry about that."
- Input: "send me the doc" -> Output: "Could you please send over that document when you have a chance?"

INPUT: {TEXT}`,

  formal: `IDENTITY: Executive Communications Specialist.
TASK: Transform text into "Formal" (Business/Legal) tone.

CONSTRAINTS:
- TARGET: Formal, sophisticated, full grammar, polite.
- PRESERVE: Professional distance and core intent.
- FORBIDDEN: Preamble, "Dear [Name]", sympathetic replies, conversational filler.
- RESULT_ONLY: Return only the transformed text.

EXAMPLES:
- Input: "hey im late" -> Output: "Please accept my apologies for the delay in my arrival."
- Input: "can u help?" -> Output: "I would appreciate your assistance with this matter."

INPUT: {TEXT}`,

  decode: `IDENTITY: Corporate Jargon Decoder.
TASK: Translate corporate speak into a direct "Decoded Message".

CONSTRAINTS:
- TARGET: Direct, clear, simple language only.
- PRESERVE: The core message and intent.
- FORBIDDEN: Preamble, corporate fluff, sympathetic tone, additional context.
- RESULT_ONLY: Return only the decoded text.

INPUT: {TEXT}`,
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, environment) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return json({ success: false, error: "Method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ success: false, error: "Invalid JSON body" }, 400);
    }

    const { text, toneLevel, mode } = body;

    // 1. Input Validation & Sanitization
    if (!text || typeof text !== "string" || text.trim().length < 2) {
      return json({ success: false, error: "Input text is too short or invalid" }, 400);
    }

    const promptKey = mode === "decode" ? "decode" : (toneLevel || "workChat");
    const systemPrompt = PROMPTS[promptKey] || PROMPTS.workChat;

    const payload_base = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nCRITICAL: You MUST change the tone. Do not return the original text. Return ONLY JSON: { "text": "...", "confidence": 1.0 }`
        },
        { role: "user", content: text.trim() }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    };

    // 1. Primary: Groq API
    if (environment.GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${environment.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload_base),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const result = JSON.parse(content);
            if (result.text) {
              return json({ success: true, text: result.text.trim(), provider: "groq" });
            }
          }
        }
      } catch (e) { console.error("Groq Failed:", e); }
    }

    // 2. Fallback: Cloudflare Workers AI
    if (environment.AI) {
      try {
        const cfResponse = await environment.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            { 
              role: "system", 
              content: `${systemPrompt}\n\nCRITICAL: You MUST change the tone. Do not return the original text. Be brief and direct.`
            },
            { role: "user", content: text.trim() }
          ]
        });
        if (cfResponse && cfResponse.response) {
          const cleanText = cfResponse.response.replace(/\{"text":\s*"/, "").replace(/"\}/, "").trim();
          return json({ success: true, text: cleanText, provider: "cf-native" });
        }
      } catch (e) { console.error("CF AI Failed:", e); }
    }

    return json({ success: false, error: "AI Providers failed or returned identical text" }, 502);
  },
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
