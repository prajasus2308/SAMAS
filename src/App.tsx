import React, { useState, useCallback, useEffect } from 'react';
import { Trophy, Shield, Volume2, VolumeX, Sparkles, User, RotateCcw } from 'lucide-react';
import { SamasCategoryId, SamasExample } from './data/samasExamples';
import { useSlotMachine } from './hooks/useSlotMachine';
import { Hero } from './components/Hero';
import { SlotMachine } from './components/SlotMachine';
import { SamasLearning } from './components/SamasLearning';
import { ExampleExplorer } from './components/ExampleExplorer';
import { HowToPlay } from './components/HowToPlay';
import { StatsAndFacts } from './components/StatsAndFacts';
import { DayanandSlogans } from './components/DayanandSlogans';
import { Footer } from './components/Footer';
import { StartupOmScreen } from './components/StartupOmScreen';
import { UserRegistrationModal } from './components/UserRegistrationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdminDashboard } from './components/AdminDashboard';
import { soundEngine } from './utils/soundEffects';
import {
  DAVUser,
  isAdminName,
} from './types/davUser';
import {
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  logSpinEvent,
  getStoredUsers,
} from './utils/davStorage';

export default function App() {
  // Current logged in DAV Student or Admin
  const [currentUser, setCurrentUserState] = useState<DAVUser | null>(() => {
    const saved = getCurrentUser();
    if (saved) return saved;
    // Default to first user from stored users if available
    const all = getStoredUsers();
    return all.length > 0 ? all[0] : null;
  });

  // Modal display states
  const [showStartupOm, setShowStartupOm] = useState<boolean>(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);

  // Synchronize slot machine with DAV student spin tracking
  const handleSpinComplete = useCallback((example: SamasExample) => {
    if (currentUser) {
      const { updatedUser } = logSpinEvent(currentUser.id, example);
      if (updatedUser) {
        setCurrentUserState(updatedUser);
      }
    }
  }, [currentUser]);

  const {
    examples,
    activePool,
    poolFilter,
    setPoolFilter,
    currentExample,
    isSpinning,
    reelSpinning,
    leverPulled,
    cabinetShake,
    showCelebration,
    spinCount,
    discoveredIds,
    spinHistory,
    isMuted,
    toggleMute,
    spin,
    resetSession,
    addCustomExample,
  } = useSlotMachine({
    onSpinComplete: handleSpinComplete,
  });

  const [activeLearningCategory, setActiveLearningCategory] =
    useState<SamasCategoryId>('tatpurusha');

  const scrollToMachineAndSpin = useCallback(
    (options?: { specificExampleId?: string; categoryOverride?: SamasCategoryId }) => {
      const el = document.getElementById('arcade-machine');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.setTimeout(() => {
        spin(options);
      }, 220);
    },
    [spin]
  );

  const handleLearnSamas = useCallback((categoryId: SamasCategoryId) => {
    setActiveLearningCategory(categoryId);
    const el = document.getElementById('learn-samas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleExploreGrammar = useCallback(() => {
    const el = document.getElementById('learn-samas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleUserRegistered = (user: DAVUser) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    setShowRegistrationModal(false);
  };

  const handleOpenAdminFromProfile = () => {
    setShowProfileModal(false);
    setShowAdminDashboard(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#120407] text-[#FDF8EE]">
      {/* 1. Cinematic Startup Experience — ॐ */}
      <StartupOmScreen
        isOpen={showStartupOm}
        onComplete={() => {
          setShowStartupOm(false);
          // If no user is registered yet, prompt gently
          if (!currentUser) {
            setShowRegistrationModal(true);
          }
        }}
      />

      {/* 2. User Registration Modal */}
      <UserRegistrationModal
        isOpen={showRegistrationModal}
        allowClose={Boolean(currentUser)}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleUserRegistered}
      />

      {/* 3. User Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={showProfileModal}
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onSwitchUser={() => {
            setShowProfileModal(false);
            setShowRegistrationModal(true);
          }}
          onOpenAdmin={handleOpenAdminFromProfile}
          onUserUpdated={(updated) => {
            setCurrentUserState(updated);
          }}
        />
      )}

      {/* 4. Exhibition Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        currentUser={currentUser}
        onSpinNow={() => scrollToMachineAndSpin()}
      />

      {/* 5. Fixed Admin Dashboard */}
      {currentUser?.isAdmin && (
        <AdminDashboard
          isOpen={showAdminDashboard}
          onClose={() => setShowAdminDashboard(false)}
          currentUser={currentUser}
          examples={examples}
          onAddCustomExample={(newEx) => {
            const created = addCustomExample(newEx);
            scrollToMachineAndSpin({ specificExampleId: created.id });
          }}
          onResetAllData={() => {
            const users = getStoredUsers();
            setCurrentUserState(users[0] || null);
          }}
        />
      )}

      {/* Top Navigation Bar — DAV MODEL SCHOOL Brand */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-3 sm:px-6 py-2.5 bg-[#120407]/95 border-b border-[#D4AF37]/30 backdrop-blur-md">
        {/* Zone 1: School Branding & Motto */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F3D078] flex items-center justify-center text-[#120407] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              <span className="font-devanagari text-lg leading-none">ॐ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3D078] uppercase">
                  DAV MODEL SCHOOL
                </span>
                <span className="hidden xl:inline text-[10px] text-[#D4AF37]/80 font-devanagari">
                  ॥ ज्ञानम् एव शक्तिः ॥
                </span>
              </div>
              <div className="font-devanagari text-sm sm:text-base font-extrabold text-gold-gradient tracking-tight leading-none mt-0.5">
                संस्कृत समास स्लॉट मशीन
              </div>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#FDF8EE]/80">
          <a
            href="#arcade-machine"
            className="hover:text-[#F3D078] transition-colors whitespace-nowrap"
          >
            स्लॉट मशीन (Machine)
          </a>
          <a
            href="#learn-samas"
            className="hover:text-[#F3D078] transition-colors whitespace-nowrap"
          >
            समास परिचय (Learn)
          </a>
          <a
            href="#example-database"
            className="hover:text-[#F3D078] transition-colors whitespace-nowrap"
          >
            उदाहरण कोश (Library)
          </a>
          <a
            href="#how-to-play"
            className="hover:text-[#F3D078] transition-colors whitespace-nowrap"
          >
            खेल नियम (Rules)
          </a>
          <a
            href="#statistics"
            className="hover:text-[#F3D078] transition-colors whitespace-nowrap"
          >
            आँकड़े (Stats)
          </a>
          <a
            href="#arya-samaj-slogans"
            className="hover:text-[#F3D078] transition-colors whitespace-nowrap text-[#F3D078]"
          >
            दयानंद नारे (Slogans)
          </a>
        </nav>

        {/* Zone 3: Interactive User & System Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Replay ॐ Startup Screen */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              setShowStartupOm(true);
            }}
            className="p-2 rounded-lg bg-[#1F070E] hover:bg-[#380E18] text-[#F3D078] border border-[#D4AF37]/30 text-xs transition-colors cursor-pointer"
            title="Replay Cinematic ॐ Experience"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#1F070E] hover:bg-[#380E18] text-[#F3D078] border border-[#D4AF37]/30 text-xs transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Leaderboard Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              setShowLeaderboardModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1F070E] hover:bg-[#380E18] text-[#F3D078] border border-[#D4AF37]/30 text-xs font-bold transition-colors cursor-pointer"
            title="DAV Model School Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">तालिका</span>
          </button>

          {/* User Profile Pill */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#2A0810] hover:bg-[#3D0C18] border border-[#D4AF37]/45 text-xs transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-[#120407] font-extrabold flex items-center justify-center text-[10px]">
                {currentUser.name[0]}
              </div>
              <span className="font-semibold text-[#FDF8EE] max-w-[80px] sm:max-w-[110px] truncate text-xs">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-mono text-[#F3D078] hidden sm:inline">
                ({currentUser.totalSpins})
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setShowRegistrationModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2A0810] hover:bg-[#3D0C18] border border-[#D4AF37]/40 text-xs text-[#F3D078] font-bold cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>प्रवेश</span>
            </button>
          )}

          {/* Admin Dashboard Button (Only if user is recognized Admin) */}
          {currentUser?.isAdmin && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                setShowAdminDashboard(true);
              }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition-colors cursor-pointer"
              title="Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Spin Now CTA Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              scrollToMachineAndSpin();
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-[#1A0408] bg-gold-button rounded-lg transition-transform hover:scale-105 whitespace-nowrap shrink-0 cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          >
            SPIN 🎰
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <Hero
          currentExample={currentExample}
          onSpinNowClick={() => scrollToMachineAndSpin()}
          onExploreGrammarClick={handleExploreGrammar}
        />

        {/* Section 2 & 4: Main Interactive Slot Machine + Result Reveal Card */}
        <SlotMachine
          examples={examples}
          activePool={activePool}
          poolFilter={poolFilter}
          onChangeFilter={setPoolFilter}
          currentExample={currentExample}
          isSpinning={isSpinning}
          reelSpinning={reelSpinning}
          leverPulled={leverPulled}
          cabinetShake={cabinetShake}
          showCelebration={showCelebration}
          spinCount={spinCount}
          discoveredCount={discoveredIds.length}
          spinHistory={spinHistory}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onSpin={spin}
          onReset={resetSession}
          onLearnSamas={handleLearnSamas}
        />

        {/* Section 5: Learn About the Major Types of Samas */}
        <SamasLearning
          activeCategoryId={activeLearningCategory}
          onSelectCategory={setActiveLearningCategory}
          examples={examples}
          onSpinCategoryExample={(categoryId, specificExampleId) => {
            if (!specificExampleId) {
              setPoolFilter(categoryId);
            }
            scrollToMachineAndSpin({
              categoryOverride: categoryId,
              specificExampleId,
            });
          }}
        />

        {/* Section 3: Verified Sanskrit Example Database & Custom Addition */}
        <ExampleExplorer
          examples={examples}
          discoveredIds={discoveredIds}
          onLoadExampleOnMachine={(exampleId) =>
            scrollToMachineAndSpin({ specificExampleId: exampleId })
          }
          onAddCustomExample={(newEx) => {
            const created = addCustomExample(newEx);
            scrollToMachineAndSpin({ specificExampleId: created.id });
          }}
        />

        {/* Section 6: How to Play 3-Step Guide */}
        <HowToPlay onStartPlaying={() => scrollToMachineAndSpin()} />

        {/* Section 7: Dynamic Statistics & Fun Sanskrit Facts */}
        <StatsAndFacts
          totalExamples={examples.length}
          spinCount={spinCount}
          discoveredCount={discoveredIds.length}
          spinHistory={spinHistory}
          onSelectExample={(exampleId) =>
            scrollToMachineAndSpin({ specificExampleId: exampleId })
          }
        />

        {/* Section 8: Maharshi Dayanand Saraswati & Arya Samaj 10 Inspiring Slogans */}
        <DayanandSlogans />
      </main>

      {/* Section 8: Footer with DAV Model School Exhibition Credits */}
      <Footer />
    </div>
  );
}
