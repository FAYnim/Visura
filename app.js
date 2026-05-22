/* =========================================================
   PromptFlex — Application Logic Engine
   ========================================================= */

'use strict';

// =========================================================
// MASTER PROMPT TEMPLATES
// =========================================================
const TEMPLATES = {
  1: `Create a premium futuristic Instagram carousel cover slide for a modern digital product portfolio showcase using the uploaded project screenshot as the main interface display.

IMPORTANT:
Use the uploaded screenshot image as the main dashboard/interface shown inside the floating UI frame.
Preserve the original UI design while integrating it naturally into the premium futuristic composition.

Canvas size:
1080x1350 portrait.

Style:
minimal futuristic SaaS presentation, cinematic dark UI aesthetic, premium startup branding, modern product showcase, inspired by Apple keynote, Linear, Stripe, Framer, and Behance featured projects.

Background:
deep black cinematic background with subtle grain texture, soft atmospheric blue and green glow lighting, minimal dotted particle details, luxurious futuristic ambiance.

Top left badge:
small rounded capsule outline with subtle neon green glow and small green indicator dot.
Badge text:
"{{BADGE_TEXT}}"

Main hero heading:
large ultra-bold editorial sans-serif typography positioned on the upper left area.
Heading text:
"{{MAIN_HEADLINE}}"

Typography style:
massive bold sans-serif font, metallic silver-to-white gradient, clean kerning, premium editorial composition, modern luxury tech branding.

Subtitle below heading:
"{{SUBTITLE_TEXT}}"

Main showcase:
large floating interface frame positioned at the center-right area.
Frame style:
minimal dark glassmorphic browser-style frame with rounded corners, subtle transparency, soft border glow, cinematic reflections, and a premium floating effect.

IMPORTANT:
Embed the uploaded screenshot naturally into the floating interface frame with realistic perspective alignment, subtle reflections, soft glow integration, and premium screen presentation. Do not redesign the uploaded interface. Preserve the original UI layout from the screenshot.

Bottom area:
dark abstract rocky terrain surface with subtle blue cinematic lighting reflections. The terrain should feel futuristic, premium, atmospheric, sci-fi inspired, and minimal but cinematic.

Footer branding:
minimal creator branding placed on bottom left corner.
Creator text:
"Crafted by {{CREATOR_NAME}}"

Overall mood:
luxurious futuristic SaaS presentation, cinematic UI showcase, premium digital product branding, Behance featured portfolio aesthetic, modern startup visual identity.`,

  // Slides 2, 4, 5 share this template
  case_study: `Create a premium futuristic Instagram carousel slide for a modern digital product portfolio case study using the uploaded project screenshot as the main interface showcase.

IMPORTANT:
Use the uploaded screenshot image as the interface displayed inside the floating browser frame.
Preserve the original UI design while integrating it naturally into the cinematic premium composition.

Canvas size:
1080x1350 portrait.

Style:
minimal futuristic SaaS presentation, luxury startup branding, cinematic dark UI aesthetic, modern editorial layout, inspired by Apple keynote, Linear, Stripe, Framer, and high-end Behance case studies.

Background:
deep black cinematic background with subtle grain texture, soft atmospheric green and blue glow lighting, minimal dotted particle details, elegant futuristic ambiance.

Top left badge:
small rounded capsule outline with subtle neon green glow and small indicator dot.
Badge text:
"{{SECTION_BADGE}}"

Main heading:
large ultra-bold editorial sans-serif typography positioned on the upper left side.
Heading text:
"{{MAIN_HEADING}}"

Typography style:
massive bold sans-serif font, metallic silver gradient, premium editorial hierarchy, clean kerning, luxurious modern tech branding.

Accent divider:
short neon green horizontal line placed below the heading.

Description section:
clean modern paragraph explaining the project/product.
Description text:
"{{PROJECT_DESCRIPTION}}"
Highlight important keywords in neon green.

Quote card:
small dark glassmorphic quote card below the description.
Quote text:
"{{QUOTE_TEXT}}"
Quote card style:
minimal rounded dark glass panel with subtle border glow and elegant futuristic appearance.

Main showcase:
large floating browser-style interface frame positioned on the upper right area.
Frame style:
dark transparent browser frame with rounded corners, soft reflections, cinematic glow, subtle glassmorphism, and an elegant floating perspective.

IMPORTANT:
Embed the uploaded screenshot naturally into the browser frame with realistic lighting integration, subtle reflections, soft bloom, and premium presentation styling. Do not redesign the uploaded UI. Preserve the original interface appearance.

Composition:
allow part of the browser frame to extend slightly outside the canvas for cinematic framing and immersive composition.

Dashboard aesthetic:
modern dark SaaS dashboard with electric blue highlights, modern analytics charts, clean widgets, premium spacing, futuristic enterprise interface, and modular UI sections.

Feature cards section:
display 4 premium feature cards horizontally near the bottom section.
Feature card style:
dark glassmorphism panels, subtle border glow, rounded corners, minimal futuristic UI, elegant spacing, premium SaaS aesthetic.

Feature placeholders:
Feature 1:
Title: "{{FEATURE_TITLE_1}}"
Description: "{{FEATURE_DESC_1}}"

Feature 2:
Title: "{{FEATURE_TITLE_2}}"
Description: "{{FEATURE_DESC_2}}"

Feature 3:
Title: "{{FEATURE_TITLE_3}}"
Description: "{{FEATURE_DESC_3}}"

Feature 4:
Title: "{{FEATURE_TITLE_4}}"
Description: "{{FEATURE_DESC_4}}"

Overall mood:
luxurious futuristic product presentation, cinematic UI showcase, premium startup branding, modern digital product case study, Behance featured project aesthetic.

Quality:
ultra detailed, cinematic lighting, realistic reflections, soft bloom glow, high-end art direction, sophisticated composition, elegant visual hierarchy, premium portfolio presentation.`,

  3: `Create a premium futuristic Instagram carousel slide showcasing the main features of a modern digital product platform using the uploaded project screenshot and UI style as inspiration.

Canvas size:
1080x1350 portrait.

Style:
luxurious futuristic SaaS presentation, cinematic dark UI aesthetic, premium startup branding, modern enterprise dashboard showcase, inspired by Apple keynote, Linear, Stripe, Framer, and Behance featured UI case studies.

Background:
deep black cinematic background with subtle grain texture, soft atmospheric blue and green glow lighting, elegant dotted particle decorations, futuristic ambient mood.

Top left badge:
small rounded capsule outline with subtle neon green glow and indicator dot.
Badge text:
"{{SECTION_BADGE}}"

Main heading:
large ultra-bold editorial sans-serif typography positioned on the upper left area.
Heading text:
"{{MAIN_HEADING}}"

Typography style:
massive metallic silver-to-white gradient text, premium editorial hierarchy, clean kerning, luxurious modern tech branding.

Subtitle:
"{{SUBTITLE_TEXT}}"

Main layout:
display a premium modular feature grid consisting of 6 feature cards arranged in 2 columns and 3 rows.

Feature card style:
dark glassmorphism panels with rounded corners, subtle border glow, soft reflections, cinematic shadows, futuristic SaaS styling, and elegant spacing.

Each feature card contains a glowing futuristic neon icon, feature title, short feature description, and an embedded mini UI preview/dashboard module.

Feature placeholders:
Feature 1:
Title: "{{FEATURE_TITLE_1}}"
Description: "{{FEATURE_DESC_1}}"
Mini UI: "{{FEATURE_UI_1}}"

Feature 2:
Title: "{{FEATURE_TITLE_2}}"
Description: "{{FEATURE_DESC_2}}"
Mini UI: "{{FEATURE_UI_2}}"

Feature 3:
Title: "{{FEATURE_TITLE_3}}"
Description: "{{FEATURE_DESC_3}}"
Mini UI: "{{FEATURE_UI_3}}"

Feature 4:
Title: "{{FEATURE_TITLE_4}}"
Description: "{{FEATURE_DESC_4}}"
Mini UI: "{{FEATURE_UI_4}}"

Feature 5:
Title: "{{FEATURE_TITLE_5}}"
Description: "{{FEATURE_DESC_5}}"
Mini UI: "{{FEATURE_UI_5}}"

Feature 6:
Title: "{{FEATURE_TITLE_6}}"
Description: "{{FEATURE_DESC_6}}"
Mini UI: "{{FEATURE_UI_6}}"

Mini UI style:
modern dark dashboard widgets with neon blue/green highlights, futuristic charts, premium UI spacing, subtle glow, and an enterprise SaaS appearance.

Bottom section:
full-width premium CTA bar positioned at the bottom.
CTA bar style:
dark glassmorphism panel with elegant spacing and subtle glow.
CTA text:
"{{CTA_TEXT}}"

CTA button text:
"{{CTA_BUTTON}}"
Button style:
minimal futuristic dark button with neon arrow icon and subtle glow.

Overall mood:
premium enterprise SaaS branding, futuristic UI showcase, cinematic digital product presentation, Behance featured project aesthetic, luxurious startup portfolio design.

Quality:
ultra detailed, cinematic lighting, realistic reflections, elegant composition, sophisticated art direction, premium visual hierarchy, modern futuristic presentation.`
};

