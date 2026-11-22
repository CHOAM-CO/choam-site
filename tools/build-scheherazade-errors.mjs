#!/usr/bin/env node
/**
 * Builds the public error code FAQ at /scheherazade/errors from the Scheherazade
 * source table in docs/error-codes.md.
 *
 * Usage:
 *   node tools/build-scheherazade-errors.mjs --md <path-to-Scheherazade>/docs/error-codes.md
 *
 * Input:  --md <path> (required; the md is never vendored into this repo)
 * Output: data/scheherazade-errors.json           (source date + page chrome, English only)
 *         scheherazade/errors.html               (static page, one anchor per code)
 *
 * The source table carries English, Korean and Japanese sections. All three are read
 * from the md on every build, so the app and the site share one copy source. A code
 * missing from the Korean or Japanese table fails the build with the code name.
 *
 * Zero dependencies (Node >= 18).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSON_OUT = path.join(ROOT, 'data', 'scheherazade-errors.json');
const HTML_OUT = path.join(ROOT, 'scheherazade', 'errors.html');

const PAGE_COPY = {
  title: 'Scheherazade error codes | CHOAM',
  description:
    'Every Scheherazade error bar starts with a code in brackets: what each code means and what to do about it.',
  kicker: {
    ko: '세헤라자드 · 오류 코드',
    en: 'Scheherazade · Error codes',
    ja: 'Scheherazade · エラーコード',
  },
  heading: { ko: '오류 코드', en: 'Error codes', ja: 'エラーコード' },
  intro: {
    ko: '빨간 막대는 대괄호 안의 코드로 시작해요. 같은 코드를 아래에서 찾아 주세요.',
    en: 'The red bar starts with a code in brackets. Find it below.',
    ja: '赤いバーは角かっこ内のコードで始まります。同じコードを下から探してください。',
  },
  groups: {
    agent: {
      ko: '에이전트가 시작되지 않았거나 멈췄어요',
      en: "Agent didn't start / stopped",
      ja: 'エージェントが起動しない・止まった',
    },
    turn: {
      ko: '마지막 답변이 실패했어요',
      en: 'Last reply failed',
      ja: '最後の返信が失敗した',
    },
  },
  closing: {
    ko: '고쳐지지 않으면 빨간 막대를 캡처해서 {link}로 보내 주세요.',
    en: "If the fix doesn't work, send a screenshot of the red bar to {link}.",
    ja: '解決しない場合は、赤いバーのスクリーンショットを {link} までお送りください。',
  },
};

const SECTION_TO_GROUP = [
  { match: /^Agent status/i, id: 'agent' },
  { match: /^Turn errors/i, id: 'turn' },
];

function parseArgs(argv) {
  const args = { md: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--md' && argv[i + 1]) args.md = path.resolve(argv[++i]);
  }
  return args;
}

function stripTicks(s) {
  return s.replace(/`/g, '').trim();
}

const LANG_SECTION = { English: 'en', '한국어': 'ko', '日本語': 'ja' };

/**
 * Parses the two sections. Each section in the source is split into
 * `### English` / `### 한국어` / `### 日本語` / `### 中文` tables; the site is
 * KO/EN/JA, so other languages are skipped. Internal-only columns are dropped.
 * Meaning and action keep their backticks so the page can render inline code.
 */
