import assert from 'node:assert/strict';
import { copyArticleMarkdown, hasGeneratedArticle } from '../public/js/articleActions.js';

assert.equal(hasGeneratedArticle({ articleMarkdown: '# Title' }), true);
assert.equal(hasGeneratedArticle({ articleMarkdown: '   ' }), false);
assert.equal(hasGeneratedArticle({}), false);
assert.equal(hasGeneratedArticle(null), false);

const calls = [];
const clipboard = {
  writeText: async value => calls.push(value)
};

assert.equal(await copyArticleMarkdown({ articleMarkdown: '  # Article\n\nBody.  ', clipboard }), true);
assert.deepEqual(calls, ['# Article\n\nBody.']);

assert.equal(await copyArticleMarkdown({ articleMarkdown: '', clipboard }), false);
assert.deepEqual(calls, ['# Article\n\nBody.']);

await assert.rejects(
  () => copyArticleMarkdown({ articleMarkdown: '# Article', clipboard: null }),
  /Clipboard is unavailable/
);

console.log('\n✅ Article actions tests passed!');
