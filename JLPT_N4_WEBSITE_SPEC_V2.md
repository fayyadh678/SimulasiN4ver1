# MASTER SPEC VERSION 2 — Website Simulasi JLPT N4 (70 Soal Baru)

> **Status:** Instruksi final yang telah disetujui pengguna. Untuk agent coding: **IMPLEMENTASIKAN WEBSITE**, bukan hanya memberikan saran atau wireframe. Dokumen ini juga berisi **bank soal VERSION 2 orisinal lengkap 70 butir (berbeda dari Version 1)**, jawaban benar, pembahasan, lima teks bacaan, spesifikasi 25 aset gambar (5 cerita + 20 gambar opsi), dan **10 naskah listening** untuk dijadikan audio nyata. Semua yang tertulis di bawah adalah acceptance criteria kecuali secara eksplisit disebut opsional.

## 0. Tujuan dan batasan

> **VERSION 2 / SET 2** — Konten soal V2 sepenuhnya berbeda dari soal set pertama pada dokumen `JLPT_N4_WEBSITE_SPEC.md`: 20 kosakata, 15 grammar, 5 teks cerita untuk 15 reading, 5 cerita visual baru, 5 rangkaian pilihan gambar baru, dan 10 skrip audio baru. Jangan menyalin soal V1 ke V2, dan jangan menyimpan jawaban/progres V1 sebagai progres V2. Nama repository memang mengandung `ver1`, tetapi **repository resmi yang dipilih pemilik untuk proyek versi ini tetap `SimulasiN4ver1`**, jangan menggantinya dengan nama lain.

**PERINTAH UTAMA UNTUK CODING AGENT:** Implementasikan website berjalan dengan seluruh 70 soal yang tertulis di bagian 6; hasil akhirnya **harus bisa diakses publik** lewat GitHub Pages, dengan Vercel sebagai opsi kedua. Jangan berhenti pada pembuatan kode, wireframe, atau server localhost saja. Jika tidak punya izin GitHub, jelaskan dengan jujur blocker deployment dan berikan tindakan yang perlu dilakukan pemilik.


- Nama produk: **N4 Japanese Practice — Version 2** / **Simulasi JLPT N4 — Set 2**.
- Bahasa antarmuka: **Bahasa Indonesia**; teks soal dan pilihan: **Bahasa Jepang** (pertahankan kanji/hiragana sebagaimana tertulis).
- Membangun **website publik dapat dibuka dari HP/laptop**, bukan aplikasi yang hanya berjalan di `localhost`.
- Repository **wajib**: <https://github.com/fayyadh678/SimulasiN4ver1.git>. Pada tanggal penyusunan dokumen (23 Oktober 2026) repository publik terlihat masih kosong; cek ulang sebelum memulai, jangan overwrite jika sudah berisi pekerjaan baru.
- Hosting: **GitHub Pages WAJIB**, **Vercel didukung sebagai pilihan kedua** dari repo yang sama. Target GitHub Pages setelah berhasil publish: `https://fayyadh678.github.io/SimulasiN4ver1/`. URL tersebut adalah **target, bukan klaim sudah live**. URL Vercel mengikuti proyek yang dibuat saat impor (`*.vercel.app`), jangan mengarang alamat final.
- Framework acuan: **React + Vite + TypeScript**, CSS biasa/CSS Modules atau Tailwind (bebas, asal rapi dan tidak kompleks). Aplikasi bersifat **static SPA tanpa database dan tanpa backend berbayar**.
- Semua 70 soal dan aset harus tersedia saat deploy, tidak boleh hanya mockup 5 soal.
- Jawaban benar, kunci jawaban, pembahasan dan transkrip listening **tidak ditampilkan di UI sebelum ujian diselesaikan**. Perlu jujur: karena website statis, data yang dibundel di klien bisa ditemukan lewat developer tools; ini latihan, bukan ujian terproktor berkeamanan tinggi.
- Seluruh pertanyaan, percakapan, dan arahan ilustrasi dalam dokumen ini dibuat untuk latihan orisinal dan **tidak boleh diganti dengan salinan bank soal resmi berhak cipta**.

## 1. Riset & kesesuaian N4

Rujukan resmi (cek sebelum memperbarui kebijakan/format):

1. Struktur tes JLPT: <https://www.jlpt.jp/e/guideline/testsections.html> — untuk **N4: 25 menit kosakata, 55 menit grammar+reading, 35 menit listening** (total **115 menit** waktu pengerjaan; praktik ini tidak meniru jumlah soal per seksi secara 1:1).
2. Contoh format resmi, workbook dan bahan listening: <https://www.jlpt.jp/e/samples/sampleindex.html> — N4 meliputi kanji, orthography, grammar, reading, serta task-based listening / point comprehension / utterance expressions / quick response.
3. Info penerbitan Github Pages: <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>.
4. Instruksi deployment Vite official: <https://vite.dev/guide/static-deploy.html>.

**PENTING:** Ini **simulasi tidak resmi** yang terinspirasi kemampuan dan format JLPT N4. Materi cerita bergambar dan pilih gambar merupakan adaptasi untuk latihan yang lebih menarik; soal gambar resmi lebih lazim pada jenis-jenis listening. Ujian JLPT resmi memakai sistem *scaled score*, **bukan sekadar jumlah benar/70**, jadi jangan tulis "Lulus JLPT asli" hanya dari hasil latihan.

## 2. Pembagian tepat 70 soal

| Nomor | Kategori dan slug | Jumlah | Jenis |
|---:|---|---:|---|
| 01–20 | `vocabulary` — Kosakata & kanji | 20 | bacaan kanji, penulisan kanji, pemilihan kata, sinonim, pemakaian |
| 21–35 | `grammar` — Tata bahasa & susunan kalimat | 15 | partikel, pola N4, bentuk kata, pemilihan kalimat benar |
| 36–50 | `reading` — Cerita/bacaan | 15 | 5 bacaan × 3 pertanyaan |
| 51–55 | `story_image` — Cerita bergambar | 5 | 4 panel berurutan per soal, A-D teks Jepang |
| 56–60 | `match_image` — Cocokkan gambar | 5 | 1 deskripsi bahasa Jepang, 4 gambar A-D |
| 61–70 | `listening` — Mendengarkan | 10 | dialog/monolog audio dalam bahasa Jepang, A-D |
| | **TOTAL** | **70** | **Seluruh soal pilihan A/B/C/D, tepat 1 jawaban** |

Gunakan urutan kategori di atas untuk mode simulasi utama; jangan acak urutan category/passages. Acak pilihan/kategori boleh menjadi fitur **mode latihan terpisah** pada masa depan, bukan prioritas sekarang.

## 3. Halaman dan perilaku produk

### 3.1 Beranda
- Judul besar "Simulasi JLPT N4 — Version 2", deskripsi satu kalimat dan label "70 Soal • 115 Menit • 4 Pilihan".
- Preview komposisi seksi, keterangan "Simulasi tidak resmi", tombol besar **Mulai Simulasi**.
- Bila ada progres tersimpan: tombol **Lanjutkan ujian** dan **Mulai dari awal** dengan konfirmasi (hindari menghapus hasil tanpa persetujuan).
- Tampilkan instruksi listening singkat: dengarkan audio, tidak ada transkrip sebelum submit, dapat ulang audio maksimal **2 kali per soal** (jumlah play tersimpan juga) agar terasa simulasi; opsi "Mode latihan bebas" dengan pengulangan tanpa batas adalah tambahan nanti, jangan implemen setengah matang.

