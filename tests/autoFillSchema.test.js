'use strict';

/**
 * autoFillSchema.test.js
 * Minimal schema validation test — run with: node tests/autoFillSchema.test.js
 */

const assert = require('assert');
const { SCHEMA, normalizeOutput } = require('../server/ai/promptBuilder');

// ── Test 1: SCHEMA has all 5 slide keys ──────────────────────────────────────
const expectedSlides = ['slide1', 'slide2', 'slide3', 'slide4', 'slide5'];
expectedSlides.forEach(s => {
  assert(SCHEMA[s] !== undefined, `SCHEMA missing key: ${s}`);
});
console.log('✓ SCHEMA has all 5 slide keys');

// ── Test 2: slide1 required fields ───────────────────────────────────────────
const slide1RequiredKeys = ['BADGE_TEXT', 'MAIN_HEADLINE', 'SUBTITLE_TEXT'];
slide1RequiredKeys.forEach(k => {
  assert(k in SCHEMA.slide1, `SCHEMA.slide1 missing required key: ${k}`);
});
console.log('✓ slide1 has required keys');

// ── Test 3: slide2 has feature keys ──────────────────────────────────────────
['FEATURE_TITLE_1', 'FEATURE_DESC_1', 'FEATURE_TITLE_4', 'FEATURE_DESC_4'].forEach(k => {
  assert(k in SCHEMA.slide2, `SCHEMA.slide2 missing: ${k}`);
});
console.log('✓ slide2 has feature keys');

// ── Test 4: slide3 has 6 feature sets + CTA ──────────────────────────────────
for (let i = 1; i <= 6; i++) {
  assert(`FEATURE_TITLE_${i}` in SCHEMA.slide3, `slide3 missing FEATURE_TITLE_${i}`);
  assert(`FEATURE_DESC_${i}` in SCHEMA.slide3, `slide3 missing FEATURE_DESC_${i}`);
  assert(`FEATURE_UI_${i}` in SCHEMA.slide3, `slide3 missing FEATURE_UI_${i}`);
}
assert('CTA_TEXT' in SCHEMA.slide3, 'slide3 missing CTA_TEXT');
assert('CTA_BUTTON' in SCHEMA.slide3, 'slide3 missing CTA_BUTTON');
console.log('✓ slide3 has 6 feature sets + CTA');

// ── Test 5: slide4 has pills ─────────────────────────────────────────────────
for (let i = 1; i <= 4; i++) {
  assert(`PILL_TEXT_${i}` in SCHEMA.slide4, `slide4 missing PILL_TEXT_${i}`);
}
console.log('✓ slide4 has pill keys');

// ── Test 6: slide5 required fields ───────────────────────────────────────────
['TOP_BADGE_TEXT', 'MAIN_HEADLINE', 'DESCRIPTION_TEXT', 'CREATOR_ROLE', 'CTA_TEXT_1', 'CTA_TEXT_2'].forEach(k => {
  assert(k in SCHEMA.slide5, `SCHEMA.slide5 missing: ${k}`);
});
console.log('✓ slide5 has required keys');

// ── Test 7: normalizeOutput merges correctly ──────────────────────────────────
const mockRaw = {
  slide1: { BADGE_TEXT: '  AI TOOL  ', MAIN_HEADLINE: 'Smart.', SUBTITLE_TEXT: '' },
  slide2: { SECTION_BADGE: 'OVERVIEW' },
  slide3: {},
  slide4: { UNKNOWN_KEY: 'should be ignored' },
  slide5: {}
};
const normalized = normalizeOutput(mockRaw);
assert(normalized.slide1.BADGE_TEXT === 'AI TOOL', 'normalizeOutput should trim whitespace');
assert(normalized.slide1.SUBTITLE_TEXT === '', 'empty string should remain empty');
assert(normalized.slide4.UNKNOWN_KEY === undefined, 'unknown keys should not appear in output');
assert(normalized.slide2.SECTION_BADGE === 'OVERVIEW', 'known key should be mapped');
console.log('✓ normalizeOutput merges and cleans correctly');

// ── Test 8: validateSchema helper ────────────────────────────────────────────
function validateSchema(payload) {
  expectedSlides.forEach(s => {
    assert(payload[s], `Missing slide key: ${s}`);
    assert(typeof payload[s] === 'object', `${s} must be an object`);
  });
}

validateSchema({ slide1: {}, slide2: {}, slide3: {}, slide4: {}, slide5: {} });
console.log('✓ validateSchema helper works');

console.log('\n✅ All tests passed!');
