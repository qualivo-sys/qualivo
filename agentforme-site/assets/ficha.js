/* Convierte una tarea en un puesto — agentforme.io. Envía la tarea en texto
   libre a api/ficha (que llama a Claude) y pinta la ficha o el aviso de
   rechazo. Si la ficha es válida, registra el lead (nombre/empresa/email +
   lo que ha respondido) en api/afm-lead (GHL) — es un generador de leads,
   no solo una demo. */
(function () {
  'use strict';

  var form = document.getElementById('ficha-form');
  var input = document.getElementById('ficha-input');
  var nombreEl = document.getElementById('ficha-nombre');
  var empresaEl = document.getElementById('ficha-empresa');
  var emailEl = document.getElementById('ficha-email');
  var hp = document.getElementById('ficha-hp');
  var btn = document.getElementById('ficha-submit');
  var err = document.getElementById('ficha-error');
  var result = document.getElementById('ficha-result');
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  var esc = function (s) {
    return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
  };

  var renderFicha = function (d) {
    result.innerHTML =
      '<div class="fc-head">' +
        '<div><div class="fc-kick">LA FICHA</div><div class="fc-puesto">' + esc(d.puesto) + '</div></div>' +
        '<div class="fc-sello">CUBIERTO</div>' +
      '</div>' +
      '<div class="fc-rows">' +
        '<div class="fc-row"><span class="k">JORNADA</span><span class="v">Completa. Sin festivos.</span></div>' +
        '<div class="fc-row"><span class="k">ALTA</span><span class="v">2 semanas</span></div>' +
        '<div class="fc-row"><span class="k">TE REPORTA</span><span class="v">Cada lunes</span></div>' +
      '</div>' +
      '<div class="fc-sec">' +
        '<div class="fc-sec-kick">QUÉ HACE</div>' +
        d.hace.map(function (h) { return '<div class="fc-li">' + esc(h) + '</div>'; }).join('') +
      '</div>' +
      '<div class="fc-no">' +
        '<div class="fc-no-kick">LO QUE NO HACE</div>' +
        '<div class="fc-no-text">' + esc(d.noHace) + '</div>' +
      '</div>' +
      '<div class="fc-horas">' +
        '<div class="fc-horas-n">' + esc(d.horas) + '</div>' +
        '<div class="fc-horas-l">estimado, a partir de lo que cuentas. Se afina la primera semana trabajando contigo.</div>' +
      '</div>' +
      '<div class="fc-bottom">' +
        '<div class="fc-bottom-q">¿Quieres que este puesto exista de verdad?</div>' +
        '<a class="btn" href="/#analiza">Hablar con Agent for Me →</a>' +
      '</div>';
    result.className = 'fc';
  };

  var renderRechazo = function (d) {
    result.innerHTML =
      '<div class="fc-reject">' +
        '<div class="fc-no-kick">SIN FICHA</div>' +
        '<div class="fc-reject-h">' + esc(d.motivo) + '</div>' +
        '<div class="fc-reject-sub">' + esc(d.sugerencia) + '</div>' +
      '</div>';
    result.className = 'fc';
  };

  var resumenFicha = function (d) {
    return d.puesto + '\n' + d.hace.map(function (h) { return '- ' + h; }).join('\n') + '\nNo hace: ' + d.noHace + '\n' + d.horas;
  };

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var texto = input.value.trim();
    var nombre = nombreEl.value.trim();
    var empresa = empresaEl.value.trim();
    var email = emailEl.value.trim();
    err.style.display = 'none';
    if (!texto) return;
    if (texto.length > 500) {
      err.textContent = 'Cuéntalo en menos de 500 caracteres.';
      err.style.display = 'block';
      return;
    }
    if (!nombre || !empresa || !EMAIL_RE.test(email)) {
      err.textContent = 'Necesitamos nombre, empresa y un email válido.';
      err.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Pensando…';
    result.className = '';
    result.innerHTML = '';

    fetch('/api/ficha', {
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
        return fetch('/api/afm-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre, empresa: empresa, email: email,
            fuente: 'convierte-una-tarea', input: texto, resumen: resumenFicha(res.body),
            website: hp.value
          })
        }).catch(function (e) { console.error('[ficha] afm-lead falló:', e); })
          .then(function () { renderFicha(res.body); });
      })
      .catch(function () {
        err.textContent = 'Algo ha ido mal generando la ficha. Prueba otra vez en un momento.';
        err.style.display = 'block';
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Convertir en puesto →';
      });
  });
})();
