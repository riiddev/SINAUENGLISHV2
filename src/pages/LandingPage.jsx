import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

const SPECIMENS = [
  {
    word: "notice",
    ipa: "/ˈnoʊ.tɪs/ · US English",
    part: "VERB · LEVEL A2",
    meaning: "melihat, memperhatikan, menyadari",
    exampleEn: "Did you notice anything unusual about him today?",
    exampleId: "Apakah kamu memperhatikan sesuatu yang aneh tentangnya hari ini?"
  },
  {
    word: "crucial",
    ipa: "/ˈkruː.ʃəl/ · US English",
    part: "ADJECTIVE · LEVEL B1",
    meaning: "sangat penting, menentukan, krusial",
    exampleEn: "Early diagnostic tests played a crucial role in his recovery.",
    exampleId: "Tes diagnostik dini memainkan peran yang sangat penting dalam pemulihannya."
  },
  {
    word: "acquire",
    ipa: "/əˈkwaɪ.ɚ/ · US English",
    part: "VERB · LEVEL B2",
    meaning: "memperoleh, menguasai (keterampilan/kebiasaan)",
    exampleEn: "Children acquire their first language naturally through context.",
    exampleId: "Anak-anak menguasai bahasa pertama mereka secara alami melalui konteks."
  }
];

