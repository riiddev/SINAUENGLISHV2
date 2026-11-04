import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-bg-footer)",
        borderTop: "var(--border-sm)",
        paddingBlock: "var(--space-12)",
        marginTop: "auto"
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-8)",
            marginBottom: "var(--space-8)"
          }}
        >
          {/* Brand & Manifesto */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                marginBottom: "var(--space-3)"
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "28px",
                  height: "28px",
                  backgroundColor: "var(--color-accent-gold)",
                  color: "#1A1A1A",
                  borderRadius: "var(--radius-sm)",
                  border: "var(--border-sm)"
                }}
              >
                S
              </span>
              <span>sinauuenglish</span>
            </div>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                maxWidth: "340px"
              }}
            >
              Belajar kosakata dan pola tata bahasa Inggris berdasarkan riset linguistik nyata, makna kontekstual, dan pengulangan berjeda (spaced repetition).
            </p>
          </div>

          {/* Materi Kurikulum */}
          <div>
            <h4
              style={{
                fontSize: "var(--text-sm)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "var(--space-3)"
              }}
            >
              Materi Kurikulum
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-sm)" }}>
              <li><Link to="/belajar/vocabulary">2.971 Kosakata Oxford 3000</Link></li>
              <li><Link to="/belajar/grammar">19 Modul Tata Bahasa (A1–B2)</Link></li>
              <li><Link to="/belajar/reading">156 Bacaan Perpustakaan HABIT</Link></li>
              <li><Link to="/belajar/adventure">Everyday Adventure Series</Link></li>
            </ul>
          </div>

          {/* Arsitektur & Transparansi */}
          <div>
            <h4
              style={{
                fontSize: "var(--text-sm)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "var(--space-3)"
              }}
            >
              Sistem & Transparansi
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-2)" }}>
              • Penyimpanan akun & progres terpusat di serverless Google Spreadsheet.
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-2)" }}>
              • Sesi token hanya disimpan di sessionStorage peramban.
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              • 100% bebas biaya langganan dan tanpa pelacak iklan.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "var(--border-sm)",
            paddingTop: "var(--space-6)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space-4)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)"
          }}
        >
          <span>© {new Date().getFullYear()} SinauEnglish V2. Desain editorial neobrutalisme adaptif.</span>
          <span>Dibuat untuk pelajar Indonesia.</span>
        </div>
      </div>
    </footer>
  );
}

