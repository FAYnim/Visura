import { getDecryptedByokKey, hasByokKey } from './byok.js';
import {
  incrementQuota,
  getRemainingQuota,
  hasQuotaRemaining,
  getDailyLimit
} from './autoFillQuota.js';

'use strict';

const MODEL_STORAGE_KEY = 'visura_last_model';

let _lastCaption = '';

export function initCaptionGenerate({ state, renderPreview, showToast, escapeHtml }) {
  const btnOpen       = document.getElementById('btn-generate-caption');
  const modal         = document.getElementById('caption-modal');
  const backdrop      = document.getElementById('caption-backdrop');
  const btnClose      = document.getElementById('caption-close');
  const btnCancel     = document.getElementById('caption-cancel');
  const btnRun        = document.getElementById('caption-run');
  const btnApply      = document.getElementById('caption-apply');
  const btnRegenerate = document.getElementById('caption-regenerate');

  const briefTextarea = document.getElementById('caption-brief');
  const docFileInput  = document.getElementById('caption-doc-file');
  const dropzone      = document.getElementById('caption-dropzone');
  const fileNameEl    = document.getElementById('caption-file-name');

  const modelSelect   = document.getElementById('caption-model');
  const quotaEl       = document.getElementById('caption-quota');

  const progressEl    = document.getElementById('caption-progress');
  const progressFill  = document.getElementById('caption-progress-fill');
  const progressMsg   = document.getElementById('caption-progress-msg');
  const resultEl      = document.getElementById('caption-result');
  const resultStats   = document.getElementById('caption-result-stats');
  const resultPreview = document.getElementById('caption-result-preview');
  const errorEl       = document.getElementById('caption-error');
  const errorMsg      = document.getElementById('caption-error-msg');

  const FALLBACK_MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'gemini' },
    { id: 'llama-3.3-70b',    label: 'LLaMA 3.3 70B',    provider: 'groq'   },
  ];

  function getSelectedProvider() {
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    const model = modelSelect.value || '';
    return selectedOption?.dataset?.provider ||
      (model.startsWith('gemini') ? 'gemini' : model.startsWith('llama') ? 'groq' : null);
  }

  function isByokProvider() {
    const provider = getSelectedProvider();
    return provider ? hasByokKey(provider) : false;
  }

  function updateQuotaUI() {
    if (!quotaEl) return;

    if (isByokProvider()) {
      quotaEl.setAttribute('hidden', '');
      btnRun.disabled = false;
      return;
    }

    quotaEl.removeAttribute('hidden');
    const remaining = getRemainingQuota();
    const limit = getDailyLimit();

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

  function setLoading(msg = 'Writing your structured storytelling caption...') {
    progressEl.removeAttribute('hidden');
    progressMsg.textContent = msg;
    progressFill.style.width = '35%';
    resultEl.setAttribute('hidden', '');
    errorEl.setAttribute('hidden', '');
    btnRun.disabled = true;
    btnRun.setAttribute('hidden', '');
    btnApply.setAttribute('hidden', '');
    btnRegenerate.setAttribute('hidden', '');
  }

  function setResult(caption) {
    progressEl.setAttribute('hidden', '');
    progressFill.style.width = '100%';
    resultEl.removeAttribute('hidden');
    errorEl.setAttribute('hidden', '');
    resultStats.textContent = `${caption.length.toLocaleString()} characters`;
    resultPreview.innerHTML = `<span class="autofill-empty-tag">${escapeHtml(caption).replace(/\n/g, '<br>')}</span>`;
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
    if (_lastCaption) btnRegenerate.removeAttribute('hidden');
  }

  async function runCaptionGenerate() {
    const brief = briefTextarea.value.trim();
    const file = docFileInput.files[0];
    const model = modelSelect.value;

    if (!model) {
      setError('Please select an AI model.');
      return;
    }

    if (!brief && !file) {
      setError('Please provide a project brief or upload a Markdown/PDF file.');
      return;
    }

    const provider = getSelectedProvider();
    const usingByok = provider ? hasByokKey(provider) : false;

    if (!usingByok) {
      if (!hasQuotaRemaining()) {
        setError(`Daily quota exhausted (${getDailyLimit()}/${getDailyLimit()} requests used). Resets tomorrow, or add your own API key under "API Keys".`);
        updateQuotaUI();
        return;
      }
      incrementQuota();
      updateQuotaUI();
    }

    setLoading();

    const progressMessages = [
      'Reading your project context...',
      'Finding the story angle...',
      'Writing your Instagram caption...',
      'Polishing tone and structure...'
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % progressMessages.length;
      progressMsg.textContent = progressMessages[msgIdx];
      progressFill.style.width = `${Math.min(90, 35 + msgIdx * 15)}%`;
    }, 4000);

    try {
      const formData = new FormData();
      formData.append('brief', brief);
      formData.append('model', model);
      if (file) formData.append('docFile', file);

      if (usingByok) {
        const byokKey = await getDecryptedByokKey(provider);
        if (byokKey) formData.append('byokKey', byokKey);
      }

      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        body: formData
      });

      clearInterval(msgInterval);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `Request failed with status ${res.status}`);
      }

      const { caption } = await res.json();
      if (!caption || typeof caption !== 'string') throw new Error('Caption response is invalid.');
      _lastCaption = caption.trim();
      localStorage.setItem(MODEL_STORAGE_KEY, model);
      setResult(_lastCaption);
    } catch (err) {
      clearInterval(msgInterval);
      setError(err.message || 'Unknown error. Please try again.');
    }
  }

  function applyCaption() {
    if (!_lastCaption) return;
    state.caption = _lastCaption;
    const captionEl = document.getElementById('caption-text');
    if (captionEl) captionEl.value = state.caption;
    renderPreview();
    closeModal();
    showToast(`<i class="fa-solid fa-comment-dots" style="color: var(--accent-primary);"></i> Caption applied!`);
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

  btnRun.addEventListener('click', runCaptionGenerate);
  btnApply.addEventListener('click', applyCaption);
  btnRegenerate.addEventListener('click', () => {
    resultEl.setAttribute('hidden', '');
    runCaptionGenerate();
  });
  modelSelect.addEventListener('change', updateQuotaUI);
}
