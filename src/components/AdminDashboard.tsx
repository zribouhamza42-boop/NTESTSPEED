import React, { useState, useEffect } from "react";
import { PageId, Language, Article, VPNOffer, RDPOffer } from "../types";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Key, 
  LogOut, 
  Check, 
  Save, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  ShieldAlert, 
  Server, 
  Zap, 
  Eye, 
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  ShieldAlert as AdminShield,
  Clock
} from "lucide-react";

import api from "../lib/api";
import SessionDashboard from "../pages/admin/SessionDashboard";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input.toString();
  const method = init?.method || "GET";
  const headers = (init?.headers as any) || {};
  const body = init?.body;

  try {
    const response = await api({
      url,
      method: method as any,
      headers: {
        ...headers
      },
      data: body ? JSON.parse(body as string) : undefined
    });

    return {
      ok: true,
      status: response.status,
      json: async () => response.data
    } as unknown as Response;
  } catch (err: any) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    return {
      ok: false,
      status,
      json: async () => errorData
    } as unknown as Response;
  }
};

// Override local scope fetch to route through our secure, auto-refreshing Axios client
const fetch = customFetch;

interface AdminDashboardProps {
  language: Language;
  articles: Article[];
  vpnOffers: VPNOffer[];
  rdpOffers: RDPOffer[];
  refreshData: () => Promise<void>;
  setCurrentPage: (page: PageId) => void;
  authToken: string;
  authenticatedUser: {
    id: string;
    email: string;
    role: string;
    name_ar: string;
    name_en: string;
  };
  onLogout: () => void;
  initialSubPath: string;
}

