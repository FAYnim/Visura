/**
 * autoFillQuota.test.js
 * Unit tests for the AI Auto-Fill quota helper module.
 * Run with: node tests/autoFillQuota.test.js
 */

import assert from 'assert';

/* =========================================================
   LIGHTWEIGHT localStorage STUB
   Node.js does not provide localStorage, so we stub it
   with a simple in-memory Map to allow the ES module to
   import and run without a browser environment.
   ========================================================= */
const _store = new Map();
global.localStorage = {
  getItem:    (k) => _store.has(k) ? _store.get(k) : null,
  setItem:    (k, v) => _store.set(k, String(v)),
  removeItem: (k) => _store.delete(k),
  clear:      ()    => _store.clear(),
};

/* Import the module AFTER the stub is in place */
import {
  loadQuota,
  incrementQuota,
  getRemainingQuota,
  hasQuotaRemaining,
  getDailyLimit,
  resetQuota,
} from '../public/js/autoFillQuota.js';

/* Utility: get today's local date string */
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* =========================================================
   TEST HELPERS
   ========================================================= */
function reset() {
  _store.clear();
}

/* =========================================================
   TESTS
   ========================================================= */

// ── Test 1: loadQuota returns zero count for fresh storage ──
reset();
const q1 = loadQuota();
assert.strictEqual(q1.date, todayKey(), 'loadQuota should return today\'s date key');
assert.strictEqual(q1.count, 0, 'Fresh quota count should be 0');
console.log('✓ loadQuota returns { date: today, count: 0 } on empty storage');

// ── Test 2: getDailyLimit returns 3 ─────────────────────────
assert.strictEqual(getDailyLimit(), 3, 'Daily limit should be 3');
console.log('✓ getDailyLimit() returns 3');

// ── Test 3: getRemainingQuota is 3 on fresh storage ──────────
reset();
assert.strictEqual(getRemainingQuota(), 3, 'Remaining quota should start at 3');
console.log('✓ getRemainingQuota() returns 3 on fresh storage');

// ── Test 4: hasQuotaRemaining is true when count < limit ─────
reset();
assert.strictEqual(hasQuotaRemaining(), true, 'Should have quota remaining at start');
console.log('✓ hasQuotaRemaining() returns true when count < limit');

// ── Test 5: incrementQuota increments count correctly ────────
reset();
const r1 = incrementQuota();
assert.strictEqual(r1.count, 1, 'After 1 increment, count should be 1');
const r2 = incrementQuota();
assert.strictEqual(r2.count, 2, 'After 2 increments, count should be 2');
const r3 = incrementQuota();
assert.strictEqual(r3.count, 3, 'After 3 increments, count should be 3');
console.log('✓ incrementQuota() increments count 1→2→3');

// ── Test 6: getRemainingQuota decrements as count grows ──────
reset();
assert.strictEqual(getRemainingQuota(), 3);
incrementQuota();
assert.strictEqual(getRemainingQuota(), 2);
incrementQuota();
assert.strictEqual(getRemainingQuota(), 1);
incrementQuota();
assert.strictEqual(getRemainingQuota(), 0, 'After 3 increments, remaining should be 0');
console.log('✓ getRemainingQuota() decrements correctly: 3→2→1→0');

// ── Test 7: hasQuotaRemaining is false when exhausted ────────
reset();
incrementQuota(); incrementQuota(); incrementQuota();
assert.strictEqual(hasQuotaRemaining(), false, 'hasQuotaRemaining should be false when quota exhausted');
console.log('✓ hasQuotaRemaining() returns false when quota exhausted');

// ── Test 8: getRemainingQuota never goes below 0 (overflow protection) ──
reset();
incrementQuota(); incrementQuota(); incrementQuota(); incrementQuota();
assert.strictEqual(getRemainingQuota(), 0, 'Remaining quota should not go below 0');
console.log('✓ getRemainingQuota() is clamped at 0 when over-incremented');

// ── Test 9: loadQuota resets when date changes (stale entry) ─
reset();
const yesterday = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();
_store.set('visura.aiQuota', JSON.stringify({ date: yesterday, count: 3 }));
const staleQ = loadQuota();
assert.strictEqual(staleQ.date, todayKey(), 'stale entry date should be reset to today');
assert.strictEqual(staleQ.count, 0, 'stale entry count should reset to 0');
console.log('✓ loadQuota() resets stale (yesterday) quota record to fresh state');

// ── Test 10: loadQuota handles corrupt JSON gracefully ───────
reset();
_store.set('visura.aiQuota', 'NOT_VALID_JSON{{{');
const corruptQ = loadQuota();
assert.strictEqual(corruptQ.count, 0, 'corrupt JSON should yield count 0');
assert.strictEqual(corruptQ.date, todayKey(), 'corrupt JSON should yield today\'s date');
console.log('✓ loadQuota() handles corrupt JSON gracefully');

// ── Test 11: resetQuota resets count to 0 ───────────────────
reset();
incrementQuota(); incrementQuota();
resetQuota();
const afterReset = loadQuota();
assert.strictEqual(afterReset.count, 0, 'resetQuota() should set count back to 0');
assert.strictEqual(afterReset.date, todayKey(), 'resetQuota() should keep today\'s date');
console.log('✓ resetQuota() resets count to 0 for today\'s date');

// ── Test 12: incrementQuota persists across loadQuota calls ──
reset();
incrementQuota();
const persisted = loadQuota();
assert.strictEqual(persisted.count, 1, 'incrementQuota should persist across loadQuota calls');
console.log('✓ incrementQuota() value persists across loadQuota() calls');

console.log('\n✅ All autoFillQuota tests passed!');
