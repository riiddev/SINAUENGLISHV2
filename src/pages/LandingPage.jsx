import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { Button } from "../components/common/Button.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { useSpeech } from "../hooks/useSpeech.js";

export function LandingPage() {
  const { speak } = useSpeech();
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main id="main-content">
        {/* HERO SECTION */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            paddingBottom: "var(--space-16)",
            borderBottom: "var(--border-sm)"
          }}
        >
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "var(--space-10)",
                alignItems: "center"
              }}
            >
              <div>
                <span className="section-eyebrow">SinauEnglish V2 · Metode Berjeda</span>
                <h1
                  style={{
                    fontSize: "var(--text-5xl)",
                    lineHeight: 1.06,
                    letterSpacing: "-0.025em",
                    marginBottom: "var(--space-4)"
                  }}
                >
                  Kata baru<br />belum jadi<br />
                  <em style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--color-accent-gold)" }}>
                    milikmu.
                  </em>
                </h1>
                <p
                  style={{
                    fontSize: "var(--text-md)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "var(--space-6)",
                    maxWidth: "520px"
                  }}
                >
                  Menghafal arti kamus saja tidak menjamin kamu bisa memakainya saat berbicara. Amati kata dalam kalimat nyata, bedakan nuansanya, dan kunci ingatanmu lewat sistem interval Google Spreadsheet.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-6)" }}>
                  <Link to="/belajar">
                    <Button variant="primary" size="lg">
                      Mulai Belajar Sekarang ↗
                    </Button>
                  </Link>
                  <a href="#materi">
                    <Button variant="secondary" size="lg">
                      Lihat Peta Materi
                    </Button>
                  </a>
                </div>

                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 600 }}>
                  ✓ 100% Gratis &nbsp;·&nbsp; ✓ Tanpa Layanan Berbayar &nbsp;·&nbsp; ✓ Tersimpan di Google Spreadsheet
                </p>
              </div>

              {/* INTERACTIVE SPECIMEN CARD */}
              <div>
                <div
                  className="card card-tint-sand"
                  style={{
                    padding: "var(--space-8)",
                    border: "var(--border-md)",
                    boxShadow: "6px 6px 0 var(--border-color)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                    <Badge variant="navy">LEVEL A2 · ELEMENTARY</Badge>
                    <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                      KATA #184 DARI 2.971
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-1)" }}>
                    <h2 style={{ fontSize: "var(--text-4xl)", margin: 0 }}>deliberate</h2>
                    <button
                      type="button"
                      onClick={() => speak("deliberate")}
                      aria-label="Dengar pengucapan deliberate"
                      style={{
                        padding: "4px 8px",
                        fontSize: "var(--text-sm)",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--color-bg-surface)",
                        border: "var(--border-sm)"
                      }}
                    >
                      🔊 Dengar
                    </button>
                  </div>

                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "var(--space-3)" }}>
                    /dɪˈlɪb.ər.ət/ · kata sifat (adjective)
                  </span>

                  <p style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--color-accent-navy)", marginBottom: "var(--space-4)" }}>
                    Sengaja, terencana, dilakukan dengan penuh pertimbangan sadar.
                  </p>

                  <div
                    style={{
                      backgroundColor: "var(--color-bg-surface)",
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      border: "var(--border-sm)",
                      marginBottom: "var(--space-6)"
                    }}
                  >
                    <strong style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", display: "block", color: "var(--color-text-muted)", marginBottom: "2px" }}>
                      Konteks Nyata:
                    </strong>
                    <p style={{ fontSize: "var(--text-sm)", fontStyle: "italic", margin: "0 0 2px 0" }}>
                      "It wasn’t an accident; it was a deliberate choice."
                    </p>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      (Itu bukan kecelakaan; itu adalah pilihan yang disengaja.)
                    </span>
                  </div>

                  <Link to="/belajar/study">
                    <Button variant="primary" style={{ width: "100%" }}>
                      Uji Pemahaman Kata Ini ↗
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PINNED / STORYTELLING SECTION: 3 LANGKAH BELAJAR BERBOBOT */}
        <section
          id="pendekatan"
          style={{
            paddingBlock: "var(--space-16)",
            backgroundColor: "var(--color-bg-subtle)",
            borderBottom: "var(--border-sm)"
          }}
        >
          <div className="container">
            <div style={{ maxWidth: "600px", marginBottom: "var(--space-10)" }}>
              <span className="section-eyebrow">Alur Metodologi</span>
              <h2 className="section-title">Cara Belajar di SINAUENGLISH</h2>
              <p className="section-desc">
                Kami merancang proses belajar 3 tahap berjenjang agar kosakata tidak sekadar diingat 5 menit lalu lupa esok harinya.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "var(--space-6)"
              }}
            >
              {[
                {
                  step: "01",
                  title: "Amati Makna Inti",
                  desc: "Pahami definisi esensial kata dalam bahasa Indonesia beserta transkripsi fonetik IPA dan padanan nuansanya.",
                  tint: "sand"
                },
                {
                  step: "02",
                  title: "Uji Pemakaian Kalimat",
                  desc: "Jawab kuis kontekstual dengan melengkapi kalimat rumpang otentik untuk membedakan kolokasi yang tepat.",
                  tint: "sage"
                },
                {
                  step: "03",
                  title: "Kunci Spaced Repetition",
                  desc: "Interval adaptif [1, 3, 8, 16, 30] hari mengunci memori jangka panjang dan otomatis tersimpan di Google Spreadsheet.",
                  tint: "slate"
                }
              ].map((item) => (
                <div
                  key={item.step}
                  className={`card card-tint-${item.tint}`}
                  style={{
                    padding: "var(--space-8)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "var(--text-3xl)",
                        fontWeight: 700,
                        color: "var(--color-accent-navy)",
                        display: "block",
                        marginBottom: "var(--space-3)"
                      }}
                    >
                      {item.step}
                    </span>
                    <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MATERIAL MAP SECTION */}
        <section
          id="materi"
          style={{
            paddingBlock: "var(--space-16)"
          }}
        >
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto var(--space-10) auto" }}>
              <span className="section-eyebrow">Kurikulum Lengkap</span>
              <h2 className="section-title">Peta Korpus Materi</h2>
              <p className="section-desc" style={{ marginInline: "auto" }}>
                Semua materi dirancang berjenjang dari level dasar (A1) hingga mahir (B2) dengan data yang tervalidasi.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "var(--space-6)"
              }}
            >
              <div className="card card-tint-sand" style={{ padding: "var(--space-6)" }}>
                <span className="badge badge-gold" style={{ marginBottom: "var(--space-3)" }}>KOSAKATA</span>
                <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>2.971 Kata</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 var(--space-4) 0" }}>
                  American Oxford 3000 lengkap dengan arti Indonesia, contoh pemakaian, dan audio pelafalan.
                </p>
                <Link to="/belajar/vocabulary">
                  <Button size="sm" variant="secondary">Jelajahi Kosakata ↗</Button>
                </Link>
              </div>

              <div className="card card-tint-slate" style={{ padding: "var(--space-6)" }}>
                <span className="badge badge-navy" style={{ marginBottom: "var(--space-3)" }}>GRAMMAR</span>
                <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>19 Topik</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 var(--space-4) 0" }}>
                  Panduan rumus pola kalimat, penjelasan bilingual, serta 57 soal kuis evaluasi.
                </p>
                <Link to="/belajar/grammar">
                  <Button size="sm" variant="secondary">Buka Modul Grammar ↗</Button>
                </Link>
              </div>

              <div className="card card-tint-sage" style={{ padding: "var(--space-6)" }}>
                <span className="badge badge-sage" style={{ marginBottom: "var(--space-3)" }}>MEMBACA</span>
                <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>156 Teks HABIT</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 var(--space-4) 0" }}>
                  63.309 kata bacaan bahasa Inggris seputar sains, sejarah, budaya, dan teknologi.
                </p>
                <Link to="/belajar/reading">
                  <Button size="sm" variant="secondary">Buka Perpustakaan ↗</Button>
                </Link>
              </div>

              <div className="card card-tint-rose" style={{ padding: "var(--space-6)" }}>
                <span className="badge badge-due" style={{ marginBottom: "var(--space-3)" }}>PETUALANGAN</span>
                <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>Everyday Series</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 var(--space-4) 0" }}>
                  8 cerita bersambung, 4 simulasi percakapan dialog, menyimak, dan studio pelafalan.
                </p>
                <Link to="/belajar/adventure">
                  <Button size="sm" variant="secondary">Mulai Petualangan ↗</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

