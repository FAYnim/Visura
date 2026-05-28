'use strict';

const https = require('https');
const { buildPrompt, normalizeOutput, SCHEMA } = require('./promptBuilder');

// ── Provider detection ────────────────────────────────────────────────────────
// Set OPENAI_API_KEY for OpenAI or ANTHROPIC_API_KEY for Claude.
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!OPENAI_KEY && !ANTHROPIC_KEY) {
  console.warn('[autoFillService] WARNING: No LLM API key found in environment. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env');
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse response: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy(new Error('LLM request timed out after 60 seconds'));
    });
    req.write(payload);
    req.end();
  });
}

// ── OpenAI call ───────────────────────────────────────────────────────────────
async function callOpenAI(systemPrompt, userPrompt) {
  const response = await httpsPost(
    'api.openai.com',
    '/v1/chat/completions',
    { Authorization: `Bearer ${OPENAI_KEY}` },
    {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    }
  );

  if (response.error) throw new Error(`OpenAI error: ${response.error.message}`);
  const content = response.choices?.[0]?.message?.content || '{}';
  return JSON.parse(content);
}

// ── Anthropic (Claude) call ───────────────────────────────────────────────────
async function callAnthropic(systemPrompt, userPrompt) {
  const response = await httpsPost(
    'api.anthropic.com',
    '/v1/messages',
    {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    {
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    }
  );

  if (response.error) throw new Error(`Anthropic error: ${response.error.message}`);
  const content = response.content?.[0]?.text || '{}';
  // Claude may wrap JSON in code fences — strip them
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
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
  const callLLM = OPENAI_KEY ? callOpenAI : ANTHROPIC_KEY ? callAnthropic : null;

  if (!callLLM) {
    // No API key — return empty schema so frontend can still show coverage = 0
    console.error('[autoFillService] No LLM API key configured.');
    throw new Error('No LLM API key configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in your .env file.');
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
