import { VPNOffer, RDPOffer } from "./types";

export const TRANSLATIONS = {
  ar: {
    brandName: "Smart Internet Doctor",
    brandTitle: "طبيب الإنترنت الذكي",
    brandSubtitle: "التحليلات والمقاييس الذكية للشبكات والإنترنت",
    navHome: "الرئيسية",
    navSpeedTest: "مقياس السرعة",
    navAnalysis: "تحليل الذكاء الاصطناعي",
    navVpnOffers: "عروض الـ VPN",
    navRdpOffers: "صفقات الـ RDP / VPS",
    navHowItWorks: "كيف يعمل؟",
    navFaq: "الأسئلة الشائعة",
    navBlog: "المدونة التقنية",
    ctaStartTest: "ابدأ اختبار السرعة",
    ctaAnalyzeNow: "شخّص اتصالي بالذكاء الاصطناعي",
    langToggle: "English 🌐",
    tagline: "افحص سرعة الإنترنت الخاصة بك واحصل على تشخيص فوري وحلول ذكية بنقرة واحدة",
    
    // Home Page
    heroTitle: "افحص سرعة الإنترنت وعالج مشكلات اتصالك بالذكاء الاصطناعي",
    heroDesc: "يقوم نظامنا المتطور بقياس استجابة شبكتك، ويكتشف الاختناقات الفنية فوراً، ثم يرشدك خطوة بخطوة في لغتك لحل المشكلة بالتعاون مع أفضل مزودي الـ VPN والـ RDP لتعزيز كفاءة تصفحك وألعابك.",
    featuresTitle: "لماذا طبيب الإنترنت الذكي؟",
    featuresSubtitle: "أدوات مخصصة لتشخيص فائق وحلول رقمية فورية",
    feat1Title: "قياس حقيقي فوري للسرعة",
    feat1Desc: "اختبر التحميل، الرفع، والـ Ping بكفاءة مذهلة مع حساب قيمة التذبذب (Jitter) في إرسال البيانات.",
    feat2Title: "تشخيص معالجة بالذكاء الاصطناعي",
    feat2Desc: "احصل على تفسير طبيعي باللغتين العربية والإنجليزية لسبب بطء اتصالك وما إذا كان بسبب مزود الخدمة أو الراوتر.",
    feat3Title: "توصيات الـ VPN الصحيحة",
    feat3Desc: "لا تختر عشوائياً. نقوم بمطابقة مشاكل اتصالك بالـ VPN الأنسب (ألعاب، بث، أمان فائق) لحل مشكلتك وحظر الرادارات.",
    feat4Title: "أقوى صفقات الـ RDP & VPS",
    feat4Desc: "خوادم سطح مكتب بعيد وسحابية فائقة السرعة مع عناوين IP نظيفة لرفع وخفض معدلات البيانات بسرعات خارقة تصل إلى 10 جيجابت.",
    
    affiliateSectionTitle: "العروض الحصرية الموصى بها هذا الأسبوع",
    affiliateSectionSubtitle: "تسوق عبر روابطنا الشريكة للحصول على خصومات حصرية تصل إلى 82%",

    // Speed Test Page
    speedTestTitle: "جهاز فحص سرعة الشبكة التفاعلي",
    speedTestSubtitle: "اضغط على زر البدء لتشغيل عدادات نقل البيانات الفورية",
    startTest: "ابدأ الفحص الآن",
    testingDownload: "يجري قياس سرعة التحميل...",
    testingUpload: "يجري قياس سرعة الرفع...",
    testingPing: "يجري فحص الاستجابة والاهتزاز...",
    testCompleted: "اكتمل الفحص بنجاح!",
    resultsTitle: "نتائج الفحص الفورية",
    downloadLabel: "التحميل (Download)",
    uploadLabel: "الرفع (Upload)",
    pingLabel: "زمن الاستجابة (Ping)",
    jitterLabel: "الاهتزاز (Jitter)",
    analyzeBtn: "حلل اتصالي بواسطة طبيب الإنترنت 🧠",
    profileSelectLabel: "اختر بيئة المحاكاة لتجربة الفحص الذكي:",
    profileNormal: "اتصال ألياف ضوئية مثالي (Fiber Stable)",
    profileSlow: "اتصال خلوي / ريفي بطيء (Slow Rural)",
    profileGamingBad: "عشاق الألعاب: اتصال غير مستقر وبينج عالٍ (Gaming Lag/Jitter)",
    profileRandom: "اتصال عشوائي حقيقي للإنترنت الحالي",

    // AI Analysis Page
    analysisHeading: "تقرير التشخيص والتحليل الذكي للاتصال",
    analysisSubtitle: "توليد فوري للحلول والتحليلات عبر طبيب الإنترنت الذكي",
    unlockedByAi: "تحليل ذكي مدعوم بالكامل بواسطة Gemini Flash 3.5",
    localRuleDisclaimer: "ملاحظة: يجري استخدام محرك تشخيص القواعد المدمج الفائق السرعة لعدم توفر مفتاح Gemini API حالياً أو لحدود الاتصال.",
    networkGrade: "تقييم جودة الشبكة العام:",
    diagnosisTitle: "ملخص التشخيص الفني ومصادر الخلل:",
    problemsTitle: "الاختناقات والمشكلات المكتشفة بالشبكة:",
    fixesTitle: "خطوات الإصلاح المقترحة ذاتياً بحسب التقرير:",
    commandCopyTip: "انقر لنسخ القيمة الفنية",
    copiedFeedback: "تم النسخ!",
    suggestedVpnCat: "فئة الـ VPN الموصى بها لمشكلتك:",
    vpnTitle: "عروض الـ VPN الشريكة الموصى بها لحل مشكلتك",
    vpnBtn: "استعرض العروض المناسبة لهذه الفئة",

    // VPN Page
    vpnPageTitle: "مركز عروض ومقارنات خدمات الـ VPN الشريكة لعام 2026",
    vpnPageSubtitle: "خدمات ممتازة وحائزة على جوائز مع روابط خصومات حصرية لحل مشكلات القيود، خفض البينج، والأمان التام",
    allVpns: "استعراض الكل",
    gamingVpns: "أفضل VPN للألعاب ( Gaming )",
    speedVpns: "أفضل VPN للسرعة والبث ( Speed )",
    privacyVpns: "أفضل VPN للأمان والخصوصية ( Privacy )",
    getOffer: "احصل على العرض الآن 🚀",
    stars: "التقييم الفني",
    vpnFeatures: "أبرز الخصائص والفوائد:",

    // RDP Page
    rdpPageTitle: "باقات وصفقات خوادم الـ RDP / VPS السحابية",
    rdpPageSubtitle: "امتلك خادم سطح مكتب بعيد فائق السرعة بتردد شبكة 10 Gbps للتحميل والرفع المستمر بمواقع آمنة وعناوين IP مخصصة ونظيفة",
    hostCores: "نواة معالج (Cores)",
    hostRam: "ذاكرة عشوائية (RAM)",
    hostStorage: "مساحة التخزين (SSD)",
    hostBandwidth: "معدل نقل البيانات (Bandwidth)",
    hostIP: "نوع عنوان الـ IP",
    region: "المنطقة والموقع الجغرافي",
    monthlyPlan: "اشتراك شهري",
    yearlyPlan: "اشتراك سنوي (خصم 25%)",
    getMonthly: "شراء العرض الشهري",
    getYearly: "شراء العرض السنوي (الأوفر)",

    // How it works
    hiwTitle: "كيف يعمل نظام طبيب الإنترنت الذكي؟",
    hiwSubtitle: "طريقتنا المبسطة لزيادة استقرار وتأمين اتصالك في 4 خطوات سهلة",
    hiwStep1: "1. فحص السرعة التفاعلي",
    hiwStep1Desc: "تقوم الأداة بحساب دقيق لمعدلات الداونلود والمعدل الفعلي للرفع مع تتبع اهتزاز حزم إرسال البيانات.",
    hiwStep2: "2. فحص الخوارزميات والذكاء الاصطناعي",
    hiwStep2Desc: "يتم فحص مخرجات الأرقام بواسطة طبيب الإنترنت الذكي (باستخدام Gemini API) لتحديد موضع الضعف الحقيقي.",
    hiwStep3: "3. خطوات تقنية مجانية وقابلة للتطبيق",
    hiwStep3Desc: "يقدم لك النظام معايير فنية مثل عناوين DNS أسرع ومخصصة، وإجراءات إعادة تعيين المودم.",
    hiwStep4: "4. تفعيل خدمات الحماية والـ Remote",
    hiwStep4Desc: "توصية بالفئة الملائمة من الـ VPN لتجاوز تضييق مزود الخدمة، مع أدلة صفقات الـ RDP لاستبدال التصفح المحلي البطيء.",

    // FAQ Page
    faqTitle: "الأسئلة الشائعة والإرشادات الفنية",
    faqSubtitle: "كل ما تود معرفته عن مقاييس الشبكة وفائدة الخدمات الإضافية الموصى بها",

    // Footer
    footerDesc: "طبيب الإنترنت الذكي (Smart Internet Doctor) - منصة مستقلة لتحليل الشبكات وتقديم حلول الدعم الفني وتوصية الشركاء الموثوقين.",
    footerRights: "جميع الحقوق محفوظة © 2026. تواصل المبيعات والشركاء متاح عبر القنوات الرسمية."
  },
  en: {
    brandName: "Smart Internet Doctor",
    brandTitle: "Smart Internet Doctor",
    brandSubtitle: "Intelligent Network Quality Metrics & Diagnostics AI",
    navHome: "Home",
    navSpeedTest: "Speed Test",
    navAnalysis: "AI Diagnostics",
    navVpnOffers: "VPN Offers",
    navRdpOffers: "RDP / VPS Deals",
    navHowItWorks: "How It Works",
    navFaq: "FAQ",
    navBlog: "Tech Blog",
    ctaStartTest: "Start Speed Test",
    ctaAnalyzeNow: "Diagnose My Connection",
    langToggle: "العربية 🌐",
    tagline: "Test your internet speed, get direct network analysis with tech recommendations and premium affiliate matches.",
    
    // Home Page
    heroTitle: "Test Your Internet Speed & Fix Your Connection with AI",
    heroDesc: "Our powerful system measures network response, finds bottlenecks instantly, and walks you through exact steps to fix issues with matched elite VPN & high-speed RDP partners for lag-free surfing and remote work.",
    featuresTitle: "Why Smart Internet Doctor?",
    featuresSubtitle: "Tailored tools for elite technical diagnostic analysis and instant fixes",
    feat1Title: "Interactive Network Gauge",
    feat1Desc: "Measure download speeds, upload speeds, response latency (Ping), and signal jitter rates efficiently.",
    feat2Title: "AI Diagnosis & Explanations",
    feat2Desc: "Understand why your speed acts slow with human-like analyses generated in both English and Arabic.",
    feat3Title: "Matched VPN Solutions",
    feat3Desc: "Stop guessing VPNs. We pair your exact bottleneck (gaming high ping, streaming buffers, or privacy) to the perfect service.",
    feat4Title: "High-Bandwidth RDP & VPS Deals",
    feat4Desc: "Ultra-fast remote desktop servers with dedicated clean IPs and up to 10 Gbps speeds to bypass local data caps and download limits.",
    
    affiliateSectionTitle: "Highly Recommended Elite Partner Offers",
    affiliateSectionSubtitle: "Shop through our verified affiliate links to secure exclusive direct discount rates up to 82%",

    // Speed Test Page
    speedTestTitle: "Interactive Network Speed Test",
    speedTestSubtitle: "Click starting node below to run actual high-concurrency diagnostic loops",
    startTest: "Start Network Check",
    testingDownload: "Measuring broadband download speeds...",
    testingUpload: "Measuring broadband upload speeds...",
    testingPing: "Tracing socket response loops and jitter values...",
    testCompleted: "Broadband diagnostic completed successfully!",
    resultsTitle: "Broadband Performance Metrics",
    downloadLabel: "Download Rate",
    uploadLabel: "Upload Rate",
    pingLabel: "Ping Latency",
    jitterLabel: "Jitter Rate",
    analyzeBtn: "Analyze Connection via smart doctor AI 🧠",
    profileSelectLabel: "Choose Simulation Scenario for Diagnostics:",
    profileNormal: "Perfect Optical Fiber (Fiber Stable)",
    profileSlow: "Slow Rural Wireless / Mobile LTE (Slow Rural)",
    profileGamingBad: "Hardcore Gaming: Inconsistent unstable loop (Gaming Lag/Jitter)",
    profileRandom: "Real live network metrics query",

    // AI Analysis Page
    analysisHeading: "Smart Internet Diagnostics & Solutions Report",
    analysisSubtitle: "Instant troubleshooting generated dynamically by Google Gemini intelligence",
    unlockedByAi: "Analysis powered continuously via server-side Gemini 3.5 Flash",
    localRuleDisclaimer: "Note: Falling back securely to our built-in high-performance diagnostics rules engine due to missing key configuration.",
    networkGrade: "Overall Connection Quality Score:",
    diagnosisTitle: "Comprehensive Diagnostics Narrative:",
    problemsTitle: "Identified Network Bottlenecks & Interference:",
    fixesTitle: "Expert Prescribed Steps to Self-Fix Issues:",
    commandCopyTip: "Click to copy configuration command or value",
    copiedFeedback: "Copied!",
    suggestedVpnCat: "Targeted Ideal VPN Classification Recommended:",
    vpnTitle: "Matched Elite VPN Partners for Your Diagnostics Profile",
    vpnBtn: "View Best Offers for This Classification",

    // VPN Page
    vpnPageTitle: "Elite Verified Affiliate Partner VPN Listing 2026",
    vpnPageSubtitle: "Award-winning secure service providers with premium direct discounts to mitigate routing lag, speed up streams, and shield tracks.",
    allVpns: "All Services",
    gamingVpns: "Best Match for Gaming & High Latencies",
    speedVpns: "Best Match for Bandwidth Speeds & Streaming",
    privacyVpns: "Best Match for Security & Anonymity",
    getOffer: "Get Exclusive Discount Offer 🚀",
    stars: "Technical Score",
    vpnFeatures: "Key Key Strengths & Performance Benchmarks:",

    // RDP Page
    rdpPageTitle: "Enterprise-Grade RDP & VPS Cloud Servers",
    rdpPageSubtitle: "Acquire high-performance remote desktop servers with 10 Gbps uplink, completely dedicated static clean IPs for perpetual data streams.",
    hostCores: "Processor Cores",
    hostRam: "Memory Allocation",
    hostStorage: "Storage Capacity",
    hostBandwidth: "Monthly Bandwidth",
    hostIP: "IP Address Type",
    region: "Strategic Server Location",
    monthlyPlan: "Monthly Contract",
    yearlyPlan: "Yearly Contract (Save 25%)",
    getMonthly: "Deploy Monthly Server",
    getYearly: "Deploy Yearly (Best Savings)",

    // How it works
    hiwTitle: "How Smart Internet Doctor Works",
    hiwSubtitle: "An easy 4-step framework to optimize, secure, and accelerate your digital interface",
    hiwStep1: "1. Run Quick Speed Check",
    hiwStep1Desc: "The responsive user system gauges exact packet download rates, uploading power, and socket jitter intervals.",
    hiwStep2: "2. Trigger AI Engine Diagnostics",
    hiwStep2Desc: "Our system runs your numbers through Gemini API diagnostics to uncover backend constraints and ISP congestion filters.",
    hiwStep3: "3. Implement Instant Solutions",
    hiwStep3Desc: "Get custom high-speed DNS mappings, physical router realignment targets, and smart steps to apply instantly.",
    hiwStep4: "4. Deploy Protection Rings",
    hiwStep4Desc: "Activate matched VPN channels to prevent throttle points, or deploy virtual high-speed RDPs to shift heavy network strain.",

    // FAQ Page
    faqTitle: "Frequently Asked Tech Questions",
    faqSubtitle: "Understand how smart diagnostic results can aid your day-to-day work flows",

    // Footer
    footerDesc: "Smart Internet Doctor - Independent network analytics system supplying high-fidelity diagnostics, manual self-fixes, and vetted affiliate recommendations.",
    footerRights: "All Rights Reserved © 2026. Business alliances and partnership channels are managed through administrative vectors."
  }
};

