# Heritage Locations Config Guide

Edit **[packages/shared/src/locations.config.ts](packages/shared/src/locations.config.ts)** to update what visitors see when they scan a location QR code.

## What you can customize

| Field | Purpose |
|-------|---------|
| `name`, `district`, `emoji`, `color` | Identity & branding |
| `tagline`, `shortDescription`, `overview` | Text content |
| `heroImage` | Main banner image |
| `gallery` | Extra images |
| `highlights` | Key heritage points (icon + title + description) |
| `funFacts` | Bullet list of interesting facts |
| `visitTips` | Practical tips for visitors |
| `lat`, `lng`, `radiusMeters` | GPS (used by mobile app) |

## Adding images

1. Add image files to **`apps/web-dashboard/public/locations/`**
2. Reference them in config as `"locations/your-file.jpg"`

Or use full URLs: `"https://example.com/photo.jpg"`

## QR codes

Each location automatically gets a QR code on the **Explore** page:

```
https://YOUR_USERNAME.github.io/singapore-heritage-quest/explore/location/chinatown
```

- **Print** QR codes from `/explore` and place them at heritage sites
- **Visitors** tap **Scan Heritage QR Code** on the website, or scan with their phone camera
- They land on the rich location info page

## Adding a new location

1. Add a new entry to `LOCATION_GUIDES` in `locations.config.ts`
2. Add images to `public/locations/`
3. Add a matching character & missions in `seedData.ts` (for the mobile app)
4. Push to GitHub — QR appears automatically on the Explore page

## Public URLs

| Page | URL |
|------|-----|
| Explore (all sites + QR codes) | `/explore` |
| Scan camera | `/explore/scan` |
| Location detail | `/explore/location/chinatown` |

No login required for Explore pages.
