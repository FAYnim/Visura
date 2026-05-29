/* =========================================================
   Visura — Generator Page Logic (generator.js)
   ========================================================= */

import {
  STORAGE_KEYS,
  escapeHtml,
  loadSettings,
  loadHistory,
  saveHistory,
  loadPromptBatches,
  getActivePromptBatch,
  updateProfileWidget,
  initSidebar,
  showToast
} from './common.js';

import {
  DEFAULT_PROMPTS,
  normalizePromptBatches
} from './promptStore.js';

import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

'use strict';



// =========================================================
// TEMPLATE RESOLVER
// =========================================================
/**
 * Returns the prompt template string for a given slide number.
 * If an active prompt batch is set in STATE, uses that batch's slide template.
 * Falls back to DEFAULT_PROMPTS (single source of truth) if no batch active.
 */
function getTemplateForSlide(slide) {
  // Try active batch first
  if (STATE.activePromptBatchId && STATE.promptBatches) {
    const activeBatch = getActivePromptBatch(STATE.promptBatches, STATE.activePromptBatchId);
    if (activeBatch && activeBatch.slides && activeBatch.slides[slide]) {
      return activeBatch.slides[slide];
    }
  }
  // Fallback: default templates from promptStore.js
  return DEFAULT_PROMPTS[slide] || DEFAULT_PROMPTS[1];
}

// =========================================================
// STATE MACHINE
// =========================================================


const STATE = {
  activeSlide: 1,
  settings: { ...SETTINGS_DEFAULTS },
  history: [],
  promptBatches: [],
  activePromptBatchId: null,
  slides: {
    1: { BADGE_TEXT: '', MAIN_HEADLINE: '', SUBTITLE_TEXT: '' },
    2: {
      SECTION_BADGE: '', MAIN_HEADING: '', PROJECT_DESCRIPTION: '', QUOTE_TEXT: '',
      FEATURE_TITLE_1: '', FEATURE_DESC_1: '',
      FEATURE_TITLE_2: '', FEATURE_DESC_2: '',
      FEATURE_TITLE_3: '', FEATURE_DESC_3: '',
      FEATURE_TITLE_4: '', FEATURE_DESC_4: ''
    },
    3: {
      SECTION_BADGE: '', MAIN_HEADING: '', SUBTITLE_TEXT: '',
      FEATURE_TITLE_1: '', FEATURE_DESC_1: '', FEATURE_UI_1: '',
      FEATURE_TITLE_2: '', FEATURE_DESC_2: '', FEATURE_UI_2: '',
      FEATURE_TITLE_3: '', FEATURE_DESC_3: '', FEATURE_UI_3: '',
      FEATURE_TITLE_4: '', FEATURE_DESC_4: '', FEATURE_UI_4: '',
      FEATURE_TITLE_5: '', FEATURE_DESC_5: '', FEATURE_UI_5: '',
      FEATURE_TITLE_6: '', FEATURE_DESC_6: '', FEATURE_UI_6: '',
      CTA_TEXT: '', CTA_BUTTON: ''
    },
    4: {
      TOP_LEFT_BADGE: '', TOP_RIGHT_LABEL: '', MAIN_HEADLINE: '', SUBTITLE_TEXT: '',
      PILL_TEXT_1: '', PILL_TEXT_2: '', PILL_TEXT_3: '', PILL_TEXT_4: '',
      BRAND_STATEMENT: ''
    },
    5: {
      TOP_BADGE_TEXT: '', MAIN_HEADLINE: '', DESCRIPTION_TEXT: '',
      CREATOR_ROLE: '', CTA_TEXT_1: '', CTA_TEXT_2: ''
    }
  }
};

// =========================================================
// TEMPLATE COMPILER
// =========================================================
function compileTemplate(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const allData = { ...slideData, ...STATE.settings };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    if (value && value.trim() !== '') {
      return `<span class="ph-filled">${escapeHtml(value)}</span>`;
    } else {
      return `<span class="ph-empty">[${key}]</span>`;
    }
  });

  return compiled;
}

