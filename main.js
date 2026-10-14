/* CHOAM site gallery. index.html shows every project; pages/<id>.html sets <body data-project="<id>">
   and shows that project only, opening on its details. download.html only uses the menu. */
(() => {
  const ROOT = new URL('.', document.currentScript.src); /* site root, works under / and over file:// */
  const url = path => new URL(path, ROOT).href;

  /* Feature graphics: drawn diagrams of what the copy says, for products without approved imagery.
     They are labelled as graphics and are not app screenshots or model output.
     r2: the same diagrams unpacked from their card. No outer frame, no boxed rows: each one is set straight onto
     the horizon plate at 720x540, lit by one pool of light, with type sized per screen in style.css. */
  const ICON = () => url('assets/scheherazade.png');
  const POOL = (id, cx, cy, rx, ry, a = .16) => `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#d9a362" stop-opacity="${a}"/><stop offset="1" stop-color="#d9a362" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`;
  const bars = (x, y, ws, step = 22, h = 10) => ws.map((w, i) => `<rect class="b" x="${x}" y="${y + i * step}" width="${w}" height="${h}" rx="1"/>`).join('');
  const eye = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="st" d="M-16 0Q0-13 16 0Q0 13-16 0Z"/><circle class="bg" r="4.5"/></g>`;
  const moon = (x, y, s = 1) => `<path class="bg" transform="translate(${x} ${y}) scale(${s})" d="M4-11.3A12 12 0 1 0 4 11.3A13 13 0 0 1 4-11.3Z"/>`;
  const star = (x, y, s = 1) => `<path class="bg" transform="translate(${x} ${y}) scale(${s})" d="M0-16Q2-2 16 0Q2 2 0 16Q-2 2-16 0Q-2-2 0-16Z"/>`;
  const journal = (x, y, rot, hl) => `<g transform="rotate(${rot} ${x + 105} ${y + 75})"><rect class="fj" x="${x}" y="${y}" width="210" height="150"/><text class="k dim" x="${x + 20}" y="${y + 36}">JOURNAL</text>${[160, 146, 166, 110].map((w, i) => `<rect class="${i === hl ? 'bg' : 'b'}" x="${x + 20}" y="${y + 58 + i * 20}" width="${w}" height="9" rx="1"/>`).join('')}</g>`;
  const FEAT = {
    'sch-memory': () => `${POOL('pl-mem', 560, 300, 300, 200, .1)}
      <text class="l" x="40" y="48">MEMORY</text><text class="s" x="680" y="48" text-anchor="end">Read it. Tell her to forget.</text>
      <path class="hr" d="M40 112H680"/><text class="l" x="40" y="152">THE FACTS</text>${bars(40, 174, [360, 250])}${eye(636, 184, 1.6)}
      <path class="hr" d="M40 238H680"/><text class="l" x="40" y="278">YOUR CORRECTIONS</text>
      <rect class="b" x="40" y="300" width="210" height="10" rx="1" opacity=".5"/><path class="st" d="M34 305H256" stroke-width="2"/><rect class="bg" x="272" y="300" width="240" height="10" rx="1" opacity=".8"/>${bars(40, 322, [300])}
      <path class="hr" d="M40 364H680"/><text class="l" x="40" y="404">UNFINISHED THREADS</text>${bars(40, 426, [280, 180])}<path class="sd" d="M330 431H470"/>
      <rect class="chip" x="536" y="388" width="144" height="46" rx="23"/><text class="k" x="608" y="418" text-anchor="middle">FORGET</text>
      ${moon(54, 508, 1.2)}<text class="s" x="80" y="515">Autonomy on: the day’s memories, sorted overnight</text>`,
    'sch-browse': () => `${POOL('pl-brw', 540, 320, 260, 200, .14)}
      <text class="l" x="40" y="48">BROWSE WITH ME</text>
      <rect class="chip on" x="570" y="20" width="110" height="42" rx="21"/>${eye(604, 41, .9)}<text class="k" x="650" y="49" text-anchor="middle">ON</text>
      <rect class="tab" x="40" y="96" width="160" height="40"/><text class="k" x="58" y="123">PAPER</text><text class="k dim" x="226" y="123">YOUTUBE</text><path class="hr" d="M40 144H680"/>
      <rect class="hl" x="34" y="240" width="300" height="20" rx="1"/><rect class="b2" x="40" y="170" width="230" height="14" rx="1"/>${bars(40, 202, [330, 316, 326, 300, 322, 310, 324, 220], 22)}
      <path class="st" d="M338 250C372 250 368 290 396 296" stroke-dasharray="4 6"/>
      <rect class="bubble" x="398" y="214" width="282" height="206"/><image href="${ICON()}" x="410" y="226" width="60" height="60"/><text class="k" x="420" y="318">TALK IT THROUGH</text>${bars(420, 342, [220, 196, 140], 22)}
      <text class="s" x="40" y="515">The eye button decides when she’s looking.</text>`,
    'sch-dream': () => `${POOL('pl-drm', 360, 440, 300, 140, .2)}
      <text class="l" x="40" y="48">DREAMS</text>${moon(648, 70, 2.2)}${star(590, 40, .55)}${star(690, 132, .45)}${star(600, 128, .35)}
      <path class="st" d="M165 205L360 452M555 213L360 452M360 315L360 452" stroke-dasharray="2 8" opacity=".8"/>
      ${journal(60, 110, -6, 1)}${journal(450, 118, 4, 2)}${journal(255, 220, -2, 3)}
      ${star(360, 454, 1.7)}<text class="s" x="360" y="522" text-anchor="middle">Old entries return in unexpected company</text>`
  };
  /* Anatomy-guided figures (kind 'fig', 2026-10-12): isometric machine drawings kept as standalone SVG files in assets/,
     shown as images so their own styles never meet the site's. Drawn concepts, labelled as graphics: not app internals
     and not model output. Built from the approved Design mockups (Main/Sera) with the dark palette only; no text inside. */

  const PROJECTS = [
    {
      id: 'scheherazade',
      title: 'Scheherazade',
      title_ko: '',
      status: 'Beta',
      headline: 'An agent for a thousand and one nights',
      summary: 'A desktop AI agent built for projects that take days or months. She keeps your facts, corrections, and unfinished threads on your own computer — so even when you switch models, you pick up right where you left off.',
      description: [
        "Built for the long haul. Days, months, one more revision: Scheherazade keeps the facts, your corrections, and unfinished threads close, so you can pick up a project without reintroducing it. A human-like memory, with one useful extra: you can read what she remembers and tell her to forget. With Autonomy on, she sorts the day's memories overnight.",
        'Bring your own brain. Your Claude subscription via Claude Code, ChatGPT via Codex, or Ollama. Change the model; keep the memories. They live on your computer, and she leaves a letter to her next self before a switch. No need to make introductions twice.',
        "Open a paper in Chrome. Take a detour through YouTube. With Browse with me switched on, she can read your current tab and talk it through with you. The eye button decides when she's looking. Even curiosity deserves an off switch.",
        'Sometimes she dreams. With Autonomy on, old journal entries return in unexpected company. She may bring you a fragment after an idle afternoon. A stray thought for your next idea, perhaps. Inspiration keeps odd hours.'
      ],
      ko: {
        status: '베타',
        headline: '천일밤을 이어가는 에이전트',
        summary: '며칠, 몇 달이 걸리는 긴 프로젝트를 함께 진행하는 데스크톱 AI 에이전트입니다. 함께 정한 사실과 피드백, 아직 끝내지 못한 일을 내 컴퓨터에 기억해 두고 두뇌(모델)를 바꿔도 하던 일을 그대로 이어갑니다.',
        description: [
          ['Scheherazade는 며칠, 몇 달이 걸리는 프로젝트를 함께 진행하는 AI입니다.\n함께 정한 내용과 아직 끝내지 못한 일을 기억하고, 다음에 만났을 때 하던 일을 이어갑니다.',
            '우리는 오래 걸리는 일을 같은 AI와 끝까지 이어가고 싶었습니다.\n바꾸는 모델 때문에 그동안 함께 쌓은 기록을 포기하지 않도록, 기억을 두뇌와 분리했습니다.'],
          'Claude·ChatGPT 구독이나 로컬 Ollama 모델을 연결해 쓰고, 두뇌를 바꿔도 기억은 내 컴퓨터에 그대로 남습니다.',
          'Browse with me를 켜면 Chrome에서 같은 탭을 보며 논문을 읽거나 자료를 놓고 함께 의논합니다.\n언제 화면을 볼지는 눈 모양 버튼으로 직접 결정할 수 있습니다.',
          [{ display: '전기양의 꿈을 꾸는 안드로이드' }, '가끔은 지난 일지 몇 조각으로 밤사이 꿈도 꿉니다.\n꿈까지 업무 보고서일 필요는 없으니까요.']
        ]
      },
      action: { label: 'Get', href: 'download.html', os: true }, /* os: Get opens the Mac / Windows / Linux chooser */
      field: 'sch',
      art: [0, 1, 2, 3],
      panels: [
        { kind: 'feat', feat: 'sch-memory', cap: 'Feature graphic · Memory', capKo: '설명 그림 · 기억', altKo: '설명 그림, 실제 앱 화면 아님: Scheherazade가 사실과 내가 고쳐 준 내용, 못 끝낸 일을 기억하고, 그 기억을 읽거나 잊게 할 수 있으며, Autonomy를 켜면 그날의 기억을 밤사이 정리하는 모습', alt: 'Feature graphic, not an app screenshot: Scheherazade keeps the facts, your corrections and unfinished threads; you can read them, tell her to forget, and with Autonomy on she sorts the day overnight' },
        { kind: 'fig', src: 'assets/sera-memory.svg', ar: 686 / 494, cap: 'Feature graphic · New model, same memories', capKo: '설명 그림 · 모델을 바꿔도, 기억은 남게', altKo: '설명 그림, 실제 앱 화면이나 내부 구조 아님: 소켓에 꽂힌 엔진 카트리지는 빼서 다른 것으로 바꿀 수 있고, 종이 기억이 든 서랍장은 본체에 붙은 채 남아 새로 꽂힌 카트리지에 같은 기억을 넘겨주는 장치', alt: 'Feature graphic, not an app screenshot or the literal internals: an engine cartridge that can be pulled from its socket and swapped, beside a cabinet of paper memories that stays in place and feeds the same memories to whichever cartridge is plugged in' },
        { kind: 'feat', feat: 'sch-browse', cap: 'Feature graphic · Browse with me', capKo: '설명 그림 · Browse with me', altKo: '설명 그림, 실제 앱 화면 아님: 브라우저 탭에 논문을 열어 두고 Scheherazade와 같이 이야기하는 모습, 그리고 언제 볼지 정하는 눈 버튼', alt: 'Feature graphic, not an app screenshot: a browser tab with a paper open beside Scheherazade talking it through, and the eye button that decides when she is looking' },
        { kind: 'feat', feat: 'sch-dream', cap: 'Feature graphic · Dreams', capKo: '설명 그림 · 꿈', altKo: '설명 그림, 실제 앱 화면 아님: 오래된 일기들이 뜻밖에 이어져 새로운 조각 하나가 되는 모습', alt: 'Feature graphic, not an app screenshot: old journal entries joined in unexpected company into a new fragment' }
      ],
      info: { kind: 'sch' }
    },
    {
      id: 'dat',
      title: 'DAT',          /* nav, menu and deck keep the project name */
      heading: 'DAT',        /* keep heading aligned with nav/rail/deck; Our Style shown in subtitle/headline */
      title_ko: 'Our Style',
      status: 'Style Model',
      headline: 'Our house style, built into a model',
      summary: 'We fine-tune open-source generative models to CHOAM’s own illustration style for character and background art — filtering out muddy generated colors and laying down a clean watercolor wash and brushwork.',
      description: ['We fine-tune open-source generative models to CHOAM’s own illustration style for character and background art — filtering out muddy generated colors and laying down a clean watercolor wash and brushwork.'],
      ko: {
        status: '자체 스타일 모델',
        headline: '우리 화풍을 직접 학습한 일러스트 모델',
        summary: '오픈소스 생성형 모델을 초암 고유의 그림체에 맞게 직접 파인튜닝해 캐릭터와 배경 리소스를 만듭니다. 기존 생성 이미지의 탁한 색감을 걷어내고 맑은 수채 질감과 붓 결을 입혀 우리만의 화풍으로 완성합니다.',
        description: ['오픈소스 생성형 모델을 초암 고유의 그림체에 맞게 직접 파인튜닝해 캐릭터와 배경 리소스를 만듭니다.\n기존 생성 이미지의 탁한 색감을 걷어내고 맑은 수채 질감과 붓 결을 입혀 우리만의 화풍으로 완성합니다.']
      },
      field: 'dat',
      reel: true, /* Our Style: the three standings together; Image Organize: the process, then a genuine comparison. */
      /* r5: real, Mino-locked Seonjam production art, shown with no names or captions (provenance lives in the r5 receipt).
         Each chain also uses other tools (Codex i2i / seedream / matting), so nothing here is presented as pure model output.
         seoa  success_cases/seoa/seoa_handsback_v2.png                     decisions.log L450
         yeji  success_cases/yeji/yeji_hero_blazer_v1.png                   decisions.log L297, LOCKED.md
         daeun success_cases/daeun/daeun_scratch_v1.png                     decisions.log L469
         kv    success_cases/group_scenes/seonjam_keyvisual_classroom_v2.png decisions.log L477, LOCKED.md
         Standings are trimmed to their alpha and scaled; nothing is retouched (scripts/gallery-art.py). */
      panels: [
        { kind: 'gallery', cut: true, items: [
          { src: 'assets/dat-g-seoa.webp', ar: 444 / 1300, alt: 'Character art: a girl with long silver hair in a navy sailor uniform, standing with her hands behind her back', altKo: '캐릭터 일러스트: 긴 은발에 남색 세일러 교복을 입고 뒷짐 진 채 서 있는 소녀' },
          { src: 'assets/dat-g-yeji.webp', ar: 461 / 1300, alt: 'Character art: a girl with long dark hair in a dark blazer, looking back over her shoulder', altKo: '캐릭터 일러스트: 긴 흑발에 짙은 블레이저 차림으로 어깨 너머 돌아보는 소녀' },
          { src: 'assets/dat-g-daeun.webp', ar: 408 / 1300, alt: 'Character art: a girl with short red hair in a sailor uniform, scratching her head', altKo: '캐릭터 일러스트: 짧은 빨간 머리에 세일러 교복 차림으로 머리를 긁는 소녀' }
        ] },
        /* The classroom is removed only from this display; its asset and all other uses stay intact. */
        /* 2026-10-12 (Mino 12:29): how DAT is used, drawn as a machine, then one real before/after kept apart from it.
           Concept: GPT Image's muddy colouring filtered out and a watercolour wash added (Mino's description).
           Real pair: Donguri Ryokan shrine-leaf cut, 2026-10-11, GPT Image original and the DAT pass Mino picked, both full frame
           at the same scale (scripts/build_assets.py). One scene, not a claim that every error is fixed. */
        { kind: 'fig', src: 'assets/dat-machine.svg', ar: 1039 / 573, cap: 'Feature graphic · How DAT works', capKo: '설명 그림 · DAT가 하는 일', alt: 'Feature graphic, not actual output: muddy pictures ride a conveyor through a filter that catches the harsh colour, pass under a roller that lays a light watercolour wash, and stack up on the right', altKo: '설명 그림, 실제 결과 아님: 탁한 그림이 컨베이어를 타고 거친 색을 거르는 필터를 지나, 롤러 아래에서 옅은 수채 워시를 입고 오른쪽에 쌓이는 기계' },
        { kind: 'compare', alt: 'Actual output: one Donguri Ryokan scene before and after DAT, same size and framing', altKo: '실제 결과: 동구리 료칸 한 장면의 DAT 적용 전과 후, 같은 크기와 구도',
          items: [
            { src: 'assets/dat-case-original.webp', ar: 2048 / 1360, name: 'GPT Image original', nameKo: 'GPT Image 원본', alt: 'GPT Image original: two fox girls in kimono at a mountain shrine at sunset, one holding up a leaf, the other lying by a wooden box with a cup', altKo: 'GPT Image 원본: 노을 진 산속 신사에서 한 명은 나뭇잎을 들고, 한 명은 나무 상자 곁에 엎드려 잔을 든 기모노 차림의 여우 소녀 둘' },
            { src: 'assets/dat-case-dat.webp', ar: 2048 / 1360, name: 'After DAT', nameKo: 'DAT 적용 후', alt: 'The same scene after DAT: smoother brushwork in the hair and clothing, with some costume and accessory details redrawn', altKo: '같은 장면에 DAT를 적용한 결과: 머리카락과 옷의 붓 결이 더 매끈해지고, 의상과 장신구 일부가 다시 그려짐' }
          ] }
      ],
      comparisons: [
        { id: 'shrine', label: 'Shrine leaf', labelKo: '신사 · 나뭇잎', beforeLabel: 'GPT Image', beforeLabelKo: 'GPT Image 원본', before: 'assets/dat-case-original.webp', after: 'assets/dat-case-dat.webp', width: 1536, height: 1020,
          note: 'DAT 0.15 · Brush texture changes, with some costume and accessory details redrawn.', noteKo: 'DAT 0.15 · 붓 결이 달라지고, 의상과 장신구 일부도 바뀐 장면입니다.' },
        { id: 'classroom', label: 'Classroom', labelKo: '교실', before: 'assets/dat_classroom_before.png', after: 'assets/dat_classroom_after.png', width: 1672, height: 936, detailPoint: [.25, .78],
          note: 'DAT 0.15 · Original 1672×941, shared view 1672×936: 2 px above and 3 px below trimmed, no stretching. Ornament shapes also change.', noteKo: 'DAT 0.15 · 원본 1672×941 → 비교 1672×936. 위 2px와 아래 3px만 제외하고 같은 배율로 보여주며, 장신구 모양도 일부 달라집니다.' },
        { id: 'idea', label: 'IDEA', labelKo: 'IDEA', beforeLabel: 'GPT Image', beforeLabelKo: 'GPT Image 원본', before: 'assets/dat_v11_idea_before.png', after: 'assets/dat_v11_idea_after.png', width: 928, height: 1136, detailPoint: [.7, .74],
          note: 'DAT 0.15 · The left, black-haired IDEA, cropped to the identical 928×1136 region. Hair ornaments, jewelry and textile details also change.', noteKo: 'DAT 0.15 · 왼쪽 흑발 IDEA를 같은 위치의 928×1136 영역으로 잘라 비교한 화면입니다. 머리 장식과 장신구, 옷의 세부 모양도 함께 다듬어집니다.' }
      ],
      info: { kind: 'dat' }
    },
    {
      id: 'seonjam',
      title: '선잠 DOZE',
      status: 'In development',
      headline: 'She remembers what you said',
      summary: 'A visual novel set in the local-history club of an old school building, where you talk to Yeji in your own words. She records your conversations in her diary and carries what you said into the next day.',
      description: [
        'A visual novel set in the local-history club of an old school building. After class, Yeji sorts rosters and old photos by the window.',
        'You talk to her in your own words, and she carries what you said into the next day. Over one week, small things stop adding up.'
      ],
      ko: {
        status: '개발 중',
        headline: '대화로 만들어가는 인터랙티브 무비',
        summary: '구교사 2층 향토연구부 부실에서 예지와 직접 말을 주고받으며 진행하는 미연시입니다. 플레이어가 건넨 말은 일기로 남고, 다음 날 예지의 기분과 태도가 그 기억을 따라 조금씩 달라집니다.',
        description: [
          '선잠은 예지와 직접 대화하며 진행하는 미연시입니다.\n플레이어가 자기 말로 말을 건네면, 예지는 자신의 성격과 지난 대화를 바탕으로 대답합니다.',
          ['예지는 대화를 일기로 남기고, 다음 만남에서는 그 기록에 따라 기분과 태도가 달라집니다.\n긴 대화 속에서도 예지가 끝까지 예지답게 남도록, AI의 기억과 성격을 게임에 가져왔습니다.',
            '예지가 기다리고 있는 곳은 구교사 2층, 향토연구부 부실입니다.']
        ]
      },
      art: [2, 0],
      panels: [
        { kind: 'art', src: 'assets/seonjam-01.webp', altKo: '선잠 DOZE 일러스트: 먼 벽이 깊고 푸른 수족관으로 열린 교실에 혼자 선 소녀', alt: '선잠 DOZE illustration: a girl standing alone in a classroom whose far wall opens onto a deep blue aquarium', pos: '50% 50%', posM: '74% 50%' },
        { kind: 'raw', src: 'assets/seonjam-02.webp', altKo: '선잠 DOZE 게임 타이틀 화면: 어두운 교실에서 교복 입은 소녀 다섯이 타이틀과 시작 메뉴 옆에 있는 모습', alt: '선잠 DOZE in-game title screen: five girls in school uniform in a dark classroom beside the title and the start menu', pos: '50% 50%', posM: '12% 50%', lift: 0 },
        { kind: 'art', src: 'assets/seonjam-03.webp', altKo: '선잠 DOZE 일러스트: 고래상어가 지나가는 수족관 벽 앞 교실에서 돌아보는 예지', alt: '선잠 DOZE illustration: Yeji looking back in a classroom whose far wall is an aquarium with a passing whale shark', pos: '50% 50%', posM: '66% 50%' }
      ],
      info: { kind: 'art', src: 'assets/seonjam-03.webp', pos: '50% 50%', posM: '66% 50%', side: 'end' }
    },
    {
      id: 'donguri-ryokan',
      title: 'Donguri Ryokan',
      title_ko: '동구리 료칸',
      status: 'Coming soon',
      headline: 'Not every guest is human',
      summary: 'Three fox spirits borrow money from a tanuki to turn their forgotten mountain shrine into a hot-spring inn. Over 100 days you farm, cook, and run the rooms — while spotting the yokai passing as human guests.',
      description: [
        'Three fox spirits borrow money from a tanuki to turn their forgotten mountain shrine into a hot-spring inn. Over 100 days you farm, cook, lay the spring pipes and ready the rooms.',
        'Some guests are yokai passing as human. Read their requests, ask around, and make your call at checkout.'
      ],
      ko: {
        status: '출시 준비 중',
        headline: '고요한 숲속 여관 이야기',
        summary: '발길이 끊긴 산속 신사의 여우 신들이 너구리에게 빚을 내 온천 료칸을 엽니다. 100일 동안 밭을 일구고 요리와 객실을 돌보는 와중에, 손님들의 행동을 살펴 인간으로 둔갑한 요괴를 가려내야 합니다.',
        description: [
          ['동구리 료칸은 밭일과 요리, 숙박업에 요괴 추리를 더한 경영 게임입니다.\n발길이 끊긴 산속 신사의 여우 신들이 너구리에게 빚을 내 온천 료칸을 엽니다.',
            '하루 안에 경영과 추리가 쉼 없이 이어지는, 손이 바쁜 게임을 만들고 싶었습니다.'],
          '플레이어는 직접 재료를 구하고 음식을 만들며, 객실과 온천도 관리합니다.\n그 와중에 손님의 행동을 유심히 살펴 누가 요괴인지 체크아웃 전까지 알아내야 합니다.'
        ]
      },
      art: [0, 1],
      panels: [
        { kind: 'art', src: 'assets/ryokan_kv_C2.webp', altKo: 'Donguri Ryokan 키 아트: 기모노를 입은 여우 소녀와 너구리 소녀가 밤 툇마루에서 불 켜진 장지문 뒤 그림자를 엿보는 모습', alt: 'Donguri Ryokan key art: fox and tanuki girls in kimono on a night veranda, peering at a silhouette behind a lit shoji screen', pos: '50% 30%', posM: '47% 50%' },
        { kind: 'art', src: 'assets/ryokan_kv_B2.webp', altKo: 'Donguri Ryokan 키 아트: 밤의 다다미방에서 종이 등불과 펼친 장부를 두고 낮은 상에 둘러앉은 여우 소녀와 너구리 소녀', alt: 'Donguri Ryokan key art: fox and tanuki girls around a low table in a tatami room at night, with a paper lantern and an open ledger', pos: '50% 40%', posM: '56% 50%' }
      ],
      info: { kind: 'art', src: 'assets/ryokan_kv_C2.webp', pos: '50% 30%', posM: '47% 50%' }
    },
    {
      id: 'donguri-restaurant',
      title: 'Donguri Restaurant',
      title_ko: '동구리 레스토랑',
      status: 'On the web',
      headline: 'No menu. The field decides.',
      summary: 'A small forest restaurant management game where the daily omakase comes straight from your garden. Read the reservation board, harvest what the field gives, and build each course and wine pairing around it.',
      description: [
        'A small forest restaurant run by a chef, a sommelier and a part-timer.',
        'Read the reservation board, plant for the guests who are coming, harvest what the field gives, and build each course and wine pairing around it.',
        'One season, four weeks. Plays in the browser.'
      ],
      ko: {
        status: '웹에서 플레이',
        headline: 'Self Made Restaurant',
        summary: '텃밭에서 직접 기른 재료로 그날의 오마카세 코스를 내는 작은 숲속 레스토랑 경영 게임입니다. 예약판을 확인해 작물을 심고, 수확한 재료에 맞춰 코스와 와인 페어링을 구성해 손님에게 대접합니다.',
        description: [
          '동구리 레스토랑은 텃밭에서 기른 재료로 오마카세를 내는 레스토랑 경영 게임입니다.\n그날 수확한 재료로 코스를 정하고, 손질과 조리를 거쳐 손님에게 대접합니다.\n손님은 메뉴를 받기 전까지 무엇을 먹게 될지 모릅니다.',
          '플레이어는 셰프, 소믈리에와 함께 일하는 단기 아르바이트생이 되어 한 철(4주) 동안 작은 가게를 꾸려 나갑니다.',
          '직접 채소를 기르며 작은 레스토랑을 운영하고 싶다는 은퇴 계획에서 시작했습니다.\n별 셋을 받으면 좋고, 아니어도 괜찮은 레스토랑입니다.'
        ]
      },
      art: [0, 2, 3], /* key art, then in-game captures framed beside the copy so game UI never meets site UI */
      action: { label: 'Play', href: 'https://donguri.run' },
      panels: [
        { kind: 'art', src: 'assets/restaurant-01.webp', altKo: 'Donguri Restaurant 키 아트: 레스토랑 로고 옆에 셰프, 소믈리에, 아르바이트생이 함께 몸을 기울인 모습', alt: 'Donguri Restaurant key art: the chef, the sommelier and the part-timer leaning in together beside the restaurant logo', pos: '100% 30%', posM: '50% 50%' },
        { kind: 'raw', src: 'assets/restaurant-02.webp', ar: 1920 / 1080, cap: 'In-game capture · Opening night', capKo: '게임 화면 · 개업 첫날 밤', altKo: 'Donguri Restaurant 플레이 화면: 개업 첫날 밤 대화 중 마당에 선 세 직원', alt: 'Donguri Restaurant gameplay: the three staff standing in the yard at night during the opening dialogue', pos: '50% 50%', posM: '50% 50%', lift: 0.29 },
        { kind: 'raw', src: 'assets/restaurant-03.webp', ar: 1280 / 720, cap: 'In-game capture · Reservation board', capKo: '게임 화면 · 예약판', altKo: 'Donguri Restaurant 플레이 화면: 레스토랑 마당과 밭, 첫날 밤 손님이 적힌 예약판', alt: 'Donguri Restaurant gameplay: the restaurant yard and field, with the reservation board listing the first night’s guests', pos: '50% 50%', posM: '42% 50%', lift: 0.33 },
        { kind: 'raw', src: 'assets/restaurant-04.webp', ar: 1280 / 800, cap: 'In-game capture · Tonight’s course', capKo: '게임 화면 · 오늘 밤 코스', altKo: 'Donguri Restaurant 플레이 화면: 오늘 저녁 코스 메뉴가 요리별로 놓인 주방', alt: 'Donguri Restaurant gameplay: the kitchen with the evening’s course menu laid out dish by dish', pos: '50% 0%', posM: '50% 50%', lift: 0 }
      ],
      info: { kind: 'art', src: 'assets/restaurant-01.webp', pos: '50% 30%', posM: '62% 50%' }
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

  /* ---------- language (every page): English unless this browser chose Korean. The <head> of each page reads
     localStorage before paint and sets <html lang>; this keeps the copy, labels and the picker in step with it.
     Product names, CULTURE MUST FLOW and the copyright line stay as written in both languages. ---------- */
  const LANG_KEY = 'choam-lang';
  const html = document.documentElement;
  let lang = html.lang === 'ko' ? 'ko' : 'en';
  const ko = () => lang === 'ko';
  const tr = (p, f) => (ko() && p.ko && p.ko[f] != null ? p.ko[f] : p[f]);
  const ACT_KO = { Get: '받기', Play: '플레이' };
  /* static text and labels already in the HTML: [selector, attribute or '' for text, Korean] */
  const UI_KO = [
    ['.brand', 'aria-label', 'CHOAM 홈'],
    ['.menu-btn', '', '프로젝트'],
    ['.proj-nav', 'aria-label', '프로젝트'],
    ['.intro-meta span:nth-child(1)', '', '스튜디오'],
    ['.intro-meta span:nth-child(2)', '', '서울'],
    ['.intro-meta span:nth-child(3)', '', '2026년 설립'],
    ['.intro-next span', '', '프로젝트'],
    ['[data-next-label]', '', '다음'],
    ['.intro-clock [data-city]', '', '서울'],
    ['main.track[aria-label="Ours"]', 'aria-label', '프로젝트'],
    ['[data-segments]', 'aria-label', '페이지'],
    ['[data-prev]', '', '이전'],
    ['[data-next]', '', '다음'],
    ['[data-details]', '', '자세히'],
    ['.foot a', '', '문의'],
    ['.dl .sch-icon', 'alt', 'Scheherazade 앱 아이콘'],
    ['.dl .cap-meta span:first-child', '', '베타'],
    ['.dl .cap-line', '', PROJECTS[0].ko.headline],
    ['.dlbtn[data-os="mac"] small', '', 'Apple 실리콘'],
    ['.dlbtn[data-os="win"] small', '', '설치 파일'],
    ['.dl-note [data-note]', '', 'Claude·ChatGPT 구독이나 Ollama 모델을 연결해 쓰고, 두뇌를 바꿔도 기억은 남습니다'],
    ['.dl-note a', '', '전체 릴리스']
  ].flatMap(([sel, attr, k]) => [...document.querySelectorAll(sel)].map(el => ({ el, attr, k, en: attr ? el.getAttribute(attr) : el.textContent })));
  const TITLE_KO = { 'Get Scheherazade | CHOAM': 'Scheherazade 받기 | CHOAM', 'Our Philosophy | CHOAM': '초암의 철학 | CHOAM' };
  const titleEn = document.title;
  const relabel = []; /* the gallery adds its own relabelling below */

  const mast = document.querySelector('.mast');
  const picker = document.createElement('div');
  picker.className = 'lang';
  picker.innerHTML = `<button class="lang-btn" type="button" data-lang-toggle aria-controls="lang-menu" aria-expanded="false"><span class="sr-only" data-lang-name></span><span data-lang-cur></span></button>
    <ul class="lang-menu" id="lang-menu">
      <li><button class="lang-opt" type="button" data-set-lang="ko" lang="ko">한국어<b>KR</b></button></li>
      <li><button class="lang-opt" type="button" data-set-lang="en" lang="en">English<b>ENG</b></button></li>
    </ul>`;
  if (mast) mast.appendChild(picker); /* added by script so a page without it never shows a switch that does nothing */
  const langBtn = picker.querySelector('[data-lang-toggle]');
  const opts = [...picker.querySelectorAll('[data-set-lang]')];

  const applyLang = (next, save) => {
    lang = next === 'ko' ? 'ko' : 'en';
    html.lang = lang;
    UI_KO.forEach(({ el, attr, k, en }) => { const v = ko() ? k : en; if (attr) el.setAttribute(attr, v); else el.textContent = v; });
    document.title = ko() ? TITLE_KO[titleEn] || titleEn : titleEn;
    picker.querySelector('[data-lang-name]').textContent = ko() ? '언어 ' : 'Language ';
    picker.querySelector('[data-lang-cur]').textContent = ko() ? 'KR' : 'ENG';
    opts.forEach(o => { if (o.dataset.setLang === lang) o.setAttribute('aria-current', 'true'); else o.removeAttribute('aria-current'); });
    relabel.forEach(f => f());
    if (save) try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage blocked: this page still switches */ }
  };
  const langOpen = () => body.classList.contains('lang-open');
  const setLangMenu = (open, focusBtn) => {
    if (open) setMenu(false);
    body.classList.toggle('lang-open', open);
    langBtn.setAttribute('aria-expanded', String(open));
    if (open) (opts.find(o => o.dataset.setLang === lang) || opts[0]).focus();
    else if (focusBtn) langBtn.focus();
  };
  langBtn.addEventListener('click', () => setLangMenu(!langOpen()));
  opts.forEach(o => o.addEventListener('click', () => { applyLang(o.dataset.setLang, true); setLangMenu(false, true); }));
  picker.addEventListener('keydown', e => {
    if (!langOpen() || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    const i = opts.indexOf(document.activeElement);
    opts[(i + (e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length].focus();
  });
  picker.addEventListener('focusout', e => { if (langOpen() && !picker.contains(e.relatedTarget)) setLangMenu(false); });
  document.addEventListener('click', e => { if (langOpen() && !picker.contains(e.target)) setLangMenu(false); });
  /* back/forward from a page where the language changed: the cached page catches up */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    let saved = null; try { saved = localStorage.getItem(LANG_KEY); } catch (err) { /* blocked */ }
    if (saved && saved !== lang) applyLang(saved, false);
  });

  /* ---------- project menu (every page) ---------- */
  document.querySelectorAll('[data-projects]').forEach(list => {
    list.innerHTML = PROJECTS.map(p => {
      const href = !track ? url(`index.html#${p.id}/1`) : only ? pageOf(p) : `#${p.id}/1`;
      return `<li><a class="proj" href="${href}" data-go-project="${p.id}">${esc(p.title)}</a></li>`;
    }).join('');
  });
  /* Our Philosophy (every page): one link in the masthead, and the same link at the foot of the Projects panel for
     screens too narrow to hold it in the masthead (style.css shows exactly one of the two at any width). */
  const onPhilo = body.dataset.page === 'philosophy';
  const philoLinks = [];
  if (mast) {
    const mk = cls => {
      const a = document.createElement('a');
      a.className = cls; a.href = url('philosophy.html');
      if (onPhilo) { a.classList.add('is-current'); a.setAttribute('aria-current', 'page'); }
      philoLinks.push(a); return a;
    };
    mast.insertBefore(mk('philo-link'), picker);
    document.querySelectorAll('[data-menu]').forEach(nav => nav.appendChild(mk('philo-row')));
  }
  /* the Korean / English choice set on the philosophy page itself; same setting as the masthead picker */
  const pageLangs = [...document.querySelectorAll('[data-page-lang]')];
  pageLangs.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.pageLang, true)));
  relabel.push(() => {
    philoLinks.forEach(a => { a.textContent = ko() ? '초암의 철학' : 'Our Philosophy'; });
    pageLangs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pageLang === lang)));
    document.querySelectorAll('[data-philo-langs]').forEach(g => g.setAttribute('aria-label', ko() ? '언어' : 'Language'));
  });
  const toggles = [...document.querySelectorAll('[data-menu-toggle]')];
  function setMenu(open) {
    if (open && langOpen()) setLangMenu(false);
    body.classList.toggle('menu-open', open);
    toggles.forEach(t => t.setAttribute('aria-expanded', String(open)));
    if (open) { const first = document.querySelector('[data-menu] .proj'); first && first.focus(); }
    wake();
  }
  toggles.forEach(t => t.addEventListener('click', () => setMenu(!body.classList.contains('menu-open'))));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (langOpen()) setLangMenu(false, true);
    else if (body.classList.contains('menu-open')) { setMenu(false); toggles[0] && toggles[0].focus(); }
    else if (getOpen) setGet(getOpen, false, true);
  });

  /* ---------- Scheherazade installers (download page and the Get chooser) ----------
     Every link starts on the latest release page. The public latest-release API is read once, only when the chooser is first
     opened or the download page is shown, and a link moves to an installer only if that release holds a file of exactly that
     platform's name; otherwise (no answer, rate limit, renamed file) it stays on the release page. Version numbers are never
     written here: releases/latest/download/<file> needs the versioned name, so the name comes from the release itself.
     The browser's OS only marks one choice as recommended; nothing downloads until a person picks one. */
  const REL_REPO = 'https://github.com/Mino-is-me/scheherazade-releases';
  const REL_PAGE = `${REL_REPO}/releases/latest`;
  const REL_API = 'https://api.github.com/repos/Mino-is-me/scheherazade-releases/releases/latest';
  const OSES = [
    { os: 'mac', name: 'Mac', detail: 'Apple silicon', detailKo: 'Apple 실리콘', file: /^Scheherazade-[^/]+-arm64\.dmg$/ },
    { os: 'win', name: 'Windows', detail: 'Installer', detailKo: '설치 파일', file: /^Scheherazade-Setup-[^/]+\.exe$/ },
    { os: 'linux', name: 'Linux', detail: 'x86_64 AppImage', detailKo: 'x86_64 AppImage', file: /^Scheherazade-[^/]+-x86_64\.AppImage$/ }
  ];
  /* phones, tablets and ChromeOS get no recommendation: none of these installers runs there */
  const myOS = (() => {
    const n = navigator, ua = (n.userAgent || '').toLowerCase();
    const pf = ((n.userAgentData && n.userAgentData.platform) || n.platform || '').toLowerCase();
    if (/android|iphone|ipad|ipod|cros/.test(ua) || /android|chrome os|ios/.test(pf) || (/mac/.test(pf) && n.maxTouchPoints > 1)) return '';
    if (/^win/.test(pf) || /windows nt/.test(ua)) return 'win';
    if (/mac/.test(pf) || /mac os x/.test(ua)) return 'mac';
    if (/linux/.test(pf) || /linux/.test(ua)) return 'linux';
    return '';
  })();
  const rel = { state: 'idle', tag: '', urls: {} }; /* idle -> loading -> ok | failed */
  const relViews = new Set();                         /* containers whose [data-rel-os] links follow the release */
  const labelRel = root => {
    root.querySelectorAll('[data-rel-os]').forEach(a => {
      const o = OSES.find(x => x.os === a.dataset.relOs), d = a.querySelector('[data-os-detail]'), rec = a.querySelector('[data-os-rec]');
      a.href = rel.urls[o.os] || REL_PAGE;
      if (d) d.textContent = ko() ? o.detailKo : o.detail;
      a.classList.toggle('is-rec', o.os === myOS);
      if (rec) { rec.hidden = o.os !== myOS; rec.textContent = ko() ? '추천' : 'Recommended'; }
    });
    root.querySelectorAll('[data-rel-ver]').forEach(el => { el.textContent = rel.tag; });
    root.querySelectorAll('[data-rel-note]').forEach(el => {
      el.hidden = rel.state !== 'failed';
      el.textContent = ko() ? 'GitHub에 연결하지 못해 각 버튼이 릴리스 페이지로 이동합니다' : 'GitHub didn’t answer, so each choice opens the latest release page.';
    });
  };
  const loadRel = () => {
    if (rel.state !== 'idle') return;
    rel.state = 'loading';
    const ctl = 'AbortController' in window ? new AbortController() : null, stop = ctl && setTimeout(() => ctl.abort(), 10000);
    fetch(REL_API, ctl ? { signal: ctl.signal } : {})
      .then(r => { if (!r.ok) throw new Error(`GitHub ${r.status}`); return r.json(); })
      .then(data => {
        const assets = Array.isArray(data.assets) ? data.assets : [];
        OSES.forEach(o => {
          const a = assets.find(x => x && o.file.test(x.name) && (!x.state || x.state === 'uploaded') && typeof x.browser_download_url === 'string'
            && x.browser_download_url.startsWith(`${REL_REPO}/releases/download/`) && x.browser_download_url.endsWith(`/${x.name}`));
          if (a) rel.urls[o.os] = a.browser_download_url;
        });
        rel.tag = typeof data.tag_name === 'string' ? data.tag_name : '';
        rel.state = 'ok';
      })
      .catch(() => { rel.state = 'failed'; rel.urls = {}; })
      .finally(() => { clearTimeout(stop); relViews.forEach(labelRel); });
  };
  relabel.push(() => relViews.forEach(labelRel));

  /* the download page is the chooser itself: its three buttons follow the release as soon as it is shown */
  const dlBtns = document.querySelector('.dl-btns');
  if (dlBtns) {
    dlBtns.querySelectorAll('.dlbtn[data-os]').forEach(a => {
      a.dataset.relOs = a.dataset.os;
      (a.querySelector('small') || a).insertAdjacentHTML(a.querySelector('small') ? 'beforebegin' : 'beforeend', '<em class="os-rec" data-os-rec hidden></em>');
    });
    relViews.add(document.querySelector('.dl-body'));
    loadRel();
  }

  /* Get chooser (a disclosure: Get, then three ordinary links). Plain clicks open it; a modified click or no script still
     follows Get's own link to the download page. Arrow keys move between choices, Escape closes and returns to Get. */
  let getOpen = null; /* the open chooser's .get-wrap */
  const getOpts = wrap => [...wrap.querySelectorAll('.get-opt')];
  function setGet(wrap, open, focusBtn) {
    const btn = wrap.querySelector('.prod-act'), menu = wrap.querySelector('.get-menu');
    if (open) {
      if (getOpen && getOpen !== wrap) setGet(getOpen, false);
      if (langOpen()) setLangMenu(false);
      if (body.classList.contains('menu-open')) setMenu(false);
      loadRel();
      labelRel(menu);
    }
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    getOpen = open ? wrap : getOpen === wrap ? null : getOpen;
    if (open) (getOpts(wrap).find(a => a.classList.contains('is-rec')) || getOpts(wrap)[0]).focus();
    else if (focusBtn) btn.focus();
  }
  const getMenuHTML = id => `<div class="get-menu" id="get-${id}" hidden>
      <p class="get-head"><span data-get-head></span><span data-rel-ver></span></p>
      <ul>${OSES.map(o => `<li><a class="lang-opt get-opt" data-rel-os="${o.os}" href="${REL_PAGE}"><span>${o.name}<em class="os-rec" data-os-rec hidden></em></span><b data-os-detail></b></a></li>`).join('')}</ul>
      <p class="get-note" data-rel-note hidden></p>
    </div>`;
  const wireGet = wrap => {
    const btn = wrap.querySelector('.prod-act');
    relViews.add(wrap.querySelector('.get-menu'));
    btn.addEventListener('click', e => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; /* new tab / window: the download page */
      e.preventDefault();
      setGet(wrap, btn.getAttribute('aria-expanded') !== 'true');
    });
    wrap.addEventListener('keydown', e => {
      if (getOpen !== wrap) return;
      const opts = getOpts(wrap), i = opts.indexOf(document.activeElement);
      const to = e.key === 'ArrowDown' ? (i + 1) % opts.length : e.key === 'ArrowUp' ? (i < 0 ? opts.length - 1 : (i + opts.length - 1) % opts.length)
        : e.key === 'Home' ? 0 : e.key === 'End' ? opts.length - 1 : -1;
      if (to < 0) return;
      e.preventDefault(); e.stopPropagation();
      opts[to].focus();
    });
    getOpts(wrap).forEach(a => a.addEventListener('click', () => setGet(wrap, false, true))); /* the link still navigates */
    wrap.addEventListener('focusout', e => { if (getOpen === wrap && e.relatedTarget && !wrap.contains(e.relatedTarget)) setGet(wrap, false); });
  };
  document.addEventListener('click', e => { if (getOpen && !getOpen.contains(e.target)) setGet(getOpen, false); });
  applyLang(lang, false);

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

  /* ---------- landing (2026-10-13, Mino): one plate per project and an index rail on the left, the format of the
     choam-landing.html mockup. The opening above is untouched. Copy is the first sentence (EN) or first line (KO) of each
     project's existing description; artwork is each project's current first picture. Project pages keep the stepped
     sections further down. ---------- */
  if (!only) {
    const intro = document.querySelector('.intro');
    const firstText = d => (typeof d === 'string' ? d : Array.isArray(d) ? firstText(d.find(x => typeof x === 'string') || '') : '');
    const lineOf = p => {
      const sum = tr(p, 'summary');
      if (sum) return sum;
      const s = firstText([].concat(tr(p, 'description'))[0]);
      return ko() ? s.split('\n')[0] : (s.match(/^.*?[.!?](?=\s|$)/) || [s])[0];
    };
    const altOf = o => (ko() && o.altKo) || o.alt;
    const actHTML = p => {
      const act = p.action; if (!act) return '';
      return act.os ? `<span class="get-wrap"><a class="prod-act" href="${url(act.href)}" aria-expanded="false" aria-controls="get-${p.id}"></a>${getMenuHTML(p.id)}</span>`
        : `<a class="prod-act" href="${url(act.href)}"${/^https?:/.test(act.href) ? ' target="_blank" rel="noopener"' : ''}></a>`;
    };
    const castOf = p => p.panels.find(s => s.kind === 'gallery');
    const pairOf = p => p.comparisons && p.comparisons[0]; /* the default pair the live DAT section opens on */
    const stageHTML = p => {
      if (p.field === 'sch') return `<div class="stage"><div class="field sch-field" aria-hidden="true"></div>
          <figure class="figure" aria-hidden="true"><img src="${url('assets/sera-mark.webp')}" alt="" loading="lazy" decoding="async"></figure></div>`;
      if (p.field === 'dat') {
        const cast = castOf(p), c = pairOf(p);
        return `<div class="stage">
          <div class="flip" data-flip tabindex="0">
            <section class="slide"><div class="field dat-field" aria-hidden="true"></div>
              <div class="plate-cast" role="group">${cast.items.map(it => `<img src="${url(it.src)}" alt="" draggable="false" loading="lazy" decoding="async">`).join('')}</div>
              <button class="flip-nav flip-next" type="button" data-flip-to="1"><span aria-hidden="true"></span></button>
            </section>
            <section class="slide"><div class="field dat-field" aria-hidden="true"></div>
              <div class="compare-stage">
                <div class="compare" data-compare style="--split:50%">
                  <img class="cmp-after" src="${url(c.after)}" alt="" draggable="false" loading="lazy" decoding="async">
                  <img class="cmp-before" src="${url(c.before)}" alt="" draggable="false" loading="lazy" decoding="async">
                  <div class="scrim" aria-hidden="true"></div>
                  <span class="cmp-tag cmp-tag-b" aria-hidden="true">BEFORE</span><span class="cmp-tag cmp-tag-a" aria-hidden="true">AFTER</span>
                  <span class="cmp-line" aria-hidden="true"></span>
                  <input class="cmp-range" type="range" min="0" max="100" step="1" value="50" data-compare-range>
                </div>
              </div>
              <button class="flip-nav flip-prev" type="button" data-flip-to="0"><span aria-hidden="true"></span></button>
            </section>
          </div></div>`;
      }
      const a = p.panels[p.art[0]];
      return `<div class="stage"><img class="art" src="${url(a.src)}" alt="" style="--pos:${a.pos};--pos-m:${a.posM || a.pos}" loading="lazy" decoding="async"><div class="scrim" aria-hidden="true"></div></div>`;
    };
    track.classList.add('plates');
    track.removeAttribute('aria-roledescription');
    track.innerHTML = PROJECTS.map(p => `
    <article class="plate" id="${p.id}" data-plate="${p.id}" aria-labelledby="t-${p.id}">
      ${stageHTML(p)}
      <div class="caption">
        <p class="cap-meta"><span class="num">${numOf(p)}</span>${p.status ? '<span class="status" data-status></span>' : ''}</p>
        <h2 class="cap-title" id="t-${p.id}"><a href="${pageOf(p)}">${esc(p.heading || p.title)}</a>${p.title_ko ? `<span class="cap-ko" lang="ko">${esc(p.title_ko)}</span>` : ''}</h2>
        <p class="cap-line"></p>
        <p class="cap-text"></p>
        ${p.field === 'dat' ? '<div class="flip-tabs" data-flip-marks role="group"><button type="button" class="flip-pill is-on" data-flip-to="0"></button><button type="button" class="flip-pill" data-flip-to="1"></button></div>' : ''}
        <div class="cap-acts"><a class="plate-more" href="${pageOf(p)}"></a>${actHTML(p)}</div>
      </div>
    </article>`).join('');
    const plates = [...track.querySelectorAll('.plate')];
    track.querySelectorAll('.get-wrap').forEach(wireGet);

    /* the index rail: 00 is the opening, then one line per project; shown once the opening has scrolled away */
    const rail = document.createElement('nav');
    rail.className = 'index-rail';
    rail.innerHTML = `<ol>${[{ id: 'top', n: '00' }, ...PROJECTS.map(p => ({ id: p.id, n: numOf(p), p }))].map(r =>
      `<li><a href="#${r.id}" data-index-link="${r.id}"><i aria-hidden="true"></i><b>${r.n}</b><span>${r.p ? esc(r.p.title) : ''}</span></a></li>`).join('')}</ol>`;
    track.before(rail);
    const links = [...rail.querySelectorAll('[data-index-link]')];
    document.querySelectorAll('[data-go-project]').forEach(a => { a.href = `#${a.dataset.goProject}`; });

    /* DAT: the cast, then one real before / after pair, side by side on one plate */
    const datPlate = plates.find(el => el.id === 'dat');
    const flip = datPlate.querySelector('[data-flip]'), fSlides = [...flip.querySelectorAll('.slide')];
    const marks = [...datPlate.querySelectorAll('[data-flip-marks] button')];
    const box = datPlate.querySelector('[data-compare]'), range = box.querySelector('[data-compare-range]');
    const at = () => (flip.clientWidth ? Math.round(flip.scrollLeft / flip.clientWidth) : 0);
    const flipTo = (k, instant) => flip.scrollTo({ left: Math.max(0, Math.min(fSlides.length - 1, k)) * flip.clientWidth, behavior: instant ? 'instant' : behavior() });
    const markFlip = () => {
      const k = at();
      marks.forEach((s, i) => { s.classList.toggle('is-on', i === k); s.setAttribute('aria-pressed', String(i === k)); });
      fSlides.forEach((s, i) => { s.inert = i !== k; s.classList.toggle('is-on', i === k); });
    };
    flip.addEventListener('scroll', markFlip, { passive: true });
    flip.addEventListener('dragstart', e => e.preventDefault());
    flip.addEventListener('keydown', e => {
      if (e.target.closest('[data-compare]')) return; /* the range keeps its own arrow keys */
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); flipTo(at() + (e.key === 'ArrowRight' ? 1 : -1)); }
    });
    let down = null;
    datPlate.addEventListener('pointerdown', e => { down = e.pointerType === 'mouse' && !e.target.closest('[data-compare], button, a') ? e.clientX : null; });
    addEventListener('pointerup', e => { if (down === null) return; const dx = e.clientX - down; down = null; if (Math.abs(dx) > 40) flipTo(at() + (dx < 0 ? 1 : -1)); });
    datPlate.addEventListener('pointercancel', () => { down = null; });
    datPlate.querySelectorAll('[data-flip-to]').forEach(b => b.addEventListener('click', () => flipTo(Number(b.dataset.flipTo))));
    const split = v => { v = Math.max(0, Math.min(100, v)); box.style.setProperty('--split', `${v}%`); range.value = String(Math.round(v)); };
    box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); if (r.width) split((e.clientX - r.left) / r.width * 100); });
    range.addEventListener('input', () => split(Number(range.value)));
    new ResizeObserver(() => flipTo(at(), true)).observe(flip);
    markFlip();

    /* artwork comes up over 1.1s as its plate reaches the screen (reduced motion: already there) */
    const reveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-on'); reveal.unobserve(e.target); } }), { threshold: .35 });
    plates.forEach(el => reveal.observe(el));

    const label = () => {
      PROJECTS.forEach((p, i) => {
        const el = plates[i], T = p.heading || p.title;
        const st = el.querySelector('[data-status]'); if (st) st.textContent = tr(p, 'status');
        el.querySelector('.cap-line').textContent = tr(p, 'headline');
        el.querySelector('.cap-text').textContent = lineOf(p);
        const more = el.querySelector('.plate-more');
        more.textContent = ko() ? '자세히 보기' : 'Explore';
        more.setAttribute('aria-label', ko() ? `${T} 자세히 보기` : `Explore ${T}`);
        const a = el.querySelector('.prod-act');
        if (a) { const l = ko() ? ACT_KO[p.action.label] || p.action.label : p.action.label; a.textContent = l; a.setAttribute('aria-label', ko() ? `${T} ${l}` : `${l} ${T}`); }
        const gh = el.querySelector('[data-get-head]'); if (gh) gh.textContent = ko() ? '설치 파일 선택' : 'Choose your OS';
        const art = el.querySelector('img.art'); if (art) art.alt = altOf(p.panels[p.art[0]]);
      });
      const cast = castOf(PROJECTS[1]), c = pairOf(PROJECTS[1]);
      datPlate.querySelector('.plate-cast').setAttribute('aria-label', ko() ? 'DAT 캐릭터 일러스트' : 'DAT character art');
      datPlate.querySelectorAll('.plate-cast img').forEach((img, k) => { img.alt = altOf(cast.items[k]); });
      flip.setAttribute('aria-label', ko() ? 'DAT, 2개 화면' : 'DAT, 2 views');
      datPlate.querySelector('[data-flip-marks]').setAttribute('aria-label', ko() ? 'DAT 화면 전환' : 'DAT view switch');
      const pillLabels = ko() ? ['01 캐릭터 일러스트', '02 보정 전후 비교'] : ['01 Character Art', '02 Before & After'];
      marks.forEach((b, k) => { b.textContent = pillLabels[k]; });
      flip.querySelector('.flip-next').setAttribute('aria-label', ko() ? '보정 전후 비교 보기' : 'View before and after');
      flip.querySelector('.flip-prev').setAttribute('aria-label', ko() ? '캐릭터 일러스트 보기' : 'View character art');
      box.querySelector('.cmp-before').alt = ko() ? c.beforeLabelKo || c.beforeLabel : c.beforeLabel || 'Original';
      box.querySelector('.cmp-after').alt = ko() ? 'DAT 적용 후' : 'After DAT';
      range.setAttribute('aria-label', ko() ? 'BEFORE / AFTER 비교 경계 위치' : 'Before / after reveal position');
      rail.setAttribute('aria-label', ko() ? '프로젝트 목록' : 'Project index');
      links[0].querySelector('span').textContent = ko() ? '홈' : 'Home';
      setCurrent(curId, false);
    };

    const clock = document.querySelector('[data-clock]');
    if (clock) {
      const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
      const tick = () => { clock.textContent = f.format(new Date()); };
      tick(); setInterval(tick, 15000);
    }

    /* current plate: rail, menu and deck move together; the address follows as #id (as the live site's #id/k did) */
    const nextCh = document.querySelector('[data-next-chapter]');
    const setText = (sel, text) => document.querySelectorAll(sel).forEach(el => { el.textContent = text; });
    let curId = 'top';
    function setCurrent(id, writeHash) {
      curId = id;
      const i = PROJECTS.findIndex(p => p.id === id), p = PROJECTS[i];
      body.classList.toggle('at-top', !p);
      links.forEach(a => { const on = a.dataset.indexLink === id; a.classList.toggle('is-current', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      document.querySelectorAll('[data-go-project]').forEach(b => { const on = b.dataset.goProject === id; b.classList.toggle('is-current', on); if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      setText('[data-current-num]', p ? numOf(p) : '');
      setText('[data-current-title]', p ? p.title : '');
      setText('[data-current-sub]', '');
      const q = PROJECTS[p ? i + 1 : 0];
      if (nextCh) {
        nextCh.hidden = !q;
        if (q) {
          nextCh.querySelector('[data-next-title]').textContent = q.title;
          nextCh.href = `#${q.id}`;
          nextCh.setAttribute('aria-label', ko() ? `다음 프로젝트: ${q.title}` : `Next project: ${q.title}`);
        }
      }
      if (writeHash && (p ? location.hash !== `#${id}` : location.hash)) history.replaceState(history.state, '', p ? `#${id}` : location.pathname + location.search);
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      setCurrent(e.target === intro ? 'top' : e.target.id, true);
      if (getOpen && !e.target.contains(getOpen)) setGet(getOpen, false);
    }), { rootMargin: '-45% 0px -45% 0px' });
    [intro, ...plates].forEach(el => el && io.observe(el));

    /* #id, the older #id/k (DAT 3 = the comparison), or #top */
    const parse = h => { const [id, sub] = decodeURIComponent(h.replace(/^#/, '')).split('/'); return [PROJECTS.some(p => p.id === id) ? id : 'top', parseInt(sub, 10) || 1]; };
    const go = (id, k, instant) => {
      const el = id === 'top' ? null : document.getElementById(id);
      scrollTo({ top: el ? el.offsetTop : 0, behavior: instant ? 'instant' : behavior() });
      if (id === 'dat') flipTo(k >= 3 ? 1 : 0, true);
    };
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const [id, k] = parse(a.getAttribute('href'));
      if (body.classList.contains('menu-open')) setMenu(false);
      history.pushState(null, '', id === 'top' ? location.pathname + location.search : `#${id}`);
      go(id, k);
      const target = id !== 'top' && (a.closest('.index-rail') || a.matches('[data-go-project]')) && document.getElementById(id);
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } /* keyboard users land where they asked to go */
    });
    addEventListener('popstate', () => { const [id, k] = parse(location.hash); go(id, k); }); /* back / forward, or a typed #id */

    relabel.push(label);
    label();
    const [id0, k0] = parse(location.hash);
    if (id0 !== 'top') requestAnimationFrame(() => { go(id0, k0, true); setCurrent(id0, true); });
    else { setCurrent('top', !!location.hash); }
    return;
  }

  const paras = p => [].concat(tr(p, 'description')); /* Korean keeps the same paragraph count, so the rail position carries over */
  const steps = p => (p.reel ? p.panels.length : paras(p).length); /* a reel (DAT) steps its artwork under one fixed line of copy */
  const artFor = (p, k) => {
    const art = tr(p, 'art'); /* Korean may order the same visuals to follow its own copy */
    if (!art) return p.panels[0];
    return p.panels[art[Math.min(k, art.length - 1)]];
  };
  /* a segment: a string ('\n' breaks a line) or an array of paragraphs, each a string or { display } */
  const blockEl = b => {
    const el = document.createElement('p');
    if (b && b.display != null) { el.className = 'display'; b = b.display; }
    String(b).split('\n').forEach((line, i) => { if (i) el.appendChild(document.createElement('br')); el.appendChild(document.createTextNode(line)); });
    return el;
  };
  /* one visual per paragraph: full-bleed art, or a framed in-game capture / feature graphic beside the copy */
  /* captions, alt text and copy are filled by labelSec, in the current language */
  const visual = (spec, j, i) => {
    const on = j === 0 ? ' is-on' : '', cap = spec.cap ? '<figcaption></figcaption>' : '';
    if (spec.kind === 'compare') return `<div class="media vis dat-inline${on}" data-art="${i}" role="group" hidden>
      <div class="dat-cases" role="group"></div>
      <div class="dat-reveal" style="--split:50%"><img data-dat-native draggable="false"><img class="dat-after" data-dat-native draggable="false"><span class="dat-side dat-before-tag">BEFORE</span><span class="dat-side dat-after-tag">AFTER</span><span class="dat-divider" aria-hidden="true"></span></div>
      <label class="dat-range-label"><span>BEFORE</span><input data-dat-range type="range" min="0" max="100" value="50"><span>AFTER</span></label>
      <div class="dat-zoom" tabindex="0" role="group"><div><span>BEFORE</span><div class="dat-detail" aria-hidden="true"></div></div><div><span>AFTER</span><div class="dat-detail" aria-hidden="true"></div></div></div></div>`;
    /* gallery: real artwork, as large as the plate allows; cut-out standings stand unframed, a full image sits framed */
    if (spec.kind === 'gallery') { const multi = spec.items.length > 1;
      return `<figure class="media vis gal${multi ? '' : ' gal-one'}${spec.cut ? ' gal-cut' : ''}${spec.pair ? ' gal-pair' : ''}${on}" data-art="${i}"${multi ? ' role="group"' : ''} style="--sar:${spec.items.reduce((a, it) => a + it.ar, 0).toFixed(4)};--n:${spec.items.length}">
        <div class="gal-row">${spec.items.map(it => `<div class="gi" style="--ar:${it.ar}"><img src="${url(it.src)}" alt="" draggable="false" decoding="async"${j ? ' loading="lazy"' : ''}>${it.name ? '<span class="gn"></span>' : ''}</div>`).join('')}</div>${cap}</figure>`; }
    if (spec.kind === 'feat') return `<figure class="media vis feat${on}" data-art="${i}"><svg viewBox="0 0 720 540" role="img" aria-label="">${FEAT[spec.feat]()}</svg>${cap}</figure>`;
    const img = `src="${url(spec.src)}" alt="" draggable="false" decoding="async"${j ? ' loading="lazy"' : ''}`;
    if (spec.kind === 'fig') return `<figure class="media vis afig${on}" data-art="${i}" style="--ar:${spec.ar}"><img ${img}>${cap}</figure>`;
    if (spec.kind === 'raw') return `<figure class="media vis frame${on}" data-art="${i}" style="--ar:${spec.ar || 16 / 9}"><img ${img}>${cap}</figure>`;
    return `<img class="media${on}" data-art="${i}" ${img} style="--pos:${spec.pos};--pos-m:${spec.posM}">`;
  };
  const stage = p => {
    /* horizon field: the same atmosphere as the opening, lit cold (Scheherazade) or warm (DAT) */
    const field = p.field === 'sch' ? '<div class="field sch-field" aria-hidden="true"></div>'
      : p.field === 'dat' ? '<div class="field dat-field" aria-hidden="true"><span class="dat-type">DAT</span></div>' : '';
    const used = p.reel ? p.panels : [...new Set(paras(p).map((_, k) => artFor(p, k)))];
    return field + used.map((spec, j) => visual(spec, j, p.panels.indexOf(spec))).join('');
  };

  track.removeAttribute('aria-roledescription');
  track.innerHTML = shown.map(p => {
    const ps = paras(p), n = steps(p), act = p.action;
    const ext = act && /^https?:/.test(act.href);
    return `<section class="prod p-${p.id} k-${p.field || p.panels[0].kind}" id="${p.id}" data-prod="${p.id}"${p.reel ? ' data-reel' : ''} aria-labelledby="t-${p.id}">
      <div class="stage">${stage(p)}</div>
      <div class="prod-veil" aria-hidden="true"></div>
      <div class="prod-copy">
        <p class="cap-meta"><span class="ch">${numOf(p)}</span><span aria-hidden="true">/ ${pad(PROJECTS.length)}</span>${p.status ? '<span data-status></span>' : ''}</p>
        <h2 class="cap-title" id="t-${p.id}">${only ? esc(p.heading || p.title) : `<a href="${pageOf(p)}">${esc(p.heading || p.title)}</a>`}</h2>
        ${p.title_ko ? `<p class="cap-ko" lang="ko">${esc(p.title_ko)}</p>` : ''}
        <p class="cap-line"></p>
        <div class="rail" data-rail tabindex="0" role="region" aria-roledescription="carousel">
          ${ps.map(() => '<div class="slide" role="group" aria-roledescription="slide"><p></p></div>').join('')}
        </div>
        <div class="rail-ctl">
          ${n > 1 ? `<button class="text-btn" type="button" data-rail-step="-1"></button>
          <span class="dots">${Array.from({ length: n }, (_, k) => `<button class="dot" type="button" data-rail-go="${k}"><i></i></button>`).join('')}</span>
          <button class="text-btn" type="button" data-rail-step="1"></button>
          <span class="count" aria-hidden="true"><b data-count>1</b> / ${n}</span>` : ''}
          ${act && act.os ? `<span class="get-wrap"><a class="prod-act" href="${url(act.href)}" aria-expanded="false" aria-controls="get-${p.id}"></a>${getMenuHTML(p.id)}</span>`
            : act ? `<a class="prod-act" href="${url(act.href)}"${ext ? ' target="_blank" rel="noopener"' : ''}></a>` : ''}
        </div>
      </div>
    </section>`;
  }).join('');
  const secs = [...track.querySelectorAll('.prod')];
  track.querySelectorAll('.get-wrap').forEach(wireGet);

  /* DAT compares only recorded image pairs. Display files share one pixel ROI, never a stretched frame. */
  const datSec = secs.find(sec => sec.dataset.prod === 'dat');
  const datProject = shown.find(p => p.id === 'dat');
  const datInline = datSec && datSec.querySelector('.dat-inline');
  let datCase = 0, zoomX = .24, zoomY = .49;
  const datText = (en, kr) => ko() ? kr : en;
  const activeCase = () => datProject.comparisons[datCase];
  const resetDetail = () => { [zoomX, zoomY] = activeCase().detailPoint || [.24, .49]; };
  const pauseDat = () => { datSec._manual = true; if (datSec._arm) datSec._arm(); };
  const updateZoom = () => {
    if (!datInline || datInline.hidden) return;
    const c = activeCase(), h = datInline.querySelector('.dat-reveal').getBoundingClientRect().height * 3, w = h * c.width / c.height;
    datInline.querySelectorAll('.dat-detail').forEach(el => {
      const b = el.getBoundingClientRect();
      el.style.backgroundSize = `${w}px ${h}px`;
      el.style.backgroundPosition = `${b.width / 2 - zoomX * w}px ${b.height / 2 - zoomY * h}px`;
      el.dataset.x = zoomX.toFixed(4); el.dataset.y = zoomY.toFixed(4);
    });
  };
  const updateDat = () => {
    if (!datSec) return;
    const k = datSec._k || 0, title = datSec.querySelector('.cap-title');
    (title.querySelector('a') || title).textContent = k ? 'Image Organize' : 'Our Style';
    datSec.classList.toggle('dat-comparing', k === 2);
    datInline.hidden = k !== 2;
    datInline.inert = k !== 2;
    /* Keep the maker statement and process graphic; comparisons need only clean before/after labels. */
    datSec.querySelector('.slide p').textContent = k === 0 ? tr(datProject, 'description')[0] : k === 1
      ? datText('A feature graphic of the DAT finishing process: filtering muddy colour and adding a light watercolour wash.', '탁한 색을 거르고 옅은 수채 질감을 더하는 DAT 후처리 과정을 그린 설명 그림') : '';
    const c = activeCase(), beforeName = ko() ? c.beforeLabelKo || c.beforeLabel || '원본' : c.beforeLabel || 'Original';
    datInline.setAttribute('aria-label', `${ko() ? c.labelKo : c.label} · BEFORE / AFTER`);
    datInline.querySelector('.dat-cases').setAttribute('aria-label', datText('Comparison cases', '비교 장면'));
    datInline.querySelectorAll('[data-dat-case]').forEach((b, i) => {
      b.textContent = ko() ? datProject.comparisons[i].labelKo : datProject.comparisons[i].label;
      b.setAttribute('aria-pressed', String(i === datCase));
    });
    const point = c.detailPoint || [.24, .49];
    datInline.dataset.defaultX = point[0].toFixed(4); datInline.dataset.defaultY = point[1].toFixed(4);
    datInline.querySelector('.dat-reveal').style.setProperty('--case-ar', c.width / c.height);
    datInline.querySelectorAll('[data-dat-native]').forEach((img, i) => {
      img.src = url(i ? c.after : c.before);
      img.alt = `${ko() ? c.labelKo : c.label} · ${i ? datText('After DAT', 'DAT 적용 후') : beforeName}`;
    });
    datInline.querySelectorAll('.dat-detail').forEach((el, i) => { el.style.backgroundImage = `url("${url(i ? c.after : c.before)}")`; });
    datInline.querySelector('[data-dat-range]').setAttribute('aria-label', datText('Before / after reveal position', 'BEFORE / AFTER 비교 경계 위치'));
    datInline.querySelector('.dat-zoom').setAttribute('aria-label', datText('Synchronized detail magnifier. Arrow keys move the location, Home resets.', '같은 위치 확대. 방향키로 위치 이동, Home으로 초기 위치'));
    updateZoom();
  };
  if (datInline) {
    datInline.querySelector('.dat-cases').innerHTML = datProject.comparisons.map((_, i) => `<button type="button" data-dat-case="${i}" aria-pressed="${i === 0}"></button>`).join('');
    datInline.addEventListener('pointerdown', pauseDat);
    datInline.addEventListener('focusin', pauseDat);
    datInline.addEventListener('click', e => {
      const b = e.target.closest('[data-dat-case]'); if (!b) return;
      pauseDat(); datCase = Number(b.dataset.datCase); resetDetail();
      datInline.querySelector('[data-dat-range]').value = 50;
      datInline.querySelector('.dat-reveal').style.setProperty('--split', '50%'); updateDat();
    });
    const range = datInline.querySelector('[data-dat-range]'), frame = datInline.querySelector('.dat-reveal');
    range.addEventListener('input', () => { pauseDat(); frame.style.setProperty('--split', `${range.value}%`); });
    const locate = e => {
      const b = frame.getBoundingClientRect();
      zoomX = Math.max(.01, Math.min(.99, (e.clientX - b.left) / b.width));
      zoomY = Math.max(.01, Math.min(.99, (e.clientY - b.top) / b.height)); updateZoom();
    };
    frame.addEventListener('pointerdown', e => { frame.setPointerCapture(e.pointerId); locate(e); range.value = Math.round(zoomX * 100); range.dispatchEvent(new Event('input')); });
    frame.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse' || frame.hasPointerCapture(e.pointerId)) { pauseDat(); locate(e); }
      if (frame.hasPointerCapture(e.pointerId)) { range.value = Math.round(zoomX * 100); range.dispatchEvent(new Event('input')); }
    });
    datInline.querySelector('.dat-zoom').addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation(); pauseDat();
      if (e.key === 'Home') resetDetail();
      else { zoomX = Math.max(.01, Math.min(.99, zoomX + (e.key === 'ArrowLeft' ? -.02 : e.key === 'ArrowRight' ? .02 : 0))); zoomY = Math.max(.01, Math.min(.99, zoomY + (e.key === 'ArrowUp' ? -.02 : e.key === 'ArrowDown' ? .02 : 0))); }
      updateZoom();
    });
    /* Inline controls never step the reel; Tab and Escape remain native and untrapped. */
    datInline.addEventListener('keydown', e => { pauseDat(); e.stopPropagation(); });
    new ResizeObserver(updateZoom).observe(frame);
  }

  /* every word in a section, in the current language; changes text in place so scroll and rail position stay put */
  const labelSec = (sec, p) => {
    const ps = paras(p), n = steps(p), T = p.id === 'dat' && sec._k ? 'Image Organize' : p.heading || p.title, set = (sel, attr, v) => { const el = sec.querySelector(sel); if (el) el.setAttribute(attr, v); };
    const st = sec.querySelector('[data-status]'); if (st) st.textContent = tr(p, 'status');
    sec.querySelector('.cap-line').textContent = tr(p, 'headline');
    set('[data-rail]', 'aria-label', ko() ? `${T}, 문단 ${ps.length}개` : `${T}, ${ps.length} paragraph${ps.length > 1 ? 's' : ''}`);
    const unit = p.reel ? (ko() ? '작품' : 'artwork') : (ko() ? '문단' : 'paragraph');
    sec.querySelectorAll('.slide').forEach((s, k) => {
      s.setAttribute('aria-label', ko() ? `${ps.length}개 중 ${k + 1}번째` : `${k + 1} of ${ps.length}`);
      s.replaceChildren(...[].concat(ps[k]).map(blockEl));
    });
    sec.querySelectorAll('[data-rail-step]').forEach(b => { b.textContent = Number(b.dataset.railStep) < 0 ? (ko() ? '이전' : 'Prev') : (ko() ? '다음' : 'Next'); });
    set('[data-rail-step="-1"]', 'aria-label', ko() ? `${T} 이전 ${unit}` : `Previous ${unit}, ${T}`);
    set('[data-rail-step="1"]', 'aria-label', ko() ? `${T} 다음 ${unit}` : `Next ${unit}, ${T}`);
    sec.querySelectorAll('[data-rail-go]').forEach((d, k) => d.setAttribute('aria-label', ko() ? `${T}, ${n}개 중 ${k + 1}번째 ${unit}` : `${T}, ${unit} ${k + 1} of ${n}`));
    const a = sec.querySelector('.prod-act');
    if (a) { const l = ko() ? ACT_KO[p.action.label] || p.action.label : p.action.label; a.textContent = l; a.setAttribute('aria-label', ko() ? `${T} ${l}` : `${l} ${T}`); }
    const gh = sec.querySelector('[data-get-head]'); if (gh) gh.textContent = ko() ? '설치 파일 선택' : 'Choose your OS';
    sec.querySelectorAll('[data-art]').forEach(m => {
      const spec = p.panels[m.dataset.art], alt = ko() && spec.altKo || spec.alt;
      const svg = m.querySelector('svg'), img = m.matches('img') ? m : m.querySelector('img'), cap = m.querySelector('figcaption');
      if (spec.items) { if (alt) m.setAttribute('aria-label', alt); m.querySelectorAll('.gi').forEach((g, k) => { const it = spec.items[k]; g.querySelector('img').alt = ko() && it.altKo || it.alt; const n = g.querySelector('.gn'); if (n) n.textContent = ko() && it.nameKo || it.name; }); }
      else if (svg) svg.setAttribute('aria-label', alt); else if (img) img.alt = alt;
      if (cap) cap.textContent = ko() && spec.capKo || spec.cap;
    });
    if (p.id === 'dat') updateDat();
  };
  const labelAll = () => secs.forEach((sec, i) => labelSec(sec, shown[i]));
  labelAll();

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

  const slideOf = sec => { if (sec.dataset.reel != null) return sec._k || 0; const r = sec.querySelector('[data-rail]'); return Math.max(0, Math.round(r.scrollLeft / (r.clientWidth || 1))); };
  const setText = (sel, text) => document.querySelectorAll(sel).forEach(el => { el.textContent = text; });
  /* deck: the next chapter in PROJECTS order; on a project page it links to that project's page */
  const nextCh = document.querySelector('[data-next-chapter]');
  const setNext = from => {
    if (!nextCh) return;
    const i = from == null ? 0 : PROJECTS.indexOf(from) + 1, q = PROJECTS[i];
    nextCh.hidden = !q;
    if (!q) return;
    nextCh.querySelector('[data-next-title]').textContent = q.title;
    nextCh.href = only ? pageOf(q) : `#${q.id}/1`;
    nextCh.setAttribute('aria-label', ko() ? `다음 프로젝트: ${q.title}` : `Next project: ${q.title}`);
  };

  const sync = (sec, auto) => {
    const pi = secs.indexOf(sec), p = shown[pi], k = slideOf(sec), n = steps(p);
    sec.querySelectorAll('.dot').forEach((d, j) => {
      d.classList.toggle('is-current', j === k);
      if (j === k) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
    sec.querySelectorAll('[data-rail-step]').forEach(b => { b.disabled = Number(b.dataset.railStep) < 0 ? k === 0 : k === n - 1; });
    sec.querySelectorAll('.slide').forEach((el, j) => { el.inert = p.reel ? false : j !== k; });
    const c = sec.querySelector('[data-count]'); if (c) c.textContent = k + 1;
    const art = p.reel ? p.panels[k] : artFor(p, k);
    if (p.id === 'dat') labelSec(sec, p);
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
    setNext(p);
    document.querySelectorAll('[data-go-project]').forEach(b => {
      const on = b.dataset.goProject === p.id;
      b.classList.toggle('is-current', on);
      if (on) b.setAttribute('aria-current', only ? 'page' : 'true'); else b.removeAttribute('aria-current');
    });
    const hash = only ? `#${k + 1}` : `#${p.id}/${k + 1}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
    const live = document.querySelector('[data-live]');
    if (live && !auto) live.textContent = p.reel ? (ko() ? `${p.title}, ${n}개 중 ${k + 1}번째 작품` : `${p.title}, artwork ${k + 1} of ${n}`)
      : ko() ? `${p.title}, ${n}개 중 ${k + 1}번째 문단` : `${p.title}, paragraph ${k + 1} of ${n}`;
  };

  /* manual: a person stepped (buttons, dots, arrow keys); on a reel that ends its autoplay for this visit */
  const goSlide = (sec, k, instant, manual) => {
    if (sec.dataset.reel != null) {
      const n = steps(shown[secs.indexOf(sec)]);
      sec._k = Math.max(0, Math.min(n - 1, k));
      if (manual) sec._manual = true;
      sync(sec); if (sec._arm) sec._arm();
      return;
    }
    const r = sec.querySelector('[data-rail]'), n = r.children.length;
    k = Math.max(0, Math.min(n - 1, k));
    r.scrollTo({ left: k * r.clientWidth, behavior: instant ? 'instant' : behavior() });
  };
  const showIntro = () => {
    atIntro = true;
    ['[data-current-num]', '[data-current-title]', '[data-current-sub]'].forEach(sel => setText(sel, ''));
    setNext(null);
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
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); goSlide(sec, slideOf(sec) + (e.key === 'ArrowRight' ? 1 : -1), false, true); }
    });
    sync(sec);
  });

  /* current product = the section covering the middle of the viewport */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      if (en.target === intro) { showIntro(); if (getOpen) setGet(getOpen, false); return; }
      atIntro = false; cur = secs.indexOf(en.target); sync(en.target);
      if (getOpen && !en.target.contains(getOpen)) setGet(getOpen, false);
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  [intro, ...secs].forEach(el => el && io.observe(el));

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;
    const sec = t.closest('.prod');
    if (t.matches('[data-rail-step]')) goSlide(sec, slideOf(sec) + Number(t.dataset.railStep), false, true);
    else if (t.matches('[data-rail-go]')) goSlide(sec, Number(t.dataset.railGo), false, true);
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
    if (e.altKey || e.ctrlKey || e.metaKey || body.classList.contains('menu-open') || langOpen() || getOpen || e.defaultPrevented) return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !atIntro) {
      e.preventDefault();
      const sec = secs[cur];
      goSlide(sec, slideOf(sec) + (e.key === 'ArrowRight' ? 1 : -1), false, true);
    }
  });

  /* ---------- reel autoplay (DAT only): the next artwork every 6 s while the section fills most of the screen and the tab
     is visible. A manual step stops it for this visit, focus inside the section holds it, reduced motion never starts it. ---------- */
  const AUTO_MS = 6000;
  secs.forEach((sec, i) => {
    const p = shown[i]; if (!p.reel) return;
    let timer = 0, onscreen = false, held = false;
    const arm = () => {
      clearTimeout(timer); timer = 0;
      if (!reduce.matches && !document.hidden && onscreen && !held && !sec._manual)
        timer = setTimeout(() => { sec._k = ((sec._k || 0) + 1) % p.panels.length; sync(sec, true); arm(); }, AUTO_MS);
      sec.dataset.auto = timer ? 'on' : 'off';
    };
    sec._arm = arm;
    new IntersectionObserver(([en]) => { onscreen = en.intersectionRatio >= .6; arm(); }, { threshold: [0, .6] }).observe(sec);
    document.addEventListener('visibilitychange', arm);
    reduce.addEventListener('change', arm);
    sec.addEventListener('focusin', () => { held = true; arm(); });
    sec.addEventListener('focusout', e => { if (!sec.contains(e.relatedTarget)) { held = false; arm(); } });
  });

  /* ---------- size + deep link ---------- */
  new ResizeObserver(() => secs.forEach(sec => goSlide(sec, Number((sec.querySelector('[data-count]') || { textContent: 1 }).textContent) - 1, true))).observe(track);
  /* phones stack copy under the visual: framed visuals end where the copy begins */
  const copyTop = new ResizeObserver(() => secs.forEach(sec => sec.style.setProperty('--copy-top', `${sec.querySelector('.prod-copy').offsetTop}px`)));
  [track, ...secs.map(sec => sec.querySelector('.prod-copy'))].forEach(el => copyTop.observe(el));

  addEventListener('hashchange', () => { const [pi, k] = fromHash(); goProd(pi, k); });
  relabel.push(() => { labelAll(); if (!atIntro) sync(secs[cur]); else setNext(null); });
  if (location.hash) requestAnimationFrame(() => goProd(pi0, k0, true)); else if (intro) showIntro(); else sync(secs[0]);
})();

/* ---------- letterbox chrome: the fixed bars return the screen on scroll down, come back on scroll up (Mino 2026-10-13 21:10:
   the top navigator and the bottom bar hide more of the screen than the few words they carry. Nothing to add: the same bars,
   present at the top of each read, hidden while the reader is moving down, back while moving up or at the two ends). ---------- */
(() => {
  const bars = [...document.querySelectorAll('.mast, .deck, .dl-foot')]
    .filter(el => getComputedStyle(el).position === 'fixed');
  if (!bars.length) return;
  const setHidden = hidden => hidden.forEach(h => bars.forEach(bar => bar.classList.toggle('chrome-hidden', h)));
  setHidden([false]);
  let lastY = scrollY, raf = 0;
  const settle = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    const y = Math.max(0, Math.min(max, scrollY)), dy = y - lastY;
    lastY = y;
    if (Math.abs(dy) < 6) return;
    setHidden([y > 6 && dy > 0 && y < max - 6]); /* at the very top or the very bottom, or moving up, the bars are back */
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(settle); }, { passive: true });
})();
