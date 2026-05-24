import React from "react";
import { PageId, Language, RDPOffer } from "../types";
import { TRANSLATIONS, RDP_OFFERS_DATA } from "../data";
import { Server, Cpu, HardDrive, CheckSquare, Compass, Globe2, ExternalLink } from "lucide-react";

interface RDPOffersProps {
  language: Language;
  rdpOffers?: RDPOffer[];
}

export default function RDPOffers({ language, rdpOffers }: RDPOffersProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const activeOffers = rdpOffers && rdpOffers.length > 0 ? rdpOffers : RDP_OFFERS_DATA;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="rdp-offers-page-wrapper">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex p-3 bg-blue-950/40 border border-blue-900 rounded-2xl mb-4">
          <Server className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white" id="rdp-deals-title-header">
          {t.rdpPageTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          {t.rdpPageSubtitle}
        </p>
      </div>

      {/* Grid of Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="rdp-offers-cards-grid">
        {activeOffers.map((rdp) => (
          <div 
            key={rdp.id}
            className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-blue-900/40 hover:shadow-2xl transition-all duration-300 relative group"
            id={`rdp-card-${rdp.id}`}
          >
            
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-950">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-extrabold tracking-wider">
                  ⚡ 10 Gbps Port
                </span>
                <span className="bg-emerald-950 border border-emerald-900 text-emerald-400 py-0.5 px-2.5 rounded text-[10px] font-bold">
                  Active Discount Match
                </span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                {rdp.hostName}
              </h3>

              <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-400 font-mono mt-1 mb-6">
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.region}:</span>
                <strong className="text-slate-300">{isAr ? rdp.region_ar : rdp.region_en}</strong>
              </div>

              {/* Server Spec Pill Grid */}
              <div className="grid grid-cols-2 gap-2.5 my-6" id={`rdp-spec-grid-${rdp.id}`}>
                <div className="bg-slate-950/80 border border-slate-850 px-3 py-2 rounded-lg text-left rtl:text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">{t.hostCores}</span>
                  <span className="text-sm font-bold text-white font-mono">{rdp.cores} vCores</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-850 px-3 py-2 rounded-lg text-left rtl:text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">{t.hostRam}</span>
                  <span className="text-sm font-bold text-white font-mono">{rdp.ram}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-850 px-3 py-2 rounded-lg text-left rtl:text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">{t.hostStorage}</span>
                  <span className="text-sm font-bold text-white font-mono">{rdp.storage}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-850 px-3 py-2 rounded-lg text-left rtl:text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">{t.hostBandwidth}</span>
                  <span className="text-sm font-bold text-white font-mono">{rdp.bandwidth}</span>
                </div>
              </div>

              {/* Bullet Key Strengths */}
              <div className="space-y-2 mb-8">
                {(isAr ? rdp.features_ar : rdp.features_en).map((feat, index) => (
                  <div key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-xs text-slate-300 leading-tight">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Options / Buy Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-950 space-y-4">
              
              {/* Option 1: Monthly */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">{t.monthlyPlan}</span>
                  <span className="text-lg font-black font-mono text-white leading-none">{rdp.priceMonthly} <span className="text-xs text-slate-500 font-normal">/ mo</span></span>
                </div>
                <a
                  href={rdp.affiliateLinkMonthly}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`rdp-monthly-${rdp.id}`}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center space-x-1.5 rtl:space-x-reverse"
                >
                  <span>{t.getMonthly}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Option 2: Yearly */}
              <div className="bg-slate-950/60 border border-blue-950 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-500 block font-bold">{t.yearlyPlan}</span>
                  <span className="text-xl font-black font-mono text-emerald-400 leading-none">{rdp.priceYearly} <span className="text-xs text-slate-500 font-normal">/ yr</span></span>
                </div>
                <a
                  href={rdp.affiliateLinkYearly}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`rdp-yearly-${rdp.id}`}
                  className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg flex items-center space-x-1.5 rtl:space-x-reverse shadow"
                >
                  <span>{t.getYearly}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