### 3.2 Halaman ujian
- Desktop: topbar logo, progress `{nomor}/70`, countdown **115:00** (format `MM:SS` atau `HH:MM:SS`), mini-navigasi nomor soal di samping jika ruang memungkinkan.
- Mobile: satu kolom, ukuran huruf Jepang >= 18px dan tombol/opsi mudah disentuh; header compact dan grid nomor soal dapat dibuka lewat tombol "Daftar soal".
- Pada awal kategori tampil badge teks netral (Kosakata, Grammar, Reading, Gambar, Listening), **bukan** status colorful. Progress bar halus.
- Satu soal aktif pada satu waktu. Empat pilihan **A, B, C, D**. Pilihan radio/card dengan focus state jelas; untuk `match_image` tampilkan **empat gambar yang bisa diklik** dan label A-D; untuk `story_image` tampilkan **satu ilustrasi berurutan 4 panel** lalu opsi A-D.
- Untuk `reading`, tampilkan passage terkait di atas pertanyaan. Saat 3 pertanyaan berurutan, passage sama tetap terlihat agar tidak harus kembali ke pertanyaan awal.
- Untuk `listening`, tampilkan pemutar audio dari file lokal repo dengan play/pause, total pemutaran tersisa, indikator loading/error; tampilkan prompt & opsi tetapi **jangan transkrip**. Pada error audio berikan pesan jelas; cegah submit secara tidak adil jika audio tidak dapat dimainkan (opsi coba lagi); jangan diam-diam menilai pertanyaan tak-terdengar.
- Tombol **Sebelumnya**, **Berikutnya**, **Daftar soal**, **Selesaikan**. Tombol Selesaikan memunculkan dialog: "Masih ada X soal belum dijawab" dan tombol Kembali / Tetap selesaikan.
- Jawaban dapat diganti sampai submit; navigasi bebas; tampilan nomor dijawab/tidak dijawab, tanpa menunjukkan benar/salah sebelum finish.
- Gunakan countdown berbasis **waktu absolut** (`deadlineAt = Date.now() + 115*60*1000`) untuk menghindari timer reset saat refresh/beralih tab. Auto-submit jika waktu habis; setelah reload pastikan waktu habis diproses.
- Gunakan key localStorage khusus V2, misalnya `jlpt_n4_simulation_v2_session`, agar state dari Version 1 tidak terbaca/tertukar. Gunakan `localStorage` bertipe jelas untuk `status` (`in_progress`/`completed`), `answers`, `startedAt`, `deadlineAt`, `audioPlayCount`, `completedAt`, dan `schemaVersion`. Simpan setiap perubahan; validasi saat load untuk menangani JSON rusak; jangan mengumpulkan data pribadi.

### 3.3 Hasil & pembahasan
- Setelah submit/habis waktu: **jumlah benar dari 70**, **persentase** (1 desimal), jumlah salah, jumlah kosong, durasi, serta ringkasan benar per kategori (contoh Kosakata 16/20). Hasil latihan bukan nilai scaled-score resmi.
- Tampilan kunci jawaban **hanya muncul di halaman review setelah completion**: nomor, kategori, jawaban pengguna, opsi benar, label benar/salah/tidak diisi, pembahasan bahasa Indonesia, bacaan/gambar terkait, audio + **transkrip Jepang listening** setelah selesai.
- Tombol filter review "Semua / Salah / Belum dijawab / Benar", navigasi kembali ke hasil, tombol "Ulangi latihan" dengan konfirmasi reset state.
- Aturan skor: jawaban benar +1, salah atau tidak dijawab +0; `% = benar / 70 × 100`. Jangan menyebut lulus/gagal JLPT secara resmi. Gunakan hasil sebagai diagnostik latihan.
- Untuk accessibility: `lang="ja"` pada konten Jepang, keyboard navigation, semantik `<button>` untuk kartu pilihan, indikator fokus jelas, kontras yang layak, `aria-live` untuk status penting, alt teks ilustrasi netral yang tidak membocorkan jawaban di mode ujian.

## 4. Style UI — simple & clean

- Referensi gaya: UI edtech minimalis, **putih** / off-white `#F8FAFC`, permukaan `#FFFFFF`, teks `#0F172A`, teks sekunder `#64748B`, border `#E2E8F0`, satu aksen **biru lembut** `#2563EB`, status benar `#15803D` dan salah `#B91C1C` **hanya di halaman review**.
- Radius kartu 12–16px; lebar konten utama maksimal 860–960px; padding mobile 16px, desktop 24px; shadows tipis saja; banyak white space; bukan dashboard ramai.
- Font UI: Inter/system; teks Jepang: `"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`; pastikan fallback ketika Google Fonts terblokir.
- Visual cerita/gambar: SVG vektor yang konsisten, mudah dikenali, warna sederhana. **Jangan mengganti soal gambar dengan emoji, gambar stok, broken URL, atau placeholder "gambar menyusul".**
- Animasi boleh halus dan menghormati `prefers-reduced-motion`; tidak perlu hero gambar/gradient dekoratif berlebihan.
- Responsive 360px, 768px dan desktop >=1280px; pilihan gambar menggunakan 2 kolom pada HP dan 2–4 kolom pada desktop sesuai ketersediaan ruang.

## 5. Arsitektur dan file yang harus dibuat agent

```text
SimulasiN4ver1/
├── .github/workflows/deploy.yml   # GitHub Pages otomatis
├── public/
│   ├── audio/q61.mp3 ... q70.mp3  # 10 file audio asli, playable
│   └── images/
│       ├── stories/s1.svg ... s5.svg
│       └── matching/m1-a.svg ... m5-d.svg
├── src/
│   ├── data/questions.json        # salin dataset soal di bawah
│   ├── data/passages.json         # salin passage di bawah
│   ├── data/storyScenes.json      # salin scene specs, produksi SVG
│   ├── data/matchingScenes.json   # salin matching specs, produksi SVG
│   ├── data/listeningScripts.json # salin scripts, dipakai review/produksi MP3
│   ├── components/               # ExamHeader, ChoiceCard, ImageChoiceCard, AudioPlayer, ReviewCard
│   ├── pages/                    # Landing, Exam, Results, Review (atau single component states)
│   ├── lib/                      # score, persistence, timer, asset path helpers
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── package.json
├── package-lock.json
└── README.md
```

Tipe data yang direkomendasikan:

```ts
type Choice = 'A' | 'B' | 'C' | 'D';
type QuestionType = 'vocabulary' | 'grammar' | 'reading' | 'story_image' | 'match_image' | 'listening';
type Question = {
  id: number;
  type: QuestionType;
  prompt: string;
  options: Record<Choice, string>;
  answer: Choice;
  explanation: string; // review-only
  passageId?: string;
  sceneId?: string;
  matchingId?: string;
  audioId?: string;
};
```

**Jangan pernah gunakan numeric array index untuk mengidentifikasi jawaban**: kunci harus berupa `'A'|'B'|'C'|'D'`. Konten JSON di bawah sudah siap ditempel persis seperti adanya. Jangan menulis ulang kunci dengan perkiraan.

## 6. Bank soal orisinal 70 butir (sumber utama implementasi)

Instruksi agent: copy JSON **Version 2** pada blok ini ke `src/data/questions.json`. Jangan mengambil contoh pertanyaan dari versi pertama. **Setiap object sudah punya tepat 4 opsi, jawaban benar, dan pembahasan.** Jangan terjemahkan isi `prompt`/`options` dalam mode ujian. Format JSON (bukan JavaScript literal).

