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
ultra detailed, cinematic lighting, realistic reflections, elegant composition, sophisticated art direction, premium visual hierarchy, modern futuristic presentation.`
,
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
ultra detailed, cinematic lighting, realistic reflections, soft bloom glow, immersive perspective composition, sophisticated art direction, premium futuristic branding, high-end visual hierarchy.`
,
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
"Let’s build something together"

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

// Resolve template for a slide number
function getTemplateForSlide(slide) {
  if (slide === 1) return TEMPLATES[1];
  if (slide === 3) return TEMPLATES[3];
  if (slide === 4) return TEMPLATES[4];
  if (slide === 5) return TEMPLATES[5];
  return TEMPLATES.case_study; // Slides 2, 5
}

// =========================================================
// STATE MACHINE
// =========================================================
const STATE = {
  activeSlide: 1,
  activeView: 'generator', // 'generator' or 'riwayat'
  sidebarCollapsed: true, // Desktop collapse layout state
  mobileMenuOpen: false, // Mobile overlay drawer open state
  history: [], // List of prompt history entries
  global: {
    CREATOR_NAME: '',
    CREATOR_ROLE: '',
    PROMPT_SUFFIX: '',
    THEME_ACCENT: 'green'
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
    5: {
      TOP_BADGE_TEXT: '',
      MAIN_HEADLINE: '',
      DESCRIPTION_TEXT: '',
      CREATOR_ROLE: '',
      CTA_TEXT_1: '',
      CTA_TEXT_2: ''
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
  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    if (value && value.trim() !== '') {
      return `<span class="ph-filled">${escapeHtml(value)}</span>`;
    } else {
      return `<span class="ph-empty">[${key}]</span>`;
    }
  });

  // Append global prompt suffix if present
  if (STATE.global.PROMPT_SUFFIX && STATE.global.PROMPT_SUFFIX.trim() !== '') {
    compiled += `\n\n<span class="ph-filled">${escapeHtml(STATE.global.PROMPT_SUFFIX.trim())}</span>`;
  }

  return compiled;
}

