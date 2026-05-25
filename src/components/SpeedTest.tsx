import React, { useState, useEffect, useRef } from "react";
import { PageId, Language, SpeedResults } from "../types";
import { TRANSLATIONS } from "../data";
import { 
  Gauge, 
  Play, 
  Activity, 
  RotateCcw, 
  AlertTriangle, 
  ChevronRight, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Timer, 
  Zap, 
  Radio, 
  Sparkles,
  Award
} from "lucide-react";
import SpeedChart, { ChartDataPoint } from "./SpeedChart";
import { FutureSoundEngine } from "./FutureAmbiance";
import { motion, AnimatePresence } from "motion/react";

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

  // Active Dial Value (maps to active measurement for visual needles/arcs)
  const [liveDialValue, setLiveDialValue] = useState(0);

  const startTest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStage('ping');
    setGaugeProgress(10);
    setLiveDialValue(5);

    // Initial values reset
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);
    setChartData([]);

    // Sound alert
    FutureSoundEngine.playScan();

    // Step 1: Run Ping & Jitter calculation (2.5 seconds)
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
      setLiveDialValue(0);

      // Sound update
      FutureSoundEngine.playTick();

      // Step 2: Run Download simulation for 3.5 seconds
      let downloadCounter = 0.1;
      let iterations = 0;
      const targetDownload = profile === 'stable' ? (Math.random() * 140 + 280) // 280-420 Mbps
                            : profile === 'slow' ? (Math.random() * 6 + 4.2)   // 4.2-10.2 Mbps
                            : profile === 'gaming' ? (Math.random() * 30 + 35)  // 35-65 Mbps
                            : (Math.random() * 180 + 15);                      // 15-195 Mbps

      const downloadInterval = setInterval(() => {
        iterations++;
        const step = targetDownload / 20;
        downloadCounter = Math.min(targetDownload, downloadCounter + step + (Math.random() * step - step/2));
        const currentDl = parseFloat(downloadCounter.toFixed(1));
        
        setDownload(currentDl);
        setLiveDialValue(currentDl);
        setGaugeProgress(40 + Math.floor((iterations / 20) * 30));

        // Record real-time chart data point
        const elapsed = parseFloat((iterations * 0.15).toFixed(2));
        setChartData(prev => [...prev, { elapsed, value: currentDl, type: 'download' }]);

        if (iterations >= 20) {
          clearInterval(downloadInterval);
          const finalDl = parseFloat(targetDownload.toFixed(1));
          setDownload(finalDl);

          setStage('upload');
          setGaugeProgress(70);
          setLiveDialValue(0);

          // Sound update
          FutureSoundEngine.playTick();

          // Step 3: Run Upload simulation for 3.5 seconds
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
            setLiveDialValue(currentUl);
            setGaugeProgress(70 + Math.floor((uploadIterations / 20) * 30));

            // Record real-time chart data point
            const elapsed = parseFloat((3.0 + uploadIterations * 0.15).toFixed(2));
            setChartData(prev => [...prev, { elapsed, value: currentUl, type: 'upload' }]);

            if (uploadIterations >= 20) {
              clearInterval(uploadInterval);
              const finalUl = parseFloat(targetUpload.toFixed(1));
              setUpload(finalUl);

              setStage('completed');
              setIsRunning(false);
              setGaugeProgress(100);
              setLiveDialValue(0);

              // Play awesome futuristic success tone
              FutureSoundEngine.playSuccess();

              // Trigger complete callback
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

  // Determine active phase theme configurations
  let themeColor = "text-[#00F0FF]";
  let themeBg = "bg-[#00F0FF]";
  let themeBorder = "border-[#00F0FF]";
  let themeGlowClass = "glow-cyan";
  let maxDialVal = 500; // max value representation for visual gauge scaling

  if (stage === 'ping') {
    themeColor = "text-[#00FFA3]";
    themeBg = "bg-[#00FFA3]";
    themeBorder = "border-[#00FFA3]";
    themeGlowClass = "glow-emerald";
    maxDialVal = 300;
  } else if (stage === 'download') {
    themeColor = "text-[#00F0FF]";
    themeBg = "bg-[#00F0FF]";
    themeBorder = "border-[#00F0FF]";
    themeGlowClass = "glow-cyan";
    maxDialVal = 500;
  } else if (stage === 'upload') {
    themeColor = "text-[#7B61FF]";
    themeBg = "bg-[#7B61FF]";
    themeBorder = "border-[#7B61FF]";
    themeGlowClass = "glow-purple";
    maxDialVal = 300;
  } else if (stage === 'completed') {
    themeColor = "text-[#00FFA3]";
    themeBg = "bg-[#00FFA3]";
    themeBorder = "border-[#00FFA3]";
    themeGlowClass = "glow-emerald";
  }

  // Calculate stroke-dashoffset for circular gauge
  // Circumference for r=115 is 2 * Math.PI * 115 = 722.5
  const circumference = 722.5;
  const clampedVal = Math.min(liveDialValue, maxDialVal);
  const percentFilled = liveDialValue ? (clampedVal / maxDialVal) : 0;
  const strokeDashoffset = circumference - (percentFilled * circumference);

  const displaySpeedNumeric = () => {
    if (stage === 'ping') return ping || liveDialValue.toFixed(0);
    if (stage === 'download') return download.toFixed(1);
    if (stage === 'upload') return upload.toFixed(1);
    if (stage === 'completed') return download.toFixed(1);
    return "0.0";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-right sm:text-left rtl:sm:text-right" id="speed-test-view-container">
      
      {/* Dynamic Cinematic Header */}
      <div className="text-center mb-10">
        <div className={`inline-flex p-3.5 bg-[#0b1020]/80 border ${themeBorder} rounded-2xl mb-4 transition-all duration-300 ${themeGlowClass}`}>
          <Gauge className={`w-8 h-8 ${themeColor} animate-pulse`} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight" id="speedtest-page-header">
          {t.speedTestTitle}
        </h1>
        <p className="text-slate-400 mt-2.5 text-sm sm:text-base max-w-xl mx-auto">
          {t.speedTestSubtitle}
        </p>
      </div>

      {/* Profile Selector (Interactive simulation scenarios with premium buttons) */}
      <div className="bg-[#0b1020]/50 border border-slate-900 rounded-3xl p-6 mb-8 relative overflow-hidden" id="profile-selector-panel">
        <label className="block text-xs font-mono text-[#00F0FF] uppercase tracking-widest mb-4 text-center sm:text-left rtl:sm:text-right font-black">
          📡 // {t.profileSelectLabel}
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => !isRunning && setProfile('random')}
            disabled={isRunning}
            id="profile-btn-random"
            className={`px-5 py-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-between ${
              profile === 'random'
                ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/55 shadow-lg shadow-[#00F0FF]/10 scale-[1.02]"
                : "bg-[#030712]/40 text-slate-400 border-slate-900/80 hover:border-slate-850 hover:text-slate-300"
            }`}
          >
            <span>🕹️ {t.profileRandom}</span>
            {profile === 'random' && <Zap className="w-3.5 h-3.5 animate-bounce text-[#00FFA3]" />}
          </button>

          <button
            onClick={() => !isRunning && setProfile('stable')}
            disabled={isRunning}
            id="profile-btn-stable"
            className={`px-5 py-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-between ${
              profile === 'stable'
                ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/55 shadow-lg shadow-[#00F0FF]/10 scale-[1.02]"
                : "bg-[#030712]/40 text-slate-400 border-slate-900/80 hover:border-slate-850 hover:text-slate-300"
            }`}
          >
            <span>⚡ {t.profileNormal}</span>
            {profile === 'stable' && <Zap className="w-3.5 h-3.5 animate-bounce text-[#00FFA3]" />}
          </button>

          <button
            onClick={() => !isRunning && setProfile('slow')}
            disabled={isRunning}
            id="profile-btn-slow"
            className={`px-5 py-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-between ${
              profile === 'slow'
                ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/55 shadow-lg shadow-[#00F0FF]/10 scale-[1.02]"
                : "bg-[#030712]/40 text-slate-400 border-slate-900/80 hover:border-slate-850 hover:text-slate-300"
            }`}
          >
            <span>🐌 {t.profileSlow}</span>
            {profile === 'slow' && <Zap className="w-3.5 h-3.5 animate-bounce text-[#00FFA3]" />}
          </button>

          <button
            onClick={() => !isRunning && setProfile('gaming')}
            disabled={isRunning}
            id="profile-btn-gaming"
            className={`px-5 py-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-between ${
              profile === 'gaming'
                ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/55 shadow-lg shadow-[#00F0FF]/10 scale-[1.02]"
                : "bg-[#030712]/40 text-slate-400 border-slate-900/80 hover:border-slate-850 hover:text-slate-300"
            }`}
          >
            <span>🎮 {t.profileGamingBad}</span>
            {profile === 'gaming' && <Zap className="w-3.5 h-3.5 animate-bounce text-[#00FFA3]" />}
          </button>
        </div>
      </div>

      {/* Main Speed Gauge Simulator Frame */}
      <div 
        className="bg-[#0b1020]/40 border border-slate-800/80 rounded-3xl p-8 sm:p-14 mb-8 shadow-2xl relative overflow-hidden flex flex-col items-center"
        id="gauge-canvas-wrapper"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-900">
          <div 
            className="h-full bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#00FFA3] transition-all duration-300 shadow-[0_0_12px_#00F0FF]"
            style={{ width: `${gaugeProgress}%` }}
          ></div>
        </div>

        {/* Big Interactive Circular Speed Meter Gauge */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-8" id="radial-dial-container">
          
          {/* Neon track circle (SVG) */}
          <svg className="absolute w-full h-full rotate-[-90deg]">
            {/* Background track circle */}
            <circle 
              cx="144" 
              cy="144" 
              r="115" 
              className="stroke-slate-900 fill-none" 
              strokeWidth="10" 
            />
            {/* Glowing active dial arc */}
            <circle 
              cx="144" 
              cy="144" 
              r="115" 
              className={`stroke-current ${themeColor} fill-none transition-all duration-150 ease-out`} 
              strokeWidth="9" 
              strokeDasharray={722.5}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Glowing particle rings inside the circular gauge */}
          <div className="absolute inset-4 rounded-full border border-slate-800/30 bg-[#030712]/50 backdrop-blur-md flex flex-col justify-center items-center z-10 p-4">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black block mb-2 text-center">
              {stage === 'ping' && t.testingPing}
              {stage === 'download' && t.testingDownload}
              {stage === 'upload' && t.testingUpload}
              {stage === 'completed' && t.testCompleted}
              {stage === 'idle' && (isAr ? "جاهز مسبقاً" : "Core System Standby")}
            </span>
            
            <div className="my-1.5 flex flex-col items-center">
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={displaySpeedNumeric()}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.1 }}
                  className="text-5xl sm:text-6.5xl font-mono font-black text-white tracking-tight leading-none text-center"
                >
                  {displaySpeedNumeric()}
                </motion.span>
              </AnimatePresence>

              <span className={`text-[11px] font-black uppercase font-mono mt-2 tracking-widest ${themeColor}`}>
                {stage === 'download' || stage === 'upload' || stage === 'completed' || stage === 'idle' ? 'Mbps stream' : 'ms lat'}
              </span>
            </div>

            {/* Glowing micro stats */}
            {stage !== 'idle' && (
              <div className="absolute bottom-5 text-[9px] font-mono text-[#00FFA3] flex items-center gap-1.5 bg-[#00FFA3]/5 border border-[#00FFA3]/30 px-2 py-0.5 rounded-full animate-pulse">
                <Activity className="w-3 h-3 text-[#00FFA3]" />
                {isAr ? "دفق نشط" : "LIVE_DUPLEX"}
              </div>
            )}
          </div>

          {/* Pulse ping animation behind gauge */}
          {isRunning && (
            <div className={`absolute inset-0 rounded-full border-2 ${themeBorder} opacity-15 animate-ping`} style={{ animationDuration: '2.5s' }}></div>
          )}
        </div>

        {/* Live Metrics Grid Output (Staggered cards with transparency and glowing borders) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full" id="live-results-grid">
          
          {/* Download Speed */}
          <div className={`bg-[#030712]/50 border rounded-2xl p-5 text-center transition-all duration-300 ${stage === 'download' ? 'border-[#00F0FF] shadow-lg shadow-[#00F0FF]/15 scale-102 bg-[#00F0FF]/5' : 'border-slate-900'}`}>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1.5 font-bold">
              <ArrowDownCircle className="w-3.5 h-3.5 text-[#00F0FF]" />
              {t.downloadLabel}
            </span>
            <div className="flex items-baseline justify-center space-x-1.5 rtl:space-x-reverse">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">{download}</span>
              <span className="text-xs text-slate-400 font-mono">Mbps</span>
            </div>
            {stage === 'download' && <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full mx-auto mt-2.5 animate-ping"></div>}
          </div>

          {/* Upload Speed */}
          <div className={`bg-[#030712]/50 border rounded-2xl p-5 text-center transition-all duration-300 ${stage === 'upload' ? 'border-[#7B61FF] shadow-lg shadow-[#7B61FF]/15 scale-102 bg-[#7B61FF]/5' : 'border-slate-900'}`}>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1.5 font-bold">
              <ArrowUpCircle className="w-3.5 h-3.5 text-[#7B61FF]" />
              {t.uploadLabel}
            </span>
            <div className="flex items-baseline justify-center space-x-1.5 rtl:space-x-reverse">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">{upload}</span>
              <span className="text-xs text-slate-400 font-mono">Mbps</span>
            </div>
            {stage === 'upload' && <div className="w-1.5 h-1.5 bg-[#7B61FF] rounded-full mx-auto mt-2.5 animate-ping"></div>}
          </div>

          {/* Ping Latency */}
          <div className={`bg-[#030712]/50 border rounded-2xl p-5 text-center transition-all duration-300 ${stage === 'ping' ? 'border-[#00FFA3] shadow-lg shadow-[#00FFA3]/15 scale-102 bg-[#00FFA3]/5' : 'border-slate-900'}`}>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1.5 font-bold">
              <Timer className="w-3.5 h-3.5 text-[#00FFA3]" />
              {t.pingLabel}
            </span>
            <div className="flex items-baseline justify-center space-x-1.5 rtl:space-x-reverse">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">{ping}</span>
              <span className="text-xs text-slate-400 font-mono">ms</span>
            </div>
            {stage === 'ping' && <div className="w-1.5 h-1.5 bg-[#00FFA3] rounded-full mx-auto mt-2.5 animate-ping"></div>}
          </div>

          {/* Jitter */}
          <div className="bg-[#030712]/50 border border-slate-900 rounded-2xl p-5 text-center">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1.5 font-bold">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              {t.jitterLabel}
            </span>
            <div className="flex items-baseline justify-center space-x-1.5 rtl:space-x-reverse">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">{jitter}</span>
              <span className="text-xs text-slate-400 font-mono">ms</span>
            </div>
          </div>

        </div>

        {/* Real-time elegant line chart of packet telemetry */}
        <div className="w-full mt-10 border-t border-slate-900/80 pt-8" id="speed-test-d3-chart-wrapper">
          <SpeedChart data={chartData} activeStage={stage} language={language} />
        </div>

        {/* Primary Speeder Action Trigger Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 w-full" id="speed-test-action-buttons">
          {stage === 'idle' || stage === 'completed' ? (
            <button
              onClick={startTest}
              disabled={isRunning}
              id="start-speedtest-btn"
              className="px-10 py-5 w-full sm:w-auto rounded-xl text-base font-black bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#00FFA3] text-black hover:brightness-110 shadow-xl shadow-[#00F0FF]/15 hover:scale-[1.04] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-3 rtl:space-x-reverse"
            >
              {stage === 'completed' ? <RotateCcw className="w-5 h-5 text-black" /> : <Play className="w-4.5 h-4.5 fill-current text-black" />}
              <span>{stage === 'completed' ? (isAr ? "إعادة الفحص" : "Re-Run Speed Test") : t.startTest}</span>
            </button>
          ) : (
            <div className="bg-[#030712]/40 border border-[#00F0FF]/30 rounded-2xl px-6 py-4.5 text-slate-400 text-xs font-mono flex items-center space-x-3 animate-pulse w-full max-w-md justify-center">
              <Activity className="w-4 h-4 text-[#00F0FF] animate-spin" />
              <span>{isAr ? "يجري رصد الاتصال وتفريغ الحزم بالمللي ثانية..." : "Processing packet telemetry stream..."}</span>
            </div>
          )}

          {stage === 'completed' && (
            <button
              onClick={() => setCurrentPage('analysis')}
              id="goto-analysis-page-btn"
              className="px-10 py-5 w-full sm:w-auto rounded-xl text-base font-black bg-gradient-to-r from-[#00FFA3] to-emerald-600 text-black hover:brightness-110 shadow-lg shadow-[#00FFA3]/15 hover:scale-[1.04] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2.5 rtl:space-x-reverse"
            >
              <span>{t.ctaAnalyzeNow}</span>
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          )}
        </div>

      </div>

      {/* Cyber Guideline Box */}
      <div className="bg-[#0b1020]/45 border border-slate-900 rounded-2xl p-6 text-slate-400 text-xs leading-relaxed flex items-start space-x-3.5 rtl:space-x-reverse backdrop-blur-md">
        <AlertTriangle className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300 block mb-1">
            {isAr ? "إرشادات استهلاك الموارد للحصول على أدق قراءات رقمية للشبكة:" : "Optimal guidelines for securing pristine measurement accuracy:"}
          </span>
          {isAr ? (
            "يرجى التأكد من إيقاف أي عمليات تنزيل أو تحميل نشطة بالخلفية، وإغلاق أي تطبيقات تستهلك عروض حِزم الشبكة للحفاظ على استقرار تدفق التلمس السحابي عبر الراوتر."
          ) : (
            "Please ensure you suspend background download routines, verify local router channels are clear from concurrent hardware streaming, and reside close to connection hubs to extract pure telemetry."
          )}
        </div>
      </div>

    </div>
  );
}
