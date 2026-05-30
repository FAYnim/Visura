/**
 * autoFillFallback.test.js
 * Test that verifies the provider fallback chain:
 * - First provider fails → second provider succeeds → output is normalized.
 *
 * Run with: node tests/autoFillFallback.test.js
 */

import assert from 'node:assert/strict';
import { autoFillFromSources } from '../server/ai/autoFillService.js';
import { SCHEMA } from '../server/ai/promptBuilder.js';

// ── Stub helpers ──────────────────────────────────────────────────────────────

/**
 * Build a valid raw LLM response that matches SCHEMA shape.
 * All fields filled with a recognizable sentinel value.
 */
function buildValidRaw(sentinel = 'TEST_VALUE') {
  const raw = {};
  Object.keys(SCHEMA).forEach(slideKey => {
    raw[slideKey] = {};
    Object.keys(SCHEMA[slideKey]).forEach(field => {
      raw[slideKey][field] = sentinel;
    });
  });
  return raw;
}

// ── Test 1: Fallback — first provider fails, second succeeds ──────────────────
async function testFallbackToSecondProvider() {
  const validRaw = buildValidRaw('GROQ_RESULT');

  const providers = [
    {
      name: 'failing-provider',
      call: async (_sys, _usr) => {
        throw new Error('Simulated primary provider failure');
      }
    },
    {
      name: 'groq-stub',
      call: async (_sys, _usr) => validRaw
    }
  ];

  const result = await autoFillFromSources({ brief: 'test brief', docText: '' }, providers);

  // Verify normalized output comes from the second (Groq stub) provider
  assert.equal(result.slide1.BADGE_TEXT, 'GROQ_RESULT', 'slide1.BADGE_TEXT should be from fallback provider');
  assert.equal(result.slide5.CTA_TEXT_1, 'GROQ_RESULT', 'slide5.CTA_TEXT_1 should be from fallback provider');

  // Verify shape: all 5 slide keys present
  ['slide1', 'slide2', 'slide3', 'slide4', 'slide5'].forEach(s => {
    assert.ok(result[s] !== undefined, `Missing slide key: ${s}`);
    assert.equal(typeof result[s], 'object', `${s} must be an object`);
  });

  console.log('✓ Fallback: first provider fails → second provider succeeds → output normalized');
}

// ── Test 2: Both providers fail → throws final error ─────────────────────────
async function testAllProvidersFail() {
  const providers = [
    { name: 'fail-1', call: async () => { throw new Error('Provider 1 failed'); } },
    { name: 'fail-2', call: async () => { throw new Error('Provider 2 failed'); } }
  ];

  await assert.rejects(
    () => autoFillFromSources({ brief: 'test', docText: '' }, providers),
    /AI extraction failed after retry/,
    'Should throw final error when all providers fail'
  );

  console.log('✓ All providers fail → throws "AI extraction failed after retry"');
}

// ── Test 3: No providers → throws "No LLM API key" error ─────────────────────
async function testNoProviders() {
  await assert.rejects(
    () => autoFillFromSources({ brief: 'test', docText: '' }, []),
    /No LLM API key configured/,
    'Should throw when providers array is empty'
  );

  console.log('✓ Empty provider chain → throws "No LLM API key configured"');
}

// ── Test 4: First provider succeeds → no fallback needed ─────────────────────
async function testPrimaryProviderSucceeds() {
  const validRaw = buildValidRaw('GEMINI_RESULT');

  const providers = [
    { name: 'gemini-stub', call: async () => validRaw },
    {
      name: 'groq-stub-never-called',
      call: async () => {
        throw new Error('Fallback should NOT have been called');
      }
    }
  ];

  const result = await autoFillFromSources({ brief: 'test brief', docText: '' }, providers);

  assert.equal(result.slide1.MAIN_HEADLINE, 'GEMINI_RESULT', 'Output should come from first provider');

  console.log('✓ Primary provider succeeds → fallback not invoked');
}

// ── Runner ────────────────────────────────────────────────────────────────────
async function main() {
  try {
    await testFallbackToSecondProvider();
    await testAllProvidersFail();
    await testNoProviders();
    await testPrimaryProviderSucceeds();

    console.log('\n✅ All fallback tests passed!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  }
}

main();
