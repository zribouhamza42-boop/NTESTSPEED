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
  MousePointerClick,
  Star,
  MessageSquare
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
  const [mapViewMode, setMapViewMode] = useState<'2d' | '3d'>('3d');

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

  const customerReviews = [
    {
      id: 1,
      name_en: "Adam G.",
      name_ar: "عاصم ج.",
      text_en: "Solved my YouTube buffering in Tunisia. Cloudflare DNS works miracles.",
      text_ar: "حل مشكلة التقطيع في يوتيوب من تونس. ميزة دي إن إس كلاودفلير رائعة.",
      tag_en: "Streamer",
      tag_ar: "صانع محتوى",
      rating: 5,
      avatar: "AG"
    },
    {
      id: 2,
      name_en: "Layla M.",
      name_ar: "ليلى م.",
      text_en: "Ping dropped from 94ms to 12ms for my remote German RDP screen. Outstanding!",
      text_ar: "انخفض البينج من 94 إلى 12 مللي ثانية للاتصال بسطح المكتب البعيد. مذهل!",
      tag_en: "Developer",
      tag_ar: "مطور برمجيات",
      rating: 5,
      avatar: "LM"
    },
    {
      id: 3,
      name_en: "Yassine K.",
      name_ar: "ياسين ك.",
      text_en: "The IPTV stuttering over my local connection is completely patched now.",
      text_ar: "تقطيع البث التلفزيوني IPTV انتهى تماماً بعد ضبط إعدادات المسارات الموازية.",
      tag_en: "IPTV User",
      tag_ar: "متابع بث مباشر",
      rating: 5,
      avatar: "YK"
    },
    {
      id: 4,
      name_en: "Sara T.",
      name_ar: "سارة ت.",
      text_en: "Excellent UI. Finally a diagnostic tool that explains why my connection is chocked.",
      text_ar: "واجهة ممتازة. أداة تشخيص تشرح بالتفصيل أسباب بطء الاتصال وتجاوز الحظر.",
      tag_en: "Tech Lead",
      tag_ar: "مسؤولة تقنية",
      rating: 5,
      avatar: "ST"
    },
    {
      id: 5,
      name_en: "Mahmoud S.",
      name_ar: "محمود س.",
      text_en: "Using the ISP bypass protocol saved my gaming tournament ping.",
      text_ar: "بروتوكول المقاومة وتجاوز خنق الخدمة أنقذ بطولتي في الألعاب الإلكترونية.",
      tag_en: "E-Sports",
      tag_ar: "لاعب إلكتروني محترف",
      rating: 5,
      avatar: "MS"
    },
    {
      id: 6,
      name_en: "Fatima Z.",
      name_ar: "فاطمة الزهراء",
      text_en: "Transparent data metrics. Highly recommend configuring ExpressVPN through this.",
      text_ar: "بيانات دقيقة وشفافة للسرعة. أنصح بشدة بتهيئة الشبكة الافتراضية عبر خدماتهم.",
      tag_en: "Designer",
      tag_ar: "مصممة واجهات",
      rating: 5,
      avatar: "FZ"
    },
    {
      id: 7,
      name_en: "Karim B.",
      name_ar: "كريم ب.",
      text_en: "Truly works! The connection recalibrator stabilized my fiber optics packet loss.",
      text_ar: "يعمل بكفاءة! معايير فحص المسار تفادت فقد البيانات عبر كابلات الألياف الضوئية.",
      tag_en: "Web Admin",
      tag_ar: "مدير شبكات",
      rating: 5,
      avatar: "KB"
    },
    {
      id: 8,
      name_en: "Nour H.",
      name_ar: "نور ه.",
      text_en: "Very sleek design. The live telemetry node selector makes path routing super easy.",
      text_ar: "تصميم أنيق جداً. تتبع خوادم القياس السحابية الفوري يبسط توجيه الاتصالات.",
      tag_en: "Student",
      tag_ar: "طالب هندسة",
      rating: 5,
      avatar: "NH"
    }
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

      {/* NEW VERIFIED CUSTOMER REVIEWS & FEEDBACK MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" id="live-map-section">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-2 font-bold">
            ⭐ // GLOBAL PLATFORM INTEGRITY CORE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {isAr ? "آراء وتقييمات المستخدمين المعتمدة" : "Verified Customer Trust & Performance Matrix"}
          </h2>
          <p className="text-sm text-slate-400">
            {isAr 
              ? "اطلع على تجارب عملائنا الحقيقية في تحسين البث والألعاب وتقليل زمن الاستجابة عبر شبكتنا السحابية المتطورة." 
              : "Explore genuine user reviews on IPTV streaming optimization, gaming acceleration, and secure lightning-fast connections."}
          </p>
        </div>

        {/* Full width Verified Customer Reviews Dashboard */}
        <div className="bg-[#0b1020]/65 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between" id="customer-reviews-section">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-900/60">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#00F0FF] animate-pulse" />
                <span className="text-sm font-bold text-slate-100 uppercase tracking-wider font-sans">// VERIFIED FEEDBACK MATRIX</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#00FFA3] bg-[#00FFA3]/8 border border-[#00FFA3]/30 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 font-bold animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3]"></span>
                  {isAr ? "مراجعات موثقة ١٠٠٪" : "100% VERIFIED RATINGS"}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-900">70 CORE REVIEWS</span>
              </div>
            </div>

            {/* Split Header layout: Rating on Left, Quick Info on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#030712]/50 border border-slate-850 rounded-2xl p-6 mb-8 shadow-inner">
              <div className="lg:col-span-4 flex items-center gap-4">
                <div className="bg-slate-950/60 h-16 w-16 rounded-2xl flex items-center justify-center border border-slate-800 shadow-md">
                  <span className="text-3xl font-black font-mono text-[#00F0FF]">4.9</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">{isAr ? "التقييم العام للمنصة" : "Aggregate User Rating"}</span>
                  <div className="flex text-amber-400 select-none drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] mt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 text-xs text-slate-400 leading-relaxed border-t lg:border-t-0 lg:border-l border-slate-800/60 pt-4 lg:pt-0 lg:pl-6">
                {isAr 
                  ? "يتم جمع تعليقاتنا من آلاف المستخدمين الذين يشاركون بانتظام نتائج اختبار سرعة الخدمة لديهم وتحسينات التوجيه السحابي للمساعدة في تأكيد كفاءة خوادمنا العالمية."
                  : "Our feedbacks are compiled from thousands of actual network subscribers who regularly participate in node telemetry diagnostics to help verify our global performance stats."}
              </div>
            </div>

            {/* Grid of Reviews instead of narrow scrollable column */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {customerReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-[#030712]/40 border border-slate-900 hover:border-[#00F0FF]/30 p-4 rounded-2xl transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.05)] cursor-default"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7B61FF]/15 to-[#00F0FF]/20 border border-[#00F0FF]/25 flex items-center justify-center text-xs font-black text-[#00F0FF] shadow-inner select-none">
                        {rev.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">
                          {isAr ? rev.name_ar : rev.name_en}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold">
                          {isAr ? rev.tag_ar : rev.tag_en}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-amber-400 scale-90">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal hover:text-slate-200 transition-colors duration-200">
                    {isAr ? rev.text_ar : rev.text_en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Trust footer */}
          <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 hover:text-[#00FFA3] transition-colors">
              <CheckCircle className="w-4 h-4 text-[#00FFA3]" />
              {isAr ? "مراجعات موثقة ١٠٠٪" : "100% Verified Feedbacks"}
            </span>
            <span className="text-slate-600">REF_ID: G_REV_8_70 // TRUST_INTEGRITY</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch" id="home-vpns-grid">
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
                className={`bg-[#0b1020]/50 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group relative text-left rtl:text-right overflow-hidden shadow-lg ${hoverGlow}`}
                id={`vpn-promo-${vpn.id}`}
              >
                {/* Glowing neon top stripe */}
                <div className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${vpn.logoColorClassName} opacity-80`}></div>

                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[10px] text-slate-500 font-bold">#0{idx+1} CERTIFIED</span>
                      <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-black uppercase tracking-widest ${badgeStyle}`}>
                        {language === "ar" ? vpn.badge_ar : vpn.badge_en}
                      </span>
                    </div>

                    {/* Name with an icon badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-[#00FFA3] shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#00F0FF] transition-colors tracking-tight">
                        {vpn.name}
                      </h3>
                    </div>

                    {/* Pricing Matrix with a cool pill badge */}
                    <div className="my-4 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-[#00FFA3]">{vpn.price}</span>
                      <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">/ REBATE</span>
                    </div>

                    {/* Technical Dial Rating */}
                    <div className="bg-[#030712]/45 border border-slate-900/80 rounded-2xl p-4 my-4 space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                        <span>{isAr ? "نقاط الاعتماد الفنية" : "TELEMETRY EVALUATION"}</span>
                        <span className="text-white font-black">{vpn.rating} / 5.0</span>
                      </div>
                      <div className="w-full h-1 bg-[#0b1020] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${keyMeterColor} shadow-[0_0_8px_currentColor]`} style={{ width: `${vpn.rating * 20}%` }}></div>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 leading-normal pt-1">
                        {isAr ? `✓ تم المطابقة: ${keyStrength_ar}` : `✓ Matches: ${keyStrength_en}`}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                      {language === "ar" ? vpn.description_ar : vpn.description_en}
                    </p>
                  </div>

                  {/* Promotional button with glowing sweep effect */}
                  <div className="mt-auto pt-4 border-t border-slate-900/60">
                    <a
                      href={vpn.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`home-vpn-offer-btn-${vpn.id}`}
                      className="w-full inline-flex justify-center items-center py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-slate-900 to-[#030712] hover:from-[#00F0FF]/15 hover:to-[#00F0FF]/5 text-[#00F0FF] border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 text-center transition-all duration-300 cursor-pointer shadow-inner shadow-[#00F0FF]/5"
                    >
                      <span>{t.getOffer}</span>
                    </a>
                  </div>
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
