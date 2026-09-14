/* Consentimiento de cookies + píxel de Meta — Antic Barcelona 113
 *
 * El píxel NO se carga hasta que hay consentimiento explícito. Cargarlo antes
 * infringe el art. 22 LSSI y el RGPD: es tecnología de rastreo de terceros y
 * el consentimiento tiene que ser previo, informado y revocable.
 */
(function () {
  'use strict';
  var PIXEL_ID = '1002102899517167';
  var CLAVE = 'ab113_consent';
  var VERSION = 1;

  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      return (v && v.version === VERSION) ? v : null;
    } catch (e) { return null; }
  }
  function guardar(acepta) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({
        version: VERSION, marketing: !!acepta, fecha: new Date().toISOString()
      }));
    } catch (e) {}
  }

  /* ---------- Píxel ---------- */
  var cargado = false;
  function cargarPixel() {
    if (cargado || !PIXEL_ID) return;
    cargado = true;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    // Vacía la cola de eventos que ocurrieron antes del consentimiento
    (window.__ab113_cola || []).forEach(function (ev) {
      fbq('track', ev.name, ev.params, { eventID: ev.id });
    });
    window.__ab113_cola = [];
  }
  window.ab113Consent = {
    concedido: function () { var c = leer(); return !!(c && c.marketing); },
    cargarPixel: cargarPixel
  };

  /* ---------- Banner ---------- */
  function banner() {
    var el = document.createElement('div');
    el.className = 'cookiebar';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Aviso de cookies');
    el.innerHTML =
      '<div class="cookiebar__in">' +
        '<p>Usamos cookies propias necesarias y, si nos lo permites, cookies de medición ' +
        'y publicidad para saber qué anuncios funcionan. Puedes cambiar de opinión cuando ' +
        'quieras. <a href="/privacidad">Política de privacidad</a>.</p>' +
        '<div class="cookiebar__btns">' +
          '<button class="btn btn--ghost" data-consent="no">Solo lo necesario</button>' +
          '<button class="btn btn--inv" data-consent="si">Aceptar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('in'); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var si = b.dataset.consent === 'si';
      guardar(si);
      if (si) cargarPixel();
      el.classList.remove('in');
      setTimeout(function () { el.remove(); }, 500);
    });
  }

  var c = leer();
  if (c && c.marketing) cargarPixel();
  else if (!c) (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', banner)
    : banner();
})();
