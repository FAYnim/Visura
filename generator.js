/* =========================================================
   PromptFlex — Generator Page Logic (generator.js)
   ========================================================= */

import {
  STORAGE_KEYS,
  escapeHtml,
  loadSettings,
  saveSettings,
  loadHistory,
  saveHistory,
  updateProfileWidget,
  applyThemeAccent,
  initSidebar,
  showToast
} from './common.js';

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

  // Slides 2 share this template
  case_study: `Create a premium futuristic Instagram carousel slide for a modern digital product portfolio project overview using the uploaded project screenshot as the main interface showcase.

IMPORTANT:
Use the uploaded screenshot image as the interface displayed inside the floating browser frame.
Preserve the original UI design while integrating it naturally into the cinematic premium composition.

Canvas size:
1080x1350 portrait.

Style:
minimal futuristic SaaS presentation, luxury startup branding, cinematic dark UI aesthetic, modern editorial layout, inspired by Apple keynote, Linear, Stripe, Framer, and high-end Behance project overviews.

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
luxurious futuristic product presentation, cinematic UI showcase, premium startup branding, modern digital product project overview, Behance featured project aesthetic.

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
ultra detailed, cinematic lighting, realistic reflections, elegant composition, sophisticated art direction, premium visual hierarchy, modern futuristic presentation.`,

  4: `Create a premium futuristic Instagram carousel slide designed as a cinematic digital product UI showcase using the uploaded project screenshots as the main interface visuals.

IMPORTANT:
Use the uploaded screenshots as the interfaces displayed inside the floating futuristic display panels.
Preserve the original UI designs while integrating them naturally into the immersive cinematic environment.

Canvas size:
1080x1350 portrait.

Style:
luxurious futuristic SaaS campaign aesthetic, cinematic sci-fi interface presentation, premium startup branding, immersive AI platform showcase, inspired by Apple keynote visuals, futuristic operating system concepts, sci-fi command centers, Linear, Stripe, and high-end Behance presentations.

Background:
deep black cinematic background with subtle grain texture, atmospheric blue glow, soft green ambient lighting, futuristic haze, minimal particle details, immersive sci-fi atmosphere.

Top left branding badge:
minimal segmented capsule with subtle borders and elegant futuristic styling.

Badge text:
"{{TOP_LEFT_BADGE}}"

Examples:
"INSIGHT v1.0"
"PLATFORM v2.1"
"SYSTEM CORE"

Top right editorial label:
small uppercase luxury typography with large letter spacing.

Label text:
"{{TOP_RIGHT_LABEL}}"

Examples:
"AI-POWERED ANALYTICS"
"ENTERPRISE AI PLATFORM"
"FUTURE SYSTEM INTERFACE"

Main hero typography:
massive centered ultra-bold editorial sans-serif heading.

Heading text:
"{{MAIN_HEADLINE}}"

Examples:
"INSIGHT.
ENGINEERED."

"SMART.
AUTOMATED."

Typography style:
metallic silver-to-white gradient, oversized scale, cinematic editorial hierarchy, luxurious modern tech branding, strong negative space.

Subtitle below heading:
"{{SUBTITLE_TEXT}}"

Example:
"Real-time analytics platform for smarter decisions."

Highlight one important keyword in neon green.

Feature pills section:
display 4 premium futuristic pills below the subtitle.

Pill placeholders:

Pill 1:
"{{PILL_TEXT_1}}"

Pill 2:
"{{PILL_TEXT_2}}"

Pill 3:
"{{PILL_TEXT_3}}"

Pill 4:
"{{PILL_TEXT_4}}"

Examples:
"Responsive"
"React + Tailwind"
"Dark Mode"
"Realtime System"

Pill style:
minimal dark glassmorphism capsules with:
- subtle neon icons
- soft glow
- rounded corners
- futuristic premium UI styling

Main composition:
create an immersive futuristic stage presentation using 3 floating interface displays.

Center display:
large primary dashboard interface positioned front-facing in the middle.

Left display:
angled perspective interface panel positioned partially outside the canvas.

Right display:
angled perspective interface panel positioned partially outside the canvas.

Display style:
floating futuristic browser panels with:
- cinematic reflections
- glowing purple edge lighting
- subtle transparency
- premium glassmorphism
- immersive perspective depth
- soft bloom lighting

IMPORTANT:
Embed the uploaded screenshots naturally into the floating display panels with realistic perspective transformation, cinematic reflections, glow integration, and premium presentation styling.

Do not redesign the uploaded interfaces.
Preserve the original UI appearance.

Environment:
create a futuristic stage environment underneath the interfaces using:
- glowing blue perspective floor lines
- neon runway lighting
- subtle reflective surfaces
- immersive cinematic depth
- sci-fi presentation atmosphere

Lighting:
use:
- electric blue glow
- soft purple edge lighting
- subtle green accent lighting
- cinematic bloom
- atmospheric shadows

Footer left:
minimal creator branding.

Creator text:
"Crafted by {{CREATOR_NAME}}"

Footer right:
minimal editorial brand statement.

Brand statement:
"{{BRAND_STATEMENT}}"

Examples:
"BUILT FOR DEVELOPERS.
DESIGNED FOR IMPACT."

Overall mood:
futuristic product UI showcase, immersive AI platform showcase, cinematic enterprise SaaS branding, luxury startup presentation, sci-fi UI ecosystem aesthetic, Behance featured project quality.

Quality:
ultra detailed, cinematic lighting, realistic reflections, soft bloom glow, immersive perspective composition, sophisticated art direction, premium futuristic branding, high-end visual hierarchy.`,

  5: `Create a premium futuristic Instagram carousel closing slide for a modern UI/UX portfolio presentation.

Canvas size:
1080x1350 portrait.

Style:
minimal futuristic luxury aesthetic, cinematic SaaS branding, elegant tech presentation, premium portfolio outro screen, inspired by Apple keynote visuals, Linear, Stripe, futuristic AI interfaces, and Behance featured presentations.

Background:
deep black cinematic background with:
- subtle grain texture
- soft blue ambient glow on the left
- soft green ambient glow on the right
- atmospheric vignette
- minimal futuristic particles
- dark luxury mood

Main composition:
centered symmetrical layout with elegant spacing and strong visual hierarchy.

Background element:
create a giant subtle circular outline behind the main content, resembling:
- futuristic HUD interface
- cinematic presentation frame
- sci-fi system UI

The circle should be:
- very thin
- subtle
- low opacity
- softly glowing

Top badge:
small futuristic capsule badge centered at the top.

Badge text:
"{{TOP_BADGE_TEXT}}"

Examples:
"THANK YOU"
"FINAL SLIDE"
"END OF SHOWCASE"

Badge style:
- rounded capsule
- thin subtle border
- small neon green indicator dot
- uppercase editorial typography
- elegant spacing

Main hero typography:
large oversized bold geometric sans-serif typography.

Headline text:
"{{MAIN_HEADLINE}}"

Examples:
"Built with Passion."
"Designed for Impact."
"Crafted with Vision."
"Made for the Future."

Typography style:
- metallic silver gradient
- cinematic luxury typography
- ultra-bold
- centered alignment
- oversized scale
- modern editorial spacing

Divider section:
place a thin horizontal divider below the headline with:
- subtle glow
- tiny neon waveform pulse in the center
- futuristic signal aesthetic

Description text:
centered minimal paragraph below the divider.

Description placeholder:
"{{DESCRIPTION_TEXT}}"

Example:
"Every feature. Every line of code.
Crafted to solve real problems and deliver real impact."

Highlight one important keyword using neon green.

Creator card:
centered premium glassmorphism identity card.

Card contains:
- creator logo placeholder
- creator name
- creator role or label
- small neon status indicator

Creator placeholders:
"{{CREATOR_NAME}}"
"{{CREATOR_ROLE}}"

Examples:
"Alex Morgan"
"UI/UX Designer"
"Frontend Developer"
"Creative Engineer"

Card style:
- dark transparent glass
- subtle reflections
- soft border
- futuristic luxury UI
- rounded corners
- cinematic glow

CTA section:
create 2 futuristic CTA rows below the creator card.

CTA 1:
icon + text + glowing horizontal line

Text placeholder:
"{{CTA_TEXT_1}}"

CTA 2:
icon + text + glowing horizontal line

Text placeholder:
"{{CTA_TEXT_2}}"

Examples:
"Follow for more projects"
"Open for collaboration"
"Available for freelance"
"Let's build something together"

CTA style:
- minimal futuristic icons
- subtle neon green glow
- thin glowing connector lines
- clean spacing
- elegant modern UI aesthetic

Social section:
place minimal monochrome social media icons at the bottom center.

Style:
- circular outline buttons
- minimal luxury design
- subtle glow
- evenly spaced
- monochrome futuristic styling

Lighting:
use:
- soft blue ambient glow
- subtle green neon accents
- cinematic bloom
- dark atmospheric shadows
- premium futuristic reflections

Overall mood:
cinematic portfolio ending screen, luxury creator branding, futuristic UI showcase outro, elegant tech presentation, premium Behance-quality visual design.

Quality:
ultra detailed, cinematic composition, elegant typography, sophisticated art direction, premium lighting, futuristic branding aesthetic, clean visual hierarchy.`
};

