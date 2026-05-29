# AI Generate Flow Report

Generated: 2026-05-29

## Overview
- Frontend entry point calls `initAutoFill()` during app initialization in [public/js/generator.js](public/js/generator.js#L853).
- UI action posts a multipart `FormData` request to `/api/auto-fill` in [public/js/generator.js](public/js/generator.js#L1004-L1034).
- Backend registers `/api` routes in [server.js](server.js#L17) and handles `/auto-fill` in [server/routes/autoFill.js](server/routes/autoFill.js#L21).
- AI flow builds prompt and normalizes output via `buildPrompt()` and `normalizeOutput()` in [server/ai/promptBuilder.js](server/ai/promptBuilder.js#L78-L131).

Flow Diagram (ASCII)
```
[UI Button] -> [initAutoFill] -> [runAutoFill]
   -> POST /api/auto-fill (FormData: brief, docFile)
   -> /api/auto-fill route
      -> extractPdfText / extractMarkdownText
      -> autoFillFromSources
         -> buildPrompt -> callGemini -> normalizeOutput
      -> respond { data, coverage, emptyFields }
   -> setResult / applyAutoFill
```

## Frontend Flow
- Modal trigger button is defined in [public/index.html](public/index.html#L555) and bound in [public/js/generator.js](public/js/generator.js#L875).
- Modal elements and inputs are defined in [public/index.html](public/index.html#L590-L700) and queried in [public/js/generator.js](public/js/generator.js#L876-L896).
- `runAutoFill()` gathers `brief` and optional `docFile`, constructs `FormData`, and posts to `/api/auto-fill` in [public/js/generator.js](public/js/generator.js#L1004-L1034).
- Response is parsed as `{ data, coverage, emptyFields }` and rendered in `setResult()` in [public/js/generator.js](public/js/generator.js#L1045-L1048) and [public/js/generator.js](public/js/generator.js#L959-L982).
- `applyAutoFill()` maps `slide1..slide5` to local state and updates all inputs in [public/js/generator.js](public/js/generator.js#L1056-L1088).

DOM to JS Mapping
| DOM ID | HTML | JS Binding | Handler or Usage |
| --- | --- | --- | --- |
| btn-ai-fill | [public/index.html](public/index.html#L555) | [public/js/generator.js](public/js/generator.js#L875) | `btnOpen` click opens modal in [public/js/generator.js](public/js/generator.js#L913) |
| autofill-modal | [public/index.html](public/index.html#L592) | [public/js/generator.js](public/js/generator.js#L876) | Modal visibility managed inside `initAutoFill()` in [public/js/generator.js](public/js/generator.js#L874-L919) |
| autofill-backdrop | [public/index.html](public/index.html#L590) | [public/js/generator.js](public/js/generator.js#L877) | Backdrop click closes modal in [public/js/generator.js](public/js/generator.js#L916) |
| af-brief | [public/index.html](public/index.html#L627) | [public/js/generator.js](public/js/generator.js#L884) | Read into `brief` in [public/js/generator.js](public/js/generator.js#L1005) |
| af-doc-file | [public/index.html](public/index.html#L642) | [public/js/generator.js](public/js/generator.js#L885) | Read into `file` in [public/js/generator.js](public/js/generator.js#L1006) |
| autofill-run | [public/index.html](public/index.html#L700) | [public/js/generator.js](public/js/generator.js#L880) | Click runs `runAutoFill()` in [public/js/generator.js](public/js/generator.js#L1090) |
| autofill-apply | [public/index.html](public/index.html#L696) | [public/js/generator.js](public/js/generator.js#L881) | Click runs `applyAutoFill()` in [public/js/generator.js](public/js/generator.js#L1091) |
| autofill-regenerate | [public/index.html](public/index.html#L692) | [public/js/generator.js](public/js/generator.js#L882) | Click re-runs `runAutoFill()` in [public/js/generator.js](public/js/generator.js#L1092) |

## Backend Flow
- `/api` route base is registered in [server.js](server.js#L17).
- `/auto-fill` POST route uses `multer` memory storage and accepted fields in [server/routes/autoFill.js](server/routes/autoFill.js#L10-L19).
- Request parsing reads `brief` and `req.files` in [server/routes/autoFill.js](server/routes/autoFill.js#L23-L24).
- File handling extracts PDF or Markdown text in [server/routes/autoFill.js](server/routes/autoFill.js#L28-L35) using helpers in [server/ai/textExtractors.js](server/ai/textExtractors.js#L13-L38).
- LLM call is executed via `autoFillFromSources()` in [server/routes/autoFill.js](server/routes/autoFill.js#L47) and implemented in [server/ai/autoFillService.js](server/ai/autoFillService.js#L41-L71).
- Coverage stats are computed and returned as `{ data, coverage, emptyFields }` in [server/routes/autoFill.js](server/routes/autoFill.js#L49-L68).
- `screenshotFile` is accepted but not processed in MVP in [server/routes/autoFill.js](server/routes/autoFill.js#L18-L40).

## AI Service Flow
- Provider config reads `GEMINI_API_KEY` in [server/ai/autoFillService.js](server/ai/autoFillService.js#L8-L11).
- `callGemini()` sends `systemPrompt` and `userPrompt` using `@google/genai` in [server/ai/autoFillService.js](server/ai/autoFillService.js#L15-L33).
- `autoFillFromSources()` builds prompts, calls the provider, and retries once with a repair prompt on failure in [server/ai/autoFillService.js](server/ai/autoFillService.js#L41-L66).
- Output is normalized to schema shape by `normalizeOutput()` in [server/ai/autoFillService.js](server/ai/autoFillService.js#L71).

## Prompt + Schema
- Schema shape is defined in `SCHEMA` in [server/ai/promptBuilder.js](server/ai/promptBuilder.js#L7-L65).
- `buildPrompt()` embeds the schema into the system prompt and combines `brief` and `docText` in [server/ai/promptBuilder.js](server/ai/promptBuilder.js#L78-L104).
- `normalizeOutput()` deep clones `SCHEMA` and merges only known keys in [server/ai/promptBuilder.js](server/ai/promptBuilder.js#L114-L129).

## Error Handling
- Frontend shows validation error when both `brief` and file are empty in [public/js/generator.js](public/js/generator.js#L1009).
- Frontend network and parse errors are surfaced via `setError()` in [public/js/generator.js](public/js/generator.js#L991-L999).
- Backend returns 400 when no `brief` and no `docText` are provided in [server/routes/autoFill.js](server/routes/autoFill.js#L43).
- Backend returns 500 on unhandled errors in [server/routes/autoFill.js](server/routes/autoFill.js#L71).
- AI service throws when no API key is set and retries once on invalid JSON in [server/ai/autoFillService.js](server/ai/autoFillService.js#L50-L66).

## Data Contracts
Request (multipart/form-data)
- `brief`: string appended in [public/js/generator.js](public/js/generator.js#L1030) and read in [server/routes/autoFill.js](server/routes/autoFill.js#L23).
- `docFile`: optional file appended in [public/js/generator.js](public/js/generator.js#L1031) and read in [server/routes/autoFill.js](server/routes/autoFill.js#L28-L29).

Response (JSON)
- `data`: normalized schema object returned in [server/routes/autoFill.js](server/routes/autoFill.js#L68) and applied in [public/js/generator.js](public/js/generator.js#L1045-L1059).
- `coverage`: percent integer returned in [server/routes/autoFill.js](server/routes/autoFill.js#L66-L68) and used in [public/js/generator.js](public/js/generator.js#L959-L972).
- `emptyFields`: array of empty field paths returned in [server/routes/autoFill.js](server/routes/autoFill.js#L50-L61) and rendered in [public/js/generator.js](public/js/generator.js#L976-L978).

## Test Coverage
- Schema presence for all slides is asserted in [tests/autoFillSchema.test.js](tests/autoFillSchema.test.js#L12-L15).
- Required keys for slides and feature sets are validated in [tests/autoFillSchema.test.js](tests/autoFillSchema.test.js#L18-L39).
- `normalizeOutput()` behavior is tested in [tests/autoFillSchema.test.js](tests/autoFillSchema.test.js#L53-L66).
- `validateSchema` helper ensures shape in [tests/autoFillSchema.test.js](tests/autoFillSchema.test.js#L69-L77).
