import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../apps/web-dashboard/public/games/chinatown');

const ASSETS = [
  {
    dir: 'tcm',
    file: 'chrysanthemum.jpg',
    pageUrl: 'https://the-qi.com/blogs/journal/the-history-and-healing-power-of-chrysanthemum',
  },
  {
    dir: 'tcm',
    file: 'goji-berries.jpg',
    pageUrl: 'https://www.scmp.com/lifestyle/health-wellness/article/3298004/goji-berries-are-superfood-heres-why-you-should-eat-them-moderation',
  },
  {
    dir: 'tcm',
    file: 'ginseng.jpg',
    pageUrl: 'https://www.thomsonmedical.com/blog/10-restorative-herbs-recommended-by-our-tcm-physicians',
  },
  {
    dir: 'tcm',
    file: 'hawthorn.jpg',
    pageUrl: 'https://www.berryltd.co.uk/products/hawthorn-a-prized-little-fruit-high-in-vitamin-c/',
  },
  {
    dir: 'tcm',
    file: 'mint.jpg',
    pageUrl: 'https://ljh.com.sg/products/mint-local-leaf-300g-%E6%9C%AC%E5%9C%B0%E8%96%84%E8%8D%B7%E5%8F%B6',
  },
  {
    dir: 'tcm',
    file: 'dried-tangerine-peel.jpg',
    pageUrl: 'https://guide.michelin.com/sg/en/article/dining-in/ingredient-tangerine-peel',
  },
];

function extractImage(html, pageUrl) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].replace(/&amp;/g, '&');
  }
  return null;
}

async function resolveImageUrl(asset) {
  if (asset.imageUrl) return asset.imageUrl;
  const res = await fetch(asset.pageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HeritageQuest/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Failed to fetch ${asset.pageUrl}: ${res.status}`);
  const html = await res.text();
  const imageUrl = extractImage(html, asset.pageUrl);
  if (!imageUrl) throw new Error(`No og:image on ${asset.pageUrl}`);
  return imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, asset.pageUrl).href;
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HeritageQuest/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log('Saved', dest, `(${buf.length} bytes)`);
}

for (const asset of ASSETS) {
  const dir = path.join(outDir, asset.dir);
  fs.mkdirSync(dir, { recursive: true });
}

for (const asset of ASSETS) {
  const dest = path.join(outDir, asset.dir, asset.file);
  try {
    const imageUrl = await resolveImageUrl(asset);
    console.log(`${asset.file} <- ${imageUrl}`);
    await download(imageUrl, dest);
  } catch (err) {
    console.error(`FAILED ${asset.file}:`, err.message);
  }
}
