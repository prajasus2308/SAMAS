import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  ArrowRight,
  RotateCw,
  BookOpen,
  Flame,
  X,
} from 'lucide-react';
import { SamasExample, SAMAS_CATEGORIES } from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';
import { triggerCelebratoryConfetti } from '../utils/confettiCelebration';

export type QuizQuestionType = 'samas_type' | 'vigraha' | 'meaning';

interface QuizOption {
  id: string;
  primaryText: string;
  secondaryText: string;
  isCorrect: boolean;
}

interface GeneratedQuizQuestion {
  type: QuizQuestionType;
  badgeHindi: string;
  badgeEnglish: string;
  promptSanskrit: string;
  promptEnglish: string;
  options: QuizOption[];
  explanationHindi: string;
  explanationEnglish: string;
}

interface QuizModePanelProps {
  currentExample: SamasExample;
  allExamples: SamasExample[];
  isSpinning: boolean;
  spinCount: number;
  onSpinNext: () => void;
  onClose: () => void;
}

// Deterministic pseudo-shuffle seeded by example id + question type + spinCount
function seededShuffle<T>(items: T[], seedStr: string): T[] {
  const arr = [...items];
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0;
    const j = Math.abs(hash) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuizModePanel: React.FC<QuizModePanelProps> = ({
  currentExample,
  allExamples,
  isSpinning,
  spinCount,
  onSpinNext,
  onClose,
}) => {
  const [questionType, setQuestionType] = useState<QuizQuestionType>('samas_type');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Reset selected answer whenever a new spin finishes or question type changes
  useEffect(() => {
    setSelectedOptionId(null);
  }, [currentExample.id, spinCount, questionType]);

  // Build the active question based on the Samas result just spun
  const question: GeneratedQuizQuestion = useMemo(() => {
    const seed = `${currentExample.id}-${spinCount}-${questionType}`;

    if (questionType === 'samas_type') {
      const correctCat = SAMAS_CATEGORIES.find((c) => c.id === currentExample.categoryId);
      const otherCats = seededShuffle(
        SAMAS_CATEGORIES.filter((c) => c.id !== currentExample.categoryId),
        seed
      ).slice(0, 3);

      const rawOptions: QuizOption[] = [
        {
          id: currentExample.categoryId,
          primaryText: currentExample.samasTypeSanskrit,
          secondaryText: correctCat ? correctCat.englishName : currentExample.samasTypeEnglish,
          isCorrect: true,
        },
        ...otherCats.map((cat) => ({
          id: cat.id,
          primaryText: cat.sanskritName,
          secondaryText: cat.englishName,
          isCorrect: false,
        })),
      ];

      return {
        type: 'samas_type',
        badgeHindi: 'प्रश्न १: समास-भेद पहचानें',
        badgeEnglish: 'Identify Samas Category',
        promptSanskrit: `‘${currentExample.samastapada}’ (${currentExample.purvapada} + ${currentExample.uttarapada}) इति समस्तपदे कः समासः अस्ति?`,
        promptEnglish: `Which type of Samas is formed in the spun compound ‘${currentExample.samastapada}’ (${currentExample.samastapadaTranslit})?`,
        options: seededShuffle(rawOptions, seed + '-opts'),
        explanationHindi: `${currentExample.samastapada} = ${currentExample.vigraha} (${currentExample.samasTypeSanskrit})। ${currentExample.grammaticalExplanationHindi}`,
        explanationEnglish: `${currentExample.grammaticalExplanationEnglish}`,
      };
    }

    if (questionType === 'vigraha') {
      const distractors = seededShuffle(
        allExamples.filter(
          (ex) => ex.id !== currentExample.id && ex.vigraha !== currentExample.vigraha
        ),
        seed
      ).slice(0, 3);

      const rawOptions: QuizOption[] = [
        {
          id: `vigraha-${currentExample.id}`,
          primaryText: currentExample.vigraha,
          secondaryText: currentExample.vigrahaTranslit,
          isCorrect: true,
        },
        ...distractors.map((ex) => ({
          id: `vigraha-${ex.id}`,
          primaryText: ex.vigraha,
          secondaryText: ex.vigrahaTranslit,
          isCorrect: false,
        })),
      ];

      return {
        type: 'vigraha',
        badgeHindi: 'प्रश्न २: समास-विग्रह चुनें',
        badgeEnglish: 'Identify Grammatical Vigraha',
        promptSanskrit: `‘${currentExample.samastapada}’ इत्यस्य शुद्धः समास-विग्रहः कः?`,
        promptEnglish: `What is the correct grammatical Vigraha (expansion) for ‘${currentExample.samastapada}’?`,
        options: seededShuffle(rawOptions, seed + '-opts'),
        explanationHindi: `‘${currentExample.samastapada}’ का सही विग्रह ‘${currentExample.vigraha}’ है (${currentExample.samasTypeSanskrit})।`,
        explanationEnglish: `The compound ‘${currentExample.samastapada}’ expands to ‘${currentExample.vigraha}’ (${currentExample.englishMeaning}).`,
      };
    }

    // questionType === 'meaning'
    const distractors = seededShuffle(
      allExamples.filter(
        (ex) => ex.id !== currentExample.id && ex.hindiMeaning !== currentExample.hindiMeaning
      ),
      seed
    ).slice(0, 3);

    const rawOptions: QuizOption[] = [
      {
        id: `meaning-${currentExample.id}`,
        primaryText: currentExample.hindiMeaning,
        secondaryText: currentExample.englishMeaning,
        isCorrect: true,
      },
      ...distractors.map((ex) => ({
        id: `meaning-${ex.id}`,
        primaryText: ex.hindiMeaning,
        secondaryText: ex.englishMeaning,
        isCorrect: false,
      })),
    ];

    return {
      type: 'meaning',
      badgeHindi: 'प्रश्न ३: सही अर्थ पहचानें',
      badgeEnglish: 'Identify Compound Meaning',
      promptSanskrit: `‘${currentExample.samastapada}’ (${currentExample.purvapada} + ${currentExample.uttarapada}) इत्यस्य उचितः अर्थः कः?`,
      promptEnglish: `What is the accurate meaning of the Sanskrit compound ‘${currentExample.samastapada}’?`,
      options: seededShuffle(rawOptions, seed + '-opts'),
      explanationHindi: `‘${currentExample.samastapada}’ का अर्थ है: ${currentExample.hindiMeaning}।`,
      explanationEnglish: `Meaning: ${currentExample.englishMeaning}. ${currentExample.grammaticalExplanationEnglish}`,
    };
  }, [currentExample, allExamples, spinCount, questionType]);

  const selectedOption = useMemo(
    () => question.options.find((o) => o.id === selectedOptionId) || null,
    [question.options, selectedOptionId]
  );

  const handleSelectOption = (option: QuizOption) => {
    if (selectedOptionId || isSpinning) return;

    setSelectedOptionId(option.id);
    setTotalAnswered((prev) => prev + 1);

    if (option.isCorrect) {
      soundEngine.playCelebratoryJingle('rare');
      triggerCelebratoryConfetti('rare');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      soundEngine.playIndividualReelStop(0);
      setStreak(0);
    }
  };

  const handleCycleQuestionType = () => {
    soundEngine.playButtonClick();
    const order: QuizQuestionType[] = ['samas_type', 'vigraha', 'meaning'];
    const nextIdx = (order.indexOf(questionType) + 1) % order.length;
    setQuestionType(order[nextIdx]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
      className="relative w-full max-w-5xl mx-auto mt-6 rounded-2xl p-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF1BE] to-[#9A7420] shadow-[0_20px_55px_rgba(0,0,0,0.8)]"
    >
      <div className="rounded-[14px] bg-gradient-to-b from-[#290710] via-[#1B050A] to-[#120306] p-5 sm:p-7 text-[#FDF8EE]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3D078] to-[#B8891E] text-[#1A0408] flex items-center justify-center font-extrabold shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-widest uppercase text-[#F3D078]">
                  INTERACTIVE QUIZ MODE · समास प्रश्नोत्तरी
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold text-amber-300">
                  LIVE SPIN CHALLENGE
                </span>
              </div>
              <p className="text-xs text-[#FDF8EE]/70 mt-0.5">
                Test your knowledge on the compound just spun on the reels with instant feedback!
              </p>
            </div>
          </div>

          {/* Scoreboard & Close Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#120306] border border-[#D4AF37]/35 text-xs">
              <div className="flex items-center gap-1 text-[#F3D078] font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono-num">
                  {score} / {totalAnswered}
                </span>
              </div>
              <span className="text-[#D4AF37]/40">|</span>
              <div className="flex items-center gap-1 text-orange-300 font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Streak: {streak}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onClose();
              }}
              className="p-2 rounded-lg bg-[#1A0409] hover:bg-[#340A15] text-[#F3D078] border border-[#D4AF37]/30 transition-colors cursor-pointer"
              title="Close Quiz Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Mode Tabs (Samas Type / Vigraha / Meaning) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#120306] border border-[#D4AF37]/30">
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setQuestionType('samas_type');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                questionType === 'samas_type'
                  ? 'bg-[#D4AF37] text-[#120407] shadow'
                  : 'text-[#FDF8EE]/75 hover:text-[#F3D078]'
              }`}
            >
              १. समास-भेद (Samas Type)
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setQuestionType('vigraha');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                questionType === 'vigraha'
                  ? 'bg-[#D4AF37] text-[#120407] shadow'
                  : 'text-[#FDF8EE]/75 hover:text-[#F3D078]'
              }`}
            >
              २. विग्रहः (Vigraha)
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setQuestionType('meaning');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                questionType === 'meaning'
                  ? 'bg-[#D4AF37] text-[#120407] shadow'
                  : 'text-[#FDF8EE]/75 hover:text-[#F3D078]'
              }`}
            >
              ३. अर्थः (Meaning)
            </button>
          </div>

          {/* Spun Word Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#190409] border border-[#D4AF37]/40 text-xs">
            <span className="text-[#F3D078]/80">Current Spin:</span>
            <span className="font-devanagari font-extrabold text-base text-[#FFF1BE]">
              {currentExample.purvapada} + {currentExample.uttarapada} = {currentExample.samastapada}
            </span>
          </div>
        </div>

        {/* Main Quiz Body */}
        {isSpinning ? (
          <div className="py-10 text-center space-y-2">
            <Sparkles className="w-7 h-7 text-[#F3D078] animate-spin mx-auto" />
            <div className="font-devanagari text-xl font-bold text-[#F3D078]">
              चक्रं भ्रमति... नूतनः प्रश्नः सज्जीक्रियते!
            </div>
            <p className="text-xs text-[#FDF8EE]/70">
              Spinning the reels to generate your next live Sanskrit Samas quiz question...
            </p>
          </div>
        ) : (
          <div className="mt-5">
            {/* Question Prompt Box */}
            <div className="rounded-xl bg-[#140307] border border-[#D4AF37]/35 p-4 sm:p-5 mb-5">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#F3D078] mb-1.5">
                <span>{question.badgeHindi}</span>
                <span>·</span>
                <span>{question.badgeEnglish}</span>
              </div>
              <h3 className="font-devanagari text-xl sm:text-2xl font-extrabold text-[#FFF3D1] leading-snug">
                {question.promptSanskrit}
              </h3>
              <p className="text-xs sm:text-sm text-[#FDF8EE]/80 mt-1">
                {question.promptEnglish}
              </p>
            </div>

            {/* 4 Interactive Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {question.options.map((option, idx) => {
                const isAnswered = Boolean(selectedOptionId);
                const isSelected = selectedOptionId === option.id;

                let cardStyle =
                  'bg-[#1D060B] hover:bg-[#2C0912] border-[#D4AF37]/35 text-[#FDF8EE]';
                if (isAnswered) {
                  if (option.isCorrect) {
                    cardStyle =
                      'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
                  } else if (isSelected && !option.isCorrect) {
                    cardStyle = 'bg-rose-950/70 border-rose-400 text-rose-100';
                  } else {
                    cardStyle = 'bg-[#120306]/60 border-[#D4AF37]/15 text-[#FDF8EE]/45';
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left rounded-xl p-4 border-2 transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#F3D078] font-mono-num text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-devanagari text-lg font-extrabold leading-snug truncate">
                          {option.primaryText}
                        </div>
                        <div className="text-xs opacity-75 truncate mt-0.5">
                          {option.secondaryText}
                        </div>
                      </div>
                    </div>

                    {isAnswered && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback Banner */}
            <AnimatePresence>
              {selectedOption && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`mt-5 rounded-xl p-4 sm:p-5 border ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-100'
                      : 'bg-amber-950/50 border-amber-400/60 text-amber-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 font-devanagari text-base sm:text-lg font-extrabold">
                        {selectedOption.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300">
                              समीचीनम् उत्तरम्! अद्भुतम्! (Correct Answer!)
                            </span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                            <span className="text-amber-300">
                              अभ्यासः क्रियताम्! शुद्धम् उत्तरम् पश्यतु (Learn the Correct Answer):
                            </span>
                          </>
                        )}
                      </div>

                      <p className="font-devanagari text-sm text-[#FDF8EE] leading-relaxed">
                        {question.explanationHindi}
                      </p>
                      <p className="text-xs text-[#FDF8EE]/80 leading-relaxed">
                        {question.explanationEnglish}
                      </p>
                    </div>

                    {/* Action Buttons after answering */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCycleQuestionType}
                        className="px-4 py-2.5 rounded-xl bg-[#250710] hover:bg-[#380B18] text-[#F3D078] border border-[#D4AF37]/45 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>अगला प्रश्न (Next Question)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onSpinNext();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gold-button text-[#1A0408] text-xs font-extrabold inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Spin &amp; Quiz Again</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
