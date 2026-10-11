/* CHOAM opening: one wide shot, drawn procedurally.
   A dark plain under haze. On the horizon a monumental block with a vertical cleft of warm light; from its base the light
   runs toward the viewer as branching channels (a delta seen from low altitude, or a nerve, read either way), thinning
   into the haze with distance, joined by fine cross-connections. A single small figure gives the scale.
   The title sequence (exposure, letters resolving, motto, credits) runs once from load; afterwards only haze and slow
   pulses of light along the channels move. prefers-reduced-motion: one still frame, no sequence. Text is real HTML. */
(() => {
  const intro = document.querySelector('.intro');
  const cv = intro && intro.querySelector('.scene');
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const grain = document.querySelector('.grain');
  const wm = intro.querySelector('.intro-wm');
  const letters = [...wm.querySelectorAll('span')];
  const motto = intro.querySelector('.intro-motto');
  const credits = intro.querySelector('.intro-foot');
  const root = getComputedStyle(document.documentElement);

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = x => 1 - Math.pow(1 - clamp(x), 3);
  const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  /* world: camera at height H over an endless plain; z = distance. screen x = cx + X·f/z, y = y0 + H·f/z */
  const H = 1.2, ZS = 112, ZN = .8, L = Math.log(ZS / ZN);
  const zAt = u => ZS * Math.exp(-u * L);
  let W = 0, Hh = 0, dpr = 1, cx = 0, y0 = 0, f = 1, top = 0, bottom = 0;
  let branches = [], links = [], haze = null;

  /* seeded so every load (and every capture) draws the same landscape */
  let seed = 1;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  let ub = .65; /* the u at which the plain meets the bottom of the frame */
  function build() {
    seed = 20261010;
    branches = [];
    ub = Math.log(ZS / (H * f / Math.max(40, Hh - bottom - y0))) / L;
    /* fan width: a channel aimed at +-1 reaches the bottom corner of the frame, at any aspect */
    const zB = H * f / Math.max(40, Hh - bottom - y0); /* distance seen at the bottom edge of the frame */
    const DU = .005, LEVELS = [.16, .34, .5, .64, .77, .88, .97].map(x => x * ub);
    /* a delta: one channel leaves the light, and forks again and again as it comes toward us.
       Each fork splits the remaining fan in two, so the channels spread evenly across the plain. */
    const grow = (u, X, v, depth, aim, half, parent) => {
      const b = { pts: [], depth, parent, w: Math.max(.35, 1 - depth * .11), id: branches.length };
      branches.push(b);
      let z = zAt(u);
      /* each channel meanders; the swing is a fixed size on screen, so it reads near and far */
      const k = 9 + rnd() * 10, ph = rnd() * 6.283, amp = (6 + rnd() * 12) / f, u0 = u;
      const m = uu => clamp((uu - u0) * 6) * (Math.sin(uu * k + ph) - Math.sin(u0 * k + ph));
      const stop = depth < LEVELS.length ? LEVELS[depth] + (rnd() - .5) * .05 * ub : ub * 1.08;
      const dies = depth > 2 && rnd() < .12; /* some tributaries simply run dry */
      const end = dies ? u + (stop - u) * (.4 + rnd() * .5) : stop;
      let D = X;
      b.pts.push(u, D);
      while (u < end) {
        const u2 = u + DU, z2 = zAt(u2), dz = z - z2;
        /* steer toward where this channel should leave the frame (aim -1..1 = left..right bottom corner) */
        const vd = (aim * zB * (W / 2) / f - X) / (z - zB + .6);
        v += (clamp(vd, -.6, .6) - v) * .12;
        X += v * dz;
        u = u2; z = z2;
        D = X + amp * z * m(u);
        b.pts.push(u, D);
        if (Math.abs(D) / z > ((W / 2) / f) * 1.1) return; /* left the frame */
      }
      if (dies || depth >= LEVELS.length || branches.length > 200) return;
      const h = half * (.75 + rnd() * .5);
      grow(u, D, v, depth + 1, aim - h, half / 2, b);
      grow(u, D, v, depth + 1, aim + h, half / 2, b);
    };
    grow(.002, 0, 0, 0, 0, .5, null);
    /* fine connections between neighbouring channels at the same distance */
    const pts = [];
    branches.forEach((b, bi) => { for (let k = 6; k < b.pts.length / 2; k += 7) pts.push([bi, b.pts[2 * k], b.pts[2 * k + 1]]); });
    links = [];
    for (let i = 0; i < pts.length && links.length < 260; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], c = pts[j];
        if (a[0] === c[0] || Math.abs(a[1] - c[1]) > .02) continue;
        const z = zAt(a[1]);
        const d = Math.abs(a[2] - c[2]) / z;
        if (d > .004 && d < .05 && rnd() < .5) { links.push([a[1], a[2], c[1], c[2]]); break; }
      }
    }
  }

  /* soft haze texture: two octaves of value noise at low resolution, smoothed by upscaling when drawn */
  function makeHaze() {
    const c = document.createElement('canvas'); c.width = 160; c.height = 24;
    const g = c.getContext('2d'), img = g.createImageData(160, 24);
    const lat = (w, h) => { const a = []; for (let i = 0; i < w * h; i++) a.push(rnd()); return a; };
    const A = lat(17, 4), B = lat(41, 7);
    /* p: the lattice wraps every p cells in x, matching the cells the 160px width spans, so the texture tiles without a seam */
    const sample = (arr, w, h, x, y, p) => {
      const xi = Math.floor(x), yi = Math.floor(y), tx = x - xi, ty = y - yi, s = t => t * t * (3 - 2 * t);
      const at = (i, j) => arr[((j % h) + h) % h * w + ((i % p) + p) % p];
      const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * s(tx), b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * s(tx);
      return a + (b - a) * s(ty);
    };
    for (let y = 0; y < 24; y++) for (let x = 0; x < 160; x++) {
      const n = .65 * sample(A, 17, 4, x / 160 * 16, y / 24 * 3, 16) + .35 * sample(B, 41, 7, x / 160 * 40, y / 24 * 6, 40);
      const edge = Math.sin(Math.PI * y / 23); /* fade at top and bottom of the band */
      const i = (y * 160 + x) * 4;
      img.data[i] = 205; img.data[i + 1] = 170; img.data[i + 2] = 128;
      img.data[i + 3] = Math.round(255 * clamp((n - .32) * 1.6) * edge);
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  function resize() {
    const r = intro.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.max(1, r.width); Hh = Math.max(1, r.height);
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    top = parseFloat(root.getPropertyValue('--mast-h')) || 64;
    bottom = parseFloat(root.getPropertyValue('--deck-h')) || 58;
    const F = Hh - top - bottom, portrait = W < Hh;
    y0 = top + F * (portrait ? .6 : .68);
    f = F * 1.25;
    cx = W / 2;
    if (!haze) { seed = 7; haze = makeHaze(); }
    build();
  }

  const sx = (X, z) => cx + X * f / z;
  const sy = z => y0 + H * f / z;

  function draw(t, E, R, S) {
    const c = ctx;
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    /* sky and plain */
    let g = c.createLinearGradient(0, top, 0, y0);
    g.addColorStop(0, '#040506'); g.addColorStop(.45, '#0a0c0f'); g.addColorStop(.82, '#1a1917'); g.addColorStop(1, '#3d3226');
    c.fillStyle = g; c.fillRect(0, 0, W, y0);
    g = c.createLinearGradient(0, y0, 0, Hh);
    g.addColorStop(0, '#1d1812'); g.addColorStop(.12, '#0e0c0a'); g.addColorStop(1, '#040404');
    c.fillStyle = g; c.fillRect(0, y0, W, Hh - y0);

    /* the block and its cleft of light */
    const zb = ZS + 2, bw = 34 * f / zb, bh = 12.5 * f / zb, base = sy(zb), btop = base - bh;
    /* horizon glow behind it */
    c.globalCompositeOperation = 'screen';
    g = c.createRadialGradient(cx, base, 0, cx, base, W * .55);
    g.addColorStop(0, `rgba(217,163,98,${.34 * S})`); g.addColorStop(.35, `rgba(150,110,70,${.12 * S})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.translate(cx, base); c.scale(1, .32); c.translate(-cx, -base);
    c.fillStyle = g; c.fillRect(0, base - W * .6, W, W * 1.2); c.restore();
    /* a faint shaft rising from the cleft */
    g = c.createLinearGradient(0, btop, 0, top);
    g.addColorStop(0, `rgba(217,163,98,${.16 * S})`); g.addColorStop(1, 'rgba(217,163,98,0)');
    c.fillStyle = g; c.fillRect(cx - 1.5, top, 3, btop - top);
    g = c.createLinearGradient(cx - 40, 0, cx + 40, 0);
    g.addColorStop(0, 'rgba(217,163,98,0)'); g.addColorStop(.5, `rgba(217,163,98,${.05 * S})`); g.addColorStop(1, 'rgba(217,163,98,0)');
    c.fillStyle = g; c.fillRect(cx - 40, top, 80, btop - top);
    c.globalCompositeOperation = 'source-over';
    g = c.createLinearGradient(0, btop, 0, base);
    g.addColorStop(0, '#16130f'); g.addColorStop(1, '#0d0c0a');
    c.fillStyle = g; c.fillRect(cx - bw / 2, btop, bw, bh);
    c.fillStyle = `rgba(217,163,98,${.28 * S})`; c.fillRect(cx - bw / 2, btop, bw, Math.max(.6, 1 / dpr)); /* rim light on the top edge */
    /* cleft */
    c.globalCompositeOperation = 'screen';
    const cw = Math.max(1.2, .5 * f / zb);
    g = c.createLinearGradient(cx - cw * 9, 0, cx + cw * 9, 0);
    g.addColorStop(0, 'rgba(217,163,98,0)'); g.addColorStop(.5, `rgba(217,163,98,${.42 * S})`); g.addColorStop(1, 'rgba(217,163,98,0)');
    c.fillStyle = g; c.fillRect(cx - cw * 9, btop, cw * 18, bh);
    c.fillStyle = `rgba(255,226,180,${.95 * S})`; c.fillRect(cx - cw / 2, btop + bh * .02, cw, bh * .98);
    /* light pooling on the ground at the base */
    g = c.createRadialGradient(cx, base, 0, cx, base, bw * .9);
    g.addColorStop(0, `rgba(255,214,160,${.5 * S})`); g.addColorStop(1, 'rgba(217,163,98,0)');
    c.save(); c.translate(cx, base); c.scale(1, .12); c.translate(-cx, -base);
    c.fillStyle = g; c.fillRect(cx - bw, base - bw, bw * 2, bw * 2); c.restore();

    /* haze drifting across the horizon, over the base of the block */
    if (haze) {
      const bandH = (Hh - top - bottom) * .2;
      [[.0045, .5, -.55, 1], [-.0028, .32, -.15, 1.4]].forEach(([sp, a, off, sc]) => {
        const tw = W * 2.2 * sc, x = (((t * sp * W) % tw) + tw) % tw;
        c.globalAlpha = a * (.4 + .6 * E);
        for (const ox of [x - tw, x]) c.drawImage(haze, ox, y0 + bandH * off, tw, bandH);
      });
      c.globalAlpha = 1;
    }

    /* channels of light running toward the viewer */
    c.lineCap = 'round';
    const visU = R * ub * 1.1;
    for (const b of branches) {
      const P = b.pts, n = P.length / 2;
      for (let k = 0; k < n - 1; k += 4) {
        const u = P[2 * k];
        if (u > visU) break;
        const z = zAt(u);
        const w = .02 * (.35 + .65 * b.w) * f / z;
        const ext = Math.exp(-z / 40);
        const a = clamp((.16 + .9 * ext) * Math.min(1, w / .6)) * (.6 + .4 * b.w) * E;
        if (a < .01) continue;
        const end = Math.min(n - 1, k + 4);
        c.beginPath();
        c.moveTo(sx(P[2 * k + 1], z), sy(z));
        for (let j = k + 1; j <= end; j++) { const zj = zAt(P[2 * j]); if (P[2 * j] > visU) break; c.lineTo(sx(P[2 * j + 1], zj), sy(zj)); }
        const rgb = `${Math.round(160 + 80 * ext)},${Math.round(124 + 60 * ext)},${Math.round(86 + 36 * ext)}`;
        /* a wide faint pass for the glow off the water, then the channel itself */
        c.strokeStyle = `rgba(${rgb},${(a * .1).toFixed(3)})`; c.lineWidth = Math.min(w * 5, 18);
        c.stroke();
        c.strokeStyle = `rgba(${rgb},${a})`; c.lineWidth = Math.max(.6, Math.min(w, 4));
        c.stroke();
      }
    }
    /* fine connections, fading into the distance */
    c.lineWidth = .5;
    for (const [u1, x1, u2, x2] of links) {
      if (Math.max(u1, u2) > visU) continue;
      const z1 = zAt(u1), z2 = zAt(u2), a = .22 * Math.exp(-Math.min(z1, z2) / 30) * E;
      if (a < .01) continue;
      c.strokeStyle = `rgba(200,170,130,${a})`;
      c.beginPath(); c.moveTo(sx(x1, z1), sy(z1)); c.lineTo(sx(x2, z2), sy(z2)); c.stroke();
    }
    /* slow pulses: a few waves of light leave the cleft and run out along the delta. At each fork a wave takes one
       path or both (decided per wave, so it follows a route instead of flickering); since distance is logarithmic
       it seems to gather speed as it reaches us. */
    const WAVES = 3, SPD = .045;
    for (let q = 0; q < WAVES; q++) {
      const ph = t * SPD + q / WAVES, cyc = Math.floor(ph), pu = (ph - cyc) * ub * 1.25;
      if (pu > visU) continue;
      const lit = new Map();
      const on = b => {
        if (lit.has(b.id)) return lit.get(b.id);
        let h = Math.sin(b.id * 127.1 + cyc * 311.7 + q * 74.7) * 43758.5453; h -= Math.floor(h);
        const v = (!b.parent || on(b.parent)) && (!b.parent || h < .62);
        lit.set(b.id, v); return v;
      };
      for (const b of branches) {
        const P = b.pts, n = P.length / 2, u0 = P[0], u1 = P[2 * (n - 1)];
        if (pu <= u0 || pu > u1 + .04 || !on(b)) continue;
        let k = Math.min(n - 1, Math.floor((pu - u0) / .005));
        const k0 = Math.max(0, k - 12);
        if (k0 >= k) continue;
        const z = zAt(P[2 * k]), w = .024 * b.w * f / z, ext = Math.exp(-z / 40);
        const a = clamp((.2 + .8 * ext) * Math.min(1, w / .7)) * E;
        if (a < .02) continue;
        g = c.createLinearGradient(sx(P[2 * k0 + 1], zAt(P[2 * k0])), sy(zAt(P[2 * k0])), sx(P[2 * k + 1], z), sy(z));
        g.addColorStop(0, 'rgba(255,214,160,0)'); g.addColorStop(1, `rgba(255,226,184,${a})`);
        c.strokeStyle = g; c.lineWidth = Math.max(.8, Math.min(w, 4.5));
        c.beginPath();
        for (let j = k0; j <= k; j++) { const zj = zAt(P[2 * j]); j === k0 ? c.moveTo(sx(P[2 * j + 1], zj), sy(zj)) : c.lineTo(sx(P[2 * j + 1], zj), sy(zj)); }
        c.stroke();
      }
    }
    c.globalCompositeOperation = 'source-over';

    /* one figure on the plain, for scale, with a long shadow thrown toward us */
    const fz = 64, fX = (W < Hh ? 2.6 : 5.2), fx = sx(fX, fz), fb = sy(fz), fh = 1.8 * f / fz;
    g = c.createLinearGradient(fx, fb, fx + (fx - cx) * .5, fb + fh * 2.2);
    g.addColorStop(0, `rgba(0,0,0,${.55 * E})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(fx - fh * .07, fb); c.lineTo(fx + fh * .07, fb); c.lineTo(fx + (fx - cx) * .5 + fh * .5, fb + fh * 2.2); c.lineTo(fx + (fx - cx) * .5 - fh * .2, fb + fh * 2.2); c.closePath(); c.fill();
    c.fillStyle = `rgba(6,5,4,${E})`;
    c.beginPath();
    c.arc(fx, fb - fh * .9, fh * .075, 0, Math.PI * 2);
    c.moveTo(fx - fh * .11, fb - fh * .8); c.lineTo(fx + fh * .11, fb - fh * .8); c.lineTo(fx + fh * .085, fb - fh * .38);
    c.lineTo(fx + fh * .06, fb); c.lineTo(fx - fh * .06, fb); c.lineTo(fx - fh * .085, fb - fh * .38); c.closePath();
    c.fill();
    c.fillStyle = `rgba(217,163,98,${.35 * S})`; c.fillRect(fx - .4, fb - fh * .8, .8, fh * .42); /* rim of light on the near edge */

    /* the near ground falls into shadow so the credits read over it */
    const Fh = Hh - top - bottom;
    g = c.createLinearGradient(0, Hh - bottom - Fh * .3, 0, Hh - bottom);
    g.addColorStop(0, 'rgba(4,4,4,0)'); g.addColorStop(.7, 'rgba(4,4,4,.62)'); g.addColorStop(1, 'rgba(4,4,4,.86)');
    c.fillStyle = g; c.fillRect(0, Hh - bottom - Fh * .3, W, Fh * .3 + bottom);
    /* lens: vignette, and the exposure that opens the shot */
    g = c.createRadialGradient(cx, y0, Math.min(W, Hh) * .2, cx, y0, Math.max(W, Hh) * .8);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.6)');
    c.fillStyle = g; c.fillRect(0, 0, W, Hh);
    if (E < 1) { c.fillStyle = `rgba(4,4,5,${1 - E})`; c.fillRect(0, 0, W, Hh); }
  }

  /* ---------- the title sequence (text stays real HTML; inline styles only while it runs) ---------- */
  const startAtIntro = !location.hash;
  const seq = !reduce && startAtIntro;
  const baseLs = parseFloat(getComputedStyle(wm).letterSpacing) / parseFloat(getComputedStyle(wm).fontSize) || .36;
  const textAt = t => {
    letters.forEach((el, i) => {
      const p = ease((t - 1.5 - i * .14) / 1.7);
      el.style.opacity = p.toFixed(3);
      el.style.filter = p < 1 ? `blur(${((1 - p) * 14).toFixed(2)}px)` : '';
    });
    const ls = baseLs + .3 * (1 - easeIO((t - 1.3) / 3.2));
    wm.style.letterSpacing = wm.style.marginRight = '';
    wm.style.letterSpacing = `${ls.toFixed(4)}em`; wm.style.marginRight = `${(-ls).toFixed(4)}em`;
    motto.style.opacity = ease((t - 3.7) / 1.3).toFixed(3);
    credits.style.opacity = ease((t - 4.6) / 1.2).toFixed(3);
  };
  const clearText = () => {
    letters.forEach(el => { el.style.opacity = ''; el.style.filter = ''; });
    wm.style.letterSpacing = ''; wm.style.marginRight = ''; motto.style.opacity = ''; credits.style.opacity = '';
  };
  if (seq) textAt(0);

  /* ---------- loop: runs only while the opening is on screen and the tab is visible ---------- */
  let t = seq ? 0 : 8, last = 0, raf = 0, onScreen = true, textDone = !seq, grainT = 0;
  const frame = () => {
    const now = performance.now(); /* not the rAF stamp: some hosts (and the capture clock) stamp it differently */
    const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
    t += dt;
    const E = seq ? ease(t / 2.6) : 1, R = seq ? easeIO((t - .7) / 3.6) : 1, S = seq ? ease((t - .2) / 1.8) : 1;
    draw(t, E, R, S);
    if (!textDone) { if (t > 6.2) { clearText(); textDone = true; } else textAt(t); }
    if (grain && now - grainT > 90) { grainT = now; grain.style.transform = `translate(${Math.round(rnd() * 60 - 30)}px,${Math.round(rnd() * 60 - 30)}px)`; }
    raf = requestAnimationFrame(frame);
  };
  const run = () => { if (raf || reduce) return; last = 0; raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const update = () => { if (onScreen && !document.hidden) run(); else stop(); };

  resize();
  if (reduce) draw(8, 1, 1, 1);
  new ResizeObserver(() => { resize(); if (reduce || !raf) draw(t, seq ? ease(t / 2.6) : 1, 1, 1); }).observe(intro);
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (!onScreen && !textDone) { clearText(); textDone = true; } update(); }).observe(intro);
  document.addEventListener('visibilitychange', update);
  update();
  window.__scene = () => ({ t: +t.toFixed(2), running: !!raf, reduce, branches: branches.length, links: links.length });
})();
