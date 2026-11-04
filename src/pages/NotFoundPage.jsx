import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { Button } from "../components/common/Button.jsx";

export function NotFoundPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "var(--space-12) var(--space-4)" }}>
        <div className="card card-tint-sand" style={{ maxWidth: "480px", textAlign: "center", padding: "var(--space-10)" }}>
          <span style={{ fontSize: "64px", display: "block", marginBottom: "var(--space-2)" }}>🔍</span>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-3)" }}>
            Halaman Tidak Ditemukan
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
            Alamat yang kamu tuju tidak tersedia atau telah dipindahkan.
          </p>
          <Link to="/">
            <Button variant="primary">Kembali ke Beranda ↗</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

