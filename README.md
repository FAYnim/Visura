![Visura Logo](public/img/logo/android-chrome-192x192.png)

# Visura

Premium prompt generator untuk membuat carousel portofolio Instagram 5-slide dengan gaya cinematic UI. Visura menyediakan form terstruktur, preview real-time, riwayat prompt, dan pengaturan creator—semua berjalan langsung di browser.

## Fitur Utama

- **Generator 5 slide** dengan template prompt berbeda untuk cover, overview, feature grid, showcase, dan outro.
- **AI Auto-Fill** — isi semua field otomatis dari brief teks + file Markdown/PDF menggunakan LLM (OpenAI / Claude).
- **Live preview** dengan highlight placeholder vs input yang sudah terisi.
- **Copy sekali klik** ke clipboard dengan toast feedback.
- **Riwayat prompt** tersimpan lokal + pencarian cepat.
- **Pengaturan global** (creator name/role) yang tersinkron di semua slide.
- **UI modern dark mode** dengan style premium SaaS.

## Tampilan Aplikasi

- **Prompt Generator:** `http://localhost:3000/`
- **History:** `http://localhost:3000/riwayat`
- **Settings:** `http://localhost:3000/settings`

> [!NOTE]
> Aplikasi ini tidak mengunggah screenshot; prompt yang dihasilkan mengasumsikan Anda menambahkan screenshot saat menggunakan tool AI image generator favorit Anda.

## Tech Stack

- HTML, CSS, JavaScript (ES Modules)
- Node.js + Express sebagai HTTP server
- LocalStorage untuk menyimpan settings & history
- Font Awesome + Google Fonts

## Menjalankan Secara Lokal

Pastikan Node.js >= 18.x sudah terinstal, lalu:

```bash
npm install
```

### Setup AI Auto-Fill (Opsional)

Fitur AI Auto-Fill membutuhkan API key dari OpenAI atau Anthropic. Buat file `.env` di root project:

```bash
# Pilih salah satu (OpenAI diprioritaskan jika keduanya ada)
OPENAI_API_KEY=sk-...
# atau
ANTHROPIC_API_KEY=sk-ant-...
```

> [!IMPORTANT]
> Tanpa API key, tombol **AI Auto-Fill** akan menampilkan pesan error. Generator tetap berfungsi normal tanpa API key.

Lalu jalankan:

```bash
npm run dev
```

Lalu buka `http://localhost:3000`.

## Cara Pakai

1. Buka **Prompt Generator**.
2. *(Opsional)* Klik **AI Auto-Fill** dan:
   - Isi brief proyek di textarea, dan/atau
   - Upload file Markdown/PDF dokumentasi proyek (≤ 10 MB)
   - Klik **Extract with AI** — tunggu 10–30 detik
   - Review ringkasan coverage, lalu klik **Apply to All Slides**
3. Isi atau edit form sesuai slide yang aktif.
4. Lihat hasil prompt di panel **Preview**.
5. Klik **Salin** untuk menyalin prompt.
6. Cek **History** untuk melihat prompt yang pernah disalin.
7. Atur nama dan peran Anda di **Settings**.

> [!TIP]
> Gunakan **History** sebagai bank prompt untuk berbagai versi carousel proyek Anda.

## Struktur Proyek

```text
.
├── .env                      # API keys (tidak di-commit)
├── package.json              # Node.js manifest & scripts
├── server.js                 # Express entry point
├── server/
│   ├── routes/
│   │   └── autoFill.js       # POST /api/auto-fill route
│   └── ai/
│       ├── autoFillService.js # LLM call + JSON retry
│       ├── promptBuilder.js   # Prompt & schema builder
│       └── textExtractors.js  # MD/PDF text extraction
├── tests/
│   └── autoFillSchema.test.js # Schema validation tests
├── public/
│   ├── index.html            # Generator
│   ├── riwayat.html          # History
│   ├── settings.html         # Settings
│   ├── css/
│   │   └── styles.css        # UI & design system
│   ├── js/
│   │   ├── common.js         # Utilities & localStorage
│   │   ├── generator.js      # Logic generator + AI Auto-Fill
│   │   ├── riwayat.js        # Logic history
│   │   └── settings.js       # Logic settings
│   └── img/
│       ├── avatar.png        # Logo/avatar default
│       └── logo/             # Paket logo (favicon, webmanifest, dll)
└── docs/                     # Spesifikasi & plans internal
```

## Kustomisasi

- **Template prompt:** edit di `public/js/generator.js` pada objek `TEMPLATES`.
- **Tema & UI:** sesuaikan di `public/css/styles.css`.
- **Default creator:** update di `SETTINGS_DEFAULTS` pada `generator.js`, `riwayat.js`, dan `settings.js`.

> [!IMPORTANT]
> Data history dan settings disimpan di LocalStorage browser. Menghapus cache browser akan menghapus data tersebut.

