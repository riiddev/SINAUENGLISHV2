/**
 * SINAUENGLISH V2 — Google Apps Script Serverless Backend
 * 
 * Manages user authentication, session tokens, SRS learning progress,
 * quiz attempts, and settings in a private Google Spreadsheet.
 * 
 * Deployment: Deploy as Web App -> Execute as: Me -> Who has access: Anyone.
 */

// Configuration
const CONFIG = {
  TOKEN_TTL_DAYS: 7,
  HASH_ITERATIONS: 5000,
  CACHE_TTL_SEC: 600, // 10 minutes cache for session checks
  LOCK_TIMEOUT_MS: 10000, // 10 seconds
  MAX_LOGIN_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW_SEC: 900 // 15 minutes
};

// Sheet Names
const SHEETS = {
  USERS: "Users",
  SESSIONS: "Sessions",
  PROGRESS: "Progress",
  QUIZ: "QuizAttempts",
  SETTINGS: "Settings",
  PROFILES: "Profiles",
  TITLES: "Titles",
  QUESTS: "Quests"
};

/**
 * Handle incoming HTTP POST requests
 * Uses text/plain to bypass CORS preflight restrictions
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock to prevent race conditions during write operations
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
  } catch (err) {
    return jsonResponse({ success: false, error: "Server sibuk. Silakan coba beberapa saat lagi." }, 429);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Payload kosong." }, 400);
    }

    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: "Format JSON tidak valid." }, 400);
    }

    const action = body.action;
    const token = body.token;
    const payload = body.payload || {};

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Route actions
    switch (action) {
      // 1. Authentication
      case "register":
        return handleRegister(ss, payload);
      case "login":
        return handleLogin(ss, payload);
      case "logout":
        return handleLogout(ss, token);
      case "getMe":
        return handleGetMe(ss, token);

      // 2. Learning Progress (SRS)
      case "getProgress":
        return handleGetProgress(ss, token);
      case "syncProgress":
        return handleSyncProgress(ss, token, payload);

      // 3. Quizzes
      case "saveQuiz":
        return handleSaveQuiz(ss, token, payload);
      case "getQuizHistory":
        return handleGetQuizHistory(ss, token);

      // 4. Settings
      case "getSettings":
        return handleGetSettings(ss, token);
      case "updateSettings":
        return handleUpdateSettings(ss, token, payload);

      // 5. Profiles & Titles
      case "getProfile":
        return handleGetProfile(ss, token);
      case "updateProfile":
        return handleUpdateProfile(ss, token, payload);
      case "getUserTitles":
        return handleGetUserTitles(ss, token);
      case "unlockTitle":
        return handleUnlockTitle(ss, token, payload);

      // 6. Daily Quests / Missions
      case "getDailyQuests":
        return handleGetDailyQuests(ss, token, payload);
      case "updateQuestProgress":
        return handleUpdateQuestProgress(ss, token, payload);
      case "claimQuestReward":
        return handleClaimQuestReward(ss, token, payload);

      // 7. One-time Migration from V1/V2 JSON Backup
      case "importBackup":
        return handleImportBackup(ss, token, payload);

      default:
        return jsonResponse({ success: false, error: "Aksi tidak dikenal: " + action }, 400);
    }
  } catch (error) {
    return jsonResponse({ success: false, error: "Terjadi kesalahan server: " + error.message }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle HTTP GET requests for health check
 */