// Resolve template for a slide number
function getTemplateForSlide(slide) {
  if (slide === 1) return TEMPLATES[1];
  if (slide === 3) return TEMPLATES[3];
  return TEMPLATES.case_study; // Slides 2, 4, 5
}

// =========================================================
// STATE MACHINE
// =========================================================
const STATE = {
  activeSlide: 1,
  global: {
    CREATOR_NAME: ''
  },
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
      SECTION_BADGE: '', MAIN_HEADING: '', PROJECT_DESCRIPTION: '', QUOTE_TEXT: '',
      FEATURE_TITLE_1: '', FEATURE_DESC_1: '',
      FEATURE_TITLE_2: '', FEATURE_DESC_2: '',
      FEATURE_TITLE_3: '', FEATURE_DESC_3: '',
      FEATURE_TITLE_4: '', FEATURE_DESC_4: ''
    },
    5: {
      SECTION_BADGE: '', MAIN_HEADING: '', PROJECT_DESCRIPTION: '', QUOTE_TEXT: '',
      FEATURE_TITLE_1: '', FEATURE_DESC_1: '',
      FEATURE_TITLE_2: '', FEATURE_DESC_2: '',
      FEATURE_TITLE_3: '', FEATURE_DESC_3: '',
      FEATURE_TITLE_4: '', FEATURE_DESC_4: ''
    }
  }
};

