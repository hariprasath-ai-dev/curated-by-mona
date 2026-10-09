(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHONE = '919629970159';

  /* header + mobile call bar */
  var hdr = $('header.top'), bar = $('.callbar');
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('scrolled', y > 20);
    if (bar) bar.classList.toggle('show', y > 300);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = hdr.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { hdr.classList.remove('open'); }); });
  }

  /* reveal on scroll */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* falling petals */
  var petals = $('.petals');
  if (petals && !reduce) {
    var colors = ['#D9C5EA', '#F7DCE1', '#EBDFF4', '#E7B9C4', '#C9DDBB'];
    var n = window.innerWidth < 640 ? 10 : 18;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i');
      p.className = 'petal';
      p.style.left = (Math.random() * 100) + '%';
      p.style.setProperty('--c', colors[i % colors.length]);
      p.style.setProperty('--d', (12 + Math.random() * 12) + 's');
      p.style.setProperty('--delay', (-Math.random() * 20) + 's');
      p.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
      var s = 0.6 + Math.random() * 0.9;
      p.style.width = (14 * s) + 'px'; p.style.height = (18 * s) + 'px';
      petals.appendChild(p);
    }
  }

  /* ribbon marquee: duplicate for seamless loop */
  $$('.ribbon-track').forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* review carousel */
  var row = $('.rev-row');
  if (row) {
    var step = function (d) {
      var card = row.querySelector('.rev');
      row.scrollBy({ left: d * (card.offsetWidth + 20), behavior: reduce ? 'auto' : 'smooth' });
    };
    var prev = $('#revPrev'), next = $('#revNext');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  }

  /* gallery lightbox */
  var lb = $('.lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var close = function () { lb.classList.remove('on'); };
    $$('.gallery figure').forEach(function (f) {
      f.addEventListener('click', function () {
        var img = f.querySelector('img');
        lbImg.src = img.getAttribute('data-full') || img.src;
        lbImg.alt = img.alt;
        lb.classList.add('on');
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* enquiry form -> WhatsApp */
  var form = $('#enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lines = ['Hi Mona! I would like to enquire.'];
      if (d.get('name')) lines.push('Name: ' + d.get('name'));
      if (d.get('type')) lines.push('Looking for: ' + d.get('type'));
      if (d.get('date')) lines.push('Date: ' + d.get('date'));
      if (d.get('guests')) lines.push('Guests / quantity: ' + d.get('guests'));
      if (d.get('msg')) lines.push('Details: ' + d.get('msg'));
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
