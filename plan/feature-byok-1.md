---
goal: Enable BYOK (Bring Your Own Key) for AI Auto-Fill with local encryption
version: 1.0
date_created: 2026-06-01
last_updated: 2026-06-01
owner: 
status: Planned
tags: [feature, security, ai]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan implements a BYOK page and client/server wiring so AI Auto-Fill can use user-provided Gemini/Groq API keys stored locally with browser-side AES-GCM encryption.

## 1. Requirements & Constraints

- **REQ-001**: Support BYOK only for AI Auto-Fill.
- **REQ-002**: Support providers Gemini and Groq.
- **REQ-003**: Store keys in browser localStorage only.
- **REQ-004**: Encrypt keys before storage using Web Crypto AES-GCM.
- **REQ-005**: Use stored keys for Auto-Fill requests when available; otherwise fallback to existing ENV-based keys.
- **REQ-006**: Provide prefix validation (`AIza` for Gemini, `gsk_` for Groq).
- **CON-001**: No user passphrase prompts; encryption key is stored locally.
- **CON-002**: Single active key per provider.
- **GUD-001**: Follow existing UI styles in `public/css/styles.css`.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add BYOK page and client-side key management with encryption.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `public/byok.html` with layout: header + title/description + two provider cards + Save/Clear buttons + link to `/app`. | | |
| TASK-002 | Add `public/js/byok.js` implementing: load keys, display status, validate prefixes, encrypt/decrypt with Web Crypto AES-GCM, store encrypted values in `localStorage.byokKeys`, store base64 key in `localStorage.byokCryptoKey`. | | |
| TASK-003 | Add minimal BYOK-specific styles to `public/css/styles.css` (or reuse existing form/card classes) and ensure page matches dark theme. | | |

### Implementation Phase 2

- GOAL-002: Wire BYOK keys into Auto-Fill requests and server provider calls.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Update `public/js/autoFill.js` to read decrypted BYOK key for selected provider and include it in the `/api/auto-fill` request (e.g., add `byokKey` field to FormData). | | |
| TASK-005 | Update `server/routes/autoFill.js` to accept `byokKey` from request body and pass it to the service layer. | | |
| TASK-006 | Update `server/ai/autoFillService.js` to accept an optional `byokKey` parameter and use it for provider auth when present; fallback to ENV keys otherwise. | | |

### Implementation Phase 3

- GOAL-003: Add tests for BYOK validation and encryption helpers.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Add `tests/byokCrypto.test.js` for: prefix validation, encrypt/decrypt roundtrip, and handling missing crypto key. | | |
| TASK-008 | Add `tests/byokAutoFillFallback.test.js` to confirm BYOK key overrides ENV key for request payload (mocked at service input level). | | |

## 3. Alternatives

- **ALT-001**: Store keys in plaintext localStorage. Rejected due to added risk and user request for encryption.
- **ALT-002**: Use user passphrase for encryption. Rejected to avoid UX friction and requirement for automatic storage.

## 4. Dependencies

- **DEP-001**: Web Crypto API (browser built-in).
- **DEP-002**: Existing Express Auto-Fill route and service pipeline.

## 5. Files

- **FILE-001**: `public/byok.html`
- **FILE-002**: `public/js/byok.js`
- **FILE-003**: `public/css/styles.css`
- **FILE-004**: `public/js/autoFill.js`
- **FILE-005**: `server/routes/autoFill.js`
- **FILE-006**: `server/ai/autoFillService.js`
- **FILE-007**: `tests/byokCrypto.test.js`
- **FILE-008**: `tests/byokAutoFillFallback.test.js`

## 6. Testing

- **TEST-001**: Verify AES-GCM encrypt/decrypt roundtrip using generated local key.
- **TEST-002**: Verify prefix validation rejects invalid keys and accepts valid keys.
- **TEST-003**: Verify Auto-Fill uses BYOK key when provided and falls back to ENV when absent.

## 7. Risks & Assumptions

- **RISK-001**: localStorage cleared by user will invalidate encryption key and stored ciphertext; UI must handle and require re-save.
- **ASSUMPTION-001**: Web Crypto API is available in supported browsers.

## 8. Related Specifications / Further Reading

- `docs/superpowers/specs/2026-06-01-byok-design.md`
