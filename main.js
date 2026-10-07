const actions = { scheherazade: ['get', 'download.html'], 'donguri-restaurant': ['play', 'https://donguri.run'] };
document.querySelectorAll('.gallery').forEach(gallery => {
  const track = gallery.querySelector('.track');
  const panels = [...track.children];
  const prev = gallery.querySelector('.prev'), next = gallery.querySelector('.next');
  const count = gallery.querySelector('.count'), action = gallery.querySelector('.action');
  const at = () => Math.round(track.scrollLeft / track.clientWidth);
  const sync = () => {
    const index = Math.min(panels.length - 1, at());
    prev.disabled = index === 0; next.disabled = index === panels.length - 1;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
    const project = panels[index].dataset.project, target = actions[project];
    action.hidden = !target;
    if (target) { action.textContent = `${target[0]} ↗`; action.href = target[1]; action.setAttribute('aria-label', `${target[0]} ${project}`); }
    panels.forEach((panel, i) => { panel.querySelectorAll('a').forEach(link => { link.tabIndex = i === index ? 0 : -1; }); });
  };
  const go = direction => track.scrollTo({left: Math.max(0, Math.min(panels.length - 1, at() + direction)) * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  prev.onclick = () => go(-1); next.onclick = () => go(1);
  gallery.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); go(event.key === 'ArrowLeft' ? -1 : 1); } });
  track.addEventListener('scroll', sync, {passive:true});
  let width = track.clientWidth;
  new ResizeObserver(() => { const index = Math.round(track.scrollLeft / width); width = track.clientWidth; track.scrollLeft = index * width; sync(); }).observe(track);
  sync();
});
