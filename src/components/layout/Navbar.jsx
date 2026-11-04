import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to="/" aria-label="SinauEnglish V2 Beranda">
          <span className="brand-badge">S</span>
          <span className="brand-text">sinauu<span>english</span></span>
        </Link>

        <nav className="nav-menu" aria-label="Navigasi Utama">
          <a className="nav-link" href="/#pendekatan">Pendekatan</a>
          <a className="nav-link" href="/#materi">Peta Materi</a>
          <Link
            className={`nav-link ${location.pathname.startsWith("/belajar") ? "is-active" : ""}`}
            to="/belajar"
          >
            Ruang Belajar ↗
          </Link>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            id="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Ganti mode gelap/terang"
            title="Ganti mode tampilan"
          >
            {isDark ? (
              <svg className="icon-sun" style={{ display: "block" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg className="icon-moon" style={{ display: "block" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <Link to="/belajar/settings" className="btn btn-secondary btn-sm">
              👤 {user.displayName}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              Masuk Akun
            </Link>
          )}

          <Link className="btn btn-primary btn-sm" to="/belajar">
            Masuk Ruang Belajar ↗
          </Link>
        </div>
      </div>
    </header>
  );
}