// =========================================================
// TEMPLATE RESOLVER
// =========================================================
function getTemplateForSlide(slide) {
  if (slide === 1) return TEMPLATES[1];
  if (slide === 3) return TEMPLATES[3];
  if (slide === 4) return TEMPLATES[4];
  if (slide === 5) return TEMPLATES[5];
  return TEMPLATES.case_study; // Slide 2
}

// =========================================================
// STATE MACHINE
// =========================================================
const SETTINGS_DEFAULTS = {
  CREATOR_NAME: '',
  CREATOR_ROLE: '',
  PROMPT_SUFFIX: '',
  THEME_ACCENT: 'green'
};

const STATE = {
  activeSlide: 1,
  settings: { ...SETTINGS_DEFAULTS },
  history: [],
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

// =========================================================
// TEMPLATE COMPILER
// =========================================================
function compileTemplate(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const allData = { ...slideData, ...STATE.settings };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    if (value && value.trim() !== '') {
      return `<span class="ph-filled">${escapeHtml(value)}</span>`;
    } else {
      return `<span class="ph-empty">[${key}]</span>`;
    }
  });

  if (STATE.settings.PROMPT_SUFFIX && STATE.settings.PROMPT_SUFFIX.trim() !== '') {
    compiled += `\n\n<span class="ph-filled">${escapeHtml(STATE.settings.PROMPT_SUFFIX.trim())}</span>`;
  }

  return compiled;
}

