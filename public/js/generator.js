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

import { normalizePromptBatches } from './promptStore.js';

import { STATE, SETTINGS_DEFAULTS, resetSlides } from './generatorState.js';
import { compilePlainText } from './generatorTemplates.js';
import { renderPreview as renderPreviewBase } from './generatorRender.js';
import { bindInputs, switchSlide as switchSlideBase } from './generatorBindings.js';
import { addToHistory } from './generatorHistory.js';
import { handleCopy as handleCopyBase, handleReset as handleResetBase } from './generatorClipboard.js';
import { initAutoFill } from './autoFill.js';
import { initCaptionGenerate } from './captionGenerate.js';

'use strict';

// =========================================================
// DOM REFERENCES
// =========================================================
let previewOutput;
let previewTitle;
let previewCharCount;
let copyBtn;
let resetBtn;

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  previewOutput    = document.getElementById('preview-output');
  previewTitle     = document.getElementById('preview-title');
  previewCharCount = document.getElementById('preview-char-count');
  copyBtn          = document.getElementById('btn-copy');
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
    addToHistory: addToHistoryBound,
    showToast,
    copyBtn
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

  // Copy/Reset buttons
  copyBtn.addEventListener('click', handleCopy);
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
  switchSlideBase({ state: STATE, renderPreview, slideNum: 1 });
});
