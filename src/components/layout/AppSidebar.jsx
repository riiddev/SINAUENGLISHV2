import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

const NAV_ITEMS = [
  { id: "overview", label: "Beranda", icon: "⌂", path: "/belajar" },
  { id: "vocabulary", label: "Kosakata", icon: "📖", count: "2.971", path: "/belajar/vocabulary" },
  { id: "study", label: "Latihan Fokus", icon: "⚡", path: "/belajar/study" },
  { id: "grammar", label: "Grammar", icon: "✏️", count: "19", path: "/belajar/grammar" },
  { id: "reading", label: "HABIT Reading", icon: "📚", count: "156", path: "/belajar/reading" },
  { id: "adventure", label: "Petualangan", icon: "🧭", path: "/belajar/adventure" },
  { id: "review", label: "Review (SRS)", icon: "🔄", path: "/belajar/review" },
  { id: "progress", label: "Progres", icon: "📊", path: "/belajar/progress" },
  { id: "settings", label: "Pengaturan & Akun", icon: "⚙️", path: "/belajar/settings" }
];

export function AppSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isItemActive = (item) => {
    if (item.id === "overview") {
      return location.pathname === "/belajar" || location.pathname === "/belajar/";
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 900
          }}
        />
      )}

      <aside
        style={{
          width: "var(--sidebar-width)",
          backgroundColor: "var(--color-bg-nav)",
          borderRight: "var(--border-sm)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 950,
          transition: "transform var(--duration-base) var(--ease-editorial)",
          transform: isOpen ? "translateX(0)" : undefined
        }}
        className={`app-sidebar ${isOpen ? "is-open" : ""}`}
      >
        {/* Brand */}
        <div
          style={{
            padding: "var(--space-6) var(--space-5)",
            borderBottom: "var(--border-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-md)",
              fontWeight: 700
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
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="mobile-only-close"
            style={{
              display: "none",
              padding: "4px 8px",
              fontWeight: 700
            }}
            aria-label="Tutup navigasi"
          >
            ✕
          </button>
        </div>

        {/* Navigation items */}
        <nav
          style={{
            padding: "var(--space-4) var(--space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
            overflowY: "auto",
            flex: 1
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 700,
                  fontSize: "var(--text-sm)",
                  color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  backgroundColor: active ? "var(--color-bg-base)" : "transparent",
                  border: active ? "var(--border-sm)" : "1px solid transparent",
                  boxShadow: active ? "var(--shadow-flat)" : "none",
                  transition: "all var(--duration-fast) var(--ease-editorial)"
                }}
              >
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.count && (
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      fontFamily: "var(--font-mono)",
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "var(--color-bg-surface)",
                      border: "var(--border-sm)"
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Account Status Footer */}
        <div
          style={{
            padding: "var(--space-4) var(--space-5)",
            borderTop: "var(--border-sm)",
            backgroundColor: "var(--color-bg-subtle)"
          }}
        >
          {isAuthenticated ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-success)" }} />
                <strong style={{ fontSize: "var(--text-xs)", color: "var(--color-text-primary)" }}>
                  {user.displayName}
                </strong>
              </div>
              <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", display: "block" }}>
                Tersambung ke Spreadsheet
              </span>
            </div>
          ) : (
            <div>
              <strong style={{ fontSize: "var(--text-xs)", display: "block", marginBottom: "4px" }}>
                Mode Tamu (Belum Masuk)
              </strong>
              <Link
                to="/login"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-accent-navy)",
                  fontWeight: 700,
                  textDecoration: "underline"
                }}
              >
                Masuk untuk simpan progres ↗
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

