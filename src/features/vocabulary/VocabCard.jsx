import React from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { STATUS_META } from "../../hooks/useSpacedRepetition.js";

export function VocabCard({ word, status = "fresh", onSelect, onAudio }) {
  const meta = STATUS_META[status] || STATUS_META.fresh;

  const handleAudio = (e) => {
    e.stopPropagation();
    onAudio(word.word);
  };

  return (
    <div
      onClick={() => onSelect(word)}
      className="card card-interactive vocab-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "150px",
        cursor: "pointer"
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
          <Badge variant="navy">{word.level}</Badge>
          <span className={`badge ${meta.className}`}>{meta.label}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "4px" }}>
          <h3 style={{ fontSize: "var(--text-lg)", margin: 0 }}>{word.word}</h3>
          <button
            type="button"
            onClick={handleAudio}
            aria-label={`Dengarkan pengucapan ${word.word}`}
            style={{
              padding: "2px 6px",
              fontSize: "var(--text-xs)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-bg-base)",
              border: "var(--border-sm)"
            }}
          >
            🔊
          </button>
        </div>

        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontStyle: "italic", display: "block", marginBottom: "var(--space-2)" }}>
          {word.partOfSpeech || "kata"}
        </span>

        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.4, margin: 0 }}>
          {word.meaning}
        </p>
      </div>

      <div style={{ marginTop: "var(--space-3)", textAlign: "right" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>
          Latih Kata ↗
        </span>
      </div>
    </div>
  );
}

