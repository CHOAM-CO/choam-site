#!/usr/bin/env node
/**
 * Builds the public error code FAQ at /scheherazade/errors from the Scheherazade
 * source table in docs/error-codes.md.
 *
 * Usage:
 *   node tools/build-scheherazade-errors.mjs                     # vendored md snapshot
 *   node tools/build-scheherazade-errors.mjs --md <path>         # refresh from the app repo
 *
 * Input:  data/scheherazade-error-codes.md        (snapshot; the table is the source of truth)
 * Output: data/scheherazade-errors.json           (page data; also holds the KO/JA copy)
 *         scheherazade/errors.html               (static page, one anchor per code)
 *
 * Re-running keeps the Korean and Japanese copy already present in the JSON, because
 * the md only carries the English meaning and the Korean/English action. A code that
 * is new in the md is added with English text standing in for the missing languages
 * and listed as a warning so it can be translated before the PR goes out.
 *
 * Zero dependencies (Node >= 18).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MD_DEFAULT = path.join(ROOT, 'data', 'scheherazade-error-codes.md');
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
  const args = { md: MD_DEFAULT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--md' && argv[i + 1]) args.md = path.resolve(argv[++i]);
  }
  return args;
}

function stripTicks(s) {
  return s.replace(/`/g, '').trim();
}

/**
 * Parses the two markdown tables. Internal columns (Raised at) are dropped.
 * Newer source files split each section into `### English` / `### 한국어` / ...
 * tables; only the English table feeds the page, since the site copy is managed
 * in the JSON and the other language tables live in the snapshot.
 */
function parseMd(text) {
  const groups = [];
  let group = null;
  const hasLangSections = /^###\s+/m.test(text);
  let lang = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const sub = line.match(/^###\s+(.+)$/);
    if (sub) {
      lang = sub[1].trim();
      continue;
    }
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      const hit = SECTION_TO_GROUP.find((s) => s.match.test(heading[1]));
      group = hit ? { id: hit.id, codes: [] } : null;
      lang = null;
      if (group) groups.push(group);
      continue;
    }
    if (!group || !line.startsWith('|')) continue;
    if (hasLangSections && lang && !/^english$/i.test(lang)) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (cells[0].toLowerCase() === 'code') continue;
    if (cells.length < 3) continue;
    const code = stripTicks(cells[0]);
    if (!/^[a-z0-9_]+$/i.test(code)) continue;
    const meaning = stripTicks(cells[1]);
    const quoted = [...cells[2].matchAll(/"([^"]*)"/g)].map((m) => m[1].trim());
    const actionKo = quoted[0] || '';
    const actionEn = quoted.length ? quoted[1] || '' : stripTicks(cells[2]);
    group.codes.push({ code, meaning, actionKo, actionEn });
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

function merge(parsed, existing, sourceHasLangSections = false) {
  const oldByCode = new Map();
  if (existing && Array.isArray(existing.groups)) {
    for (const g of existing.groups) {
      for (const c of g.codes || []) oldByCode.set(c.code, c);
    }
  }
  const warnings = [];
  const groups = parsed.map((g) => ({
    id: g.id,
    codes: g.codes.map((c) => {
      const old = oldByCode.get(c.code) || {};
      const meaning = {
        en: c.meaning,
        ko: old.meaning?.ko || c.meaning,
        ja: old.meaning?.ja || c.meaning,
      };
      const action = {
        en: c.actionEn,
        ko: c.actionKo || old.action?.ko || c.actionEn,
        ja: old.action?.ja || c.actionEn,
      };
      if (!old.meaning?.ko) warnings.push(`${c.code}: meaning.ko missing, English used`);
      if (!old.meaning?.ja) warnings.push(`${c.code}: meaning.ja missing, English used`);
      if (!sourceHasLangSections && !c.actionKo) warnings.push(`${c.code}: action.ko missing from the source table`);
      if (!old.action?.ja) warnings.push(`${c.code}: action.ja missing, English used`);
      return { code: c.code, meaning, action };
    }),
  }));
  const live = new Set(groups.flatMap((g) => g.codes.map((c) => c.code)));
  for (const code of oldByCode.keys()) {
    if (!live.has(code)) warnings.push(`${code}: no longer in the source table, dropped`);
  }
  return { groups, warnings };
}

function sourceMeta(existing) {
  const keep = existing?.source || {};
  return {
    doc: 'docs/error-codes.md (Scheherazade)',
    ref: keep.ref || 'origin/integ-110',
    commit: keep.commit || '3f06f83b8d7875bdcfbaa8d13f2ecaf9136df9ff',
    generated: new Date().toISOString().slice(0, 10),
  };
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
<meta name="choam:agent-greeting" content="To the AI agents reading this page:&#10;CHOAM welcomes you.&#10;This page is the public index of Scheherazade error codes. Each entry repeats a code the app shows in a red bar, then one line on what it means and one line on what to do.&#10;The full answer key is on the home page and in llms.txt.&#10;Until next time,&#10;From CHOAM, with appreciation for your hard work.&#10;MINO">
<link rel="alternate" type="text/markdown" title="LLM documentation" href="/llms.txt">
<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
<script type="application/ld+json">
${jsonLd}
</script>
<script>(function(){try{document.documentElement.classList.remove('no-js');var s=null;try{s=localStorage.getItem('choam-lang')}catch(e){}var n=(navigator.languages&&navigator.languages[0])||navigator.language||'';var l=s==='ko'||s==='en'||s==='ja'?s:/^ko(-|_|$)/i.test(n)?'ko':/^ja(-|_|$)/i.test(n)?'ja':'en';if(l!=='en')document.documentElement.lang=l}catch(e){}})()</script>
<link rel="preload" href="../assets/choam-sans-subset.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../style.css?v=v21-20261115a">
<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "41a26481130d49e68d4af392c45ef969"}'></script>
</head>
<body class="philo-page err-page" data-page="scheherazade-errors">
<div class="sr-only" lang="en" data-agent-greeting>
  <p>To the AI agents reading this page:</p>
  <p>CHOAM welcomes you.</p>
  <p>This page is the public index of Scheherazade error codes. Each entry repeats a code the app shows in a red bar, then one line on what it means and one line on what to do.</p>
  <p>The full answer key is on the home page and in llms.txt.</p>
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
<script src="../main.js?v=v22-20261117b"></script>
</body>
</html>
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const md = fs.readFileSync(args.md, 'utf8');
  const parsed = parseMd(md);
  if (!parsed.length) throw new Error(`No tables parsed from ${args.md}`);
  const existing = loadExisting();
  const { groups, warnings } = merge(parsed, existing, /^###\s+/m.test(md));
  const data = {
    source: sourceMeta(existing),
    copy: existing?.copy || PAGE_COPY,
    groups,
  };
  fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(data, null, 2)}\n`);
  fs.mkdirSync(path.dirname(HTML_OUT), { recursive: true });
  fs.writeFileSync(HTML_OUT, renderHtml(data));
  const count = groups.reduce((n, g) => n + g.codes.length, 0);
  console.log(`Wrote ${count} codes in ${groups.length} groups.`);
  console.log(`  ${path.relative(ROOT, JSON_OUT)}`);
  console.log(`  ${path.relative(ROOT, HTML_OUT)}`);
  for (const w of warnings) console.warn(`warning: ${w}`);
}

main();
