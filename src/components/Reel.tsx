import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface ReelProps {
  reelNumber: 1 | 2 | 3;
  labelSanskrit: string;
  labelEnglish: string;
  targetWord: string;
  targetTranslit: string;
  targetMeaning: string;
  allWords: { word: string; translit: string }[];
  isSpinning: boolean;
  isResultReel?: boolean;
}

export const Reel: React.FC<ReelProps> = ({
  reelNumber,
  labelSanskrit,
  labelEnglish,
  targetWord,
  targetTranslit,
  targetMeaning,
  allWords,
  isSpinning,
  isResultReel = false,
}) => {
  // Build a repeating vertical strip for the high-speed spinning blur loop
  const spinningStrip = useMemo(() => {
    const base = allWords.length > 0 ? allWords : [{ word: targetWord, translit: targetTranslit }];
    return [...base, ...base, ...base];
  }, [allWords, targetWord, targetTranslit]);

  // Neighboring words on the drum above and below the center payline
  const { upperNeighbor, lowerNeighbor } = useMemo(() => {
    const idx = allWords.findIndex((w) => w.word === targetWord);
    const safeIdx = idx >= 0 ? idx : 0;
    const prevIdx = (safeIdx - 1 + allWords.length) % allWords.length;
    const nextIdx = (safeIdx + 1) % allWords.length;
    return {
      upperNeighbor: allWords[prevIdx] || { word: 'संस्कृतम्', translit: 'saṃskṛtam' },
      lowerNeighbor: allWords[nextIdx] || { word: 'व्याकरणम्', translit: 'vyākaraṇam' },
    };
  }, [allWords, targetWord]);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Reel Header Plaque */}
      <div className="mb-2.5 flex items-center justify-between px-3 py-1.5 rounded-t-lg bg-[#1E060B] border border-[#D4AF37]/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono-num text-xs font-semibold text-[#D4AF37]/80">
            0{reelNumber}
          </span>
          <span className="font-devanagari text-sm sm:text-base font-bold text-[#F3D078] truncate">
            {labelSanskrit}
          </span>
        </div>
        <span className="text-[11px] text-[#FDF8EE]/65 whitespace-nowrap shrink-0 hidden sm:inline">
          {labelEnglish}
        </span>
      </div>

      {/* 3D Cylindrical Reel Drum Window */}
      <div
        className={`relative h-56 sm:h-64 rounded-xl overflow-hidden border-2 transition-colors duration-300 ${
          !isSpinning && isResultReel
            ? 'border-[#F3D078] shadow-[0_0_28px_rgba(212,175,55,0.35)]'
            : 'border-[#9A7420]'
        } bg-[#FDF7E7] text-[#1E060B]`}
      >
        {/* Subtle Manuscript Horizontal Payline Guides */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 sm:h-28 border-y border-[#D4AF37]/55 bg-[#D4AF37]/10 z-10" />

        {/* Left & Right Gold Payline Pointers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-5 bg-[#D4AF37] clip-path-triangle z-20 rounded-r"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-5 bg-[#D4AF37] z-20 rounded-l"
        />

        {isSpinning ? (
          /* High-speed vertical spinning strip with realistic motion blur */
          <motion.div
            className="flex flex-col items-center py-4 filter blur-[1.2px]"
            animate={{ y: ['0%', '-66.66%'] }}
            transition={{
              duration: 0.42,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {spinningStrip.map((item, i) => (
              <div
                key={`${item.word}-${i}`}
                className="h-20 flex flex-col items-center justify-center select-none px-2"
              >
                <span className="font-devanagari text-2xl sm:text-3xl font-extrabold text-[#2A0810]/85 tracking-wide">
                  {item.word}
                </span>
                <span className="text-xs text-[#6B4C08]/75 font-medium">
                  {item.translit}
                </span>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Locked Reel Drum Position with realistic spring bounce */
          <motion.div
            key={targetWord}
            initial={{ y: -38, scaleY: 1.06 }}
            animate={{ y: 0, scaleY: 1 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 22,
              mass: 0.9,
            }}
            className="h-full flex flex-col items-center justify-between py-2.5 px-2 select-none"
          >
            {/* Upper curved drum neighbor (dimmed) */}
            <div className="opacity-30 scale-90 flex flex-col items-center pointer-events-none">
              <span className="font-devanagari text-base sm:text-lg font-bold text-[#3B0B17] truncate max-w-full">
                {upperNeighbor.word}
              </span>
            </div>

            {/* Active Payline Word (Center Focal Anchor) */}
            <div className="flex flex-col items-center justify-center text-center z-10 px-1 py-1">
              <span
                className={`font-devanagari text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight ${
                  isResultReel ? 'text-[#7A1124]' : 'text-[#1E060B]'
                }`}
              >
                {targetWord}
              </span>
              <span className="mt-1 text-xs sm:text-sm font-semibold text-[#7A5411] tracking-wide">
                {targetTranslit}
              </span>
              <span className="mt-0.5 text-[11px] text-[#3B0B17]/80 line-clamp-1 max-w-[180px]">
                {targetMeaning}
              </span>
            </div>

            {/* Lower curved drum neighbor (dimmed) */}
            <div className="opacity-30 scale-90 flex flex-col items-center pointer-events-none">
              <span className="font-devanagari text-base sm:text-lg font-bold text-[#3B0B17] truncate max-w-full">
                {lowerNeighbor.word}
              </span>
            </div>
          </motion.div>
        )}

        {/* 3D Cylindrical Shadow & Specular Glass Reflection Overlay */}
        <div className="pointer-events-none absolute inset-0 reel-cylinder-overlay z-20" />
      </div>
    </div>
  );
};
