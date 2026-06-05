/* =========================================================
  Visura — BYOK (Bring Your Own Key) Module
  Handles: load, validate, encrypt, decrypt, store, clear
  Encryption: Web Crypto AES-GCM (256-bit key, random IV)
  Storage keys:
    - localStorage.byokCryptoKey  → base64 raw AES key
    - localStorage.byokKeys       → JSON { gemini: { iv, ct }, groq: { iv, ct } }
  ========================================================= */

import { loadSettings, updateProfileWidget } from './common.js';
import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

'use strict';

/* ---- Storage key constants ---- */
const STORAGE_CRYPTO_KEY = 'byokCryptoKey';
const STORAGE_BYOK_KEYS  = 'byokKeys';

/* ---- Provider prefix validation rules ---- */
const PROVIDER_PREFIXES = {
  gemini: 'AIza',
  groq:   'gsk_',
};

/* ---- Minimum key length (rough guard against obvious junk) ---- */
const MIN_KEY_LENGTH = 10;

/* =========================================================
   CRYPTO UTILITIES
   ========================================================= */

/**
 * Export a CryptoKey to base64 string for localStorage persistence.
 * @param {CryptoKey} cryptoKey
 * @returns {Promise<string>} base64 encoded raw key bytes
 */
async function exportKeyToBase64(cryptoKey) {
  const raw = await crypto.subtle.exportKey('raw', cryptoKey);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/**
 * Import a base64 string back to a CryptoKey.
 * @param {string} base64
 * @returns {Promise<CryptoKey>}
 */
async function importKeyFromBase64(base64) {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'raw',
    raw,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or generate the persistent AES-GCM CryptoKey.
 * If one exists in localStorage, import it; otherwise generate fresh.
 * @returns {Promise<CryptoKey>}
 */
async function getOrCreateCryptoKey() {
  const stored = localStorage.getItem(STORAGE_CRYPTO_KEY);
  if (stored) {
    try {
      return await importKeyFromBase64(stored);
    } catch {
      /* corrupt — fall through and generate a new one */
    }
  }
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  localStorage.setItem(STORAGE_CRYPTO_KEY, await exportKeyToBase64(key));
  return key;
}

/**
 * Encrypt a plaintext string with AES-GCM.
 * @param {string} plaintext
 * @param {CryptoKey} cryptoKey
 * @returns {Promise<{iv: string, ct: string}>} base64-encoded IV and ciphertext
 */
async function encryptText(plaintext, cryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    ct: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
  };
}

/**
 * Decrypt an AES-GCM encrypted payload back to plaintext.
 * @param {{ iv: string, ct: string }} payload
 * @param {CryptoKey} cryptoKey
 * @returns {Promise<string>}
 */
async function decryptText(payload, cryptoKey) {
  const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
  const ct = Uint8Array.from(atob(payload.ct), c => c.charCodeAt(0));
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ct
  );
  return new TextDecoder().decode(plainBuffer);
}

/* =========================================================
   BYOK STORAGE HELPERS
   ========================================================= */

/**
 * Load stored BYOK encrypted payloads object from localStorage.
 * @returns {{ gemini?: {iv,ct}, groq?: {iv,ct} }}
 */
function loadStoredPayloads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_BYOK_KEYS) || '{}');
  } catch {
    return {};
  }
}

/**
 * Save a single provider's encrypted payload into the BYOK store.
 * @param {string} provider
 * @param {{ iv: string, ct: string }} payload
 */
function saveProviderPayload(provider, payload) {
  const all = loadStoredPayloads();
  all[provider] = payload;
  localStorage.setItem(STORAGE_BYOK_KEYS, JSON.stringify(all));
}

/**
 * Remove a single provider's encrypted payload from the BYOK store.
 * @param {string} provider
 */
function clearProviderPayload(provider) {
  const all = loadStoredPayloads();
  delete all[provider];
  localStorage.setItem(STORAGE_BYOK_KEYS, JSON.stringify(all));
}

/* =========================================================
   PUBLIC CRYPTO HELPERS (used by autoFill.js via export)
   ========================================================= */

/**
 * Validate that an API key matches the expected provider prefix.
 * @param {string} provider - 'gemini' | 'groq'
 * @param {string} key
 * @returns {boolean}
 */
