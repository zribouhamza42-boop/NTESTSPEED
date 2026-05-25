import React, { useState, useEffect } from "react";
import { PageId, Language, SpeedResults, AnalysisResponse } from "../types";
import { TRANSLATIONS } from "../data";
import { 
  Activity, 
  ShieldAlert, 
  CheckSquare, 
  Wrench, 
  Shield, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles,
  Cpu,
  Trophy,
  AlertOctagon,
  Network
} from "lucide-react";
import { motion } from "motion/react";
import { FutureSoundEngine } from "./FutureAmbiance";

interface AIDiagnosticsProps {
  language: Language;
  speedResults: SpeedResults | null;
  setCurrentPage: (page: PageId) => void;
  setVpnFilter: (filter: 'all' | 'gaming' | 'speed' | 'privacy') => void;
}

export default function AIDiagnostics({
  language,
  speedResults,
  setCurrentPage,
  setVpnFilter
}: AIDiagnosticsProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (speedResults) {
      fetchAnalysis();
    }
  }, [speedResults]);

  const fetchAnalysis = async () => {
    if (!speedResults) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          download: speedResults.download,
          upload: speedResults.upload,
          ping: speedResults.ping,
          jitter: speedResults.jitter
        })
      });

      if (!response.ok) {
        throw new Error(isAr ? "حدث خطأ أثناء الاتصال بخوادم التشخيص السحابية." : "Server error responding to diagnostics request.");
      }

      const data: AnalysisResponse = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || (isAr ? "فشل التحليل الذكي للاتصال." : "Failed to retrieve connection diagnostic report."));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(index);
    FutureSoundEngine.playSuccess();
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleApplyVpnType = (category: 'gaming' | 'streaming' | 'privacy') => {
    if (category === 'streaming') {
      setVpnFilter('speed');
    } else {
      setVpnFilter(category);
    }
    FutureSoundEngine.playTick();
    setCurrentPage('vpn');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If no speed test results are recorded yet
  if (!speedResults) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-right sm:text-left rtl:sm:text-right" id="no-results-warning">
        <div className="bg-[#0b1020]/80 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-rose-500 to-[#7B61FF]"></div>
          <AlertOctagon className="w-16 h-16 text-rose-500 mx-auto mb-6 animate-pulse" />
          
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {isAr ? "أرقام الفحص مفقودة!" : "No Speed Test Telemetry Recorded!"}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            {isAr 
              ? "يتعين عليك المرور بعداد فحص السرعة التفاعلي أولاً ليتمكن طبيب الإنترنت الذكي من تشخيص مواطن الضغط ومطابقتها بأفضل بروتوكولات الخوادم." 
              : "You must run our core speed test dial to generate packet data before the Smart Doctor algorithm can process connection abnormalities."
            }
          </p>
          <button
            onClick={() => setCurrentPage("speedtest")}
            id="to-speedtest-cta"
            className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#00F0FF] to-[#7B61FF] text-black shadow-lg shadow-[#00F0FF]/15 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            {t.ctaStartTest}
          </button>
        </div>
      </div>
    );
  }

  // Cinematic Premium Loading Overlay
  if (loading) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-right sm:text-left rtl:sm:text-right" id="diagnostics-loading">
        <div className="bg-[#0b1020]/80 border border-[#00F0FF]/30 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden text-center glow-cyan">
          
          {/* Animated scan overlay */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_15px_#00F0FF] animate-pulse"></div>
          
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-[6px] border-slate-900"></div>
            <div className="absolute inset-0 rounded-full border-[6px] border-t-[#00F0FF] border-r-[#7B61FF] animate-spin"></div>
            <Activity className="w-10 h-10 text-[#00F0FF] absolute inset-0 m-auto animate-pulse" />
          </div>

          <div>
            <h3 className="text-xl font-black text-white">
              {isAr ? "يجري تحضير بروتوكول التشخيص وتوليد الحلول..." : "Cognitive AI diagnosing connection..."}
            </h3>
            <p className="text-[11px] font-mono text-[#00FFA3] mt-2.5 tracking-widest uppercase font-black animate-pulse">
              {isAr ? "استخلاص مخرجات البينج والتحميل والرفع عبر الذكاء الاصطناعي" : "Analyzing Packet Jitter & Throughput with AI"}
            </p>
          </div>

          {/* Core Telemetry Logs simulation */}
          <div className="bg-[#030712]/60 rounded-2xl p-4.5 border border-slate-900 select-text text-left">
            <div className="space-y-3.5 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <span className="text-[#00F0FF]">▶</span>
                <span>{isAr ? "جاري الاستخلاص من محرك الاستدلال لـ Gemini..." : "Contacting backend cognitive model endpoint..."}</span>
              </div>
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <span className="text-[#00FFA3]">✓</span>
                <span>{isAr ? "قراءات الفحص المستلمة: تحميل " : "Fetched parameters: DL "}{speedResults.download} Mbps / {isAr ? "رفع " : "UL "}{speedResults.upload} Mbps</span>
              </div>
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <span className="text-[#7B61FF]">⚡</span>
                <span>{isAr ? "تحديد مستويات تدرج البنج المتكررة..." : "Tracking route bottlenecks and physical limits..."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center" id="diagnostics-error">
        <div className="bg-[#0b1020]/80 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-rose-500"></div>
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-3">
            {isAr ? "فشل جلب التشخيص الذكي" : "Diagnostic Retrieval Failed"}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            {error}
          </p>
          <button
            onClick={fetchAnalysis}
            id="retry-diagnostics-btn"
            className="w-full flex items-center justify-center space-x-3 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-900 border border-slate-800 hover:border-slate-700 text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-4.5 h-4.5 text-cyan-400" />
            <span>{isAr ? "إعادة محاولة الاتصال" : "RE-TRY COGNITIVE ROUTE"}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-right sm:text-left rtl:sm:text-right" id="diagnostics-report-container">
      
      {/* Grade & Score Card Redesign */}
      <div 
        className="bg-[#0b1020]/80 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 glow-cyan"
        id="report-grade-cover"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center gap-6" id="report-grade-info-block">
          {/* Big Grade Emblem */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#00F0FF] via-[#7B61FF] to-[#00FFA3] shadow-xl flex items-center justify-center shrink-0">
            <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-mono">
              {report.network_grade}
            </span>
          </div>

          <div className="text-center sm:text-left rtl:sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-black block mb-2 flex items-center gap-1.5 justify-center sm:justify-start">
              <Sparkles className="w-3.5 h-3.5 text-[#00FFA3]" />
              {report.aiGenerated ? t.unlockedByAi : t.localRuleDisclaimer}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {t.networkGrade}
            </h2>
            
            {/* Quick Metrics stats grid inside grade badge */}
            <div className="mt-3.5 flex flex-wrap justify-center sm:justify-start gap-3.5 text-xs text-slate-400 font-mono bg-[#030712]/60 border border-slate-900 rounded-xl px-4 py-2.5">
              <span>DL: <strong className="text-white">{speedResults.download}</strong> Mbps</span>
              <span className="text-slate-800">|</span>
              <span>UL: <strong className="text-white">{speedResults.upload}</strong> Mbps</span>
              <span className="text-slate-800">|</span>
              <span>Ping: <strong className="text-white">{speedResults.ping}</strong> ms</span>
              <span className="text-slate-800">|</span>
              <span>Jitter: <strong className="text-white">{speedResults.jitter}</strong> ms</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setCurrentPage('speedtest')}
          className="px-6 py-3.5 text-xs font-black uppercase tracking-widest text-[#00F0FF] hover:text-[#00FFA3] bg-slate-900 border border-slate-800 hover:border-[#00F0FF] rounded-xl transition-all cursor-pointer shadow-inner"
        >
          {isAr ? "إعادة الفحص" : "Re-test Connection"}
        </button>
      </div>

      {/* Main Narrative Diagnosis Block */}
      <div className="bg-[#0b1020]/60 border border-slate-900 rounded-3xl p-8 mb-8 relative overflow-hidden" id="diagnostics-narrative-panel">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00F0FF] to-[#7B61FF]"></div>
        <h3 className="text-lg font-black text-white mb-4 flex items-center space-x-2.5 rtl:space-x-reverse">
          <Activity className="w-5.3 h-5.3 text-[#00F0FF]" />
          <span>{t.diagnosisTitle}</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {isAr ? report.diagnosis_ar : report.diagnosis_en}
        </p>
      </div>

      {/* Two-Column split details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" id="diagnostics-two-column-split">
        
        {/* Column 1: Detected Bottlenecks with premium red indicators */}
        <div className="bg-[#0b1020]/50 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between" id="diagnostics-problems-box">
          <div>
            <h3 className="text-lg font-black text-white mb-5 flex items-center space-x-2.5 rtl:space-x-reverse">
              <ShieldAlert className="w-5.3 h-5.3 text-rose-500 animate-pulse" />
              <span>{t.problemsTitle}</span>
            </h3>

            <div className="space-y-4">
              {(isAr ? report.problems_detected_ar : report.problems_detected_en).map((prob, i) => (
                <div key={i} className="flex items-start space-x-3 rtl:space-x-reverse text-xs leading-relaxed text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] shrink-0 mt-1"></span>
                  <span>{prob}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-950 text-[10px] text-slate-500 font-mono">
            ⚠️ AI TELEMETRY DISPATCH: transient network state calculated successfully.
          </div>
        </div>

        {/* Column 2: Specific Technical recommendation & command copy slots */}
        <div className="bg-[#0b1020]/50 border border-slate-900 rounded-3xl p-6 sm:p-8" id="diagnostics-fixes-box">
          <h3 className="text-lg font-black text-white mb-5 flex items-center space-x-2.5 rtl:space-x-reverse">
            <Wrench className="w-5.3 h-5.3 text-[#00FFA3]" />
            <span>{t.fixesTitle}</span>
          </h3>

          <div className="space-y-4">
            {report.suggested_fixes.map((fix, idx) => (
              <div 
                key={idx}
                className="bg-[#030712]/55 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#00FFA3]/40 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-black text-white mb-1">
                    {isAr ? fix.title_ar : fix.title_en}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {isAr ? fix.description_ar : fix.description_en}
                  </p>
                </div>

                {/* Cyber copy block */}
                <button
                  onClick={() => handleCopy(fix.command_or_value, idx)}
                  id={`copy-fix-btn-${idx}`}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 text-[10px] text-[#00F0FF] font-mono flex items-center space-x-2.5 rtl:space-x-reverse transition-all shrink-0 w-full sm:w-auto justify-center cursor-pointer shadow-inner"
                  title={t.commandCopyTip}
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-[#00FFA3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{fix.command_or_value}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended Custom VPN Gateway match block */}
      <div 
        className="bg-[#0b1020]/80 border border-[#00F0FF]/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        id="recommended-vpn-action-cover"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B61FF]/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4.5 rtl:space-x-reverse">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-[#00F0FF] shrink-0">
              <Shield className="w-7 h-7 animate-pulse text-[#00F0FF]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#7B61FF] uppercase tracking-widest font-black block mb-1">
                {t.suggestedVpnCat}
              </span>
              <h3 className="text-xl font-black text-white capitalize leading-tight">
                {isAr ? `توصية الشريك: باقة الـ VPN المخصصة للـ ${report.vpn_type_recommended}` : `Matched Recommendation: Best ${report.vpn_type_recommended} Gateway`}
              </h3>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed max-w-2xl font-sans">
                {isAr ? report.vpn_explanation_ar : report.vpn_explanation_en}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleApplyVpnType(report.vpn_type_recommended)}
            id="apply-recommended-vpn-filter-btn"
            className="px-8 py-4 w-full lg:w-auto rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#00F0FF] to-[#7B61FF] text-black shadow-lg shadow-[#00F0FF]/20 hover:brightness-110 shrink-0 transition-transform hover:scale-[1.03]"
          >
            {t.vpnBtn}
          </button>
        </div>
      </div>

    </div>
  );
}
