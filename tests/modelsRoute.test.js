import assert from 'node:assert/strict';

const previousGemini = process.env.GEMINI_API_KEY;
const previousGroq = process.env.GROQ_API_KEY;
delete process.env.GEMINI_API_KEY;
delete process.env.GROQ_API_KEY;

const { getModelsForResponse } = await import('../server/routes/autoFill.js');

const availableModels = getModelsForResponse(false);
const byokModels = getModelsForResponse(true);

assert.deepEqual(availableModels, [], 'default model list should only include env-available providers');
assert.ok(byokModels.some(model => model.id === 'gemini-2.5-flash'), 'BYOK model list should include Gemini model IDs');
assert.ok(byokModels.some(model => model.id === 'gpt-oss-120b'), 'BYOK model list should include Groq model IDs');
assert.ok(byokModels.every(model => model.id && model.label && model.provider), 'BYOK model list should expose route-safe model fields');

if (previousGemini === undefined) delete process.env.GEMINI_API_KEY;
else process.env.GEMINI_API_KEY = previousGemini;
if (previousGroq === undefined) delete process.env.GROQ_API_KEY;
else process.env.GROQ_API_KEY = previousGroq;

console.log('\n✅ Model route helper tests passed!');
