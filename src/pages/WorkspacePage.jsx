import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "../components/layout/AppSidebar.jsx";
import { AppTopbar } from "../components/layout/AppTopbar.jsx";
import { VocabGrid } from "../features/vocabulary/VocabGrid.jsx";
import { StudySession } from "../features/study/StudySession.jsx";
import { GrammarGrid } from "../features/grammar/GrammarGrid.jsx";
import { GrammarDetail } from "../features/grammar/GrammarDetail.jsx";
import { QuizRunner } from "../features/quiz/QuizRunner.jsx";
import { ReadingLibrary } from "../features/reading/ReadingLibrary.jsx";
import { AdventureHub } from "../features/adventure/AdventureHub.jsx";
import { ReviewQueue } from "../features/review/ReviewQueue.jsx";
import { ProgressStats } from "../features/progress/ProgressStats.jsx";
import { SettingsPanel } from "../features/settings/SettingsPanel.jsx";
import { Button } from "../components/common/Button.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { useProgressSync } from "../hooks/useProgressSync.js";

// Static dataset imports (bundled for fast, zero-delay rendering)
import vocabData from "../data/vocabulary.json";
import grammarData from "../data/grammar.json";
import habitData from "../data/habit-reading-library.json";
import storiesData from "../data/adventure/stories.json";
import dialoguesData from "../data/adventure/dialogues.json";
import listeningData from "../data/adventure/listening.json";
import pronunciationData from "../data/adventure/pronunciation.json";

