// Refresh 602-release.json dynamically from the latest complete public release in CHOAM-CO/602-releases.
// No version tag is hardcoded: tag_name and asset filenames follow the latest published GitHub release.
import { writeFileSync } from 'node:fs';

const REPO = 'CHOAM-CO/602-releases';
const SLOTS = [
  tag => {
    const v = tag.replace(/^v/, '');
    return [`602-Studio-${tag}-macos-arm64.dmg`, `602-Studio-${v}-macos-arm64.dmg`];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [
      `602-Studio-${tag}-windows-x86_64-setup.exe`,
      `602-Studio-${v}-windows-x86_64-setup.exe`,
      `602-Studio-${tag}-windows-x86_64.zip`,
      `602-Studio-${v}-windows-x86_64.zip`,
    ];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [`602-Studio-${tag}-linux-x86_64.zip`, `602-Studio-${v}-linux-x86_64.zip`];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [`story-engine-${tag}-macos-arm64.zip`, `story-engine-${v}-macos-arm64.zip`];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [`story-engine-${tag}-windows-x86_64.zip`, `story-engine-${v}-windows-x86_64.zip`];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [`story-engine-${tag}-linux-x86_64.zip`, `story-engine-${v}-linux-x86_64.zip`];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [`602-story-engine-${tag}-headers.zip`, `602-story-engine-${v}-headers.zip`];
  },
  () => ['story_engine_v2.h'],
  tag => {
    const v = tag.replace(/^v/, '');
    return [`602-${tag}-docs.zip`, `602-${v}-docs.zip`];
  },
  tag => {
    const v = tag.replace(/^v/, '');
    return [`602-${tag}-Documentation.md`, `602-${v}-Documentation.md`];
  },
];

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'choam-site-602-release-json',
};
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;

const requestedTag = (process.env.RELEASE_TAG || '').trim();
const endpoint = requestedTag
  ? `https://api.github.com/repos/${REPO}/releases/tags/${encodeURIComponent(requestedTag)}`
  : `https://api.github.com/repos/${REPO}/releases/latest`;

const res = await fetch(endpoint, { headers });
if (!res.ok) {
  console.error(`GitHub answered ${res.status} for ${REPO}; 602-release.json left unchanged`);
  process.exit(1);
}

const release = await res.json();
const tag = typeof release.tag_name === 'string' ? release.tag_name.trim() : '';
if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+/.test(tag)) {
  console.error(`Invalid or non-production release tag "${tag}"; 602-release.json left unchanged`);
  process.exit(1);
}

const prefix = `https://github.com/${REPO}/releases/download/${tag}/`;
const pool = Array.isArray(release.assets) ? release.assets : [];
const findUploaded = name =>
  pool.find(a => a && a.name === name && a.state === 'uploaded' && a.browser_download_url === prefix + name);

const assets = [];
for (const candidatesOf of SLOTS) {
  const candidates = candidatesOf(tag);
  const primary = candidates.map(findUploaded).find(Boolean);
  if (!primary) {
    console.error(`Missing primary asset (${candidates.join(' or ')}) in ${tag}; 602-release.json left unchanged`);
    process.exit(1);
  }
  const sha = findUploaded(`${primary.name}.sha256`);
  if (!sha) {
    console.error(`Missing checksum ${primary.name}.sha256 in ${tag}; 602-release.json left unchanged`);
    process.exit(1);
  }
  assets.push(
    { name: primary.name, state: primary.state, browser_download_url: primary.browser_download_url },
    { name: sha.name, state: sha.state, browser_download_url: sha.browser_download_url }
  );
}

writeFileSync('602-release.json', `${JSON.stringify({ tag_name: tag, assets }, null, 2)}\n`);
console.log(`${tag}: ${assets.length} assets`);
