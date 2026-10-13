/* CHOAM opening: Astra strikes a match, blows it out, and CHOAM resolves out of the dark.
   Native port of the reviewed animatic (choam/astra_hero_animatic_DAT_20261013, method/composite_dat.py): the selected
   DAT still is the only picture; relight, match, flame, ember and smoke are drawn on the canvas in the animatic's own
   1280x720 frame coordinates, and the title is the real HTML text driven by scene.js's textAt() timing.
   Cycle 9.8 s, looping: 0.15 ignite, 2.2-2.6 blow out, 3.0 text spawn, 9.0-9.5 title fade, 9.8 loop.
   Runs only while the opening is on screen and the tab is visible; static canvas phases are not redrawn.
   prefers-reduced-motion: one still frame (steady lit match) with the title at rest, no loop. */
(() => {
  const intro = document.querySelector('.intro');
  const cv = intro && intro.querySelector('.scene');
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const grain = document.querySelector('.grain');
  const title = intro.querySelector('.intro-title');
  const wm = intro.querySelector('.intro-wm');
  const letters = [...wm.querySelectorAll('span')];
  const motto = intro.querySelector('.intro-motto');
  const credits = intro.querySelector('.intro-foot');

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = x => 1 - Math.pow(1 - clamp(x), 3);
  const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const tm = x => 1 - Math.exp(-Math.max(0, x) * 1.25); /* the animatic's tonemap for additive light */

  /* ---------- animatic frame (1280x720) and plate ---------- */
  const FW = 1280, FH = 720, CYCLE = 9.8;
  const PW = 1296, PH = 733, OX = (FW - PW) / 2, OY = (FH - PH) / 2; /* 1.25% overscan, centred */
  const MOUTH = [986, 360], FLAME = [1106, 432], FACE = [930, 300];
  const FOCUS = [965, 360]; /* kept on screen at every aspect: face, lips and flame */
  const T_IGNITE = .15, T_SETTLE = .6, T_INHALE0 = 1.35, T_INHALE1 = 1.95, T_BLOW0 = 2.2, T_OUT = 2.6, T_EMBER_END = 2.95;
  const T_TEXT0 = 3.0, T_TEXT_OFF = .7, T_FADE0 = 9.0, T_FADE1 = 9.5, T_SMOKE_END = 4.0;

  /* seeded band-limited flicker (sum of slow sines plus smoothed noise), as in the animatic */
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += rnd(); return (s - 3) / .7071; };
  const noise = Array.from({ length: 400 }, gauss);
  const smokePh = Array.from({ length: 4 }, () => rnd() * 6.28);
  const flicker = t => {
    const k = t * 12, i = Math.floor(k), f = k - i;
    const n = noise[i % 400] * (1 - f) + noise[(i + 1) % 400] * f;
    return 1 + .035 * Math.sin(t * 9.1) + .025 * Math.sin(t * 15.7 + 1) + .03 * n;
  };
  /* [intensity, height scale, lean px, ember] */
  const flameState = t => {
    if (t < T_IGNITE) return [0, 0, 0, 0];
    if (t < T_SETTLE) {
      const u = (t - T_IGNITE) / (T_SETTLE - T_IGNITE), flare = 1 + .6 * Math.exp(-u * 4);
      return [ease(u * 3) * flare, (.6 + .6 * ease(u * 2)) * Math.sqrt(flare), 0, 0];
    }
    if (t < T_BLOW0) return [flicker(t), .97 + .03 * Math.sin(t * 7), 2 * Math.sin(t * 2.3), 0];
    if (t < T_OUT) {
      const u = (t - T_BLOW0) / (T_OUT - T_BLOW0), gutter = 1 - Math.pow(smooth(u), .8), jit = .18 * Math.sin(t * 61) * u;
      return [Math.max(0, gutter * flicker(t) + jit * gutter), Math.max(.05, 1 - .75 * u), 26 * ease(u * 1.6), 0];
    }
    if (t < T_EMBER_END) { const u = (t - T_OUT) / (T_EMBER_END - T_OUT); return [0, 0, 0, (1 - u) * (1 - u)]; }
    return [0, 0, 0, 0];
  };
  /* breath: inhale rise, exhale lean-in -> [dy px, scale about the lips] */
  const plateMotion = t => {
    const rise = smooth((t - T_INHALE0) / (T_INHALE1 - T_INHALE0)) - smooth((t - T_BLOW0) / .5);
    const lean = smooth((t - (T_BLOW0 - .1)) / .45) * (1 - smooth((t - 2.9) / .6));
    return [-4 * rise + 2 * lean, 1 + .006 * lean];
  };

  /* ---------- layout: the frame covers the opening, never losing FOCUS; tall screens keep the face band in width ---------- */
  let W = 1, Hh = 1, dpr = 1, s = 1, ox = 0, oy = 0;
  function resize() {
    const r = intro.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.max(1, r.width); Hh = Math.max(1, r.height);
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr);
    s = Math.min(Math.max(W / FW, Hh / FH), W / 360);
    ox = clamp(W / 2 - FOCUS[0] * s, W - FW * s, 0);
    oy = FH * s >= Hh ? clamp(Hh / 2 - FOCUS[1] * s, Hh - FH * s, 0) : (Hh - FH * s) * .4;
    /* reduced motion keeps the title over the lit face: on tall screens the face drops below the motto (eyes at frame y 248) */
    if (reduce && Hh > W) oy = Math.max(oy, title.getBoundingClientRect().bottom - r.top + 70 - 248 * s);
  }

  const img = new Image();
  img.decoding = 'async';
  img.src = 'assets/astra-hero.webp';
  let ready = false, failed = false;

  /* radial falloff as a canvas gradient sampled from fn(r) -> [r,g,b] 0..1 */
  const radial = (c, x, y, R, fn, n = 14) => {
    const g = c.createRadialGradient(x, y, 0, x, y, R);
    for (let k = 0; k <= n; k++) {
      const q = k / n, [r, gg, b] = fn(q * R);
      g.addColorStop(q, `rgb(${Math.round(clamp(r) * 255)},${Math.round(clamp(gg) * 255)},${Math.round(clamp(b) * 255)})`);
    }
    return g;
  };
  const glow = (c, x, y, sigma, amp, col) => {
    c.fillStyle = radial(c, x, y, sigma * 3, r => { const e = Math.exp(-r * r / (2 * sigma * sigma)); return col.map(v => tm(amp * e * v)); }, 8);
    c.fillRect(x - sigma * 3, y - sigma * 3, sigma * 6, sigma * 6);
  };
  const gFn = d2 => .78 + .32 / (1 + d2 / 90000);

  function draw(t, steady) {
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    c.fillStyle = '#000'; c.fillRect(0, 0, W, Hh);
    c.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    let [I, hs, lean, ember] = flameState(t);
    if (steady) { I = 1; hs = 1; lean = 0; ember = 0; }
    const [bx, by] = FLAME;
    if (ready && (I > 0 || ember > 0)) {
      /* the still, with the breath transform (scale about the lips, then dy) */
      const [dy, sc] = steady ? [0, 1] : plateMotion(t);
      c.save();
      c.translate(MOUTH[0], MOUTH[1] + dy); c.scale(sc, sc); c.translate(-MOUTH[0], -MOUTH[1]);
      c.drawImage(img, OX, OY, PW, PH);
      c.restore();
      /* relight: multiplicative gain from the flame; at steady flame the face sits at 1.0 (= the still) */
      const hold = steady || (t >= T_SETTLE && t < T_BLOW0);
      const lx = hold ? bx : bx + lean * .5, ly = hold ? by - 18 : by - 18 * hs;
      const gF = gFn((FACE[0] - lx) ** 2 + (FACE[1] - ly) ** 2);
      const cap = 1 + .18 * Math.max(0, I - 1);
      c.globalCompositeOperation = 'multiply';
      c.fillStyle = radial(c, lx, ly, 1500, r => {
        const d2 = r * r;
        let Ie = I;
        if (hold) { const w = clamp((Math.exp(-d2 / (2 * 170 * 170)) - .08) / .92); Ie = 1 + (I - 1) * w; }
        const v = Math.min(Ie * gFn(d2) / gF, cap) + ember * .1 / (1 + d2 / 4900);
        return [v, v, v];
      }, 18);
      c.fillRect(-FW, -FH, FW * 3, FH * 3);
      /* match stick, lit by the flame, running out of frame over her shoulder */
      c.globalCompositeOperation = 'source-over';
      const lit = Math.min(1, I) + ember * .3;
      const sg = c.createLinearGradient(bx + 3, by + 6, bx + 58, FH + 10);
      sg.addColorStop(0, `rgba(10,7,6,1)`);
      sg.addColorStop(.06, `rgb(${Math.round(150 * lit)},${Math.round(80 * lit)},${Math.round(34 * lit)})`);
      sg.addColorStop(1, `rgb(${Math.round(70 * lit)},${Math.round(38 * lit)},${Math.round(16 * lit)})`);
      c.strokeStyle = sg; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); c.moveTo(bx + 3, by + 6); c.lineTo(bx + 58, FH + 10); c.stroke();
      c.fillStyle = `rgb(${Math.round(14 * lit)},${Math.round(8 * lit)},${Math.round(6 * lit)})`;
      c.beginPath(); c.arc(bx, by + 3, 4.5, 0, Math.PI * 2); c.fill();
    }
    c.globalCompositeOperation = 'lighter';
    if (I > .01 && hs > .01) {
      const h = 64 * hs, w = 10.5 * (.75 + .25 * hs), f = Math.pow(I, .7);
      const ax = v => bx + lean * Math.pow(v, 1.6);
      const prof = v => v < .32 ? Math.pow(Math.sin(Math.PI / 2 * Math.min(v / .32, 1)), .55) : Math.pow((1 - v) / .68, 1.25);
      const path = k => {
        c.beginPath();
        for (let i = 0; i <= 24; i++) { const v = i / 24; c.lineTo(ax(v) + w * k * prof(v), by - v * h); }
        for (let i = 24; i >= 0; i--) { const v = i / 24; c.lineTo(ax(v) - w * k * prof(v), by - v * h); }
        c.closePath();
      };
      /* soft outer edge, body, white core, blue root */
      c.globalAlpha = .35 * f; c.fillStyle = `rgb(${255 * tm(1.5)|0},${255 * tm(.78)|0},${255 * tm(.26)|0})`; path(1.35); c.fill();
      c.globalAlpha = f; path(1); c.fill();
      const cy = by - .3 * h, core = c.createRadialGradient(ax(.3), cy, 0, ax(.3), cy, h * .42);
      core.addColorStop(0, `rgba(${255 * tm(2.2)|0},${255 * tm(2.1)|0},${255 * tm(1.76)|0},1)`); core.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = core; path(.62); c.fill();
      c.globalAlpha = .6 * f; c.fillStyle = 'rgb(40,60,170)';
      c.beginPath(); c.ellipse(bx, by - .06 * h, w * .7, h * .07, 0, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
      glow(c, bx + lean * .4, by - h * .4, 30, I * .22, [1, .55, .22]);
      glow(c, bx + lean * .4, by - h * .4, 140, I * .12, [1, .6, .3]);
    }
    if (ember > .01) {
      glow(c, bx, by + 3, 3.2, ember * .9, [1, .42, .12]);
      glow(c, bx, by + 3, 14, ember * .15, [1, .35, .1]);
    }
    if (!steady && t >= T_OUT && t <= T_SMOKE_END) {
      const age = t - T_OUT, fade = smooth(age / .15) * (1 - smooth((age - .4) / .9));
      for (let k = 0; k < 4; k++) {
        const a = age - k * .05;
        if (a <= 0) continue;
        for (let j = 0; j < 28; j++) {
          const sj = j / 27 * a, y = by - 4 - sj * 120, x = bx + 26 * sj + 18 * Math.sin(sj * 5 + smokePh[k]) * sj, r = 2 + sj * 9;
          const amp = .085 / (1 + sj * 2.2) * fade;
          glow(c, x, y, r, amp, [.42, .42, .44]);
        }
      }
    }
    /* edges of the frame fall to the ground colour where the screen is taller than the frame; near ground shades for the credits */
    c.globalCompositeOperation = 'source-over';
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (oy > 0) {
      let g = c.createLinearGradient(0, oy, 0, oy + 60); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g; c.fillRect(0, 0, W, oy + 60);
      const b = oy + FH * s;
      g = c.createLinearGradient(0, b - 120, 0, b); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
      c.fillStyle = g; c.fillRect(0, b - 120, W, Hh - b + 120);
    }
    const sh = Hh * .26, g2 = c.createLinearGradient(0, Hh - sh, 0, Hh);
    g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,.72)');
    c.fillStyle = g2; c.fillRect(0, Hh - sh, W, sh);
    /* screen over the hero fill #08090b, as the animatic does */
    c.globalCompositeOperation = 'screen';
    c.fillStyle = '#08090b'; c.fillRect(0, 0, W, Hh);
    c.globalCompositeOperation = 'source-over';
  }

  /* ---------- the real HTML title (scene.js textAt timing) ---------- */
  const baseLs = parseFloat(getComputedStyle(wm).letterSpacing) / parseFloat(getComputedStyle(wm).fontSize) || .36;
  let creditsShown = false;
  const textAt = (T, fade) => {
    letters.forEach((el, i) => {
      const p = ease((T - 1.5 - i * .14) / 1.7);
      el.style.opacity = p.toFixed(3);
      el.style.filter = p < 1 ? `blur(${((1 - p) * 14).toFixed(2)}px)` : '';
    });
    const ls = baseLs + .3 * (1 - easeIO((T - 1.3) / 3.2));
    wm.style.letterSpacing = `${ls.toFixed(4)}em`; wm.style.marginRight = `${(-ls).toFixed(4)}em`;
    motto.style.opacity = ease((T - 3.7) / 1.3).toFixed(3);
    if (!creditsShown) { const cp = ease((T - 4.6) / 1.2); credits.style.opacity = cp.toFixed(3); if (cp >= 1) creditsShown = true; }
    title.style.opacity = fade.toFixed(3);
  };
  const clearText = () => {
    letters.forEach(el => { el.style.opacity = ''; el.style.filter = ''; });
    wm.style.letterSpacing = ''; wm.style.marginRight = ''; motto.style.opacity = ''; credits.style.opacity = ''; title.style.opacity = '';
    creditsShown = true;
  };

  /* ---------- loop ---------- */
  const startAtIntro = !location.hash;
  let t = startAtIntro ? 0 : 7.3, last = 0, raf = 0, onScreen = true, grainT = 0, drawnStatic = -1;
  const canvasStatic = tt => tt > T_SMOKE_END ? 2 : tt < T_IGNITE ? 1 : 0; /* 1/2: black frame, nothing to redraw */
  const frame = () => {
    const now = performance.now();
    const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
    if (ready) t = (t + dt) % CYCLE;
    const st = canvasStatic(t);
    if (!st || st !== drawnStatic) { draw(t, false); drawnStatic = st; }
    textAt(Math.min(6.3, Math.max(T_TEXT_OFF, t - T_TEXT0 + T_TEXT_OFF)), 1 - smooth((t - T_FADE0) / (T_FADE1 - T_FADE0)));
    if (grain && now - grainT > 90) { grainT = now; grain.style.transform = `translate(${Math.round(rnd() * 60 - 30)}px,${Math.round(rnd() * 60 - 30)}px)`; }
    raf = requestAnimationFrame(frame);
  };
  const run = () => { if (raf || reduce || failed) return; last = 0; raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const update = () => { if (onScreen && !document.hidden) run(); else stop(); };
  const still = () => { draw(1.0, true); };

  resize();
  if (reduce) { clearText(); draw(0, true); }
  else { textAt(T_TEXT_OFF, 1); if (!startAtIntro) { creditsShown = true; credits.style.opacity = ''; } draw(t, false); }
  const onReady = () => { ready = true; drawnStatic = -1; if (reduce) still(); else if (!raf) draw(t, false); };
  /* the still failed to load: stop, show the title and credits at rest on the dark ground (no further drawImage) */
  const onFail = () => { if (failed || ready) return; failed = true; stop(); clearText(); draw(5, false); }; /* t=5: no flame, ember or smoke */
  if (img.complete && img.naturalWidth) onReady();
  else if (img.complete) onFail();
  else { img.addEventListener('load', onReady, { once: true }); img.addEventListener('error', onFail, { once: true }); }
  new ResizeObserver(() => { resize(); drawnStatic = -1; if (failed) draw(5, false); else if (reduce) still(); else if (!raf) draw(t, false); }).observe(intro);
  new IntersectionObserver(es => {
    onScreen = es[0].isIntersecting;
    if (!onScreen && !creditsShown) { creditsShown = true; credits.style.opacity = ''; }
    update();
  }).observe(intro);
  document.addEventListener('visibilitychange', update);
  update();
  window.__scene = () => ({ t: +t.toFixed(2), running: !!raf, reduce, ready, failed, s: +s.toFixed(3), ox: Math.round(ox), oy: Math.round(oy) });
})();