function compilePlainText(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const allData = { ...slideData, ...STATE.settings };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    return (value && value.trim() !== '') ? value : `[${key}]`;
  });

  return compiled;
}

// =========================================================
// DOM REFERENCES
// =========================================================
let previewOutput;
let previewTitle;
let previewCharCount;
let copyBtn;
let resetBtn;

// =========================================================
// RENDER ENGINE
// =========================================================
function renderPreview() {
  const compiled = compileTemplate(STATE.activeSlide);
  previewOutput.innerHTML = compiled;

  const plain = compilePlainText(STATE.activeSlide);
  previewCharCount.textContent = `${plain.length.toLocaleString()} chars`;

  const slideNames = { 1: 'Slide 1', 2: 'Slide 2', 3: 'Slide 3', 4: 'Slide 4', 5: 'Slide 5' };
  previewTitle.textContent = `${slideNames[STATE.activeSlide]} Prompt`;
}

// =========================================================
// SLIDE SWITCHER
// =========================================================
function switchSlide(slideNum) {
  STATE.activeSlide = slideNum;

  document.querySelectorAll('.slide-tab').forEach(tab => {
    const isActive = parseInt(tab.dataset.slide) === slideNum;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.form-panel').forEach(panel => {
    const isActive = parseInt(panel.dataset.slide) === slideNum;
    panel.classList.toggle('active', isActive);
  });

  renderPreview();
}

// =========================================================
// INPUT BINDING
// =========================================================
function bindInputs() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const slide = parseInt(el.dataset.slide);

    if (STATE.slides[slide] && STATE.slides[slide][key] !== undefined) {
      el.value = STATE.slides[slide][key];
    }

    el.addEventListener('input', e => {
      if (STATE.slides[slide] && STATE.slides[slide][key] !== undefined) {
        STATE.slides[slide][key] = e.target.value;
        if (STATE.activeSlide === slide) {
          renderPreview();
        }
      }
    });
  });
}

// =========================================================
// COPY HANDLER
// =========================================================
function handleCopy() {
  const plain = compilePlainText(STATE.activeSlide);

  navigator.clipboard.writeText(plain).then(() => {
    const originalContent = copyBtn.innerHTML;
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Copied!`;

    showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> Prompt copied to clipboard!`);

    addToHistory(plain);

    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = originalContent;
    }, 2000);
  }).catch(() => {
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i> Failed to copy. Please try again.`);
  });
}

// =========================================================
// RESET HANDLER
// =========================================================
function handleReset() {
  // 1. Reset slide data for all slides (1 to 5) to empty string
  Object.keys(STATE.slides).forEach(slide => {
    Object.keys(STATE.slides[slide]).forEach(key => {
      STATE.slides[slide][key] = '';
    });
  });

  // 2. Clear all form inputs with [data-key]
  document.querySelectorAll('[data-key]').forEach(el => {
    el.value = '';
  });

  // 3. Restore preview to placeholder state
  renderPreview();

  // 4. Show user feedback toast
  showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> All generator inputs have been reset.`);
}

