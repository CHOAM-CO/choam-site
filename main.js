// fade in text blocks as they enter view
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .15 });
document.querySelectorAll('.bl,.mail,.art img').forEach(el => { el.classList.add('rv'); io.observe(el) });
