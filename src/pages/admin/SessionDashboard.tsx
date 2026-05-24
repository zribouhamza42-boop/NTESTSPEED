import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter, 
  Terminal, 
  LogOut, 
  Laptop, 
  Smartphone, 
  Globe, 
  AlertTriangle,
  Lock,
  Compass,
  UserCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import api from "../../lib/api";

interface SessionDashboardProps {
  language: "ar" | "en";
  authenticatedUser: {
    id: string;
    email: string;
    role: string;
    name_ar: string;
    name_en: string;
  };
}

export interface UserSessionDto {
  id: string;
  userId: string;
  refreshTokenHash: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  revoked: boolean;
  deviceName?: string;
  browser?: string;
  os?: string;
  location?: string;
  userEmail?: string;
  userRole?: string;
  userNameEn?: string;
  userNameAr?: string;
}

export default function SessionDashboard({ language, authenticatedUser }: SessionDashboardProps) {
  const isAr = language === "ar";
  
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active"); // default view active
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dynamic audit stats
  const [stats, setStats] = useState({
    activeCount: 0,
    revokedCount: 0,
    suspiciousCount: 0,
    multideviceUsers: [] as string[]
  });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      // Super admins pull complete global tenant registry
      // Standard admins fetch via direct endpoints if needed, but super_admin holds sovereign root control
      const endpoint = "/api/admin/sessions";
      const response = await api.get(endpoint);
      
      if (response.data && response.data.success) {
        const rawSessions: UserSessionDto[] = response.data.sessions || [];
        setSessions(rawSessions);
        calculateTelemetryStats(rawSessions);
      }
    } catch (err: any) {
      console.error("SessionDashboard: failed fetching sessions", err);
      const errMsg = err.response?.data?.error || "Failed loading security sessions logs";
      triggerAlert("error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  const calculateTelemetryStats = (data: UserSessionDto[]) => {
    const now = Date.now();
    let valids = 0;
    let revokeds = 0;
    let suspicious = 0;
    
    // Group active session counts per user to detect concurrent nodes
    const userActiveSessions: { [key: string]: string[] } = {};

    data.forEach(s => {
      const isExpired = new Date(s.expiresAt).getTime() < now;
      const isActive = !s.revoked && !isExpired;

      if (isActive) {
        valids++;
        if (s.userId) {
          userActiveSessions[s.userId] = userActiveSessions[s.userId] || [];
          if (!userActiveSessions[s.userId].includes(s.ip)) {
            userActiveSessions[s.userId].push(s.ip);
          }
        }
      } else {
        revokeds++;
      }

      // Suspicious heuristics check: active sessions from non-local unknown clients or multiple different operating systems
      if (isActive && s.ip !== "127.0.0.1" && s.ip !== "::1") {
        const hasSuspAgent = s.userAgent.toLowerCase().includes("python") || s.userAgent.toLowerCase().includes("curl");
        if (hasSuspAgent) suspicious++;
      }
    });

    // Count concurrent multi-IP logins as suspicious activity anomalies
    const multideviceUsers: string[] = [];
    Object.entries(userActiveSessions).forEach(([uid, ips]) => {
      if (ips.length > 1) {
        suspicious++;
        multideviceUsers.push(uid);
      }
    });

    setStats({
      activeCount: valids,
      revokedCount: revokeds,
      suspiciousCount: suspicious,
      multideviceUsers
    });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const triggerAlert = (type: "success" | "error", text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Terminate/Force Logout a specific targeted session node
  const handleForceLogout = async (sessionId: string) => {
    if (!window.confirm(isAr ? "هل أنت متأكد من رغبتك بإنهاء الاتصال لهذا الجهاز قسرياً؟" : "Confirm terminating this device credentials node force logout?")) {
      return;
    }

    try {
      const response = await api.delete(`/api/admin/sessions/session/${sessionId}`);
      if (response.data && response.data.success) {
        triggerAlert("success", isAr ? "تم إنهاء وتجميد الاتصال للجهاز المحدد قسرياً" : "Target session disconnected and revoked successfully");
        fetchSessions();
      }
    } catch (err: any) {
      console.error("Force logout failed:", err);
      const errMsg = err.response?.data?.error || "Failed to disconnect node";
      triggerAlert("error", errMsg);
    }
  };

  // Immediate global lockdown reset for all concurrent sessions under a user account
  const handleLockdownUser = async (userId: string, emailStr?: string) => {
    const confirmationLabel = emailStr ? ` (${emailStr})` : "";
    if (!window.confirm(isAr 
      ? `🔐 تحذير: سيتم سحب ترخيص وطرد كافة الأجهزة المتصلة لهذا المستخدم${confirmationLabel} حالاً. هل تود المتابعة؟` 
      : `🔐 WARNING: You are initiating a security Lockdown. This action sweeps and revokes all active cookies/tokens belonging to ${confirmationLabel}. Proceed?`
    )) {
      return;
    }

    try {
      const response = await api.delete(`/api/admin/sessions/user/${userId}`);
      if (response.data && response.data.success) {
        triggerAlert("success", isAr 
          ? "تم حظر وطرد كشف أجهزة الحساب المستهدف بنجاح وتفعيل القفل الأمني" 
          : "User sessions purged and account lockdown executed"
        );
        fetchSessions();
      }
    } catch (err: any) {
      console.error("Lockdown failed:", err);
      const errMsg = err.response?.data?.error || "Failed user lockdown sequence";
      triggerAlert("error", errMsg);
    }
  };

  // Filter application pipeline
  const filteredSessions = sessions.filter(session => {
    // 1. Search filter
    const searchLower = searchTerm.toLowerCase();
    const emailMatch = session.userEmail?.toLowerCase().includes(searchLower) || false;
    const nameMatch = session.userNameEn?.toLowerCase().includes(searchLower) || 
                      session.userNameAr?.includes(searchTerm) || false;
    const ipMatch = session.ip.includes(searchTerm);
    const idMatch = session.id.toLowerCase().includes(searchLower);

    const matchesSearch = !searchTerm || emailMatch || nameMatch || ipMatch || idMatch;

    // 2. Role filter
    const matchesRole = roleFilter === "all" || session.userRole === roleFilter;

    // 3. Status filter
    const now = Date.now();
    const isExpired = new Date(session.expiresAt).getTime() < now;
    const isActive = !session.revoked && !isExpired;

    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = isActive;
    } else if (statusFilter === "revoked") {
      matchesStatus = !isActive;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6" id="session-dashboard-root">
      
      {/* Cybersecurity Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="sessions-telemetry-panels">
        
        <div className="bg-slate-900/45 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block font-bold">
              {isAr ? "إجمالي الجلسات النشطة" : "Active Nodes Live"}
            </span>
            <span className="text-2xl font-black text-blue-400 font-mono block mt-1">
              {stats.activeCount}
            </span>
          </div>
          <Laptop className="w-8 h-8 text-blue-500/30" />
        </div>

        <div className="bg-slate-900/45 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block font-bold">
              {isAr ? "مأمونية تكنولوجيا الأجهزة" : "Telemetry History Records"}
            </span>
            <span className="text-2xl font-black text-purple-400 font-mono block mt-1">
              {stats.revokedCount}
            </span>
          </div>
          <Globe className="w-8 h-8 text-purple-500/30" />
        </div>

        <div className="bg-slate-900/45 border border-slate-900 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden">
          {stats.suspiciousCount > 0 && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-650/10 rounded-full blur-xl pointer-events-none animate-pulse" />
          )}
          <div>
            <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block font-bold text-red-400">
              {isAr ? "مؤشرات الاختراق والتهديد" : "Anomalies / Risks Tagged"}
            </span>
            <span className="text-2xl font-black text-red-500 font-mono block mt-1">
              {stats.suspiciousCount}
            </span>
          </div>
          <AlertTriangle className={`w-8 h-8 ${stats.suspiciousCount > 0 ? "text-red-500/70 animate-bounce" : "text-slate-500/30"}`} />
        </div>

        <div className="bg-slate-900/45 border border-slate-900 p-4 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono text-slate-300 font-semibold">{isAr ? "مستوى الفحص" : "Diagnostics Guard"}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {stats.multideviceUsers.length > 0 ? (
              <span className="text-amber-400 animate-pulse font-bold">
                ⚠️ {isAr ? `تعدد IP نشط لـ ${stats.multideviceUsers.length} عملاء` : `Multi-IP conflict for ${stats.multideviceUsers.length} hosts`}
              </span>
            ) : (
              <span className="text-emerald-450">🟢 {isAr ? "نظام تتبع الهوية مستقر" : "Core authentication matrix optimal"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Warning Toast Alerts */}
      {alertMsg && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center space-x-2 rtl:space-x-reverse border ${
          alertMsg.type === "success" 
            ? "bg-emerald-950/25 text-emerald-400 border-emerald-900/30" 
            : "bg-red-950/25 text-red-400 border-red-900/30"
        } animate-slide-down`}>
          <span>{alertMsg.type === "success" ? "🛡️ SUCCESS:" : "🚨 ERROR:"}</span>
          <span className="flex-1">{alertMsg.text}</span>
          <button onClick={() => setAlertMsg(null)} className="hover:text-white">✕</button>
        </div>
      )}

      {/* Control Filters Hub */}
      <div className="bg-slate-900/20 border border-slate-950 p-4 rounded-2xl flex flex-col lg:flex-row items-center gap-4" id="sessions-filters-bar">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pr-3.5 text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? "بحث عبر البريد، الاسم، الـ IP..." : "Search by email, name, IP..."}
            className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-slate-300 placeholder-slate-550 text-xs focus:outline-none focus:border-blue-500/80 transition-all font-mono"
          />
        </div>

        {/* Filter Status Toggle buttons */}
        <div className="flex bg-slate-950 border border-slate-905 rounded-xl p-1 gap-1 w-full lg:w-auto self-stretch lg:self-auto">
          <button
            onClick={() => setStatusFilter("active")}
            className={`flex-1 lg:flex-none px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/10"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {isAr ? "الجلسات النشطة" : "Active Only"}
          </button>
          <button
            onClick={() => setStatusFilter("revoked")}
            className={`flex-1 lg:flex-none px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              statusFilter === "revoked"
                ? "bg-blue-600/90 text-white shadow-md"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {isAr ? "الملغية والمنتهية" : "Revoked Records"}
          </button>
        </div>

        {/* Filter Roles dropdown */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse w-full lg:w-auto self-stretch lg:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-1.5 text-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-colors cursor-pointer flex-1 lg:flex-none"
          >
            <option value="all">{isAr ? "كافة الرتب والصلاحيات" : "All Accounts Roles"}</option>
            <option value="super_admin">Super Admins</option>
            <option value="admin">Admins</option>
            <option value="editor">Editors</option>
            <option value="user">Users</option>
          </select>
        </div>

        {/* Refresh and loading indicators */}
        <div className="flex justify-end w-full lg:w-auto ml-auto rtl:mr-auto rtl:ml-0">
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="p-2 py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-semibold select-none border border-slate-900 cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
            <span>{isAr ? "تحديث السجلات" : "Sync Logs"}</span>
          </button>
        </div>
      </div>

      {/* Main Sessions Database View Grid */}
      <div className="bg-slate-950/60 border border-slate-900 rounded-2xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <table className="w-full min-w-[1000px] text-left rtl:text-right border-collapse text-[11px] font-mono">
            <thead>
              <tr className="bg-slate-900/50 text-slate-450 uppercase border-b border-slate-900 py-3 text-[10px] tracking-wider font-bold">
                <th className="p-4">{isAr ? "حساب المستخدم" : "User Principal"}</th>
                <th className="p-4">{isAr ? "صلاحية الدور" : "Role Scope"}</th>
                <th className="p-4">{isAr ? "الجهاز والأنظمة" : "Machine Context"}</th>
                <th className="p-4">{isAr ? "الشبكة والجغرافية" : "Network IP & Location"}</th>
                <th className="p-4">{isAr ? "الاتصال الأساسي" : "Initial Session Node"}</th>
                <th className="p-4">{isAr ? "آخر رصد نشط" : "Last Activity Trigger"}</th>
                <th className="p-4 text-center">{isAr ? "مؤشر الأمان" : "Sentinel State"}</th>
                <th className="p-4 text-center">{isAr ? "قفل التحكم" : "Tactical Commands"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40 text-slate-350">
              {filteredSessions.map((session) => {
                const now = Date.now();
                const isExpired = new Date(session.expiresAt).getTime() < now;
                const isActive = !session.revoked && !isExpired;
                
                // Suspicious flag: duplicates or curl client agents
                const isSuspiciousDevice = isActive && 
                  (session.ip !== "127.0.0.1" && session.ip !== "::1") && 
                  (session.userAgent.toLowerCase().includes("curl") || 
                   session.userAgent.toLowerCase().includes("python") ||
                   stats.multideviceUsers.includes(session.userId));

                return (
                  <tr 
                    key={session.id} 
                    className={`hover:bg-slate-900/10 transition-colors ${
                      isSuspiciousDevice ? "bg-red-950/5 hover:bg-red-950/10 border-l-2 border-l-red-500" : ""
                    }`}
                  >
                    
                    {/* User Identity cell */}
                    <td className="p-4 font-sans">
                      <div className="font-bold text-slate-200">
                        {isAr ? (session.userNameAr || session.userNameEn) : session.userNameEn}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono lower">{session.userEmail}</div>
                      <div className="text-[9px] text-slate-650 font-mono hover:text-slate-400 select-all cursor-copy truncate max-w-[110px]">
                        ID: {session.userId}
                      </div>
                    </td>

                    {/* Role Scope */}
                    <td className="p-4 text-xs font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] border uppercase ${
                        session.userRole === "super_admin"
                          ? "bg-purple-955/20 text-purple-400 border-purple-900/30"
                          : session.userRole === "admin"
                          ? "bg-blue-955/20 text-blue-400 border-blue-900/30"
                          : session.userRole === "editor"
                          ? "bg-amber-955/20 text-amber-500 border-amber-900/30"
                          : "bg-slate-900 text-slate-500 border-slate-800"
                      }`}>
                        {session.userRole || "User"}
                      </span>
                    </td>

                    {/* Machine context (OS and Browser) */}
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-sans text-slate-200 font-semibold gap-1">
                        {session.os === "iOS" || session.os === "Android" ? (
                          <Smartphone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[140px]">{session.deviceName || "Generic Client"}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 gap-1">
                        <span>{session.os}</span>
                        <span>•</span>
                        <span>{session.browser || "Agent Engine"}</span>
                      </div>
                    </td>

                    {/* Network & Location */}
                    <td className="p-4">
                      <div className="font-bold text-slate-300 font-mono select-all hover:text-blue-400 cursor-pointer">{session.ip}</div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 gap-1 font-sans">
                        <Compass className="w-3 h-3 text-slate-600" />
                        <span>{session.location || "Unknown Telemetry Zone"}</span>
                      </div>
                    </td>

                    {/* Initial created at date */}
                    <td className="p-4 text-slate-450 italic">
                      <div>{new Date(session.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })}</div>
                      <div className="text-[9px] text-slate-600 font-normal">
                        {new Date(session.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    {/* Last active status date */}
                    <td className="p-4 text-slate-300 font-medium">
                      <div>{new Date(session.lastActiveAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })}</div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        {new Date(session.lastActiveAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </td>

                    {/* Active vs Revoked badging indicators */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border select-none ${
                        isActive 
                          ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30 font-bold" 
                          : "bg-slate-900/60 text-slate-500 border-slate-900/40"
                      }`}>
                        {isActive ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5 animate-pulse" />
                            <span>{isAr ? "نشط حالياً" : "ACTIVE"}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5" />
                            <span>{isAr ? "ملغي / مطرود" : "REVOKED"}</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Administrative single and user-wide action panel */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isActive ? (
                          <>
                            {/* Force terminate specific node */}
                            <button
                              onClick={() => handleForceLogout(session.id)}
                              className="p-1.5 bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/30 hover:text-red-400 text-slate-400 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title={isAr ? "قطع الاتصال قسرياً" : "Force logout device"}
                            >
                              <LogOut className="w-3.5 h-3.5" />
                            </button>

                            {/* Global Account Lockdown */}
                            <button
                              onClick={() => handleLockdownUser(session.userId, session.userEmail)}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-rose-500 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title={isAr ? "سحب تراخيص الحساب قاطبةً" : "Lockdown User account (all devices)"}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-600 font-mono text-[9px]">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-550 font-mono text-xs">
                    ⚠️ {isAr ? "لم يتم العثور على أي جلسات اتصال مطابقة لخيارات الفلترة" : "No matching authentication sessions registered inside this filter block"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cyber Security Policy Guide card footer */}
      <div className="p-5 rounded-2xl border border-blue-900/20 bg-gradient-to-r from-blue-950/15 via-slate-950/45 to-purple-950/10 text-xs text-slate-400 flex flex-col md:flex-row gap-4 items-center" id="sentinel-guard-creds">
        <ShieldAlert className="w-6 h-6 text-blue-500 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-slate-200">
            {isAr ? "سياسة المصادقة الثنائية وتتبع البصمات الأمنية" : "Sentinel Guard ID Tracking & Session Policy"}
          </p>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {isAr 
              ? "تحتل حماية الهوية الأولوية القصوى. يتم توشيح الجلسات ببصمات الأجهزة والتواقيع الرقمية المشفرة وخوارزميات ممانعة الحظر لضمان التعرف على الأجهزة المخترقة فور ورود محاولات الـ Hijacking لحماية تشتت الترافيك."
              : "Identity protection is enforced via dynamic session hashing. Session tokens are linked to machine browser variables, operating systems, and network headers to prevent hijacking attempts."
            }
          </p>
        </div>
      </div>

    </div>
  );
}