// =========================================================
// HISTORY ENGINE
// =========================================================
function addToHistory(promptText) {
  const slideNames = {
    1: 'Slide 1 — Cover',
    2: 'Slide 2 — Project Overview',
    3: 'Slide 3 — Features',
    4: 'Slide 4 — UI Showcase',
    5: 'Slide 5 — Closing Outro'
  };

  const historyItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    slideNum: STATE.activeSlide,
    slideName: slideNames[STATE.activeSlide] || `Slide ${STATE.activeSlide}`,
    creator: STATE.settings.CREATOR_NAME ? STATE.settings.CREATOR_NAME.trim() : 'Anonymous',
    promptText: promptText
  };

  STATE.history.unshift(historyItem);

  if (STATE.history.length > 50) {
    STATE.history.pop();
  }

  saveHistory(STATE.history);
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  previewOutput    = document.getElementById('preview-output');
  previewTitle     = document.getElementById('preview-title');
  previewCharCount = document.getElementById('preview-char-count');
  copyBtn          = document.getElementById('btn-copy');
  resetBtn         = document.getElementById('btn-reset');

  // Load settings & apply
  STATE.settings = loadSettings(SETTINGS_DEFAULTS);
  updateProfileWidget(STATE.settings);
  // Load history
  STATE.history = loadHistory();

  // Load prompt batches & active id
  const rawBatches = loadPromptBatches();
  if (Array.isArray(rawBatches)) {
    STATE.promptBatches = normalizePromptBatches(rawBatches);
    STATE.activePromptBatchId = null;
  } else if (rawBatches && typeof rawBatches === 'object') {
    STATE.promptBatches = normalizePromptBatches(rawBatches.batches || []);
    STATE.activePromptBatchId = rawBatches.activeId || null;
  }

  // Init sidebar
  initSidebar();

  // Bind inputs
  bindInputs();

  // Slide tab click handlers
  document.querySelectorAll('.slide-tab').forEach(tab => {
    tab.addEventListener('click', () => switchSlide(parseInt(tab.dataset.slide)));
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchSlide(parseInt(tab.dataset.slide));
      }
    });
  });

  // Copy/Reset buttons
  copyBtn.addEventListener('click', handleCopy);
  resetBtn.addEventListener('click', handleReset);

  // ── AI Auto-Fill ──────────────────────────────────────────
  initAutoFill();

  // Initial render
  switchSlide(1);
});

// =========================================================
// AI AUTO-FILL MODULE
// =========================================================

// Slide key map: backend uses slide1..slide5, STATE uses 1..5
const SLIDE_KEY_MAP = {
  slide1: 1,
  slide2: 2,
  slide3: 3,
  slide4: 4,
  slide5: 5
};

let _lastAutoFillData = null; // holds last successful AI response for Regenerate

