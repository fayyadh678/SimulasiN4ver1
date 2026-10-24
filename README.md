# Simulasi JLPT N4 — Version 2 (Set 2)

Website latihan statis berisi **70 soal orisinal** bergaya JLPT N4: 20 kosakata, 15 tata bahasa, 15
bacaan (5 teks × 3 soal), 5 cerita bergambar 4 panel, 5 soal cocokkan gambar, dan 10 soal
mendengarkan dengan audio bahasa Jepang. Antarmuka berbahasa Indonesia, isi soal berbahasa Jepang.

> **Simulasi tidak resmi.** Situs ini terinspirasi format JLPT N4, bukan ujian resmi. Hasil dihitung
> dari jumlah jawaban benar (bukan *scaled score* JLPT) dan tidak menyatakan lulus/gagal.

## Status

| Item | Status |
| --- | --- |
| Source code lengkap + build | ✅ `dist/` dihasilkan oleh `npm run build` |
| 70 soal, 5 bacaan, 25 SVG, 10 MP3 | ✅ tervalidasi otomatis |
| Tests (28) | ✅ lulus |
| Deploy GitHub Pages | ⏳ belum live — lihat [Deployment](#deployment) |
| Deploy Vercel | ⏳ belum dikonfigurasi (opsi kedua) |

Repo target: <https://github.com/fayyadh678/SimulasiN4ver1> · URL publik target:
<https://fayyadh678.github.io/SimulasiN4ver1/>.

URL tersebut adalah **target**, bukan klaim sudah live. Jalankan langkah deployment di bawah lalu
verifikasi sendiri.

## Menjalankan lokal

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # vitest (28 test)
npm run build      # tsc --noEmit && vite build
npm run preview    # pratinjau hasil build
npm run validate:assets
```

Membutuhkan Node.js 20+ (CI memakai Node 22).

## Struktur

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages via Actions
├── public/
│   ├── audio/q61.mp3 … q70.mp3    # 10 audio ja-JP
│   └── images/
│       ├── stories/s1.svg … s5.svg
│       └── matching/m1-a.svg … m5-d.svg
├── scripts/
│   ├── generate-audio.mjs         # regenerasi MP3 dari listeningScripts.json
│   ├── generate-images.mjs        # regenerasi 25 SVG
│   └── validate-assets.mjs        # cek jumlah + keberadaan aset
├── src/
│   ├── data/                      # questions, passages, storyScenes,
│   │                              # matchingScenes, listeningScripts (JSON)
│   ├── components/                # ExamHeader, ChoiceCard, ImageChoiceCard,
│   │                              # AudioPlayer, QuestionNavigator, ConfirmDialog
│   ├── pages/                     # Landing, Exam, Results, Review
│   ├── lib/                       # data, assets, score, persistence, timer
│   ├── styles/global.css
│   ├── App.tsx
│   └── main.tsx
└── vite.config.ts
```

Tidak ada backend maupun database; seluruh state ujian disimpan di `localStorage` dengan key
`jlpt_n4_simulation_v2_session` dan `schemaVersion: 2` (terpisah dari V1).

## Perilaku penting

- **Timer absolut**: `deadlineAt = startedAt + 115 menit`. Refresh, ganti tab, atau buka lagi tidak
  mengulang waktu; sesi yang kedaluwarsa otomatis diselesaikan dan dibuka di halaman hasil.
- **Audio listening**: maksimal 2 pemutaran per soal, dihitung saat audio benar-benar mulai berbunyi
  (bukan saat tombol ditekan). Transkrip hanya muncul di halaman review. Jika audio gagal dimuat,
  tersedia tombol muat ulang dan peringatan sebelum menyelesaikan ujian.
- **Review**: filter Semua / Salah / Belum dijawab / Benar, kunci jawaban, pembahasan, transkrip, dan
  gambar pendukung. Kunci/pembahasan tidak dirender di halaman ujian.
- **Persistensi**: JSON rusak, schema lama, dan nilai di luar rentang dibuang saat load; progres tidak
  bisa hilang karena parse error.
- **Responsif & aksesibel**: layout 360px satu kolom, grid nomor soal di panel "Daftar soal" pada
  mobile, `lang="ja"` untuk konten Jepang, fokus terlihat, `aria-live` untuk status, dan
  `prefers-reduced-motion`.

## Data & aset

- 70 soal ada di `src/data/questions.json`; kunci memakai `'A' | 'B' | 'C' | 'D'`, bukan indeks array.
- 5 bacaan di `passages.json` (Q36–38 P1, Q39–41 P2, …, Q48–50 P5).
- 5 cerita 4 panel di `storyScenes.json` → `public/images/stories/*.svg`.
- 5 set gambar (4 opsi per set) di `matchingScenes.json` → `public/images/matching/*.svg`.
- 10 naskah audio di `listeningScripts.json` → `public/audio/q61.mp3` … `q70.mp3`.

### Menambah soal

1. Tambahkan objek soal ke `src/data/questions.json` dengan `id` unik, 4 opsi A–D, `answer`, dan
   `explanation` (pembahasan hanya tampil di review).
2. Sesuaikan `CATEGORY_COUNTS`, `TOTAL_QUESTIONS` (otomatis dari data), serta teks "70 soal" di UI
   bila jumlah total berubah.
3. Jalankan `npm test`; test akan gagal bila referensi `passageId`/`sceneId`/`matchingId`/`audioId`
   tidak valid, opsi duplikat, atau aset hilang.

### Regenerasi aset

```bash
node scripts/generate-images.mjs   # 25 SVG vektor
node scripts/generate-audio.mjs    # 10 MP3 via Edge TTS (butuh internet)
node scripts/validate-assets.mjs   # verifikasi hasil
```

Audio dibuat dengan Edge TTS (`ja-JP-NanamiNeural`, `ja-JP-KeitaNeural`) dari naskah V2, laju −10%,
jeda ±700 ms antar penutur, tanpa label pembicara. Hasilnya di-commit sebagai file statis sehingga
tidak butuh API key saat runtime.

## Deployment

### GitHub Pages (wajib)

1. Push repo ke `main` (branch default harus `main`).
2. Buka **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` menjalankan `npm ci`, `npm test -- --run`,
   `GITHUB_PAGES=true npm run build`, lalu mengunggah `dist`.
4. Setelah job hijau, situs tersedia di `https://fayyadh678.github.io/SimulasiN4ver1/`.

`vite.config.ts` memakai `base: '/SimulasiN4ver1/'` hanya ketika `GITHUB_PAGES=true`; semua aset
diselesaikan lewat `import.meta.env.BASE_URL` sehingga audio/gambar tidak 404 di project page.

### Vercel (opsi kedua, repo yang sama)

1. **Add New → Project → Import** repo `fayyadh678/SimulasiN4ver1`.
2. Framework preset **Vite**, root `./`, build `npm run build`, output `dist`, install `npm ci`.
3. **Jangan** set `GITHUB_PAGES=true`, agar `base` tetap `/`.
4. Deploy dan catat URL `*.vercel.app` yang benar-benar terbit.

Karena app adalah satu halaman dengan state (tanpa router URL), tidak perlu rewrite khusus.

## Troubleshooting Pages

| Gejala | Penyebab umum |
| --- | --- |
| Halaman kosong / JS 404 | build tidak memakai `GITHUB_PAGES=true`, atau Pages source belum "GitHub Actions" |
| Audio/SVG 404 | path absolut `/audio/...`; gunakan helper `assetUrl()` yang membaca `BASE_URL` |
| 404 setelah refresh | tidak terjadi di app ini karena tidak memakai path router |
| `npm ci` gagal di CI | `package-lock.json` tidak ter-commit atau versi Node berbeda |

## Batasan yang perlu diketahui

- Karena situs statis, data yang dibundel (termasuk kunci jawaban) secara teknis dapat ditemukan lewat
  developer tools. Ini latihan mandiri, bukan ujian berproktor.
- Audio adalah TTS, bukan rekaman manusia; kualitas pelafalan mengikuti mesin TTS.
- Hasil bukan penilaian resmi JLPT.