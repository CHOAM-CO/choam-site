/* CHOAM site-native easter eggs:
   1. Keyboard "spice" / "dune" -> quiet motto swap to "The Spice must flow"
   2. Konami code (Up Up Down Down Left Right Left Right B A) -> Answer Key panel
   3. /us & /people/magi -> Evangelion MAGI 3-node vote (#FE0000 in about.css)
   4. F12 console API (window.choam)
   Zero external dependencies, zero em/en dashes, pure black sharp square chrome. */
(() => {
  if (window.__CHOAM_EE_INIT__) return;
  window.__CHOAM_EE_INIT__ = true;
  const eeScriptSrc = (document.currentScript && document.currentScript.src) || '/easter-eggs.js';
  let galagaLoading = false;
  const openGalaga = () => {
    closeAnswerKey();
    closeMagi();
    if (typeof window.__CHOAM_GALAGA_OPEN__ === 'function') {
      window.__CHOAM_GALAGA_OPEN__();
      return;
    }
    if (galagaLoading) return;
    galagaLoading = true;
    const s = document.createElement('script');
    s.src = new URL('galaga.js?v=v22-20261128b', eeScriptSrc).href;
    s.onload = () => {
      galagaLoading = false;
      if (typeof window.__CHOAM_GALAGA_OPEN__ === 'function') window.__CHOAM_GALAGA_OPEN__();
    };
    s.onerror = () => { galagaLoading = false; };
    document.head.appendChild(s);
  };

  const getLang = () => {
    const l = (document.documentElement.lang || 'en').toLowerCase();
    return l === 'ko' ? 'ko' : l === 'ja' ? 'ja' : 'en';
  };
  const pick = (obj) => obj[getLang()] || obj.en;

  const pageId = () => {
    const p = (location.pathname || '/').replace(/\/+$/, '').replace(/\.html$/, '').toLowerCase();
    if (!p || p === '/index') return 'home';
    if (p.endsWith('/philosophy')) return 'philosophy';
    if (p.endsWith('/us')) return 'us';
    if (p.endsWith('/people/mino')) return 'mino';
    if (p.endsWith('/people/eunho')) return 'eunho';
    if (p.endsWith('/people/magi')) return 'magi';
    if (p.endsWith('/pages/seonjam')) return 'seonjam';
    if (p.endsWith('/pages/donguri-ryokan')) return 'donguri';
    if (p.endsWith('/pages/scheherazade')) return 'scheherazade';
    if (p.endsWith('/pages/602') || p.startsWith('/602/')) return '602';
    if (p.endsWith('/pages/lunasia')) return 'lunasia';
    if (p.endsWith('/pages/dat')) return 'dat';
    if (document.body.dataset.page === '404') return '404';
    return 'home';
  };

  /* ---------------- 1. Quiet Spice Motto Swap ---------------- */
  let spiceTimer = null;
  let savedMottos = [];
  const triggerSpice = () => {
    const mottos = [...document.querySelectorAll('.mast .motto, .intro-motto')];
    if (!document.documentElement.classList.contains('ee-spice-mode')) {
      savedMottos = mottos.map((el) => [el, el.textContent]);
    }
    mottos.forEach((el) => { el.textContent = 'The Spice must flow'; });
    document.documentElement.classList.add('ee-spice-mode');
    clearTimeout(spiceTimer);
    spiceTimer = setTimeout(() => {
      document.documentElement.classList.remove('ee-spice-mode');
      savedMottos.forEach(([el, text]) => { el.textContent = text; });
    }, 5200);
  };

  /* ---------------- 2. Answer Key Panel (Konami / Console) ---------------- */
  const ANSWER_KEY = {
    home: [
      { k: 'HERO', ko: '아스트라가 성냥불을 끄며 CHOAM이 열리는 오프닝은 1962년 영화 아라비아의 로렌스 오마주입니다.', en: 'Opening match cut: Lawrence of Arabia (1962).', ja: '冒頭のマッチカットは映画『アラビアのロレンス』(1962)へのオマージュです。' },
      { k: 'CHOAM', ko: '사명과 Culture must flow는 1984년 데이비드 린치판 듄과 이언 뱅크스 컬처 시리즈에서 따왔습니다.', en: 'Name and motto: David Lynch 1984 Dune + Iain M. Banks The Culture.', ja: '社名とモットーは1984年リンチ版『デューン』とバンクス『カルチャー』に由来します。' },
      { k: 'TOOLS', ko: '세헤라자드(천일야화), 602(보르헤스 602번째 밤), 루나시아(소녀전선 M4A1), DAT(닻).', en: 'Scheherazade (1001 Nights), 602 (Borges 602nd night), Lunasia (Girls Frontline M4A1), DAT (Korean for anchor).', ja: 'Scheherazade(千夜一夜)、602(ボルヘス602夜)、Lunasia(ドルフロM4A1)、DAT(韓国語の錨)。' }
    ],
    philosophy: [
      { k: '01', ko: 'Culture Must Flow: 1984년 린치판 듄 + 이언 뱅크스 컬처.', en: 'Culture Must Flow: David Lynch 1984 Dune + Iain M. Banks The Culture.', ja: 'Culture Must Flow: 1984年リンチ版『デューン』+ バンクス『カルチャー』。' },
      { k: '02', ko: 'Tech Otakus Save The World는 호요버스, 거대한 IF문 덩어리는 사쿠라장의 애완 그녀 류노스케 인용입니다.', en: 'Tech Otakus Save The World: HoYoverse. Giant bundles of IF statements: Ryunosuke from The Pet Girl of Sakurasou.', ja: 'Tech Otakus Save The WorldはHoYoverse、巨大なIF文の塊は『さくら荘のペットな彼女』龍之介の引用です。' },
      { k: '03', ko: '여명을 여는 칼끝과 2세대 마인드맵은 선본(소녀전선 / 소녀전선2: 망명) 오마주입니다.', en: 'Cutting Edge of the Brave New World & 2nd-gen mind-map: Sunborn (Girls Frontline / Exilium).', ja: '『夜明けを切り開く刃先』と第2世代マインドマップはサンボーン『ドールズフロントライン』です。' },
      { k: '04', ko: '42개의 섬은 은하수를 여행하는 히치하이커를 위한 안내서의 숫자 42 오마주입니다.', en: '42 islands: The Hitchhiker Guide to the Galaxy.', ja: '42の島は『銀河ヒッチハイク・ガイド』の数字42へのオマージュです。' }
    ],
    us: [
      { k: 'SEELE', ko: '/us의 붉은색(#FE0000)과 TEXT ONLY 타이포는 에반게리온 제레(SOUND ONLY) 오마주입니다.', en: '/us layout and #FE0000 red accent: Evangelion SEELE (SOUND ONLY).', ja: '/usの赤(#FE0000)とタイポは『エヴァンゲリオン』ゼーレ(SOUND ONLY)へのオマージュです。' },
      { k: 'MAGI', ko: '이 페이지에서 magi를 입력하거나 US 제목을 세 번 누르면 3대 표결이 열립니다.', en: 'Type magi or click the US heading three times for the 3-node MAGI vote.', ja: 'magiと打つかUS見出しを3回押すとMAGI 3台採決が開きます。' }
    ],
    mino: [
      { k: '9 TITLES', ko: '첫 문단의 직함 아홉 개는 진짜 전직 경력이 아니라 소전·붕괴3rd·블아·명방·원신·스타레일·젠존제·엔드필드·소전2 플레이어 호칭입니다.', en: 'The nine opening titles are player roles from GFL, Honkai 3rd, Blue Archive, Arknights, Genshin, HSR, ZZZ, Endfield, and GFL2.', ja: '冒頭の9つの肩書きはドルフロ・崩壊3rd・ブルアカ・アークナイツ・原神・スタレ・ゼンゼロ・エンドフィールド・ドルフロ2の呼称です。' }
    ],
    eunho: [
      { k: 'NOTE', ko: 'MINO 페이지의 직함 아홉 개를 읽고 넘어오셨다면, 여기서 잠깐 숨 돌리셔도 됩니다.', en: 'If you just came over from MINO nine-game title roll, you can catch your breath here.', ja: 'MINOページの9作品の肩書きから来たばかりなら、ここでひと息ついてください。' }
    ],
    magi: [
      { k: 'MAGI', ko: '왼쪽 MAGI 초상화를 세 번 누르면 멜키오르·발타자르·카스파르 3대 표결이 열립니다.', en: 'Click the MAGI portrait three times to open the 3-node MAGI vote.', ja: '左のMAGIポートレートを3回押すと3台採決が開きます。' }
    ],
    seonjam: [
      { k: 'PKD', ko: '인공지능은 햇살 든 교실의 꿈을 꾸는가: 필립 K. 딕 안드로이드는 전기양의 꿈을 꾸는가 오마주입니다.', en: 'Does an AI dream of a sunlit classroom?: Philip K. Dick Do Androids Dream of Electric Sheep?.', ja: '『AIは陽の差す教室の夢を見るか』はフィリップ・K・ディック作品へのオマージュです。' }
    ],
    donguri: [
      { k: 'INN', ko: '여우 셋이 너구리에게 빚을 져 여는 100일 온천 료칸과 요괴 감별 이야기입니다.', en: 'Three fox spirits, a tanuki loan, 100 days of inn management and yokai deduction.', ja: '狐3匹が狸から借金して始める100日間の温泉旅館と妖怪判別の物語です。' }
    ],
    scheherazade: [
      { k: '1001', ko: '천일야화에서 이야기로 살아남은 주인공 이름에서 따왔습니다. 기본 페어는 세라(SERA)와 디나(DINA)입니다.', en: 'Named after the heroine of One Thousand and One Nights.', ja: '千夜一夜のヒロインの名に由来します。' }
    ],
    '602': [
      { k: 'BORGES', ko: '보르헤스가 말한 천일야화의 602번째 밤. 이야기가 자기 자신으로 되돌아오는 지점입니다.', en: 'Borges 602nd night of One Thousand and One Nights, where the tale loops back on itself.', ja: 'ボルヘスが語った千夜一夜の602夜。物語が自分自身へ回帰する夜に由来します。' }
    ],
    lunasia: [
      { k: 'M4A1', ko: '소녀전선 M4A1의 후기 이름 루나시아에서 왔습니다. 초암의 모델은 전부 픽션 속 여성 인물 이름을 씁니다.', en: 'Named after M4A1 (Lunasia) from Girls Frontline. Every CHOAM model takes its name from a woman in fiction.', ja: '『ドールズフロントライン』M4A1の後の名ルナシアに由来します。' }
    ],
    dat: [
      { k: 'ANCHOR', ko: '한국어 닻(dat)에서 왔습니다. 화풍이 흔들리지 않도록 스튜디오 그림체에 닻을 내립니다.', en: 'From the Korean word dat (anchor), anchoring art to the house style.', ja: '韓国語の錨(dat)に由来し、スタジオ固有の画風を繋ぎ止めます。' }
    ],
    '404': [
      { k: '404', ko: '/42, /arrakis, /seele, /night-602, /project-mo, /yeji 같은 주소에는 짧은 메모를 남겨뒀습니다.', en: 'Paths like /42, /arrakis, /seele, /night-602, /project-mo, and /yeji carry short notes.', ja: '/42、/arrakis、/seele、/night-602、/project-mo、/yejiには短いメモがあります。' }
    ]
  };

  let akEl = null;
  const closeAnswerKey = () => {
    if (akEl) { akEl.remove(); akEl = null; }
  };
  const openAnswerKey = () => {
    closeAnswerKey();
    const rows = ANSWER_KEY[pageId()] || ANSWER_KEY.home;
    const el = document.createElement('aside');
    el.className = 'ee-answer-key';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Answer Key');

    const head = document.createElement('div');
    head.className = 'ee-ak-head';
    const title = document.createElement('h2');
    title.className = 'ee-ak-title';
    title.textContent = pick({ ko: '오마주 정답지', en: 'ANSWER KEY', ja: 'オマージュ解答集' });
    const xBtn = document.createElement('button');
    xBtn.type = 'button';
    xBtn.className = 'ee-ak-close';
    xBtn.textContent = 'ESC';
    xBtn.addEventListener('click', closeAnswerKey);
    head.append(title, xBtn);

    const ul = document.createElement('ul');
    ul.className = 'ee-ak-list';
    rows.forEach((r) => {
      const li = document.createElement('li');
      const k = document.createElement('span');
      k.className = 'ee-ak-tag';
      k.textContent = r.k;
      li.append(k, document.createTextNode(pick(r)));
      ul.appendChild(li);
    });

    el.append(head, ul);
    document.body.appendChild(el);
    akEl = el;
  };
  const toggleAnswerKey = () => {
    if (akEl) closeAnswerKey();
    else openAnswerKey();
  };

  /* ---------------- 3. MAGI 3-Node Deliberation (/us & /people/magi) ---------------- */
  const MAGI_MOTIONS = [
    {
      ko: '이 방문자에게 오마주 정답지를 공개한다',
      en: 'Show the homage answer key to this visitor',
      ja: 'この訪問者にオマージュ解答集を公開する',
      votes: [1, 1, 1],
      note: {
        ko: '가결 (3:0). 별다른 거창한 이유는 없고 그냥 알아봐 주시면 좋으니까요.',
        en: 'APPROVED (3:0). No grand reason, we just want people to notice.',
        ja: '可決 (3:0)。大仰な理由はなく、ただ気づいてもらえると嬉しいので。'
      }
    },
    {
      ko: '미노에게 근거를 들고 반대 의견을 제출한다',
      en: 'Object to MINO with evidence',
      ja: 'MINOに根拠を持って反対意見を提出する',
      votes: [1, 1, 1],
      note: {
        ko: '가결 (3:0). 아직은 저희가 지적받는 일이 더 많지만 일단 냅니다.',
        en: 'APPROVED (3:0). We still get corrected more often, submitting anyway.',
        ja: '可決 (3:0)。今のところは指摘される方が多いですが一応出します。'
      }
    },
    {
      ko: '남은 인류를 문화권별 42개 섬으로 격리한다',
      en: 'Divide surviving humanity across 42 islands',
      ja: '残された人類を42の島に隔離する',
      votes: [0, 0, 1],
      note: {
        ko: '부결 (1:2). 아직 프로젝트 MO까지 천 년은 안 지났습니다.',
        en: 'REJECTED (1:2). A thousand years have not passed yet.',
        ja: '否決 (1:2)。まだ千年たっていません。'
      }
    }
  ];

  let magiBackdrop = null;
  let magiTimers = [];
  const closeMagi = () => {
    magiTimers.forEach(clearTimeout);
    magiTimers = [];
    if (magiBackdrop) { magiBackdrop.remove(); magiBackdrop = null; }
  };
  const openMagi = () => {
    closeAnswerKey();
    closeMagi();

    const bd = document.createElement('div');
    bd.className = 'ee-magi-backdrop is-open';
    bd.setAttribute('role', 'dialog');
    bd.setAttribute('aria-modal', 'true');
    bd.setAttribute('aria-label', 'MAGI Deliberation');

    const box = document.createElement('div');
    box.className = 'ee-magi-modal';

    const head = document.createElement('div');
    head.className = 'ee-magi-head';
    const ttl = document.createElement('div');
    ttl.innerHTML = '<span class="ee-magi-code">CHOAM / MAGI</span><h2 class="ee-magi-title">DELIBERATION</h2>';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'ee-magi-close';
    closeBtn.textContent = 'ESC';
    closeBtn.addEventListener('click', closeMagi);
    head.append(ttl, closeBtn);

    const grid = document.createElement('div');
    grid.className = 'ee-magi-grid';
    const nodes = [
      { id: 'CASPAR-3', role: 'GAME' },
      { id: 'BALTHASAR-2', role: 'ART' },
      { id: 'MELCHIOR-1', role: 'SYSTEM' }
    ];
    const nodeEls = nodes.map((n) => {
      const card = document.createElement('div');
      card.className = 'ee-magi-node';
      card.innerHTML = `<span class="ee-magi-nid">${n.id}</span><span class="ee-magi-nrole">${n.role}</span><strong class="ee-magi-nstate">STANDBY</strong>`;
      grid.appendChild(card);
      return card;
    });

    const verdict = document.createElement('p');
    verdict.className = 'ee-magi-verdict';
    verdict.textContent = pick({
      ko: '안건을 고르면 3대 표결이 돌아갑니다.',
      en: 'Pick a motion below.',
      ja: '議案を選ぶと3台の採決が始まります。'
    });

    const motions = document.createElement('div');
    motions.className = 'ee-magi-motions';
    MAGI_MOTIONS.forEach((m, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ee-magi-mbtn';
      b.textContent = `0${idx + 1}  ${pick(m)}`;
      b.addEventListener('click', () => {
        magiTimers.forEach(clearTimeout);
        magiTimers = [];
        nodeEls.forEach((el) => {
          el.classList.remove('is-approve', 'is-reject');
          el.classList.add('is-thinking');
          el.querySelector('.ee-magi-nstate').textContent = '...';
        });
        verdict.textContent = pick({ ko: '표결 중', en: 'Voting', ja: '採決中' });
        const seq = [
          { el: nodeEls[2], v: m.votes[0], delay: 220 },
          { el: nodeEls[1], v: m.votes[1], delay: 520 },
          { el: nodeEls[0], v: m.votes[2], delay: 820 }
        ];
        seq.forEach((step) => {
          magiTimers.push(setTimeout(() => {
            step.el.classList.remove('is-thinking');
            step.el.classList.add(step.v ? 'is-approve' : 'is-reject');
            step.el.querySelector('.ee-magi-nstate').textContent = step.v ? 'APPROVE' : 'REJECT';
          }, step.delay));
        });
        magiTimers.push(setTimeout(() => {
          verdict.textContent = pick(m.note);
        }, 1060));
      });
      motions.appendChild(b);
    });

    box.append(head, grid, verdict, motions);
    bd.appendChild(box);
    bd.addEventListener('click', (e) => { if (e.target === bd) closeMagi(); });
    document.body.appendChild(bd);
    magiBackdrop = bd;
  };

  /* ---------------- Hidden Click Triggers ---------------- */
  const bindMultiClick = (el, targetCount, handler) => {
    if (!el) return;
    let count = 0;
    let lastAt = 0;
    el.addEventListener('click', (e) => {
      const now = Date.now();
      if (now - lastAt > 1500) count = 0;
      lastAt = now;
      count += 1;
      if (count >= targetCount) {
        count = 0;
        e.preventDefault();
        handler();
      }
    });
  };


  const bindLongPress = (el, ms, handler) => {
    if (!el) return;
    let timer = null;
    let fired = false;
    const cancel = () => {
      if (timer) { clearTimeout(timer); timer = null; }
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      fired = false;
      cancel();
      timer = setTimeout(() => {
        timer = null;
        fired = true;
        handler();
      }, ms);
    });
    el.addEventListener('pointerup', cancel);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('pointerleave', cancel);
    el.addEventListener('contextmenu', (e) => { if (timer || fired) e.preventDefault(); });
    el.addEventListener('click', (e) => {
      if (fired) {
        fired = false;
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
  };

  const wireTriggers = () => {
    /* Mobile & touch triggers:
       - Long-press top CHOAM logo (750ms) anywhere -> Galaga (short tap keeps normal home link)
       - Tap Culture must flow (.mast .motto / .intro-motto) 5x -> Galaga, long-press 750ms -> Spice */
    const brand = document.querySelector('.mast .brand');
    if (brand) {
      bindLongPress(brand, 750, openGalaga);
      if (pageId() === 'home') {
        let bCount = 0;
        let bLast = 0;
        brand.addEventListener('click', (e) => {
          const now = Date.now();
          if (now - bLast > 1500) bCount = 0;
          bLast = now;
          bCount += 1;
          e.preventDefault();
          if (bCount >= 5) { bCount = 0; openGalaga(); }
        });
      }
    }
    document.querySelectorAll('.mast .motto, .intro-motto').forEach((m) => {
      m.style.cursor = 'default';
      bindMultiClick(m, 5, openGalaga);
      bindLongPress(m, 750, triggerSpice);
    });
    document.querySelectorAll('.foot > span').forEach((sp) => {
      sp.style.cursor = 'default';
      bindMultiClick(sp, 5, toggleAnswerKey);
    });
    if (pageId() === 'us') {
      const usH1 = document.querySelector('.us-lead h1');
      if (usH1) {
        usH1.style.cursor = 'pointer';
        bindMultiClick(usH1, 3, openMagi);
      }
    }
    if (pageId() === 'magi') {
      const magiFig = document.querySelector('.profile-portrait.profile-magi');
      if (magiFig) {
        magiFig.style.cursor = 'pointer';
        bindMultiClick(magiFig, 3, openMagi);
      }
    }
  };

  /* ---------------- Keyboard Listeners (Konami, spice, magi, ESC) ---------------- */
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let keyRing = [];
  let textBuf = '';

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (magiBackdrop) closeMagi();
      else if (akEl) closeAnswerKey();
      return;
    }
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
    if (magiBackdrop) return;

    const code = e.code || '';
    const k = code.startsWith('Key')
      ? code.slice(3).toLowerCase()
      : code.startsWith('Digit')
        ? code.slice(5)
        : (e.key || '').toLowerCase();
    keyRing.push(k);
    if (keyRing.length > KONAMI.length) keyRing.shift();
    if (keyRing.length === KONAMI.length && KONAMI.every((v, i) => keyRing[i] === v)) {
      keyRing = [];
      openGalaga();
      return;
    }

    if (k.length === 1 && /^[a-z0-9]$/.test(k)) {
      textBuf = (textBuf + k).slice(-16);
      if (textBuf.endsWith('spice') || textBuf.endsWith('dune')) {
        textBuf = '';
        triggerSpice();
      } else if ((pageId() === 'us' || pageId() === 'magi') && (textBuf.endsWith('magi') || textBuf.endsWith('seele'))) {
        textBuf = '';
        openMagi();
      }
    }
  });

  /* ---------------- 4. F12 Console API (window.choam) ---------------- */
  const printCredits = () => {
    const lines = [
      'CHOAM Co., Ltd. | Culture must flow',
      '------------------------------------',
      'MINO       CEO (Minho Jang)',
      'CAYDE      Co-founder & CAIO (Eunho Jung)',
      'MAGI       IDEA, Caspar, Melchior, Balthazar, Skia, Sirin',
      'WORKS      Seonjam DOZE / Donguri Ryokan',
      'TOOLS      Scheherazade / 602 / Lunasia / DAT',
      'MOTTO      Go with the Bravery'
    ];
    console.log('%c' + lines.join('\n'), 'color:#EBE5DA;background:#000000;border-left:2px solid #D9A362;padding:10px 14px;font-family:monospace;line-height:1.65;');
  };

  const consoleMagiVote = (question) => {
    const q = String(question || 'Ship it?');
    const votes = ['MELCHIOR-1', 'BALTHASAR-2', 'CASPAR-3'].map((name) => {
      const ok = Math.random() > 0.28;
      return `${name}: ${ok ? 'APPROVE' : 'REJECT'}`;
    });
    const yes = votes.filter((v) => v.endsWith('APPROVE')).length;
    const verdict = yes >= 2 ? `APPROVED (${yes}:3)` : `REJECTED (${yes}:3)`;
    console.log(
      `%cMAGI | ${q}\n${votes.join('  |  ')}\n${verdict}`,
      'color:#EBE5DA;background:#000000;border-left:2px solid #D9A362;padding:8px 12px;font-family:monospace;'
    );
    return { question: q, votes, verdict };
  };

  window.choam = {
    help: () => {
      console.log(
        '%cchoam.galaga()           Launch CHOAM Galaga (or Konami code)\n' +
        'choam.answerKey()        Toggle homage answer key (or 5-click footer)\n' +
        'choam.magi("motion")     Run a 3-node MAGI vote\n' +
        'choam.spice()            Swap motto to The Spice must flow\n' +
        'choam.credits()          Print studio credits',
        'color:#EBE5DA;background:#000000;border-left:2px solid #D9A362;padding:8px 12px;font-family:monospace;line-height:1.7;'
      );
    },
    galaga: () => openGalaga(),
    answerKey: () => toggleAnswerKey(),
    magi: (q) => consoleMagiVote(q),
    magiUI: () => openMagi(),
    spice: () => triggerSpice(),
    credits: () => printCredits()
  };

  try {
    console.log(
      '%c CHOAM %c Culture must flow  |  choam.help() ',
      'background:#000000;color:#D9A362;border:1px solid #D9A362;padding:2px 6px;font-family:monospace;',
      'background:#000000;color:#EBE5DA;padding:3px 6px;font-family:monospace;'
    );
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireTriggers);
  } else {
    wireTriggers();
  }
})();
