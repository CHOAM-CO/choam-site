// Writes release.json at the site root: the latest public Scheherazade release, cut down to the installer
// files main.js links to. The site reads this same-origin file first, so a visitor's download button no longer
// depends on GitHub's unauthenticated API (60 calls per hour per IP, shared by everyone on an office network).
// No timestamp is written, so the file only changes when the release does.
import { writeFileSync } from 'node:fs';

const REPO = 'CHOAM-CO/scheherazade-releases';
const INSTALLERS = [
  /^Scheherazade-[^/]+-arm64\.dmg$/,
  /^Scheherazade-Setup-[^/]+\.exe$/,
  /^Scheherazade-[^/]+-x86_64\.AppImage$/,
  /^Scheherazade-Portable-[^/]+-win-x64\.zip$/,
];

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'choam-site-release-json' };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers });
if (!res.ok) {
  console.error(`GitHub answered ${res.status}; release.json left as it was`);
  process.exit(1);
}
const data = await res.json();
const assets = (data.assets || [])
  .filter(a => a && a.state === 'uploaded' && INSTALLERS.some(p => p.test(a.name)))
  .map(a => ({ name: a.name, state: a.state, browser_download_url: a.browser_download_url }));
if (!data.tag_name || !assets.length) {
  console.error('latest release has no installer files; release.json left as it was');
  process.exit(1);
}
writeFileSync('release.json', `${JSON.stringify({ tag_name: data.tag_name, assets }, null, 2)}\n`);
console.log(`${data.tag_name}: ${assets.map(a => a.name).join(', ')}`);
