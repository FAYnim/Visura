/**
 * JSON schema describing the exact output structure expected from the LLM.
 * All values are strings; empty string means "not found / leave blank".
 */
const SCHEMA = {
  slide1: {
    BADGE_TEXT: '',
    MAIN_HEADLINE: '',
    SUBTITLE_TEXT: ''
  },
  slide2: {
    SECTION_BADGE: '',
    MAIN_HEADING: '',
    PROJECT_DESCRIPTION: '',
    QUOTE_TEXT: '',
    FEATURE_TITLE_1: '',
    FEATURE_DESC_1: '',
    FEATURE_TITLE_2: '',
    FEATURE_DESC_2: '',
    FEATURE_TITLE_3: '',
    FEATURE_DESC_3: '',
    FEATURE_TITLE_4: '',
    FEATURE_DESC_4: ''
  },
  slide3: {
    SECTION_BADGE: '',
    MAIN_HEADING: '',
    SUBTITLE_TEXT: '',
    FEATURE_TITLE_1: '',
    FEATURE_DESC_1: '',
    FEATURE_TITLE_2: '',
    FEATURE_DESC_2: '',
    FEATURE_TITLE_3: '',
    FEATURE_DESC_3: '',
    FEATURE_TITLE_4: '',
    FEATURE_DESC_4: '',
    FEATURE_TITLE_5: '',
    FEATURE_DESC_5: '',
    FEATURE_TITLE_6: '',
    FEATURE_DESC_6: '',
    CTA_TEXT: '',
    CTA_BUTTON: ''
  },
  slide4: {
    TOP_LEFT_BADGE: '',
    TOP_RIGHT_LABEL: '',
    MAIN_HEADLINE: '',
    SUBTITLE_TEXT: '',
    PILL_TEXT_1: '',
    PILL_TEXT_2: '',
    PILL_TEXT_3: '',
    PILL_TEXT_4: '',
    BRAND_STATEMENT: ''
  },
  slide5: {
    TOP_BADGE_TEXT: '',
    MAIN_HEADLINE: '',
    DESCRIPTION_TEXT: '',
    CREATOR_ROLE: '',
    CTA_TEXT_1: '',
    CTA_TEXT_2: ''
  },
  caption: {
    TEXT: ''
  }
};

export { SCHEMA };
