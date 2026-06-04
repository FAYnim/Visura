import assert from 'node:assert/strict';

const hadGeminiKey = !!process.env.GEMINI_API_KEY;
if (!hadGeminiKey) process.env.GEMINI_API_KEY = 'test-key-for-test';

const { isCaptionDocumentFileSupported } = await import('../server/routes/autoFill.js');

assert.equal(
  isCaptionDocumentFileSupported({ mimetype: 'application/octet-stream', originalname: 'payload.exe' }),
  false
);

assert.equal(
  isCaptionDocumentFileSupported({ mimetype: 'text/plain', originalname: 'brief.txt' }),
  true
);

assert.equal(
  isCaptionDocumentFileSupported({ mimetype: 'application/octet-stream', originalname: 'brief.markdown' }),
  true
);

assert.equal(
  isCaptionDocumentFileSupported({ mimetype: 'application/pdf', originalname: 'brief.bin' }),
  true
);

if (!hadGeminiKey) delete process.env.GEMINI_API_KEY;

console.log('\n✅ Caption upload validation tests passed!');
