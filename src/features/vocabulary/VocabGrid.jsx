import React, { useState, useMemo } from "react";
import { VocabCard } from "./VocabCard.jsx";
import { VocabModal } from "./VocabModal.jsx";
import { Button } from "../../components/common/Button.jsx";
import { useSpeech } from "../../hooks/useSpeech.js";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 48;

export function VocabGrid({ vocabulary = [], progressMap = {}, onStartStudy }) {
  const [levelFilter, setLevelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedWord, setSelectedWord] = useState(null);

  const { speak } = useSpeech();
  const navigate = useNavigate();

  // Filter words by level and search query
  const filteredWords = useMemo(() => {
    return vocabulary.filter((w) => {
      const matchLevel = levelFilter === "all" || w.level === levelFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        w.word.toLowerCase().includes(q) ||
        (w.meaning && w.meaning.toLowerCase().includes(q));
      return matchLevel && matchSearch;
    });
  }, [vocabulary, levelFilter, searchQuery]);

  const displayedWords = useMemo(() => {
    return filteredWords.slice(0, visibleCount);
  }, [filteredWords, visibleCount]);

  const handleStudy = (word) => {
    if (onStartStudy) {
      onStartStudy(word);
    } else {
      navigate("/belajar/study", { state: { word } });
    }
  };

  return (
    <div>
      {/* Search & Level Filters Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)"
        }}
      >
        <div style={{ flex: "1 1 280px", maxWidth: "420px" }}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Cari kosakata Inggris atau arti Indonesia..."
            className="form-input"
            style={{ borderRadius: "var(--radius-full)" }}
            aria-label="Cari kosakata"
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {[
            { id: "all", label: "Semua (2.971)" },
            { id: "A1", label: "Level A1 (892)" },
            { id: "A2", label: "Level A2 (792)" },
            { id: "B1", label: "Level B1 (689)" },
            { id: "B2", label: "Level B2 (597)" }
          ].map((chip) => {
            const active = levelFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setLevelFilter(chip.id);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-full)",
                  border: "var(--border-sm)",
                  backgroundColor: active ? "var(--color-accent-navy)" : "var(--color-bg-surface)",
                  color: active ? "var(--color-text-inverse)" : "var(--color-text-primary)",
                  boxShadow: active ? "var(--shadow-flat)" : "none",
                  cursor: "pointer",
                  transition: "all var(--duration-fast) var(--ease-editorial)"
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter bar */}
      <div style={{ marginBottom: "var(--space-4)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontWeight: 700 }}>
        Menampilkan {displayedWords.length} dari {filteredWords.length} kata
      </div>

      {/* Grid of Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "var(--space-4)"
        }}
      >
        {displayedWords.map((word) => {
          const itemProgress = progressMap[word.id];
          const status = itemProgress?.masteryStage || "fresh";
          return (
            <VocabCard
              key={word.id}
              word={word}
              status={status}
              onSelect={setSelectedWord}
              onAudio={speak}
            />
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredWords.length && (
        <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Muat Lebih Banyak Kata ↺
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <VocabModal
        word={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
        onStartStudy={handleStudy}
        onAudio={speak}
      />
    </div>
  );
}