```json
[
  {
    "id": 1,
    "type": "vocabulary",
    "prompt": "「会議」の読み方はどれですか。",
    "options": {
      "A": "かいき",
      "B": "かいぎ",
      "C": "かぎ",
      "D": "かいご"
    },
    "answer": "B",
    "explanation": "会議 dibaca かいぎ, artinya rapat."
  },
  {
    "id": 2,
    "type": "vocabulary",
    "prompt": "「野菜」の読み方はどれですか。",
    "options": {
      "A": "のさい",
      "B": "やざい",
      "C": "やさい",
      "D": "やせい"
    },
    "answer": "C",
    "explanation": "野菜 dibaca やさい dan berarti sayuran."
  },
  {
    "id": 3,
    "type": "vocabulary",
    "prompt": "「急ぐ」の読み方はどれですか。",
    "options": {
      "A": "いそぐ",
      "B": "きゅうぐ",
      "C": "いそく",
      "D": "はやぐ"
    },
    "answer": "A",
    "explanation": "急ぐ dibaca いそぐ, berarti bergegas."
  },
  {
    "id": 4,
    "type": "vocabulary",
    "prompt": "「質問」の読み方はどれですか。",
    "options": {
      "A": "しちもん",
      "B": "しつまん",
      "C": "しつぶん",
      "D": "しつもん"
    },
    "answer": "D",
    "explanation": "質問 dibaca しつもん, artinya pertanyaan."
  },
  {
    "id": 5,
    "type": "vocabulary",
    "prompt": "「住所」の読み方はどれですか。",
    "options": {
      "A": "じゅしょ",
      "B": "じゅうしょう",
      "C": "じゅうしょ",
      "D": "じゅしゅ"
    },
    "answer": "C",
    "explanation": "住所 dibaca じゅうしょ, artinya alamat."
  },
  {
    "id": 6,
    "type": "vocabulary",
    "prompt": "「特別」の読み方はどれですか。",
    "options": {
      "A": "とくべつ",
      "B": "とっぺつ",
      "C": "どくべつ",
      "D": "とくべち"
    },
    "answer": "A",
    "explanation": "特別 dibaca とくべつ, berarti khusus atau istimewa."
  },
  {
    "id": 7,
    "type": "vocabulary",
    "prompt": "「せつめい」の正しい漢字はどれですか。",
    "options": {
      "A": "説計",
      "B": "説明",
      "C": "説門",
      "D": "説名"
    },
    "answer": "B",
    "explanation": "せつめい ditulis 説明, artinya penjelasan."
  },
  {
    "id": 8,
    "type": "vocabulary",
    "prompt": "「しゅうまつ」の正しい漢字はどれですか。",
    "options": {
      "A": "週未",
      "B": "周末",
      "C": "週本",
      "D": "週末"
    },
    "answer": "D",
    "explanation": "しゅうまつ ditulis 週末 (akhir pekan); 末 berbeda dari 未."
  },
  {
    "id": 9,
    "type": "vocabulary",
    "prompt": "「きせつ」の正しい漢字はどれですか。",
    "options": {
      "A": "季節",
      "B": "気節",
      "C": "季説",
      "D": "期節"
    },
    "answer": "A",
    "explanation": "きせつ ditulis 季節, artinya musim."
  },
  {
    "id": 10,
    "type": "vocabulary",
    "prompt": "「ゆうびんきょく」の正しい漢字はどれですか。",
    "options": {
      "A": "郵便店",
      "B": "郵局便",
      "C": "郵便局",
      "D": "郵便所"
    },
    "answer": "C",
    "explanation": "ゆうびんきょく ditulis 郵便局, artinya kantor pos."
  },
  {
    "id": 11,
    "type": "vocabulary",
    "prompt": "このシャツは少し＿＿ので、もう一つ大きいサイズをください。",
    "options": {
      "A": "やすい",
      "B": "せまい",
      "C": "きびしい",
      "D": "ちいさい"
    },
    "answer": "D",
    "explanation": "Meminta ukuran lebih besar karena kemeja ini agak kecil (ちいさい)."
  },
  {
    "id": 12,
    "type": "vocabulary",
    "prompt": "今日は宿題を＿＿から、友だちと遊びます。",
    "options": {
      "A": "なくして",
      "B": "おわらせて",
      "C": "わすれて",
      "D": "まけて"
    },
    "answer": "B",
    "explanation": "おわらせて berarti menyelesaikan; setelah PR selesai, bermain dengan teman."
  },
  {
    "id": 13,
    "type": "vocabulary",
    "prompt": "父は朝六時に＿＿、犬と散歩に行きます。",
    "options": {
      "A": "おきて",
      "B": "あびて",
      "C": "こたえて",
      "D": "すてて"
    },
    "answer": "A",
    "explanation": "おきて berarti bangun tidur; kemudian pergi berjalan-jalan dengan anjing."
  },
  {
    "id": 14,
    "type": "vocabulary",
    "prompt": "この道をまっすぐ行って、二つ目の角を右に＿＿ください。",
    "options": {
      "A": "あけて",
      "B": "ふって",
      "C": "まがって",
      "D": "きって"
    },
    "answer": "C",
    "explanation": "右に曲がってください berarti silakan belok kanan."
  },
  {
    "id": 15,
    "type": "vocabulary",
    "prompt": "誕生日に友だちへプレゼントを＿＿。",
    "options": {
      "A": "かえしました",
      "B": "わたしました",
      "C": "ならびました",
      "D": "さわりました"
    },
    "answer": "B",
    "explanation": "わたしました berarti menyerahkan/memberikan langsung hadiah kepada teman."
  },
  {
    "id": 16,
    "type": "vocabulary",
    "prompt": "台風で電車が＿＿ので、バスで帰りました。",
    "options": {
      "A": "ぬれた",
      "B": "ならんだ",
      "C": "おくれた",
      "D": "かさなった"
    },
    "answer": "C",
    "explanation": "Karena topan, kereta terlambat (おくれた), sehingga pulang naik bus."
  },
  {
    "id": 17,
    "type": "vocabulary",
    "prompt": "「たいてい」にいちばん近い意味はどれですか。",
    "options": {
      "A": "ふつう",
      "B": "ぜったい",
      "C": "とつぜん",
      "D": "ときどき"
    },
    "answer": "A",
    "explanation": "たいてい berarti biasanya/pada umumnya; paling dekat dengan ふつう."
  },
  {
    "id": 18,
    "type": "vocabulary",
    "prompt": "「たくさん」にいちばん近い意味はどれですか。",
    "options": {
      "A": "すこし",
      "B": "ゆっくり",
      "C": "おおく",
      "D": "ぜんぜん"
    },
    "answer": "C",
    "explanation": "たくさん berarti banyak, dekat dengan 多く (おおく)."
  },
  {
    "id": 19,
    "type": "vocabulary",
    "prompt": "「やっと」にいちばん近い意味はどれですか。",
    "options": {
      "A": "もうすぐ",
      "B": "すぐ",
      "C": "まず",
      "D": "ついに"
    },
    "answer": "D",
    "explanation": "やっと dan ついに dapat berarti akhirnya setelah proses atau penantian."
  },
  {
    "id": 20,
    "type": "vocabulary",
    "prompt": "「受付」は何をするところですか。",
    "options": {
      "A": "申し込みをしたり、案内を聞いたりするところ",
      "B": "料理を作るところ",
      "C": "バスを直すところ",
      "D": "洗濯をするところ"
    },
    "answer": "A",
    "explanation": "受付 adalah meja penerimaan/resepsionis tempat mendaftar atau meminta informasi."
  },
  {
    "id": 21,
    "type": "grammar",
    "prompt": "田中さんは私＿＿日本語が上手です。",
    "options": {
      "A": "より",
      "B": "まで",
      "C": "とか",
      "D": "から"
    },
    "answer": "A",
    "explanation": "Pola AはBより… menunjukkan perbandingan: Tanaka lebih mahir bahasa Jepang daripada saya."
  },
  {
    "id": 22,
    "type": "grammar",
    "prompt": "このケーキは妹＿＿作りました。",
    "options": {
      "A": "へ",
      "B": "が",
      "C": "に",
      "D": "で"
    },
    "answer": "B",
    "explanation": "妹が作りました: が menandai pelaku yang membuat kue."
  },
  {
    "id": 23,
    "type": "grammar",
    "prompt": "先生に漢字を＿＿もらいました。",
    "options": {
      "A": "教える",
      "B": "教えた",
      "C": "教えて",
      "D": "教え"
    },
    "answer": "C",
    "explanation": "～てもらう menggunakan bentuk て: 教えてもらいました = diajari oleh guru."
  },
  {
    "id": 24,
    "type": "grammar",
    "prompt": "宿題が終わっ＿＿、テレビを見てもいいです。",
    "options": {
      "A": "ても",
      "B": "たら",
      "C": "たり",
      "D": "なくて"
    },
    "answer": "B",
    "explanation": "終わったら berarti setelah/kalau PR selesai. Bentuknya 終わっ＋たら."
  },
  {
    "id": 25,
    "type": "grammar",
    "prompt": "雨が降っている＿＿、試合はあります。",
    "options": {
      "A": "のに",
      "B": "ので",
      "C": "から",
      "D": "ため"
    },
    "answer": "A",
    "explanation": "～のに menyatakan pertentangan: meskipun hujan, pertandingan tetap ada."
  },
  {
    "id": 26,
    "type": "grammar",
    "prompt": "私は日本語の新聞が＿＿ようになりました。",
    "options": {
      "A": "読み",
      "B": "読める",
      "C": "読む",
      "D": "読ま"
    },
    "answer": "B",
    "explanation": "読めるようになりました berarti menjadi bisa membaca koran Jepang (bentuk potensial)."
  },
  {
    "id": 27,
    "type": "grammar",
    "prompt": "ここに名前を＿＿おいてください。",
    "options": {
      "A": "書き",
      "B": "書く",
      "C": "書いて",
      "D": "書いた"
    },
    "answer": "C",
    "explanation": "書いておく berarti menuliskan terlebih dahulu untuk persiapan."
  },
  {
    "id": 28,
    "type": "grammar",
    "prompt": "この本は字が大きくて、＿＿やすいです。",
    "options": {
      "A": "読み",
      "B": "読んで",
      "C": "読む",
      "D": "読んだ"
    },
    "answer": "A",
    "explanation": "Bentuk masu-stem ＋ やすい: 読みやすい berarti mudah dibaca."
  },
  {
    "id": 29,
    "type": "grammar",
    "prompt": "この店ではカードで＿＿ことができます。",
    "options": {
      "A": "払い",
      "B": "払う",
      "C": "払って",
      "D": "払った"
    },
    "answer": "B",
    "explanation": "～ことができます didahului bentuk kamus: 払うことができます = bisa membayar."
  },
  {
    "id": 30,
    "type": "grammar",
    "prompt": "明日のテストのために、単語を＿＿おきます。",
    "options": {
      "A": "覚えた",
      "B": "覚える",
      "C": "覚えて",
      "D": "覚え"
    },
    "answer": "C",
    "explanation": "覚えておきます: ～ておく menyatakan persiapan menghafal kata sebelum tes."
  },
  {
    "id": 31,
    "type": "grammar",
    "prompt": "あの店は夜九時＿＿開いています。",
    "options": {
      "A": "まで",
      "B": "しか",
      "C": "など",
      "D": "ばかり"
    },
    "answer": "A",
    "explanation": "九時まで berarti buka sampai pukul sembilan malam."
  },
  {
    "id": 32,
    "type": "grammar",
    "prompt": "この道は車が＿＿にくいです。",
    "options": {
      "A": "通り",
      "B": "通って",
      "C": "通る",
      "D": "通った"
    },
    "answer": "A",
    "explanation": "Bentuk masu-stem ＋ にくい: 通りにくい berarti sulit dilalui kendaraan."
  },
  {
    "id": 33,
    "type": "grammar",
    "prompt": "祖母は北海道に＿＿います。",
    "options": {
      "A": "住んだ",
      "B": "住み",
      "C": "住んで",
      "D": "住む"
    },
    "answer": "C",
    "explanation": "住んでいます dipakai untuk keadaan tinggal/berdomisili di suatu tempat."
  },
  {
    "id": 34,
    "type": "grammar",
    "prompt": "妹は犬が＿＿ようです。犬が近づくと逃げます。",
    "options": {
      "A": "怖い",
      "B": "怖く",
      "C": "怖くて",
      "D": "怖いだ"
    },
    "answer": "A",
    "explanation": "Kata sifat-i langsung diikuti ようです: 怖いようです = sepertinya takut."
  },
  {
    "id": 35,
    "type": "grammar",
    "prompt": "正しい文はどれですか。",
    "options": {
      "A": "きのう友だちにメールを送りました。",
      "B": "きのう友だちをメールに送りました。",
      "C": "きのう友だちでメールを送りました。",
      "D": "きのう友だちからメールを送るました。"
    },
    "answer": "A",
    "explanation": "友だちにメールを送る: partikel に untuk penerima, を untuk email."
  },
  {
    "id": 36,
    "type": "reading",
    "prompt": "水泳教室は何曜日にありますか。",
    "options": {
      "A": "月曜日と水曜日",
      "B": "火曜日と木曜日",
      "C": "水曜日と金曜日",
      "D": "土曜日と日曜日"
    },
    "answer": "B",
    "explanation": "案内には 火曜日と木曜日 と明記されています。",
    "passageId": "P1"
  },
  {
    "id": 37,
    "type": "reading",
    "prompt": "最初の日は何時に受付へ行きますか。",
    "options": {
      "A": "午後五時",
      "B": "午後六時",
      "C": "午後五時半",
      "D": "午後七時"
    },
    "answer": "C",
    "explanation": "最初の日だけ午後五時半に受付に来る指示があります。",
    "passageId": "P1"
  },
  {
    "id": 38,
    "type": "reading",
    "prompt": "参加する人は何を持っていきますか。",
    "options": {
      "A": "水着とタオル",
      "B": "ノートとペン",
      "C": "お弁当と水",
      "D": "くつとぼうし"
    },
    "answer": "A",
    "explanation": "持ち物は水着とタオルです。",
    "passageId": "P1"
  },
  {
    "id": 39,
    "type": "reading",
    "prompt": "真理さんはいつ出張しますか。",
    "options": {
      "A": "月曜日だけ",
      "B": "木曜日から土曜日",
      "C": "土曜日と日曜日",
      "D": "月曜日から水曜日"
    },
    "answer": "D",
    "explanation": "来週の月曜日から水曜日まで出張する予定です。",
    "passageId": "P2"
  },
  {
    "id": 40,
    "type": "reading",
    "prompt": "由美さんに夕方してほしいことは何ですか。",
    "options": {
      "A": "花に水をあげること",
      "B": "猫にえさをあげること",
      "C": "母を迎えに行くこと",
      "D": "台所を掃除すること"
    },
    "answer": "B",
    "explanation": "朝は母が来ますが、夕方は人がいないので猫の世話を頼んでいます。",
    "passageId": "P2"
  },
  {
    "id": 41,
    "type": "reading",
    "prompt": "猫のえさはどこにありますか。",
    "options": {
      "A": "玄関の左",
      "B": "庭の中",
      "C": "台所の右の棚",
      "D": "冷蔵庫の下"
    },
    "answer": "C",
    "explanation": "手紙に「台所の右の棚にあります」とあります。",
    "passageId": "P2"
  },
  {
    "id": 42,
    "type": "reading",
    "prompt": "今週の土曜日、スーパーは何時に閉まりますか。",
    "options": {
      "A": "午後三時",
      "B": "午後二時半",
      "C": "午後八時",
      "D": "午前九時"
    },
    "answer": "A",
    "explanation": "工事のため土曜日は午後三時で閉店します。",
    "passageId": "P3"
  },
  {
    "id": 43,
    "type": "reading",
    "prompt": "土曜日、何時までにレジへ行かなければなりませんか。",
    "options": {
      "A": "午後一時",
      "B": "午後三時半",
      "C": "午後四時",
      "D": "午後二時半"
    },
    "answer": "D",
    "explanation": "レジへは午後二時半までに来るよう案内されています。",
    "passageId": "P3"
  },
  {
    "id": 44,
    "type": "reading",
    "prompt": "車で来るお客様はどこの駐車場を使いますか。",
    "options": {
      "A": "左側",
      "B": "右側",
      "C": "店のうしろ",
      "D": "使えません"
    },
    "answer": "B",
    "explanation": "左側は工事で使えず、入口の右側を使います。",
    "passageId": "P3"
  },
  {
    "id": 45,
    "type": "reading",
    "prompt": "石井さんは何曜日に予約しましたか。",
    "options": {
      "A": "月曜日",
      "B": "火曜日",
      "C": "木曜日",
      "D": "金曜日"
    },
    "answer": "C",
    "explanation": "金曜日は都合が合わず、木曜日に予約しました。",
    "passageId": "P4"
  },
  {
    "id": 46,
    "type": "reading",
    "prompt": "予約した時間は何時ですか。",
    "options": {
      "A": "午後四時",
      "B": "午前十時",
      "C": "午後二時",
      "D": "午後五時"
    },
    "answer": "A",
    "explanation": "受付が木曜日の午後四時を提案し、石井さんが了承しました。",
    "passageId": "P4"
  },
  {
    "id": 47,
    "type": "reading",
    "prompt": "石井さんは何を持っていきますか。",
    "options": {
      "A": "水着だけ",
      "B": "お金だけ",
      "C": "本とノート",
      "D": "診察券と保険証"
    },
    "answer": "D",
    "explanation": "最後の発言では診察券に加えて保険証も必要と説明しています。",
    "passageId": "P4"
  },
  {
    "id": 48,
    "type": "reading",
    "prompt": "「私」はなぜ駅から会場まで歩きましたか。",
    "options": {
      "A": "電車が止まったから",
      "B": "バスが来なかったから",
      "C": "道が近すぎたから",
      "D": "母が走りたかったから"
    },
    "answer": "B",
    "explanation": "バスが来なかったため、十五分歩きました。",
    "passageId": "P5"
  },
  {
    "id": 49,
    "type": "reading",
    "prompt": "母は何を買いましたか。",
    "options": {
      "A": "白い花二つ",
      "B": "赤いかばん",
      "C": "赤い花一つ",
      "D": "花の本"
    },
    "answer": "C",
    "explanation": "母は赤い花を一つ買いました。",
    "passageId": "P5"
  },
  {
    "id": 50,
    "type": "reading",
    "prompt": "帰りにカフェで休んだのはなぜですか。",
    "options": {
      "A": "雨が降りはじめたから",
      "B": "お腹がすいたから",
      "C": "電車がなかったから",
      "D": "写真を撮るため"
    },
    "answer": "A",
    "explanation": "帰り道で雨が降り始めたため、近くのカフェで休みました。",
    "passageId": "P5"
  },
  {
    "id": 51,
    "type": "story_image",
    "prompt": "女の人は最後にどこに洗濯物を干しましたか。",
    "options": {
      "A": "台所",
      "B": "庭",
      "C": "ベランダ",
      "D": "居間"
    },
    "answer": "C",
    "explanation": "Panel terakhir menunjukkan pakaian dijemur di balkon (ベランダ).",
    "sceneId": "S1"
  },
  {
    "id": 52,
    "type": "story_image",
    "prompt": "男の子は種を植えたあと、何をしましたか。",
    "options": {
      "A": "水をあげました",
      "B": "本を読みました",
      "C": "花を切りました",
      "D": "ご飯を食べました"
    },
    "answer": "A",
    "explanation": "Setelah menanam biji di pot, anak menyiramnya (水をあげる).",
    "sceneId": "S2"
  },
  {
    "id": 53,
    "type": "story_image",
    "prompt": "男の人はマフラーをどこへ届けましたか。",
    "options": {
      "A": "スーパーのレジ",
      "B": "駅の窓口",
      "C": "学校の教室",
      "D": "病院の受付"
    },
    "answer": "B",
    "explanation": "Panel ketiga memperlihatkan syal dibawa ke loket informasi stasiun.",
    "sceneId": "S3"
  },
  {
    "id": 54,
    "type": "story_image",
    "prompt": "お父さんはお弁当箱に何を入れましたか。",
    "options": {
      "A": "パンとチーズ",
      "B": "魚とサラダ",
      "C": "りんごとバナナ",
      "D": "ご飯と卵焼き"
    },
    "answer": "D",
    "explanation": "Ayah memasukkan nasi putih dan tamagoyaki (telur gulung) ke kotak makan.",
    "sceneId": "S4"
  },
  {
    "id": 55,
    "type": "story_image",
    "prompt": "二人は水族館で何を見ましたか。",
    "options": {
      "A": "イルカ",
      "B": "ペンギン",
      "C": "サメ",
      "D": "カメ"
    },
    "answer": "A",
    "explanation": "Gambar memperlihatkan lumba-lumba (イルカ) di akuarium.",
    "sceneId": "S5"
  },
  {
    "id": 56,
    "type": "match_image",
    "prompt": "文に合う絵を選んでください。",
    "options": {
      "A": "画像A",
      "B": "画像B",
      "C": "画像C",
      "D": "画像D"
    },
    "answer": "B",
    "explanation": "Tas besar hijau ada di kanan kursi.",
    "matchingId": "M1"
  },
  {
    "id": 57,
    "type": "match_image",
    "prompt": "文に合う絵を選んでください。",
    "options": {
      "A": "画像A",
      "B": "画像B",
      "C": "画像C",
      "D": "画像D"
    },
    "answer": "D",
    "explanation": "Anak perempuan bertopi kuning sedang berlari bersama anjing.",
    "matchingId": "M2"
  },
  {
    "id": 58,
    "type": "match_image",
    "prompt": "文に合う絵を選んでください。",
    "options": {
      "A": "画像A",
      "B": "画像B",
      "C": "画像C",
      "D": "画像D"
    },
    "answer": "C",
    "explanation": "Ada tiga kotak biru di rak paling atas.",
    "matchingId": "M3"
  },
  {
    "id": 59,
    "type": "match_image",
    "prompt": "文に合う絵を選んでください。",
    "options": {
      "A": "画像A",
      "B": "画像B",
      "C": "画像C",
      "D": "画像D"
    },
    "answer": "A",
    "explanation": "Jarum panjang tepat angka 6 dan jarum pendek di tengah antara 3 dan 4, menunjukkan 3:30.",
    "matchingId": "M4"
  },
  {
    "id": 60,
    "type": "match_image",
    "prompt": "文に合う絵を選んでください。",
    "options": {
      "A": "画像A",
      "B": "画像B",
      "C": "画像C",
      "D": "画像D"
    },
    "answer": "B",
    "explanation": "Laki-laki menutup jendela dan salju terlihat turun di luar.",
    "matchingId": "M5"
  },
  {
    "id": 61,
    "type": "listening",
    "prompt": "女の人は夕ご飯に何を作りますか。",
    "options": {
      "A": "焼き魚",
      "B": "肉料理",
      "C": "カレー",
      "D": "パスタ"
    },
    "answer": "A",
    "explanation": "Ia membeli ikan, bukan daging, lalu akan memanggang ikan untuk makan malam.",
    "audioId": "L1"
  },
  {
    "id": 62,
    "type": "listening",
    "prompt": "男の人は何時までに教室に来てほしいと言っていますか。",
    "options": {
      "A": "十時",
      "B": "九時半",
      "C": "九時四十五分",
      "D": "十時十五分"
    },
    "answer": "C",
    "explanation": "Walau pelajaran mulai 10:00, diminta datang paling lambat 9:45.",
    "audioId": "L2"
  },
  {
    "id": 63,
    "type": "listening",
    "prompt": "郵便局に行くには、どこで曲がりますか。",
    "options": {
      "A": "一つ目の信号を右",
      "B": "二つ目の信号を左",
      "C": "二つ目の信号を右",
      "D": "一つ目の信号を左"
    },
    "answer": "B",
    "explanation": "Petunjuknya: lurus, lalu belok kiri pada lampu lalu lintas kedua.",
    "audioId": "L3"
  },
  {
    "id": 64,
    "type": "listening",
    "prompt": "二人はどこで会うことにしましたか。",
    "options": {
      "A": "花屋の中",
      "B": "駅の改札口",
      "C": "レストランの前",
      "D": "本屋の前"
    },
    "answer": "D",
    "explanation": "Toko bunga sudah tutup; tempat temu diubah menjadi depan toko buku.",
    "audioId": "L4"
  },
  {
    "id": 65,
    "type": "listening",
    "prompt": "会議は何曜日になりましたか。",
    "options": {
      "A": "木曜日",
      "B": "火曜日",
      "C": "水曜日",
      "D": "金曜日"
    },
    "answer": "A",
    "explanation": "Rapat dipindah dari Rabu menjadi Kamis karena perusahaan libur pada Rabu.",
    "audioId": "L5"
  },
  {
    "id": 66,
    "type": "listening",
    "prompt": "いちばんいい返事を選んでください。",
    "options": {
      "A": "はい、読んでいます。",
      "B": "いいえ、まだです。",
      "C": "いいえ、寒いです。",
      "D": "三時に帰ります。"
    },
    "answer": "B",
    "explanation": "Pertanyaan もう出しましたか (sudah menyerahkan laporan?) tepat dijawab いいえ、まだです (belum).",
    "audioId": "L6"
  },
  {
    "id": 67,
    "type": "listening",
    "prompt": "いちばんいい返事を選んでください。",
    "options": {
      "A": "二冊あります。",
      "B": "毎日勉強します。",
      "C": "いいえ、どうぞ。",
      "D": "ここは学校です。"
    },
    "answer": "C",
    "explanation": "Jika ditanya apakah tempat duduk dipakai, いいえ、どうぞ berarti tidak, silakan duduk.",
    "audioId": "L7"
  },
  {
    "id": 68,
    "type": "listening",
    "prompt": "男の人は旅行に何を持っていきますか。",
    "options": {
      "A": "帽子",
      "B": "上着",
      "C": "本",
      "D": "かさ"
    },
    "answer": "D",
    "explanation": "Ia akan membawa payung karena mungkin hujan; jaket sudah ada di hotel.",
    "audioId": "L8"
  },
  {
    "id": 69,
    "type": "listening",
    "prompt": "お客さんは最初に何をしますか。",
    "options": {
      "A": "切符を買います",
      "B": "三番線で待ちます",
      "C": "電車に乗ります",
      "D": "駅員をさがします"
    },
    "answer": "A",
    "explanation": "Urutan arahan まず: beli tiket dulu dari mesin, baru menuju peron 3.",
    "audioId": "L9"
  },
  {
    "id": 70,
    "type": "listening",
    "prompt": "女の人はいつ料理教室に行くつもりですか。",
    "options": {
      "A": "土曜日の午後",
      "B": "日曜日の午前",
      "C": "金曜日の午前",
      "D": "日曜日の夜"
    },
    "answer": "B",
    "explanation": "Sabtu bekerja, jadi dia memilih kelas Minggu pagi.",
    "audioId": "L10"
  }
]
```

