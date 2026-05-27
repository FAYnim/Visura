# PRD: AI Auto‑Fill (Brief + Screenshot + MD/PDF) for Visura

## 1. Executive Summary

**Problem Statement**: Mengisi banyak field secara manual untuk 5 slide memakan waktu dan membuat workflow lambat.

**Proposed Solution**: Tambahkan fitur AI Auto‑Fill yang mengekstrak informasi dari brief teks, screenshot, dan file Markdown/PDF untuk mengisi semua field slide secara otomatis.

**Success Criteria**:
- ≥90% field terisi otomatis pada rata‑rata dataset uji.
- Waktu ekstraksi end‑to‑end 10–30 detik per request.
- Pengguna hanya perlu edit minor (manual edits turun signifikan dari baseline).

## 2. User Experience & Functionality

**User Personas**:
- Creator/Designer yang membuat carousel portofolio secara cepat.
- Freelancer/agency yang punya banyak proyek dan butuh efisiensi input.

**User Stories**:
1. *Sebagai creator, saya ingin mengunggah brief + screenshot + file (MD/PDF) agar field slide terisi otomatis sehingga saya tidak perlu mengisi manual.*
2. *Sebagai creator, saya ingin melihat ringkasan hasil autofill (berapa field terisi/kosong) agar bisa yakin sebelum apply.*
3. *Sebagai creator, saya ingin bisa regenerate hasil tanpa mengubah input agar bisa membandingkan output.*

**Acceptance Criteria**:
- Terdapat tombol **AI Auto‑Fill** di halaman generator.
- Modal/panel menyediakan:
  - Textarea brief
  - Upload screenshot (image)
  - Upload Markdown/PDF (≤10 MB)
- Proses ekstraksi menampilkan state loading dan estimasi 10–30 detik.
- Setelah selesai, tampil ringkasan: jumlah/percent field terisi dan daftar field kosong.
- Tombol **Apply to All Slides** mengisi seluruh field form.
- Tombol **Regenerate** memakai input yang sama.
- Jika ekstraksi gagal, tampil error yang jelas dan tidak menghapus input form yang ada.

**Non‑Goals**:
- Auth/multi‑user/login.
- Database server‑side atau sync multi‑device.
- Manajemen proyek/slide versi baru.
- Model lokal/offline.

## 3. AI System Requirements

**Tool Requirements**:
- External LLM API (OpenAI/Claude).
- OCR untuk gambar screenshot (opsional, fallback bila gagal).
- Parser MD/PDF untuk ekstraksi teks.

**Evaluation Strategy**:
- Dataset: 10 dokumen campuran (brief/MD/PDF) + 5 screenshot.
- Metric utama: % field terisi otomatis (target ≥90%).
- Metric tambahan: jumlah edit manual per field.
- Laporan ringkas per request: coverage & field kosong.

## 4. Technical Specifications

**Architecture Overview**:
- **Input Collection**: brief teks + file upload (screenshot + MD/PDF).
- **Pre‑processing**:
  - Extract text dari MD/PDF.
  - OCR screenshot untuk mengambil kata kunci/label UI (best effort).
  - Normalize dan ringkas struktur (judul, fitur, CTA, quote).
- **AI Extraction**:
  - Prompt menghasilkan JSON terstruktur sesuai schema field slide 1–5.
  - Jika JSON invalid → retry 1x untuk perbaikan.
- **Post‑processing**:
  - Validasi field wajib, trimming, format standard.
  - Field kosong diisi placeholder default.
- **Apply**:
  - Mapping JSON → state form generator (semua slide sekaligus).

**Integration Points**:
- Frontend generator page (public/index.html + public/js/generator.js).
- Backend Express (server.js) untuk proxy API dan handling file upload.

**Security & Privacy**:
- File upload diproses sementara, tidak disimpan permanen.
- Informasikan bahwa data dikirim ke API eksternal.

## 5. Risks & Roadmap

**Phased Rollout**:
- **MVP**: Brief + MD/PDF → autofill all slides (tanpa OCR screenshot).
- **v1.1**: Tambah OCR screenshot + confidence flags.
- **v2.0**: Evaluasi quality improvements (validator, prompt tuning, dataset lebih besar).

**Technical Risks**:
- Output AI tidak konsisten antar request → mitigasi dengan schema + retry.
- Latency API >30 detik → mitigasi dengan progress state dan batas ukuran input.
- OCR noise menambah error → fallback tanpa OCR.
