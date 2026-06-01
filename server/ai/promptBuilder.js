import { SCHEMA } from './schema.js';

/**
 * Build the system + user prompt for the LLM.
 * @param {{ brief: string, docText: string }} input
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildPrompt({ brief, docText }) {
  const systemPrompt = `You are an expert copywriter and UI content strategist specializing in premium digital product portfolio presentations.

Your task is to analyze the provided project brief and/or document text, then generate compelling copy for a 5-slide Instagram carousel portfolio presentation.

RULES:
1. Return ONLY valid JSON that exactly matches the schema provided — no markdown, no explanation, no code fences.
2. All values must be strings. Use empty string "" for fields you cannot fill from the input.
3. Keep text concise and punchy (fits within UI space):
   - Badge/pill texts: 2–5 words, ALL CAPS preferred
   - Main headings: 2–8 words, title case or ALL CAPS
   - Descriptions: 1–3 sentences max
   - Feature titles: 2–4 words
   - Feature descriptions: 1–2 sentences
4. For slide4 MAIN_HEADLINE: use dramatic line breaks like "SMART.\\nAUTOMATED." 
5. For slide4 BRAND_STATEMENT: use dramatic format like "BUILT FOR DEVELOPERS.\\nDESIGNED FOR IMPACT."
6. Infer the project name, category, and key features from the text.
7. If the text doesn't have enough info for a field, use a sensible creative default.
8. Generate a storytelling Instagram caption under caption.TEXT. Describe the project in a professional storytelling tone (100-200 words). Use \\n for line breaks. The caption must be a single string.

JSON SCHEMA TO FILL:
${JSON.stringify(SCHEMA, null, 2)}`;

  const parts = [];
  if (brief) parts.push(`PROJECT BRIEF:\n${brief}`);
  if (docText) parts.push(`DOCUMENT CONTENT:\n${docText.slice(0, 8000)}`); // cap to avoid token overflow

  const userPrompt = parts.join('\n\n---\n\n') + '\n\nReturn only the filled JSON.';

  return { systemPrompt, userPrompt };
}

/**
 * Merge AI output into the clean schema, ensuring no extra/missing keys.
 * @param {object} raw
 * @returns {object}
 */
function normalizeOutput(raw) {
  const result = JSON.parse(JSON.stringify(SCHEMA)); // deep clone defaults

  Object.keys(SCHEMA).forEach(slideKey => {
    if (raw[slideKey] && typeof raw[slideKey] === 'object') {
      Object.keys(SCHEMA[slideKey]).forEach(field => {
        const val = raw[slideKey][field];
        if (typeof val === 'string') {
          result[slideKey][field] = val.trim();
        }
      });
    }
  });

  return result;
}

export { SCHEMA, buildPrompt, normalizeOutput };