export const FAQ_DATA = [
  {
    question_en: "How accurate is the Speed Test?",
    question_ar: "ما مدى دقة مقياس سرعة اتصال الإنترنت؟",
    answer_en: "Our test utilizes high-fidelity multi-thread diagnostic simulation which estimates connection variables using responsive high-concurrency protocols, estimating download rates, latency (Ping) and packet transmission variance (Jitter) directly compatible with your browser connection capabilities.",
    answer_ar: "يستخدم برنامج الفحص التفاعلي لدينا بروتوكولات حاسوبية ذكية متعددة المسارات والمحاور، والتي تحاكي معدل النقل الداخلي وحجم تشتت البيانات (Jitter) وزمن ارتداد الحزم بدقة ممتازة تتوافق مع قدرات معالجة المتصفح."
  },
  {
    question_en: "Why does the Smart Doctor recommend a VPN?",
    question_ar: "لماذا يوصي طبيب الإنترنت بتفعيل شبكة افتراضية خاصة VPN؟",
    answer_en: "Many ISPs actively monitor user traffic and throttle high-bandwidth channels like gaming feeds and streaming portals. A high-quality encrypted VPN conceals payload categories from providers, routes traffic through low-congestion avenues, and resolves local geoblocks.",
    answer_ar: "تقوم العديد من الشركات المشغلة بخنق ومراقبة خطوط التحميل الكبيرة مثل كتل الألعاب وبث الفيديو عالي الدقة. تفعيل شبكة VPN موثوقة ومحمولة يشفر المحاضر والمحتويات بالكامل لمنع خنق النطاق والوصول لخوادم عالمية سريعة."
  },
  {
    question_en: "Is the simulation analysis fully powered by Gemini AI?",
    question_ar: "هل التحليلات مدعومة بالكامل بنظام الذكاء الاصطناعي من جوجل؟",
    answer_en: "Absolutely! When you trigger 'Diagnose My Connection', our remote Express backend validates metrics and securely requests Gemini-3.5-Flash to construct tailor-made Arabic or English diagnoses. If the key is not initialized in the workspace, we preserve a fast rule-based fail-safe backup engine.",
    answer_ar: "بالتأكيد! عند نقرك على زر فحص وتشخيص الاتصال، يقوم السيرفر المدمج بطلب تفصيلي من نموذج الذكاء الاصطناعي المتطور Gemini-3.5-Flash لتحليل نسب البينج والتحميل وتأصيل المشاكل. نوفر كذلك نظام تشخيص احتياطي فوري لتجنب الانقطاع."
  },
  {
    question_en: "Do you store my speed test parameters or personal logs?",
    question_ar: "هل تقومون بحفظ وحظر بيانات الفحص والمواقع التي أزورها؟",
    answer_en: "No. We respect user privacy. We analyze connection telemetry ephemeral on-the-fly to compile recommendations. No telemetry tracking or static data warehouses are utilized to log personal IPs or browsing activities.",
    answer_ar: "قطعياً لا. نحن ملتزمون بمبادئ الخصوصية التامة. لا نحتفظ أو نسجل عناوين الـ IP الخاصة بك أو سجلات تصفحك ولا نطلب معلومات شخصية للحصول على التشخيص."
  },
  {
    question_en: "What is an RDP/VPS and how does it help slow connections?",
    question_ar: "ما هو الـ RDP / VPS السحابي وكيف يفيد الاتصالات البطيئة والمحدودة؟",
    answer_en: "A Remote Desktop Protocol (RDP) or Virtual Private Server (VPS) is a computer hosted in a high-bandwidth cloud data center with 10,000 Mbps speeds. Even if your physical connection speed is slow, you can remote control this computer stably, allowing you to fetch, upload, and process files in milliseconds without draining your home bandwidth.",
    answer_ar: "نظام الـ RDP أو الخادم السحابي الذكي هو حاسوب متصل بشبكة انترنت سحابية فائقة القوة بسرعات تصل إلى 10,000 ميجابت بالثانية. حتى لو كان اشتراكك المحلي متواضعاً، يمكنك التحكم في هذا الحاسوب عن بُعد وتنزيل ورفع ومعالجة الملفات في أجزاء من الثانية دون استهلاك باقة هاتفك أو منزلك."
  }
];

