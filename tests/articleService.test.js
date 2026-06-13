import assert from 'node:assert/strict';
import {
  combineArticleProjectInfo,
  generateArticleFromSources,
  renderArticleMarkdown
} from '../server/ai/article/service.js';

assert.equal(
  combineArticleProjectInfo({ brief: 'Build story', docText: 'Document details' }),
  'PROJECT BRIEF:\nBuild story\n\n---\n\nDOCUMENT CONTENT:\nDocument details'
);

assert.equal(combineArticleProjectInfo({ brief: 'Only brief', docText: '' }), 'PROJECT BRIEF:\nOnly brief');
assert.equal(combineArticleProjectInfo({ brief: '', docText: 'Only doc' }), 'DOCUMENT CONTENT:\nOnly doc');

assert.throws(
  () => combineArticleProjectInfo({ brief: '', docText: '   ' }),
  /Project information is required/
);

assert.equal(renderArticleMarkdown('# Title\n\nBody copy.'), '<h1>Title</h1>\n<p>Body copy.</p>\n');
assert.throws(() => renderArticleMarkdown(''), /Article markdown is required/);

let capturedCall;
const result = await generateArticleFromSources({
  brief: 'Visura turns briefs into polished project articles.',
  docText: 'Target users are Indonesian founders and product builders.',
  styleId: 'product-launching',
  language: 'English',
  length: 'medium',
  modelId: 'gemini-2.5-flash',
  byokKey: 'test-key',
  aiCaller: async args => {
    capturedCall = args;
    return {
      title: '  Turning Project Work Into Stories  ',
      excerpt: '  A practical look at Visura.  ',
      articleMarkdown: '  # Turning Project Work Into Stories\n\nVisura helps builders publish better.  '
    };
  }
});

assert.equal(result.title, 'Turning Project Work Into Stories');
assert.equal(result.excerpt, 'A practical look at Visura.');
assert.equal(result.articleMarkdown, '# Turning Project Work Into Stories\n\nVisura helps builders publish better.');
assert.match(result.articleHtml, /<h1>Turning Project Work Into Stories<\/h1>/);
assert.deepEqual(result.style, {
  id: 'product-launching',
  name: 'Product Launching',
  description: 'Write an official launch article that introduces a project, explains its value, and invites readers to explore it.'
});
assert.equal(result.language, 'English');
assert.equal(result.length, 'medium');

assert.equal(capturedCall.model.id, 'gemini-2.5-flash');
assert.equal(capturedCall.apiKey, 'test-key');
assert.match(capturedCall.systemPrompt, /expert project storyteller/);
assert.match(capturedCall.userPrompt, /PROJECT BRIEF/);
assert.match(capturedCall.userPrompt, /DOCUMENT CONTENT/);
assert.match(capturedCall.userPrompt, /1000–1500 words/);
assert.doesNotMatch(capturedCall.userPrompt, /\{projectInfo\}|\{language\}|\{length\}/);

await assert.rejects(
  () => generateArticleFromSources({
    brief: '',
    docText: '',
    styleId: 'product-launching',
    language: 'English',
    length: 'short',
    modelId: 'gemini-2.5-flash',
    byokKey: 'test-key',
    aiCaller: async () => ({ title: 'No', excerpt: 'No', articleMarkdown: 'No' })
  }),
  /Project information is required/
);

const originalGeminiKey = process.env.GEMINI_API_KEY;
let missingKeyAiCallerCalled = false;
try {
  delete process.env.GEMINI_API_KEY;

  await assert.rejects(
    () => generateArticleFromSources({
      brief: 'Valid brief',
      docText: '',
      styleId: 'product-launching',
      language: 'English',
      length: 'short',
      modelId: 'gemini-2.5-flash',
      aiCaller: async () => {
        missingKeyAiCallerCalled = true;
        return { title: 'Should not run', excerpt: 'Should not run', articleMarkdown: 'Should not run' };
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

console.log('\n✅ Article service tests passed!');
