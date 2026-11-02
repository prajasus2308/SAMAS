import React from 'react';
import { Sparkles, CheckCircle2, Play } from 'lucide-react';
import {
  SAMAS_CATEGORIES,
  SamasCategoryId,
  SamasExample,
} from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';

interface SamasLearningProps {
  activeCategoryId: SamasCategoryId;
  onSelectCategory: (id: SamasCategoryId) => void;
  examples: SamasExample[];
  onSpinCategoryExample: (categoryId: SamasCategoryId, specificExampleId?: string) => void;
}

export const SamasLearning: React.FC<SamasLearningProps> = ({
  activeCategoryId,
  onSelectCategory,
  examples,
  onSpinCategoryExample,
}) => {
  const activeCategory =
    SAMAS_CATEGORIES.find((c) => c.id === activeCategoryId) || SAMAS_CATEGORIES[0];

  const categoryExamples = examples.filter((ex) => ex.categoryId === activeCategory.id);

  return (
    <section
      id="learn-samas"
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20"
    >
      {/* Section Heading */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="text-xs font-semibold tracking-wider text-[#F3D078] mb-2">
          01. GRAMMATICAL FOUNDATIONS · षट् प्रमुख समास भेदाः
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDF8EE] tracking-tight text-balance">
          Learn the Six Major Types of <span className="text-gold-gradient">Sanskrit Samas</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#FDF8EE]/75">
          In Sanskrit grammar (<span className="font-devanagari text-[#F3D078]">समसनं समासः</span>),
          compounding condenses multiple related words into one unified expression. Select any
          category below to study its structure, Vigraha rule, and verified examples.
        </p>
      </div>

      {/* Interactive Category Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {SAMAS_CATEGORIES.map((cat, idx) => {
          const isSelected = cat.id === activeCategory.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onSelectCategory(cat.id);
              }}
              className={`px-4 py-3 rounded-xl border text-left transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-[#D4AF37] text-[#140407] border-[#FFF1BE] shadow-[0_0_24px_rgba(212,175,55,0.3)] font-bold'
                  : 'bg-[#1D060B] text-[#FDF8EE]/85 border-[#D4AF37]/30 hover:border-[#D4AF37]/70'
              }`}
            >
              <span className="font-mono-num text-xs opacity-75">0{idx + 1}.</span>
              <span className="font-devanagari text-base sm:text-lg font-bold">
                {cat.sanskritName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Educational Spotlight Deck for Active Samas Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 Columns: Hindi & English Explanations + Grammatical Formula */}
        <div className="lg:col-span-7 rounded-2xl bg-[#1D060B] border border-[#D4AF37]/40 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Title & Unboxed Dominance Metadata */}
            <div className="pb-5 border-b border-[#D4AF37]/20">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#F3D078]">
                <span>{activeCategory.transliteration}</span>
                <span aria-hidden="true">·</span>
                <span>{activeCategory.englishName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-devanagari">{activeCategory.pradhanaPada}</span>
              </div>

              <h3 className="mt-2 font-devanagari text-3xl sm:text-4xl font-extrabold text-gold-gradient">
                {activeCategory.sanskritName}
              </h3>
            </div>

            {/* Structural Formula Box */}
            <div className="p-4 rounded-xl bg-[#120306] border border-[#D4AF37]/30">
              <div className="text-xs font-semibold text-[#F3D078]/80 mb-1">
                संरचना सूत्र · Structural Formula
              </div>
              <div className="font-devanagari text-base sm:text-lg font-bold text-[#FDF8EE]">
                {activeCategory.formula}
              </div>
            </div>

            {/* Simple Hindi Explanation */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-[#F3D078] mb-1.5">
                हिन्दी व्याख्या (Simple Hindi Explanation)
              </h4>
              <p className="font-devanagari text-base sm:text-lg text-[#FDF8EE]/95 leading-relaxed">
                {activeCategory.hindiExplanation}
              </p>
            </div>

            {/* English Explanation */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-[#F3D078] mb-1.5">
                English Explanation
              </h4>
              <p className="text-sm sm:text-base text-[#FDF8EE]/80 leading-relaxed">
                {activeCategory.englishExplanation}
              </p>
            </div>

            {/* Identification Rule */}
            <div className="pt-2 border-t border-[#D4AF37]/20 flex items-start gap-2.5 text-xs sm:text-sm text-[#F3D078]">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                <strong>How to Recognize:</strong> {activeCategory.keyIdentificationRule}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#FDF8EE]/65">
              Want to see {activeCategory.sanskritName} in action on the reels?
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onSpinCategoryExample(activeCategory.id);
              }}
              className="px-5 py-2.5 rounded-xl bg-gold-button text-[#1A0408] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Spin {activeCategory.sanskritName} on Machine</span>
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Visual Example Card + Verified Examples List in this Category */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Canonical Visual Example Manuscript Card */}
          <div className="rounded-2xl bg-manuscript-parchment text-[#1E060B] p-6 sm:p-7 border-2 border-[#D4AF37] shadow-xl">
            <div className="text-xs font-bold tracking-wider text-[#7A5411]">
              VISUAL EXAMPLE CARD · प्रमाणित उदाहरणम्
            </div>

            {/* Visual 3-Part Diagram */}
            <div className="mt-4 grid grid-cols-3 gap-2 items-center text-center">
              <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#9A7420]/40">
                <div className="text-[10px] font-semibold text-[#7A5411]">पूर्वपद</div>
                <div className="mt-1 font-devanagari text-xl font-extrabold text-[#1E060B]">
                  {activeCategory.canonicalExample.purvapada}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#9A7420]/40">
                <div className="text-[10px] font-semibold text-[#7A5411]">उत्तरपद</div>
                <div className="mt-1 font-devanagari text-xl font-extrabold text-[#1E060B]">
                  {activeCategory.canonicalExample.uttarapada}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#7A1124] text-[#FDF8EE] border border-[#D4AF37]">
                <div className="text-[10px] font-semibold text-[#F3D078]">समस्त पद</div>
                <div className="mt-1 font-devanagari text-xl font-extrabold">
                  {activeCategory.canonicalExample.samastapada}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#9A7420]/30 space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-[#7A5411]">विग्रहः (Vigraha):</span>
                <span className="font-devanagari text-lg font-extrabold text-[#7A1124]">
                  {activeCategory.canonicalExample.vigraha}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-[#7A5411]">अर्थः (Meaning):</span>
                <span className="font-devanagari text-sm font-bold text-[#1E060B] text-right">
                  {activeCategory.canonicalExample.meaning}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive List of Examples in this Category */}
          <div className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#F3D078] mb-3">
                VERIFIED EXAMPLES IN THIS CATEGORY ({categoryExamples.length})
              </div>

              <div className="space-y-2.5">
                {categoryExamples.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-[#120306] border border-[#D4AF37]/25 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-devanagari text-base font-bold text-[#FDF8EE] truncate">
                        {ex.purvapada} + {ex.uttarapada} ={' '}
                        <span className="text-[#F3D078]">{ex.samastapada}</span>
                      </div>
                      <div className="text-xs text-[#FDF8EE]/65 truncate">
                        विग्रह: <span className="font-devanagari">{ex.vigraha}</span> ·{' '}
                        {ex.englishMeaning}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playButtonClick();
                        onSpinCategoryExample(ex.categoryId, ex.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#2A0810] hover:bg-[#D4AF37] text-[#F3D078] hover:text-[#120407] border border-[#D4AF37]/40 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Load on Reels</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
