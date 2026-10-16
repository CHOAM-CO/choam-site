/* PC candidate: fragment scroll & current project marker */
(() => {
  const requestedFragment = location.hash;
  const track = document.querySelector('[data-track]');
  if (!track || !matchMedia('(min-width: 701px)').matches) return;
  const targetId = decodeURIComponent(requestedFragment.slice(1)).split('/')[0];
  if (targetId && document.getElementById(targetId)) {
    requestAnimationFrame(() => document.getElementById(targetId).scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  const current = document.querySelector('[data-current-title]');
  if (current) {
    const mark = () => { document.body.dataset.clarityCurrent = current.textContent.trim().toLowerCase(); };
    mark();
    new MutationObserver(mark).observe(current, { childList: true, characterData: true, subtree: true });
  }
})();
