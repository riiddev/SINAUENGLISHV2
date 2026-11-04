import React, { useState } from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { Button } from "../../components/common/Button.jsx";
import { useSpeech } from "../../hooks/useSpeech.js";

export function StudySession({ word, onFinish, onNextWord, onRecordReview }) {
  const [stage, setStage] = useState(1);
  const [isMeaningRevealed, setIsMeaningRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [outcome, setOutcome] = useState(null);

  const { speak } = useSpeech();

  if (!word) {
    return (
      <div className="card card-tint-sand" style={{ textAlign: "center", padding: "var(--space-12)" }}>
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-3)" }}>
          Pilih Kata untuk Mulai Latihan
        </h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
          Silakan buka menu Kosakata untuk memilih kata yang ingin kamu kuasai.
        </p>
        <Button variant="primary" onClick={onFinish}>
          Buka Daftar Kosakata ↗
        </Button>
      </div>
    );
  }

  // Generate context question
  const context = word.context || {
    prompt: `Lengkapi kalimat berikut: "${word.example || 'I need to understand this word.'}"`,
    options: [word.meaning, "arti yang kurang tepat", "lawan kata"],
    answer: 0
  };

  const handleStage2Answer = (idx) => {
    setSelectedOption(idx);
    const correct = idx === context.answer;
    setIsCorrect(correct);

    // Record review update
    const result = onRecordReview(word.id, word.level, correct);
    setOutcome(result);

    setTimeout(() => {
      setStage(3);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Step Tracker */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)",
          paddingBottom: "var(--space-4)",
          borderBottom: "var(--border-sm)"
        }}
      >
        <span className="badge badge-gold">
          TAHAP {stage} DARI 3: {stage === 1 ? "RECALL MAKNA" : stage === 2 ? "KONTEKS KALIMAT" : "UPDATE SRS"}
        </span>
        <Badge variant="navy">{word.level}</Badge>
      </div>

      {/* STAGE 1: RECALL */}
      {stage === 1 && (
        <div className="card card-tint-sand" style={{ padding: "var(--space-8)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)" }}>
              Amati Kata
            </span>
            <button
              type="button"
              onClick={() => speak(word.word)}
              className="btn btn-secondary btn-sm"
            >
              🔊 Dengar
            </button>
          </div>

          <h2 style={{ fontSize: "var(--text-4xl)", textAlign: "center", marginBottom: "var(--space-6)" }}>
            {word.word}
          </h2>

          <div
            style={{
              backgroundColor: "var(--color-bg-surface)",
              borderRadius: "var(--radius-lg)",
              border: "var(--border-sm)",
              padding: "var(--space-6)",
              textAlign: "center",
              marginBottom: "var(--space-6)",
              minHeight: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {isMeaningRevealed ? (
              <div>
                <strong style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Arti Kata:
                </strong>
                <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, color: "var(--color-accent-navy)" }}>
                  {word.meaning}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-3)" }}>
                  Ingat kembali arti kata ini di pikiranmu sebelum membuka.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setIsMeaningRevealed(true)}>
                  Buka Arti Kata 👁
                </Button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button variant="outline" onClick={onFinish}>
              Kembali
            </Button>
            <Button
              variant="primary"
              disabled={!isMeaningRevealed}
              onClick={() => setStage(2)}
            >
              Lanjut ke Uji Konteks ↗
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 2: CONTEXT QUESTION */}
      {stage === 2 && (
        <div className="card card-tint-sand" style={{ padding: "var(--space-8)" }}>
          <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
            {context.prompt}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
            {context.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = {
                textAlign: "left",
                justifyContent: "flex-start",
                padding: "var(--space-4)"
              };

              if (selectedOption !== null) {
                if (idx === context.answer) {
                  btnStyle.backgroundColor = "var(--color-success-bg)";
                  btnStyle.borderColor = "var(--color-success)";
                  btnStyle.color = "var(--color-success)";
                } else if (isSelected) {
                  btnStyle.backgroundColor = "var(--color-danger-bg)";
                  btnStyle.borderColor = "var(--color-danger)";
                  btnStyle.color = "var(--color-danger)";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleStage2Answer(idx)}
                  className="btn btn-secondary"
                  style={btnStyle}
                >
                  <span style={{ fontWeight: 700, marginRight: "var(--space-2)" }}>{String.fromCharCode(65 + idx)}.</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                backgroundColor: isCorrect ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                border: "var(--border-sm)",
                color: isCorrect ? "var(--color-success)" : "var(--color-danger)",
                fontWeight: 700
              }}
            >
              {isCorrect ? "✓ Jawaban Benar! Pemahaman konteks tercatat." : "✗ Kurang tepat. Interval review direset ke 1 hari."}
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: RESULT & SRS UPDATE */}
      {stage === 3 && (
        <div className="card card-tint-sand" style={{ textAlign: "center", padding: "var(--space-10)" }}>
          <div style={{ fontSize: "48px", marginBottom: "var(--space-2)" }}>
            {isCorrect ? "🎉" : "💪"}
          </div>

          <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-3)" }}>
            {isCorrect ? "Penguasaan Meningkat!" : "Tetap Semangat!"}
          </h2>

          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
            Kata <strong style={{ color: "var(--color-text-primary)" }}>{word.word}</strong> telah dicatat dalam sistem spaced repetition.
          </p>

          <div
            style={{
              backgroundColor: "var(--color-bg-surface)",
              borderRadius: "var(--radius-lg)",
              border: "var(--border-sm)",
              padding: "var(--space-6)",
              marginBottom: "var(--space-8)",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
              <span>Status Mastery:</span>
              <strong style={{ textTransform: "capitalize" }}>{outcome?.masteryStage || "learning"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
              <span>Interval Jadwal Review:</span>
              <strong>{outcome?.intervalDays || 1} Hari Lagi</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tersimpan ke Cloud:</span>
              <span style={{ color: "var(--color-success)", fontWeight: 700 }}>✓ Otomatis (Google Spreadsheet)</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)" }}>
            <Button variant="secondary" onClick={onFinish}>
              Daftar Kosakata
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setStage(1);
                setIsMeaningRevealed(false);
                setSelectedOption(null);
                setOutcome(null);
                onNextWord();
              }}
            >
              Latih Kata Selanjutnya ⚡
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