export const VPN_OFFERS_DATA: VPNOffer[] = [
  {
    id: "nordvpn",
    name: "NordVPN Premium Protection",
    badge_en: "Editor's Choice - Best Overall",
    badge_ar: "اختيار المحررين - الأفضل كلياً",
    rating: 4.9,
    speedRating: "97.4 Mbps Avg",
    price: "$3.09 / mo",
    description_en: "Industry pioneer in network defenses, offering NordLynx protocol for blazing light fast connections, built-in threat protection, and automated DNS leak guards.",
    description_ar: "رائد صناعة الدفاع الرقمي وحماية الشبكات، يوفر بروتوكول NordLynx فائق السرعة وجدار منع البرمجيات الضارة والأعطال وحماية متكاملة لتسريبات الـ DNS.",
    features_en: ["6400+ Global Servers", "NordLynx High-Speed Protocol", "Ad & Malware Blocker Included", "Up to 10 Devices Simultaneously"],
    features_ar: ["أكثر من 6400 خادم عالمي سحابي", "بروتوكول NordLynx للسرعة القصوى", "خدمة مدمجة لحظر الإعلانات والملفات الخبيثة", "اتصال متزامن لـ 10 أجهزة في نفس الوقت"],
    affiliateLink: "https://nordvpn.com", // Realistic affiliate match
    category: "speed",
    logoColorClassName: "from-blue-600 to-indigo-700"
  },
  {
    id: "expressvpn",
    name: "ExpressVPN UltraPing Low-Lag",
    badge_en: "Lowest Latency for Gaming",
    badge_ar: "أقل بينج واستجابة فورتنايت وألعاب",
    rating: 4.8,
    speedRating: "96.2 Mbps Avg (Ping 12ms)",
    price: "$6.67 / mo",
    description_en: "Engineered with proprietary Lightway protocol to minimize route hops, bypass severe ISP throttle points, and ensure minimal ping jitter during competitive multiplayer gaming.",
    description_ar: "مصمم مع عقلية بروتوكول Lightway المتطور لتقليص مسارات نقل البيانات، وتجاوز خنق السرعة لمزوّد الخدمة المحلي لضمان ثبات زمن الاستجابة أثناء اللعب والقتال.",
    features_en: ["Optimized Lightway Protocol", "Server Locations in 105 Countries", "Bypasses Heavy ISP Throttling", "Consistently Low Jitter Profiles"],
    features_ar: ["بروتوكول Lightway الحصري للاستقرار الفتان", "مواقع تغطي 105 دولة حول العالم", "يتخطى قيود خنق السرعة لمزودي الاتصال", "مؤشر تذبذب منخفص ومثالي للألعاب الحية"],
    affiliateLink: "https://www.expressvpn.com",
    category: "gaming",
    logoColorClassName: "from-red-600 to-rose-700"
  },
  {
    id: "surfshark",
    name: "Surfshark Bypass Unlimited",
    badge_en: "Best Value & Dual-Band Optimized",
    badge_ar: "القيمة الأفضل - أجهزة ومستخدمين بلا حدود",
    rating: 4.8,
    speedRating: "95.1 Mbps Avg",
    price: "$2.19 / mo",
    description_en: "Allows unlimited concurrent system connections. Features dynamic MultiHop double encryption routes and optimized connection rates across standard 2.4/5GHz wireless frequencies.",
    description_ar: "يسمح لك باتصال أجهزة العائلة بالكامل دون حدود في حساب واحد وبسعر رمزي، مع توفير خاصية المسار المزدوج MultiHop لتشديد الفلترة والتشفير التكميلي.",
    features_en: ["Unlimited Devices Support", "Bypasses Streaming Geo-Blocks", "Double VPN MultiHop Encryption", "Strict No-Logs Policy Verified"],
    features_ar: ["يدعم عدد أجهزة غير محدود إطلاقاً", "يتخطى جدران حظر مقاطع الفيديوهات الإقليمية", "تشفير ثنائي عبر خادمي VPN مختلفين", "سياسة صارمة لمنع تسجيل وحفظ سجلات النشاط"],
    affiliateLink: "https://surfshark.com",
    category: "speed",
    logoColorClassName: "from-teal-600 to-cyan-700"
  },
  {
    id: "mullvad",
    name: "Mullvad Direct-Anonymous VPN",
    badge_en: "Maximum Privacy & Tracking Shielder",
    badge_ar: "حماية مطلقة من التتبع - لست بحاجة لبريد إلكتروني",
    rating: 4.7,
    speedRating: "92.8 Mbps Avg",
    price: "€5.00 / mo",
    description_en: "No personal email or details required to register. Excellent WireGuard structure with direct public tracker filtering and absolute control over DNS configuration bypasses.",
    description_ar: "لا يتطلب التسجيل حتى وضع بريد إلكتروني، بل يمنحك رقماً حسابياً عشوائياً. أداء استثنائي لبروتوكول WireGuard مع حظر فوري لأدوات التتبع وحقن الحزم الخبيثة.",
    features_en: ["Zero Email Account Registration", "Pure WireGuard Native Support", "Anonymous Cash/Crypto Payments", "Internal DNS Filtering Controls"],
    features_ar: ["لا يتطلب أي بريد إلكتروني أو اسم حقيقي", "دعم كامل ومباشر لبروتوكول WireGuard", "الدفع كاش بالبريد أو العملات الرقمية لمزيد من الخصوصية", "لوحة تحكم وفلترة متطورة للخوادم المحمية"],
    affiliateLink: "https://mullvad.net",
    category: "privacy",
    logoColorClassName: "from-green-600 to-emerald-700"
  },
  {
    id: "cyberghost",
    name: "CyberGhost Buffer-Zero Streamer",
    badge_en: "Best for Netflix & Streaming Channels",
    badge_ar: "مفلتر بجودة 4K للبث والأفلام والأعمال",
    rating: 4.6,
    speedRating: "94.0 Mbps Avg",
    price: "$2.03 / mo",
    description_en: "Features dedicated pre-configured servers for global streaming apps to completely bypass local ISP buffering limits, guaranteeing continuous high-speed full HD & 4K delivery.",
    description_ar: "يوفر خوادم مهيأة مسبقاً ومخصصة لفتح خدمات البث العالمية وتخطي حاجز التخزين البطيء، مما يضمن تدفقاً سلساً لجودة Full HD و 4K بصفة متواصلة.",
    features_en: ["Optimized Streaming Filters", "One-Click Quick App Integrations", "No-Spy Servers in Secure Shelters", "45-Day Satisfaction Warranty"],
    features_ar: ["فلاتر محسنة ومنقحة لمنصات البث الرقمي", "تكامل وتفعيل سريع بنقرة زر واحدة", "خوادم No-Spy آمنة وخارج نطاق القوانين الفيدرالية", "ضمان استرجاع الأموال لمدة 45 يوماً كاملة"],
    affiliateLink: "https://www.cyberghostvpn.com",
    category: "speed",
    logoColorClassName: "from-orange-500 to-amber-700"
  }
];