### 6.1 Lima bacaan reading (Q36–Q50)

Copy ke `src/data/passages.json`. Untuk Q36–38 tampilkan P1; Q39–41 P2; Q42–44 P3; Q45–47 P4; Q48–50 P5. Tanda `\n` bermakna baris baru saat JSON diparsing.

```json
[
  {
    "id": "P1",
    "title": "水泳教室の案内",
    "text": "市のスポーツセンターでは、来月から水泳教室が始まります。火曜日と木曜日の午後六時から七時までです。参加したい人は今月二十五日までに申し込んでください。水着とタオルを持ってきてください。最初の日だけ、午後五時半に受付へ来てください。"
  },
  {
    "id": "P2",
    "title": "真理さんからのお願い",
    "text": "由美さんへ\n来週の月曜日から水曜日まで出張します。うちの猫にえさをあげてもらえませんか。朝は母が来ますが、夕方はだれもいません。えさは台所の右の棚にあります。水は毎日新しいものにかえてください。木曜日に帰ったら、お礼にケーキを持って行きます。\n真理"
  },
  {
    "id": "P3",
    "title": "スーパーの営業時間",
    "text": "青空スーパーからのお知らせ\n今週の土曜日は、店の中を工事するため、午後三時で閉店します。日曜日はいつもどおり、午前九時から午後八時まで営業します。土曜日に買い物をするお客様は、午後二時半までにレジへお越しください。入口の左側の駐車場は使えませんので、右側をご利用ください。"
  },
  {
    "id": "P4",
    "title": "病院の予約",
    "text": "石井：すみません、来週の金曜日の午後に予約したいんですが。\n受付：金曜日は午後がいっぱいです。午前十時なら空いています。\n石井：午前中は仕事です。木曜日の午後はどうですか。\n受付：木曜日なら午後四時に予約できます。\n石井：では、木曜日の四時にお願いします。診察券を持って行けばいいですか。\n受付：はい、保険証も忘れないでください。"
  },
  {
    "id": "P5",
    "title": "花の展示会に行きました",
    "text": "日曜日、私は母と市の花の展示会に行きました。バスが来なかったので、駅から会場まで十五分歩きました。会場でいろいろな花の写真を撮りました。母は赤い花を一つ買いましたが、私は何も買いませんでした。帰りに雨が降りはじめたので、近くのカフェで一時間休みました。"
  }
]
```

