import React, { useState } from "react";
import { PageId, Language } from "../types";
import { FAQ_DATA, TRANSLATIONS } from "../data";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqProps {
  language: Language;
}

export default function Faq({ language }: FaqProps) {
  const t = TRANSLATIONS[language];
  const isAr = language === "ar";

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="faq-view-container">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex p-3 bg-blue-950/40 border border-blue-900 rounded-2xl mb-4">
          <HelpCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white" id="faq-title-header">
          {t.faqTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          {t.faqSubtitle}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto" id="faqs-accordion-list">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          const qText = isAr ? item.question_ar : item.question_en;
          const aText = isAr ? item.answer_ar : item.answer_en;

          return (
            <div 
              key={idx}
              className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-900/30"
              id={`faq-item-row-${idx}`}
            >
              
              {/* Trigger Button */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left rtl:text-right cursor-pointer"
                id={`faq-trigger-${idx}`}
              >
                <span className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {qText}
                </span>
                <span className="shrink-0 text-slate-400 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {/* Panel body */}
              {isOpen && (
                <div 
                  className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-950 bg-slate-950/20"
                  id={`faq-content-body-${idx}`}
                >
                  <p>{aText}</p>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
