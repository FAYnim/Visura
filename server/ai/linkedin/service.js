import {
  callGemini,
  callGroq,
  callWithRepair,
  getModelOrThrow
} from '../autoFillService.js';
import { buildLinkedinPrompt, normalizeLinkedinOutput } from './promptBuilder.js';
import { loadLinkedinTemplate } from './templateLoader.js';

const PROVIDER_MAP = {
  gemini: callGemini,
  groq: callGroq
};

function combineProjectInfo({ brief, docText }) {
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

async function defaultAiCaller({ systemPrompt, userPrompt, model, apiKey }) {
  const callFn = PROVIDER_MAP[model.provider];

  if (!callFn) {
    throw new Error(`Unknown provider: ${model.provider}`);
  }

  return callWithRepair(callFn, systemPrompt, userPrompt, model.modelName, apiKey);
}

async function generateLinkedinPostFromSources({
  brief,
  docText,
  styleId,
  language,
  modelId,
  byokKey = null,
  aiCaller = defaultAiCaller
}) {
  const projectInfo = combineProjectInfo({ brief, docText });
  const template = loadLinkedinTemplate(styleId);
  const { systemPrompt, userPrompt } = buildLinkedinPrompt({ template, projectInfo, language });
  const model = getModelOrThrow(modelId, byokKey);
  const envKey = model.provider === 'gemini' ? process.env.GEMINI_API_KEY : process.env.GROQ_API_KEY;
  const apiKey = byokKey || envKey || '';
  const raw = await aiCaller({ systemPrompt, userPrompt, model, apiKey });
  const { post } = normalizeLinkedinOutput(raw);

  return {
    post,
    style: {
      id: template.id,
      name: template.name,
      description: template.description
    },
    language
  };
}

export {
  combineProjectInfo,
  defaultAiCaller,
  generateLinkedinPostFromSources
};
