/* =========================================================
   Visura — Prompt Manager Logic (prompts.js)
   CRUD for prompt batches: create, edit, duplicate, delete,
   set active. Validates required placeholders before save.
   ========================================================= */

'use strict';

import {
  loadPromptBatches,
  savePromptBatches,
  getActivePromptBatch,
  loadSettings,
  updateProfileWidget,
  initSidebar,
  showToast,
  escapeHtml
} from './common.js';

import {
  DEFAULT_PROMPT_BATCH,
  DEFAULT_PROMPTS,
  STOCK_PROMPT_BATCHES,
  createPromptBatch,
  isReadOnlyPromptBatch,
  normalizePromptBatches,
  validateSlideTemplate
} from './promptStore.js';

import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

// =========================================================
// STATE
// =========================================================
const STATE = {
  batches: [],           // user-created batches (excludes virtual default)
  activeId: null,        // id of the batch marked active (null = use default)
  selectedId: null,      // id currently open in the editor
  settings: {}
};



// =========================================================
// DOM REFERENCES
// =========================================================
const batchList         = document.getElementById('batch-list');
const editorNoSelection = document.getElementById('editor-no-selection');
const editorContent     = document.getElementById('editor-content');
const editorTitle       = document.getElementById('editor-title');

const btnCreateBatch    = document.getElementById('btn-create-batch');
const btnSaveBatch      = document.getElementById('btn-save-batch');
const btnDuplicateBatch = document.getElementById('btn-duplicate-batch');
const btnActivateBatch  = document.getElementById('btn-activate-batch');
const btnDeleteBatch    = document.getElementById('btn-delete-batch');

const inputBatchName    = document.getElementById('input-batch-name');
const inputBatchDesc    = document.getElementById('input-batch-desc');
const defaultNotice     = document.getElementById('default-batch-notice');
const batchSkeleton     = document.getElementById('batch-skeleton');

// =========================================================
// HELPERS
// =========================================================
function showSkeleton() {
  batchSkeleton.hidden = false;
  batchList.hidden = true;
}
function hideSkeleton() {
  batchSkeleton.hidden = true;
  batchList.hidden = false;
}
// =========================================================

/** Returns the full list including the virtual default batch at front. */
function allBatches() {
  return [DEFAULT_PROMPT_BATCH, ...STOCK_PROMPT_BATCHES, ...STATE.batches];
}

/** Returns batch object by id (including virtual default). */
function getBatchById(id) {
  if (id === 'default') return DEFAULT_PROMPT_BATCH;
  return STOCK_PROMPT_BATCHES.find(b => b.id === id)
    || STATE.batches.find(b => b.id === id)
    || null;
}

/** Returns whether a given batch id is the active one. */
function isActive(id) {
  if (STATE.activeId === null) return id === 'default';
  return STATE.activeId === id;
}

// =========================================================
// PERSIST
// =========================================================
function persistBatches() {
  // Save user batches + activeId
  savePromptBatches({
    batches: STATE.batches,
    activeId: STATE.activeId
  });
}

// =========================================================
// LOAD FROM STORAGE
// =========================================================
function loadFromStorage() {
  const raw = loadPromptBatches();

  // Support both old format (array) and new format ({batches, activeId})
  if (Array.isArray(raw)) {
    STATE.batches = normalizePromptBatches(raw);
    STATE.activeId = null;
  } else if (raw && typeof raw === 'object') {
    STATE.batches = normalizePromptBatches(raw.batches || []);
    STATE.activeId = raw.activeId || null;
  } else {
    STATE.batches = [];
    STATE.activeId = null;
  }
}

// =========================================================
// RENDER BATCH LIST
// =========================================================
function renderBatchList() {
  batchList.innerHTML = '';

  const all = allBatches();

  if (all.length === 0) {
    batchList.innerHTML = '<li class="batch-empty-state">No batches yet. Create a new batch to get started.</li>';
    return;
  }

  all.forEach(batch => {
    const li = document.createElement('li');
    li.className = 'batch-item' + (STATE.selectedId === batch.id ? ' selected' : '');
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', STATE.selectedId === batch.id ? 'true' : 'false');
    li.dataset.id = batch.id;

    const activeBadge = isActive(batch.id)
      ? `<span class="batch-active-badge">Active</span>`
      : '';

    const createdLabel = batch.isDefault
      ? 'System'
      : (batch.isStock ? 'Stock' : (batch.createdAt ? formatDate(batch.createdAt) : ''));

    li.innerHTML = `
      <div class="batch-item-icon">
        <i class="fa-solid ${isReadOnlyPromptBatch(batch) ? 'fa-lock' : 'fa-layer-group'}"></i>
      </div>
      <div class="batch-item-info">
        <div class="batch-item-name">${escapeHtml(batch.name)}</div>
        <div class="batch-item-meta">${createdLabel}</div>
      </div>
      ${activeBadge}
    `;

    li.addEventListener('click', () => selectBatch(batch.id));
    batchList.appendChild(li);
  });
}

