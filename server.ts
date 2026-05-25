import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SessionService } from "./server/modules/session/session.service";
import sessionRoutes from "./server/modules/session/session.routes";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "smart-doctor-ai-super-secret-key-2026-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "smart-doctor-ai-refresh-secret-key-2026-production";

function signAccessToken(user: any, sessionId?: string) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name_ar: user.name_ar,
      name_en: user.name_en,
      sessionId: sessionId || ""
    },
    JWT_SECRET,
    { expiresIn: "15m" } // Access Token expires in 15 minutes
  );
}

function signRefreshToken(user: any, sessionId: string) {
  return jwt.sign(
    {
      id: user.id,
      sessionId
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Refresh Token expires in 7 days
  );
}

function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database initialization and helpers
  const dbPath = path.join(process.cwd(), "site-db.json");
  const defaultDbPath = path.join(process.cwd(), "src", "defaultDb.json");

  // Load or initialize site-db.json
  if (!fs.existsSync(dbPath)) {
    try {
      if (fs.existsSync(defaultDbPath)) {
        fs.copyFileSync(defaultDbPath, dbPath);
        console.log("Initialized site-db.json from default template.");
      } else {
        fs.writeFileSync(dbPath, JSON.stringify({ articles: [], vpnOffers: [], rdpOffers: [] }, null, 2));
        console.log("Created empty database structure.");
      }
    } catch (e) {
      console.error("Failed to initialize site-db.json template:", e);
    }
  }

  const getDb = () => {
    try {
      let db: any = {};
      if (fs.existsSync(dbPath)) {
        db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      } else if (fs.existsSync(defaultDbPath)) {
        db = JSON.parse(fs.readFileSync(defaultDbPath, "utf-8"));
      } else {
        db = { articles: [], vpnOffers: [], rdpOffers: [] };
      }

      // Ensure standard arrays and properties exist
      if (!db.articles) db.articles = [];
      if (!db.vpnOffers) db.vpnOffers = [];
      if (!db.rdpOffers) db.rdpOffers = [];
      
      // Ensure settings exist
      if (!db.settings) {
        db.settings = {
          siteName_ar: "طبيب الإنترنت الذكي AI",
          siteName_en: "Smart Internet Doctor AI",
          contactEmail: "support@smartinternetdoctor.com",
          maintenanceMode: false,
          requireTwoFactor: false,
          aiEngineModel: "gemini-3.5-flash",
          lastChecked: new Date().toISOString()
        };
      }

      // Ensure users exist
      if (!db.users || db.users.length === 0) {
        db.users = [
          {
            id: "u-1",
            email: "superadmin@doctor.com",
            password: bcrypt.hashSync("superadmin2026", 10),
            role: "super_admin",
            name_ar: "المدير العام للموقع",
            name_en: "Super Administrator",
            createdAt: new Date().toISOString()
          },
          {
            id: "u-2",
            email: "admin@doctor.com",
            password: bcrypt.hashSync("admin2026", 10),
            role: "admin",
            name_ar: "مدير العروض والترويج",
            name_en: "Offers Administrator",
            createdAt: new Date().toISOString()
          },
          {
            id: "u-3",
            email: "editor@doctor.com",
            password: bcrypt.hashSync("editor2026", 10),
            role: "editor",
            name_ar: "محرر المقالات التقنية",
            name_en: "Technical Article Editor",
            createdAt: new Date().toISOString()
          },
          {
            id: "u-4",
            email: "user@doctor.com",
            password: bcrypt.hashSync("user2026", 10),
            role: "user",
            name_ar: "زائر مفوض (مستخدم)",
            name_en: "Standard Regular User",
            createdAt: new Date().toISOString()
          }
        ];
        // Save immediately to persist
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      }

      return db;
    } catch (error) {
      console.error("Failed reading database, falling back:", error);
      return {
        articles: [],
        vpnOffers: [],
        rdpOffers: [],
        users: [],
        settings: { siteName_ar: "طبيب الإنترنت", siteName_en: "Smart Internet Doctor AI" }
      };
    }
  };

  const saveDb = (data: any) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error("Failed writing site database:", error);
      return false;
    }
  };

  // Enable JSON request body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global Request Logging Middleware
  app.use((req, res, next) => {
    console.log(`[BACKEND REQUEST] Method: ${req.method} | URL: ${req.url}`);
    next();
  });

  // API Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // Get full configurable database (stripping credentials for security)
  app.get("/api/site-data", (req, res) => {
    const db = getDb();
    const safeData = {
      articles: db.articles || [],
      vpnOffers: db.vpnOffers || [],
      rdpOffers: db.rdpOffers || [],
      settings: db.settings ? { siteName_ar: db.settings.siteName_ar, siteName_en: db.settings.siteName_en } : undefined
    };
    res.json(safeData);
  });

  // Dedicated Authentication Endpoint Method Check & Logger
  app.all("/api/auth/login", (req, res, next) => {
    console.log(`[LOGIN ENDPOINT HIT] Method: ${req.method} | URL: ${req.url}`);
    if (req.method !== "POST") {
      console.warn(`[METHOD MISMATCH] Received ${req.method} on login route instead of POST`);
      return res.status(405).json({
        error: "Method Not Allowed",
        message: `Authentication endpoint only supports POST requests. Received: ${req.method}`
      });
    }
    next();
  });

  // Dedicated Authentication Endpoint
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are both strictly required" });
    }

    const db = getDb();
    const user = (db.users || []).find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    console.log("LOGIN EMAIL:", email);

    console.log(
      "USERS:",
      (db.users || []).map((u:any) => ({
        email: u.email,
        role: u.role
      }))
    );

    console.log("FOUND USER:", !!user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password combination" });
    }

    // Compare bcrypt hashing
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    console.log("PASSWORD VALID:", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password combination" });
    }

    // Design Session
    const sessionId = "s-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
    
    // Generate short-lived Access Token (15 minutes) and long-lived Refresh Token (7 days)
    const accessToken = signAccessToken(user, sessionId);
    const refreshToken = signRefreshToken(user, sessionId);

    const userAgent = req.headers["user-agent"] || "unknown";
    const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";

    // Use production session module to track and persist metadata + tokens
    const sService = new SessionService();
    console.log("CREATING SESSION...");
    sService.createSession(
      user.id,
      refreshToken,
      typeof ip === "string" ? ip : JSON.stringify(ip),
      typeof userAgent === "string" ? userAgent : JSON.stringify(userAgent),
      sessionId
    );

    res.json({
      success: true,
      accessToken,
      refreshToken,
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name_ar: user.name_ar,
        name_en: user.name_en
      }
    });
  });

  // POST /api/auth/refresh
  app.post("/api/auth/refresh", (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is strictly required" });
    }

    try {
      // 1. Verify token signature with JWT_REFRESH_SECRET
      const decoded = verifyRefreshToken(refreshToken) as any;
      if (!decoded || !decoded.sessionId || !decoded.id) {
        return res.status(401).json({ error: "Invalid refresh token structure" });
      }

      // 2. Validate session exists and is not revoked/expired
      const db = getDb();
      const session = (db.sessions || []).find((s: any) => s.id === decoded.sessionId);
      
      if (!session) {
        return res.status(401).json({ error: "Session context not found on our server" });
      }

      if (session.revoked) {
        return res.status(401).json({ error: "Your session active status was revoked" });
      }

      if (new Date(session.expiresAt).getTime() < Date.now()) {
        return res.status(401).json({ error: "Your session active status has expired" });
      }

      // 3. Ensure refresh token matches the most recently stored session token
      const incomingHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const isMatch = session.refreshTokenHash 
        ? session.refreshTokenHash === incomingHash 
        : session.refreshToken === refreshToken;

      if (!isMatch) {
        // Strict Security Mechanism: Token reuse is detected! Clear all sessions of this user as defense
        console.warn(`[SECURITY BREACH] Refresh token reuse detected for session ${decoded.sessionId}. Revoking all user sessions.`);
        db.sessions = (db.sessions || []).map((s: any) => {
          if (s.userId === decoded.id) {
            return { ...s, revoked: true };
          }
          return s;
        });
        saveDb(db);
        return res.status(401).json({ error: "Security Warning: Refresh token reuse detected. All sessions revoked." });
      }

      // 4. Retrieve user record directly from database (ensuring server holds truth)
      const user = (db.users || []).find((u: any) => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ error: "Authorized session user no longer exists" });
      }

      // 5. Generate a new rotated Access Token only (rotation-safe)
      const accessToken = signAccessToken(user, decoded.sessionId);

      // 6. Update last active timestamp
      session.lastActiveAt = new Date().toISOString();
      saveDb(db);

      res.json({
        success: true,
        accessToken
      });
    } catch (err) {
      console.error("Refresh token validation failed:", err);
      return res.status(401).json({ error: "Invalid or expired session credentials" });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID parameter is strictly required to process logout" });
    }

    const db = getDb();
    const sessionIdx = (db.sessions || []).findIndex((s: any) => s.id === sessionId);
    if (sessionIdx !== -1) {
      db.sessions[sessionIdx].revoked = true;
      saveDb(db);
    }

    res.json({ success: true, message: "Target session revoked and logged out successfully" });
  });

  // JWT Verification Middleware: Checks ONLY the access token (short-lived)
  const authMiddleware = (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ error: "Access Denied: No authentication token supplied" });
      }

      const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
      if (!token) {
        return res.status(401).json({ error: "Access Denied: Malformed token format" });
      }

      // Verify Access token to ensure it has not expired
      const decoded = verifyAccessToken(token) as any;
      
      // Strict DB-level Session Validation check
      // Ensure the associated sessionId inside the access token is not revoked!
      if (decoded.sessionId) {
        const db = getDb();
        const activeSession = (db.sessions || []).find((s: any) => s.id === decoded.sessionId);
        if (!activeSession || activeSession.revoked || new Date(activeSession.expiresAt).getTime() < Date.now()) {
          return res.status(401).json({ error: "Your session active status has been invalidated or revoked." });
        }
      }

      req.user = decoded;
      next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
        console.log(`[AUTH] JWT access token expired gracefully (Expected behavior, rotation flow will follow): ${err.message}`);
      } else {
        console.error("JWT validation error on backend route:", err.message || err);
      }
      // Explicitly return 401 Unauthorized for client-side interceptors to catch and try token refresh
      return res.status(401).json({ error: "Session expired or invalid token. Please refresh credentials." });
    }
  };

  // Role Protection Middleware
  const allowRoles = (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Access Denied: Missing user credentials" });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: `Access Denied: Role '${req.user.role}' lacks operational privileges for this specific task` 
        });
      }
      next();
    };
  };

  // GET /api/auth/sessions: list all logged-in multi-device connections
  app.get("/api/auth/sessions", authMiddleware, (req: any, res: any) => {
    const db = getDb();
    const list = (db.sessions || [])
      .filter((s: any) => s.userId === req.user.id && !s.revoked && new Date(s.expiresAt).getTime() > Date.now())
      .map((s: any) => ({
        id: s.id,
        userAgent: s.userAgent,
        ip: s.ip,
        createdAt: s.createdAt,
        isCurrent: s.id === req.user.sessionId
      }));
    res.json({ sessions: list });
  });

  // Create endpoint: GET /api/me and GET /api/auth/me
  app.get("/api/me", authMiddleware, (req: any, res: any) => {
    const db = getDb();
    const user = (db.users || []).find((u: any) => u.id === req.user.id);
    if (!user) {
      return res.json({
        id: req.user.id,
        role: req.user.role,
        email: req.user.email,
        name_ar: req.user.name_ar,
        name_en: req.user.name_en,
        sessionId: req.user.sessionId
      });
    }
    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      name_ar: user.name_ar,
      name_en: user.name_en,
      sessionId: req.user.sessionId
    });
  });

  app.get("/api/auth/me", authMiddleware, (req: any, res: any) => {
    const db = getDb();
    const user = (db.users || []).find((u: any) => u.id === req.user.id);
    if (!user) {
      return res.json({
        id: req.user.id,
        role: req.user.role,
        email: req.user.email,
        name_ar: req.user.name_ar,
        name_en: req.user.name_en,
        sessionId: req.user.sessionId
      });
    }
    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      name_ar: user.name_ar,
      name_en: user.name_en,
      sessionId: req.user.sessionId
    });
  });


  // --- PROTECTED ADMIN API ROUTES ----

  // Register the Session Management Dashboard routes
  app.use("/api/admin", sessionRoutes);

  // Users management (Super admin only)
  app.get("/api/admin/users", authMiddleware, allowRoles("super_admin"), (req, res) => {
    const db = getDb();
    // Strip passwords before returning
    const safeUsers = (db.users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      name_ar: u.name_ar,
      name_en: u.name_en,
      createdAt: u.createdAt
    }));
    res.json({ users: safeUsers });
  });

  app.post("/api/admin/users", authMiddleware, allowRoles("super_admin"), (req, res) => {
    const { id, email, password, role, name_ar, name_en } = req.body;
    if (!email || !role || !name_en) {
      return res.status(400).json({ error: "Email, role, and name are required parameters" });
    }

    const db = getDb();
    const existingIdx = (db.users || []).findIndex((u: any) => u.id === id || u.email.toLowerCase() === email.toLowerCase());

    if (existingIdx >= 0) {
      // Update
      const oldCred = db.users[existingIdx];
      db.users[existingIdx] = {
        ...oldCred,
        email,
        role,
        name_ar: name_ar || oldCred.name_ar,
        name_en: name_en || oldCred.name_en,
        password: password ? bcrypt.hashSync(password, 10) : oldCred.password
      };
    } else {
      // Create
      if (!password) {
        return res.status(400).json({ error: "Password is indispensable for establishing new users" });
      }
      const newUser = {
        id: "u-" + Date.now(),
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        name_ar: name_ar || name_en,
        name_en,
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
    }

    if (saveDb(db)) {
      res.json({ success: true, message: "Users base updated seamlessly" });
    } else {
      res.status(500).json({ error: "Could not write credentials to disk filesystem" });
    }
  });

  app.delete("/api/admin/users/:id", authMiddleware, allowRoles("super_admin"), (req: any, res) => {
    const { id } = req.params;
    if (req.user.id === id) {
      return res.status(400).json({ error: "Preventative block: Spontaneous self-deletion is forbidden" });
    }

    const db = getDb();
    const initialLen = db.users.length;
    db.users = (db.users || []).filter((u: any) => u.id !== id);

    if (db.users.length === initialLen) {
      return res.status(404).json({ error: "User targeted for eviction was not found" });
    }

    if (saveDb(db)) {
      res.json({ success: true, message: "Target user evicted successfully" });
    } else {
      res.status(500).json({ error: "Credential database sync failure" });
    }
  });

  // Settings management (Super admin only)
  app.get("/api/admin/settings", authMiddleware, allowRoles("super_admin"), (req, res) => {
    const db = getDb();
    res.json({ settings: db.settings });
  });

  app.post("/api/admin/settings", authMiddleware, allowRoles("super_admin"), (req, res) => {
    const { settings } = req.body;
    if (!settings) {
      return res.status(400).json({ error: "Missing configuration payload" });
    }

    const db = getDb();
    db.settings = { ...db.settings, ...settings, lastChecked: new Date().toISOString() };

    if (saveDb(db)) {
      res.json({ success: true, message: "System configurations hard-saved", settings: db.settings });
    } else {
      res.status(500).json({ error: "Setting storage sync failure" });
    }
  });

  // Analytics endpoint (Super admin and Admin only)
  app.get("/api/admin/analytics", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => {
    const db = getDb();
    res.json({
      analytics: {
        registeredUsers: (db.users || []).length,
        totalArticles: (db.articles || []).length,
        activeVpnOffers: (db.vpnOffers || []).length,
        rdpPackages: (db.rdpOffers || []).length,
        simulatedTestsToday: 142 + Math.floor(Math.random() * 20),
        bandwidthSavedGb: 489.2,
        vpnReferralsCount: 1104,
        averageDiagnosticLatency: "48ms",
        lastChecked: db.settings?.lastChecked || new Date().toISOString()
      }
    });
  });

  // Modifying database contents (Blog allowed for editor, admin & super_admin; offers allowed for admin & super_admin)
  app.post("/api/admin/save-articles", authMiddleware, allowRoles("super_admin", "admin", "editor"), (req, res) => {
    const { articles } = req.body;
    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: "Articles payload must look like a standard array" });
    }
    const db = getDb();
    db.articles = articles;
    if (saveDb(db)) {
      res.json({ success: true, message: "Articles updated on static db schema", articles: db.articles });
    } else {
      res.status(500).json({ error: "Could not save database file on server structure" });
    }
  });

  app.post("/api/admin/save-vpn", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => {
    const { vpnOffers } = req.body;
    if (!Array.isArray(vpnOffers)) {
      return res.status(400).json({ error: "VPN offers payload must look like a standard array" });
    }
    const db = getDb();
    db.vpnOffers = vpnOffers;
    if (saveDb(db)) {
      res.json({ success: true, message: "VPN offers updated", vpnOffers: db.vpnOffers });
    } else {
      res.status(500).json({ error: "Could not save database file on server structure" });
    }
  });

  app.post("/api/admin/save-rdp", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => {
    const { rdpOffers } = req.body;
    if (!Array.isArray(rdpOffers)) {
      return res.status(400).json({ error: "RDP packages payload must look like a standard array" });
    }
    const db = getDb();
    db.rdpOffers = rdpOffers;
    if (saveDb(db)) {
      res.json({ success: true, message: "RDP offers updated", rdpOffers: db.rdpOffers });
    } else {
      res.status(500).json({ error: "Could not save database file on server structure" });
    }
  });

  // AI Connection Diagnostics Endpoint
  app.post("/api/analyze", async (req, res) => {
    const { download, upload, ping, jitter } = req.body;

    const downloadVal = Number(download) || 0;
    const uploadVal = Number(upload) || 0;
    const pingVal = Number(ping) || 0;
    const jitterVal = Number(jitter) || 0;

    // Strict validation to avoid empty inputs
    if (downloadVal <= 0 || uploadVal <= 0) {
      return res.status(400).json({ error: "Invalid speed values" });
    }

    const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasApiKey) {
      try {
        // Lazy initialization of Gemini client
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const prompt = `
          As the "Smart Internet Doctor" (طبيب الإنترنت الذكي), analyze this network speed test:
          - Download Speed: ${downloadVal} Mbps
          - Upload Speed: ${uploadVal} Mbps
          - Ping Latency: ${pingVal} ms
          - Jitter: ${jitterVal} ms

          Generate a detailed technical, user-friendly, cybersecurity-oriented network diagnosis in BOTH English and Arabic.
          Detect specific performance bottlenecks, recommend exact technical fixes (like specified DNS changers, restarting WiFi bands, router location, active downloads), and map the problem to one of these primary VPN recommendations:
          - 'gaming' (if ping/jitter are poor or user needs pure stable gaming routes)
          - 'streaming' (if download/upload is borderline/causes buffering or latency spikes)
          - 'privacy' (if the connection is normal or fast, but requires security coverage and avoiding bandwidth throttle)

          Provide your response strictly structured to match the requested JSON schema.
        `;

        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const generateWithRetry = async (maxRetries = 2, initialDelay = 800) => {
          let attempt = 0;
          while (true) {
            try {
              return await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      diagnosis_en: {
                        type: Type.STRING,
                        description: "Helpful narrative summary of the connection diagnostic results in English."
                      },
                      diagnosis_ar: {
                        type: Type.STRING,
                        description: "Helpful narrative summary of the connection diagnostic results in Arabic."
                      },
                      problems_detected_en: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of specific performance bottlenecks detected in English."
                      },
                      problems_detected_ar: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of specific performance bottlenecks detected in Arabic."
                      },
                      suggested_fixes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title_en: { type: Type.STRING },
                            title_ar: { type: Type.STRING },
                            description_en: { type: Type.STRING },
                            description_ar: { type: Type.STRING },
                            command_or_value: { type: Type.STRING, description: "Actionable configuration like '1.1.1.1', '5 GHz', or 'Router Restart'." }
                          },
                          required: ["title_en", "title_ar", "description_en", "description_ar", "command_or_value"]
                        }
                      },
                      vpn_type_recommended: {
                        type: Type.STRING,
                        description: "Must be exactly 'gaming', 'streaming', or 'privacy'."
                      },
                      vpn_explanation_en: {
                        type: Type.STRING,
                        description: "Clear explanation why this VPN category was chosen in English."
                      },
                      vpn_explanation_ar: {
                        type: Type.STRING,
                        description: "Clear explanation why this VPN category was chosen in Arabic."
                      },
                      network_grade: {
                        type: Type.STRING,
                        description: "A single grade symbol from A+, A, B, C, D, or F."
                      }
                    },
                    required: [
                      "diagnosis_en",
                      "diagnosis_ar",
                      "problems_detected_en",
                      "problems_detected_ar",
                      "suggested_fixes",
                      "vpn_type_recommended",
                      "vpn_explanation_en",
                      "vpn_explanation_ar",
                      "network_grade"
                    ]
                  }
                }
              });
            } catch (err: any) {
              attempt++;
              const errMsg = err?.message || String(err);
              const isTransient = errMsg.includes("553") || // checking custom code strings or:
                                  errMsg.includes("503") || 
                                  errMsg.includes("UNAVAILABLE") || 
                                  errMsg.includes("high demand") || 
                                  errMsg.includes("429") || 
                                  errMsg.includes("RESOURCE_EXHAUSTED") ||
                                  err?.status === 503 ||
                                  err?.status === 429;
              if (isTransient && attempt <= maxRetries) {
                const backoff = initialDelay * Math.pow(2, attempt - 1);
                console.warn(`[Gemini API Transient Error] Attempt ${attempt}/${maxRetries} failed with message: "${errMsg}". Retrying in ${backoff}ms...`);
                await sleep(backoff);
              } else {
                throw err;
              }
            }
          }
        };

        const response = await generateWithRetry();
        const textOutput = response.text || "{}";
        const aiResult = JSON.parse(textOutput.trim());
        return res.json({ aiGenerated: true, ...aiResult });
      } catch (err: any) {
        console.error("Gemini invocation failed, rolling over to built-in diagnostics:", err);
        // Fall over gracefully to the rule-based expert logic to ensure 100% uptime
      }
    }

    // --- EXPERT RULE DIAGNOSTIC ENGINE (Fallback or Default Mode) ---
    // Let's rate network health grade
    let grade = "A";
    let vpnType: "gaming" | "streaming" | "privacy" = "privacy";
    const problemsEn: string[] = [];
    const problemsAr: string[] = [];
    const fixes: any[] = [];

    // Bottleneck analysis
    if (pingVal > 120 || jitterVal > 25) {
      grade = "D";
      vpnType = "gaming";
      problemsEn.push("High wireless noise or long distance response loops identified.");
      problemsAr.push("تم اكتشاف تشويش لاسلكي مرتفع أو زمن استجابة طويل (بينج عالي).");
      
      fixes.push({
        title_en: "Configure Cloudflare Ultra-Low Latency DNS",
        title_ar: "إعداد عناوين DNS فائقة السرعة من Cloudflare",
        description_en: "Update your system primary DNS to Cloudflare speeds to bypass ISP routing bottle-necks.",
        description_ar: "قم بتحديث عناوين DNS الرئيسية بجهازك لتخطي مسارات مزود الخدمة المزدحمة.",
        command_or_value: "1.1.1.1"
      });
      fixes.push({
        title_en: "Switch Connection to 5GHz Band",
        title_ar: "التبديل إلى تردد 5 جيجا هرتز لإشارات الواي فاي",
        description_en: "Standard 2.4GHz network frequency suffers heavy signal collision from neighboring homes.",
        description_ar: "استعمال تردد 2.4 جيجاهرتز يعرض جهازك للتداخل اللاسلكي الكبير من الجيلان.",
        command_or_value: "5 GHz Only"
      });
    } else if (pingVal > 60 || jitterVal > 10) {
      grade = "C";
      vpnType = "gaming";
      problemsEn.push("Moderate latency and mild network variations detected.");
      problemsAr.push("تأخير متوسط وتذبذب طفيف في استقرار الشبكة.");
      
      fixes.push({
        title_en: "Use Google Public Secure DNS",
        title_ar: "استخدام خوادم جوجل الآمنة لتسريع الاستجابة",
        description_en: "Configure standard DNS address filters to secure connection setups.",
        description_ar: "إعداد عناوين خوادم جوجل السريعة لتبسيط عمليات جلب النطاق.",
        command_or_value: "8.8.8.8"
      });
    }

    if (downloadVal < 15) {
      grade = "C";
      vpnType = "streaming";
      problemsEn.push("Underperforming download speeds. Video content may freeze or scale down in quality.");
      problemsAr.push("سرعة التحميل منخفضة ومقيدة. قد تواجه تقطعاً مستمراً في بث الفيديو بجودة عالية.");
      
      fixes.push({
        title_en: "Clear Power Cycle Router Cycle",
        title_ar: "إيقاف التشغيل الكامل للراوتر لتصفية الذاكرة",
        description_en: "Unplug your router electric connector for 30 full seconds to flash stale route histories.",
        description_ar: "افصل مصدر طاقة الراوتر لمدة 30 ثانية لتجديد الاتصال بالمركز الرئيسي ومسح الذاكرة المؤقتة.",
        command_or_value: "Restart Router"
      });
    } else if (downloadVal < 45) {
      if (grade === "A") grade = "B";
      problemsEn.push("Standard level broadband with basic HD streaming bandwidth capacity.");
      problemsAr.push("سعة نطاق عادية تناسب البث الفردي وبث جودة HD القياسية.");
    }

    if (uploadVal < 5) {
      problemsEn.push("Extremely restricted uplink. Backups, file transfers, and video calls will lag.");
      problemsAr.push("سرعة الرفع ضعيفة جداً. قد يؤثر ذلك على مكالمات الفيديو ومزامنة الملفات.");
    }

    // Default perfect diagnostics
    if (problemsEn.length === 0) {
      grade = "A+";
      vpnType = "privacy";
      problemsEn.push("No severe bottlenecks recognized. Broadband speeds comply with premium limits.");
      problemsAr.push("الشبكة تعمل بكفاءة تامة. لا توجد اختناقات تذكر وسرعاتك ممتازة.");
      
      fixes.push({
        title_en: "Enable Ad-Blocking & Tracking Shielder",
        title_ar: "تفعيل جدار حظر الإعلانات وحماية الخصوصية",
        description_en: "Secure your connection to avoid target profile storage by marketing agencies.",
        description_ar: "تأمين اتصالاتك وبيناتك لمنع تتبع نشاطك من وكالات الإعلان.",
        command_or_value: "Mullvad DNS"
      });
    }

    // Explanations depending on chosen VPN Type
    let expEn = "";
    let expAr = "";
    if (vpnType === "gaming") {
      expEn = "A specialized gaming-optimized server bypasses typical internet service provider traffic throttling or congested server jumps to provide direct access links.";
      expAr = "تساعد اتصالات VPN المخصصة للألعاب على تحويل حزم البيانات لمسارات أكثر أمانًا وسرعة مباشرة لخوادم اللعب متخطية الإزدحام.";
    } else if (vpnType === "streaming") {
      expEn = "Streaming-tuned connections employ global servers with hyper-fast caches to securely streamline international video delivery routes without buffer spikes.";
      expAr = "تستخدم خوادم البث المسرعة تقنيات الكاش المتقدمة للتأكد من تدفق الفيديوهات دون تمويه وبأقصى جودة ونقاوة.";
    } else {
      expEn = "Privacy-focused VPN keeps tracking corporations from inspecting your browser and prevents custom broadband throttle profiles from being set up by third parties.";
      expAr = "يحمي حزام الخصوصية الكامل هويتك الرقمية وعنوان IP الخاص بك ويخفي ملف تصفحك لصد هجمات المتسللين وشركات الإعلانات.";
    }

    const diagEn = `Your Smart Internet Doctor diagnostics report indicates a grade '${grade}' tier. ${
      problemsEn.length > 0 ? problemsEn.join(" ") : "All segments are completely tuned."
    }`;
    const diagAr = `تقرير فحص طبيب الإنترنت الذكي يشير لحصول اتصالك على تقييم '${grade}'. ${
      problemsAr.length > 0 ? problemsAr.join(" ") : "جميع مؤشرات اتصالك تعمل بانسجام تام."
    }`;

    // Return rule-based diagnostic payload
    return res.json({
      aiGenerated: false,
      diagnosis_en: diagEn,
      diagnosis_ar: diagAr,
      problems_detected_en: problemsEn,
      problems_detected_ar: problemsAr,
      suggested_fixes: fixes.length > 0 ? fixes : [
        {
          title_en: "Optimized DNS Setup",
          title_ar: "إعداد خوادم DNS المحسنة",
          description_en: "Bypass standard ISP bottlenecks with fast privacy-focused cloud addresses.",
          description_ar: "تجاوز اختناقات مزودي الخدمة بالتبديل السريع لخوادم سحابية آمنة خالية من السجلات.",
          command_or_value: "1.1.1.1"
        }
      ],
      vpn_type_recommended: vpnType,
      vpn_explanation_en: expEn,
      vpn_explanation_ar: expAr,
      network_grade: grade
    });
  });

  // Serve static assets in production, otherwise mount Vite
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Internet Doctor backend listening on client-ingress port ${PORT}`);
  });
}

startServer();
