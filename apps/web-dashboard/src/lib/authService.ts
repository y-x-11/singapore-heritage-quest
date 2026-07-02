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

export async function findClassByJoinCode(joinCode: string): Promise<string | null> {
  if (!db || !isFirebaseConfigured) {
    if (joinCode.toUpperCase() === 'HERIT1') return 'class-demo';
    return null;
  }
  const q = query(collection(db, 'classes'), where('joinCode', '==', joinCode.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

export async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  if (!db || !isFirebaseConfigured) return null;
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
