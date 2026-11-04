import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export function AppTopbar({ title = "Beranda Belajar", onToggleSidebar, isSyncing = false, syncError = null }) {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <header className="app-topbar">
      <div className="topbar-title-wrap">
        <button
          className="mobile-menu-btn"
          id="mobile-menu-btn"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka menu samping"
          style={{ display: "inline-flex" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="topbar-title" id="topbar-title">
          {title}
        </h1>
      </div>

      <div className="topbar-actions">
        <div className="storage-pill">
          <span
            className="storage-dot"
            style={{
              backgroundColor: isSyncing
                ? "var(--color-accent-gold)"
                : syncError
                ? "var(--color-danger)"
                : isAuthenticated
                ? "var(--color-success)"
                : "var(--color-accent-gold)"
            }}
          />
          <span id="storage-status-text">
            {isSyncing
              ? "Menyinkronkan ke Cloud..."
              : syncError
              ? "Sinkron tertunda"
              : isAuthenticated
              ? "Tersimpan di Cloud"
              : "Mode Tamu"}
          </span>
        </div>

        <button
          className="theme-toggle"
          id="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label="Ganti mode gelap/terang"
        >
          {isDark ? (
            <svg className="icon-sun" style={{ display: "block" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          ) : (
            <svg className="icon-moon" style={{ display: "block" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
