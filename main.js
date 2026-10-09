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
      ko: {
        status: '베타',
        headline: '천하룻밤을 넘어 곁에 남는 에이전트',
        description: [
          '오래 이어지는 작업을 위해 만들었어요. 며칠, 몇 달이 지나고 수정이 한 번 더 들어와도 Scheherazade는 사실과 내가 고쳐 준 내용, 아직 못 끝낸 일을 곁에 두고 있어요. 그래서 프로젝트를 처음부터 다시 설명하지 않고 바로 이어 갈 수 있어요. 사람처럼 기억하지만, 무엇을 기억하는지 직접 읽어 보고 잊으라고 할 수도 있어요. Autonomy를 켜 두면 그날의 기억을 밤사이 정리해요.',
          '두뇌는 직접 골라요. Claude Code로 쓰는 Claude 구독, Codex로 쓰는 ChatGPT, 아니면 Ollama. 모델은 바꿔도 기억은 그대로예요. 기억은 내 컴퓨터에 남고, 모델을 바꾸기 전에는 다음 모델에게 편지를 남겨요. 새 모델에게 처음부터 다시 소개할 필요는 없어요.',
          'Chrome에서 논문을 열었다가 YouTube로 잠깐 새도 괜찮아요. Browse with me를 켜 두면 지금 보는 탭을 같이 읽고 이야기를 나눠요. 눈 버튼으로 언제 함께 볼지 정할 수 있어요. 호기심에도 끄는 스위치는 있어야 하니까요.',
          '가끔은 꿈도 꿔요. Autonomy를 켜 두면 오래된 일기가 뜻밖의 기억과 만나 다시 떠올라요. 한가한 오후가 지나면 그 조각 하나를 들고 올지도 몰라요. 다음 아이디어로 이어질 엉뚱한 생각일 수도 있어요. 영감은 시간을 가리지 않으니까요.'
        ]
      },
      action: { label: 'Get', href: 'download.html' },
      field: 'sch',
      art: [0, 1, 2, 3],
      panels: [
        { kind: 'feat', feat: 'sch-memory', cap: 'Feature graphic · Memory', capKo: '설명 그림 · 기억', altKo: '설명 그림, 실제 앱 화면 아님: Scheherazade가 사실과 내가 고쳐 준 내용, 못 끝낸 일을 기억하고, 그 기억을 읽거나 잊게 할 수 있으며, Autonomy를 켜면 그날의 기억을 밤사이 정리하는 모습', alt: 'Feature graphic, not an app screenshot: Scheherazade keeps the facts, your corrections and unfinished threads; you can read them, tell her to forget, and with Autonomy on she sorts the day overnight' },
        { kind: 'feat', feat: 'sch-byos', cap: 'Feature graphic · Bring your own brain', capKo: '설명 그림 · 두뇌는 직접 고르기', altKo: '설명 그림, 실제 앱 화면 아님: Claude Code의 Claude, Codex의 ChatGPT, Ollama 중 무엇을 연결해도 내 컴퓨터에 있는 같은 기억을 쓰고, 모델을 바꾸기 전에 다음 모델에게 편지를 남기는 모습', alt: 'Feature graphic, not an app screenshot: Claude via Claude Code, ChatGPT via Codex or Ollama connect to the same memories kept on your computer, with a letter to her next self before a switch' },
        { kind: 'feat', feat: 'sch-browse', cap: 'Feature graphic · Browse with me', capKo: '설명 그림 · Browse with me', altKo: '설명 그림, 실제 앱 화면 아님: 브라우저 탭에 논문을 열어 두고 Scheherazade와 같이 이야기하는 모습, 그리고 언제 볼지 정하는 눈 버튼', alt: 'Feature graphic, not an app screenshot: a browser tab with a paper open beside Scheherazade talking it through, and the eye button that decides when she is looking' },
        { kind: 'feat', feat: 'sch-dream', cap: 'Feature graphic · Dreams', capKo: '설명 그림 · 꿈', altKo: '설명 그림, 실제 앱 화면 아님: 오래된 일기들이 뜻밖에 이어져 새로운 조각 하나가 되는 모습', alt: 'Feature graphic, not an app screenshot: old journal entries joined in unexpected company into a new fragment' }
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
      ko: {
        headline: '모델로 만든 우리 그림체',
        description: [
          '수채화와 유화, 서브컬처 그림 사이 어딘가에 있는 CHOAM의 일러스트 그림체를 담은 모델이에요.',
          '캐릭터 초상화와 키 비주얼을 마무리할 때 써요. 회화 같은 질감을 살리고, 특히 눈에 공을 들여요.'
        ]
      },
      field: 'dat',
      art: [0, 1],
      panels: [
        { kind: 'feat', feat: 'dat-style', cap: 'Feature graphic · House style', capKo: '설명 그림 · 그림체', altKo: '설명 그림, 모델 결과물 아님: 수채화, 유화, 서브컬처 그림이 겹치는 자리에 있는 DAT', alt: 'Feature graphic, not model output: DAT sits where watercolor, oil painting and subculture art overlap' },
        { kind: 'feat', feat: 'dat-flow', cap: 'Feature graphic · Workflow', capKo: '설명 그림 · 작업 흐름', altKo: '설명 그림, 모델 결과물 아님: 캐릭터 초상화와 키 비주얼이 DAT 마무리를 거쳐 회화 같은 질감과 공들인 눈을 얻는 흐름', alt: 'Feature graphic, not model output: character portraits and key visuals pass through a DAT finish for painterly textures and attention to the eyes' }
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
      ko: {
        status: '출시 준비 중',
        headline: '손님이 모두 사람은 아니에요',
        description: [
          '여우 신령 셋이 너구리에게 돈을 빌려, 잊힌 산속 신사를 온천 여관으로 바꿔요. 100일 동안 밭을 가꾸고, 요리하고, 온천 배관을 깔고, 객실을 준비해요.',
          '손님 중에는 사람인 척하는 요괴도 있어요. 요청을 잘 읽고 여기저기 물어본 다음, 체크아웃 때 판단해요.'
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
      title_ko: '동구리레스토랑',
      status: 'On the web',
      headline: 'No menu. The field decides.',
      description: [
        'A small forest restaurant run by a chef, a sommelier and a part-timer.',
        'Read the reservation board, plant for the guests who are coming, harvest what the field gives, and build each course and wine pairing around it.',
        'One season, four weeks. Plays in the browser.'
      ],
      ko: {
        status: '웹에서 플레이',
        headline: '메뉴판은 없어요. 밭이 정해요.',
        description: [
          '셰프와 소믈리에, 아르바이트생이 꾸려 가는 숲속의 작은 레스토랑이에요.',
          '예약판을 보고 올 손님에 맞춰 씨를 뿌리고, 밭이 내준 재료를 거둬서 코스와 와인 페어링을 짜요.',
          '한 계절, 4주. 브라우저에서 바로 플레이해요.'
        ]
      },
      art: [0, 2, 3], /* key art, then in-game captures framed beside the copy so game UI never meets site UI */
      action: { label: 'Play', href: 'https://donguri.run' },
      panels: [
        { kind: 'art', src: 'assets/restaurant-01.webp', altKo: 'Donguri Restaurant 키 아트: 레스토랑 로고 옆에 셰프, 소믈리에, 아르바이트생이 함께 몸을 기울인 모습', alt: 'Donguri Restaurant key art: the chef, the sommelier and the part-timer leaning in together beside the restaurant logo', pos: '50% 30%', posM: '50% 50%' },
        { kind: 'raw', src: 'assets/restaurant-02.webp', ar: 1920 / 1080, cap: 'In-game capture · Opening night', capKo: '게임 화면 · 개업 첫날 밤', altKo: 'Donguri Restaurant 플레이 화면: 개업 첫날 밤 대화 중 마당에 선 세 직원', alt: 'Donguri Restaurant gameplay: the three staff standing in the yard at night during the opening dialogue', pos: '50% 50%', posM: '50% 50%', lift: 0.29 },
        { kind: 'raw', src: 'assets/restaurant-03.webp', ar: 1280 / 720, cap: 'In-game capture · Reservation board', capKo: '게임 화면 · 예약판', altKo: 'Donguri Restaurant 플레이 화면: 레스토랑 마당과 밭, 첫날 밤 손님이 적힌 예약판', alt: 'Donguri Restaurant gameplay: the restaurant yard and field, with the reservation board listing the first night’s guests', pos: '50% 50%', posM: '42% 50%', lift: 0.33 },
        { kind: 'raw', src: 'assets/restaurant-04.webp', ar: 1280 / 800, cap: 'In-game capture · Tonight’s course', capKo: '게임 화면 · 오늘 밤 코스', altKo: 'Donguri Restaurant 플레이 화면: 오늘 저녁 코스 메뉴가 요리별로 놓인 주방', alt: 'Donguri Restaurant gameplay: the kitchen with the evening’s course menu laid out dish by dish', pos: '50% 0%', posM: '50% 50%', lift: 0 }
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
      ko: {
        headline: '내가 한 말을 기억하는 그 애',
        description: [
          '구교사 향토연구부를 배경으로 한 비주얼 노벨이에요. 방과 후면 예지가 창가에서 명부와 옛 사진을 정리해요.',
          '내 말로 직접 말을 걸면, 예지는 그 말을 다음 날까지 기억해요. 일주일이 지나는 사이, 사소한 것들이 하나둘 어긋나기 시작해요.'
        ]
      },
      art: [2, 0],
      panels: [
        { kind: 'art', src: 'assets/seonjam-01.webp', altKo: '선잠 DOZE 일러스트: 먼 벽이 깊고 푸른 수족관으로 열린 교실에 혼자 선 소녀', alt: '선잠 DOZE illustration: a girl standing alone in a classroom whose far wall opens onto a deep blue aquarium', pos: '50% 50%', posM: '56% 50%' },
        { kind: 'raw', src: 'assets/seonjam-02.webp', altKo: '선잠 DOZE 게임 타이틀 화면: 어두운 교실에서 교복 입은 소녀 다섯이 타이틀과 시작 메뉴 옆에 있는 모습', alt: '선잠 DOZE in-game title screen: five girls in school uniform in a dark classroom beside the title and the start menu', pos: '50% 50%', posM: '12% 50%', lift: 0 },
        { kind: 'art', src: 'assets/seonjam-03.webp', altKo: '선잠 DOZE 일러스트: 오후 햇살 속 구교사 옆 나무 울타리 곁에 선 예지', alt: '선잠 DOZE illustration: Yeji by a wooden fence beside the old school building in afternoon light', pos: '50% 50%', posM: '24% 50%' }
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
    ['.intro-next', 'aria-label', '프로젝트 둘러보기'],
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
    ['.dl-note [data-note]', '', 'Claude·ChatGPT 구독이나 Ollama 모델을 연결해서 써요.'],
    ['.dl-note a', '', '전체 릴리스']
  ].flatMap(([sel, attr, k]) => [...document.querySelectorAll(sel)].map(el => ({ el, attr, k, en: attr ? el.getAttribute(attr) : el.textContent })));
  const TITLE_KO = { 'Get Scheherazade | CHOAM': 'Scheherazade 받기 | CHOAM' };
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
  });
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
  const paras = p => [].concat(tr(p, 'description')); /* Korean keeps the same paragraph count, so the rail position carries over */
  const artFor = (p, k) => {
    if (!p.art) return p.panels[0];
    return p.panels[p.art[Math.min(k, p.art.length - 1)]];
  };
  /* one visual per paragraph: full-bleed art, or a framed in-game capture / feature graphic beside the copy */
  /* captions, alt text and copy are filled by labelSec, in the current language */
  const visual = (spec, j, i) => {
    const on = j === 0 ? ' is-on' : '', cap = spec.cap ? '<figcaption></figcaption>' : '';
    if (spec.kind === 'feat') return `<figure class="media vis feat${on}" data-art="${i}"><svg viewBox="0 0 600 460" role="img" aria-label="">${FEAT[spec.feat]()}</svg>${cap}</figure>`;
    const img = `src="${url(spec.src)}" alt="" draggable="false" decoding="async"${j ? ' loading="lazy"' : ''}`;
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
        <p class="cap-meta"><span>${numOf(p)}</span>${p.status ? '<span data-status></span>' : ''}</p>
        <h2 class="cap-title" id="t-${p.id}">${only ? esc(p.title) : `<a href="${pageOf(p)}">${esc(p.title)}</a>`}</h2>
        ${p.title_ko ? `<p class="cap-ko" lang="ko">${esc(p.title_ko)}</p>` : ''}
        <p class="cap-line"></p>
        <div class="rail" data-rail tabindex="0" role="region" aria-roledescription="carousel">
          ${ps.map(() => '<div class="slide" role="group" aria-roledescription="slide"><p></p></div>').join('')}
        </div>
        <div class="rail-ctl">
          ${n > 1 ? `<button class="arrow" type="button" data-rail-step="-1">&#8592;</button>
          <span class="dots">${ps.map((_, k) => `<button class="dot" type="button" data-rail-go="${k}"><i></i></button>`).join('')}</span>
          <button class="arrow" type="button" data-rail-step="1">&#8594;</button>
          <span class="count" aria-hidden="true"><b data-count>1</b> / ${n}</span>` : ''}
          ${act ? `<a class="prod-act" href="${url(act.href)}"${ext ? ' target="_blank" rel="noopener"' : ''}></a>` : ''}
        </div>
      </div>
    </section>`;
  }).join('');
  const secs = [...track.querySelectorAll('.prod')];

  /* every word in a section, in the current language; changes text in place so scroll and rail position stay put */
  const labelSec = (sec, p) => {
    const ps = paras(p), n = ps.length, T = p.title, set = (sel, attr, v) => { const el = sec.querySelector(sel); if (el) el.setAttribute(attr, v); };
    const st = sec.querySelector('[data-status]'); if (st) st.textContent = tr(p, 'status');
    sec.querySelector('.cap-line').textContent = tr(p, 'headline');
    set('[data-rail]', 'aria-label', ko() ? `${T}, 문단 ${n}개` : `${T}, ${n} paragraphs`);
    sec.querySelectorAll('.slide').forEach((s, k) => {
      s.setAttribute('aria-label', ko() ? `${n}개 중 ${k + 1}번째` : `${k + 1} of ${n}`);
      s.firstElementChild.textContent = ps[k];
    });
    set('[data-rail-step="-1"]', 'aria-label', ko() ? `${T} 이전 문단` : `Previous paragraph, ${T}`);
    set('[data-rail-step="1"]', 'aria-label', ko() ? `${T} 다음 문단` : `Next paragraph, ${T}`);
    sec.querySelectorAll('[data-rail-go]').forEach((d, k) => d.setAttribute('aria-label', ko() ? `${T}, ${n}개 중 ${k + 1}번째 문단` : `${T}, paragraph ${k + 1} of ${n}`));
    const a = sec.querySelector('.prod-act');
    if (a) { const l = ko() ? ACT_KO[p.action.label] || p.action.label : p.action.label; a.textContent = l; a.setAttribute('aria-label', ko() ? `${T} ${l}` : `${l} ${T}`); }
    sec.querySelectorAll('[data-art]').forEach(m => {
      const spec = p.panels[m.dataset.art], alt = ko() && spec.altKo || spec.alt;
      const svg = m.querySelector('svg'), img = m.matches('img') ? m : m.querySelector('img'), cap = m.querySelector('figcaption');
      if (svg) svg.setAttribute('aria-label', alt); else if (img) img.alt = alt;
      if (cap) cap.textContent = ko() && spec.capKo || spec.cap;
    });
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
    if (live) live.textContent = ko() ? `${p.title}, ${n}개 중 ${k + 1}번째 문단` : `${p.title}, paragraph ${k + 1} of ${n}`;
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
    if (e.altKey || e.ctrlKey || e.metaKey || body.classList.contains('menu-open') || langOpen() || e.defaultPrevented) return;
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
  relabel.push(() => { labelAll(); if (!atIntro) sync(secs[cur]); });
  if (location.hash) requestAnimationFrame(() => goProd(pi0, k0, true)); else if (intro) showIntro(); else sync(secs[0]);
})();
