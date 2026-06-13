import assert from 'node:assert/strict';
import { isArticleDocumentFileSupported } from '../server/routes/article.js';

assert.equal(isArticleDocumentFileSupported({ originalname: 'case-study.md', mimetype: 'text/markdown' }), true);
assert.equal(isArticleDocumentFileSupported({ originalname: 'case-study.markdown', mimetype: 'text/plain' }), true);
assert.equal(isArticleDocumentFileSupported({ originalname: 'case-study.pdf', mimetype: 'application/pdf' }), true);
assert.equal(isArticleDocumentFileSupported({ originalname: 'case-study.txt', mimetype: 'text/plain' }), false);
assert.equal(isArticleDocumentFileSupported({ originalname: 'case-study.md', mimetype: 'application/json' }), false);
assert.equal(isArticleDocumentFileSupported({ originalname: 'case-study.pdf', mimetype: 'application/octet-stream' }), false);
assert.equal(isArticleDocumentFileSupported({ originalname: '../case-study.md', mimetype: 'text/markdown' }), true);

console.log('\n✅ Article upload validation tests passed!');
