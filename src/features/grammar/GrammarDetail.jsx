import React from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { Button } from "../../components/common/Button.jsx";

export function GrammarDetail({ topic, onBack, onStartQuiz }) {
  if (!topic) return null;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Button variant="secondary" size="sm" onClick={onBack} style={{ marginBottom: "var(--space-4)" }}>
        ← Kembali ke Daftar Topik
      </Button>

      <div className="card card-tint-slate" style={{ padding: "var(--space-8)", marginBottom: "var(--space-8)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-3)" }}>
          <Badge variant="navy">{topic.level}</Badge>
          <Badge variant="gold">⏱ {topic.estimatedMinutes} Menit</Badge>
        </div>

        <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-4)" }}>
          {topic.title}
        </h1>

        <p style={{ fontSize: "var(--text-md)", lineHeight: 1.7, color: "var(--color-text-primary)", marginBottom: "var(--space-6)" }}>
          {topic.explanation}
        </p>

        {/* Pola & Rumus */}
        <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)" }}>
          Pola & Rumus Praktis
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
          {(topic.patterns || []).map((pattern, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--color-bg-surface)",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: "var(--border-sm)",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "var(--text-sm)"
              }}
            >
              {pattern}
            </div>
          ))}
        </div>

        {/* Contoh Kalimat */}
        <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)" }}>
          Contoh Pemakaian Kalimat
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          {(topic.examples || []).map((ex, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--color-bg-surface)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: "var(--border-sm)"
              }}
            >
              <p style={{ fontWeight: 700, margin: "0 0 2px 0", fontSize: "var(--text-base)" }}>
                {ex.en}
              </p>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontStyle: "italic", margin: 0 }}>
                {ex.id}
              </p>
            </div>
          ))}
        </div>

        {/* Kesalahan Umum (Common Mistakes) */}
        {topic.mistakes && topic.mistakes.length > 0 && (
          <div style={{ marginBottom: "var(--space-8)" }}>
            <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)" }}>
              Kesalahan Umum yang Sering Dilakukan
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {topic.mistakes.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--color-tint-rose)",
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: "var(--border-sm)"
                  }}
                >
                  <div style={{ color: "var(--color-danger)", fontWeight: 700, marginBottom: "2px" }}>
                    ✗ Salah: {m.wrong}
                  </div>
                  <div style={{ color: "var(--color-success)", fontWeight: 700, marginBottom: "4px" }}>
                    ✓ Benar: {m.right}
                  </div>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
                    Alasan: {m.why}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Quiz Action */}
        <div style={{ textAlign: "right", borderTop: "var(--border-sm)", paddingTop: "var(--space-6)" }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => onStartQuiz(topic)}
          >
            Mulai Kuis Topik Ini ({topic.questions?.length || 3} Soal) ↗
          </Button>
        </div>
      </div>
    </div>
  );
}

