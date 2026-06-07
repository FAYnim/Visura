import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REQUIRED_LINKEDIN_PLACEHOLDERS,
  listLinkedinTemplates,
  loadLinkedinTemplate,
  parseLinkedinTemplate,
  validateLinkedinTemplate
} from '../server/ai/linkedin/templateLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', 'server', 'ai', 'linkedin', 'templates');

assert.deepEqual(REQUIRED_LINKEDIN_PLACEHOLDERS, ['{projectInfo}', '{language}']);

const parsed = parseLinkedinTemplate(`---
id: builder-story
name: Builder Story
description: Founder-style build narrative
---
Write in {language} using this project info:\n{projectInfo}`);

assert.equal(parsed.id, 'builder-story');
assert.equal(parsed.name, 'Builder Story');
assert.equal(parsed.description, 'Founder-style build narrative');
assert.match(parsed.body, /\{projectInfo\}/);
assert.match(parsed.body, /\{language\}/);

const crlfParsed = parseLinkedinTemplate('---\r\nid: crlf-template\r\nname: CRLF Template\r\ndescription: CRLF frontmatter\r\n---\r\nWrite in {language} with {projectInfo}');
assert.equal(crlfParsed.id, 'crlf-template');

assert.throws(
  () => validateLinkedinTemplate({ name: 'Bad', description: 'Bad template', body: 'Write in {language} with {projectInfo}' }),
  /Template "unknown" is missing required field: id/
);

assert.throws(
  () => validateLinkedinTemplate({ id: 'bad', description: 'Bad template', body: 'Write in {language} with {projectInfo}' }),
  /Template "bad" is missing required field: name/
);

assert.throws(
  () => validateLinkedinTemplate({ id: 'bad', name: 'Bad', body: 'Write in {language} with {projectInfo}' }),
  /Template "bad" is missing required field: description/
);

assert.throws(
  () => validateLinkedinTemplate({ id: 'bad', name: 'Bad', description: 'Bad template', body: '' }),
  /Template "bad" is missing required field: body/
);

assert.throws(
  () => parseLinkedinTemplate('Write using {projectInfo} and {language}'),
  /Template frontmatter is required/
);

assert.throws(
  () => validateLinkedinTemplate({ id: 'bad', name: 'Bad', description: 'Bad template', body: 'Missing language {projectInfo}' }),
  /Template "bad" is missing placeholder: \{language\}/
);

const templates = listLinkedinTemplates();
assert.equal(templates.length, 5);
assert.deepEqual(
  templates.map(template => template.id).sort(),
  ['builder-story', 'lessons-learned', 'problem-solution', 'product-launch', 'technical-breakdown']
);
assert.ok(templates.every(template => template.name && template.description));
assert.ok(templates.every(template => !template.body));

const loaded = loadLinkedinTemplate('technical-breakdown');
assert.equal(loaded.id, 'technical-breakdown');
assert.match(loaded.body, /\{projectInfo\}/);
assert.match(loaded.body, /\{language\}/);

assert.throws(
  () => loadLinkedinTemplate('missing-style'),
  /Unknown LinkedIn template: missing-style/
);

for (const styleId of ['../x', 'x/y', '%2e%2e']) {
  assert.throws(
    () => loadLinkedinTemplate(styleId),
    new RegExp(`Unknown LinkedIn template: ${styleId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
  );
}

const mismatchPath = path.join(templatesDir, 'mismatch-test.md');
try {
  fs.writeFileSync(mismatchPath, `---
id: different-id
name: Mismatch Test
description: Mismatched id test
---
Write in {language} with {projectInfo}`);

  assert.throws(
    () => loadLinkedinTemplate('mismatch-test'),
    /Template id mismatch: expected mismatch-test, got different-id/
  );
} finally {
  fs.rmSync(mismatchPath, { force: true });
}

console.log('\n✅ LinkedIn template loader tests passed!');
