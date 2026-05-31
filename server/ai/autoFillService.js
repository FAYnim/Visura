import { GoogleGenAI } from '@google/genai';
import { buildPrompt, normalizeOutput } from './promptBuilder.js';
import { MODELS } from './models.js';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_KEY   = process.env.GROQ_API_KEY   || '';

if (!GEMINI_KEY && !GROQ_KEY) {
  console.warn('[autoFillService] WARNING: No LLM API key found in environment. Set GEMINI_API_KEY or GROQ_API_KEY in .env');
}

async function callGemini(systemPrompt, userPrompt, modelName) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
  const response = await ai.models.generateContent({
    model: modelName,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  });
  return JSON.parse(response.text || '{}');
}

async function callGroq(systemPrompt, userPrompt, modelName) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: modelName,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt  }
      ]
    })
  });
  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content || '{}');
}

const PROVIDER_MAP = {
  gemini: callGemini,
  groq:   callGroq,
};

async function callWithRepair(callFn, systemPrompt, userPrompt, modelName) {
  try {
    return await callFn(systemPrompt, userPrompt, modelName);
  } catch (firstErr) {
    console.warn('[autoFillService] First attempt failed:', firstErr.message);
    const repairUserPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response could not be parsed as valid JSON. Return ONLY valid JSON matching the schema — no markdown, no explanation.`;
    return await callFn(systemPrompt, repairUserPrompt, modelName);
  }
}

function getModelOrThrow(modelId) {
  if (!modelId) {
    throw new Error('No model selected. Please choose an AI model.');
  }
  const model = MODELS.find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Unknown model ID: "${modelId}". Available models: ${MODELS.map(m => m.id).join(', ')}`);
  }
  const keyCheck = model.provider === 'gemini' ? GEMINI_KEY : GROQ_KEY;
  if (!keyCheck) {
    throw new Error(`API key for ${model.provider} is not configured. Set ${model.provider === 'gemini' ? 'GEMINI_API_KEY' : 'GROQ_API_KEY'} in .env`);
  }
  return model;
}

async function autoFillFromSources({ brief, docText }, modelId) {
  const { systemPrompt, userPrompt } = buildPrompt({ brief, docText });
  const model = getModelOrThrow(modelId);
  const callFn = PROVIDER_MAP[model.provider];
  if (!callFn) {
    throw new Error(`Unknown provider: ${model.provider}`);
  }
  console.log(`[autoFillService] Running extraction with: ${model.label} (${model.id})`);
  const raw = await callWithRepair(callFn, systemPrompt, userPrompt, model.modelName);
  return normalizeOutput(raw);
}

export { autoFillFromSources, getModelOrThrow };
