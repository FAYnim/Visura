# Article Generator Design

Date: 2026-06-13

## Summary

Add a new `/article` feature that turns a project brief, Markdown file, PDF file, or plain text source into a long-form project article. The article is not news content. It is portfolio storytelling for builders: what problem the project solves, how it was built, what decisions were made, what changed, and what lessons came from the work.

The design follows the existing LinkedIn generator architecture to keep the feature consistent with Visura's current AI, upload, BYOK, template, validation, and test patterns.

## Goals

- Provide a dedicated Article Generator route at `/article`.
- Accept text input and optional Markdown/PDF upload.
- Let users choose language, length, AI model, and article style.
- Generate structured project articles as Markdown.
- Show both raw Markdown and rendered preview.
- Support copy-to-clipboard for the generated article.
- Keep MVP focused: no article history and no file download.

## Non-Goals

- No article history in MVP.
- No download-to-file action in MVP.
- No user-editable templates in MVP.
- No generic multi-platform content engine yet.
- No image upload or screenshot analysis.

## Route and UX

The feature adds a new page at `/article`. The page follows the current dark Visura UI and the interaction model already used by `/linkedin`.

The user flow:

1. Open `/article`.
2. Paste a brief, upload a Markdown/PDF document, or provide both.
3. Select output language: Indonesia or English.
4. Select article length: short, medium, or long.
5. Select an AI model from the active model list.
6. Select one article style.
7. Generate article.
8. Review title, excerpt, raw Markdown, and rendered preview.
9. Copy the Markdown article.

Article length options:

- Short: 600–900 words.
- Medium: 1000–1500 words.
- Long: 1800–2500 words.

## Article Styles

Styles are selectable templates stored as Markdown files under `server/ai/article/templates/`.

MVP styles:

1. `problem-solution` — explains the pain point, why it matters, and how the project solves it.
2. `build-process` — walks through the build journey, decisions, iterations, and trade-offs.
3. `technical-breakdown` — focuses on architecture, implementation details, and technical reasoning.
4. `founder-story` — frames the project through motivation, product thinking, and personal insight.

Each template includes frontmatter metadata with `id`, `name`, and `description`, plus a body containing required placeholders for project information, language, and length.

## Backend Architecture

Add `server/routes/article.js` and mount it under `/api/article` from `server.js`.

Backend modules live under `server/ai/article/`:

- `templateLoader.js` loads and validates article templates.
- `promptBuilder.js` builds the model prompt from source text, selected style, language, and length.
- `service.js` coordinates text merging, model resolution, AI invocation, repair retry, and output normalization.

The backend reuses existing infrastructure:

- `multer` memory upload for Markdown/PDF files.
- `server/ai/textExtractors.js` for Markdown/PDF extraction.
- `server/ai/models.js` for model lookup and provider API key resolution.
- Existing Gemini/Groq calling and JSON repair patterns from current AI services.
- BYOK first, environment variable fallback second.

## API Design

### `GET /api/article/styles`

Returns available article styles from template metadata.

Response shape:

```json
{
  "styles": [
    {
      "id": "problem-solution",
      "name": "Problem & Solution",
      "description": "Turn a project into a clear case-study article."
    }
  ]
}
```

### `POST /api/article/generate`

Accepts `multipart/form-data`.

Fields:

- `brief`: optional plain text source.
- `docFile`: optional Markdown/PDF file.
- `styleId`: required.
- `language`: required, `Indonesia` or `English`.
- `length`: required, `short`, `medium`, or `long`.
- `model`: required active model id.
- `byokKey`: optional provider key from client-side BYOK flow.

At least one of `brief` or `docFile` must contain content.

Response shape:

```json
{
  "title": "How Visura Turns Project Work Into Portfolio Content",
  "excerpt": "A concise summary of the generated article.",
  "articleMarkdown": "# How Visura Turns Project Work Into Portfolio Content\n\n...",
  "articleHtml": "<h1>How Visura Turns Project Work Into Portfolio Content</h1>...",
  "style": "problem-solution",
  "language": "English",
  "length": "medium"
}
```

### Markdown Rendering

The backend renders `articleMarkdown` to `articleHtml` using the existing `markdown-it` dependency. This keeps preview rendering consistent and avoids adding a client-side Markdown parser.

## Prompt and Output Contract

The AI prompt must clearly state that the output is a project article, not a news article. It should extract useful details from the source and reshape them into a coherent article without inventing unsupported claims.

The model must return JSON only:

```json
{
  "title": "string",
  "excerpt": "string",
  "articleMarkdown": "string"
}
```

Normalization rules:

- `title` must be a non-empty string.
- `excerpt` must be a non-empty string.
- `articleMarkdown` must be a non-empty Markdown string.
- Leading/trailing whitespace is trimmed.
- Malformed JSON gets one repair attempt.
- If repair fails, return a clear generation error.

## Frontend Components

Add:

- `public/article.html` for the page structure.
- `public/js/article.js` for page state, model/style loading, validation, submission, and rendering.
- `public/js/articleActions.js` for copy-to-clipboard behavior and testable UI actions.

The page includes:

- Source textarea.
- Markdown/PDF upload zone.
- Language select.
- Length select.
- Model select.
- Style cards.
- Generate button.
- Output title and excerpt.
- Raw Markdown panel.
- Rendered preview panel.
- Copy button.
- Status and toast messages.

## Data Flow

1. Client loads `/article`.
2. Client fetches `/api/models?includeUnavailable=1` and `/api/article/styles`.
3. User enters source and generation options.
4. Client validates required fields, file type, and file size.
5. Client decrypts BYOK key for the selected provider when available.
6. Client submits `FormData` to `/api/article/generate`.
7. Route validates request and extracts document text if a file exists.
8. Service combines manual brief and document text.
9. Template loader resolves selected article style.
10. Prompt builder injects source, language, and length instructions.
11. AI caller generates JSON, with repair retry if needed.
12. Service normalizes JSON and renders Markdown to HTML.
13. Client renders title, excerpt, raw Markdown, rendered preview, and copy action.

## Error Handling

Client-side errors:

- Missing brief and missing file.
- Unsupported file type.
- File larger than 10 MB.
- Missing style.
- Missing model.
- Missing language or length.

Server-side errors:

- Invalid model id.
- Invalid style id.
- Invalid language.
- Invalid length.
- Unsupported or oversized uploaded file.
- Empty extracted document text.
- Missing API key for selected provider.
- AI provider failure.
- Malformed AI JSON after repair.
- Missing required output fields.
- Markdown rendering failure.

Errors should be shown in the output area with concise user-facing messages.

## Testing Plan

Add tests parallel to the LinkedIn generator test structure:

- Article template loader validates metadata and placeholders.
- Article prompt builder injects project info, language, length, and style instructions.
- Article service combines brief and document text.
- Article service normalizes valid model output.
- Article service rejects malformed output after failed repair.
- Article upload validation accepts `.md`, `.markdown`, and `.pdf` within 10 MB.
- Article route validation rejects missing input, invalid model, invalid style, invalid language, and invalid length.
- Article actions copy generated Markdown and handle clipboard failure.
- Article frontend state enables preview and copy only after successful generation.

Run `npm test` after implementation.

## Open Decisions Resolved

- Route: dedicated `/article` page.
- Length: user-selectable short, medium, or long.
- Language: Indonesia/English selectable.
- Styles: fixed templates in MVP.
- History: not included in MVP.
- Output actions: copy plus raw/rendered preview.
- Preview rendering: backend `markdown-it` rendering.

## Approval

This design was approved through the brainstorming flow before implementation planning.
