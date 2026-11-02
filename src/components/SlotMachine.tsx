import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Keyboard,
  Filter,
  Music,
  History,
  Play,
  HelpCircle,
} from 'lucide-react';
import {
  SamasExample,
  SamasCategoryId,
  SAMAS_CATEGORIES,
  getResultLevel,
} from '../data/samasExamples';
import { PoolFilterMode } from '../hooks/useSlotMachine';
import { Reel } from './Reel';
import { Lever } from './Lever';
import { ResultCard } from './ResultCard';
import { QuizModePanel } from './QuizModePanel';
import { ParticleExplosion } from './ParticleExplosion';
import { soundEngine } from '../utils/soundEffects';
import { RESULT_LEVEL_META } from '../utils/confettiCelebration';

interface SlotMachineProps {
  examples: SamasExample[];
  activePool: SamasExample[];
  poolFilter: PoolFilterMode;
  onChangeFilter: (mode: PoolFilterMode) => void;
  currentExample: SamasExample;
  isSpinning: boolean;
  reelSpinning: [boolean, boolean, boolean];
  leverPulled: boolean;
  cabinetShake: boolean;
  showCelebration: boolean;
  spinCount: number;
  discoveredCount: number;
  spinHistory: SamasExample[];
  isMuted: boolean;
  onToggleMute: () => void;
  onSpin: (options?: { specificExampleId?: string; categoryOverride?: SamasCategoryId }) => void;
  onReset: () => void;
  onLearnSamas: (categoryId: SamasCategoryId) => void;
}

const MARQUEE_BULB_COUNT = 18;

