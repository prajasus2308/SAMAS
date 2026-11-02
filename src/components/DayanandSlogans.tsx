import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  BookOpen,
  Play,
  Pause,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

export interface AryaSamajSlogan {
  id: number;
  numberHindi: string;
  slogan: string;
  themeHindi: string;
  themeEnglish: string;
  englishTranslation: string;
  vedicEssence: string;
}

export const DAYANAND_SLOGANS: AryaSamajSlogan[] = [
  {
    id: 1,
    numberHindi: '१',
    slogan: 'वेदों की ओर लौटो, महर्षि दयानंद के संदेश से जुड़ो!',
    themeHindi: 'वेद-प्रत्यावर्तन',
    themeEnglish: 'Back to the Vedas',
    englishTranslation:
      'Return to the Vedas, connect with the timeless message of Maharshi Dayanand!',
    vedicEssence: 'वेदाः सर्वविद्यानां मूलम् — The Vedas are the fountainhead of all true knowledge.',
  },
  {
    id: 2,
    numberHindi: '२',
    slogan: 'महर्षि दयानंद का था यही विचार, वेदों का ज्ञान फैले संसार!',
    themeHindi: 'विश्व-ज्ञान प्रसार',
    themeEnglish: 'Universal Vedic Wisdom',
    englishTranslation:
      'This was Maharshi Dayanand’s noble vision — let the wisdom of the Vedas illuminate the entire world!',
    vedicEssence: 'कृण्वन्तो विश्वमार्यम् — Ennobling the entire universe through righteous wisdom.',
  },
  {
    id: 3,
    numberHindi: '३',
    slogan: 'आर्य समाज का यही आह्वान, सत्य, शिक्षा और मानवता का सम्मान!',
    themeHindi: 'सत्य एवं मानवता',
    themeEnglish: 'Truth, Education & Humanity',
    englishTranslation:
      'This is the clarion call of Arya Samaj — honor truth, education, and humanity!',
    vedicEssence: 'सत्यमेव जयते नानृतम् — Truth alone triumphs, never falsehood.',
  },
  {
    id: 4,
    numberHindi: '४',
    slogan: 'उठो, जागो, अज्ञान मिटाओ, महर्षि दयानंद का संदेश अपनाओ!',
    themeHindi: 'जागरण एवं ज्ञान',
    themeEnglish: 'Awakening & Eradicating Ignorance',
    englishTranslation:
      'Arise, awake, dispel ignorance, and embrace the transformative message of Maharshi Dayanand!',
    vedicEssence: 'तमसो मा ज्योतिर्गमय — Lead us from the darkness of ignorance to the light of knowledge.',
  },
  {
    id: 5,
    numberHindi: '५',
    slogan: 'आर्य समाज की यही पुकार, अंधविश्वास पर करो प्रहार!',
    themeHindi: 'अंधविश्वास उन्मूलन',
    themeEnglish: 'Triumph Over Superstition',
    englishTranslation:
      'This is the resounding call of Arya Samaj — strike down blind superstition with rational inquiry!',
    vedicEssence: 'सत्यस्य ग्रहणम् असत्यस्य त्यागः — Always be ready to accept truth and renounce untruth.',
  },
  {
    id: 6,
    numberHindi: '६',
    slogan: 'वेदों का ज्ञान, दयानंद की पहचान!',
    themeHindi: 'वैदिक स्वाभिमान',
    themeEnglish: 'Identity Rooted in Vedic Knowledge',
    englishTranslation:
      'The profound wisdom of the Vedas is the true identity and legacy of Maharshi Dayanand!',
    vedicEssence: 'स्वाध्यायान्मा प्रमदः — Never neglect the study and contemplation of sacred knowledge.',
  },
  {
    id: 7,
    numberHindi: '७',
    slogan: 'महर्षि दयानंद का महान विचार, नारी शिक्षा का हो विस्तार!',
    themeHindi: 'नारी शिक्षा एवं सशक्तिकरण',
    themeEnglish: 'Expansion of Women’s Education',
    englishTranslation:
      'Maharshi Dayanand’s pioneering ideal — let women’s education expand across every home and institution!',
    vedicEssence: 'यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः — Where women are honored and educated, divinity blossoms.',
  },
  {
    id: 8,
    numberHindi: '८',
    slogan: 'आर्य समाज का मूल संदेश, सत्य और धर्म का हो सदैव प्रवेश!',
    themeHindi: 'सत्य एवं धर्म',
    themeEnglish: 'Core Message of Truth & Dharma',
    englishTranslation:
      'The foundational message of Arya Samaj — may truth and righteous Dharma always prevail in life!',
    vedicEssence: 'धर्मेण धार्यते लोकः — Society and the cosmos are sustained through Dharma.',
  },
  {
    id: 9,
    numberHindi: '९',
    slogan: 'सत्यार्थ प्रकाश का ज्ञान अपनाएँ, सत्य के मार्ग पर कदम बढ़ाएँ!',
    themeHindi: 'सत्यार्थ प्रकाश',
    themeEnglish: 'Light of Satyarth Prakash',
    englishTranslation:
      'Embrace the enlightening wisdom of Satyarth Prakash, and march forward on the path of Truth!',
    vedicEssence: 'सत्यार्थप्रकाशः — Illuminating the true meaning of life, scripture, and duty.',
  },
  {
    id: 10,
    numberHindi: '१०',
    slogan: 'महर्षि दयानंद का सपना साकार, शिक्षित हो समाज, विकसित हो संसार!',
    themeHindi: 'शिक्षित समाज · विकसित संसार',
    themeEnglish: 'Educated Society, Developed World',
    englishTranslation:
      'Fulfilling Maharshi Dayanand’s dream — an educated society and a progressive, enlightened world!',
    vedicEssence: 'विद्या ददाति विनयम् — True education bestows humility, character, and universal progress.',
  },
];