function doGet(e) {
  return jsonResponse({
    success: true,
    name: "SinauEnglish V2 Backend API",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
}

/* ==========================================================================
   AUTHENTICATION HANDLERS
   ========================================================================== */

function handleRegister(ss, payload) {
  const email = (payload.email || "").trim().toLowerCase();
  const password = payload.password || "";
  const displayName = (payload.displayName || "").trim() || email.split("@")[0];

  if (!email || !email.includes("@")) {
    return jsonResponse({ success: false, error: "Format email tidak valid." }, 400);
  }
  if (!password || password.length < 6) {
    return jsonResponse({ success: false, error: "Password minimal harus 6 karakter." }, 400);
  }

  const sheet = ss.getSheetByName(SHEETS.USERS);
  if (!sheet) return jsonResponse({ success: false, error: "Tabel Users belum dibuat. Jalankan setup() dulu." }, 500);

  const data = sheet.getDataRange().getValues();
  // Check if email already registered (column 1 = email, 0-indexed)
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === email) {
      return jsonResponse({ success: false, error: "Email sudah terdaftar. Silakan login." }, 409);
    }
  }

  const userId = "u_" + Utilities.getUuid().replace(/-/g, "").slice(0, 16);
  const salt = Utilities.getUuid().replace(/-/g, "");
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();

  sheet.appendRow([userId, email, displayName, passwordHash, salt, now, now]);

  // Automatically create a session for immediate login
  const token = createSession(ss, userId);

  return jsonResponse({
    success: true,
    message: "Pendaftaran berhasil.",
    data: {
      token: token,
      user: { id: userId, email: email, displayName: displayName }
    }
  });
}

function handleLogin(ss, payload) {
  const email = (payload.email || "").trim().toLowerCase();
  const password = payload.password || "";

  if (!email || !password) {
    return jsonResponse({ success: false, error: "Email dan password wajib diisi." }, 400);
  }

  // Rate limit check
  const cache = CacheService.getScriptCache();
  const rateKey = "ratelimit_login_" + email;
  const attempts = Number(cache.get(rateKey) || 0);
  if (attempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
    return jsonResponse({ success: false, error: "Terlalu banyak percobaan login yang gagal. Silakan tunggu 15 menit." }, 429);
  }

  const sheet = ss.getSheetByName(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  let userRow = -1;
  let userData = null;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === email) {
      userRow = i + 1;
      userData = {
        id: data[i][0],
        email: data[i][1],
        displayName: data[i][2],
        passwordHash: data[i][3],
        salt: data[i][4]
      };
      break;
    }
  }

  if (!userData) {
    cache.put(rateKey, String(attempts + 1), CONFIG.RATE_LIMIT_WINDOW_SEC);
    return jsonResponse({ success: false, error: "Email atau password salah." }, 401);
  }

  const computedHash = hashPassword(password, userData.salt);
  if (computedHash !== userData.passwordHash) {
    cache.put(rateKey, String(attempts + 1), CONFIG.RATE_LIMIT_WINDOW_SEC);
    return jsonResponse({ success: false, error: "Email atau password salah." }, 401);
  }

  // Clear rate limit counter on success
  cache.remove(rateKey);

  // Update last_login
  sheet.getRange(userRow, 7).setValue(new Date().toISOString());

  // Issue new session token
  const token = createSession(ss, userData.id);

  return jsonResponse({
    success: true,
    message: "Login berhasil.",
    data: {
      token: token,
      user: { id: userData.id, email: userData.email, displayName: userData.displayName }
    }
  });
}

function handleLogout(ss, token) {
  if (!token) return jsonResponse({ success: true, message: "Logged out." });

  const tokenHash = hashToken(token);
  const sheet = ss.getSheetByName(SHEETS.SESSIONS);
  if (sheet) {
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === tokenHash) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
  }

  const cache = CacheService.getScriptCache();
  cache.remove("sess_" + tokenHash);

  return jsonResponse({ success: true, message: "Sesi berhasil ditutup." });
}

function handleGetMe(ss, token) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid atau telah berakhir." }, 401);

  const sheet = ss.getSheetByName(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return jsonResponse({
        success: true,
        data: {
          id: data[i][0],
          email: data[i][1],
          displayName: data[i][2],
          createdAt: data[i][5]
        }
      });
    }
  }

  return jsonResponse({ success: false, error: "Pengguna tidak ditemukan." }, 404);
}

/* ==========================================================================
   PROGRESS & SRS HANDLERS
   ========================================================================== */

function handleGetProgress(ss, token) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const sheet = ss.getSheetByName(SHEETS.PROGRESS);
  if (!sheet) return jsonResponse({ success: true, data: { items: {} } });

  const data = sheet.getDataRange().getValues();
  const progressMap = {};

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      const wordId = data[i][1];
      progressMap[wordId] = {
        wordId: wordId,
        level: data[i][2],
        masteryStage: data[i][3],
        nextReviewAt: data[i][4],
        correctCount: Number(data[i][5]) || 0,
        wrongCount: Number(data[i][6]) || 0,
        updatedAt: data[i][7]
      };
    }
  }

  return jsonResponse({ success: true, data: { items: progressMap } });
}

