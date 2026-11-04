import React from "react";
import { STATUS_META } from "../../hooks/useSpacedRepetition.js";

export function VocabModal({ word, status = "fresh", isOpen, onClose, onStartStudy, onAudio }) {
  if (!isOpen || !word) return null;

  const meta = STATUS_META[status] || STATUS_META.fresh;

  return (
    <div
      className="modal-overlay is-open"
      id="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-sheet modal-content" id="modal-sheet">
        <button
          className="btn btn-outline btn-sm"
          id="modal-close-btn"
          style={{ position: "absolute", top: "16px", right: "16px" }}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
        >
          ✕
        </button>

        <div id="modal-content">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <span className={`badge ${meta.className}`}>{meta.label}</span>
              <span className="badge badge-cefr">{word.level}</span>
              <span className="badge">{word.partOfSpeech}</span>
            </div>
            <button
              className="btn btn-secondary btn-icon"
              type="button"
              onClick={() => onAudio(word.word)}
              aria-label="Audio"
              style={{ width: "36px", height: "36px", borderRadius: "var(--radius-pill)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>
          </div>

          <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-1)" }}>
            {word.word}<span style={{ color: "var(--color-accent-gold)" }}>.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
            {word.ipa || ""}
          </p>

          <div style={{ backgroundColor: "var(--color-bg-subtle)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
            <strong style={{ display: "block", fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
              Makna Indonesia:
            </strong>
            <p style={{ fontSize: "var(--text-base)", fontWeight: 700, margin: 0 }}>
              {word.meaning}
            </p>
          </div>

          {word.example && (
            <div style={{ borderLeft: "3px solid var(--color-accent-gold)", paddingLeft: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <p style={{ fontWeight: 600, marginBottom: "2px" }}>{word.example}</p>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontStyle: "italic", margin: 0 }}>
                {word.translation || ""}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Tutup
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                onClose();
                onStartStudy(word);
              }}
            >
              Latih Kata Ini ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
