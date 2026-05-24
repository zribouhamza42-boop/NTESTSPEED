import React, { useState } from "react";
import { PageId, Language, Article } from "../types";
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowLeft, 
  ShieldAlert, 
  Wifi, 
  Cpu, 
  Zap, 
  Globe, 
  ChevronRight, 
  ChevronLeft,
  Server,
  ArrowRight
} from "lucide-react";

interface BlogProps {
  language: Language;
  setCurrentPage: (page: PageId) => void;
  articles?: Article[];
}

const ICON_MAP = {
  ShieldAlert,
  Zap,
  Server,
  BookOpen
};

const ARTICLES: Article[] = [
  {
    id: "isp-throttling",
    title_ar: "خنق سرعة الإنترنت من شركات الاتصالات: هل تبطئ شركتك اتصالك عمداً؟",
    title_en: "ISP Throttling Exposed: Is Your Provider Secretly Slowing You Down?",
    summary_ar: "تعرف على أساليب كشف قيود وخنق السرعة لمقاطع الفيديو والألعاب من قبل مزودي الخدمة المحليين والخطوات المجانية لتجاوزها تماًما.",
    summary_en: "Learn how internet service providers throttle bandwidth for video streaming or gaming, how to detect it, and free configuration tricks to bypass filters.",
    category_ar: "تشخيص وحلول للسرعة",
    category_en: "Diagnostics & Speed",
    readTime_ar: "قراءة في 5 دقائق",
    readTime_en: "5 min read",
    date_ar: "٢٤ مايو ٢٠٢٦",
    date_en: "May 24, 2026",
    author: "د. عبد السلام (مهندس شبكات)",
    iconName: "ShieldAlert",
    accentColor: "from-amber-500 to-orange-600",
    ctaText_ar: "استعرض عروض الـ VPN الشريكة لتجاوز الاختناق",
    ctaText_en: "Browse VPN Deals to Bypass Throttling",
    ctaTarget: "vpn",
    paragraphs: [
      {
        type: "highlight",
        title_ar: "ما هو خنق الإنترنت (ISP Throttling)؟",
        title_en: "What Is ISP Bandwidth Throttling?",
        content_ar: "خنق سرعة الإنترنت هو إبطاء متعمد من قبل مزود خدمة الإنترنت (ISP) لنطاق ترددك الترددي (Bandwidth) بناءً على ما تقوم بعمله عبر الإنترنت. إذا كنت تشاهد نيتفليكس، أو تقوم باللعب عبر الإنترنت، أو تقوم بتحميل ملفات ضخمة، فقد يكتشف مزود الخدمة طبيعة هذه البيانات ويقوم بفرض قيود لإجبارك على ترقية باقتك أو لتخفيف الضغط على خوادمه المحلية.",
        content_en: "ISP throttling is the deliberate slowing of your internet connection by your provider based on your active traffic type. If you are streaming Ultra-HD video, downloading large assets, or playing real-time games, raw deep packet inspection (DPI) allows your ISP to throttle those activities to ease local grid loads or pressure you into buying pricier tiers."
      },
      {
        type: "text",
        title_ar: "كيف تعرف دائمًا أنك تتعرض للخنق؟",
        title_en: "How to Detect if Your ISP is Throttling Your Speed?",
        content_ar: "المؤشر الأبرز هو 'التناقض في معدل السرعة'. إذا كانت أداة قياس سرعة الإنترنت لدينا تظهر سرعة تحميل ممتازة (مثلاً 50 ميجابت)، ولكن عند فتح مقطع فيديو بدقة 4K يبدأ المتصفح بالتعليق المتكرر ومحاولة التخزين المستمر (Buffering)، فهذا دليل قطعي على أن مزود الخدمة يمنح أولوية للسرعات الظاهرية في اختبارات السرعة، بينما يفرض قيودًا تضييقية على منصات البث الخاصة والمستهدفة.",
        content_en: "The clearest indicator is 'Speed Inconsistency'. If our interactive Speed Test gauge registers an excellent rating (e.g., 80 Mbps), but direct YouTube, Netflix, or video platform streams buffer repeatedly at high definitions, your ISP likely uses rules that prioritize speedtest packets while dynamically choking heavy continuous transport tunnels."
      },
      {
        type: "bullets",
        title_ar: "ثلاث خطوات عملية وبسيطة للتغلب على خنق السرعة مجانًا:",
        title_en: "Three Hands-on Methods to Bypass ISP Throttling:",
        content_ar: [
          "تحديث خوادم الـ DNS المحلية: توقف عن استخدام خوادم الشركة الافتراضية، وقم بالتحول فورًا لخوادم سريعة ومحايدة مثل Cloudflare (1.1.1.1) أو Google (8.8.8.8) لحماية استعلامات أسماء النطاقات.",
          "تفعيل التشفير الآمن والـ VPN: يقوم الـ VPN بتعمية وتشفير كامل مسارات تصفحك. لن يعود بإمكان مزود الخدمة قراءة طبيعة حزم البيانات؛ وبالتالي لن يستطيع خنق تصفحك تلقائيًا لأنه يراها كأحرف غامضة متصلة بخادم ترحيل مشفر.",
          "تبديل ترددات الواي فاي للراوتر: يفضل دائماً استخدام تردد 5GHz بدلاً من 2.4GHz لتقليل تداخل الإشارات اللاسلكية مع الجيران."
        ],
        content_en: [
          "Upgrade Local DNS Mappings: Re-route configuration from sluggish default ISP DNS nodes to blazing options like Cloudflare (1.1.1.1) or Google Public DNS (8.8.8.8) to conceal domain lookup queries.",
          "Employ Secure Encrypted VPN tunnels: High-grade VPN wrappers encrypt all digital traffic. Since your provider can no longer analyze what packets correspond to (gaming, messaging, streaming), their automated rules engines fail to trigger selective throttling protocols.",
          "Shift to 5GHz Router Spectrum: Reduce physical interference in high-density areas by utilizing 5GHz router bands over crowded 2.4GHz slots."
        ]
      },
      {
        type: "config",
        title_ar: "تكوين DNS فائق السرعة المقترح للراوتر أو جهازك (نظام Cloudflare):",
        title_en: "Recommended Ultra-Fast Cloudflare DNS Configuration:",
        content_ar: "الـ DNS الأساسي (Primary): 1.1.1.1\nالـ DNS البديل (Secondary): 1.0.0.1",
        content_en: "Primary IPv4 Server Node: 1.1.1.1\nSecondary IPv4 Server Node: 1.0.0.1"
      }
    ]
  },
  {
    id: "low-ping-gaming",
    title_ar: "دليل عشاق الألعاب: كيف تخفض الـ Ping وتثبت استقرار الـ Jitter طوال اليوم؟",
    title_en: "Ultimate Gaming Guide: How to Reduce Ping and Eliminate Packet Jitter",
    summary_ar: "لماذا تواجه انقطاعات واستجابة بطيئة في الفيفا أو ببجي؟ دليل علمي مبسط لتحويل شبكتك اللاسلكية إلى قناة سريعة للألعاب.",
    summary_en: "Discover why you experience sudden lag spikes and packet dropouts in online games, and how to calibrate your setup for sub-20ms latency stability.",
    category_ar: "دليل ألعاب الشبكة",
    category_en: "Gaming & Latency",
    readTime_ar: "قراءة في 6 دقائق",
    readTime_en: "6 min read",
    date_ar: "٢٣ مايو ٢٠٢٦",
    date_en: "May 23, 2026",
    author: "م. فارس الجاسم (خبير خوادم الترفيه)",
    iconName: "Zap",
    accentColor: "from-blue-500 to-indigo-600",
    ctaText_ar: "ابدأ اختبار السرعة والألعاب الفوري",
    ctaText_en: "Test Your Gaming Connection Stats Now",
    ctaTarget: "speedtest",
    paragraphs: [
      {
        type: "text",
        title_ar: "طبيعة زمن الاستجابة (Latency) وتشتت البيانات (Jitter)",
        title_en: "Decoding Ping Latency and Packet Jitter",
        content_ar: "في مشهد الألعاب التنافسية مثل شوتر وباتل رويال، لا تهم كثيراً السرعة الخام (ميجابت بالثانية)، بل الأهم هو الـ Ping (سرعة ذهاب حزمة اللعبة لخادم الشرق الأوسط أو أوروبا والعودة). المعضلة الثانية هي Jitter (تذبذب البينج)، أي عندما يتأرجح زمن الاستجابة فجأة من 20 ملي ثانية إلى 120 ملي ثانية وهو ما يسمى 'اللاق التقطيعي' (Rubber-banding).",
        content_en: "For competitive multiplayer titles, raw downloading bandwidth matters very little. What absolutely determines match victory is latency - the round-trip delay ('Ping') for an game state update to reach the master cluster and report back. Even worse is 'Jitter' (packet arrival variance). A volatile ping jump from 30ms up to 220ms and back creates jarring telemetry hops, rendering target aiming impossible."
      },
      {
        type: "bullets",
        title_ar: "الأسباب الأكثر شيوعًا وراء تدهور بينج الألعاب المكتشفة بالتشخيص:",
        title_en: "Most Common Causes of Random Latency Volatility:",
        content_ar: [
          "توصيل الواي فاي (Wi-Fi): الإشارات اللاسلكية تخضع لاصطدام الحزم بجدران المنزل وتأثرها بموجات الأجهزة الكهربائية القريبة.",
          "نشاط الخلفية التلقائي (Buffer Bloat): عند قيام شخص آخر بالمنزل برفع صور أو تنزيل فيديوهات أثناء لعبك، يتم ملء ذاكرة تخزين المودم، مسببًا تأخيراً كبيراً لحزم الألعاب ذات الأولوية الأقل كحجم.",
          "سوء توجيه حزم مزود الخدمة (Bad ISP Routing): في كثير من الأحيان، يوجه مزود الخدمة بياناتك عبر مسارات دولية معقدة قبل وصولها لخادم اللعبة بدلاً من المسار البحري المباشر المفرد."
        ],
        content_en: [
          "Unstable Wi-Fi Multipathing: Standard wireless signals bounce off drywall, concrete slabs, and conflict directly with neighboring routers.",
          "Local Congestion (Bufferbloat): When an alternative user in your network streams HD content or backs up video catalogs while you attempt a game, your router switches resources to bulk transfer, delaying tiny crucial game telemetry frames.",
          "Suboptimal Carrier Routing (Sluggish Hops): Your locally delegated network service might propagate game packets across excessive global server exchanges instead of choosing direct marine cable paths."
        ]
      },
      {
        type: "highlight",
        title_ar: "الحل السحري: هل يفيد VPN الألعاب حقًا؟",
        title_en: "The Game-Changer: Can of a Gaming VPN Fix Your Ping?",
        content_ar: "نعم! في حالة واحدة رئيسية: إذا كان مزود الخدمة المحلي لديه توجيه سيئ ومزدحم لخوادم ألعاب فورتنايت أو فالف. تفعيل VPN مخصص ومجهر للألعاب مثل ExpressVPN يمنحك اتصالًا مباشرًا سريعًا ومستقرًا من خلال شبكة عمودية خاصة (Private Backbone Grid) مجهزة للتوصيل المباشر بأقل عدد وبسيارات فائقة الممرات، مما يخفض البينج ويثبت معدلات Jitter لأدنى درجاتها.",
        content_en: "Yes, specifically if your local ISP utilizes convoluted routing tables to prominent EU/AS servers. An optimized gaming-centric VPN uses elite backbone loops to bypass congestion nodes on local exchange hubs, steering connection packets on highly localized premium fiber avenues directly to server grids, lowering jitter and securing stable responsiveness."
      },
      {
        type: "config",
        title_ar: "إجراءات ذهبية عاجلة لتخفيض بنق اللاق المزعج:",
        title_en: "Quick Golden Rules for Lag-Free Gameplay:",
        content_ar: "1. تخلص من شبكة الواي فاي لللعب واستخدم كابل إيثرنت (Cat6/Cat7) من الراوتر للكمبيوتر.\n2. تفعيل خاصية QOS (جودة الخدمة) في الراوتر للتحيز التلقائي لصالح حزم الألعاب.\n3. اختيار خادم DNS ذكي سريع مخصص لمطوري الألعاب.",
        content_en: "1. Swap unstable wireless Wi-Fi setups for high-quality copper shielding Ethernet connections (Cat 6 or higher).\n2. Toggle Quality of Service (QoS) priorities on your physical router node to reserve bandwidth for gaming.\n3. Establish optimized gaming DNS connections inside hardware network interfaces."
      }
    ]
  },
  {
    id: "benefits-of-rdp-vps",
    title_ar: "روعة السيرفرات السحابية الـ RDP: الحل البديل لتجاوز بطء ومحدودية باقات الإنترنت!",
    title_en: "Leveraging High-Speed RDP: The Ultimate Bypass for Slow Home Broadband",
    summary_ar: "لماذا تستهلك باقتك وأولويات معالجك؟ تملك حاسوبًا خارقًا في السحابة بترددات 10 جيجابت لتنزيل ورفع ومعالجة كل ملفاتك الكبرى.",
    summary_en: "Learn how to bypass finite local broadband limits, sluggish uploads, and restricted speeds by controlling a 10Gbps virtual cloud PC via Remote Desktop Protocol.",
    category_ar: "السحابة والإنترنت الافتراضي",
    category_en: "Cloud RDP & VPS",
    readTime_ar: "قراءة في 4 دقائق",
    readTime_en: "4 min read",
    date_ar: "٢٢ مايو ٢٠٢٦",
    date_en: "May 22, 2026",
    author: "د. إبراهيم فؤاد (رئيس البنى التحتية السحابية)",
    iconName: "Server",
    accentColor: "from-teal-500 to-cyan-600",
    ctaText_ar: "استعرض أقوى باقات وعروض الـ RDP / VPS السريعة",
    ctaText_en: "Explore Ultra-Fast RDP & VPS Deals",
    ctaTarget: "rdp",
    paragraphs: [
      {
        type: "text",
        title_ar: "ما هو الـ RDP ولماذا يعد حلاً عبقريًا؟",
        title_en: "What Is an RDP and Why Is It So Powerfully Unique?",
        content_ar: "الـ RDP (بروتوكول سطح المكتب البعيد) هو أداة تتيح لك الاتصال والتحكم بجهاز كمبيوتر حقيقي يعمل في مركز بيانات سحابي عالمي ضخم (في أمريكا أو أوروبا مثلاً). هذا الكمبيوتر السحابي لا يتمتع بسرعة إنترنت عشوائية، بل متصل بشبكة إنترنت رئيسية فائقة القوة بسرعات تصل إلى 10,000 ميجابت بالثانية (10 Gbps) للداونلود والآبلود وبلا انقطاع وبلا حساب لحدود الاستهلاك المحلي المزعج.",
        content_en: "RDP (Remote Desktop Protocol) grants you direct visual interface and administrative control over a high-performance computer partition operated in a strategic global tier-1 cloud facility. This virtual compute machine is coupled directly with synchronous tier-1 backbone structures running at blazing speeds of 10,000 Mbps (10 Gbps) - running continuously independent of your local network quality."
      },
      {
        type: "bullets",
        title_ar: "فوائد مذهلة لاستخدام السيرفرات السحابية والـ RDP لعملك:",
        title_en: "Astounding Practical Use Cases of Cloud RDP Environments:",
        content_ar: [
          "حفاظ كامل على باقة وسرعة إنترنت المنزل: إذا أردت تحميل ملف حجمه 100 جيجابايت ثم رفعه وتعديله، يمكنك تنفيذ ذلك داخل لقطات السيرفر البعيد في ثوانٍ معدودة دون دفع قرش واحد كاستهلاك لباقة هاتفك المحلي البطيء.",
          "عناوين IP خاصة ونظيفة بالكامل: لا مزيد من الحجب الإقليمي والتحقق المزعج والـ Captchas؛ يمنحك السيرفر عنوان IP ثابت غير مشترك للأعمال وادارة المتاجر والتعامل المباشر الآمن مع الأسواق الخارجية.",
          "أداء مستمر ومحيطي على مدار الساعة 24/7: ترسل البيانات وتدير تطبيقاتك البرمجية والتحليلات الآلية حتى وجهازك مغلق تماماً أو طفا الكهرياء بالمنزل."
        ],
        content_en: [
          "Preserve Expensive Home Mobile Quotas: Downloading or archiving a massive 150 GB backup package locally would choke flat home connection lanes. Within a multi-gigabit cloud RDP workspace, downloading takes literally 12 seconds, demanding absolutely zero bytes of your expensive local mobile broadband package.",
          "Unshared Private Static IPs: Bypass irritating geoblocks, payment gateway verification screens, and relentless bot identification captchas. Elite VPS contracts issue unshared dedicated IPs for smooth remote finance, store operations, and secure administration.",
          "Non-Stop 24/7 Cloud Operations: Run scraping automated pipelines, continuous web servers, or large database tasks indefinitely. The cloud machine remains completely active online even when your home computer is powered off."
        ]
      },
      {
        type: "highlight",
        title_ar: "أنت بحاجة للـ RDP عاجلاً إذا كنت:",
        title_en: "You Definitely Need a Personal RDP/VPS Server If You are:",
        content_ar: "مطور برامج، صانع محتوى ينشر فيديوهات ضخمة بدقة 4K، متداول في أسواق الأسهم والعملات الرقمية، أو تدير مشاريع تجارة الكترونية ومتاجر عالمية مثل Shopify وتحتاج للبقاء سرياً ومتصلاً بعنوان نظيف دون انقطاعات مزعجة من شركة خدمات الاتصال المحلية.",
        content_en: "A dynamic tech developer, video content creator distributing raw ultra-high-definition video templates, financial trader seeking sub-millisecond execution matching servers, or international e-commerce drop-shipper executing administrative storefront tasks requiring high safety margins."
      }
    ]
  }
];