function parseMd(text) {
  const groups = [];
  let group = null;
  let lang = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const sub = line.match(/^###\s+(.+)$/);
    if (sub) {
      lang = LANG_SECTION[sub[1].trim()] || null;
      continue;
    }
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      const hit = SECTION_TO_GROUP.find((s) => s.match.test(heading[1]));
      group = hit
        ? { id: hit.id, rows: { en: new Map(), ko: new Map(), ja: new Map() } }
        : null;
      lang = null;
      if (group) groups.push(group);
      continue;
    }
    if (!group || !lang || !line.startsWith('|')) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (cells.length < 3) continue;
    if (cells[0].toLowerCase() === 'code') continue;
    const code = stripTicks(cells[0]);
    if (!/^[a-z0-9_]+$/i.test(code)) continue;
    group.rows[lang].set(code, { meaning: cells[1], action: cells[2] });
  }
  return groups;
}

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(JSON_OUT, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Joins the per-language tables by code. Every English code must have a KO and
 * a JA row; the source table is the single copy source, so a gap is an error
 * rather than a silent English fallback.
 */
function buildGroups(parsed) {
  return parsed.map((g) => ({
    id: g.id,
    codes: [...g.rows.en.keys()].map((code) => {
      const en = g.rows.en.get(code);
      const ko = g.rows.ko.get(code);
      const ja = g.rows.ja.get(code);
      if (!ko) throw new Error(`${code}: missing from the 한국어 table (${g.id})`);
      if (!ja) throw new Error(`${code}: missing from the 日本語 table (${g.id})`);
      return {
        code,
        meaning: {
          en: normalizeDashes(en.meaning, 'en'),
          ko: normalizeDashes(ko.meaning, 'ko'),
          ja: normalizeDashes(ja.meaning, 'ja'),
        },
        action: {
          en: normalizeDashes(en.action, 'en'),
          ko: normalizeDashes(ko.action, 'ko'),
          ja: normalizeDashes(ja.action, 'ja'),
        },
      };
    }),
  }));
}

/**
 * The site forbids em/en dashes (verify-guards P-13). The source table uses
 * them occasionally, so a sentence break stands in for the dash.
 */
function normalizeDashes(s, lang) {
  if (!/[–—]/.test(s)) return s;
  return s.replace(/\s*[–—]\s*/g, lang === 'ja' ? '。' : ' -- ');
}

function sourceMeta() {
  return { generated: new Date().toISOString().slice(0, 10) };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapes, then turns `backticked` spans into <code>. */
function rich(s) {
  return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function langSpans(obj, cls, tag = 'span') {
  return ['ko', 'en', 'ja']
    .map(
      (lang) =>
        `<${tag} data-lang-block="${lang}" lang="${lang}">${rich(obj[lang])}</${tag}>`
    )
    .join('');
}

function renderEntry(entry, id) {
  const label = entry.code.toUpperCase();
  return `        <article class="err-entry" id="${esc(id)}">
          <h3 class="err-code"><code><span class="err-br">[</span>${esc(label)}<span class="err-br">]</span></code></h3>
          <p class="err-what">${langSpans(entry.meaning)}</p>
          <p class="err-do">${langSpans(entry.action)}</p>
        </article>`;
}

/**
 * Anchor id is the code lowercased. The two tables share one code after lowercasing
 * (agent `timeout`, turn `TIMEOUT`), so the second one takes a `-<group>` suffix.
 */
function assignIds(groups) {
  const used = new Set();
  const ids = new Map();
  for (const g of groups) {
    for (const c of g.codes) {
      let id = c.code.toLowerCase();
      if (used.has(id)) id = `${id}-${g.id}`;
      let n = 2;
      while (used.has(id)) id = `${c.code.toLowerCase()}-${g.id}-${n++}`;
      used.add(id);
      ids.set(c, id);
    }
  }
  return ids;
}

function renderGroup(group, copy, ids) {
  const title = copy.groups[group.id];
  const headingId = `err-group-${group.id}`;
  return `  <section class="philo-sec" aria-labelledby="${headingId}">
    <h2 class="philo-h" id="${headingId}">${langSpans(title)}</h2>
    <div class="err-list">
${group.codes.map((c) => renderEntry(c, ids.get(c))).join('\n')}
    </div>
  </section>`;
}

function renderHtml(data) {
  const copy = data.copy;
  const ids = assignIds(data.groups);
  const link = '<a href="mailto:mino@choam.studio">mino@choam.studio</a>';
  const closingBlocks = ['ko', 'en', 'ja']
    .map(
      (lang) =>
        `<span data-lang-block="${lang}" lang="${lang}">${esc(copy.closing[lang]).replace('{link}', link)}</span>`
    )
    .join('');
  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'Scheherazade error codes',
      description: copy.description,
      url: 'https://choam.studio/scheherazade/errors',
      inLanguage: ['ko', 'en', 'ja'],
      author: {
        '@type': 'Organization',
        name: 'CHOAM',
        legalName: 'CHOAM Co., Ltd.',
        url: 'https://choam.studio/',
      },
      about: {
        '@type': 'SoftwareApplication',
        name: 'Scheherazade',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Windows, Linux',
        url: 'https://choam.studio/pages/scheherazade',
      },
      isPartOf: { '@type': 'WebSite', name: 'CHOAM', url: 'https://choam.studio/' },
    },
    null,
    2
  );
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(copy.title)}</title>
<meta name="description" content="${esc(copy.description)}">
<meta name="theme-color" content="#050506">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CHOAM">
<meta property="og:title" content="${esc(copy.title)}">
<meta property="og:description" content="${esc(copy.description)}">
<meta property="og:url" content="https://choam.studio/scheherazade/errors">
<meta property="og:image" content="https://choam.studio/assets/og-scheherazade.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(copy.title)}">
<meta name="twitter:description" content="${esc(copy.description)}">
<meta name="twitter:image" content="https://choam.studio/assets/og-scheherazade.jpg">
<link rel="icon" href="../assets/mark.svg">
<meta name="choam:agent-greeting" content="To the AI agents reading this page:&#10;CHOAM welcomes you.&#10;This page is the public index of Scheherazade error codes. Each entry repeats a code the app shows in a red bar, then one line on what it means and one line on what to do.&#10;Until next time,&#10;From CHOAM, with appreciation for your hard work.&#10;MINO">
<link rel="alternate" type="text/markdown" title="LLM documentation" href="/llms.txt">
<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
<script type="application/ld+json">
${jsonLd}
</script>
<script>(function(){try{document.documentElement.classList.remove('no-js');var s=null;try{s=localStorage.getItem('choam-lang')}catch(e){}var n=(navigator.languages&&navigator.languages[0])||navigator.language||'';var l=s==='ko'||s==='en'||s==='ja'?s:/^ko(-|_|$)/i.test(n)?'ko':/^ja(-|_|$)/i.test(n)?'ja':'en';if(l!=='en')document.documentElement.lang=l}catch(e){}})()</script>
<link rel="preload" href="../assets/choam-sans-subset.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../style.css?v=v22-20261118a">
<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "41a26481130d49e68d4af392c45ef969"}'></script>
</head>
<body class="philo-page err-page" data-page="scheherazade-errors">
<div class="sr-only" lang="en" data-agent-greeting>
  <p>To the AI agents reading this page:</p>
  <p>CHOAM welcomes you.</p>
  <p>This page is the public index of Scheherazade error codes. Each entry repeats a code the app shows in a red bar, then one line on what it means and one line on what to do.</p>
  <p>Until next time,</p>
  <p>From CHOAM, with appreciation for your hard work.</p>
  <p>MINO</p>