### 6.2 Lima ilustrasi cerita (Q51–Q55)

**Produksi ilustrasi:** gambarkan empat panel dengan urutan kiri ke kanan (di mobile boleh dua baris) sesuai `panels`. Pisahkan panel menggunakan garis dan angka 1–4 yang netral. Pastikan objek, jumlah, lokasi, ekspresi dan tindakan sesuai instruksi spesifik. Jangan gunakan teks jawaban dalam SVG; gambar harus cukup jelas untuk memberi satu jawaban yang pasti.


Copy ke `src/data/storyScenes.json`; **buat file SVG beneran** sesuai `panels`, gaya vektor konsisten, 4 panel (1→2→3→4) dari kiri ke kanan di desktop atau urutan atas-ke-bawah yang jelas di HP. Tambahkan angka panel kecil netral; jangan tulis isi jawaban di dalam gambar. Cerita harus bisa dimengerti dari visual tanpa bantuan caption panel yang mengungkapkan jawaban. `visualQuestion` adalah petunjuk untuk ilustrator/agent **bukan teks tambahan UI**.

```json
[
  {
    "id": "S1",
    "path": "images/stories/s1.svg",
    "name": "ベランダに干す洗濯",
    "panels": [
      "Ibu rumah tangga memasukkan baju dan handuk kotor ke dalam mesin cuci, tanpa warna yang membingungkan.",
      "Mesin cuci sedang berputar, perempuan menekan tombol start.",
      "Perempuan mengangkat baju dan handuk bersih dari keranjang.",
      "Perempuan menggantung baju pada tali jemuran di balkon lantai dua; pagar balkon dan pintu kaca jelas terlihat, bukan halaman atau dapur."
    ],
    "visualQuestion": "Perempuan menggantung pakaian di lokasi apa pada panel keempat?"
  },
  {
    "id": "S2",
    "path": "images/stories/s2.svg",
    "name": "Menanam bunga",
    "panels": [
      "Anak laki-laki memegang sebuah pot dan kantong benih bunga kecil.",
      "Anak memasukkan biji kecil ke lubang tanah di dalam pot.",
      "Anak menyiram tanah pot dengan gembor hijau, semburan air tampak jelas.",
      "Beberapa hari kemudian pot berisi satu bunga mekar dan anak tersenyum."
    ],
    "visualQuestion": "Apa tindakan anak tepat sesudah menanam biji?"
  },
  {
    "id": "S3",
    "path": "images/stories/s3.svg",
    "name": "Menyerahkan barang tertinggal",
    "panels": [
      "Laki-laki melihat syal merah tertinggal di bangku peron stasiun.",
      "Laki-laki mengambil syal merah, mengamati peron yang kosong.",
      "Laki-laki menyerahkan syal kepada petugas di loket informasi stasiun, dengan ikon rel/kereta (bukan papan tulisan jawaban).",
      "Petugas menyimpan syal dalam kotak barang temuan dan memberi gestur terima kasih."
    ],
    "visualQuestion": "Kepada siapa dan di mana syal diserahkan?"
  },
  {
    "id": "S4",
    "path": "images/stories/s4.svg",
    "name": "Ayah menyiapkan bekal",
    "panels": [
      "Ayah menaruh nasi putih ke kotak makan anak.",
      "Ayah membuat tamagoyaki kuning (telur gulung) dalam wajan.",
      "Ayah menata nasi putih dan tamagoyaki kuning di kotak makan yang sama.",
      "Ayah memberikan kotak bekal kepada putrinya yang memakai tas sekolah."
    ],
    "visualQuestion": "Dua makanan apa yang dimasukkan ayah ke kotak bekal?"
  },
  {
    "id": "S5",
    "path": "images/stories/s5.svg",
    "name": "Berkunjung ke akuarium",
    "panels": [
      "Dua teman membeli dua tiket di depan gedung akuarium dengan ikon ikan, jangan pakai teks Jepang.",
      "Dua teman berdiri di depan tangki kaca besar melihat lumba-lumba abu-abu berenang; sirip punggung dan moncong khas lumba-lumba jelas.",
      "Mereka memotret lumba-lumba dalam tangki, tidak ada paus/hiu/penyu.",
      "Keduanya keluar akuarium sambil membawa brosur biru."
    ],
    "visualQuestion": "Hewan apa yang mereka lihat dalam tangki?"
  }
]
```

