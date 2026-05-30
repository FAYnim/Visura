![Visura Logo](public/img/logo/android-chrome-192x192.png)

# Visura

Premium prompt generator untuk membuat carousel portofolio Instagram 5-slide dengan gaya cinematic UI. Visura menyediakan form terstruktur, preview real-time, riwayat prompt, dan pengaturan creator—semua berjalan langsung di browser.

## Fitur Utama

- **Generator 5 slide** dengan template prompt berbeda untuk cover, overview, feature grid, showcase, dan outro.
- **AI Auto-Fill** — isi semua field otomatis dari brief teks + file Markdown/PDF menggunakan LLM (Google Gemini).
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

Fitur AI Auto-Fill mendukung dua provider LLM dengan mekanisme **fallback otomatis**. Buat file `.env` di root project dan isi salah satu atau keduanya:

```bash
GEMINI_API_KEY=AIza...   # Google Gemini (provider utama)
GROQ_API_KEY=gsk_...     # Groq (provider fallback)
```

**Urutan fallback:**
1. **Gemini** digunakan pertama jika `GEMINI_API_KEY` tersedia.
2. **Groq** digunakan sebagai fallback jika Gemini gagal, atau jika hanya `GROQ_API_KEY` yang tersedia.
3. Setiap provider mendapat satu kali **retry** dengan repair prompt sebelum beralih ke provider berikutnya.

> [!IMPORTANT]
> Tanpa API key apa pun, tombol **AI Auto-Fill** akan menampilkan pesan error. Generator tetap berfungsi normal tanpa API key.

Lalu jalankan server development:

```bash
npm run dev
```

> [!NOTE]
> Perintah `npm run dev` menjalankan server menggunakan `nodemon` untuk mendeteksi perubahan file backend secara dinamis dan melakukan restart server secara otomatis.

Lalu buka `http://localhost:3000` di browser Anda.

### Menjalankan Pengujian (Testing)

Aplikasi ini dilengkapi dengan suite pengujian skema untuk memverifikasi validitas data output yang dikirimkan oleh AI Auto-Fill. Anda dapat menjalankan pengujian tersebut dengan perintah:

```bash
npm test
```


## Cara Pakai

1. Buka **Prompt Generator**.
2. *(Opsional)* Klik **AI Auto-Fill** dan:
   - Isi brief proyek di textarea, dan/atau
   - Upload file Markdown/PDF dokumentasi proyek (≤ 10 MB)
   - Klik **Extract with AI** — tunggu 10–30 detik
   - Review ringkasan coverage, lalu klik **Apply to All Slides**
3. Isi atau edit form sesuai slide yang aktif.
4. Lihat hasil prompt di panel **Preview**.
5. Klik **Copy** untuk menyalin prompt.
6. Cek **History** untuk melihat prompt yang pernah disalin.
7. Atur nama dan peran Anda di **Settings**.

> [!TIP]
> Gunakan **History** sebagai bank prompt untuk berbagai versi carousel proyek Anda.

## Struktur Proyek

```text
.
├── .env                      # API keys (tidak di-commit)
├── package.json              # Node.js manifest, scripts, & dev dependencies (nodemon, dll)
├── PRD.md                    # Spesifikasi PRD lengkap untuk AI Auto-Fill
├── server.js                 # Express entry point (menginisialisasi HTTP server)
├── server/
│   ├── routes/
│   │   └── autoFill.js       # Express route handler untuk POST /api/auto-fill
│   └── ai/
│       ├── autoFillService.js # Integrasi Google Gemini + fallback Groq
│       ├── promptBuilder.js   # Pembuat system/user prompt & skema parsing data
│       ├── schema.js          # JSON schema output AI Auto-Fill
│       └── textExtractors.js  # Utilitas ekstraksi teks untuk file Markdown & PDF
├── tests/
│   ├── autoFillSchema.test.js  # Uji skema validasi minimal (dijalankan via `npm test`)
│   └── autoFillFallback.test.js # Uji fallback Gemini -> Groq
└── public/
    ├── index.html            # UI Utama Generator (landing page slide-based)
    ├── prompts.html          # Manajemen prompt batch & template
    ├── riwayat.html          # Riwayat Prompt yang disalin
    ├── settings.html         # Pengaturan global Creator (Name & Role)
    ├── css/
    │   └── styles.css        # UI & sistem desain cinematic dark theme
    ├── js/
    │   ├── autoFill.js           # Client-side AI Auto-Fill flow
    │   ├── common.js             # State, localStorage, & utilitas UI bersama
    │   ├── generator.js          # Entry point generator (wiring modul)
    │   ├── generatorBindings.js  # Event binding form & tab
    │   ├── generatorClipboard.js # Copy/reset prompt + toast
    │   ├── generatorHistory.js   # Sinkronisasi riwayat prompt
    │   ├── generatorRender.js    # Render preview & counter
    │   ├── generatorState.js     # State runtime & defaults
    │   ├── generatorTemplates.js # Kompilasi template prompt
    │   ├── promptStore.js        # Default templates + validasi placeholder
    │   ├── prompts.js            # UI prompt batch manager
    │   ├── settingsDefaults.js   # Default creator shared
    │   ├── riwayat.js            # Logika manajemen & pencarian riwayat
    │   └── settings.js           # Logika form manajemen profile Creator
    └── img/
        ├── avatar.png        # Avatar default Creator
        └── logo/             # Paket ikon & favicon aplikasi
```

## Kustomisasi

- **Template prompt default:** edit di `public/js/promptStore.js` pada `DEFAULT_PROMPTS`.
- **Kompilasi template prompt:** lihat `public/js/generatorTemplates.js` jika ingin mengubah perilaku placeholder.
- **Tema & UI:** sesuaikan di `public/css/styles.css`.
- **Default creator:** update di `public/js/settingsDefaults.js`.

> [!IMPORTANT]
> Data history dan settings disimpan di LocalStorage browser. Menghapus cache browser akan menghapus data tersebut.

