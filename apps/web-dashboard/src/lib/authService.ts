import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db, isFirebaseConfigured } from './firebase';
import { calculateLevel, type UserRole } from '@heritage/shared';

export interface SavedMural {
  id: string;
  title: string;
  imageDataUrl: string;
  createdAt: string;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  /** Public name shown on profile and leaderboard */
  username?: string;
  photoURL?: string;
  role: UserRole;
  classId?: string;
  xp: number;
  level: number;
  streak: number;
  /** Murals saved from Create Your Mural */
  savedMurals: SavedMural[];
  /** Which saved mural appears on the leaderboard */
  showcaseMuralId?: string;
}

export interface LeaderboardEntry {
  uid: string;
  username: string;
  photoURL?: string;
  level: number;
  xp: number;
  showcaseMuralId?: string;
  showcaseMuralTitle?: string;
  showcaseMuralImageDataUrl?: string;
}

const USERNAME_MIN = 2;
const USERNAME_MAX = 20;
const MURAL_TITLE_MAX = 25;
const MURAL_DATA_URL_MAX = 900_000;
export const SAVED_MURALS_MAX = 12;

function isSavedMural(value: unknown): value is SavedMural {
  if (!value || typeof value !== 'object') return false;
  const m = value as SavedMural;
  return (
    typeof m.id === 'string' &&
    typeof m.title === 'string' &&
    typeof m.imageDataUrl === 'string' &&
    m.imageDataUrl.startsWith('data:image/')
  );
}

function parseSavedMurals(data: Record<string, unknown>): SavedMural[] {
  if (Array.isArray(data.savedMurals)) {
    return data.savedMurals.filter(isSavedMural);
  }
  const legacyUrl = data.muralImageDataUrl;
  const legacyTitle = data.muralTitle;
  if (typeof legacyUrl === 'string' && typeof legacyTitle === 'string' && legacyUrl.startsWith('data:image/')) {
    return [
      {
        id: 'mural_legacy',
        title: legacyTitle,
        imageDataUrl: legacyUrl,
        createdAt: typeof data.lastActive === 'string' ? data.lastActive : new Date().toISOString(),
      },
    ];
  }
  return [];
}

export function muralShowcasePreview(
  savedMurals: SavedMural[],
  showcaseMuralId?: string
): Pick<LeaderboardEntry, 'showcaseMuralTitle' | 'showcaseMuralImageDataUrl'> {
  if (!showcaseMuralId) return {};
  const mural = savedMurals.find((m) => m.id === showcaseMuralId);
  if (!mural) return {};
  return { showcaseMuralTitle: mural.title, showcaseMuralImageDataUrl: mural.imageDataUrl };
}

function mapFirestoreUser(uid: string, data: Record<string, unknown>): AppUser {
  const savedMurals = parseSavedMurals(data);
  const showcaseMuralIdRaw = data.showcaseMuralId;
  const showcaseMuralId =
    typeof showcaseMuralIdRaw === 'string' && savedMurals.some((m) => m.id === showcaseMuralIdRaw)
      ? showcaseMuralIdRaw
      : undefined;

  return {
    uid,
    email: String(data.email ?? ''),
    displayName: String(data.displayName ?? 'Explorer'),
    username: data.username
      ? String(data.username)
      : defaultUsernameFromDisplayName(String(data.displayName ?? 'Explorer')),
    photoURL: data.photoURL ? String(data.photoURL) : undefined,
    role: data.role as UserRole,
    classId: data.classId ? String(data.classId) : undefined,
    xp: Number(data.xp ?? 0),
    level: Number(data.level ?? 1),
    streak: Number(data.streak ?? 0),
    savedMurals,
    showcaseMuralId,
  };
}

