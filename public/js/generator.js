/* =========================================================
  Visura - Generator Page Logic (generator.js)
  Entry point that wires smaller modules together.
  ========================================================= */

import {
  escapeHtml,
  loadSettings,
  loadHistory,
  saveHistory,
  loadPromptBatches,
  updateProfileWidget,
  initSidebar,
  showToast
} from './common.js';

import { STOCK_PROMPT_BATCHES, normalizePromptBatches } from './promptStore.js';

import { STATE, SETTINGS_DEFAULTS, resetSlides } from './generatorState.js';
import { compilePlainText } from './generatorTemplates.js';
import { renderPreview as renderPreviewBase } from './generatorRender.js';
import { bindInputs, switchSlide as switchSlideBase } from './generatorBindings.js';
import { addToHistory } from './generatorHistory.js';
import { handleCopy as handleCopyBase, handleSave as handleSaveBase, handleReset as handleResetBase } from './generatorClipboard.js';
import { initAutoFill } from './autoFill.js';
import { initCaptionGenerate } from './captionGenerate.js';

'use strict';

// =========================================================
// DOM REFERENCES
// =========================================================
let previewPanel;
let previewLoader;
let previewOutput;
let previewTitle;
let previewCharCount;
let copyBtn;
let saveBtn;
let resetBtn;

function finishInitialPreviewLoading(startedAt) {
  const minimumDurationMs = 320;
  const elapsedMs = performance.now() - startedAt;
  const remainingMs = Math.max(0, minimumDurationMs - elapsedMs);

  window.setTimeout(() => {
    if (previewPanel) {
      previewPanel.classList.remove('is-loading');
    }

    if (previewLoader) {
      previewLoader.setAttribute('aria-hidden', 'true');
    }
  }, remainingMs);
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const previewLoadingStartedAt = performance.now();

  previewPanel     = document.querySelector('.preview-panel');
  previewLoader    = document.getElementById('preview-loader');
  previewOutput    = document.getElementById('preview-output');
  previewTitle     = document.getElementById('preview-title');
  previewCharCount = document.getElementById('preview-char-count');
  copyBtn          = document.getElementById('btn-copy');
  saveBtn          = document.getElementById('btn-save');
  resetBtn         = document.getElementById('btn-reset');

  const renderPreview = () => renderPreviewBase({
    state: STATE,
    previewOutput,
    previewTitle,
    previewCharCount
  });

  const addToHistoryBound = (promptText) => addToHistory({
    state: STATE,
    saveHistory
  }, promptText);

  const handleCopy = () => handleCopyBase({
    state: STATE,
    compilePlainText,
    showToast,
    copyBtn
  });

  const handleSave = () => handleSaveBase({
    state: STATE,
    compilePlainText,
    addToHistory: addToHistoryBound,
    showToast,
    saveBtn
  });

  const handleReset = () => handleResetBase({
    state: STATE,
    renderPreview,
    showToast,
    resetSlides
  });

  // Load settings & apply
  STATE.settings = loadSettings(SETTINGS_DEFAULTS);
  updateProfileWidget(STATE.settings);
  // Load history
  STATE.history = loadHistory();

  const rawBatches = loadPromptBatches();
  let userBatches = [];

  if (Array.isArray(rawBatches)) {
    userBatches = normalizePromptBatches(rawBatches);
    STATE.activePromptBatchId = null;
  } else if (rawBatches && typeof rawBatches === 'object') {
    userBatches = normalizePromptBatches(rawBatches.batches || []);
    STATE.activePromptBatchId = rawBatches.activeId || null;
  } else {
    userBatches = [];
    STATE.activePromptBatchId = null;
  }

  STATE.promptBatches = [...STOCK_PROMPT_BATCHES, ...userBatches];

  // Init sidebar
  initSidebar();

  // Bind inputs
  bindInputs({ state: STATE, renderPreview });

  // Slide tab click handlers
  document.querySelectorAll('.slide-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const raw = tab.dataset.slide;
      const slideNum = raw === 'caption' ? 'caption' : parseInt(raw);
      switchSlideBase({ state: STATE, renderPreview, slideNum });
    });
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const raw = tab.dataset.slide;
        const slideNum = raw === 'caption' ? 'caption' : parseInt(raw);
        switchSlideBase({ state: STATE, renderPreview, slideNum });
      }
    });
  });

  // Copy/Save/Reset buttons
  copyBtn.addEventListener('click', handleCopy);
  saveBtn.addEventListener('click', handleSave);
  resetBtn.addEventListener('click', handleReset);

  // ── AI Auto-Fill ──────────────────────────────────────────
  initAutoFill({
    state: STATE,
    renderPreview,
    showToast,
    escapeHtml
  });

  initCaptionGenerate({
    state: STATE,
    renderPreview,
    showToast,
    escapeHtml
  });

  // Initial render
  try {
    switchSlideBase({ state: STATE, renderPreview, slideNum: 1 });
  } finally {
    finishInitialPreviewLoading(previewLoadingStartedAt);
  }
});
