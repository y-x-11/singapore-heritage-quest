# Singapore Heritage Quest AR

A gamified mobile app for international school students (ages 13–16) to explore Singapore's cultural heritage through AR characters, GPS discovery, QR card scanning, missions, quizzes, badges, and collectibles.

## Monorepo Structure

```
singapore-heritage-quest/
├── apps/
│   ├── mobile/           # Expo app — students & teachers (Expo Go on phone)
│   └── web-dashboard/    # Teacher dashboard — deployed via GitHub Pages
├── packages/shared/      # Types, constants, seed data
├── firebase/             # Firestore & Storage security rules
└── .github/workflows/    # GitHub Pages deploy
```

## Deploy Teacher Dashboard (GitHub Pages)

The teacher website is hosted on **GitHub Pages**, not on your PC.

### One-time setup

1. Push this repo to GitHub (e.g. `github.com/YOUR_USERNAME/singapore-heritage-quest`).
2. In the repo on GitHub: **Settings → Pages → Build and deployment**
   - **Source:** GitHub Actions
3. Push to `main` (or `master`). The workflow [`.github/workflows/deploy-dashboard.yml`](.github/workflows/deploy-dashboard.yml) builds and deploys automatically.
4. Your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/singapore-heritage-quest/
   ```
5. Copy [`apps/mobile/.env.example`](apps/mobile/.env.example) to `apps/mobile/.env` and set:
   ```
   EXPO_PUBLIC_DASHBOARD_URL=https://YOUR_USERNAME.github.io/singapore-heritage-quest/
   ```
   so the mobile app’s “Open Full Web Dashboard” button points to the live site.

### Manual deploy test (optional)

```bash
npm install
npm run build:web
# Preview: npx serve apps/web-dashboard/dist
```

### Local dashboard dev (optional)

```bash
npm run web
# http://localhost:5173
```

Log in with any email/password (demo teacher auth).

### Public Heritage Explore (QR codes)

No login required. Visitors can browse sites, scan QR codes, and read location info:

```
https://YOUR_USERNAME.github.io/singapore-heritage-quest/explore
```

- **Edit content:** [packages/shared/src/locations.config.ts](packages/shared/src/locations.config.ts)
- **Edit images:** add files to `apps/web-dashboard/public/locations/`
- **Full guide:** [LOCATIONS_CONFIG.md](LOCATIONS_CONFIG.md)

---

## Mobile App (Expo Go)

The student/teacher **mobile app** runs on your phone via **Expo Go**, not in the browser.

### Install & run

```bash
npm install
npm run mobile
# or: npm run mobile:clear
```

**Always use `npm run mobile` from the repo root** — do not run `npx expo start` from the root folder.

Scan the QR code with **Expo Go** (same Wi‑Fi as your PC). Do not press `a` unless Android Studio is installed.

### Demo flow

1. Onboarding → Sign up as student (class code e.g. `HERIT1`) or teacher
2. **Map** → tap a heritage zone → **Simulate Scan** → complete mission & quiz
3. Teachers: open **Full Web Dashboard** (links to GitHub Pages)

---

## Heritage card QR codes

```bash
npm run seed
```

See [HERITAGE_CARDS.md](HERITAGE_CARDS.md) for printable QR payloads.

---

## Firebase (optional)

Demo mode uses local storage — no Firebase required for testing. For production, see `.env.example` files and deploy rules from `firebase/`.

---

## Tech stack

| Part | Technology |
|---|---|
| Mobile | Expo SDK 52, expo-router, GPS, camera, maps |
| Teacher web | Vite, React, Tailwind, GitHub Pages |
| Backend | Firebase (optional) |

## License

MIT — Built for educational heritage exploration.
