/** Set EXPO_PUBLIC_DASHBOARD_URL in apps/mobile/.env after deploying to GitHub Pages */
export const DASHBOARD_URL =
  process.env.EXPO_PUBLIC_DASHBOARD_URL ??
  'https://YOUR_GITHUB_USERNAME.github.io/singapore-heritage-quest/';
