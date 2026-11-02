export const DAV_ADMIN_ALLOWLIST = [
  'Debahuty Mam',
  'Pratyush Raj',
  'Pragyan Hazra',
] as const;

export type DAVAdminName = (typeof DAV_ADMIN_ALLOWLIST)[number];

export interface DAVUserRecentWord {
  samasId: string;
  samastaPad: string;
  purvapada: string;
  uttarapada: string;
  vigraha: string;
  categoryName: string;
  englishMeaning: string;
  timestamp: number;
}

export interface DAVUser {
  id: string;
  name: string;
  totalSpins: number;
  completedRounds: number;
  categoriesExplored: string[];
  recentWords: DAVUserRecentWord[];
  createdAt: number;
  lastActive: number;
  isAdmin: boolean;
  avatarColor: string;
  titleBadge: string;
}

export interface DAVGameHistoryItem {
  id: string;
  userId: string;
  userName: string;
  samasId: string;
  samastaPad: string;
  purvapad: string;
  uttarapad: string;
  categoryId: string;
  categoryName: string;
  vigraha: string;
  timestamp: number;
}

export interface DAVAdminProfile {
  name: string;
  role: string;
  designation: string;
  department: string;
  contribution: string;
  bio: string;
  avatarInitials: string;
  badge: string;
  accentColor: string;
}

export const DAV_ADMIN_PROFILES: DAVAdminProfile[] = [
  {
    name: 'Debahuty Mam',
    role: 'Faculty Mentor & Exhibition In-Charge',
    designation: 'Senior Faculty, Sanskrit & Indic Studies',
    department: 'Department of Sanskrit, DAV Model School',
    contribution: 'Grammatical verification of all 47 Samas equations, pedagogical design, and academic supervision.',
    bio: 'Guided the student development team in Paninian grammar rules, ensuring authentic Devanagari orthography and Vigraha definitions.',
    avatarInitials: 'DM',
    badge: 'Faculty Guide · आचार्यः',
    accentColor: '#D4AF37',
  },
  {
    name: 'Pratyush Raj',
    role: 'Lead Architect & Technical Developer',
    designation: 'Student Innovator, Class X',
    department: 'Computer Science & STEM Innovation Club, DAV Model School',
    contribution: 'Slot machine physics, 3D reel deceleration dynamics, Web Audio synthesis engine, and interactive frontend.',
    bio: 'Pioneered the vintage luxury arcade aesthetic integrated with Devanagari typography, sound design, and local persistence algorithms.',
    avatarInitials: 'PR',
    badge: 'Lead Architect · मुख्य-शिल्पी',
    accentColor: '#FF7A00',
  },
  {
    name: 'Pragyan Hazra',
    role: 'Lead Researcher & Linguistic Data Analyst',
    designation: 'Student Innovator, Class X',
    department: 'Sanskrit Literary Society, DAV Model School',
    contribution: 'Curated comprehensive 6-category Samas dataset, English & Hindi commentaries, and beginner-friendly examples.',
    bio: 'Compiled exhaustive transliterations, Vigraha breakdowns, and Paninian sutra references across Tatpurusha, Karmadharaya, Bahuvrihi, etc.',
    avatarInitials: 'PH',
    badge: 'Lead Researcher · शोध-प्रमुखः',
    accentColor: '#38BDF8',
  },
];

export function normalizeName(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isAdminName(name: string): boolean {
  const norm = normalizeName(name);
  return DAV_ADMIN_ALLOWLIST.some((admin) => normalizeName(admin) === norm);
}

export function getTitleBadge(spins: number): string {
  if (spins >= 30) return 'समास चक्रवर्ती (Grand Master)';
  if (spins >= 20) return 'संस्कृत विद्वान् (Sanskrit Scholar)';
  if (spins >= 10) return 'समास प्रवीणः (Adept)';
  if (spins >= 5) return 'समास साधक (Learner)';
  return 'नव-जिज्ञासु (Beginner)';
}
