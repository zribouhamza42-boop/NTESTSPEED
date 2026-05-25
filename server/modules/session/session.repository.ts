import fs from "fs";
import path from "path";
import { Session } from "./session.types";

export class SessionRepository {
  private dbPath = path.join(process.cwd(), "site-db.json");
  private defaultDbPath = path.join(process.cwd(), "src", "defaultDb.json");

  private getDb(): any {
    const g = global as any;
    if (g.__siteDbCache) {
      return g.__siteDbCache;
    }

    try {
      if (fs.existsSync(this.dbPath)) {
        const db = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
        g.__siteDbCache = db;
        return db;
      } else if (fs.existsSync(this.defaultDbPath)) {
        const db = JSON.parse(fs.readFileSync(this.defaultDbPath, "utf-8"));
        g.__siteDbCache = db;
        return db;
      }
    } catch (e) {
      console.error("SessionRepository: error reading json database", e);
    }

    const fallbackDb = { users: [], sessions: [] };
    g.__siteDbCache = fallbackDb;
    return fallbackDb;
  }

  private saveDb(db: any): boolean {
    const g = global as any;
    g.__siteDbCache = db;
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(db, null, 2));
      return true;
    } catch (e) {
      console.warn("SessionRepository: error writing json database, using in-memory fallback:", e);
      return true; // return true because state is successfully updated in active memory cache
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
