import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, ShieldCheck, Sparkles, X, User } from 'lucide-react';
import {
  DAVUser,
  DAV_ADMIN_ALLOWLIST,
  isAdminName,
  normalizeName,
} from '../types/davUser';
import {
  registerOrLoginUser,
  getStoredUsers,
} from '../utils/davStorage';
import { soundEngine } from '../utils/soundEffects';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: DAVUser) => void;
  initialName?: string;
  allowClose?: boolean;
}

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = '',
  allowClose = false,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [detectedExisting, setDetectedExisting] = useState<DAVUser | null>(null);

  useEffect(() => {
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  // Live detection of existing users and admin recognition
  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setDetectedExisting(null);
      return;
    }
    const users = getStoredUsers();
    const found = users.find((u) => normalizeName(u.name) === normalizeName(trimmed));
    setDetectedExisting(found || null);
  }, [name]);

  if (!isOpen) return null;

  const isAdmin = isAdminName(name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setError('कृपया कम से कम 2 अक्षरों का नाम दर्ज करें (Minimum 2 characters required)');
      return;
    }

    soundEngine.playButtonClick();
    const result = registerOrLoginUser(trimmed);
    onSuccess(result.user);
  };

  const handleSelectQuickName = (quickName: string) => {
    setName(quickName);
    soundEngine.playButtonClick();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1E080F] to-[#0D0205] border-2 border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] p-6 sm:p-8 text-[#FDF8EE] overflow-hidden"
        >
          {/* Subtle Decorative Golden Corner Marks */}
          <div className="absolute top-2 left-2 text-[#D4AF37]/30 text-xs font-mono">✦</div>
          <div className="absolute top-2 right-2 text-[#D4AF37]/30 text-xs font-mono">✦</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37]/30 text-xs font-mono">✦</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37]/30 text-xs font-mono">✦</div>

          {allowClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#FDF8EE]/60 hover:text-[#F3D078] hover:bg-[#2A0810] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* School Header Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[10px] font-bold text-[#F3D078] uppercase tracking-wider">
              DAV MODEL SCHOOL · STUDENT PROFILE
            </span>
            <span className="text-xs text-[#D4AF37]/60">॥ ज्ञानम् एव शक्तिः ॥</span>
          </div>

          <h2 className="font-devanagari text-2xl font-extrabold text-gold-gradient leading-snug">
            अपना नाम दर्ज करें और समास की दुनिया में प्रवेश करें।
          </h2>

          <p className="text-xs sm:text-sm text-[#FDF8EE]/70 mt-1 mb-5">
            Enter your name to track your spins, unlock Sanskrit knowledge badges, and compete on the DAV Model School exhibition leaderboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-bold text-[#F3D078] mb-1.5 font-devanagari">
                छात्र / प्रतिभागी का पूरा नाम (Full Name)
              </label>
              <div className="relative">
                <input
                  id="student-name-input"
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="उदा. Pratyush Raj, Aarav Sharma..."
                  className="w-full px-4 py-3 rounded-xl bg-[#120306] border-2 border-[#D4AF37]/40 text-sm text-[#FDF8EE] placeholder:text-[#FDF8EE]/30 focus:outline-none focus:border-[#F3D078] focus:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                />
                <div className="absolute right-3.5 top-3.5 text-[#D4AF37]">
                  {isAdmin ? <ShieldCheck className="w-5 h-5 text-[#F3D078]" /> : <User className="w-5 h-5 opacity-60" />}
                </div>
              </div>

              {error && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Recognition Alerts */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>प्रशासक अभिज्ञान (Admin Recognized):</strong> {name.trim()} — Full Exhibition Admin privileges granted!
                </span>
              </motion.div>
            )}

            {!isAdmin && detectedExisting && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>स्वागतम् पुनः (Welcome Back):</strong> Found profile with{' '}
                  <span className="font-bold">{detectedExisting.totalSpins} spins</span> ·{' '}
                  {detectedExisting.titleBadge}
                </span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D078] to-[#D4AF37] text-[#120407] font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {detectedExisting ? 'CONTINUE AS ' + detectedExisting.name.toUpperCase() : 'ENTER THE GAME · खेल प्रारम्भ करें'}
              </span>
            </button>
          </form>

          {/* Quick Select Admins & Demo Students */}
          <div className="mt-6 pt-5 border-t border-[#D4AF37]/20">
            <div className="text-[11px] font-semibold text-[#F3D078]/80 mb-2.5">
              DAV Model School Quick Switch / पूर्व-परिभाषित सदस्य:
            </div>
            <div className="flex flex-wrap gap-2">
              {DAV_ADMIN_ALLOWLIST.map((admin) => (
                <button
                  key={admin}
                  type="button"
                  onClick={() => handleSelectQuickName(admin)}
                  className="px-2.5 py-1 rounded-lg bg-[#2A0810] hover:bg-[#D4AF37] text-[#F3D078] hover:text-[#120407] border border-[#D4AF37]/30 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  <span>{admin}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleSelectQuickName('Ananya Sharma')}
                className="px-2.5 py-1 rounded-lg bg-[#1F0811] hover:bg-[#380E18] text-[#FDF8EE]/70 hover:text-[#F3D078] border border-white/10 text-xs transition-colors cursor-pointer"
              >
                Ananya Sharma
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
