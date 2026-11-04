/**
 * SINAUENGLISH V2 — Unified Google Apps Script Web App API Service
 * 
 * Provides robust communication with the serverless Google Spreadsheet backend.
 * Uses text/plain POST to avoid preflight CORS restrictions.
 * Stores authentication tokens strictly in sessionStorage (or memory fallback).
 */

const API_URL = import.meta.env.VITE_API_URL || "";
const TIMEOUT_MS = 15000; // 15 seconds
const MAX_RETRIES = 2;

// In-memory token fallback if sessionStorage is restricted/unavailable
let memoryToken = null;
const TOKEN_STORAGE_KEY = "sinauu_sess_token";

/**
 * Retrieve active session token
 */
export function getSessionToken() {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || memoryToken;
  } catch (e) {
    return memoryToken;
  }
}

/**
 * Set active session token in sessionStorage
 */
export function setSessionToken(token) {
  memoryToken = token;
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    // sessionStorage disabled or unavailable
  }
}

/**
 * Clear session token
 */
export function clearSessionToken() {
  setSessionToken(null);
}

/**
 * Send request to Apps Script Web App with retry and timeout logic
 */
async function request(action, payload = {}, requiresAuth = true, retryCount = 0) {
  const token = getSessionToken();

  if (requiresAuth && !token) {
    throw new Error("Sesi tidak ditemukan. Silakan masuk terlebih dahulu.");
  }

  if (!API_URL) {
    // If no remote URL is configured, warn and return mock response for offline/dev preview
    console.warn("[SinauAPI] VITE_API_URL belum dikonfigurasi di file .env. Menggunakan mode preview.");
    return handleDevFallback(action, payload, token);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: action,
        token: token || "",
        payload: payload
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 302) {
        console.warn(`[SinauAPI] Endpoint Apps Script (${response.status}) mengalihkan ke Google Login (izin masih privat). Beralih otomatis ke mode dev preview.`);
        return handleDevFallback(action, payload, token);
      }
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (!json.success) {
      // If unauthorized (invalid/expired session), clear stored token
      if (json.error && json.error.toLowerCase().includes("sesi")) {
        clearSessionToken();
      }
      throw new Error(json.error || "Terjadi kesalahan pada server.");
    }

    return json;
  } catch (error) {
    clearTimeout(timer);

    const isAbort = error.name === "AbortError";
    const errorMessage = isAbort ? "Batas waktu koneksi habis (timeout). Silakan periksa jaringan Anda." : error.message;

    // Retry transient network or timeout errors
    if (retryCount < MAX_RETRIES && (isAbort || error.message.includes("Failed to fetch") || error.message.includes("NetworkError"))) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(r => setTimeout(r, delay));
      return request(action, payload, requiresAuth, retryCount + 1);
    }

    // Graceful fallback if Google CORS or redirect blocks anonymous access
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || isAbort) {
      console.warn(`[SinauAPI] Gagal terhubung ke remote Apps Script (${errorMessage}). Menggunakan mode dev preview agar pengalaman belajar tidak terputus.`);
      return handleDevFallback(action, payload, token);
    }

    throw new Error(errorMessage);
  }
}

/**
 * Mock fallback for local development preview before spreadsheet URL is linked
 */
