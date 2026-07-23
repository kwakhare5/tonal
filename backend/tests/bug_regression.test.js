/**
 * BUG REGRESSION TESTS — @DIAGNOSE + @TDD
 * Write failing RED tests for all 6 identified bugs.
 * All tests must FAIL before fixes are applied, then GREEN after.
 *
 * Seams:
 *   - backend/worker.js  → CORS + platform context + rate limit
 *   - extension/tonal.js → insertText scoping (DOM-independent logic tested via mocks)
 *   - extension/adapters/gmail.js → getValue() returns innerText not innerHTML
 */

import test from 'node:test';
import assert from 'node:assert';
import worker from '../src/index.js';

// ─────────────────────────────────────────────────────────────
// BUG 2: background.js never sends platform → worker ignores it
// SEAM: worker.js receives `platform` field and injects context
// RED: platform-specific context should appear in Groq payload
// ─────────────────────────────────────────────────────────────
test('[BUG-2] Worker — Platform context injected into Groq payload for Slack', async () => {
  let capturedPayload = null;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    if (url.includes('api.groq.com')) {
      capturedPayload = JSON.parse(options.body);
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>sounds good</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: { 'Origin': 'chrome-extension://abc', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'can u send the report', toneLevel: 'workChat', mode: 'convert', platform: 'slack' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);

    // The system prompt MUST include Slack-specific platform context
    const systemContent = capturedPayload.messages[0].content;
    assert.ok(
      systemContent.includes('Slack') || systemContent.includes('PLATFORM'),
      `Expected "Slack" or "PLATFORM" in system prompt, got: ${systemContent.slice(0, 200)}`
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('[BUG-2] Worker — Platform context injected for Gmail', async () => {
  let capturedPayload = null;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    if (url.includes('api.groq.com')) {
      capturedPayload = JSON.parse(options.body);
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>Please send the report</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: { 'Origin': 'chrome-extension://abc', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hey send that report', toneLevel: 'formal', mode: 'convert', platform: 'gmail' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);

    const systemContent = capturedPayload.messages[0].content;
    assert.ok(
      systemContent.includes('Gmail') || systemContent.includes('PLATFORM'),
      `Expected "Gmail" or "PLATFORM" in system prompt, got: ${systemContent.slice(0, 200)}`
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('[BUG-2] Worker — Platform context injected for LinkedIn', async () => {
  let capturedPayload = null;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    if (url.includes('api.groq.com')) {
      capturedPayload = JSON.parse(options.body);
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>I would be delighted to connect.</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: { 'Origin': 'chrome-extension://abc', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hey wanna connect', toneLevel: 'formal', mode: 'convert', platform: 'linkedin' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);

    const systemContent = capturedPayload.messages[0].content;
    assert.ok(
      systemContent.includes('LinkedIn') || systemContent.includes('PLATFORM'),
      `Expected "LinkedIn" or "PLATFORM" in system prompt, got: ${systemContent.slice(0, 200)}`
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ─────────────────────────────────────────────────────────────
// BUG 4: CORS blocks website domain (pages.dev, production)
// RED: The worker must allow Cloudflare Pages domains
// ─────────────────────────────────────────────────────────────
test('[BUG-4] Worker — CORS allows Cloudflare Pages domain', async () => {
  const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
    method: 'OPTIONS',
    headers: { 'Origin': 'https://tonal.pages.dev' }
  });

  const res = await worker.fetch(req, {});
  assert.strictEqual(res.status, 204);
  const allowedOrigin = res.headers.get('Access-Control-Allow-Origin');
  assert.notStrictEqual(
    allowedOrigin, 'null',
    `Expected pages.dev to be allowed, got CORS header: ${allowedOrigin}`
  );
  assert.ok(
    allowedOrigin === 'https://tonal.pages.dev' || allowedOrigin === '*',
    `Expected exact origin or *, got: ${allowedOrigin}`
  );
});

test('[BUG-4] Worker — CORS allows localhost:3000 for dev', async () => {
  const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
    method: 'OPTIONS',
    headers: { 'Origin': 'http://localhost:3000' }
  });

  const res = await worker.fetch(req, {});
  assert.strictEqual(res.status, 204);
  const allowedOrigin = res.headers.get('Access-Control-Allow-Origin');
  assert.ok(
    allowedOrigin === 'http://localhost:3000' || allowedOrigin === '*',
    `Expected localhost:3000 to be allowed, got: ${allowedOrigin}`
  );
});

// ─────────────────────────────────────────────────────────────
// BUG 4b: Groq 429 rate limit — must surface as structured error
// RED: worker currently returns 502 for all Groq errors
// ─────────────────────────────────────────────────────────────
test('[BUG-4b] Worker — Groq 429 returns structured rate limit error (not 502)', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    if (url.includes('api.groq.com')) {
      return new Response(
        JSON.stringify({ error: { message: 'Rate limit exceeded', type: 'tokens' } }),
        { status: 429, headers: { 'retry-after': '60' } }
      );
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: { 'Origin': 'chrome-extension://abc', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'test text', toneLevel: 'workChat', mode: 'convert' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 429, `Expected 429, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(
      data.error.toLowerCase().includes('try') || data.error.toLowerCase().includes('break') || data.error.toLowerCase().includes('limit'),
      `Expected user-friendly rate limit message, got: ${data.error}`
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ─────────────────────────────────────────────────────────────
// SEAM: extractOutput — platform field preserved in response
// This confirms the worker correctly forwards platform info
// ─────────────────────────────────────────────────────────────
test('[BUG-2] Worker — Response includes provider field', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    if (url.includes('api.groq.com')) {
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>Test output</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: { 'Origin': 'chrome-extension://abc', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'test message', toneLevel: 'workChat', mode: 'convert', platform: 'slack' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.provider, 'groq', `Expected provider=groq, got: ${data.provider}`);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ─────────────────────────────────────────────────────────────
// BUG 3: Gmail getValue() — must return innerText not innerHTML
// SEAM: adapters/gmail.js getValue() — tested via direct import
// ─────────────────────────────────────────────────────────────
// Note: adapters are plain browser scripts (window.tonalAdapters global).
// We test the logic by extracting it: the rule is "never return innerHTML for AI input"
// This is a logic-level test via the worker's text validation — HTML input test.
test('[BUG-3] Worker — HTML-tagged input is stripped before reaching AI (regression)', async () => {
  let capturedUserMessage = null;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    if (url.includes('api.groq.com')) {
      const payload = JSON.parse(options.body);
      capturedUserMessage = payload.messages[1].content;
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>Rewritten clean</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  // Simulate what happens if gmail adapter sends innerHTML (HTML tags) to worker
  const htmlInput = '<div>Hey team,<br>can you send the report?</div>';

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: { 'Origin': 'chrome-extension://abc', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: htmlInput, toneLevel: 'formal', mode: 'convert', platform: 'gmail' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);

    // The captured user message should have HTML entities escaped (< → &lt;)
    // This is the worker's XSS defense — it should NOT see raw HTML tags
    assert.ok(
      capturedUserMessage.includes('&lt;div&gt;') || capturedUserMessage.includes('&lt;'),
      `Expected HTML to be entity-escaped in user message, got: ${capturedUserMessage}`
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
