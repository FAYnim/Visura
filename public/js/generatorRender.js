/* =========================================================
  Visura - Generator Render (generatorRender.js)
  ========================================================= */

'use strict';

import { compileTemplate, compilePlainText } from './generatorTemplates.js';

export function renderPreview({ state, previewOutput, previewTitle, previewCharCount }) {
  const compiled = compileTemplate(state.activeSlide, state);
  previewOutput.innerHTML = compiled;

  const plain = compilePlainText(state.activeSlide, state);
  previewCharCount.textContent = `${plain.length.toLocaleString()} chars`;

  const slideNames = { 1: 'Slide 1', 2: 'Slide 2', 3: 'Slide 3', 4: 'Slide 4', 5: 'Slide 5' };
  previewTitle.textContent = `${slideNames[state.activeSlide]} Prompt`;
}
