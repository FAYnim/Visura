# LinkedIn Post Generator Flow Report

Generated: 2026-06-07

## Overview
- **Visura** now features a dedicated **LinkedIn Post Generator** separate from the slide carousel generator.
- It supports generating exactly one ready-to-publish LinkedIn post based on user-provided inputs (a project brief and/or an uploaded Markdown/PDF document).
- The user can select from 5 predefined writing styles (templates saved as Markdown files with YAML-like frontmatter metadata).
- Language support includes Indonesia and English.
- AI provider invocation integrates with the existing **BYOK (Bring Your Own Key)** flow for Gemini and Groq, falling back to the server's `.env` configuration if client keys are absent.

---

## Flow Diagram

### LinkedIn Post Generation System Flow
```mermaid
graph TD
    A[User opens /linkedin] --> B[Fetch active models & style templates]
    B --> C[Render style cards & populate models select]
    C --> D[User inputs Brief and/or uploads MD/PDF file]
    D --> E[User clicks Generate Post]
    E --> F[Client checks local storage for encrypted BYOK key]
    F --> G{BYOK key exists?}
    G -- Yes --> H[Decrypt key client-side & append to FormData]
    G -- No --> I[Send request without byokKey]
    H & I --> J[POST /api/linkedin/generate]
    J --> K[handleLinkedinUpload: multer processes file upload]
    K --> L[validateLinkedinGenerateRequest: validate input parameters]
    L --> M{File uploaded?}
    M -- Yes --> N[extractPdfText / extractMarkdownText]
    M -- No --> O[Skip extraction]
    N & O --> P[combineProjectInfo: Merge brief and document text]
    P --> Q[loadLinkedinTemplate: Load selected markdown template]
    Q --> R[buildLinkedinPrompt: Inject projectInfo & language]
    R --> S[getModelOrThrow: Resolve model & verify API key]
    S --> T[defaultAiCaller: callWithRepair invokes Gemini/Groq]
    T --> U[normalizeLinkedinOutput: Parse & validate JSON output]
    U --> V[Send response to frontend: { post, style, language }]
    V --> W[Display post & enable Copy to Clipboard]
```

---

## Frontend Flow

