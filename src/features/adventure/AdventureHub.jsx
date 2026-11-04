import React, { useState } from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { useSpeech } from "../../hooks/useSpeech.js";

export function AdventureHub({ stories = [], dialogues = [], listening = [], pronunciation = [] }) {
  const [activeTab, setActiveTab] = useState("stories");
  const [activeItem, setActiveItem] = useState(null);
  const [itemType, setItemType] = useState("story");
  const { speak } = useSpeech();

  const handleOpenItem = (item, type) => {
    setActiveItem(item);
    setItemType(type);
  };

  const handleCloseModal = () => {
    setActiveItem(null);
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h2 className="section-title">Petualangan Bahasa Inggris Terapan</h2>
        <p className="section-desc">
          Kembangkan keterampilan berbicara, menyimak percakapan nyata, dan ketepatan pelafalan aksen.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {[
            { id: "stories", label: `Cerita Cerita (${stories.length})` },
            { id: "dialogues", label: `Dialog Sehari-hari (${dialogues.length})` },
            { id: "listening", label: `Laboratorium Menyimak (${listening.length})` },
            { id: "pronunciation", label: `Studio Pelafalan (${pronunciation.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setActiveItem(null);
              }}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-full)",
                border: "var(--border-sm)",
                backgroundColor: activeTab === tab.id ? "var(--color-accent-gold)" : "var(--color-bg-surface)",
                color: activeTab === tab.id ? "#1A1A1A" : "var(--color-text-primary)",
                boxShadow: activeTab === tab.id ? "var(--shadow-flat)" : "none",
                cursor: "pointer",
                minHeight: "44px"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Tab */}
      {activeTab === "stories" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {stories.map((s) => (
            <div
              key={s.id}
              className="card card-interactive"
              onClick={() => handleOpenItem(s, "story")}
              id={`story-card-${s.id}`}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="navy">{s.level || "A2"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)" }}>
                  {s.estimatedMinutes || 5} Menit
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{s.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {s.subtitle || (s.paragraphs && s.paragraphs[0]?.slice(0, 90) + "...") || "Cerita bersambung dengan kosakata sehari-hari."}
              </p>
              <div style={{ marginTop: "var(--space-4)", textAlign: "right" }}>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>Buka Cerita ↗</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogues Tab */}
      {activeTab === "dialogues" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {dialogues.map((d) => (
            <div
              key={d.id}
              className="card card-interactive"
              onClick={() => handleOpenItem(d, "dialogue")}
              id={`dialogue-card-${d.id}`}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="gold">{d.level || "B1"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{d.turns?.length || 4} Percakapan</span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{d.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {d.scenario || "Simulasi dialog situasi nyata."}
              </p>
              <div style={{ marginTop: "var(--space-4)", textAlign: "right" }}>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>Buka Latihan Dialog ↗</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listening Tab */}
      {activeTab === "listening" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {listening.map((l) => (
            <div
              key={l.id}
              className="card card-interactive"
              onClick={() => handleOpenItem(l, "listening")}
              id={`listening-card-${l.id}`}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="sage">{l.level || "A2"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{l.questions?.length || 3} Pertanyaan</span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{l.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                {l.instructions || "Dengar audio lalu uji pemahaman pesan utama."}
              </p>
              <div style={{ marginTop: "var(--space-4)", textAlign: "right" }}>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>Mulai Menyimak ↗</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pronunciation Tab */}
      {activeTab === "pronunciation" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {pronunciation.map((p) => (
            <div
              key={p.id}
              className="card card-interactive"
              onClick={() => speak(p.phrase || p.targetWord)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="navy">{p.level || "A1"}</Badge>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  Dengar Pelafalan
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-1)" }}>{p.phrase || p.targetWord}</h3>
              {p.ipa && <p style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", margin: "0 0 4px 0" }}>/{p.ipa}/</p>}
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0 }}>{p.notes || p.focusRule}</p>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL & PREVIEW DIALOG */}
      {activeItem && (
        <div
          className="modal-overlay is-open"
          id="adventure-modal-overlay"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="adventure-modal-title"
        >
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "640px", width: "92%", maxHeight: "85vh", overflowY: "auto", padding: "var(--space-6)" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <Badge variant="gold">{activeItem.level || "A2"}</Badge>
                <span className="badge badge-tint" style={{ fontWeight: 700 }}>
                  {itemType === "story" ? "SERIAL CERITA" : itemType === "dialogue" ? "DIALOG" : "LABORATORIUM MENYIMAK"}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-icon"
                onClick={handleCloseModal}
                id="close-adventure-modal-btn"
                aria-label="Tutup pratinjau petualangan"
                style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", borderRadius: "var(--radius-pill)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <h2 id="adventure-modal-title" style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>
              {activeItem.title}
            </h2>

            {activeItem.subtitle && (
              <p style={{ fontStyle: "italic", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                {activeItem.subtitle}
              </p>
            )}

            {/* Upcoming Tahap 6 Roadmap Notice */}
            <div
              className="card card-tint-sand"
              style={{
                padding: "var(--space-4)",
                marginBottom: "var(--space-5)",
                borderLeft: "4px solid var(--color-accent-gold)"
              }}
            >
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-accent-gold)" }}>
                Informasi Modul Petualangan
              </span>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                Serial Petualangan Interaktif <strong>10 Cerita × 10 Episode</strong> dengan sistem storytelling harian dan dialog bersambung sedang disiapkan (Segera Hadir di Tahap 6). Di bawah ini kamu dapat mempelajari teks latihan pratinjau.
              </p>
            </div>

            {/* Content Display */}
            {itemType === "story" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                  <h4 style={{ margin: 0, fontSize: "var(--text-md)" }}>Naskah Cerita</h4>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => speak(activeItem.paragraphs?.join(" ") || activeItem.title)}
                    style={{ minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    Dengarkan Narasi
                  </button>
                </div>

                {activeItem.paragraphs?.map((p, idx) => (
                  <p key={idx} style={{ lineHeight: 1.7, fontSize: "var(--text-sm)", marginBottom: "var(--space-3)", color: "var(--color-text-primary)" }}>
                    {p}
                  </p>
                ))}

                {activeItem.focusWords && activeItem.focusWords.length > 0 && (
                  <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "var(--border-sm)" }}>
                    <h5 style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
                      Kosakata Kunci
                    </h5>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {activeItem.focusWords.map((fw, fIdx) => (
                        <span key={fIdx} className="badge badge-sage" style={{ fontSize: "var(--text-xs)" }}>
                          <strong>{fw.word}</strong>: {fw.meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {itemType === "dialogue" && (
              <div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                  {activeItem.scenario}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {activeItem.turns?.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "var(--space-3)",
                        backgroundColor: idx % 2 === 0 ? "var(--color-bg-subtle)" : "var(--color-bg-surface)",
                        borderRadius: "var(--radius-md)",
                        border: "var(--border-sm)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-navy)" }}>{t.speaker}</strong>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon"
                          onClick={() => speak(t.en)}
                          aria-label={`Dengar ucapan ${t.speaker}`}
                          style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", borderRadius: "var(--radius-pill)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          </svg>
                        </button>
                      </div>
                      <p style={{ fontWeight: 600, fontSize: "var(--text-sm)", margin: "0 0 2px 0" }}>{t.en}</p>
                      {t.id && <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: 0, fontStyle: "italic" }}>{t.id}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itemType === "listening" && (
              <div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                  {activeItem.instructions}
                </p>
                <div style={{ textAlign: "center", padding: "var(--space-4)", backgroundColor: "var(--color-bg-subtle)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => speak(activeItem.audioTranscript || activeItem.title)}
                    style={{ minHeight: "44px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    Putar Audio Latihan
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ marginTop: "var(--space-6)", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCloseModal}
                style={{ minHeight: "44px", minWidth: "100px" }}
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
