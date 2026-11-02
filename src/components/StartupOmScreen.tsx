import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Play, ArrowRight, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface StartupOmScreenProps {
  onComplete: () => void;
  isOpen: boolean;
}

export const StartupOmScreen: React.FC<StartupOmScreenProps> = ({ onComplete, isOpen }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioSource, setAudioSource] = useState<'file' | 'synth' | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundEngine.getMuted());
  const [isComplete, setIsComplete] = useState(false);
  const stopAudioRef = useRef<(() => void) | null>(null);

  const handleStartExperience = useCallback(async () => {
    setHasStarted(true);
    setProgress(5);

    // Start Om sound with audio file or Vedic drone synthesizer fallback
    try {
      const stopFn = await soundEngine.playOmWithFallback({
        onSourceDetermined: (source) => setAudioSource(source),
        onAudioEnded: () => {
          setProgress(100);
          setIsComplete(true);
        },
      });
      stopAudioRef.current = stopFn;
    } catch {
      // ignore
    }

    // Progress bar animation over ~5.2 seconds
    const startTime = Date.now();
    const duration = 5200;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
        setIsComplete(true);
      }
    }, 60);

    return () => window.clearInterval(interval);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
    };
  }, []);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stopAudioRef.current) {
      stopAudioRef.current();
    }
    setIsComplete(false);
    setProgress(0);
    handleStartExperience();
  };

  const handleEnterApp = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
    }
    soundEngine.playButtonClick();
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#070204] text-[#FDF8EE] overflow-hidden select-none"
      >
        {/* Deep ambient background aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A101C]/60 via-[#160408]/90 to-[#070204] pointer-events-none" />

        {/* Top Floating Controls: Mute and Skip */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMute}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A050A]/80 border border-[#D4AF37]/30 text-xs text-[#F3D078] hover:border-[#D4AF37] transition-all cursor-pointer backdrop-blur-sm"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'ध्वनि मूक (Muted)' : 'ध्वनि सक्रिय (Sound On)'}</span>
          </button>

          {hasStarted && (
            <button
              type="button"
              onClick={handleEnterApp}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3D078] text-[#120407] font-bold text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all cursor-pointer"
            >
              <span>प्रवेश करें · Skip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Initial "TAP TO BEGIN" Screen to satisfy browser Autoplay policies */}
        {!hasStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 flex flex-col items-center text-center px-6 max-w-lg"
          >
            {/* School Emblem Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A0810]/70 border border-[#D4AF37]/40 mb-6">
              <Sparkles className="w-4 h-4 text-[#F3D078]" />
              <span className="font-display tracking-widest text-[11px] font-bold text-[#F3D078] uppercase">
                DAV MODEL SCHOOL · संस्कृत विभाग
              </span>
            </div>

            {/* Glowing Golden ॐ Icon Preview */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute -inset-8 rounded-full bg-[#D4AF37]/15 blur-2xl animate-pulse" />
              <div className="w-28 h-28 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-radial from-[#380E18] to-[#120407] shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                <span className="font-devanagari text-6xl text-[#F3D078] drop-shadow-[0_0_15px_rgba(243,208,120,0.8)]">
                  ॐ
                </span>
              </div>
            </div>

            <h1 className="font-devanagari text-2xl sm:text-3xl font-extrabold text-[#FDF8EE] mt-4 mb-2 tracking-wide">
              संस्कृत समास स्लॉट मशीन
            </h1>

            <p className="font-devanagari text-[#D4AF37] text-base mb-1">
              ॥ ज्ञानम् एव शक्तिः ॥
            </p>

            <p className="text-xs sm:text-sm text-[#FDF8EE]/70 max-w-sm mb-8 leading-relaxed">
              Experience the divine blend of Vedic Sanskrit grammar and luxury arcade learning.
              Tap below to unlock audio and begin the cinematic journey.
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartExperience}
              className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D078] to-[#D4AF37] text-[#120407] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
              <span>TAP TO BEGIN · अनुभव प्रारम्भ करें</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Animated Cinematic ॐ Sequence */
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-2xl">
            {/* Expanding Mandala SVG Rings */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Outer Slow Rotating Mandala Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-[#D4AF37]/20 border-dashed pointer-events-none"
              />

              {/* Middle Pulsing Mandala Ring with Radial Marks */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-6 rounded-full border-2 border-[#D4AF37]/30 pointer-events-none"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-90">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                </div>
              </motion.div>

              {/* Radiant Light Burst Rays */}
              <div className="absolute -inset-16 bg-[radial-gradient(circle,_rgba(212,175,55,0.25)_0%,_transparent_70%)] blur-2xl pointer-events-none" />

              {/* Floating Golden Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5],
                    x: Math.cos((i / 12) * Math.PI * 2) * (80 + (i % 3) * 25),
                    y: Math.sin((i / 12) * Math.PI * 2) * (80 + (i % 3) * 25),
                  }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#F3D078] shadow-[0_0_8px_#F3D078] pointer-events-none"
                />
              ))}

              {/* Sacred ॐ Centre Symbol with Gentle Breathing & Glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  opacity: { duration: 1.5, ease: 'easeOut' },
                  scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative z-10 flex flex-col items-center justify-center"
              >
                <div className="font-devanagari text-8xl sm:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D0] via-[#F3D078] to-[#B38F24] drop-shadow-[0_0_35px_rgba(243,208,120,0.9)]">
                  ॐ
                </div>
              </motion.div>
            </div>

            {/* Sacred Shloka Mantra */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-4 space-y-2"
            >
              <div className="font-devanagari text-xl sm:text-2xl font-bold tracking-wider text-[#F3D078] drop-shadow-[0_0_12px_rgba(243,208,120,0.5)]">
                ॐ असतो मा सद्गमय।
              </div>
              <div className="font-devanagari text-sm sm:text-base text-[#FDF8EE]/80">
                तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥
              </div>
            </motion.div>

            {/* School Welcome Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 space-y-1"
            >
              <div className="font-display text-xs sm:text-sm font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                WELCOME TO DAV MODEL SCHOOL
              </div>
              <div className="text-xs text-[#FDF8EE]/60 font-devanagari">
                संस्कृत समास स्लॉट मशीन · School Exhibition Project 2026
              </div>
            </motion.div>

            {/* Audio Source Indicator */}
            {audioSource && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-[10px] text-[#F3D078]/60 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>
                  {audioSource === 'file'
                    ? 'Playing Vedic Om Audio (MP3)'
                    : 'Playing Vedic Synthesizer Om Drone (136.1 Hz Sadja)'}
                </span>
              </motion.div>
            )}

            {/* Elegant Loading Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="w-64 sm:w-80 mt-8 space-y-2"
            >
              <div className="h-1.5 w-full bg-[#1A050A] rounded-full overflow-hidden border border-[#D4AF37]/30 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3D078] to-[#FFF5D0] rounded-full shadow-[0_0_10px_rgba(243,208,120,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#FDF8EE]/60">
                <span className="font-devanagari">संस्कृत-मन्त्र-संवाहनम्...</span>
                <span className="font-mono">{progress}%</span>
              </div>
            </motion.div>

            {/* Post-Completion Enter / Replay Action Bar */}
            <div className="mt-6 flex items-center gap-4">
              {isComplete ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleEnterApp}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3D078] text-[#120407] font-extrabold text-sm shadow-[0_0_25px_rgba(212,175,55,0.7)] cursor-pointer"
                >
                  <span>ENTER SANSKRIT SLOT MACHINE · प्रवेश करें</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnterApp}
                  className="text-xs text-[#FDF8EE]/50 hover:text-[#F3D078] transition-colors cursor-pointer"
                >
                  Skip loading and proceed &rarr;
                </button>
              )}

              <button
                type="button"
                onClick={handleReplay}
                className="p-2 rounded-lg bg-[#1A050A] border border-[#D4AF37]/30 text-[#F3D078] hover:border-[#D4AF37] transition-all cursor-pointer"
                title="Replay Om Sound & Animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
