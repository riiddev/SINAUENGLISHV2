# Checklist Paritas Fitur: V1 (testesaja) vs V2 (SINAUENGLISHV2)

Dokumen ini menjadi instrumen verifikasi utama untuk memastikan **100% fitur dan data V1 tetap hadir dan berfungsi di V2** tanpa kehilangan satu komponen pun.

---

## 1. Paritas Data Statis

| Item Data | Target V1 | Status di V2 | Bukti Verifikasi |
|---|---|---|---|
| Oxford 3000 Total Headwords | 2.971 kata unik | ✅ **LULUS (Passed)** | `verify-v2-data.mjs` (2.971 valid) |
| Oxford 3000 Level A1 | 892 kata | ✅ **LULUS (Passed)** | `A1.json.gz.b64` (892 valid) |
| Oxford 3000 Level A2 | 792 kata | ✅ **LULUS (Passed)** | `A2.json.gz.b64` (792 valid) |
| Oxford 3000 Level B1 | 689 kata | ✅ **LULUS (Passed)** | `B1.json.gz.b64` (689 valid) |
| Oxford 3000 Level B2 | 597 kata | ✅ **LULUS (Passed)** | `B2.json.gz.b64` (597 valid) |
| Oxford 3000 UNCLASSIFIED | 1 kata ("o") | ✅ **LULUS (Passed)** | `UNCLASSIFIED.json.gz.b64` (1 valid) |
| Oxford 3000 Editorial Overrides | 1.144 kurasi | ✅ **LULUS (Passed)** | `audit.json` (1.144 verified) |
| Starter Vocab Quick Index | 999 kata | ✅ **LULUS (Passed)** | `data/vocabulary.json` (999 valid) |
| Kurikulum Grammar | 19 topik A1–B2 | ✅ **LULUS (Passed)** | `data/grammar.json` (19 topik valid) |
| Bank Soal Kuis Grammar | 57 soal tervalidasi | ✅ **LULUS (Passed)** | 57 soal tervalidasi unik |
| HABIT Reading Passages | 156 bacaan (63.309 kata) | ✅ **LULUS (Passed)** | 156 bacaan / 63.309 kata valid |
| Keterampilan Membaca (Reading Skills) | 12 materi + 12 soal | ✅ **LULUS (Passed)** | `data/reading-lessons.json` valid |
| Everyday Stories | 8 cerita A1–B2 | ✅ **LULUS (Passed)** | `public/data/adventure/stories.json` |
| Everyday English Dialogues | 4 skenario roleplay | ✅ **LULUS (Passed)** | `public/data/adventure/dialogues.json` |
| Listening Lab | 8 latihan 3-tahap | ✅ **LULUS (Passed)** | `public/data/adventure/listening.json` |
| Pronunciation Studio | 16 frasa terpandu | ✅ **LULUS (Passed)** | `public/data/adventure/pronunciation.json` |

---

## 2. Paritas Halaman & Navigasi

| Halaman / View | Elemen Kunci | Status di V2 |
|---|---|---|
| **Landing / Home (`index.html`)** | Hero headline, specimen kata interaktif, audio pronunciation, 3-step value prop, navigasi ke ruang belajar | ⏳ Menunggu Fase 4 |
| **Workspace: Beranda (`overview`)** | Ringkasan harian, kartu motivasi, quick jump ke modul belajar, statistik sesi | ⏳ Menunggu Fase 4 |
| **Workspace: Kosakata (`vocabulary`)** | Grid/list 2.971 kata, filter level A1–B2, search bar instan, kartu kata detail (makna, part of speech, IPA, contoh kalimat, terjemahan Indonesia) | ⏳ Menunggu Fase 4 |
| **Workspace: Grammar (`grammar`)** | Daftar topik bertingkat CEFR, detail penjelasan, rumus/pattern, contoh kalimat bilingual, tips kesalahan umum (*mistakes*) | ⏳ Menunggu Fase 4 |
| **Workspace: Kuis (`quiz / study`)** | Latihan interaktif pilihan ganda dan isian, umpan balik langsung, skor instan | ⏳ Menunggu Fase 4 |
| **Workspace: Latihan (`practice / matching`)** | Latihan mencocokkan kata (matching drill), penguatan memori | ⏳ Menunggu Fase 4 |
| **Workspace: Membaca (`reading / habit`)** | Pembaca teks HABIT dengan estimasi waktu baca, tracking selesai, kuis pemahaman bacaan | ⏳ Menunggu Fase 4 |
| **Workspace: Petualangan (`adventure`)** | Hub cerita interaktif, percakapan situasional, latihan mendengarkan dan pengucapan | ⏳ Menunggu Fase 4 |
| **Workspace: Review (`review`)** | Spaced repetition queue, kartu review kata yang perlu diulang, jurnal kesalahan | ⏳ Menunggu Fase 4 |
| **Workspace: Diagnostik (`placement`)** | Tes diagnostik level awal pengguna (A1 sampai B2) dengan rekomendasi topik | ⏳ Menunggu Fase 4 |
| **Workspace: Progres (`progress`)** | Statistik total kata dipelajari, level mastery, grafik aktivitas, streak | ⏳ Menunggu Fase 4 |
| **Workspace: Pengaturan & Backup** | Ekspor progress ke file JSON, Impor file backup JSON, reset data lokal | ⏳ Menunggu Fase 4 |

---

## 3. Paritas Fungsional & Logika Bisnis

| Fungsionalitas | Spesifikasi | Status di V2 |
|---|---|---|
| **Storage Local-First** | IndexedDB utama (`sinauu-english-v1`) dengan auto-fallback `localStorage` | ⏳ Menunggu Fase 3 |
| **Tanpa Layanan Berbayar** | Berjalan 100% di browser tanpa backend/server database eksternal | ⏳ Menunggu Fase 3 |
| **Akses Langsung Tanpa Paksaan Login** | Pengguna langsung masuk ruang belajar tanpa hambatan login cloud | ⏳ Menunggu Fase 3 |
| **Ekspor & Impor Cadangan** | File format JSON valid schema version 1, interoperabel dengan V1 | ⏳ Menunggu Fase 3 |
| **Spaced Repetition Algorithm** | Pengulangan interval berbasis performa jawaban | ⏳ Menunggu Fase 3 |
| **Audio Pronunciation** | Web Speech Synthesis API dengan fallback UK/US voice selection | ⏳ Menunggu Fase 3 |
| **Microphone Recognition** | Analisis lokal untuk latihan Pronunciation Studio | ⏳ Menunggu Fase 3 |
| **Toggle Dark/Light Mode** | State tema tersimpan dan sinkron antar halaman | ⏳ Menunggu Fase 2 |

---

## 4. Kriteria Kelulusan Akhir
Setiap item di atas wajib bertanda **LULUS (Passed)** pada Fase 5 QA sebelum proyek dinyatakan siap dideploy.

