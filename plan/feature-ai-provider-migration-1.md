---
goal: Migrate AI Provider from OpenAI/Anthropic to Google Gemini
version: 1.0
date_created: 2026-05-29
last_updated: 2026-05-29
owner: Platform Team
status: Planned
tags: [feature, migration, ai, backend]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan migrates the AI Auto-Fill provider from OpenAI and Anthropic to Google Gemini for all LLM calls and configuration paths in the Visura backend and documentation.

## 1. Requirements & Constraints

- **REQ-001**: Replace provider selection logic to use Google Gemini only in `server/ai/autoFillService.js`.
- **REQ-002**: Use Gemini model `gemini-1.5-flash` with temperature `0.3` and JSON response handling.
- **REQ-003**: Read API key from `GEMINI_API_KEY` environment variable.
- **SEC-001**: Do not log or expose `GEMINI_API_KEY` in logs, error messages, or responses.
- **DOC-001**: Update `.env.example` and `README.md` to document Gemini-only setup.
- **CON-001**: Preserve existing `autoFillFromSources` input and output contracts.
- **GUD-001**: Use existing `httpsPost` helper and keep 60s timeout behavior.
- **PAT-001**: Keep retry-on-JSON-parse-failure behavior with a single retry.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Implement Gemini provider integration in server LLM service.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | In `server/ai/autoFillService.js`, replace provider detection block (lines 6-13) to only read `process.env.GEMINI_API_KEY || ''` into `GEMINI_KEY`, and update the warning message to reference `GEMINI_API_KEY` only. | | |
| TASK-002 | In `server/ai/autoFillService.js`, delete `callOpenAI` and `callAnthropic` functions and add `async function callGemini(systemPrompt, userPrompt)` that sends POST to `generativelanguage.googleapis.com` path `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}` with JSON body `{ "generationConfig": { "temperature": 0.3 }, "contents": [{ "role": "user", "parts": [{ "text": systemPrompt + "\n\n" + userPrompt }] }], "responseMimeType": "application/json" }`, then parse `response.candidates?.[0]?.content?.parts?.[0]?.text || '{}'` as JSON. | | |
| TASK-003 | In `server/ai/autoFillService.js`, update provider selection (lines 109-116) to use `const callLLM = GEMINI_KEY ? callGemini : null;` and update the error message to instruct setting `GEMINI_API_KEY`. | | |

### Implementation Phase 2

- GOAL-002: Update configuration and documentation for Gemini-only usage.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | In `.env.example`, replace OpenAI/Anthropic comments with Gemini-only configuration: add `GEMINI_API_KEY=AIza...` and update explanatory comments to indicate Gemini is required. | | |
| TASK-005 | In `README.md`, update the **AI Auto-Fill** feature description to mention Google Gemini instead of OpenAI/Claude, and update the setup snippet to use `GEMINI_API_KEY` only. | | |
| TASK-006 | In `README.md`, update any references to provider priority or multiple providers to Gemini-only wording. | | |

## 3. Alternatives

- **ALT-001**: Keep OpenAI/Anthropic as fallback providers; rejected because the migration requires Gemini-only support and simpler configuration.
- **ALT-002**: Use a third-party LLM SDK; rejected to avoid new dependencies and keep current HTTPS request approach.

## 4. Dependencies

- **DEP-001**: Google Gemini API access enabled for the project using the `GEMINI_API_KEY` value.
- **DEP-002**: Node.js runtime support for HTTPS requests (already in use).

## 5. Files

- **FILE-001**: `server/ai/autoFillService.js` — replace provider integration and selection.
- **FILE-002**: `.env.example` — document Gemini API key.
- **FILE-003**: `README.md` — update AI Auto-Fill setup and provider references.

## 6. Testing

- **TEST-001**: Run `npm test` to ensure schema validation tests still pass after provider migration.
- **TEST-002**: Manual API smoke test: run `npm run dev` with `GEMINI_API_KEY` set and confirm AI Auto-Fill returns valid JSON and populates fields.

## 7. Risks & Assumptions

- **RISK-001**: Gemini response format may differ from expected JSON object; mitigated by `responseMimeType` and strict JSON parsing with retry.
- **ASSUMPTION-001**: Gemini model `gemini-1.5-flash` remains available and supports `responseMimeType: application/json`.

## 8. Related Specifications / Further Reading

https://ai.google.dev/gemini-api/docs
https://ai.google.dev/gemini-api/docs/structured-output
