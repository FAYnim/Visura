/* =========================================================
   Visura — Shared Utilities (common.js)
   ========================================================= */

'use strict';

// =========================================================
// STORAGE KEYS
// =========================================================
export const STORAGE_KEYS = {
  SETTINGS: 'visura_global_settings',
  HISTORY: 'visura_history',
  PROMPT_BATCHES: 'visura_prompt_batches'
};

export const LEGACY_STORAGE_KEYS = {
  SETTINGS: 'promptflex_global_settings',
  HISTORY: 'promptflex_history',
  PROMPT_BATCHES: 'promptflex_prompt_batches'
};

// =========================================================
// ESCAPE HTML
// =========================================================
export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =========================================================
// GENERIC STORAGE HELPERS
// =========================================================
export function readStorage(key, legacyKey, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }

    if (legacyKey) {
      const legacyStored = localStorage.getItem(legacyKey);
      if (legacyStored) {
        const parsedLegacy = JSON.parse(legacyStored);
        localStorage.setItem(key, JSON.stringify(parsedLegacy));
        localStorage.removeItem(legacyKey);
        return parsedLegacy;
      }
    }

    return fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

// =========================================================
// SETTINGS STORAGE
// =========================================================
export function loadSettings(defaults) {
  const data = readStorage(STORAGE_KEYS.SETTINGS, LEGACY_STORAGE_KEYS.SETTINGS, defaults);
  return { ...defaults, ...data };
}

export function saveSettings(settings) {
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
}

// =========================================================
// HISTORY STORAGE
// =========================================================
export function loadHistory() {
  return readStorage(STORAGE_KEYS.HISTORY, LEGACY_STORAGE_KEYS.HISTORY, []);
}

export function saveHistory(history) {
  writeStorage(STORAGE_KEYS.HISTORY, history);
}

// =========================================================
// PROMPT BATCHES STORAGE
// =========================================================
export function loadPromptBatches() {
  return readStorage(STORAGE_KEYS.PROMPT_BATCHES, LEGACY_STORAGE_KEYS.PROMPT_BATCHES, []);
}

export function savePromptBatches(batches) {
  writeStorage(STORAGE_KEYS.PROMPT_BATCHES, batches);
}

/**
 * Returns the active batch object from the batches array.
 * Falls back to null if not found (caller should use DEFAULT_PROMPT_BATCH).
 * @param {Array} batches
 * @param {string|null} activeId
 * @returns {Object|null}
 */
export function getActivePromptBatch(batches, activeId) {
  if (!activeId || !Array.isArray(batches) || batches.length === 0) return null;
  return batches.find(b => b.id === activeId) || null;
}

// =========================================================
// PROFILE WIDGET
// =========================================================
export function updateProfileWidget(settings) {
  const profileNameEl = document.querySelector('.profile-name');
  const profileTitleEl = document.querySelector('.profile-title');

  if (profileNameEl) {
    profileNameEl.textContent = settings.CREATOR_NAME?.trim() || 'Faris AY';
  }
  if (profileTitleEl) {
    profileTitleEl.textContent = settings.CREATOR_ROLE?.trim() || 'Settings';
  }
}

// =========================================================
// SIDEBAR TOGGLE HELPERS (shared across pages)
// =========================================================
export function initSidebar() {
  let mobileMenuOpen = false;

  function toggleMobileSidebar(force) {
    const open = force !== undefined ? force : !mobileMenuOpen;
    mobileMenuOpen = open;

    const sidebar = document.querySelector('.app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleIcon = document.querySelector('#sidebar-toggle-mobile i');

    if (sidebar) sidebar.classList.toggle('mobile-active', open);
    if (overlay) overlay.classList.toggle('active', open);
    if (toggleIcon) {
      toggleIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  }

  const toggleBtnMobile = document.getElementById('sidebar-toggle-mobile');
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', () => toggleMobileSidebar());
  }

  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => toggleMobileSidebar(false));
  }

  return { toggleMobileSidebar };
}

// =========================================================
// TOAST NOTIFICATION
// =========================================================
export function showToast(message) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