function handleSyncProgress(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const updates = payload.updates || [];
  if (!Array.isArray(updates) || updates.length === 0) {
    return jsonResponse({ success: true, message: "Tidak ada pembaruan.", count: 0 });
  }

  const sheet = ss.getSheetByName(SHEETS.PROGRESS);
  const data = sheet.getDataRange().getValues();
  const rowMap = new Map();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      rowMap.set(data[i][1], i + 1); // map word_id -> 1-based row index
    }
  }

  const now = new Date().toISOString();
  const newRows = [];

  updates.forEach(u => {
    const wordId = u.wordId;
    const level = u.level || "A1";
    const masteryStage = u.masteryStage || "learning";
    const nextReviewAt = u.nextReviewAt || now;
    const correctCount = Number(u.correctCount) || 0;
    const wrongCount = Number(u.wrongCount) || 0;

    if (rowMap.has(wordId)) {
      const rowIdx = rowMap.get(wordId);
      sheet.getRange(rowIdx, 3, 1, 6).setValues([[level, masteryStage, nextReviewAt, correctCount, wrongCount, now]]);
    } else {
      newRows.push([userId, wordId, level, masteryStage, nextReviewAt, correctCount, wrongCount, now]);
    }
  });

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, 8).setValues(newRows);
  }

  return jsonResponse({ success: true, message: "Progres berhasil disinkronkan.", count: updates.length });
}

/* ==========================================================================
   QUIZ ATTEMPTS HANDLERS
   ========================================================================== */

function handleSaveQuiz(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const topicId = payload.topicId || "general";
  const score = Number(payload.score) || 0;
  const total = Number(payload.total) || 0;
  const now = new Date().toISOString();

  const sheet = ss.getSheetByName(SHEETS.QUIZ);
  sheet.appendRow([userId, topicId, score, total, now]);

  return jsonResponse({ success: true, message: "Hasil kuis tersimpan." });
}

function handleGetQuizHistory(ss, token) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const sheet = ss.getSheetByName(SHEETS.QUIZ);
  const data = sheet.getDataRange().getValues();
  const history = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      history.push({
        topicId: data[i][1],
        score: Number(data[i][2]),
        total: Number(data[i][3]),
        takenAt: data[i][4]
      });
    }
  }

  return jsonResponse({ success: true, data: { history: history } });
}

/* ==========================================================================
   SETTINGS HANDLERS
   ========================================================================== */

function handleGetSettings(ss, token) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const sheet = ss.getSheetByName(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();
  const settings = { dailyGoal: 10, theme: "light" };

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      settings[data[i][1]] = data[i][2];
    }
  }

  return jsonResponse({ success: true, data: { settings: settings } });
}

function handleUpdateSettings(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const settings = payload.settings || {};
  const sheet = ss.getSheetByName(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();

  Object.keys(settings).forEach(key => {
    let rowIdx = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId && data[i][1] === key) {
        rowIdx = i + 1;
        break;
      }
    }
    if (rowIdx > 0) {
      sheet.getRange(rowIdx, 3).setValue(String(settings[key]));
    } else {
      sheet.appendRow([userId, key, String(settings[key])]);
    }
  });

  return jsonResponse({ success: true, message: "Pengaturan tersimpan." });
}

/* ==========================================================================
   BACKUP IMPORT MIGRATION HANDLER
   ========================================================================== */

function handleImportBackup(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const backupData = payload.backup || {};
  const wordProgress = backupData.wordProgress || backupData.progress || {};
  const words = Object.keys(wordProgress);

  if (words.length === 0) {
    return jsonResponse({ success: false, error: "File cadangan tidak berisi data progres yang valid." }, 400);
  }

  const updates = words.map(wId => {
    const item = wordProgress[wId];
    return {
      wordId: wId,
      level: item.level || "A1",
      masteryStage: item.masteryStage || item.stage || "learning",
      nextReviewAt: item.nextReviewAt || item.nextReview || new Date().toISOString(),
      correctCount: item.correctCount || (item.repetitions || 0),
      wrongCount: item.wrongCount || (item.lapses || 0)
    };
  });

  return handleSyncProgress(ss, token, { updates: updates });
}