export default function AdminDashboard({
  language,
  articles,
  vpnOffers,
  rdpOffers,
  refreshData,
  setCurrentPage,
  authToken,
  authenticatedUser,
  onLogout,
  initialSubPath
}: AdminDashboardProps) {
  const isAr = language === "ar";
  
  // Custom auth token wrapper for old CRUD actions
  const getPasscodeToken = () => "Bearer " + authToken;

  // Active Tab: default to first allowed tab depending on user role
  const [activeTab, setActiveTab] = useState<"articles" | "vpn" | "rdp" | "users" | "settings" | "analytics" | "sessions">(() => {
    if (authenticatedUser.role === "editor") return "articles";
    return "analytics";
  });

  const [apiLoading, setApiLoading] = useState(false);
  const [apiSuccessMsg, setApiSuccessMsg] = useState("");
  const [apiErrorMsg, setApiErrorMsg] = useState("");

  // Editor forms states
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingVpn, setEditingVpn] = useState<Partial<VPNOffer> | null>(null);
  const [editingRdp, setEditingRdp] = useState<Partial<RDPOffer> | null>(null);

  // SaaS specific states
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [settings, setSettings] = useState<any>({
    siteName_ar: "طبيب الإنترنت الذكي AI",
    siteName_en: "Smart Internet Doctor AI",
    contactEmail: "support@smartinternetdoctor.com",
    maintenanceMode: false,
    requireTwoFactor: false,
    aiEngineModel: "gemini-3.5-flash"
  });

  // User form modal helper states
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userFormEmail, setUserFormEmail] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("");
  const [userFormRole, setUserFormRole] = useState("user");
  const [userFormNameEn, setUserFormNameEn] = useState("");
  const [userFormNameAr, setUserFormNameAr] = useState("");

  const [userSessions, setUserSessions] = useState<any[]>([]);

  const showFeedback = (successMsg: string, errorMsg: string = "") => {
    setApiSuccessMsg(successMsg);
    setApiErrorMsg(errorMsg);
    setTimeout(() => {
      setApiSuccessMsg("");
      setApiErrorMsg("");
    }, 4500);
  };

  // Synchronize dashboard tabs with the requested URL sub-path
  useEffect(() => {
    if (initialSubPath === "sessions" && authenticatedUser.role === "super_admin") {
      setActiveTab("sessions");
    } else if (initialSubPath === "users" && authenticatedUser.role === "super_admin") {
      setActiveTab("users");
    } else if (initialSubPath === "settings" && authenticatedUser.role === "super_admin") {
      setActiveTab("settings");
    } else if (initialSubPath === "blog" || initialSubPath === "articles") {
      setActiveTab("articles");
    } else if (initialSubPath === "offers") {
      setActiveTab(authenticatedUser.role === "editor" ? "articles" : "vpn");
    } else if (initialSubPath === "analytics" && ["super_admin", "admin"].includes(authenticatedUser.role)) {
      setActiveTab("analytics");
    } else {
      // Default fallback
      if (authenticatedUser.role === "editor") {
        setActiveTab("articles");
      } else {
        setActiveTab("analytics");
      }
    }
  }, [initialSubPath, authenticatedUser]);

  // Load relevant databases
  const fetchSaaSData = async () => {
    if (activeTab === "users" && authenticatedUser.role === "super_admin") {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { "Authorization": getPasscodeToken() }
        });
        if (res.ok) {
          const d = await res.json();
          setUsers(d.users || []);
        }
      } catch (err) {
        console.error("Failed fetching users info:", err);
      }
    }

    if (activeTab === "settings" && authenticatedUser.role === "super_admin") {
      try {
        const res = await fetch("/api/admin/settings", {
          headers: { "Authorization": getPasscodeToken() }
        });
        if (res.ok) {
          const d = await res.json();
          setSettings(d.settings || null);
        }
      } catch (err) {
        console.error("Failed fetching setting metadata:", err);
      }

      try {
        const res = await fetch("/api/auth/sessions");
        if (res.ok) {
          const d = await res.json();
          setUserSessions(d.sessions || []);
        }
      } catch (err) {
        console.error("Failed fetching active sessions:", err);
      }
    }

    if (activeTab === "analytics" && ["super_admin", "admin"].includes(authenticatedUser.role)) {
      try {
        const res = await fetch("/api/admin/analytics", {
          headers: { "Authorization": getPasscodeToken() }
        });
        if (res.ok) {
          const d = await res.json();
          setAnalytics(d.analytics || null);
        }
      } catch (err) {
        console.error("Failed fetching diagnostic telemetry:", err);
      }
    }
  };

  useEffect(() => {
    fetchSaaSData();
  }, [activeTab]);

  const handleTabToggle = (tab: "articles" | "vpn" | "rdp" | "users" | "settings" | "analytics" | "sessions") => {
    setActiveTab(tab);
    let sub = "";
    if (tab === "users") sub = "users";
    else if (tab === "sessions") sub = "sessions";
    else if (tab === "settings") sub = "settings";
    else if (tab === "articles") sub = "blog";
    else if (tab === "vpn" || tab === "rdp") sub = "offers";
    else if (tab === "analytics") sub = "analytics";

    window.history.pushState(null, "", sub ? `/admin/${sub}` : "/admin");
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setUserSessions((prev) => prev.filter((s) => s.id !== sessionId));
        showFeedback(isAr ? "تم إنهاء جلسة الجهاز الآخر بنجاح" : "Remote session terminated successfully.");
      }
    } catch (err) {
      console.error("Failed revoking session:", err);
      showFeedback("", isAr ? "فشل إنهاء الجلسة النشطة" : "Failed to revoke targeted active session.");
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  // Manage users (Super Admin only function)
  const saveUserForm = async () => {
    if (!userFormEmail || !userFormRole || !userFormNameEn) {
      showFeedback("", isAr ? "تحقق من تعبئة جميع الحقول المطلوبة" : "Verify that all required fields are filled");
      return;
    }

    setApiLoading(true);
    try {
      const payload: any = {
        email: userFormEmail,
        role: userFormRole,
        name_en: userFormNameEn,
        name_ar: userFormNameAr || userFormNameEn
      };
      
      if (editingUser) {
        payload.id = editingUser.id;
      }
      if (userFormPassword) {
        payload.password = userFormPassword;
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed sync");
      }

      showFeedback(isAr ? "تم حفظ بيانات اعتماد المستخدم وتعديل رتبته بنجاح" : "User privileges and credentials successfully stored");
      setEditingUser(null);
      fetchSaaSData();
    } catch (err: any) {
      showFeedback("", err.message || "Credential write failure");
    } finally {
      setApiLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (authenticatedUser.id === id) {
      showFeedback("", isAr ? "لا يمكنك حذف حسابك الجاري تسجيل الدخول به!" : "Self-deletion is structurally blocked");
      return;
    }
    if (!window.confirm(isAr ? "هل أنت متأكد من رغبتك في حذف هذا الحساب؟" : "Confirm targeted user eviction?")) return;

    setApiLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": getPasscodeToken()
        }
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Deletion failed");

      showFeedback(isAr ? "تم إزالة المستخدم وسحب تفويضاته بالكامل" : "User successfully evicted from system database");
      fetchSaaSData();
    } catch (er: any) {
      showFeedback("", er.message || "Failed eviction");
    } finally {
      setApiLoading(false);
    }
  };

  // Manage settings configurations
  const updateSettingsForm = async (nextSettings: any) => {
    setApiLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ settings: nextSettings })
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save error");

      setSettings(d.settings);
      showFeedback(isAr ? "تم حفظ إعدادات النظام الرئيسية" : "Branding and engine parameters hard-saved");
    } catch (er: any) {
      showFeedback("", er.message || "Settings write failed");
    } finally {
      setApiLoading(false);
    }
  };

  // --- ARTICLE CRUD operations ----
  const startAddArticle = () => {
    setEditingArticle({
      id: "article-" + Date.now(),
      title_ar: "",
      title_en: "",
      summary_ar: "",
      summary_en: "",
      category_ar: isAr ? "مقالات عامة" : "General",
      category_en: "General",
      readTime_ar: isAr ? "قراءة في 3 دقائق" : "3 min read",
      readTime_en: "3 min read",
      date_ar: new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }),
      date_en: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author: isAr ? "إدارة الموقع" : "Site Administrator",
      iconName: "BookOpen",
      accentColor: "from-blue-500 to-indigo-600",
      ctaText_ar: "ابدأ التصفح",
      ctaText_en: "Start Exploring",
      ctaTarget: "home",
      paragraphs: [
        {
          type: "text",
          content_ar: "",
          content_en: ""
        }
      ]
    });
  };

  const saveArticleForm = async () => {
    if (!editingArticle || !editingArticle.id) return;
    setApiLoading(true);

    // Validate
    if (!editingArticle.title_ar || !editingArticle.title_en) {
      showFeedback("", isAr ? "العناوين باللغتين مطلوبة" : "Title in both Arabic & English are required");
      setApiLoading(false);
      return;
    }

    try {
      const existingIdx = articles.findIndex(a => a.id === editingArticle.id);
      let updatedList = [...articles];
      
      if (existingIdx >= 0) {
        updatedList[existingIdx] = editingArticle as Article;
      } else {
        updatedList.push(editingArticle as Article);
      }

      const res = await fetch("/api/admin/save-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ articles: updatedList })
      });

      if (!res.ok) throw new Error("Server error");
      
      await refreshData();
      setEditingArticle(null);
      showFeedback(
        isAr ? "تم حفظ المقال بنجاح ومزامنته مع خادم الموقع!" : "Article saved and synchronized successfully!"
      );
    } catch (e) {
      showFeedback("", isAr ? "فشل الاتصال بالخادم لحفظ المقال" : "Network error: Couldn't sync article");
    } finally {
      setApiLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!window.confirm(isAr ? "هل أنت متأكد من حذف هذا المقال نهائياً؟" : "Confirm deleting this article?")) return;
    setApiLoading(true);
    try {
      const updatedList = articles.filter(a => a.id !== id);
      const res = await fetch("/api/admin/save-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ articles: updatedList })
      });

      if (!res.ok) throw new Error("Server error");
      await refreshData();
      showFeedback(isAr ? "تم حذف المقال بنجاح" : "Article removed successfully");
    } catch (e) {
      showFeedback("", isAr ? "فشل حذف المقال" : "Could not delete article");
    } finally {
      setApiLoading(false);
    }
  };

  // --- VPN CRUD operations ---
  const startAddVpn = () => {
    setEditingVpn({
      id: "vpn-" + Date.now(),
      name: "",
      badge_en: "",
      badge_ar: "",
      rating: 4.8,
      speedRating: "95 Mbps Avg",
      price: "$2.99 / mo",
      description_en: "",
      description_ar: "",
      features_en: [""],
      features_ar: [""],
      affiliateLink: "https://",
      category: "speed",
      logoColorClassName: "from-blue-600 to-indigo-700"
    });
  };

  const saveVpnForm = async () => {
    if (!editingVpn || !editingVpn.id) return;
    setApiLoading(true);

    if (!editingVpn.name) {
      showFeedback("", isAr ? "اسم مزود الخدمة مطلوب" : "VPN Brand Name is required");
      setApiLoading(false);
      return;
    }

    try {
      const existingIdx = vpnOffers.findIndex(v => v.id === editingVpn.id);
      let updatedList = [...vpnOffers];

      if (existingIdx >= 0) {
        updatedList[existingIdx] = editingVpn as VPNOffer;
      } else {
        updatedList.push(editingVpn as VPNOffer);
      }

      const res = await fetch("/api/admin/save-vpn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ vpnOffers: updatedList })
      });

      if (!res.ok) throw new Error("Server error");
      await refreshData();
      setEditingVpn(null);
      showFeedback(isAr ? "تم تحديث وحفظ عروض الـ VPN بنجاح!" : "VPN affiliate listings synchronized successfully!");
    } catch (e) {
      showFeedback("", isAr ? "فشل تخزين بيانات الـ VPN" : "Failed to store VPN modifications");
    } finally {
      setApiLoading(false);
    }
  };

  const deleteVpn = async (id: string) => {
    if (!window.confirm(isAr ? "هل تريد إزالة هذا الشريك وعرضه؟" : "Erase this VPN partner listing?")) return;
    setApiLoading(true);
    try {
      const updatedList = vpnOffers.filter(v => v.id !== id);
      const res = await fetch("/api/admin/save-vpn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ vpnOffers: updatedList })
      });

      if (!res.ok) throw new Error("Error");
      await refreshData();
      showFeedback(isAr ? "تم الحذف بنجاح" : "Succeeded");
    } catch (e) {
      showFeedback("", "Failed");
    } finally {
      setApiLoading(false);
    }
  };

  // ---- RDP CRUD operations ----
  const startAddRdp = () => {
    setEditingRdp({
      id: "rdp-" + Date.now(),
      hostName: "",
      cores: 2,
      ram: "4 GB",
      storage: "80 GB SSD",
      bandwidth: "4,000 GB / mo",
      ipType: "Dedicated IPv4 Address",
      priceMonthly: "$10",
      priceYearly: "$90",
      affiliateLinkMonthly: "https://",
      affiliateLinkYearly: "https://",
      region_en: "USA and EU Nodes",
      region_ar: "أمريكا وأوروبا",
      features_en: [""],
      features_ar: [""]
    });
  };

  const saveRdpForm = async () => {
    if (!editingRdp || !editingRdp.id) return;
    setApiLoading(true);

    if (!editingRdp.hostName) {
      showFeedback("", isAr ? "عنوان السيرفر مطلوب" : "Server hostname is required");
      setApiLoading(false);
      return;
    }

    try {
      const existingIdx = rdpOffers.findIndex(r => r.id === editingRdp.id);
      let updatedList = [...rdpOffers];

      if (existingIdx >= 0) {
        updatedList[existingIdx] = editingRdp as RDPOffer;
      } else {
        updatedList.push(editingRdp as RDPOffer);
      }

      const res = await fetch("/api/admin/save-rdp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ rdpOffers: updatedList })
      });

      if (!res.ok) throw new Error("Error");
      await refreshData();
      setEditingRdp(null);
      showFeedback(isAr ? "تم حفظ صفقات السيرفر بنجاح المزامنة!" : "RDP/VPS hosting deals updated successfully!");
    } catch (e) {
      showFeedback("", isAr ? "فشل تخزين بيانات الـ RDP" : "Failed to store RDP/VPS packages");
    } finally {
      setApiLoading(false);
    }
  };

  const deleteRdp = async (id: string) => {
    if (!window.confirm(isAr ? "هل ترغب بحذف باقة خادم VPS هذا؟" : "Remove this RDP package?")) return;
    setApiLoading(true);
    try {
      const updatedList = rdpOffers.filter(r => r.id !== id);
      const res = await fetch("/api/admin/save-rdp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getPasscodeToken()
        },
        body: JSON.stringify({ rdpOffers: updatedList })
      });

      if (!res.ok) throw new Error("Error");
      await refreshData();
      showFeedback(isAr ? "تم حذف الخادم بنجاح" : "VPS deleted successfully");
    } catch (e) {
      showFeedback("", "Failed removal file write");
    } finally {
      setApiLoading(false);
    }
  };




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in" id="admin-main-dashboard">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/10 uppercase tracking-wider">
              🛡️ {isAr ? `صلاحية: ${authenticatedUser.role.toUpperCase()}` : `ROLE: ${authenticatedUser.role.toUpperCase()}`}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
              👤 {isAr ? `المستخدم: ${authenticatedUser.name_ar || authenticatedUser.name_en}` : `User: ${authenticatedUser.name_en}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2.5" id="owner-panel-header">
            {isAr ? "منظومة تحكم وإدارة المنصة البرمجية" : "SaaS Autonomous Control Console"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr 
              ? "تحكم بالكامل بالبيانات: أضف، احذف، وعدل عروض شركاء الـ VPN، خوادم الـ RDP، ومقالات المدونة فورًا" 
              : "Full real-time system management: inject, delete, or refine partner VPN nodes, RDP packages, or user blogs."
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 hover:text-blue-400 text-slate-300 border border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer"
            title={isAr ? "تحديث البيانات من السيرفر" : "Force-reload data from server database"}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-red-950/25 hover:bg-red-950/50 text-red-400 border border-red-900/20 hover:border-red-900/50 transition-all cursor-pointer text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? "خروج" : "Log out"}</span>
          </button>
        </div>
      </div>

      {/* API feedback displays */}
      {(apiSuccessMsg || apiErrorMsg) && (
        <div className="mb-6 animate-slide-up">
          {apiSuccessMsg && (
            <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-xl p-4 flex items-center space-x-2.5 rtl:space-x-reverse text-emerald-300 text-sm">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{apiSuccessMsg}</span>
            </div>
          )}
          {apiErrorMsg && (
            <div className="bg-red-950/30 border border-red-950/60 rounded-xl p-4 flex items-center space-x-2.5 rtl:space-x-reverse text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{apiErrorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Editor Overlays/In-page Form if active */}
      {editingArticle && (
        <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative animate-fade-in">
          <button 
            onClick={() => setEditingArticle(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-400 font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? "محرر المقال الفني المسرع" : "Deep Technical Article Authoring"}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-6">
            {isAr ? "تحرير / إضافة مقال فني للموقع" : "Write / Tune Blog Article"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">ID (Unique Slug)</label>
              <input
                type="text"
                value={editingArticle.id}
                onChange={(e) => setEditingArticle({...editingArticle, id: e.target.value})}
                placeholder="isp-throttling"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Author name</label>
              <input
                type="text"
                value={editingArticle.author}
                onChange={(e) => setEditingArticle({...editingArticle, author: e.target.value})}
                placeholder="Dr. Smith"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Title (AR)</label>
              <input
                type="text"
                value={editingArticle.title_ar}
                onChange={(e) => setEditingArticle({...editingArticle, title_ar: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Title (EN)</label>
              <input
                type="text"
                value={editingArticle.title_en}
                onChange={(e) => setEditingArticle({...editingArticle, title_en: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Summary / Excerpt (AR)</label>
              <textarea
                value={editingArticle.summary_ar}
                onChange={(e) => setEditingArticle({...editingArticle, summary_ar: e.target.value})}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Summary / Excerpt (EN)</label>
              <textarea
                value={editingArticle.summary_en}
                onChange={(e) => setEditingArticle({...editingArticle, summary_en: e.target.value})}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Category (AR)</label>
              <input
                type="text"
                value={editingArticle.category_ar}
                onChange={(e) => setEditingArticle({...editingArticle, category_ar: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Category (EN)</label>
              <input
                type="text"
                value={editingArticle.category_en}
                onChange={(e) => setEditingArticle({...editingArticle, category_en: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Icon Lucide identifier</label>
              <select
                value={editingArticle.iconName}
                onChange={(e) => setEditingArticle({...editingArticle, iconName: e.target.value as any})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              >
                <option value="ShieldAlert">ShieldAlert</option>
                <option value="Zap">Zap</option>
                <option value="Server">Server</option>
                <option value="BookOpen">BookOpen</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase tracking-wide">Accent visual color</label>
              <input
                type="text"
                value={editingArticle.accentColor}
                onChange={(e) => setEditingArticle({...editingArticle, accentColor: e.target.value})}
                placeholder="from-blue-500 to-indigo-600"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 sm:p-5 rounded-xl mb-6">
            <h4 className="text-xs font-black font-mono uppercase tracking-wider text-blue-400 mb-2.5 block flex items-center justify-between">
              <span>{isAr ? "📝 كتل وفقرات المقال الفني السريع" : "📝 Technical Article Narrative Blocks"}</span>
              <span className="text-[10px] bg-blue-950 px-2 py-0.5 rounded text-blue-300 font-bold border border-blue-900/40">
                {editingArticle.paragraphs?.length || 0} {isAr ? "فقرات" : "blocks"}
              </span>
            </h4>
            <div className="text-[11px] text-slate-450 mb-4 bg-slate-900/50 border border-slate-900 p-3 rounded-lg leading-relaxed">
              {isAr 
                ? "💡 يمكنك تخصيص فقرات المقال. يدعم المقال السيرفرات والصور وقوائم التعداد البرمجية والشيفرات بمرونة تامة دون الحاجة لكتابة أكواد JSON معقدة." 
                : "💡 Modify the technical chapters easily. Customize lists, interactive high-quality pictures, and server snippets with ease, skipping convoluted manual configurations."
              }
            </div>
            
            {/* Standard paragraphs editor */}
            <div className="space-y-6" id="admin-paragraphs-list">
              {editingArticle.paragraphs?.map((p, pIdx) => (
                <div key={pIdx} className="bg-slate-900/20 border border-slate-900 rounded-xl p-4 sm:p-5 text-left rtl:text-right space-y-4 relative group/block">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-900 px-2 px-1.5 rounded">{isAr ? `الكتلة #${pIdx + 1}` : `Block #${pIdx + 1}`}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">({p.type})</span>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <select
                        value={p.type}
                        onChange={(e) => {
                          const updatedP = [...(editingArticle.paragraphs || [])];
                          updatedP[pIdx].type = e.target.value as any;
                          // Set default content structure depending on type
                          if (e.target.value === "bullets" && !Array.isArray(updatedP[pIdx].content_ar)) {
                            updatedP[pIdx].content_ar = [];
                            updatedP[pIdx].content_en = [];
                          } else if (e.target.value !== "bullets" && Array.isArray(updatedP[pIdx].content_ar)) {
                            updatedP[pIdx].content_ar = "";
                            updatedP[pIdx].content_en = "";
                          }
                          setEditingArticle({...editingArticle, paragraphs: updatedP});
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="text">text</option>
                        <option value="highlight">highlight</option>
                        <option value="config">config</option>
                        <option value="bullets">bullets</option>
                        <option value="image">image (📸 Picture)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const updatedP = (editingArticle.paragraphs || []).filter((_, idx) => idx !== pIdx);
                          setEditingArticle({...editingArticle, paragraphs: updatedP});
                        }}
                        className="px-2.5 py-1 rounded bg-red-950/20 hover:bg-red-900 border border-red-950 hover:border-red-600/30 text-[10px] text-red-400 font-bold transition-all cursor-pointer flex items-center"
                        title={isAr ? "حذف السجل بالكامل" : "Delete block content"}
                      >
                        <span>{isAr ? "✘ حذف" : "✘ Delete"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase">{isAr ? "عنوان الفصل الفرعي (اختياري)" : "Section Subtitle AR"}</label>
                      <input
                        type="text"
                        value={p.title_ar || ""}
                        onChange={(e) => {
                          const updatedP = [...(editingArticle.paragraphs || [])];
                          updatedP[pIdx].title_ar = e.target.value;
                          setEditingArticle({...editingArticle, paragraphs: updatedP});
                        }}
                        className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase">{isAr ? "عنوان الفصل بالإنجليزي (اختياري)" : "Section Subtitle EN"}</label>
                      <input
                        type="text"
                        value={p.title_en || ""}
                        onChange={(e) => {
                          const updatedP = [...(editingArticle.paragraphs || [])];
                          updatedP[pIdx].title_en = e.target.value;
                          setEditingArticle({...editingArticle, paragraphs: updatedP});
                        }}
                        className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-300 text-xs"
                      />
                    </div>

                    {p.type === "image" ? (
                      <div className="sm:col-span-2 space-y-3 bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">{isAr ? "رابط ومصدر الصورة المباشر" : "Direct Image URL (AR/Global)"}</label>
                            <input
                              type="text"
                              value={Array.isArray(p.content_ar) ? p.content_ar[0] || "" : p.content_ar}
                              onChange={(e) => {
                                const updatedP = [...(editingArticle.paragraphs || [])];
                                updatedP[pIdx].content_ar = e.target.value;
                                if (!updatedP[pIdx].content_en) {
                                  updatedP[pIdx].content_en = e.target.value;
                                }
                                setEditingArticle({...editingArticle, paragraphs: updatedP});
                              }}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-300 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">{isAr ? "رابط الصورة بالنسخة الإنجليزية" : "Direct Image URL (EN)"}</label>
                            <input
                              type="text"
                              value={Array.isArray(p.content_en) ? p.content_en[0] || "" : p.content_en}
                              onChange={(e) => {
                                const updatedP = [...(editingArticle.paragraphs || [])];
                                updatedP[pIdx].content_en = e.target.value;
                                setEditingArticle({...editingArticle, paragraphs: updatedP});
                              }}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-300 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5 font-mono uppercase">{isAr ? "تسمية كابشن توضيحية للصورة (Ar)" : "Image Caption/Note (AR)"}</label>
                            <input
                              type="text"
                              value={p.extra_ar || ""}
                              onChange={(e) => {
                                const updatedP = [...(editingArticle.paragraphs || [])];
                                updatedP[pIdx].extra_ar = e.target.value;
                                setEditingArticle({...editingArticle, paragraphs: updatedP});
                              }}
                              placeholder={isAr ? "مصدر الصورة أو شرح لخطوات التكوين..." : "E.g., Diagram source..."}
                              className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5 font-mono uppercase">{isAr ? "تسمية كابشن توضيحية للصورة (En)" : "Image Caption/Note (EN)"}</label>
                            <input
                              type="text"
                              value={p.extra_en || ""}
                              onChange={(e) => {
                                const updatedP = [...(editingArticle.paragraphs || [])];
                                updatedP[pIdx].extra_en = e.target.value;
                                setEditingArticle({...editingArticle, paragraphs: updatedP});
                              }}
                              placeholder="Image contextual caption shown under frame..."
                              className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-slate-300 text-xs"
                            />
                          </div>
                        </div>

                        {/* Presets Grid */}
                        <div className="pt-2 border-t border-slate-900/60">
                          <span className="block text-[10px] text-slate-400 font-bold mb-1.5 uppercase font-mono">
                            ⚡ {isAr ? "نماذج صور فنية شبكية جاهزة فائقة الدقة بنقرة واحدة:" : "Quick Premium Network Illustration Presets:"}
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { name: isAr ? "ألياف ضوئية" : "Fiber Optics", url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800" },
                              { name: isAr ? "سيرفرات سحابية" : "Server Racks", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800" },
                              { name: isAr ? "حماية وجدار ناري" : "Cyber Security", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800" },
                              { name: isAr ? "لوحة دوائر متطورة" : "Computer Board", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800" },
                              { name: isAr ? "مؤشر سرعة" : "Broadband Speed", url: "https://images.unsplash.com/photo-1610563166150-b3dfdf224c7e?q=80&w=800" }
                            ].map((temp, tIdx) => (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => {
                                  const updatedP = [...(editingArticle.paragraphs || [])];
                                  updatedP[pIdx].content_ar = temp.url;
                                  updatedP[pIdx].content_en = temp.url;
                                  setEditingArticle({...editingArticle, paragraphs: updatedP});
                                }}
                                className="group/btn relative h-11 rounded bg-slate-950 border border-slate-800 hover:border-blue-500 overflow-hidden text-[9px] font-bold text-slate-400 hover:text-white flex flex-col items-center justify-end p-1 transition-all"
                              >
                                <img src={temp.url} alt={temp.name} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover/btn:opacity-55 transition-opacity" />
                                <span className="relative z-10 bg-slate-950/90 border border-slate-900 leading-tight block w-full text-center py-0.5 rounded leading-none truncate text-[8px]">{temp.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Live preview */}
                        {p.content_en && typeof p.content_en === 'string' && p.content_en.startsWith("http") && (
                          <div className="flex items-center justify-between gap-4 p-2 bg-slate-950 rounded-lg border border-slate-900 text-xs">
                            <span className="text-[10px] text-slate-500 font-mono">👁️ {isAr ? "معاينة اللقطة النشطة:" : "Live Picture Preview:"}</span>
                            <img src={p.content_en} referrerPolicy="no-referrer" alt="Quick preview" className="h-12 w-20 rounded border border-slate-800 object-cover" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase">{isAr ? "محتوى ونصوص الفقرة (عربي)" : "Paragraph Body Content (AR)"}</label>
                          <textarea
                            value={Array.isArray(p.content_ar) ? p.content_ar.join("\n") : p.content_ar}
                            onChange={(e) => {
                              const updatedP = [...(editingArticle.paragraphs || [])];
                              const val = e.target.value;
                              updatedP[pIdx].content_ar = p.type === "bullets" ? val.split("\n") : val;
                              setEditingArticle({...editingArticle, paragraphs: updatedP});
                            }}
                            rows={3}
                            placeholder={p.type === "bullets" ? (isAr ? "كل سطر بالترتيب يمثل نقطة تعداد مستقلة" : "Each line corresponds to one list point") : (isAr ? "اكتب نصوص الفقرة هنا..." : "Write paragraph text here...")}
                            className="w-full bg-slate-900 border border-slate-800/80 rounded p-2 text-slate-300 text-xs font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase">{isAr ? "محتوى ونصوص الفقرة (انجليزي)" : "Paragraph Body Content (EN)"}</label>
                          <textarea
                            value={Array.isArray(p.content_en) ? p.content_en.join("\n") : p.content_en}
                            onChange={(e) => {
                              const updatedP = [...(editingArticle.paragraphs || [])];
                              const val = e.target.value;
                              updatedP[pIdx].content_en = p.type === "bullets" ? val.split("\n") : val;
                              setEditingArticle({...editingArticle, paragraphs: updatedP});
                            }}
                            rows={3}
                            placeholder={p.type === "bullets" ? "Each line corresponds to one sequence list item" : "Write paragraph text here..."}
                            className="w-full bg-slate-900 border border-slate-800/80 rounded p-2 text-slate-300 text-xs font-mono"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add triggers row */}
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-900" id="quick-add-paragraphs-bar">
              <span className="text-[10px] text-slate-400 font-mono font-bold mr-2 uppercase tracking-wide">
                {isAr ? "➕ إضافة عناصر للمقال:" : "➕ Append Narrative Chapter:"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const updatedP = [...(editingArticle.paragraphs || []), { type: "text", content_ar: "", content_en: "" }];
                  setEditingArticle({...editingArticle, paragraphs: updatedP as any});
                }}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-350 hover:text-white transition-all cursor-pointer"
              >
                <span>📝 {isAr ? "فقرة نصية" : "Plain Text"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedP = [...(editingArticle.paragraphs || []), { type: "highlight", content_ar: "", content_en: "" }];
                  setEditingArticle({...editingArticle, paragraphs: updatedP as any});
                }}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-350 hover:text-white transition-all cursor-pointer"
              >
                <span>💡 {isAr ? "مربع تمييز ملون" : "Highlight Box"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedP = [...(editingArticle.paragraphs || []), { type: "config", content_ar: "", content_en: "" }];
                  setEditingArticle({...editingArticle, paragraphs: updatedP as any});
                }}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-350 hover:text-white transition-all cursor-pointer"
              >
                <span>⚙️ {isAr ? "تكوين شيفرة/فني" : "Code Snippet"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedP = [...(editingArticle.paragraphs || []), { type: "bullets", content_ar: [], content_en: [] }];
                  setEditingArticle({...editingArticle, paragraphs: updatedP as any});
                }}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-350 hover:text-white transition-all cursor-pointer"
              >
                <span>📊 {isAr ? "قائمة تعداد نقاط" : "Bullet Points"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedP = [...(editingArticle.paragraphs || []), { 
                    type: "image", 
                    content_ar: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800", 
                    content_en: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800",
                    extra_ar: "رسم تخطيطي للمسارات وتدفق البيانات الفني لعناصر التحكم",
                    extra_en: "Technical schematic showing routes and latency controller loops"
                  }];
                  setEditingArticle({...editingArticle, paragraphs: updatedP as any});
                }}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3.5 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-900 text-[11px] text-blue-400 hover:text-blue-300 font-bold transition-all cursor-pointer shadow-lg shadow-blue-950/40"
              >
                <span>📸 {isAr ? "إضافة صورة توضيحية" : "Add Illustration Picture"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setEditingArticle(null)}
              className="w-full sm:w-auto text-center justify-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-bold transition-all cursor-pointer flex items-center"
            >
              {isAr ? "إلغاء الأمر" : "Cancel"}
            </button>
            <button
              onClick={saveArticleForm}
              disabled={apiLoading}
              className="w-full sm:w-auto justify-center flex items-center space-x-1.5 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{apiLoading ? (isAr ? "يجري الحفظ والمزامنة..." : "Saving...") : (isAr ? "حفظ وتثبيت المقال" : "Save and Deploy Article")}</span>
            </button>
          </div>
        </div>
      )}

      {/* RDP / VPS editor */}
      {editingRdp && (
        <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative animate-fade-in">
          <button onClick={() => setEditingRdp(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-400 font-bold text-sm mb-4">
            <Server className="w-4 h-4" />
            <span>{isAr ? "لوحة تعديل صفقات الـ VPS / RDP" : "Cloud Dedicated Instance Configuration"}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-6">
            {isAr ? "تعديل صفقة وباقة خادم ومضيف" : "Configure VPS Server Pack"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase">ID Slug</label>
              <input
                type="text"
                value={editingRdp.id}
                onChange={(e) => setEditingRdp({...editingRdp, id: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase">Host Name</label>
              <input
                type="text"
                value={editingRdp.hostName}
                onChange={(e) => setEditingRdp({...editingRdp, hostName: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">CPU Cores (Number)</label>
              <input
                type="number"
                value={editingRdp.cores}
                onChange={(e) => setEditingRdp({...editingRdp, cores: parseInt(e.target.value) || 2})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">RAM Size</label>
              <input
                type="text"
                value={editingRdp.ram}
                onChange={(e) => setEditingRdp({...editingRdp, ram: e.target.value})}
                placeholder="4 GB"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Storage SSD size</label>
              <input
                type="text"
                value={editingRdp.storage}
                onChange={(e) => setEditingRdp({...editingRdp, storage: e.target.value})}
                placeholder="80 GB SSD"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Bandwidth Limit</label>
              <input
                type="text"
                value={editingRdp.bandwidth}
                onChange={(e) => setEditingRdp({...editingRdp, bandwidth: e.target.value})}
                placeholder="5,000 GB / mo"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">IP Address Allocation</label>
              <input
                type="text"
                value={editingRdp.ipType}
                onChange={(e) => setEditingRdp({...editingRdp, ipType: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Region (AR)</label>
              <input
                type="text"
                value={editingRdp.region_ar}
                onChange={(e) => setEditingRdp({...editingRdp, region_ar: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Region (EN)</label>
              <input
                type="text"
                value={editingRdp.region_en}
                onChange={(e) => setEditingRdp({...editingRdp, region_en: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Price (Monthly USD, e.g. $19)</label>
              <input
                type="text"
                value={editingRdp.priceMonthly}
                onChange={(e) => setEditingRdp({...editingRdp, priceMonthly: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Price (Yearly USD, e.g. $171)</label>
              <input
                type="text"
                value={editingRdp.priceYearly}
                onChange={(e) => setEditingRdp({...editingRdp, priceYearly: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Affiliate link (Monthly)</label>
              <input
                type="text"
                value={editingRdp.affiliateLinkMonthly}
                onChange={(e) => setEditingRdp({...editingRdp, affiliateLinkMonthly: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Affiliate link (Yearly)</label>
              <input
                type="text"
                value={editingRdp.affiliateLinkYearly}
                onChange={(e) => setEditingRdp({...editingRdp, affiliateLinkYearly: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Features (AR - New Line separated)</label>
              <textarea
                value={editingRdp.features_ar?.join("\n")}
                onChange={(e) => setEditingRdp({...editingRdp, features_ar: e.target.value.split("\n")})}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Features (EN - New Line separated)</label>
              <textarea
                value={editingRdp.features_en?.join("\n")}
                onChange={(e) => setEditingRdp({...editingRdp, features_en: e.target.value.split("\n")})}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-850">
            <button onClick={() => setEditingRdp(null)} className="w-full sm:w-auto justify-center text-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold transition-all cursor-pointer flex items-center">
              {isAr ? "إلغاء الأمر" : "Cancel"}
            </button>
            <button onClick={saveRdpForm} disabled={apiLoading} className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse">
              <Save className="w-4 h-4 flex-shrink-0" />
              <span>{apiLoading ? (isAr ? "يجري الحفظ..." : "Syncing...") : (isAr ? "تخزين صفقة المضيف" : "Save VPS Package")}</span>
            </button>
          </div>
        </div>
      )}

      {/* VPN Editor */}
      {editingVpn && (
        <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative animate-fade-in">
          <button onClick={() => setEditingVpn(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-400 font-bold text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>{isAr ? "مدير عروض الـ VPN الشريكة" : "Strategic VPN Affiliate Adjustments"}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-6">
            {isAr ? "إعداد عروض وتفاصيل الـ VPN" : "Edit VPN Partner Slot"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono uppercase">ID Slug</label>
              <input
                type="text"
                value={editingVpn.id}
                onChange={(e) => setEditingVpn({...editingVpn, id: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Corporate Name</label>
              <input
                type="text"
                value={editingVpn.name}
                onChange={(e) => setEditingVpn({...editingVpn, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Badge (AR)</label>
              <input
                type="text"
                value={editingVpn.badge_ar}
                onChange={(e) => setEditingVpn({...editingVpn, badge_ar: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Badge (EN)</label>
              <input
                type="text"
                value={editingVpn.badge_en}
                onChange={(e) => setEditingVpn({...editingVpn, badge_en: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Rating score (e.g. 4.9)</label>
              <input
                type="number"
                step="0.1"
                value={editingVpn.rating}
                onChange={(e) => setEditingVpn({...editingVpn, rating: parseFloat(e.target.value) || 4.5})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Average Measured Speed</label>
              <input
                type="text"
                value={editingVpn.speedRating}
                onChange={(e) => setEditingVpn({...editingVpn, speedRating: e.target.value})}
                placeholder="97 Mbps Avg"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Price monthly tag</label>
              <input
                type="text"
                value={editingVpn.price}
                onChange={(e) => setEditingVpn({...editingVpn, price: e.target.value})}
                placeholder="$2.99 / mo"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Affiliate custom Link</label>
              <input
                type="text"
                value={editingVpn.affiliateLink}
                onChange={(e) => setEditingVpn({...editingVpn, affiliateLink: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Theme visual gradient colors</label>
              <input
                type="text"
                value={editingVpn.logoColorClassName}
                onChange={(e) => setEditingVpn({...editingVpn, logoColorClassName: e.target.value})}
                placeholder="from-blue-600 to-indigo-700"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Match Category Filter</label>
              <select
                value={editingVpn.category}
                onChange={(e) => setEditingVpn({...editingVpn, category: e.target.value as any})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono focus:outline-none"
              >
                <option value="gaming">gaming</option>
                <option value="speed">speed</option>
                <option value="privacy">privacy</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Description (AR)</label>
              <textarea
                value={editingVpn.description_ar}
                onChange={(e) => setEditingVpn({...editingVpn, description_ar: e.target.value})}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Description (EN)</label>
              <textarea
                value={editingVpn.description_en}
                onChange={(e) => setEditingVpn({...editingVpn, description_en: e.target.value})}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Highlights list (AR - New Line separated)</label>
              <textarea
                value={editingVpn.features_ar?.join("\n")}
                onChange={(e) => setEditingVpn({...editingVpn, features_ar: e.target.value.split("\n")})}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Highlights list (EN - New Line separated)</label>
              <textarea
                value={editingVpn.features_en?.join("\n")}
                onChange={(e) => setEditingVpn({...editingVpn, features_en: e.target.value.split("\n")})}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-850">
            <button onClick={() => setEditingVpn(null)} className="w-full sm:w-auto justify-center text-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold transition-all cursor-pointer flex items-center">
              {isAr ? "إلغاء الأمر" : "Cancel"}
            </button>
            <button onClick={saveVpnForm} disabled={apiLoading} className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse">
              <Save className="w-4 h-4 flex-shrink-0" />
              <span>{apiLoading ? (isAr ? "يجري الحفظ..." : "Syncing...") : (isAr ? "تخزين صفقة الـ VPN" : "Save VPN Listing")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Segmented controls to select standard active tables tab */}
      <div className="flex bg-slate-950 border border-slate-900 rounded-2xl p-1 mb-6 w-full max-w-4xl shadow-inner select-none overflow-x-auto whitespace-nowrap scrollbar-none flex-nowrap gap-1" id="admin-segmented-bar">
        {["super_admin", "admin"].includes(authenticatedUser.role) && (
          <button
            onClick={() => handleTabToggle("analytics")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
              activeTab === "analytics"
                ? "bg-slate-900 text-amber-400 border border-slate-800 shadow shadow-amber-950/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span>{isAr ? "تحليلات المنصة" : "Platform Analytics"}</span>
          </button>
        )}

        {["super_admin", "admin", "editor"].includes(authenticatedUser.role) && (
          <button
            onClick={() => handleTabToggle("articles")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
              activeTab === "articles"
                ? "bg-slate-900 text-blue-400 border border-slate-800 shadow shadow-blue-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span>{isAr ? "المدونة والمقالات" : "Blog Posts"}</span>
            <span className="bg-slate-950 border border-slate-800/60 rounded px-1.5 py-0.5 text-[10px] text-slate-500 font-bold">
              {articles.length}
            </span>
          </button>
        )}

        {["super_admin", "admin"].includes(authenticatedUser.role) && (
          <>
            <button
              onClick={() => handleTabToggle("vpn")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
                activeTab === "vpn"
                  ? "bg-slate-900 text-teal-400 border border-slate-800 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>{isAr ? "عروض الـ VPN" : "VPN Deals"}</span>
              <span className="bg-slate-950 border border-slate-800/60 rounded px-1.5 py-0.5 text-[10px] text-slate-500 font-bold">
                {vpnOffers.length}
              </span>
            </button>

            <button
              onClick={() => handleTabToggle("rdp")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
                activeTab === "rdp"
                  ? "bg-slate-900 text-indigo-400 border border-slate-800 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Server className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>{isAr ? "سيرفرات RDP/VPS" : "RDP Hosts"}</span>
              <span className="bg-slate-950 border border-slate-800/60 rounded px-1.5 py-0.5 text-[10px] text-slate-500 font-bold">
                {rdpOffers.length}
              </span>
            </button>
          </>
        )}

        {authenticatedUser.role === "super_admin" && (
          <>
            <button
              onClick={() => handleTabToggle("users")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
                activeTab === "users"
                  ? "bg-slate-900 text-purple-400 border border-slate-800 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>{isAr ? "إدارة المستخدمين" : "Users SaaS"}</span>
              <span className="bg-slate-950 border border-slate-800/60 rounded px-1.5 py-0.5 text-[10px] text-slate-500 font-bold">
                {users.length || "0"}
              </span>
            </button>

            <button
              onClick={() => handleTabToggle("sessions")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
                activeTab === "sessions"
                  ? "bg-slate-900 text-blue-400 border border-slate-800 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Key className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>{isAr ? "سجلات الاتصال" : "Active Sessions"}</span>
            </button>

            <button
              onClick={() => handleTabToggle("settings")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer flex-shrink-0 ${
                activeTab === "settings"
                  ? "bg-slate-900 text-rose-450 border border-slate-800 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SettingsIcon className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>{isAr ? "الإعدادات العامة" : "Site Settings"}</span>
            </button>
          </>
        )}
      </div>

      {/* Rendering tab body contents */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden" id="tab-database-contents">
        
        {/* TAB 0: ANALYTICS DASHBOARD */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <BarChart3 className="w-4.5 h-4.5 text-amber-400" />
                <span>{isAr ? "تحليلات الأداء ومراقبة المنصة" : "Platform Telemetry & Analytics Overview"}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? "بيانات حية مباشرة ترصد نشاط الشبكة وإجراء اختبارات السرعة والوفر المترتب عليها" : "Live statistics generated from network analytics and diagnostics metrics."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{isAr ? "المستخدمين" : "Registered Users"}</span>
                <span className="text-2xl font-black text-white mt-1">{analytics?.totalUsers || 4}</span>
                <span className="text-[10px] text-emerald-400 font-mono mt-1.5 flex items-center gap-0.5">🟢 {isAr ? "نشطين بالكامل" : "All authorized"}</span>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{isAr ? "مقالات المدونة" : "Total Articles"}</span>
                <span className="text-2xl font-black text-white mt-1">{analytics?.totalArticles || articles.length}</span>
                <span className="text-[10px] text-blue-400 font-mono mt-1.5">📝 {isAr ? "دليل فني مسرَّع" : "Published articles"}</span>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{isAr ? "عروض الـ VPN" : "Active VPN Nodes"}</span>
                <span className="text-2xl font-black text-white mt-1">{analytics?.activeVpn || vpnOffers.length}</span>
                <span className="text-[10px] text-teal-400 font-mono mt-1.5">⚡ {isAr ? "خادم موثَّق" : "Fully verified"}</span>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{isAr ? "باقات RDP" : "RDP Clusters"}</span>
                <span className="text-2xl font-black text-white mt-1">{analytics?.activeRdp || rdpOffers.length}</span>
                <span className="text-[10px] text-indigo-400 font-mono mt-1.5">🖥️ {isAr ? "مزود خدمة" : "Listed endpoints"}</span>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{isAr ? "اختبارات السرعة" : "Simulated Tests"}</span>
                <span className="text-2xl font-black text-white mt-1">{analytics?.simulatedTests || 148}</span>
                <span className="text-[10px] text-amber-400 font-mono mt-1.5 flex items-center gap-0.5">🔥 Live diagnostics</span>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{isAr ? "الاستجابة المحسنة" : "Ping Boost Avg"}</span>
                <span className="text-2xl font-black text-emerald-400 mt-1">{analytics?.avgLatencySaved || 12.5} ms</span>
                <span className="text-[10px] text-emerald-450 font-mono mt-1.5 font-bold">🚀 latency delta</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center gap-4 text-xs">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
              <div>
                <p className="text-slate-300 leading-relaxed font-mono">
                  {isAr 
                    ? "يقوم المحرك الذكي بتحليل نقاط الاتصال في الخلفية وتوزيع طلبات تحويل الترافيك تلقائياً لتخفيف ضغط خطوط الفايبر المشتركة." 
                    : "The optimization engine tracks core backbone clusters in real-time, matching network routes dynamically."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: USERS SAAS MANAGEMENT */}
        {activeTab === "users" && authenticatedUser.role === "super_admin" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="w-4.5 h-4.5 text-purple-400" />
                  <span>{isAr ? "إدارة وتفويض حسابات العاملين بالمنصة" : "Manage SaaS Employee Accounts"}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "توزيع الأدوار للموظفين والناشرين وتعديل رتبهم وصلاحيات وصولهم" : "Create administrative users and update authorization scopes."}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingUser(true);
                  setUserFormEmail("");
                  setUserFormPassword("");
                  setUserFormRole("user");
                  setUserFormNameEn("");
                  setUserFormNameAr("");
                }}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "إضافة حساب مستخدم جديد" : "Provision New Enterprise Role"}</span>
              </button>
            </div>

            {/* Editable subform for users */}
            {editingUser && (
              <div className="p-5 border border-purple-900/30 rounded-2xl bg-slate-900/50 space-y-4 animate-slide-down">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <h4 className="text-xs uppercase font-mono font-black text-purple-400">
                    {typeof editingUser === "object" ? (isAr ? "تعديل مستخدم نشط" : "Refinement configuration") : (isAr ? "إنشاء حساب جديد بالمنصة" : "Provisioning Credentials")}
                  </h4>
                  <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
                    <input
                      type="email"
                      value={userFormEmail}
                      onChange={(e) => setUserFormEmail(e.target.value)}
                      placeholder="user@doctor.com"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-slate-300 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">
                      {isAr ? "كلمة المرور المشفرة" : "Password (hashed)"}
                      {typeof editingUser === "object" && <span className="text-[9px] text-amber-500 lowercase ml-1"> (optional to change)</span>}
                    </label>
                    <input
                      type="text"
                      value={userFormPassword}
                      onChange={(e) => setUserFormPassword(e.target.value)}
                      placeholder={typeof editingUser === "object" ? " оставляйте пустым" : "••••••••"}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-slate-300 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">{isAr ? "صلاحيات الدور الوظيفي" : "Access Tier Role"}</label>
                    <select
                      value={userFormRole}
                      onChange={(e) => setUserFormRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-slate-300 text-xs focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                    >
                      <option value="super_admin">Super Admin (منسق عام)</option>
                      <option value="admin">Admin (مسؤول مبيعات)</option>
                      <option value="editor">Editor (ناشر مقالات)</option>
                      <option value="user">User (مستهلك عادي)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">{isAr ? "الاسم الكامل (English)" : "Full Name (English)"}</label>
                    <input
                      type="text"
                      value={userFormNameEn}
                      onChange={(e) => setUserFormNameEn(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-slate-300 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">{isAr ? "الاسم بالكامل (العربية)" : "Full Name (Arabic)"}</label>
                    <input
                      type="text"
                      value={userFormNameAr}
                      onChange={(e) => setUserFormNameAr(e.target.value)}
                      placeholder="جاسم الغامدي"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-slate-300 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-slate-950 border border-slate-900 text-slate-400 rounded-xl text-xs hover:text-white transition-colors cursor-pointer"
                  >
                    {isAr ? "إلغاء الأمر" : "Cancel"}
                  </button>
                  <button
                    onClick={saveUserForm}
                    disabled={apiLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? "تخزين البيانات" : "Save Credentials"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* List and Tables of current users in responsive layout */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 font-mono font-bold uppercase tracking-wider border-b border-slate-900">
                      <th className="p-4">{isAr ? "الاسم كامل" : "Full Name"}</th>
                      <th className="p-4">{isAr ? "البريد الإلكتروني المهني" : "Professional Email"}</th>
                      <th className="p-4 text-center">{isAr ? "مستوى الدخول" : "SaaS Role Scope"}</th>
                      <th className="p-4 text-right rtl:text-left">{isAr ? "العمليات البرمجية" : "Developer Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/50">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="p-4 font-black text-slate-200">
                          {isAr ? (u.name_ar || u.name_en) : u.name_en}
                        </td>
                        <td className="p-4 font-mono text-slate-400">{u.email}</td>
                        <td className="p-4 text-center text-xs">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-black border ${
                            u.role === "super_admin" 
                              ? "bg-purple-950/20 text-purple-400 border-purple-900/30" 
                              : u.role === "admin" 
                              ? "bg-blue-950/20 text-blue-400 border-blue-900/30"
                              : u.role === "editor"
                              ? "bg-amber-950/20 text-amber-500 border-amber-900/30"
                              : "bg-slate-950 text-slate-400 border-slate-900"
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right rtl:text-left space-x-2 rtl:space-x-reverse whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setUserFormEmail(u.email);
                              setUserFormPassword("");
                              setUserFormRole(u.role);
                              setUserFormNameEn(u.name_en);
                              setUserFormNameAr(u.name_ar || "");
                            }}
                            className="p-2 bg-slate-900 hover:bg-slate-850 hover:text-purple-400 rounded-lg text-slate-400 border border-slate-800 transition-colors"
                            title={isAr ? "تعديل المستخدم" : "Change privilege roles"}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-2 bg-red-950/10 hover:bg-red-950/35 hover:text-red-400 rounded-lg text-red-500 border border-red-900/10 hover:border-red-900/40 transition-colors"
                            title={isAr ? "حذف وسحب صلاحيات الدخول" : "Revoke employee session permissions"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: GENERAL SITE SETTINGS */}
        {activeTab === "settings" && authenticatedUser.role === "super_admin" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <SettingsIcon className="w-4.5 h-4.5 text-rose-450" />
                <span>{isAr ? "التحكم في المظهر وتفضيلات المحرك الذكي" : "Global SaaS Parameters & Layout Branding"}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? "تحرير الأسماء الرسمية وإيميل التواصل والمحركات السحابية المعتمدة" : "Overhaul core platform tags, electronics mail contact, and backend security variables."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/35 p-6 border border-slate-900 rounded-3xl">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">{isAr ? "اسم الموقع بالكامل (العربية)" : "Site Domain Branding (Arabic)"}</label>
                <input
                  type="text"
                  value={settings?.siteName_ar || ""}
                  onChange={(e) => setSettings({ ...settings, siteName_ar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-300 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">{isAr ? "اسم الموقع بالكامل (English)" : "Site Domain Branding (English)"}</label>
                <input
                  type="text"
                  value={settings?.siteName_en || ""}
                  onChange={(e) => setSettings({ ...settings, siteName_en: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-300 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">{isAr ? "صندوق بريد الدعم الفني" : "System Support Electronic Mail"}</label>
                <input
                  type="email"
                  value={settings?.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-300 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">{isAr ? "طراز محرك الذكاء الاصطناعي (Gemini)" : "Active AI Integration Platform Model"}</label>
                <select
                  value={settings?.aiEngineModel || "gemini-3.5-flash"}
                  onChange={(e) => setSettings({ ...settings, aiEngineModel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-300 text-xs focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (سرعة قصوى)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (ذكاء استثنائي)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (إرثي)</option>
                </select>
              </div>

              {/* Maintenance & 2FA controls inside professional dashboard switches */}
              <div className="md:col-span-2 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900/60 mt-4 pt-6">
                <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer group p-3 bg-slate-950 border border-slate-900 rounded-2xl select-none">
                  <input
                    type="checkbox"
                    checked={settings?.maintenanceMode || false}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-4.5 h-4.5 rounded text-rose-500 bg-slate-900 border-slate-800 focus:ring-0 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors block">{isAr ? "تفعيل وضع الصيانة الفنية للزوار" : "Activate System Maintenance Mode"}</span>
                    <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">{isAr ? "يقوم بتحويل الزوار لصفحة توقف فني مؤقتاً" : "Renders a secure maintenance roadblock page for general consumers."}</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer group p-3 bg-slate-950 border border-slate-900 rounded-2xl select-none">
                  <input
                    type="checkbox"
                    checked={settings?.requireTwoFactor || false}
                    onChange={(e) => setSettings({ ...settings, requireTwoFactor: e.target.checked })}
                    className="w-4.5 h-4.5 rounded text-rose-500 bg-slate-900 border-slate-800 focus:ring-0 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors block">{isAr ? "فرض المصادقة الثنائية (2FA)" : "Require Multi-Factor (2FA) for Admins"}</span>
                    <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">{isAr ? "يطلب كود تأكيد للهاتف المحمول عند الدخول" : "Forces mandatory verification codes during admin sessions."}</span>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-900/60 mt-4">
                <button
                  onClick={() => updateSettingsForm(settings)}
                  disabled={apiLoading}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? "حفظ وتطبيق البراندينق" : "Apply Enterprise Settings"}</span>
                </button>
              </div>
            </div>

            {/* Multi-Device Sessions Management Panel */}
            <div className="mt-8 bg-slate-900/25 border border-slate-900/60 rounded-3xl p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-rose-500" />
                  <span>{isAr ? "إدارة الجلسات والأجهزة النشطة (الأمان)" : "Active Sessions & Multi-Device Security"}</span>
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  {isAr 
                    ? "قائمة بالملفات الشخصية والأجهزة التي سجلت الدخول حالياً لحسابك. يمكنك إلغاء تفويض الجلسات فوراً لإخراج الأجهزة الأخرى من الحساب."
                    : "Track all active login streams for your security clearance. You may choose to revoke any session to instantly sign-out any other device."
                  }
                </p>
              </div>

              <div className="space-y-3">
                {userSessions.map((s: any) => (
                  <div key={s.id} className="bg-slate-950/80 border border-slate-900/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 font-mono tracking-tight">{s.ip || "127.0.0.1"}</span>
                        {s.isCurrent ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                            {isAr ? "الجلسة الحالية" : "Current Web Session"}
                          </span>
                        ) : (
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                            {isAr ? "نشط" : "Active Remote Session"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono select-all break-all pr-4">{s.userAgent || "Desktop Browser"}</p>
                      <p className="text-[9px] text-slate-500 font-sans mt-1">
                        {isAr ? "تاريخ الإنشاء: " : "Initiated: "}
                        <span className="font-mono text-slate-400">{new Date(s.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                      </p>
                    </div>

                    {!s.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-950/30 border border-red-900/50 hover:bg-red-900/20 text-red-400 text-[10px] font-black font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isAr ? "إنهاء الجلسة فوراً" : "Revoke & Evict Device"}</span>
                      </button>
                    )}
                  </div>
                ))}

                {userSessions.length === 0 && (
                  <p className="text-center text-xs text-slate-600 font-mono py-6">
                    {isAr ? "لا توجد جلسات أخرى مسجلة أو جاري جلب تفاصيل الجلسات..." : "No other registered sessions active, or resolving remote status..."}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ARTICLES TAB */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <BookOpen className="w-4.5 h-4.5 text-blue-400" />
                  <span>{isAr ? "إدارة المنشورات التعليمية والمقالات" : "Manage Tech Content Articles"}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "اكتب تفصيلياً إرشادات تخطي خنق الـ ISP للألعاب والبث" : "Add detailed guides about latency reduction and ISP filtering overrides."}
                </p>
              </div>
              <button
                onClick={startAddArticle}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "إضافة مقالة جديدة" : "Add Technical Article"}</span>
              </button>
            </div>

            {/* Articles tables list */}
            <div className="sm:hidden flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] text-slate-550 font-mono bg-slate-950/45 border border-slate-900/40 py-1.5 rounded-lg mb-2 text-center animate-pulse">
              <span>{isAr ? "← اسحب أفقياً لعرض كامل أعمدة الجدول →" : "← Swipe horizontally to see complete table columns →"}</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-900 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <table className="w-full min-w-[700px] text-left rtl:text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-900">
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "المقالة" : "Article Slug"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "العنوان بالعربية" : "Arabic Title"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "الكاتب والمدة" : "Author & Read"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {articles.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/25 transition-colors">
                      <td className="py-3 px-4 font-mono text-blue-400 font-semibold">{item.id}</td>
                      <td className="py-3 px-4 font-medium line-clamp-1 max-w-[280px] mt-2">{item.title_ar}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        <div>{item.author}</div>
                        <div className="text-[10px] text-slate-500">{item.readTime_en}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingArticle(item)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white transition-all cursor-pointer"
                            title={isAr ? "تعديل" : "Edit"}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteArticle(item.id)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-red-950/40 text-red-500 hover:text-red-400 transition-all cursor-pointer"
                            title={isAr ? "حذف" : "Delete"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-550 font-mono">
                        {isAr ? "⚠️ لا توجد أي مقالات حالية!" : "⚠️ No articles active inside DB!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VPN OFFERS TAB */}
        {activeTab === "vpn" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <ShieldAlert className="w-4.5 h-4.5 text-teal-400" />
                  <span>{isAr ? "إدارة خدمات الـ VPN الشريكة" : "Manage Matched VPN Affiliates"}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "توجيه وترويج الروابط وخطوط السرعات ونسب الخصم" : "Manage measured speed indicators and custom direct partner checkout URL nodes."}
                </p>
              </div>
              <button
                onClick={startAddVpn}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "إضافة مزود VPN جديد" : "Add VPN Provider"}</span>
              </button>
            </div>

            <div className="sm:hidden flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] text-slate-550 font-mono bg-slate-950/45 border border-slate-900/40 py-1.5 rounded-lg mb-2 text-center animate-pulse">
              <span>{isAr ? "← اسحب أفقياً لعرض كامل أعمدة الجدول →" : "← Swipe horizontally to see complete table columns →"}</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-900 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <table className="w-full min-w-[650px] text-left rtl:text-right border-collapse text-xs flex-shrink-0">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-900">
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "الخدمة" : "Provider"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "رابط الـ Affiliate" : "Affiliate Destination"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "التصنيف والسعر" : "Type & Price"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {vpnOffers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/25 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={`w-2.5 h-2.5 rounded bg-gradient-to-r ${item.logoColorClassName}`} />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 hover:text-blue-400 truncate max-w-[200px] select-all cursor-pointer">{item.affiliateLink}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-amber-400 font-bold border border-slate-800 uppercase font-mono mr-1">
                          {item.category}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{item.price}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingVpn(item)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteVpn(item.id)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-red-950/40 text-red-500 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RDP OFFERS TAB */}
        {activeTab === "rdp" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Server className="w-4.5 h-4.5 text-indigo-400" />
                  <span>{isAr ? "إدارة صفقات وعروض الـ VPS / RDP" : "Manage Cloud RDP Packages"}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "تحرير عتاد الكمبيوترات السحابية ومواصفاتها والروابط" : "Edit computing specs, storage allocation limits, and server region tags."}
                </p>
              </div>
              <button
                onClick={startAddRdp}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "إضافة باقة سيرفر جديدة" : "Add RDP Node Option"}</span>
              </button>
            </div>

            <div className="sm:hidden flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] text-slate-550 font-mono bg-slate-950/45 border border-slate-900/40 py-1.5 rounded-lg mb-2 text-center animate-pulse">
              <span>{isAr ? "← اسحب أفقياً لعرض كامل أعمدة الجدول →" : "← Swipe horizontally to see complete table columns →"}</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-900 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <table className="w-full min-w-[650px] text-left rtl:text-right border-collapse text-xs flex-shrink-0">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-900">
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "مضيف السيرفر" : "Package Server Name"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "العتاد الافتراضي" : "Specifications"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider">{isAr ? "التسعير" : "Pricing Level"}</th>
                    <th className="py-3 px-4 font-mono uppercase tracking-wider text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {rdpOffers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/25 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{item.hostName}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {item.cores} vCores • {item.ram} RAM • {item.storage} SSD
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-emerald-400 font-bold">{item.priceMonthly} / mo</span>
                        <span className="text-slate-550 text-[10px] block font-mono">Yearly: {item.priceYearly}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingRdp(item)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteRdp(item.id)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-red-950/40 text-red-500 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