export function LandingPage() {
  const [specimenIndex, setSpecimenIndex] = useState(0);
  const currentSpecimen = SPECIMENS[specimenIndex];

  const cycleSpecimen = () => {
    setSpecimenIndex((prev) => (prev + 1) % SPECIMENS.length);
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div>
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="container" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-10)", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", lineHeight: 1.06, letterSpacing: "-0.025em", marginBottom: "var(--space-4)" }}>
                Kata baru<br />belum jadi<br /><em style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--color-accent-gold)" }}>milikmu.</em>
              </h1>
              <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-6)", maxWidth: "520px" }}>
                Mengetahui arti terjemahan belum tentu tahu cara memakainya. Amati kata dalam kalimat nyata, bedakan nuansanya, dan kunci ingatanmu dengan spaced repetition yang terstruktur.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-6)" }}>
                <Link className="btn btn-primary btn-lg" to="/belajar">Mulai Belajar Sekarang ↗</Link>
                <a className="btn btn-secondary btn-lg" href="#materi">Lihat Peta Materi</a>
              </div>
            </div>

            {/* Interactive Specimen Card */}
            <div>
              <div className="card card-tint-sand" id="specimen-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)", borderBottom: "1px dashed var(--color-border)", paddingBottom: "var(--space-2)" }}>
                  <span className="badge badge-gold">{currentSpecimen.part}</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)" }}>SPECIMEN KATA</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <h2 style={{ fontSize: "var(--text-4xl)", letterSpacing: "-0.02em", margin: 0 }}>
                    {currentSpecimen.word}<span style={{ color: "var(--color-accent-gold)" }}>.</span>
                  </h2>
                  <button
                    className="btn btn-secondary btn-icon"
                    type="button"
                    onClick={() => speak(currentSpecimen.word)}
                    aria-label="Dengarkan pengucapan"
                    title="Dengarkan pengucapan audio"
                    style={{ width: "40px", height: "40px", borderRadius: "var(--radius-pill)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>

                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                  {currentSpecimen.ipa}
                </p>

                <div style={{ backgroundColor: "var(--color-bg-surface)", border: "var(--border-sm)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>Makna Bahasa Indonesia</span>
                  <p style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--color-text-primary)", marginTop: "4px", marginBottom: 0 }}>
                    {currentSpecimen.meaning}
                  </p>
                </div>

                <div style={{ backgroundColor: "var(--color-bg-surface)", border: "var(--border-sm)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-5)" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>Contoh dalam Kalimat</span>
                  <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", marginTop: "4px", marginBottom: "2px" }}>
                    {currentSpecimen.exampleEn}
                  </p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 0, fontStyle: "italic" }}>
                    {currentSpecimen.exampleId}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                  <button className="btn btn-outline btn-sm" type="button" onClick={cycleSpecimen}>
                    Ganti Contoh Kata ↻
                  </button>
                  <Link className="btn btn-primary btn-sm" to="/belajar/vocabulary">
                    Coba Latihan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Methodology Section */}
        <section className="container" id="pendekatan" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div className="section-header" style={{ textAlign: "center", maxWidth: "680px", marginLeft: "auto", marginRight: "auto" }}>
            <h2 className="section-title">Dari sekadar tahu arti, jadi reflek bicara.</h2>
            <p className="section-desc" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Metode belajar terarah yang memastikan setiap kata yang kamu pelajari tidak lekas menguap.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            <div className="card card-tint-sand">
              <span className="badge badge-gold" style={{ marginBottom: "var(--space-3)" }}>01 · Makna Utuh</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Pahami Arti Tepat</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                Bukan sekadar hafalan kamus 1-kata. Pelajari batasan makna kata dan bagian tutur kata (noun, verb, adj) dengan definisi kontekstual.
              </p>
            </div>

            <div className="card card-tint-sage">
              <span className="badge badge-sage" style={{ marginBottom: "var(--space-3)" }}>02 · Konteks Nyata</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Amati dalam Kalimat</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                Lihat bagaimana penutur asli memakai kata tersebut dalam kalimat sehari-hari, cerita interaktif, dan materi bacaan HABIT.
              </p>
            </div>

            <div className="card card-tint-slate">
              <span className="badge badge-navy" style={{ marginBottom: "var(--space-3)" }}>03 · Ingatan Bertahan</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Spaced Repetition (SRS)</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                Sistem menjadwalkan review pada interval 1, 3, 8, 16, hingga 30 hari tepat sebelum kamu lupa, mengunci kata ke memori jangka panjangmu.
              </p>
            </div>
          </div>
        </section>

        {/* Material Map Section */}
        <section className="container" id="materi" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-16)" }}>
          <div className="section-header">
            <h2 className="section-title">Peta Materi Belajar</h2>
            <p className="section-desc">Semua materi tersusun bertingkat sesuai standar CEFR (A1 Pemula hingga B2 Mahir).</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-6)" }}>
            <div className="card card-interactive">
              <span className="badge badge-gold" style={{ marginBottom: "var(--space-3)" }}>2.971 KATA</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Oxford 3000 Corpus</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
                Kosakata American English terpenting level A1, A2, B1, dan B2 lengkap dengan audio dan contoh.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/vocabulary">Buka Kosakata ↗</Link>
            </div>

            <div className="card card-interactive">
              <span className="badge badge-navy" style={{ marginBottom: "var(--space-3)" }}>19 TOPIK</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Kurikulum Grammar</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
                Pola kalimat tenses, modal verbs, passive voice, hingga conditional sentences dengan 57 kuis interaktif.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/grammar">Buka Grammar ↗</Link>
            </div>

            <div className="card card-interactive">
              <span className="badge badge-sage" style={{ marginBottom: "var(--space-3)" }}>156 BACAAN</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>HABIT Reading Library</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
                63.309 kata bacaan berbobot untuk membangun intuisi membaca cepat dan melatih fokus pemahaman.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/reading">Buka Bacaan ↗</Link>
            </div>

            <div className="card card-interactive">
              <span className="badge badge-rose" style={{ marginBottom: "var(--space-3)" }}>PETUALANGAN</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Everyday Adventure</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
                8 cerita bersambung, 4 roleplay dialog, Listening Lab, serta Pronunciation Studio berpandu.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/adventure">Mulai Petualangan ↗</Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="container" style={{ paddingBottom: "var(--space-20)" }}>
          <div className="card card-tint-sand" style={{ textAlign: "center", padding: "var(--space-12) var(--space-6)" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, var(--text-4xl))", marginBottom: "var(--space-3)" }}>Mulai Belajar Hari Ini</h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-md)", maxWidth: "560px", margin: "0 auto var(--space-6)" }}>
              Tidak perlu biaya langganan. Langsung buka ruang belajar dan lanjutkan kemajuanmu kapan saja.
            </p>
            <Link className="btn btn-primary btn-lg" to="/belajar">Buka Ruang Belajar Sekarang ↗</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
