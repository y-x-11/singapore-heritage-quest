export function getSiteBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${base}`;
  }
  return base;
}