/* ==========================================================================
   PROFILES & TITLES HANDLERS (NON-DESTRUCTIVE MIGRATION)
   ========================================================================== */

function ensureProfilesAndTitlesSheets(ss) {
  let profileSheet = ss.getSheetByName(SHEETS.PROFILES);
  if (!profileSheet) {
    profileSheet = ss.insertSheet(SHEETS.PROFILES);
    profileSheet.appendRow(["user_id", "display_name", "active_title", "xp", "streak", "coins", "last_active_date", "avatar_key"]);
    const hRange = profileSheet.getRange(1, 1, 1, 8);
    hRange.setFontWeight("bold");
    hRange.setBackground("#4B5E73");
    hRange.setFontColor("#FFFFFF");
    profileSheet.setFrozenRows(1);
    [180, 180, 200, 100, 80, 100, 200, 120].forEach((w, idx) => profileSheet.setColumnWidth(idx + 1, w));
  }

  let titleSheet = ss.getSheetByName(SHEETS.TITLES);
  if (!titleSheet) {
    titleSheet = ss.insertSheet(SHEETS.TITLES);
    titleSheet.appendRow(["user_id", "title_id", "unlocked_at"]);
    const hRange = titleSheet.getRange(1, 1, 1, 3);
    hRange.setFontWeight("bold");
    hRange.setBackground("#4B5E73");
    hRange.setFontColor("#FFFFFF");
    titleSheet.setFrozenRows(1);
    [180, 180, 200].forEach((w, idx) => titleSheet.setColumnWidth(idx + 1, w));
  }

  return { profileSheet, titleSheet };
}

function handleGetProfile(ss, token) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const { profileSheet, titleSheet } = ensureProfilesAndTitlesSheets(ss);
  const pData = profileSheet.getDataRange().getValues();
  let userProfile = null;

  for (let i = 1; i < pData.length; i++) {
    if (pData[i][0] === userId) {
      userProfile = {
        userId: pData[i][0],
        displayName: pData[i][1],
        activeTitle: pData[i][2],
        xp: Number(pData[i][3]) || 0,
        streak: Number(pData[i][4]) || 1,
        coins: Number(pData[i][5]) || 0,
        lastActiveDate: pData[i][6],
        avatarKey: pData[i][7] || "avatar_1"
      };
      break;
    }
  }

  const now = new Date().toISOString();

  // If profile not yet created in Profiles table, generate default profile
  if (!userProfile) {
    let name = "Pelajar Sinau";
    const userSheet = ss.getSheetByName(SHEETS.USERS);
    if (userSheet) {
      const uData = userSheet.getDataRange().getValues();
      for (let i = 1; i < uData.length; i++) {
        if (uData[i][0] === userId) {
          name = uData[i][2] || name;
          break;
        }
      }
    }

    userProfile = {
      userId: userId,
      displayName: name,
      activeTitle: "word_explorer",
      xp: 50,
      streak: 1,
      coins: 50,
      lastActiveDate: now,
      avatarKey: "avatar_1"
    };

    profileSheet.appendRow([
      userId,
      userProfile.displayName,
      userProfile.activeTitle,
      userProfile.xp,
      userProfile.streak,
      userProfile.coins,
      userProfile.lastActiveDate,
      userProfile.avatarKey
    ]);

    // Unlock default initial starter title
    titleSheet.appendRow([userId, "word_explorer", now]);
  }

  // Fetch unlocked titles for this user
  const tData = titleSheet.getDataRange().getValues();
  const unlockedTitles = [];
  for (let i = 1; i < tData.length; i++) {
    if (tData[i][0] === userId) {
      unlockedTitles.push({
        titleId: tData[i][1],
        unlockedAt: tData[i][2]
      });
    }
  }

  return jsonResponse({
    success: true,
    data: {
      profile: userProfile,
      unlockedTitles: unlockedTitles
    }
  });
}

