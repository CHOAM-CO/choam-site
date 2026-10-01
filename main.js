// sliders: one screen per image, swipe or [ <- ] [ -> ]
document.querySelectorAll('.slider').forEach(s => {
  const t = s.querySelector('.track'), n = t.children.length
  const prev = s.querySelector('.prev'), next = s.querySelector('.next'), c = s.querySelector('.count')
  const at = () => Math.round(t.scrollLeft / t.clientWidth)
  const sync = () => { const i = at(); c.textContent = `${i + 1} / ${n}`; prev.disabled = i === 0; next.disabled = i === n - 1 }
  const go = d => t.scrollTo({ left: (at() + d) * t.clientWidth, behavior: 'smooth' })
  prev.onclick = () => go(-1); next.onclick = () => go(1)
  t.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true })
  sync()
})
