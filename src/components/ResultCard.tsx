import React, { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Volume2, Trophy, Star, PartyPopper, HelpCircle } from 'lucide-react';
import { SamasExample, SamasCategoryId, getResultLevel } from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';
import { ParticleExplosion } from './ParticleExplosion';
import { triggerCelebratoryConfetti, RESULT_LEVEL_META } from '../utils/confettiCelebration';

interface ResultCardProps {
  example: SamasExample;
  isSpinning: boolean;
  showCelebration: boolean;
  spinCount: number;
  isQuizModeOpen?: boolean;
  onToggleQuizMode?: () => void;
  onLearnSamas: (categoryId: SamasCategoryId) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  example,
  isSpinning,
  showCelebration,
  spinCount,
  isQuizModeOpen = false,
  onToggleQuizMode,
  onLearnSamas,
}) => {
  const level = useMemo(() => getResultLevel(example), [example]);
  const levelMeta = RESULT_LEVEL_META[level];
  const lastFiredKeyRef = useRef<string>('');

  // Trigger celebratory confetti using canvas-confetti on rare or master results
  useEffect(() => {
    if (showCelebration && !isSpinning && (level === 'rare' || level === 'master')) {
      const currentKey = `${example.id}-${spinCount}-${level}`;
      if (lastFiredKeyRef.current !== currentKey) {
        lastFiredKeyRef.current = currentKey;
        // Slight 120ms offset to sync with sound fanfare and card reveal
        const timer = window.setTimeout(() => {
          triggerCelebratoryConfetti(level);
        }, 120);
        return () => window.clearTimeout(timer);
      }
    }
  }, [showCelebration, isSpinning, level, spinCount, example.id]);

  const handlePronounceOrChime = () => {
    soundEngine.playCelebratoryJingle();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `${example.purvapada} धन ${example.uttarapada}, समस्त पदम् ${example.samastapada}। विग्रहः ${example.vigraha}। ${example.samasTypeSanskrit}।`
        );
        utterance.lang = 'hi-IN';
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback already handled by soundEngine fanfare
      }
    }
  };

  const handleManualConfetti = () => {
    soundEngine.playWinFanfare();
    triggerCelebratoryConfetti(level === 'common' ? 'rare' : level);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-8">
      {/* Framer Motion Particle Explosion Effect on Result Reveal */}
      <ParticleExplosion
        active={showCelebration && !isSpinning}
        triggerKey={`${example.id}-${spinCount}`}
      />

      <motion.div
        key={example.id + (isSpinning ? '-spinning' : `-stopped-${spinCount}`)}
        initial={{ opacity: 0.75, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className={`relative rounded-2xl border transition-all duration-300 ${
          showCelebration && !isSpinning
            ? level === 'master'
              ? 'border-amber-400 shadow-[0_0_60px_rgba(212,175,55,0.45)] ring-1 ring-amber-300/40'
              : level === 'rare'
              ? 'border-sky-400 shadow-[0_0_45px_rgba(56,189,248,0.35)] ring-1 ring-sky-300/30'
              : 'border-[#F3D078] shadow-[0_0_50px_rgba(212,175,55,0.25)]'
            : 'border-[#D4AF37]/40 shadow-2xl'
        } bg-[#1D060B] overflow-hidden`}
      >
        {/* Top Ornamental Metallic Hairline */}
        <div
          className={`h-1.5 w-full ${
            level === 'master'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_12px_#F59E0B]'
              : level === 'rare'
              ? 'bg-gradient-to-r from-sky-400 via-teal-200 to-emerald-400 shadow-[0_0_12px_#38BDF8]'
              : 'bg-gold-metallic'
          }`}
        />

        {/* Special Marquee Celebration Banner for Rare and Master results */}
        <AnimatePresence>
          {showCelebration && !isSpinning && (level === 'master' || level === 'rare') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`px-4 py-2 border-b flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
                level === 'master'
                  ? 'bg-gradient-to-r from-[#3B1525] via-[#4A154B] to-[#3B1525] text-amber-200 border-amber-400/40'
                  : 'bg-gradient-to-r from-[#0C2A38] via-[#0D382B] to-[#0C2A38] text-sky-200 border-sky-400/40'
              }`}
            >
              <div className="flex items-center gap-2">
                {level === 'master' ? (
                  <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
                ) : (
                  <Star className="w-4 h-4 text-sky-300 animate-spin" />
                )}
                <span className="font-devanagari">{levelMeta.celebrationBanner}</span>
              </div>

              <button
                type="button"
                onClick={handleManualConfetti}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 hover:bg-black/60 text-[10px] text-white border border-white/20 transition-all cursor-pointer"
                title="Celebrate again with confetti"
              >
                <PartyPopper className="w-3 h-3" />
                <span>Replay Confetti 🎊</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 sm:p-8">
          {/* Header Row: Metadata, Result Level Badge & Pronunciation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#D4AF37]/20">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-[#F3D078]/90 font-medium">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                {isSpinning
                  ? 'चक्रं भ्रमति (Reels Spinning...)'
                  : 'विजयी परिणामः (Verified Samas Reveal)'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-devanagari font-semibold text-[#FDF8EE]">
                {example.samasTypeSanskrit}
              </span>
              {example.samasSubtypeSanskrit && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-devanagari text-[#F3D078]/80">
                    {example.samasSubtypeSanskrit}
                  </span>
                </>
              )}

              {/* Result Level Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${levelMeta.badgeClass}`}
                title={levelMeta.description}
              >
                {level === 'master' ? (
                  <Trophy className="w-3 h-3 text-amber-300" />
                ) : level === 'rare' ? (
                  <Star className="w-3 h-3 text-sky-300" />
                ) : (
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                )}
                <span className="font-devanagari">{levelMeta.labelHindi}</span>
                <span className="opacity-75">({levelMeta.labelEnglish})</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onToggleQuizMode && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onToggleQuizMode();
                  }}
                  disabled={isSpinning}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap shrink-0 disabled:opacity-40 cursor-pointer ${
                    isQuizModeOpen
                      ? 'bg-[#D4AF37] text-[#120407] border-[#FFF1BE] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : 'text-[#F3D078] bg-[#2D0A12] hover:bg-[#3E0E19] border-[#D4AF37]/45'
                  }`}
                  title="Test yourself on this spun Samas result"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isQuizModeOpen ? 'Hide Quiz' : 'Quiz Mode'}</span>
                </button>
              )}

              {(level === 'rare' || level === 'master') && !isSpinning && (
                <button
                  type="button"
                  onClick={handleManualConfetti}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-200 bg-[#35121D] hover:bg-[#4D1A2A] border border-amber-400/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Fire celebratory confetti"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Confetti 🎊</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePronounceOrChime}
                disabled={isSpinning}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#FDF8EE] bg-[#2D0A12] hover:bg-[#3E0E19] border border-[#D4AF37]/40 transition-colors whitespace-nowrap shrink-0 disabled:opacity-40 cursor-pointer"
                title="Listen to Sanskrit pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#F3D078]" />
                <span>Listen Pronunciation</span>
              </button>
            </div>
          </div>

          {isSpinning ? (
            <div className="py-12 text-center">
              <p className="font-devanagari text-2xl sm:text-3xl font-bold text-[#F3D078]">
                प्रतीक्षताम्... नवीनं संस्कृत-समास-उदाहरणं प्रकटयति!
              </p>
              <p className="mt-2 text-sm text-[#FDF8EE]/70">
                Aligning Pūrvapada, Uttarapada, and Samastapada in harmony...
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left 5 Columns: Manuscript Spotlight of the Compound */}
              <motion.div
                initial={showCelebration ? { scale: 0.94, opacity: 0.8 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                className="lg:col-span-5 rounded-xl bg-manuscript-parchment text-[#1E060B] p-6 border border-[#D4AF37] flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-[#7A5411] flex items-center justify-between">
                    <span>समस्त पदम् · Final Compound</span>
                    <span className="font-mono-num">{example.samastapadaTranslit}</span>
                  </div>

                  <div className="mt-3 font-devanagari text-4xl sm:text-5xl font-extrabold text-[#7A1124] tracking-tight">
                    {example.samastapada}
                  </div>

                  {/* Compound Equation Breakdown */}
                  <div className="mt-4 pt-3 border-t border-[#9A7420]/25 flex items-center flex-wrap gap-2 text-sm font-devanagari font-bold text-[#2A0810]">
                    <span>{example.purvapada}</span>
                    <span className="text-[#9A7420]">+</span>
                    <span>{example.uttarapada}</span>
                    <span className="text-[#9A7420]">=</span>
                    <span className="text-[#7A1124]">{example.samastapada}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#9A7420]/25">
                  <div className="text-xs font-semibold text-[#7A5411]">
                    अर्थः · Meaning
                  </div>
                  <p className="mt-1 font-devanagari text-base font-bold text-[#1E060B]">
                    {example.hindiMeaning}
                  </p>
                  <p className="mt-0.5 text-sm text-[#3B0B17]/90">
                    {example.englishMeaning}
                  </p>
                </div>
              </motion.div>

              {/* Right 7 Columns: Grammatical Breakdown (Samas Type, Vigraha, Explanation) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-4 bg-[#140407]/90 rounded-xl p-6 border border-[#D4AF37]/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#D4AF37]/20">
                  <div>
                    <div className="text-xs text-[#F3D078]/75 font-medium">
                      समास का प्रकार · Samas Type
                    </div>
                    <div className="mt-1 font-devanagari text-xl sm:text-2xl font-bold text-[#F3D078]">
                      {example.samasTypeSanskrit}
                    </div>
                    <div className="text-xs text-[#FDF8EE]/70 mt-0.5">
                      {example.samasTypeEnglish}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#F3D078]/75 font-medium">
                      समास-विग्रहः · Grammatical Vigraha
                    </div>
                    <div className="mt-1 font-devanagari text-xl sm:text-2xl font-bold text-[#FDF8EE]">
                      {example.vigraha}
                    </div>
                    <div className="text-xs text-[#F3D078]/80 mt-0.5 font-mono-num">
                      {example.vigrahaTranslit}
                    </div>
                  </div>
                </div>

                {/* Grammatical Explanation */}
                <div className="space-y-2">
                  <div className="text-xs text-[#F3D078]/75 font-medium">
                    व्याकरणिक व्याख्या · Grammatical Explanation
                  </div>
                  <p className="font-devanagari text-sm sm:text-base text-[#FDF8EE]/95 leading-relaxed">
                    {example.grammaticalExplanationHindi}
                  </p>
                  <p className="text-xs sm:text-sm text-[#FDF8EE]/75 leading-relaxed">
                    {example.grammaticalExplanationEnglish}
                  </p>
                </div>

                {/* Action Button: LEARN THIS SAMAS */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#F3D078]/80">
                    Every spin produces a 100% verified Sanskrit compound!
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick();
                      onLearnSamas(example.categoryId);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-button text-[#1E060B] font-bold text-xs sm:text-sm tracking-wide cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Learn This Samas</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