The front-end user experience is implemented in [public/linkedin.html](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html) and controlled by [public/js/linkedin.js](file:///c:/xampp/htdocs/faydev/visura/public/js/linkedin.js).

- **Route & Loading**:
  - The express server serves [public/linkedin.html](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html) under the `/linkedin` path.
  - Page initialization runs sidebar wiring, retrieves user settings, and fetches active models and style templates.
- **Model and Style Setup**:
  - `loadModels()` fetches active models from `/api/models?includeUnavailable=1` and dynamically populates the models dropdown select element.
  - `loadStyles()` calls the `/api/linkedin/styles` route, populating the local `styles` collection and executing `renderStyles()` to create interactive cards with pressed state management.
- **Input Validation**:
  - `validateInput()` checks that either a non-empty `brief` is provided or a document file is uploaded.
  - Enforces that the file size is below `MAX_FILE_SIZE` (10 MB) and extension is `.md`, `.markdown`, or `.pdf`.
  - Ensures a style card is selected and a valid model is chosen.
- **Generation Trigger (`generatePost`)**:
  - Displays "Generating..." status, disables control elements to prevent double submissions.
  - Looks up the selected provider (`gemini` or `groq`) and retrieves the decrypted key using `getDecryptedByokKey()` if a BYOK key exists for the provider.
  - Populates a `FormData` object with `brief`, `styleId`, `language`, `model`, and optional `docFile` and `byokKey`.
  - Calls `POST /api/linkedin/generate` and displays the final post text.
- **Post Copy Functionality**:
  - The copy button invokes `copyPost()`, calling `copyLinkedinPost()` from [public/js/linkedinActions.js](file:///c:/xampp/htdocs/faydev/visura/public/js/linkedinActions.js).
  - Shows a glassmorphic toast notification "Copied to clipboard" on success, or directs the user to copy manually on failure.

---

## DOM to JS Mapping (`public/linkedin.html` & `public/js/linkedin.js`)

| DOM ID | Component / Description | HTML Reference | JS Event / Handling |
| --- | --- | --- | --- |
| `tab-linkedin` | Sidebar button for LinkedIn page | [public/linkedin.html#L41](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L41) | Static navigation, active state styling |
| `doc-file` | Document upload input | [public/linkedin.html#L74](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L74) | Bound to `change` listener to update file label and card state |
| `upload-zone` | Visual zone container for upload | [public/linkedin.html#L73](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L73) | Click triggers file input dialog |
| `upload-label` | Displayed filename inside upload zone | [public/linkedin.html#L75](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L75) | Updated dynamically with selected filename |
| `brief` | Textarea for manual project brief | [public/linkedin.html#L80](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L80) | Read into generation `FormData` payload |
| `language` | Select element for output language | [public/linkedin.html#L92](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L92) | Enforces Indonesian or English selection |
| `model` | Select element for AI Model | [public/linkedin.html#L99](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L99) | Populated on load, disabled during initialization |
| `style-status` | Status text for styles loading | [public/linkedin.html#L106](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L106) | Displays number of styles loaded or error info |
| `style-grid` | Container grid for style card buttons | [public/linkedin.html#L108](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L108) | Rendered dynamically; click selects active card |
| `generate-btn` | Generation action trigger button | [public/linkedin.html#L109](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L109) | Triggers `generatePost()` on click |
| `copy-btn` | Post copy-to-clipboard button | [public/linkedin.html#L120](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L120) | Triggers `copyPost()` on click; disabled by default |
| `output` | Display container for generated post | [public/linkedin.html#L123](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L123) | Shows prompt state or final post text |
| `toast` | Popup glassmorphic alert banner | [public/linkedin.html#L131](file:///c:/xampp/htdocs/faydev/visura/public/linkedin.html#L131) | Managed by `showToast()` helper |

---

## Backend Flow

The backend endpoints are defined in [server/routes/linkedin.js](file:///c:/xampp/htdocs/faydev/visura/server/routes/linkedin.js) and registered in [server.js](file:///c:/xampp/htdocs/faydev/visura/server.js#L21) under `/api`.

1. **Upload Middleware (`handleLinkedinUpload`)**:
   - Uses `multer` in-memory storage, limited to a single file payload named `docFile` with a maximum size limit of 10 MB.
   - Throws 400 Bad Request error if file size exceeds the threshold or if upload fails.
2. **Input Validation (`validateLinkedinGenerateRequest`)**:
   - Asserts a valid `modelId` matches models in the registry.
   - Validates that `styleId` corresponds to a template in the directory.
   - Enforces that `language` is Indonesia or English.
   - Requires that at least `brief` or `docText` has content.
3. **Text Extraction**:
   - If a file is uploaded, the router checks the MIME type and extension using `isLinkedinDocumentFileSupported()`.
   - Calls `extractPdfText()` for PDFs or `extractMarkdownText()` for Markdown documents to extract raw text content.
4. **Service Orchestration**:
   - Hands off data to `generateLinkedinPostFromSources()` in [server/ai/linkedin/service.js](file:///c:/xampp/htdocs/faydev/visura/server/ai/linkedin/service.js#L43-L75).
   - Combines textual information using `combineProjectInfo()`:
     ```javascript
     PROJECT BRIEF:
     [Brief Content]
     
     ---
     
     DOCUMENT CONTENT:
     [Document Text]
     ```
   - Loads the specified template via `loadLinkedinTemplate()`.
   - Builds prompts, checks key availability, calls the model, normalizes the outcome, and returns the data payload.

---

## Prompt Template System

Writing styles are designed as Markdown template files under [server/ai/linkedin/templates/](file:///c:/xampp/htdocs/faydev/visura/server/ai/linkedin/templates/).

- **Templates List**:
  1. `builder-story.md` (Build in Public style: Transparent progress and learnings).
  2. `lessons-learned.md` (Lessons Learned style: Focus on key takeaways and personal growth).
  3. `problem-solution.md` (Problem & Solution style: Case-study hook showing value).
  4. `product-launch.md` (Product Launch style: Excitement around a release or update).
  5. `technical-breakdown.md` (Technical Breakdown style: Deep-dive architecture / coding walkthrough).
- **Template Schema & Metadata Parsing**:
  - `parseFrontmatter()` separates the YAML metadata block from the markdown instruction body.
  - Validates that template headers have `id`, `name`, and `description`.
  - Ensures the body contains the required placeholders: `{projectInfo}` and `{language}`.
- **Prompt Building (`buildLinkedinPrompt`)**:
  - Inserts the normalized project information and target language into the template.
  - Pairs the resolved instruction with a standard system prompt instructing the AI model to behave as an expert LinkedIn content strategist and to return **JSON only** matching the JSON Output format.

---

## AI Service Flow & JSON Normalization

- **Provider Resolution**:
  - `generateLinkedinPostFromSources()` resolves the provider (`gemini` or `groq`) based on `modelId`.
  - Fetches local BYOK credentials (`byokKey`) or falls back to system environment variables (`GEMINI_API_KEY` / `GROQ_API_KEY`).
- **AI Invocation**:
  - Executes the model call using `defaultAiCaller()`.
  - Employs `callWithRepair()` to retry/correct JSON formatting issues automatically if the LLM output violates standard JSON rules.
- **Output Validation**:
  - The model returns a structured JSON payload containing the final post text.
  - `normalizeLinkedinOutput()` parses the raw JSON, validates that `raw.post` exists, and returns the trimmed post string.

---

## Error Handling

- **Client Validation**:
  - Blocks requests before network dispatch if inputs are missing or files are too large.
  - Intercepts and displays file type errors in the result box when a user tries to upload unsupported formats.
- **Server HTTP Validation**:
  - Returns HTTP 400 with a detailed validation message if fields, languages, styles, or file uploads do not conform.
- **Service & Provider Failures**:
  - Throws an error if no API key is available for the resolved provider.
  - Responds with HTTP 500 containing a detailed error description if AI invocation fails or the output cannot be parsed.

---

## Data Contracts

### Request Payload (`POST /api/linkedin/generate`)
`multipart/form-data` parameters:
- `brief`: string (optional)
- `docFile`: file binary (optional, `.pdf`, `.md`, `.markdown`)
- `styleId`: string (required, e.g., `'builder-story'`)
- `language`: string (required, `'Indonesia'` or `'English'`)
- `model`: string (required, e.g., `'gemini-2.5-flash'`)
- `byokKey`: string (optional, client decrypted API key)

### Response Payload (JSON)
On success (HTTP 200):
```json
{
  "post": "The generated LinkedIn post text...",
  "style": {
    "id": "builder-story",
    "name": "Build in Public",
    "description": "Transparent build progress, milestones, challenges, and future plans."
  },
  "language": "Indonesia"
}
```

On validation or server error (HTTP 400/500):
```json
{
  "error": "Descriptive error message here."
}
```

---

## Test Coverage

The feature is fully tested with unit and integration tests across multiple suites:

1. **Template Loader Tests ([tests/linkedinTemplateLoader.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/linkedinTemplateLoader.test.js))**:
   - Verifies correct frontmatter parsing and template validations.
   - Enforces placeholder checks (`{projectInfo}` and `{language}`).
   - Assures all 5 production templates exist and are read correctly.
   - Tests file path injection guards and ID mismatch conditions.
2. **Prompt Builder Tests ([tests/linkedinPromptBuilder.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/linkedinPromptBuilder.test.js))**:
   - Assures project information and language parameters are injected.
   - Verifies system prompt constraints.
   - Tests `normalizeLinkedinOutput()` parsing and trimming behaviors.
   - Evaluates behavior under empty inputs or unsupported languages.
3. **Service Integration Tests ([tests/linkedinService.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/linkedinService.test.js))**:
   - Validates project details merging (`combineProjectInfo`).
   - Mock tests the service orchestration loop with custom `aiCaller` injection.
   - Tests error handling when API credentials are missing.
4. **Upload Validation Tests ([tests/linkedinUploadValidation.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/linkedinUploadValidation.test.js))**:
   - Ensures only Markdown and PDF files are allowed.
   - Validates language boundaries.
5. **Route Validation Tests ([tests/linkedinRouteValidation.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/linkedinRouteValidation.test.js))**:
   - Tests validate incoming routing payloads (`brief`, `styleId`, `language`, `modelId`).
6. **Actions Tests ([tests/linkedinActions.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/linkedinActions.test.js))**:
   - Tests copy-to-clipboard utilities and mock navigator clipboard interactions.
