const actions = { scheherazade: ['get', 'download.html'], 'donguri-restaurant': ['play', 'https://donguri.run'] };
const galleries = [...document.querySelectorAll('.gallery')].map(gallery => {
  const track = gallery.querySelector('.track');
  const panels = [...track.children];
  const prev = gallery.querySelector('.prev'), next = gallery.querySelector('.next');
  const count = gallery.querySelector('.count'), action = gallery.querySelector('.action');
  const at = () => Math.max(0, Math.min(panels.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
  const sync = () => {
    const index = at();
    prev.disabled = index === 0; next.disabled = index === panels.length - 1;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
    const project = panels[index].dataset.project, target = actions[project];
    gallery.querySelector('.project-count').textContent = `CHOAM / ${String(Math.floor(index / 2) + 1).padStart(2, '0')} — 05`;
    action.hidden = !target;
    if (target) { action.textContent = `${target[0]} ↗`; action.href = target[1]; action.setAttribute('aria-label', `${target[0]} ${project}`); }
    panels.forEach((panel, i) => panel.querySelectorAll('a').forEach(link => { link.tabIndex = i === index ? 0 : -1; }));
  };
  let current = 0;
  const go = direction => {
    current = Math.max(0, Math.min(panels.length - 1, current + direction));
    track.scrollTo({left: current * track.clientWidth, behavior: 'instant'});
  };
  [prev, next].forEach(button => button.addEventListener('pointerdown', event => event.preventDefault()));
  prev.onclick = () => go(-1); next.onclick = () => go(1);
  track.addEventListener('scroll', sync, {passive:true});
  const activate = () => panels.forEach((panel, i) => panel.classList.toggle('is-active', i === at()));
  track.addEventListener('scrollend', () => { current = at(); sync(); activate(); });
  activate();
  let width = track.clientWidth;
  new ResizeObserver(() => {
    const nextWidth = track.clientWidth;
    if (nextWidth === width) return;
    const index = Math.round(track.scrollLeft / width);
    width = nextWidth;
    track.scrollTo({left:index * width, behavior:'instant'});
    sync();
  }).observe(track);
  sync();
  return {gallery, go};
});
document.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  const focused = galleries.find(({gallery}) => gallery.contains(document.activeElement));
  const visible = galleries.map(item => {
    const rect = item.gallery.getBoundingClientRect();
    return {...item, visible:Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top))};
  }).sort((a,b) => b.visible - a.visible)[0];
  const active = focused || (visible?.visible > 0 ? visible : null);
  if (active) { event.preventDefault(); active.go(event.key === 'ArrowLeft' ? -1 : 1); }
});
