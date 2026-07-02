export type UserRole = 'student' | 'teacher';

export type MissionStatus = 'locked' | 'discovered' | 'unlocked' | 'completed';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  classId?: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  onboardingComplete?: boolean;
}

export interface ClassRoom {
  id: string;
  name: string;
  teacherId: string;
  schoolName: string;
  joinCode: string;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  locationId: string;
  introLine: string;
  emoji: string;
  color: string;
  lottieUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  characterId: string;
  description: string;
  emoji: string;
  color: string;
}

/** Rich content for website location pages — edit in locations.config.ts */
export interface LocationHighlight {
  title: string;
  description: string;
  icon: string;
}

/** Mini-game shown on each location's explore page */
export interface LocationGameConfig {
  type: 'catch';
  title: string;
  instructions: string;
  catcherName: string;
  /** Emoji shown above the open-mouth catcher sprite */
  catcherEmoji: string;
  /** Items that fall from the sky */
  items: string[];
  /** Score needed to win */
  winScore: number;
  /** Heritage fact shown after winning */
  winMessage: string;
}

export interface LocationGuide {
  id: string;
  name: string;
  district: string;
  emoji: string;
  color: string;
  characterId: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  tagline: string;
  shortDescription: string;
  overview: string;
  heroImage: string;
  gallery: string[];
  highlights: LocationHighlight[];
  funFacts: string[];
  visitTips: string[];
  game: LocationGameConfig;
}

export interface StoryPanel {
  text: string;
  emoji: string;
}

export interface Mission {
  id: string;
  locationId: string;
  characterId: string;
  title: string;
  story: string;
  storyPanels: StoryPanel[];
  xpReward: number;
  unlockQrCode: string;
  quizId: string;
  badgeId: string;
  collectibleIds: string[];
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  missionId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  locationId: string;
  emoji: string;
  color: string;
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  locationId: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface Progress {
  id: string;
  userId: string;
  missionId: string;
  locationId: string;
  status: MissionStatus;
  quizScore?: number;
  completedAt?: string;
  unlockedAt?: string;
  discoveredAt?: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
}

export interface UserCollectible {
  id: string;
  userId: string;
  collectibleId: string;
  earnedAt: string;
}

export interface QrPayload {
  locationId: string;
  missionId: string;
  unlockToken: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'scan' | 'quiz' | 'visit';
}
