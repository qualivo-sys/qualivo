/* Consentimiento de cookies + Google Analytics 4 (Consent Mode v2).
   GA4 solo se carga si el visitante acepta. La elección se guarda en
   localStorage ('qv-consent': granted | denied). */
(function () {
  'use strict';

  var GA_ID = 'G-LVDQS0MXF4';
  var META_PIXEL = '1055987250570278';
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

  // Píxel de Meta: solo tras consentimiento. Los eventos del diagnóstico se
  // traducen a eventos del píxel para optimizar y hacer retargeting.
  function cargarMeta() {
    if (window.fbq) return;
    var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    var s = document.createElement('script');
    s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    fbq('init', META_PIXEL);
    fbq('track', 'PageView');
  }

  var META_EVENTOS = {
    hero_start: ['trackCustom', 'HeroStart'],
    hero_complete: ['trackCustom', 'HeroComplete'],
    hero_result_view: ['trackCustom', 'HeroResult'],
    hero_email_submit: ['track', 'Lead'],
    hero_radiografia_click: ['trackCustom', 'HeroSiguientePaso'],
    diagnostico_solicitado: ['track', 'Contact']
  };

  // Helper de eventos: siempre llamable; solo llega a GA y a Meta si hubo
  // consentimiento y los scripts cargaron. Vercel Analytics (sin cookies) recibe siempre.
  window.qvTrack = function (nombre, datos) {
    try { gtag('event', nombre, datos || {}); } catch (e) {}
    try {
      var m = META_EVENTOS[nombre];
      if (m && window.fbq) {
        var d = datos || {};
        var params = { cuello: d.cuello || d.etapa_debil || '', nivel: d.nivel || '' };
        if (d.evento_id) fbq(m[0], m[1], params, { eventID: d.evento_id });
        else fbq(m[0], m[1], params);
      }
    } catch (e) {}
  };

  window.qvConsentReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  function decidir(valor) {
    try { localStorage.setItem(KEY, valor); } catch (e) {}
    var b = document.getElementById('qv-cookies');
    if (b) b.remove();
    if (valor === 'granted') { cargarGA(); cargarMeta(); }
  }

  function pintarBanner() {
    var b = document.createElement('div');
    b.id = 'qv-cookies';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML =
      '<div class="qv-ck-inner">' +
      '<p>Usamos cookies de analítica (Google Analytics) y de publicidad (Meta) para entender cómo se usa la web y medir los anuncios. Puedes aceptarlas o rechazarlas: la web funciona igual. <a href="/cookies/">Más información</a>.</p>' +
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
    if (previo === 'granted') { cargarGA(); cargarMeta(); return; }
    if (previo === 'denied') { return; }
    pintarBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
