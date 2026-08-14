/* Calculadora de Fugas — qualivo.io/calculadora-de-fugas
   Solo matemática, sin backend: leads/mes x %cierre x ticket x 12, comparado
   con el mismo cálculo a la tasa de cierre "razonable" del sector. */
(function () {
  'use strict';

  var fmt = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
  var eur = function (n) { return fmt.format(Math.round(n)) + ' €'; };

  var leadsEl = document.getElementById('cf-leads');
  var cierreEl = document.getElementById('cf-cierre');
  var ticketEl = document.getElementById('cf-ticket');
  var refEl = document.getElementById('cf-referencia');
  var out = document.getElementById('cf-result');
  var tracked = false;

  function calcular() {
    var leads = Math.max(0, Number(leadsEl.value) || 0);
    var cierre = Math.min(100, Math.max(0, Number(cierreEl.value) || 0));
    var ticket = Math.max(0, Number(ticketEl.value) || 0);
    var ref = Math.min(100, Math.max(0, Number(refEl.value) || 0));

    var hoyAnual = leads * (cierre / 100) * ticket * 12;
    var potencialAnual = leads * (ref / 100) * ticket * 12;
    var fuga = Math.max(0, potencialAnual - hoyAnual);

    if (!leads || !ticket) {
      out.innerHTML = '<p class="cf-empty">Rellena los 4 datos para ver tu resultado.</p>';
      return;
    }

    var maxAnual = Math.max(hoyAnual, potencialAnual, 1);

    out.innerHTML =
      '<div class="cf-fuga-num">' + eur(fuga) + '</div>' +
      '<div class="cf-fuga-label">es lo que estás dejando sobre la mesa cada año, solo en esta fuga.</div>' +
      '<div class="cf-crow"><span class="n">Hoy · ' + cierre + '% de cierre</span><span class="v">' + eur(hoyAnual) + '/año</span></div>' +
      '<div class="cf-track"><div class="cf-bar now" style="width:' + Math.max(4, hoyAnual / maxAnual * 100) + '%"></div></div>' +
      '<div class="cf-crow"><span class="n">Con un ' + ref + '% de cierre</span><span class="v">' + eur(potencialAnual) + '/año</span></div>' +
      '<div class="cf-track"><div class="cf-bar pot" style="width:' + Math.max(4, potencialAnual / maxAnual * 100) + '%"></div></div>' +
      '<div class="cf-note"><b>Cómo lo hemos calculado:</b> ' + leads + ' leads × tu % de cierre × tu ticket medio × 12 meses, comparado con el mismo cálculo al ' + ref + '% de cierre. Si tu ticket medio o tu volumen varían mucho al mes, corrige los datos y el número se ajusta.</div>' +
      '<div class="cf-cta"><p>¿Quieres saber exactamente dónde se pierde y qué solucionar primero?</p><a href="/#contacto">Solicitar Qualivo Diagnostic →</a></div>';

    if (!tracked && fuga > 0) {
      tracked = true;
      if (window.va) window.va('event', { name: 'calculadora_fugas_calculada' });
      if (window.qvTrack) window.qvTrack('calculadora_fugas_calculada', {});
    }
  }

  [leadsEl, cierreEl, ticketEl, refEl].forEach(function (el) {
    el.addEventListener('input', calcular);
  });
  calcular();
})();
