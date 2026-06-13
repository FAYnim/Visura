import assert from 'node:assert/strict';
import {
  ARTICLE_LENGTHS,
  SUPPORTED_ARTICLE_LANGUAGES,
  buildArticlePrompt,
  normalizeArticleOutput
} from '../server/ai/article/promptBuilder.js';

assert.deepEqual(SUPPORTED_ARTICLE_LANGUAGES, ['Indonesia', 'English']);
assert.deepEqual(Object.keys(ARTICLE_LENGTHS), ['short', 'medium', 'long']);
assert.equal(ARTICLE_LENGTHS.short.label, '600–900 words');
assert.equal(ARTICLE_LENGTHS.medium.label, '1000–1500 words');
assert.equal(ARTICLE_LENGTHS.long.label, '1800–2500 words');

const template = {
  id: 'problem-solution',
  name: 'Problem & Solution',
  description: 'Case-study article',
  body: 'Write a {length} article in {language} for this project:\n{projectInfo}\nEnd in {language}.'
};

const { systemPrompt, userPrompt } = buildArticlePrompt({
  template,
  projectInfo: 'Visura helps founders create portfolio content from project documents.',
  language: 'English',
  length: 'medium'
});

assert.match(systemPrompt, /expert project storyteller/);
assert.match(systemPrompt, /not a news article/i);
assert.match(systemPrompt, /Return ONLY valid JSON/);
assert.match(systemPrompt, /title/);
assert.match(systemPrompt, /excerpt/);
assert.match(systemPrompt, /articleMarkdown/);
assert.match(systemPrompt, /no unsupported claims/i);
assert.match(userPrompt, /1000–1500 words/);
assert.match(userPrompt, /English/);
assert.match(userPrompt, /Visura helps founders/);
assert.doesNotMatch(userPrompt, /\{projectInfo\}|\{language\}|\{length\}/);

assert.deepEqual(
  normalizeArticleOutput({
    title: '  Build Better Project Stories  ',
    excerpt: '  A short article summary.  ',
    articleMarkdown: '  # Build Better Project Stories\n\nBody copy.  '
  }),
  {
    title: 'Build Better Project Stories',
    excerpt: 'A short article summary.',
    articleMarkdown: '# Build Better Project Stories\n\nBody copy.'
  }
);

assert.throws(
  () => buildArticlePrompt({ template, projectInfo: '', language: 'English', length: 'short' }),
  /Project information is required/
);

assert.throws(
  () => buildArticlePrompt({ template, projectInfo: 'Valid info', language: 'Spanish', length: 'short' }),
  /Unsupported article language: Spanish/
);

assert.throws(
  () => buildArticlePrompt({ template, projectInfo: 'Valid info', language: 'English', length: 'giant' }),
  /Unsupported article length: giant/
);

assert.throws(
  () => buildArticlePrompt({ template: { ...template, body: 'Missing placeholders' }, projectInfo: 'Valid info', language: 'English', length: 'short' }),
  /Template is missing required article placeholders/
);

assert.throws(
  () => normalizeArticleOutput({ title: '', excerpt: 'Summary', articleMarkdown: '# Article' }),
  /Article title is required/
);

assert.throws(
  () => normalizeArticleOutput({ title: 'Title', excerpt: '', articleMarkdown: '# Article' }),
  /Article excerpt is required/
);

assert.throws(
  () => normalizeArticleOutput({ title: 'Title', excerpt: 'Summary', articleMarkdown: '' }),
  /Article markdown is required/
);

console.log('\n✅ Article prompt builder tests passed!');
