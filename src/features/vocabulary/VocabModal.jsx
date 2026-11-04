import React from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { Badge } from "../../components/common/Badge.jsx";
import { Button } from "../../components/common/Button.jsx";

export function VocabModal({ word, isOpen, onClose, onStartStudy, onAudio }) {
  if (!word) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          <Badge variant="navy">{word.level}</Badge>
          <Badge variant="sage">{word.partOfSpeech || "kata"}</Badge>
        </div>
        <button
          type="button"
          onClick={() => onAudio(word.word)}
          className="btn btn-secondary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          🔊 Suara (US)
        </button>
      </div>

      <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-1)" }}>
        {word.word}
      </h2>

      {word.ipa && (
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "var(--space-4)" }}>
          /{word.ipa}/
        </span>
      )}

      {/* Makna Indonesia */}
      <div style={{ backgroundColor: "var(--color-tint-sand)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "var(--border-sm)", marginBottom: "var(--space-4)" }}>
        <strong style={{ display: "block", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
          Arti Indonesia:
        </strong>
        <p style={{ fontSize: "var(--text-lg)", fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>
          {word.meaning}
        </p>
      </div>

      {/* Definisi Bahasa Inggris */}
      {word.definition && (
        <div style={{ marginBottom: "var(--space-4)" }}>
          <strong style={{ display: "block", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
            Definisi:
          </strong>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
            {word.definition}
          </p>
        </div>
      )}

      {/* Contoh Kalimat */}
      {word.example && (
        <div style={{ backgroundColor: "var(--color-bg-base)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "var(--border-sm)", marginBottom: "var(--space-6)" }}>
          <strong style={{ display: "block", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
            Contoh Pemakaian:
          </strong>
          <p style={{ fontSize: "var(--text-base)", fontWeight: 600, margin: "0 0 4px 0" }}>
            "{word.example}"
          </p>
          {word.translation && (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic", margin: 0 }}>
              "{word.translation}"
            </p>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            onStartStudy(word);
          }}
        >
          Latih Kata Ini Sekarang ⚡
        </Button>
      </div>
    </Modal>
  );
}