export const RDP_OFFERS_DATA: RDPOffer[] = [
  {
    id: "kamatera-vps",
    hostName: "Kamatera Instant-Cloud VPS",
    cores: 2,
    ram: "4 GB",
    storage: "100 GB SSD",
    bandwidth: "5,000 GB / mo",
    ipType: "Dedicated Static IPv4",
    priceMonthly: "$19",
    priceYearly: "$171",
    affiliateLinkMonthly: "https://www.kamatera.com",
    affiliateLinkYearly: "https://www.kamatera.com",
    region_en: "USA, Europe & Asia Cities",
    region_ar: "أمريكا، أوروبا والشرق الأوسط وآسيا",
    features_en: ["Deploy server within 30 seconds", "Scale resources on-the-fly dynamically", "Symmetric 10 Gbps global backbone portals", "Full Windows Server or Ubuntu desktop option"],
    features_ar: ["إنشاء وتدشين الخادم السحابي في 30 ثانية", "ترقية وتعديل سعة الخادم والذاكرة فوراً وبشكل مرن", "متصل ببوابات شبكات 10 جيجابت بالثانية فائقة النقاء", "إمكانية إعداد نظامي تشغيل Windows Server أو Ubuntu ديسكتوب"]
  },
  {
    id: "vultr-rdp-gpu",
    hostName: "Vultr High-Compute GPU Remote",
    cores: 4,
    ram: "8 GB",
    storage: "160 GB NVMe Gen 4",
    bandwidth: "10,000 GB / mo",
    ipType: "Dedicated IP, No Blacklist Match",
    priceMonthly: "$36",
    priceYearly: "$324",
    affiliateLinkMonthly: "https://www.vultr.com",
    affiliateLinkYearly: "https://www.vultr.com",
    region_en: "32 Global Locations Available",
    region_ar: "32 موقع جيو-سراتيجي دولي للاختيار",
    features_en: ["NVMe high-speed read storage (up to 7000 MB/s)", "Dedicated virtual GPUs for low lag rendering", "Free backup setups and firewall control blocks", "10,000 Mbps fast ingress pipeline capacity"],
    features_ar: ["ذاكرة تخزين NVMe فائقة القراءة (تصل إلى 7000 ميجا/ثانية)", "كروت شاشة افتراضية مخصصة للألعاب والمونتاج الثقيل عن بعد", "تثبيت مجاني للنسخ الاحتياطي وحواجز الحماية الأمنية للراوتر", "شبكة سريعة تصل لـ 10,000 ميجابت لتنزيل دفقات الفيديوهات"]
  },
  {
    id: "hostinger-kvm",
    hostName: "Hostinger Budget-Power KVM VPS",
    cores: 1,
    ram: "2 GB",
    storage: "50 GB NVMe Storage",
    bandwidth: "2,000 GB / mo",
    ipType: "Unshared IPv4 & IPv6 Address Support",
    priceMonthly: "$8.99",
    priceYearly: "$80",
    affiliateLinkMonthly: "https://www.hostinger.com",
    affiliateLinkYearly: "https://www.hostinger.com",
    region_en: "Europe & Americas Locations",
    region_ar: "موزعة بأفضل مراكز بيانات بأوروبا وأمريكا",
    features_en: ["Superb price-to-performance ratio", "Complete root administrator access privileges", "Optimized memory caching for standard uploads", "Excellent automated snapshot histories"],
    features_ar: ["القيمة السعرية الأفضل مقارنة بالكفاءة وبالمعايير الفنية", "صلاحيات الروت والمسؤول (Administrator) الكاملة للتحكم المطلق", "مخزن مؤقت للذاكرة المنبثقة لتحميل ومعالجة الملفات", "نظام لقطات حيازة (Snapshots) للحفظ التلقائي للنظام"]
  }
];
