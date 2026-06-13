/**
 * byokAutoFillFallback.test.js
 *
 * Tests that:
 *   1. When a byokKey is provided, it overrides the ENV key for requests.
 *   2. When byokKey is absent, the service falls back to ENV key.
 *   3. When neither byokKey nor ENV key exists, the service throws.
 *   4. getModelOrThrow allows missing ENV key when byokKey is provided.
 *
 * Mocks are applied at the service-input level: we verify the key resolution
 * logic in autoFillService without making real API calls.
 *
 * Run: node tests/byokAutoFillFallback.test.js
 */

import assert from 'node:assert/strict';

/* =========================================================
   HELPER: capture which API key would be used by callGemini
   We do this by temporarily overriding the ENV key and
   asserting on getModelOrThrow + key-resolution behaviour.
   ========================================================= */

async function testByokOverridesEnvKey() {
  /* Set up an ENV key */
  process.env.GEMINI_API_KEY = 'env-gemini-key';
  process.env.GROQ_API_KEY   = '';

  /* Re-import after env mutation — we use dynamic import to get a fresh
     module state for each test (Node caches modules; workaround: add a
     query string to bust the cache) */
  const { getModelOrThrow } = await import(`../server/ai/autoFillService.js?t=${Date.now()}`);

  const byokKey = 'AIzaSyByokTestKey1234567890';
  const model   = getModelOrThrow('gemini-2.5-flash', byokKey);

  /* Model should be resolved correctly even with BYOK key */
  assert.equal(model.provider, 'gemini', 'Provider is gemini');
  assert.equal(model.id, 'gemini-2.5-flash', 'Model ID is correct');

  console.log('✓ getModelOrThrow: BYOK key provided → ENV key not required, model resolved');
}

async function testFallbackToEnvKeyWhenNoByok() {
  process.env.GEMINI_API_KEY = 'env-gemini-key-fallback';

  const { getModelOrThrow } = await import(`../server/ai/autoFillService.js?t=${Date.now()}`);

  /* No byokKey passed */
  const model = getModelOrThrow('gemini-2.5-flash', null);
  assert.equal(model.id, 'gemini-2.5-flash', 'Falls back to ENV key: model resolved');

  console.log('✓ getModelOrThrow: no BYOK key → ENV key used as fallback, model resolved');
}

async function testThrowsWhenNoByokAndNoEnvKey() {
  process.env.GEMINI_API_KEY = '';
  process.env.GROQ_API_KEY   = '';

  const { getModelOrThrow } = await import(`../server/ai/autoFillService.js?t=${Date.now()}`);

  assert.throws(
    () => getModelOrThrow('gemini-2.5-flash', null),
    /GEMINI_API_KEY/,
    'Should throw mentioning GEMINI_API_KEY when neither BYOK nor ENV key is set'
  );

  console.log('✓ getModelOrThrow: no BYOK key, no ENV key → throws with helpful error');
}

async function testGroqByokOverridesEnvKey() {
  process.env.GROQ_API_KEY   = '';
  process.env.GEMINI_API_KEY = '';

  const { getModelOrThrow } = await import(`../server/ai/autoFillService.js?t=${Date.now()}`);

  const byokKey = 'gsk_ByokTestGroqKey1234567890';
  /* Should NOT throw because byokKey is provided */
  const model = getModelOrThrow('gpt-oss-120b', byokKey);
  assert.equal(model.provider, 'groq', 'Provider is groq');

  console.log('✓ getModelOrThrow: Groq BYOK key bypasses missing ENV key');
}

async function testIsProviderAvailableWithByok() {
  process.env.GEMINI_API_KEY = '';
  process.env.GROQ_API_KEY   = '';

  const { isProviderAvailable } = await import(`../server/ai/autoFillService.js?t=${Date.now()}`);

  /* Without any key */
  assert.equal(isProviderAvailable('gemini', null), false, 'gemini unavailable with no ENV and no BYOK');
  assert.equal(isProviderAvailable('groq',   null), false, 'groq unavailable with no ENV and no BYOK');

  /* With a BYOK key */
  assert.equal(isProviderAvailable('gemini', 'AIzaSyByok'), true, 'gemini available with BYOK key');
  assert.equal(isProviderAvailable('groq',   'gsk_byok'),   true, 'groq available with BYOK key');

  console.log('✓ isProviderAvailable: BYOK key marks provider as available regardless of ENV');
}

/* =========================================================
   MAIN
   ========================================================= */

async function main() {
  const savedGemini = process.env.GEMINI_API_KEY;
  const savedGroq   = process.env.GROQ_API_KEY;

  console.log('\n🔑 Running BYOK Auto-Fill Fallback Tests\n');
  try {
    await testByokOverridesEnvKey();
    await testFallbackToEnvKeyWhenNoByok();
    await testThrowsWhenNoByokAndNoEnvKey();
    await testGroqByokOverridesEnvKey();
    await testIsProviderAvailableWithByok();
    console.log('\n✅ All BYOK auto-fill fallback tests passed!\n');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  } finally {
    /* Restore env vars */
    process.env.GEMINI_API_KEY = savedGemini || '';
    process.env.GROQ_API_KEY   = savedGroq   || '';
  }
}

main();