export const DayanandSlogans: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const activeSlogan = DAYANAND_SLOGANS[activeIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DAYANAND_SLOGANS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSpeakSlogan = useCallback((item: AryaSamajSlogan) => {
    soundEngine.playButtonClick();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `नारा संख्या ${item.id}. ${item.slogan}`
      );
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.02;
      utterance.onstart = () => setSpeakingId(item.id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingId(null);
    }
  }, []);

  const handleCopySlogan = useCallback(async (item: AryaSamajSlogan) => {
    soundEngine.playButtonClick();
    const formatted = `${item.id}. ${item.slogan}\n— महर्षि दयानंद सरस्वती एवं आर्य समाज (DAV MODEL SCHOOL)`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedId(item.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === item.id ? null : prev));
      }, 2000);
    } catch {
      // ignore clipboard errors in restricted frames
    }
  }, []);

  const handleRandomSloganSpin = () => {
    soundEngine.playReelSpinStart();
    setIsAutoPlaying(false);
    let steps = 0;
    const totalSteps = 8;
    const interval = window.setInterval(() => {
      steps += 1;
      const nextRandom = Math.floor(Math.random() * DAYANAND_SLOGANS.length);
      setActiveIndex(nextRandom);
      if (steps >= totalSteps) {
        window.clearInterval(interval);
        soundEngine.playCelebratoryJingle('common');
      }
    }, 95);
  };

  return (
    <section
      id="arya-samaj-slogans"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 bg-gradient-to-b from-[#170409] via-[#120307] to-[#1A050A] relative overflow-hidden"
    >
      {/* Ambient Vedic Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] rounded-full bg-[#D4AF37]/10 blur-[120px]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs font-bold tracking-wider text-[#F3D078] mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>DAV MODEL SCHOOL HERITAGE · दयानन्द एंग्लो-वैदिक परम्परा</span>
            </div>
            <h2 className="font-devanagari text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold-gradient tracking-tight leading-tight">
              महर्षि दयानंद सरस्वती एवं आर्य समाज के १० प्रभावशाली नारे
            </h2>
            <p className="text-sm sm:text-base text-[#FDF8EE]/75 mt-2 max-w-3xl">
              Inspiring Vedic proclamations on truth, rational inquiry, women’s education, and
              social awakening that form the guiding light of{' '}
              <span className="text-[#F3D078] font-semibold">DAV Model School</span>.
            </p>
          </div>

          {/* Interactive Random Slogan Draw Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleRandomSloganSpin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-button text-[#1A0408] font-bold text-xs sm:text-sm shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span className="font-devanagari">प्रेरक नारा चुनें (Spin Slogan)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setIsAutoPlaying((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#24070E] hover:bg-[#340A15] text-[#F3D078] border border-[#D4AF37]/40 text-xs font-semibold transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause Auto-Spotlight' : 'Resume Auto-Spotlight'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Auto-Rotate: ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto-Rotate: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Featured Spotlight Stage (Royal Manuscript Banner) */}
        <div className="mb-12 rounded-3xl p-1 bg-gradient-to-r from-[#8A6418] via-[#F3D078] to-[#8A6418] shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
          <div className="rounded-[20px] bg-gradient-to-br from-[#2B0811] via-[#1B050A] to-[#110306] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            {/* Decorative Watermark ॐ */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-6 -bottom-10 font-devanagari text-[160px] sm:text-[210px] font-black text-[#D4AF37]/5 leading-none"
            >
              ॐ
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#D4AF37]/25">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F3D078] to-[#B8891E] text-[#1A0408] font-devanagari font-black text-lg flex items-center justify-center shadow-md">
                  {activeSlogan.numberHindi}
                </span>
                <div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#F3D078]">
                    FEATURED ARYA SAMAJ PROCLAMATION · नारा #{activeSlogan.id} / 10
                  </div>
                  <div className="text-xs text-[#FDF8EE]/70 font-devanagari">
                    {activeSlogan.themeHindi} ({activeSlogan.themeEnglish})
                  </div>
                </div>
              </div>

              {/* Spotlight Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick();
                    setIsAutoPlaying(false);
                    setActiveIndex(
                      (prev) => (prev - 1 + DAYANAND_SLOGANS.length) % DAYANAND_SLOGANS.length
                    );
                  }}
                  className="p-2 rounded-lg bg-[#1A050A] hover:bg-[#340A15] text-[#F3D078] border border-[#D4AF37]/35 transition-colors cursor-pointer"
                  aria-label="Previous slogan"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono-num text-[#F3D078] px-2">
                  {activeSlogan.id} / {DAYANAND_SLOGANS.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick();
                    setIsAutoPlaying(false);
                    setActiveIndex((prev) => (prev + 1) % DAYANAND_SLOGANS.length);
                  }}
                  className="p-2 rounded-lg bg-[#1A050A] hover:bg-[#340A15] text-[#F3D078] border border-[#D4AF37]/35 transition-colors cursor-pointer"
                  aria-label="Next slogan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlogan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="py-6 sm:py-8 space-y-4"
              >
                <blockquote className="font-devanagari text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFF3D1] leading-snug tracking-tight">
                  “{activeSlogan.slogan}”
                </blockquote>

                <p className="text-sm sm:text-base text-[#FDF8EE]/85 max-w-3xl">
                  {activeSlogan.englishTranslation}
                </p>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#140307]/90 border border-[#D4AF37]/30 text-xs text-[#F3D078]">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-devanagari">{activeSlogan.vedicEssence}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-4">
              {/* Quick Number Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {DAYANAND_SLOGANS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick();
                      setIsAutoPlaying(false);
                      setActiveIndex(idx);
                    }}
                    className={`w-7 h-7 rounded-lg font-devanagari text-xs font-bold transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'bg-[#F3D078] text-[#1A0408] shadow-[0_0_10px_rgba(243,208,120,0.6)] scale-105'
                        : 'bg-[#190409] text-[#F3D078]/75 border border-[#D4AF37]/30 hover:border-[#F3D078]'
                    }`}
                  >
                    {item.numberHindi}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSpeakSlogan(activeSlogan)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    speakingId === activeSlogan.id
                      ? 'bg-[#F3D078] text-[#1A0408] border-[#F3D078]'
                      : 'bg-[#250710] hover:bg-[#380B18] text-[#F3D078] border-[#D4AF37]/45'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="font-devanagari">
                    {speakingId === activeSlogan.id ? 'उच्चारण जारी है...' : 'उच्चारण सुनें (Listen)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopySlogan(activeSlogan)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A050A] hover:bg-[#2F0913] text-[#FDF8EE] border border-[#D4AF37]/35 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedId === activeSlogan.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#F3D078]" />
                      <span>Copy Slogan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complete 1 to 10 Numbered Grid of All Slogans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DAYANAND_SLOGANS.map((item, idx) => {
            const isSelected = idx === activeIndex;
            const isSpeaking = speakingId === item.id;
            const isCopied = copiedId === item.id;

            return (
              <motion.article
                key={item.id}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setActiveIndex(idx);
                }}
                className={`rounded-2xl p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#2E0913] to-[#1A050A] border-[#F3D078] shadow-[0_0_25px_rgba(212,175,55,0.22)]'
                    : 'bg-[#1A050A]/90 hover:bg-[#24070E] border-[#D4AF37]/30'
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3D078] font-devanagari font-extrabold text-base flex items-center justify-center">
                        {item.id}.
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#120306] border border-[#D4AF37]/30 font-devanagari text-xs font-semibold text-[#F3D078]">
                        {item.themeHindi}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#FDF8EE]/55 font-medium">
                      {item.themeEnglish}
                    </span>
                  </div>

                  {/* Exact Hindi Slogan */}
                  <h3 className="font-devanagari text-xl sm:text-2xl font-extrabold text-[#FFF3D1] leading-relaxed mb-2">
                    {item.slogan}
                  </h3>

                  {/* English Translation */}
                  <p className="text-xs sm:text-sm text-[#FDF8EE]/75 leading-relaxed">
                    {item.englishTranslation}
                  </p>
                </div>

                {/* Card Footer: Vedic Essence & Audio/Copy Controls */}
                <div className="mt-4 pt-3.5 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
                  <span className="font-devanagari text-[11px] text-[#F3D078]/85 truncate">
                    <Sparkles className="w-3 h-3 inline mr-1 text-amber-400" />
                    {item.vedicEssence}
                  </span>

                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleSpeakSlogan(item)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-[#F3D078] text-[#1A0408] border-[#F3D078]'
                          : 'bg-[#120306] hover:bg-[#2D0912] text-[#F3D078] border-[#D4AF37]/35'
                      }`}
                      title="Listen in Hindi"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="font-devanagari">सुनें</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySlogan(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#120306] hover:bg-[#2D0912] text-[#FDF8EE]/85 border border-[#D4AF37]/30 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy Slogan"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#F3D078]" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
