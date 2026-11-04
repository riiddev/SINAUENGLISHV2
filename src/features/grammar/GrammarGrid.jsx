import React from "react";
import { Badge } from "../../components/common/Badge.jsx";

export function GrammarGrid({ topics = [], onSelectTopic }) {
  return (
    <div>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <span className="section-eyebrow">Kurikulum Terstruktur</span>
        <h2 className="section-title">19 Modul Tata Bahasa (A1–B2)</h2>
        <p className="section-desc">
          Pahami konsep, pola rumus, dan hindari kesalahan umum yang sering terjadi saat menyusun kalimat bahasa Inggris.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-4)"
        }}
      >
        {topics.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelectTopic(t)}
            className="card card-interactive"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                <Badge variant="navy">{t.level}</Badge>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontWeight: 700 }}>
                  ⏱ {t.estimatedMinutes} MENIT
                </span>
              </div>

              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>
                {t.title}
              </h3>

              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0, marginBottom: "var(--space-4)" }}>
                {t.summary}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "var(--border-sm)", paddingTop: "var(--space-3)", marginTop: "var(--space-4)" }}>
              <span className="badge badge-gold">
                {t.questions ? t.questions.length : 3} SOAL KUIS
              </span>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>
                Pelajari Modul ↗
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

