import assert from 'node:assert/strict';

const hadGeminiKey = !!process.env.GEMINI_API_KEY;
if (!hadGeminiKey) process.env.GEMINI_API_KEY = 'test-key-for-test';

const { validateLinkedinGenerateRequest } = await import('../server/routes/linkedin.js');

assert.equal(
  validateLinkedinGenerateRequest({
    brief: 'Built a portfolio generator for founders.',
    styleId: 'builder-story',
    language: 'English',
    modelId: 'gemini-2.5-flash'
  }),
  '',
  'valid LinkedIn route-facing input should pass'
);

assert.equal(
  validateLinkedinGenerateRequest({
    brief: 'Built a portfolio generator for founders.',
    styleId: 'builder-story',
    language: 'English',
    modelId: 'unsupported-model'
  }),
  'Valid model ID is required.'
);

assert.equal(
  validateLinkedinGenerateRequest({
    brief: 'Built a portfolio generator for founders.',
    styleId: 'missing-style',
    language: 'English',
    modelId: 'gemini-2.5-flash'
  }),
  'Valid LinkedIn style is required.'
);

assert.equal(
  validateLinkedinGenerateRequest({
    brief: '',
    docText: '',
    styleId: 'builder-story',
    language: 'English',
    modelId: 'gemini-2.5-flash'
  }),
  'Provide at least a brief or a document file.'
);

if (!hadGeminiKey) delete process.env.GEMINI_API_KEY;

console.log('\n✅ LinkedIn route validation tests passed!');
