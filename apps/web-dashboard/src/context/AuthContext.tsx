import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import {
  AppUser,
  fetchUserProfile,
  createStudentProfile,
  saveDemoStudent,
  loadDemoStudent,
  clearDemoStudent,
  createDemoGoogleStudent,
  formatFirebaseError,
  applyXpToUser,
  persistUserXp,
  updateUserUsername,
  validateUsername,
} from '../lib/authService';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isConfigured: boolean;
  /** Teacher email/password (demo or Firebase) */
  loginTeacher: (email: string, password: string) => Promise<void>;
  /** Student — Google sign-in */
  loginStudentWithGoogle: () => Promise<void>;
  /** Add XP after completing a mini-game (no-op for guests) */
  awardGameXp: (gameId: string, amount: number) => void;
  /** Set the public username shown on profile and leaderboard */
  updateUsername: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_TEACHER_KEY = 'heritage_teacher';

function mapFirebaseUser(fb: FirebaseUser, profile: AppUser): AppUser {
  return {
    ...profile,
    email: fb.email ?? profile.email,
    displayName: fb.displayName ?? profile.displayName,
    photoURL: fb.photoURL ?? profile.photoURL,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      const demoStudent = loadDemoStudent();
      const demoTeacher = localStorage.getItem(DEMO_TEACHER_KEY);
      if (demoStudent) setUser(demoStudent);
      else if (demoTeacher) setUser(JSON.parse(demoTeacher));
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await fetchUserProfile(fbUser.uid);
        if (profile) {
          setUser(mapFirebaseUser(fbUser, profile));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const loginTeacher = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile(auth.currentUser!.uid);
      if (profile?.role !== 'teacher') {
        await signOut(auth);
        throw new Error('This account is not registered as a teacher.');
      }
      return;
    }
    const u: AppUser = {
      uid: 'demo_teacher',
      email,
      displayName: email.split('@')[0],
      role: 'teacher',
      xp: 0,
      level: 1,
      streak: 0,
    };
    localStorage.setItem(DEMO_TEACHER_KEY, JSON.stringify(u));
    clearDemoStudent();
    setUser(u);
  };

  const loginStudentWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      const demo = createDemoGoogleStudent('Student Explorer', 'student@demo.school');
      saveDemoStudent(demo);
      localStorage.removeItem(DEMO_TEACHER_KEY);
      setUser(demo);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      let profile = await fetchUserProfile(fbUser.uid);

      if (!profile) {
        profile = await createStudentProfile(
          fbUser.uid,
          fbUser.email ?? '',
          fbUser.displayName ?? 'Student',
          fbUser.photoURL ?? undefined
        );
      } else if (profile.role !== 'student') {
        await signOut(auth);
        throw new Error('This Google account is registered as a teacher. Use the teacher login instead.');
      }

      setUser(mapFirebaseUser(fbUser, profile));
      localStorage.removeItem(DEMO_TEACHER_KEY);
    } catch (error) {
      if (auth.currentUser) {
        await signOut(auth);
      }
      throw new Error(formatFirebaseError(error));
    }
  };

  const awardGameXp = (_gameId: string, amount: number) => {
    if (!user || user.role !== 'student' || amount <= 0) return;
    const updated = applyXpToUser(user, amount);
    setUser(updated);
    if (!isFirebaseConfigured || !auth) {
      saveDemoStudent(updated);
      return;
    }
    void persistUserXp(updated.uid, updated.xp, updated.level).catch(() => {
      /* keep local state even if sync fails */
    });
  };

  const updateUsername = async (username: string) => {
    if (!user || user.role !== 'student') return;
    const trimmed = validateUsername(username);
    if (!isFirebaseConfigured || !auth) {
      const updated = { ...user, username: trimmed };
      saveDemoStudent(updated);
      setUser(updated);
      return;
    }
    await updateUserUsername(user.uid, trimmed);
    setUser({ ...user, username: trimmed });
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
    localStorage.removeItem(DEMO_TEACHER_KEY);
    clearDemoStudent();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        loginTeacher,
        loginStudentWithGoogle,
        awardGameXp,
        updateUsername,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
