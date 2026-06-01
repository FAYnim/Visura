# BYOK (Bring Your Own Key) for AI Auto-Fill — Design Spec

## Overview
Add a **BYOK** feature for AI Auto-Fill (Gemini + Groq) so users can store their own API keys locally. Keys are stored **only in the browser (localStorage)** and are **not sent to the server** unless used for a request. A new page `/byok` provides a clean UI to save/clear keys per provider.

## Goals
- Enable BYOK for **AI Auto-Fill only**.
- Support **Gemini** and **Groq** now; allow adding providers later.
- Store keys **locally** in the browser (localStorage).
- Provide light **prefix validation** for each provider.

## Non-Goals
- No server-side storage/caching of keys.
- No multi-key management per provider (single active key only).

## Architecture
- Add new route/page: **`/byok`** (e.g., `public/byok.html` + `public/js/byok.js`).
- Store keys in localStorage under a single object.
- AI Auto-Fill uses the local key if present; otherwise falls back to existing ENV key handling.

## UI / Components
**BYOK Page Layout**
- Title: “Bring Your Own Key”
- Short helper text: keys stored in browser only.
- Two provider cards (Gemini, Groq), each with:
  - Status label: “Saved” / “Not set”
  - API key input
  - Buttons: **Save** / **Clear**
- Link back to `/app`.

**Validation**
- Gemini key must start with `AIza`.
- Groq key must start with `gsk_`.
- Empty input blocks save with inline error.

## Data Model / Storage
`localStorage.byokKeys` (JSON object, encrypted values):
```json
{
  "gemini": "enc:BASE64(...)" ,
  "groq": "enc:BASE64(...)"
}
```

**Encryption:**
- Encrypt values before storing using **Web Crypto (AES-GCM)**.
- Use a locally stored symmetric key in `localStorage.byokCryptoKey` (base64).
- No user passphrase prompt (automatic encryption/decryption).
- If key missing or corrupt, show error and require re-save.

## Data Flow
1. User opens `/byok` → load encrypted keys + crypto key → update status.
2. **Save** → validate prefix → encrypt → persist in localStorage → status = “Saved”.
3. **Clear** → remove provider key → status = “Not set”.
4. **AI Auto-Fill**:
   - If encrypted key exists for selected provider → decrypt → use for auth.
   - If not → fallback to existing ENV-based server key.

## Error Handling
- Empty input → inline error “Key tidak boleh kosong”.
- Prefix mismatch → inline error “Format key tidak valid”.
- localStorage unavailable → show error message on BYOK page.
- Encryption/decryption failure → show error and require re-save.
- API error from provider does **not** delete stored key automatically.

## Testing
- Unit: prefix validation (Gemini/Groq).
- Unit: localStorage read/write/clear.
- Integration: Auto-Fill uses BYOK when present; falls back when absent.

## Future Extensibility
- Add providers by extending the provider list and validation rules.
- UI structure supports additional provider cards without layout changes.
