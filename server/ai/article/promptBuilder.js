const SUPPORTED_ARTICLE_LANGUAGES = ['Indonesia', 'English'];
const ARTICLE_LENGTHS = {
  short: { label: '600–900 words' },
  medium: { label: '1000–1500 words' },
  long: { label: '1800–2500 words' }
};
const REQUIRED_PLACEHOLDERS = ['{projectInfo}', '{language}', '{length}'];

function assertProjectInfo(projectInfo) {
  if (typeof projectInfo !== 'string' || !projectInfo.trim()) {
    throw new Error('Project information is required');
  }
}

function assertLanguage(language) {
  if (!SUPPORTED_ARTICLE_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported article language: ${language}`);
  }
}

function assertLength(length) {
  if (!ARTICLE_LENGTHS[length]) {
    throw new Error(`Unsupported article length: ${length}`);
  }
}

function assertTemplate(template) {
  if (!template || typeof template.body !== 'string' || REQUIRED_PLACEHOLDERS.some(placeholder => !template.body.includes(placeholder))) {
    throw new Error('Template is missing required article placeholders');
  }
}

function buildArticlePrompt({ template, projectInfo, language, length }) {
  assertProjectInfo(projectInfo);
  assertLanguage(language);
  assertLength(length);
  assertTemplate(template);

  const systemPrompt = `You are an expert project storyteller and portfolio article editor.

Return ONLY valid JSON with exactly these keys: title, excerpt, articleMarkdown.

Rules:
1. Write a project article, not a news article.
2. Use Markdown in articleMarkdown.
3. Make the article useful for builders, founders, designers, or technical readers.
4. Use only the provided project information; make no unsupported claims.
5. If the source lacks a detail, omit that detail instead of inventing it.
6. Do not include markdown fences, explanations, alternatives, or extra JSON keys.`;

  const userPrompt = template.body
    .replaceAll('{projectInfo}', projectInfo.trim())
    .replaceAll('{language}', language)
    .replaceAll('{length}', ARTICLE_LENGTHS[length].label);

  return { systemPrompt, userPrompt };
}

function normalizeArticleOutput(raw) {
  if (!raw || typeof raw.title !== 'string' || !raw.title.trim()) {
    throw new Error('Article title is required');
  }

  if (typeof raw.excerpt !== 'string' || !raw.excerpt.trim()) {
    throw new Error('Article excerpt is required');
  }

  if (typeof raw.articleMarkdown !== 'string' || !raw.articleMarkdown.trim()) {
    throw new Error('Article markdown is required');
  }

  return {
    title: raw.title.trim(),
    excerpt: raw.excerpt.trim(),
    articleMarkdown: raw.articleMarkdown.trim()
  };
}

export {
  ARTICLE_LENGTHS,
  SUPPORTED_ARTICLE_LANGUAGES,
  buildArticlePrompt,
  normalizeArticleOutput
};
