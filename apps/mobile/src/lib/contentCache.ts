import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHARACTERS, LOCATIONS, MISSIONS, QUIZZES, BADGES, COLLECTIBLES } from '@/lib/data';

const CACHE_KEY = 'heritage_content_cache';

export async function cacheContent(): Promise<void> {
  await AsyncStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ CHARACTERS, LOCATIONS, MISSIONS, QUIZZES, BADGES, COLLECTIBLES, cachedAt: new Date().toISOString() })
  );
}

export async function getCachedContent() {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function ensureContentCached(): Promise<void> {
  const cached = await getCachedContent();
  if (!cached) await cacheContent();
}