export function validateKeyPrefix(provider, key) {
  const prefix = PROVIDER_PREFIXES[provider];
  if (!prefix) return false;
  return typeof key === 'string' && key.startsWith(prefix) && key.length >= MIN_KEY_LENGTH;
}

/**
 * Decrypt and return the stored BYOK key for the given provider.
 * Returns null if no key is stored or decryption fails.
 * @param {string} provider - 'gemini' | 'groq'
 * @returns {Promise<string|null>}
 */
export async function getDecryptedByokKey(provider) {
  const payloads = loadStoredPayloads();
  if (!payloads[provider]) return null;

  const storedKeyB64 = localStorage.getItem(STORAGE_CRYPTO_KEY);
  if (!storedKeyB64) return null;

  try {
    const cryptoKey = await importKeyFromBase64(storedKeyB64);
    return await decryptText(payloads[provider], cryptoKey);
  } catch {
    return null;
  }
}

/**
 * Check whether a BYOK key is stored for a given provider.
 * @param {string} provider
 * @returns {boolean}
 */
export function hasByokKey(provider) {
  const payloads = loadStoredPayloads();
  return !!(payloads[provider]?.iv && payloads[provider]?.ct);
}

/* =========================================================
   UI — TOAST UTILITY
   ========================================================= */

let _toastTimer = null;

function showToast(html, duration = 3000) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  clearTimeout(_toastTimer);
  toast.innerHTML = html;
  toast.classList.add('show');
  _toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* =========================================================
   UI — STATUS BADGE UPDATER
   ========================================================= */

function updateStatusBadge(provider, hasKey) {
  const badge = document.getElementById(`byok-status-${provider}`);
  const card  = document.getElementById(`byok-card-${provider}`);
  const clearBtn = document.getElementById(`byok-clear-${provider}`);
  if (!badge) return;

  const dot   = badge.querySelector('.byok-status-dot');
  const label = badge.querySelector('.byok-status-label');

  if (hasKey) {
    dot.className   = 'byok-status-dot byok-status-dot--active';
    label.textContent = 'Key saved';
    card?.classList.add('byok-card--has-key');
    clearBtn?.removeAttribute('hidden');
  } else {
    dot.className   = 'byok-status-dot byok-status-dot--empty';
    label.textContent = 'Not set';
    card?.classList.remove('byok-card--has-key');
    clearBtn?.setAttribute('hidden', '');
  }
}

/* =========================================================
   UI — VALIDATION MESSAGE
   ========================================================= */

function setValidationMsg(provider, msg, isError = true) {
  const el = document.getElementById(`byok-validation-${provider}`);
  if (!el) return;
  if (!msg) {
    el.setAttribute('hidden', '');
    return;
  }
  el.removeAttribute('hidden');
  el.textContent = msg;
  el.className = isError ? 'byok-validation-msg byok-validation-msg--error'
                         : 'byok-validation-msg byok-validation-msg--ok';
}

/* =========================================================
   UI — SAVE HANDLER
   ========================================================= */

async function handleSave(provider) {
  const input = document.getElementById(`byok-input-${provider}`);
  const saveBtn = document.getElementById(`byok-save-${provider}`);
  if (!input || !saveBtn) return;

  const key = input.value.trim();

  /* Clear previous validation */
  setValidationMsg(provider, '');

  /* Validate prefix */
  if (!key) {
    setValidationMsg(provider, 'Please enter an API key.');
    return;
  }
  if (!validateKeyPrefix(provider, key)) {
    const prefix = PROVIDER_PREFIXES[provider];
    setValidationMsg(provider, `Invalid key — must start with "${prefix}".`);
    return;
  }

  /* Encrypt and store */
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

  try {
    const cryptoKey = await getOrCreateCryptoKey();
    const payload   = await encryptText(key, cryptoKey);
    saveProviderPayload(provider, payload);

    /* Keep input value stored and reset visibility toggle to password */
    input.type = 'password';
    const toggleBtn = input.closest('.byok-input-wrap')?.querySelector('.byok-toggle-visibility i');
    if (toggleBtn) {
      toggleBtn.className = 'fa-regular fa-eye';
    }

    updateStatusBadge(provider, true);
    setValidationMsg(provider, 'Key saved & encrypted successfully.', false);
    showToast(`<i class="fa-solid fa-shield-halved" style="color:var(--accent-primary)"></i> ${provider === 'gemini' ? 'Gemini' : 'Groq'} key saved & encrypted.`);
  } catch (err) {
    setValidationMsg(provider, `Encryption error: ${err.message}`);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Key';
  }
}