export function WorkspacePage() {
  const { view: routeView } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = routeView || "overview";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState(null);
  const [quizTopic, setQuizTopic] = useState(null);
  const [activeStudyWord, setActiveStudyWord] = useState(() => location.state?.word || null);

  const {
    progressMap,
    isSyncing,
    syncError,
    recordWordReview,
    getWordStatus
  } = useProgressSync();

  const vocabulary = vocabData.entries || [];
  const grammarTopics = grammarData.topics || [];
  const habitPassages = habitData.passages || [];
  const stories = storiesData.stories || [];
  const dialogues = dialoguesData.dialogues || [];
  const listening = listeningData.exercises || [];
  const pronunciation = pronunciationData.exercises || [];

  const viewTitles = {
    overview: "Beranda Belajar",
    vocabulary: "Daftar Kosakata",
    study: "Latihan Fokus",
    grammar: "Kurikulum Grammar",
    quiz: "Kuis Interaktif",
    reading: "Perpustakaan HABIT",
    adventure: "Everyday Adventure",
    review: "Spaced Review & Jurnal",
    progress: "Statistik & Progres",
    settings: "Pengaturan & Akun"
  };

  const handleStartStudy = (word) => {
    setActiveStudyWord(word);
    navigate("/belajar/study");
  };

  const handleStartQuiz = (topic) => {
    setQuizTopic(topic);
    navigate("/belajar/quiz");
  };

  // Pick next unstudied word
  const handleNextStudyWord = () => {
    const next = vocabulary.find((w) => !progressMap[w.id]) || vocabulary[0];
    setActiveStudyWord(next);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--color-bg-base)" }}>
      {/* App Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <AppTopbar
          title={viewTitles[currentView] || "Ruang Belajar"}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isSyncing={isSyncing}
          syncError={syncError}
        />

        {/* Content Container */}
        <main style={{ flex: 1, padding: "var(--space-8)" }}>
          <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* VIEW 1: OVERVIEW */}
            {currentView === "overview" && (
              <div>
                {/* Hero Banner Card */}
                <div
                  className="card card-tint-sand"
                  style={{
                    padding: "var(--space-8)",
                    marginBottom: "var(--space-8)",
                    border: "var(--border-md)"
                  }}
                >
                  <span className="section-eyebrow">Rencana Harian</span>
                  <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-3)" }}>
                    Selamat Datang di Ruang Belajar
                  </h2>
                  <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-secondary)", lineHeight: 1.6, maxWidth: "600px", marginBottom: "var(--space-6)" }}>
                    Pelajari kata baru dalam konteks kalimat otentik dan biarkan algoritma spaced repetition menjadwalkan waktu pengulangan terbaikmu di Google Spreadsheet.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        const wordToStudy = vocabulary.find((w) => !progressMap[w.id]) || vocabulary[0];
                        handleStartStudy(wordToStudy);
                      }}
                    >
                      Mulai Latihan Fokus Sekarang ⚡
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate("/belajar/vocabulary")}
                    >
                      Daftar 2.971 Kosakata ↗
                    </Button>
                  </div>
                </div>

                {/* Progress Summary Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "var(--space-4)",
                    marginBottom: "var(--space-8)"
                  }}
                >
                  <div className="card card-tint-sage" style={{ padding: "var(--space-6)" }}>
                    <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)", fontWeight: 700 }}>
                      Kata Dikuasai
                    </span>
                    <div style={{ fontSize: "var(--text-4xl)", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-success)", marginBlock: "4px" }}>
                      {vocabulary.filter((w) => getWordStatus(w.id) === "mastered").length}
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      Repetisi berhasil ≥ 5 kali
                    </span>
                  </div>

                  <div className="card card-tint-sand" style={{ padding: "var(--space-6)" }}>
                    <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)", fontWeight: 700 }}>
                      Kata Sedang Belajar
                    </span>
                    <div style={{ fontSize: "var(--text-4xl)", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-accent-gold)", marginBlock: "4px" }}>
                      {vocabulary.filter((w) => getWordStatus(w.id) === "learning").length}
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      Aktif dalam antrean memori
                    </span>
                  </div>

                  <div className="card card-tint-slate" style={{ padding: "var(--space-6)" }}>
                    <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)", fontWeight: 700 }}>
                      Total Korpus Oxford
                    </span>
                    <div style={{ fontSize: "var(--text-4xl)", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-accent-navy)", marginBlock: "4px" }}>
                      2.971
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      Tervalidasi A1–B2
                    </span>
                  </div>
                </div>

                {/* Level Breakdown Progress */}
                <ProgressStats
                  vocabulary={vocabulary}
                  progressMap={progressMap}
                />
              </div>
            )}

            {/* VIEW 2: VOCABULARY */}
            {currentView === "vocabulary" && (
              <VocabGrid
                vocabulary={vocabulary}
                progressMap={progressMap}
                onStartStudy={handleStartStudy}
              />
            )}

            {/* VIEW 3: STUDY / 3-STAGE PRACTICE */}
            {currentView === "study" && (
              <StudySession
                word={activeStudyWord}
                onFinish={() => navigate("/belajar/vocabulary")}
                onNextWord={handleNextStudyWord}
                onRecordReview={recordWordReview}
              />
            )}

            {/* VIEW 4: GRAMMAR */}
            {currentView === "grammar" && (
              <div>
                {selectedGrammarTopic ? (
                  <GrammarDetail
                    topic={selectedGrammarTopic}
                    onBack={() => setSelectedGrammarTopic(null)}
                    onStartQuiz={handleStartQuiz}
                  />
                ) : (
                  <GrammarGrid
                    topics={grammarTopics}
                    onSelectTopic={setSelectedGrammarTopic}
                  />
                )}
              </div>
            )}

            {/* VIEW 5: QUIZ */}
            {currentView === "quiz" && (
              <QuizRunner
                topic={quizTopic || grammarTopics[0]}
                onFinish={() => navigate("/belajar/grammar")}
                onRetry={setQuizTopic}
              />
            )}

            {/* VIEW 6: READING */}
            {currentView === "reading" && (
              <ReadingLibrary
                passages={habitPassages}
              />
            )}

            {/* VIEW 7: ADVENTURE */}
            {currentView === "adventure" && (
              <AdventureHub
                stories={stories}
                dialogues={dialogues}
                listening={listening}
                pronunciation={pronunciation}
              />
            )}

            {/* VIEW 8: REVIEW */}
            {currentView === "review" && (
              <ReviewQueue
                vocabulary={vocabulary}
                progressMap={progressMap}
                onStartStudy={handleStartStudy}
              />
            )}

            {/* VIEW 9: PROGRESS */}
            {currentView === "progress" && (
              <ProgressStats
                vocabulary={vocabulary}
                progressMap={progressMap}
              />
            )}

            {/* VIEW 10: SETTINGS */}
            {currentView === "settings" && (
              <SettingsPanel />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

