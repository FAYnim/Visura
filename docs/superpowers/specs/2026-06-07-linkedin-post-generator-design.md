# LinkedIn Post Generator Design

## Summary

Add a new `/linkedin` page that generates one final LinkedIn post from project information. Users can upload a Markdown/PDF file or paste text, choose one of five predefined post styles, choose Indonesia or English, choose an AI model through the existing BYOK/model flow, then generate, copy, and save the final post to local history.

## Goals

- Create a dedicated LinkedIn post generator page separate from the existing carousel prompt generator.
- Reuse existing Markdown/PDF extraction, AI model selection, BYOK, copy, and history patterns where practical.
- Keep style definitions editable as Markdown template files.
- Generate exactly one final LinkedIn-ready post per request.

## Non-Goals

- No multi-variant generation in the first version.
- No scheduling or direct LinkedIn publishing.
- No database-backed history.
- No template editing UI in the first version.

## Route and Navigation

- Add page route: `/linkedin`.
- Serve a new static page from `public/linkedin.html`.
- Add navigation entry where existing app navigation patterns support it.

## UI Design

The page uses a single-page workflow.

Top area uses two columns:

1. Project Input
   - Markdown/PDF upload area.
   - 10 MB max file size.
   - Manual textarea for pasted project brief.
   - User may provide file, text, or both.

2. Generation Settings
   - Language selector: Indonesia or English.
   - Model selector using the existing BYOK/model availability flow.
   - Five selectable style cards.
   - Primary generate button.

Bottom area:

- Generated post panel.
- Inline empty, loading, success, and error states.
- Copy button.
- Save to history button.

## Template Design

Templates live as Markdown files under:

`server/ai/linkedin/templates/<style-id>.md`

Each template file contains:

- Frontmatter metadata:
  - `id`
  - `name`
  - optional `description`
- Instruction body with required placeholders:
  - `{projectInfo}`
  - `{language}`

The backend loads the selected template, validates required placeholders, injects project information and language, then sends the final prompt to the selected AI model.

## Backend Design

Add a LinkedIn-specific API route under the existing `/api` namespace.

Responsibilities:

- Accept multipart form data containing optional file, optional pasted text, selected style id, selected language, selected model, and optional BYOK payload.
- Validate file type and size using the same MD/PDF and 10 MB constraints as Auto-Fill.
- Extract file text using existing text extraction utilities.
- Combine uploaded content and pasted text into normalized project information.
- Reject empty project information.
- Load and validate the selected Markdown style template.
- Build the final AI prompt by injecting `{projectInfo}` and `{language}`.
- Call the selected model through the existing AI provider/model infrastructure.
- Return JSON containing the generated post body and metadata needed by the frontend.

## Data Flow

1. User opens `/linkedin`.
2. Frontend loads available models and style metadata.
3. User uploads Markdown/PDF and/or pastes project text.
4. User selects language, style, and model.
5. Frontend submits generation request.
6. Backend extracts and normalizes project info.
7. Backend loads selected Markdown template.
8. Backend injects project info and language into template.
9. Backend sends prompt to selected AI model.
10. Backend returns one final LinkedIn post.
11. User copies or saves post to local history.

## History Design

Save generated posts locally, following existing prompt history patterns where possible.

Each history item stores:

- generated post body
- style id/name
- language
- timestamp
- optional source summary or filename

History is local only in the first version.

## Error Handling

Show inline errors in the result panel for:

- missing file/text input
- unsupported file type
- file over 10 MB
- empty extracted content
- missing selected style/language/model
- unavailable API key/model
- template file missing
- template missing required placeholders
- AI provider failure
- empty AI response

Errors should not clear user input.

## Testing

Add tests for:

- Markdown template loader reads all five templates.
- Template validation requires `{projectInfo}` and `{language}`.
- Prompt builder injects project information and language correctly.
- Upload validation accepts Markdown/PDF and rejects invalid files or oversized files.
- API happy path with mocked AI response.
- API errors for missing input, invalid style, missing key/model, and empty AI response.
- Copy and save-history behavior if existing frontend test patterns support it.

## Implementation Boundaries

Keep the feature modular:

- LinkedIn route handles HTTP validation and response shape.
- Template loader handles Markdown template discovery and placeholder validation.
- Prompt builder handles injection only.
- Frontend page module handles UI state, submit, copy, and history actions.
- Existing extractor/model/BYOK utilities remain shared infrastructure.