export default function Blog({ language, setCurrentPage, articles }: BlogProps) {
  const isAr = language === "ar";
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const activeArticles = articles && articles.length > 0 ? articles : ARTICLES;

  const handleBackToBlogHome = () => {
    setSelectedArticleId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedArticle = activeArticles.find(a => a.id === selectedArticleId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" id="blog-main-section">
      {selectedArticle ? (
        /* Full Article Reading View */
        <article className="max-w-4xl mx-auto animate-fade-in" id={`article-reading-panel-${selectedArticle.id}`}>
          {/* Back button */}
          <button
            onClick={handleBackToBlogHome}
            className="group inline-flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-blue-400 hover:text-blue-300 transition-all cursor-pointer mb-8 py-2 px-4 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/40"
            id="btn-back-to-blog"
          >
            {isAr ? (
              <>
                <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                <span>العودة للمقالات</span>
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to articles list</span>
              </>
            )}
          </button>

          {/* Hero Header */}
          <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-900 rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
            {/* Ambient Accent Glow */}
            <div className={`absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br ${selectedArticle.accentColor} opacity-10 rounded-full blur-3xl pointer-events-none`} />
            
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-blue-400 font-bold">
                {isAr ? selectedArticle.category_ar : selectedArticle.category_en}
              </span>
              <span className="flex items-center text-slate-400">
                <Clock className="w-3.5 h-3.5 mr-1 ml-1 text-slate-500" />
                {isAr ? selectedArticle.readTime_ar : selectedArticle.readTime_en}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                {isAr ? selectedArticle.date_ar : selectedArticle.date_en}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug tracking-tight mb-6">
              {isAr ? selectedArticle.title_ar : selectedArticle.title_en}
            </h1>

            {/* Author info */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse border-t border-slate-800/60 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-blue-400 font-bold text-sm">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">{selectedArticle.author}</p>
                <p className="text-xs text-slate-500">{isAr ? "طاقم الدعم الفني المعتمد" : "Verified Network Staff Scientist"}</p>
              </div>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="space-y-8 text-slate-200 leading-relaxed text-sm sm:text-base mb-12">
            {selectedArticle.paragraphs.map((p, idx) => {
              const paraTitle = isAr ? p.title_ar : p.title_en;
              
              if (p.type === "highlight") {
                return (
                  <div key={idx} className="bg-blue-950/25 border-l-4 rtl:border-r-4 border-l-blue-500 rtl:border-r-blue-500 border-y border-r rtl:border-y rtl:border-l border-blue-900/20 rounded-r-2xl rtl:rounded-l-2xl rtl:rounded-r-none p-6 my-6">
                    {paraTitle && (
                      <h3 className="text-lg font-black text-blue-400 mb-2">{paraTitle}</h3>
                    )}
                    <p className="text-slate-300 text-sm sm:text-base">
                      {isAr ? (p.content_ar as string) : (p.content_en as string)}
                    </p>
                  </div>
                );
              }

              if (p.type === "config") {
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-900 rounded-2xl p-6 font-mono my-6 shadow-inner relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider select-none bg-slate-900/50 px-2.5 py-1 rounded border border-slate-800/60">
                      {isAr ? "⚙️ تهيئة فنية" : "⚙️ Technical Config"}
                    </div>
                    {paraTitle && (
                      <h4 className="text-xs sm:text-sm text-slate-400 font-bold mb-3 uppercase tracking-wider border-b border-slate-900 pb-2">
                        {paraTitle}
                      </h4>
                    )}
                    <pre className="text-xs sm:text-sm text-blue-400 whitespace-pre-wrap leading-relaxed select-all cursor-pointer">
                      {isAr ? (p.content_ar as string) : (p.content_en as string)}
                    </pre>
                  </div>
                );
              }

              if (p.type === "bullets") {
                return (
                  <div key={idx} className="space-y-4">
                    {paraTitle && (
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-slate-900 pb-2.5 mt-8">
                        {paraTitle}
                      </h2>
                    )}
                    <ul className="space-y-3.5 pl-1 pr-1">
                      {((isAr ? p.content_ar : p.content_en) as string[]).map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start space-x-3 rtl:space-x-reverse bg-slate-900/20 border border-slate-900/40 hover:border-blue-950 p-4 rounded-xl transition-colors">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-950 border border-blue-900/50 text-blue-400 text-xs font-bold flex items-center justify-center align-middle mt-0.5">
                            {bIdx + 1}
                          </span>
                          <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (p.type === "image") {
                const imageUrl = isAr ? (p.content_ar as string) : (p.content_en as string);
                return (
                  <div key={idx} className="space-y-3 my-6 group/img" id={`article-img-block-${idx}`}>
                    {paraTitle && (
                      <h3 className="text-sm sm:text-base font-bold text-slate-300 tracking-tight mt-6">
                        {paraTitle}
                      </h3>
                    )}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/30 p-2 transition-all duration-300 hover:border-blue-900/30 hover:shadow-2xl hover:shadow-blue-950/20">
                      <img 
                        src={imageUrl || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop"} 
                        alt={paraTitle || "Technical Article Illustration"}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-[480px] object-cover rounded-xl transition-transform duration-500"
                        id={`blog-img-${idx}`}
                      />
                      {(p.extra_ar || p.extra_en) && (
                        <div className="mt-2.5 px-3 py-1.5 text-xs text-slate-400 font-mono italic border-t border-slate-900/50 bg-slate-950/25 rounded-lg flex items-center gap-1.5">
                          <span className="text-blue-400">ℹ️</span>
                          <span>{isAr ? p.extra_ar : p.extra_en}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="space-y-3">
                  {paraTitle && (
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-slate-900 pb-2.5 mt-8">
                      {paraTitle}
                    </h2>
                  )}
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    {isAr ? (p.content_ar as string) : (p.content_en as string)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Call to action card inside article */}
          <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 border border-blue-900/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden mb-16 shadow-lg">
            <h3 className="text-lg sm:text-xl font-extrabold text-white mb-3">
              {isAr ? "💡 هل ترغب في تطبيق هذه التوصيات الآن؟" : "💡 Ready to apply these recommendations now?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6">
              {isAr 
                ? "تم دمج هذه المقالة بشكل ذكي مع منصتنا لمساعدتك على بدء الفحص أو الوصول لأقوى العروض بضغطة واحدة." 
                : "This technical guide is connected directly with our system services to give you instant checks and partner discounts."
              }
            </p>
            <button
              onClick={() => {
                setCurrentPage(selectedArticle.ctaTarget);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-950 cursor-pointer"
            >
              <span>{isAr ? selectedArticle.ctaText_ar : selectedArticle.ctaText_en}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </article>
      ) : (
        /* Articles Listing Overview */
        <div className="animate-fade-in" id="blog-listing-panel">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex p-3 bg-blue-950/40 border border-blue-900 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white" id="blog-title-header">
              {isAr ? "المدونة التقنية والتعليمية" : "Technical & Educational Blog"}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              {isAr 
                ? "مقالات حصرية متخصصة كتبها خبراء لمساعدتك على فك طلاسم ممارسات الـ ISP، تثبيت البينج، والاستخدام الأقصى للسحابيات" 
                : "Exclusive insights authored by our network engineers to audit ISP limitations, fine-tune gaming lag, and scale cloud operations"
              }
            </p>
          </div>

          {/* Articles Grid (3 items) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12" id="blog-articles-grid">
            {activeArticles.map((article) => {
              const IconComponent = ICON_MAP[article.iconName as keyof typeof ICON_MAP] || BookOpen;
              return (
                <div
                  key={article.id}
                  className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900 hover:border-blue-900/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/10 flex flex-col justify-between group"
                  id={`article-card-${article.id}`}
                >
                  {/* Card Upper Segment */}
                  <div>
                    {/* Visual header background container */}
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-900/80">
                      {/* Decorative grid pattern */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30" />
                      
                      {/* Beautiful glowing blob matching category */}
                      <div className={`absolute w-32 h-32 bg-gradient-to-br ${article.accentColor} opacity-15 rounded-full blur-2xl group-hover:opacity-25 transition-all duration-300`} />
                      
                      {/* Floating tech icon */}
                      <div className={`relative p-4 rounded-2xl bg-slate-900/90 border border-slate-850 group-hover:scale-110 transition-transform duration-300 text-blue-400`}>
                        <IconComponent className="w-10 h-10" />
                      </div>

                      {/* Floating tag */}
                      <span className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                        {isAr ? article.category_ar : article.category_en}
                      </span>
                    </div>

                    {/* Content padding */}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-[10px] font-mono text-slate-500 mb-3">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 ml-1" />
                          {isAr ? article.readTime_ar : article.readTime_en}
                        </span>
                        <span>•</span>
                        <span>{isAr ? article.date_ar : article.date_en}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[52px] leading-snug">
                        {isAr ? article.title_ar : article.title_en}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2">
                        {isAr ? article.summary_ar : article.summary_en}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Segment */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-900/30">
                    <button
                      onClick={() => {
                        setSelectedArticleId(article.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-center font-bold text-xs bg-slate-900 hover:bg-blue-600 hover:text-white border border-slate-800 hover:border-blue-600 transition-all text-blue-400 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
                      id={`btn-read-article-${article.id}`}
                    >
                      <span>{isAr ? "اقرأ المقال كاملاً" : "Read Full Article"}</span>
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Newsletter style micro box */}
          <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900/20 border border-slate-900 p-6 sm:p-8 text-center" id="blog-footer-newsletter">
            <h4 className="text-sm sm:text-base font-bold text-slate-200 mb-1">
              {isAr ? "💡 هل تود المتابعة ومواكبة الأحدث؟" : "💡 Want to stay updated?"}
            </h4>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              {isAr 
                ? "يقوم فريق طبيب الإنترنت بنشر كشوفات فنية حرة بصفة دورية لمساعدة المشتركين من الوطن العربي على تخطي التقييدات المفروضة." 
                : "Our technical operations center publishes detailed audits periodically to assist users in bypassing broadband limitations."
              }
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
