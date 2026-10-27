/* About Us (us.html, people/*.html). Portrait behaviour from the local layout study: hover, keyboard focus or a selection
   turns a portrait to colour and plays the name reveal; on phones the first tap selects and the second opens the profile.
   Accessible names follow the site language: each element carries data-aria-en / -ko / -ja and is relabelled whenever
   main.js changes <html lang>. */
(() => {
  const html = document.documentElement;
  const labelled = [...document.querySelectorAll('[data-aria-en]')];
  const relabel = () => {
    const l = html.lang === 'ko' || html.lang === 'ja' ? html.lang : 'en';
    labelled.forEach(el => el.setAttribute('aria-label', el.getAttribute(`data-aria-${l}`) || el.getAttribute('data-aria-en')));
  };
  relabel();
  new MutationObserver(relabel).observe(html, { attributes: true, attributeFilter: ['lang'] });

  const portraits = [...document.querySelectorAll('.portrait')];
  if (!portraits.length) return;
  const canHover = matchMedia('(hover: hover)');
  const narrow = matchMedia('(max-width: 760px)');

  portraits.forEach(card => {
    const name = card.querySelector('.portrait-name');
    const markedLetters = [...name.querySelectorAll('.name-letter')];
    const letters = markedLetters.length ? markedLetters : [...name.children];
    let hovered = false, active = false, stop = () => {};
    const update = () => {
      const next = card.classList.contains('is-selected') || card.matches(':focus-visible') || (canHover.matches && hovered);
      if (next === active) return; /* no replay while moving across an already-active portrait */
      active = next;
      stop();
      if (active && window.CHOAMTextReveal) stop = window.CHOAMTextReveal.play(letters, name, narrow.matches);
    };
    card.addEventListener('pointerenter', () => { hovered = true; update(); });
    card.addEventListener('pointerleave', () => { hovered = false; update(); });
    card.addEventListener('focusin', () => requestAnimationFrame(update));
    card.addEventListener('focusout', () => requestAnimationFrame(update));
    card.updateReveal = update;
  });

  portraits.forEach(portrait => portrait.addEventListener('click', event => {
    const profile = portrait.dataset.profile;
    const touchFirstTap = profile && narrow.matches && event.detail > 0 && !portrait.classList.contains('is-selected');
    if (profile && !touchFirstTap) {
      window.location.href = profile;
      return;
    }
    portraits.forEach(card => {
      const chosen = card === portrait;
      card.classList.toggle('is-selected', chosen);
      card.setAttribute('aria-pressed', String(chosen));
      card.updateReveal();
    });
  }));
})();
