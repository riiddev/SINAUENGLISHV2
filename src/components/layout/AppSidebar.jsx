import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { BrandLogo } from "../common/BrandLogo.jsx";

export function AppSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isView = (v) => {
    if (v === "overview") return location.pathname === "/belajar" || location.pathname === "/belajar/";
    return location.pathname === `/belajar/${v}`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="modal-overlay is-open"
          style={{ zIndex: 95 }}
          onClick={onClose}
        />
      )}

      <aside className={`app-sidebar ${isOpen ? "mobile-open" : ""}`} id="app-sidebar" aria-label="Navigasi Ruang Belajar">
        <div className="sidebar-header">
          <BrandLogo />
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/belajar"
            onClick={onClose}
            className={`sidebar-link ${isView("overview") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Beranda</span>
          </Link>

          <Link
            to="/belajar/vocabulary"
            onClick={onClose}
            className={`sidebar-link ${isView("vocabulary") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
            <span>Kosakata</span>
            <span className="sidebar-count" id="sidebar-vocab-count">2.971</span>
          </Link>

          <Link
            to="/belajar/study"
            onClick={onClose}
            className={`sidebar-link ${isView("study") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            <span>Latihan Fokus</span>
          </Link>

          <Link
            to="/belajar/grammar"
            onClick={onClose}
            className={`sidebar-link ${isView("grammar") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            <span>Grammar</span>
            <span className="sidebar-count" id="sidebar-grammar-count">19</span>
          </Link>

          <Link
            to="/belajar/reading"
            onClick={onClose}
            className={`sidebar-link ${isView("reading") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>HABIT Reading</span>
            <span className="sidebar-count" id="sidebar-reading-count">156</span>
          </Link>

          <Link
            to="/belajar/adventure"
            onClick={onClose}
            className={`sidebar-link ${isView("adventure") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            <span>Petualangan</span>
          </Link>

          <Link
            to="/belajar/review"
            onClick={onClose}
            className={`sidebar-link ${isView("review") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            <span>Review (SRS)</span>
          </Link>

          <Link
            to="/belajar/progress"
            onClick={onClose}
            className={`sidebar-link ${isView("progress") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>Progres</span>
          </Link>

          <Link
            to="/belajar/settings"
            onClick={onClose}
            className={`sidebar-link ${isView("settings") ? "is-active" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Pengaturan</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div>
              <strong style={{ display: "block", color: "var(--color-text-primary)", marginBottom: "2px" }}>
                {user.displayName}
              </strong>
              <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-success)" }}>
                ✓ Tersinkronisasi ke Cloud
              </p>
            </div>
          ) : (
            <div>
              <strong style={{ display: "block", color: "var(--color-text-primary)", marginBottom: "2px" }}>
                Mode Tamu
              </strong>
              <p style={{ margin: 0 }}>
                <Link to="/login" style={{ color: "var(--color-accent-navy)", fontWeight: 700, textDecoration: "underline" }}>
                  Masuk Akun ↗
                </Link>
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
