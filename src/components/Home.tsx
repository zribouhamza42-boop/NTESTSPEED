import React, { useState, useEffect } from "react";
import { PageId, Language, SpeedResults } from "../types";
import { TRANSLATIONS, VPN_OFFERS_DATA } from "../data";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Radio, 
  Globe, 
  Server, 
  Activity, 
  Database, 
  Network, 
  Sliders, 
  Flame, 
  RefreshCw,
  Clock,
  CheckCircle,
  Hash,
  Compass,
  Laptop,
  Check,
  Award,
  Sparkles,
  MousePointerClick
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SpeedTest from "./SpeedTest";
import { FutureParticleSystem, FutureSoundEngine } from "./FutureAmbiance";

interface HomeProps {
  language: Language;
  setCurrentPage: (page: PageId) => void;
  onTestComplete: (results: SpeedResults) => void;
}

interface ServerNode {
  id: string;
  city_ar: string;
  city_en: string;
  country: string;
  x: number; // Percent width of Map SVG
  y: number; // Percent height of Map SVG
  baseLatency: number;
  currentLatency: number;
  status: 'optimal' | 'warning' | 'throttled';
}

export default function Home({ language, setCurrentPage, onTestComplete }: HomeProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  // --- INTERACTIVE OPTIMIZER STATES ---
  const [dnsMode, setDnsMode] = useState<'default' | 'cloudflare' | 'google'>('default');
  const [tunnelEnabled, setTunnelEnabled] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(100);
  const [telemetryMessage, setTelemetryMessage] = useState<string>(
    isAr ? "نظام التشخيص الفوري قيد الانتظار" : "Real-time diagnostics system standby"
  );
  const [bufferStatus, setBufferStatus] = useState<'normal' | 'flushed' | 'cleaning'>('normal');

  // --- SELECTION MAP NODE ---
  const [selectedNodeId, setSelectedNodeId] = useState<string>("london");
  const [clickPulse, setClickPulse] = useState(0);

  // --- SIMULATED REAL-TIME GLOBAL SERVER NODES ---
  const [nodes, setNodes] = useState<ServerNode[]>([
    { id: "newyork", city_ar: "نيويورك (أمريكا)", city_en: "New York (US)", country: "US", x: 22, y: 35, baseLatency: 85, currentLatency: 85, status: 'optimal' },
    { id: "london", city_ar: "لندن (بريطانيا)", city_en: "London (UK)", country: "UK", x: 44, y: 26, baseLatency: 38, currentLatency: 38, status: 'optimal' },
    { id: "frankfurt", city_ar: "فرانكفورت (ألمانيا)", city_en: "Frankfurt (DE)", country: "DE", x: 48, y: 30, baseLatency: 42, currentLatency: 42, status: 'optimal' },
    { id: "cairo", city_ar: "القاهرة (مصر)", city_en: "Cairo (EG)", country: "EG", x: 53, y: 44, baseLatency: 12, currentLatency: 12, status: 'optimal' },
    { id: "tokyo", city_ar: "طوكيو (اليابان)", city_en: "Tokyo (JP)", country: "JP", x: 82, y: 38, baseLatency: 145, currentLatency: 145, status: 'optimal' },
    { id: "sydney", city_ar: "سيدني (أستراليا)", city_en: "Sydney (AU)", country: "AU", x: 86, y: 82, baseLatency: 220, currentLatency: 220, status: 'optimal' }
  ]);

  // Jitter simulation for global nodes
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes(prev => prev.map(n => {
        let modifier = 0;
        if (dnsMode === 'cloudflare') modifier -= 5;
        if (dnsMode === 'google') modifier -= 3;
        if (tunnelEnabled) modifier -= 10;

        const jitterVal = Math.floor(Math.random() * 5) - 2; // -2 to +2 jitter
        const target = Math.max(2, n.baseLatency + modifier + jitterVal);
        
        let nodeStatus: 'optimal' | 'warning' | 'throttled' = 'optimal';
        if (target > 90) nodeStatus = 'warning';
        if (target > 180) nodeStatus = 'throttled';

        return {
          ...n,
          currentLatency: target,
          status: nodeStatus
        };
      }));
    }, 1200);
    return () => clearInterval(timer);
  }, [dnsMode, tunnelEnabled]);

  // --- DYNAMIC AI OPTIMIZATION TRIGGER ---
  const handleTriggerOptimization = () => {
    if (optimizing) return;
    setOptimizing(true);
    FutureSoundEngine.playScan();
    setTelemetryMessage(isAr ? "يقوم الذكاء الاصطناعي برصد مسارات الألياف الضوئية المتاحة..." : "AI scanning active fiber-optic physical channels...");
    
    setTimeout(() => {
      FutureSoundEngine.playTick();
      setTelemetryMessage(isAr ? "توجيه الحزم الفنية وإخلاء مخزن الذاكرة التراكمي للإنترنت..." : "Re-routing logical IP corridors & clearing local socket backlogs...");
      setOptimizationScore(125);
    }, 1200);

    setTimeout(() => {
      FutureSoundEngine.playSuccess();
      setTelemetryMessage(isAr ? "تم إعادة تهيئة المسار بنجاح! تحسن زمن الاستجابة بنسبة ٢٨٪" : "Network path optimized! Latency responsiveness enhanced by 28%");
      setOptimizing(false);
      setOptimizationScore(146);
    }, 2600);
  };

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
    setClickPulse(prev => prev + 1);
    FutureSoundEngine.playTick();
    const curr = nodes.find(n => n.id === id);
    if (curr) {
      setTelemetryMessage(
        isAr 
          ? `تم تحديد خادم الفحص: ${curr.city_ar} | البينج المقدر: ${curr.currentLatency} مللي ثانية` 
          : `Selected server node: ${curr.city_en} | Estimated Ping: ${curr.currentLatency} ms`
      );
    }
  };

  const featuredVpns = VPN_OFFERS_DATA.slice(0, 3);

  const stats = [
    { label_en: "AI Network Diagnostics / Min", label_ar: "عمليات الفحص والأبحاث الفورية / دقيقة", value: "847,910" },
    { label_en: "ISP Throttling Bypassed", label_ar: "عمليات تخطي الخنق الإلكتروني", value: "99.98%" },
    { label_en: "Global Telemetry Nodes", label_ar: "خوادم القياس السحابية النشطة", value: "1,240 Nodes" },
    { label_en: "Optimized Throughput Jitter", label_ar: "متوسط خفض تذبذب الإشارة الفعلي", value: "-42.4%" }
  ];

  const selectedNodeObj = nodes.find(n => n.id === selectedNodeId) || nodes[1];

  // User's Location (Tunis/Casablanca / S. Europe area - highly central baseline)
  const userLoc = { x: 44, y: 45 };
  const userX = userLoc.x * 10;
  const userY = userLoc.y * 5;
  const targetX = selectedNodeObj ? selectedNodeObj.x * 10 : 440;
  const targetY = selectedNodeObj ? selectedNodeObj.y * 5 : 225;
  const midX = (userX + targetX) / 2;
  const midY = (userY + targetY) / 2;
  const distance = Math.sqrt(Math.pow(targetX - userX, 2) + Math.pow(targetY - userY, 2));
  const arcControlX = midX;
  const arcControlY = Math.min(userY, targetY) - (distance * 0.18) - 20;
  const connectionPathD = `M ${userX} ${userY} Q ${arcControlX} ${arcControlY} ${targetX} ${targetY}`;

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden" id="home-page-container">
      
      {/* GLOWING AURORA LIGHTS IN BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-0">
        <FutureParticleSystem />
        {/* Holographic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 grid-animation"></div>
        
        {/* Glowing floating blur backdrops */}
        <div className="absolute top-[-100px] left-[15%] w-[550px] h-[550px] bg-gradient-to-tr from-[#7B61FF]/15 to-[#00F0FF]/15 rounded-full blur-[140px] aurora-motion"></div>
        <div className="absolute top-[35%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-[#00FFA3]/10 to-[#7B61FF]/10 rounded-full blur-[160px] aurora-motion" style={{ animationDelay: "-5s" }}></div>
        <div className="absolute bottom-[10%] left-[8%] w-[450px] h-[450px] bg-gradient-to-tr from-[#00F0FF]/10 to-[#00FFA3]/10 rounded-full blur-[120px] aurora-motion" style={{ animationDelay: "-10s" }}></div>
      </div>

      {/* Cybernetic Neon TOP Status scanning strip decoration */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#00F0FF] to-[#7B61FF] pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-0 w-1/4 h-full bg-white laser-sweep-line"></div>
      </div>

      {/* Hero Redesign Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-4" id="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          
          {/* Neon AI Badge */}
          <div className="inline-flex items-center space-x-2.5 rtl:space-x-reverse px-4 py-2 rounded-full bg-[#0b1020]/80 border border-[#00F0FF]/40 text-xs text-[#00F0FF] font-mono mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-[#7B61FF]/60 transition-colors duration-300 transform hover:scale-105" id="hero-badge">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
            </span>
            <span className="uppercase tracking-widest font-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00FFA3]" />
              {isAr ? "الجيل الجديد من الجيجا-سحابي والـ AI لعام ٢٠٢٦" : "NEXT-GEN COGNITIVE TELEMETRY & SPEED ENGINE 2026"}
            </span>
          </div>

          {/* Redesigned Futuristic Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[1.05] mb-8 max-w-6xl mx-auto font-sans"
            id="hero-title"
          >
            {isAr ? (
              <>
                شخّص شبكتك فوريّاً بالذكاء وعزز <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#00FFA3] drop-shadow-lg text-gradient-shimmer">سرعة اتصالك الخارقة ⚡</span>
              </>
            ) : (
              <>
                Explore Real Network Telemetry & Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#00FFA3] drop-shadow-lg text-gradient-shimmer">Internet with AI</span>
              </>
            )}
          </h1>

          {/* Redesigned Subtitle */}
          <p 
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed font-sans"
            id="hero-description"
          >
            {isAr ? (
              "يقوم نظام التشخيص السحابي الأكثر تطوراً بالتقاط البيانات الاستكشافية الفورية، تتبع الفروق وحساب تذبذب البينج بدقة متناهية، ثم يقدم توجيهات وحلول مدعومة بالكامل بالـ AI ومطابقة أوتوماتيكية لأقوى خوادم التوجيه المخصصة."
            ) : (
              "Our premium AI-driven core telemetry tool maps high-precision data packets transmission, checks routes jitter globally in micro-seconds, and pairs you with high-speed VPN & 10Gbps remote RDP configurations instantly."
            )}
          </p>

          {/* Large AI Integrated Speed Test Panel in Center */}
          <div 
            className="relative max-w-4xl mx-auto bg-[#0b1020]/60 border border-slate-800/80 rounded-3xl p-1 md:p-6 backdrop-blur-2xl shadow-[0_45px_120px_rgba(3,7,18,0.9)] overflow-hidden transition-all duration-300 w-full glow-cyan"
            id="hero-speed-gauge-embed"
          >
            {/* Holographic scanner laser line sweep effect */}
            <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/35 to-transparent shadow-[0_0_15px_#00F0FF] opacity-60 pointer-events-none animate-pulse"></div>

            {/* Embed core SpeedTest engine with a pristine glow frame */}
            <div className="w-full bg-[#030712]/35 border border-slate-900/60 rounded-2xl p-2 sm:p-5 relative">
              {/* Terminal Frame Decor in top corners */}
              <div className="absolute top-4 left-5 flex space-x-2 rtl:space-x-reverse">
                <span className="w-3 h-3 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></span>
                <span className="w-3 h-3 rounded-full bg-[#7B61FF]/60 shadow-[0_0_8px_rgba(123,97,255,0.3)]"></span>
                <span className="w-3 h-3 rounded-full bg-[#00F0FF]/60 shadow-[0_0_8px_rgba(0,240,255,0.3)]"></span>
              </div>
              <div className="absolute top-4 right-5 text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#00FFA3] animate-pulse" />
                ACTIVE_SAAS_SPECTRUM_AI
              </div>

              <div className="pt-6">
                <SpeedTest 
                  language={language}
                  onTestComplete={onTestComplete}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>

          {/* Quick Trigger Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 max-w-md mx-auto mt-14 relative z-20" id="hero-actions">
            <button
              onClick={() => setCurrentPage("speedtest")}
              id="hero-primary-cta"
              className="w-full sm:w-auto px-10 py-4.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#00FFA3] text-black shadow-lg shadow-[#00F0FF]/25 hover:shadow-[#7B61FF]/40 transition-all duration-300 hover:scale-[1.05] active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-3 rtl:space-x-reverse hover:brightness-110"
            >
              <Zap className="w-4.5 h-4.5 text-black" />
              <span>{t.ctaStartTest}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentPage("how-it-works")}
              id="hero-secondary-cta"
              className="w-full sm:w-auto px-10 py-4.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#0b1020]/90 border border-[#00F0FF]/30 text-slate-200 hover:text-white hover:border-[#00F0FF] transition-all duration-200 cursor-pointer shadow-inner backdrop-blur-md"
            >
              {t.navHowItWorks}
            </button>
          </div>

        </div>
      </section>

      {/* NEW INTERACTIVE WORLD MAP & TELEMETRY REGION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" id="live-map-section">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-2">
            📊 // GLOBAL NETWORK INTEGRITY CORE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {isAr ? "دليل مسارات البث والاتصالات العالمية الفوري" : "Interactive Global AI Connection Path Matrix"}
          </h2>
          <p className="text-sm text-slate-400">
            {isAr 
              ? "تحقق من شبكة خوادمنا السحابية النشطة حول القارات. انقر فوق أي عقدة باللون النيون لمزامنة واختبار زمن استجابتها الحالي ومطابقته فوراً." 
              : "Monitor real-time server latencies over global routes. Click on any premium neon hub to measure node latency and customize routing paths."}
          </p>
        </div>

        {/* Real-time Map and Panel container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* SVG Map Backdrop (8 columns) */}
          <div className="lg:col-span-8 bg-[#0b1020]/45 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group shadow-xl">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]/30 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]/30 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]/30 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]/30 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Globe className="w-5 h-5 text-[#00F0FF] animate-spin" style={{ animationDuration: '15s' }} />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{isAr ? "خارطة التوجيه والألياف النشطة" : "Active Fiber & Node Topology Map"}</span>
              </div>
              <span className="text-[10px] font-mono text-[#00FFA3] bg-[#00FFA3]/5 border border-[#00FFA3]/30 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3]"></span>
                {isAr ? "ثنائية الإرسال: متصل" : "DUPLEX_UPTIME: 100% OK"}
              </span>
            </div>

            {/* MAP STYLIZED VISUAL SVG */}
            <div className="relative w-full aspect-[16/9] min-h-[260px] max-h-[460px] bg-[#030712]/40 rounded-2xl border border-slate-900/90 p-1 flex items-center justify-center">
              
              {/* Fake grid lines and holographic rings */}
              <div className="absolute inset-0 bg-[#00F0FF]/[0.015] radar-sweep pointer-events-none rounded-full border border-[#00F0FF]/5 max-w-md max-h-md m-auto"></div>

              {/* STYLIZED SVG CONTINENT GRID */}
              <svg viewBox="0 0 1000 500" className="w-full h-full opacity-65 select-none pointer-events-none absolute inset-0">
                {/* stylized dots representing global continents */}
                {/* North America (x:150-300, y:120-220) */}
                <path d="M120,150 Q160,110 220,130 T320,160 T280,220 T150,260 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Europe */}
                <path d="M410,140 Q460,90 520,140 T500,220 T440,240 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Africa */}
                <path d="M430,260 Q480,230 540,280 T560,380 T480,410 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Asia */}
                <path d="M560,140 Q700,100 840,150 T880,260 T750,340 T580,240 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* South America */}
                <path d="M260,280 Q300,260 330,320 T310,410 T240,430 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Australia */}
                <path d="M780,360 Q840,350 890,380 T880,440 T770,420 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* ANIMATED TRACER PATH LINES between London and NYC, Tokyo, Cairo, Sydney */}
                <path d="M 220 175 L 440 130" fill="none" stroke="url(#cyan-gradient)" strokeWidth="1.5" opacity="0.4" />
                <path d="M 440 130 L 480 150" fill="none" stroke="url(#purple-gradient)" strokeWidth="1.5" opacity="0.6" />
                <path d="M 480 150 L 530 220" fill="none" stroke="url(#cyan-gradient)" strokeWidth="1.5" opacity="0.5" />
                <path d="M 440 130 L 530 220" fill="none" stroke="url(#cyan-gradient)" strokeWidth="1.5" opacity="0.4" />
                <path d="M 530 220 L 820 190" fill="none" stroke="url(#purple-gradient)" strokeWidth="1.5" opacity="0.4" />
                <path d="M 820 190 L 860 410" fill="none" stroke="url(#emerald-gradient)" strokeWidth="1.5" opacity="0.4" />

                {/* Animated Dash Arrays (Simulation of moving internet speed packets) */}
                <path d="M 220 175 Q 330 145 440 130" fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="20,150" strokeDashoffset="45" opacity="0.9" />
                <path d="M 440 130 Q 630 160 820 190" fill="none" stroke="#7B61FF" strokeWidth="2.5" strokeDasharray="30,200" strokeDashoffset="110" opacity="0.9" />
                <path d="M 530 220 Q 695 315 860 410" fill="none" stroke="#00FFA3" strokeWidth="2.5" strokeDasharray="25,180" strokeDashoffset="90" opacity="0.9" />

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00FFA3" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="holographic-laser" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#7B61FF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* DYNAMIC CONNECTION PATH FROM USER TO SELECTED SERVER */}
                {selectedNodeObj && (
                  <>
                    <path
                      d={connectionPathD}
                      fill="none"
                      stroke="url(#holographic-laser)"
                      strokeWidth="2"
                      opacity="0.35"
                      strokeDasharray="4,4"
                      className="transition-all duration-300"
                    />
                    <path
                      key={`laser-pulse-${selectedNodeObj.id}-${clickPulse}`}
                      d={connectionPathD}
                      fill="none"
                      stroke="url(#holographic-laser)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="40, 160"
                      className="laser-pulse-animation"
                    />
                    <path
                      key={`laser-spark-${selectedNodeObj.id}-${clickPulse}`}
                      d={connectionPathD}
                      fill="none"
                      stroke="#00FFA3"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="8, 200"
                      className="laser-spark-animation"
                      style={{ filter: "drop-shadow(0 0 6px #00FFA3)" }}
                    />
                  </>
                )}
              </svg>

              {/* USER GATEWAY PIN (YOUR CORE BASE) */}
              <div
                className="absolute z-20 focus:outline-none pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 select-none"
                style={{ left: `${userLoc.x}%`, top: `${userLoc.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full opacity-60 bg-fuchsia-500/30" style={{ animationDuration: '2s' }}></span>
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-70 bg-fuchsia-500/40" style={{ animationDuration: '1s' }}></span>
                  <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-fuchsia-500 border-2 border-white shadow-[0_0_15px_rgba(244,63,94,0.9)] scale-110"></span>
                </div>
                <div className="absolute top-[24px] left-1/2 -translate-x-1/2 bg-slate-950/90 border border-fuchsia-500/60 text-fuchsia-400 font-mono text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow-2xl">
                  {isAr ? "بوابتك السحابية" : "GATEWAY (YOU)"}
                </div>
              </div>

              {/* HTML CLOUD PINS (Pulsing interaction coordinates) */}
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                let coreColor = "bg-[#00F0FF]";
                let radialColor = "rgba(0,240,255,0.4)";
                
                if (node.status === 'warning') {
                  coreColor = "bg-[#7B61FF]";
                  radialColor = "rgba(123,97,255,0.4)";
                } else if (node.status === 'throttled') {
                  coreColor = "bg-rose-500";
                  radialColor = "rgba(244,63,94,0.4)";
                }

                if (isSelected) {
                  coreColor = "bg-[#00FFA3]";
                  radialColor = "rgba(0,255,163,0.6)";
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    className="absolute z-20 focus:outline-none group/node pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    {/* Ring Wave animations */}
                    <div className="relative flex items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-65`} style={{ backgroundColor: radialColor }}></span>
                      <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${coreColor} border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.8)] group-hover/node:scale-125 transition-transform duration-200`}></span>
                    </div>

                    {/* Popover Hover Tooltip */}
                    <div className="absolute top-[22px] left-1/2 -translate-x-1/2 bg-[#0b1020] border border-slate-700 text-white py-1 px-3 text-[10px] rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-2xl scale-95 group-hover/node:scale-100 pointer-events-none">
                      <span className="font-bold">{isAr ? node.city_ar : node.city_en}</span>
                      <span className="block font-mono text-[#00F0FF]">Ping: {node.currentLatency} ms</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instruction footnote inside map */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 active-ping">
                <MousePointerClick className="w-3.5 h-3.5 text-cyan-400 rotate-12" />
                {isAr ? "انقر على النقاط لمطابقة البينج الفعلي" : "Click server coordinates above to calibrate path"}
              </span>
              <span>GEO_ACCURACY_COORD: 99.8%</span>
            </div>
          </div>

          {/* Calibrator Panel (4 columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#0b1020]/65 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-mono text-[#7B61FF] uppercase tracking-widest font-black">// TARGET CALIBRATION Cockpit</span>
                <Clock className="w-4 h-4 text-[#7B61FF]" />
              </div>

              {/* Status Indicator */}
              <div className="bg-[#030712]/50 border border-slate-800/80 rounded-2xl p-5 mb-6 space-y-4">
                <div className="text-right sm:text-left rtl:sm:text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-mono">{isAr ? "الخادم المحدد للمطابقة" : "Current Target Server Node"}</span>
                  <span className="text-lg font-bold text-white tracking-tight">{isAr ? selectedNodeObj.city_ar : selectedNodeObj.city_en}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0b1020]/75 border border-slate-900/90 rounded-xl p-3 text-center">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">BETA_PING</span>
                    <span className="text-xl font-mono font-black text-[#00F0FF]">{selectedNodeObj.currentLatency} <span className="text-[10px] font-normal">ms</span></span>
                  </div>
                  <div className="bg-[#0b1020]/75 border border-slate-900/90 rounded-xl p-3 text-center">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">HUB_REGION</span>
                    <span className="text-xl font-mono font-black text-[#00FFA3]">{selectedNodeObj.country}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900/80">
                  <span className="text-[10px] text-slate-400 font-mono leading-relaxed block">
                    {isAr ? "دقة زمن الإرسال التقديري:" : "Route Jitter Prediction:"} <strong className="text-[#00FFA3]">{(Math.random() * 2 + 1).toFixed(1)} ms Jitter Scale</strong>
                  </span>
                </div>
              </div>

              {/* Local Optimization Toggles */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-slate-400 font-mono block mb-2">{isAr ? "١. خوادم الـ DNS المفضلة المدمجة" : "1. Intelligent DNS Resolver"}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setDnsMode("default"); FutureSoundEngine.playTick(); }}
                      className={`py-2 rounded-lg text-[10px] font-bold font-mono border transition-all ${dnsMode === "default" ? "bg-slate-900 text-white border-slate-700" : "bg-[#030712]/30 text-slate-500 border-slate-900/60 hover:border-slate-805"}`}
                    >
                      DEFAULT
                    </button>
                    <button
                      onClick={() => { setDnsMode("cloudflare"); FutureSoundEngine.playTick(); }}
                      className={`py-2 rounded-lg text-[10px] font-bold font-mono border transition-all ${dnsMode === "cloudflare" ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]" : "bg-[#030712]/30 text-slate-500 border-slate-900/60 hover:border-slate-805"}`}
                    >
                      CLOUDFLARE
                    </button>
                    <button
                      onClick={() => { setDnsMode("google"); FutureSoundEngine.playTick(); }}
                      className={`py-2 rounded-lg text-[10px] font-bold font-mono border transition-all ${dnsMode === "google" ? "bg-[#7B61FF]/15 text-[#7B61FF] border-[#7B61FF]/40 shadow-[0_0_15px_rgba(123,97,255,0.1)]" : "bg-[#030712]/30 text-slate-500 border-slate-900/60 hover:border-slate-805"}`}
                    >
                      GOOGLE
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-400 font-mono">{isAr ? "٢. تقنية المسار الموازي الخاص" : "2. Private Tunnel Router"}</label>
                    <span className="text-[10px] text-cyan-400 font-mono">{-12} ms</span>
                  </div>
                  <button
                    onClick={() => { setTunnelEnabled(!tunnelEnabled); FutureSoundEngine.playToggle(); }}
                    className={`w-full py-3 rounded-xl text-xs font-mono font-bold border transition-all flex justify-between px-4 items-center ${tunnelEnabled ? "bg-[#00FFA3]/15 text-[#00FFA3] border-[#00FFA3]/40 shadow-[0_0_15px_rgba(0,255,163,0.1)]" : "bg-[#030712]/30 text-slate-400 border-slate-900/60 hover:border-slate-805"}`}
                  >
                    <span>{isAr ? "تفعيل بروتوكول تجاوز خنق المعالجة" : "BYPASS ISP LIMIT RANGE"}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${tunnelEnabled ? "bg-[#00FFA3] animate-pulse" : "bg-slate-700"}`}></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Run Optimizer Button */}
            <div className="space-y-3">
              <div className="bg-[#030712]/30 rounded-xl p-3 border border-slate-900/60 flex items-center gap-3">
                <div className="shrink-0 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {telemetryMessage}
                </div>
              </div>

              <button
                onClick={handleTriggerOptimization}
                disabled={optimizing}
                className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#7B61FF] to-[#00F0FF] text-white font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(123,97,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Activity className={`w-4 h-4 ${optimizing ? 'animate-spin' : ''}`} />
                <span>{optimizing ? (isAr ? "يجري تحسين الاتصال..." : "TUNING SYSTEM CHANNELS...") : (isAr ? "تحفيز وإصلاح الاتصال الفوري" : "CALIBRATE CONNECTION SYSTEM")}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Cloud & Telemetry Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 animate-fade-in" id="stats-strip">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, i) => {
            let topBorderGlow = "from-[#00F0FF]";
            if (i === 1) topBorderGlow = "from-[#7B61FF]";
            if (i === 3) topBorderGlow = "from-[#00FFA3]";
            
            return (
              <div key={i} className="bg-[#0b1020]/50 border border-slate-900/60 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group hover:border-[#00F0FF]/30 transition-all duration-300">
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${topBorderGlow} to-transparent opacity-80`}></div>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white hover:text-[#00F0FF] transition-colors duration-200 block mb-2 tracking-tight">
                  {st.value}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block leading-relaxed">
                  {language === "ar" ? st.label_ar : st.label_en}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cyberpunk Key Features section redesign */}
      <section className="bg-[#030712]/20 border-y border-slate-800/40 py-24 relative z-20" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20" id="features-header">
            <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-2 font-bold">
              ⚡ // SCIENTIFIC COGNITIVE SERVICES
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              {t.featuresTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" id="home-features-grid">
            
            {/* FEATURE 1: REAL-TIME GAUGING */}
            <div className="bg-[#0b1020]/50 border border-slate-900 hover:border-[#00F0FF]/40 rounded-3xl p-8 transition-all duration-300 relative group overflow-hidden shadow-lg" id="feat-card-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#00F0FF]/10 transition-all"></div>
              <div className="inline-flex p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[#00F0FF] mb-8 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">
                {t.feat1Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat1Desc}
              </p>
            </div>

            {/* FEATURE 2: AI COGNITIVE AGENT */}
            <div className="bg-[#0b1020]/50 border border-slate-900 hover:border-[#7B61FF]/40 rounded-3xl p-8 transition-all duration-300 relative group overflow-hidden shadow-lg" id="feat-card-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7B61FF]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#7B61FF]/10 transition-all"></div>
              <div className="inline-flex p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[#7B61FF] mb-8 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">
                {t.feat2Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat2Desc}
              </p>
            </div>

            {/* FEATURE 3: VPN OPTIMIZED TUNNELING */}
            <div className="bg-[#0b1020]/50 border border-slate-900 hover:border-[#00FFA3]/40 rounded-3xl p-8 transition-all duration-300 relative group overflow-hidden shadow-lg" id="feat-card-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFA3]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#00FFA3]/10 transition-all"></div>
              <div className="inline-flex p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[#00FFA3] mb-8 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">
                {t.feat3Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat3Desc}
              </p>
            </div>

            {/* FEATURE 4: 10GBPS REMOTE VPS WORK */}
            <div className="bg-[#0b1020]/50 border border-slate-900 hover:border-amber-500/30 rounded-3xl p-8 transition-all duration-300 relative group overflow-hidden shadow-lg" id="feat-card-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-all"></div>
              <div className="inline-flex p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-amber-500 mb-8 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">
                {t.feat4Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat4Desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Affiliate Recommendation Bento Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 animate-fade-in" id="affiliate-banners-section">
        
        <div className="absolute top-[25%] left-1/3 w-80 h-80 bg-[#00F0FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-2 font-black">
            🚀 // WORLD-CLASS NETWORKING PARTNERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t.affiliateSectionTitle}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.affiliateSectionSubtitle}
          </p>
        </div>

        {/* Premium Redesigned Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-vpns-grid">
          {featuredVpns.map((vpn, idx) => {
            let badgeStyle = "bg-blue-950/80 text-[#00F0FF] border border-[#00F0FF]/30";
            let hoverGlow = "hover:shadow-[0_0_35px_rgba(0,240,255,0.22)] hover:border-[#00F0FF]/40";
            let keyMeterColor = "bg-[#00F0FF]";
            let keyStrength_en = "General Gaming & Guard Protocol";
            let keyStrength_ar = "بروتوكول تحسين الألعاب والحماية العام";

            if (vpn.id === "nordvpn") {
              badgeStyle = "bg-sky-950/80 text-[#00F0FF] border border-[#00F0FF]/30 hover:border-[#00F0FF]/60";
              hoverGlow = "hover:shadow-[0_0_35px_rgba(0,240,255,0.22)] hover:border-[#00F0FF]/40";
              keyMeterColor = "bg-[#00F0FF]";
              keyStrength_en = "97.4 Mbps speed score";
              keyStrength_ar = "سرعة تصفح فائقة 97.4 ميجابت";
            } else if (vpn.id === "expressvpn") {
              badgeStyle = "bg-[#7B61FF]/20 text-[#7B61FF] border border-[#7B61FF]/30 hover:border-[#7B61FF]/60";
              hoverGlow = "hover:shadow-[0_0_35px_rgba(123,97,255,0.22)] hover:border-[#7B61FF]/40";
              keyMeterColor = "bg-[#7B61FF]";
              keyStrength_en = "Low-lag, Lightway Engine";
              keyStrength_ar = "محرك Lightway ذو الموثوقية العالية للألعاب السريعة";
            } else if (vpn.id === "surfshark") {
              badgeStyle = "bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/30 hover:border-[#00FFA3]/60";
              hoverGlow = "hover:shadow-[0_0_35px_rgba(0,255,163,0.18)] hover:border-[#00FFA3]/40";
              keyMeterColor = "bg-[#00FFA3]";
              keyStrength_en = "Unlimited parallel channels";
              keyStrength_ar = "صلاحية عائلية بلا حدود لمختلف الأجهزة";
            }

            return (
              <div 
                key={vpn.id}
                className={`bg-[#0b1020]/50 border border-slate-900 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 group relative text-right sm:text-left rtl:sm:text-right overflow-hidden shadow-lg ${hoverGlow}`}
                id={`vpn-promo-${vpn.id}`}
              >
                {/* Glowing neon top stripe */}
                <div className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${vpn.logoColorClassName} opacity-80`}></div>

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs text-slate-500 font-bold">#0{idx+1} CERTIFIED</span>
                    <span className={`text-[10px] font-mono px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest ${badgeStyle}`}>
                      {language === "ar" ? vpn.badge_ar : vpn.badge_en}
                    </span>
                  </div>

                  {/* Name with an icon badge */}
                  <div className="flex items-center gap-2.5 justify-start sm:justify-start rtl:sm:justify-start mb-2">
                    <Award className="w-5 h-5 text-[#00FFA3]" />
                    <h3 className="text-2xl font-black text-white group-hover:text-[#00F0FF] transition-colors tracking-tight">
                      {vpn.name}
                    </h3>
                  </div>

                  {/* Pricing Matrix with a cool pill badge */}
                  <div className="my-5 flex items-baseline gap-2.5 justify-start">
                    <span className="text-3xl font-mono font-black text-[#00FFA3]">{vpn.price}</span>
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">/ SPECIAL AFFILIATE REBATE</span>
                  </div>

                  {/* Technical Dial Rating */}
                  <div className="bg-[#030712]/45 border border-slate-900/80 rounded-2xl p-4 my-5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                      <span>{isAr ? "نقاط الاعتماد الفنية" : "TELEMETRY EVALUATION"}</span>
                      <span className="text-white font-black">{vpn.rating} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0b1020] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${keyMeterColor} shadow-[0_0_8px_currentColor]`} style={{ width: `${vpn.rating * 20}%` }}></div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 leading-none pt-1">
                      {isAr ? `✓ تم المطابقة: ${keyStrength_ar}` : `✓ Matches: ${keyStrength_en}`}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                    {language === "ar" ? vpn.description_ar : vpn.description_en}
                  </p>
                </div>

                {/* Promotional button with glowing sweep effect */}
                <div className="mt-6 pt-5 border-t border-slate-900 flex flex-col sm:flex-row gap-3">
                  <a
                    href={vpn.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`home-vpn-offer-btn-${vpn.id}`}
                    className="w-full inline-flex justify-center items-center py-4.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-slate-900 to-[#030712] hover:from-[#00F0FF]/15 hover:to-[#00F0FF]/5 text-[#00F0FF] border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 text-center transition-all duration-300 cursor-pointer shadow-inner shadow-[#00F0FF]/5"
                  >
                    <span>{t.getOffer}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom comparative comparative service navigation button */}
        <div className="mt-14 text-center">
          <button 
            onClick={() => setCurrentPage("vpn")}
            id="vpn-view-all-offers-btn"
            className="inline-flex items-center space-x-3 rlt:space-x-reverse px-8 py-4.5 rounded-xl bg-[#0b1020]/95 hover:bg-[#030712] border border-[#00F0FF]/30 hover:border-[#00FFA3] text-[#00F0FF] hover:text-[#00FFA3] text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg hover:scale-105"
          >
            <span>{isAr ? "استعرض وقارن جميع الشركاء والميزات الحصرية لعام ٢٠٢٦" : "Compare & View All Partner VPNs"}</span>
            {isAr ? <ArrowLeft className="w-4 h-4 text-cyan-400" /> : <ArrowRight className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

      </section>

    </div>
  );
}
