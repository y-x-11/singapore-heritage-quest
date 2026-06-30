export const THEME = {
  merlionRed: '#E63946',
  tropicalTeal: '#2A9D8F',
  sunshineYellow: '#FFD166',
  heritageGold: '#F4A261',
  deepNavy: '#1D3557',
  softCream: '#FFF8F0',
  white: '#FFFFFF',
  success: '#06D6A0',
  error: '#EF476F',
  purple: '#9B5DE5',
} as const;

export const XP_PER_LEVEL = 100;

export const PROXIMITY_RADIUS_METERS = 150;

export function xpForLevel(level: number): number {
  return level * XP_PER_LEVEL;
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function levelProgress(xp: number): number {
  const currentLevelXp = (calculateLevel(xp) - 1) * XP_PER_LEVEL;
  const xpInLevel = xp - currentLevelXp;
  return Math.min(xpInLevel / XP_PER_LEVEL, 1);
}

export function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function parseQrPayload(data: string): { locationId: string; missionId: string; unlockToken: string } | null {
  try {
    const parsed = JSON.parse(data);
    if (parsed.locationId && parsed.missionId && parsed.unlockToken) {
      return parsed;
    }
    if (data.startsWith('heritage:')) {
      const [, locationId, missionId, unlockToken] = data.split(':');
      if (locationId && missionId && unlockToken) {
        return { locationId, missionId, unlockToken };
      }
    }
    return null;
  } catch {
    if (data.startsWith('heritage:')) {
      const [, locationId, missionId, unlockToken] = data.split(':');
      if (locationId && missionId && unlockToken) {
        return { locationId, missionId, unlockToken };
      }
    }
    return null;
  }
}

export function formatQrPayload(locationId: string, missionId: string, unlockToken: string): string {
  return JSON.stringify({ locationId, missionId, unlockToken });
}
