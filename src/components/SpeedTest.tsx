import React, { useState, useEffect, useRef } from "react";
import { PageId, Language, SpeedResults } from "../types";
import { TRANSLATIONS } from "../data";
import { Gauge, Play, CheckCircle2, AlertTriangle, ChevronRight, Activity, RotateCcw } from "lucide-react";
import SpeedChart, { ChartDataPoint } from "./SpeedChart";

interface SpeedTestProps {
  language: Language;
  onTestComplete: (results: SpeedResults) => void;
  setCurrentPage: (page: PageId) => void;
}

type SimulationProfile = 'stable' | 'slow' | 'gaming' | 'random';

export default function SpeedTest({ language, onTestComplete, setCurrentPage }: SpeedTestProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const [profile, setProfile] = useState<SimulationProfile>('random');
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'completed'>('idle');

  // Throughput history
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Live Counter States
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);

  // Animation Progress (radial bar helper)
  const [gaugeProgress, setGaugeProgress] = useState(0);

  // Timer reference
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStage('ping');
    setGaugeProgress(10);

    // Initial values
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);
    setChartData([]); // Reset chart data for a fresh run

    // Step 1: Run Ping & Jitter evaluation for 3 seconds
    setTimeout(() => {
      let finalPing = 0;
      let finalJitter = 0;

      switch (profile) {
        case 'stable':
          finalPing = Math.floor(Math.random() * 11) + 12; // 12-23 ms
          finalJitter = Math.floor(Math.random() * 3) + 2;   // 2-5 ms
          break;
        case 'slow':
          finalPing = Math.floor(Math.random() * 30) + 75; // 75-105 ms
          finalJitter = Math.floor(Math.random() * 10) + 12; // 12-22 ms
          break;
        case 'gaming':
          finalPing = Math.floor(Math.random() * 120) + 140; // 140-260 ms
          finalJitter = Math.floor(Math.random() * 35) + 30; // 30-65 ms
          break;
        case 'random':
        default:
          finalPing = Math.floor(Math.random() * 90) + 15; // 15-105 ms
          finalJitter = Math.floor(Math.random() * 18) + 3;  // 3-21 ms
          break;
      }

      setPing(finalPing);
      setJitter(finalJitter);
      setStage('download');
      setGaugeProgress(40);

      // Step 2: Run Download simulation with rolling numbers for 4 seconds
      let downloadCounter = 0.1;
      let iterations = 0;
      const targetDownload = profile === 'stable' ? (Math.random() * 140 + 280) // 280-420 Mbps
                            : profile === 'slow' ? (Math.random() * 6 + 4.2)   // 4.2-10.2 Mbps
                            : profile === 'gaming' ? (Math.random() * 30 + 35)  // 35-65 Mbps
                            : (Math.random() * 180 + 15);                      // 15-195 Mbps

      const downloadInterval = setInterval(() => {
        iterations++;
        // Simulate real gauge noise
        const step = targetDownload / 20;
        downloadCounter = Math.min(targetDownload, downloadCounter + step + (Math.random() * step - step/2));
        const currentDl = parseFloat(downloadCounter.toFixed(1));
        setDownload(currentDl);
        setGaugeProgress(40 + Math.floor((iterations / 20) * 30));

        // Record real-time download data point
        const elapsed = parseFloat((iterations * 0.15).toFixed(2));
        setChartData(prev => [...prev, { elapsed, value: currentDl, type: 'download' }]);

        if (iterations >= 20) {
          clearInterval(downloadInterval);
          const finalDl = parseFloat(targetDownload.toFixed(1));
          setDownload(finalDl);

          // Force definitive end point for download
          setChartData(prev => [
            ...prev.filter(p => p.elapsed < 3.0),
            { elapsed: 3.0, value: finalDl, type: 'download' }
          ]);

          setStage('upload');
          setGaugeProgress(70);

          // Step 3: Run Upload simulation for 4 seconds
          let uploadCounter = 0.1;
          let uploadIterations = 0;
          const targetUpload = profile === 'stable' ? (Math.random() * 60 + 90)   // 90-150 Mbps
                              : profile === 'slow' ? (Math.random() * 2 + 1.1)    // 1.1-3.1 Mbps
                              : profile === 'gaming' ? (Math.random() * 8 + 12)    // 12-20 Mbps
                              : (Math.random() * 55 + 5);                         // 5-60 Mbps

          const uploadInterval = setInterval(() => {
            uploadIterations++;
            const step = targetUpload / 20;
            uploadCounter = Math.min(targetUpload, uploadCounter + step + (Math.random() * step - step/2));
            const currentUl = parseFloat(uploadCounter.toFixed(1));
            setUpload(currentUl);
            setGaugeProgress(70 + Math.floor((uploadIterations / 20) * 30));

            // Record real-time upload data point
            const elapsed = parseFloat((3.0 + uploadIterations * 0.15).toFixed(2));
            setChartData(prev => [...prev, { elapsed, value: currentUl, type: 'upload' }]);

            if (uploadIterations >= 20) {
              clearInterval(uploadInterval);
              const finalUl = parseFloat(targetUpload.toFixed(1));
              setUpload(finalUl);

              // Force definitive end point for upload
              setChartData(prev => [
                ...prev.filter(p => p.elapsed < 6.0),
                { elapsed: 6.0, value: finalUl, type: 'upload' }
              ]);

              setStage('completed');
              setIsRunning(false);
              setGaugeProgress(100);

              // Callback
              onTestComplete({
                download: parseFloat(targetDownload.toFixed(1)),
                upload: parseFloat(targetUpload.toFixed(1)),
                ping: finalPing,
                jitter: finalJitter
              });
            }
          }, 150);
        }
      }, 150);

    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="speed-test-view-container">
      
      {/* Title & Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-blue-950/50 border border-blue-900 rounded-2xl mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <Gauge className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white" id="speedtest-page-header">
          {t.speedTestTitle}
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          {t.speedTestSubtitle}
        </p>
      </div>

      {/* Profile Selector (Interactive simulation scenarios) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 mb-8" id="profile-selector-panel">
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left rtl:sm:text-right">
          {t.profileSelectLabel}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => !isRunning && setProfile('random')}
            disabled={isRunning}
            id="profile-btn-random"
            className={`px-4 py-3 rounded-lg text-xs font-bold border transition-all ${
              profile === 'random'
                ? "bg-blue-950/60 text-blue-400 border-blue-900 shadow-lg shadow-blue-950/40"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            🕹️ {t.profileRandom}
          </button>
          <button
            onClick={() => !isRunning && setProfile('stable')}
            disabled={isRunning}
            id="profile-btn-stable"
            className={`px-4 py-3 rounded-lg text-xs font-bold border transition-all ${
              profile === 'stable'
                ? "bg-blue-950/60 text-blue-400 border-blue-900 shadow-lg shadow-blue-950/40"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            ⚡ {t.profileNormal}
          </button>
          <button
            onClick={() => !isRunning && setProfile('slow')}
            disabled={isRunning}
            id="profile-btn-slow"
            className={`px-4 py-3 rounded-lg text-xs font-bold border transition-all ${
              profile === 'slow'
                ? "bg-blue-950/60 text-blue-400 border-blue-900 shadow-lg shadow-blue-950/40"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            🐌 {t.profileSlow}
          </button>
          <button
            onClick={() => !isRunning && setProfile('gaming')}
            disabled={isRunning}
            id="profile-btn-gaming"
            className={`px-4 py-3 rounded-lg text-xs font-bold border transition-all ${
              profile === 'gaming'
                ? "bg-blue-950/60 text-blue-400 border-blue-900 shadow-lg shadow-blue-950/40"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            🎮 {t.profileGamingBad}
          </button>
        </div>
      </div>

      {/* Main Speed Gauge Simulator Frame */}
      <div 
        className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 sm:p-12 mb-8 shadow-2xl relative overflow-hidden flex flex-col items-center"
        id="gauge-canvas-wrapper"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${gaugeProgress}%` }}
          ></div>
        </div>

        {/* Big Interactive Ring Dial */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8" id="radial-dial-container">
          
          {/* Circular Track Background */}
          <div className="absolute inset-0 rounded-full border-[10px] border-slate-800/60"></div>
          
          {/* Digital Status/Speed readout */}
          <div className="text-center z-10">
            <span className="text-[11px] font-mono tracking-widest text-blue-400 uppercase font-bold block mb-1">
              {stage === 'ping' && t.testingPing}
              {stage === 'download' && t.testingDownload}
              {stage === 'upload' && t.testingUpload}
              {stage === 'completed' && t.testCompleted}
              {stage === 'idle' && (isAr ? "جاهز مسبقاً" : "Ready to Analyze")}
            </span>
            
            <div className="my-1">
              <span className="text-5xl font-mono font-black text-white tracking-tight leading-none face-numeric">
                {stage === 'download' || stage === 'idle' ? download : stage === 'upload' ? upload : (ping || '0')}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-bold uppercase font-mono">
              {stage === 'download' || stage === 'upload' || stage === 'idle' ? 'Mbps' : 'ms'}
            </span>
          </div>

          {/* Pulse effect in the back */}
          {isRunning && (
            <div className="absolute inset-6 rounded-full border border-blue-500/10 animate-ping"></div>
          )}
        </div>

        {/* Live Metrics Grid Output */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full" id="live-results-grid">
          
          {/* Download */}
          <div className={`bg-slate-950/80 border rounded-xl p-4 text-center transition-all ${stage === 'download' ? 'border-blue-500 shadow-lg shadow-blue-950/60' : 'border-slate-800'}`}>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">{t.downloadLabel}</span>
            <div className="flex items-baseline justify-center space-x-1 rtl:space-x-reverse">
              <span className="text-2xl font-mono font-black text-white">{download}</span>
              <span className="text-xs text-slate-400 font-mono">Mbps</span>
            </div>
            {stage === 'download' && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mx-auto mt-2 animate-ping"></div>}
          </div>

          {/* Upload */}
          <div className={`bg-slate-950/80 border rounded-xl p-4 text-center transition-all ${stage === 'upload' ? 'border-indigo-500 shadow-lg shadow-indigo-950/60' : 'border-slate-800'}`}>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">{t.uploadLabel}</span>
            <div className="flex items-baseline justify-center space-x-1 rtl:space-x-reverse">
              <span className="text-2xl font-mono font-black text-white">{upload}</span>
              <span className="text-xs text-slate-400 font-mono">Mbps</span>
            </div>
            {stage === 'upload' && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mx-auto mt-2 animate-ping"></div>}
          </div>

          {/* Ping */}
          <div className={`bg-slate-950/80 border rounded-xl p-4 text-center transition-all ${stage === 'ping' ? 'border-emerald-500 shadow-lg shadow-emerald-950/60' : 'border-slate-800'}`}>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">{t.pingLabel}</span>
            <div className="flex items-baseline justify-center space-x-1 rtl:space-x-reverse">
              <span className="text-2xl font-mono font-black text-white">{ping}</span>
              <span className="text-xs text-slate-400 font-mono">ms</span>
            </div>
            {stage === 'ping' && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mx-auto mt-2 animate-ping"></div>}
          </div>

          {/* Jitter */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">{t.jitterLabel}</span>
            <div className="flex items-baseline justify-center space-x-1 rtl:space-x-reverse">
              <span className="text-2xl font-mono font-black text-white">{jitter}</span>
              <span className="text-xs text-slate-400 font-mono">ms</span>
            </div>
          </div>

        </div>

        {/* Real-time D3.js line chart for throughput fluctuations */}
        <div className="w-full mt-8 border-t border-slate-800/60 pt-6" id="speed-test-d3-chart-wrapper">
          <SpeedChart data={chartData} activeStage={stage} language={language} />
        </div>

        {/* Large Play Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full" id="speed-test-action-buttons">
          {stage === 'idle' || stage === 'completed' ? (
            <button
              onClick={startTest}
              disabled={isRunning}
              id="start-speedtest-btn"
              className="px-8 py-4 w-full sm:w-auto rounded-xl text-base font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-900/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              {stage === 'completed' ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{stage === 'completed' ? (isAr ? "إعادة الفحص" : "Re-Run Speed Test") : t.startTest}</span>
            </button>
          ) : (
            <div className="text-slate-400 text-sm font-mono flex items-center space-x-2 animate-pulse">
              <Activity className="w-4 h-4 text-blue-400 animate-spin" />
              <span>{isAr ? "يجري الاحتساب وتدفق الحزم الرياضية الموثوقة..." : "Running calculations on packets stream..."}</span>
            </div>
          )}

          {stage === 'completed' && (
            <button
              onClick={() => setCurrentPage('analysis')}
              id="goto-analysis-page-btn"
              className="px-8 py-4 w-full sm:w-auto rounded-xl text-base font-black bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t.ctaAnalyzeNow}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>

      {/* Mini Technical Guide */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 text-slate-400 text-xs leading-relaxed flex items-start space-x-3 rtl:space-x-reverse">
        <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300 block mb-1">
            {isAr ? "إرشادات الحصول على أقصى دقة فنية للفحص:" : "Guide for achieving accurate technical measurements:"}
          </span>
          {isAr ? (
            "يرجى التأكد من إيقاف أي عمليات تنزيل أو رفع مستمرة بالخلفية، وإغلاق علامات التبويب التي تبث محتوى الفيديو عالي الدقة، والجلوس بالقرب من الراوتر للحصول على المؤشرات الدقيقة للاتصال المحلي بدون ضوضاء تدرجية."
          ) : (
            "Please ensure you pause any active downloads, close backgrounds video streaming tabs, and position device near the core router access point to secure direct telemetry without local channel noise interference."
          )}
        </div>
      </div>

    </div>
  );
}