### 6.3 Lima pertanyaan mencocokkan gambar (Q56–Q60)

**Produksi ilustrasi:** keempat opsi dalam setiap `matchingId` sengaja dibuat sangat mirip; perbedaan penting (kanan/kiri, ukuran, warna, berjalan/berlari, jumlah dan posisi, waktu jam, salju/hujan) harus digambar **dengan presisi**. Pada jam 03:30, jarum jam tidak boleh tepat di angka 3; posisinya harus di tengah angka 3 dan 4. Jangan mengganti opsi dengan keterangan bahasa Indonesia.


Copy ke `src/data/matchingScenes.json`. Untuk setiap `matchingId`, tampilkan `prompt` dari dataset ini sebagai **stimulus teks bahasa Jepang** dan empat gambar `images.A/B/C/D` dengan file statis yang dibuat agent pada `public/images/matching/m{nomor}-a.svg` s.d. `-d.svg`. Di UI soal Q56–60, tampilkan prompt dari `matching.prompt` di atas empat gambar (sedangkan `question.prompt` adalah instruksi “Pilih gambar”). **Wajib** gambar A-D benar-benar berbeda dan cocok dengan deskripsi asset manifest. Tidak boleh menampilkan teks deskripsi visual berbahasa Indonesia yang ada di data produksi sebagai label di mode ujian karena dapat membocorkan jawaban; label UI cukup A, B, C, D.

