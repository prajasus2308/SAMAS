import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import {
  SANSKRIT_FUN_FACTS,
  SAMAS_CATEGORIES,
  SamasExample,
} from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';

interface StatsAndFactsProps {
  totalExamples: number;
  spinCount: number;
  discoveredCount: number;
  spinHistory: SamasExample[];
  onSelectExample: (exampleId: string) => void;
}

export const StatsAndFacts: React.FC<StatsAndFactsProps> = ({
  totalExamples,
  spinCount,
  discoveredCount,
  spinHistory,
  onSelectExample,
}) => {
  const [factIndex, setFactIndex] = useState(0);
  const currentFact = SANSKRIT_FUN_FACTS[factIndex] || SANSKRIT_FUN_FACTS[0];

  const handlePrevFact = () => {
    soundEngine.playButtonClick();
    setFactIndex((prev) => (prev - 1 + SANSKRIT_FUN_FACTS.length) % SANSKRIT_FUN_FACTS.length);
  };

  const handleNextFact = () => {
    soundEngine.playButtonClick();
    setFactIndex((prev) => (prev + 1) % SANSKRIT_FUN_FACTS.length);
  };

  return (
    <section
      id="statistics"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="text-xs font-semibold tracking-wider text-[#F3D078] mb-2">
          04. LIVE EXHIBITION METRICS &amp; INSIGHTS · सत्र-सांख्यिकी
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FDF8EE] tracking-tight">
          Session Statistics &amp; <span className="text-gold-gradient">Sanskrit Insights</span>
        </h2>
      </div>

      {/* 4-Column Dynamic Tabular KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-6">
          <div className="text-xs font-semibold text-[#F3D078]/80">
            VERIFIED EXAMPLES AVAILABLE
          </div>
          <div className="mt-2 font-mono-num text-4xl font-extrabold text-[#FDF8EE]">
            {totalExamples}
          </div>
          <div className="mt-1 text-xs text-[#FDF8EE]/65">
            100% grammatically verified compounds
          </div>
        </div>

        <div className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-6">
          <div className="text-xs font-semibold text-[#F3D078]/80">
            SAMAS CATEGORIES COVERED
          </div>
          <div className="mt-2 font-mono-num text-4xl font-extrabold text-[#F3D078]">
            {SAMAS_CATEGORIES.length}
          </div>
          <div className="mt-1 text-xs text-[#FDF8EE]/65 font-devanagari">
            अव्ययीभाव · तत्पुरुष · कर्मधारय · द्विगु · द्वन्द्व · बहुव्रीहि
          </div>
        </div>

        <div className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-6">
          <div className="text-xs font-semibold text-[#F3D078]/80">
            SPINS PLAYED THIS SESSION
          </div>
          <div className="mt-2 font-mono-num text-4xl font-extrabold text-[#FDF8EE]">
            {spinCount}
          </div>
          <div className="mt-1 text-xs text-[#FDF8EE]/65">
            Every spin resulted in a learning win
          </div>
        </div>

        <div className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-6">
          <div className="text-xs font-semibold text-[#F3D078]/80">
            UNIQUE COMPOUNDS UNLOCKED
          </div>
          <div className="mt-2 font-mono-num text-4xl font-extrabold text-[#F3D078]">
            {discoveredCount} <span className="text-xl text-[#FDF8EE]/50">/ {totalExamples}</span>
          </div>
          <div className="mt-1 text-xs text-[#FDF8EE]/65">
            {Math.round((discoveredCount / Math.max(1, totalExamples)) * 100)}% of treasury explored
          </div>
        </div>
      </div>

      {/* Split Row: Fun Sanskrit Fact + Recent Session Spin Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 Columns: Interactive Fun Fact Card */}
        <div className="lg:col-span-7 rounded-2xl bg-manuscript-parchment text-[#1E060B] border-2 border-[#D4AF37] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#9A7420]/30">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#7A5411]">
                <Sparkles className="w-4 h-4 text-[#9A7420]" />
                <span>DID YOU KNOW? · संस्कृत रोचक तथ्यम्</span>
              </div>
              <span className="font-mono-num text-xs font-semibold text-[#7A5411]">
                Fact {factIndex + 1} of {SANSKRIT_FUN_FACTS.length}
              </span>
            </div>

            <h3 className="mt-5 font-devanagari text-xl sm:text-2xl font-extrabold text-[#7A1124]">
              {currentFact.title}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-[#1E060B]/90 leading-relaxed">
              {currentFact.fact}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#9A7420]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-devanagari text-base font-extrabold text-[#7A1124]">
                &ldquo;{currentFact.sanskritQuote}&rdquo;
              </div>
              <div className="text-xs text-[#3B0B17]/80 mt-0.5">
                {currentFact.quoteMeaning}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrevFact}
                aria-label="Previous Sanskrit Fact"
                className="p-2 rounded-lg bg-[#1E060B] text-[#F3D078] hover:bg-[#3B0B17] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextFact}
                aria-label="Next Sanskrit Fact"
                className="px-3.5 py-2 rounded-lg bg-[#1E060B] text-[#F3D078] hover:bg-[#3B0B17] text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Next Fact</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Recent Spins History */}
        <div className="lg:col-span-5 rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
              <span className="text-xs font-semibold text-[#F3D078]">
                RECENT SESSION SPINS
              </span>
              <span className="font-mono-num text-xs text-[#FDF8EE]/60">
                Last {spinHistory.length} results
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {spinHistory.slice(0, 5).map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="p-3 rounded-xl bg-[#120306] border border-[#D4AF37]/20 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-devanagari text-sm sm:text-base font-bold text-[#FDF8EE] truncate">
                      {item.purvapada} + {item.uttarapada} ={' '}
                      <span className="text-[#F3D078]">{item.samastapada}</span>
                    </div>
                    <div className="text-xs text-[#FDF8EE]/60 truncate">
                      {item.samasTypeSanskrit} · विग्रह: {item.vigraha}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick();
                      onSelectExample(item.id);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#2A0810] hover:bg-[#D4AF37] text-[#F3D078] hover:text-[#120407] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Replay
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
