import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../common/Button.jsx";

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--color-bg-nav)",
        borderBottom: "var(--border-sm)",
        transition: "background-color var(--duration-base) var(--ease-editorial)"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "var(--header-height)"
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: 700
          }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: "32px",
              height: "32px",
              backgroundColor: "var(--color-accent-gold)",
              color: "#1A1A1A",
              borderRadius: "var(--radius-sm)",
              border: "var(--border-sm)",
              fontWeight: 700
            }}
          >
            S
          </span>
          <span>
            sinauu<span style={{ color: "var(--color-accent-navy)" }}>english</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-6)"
          }}
        >
          <Link
            to="/#pendekatan"
            style={{
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)"
            }}
          >
            Pendekatan
          </Link>
          <Link
            to="/#materi"
            style={{
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)"
            }}
          >
            Peta Materi
          </Link>
          <Link
            to="/belajar"
            style={{
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              color: location.pathname.startsWith("/belajar")
                ? "var(--color-accent-gold)"
                : "var(--color-text-primary)"
            }}
          >
            Ruang Belajar ↗
          </Link>
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ganti mode gelap/terang"
            title="Ganti mode tampilan"
            style={{
              display: "grid",
              placeItems: "center",
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-full)",
              border: "var(--border-sm)",
              backgroundColor: "var(--color-bg-surface)",
              boxShadow: "var(--shadow-button)"
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Auth State Button */}
          {isAuthenticated ? (
            <Link to="/belajar/settings">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-full)",
                  border: "var(--border-sm)",
                  backgroundColor: "var(--color-bg-surface)"
                }}
              >
                👤 {user.displayName}
              </span>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="secondary">
                Masuk Akun
              </Button>
            </Link>
          )}

          <Link to="/belajar">
            <Button size="sm" variant="primary">
              Mulai Belajar ↗
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

