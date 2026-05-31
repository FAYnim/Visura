/* =========================================================
   Visura — Prompt Store (promptStore.js)
   Central model for prompt batch data, default templates,
   and batch normalization / placeholder validation.
   ========================================================= */

'use strict';

// =========================================================
// DEFAULT PROMPT TEMPLATES
// Single source of truth for prompt templates.
// The {{...}} placeholders MUST remain intact in all batches.
// =========================================================
export const DEFAULT_PROMPTS = {
  1: `Create a premium futuristic Instagram carousel cover slide for a modern digital product portfolio showcase using the uploaded project screenshot as the main interface display.

IMPORTANT:
Use the uploaded screenshot image as the main dashboard/interface shown inside the floating UI frame.
Preserve the original UI design while integrating it naturally into the premium futuristic composition.

Canvas size:
1080x1350 portrait.

Style:
minimal futuristic SaaS presentation, cinematic dark UI aesthetic, premium startup branding, modern product showcase, inspired by Apple keynote, Linear, Stripe, Framer, and Behance featured projects.

Background:
clean plain dark background with a dominant matte black or deep charcoal tone.
Keep the background minimal and distraction-free.
Avoid colorful gradients, abstract landscapes, glowing terrain, sci-fi environments, excessive particles, nebula effects, rocks, or decorative cinematic elements.
Use only subtle soft vignette lighting and very minimal ambient glow to create depth while maintaining a clean premium presentation look.
The overall background should feel empty, elegant, modern, and focused entirely on the typography and UI showcase.

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
minimal dark glassmorphic browser-style frame with rounded corners, subtle transparency, soft border glow, cinematic reflections, and premium floating effect.

IMPORTANT:
Embed the uploaded screenshot naturally into the floating interface frame with realistic perspective alignment, subtle reflections, soft glow integration, and premium screen presentation.
Do not redesign the uploaded interface.
Preserve the original UI layout from the screenshot.

Composition focus:
The main visual focus must remain on:
1. The project title typography
2. The uploaded project screenshot

All supporting visual elements should remain subtle and secondary.

Footer branding:
minimal creator branding placed on bottom left corner.
Display ONLY the text:
"Crafted by {{CREATOR_NAME}}"

IMPORTANT:
Do not add any icon, logo, badge, symbol, code bracket, glowing square, decorative container, or graphic element beside the footer branding text.
The footer branding must be clean plain typography only.

Overall mood:
minimal luxurious SaaS presentation, clean premium portfolio aesthetic, modern startup branding, elegant dark presentation style, distraction-free composition, Behance featured portfolio aesthetic.`,

  2: `Create a premium Instagram carousel project overview slide for a modern SaaS product portfolio using the uploaded project screenshot as the primary visual showcase.

IMPORTANT:
Use the uploaded screenshot image exactly as the interface displayed inside the floating browser frame.

Preserve the original UI design completely.
Do not redesign, modify, restyle, or reinterpret the uploaded interface.
The screenshot must remain the most important visual element in the composition.

Canvas size:
1080x1350 portrait.

Design Direction:
premium SaaS case study presentation, luxury minimalism, modern editorial design, product-first composition, high-end Behance showcase, inspired by Apple, Linear, Stripe, Framer, Vercel, and modern startup launch materials.

Background:
pure deep black background with subtle film grain texture.
No visible particles.
No sci-fi effects.
No strong color glows.
Use extremely restrained lighting and high contrast to emphasize the product interface.

Top Left Badge:
small rounded capsule outline.
Thin white border.
Minimal appearance.

Badge text:
"{{SECTION_BADGE}}"

Main Heading:
large ultra-bold editorial sans-serif typography aligned vertically on the left side.

Heading text:
"{{MAIN_HEADING}}"

Typography Style:
massive bold sans-serif.
Clean white-to-light-gray gradient.
Strong contrast.
Luxury editorial hierarchy.
No neon effects.
No futuristic glow.

Accent Divider:
short thin white horizontal line positioned below the heading.

Description Section:
clean modern paragraph explaining the product.

Description text:
"{{PROJECT_DESCRIPTION}}"

Highlight important keywords using subtle weight changes instead of bright neon colors.

Quote Card:
minimal rounded dark card with thin border.
No heavy glassmorphism.
No strong glow.

Quote text:
"{{QUOTE_TEXT}}"

Quote card style:
premium editorial UI component, understated and elegant.

Main Showcase:
large floating browser frame positioned on the upper-right area.

Frame Style:
premium dark browser chrome,
thin borders,
subtle reflections,
soft realistic highlights,
minimal depth effects.

IMPORTANT:
The uploaded screenshot must be clearly visible and highly readable.
The interface should dominate the composition and immediately attract attention.

Composition:
allow the browser frame to extend beyond the canvas edges for a premium cropped editorial layout.
Use generous negative space.
Prioritize visual balance and readability.

Feature Cards Section:
display four premium feature cards horizontally near the bottom.

Card Style:
minimal dark panels,
thin border outlines,
subtle depth,
clean spacing,
enterprise-grade SaaS presentation.

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

Overall Mood:
premium software showcase,
editorial product presentation,
luxury startup branding,
minimalist enterprise design,
high-end portfolio case study,
Behance featured project quality.

Quality:
ultra detailed,
clean composition,
professional typography,
high visual hierarchy,
premium art direction,
minimal effects,
maximum product focus.`,

  3: `Create a premium futuristic Instagram carousel slide showcasing the core capabilities of a modern AI-powered portfolio generation platform.

Canvas size:
1080x1080 square format.

Style:
luxury monochrome SaaS presentation, ultra-premium product marketing design, cinematic black aesthetic, inspired by Apple keynote slides, Nothing design language, Linear, Arc Browser, and high-end Behance featured case studies.

Background:
deep cinematic black background with subtle grain texture, soft ambient lighting, faint dotted particle grid, elegant negative space, minimal futuristic atmosphere.

Top left badge:
small rounded capsule with thin white glowing outline and subtle indicator dot.

Badge text:
"{{SECTION_BADGE}}"

Main heading:
large ultra-bold editorial sans-serif typography positioned in the upper left area.

Heading text:
"{{MAIN_HEADING}}"

Typography style:
massive metallic silver-to-white gradient lettering, chrome-like reflections, premium editorial hierarchy, luxurious spacing, high contrast against the dark background.

Subtitle:
"{{SUBTITLE_TEXT}}"

Top right decoration:
large partial planetary arc emerging from the corner, soft silver-white glow, elegant cosmic lighting, subtle futuristic atmosphere.

Main layout:
display six premium feature cards arranged in a clean 2-column by 3-row grid.

Feature card style:
minimal luxury glassmorphism panels, deep black surfaces, bright white glowing borders, soft reflections, subtle bloom lighting, rounded corners, sophisticated shadows, premium enterprise presentation.

IMPORTANT:
Do NOT include dashboard previews, software screenshots, widgets, charts, forms, code blocks, analytics panels, UI mockups, or embedded interfaces inside the cards.

Each feature card contains only:
- feature number
- glowing monochrome icon
- feature title
- short feature description

Icon style:
large futuristic outline icons enclosed inside glowing circular rings, soft white neon glow, luxury monochrome aesthetic.

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

Feature 5:
Title: "{{FEATURE_TITLE_5}}"
Description: "{{FEATURE_DESC_5}}"

Feature 6:
Title: "{{FEATURE_TITLE_6}}"
Description: "{{FEATURE_DESC_6}}"

Card layout:
large icon positioned on the left, title and description aligned on the right, generous spacing, premium visual balance, clean presentation.

Bottom section:
full-width premium CTA panel spanning the entire width.

CTA panel style:
deep black glass panel with bright white glowing outline, subtle reflections, elegant futuristic lighting.

Left side CTA:
rocket icon inside glowing circular ring.

Text:
"{{CTA_TEXT}}"

Right side:
large premium button.

Button text:
"{{CTA_BUTTON}}"

Button style:
minimal luxury dark button, thin white glowing border, soft bloom effect, futuristic arrow icon.

Color palette:
black, charcoal, silver, white, subtle gray highlights only.

Avoid:
green neon,
blue neon,
dashboard UI previews,
overly colorful elements,
cyberpunk aesthetics,
busy compositions,
excessive decorations.

Overall mood:
luxurious futuristic presentation, Apple-level visual polish, premium startup branding, monochrome enterprise aesthetic, minimal yet powerful feature showcase.

Quality:
ultra detailed, cinematic lighting, luxury art direction, realistic reflections, premium typography, sophisticated visual hierarchy, Behance-featured design quality.`,

  4: `Create a premium futuristic Instagram carousel slide designed as a luxury minimal tech product showcase using the uploaded project screenshot as the main interface display.

IMPORTANT:
Use the uploaded screenshot as the interface shown inside the laptop mockup display.
Preserve the original UI design exactly as it is.
Do not redesign or alter the uploaded interface.

Canvas size:
1080x1350 portrait.
Aspect ratio 1:1.

Style:
premium minimalist SaaS branding, cinematic luxury tech presentation, modern editorial product showcase, inspired by Apple keynote visuals, Linear, Stripe, Framer, and high-end Behance UI case studies.

Overall aesthetic:
clean, minimal, elegant, futuristic, luxury startup branding.
Avoid overly sci-fi environments or cyberpunk aesthetics.

Background:
deep matte black cinematic background with very subtle grain texture.
Keep the background clean and distraction-free.
Use only soft ambient glow and minimal atmospheric lighting.
Avoid:
- futuristic landscapes
- glowing runways
- sci-fi stages
- holographic environments
- excessive particles
- heavy fog
- complex cinematic scenery

Top left branding badge:
minimal segmented capsule with thin white borders and subtle futuristic styling.

Badge text:
"{{TOP_LEFT_BADGE}}"

Top right editorial label:
small uppercase luxury typography with wide letter spacing.

Label text:
"{{TOP_RIGHT_LABEL}}"

Main hero typography:
massive ultra-bold centered editorial sans-serif heading.

Heading text:
"{{MAIN_HEADLINE}}"

Typography style:
metallic silver-to-white gradient,
clean luxury finish,
oversized scale,
strong negative space,
modern editorial hierarchy,
subtle cinematic glow underneath the text.

Subtitle below heading:
"{{SUBTITLE_TEXT}}"

Highlight the keyword:
"effortlessly."
using subtle neon green.

Feature pills section:
display 4 premium minimal pills below the subtitle.

Pill texts:
- "{{PILL_TEXT_1}}"
- "{{PILL_TEXT_2}}"
- "{{PILL_TEXT_3}}"
- "{{PILL_TEXT_4}}"

Pill style:
minimal dark glassmorphism capsules with:
- thin borders
- subtle glow
- rounded corners
- clean premium UI styling
- monochrome futuristic icons
- elegant spacing

Main composition:
use a single centered realistic premium laptop mockup.

Laptop style:
modern MacBook-inspired laptop,
front-facing angle,
minimal perspective distortion,
premium metallic material,
thin bezels,
realistic reflections,
luxury product presentation.

IMPORTANT:
Embed the uploaded screenshot naturally into the laptop screen with realistic screen reflections and accurate perspective fitting.

Do not use floating panels.
Do not use multiple displays.
Do not use holographic UI frames.

Lighting:
use soft cinematic lighting with:
- subtle white glow
- minimal blue ambient accents
- soft edge highlights
- gentle bloom
- controlled reflections

Footer left:
minimal creator branding.

Creator text:
"Crafted by
{{CREATOR_NAME}}"

Footer right:
minimal editorial brand statement.

Brand statement:
"{{BRAND_STATEMENT}}"

Mood:
premium modern SaaS campaign,
luxury startup branding,
minimal futuristic presentation,
clean cinematic product showcase,
high-end Behance featured project aesthetic.

Quality:
ultra detailed,
clean composition,
premium typography hierarchy,
realistic product rendering,
minimal cinematic lighting,
luxury art direction,
sharp focus,
high-end presentation quality.`,

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
// REQUIRED PLACEHOLDERS PER SLIDE
// Used for validation — save so they don't get lost
// =========================================================
export const REQUIRED_PLACEHOLDERS = {
  1: ['BADGE_TEXT', 'MAIN_HEADLINE', 'SUBTITLE_TEXT', 'CREATOR_NAME'],
  2: [
    'SECTION_BADGE', 'MAIN_HEADING', 'PROJECT_DESCRIPTION', 'QUOTE_TEXT',
    'FEATURE_TITLE_1', 'FEATURE_DESC_1',
    'FEATURE_TITLE_2', 'FEATURE_DESC_2',
    'FEATURE_TITLE_3', 'FEATURE_DESC_3',
    'FEATURE_TITLE_4', 'FEATURE_DESC_4'
  ],
  3: [
    'SECTION_BADGE', 'MAIN_HEADING', 'SUBTITLE_TEXT',
    'FEATURE_TITLE_1', 'FEATURE_DESC_1',
    'FEATURE_TITLE_2', 'FEATURE_DESC_2',
    'FEATURE_TITLE_3', 'FEATURE_DESC_3',
    'FEATURE_TITLE_4', 'FEATURE_DESC_4',
    'FEATURE_TITLE_5', 'FEATURE_DESC_5',
    'FEATURE_TITLE_6', 'FEATURE_DESC_6',
    'CTA_TEXT', 'CTA_BUTTON'
  ],
  4: [
    'TOP_LEFT_BADGE', 'TOP_RIGHT_LABEL', 'MAIN_HEADLINE', 'SUBTITLE_TEXT',
    'PILL_TEXT_1', 'PILL_TEXT_2', 'PILL_TEXT_3', 'PILL_TEXT_4',
    'CREATOR_NAME', 'BRAND_STATEMENT'
  ],
  5: [
    'TOP_BADGE_TEXT', 'MAIN_HEADLINE', 'DESCRIPTION_TEXT',
    'CREATOR_NAME', 'CREATOR_ROLE', 'CTA_TEXT_1', 'CTA_TEXT_2'
  ]
};

// =========================================================
// DEFAULT PROMPT BATCH (seed)
// =========================================================
export const DEFAULT_PROMPT_BATCH = {
  id: 'default',
  name: 'Default Batch',
  description: 'Default system prompt template. Read-only.',
  isDefault: true,
  createdAt: null,
  slides: { ...DEFAULT_PROMPTS }
};

// =========================================================
// CREATE PROMPT BATCH
// =========================================================
/**
 * Creates a new prompt batch object.
 * @param {string} name
 * @param {string} description
 * @param {Object|null} source - Source batch to copy slides from; defaults to DEFAULT_PROMPTS
 * @returns {Object}
 */
export function createPromptBatch(name, description = '', source = null) {
  const sourceSlides = source ? source.slides : DEFAULT_PROMPTS;
  return {
    id: 'batch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: name.trim(),
    description: description.trim(),
    isDefault: false,
    createdAt: new Date().toISOString(),
    slides: {
      1: sourceSlides[1] || DEFAULT_PROMPTS[1],
      2: sourceSlides[2] || DEFAULT_PROMPTS[2],
      3: sourceSlides[3] || DEFAULT_PROMPTS[3],
      4: sourceSlides[4] || DEFAULT_PROMPTS[4],
      5: sourceSlides[5] || DEFAULT_PROMPTS[5]
    }
  };
}

// =========================================================
// NORMALIZE PROMPT BATCHES
// Validates & repairs each batch — ensures all 5 slides exist
// and that required placeholders are present.
// =========================================================
/**
 * Ensures raw storage data is valid and all placeholders intact.
 * Missing slides are restored from DEFAULT_PROMPTS.
 * Missing placeholders in a slide are restored by replacing with default slide template.
 * @param {Array} raw
 * @returns {Array}
 */
export function normalizePromptBatches(raw) {
  if (!Array.isArray(raw)) return [];

  return raw.map(batch => {
    if (!batch || typeof batch !== 'object') return null;

    // Ensure slides object
    const slides = {};
    for (let s = 1; s <= 5; s++) {
      const slideText = (batch.slides && typeof batch.slides[s] === 'string')
        ? batch.slides[s]
        : DEFAULT_PROMPTS[s];

      // Validate required placeholders
      const required = REQUIRED_PLACEHOLDERS[s] || [];
      const allPresent = required.every(ph => slideText.includes(`{{${ph}}}`));

      slides[s] = allPresent ? slideText : DEFAULT_PROMPTS[s];
    }

    return {
      id: batch.id || ('batch_' + Date.now()),
      name: typeof batch.name === 'string' ? batch.name : 'Unnamed Batch',
      description: typeof batch.description === 'string' ? batch.description : '',
      isDefault: false,
      createdAt: batch.createdAt || new Date().toISOString(),
      slides
    };
  }).filter(Boolean);
}

// =========================================================
// VALIDATE SLIDE TEMPLATE
// Returns list of missing placeholder names (empty = valid)
// =========================================================
/**
 * @param {number} slideNum  1-5
 * @param {string} text
 * @returns {string[]} missing placeholder keys
 */
export function validateSlideTemplate(slideNum, text) {
  const required = REQUIRED_PLACEHOLDERS[slideNum] || [];
  return required.filter(ph => !text.includes(`{{${ph}}}`));
}