```json
[
  {
    "id": "M1",
    "prompt": "いすの右に、大きな緑のかばんがあります。",
    "images": {
      "A": "Tas hijau besar di kiri kursi.",
      "B": "Tas hijau besar di kanan kursi.",
      "C": "Tas merah besar di kanan kursi.",
      "D": "Tas hijau kecil di kanan kursi."
    }
  },
  {
    "id": "M2",
    "prompt": "女の子は黄色いぼうしをかぶって、犬と走っています。",
    "images": {
      "A": "Anak perempuan bertopi merah berlari bersama anjing.",
      "B": "Anak laki-laki bertopi kuning berlari bersama anjing.",
      "C": "Anak perempuan bertopi kuning berjalan bersama anjing.",
      "D": "Anak perempuan bertopi kuning berlari bersama anjing."
    }
  },
  {
    "id": "M3",
    "prompt": "たなのいちばん上に、青いはこが三つならんでいます。",
    "images": {
      "A": "Rak dengan dua kotak biru di bagian paling atas.",
      "B": "Rak dengan tiga kotak merah di bagian paling atas.",
      "C": "Rak dengan tiga kotak biru sejajar di bagian paling atas.",
      "D": "Rak dengan tiga kotak biru sejajar di bagian paling bawah."
    }
  },
  {
    "id": "M4",
    "prompt": "時計は三時半をさしています。",
    "images": {
      "A": "Jam analog menunjukkan 3:30, jarum menit ke 6, jarum jam setengah di antara 3 dan 4.",
      "B": "Jam analog menunjukkan 3:00, jarum menit ke 12, jarum jam tepat 3.",
      "C": "Jam analog menunjukkan 2:30, jarum menit ke 6, jarum jam antara 2 dan 3.",
      "D": "Jam analog menunjukkan 6:15, jarum menit ke 3, jarum jam sedikit lewat 6."
    }
  },
  {
    "id": "M5",
    "prompt": "男の人が窓を閉めています。外では雪が降っています。",
    "images": {
      "A": "Laki-laki membuka jendela, di luar turun salju.",
      "B": "Laki-laki menutup jendela, di luar turun salju.",
      "C": "Perempuan menutup jendela, di luar turun salju.",
      "D": "Laki-laki menutup jendela, di luar turun hujan."
    }
  }
]
```

### 6.4 Sepuluh listening — naskah produksi audio (Q61–Q70)

Copy ke `src/data/listeningScripts.json`. File `public/audio/q61.mp3` sampai `q70.mp3` **harus ada dan valid** pada hasil akhir. `script` ini diperbolehkan untuk produksi audio dan halaman review saja; tidak ditampilkan selama tes.

```json
[
  {
    "id": "L1",
    "file": "audio/q61.mp3",
    "task": "point",
    "script": "女の人：今日は肉ではなく魚を買いました。夕ご飯はその魚を焼こうと思います。",
    "speakerNotes": "Perempuan dewasa, intonasi natural; tekankan kontras 肉ではなく魚."
  },
  {
    "id": "L2",
    "file": "audio/q62.mp3",
    "task": "point",
    "script": "男の人：授業は十時からですが、教室には九時四十五分までに来てください。",
    "speakerNotes": "Laki-laki dewasa, angka jam diucapkan sangat jelas."
  },
  {
    "id": "L3",
    "file": "audio/q63.mp3",
    "task": "task",
    "script": "女の人：郵便局へは、この道をまっすぐ行ってください。二つ目の信号を左に曲がると、右にあります。",
    "speakerNotes": "Perempuan dewasa; jeda sesudah まっすぐ行ってください。"
  },
  {
    "id": "L4",
    "file": "audio/q64.mp3",
    "task": "point",
    "script": "女の人：駅の前の花屋で待っています。\n男の人：花屋はもう閉まっていますよ。となりの本屋の前にしましょう。\n女の人：わかりました。",
    "speakerNotes": "Dua penutur berbeda; jeda antarpenutur 600 ms; jangan bacakan label pembicara."
  },
  {
    "id": "L5",
    "file": "audio/q65.mp3",
    "task": "point",
    "script": "男の人：会議は水曜日の予定でしたが、その日は会社が休みになりました。だから木曜日に変更します。",
    "speakerNotes": "Laki-laki dewasa; beri intonasi kontras pada 水曜日 dan 木曜日."
  },
  {
    "id": "L6",
    "file": "audio/q66.mp3",
    "task": "quick_response",
    "script": "先生：レポートはもう出しましたか。",
    "speakerNotes": "Suara guru, satu pertanyaan, akhir kalimat naik natural."
  },
  {
    "id": "L7",
    "file": "audio/q67.mp3",
    "task": "quick_response",
    "script": "女の人：すみません、この席、使っていますか。",
    "speakerNotes": "Perempuan dewasa, sopan, jeda kecil setelah すみません。"
  },
  {
    "id": "L8",
    "file": "audio/q68.mp3",
    "task": "point",
    "script": "女の人：旅行に何を持っていきますか。\n男の人：雨が降るかもしれないので、かさを持っていきます。上着はホテルにあります。",
    "speakerNotes": "Dua penutur; akhir alasan diucapkan jelas."
  },
  {
    "id": "L9",
    "file": "audio/q69.mp3",
    "task": "task",
    "script": "駅員：まず券売機で切符を買ってください。それから、三番線の電車に乗ってください。",
    "speakerNotes": "Petugas stasiun, instruksi urutan jelas: まず → それから."
  },
  {
    "id": "L10",
    "file": "audio/q70.mp3",
    "task": "task",
    "script": "女の人：来週の料理教室に出たいけど、土曜日は仕事なの。\n男の人：日曜日の午前にもクラスがあるそうだよ。\n女の人：じゃあ、そのクラスに申し込むね。",
    "speakerNotes": "Dua penutur; beri jeda pergantian suara; kata 日曜日の午前 harus jelas."
  }
]
```

### 6.5 Aturan produksi audio **wajib dipenuhi**

> Penting V2: audio Q61–Q70 harus disintesis dari **10 naskah V2** di atas, bukan file MP3 milik V1 yang kebetulan punya nama sama. Untuk keamanan perubahan konten, tambahkan uji/manual inspeksi sampling suara audio terhadap skrip V2.


1. Buat **10 audio MP3 asli** dari naskah `L1`–`L10` menggunakan rekaman sendiri atau engine TTS yang penggunaan publiknya diizinkan; usahakan aksen natural **ja-JP**, laju sedikit lebih lambat dari percakapan normal (sekitar 0,9×), artikulasi jelas, tanpa musik latar. Untuk naskah multi-pembicara, gunakan pergantian suara bila engine mendukung.
2. **Jangan membacakan label** `女の人：` / `男の人：` / `先生：` / `学生：` sebagai bagian audio. Label hanya untuk menentukan karakter suara; potong/split menurut pergantian speaker. Sisipkan jeda sekitar 500–800 ms antar penutur.
3. Simpan audio sebagai file statis `.mp3` di repo agar bisa dilayani GitHub Pages dan Vercel tanpa server TTS. **Jangan memerlukan API key client-side** atau layanan runtime berbayar. Komit seluruh file ke repository.
4. Preload metadata audio aktif; playback terjadi hanya setelah aksi pengguna (aturan browser autoplay). Tampilkan error yang masuk akal jika file rusak/terblokir. Jika belum bisa membuat MP3 nyata di lingkungan agent, **jangan menyatakan proyek complete**. Browser `speechSynthesis` `ja-JP` hanya boleh menjadi fallback (tergantung dukungan voice perangkat), tidak boleh dianggap pengganti sepuluh file produksi.
5. Simulasi: maksimum 2 kali playback per nomor listening (simpan play count); hitung saat suara benar-benar mulai diputar, **bukan** saat pengguna menekan tombol tetapi file gagal dimuat. Jangan tampilkan transkrip sampai `completed`.
6. Pada review, sediakan tombol play, transkrip asli, dan penjelasan. Pastikan seluruh opsi tetap terlihat sesudah submit.

## 7. Kalkulasi skor dan validasi data

```ts
const correct = questions.filter(q => answers[q.id] === q.answer).length;
const answered = questions.filter(q => answers[q.id] != null).length;
const wrong = answered - correct;
const unanswered = 70 - answered;
const percent = Number(((correct / 70) * 100).toFixed(1));
```

Uji otomatis pada proses build/CI (misalnya Vitest + script validation):

- `questions.length === 70`, ID unik berurutan 1..70, semua punya 4 opsi **A-D**, setiap `answer` termasuk A-D, seluruh opsi non-kosong & tidak duplikat dalam satu soal.
- Jumlah tipe persis `[20,15,15,5,5,10]` pada urutan 6 kategori di atas.
- `passageId` valid untuk 15 reading; tepat 3 soal per passage; `sceneId`, `matchingId`, `audioId` semuanya valid dan tidak ada referensi hilang.
- File SVG yang ditunjuk di manifest harus benar-benar ada, dapat dimuat, dan cukup jelas untuk menjawab; semua gambar A-D per matching harus berbeda secara visual.
- `audio/*.mp3`: persis 10, masing-masing ukuran > 0, format dapat diputar browser, tidak memberi HTTP 404 setelah deploy; coba di Chrome Mobile dan Safari jika tersedia.
- Jawaban satu soal tidak hilang saat maju/mundur atau refresh; countdown tidak mundur setelah reload; modal konfirmasi untuk jawaban kosong; auto-submit sekali saat deadline.
- Tidak ada leak teks pembahasan/kunci/transkrip ke antarmuka sebelum selesai (meski tetap bisa terbaca di bundle statis).
- Periksa akurasi kunci dengan membaca soal Jepang secara manual; **jangan memperbaiki jawaban hanya untuk meratakan distribusi A/B/C/D**.
- Semua 70 pertanyaan navigable via keyboard dan mobile; tes tampilan di 360px dan desktop.

