export type PageId = 'home' | 'speedtest' | 'analysis' | 'vpn' | 'rdp' | 'how-it-works' | 'faq' | 'blog' | 'admin' | 'login';

export type Language = 'ar' | 'en';

export interface Paragraph {
  type: "text" | "bullets" | "config" | "highlight" | "image";
  title_ar?: string;
  title_en?: string;
  content_ar: string | string[];
  content_en: string | string[];
  extra_ar?: string;
  extra_en?: string;
}

export interface Article {
  id: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  category_ar: string;
  category_en: string;
  readTime_ar: string;
  readTime_en: string;
  date_ar: string;
  date_en: string;
  author: string;
  iconName: "ShieldAlert" | "Zap" | "Server" | "BookOpen"; // String key to avoid component serialization issues
  accentColor: string;
  paragraphs: Paragraph[];
  ctaText_ar: string;
  ctaText_en: string;
  ctaTarget: PageId;
}

export interface SpeedResults {
  download: number; // in Mbps
  upload: number; // in Mbps
  ping: number; // in ms
  jitter: number; // in ms
}

export interface FixItem {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  command_or_value: string;
}

export interface AnalysisResponse {
  aiGenerated: boolean;
  diagnosis_en: string;
  diagnosis_ar: string;
  problems_detected_en: string[];
  problems_detected_ar: string[];
  suggested_fixes: FixItem[];
  vpn_type_recommended: 'gaming' | 'streaming' | 'privacy';
  vpn_explanation_en: string;
  vpn_explanation_ar: string;
  network_grade: string;
}

export interface VPNOffer {
  id: string;
  name: string;
  badge_en: string;
  badge_ar: string;
  rating: number;
  speedRating: string;
  price: string;
  description_en: string;
  description_ar: string;
  features_en: string[];
  features_ar: string[];
  affiliateLink: string;
  category: 'gaming' | 'speed' | 'privacy';
  logoColorClassName: string;
}

export interface RDPOffer {
  id: string;
  hostName: string;
  cores: number;
  ram: string;
  storage: string;
  bandwidth: string;
  ipType: string;
  priceMonthly: string;
  priceYearly: string;
  affiliateLinkMonthly: string;
  affiliateLinkYearly: string;
  region_en: string;
  region_ar: string;
  features_en: string[];
  features_ar: string[];
}