// Compile to plain text (for clipboard)
function compilePlainText(slideNum) {
  const template = getTemplateForSlide(slideNum);
  const slideData = STATE.slides[slideNum] || {};
  const globalData = STATE.global;
  const allData = { ...slideData, ...globalData };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    return (value && value.trim() !== '') ? value : `[${key}]`;
  });

  // Append global prompt suffix if present
  if (STATE.global.PROMPT_SUFFIX && STATE.global.PROMPT_SUFFIX.trim() !== '') {
    compiled += '\n\n' + STATE.global.PROMPT_SUFFIX.trim();
  }

  return compiled;
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
// GLOBAL SETTINGS & THEME ENGINE
// =========================================================
function saveSettings() {
  try {
    localStorage.setItem('promptflex_global_settings', JSON.stringify(STATE.global));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

function loadSettings() {
  try {
    const stored = localStorage.getItem('promptflex_global_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      STATE.global = { ...STATE.global, ...settings };
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
  }
}

function updateProfileWidget() {
  const profileNameEl = document.querySelector('.profile-name');
  if (profileNameEl) {
    profileNameEl.textContent = STATE.global.CREATOR_NAME && STATE.global.CREATOR_NAME.trim() !== '' 
      ? STATE.global.CREATOR_NAME.trim() 
      : 'Faris AY';
  }
  const profileTitleEl = document.querySelector('.profile-title');
  if (profileTitleEl) {
    profileTitleEl.textContent = STATE.global.CREATOR_ROLE && STATE.global.CREATOR_ROLE.trim() !== '' 
      ? STATE.global.CREATOR_ROLE.trim() 
      : 'Settings';
  }
}

function applyThemeAccent(accent) {
  const root = document.documentElement;
  const accents = {
    green: { primary: '#00ff66', glow: 'rgba(0, 255, 102, 0.25)', code: '#00ff66' },
    blue: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.25)', code: '#60a5fa' },
    violet: { primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.25)', code: '#f472b6' },
    red: { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.25)', code: '#fb7185' }
  };

  const colors = accents[accent] || accents.green;
  root.style.setProperty('--accent-primary', colors.primary);
  root.style.setProperty('--accent-glow', colors.glow);
  root.style.setProperty('--text-code', colors.code);

  STATE.global.THEME_ACCENT = accent;

  // Update accent selector buttons in view settings
  document.querySelectorAll('.accent-select-btn').forEach(btn => {
    const isActive = btn.dataset.accent === accent;
    btn.classList.toggle('active', isActive);
  });
}

function populateSettingsInputs() {
  const creatorNameInput = document.getElementById('setting-creator-name');
  const creatorRoleInput = document.getElementById('setting-creator-role');
  const promptSuffixInput = document.getElementById('setting-prompt-suffix');

  if (creatorNameInput) creatorNameInput.value = STATE.global.CREATOR_NAME || '';
  if (creatorRoleInput) creatorRoleInput.value = STATE.global.CREATOR_ROLE || '';
  if (promptSuffixInput) promptSuffixInput.value = STATE.global.PROMPT_SUFFIX || '';

  applyThemeAccent(STATE.global.THEME_ACCENT || 'green');
}

function saveGlobalSettings() {
  const creatorNameInput = document.getElementById('setting-creator-name');
  const creatorRoleInput = document.getElementById('setting-creator-role');
  const promptSuffixInput = document.getElementById('setting-prompt-suffix');

  if (creatorNameInput) STATE.global.CREATOR_NAME = creatorNameInput.value;
  if (creatorRoleInput) STATE.global.CREATOR_ROLE = creatorRoleInput.value;
  if (promptSuffixInput) STATE.global.PROMPT_SUFFIX = promptSuffixInput.value;

  saveSettings();
  updateProfileWidget();
  renderPreview();
  showToast(`<i class="fa-solid fa-check" style="color: var(--accent-primary);"></i> Pengaturan disimpan!`);
}

function resetGlobalSettings() {
  const confirmClear = confirm("Apakah Anda yakin ingin menyetel ulang seluruh pengaturan global ke default?");
  if (confirmClear) {
    STATE.global.CREATOR_NAME = '';
    STATE.global.CREATOR_ROLE = '';
    STATE.global.PROMPT_SUFFIX = '';
    STATE.global.THEME_ACCENT = 'green';

    applyThemeAccent('green');
    
    const creatorNameInput = document.getElementById('setting-creator-name');
    const creatorRoleInput = document.getElementById('setting-creator-role');
    const promptSuffixInput = document.getElementById('setting-prompt-suffix');

    if (creatorNameInput) creatorNameInput.value = '';
    if (creatorRoleInput) creatorRoleInput.value = '';
    if (promptSuffixInput) promptSuffixInput.value = '';

    saveSettings();
    updateProfileWidget();
    renderPreview();
    showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> Pengaturan disetel ulang.`);
  }
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
    1: 'Slide 1',
    2: 'Slide 2',
    3: 'Slide 3',
    4: 'Slide 4',
    5: 'Slide 5'
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
    copyBtn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Copied!`;

    // Toast
    showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> Prompt copied to clipboard!`);

    // Add to history list & persist
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
  showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> Slide ${slide} cleared.`);
}

// =========================================================
// TOAST
// =========================================================
function showToast(message) {
  toast.innerHTML = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// =========================================================
// VIEW & SIDEBAR TOGGLING
// =========================================================
function switchView(viewName) {
  STATE.activeView = viewName;

  // Toggle active class on sidebar buttons
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    const isActive = btn.dataset.view === viewName;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Toggle active class on profile button (Settings tab)
  const profileBtn = document.getElementById('btn-settings-profile');
  if (profileBtn) {
    profileBtn.classList.toggle('active', viewName === 'settings');
  }

  // Toggle visible class on views
  document.querySelectorAll('.app-view').forEach(view => {
    const isActive = view.id === `view-${viewName}`;
    view.classList.toggle('active', isActive);
  });

  if (viewName === 'riwayat') {
    // Clear search query and render everything
    const searchInput = document.getElementById('history-search');
    if (searchInput) searchInput.value = '';
    renderHistory();
  }

  if (viewName === 'settings') {
    populateSettingsInputs();
  }

  // On mobile, auto-close the drawer when switching views
  if (window.innerWidth <= 768) {
    toggleMobileSidebar(false);
  }
}

// =========================================================
// HISTORY (RIWAYAT) ENGINE
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
    creator: STATE.global.CREATOR_NAME ? STATE.global.CREATOR_NAME.trim() : 'Anonymous',
    promptText: promptText
  };

  // Add to start of history list
  STATE.history.unshift(historyItem);

  // Cap at 50 items
  if (STATE.history.length > 50) {
    STATE.history.pop();
  }

  saveHistory();
}

function saveHistory() {
  try {
    localStorage.setItem('promptflex_history', JSON.stringify(STATE.history));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

function loadHistory() {
  try {
    const stored = localStorage.getItem('promptflex_history');
    if (stored) {
      STATE.history = JSON.parse(stored);
    } else {
      STATE.history = [];
    }
  } catch (e) {
    console.error('Failed to load history from localStorage', e);
    STATE.history = [];
  }
}

function renderHistory(searchQuery = '') {
  const historyListContainer = document.getElementById('history-list');
  if (!historyListContainer) return;

  const query = searchQuery.trim().toLowerCase();
  
  // Filter history
  const filtered = STATE.history.filter(item => {
    if (!query) return true;
    return item.slideName.toLowerCase().includes(query) ||
           item.creator.toLowerCase().includes(query) ||
           item.promptText.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    // Show empty state
    if (STATE.history.length === 0) {
      historyListContainer.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon-wrap" aria-hidden="true">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
          <h3 class="empty-title">Belum ada riwayat prompt</h3>
          <p class="empty-desc">Setiap kali Anda menyalin prompt di menu Generator, prompt tersebut akan otomatis terekam secara aman di sini.</p>
          <button class="btn btn-primary btn-empty-cta" onclick="switchView('generator')">
            <span class="btn-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
            Mulai Generator
          </button>
        </div>
      `;
    } else {
      historyListContainer.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon-wrap" aria-hidden="true">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="empty-title">Tidak ada hasil pencarian</h3>
          <p class="empty-desc">Tidak dapat menemukan riwayat dengan kata kunci "${escapeHtml(searchQuery)}". Silakan coba kata kunci lain.</p>
          <button class="btn btn-secondary btn-empty-cta" onclick="clearHistorySearch()">
            Bersihkan Pencarian
          </button>
        </div>
      `;
    }
    return;
  }

  // Generate cards HTML
  let cardsHtml = '';
  filtered.forEach(item => {
    const timeString = formatRelativeTime(new Date(item.timestamp));
    
    // Highlight matched text if query is active
    let highlightedText = escapeHtml(item.promptText);
    let highlightedTitle = escapeHtml(item.slideName);
    let highlightedCreator = escapeHtml(item.creator);

    if (query) {
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="search-match-hl">$1</span>');
      highlightedTitle = highlightedTitle.replace(regex, '<span class="search-match-hl">$1</span>');
      highlightedCreator = highlightedCreator.replace(regex, '<span class="search-match-hl">$1</span>');
    }

    cardsHtml += `
      <div class="history-card" data-id="${item.id}" id="card-${item.id}">
        <div class="history-card-header">
          <div class="history-card-meta">
            <h3 class="history-card-title">${highlightedTitle}</h3>
            <span class="history-card-time" title="${escapeHtml(new Date(item.timestamp).toLocaleString())}">
              <i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${timeString}
            </span>
          </div>
          <button class="history-card-delete" data-id="${item.id}" aria-label="Hapus item riwayat" title="Hapus dari riwayat">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <div class="history-card-body">
          <pre class="history-card-text">${highlightedText}</pre>
        </div>

        <div class="history-card-footer">
          <div class="history-card-creator">
            <i class="fa-regular fa-user"></i>
            <span class="creator-name">${highlightedCreator}</span>
          </div>
          <button class="btn-history-copy" data-id="${item.id}" aria-label="Salin kembali prompt ini">
            <span class="btn-icon"><i class="fa-regular fa-copy"></i></span>
            Salin Kembali
          </button>
        </div>
      </div>
    `;
  });

  historyListContainer.innerHTML = cardsHtml;

  // Bind event listeners for card elements
  // Delete buttons
  historyListContainer.querySelectorAll('.history-card-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      deleteHistoryItem(id);
    });
  });

  // Copy buttons
  historyListContainer.querySelectorAll('.btn-history-copy').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      handleHistoryCopy(id, btn);
    });
  });
}