## 8. Deployment online ke GitHub Pages — **WAJIB**

**Repository:** <https://github.com/fayyadh678/SimulasiN4ver1.git>  
**Target setelah berhasil deploy:** <https://fayyadh678.github.io/SimulasiN4ver1/>.  
Agent perlu akses push melalui kredensial/otorisasi yang sah dari pemilik repo. **Jangan meminta password/token ditempel ke source code atau ke README.** Jika agent tidak memiliki izin push, selesaikan implementasi di workspace dan berikan perintah push kepada pengguna; jangan mengklaim website live.

### 8.1 Konfigurasi base path Vite untuk dua host

Pada `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Di GitHub Pages project path adalah /SimulasiN4ver1/; di Vercel path /.
  base: process.env.GITHUB_PAGES === 'true' ? '/SimulasiN4ver1/' : '/',
});
```

- **Krusial**: buat fungsi path untuk audio/gambar dari `${import.meta.env.BASE_URL}audio/q61.mp3` dan `${import.meta.env.BASE_URL}images/stories/s1.svg`, **bukan** `/audio/q61.mp3` atau `/images/...` yang akan 404 pada project GitHub Pages.
- Untuk navigasi gunakan state SPA dalam satu halaman, atau `HashRouter` jika butuh router. **Jangan pakai BrowserRouter** dengan path `/results` tanpa fallback Pages karena direct refresh akan menimbulkan 404. Vercel dapat memakai rewrites, tapi pendekatan hash adalah yang paling sederhana untuk kedua host.
- Build GitHub Pages dengan `GITHUB_PAGES=true npm run build`; build Vercel biasa `npm run build`.

### 8.2 Workflow `.github/workflows/deploy.yml`

```yaml
name: Deploy N4 Website to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - name: Install
        run: npm ci
      - name: Test
        run: npm test -- --run
      - name: Build (GitHub Pages base path)
        run: npm run build
        env:
          GITHUB_PAGES: 'true'
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Upload dist
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

Agent: gunakan versi actions yang masih didukung menurut dokumen GitHub pada saat eksekusi. Pastikan `npm test -- --run` didefinisikan di `package.json` dan **lulus**, serta `package-lock.json` dikomit agar `npm ci` bekerja. Jika memakai test runner yang berbeda, ubah perintah secara eksplisit, bukan menghapus testing.

### 8.3 Langkah menjalankan dan publish

1. Clone repo `git clone https://github.com/fayyadh678/SimulasiN4ver1.git && cd SimulasiN4ver1`. Karena repo awalnya kosong, buat Vite React TypeScript (contoh: `npm create vite@latest . -- --template react-ts`), kemudian install dependensi. Jika sudah terisi, inspect dan lanjutkan existing project daripada membuat ulang.
2. Copy data 70 soal ke file `src/data` dan implementasikan page/components, buat 25 SVG serta sepuluh MP3, tambah unit test dan jalankan `npm run build` + tes.
3. Pastikan default branch adalah `main`; commit semua source, file SVG/audio, lockfile, konfigurasi dan workflow; `git push -u origin main` bila diotorisasi.
4. Di repo GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions** (opsi ini baru relevan setelah repo memiliki commit/branch).
5. Buka **Actions** di GitHub, pastikan deploy job sukses. Buka URL Pages di atas dan cek 70 soal, gambar, audio, timer, submit, review, dan direct refresh.
6. Jika dibutuhkan, pasang custom domain nanti. Tidak perlu custom domain agar online.

### 8.4 Troubleshooting Pages

- Situs kosong/JS 404: periksa `vite.config.ts` `base='/SimulasiN4ver1/'`, jalankan build dengan `GITHUB_PAGES=true`.
- MP3/SVG 404: semua asset `public/` diakses melalui `import.meta.env.BASE_URL`, cek huruf kapital path dan nama file pada Linux CI.
- 404 setelah refresh navigasi: gunakan state SPA tunggal atau hash-based routing.
- Action `npm ci` gagal: commit `package-lock.json`, sinkronkan Node/npm, cek `npm install` lokal.
- Pages belum tersedia: repo publik (jika menggunakan plan yang mensyaratkan publik), source GitHub Actions aktif, dan workflow sukses; lihat error detail di Actions.

## 9. Deployment Vercel — opsi kedua, dari GitHub yang sama

1. Buka <https://vercel.com/new> atau dashboard Vercel, sign in dan hubungkan GitHub dengan izin untuk repo `fayyadh678/SimulasiN4ver1`.
2. **Import Git Repository** tersebut; Framework Preset: **Vite**; Root Directory: `./`; Build Command: `npm run build`; Output Directory: `dist`; Install Command: `npm ci` (atau default yang setara).
3. **Jangan** set `GITHUB_PAGES=true` pada Vercel. Vite `base:'/'` pada Vercel sehingga asset muncul di root domain.
4. Klik Deploy. Catat alamat `.vercel.app` yang **benar-benar** diterbitkan Vercel; tidak boleh diklaim live jika belum berhasil.
5. Perubahan yang di-push ke branch produksi akan bisa otomatis ter-deploy setelah integrasi GitHub dikonfigurasi. Set branch utama sebagai `main`.
6. Jika ingin path-based routing Vercel, buat `vercel.json` rewrite ke `/index.html`, tetapi karena rancangan ini menggunakan satu halaman/hash route, rewrite biasanya tidak dibutuhkan.
7. Cek 70 soal, 5 SVG story, 20 SVG pilihan gambar, 10 audio MP3, skor/review dan refresh dari HP setelah publish. Jika deployment GHP dan Vercel sama-sama diperlukan, lakukan **dua pengujian URL publik** secara terpisah.

## 10. README project dan handoff yang diwajibkan

Agent harus menghasilkan `README.md` dalam repo yang berisi: ringkasan, instalasi lokal untuk *development* saja, tes, build, 70-soal breakdown, cara deploy Pages dan Vercel, cara menambah soal, status & tautan URL publik yang **sudah diverifikasi**. Jangan taruh kunci API, credential, username/password, atau data pribadi.

Pada akhir pekerjaan agent **wajib melaporkan** (khusus Version 2):

- path/source code hasil build;
- tautan repo `<https://github.com/fayyadh678/SimulasiN4ver1>`;
- URL GitHub Pages (dan Vercel jika berhasil) setelah benar-benar dapat diakses;
- bukti hasil `npm test` dan `npm run build` sukses;
- checklist yang sudah dicek (70 soal, 25 gambar, 10 audio, timer, scoring, review, responsive);
- bila tidak punya akses push/deploy, katakan jelas "belum dideploy" dan sediakan langkah singkat otorisasi/push, **jangan membuat URL palsu atau mengklaim publish berhasil**.

## 11. Definition of Done (tidak boleh dilewati)

- [ ] Judul dan materi secara konsisten menyatakan **Version 2 / Set 2**; pertanyaan, bacaan, scene dan listening **bukan V1**; identitas penyimpanan lokal V2 terpisah.


- [ ] 70 soal termuat dalam 6 kategori, masing-masing empat pilihan A/B/C/D dan kunci benar.
- [ ] Reading 5 bacaan × 3 soal, story 5 SVG empat panel, matching 5 × 4 SVG opsi.
- [ ] Listening 10 MP3 bahasa Jepang yang playable secara publik; transkrip hanya muncul sesudah submit.
- [ ] Perhitungan skor & review/kunci/pembahasan benar; tidak ada kebocoran kunci di UI saat ujian.
- [ ] Progress dan deadline bertahan setelah refresh, submit dengan konfirmasi dan auto-finish bila waktu habis.
- [ ] UI simple, clean, responsif, keyboard-friendly.
- [ ] Tests dan `npm run build` berhasil tanpa error.
- [ ] GitHub Actions publish ke GitHub Pages berjalan dengan path `/SimulasiN4ver1/`, seluruh gambar dan MP3 valid di URL publik.
- [ ] Opsi deploy Vercel terdokumentasi/teruji bila akses tersedia.
- [ ] README dan status deploy jujur; jangan mengklaim live jika belum publish.

---

**Akhir instruksi untuk agent. Mulai dengan validasi data dan produksi asset, lalu implementasi dan deployment. Jangan berhenti pada desain Figma/mockup atau hanya menyajikan potongan kode.**
