import test from 'node:test';
import assert from 'node:assert';
import worker from '../src/index.js';

test('Worker — CORS Allowed Origin', async () => {
  const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'chrome-extension://abc'
    }
  });

  const res = await worker.fetch(req, {});
  assert.strictEqual(res.status, 204);
  assert.strictEqual(res.headers.get('Access-Control-Allow-Origin'), 'chrome-extension://abc');
});

test('Worker — CORS Forbidden Origin', async () => {
  const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
    method: 'POST',
    headers: {
      'Origin': 'https://malicious-site.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: 'test message', toneLevel: 'workChat' })
  });

  const res = await worker.fetch(req, {});
  assert.strictEqual(res.status, 403);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.error, 'Forbidden origin');
});

test('Worker — Prompt Injection Protection Payload', async () => {
  let capturedPayload = null;

  // Mock global fetch to intercept Groq request
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.includes('api.groq.com')) {
      capturedPayload = JSON.parse(options.body);
      return new Response(JSON.stringify({
        choices: [{ message: { content: '<tonal_output>Test converted</tonal_output>' } }]
      }), { status: 200 });
    }
    return new Response('', { status: 200 });
  };

  try {
    const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: 'test text', toneLevel: 'workChat' })
    });

    const res = await worker.fetch(req, { GROQ_API_KEY: 'test-key' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.text, 'Test converted');

    // Assert injection defenses in payload
    assert.ok(capturedPayload);
    const messages = capturedPayload.messages;
    assert.strictEqual(messages[1].role, 'user');
    assert.strictEqual(messages[1].content, '<user_message>\ntest text\n</user_message>');
    assert.ok(messages[0].content.includes('<user_message>'));
    assert.ok(messages[0].content.includes('CRITICAL SECURITY'));
  } finally {
    // Restore fetch
    globalThis.fetch = originalFetch;
  }
});

test('Worker — Missing or Invalid Text Field (TDD Test)', async () => {
  const req = new Request('http://tonal-proxy.kwakhare5.workers.dev', {
    method: 'POST',
    headers: {
      'Origin': 'http://localhost:3000',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ toneLevel: 'workChat' }) // Missing 'text'
  });

  const res = await worker.fetch(req, {});
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.error, 'Invalid or missing text field');
});

