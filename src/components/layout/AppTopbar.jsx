import React from "react";
import { useAuth } from "../../hooks/useAuth.jsx";

export function AppTopbar({
  title = "Beranda Belajar",
  isSidebarOpen = false,
  onToggleSidebar,
  isSyncing = false,
  syncError = null
}) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="app-topbar">
      <div className="topbar-title-wrap">
        <button
          className="mobile-menu-btn"
          id="mobile-menu-btn"
          type="button"
          onClick={onToggleSidebar}
          aria-expanded={isSidebarOpen}
          aria-controls="app-sidebar"
          aria-label={isSidebarOpen ? "Tutup menu samping" : "Buka menu samping"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            minWidth: "44px",
            minHeight: "44px",
            borderRadius: "var(--radius-pill)"
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      </div>
    </header>
  );
}
