import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface ExhibitionCredits {
  schoolName: string;
  projectTitle: string;
  teamMembers: string;
  classAndSection: string;
  teacherGuide: string;
}

const DEFAULT_CREDITS: ExhibitionCredits = {
  schoolName: 'DAV MODEL SCHOOL · Annual Sanskrit Academic Exhibition',
  projectTitle: 'संस्कृत समास स्लॉट मशीन (Sanskrit Samas Slot Machine)',
  teamMembers: 'Pratyush Raj (Lead Architect) · Pragyan Hazra (Lead Researcher)',
  classAndSection: 'Class X — Computer Science & Sanskrit Innovation Club',
  teacherGuide: 'Guided by: Debahuty Mam (Faculty In-Charge, Sanskrit Department)',
};

export const Footer: React.FC = () => {
  const [credits, setCredits] = useState<ExhibitionCredits>(() => {
    try {
      const saved = localStorage.getItem('sanskrit_samas_exhibition_credits_v1');
      if (saved) {
        return { ...DEFAULT_CREDITS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_CREDITS;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ExhibitionCredits>(credits);

  const handleSaveCredits = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playButtonClick();
    setCredits(draft);
    try {
      localStorage.setItem('sanskrit_samas_exhibition_credits_v1', JSON.stringify(draft));
    } catch {
      // ignore storage errors
    }
    setIsEditing(false);
  };

  return (
    <footer className="border-t border-[#D4AF37]/30 bg-[#0D0204] text-[#FDF8EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-[#D4AF37]/20">
          {/* Left 5 Columns: Brand & Exhibition Tagline */}
          <div className="lg:col-span-5 space-y-3">
            <div className="font-devanagari text-2xl sm:text-3xl font-extrabold text-gold-gradient">
              संस्कृत समास मशीन
            </div>
            <div className="font-display text-sm font-bold text-[#F3D078] tracking-wider">
              SANSKRIT SAMAS SLOT MACHINE · EVERY SPIN IS A WIN!
            </div>
            <p className="text-sm text-[#FDF8EE]/75 max-w-md leading-relaxed">
              Educational School Exhibition Project — Made to make Sanskrit learning fun,
              interactive, and memorable for every visitor.
            </p>
          </div>

          {/* Right 7 Columns: Editable Student / Team Credits Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#1A050A] border border-[#D4AF37]/35 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#F3D078]">
                    SCHOOL EXHIBITION PROJECT CREDITS · छात्र-निर्मातृ-दलम्
                  </div>
                  <div className="text-xs text-[#FDF8EE]/65 mt-0.5">
                    {credits.schoolName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick();
                    setDraft(credits);
                    setIsEditing((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A0810] hover:bg-[#D4AF37] text-[#F3D078] hover:text-[#120407] border border-[#D4AF37]/40 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Editing' : 'Edit Student / Team Names'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveCredits} className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#F3D078] mb-1">
                        School / Exhibition Name
                      </label>
                      <input
                        type="text"
                        value={draft.schoolName}
                        onChange={(e) => setDraft({ ...draft, schoolName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-xs text-[#FDF8EE] focus:outline-none focus:border-[#F3D078]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#F3D078] mb-1">
                        Class &amp; Section
                      </label>
                      <input
                        type="text"
                        value={draft.classAndSection}
                        onChange={(e) => setDraft({ ...draft, classAndSection: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-xs text-[#FDF8EE] focus:outline-none focus:border-[#F3D078]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#F3D078] mb-1">
                      Student / Team Member Names
                    </label>
                    <input
                      type="text"
                      value={draft.teamMembers}
                      onChange={(e) => setDraft({ ...draft, teamMembers: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-xs text-[#FDF8EE] focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#F3D078] mb-1">
                      Subject Teacher / Mentor Name
                    </label>
                    <input
                      type="text"
                      value={draft.teacherGuide}
                      onChange={(e) => setDraft({ ...draft, teacherGuide: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-xs text-[#FDF8EE] focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-button text-[#1A0408] text-xs font-bold cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Exhibition Credits</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-[#FDF8EE] font-semibold">
                    {credits.teamMembers}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#FDF8EE]/70">
                    <span>{credits.classAndSection}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-devanagari text-[#F3D078]/90">
                      {credits.teacherGuide}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Navigation Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FDF8EE]/60">
          <div>
            संस्कृत समास मशीन — Educational School Exhibition Project · Made to make Sanskrit learning fun.
          </div>
          <div className="flex items-center gap-5">
            <a href="#arcade-machine" className="hover:text-[#F3D078] transition-colors">
              Slot Machine
            </a>
            <a href="#learn-samas" className="hover:text-[#F3D078] transition-colors">
              Learn Samas
            </a>
            <a href="#example-database" className="hover:text-[#F3D078] transition-colors">
              Examples
            </a>
            <a href="#how-to-play" className="hover:text-[#F3D078] transition-colors">
              How to Play
            </a>
            <a href="#arya-samaj-slogans" className="hover:text-[#F3D078] transition-colors text-[#F3D078]">
              महर्षि दयानंद नारे (10 Slogans)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
