import MarkdownIt from 'markdown-it';
import {
  callGemini,
  callGroq,
  callWithRepair,
  getModelOrThrow
} from '../autoFillService.js';
import { buildArticlePrompt, normalizeArticleOutput } from './promptBuilder.js';
import { loadArticleTemplate } from './templateLoader.js';

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

const PROVIDER_MAP = {
  gemini: callGemini,
  groq: callGroq
};

function combineArticleProjectInfo({ brief, docText }) {
  const parts = [];

  if (typeof brief === 'string' && brief.trim()) {
    parts.push(`PROJECT BRIEF:\n${brief.trim()}`);
  }

  if (typeof docText === 'string' && docText.trim()) {
    parts.push(`DOCUMENT CONTENT:\n${docText.trim()}`);
  }

  if (!parts.length) {
    throw new Error('Project information is required');
  }

  return parts.join('\n\n---\n\n');
}

function renderArticleMarkdown(articleMarkdown) {
  if (typeof articleMarkdown !== 'string' || !articleMarkdown.trim()) {
    throw new Error('Article markdown is required');
  }

  return markdown.render(articleMarkdown.trim());
}

async function defaultArticleAiCaller({ systemPrompt, userPrompt, model, apiKey }) {
  const callFn = PROVIDER_MAP[model.provider];

  if (!callFn) {
    throw new Error(`Unknown provider: ${model.provider}`);
  }

  return callWithRepair(callFn, systemPrompt, userPrompt, model.modelName, apiKey);
}

async function generateArticleFromSources({
  brief,
  docText,
  styleId,
  language,
  length,
  modelId,
  byokKey = null,
  aiCaller = defaultArticleAiCaller
}) {
  const projectInfo = combineArticleProjectInfo({ brief, docText });
  const template = loadArticleTemplate(styleId);
  const { systemPrompt, userPrompt } = buildArticlePrompt({ template, projectInfo, language, length });
  const model = getModelOrThrow(modelId, byokKey || 'article-key-check');
  const envKey = model.provider === 'gemini' ? process.env.GEMINI_API_KEY : process.env.GROQ_API_KEY;
  const effectiveKey = byokKey || envKey;

  if (!effectiveKey) {
    throw new Error(`No API key available for ${model.provider}. Configure it in Settings → API Keys or set the ENV variable.`);
  }

  const raw = await aiCaller({ systemPrompt, userPrompt, model, apiKey: effectiveKey });
  const article = normalizeArticleOutput(raw);
  const articleHtml = renderArticleMarkdown(article.articleMarkdown);

  return {
    ...article,
    articleHtml,
    style: {
      id: template.id,
      name: template.name,
      description: template.description
    },
    language,
    length
  };
}

export {
  combineArticleProjectInfo,
  defaultArticleAiCaller,
  generateArticleFromSources,
  renderArticleMarkdown
};