function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 15) {
    return 'baru saja';
  } else if (diffSec < 60) {
    return `${diffSec} detik yang lalu`;
  } else if (diffMin < 60) {
    return `${diffMin} menit yang lalu`;
  } else if (diffHr < 24) {
    return `${diffHr} jam yang lalu`;
  } else if (diffDays === 1) {
    return 'kemarin';
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clearHistorySearch() {
  const searchInput = document.getElementById('history-search');
  if (searchInput) {
    searchInput.value = '';
    renderHistory();
  }
}

function deleteHistoryItem(id) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    // Elegant fade out animation before removal
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      STATE.history = STATE.history.filter(item => item.id !== id);
      saveHistory();
      renderHistory(document.getElementById('history-search')?.value || '');
      showToast(`<i class="fa-solid fa-trash-can" style="color: var(--text-secondary);"></i> Riwayat dihapus.`);
    }, 250);
  }
}

function handleHistoryCopy(id, btn) {
  const item = STATE.history.find(x => x.id === id);
  if (!item) return;

  navigator.clipboard.writeText(item.promptText).then(() => {
    // Button feedback
    const originalContent = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Tersalin!`;

    showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> Prompt disalin kembali!`);

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalContent;
    }, 2000);
  }).catch(() => {
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i> Gagal menyalin. Silakan coba lagi.`);
  });
}

function clearAllHistory() {
  if (STATE.history.length === 0) {
    showToast(`<i class="fa-solid fa-circle-info" style="color: var(--text-secondary);"></i> Belum ada riwayat untuk dihapus.`);
    return;
  }

  const confirmClear = confirm("Apakah Anda yakin ingin menghapus seluruh riwayat prompt? Tindakan ini tidak dapat dibatalkan.");
  if (confirmClear) {
    STATE.history = [];
    saveHistory();
    renderHistory();
    showToast(`<i class="fa-solid fa-trash-can" style="color: var(--text-secondary);"></i> Seluruh riwayat dibersihkan.`);
  }
}

// Expose view functions globally for empty state CTA buttons
window.switchView = switchView;
window.clearHistorySearch = clearHistorySearch;

// =========================================================
// SIDEBAR COLLAPSIBLE ENGINE (PERSISTENCE & EVENTS)
// =========================================================
function saveLayoutPreferences() {
  try {
    localStorage.setItem('promptflex_sidebar_collapsed', JSON.stringify(STATE.sidebarCollapsed));
  } catch (e) {
    console.error('Failed to save layout preferences', e);
  }
}

function loadLayoutPreferences() {
  try {
    const stored = localStorage.getItem('promptflex_sidebar_collapsed');
    if (stored !== null) {
      STATE.sidebarCollapsed = JSON.parse(stored);
    } else {
      STATE.sidebarCollapsed = true;
    }
    applyDesktopSidebarState();
  } catch (e) {
    console.error('Failed to load layout preferences', e);
    applyDesktopSidebarState();
  }
}

function applyDesktopSidebarState() {
  const sidebar = document.querySelector('.app-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed', STATE.sidebarCollapsed);
    
    // Update collapse button tooltip & ARIA label
    const toggleBtn = document.getElementById('sidebar-toggle-desktop');
    if (toggleBtn) {
      if (STATE.sidebarCollapsed) {
        toggleBtn.setAttribute('aria-label', 'Tampilkan sidebar');
        toggleBtn.setAttribute('title', 'Tampilkan sidebar');
      } else {
        toggleBtn.setAttribute('aria-label', 'Sembunyikan sidebar');
        toggleBtn.setAttribute('title', 'Sembunyikan sidebar');
      }
    }
  }
}

function toggleDesktopSidebar() {
  STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  applyDesktopSidebarState();
  saveLayoutPreferences();
}

function toggleMobileSidebar(force) {
  const open = force !== undefined ? force : !STATE.mobileMenuOpen;
  STATE.mobileMenuOpen = open;

  const sidebar = document.querySelector('.app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleIcon = document.querySelector('#sidebar-toggle-mobile i');

  if (sidebar) sidebar.classList.toggle('mobile-active', open);
  if (overlay) overlay.classList.toggle('active', open);
  
  if (toggleIcon) {
    if (open) {
      toggleIcon.className = 'fa-solid fa-xmark';
    } else {
      toggleIcon.className = 'fa-solid fa-bars';
    }
  }
}

// Expose layout helpers globally
window.toggleMobileSidebar = toggleMobileSidebar;
window.toggleDesktopSidebar = toggleDesktopSidebar;

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

  // Load settings from localStorage
  loadSettings();
  updateProfileWidget();
  populateSettingsInputs();

  // Load history from localStorage
  loadHistory();

  // Load sidebar collapse preference from localStorage
  loadLayoutPreferences();

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

  // Bind Sidebar Buttons
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });

  // Bind Desktop Collapse Button
  const toggleBtnDesktop = document.getElementById('sidebar-toggle-desktop');
  if (toggleBtnDesktop) {
    toggleBtnDesktop.addEventListener('click', toggleDesktopSidebar);
  }

  // Bind Mobile Hamburger Toggle Button
  const toggleBtnMobile = document.getElementById('sidebar-toggle-mobile');
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', () => {
      toggleMobileSidebar();
    });
  }

  // Bind Mobile Overlay Backdrop Click
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      toggleMobileSidebar(false);
    });
  }

  // Bind Clear History Button
  const clearHistoryBtn = document.getElementById('btn-clear-history');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearAllHistory);
  }

  // Bind History Search input
  const searchInput = document.getElementById('history-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.addEventListener('input', e => {
      renderHistory(e.target.value);
    });
  }

  // Bind Settings Profile Button in sidebar bottom to switch to Settings view
  const profileSettingsBtn = document.getElementById('btn-settings-profile');
  if (profileSettingsBtn) {
    profileSettingsBtn.addEventListener('click', () => {
      switchView('settings');
    });
  }

  // Bind Settings Save Button
  const saveSettingsBtn = document.getElementById('btn-save-settings');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveGlobalSettings);
  }

  // Bind Settings Reset Button
  const resetSettingsBtn = document.getElementById('btn-reset-settings');
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', resetGlobalSettings);
  }

  // Bind Accent selectors click
  document.querySelectorAll('.accent-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyThemeAccent(btn.dataset.accent);
    });
  });

  // Copy/Clear buttons
  copyBtn.addEventListener('click', handleCopy);
  clearBtn.addEventListener('click', handleClear);

  // Initial render
  switchSlide(1);
});