function initAutoFill() {
  const btnOpen         = document.getElementById('btn-ai-fill');
  const modal           = document.getElementById('autofill-modal');
  const backdrop        = document.getElementById('autofill-backdrop');
  const btnClose        = document.getElementById('autofill-close');
  const btnCancel       = document.getElementById('autofill-cancel');
  const btnRun          = document.getElementById('autofill-run');
  const btnApply        = document.getElementById('autofill-apply');
  const btnRegenerate   = document.getElementById('autofill-regenerate');

  const briefTextarea   = document.getElementById('af-brief');
  const docFileInput    = document.getElementById('af-doc-file');
  const dropzone        = document.getElementById('af-dropzone');
  const fileNameEl      = document.getElementById('af-file-name');

  const progressEl      = document.getElementById('autofill-progress');
  const progressMsg     = document.getElementById('autofill-progress-msg');
  const resultEl        = document.getElementById('autofill-result');
  const resultStats     = document.getElementById('autofill-result-stats');
  const coverageFill    = document.getElementById('autofill-coverage-fill');
  const emptyFieldsEl   = document.getElementById('autofill-empty-fields');
  const emptyListEl     = document.getElementById('autofill-empty-list');
  const errorEl         = document.getElementById('autofill-error');
  const errorMsg        = document.getElementById('autofill-error-msg');

  // ── Open / Close ────────────────────────────────────────
  function openModal() {
    modal.removeAttribute('hidden');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
    briefTextarea.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  // ── File input ──────────────────────────────────────────
  docFileInput.addEventListener('change', () => {
    const file = docFileInput.files[0];
    if (file) {
      fileNameEl.textContent = file.name;
      dropzone.classList.add('has-file');
    } else {
      fileNameEl.textContent = 'No file selected';
      dropzone.classList.remove('has-file');
    }
  });

  // Drag & drop
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      docFileInput.files = e.dataTransfer.files;
      docFileInput.dispatchEvent(new Event('change'));
    }
  });

  // ── UI state helpers ────────────────────────────────────
  function setLoading(msg = 'Analyzing your content with AI...') {
    progressEl.removeAttribute('hidden');
    progressMsg.textContent = msg;
    resultEl.setAttribute('hidden', '');
    errorEl.setAttribute('hidden', '');
    btnRun.disabled = true;
    btnRun.setAttribute('hidden', '');
    btnApply.setAttribute('hidden', '');
    btnRegenerate.setAttribute('hidden', '');
  }

  function setResult(data, coverage, emptyFields) {
    progressEl.setAttribute('hidden', '');
    resultEl.removeAttribute('hidden');
    errorEl.setAttribute('hidden', '');

    const totalFields = Object.values(data).reduce((acc, s) => acc + Object.keys(s).length, 0);
    const filledCount = totalFields - emptyFields.length;
    resultStats.textContent = `${filledCount} of ${totalFields} fields filled (${coverage}% coverage)`;

    // Animate coverage bar after a tick
    coverageFill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        coverageFill.style.width = `${coverage}%`;
      });
    });

    if (emptyFields.length > 0) {
      emptyFieldsEl.removeAttribute('hidden');
      emptyListEl.innerHTML = emptyFields.map(f =>
        `<span class="autofill-empty-tag">${escapeHtml(f)}</span>`
      ).join('');
    } else {
      emptyFieldsEl.setAttribute('hidden', '');
    }

    btnRun.disabled = false;
    btnRun.setAttribute('hidden', '');
    btnApply.removeAttribute('hidden');
    btnRegenerate.removeAttribute('hidden');
  }

  function setError(msg) {
    progressEl.setAttribute('hidden', '');
    resultEl.setAttribute('hidden', '');
    errorEl.removeAttribute('hidden');
    errorMsg.textContent = msg;
    btnRun.disabled = false;
    btnRun.removeAttribute('hidden');
    btnApply.setAttribute('hidden', '');
    // Keep regenerate visible if we had a previous run
    if (_lastAutoFillData) btnRegenerate.removeAttribute('hidden');
  }

  // ── API call ─────────────────────────────────────────────
  async function runAutoFill() {
    const brief = briefTextarea.value.trim();
    const file  = docFileInput.files[0];

    if (!brief && !file) {
      setError('Please provide a project brief or upload a Markdown/PDF file.');
      return;
    }

    setLoading();

    // Simulate progress messages
    const progressMessages = [
      'Analyzing your content with AI...',
      'Extracting key information...',
      'Building slide copy...',
      'Finalizing output...'
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % progressMessages.length;
      progressMsg.textContent = progressMessages[msgIdx];
    }, 4000);

    try {
      const formData = new FormData();
      formData.append('brief', brief);
      if (file) formData.append('docFile', file);

      const res = await fetch('/api/auto-fill', {
        method: 'POST',
        body: formData
      });

      clearInterval(msgInterval);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `Request failed with status ${res.status}`);
      }

      const { data, coverage, emptyFields } = await res.json();
      _lastAutoFillData = data;

      setResult(data, coverage, emptyFields);
    } catch (err) {
      clearInterval(msgInterval);
      setError(err.message || 'Unknown error. Please try again.');
    }
  }

  // ── Apply to state ───────────────────────────────────────
  function applyAutoFill() {
    if (!_lastAutoFillData) return;

    Object.keys(SLIDE_KEY_MAP).forEach(slideKey => {
      const slideNum = SLIDE_KEY_MAP[slideKey];
      const slideData = _lastAutoFillData[slideKey];
      if (!slideData || !STATE.slides[slideNum]) return;

      Object.keys(slideData).forEach(field => {
        if (STATE.slides[slideNum][field] !== undefined) {
          STATE.slides[slideNum][field] = slideData[field] || '';
        }
      });
    });

    // Update all form inputs to reflect new STATE
    document.querySelectorAll('[data-key]').forEach(el => {
      const key   = el.dataset.key;
      const slide = parseInt(el.dataset.slide);
      if (STATE.slides[slide] && STATE.slides[slide][key] !== undefined) {
        el.value = STATE.slides[slide][key];
      }
    });

    // Re-render preview
    renderPreview();

    // Close modal
    closeModal();

    showToast(`<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-primary);"></i> AI Auto-Fill applied to all 5 slides!`);
  }

  // ── Wire buttons ─────────────────────────────────────────
  btnRun.addEventListener('click', runAutoFill);
  btnApply.addEventListener('click', applyAutoFill);
  btnRegenerate.addEventListener('click', () => {
    resultEl.setAttribute('hidden', '');
    runAutoFill();
  });
}
