import assert from 'node:assert/strict';

const hadGeminiKey = !!process.env.GEMINI_API_KEY;
if (!hadGeminiKey) process.env.GEMINI_API_KEY = 'test-key-for-test';

const {
  isArticleLanguageSupported,
  isArticleLengthSupported,
  validateArticleGenerateRequest
} = await import('../server/routes/article.js');

assert.equal(isArticleLanguageSupported('Indonesia'), true);
assert.equal(isArticleLanguageSupported('English'), true);
assert.equal(isArticleLanguageSupported('Spanish'), false);
assert.equal(isArticleLengthSupported('short'), true);
assert.equal(isArticleLengthSupported('medium'), true);
assert.equal(isArticleLengthSupported('long'), true);
assert.equal(isArticleLengthSupported('giant'), false);

assert.equal(
  validateArticleGenerateRequest({
    brief: 'Built a portfolio article generator for founders.',
    styleId: 'problem-solution',
    language: 'English',
    length: 'medium',
    modelId: 'gemini-2.5-flash'
  }),
  '',
  'valid article route-facing input should pass'
);

assert.equal(
  validateArticleGenerateRequest({
    brief: 'Built a portfolio article generator for founders.',
    styleId: 'problem-solution',
    language: 'English',
    length: 'medium',
    modelId: 'unsupported-model'
  }),
  'Valid model ID is required.'
);

assert.equal(
  validateArticleGenerateRequest({
    brief: 'Built a portfolio article generator for founders.',
    styleId: 'missing-style',
    language: 'English',
    length: 'medium',
    modelId: 'gemini-2.5-flash'
  }),
  'Valid article style is required.'
);

assert.equal(
  validateArticleGenerateRequest({
    brief: 'Built a portfolio article generator for founders.',
    styleId: 'problem-solution',
    language: 'Spanish',
    length: 'medium',
    modelId: 'gemini-2.5-flash'
  }),
  'Unsupported language. Choose Indonesia or English.'
);

assert.equal(
  validateArticleGenerateRequest({
    brief: 'Built a portfolio article generator for founders.',
    styleId: 'problem-solution',
    language: 'English',
    length: 'giant',
    modelId: 'gemini-2.5-flash'
  }),
  'Unsupported length. Choose short, medium, or long.'
);

assert.equal(
  validateArticleGenerateRequest({
    brief: '',
    docText: '',
    styleId: 'problem-solution',
    language: 'English',
    length: 'medium',
    modelId: 'gemini-2.5-flash'
  }),
  'Provide at least a brief or a document file.'
);

if (!hadGeminiKey) delete process.env.GEMINI_API_KEY;

console.log('\n✅ Article route validation tests passed!');
