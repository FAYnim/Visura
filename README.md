![PromptFlex Logo](avatar.png)

# PromptFlex

Premium prompt generator untuk membuat carousel portofolio Instagram 5-slide dengan gaya cinematic UI. PromptFlex menyediakan form terstruktur, preview real-time, riwayat prompt, dan pengaturan creator—semua berjalan langsung di browser.

## Fitur Utama

- **Generator 5 slide** dengan template prompt berbeda untuk cover, overview, feature grid, showcase, dan outro.
- **Live preview** dengan highlight placeholder vs input yang sudah terisi.
- **Copy sekali klik** ke clipboard dengan toast feedback.
- **Riwayat prompt** tersimpan lokal + pencarian cepat.
- **Pengaturan global** (creator name/role) yang tersinkron di semua slide.
- **UI modern dark mode** dengan style premium SaaS.

## Tampilan Aplikasi

- **Prompt Generator:** `index.html`
- **History:** `riwayat.html`
- **Settings:** `settings.html`

> [!NOTE]
> Aplikasi ini tidak mengunggah screenshot; prompt yang dihasilkan mengasumsikan Anda menambahkan screenshot saat menggunakan tool AI image generator favorit Anda.

## Tech Stack

- HTML, CSS, JavaScript (ES Modules)
- LocalStorage untuk menyimpan settings & history
- Font Awesome + Google Fonts

## Menjalankan Secara Lokal

Karena ini aplikasi statis, Anda bisa menjalankannya dengan cara sederhana:

```bash
# opsi 1: buka langsung
start index.html

# opsi 2: jalankan server statis (contoh menggunakan python)
python -m http.server 8080
```

Lalu buka `http://localhost:8080/index.html`.

## Cara Pakai

1. Buka **Prompt Generator**.
2. Isi form sesuai slide yang aktif.
3. Lihat hasil prompt di panel **Preview**.
4. Klik **Salin** untuk menyalin prompt.
5. Cek **History** untuk melihat prompt yang pernah disalin.
6. Atur nama dan peran Anda di **Settings**.

> [!TIP]
> Gunakan **History** sebagai bank prompt untuk berbagai versi carousel proyek Anda.

## Struktur Proyek

```text
.
├── index.html            # Generator
├── riwayat.html          # History
├── settings.html         # Settings
├── generator.js          # Logic generator & template prompt
├── riwayat.js            # Logic history
├── settings.js           # Logic settings
├── common.js             # Utilities & localStorage
├── styles.css            # UI & design system
├── avatar.png            # Logo/avatar default
└── docs/                 # Spesifikasi internal
```

## Kustomisasi

- **Template prompt:** edit di `generator.js` pada objek `TEMPLATES`.
- **Tema & UI:** sesuaikan di `styles.css`.
- **Default creator:** update di `SETTINGS_DEFAULTS` pada `generator.js`, `riwayat.js`, dan `settings.js`.

> [!IMPORTANT]
> Data history dan settings disimpan di LocalStorage browser. Menghapus cache browser akan menghapus data tersebut.
