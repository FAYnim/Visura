/* =========================================================
  Visura - Auto-Fill Module (autoFill.js)
  ========================================================= */

'use strict';

import { getDecryptedByokKey, hasByokKey } from './byok.js';
import {
  loadQuota,
  incrementQuota,
  getRemainingQuota,
  hasQuotaRemaining,
  getDailyLimit
} from './autoFillQuota.js';

const SLIDE_KEY_MAP = {
  slide1: 1,
  slide2: 2,
  slide3: 3,
  slide4: 4,
  slide5: 5
};

const MODEL_STORAGE_KEY = 'visura_last_model';

let _lastAutoFillData = null;

export function initAutoFill({ state, renderPreview, showToast, escapeHtml }) {
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

  const modelSelect     = document.getElementById('af-model');
  const quotaEl         = document.getElementById('autofill-quota');

  const progressEl      = document.getElementById('autofill-progress');
  const progressMsg     = document.getElementById('autofill-progress-msg');
  const resultEl        = document.getElementById('autofill-result');
  const resultStats     = document.getElementById('autofill-result-stats');
  const coverageFill    = document.getElementById('autofill-coverage-fill');
  const emptyFieldsEl   = document.getElementById('autofill-empty-fields');
  const emptyListEl     = document.getElementById('autofill-empty-list');
  const errorEl         = document.getElementById('autofill-error');
  const errorMsg        = document.getElementById('autofill-error-msg');

  const FALLBACK_MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'gemini' },
    { id: 'llama-3.3-70b',    label: 'LLaMA 3.3 70B',    provider: 'groq'   },
  ];

  /* ---- BYOK detection for currently selected model ---- */
  function isByokProvider() {
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    const model    = modelSelect.value || '';
    const provider = selectedOption?.dataset?.provider ||
      (model.startsWith('gemini') ? 'gemini' : model.startsWith('llama') ? 'groq' : null);
    return provider ? hasByokKey(provider) : false;
  }

  /* ---- Quota UI update ---- */
  function updateQuotaUI() {
    if (!quotaEl) return;

    if (isByokProvider()) {
      /* BYOK: no quota restriction — hide the indicator */
      quotaEl.setAttribute('hidden', '');
      btnRun.disabled = false;
      return;
    }

    quotaEl.removeAttribute('hidden');
    const remaining = getRemainingQuota();
    const limit     = getDailyLimit();

    if (remaining <= 0) {
      quotaEl.className = 'autofill-quota autofill-quota--exhausted';
      quotaEl.innerHTML = `<i class="fa-solid fa-ban"></i> Daily quota exhausted (${limit}/${limit} used). Resets tomorrow or use your own API key.`;
      btnRun.disabled = true;
    } else {
      quotaEl.className = `autofill-quota${remaining === 1 ? ' autofill-quota--warning' : ''}`;
      quotaEl.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> <strong>${remaining}</strong> of ${limit} free requests remaining today.`;
      btnRun.disabled = false;
    }
  }

  function openModal() {
    modal.removeAttribute('hidden');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
    briefTextarea.focus();
    loadModels();
    updateQuotaUI();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  async function loadModels() {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="">Loading models...</option>';
    try {
      const res = await fetch('/api/models');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { models } = await res.json();
      if (models && models.length > 0) {
        modelSelect.innerHTML = models.map(m => {
          const provider = m.provider ||
            (m.id.startsWith('gemini') ? 'gemini' : m.id.startsWith('llama') ? 'groq' : '');
          return `<option value="${m.id}" data-provider="${provider}">${m.label}</option>`;
        }).join('');
      } else {
        throw new Error('No models available');
      }
    } catch {
      modelSelect.innerHTML = FALLBACK_MODELS.map(m =>
        `<option value="${m.id}" data-provider="${m.provider}">${m.label}</option>`
      ).join('');
    }
    const saved = localStorage.getItem(MODEL_STORAGE_KEY);
    if (saved) {
      const option = modelSelect.querySelector(`option[value="${saved}"]`);
      if (option) option.selected = true;
    }
    modelSelect.disabled = false;
    updateQuotaUI();
  }

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

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
    if (_lastAutoFillData) btnRegenerate.removeAttribute('hidden');
  }

  async function runAutoFill() {
    const brief = briefTextarea.value.trim();
    const file  = docFileInput.files[0];
    const model = modelSelect.value;

    if (!model) {
      setError('Please select an AI model.');
      return;
    }

    if (!brief && !file) {
      setError('Please provide a project brief or upload a Markdown/PDF file.');
      return;
    }

    /* ---- BYOK detection ---- */
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    const provider = selectedOption?.dataset?.provider ||
      (model.startsWith('gemini') ? 'gemini' : model.startsWith('llama') ? 'groq' : null);
    const usingByok = provider ? hasByokKey(provider) : false;

    /* ---- Quota check (developer key only) ---- */
    if (!usingByok) {
      if (!hasQuotaRemaining()) {
        setError(`Daily quota exhausted (${getDailyLimit()}/${getDailyLimit()} requests used). Resets tomorrow, or add your own API key under "API Keys".`);
        updateQuotaUI();
        return;
      }
      /* Count this attempt before the request, regardless of outcome (REQ-003) */
      incrementQuota();
      updateQuotaUI();
    }

    setLoading();

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
      formData.append('model', model);
      if (file) formData.append('docFile', file);

      /* ---- BYOK: attach decrypted key if stored for this provider ---- */
      if (usingByok) {
        const byokKey = await getDecryptedByokKey(provider);
        if (byokKey) formData.append('byokKey', byokKey);
      }

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
      localStorage.setItem(MODEL_STORAGE_KEY, model);

      setResult(data, coverage, emptyFields);
    } catch (err) {
      clearInterval(msgInterval);
      setError(err.message || 'Unknown error. Please try again.');
    }
  }

  function applyAutoFill() {
    if (!_lastAutoFillData) return;
    Object.keys(SLIDE_KEY_MAP).forEach(slideKey => {
      const slideNum = SLIDE_KEY_MAP[slideKey];
      const slideData = _lastAutoFillData[slideKey];
      if (!slideData || !state.slides[slideNum]) return;
      Object.keys(slideData).forEach(field => {
        if (state.slides[slideNum][field] !== undefined) {
          state.slides[slideNum][field] = slideData[field] || '';
        }
      });
    });
    document.querySelectorAll('[data-key]').forEach(el => {
      const key   = el.dataset.key;
      const slide = parseInt(el.dataset.slide);
      if (state.slides[slide] && state.slides[slide][key] !== undefined) {
        el.value = state.slides[slide][key];
      }
    });
    // Populate caption from auto-fill response
    state.caption = _lastAutoFillData.caption?.TEXT || '';
    const captionEl = document.getElementById('caption-text');
    if (captionEl) captionEl.value = state.caption;
    renderPreview();
    closeModal();
    showToast(`<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-primary);"></i> AI Auto-Fill applied to all 5 slides + caption!`);
  }

  btnRun.addEventListener('click', runAutoFill);
  btnApply.addEventListener('click', applyAutoFill);
  btnRegenerate.addEventListener('click', () => {
    resultEl.setAttribute('hidden', '');
    runAutoFill();
  });

  /* Update quota UI whenever user changes model (BYOK toggle) */
  modelSelect.addEventListener('change', updateQuotaUI);
}
