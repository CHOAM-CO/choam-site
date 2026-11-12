// Refresh the bundled manifest only from the complete v2.0.0 release.
import { writeFileSync } from 'node:fs';

const tag = 'v2.0.0';
const repo = 'CHOAM-CO/602-releases';
const names = [
  '602-Studio-v2.0.0-macos-arm64.dmg', '602-Studio-v2.0.0-windows-x86_64.zip', '602-Studio-v2.0.0-linux-x86_64.zip',
  'story-engine-v2.0.0-macos-arm64.zip', 'story-engine-v2.0.0-windows-x86_64.zip', 'story-engine-v2.0.0-linux-x86_64.zip',
  '602-story-engine-v2.0.0-headers.zip', 'story_engine_v2.h',
  '602-v2.0.0-docs.zip', '602-v2.0.0-Documentation.md',
].flatMap(name => [name, `${name}.sha256`]);
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'choam-site-release-json' };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
const res = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${tag}`, { headers });
if (!res.ok) throw new Error(`GitHub answered ${res.status}; manifest unchanged`);
const release = await res.json();
if (release.draft || release.tag_name !== tag) throw new Error('Invalid release; manifest unchanged');
const prefix = `https://github.com/${repo}/releases/download/${tag}/`;
const assets = names.map(name => {
  const asset = release.assets?.find(a => a.name === name && a.state === 'uploaded' && a.browser_download_url === prefix + name);
  if (!asset) throw new Error(`Missing ${name}; manifest unchanged`);
  return { name, state: asset.state, browser_download_url: asset.browser_download_url };
});
writeFileSync('602-release.json', `${JSON.stringify({ tag_name: tag, assets }, null, 2)}\n`);
console.log(`${tag}: ${assets.length} assets`);
