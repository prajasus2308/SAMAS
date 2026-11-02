import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Database,
  Shield,
  Settings,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Volume2,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  PartyPopper,
} from 'lucide-react';
import {
  DAVUser,
  DAV_ADMIN_PROFILES,
} from '../types/davUser';
import {
  getStoredUsers,
  deleteUserAccount,
  resetAllExhibitionData,
} from '../utils/davStorage';
import {
  SamasExample,
  SamasCategoryId,
  SAMAS_CATEGORIES,
} from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';
import { triggerCelebratoryConfetti } from '../utils/confettiCelebration';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DAVUser;
  examples: SamasExample[];
  onAddCustomExample: (example: Omit<SamasExample, 'id' | 'isCoreExhibition'>) => void;
  onResetAllData?: () => void;
}

type AdminTab = 'users' | 'game' | 'admins' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  examples,
  onAddCustomExample,
  onResetAllData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [usersList, setUsersList] = useState<DAVUser[]>(() => getStoredUsers());
  const [userSearch, setUserSearch] = useState('');
  const [exampleSearch, setExampleSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Example form state
  const [newPurvapada, setNewPurvapada] = useState('');
  const [newPurvapadaTranslit, setNewPurvapadaTranslit] = useState('');
  const [newUttarapada, setNewUttarapada] = useState('');
  const [newUttarapadaTranslit, setNewUttarapadaTranslit] = useState('');
  const [newSamastapada, setNewSamastapada] = useState('');
  const [newSamastapadaTranslit, setNewSamastapadaTranslit] = useState('');
  const [newCategory, setNewCategory] = useState<SamasCategoryId>('tatpurusha');
  const [newVigraha, setNewVigraha] = useState('');
  const [newHindiMeaning, setNewHindiMeaning] = useState('');
  const [newEnglishMeaning, setNewEnglishMeaning] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Remove user "${userName}" from DAV exhibition records?`)) {
      deleteUserAccount(userId);
      setUsersList(getStoredUsers());
      showToast(`User ${userName} deleted.`);
    }
  };

  const handleCreateExample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurvapada.trim() || !newUttarapada.trim() || !newSamastapada.trim()) {
      alert('Please fill in Sanskrit Purvapada, Uttarapada, and Samastapada.');
      return;
    }

    const catObj = SAMAS_CATEGORIES.find((c) => c.id === newCategory);

    onAddCustomExample({
      purvapada: newPurvapada.trim(),
      purvapadaTranslit: newPurvapadaTranslit.trim() || newPurvapada.trim(),
      purvapadaMeaning: newPurvapada.trim(),
      uttarapada: newUttarapada.trim(),
      uttarapadaTranslit: newUttarapadaTranslit.trim() || newUttarapada.trim(),
      uttarapadaMeaning: newUttarapada.trim(),
      samastapada: newSamastapada.trim(),
      samastapadaTranslit: newSamastapadaTranslit.trim() || newSamastapada.trim(),
      categoryId: newCategory,
      samasTypeSanskrit: catObj?.sanskritName || 'तत्पुरुष समास',
      samasTypeEnglish: catObj?.englishName || 'Compound',
      vigraha: newVigraha.trim() || `${newPurvapada} + ${newUttarapada}`,
      vigrahaTranslit: '',
      hindiMeaning: newHindiMeaning.trim() || newSamastapada,
      englishMeaning: newEnglishMeaning.trim() || newSamastapada,
      grammaticalExplanationHindi: 'प्रशासक द्वारा जोड़ा गया नया समास उदाहरण।',
      grammaticalExplanationEnglish: 'Verified compound example added by DAV Model School Administrator.',
    });

    soundEngine.playCelebratoryJingle();
    showToast(`नया समास "${newSamastapada}" सफलतापूर्वक जोड़ा गया!`);
    setShowAddModal(false);

    // Reset inputs
    setNewPurvapada('');
    setNewUttarapada('');
    setNewSamastapada('');
    setNewVigraha('');
    setNewHindiMeaning('');
    setNewEnglishMeaning('');
  };

  const filteredUsers = usersList.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredExamples = examples.filter(
    (ex) =>
      ex.samastapada.includes(exampleSearch) ||
      ex.samastapadaTranslit.toLowerCase().includes(exampleSearch.toLowerCase()) ||
      ex.samasTypeSanskrit.includes(exampleSearch) ||
      ex.englishMeaning.toLowerCase().includes(exampleSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#1E080F] to-[#0A0205] border-2 border-[#D4AF37]/60 shadow-[0_0_60px_rgba(212,175,55,0.35)] text-[#FDF8EE] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#140307] border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-[#120407] font-bold shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-devanagari text-lg sm:text-xl font-extrabold text-[#F3D078]">
                    DAV MODEL SCHOOL — प्रशासनिक नियंत्रण पट्टल
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                    EXHIBITION ADMIN
                  </span>
                </div>
                <p className="text-xs text-[#FDF8EE]/60">
                  Logged in as: <strong className="text-[#FDF8EE]">{currentUser.name}</strong> · Registered Administrators: Debahuty Mam, Pratyush Raj, Pragyan Hazra
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

          {/* Toast Notification */}
          {notification && (
            <div className="absolute top-18 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 bg-[#170409] border-b border-[#D4AF37]/20 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-[#F3D078] text-[#F3D078] bg-[#2A0810]/60 rounded-t-lg'
                  : 'border-transparent text-[#FDF8EE]/60 hover:text-[#FDF8EE]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management ({usersList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'game'
                  ? 'border-[#F3D078] text-[#F3D078] bg-[#2A0810]/60 rounded-t-lg'
                  : 'border-transparent text-[#FDF8EE]/60 hover:text-[#FDF8EE]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Game &amp; Samas Editor ({examples.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'admins'
                  ? 'border-[#F3D078] text-[#F3D078] bg-[#2A0810]/60 rounded-t-lg'
                  : 'border-transparent text-[#FDF8EE]/60 hover:text-[#FDF8EE]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Information (3)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-[#F3D078] text-[#F3D078] bg-[#2A0810]/60 rounded-t-lg'
                  : 'border-transparent text-[#FDF8EE]/60 hover:text-[#FDF8EE]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* TAB 1: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#120306] border border-[#D4AF37]/30 text-xs text-[#FDF8EE] placeholder:text-[#FDF8EE]/30 focus:outline-none focus:border-[#F3D078]"
                    />
                    <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-2.5" />
                  </div>

                  <div className="text-xs text-[#FDF8EE]/70">
                    Total Exhibition Visitors: <strong>{usersList.length}</strong>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30 bg-[#120306]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1C050B] text-[#F3D078] border-b border-[#D4AF37]/20 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Role / Badge</th>
                        <th className="px-4 py-3 text-center">Spins</th>
                        <th className="px-4 py-3 text-center">Rounds</th>
                        <th className="px-4 py-3 text-center">Categories</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D4AF37]/10">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#1C050B]/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-[#FDF8EE]">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#2A0810] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-xs text-[#F3D078]">
                                {u.name[0]}
                              </span>
                              <span>{u.name}</span>
                              {u.isAdmin && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  ADMIN
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#FDF8EE]/70 font-devanagari">
                            {u.titleBadge}
                          </td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-[#F3D078]">
                            {u.totalSpins}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-[#38BDF8]">
                            {u.completedRounds}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-[#4ADE80]">
                            {u.categoriesExplored.length}/6
                          </td>
                          <td className="px-4 py-3 text-right">
                            {!u.isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/40 transition-colors cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: GAME MANAGEMENT (SAMAS EDITOR) */}
            {activeTab === 'game' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={exampleSearch}
                      onChange={(e) => setExampleSearch(e.target.value)}
                      placeholder="Search Sanskrit words or types..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#120306] border border-[#D4AF37]/30 text-xs text-[#FDF8EE] placeholder:text-[#FDF8EE]/30 focus:outline-none focus:border-[#F3D078]"
                    />
                    <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-2.5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3D078] text-[#120407] font-bold text-xs uppercase cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Samas Question</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  {filteredExamples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded-xl bg-[#120306] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-devanagari text-lg font-bold text-[#F3D078]">
                            {ex.samastapada}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A0810] text-[#D4AF37] border border-[#D4AF37]/30">
                            {ex.samasTypeSanskrit}
                          </span>
                        </div>
                        <div className="text-xs text-[#FDF8EE]/70 font-devanagari mt-1">
                          विग्रहः: <strong className="text-white">{ex.vigraha}</strong>
                        </div>
                        <div className="text-[11px] text-[#FDF8EE]/60 mt-1 line-clamp-1">
                          {ex.englishMeaning}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] text-[#FDF8EE]/50">
                        <span>
                          {ex.purvapada} + {ex.uttarapada}
                        </span>
                        <span className="text-[10px] text-amber-400">
                          {ex.isCoreExhibition ? 'Core Example' : 'Custom'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADMIN INFORMATION */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#150409] border border-[#D4AF37]/30">
                  <h3 className="font-devanagari text-base font-bold text-[#F3D078]">
                    DAV MODEL SCHOOL — स्थायी प्रशासनिक दलम् (Permanent Admin Council)
                  </h3>
                  <p className="text-xs text-[#FDF8EE]/70 mt-1">
                    The Sanskrit Samas Slot Machine is maintained under the permanent administrative stewardship of three accredited school leaders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DAV_ADMIN_PROFILES.map((admin) => (
                    <div
                      key={admin.name}
                      className="p-5 rounded-2xl bg-gradient-to-b from-[#18050B] to-[#100306] border-2 border-[#D4AF37]/35 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-[#120407] text-lg shadow-md"
                            style={{ backgroundColor: admin.accentColor }}
                          >
                            {admin.avatarInitials}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#FDF8EE]">
                              {admin.name}
                            </h4>
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2A0810] text-[#F3D078] border border-[#D4AF37]/30">
                              {admin.badge}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-[#F3D078]/90 mb-1">
                          {admin.role}
                        </div>
                        <div className="text-[11px] text-[#FDF8EE]/60 mb-3">
                          {admin.department}
                        </div>

                        <p className="text-xs text-[#FDF8EE]/80 leading-relaxed mb-3">
                          {admin.contribution}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#D4AF37]/20 text-[10px] text-[#FDF8EE]/50 italic">
                        {admin.bio}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SYSTEM SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                {/* Audio Engine Testing */}
                <div className="p-5 rounded-xl bg-[#120306] border border-[#D4AF37]/30 space-y-3">
                  <h4 className="text-sm font-bold text-[#F3D078] flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span>Sound &amp; Synthesizer Diagnostic Panel</span>
                  </h4>
                  <p className="text-xs text-[#FDF8EE]/70">
                    Verify high-fidelity arcade sound effects and Vedic Om drone playback for the school exhibition.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => soundEngine.playLeverPull()}
                      className="px-3 py-2 rounded-lg bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/30 cursor-pointer"
                    >
                      Lever Pull
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playReelSpinStart()}
                      className="px-3 py-2 rounded-lg bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/30 cursor-pointer"
                    >
                      Reel Spin Start
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playIndividualReelStop(0)}
                      className="px-3 py-2 rounded-lg bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/30 cursor-pointer"
                    >
                      Reel 1 Stop (C4)
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playIndividualReelStop(1)}
                      className="px-3 py-2 rounded-lg bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/30 cursor-pointer"
                    >
                      Reel 2 Stop (E4)
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playIndividualReelStop(2)}
                      className="px-3 py-2 rounded-lg bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/30 cursor-pointer"
                    >
                      Reel 3 Stop (G4)
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playCelebratoryJingle('master')}
                      className="px-3 py-2 rounded-lg bg-[#2A0810] hover:bg-[#3D0B18] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/30 cursor-pointer"
                    >
                      Win Fanfare Jingle
                    </button>
                    <button
                      type="button"
                      onClick={() => soundEngine.playSacredOmDrone(4.0)}
                      className="col-span-2 sm:col-span-3 px-3 py-2 rounded-lg bg-[#380E18] hover:bg-[#501323] text-xs font-semibold text-[#F3D078] border border-[#D4AF37]/50 cursor-pointer"
                    >
                      Test Sacred ॐ Drone (136.1 Hz Sadja)
                    </button>
                  </div>
                </div>

                {/* Confetti & Celebration Diagnostics */}
                <div className="p-5 rounded-xl bg-[#120306] border border-amber-400/30 space-y-3">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <PartyPopper className="w-4 h-4 text-amber-400" />
                    <span>Canvas-Confetti Arcade Celebration Diagnostic</span>
                  </h4>
                  <p className="text-xs text-[#FDF8EE]/70">
                    Preview the dynamic celebratory confetti physics triggered when a user scores a <strong>'Rare'</strong> or <strong>'Master'</strong> Sanskrit Samas compound.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playCelebratoryJingle();
                        triggerCelebratoryConfetti('master');
                        showToast('🏆 Master Level Dual-Cannon Confetti Triggered!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-purple-600/25 hover:from-amber-500/40 hover:to-purple-600/40 text-xs font-bold text-amber-200 border border-amber-400/50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>🏆 Test Master Level Confetti</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playResultReveal();
                        triggerCelebratoryConfetti('rare');
                        showToast('⭐ Rare Level Arcade Confetti Triggered!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/25 to-emerald-600/25 hover:from-sky-500/40 hover:to-emerald-600/40 text-xs font-bold text-sky-200 border border-sky-400/50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>⭐ Test Rare Level Confetti</span>
                    </button>
                  </div>
                </div>

                {/* Reset Exhibition Data */}
                <div className="p-5 rounded-xl bg-[#120306] border border-rose-500/30 space-y-3">
                  <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-400" />
                    <span>Factory Reset Exhibition Data</span>
                  </h4>
                  <p className="text-xs text-[#FDF8EE]/70 leading-relaxed">
                    Clear all temporary visitor spins, guest registrations, and custom added questions to reset the system for a new exhibition session.
                  </p>

                  {showResetConfirm ? (
                    <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/50 space-y-2">
                      <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Confirm Master Exhibition Reset?</span>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowResetConfirm(false)}
                          className="px-3 py-1 rounded bg-black/40 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            resetAllExhibitionData();
                            setShowResetConfirm(false);
                            onResetAllData?.();
                            setUsersList(getStoredUsers());
                            showToast('Exhibition data reset to defaults.');
                          }}
                          className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
                        >
                          Confirm &amp; Reset All
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-xs font-bold text-rose-300 cursor-pointer"
                    >
                      Reset Exhibition Session
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modal: Add New Samas Question */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1C050B] to-[#0E0205] border-2 border-[#D4AF37]/60 p-6 text-[#FDF8EE] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#FDF8EE]/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#F3D078] mb-1 font-devanagari">
                नया समास प्रश्न जोड़ें (Add Verified Samas)
              </h3>
              <p className="text-xs text-[#FDF8EE]/60 mb-4">
                DAV Model School Sanskrit Exhibition Database
              </p>

              <form onSubmit={handleCreateExample} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#F3D078] mb-1">
                      पूर्वपद (Purvapada) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. विद्या"
                      value={newPurvapada}
                      onChange={(e) => setNewPurvapada(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#F3D078] mb-1">
                      उत्तरपद (Uttarapada) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. आलयः"
                      value={newUttarapada}
                      onChange={(e) => setNewUttarapada(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#F3D078] mb-1">
                      समस्त पद (Samastapada) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. विद्यालयः"
                      value={newSamastapada}
                      onChange={(e) => setNewSamastapada(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#F3D078] mb-1">
                      समास प्रकार (Category) *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as SamasCategoryId)}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                    >
                      {SAMAS_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.sanskritName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#F3D078] mb-1">
                    विग्रहः (Vigraha Explanation) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. विद्यायाः आलयः"
                    value={newVigraha}
                    onChange={(e) => setNewVigraha(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#F3D078] mb-1">
                      हिन्दी अर्थ (Hindi Meaning)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. विद्या का घर (School)"
                      value={newHindiMeaning}
                      onChange={(e) => setNewHindiMeaning(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#F3D078] mb-1">
                      English Meaning
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Abode of knowledge (School)"
                      value={newEnglishMeaning}
                      onChange={(e) => setNewEnglishMeaning(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#120306] border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#F3D078]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-black/40 text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3D078] text-[#120407] font-bold shadow-md cursor-pointer"
                  >
                    Save Samas Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
