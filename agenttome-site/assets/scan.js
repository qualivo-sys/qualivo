/* Company Scan — agenttome.io. Puntúa trabajo repetitivo por área y recomienda
   el empleado digital con más impacto. Resultado tras dejar email (api/scan). */
(function () {
  'use strict';

  // Cada ítem: texto, detalle, empleado al que apunta, horas/mes estimadas si "sí" (heurística conservadora)
  var ITEMS = [
    { t: 'Buscar empresas y contactos nuevos y escribir los primeros mensajes comerciales', d: 'listas, LinkedIn, primeros emails', e: 'sdr-digital', n: 'SDR Digital', h: 20 },
    { t: 'Actualizar el CRM a mano después de cada llamada, email o reunión', d: 'notas, etapas, campos que nadie rellena', e: 'sales-manager-digital', n: 'Sales Manager Digital', h: 12 },
    { t: 'Perseguir presupuestos enviados que nadie ha respondido', d: 'seguimientos que se olvidan', e: 'sales-manager-digital', n: 'Sales Manager Digital', h: 10 },
    { t: 'Responder las mismas preguntas de clientes por WhatsApp, email o chat', d: 'horarios, precios, estado del pedido…', e: 'support-digital', n: 'Support Digital', h: 25 },
    { t: 'Perseguir facturas impagadas y enviar recordatorios de cobro', d: 'impagos, vencimientos, recordatorios', e: 'collection-digital', n: 'Collection Digital', h: 8 },
    { t: 'Preparar informes de números copiando datos de banco, ERP o Excel', d: 'tesorería, desviaciones, cierres', e: 'cfo-digital', n: 'CFO Digital', h: 10 },
    { t: 'Sacar informes de marketing y revisar campañas a mano', d: 'Meta, Google, GA4, el informe del lunes', e: 'marketing-analyst', n: 'Marketing Analyst', h: 8 },
    { t: 'El contenido (posts, newsletter, blog) se queda sin hacer por falta de tiempo', d: 'la web y las redes paradas', e: 'content-creator', n: 'Content Creator', h: 15 },
    { t: 'El onboarding de cada cliente nuevo repite los mismos pasos, emails y documentos', d: 'altas, accesos, bienvenidas', e: 'customer-success-digital', n: 'Customer Success Digital', h: 10 },
    { t: 'Perseguir el estado de tareas y detectar retrasos en proyectos', d: '¿esto en qué punto está?', e: 'operations-digital', n: 'Operations Digital', h: 10 }
  ];
  var FICHAS = { 'sdr-digital': '/empleados/sdr-digital/' };

  var wrap = document.getElementById('scan-cards');
  var answers = new Array(ITEMS.length).fill(null); // 2 sí, 1 a veces, 0 no

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

  var computed = null;
  function compute() {
    var costeHora = Math.min(120, Math.max(10, Number(document.getElementById('coste-hora').value) || 25));
    var porEmpleado = {};
    var horas = 0;
    ITEMS.forEach(function (it, i) {
      var v = answers[i] || 0;
      var h = v === 2 ? it.h : v === 1 ? it.h * 0.35 : 0;
      horas += h;
      if (!porEmpleado[it.e]) porEmpleado[it.e] = { n: it.n, score: 0, h: 0 };
      porEmpleado[it.e].score += v;
      porEmpleado[it.e].h += h;
    });
    var rank = Object.keys(porEmpleado).map(function (k) {
      return { slug: k, n: porEmpleado[k].n, score: porEmpleado[k].score, h: porEmpleado[k].h };
    }).sort(function (a, b) { return b.score - a.score || b.h - a.h; });
    return {
      rank: rank,
      top: rank[0],
      horasMes: Math.round(horas),
      eurosMes: Math.round(horas * costeHora),
      costeHora: costeHora
    };
  }

  document.getElementById('scan-done').addEventListener('click', function (ev) {
    ev.preventDefault();
    var contestadas = answers.filter(function (a) { return a !== null; }).length;
    if (contestadas < 5) {
      alert('Responde al menos 5 para que el resultado tenga sentido (llevas ' + contestadas + ').');
      return;
    }
    computed = compute();
    if (!computed.top || computed.top.score === 0) {
      alert('Has marcado todo «No» — o tu empresa es un reloj, o hay trabajo invisible. Marca «A veces» donde dudes.');
      return;
    }
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

    var detalle = ITEMS.map(function (it, i) {
      var v = answers[i];
      return it.n + ' — ' + it.t.slice(0, 60) + ': ' + (v === 2 ? 'SÍ' : v === 1 ? 'a veces' : v === 0 ? 'no' : '—');
    });

    fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre, empresa: empresa, email: email,
        recomendado: computed.top.slug,
        horas_mes: computed.horasMes,
        euros_mes: computed.eurosMes,
        detalle: detalle,
        website2: document.getElementById('g-hp').value
      })
    }).then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) {
        if (!j.ok) throw new Error('bad');
        showResult(nombre);
        if (window.va) window.va('event', { name: 'atm_scan', data: { empleado: computed.top.slug } });
      })
      .catch(function () {
        btn.textContent = 'Ver mi resultado';
        btn.disabled = false;
        msg.style.display = 'block';
        msg.textContent = 'No se pudo enviar — inténtalo de nuevo.';
      });
  });

  function showResult(nombre) {
    var c = computed;
    var anual = c.eurosMes * 12;
    var main = document.getElementById('res-main');
    var ficha = FICHAS[c.top.slug];
    main.innerHTML =
      '<p class="eyebrow" style="margin:0">Tu resultado, ' + esc(nombre.split(' ')[0]) + '</p>' +
      '<p class="res-emp">' + esc(c.top.n) + '</p>' +
      '<p style="margin:0 0 14px">Es el puesto digital con más impacto en tu empresa según lo que has marcado.</p>' +
      '<p style="margin:0"><strong>~' + c.horasMes + ' horas/mes</strong> de trabajo repetitivo detectado en total ≈ <strong>' + fmt(c.eurosMes) + ' €/mes</strong> (' + fmt(anual) + ' €/año) a ' + c.costeHora + ' €/hora.</p>' +
      (ficha ? '<p style="margin:14px 0 0"><a href="' + ficha + '"><strong>Ver la ficha de contratación del ' + esc(c.top.n) + ' →</strong></a></p>' : '');
    var sec = c.rank.filter(function (r) { return r.score > 0 && r.slug !== c.top.slug; }).slice(0, 2);
    if (sec.length) {
      document.getElementById('res-secundario').innerHTML =
        '<div class="box"><p style="margin:0"><strong>También hay señal en:</strong> ' +
        sec.map(function (r) { return esc(r.n); }).join(' · ') +
        '.<br><small style="color:var(--gray)">La incorporación empieza siempre por UN empleado — el de más impacto. Los demás, cuando el primero esté rindiendo.</small></p></div>';
    }
    document.getElementById('scan-gate').style.display = 'none';
    document.getElementById('scan-result').style.display = 'block';
    document.getElementById('scan-result').scrollIntoView({ behavior: 'smooth' });
  }

  function esc(s) { return String(s).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
})();
