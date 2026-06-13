# Stock Prompt Batches Design

## Goal

Add five hardcoded stock prompt batches to the Prompt Manager. Each batch comes from the existing slide 1 style prompts in `tmp-prompt-stock/` and includes newly written prompts for slides 2 through 5.

## Scope

The feature adds reusable prompt styles only. It does not change the slide form fields, placeholder names, generation flow, carousel structure, or saved user batch format.

## Stock Batches

Create five stock batches:

1. Glass Poster
2. Product Monument
3. Architecture Presentation
4. Hero Interface
5. Device Showcase Laptop

Each batch has five slide templates:

- Slide 1: Cover, adapted from the existing stock markdown file.
- Slide 2: Project Overview.
- Slide 3: Features.
- Slide 4: UI Showcase.
- Slide 5: Closing Outro with CTA.

Slide 1 placeholders from stock files use square brackets such as `[MAIN_HEADLINE]`; these will be converted to the existing double-brace format such as `{{MAIN_HEADLINE}}`.

## Prompt Direction

Slide 2 through 5 should preserve the visual mood of each stock batch while adapting layout to the slide purpose:

- Slide 2 overview uses a project narrative, quote, screenshot focus, and four compact feature cards.
- Slide 3 features uses a clear six-feature grid and CTA area.
- Slide 4 UI showcase emphasizes the uploaded screenshot/interface, pill labels, creator branding, and brand statement.
- Slide 5 closing uses a strong final headline, creator identity, role, and two CTA lines.

The style should be consistent within a batch, but not forced into the exact slide 1 layout.

## Architecture

Add a new exported array in `public/js/promptStore.js`, named `STOCK_PROMPT_BATCHES`.

Each stock batch object should include:

- stable `id`
- `name`
- `description`
- `slides`
- `isStock: true` to mark it as a read-only stock preset
- `createdAt: null` or a static metadata label suitable for Prompt Manager display

The existing `DEFAULT_PROMPT_BATCH` remains unchanged as the system default. Stock batches are additional hardcoded batches.

## Prompt Manager Behavior

`public/js/prompts.js` should display batches in this order:

1. System default batch
2. Five stock prompt batches
3. User-created batches

Stock batches should behave like read-only system presets:

- can be selected
- can be activated
- can be duplicated
- cannot be edited directly
- cannot be saved directly
- cannot be deleted

Duplicating a stock batch creates an editable user batch with copied slide templates.

## Generator Behavior

The generator should be able to use an active stock batch the same way it uses the current default or user-created batches. Active batch lookup must include stock batches.

No changes are required to placeholder compilation. Templates still compile through the existing `{{PLACEHOLDER}}` replacement flow.

## Placeholder Requirements

Every slide template must preserve required placeholders from `public/prompts.html`:

### Slide 1

- `{{BADGE_TEXT}}`
- `{{MAIN_HEADLINE}}`
- `{{SUBTITLE_TEXT}}`
- `{{CREATOR_NAME}}`

### Slide 2

- `{{SECTION_BADGE}}`
- `{{MAIN_HEADING}}`
- `{{PROJECT_DESCRIPTION}}`
- `{{QUOTE_TEXT}}`
- `{{FEATURE_TITLE_1}}`
- `{{FEATURE_DESC_1}}`
- `{{FEATURE_TITLE_2}}`
- `{{FEATURE_DESC_2}}`
- `{{FEATURE_TITLE_3}}`
- `{{FEATURE_DESC_3}}`
- `{{FEATURE_TITLE_4}}`
- `{{FEATURE_DESC_4}}`

### Slide 3

- `{{SECTION_BADGE}}`
- `{{MAIN_HEADING}}`
- `{{SUBTITLE_TEXT}}`
- `{{FEATURE_TITLE_1}}`
- `{{FEATURE_DESC_1}}`
- `{{FEATURE_TITLE_2}}`
- `{{FEATURE_DESC_2}}`
- `{{FEATURE_TITLE_3}}`
- `{{FEATURE_DESC_3}}`
- `{{FEATURE_TITLE_4}}`
- `{{FEATURE_DESC_4}}`
- `{{FEATURE_TITLE_5}}`
- `{{FEATURE_DESC_5}}`
- `{{FEATURE_TITLE_6}}`
- `{{FEATURE_DESC_6}}`
- `{{CTA_TEXT}}`
- `{{CTA_BUTTON}}`

### Slide 4

- `{{TOP_LEFT_BADGE}}`
- `{{TOP_RIGHT_LABEL}}`
- `{{MAIN_HEADLINE}}`
- `{{SUBTITLE_TEXT}}`
- `{{PILL_TEXT_1}}`
- `{{PILL_TEXT_2}}`
- `{{PILL_TEXT_3}}`
- `{{PILL_TEXT_4}}`
- `{{CREATOR_NAME}}`
- `{{BRAND_STATEMENT}}`

### Slide 5

- `{{TOP_BADGE_TEXT}}`
- `{{MAIN_HEADLINE}}`
- `{{DESCRIPTION_TEXT}}`
- `{{CREATOR_NAME}}`
- `{{CREATOR_ROLE}}`
- `{{CTA_TEXT_1}}`
- `{{CTA_TEXT_2}}`

## Error Handling

Use the existing placeholder validation behavior. If any stock template is missing required placeholders, the corresponding slide tab should show an error state. Stock batches should not bypass validation.

If a stock batch ID is active but missing from the hardcoded list, generator fallback should continue using the default templates rather than failing.

## Testing

Verify these outcomes:

1. Prompt Manager shows default, five stock batches, and user batches.
2. Stock batches are read-only.
3. Stock batches can be activated.
4. Stock batches can be duplicated into editable user batches.
5. Generator resolves active stock batches correctly.
6. All required placeholders exist in all stock slide templates.
7. Existing user batch storage remains backward compatible.
8. Available lint, typecheck, and test commands pass.
