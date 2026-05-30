/* =========================================================
  Visura - Generator State (generatorState.js)
  ========================================================= */

'use strict';

import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

export { SETTINGS_DEFAULTS };

export const STATE = {
  activeSlide: 1,
  settings: { ...SETTINGS_DEFAULTS },
  history: [],
  promptBatches: [],
  activePromptBatchId: null,
  slides: {
    1: { BADGE_TEXT: '', MAIN_HEADLINE: '', SUBTITLE_TEXT: '' },
    2: {
      SECTION_BADGE: '', MAIN_HEADING: '', PROJECT_DESCRIPTION: '', QUOTE_TEXT: '',
      FEATURE_TITLE_1: '', FEATURE_DESC_1: '',
      FEATURE_TITLE_2: '', FEATURE_DESC_2: '',
      FEATURE_TITLE_3: '', FEATURE_DESC_3: '',
      FEATURE_TITLE_4: '', FEATURE_DESC_4: ''
    },
    3: {
      SECTION_BADGE: '', MAIN_HEADING: '', SUBTITLE_TEXT: '',
      FEATURE_TITLE_1: '', FEATURE_DESC_1: '', FEATURE_UI_1: '',
      FEATURE_TITLE_2: '', FEATURE_DESC_2: '', FEATURE_UI_2: '',
      FEATURE_TITLE_3: '', FEATURE_DESC_3: '', FEATURE_UI_3: '',
      FEATURE_TITLE_4: '', FEATURE_DESC_4: '', FEATURE_UI_4: '',
      FEATURE_TITLE_5: '', FEATURE_DESC_5: '', FEATURE_UI_5: '',
      FEATURE_TITLE_6: '', FEATURE_DESC_6: '', FEATURE_UI_6: '',
      CTA_TEXT: '', CTA_BUTTON: ''
    },
    4: {
      TOP_LEFT_BADGE: '', TOP_RIGHT_LABEL: '', MAIN_HEADLINE: '', SUBTITLE_TEXT: '',
      PILL_TEXT_1: '', PILL_TEXT_2: '', PILL_TEXT_3: '', PILL_TEXT_4: '',
      BRAND_STATEMENT: ''
    },
    5: {
      TOP_BADGE_TEXT: '', MAIN_HEADLINE: '', DESCRIPTION_TEXT: '',
      CREATOR_ROLE: '', CTA_TEXT_1: '', CTA_TEXT_2: ''
    }
  }
};

export function resetSlides(state = STATE) {
  Object.keys(state.slides).forEach(slide => {
    Object.keys(state.slides[slide]).forEach(key => {
      state.slides[slide][key] = '';
    });
  });
}
