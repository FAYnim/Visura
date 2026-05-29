'use strict';

const { GoogleGenAI } = require('@google/genai');
const { buildPrompt, normalizeOutput, SCHEMA } = require('./promptBuilder');

// ── Provider detection ────────────────────────────────────────────────────────
// Set GEMINI_API_KEY for Google Gemini.
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_KEY) {
  console.warn('[autoFillService] WARNING: No LLM API key found in environment. Set GEMINI_API_KEY in .env');
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

// ── Main entry ────────────────────────────────────────────────────────────────
/**
 * Extract slide field data from brief + document text using an LLM.
 * Retries once with a repair prompt if the first response is invalid JSON.
 *
 * @param {{ brief: string, docText: string }} input
 * @returns {Promise<object>} Normalized slide data matching SCHEMA shape
 */
async function autoFillFromSources({ brief, docText }) {
  const { systemPrompt, userPrompt } = buildPrompt({ brief, docText });

  // Pick provider
  const callLLM = GEMINI_KEY ? callGemini : null;

  if (!callLLM) {
    // No API key — return empty schema so frontend can still show coverage = 0
    console.error('[autoFillService] No LLM API key configured.');
    throw new Error('No LLM API key configured. Please set GEMINI_API_KEY in your .env file.');
  }

  let raw;

  // First attempt
  try {
    raw = await callLLM(systemPrompt, userPrompt);
  } catch (firstErr) {
    console.warn('[autoFillService] First LLM attempt failed:', firstErr.message);

    // Retry once with a repair prompt
    const repairUserPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response could not be parsed as valid JSON. Return ONLY valid JSON matching the schema — no markdown, no explanation.`;
    try {
      raw = await callLLM(systemPrompt, repairUserPrompt);
    } catch (retryErr) {
      console.error('[autoFillService] Retry also failed:', retryErr.message);
      throw new Error('AI extraction failed after retry. Please try again.');
    }
  }

  return normalizeOutput(raw);
}

module.exports = { autoFillFromSources };
