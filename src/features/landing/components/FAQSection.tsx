"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "../data/landingData";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-32 bg-[#f7faf6] border-t border-[#bec9c3]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005440] bg-[#c9eadb]/60 px-3.5 py-1.5 rounded-full inline-block">
            Answers & Clarity
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#181d1a] tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#3f4944]">
            Everything you need to know about planning, routes, and splitting expenses with Kafla.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className="bg-white rounded-2xl border border-[#bec9c3]/35 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 hover:bg-[#ebefeb]/30 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-[#181d1a]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#005440] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-[#3f4944] leading-relaxed border-t border-[#bec9c3]/15">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
