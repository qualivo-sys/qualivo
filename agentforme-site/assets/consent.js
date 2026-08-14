/* Consentimiento de cookies + Google Analytics 4 (Consent Mode v2) para
   agentforme.io. GA4 solo se carga si el visitante acepta. La elección se
   guarda en localStorage ('atm-consent': granted | denied). */
(function () {
  'use strict';

  var GA_ID = 'G-PENDIENTE'; // ← sustituir por el ID de GA4 de agentforme.io
  var KEY = 'atm-consent';

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
    if (!GA_ID || GA_ID.indexOf('G-') !== 0 || GA_ID === 'G-PENDIENTE') return;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Siempre llamable; solo llega a GA si hubo consentimiento y el script cargó.
  window.atmTrack = function (nombre, datos) {
    try { gtag('event', nombre, datos || {}); } catch (e) {}
  };

  window.atmConsentReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  function decidir(valor) {
    try { localStorage.setItem(KEY, valor); } catch (e) {}
    var b = document.getElementById('atm-cookies');
    if (b) b.remove();
    if (valor === 'granted') cargarGA();
  }

  function estilos() {
    var css = '#atm-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;' +
      'background:#0E141B;border:1px solid #1D2732;border-radius:14px;padding:18px 20px;' +
      'box-shadow:0 18px 50px rgba(0,0,0,.35);font-family:Inter,ui-sans-serif,sans-serif;' +
      'max-width:760px;margin:0 auto;display:flex;gap:16px;align-items:center;flex-wrap:wrap;' +
      'justify-content:space-between}' +
      '#atm-cookies p{margin:0;color:#8A97A3;font-size:13.5px;line-height:1.5;max-width:52ch}' +
      '#atm-cookies a{color:#3ECF8E}' +
      '#atm-cookies .atm-ck-botones{display:flex;gap:8px;flex-shrink:0}' +
      '#atm-cookies button{font-family:inherit;font-size:13.5px;font-weight:600;padding:10px 18px;' +
      'border-radius:9px;cursor:pointer;border:1px solid #1D2732;background:transparent;color:#E8ECEF}' +
      '#atm-cookies #atm-ck-si{background:#0FA968;border-color:#0FA968;color:#fff}' +
      '@media(max-width:600px){#atm-cookies{flex-direction:column;align-items:stretch}' +
      '#atm-cookies .atm-ck-botones{justify-content:flex-end}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function pintarBanner() {
    estilos();
    var b = document.createElement('div');
    b.id = 'atm-cookies';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML =
      '<p>Usamos cookies de analítica (Google Analytics) para entender cómo se usa la web. ' +
      'Puedes aceptarlas o rechazarlas — la web funciona igual. <a href="/privacidad/">Más información</a>.</p>' +
      '<div class="atm-ck-botones">' +
      '<button type="button" id="atm-ck-no">Rechazar</button>' +
      '<button type="button" id="atm-ck-si">Aceptar</button>' +
      '</div>';
    document.body.appendChild(b);
    document.getElementById('atm-ck-si').addEventListener('click', function () { decidir('granted'); });
    document.getElementById('atm-ck-no').addEventListener('click', function () { decidir('denied'); });
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
