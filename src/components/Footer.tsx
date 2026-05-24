import React from "react";
import { PageId, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { Activity } from "lucide-react";

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
    <footer className="bg-slate-950 border-t border-blue-900/40 py-12 mt-20" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core footer elements */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-slate-900/80">
          
          {/* Logo & Desc */}
          <div className="max-w-md" id="footer-brand-summary">
            <div 
              className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer mb-4"
              onClick={() => handleNav("home")}
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-black text-white bg-gradient-to-r from-blue-400 to-white bg-clip-text">
                {language === "ar" ? t.brandTitle : t.brandName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          {/* Quick Nav Links Row */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 font-medium text-xs text-slate-400" id="footer-quick-links">
            <button 
              onClick={() => handleNav("home")}
              id="footer-nav-home"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleNav("speedtest")}
              id="footer-nav-speedtest"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navSpeedTest}
            </button>
            <button 
              onClick={() => handleNav("vpn")}
              id="footer-nav-vpn"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navVpnOffers}
            </button>
            <button 
              onClick={() => handleNav("rdp")}
              id="footer-nav-rdp"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navRdpOffers}
            </button>
            <button 
              onClick={() => handleNav("how-it-works")}
              id="footer-nav-hiw"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button 
              onClick={() => handleNav("faq")}
              id="footer-nav-faq"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navFaq}
            </button>
            <button 
              onClick={() => handleNav("blog")}
              id="footer-nav-blog"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navBlog}
            </button>
          </div>

        </div>

        {/* Copywrite */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500" id="footer-bottom-copyright">
          <span>{t.footerRights}</span>
          <span className="font-mono uppercase tracking-wider">Smart Internet Doctor</span>
        </div>

      </div>
    </footer>
  );
}
