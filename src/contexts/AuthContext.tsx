import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

export interface User {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "user";
  name_ar?: string;
  name_en?: string;
  sessionId?: string;
}

interface AuthContextType {
  token: string | null; // representing accessToken for full backwards compatibility
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, sessionId: string, user: User, rememberMe: boolean) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      // Use our configured api helper with interceptors
      const res = await api.get("/api/me");
      const data = res.data;
      setUser(data);
      localStorage.setItem("auth_user", JSON.stringify(data));
    } catch (err) {
      console.error("AuthContext: fetchCurrentUser details failed:", err);
      // Failures here (like 401 response) will be caught by axios response interceptor
      // which will trigger the handleSessionFailure and dispatch the unauthorized event.
    } finally {
      setLoading(false);
    }
  };

  const handleDirectClear = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("session_id");
    localStorage.removeItem("auth_user");
    setLoading(false);
  };

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("access_token"));
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  useEffect(() => {
    const handleTimeout = () => {
      handleDirectClear();
    };
    window.addEventListener("unauthorized_session_timeout", handleTimeout);

    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener("unauthorized_session_timeout", handleTimeout);
    };
  }, [token]);

  const login = (
    accessToken: string,
    refreshToken: string,
    sessionId: string,
    newUser: User,
    rememberMe: boolean
  ) => {
    setToken(accessToken);
    setUser(newUser);
    
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("session_id", sessionId);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = async () => {
    const sessionId = localStorage.getItem("session_id");
    if (sessionId) {
      try {
        // Send logout request to backend using our axios client to revoke the session
        await api.post("/api/auth/logout", { sessionId });
      } catch (err) {
        console.error("Failed to revoke session on backend during logout:", err);
      }
    }
    handleDirectClear();
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be consumed strictly inside an AuthProvider scope");
  }
  return context;
}
