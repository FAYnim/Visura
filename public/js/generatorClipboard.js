/* =========================================================
  Visura - Generator Clipboard (generatorClipboard.js)
  ========================================================= */

'use strict';

function getActiveText(state, compilePlainText) {
  if (state.activeSlide === 'caption') {
    return state.caption || '';
  }

  return compilePlainText(state.activeSlide, state);
}

function setButtonSuccess(button, label) {
  const originalContent = button.innerHTML;
  button.classList.add('copied');
  button.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> ${label}`;

  setTimeout(() => {
    button.classList.remove('copied');
    button.innerHTML = originalContent;
  }, 2000);
}

export function handleCopy({ state, compilePlainText, showToast, copyBtn }) {
  const text = getActiveText(state, compilePlainText);
  const label = state.activeSlide === 'caption' ? 'Caption copied!' : 'Prompt copied to clipboard!';

  navigator.clipboard.writeText(text).then(() => {
    setButtonSuccess(copyBtn, 'Copied!');
    showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> ${label}`);
  }).catch(() => {
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i> Failed to copy. Please try again.`);
  });
}

export function handleSave({ state, compilePlainText, addToHistory, showToast, saveBtn }) {
  const text = getActiveText(state, compilePlainText);
  const label = state.activeSlide === 'caption' ? 'Caption saved to history!' : 'Prompt saved to history!';

  addToHistory(text);
  setButtonSuccess(saveBtn, 'Saved!');
  showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> ${label}`);
}

export function handleReset({ state, renderPreview, showToast, resetSlides }) {
  // 1. Reset slide data for all slides (1 to 5) to empty string
  resetSlides(state);

  // 2. Clear all form inputs with [data-key]
  document.querySelectorAll('[data-key]').forEach(el => {
    el.value = '';
  });

  // 3. Clear caption textarea
  const captionEl = document.getElementById('caption-text');
  if (captionEl) captionEl.value = '';

  // 4. Restore preview to placeholder state
  renderPreview();

  // 5. Show user feedback toast
  showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> All generator inputs have been reset.`);
}
