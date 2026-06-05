# Separate Generate Caption from Auto-Fill Design

## Context

Visura currently has an AI Auto-Fill flow that generates copy for five carousel slides and also returns `caption.TEXT` in the same response. The caption prompt lives inside the broader Auto-Fill prompt, which makes the caption less structured because the model is optimizing for many slide fields and the caption at the same time.

## Goal

Separate caption generation into its own feature so Auto-Fill only fills the five slide forms, while Generate Caption has a dedicated prompt with one output example. The dedicated caption prompt should produce a more consistent professional storytelling caption.

## Non-Goals

- No prompt editor UI for caption examples.
- No multiple caption variants.
- No separate caption quota system.
- No automatic caption overwrite without user confirmation.

## User Experience

Auto-Fill remains available from the preview actions, but it only fills slide 1 through slide 5. Its labels and success messages should no longer mention caption output.

The caption panel gets a new Generate Caption action. When clicked, it opens a caption-specific modal with:

- Project brief textarea.
- Markdown/PDF upload.
- AI model selector.
- Existing quota indicator behavior.
- Run, Apply, Regenerate, Cancel, and Close actions.
- Result preview before applying.

The user must provide at least a brief or document file. After generation succeeds, the modal shows the generated caption preview. Clicking Apply writes the caption into `state.caption`, updates `#caption-text`, and refreshes the preview. If generation fails, the existing caption stays unchanged.

## Backend Design

Add a separate caption generation path:

- `server/ai/captionPromptBuilder.js` builds the caption-only prompt and normalizes/parses caption output.
- `server/ai/captionService.js` calls the selected AI model using the same provider/model infrastructure as Auto-Fill.
- `POST /api/generate-caption` accepts `brief`, `docFile`, `model`, and optional `byokKey`, extracts document text the same way Auto-Fill does, validates input, calls the caption service, and returns `{ caption }`.

The existing Auto-Fill route should continue to accept brief/file/model/BYOK, but its output should only include slide keys. Caption should be removed from the Auto-Fill schema and prompt.

## Caption Prompt Design

The caption prompt is hardcoded server-side. It returns a small JSON object with this exact shape:

```json
{
  "caption": ""
}
```

Prompt rules:

1. Return only valid JSON.
2. Generate one caption between 100 and 200 words.
3. Use a premium, clear, professional storytelling tone.
4. Structure the caption as opening hook, short project context, key value/features, closing CTA, and optional relevant hashtags.
5. Use `\n` for paragraph line breaks.
6. Do not invent unsupported claims; use generic wording when details are missing.
7. Include exactly one output example in the prompt so the model follows the desired structure.

Example included in the prompt:

```json
{
  "caption": "From idea to interface, this project was built to make complex workflows feel simple.\n\nVisura helps creators turn project details into polished carousel content with a faster, more structured process. Instead of starting from a blank page, users can generate slide-ready copy, refine the message, and keep the presentation consistent from first impression to final CTA.\n\nThe focus is clarity, speed, and a premium storytelling flow — so every portfolio post feels intentional.\n\nReady to turn your project into content that speaks?\n\n#PortfolioDesign #DigitalProduct #CreativeWorkflow"
}
```

## Frontend Design

Add a caption generation module that mirrors the Auto-Fill modal patterns while keeping responsibilities separate. It should reuse existing BYOK helpers and quota utilities where appropriate.

Responsibilities:

- Open and close caption modal.
- Load available models through the existing `/api/models` endpoint.
- Detect BYOK availability for the selected model.
- Enforce quota for developer-key requests using the same daily quota as Auto-Fill.
- Submit brief/file/model/BYOK to `/api/generate-caption`.
- Display generated caption preview.
- Apply generated caption only after user confirmation.

Auto-Fill application logic should no longer read or write `_lastAutoFillData.caption`.

## Data Flow

1. User opens Generate Caption from the caption panel.
2. User enters brief and/or uploads a Markdown/PDF file.
3. Frontend validates model and input.
4. If not using BYOK, one shared AI quota request is consumed.
5. Frontend sends form data to `POST /api/generate-caption`.
6. Backend extracts document text, builds caption prompt, calls model, normalizes the response, and returns `{ caption }`.
7. Frontend shows preview.
8. User clicks Apply.
9. Caption textarea, generator state, and preview update.

## Error Handling

- Missing model returns a validation error.
- Missing brief and file returns a validation error.
- Unsupported or unreadable documents return an error in the modal.
- AI/provider errors return a readable modal error.
- Failed generation never changes the current caption textarea.
- If BYOK is unavailable, shared developer-key quota rules apply.

## Testing

Add or update tests for:

- Auto-Fill schema no longer includes `caption`.
- Auto-Fill normalized output only contains slide keys.
- Caption prompt builder includes exactly one output example and exact JSON shape.
- Caption output normalization trims caption text and rejects unusable output.
- Caption route rejects missing model.
- Caption route rejects requests with no brief and no document.
- Existing Auto-Fill tests continue passing after schema changes.

## Acceptance Criteria

- Auto-Fill fills only the five slide forms.
- Generate Caption is separate from Auto-Fill in UI and backend.
- Caption generation uses a dedicated prompt with one example.
- Generated caption is previewed before being applied.
- Applying caption updates textarea, state, and preview.
- Failed caption generation does not overwrite existing caption.
- Shared quota and BYOK behavior remain consistent with Auto-Fill.
