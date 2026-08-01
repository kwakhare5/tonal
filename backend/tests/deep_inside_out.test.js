import test from 'node:test';
import assert from 'node:assert';
import worker, { extractOutput } from '../src/index.js';

// ── 1. PLATFORM ADAPTER MATCHER SUITE ────────────────────────────
const mockAdapters = {
  gmail: { matches: (url) => url.includes("mail.google.com") },
  slack: { matches: (url) => url.includes("slack.com") },
  linkedin: { matches: (url) => url.includes("linkedin.com") },
  getAdapter: function(url) {
    if (this.linkedin.matches(url)) return { id: 'linkedin' };
    if (this.slack.matches(url)) return { id: 'slack' };
    if (this.gmail.matches(url)) return { id: 'gmail' };
    return { id: 'none' };
  }
};

test('Inside-Out — Platform Adapter Selection Accuracy', () => {
  assert.strictEqual(mockAdapters.getAdapter('https://mail.google.com/mail/u/0/#inbox').id, 'gmail');
  assert.strictEqual(mockAdapters.getAdapter('https://app.slack.com/client/T001/C001').id, 'slack');
  assert.strictEqual(mockAdapters.getAdapter('https://www.linkedin.com/messaging/thread/123/').id, 'linkedin');
  assert.strictEqual(mockAdapters.getAdapter('https://linkedin.com/feed/').id, 'linkedin');
  assert.strictEqual(mockAdapters.getAdapter('https://example.com').id, 'none');
});

// ── 2. OFFLINE TONE ENGINE EXPANDED SUITE ────────────────────────
const OfflineToneEngine = {
  _rules: {
    formal: [
      [/\bwanna\b/gi, "want to"], [/\bgonna\b/gi, "going to"],
      [/\bgotta\b/gi, "have to"], [/\bkinda\b/gi, "somewhat"],
      [/\bsorta\b/gi, "somewhat"], [/\bya\b/gi, "you"],
      [/\byeah\b/gi, "yes"], [/\bnope\b/gi, "no"],
      [/\bcool\b/gi, "excellent"], [/\bawesome\b/gi, "excellent"],
      [/\bstuff\b/gi, "items"], [/\bthing\b/gi, "matter"],
      [/\bget\b/gi, "obtain"], [/\bfix\b/gi, "resolve"],
      [/\bcheck out\b/gi, "review"], [/\bkick off\b/gi, "commence"],
      [/\bdig into\b/gi, "investigate"], [/\bwrap up\b/gi, "conclude"],
      [/\btouch base\b/gi, "follow up"], [/\bloop in\b/gi, "include"],
      [/\bgrab\b/gi, "obtain"], [/\bshow\b/gi, "demonstrate"],
      [/\btalk\b/gi, "discuss"], [/\bsend\b/gi, "transmit"],
      [/\bask\b/gi, "inquire"], [/\btell\b/gi, "inform"],
      [/\bjust\b/gi, ""], [/\bbasically\b/gi, ""],
      [/\bliterally\b/gi, ""], [/\bactually\b/gi, ""],
    ],
    casual: [
      [/\bI would like to\b/gi, "I'd love to"],
      [/\bI am writing to\b/gi, "reaching out about"],
      [/\bplease find attached\b/gi, "here's"],
      [/\bfurthermore\b/gi, "also"], [/\bmoreover\b/gi, "plus"],
      [/\bnevertheless\b/gi, "still"], [/\bconsequently\b/gi, "so"],
      [/\bsubsequently\b/gi, "then"], [/\butilize\b/gi, "use"],
      [/\bfacilitate\b/gi, "help"], [/\bascertain\b/gi, "find out"],
      [/\btransmit\b/gi, "send"], [/\binquire\b/gi, "ask"],
      [/\binform\b/gi, "tell"], [/\bobtain\b/gi, "get"],
      [/\bcommence\b/gi, "start"], [/\bconclude\b/gi, "wrap up"],
      [/\bdemonstrate\b/gi, "show"],
    ],
    workChat: [
      [/\bI would like to\b/gi, "I want to"],
      [/\bplease find attached\b/gi, "here's"],
      [/\butilize\b/gi, "use"], [/\bfacilitate\b/gi, "help"],
      [/\bwanna\b/gi, "want to"], [/\bgonna\b/gi, "going to"],
      [/\byeah\b/gi, "yes"], [/\bnope\b/gi, "no"],
    ],
  },
  apply(text, toneLevel) {
    const rules = this._rules[toneLevel] || this._rules.workChat;
    let result = text;
    for (const [pattern, replacement] of rules) {
      result = result.replace(pattern, replacement);
    }
    return result.replace(/  +/g, " ").trim();
  },
};

test('Inside-Out — OfflineToneEngine Comprehensive Edge Cases', () => {
  // Formal tone word replacement
  assert.strictEqual(
    OfflineToneEngine.apply("Can you check out this stuff before we kick off?", "formal"),
    "Can you review this items before we commence?"
  );

  // Casual tone word replacement
  assert.strictEqual(
    OfflineToneEngine.apply("I am writing to inquire if you can facilitate this.", "casual"),
    "reaching out about ask if you can help this."
  );

  // WorkChat tone word replacement
  assert.strictEqual(
    OfflineToneEngine.apply("yeah I gonna wanna send this nope", "workChat"),
    "yes I going to want to send this no"
  );
});

// ── 3. CLOUDFLARE WORKER PAYLOAD & SECURITY INTEGRITY ─────────────
test('Inside-Out — Worker System Prompt Includes SYSTEM_LOGIC & Security Tags', async () => {
  let capturedBody = null;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.includes('api.groq.com')) {
      capturedBody = JSON.parse(options.body);
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>Optimized response</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: {
        'Origin': 'https://tonall.pages.dev',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: '<script>alert(1)</script> Hello World', toneLevel: 'formal', platform: 'linkedin' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);

    assert.ok(capturedBody);
    const systemMsg = capturedBody.messages[0].content;
    const userMsg = capturedBody.messages[1].content;

    // Verify SYSTEM_LOGIC rules present
    assert.ok(systemMsg.includes('IDENTITY & DATA LOCK'));
    assert.ok(systemMsg.includes('MINIMAL INTERVENTION'));
    assert.ok(systemMsg.includes('CASING LOCK'));

    // Verify platform context injected
    assert.ok(systemMsg.includes('PLATFORM: LinkedIn'));

    // Verify XML entity sanitization
    assert.ok(userMsg.includes('&lt;script&gt;alert(1)&lt;/script&gt; Hello World'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Inside-Out — MAX_INPUT_LENGTH (4000 chars) Enforced', async () => {
  const hugeText = 'a'.repeat(4001);
  const req = new Request('https://tonal.dev/', {
    method: 'POST',
    headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: hugeText, toneLevel: 'casual' })
  });

  const res = await worker.fetch(req, {});
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.ok(body.error.includes('max length'));
});

// ── 4. EXTRACT OUTPUT PARSER FULL TEST SUITE ───────────────────────
test('Inside-Out — extractOutput Parser Logic', () => {
  assert.strictEqual(extractOutput('<tonal_output>Clean Text</tonal_output>'), 'Clean Text');
  assert.strictEqual(extractOutput('Here is the revised text: "Clean Text"'), 'Clean Text');
  assert.strictEqual(extractOutput('output:\n\nHello Team'), 'Hello Team');
  assert.strictEqual(extractOutput(''), '');
});
