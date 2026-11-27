/* CHOAM Galaga (1981 arcade homage in CHOAM monochrome + brass palette).
   Lazy-loaded on Konami code (Up Up Down Down Left Right Left Right B A) or choam.galaga().
   Zero external assets, pure #000000 / #EBE5DA / #D9A362 / #C95A4B palette, Web Audio retro SFX. */
(() => {
  if (window.__CHOAM_GALAGA_LOADED__) return;
  window.__CHOAM_GALAGA_LOADED__ = true;

  const W = 480;
  const H = 620;
  const COL_BG = '#000000';
  const COL_BONE = '#EBE5DA';
  const COL_BRASS = '#D9A362';
  const COL_RED = '#C95A4B';
  const COL_DIM = 'rgba(235, 229, 218, 0.42)';

  /* Pixel art sprite matrices (each char: '.' transparent, '1' primary, '2' accent) */
  const SPR_PLAYER = [
    '.....1.....',
    '.....1.....',
    '....121....',
    '....121....',
    '..1.111.1..',
    '..1112111..',
    '1.1111111.1',
    '11112121111',
    '11111111111',
    '1.1..1..1.1'
  ];

  const SPR_BOSS = [
    [
      '....2222....',
      '..22111122..',
      '.2112222112.',
      '211211112112',
      '221112211122',
      '.2211111122.',
      '..2.2222.2..',
      '.2..2..2..2.'
    ],
    [
      '....2222....',
      '..22111122..',
      '.2112222112.',
      '211211112112',
      '221112211122',
      '.2211111122.',
      '.2..2222..2.',
      '2....22....2'
    ]
  ];

  const SPR_GOEI = [
    [
      '..2....2..',
      '.222..222.',
      '2212222122',
      '2111221112',
      '.22111122.',
      '..21..12..',
      '.2......2.'
    ],
    [
      '.2......2.',
      '222....222',
      '2212222122',
      '.21122112.',
      '..211112..',
      '..2.22.2..',
      '...2..2...'
    ]
  ];

  const SPR_ZAKO = [
    [
      '...1..1...',
      '..111111..',
      '.11211211.',
      '1111111111',
      '.1.1111.1.',
      '..1....1..'
    ],
    [
      '...1..1...',
      '.11111111.',
      '1112112111',
      '.11111111.',
      '..1.11.1..',
      '.1......1.'
    ]
  ];

  function drawSprite(ctx, matrix, cx, cy, scale, c1, c2, rot) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const ox = -((cols * scale) / 2);
    const oy = -((rows * scale) / 2);
    ctx.save();
    ctx.translate(Math.round(cx), Math.round(cy));
    if (rot) ctx.rotate(rot);
    for (let r = 0; r < rows; r += 1) {
      const row = matrix[r];
      for (let c = 0; c < cols; c += 1) {
        const ch = row[c];
        if (ch === '.') continue;
        ctx.fillStyle = ch === '1' ? c1 : c2;
        ctx.fillRect(ox + c * scale, oy + r * scale, scale, scale);
      }
    }
    ctx.restore();
  }

  /* Minimal Web Audio retro synth (zero external audio files) */
  function createAudio() {
    let actx = null;
    let muted = false;
    const ensure = () => {
      if (muted) return null;
      if (!actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) actx = new AC();
      }
      if (actx && actx.state === 'suspended') actx.resume().catch(() => {});
      return actx;
    };
    const tone = (freq, dur, type, vol, slideTo, delay) => {
      const ac = ensure();
      if (!ac) return;
      const t0 = ac.currentTime + (delay || 0);
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
      gain.gain.setValueAtTime(vol || 0.06, t0);
      gain.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.01);
    };
    return {
      isMuted: () => muted,
      toggleMute: () => { muted = !muted; return muted; },
      shoot: () => tone(940, 0.08, 'square', 0.045, 260),
      hitArmor: () => tone(620, 0.09, 'triangle', 0.06, 980),
      explode: () => {
        tone(170, 0.14, 'sawtooth', 0.06, 48);
        tone(95, 0.18, 'square', 0.04, 34, 0.03);
      },
      playerDie: () => {
        tone(220, 0.28, 'sawtooth', 0.075, 42);
        tone(140, 0.36, 'square', 0.055, 32, 0.08);
      },
      beam: () => {
        tone(340, 0.14, 'sine', 0.05, 520);
        tone(520, 0.14, 'sine', 0.05, 300, 0.14);
      },
      rescue: () => {
        [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.11, 'square', 0.05, null, i * 0.08));
      },
      stageStart: () => {
        [392, 494, 587, 784].forEach((f, i) => tone(f, 0.09, 'square', 0.045, null, i * 0.085));
      }
    };
  }

  let overlay = null;
  let cleanupFn = null;

  function closeGalaga() {
    if (typeof cleanupFn === 'function') {
      cleanupFn();
      cleanupFn = null;
    }
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function openGalaga() {
    closeGalaga();
    const sfx = createAudio();

    const bd = document.createElement('div');
    bd.className = 'ee-galaga-backdrop';
    bd.setAttribute('role', 'dialog');
    bd.setAttribute('aria-modal', 'true');
    bd.setAttribute('aria-label', 'CHOAM GALAGA');

    const frame = document.createElement('div');
    frame.className = 'ee-galaga-frame';

    const topBar = document.createElement('div');
    topBar.className = 'ee-galaga-bar';
    topBar.innerHTML =
      '<span class="ee-galaga-hud">1UP <strong data-g-score>000000</strong></span>' +
      '<span class="ee-galaga-hud">HIGH <strong data-g-high>000000</strong></span>' +
      '<span class="ee-galaga-hud">STG <strong data-g-stage>01</strong></span>';
    const topBtns = document.createElement('div');
    topBtns.className = 'ee-galaga-btns';
    const muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'ee-ak-close';
    muteBtn.textContent = 'SFX ON';
    const escBtn = document.createElement('button');
    escBtn.type = 'button';
    escBtn.className = 'ee-ak-close';
    escBtn.textContent = 'ESC';
    topBtns.append(muteBtn, escBtn);
    topBar.appendChild(topBtns);

    const cv = document.createElement('canvas');
    cv.className = 'ee-galaga-canvas';
    cv.width = W;
    cv.height = H;

    const footBar = document.createElement('div');
    footBar.className = 'ee-galaga-foot';
    footBar.innerHTML =
      '<span class="ee-galaga-hint">MOVE: A/D or ARROWS  ·  FIRE: SPACE  ·  PAUSE: P</span>' +
      '<div class="ee-galaga-touch">' +
      '<button type="button" class="ee-ak-close" data-t="left">←</button>' +
      '<button type="button" class="ee-ak-close" data-t="right">→</button>' +
      '<button type="button" class="ee-ak-close" data-t="fire">FIRE</button>' +
      '</div>';

    frame.append(topBar, cv, footBar);
    bd.appendChild(frame);
    document.body.appendChild(bd);
    overlay = bd;

    const scoreEl = topBar.querySelector('[data-g-score]');
    const highEl = topBar.querySelector('[data-g-high]');
    const stageEl = topBar.querySelector('[data-g-stage]');
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let highScore = 0;
    try { highScore = parseInt(localStorage.getItem('choam-galaga-high') || '0', 10) || 0; } catch (e) {}

    /* Starfield (3 parallax layers) */
    const stars = Array.from({ length: 68 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      sp: 0.45 + Math.random() * 1.65,
      a: 0.16 + Math.random() * 0.42,
      sz: Math.random() < 0.22 ? 2 : 1
    }));

    /* Game state */
    let score = 0;
    let stage = 1;
    let lives = 3;
    let dual = false;
    let shotsFired = 0;
    let shotsHit = 0;
    let tick = 0;
    let paused = false;
    let mode = 'stageIntro'; /* stageIntro | playing | playerDead | stageClear | gameOver */
    let modeTimer = 85;
    let fireCooldown = 0;
    let diveCooldown = 95;
    let capturedShip = null; /* { bossId, x, y, state: 'held'|'falling'|'docking' } */

    const player = { x: W / 2, y: H - 54, invuln: 0, captured: false };
    let bullets = [];
    let enemyBullets = [];
    let enemies = [];
    let particles = [];
    let popups = [];

    const keys = { left: false, right: false, fire: false };

    const fmt6 = (n) => String(n).padStart(6, '0');
    const syncHud = () => {
      scoreEl.textContent = fmt6(score);
      highEl.textContent = fmt6(highScore);
      stageEl.textContent = String(stage).padStart(2, '0');
    };
    const addScore = (pts, x, y) => {
      score += pts;
      if (score > highScore) {
        highScore = score;
        try { localStorage.setItem('choam-galaga-high', String(highScore)); } catch (e) {}
      }
      if (x !== undefined) popups.push({ x, y, text: String(pts), life: 36 });
      syncHud();
    };
    const spawnBurst = (x, y, col, count) => {
      for (let i = 0; i < (count || 12); i += 1) {
        const ang = (Math.PI * 2 * i) / (count || 12) + Math.random() * 0.4;
        const sp = 1.1 + Math.random() * 2.8;
        particles.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 18 + Math.random() * 14, col });
      }
    };

    let nextEnemyId = 1;
    function buildStage(st) {
      enemies = [];
      bullets = [];
      enemyBullets = [];
      capturedShip = null;
      const layout = [
        { type: 'boss', count: 4, rowY: 90, hp: 2, pts: 150, divePts: 400 },
        { type: 'goei', count: 8, rowY: 132, hp: 1, pts: 80, divePts: 160 },
        { type: 'goei', count: 8, rowY: 168, hp: 1, pts: 80, divePts: 160 },
        { type: 'zako', count: 10, rowY: 204, hp: 1, pts: 50, divePts: 100 },
        { type: 'zako', count: 10, rowY: 238, hp: 1, pts: 50, divePts: 100 }
      ];
      let idx = 0;
      layout.forEach((row, rIdx) => {
        const spacing = 36;
        const startX = W / 2 - ((row.count - 1) * spacing) / 2;
        for (let c = 0; c < row.count; c += 1) {
          const homeX = startX + c * spacing;
          const homeY = row.rowY;
          const fromLeft = (rIdx + c) % 2 === 0;
          enemies.push({
            id: nextEnemyId++,
            type: row.type,
            hp: row.hp,
            maxHp: row.hp,
            pts: row.pts,
            divePts: row.divePts,
            homeX,
            homeY,
            x: fromLeft ? -28 : W + 28,
            y: 40 + (idx % 6) * 26,
            vx: 0,
            vy: 0,
            rot: 0,
            state: 'entering', /* entering | grid | diving | beam | returning */
            enterDelay: idx * 3,
            enterT: 0,
            fromLeft,
            diveT: 0,
            diveOriginX: homeX,
            diveOriginY: homeY,
            diveDir: fromLeft ? 1 : -1,
            beamTimer: 0,
            fired: false
          });
          idx += 1;
        }
      });
      diveCooldown = Math.max(40, 100 - st * 8);
      mode = 'stageIntro';
      modeTimer = 78;
      sfx.stageStart();
      syncHud();
    }

    function resetGame() {
      score = 0;
      stage = 1;
      lives = 3;
      dual = false;
      shotsFired = 0;
      shotsHit = 0;
      player.x = W / 2;
      player.invuln = 60;
      player.captured = false;
      particles = [];
      popups = [];
      buildStage(1);
    }

    function launchDive() {
      const ready = enemies.filter((e) => e.state === 'grid');
      if (!ready.length) return;
      const bossReady = ready.filter((e) => e.type === 'boss');
      const canBeam = !dual && !capturedShip && bossReady.length > 0 && Math.random() < 0.28;
      if (canBeam) {
        const b = bossReady[Math.floor(Math.random() * bossReady.length)];
        b.state = 'beam';
        b.diveT = 0;
        b.beamTimer = 0;
        b.targetBeamX = Math.max(90, Math.min(W - 90, player.x));
        return;
      }
      const pickEnemy = ready[Math.floor(Math.random() * ready.length)];
      const group = [pickEnemy];
      /* Boss may bring 1-2 Goei escorts */
      if (pickEnemy.type === 'boss') {
        const escorts = ready
          .filter((e) => e.type === 'goei')
          .sort((a, b) => Math.abs(a.homeX - pickEnemy.homeX) - Math.abs(b.homeX - pickEnemy.homeX))
          .slice(0, 2);
        escorts.forEach((es) => group.push(es));
      }
      group.forEach((en, gi) => {
        en.state = 'diving';
        en.diveT = -gi * 10;
        en.diveOriginX = en.x;
        en.diveOriginY = en.y;
        en.diveDir = en.x < player.x ? 1 : -1;
        en.fired = false;
      });
    }

    function firePlayer() {
      const maxBullets = dual ? 4 : 2;
      if (bullets.length >= maxBullets || fireCooldown > 0) return;
      if (dual) {
        bullets.push({ x: player.x - 12, y: player.y - 16, vy: -9.6 });
        bullets.push({ x: player.x + 12, y: player.y - 16, vy: -9.6 });
        shotsFired += 2;
      } else {
        bullets.push({ x: player.x, y: player.y - 16, vy: -9.6 });
        shotsFired += 1;
      }
      fireCooldown = 11;
      sfx.shoot();
    }

    function hitPlayer() {
      if (player.invuln > 0 || mode !== 'playing') return;
      if (dual) {
        /* Lose one wingman instead of full life */
        dual = false;
        player.invuln = 90;
        spawnBurst(player.x + 12, player.y, COL_BRASS, 16);
        sfx.explode();
        return;
      }
      spawnBurst(player.x, player.y, COL_BONE, 22);
      sfx.playerDie();
      lives -= 1;
      mode = lives > 0 ? 'playerDead' : 'gameOver';
      modeTimer = lives > 0 ? 75 : 9999;
      enemyBullets = [];
    }

    function update() {
      tick += 1;
      stars.forEach((s) => {
        s.y += s.sp;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      });

      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life -= 1; });
      particles = particles.filter((p) => p.life > 0);
      popups.forEach((p) => { p.y -= 0.45; p.life -= 1; });
      popups = popups.filter((p) => p.life > 0);

      if (paused) return;

      if (mode === 'stageIntro') {
        modeTimer -= 1;
        if (modeTimer <= 0) mode = 'playing';
      } else if (mode === 'playerDead') {
        modeTimer -= 1;
        if (modeTimer <= 0) {
          player.x = W / 2;
          player.invuln = 110;
          player.captured = false;
          mode = 'playing';
        }
      } else if (mode === 'stageClear') {
        modeTimer -= 1;
        if (modeTimer <= 0) {
          stage += 1;
          buildStage(stage);
        }
        return;
      } else if (mode === 'gameOver') {
        return;
      }

      /* Player movement & shooting */
      if (mode === 'playing' && !player.captured) {
        const margin = dual ? 34 : 22;
        if (keys.left) player.x = Math.max(margin, player.x - 4.4);
        if (keys.right) player.x = Math.min(W - margin, player.x + 4.4);
        if (fireCooldown > 0) fireCooldown -= 1;
        if (keys.fire) firePlayer();
        if (player.invuln > 0) player.invuln -= 1;
      }

      /* Swaying formation offset */
      const gridSway = Math.sin(tick * 0.025) * 26;

      /* Enemy updates */
      const speedMul = 1 + (stage - 1) * 0.1;
      enemies.forEach((e) => {
        const gx = e.homeX + gridSway;
        const gy = e.homeY + Math.sin(tick * 0.05 + e.homeX * 0.03) * 2.5;

        if (e.state === 'entering') {
          if (e.enterDelay > 0) { e.enterDelay -= 1; return; }
          e.enterT = Math.min(1, e.enterT + 0.022 * speedMul);
          const t = e.enterT;
          const sx = e.fromLeft ? -28 : W + 28;
          const sy = 40;
          const cx = e.fromLeft ? W * 0.34 : W * 0.66;
          const cy = H * 0.52;
          const omt = 1 - t;
          const nx = omt * omt * sx + 2 * omt * t * cx + t * t * gx;
          const ny = omt * omt * sy + 2 * omt * t * cy + t * t * gy;
          e.rot = Math.atan2(ny - e.y, nx - e.x) + Math.PI / 2;
          e.x = nx;
          e.y = ny;
          if (t >= 1) {
            e.state = 'grid';
            e.rot = 0;
          }
        } else if (e.state === 'grid') {
          e.x += (gx - e.x) * 0.2;
          e.y += (gy - e.y) * 0.2;
          e.rot = 0;
        } else if (e.state === 'diving') {
          e.diveT += 1;
          if (e.diveT < 0) return;
          const dt = e.diveT * 0.045 * speedMul;
          const nx = e.diveOriginX + Math.sin(dt * 2.4) * 95 * e.diveDir + dt * 16 * e.diveDir;
          const ny = e.diveOriginY + dt * 120;
          e.rot = Math.atan2(ny - e.y, nx - e.x) + Math.PI / 2;
          e.x = nx;
          e.y = ny;
          if (!e.fired && e.y > 230 && e.y < 380) {
            e.fired = true;
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const dist = Math.hypot(dx, dy) || 1;
            const bsp = Math.min(5.8, 3.5 + stage * 0.22);
            enemyBullets.push({ x: e.x, y: e.y + 8, vx: (dx / dist) * bsp, vy: (dy / dist) * bsp });
          }
          if (e.y > H + 26) {
            e.y = -24;
            e.x = gx;
            e.state = 'returning';
          }
        } else if (e.state === 'beam') {
          e.diveT += 1;
          const targetY = H - 208;
          if (e.beamTimer === 0) {
            e.x += (e.targetBeamX - e.x) * 0.06;
            e.y += (targetY - e.y) * 0.06;
            e.rot = 0;
            if (Math.hypot(e.targetBeamX - e.x, targetY - e.y) < 4) {
              e.beamTimer = 1;
              sfx.beam();
            }
          } else {
            e.beamTimer += 1;
            if (e.beamTimer % 28 === 0 && e.beamTimer < 110) sfx.beam();
            /* Capture check if player stands inside tractor beam */
            if (mode === 'playing' && !player.captured && !dual && player.invuln === 0 &&
                e.beamTimer > 18 && e.beamTimer < 115 && Math.abs(player.x - e.x) < 30) {
              player.captured = true;
              capturedShip = { bossId: e.id, x: player.x, y: player.y, state: 'pulling', spin: 0 };
            }
            if (e.beamTimer > 130) {
              e.state = 'returning';
              e.beamTimer = 0;
              if (player.captured) {
                lives -= 1;
                player.captured = false;
                if (lives <= 0) {
                  mode = 'gameOver';
                } else {
                  player.x = W / 2;
                  player.invuln = 110;
                }
              }
            }
          }
        } else if (e.state === 'returning') {
          e.x += (gx - e.x) * 0.08;
          e.y += (gy - e.y) * 0.08;
          e.rot = 0;
          if (Math.hypot(gx - e.x, gy - e.y) < 3) {
            e.x = gx;
            e.y = gy;
            e.state = 'grid';
          }
        }

        /* Direct enemy-player collision */
        if (mode === 'playing' && !player.captured && Math.hypot(e.x - player.x, e.y - player.y) < 20) {
          e.hp = 0;
          spawnBurst(e.x, e.y, COL_BRASS, 10);
          hitPlayer();
        }
      });

      /* Captured fighter logic (pulling -> held above boss -> falling -> docking -> dual!) */
      if (capturedShip) {
        const boss = enemies.find((e) => e.id === capturedShip.bossId && e.hp > 0);
        if (capturedShip.state === 'pulling') {
          if (boss) {
            capturedShip.spin += 0.25;
            capturedShip.x += (boss.x - capturedShip.x) * 0.08;
            capturedShip.y += (boss.y - 26 - capturedShip.y) * 0.08;
            if (Math.hypot(boss.x - capturedShip.x, (boss.y - 26) - capturedShip.y) < 4) {
              capturedShip.state = 'held';
              capturedShip.spin = 0;
            }
          } else {
            capturedShip.state = 'docking';
          }
        } else if (capturedShip.state === 'held') {
          if (boss) {
            capturedShip.x = boss.x;
            capturedShip.y = boss.y - 26;
          } else {
            /* Boss destroyed! Rescue and dock for Dual Fighter */
            capturedShip.state = 'docking';
            sfx.rescue();
            popups.push({ x: capturedShip.x, y: capturedShip.y, text: 'DUAL FIGHTER', life: 54 });
          }
        } else if (capturedShip.state === 'docking') {
          const tx = player.x + 14;
          const ty = player.y;
          capturedShip.x += (tx - capturedShip.x) * 0.12;
          capturedShip.y += (ty - capturedShip.y) * 0.12;
          if (Math.hypot(tx - capturedShip.x, ty - capturedShip.y) < 8) {
            dual = true;
            capturedShip = null;
          }
        }
      }

      /* Dive scheduler */
      if (mode === 'playing') {
        diveCooldown -= 1;
        if (diveCooldown <= 0) {
          launchDive();
          diveCooldown = Math.max(28, 86 - stage * 7);
        }
      }

      /* Player bullets */
      bullets.forEach((b) => { b.y += b.vy; });
      bullets = bullets.filter((b) => {
        if (b.y < -12) return false;
        /* Accidental shot on held captured fighter */
        if (capturedShip && capturedShip.state === 'held' && Math.hypot(b.x - capturedShip.x, b.y - capturedShip.y) < 12) {
          spawnBurst(capturedShip.x, capturedShip.y, COL_RED, 14);
          sfx.explode();
          capturedShip = null;
          return false;
        }
        for (let i = 0; i < enemies.length; i += 1) {
          const e = enemies[i];
          if (e.hp <= 0) continue;
          if (Math.abs(b.x - e.x) < 14 && Math.abs(b.y - e.y) < 13) {
            shotsHit += 1;
            e.hp -= 1;
            if (e.hp <= 0) {
              const pts = e.state === 'grid' ? e.pts : e.divePts;
              addScore(pts, e.x, e.y);
              spawnBurst(e.x, e.y, e.type === 'boss' ? COL_BRASS : COL_BONE, e.type === 'boss' ? 18 : 10);
              sfx.explode();
            } else {
              sfx.hitArmor();
              spawnBurst(e.x, e.y, COL_RED, 6);
            }
            return false;
          }
        }
        return true;
      });
      enemies = enemies.filter((e) => e.hp > 0);

      /* Enemy bullets */
      enemyBullets.forEach((b) => { b.x += b.vx; b.y += b.vy; });
      enemyBullets = enemyBullets.filter((b) => {
        if (b.y > H + 12 || b.x < -12 || b.x > W + 12) return false;
        if (mode === 'playing' && !player.captured) {
          const hitW = dual ? 22 : 12;
          if (Math.abs(b.x - player.x) < hitW && Math.abs(b.y - player.y) < 12) {
            hitPlayer();
            return false;
          }
        }
        return true;
      });

      /* Stage clear check */
      if (mode === 'playing' && enemies.length === 0 && !capturedShip) {
        mode = 'stageClear';
        modeTimer = 95;
        sfx.rescue();
      }
    }

    function draw() {
      ctx.fillStyle = COL_BG;
      ctx.fillRect(0, 0, W, H);

      /* Stars */
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(235, 229, 218, ${s.a.toFixed(2)})`;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.sz, s.sz);
      });

      /* Tractor beam */
      enemies.forEach((e) => {
        if (e.state === 'beam' && e.beamTimer > 8 && e.beamTimer < 122) {
          const beamTop = e.y + 14;
          const beamBot = H - 30;
          const rings = 9;
          for (let r = 0; r < rings; r += 1) {
            const p = ((r / rings) + (tick * 0.03)) % 1;
            const ry = beamTop + p * (beamBot - beamTop);
            const rw = 10 + p * 34;
            ctx.strokeStyle = r % 2 === 0 ? COL_BRASS : 'rgba(235, 229, 218, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(e.x - rw, ry);
            ctx.lineTo(e.x + rw, ry);
            ctx.stroke();
          }
          ctx.strokeStyle = 'rgba(217, 163, 98, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(e.x - 10, beamTop);
          ctx.lineTo(e.x - 44, beamBot);
          ctx.moveTo(e.x + 10, beamTop);
          ctx.lineTo(e.x + 44, beamBot);
          ctx.stroke();
        }
      });

      /* Enemies */
      const frameIdx = Math.floor(tick / 18) % 2;
      enemies.forEach((e) => {
        if (e.state === 'entering' && e.enterDelay > 0) return;
        if (e.type === 'boss') {
          const c2 = e.hp < e.maxHp ? COL_RED : COL_BRASS;
          drawSprite(ctx, SPR_BOSS[frameIdx], e.x, e.y, 2.2, COL_BONE, c2, e.rot);
        } else if (e.type === 'goei') {
          drawSprite(ctx, SPR_GOEI[frameIdx], e.x, e.y, 2.2, COL_BONE, COL_BRASS, e.rot);
        } else {
          drawSprite(ctx, SPR_ZAKO[frameIdx], e.x, e.y, 2.2, COL_BONE, COL_BRASS, e.rot);
        }
      });

      /* Captured ship */
      if (capturedShip) {
        drawSprite(ctx, SPR_PLAYER, capturedShip.x, capturedShip.y, 2.2, COL_RED, COL_BRASS, capturedShip.spin || 0);
      }

      /* Player ship(s) */
      if ((mode === 'playing' || mode === 'stageIntro') && !player.captured) {
        const blinkOff = player.invuln > 0 && Math.floor(tick / 4) % 2 === 0;
        if (!blinkOff) {
          if (dual) {
            drawSprite(ctx, SPR_PLAYER, player.x - 13, player.y, 2.2, COL_BONE, COL_BRASS, 0);
            drawSprite(ctx, SPR_PLAYER, player.x + 13, player.y, 2.2, COL_BONE, COL_BRASS, 0);
          } else {
            drawSprite(ctx, SPR_PLAYER, player.x, player.y, 2.2, COL_BONE, COL_BRASS, 0);
          }
        }
      }

      /* Bullets */
      ctx.fillStyle = COL_BRASS;
      bullets.forEach((b) => ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 6, 2, 10));
      ctx.fillStyle = COL_RED;
      enemyBullets.forEach((b) => ctx.fillRect(Math.round(b.x) - 2, Math.round(b.y) - 2, 4, 4));

      /* Particles & score popups */
      particles.forEach((p) => {
        ctx.fillStyle = p.col;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
      });
      ctx.font = '600 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = COL_BRASS;
      popups.forEach((p) => ctx.fillText(p.text, Math.round(p.x), Math.round(p.y)));

      /* Bottom lives icons */
      for (let i = 0; i < Math.max(0, lives - 1); i += 1) {
        drawSprite(ctx, SPR_PLAYER, 24 + i * 24, H - 16, 1.4, COL_BONE, COL_BRASS, 0);
      }

      /* Center status text (clean arcade typography, zero boxes) */
      ctx.textAlign = 'center';
      if (paused) {
        ctx.fillStyle = COL_BRASS;
        ctx.font = '700 18px monospace';
        ctx.fillText('PAUSED', W / 2, H / 2);
      } else if (mode === 'stageIntro') {
        ctx.fillStyle = COL_BRASS;
        ctx.font = '700 18px monospace';
        ctx.fillText(`STAGE ${String(stage).padStart(2, '0')}`, W / 2, H / 2);
        ctx.fillStyle = COL_DIM;
        ctx.font = '12px monospace';
        ctx.fillText('READY', W / 2, H / 2 + 24);
      } else if (mode === 'stageClear') {
        const ratio = shotsFired > 0 ? ((shotsHit / shotsFired) * 100).toFixed(1) : '0.0';
        ctx.fillStyle = COL_BRASS;
        ctx.font = '700 16px monospace';
        ctx.fillText(`STAGE ${String(stage).padStart(2, '0')} CLEAR`, W / 2, H / 2 - 22);
        ctx.fillStyle = COL_BONE;
        ctx.font = '12px monospace';
        ctx.fillText(`SHOTS FIRED  ${shotsFired}   /   HITS  ${shotsHit}`, W / 2, H / 2 + 6);
        ctx.fillText(`HIT RATIO  ${ratio}%`, W / 2, H / 2 + 26);
      } else if (mode === 'gameOver') {
        const ratio = shotsFired > 0 ? ((shotsHit / shotsFired) * 100).toFixed(1) : '0.0';
        ctx.fillStyle = COL_RED;
        ctx.font = '700 20px monospace';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 28);
        ctx.fillStyle = COL_BONE;
        ctx.font = '12px monospace';
        ctx.fillText(`SCORE  ${fmt6(score)}   ·   HIT RATIO  ${ratio}%`, W / 2, H / 2 + 2);
        ctx.fillStyle = COL_BRASS;
        ctx.fillText('PRESS SPACE OR R TO RETRY', W / 2, H / 2 + 30);
      }
    }

    let rafId = 0;
    const loop = () => {
      update();
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const onKeyDown = (e) => {
      const code = e.code || '';
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closeGalaga(); return; }
      if (code === 'ArrowLeft' || code === 'KeyA') { e.preventDefault(); keys.left = true; }
      if (code === 'ArrowRight' || code === 'KeyD') { e.preventDefault(); keys.right = true; }
      if (code === 'Space' || code === 'KeyZ') {
        e.preventDefault();
        if (mode === 'gameOver') { resetGame(); return; }
        keys.fire = true;
        firePlayer();
      }
      if (code === 'KeyP') { e.preventDefault(); paused = !paused; }
      if (code === 'KeyM') {
        e.preventDefault();
        const m = sfx.toggleMute();
        muteBtn.textContent = m ? 'SFX OFF' : 'SFX ON';
      }
      if (code === 'KeyR' && mode === 'gameOver') { e.preventDefault(); resetGame(); }
    };
    const onKeyUp = (e) => {
      const code = e.code || '';
      if (code === 'ArrowLeft' || code === 'KeyA') keys.left = false;
      if (code === 'ArrowRight' || code === 'KeyD') keys.right = false;
      if (code === 'Space' || code === 'KeyZ') keys.fire = false;
    };

    muteBtn.addEventListener('click', () => {
      const m = sfx.toggleMute();
      muteBtn.textContent = m ? 'SFX OFF' : 'SFX ON';
    });
    escBtn.addEventListener('click', closeGalaga);
    bd.addEventListener('click', (e) => { if (e.target === bd) closeGalaga(); });

    /* Touch controls */
    footBar.querySelectorAll('[data-t]').forEach((btn) => {
      const kind = btn.dataset.t;
      const down = (ev) => {
        ev.preventDefault();
        if (kind === 'fire') {
          if (mode === 'gameOver') { resetGame(); return; }
          keys.fire = true;
          firePlayer();
        } else {
          keys[kind] = true;
        }
      };
      const up = (ev) => { ev.preventDefault(); keys[kind] = false; };
      btn.addEventListener('pointerdown', down);
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointerleave', up);
      btn.addEventListener('pointercancel', up);
    });

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);

    resetGame();
    rafId = requestAnimationFrame(loop);

    cleanupFn = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
  }

  window.__CHOAM_GALAGA_OPEN__ = openGalaga;
})();
