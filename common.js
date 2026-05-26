/* =========================================================
   PromptFlex — Shared Utilities (common.js)
   ========================================================= */

'use strict';

// =========================================================
// STORAGE KEYS
// =========================================================
export const STORAGE_KEYS = {
  SETTINGS: 'promptflex_global_settings',
  HISTORY: 'promptflex_history'
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
    return stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults };
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
    return stored ? JSON.parse(stored) : [];
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
