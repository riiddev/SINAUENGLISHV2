import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useUserProfile } from "../../hooks/useUserProfile.js";
import { AVATAR_PRESETS } from "./titleSystem.js";
import "../../styles/profile.css";

export function ProfileView({ vocabulary = [], progressMap = {} }) {
  const { user, isAuthenticated } = useAuth();
  const {
    profile,
    userStats,
    activeTitleObj,
    evaluatedTitles,
    calculatedLevel,
    updateDisplayName,
    setActiveTitle,
    setAvatarKey
  } = useUserProfile({ vocabulary, progressMap });

  const [filterMode, setFilterMode] = useState("all"); // "all" | "unlocked" | "locked"
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.displayName || "Pelajar Sinau");
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarKey || "avatar_1");
  const [selectedTitleId, setSelectedTitleId] = useState(profile.activeTitle || "word_explorer");

  const currentAvatar = AVATAR_PRESETS.find((a) => a.id === profile.avatarKey) || AVATAR_PRESETS[0];

  const filteredTitles = evaluatedTitles.filter((t) => {
    if (filterMode === "unlocked") return t.isUnlocked;
    if (filterMode === "locked") return !t.isUnlocked;
    return true;
  });

  const handleOpenEditModal = () => {
    setEditName(profile.displayName || "Pelajar Sinau");
    setSelectedAvatar(profile.avatarKey || "avatar_1");
    setSelectedTitleId(profile.activeTitle || "word_explorer");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (editName.trim()) {
      updateDisplayName(editName.trim());
    }
    setAvatarKey(selectedAvatar);
    setActiveTitle(selectedTitleId);
    setIsEditModalOpen(false);
  };

  const levels = [
    { id: "A1", label: "Level A1 (Beginner)", total: 892 },
    { id: "A2", label: "Level A2 (Elementary)", total: 792 },
    { id: "B1", label: "Level B1 (Intermediate)", total: 689 },
    { id: "B2", label: "Level B2 (Upper Intermediate)", total: 597 }
  ];

  return (
    <div className="profile-container" id="profile-view-root">
      {/* 1. SCHOLAR IDENTITY CARD */}
      <section className="scholar-id-card" aria-label="Profil Pelajar">
        <div className="scholar-header-wrap">
          <div className="scholar-bio-section">
            <div className="scholar-avatar-box">
              <div
                className="scholar-avatar-circle"
                style={{ backgroundColor: currentAvatar.bg, color: currentAvatar.color }}
              >
                {currentAvatar.letter}
              </div>
              <button
                type="button"
                className="avatar-edit-btn"
                onClick={handleOpenEditModal}
                aria-label="Ubah Foto dan Profil"
                title="Ubah Profil"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            </div>

            <div className="scholar-details">
              <span className="scholar-eyebrow">Profil Cendekiawan</span>
              <h2 className="scholar-name" id="scholar-display-name">
                {profile.displayName || "Pelajar Sinau"}
              </h2>
              <span className="scholar-email">
                {isAuthenticated ? user?.email : "Mode Tamu • Kemajuan Tersimpan Sementara"}
              </span>

              <div className="scholar-chips-row">
                <span className="scholar-chip chip-gold" id="scholar-active-title-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {activeTitleObj.name}
                </span>

                <span className="scholar-chip chip-level">
                  Level {calculatedLevel}
                </span>

                <span className="scholar-chip chip-neutral">
                  {isAuthenticated ? "Akun Cloud Aktif" : "Mode Tamu"}
                </span>
              </div>
            </div>
          </div>

          <div className="scholar-actions-right">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleOpenEditModal}
              id="edit-profile-btn"
              style={{ minHeight: "44px", minWidth: "120px" }}
            >
              Edit Profil
            </button>

            <Link
              to="/belajar/settings"
              className="btn btn-ghost btn-sm"
              title="Buka Pengaturan Akun"
              style={{ minHeight: "44px", minWidth: "44px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Pengaturan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PROGRESS OVERVIEW (4-BENTO METRIC BOXES) */}
      <section className="overview-card" aria-label="Ringkasan Kemajuan Belajar">
        <div className="overview-header">
          <h3 className="overview-title">Ringkasan Kemajuan Belajar</h3>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)" }}>
            Oxford 3000 American English
          </span>
        </div>

        <div className="bento-grid-4">
          {/* Box 1: Level */}
          <div className="bento-box" id="bento-level-box">
            <div className="bento-icon-wrap bento-icon-level" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
                <path d="M6 4h12v5a6 6 0 0 1-12 0V4Z"/>
              </svg>
            </div>
            <div className="bento-value" id="bento-stat-level">{calculatedLevel}</div>
            <div className="bento-label">Level Belajar</div>
          </div>

          {/* Box 2: EXP */}
          <div className="bento-box" id="bento-exp-box">
            <div className="bento-icon-wrap bento-icon-exp" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="bento-value" id="bento-stat-exp">
              {Number(profile.xp || 50).toLocaleString("id-ID")}
            </div>
            <div className="bento-label">EXP Kosakata</div>
          </div>

          {/* Box 3: Koin Sinau */}
          <div className="bento-box" id="bento-coins-box">
            <div className="bento-icon-wrap bento-icon-coins" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 6v2m0 8v2"/>
              </svg>
            </div>
            <div className="bento-value" id="bento-stat-coins">
              {Number(profile.coins || 50).toLocaleString("id-ID")}
            </div>
            <div className="bento-label">Koin Sinau</div>
          </div>

          {/* Box 4: Streak */}
          <div className="bento-box" id="bento-streak-box">
            <div className="bento-icon-wrap bento-icon-streak" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            </div>
            <div className="bento-value" id="bento-stat-streak">
              {profile.streak || 1} Hari
            </div>
            <div className="bento-label">Streak Belajar</div>
          </div>
        </div>
      </section>

      {/* 3. CEFR LEVEL BREAKDOWN PROGRESS BARS */}
      <section className="cefr-card" aria-label="Cakupan Level CEFR">
        <div className="cefr-header">
          <h3 className="overview-title">Cakupan Penguasaan CEFR</h3>
          <p style={{ margin: "4px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            Distribusi 2.971 kosakata Oxford 3000 berdasarkan kriteria mastery berulang.
          </p>
        </div>

        <div className="cefr-grid">
          {levels.map((lvl) => {
            const levelWords = vocabulary.filter((w) => w.level === lvl.id);
            const masteredCount = levelWords.filter((w) => {
              const p = progressMap[w.id];
              return p && (p.masteryStage === "mastered" || (p.correctCount || 0) >= 4);
            }).length;

            const pct = Math.round((masteredCount / lvl.total) * 100);

            return (
              <div key={lvl.id} className="cefr-bar-item">
                <div className="cefr-bar-meta">
                  <span>{lvl.label}</span>
                  <span id={`cefr-count-${lvl.id.toLowerCase()}`}>
                    {masteredCount} / {lvl.total} ({pct}%)
                  </span>
                </div>
                <div className="cefr-track">
                  <div
                    className="cefr-fill"
                    id={`cefr-bar-${lvl.id.toLowerCase()}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TITLE & BADGE MILESTONES SHOWCASE */}
      <section className="titles-card" aria-label="Gelar dan Pencapaian Akademik">
        <div className="titles-header">
          <div>
            <h3 className="overview-title">Gelar & Pencapaian Akademik</h3>
            <p style={{ margin: "4px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              Buka gelar kehormatan dengan menyelesaikan sasaran belajar nyata.
            </p>
          </div>

          <div className="titles-filter-group" role="tablist" aria-label="Filter Gelar">
            <button
              type="button"
              className={`filter-pill-btn ${filterMode === "all" ? "is-active" : ""}`}
              onClick={() => setFilterMode("all")}
              role="tab"
              aria-selected={filterMode === "all"}
            >
              Semua ({evaluatedTitles.length})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${filterMode === "unlocked" ? "is-active" : ""}`}
              onClick={() => setFilterMode("unlocked")}
              role="tab"
              aria-selected={filterMode === "unlocked"}
            >
              Terbuka ({evaluatedTitles.filter((t) => t.isUnlocked).length})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${filterMode === "locked" ? "is-active" : ""}`}
              onClick={() => setFilterMode("locked")}
              role="tab"
              aria-selected={filterMode === "locked"}
            >
              Terkunci ({evaluatedTitles.filter((t) => !t.isUnlocked).length})
            </button>
          </div>
        </div>

        <div className="titles-list" role="list">
          {filteredTitles.map((title) => {
            const isActive = profile.activeTitle === title.id;

            return (
              <article
                key={title.id}
                className={`title-milestone-item ${title.isUnlocked ? "is-unlocked" : ""} ${isActive ? "is-active-title" : ""}`}
                role="listitem"
                id={`title-item-${title.id}`}
              >
                <div className={`title-icon-box ${title.isUnlocked ? "is-unlocked" : ""}`} aria-hidden="true">
                  <TitleIcon type={title.iconType} isUnlocked={title.isUnlocked} />
                </div>

                <div className="title-info-wrap">
                  <div className="title-top-row">
                    <span className="title-name-text">{title.name}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                      ({title.englishName})
                    </span>
                    <span className="scholar-chip chip-neutral" style={{ fontSize: "10px", padding: "2px 8px" }}>
                      {title.badgeLabel}
                    </span>
                  </div>

                  <p className="title-desc-text">{title.description}</p>

                  <div className="title-progress-wrap">
                    <div className="title-track">
                      <div
                        className="title-fill"
                        style={{ width: `${title.percentage}%` }}
                      />
                    </div>
                    <span className="title-count-pill">
                      {title.isUnlocked ? (
                        <span style={{ color: "var(--color-success)" }}>✓ Terbuka</span>
                      ) : (
                        `${title.current}/${title.total} ${title.unit}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="title-action-wrap">
                  {isActive ? (
                    <span
                      className="scholar-chip chip-gold"
                      style={{ minHeight: "44px", display: "inline-flex", alignItems: "center" }}
                    >
                      ✓ Gelar Aktif
                    </span>
                  ) : title.isUnlocked ? (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveTitle(title.id)}
                      style={{ minHeight: "44px" }}
                      aria-label={`Pilih ${title.name} sebagai gelar aktif`}
                    >
                      Gunakan Gelar
                    </button>
                  ) : (
                    <span
                      className="scholar-chip chip-neutral"
                      style={{ color: "var(--color-text-secondary)", minHeight: "44px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Terkunci
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. EDIT PROFILE MODAL (ACCESSIBLE & ANTI-OVERLAP) */}
      {isEditModalOpen && (
        <div
          className="modal-overlay is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-edit-profile-title"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="modal-sheet"
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Flex (Anti-Overlap) */}
            <div className="modal-header-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 className="modal-title" id="modal-edit-profile-title" style={{ margin: 0, fontSize: "var(--text-lg)" }}>
                Ubah Profil Cendekiawan
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Tutup modal edit profil"
                style={{
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "var(--border-sm)",
                  backgroundColor: "var(--color-bg-surface)",
                  cursor: "pointer"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              {/* Name Input */}
              <div style={{ marginBottom: "var(--space-4)" }}>
                <label
                  htmlFor="edit-display-name-input"
                  style={{ display: "block", fontWeight: 700, fontSize: "var(--text-sm)", marginBottom: "var(--space-1)" }}
                >
                  Nama Panggilan Pelajar
                </label>
                <input
                  id="edit-display-name-input"
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={30}
                  required
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "var(--border-sm)" }}
                />
              </div>

              {/* Avatar Selection */}
              <div style={{ marginBottom: "var(--space-4)" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "var(--text-sm)", marginBottom: "var(--space-1)" }}>
                  Pilih Lambang Avatar
                </label>
                <div className="avatar-preset-grid">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`avatar-preset-btn ${selectedAvatar === preset.id ? "is-selected" : ""}`}
                      style={{ backgroundColor: preset.bg, color: preset.color }}
                      onClick={() => setSelectedAvatar(preset.id)}
                      aria-label={`Pilih tema avatar ${preset.label}`}
                    >
                      {preset.letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Title Selector from Unlocked Titles */}
              <div style={{ marginBottom: "var(--space-6)" }}>
                <label
                  htmlFor="select-active-title"
                  style={{ display: "block", fontWeight: 700, fontSize: "var(--text-sm)", marginBottom: "var(--space-1)" }}
                >
                  Gelar Aktif Terbuka
                </label>
                <select
                  id="select-active-title"
                  className="form-input"
                  value={selectedTitleId}
                  onChange={(e) => setSelectedTitleId(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "var(--border-sm)" }}
                >
                  {evaluatedTitles
                    .filter((t) => t.isUnlocked)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.englishName})
                      </option>
                    ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ minHeight: "44px" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="save-profile-btn"
                  style={{ minHeight: "44px" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon helper function for titles
function TitleIcon({ type, isUnlocked }) {
  const strokeColor = isUnlocked ? "#121212" : "currentColor";

  switch (type) {
    case "compass":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
      );
    case "quote":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        </svg>
      );
    case "flame-cadence":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      );
    case "award":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      );
    case "book-open":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      );
    case "shield-star":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polygon points="12 8 13.5 11 17 11.5 14.5 14 15 17.5 12 16 9 17.5 9.5 14 7 11.5 10.5 11 12 8"/>
        </svg>
      );
    case "layers":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      );
    case "refresh":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M16 21h5v-5"/>
        </svg>
      );
    case "map-pin":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      );
    case "crown":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
}
