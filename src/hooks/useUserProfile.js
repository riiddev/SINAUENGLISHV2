import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./useAuth.jsx";
import { api } from "../services/api.js";
import { getWordStatus } from "./useSpacedRepetition.js";
import { TITLES_CATALOG, getTitleById, evaluateAllTitles } from "../features/profile/titleSystem.js";

const LOCAL_PROFILE_KEY = "sinau_local_profile";

export function useUserProfile({ vocabulary = [], progressMap = {} }) {
  const { user, isAuthenticated } = useAuth();

  // Local state initialized from cache
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      displayName: user?.displayName || "Pelajar Sinau",
      activeTitle: "word_explorer",
      avatarKey: "avatar_1",
      xp: 120,
      streak: 1,
      coins: 50,
      lastActiveDate: new Date().toISOString()
    };
  });

  const [unlockedTitleIds, setUnlockedTitleIds] = useState(["word_explorer"]);
  const [isLoading, setIsLoading] = useState(false);

  // Derive stats from real vocabulary & progress
  const userStats = useMemo(() => {
    let started = 0;
    let mastered = 0;
    let b2Mastered = 0;
    let totalReviews = 0;

    vocabulary.forEach((word) => {
      const p = progressMap[word.id];
      if (p) {
        started++;
        const st = getWordStatus(p);
        if (st === "mastered") {
          mastered++;
          if (word.level === "B2") b2Mastered++;
        }
        totalReviews += (p.correctCount || 0) + (p.wrongCount || 0);
      }
    });

    // Check reading history if stored
    let readingCount = 0;
    try {
      const readingSaved = localStorage.getItem("sinau_habit_read_history");
      if (readingSaved) readingCount = JSON.parse(readingSaved).length || 0;
    } catch (e) {}

    // Check grammar history
    let grammarCount = 0;
    try {
      const grammarSaved = localStorage.getItem("sinau_grammar_history");
      if (grammarSaved) grammarCount = Object.keys(JSON.parse(grammarSaved)).length || 0;
    } catch (e) {}

    return {
      totalStartedWords: started,
      masteredWordsCount: mastered,
      b2MasteredCount: b2Mastered,
      totalReviewsDone: totalReviews,
      contextReviewsCount: Math.round(totalReviews * 0.7),
      completedGrammarCount: grammarCount,
      readingCompletedCount: readingCount,
      adventureCompletedCount: Math.min(started > 10 ? 3 : 0, 12),
      streak: profile.streak || 1
    };
  }, [vocabulary, progressMap, profile.streak]);

  // Evaluated titles with live progress
  const evaluatedTitles = useMemo(() => {
    return evaluateAllTitles(userStats, unlockedTitleIds);
  }, [userStats, unlockedTitleIds]);

  // Check and auto-unlock newly qualified titles
  useEffect(() => {
    evaluatedTitles.forEach((t) => {
      if (t.isUnlocked && !unlockedTitleIds.includes(t.id)) {
        setUnlockedTitleIds((prev) => [...prev, t.id]);
        if (isAuthenticated) {
          api.unlockTitle(t.id).catch(() => {});
        }
      }
    });
  }, [evaluatedTitles, unlockedTitleIds, isAuthenticated]);

  // Load from remote cloud if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    setIsLoading(true);

    api.getProfile()
      .then((res) => {
        if (!isMounted || !res.success || !res.data) return;
        const remoteP = res.data.profile;
        const remoteTitles = (res.data.unlockedTitles || []).map((t) => t.titleId);

        setProfile((prev) => {
          const merged = {
            ...prev,
            displayName: remoteP.displayName || user?.displayName || prev.displayName,
            activeTitle: remoteP.activeTitle || prev.activeTitle,
            avatarKey: remoteP.avatarKey || prev.avatarKey,
            xp: Math.max(prev.xp, remoteP.xp || 0),
            streak: Math.max(prev.streak, remoteP.streak || 1),
            coins: Math.max(prev.coins, remoteP.coins || 50),
            lastActiveDate: remoteP.lastActiveDate || prev.lastActiveDate
          };
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(merged));
          return merged;
        });

        if (remoteTitles.length > 0) {
          setUnlockedTitleIds((prev) => Array.from(new Set([...prev, ...remoteTitles])));
        }
      })
      .catch((err) => {
        console.warn("[UserProfile] Gagal memuat profil cloud:", err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  // Calculate Level from XP
  const calculatedLevel = useMemo(() => {
    // Smooth level scaling: Level 1 at 0-99 XP, Level 2 at 100 XP, etc.
    const xp = profile.xp || 50;
    return Math.max(1, Math.floor(Math.sqrt(xp / 15)) + 1);
  }, [profile.xp]);

  // Update Display Name
  const updateDisplayName = useCallback(async (newName) => {
    const trimmed = (newName || "").trim();
    if (!trimmed) return;

    setProfile((prev) => {
      const next = { ...prev, displayName: trimmed };
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));
      return next;
    });

    if (isAuthenticated) {
      try {
        await api.updateProfile({ displayName: trimmed });
      } catch (e) {
        console.warn("Gagal update nama di server:", e);
      }
    }
  }, [isAuthenticated]);

  // Change Active Title
  const setActiveTitle = useCallback(async (titleId) => {
    const exists = TITLES_CATALOG.some((t) => t.id === titleId);
    if (!exists) return;

    setProfile((prev) => {
      const next = { ...prev, activeTitle: titleId };
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));
      return next;
    });

    if (isAuthenticated) {
      try {
        await api.updateProfile({ activeTitle: titleId });
      } catch (e) {
        console.warn("Gagal update active title di server:", e);
      }
    }
  }, [isAuthenticated]);

  // Change Avatar
  const setAvatarKey = useCallback(async (avatarKey) => {
    setProfile((prev) => {
      const next = { ...prev, avatarKey };
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));
      return next;
    });

    if (isAuthenticated) {
      try {
        await api.updateProfile({ avatarKey });
      } catch (e) {
        console.warn("Gagal update avatar di server:", e);
      }
    }
  }, [isAuthenticated]);

  const activeTitleObj = useMemo(() => {
    return getTitleById(profile.activeTitle);
  }, [profile.activeTitle]);

  return {
    profile,
    userStats,
    activeTitleObj,
    evaluatedTitles,
    calculatedLevel,
    isLoading,
    updateDisplayName,
    setActiveTitle,
    setAvatarKey
  };
}