// =========================================================
// TEMPLATE COMPILER
// =========================================================
function compileTemplate(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const globalData = STATE.global;

  // Merge all data sources
  const allData = { ...slideData, ...globalData };

  // Replace with span-based highlighting
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    if (value && value.trim() !== '') {
      return `<span class="ph-filled">${escapeHtml(value)}</span>`;
    } else {
      return `<span class="ph-empty">[${key}]</span>`;
    }
  });
}

// Compile to plain text (for clipboard)
function compilePlainText(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const globalData = STATE.global;
  const allData = { ...slideData, ...globalData };

  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    return (value && value.trim() !== '') ? value : `[${key}]`;
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =========================================================
// DOM REFERENCES
// =========================================================
let previewOutput;
let previewTitle;
let previewCharCount;
let toast;
let copyBtn;
let clearBtn;

// =========================================================
// RENDER ENGINE
// =========================================================
function renderPreview() {
  const compiled = compileTemplate(STATE.activeSlide);
  previewOutput.innerHTML = compiled;

  // Character count (plain text)
  const plain = compilePlainText(STATE.activeSlide);
  const charCount = plain.length;
  previewCharCount.textContent = `${charCount.toLocaleString()} chars`;

  // Update preview title
  const slideNames = {
    1: 'Slide 1 — Cover',
    2: 'Slide 2 — Case Study',
    3: 'Slide 3 — Features',
    4: 'Slide 4 — Case Study',
    5: 'Slide 5 — Case Study'
  };
  previewTitle.textContent = `${slideNames[STATE.activeSlide]} Prompt`;
}

// =========================================================
// SLIDE SWITCHER
// =========================================================
function switchSlide(slideNum) {
  STATE.activeSlide = slideNum;

  // Update tab active states
  document.querySelectorAll('.slide-tab').forEach(tab => {
    const isActive = parseInt(tab.dataset.slide) === slideNum;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update form panels
  document.querySelectorAll('.form-panel').forEach(panel => {
    const isActive = parseInt(panel.dataset.slide) === slideNum;
    panel.classList.toggle('active', isActive);
  });

  renderPreview();
}

// =========================================================
// INPUT BINDING
// =========================================================
function bindInputs() {
  // Global creator name
  const creatorInput = document.getElementById('input-creator-name');
  if (creatorInput) {
    creatorInput.value = STATE.global.CREATOR_NAME;
    creatorInput.addEventListener('input', e => {
      STATE.global.CREATOR_NAME = e.target.value;
      renderPreview();
    });
  }

  // All form inputs/textareas with data-key and data-slide
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const slide = parseInt(el.dataset.slide);

    // Restore state
    if (STATE.slides[slide] && STATE.slides[slide][key] !== undefined) {
      el.value = STATE.slides[slide][key];
    }

    el.addEventListener('input', e => {
      if (STATE.slides[slide] && STATE.slides[slide][key] !== undefined) {
        STATE.slides[slide][key] = e.target.value;
        if (STATE.activeSlide === slide) {
          renderPreview();
        }
      }
    });
  });
}

// =========================================================
// COPY BUTTON
// =========================================================
function handleCopy() {
  const plain = compilePlainText(STATE.activeSlide);

  navigator.clipboard.writeText(plain).then(() => {
    // Button feedback
    const originalContent = copyBtn.innerHTML;
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `<span class="btn-icon">✓</span> Copied!`;

    // Toast
    showToast('✓ Prompt copied to clipboard!');

    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = originalContent;
    }, 2000);
  }).catch(() => {
    showToast('⚠ Failed to copy. Please try again.');
  });
}

