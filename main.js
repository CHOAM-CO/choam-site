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

// seoul clock in the hero corner
const ck = document.getElementById('clock')
if (ck) { const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' }); const tick = () => { ck.textContent = f.format(new Date()) }; tick(); setInterval(tick, 15000) }

// captions rise in, images settle as each screen arrives
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add(e.target.matches('.work') ? 'seen' : 'in'); io.unobserve(e.target) } }), { threshold: .25 })
document.querySelectorAll('.work').forEach(w => io.observe(w))
document.querySelectorAll('.cap, .ai-txt, .nav-s, .contact').forEach(box => [...box.children].forEach((c, i) => { c.classList.add('rv', 'd' + Math.min(i, 4)); io.observe(c) }))
