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
  SETTINGS: "Settings"
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

      // 5. One-time Migration from V1/V2 JSON Backup
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

