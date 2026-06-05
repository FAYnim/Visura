import assert from 'node:assert/strict';
import { buildCaptionPrompt, normalizeCaptionOutput } from '../server/ai/captionPromptBuilder.js';

const { systemPrompt, userPrompt } = buildCaptionPrompt({
  brief: 'Visura helps creators generate carousel copy.',
  docText: 'Premium portfolio carousel generator.'
});

assert.match(systemPrompt, /Instagram caption copywriter/);
assert.match(systemPrompt, /"caption": ""/);
assert.equal((systemPrompt.match(/OUTPUT EXAMPLE:/g) || []).length, 1);
assert.match(userPrompt, /PROJECT BRIEF:\nVisura helps creators generate carousel copy\./);
assert.match(userPrompt, /DOCUMENT CONTENT:\nPremium portfolio carousel generator\./);

assert.equal(
  normalizeCaptionOutput({ caption: '  Clean caption.  ' }).caption,
  'Clean caption.'
);

assert.throws(
  () => normalizeCaptionOutput({ caption: '' }),
  /Caption response is empty/
);

assert.throws(
  () => normalizeCaptionOutput({ caption: 123 }),
  /Caption response is invalid/
);

console.log('\n✅ Caption prompt builder tests passed!');
