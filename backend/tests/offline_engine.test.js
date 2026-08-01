import test from 'node:test';
import assert from 'node:assert';

// Extract OfflineToneEngine rules from content.js structure for standalone unit testing
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

test('OfflineToneEngine — Formal Tone Word Swaps', () => {
  const input = "I wanna gonna gotta fix this stuff and touch base with ya";
  const output = OfflineToneEngine.apply(input, 'formal');
  assert.strictEqual(output, "I want to going to have to resolve this items and follow up with you");
});

test('OfflineToneEngine — Casual Tone Swaps', () => {
  const input = "I would like to utilize this tool and commence the process";
  const output = OfflineToneEngine.apply(input, 'casual');
  assert.strictEqual(output, "I'd love to use this tool and start the process");
});

test('OfflineToneEngine — Space Collapsing on Empty Replacements', () => {
  const input = "I just basically literally actually want to talk";
  const output = OfflineToneEngine.apply(input, 'formal');
  assert.strictEqual(output, "I want to discuss");
});

test('OfflineToneEngine — Fallback to workChat on invalid tone key', () => {
  const input = "I wanna utilize this tool";
  const output = OfflineToneEngine.apply(input, 'invalid_tone_key');
  assert.strictEqual(output, "I want to use this tool");
});
