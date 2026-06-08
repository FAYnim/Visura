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

  5: `Create a premium cinematic futuristic Instagram carousel closing slide for a modern digital creator portfolio brand.

Canvas size:
1080x1080 square.

Style:
minimal luxury futuristic editorial design, cinematic typography poster, premium tech branding, modern creator outro screen, inspired by high-end Behance presentations, luxury fashion campaigns, Apple keynote minimalism, brutalist futuristic typography, and cinematic sci-fi poster aesthetics.

Overall direction:
extremely minimal composition with strong negative space and ultra-clean visual hierarchy.
Avoid overly complex HUD interfaces or excessive sci-fi UI elements.
The design should feel mature, premium, elegant, and cinematic rather than flashy.

Background:
deep matte black cinematic background with:
- subtle heavy grain texture
- atmospheric bloom lighting
- soft white cinematic light leaks on the left and right edges
- subtle foggy glow
- minimal floating dust particles
- soft vignette
- analog cinematic texture
- dark premium mood

Avoid:
- large HUD circles
- busy interface graphics
- excessive futuristic overlays
- complex dashboard visuals
- colorful gradients
- neon overload

Top badge:
small centered futuristic capsule badge.

Badge text:
"{{TOP_BADGE_TEXT}}"

Badge style:
- ultra minimal
- thin white outline
- tiny white indicator dot
- subtle glow
- uppercase spacing
- clean editorial typography
- futuristic luxury aesthetic

Main hero typography:
large centered ultra-bold futuristic geometric sans-serif typography.

Headline text:
"{{MAIN_HEADLINE}}"

Typography style:
- matte white finish
- minimal metallic reflection
- subtle bloom glow
- sharp geometric edges
- brutalist futuristic typography
- strong readability
- centered stacked composition
- clean spacing
- slightly condensed structure

Avoid:
- chrome texture
- reflective silver material
- glossy metallic effects

Description text:
centered minimal paragraph below the headline.

Text:
"{{DESCRIPTION_TEXT}}"

Highlight:
"maximum"

Description style:
- clean modern sans-serif
- subtle white typography
- balanced spacing
- editorial alignment
- premium startup presentation aesthetic

Creator card:
large centered minimal futuristic identity card.

Card style:
- dark transparent glass
- subtle reflections
- ultra soft border
- realistic glass texture
- cinematic transparency
- minimal UI details
- rounded corners
- soft bloom highlights
- elegant luxury interface

Card contents:
- large creator logo on the left
- creator name
- creator role
- small informational subtext

Creator text:
"{{CREATOR_NAME}}"
"{{CREATOR_ROLE}}"

Subtext:
"EXPLORE MORE PROJECT (LINK IN BIO OR FAYDEV.MY.ID)"

Card composition:
- clean spacing
- larger logo emphasis
- modern premium hierarchy
- minimal distractions
- elegant readability

CTA section:
two centered futuristic CTA rows below the creator card.

CTA 1:
globe icon + text + thin glowing connector line

Text:
"{{CTA_TEXT_1}}"

CTA 2:
github icon + text + thin glowing connector line

Text:
"{{CTA_TEXT_2}}"

CTA style:
- monochrome minimal icons
- ultra thin lines
- subtle white glow
- elegant spacing
- premium futuristic editorial style
- minimal UI aesthetic

Lighting:
use:
- soft cinematic bloom
- subtle white atmospheric glow
- extremely restrained neon usage
- cinematic shadows
- analog film texture
- soft reflections

Mood:
luxury futuristic poster, premium creator branding, cinematic minimalist technology presentation, modern sci-fi editorial artwork, elegant digital identity system.

Quality:
ultra detailed, premium typography composition, sophisticated art direction, cinematic lighting, luxury branding aesthetic, Behance-quality presentation, clean modern futuristic visual hierarchy.`
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

export function isReadOnlyPromptBatch(batch) {
  return Boolean(batch && (batch.isDefault || batch.isStock));
}

function stockSlide(style, direction, slideName, body) {
  return `Create a premium ${style} Instagram carousel ${slideName} slide for a modern digital product portfolio.

Canvas size:
1080x1350 portrait.

Style direction:
${direction}

${body}

IMPORTANT:
Use the uploaded project screenshot wherever an interface or product screen is requested. Preserve the original UI layout, colors, spacing, typography, and structure. Do not redesign the uploaded interface.

Overall mood:
premium portfolio case study, modern SaaS presentation, strong visual hierarchy, clean typography, high-end Behance-quality art direction.`;
}

