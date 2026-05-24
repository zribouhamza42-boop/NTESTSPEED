import { Router } from "express";
import jwt from "jsonwebtoken";
import { SessionController } from "./session.controller";
import { SessionRepository } from "./session.repository";

const router = Router();
const controller = new SessionController();
const repository = new SessionRepository();

const JWT_SECRET = process.env.JWT_SECRET || "smart-doctor-ai-super-secret-key-2026-production";

// Independent highly robust modular JWT validation middleware
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
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // DB-level Session Validation check
    if (decoded.sessionId) {
      const activeSession = repository.getSessionById(decoded.sessionId);
      if (!activeSession || activeSession.revoked || new Date(activeSession.expiresAt).getTime() < Date.now()) {
        return res.status(401).json({ error: "Your session active status has been invalidated or revoked." });
      }
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("JWT validation error in session module middleware:", err.message || err);
    return res.status(401).json({ error: "Session expired or invalid token." });
  }
};

// Role authorization filter
const allowRoles = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Access Denied: Missing credentials" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access Denied: Role '${req.user.role}' lacks privileges for session auditing` 
      });
    }
    next();
  };
};

// GET /api/admin/sessions - Returns all active sessions (Only super_admin)
router.get("/sessions", authMiddleware, allowRoles("super_admin"), (req, res) => controller.getAllSessions(req, res));

// GET /api/admin/sessions/history - Returns overall logins audit trails (super_admin + admin)
router.get("/sessions/history", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => controller.getSessionHistory(req, res));

// GET /api/admin/sessions/:userId - Returns user-specific sessions (super_admin + admin)
router.get("/sessions/:userId", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => controller.getUserSessions(req, res));

// DELETE /api/admin/sessions/session/:sessionId - Force disconnects a specific session (super_admin + admin)
router.delete("/sessions/session/:sessionId", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => controller.revokeSession(req, res));

// DELETE /api/admin/sessions/user/:userId - Disconnects all user device nodes (super_admin + admin)
router.delete("/sessions/user/:userId", authMiddleware, allowRoles("super_admin", "admin"), (req, res) => controller.revokeAllUserSessions(req, res));

export default router;
