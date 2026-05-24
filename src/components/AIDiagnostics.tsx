import React, { useState, useEffect } from "react";
import { PageId, Language, SpeedResults, AnalysisResponse } from "../types";
import { TRANSLATIONS } from "../data";
import { Activity, ShieldAlert, CheckSquare, Wrench, Shield, ArrowRight, ExternalLink, RefreshCw, Copy, Check } from "lucide-react";

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
        throw new Error(isAr ? "حدث خطأ أثناء الاتصال بخوادم التشخيص." : "Server error responding to diagnostics request.");
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
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleApplyVpnType = (category: 'gaming' | 'streaming' | 'privacy') => {
    if (category === 'streaming') {
      setVpnFilter('speed');
    } else {
      setVpnFilter(category);
    }
    setCurrentPage('vpn');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If no speed test results are recorded yet
  if (!speedResults) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center" id="no-results-warning">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-black text-white mb-2">
            {isAr ? "لم نجد نتائج فحص سابقة!" : "No Speed Test Results Keyed!"}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            {isAr 
              ? "يتعين عليك تشغيل عداد فحص السرعة التفاعلي أولاً ليتمكن طبيب الإنترنت من تشخيص أبعاد التباطؤ ومطابقتها بأفضل الخوادم." 
              : "You must run the speed test gauge first in order to provide the database parameters for our Smart Doctor algorithm to diagnose."
            }
          </p>
          <button
            onClick={() => setCurrentPage("speedtest")}
            id="to-speedtest-cta"
            className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-550 text-white shadow-lg shadow-blue-900/40"
          >
            {t.ctaStartTest}
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen with charming narrative phrases
  if (loading) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center" id="diagnostics-loading">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-850"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500 animate-spin"></div>
            <Activity className="w-8 h-8 text-blue-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {isAr ? "يجري إعداد التشخيص الطبي للشبكة..." : "Smart Doctor analyzing connection..."}
            </h3>
            <p className="text-[11px] font-mono text-blue-400 mt-2 tracking-widest uppercase">
              {isAr ? "تحليل قيم البينج والتذبذب والسرعة" : "Analyzing Ping, Jitter & Speeds"}
            </p>
          </div>
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-left rtl:text-right">
            <div className="space-y-2 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-blue-500">▶</span>
                <span>{isAr ? "جاري الاتصال بوحدة الاستخلاص من Gemini..." : "Requesting diagnostic metrics evaluation from Gemini..."}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-emerald-500">✔</span>
                <span>{isAr ? "تم قراءة: تحميل " : "Fetched: Download "}{speedResults.download} Mbps / {isAr ? "رفع " : "Upload "}{speedResults.upload} Mbps</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-indigo-500">⚡</span>
                <span>{isAr ? "حساب التذبذب المفرط والمسار المناسب..." : "Isolating router latency & tracking filters..."}</span>
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
      <div className="max-w-md mx-auto py-12 px-4 text-center" id="diagnostics-error">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {isAr ? "فشل جلب التوصيات" : "Failed to Fetch Recommendation"}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={fetchAnalysis}
            id="retry-diagnostics-btn"
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-705 text-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isAr ? "إعادة المحاولة" : "Try Again"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Render final Report beautifully
  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="diagnostics-report-container">
      
      {/* Grade & Score Card */}
      <div 
        className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        id="report-grade-cover"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex items-center space-x-6 rtl:space-x-reverse" id="report-grade-info-block">
          {/* Big Grade Emblem */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-900/40 flex items-center justify-center shrink-0">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-widest font-mono">
              {report.network_grade}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-1">
              {report.aiGenerated ? t.unlockedByAi : t.localRuleDisclaimer}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {t.networkGrade}
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono bg-slate-950/70 border border-slate-800/60 rounded-lg px-2.5 py-1.5">
              <span>DL: <strong>{speedResults.download}</strong> Mbps</span>
              <span className="text-slate-700">|</span>
              <span>UL: <strong>{speedResults.upload}</strong> Mbps</span>
              <span className="text-slate-700">|</span>
              <span>Ping: <strong>{speedResults.ping}</strong> ms</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setCurrentPage('speedtest')}
          className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-730 rounded-lg transition-all"
        >
          {isAr ? "إعادة الفحص" : "Re-test Connection"}
        </button>
      </div>

      {/* Main Narrative Diagnosis Block */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 sm:p-8 mb-8" id="diagnostics-narrative-panel">
        <h3 className="text-base sm:text-lg font-black text-white mb-3.5 flex items-center space-x-2 rtl:space-x-reverse">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>{t.diagnosisTitle}</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {isAr ? report.diagnosis_ar : report.diagnosis_en}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" id="diagnostics-two-column-split">
        
        {/* Detected Problems column */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col justify-between" id="diagnostics-problems-box">
          <div>
            <h3 className="text-base font-black text-white mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>{t.problemsTitle}</span>
            </h3>

            <div className="space-y-3.5">
              {(isAr ? report.problems_detected_ar : report.problems_detected_en).map((prob, i) => (
                <div key={i} className="flex items-start space-x-3 rtl:space-x-reverse text-xs leading-relaxed text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shrink-0 mt-1"></span>
                  <span>{prob}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-950 text-[11px] text-slate-400 font-mono">
            ⚠️ Diagnostic telemetry reflects transient network measurements.
          </div>
        </div>

        {/* Technical Recommended Fixes DNS / Router Panel */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6" id="diagnostics-fixes-box">
          <h3 className="text-base font-black text-white mb-4 flex items-center space-x-2 rtl:space-x-reverse">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>{t.fixesTitle}</span>
          </h3>

          <div className="space-y-4">
            {report.suggested_fixes.map((fix, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">
                    {isAr ? fix.title_ar : fix.title_en}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {isAr ? fix.description_ar : fix.description_en}
                  </p>
                </div>

                {/* Copy box */}
                <button
                  onClick={() => handleCopy(fix.command_or_value, idx)}
                  id={`copy-fix-btn-${idx}`}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded px-2.5 py-1.5 text-[10px] text-blue-400 font-mono flex items-center space-x-1.5 rtl:space-x-reverse transition-all shrink-0 w-full sm:w-auto justify-center"
                  title={t.commandCopyTip}
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{fix.command_or_value}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Target recommended VPN block */}
      <div 
        className="bg-slate-900/60 border border-blue-900/30 rounded-2xl p-6 sm:p-8"
        id="recommended-vpn-action-cover"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-blue-950 rounded-xl border border-blue-900 text-blue-400 shrink-0">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
                {t.suggestedVpnCat}
              </span>
              <h3 className="text-lg font-black text-white mt-1 capitalize">
                {isAr ? `توصية: حزمة الـ VPN المخصصة للـ ${report.vpn_type_recommended}` : `Matched Recommendation: Best ${report.vpn_type_recommended} client`}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
                {isAr ? report.vpn_explanation_ar : report.vpn_explanation_en}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleApplyVpnType(report.vpn_type_recommended)}
            id="apply-recommended-vpn-filter-btn"
            className="px-6 py-3.5 w-full sm:w-auto rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 text-center shadow-lg shadow-blue-900/30 shrink-0"
          >
            {t.vpnBtn}
          </button>
        </div>
      </div>

    </div>
  );
}
