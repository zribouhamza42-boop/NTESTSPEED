import React from "react";
import { PageId, Language, VPNOffer } from "../types";
import { TRANSLATIONS, VPN_OFFERS_DATA } from "../data";
import { Star, CheckCircle, ExternalLink, ShieldAlert, Shield } from "lucide-react";

interface VPNOffersProps {
  language: Language;
  vpnFilter: 'all' | 'gaming' | 'speed' | 'privacy';
  setVpnFilter: (filter: 'all' | 'gaming' | 'speed' | 'privacy') => void;
  vpnOffers?: VPNOffer[];
}

export default function VPNOffers({
  language,
  vpnFilter,
  setVpnFilter,
  vpnOffers
}: VPNOffersProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const activeOffers = vpnOffers && vpnOffers.length > 0 ? vpnOffers : VPN_OFFERS_DATA;

  // Filter the VPN offers
  const filteredOffers = activeOffers.filter(vpn => {
    if (vpnFilter === 'all') return true;
    return vpn.category === vpnFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="vpn-offers-page-container">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex p-3 bg-blue-950/40 border border-blue-900 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white" id="vpn-page-title-header">
          {t.vpnPageTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          {t.vpnPageSubtitle}
        </p>
      </div>

      {/* Categories Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10" id="vpn-category-tabs">
        <button
          onClick={() => setVpnFilter('all')}
          id="vpn-tab-all"
          className={`px-5 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            vpnFilter === 'all'
              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-705 text-slate-300"
          }`}
        >
          {t.allVpns}
        </button>
        <button
          onClick={() => setVpnFilter('gaming')}
          id="vpn-tab-gaming"
          className={`px-5 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            vpnFilter === 'gaming'
              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-705 text-slate-300"
          }`}
        >
          🕹️ {t.gamingVpns}
        </button>
        <button
          onClick={() => setVpnFilter('speed')}
          id="vpn-tab-speed"
          className={`px-5 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            vpnFilter === 'speed'
              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-705 text-slate-300"
          }`}
        >
          ⚡ {t.speedVpns}
        </button>
        <button
          onClick={() => setVpnFilter('privacy')}
          id="vpn-tab-privacy"
          className={`px-5 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            vpnFilter === 'privacy'
              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-705 text-slate-300"
          }`}
        >
          🛡️ {t.privacyVpns}
        </button>
      </div>

      {/* Main Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="vpn-offers-grid-container">
        {filteredOffers.map((vpn) => (
          <div 
            key={vpn.id}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-blue-900/45 hover:shadow-2xl transition-all duration-300 group relative"
            id={`vpn-card-core-${vpn.id}`}
          >
            {/* Direct Side Glowing Accent */}
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl bg-gradient-to-b ${vpn.logoColorClassName}`}></div>

            <div>
              {/* Badge & Rating Block */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <span className="bg-blue-950 text-blue-400 border border-blue-900/70 text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                  {isAr ? vpn.badge_ar : vpn.badge_en}
                </span>

                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold font-mono">{vpn.rating}</span>
                  <span className="text-slate-500 text-[10px]">/ 5.0</span>
                </div>
              </div>

              {/* Title Header */}
              <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                {vpn.name}
              </h3>

              {/* Real Measured Speed Indicator */}
              <p className="text-[11px] font-mono text-indigo-400 uppercase mt-1">
                ⏱️ Tested Core Bandwidth Impact: <strong>{vpn.speedRating}</strong>
              </p>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed my-5">
                {isAr ? vpn.description_ar : vpn.description_en}
              </p>

              {/* Features List bullets */}
              <div className="space-y-2 mt-2" id={`vpn-feats-list-${vpn.id}`}>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                  {t.vpnFeatures}
                </p>
                {(isAr ? vpn.features_ar : vpn.features_en).map((feat, index) => (
                  <div key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-xs text-slate-300 leading-tight">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Panel pricing and CTA button */}
            <div className="mt-8 pt-5 border-t border-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left rtl:sm:text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Pricing Tier</span>
                <span className="text-2xl font-black font-mono text-emerald-400 leading-none">{vpn.price}</span>
              </div>

              <a
                href={vpn.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                id={`vpn-get-offer-btn-${vpn.id}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center hover:from-blue-500 hover:to-indigo-505 shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
              >
                <span>{t.getOffer}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
