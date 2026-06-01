/* =========================================================
  Visura - Generator Bindings (generatorBindings.js)
  ========================================================= */

'use strict';

export function switchSlide({ state, renderPreview, slideNum }) {
  state.activeSlide = slideNum;

  document.querySelectorAll('.slide-tab').forEach(tab => {
    const isActive = String(slideNum) === tab.dataset.slide;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.form-panel').forEach(panel => {
    const isActive = String(slideNum) === panel.dataset.slide;
    panel.classList.toggle('active', isActive);
  });

  renderPreview();
}

export function bindInputs({ state, renderPreview }) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const slide = parseInt(el.dataset.slide);

    if (state.slides[slide] && state.slides[slide][key] !== undefined) {
      el.value = state.slides[slide][key];
    }

    el.addEventListener('input', e => {
      if (state.slides[slide] && state.slides[slide][key] !== undefined) {
        state.slides[slide][key] = e.target.value;
        if (state.activeSlide === slide) {
          renderPreview();
        }
      }
    });
  });

  // Bind caption textarea by id (no data-key)
  const captionEl = document.getElementById('caption-text');
  if (captionEl) {
    captionEl.value = state.caption;
    captionEl.addEventListener('input', e => {
      state.caption = e.target.value;
      if (state.activeSlide === 'caption') {
        renderPreview();
      }
    });
  }
}

