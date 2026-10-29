/* Consentimiento de cookies + Google Analytics 4 (Consent Mode v2) + píxel de Meta.
   T5.1 (29-oct): GA4 y el píxel se cargan siempre, sin esperar al banner, pero
   arrancan sin cookies: GA4 en Consent Mode 'denied' (pings anónimos que GA4
   modela) y el píxel con fbq('consent', 'revoke') (no envía ni guarda nada).
   Al aceptar se conceden los dos. La elección se guarda en localStorage
   ('qv-consent': granted | denied). */
(function () {
  'use strict';

  var GA_ID = 'G-LVDQS0MXF4';
  var META_PIXEL = '879197745226987';
  var KEY = 'qv-consent';

  // Stub de gtag siempre presente. Con el consentimiento en 'denied', GA4
  // recibe pings sin cookies; con 'granted', medición completa.
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
    if (window.__qvGA) return;
    window.__qvGA = true;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Píxel de Meta: se carga siempre, pero en 'revoke' hasta que el visitante
  // acepta. Los eventos del diagnóstico se traducen a eventos del píxel; sin
  // consentimiento, la señal de Meta llega por la Conversions API del servidor.
  function cargarMeta() {
    if (window.fbq) return;
    var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    var s = document.createElement('script');
    s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    fbq('consent', 'revoke');
    fbq('init', META_PIXEL);
    fbq('track', 'PageView');
  }

  function conceder() {
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    try { fbq('consent', 'grant'); } catch (e) {}
  }

  var META_EVENTOS = {
    hero_start: ['trackCustom', 'HeroStart'],
    hero_complete: ['trackCustom', 'HeroComplete'],
    hero_result_view: ['trackCustom', 'HeroResult'],
    hero_email_submit: ['track', 'Lead'],
    hero_radiografia_click: ['trackCustom', 'HeroSiguientePaso'],
    diagnostico_solicitado: ['track', 'Contact'],
    // Landing /diagnostico/. Sin esto el píxel nunca ve un Lead de la landing y
    // una campaña optimizada a Lead aprende de un evento que no ocurre.
    // Los tres de entrada al formulario. Sin ellos no se puede distinguir si la
    // gente no llega al formulario, llega y no lo abre, o lo empieza y lo deja.
    diagnostico_form_view: ['trackCustom', 'DiagnosticoFormView'],
    diagnostico_form_start: ['trackCustom', 'DiagnosticoFormStart'],
    diagnostico_form_abandon: ['trackCustom', 'DiagnosticoFormAbandon'],
    diagnostico_paso1: ['trackCustom', 'DiagnosticoPaso1'],
    diagnostico_lead: ['track', 'Lead'],
    diagnostico_leadform_agenda: ['trackCustom', 'DiagnosticoAgenda'],
    diagnostico_whatsapp: ['trackCustom', 'DiagnosticoWhatsApp'],
    // Landing de formación (13-oct). La reserva va como evento propio, no como Schedule: el Schedule
    // estándar lo manda el servidor al entrar la cita (api/_cita.js) y con otro id contaría dos veces.
    formacion_vsl_play: ['trackCustom', 'VSLPlay'],
    formacion_agenda_abierta: ['trackCustom', 'FormacionAgenda'],
    formacion_reserva: ['trackCustom', 'FormacionReserva'],
    // Landing de reformas v22 (22-oct): mismo criterio que formación.
    reformas_agenda_abierta: ['trackCustom', 'ReformasAgenda'],
    reformas_reserva: ['trackCustom', 'ReformasReserva'],
    home_vsl_play: ['trackCustom', 'VSLPlay'],
    home_agenda_abierta: ['trackCustom', 'HomeAgenda'],
    home_reserva: ['trackCustom', 'HomeReserva']
  };

  // Helper de eventos: siempre llamable. GA4 lo recibe siempre (sin cookies
  // si no hay consentimiento); Meta solo con consentimiento. Vercel Analytics (sin cookies) recibe siempre.
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
    if (valor === 'granted') conceder();
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
    if (previo === 'granted') { conceder(); return; }
    if (previo === 'denied') { return; }
    pintarBanner();
  }

  // Sin esperar al banner ni al DOM: los dos scripts arrancan sin cookies.
  cargarGA();
  cargarMeta();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
