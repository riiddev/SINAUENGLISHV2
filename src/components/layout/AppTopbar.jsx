import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export function AppTopbar({ title = "Ruang Belajar", onToggleSidebar, isSyncing = false, syncError = null }) {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "var(--color-bg-surface)",
        borderBottom: "var(--border-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: "var(--space-6)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka menu samping"
          style={{
            display: "grid",
            placeItems: "center",
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-sm)",
            border: "var(--border-sm)",
            backgroundColor: "var(--color-bg-base)"
          }}
        >
          ☰
        </button>

        <h1 style={{ fontSize: "var(--text-xl)", margin: 0 }}>
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        {/* Cloud Sync Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-full)",
            border: "var(--border-sm)",
            backgroundColor: "var(--color-bg-base)",
            fontSize: "var(--text-xs)",
            fontWeight: 700
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isSyncing
                ? "var(--color-accent-gold)"
                : syncError
                ? "var(--color-danger)"
                : isAuthenticated
                ? "var(--color-success)"
                : "var(--color-text-muted)"
            }}
          />
          <span>
            {isSyncing
              ? "Menyinkronkan..."
              : syncError
              ? "Sinkron tertunda"
              : isAuthenticated
              ? "Tersimpan di Spreadsheet"
              : "Mode Tamu (Sesi)"}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Ganti mode gelap/terang"
          style={{
            display: "grid",
            placeItems: "center",
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-full)",
            border: "var(--border-sm)",
            backgroundColor: "var(--color-bg-base)",
            boxShadow: "var(--shadow-button)"
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

