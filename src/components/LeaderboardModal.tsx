import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Sparkles, X, Flame, Shield, ArrowRight } from 'lucide-react';
import { DAVUser } from '../types/davUser';
import { getStoredUsers } from '../utils/davStorage';
import { soundEngine } from '../utils/soundEffects';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DAVUser | null;
  onSpinNow: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSpinNow,
}) => {
  const [filter, setFilter] = useState<'all' | 'top'>('all');

  if (!isOpen) return null;

  const users = getStoredUsers();
  // Sort descending by totalSpins, then completedRounds
  const sorted = [...users].sort((a, b) => {
    if (b.totalSpins !== a.totalSpins) {
      return b.totalSpins - a.totalSpins;
    }
    return b.completedRounds - a.completedRounds;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-[#120407] flex items-center justify-center font-extrabold shadow-[0_0_15px_rgba(251,191,36,0.8)] border border-yellow-200">
          <Trophy className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-[#120407] flex items-center justify-center font-extrabold shadow-md border border-slate-200">
          <Medal className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-[#FFF5D0] flex items-center justify-center font-extrabold shadow-md border border-amber-600">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-[#1A050A] text-[#F3D078] flex items-center justify-center font-bold text-xs border border-[#D4AF37]/30">
        #{rank}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#1C050B] to-[#0A0204] border-2 border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] text-[#FDF8EE] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-[#140307] border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-[#120407] shadow-lg">
                <Trophy className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-devanagari text-xl font-extrabold text-[#F3D078]">
                    DAV MODEL SCHOOL — समास अग्रणी तालिका (Leaderboard)
                  </h3>
                </div>
                <p className="text-xs text-[#FDF8EE]/60">
                  Top performing Sanskrit scholars ranked by spins &amp; learning mastery
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#FDF8EE]/60 hover:text-[#F3D078] hover:bg-[#2A0810] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            {sorted.map((u, idx) => {
              const rank = idx + 1;
              const isCurrent = currentUser?.id === u.id;

              return (
                <div
                  key={u.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#2F0B17] to-[#1A050B] border-[#F3D078] shadow-[0_0_15px_rgba(243,208,120,0.3)]'
                      : rank <= 3
                      ? 'bg-[#18050B] border-[#D4AF37]/40'
                      : 'bg-[#120306] border-[#D4AF37]/15 hover:border-[#D4AF37]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getRankBadge(rank)}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#FDF8EE] truncate">
                          {u.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                            YOU
                          </span>
                        )}
                        {u.isAdmin && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" /> ADMIN
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#F3D078]/80 font-devanagari mt-0.5">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span>{u.titleBadge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <div className="font-mono text-base font-extrabold text-[#F3D078]">
                        {u.totalSpins}
                      </div>
                      <div className="text-[10px] text-[#FDF8EE]/50">Spins</div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="font-mono text-xs font-bold text-[#38BDF8]">
                        {u.completedRounds}
                      </div>
                      <div className="text-[10px] text-[#FDF8EE]/50">Rounds</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-[#140307] border-t border-[#D4AF37]/30 flex items-center justify-between gap-4">
            <div className="text-xs text-[#FDF8EE]/60">
              Spin the reels to rise on the exhibition leaderboard!
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onClose();
                onSpinNow();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3D078] text-[#120407] font-bold text-xs uppercase shadow-md cursor-pointer"
            >
              <span>Play Now &amp; Spin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
