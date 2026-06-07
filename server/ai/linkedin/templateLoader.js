import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_LINKEDIN_PLACEHOLDERS = ['{projectInfo}', '{language}'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, 'templates');

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) {
    throw new Error('Template frontmatter is required');
  }

  const endIndex = content.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    throw new Error('Template frontmatter is required');
  }

  const frontmatter = content.slice(4, endIndex);
  const body = content.slice(endIndex + 5).trim();
  const metadata = {};

  for (const line of frontmatter.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    metadata[key] = value;
  }

  return { ...metadata, body };
}

function validateLinkedinTemplate(template) {
  for (const placeholder of REQUIRED_LINKEDIN_PLACEHOLDERS) {
    if (!template.body.includes(placeholder)) {
      throw new Error(`Template "${template.id}" is missing placeholder: ${placeholder}`);
    }
  }

  return template;
}

function parseLinkedinTemplate(content) {
  return validateLinkedinTemplate(parseFrontmatter(content));
}

function templatePath(id) {
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error(`Unknown LinkedIn template: ${id}`);
  }

  return path.join(templatesDir, `${id}.md`);
}

function loadLinkedinTemplate(id) {
  const filePath = templatePath(id);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Unknown LinkedIn template: ${id}`);
  }

  return parseLinkedinTemplate(fs.readFileSync(filePath, 'utf8'));
}

function listLinkedinTemplates() {
  return fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.md'))
    .map(file => loadLinkedinTemplate(path.basename(file, '.md')))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name, description }) => ({ id, name, description }));
}

export {
  REQUIRED_LINKEDIN_PLACEHOLDERS,
  listLinkedinTemplates,
  loadLinkedinTemplate,
  parseFrontmatter,
  parseLinkedinTemplate,
  validateLinkedinTemplate
};
