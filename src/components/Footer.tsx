import React from "react";
import { PageId, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { Activity, Sparkles } from "lucide-react";

interface FooterProps {
  language: Language;
  setCurrentPage: (page: PageId) => void;
}

export default function Footer({ language, setCurrentPage }: FooterProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const handleNav = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B1020] border-t border-slate-900 py-16 mt-24 relative overflow-hidden" id="app-footer">
      
      {/* Decorative top pulse stripe */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#7B61FF]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core footer elements */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-10 pb-10 border-b border-slate-900">
          
          {/* Logo & Desc */}
          <div className="max-w-md text-right sm:text-left rtl:sm:text-right" id="footer-brand-summary">
            <div 
              className="flex items-center justify-start sm:justify-start rtl:sm:justify-start gap-3 cursor-pointer mb-5 group"
              onClick={() => handleNav("home")}
            >
              <div className="bg-gradient-to-br from-[#00F0FF] to-[#7B61FF] p-2.5 rounded-xl group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-black text-white flex items-center gap-1.5 hover:text-[#00F0FF]">
                {language === "ar" ? t.brandTitle : t.brandName}
              </span>
            </div>
            <p className="text-xs text-slate-405 leading-relaxed font-sans">
              {language === "ar" 
                ? "طبيب الإنترنت الذكي هو نظام تلمس سحابي متكامل يهدف لمراقبة سلامة الشبكات ورصد الأعطال فوراً وتأمين أفضل الصفقات لتعزيز السرعة مع الـ VPN والـ RDP."
                : "Smart Internet Doctor provides extreme, low-latency telemetry tools for measuring active throughput, tracking routes breakdown, and providing pristine recommendations with certified VPN partners."
              }
            </p>
          </div>

          {/* Quick Nav Links Row */}
          <div className="flex flex-wrap gap-x-6 gap-y-4 font-bold text-xs uppercase tracking-wider text-slate-400" id="footer-quick-links">
            <button 
              onClick={() => handleNav("home")}
              id="footer-nav-home"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleNav("speedtest")}
              id="footer-nav-speedtest"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navSpeedTest}
            </button>
            <button 
              onClick={() => handleNav("vpn")}
              id="footer-nav-vpn"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navVpnOffers}
            </button>
            <button 
              onClick={() => handleNav("rdp")}
              id="footer-nav-rdp"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navRdpOffers}
            </button>
            <button 
              onClick={() => handleNav("how-it-works")}
              id="footer-nav-hiw"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button 
              onClick={() => handleNav("faq")}
              id="footer-nav-faq"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navFaq}
            </button>
            <button 
              onClick={() => handleNav("blog")}
              id="footer-nav-blog"
              className="hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {t.navBlog}
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono text-center" id="footer-bottom-copyright">
          <span>{language === "ar" ? "© ٢٠٢٦ طبيب الإنترنت الذكي. جميع الحقوق محفوظة." : "© 2026 Smart Internet Doctor. All certified rights reserved."}</span>
          <span className="uppercase tracking-widest text-[#00FFA3] flex items-center gap-1.5 font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            SECURE INTEGRITY CONTROL
          </span>
        </div>

      </div>
    </footer>
  );
}