function createStockBatch(id, name, description, style, direction, slide1, slide4Showcase) {
  return {
    id,
    name,
    description,
    isDefault: false,
    isStock: true,
    createdAt: null,
    slides: {
      1: slide1,
      2: stockSlide(style, direction, 'project overview', `Top left badge:
"{{SECTION_BADGE}}"

Main heading:
"{{MAIN_HEADING}}"

Project description:
"{{PROJECT_DESCRIPTION}}"

Quote card:
"{{QUOTE_TEXT}}"

Layout:
Build an adaptive overview composition with the project screenshot as the primary visual, one narrative text area, one refined quote card, and four compact feature cards.

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
Description: "{{FEATURE_DESC_4}}"`),
      3: stockSlide(style, direction, 'features', `Top left badge:
"{{SECTION_BADGE}}"

Main heading:
"{{MAIN_HEADING}}"

Subtitle:
"{{SUBTITLE_TEXT}}"

Layout:
Create a clear six-feature system in a premium 2-column by 3-row grid. Each feature card should match the batch style, use clean spacing, iconography, title, and short description.

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

CTA panel:
Text: "{{CTA_TEXT}}"
Button: "{{CTA_BUTTON}}"`),
      4: stockSlide(style, direction, 'UI showcase', `Top left badge:
"{{TOP_LEFT_BADGE}}"

Top right label:
"{{TOP_RIGHT_LABEL}}"

Main headline:
"{{MAIN_HEADLINE}}"

Subtitle:
"{{SUBTITLE_TEXT}}"

Main showcase:
${slide4Showcase}

Pill row:
"{{PILL_TEXT_1}}"
"{{PILL_TEXT_2}}"
"{{PILL_TEXT_3}}"
"{{PILL_TEXT_4}}"

Footer branding:
Left: "Crafted by {{CREATOR_NAME}}"
Right: "{{BRAND_STATEMENT}}"`),
      5: stockSlide(style, direction, 'closing outro', `Top badge:
"{{TOP_BADGE_TEXT}}"

Main headline:
"{{MAIN_HEADLINE}}"

Description:
"{{DESCRIPTION_TEXT}}"

Creator identity:
Name: "{{CREATOR_NAME}}"
Role: "{{CREATOR_ROLE}}"

CTA section:
CTA 1: "{{CTA_TEXT_1}}"
CTA 2: "{{CTA_TEXT_2}}"

Layout:
Create a strong final CTA composition with premium negative space, creator identity block, and two clear action rows.`)
    }
  };
}