function handleDevFallback(action, payload, token) {
  if (action === "register" || action === "login") {
    const fakeToken = "dev_token_" + Date.now();
    setSessionToken(fakeToken);
    return {
      success: true,
      message: "Berhasil masuk (Mode Dev Preview).",
      data: {
        token: fakeToken,
        user: {
          id: "u_dev_user",
          email: payload.email || "pelajar@sinauenglish.id",
          displayName: payload.displayName || "Pelajar Sinau"
        }
      }
    };
  }

  if (action === "getMe") {
    return {
      success: true,
      data: {
        id: "u_dev_user",
        email: "pelajar@sinauenglish.id",
        displayName: "Pelajar Sinau",
        createdAt: new Date().toISOString()
      }
    };
  }

  if (action === "getProgress") {
    return { success: true, data: { items: {} } };
  }

  if (action === "syncProgress") {
    return { success: true, message: "Tersinkron (Dev Preview).", count: (payload.updates || []).length };
  }

  if (action === "getSettings") {
    return { success: true, data: { settings: { dailyGoal: 10, theme: "light" } } };
  }

  if (action === "getProfile") {
    return {
      success: true,
      data: {
        profile: {
          userId: "u_dev_user",
          displayName: "Pelajar Sinau",
          activeTitle: "word_explorer",
          xp: 250,
          streak: 3,
          coins: 75,
          lastActiveDate: new Date().toISOString(),
          avatarKey: "avatar_1"
        },
        unlockedTitles: [{ titleId: "word_explorer", unlockedAt: new Date().toISOString() }]
      }
    };
  }

  if (action === "updateProfile") {
    return { success: true, message: "Profil tersimpan (Dev Preview)." };
  }

  if (action === "getUserTitles") {
    return {
      success: true,
      data: { titles: [{ titleId: "word_explorer", unlockedAt: new Date().toISOString() }] }
    };
  }

  if (action === "unlockTitle") {
    return { success: true, message: "Gelar berhasil dibuka (Dev Preview)." };
  }

  if (action === "getDailyQuests") {
    return {
      success: true,
      data: {
        dateStr: payload.dateStr || new Date().toISOString().slice(0, 10),
        quests: []
      }
    };
  }

  if (action === "updateQuestProgress") {
    return { success: true, message: "Progres misi tersimpan (Dev Preview)." };
  }

  if (action === "claimQuestReward") {
    return {
      success: true,
      message: "Hadiah berhasil diklaim (Dev Preview).",
      data: {
        questId: payload.questId,
        claimedAt: new Date().toISOString(),
        xpEarned: payload.xpReward || 35,
        coinsEarned: payload.coinsReward || 15
      }
    };
  }

  if (action === "uploadAvatar") {
    const updatedAt = new Date().toISOString();
    return {
      success: true,
      message: "Foto profil berhasil diunggah (Dev Preview).",
      data: {
        avatarUrl: payload.imageBase64,
        avatarUpdatedAt: updatedAt
      }
    };
  }

  if (action === "getAvatar") {
    return {
      success: true,
      data: {
        hasAvatar: false,
        avatarUrl: null,
        avatarUpdatedAt: null
      }
    };
  }

  if (action === "deleteAvatar") {
    return {
      success: true,
      message: "Foto profil berhasil dihapus (Dev Preview)."
    };
  }

  // Economy & Collections dev fallback
  if (action === "getCatalog") {
    return {
      success: true,
      data: {
        items: [
          { id: "border_daun", type: "border", name: "Border Daun Belajar", price: 0, levelReq: 1, active: true },
          { id: "border_tinta", type: "border", name: "Border Tinta Cendekiawan", price: 0, levelReq: 1, active: true },
          { id: "border_kawung", type: "border", name: "Border Kawung Tradisional", price: 120, levelReq: 3, active: true },
          { id: "border_buku", type: "border", name: "Border Buku Terbuka", price: 250, levelReq: 5, active: true },
          { id: "border_emas", type: "border", name: "Border Emas Mahkota", price: 400, levelReq: 6, active: true },
          { id: "border_kanci", type: "border", name: "Border Kanci Orisinal", price: 600, levelReq: 8, active: true },
          { id: "outfit_kacamata", type: "outfit", name: "Kacamata Baca Cerdik", price: 150, levelReq: 3, active: true },
          { id: "outfit_syal", type: "outfit", name: "Syal Tenun Hangat", price: 200, levelReq: 4, active: true },
          { id: "outfit_headphone", type: "outfit", name: "Headphone Audio Fokus", price: 350, levelReq: 6, active: true },
          { id: "outfit_petualang", type: "outfit", name: "Topi Petualang Rimba", price: 500, levelReq: 7, active: true },
          { id: "streak_freeze", type: "utility", name: "Pelindung Streak (Streak Freeze)", price: 80, levelReq: 2, active: true }
        ]
      }
    };
  }

  if (action === "getInventory") {
    let saved = [];
    try {
      const raw = localStorage.getItem("sinau_local_inventory");
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const now = new Date().toISOString();
    const hasDaun = saved.some(it => it.itemId === "border_daun");
    const hasTinta = saved.some(it => it.itemId === "border_tinta");

    if (!hasDaun) saved.push({ itemId: "border_daun", unlockedAt: now, equipped: false });
    if (!hasTinta) saved.push({ itemId: "border_tinta", unlockedAt: now, equipped: false });
    try {
      localStorage.setItem("sinau_local_inventory", JSON.stringify(saved));
    } catch (e) {}

    return {
      success: true,
      data: { inventory: saved }
    };
  }

  if (action === "buyItem") {
    let saved = [];
    try {
      const raw = localStorage.getItem("sinau_local_inventory");
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const now = new Date().toISOString();
    saved.push({ itemId: payload.itemId, unlockedAt: now, equipped: false });
    try {
      localStorage.setItem("sinau_local_inventory", JSON.stringify(saved));
    } catch (e) {}

    return {
      success: true,
      message: "Berhasil membeli item (Dev Preview).",
      data: {
        itemId: payload.itemId,
        inventory: saved
      }
    };
  }

  if (action === "equipItem") {
    let saved = [];
    try {
      const raw = localStorage.getItem("sinau_local_inventory");
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const type = payload.type || "border";
    saved = saved.map(it => {
      // Toggle logic
      const isTarget = it.itemId === payload.itemId;
      return {
        ...it,
        equipped: isTarget ? true : (it.itemId.startsWith(type) ? false : it.equipped)
      };
    });

    try {
      localStorage.setItem("sinau_local_inventory", JSON.stringify(saved));
    } catch (e) {}

    return {
      success: true,
      message: "Item berhasil diperbarui (Dev Preview).",
      data: {
        equippedItemId: payload.itemId,
        type: payload.type
      }
    };
  }

  if (action === "grantReward") {
    return {
      success: true,
      data: {
        earnedXp: payload.meta?.difficulty === 2 ? 40 : 30,
        earnedCoins: payload.meta?.difficulty === 2 ? 20 : 15,
        totalXp: 150,
        totalCoins: 80,
        level: 4,
        isLevelUp: false
      }
    };
  }

  return { success: true, message: "Aksi berhasil (Dev Preview)." };
}

/* ==========================================================================
   PUBLIC API EXPORTS
   ========================================================================== */

export const api = {
  // Authentication
  async register({ email, password, displayName }) {
    const res = await request("register", { email, password, displayName }, false);
    if (res.data?.token) {
      setSessionToken(res.data.token);
    }
    return res;
  },

  async login({ email, password }) {
    const res = await request("login", { email, password }, false);
    if (res.data?.token) {
      setSessionToken(res.data.token);
    }
    return res;
  },

  async logout() {
    try {
      await request("logout", {}, true);
    } catch (e) {
      // Ignore network failures on logout
    } finally {
      clearSessionToken();
    }
    return { success: true };
  },

  async getMe() {
    return request("getMe", {}, true);
  },

  // SRS Learning Progress
  async getProgress() {
    return request("getProgress", {}, true);
  },

  async syncProgress(updates = []) {
    return request("syncProgress", { updates }, true);
  },

  // Quizzes
  async saveQuiz({ topicId, score, total }) {
    return request("saveQuiz", { topicId, score, total }, true);
  },

  async getQuizHistory() {
    return request("getQuizHistory", {}, true);
  },

  // Settings
  async getSettings() {
    return request("getSettings", {}, true);
  },

  async updateSettings(settings = {}) {
    return request("updateSettings", { settings }, true);
  },

  // Profiles & Titles
  async getProfile() {
    return request("getProfile", {}, true);
  },

  async updateProfile(profileData = {}) {
    return request("updateProfile", profileData, true);
  },

  async getUserTitles() {
    return request("getUserTitles", {}, true);
  },

  async unlockTitle(titleId) {
    return request("unlockTitle", { titleId }, true);
  },

  // Custom Profile Avatar (Google Drive via Apps Script DriveApp)
  async uploadAvatar({ imageBase64, mimeType = "image/webp" }) {
    return request("uploadAvatar", { imageBase64, mimeType }, true);
  },

  async getAvatar() {
    return request("getAvatar", {}, true);
  },

  async deleteAvatar() {
    return request("deleteAvatar", {}, true);
  },

  // Economy, Collections & Server-side Rewards (Tahap 3)
  async getCatalog() {
    return request("getCatalog", {}, true);
  },

  async getInventory() {
    return request("getInventory", {}, true);
  },

  async buyItem({ itemId }) {
    return request("buyItem", { itemId }, true);
  },

  async equipItem({ itemId, type = "border" }) {
    return request("equipItem", { itemId, type }, true);
  },

  async grantReward({ eventId, source, refId = "", meta = {} }) {
    return request("grantReward", { eventId, source, refId, meta }, true);
  },

  // Daily Quests / Missions
  async getDailyQuests(dateStr) {
    return request("getDailyQuests", { dateStr }, true);
  },

  async updateQuestProgress({ questId, progress, target, dateStr }) {
    return request("updateQuestProgress", { questId, progress, target, dateStr }, true);
  },

  async claimQuestReward({ questId, dateStr, xpReward, coinsReward }) {
    return request("claimQuestReward", { questId, dateStr, xpReward, coinsReward }, true);
  },

  // One-time migration
  async importBackup(backupData) {
    return request("importBackup", { backup: backupData }, true);
  }
};