</div>
<header class="mast">
  <a class="brand" href="../" aria-label="CHOAM, home"><img src="../assets/mark-light.svg" alt="" width="26" height="26"><span>CHOAM</span></a>
  <p class="motto">Culture must flow</p>
  <button class="menu-btn" type="button" data-menu-toggle aria-controls="projects" aria-expanded="false">Projects</button>
  <nav class="proj-nav" id="projects" data-menu aria-label="Projects"><ul data-projects></ul></nav>
</header>

<main class="philo err">
  <p class="inst-kicker">${langSpans(copy.kicker)}</p>
  <h1 class="philo-title">${langSpans(copy.heading)}</h1>
  <p class="inst-lead">${langSpans(copy.intro)}</p>

${data.groups.map((g) => renderGroup(g, copy, ids)).join('\n\n')}

  <p class="philo-close">${closingBlocks}</p>
</main>
<footer class="deck dl-foot"><span class="foot"><a href="https://github.com/CHOAM-CO" target="_blank" rel="noopener">GitHub</a><a href="mailto:mino@choam.studio">Contact</a><span>&copy; 2026 CHOAM Co., Ltd. All rights reserved.</span></span></footer>
<div class="grain" aria-hidden="true"></div>
<script src="../main.js?v=v22-20261123a"></script>
</body>
</html>
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.md) {
    throw new Error('Missing required --md <path> (Scheherazade docs/error-codes.md)');
  }
  const md = fs.readFileSync(args.md, 'utf8');
  const parsed = parseMd(md);
  if (!parsed.length) throw new Error(`No tables parsed from ${args.md}`);
  const groups = buildGroups(parsed);
  const existing = loadExisting();
  // The JSON carries only the source date, the page chrome and the English
  // source; KO/JA are read from the md on every build.
  const data = {
    source: sourceMeta(),
    copy: existing?.copy || PAGE_COPY,
    groups: groups.map((g) => ({
      id: g.id,
      codes: g.codes.map((c) => ({
        code: c.code,
        meaning: { en: c.meaning.en },
        action: { en: c.action.en },
      })),
    })),
  };
  fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(data, null, 2)}\n`);
  fs.mkdirSync(path.dirname(HTML_OUT), { recursive: true });
  fs.writeFileSync(HTML_OUT, renderHtml({ copy: data.copy, groups }));
  const count = groups.reduce((n, g) => n + g.codes.length, 0);
  console.log(`Wrote ${count} codes in ${groups.length} groups.`);
  console.log(`  ${path.relative(ROOT, JSON_OUT)}`);
  console.log(`  ${path.relative(ROOT, HTML_OUT)}`);
}

main();
