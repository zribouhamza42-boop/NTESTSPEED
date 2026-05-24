import fs from "fs";
import path from "path";
import { Session } from "./session.types";

export class SessionRepository {
  private dbPath = path.join(process.cwd(), "site-db.json");
  private defaultDbPath = path.join(process.cwd(), "src", "defaultDb.json");

  private getDb(): any {
    try {
      if (fs.existsSync(this.dbPath)) {
        return JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
      } else if (fs.existsSync(this.defaultDbPath)) {
        return JSON.parse(fs.readFileSync(this.defaultDbPath, "utf-8"));
      }
    } catch (e) {
      console.error("SessionRepository: error reading json database", e);
    }
    return { users: [], sessions: [] };
  }

  private saveDb(db: any): boolean {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(db, null, 2));
      return true;
    } catch (e) {
      console.error("SessionRepository: error saving json database", e);
      return false;
    }
  }

  public getAllSessions(): Session[] {
    const db = this.getDb();
    return db.sessions || [];
  }

  public saveAllSessions(sessions: Session[]): boolean {
    const db = this.getDb();
    db.sessions = sessions;
    return this.saveDb(db);
  }

  public getSessionById(sessionId: string): Session | undefined {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId);
  }

  public getUserSessions(userId: string): Session[] {
    const sessions = this.getAllSessions();
    return sessions.filter(s => s.userId === userId);
  }

  public getAllUsers(): any[] {
    const db = this.getDb();
    return db.users || [];
  }
}
