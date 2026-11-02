import {
  DAVUser,
  DAVGameHistoryItem,
  isAdminName,
  getTitleBadge,
  normalizeName,
} from '../types/davUser';
import { SamasExample } from '../data/samasExamples';

const STORAGE_USERS = 'dav_samas_users';
const STORAGE_CURRENT_USER = 'dav_samas_current_user';
const STORAGE_HISTORY = 'dav_samas_game_history';
const STORAGE_SETTINGS = 'dav_samas_admin_settings';

const AVATAR_COLORS = [
  'from-amber-600 to-yellow-500',
  'from-orange-600 to-amber-500',
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-indigo-500',
  'from-rose-600 to-red-500',
  'from-purple-600 to-indigo-500',
];

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

const INITIAL_DEMO_USERS: DAVUser[] = [
  {
    id: 'admin-debahuty',
    name: 'Debahuty Mam',
    totalSpins: 42,
    completedRounds: 8,
    categoriesExplored: [
      'tatpurusha',
      'karmadharaya',
      'dvandva',
      'bahuvrihi',
      'avyayibhava',
      'dvigu',
    ],
    recentWords: [
      {
        samasId: 'core-1',
        samastaPad: 'देवालयः',
        purvapada: 'देवस्य',
        uttarapada: 'आलयः',
        vigraha: 'देवस्य आलयः',
        categoryName: 'तत्पुरुष समास',
        englishMeaning: 'The temple or abode of God',
        timestamp: Date.now() - 1000 * 60 * 15,
      },
      {
        samasId: 'core-2',
        samastaPad: 'नीलोत्पलम्',
        purvapada: 'नीलम्',
        uttarapada: 'उत्पलम्',
        vigraha: 'नीलम् च तत् उत्पलम्',
        categoryName: 'कर्मधारय समास',
        englishMeaning: 'A blue lotus flower',
        timestamp: Date.now() - 1000 * 60 * 30,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    lastActive: Date.now() - 1000 * 60 * 15,
    isAdmin: true,
    avatarColor: 'from-amber-500 to-yellow-400',
    titleBadge: 'आचार्यः · Faculty Mentor',
  },
  {
    id: 'admin-pratyush',
    name: 'Pratyush Raj',
    totalSpins: 38,
    completedRounds: 7,
    categoriesExplored: [
      'tatpurusha',
      'karmadharaya',
      'dvandva',
      'bahuvrihi',
      'avyayibhava',
      'dvigu',
    ],
    recentWords: [
      {
        samasId: 'core-3',
        samastaPad: 'मातापितरौ',
        purvapada: 'माता',
        uttarapada: 'पिता',
        vigraha: 'माता च पिता च',
        categoryName: 'द्वन्द्व समास',
        englishMeaning: 'Mother and Father (Parents)',
        timestamp: Date.now() - 1000 * 60 * 25,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    lastActive: Date.now() - 1000 * 60 * 25,
    isAdmin: true,
    avatarColor: 'from-orange-500 to-amber-500',
    titleBadge: 'मुख्य-शिल्पी · Lead Architect',
  },
  {
    id: 'admin-pragyan',
    name: 'Pragyan Hazra',
    totalSpins: 35,
    completedRounds: 7,
    categoriesExplored: [
      'tatpurusha',
      'karmadharaya',
      'dvandva',
      'bahuvrihi',
      'avyayibhava',
      'dvigu',
    ],
    recentWords: [
      {
        samasId: 'core-4',
        samastaPad: 'पीताम्बरः',
        purvapada: 'पीतम्',
        uttarapada: 'अम्बरम्',
        vigraha: 'पीतम् अम्बरम् यस्य सः',
        categoryName: 'बहुव्रीहि समास',
        englishMeaning: 'One who wears yellow garments (Lord Krishna)',
        timestamp: Date.now() - 1000 * 60 * 45,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    lastActive: Date.now() - 1000 * 60 * 45,
    isAdmin: true,
    avatarColor: 'from-cyan-500 to-blue-600',
    titleBadge: 'शोध-प्रमुखः · Lead Researcher',
  },
  {
    id: 'student-ananya',
    name: 'Ananya Sharma',
    totalSpins: 24,
    completedRounds: 4,
    categoriesExplored: ['tatpurusha', 'karmadharaya', 'dvandva', 'avyayibhava'],
    recentWords: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    lastActive: Date.now() - 1000 * 60 * 50,
    isAdmin: false,
    avatarColor: 'from-rose-500 to-pink-600',
    titleBadge: 'संस्कृत विद्वान् (Sanskrit Scholar)',
  },
  {
    id: 'student-rohit',
    name: 'Rohit Sen',
    totalSpins: 18,
    completedRounds: 3,
    categoriesExplored: ['tatpurusha', 'dvigu', 'dvandva'],
    recentWords: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    lastActive: Date.now() - 1000 * 60 * 90,
    isAdmin: false,
    avatarColor: 'from-emerald-500 to-teal-600',
    titleBadge: 'समास प्रवीणः (Adept)',
  },
  {
    id: 'student-aditi',
    name: 'Aditi Mukhopadhyay',
    totalSpins: 12,
    completedRounds: 2,
    categoriesExplored: ['tatpurusha', 'bahuvrihi'],
    recentWords: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    lastActive: Date.now() - 1000 * 60 * 120,
    isAdmin: false,
    avatarColor: 'from-violet-500 to-purple-600',
    titleBadge: 'समास साधक (Learner)',
  },
];

export function getStoredUsers(): DAVUser[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    const parsed = JSON.parse(raw) as DAVUser[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read users from localStorage:', err);
  }
  return INITIAL_DEMO_USERS;
}

export function saveStoredUsers(users: DAVUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export function getCurrentUser(): DAVUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER);
    if (raw) {
      const user = JSON.parse(raw) as DAVUser;
      if (user && user.id) return user;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCurrentUser(user: DAVUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
    }
  } catch {
    // ignore
  }
}

export function registerOrLoginUser(rawName: string): { user: DAVUser; isNew: boolean } {
  const name = rawName.trim();
  const users = getStoredUsers();
  const targetNorm = normalizeName(name);

  // Check if exists
  const existingIndex = users.findIndex(
    (u) => normalizeName(u.name) === targetNorm
  );

  const admin = isAdminName(name);

  if (existingIndex >= 0) {
    const existing = {
      ...users[existingIndex],
      lastActive: Date.now(),
      isAdmin: admin || users[existingIndex].isAdmin,
    };
    users[existingIndex] = existing;
    saveStoredUsers(users);
    setCurrentUser(existing);
    return { user: existing, isNew: false };
  }

  // New user
  const newUser: DAVUser = {
    id: `dav-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    totalSpins: 0,
    completedRounds: 0,
    categoriesExplored: [],
    recentWords: [],
    createdAt: Date.now(),
    lastActive: Date.now(),
    isAdmin: admin,
    avatarColor: getRandomAvatarColor(),
    titleBadge: admin ? 'आचार्यः / शिल्पी (Admin)' : 'नव-जिज्ञासु (Beginner)',
  };

  const updatedUsers = [newUser, ...users];
  saveStoredUsers(updatedUsers);
  setCurrentUser(newUser);
  return { user: newUser, isNew: true };
}

export function logSpinEvent(
  userId: string,
  example: SamasExample
): { updatedUser: DAVUser | null; historyItem: DAVGameHistoryItem } {
  const users = getStoredUsers();
  const userIdx = users.findIndex((u) => u.id === userId);

  const historyItem: DAVGameHistoryItem = {
    id: `spin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    userName: userIdx >= 0 ? users[userIdx].name : 'Student',
    samasId: example.id,
    samastaPad: example.samastapada,
    purvapad: example.purvapada,
    uttarapad: example.uttarapada,
    categoryId: example.categoryId,
    categoryName: example.samasTypeSanskrit,
    vigraha: example.vigraha,
    timestamp: Date.now(),
  };

  // Append to global history
  try {
    const histRaw = localStorage.getItem(STORAGE_HISTORY);
    const history: DAVGameHistoryItem[] = histRaw ? JSON.parse(histRaw) : [];
    const updatedHistory = [historyItem, ...history.slice(0, 99)];
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(updatedHistory));
  } catch {
    // ignore
  }

  if (userIdx < 0) {
    return { updatedUser: null, historyItem };
  }

  const user = users[userIdx];
  const nextSpins = user.totalSpins + 1;
  const nextRounds = Math.floor(nextSpins / 5);

  const categories = user.categoriesExplored.includes(example.categoryId)
    ? user.categoriesExplored
    : [...user.categoriesExplored, example.categoryId];

  const recentWord = {
    samasId: example.id,
    samastaPad: example.samastapada,
    purvapada: example.purvapada,
    uttarapada: example.uttarapada,
    vigraha: example.vigraha,
    categoryName: example.samasTypeSanskrit,
    englishMeaning: example.englishMeaning,
    timestamp: Date.now(),
  };

  const recentWords = [
    recentWord,
    ...user.recentWords.filter((w) => w.samastaPad !== example.samastapada),
  ].slice(0, 10);

  const updatedUser: DAVUser = {
    ...user,
    totalSpins: nextSpins,
    completedRounds: nextRounds,
    categoriesExplored: categories,
    recentWords,
    lastActive: Date.now(),
    titleBadge: user.isAdmin ? user.titleBadge : getTitleBadge(nextSpins),
  };

  users[userIdx] = updatedUser;
  saveStoredUsers(users);
  setCurrentUser(updatedUser);

  return { updatedUser, historyItem };
}

export function getGameHistory(): DAVGameHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function resetUserData(userId: string): DAVUser | null {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;

  const current = users[idx];
  const resetUser: DAVUser = {
    ...current,
    totalSpins: 0,
    completedRounds: 0,
    categoriesExplored: [],
    recentWords: [],
    titleBadge: current.isAdmin ? current.titleBadge : 'नव-जिज्ञासु (Beginner)',
  };

  users[idx] = resetUser;
  saveStoredUsers(users);
  setCurrentUser(resetUser);
  return resetUser;
}

export function deleteUserAccount(userId: string): void {
  const users = getStoredUsers().filter((u) => u.id !== userId);
  saveStoredUsers(users);
  const cur = getCurrentUser();
  if (cur?.id === userId) {
    setCurrentUser(null);
  }
}

export function resetAllExhibitionData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_USERS);
    localStorage.removeItem(STORAGE_CURRENT_USER);
    localStorage.removeItem(STORAGE_HISTORY);
    localStorage.removeItem(STORAGE_SETTINGS);
  } catch {
    // ignore
  }
}
