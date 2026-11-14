#!/usr/bin/env node
/**
 * CHOAM Studio v2.1 Overhaul — 13 Preservation Guardrails & Brand Compliance Verifier
 *
 * Validates P-01 through P-13 from:
 *   /Users/narr/Desktop/MAGI/docs/choam_studio_overhaul_audit_and_brand_prep_20261114.md (§3)
 * plus Mino's 4 confirmed decisions, forbidden strings, local link/OG resolution,
 * and JSON / JSON-LD syntax across the entire static site repository.
 *
 * Zero external npm dependencies (Node >= 18 built-ins only).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));

const OFFICIAL_HTML_16 = [
  'index.html',
  'philosophy.html',
  'us.html',
  'download.html',
  'install.html',
  '602/download.html',
  '602/docs.html',
  'pages/scheherazade.html',
  'pages/602.html',
  'pages/lunasia.html',
  'pages/dat.html',
  'pages/seonjam.html',
  'pages/donguri-ryokan.html',
  'people/mino.html',
  'people/eunho.html',
  'people/magi.html',
];

const REDIRECT_STUBS_12 = [
  '602/index.html',
  'people/index.html',
  'pages/index.html',
  'people/cayde.html',
  'scheherazade.html',
  'lunasia.html',
  'dat.html',
  'seonjam.html',
  'doze.html',
  'pages/doze.html',
  'donguri.html',
  'donguri-ryokan.html',
];

const AGENT_GREETING_PAGES = [
  'index.html',
  'pages/scheherazade.html',
  'pages/602.html',
  'pages/lunasia.html',
  'pages/dat.html',
  '602/docs.html',
  '602/download.html',
  'philosophy.html',
  'us.html',
];

const CF_BEACON_TOKEN = '41a26481130d49e68d4af392c45ef969';

const results = [];
let totalFailures = 0;

function record(id, ok, detail) {
  results.push({ id, ok, detail });
  if (!ok) totalFailures += 1;
}

function rel(absPath) {
  return path.relative(SITE_ROOT, absPath).split(path.sep).join('/');
}

function existsFile(relPath) {
  try {
    return fs.statSync(path.join(SITE_ROOT, relPath)).isFile();
  } catch {
    return false;
  }
}

function readUtf8(relPath) {
  return fs.readFileSync(path.join(SITE_ROOT, relPath), 'utf8');
}

function walkFiles(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'tools') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, predicate, out);
    } else if (entry.isFile() && predicate(full)) {
      out.push(full);
    }
  }
  return out.sort();
}

function readPngDimensions(absPath) {
  const buf = fs.readFileSync(absPath);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 24 || !buf.subarray(0, 8).equals(sig)) {
    return null;
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function readJpegDimensions(absPath) {
  const buf = fs.readFileSync(absPath);
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const segLen = buf.readUInt16BE(offset + 2);
    if (segLen < 2 || offset + 2 + segLen > buf.length) break;
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    offset += 2 + segLen;
  }
  return null;
}

function resolveCleanSitePath(rawTarget, fromHtmlRel) {
  let clean = rawTarget.trim();
  if (!clean) return { skip: true };
  if (
    clean.startsWith('#') ||
    clean.startsWith('mailto:') ||
    clean.startsWith('tel:') ||
    clean.startsWith('data:') ||
    clean.startsWith('javascript:') ||
    clean.startsWith('blob:')
  ) {
    return { skip: true };
  }

  if (/^https?:\/\//i.test(clean)) {
    const u = new URL(clean);
    if (u.hostname !== 'choam.studio') {
      return { skip: true };
    }
    clean = u.pathname || '/';
  } else {
    clean = clean.split('#')[0].split('?')[0];
  }

  if (!clean) return { skip: true };

  let targetAbs;
  if (clean.startsWith('/')) {
    targetAbs = path.join(SITE_ROOT, clean.slice(1));
  } else {
    const baseDir = path.dirname(path.join(SITE_ROOT, fromHtmlRel));
    targetAbs = path.resolve(baseDir, clean);
  }

  // Candidate files under GitHub Pages Clean URL rules:
  const candidates = [];
  if (clean.endsWith('/')) {
    candidates.push(path.join(targetAbs, 'index.html'));
  } else {
    candidates.push(targetAbs);
    candidates.push(`${targetAbs}.html`);
    candidates.push(path.join(targetAbs, 'index.html'));
  }

  for (const c of candidates) {
    try {
      if (fs.statSync(c).isFile()) {
        return { ok: true, resolved: rel(c) };
      }
    } catch {
      // try next
    }
  }
  return { ok: false, tried: candidates.map(rel) };
}

// ============================================================================
// P-01: assets/mail/choam-mark-112.png exists & 112x112 PNG
// ============================================================================
{
  const p = 'assets/mail/choam-mark-112.png';
  if (!existsFile(p)) {
    record('P-01', false, `Missing required email signature mark: ${p}`);
  } else {
    const dims = readPngDimensions(path.join(SITE_ROOT, p));
    const ok = Boolean(dims && dims.width === 112 && dims.height === 112);
    record(
      'P-01',
      ok,
      ok
        ? `${p} present and verified ${dims.width}x${dims.height} PNG`
        : `${p} invalid PNG dimensions: ${JSON.stringify(dims)}`
    );
  }
}

// ============================================================================
// P-02: CNAME === choam.studio
// ============================================================================
{
  if (!existsFile('CNAME')) {
    record('P-02', false, 'Missing root CNAME file');
  } else {
    const raw = readUtf8('CNAME');
    const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
    const ok = lines.length === 1 && lines[0] === 'choam.studio';
    record('P-02', ok, ok ? 'CNAME === "choam.studio"' : `Unexpected CNAME content: ${JSON.stringify(raw)}`);
  }
}

// ============================================================================
// P-03: google9d9d407aabe22214.html intact
// ============================================================================
{
  const f = 'google9d9d407aabe22214.html';
  const expected = 'google-site-verification: google9d9d407aabe22214.html';
  if (!existsFile(f)) {
    record('P-03', false, `Missing ${f}`);
  } else {
    const actual = readUtf8(f).trim();
    const ok = actual === expected;
    record('P-03', ok, ok ? `${f} exact match` : `Mismatch in ${f}: ${JSON.stringify(actual)}`);
  }
}

// ============================================================================
// P-04: 3e9dfdadbcc59709955aa52718bea905.txt intact
// ============================================================================
{
  const f = '3e9dfdadbcc59709955aa52718bea905.txt';
  const expected = '3e9dfdadbcc59709955aa52718bea905';
  if (!existsFile(f)) {
    record('P-04', false, `Missing ${f}`);
  } else {
    const actual = readUtf8(f).trim();
    const ok = actual === expected;
    record('P-04', ok, ok ? `${f} exact match` : `Mismatch in ${f}: ${JSON.stringify(actual)}`);
  }
}

// ============================================================================
// P-05: Cloudflare Web Analytics beacon in all 16 official HTML pages
// ============================================================================
{
  const missing = [];
  for (const h of OFFICIAL_HTML_16) {
    if (!existsFile(h)) {
      missing.push(`${h} (missing file)`);
      continue;
    }
    const txt = readUtf8(h);
    if (!txt.includes('static.cloudflareinsights.com/beacon.min.js') || !txt.includes(CF_BEACON_TOKEN)) {
      missing.push(h);
    }
  }
  record(
    'P-05',
    missing.length === 0,
    missing.length === 0
      ? `All ${OFFICIAL_HTML_16.length} official HTML pages include Cloudflare beacon (${CF_BEACON_TOKEN})`
      : `Missing Cloudflare beacon in: ${missing.join(', ')}`
  );
}

// ============================================================================
// P-06: release.json schema compatibility
// ============================================================================
{
  if (!existsFile('release.json')) {
    record('P-06', false, 'Missing release.json');
  } else {
    try {
      const data = JSON.parse(readUtf8('release.json'));
      const ver = data.tag_name || data.tag || data.version;
      let hasMac = false;
      let hasWin = false;
      let hasWinPortable = false;
      let hasLinux = false;

      if (Array.isArray(data.assets)) {
        for (const a of data.assets) {
          if (!a || typeof a.name !== 'string' || typeof a.browser_download_url !== 'string') continue;
          if (!a.browser_download_url.startsWith('https://')) continue;
          if (/^Scheherazade-[^/]+-arm64\.dmg$/.test(a.name)) hasMac = true;
          if (/^Scheherazade-Setup-[^/]+\.exe$/.test(a.name)) hasWin = true;
          if (/^Scheherazade-Portable-[^/]+-win-x64\.zip$/.test(a.name)) hasWinPortable = true;
          if (/^Scheherazade-[^/]+-x86_64\.AppImage$/.test(a.name)) hasLinux = true;
        }
      } else if (data.assets && typeof data.assets === 'object') {
        hasMac = Boolean(data.assets.mac);
        hasWin = Boolean(data.assets.win);
        hasWinPortable = Boolean(data.assets.winPortable);
        hasLinux = Boolean(data.assets.linux);
      }

      const ok = Boolean(ver && hasMac && hasWin && hasWinPortable && hasLinux);
      record(
        'P-06',
        ok,
        ok
          ? `release.json valid (${ver}: mac, win, winPortable, linux all present)`
          : `release.json incomplete: ver=${ver}, mac=${hasMac}, win=${hasWin}, winPortable=${hasWinPortable}, linux=${hasLinux}`
      );
    } catch (err) {
      record('P-06', false, `release.json JSON parse error: ${err.message}`);
    }
  }
}

// ============================================================================
// P-07: 602-release.json + 602/download.html license gate & dual contact
// ============================================================================
{
  const issues = [];
  if (!existsFile('602-release.json')) {
    issues.push('Missing 602-release.json');
  } else {
    try {
      const d = JSON.parse(readUtf8('602-release.json'));
      const tag = d.tag_name || d.tag || d.version;
      if (!tag || !/^v?\d+\.\d+\.\d+/.test(tag)) {
        issues.push(`Invalid 602-release.json tag: ${tag}`);
      }
      if (!Array.isArray(d.assets) || d.assets.length < 20) {
        issues.push(`602-release.json expected >=20 assets, found ${Array.isArray(d.assets) ? d.assets.length : 'non-array'}`);
      } else {
        const names = d.assets.map((a) => a && a.name);
        const reqPatterns = [
          /602-Studio-.*-macos-arm64\.dmg$/,
          /602-Studio-.*-windows-x86_64-setup\.exe$/,
          /602-Studio-.*-linux-x86_64\.zip$/,
          /story-engine-.*-macos-arm64\.zip$/,
          /story-engine-.*-windows-x86_64\.zip$/,
          /story-engine-.*-linux-x86_64\.zip$/,
          /^story_engine_v2\.h$/,
        ];
        for (const pat of reqPatterns) {
          if (!names.some((n) => typeof n === 'string' && pat.test(n))) {
            issues.push(`602-release.json missing asset matching ${pat}`);
          }
        }
      }
    } catch (err) {
      issues.push(`602-release.json parse error: ${err.message}`);
    }
  }

  if (!existsFile('602/download.html')) {
    issues.push('Missing 602/download.html');
  } else {
    const dlHtml = readUtf8('602/download.html');
    if (!dlHtml.includes('CHOAM Community License')) {
      issues.push('602/download.html missing CHOAM Community License');
    }
    if (!/type=["']checkbox["'][^>]*data-602-agree|data-602-agree[^>]*type=["']checkbox["']/.test(dlHtml)) {
      issues.push('602/download.html missing consent checkbox [data-602-agree]');
    }
    if (!dlHtml.includes('mino@choam.studio') || !dlHtml.includes('cayde@choam.studio')) {
      issues.push('602/download.html missing dual contacts (mino@choam.studio & cayde@choam.studio)');
    }
  }

  if (existsFile('602-portal.js')) {
    const portalJs = readUtf8('602-portal.js');
    if (!portalJs.includes('data-602-agree')) {
      issues.push('602-portal.js missing [data-602-agree] license consent gate');
    }
  } else {
    issues.push('Missing 602-portal.js');
  }

  record(
    'P-07',
    issues.length === 0,
    issues.length === 0
      ? '602-release.json valid + CHOAM Community License 1.0 gate & dual contacts intact'
      : issues.join('; ')
  );
}

// ============================================================================
// P-08: 16 Official Routes + 404.html + 12 Redirect Stubs + Local/OG Asset Resolution
// ============================================================================
{
  const issues = [];
  for (const h of OFFICIAL_HTML_16) {
    if (!existsFile(h)) issues.push(`Missing official HTML: ${h}`);
  }
  if (!existsFile('404.html')) {
    issues.push('Missing root 404.html');
  }
  for (const stub of REDIRECT_STUBS_12) {
    if (!existsFile(stub)) issues.push(`Missing redirect stub: ${stub}`);
  }

  // Verify new OG card dimensions
  for (const ogRel of ['assets/og-lunasia.jpg', 'assets/og-602.jpg']) {
    if (!existsFile(ogRel)) {
      issues.push(`Missing required OG card: ${ogRel}`);
    } else {
      const dims = readJpegDimensions(path.join(SITE_ROOT, ogRel));
      if (!dims || dims.width !== 1200 || dims.height !== 630) {
        issues.push(`${ogRel} expected 1200x630 JPEG, got ${JSON.stringify(dims)}`);
      }
    }
  }

  // Scan all HTML files for local href/src and https://choam.studio/... meta/OG references
  const allHtml = walkFiles(SITE_ROOT, (f) => f.endsWith('.html'));
  const attrRe = /\b(?:href|src|content)=["']([^"']+)["']/gi;

  for (const htmlAbs of allHtml) {
    const htmlRel = rel(htmlAbs);
    if (htmlRel === 'google9d9d407aabe22214.html') continue;
    const content = fs.readFileSync(htmlAbs, 'utf8');

    // Strip <script>...</script> before scanning HTML attributes so JS template fragments don't false-trigger
    const htmlNoScripts = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    let m;
    while ((m = attrRe.exec(htmlNoScripts)) !== null) {
      const rawVal = m[1].trim();
      // For content="...", only check if it is a URL starting with https://choam.studio/ or "0; url=..."
      const fullMatch = m[0];
      if (/^content=/i.test(fullMatch)) {
        const refreshMatch = rawVal.match(/^\d+\s*;\s*url=(.+)$/i);
        if (refreshMatch) {
          const r = resolveCleanSitePath(refreshMatch[1], htmlRel);
          if (!r.skip && !r.ok) {
            issues.push(`${htmlRel}: broken meta-refresh "${refreshMatch[1]}"`);
          }
        } else if (/^https?:\/\/choam\.studio(\/|$)/i.test(rawVal)) {
          const r = resolveCleanSitePath(rawVal, htmlRel);
          if (!r.skip && !r.ok) {
            issues.push(`${htmlRel}: broken choam.studio meta URL "${rawVal}"`);
          }
        }
        continue;
      }

      const r = resolveCleanSitePath(rawVal, htmlRel);
      if (!r.skip && !r.ok) {
        issues.push(`${htmlRel}: broken local link/asset "${rawVal}"`);
      }
    }
  }

  record(
    'P-08',
    issues.length === 0,
    issues.length === 0
      ? `All 16 routes + 404.html + 12 stubs + OG/local links verified across ${allHtml.length} HTML files`
      : `${issues.length} issue(s): ${issues.slice(0, 12).join(' | ')}${issues.length > 12 ? ' ...' : ''}`
  );
}

// ============================================================================
// P-09: AI Agent Answer Key, llms.txt, llms-full.txt, robots.txt AI Allow: /
// ============================================================================
{
  const issues = [];
  for (const f of ['llms.txt', 'llms-full.txt', 'robots.txt']) {
    if (!existsFile(f)) {
      issues.push(`Missing ${f}`);
    } else if (readUtf8(f).trim().length < 50) {
      issues.push(`${f} unexpectedly empty/short`);
    }
  }
  if (existsFile('robots.txt')) {
    const robots = readUtf8('robots.txt');
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
      if (!robots.includes(bot)) issues.push(`robots.txt missing ${bot}`);
    }
    if (/^Disallow:\s*\/\s*$/m.test(robots)) {
      issues.push('robots.txt contains Disallow: /');
    }
    if (!/^Allow:\s*\/\s*$/m.test(robots)) {
      issues.push('robots.txt missing Allow: /');
    }
  }
  for (const p of AGENT_GREETING_PAGES) {
    if (!existsFile(p)) {
      issues.push(`Missing ${p}`);
      continue;
    }
    const txt = readUtf8(p);
    if (!txt.includes('choam:agent-greeting') && !txt.includes('data-agent-greeting')) {
      issues.push(`${p} missing agent greeting (choam:agent-greeting / data-agent-greeting)`);
    }
  }
  record(
    'P-09',
    issues.length === 0,
    issues.length === 0
      ? 'llms.txt, llms-full.txt, robots.txt AI Allow:/, and agent greetings verified'
      : issues.join('; ')
  );
}

// ============================================================================
// P-10: Astra match-flame opening sequence intact
// ============================================================================
{
  const issues = [];
  for (const f of ['astra-hero.js', 'text-reveal.js', 'assets/astra-hero.webp']) {
    if (!existsFile(f)) issues.push(`Missing ${f}`);
  }
  if (existsFile('index.html')) {
    const idx = readUtf8('index.html');
    if (!idx.includes('astra-hero.js') || !idx.includes('text-reveal.js')) {
      issues.push('index.html does not reference astra-hero.js and text-reveal.js');
    }
  }
  record(
    'P-10',
    issues.length === 0,
    issues.length === 0
      ? 'astra-hero.js, text-reveal.js, and assets/astra-hero.webp present and wired in index.html'
      : issues.join('; ')
  );
}

// ============================================================================
// P-11: Mino's 4-part Philosophy & Approved People Copy Preservation
// ============================================================================
{
  const issues = [];
  if (!existsFile('philosophy.html')) {
    issues.push('Missing philosophy.html');
  } else {
    const philo = readUtf8('philosophy.html');
    for (const pillar of [
      'Culture Must Flow',
      'Tech Otakus Save The World',
      'Cutting Edge of the Brave New World',
      'Go with the Bravery',
    ]) {
      const count = philo.split(pillar).length - 1;
      if (count < 3) {
        issues.push(`philosophy.html pillar "${pillar}" expected >=3 (KO/EN/JA), found ${count}`);
      }
    }
  }
  for (const pf of ['people/mino.html', 'people/eunho.html', 'people/magi.html']) {
    if (!existsFile(pf)) {
      issues.push(`Missing ${pf}`);
    } else if (readUtf8(pf).length < 1500) {
      issues.push(`${pf} unexpectedly truncated`);
    }
  }
  record(
    'P-11',
    issues.length === 0,
    issues.length === 0
      ? 'Philosophy 4 pillars (KO/EN/JA) and people/{mino,eunho,magi}.html copy preserved'
      : issues.join('; ')
  );
}

// ============================================================================
// P-12: Pretendard License & Subset WOFF2
// ============================================================================
{
  const issues = [];
  if (!existsFile('assets/LICENSE-Pretendard.txt')) {
    issues.push('Missing assets/LICENSE-Pretendard.txt');
  } else if (!readUtf8('assets/LICENSE-Pretendard.txt').includes('OPEN FONT LICENSE')) {
    issues.push('assets/LICENSE-Pretendard.txt missing OFL text');
  }
  for (const wf of ['assets/choam-sans-subset.woff2', 'assets/PretendardVariable.woff2']) {
    if (!existsFile(wf)) {
      issues.push(`Missing ${wf}`);
    } else {
      const hdr = fs.readFileSync(path.join(SITE_ROOT, wf)).subarray(0, 4).toString('ascii');
      if (hdr !== 'wOF2') issues.push(`${wf} invalid WOFF2 header (${hdr})`);
    }
  }
  record(
    'P-12',
    issues.length === 0,
    issues.length === 0
      ? 'LICENSE-Pretendard.txt, choam-sans-subset.woff2, and PretendardVariable.woff2 verified'
      : issues.join('; ')
  );
}

// ============================================================================
// P-13, Forbidden Strings, Mino Decisions & JSON-LD Validation
// ============================================================================
{
  const issues = [];

  // D-03 / P-13: forbidden 5-student classroom orphan file must not exist
  if (existsFile('assets/dat-g-classroom.webp')) {
    issues.push('Forbidden asset assets/dat-g-classroom.webp still exists');
  }

  const textFiles = walkFiles(SITE_ROOT, (f) => {
    const r = rel(f);
    if (r === 'assets/LICENSE-Pretendard.txt') return false;
    return /\.(html|js|mjs|css|svg|txt|xml)$/i.test(f);
  });

  const forbiddenPatterns = [
    { label: 'Diffusion Architecture Transformer', re: /Diffusion Architecture Transformer/i },
    { label: 'xattr', re: /\bxattr\b/i },
    { label: '2027 Q1', re: /2027\s*Q1/i },
    { label: '2027.02', re: /2027\.02/ },
    { label: 'Donguri Restaurant', re: /Donguri Restaurant/i },
    { label: '동구리 식당', re: /동구리\s*식당/ },
    { label: '셰헤라자드 (typo)', re: /셰헤라자드/ },
    { label: '1저자', re: /1저자/ },
    { label: '복수 주어 스텔라 블레이드', re: /(저희가|우리가)\s*스텔라\s*블레이드/ },
    { label: 'dat-g-classroom.webp reference', re: /dat-g-classroom\.webp/i },
    { label: 'em-dash (U+2014 / &mdash;)', re: /\u2014|&mdash;|&#8212;|&#x2014;/i },
    { label: 'en-dash (U+2013 / &ndash;)', re: /\u2013|&ndash;|&#8211;|&#x2013;/i },
  ];

  for (const abs of textFiles) {
    const r = rel(abs);
    const content = fs.readFileSync(abs, 'utf8');
    const isContentTarget = /\.(html|js|css)$/i.test(r) || /^llms.*\.txt$/i.test(r);

    if (isContentTarget) {
      for (const pat of forbiddenPatterns) {
        const idx = content.search(pat.re);
        if (idx !== -1) {
          const lineNo = content.slice(0, idx).split('\n').length;
          issues.push(`${r}:${lineNo}: forbidden "${pat.label}" found`);
        }
      }
    }

    // Mino Decision #1: #FE0000 must be gone from CSS and about/*.svg
    if (r.endsWith('.css') || r.startsWith('assets/about/')) {
      if (/#fe0000\b/i.test(content)) {
        issues.push(`${r}: legacy SEELE neon red #FE0000 found (must be #D9A362)`);
      }
    }

    // Validate all JSON-LD blocks inside HTML files + check choam.studio URLs in JSON-LD
    if (r.endsWith('.html')) {
      const ldRe = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let lm;
      let idx = 0;
      while ((lm = ldRe.exec(content)) !== null) {
        idx += 1;
        try {
          const parsed = JSON.parse(lm[1]);
          const jsonStr = JSON.stringify(parsed);
          const urlMatches = jsonStr.match(/https:\/\/choam\.studio\/[^"\\\s]*/g) || [];
          for (const u of urlMatches) {
            const check = resolveCleanSitePath(u, r);
            if (!check.skip && !check.ok) {
              issues.push(`${r} JSON-LD #${idx}: broken choam.studio URL "${u}"`);
            }
          }
        } catch (err) {
          issues.push(`${r} JSON-LD #${idx} parse error: ${err.message}`);
        }
      }
    }
  }

  record(
    'P-13',
    issues.length === 0,
    issues.length === 0
      ? `0 forbidden strings/dashes/#FE0000, dat-g-classroom.webp absent, and all JSON-LD valid across ${textFiles.length} files`
      : `${issues.length} violation(s): ${issues.slice(0, 14).join(' | ')}${issues.length > 14 ? ' ...' : ''}`
  );
}

// ============================================================================
// Report Summary
// ============================================================================
console.log(`\n=== CHOAM v2.1 Guardrail Verification (${SITE_ROOT}) ===`);
for (const r of results) {
  const badge = r.ok ? '[PASS]' : '[FAIL]';
  console.log(`${badge} ${r.id}: ${r.detail}`);
}
console.log('------------------------------------------------------------');
if (totalFailures === 0) {
  console.log(`ALL ${results.length} GUARDRAILS PASSED (0 failures).`);
  process.exit(0);
} else {
  console.error(`${totalFailures} of ${results.length} GUARDRAIL GROUPS FAILED.`);
  process.exit(1);
}
