/* =========================================================
  Visura - Auto-Fill Module (autoFill.js)
  ========================================================= */

'use strict';

// Slide key map: backend uses slide1..slide5, STATE uses 1..5
const SLIDE_KEY_MAP = {
  slide1: 1,
  slide2: 2,
  slide3: 3,
  slide4: 4,
  slide5: 5
};

let _lastAutoFillData = null; // holds last successful AI response for Regenerate

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
      if (!slideData || !state.slides[slideNum]) return;

      Object.keys(slideData).forEach(field => {
        if (state.slides[slideNum][field] !== undefined) {
          state.slides[slideNum][field] = slideData[field] || '';
        }
      });
    });

    // Update all form inputs to reflect new STATE
    document.querySelectorAll('[data-key]').forEach(el => {
      const key   = el.dataset.key;
      const slide = parseInt(el.dataset.slide);
      if (state.slides[slide] && state.slides[slide][key] !== undefined) {
        el.value = state.slides[slide][key];
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