export const SlotMachine: React.FC<SlotMachineProps> = ({
  examples,
  activePool,
  poolFilter,
  onChangeFilter,
  currentExample,
  isSpinning,
  reelSpinning,
  leverPulled,
  cabinetShake,
  showCelebration,
  spinCount,
  discoveredCount,
  spinHistory,
  isMuted,
  onToggleMute,
  onSpin,
  onReset,
  onLearnSamas,
}) => {
  const [showSoundBoard, setShowSoundBoard] = useState(false);
  const [isQuizModeOpen, setIsQuizModeOpen] = useState(false);
  const [volume, setVolume] = useState<number>(() => soundEngine.getVolume());

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = parseFloat(e.target.value);
    setVolume(nextVol);
    soundEngine.setVolume(nextVol);
    if (isMuted && nextVol > 0) {
      onToggleMute();
    }
  };

  // Prepare word strips for each reel strictly from the active category pool
  const reel1Words = useMemo(
    () =>
      activePool.map((ex) => ({
        word: ex.purvapada,
        translit: ex.purvapadaTranslit,
      })),
    [activePool]
  );

  const reel2Words = useMemo(
    () =>
      activePool.map((ex) => ({
        word: ex.uttarapada,
        translit: ex.uttarapadaTranslit,
      })),
    [activePool]
  );

  const reel3Words = useMemo(
    () =>
      activePool.map((ex) => ({
        word: ex.samastapada,
        translit: ex.samastapadaTranslit,
      })),
    [activePool]
  );

  // Count examples per category for the category selector buttons
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: examples.length,
      core5: examples.filter((e) => e.isCoreExhibition).length,
    };
    SAMAS_CATEGORIES.forEach((cat) => {
      counts[cat.id] = examples.filter((e) => e.categoryId === cat.id).length;
    });
    return counts;
  }, [examples]);

  // Active category details if a specific Samas category is selected
  const selectedCategoryInfo = useMemo(
    () => SAMAS_CATEGORIES.find((cat) => cat.id === poolFilter) || null,
    [poolFilter]
  );

  // Last 3 Samas results for the side Recent History panel
  const lastThreeResults = useMemo(() => spinHistory.slice(0, 3), [spinHistory]);

  // Current result level (common / rare / master)
  const currentLevel = useMemo(() => getResultLevel(currentExample), [currentExample]);
  const currentLevelMeta = RESULT_LEVEL_META[currentLevel];

  // Keyboard shortcuts: Space or Enter triggers spin; M toggles mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleMute();
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (target && target.tagName === 'BUTTON') return;
        e.preventDefault();
        if (!isSpinning) {
          onSpin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, onSpin, onToggleMute]);

  return (
    <section
      id="arcade-machine"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="text-xs font-semibold tracking-wider text-[#F3D078] mb-2">
          INTERACTIVE SANSKRIT GRAMMAR ARCADE · प्रत्येकं भ्रमणं ज्ञानवर्धकम्
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDF8EE] tracking-tight text-balance">
          Select a Samas &amp; <span className="text-gold-gradient">Spin the Reels</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#FDF8EE]/75">
          Choose any specific Samas category below to lock the slot machine exclusively to that
          grammatical type, or spin across all{' '}
          <span className="font-mono-num font-bold text-[#F3D078]">{examples.length}</span> verified
          Sanskrit compounds.
        </p>
      </div>

      {/* Pre-Spin Samas Category Selector Deck */}
      <div className="max-w-5xl mx-auto mb-8 rounded-2xl bg-[#1D060B] border border-[#D4AF37]/40 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F3D078]">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>SELECT SAMAS CATEGORY BEFORE SPINNING · समास-चयनम्</span>
          </div>
          <div className="text-xs text-[#FDF8EE]/70 font-mono-num">
            Active Pool: <strong className="text-[#F3D078]">{activePool.length}</strong> Verified
            Examples
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-50 ${
              poolFilter === 'all'
                ? 'bg-[#D4AF37] text-[#120407] border-[#FFF1BE] font-bold shadow-md'
                : 'bg-[#120306] text-[#FDF8EE]/85 border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
            }`}
          >
            <div className="text-xs font-bold truncate">All Categories</div>
            <div className="text-[11px] opacity-75 font-mono-num mt-0.5">
              {categoryCounts.all} examples
            </div>
          </button>

          <button
            type="button"
            disabled={isSpinning}
            onClick={() => onChangeFilter('core5')}
            className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-50 ${
              poolFilter === 'core5'
                ? 'bg-[#D4AF37] text-[#120407] border-[#FFF1BE] font-bold shadow-md'
                : 'bg-[#120306] text-[#FDF8EE]/85 border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
            }`}
          >
            <div className="text-xs font-bold truncate">Core 5 Set</div>
            <div className="text-[11px] opacity-75 font-mono-num mt-0.5">
              {categoryCounts.core5} examples
            </div>
          </button>

          {SAMAS_CATEGORIES.map((cat) => {
            const isSelected = poolFilter === cat.id;
            const shortSanskrit = cat.sanskritName.replace(' समास', '');
            return (
              <button
                key={cat.id}
                type="button"
                disabled={isSpinning}
                onClick={() => onChangeFilter(cat.id)}
                className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-50 ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#120407] border-[#FFF1BE] font-bold shadow-md'
                    : 'bg-[#120306] text-[#FDF8EE]/85 border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
                }`}
              >
                <div className="font-devanagari text-sm font-bold truncate">{shortSanskrit}</div>
                <div className="text-[11px] opacity-75 font-mono-num mt-0.5">
                  {categoryCounts[cat.id]} examples
                </div>
              </button>
            );
          })}
        </div>

        {/* Contextual Banner showing active category rule when a specific Samas is locked */}
        <div className="mt-3.5 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          {selectedCategoryInfo ? (
            <div className="flex flex-wrap items-center gap-2 text-[#FDF8EE]/90">
              <span className="font-devanagari font-bold text-[#F3D078]">
                {selectedCategoryInfo.sanskritName} ({selectedCategoryInfo.englishName})
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-devanagari text-[#FDF8EE]/80">
                {selectedCategoryInfo.pradhanaPada}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F3D078]/85">
                Reels exclusively present {selectedCategoryInfo.sanskritName} compounds
              </span>
            </div>
          ) : poolFilter === 'core5' ? (
            <div className="text-[#FDF8EE]/80">
              <strong className="text-[#F3D078]">Core 5 Exhibition Mode:</strong> Spinning strictly
              among the 5 canonical school exhibition examples (राजपुरुषः, नीलकमलम्, मातापितरौ,
              पीताम्बरः, यथाशक्ति).
            </div>
          ) : (
            <div className="text-[#FDF8EE]/80">
              <strong className="text-[#F3D078]">Full Treasury Mode:</strong> Spinning across all{' '}
              <span className="font-mono-num font-semibold">{examples.length}</span> verified
              examples spanning all 5 classical Samas types.
            </div>
          )}
        </div>
      </div>

      {/* Main Slot Machine Stage + Lever + Side 'Recent History' (Last 3 Spins) Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left/Center 9 Columns: Slot Machine Cabinet + Right-Side Mechanical Lever */}
        <motion.div
          animate={
            cabinetShake
              ? { y: [0, 5, -3, 2, 0], rotate: [0, -0.35, 0.35, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: 0.2 }}
          className="xl:col-span-9 relative flex flex-col lg:flex-row items-center justify-center gap-2"
        >
          {/* Central Vintage Luxury Arcade Cabinet */}
          <div className="relative w-full rounded-3xl p-1.5 bg-gradient-to-b from-[#F3D078] via-[#9A7420] to-[#5E4307] shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
            <div className="rounded-[20px] bg-gradient-to-b from-[#2E0812] via-[#1C050A] to-[#120306] p-4 sm:p-6 border border-[#FFF1BE]/25">
              {/* Top Marquee Bulb Strip */}
              <div
                aria-hidden="true"
                className="flex items-center justify-between px-3 py-2 mb-4 rounded-xl bg-[#120306] border border-[#D4AF37]/35"
              >
                {Array.from({ length: MARQUEE_BULB_COUNT }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-[#FFF8DC] via-[#FFE07D] to-[#D4AF37] ${
                      idx % 2 === 0 ? 'marquee-bulb-even' : 'marquee-bulb-odd'
                    }`}
                  />
                ))}
              </div>

              {/* Arcade Crown Header & Live Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 mb-5 rounded-xl bg-[#160408] border border-[#D4AF37]/40">
                <div>
                  <div className="font-devanagari text-lg sm:text-xl font-extrabold text-gold-gradient tracking-wide">
                    संस्कृत समास मशीन ·{' '}
                    {selectedCategoryInfo
                      ? selectedCategoryInfo.sanskritName
                      : 'ROYAL GRAMMAR JACKPOT'}
                  </div>
                  <div className="text-xs text-[#FDF8EE]/65">
                    {selectedCategoryInfo
                      ? `Category Locked: ${selectedCategoryInfo.transliteration} (${activePool.length} verified examples)`
                      : 'Every spin guarantees a grammatically verified Sanskrit compound'}
                  </div>
                </div>

                {/* Tabular Spin, Discovery, & Tier Counters */}
                <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[#F3D078]/70">RESULT TIER</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${currentLevelMeta.badgeClass} flex items-center gap-1`}
                    >
                      <span>{currentLevel === 'master' ? '🏆' : currentLevel === 'rare' ? '⭐' : '✨'}</span>
                      <span className="font-devanagari">{currentLevelMeta.labelHindi}</span>
                    </span>
                  </div>
                  <div className="h-7 w-px bg-[#D4AF37]/30" />
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-[#F3D078]/70">SPINS PLAYED</span>
                    <span className="font-mono-num text-lg sm:text-xl font-bold text-[#F3D078]">
                      {String(spinCount).padStart(3, '0')}
                    </span>
                  </div>
                  <div className="h-7 w-px bg-[#D4AF37]/30" />
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-[#F3D078]/70">DISCOVERED</span>
                    <span className="font-mono-num text-lg sm:text-xl font-bold text-[#FDF8EE]">
                      {discoveredCount} / {examples.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Three Synchronized Reels Stage + Particle Burst on Win */}
              <div className="relative rounded-2xl bg-[#0D0204] p-3 sm:p-5 border-2 border-[#9A7420] shadow-inner">
                {/* Framer Motion Particle Explosion over Reels when Result Reveals */}
                <ParticleExplosion
                  active={showCelebration && !isSpinning}
                  triggerKey={`reels-${currentExample.id}-${spinCount}`}
                />

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
                  {/* Reel 1: पूर्वपद */}
                  <Reel
                    reelNumber={1}
                    labelSanskrit="पूर्वपद"
                    labelEnglish="First Base Word"
                    targetWord={currentExample.purvapada}
                    targetTranslit={currentExample.purvapadaTranslit}
                    targetMeaning={currentExample.purvapadaMeaning}
                    allWords={reel1Words}
                    isSpinning={reelSpinning[0]}
                  />

                  {/* Golden '+' Connector */}
                  <div className="flex items-center justify-center md:pt-8">
                    <div className="w-8 h-8 rounded-full bg-[#2A0810] border border-[#D4AF37]/70 flex items-center justify-center font-mono-num text-lg font-bold text-[#F3D078] shadow-md shrink-0">
                      +
                    </div>
                  </div>

                  {/* Reel 2: उत्तरपद */}
                  <Reel
                    reelNumber={2}
                    labelSanskrit="उत्तरपद"
                    labelEnglish="Second Base Word"
                    targetWord={currentExample.uttarapada}
                    targetTranslit={currentExample.uttarapadaTranslit}
                    targetMeaning={currentExample.uttarapadaMeaning}
                    allWords={reel2Words}
                    isSpinning={reelSpinning[1]}
                  />

                  {/* Golden '=' Connector */}
                  <div className="flex items-center justify-center md:pt-8">
                    <div className="w-8 h-8 rounded-full bg-[#2A0810] border border-[#D4AF37]/70 flex items-center justify-center font-mono-num text-lg font-bold text-[#F3D078] shadow-md shrink-0">
                      =
                    </div>
                  </div>

                  {/* Reel 3: समस्त पद */}
                  <Reel
                    reelNumber={3}
                    labelSanskrit="समस्त पद"
                    labelEnglish="Compound Word"
                    targetWord={currentExample.samastapada}
                    targetTranslit={currentExample.samastapadaTranslit}
                    targetMeaning={currentExample.samasTypeSanskrit}
                    allWords={reel3Words}
                    isSpinning={reelSpinning[2]}
                    isResultReel={true}
                  />
                </div>
              </div>

              {/* Bottom Control Deck: Refined Mute Toggle + Volume, Sound Check, Main SPIN CTA, Reset */}
              <div className="mt-6 pt-5 border-t border-[#D4AF37]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left Utility Controls */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  {/* Refined Mute Toggle + Compact Volume Slider */}
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24070E] border border-[#D4AF37]/45">
                    <button
                      type="button"
                      onClick={onToggleMute}
                      aria-pressed={!isMuted}
                      title="Toggle Arcade Audio (Shortcut: M)"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D078] hover:text-[#FFF1BE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 text-[#F3D078]/60" />
                          <span className="text-[#FDF8EE]/65">Muted</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-[#F3D078]" />
                          <span>Audio</span>
                        </>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      aria-label="Arcade Sound Volume"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 accent-[#D4AF37] cursor-pointer h-1.5 bg-[#120306] rounded-lg"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick();
                      setIsQuizModeOpen((prev) => !prev);
                    }}
                    aria-pressed={isQuizModeOpen}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isQuizModeOpen
                        ? 'bg-[#D4AF37] text-[#120407] border-[#FFF1BE] shadow-[0_0_15px_rgba(212,175,55,0.45)]'
                        : 'bg-[#24070E] hover:bg-[#330A14] border-[#D4AF37]/50 text-[#F3D078]'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isQuizModeOpen ? 'Quiz Mode: ON' : 'Quiz Mode'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick();
                      setShowSoundBoard((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#24070E] hover:bg-[#330A14] border border-[#D4AF37]/40 text-xs font-semibold text-[#FDF8EE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Music className="w-3.5 h-3.5 text-[#F3D078]" />
                    <span>{showSoundBoard ? 'Hide FX' : 'Sound FX'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onReset}
                    disabled={isSpinning}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#24070E] hover:bg-[#330A14] border border-[#D4AF37]/40 text-xs font-semibold text-[#FDF8EE] transition-colors whitespace-nowrap shrink-0 disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#F3D078]" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Center Primary Arcade SPIN CTA */}
                <button
                  type="button"
                  onClick={() => onSpin()}
                  disabled={isSpinning}
                  className="w-full sm:w-auto min-w-[230px] px-7 py-4 rounded-xl bg-gold-button text-[#1A0408] font-display font-extrabold text-base sm:text-lg tracking-wider flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-5 h-5 text-[#3B0B17]" />
                  <span>
                    {isSpinning
                      ? 'SPINNING REELS...'
                      : selectedCategoryInfo
                      ? `SPIN ${selectedCategoryInfo.sanskritName.replace(' समास', '')}`
                      : 'SPIN REELS · चक्रं भ्रामयतु'}
                  </span>
                </button>

                {/* Keyboard Shortcut Hint */}
                <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-[#FDF8EE]/65 whitespace-nowrap shrink-0">
                  <Keyboard className="w-4 h-4 text-[#D4AF37]" />
                  <span>Space / Enter</span>
                </div>
              </div>

              {/* Expandable Vintage Arcade Sound Check Bar */}
              {showSoundBoard && (
                <div className="mt-4 pt-3.5 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#F3D078]/85 font-semibold">
                    Preview Vintage Arcade Synthesizer FX:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => soundEngine.playLeverPull()}
                      className="px-2.5 py-1.5 rounded-lg bg-[#160408] hover:bg-[#2A0810] border border-[#D4AF37]/35 text-[#FDF8EE] cursor-pointer whitespace-nowrap"
                    >
                      1. Lever Pull
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playReelTick(3, 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#160408] hover:bg-[#2A0810] border border-[#D4AF37]/35 text-[#FDF8EE] cursor-pointer whitespace-nowrap"
                    >
                      2. Reel Spin Tick
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playReelStop(2)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#160408] hover:bg-[#2A0810] border border-[#D4AF37]/35 text-[#FDF8EE] cursor-pointer whitespace-nowrap"
                    >
                      3. Reel Stop Lock
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playResultReveal()}
                      className="px-2.5 py-1.5 rounded-lg bg-[#160408] hover:bg-[#2A0810] border border-[#D4AF37]/35 text-[#FDF8EE] cursor-pointer whitespace-nowrap"
                    >
                      4. Result Reveal
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playCelebratoryJingle()}
                      className="px-2.5 py-1.5 rounded-lg bg-[#160408] hover:bg-[#2A0810] border border-[#D4AF37]/35 text-[#F3D078] font-semibold cursor-pointer whitespace-nowrap"
                    >
                      5. Celebratory Jingle
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right-Side Interactive Mechanical Lever */}
          <div className="mt-2 lg:mt-0">
            <Lever
              onPull={() => onSpin()}
              disabled={isSpinning}
              isPulled={leverPulled}
            />
          </div>
        </motion.div>

        {/* Right 3 Columns: Compact 'Recent History' Panel (Last 3 Samas Results) */}
        <aside
          aria-label="Recent History — Last 3 Samas Results"
          className="xl:col-span-3 w-full rounded-2xl bg-[#1D060B] border border-[#D4AF37]/40 p-5 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#D4AF37]/25">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#F3D078]" />
                <h3 className="font-display text-sm font-bold text-[#F3D078] tracking-wide">
                  Recent History
                </h3>
              </div>
              <span className="font-mono-num text-[11px] text-[#FDF8EE]/65">
                Last {lastThreeResults.length} Spins
              </span>
            </div>

            <p className="mt-2.5 text-xs text-[#FDF8EE]/65">
              Quick reference of the last 3 Samas combinations spun on the machine:
            </p>

            {/* Last 3 Results Cards */}
            <div className="mt-4 space-y-3">
              {lastThreeResults.map((item, idx) => {
                const isCurrent = idx === 0 && item.id === currentExample.id;
                return (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className={`rounded-xl p-3.5 border transition-colors ${
                      isCurrent
                        ? 'bg-[#2B0811] border-[#F3D078]/70 shadow-[0_0_16px_rgba(212,175,55,0.18)]'
                        : 'bg-[#120306] border-[#D4AF37]/25 hover:border-[#D4AF37]/55'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#F3D078]/85 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-num">
                          #{idx === 0 ? 'LATEST' : `-${idx}`}
                        </span>
                        {(() => {
                          const itemLevel = getResultLevel(item);
                          if (itemLevel === 'master') {
                            return (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 text-[9px] font-extrabold border border-amber-400/40">
                                🏆 MASTER
                              </span>
                            );
                          }
                          if (itemLevel === 'rare') {
                            return (
                              <span className="px-1.5 py-0.2 rounded bg-sky-500/25 text-sky-300 text-[9px] font-extrabold border border-sky-400/40">
                                ⭐ RARE
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <span className="font-devanagari font-semibold truncate">
                        {item.samasTypeSanskrit}
                      </span>
                    </div>

                    <div className="mt-1.5 font-devanagari text-lg font-extrabold text-[#FDF8EE] leading-snug">
                      {item.purvapada} <span className="text-[#D4AF37]">+</span> {item.uttarapada}{' '}
                      <span className="text-[#D4AF37]">=</span>{' '}
                      <span className="text-[#F3D078]">{item.samastapada}</span>
                    </div>

                    <div className="mt-1 text-xs text-[#FDF8EE]/75 font-devanagari">
                      विग्रहः <span className="font-semibold text-[#FDF8EE]">{item.vigraha}</span>
                    </div>

                    <div className="mt-1 text-[11px] text-[#FDF8EE]/60 line-clamp-1">
                      {item.englishMeaning}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={isSpinning}
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onSpin({ specificExampleId: item.id });
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F3D078] hover:text-[#FFF1BE] disabled:opacity-40 cursor-pointer whitespace-nowrap"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Replay Spin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onLearnSamas(item.categoryId);
                        }}
                        className="text-[11px] text-[#FDF8EE]/70 hover:text-[#F3D078] underline underline-offset-2 cursor-pointer whitespace-nowrap"
                      >
                        Study Rule
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 text-[11px] text-[#FDF8EE]/60 flex items-center justify-between">
            <span>Every spin is saved</span>
            <a
              href="#statistics"
              className="text-[#F3D078] hover:underline underline-offset-2 font-semibold"
            >
              Full Log →
            </a>
          </div>
        </aside>
      </div>

      {/* Interactive Quiz Mode Panel (Presents live question on the Samas result just spun) */}
      <AnimatePresence>
        {isQuizModeOpen && (
          <QuizModePanel
            currentExample={currentExample}
            allExamples={examples}
            isSpinning={isSpinning}
            spinCount={spinCount}
            onSpinNext={() => onSpin()}
            onClose={() => setIsQuizModeOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Section 4: Result Reveal Card directly below the machine */}
      <ResultCard
        example={currentExample}
        isSpinning={isSpinning}
        showCelebration={showCelebration}
        spinCount={spinCount}
        isQuizModeOpen={isQuizModeOpen}
        onToggleQuizMode={() => setIsQuizModeOpen((prev) => !prev)}
        onLearnSamas={onLearnSamas}
      />
    </section>
  );
};
