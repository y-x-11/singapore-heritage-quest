import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Progress, MissionStatus } from '@/lib/data';
import { calculateLevel, generateJoinCode } from '@/lib/data';

const DEMO_USER_KEY = 'heritage_demo_user';
const DEMO_PROGRESS_KEY = 'heritage_demo_progress';
const DEMO_BADGES_KEY = 'heritage_demo_badges';
const DEMO_COLLECTIBLES_KEY = 'heritage_demo_collectibles';
const ONBOARDING_KEY = 'heritage_onboarding_done';

interface AuthState {
  user: User | null;
  progress: Progress[];
  loading: boolean;
  onboardingDone: boolean;
  setUser: (user: User | null) => void;
  loadSession: () => Promise<void>;
  loginDemo: (email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  signupDemo: (email: string, password: string, displayName: string, role: 'student' | 'teacher', classCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateProgress: (missionId: string, locationId: string, status: MissionStatus, extra?: Partial<Progress>) => Promise<void>;
  awardXp: (amount: number) => Promise<void>;
  awardBadge: (badgeId: string) => Promise<void>;
  awardCollectible: (collectibleId: string) => Promise<void>;
  badges: string[];
  collectibles: string[];
}

function makeDemoUser(email: string, displayName: string, role: 'student' | 'teacher', classId?: string): User {
  return {
    uid: `demo_${Date.now()}`,
    email,
    displayName,
    role,
    classId: classId ?? (role === 'student' ? 'class-demo' : undefined),
    xp: 0,
    level: 1,
    streak: 1,
    lastActive: new Date().toISOString(),
    onboardingComplete: true,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  progress: [],
  loading: true,
  onboardingDone: false,
  badges: [],
  collectibles: [],

  setUser: (user) => set({ user }),

  loadSession: async () => {
    try {
      const [userJson, progressJson, badgesJson, collectiblesJson, onboarding] = await Promise.all([
        AsyncStorage.getItem(DEMO_USER_KEY),
        AsyncStorage.getItem(DEMO_PROGRESS_KEY),
        AsyncStorage.getItem(DEMO_BADGES_KEY),
        AsyncStorage.getItem(DEMO_COLLECTIBLES_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);
      if (userJson) {
        const user = JSON.parse(userJson) as User;
        const progress = progressJson ? (JSON.parse(progressJson) as Progress[]) : [];
        const badges = badgesJson ? (JSON.parse(badgesJson) as string[]) : [];
        const collectibles = collectiblesJson ? (JSON.parse(collectiblesJson) as string[]) : [];
        set({ user, progress, badges, collectibles, onboardingDone: onboarding === 'true' });
      } else {
        set({ onboardingDone: onboarding === 'true' });
      }
    } finally {
      set({ loading: false });
    }
  },

  loginDemo: async (email, _password, role) => {
    const user = makeDemoUser(email, email.split('@')[0], role);
    await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    set({ user, progress: [] });
  },

  signupDemo: async (email, _password, displayName, role, classCode) => {
    const user = makeDemoUser(email, displayName, role, classCode ? 'class-demo' : undefined);
    await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    set({ user, progress: [] });
  },

  logout: async () => {
    await AsyncStorage.multiRemove([DEMO_USER_KEY, DEMO_PROGRESS_KEY, DEMO_BADGES_KEY, DEMO_COLLECTIBLES_KEY]);
    set({ user: null, progress: [], badges: [], collectibles: [] });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ onboardingDone: true });
  },

  updateProgress: async (missionId, locationId, status, extra = {}) => {
    const { user, progress } = get();
    if (!user) return;
    const existing = progress.find((p) => p.missionId === missionId);
    const now = new Date().toISOString();
    let updated: Progress[];
    if (existing) {
      updated = progress.map((p) =>
        p.missionId === missionId
          ? { ...p, status, ...extra, ...(status === 'unlocked' ? { unlockedAt: now } : {}), ...(status === 'discovered' ? { discoveredAt: now } : {}), ...(status === 'completed' ? { completedAt: now } : {}) }
          : p
      );
    } else {
      updated = [
        ...progress,
        {
          id: `${user.uid}_${missionId}`,
          userId: user.uid,
          missionId,
          locationId,
          status,
          ...extra,
          ...(status === 'unlocked' ? { unlockedAt: now } : {}),
          ...(status === 'discovered' ? { discoveredAt: now } : {}),
          ...(status === 'completed' ? { completedAt: now } : {}),
        },
      ];
    }
    await AsyncStorage.setItem(DEMO_PROGRESS_KEY, JSON.stringify(updated));
    set({ progress: updated });
  },

  awardXp: async (amount) => {
    const { user } = get();
    if (!user) return;
    const xp = user.xp + amount;
    const updated = { ...user, xp, level: calculateLevel(xp), lastActive: new Date().toISOString() };
    await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  awardBadge: async (badgeId) => {
    const { badges } = get();
    if (badges.includes(badgeId)) return;
    const updated = [...badges, badgeId];
    await AsyncStorage.setItem(DEMO_BADGES_KEY, JSON.stringify(updated));
    set({ badges: updated });
  },

  awardCollectible: async (collectibleId) => {
    const { collectibles } = get();
    if (collectibles.includes(collectibleId)) return;
    const updated = [...collectibles, collectibleId];
    await AsyncStorage.setItem(DEMO_COLLECTIBLES_KEY, JSON.stringify(updated));
    set({ collectibles: updated });
  },
}));

export { generateJoinCode };
