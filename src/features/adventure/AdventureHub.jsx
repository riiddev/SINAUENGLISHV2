import React, { useState, useEffect } from "react";
import { Badge } from "../../components/common/Badge.jsx";
import { Button } from "../../components/common/Button.jsx";
import { STORIES_CATALOG } from "../../data/stories/storiesCatalog.js";
import story01Data from "../../data/stories/story-01.json";
import story02Data from "../../data/stories/story-02.json";
import story03Data from "../../data/stories/story-03.json";
import story04Data from "../../data/stories/story-04.json";
import story05Data from "../../data/stories/story-05.json";
import story06Data from "../../data/stories/story-06.json";
import story07Data from "../../data/stories/story-07.json";
import { StoryRunner } from "./StoryRunner.jsx";
import { api } from "../../services/api.js";
import "../../styles/adventure.css";

// Map of available story content bundles
const STORIES_CONTENT_MAP = {
  "story-01": story01Data,
  "story-02": story02Data,
  "story-03": story03Data,
  "story-04": story04Data,
  "story-05": story05Data,
  "story-06": story06Data,
  "story-07": story07Data
};

export function AdventureHub({ userProfileHook, onRecordWordReview }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeRunningEpisode, setActiveRunningEpisode] = useState(null);
  const [storyProgressData, setStoryProgressData] = useState({ progress: {}, hasUnlockedNewEpisodeToday: false });
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const userLevel = userProfileHook?.calculatedLevel || userProfileHook?.profile?.level || 1;

  // Fetch story progress from cloud
  const refreshProgress = async () => {
    try {
      const res = await api.getStoryProgress();
      if (res && res.data) {
        setStoryProgressData(res.data);
      }
    } catch (e) {
      console.warn("Fetch story progress error:", e);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const completedEpisodes = selectedStory ? (storyProgressData.progress?.[selectedStory.id] || []) : [];
  const totalCompletedEpisodes = Object.values(storyProgressData.progress || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);

  return (
    <div className="adventure-hub-container" id="adventure-hub-view">
      {/* VIEW A: ROADMAP 10 EPISODE UNTUK CERITA TERPILIH */}
      {selectedStory ? (
        <div id="story-episodes-roadmap-view">
          {/* Breadcrumb / Back button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedStory(null)}
              id="back-to-stories-catalog-btn"
            >
              ← Kembali ke 10 Cerita Petualangan
            </Button>

            <span className="scholar-chip chip-gold" style={{ fontSize: "11px", fontWeight: 800 }}>
              Level {selectedStory.level} • {selectedStory.totalEpisodes} Episode
            </span>
          </div>

          {/* Story Hero Banner */}
          <div className="card card-tint-slate" style={{ padding: "var(--space-6) var(--space-8)", marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-2)" }}>
              <Badge variant="navy">Cerita {selectedStory.number}</Badge>
              <Badge variant="gold">{selectedStory.level}</Badge>
            </div>
            <h2 style={{ fontSize: "var(--text-3xl)", fontFamily: "var(--font-heading)", margin: "0 0 var(--space-2) 0" }}>
              {selectedStory.title}
            </h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: "0 0 var(--space-3) 0" }}>
              {selectedStory.description}
            </p>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-primary)", fontWeight: 700 }}>
              🎯 Fokus Pembelajaran: {selectedStory.learningFocus}
            </div>
          </div>

          {/* Daily Pacing Notice */}
          <div
            className="card card-tint-sand"
            style={{
              padding: "var(--space-4) var(--space-5)",
              marginBottom: "var(--space-6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              flexWrap: "wrap"
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#744210" }}>
                ⏳ Ritme Belajar Harian (Pacing Sistematis)
              </span>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
                Pengguna dapat membuka <strong>1 episode baru per hari (WIB)</strong> untuk menjaga daya serap memori. Episode yang telah tuntas dapat diulang kapan saja tanpa batasan.
              </p>
            </div>
            <div>
              <span className={`scholar-chip ${storyProgressData.hasUnlockedNewEpisodeToday ? "chip-neutral" : "chip-level"}`}>
                {storyProgressData.hasUnlockedNewEpisodeToday
                  ? "⏱ Episode baru dibuka esok hari (WIB)"
                  : "✓ 1 Episode Baru Tersedia Hari Ini"}
              </span>
            </div>
          </div>

          {/* 10 EPISODES ROADMAP GRID */}
          <h3 style={{ fontSize: "var(--text-xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-3)" }}>
            Peta 10 Episode: {selectedStory.title}
          </h3>

          <div className="episode-roadmap-grid">
            {(STORIES_CONTENT_MAP[selectedStory.id]?.episodes || []).map((ep, idx) => {
              const isCompleted = completedEpisodes.includes(ep.id);
              // An episode is unlocked if it is Episode 1, OR if the previous episode is completed
              const isPrevCompleted = ep.id === 1 || completedEpisodes.includes(ep.id - 1);
              const isLocked = !isCompleted && !isPrevCompleted;
              const isCurrent = !isCompleted && isPrevCompleted;

              return (
                <div
                  key={ep.id}
                  className={`episode-node-card ${
                    isCompleted ? "is-completed" : isCurrent ? "is-current" : "is-locked"
                  }`}
                  onClick={() => {
                    if (!isLocked) {
                      setActiveRunningEpisode(ep);
                    }
                  }}
                  id={`episode-card-${ep.id}`}
                  style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                    <span className="scholar-chip chip-neutral" style={{ fontSize: "10px", padding: "1px 6px" }}>
                      Episode {ep.id}
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: isCompleted ? "var(--color-success)" : isCurrent ? "#744210" : "var(--color-text-secondary)" }}>
                      {isCompleted ? "✓ Selesai" : isCurrent ? "Tersedia ↗" : "🔒 Terkunci"}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-heading)", margin: "0 0 4px 0" }}>
                    {ep.title}
                  </h4>
                  <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontStyle: "italic", margin: "0 0 var(--space-3) 0" }}>
                    {ep.titleEn}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border-color)", paddingTop: "var(--space-2)", fontSize: "11px", color: "var(--color-text-secondary)" }}>
                    <span>⏱ {ep.estimatedMinutes || 10} Menit</span>
                    <span style={{ fontWeight: 700, color: "var(--color-accent-navy)" }}>
                      {isCompleted ? "Ulangi ↺" : isCurrent ? "Mulai Baca ↗" : "Belum Terbuka"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW B: 10 STORIES MASTER CATALOG */
        <div id="stories-catalog-overview">
          <div style={{ marginBottom: "var(--space-6)" }}>
            <h2 className="section-title">Petualangan Bahasa Inggris Terapan</h2>
            <p className="section-desc">
              10 Kisah bersambung (100 Episode) melintasi level A1 hingga C1. Pelajari tata bahasa dan kosakata Oxford 3000 dalam skenario kehidupan nyata yang imersif.
            </p>
          </div>

          {/* User Progress Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card stat-card">
              <span className="stat-label">Cerita Terbuka</span>
              <span className="stat-value" id="stat-stories-unlocked">
                {STORIES_CATALOG.filter((s) => userLevel >= s.levelReq).length} / 10
              </span>
              <span className="stat-desc">Berdasarkan Level Pengguna (Level {userLevel})</span>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Episode Selesai</span>
              <span className="stat-value" id="stat-episodes-completed">
                {totalCompletedEpisodes} / 100
              </span>
              <span className="stat-desc">+50 EXP & +30 Koin per episode</span>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Pacing Harian</span>
              <span className="stat-value" style={{ fontSize: "var(--text-lg)" }} id="stat-daily-pacing-status">
                {storyProgressData.hasUnlockedNewEpisodeToday ? "Sudah Membaca" : "Siap Dibaca"}
              </span>
              <span className="stat-desc">Maksimal 1 episode baru per hari WIB</span>
            </div>
          </div>

          {/* 10 Stories Grid */}
          <div className="story-card-grid">
            {STORIES_CATALOG.map((story) => {
              const isLevelUnlocked = userLevel >= story.levelReq;
              const hasContent = Boolean(STORIES_CONTENT_MAP[story.id]);
              const isStoryAvailable = isLevelUnlocked && (story.number === 1 || hasContent);

              return (
                <div
                  key={story.id}
                  id={`story-catalog-card-${story.id}`}
                  className={`story-hub-card ${!isLevelUnlocked ? "is-locked" : ""}`}
                  onClick={() => {
                    if (isLevelUnlocked) {
                      setSelectedStory(story);
                    }
                  }}
                  style={{
                    borderLeft: isStoryAvailable
                      ? `6px solid ${story.themeColor || "var(--color-accent-navy)"}`
                      : "var(--border-sm)",
                    cursor: isLevelUnlocked ? "pointer" : "not-allowed"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                        <Badge variant="navy">Cerita {story.number}</Badge>
                        <Badge variant="gold">{story.level}</Badge>
                      </div>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: isLevelUnlocked ? "var(--color-success)" : "var(--color-text-secondary)" }}>
                        {isLevelUnlocked ? "✓ Terbuka" : `🔒 Butuh Level ${story.levelReq}`}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "var(--text-xl)", fontFamily: "var(--font-heading)", marginBottom: "4px" }}>
                      {story.title}
                    </h3>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontStyle: "italic", margin: "0 0 var(--space-3) 0" }}>
                      {story.titleEn}
                    </p>

                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)", lineHeight: 1.5, margin: "0 0 var(--space-4) 0" }}>
                      {story.description}
                    </p>
                  </div>

                  <div style={{ borderTop: "var(--border-sm)", paddingTop: "var(--space-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-secondary)" }}>
                      {story.totalEpisodes} Episode
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: isLevelUnlocked ? "var(--color-accent-navy)" : "var(--color-text-secondary)" }}>
                      {isLevelUnlocked ? "Buka Petualangan ↗" : `Terkunci (Level ${story.levelReq})`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE STORY RUNNER MODAL */}
      {activeRunningEpisode && selectedStory && (
        <StoryRunner
          story={selectedStory}
          episode={activeRunningEpisode}
          onClose={() => {
            setActiveRunningEpisode(null);
            refreshProgress();
          }}
          onRecordWordReview={onRecordWordReview}
          claimReward={userProfileHook?.claimReward}
          equippedOutfit={userProfileHook?.equippedOutfit}
          onEpisodeCompleted={() => {
            refreshProgress();
          }}
        />
      )}
    </div>
  );
}
