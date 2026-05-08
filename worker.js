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
  texting: `STRICT RULE: You are a tone converter. Rewrite the user's message to sound like a casual text. 
CRITICAL: Change ONLY the tone. Preserve all original paragraphs and facts. 
DO NOT add greetings, intros, or explanations.

Example 1:
Input: I have completed the report. Please review it by 5pm today.
Output: report's done. mind taking a look by 5?

Example 2:
Input: We need to reschedule.
Output: hey we gotta push our meeting.`,

  workChat: `STRICT RULE: You are a tone converter. Rewrite the user's message to sound like a friendly professional coworker.
CRITICAL: Change ONLY the tone. Preserve all original paragraphs and facts. 
DO NOT add greetings, intros, or explanations.

Example 1:
Input: yo i finished the code. check it out.
Output: Just wanted to let you know I've finished the code. Feel free to check it out whenever you can.

Example 2:
Input: late to meeting sry
Output: Sorry I'm running a bit late to the meeting!`,

  corporate: `STRICT RULE: You are a tone converter. Rewrite the user's message in a formal corporate tone.
CRITICAL: Change ONLY the tone. Preserve all original paragraphs and facts. 
DO NOT add greetings, intros, or explanations.

Example 1:
Input: i cant make it today. family stuff.
Output: Please be advised that I am unable to attend today's session due to unforeseen personal obligations.

Example 2:
Input: fix this bug now
Output: I would appreciate it if you could prioritize the resolution of this issue at your earliest convenience.`,

  decode: `STRICT RULE: You are a translator. Explain in plain simple English what the user actually means.
CRITICAL: Be direct and blunt.
DO NOT add intros or explanations.

Example 1:
Input: Let's circle back on this when we have more bandwidth.
Output: I'm too busy to talk about this right now.

Example 2:
Input: Per my previous email.
Output: You didn't read what I sent you already.`,
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const { text, toneLevel, mode } = body;

    if (!text || typeof text !== "string" || text.trim().length < 2) {
      return json({ error: "No text provided" }, 400);
    }

    // Build prompt
    const promptKey = mode === "decode" ? "decode" : (toneLevel || "workChat");
    const systemPrompt = PROMPTS[promptKey] || PROMPTS.workChat;

    // Call Cloudflare AI (Native & Permanent)
    try {
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text.trim() }
        ],
        max_tokens: 600,
        temperature: 0.1
      });

      const result = response.response || response.text;
      if (!result) return json({ error: "AI failed to generate response" }, 502);

      return json({ success: true, text: result.trim() });

    } catch (err) {
      console.error(err);
      return json({ error: "AI Service error — try again shortly" }, 502);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
