const SUPPORTED_LINKEDIN_LANGUAGES = ['Indonesia', 'English'];
const REQUIRED_PLACEHOLDERS = ['{projectInfo}', '{language}'];

function assertProjectInfo(projectInfo) {
  if (typeof projectInfo !== 'string' || !projectInfo.trim()) {
    throw new Error('Project information is required');
  }
}

function assertLanguage(language) {
  if (!SUPPORTED_LINKEDIN_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported LinkedIn language: ${language}`);
  }
}

function assertTemplate(template) {
  if (!template || typeof template.body !== 'string' || REQUIRED_PLACEHOLDERS.some(placeholder => !template.body.includes(placeholder))) {
    throw new Error('Template is missing required LinkedIn placeholders');
  }
}

function buildLinkedinPrompt({ template, projectInfo, language }) {
  assertProjectInfo(projectInfo);
  assertLanguage(language);
  assertTemplate(template);

  const systemPrompt = `You are an expert LinkedIn content strategist.

Return ONLY valid JSON following the output format specified in the template below.

Rules:
1. Write one final post only.
2. Preserve line breaks when they improve readability (use escaped \\n).
3. Make the post clear, credible, and suitable for LinkedIn.
4. Use only the provided project information; make no unsupported claims.
5. Do not include markdown fences, explanations, alternatives, or extra JSON keys.`;

  const userPrompt = template.body
    .replaceAll('{projectInfo}', projectInfo.trim())
    .replaceAll('{language}', language);

  return { systemPrompt, userPrompt };
}

function normalizeLinkedinOutput(raw) {
  if (!raw || typeof raw.post !== 'string' || !raw.post.trim()) {
    throw new Error('LinkedIn post is required');
  }

  return { post: raw.post.trim() };
}

export {
  SUPPORTED_LINKEDIN_LANGUAGES,
  buildLinkedinPrompt,
  normalizeLinkedinOutput
};
