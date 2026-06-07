import assert from 'node:assert/strict';
import {
  REQUIRED_LINKEDIN_PLACEHOLDERS,
  listLinkedinTemplates,
  loadLinkedinTemplate,
  parseLinkedinTemplate,
  validateLinkedinTemplate
} from '../server/ai/linkedin/templateLoader.js';

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

assert.throws(
  () => parseLinkedinTemplate('Write using {projectInfo} and {language}'),
  /Template frontmatter is required/
);

assert.throws(
  () => validateLinkedinTemplate({ id: 'bad', name: 'Bad', description: '', body: 'Missing language {projectInfo}' }),
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

console.log('\n✅ LinkedIn template loader tests passed!');
