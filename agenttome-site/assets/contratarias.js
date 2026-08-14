/* ¿Contratarías a esta persona? — agenttome.io. Envía la descripción del
   puesto a api/contratarias (que llama a Claude) y pinta el reparto
   humano / empleado IA, o el aviso de rechazo. */
(function () {
  'use strict';

  var form = document.getElementById('ct-form');
  var input = document.getElementById('ct-input');
  var hp = document.getElementById('ct-hp');
  var btn = document.getElementById('ct-submit');
  var err = document.getElementById('ct-error');
  var result = document.getElementById('ct-result');

  var esc = function (s) {
    return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
  };

  var renderReparto = function (d) {
    var pct = d.porcentajeIA;
    result.innerHTML =
      '<div class="ct-card">' +
        '<div class="ct-pct-wrap">' +
          '<div class="ct-pct">' + pct + '%</div>' +
          '<div class="ct-pct-label">del puesto podría hacerlo un empleado IA</div>' +
          '<div class="ct-split"><div class="ia" style="width:' + pct + '%"></div><div class="hum" style="width:' + (100 - pct) + '%"></div></div>' +
          '<div class="ct-legend"><span class="ia">● Empleado IA</span><span class="hum">● Humano</span></div>' +
        '</div>' +
        '<div class="ct-cols">' +
          '<div class="ct-col hum"><div class="ct-col-kick">Humano</div>' + d.humano.map(function (h) { return '<div class="ct-li">' + esc(h) + '</div>'; }).join('') + '</div>' +
          '<div class="ct-col ia"><div class="ct-col-kick">Empleado IA</div>' + d.empleadoIA.map(function (h) { return '<div class="ct-li">' + esc(h) + '</div>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="ct-bottom"><div class="ct-bottom-q">¿Quieres que este empleado IA exista de verdad?</div><a class="btn" href="/#analiza">Hablar con Agent to Me →</a></div>' +
      '</div>';
  };

  var renderRechazo = function (d) {
    result.innerHTML =
      '<div class="ct-reject">' +
        '<div class="ct-no-kick">SIN REPARTO</div>' +
        '<div class="ct-reject-h">' + esc(d.motivo) + '</div>' +
        '<div class="ct-reject-sub">' + esc(d.sugerencia) + '</div>' +
      '</div>';
  };

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var texto = input.value.trim();
    err.style.display = 'none';
    if (!texto) return;
    if (texto.length > 600) {
      err.textContent = 'Cuéntalo en menos de 600 caracteres.';
      err.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Calculando…';
    result.innerHTML = '';

    fetch('/api/contratarias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: texto, website: hp.value })
    })
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, body: d }; }); })
      .then(function (res) {
        if (res.status !== 200 || !res.body || res.body.ok === false) {
          throw new Error('server');
        }
        if (res.body.valido) renderReparto(res.body);
        else renderRechazo(res.body);
      })
      .catch(function () {
        err.textContent = 'Algo ha ido mal calculando el reparto. Prueba otra vez en un momento.';
        err.style.display = 'block';
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Calcular el reparto →';
      });
  });
})();