// =========================================================
// CLEAR BUTTON
// =========================================================
function handleClear() {
  const slide = STATE.activeSlide;
  const defaults = {};

  // Reset all keys to empty
  Object.keys(STATE.slides[slide]).forEach(key => {
    defaults[key] = '';
    STATE.slides[slide][key] = '';
  });

  // Reset DOM inputs for this slide
  document.querySelectorAll(`[data-slide="${slide}"][data-key]`).forEach(el => {
    el.value = '';
  });

  renderPreview();
  showToast(`↺ Slide ${slide} cleared.`);
}

// =========================================================
// TOAST
// =========================================================
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  previewOutput = document.getElementById('preview-output');
  previewTitle = document.getElementById('preview-title');
  previewCharCount = document.getElementById('preview-char-count');
  toast = document.getElementById('app-toast');
  copyBtn = document.getElementById('btn-copy');
  clearBtn = document.getElementById('btn-clear');

  // Bind inputs
  bindInputs();

  // Slide tab click handlers
  document.querySelectorAll('.slide-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchSlide(parseInt(tab.dataset.slide));
    });

    // Keyboard accessibility
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchSlide(parseInt(tab.dataset.slide));
      }
    });
  });

  // Copy/Clear buttons
  copyBtn.addEventListener('click', handleCopy);
  clearBtn.addEventListener('click', handleClear);

  // Initial render
  switchSlide(1);
});
