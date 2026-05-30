import { GoogleGenAI } from '@google/genai';
import { buildPrompt, normalizeOutput, SCHEMA } from './promptBuilder.js';

// ── Provider detection ────────────────────────────────────────────────────────
// Set GEMINI_API_KEY for Google Gemini or GROQ_API_KEY for Groq.
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_KEY   = process.env.GROQ_API_KEY   || '';

if (!GEMINI_KEY && !GROQ_KEY) {
  console.warn('[autoFillService] WARNING: No LLM API key found in environment. Set GEMINI_API_KEY or GROQ_API_KEY in .env');
}

// ── Gemini call ───────────────────────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

  const response = await ai.models.generateContent({
    // model: 'gemini-3.5-flash',
    // model: 'gemini-3-flash-preview',
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  });

  return JSON.parse(response.text || '{}');
}

// ── Groq call ─────────────────────────────────────────────────────────────────
async function callGroq(systemPrompt, userPrompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
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

// ── Retry-with-repair helper ──────────────────────────────────────────────────
/**
 * Call the given LLM function with retry+repair on failure.
 * @param {Function} callFn - async (systemPrompt, userPrompt) => object
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<object>} Raw parsed object from LLM
 */
async function callWithRepair(callFn, systemPrompt, userPrompt) {
  try {
    return await callFn(systemPrompt, userPrompt);
  } catch (firstErr) {
    console.warn('[autoFillService] First LLM attempt failed:', firstErr.message);

    // Retry once with a repair prompt
    const repairUserPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response could not be parsed as valid JSON. Return ONLY valid JSON matching the schema — no markdown, no explanation.`;
    return await callFn(systemPrompt, repairUserPrompt);
  }
}

// ── Provider chain factory ────────────────────────────────────────────────────
/**
 * Build an ordered list of available providers based on env key availability.
 * Accepts an optional override array for testing purposes.
 *
 * @param {Array<{name: string, call: Function}>} [overrides]
 * @returns {Array<{name: string, call: Function}>}
 */
function createProviderChain(overrides) {
  if (overrides) return overrides;

  const providers = [];
  if (GEMINI_KEY) providers.push({ name: 'gemini', call: callGemini });
  if (GROQ_KEY)   providers.push({ name: 'groq',   call: callGroq   });
  return providers;
}

// ── Main entry ────────────────────────────────────────────────────────────────
/**
 * Extract slide field data from brief + document text using an LLM.
 * Tries each configured provider in order (Gemini first, Groq as fallback).
 * Each provider is retried once with a repair prompt before moving on.
 *
 * @param {{ brief: string, docText: string }} input
 * @param {Array<{name: string, call: Function}>} [providerOverrides] - for testing
 * @returns {Promise<object>} Normalized slide data matching SCHEMA shape
 */
async function autoFillFromSources({ brief, docText }, providerOverrides) {
  const { systemPrompt, userPrompt } = buildPrompt({ brief, docText });

  const providers = createProviderChain(providerOverrides);

  if (providers.length === 0) {
    console.error('[autoFillService] No LLM API key configured.');
    throw new Error('No LLM API key configured. Please set GEMINI_API_KEY or GROQ_API_KEY in your .env file.');
  }

  for (const provider of providers) {
    console.log(`[autoFillService] Starting extraction, trying provider: ${provider.name}...`);
    try {
      const raw = await callWithRepair(provider.call, systemPrompt, userPrompt);
      console.log(`[autoFillService] Successfully extracted using provider: ${provider.name}`);
      return normalizeOutput(raw);
    } catch (err) {
      console.warn('[autoFillService] Provider failed:', provider.name, err.message);
      console.log('[autoFillService] Switching to next fallback provider (if available)...');
    }
  }

  throw new Error('AI extraction failed after retry. Please try again.');
}

export { autoFillFromSources, createProviderChain };