export const STOCK_PROMPT_BATCHES = [
  createStockBatch(
    'stock_glass_poster',
    'Glass Poster',
    'Premium glassmorphism poster preset with a centered visionOS-style panel.',
    'glassmorphism poster',
    'visionOS-inspired translucent glass panels, dark matte background, soft reflections, thin glowing borders, luxury SaaS portfolio mood',
    `Create a premium futuristic product poster for a modern digital product portfolio showcase using the uploaded project screenshot as the main interface display.

IMPORTANT:
Use the uploaded screenshot image as the main dashboard/interface shown inside the composition.
Preserve the original UI design while integrating it naturally into the premium poster presentation.

Canvas size:
1080x1350 portrait.

Style:
premium glassmorphism poster, futuristic SaaS branding, luxury digital product presentation, modern startup showcase, inspired by Apple Vision Pro, Linear, Framer, Arc Browser, and Behance featured projects.

Background:
clean minimal dark background using matte black, deep charcoal, or dark graphite tones.
Keep the background extremely clean and distraction-free.
Avoid colorful gradients, abstract landscapes, sci-fi environments, glowing rocks, particles, space effects, decorative 3D objects, and excessive lighting effects.
Use only subtle vignette, soft ambient glow, and minimal depth lighting.

Main composition:
Create one large floating premium glass panel positioned at the center of the canvas with rounded corners, subtle transparency, elegant glass reflections, thin premium border, realistic depth, and modern visionOS-inspired appearance.

Top left badge:
small rounded capsule outline with subtle neon green glow and small green indicator dot.
Badge text:
"{{BADGE_TEXT}}"

Main hero heading:
large premium editorial typography positioned inside the glass panel near the top section.
Heading text:
"{{MAIN_HEADLINE}}"

Subtitle:
Positioned directly below the heading.
Subtitle text:
"{{SUBTITLE_TEXT}}"

Screenshot placement:
Place the uploaded screenshot naturally inside the glass panel below the heading section. Preserve the original UI layout, original colors, original spacing, and original interface design.
Do not redesign the uploaded interface.

Footer branding:
Position branding inside the lower area of the glass panel. Display ONLY:
"Crafted by {{CREATOR_NAME}}"

Overall mood:
luxury digital product poster, premium SaaS presentation, futuristic startup branding, visionOS-inspired design, clean portfolio showcase, Behance featured aesthetic.`,
    'Place the uploaded screenshot inside a large centered translucent glass browser frame with realistic reflections and clean product-first hierarchy.'
  ),
  createStockBatch(
    'stock_product_monument',
    'Product Monument',
    'Premium product reveal preset with the interface as a monumental hero object.',
    'product monument reveal',
    'deep black presentation stage, soft spotlight lighting, cinematic shadows, centered product-object hierarchy, no decorative clutter',
    `Create a premium futuristic product monument showcase for a modern digital product portfolio using the uploaded project screenshot as the main interface display.

Canvas size:
1080x1350 portrait.

Style:
premium product launch presentation, futuristic SaaS branding, luxury technology showcase, modern startup aesthetic, inspired by Apple product launches, Tesla reveal events, Nothing product presentations, and Behance featured portfolio projects.

Background:
clean deep black or dark charcoal background that feels like a premium presentation stage. Avoid colorful gradients, landscapes, floating planets, sci-fi cities, particles, decorative abstract objects, excessive glow, neon environments, and complex background illustrations.
Use only soft spotlight lighting, subtle atmospheric depth, cinematic shadows, and minimal ambient glow.

Main composition:
The uploaded screenshot must be positioned at the center of the canvas as a monumental hero object, a premium exhibition piece, and a product being revealed on stage. The screenshot should occupy approximately 50-65% of the canvas height with premium floating effect, realistic depth, soft shadow, subtle cinematic reflections, and elegant presentation lighting.
Do not place the screenshot inside a browser frame or glass card.

Top left badge:
small rounded capsule outline with subtle neon green glow and small green indicator dot.
Badge text:
"{{BADGE_TEXT}}"

Main hero heading:
Position the heading above the screenshot.
Heading text:
"{{MAIN_HEADLINE}}"

Subtitle:
Position directly below the heading and above the screenshot.
Subtitle text:
"{{SUBTITLE_TEXT}}"

Footer branding:
Position branding at the bottom left corner. Display ONLY:
"Crafted by {{CREATOR_NAME}}"

Overall mood:
premium product reveal, modern technology monument, luxury SaaS presentation, clean startup branding, cinematic product launch, world-class portfolio showcase.`,
    'Make the uploaded screenshot the central monument hero object with spotlight, grounded shadow, premium scale, and no browser frame.'
  ),
  createStockBatch(
    'stock_architecture_presentation',
    'Architecture Presentation',
    'Premium architectural board preset with precise spacing, thin grids, and presentation-board clarity.',
    'architectural presentation board',
    'matte black architecture board, thin divider lines, subtle grid alignment, precise spacing, professional engineering case-study mood',
    `Create a premium architectural presentation board for a modern digital product portfolio showcase using the uploaded project screenshot as the main interface display.

Canvas size:
1080x1350 portrait.

Style:
architectural presentation board, premium SaaS case study, luxury startup portfolio, engineering presentation board, investor-ready product showcase, inspired by Apple product presentations, Linear, Stripe, Framer, Behance featured case studies, and architecture competition boards.

Background:
deep matte black, dark graphite, or charcoal surface. The background should feel professional, minimal, and presentation-oriented. Avoid colorful gradients, sci-fi environments, landscapes, abstract 3D objects, floating geometric elements, decorative shapes, excessive glow, gaming aesthetics, futuristic city elements, and visual clutter.
Use only subtle grid alignment, thin divider lines, premium negative space, soft ambient lighting, realistic shadows, and minimal depth effects.

Top-left badge:
Create a small rounded outline capsule with subtle neon green outline glow and small green indicator dot.
Badge text:
"{{BADGE_TEXT}}"

Main heading:
Position in the upper-left area.
Text:
"{{MAIN_HEADLINE}}"

Subtitle:
Position directly below the heading.
Text:
"{{SUBTITLE_TEXT}}"

Main showcase:
The uploaded screenshot must be the dominant visual element, centered horizontally, large, and preserved exactly. Do not create metadata sections, project type labels, platform labels, category labels, year labels, specifications, annotations, information panels, side notes, or architectural captions.

Footer branding:
Position in the lower-left corner. Display ONLY:
"Crafted by {{CREATOR_NAME}}"

Overall mood:
precise architectural board, clean SaaS case study, premium engineering presentation, minimal professional portfolio showcase.`,
    'Place the uploaded screenshot as the dominant architectural board element with thin guide lines, precise spacing, and no metadata panels.'
  ),
  createStockBatch(
    'stock_hero_interface',
    'Hero Interface',
    'Premium hero interface preset with large editorial typography and a cinematic UI centerpiece.',
    'hero interface campaign',
    'bold editorial hero typography, cinematic dark SaaS campaign, large interface centerpiece, premium startup launch energy',
    `Create a premium futuristic hero interface cover slide for a modern digital product portfolio using the uploaded project screenshot as the main interface display.

Canvas size:
1080x1350 portrait.

Style:
premium hero interface campaign, cinematic luxury SaaS branding, bold startup launch visual, modern editorial product showcase, inspired by Apple keynote visuals, Linear, Stripe, Framer, and high-end Behance UI case studies.

Background:
deep matte black cinematic background with subtle grain texture, soft ambient glow, minimal atmospheric lighting, and clean negative space. Avoid futuristic landscapes, glowing runways, sci-fi stages, holographic environments, excessive particles, heavy fog, and complex cinematic scenery.

Top left badge:
minimal segmented capsule with thin white borders and subtle futuristic styling.
Badge text:
"{{BADGE_TEXT}}"

Main hero heading:
massive ultra-bold centered editorial sans-serif heading.
Heading text:
"{{MAIN_HEADLINE}}"

Subtitle below heading:
"{{SUBTITLE_TEXT}}"

Main composition:
Use the uploaded screenshot as a large hero interface display with realistic depth, sharp readability, subtle reflections, and premium campaign lighting. Preserve the original UI exactly.

Footer branding:
minimal creator branding at the bottom left. Display ONLY:
"Crafted by {{CREATOR_NAME}}"

Overall mood:
premium modern SaaS campaign, luxury startup branding, minimal futuristic presentation, clean cinematic product showcase, high-end Behance featured project aesthetic.`,
    'Use one large hero interface display or front-facing laptop mockup with the screenshot as the center campaign visual.'
  ),
  createStockBatch(
    'stock_device_showcase_laptop',
    'Device Showcase Laptop',
    'Premium laptop showcase preset optimized for maximum interface readability.',
    'device showcase laptop',
    'front-facing premium laptop, Apple product-page lighting, realistic aluminum hardware, maximum screen readability, restrained luxury staging',
    `Create a premium modern laptop positioned prominently in the center of the canvas.

Canvas size:
1080x1350 portrait.

IMPORTANT:
The laptop must face directly toward the viewer with a nearly front-facing perspective. Avoid dramatic perspective angles, side views, 3/4 angles, strong camera rotations, tilted screens, partially hidden interfaces, and excessive screen glare. The laptop screen should appear almost perfectly rectangular and fully visible for maximum interface visibility and readability.

Laptop style:
premium aluminum body, ultra-thin bezels, modern industrial design, luxury hardware appearance, realistic materials.

Display the uploaded screenshot naturally inside the laptop screen. Preserve original UI layout, colors, spacing, typography, and interface structure. Do not redesign the uploaded interface.

Composition hierarchy:
1. Laptop screen with uploaded screenshot
2. Project title
3. Subtitle
4. Badge

Top left badge:
"{{BADGE_TEXT}}"

Main hero heading:
"{{MAIN_HEADLINE}}"

Subtitle:
"{{SUBTITLE_TEXT}}"

Footer branding:
Display ONLY:
"Crafted by {{CREATOR_NAME}}"

Overall mood:
premium Apple product page reveal, clean SaaS portfolio showcase, realistic device presentation, readable interface-first composition.`,
    'Place the uploaded screenshot inside a nearly front-facing premium laptop screen with minimal perspective distortion and Apple product-page realism.'
  )
];

export const SYSTEM_PROMPT_BATCHES = [DEFAULT_PROMPT_BATCH, ...STOCK_PROMPT_BATCHES];

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
    isStock: false,
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
      isStock: false,
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