function handleUpdateProfile(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const { profileSheet } = ensureProfilesAndTitlesSheets(ss);
  const pData = profileSheet.getDataRange().getValues();
  let rowIdx = -1;

  for (let i = 1; i < pData.length; i++) {
    if (pData[i][0] === userId) {
      rowIdx = i + 1;
      break;
    }
  }

  const now = new Date().toISOString();

  if (rowIdx > 0) {
    if (payload.displayName) profileSheet.getRange(rowIdx, 2).setValue(String(payload.displayName).trim());
    if (payload.activeTitle) profileSheet.getRange(rowIdx, 3).setValue(String(payload.activeTitle));
    if (payload.xp !== undefined) profileSheet.getRange(rowIdx, 4).setValue(Number(payload.xp));
    if (payload.streak !== undefined) profileSheet.getRange(rowIdx, 5).setValue(Number(payload.streak));
    if (payload.coins !== undefined) profileSheet.getRange(rowIdx, 6).setValue(Number(payload.coins));
    profileSheet.getRange(rowIdx, 7).setValue(now);
    if (payload.avatarKey) profileSheet.getRange(rowIdx, 8).setValue(String(payload.avatarKey));
  } else {
    profileSheet.appendRow([
      userId,
      payload.displayName || "Pelajar Sinau",
      payload.activeTitle || "word_explorer",
      payload.xp !== undefined ? Number(payload.xp) : 50,
      payload.streak !== undefined ? Number(payload.streak) : 1,
      payload.coins !== undefined ? Number(payload.coins) : 50,
      now,
      payload.avatarKey || "avatar_1"
    ]);
  }

  // Update display_name in Users table as well
  if (payload.displayName) {
    const userSheet = ss.getSheetByName(SHEETS.USERS);
    if (userSheet) {
      const uData = userSheet.getDataRange().getValues();
      for (let i = 1; i < uData.length; i++) {
        if (uData[i][0] === userId) {
          userSheet.getRange(i + 1, 3).setValue(String(payload.displayName).trim());
          break;
        }
      }
    }
  }

  return jsonResponse({
    success: true,
    message: "Profil berhasil diperbarui."
  });
}

function handleGetUserTitles(ss, token) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const { titleSheet } = ensureProfilesAndTitlesSheets(ss);
  const data = titleSheet.getDataRange().getValues();
  const titles = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      titles.push({
        titleId: data[i][1],
        unlockedAt: data[i][2]
      });
    }
  }

  return jsonResponse({
    success: true,
    data: { titles: titles }
  });
}

function handleUnlockTitle(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const titleId = payload.titleId;
  if (!titleId) return jsonResponse({ success: false, error: "Title ID tidak valid." }, 400);

  const { titleSheet } = ensureProfilesAndTitlesSheets(ss);
  const data = titleSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId && data[i][1] === titleId) {
      return jsonResponse({ success: true, message: "Gelar sudah terbuka sebelumnya." });
    }
  }

  const now = new Date().toISOString();
  titleSheet.appendRow([userId, titleId, now]);

  return jsonResponse({
    success: true,
    message: "Gelar berhasil dibuka!",
    data: { titleId: titleId, unlockedAt: now }
  });
}

/* ==========================================================================
   DAILY QUESTS / MISSIONS HANDLERS (NON-DESTRUCTIVE MIGRATION)
   ========================================================================== */

function ensureQuestsSheet(ss) {
  let questSheet = ss.getSheetByName(SHEETS.QUESTS);
  if (!questSheet) {
    questSheet = ss.insertSheet(SHEETS.QUESTS);
    questSheet.appendRow(["user_id", "date_str", "quest_id", "progress", "target", "is_completed", "claimed_at"]);
    const hRange = questSheet.getRange(1, 1, 1, 7);
    hRange.setFontWeight("bold");
    hRange.setBackground("#4B5E73");
    hRange.setFontColor("#FFFFFF");
    questSheet.setFrozenRows(1);
    [180, 120, 180, 80, 80, 100, 200].forEach((w, idx) => questSheet.setColumnWidth(idx + 1, w));
  }
  return questSheet;
}

