import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  Sparkles,
  RotateCcw,
  UserCheck,
  Shield,
  Layers,
  Clock,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { DAVUser } from '../types/davUser';
import { resetUserData } from '../utils/davStorage';
import { SAMAS_CATEGORIES } from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';

interface UserProfileModalProps {
  user: DAVUser;
  isOpen: boolean;
  onClose: () => void;
  onSwitchUser: () => void;
  onOpenAdmin?: () => void;
  onUserUpdated: (updated: DAVUser) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSwitchUser,
  onOpenAdmin,
  onUserUpdated,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleResetData = () => {
    soundEngine.playButtonClick();
    const reset = resetUserData(user.id);
    if (reset) {
      onUserUpdated(reset);
    }
    setShowConfirmReset(false);
  };

  const getSanskritInitial = (name: string) => {
    const trimmed = name.trim();
    return trimmed.length > 0 ? trimmed[0].toUpperCase() : 'छा';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#1E080F] to-[#0D0205] border-2 border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] p-6 sm:p-8 text-[#FDF8EE]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-[#FDF8EE]/60 hover:text-[#F3D078] hover:bg-[#2A0810] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Profile Badge */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#D4AF37]/20">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${user.avatarColor || 'from-amber-500 to-yellow-600'} flex items-center justify-center text-2xl font-extrabold text-[#120407] shadow-lg border-2 border-[#F3D078]`}
            >
              {getSanskritInitial(user.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#FDF8EE] truncate">
                  {user.name}
                </h3>
                {user.isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                    <Shield className="w-3 h-3" /> ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#F3D078] font-devanagari mt-0.5">
                <Award className="w-3.5 h-3.5" />
                <span>{user.titleBadge}</span>
              </div>
              <div className="text-[11px] text-[#FDF8EE]/50 mt-1">
                DAV Model School Exhibition Participant
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-3.5 rounded-xl bg-[#150409] border border-[#D4AF37]/30 text-center">
              <div className="text-2xl font-extrabold font-mono text-[#F3D078]">
                {user.totalSpins}
              </div>
              <div className="text-[11px] text-[#FDF8EE]/70 font-devanagari mt-0.5">
                कुल चक्र (Total Spins)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#150409] border border-[#D4AF37]/30 text-center">
              <div className="text-2xl font-extrabold font-mono text-[#38BDF8]">
                {user.completedRounds}
              </div>
              <div className="text-[11px] text-[#FDF8EE]/70 font-devanagari mt-0.5">
                पूर्ण चक्र (Rounds)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#150409] border border-[#D4AF37]/30 text-center">
              <div className="text-2xl font-extrabold font-mono text-[#4ADE80]">
                {user.categoriesExplored.length}/6
              </div>
              <div className="text-[11px] text-[#FDF8EE]/70 font-devanagari mt-0.5">
                समास प्रकार (Categories)
              </div>
            </div>
          </div>

          {/* Category Mastery Progress */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#F3D078]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>समास प्रकार अन्वेषण (Categories Explored)</span>
              </span>
              <span>{Math.round((user.categoriesExplored.length / 6) * 100)}%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SAMAS_CATEGORIES.map((cat) => {
                const isUnlocked = user.categoriesExplored.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between ${
                      isUnlocked
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#150408] border-white/10 text-[#FDF8EE]/40'
                    }`}
                  >
                    <span className="font-devanagari text-[11px] truncate">
                      {cat.sanskritName}
                    </span>
                    <span className="text-[10px] ml-1">
                      {isUnlocked ? '✓' : '○'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Words Learned */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F3D078]">
              <Clock className="w-3.5 h-3.5" />
              <span>हाल ही में खोजे गए शब्द (Recently Discovered Words)</span>
            </div>

            {user.recentWords.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#150408] border border-white/10 text-center text-xs text-[#FDF8EE]/50">
                अभी तक कोई शब्द नहीं घूमा है। स्लॉट मशीन चलाकर अपनी यात्रा शुरू करें!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {user.recentWords.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#150408] border border-[#D4AF37]/25 flex items-center justify-between text-xs hover:border-[#D4AF37]/50 transition-colors"
                  >
                    <div>
                      <div className="font-devanagari font-bold text-[#F3D078]">
                        {item.samastaPad}
                      </div>
                      <div className="text-[11px] text-[#FDF8EE]/70 font-devanagari">
                        {item.vigraha}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] px-2 py-0.5 rounded bg-[#2A0810] text-[#D4AF37] border border-[#D4AF37]/30">
                        {item.categoryName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety Confirm for Reset */}
          {showConfirmReset ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 mb-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>क्या आप सचमुच अपना डेटा रीसेट करना चाहते हैं?</span>
              </div>
              <p className="text-[11px] text-rose-200/80 leading-relaxed">
                This will reset your spin count, completed rounds, and discovered words to 0. Your profile name remains active.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-black/40 text-xs text-[#FDF8EE]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Confirm Reset · रीसेट करें
                </button>
              </div>
            </motion.div>
          ) : null}

          {/* Action Footer Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D4AF37]/20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick();
                  onSwitchUser();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/40 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Switch / Register New Student</span>
              </button>

              {user.isAdmin && onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onClose();
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-500/50 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/20 transition-colors cursor-pointer"
              title="Reset spin history and stats"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset My Stats</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
