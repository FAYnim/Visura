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
// SETTINGS STORAGE
// =========================================================
export function loadSettings(defaults) {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...defaults, ...JSON.parse(stored) };
    }

    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEYS.SETTINGS);
    if (legacyStored) {
      const parsedLegacy = JSON.parse(legacyStored);
      const migrated = { ...defaults, ...parsedLegacy };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(migrated));
      localStorage.removeItem(LEGACY_STORAGE_KEYS.SETTINGS);
      return migrated;
    }

    return { ...defaults };
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
    return { ...defaults };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

// =========================================================
// HISTORY STORAGE
// =========================================================
export function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      return JSON.parse(stored);
    }

    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEYS.HISTORY);
    if (legacyStored) {
      const parsedLegacy = JSON.parse(legacyStored);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsedLegacy));
      localStorage.removeItem(LEGACY_STORAGE_KEYS.HISTORY);
      return parsedLegacy;
    }

    return [];
  } catch (e) {
    console.error('Failed to load history from localStorage', e);
    return [];
  }
}

export function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

// =========================================================
// PROMPT BATCHES STORAGE
// =========================================================
export function loadPromptBatches() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROMPT_BATCHES);
    if (stored) {
      return JSON.parse(stored);
    }

    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEYS.PROMPT_BATCHES);
    if (legacyStored) {
      const parsedLegacy = JSON.parse(legacyStored);
      localStorage.setItem(STORAGE_KEYS.PROMPT_BATCHES, JSON.stringify(parsedLegacy));
      localStorage.removeItem(LEGACY_STORAGE_KEYS.PROMPT_BATCHES);
      return parsedLegacy;
    }

    return [];
  } catch (e) {
    console.error('Failed to load prompt batches from localStorage', e);
    return [];
  }
}

export function savePromptBatches(batches) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPT_BATCHES, JSON.stringify(batches));
  } catch (e) {
    console.error('Failed to save prompt batches to localStorage', e);
  }
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
