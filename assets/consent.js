/* Consentimiento de cookies + Google Analytics 4 (Consent Mode v2).
   GA4 solo se carga si el visitante acepta. La elección se guarda en
   localStorage ('qv-consent': granted | denied). */
(function () {
  'use strict';

  var GA_ID = 'G-LVDQS0MXF4';
  var KEY = 'qv-consent';

  // Stub de gtag siempre presente: los eventos se encolan en dataLayer y
  // solo se procesan si el script llega a cargarse (tras consentimiento).
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function cargarGA() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Helper de eventos: siempre llamable; solo llega a GA si hubo consentimiento
  // y el script cargó. Vercel Analytics (sin cookies) recibe siempre.
  window.qvTrack = function (nombre, datos) {
    try { gtag('event', nombre, datos || {}); } catch (e) {}
  };

  window.qvConsentReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  function decidir(valor) {
    try { localStorage.setItem(KEY, valor); } catch (e) {}
    var b = document.getElementById('qv-cookies');
    if (b) b.remove();
    if (valor === 'granted') cargarGA();
  }

  function pintarBanner() {
    var b = document.createElement('div');
    b.id = 'qv-cookies';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML =
      '<div class="qv-ck-inner">' +
      '<p>Usamos cookies de analítica (Google Analytics) para entender cómo se usa la web. Puedes aceptarlas o rechazarlas — la web funciona igual. <a href="/cookies/">Más información</a>.</p>' +
      '<div class="qv-ck-botones">' +
      '<button type="button" id="qv-ck-no">Rechazar</button>' +
      '<button type="button" id="qv-ck-si">Aceptar</button>' +
      '</div></div>';
    document.body.appendChild(b);
    document.getElementById('qv-ck-si').addEventListener('click', function () { decidir('granted'); });
    document.getElementById('qv-ck-no').addEventListener('click', function () { decidir('denied'); });
  }

  function init() {
    var previo = null;
    try { previo = localStorage.getItem(KEY); } catch (e) {}
    if (previo === 'granted') { cargarGA(); return; }
    if (previo === 'denied') { return; }
    pintarBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