function handleGetDailyQuests(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const dateStr = payload.dateStr || new Date().toISOString().slice(0, 10);
  const questSheet = ensureQuestsSheet(ss);
  const data = questSheet.getDataRange().getValues();
  const quests = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId && String(data[i][1]) === dateStr) {
      quests.push({
        userId: data[i][0],
        dateStr: data[i][1],
        questId: data[i][2],
        progress: Number(data[i][3]) || 0,
        target: Number(data[i][4]) || 1,
        isCompleted: Boolean(data[i][5]),
        claimedAt: data[i][6] || null
      });
    }
  }

  return jsonResponse({
    success: true,
    data: { dateStr: dateStr, quests: quests }
  });
}

function handleUpdateQuestProgress(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const dateStr = payload.dateStr || new Date().toISOString().slice(0, 10);
  const questId = payload.questId;
  const progress = Number(payload.progress) || 0;
  const target = Number(payload.target) || 1;
  const isCompleted = progress >= target;

  const questSheet = ensureQuestsSheet(ss);
  const data = questSheet.getDataRange().getValues();
  let rowIdx = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId && String(data[i][1]) === dateStr && data[i][2] === questId) {
      rowIdx = i + 1;
      break;
    }
  }

  if (rowIdx > 0) {
    questSheet.getRange(rowIdx, 4).setValue(progress);
    questSheet.getRange(rowIdx, 6).setValue(isCompleted);
  } else {
    questSheet.appendRow([userId, dateStr, questId, progress, target, isCompleted, ""]);
  }

  return jsonResponse({
    success: true,
    data: { questId, progress, isCompleted }
  });
}

function handleClaimQuestReward(ss, token, payload) {
  const userId = validateSession(ss, token);
  if (!userId) return jsonResponse({ success: false, error: "Sesi tidak valid." }, 401);

  const dateStr = payload.dateStr || new Date().toISOString().slice(0, 10);
  const questId = payload.questId;
  const xpReward = Number(payload.xpReward) || 35;
  const coinsReward = Number(payload.coinsReward) || 15;

  const questSheet = ensureQuestsSheet(ss);
  const data = questSheet.getDataRange().getValues();
  let rowIdx = -1;
  let alreadyClaimed = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId && String(data[i][1]) === dateStr && data[i][2] === questId) {
      rowIdx = i + 1;
      if (data[i][6]) alreadyClaimed = true;
      break;
    }
  }

  if (alreadyClaimed) {
    return jsonResponse({ success: false, error: "Hadiah misi sudah diklaim sebelumnya." }, 400);
  }

  const now = new Date().toISOString();
  if (rowIdx > 0) {
    questSheet.getRange(rowIdx, 6).setValue(true);
    questSheet.getRange(rowIdx, 7).setValue(now);
  } else {
    questSheet.appendRow([userId, dateStr, questId, 1, 1, true, now]);
  }

  // Update profile XP & Coins
  const { profileSheet } = ensureProfilesAndTitlesSheets(ss);
  const pData = profileSheet.getDataRange().getValues();
  let pRowIdx = -1;
  let currentXp = 50;
  let currentCoins = 50;

  for (let i = 1; i < pData.length; i++) {
    if (pData[i][0] === userId) {
      pRowIdx = i + 1;
      currentXp = Number(pData[i][3]) || 0;
      currentCoins = Number(pData[i][5]) || 0;
      break;
    }
  }

  const newXp = currentXp + xpReward;
  const newCoins = currentCoins + coinsReward;

  if (pRowIdx > 0) {
    profileSheet.getRange(pRowIdx, 4).setValue(newXp);
    profileSheet.getRange(pRowIdx, 6).setValue(newCoins);
    profileSheet.getRange(pRowIdx, 7).setValue(now);
  }

  return jsonResponse({
    success: true,
    message: "Hadiah misi berhasil diklaim!",
    data: {
      questId: questId,
      claimedAt: now,
      xpEarned: xpReward,
      coinsEarned: coinsReward,
      totalXp: newXp,
      totalCoins: newCoins
    }
  });
}

/* ==========================================================================
   SECURITY & UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Creates a cryptographically random token, hashes it, and stores it in Sessions
 */
