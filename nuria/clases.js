/* Qualivo · Nuria Roure · quién ve cada clase de El Círculo.
   Se carga en las páginas de las clases de nuriaroure.com (Elementor › Código personalizado).
   1) Lee el código de la alumna del enlace (?a={{contact.id}} en los emails y WhatsApp de Kliking)
      y lo guarda en el navegador, por si vuelve sin el enlace.
   2) Escucha el vídeo de Presto Player y avisa a Qualivo una sola vez por clase y paso:
      empieza (play), mitad (50 %) y acaba (90 %).
   No guarda ni envía nada si la persona no trae su código. Sin cookies de terceros. */
(function () {
  'use strict';
  var API = 'https://qualivo.io/api/nuria-clase/';
  var m = /clase-(\d)/i.exec(location.pathname);
  if (!m) return;
  var clase = m[1];
  var CLAVE = 'qv_nuria_a';
  var a = null;
  try {
    var p = new URLSearchParams(location.search).get('a');
    if (p && /^[A-Za-z0-9]{10,40}$/.test(p)) { a = p; localStorage.setItem(CLAVE, p); }
    else a = localStorage.getItem(CLAVE);
  } catch (e) { }
  if (!a) return;

  var hechos = {};
  function avisa(paso) {
    var k = 'qv_nuria_' + clase + '_' + paso + '_' + a;
    if (hechos[paso]) return;
    hechos[paso] = 1;
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch (e) { }
    var cuerpo = JSON.stringify({ a: a, clase: clase, paso: paso });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([cuerpo], { type: 'text/plain' }))) return;
    } catch (e) { }
    try { fetch(API, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: cuerpo }); } catch (e) { }
  }

  // Presto Player pinta el vídeo dentro de varios shadow DOM: buscamos los <video>/<audio> donde estén.
  function medios(raiz, out) {
    out = out || [];
    if (!raiz || !raiz.querySelectorAll) return out;
    Array.prototype.forEach.call(raiz.querySelectorAll('video,audio'), function (v) { out.push(v); });
    Array.prototype.forEach.call(raiz.querySelectorAll('*'), function (el) { if (el.shadowRoot) medios(el.shadowRoot, out); });
    return out;
  }
  var vistos = typeof WeakSet === 'function' ? new WeakSet() : null;
  function engancha(v) {
    if (vistos) { if (vistos.has(v)) return; vistos.add(v); } else { if (v.__qv) return; v.__qv = 1; }
    v.addEventListener('play', function () { avisa('empieza'); });
    v.addEventListener('timeupdate', function () {
      var d = v.duration;
      if (!d || !isFinite(d) || d < 30) return;
      var f = v.currentTime / d;
      if (f >= 0.5) avisa('mitad');
      if (f >= 0.9) avisa('acaba');
    });
    v.addEventListener('ended', function () { avisa('mitad'); avisa('acaba'); });
  }
  var n = 0;
  var t = setInterval(function () {
    medios(document).forEach(engancha);
    if (++n > 120) clearInterval(t);   // busca durante 4 minutos (el reproductor puede cargar tarde)
  }, 2000);
  medios(document).forEach(engancha);
})();
