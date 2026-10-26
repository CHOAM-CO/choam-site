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
    'sch-memory': () => `${POOL('pl-mem', 520, 270, 320, 220, .14)}
      <text class="l" x="40" y="42">4-TIER LOCAL MEMORY</text><text class="k dim" x="680" y="42" text-anchor="end">~/Documents/Scheherazade/</text>
      <path class="hr" d="M40 56H680"/>
      <g transform="translate(40, 72)">
        <rect class="fj" width="640" height="90" rx="2"/>
        <text class="k" x="22" y="25">1. SESSION NOTES</text><text class="s sm dim" x="236" y="25">session_notes/ · working memory</text>
        <rect class="chip on" x="510" y="9" width="108" height="20" rx="10"/><text class="tag" x="564" y="22.5" text-anchor="middle">REAL-TIME</text>
        <path class="hr" d="M22 35H618"/>
        <rect class="bg" x="22" y="43" width="52" height="18" rx="2"/><text class="tag dark" x="48" y="55.5" text-anchor="middle">FELT</text>
        <text class="s em" x="86" y="56">Human emotion &amp; intent carried verbatim into history</text>
        <rect class="b2" x="22" y="65" width="52" height="18" rx="2"/><text class="tag" x="48" y="77.5" text-anchor="middle">LOCK</text>
        <text class="s dim" x="86" y="78">Immutable user corrections &amp; project constraints</text>
      </g>
      <g transform="translate(40, 172)">
        <rect class="fj" width="640" height="90" rx="2"/>
        <text class="k" x="22" y="25">2. JOURNALS</text><text class="s sm dim" x="236" y="25">journals/ · autonomous compression</text>
        <rect class="chip" x="510" y="9" width="108" height="20" rx="10"/><text class="tag" x="564" y="22.5" text-anchor="middle">NIGHTLY CRON</text>
        <path class="hr" d="M22 35H618"/>
        <rect class="b2" x="22" y="43" width="52" height="18" rx="2"/><text class="tag" x="48" y="55.5" text-anchor="middle">SYNC</text>
        <text class="s" x="86" y="56">Overnight residue synthesis &amp; stale session compression</text>
        <rect class="b" x="22" y="65" width="52" height="18" rx="2"/><text class="tag dim" x="48" y="77.5" text-anchor="middle">KEEP</text>
        <text class="s dim" x="86" y="78">Summarized history preserving every locked directive</text>
      </g>
      <g transform="translate(40, 272)">
        <rect class="fj" width="640" height="90" rx="2"/>
        <text class="k" x="22" y="25">3. SELF PERSONA</text><text class="s sm dim" x="236" y="25">self_persona.md · weekly reflux</text>
        <rect class="chip on" x="510" y="9" width="108" height="20" rx="10"/><text class="tag" x="564" y="22.5" text-anchor="middle">REVIEWED</text>
        <path class="hr" d="M22 35H618"/>
        <rect class="bg" x="22" y="43" width="52" height="18" rx="2"/><text class="tag dark" x="48" y="55.5" text-anchor="middle">GATE</text>
        <text class="s" x="86" y="56">Human-in-the-loop: weekly proposals reviewed &amp; approved</text>
        <rect class="b2" x="22" y="65" width="52" height="18" rx="2"/><text class="tag" x="48" y="77.5" text-anchor="middle">SAFE</text>
        <text class="s em" x="86" y="78">Never drifts silently · zero unvetted identity mutation</text>
      </g>
      <g transform="translate(40, 372)">
        <rect class="fj" width="640" height="90" rx="2"/>
        <text class="k" x="22" y="25">4. MADOROMI (DREAMS)</text><text class="s sm dim" x="236" y="25">dreams/ · idle reflection</text>
        <rect class="chip" x="510" y="9" width="108" height="20" rx="10"/><text class="tag" x="564" y="22.5" text-anchor="middle">IDLE CYCLE</text>
        <path class="hr" d="M22 35H618"/>
        <rect class="b2" x="22" y="43" width="52" height="18" rx="2"/><text class="tag" x="48" y="55.5" text-anchor="middle">WORK</text>
        <text class="s" x="86" y="56">Autonomous dream-work (displacement &amp; condensation)</text>
        <rect class="b" x="22" y="65" width="52" height="18" rx="2"/><text class="tag dim" x="48" y="77.5" text-anchor="middle">SEED</text>
        <text class="s dim" x="86" y="78">Spontaneous insight fragments surfaced after quiet hours</text>
      </g>
      <path class="hr" d="M40 478H680"/>
      <text class="l" x="40" y="504">ZERO DATABASE LOCK-IN</text><text class="s dim" x="680" y="504" text-anchor="end">100% plain Markdown on local disk</text>`,
    'sch-lane': () => `${POOL('pl-lane', 360, 270, 340, 220, .14)}
      <text class="l" x="40" y="42">MULTI-LANE ARCHITECTURE</text><text class="k dim" x="680" y="42" text-anchor="end">Decoupled Brain &amp; Memory</text>
      <path class="hr" d="M40 56H680"/>
      <g transform="translate(40, 72)">
        <rect class="fr" width="284" height="390" rx="3"/>
        <text class="l" x="20" y="30">SWAPPABLE BRAINS</text>
        <path class="hr" d="M20 42H264"/>
        <g transform="translate(16, 54)">
          <rect class="fj" width="252" height="68" rx="2"/>
          <circle cx="18" cy="23" r="4" fill="var(--ember)"/>
          <text class="k" x="32" y="27">DeepSeek DSH</text>
          <rect class="chip on" x="166" y="13" width="72" height="20" rx="10"/><text class="tag" x="202" y="26.5" text-anchor="middle">ACTIVE</text>
          <text class="s sm dim" x="32" y="50">Bash sandbox · subagents · live lane</text>
        </g>
        <g transform="translate(16, 134)">
          <rect class="fj" width="252" height="68" rx="2"/>
          <circle cx="18" cy="23" r="4" fill="rgba(235,229,218,.32)"/>
          <text class="k" x="32" y="27">Claude Code</text>
          <rect class="chip" x="166" y="13" width="72" height="20" rx="10"/><text class="tag dim" x="202" y="26.5" text-anchor="middle">STANDBY</text>
          <text class="s sm dim" x="32" y="50">Opus 4.6 · headless supervisor</text>
        </g>
        <g transform="translate(16, 214)">
          <rect class="fj" width="252" height="68" rx="2"/>
          <circle cx="18" cy="23" r="4" fill="rgba(235,229,218,.32)"/>
          <text class="k" x="32" y="27">Local Models</text>
          <rect class="chip" x="166" y="13" width="72" height="20" rx="10"/><text class="tag dim" x="202" y="26.5" text-anchor="middle">LOCAL</text>
          <text class="s sm dim" x="32" y="50">Ollama · Sherpa · ONNX runtime</text>
        </g>
        <g transform="translate(16, 294)">
          <rect class="fj" width="252" height="68" rx="2"/>
          <circle cx="18" cy="23" r="4" fill="rgba(235,229,218,.32)"/>
          <text class="k" x="32" y="27">Custom Lanes</text>
          <rect class="chip" x="166" y="13" width="72" height="20" rx="10"/><text class="tag dim" x="202" y="26.5" text-anchor="middle">PROXY</text>
          <text class="s sm dim" x="32" y="50">Codex proxy · OpenAI endpoints</text>
        </g>
      </g>
      <rect class="bubble" x="330" y="96" width="60" height="22" rx="11"/><text class="tag em" x="360" y="110.5" text-anchor="middle">SWAP</text>
      <path class="st" d="M324 160H388M324 240H360M324 320H360M324 400H360M360 400V160" stroke-width="1.5"/>
      <polygon points="386,155.5 395,160 386,164.5" fill="var(--ember)"/>
      <g transform="translate(396, 72)">
        <rect class="fj" width="284" height="390" rx="3"/>
        <text class="l" x="20" y="30">PERMANENT MEMORY</text>
        <path class="hr" d="M20 42H264"/>
        <rect class="hl" x="16" y="54" width="252" height="68" rx="2"/>
        <text class="k" x="32" y="80">LIVING CONTEXT</text>
        <text class="s sm em" x="32" y="104">Unbroken across model swaps</text>
        <path class="hr" d="M16 138H268"/>
        <rect class="hl" x="16" y="153" width="18" height="18" rx="2"/><text class="tag em" x="25" y="165.5" text-anchor="middle">✓</text><text class="s sm" x="44" y="166">All session notes &amp; daily history</text>
        <rect class="hl" x="16" y="185" width="18" height="18" rx="2"/><text class="tag em" x="25" y="197.5" text-anchor="middle">✓</text><text class="s sm" x="44" y="198">Human feedback &amp; locked rules</text>
        <rect class="hl" x="16" y="217" width="18" height="18" rx="2"/><text class="tag em" x="25" y="229.5" text-anchor="middle">✓</text><text class="s sm" x="44" y="230">Evolved persona &amp; work habits</text>
        <rect class="hl" x="16" y="249" width="18" height="18" rx="2"/><text class="tag em" x="25" y="261.5" text-anchor="middle">✓</text><text class="s sm" x="44" y="262">Unfinished project threads</text>
        <rect class="hl" x="16" y="281" width="18" height="18" rx="2"/><text class="tag em" x="25" y="293.5" text-anchor="middle">✓</text><text class="s sm" x="44" y="294">In-flight companion tasks</text>
        <rect class="chip on" x="16" y="326" width="252" height="36" rx="2"/><text class="k" x="142" y="348.5" text-anchor="middle">PERMANENT ANCHOR</text>
      </g>
      <path class="hr" d="M40 478H680"/>
      <text class="l" x="40" y="504">ZERO CONTEXT LOSS</text><text class="s dim" x="680" y="504" text-anchor="end">Change the model anytime; keep every memory</text>`,
    'sch-channel': () => `${POOL('pl-chan', 500, 260, 320, 220, .14)}
      <text class="l" x="40" y="42">EVERYWHERE YOU WORK</text><text class="k dim" x="680" y="42" text-anchor="end">Multi-Channel &amp; Voice</text>
      <path class="hr" d="M40 56H680"/>
      <g transform="translate(40, 72)">
        <rect class="fj" width="304" height="120" rx="2"/>
        <text class="l" x="22" y="30">DISCORD</text>
        <rect class="chip on" x="176" y="13" width="106" height="20" rx="10"/><text class="tag" x="229" y="26.5" text-anchor="middle">#CHANNELS</text>
        <path class="hr" d="M22 44H282"/>
        <text class="s em" x="22" y="72">Native bot bridge for threads &amp; voice</text>
        <text class="s sm dim" x="22" y="96">Streams text, files, and audio directly</text>
      </g>
      <g transform="translate(40, 207)">
        <rect class="fj" width="304" height="120" rx="2"/>
        <text class="l" x="22" y="30">SLACK</text>
        <rect class="chip" x="176" y="13" width="106" height="20" rx="10"/><text class="tag" x="229" y="26.5" text-anchor="middle">SOCKET MODE</text>
        <path class="hr" d="M22 44H282"/>
        <text class="s em" x="22" y="72">Direct messages &amp; workspace channels</text>
        <text class="s sm dim" x="22" y="96">Zero inbound ports · enterprise safe</text>
      </g>
      <g transform="translate(40, 342)">
        <rect class="fj" width="304" height="120" rx="2"/>
        <text class="l" x="22" y="30">TELEGRAM</text>
        <rect class="chip" x="176" y="13" width="106" height="20" rx="10"/><text class="tag" x="229" y="26.5" text-anchor="middle">MOBILE RELAY</text>
        <path class="hr" d="M22 44H282"/>
        <text class="s em" x="22" y="72">Instant smartphone handoff &amp; relay</text>
        <text class="s sm dim" x="22" y="96">Urgent alerts &amp; mobile continuity</text>
      </g>
      <g transform="translate(364, 72)">
        <rect class="fj" width="316" height="390" rx="3"/>
        <text class="l" x="22" y="30">COMPANION &amp; CALL MODE</text>
        <path class="hr" d="M22 44H294"/>
        <g transform="translate(22, 58)">
          <rect class="fr" width="272" height="104" rx="2"/>
          <circle cx="44" cy="52" r="30" class="fr on"/>
          <image href="${url('assets/scheherazade-256.png')}" x="20" y="28" width="48" height="48"/>
          <rect class="bubble" x="88" y="18" width="166" height="68" rx="6"/>
          <text class="s sm em" x="104" y="46">작업 완료했습니다.</text>
          <text class="s sm dim" x="104" y="68">결과를 확인해 보실래요?</text>
        </g>
        <g transform="translate(22, 176)">
          <rect class="fr" width="272" height="136" rx="2"/>
          <text class="k" x="18" y="27">CALL MODE · VOICE</text>
          <rect class="chip on" x="182" y="11" width="72" height="20" rx="10"/><text class="tag" x="218" y="24.5" text-anchor="middle">LIVE</text>
          <path class="hr" d="M18 40H254"/>
          <g transform="translate(18, 52)">
            ${[14, 28, 12, 36, 24, 16, 10, 24, 34, 18, 12, 28, 16, 22].map((h, i) => `<rect class="${i % 2 === 0 ? 'bg' : 'b2'}" x="${i * 7.5}" y="${18 - h / 2}" width="4" height="${h}" rx="2"/>`).join('')}
          </g>
          <text class="s sm em" x="136" y="64">Kyutai Pocket-TTS</text>
          <text class="s sm dim" x="136" y="84">Sherpa-ONNX STT</text>
          <path class="hr" d="M18 100H254"/>
          <text class="s sm dim" x="18" y="120">On-device Korean speech &amp; voice synthesis</text>
        </g>
        <rect class="chip on" x="22" y="328" width="272" height="40" rx="2"/><text class="k" x="158" y="352.5" text-anchor="middle">MIC &amp; VOICE INTERACTIVE</text>
      </g>
      <path class="hr" d="M40 478H680"/>
      <text class="l" x="40" y="504">ALWAYS WITHIN REACH</text><text class="s dim" x="680" y="504" text-anchor="end">Living where you communicate and think</text>`,
    'sch-profile': () => `${POOL('pl-prof', 360, 270, 320, 220, .14)}
      <text class="l" x="40" y="42">MULTI-PROFILE SYSTEM</text><text class="k dim" x="680" y="42" text-anchor="end">Scheherazade</text>
      <path class="hr" d="M40 56H680"/>
      <g transform="translate(40, 72)">
        <rect class="fr" width="640" height="42" rx="2"/>
        <text class="s sm em" x="20" y="26">One computer · Multiple concurrent Seras · Strictly isolated contexts</text>
        <rect class="chip on" x="506" y="10" width="114" height="22" rx="11"/><text class="tag" x="563" y="24.5" text-anchor="middle">3 INSTANCES</text>
      </g>
      <g transform="translate(40, 128)">
        <rect class="fj" width="202" height="334" rx="3"/>
        <rect class="chip on" x="18" y="18" width="88" height="22" rx="11"/><text class="tag" x="62" y="32.5" text-anchor="middle">DEFAULT</text>
        <text class="t" x="18" y="70">Sera Alpha</text>
        <text class="l sm" x="18" y="92">RESEARCH &amp; DEV</text>
        <path class="hr" d="M18 108H184"/>
        <text class="tag dim" x="18" y="130">MEMORY DIRECTORY</text>
        <text class="s sm dim" x="18" y="150">~/Documents/</text>
        <text class="s sm em" x="18" y="168">Scheherazade/</text>
        <path class="hr" d="M18 186H184"/>
        <text class="tag dim" x="18" y="208">CHANNEL &amp; MODEL</text>
        <text class="s sm em" x="18" y="228">Discord #general</text>
        <text class="s sm dim" x="18" y="246">Claude Opus 4.6</text>
        <path class="st" d="M18 268H184" stroke-width="1"/>
        <rect class="hl" x="18" y="282" width="166" height="34" rx="2"/><text class="tag" x="101" y="302.5" text-anchor="middle">PORT 4100 · ACTIVE</text>
      </g>
      <g transform="translate(259, 128)">
        <rect class="fj" width="202" height="334" rx="3"/>
        <rect class="chip" x="18" y="18" width="88" height="22" rx="11"/><text class="tag" x="62" y="32.5" text-anchor="middle">PROFILE 02</text>
        <text class="t" x="18" y="70">Sera Craft</text>
        <text class="l sm" x="18" y="92">CREATIVE LAB</text>
        <path class="hr" d="M18 108H184"/>
        <text class="tag dim" x="18" y="130">MEMORY DIRECTORY</text>
        <text class="s sm dim" x="18" y="150">~/Documents/</text>
        <text class="s sm em" x="18" y="168">Scheherazade-craft/</text>
        <path class="hr" d="M18 186H184"/>
        <text class="tag dim" x="18" y="208">CHANNEL &amp; MODEL</text>
        <text class="s sm em" x="18" y="228">Slack #creative</text>
        <text class="s sm dim" x="18" y="246">DeepSeek DSH</text>
        <path class="st" d="M18 268H184" stroke-width="1"/>
        <rect class="hl" x="18" y="282" width="166" height="34" rx="2"/><text class="tag" x="101" y="302.5" text-anchor="middle">PORT 4101 · ACTIVE</text>
      </g>
      <g transform="translate(478, 128)">
        <rect class="fj" width="202" height="334" rx="3"/>
        <rect class="chip" x="18" y="18" width="88" height="22" rx="11"/><text class="tag" x="62" y="32.5" text-anchor="middle">PROFILE 03</text>
        <text class="t" x="18" y="70">Sera Local</text>
        <text class="l sm" x="18" y="92">OFFLINE PRIVACY</text>
        <path class="hr" d="M18 108H184"/>
        <text class="tag dim" x="18" y="130">MEMORY DIRECTORY</text>
        <text class="s sm dim" x="18" y="150">~/Documents/</text>
        <text class="s sm em" x="18" y="168">Scheherazade-local/</text>
        <path class="hr" d="M18 186H184"/>
        <text class="tag dim" x="18" y="208">CHANNEL &amp; MODEL</text>
        <text class="s sm em" x="18" y="228">Local Companion</text>
        <text class="s sm dim" x="18" y="246">Ollama Qwen-2.5</text>
        <path class="st" d="M18 268H184" stroke-width="1"/>
        <rect class="hl" x="18" y="282" width="166" height="34" rx="2"/><text class="tag" x="101" y="302.5" text-anchor="middle">PORT 4102 · ACTIVE</text>
      </g>
      <path class="hr" d="M40 478H680"/>
      <text class="l" x="40" y="504">STRICT DATA ISOLATION</text><text class="s dim" x="680" y="504" text-anchor="end">Independent memory trees, tokens, and channels</text>`,
    'sch-autonomy': () => `${POOL('pl-auto', 360, 260, 340, 220, .14)}
      <text class="l" x="40" y="42">19-HOOK DETERMINISTIC ENGINE</text><text class="k dim" x="680" y="42" text-anchor="end">Safety &amp; Verification Gates</text>
      <path class="hr" d="M40 56H680"/>
      <g transform="translate(40, 72)">
        <rect class="fr" width="640" height="46" rx="2"/>
        <rect class="fj" x="14" y="9" width="136" height="28" rx="2"/><text class="tag em" x="82" y="26.5" text-anchor="middle">SESSION START (1)</text>
        <text class="s sm dim" x="161" y="27.5" text-anchor="middle">→</text>
        <rect class="fj" x="172" y="9" width="136" height="28" rx="2"/><text class="tag em" x="240" y="26.5" text-anchor="middle">PRE-TOOL USE (7)</text>
        <text class="s sm dim" x="319" y="27.5" text-anchor="middle">→</text>
        <rect class="fj" x="330" y="9" width="136" height="28" rx="2"/><text class="tag em" x="398" y="26.5" text-anchor="middle">POST-TOOL USE (3)</text>
        <text class="s sm dim" x="477" y="27.5" text-anchor="middle">→</text>
        <rect class="fj" x="488" y="9" width="136" height="28" rx="2"/><text class="tag em" x="556" y="26.5" text-anchor="middle">STOP GUARDS (5)</text>
      </g>
      <g transform="translate(40, 132)">
        <rect class="fj" width="312" height="162" rx="2"/>
        <text class="l" x="22" y="30">RUMINATION GATE</text>
        <path class="hr" d="M22 42H290"/>
        <text class="s em" x="22" y="66">Holds back unverified completion</text>
        <text class="s sm dim" x="22" y="88">Pauses replies claiming premature success</text>
        <text class="s sm dim" x="22" y="108">Refuses completion claims until verified</text>
        <rect class="chip on" x="22" y="122" width="152" height="24" rx="12"/><text class="tag" x="98" y="137.5" text-anchor="middle">BLOCKING · EXIT 2</text>
      </g>
      <g transform="translate(368, 132)">
        <rect class="fj" width="312" height="162" rx="2"/>
        <text class="l" x="22" y="30">CREDENTIAL GUARD</text>
        <path class="hr" d="M22 42H290"/>
        <text class="s em" x="22" y="66">Blocks unauthorized system reads</text>
        <text class="s sm dim" x="22" y="88">Protects macOS keychain &amp; secret tokens</text>
        <text class="s sm dim" x="22" y="108">Isolates sibling agent environments</text>
        <rect class="chip on" x="22" y="122" width="138" height="24" rx="12"/><text class="tag" x="91" y="137.5" text-anchor="middle">HARD FIREWALL</text>
      </g>
      <g transform="translate(40, 308)">
        <rect class="fj" width="640" height="154" rx="2"/>
        <text class="l" x="22" y="28">BACKGROUND CADENCE ENGINE</text><text class="tag dim" x="618" y="27" text-anchor="end">AUTONOMOUS CLOCKS</text>
        <path class="hr" d="M22 40H618"/>
        <rect class="hl" x="22" y="52" width="124" height="20" rx="2"/><text class="tag em" x="84" y="65.5" text-anchor="middle">DAILY CLOCK</text>
        <text class="s sm" x="160" y="66">Stale session archiving &amp; overnight journal compression</text>
        <rect class="hl" x="22" y="84" width="124" height="20" rx="2"/><text class="tag em" x="84" y="97.5" text-anchor="middle">PERSONA REFLUX</text>
        <text class="s sm" x="160" y="98">Weekly human-reviewed identity evolution &amp; approval</text>
        <rect class="hl" x="22" y="116" width="124" height="20" rx="2"/><text class="tag em" x="84" y="129.5" text-anchor="middle">IDLE IMPULSE</text>
        <text class="s sm" x="160" y="130">Autonomous dream-work generated during quiet hours</text>
      </g>
      <path class="hr" d="M40 478H680"/>
      <text class="l" x="40" y="504">DETERMINISTIC SAFETY</text><text class="s dim" x="680" y="504" text-anchor="end">Engineered for long-running autonomous stability</text>`
  };
  /* Anatomy-guided figures (kind 'fig', 2026-10-12): isometric machine drawings kept as standalone SVG files in assets/,
     shown as images so their own styles never meet the site's. Drawn concepts, labelled as graphics: not app internals
     and not model output. Built from the approved Design mockups (Main/Sera) with the dark palette only; no text inside. */

  const PROJECTS = [
    {
      id: 'scheherazade',
      title: 'Scheherazade',
      title_ko: '',
      headline: 'An agent that lasts a thousand and one nights',
      summary: 'Change the model as often as you like; the conversations and rules you built together stay. The tedious, tangled work gets lighter.',
      description: [
        [
          { display: 'You never have to explain yourself twice. It already knows how you like things.' },
          'The fatigue of teaching a new chat window from scratch is gone. The small exchange from yesterday, the working rule you set last month: it sorts them out on its own and keeps them on your computer.',
          '"Make me a cheat sheet for the exam."\nIt already knows which two question types you got wrong last time and puts those first. You do not have to say which exam, which unit, or what you struggled with.'
        ],
        [
          { display: 'No new subscription. Plug in the one you already pay for.' },
          'You do not have to buy a second expensive seat on a dedicated service. Connect the account you already have: Claude Code, Codex, Ollama Cloud.',
          'Curious about the new Kimi, or a benchmark leader just landed?\nKeep the memory, swap only the brain. Your conversations and the way you work stay on your machine.'
        ],
        [
          { display: 'Away from the desk? Drop a line from your phone and it gets done.' },
          'No launching an app, no composing a prompt. Message it the way you would ask a friend, on the messenger you already use, or out loud.',
          'On the subway home, one message in Discord or Slack.\n"Game night with friends tonight. Update the modpack and get the server running."\nWalking, and typing is a hassle? Turn on Call Mode and just ask. "Did the thing I asked for go through? Any conflicts?"\nBack at your desk, it is already set up. You just play.'
        ]
      ],
      ko: {
        headline: '천하루밤도 버티는 에이전트',
        summary: '모델을 수없이 갈아끼워도 당신과 쌓아온 대화와 규칙은 그대로 남아, 귀찮고 복잡한 일도 한결 가볍게 풀어줍니다.',
        description: [
          [
            { display: '매번 구구절절 설명하지 않아도, 내 취향과 방식을 이미 알고 있어요.' },
            '새 창을 열 때마다 처음부터 다시 가르쳐야 했던 피로감이 사라집니다. 어제 나눈 소소한 대화부터 지난달에 정해둔 작업 규칙까지, 스스로 정리해 내 컴퓨터에 온전히 남겨둡니다.',
            '"시험 치트시트 하나 만들어줘."\n지난번에 어느 유형을 틀렸는지 이미 알고 있으니, 그쪽부터 짚어서 만들어 줍니다. 어떤 시험이고 어디까지인지, 뭘 헷갈려 했는지 설명할 필요가 없습니다.'
          ],
          [
            { display: '새로 결제할 필요 없이, 이미 쓰던 구독 모델을 꽂아 쓰세요.' },
            '에이전트를 쓰겠다고 전용 서비스에 비싼 돈을 더 낼 필요가 없습니다. Claude Code, Codex, Ollama Cloud까지, 이미 구독 중인 계정을 그대로 연결하면 됩니다.',
            '새 Kimi가 써보고 싶어졌거나, 벤치마크가 더 잘 나오는 모델이 나왔나요?\n쓰던 기억은 그대로 두고 두뇌만 슥 바꿔 쓰세요. 나눈 대화와 작업 방식은 내 컴퓨터에 고스란히 남아 있습니다.'
          ],
          [
            { display: '컴퓨터 앞에 앉지 않아도, 폰으로 툭 던져두면 알아서 해둡니다.' },
            '새 프로그램을 켜고 프롬프트를 고민할 필요가 없습니다. 늘 쓰던 메신저나 음성 통화로, 친구에게 부탁하듯 편하게 말을 걸어보세요.',
            '퇴근길 지하철에서 스마트폰 디스코드나 슬랙으로 툭 남깁니다.\n"오늘 저녁에 친구들이랑 게임할 건데, 모드팩 최신으로 업데이트하고 서버 좀 돌려놔."\n걷는 중이라 타자가 번거로우면 콜 모드를 켜서 전화하듯 물어보세요. "아까 시킨 거 잘 됐어? 충돌 난 건 없고?"\n집에 도착해 컴퓨터를 켜면 세팅이 끝나 있어, 바로 플레이만 하면 됩니다.'
          ]
        ]
      },
      action: { label: 'Get', href: 'download', os: true }, /* os: Get opens the Mac / Windows / Linux chooser */
      field: 'sch',
      art: [0, 1, 2],
      panels: [
        { kind: 'chat',
          cap: 'Real exchange · Memory that survives a model swap',
          capKo: '실제 대화 · 모델을 바꿔도 남는 기억',
          alt: 'Chat figure: the user asks for an exam cheat sheet, the agent shows the line it edited in memory (items 3, and 2 and 5 marked wrong), answers that it emphasised those question types last time, and hands over a five-item sheet with items 2 and 5 highlighted.',
          altKo: '대화 그림: 사용자가 시험 치트시트를 요청하면, 에이전트가 기억 파일에서 고친 줄(3번, 그리고 2번과 5번 틀림)을 보여주고, 지난번에 그 유형을 틀렸다고 강조했다고 답한 뒤, 2번과 5번이 강조된 다섯 문항짜리 치트시트를 건넨다.',
          en: [
            { t: 'bub', side: 'in', p: [{ s: 'Make me a cheat sheet for the exam' }] },
            { t: 'sys', k: 'memory/quiz_grades.md', l: [
              { s: 'Item 3 · correct', del: 1 },
              { s: 'Items 2, 5 · wrong → emphasise', add: 1 } ] },
            { t: 'bub', side: 'out', p: [{ s: 'You got ' }, { s: '2 and 5', em: 1 }, { s: ' wrong last time, so I emphasised those question types' }] },
            { t: 'sheet', k: 'CHEAT SHEET · 5 ITEMS', rows: [
              { n: '1', w: 60 }, { n: '2', w: 78, on: 1 }, { n: '3', w: 50 }, { n: '4', w: 66 }, { n: '5', w: 72, on: 1 } ] }
          ],
          ko: [
            { t: 'bub', side: 'in', p: [{ s: '시험 치트시트 하나 만들어줘' }] },
            { t: 'sys', k: 'memory/quiz_grades.md', l: [
              { s: '3번 문제 · 맞음', del: 1 },
              { s: '2번, 5번 · 틀림 → 강조 대상', add: 1 } ] },
            { t: 'bub', side: 'out', p: [{ s: '지난번에 ' }, { s: '2번, 5번', em: 1 }, { s: ' 틀렸어서 비슷한 유형 위주로 강조해놨어' }] },
            { t: 'sheet', k: 'CHEAT SHEET · 5문항', rows: [
              { n: '1', w: 60 }, { n: '2', w: 78, on: 1 }, { n: '3', w: 50 }, { n: '4', w: 66 }, { n: '5', w: 72, on: 1 } ] }
          ] },
        { kind: 'chat',
          cap: 'Real exchange · Swap the model, keep the memory',
          capKo: '실제 대화 · 두뇌만 바꿔 끼우기',
          alt: 'Chat figure: the user asks whether the newly released Kimi K3.1 can be used, the agent writes itself a task for November 5 to check the weights release, and answers that it is not on ollama cloud yet and it will look again around the fifth.',
          altKo: '대화 그림: 사용자가 새로 나온 Kimi K3.1을 쓸 수 있는지 묻자, 에이전트가 11월 5일 가중치 공개를 확인하는 할 일을 스스로 적고, ollama cloud에는 아직 없으니 5일쯤 다시 찾아보겠다고 답한다.',
          en: [
            { t: 'bub', side: 'in', p: [{ s: 'Kimi K3.1 came out yesterday. Can we use it?' }] },
            { t: 'sys', k: 'memory/tasks.md', l: [
              { s: '+ Nov 5 · check kimi-k3.1 weights → add to ollama cloud', add: 1 } ] },
            { t: 'bub', side: 'out', p: [{ s: 'Not on ollama cloud yet. Weights drop ' }, { s: 'Nov 4', em: 1 }, { s: ', so I will check again around ' }, { s: 'the 5th', em: 1 }, { s: ' and add it' }] }
          ],
          ko: [
            { t: 'bub', side: 'in', p: [{ s: '어제 Kimi K3.1 나왔던데 쓸 수 있나?' }] },
            { t: 'sys', k: 'memory/tasks.md', l: [
              { s: '+ 11-05 · kimi-k3.1 가중치 공개 확인 → ollama cloud 추가', add: 1 } ] },
            { t: 'bub', side: 'out', p: [{ s: 'ollama cloud에는 아직 안올라왔더라. 가중치 공개가 ' }, { s: '11월 4일', em: 1 }, { s: '이라니까 ' }, { s: '5일쯤', em: 1 }, { s: '에 내가 한번 더 찾아보고 추가해둘게' }] }
          ] },
        { kind: 'chat',
          cap: 'Real exchange · Phone and desk, one thread',
          capKo: '실제 대화 · 폰과 컴퓨터가 한 줄로',
          alt: 'Chat figure: one conversation, a message from the phone at 07:41 asking to update the modpack and bring the server up, a note that the thread carries across devices, and the answer waiting at 09:12 on the desk that the server is up with no conflicts.',
          altKo: '대화 그림: 하나의 대화. 07:41 폰에서 모드팩을 업데이트하고 서버를 켜달라고 보내고, 대화가 기기를 넘어 이어진다는 줄을 거쳐, 09:12 데스크톱에서 서버가 켜졌고 충돌이 없다는 답이 기다린다.',
          en: [
            { t: 'bub', side: 'in', time: '07:41', p: [{ s: 'Game night. Update the modpack and get the server up' }] },
            { t: 'sys', k: 'chat/thread.md', l: [
              { s: '07:41 phone → 09:12 desk · same conversation', add: 1 } ] },
            { t: 'bub', side: 'out', time: '09:12', p: [{ s: 'Server is up. No conflicts' }] }
          ],
          ko: [
            { t: 'bub', side: 'in', time: '07:41', p: [{ s: '게임할 건데 모드팩 업뎃하고 서버 켜놔' }] },
            { t: 'sys', k: 'chat/thread.md', l: [
              { s: '07:41 폰 → 09:12 데스크톱 · 같은 대화', add: 1 } ] },
            { t: 'bub', side: 'out', time: '09:12', p: [{ s: '서버 켜놨어. 충돌 없음' }] }
          ] },
        { kind: 'feat', feat: 'sch-profile', cap: 'Feature graphic · Multi-Profile System', capKo: '설명 그림 · 멀티프로필 시스템', altKo: '설명 그림: 세헤라자데 멀티프로필 아키텍처 — 한 대의 컴퓨터에서 각기 다른 기억 폴더, 개별 토큰, 전용 메신저 채널을 가진 여러 명의 세라를 동시에 독립 실행하는 모습.', alt: 'Feature graphic: Scheherazade multi-profile architecture — running multiple Seras simultaneously on a single machine, each with an isolated memory directory, separate API credentials, and dedicated chat channels.' },
        { kind: 'feat', feat: 'sch-autonomy', cap: 'Feature graphic · 19-Hook Engine & Guardrails', capKo: '설명 그림 · 19개 훅 엔진과 자율성 가드레일', altKo: '설명 그림: 결정론적 안전성과 자율성 파이프라인 — 섣부른 완료 주장을 차단하는 반추 게이트(Rumination Gate), 시스템 크리덴셜 및 키체인 방화벽, 일일 자율 주기 시계를 제어하는 19개 훅 시스템.', alt: 'Feature graphic: Deterministic safety and autonomy pipeline — nineteen lifecycle hooks enforcing the rumination gate against unverified claims, protecting credentials and keychain, and orchestrating background cadence clocks.' }
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
      description: [
        'We fine-tune open-source generative models to CHOAM’s own illustration style for character and background art.',
        'Filtering out muddy generated colors and laying down a clean watercolor wash with particular attention to the eyes.',
        'From narrative classroom scenes to solo portraits, every piece preserves painterly textures and hand-crafted nuance.',
        'Balancing the delicate light of watercolor with rich brushwork to build living, breathing visual worlds.',
        'The signature aesthetic extends across all of CHOAM\'s universes, from quiet schoolrooms to oceanic voyages.',
        'Compare a recorded GPT Image original with its DAT finish. The pass changes brushwork and some scene details, not just image noise.'
      ],
      ko: {
        status: '자체 스타일 모델',
        headline: '우리 화풍을 직접 학습한 일러스트 모델',
        summary: '오픈소스 생성형 모델을 초암 고유의 그림체에 맞게 직접 파인튜닝해 캐릭터와 배경 리소스를 만듭니다. 기존 생성 이미지의 탁한 색감을 걷어내고 맑은 수채 질감과 붓 결을 입혀 우리만의 화풍으로 완성합니다.',
        description: [
          '오픈소스 생성형 모델을 초암 고유의 그림체에 맞게 직접 파인튜닝해 캐릭터와 배경 리소스를 만듭니다.',
          '기존 생성 이미지의 탁한 색감을 걷어내고, 맑은 수채 질감과 눈가 붓 터치를 입혀 우리만의 화풍으로 완성합니다.',
          '서사적인 교실 풍경부터 인물 포트레이트까지, 손으로 빚어낸 듯한 회화적 밀도를 균일하게 유지합니다.',
          '수채화의 투명한 빛과 묵직한 질감의 조화를 통해 살아 숨 쉬는 세계의 시각적 기준을 세웁니다.',
          '고요한 교실의 오후부터 머나먼 바다의 갑판까지, 초암이 짓는 모든 세계관의 시각적 뼈대가 됩니다.',
          '기록된 GPT Image 원본과 DAT 적용 후 비교. 붓 결과 장면의 일부 세부 모양도 달라짐. 노이즈만 제거한 결과는 아님.'
        ]
      },
      art: [0, 1, 2, 3, 4, 5],
      panels: [
        { kind: 'art', src: 'assets/dat-02.webp', altKo: '선잠 DOZE 일러스트: 교실 책상 사이를 걸어오는 서아', alt: 'DAT illustration: Seoa walking between classroom desks', pos: '50% 50%', posM: '27% 35%' },
        { kind: 'art', src: 'assets/dat-01.webp', altKo: '선잠 DOZE 일러스트: 수족관 창가 앞 노을빛 교실에 선 예지', alt: '선잠 DOZE illustration: Yeji standing in the sunset classroom before the aquarium window', pos: '50% 50%', posM: '53% 32%' },
        { kind: 'art', src: 'assets/dat-03.webp', altKo: '서아 수채화 피니시 일러스트: 맑은 수채 질감과 눈매가 돋보이는 단독 포트레이트', alt: 'Seoa watercolor finish illustration: portrait with clear watercolor textures and distinct eyes', pos: '50% 50%', posM: '43% 30%' },
        { kind: 'art', src: 'assets/dat-04.webp', altKo: '예지 수채화 포즈 일러스트: 꽃과 드레스의 섬세한 붓결이 담긴 수채화', alt: 'Yeji watercolor pose illustration: watercolor with delicate flowers and dress brushwork', pos: '50% 50%', posM: '65% 35%' },
        { kind: 'art', src: 'assets/dat-05.webp', altKo: '마리나 오디세이 일러스트: 아르고호 갑판의 시험관들과 수평선 너머 바다 풍경', alt: 'Marina Odyssey illustration: Chemistry beakers on the Argo deck overlooking the horizon', pos: '50% 50%', posM: '42% 35%' },
        { kind: 'compare' }
      ],
      /* Existing recorded, aligned source/output pairs; no reprocessing or new image. */
      comparisons: [
        { id: 'shrine', label: 'Shrine leaf', labelKo: '신사 · 나뭇잎', beforeLabel: 'GPT Image', beforeLabelKo: 'GPT Image 원본', before: 'assets/dat-case-original.webp', after: 'assets/dat-case-dat.webp', width: 1536, height: 1020,
          note: 'DAT 0.15 · Brush texture changes, with some costume and accessory details redrawn.', noteKo: 'DAT 0.15 · 붓 결이 달라지고, 의상과 장신구 일부도 바뀐 장면' },
        { id: 'classroom', label: 'Classroom', labelKo: '교실', before: 'assets/dat_classroom_before.png', after: 'assets/dat_classroom_after.png', width: 1672, height: 936, detailPoint: [.25, .78],
          note: 'DAT 0.15 · Original 1672×941, shared view 1672×936: 2 px above and 3 px below trimmed, no stretching. Ornament shapes also change.', noteKo: 'DAT 0.15 · 원본 1672×941 → 비교 1672×936. 위 2px와 아래 3px만 제외하고 같은 배율로 보여줌. 장신구 모양도 바뀐 장면' },
        { id: 'idea', label: 'IDEA', labelKo: 'IDEA', beforeLabel: 'GPT Image', beforeLabelKo: 'GPT Image 원본', before: 'assets/dat_v11_idea_before.png', after: 'assets/dat_v11_idea_after.png', width: 928, height: 1136, detailPoint: [.7, .74],
          note: 'DAT 0.15 · The left, black-haired IDEA, cropped to the identical 928×1136 region. Hair ornaments, jewelry and textile details also change.', noteKo: 'DAT 0.15 · 왼쪽 흑발 IDEA를 같은 위치의 928×1136 영역으로 잘라 비교함. 머리 장식과 장신구, 옷의 세부 모양도 달라짐' }
      ],
      info: { kind: 'art', src: 'assets/dat-03.webp', pos: '50% 50%', posM: '43% 30%', side: 'end' }
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
        'A hot-spring inn management game where farming, cooking, and hospitality meet yokai deduction.',
        'Three fox spirits borrow money from a tanuki to turn their forgotten mountain shrine into a hot-spring inn.',
        'Over 100 days, management and deduction run side by side from morning prep to evening check-in.',
        'Gather ingredients, cook each course, lay the spring pipes, and tend the rooms and baths.',
        'Some guests are yokai passing as human. Watch how they act, compare notes, and make your call before checkout.'
      ],
      ko: {
        status: '출시 준비 중',
        headline: '고요한 숲속 여관 이야기',
        summary: '발길이 끊긴 산속 신사의 여우 신들이 너구리에게 빚을 내 온천 료칸을 엽니다. 100일 동안 밭을 일구고 요리와 객실을 돌보는 와중에, 손님들의 행동을 살펴 인간으로 둔갑한 요괴를 가려내야 합니다.',
        description: [
          '동구리 료칸은 밭일과 요리, 숙박업에 요괴 추리를 더한 경영 게임입니다.',
          '발길이 끊긴 산속 신사의 여우 신들이 너구리에게 빚을 내 온천 료칸을 엽니다.',
          '하루 안에 경영과 추리가 쉼 없이 이어지는, 손이 바쁜 게임을 만들고 싶었습니다.',
          '플레이어는 직접 재료를 구하고 음식을 만들며, 객실과 온천도 관리합니다.',
          '그 와중에 손님의 행동을 유심히 살펴 누가 요괴인지 체크아웃 전까지 알아내야 합니다.'
        ]
      },
      art: [0, 1, 2, 3, 4],
      panels: [
        { kind: 'art', src: 'assets/ryokan_kv_C2.webp', altKo: 'Donguri Ryokan 키 아트: 기모노를 입은 여우 소녀와 너구리 소녀가 밤 툇마루에서 불 켜진 장지문 뒤 그림자를 엿보는 모습', alt: 'Donguri Ryokan key art: fox and tanuki girls in kimono on a night veranda, peering at a silhouette behind a lit shoji screen', pos: '50% 30%', posM: '47% 50%' },
        { kind: 'art', src: 'assets/ryokan_loan.webp', altKo: 'Donguri Ryokan 컨셉 아트: 산속 신사의 세 여우 신이 너구리 코가네 앞에서 차용증에 도장을 찍는 모습', alt: 'Donguri Ryokan concept art: three fox spirits stamping a loan contract across a low table from the tanuki Kogane', pos: '50% 35%', posM: '38% 50%' },
        { kind: 'art', src: 'assets/ryokan_salute.webp', altKo: 'Donguri Ryokan 컨셉 아트: 햇살 드는 료칸 마당에서 세 여우 자매가 손님을 맞이하는 모습', alt: 'Donguri Ryokan concept art: three fox sisters greeting guests in the sunny inn courtyard with tea and a checklist', pos: '50% 30%', posM: '50% 50%' },
        { kind: 'art', src: 'assets/ryokan_course.webp', altKo: 'Donguri Ryokan 컨셉 아트: 주방에서 술을 따르고 저녁 코스 요리를 담아내는 여우 자매', alt: 'Donguri Ryokan concept art: fox sisters pouring sake and plating an evening course dish in the kitchen', pos: '50% 35%', posM: '48% 50%' },
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
      art: [0, 1, 2],
      action: { label: 'Play', href: 'https://donguri.run' },
      panels: [
        { kind: 'art', src: 'assets/restaurant-01.webp', altKo: 'Donguri Restaurant 키 아트: 레스토랑 로고 옆에 셰프, 소믈리에, 아르바이트생이 함께 몸을 기울인 모습', alt: 'Donguri Restaurant key art: the chef, the sommelier and the part-timer leaning in together beside the restaurant logo', pos: '100% 30%', posM: '50% 50%' },
        { kind: 'art', src: 'assets/restaurant_field.webp', altKo: 'Donguri Restaurant 컨셉 아트: 텃밭에서 채소를 수확하는 아르바이트생과 식탁을 준비하는 셰프, 소믈리에', alt: 'Donguri Restaurant concept art: the part-timer harvesting fresh vegetables in the garden while the chef and sommelier prepare the table', pos: '45% 35%', posM: '38% 50%' },
        { kind: 'art', src: 'assets/restaurant_course.webp', altKo: 'Donguri Restaurant 컨셉 아트: 와인을 디캔팅하는 소믈리에와 저녁 코스 요리를 플레이팅하는 셰프', alt: 'Donguri Restaurant concept art: the sommelier decanting wine beside the chef plating the evening course', pos: '45% 35%', posM: '45% 50%' }
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
  const pageOf = p => url(`pages/${p.id}`);

  /* ---------- clean URL: strip .html extension and subpage #1 hashes from address bar ---------- */
  try {
    if (location.pathname.endsWith('.html')) {
      const cleanPath = location.pathname.replace(/\.html$/, '');
      const hashPart = only ? '' : location.hash;
      history.replaceState(history.state, '', cleanPath + location.search + hashPart);
    } else if (only && location.hash) {
      history.replaceState(history.state, '', location.pathname + location.search);
    }
  } catch (e) {}

  /* ---------- language (every page): a saved choice (localStorage 'choam-lang') always wins; with none saved, Korean when the
     browser's first preferred language is Korean, otherwise English. The <head> of each page decides this before paint and
     sets <html lang> (the automatic pick is not saved); this keeps the copy, labels and the picker in step with it.
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
    ['.intro-meta span:nth-child(1)', '', '스튜디오'],
    ['.intro-meta span:nth-child(2)', '', '서울'],
    ['.intro-meta span:nth-child(3)', '', '2026년 설립'],
    ['.intro-next[href="philosophy.html"] span', '', '철학'],
    ['.intro-next[href^="#"] span', '', '프로젝트'],
    ['[data-next-label]', '', '다음'],
    ['.intro-clock [data-city]', '', '서울'],
    ['main.track[aria-label="Ours"]', 'aria-label', '프로젝트'],
    ['[data-segments]', 'aria-label', '페이지'],
    ['[data-prev]', '', '이전'],
    ['[data-next]', '', '다음'],
    ['[data-details]', '', '자세히'],
    ['.foot a', '', '문의'],
    ['.dl .sch-icon', 'alt', 'Scheherazade 앱 아이콘'],
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
    body.classList.toggle('lang-open', open);
    langBtn.setAttribute('aria-expanded', String(open));
    if (open) (opts.find(o => o.dataset.setLang === lang) || opts[0]).focus();
    else if (focusBtn) langBtn.focus();
  };
  langBtn.addEventListener('click', () => { if (navOpen) setMenu(false); setLangMenu(!langOpen()); });
  opts.forEach(o => o.addEventListener('click', () => { applyLang(o.dataset.setLang, true); setLangMenu(false, true); }));
  picker.addEventListener('keydown', e => {
    if (!langOpen() || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    const i = opts.indexOf(document.activeElement);
    opts[(i + (e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length].focus();
  });
  picker.addEventListener('focusout', e => { if (langOpen() && !picker.contains(e.relatedTarget)) setLangMenu(false); });
  document.addEventListener('click', e => {
    if (langOpen() && !picker.contains(e.target)) setLangMenu(false);
    if (navOpen && !siteNav.contains(e.target) && !picker.contains(e.target)) setMenu(false);
  });
  /* back/forward from a page where the language changed: the cached page catches up */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    let saved = null; try { saved = localStorage.getItem(LANG_KEY); } catch (err) { /* blocked */ }
    if (saved && saved !== lang) applyLang(saved, false);
  });

  /* ---------- shared Works / About disclosure (every page) ----------
     Menu membership is deliberately separate from PROJECTS: DAT keeps its primary Works link and landing anchor.
     Each trigger opens only its own group on desktop and mobile. No focus trap or scroll lock. */
  mast.querySelectorAll('[data-menu-toggle], [data-menu]').forEach(el => el.remove());
  const siteNav = document.createElement('nav');
  siteNav.className = 'site-nav';
  const workEntry = id => {
    const p = PROJECTS.find(p => p.id === id);
    return `<li><a class="nav-entry" href="${pageOf(p)}" data-nav-project="${id}"${only === id ? ' aria-current="page"' : ''}><span data-nav-name="${id}">${esc(p.title)}</span></a></li>`;
  };
  const pending = name => `<li><span class="nav-entry nav-pending" aria-disabled="true"><span>${name}</span><small data-nav-pending></small></span></li>`;
  siteNav.innerHTML = `
    <div class="nav-controls">
      <button class="nav-toggle" type="button" data-nav-toggle="works" aria-controls="nav-works" aria-expanded="false">Works</button>
      <button class="nav-toggle" type="button" data-nav-toggle="about" aria-controls="nav-about" aria-expanded="false">About</button>
    </div>
    <div class="nav-panel" id="nav-panel" hidden>
      <section id="nav-works" aria-labelledby="nav-works-title" hidden>
        <h2 class="nav-group-title" id="nav-works-title">Works</h2>
        <ul class="nav-row nav-row-primary">${workEntry('scheherazade')}${workEntry('dat')}${pending('602')}</ul>
        <ul class="nav-row">${workEntry('seonjam')}${workEntry('donguri-ryokan')}${workEntry('donguri-restaurant')}</ul>
      </section>
      <section id="nav-about" aria-labelledby="nav-about-title" hidden>
        <h2 class="nav-group-title" id="nav-about-title">About</h2>
        <ul class="nav-row nav-row-primary"><li><a class="nav-entry" href="${url('philosophy')}"${body.dataset.page === 'philosophy' ? ' aria-current="page"' : ''} data-nav-philosophy></a></li>${pending('Us')}</ul>
      </section>
    </div>`;
  mast.insertBefore(siteNav, picker);
  const navPanel = siteNav.querySelector('.nav-panel');
  const navToggles = [...siteNav.querySelectorAll('[data-nav-toggle]')];
  const mobileNav = matchMedia('(max-width: 760px)');
  let navOpen = '';
  const positionMenu = () => {
    navPanel.style.removeProperty('right'); /* mobile keeps its existing full-width layout */
    if (!navOpen || mobileNav.matches) return;
    const trigger = siteNav.querySelector(`[data-nav-toggle="${navOpen}"]`).getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(mast).paddingRight);
    const right = Math.max(gutter, Math.min(innerWidth - trigger.right, innerWidth - navPanel.offsetWidth - gutter));
    navPanel.style.right = `${right}px`; /* align to the active trigger, clamped inside the viewport */
  };
  const navSize = new ResizeObserver(positionMenu);
  navSize.observe(mast);
  navSize.observe(siteNav);
  function setMenu(open, focusBtn = false) {
    const previous = navOpen;
    navOpen = open || '';
    if (navOpen && langOpen()) setLangMenu(false);
    navPanel.hidden = !navOpen;
    siteNav.querySelector('#nav-works').hidden = !navOpen || navOpen === 'about';
    siteNav.querySelector('#nav-about').hidden = !navOpen || navOpen === 'works';
    body.classList.toggle('menu-open', !!navOpen);
    navToggles.forEach(t => t.setAttribute('aria-expanded', String(navOpen === t.dataset.navToggle)));
    positionMenu();
    if (focusBtn && previous) siteNav.querySelector(`[data-nav-toggle="${previous}"]`).focus();
    wake();
  }
  navToggles.forEach(t => t.addEventListener('click', () => setMenu(navOpen === t.dataset.navToggle ? false : t.dataset.navToggle)));
  siteNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  /* Closing on keyboard departure does not steal focus; the adjacent language picker can relabel an open menu. */
  mast.addEventListener('focusout', e => { if (navOpen && !mast.contains(e.relatedTarget)) setMenu(false); });
  mobileNav.addEventListener('change', () => {
    const hadFocus = siteNav.contains(document.activeElement);
    setMenu(false);
    if (hadFocus) siteNav.querySelector('[data-nav-toggle="works"]').focus();
  });
  addEventListener('pagehide', () => { setMenu(false); setLangMenu(false); });
  /* The Philosophy article's own language controls share the same saved setting. Never rebuild menu nodes on relabel. */
  const pageLangs = [...document.querySelectorAll('[data-page-lang]')];
  pageLangs.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.pageLang, true)));
  relabel.push(() => {
    siteNav.setAttribute('aria-label', ko() ? '주요 탐색' : 'Main navigation');
    siteNav.querySelector('[data-nav-philosophy]').textContent = ko() ? '철학' : 'Philosophy';
    siteNav.querySelectorAll('[data-nav-pending]').forEach(el => { el.textContent = ko() ? '준비 중' : 'Coming soon'; });
    siteNav.querySelectorAll('[data-nav-name]').forEach(el => {
      const p = PROJECTS.find(p => p.id === el.dataset.navName);
      el.textContent = p.id === 'seonjam' ? (ko() ? '선잠' : 'Doze') : p.id === 'dat' ? p.title : ko() && p.title_ko ? p.title_ko : p.title;
    });
    pageLangs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pageLang === lang)));
    document.querySelectorAll('[data-philo-langs]').forEach(g => g.setAttribute('aria-label', ko() ? '언어' : 'Language'));
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (langOpen()) setLangMenu(false, true);
    else if (navOpen) setMenu(false, true);
    else if (getOpen) setGet(getOpen, false, true);
  });

  /* ---------- Scheherazade installers (download page and the Get chooser) ----------
     Every link starts on the latest release page. The public latest-release API is read once, only when the chooser is first
     opened or the download page is shown, and a link moves to an installer only if that release holds a file of exactly that
     platform's name; otherwise (no answer, rate limit, renamed file) it stays on the release page. Version numbers are never
     written here: releases/latest/download/<file> needs the versioned name, so the name comes from the release itself.
     The browser's OS only marks one choice as recommended; nothing downloads until a person picks one. */
  const REL_REPO = 'https://github.com/CHOAM-CO/scheherazade-releases';
  const REL_PAGE = `${REL_REPO}/releases/latest`;
  const REL_API = 'https://api.github.com/repos/CHOAM-CO/scheherazade-releases/releases/latest';
  const OSES = [
    { os: 'mac', name: 'Mac', detail: 'Apple silicon', detailKo: 'Apple 실리콘', file: /^Scheherazade-[^/]+-arm64\.dmg$/ },
    { os: 'win', name: 'Windows', detail: 'Installer', detailKo: '설치 파일', file: /^Scheherazade-Setup-[^/]+\.exe$/ },
    { os: 'linux', name: 'Linux', detail: 'x86_64 AppImage', detailKo: 'x86_64 AppImage', file: /^Scheherazade-[^/]+-x86_64\.AppImage$/ },
    { os: 'win-portable', name: 'Windows portable', detail: 'USB ZIP, NTFS', detailKo: 'USB용 ZIP, NTFS', optional: true, file: /^Scheherazade-Portable-[^/]+-win-x64\.zip$/ }
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
      if (o.optional) a.closest('li').hidden = !rel.urls[o.os];
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
  let relReady;
  const loadRel = () => {
    if (rel.state !== 'idle') return relReady;
    rel.state = 'loading';
    const ctl = 'AbortController' in window ? new AbortController() : null, stop = ctl && setTimeout(() => ctl.abort(), 10000);
    return relReady = fetch(REL_API, ctl ? { signal: ctl.signal } : {})
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

  /* A quick OS click must wait for metadata, not follow the temporary release-page href.
     Ready links and modified clicks retain native navigation; an API failure still uses the labelled fallback. */
  document.addEventListener('click', async e => {
    const a = e.target.closest('a[data-rel-os]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rel.state !== 'loading') return;
    e.preventDefault();
    await loadRel();
    location.assign(a.href);
  });

  /* Get chooser (a disclosure: Get, then ordinary links, including portable only when available). Plain clicks open it;
     a modified click or no script still follows Get's own link to the download page. Arrow keys move between visible
     choices, Escape closes and returns to Get. The panel stays in flow below the controls, never over the copy. */
  let getOpen = null; /* the open chooser's .get-wrap */
  const getOpts = wrap => [...wrap.querySelectorAll('.get-opt')].filter(a => !a.closest('li[hidden]'));
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
      <ul>${OSES.map(o => `<li${o.optional ? ' hidden' : ''}><a class="get-opt" data-rel-os="${o.os}" href="${REL_PAGE}"><span>${o.name}<em class="os-rec" data-os-rec hidden></em></span><b data-os-detail></b></a></li>`).join('')}</ul>
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
    wrap.querySelectorAll('.get-opt').forEach(a => a.addEventListener('click', () => setGet(wrap, false, true))); /* the link still navigates */
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
    /* Expanding the in-flow chooser lifts the caption; keep its mobile artwork above the copy too. */
    const getPlates = plates.filter(el => el.querySelector('.get-menu'));
    const getCopyTop = new ResizeObserver(() => getPlates.forEach(el => {
      el.style.setProperty('--copy-top', `${el.querySelector('.caption').offsetTop}px`);
    }));
    getPlates.forEach(el => { getCopyTop.observe(el); getCopyTop.observe(el.querySelector('.caption')); });

    /* the index rail: 00 is the opening, then one line per project; shown once the opening has scrolled away */
    const rail = document.createElement('nav');
    rail.className = 'index-rail';
    rail.innerHTML = `<ol>${[{ id: 'top', n: '00' }, ...PROJECTS.map(p => ({ id: p.id, n: numOf(p), p }))].map(r =>
      `<li><a href="#${r.id}" data-index-link="${r.id}"><i aria-hidden="true"></i><b>${r.n}</b><span>${r.p ? esc(r.p.title) : ''}</span></a></li>`).join('')}</ol>`;
    track.before(rail);
    const links = [...rail.querySelectorAll('[data-index-link]')];
    document.querySelectorAll('[data-go-project]').forEach(a => { a.href = `#${a.dataset.goProject}`; });

    /* DAT: the cast, then one real before / after pair, side by side on one plate (if flip view is enabled) */
    const datPlate = plates.find(el => el.id === 'dat');
    const flip = datPlate && datPlate.querySelector('[data-flip]');
    let flipTo = () => {};
    if (flip) {
      const fSlides = [...flip.querySelectorAll('.slide')];
      const marks = [...datPlate.querySelectorAll('[data-flip-marks] button')];
      const box = datPlate.querySelector('[data-compare]'), range = box.querySelector('[data-compare-range]');
      const at = () => (flip.clientWidth ? Math.round(flip.scrollLeft / flip.clientWidth) : 0);
      flipTo = (k, instant) => flip.scrollTo({ left: Math.max(0, Math.min(fSlides.length - 1, k)) * flip.clientWidth, behavior: instant ? 'instant' : behavior() });
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
    }

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
      if (flip) {
        const cast = castOf(PROJECTS[1]), c = pairOf(PROJECTS[1]);
        const marks = [...datPlate.querySelectorAll('[data-flip-marks] button')];
        datPlate.querySelector('.plate-cast').setAttribute('aria-label', ko() ? 'DAT 캐릭터 일러스트' : 'DAT character art');
        datPlate.querySelectorAll('.plate-cast img').forEach((img, k) => { img.alt = altOf(cast.items[k]); });
        flip.setAttribute('aria-label', ko() ? 'DAT, 2개 화면' : 'DAT, 2 views');
        datPlate.querySelector('[data-flip-marks]').setAttribute('aria-label', ko() ? 'DAT 화면 전환' : 'DAT view switch');
        const pillLabels = ko() ? ['01 캐릭터 일러스트', '02 보정 전후 비교'] : ['01 Character Art', '02 Before & After'];
        marks.forEach((b, k) => { b.textContent = pillLabels[k]; });
        flip.querySelector('.flip-next').setAttribute('aria-label', ko() ? '보정 전후 비교 보기' : 'View before and after');
        flip.querySelector('.flip-prev').setAttribute('aria-label', ko() ? '캐릭터 일러스트 보기' : 'View character art');
        const box = datPlate.querySelector('[data-compare]'), range = box.querySelector('[data-compare-range]');
        box.querySelector('.cmp-before').alt = ko() ? c.beforeLabelKo || c.beforeLabel : c.beforeLabel || 'Original';
        box.querySelector('.cmp-after').alt = ko() ? 'DAT 적용 후' : 'After DAT';
        range.setAttribute('aria-label', ko() ? 'BEFORE / AFTER 비교 경계 위치' : 'Before / after reveal position');
      }
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
      if (writeHash && (p ? location.hash !== `#${id}` : location.hash)) history.replaceState(history.state, '', p ? `#${id}` : location.pathname.replace(/\.html$/, '') + location.search);
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
      if (id === 'dat' && flip) flipTo(k >= 3 ? 1 : 0, true);
    };
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const [id, k] = parse(a.getAttribute('href'));
      if (body.classList.contains('menu-open')) setMenu(false);
      history.pushState(null, '', id === 'top' ? location.pathname.replace(/\.html$/, '') + location.search : `#${id}`);
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
  /* a chat figure: a real exchange plus the one line the machine actually wrote or changed.
     Every string comes from spec.ko / spec.en, so it follows the language switch like the copy does. */
  const chatBlocks = rows => rows.map(r => {
    if (r.t === 'sys') {
      const box = document.createElement('div'); box.className = 'cv-sys';
      const k = document.createElement('span'); k.className = 'k'; k.textContent = r.k; box.appendChild(k);
      r.l.forEach(l => { const t = document.createElement('span');
        t.className = 'l' + (l.del ? ' del' : '') + (l.add ? ' add' : ''); t.textContent = l.s; box.appendChild(t); });
      return box;
    }
    if (r.t === 'sheet') {
      const box = document.createElement('div'); box.className = 'cv-sheet';
      const k = document.createElement('span'); k.className = 'k'; k.textContent = r.k; box.appendChild(k);
      r.rows.forEach(row => {
        const line = document.createElement('div'); line.className = 'r' + (row.on ? ' on' : '');
        const n = document.createElement('span'); n.className = 'n'; n.textContent = row.n;
        const b = document.createElement('span'); b.className = 'b'; b.style.width = row.w + '%';
        line.append(n, b); box.appendChild(line);
      });
      return box;
    }
    const line = document.createElement('div'); line.className = 'cv-row' + (r.side === 'in' ? ' r' : '');
    const p = document.createElement('p'); p.className = 'cv-b ' + (r.side === 'in' ? 'in' : 'out');
    r.p.forEach(seg => { if (seg.em) { const b = document.createElement('b'); b.textContent = seg.s; p.appendChild(b); }
      else p.appendChild(document.createTextNode(seg.s)); });
    if (r.time) { const e = document.createElement('em'); e.textContent = r.time; p.appendChild(e); }
    line.appendChild(p); return line;
  });
  /* one visual per paragraph: full-bleed art, or a framed in-game capture / feature graphic beside the copy */
  /* captions, alt text and copy are filled by labelSec, in the current language */
  const visual = (spec, j, i, reel) => {
    const on = j === 0 ? ' is-on' : '', cap = spec.cap ? '<figcaption></figcaption>' : '';
    if (spec.kind === 'compare') return `<div class="media vis dat-inline${on}" data-art="${i}" role="group" hidden>
      <div class="dat-cases" role="group"></div>
      <div class="dat-reveal" style="--split:50%"><img data-dat-native draggable="false"><img class="dat-after" data-dat-native draggable="false"><span class="dat-side dat-before-tag">BEFORE</span><span class="dat-side dat-after-tag">AFTER</span><span class="dat-divider" aria-hidden="true"></span></div>
      <label class="dat-range-label"><span>BEFORE</span><input data-dat-range type="range" min="0" max="100" value="50"><span>AFTER</span></label>
      <div class="dat-zoom" tabindex="0" role="group"><div><span>BEFORE</span><div class="dat-detail" aria-hidden="true"></div></div><div><span>AFTER</span><div class="dat-detail" aria-hidden="true"></div></div></div><p class="dat-note"></p></div>`;
    /* gallery: real artwork, as large as the plate allows; cut-out standings stand unframed, a full image sits framed */
    if (spec.kind === 'gallery') { const multi = spec.items.length > 1;
      return `<figure class="media vis gal${multi ? '' : ' gal-one'}${spec.cut ? ' gal-cut' : ''}${spec.pair ? ' gal-pair' : ''}${on}" data-art="${i}"${multi ? ' role="group"' : ''} style="--sar:${spec.items.reduce((a, it) => a + it.ar, 0).toFixed(4)};--n:${spec.items.length}">
        <div class="gal-row">${spec.items.map(it => `<div class="gi" style="--ar:${it.ar}"><img src="${url(it.src)}" alt="" draggable="false" decoding="async"${j ? ' loading="lazy"' : ''}>${it.name ? '<span class="gn"></span>' : ''}</div>`).join('')}</div>${cap}</figure>`; }
    if (spec.kind === 'feat') return `<figure class="media vis feat${on}" data-art="${i}"><svg viewBox="0 0 720 540" role="img" aria-label="">${FEAT[spec.feat]()}</svg>${cap}</figure>`;
    if (spec.kind === 'chat') return `<figure class="media vis feat chatviz${on}" data-art="${i}"><div class="cv"></div>${cap}</figure>`;
    const img = `src="${url(spec.src)}" alt="" draggable="false" decoding="async"${(reel || !j) ? '' : ' loading="lazy"'}`;
    if (spec.kind === 'fig') return `<figure class="media vis afig${on}" data-art="${i}" style="--ar:${spec.ar}"><img ${img}>${cap}</figure>`;
    if (spec.kind === 'raw') return `<figure class="media vis frame${on}" data-art="${i}" style="--ar:${spec.ar || 16 / 9}"><img ${img}>${cap}</figure>`;
    return `<img class="media${on}" data-art="${i}" ${img} style="--pos:${spec.pos};--pos-m:${spec.posM}">`;
  };
  const stage = p => {
    /* horizon field: the same atmosphere as the opening, lit cold (Scheherazade) or warm (DAT) */
    const field = p.field === 'sch' ? '<div class="field sch-field" aria-hidden="true"></div>'
      : p.field === 'dat' ? '<div class="field dat-field" aria-hidden="true"><span class="dat-type">DAT</span></div>' : '';
    const used = p.reel ? p.panels : [...new Set(paras(p).map((_, k) => artFor(p, k)))];
    return field + used.map((spec, j) => visual(spec, j, p.panels.indexOf(spec), !!p.reel)).join('');
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
    if (!datSec || !datInline) return;
    const rail = datSec.querySelector('[data-rail]');
    const k = Math.round(rail.scrollLeft / (rail.clientWidth || 1));
    datSec.classList.toggle('dat-comparing', k === 5);
    datInline.hidden = k !== 5;
    datInline.inert = k !== 5;
    const c = activeCase(), beforeName = ko() ? c.beforeLabelKo || c.beforeLabel || '원본' : c.beforeLabel || 'Original';
    datInline.querySelector('.dat-note').textContent = ko() ? c.noteKo : c.note;
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
    const ps = paras(p), n = steps(p), T = p.heading || p.title, set = (sel, attr, v) => { const el = sec.querySelector(sel); if (el) el.setAttribute(attr, v); };
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
      const cv = m.querySelector('.cv');
      if (cv) { cv.replaceChildren(...chatBlocks(ko() ? spec.ko : spec.en)); if (alt) m.setAttribute('aria-label', alt); }
      if (spec.items) { if (alt) m.setAttribute('aria-label', alt); m.querySelectorAll('.gi').forEach((g, k) => { const it = spec.items[k]; g.querySelector('img').alt = ko() && it.altKo || it.alt; const n = g.querySelector('.gn'); if (n) n.textContent = ko() && it.nameKo || it.name; }); }
      else if (svg) svg.setAttribute('aria-label', alt); else if (img) img.alt = alt;
      if (cap) cap.textContent = ko() && spec.capKo || spec.cap;
    });
    if (p.id === 'dat' && datInline) updateDat();
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
    if (p.id === 'dat' && datInline) labelSec(sec, p);
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
    if (only) {
      if (location.hash) history.replaceState(null, '', location.pathname.replace(/\.html$/, '') + location.search);
    } else {
      const hash = `#${p.id}/${k + 1}`;
      if (location.hash !== hash) history.replaceState(null, '', hash);
    }
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
    if (location.hash) history.replaceState(null, '', location.pathname.replace(/\.html$/, '') + location.search);
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
