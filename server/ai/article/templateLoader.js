import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_ARTICLE_PLACEHOLDERS = ['{projectInfo}', '{language}', '{length}'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, 'templates');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    throw new Error('Template frontmatter is required');
  }

  const [, frontmatter, body] = match;
  const metadata = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    metadata[key] = value;
  }

  return { ...metadata, body: body.trim() };
}

function validateArticleTemplate(template) {
  for (const field of ['id', 'name', 'description', 'body']) {
    if (typeof template[field] !== 'string' || !template[field].trim()) {
      throw new Error(`Template "${template.id || 'unknown'}" is missing required field: ${field}`);
    }
  }

  for (const placeholder of REQUIRED_ARTICLE_PLACEHOLDERS) {
    if (!template.body.includes(placeholder)) {
      throw new Error(`Template "${template.id}" is missing placeholder: ${placeholder}`);
    }
  }

  return template;
}

function parseArticleTemplate(content) {
  return validateArticleTemplate(parseFrontmatter(content));
}

function templatePath(id) {
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error(`Unknown article template: ${id}`);
  }

  return path.join(templatesDir, `${id}.md`);
}

function loadArticleTemplate(id) {
  const filePath = templatePath(id);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Unknown article template: ${id}`);
  }

  const template = parseArticleTemplate(fs.readFileSync(filePath, 'utf8'));

  if (template.id !== id) {
    throw new Error(`Template id mismatch: expected ${id}, got ${template.id}`);
  }

  return template;
}

function listArticleTemplates() {
  return fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.md'))
    .map(file => loadArticleTemplate(path.basename(file, '.md')))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name, description }) => ({ id, name, description }));
}

export {
  REQUIRED_ARTICLE_PLACEHOLDERS,
  listArticleTemplates,
  loadArticleTemplate,
  parseFrontmatter,
  parseArticleTemplate,
  validateArticleTemplate
};
