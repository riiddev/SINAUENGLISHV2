import React, { useState } from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { Button } from "../../components/common/Button.jsx";
import { useSpeech } from "../../hooks/useSpeech.js";

export function AdventureHub({ stories = [], dialogues = [], listening = [], pronunciation = [] }) {
  const [activeTab, setActiveTab] = useState("stories");
  const [activeItem, setActiveItem] = useState(null);
  const { speak } = useSpeech();

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
                cursor: "pointer"
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
            <div key={s.id} className="card card-interactive" onClick={() => setActiveItem(s)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="navy">{s.level || "A2"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)" }}>
                  {s.category || "Everyday Story"}
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{s.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {s.description || "Cerita bersambung dengan kosakata sehari-hari."}
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
            <div key={d.id} className="card card-interactive" onClick={() => setActiveItem(d)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="gold">{d.level || "B1"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{d.turns?.length || 4} Percakapan</span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{d.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {d.scenario || "Simulasi dialog situasi nyata."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Listening Tab */}
      {activeTab === "listening" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {listening.map((l) => (
            <div key={l.id} className="card card-interactive" onClick={() => setActiveItem(l)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="sage">{l.level || "A2"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>3 Tahap Latihan</span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{l.title}</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                {l.instructions || "Dengar audio lalu uji pemahaman pesan utama."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pronunciation Tab */}
      {activeTab === "pronunciation" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {pronunciation.map((p) => (
            <div key={p.id} className="card card-interactive" onClick={() => speak(p.phrase || p.targetWord)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="navy">{p.level || "A1"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>🔊 Klik untuk Dengar</span>
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-1)" }}>{p.phrase || p.targetWord}</h3>
              {p.ipa && <p style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", margin: "0 0 4px 0" }}>/{p.ipa}/</p>}
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0 }}>{p.notes || p.focusRule}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

