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
import type { UserRole } from '@heritage/shared';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  classId?: string;
  xp: number;
  level: number;
  streak: number;
}

const DEMO_STUDENT_KEY = 'heritage_web_student';
const DEMO_CLASS_CODE = 'HERIT1';
const DEMO_CLASS_ID = 'class-demo';

export function formatFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/popup-closed-by-user') {
      return 'Google sign-in was cancelled. Please try again.';
    }
    if (error.code === 'auth/popup-blocked') {
      return 'Pop-up was blocked. Allow pop-ups for this site and try again.';
    }
    if (error.code === 'unavailable' || error.message.toLowerCase().includes('offline')) {
      return [
        'Could not connect to Firebase Firestore.',
        'In Firebase Console: create a Firestore database (Build → Firestore → Create database),',
        'enable Google sign-in (Authentication → Sign-in method),',
        'and add this site to Authorized domains (Authentication → Settings).',
        'Then create a class document with joinCode HERIT1, or run the project seed script.',
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
    if (code === DEMO_CLASS_CODE) return DEMO_CLASS_ID;
    return null;
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
    const data = snap.data();
    return {
      uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: data.role,
      classId: data.classId,
      xp: data.xp ?? 0,
      level: data.level ?? 1,
      streak: data.streak ?? 0,
    };
  } catch (error) {
    throw new Error(formatFirebaseError(error));
  }
}

export async function createStudentProfile(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | undefined,
  classId: string
): Promise<AppUser> {
  const profile: AppUser = {
    uid,
    email,
    displayName,
    photoURL,
    role: 'student',
    classId,
    xp: 0,
    level: 1,
    streak: 0,
  };

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'users', uid), {
        email,
        displayName,
        photoURL: photoURL ?? null,
        role: 'student',
        classId,
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

export function saveDemoStudent(user: AppUser): void {
  localStorage.setItem(DEMO_STUDENT_KEY, JSON.stringify(user));
}

export function loadDemoStudent(): AppUser | null {
  const raw = localStorage.getItem(DEMO_STUDENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function clearDemoStudent(): void {
  localStorage.removeItem(DEMO_STUDENT_KEY);
}

export function createDemoGoogleStudent(
  displayName: string,
  email: string,
  classId: string
): AppUser {
  return {
    uid: `demo_${Date.now()}`,
    email,
    displayName,
    photoURL: undefined,
    role: 'student',
    classId,
    xp: 0,
    level: 1,
    streak: 0,
  };
}
