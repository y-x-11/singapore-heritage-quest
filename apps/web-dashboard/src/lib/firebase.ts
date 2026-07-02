import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function looksLikePlaceholder(value: string | undefined) {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  if (!v) return true;
  if (v.startsWith('your') || v.includes('your-')) return true;
  if (v === 'abc123' || v.includes('abc123')) return true;
  if (v.includes('your-project-id') || v.includes('your-project')) return true;
  return false;
}

export const isFirebaseConfigured = !(
  looksLikePlaceholder(firebaseConfig.apiKey) ||
  looksLikePlaceholder(firebaseConfig.authDomain) ||
  looksLikePlaceholder(firebaseConfig.projectId) ||
  looksLikePlaceholder(firebaseConfig.storageBucket) ||
  looksLikePlaceholder(firebaseConfig.messagingSenderId) ||
  looksLikePlaceholder(firebaseConfig.appId)
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalAutoDetectLongPolling: true,
  });
}

export { app, db };
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
