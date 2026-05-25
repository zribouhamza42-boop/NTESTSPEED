import React, { useState, useEffect } from "react";
import { Language, PageId } from "../types";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, RefreshCw, Key } from "lucide-react";

interface LoginProps {
  language: Language;
  onLoginSuccess: (accessToken: string, refreshToken: string, sessionId: string, user: any, rememberMe: boolean) => void;
  setCurrentPage: (page: PageId) => void;
}

export default function Login({ language, onLoginSuccess, setCurrentPage }: LoginProps) {
  const isAr = language === "ar";
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBackToHome = () => {
    window.history.pushState(null, "", "/");
    setCurrentPage("home");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(isAr ? "جميع الحقول مطلوبة" : "All credentials fields are required");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      console.log("LOGIN RESPONSE:", text);

      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Success callback
      onLoginSuccess(data.accessToken, data.refreshToken, data.sessionId, data.user, rememberMe);
      
      // Redirect to Admin dashboard
      window.history.pushState(null, "", "/admin");
      setCurrentPage("admin");
    } catch (err: any) {
      console.error("Login verification error:", err);
      setErrorMsg(err.message || (isAr ? "خادم المصادقة غير متاح حالياً." : "Security auth server is currently unreachable."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 animate-fade-in" id="login-container-page">
      <div className="bg-slate-900/45 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 animate-pulse" />
        
        {/* Upper Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-900/40 mb-4">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {isAr ? "تسجيل دخول المسؤولين والناشرين" : "Secure SaaS Portal Entry"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {isAr 
              ? "تفويض آمن بمستويات صلاحية للوصول الحصري للأدوات والتحكم السحابي" 
              : "Authorize administrative session with role-based dashboard verification"
            }
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3 text-xs text-red-400 animate-head-shake">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">{isAr ? "خطأ في التحقق:" : "Authentication Failure:"}</span>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">
              {isAr ? "البريد الإلكتروني المهني" : "Professional Email Address"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="administrator@doctor.com"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                {isAr ? "كلمة المرور المشفرة" : "Secure Account Password"}
              </label>
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-10 py-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors tracking-wide font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-medium">
                {isAr ? "تذكر بيانات دخولي على هذا المتصفح" : "Remember my session on this device"}
              </span>
            </label>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-3.5 shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isAr ? "يرجى الانتظار..." : "Authorizing session..."}</span>
              </>
            ) : (
              <span>{isAr ? "تفويض الدخول والتحقق" : "Authorize Secure Entrance"}</span>
            )}
          </button>
        </form>

        {/* Quick Credentials Info card for seamless testing */}
        <div className="mt-8 pt-5 border-t border-slate-900/60 text-slate-400 text-xs">
          <span className="font-bold text-blue-400 block mb-2 uppercase text-[10px] tracking-widest font-mono">
            💡 {isAr ? "حسابات الفحص السريع المتوفرة بالمنصة:" : "Available Platform Test Roles:"}
          </span>
          <div className="space-y-1.5 font-mono text-[10.5px] bg-slate-950/40 p-3 rounded-xl border border-slate-900/40 text-left rtl:text-right">
            <div>
              <span className="text-purple-400 font-black">Super Admin: </span>
              <span className="text-slate-200">superadmin@doctor.com</span> <span className="opacity-80">/</span> <span className="text-blue-300">superadmin2026</span>
            </div>
            <div>
              <span className="text-blue-400 font-black">Admin: </span>
              <span className="text-slate-200">admin@doctor.com</span> <span className="opacity-80">/</span> <span className="text-blue-300">admin2026</span>
            </div>
            <div>
              <span className="text-amber-400 font-black">Editor: </span>
              <span className="text-slate-200">editor@doctor.com</span> <span className="opacity-80">/</span> <span className="text-blue-300">editor2026</span>
            </div>
            <div>
              <span className="text-emerald-400 font-black">User (Reg): </span>
              <span className="text-slate-200">user@doctor.com</span> <span className="opacity-80">/</span> <span className="text-blue-300">user2026</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <button
          onClick={handleBackToHome}
          className="mt-6 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium border-t border-slate-900/60 pt-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isAr ? "العودة للرئيسية" : "Cancel and Return to Home"}</span>
        </button>
      </div>
    </div>
  );
}
