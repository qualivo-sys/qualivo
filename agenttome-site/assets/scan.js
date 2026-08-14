/* Company Scan v2 — agenttome.io. Recoge tamaño, áreas, tareas repetitivas
   (con frecuencia), cómo se hacen y quién las hace. Llama a api/scan-v2
   (Claude) para puntuar y proponer hasta 4 empleados IA candidatos, y a
   api/scan (GHL) para registrar el lead con el candidato principal. */
(function () {
  'use strict';

  var ITEMS = [
    { t: 'Buscar empresas y contactos nuevos y escribir los primeros mensajes comerciales', d: 'listas, LinkedIn, primeros emails' },
    { t: 'Actualizar el CRM a mano después de cada llamada, email o reunión', d: 'notas, etapas, campos que nadie rellena' },
    { t: 'Perseguir presupuestos enviados que nadie ha respondido', d: 'seguimientos que se olvidan' },
    { t: 'Responder las mismas preguntas de clientes por WhatsApp, email o chat', d: 'horarios, precios, estado del pedido…' },
    { t: 'Perseguir facturas impagadas y enviar recordatorios de cobro', d: 'impagos, vencimientos, recordatorios' },
    { t: 'Preparar informes de números copiando datos de banco, ERP o Excel', d: 'tesorería, desviaciones, cierres' },
    { t: 'Sacar informes de marketing y revisar campañas a mano', d: 'Meta, Google, GA4, el informe del lunes' },
    { t: 'El contenido (posts, newsletter, blog) se queda sin hacer por falta de tiempo', d: 'la web y las redes paradas' },
    { t: 'El onboarding de cada cliente nuevo repite los mismos pasos, emails y documentos', d: 'altas, accesos, bienvenidas' },
    { t: 'Perseguir el estado de tareas y detectar retrasos en proyectos', d: '¿esto en qué punto está?' }
  ];

  var TAMANOS = ['1–5', '6–10', '11–25', '26–50', '+50'];
  var AREAS = ['Comercial', 'Administración', 'Marketing', 'Atención al cliente', 'Operaciones', 'Finanzas', 'Recursos humanos', 'Otra'];
  var COMO = ['Manualmente', 'Excel / Sheets', 'Email', 'WhatsApp', 'CRM', 'Varias herramientas', 'Automatización parcial', 'No lo sé'];
  var QUIEN = ['Administrativo', 'Comercial', 'Marketing', 'Operaciones', 'CEO / fundador', 'Varias personas'];

  var wrap = document.getElementById('scan-cards');
  var answers = new Array(ITEMS.length).fill(null); // 2 sí, 1 a veces, 0 no
  var tamano = null, areas = [], como = null, quien = null;

  function chipGroup(containerId, opciones, multi, onChange) {
    var el = document.getElementById(containerId);
    var seleccion = multi ? [] : null;
    opciones.forEach(function (op) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = op;
      chip.addEventListener('click', function () {
        if (multi) {
          var i = seleccion.indexOf(op);
          if (i > -1) { seleccion.splice(i, 1); chip.classList.remove('sel'); }
          else { seleccion.push(op); chip.classList.add('sel'); }
        } else {
          seleccion = op;
          Array.prototype.forEach.call(el.children, function (c) { c.classList.remove('sel'); });
          chip.classList.add('sel');
        }
        onChange(seleccion);
      });
      el.appendChild(chip);
    });
  }

  chipGroup('sc-tamano', TAMANOS, false, function (v) { tamano = v; });
  chipGroup('sc-areas', AREAS, true, function (v) { areas = v; });
  chipGroup('sc-como', COMO, false, function (v) { como = v; });
  chipGroup('sc-quien', QUIEN, false, function (v) { quien = v; });

  ITEMS.forEach(function (it, i) {
    var card = document.createElement('div');
    card.className = 'scan-card';
    card.innerHTML = '<p>' + it.t + '<small>' + it.d + '</small></p>' +
      '<span class="scan-opts">' +
      '<button class="b-si">Sí, constantemente</button>' +
      '<button class="b-av">A veces</button>' +
      '<button class="b-no">No</button></span>';
    var setState = function (v, cls) {
      answers[i] = v;
      card.classList.remove('si', 'av', 'no');
      card.classList.add(cls);
    };
    card.querySelector('.b-si').addEventListener('click', function () { setState(2, 'si'); });
    card.querySelector('.b-av').addEventListener('click', function () { setState(1, 'av'); });
    card.querySelector('.b-no').addEventListener('click', function () { setState(0, 'no'); });
    wrap.appendChild(card);
  });

  var scanResult = null; // respuesta de api/scan-v2
  var costeHora = 25, horasMesCalc = 0;

  document.getElementById('scan-done').addEventListener('click', function (ev) {
    ev.preventDefault();
    var contestadas = answers.filter(function (a) { return a !== null; }).length;
    if (contestadas < 5) {
      alert('Responde al menos 5 para que el resultado tenga sentido (llevas ' + contestadas + ').');
      return;
    }
    if (!tamano) { alert('Dinos cuántas personas sois.'); return; }
    document.getElementById('scan-quiz').style.display = 'none';
    document.getElementById('scan-gate').style.display = 'block';
    document.getElementById('scan-gate').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('scan-send').addEventListener('click', function () {
    var nombre = document.getElementById('g-nombre').value.trim();
    var empresa = document.getElementById('g-empresa').value.trim();
    var email = document.getElementById('g-email').value.trim();
    var msg = document.getElementById('gate-msg');
    if (!nombre || !empresa || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.style.display = 'block';
      msg.textContent = 'Necesitamos nombre, empresa y un email válido.';
      return;
    }
    msg.style.display = 'none';
    var btn = this;
    btn.textContent = 'Un momento…';
    btn.disabled = true;

    costeHora = Math.min(120, Math.max(10, Number(document.getElementById('coste-hora').value) || 25));

    var tareas = ITEMS.map(function (it, i) {
      var v = answers[i];
      var frecuencia = v === 2 ? 'constantemente' : v === 1 ? 'a veces' : v === 0 ? 'no ocurre' : 'sin responder';
      return { texto: it.t, frecuencia: frecuencia };
    }).filter(function (t) { return t.frecuencia !== 'sin responder' && t.frecuencia !== 'no ocurre'; });

    document.getElementById('scan-gate').style.display = 'none';
    document.getElementById('scan-loading').style.display = 'block';

    fetch('/api/scan-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tamano: tamano, areas: areas, tareas: tareas, comoSeHace: como, quienLoHace: quien,
        website: document.getElementById('g-hp').value
      })
    }).then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) {
        if (!j.ok) throw new Error('scan-v2 failed');
        scanResult = j;
        horasMesCalc = Math.round(((j.principal.horasMin + j.principal.horasMax) / 2) * 4.33);

        var detalle = ITEMS.map(function (it, i) {
          var v = answers[i];
          return it.t.slice(0, 60) + ': ' + (v === 2 ? 'SÍ' : v === 1 ? 'a veces' : v === 0 ? 'no' : '—');
        });

        return fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre, empresa: empresa, email: email,
            recomendado: j.principal.rolId,
            horas_mes: horasMesCalc,
            euros_mes: Math.round(horasMesCalc * costeHora),
            detalle: detalle,
            website2: document.getElementById('g-hp').value
          })
        });
      })
      .then(function (r) { return r && r.json ? r.json().catch(function () { return {}; }) : {}; })
      .then(function () {
        showResult(nombre);
        if (window.va) window.va('event', { name: 'atm_scan_v2', data: { empleado: scanResult.principal.rolId } });
      })
      .catch(function () {
        document.getElementById('scan-loading').style.display = 'none';
        document.getElementById('scan-gate').style.display = 'block';
        btn.textContent = 'Ver mi resultado';
        btn.disabled = false;
        msg.style.display = 'block';
        msg.textContent = 'No se pudo generar tu resultado — inténtalo de nuevo.';
      });
  });

  function showResult(nombre) {
    var r = scanResult, p = r.principal;
    var eurosMes = Math.round(horasMesCalc * costeHora);
    var anual = eurosMes * 12;

    document.getElementById('res-score').innerHTML =
      '<p class="eyebrow" style="margin:0">Tu resultado, ' + esc(nombre.split(' ')[0]) + '</p>' +
      '<p class="res-emp">' + r.puntuacion + '/100</p>' +
      '<p style="margin:0">Puntuación de Empleado IA — cuánto potencial tiene tu empresa para incorporar empleados digitales, según lo que has marcado.</p>';

    document.getElementById('res-ficha').innerHTML =
      '<div class="sc-card">' +
        '<div class="sc-head"><div><div class="sc-kick">CANDIDATO PRINCIPAL</div><div class="sc-puesto">' + esc(p.nombreRol) + '</div></div><div class="sc-sello">CUBIERTO</div></div>' +
        '<div class="sc-sec"><div class="sc-sec-kick">QUÉ HACE</div>' + p.hace.map(function (h) { return '<div class="sc-li">' + esc(h) + '</div>'; }).join('') + '</div>' +
        '<div class="sc-no"><div class="sc-no-kick">LO QUE NO HACE</div><div class="sc-no-text">' + esc(p.noHace) + '</div></div>' +
        '<div class="sc-horas"><div class="sc-horas-n">' + p.horasMin + '–' + p.horasMax + ' h/semana</div><div class="sc-horas-l">≈ ' + fmt(eurosMes) + ' €/mes · ' + fmt(anual) + ' €/año a ' + costeHora + ' €/h</div></div>' +
      '</div>';

    var otros = r.candidatos.slice(1);
    if (otros.length) {
      document.getElementById('res-otros').innerHTML =
        '<div class="box"><p style="margin:0 0 10px"><strong>También hay señal en:</strong></p>' +
        otros.map(function (c) {
          return '<div class="sc-otro-row"><span class="sc-otro-n">' + esc(c.nombre) + '</span><span class="sc-otro-p">' + c.potencial + '/100</span></div>';
        }).join('') +
        '<p style="margin:14px 0 0"><small style="color:var(--gray)">La incorporación empieza siempre por UN empleado — el de más impacto. Los demás, cuando el primero esté rindiendo.</small></p></div>';
    }

    document.getElementById('scan-loading').style.display = 'none';
    document.getElementById('scan-result').style.display = 'block';
    document.getElementById('scan-result').scrollIntoView({ behavior: 'smooth' });
  }

  function esc(s) { return String(s).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
})();
