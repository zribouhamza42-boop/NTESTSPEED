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
  Search, 
  Sliders, 
  Flame, 
  RefreshCw,
  CpuIcon,
  CheckCircle,
  Hash,
  Compass,
  Laptop
} from "lucide-react";
import SpeedTest from "./SpeedTest";
import { FutureParticleSystem, CyberTelemetryWidget, FutureSoundEngine } from "./FutureAmbiance";

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

  // --- SIMULATED REAL-TIME CLOUD NODES ---
  const [nodes, setNodes] = useState<ServerNode[]>([
    { id: "tokyo", city_ar: "طوكيو", city_en: "Tokyo", country: "JP", baseLatency: 120, currentLatency: 120, status: 'optimal' },
    { id: "cairo", city_ar: "القاهرة", city_en: "Cairo", country: "EG", baseLatency: 14, currentLatency: 14, status: 'optimal' },
    { id: "london", city_ar: "لندن", city_en: "London", country: "UK", baseLatency: 55, currentLatency: 55, status: 'optimal' },
    { id: "frankfurt", city_ar: "فرانكفورت", city_en: "Frankfurt", country: "DE", baseLatency: 48, currentLatency: 48, status: 'optimal' },
    { id: "silicon", city_ar: "وادي السيليكون", city_en: "Silicon Valley", country: "US", baseLatency: 165, currentLatency: 165, status: 'optimal' }
  ]);

  // Noise simulation for cloud node latencies
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes(prev => prev.map(n => {
        // Base delay modifications from active optimizations
        let modifier = 0;
        if (dnsMode === 'cloudflare') modifier -= 8;
        if (dnsMode === 'google') modifier -= 5;
        if (tunnelEnabled) modifier -= 12;

        const noise = Math.floor(Math.random() * 7) - 3; // -3 to +3 jitter
        const target = Math.max(2, n.baseLatency + modifier + noise);
        
        let nodeStatus: 'optimal' | 'warning' | 'throttled' = 'optimal';
        if (target > 100) nodeStatus = 'warning';
        if (target > 200) nodeStatus = 'throttled';

        return {
          ...n,
          currentLatency: target,
          status: nodeStatus
        };
      }));
    }, 1500);
    return () => clearInterval(timer);
  }, [dnsMode, tunnelEnabled]);

  // --- DYNAMIC AI DIAGNOSTIC STATE GENERATOR ---
  const handleTriggerOptimization = () => {
    if (optimizing) return;
    setOptimizing(true);
    FutureSoundEngine.playScan();
    setTelemetryMessage(isAr ? "يجري تهيئة مسارات الألياف الضوئية البديلة..." : "Initializing fiber-optic alternate routing...");
    
    setTimeout(() => {
      FutureSoundEngine.playTick();
      setTelemetryMessage(isAr ? "تنظيف مخازن التحميل التراكمية وسجلات التوجيه..." : "Flushing local cumulative payload buffers...");
      setOptimizationScore(125);
    }, 1200);

    setTimeout(() => {
      FutureSoundEngine.playSuccess();
      setTelemetryMessage(isAr ? "تم إعادة تخصيص حزم البيانات بنجاح بنسبة ثبات 99.8%" : "Data packets re-routed successfully (99.8% Stability Curve)");
      setOptimizing(false);
      setOptimizationScore(140);
    }, 2500);
  };

  const handleFlushBuffer = () => {
    if (bufferStatus === 'cleaning') return;
    setBufferStatus('cleaning');
    FutureSoundEngine.playScan();
    setTelemetryMessage(isAr ? "يجري مسح مخزن الذاكرة التراكمي للإنترنت..." : "Clearing global cache backlog & local physical queues...");
    
    setTimeout(() => {
      FutureSoundEngine.playSuccess();
      setBufferStatus('flushed');
      setTelemetryMessage(isAr ? "تم إخلاء 248 ميجابايت من البيانات المتراكمة بالراوتر!" : "Flushed 248MB of socket queue garbage from router!");
    }, 1800);
  };

  const featuredVpns = VPN_OFFERS_DATA.slice(0, 3);

  const stats = [
    { label_en: "Active Network Scans", label_ar: "عمليات الفحص النشطة", value: "1,429,510" },
    { label_en: "Average Jitter Reduction", label_ar: "متوسط خفض تذبذب الإشارة", value: "34.2 ms" },
    { label_en: "Clean Bypassed IPs", label_ar: "عناوين آمنة ومتخطية للحظر", value: "48,102" },
    { label_en: "Network Integrity Score", label_ar: "مؤشر سلامة الشبكة الإجمالي", value: "98.9%" }
  ];

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden" id="home-page-container">
      
      {/* BACKGROUND GRAPH ELEMENTS (Cyberpunk ambiance) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-0">
        <FutureParticleSystem />
        <div className="absolute inset-x-0 top-0 h-[800px] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/10 to-blue-500/10 blur-[130px] rounded-full opacity-60"></div>
        <div className="absolute top-[60vh] left-10 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full opacity-50"></div>
      </div>

      {/* Cyberpunk Scanner Top Line Decoration */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-500 animate-pulse pointer-events-none z-10"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-8" id="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Cybernetic Badge */}
          <div className="inline-flex items-center space-x-2.5 rtl:space-x-reverse px-4 py-2 rounded-full bg-slate-900/40 border border-cyan-500/30 text-[11px] text-cyan-400 font-mono mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]" id="hero-badge">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>{isAr ? "نظام التشخيص الفوري والتحفيز الذكي للإنترنت ٢٠٢٦" : "AI NETWORK COGNITIVE DIAGNOSTICS & OPTIMIZER 2026"}</span>
          </div>

          {/* Epic Cyber Display Heading */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight leading-[1.1] mb-6 drop-shadow-sm max-w-5xl mx-auto"
            id="hero-title"
          >
            {isAr ? (
              <>
                شخّص اتصالك بالذكاء الاصطناعي وامنح <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">سرعتك طاقة خارقة ⚡</span>
              </>
            ) : (
              <>
                Diagnose Internet Speed & Optimize Core Connection with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">SaaS AI</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-sm sm:text-base md:text-lg text-slate-400 max-w-4xl mx-auto mb-10 leading-relaxed font-normal font-sans"
            id="hero-description"
          >
            {isAr ? (
              "يقوم نظام التحليل بتمشيط مسارات الاتصال الفعلي، تتبع تذبذبات زمن الاستجابة، دمج أجهزة الاختبار الدقيقة، وتوفير كتل إصلاح سحابية بالتعاون مع أفضل مزودي الـ VPN والـ RDP لتجاوز خنق السرعة الإقليمي بنقرة واحدة."
            ) : (
              "Cognitive fiber telemetry scans routing corridors, flags bottleneck drops dynamically, implements hyper-DNS tunnels, and links you with certified high-speed VPN & RDP layers to restore seamless gaming & ultra-high fidelity streaming."
            )}
          </p>

          {/* Interactive Live Speed Gauge & Commands Cockpit Embedded */}
          <div 
            className="relative max-w-4xl mx-auto bg-slate-950/70 border border-slate-900/90 rounded-3xl p-4 sm:p-8 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 w-full"
            id="hero-speed-gauge-embed"
          >
            {/* Holographic Glowing Orbs inside the Cockpit */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full"></div>

            {/* Core Speed Test Widget (Centered & Polished) */}
            <div className="w-full bg-slate-900/20 border border-slate-900/60 rounded-2xl p-2 sm:p-6 backdrop-blur-xl relative animate-fade-in">
              
              {/* Terminal Frame Decor */}
              <div className="absolute top-3 left-4 flex space-x-1.5 rtl:space-x-reverse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/40"></span>
              </div>
              <div className="absolute top-3 right-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                COGNITIVE_SOCKET_CORE
              </div>

              <div className="pt-4">
                <SpeedTest 
                  language={language}
                  onTestComplete={onTestComplete}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>

          {/* Quick Trigger CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto mt-12 relative z-10" id="hero-actions">
            <button
              onClick={() => setCurrentPage("speedtest")}
              id="hero-primary-cta"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-950/40 hover:shadow-cyan-950/60 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2.5 rtl:space-x-reverse"
            >
              <span>{t.ctaStartTest}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentPage("how-it-works")}
              id="hero-secondary-cta"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-950 border border-slate-900 hover:bg-slate-900 hover:border-slate-800 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
          </div>

        </div>
      </section>

      {/* Cloud & Telemetry Integrations Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="stats-strip">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div key={i} className="bg-slate-950/60 border border-slate-900/60 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-transparent opacity-40"></div>
              <span className="text-2xl sm:text-3xl font-mono font-black text-white hover:text-cyan-400 transition-colors duration-200 block mb-1">
                {st.value}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {language === "ar" ? st.label_ar : st.label_en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Panel */}
      <section className="bg-slate-950/20 border-y border-slate-900/40 py-24 relative" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16" id="features-header">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1.5">
              // TELEMETRY CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {t.featuresTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="home-features-grid">
            
            {/* FEATURE 1: REAL-TIME GAUGING */}
            <div className="bg-slate-950 border border-slate-900 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden shadow-lg select-text text-right sm:text-left rtl:sm:text-right" id="feat-card-0">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all"></div>
              <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2 font-sans">
                {t.feat1Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat1Desc}
              </p>
            </div>

            {/* FEATURE 2: AI COGNITIVE AGENT */}
            <div className="bg-slate-950 border border-slate-900 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden shadow-lg select-text text-right sm:text-left rtl:sm:text-right" id="feat-card-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-all"></div>
              <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2 font-sans">
                {t.feat2Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat2Desc}
              </p>
            </div>

            {/* FEATURE 3: VPN OPTIMIZED TUNNELING */}
            <div className="bg-slate-950 border border-slate-900 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden shadow-lg select-text text-right sm:text-left rtl:sm:text-right" id="feat-card-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
              <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2 font-sans">
                {t.feat3Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat3Desc}
              </p>
            </div>

            {/* FEATURE 4: 10GBPS REMOTE VPS WORK */}
            <div className="bg-slate-950 border border-slate-900 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden shadow-lg select-text text-right sm:text-left rtl:sm:text-right" id="feat-card-3">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-all"></div>
              <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2 font-sans">
                {t.feat4Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t.feat4Desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Featured VPN Affiliate Recommendation Bento Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="affiliate-banners-section">
        
        <div className="absolute -top-10 left-1/3 w-72 h-72 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            🚀 // EXCLUSIVE CYBER AFFILIATE REBATES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {t.affiliateSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t.affiliateSectionSubtitle}
          </p>
        </div>

        {/* Bento Grid layout with distinct customized theme styling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="home-vpns-grid">
          {featuredVpns.map((vpn, idx) => {
            let badgeStyle = "bg-blue-950/80 text-blue-400 border border-blue-900/60";
            let hoverGlow = "hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-cyan-500/30";
            let keyMeterColor = "bg-cyan-500";
            let keyStrength_en = "General Protection Protocol";
            let keyStrength_ar = "بروتوكول الحماية العام";

            if (vpn.id === "nordvpn") {
              badgeStyle = "bg-sky-950/80 text-sky-400 border border-sky-900/60";
              hoverGlow = "hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:border-sky-500/30";
              keyMeterColor = "bg-sky-400";
              keyStrength_en = "97.4 Mbps speed score";
              keyStrength_ar = "سرعة تصفح فائقة ٩٧.٤ ميجابت";
            } else if (vpn.id === "expressvpn") {
              badgeStyle = "bg-red-950/80 text-red-400 border border-red-900/60";
              hoverGlow = "hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-500/30";
              keyMeterColor = "bg-rose-500";
              keyStrength_en = "Low-lag, Lightway Engine";
              keyStrength_ar = "محرك Lightway للألعاب السريعة";
            } else if (vpn.id === "surfshark") {
              badgeStyle = "bg-emerald-950/80 text-emerald-400 border border-emerald-900/60";
              hoverGlow = "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30";
              keyMeterColor = "bg-emerald-500";
              keyStrength_en = "Unlimited parallel streams";
              keyStrength_ar = "صلاحية عائلية بلا حدود للأجهزة";
            }

            return (
              <div 
                key={vpn.id}
                className={`bg-slate-950 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group relative text-right sm:text-left rtl:sm:text-right overflow-hidden ${hoverGlow}`}
                id={`vpn-promo-${vpn.id}`}
              >
                {/* Neon Top Bar accent */}
                <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${vpn.logoColorClassName} opacity-70`}></div>

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-sm tracking-tight text-slate-500 font-bold">#0{idx+1}</span>
                    <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-widest ${badgeStyle}`}>
                      {language === "ar" ? vpn.badge_ar : vpn.badge_en}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight mb-2">
                    {vpn.name}
                  </h3>

                  {/* Pricing Matrix */}
                  <div className="my-4 pt-1 flex items-baseline gap-2 justify-start sm:justify-start rtl:sm:justify-start">
                    <span className="text-3xl font-mono font-black text-emerald-400">{vpn.price}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest">/ EXCLUSIVE CYBER SPECIAL</span>
                  </div>

                  {/* Specific Dial/Meter inside Bento for Cybearpunk UI */}
                  <div className="bg-slate-900/30 border border-slate-900/80 rounded-2xl p-4 my-4 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                      <span>{isAr ? "درجة التقييم الفني" : "DIAGNOSTICS RATING"}</span>
                      <span className="text-white">{vpn.rating} / 5</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950/85 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${keyMeterColor}`} style={{ width: `${vpn.rating * 20}%` }}></div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 leading-none pt-1">
                      {isAr ? `✓ تم المطابقة: ${keyStrength_ar}` : `✓ Match core: ${keyStrength_en}`}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-3">
                    {language === "ar" ? vpn.description_ar : vpn.description_en}
                  </p>
                </div>

                {/* Exclusive partner coupon action button */}
                <div className="mt-6 pt-5 border-t border-slate-900 flex flex-col sm:flex-row gap-3">
                  <a
                    href={vpn.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`home-vpn-offer-btn-${vpn.id}`}
                    className="w-full inline-flex justify-center items-center py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-slate-800 hover:border-slate-700 text-center transition-all duration-200 cursor-pointer shadow-inner"
                  >
                    {t.getOffer}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outer Banner CTA block */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => setCurrentPage("vpn")}
            id="vpn-view-all-offers-btn"
            className="inline-flex items-center space-x-2.5 rtl:space-x-reverse px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span>{isAr ? "قارن جميع الخدمات والشركاء المتاحين لعام ٢٠٢٦" : "Compare & View All Partner VPNs"}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </section>

    </div>
  );
}
