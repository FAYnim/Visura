import { buildCaptionPrompt, normalizeCaptionOutput } from './captionPromptBuilder.js';
import { callGemini, callGroq, callWithRepair, getModelOrThrow } from './autoFillService.js';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_KEY   = process.env.GROQ_API_KEY   || '';

const PROVIDER_MAP = {
  gemini: callGemini,
  groq:   callGroq,
};

async function generateCaptionFromSources({ brief, docText }, modelId, byokKey = null) {
  const { systemPrompt, userPrompt } = buildCaptionPrompt({ brief, docText });
  const model = getModelOrThrow(modelId, byokKey);
  const callFn = PROVIDER_MAP[model.provider];
  if (!callFn) {
    throw new Error(`Unknown provider: ${model.provider}`);
  }

  const envKey = model.provider === 'gemini' ? GEMINI_KEY : GROQ_KEY;
  const effectiveKey = byokKey || envKey;
  if (!effectiveKey) {
    throw new Error(`No API key available for ${model.provider}. Configure it in Settings → API Keys or set the ENV variable.`);
  }

  const source = byokKey ? 'BYOK' : 'ENV';
  console.log(`[captionService] Generating caption with: ${model.label} (${model.id}) [key: ${source}]`);
  const raw = await callWithRepair(callFn, systemPrompt, userPrompt, model.modelName, effectiveKey);
  return normalizeCaptionOutput(raw);
}

export { generateCaptionFromSources };
