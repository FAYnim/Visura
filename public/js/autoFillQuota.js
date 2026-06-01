/* =========================================================
  Visura — AI Auto-Fill Quota Helper (autoFillQuota.js)
  Enforces client-side daily quota (3 requests/day) for
  the developer API key. BYOK bypasses quota entirely.

  Storage: localStorage key `visura.aiQuota`
  Schema:  { date: "YYYY-MM-DD", count: <number> }
  ========================================================= */

'use strict';

const QUOTA_STORAGE_KEY = 'visura.aiQuota';
const DAILY_LIMIT       = 3;

/* =========================================================
   DATE HELPER
   ========================================================= */

/**
 * Return today's date as "YYYY-MM-DD" using local clock.
 * @returns {string}
 */
function todayDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* =========================================================
   CORE QUOTA OPERATIONS
   ========================================================= */

/**
 * Load the stored quota record from localStorage.
 * If missing, corrupt, or stale (different date), returns a fresh record.
 * @returns {{ date: string, count: number }}
 */
export function loadQuota() {
  const today = todayDateKey();
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && typeof parsed.count === 'number') {
        return { date: today, count: parsed.count };
      }
    }
  } catch {
    /* corrupt JSON — fall through to fresh record */
  }
  return { date: today, count: 0 };
}

/**
 * Persist a quota record to localStorage.
 * @param {{ date: string, count: number }} record
 */
function saveQuota(record) {
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(record));
}

/**
 * Increment the daily request count by 1 and persist.
 * Resets to 1 automatically if the stored date differs from today.
 * @returns {{ date: string, count: number }} updated record
 */
export function incrementQuota() {
  const record = loadQuota();
  record.count += 1;
  saveQuota(record);
  return record;
}

/**
 * Compute how many requests remain for today.
 * @returns {number} 0..DAILY_LIMIT
 */
export function getRemainingQuota() {
  const { count } = loadQuota();
  return Math.max(0, DAILY_LIMIT - count);
}

/**
 * Return true if at least one request is available today.
 * @returns {boolean}
 */
export function hasQuotaRemaining() {
  return getRemainingQuota() > 0;
}

/**
 * Return the configured daily limit.
 * @returns {number}
 */
export function getDailyLimit() {
  return DAILY_LIMIT;
}

/**
 * Reset the quota for today to 0 (useful for testing / admin).
 */
export function resetQuota() {
  saveQuota({ date: todayDateKey(), count: 0 });
}
