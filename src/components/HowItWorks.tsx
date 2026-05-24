import React from "react";
import { PageId, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { HelpCircle, Activity, HeartPulse, Shield, Server, ArrowRight, ArrowLeft } from "lucide-react";

interface HowItWorksProps {
  language: Language;
  setCurrentPage: (page: PageId) => void;
}

export default function HowItWorks({ language, setCurrentPage }: HowItWorksProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const steps = [
    {
      title: t.hiwStep1,
      desc: t.hiwStep1Desc,
      icon: <Activity className="w-8 h-8 text-blue-400" />,
    },
    {
      title: t.hiwStep2,
      desc: t.hiwStep2Desc,
      icon: <HeartPulse className="w-8 h-8 text-indigo-400" />,
    },
    {
      title: t.hiwStep3,
      desc: t.hiwStep3Desc,
      icon: <HelpCircle className="w-8 h-8 text-teal-400" />,
    },
    {
      title: t.hiwStep4,
      desc: t.hiwStep4Desc,
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" id="how-it-works-view-container">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-white" id="howitworks-title">
          {t.hiwTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          {t.hiwSubtitle}
        </p>
      </div>

      {/* Grid Steps list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" id="howitworks-steps-grid">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex items-start space-x-4 rtl:space-x-reverse hover:border-blue-900/30 transition-all duration-200"
            id={`step-card-${idx}`}
          >
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 shrink-0">
              {step.icon}
            </div>

            <div>
              <h3 className="text-lg font-black text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Banner block */}
      <div 
        className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-950/40 border border-blue-900/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
        id="howitworks-cta-cover"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 relative z-10">
          {isAr ? "جاهز لتشخيص اتصالك بالكامل؟" : "Ready for a complete network check?"}
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-8 relative z-10">
          {isAr 
            ? "شغّل مقياس السرعة التفاعلي الآن وخلال دقيقة واحدة ستحصل على تشخيصات ومسارات إصلاح مدعومة كلياً بالذكاء الاصطناعي." 
            : "Run our quick diagnostic interactive speed gauge right now and obtain expert custom-made reports in less than a minute."
          }
        </p>

        <button
          onClick={() => {
            setCurrentPage('speedtest');
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          id="howitworks-start-test-cta"
          className="px-8 py-4 rounded-xl text-base font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-900/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center space-x-2 rtl:space-x-reverse"
        >
          <span>{t.ctaStartTest}</span>
          {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
}
