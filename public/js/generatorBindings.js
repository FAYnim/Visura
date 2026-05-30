/* =========================================================
  Visura - Generator Bindings (generatorBindings.js)
  ========================================================= */

'use strict';

export function switchSlide({ state, renderPreview, slideNum }) {
  state.activeSlide = slideNum;

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
}
