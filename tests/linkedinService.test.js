import assert from 'node:assert/strict';
import {
  combineProjectInfo,
  generateLinkedinPostFromSources
} from '../server/ai/linkedin/service.js';

assert.equal(
  combineProjectInfo({ brief: 'Build story', docText: 'Document details' }),
  'PROJECT BRIEF:\nBuild story\n\n---\n\nDOCUMENT CONTENT:\nDocument details'
);

assert.equal(combineProjectInfo({ brief: 'Only brief', docText: '' }), 'PROJECT BRIEF:\nOnly brief');
assert.equal(combineProjectInfo({ brief: '', docText: 'Only doc' }), 'DOCUMENT CONTENT:\nOnly doc');

assert.throws(
  () => combineProjectInfo({ brief: '', docText: '   ' }),
  /Project information is required/
);

let capturedCall;
const result = await generateLinkedinPostFromSources({
  brief: 'Visura turns briefs into polished LinkedIn posts.',
  docText: 'Target users are Indonesian founders and product builders.',
  styleId: 'builder-story',
  language: 'Indonesia',
  modelId: 'gemini-2.5-flash',
  byokKey: 'test-key',
  aiCaller: async args => {
    capturedCall = args;
    return { post: '  Hari ini kami membangun Visura.\nDari dokumen jadi cerita produk.  ' };
  }
});

assert.deepEqual(result, {
  post: 'Hari ini kami membangun Visura.\nDari dokumen jadi cerita produk.',
  style: {
    id: 'builder-story',
    name: 'Build in Public',
    description: 'Transparent build progress, milestones, challenges, and future plans.'
  },
  language: 'Indonesia'
});

assert.equal(capturedCall.model.id, 'gemini-2.5-flash');
assert.equal(capturedCall.model.modelName, 'gemini-2.5-flash');
assert.equal(capturedCall.apiKey, 'test-key');
assert.match(capturedCall.systemPrompt, /expert LinkedIn content strategist/);
assert.match(capturedCall.userPrompt, /PROJECT BRIEF/);
assert.match(capturedCall.userPrompt, /DOCUMENT CONTENT/);
assert.match(capturedCall.userPrompt, /Indonesia/);
assert.doesNotMatch(capturedCall.userPrompt, /\{projectInfo\}|\{language\}/);

await assert.rejects(
  () => generateLinkedinPostFromSources({
    brief: '',
    docText: '',
    styleId: 'builder-story',
    language: 'Indonesia',
    modelId: 'gemini-2.5-flash',
    byokKey: 'test-key',
    aiCaller: async () => ({ post: 'Should not run' })
  }),
  /Project information is required/
);

const originalGeminiKey = process.env.GEMINI_API_KEY;
let missingKeyAiCallerCalled = false;
try {
  delete process.env.GEMINI_API_KEY;

  await assert.rejects(
    () => generateLinkedinPostFromSources({
      brief: 'Valid brief',
      docText: '',
      styleId: 'builder-story',
      language: 'Indonesia',
      modelId: 'gemini-2.5-flash',
      aiCaller: async () => {
        missingKeyAiCallerCalled = true;
        return { post: 'Should not run' };
      }
    }),
    /No API key available/
  );

  assert.equal(missingKeyAiCallerCalled, false);
} finally {
  if (originalGeminiKey === undefined) {
    delete process.env.GEMINI_API_KEY;
  } else {
    process.env.GEMINI_API_KEY = originalGeminiKey;
  }
}

console.log('\n✅ LinkedIn service tests passed!');
