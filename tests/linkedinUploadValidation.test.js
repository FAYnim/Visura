import assert from 'node:assert/strict';

const hadGeminiKey = !!process.env.GEMINI_API_KEY;
if (!hadGeminiKey) process.env.GEMINI_API_KEY = 'test-key-for-test';

const {
  isLinkedinDocumentFileSupported,
  isLinkedinLanguageSupported
} = await import('../server/routes/linkedin.js');

assert.equal(
  isLinkedinDocumentFileSupported({ mimetype: 'application/octet-stream', originalname: 'payload.exe' }),
  false
);

assert.equal(
  isLinkedinDocumentFileSupported({ mimetype: 'text/plain', originalname: 'brief.txt' }),
  false
);

assert.equal(
  isLinkedinDocumentFileSupported({ mimetype: 'text/plain', originalname: 'brief.md' }),
  true
);

assert.equal(
  isLinkedinDocumentFileSupported({ mimetype: 'text/markdown', originalname: 'brief.markdown' }),
  true
);

assert.equal(
  isLinkedinDocumentFileSupported({ mimetype: 'application/pdf', originalname: 'brief.pdf' }),
  true
);

assert.equal(
  isLinkedinDocumentFileSupported({ mimetype: 'application/octet-stream', originalname: 'brief.pdf' }),
  false
);

assert.equal(isLinkedinLanguageSupported('Indonesia'), true);
assert.equal(isLinkedinLanguageSupported('English'), true);
assert.equal(isLinkedinLanguageSupported('Spanish'), false);
assert.equal(isLinkedinLanguageSupported(''), false);

if (!hadGeminiKey) delete process.env.GEMINI_API_KEY;

console.log('\n✅ LinkedIn upload validation tests passed!');