export function normalizeAppUser(user: AppUser): AppUser {
  const savedMurals = user.savedMurals ?? [];
  const legacy = user as AppUser & { muralImageDataUrl?: string; muralTitle?: string };
  let murals = savedMurals;
  if (!murals.length && legacy.muralImageDataUrl && legacy.muralTitle) {
    murals = [
      {
        id: 'mural_legacy',
        title: legacy.muralTitle,
        imageDataUrl: legacy.muralImageDataUrl,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  const showcaseMuralId =
    user.showcaseMuralId && murals.some((m) => m.id === user.showcaseMuralId)
      ? user.showcaseMuralId
      : undefined;
  return { ...user, savedMurals: murals, showcaseMuralId };
}

export function defaultUsernameFromDisplayName(displayName: string): string {
  const cleaned = displayName.trim().replace(/\s+/g, ' ').slice(0, USERNAME_MAX);
  return cleaned.length >= USERNAME_MIN ? cleaned : 'Explorer';
}

export function validateUsername(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  if (trimmed.length < USERNAME_MIN || trimmed.length > USERNAME_MAX) {
    throw new Error(`Username must be ${USERNAME_MIN} to ${USERNAME_MAX} characters.`);
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
    throw new Error('Username may only use letters, numbers, and spaces.');
  }
  return trimmed;
}

export function publicUsername(user: Pick<AppUser, 'username' | 'displayName'>): string {
  return user.username?.trim() || user.displayName;
}

const DEMO_STUDENT_KEY = 'heritage_web_student';
/** Demo join codes → class IDs (add entries here for extra groups in demo mode) */
const DEMO_CLASSES: Record<string, string> = {
  HERIT1: 'class-demo',
  TEST1: 'class-test1',
};

export function formatFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/popup-closed-by-user') {
      return 'Google sign in was cancelled. Please try again.';
    }
    if (error.code === 'auth/popup-blocked') {
      return 'Pop up was blocked. Allow pop ups for this site and try again.';
    }
    if (error.code === 'unavailable' || error.message.toLowerCase().includes('offline')) {
      return [
        'Could not connect to Firebase Firestore.',
        'In Firebase Console: create a Firestore database (Build, Firestore, Create database),',
        'enable Google sign in (Authentication, Sign in method),',
        'and add this site to Authorized domains (Authentication, Settings).',
        'Then create a class document with a joinCode, or run the project seed script.',
      ].join(' ');
    }
    if (error.code === 'permission-denied') {
      return 'Firebase permission denied. Deploy the Firestore rules from the firebase/ folder in this repo.';
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Sign in failed. Please try again.';
}

export async function findClassByJoinCode(joinCode: string): Promise<string | null> {
  const code = joinCode.trim().toUpperCase();
  if (!db || !isFirebaseConfigured) {
    return DEMO_CLASSES[code] ?? null;
  }

  try {
    const q = query(collection(db, 'classes'), where('joinCode', '==', code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].id;
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}

export async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  if (!db || !isFirebaseConfigured) return null;

  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return mapFirestoreUser(uid, snap.data() as Record<string, unknown>);
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}

export function validateMuralTitle(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  if (!trimmed.length) {
    throw new Error('Give your mural a name.');
  }
  if (trimmed.length > MURAL_TITLE_MAX) {
    throw new Error(`Mural name must be ${MURAL_TITLE_MAX} characters or fewer.`);
  }
  return trimmed;
}

export function createSavedMural(title: string, imageDataUrl: string): SavedMural {
  const muralTitle = validateMuralTitle(title);
  if (!imageDataUrl.startsWith('data:image/')) {
    throw new Error('Invalid mural image.');
  }
  if (imageDataUrl.length > MURAL_DATA_URL_MAX) {
    throw new Error('Mural image is too large. Try fewer brush strokes or simpler shapes.');
  }
  return {
    id: `mural_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: muralTitle,
    imageDataUrl,
    createdAt: new Date().toISOString(),
  };
}

export async function persistSavedMuralsState(
  uid: string,
  savedMurals: SavedMural[],
  showcaseMuralId?: string
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const preview = muralShowcasePreview(savedMurals, showcaseMuralId);
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        savedMurals,
        showcaseMuralId: showcaseMuralId ?? null,
        showcaseMuralTitle: preview.showcaseMuralTitle ?? null,
        showcaseMuralImageDataUrl: preview.showcaseMuralImageDataUrl ?? null,
        muralTitle: null,
        muralImageDataUrl: null,
        showcaseBadgeId: null,
        lastActive: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}

export async function createStudentProfile(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | undefined,
  classId?: string
): Promise<AppUser> {
  const username = defaultUsernameFromDisplayName(displayName);
  const profile: AppUser = {
    uid,
    email,
    displayName,
    username,
    photoURL,
    role: 'student',
    classId,
    xp: 0,
    level: 1,
    streak: 0,
    savedMurals: [],
  };

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'users', uid), {
        email,
        displayName,
        username,
        photoURL: photoURL ?? null,
        role: 'student',
        ...(classId ? { classId } : {}),
        xp: 0,
        level: 1,
        streak: 0,
        lastActive: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(formatFirebaseError(error));
    }
  }

  return profile;
}

export async function persistUserXp(uid: string, xp: number, level: number): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    await setDoc(
      doc(db, 'users', uid),
      { xp, level, lastActive: new Date().toISOString() },
      { merge: true }
    );
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}

export function applyXpToUser(user: AppUser, amount: number): AppUser {
  const xp = user.xp + amount;
  return { ...user, xp, level: calculateLevel(xp) };
}

export function saveDemoStudent(user: AppUser): void {
  localStorage.setItem(DEMO_STUDENT_KEY, JSON.stringify(normalizeAppUser(user)));
}

export function loadDemoStudent(): AppUser | null {
  const raw = localStorage.getItem(DEMO_STUDENT_KEY);
  if (!raw) return null;
  try {
    return normalizeAppUser(JSON.parse(raw) as AppUser);
  } catch {
    return null;
  }
}

export function clearDemoStudent(): void {
  localStorage.removeItem(DEMO_STUDENT_KEY);
}

export function createDemoGoogleStudent(displayName: string, email: string): AppUser {
  return normalizeAppUser({
    uid: `demo_${Date.now()}`,
    email,
    displayName,
    username: defaultUsernameFromDisplayName(displayName),
    photoURL: undefined,
    role: 'student',
    xp: 0,
    level: 1,
    streak: 0,
    savedMurals: [],
  });
}

export async function updateUserUsername(uid: string, username: string): Promise<void> {
  const valid = validateUsername(username);
  if (!db || !isFirebaseConfigured) return;
  try {
    await setDoc(
      doc(db, 'users', uid),
      { username: valid, lastActive: new Date().toISOString() },
      { merge: true }
    );
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!db || !isFirebaseConfigured) {
    const demo = loadDemoStudent();
    if (!demo) return [];
    return [
      {
        uid: demo.uid,
        username: publicUsername(demo),
        photoURL: demo.photoURL,
        level: demo.level,
        xp: demo.xp,
        ...muralShowcasePreview(demo.savedMurals ?? [], demo.showcaseMuralId),
        showcaseMuralId: demo.showcaseMuralId,
      },
    ];
  }

  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const snap = await getDocs(q);
    const entries: LeaderboardEntry[] = snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const savedMurals = parseSavedMurals(data);
      const showcaseMuralId =
        typeof data.showcaseMuralId === 'string' ? data.showcaseMuralId : undefined;
      const denormTitle = typeof data.showcaseMuralTitle === 'string' ? data.showcaseMuralTitle : undefined;
      const denormImage =
        typeof data.showcaseMuralImageDataUrl === 'string' ? data.showcaseMuralImageDataUrl : undefined;
      const fromMurals = muralShowcasePreview(savedMurals, showcaseMuralId);
      return {
        uid: d.id,
        username:
          (typeof data.username === 'string' && data.username) ||
          defaultUsernameFromDisplayName(String(data.displayName ?? 'Explorer')),
        photoURL: typeof data.photoURL === 'string' ? data.photoURL : undefined,
        level: Number(data.level ?? 1),
        xp: Number(data.xp ?? 0),
        showcaseMuralId,
        showcaseMuralTitle: denormTitle ?? fromMurals.showcaseMuralTitle,
        showcaseMuralImageDataUrl: denormImage ?? fromMurals.showcaseMuralImageDataUrl,
      };
    });
    return entries.sort((a, b) => b.level - a.level || b.xp - a.xp);
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}
