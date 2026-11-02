import confetti from 'canvas-confetti';
import { ResultLevel } from '../data/samasExamples';

export interface ResultLevelMeta {
  level: ResultLevel;
  labelHindi: string;
  labelEnglish: string;
  badgeClass: string;
  glowColor: string;
  celebrationBanner: string;
  description: string;
}

export const RESULT_LEVEL_META: Record<ResultLevel, ResultLevelMeta> = {
  master: {
    level: 'master',
    labelHindi: 'महारत्न स्तर',
    labelEnglish: 'MASTER LEVEL',
    badgeClass:
      'bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-amber-500/30 text-amber-200 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.5)]',
    glowColor: 'rgba(212,175,55,0.7)',
    celebrationBanner: '🏆 GRAND MASTER DISCOVERY! महारत्न स्तर उपलब्धि! 🏆',
    description: 'Esoteric compound with profound outside referent or monumental Paninian synthesis!',
  },
  rare: {
    level: 'rare',
    labelHindi: 'दुर्लभ स्तर',
    labelEnglish: 'RARE LEVEL',
    badgeClass:
      'bg-gradient-to-r from-sky-500/25 via-emerald-500/25 to-teal-500/25 text-sky-200 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]',
    glowColor: 'rgba(56,189,248,0.6)',
    celebrationBanner: '⭐ RARE COMPOUND UNLOCKED! दुर्लभ समास प्रकटः! ⭐',
    description: 'Advanced indeclinable, numerical, or metaphoric compound structure!',
  },
  common: {
    level: 'common',
    labelHindi: 'मानक स्तर',
    labelEnglish: 'STANDARD LEVEL',
    badgeClass: 'bg-[#2A0810] text-[#F3D078] border-[#D4AF37]/30',
    glowColor: 'rgba(212,175,55,0.25)',
    celebrationBanner: '✨ VERIFIED SAMAS REVEAL ✨',
    description: 'Fundamental verified Sanskrit compound equation.',
  },
};

/**
 * Fires a high-fidelity celebratory arcade confetti animation via canvas-confetti
 * for 'rare' and 'master' result tiers.
 */
export function triggerCelebratoryConfetti(level: ResultLevel): void {
  if (typeof window === 'undefined') return;

  if (level === 'master') {
    // 1. Dual-Cannon Synchronized Left & Right Blast
    const end = Date.now() + 1400;

    const colors = ['#D4AF37', '#F3D078', '#FFD700', '#C084FC', '#F43F5E', '#FFFFFF'];

    // Left cannon
    confetti({
      particleCount: 75,
      angle: 60,
      spread: 70,
      origin: { x: 0.08, y: 0.72 },
      colors,
      scalar: 1.25,
      startVelocity: 55,
      ticks: 240,
    });

    // Right cannon
    confetti({
      particleCount: 75,
      angle: 120,
      spread: 70,
      origin: { x: 0.92, y: 0.72 },
      colors,
      scalar: 1.25,
      startVelocity: 55,
      ticks: 240,
    });

    // 2. High-Altitude Golden Sparkle & Star Barrage at 220ms
    window.setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 90,
        spread: 110,
        origin: { x: 0.5, y: 0.42 },
        colors: ['#FFD700', '#FFE57F', '#FFF8E1', '#E0AA3E', '#FFAB00'],
        shapes: ['circle', 'square'],
        scalar: 1.3,
        startVelocity: 42,
        gravity: 0.75,
        ticks: 260,
      });
    }, 220);

    // 3. Cascading gentle star shower at 520ms
    window.setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 140,
        origin: { x: 0.5, y: 0.25 },
        colors: ['#F3D078', '#D4AF37', '#FFFFFF', '#BA68C8'],
        startVelocity: 28,
        gravity: 0.6,
        scalar: 1.1,
        ticks: 200,
      });
    }, 520);
  } else if (level === 'rare') {
    // Vibrant arcade center explosion
    confetti({
      particleCount: 95,
      spread: 85,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#38BDF8', '#34D399', '#FBBF24', '#F472B6', '#D4AF37', '#A78BFA'],
      startVelocity: 40,
      scalar: 1.15,
      ticks: 200,
    });

    // Secondary soft pop at 180ms
    window.setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 60,
        angle: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#38BDF8', '#FBBF24', '#34D399'],
        startVelocity: 30,
        ticks: 160,
      });
    }, 180);
  }
}