// =========================================================
// SELECT BATCH (open in editor)
// =========================================================
function selectBatch(id) {
  STATE.selectedId = id;
  renderBatchList();

  const batch = getBatchById(id);
  if (!batch) return;

  editorNoSelection.hidden = true;
  editorContent.hidden = false;

  editorTitle.textContent = isReadOnlyPromptBatch(batch) ? batch.name : `Edit: ${batch.name}`;

  // Fill meta fields
  inputBatchName.value = batch.name;
  inputBatchDesc.value = batch.description || '';

  const isReadOnly = isReadOnlyPromptBatch(batch);
  inputBatchName.disabled = isReadOnly;
  inputBatchDesc.disabled = isReadOnly;
  btnSaveBatch.disabled = isReadOnly;
  btnDeleteBatch.disabled = isReadOnly;
  btnDeleteBatch.style.display = isActive(id) ? 'none' : '';

  // Default notice
  defaultNotice.classList.toggle('visible', isReadOnly);

  // Fill slide textareas
  for (let s = 1; s <= 5; s++) {
    const ta = document.getElementById(`slide-textarea-${s}`);
    if (ta) {
      ta.value = batch.slides[s] || '';
      ta.disabled = isReadOnly;
      clearSlideError(s);
    }
  }

  // Activate button state
  if (isActive(id)) {
    btnActivateBatch.classList.add('is-active');
    btnActivateBatch.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-circle-check"></i></span> Active`;
    btnActivateBatch.disabled = true;
  } else {
    btnActivateBatch.classList.remove('is-active');
    btnActivateBatch.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-circle-check"></i></span> Make Active`;
    btnActivateBatch.disabled = false;
  }

  // Default slide tab to slide 1
  switchSlideTab(1);
}

// =========================================================
// SLIDE TAB SWITCHER
// =========================================================
function switchSlideTab(slideNum) {
  document.querySelectorAll('.slide-editor-tab').forEach(tab => {
    const active = parseInt(tab.dataset.slide) === slideNum;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.slide-editor-panel').forEach(panel => {
    panel.classList.toggle('active', parseInt(panel.dataset.slide) === slideNum);
  });
}

// =========================================================
// VALIDATION
// =========================================================
function clearSlideError(slideNum) {
  const errEl = document.getElementById(`slide-error-${slideNum}`);
  const ta = document.getElementById(`slide-textarea-${slideNum}`);
  const tab = document.querySelector(`.slide-editor-tab[data-slide="${slideNum}"]`);
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
  if (ta) ta.classList.remove('error');
  if (tab) tab.classList.remove('has-error');

  // Clear missing tags UI
  const panel = document.querySelector(`.slide-editor-panel[data-slide="${slideNum}"]`);
  if (panel) {
    panel.querySelectorAll('.ph-tag').forEach(tag => tag.classList.remove('missing'));
  }
}

function showSlideError(slideNum, missing) {
  const errEl = document.getElementById(`slide-error-${slideNum}`);
  const ta = document.getElementById(`slide-textarea-${slideNum}`);
  const tab = document.querySelector(`.slide-editor-tab[data-slide="${slideNum}"]`);
  const msg = `Missing required placeholders: ${missing.map(p => `{{${p}}}`).join(', ')}`;
  if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
  if (ta) ta.classList.add('error');
  if (tab) tab.classList.add('has-error');

  // Highlight missing tags UI
  const panel = document.querySelector(`.slide-editor-panel[data-slide="${slideNum}"]`);
  if (panel) {
    panel.querySelectorAll('.ph-tag').forEach(tag => {
      if (tag.dataset.ph && missing.includes(tag.dataset.ph)) {
        tag.classList.add('missing');
      } else {
        tag.classList.remove('missing');
      }
    });
  }
}

/** Returns true if all slides are valid. */
function validateAllSlides() {
  let valid = true;
  for (let s = 1; s <= 5; s++) {
    clearSlideError(s);
    const ta = document.getElementById(`slide-textarea-${s}`);
    if (!ta) continue;
    const missing = validateSlideTemplate(s, ta.value);
    if (missing.length > 0) {
      showSlideError(s, missing);
      valid = false;
    }
  }
  return valid;
}

// =========================================================
// SAVE BATCH
// =========================================================
function handleSaveBatch() {
  const id = STATE.selectedId;
  if (!id) return;

  const batch = getBatchById(id);
  if (!batch || isReadOnlyPromptBatch(batch)) return;

  // Validate
  if (!validateAllSlides()) {
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color:#ff6b6b;"></i> Fix errors on slides before saving.`);
    // Switch to first errored tab
    for (let s = 1; s <= 5; s++) {
      const tab = document.querySelector(`.slide-editor-tab[data-slide="${s}"]`);
      if (tab && tab.classList.contains('has-error')) { switchSlideTab(s); break; }
    }
    return;
  }

  const name = inputBatchName.value.trim();
  if (!name) {
    inputBatchName.focus();
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color:#ff6b6b;"></i> Batch name cannot be empty.`);
    return;
  }

  // Update batch
  batch.name = name;
  batch.description = inputBatchDesc.value.trim();
  for (let s = 1; s <= 5; s++) {
    const ta = document.getElementById(`slide-textarea-${s}`);
    if (ta) batch.slides[s] = ta.value;
  }

  persistBatches();
  renderBatchList();

  // Refresh editor title
  editorTitle.textContent = `Edit: ${batch.name}`;

  showToast(`<i class="fa-solid fa-check" style="color:var(--accent-primary);"></i> Batch "<strong>${escapeHtml(batch.name)}</strong>" saved successfully.`);
}

