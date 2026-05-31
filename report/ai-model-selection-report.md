# AI Model Selection Report

Generated: 2026-05-31

## Overview
- **Model Registry**: Static config in [server/ai/models.js](server/ai/models.js#L1-L6) defines 4 models across 2 providers (Gemini, Groq).
- **API Endpoint**: `GET /api/models` returns models filtered by configured API keys in [server/routes/autoFill.js](server/routes/autoFill.js#L19-L22).
- **Frontend Dropdown**: `<select id="af-model">` added to Auto-Fill modal in [public/app.html](public/app.html#L636-L642), styled in [public/css/styles.css](public/css/styles.css#L2397-L2431).
- **Selection Persistence**: Last chosen model saved to `localStorage` under `visura_last_model` in [public/js/autoFill.js](public/js/autoFill.js#L15).
- **Backend Dispatch**: `autoFillFromSources()` now accepts `modelId`, resolves via `getModelOrThrow()`, routes to correct provider in [server/ai/autoFillService.js](server/ai/autoFillService.js#L81-L91).
- **No Fallback Chain**: Removed. If chosen model fails, error propagates to user — they retry with a different model.
- **Retry-with-Repair**: Still applies. One retry with repair prompt on JSON parse failure in [server/ai/autoFillService.js](server/ai/autoFillService.js#L56-L64).

Flow Diagram (ASCII)
```
[User opens modal]
   -> openModal() -> loadModels()
      -> GET /api/models
         -> SUCCESS: populate <select> from response
         -> FAIL:    populate <select> from FALLBACK_MODELS
      -> restore last selected model from localStorage

[User clicks "Run"]
   -> runAutoFill()
      -> validate model selected (else show error)
      -> POST /api/auto-fill (FormData: brief, docFile, model)
      -> /api/auto-fill route
         -> read modelId from req.body.model
         -> autoFillFromSources({ brief, docText }, modelId)
            -> getModelOrThrow(modelId)
               -> lookup in MODELS registry
               -> validate provider API key is configured
            -> PROVIDER_MAP[model.provider]
               -> gemini: callGemini(systemPrompt, userPrompt, modelName)
               -> groq:   callGroq(systemPrompt, userPrompt, modelName)
            -> callWithRepair(callFn, ...) retries once on JSON parse failure
            -> normalizeOutput(raw)
         -> respond { data, coverage, emptyFields }
      -> on success: localStorage.setItem('visura_last_model', model)
      -> render setResult(data, coverage, emptyFields)

[User clicks "Apply"]
   -> applyAutoFill()
      -> map slide1..slide5 to state
      -> update form inputs + re-render preview
      -> close modal, show toast
```

## Frontend Flow
- Model selection dropdown is defined in [public/app.html](public/app.html#L636-L642) and bound in [public/js/autoFill.js](public/js/autoFill.js#L34).
- `loadModels()` fetches model list from `/api/models`, falls back to hardcoded `FALLBACK_MODELS` on error, restores saved selection from localStorage in [public/js/autoFill.js](public/js/autoFill.js#L65-L90).
- `runAutoFill()` reads `modelSelect.value`, validates it's non-empty, appends `model` to `FormData`, and sends to `/api/auto-fill` in [public/js/autoFill.js](public/js/autoFill.js#L172-L228).
- On success, model is persisted to `localStorage.setItem(MODEL_STORAGE_KEY, model)` in [public/js/autoFill.js](public/js/autoFill.js#L221).
- `FALLBACK_MODELS` hardcoded array in [public/js/autoFill.js](public/js/autoFill.js#L46-L49) is used when `GET /api/models` fails.

DOM to JS Mapping
| DOM ID | HTML | JS Binding | Handler or Usage |
| --- | --- | --- | --- |
| af-model | [public/app.html](public/app.html#L640) | [public/js/autoFill.js](public/js/autoFill.js#L34) | `modelSelect` used in `loadModels()` at [public/js/autoFill.js](public/js/autoFill.js#L65) and `runAutoFill()` at [public/js/autoFill.js](public/js/autoFill.js#L175) |
| autofill-run | [public/app.html](public/app.html#L646) | [public/js/autoFill.js](public/js/autoFill.js#L254) | Click runs `runAutoFill()` at [public/js/autoFill.js](public/js/autoFill.js#L172) |

## Backend Flow
- `GET /api/models` is registered at [server/routes/autoFill.js](server/routes/autoFill.js#L19-L22), filters `MODELS` by `isProviderAvailable()` to only return models whose API key is configured in `.env`.
- `POST /api/auto-fill` reads `model` field from `req.body.model` in [server/routes/autoFill.js](server/routes/autoFill.js#L27) and returns 400 if missing in [server/routes/autoFill.js](server/routes/autoFill.js#L30-L32).
- Route passes `modelId` to `autoFillFromSources({ brief, docText }, modelId)` in [server/routes/autoFill.js](server/routes/autoFill.js#L49).
- Route base is registered in [server.js](server.js#L7) and mounted at [server.js](server.js#L19).

## AI Service Flow
- Model registry is imported from [server/ai/models.js](server/ai/models.js#L1-L6) in [server/ai/autoFillService.js](server/ai/autoFillService.js#L3).
- `getModelOrThrow(modelId)` validates model exists and its provider has a configured API key in [server/ai/autoFillService.js](server/ai/autoFillService.js#L66-L79).
- `PROVIDER_MAP` dispatches to `callGemini()` or `callGroq()` based on model's provider field in [server/ai/autoFillService.js](server/ai/autoFillService.js#L51-L54).
- `callGemini()` uses `modelName` parameter instead of hardcoded string in [server/ai/autoFillService.js](server/ai/autoFillService.js#L12-L24).
- `callGroq()` uses `modelName` parameter instead of hardcoded string in [server/ai/autoFillService.js](server/ai/autoFillService.js#L26-L49).
- `callWithRepair()` retries once with repair prompt on JSON parse failure in [server/ai/autoFillService.js](server/ai/autoFillService.js#L56-L64).
- `isProviderAvailable(provider)` checks if a provider's API key is configured in [server/ai/autoFillService.js](server/ai/autoFillService.js#L93-L97), used by the route to filter the model list.
- Old `createProviderChain()` and provider fallback loop removed.

## Data Contracts

### Model Registry (`server/ai/models.js`)
```typescript
interface ModelEntry {
  id: string;         // Unique model identifier (e.g. "gemini-2.5-flash")
  label: string;      // Human-readable label (e.g. "Gemini 2.5 Flash")
  provider: string;   // Provider key: "gemini" | "groq"
  modelName: string;  // API model name (e.g. "gemini-2.5-flash", "llama-3.3-70b-versatile")
}
```

### GET /api/models Response
```json
{
  "models": [
    { "id": "gemini-2.5-flash", "label": "Gemini 2.5 Flash", "provider": "gemini" },
    { "id": "llama-3.3-70b",    "label": "LLaMA 3.3 70B",    "provider": "groq" }
  ]
}
```

### POST /api/auto-fill Request (multipart/form-data)
| Field | Type | Required | Source |
| --- | --- | --- | --- |
| brief | string | optional* | [public/js/autoFill.js](public/js/autoFill.js#L203) |
| docFile | file | optional* | [public/js/autoFill.js](public/js/autoFill.js#L205) |
| model | string | **required** | [public/js/autoFill.js](public/js/autoFill.js#L204) |

*\*At least one of brief or docFile must be provided.*

### POST /api/auto-fill Response
Same as existing: `{ data, coverage, emptyFields }` — unchanged schema.

### localStorage
| Key | Value | Set In |
| --- | --- | --- |
| `visura_last_model` | Model ID string (e.g. `"gemini-2.5-flash"`) | [public/js/autoFill.js](public/js/autoFill.js#L221) |

## Error Handling
- Frontend shows validation error when no model selected in [public/js/autoFill.js](public/js/autoFill.js#L177-L180).
- Frontend falls back to hardcoded `FALLBACK_MODELS` when `GET /api/models` fails in [public/js/autoFill.js](public/js/autoFill.js#L79-L83).
- Backend returns 400 when `model` field is missing from request body in [server/routes/autoFill.js](server/routes/autoFill.js#L30-L32).
- Backend `getModelOrThrow()` throws descriptive errors for:
  - Missing/null modelId in [server/ai/autoFillService.js](server/ai/autoFillService.js#L67-L69)
  - Unknown model ID in [server/ai/autoFillService.js](server/ai/autoFillService.js#L71-L73)
  - Unconfigured API key in [server/ai/autoFillService.js](server/ai/autoFillService.js#L74-L77)
- AI extraction errors (API failure, network, parse) propagate directly to user — no fallback chain in [server/ai/autoFillService.js](server/ai/autoFillService.js#L81-L91).
- Retry-with-repair still handles transient JSON parse failures in [server/ai/autoFillService.js](server/ai/autoFillService.js#L56-L64).

## Model List (Current)
| ID | Label | Provider | API Model Name |
| --- | --- | --- | --- |
| `gemini-2.5-flash` | Gemini 2.5 Flash | gemini | `gemini-2.5-flash` |
| `gemini-2.0-flash` | Gemini 2.0 Flash | gemini | `gemini-2.0-flash` |
| `llama-3.3-70b` | LLaMA 3.3 70B | groq | `llama-3.3-70b-versatile` |
| `mixtral-8x7b` | Mixtral 8×7B | groq | `mixtral-8x7b-32768` |

## Environment Variables
| Variable | Provider | Used In |
| --- | --- | --- |
| `GEMINI_API_KEY` | gemini | [server/ai/autoFillService.js](server/ai/autoFillService.js#L5) |
| `GROQ_API_KEY` | groq | [server/ai/autoFillService.js](server/ai/autoFillService.js#L6) |

Models are automatically filtered out from `GET /api/models` if their provider's API key is not set.

## Test Coverage
- `getModelOrThrow`: valid model ID returns correct model object in [tests/autoFillFallback.test.js](tests/autoFillFallback.test.js#L3-L11).
- `getModelOrThrow`: missing model ID (null/empty) throws in [tests/autoFillFallback.test.js](tests/autoFillFallback.test.js#L13-L26).
- `getModelOrThrow`: unknown model ID throws in [tests/autoFillFallback.test.js](tests/autoFillFallback.test.js#L28-L36).
- Schema and normalization tests remain unchanged in [tests/autoFillSchema.test.js](tests/autoFillSchema.test.js).

## File Index
- `server/ai/models.js` — **created** — Model registry with 4 entries
- `server/ai/autoFillService.js` — **modified** — Accepts `modelId`, `PROVIDER_MAP` dispatch, `getModelOrThrow()`, `isProviderAvailable()`, removed fallback chain
- `server/routes/autoFill.js` — **modified** — Added `GET /api/models`, wired `model` to POST handler
- `public/app.html` — **modified** — Added `<select id="af-model">` in Auto-Fill modal
- `public/css/styles.css` — **modified** — Added `.autofill-select` styles (4 rules)
- `public/js/autoFill.js` — **modified** — Added `loadModels()`, model validation, localStorage persistence
- `tests/autoFillFallback.test.js` — **modified** — Tests for `getModelOrThrow()` replacing old fallback chain tests
