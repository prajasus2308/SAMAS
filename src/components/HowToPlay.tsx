import React from 'react';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface HowToPlayProps {
  onStartPlaying: () => void;
}

const STEPS = [
  {
    number: '01.',
    title: 'Pull the Lever or Press Spin',
    sanskritSubtitle: 'यन्त्रं सञ्चालयतु',
    description:
      'Click or drag down the mechanical gold lever on the right side of the arcade cabinet, press the golden SPIN button, or hit the Spacebar to set the three Sanskrit drums in motion.',
  },
  {
    number: '02.',
    title: 'Watch the Three Reels Align',
    sanskritSubtitle: 'त्रीणि पदानि पश्यतु',
    description:
      'Three synchronized reels lock into place one by one: Reel 1 reveals the पूर्वपद (first word), Reel 2 reveals the उत्तरपद (second word), and Reel 3 reveals the resulting समस्त पद (final compound).',
  },
  {
    number: '03.',
    title: 'Discover the Samas & Vigraha',
    sanskritSubtitle: 'समास-विग्रहं बोधतु',
    description:
      'Read the illuminated manuscript card below the machine to learn the Samas category, the grammatical Vigraha (expansion), and the Hindi and English meaning.',
  },
];

export const HowToPlay: React.FC<HowToPlayProps> = ({ onStartPlaying }) => {
  return (
    <section
      id="how-to-play"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="text-xs font-semibold tracking-wider text-[#F3D078] mb-2">
          03. EXHIBITION VISITOR GUIDE · क्रीडा-विधिः
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDF8EE] tracking-tight text-balance">
          How to Play the <span className="text-gold-gradient">Sanskrit Samas Machine</span>
        </h2>
      </div>

      {/* 3-Step Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-baseline justify-between border-b border-[#D4AF37]/20 pb-4">
                <span className="font-mono-num text-3xl font-extrabold text-gold-gradient">
                  {step.number}
                </span>
                <span className="font-devanagari text-sm font-bold text-[#F3D078]/85">
                  {step.sanskritSubtitle}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-bold text-[#FDF8EE]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-[#FDF8EE]/75 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Highlighted Slogan Banner */}
      <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#2A0810] via-[#3B0B17] to-[#2A0810] border-2 border-[#D4AF37] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        <div className="text-center md:text-left">
          <div className="text-xs font-bold tracking-widest text-[#F3D078]">
            OUR EXHIBITION MOTTO · न कोऽपि पराजितः, सर्वे जिज्ञासवः!
          </div>
          <div className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#FDF8EE] tracking-wide">
            &ldquo;THERE ARE NO LOSERS, ONLY LEARNERS!&rdquo;
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            onStartPlaying();
          }}
          className="px-6 py-3.5 rounded-xl bg-gold-button text-[#1A0408] font-display font-extrabold text-sm tracking-wider inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Spin the Machine Now</span>
        </button>
      </div>
    </section>
  );
};
