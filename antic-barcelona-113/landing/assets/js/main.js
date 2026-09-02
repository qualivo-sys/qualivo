/* Antic Barcelona 113 — interacción y movimiento */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveals ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv], .rv-img, .mask-line').forEach(function (el) { io.observe(el); });

  /* ---------- Barra superior ---------- */
  var bar = document.querySelector('.topbar');
  if (bar) {
    var onScrollBar = function () { bar.classList.toggle('stuck', scrollY > 60); };
    addEventListener('scroll', onScrollBar, { passive: true });
    onScrollBar();
  }

  /* ---------- Parallax ---------- */
  var pxEls = [].slice.call(document.querySelectorAll('[data-px]'));
  var hero = document.querySelector('.hero__media img');
  var ticking = false;
  function frame() {
    var y = scrollY, vh = innerHeight;
    if (hero && y < vh * 1.2) hero.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0) scale(' + (1.04 + y / vh * 0.06) + ')';
    pxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = 'translate3d(0,' + (p * parseFloat(el.dataset.px)).toFixed(2) + 'px,0)';
    });
    ticking = false;
  }
  if (!reduce) {
    addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }, { passive: true });
    frame();
  }

  /* ---------- Escena fija: de viga a mesa ---------- */
  var scene = document.querySelector('.scene');
  if (scene) {
    var layers = scene.querySelectorAll('.scene__layer');
    var steps = scene.querySelectorAll('.scene__step');
    var dots = scene.querySelectorAll('.scene__prog i');
    var cur = -1;
    function updScene() {
      var r = scene.getBoundingClientRect();
      var total = scene.offsetHeight - innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / total));
      var i = Math.min(layers.length - 1, Math.floor(p * layers.length * 0.999));
      if (i === cur) return;
      cur = i;
      layers.forEach(function (l, n) { l.classList.toggle('on', n === i); });
      steps.forEach(function (s, n) { s.classList.toggle('on', n === i); });
      dots.forEach(function (d, n) { d.classList.toggle('on', n <= i); });
    }
    addEventListener('scroll', updScene, { passive: true });
    updScene();
  }

  /* ---------- Contadores ---------- */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '';
      if (reduce) { el.textContent = end + suf; return; }
      var t0 = null, dur = 1500;
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e2 = 1 - Math.pow(1 - k, 3);
        el.textContent = (end % 1 ? (end * e2).toFixed(1) : Math.round(end * e2)) + suf;
        if (k < 1) requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------- Cursor ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    var c = document.createElement('div'); c.className = 'cursor'; document.body.appendChild(c);
    var tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      c.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.card,.step,input,textarea,[data-choice]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { c.classList.add('big'); });
      el.addEventListener('mouseleave', function () { c.classList.remove('big'); });
    });
  }

  /* ---------- Botones magnéticos ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16) + 'px,' +
          ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Seguimiento (píxel listo, sin disparar sin consentimiento) ---------- */
  window.ab113 = {
    track: function (name, params) {
      if (typeof fbq === 'function') {
        fbq('track', name, params || {}, { eventID: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) });
      }
      if (typeof gtag === 'function') gtag('event', name, params || {});
      try { console.debug('[ab113] evento', name, params || {}); } catch (e) {}
    }
  };

  // fbclid persistente 90 días — permite atribuir ventas que cierran semanas después
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('fbclid')) localStorage.setItem('_fbc', 'fb.1.' + Date.now() + '.' + q.get('fbclid'));
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      if (q.get(k)) sessionStorage.setItem(k, q.get(k));
    });
  } catch (e) {}

  // ViewContent al 50 % de scroll
  var fired = false;
  addEventListener('scroll', function () {
    if (fired) return;
    var d = document.documentElement;
    if ((scrollY + innerHeight) / d.scrollHeight > 0.5) { fired = true; window.ab113.track('ViewContent', { content_name: 'landing' }); }
  }, { passive: true });
})();
