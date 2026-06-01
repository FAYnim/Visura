/* =========================================================
  Visura - Generator Clipboard (generatorClipboard.js)
  ========================================================= */

'use strict';

export function handleCopy({ state, compilePlainText, addToHistory, showToast, copyBtn }) {
  // Caption mode — copy state.caption directly
  if (state.activeSlide === 'caption') {
    const captionText = state.caption || '';
    navigator.clipboard.writeText(captionText).then(() => {
      const originalContent = copyBtn.innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Copied!`;

      showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> Caption copied!`);

      addToHistory(captionText);

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalContent;
      }, 2000);
    }).catch(() => {
      showToast(`<i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i> Failed to copy. Please try again.`);
    });
    return;
  }

  const plain = compilePlainText(state.activeSlide, state);

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
