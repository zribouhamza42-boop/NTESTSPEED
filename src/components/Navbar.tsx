import React, { useState } from "react";
import { PageId, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { Activity, Globe, Menu, X, Shield, LogOut, Sparkles } from "lucide-react";
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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/80 border-b border-slate-900 shadow-2xl" id="app-navbar">
      
      {/* Laser line gradient accent under navbar */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-2 border border-[#00F0FF]/10 bg-[#070b19]/60 backdrop-blur-md rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.5)] border-b-2 border-b-[#00F0FF]/20" id="nav-inner-container">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand/Logo Redesign */}
          <div 
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
            onClick={() => handleNav("home")}
            id="nav-logo"
          >
            <div className="bg-gradient-to-br from-[#00F0FF] to-[#7B61FF] p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:scale-105 transition-all duration-300">
              <Activity className="w-5.5 h-5.5 text-black" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 hover:text-[#00F0FF]">
                {language === "ar" ? t.brandTitle : t.brandName}
                <Sparkles className="w-4.5 h-4.5 text-[#00FFA3] animate-pulse" />
              </span>
              <p className="text-[9px] text-slate-450 font-mono tracking-widest uppercase opacity-80">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse border border-[#00F0FF]/25 border-b-2 border-b-[#00F0FF]/70 bg-[#030712]/65 px-3.5 py-1.5 rounded-2xl shadow-[0_4px_20px_rgba(0,240,255,0.08)] backdrop-blur-lg" id="nav-desktop-links">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === "speedtest" && currentPage === "analysis");
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  id={`nav-item-${item.id}`}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-[#00F0FF] bg-slate-900 border border-slate-800 shadow-[0_0_15px_rgba(0,240,255,0.06)] scale-[1.02]"
                      : "text-slate-300 hover:text-white hover:bg-[#0b1020]/40"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* CTA & Language buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3.5 rtl:space-x-reverse" id="nav-desktop-actions">
            
            {/* Admin Panel button if authenticated */}
            {token && user && isAdmin && (
              <button
                onClick={() => handleNav("admin")}
                id="nav-admin-panel-desktop"
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-400 text-xs font-black uppercase tracking-widest hover:bg-amber-950/40 transition-all duration-200"
              >
                <Shield className="w-4 h-4 text-amber-550" />
                <span>{language === "ar" ? "لوحة التحكم" : "Admin Dashboard"}</span>
              </button>
            )}

            {/* Profile greeting + Log out button */}
            {token && user ? (
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse border border-slate-900 bg-[#030712]/50 rounded-xl p-1 px-3" id="nav-user-indicator">
                <span className="text-[10px] text-slate-400 max-w-[130px] truncate select-none font-mono">
                  {language === "ar" ? "أهلاً، " : "Hi, "}
                  <strong className="text-[#00F0FF] font-black">{displayName}</strong>
                </span>
                
                <button
                  onClick={() => {
                    logout();
                    handleNav("home");
                  }}
                  id="nav-logout-button-desktop"
                  className="p-1 px-2.5 rounded-lg bg-rose-950/15 hover:bg-rose-950/30 text-rose-400 border border-rose-900/20 hover:border-rose-900/50 transition-colors flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                  title={language === "ar" ? "تسجيل الخروج" : "Log out"}
                >
                  <LogOut className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{language === "ar" ? "خروج" : "Exit"}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav("login")}
                id="nav-login-button-desktop"
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent transition-all duration-200 cursor-pointer"
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
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#00F0FF]" />
              <span>{t.langToggle}</span>
            </button>

            {/* Custom CTA */}
            <button
              onClick={() => handleNav("speedtest")}
              id="nav-cta-desktop"
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#00F0FF] to-[#7B61FF] text-black shadow-lg shadow-[#00F0FF]/15 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border border-[#00F0FF]/60"
            >
              {t.ctaStartTest}
            </button>
          </div>

          {/* Controls (Mobile Navigation top panel) */}
          <div className="flex lg:hidden items-center space-x-2.5 rtl:space-x-reverse" id="nav-mobile-hamburger">
            {token && user && (
              <button
                onClick={() => {
                  logout();
                  handleNav("home");
                }}
                id="nav-logout-button-mobile-top"
                className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-950/40 transition-colors"
                title={language === "ar" ? "تسجيل الخروج" : "Log out"}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}

            <AudioToggleWidget language={language} />

            <button
              onClick={toggleLanguage}
              id="lang-toggle-button-mobile-top"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-350 text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              {language === "ar" ? "EN 🌐" : "عربي 🌐"}
            </button>

            <button
              onClick={() => handleNav("speedtest")}
              id="nav-cta-mobile-top"
              className="px-3,5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/10 active:scale-95 transition-all"
            >
              {t.ctaStartTest}
            </button>
          </div>

        </div>
      </div>

      {/* Sleek inline scrollable navigation bar on mobile (Shows all sections in the bar!) */}
      <div className="lg:hidden border-t border-slate-900 bg-[#0B1020]/95 py-2.5" id="nav-mobile-scrollable-bar">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="no-scrollbar overflow-x-auto flex items-center space-x-2.5 rtl:space-x-reverse px-4">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                id={`nav-item-mobile-${item.id}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? "text-[#00F0FF] bg-slate-900 border border-slate-800 shadow-[0_0_10px_rgba(0,240,255,0.06)]"
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
