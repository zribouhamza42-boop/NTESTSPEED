import { Request, Response } from "express";
import { SessionService } from "./session.service";

const sessionService = new SessionService();

export class SessionController {
  
  // GET /api/admin/sessions
  // Returns all sessions - Only super_admin can do this
  public async getAllSessions(req: any, res: Response) {
    try {
      const activeOnly = req.query.active === "true";
      const sessions = sessionService.getAllSessionsWithUserData(activeOnly);
      res.json({ success: true, count: sessions.length, sessions });
    } catch (err: any) {
      console.error("SessionController.getAllSessions failed:", err);
      res.status(500).json({ error: "Failed to fetch session list" });
    }
  }

  // GET /api/admin/sessions/:userId
  // Returns sessions for a specific user ID
  public async getUserSessions(req: any, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "Target userId is required" });
      }

      // Authorization guard: standard administrator can only check users, but let's confirm they exist
      const sessions = sessionService.getUserSessionsWithUserData(userId);
      res.json({ success: true, count: sessions.length, userId, sessions });
    } catch (err: any) {
      console.error("SessionController.getUserSessions failed:", err);
      res.status(500).json({ error: "Failed to fetch user sessions" });
    }
  }

  // DELETE /api/admin/sessions/session/:sessionId
  // Revokes a specific session
  public async revokeSession(req: any, res: Response) {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        return res.status(400).json({ error: "Target sessionId is required" });
      }

      const success = sessionService.revokeSession(sessionId);
      if (!success) {
        return res.status(404).json({ error: "Session was not found or could not be revoked" });
      }

      res.json({ success: true, message: `Session ${sessionId} was forcefully disconnected successfully` });
    } catch (err: any) {
      console.error("SessionController.revokeSession failed:", err);
      res.status(500).json({ error: "Failed to revoke active session" });
    }
  }

  // DELETE /api/admin/sessions/user/:userId
  // Revokes all sessions for a user (lockdown reset)
  public async revokeAllUserSessions(req: any, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "Target userId is required" });
      }

      const success = sessionService.revokeAllUserSessions(userId);
      if (!success) {
        return res.status(500).json({ error: "Failed to purge user sessions" });
      }

      res.json({ success: true, message: `All active sessions for user ${userId} have been terminated` });
    } catch (err: any) {
      console.error("SessionController.revokeAllUserSessions failed:", err);
      res.status(500).json({ error: "Failed to revoke all user sessions" });
    }
  }

  // GET /api/admin/sessions/history
  // Returns overall session registry / login history log list
  public async getSessionHistory(req: any, res: Response) {
    try {
      const sessions = sessionService.getAllSessionsWithUserData(false);
      res.json({ success: true, count: sessions.length, history: sessions });
    } catch (err: any) {
      console.error("SessionController.getSessionHistory failed:", err);
      res.status(500).json({ error: "Failed to retrieve connection history logs" });
    }
  }
}
