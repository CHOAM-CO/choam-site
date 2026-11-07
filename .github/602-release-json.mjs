// Writes the latest public 602 archives and their checksums for the same-origin download portal.
import { writeFileSync } from 'node:fs';

const REPO = 'CHOAM-CO/602-releases';
const PACKAGES = [
  /^story-engine-v[0-9][0-9A-Za-z.+-]*-(macos-arm64|macos-x64|windows-x64|linux-x64)\.zip$/,
  /^story-editor-v[0-9][0-9A-Za-z.+-]*-(macos-arm64|windows-x64|linux-x64)\.zip$/,
];
const downloadPrefix = `https://github.com/${REPO}/releases/download/`;
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'choam-site-release-json' };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, { headers });
if (res.status === 404) {
  console.log('602 releases not found; 602-release.json left as it was');
  process.exit(0);
}
if (!res.ok) {
  console.error(`GitHub answered ${res.status}; 602-release.json left as it was`);
  process.exit(1);
}
const releases = await res.json();
const assets = [];
const seen = new Set();
const fields = ({ name, state, browser_download_url }) => ({ name, state, browser_download_url });
let tag_name = '';
for (const release of releases) {
  if (release.draft) continue;
  const uploaded = (release.assets || []).filter(a =>
    a && a.state === 'uploaded' && typeof a.name === 'string' &&
    typeof a.browser_download_url === 'string' && a.browser_download_url.startsWith(downloadPrefix) &&
    a.browser_download_url.endsWith('/' + a.name)
  );
  for (const asset of uploaded) {
    const index = PACKAGES.findIndex(pattern => pattern.test(asset.name));
    if (index < 0) continue;
    const platform = asset.name.match(PACKAGES[index])[1];
    const key = `${index}:${platform}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tag_name ||= release.tag_name;
    assets.push(fields(asset));
    const sha = uploaded.find(a => a.name === asset.name + '.sha256');
    if (sha) assets.push(fields(sha));
  }
}
if (!tag_name || !assets.length) {
  console.error('no 602 release archives found; 602-release.json left as it was');
  process.exit(1);
}
writeFileSync('602-release.json', `${JSON.stringify({ tag_name, assets }, null, 2)}\n`);
console.log(`${tag_name}: ${assets.map(a => a.name).join(', ')}`);
