import React, { useState } from "react";
import { Button } from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { api } from "../../services/api.js";

export function SettingsPanel({ onProgressReload }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(10);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu agar backup dapat diimpor ke akun Google Spreadsheet Anda.");
      return;
    }

    setIsImporting(true);
    setImportStatus("Membaca file cadangan...");

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      setImportStatus("Mengunggah data ke Google Spreadsheet...");
      const res = await api.importBackup(backupData);

      if (res.success) {
        setImportStatus(`✓ Berhasil mengimpor ${res.count || 0} riwayat kata ke Spreadsheet!`);
        if (onProgressReload) onProgressReload();
      } else {
        throw new Error(res.error || "Gagal mengimpor.");
      }
    } catch (err) {
      setImportStatus(`✗ Gagal mengimpor: ${err.message}`);
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <span className="section-eyebrow">Pengaturan Akun & Data</span>
        <h2 className="section-title">Preferensi Belajar & Cloud</h2>
        <p className="section-desc">
          Kelola sesi login, target harian, dan migrasi cadangan data ke Google Spreadsheet.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="card card-tint-sand" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>
          Status Akun Google Spreadsheet
        </h3>

        {isAuthenticated ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "var(--space-2)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Nama Panggilan:</span>
              <strong>{user.displayName}</strong>

              <span style={{ color: "var(--color-text-secondary)" }}>Email:</span>
              <strong>{user.email}</strong>

              <span style={{ color: "var(--color-text-secondary)" }}>ID Pengguna:</span>
              <code style={{ fontFamily: "var(--font-mono)" }}>{user.id}</code>

              <span style={{ color: "var(--color-text-secondary)" }}>Penyimpanan:</span>
              <span style={{ color: "var(--color-success)", fontWeight: 700 }}>Google Apps Script (Cloud)</span>
            </div>

            <Button variant="outline" size="sm" onClick={logout}>
              Keluar Akun (Logout)
            </Button>
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
              Saat ini kamu berada dalam Mode Tamu. Kemajuan belajarmu hanya tersimpan di memori sesi aktif dan akan hilang saat tab ditutup.
            </p>
            <a href="/login" className="btn btn-primary btn-sm">
              Masuk atau Buat Akun Baru ↗
            </a>
          </div>
        )}
      </div>

      {/* Learning Target Card */}
      <div className="card card-tint-slate" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>
          Target Belajar Harian
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <select
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="form-input"
            style={{ maxWidth: "200px" }}
          >
            <option value="5">5 Kata / Hari (Santai)</option>
            <option value="10">10 Kata / Hari (Ideal)</option>
            <option value="15">15 Kata / Hari (Fokus)</option>
            <option value="20">20 Kata / Hari (Intensif)</option>
          </select>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            Target direkomendasikan: 10 kata per hari.
          </span>
        </div>
      </div>

      {/* Backup Migration Tool */}
      <div className="card card-tint-sage" style={{ padding: "var(--space-6)" }}>
        <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>
          Alat Impor Backup (Migrasi V1/V2 → Spreadsheet)
        </h3>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)", lineHeight: 1.5 }}>
          Punya file backup JSON dari versi lama? Unggah di sini untuk memindahkan seluruh riwayat hafalan kata langsung ke database Google Spreadsheet akunmu.
        </p>

        <input
          type="file"
          accept=".json"
          disabled={isImporting || !isAuthenticated}
          onChange={handleImportFile}
          style={{ marginBottom: "var(--space-3)", display: "block" }}
        />

        {importStatus && (
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-bg-surface)",
              border: "var(--border-sm)",
              fontSize: "var(--text-xs)",
              fontWeight: 700
            }}
          >
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
}

