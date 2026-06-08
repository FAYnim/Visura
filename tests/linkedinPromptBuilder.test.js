import assert from 'node:assert/strict';
import {
  SUPPORTED_LINKEDIN_LANGUAGES,
  buildLinkedinPrompt,
  normalizeLinkedinOutput
} from '../server/ai/linkedin/promptBuilder.js';

assert.deepEqual(SUPPORTED_LINKEDIN_LANGUAGES, ['Indonesia', 'English']);

const template = {
  id: 'builder-story',
  name: 'Builder Story',
  description: 'Founder-style build narrative',
  body: 'Write in {language} for this project:\n{projectInfo}\nEnd in {language}.'
};

const { systemPrompt, userPrompt } = buildLinkedinPrompt({
  template,
  projectInfo: 'Visura helps founders create portfolio content from project documents in Indonesia.',
  language: 'Indonesia'
});

assert.match(systemPrompt, /expert LinkedIn content strategist/);
assert.match(systemPrompt, /Return ONLY valid JSON/);
assert.match(systemPrompt, /output format specified in the template/);
assert.match(systemPrompt, /one final post/i);
assert.match(systemPrompt, /preserve line breaks/i);
assert.match(systemPrompt, /no unsupported claims/i);
assert.match(userPrompt, /Indonesia/);
assert.match(userPrompt, /Visura helps founders/);
assert.match(userPrompt, /portfolio content/);
assert.doesNotMatch(userPrompt, /\{projectInfo\}|\{language\}/);

assert.deepEqual(normalizeLinkedinOutput({ post: '  First line\nSecond line  ' }), { post: 'First line\nSecond line' });

assert.throws(
  () => buildLinkedinPrompt({ template, projectInfo: '', language: 'Indonesia' }),
  /Project information is required/
);

assert.throws(
  () => buildLinkedinPrompt({ template, projectInfo: 'Valid info', language: 'Spanish' }),
  /Unsupported LinkedIn language: Spanish/
);

assert.throws(
  () => buildLinkedinPrompt({ template: { ...template, body: 'Missing placeholders' }, projectInfo: 'Valid info', language: 'English' }),
  /Template is missing required LinkedIn placeholders/
);

assert.throws(
  () => normalizeLinkedinOutput({ post: '' }),
  /LinkedIn post is required/
);

assert.throws(
  () => normalizeLinkedinOutput({ post: 123 }),
  /LinkedIn post is required/
);

console.log('\n✅ LinkedIn prompt builder tests passed!');
