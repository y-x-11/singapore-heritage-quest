/**
 * Seed script — run with Firebase Admin credentials:
 *   FIREBASE_PROJECT_ID=xxx GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json npm run seed
 */
import {
  BADGES,
  CHARACTERS,
  COLLECTIBLES,
  LOCATIONS,
  MISSIONS,
  QUIZZES,
} from './seedData';

async function seed() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.log('No FIREBASE_PROJECT_ID set. Printing seed data summary instead:');
    console.log(`  Characters: ${CHARACTERS.length}`);
    console.log(`  Locations: ${LOCATIONS.length}`);
    console.log(`  Missions: ${MISSIONS.length}`);
    console.log(`  Quizzes: ${QUIZZES.length}`);
    console.log(`  Badges: ${BADGES.length}`);
    console.log(`  Collectibles: ${COLLECTIBLES.length}`);
    console.log('\nQR codes for heritage cards:');
    MISSIONS.forEach((m) => console.log(`  ${m.title}: ${m.unlockQrCode}`));
    return;
  }

  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  if (!getApps().length) {
    initializeApp({ projectId, credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!) });
  }

  const db = getFirestore();
  const batch = db.batch();

  for (const c of CHARACTERS) batch.set(db.collection('characters').doc(c.id), c);
  for (const l of LOCATIONS) batch.set(db.collection('locations').doc(l.id), l);
  for (const m of MISSIONS) batch.set(db.collection('missions').doc(m.id), m);
  for (const q of QUIZZES) batch.set(db.collection('quizzes').doc(q.id), q);
  for (const b of BADGES) batch.set(db.collection('badges').doc(b.id), b);
  for (const c of COLLECTIBLES) batch.set(db.collection('collectibles').doc(c.id), c);

  await batch.commit();
  console.log('Seed complete!');
}

seed().catch(console.error);
