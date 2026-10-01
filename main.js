// fade in blocks as they enter view
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 });
document.querySelectorAll('.label,.ai-art,.ai-txt,.games article,.mail').forEach(el => { el.classList.add('rv'); io.observe(el) });
