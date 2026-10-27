/* Shared CHOAM hero letter reveal. The live hero owns its timeline; other surfaces may start it on interaction. */
(() => {
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => 1 - Math.pow(1 - clamp(x), 3);
  const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const baseSpacing = element => parseFloat(getComputedStyle(element).letterSpacing) / parseFloat(getComputedStyle(element).fontSize) || .36;
  const apply = (letters, track, t, spacing, mobile) => {
    letters.forEach((el, i) => {
      const p = ease((t - 1.5 - i * .14) / 1.7);
      el.style.opacity = p.toFixed(3);
      el.style.filter = (!mobile && p < 1) ? `blur(${((1 - p) * 14).toFixed(2)}px)` : '';
    });
    const ls = spacing + .3 * (1 - easeIO((t - 1.3) / 3.2));
    track.style.letterSpacing = `${ls.toFixed(4)}em`;
    track.style.marginRight = `${(-ls).toFixed(4)}em`;
  };
  const clear = (letters, track) => {
    letters.forEach(el => { el.style.opacity = ''; el.style.filter = ''; });
    track.style.letterSpacing = '';
    track.style.marginRight = '';
  };
  const play = (letters, track, mobile) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { clear(letters, track); return () => {}; }
    const spacing = baseSpacing(track), start = performance.now();
    const end = Math.max(1.5 + (letters.length - 1) * .14 + 1.7, 4.5);
    let raf = 0, stopped = false;
    const frame = now => {
      if (stopped) return;
      const t = Math.min(end, 1.5 + (now - start) / 1000);
      apply(letters, track, t, spacing, mobile);
      if (t < end) raf = requestAnimationFrame(frame);
    };
    frame(start);
    return () => { stopped = true; cancelAnimationFrame(raf); clear(letters, track); };
  };
  window.CHOAMTextReveal = Object.freeze({ baseSpacing, apply, clear, play });
})();