/* =========================================================
   UI — CLEAR HANDLER
   ========================================================= */

function handleClear(provider) {
  clearProviderPayload(provider);
  updateStatusBadge(provider, false);
  setValidationMsg(provider, '');
  const input = document.getElementById(`byok-input-${provider}`);
  if (input) input.value = '';
  showToast(`<i class="fa-solid fa-trash-can" style="color:var(--text-secondary)"></i> ${provider === 'gemini' ? 'Gemini' : 'Groq'} key cleared.`);
}

/* =========================================================
   UI — VISIBILITY TOGGLE
   ========================================================= */

function initVisibilityToggles() {
  document.querySelectorAll('.byok-toggle-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input    = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      btn.setAttribute('aria-label', isPassword ? 'Hide key' : 'Show key');
    });
  });
}

/* =========================================================
   UI — MOBILE SIDEBAR
   ========================================================= */

function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle-mobile');
  const sidebar   = document.querySelector('.app-sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  if (!toggleBtn || !sidebar || !overlay) return;

  const toggleIcon = toggleBtn.querySelector('i');

  function openSidebar() {
    sidebar.classList.add('mobile-active');
    overlay.classList.add('active');
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-xmark';
    }
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('mobile-active');
    overlay.classList.remove('active');
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-bars';
    }
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('mobile-active');
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  overlay.addEventListener('click', closeSidebar);
}

/* =========================================================
   UI — INFO BANNER DISMISS
   ========================================================= */

function initInfoBanner() {
  const banner    = document.getElementById('byok-info-banner');
  const closeBtn  = document.getElementById('byok-info-close');
  if (!banner || !closeBtn) return;

  /* Dismiss if previously hidden */
  if (localStorage.getItem('byokInfoDismissed') === '1') {
    banner.setAttribute('hidden', '');
    return;
  }

  closeBtn.addEventListener('click', () => {
    banner.classList.add('byok-info-banner--dismissing');
    setTimeout(() => {
      banner.setAttribute('hidden', '');
    }, 300);
    localStorage.setItem('byokInfoDismissed', '1');
  });
}

/* =========================================================
   INIT
   ========================================================= */

async function init() {
  updateProfileWidget(loadSettings(SETTINGS_DEFAULTS));

  /* Load current status and stored key for each provider */
  for (const provider of ['gemini', 'groq']) {
    const has = hasByokKey(provider);
    updateStatusBadge(provider, has);
    if (has) {
      const decrypted = await getDecryptedByokKey(provider);
      if (decrypted) {
        const input = document.getElementById(`byok-input-${provider}`);
        if (input) {
          input.value = decrypted;
        }
      }
    }
  }

  /* Wire Save buttons */
  document.querySelectorAll('.byok-btn-save').forEach(btn => {
    btn.addEventListener('click', () => handleSave(btn.dataset.provider));
  });

  /* Wire Clear buttons */
  document.querySelectorAll('.byok-btn-clear').forEach(btn => {
    btn.addEventListener('click', () => handleClear(btn.dataset.provider));
  });

  /* Enter key in input triggers save */
  document.querySelectorAll('.byok-input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSave(input.dataset.provider);
    });
    /* Live validation on blur */
    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (!val) { setValidationMsg(input.dataset.provider, ''); return; }
      if (!validateKeyPrefix(input.dataset.provider, val)) {
        const prefix = PROVIDER_PREFIXES[input.dataset.provider];
        setValidationMsg(input.dataset.provider, `Key must start with "${prefix}".`);
      } else {
        setValidationMsg(input.dataset.provider, '');
      }
    });
    /* Clear validation on focus */
    input.addEventListener('focus', () => setValidationMsg(input.dataset.provider, ''));
  });

  initVisibilityToggles();
  initMobileSidebar();
  initInfoBanner();
}

document.addEventListener('DOMContentLoaded', init);
