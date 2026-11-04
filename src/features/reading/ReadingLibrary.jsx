import React, { useState } from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { Button } from "../../components/common/Button.jsx";

export function ReadingLibrary({ passages = [] }) {
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", "Science", "Culture", "History", "Technology", "Society"];

  const filtered = passages.filter((p) => {
    if (filterCategory === "all") return true;
    return p.category?.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h2 className="section-title">156 Bacaan Bahasa Inggris Nyata</h2>
        <p className="section-desc">
          Tingkatkan kecepatan membaca, perluas konteks kosakata, dan pahami tata kalimat otentik melalui teks perpustakaan HABIT.
        </p>

        {/* Filter categories */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-full)",
                border: "var(--border-sm)",
                backgroundColor: filterCategory === cat ? "var(--color-accent-navy)" : "var(--color-bg-surface)",
                color: filterCategory === cat ? "var(--color-text-inverse)" : "var(--color-text-primary)",
                cursor: "pointer"
              }}
            >
              {cat === "all" ? "Semua Kategori (156)" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Passages */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-4)"
        }}
      >
        {filtered.slice(0, 36).map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPassage(p)}
            className="card card-interactive"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <Badge variant="sage">{p.category || "General"}</Badge>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontWeight: 700 }}>
                  ⏱ {p.estimatedMinutes || 3} MENIT
                </span>
              </div>

              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>
                {p.title}
              </h3>

              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0, marginBottom: "var(--space-4)" }}>
                {p.paragraphs ? p.paragraphs[0].slice(0, 110) + "..." : ""}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "var(--border-sm)", paddingTop: "var(--space-3)", marginTop: "var(--space-3)" }}>
              <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }}>
                {p.wordCount} KATA
              </span>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent-navy)" }}>
                Baca Teks ↗
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Passage Reader Modal */}
      {selectedPassage && (
        <Modal
          isOpen={Boolean(selectedPassage)}
          onClose={() => setSelectedPassage(null)}
          maxWidth="700px"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <Badge variant="sage">{selectedPassage.category || "HABIT Reading"}</Badge>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>
              ⏱ {selectedPassage.estimatedMinutes || 3} Menit · {selectedPassage.wordCount} Kata
            </span>
          </div>

          <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
            {selectedPassage.title}
          </h2>

          <div style={{ fontSize: "var(--text-base)", lineHeight: 1.8, color: "var(--color-text-primary)", marginBottom: "var(--space-8)" }}>
            {(selectedPassage.paragraphs || []).map((para, idx) => (
              <p key={idx} style={{ marginBottom: "var(--space-4)" }}>
                {para}
              </p>
            ))}
          </div>

          <div style={{ textAlign: "right" }}>
            <Button
              variant="primary"
              onClick={() => setSelectedPassage(null)}
            >
              Selesai Membaca ✓
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

