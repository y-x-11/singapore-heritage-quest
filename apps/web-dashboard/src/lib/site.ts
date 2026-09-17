export function getSiteBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${base}`;
  }
  return base;
}

/** Public folder assets (e.g. /public/games/...) — respects Vite base for GitHub Pages */
export function publicAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`;
}
