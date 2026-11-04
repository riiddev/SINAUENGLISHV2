import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

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

  const mainRef = useRef(null);
  const heroLinesRef = useRef([]);
  const methodStepsRef = useRef([]);
  const statsCountersRef = useRef([]);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    if (isReduced) {
      // Direct visibility without animation
      return;
    }

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // -----------------------------------------------------------------------
      // 2. HERO ANIMATION (Masked Text + Staggered UI)
      // -----------------------------------------------------------------------
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (heroLinesRef.current.length > 0) {
        heroTl.from(heroLinesRef.current, {
          yPercent: 110,
          duration: 0.95,
          stagger: 0.08,
          clearProps: "transform"
        });
      }

      heroTl.from(
        "#hero-subtitle",
        {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "all"
        },
        "-=0.55"
      );

      heroTl.from(
        "#hero-cta-group",
        {
          opacity: 0,
          y: 20,
          duration: 0.65,
          ease: "power3.out",
          clearProps: "all"
        },
        "-=0.45"
      );

      heroTl.from(
        "#specimen-card",
        {
          opacity: 0,
          y: 36,
          scale: 0.98,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "all"
        },
        "-=0.6"
      );

      // Subtle parallax on specimen card
      if (!isMobile) {
        gsap.to("#specimen-card", {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // -----------------------------------------------------------------------
      // 3. PINNED SECTION: 3-STEP METHODOLOGY
      // -----------------------------------------------------------------------
      const methodCards = methodStepsRef.current.filter(Boolean);

      if (!isMobile && methodCards.length === 3) {
        // Desktop pinned scroll sequence
        const pinTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#pendekatan",
            start: "top 12%",
            end: "+=1200",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1
          }
        });

        // Set initial card states
        gsap.set(methodCards[0], { opacity: 1, scale: 1 });
        gsap.set(methodCards.slice(1), { opacity: 0.45, scale: 0.97 });

        // Highlight step 2
        pinTimeline.to(methodCards[0], { opacity: 0.45, scale: 0.97, duration: 1 }, 1);
        pinTimeline.to(methodCards[1], { opacity: 1, scale: 1.02, boxShadow: "0 12px 24px rgba(0,0,0,0.1)", duration: 1 }, 1);

        // Highlight step 3
        pinTimeline.to(methodCards[1], { opacity: 0.45, scale: 0.97, boxShadow: "none", duration: 1 }, 2);
        pinTimeline.to(methodCards[2], { opacity: 1, scale: 1.02, boxShadow: "0 12px 24px rgba(0,0,0,0.1)", duration: 1 }, 2);
      } else {
        // Mobile smooth staggered batch
        ScrollTrigger.batch(methodCards, {
          start: "top 85%",
          onEnter: (batch) => {
            gsap.from(batch, {
              opacity: 0,
              y: 44,
              scale: 0.98,
              stagger: 0.12,
              duration: 0.75,
              ease: "power3.out",
              clearProps: "all"
            });
          },
          once: true
        });
      }

      // -----------------------------------------------------------------------
      // 4. SECTION HEADERS & LINE DRAWING
      // -----------------------------------------------------------------------
      gsap.utils.toArray(".section-header").forEach((header) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: "top 84%",
            once: true
          },
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all"
        });
      });

      // SVG dynamic stroke drawing for decor divider
      const decorLine = document.querySelector("#decor-scroll-path");
      if (decorLine) {
        gsap.fromTo(
          decorLine,
          { strokeDashoffset: 600 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#materi",
              start: "top 75%",
              end: "bottom 80%",
              scrub: 1
            }
          }
        );
      }

      // -----------------------------------------------------------------------
      // 5. MATERIAL CARDS STAGGERED BATCH REVEAL
      // -----------------------------------------------------------------------
      ScrollTrigger.batch(".material-card", {
        start: "top 82%",
        onEnter: (batch) => {
          gsap.from(batch, {
            opacity: 0,
            y: 56,
            scale: 0.97,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all"
          });
        },
        once: true
      });

      // -----------------------------------------------------------------------
      // 6. DYNAMIC NUMBER COUNTERS (2.971, 19, 156, 63.309)
      // -----------------------------------------------------------------------
      statsCountersRef.current.filter(Boolean).forEach((counterEl) => {
        const targetVal = parseFloat(counterEl.dataset.target || "0");
        const isDecimalThousand = counterEl.dataset.format === "thousand";
        const valObj = { val: 0 };

        ScrollTrigger.create({
          trigger: counterEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(valObj, {
              val: targetVal,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                if (isDecimalThousand) {
                  counterEl.innerText = Math.round(valObj.val).toLocaleString("id-ID");
                } else {
                  counterEl.innerText = Math.round(valObj.val).toString();
                }
              }
            });
          }
        });
      });

      // Refresh ScrollTrigger when fonts load
      if (document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    }, mainRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={mainRef}>
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="container" id="hero-section" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-10)", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", letterSpacing: "-0.025em", marginBottom: "var(--space-4)" }}>
                <span className="hero-line-mask">
                  <span className="hero-line-inner" ref={(el) => (heroLinesRef.current[0] = el)}>
                    Kata baru
                  </span>
                </span>
                <span className="hero-line-mask">
                  <span className="hero-line-inner" ref={(el) => (heroLinesRef.current[1] = el)}>
                    belum jadi
                  </span>
                </span>
                <span className="hero-line-mask">
                  <span
                    className="hero-line-inner"
                    ref={(el) => (heroLinesRef.current[2] = el)}
                    style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--color-accent-gold)" }}
                  >
                    milikmu.
                  </span>
                </span>
              </h1>

              <p
                id="hero-subtitle"
                style={{ fontSize: "var(--text-md)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-6)", maxWidth: "520px" }}
              >
                Mengetahui arti terjemahan belum tentu tahu cara memakainya. Amati kata dalam kalimat nyata, bedakan nuansanya, dan kunci ingatanmu dengan spaced repetition yang terstruktur.
              </p>

              <div id="hero-cta-group" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-6)" }}>
                <Link className="btn btn-primary btn-lg" to="/belajar" style={{ minHeight: "44px" }}>
                  Mulai Belajar Sekarang ↗
                </Link>
                <a className="btn btn-secondary btn-lg" href="#materi" style={{ minHeight: "44px" }}>
                  Lihat Peta Materi
                </a>
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
                    aria-label="Dengarkan pengucapan audio"
                    title="Dengarkan pengucapan audio"
                    style={{ width: "44px", height: "44px", borderRadius: "var(--radius-pill)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>

                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                  {currentSpecimen.ipa}
                </p>

                <div style={{ backgroundColor: "var(--color-bg-surface)", border: "var(--border-sm)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
                    Makna Bahasa Indonesia
                  </span>
                  <p style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--color-text-primary)", marginTop: "4px", marginBottom: 0 }}>
                    {currentSpecimen.meaning}
                  </p>
                </div>

                <div style={{ backgroundColor: "var(--color-bg-surface)", border: "var(--border-sm)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-5)" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
                    Contoh dalam Kalimat
                  </span>
                  <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", marginTop: "4px", marginBottom: "2px" }}>
                    {currentSpecimen.exampleEn}
                  </p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 0, fontStyle: "italic" }}>
                    {currentSpecimen.exampleId}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                  <button className="btn btn-outline btn-sm" type="button" onClick={cycleSpecimen} style={{ minHeight: "44px" }}>
                    Ganti Contoh Kata ↻
                  </button>
                  <Link className="btn btn-primary btn-sm" to="/belajar/vocabulary" style={{ minHeight: "44px" }}>
                    Coba Latihan ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Methodology Section (Pinned Scroll Experience) */}
        <section className="container" id="pendekatan" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div className="section-header" style={{ textAlign: "center", maxWidth: "680px", marginLeft: "auto", marginRight: "auto", marginBottom: "var(--space-8)" }}>
            <h2 className="section-title">Dari sekadar tahu arti, jadi reflek bicara.</h2>
            <p className="section-desc" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Metode belajar 3 tahap yang memastikan setiap kata yang kamu pelajari melekat dalam memori jangka panjang.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            <div className="card card-tint-sand" ref={(el) => (methodStepsRef.current[0] = el)} style={{ transition: "all 0.3s ease" }}>
              <span className="badge badge-gold" style={{ marginBottom: "var(--space-3)" }}>01 · Makna Utuh</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Pahami Arti Tepat</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                Bukan sekadar hafalan kamus 1-kata. Pelajari batasan makna kata dan bagian tutur kata (noun, verb, adj) dengan definisi kontekstual yang jelas.
              </p>
            </div>

            <div className="card card-tint-sage" ref={(el) => (methodStepsRef.current[1] = el)} style={{ transition: "all 0.3s ease" }}>
              <span className="badge badge-sage" style={{ marginBottom: "var(--space-3)" }}>02 · Konteks Nyata</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Amati dalam Kalimat</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                Lihat bagaimana penutur asli memakai kata tersebut dalam kalimat sehari-hari, serial petualangan interaktif, dan materi bacaan HABIT.
              </p>
            </div>

            <div className="card card-tint-slate" ref={(el) => (methodStepsRef.current[2] = el)} style={{ transition: "all 0.3s ease" }}>
              <span className="badge badge-navy" style={{ marginBottom: "var(--space-3)" }}>03 · Ingatan Bertahan</span>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Spaced Repetition (SRS)</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                Sistem menjadwalkan review pada interval 1, 3, 8, 16, hingga 30 hari tepat sebelum kamu lupa, mengunci kata ke memori aktifmu.
              </p>
            </div>
          </div>
        </section>

        {/* Decorative SVG Line Divider */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 var(--space-4)", overflow: "hidden" }}>
          <svg width="100%" height="24" viewBox="0 0 800 24" fill="none">
            <path
              id="decor-scroll-path"
              d="M0 12 Q 200 24, 400 12 T 800 12"
              stroke="var(--color-accent-gold)"
              strokeWidth="2"
              strokeDasharray="600"
              strokeDashoffset="600"
            />
          </svg>
        </div>

        {/* Material Map Section */}
        <section className="container" id="materi" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-16)" }}>
          <div className="section-header" style={{ marginBottom: "var(--space-8)" }}>
            <h2 className="section-title">Peta Materi Belajar</h2>
            <p className="section-desc">Semua materi tersusun bertingkat sesuai standar CEFR (A1 Pemula hingga B2 Mahir).</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-6)" }}>
            <div className="card card-interactive material-card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-3)" }}>
                <span className="badge badge-gold">
                  <span ref={(el) => (statsCountersRef.current[0] = el)} data-target="2971" data-format="thousand">
                    2.971
                  </span>{" "}
                  KATA
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Oxford 3000 Corpus</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", lineHeight: 1.6 }}>
                Kosakata American English terpenting level A1, A2, B1, dan B2 lengkap dengan audio dan kalimat contoh autentik.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/vocabulary" style={{ minHeight: "44px" }}>
                Buka Kosakata ↗
              </Link>
            </div>

            <div className="card card-interactive material-card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-3)" }}>
                <span className="badge badge-navy">
                  <span ref={(el) => (statsCountersRef.current[1] = el)} data-target="19" data-format="number">
                    19
                  </span>{" "}
                  TOPIK
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Kurikulum Grammar</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", lineHeight: 1.6 }}>
                Pola kalimat tenses, modal verbs, passive voice, hingga conditional sentences dengan 57 kuis interaktif terstruktur.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/grammar" style={{ minHeight: "44px" }}>
                Buka Grammar ↗
              </Link>
            </div>

            <div className="card card-interactive material-card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-3)" }}>
                <span className="badge badge-sage">
                  <span ref={(el) => (statsCountersRef.current[2] = el)} data-target="156" data-format="number">
                    156
                  </span>{" "}
                  BACAAN
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>HABIT Reading Library</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", lineHeight: 1.6 }}>
                <span ref={(el) => (statsCountersRef.current[3] = el)} data-target="63309" data-format="thousand">
                  63.309
                </span>{" "}
                kata bacaan berbobot untuk membangun intuisi membaca cepat dan melatih fokus pemahaman mendalam.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/reading" style={{ minHeight: "44px" }}>
                Buka Bacaan ↗
              </Link>
            </div>

            <div className="card card-interactive material-card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-3)" }}>
                <span className="badge badge-rose">10 CERITA SERIAL</span>
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>Everyday Adventure</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", lineHeight: 1.6 }}>
                Serial petualangan interaktif 10 cerita × 10 episode, simulasi dialog situasi nyata, dan studio pelafalan berpandu.
              </p>
              <Link className="btn btn-secondary btn-sm" to="/belajar/adventure" style={{ minHeight: "44px" }}>
                Mulai Petualangan ↗
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="container" style={{ paddingBottom: "var(--space-20)" }}>
          <div className="card card-tint-sand" style={{ textAlign: "center", padding: "var(--space-12) var(--space-6)" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, var(--text-4xl))", marginBottom: "var(--space-3)" }}>
              Mulai Belajar Hari Ini
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-md)", maxWidth: "560px", margin: "0 auto var(--space-6)", lineHeight: 1.6 }}>
              Tidak perlu biaya langganan. Langsung buka ruang belajar dan lanjutkan kemajuan belajarmu kapan saja.
            </p>
            <Link className="btn btn-primary btn-lg" to="/belajar" style={{ minHeight: "44px" }}>
              Buka Ruang Belajar Sekarang ↗
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
