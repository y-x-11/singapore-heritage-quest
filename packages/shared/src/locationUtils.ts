import type { Location, LocationGuide } from './types';
import { LOCATION_GUIDES } from './locations.config';

/** Convert rich config into basic Location records for the mobile app */
export function toLocation(guide: LocationGuide): Location {
  return {
    id: guide.id,
    name: guide.name,
    district: guide.district,
    lat: guide.lat,
    lng: guide.lng,
    radiusMeters: guide.radiusMeters,
    characterId: guide.characterId,
    description: guide.shortDescription,
    emoji: guide.emoji,
    color: guide.color,
  };
}

export const LOCATIONS_FROM_CONFIG: Location[] = LOCATION_GUIDES.map(toLocation);

export function getLocationGuide(id: string): LocationGuide | undefined {
  return LOCATION_GUIDES.find((g) => g.id === id);
}

/** Full URL encoded in location QR codes — opens the heritage info page */
export function getLocationPageUrl(locationId: string, siteBaseUrl: string): string {
  const base = siteBaseUrl.endsWith('/') ? siteBaseUrl : `${siteBaseUrl}/`;
  return `${base}explore/location/${locationId}`;
}

/** Resolve image path from config (relative or absolute URL) */
export function resolveAssetUrl(path: string, siteBaseUrl: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = siteBaseUrl.endsWith('/') ? siteBaseUrl : `${siteBaseUrl}/`;
  return `${base}${path.replace(/^\//, '')}`;
}

/** Parse scanned QR text into a location id, if recognised */
export function parseLocationQrData(data: string, siteBaseUrl?: string): string | null {
  const trimmed = data.trim();

  if (trimmed.startsWith('heritage:location:')) {
    return trimmed.replace('heritage:location:', '');
  }

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/explore\/location\/([^/]+)\/?$/);
    if (match) return match[1];
  } catch {
    // not a URL
  }

  if (siteBaseUrl) {
    const base = siteBaseUrl.endsWith('/') ? siteBaseUrl.slice(0, -1) : siteBaseUrl;
    if (trimmed.startsWith(base)) {
      const path = trimmed.slice(base.length);
      const match = path.match(/^\/?explore\/location\/([^/]+)\/?$/);
      if (match) return match[1];
    }
  }

  return null;
}