// =========================================================
// CREATE BATCH
// =========================================================
function handleCreateBatch() {
  showSkeleton();
  setTimeout(() => {
    const name = `New Batch ${STATE.batches.length + 1}`;
    const newBatch = createPromptBatch(name, '', null);
    STATE.batches.push(newBatch);
    persistBatches();
    renderBatchList();
    hideSkeleton();
    selectBatch(newBatch.id);

    setTimeout(() => {
      inputBatchName.select();
      inputBatchName.focus();
    }, 50);

    showToast(`<i class="fa-solid fa-plus" style="color:var(--accent-primary);"></i> New batch created. Fill in the name and edit prompts as needed.`);
  }, 200);
}

// =========================================================
// DUPLICATE BATCH
// =========================================================
function handleDuplicateBatch() {
  const id = STATE.selectedId;
  if (!id) return;

  const source = getBatchById(id);
  if (!source) return;

  showSkeleton();
  setTimeout(() => {
    const newBatch = createPromptBatch(`${source.name} (Duplicate)`, source.description, source);
    STATE.batches.push(newBatch);
    persistBatches();
    renderBatchList();
    hideSkeleton();
    selectBatch(newBatch.id);

    showToast(`<i class="fa-solid fa-copy" style="color:var(--accent-primary);"></i> Batch "<strong>${escapeHtml(source.name)}</strong>" duplicated successfully.`);
  }, 200);
}

// =========================================================
// ACTIVATE BATCH
// =========================================================
function handleActivateBatch() {
  const id = STATE.selectedId;
  if (!id) return;

  showSkeleton();
  setTimeout(() => {
    if (id === 'default') {
      STATE.activeId = null;
    } else {
      STATE.activeId = id;
    }

    persistBatches();
    renderBatchList();
    hideSkeleton();
    selectBatch(id);

    const batch = getBatchById(id);
    const batchName = batch ? batch.name : id;
    showToast(`<i class="fa-solid fa-circle-check" style="color:var(--accent-primary);"></i> Batch "<strong>${escapeHtml(batchName)}</strong>" set as active for the generator.`);
  }, 200);
}

// =========================================================
// DELETE BATCH
// =========================================================
function handleDeleteBatch() {
  const id = STATE.selectedId;
  if (!id) return;

  const batch = getBatchById(id);
  if (!batch || isReadOnlyPromptBatch(batch)) return;

  if (!confirm(`Are you sure you want to delete batch "${batch.name}"? This action cannot be undone.`)) return;

  showSkeleton();

  // If deleted batch was active, reset to default
  if (STATE.activeId === id) STATE.activeId = null;

  STATE.batches = STATE.batches.filter(b => b.id !== id);
  STATE.selectedId = null;

  persistBatches();

  setTimeout(() => {
    renderBatchList();
    hideSkeleton();

    editorNoSelection.hidden = false;
    editorContent.hidden = true;

    showToast(`<i class="fa-regular fa-trash-can" style="color:var(--text-muted);"></i> Batch deleted.`);
  }, 200);
}



function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load settings for profile widget
  STATE.settings = loadSettings(SETTINGS_DEFAULTS);
  updateProfileWidget(STATE.settings);

  // Load batches from storage
  loadFromStorage();

  // Init sidebar
  initSidebar();

  // Render list with skeleton delay
  setTimeout(() => {
    renderBatchList();
    hideSkeleton();
  }, 300);

  // Wire buttons
  btnCreateBatch.addEventListener('click', handleCreateBatch);
  btnSaveBatch.addEventListener('click', handleSaveBatch);
  btnDuplicateBatch.addEventListener('click', handleDuplicateBatch);
  btnActivateBatch.addEventListener('click', handleActivateBatch);
  btnDeleteBatch.addEventListener('click', handleDeleteBatch);

  // Slide tab switching
  document.querySelectorAll('.slide-editor-tab').forEach(tab => {
    tab.addEventListener('click', () => switchSlideTab(parseInt(tab.dataset.slide)));
  });

  // Real-time validation on typing
  document.querySelectorAll('.slide-template-textarea').forEach(ta => {
    ta.addEventListener('input', (e) => {
      const slideNum = parseInt(e.target.dataset.slide);
      const missing = validateSlideTemplate(slideNum, e.target.value);
      if (missing.length > 0) {
        showSlideError(slideNum, missing);
      } else {
        clearSlideError(slideNum);
      }
    });
  });

  // Auto-select first user batch if exists, else show no-selection
  if (STATE.batches.length > 0) {
    // Don't auto-select; let user choose
  }
});
