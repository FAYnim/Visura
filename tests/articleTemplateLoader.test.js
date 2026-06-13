import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REQUIRED_ARTICLE_PLACEHOLDERS,
  listArticleTemplates,
  loadArticleTemplate,
  parseArticleTemplate,
  validateArticleTemplate
} from '../server/ai/article/templateLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', 'server', 'ai', 'article', 'templates');

assert.deepEqual(REQUIRED_ARTICLE_PLACEHOLDERS, ['{projectInfo}', '{language}', '{length}']);

const parsed = parseArticleTemplate(`---
id: problem-solution
name: Problem & Solution
description: Case-study article focused on problem and solution
---
Write a {length} article in {language} using this source:\n{projectInfo}`);

assert.equal(parsed.id, 'problem-solution');
assert.equal(parsed.name, 'Problem & Solution');
assert.equal(parsed.description, 'Case-study article focused on problem and solution');
assert.match(parsed.body, /\{projectInfo\}/);
assert.match(parsed.body, /\{language\}/);
assert.match(parsed.body, /\{length\}/);

const crlfParsed = parseArticleTemplate('---\r\nid: crlf-template\r\nname: CRLF Template\r\ndescription: CRLF frontmatter\r\n---\r\nWrite a {length} article in {language} with {projectInfo}');
assert.equal(crlfParsed.id, 'crlf-template');

assert.throws(
  () => validateArticleTemplate({ name: 'Bad', description: 'Bad template', body: 'Write a {length} article in {language} with {projectInfo}' }),
  /Template "unknown" is missing required field: id/
);

assert.throws(
  () => validateArticleTemplate({ id: 'bad', description: 'Bad template', body: 'Write a {length} article in {language} with {projectInfo}' }),
  /Template "bad" is missing required field: name/
);

assert.throws(
  () => validateArticleTemplate({ id: 'bad', name: 'Bad', body: 'Write a {length} article in {language} with {projectInfo}' }),
  /Template "bad" is missing required field: description/
);

assert.throws(
  () => validateArticleTemplate({ id: 'bad', name: 'Bad', description: 'Bad template', body: '' }),
  /Template "bad" is missing required field: body/
);

assert.throws(
  () => parseArticleTemplate('Write using {projectInfo}, {language}, and {length}'),
  /Template frontmatter is required/
);

assert.throws(
  () => validateArticleTemplate({ id: 'bad', name: 'Bad', description: 'Bad template', body: 'Missing length {projectInfo} {language}' }),
  /Template "bad" is missing placeholder: \{length\}/
);

const templates = listArticleTemplates();
assert.equal(templates.length, 4);
assert.deepEqual(
  templates.map(template => template.id).sort(),
  ['build-process', 'founder-story', 'problem-solution', 'technical-breakdown']
);
assert.ok(templates.every(template => template.name && template.description));
assert.ok(templates.every(template => !template.body));

const loaded = loadArticleTemplate('technical-breakdown');
assert.equal(loaded.id, 'technical-breakdown');
assert.match(loaded.body, /\{projectInfo\}/);
assert.match(loaded.body, /\{language\}/);
assert.match(loaded.body, /\{length\}/);

assert.throws(
  () => loadArticleTemplate('missing-style'),
  /Unknown article template: missing-style/
);

for (const styleId of ['../x', 'x/y', '%2e%2e']) {
  assert.throws(
    () => loadArticleTemplate(styleId),
    new RegExp(`Unknown article template: ${styleId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
  );
}

const mismatchPath = path.join(templatesDir, 'mismatch-test.md');
try {
  fs.writeFileSync(mismatchPath, `---
id: different-id
name: Mismatch Test
description: Mismatched id test
---
Write a {length} article in {language} with {projectInfo}`);

  assert.throws(
    () => loadArticleTemplate('mismatch-test'),
    /Template id mismatch: expected mismatch-test, got different-id/
  );
} finally {
  fs.rmSync(mismatchPath, { force: true });
}

console.log('\n✅ Article template loader tests passed!');
