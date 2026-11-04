# SINAUENGLISH V2

Website belajar bahasa Inggris modern bergaya *Warm Editorial Neobrutalism* (terinspirasi dari bahasa visual themainideas.com), dirancang khusus untuk pelajar Indonesia dari level pemula hingga menengah atas (CEFR A1–C1).

---

## 🌟 Fitur Utama
- **Corpus Kosakata Oxford 3000 Lengkap:** 2.971 headwords unik dengan makna bahasa Indonesia, bagian kata (*part of speech*), fonetik IPA, dan contoh kontekstual.
- **Kurikulum Grammar Komprehensif:** 19 topik pelajaran bertingkat dari A1 sampai B2 dengan rumus pola, contoh kalimat bilingual, dan panduan kesalahan umum (*common mistakes*).
- **Latihan & Kuis Interaktif:** Bank 57+ soal kuis tervalidasi, matching drill, dan sesi belajar 3 tahap (*Makna → Konteks → Ingatan*).
- **Sistem Spaced Repetition (SRS) & Mistake Review:** Pengulangan berkala otomatis untuk mengunci memori jangka panjang dan jurnal evaluasi kesalahan.
- **HABIT Reading Library:** 156 bacaan berbobot (63.309 kata) untuk melatih kelancaran membaca dan pemahaman teks.
- **Everyday Adventure Series:** Cerita tematik (*Everyday Stories*), percakapan terpandu (*Everyday English*), latihan menyimak (*Listening Lab*), dan studio pengucapan (*Pronunciation Studio*).
- **100% Bebas Biaya & Local-First:** Berjalan murni di sisi browser tanpa server berbayar. Penyimpanan menggunakan IndexedDB lokal dengan fallback localStorage serta fitur ekspor/impor cadangan format JSON.

---

## 🎨 Design System
Dibangun dengan prinsip *Warm Editorial Neobrutalism*:
- **Tipografi Google Fonts:** `Space Grotesk` (Headings & Stats), `Fraunces` (Editorial Quotes), dan `Quicksand` (Body & Komponen Interaktif).
- **Palet Warna:** *Warm Parchment* (`#F4F0E8`), *Deep Charcoal Ink* (`#1A1A1A`), *Ochre Gold* (`#C99A3B`), *Slate Navy* (`#4B5E73`), dan *Sage Green* (`#5F7A4B`).
- **Komponen:** Border tegas 1px/2px, *hard offset shadow* 4px/6px tanpa blur, pill buttons (`9999px`), dan kartu dengan radius `20px`.
- **Dukungan Dark Mode:** Palet *Warm Espresso Night* yang nyaman di mata untuk sesi belajar malam hari.

---

## 🚀 Memulai (Local Development)

### Prasyarat
- Node.js `>= 22.12.0`
- Git

### Menjalankan Server Lokal
```bash
# Install dependensi
npm install

# Jalankan dev server lokal
npm run dev

# Jalankan typecheck dan build untuk produksi
npm run build

# Menjalankan audit konten dan paritas data
npm run test:content
```

---

## 📁 Struktur Direktori
```text
SINAUENGLISHV2/
├── data/                  # Sumber data statis (Oxford 3000, Grammar, Reading, Adventure)
├── docs/                  # Dokumentasi audit V1, checklist paritas, ADR, design tokens
├── public/                # Aset statis publik, icons, manifest
├── scripts/               # Script audit konten & verifikasi data
├── src/
│   ├── components/        # Komponen UI modular
│   ├── lib/               # Layanan state, IndexedDB, SRS, audio TTS
│   └── styles/            # Design system, CSS variables, tema, dan utilitas
├── index.html             # Landing page publik
├── belajar.html           # Ruang belajar interaktif (workspace)
├── package.json           # Dependensi & script build
└── prd.md                 # Product Requirement Document
```

---

## 📜 Lisensi & Atribusi
- Data kosakata diadaptasi dari Oxford 3000 dan diperkaya dari kamus KOReader en-id (CC-BY-SA-4.0).
- Desain visual terinspirasi dari pola layout publik themainideas.com tanpa menyalin aset berhak cipta.
