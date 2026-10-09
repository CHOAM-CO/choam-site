/* CHOAM site gallery. index.html shows every project; pages/<id>.html sets <body data-project="<id>">
   and shows that project only, opening on its details. download.html only uses the menu. */
(() => {
  const ROOT = new URL('.', document.currentScript.src); /* site root, works under / and over file:// */
  const url = path => new URL(path, ROOT).href;

  /* Feature graphics: drawn diagrams of what the copy says, for products without approved imagery.
     They are labelled as graphics and are not app screenshots or model output. */
  const ICON = () => url('assets/scheherazade-256.png'); /* drawn at most ~85px wide; 256px covers 3x screens */
  const card = '<rect class="fc" x=".5" y=".5" width="599" height="459" rx="18"/>';
  const bars = (x, y, ws, step = 16) => ws.map((w, i) => `<rect class="b" x="${x}" y="${y + i * step}" width="${w}" height="8" rx="4"/>`).join('');
  const eye = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="st" d="M-16 0Q0-13 16 0Q0 13-16 0Z"/><circle class="bg" r="4.5"/></g>`;
  const moon = (x, y, s = 1) => `<path class="bg" transform="translate(${x} ${y}) scale(${s})" d="M4-11.3A12 12 0 1 0 4 11.3A13 13 0 0 1 4-11.3Z"/>`;
  const star = (x, y, s = 1) => `<path class="bg" transform="translate(${x} ${y}) scale(${s})" d="M0-16Q2-2 16 0Q2 2 0 16Q-2 2-16 0Q-2-2 0-16Z"/>`;
  const journal = (x, y, rot, hl) => `<g transform="rotate(${rot} ${x + 85} ${y + 60})"><rect class="fj" x="${x}" y="${y}" width="170" height="120" rx="10"/><text class="k dim" x="${x + 18}" y="${y + 28}">JOURNAL</text>${[130, 118, 134, 90].map((w, i) => `<rect class="${i === hl ? 'bg' : 'b'}" x="${x + 18}" y="${y + 44 + i * 16}" width="${w}" height="8" rx="4"/>`).join('')}</g>`;
  const FEAT = {
    'sch-memory': () => `${card}
      <text class="l" x="36" y="54">MEMORY</text><text class="s" x="564" y="54" text-anchor="end">Read it. Tell her to forget.</text>
      <rect class="fr" x="36" y="84" width="528" height="80" rx="12"/><text class="l" x="60" y="114">THE FACTS</text>${bars(60, 128, [300, 210])}${eye(516, 124)}
      <rect class="fr" x="36" y="184" width="528" height="80" rx="12"/><text class="l" x="60" y="214">YOUR CORRECTIONS</text>
      <rect class="b" x="60" y="228" width="180" height="8" rx="4" opacity=".5"/><path class="st" d="M56 232H244" stroke-width="1.5"/><rect class="bg" x="256" y="228" width="200" height="8" rx="4" opacity=".75"/>${bars(60, 244, [240])}
      <rect class="fr" x="36" y="284" width="528" height="80" rx="12"/><text class="l" x="60" y="314">UNFINISHED THREADS</text>${bars(60, 328, [230, 150])}<path class="sd" d="M298 332H410"/>
      <rect class="chip" x="458" y="306" width="86" height="32" rx="16"/><text class="k" x="501" y="327" text-anchor="middle">FORGET</text>
      ${moon(52, 410)}<text class="s" x="76" y="415">Autonomy on: the day’s memories, sorted overnight</text>`,
    'sch-byos': () => `${card}
      <text class="l" x="36" y="54">BRING YOUR OWN BRAIN</text>
      <rect class="fr on" x="36" y="90" width="214" height="66" rx="14"/><text class="t" x="60" y="119">Claude</text><text class="s" x="60" y="141">via Claude Code</text>
      <rect class="fr off" x="36" y="176" width="214" height="66" rx="14"/><text class="t" x="60" y="205">ChatGPT</text><text class="s" x="60" y="227">via Codex</text>
      <rect class="fr off" x="36" y="262" width="214" height="66" rx="14"/><text class="t" x="60" y="302">Ollama</text>
      <path class="st" d="M250 123C310 123 304 210 364 210"/><path class="sd" d="M250 209H364"/><path class="sd" d="M250 295C310 295 304 210 364 210"/><circle class="bg" cx="250" cy="123" r="4"/>
      <rect class="fr on" x="364" y="110" width="200" height="200" rx="18"/><image href="${ICON()}" x="424" y="130" width="80" height="80"/>
      <text class="t" x="464" y="252" text-anchor="middle">Memories</text><text class="s" x="464" y="276" text-anchor="middle">on your computer</text>
      <text class="s" x="300" y="366" text-anchor="middle">Change the model; keep the memories.</text>
      <g transform="translate(52 410)"><rect class="st" x="-13" y="-9" width="26" height="18" rx="2"/><path class="st" d="M-13-9L0 2L13-9"/></g><text class="s" x="76" y="415">She leaves a letter to her next self before a switch</text>`,
    'sch-browse': () => `${card}
      <text class="l" x="36" y="54">BROWSE WITH ME</text>
      <rect class="fr on" x="466" y="30" width="98" height="34" rx="17"/>${eye(494, 47, .8)}<text class="k" x="542" y="52" text-anchor="middle">ON</text>
      <rect class="fr" x="36" y="84" width="528" height="296" rx="14"/>
      <rect class="tab" x="50" y="94" width="138" height="32" rx="8"/><text class="k" x="68" y="115">PAPER</text><text class="k dim" x="214" y="115">YOUTUBE</text><path class="hr" d="M36 134H564"/>
      <rect class="hl" x="58" y="214" width="252" height="16" rx="3"/><rect class="b2" x="64" y="154" width="190" height="12" rx="4"/>${bars(64, 184, [262, 250, 258, 236, 254, 244, 256, 170], 18)}
      <path class="st" d="M312 222C338 222 330 252 352 260" stroke-dasharray="4 5"/>
      <rect class="bubble" x="352" y="232" width="196" height="132" rx="14"/><image href="${ICON()}" x="366" y="246" width="30" height="30"/><text class="k" x="404" y="266">TALK IT THROUGH</text>${bars(368, 294, [152, 140, 96], 18)}
      <text class="s" x="36" y="422">The eye button decides when she’s looking.</text>`,
    'sch-dream': () => `${card}
      <text class="l" x="36" y="54">DREAMS</text>${moon(530, 58, 1.5)}${star(494, 40, .45)}${star(566, 92, .4)}${star(500, 94, .3)}
      <path class="st" d="M140 166L300 368M454 176L300 368M300 286L300 368" stroke-dasharray="2 7" opacity=".8"/>
      ${journal(56, 96, -6, 1)}${journal(374, 104, 4, 2)}${journal(215, 190, -2, 3)}
      ${star(300, 370, 1.3)}<text class="s" x="300" y="426" text-anchor="middle">Old entries return in unexpected company</text>`,
    'dat-style': () => `<defs>
        <filter id="fg-wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="26"/></filter>
        <radialGradient id="fg-wcg"><stop offset="0" stop-color="#9cc0de" stop-opacity=".9"/><stop offset=".7" stop-color="#6d93bf" stop-opacity=".6"/><stop offset="1" stop-color="#6d93bf" stop-opacity=".15"/></radialGradient>
        <filter id="fg-oil"><feTurbulence type="turbulence" baseFrequency=".05 .012" numOctaves="2" seed="9"/><feDiffuseLighting surfaceScale="3" lighting-color="#e3a964"><feDistantLight azimuth="235" elevation="38"/></feDiffuseLighting><feComposite in2="SourceGraphic" operator="in"/></filter>
        <pattern id="fg-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.8" fill="rgba(10,11,13,.35)"/></pattern>
      </defs>${card}
      <text class="l" x="36" y="54">HOUSE STYLE</text>
      <g class="blend"><circle cx="244" cy="196" r="108" fill="url(#fg-wcg)" filter="url(#fg-wc)"/><circle cx="368" cy="196" r="108" fill="#c98a4b" filter="url(#fg-oil)" opacity=".85"/>
      <circle cx="300" cy="312" r="108" fill="#e48aa8" opacity=".78"/></g><circle cx="300" cy="312" r="108" fill="url(#fg-dots)"/><circle cx="300" cy="312" r="108" fill="none" stroke="#f3f2ef" stroke-width="3"/>
      <text class="dt" x="300" y="250" text-anchor="middle">DAT</text>
      <text class="k" x="40" y="96">WATERCOLOR</text><text class="k" x="560" y="96" text-anchor="end">OIL PAINTING</text><text class="k" x="300" y="446" text-anchor="middle">SUBCULTURE ART</text>`,
    'dat-flow': () => `<defs>
        <marker id="fg-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d9b45a"/></marker>
        <filter id="fg-paint"><feTurbulence type="turbulence" baseFrequency=".06 .02" numOctaves="3" seed="2"/><feDiffuseLighting surfaceScale="2.5" lighting-color="#d9a27a"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting><feComposite in2="SourceGraphic" operator="in"/></filter>
        <radialGradient id="fg-iris"><stop offset="0" stop-color="#8fb5e8"/><stop offset=".7" stop-color="#34558f"/><stop offset="1" stop-color="#d9b45a"/></radialGradient>
      </defs>${card}
      <text class="l" x="36" y="54">WORKFLOW</text>
      <rect class="fr" x="36" y="86" width="112" height="136" rx="8"/><circle class="sil" cx="92" cy="140" r="22"/><path class="sil" d="M52 222C56 186 74 172 92 172S128 186 132 222Z"/>
      <text class="k" x="36" y="248">CHARACTER</text><text class="k" x="36" y="266">PORTRAITS</text>
      <rect class="fr" x="36" y="294" width="160" height="96" rx="8"/><path class="sil" d="M37 389L86 334L112 360L146 318L195 389Z"/><circle class="bg" cx="170" cy="318" r="6" opacity=".7"/>
      <text class="k" x="36" y="414">KEY VISUALS</text>
      <path class="st" d="M154 154C214 154 222 206 262 212" marker-end="url(#fg-ah)"/><path class="st" d="M202 342C240 342 236 246 262 236" marker-end="url(#fg-ah)"/>
      <circle class="fr on" cx="326" cy="224" r="58"/><text class="dt sm" x="326" y="232" text-anchor="middle">DAT</text><text class="k" x="326" y="256" text-anchor="middle">FINISH</text>
      <path class="st" d="M386 208C414 198 418 150 438 142" marker-end="url(#fg-ah)"/><path class="st" d="M386 240C414 250 418 296 438 302" marker-end="url(#fg-ah)"/>
      <rect x="446" y="86" width="118" height="96" rx="8" fill="#b9825a" filter="url(#fg-paint)"/><rect class="fr" x="446" y="86" width="118" height="96" rx="8" fill="none"/>
      <text class="k" x="446" y="208">PAINTERLY</text><text class="k" x="446" y="226">TEXTURES</text>
      <rect class="fr" x="446" y="254" width="118" height="96" rx="8"/><path d="M465 302Q505 270 545 302Q505 328 465 302Z" fill="#f3f2ef" opacity=".9"/>
      <circle cx="505" cy="300" r="15" fill="url(#fg-iris)"/><circle cx="505" cy="300" r="6" fill="#0a0b0d"/><circle cx="510" cy="295" r="3" fill="#fff"/><path d="M461 300Q505 262 549 300" fill="none" stroke="#f3f2ef" stroke-width="3" stroke-linecap="round"/>
      <text class="k" x="446" y="374">THE EYES</text>`
  };

  const PROJECTS = [
    {
      id: 'scheherazade',
      title: 'Scheherazade',
      title_ko: '',
      status: 'Beta',
      headline: 'Agent stands more than 1001 nights',
      description: [
        "Built for the long haul. Days, months, one more revision: Scheherazade keeps the facts, your corrections, and unfinished threads close, so you can pick up a project without reintroducing it. A human-like memory, with one useful extra: you can read what she remembers and tell her to forget. With Autonomy on, she sorts the day's memories overnight.",
        'Bring your own brain. Your Claude subscription via Claude Code, ChatGPT via Codex, or Ollama. Change the model; keep the memories. They live on your computer, and she leaves a letter to her next self before a switch. No need to make introductions twice.',
        "Open a paper in Chrome. Take a detour through YouTube. With Browse with me switched on, she can read your current tab and talk it through with you. The eye button decides when she's looking. Even curiosity deserves an off switch.",
        'Sometimes she dreams. With Autonomy on, old journal entries return in unexpected company. She may bring you a fragment after an idle afternoon. A stray thought for your next idea, perhaps. Inspiration keeps odd hours.'
      ],
      action: { label: 'Get', href: 'download.html' },
      field: 'sch',
      art: [0, 1, 2, 3],
      panels: [
        { kind: 'feat', feat: 'sch-memory', cap: 'Feature graphic · Memory', alt: 'Feature graphic, not an app screenshot: Scheherazade keeps the facts, your corrections and unfinished threads; you can read them, tell her to forget, and with Autonomy on she sorts the day overnight' },
        { kind: 'feat', feat: 'sch-byos', cap: 'Feature graphic · Bring your own brain', alt: 'Feature graphic, not an app screenshot: Claude via Claude Code, ChatGPT via Codex or Ollama connect to the same memories kept on your computer, with a letter to her next self before a switch' },
        { kind: 'feat', feat: 'sch-browse', cap: 'Feature graphic · Browse with me', alt: 'Feature graphic, not an app screenshot: a browser tab with a paper open beside Scheherazade talking it through, and the eye button that decides when she is looking' },
        { kind: 'feat', feat: 'sch-dream', cap: 'Feature graphic · Dreams', alt: 'Feature graphic, not an app screenshot: old journal entries joined in unexpected company into a new fragment' }
      ],
      info: { kind: 'sch' }
    },
    {
      id: 'dat',
      title: 'DAT',
      title_ko: '',
      status: '',
      headline: 'Our house style, as a model',
      description: [
        "A model for CHOAM's illustration style, between watercolor, oil painting and subculture art.",
        'We use it to finish character portraits and key visuals, with painterly textures and a particular attention to the eyes.'
      ],
      field: 'dat',
      art: [0, 1],
      panels: [
        { kind: 'feat', feat: 'dat-style', cap: 'Feature graphic · House style', alt: 'Feature graphic, not model output: DAT sits where watercolor, oil painting and subculture art overlap' },
        { kind: 'feat', feat: 'dat-flow', cap: 'Feature graphic · Workflow', alt: 'Feature graphic, not model output: character portraits and key visuals pass through a DAT finish for painterly textures and attention to the eyes' }
      ],
      info: { kind: 'dat' }
    },
    {
      id: 'donguri-ryokan',
      title: 'Donguri Ryokan',
      title_ko: '동구리료칸',
      status: 'Coming soon',
      headline: 'Not every guest is human',
      description: [
        'Three fox spirits borrow money from a tanuki to turn their forgotten mountain shrine into a hot-spring inn. Over 100 days you farm, cook, lay the spring pipes and ready the rooms.',
        'Some guests are yokai passing as human. Read their requests, ask around, and make your call at checkout.'
      ],
      art: [0, 1],
      panels: [
        { kind: 'art', src: 'assets/ryokan_kv_C2.webp', alt: 'Donguri Ryokan key art: fox and tanuki girls in kimono on a night veranda, peering at a silhouette behind a lit shoji screen', pos: '50% 30%', posM: '47% 50%' },
        { kind: 'art', src: 'assets/ryokan_kv_B2.webp', alt: 'Donguri Ryokan key art: fox and tanuki girls around a low table in a tatami room at night, with a paper lantern and an open ledger', pos: '50% 40%', posM: '56% 50%' }
      ],
      info: { kind: 'art', src: 'assets/ryokan_kv_C2.webp', pos: '50% 30%', posM: '47% 50%' }
    },
    {
      id: 'donguri-restaurant',
      title: 'Donguri Restaurant',
      title_ko: '동구리레스토랑',
      status: 'On the web',
      headline: 'No menu. The field decides.',
      description: [
        'A small forest restaurant run by a chef, a sommelier and a part-timer.',
        'Read the reservation board, plant for the guests who are coming, harvest what the field gives, and build each course and wine pairing around it.',
        'One season, four weeks. Plays in the browser.'
      ],
      art: [0, 2, 3], /* key art, then in-game captures framed beside the copy so game UI never meets site UI */
      action: { label: 'Play', href: 'https://donguri.run' },
      panels: [
        { kind: 'art', src: 'assets/restaurant-01.webp', alt: 'Donguri Restaurant key art: the chef, the sommelier and the part-timer leaning in together beside the restaurant logo', pos: '50% 30%', posM: '50% 50%' },
        { kind: 'raw', src: 'assets/restaurant-02.webp', ar: 1920 / 1080, cap: 'In-game capture · Opening night', alt: 'Donguri Restaurant gameplay: the three staff standing in the yard at night during the opening dialogue', pos: '50% 50%', posM: '50% 50%', lift: 0.29 },
        { kind: 'raw', src: 'assets/restaurant-03.webp', ar: 1280 / 720, cap: 'In-game capture · Reservation board', alt: 'Donguri Restaurant gameplay: the restaurant yard and field, with the reservation board listing the first night’s guests', pos: '50% 50%', posM: '42% 50%', lift: 0.33 },
        { kind: 'raw', src: 'assets/restaurant-04.webp', ar: 1280 / 800, cap: 'In-game capture · Tonight’s course', alt: 'Donguri Restaurant gameplay: the kitchen with the evening’s course menu laid out dish by dish', pos: '50% 0%', posM: '50% 50%', lift: 0 }
      ],
      info: { kind: 'art', src: 'assets/restaurant-01.webp', pos: '50% 30%', posM: '62% 50%' }
    },
    {
      id: 'seonjam',
      title: '선잠 DOZE',
      status: '',
      headline: 'She remembers what you said',
      description: [
        'A visual novel set in the local-history club of an old school building. After class, Yeji sorts rosters and old photos by the window.',
        'You talk to her in your own words, and she carries what you said into the next day. Over one week, small things stop adding up.'
      ],
      art: [2, 0],
      panels: [
        { kind: 'art', src: 'assets/seonjam-01.webp', alt: '선잠 DOZE illustration: a girl standing alone in a classroom whose far wall opens onto a deep blue aquarium', pos: '50% 50%', posM: '56% 50%' },
        { kind: 'raw', src: 'assets/seonjam-02.webp', alt: '선잠 DOZE in-game title screen: five girls in school uniform in a dark classroom beside the title and the start menu', pos: '50% 50%', posM: '12% 50%', lift: 0 },
        { kind: 'art', src: 'assets/seonjam-03.webp', alt: '선잠 DOZE illustration: Yeji by a wooden fence beside the old school building in afternoon light', pos: '50% 50%', posM: '24% 50%' }
      ],
      info: { kind: 'art', src: 'assets/seonjam-03.webp', pos: '50% 50%', posM: '24% 50%', side: 'end' }
    }
  ];

  const body = document.body;
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const only = body.dataset.project || '';                /* detail page: one project */
  const track = document.querySelector('[data-track]');   /* absent on download.html */
  const shown = track ? PROJECTS.filter(p => !only || p.id === only) : [];
  const numOf = p => pad(PROJECTS.indexOf(p) + 1);
  const pageOf = p => url(`pages/${p.id}.html`);

  /* ---------- project menu (every page) ---------- */
  document.querySelectorAll('[data-projects]').forEach(list => {
    list.innerHTML = PROJECTS.map(p => {
      const href = !track ? url(`index.html#${p.id}/1`) : only ? pageOf(p) : `#${p.id}/1`;
      return `<li><a class="proj" href="${href}" data-go-project="${p.id}">${esc(p.title)}</a></li>`;
    }).join('');
  });
  const toggles = [...document.querySelectorAll('[data-menu-toggle]')];
  const setMenu = open => {
    body.classList.toggle('menu-open', open);
    toggles.forEach(t => t.setAttribute('aria-expanded', String(open)));
    if (open) { const first = document.querySelector('[data-menu] .proj'); first && first.focus(); }
    wake();
  };
  toggles.forEach(t => t.addEventListener('click', () => setMenu(!body.classList.contains('menu-open'))));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); toggles[0] && toggles[0].focus(); }
  });

  let idle = 0;
  function wake() {
    if (!track) return;
    body.classList.remove('is-clear');
    clearTimeout(idle);
    if (!body.classList.contains('is-raw') || body.classList.contains('menu-open')) return;
    idle = setTimeout(() => {
      const a = document.activeElement;
      if (a && a.closest('.chrome') && a.matches(':focus-visible')) return;
      body.classList.add('is-clear'); /* the Get / Play action is outside .chrome and stays */
    }, 1600);
  }
  if (!track) return;

  /* ---------- vertical product sections, each with a horizontal paragraph rail ---------- */
  body.classList.add('v');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => (reduce.matches ? 'instant' : 'smooth');
  const paras = p => [].concat(p.description);
  const artFor = (p, k) => {
    if (!p.art) return p.panels[0];
    return p.panels[p.art[Math.min(k, p.art.length - 1)]];
  };
  /* one visual per paragraph: full-bleed art, or a framed in-game capture / feature graphic beside the copy */
  const visual = (spec, j, i) => {
    const on = j === 0 ? ' is-on' : '', cap = spec.cap ? `<figcaption>${esc(spec.cap)}</figcaption>` : '';
    if (spec.kind === 'feat') return `<figure class="media vis feat${on}" data-art="${i}"><svg viewBox="0 0 600 460" role="img" aria-label="${esc(spec.alt)}">${FEAT[spec.feat]()}</svg>${cap}</figure>`;
    const img = `src="${url(spec.src)}" alt="${esc(spec.alt)}" draggable="false" decoding="async"${j ? ' loading="lazy"' : ''}`;
    if (spec.kind === 'raw') return `<figure class="media vis frame${on}" data-art="${i}" style="--ar:${spec.ar || 16 / 9}"><img ${img}>${cap}</figure>`;
    return `<img class="media${on}" data-art="${i}" ${img} style="--pos:${spec.pos};--pos-m:${spec.posM}">`;
  };
  const stage = p => {
    const field = p.field === 'sch' ? '<div class="sch-field"></div>'
      : p.field === 'dat' ? '<div class="dat-field" aria-hidden="true"><span class="dat-type">DAT</span></div>' : '';
    const used = [...new Set(paras(p).map((_, k) => artFor(p, k)))];
    return field + used.map((spec, j) => visual(spec, j, p.panels.indexOf(spec))).join('');
  };

  track.removeAttribute('aria-roledescription');
  track.innerHTML = shown.map(p => {
    const ps = paras(p), n = ps.length, act = p.action;
    const ext = act && /^https?:/.test(act.href);
    return `<section class="prod p-${p.id} k-${p.field || p.panels[0].kind}" id="${p.id}" data-prod="${p.id}" aria-labelledby="t-${p.id}">
      <div class="stage">${stage(p)}</div>
      <div class="prod-veil" aria-hidden="true"></div>
      <div class="prod-copy">
        <p class="cap-meta"><span>${numOf(p)}</span>${p.status ? `<span>${esc(p.status)}</span>` : ''}</p>
        <h2 class="cap-title" id="t-${p.id}">${only ? esc(p.title) : `<a href="${pageOf(p)}">${esc(p.title)}</a>`}</h2>
        ${p.title_ko ? `<p class="cap-ko" lang="ko">${esc(p.title_ko)}</p>` : ''}
        <p class="cap-line">${esc(p.headline)}</p>
        <div class="rail" data-rail tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(p.title)}, ${n} paragraphs">
          ${ps.map((t, k) => `<div class="slide" role="group" aria-roledescription="slide" aria-label="${k + 1} of ${n}"><p>${esc(t)}</p></div>`).join('')}
        </div>
        <div class="rail-ctl">
          ${n > 1 ? `<button class="arrow" type="button" data-rail-step="-1" aria-label="Previous paragraph, ${esc(p.title)}">&#8592;</button>
          <span class="dots">${ps.map((_, k) => `<button class="dot" type="button" data-rail-go="${k}" aria-label="${esc(p.title)}, paragraph ${k + 1} of ${n}"><i></i></button>`).join('')}</span>
          <button class="arrow" type="button" data-rail-step="1" aria-label="Next paragraph, ${esc(p.title)}">&#8594;</button>
          <span class="count" aria-hidden="true"><b data-count>1</b> / ${n}</span>` : ''}
          ${act ? `<a class="prod-act" href="${url(act.href)}" aria-label="${esc(act.label)} ${esc(p.title)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(act.label)}</a>` : ''}
        </div>
      </div>
    </section>`;
  }).join('');
  const secs = [...track.querySelectorAll('.prod')];

  /* ---------- opening (index only): no product is current while it fills the screen ---------- */
  const intro = only ? null : document.querySelector('.intro');
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
    const tick = () => { clock.textContent = f.format(new Date()); };
    tick(); setInterval(tick, 15000);
  }

  /* ---------- state ---------- */
  let cur = 0;
  let atIntro = !!intro && !location.hash;
  const fromHash = () => {
    const parts = decodeURIComponent(location.hash.slice(1)).split('/');
    const [id, sub] = only ? [only, parts[parts.length - 1]] : parts;
    const pi = Math.max(0, shown.findIndex(p => p.id === id));
    const k = sub === 'details' ? 0 : Math.max(1, parseInt(sub, 10) || 1) - 1;
    return [pi, k];
  };

  const slideOf = sec => { const r = sec.querySelector('[data-rail]'); return Math.max(0, Math.round(r.scrollLeft / (r.clientWidth || 1))); };
  const setText = (sel, text) => document.querySelectorAll(sel).forEach(el => { el.textContent = text; });

  const sync = sec => {
    const pi = secs.indexOf(sec), p = shown[pi], k = slideOf(sec), n = paras(p).length;
    sec.querySelectorAll('.dot').forEach((d, j) => {
      d.classList.toggle('is-current', j === k);
      if (j === k) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
    sec.querySelectorAll('[data-rail-step]').forEach(b => { b.disabled = Number(b.dataset.railStep) < 0 ? k === 0 : k === n - 1; });
    sec.querySelectorAll('.slide').forEach((el, j) => { el.inert = j !== k; });
    const c = sec.querySelector('[data-count]'); if (c) c.textContent = k + 1;
    const art = artFor(p, k);
    sec.dataset.vis = art.kind;
    sec.querySelectorAll('.media[data-art]').forEach(m => {
      const on = Number(m.dataset.art) === p.panels.indexOf(art);
      m.classList.toggle('is-on', on);
      if (on) m.removeAttribute('aria-hidden'); else m.setAttribute('aria-hidden', 'true');
    });
    if (pi !== cur || atIntro) return;
    setText('[data-current-num]', numOf(p));
    setText('[data-current-title]', p.title);
    setText('[data-current-sub]', `${k + 1} / ${n}`);
    document.querySelectorAll('[data-go-project]').forEach(b => {
      const on = b.dataset.goProject === p.id;
      b.classList.toggle('is-current', on);
      if (on) b.setAttribute('aria-current', only ? 'page' : 'true'); else b.removeAttribute('aria-current');
    });
    const hash = only ? `#${k + 1}` : `#${p.id}/${k + 1}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
    const live = document.querySelector('[data-live]');
    if (live) live.textContent = `${p.title}, paragraph ${k + 1} of ${n}`;
  };

  const goSlide = (sec, k, instant) => {
    const r = sec.querySelector('[data-rail]'), n = r.children.length;
    k = Math.max(0, Math.min(n - 1, k));
    r.scrollTo({ left: k * r.clientWidth, behavior: instant ? 'instant' : behavior() });
  };
  const showIntro = () => {
    atIntro = true;
    ['[data-current-num]', '[data-current-title]', '[data-current-sub]'].forEach(sel => setText(sel, ''));
    document.querySelectorAll('[data-go-project]').forEach(b => { b.classList.remove('is-current'); b.removeAttribute('aria-current'); });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  };
  const goProd = (pi, k, instant) => {
    const sec = secs[pi]; if (!sec) return;
    cur = pi;
    atIntro = false;
    scrollTo({ top: sec.offsetTop, behavior: instant ? 'instant' : behavior() });
    if (k != null) goSlide(sec, k, true);
    sync(sec);
  };

  const [pi0, k0] = fromHash(); /* read before the first sync rewrites the hash */
  cur = pi0;
  secs.forEach(sec => {
    const r = sec.querySelector('[data-rail]');
    let raf = 0;
    r.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => sync(sec)); }, { passive: true });
    r.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); goSlide(sec, slideOf(sec) + (e.key === 'ArrowRight' ? 1 : -1)); }
    });
    sync(sec);
  });

  /* current product = the section covering the middle of the viewport */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      if (en.target === intro) { showIntro(); return; }
      atIntro = false; cur = secs.indexOf(en.target); sync(en.target);
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  [intro, ...secs].forEach(el => el && io.observe(el));

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;
    const sec = t.closest('.prod');
    if (t.matches('[data-rail-step]')) goSlide(sec, slideOf(sec) + Number(t.dataset.railStep));
    else if (t.matches('[data-rail-go]')) goSlide(sec, Number(t.dataset.railGo));
    else if (t.matches('[data-go-project]')) {
      const pi = shown.findIndex(p => p.id === t.dataset.goProject);
      if (pi < 0) return; /* another project's page: let the link navigate */
      e.preventDefault();
      setMenu(false);
      goProd(pi, 0);
    }
  });

  /* Left/Right anywhere else on the page step the current product's paragraphs; Up/Down stay native */
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || body.classList.contains('menu-open') || e.defaultPrevented) return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !atIntro) {
      e.preventDefault();
      const sec = secs[cur];
      goSlide(sec, slideOf(sec) + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });

  /* ---------- size + deep link ---------- */
  new ResizeObserver(() => secs.forEach(sec => goSlide(sec, Number((sec.querySelector('[data-count]') || { textContent: 1 }).textContent) - 1, true))).observe(track);
  /* phones stack copy under the visual: framed visuals end where the copy begins */
  const copyTop = new ResizeObserver(() => secs.forEach(sec => sec.style.setProperty('--copy-top', `${sec.querySelector('.prod-copy').offsetTop}px`)));
  [track, ...secs.map(sec => sec.querySelector('.prod-copy'))].forEach(el => copyTop.observe(el));

  addEventListener('hashchange', () => { const [pi, k] = fromHash(); goProd(pi, k); });
  if (location.hash) requestAnimationFrame(() => goProd(pi0, k0, true)); else if (intro) showIntro(); else sync(secs[0]);
})();