function compilePlainText(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const allData = { ...slideData, ...STATE.settings };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    return (value && value.trim() !== '') ? value : `[${key}]`;
  });

  if (STATE.settings.PROMPT_SUFFIX && STATE.settings.PROMPT_SUFFIX.trim() !== '') {
    compiled += '\n\n' + STATE.settings.PROMPT_SUFFIX.trim();
  }

  return compiled;
}

// =========================================================
// DOM REFERENCES
// =========================================================
let previewOutput;
let previewTitle;
let previewCharCount;
let copyBtn;
let clearBtn;

// =========================================================
// RENDER ENGINE
// =========================================================
function renderPreview() {
  const compiled = compileTemplate(STATE.activeSlide);
  previewOutput.innerHTML = compiled;

  const plain = compilePlainText(STATE.activeSlide);
  previewCharCount.textContent = `${plain.length.toLocaleString()} chars`;

  const slideNames = { 1: 'Slide 1', 2: 'Slide 2', 3: 'Slide 3', 4: 'Slide 4', 5: 'Slide 5' };
  previewTitle.textContent = `${slideNames[STATE.activeSlide]} Prompt`;
}

// =========================================================
// SLIDE SWITCHER
// =========================================================
function switchSlide(slideNum) {
  STATE.activeSlide = slideNum;

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

// =========================================================
// INPUT BINDING
// =========================================================
function bindInputs() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const slide = parseInt(el.dataset.slide);

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
// COPY HANDLER
// =========================================================
function handleCopy() {
  const plain = compilePlainText(STATE.activeSlide);

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

// =========================================================
// CLEAR HANDLER
// =========================================================
function handleClear() {
  const slide = STATE.activeSlide;

  Object.keys(STATE.slides[slide]).forEach(key => {
    STATE.slides[slide][key] = '';
  });

  document.querySelectorAll(`[data-slide="${slide}"][data-key]`).forEach(el => {
    el.value = '';
  });

  renderPreview();
  showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> Slide ${slide} cleared.`);
}

// =========================================================
// HISTORY ENGINE
// =========================================================
function addToHistory(promptText) {
  const slideNames = {
    1: 'Slide 1 — Cover',
    2: 'Slide 2 — Project Overview',
    3: 'Slide 3 — Features',
    4: 'Slide 4 — UI Showcase',
    5: 'Slide 5 — Closing Outro'
  };

  const historyItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    slideNum: STATE.activeSlide,
    slideName: slideNames[STATE.activeSlide] || `Slide ${STATE.activeSlide}`,
    creator: STATE.settings.CREATOR_NAME ? STATE.settings.CREATOR_NAME.trim() : 'Anonymous',
    promptText: promptText
  };

  STATE.history.unshift(historyItem);

  if (STATE.history.length > 50) {
    STATE.history.pop();
  }

  saveHistory(STATE.history);
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  previewOutput    = document.getElementById('preview-output');
  previewTitle     = document.getElementById('preview-title');
  previewCharCount = document.getElementById('preview-char-count');
  copyBtn          = document.getElementById('btn-copy');
  clearBtn         = document.getElementById('btn-clear');

  // Load settings & apply
  STATE.settings = loadSettings(SETTINGS_DEFAULTS);
  updateProfileWidget(STATE.settings);
  applyThemeAccent(STATE.settings.THEME_ACCENT || 'green');

  // Load history
  STATE.history = loadHistory();

  // Init sidebar
  initSidebar();

  // Bind inputs
  bindInputs();

  // Slide tab click handlers
  document.querySelectorAll('.slide-tab').forEach(tab => {
    tab.addEventListener('click', () => switchSlide(parseInt(tab.dataset.slide)));
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
