/* ¿Contratarías a esta persona? — agentforme.io. Envía la descripción del
   puesto a api/contratarias (que llama a Claude) y pinta el reparto
   humano / empleado IA, o el aviso de rechazo. Si es válido, registra el
   lead (nombre/empresa/email + lo que ha respondido) en api/atm-lead. */
(function () {
  'use strict';

  var form = document.getElementById('ct-form');
  var input = document.getElementById('ct-input');
  var nombreEl = document.getElementById('ct-nombre');
  var empresaEl = document.getElementById('ct-empresa');
  var emailEl = document.getElementById('ct-email');
  var hp = document.getElementById('ct-hp');
  var btn = document.getElementById('ct-submit');
  var err = document.getElementById('ct-error');
  var result = document.getElementById('ct-result');
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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
        '<div class="ct-note"><b>Cómo hemos hecho el reparto:</b> separamos lo que sigue reglas claras y no necesita trato personal (empleado IA) de lo que requiere negociar, decidir o la relación con el cliente (humano). El ' + pct + '% es una estimación de carga de trabajo a partir de lo que has descrito, no de importancia — una tarea humana puede pesar poco en horas y ser la que de verdad cierra el trato.</div>' +
        '<div class="ct-bottom"><div class="ct-bottom-q">¿Quieres que este empleado IA exista de verdad?</div><a class="btn" href="/#analiza">Hablar con Agent for Me →</a></div>' +
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

  var resumenReparto = function (d) {
    return d.porcentajeIA + '% empleado IA\nHumano:\n' + d.humano.map(function (h) { return '- ' + h; }).join('\n') +
      '\nEmpleado IA:\n' + d.empleadoIA.map(function (h) { return '- ' + h; }).join('\n');
  };

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var texto = input.value.trim();
    var nombre = nombreEl.value.trim();
    var empresa = empresaEl.value.trim();
    var email = emailEl.value.trim();
    err.style.display = 'none';
    if (!texto) return;
    if (texto.length > 600) {
      err.textContent = 'Cuéntalo en menos de 600 caracteres.';
      err.style.display = 'block';
      return;
    }
    if (!nombre || !empresa || !EMAIL_RE.test(email)) {
      err.textContent = 'Necesitamos nombre, empresa y un email válido.';
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
        if (!res.body.valido) {
          renderRechazo(res.body);
          return;
        }
        return fetch('/api/atm-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre, empresa: empresa, email: email,
            fuente: 'contratarias', input: texto, resumen: resumenReparto(res.body),
            website: hp.value
          })
        }).catch(function (e) { console.error('[contratarias] atm-lead falló:', e); })
          .then(function () { renderReparto(res.body); });
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
