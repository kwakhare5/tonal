import test from 'node:test';
import assert from 'node:assert';
import { extractOutput } from '../src/backend/worker.js';

test('extractOutput - XML Tag Wrapping', () => {
  // Case 1: Standard wrapped content
  assert.strictEqual(
    extractOutput('<tonal_output>Hello world</tonal_output>'),
    'Hello world'
  );

  // Case 2: XML wrapping with preamble and postamble
  assert.strictEqual(
    extractOutput('Here is your text: <tonal_output>Hello world</tonal_output>\nHope this helps!'),
    'Hello world'
  );

  // Case 3: Space inside tags and newlines
  assert.strictEqual(
    extractOutput('<tonal_output>\n  Hello world\n</tonal_output>'),
    'Hello world'
  );
});

test('extractOutput - Viewport-Aware Colon Bug (Regression Test)', () => {
  // Case 4: The meeting colon bug (would get truncated to "00 PM." under legacy regex)
  assert.strictEqual(
    extractOutput('The meeting is scheduled at 3:00 PM.'),
    'The meeting is scheduled at 3:00 PM.'
  );

  assert.strictEqual(
    extractOutput('This is the message: please read it.'),
    'This is the message: please read it.'
  );
});

test('extractOutput - Fallback Legacy Regex Matching', () => {
  // Case 5: Actual preambles to strip (without XML tags)
  assert.strictEqual(
    extractOutput('Here is the rewritten message: Hello world'),
    'Hello world'
  );

  assert.strictEqual(
    extractOutput('Certainly! Here is the revised output:\nHello world'),
    'Hello world'
  );

  // Case 6: Stripping accidental quotes
  assert.strictEqual(
    extractOutput('"Hello world"'),
    'Hello world'
  );
});

test('extractOutput - Platform Examples Parse Validation', () => {
  // Gmail Example
  assert.strictEqual(
    extractOutput('<tonal_output>Could you please share the document we discussed yesterday?</tonal_output>'),
    'Could you please share the document we discussed yesterday?'
  );

  // Slack Example with preambles
  assert.strictEqual(
    extractOutput('Here is the Slack chat rewrite:\n<tonal_output>Deployed to production 10 minutes ago. Everything is looking good.</tonal_output>'),
    'Deployed to production 10 minutes ago. Everything is looking good.'
  );

  // LinkedIn Example
  assert.strictEqual(
    extractOutput('<tonal_output>I discovered your profile through a mutual connection and was impressed by your background.</tonal_output>'),
    'I discovered your profile through a mutual connection and was impressed by your background.'
  );

  // Decoder Example
  assert.strictEqual(
    extractOutput('The decoded plain translation is:\n<tonal_output>We are understaffed and need to work faster to make the client happy.</tonal_output>'),
    'We are understaffed and need to work faster to make the client happy.'
  );
});
