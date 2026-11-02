import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, BookOpen } from 'lucide-react';
import { SamasExample } from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';

interface HeroProps {
  currentExample: SamasExample;
  onSpinNowClick: () => void;
  onExploreGrammarClick: () => void;
}

const FLOATING_PARTICLES = [
  { left: '8%', top: '18%', size: 4, duration: 5.2, delay: 0.2 },
  { left: '19%', top: '74%', size: 6, duration: 6.4, delay: 1.1 },
  { left: '34%', top: '14%', size: 3, duration: 4.8, delay: 0.7 },
  { left: '52%', top: '82%', size: 5, duration: 5.9, delay: 1.5 },
  { left: '68%', top: '22%', size: 4, duration: 6.1, delay: 0.4 },
  { left: '84%', top: '66%', size: 6, duration: 5.5, delay: 0.9 },
  { left: '91%', top: '28%', size: 3, duration: 4.9, delay: 1.8 },
];

export const Hero: React.FC<HeroProps> = ({
  currentExample,
  onSpinNowClick,
  onExploreGrammarClick,
}) => {
  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-8 border-b border-[#D4AF37]/20">
      {/* Radial Vintage Casino Burgundy & Gold Ambient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(148,27,47,0.38)_0%,rgba(42,8,16,0.65)_48%,rgba(18,4,7,1)_100%)]"
      />

      {/* Subtle Floating Gold Dust Particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {FLOATING_PARTICLES.map((p, idx) => (
          <motion.span
            key={idx}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -22, 0],
              opacity: [0.2, 0.75, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-[#F3D078] shadow-[0_0_10px_#D4AF37]"
          />
        ))}
      </div>

      {/* Main 12-Column Split Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center py-6">
        {/* Left 7 Columns: Editorial Typography & Primary CTAs */}
        <div className="lg:col-span-7 text-left space-y-6">
          {/* Unboxed Kicker Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#F3D078]">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-white font-bold text-[11px]">
              DAV MODEL SCHOOL
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-devanagari text-amber-200">॥ ज्ञानम् एव शक्तिः ॥</span>
            <span aria-hidden="true">·</span>
            <span>EVERY SPIN IS A WIN!</span>
            <span aria-hidden="true">·</span>
            <span className="font-devanagari">संस्कृत व्याकरण प्रदर्शनी</span>
          </div>

          {/* Main Heading in Devanagari + Luxury Subtitle */}
          <div className="space-y-3">
            <h1 className="font-devanagari text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gold-gradient tracking-tight leading-[1.15]">
              संस्कृत समास मशीन
            </h1>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FDF8EE] tracking-tight text-balance">
              Discover the Magic of Sanskrit Compounds.
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#FDF8EE]/80 max-w-2xl leading-relaxed">
            Spin the reels, discover Sanskrit words, and learn the fascinating world of Samas.
            Every combination is a new lesson — uniting{' '}
            <span className="font-devanagari font-semibold text-[#F3D078]">पूर्वपद</span> and{' '}
            <span className="font-devanagari font-semibold text-[#F3D078]">उत्तरपद</span> into a
            meaningful{' '}
            <span className="font-devanagari font-semibold text-[#F3D078]">समस्त पद</span>!
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onSpinNowClick();
              }}
              className="px-8 py-4 rounded-xl bg-gold-button text-[#1A0408] font-display font-extrabold text-base sm:text-lg tracking-wider inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-5 h-5 text-[#3B0B17]" />
              <span>SPIN NOW · अभी खेलें</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onExploreGrammarClick();
              }}
              className="px-6 py-4 rounded-xl bg-[#24070E]/90 hover:bg-[#340A15] text-[#FDF8EE] border border-[#D4AF37]/45 font-semibold text-sm sm:text-base inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 text-[#F3D078]" />
              <span>Explore 6 Samas Types</span>
            </button>
          </div>

          {/* Unboxed Proof Summary Strip */}
          <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#FDF8EE]/70">
            <span>
              <strong className="font-mono-num text-[#F3D078]">100%</strong> Valid Sanskrit Outputs
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong className="font-mono-num text-[#F3D078]">6</strong> Classical Samas Categories
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero Losing Spins — Every Spin Teaches</span>
          </div>
        </div>

        {/* Right 5 Columns: 3D-Style Luxury Slot Machine Illustration & Live Preview */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md rounded-3xl p-1.5 bg-gradient-to-b from-[#FFF1BE] via-[#D4AF37] to-[#6B4C08] shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
            <div className="rounded-[20px] bg-gradient-to-b from-[#330914] via-[#1E050B] to-[#120306] p-5 sm:p-6 border border-[#FFF1BE]/30">
              {/* Top Animated Marquee Arch */}
              <div className="flex items-center justify-between px-3 py-2 mb-4 rounded-xl bg-[#120306] border border-[#D4AF37]/40">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full bg-[#FFE07D] ${
                      i % 2 === 0 ? 'marquee-bulb-even' : 'marquee-bulb-odd'
                    }`}
                  />
                ))}
              </div>

              {/* Mini Crown Banner */}
              <div className="text-center mb-4">
                <div className="text-[11px] font-bold tracking-widest text-[#F3D078]/80">
                  SANSKRIT SAMAS SLOT MACHINE
                </div>
                <div className="font-devanagari text-xl font-extrabold text-gold-gradient mt-0.5">
                  प्रत्येकं चक्रं विजयः!
                </div>
              </div>

              {/* Three Visible Preview Reels */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#0B0204] border-2 border-[#9A7420]">
                {/* Reel 1 Preview */}
                <div className="flex flex-col items-center">
                  <span className="font-devanagari text-[11px] font-bold text-[#F3D078] mb-1.5">
                    १. पूर्वपद
                  </span>
                  <div className="w-full h-28 rounded-lg bg-[#FDF7E7] text-[#1E060B] border border-[#D4AF37] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    <span className="font-devanagari text-xl sm:text-2xl font-extrabold text-[#1E060B]">
                      {currentExample.purvapada}
                    </span>
                    <span className="text-[11px] text-[#7A5411] font-medium mt-1">
                      {currentExample.purvapadaTranslit}
                    </span>
                    <div className="pointer-events-none absolute inset-0 reel-cylinder-overlay" />
                  </div>
                </div>

                {/* Reel 2 Preview */}
                <div className="flex flex-col items-center">
                  <span className="font-devanagari text-[11px] font-bold text-[#F3D078] mb-1.5">
                    २. उत्तरपद
                  </span>
                  <div className="w-full h-28 rounded-lg bg-[#FDF7E7] text-[#1E060B] border border-[#D4AF37] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    <span className="font-devanagari text-xl sm:text-2xl font-extrabold text-[#1E060B]">
                      {currentExample.uttarapada}
                    </span>
                    <span className="text-[11px] text-[#7A5411] font-medium mt-1">
                      {currentExample.uttarapadaTranslit}
                    </span>
                    <div className="pointer-events-none absolute inset-0 reel-cylinder-overlay" />
                  </div>
                </div>

                {/* Reel 3 Preview */}
                <div className="flex flex-col items-center">
                  <span className="font-devanagari text-[11px] font-bold text-[#F3D078] mb-1.5">
                    ३. समस्त पद
                  </span>
                  <div className="w-full h-28 rounded-lg bg-[#FDF7E7] text-[#7A1124] border-2 border-[#F3D078] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    <span className="font-devanagari text-xl sm:text-2xl font-extrabold text-[#7A1124]">
                      {currentExample.samastapada}
                    </span>
                    <span className="text-[11px] text-[#7A5411] font-medium mt-1">
                      {currentExample.samastapadaTranslit}
                    </span>
                    <div className="pointer-events-none absolute inset-0 reel-cylinder-overlay" />
                  </div>
                </div>
              </div>

              {/* Mini Vigraha Readout Window */}
              <div className="mt-4 px-4 py-3 rounded-xl bg-[#180409] border border-[#D4AF37]/35 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-[#F3D078]/75">
                    {currentExample.samasTypeSanskrit} · विग्रहः
                  </div>
                  <div className="font-devanagari text-sm sm:text-base font-bold text-[#FDF8EE] truncate">
                    {currentExample.vigraha}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onSpinNowClick();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-gold-button text-[#1A0408] font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Try Spin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator at Bottom of Hero */}
      <div className="relative z-10 flex justify-center pt-4">
        <a
          href="#arcade-machine"
          aria-label="Scroll down to main slot machine"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#F3D078]/80 hover:text-[#F3D078] transition-colors"
        >
          <span>SCROLL TO PLAY THE MACHINE</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
