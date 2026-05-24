import React, { useState } from "react";
import { PageId, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { Activity, Globe, Menu, X, Shield, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AudioToggleWidget } from "./FutureAmbiance";

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  language: Language;
  toggleLanguage: () => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  language,
  toggleLanguage,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[language];
  const { token, user, logout } = useAuth();

  const handleNav = (page: PageId) => {
    setCurrentPage(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems: { id: PageId; label: string }[] = [
    { id: "home", label: t.navHome },
    { id: "speedtest", label: t.navSpeedTest },
    { id: "vpn", label: t.navVpnOffers },
    { id: "rdp", label: t.navRdpOffers },
    { id: "blog", label: t.navBlog },
    { id: "how-it-works", label: t.navHowItWorks },
    { id: "faq", label: t.navFaq },
  ];

  const displayName = user ? (language === "ar" ? user.name_ar || user.email : user.name_en || user.email) : "";
  const isAdmin = user && ["super_admin", "admin", "editor"].includes(user.role);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-blue-900/40" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand/Logo */}
          <div 
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
            onClick={() => handleNav("home")}
            id="nav-logo"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white bg-gradient-to-r from-blue-400 to-white bg-clip-text">
                {language === "ar" ? t.brandTitle : t.brandName}
              </span>
              <p className="text-[10px] text-blue-400 font-mono tracking-wider opacity-85 uppercase">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse" id="nav-desktop-links">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === "speedtest" && currentPage === "analysis");
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  id={`nav-item-${item.id}`}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-950/50 border border-blue-800/50 shadow-[0_0_10px_rgba(30,58,138,0.3)]"
                      : "text-slate-300 hover:text-white hover:bg-slate-900/50 hover:border hover:border-transparent"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* CTA & Language buttons */}
          <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse" id="nav-desktop-actions">
            
            {/* Admin Panel button if authenticated and has admin privileges */}
            {token && user && isAdmin && (
              <button
                onClick={() => handleNav("admin")}
                id="nav-admin-panel-desktop"
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-400 text-sm font-bold hover:bg-amber-950/40 hover:border-amber-500/50 transition-all duration-200"
              >
                <Shield className="w-4 h-4 text-amber-500" />
                <span>{language === "ar" ? "لوحة التحكم" : "Admin Panel"}</span>
              </button>
            )}

            {/* Profile greeting + Log out button */}
            {token && user ? (
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse border border-slate-800 bg-slate-900/45 rounded-xl p-1 px-3 shadow-inner" id="nav-user-indicator">
                <span className="text-xs text-slate-400 max-w-[140px] truncate select-none font-mono">
                  {language === "ar" ? "أهلاً، " : "Hi, "}
                  <strong className="text-blue-400 font-bold">{displayName}</strong>
                </span>
                
                <button
                  onClick={() => {
                    logout();
                    handleNav("home");
                  }}
                  id="nav-logout-button-desktop"
                  className="p-1 px-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-900/20 hover:border-red-900/50 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                  title={language === "ar" ? "تسجيل الخروج" : "Log out"}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">{language === "ar" ? "خروج" : "Exit"}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav("login")}
                id="nav-login-button-desktop"
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all duration-200"
              >
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </button>
            )}

            {/* Futuristic Sound Toggle */}
            <AudioToggleWidget language={language} />

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              id="lang-toggle-button-desktop"
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-medium transition-all duration-200"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{t.langToggle}</span>
            </button>

            {/* CTA */}
            <button
              onClick={() => handleNav("speedtest")}
              id="nav-cta-desktop"
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-505 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-1"
            >
              <span>{t.ctaStartTest}</span>
            </button>
          </div>

          {/* Controls (Mobile) */}
          <div className="flex lg:hidden items-center space-x-2 rtl:space-x-reverse" id="nav-mobile-hamburger">
            {token && user && (
              <button
                onClick={() => {
                  logout();
                  handleNav("home");
                }}
                id="nav-logout-button-mobile-top"
                className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-950/60 transition-colors"
                title={language === "ar" ? "تسجيل الخروج" : "Log out"}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}

            <AudioToggleWidget language={language} />

            <button
              onClick={toggleLanguage}
              id="lang-toggle-button-mobile-top"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              {language === "ar" ? "EN 🌐" : "عربي 🌐"}
            </button>

            <button
              onClick={() => handleNav("speedtest")}
              id="nav-cta-mobile-top"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md active:scale-95 transition-all"
            >
              {t.ctaStartTest}
            </button>
          </div>

        </div>
      </div>

      {/* Sleek inline scrollable navigation bar on mobile (Shows all sections in the bar!) */}
      <div className="lg:hidden border-t border-blue-950/40 bg-slate-950/90 py-2" id="nav-mobile-scrollable-bar">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="no-scrollbar overflow-x-auto flex items-center space-x-2 rtl:space-x-reverse px-4">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                id={`nav-item-mobile-${item.id}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "text-blue-400 bg-blue-950/60 border border-blue-800/45 shadow-[0_0_10px_rgba(30,58,138,0.3)]"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {item.label}
              </button>
            );
          })}


        </div>
      </div>
    </nav>
  );
}