function createSession(ss, userId) {
  const rawToken = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + CONFIG.TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const sheet = ss.getSheetByName(SHEETS.SESSIONS);
  sheet.appendRow([tokenHash, userId, expiresAt]);

  // Cache user_id by tokenHash
  const cache = CacheService.getScriptCache();
  cache.put("sess_" + tokenHash, userId, CONFIG.CACHE_TTL_SEC);

  return rawToken;
}

/**
 * Validates session token, returning user_id or null if expired/invalid
 */
function validateSession(ss, token) {
  if (!token) return null;

  const tokenHash = hashToken(token);
  const cache = CacheService.getScriptCache();
  const cachedUserId = cache.get("sess_" + tokenHash);
  if (cachedUserId) return cachedUserId;

  const sheet = ss.getSheetByName(SHEETS.SESSIONS);
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === tokenHash) {
      const expiresAt = data[i][2];
      if (expiresAt > now) {
        const userId = data[i][1];
        cache.put("sess_" + tokenHash, userId, CONFIG.CACHE_TTL_SEC);
        return userId;
      }
      // Expired session
      return null;
    }
  }

  return null;
}

/**
 * Hashes session token with SHA-256
 */
function hashToken(token) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8);
  return bytesToHex(rawHash);
}

/**
 * Hashes password using Salt + SHA-256 with 5,000 iterations
 */
function hashPassword(password, salt) {
  let combined = salt + ":" + password;
  let hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined, Utilities.Charset.UTF_8);

  for (let i = 1; i < CONFIG.HASH_ITERATIONS; i++) {
    hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, hashBytes);
  }

  return bytesToHex(hashBytes);
}

/**
 * Helper to convert byte array to hex string
 */
function bytesToHex(bytes) {
  return bytes.map(function(byte) {
    const v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("");
}

/**
 * Returns JSON response with appropriate headers
 */
function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/* ==========================================================================
   ONE-TIME DATABASE SETUP FUNCTION
   Run this once from the Apps Script Editor toolbar (`setupDatabase`)
   ========================================================================== */

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const tables = [
    {
      name: "Users",
      headers: ["id", "email", "display_name", "password_hash", "salt", "created_at", "last_login"],
      columnWidths: [180, 220, 180, 260, 260, 200, 200]
    },
    {
      name: "Sessions",
      headers: ["token_hash", "user_id", "expires_at"],
      columnWidths: [260, 180, 200]
    },
    {
      name: "Progress",
      headers: ["user_id", "word_id", "level", "mastery_stage", "next_review_at", "correct_count", "wrong_count", "updated_at"],
      columnWidths: [180, 140, 80, 120, 200, 100, 100, 200]
    },
    {
      name: "QuizAttempts",
      headers: ["user_id", "topic_id", "score", "total", "taken_at"],
      columnWidths: [180, 180, 80, 80, 200]
    },
    {
      name: "Settings",
      headers: ["user_id", "key", "value"],
      columnWidths: [180, 160, 240]
    },
    {
      name: "Profiles",
      headers: ["user_id", "display_name", "active_title", "xp", "streak", "coins", "last_active_date", "avatar_key"],
      columnWidths: [180, 180, 200, 100, 80, 100, 200, 120]
    },
    {
      name: "Titles",
      headers: ["user_id", "title_id", "unlocked_at"],
      columnWidths: [180, 180, 200]
    },
    {
      name: "Quests",
      headers: ["user_id", "date_str", "quest_id", "progress", "target", "is_completed", "claimed_at"],
      columnWidths: [180, 120, 180, 80, 80, 100, 200]
    }
  ];

  tables.forEach(table => {
    let sheet = ss.getSheetByName(table.name);
    if (!sheet) {
      sheet = ss.insertSheet(table.name);
    }

    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(table.headers);
      const headerRange = sheet.getRange(1, 1, 1, table.headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4B5E73");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);

      table.columnWidths.forEach((width, idx) => {
        sheet.setColumnWidth(idx + 1, width);
      });
    }
  });

  // Remove default "Sheet1" if empty and other sheets exist
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {
      // Ignore if cannot delete
    }
  }

  Logger.log("✅ SinauEnglish V2 Database setup completed successfully!");
}

