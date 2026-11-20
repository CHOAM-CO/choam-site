// Refresh 602-release.json dynamically from the latest complete public release in CHOAM-CO/602-releases.
// No version tag is hardcoded: tag_name and asset filenames follow the latest published GitHub release.
import { readFileSync, writeFileSync } from 'node:fs';

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
  const shaHex = typeof primary.digest === 'string' && /^sha256:[0-9a-f]{64}$/i.test(primary.digest)
    ? primary.digest.slice(7).toLowerCase()
    : '';
  const primaryEntry = {
    name: primary.name,
    state: primary.state,
    size: primary.size,
    browser_download_url: primary.browser_download_url,
  };
  if (primary.digest) primaryEntry.digest = primary.digest;
  if (shaHex) primaryEntry.sha256 = shaHex;
  const shaEntry = {
    name: sha.name,
    state: sha.state,
    size: sha.size,
    browser_download_url: sha.browser_download_url,
  };
  if (sha.digest) shaEntry.digest = sha.digest;
  assets.push(primaryEntry, shaEntry);
}

writeFileSync('602-release.json', `${JSON.stringify({ tag_name: tag, assets }, null, 2)}\n`);

/* Sync static fallback version strings and SHA-256 digests in 602 HTML/JS/llms files */
const bare = tag.replace(/^v/, '');
const ASSET_SUFFIX_STOP = '(?:macos|mac|osx|windows|win|linux|headers|docs|Documentation|arm64|x86_64|x64|portable)';
const VER_2_RE = new RegExp(`\\bv2\\.\\d+\\.\\d+(?:-(?!${ASSET_SUFFIX_STOP}\\b)[0-9A-Za-z.]+)*\\b`, 'g');
// Preserve explicitly historical HTML lines and release-note summaries.
const syncVersions = raw => raw.split('\n').map(line =>
  /data-no-ver-sync|^\s*['"]Studio v2\.\d+\.\d+|^\s*- \*\*(?:v2\.\d+\.\d+|Release (?:Notes|History) \()/i.test(line)
    ? line : line.replace(VER_2_RE, tag)
).join('\n');
const slotKeys = ['studio-mac', 'studio-win', 'studio-linux', 'engine-mac', 'engine-win', 'engine-linux', 'headers-zip', 'headers-h', 'docs-zip', 'docs-md'];
let dlHtml = syncVersions(readFileSync('602/download.html', 'utf8'))
  .replace(/"softwareVersion":\s*"2\.\d+\.\d+[^"]*"/g, `"softwareVersion": "${bare}"`);
slotKeys.forEach((key, idx) => {
  const primary = assets[idx * 2];
  if (!primary) return;
  dlHtml = dlHtml.replace(
    new RegExp(`(<code class="p602-dl-file" data-602-filename="${key}">)[^<]+(</code>)`),
    `$1${primary.name}$2`
  );
  if (primary.sha256) {
    dlHtml = dlHtml.replace(
      new RegExp(`(<code class="p602-dl-file" data-sha256-asset="${key}">)[0-9a-f]{64}(</code>)`),
      `$1${primary.sha256}$2`
    );
  }
  dlHtml = dlHtml.replace(
    new RegExp(`(<a [^>]*data-602-sha="${key}"[^>]*aria-label="SHA-256 checksum for )[^"]+(")`),
    `$1${primary.name}$2`
  );
});
writeFileSync('602/download.html', dlHtml);

for (const file of ['index.html', 'pages/602.html', 'main.js', 'llms.txt', 'llms-full.txt']) {
  const raw = readFileSync(file, 'utf8');
  const next = syncVersions(raw)
    .replace(/"softwareVersion":\s*"2\.\d+\.\d+[^"]*"/g, `"softwareVersion": "${bare}"`);
  if (next !== raw) writeFileSync(file, next);
}
console.log(`${tag}: ${assets.length} assets`);
