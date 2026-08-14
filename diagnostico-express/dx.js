/* Auto-diagnóstico express v2 — qualivo.io/diagnostico-express
   5 bloques (Captación · Conversión · Cualificación · Venta · Medición),
   preguntas de contexto (no puntúan) + preguntas de score (0/5/10 → /10 por bloque),
   Nivel de Control (0-100, sale del bloque Medición) y resumen "qué hemos detectado". */
(function () {
  'use strict';

  var BLOQUES = [
    { id: 'captacion', nombre: 'Captación' },
    { id: 'conversion', nombre: 'Conversión' },
    { id: 'cualificacion', nombre: 'Cualificación' },
    { id: 'venta', nombre: 'Venta' },
    { id: 'medicion', nombre: 'Medición' }
  ];

  // type: 'check' (contexto, multi-select, no puntúa) · 'score' (single-select, puntúa 0/5/10)
  var PREGUNTAS = [
    { bloque: 0, type: 'check', texto: '¿De dónde vienen actualmente tus clientes?', multi: true,
      opciones: ['Meta Ads', 'Google Ads', 'SEO', 'Contenido', 'Outbound', 'Referidos', 'Partners', 'Eventos', 'Otros'] },
    { bloque: 0, type: 'score', texto: '¿Sabes qué canal genera realmente más clientes?',
      opciones: [['Sí, lo tenemos medido', 10], ['Tenemos una aproximación', 5], ['No', 0]] },

    { bloque: 1, type: 'check', texto: 'Cuando alguien llega a ti, ¿dónde termina normalmente?', multi: false,
      opciones: ['Landing', 'Formulario', 'WhatsApp', 'Llamada', 'Calendario', 'Tienda', 'Otro'] },
    { bloque: 1, type: 'score', texto: '¿Sabes qué porcentaje de las personas que llegan termina dejando sus datos o comprando?',
      opciones: [['Sí', 10], ['Aproximadamente', 5], ['No', 0]] },

    { bloque: 2, type: 'check', texto: 'Cuando entra un lead, ¿cómo decidís si merece la pena atenderlo?', multi: false,
      opciones: ['Automáticamente', 'Lo decide una persona', 'Lo decide el comercial', 'No tenemos un criterio claro'] },
    { bloque: 2, type: 'score', texto: '¿Los comerciales reciben información suficiente sobre el lead antes de contactar?',
      opciones: [['Sí', 10], ['A veces', 5], ['No', 0]] },

    { bloque: 3, type: 'check', texto: '¿Quién se encarga de convertir el lead en cliente?', multi: false,
      opciones: ['Comercial', 'CEO / fundador', 'Marketing', 'Varias personas', 'No tenemos un proceso definido'] },
    { bloque: 3, type: 'check', texto: '¿Qué ocurre después del primer contacto?', multi: false,
      opciones: ['Tenemos un proceso definido', 'Cada comercial lo hace a su manera', 'Hay automatizaciones', 'Seguimos manualmente', 'No tenemos claro el proceso'] },
    { bloque: 3, type: 'score', texto: '¿Qué ocurre con los leads que no compran?',
      opciones: [['Tenemos follow-up automático', 10], ['Los comerciales hacen seguimiento', 7], ['Volvemos a contactar de vez en cuando', 4], ['Normalmente se pierden', 0], ['No lo sé', 0]] },

    { bloque: 4, type: 'score', texto: 'Si mañana te preguntara cuánto te cuesta conseguir un cliente, ¿lo sabrías?',
      opciones: [['Sí', 10], ['Aproximadamente', 5], ['No', 0]] },
    { bloque: 4, type: 'score', texto: '¿Puedes conectar inversión → lead → venta → ingresos?',
      opciones: [['Sí', 10], ['Parcialmente', 5], ['No', 0]] },
    { bloque: 4, type: 'score', texto: 'Si mañana tuvieras un 30% más de presupuesto, ¿sabrías dónde invertirlo?',
      opciones: [['Sí', 10], ['Probablemente', 5], ['No', 0]] }
  ];

  var VEREDICTOS = {
    captacion: 'Tu punto más débil está en captación: estás invirtiendo sin saber qué te devuelve cada canal. El riesgo no es gastar mucho — es no poder decidir dónde meter el siguiente euro.',
    conversion: 'Tu punto más débil está en conversión: te llega tráfico e interés, pero no sabes dónde se cae la gente. Cada mejora aquí multiplica todo lo que ya inviertes en captación.',
    cualificacion: 'Tu punto más débil está en cualificación: sin criterios claros de qué lead vale la pena, ventas pierde tiempo con quien no va a comprar. Es la fuga más silenciosa — y de las más caras.',
    venta: 'Tu punto más débil está en venta: los leads llegan, pero el seguimiento y el proceso comercial dejan dinero en la mesa. Es la etapa donde los cambios se notan más rápido en la facturación.',
    medicion: 'Tu punto más débil está en medición: tienes un sistema funcionando, pero no puedes ver con claridad qué parte está generando negocio de verdad. Sin eso, cada decisión de invertir más es una apuesta.'
  };

  var intro = document.getElementById('dx-intro');
  var quiz = document.getElementById('dx-quiz');
  var gate = document.getElementById('dx-gate');
  var result = document.getElementById('dx-result');
  var errorEl = document.getElementById('dx-error');
  var submitBtn = document.getElementById('dx-submit');

  var actual = 0;
  var respuestas = new Array(PREGUNTAS.length).fill(null); // score: number · check single: string · check multi: array
  var loadedAt = Date.now();

  function show(section) {
    [intro, quiz, gate, result].forEach(function (s) { s.hidden = s !== section; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function siguiente() {
    if (actual < PREGUNTAS.length - 1) { actual++; pintarPregunta(); }
    else { show(gate); }
  }

  function pintarPregunta() {
    var p = PREGUNTAS[actual];
    document.getElementById('dx-stage-label').textContent =
      'Bloque ' + (p.bloque + 1) + ' de 5 · ' + BLOQUES[p.bloque].nombre;
    document.getElementById('dx-count').textContent = 'Pregunta ' + (actual + 1) + ' de ' + PREGUNTAS.length;
    document.getElementById('dx-progress').style.width = (actual / PREGUNTAS.length * 100) + '%';
    document.getElementById('dx-question').textContent = p.texto;
    document.getElementById('dx-prev').hidden = actual === 0;

    var wrap = document.getElementById('dx-options');
    wrap.innerHTML = '';

    if (p.type === 'score') {
      p.opciones.forEach(function (op) {
        var btn = document.createElement('button');
        btn.className = 'dx-answer';
        btn.textContent = op[0];
        btn.addEventListener('click', function () { respuestas[actual] = op[1]; siguiente(); });
        wrap.appendChild(btn);
      });
    } else if (p.multi) {
      var seleccion = Array.isArray(respuestas[actual]) ? respuestas[actual].slice() : [];
      p.opciones.forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dx-answer dx-check' + (seleccion.indexOf(op) > -1 ? ' sel' : '');
        btn.textContent = op;
        btn.addEventListener('click', function () {
          var i = seleccion.indexOf(op);
          if (i > -1) seleccion.splice(i, 1); else seleccion.push(op);
          respuestas[actual] = seleccion;
          pintarPregunta();
        });
        wrap.appendChild(btn);
      });
      var cont = document.createElement('button');
      cont.className = 'dx-answer dx-continue';
      cont.textContent = seleccion.length ? 'Continuar →' : 'Ninguna de estas / seguir →';
      cont.addEventListener('click', function () { if (!Array.isArray(respuestas[actual])) respuestas[actual] = []; siguiente(); });
      wrap.appendChild(cont);
    } else {
      p.opciones.forEach(function (op) {
        var btn = document.createElement('button');
        btn.className = 'dx-answer';
        btn.textContent = op;
        btn.addEventListener('click', function () { respuestas[actual] = op; siguiente(); });
        wrap.appendChild(btn);
      });
    }
  }

  function scoresPorBloque() {
    var suma = [0, 0, 0, 0, 0], n = [0, 0, 0, 0, 0];
    PREGUNTAS.forEach(function (p, i) {
      if (p.type !== 'score') return;
      suma[p.bloque] += (respuestas[i] || 0);
      n[p.bloque]++;
    });
    return BLOQUES.map(function (b, i) { return n[i] ? Math.round(suma[i] / n[i]) : 0; });
  }

  function nivelDeControl(porBloque) {
    // Sale directo del bloque Medición (índice 4): ya está en /10, se escala a /100.
    return porBloque[4] * 10;
  }

  function tier(score10) {
    if (score10 >= 8) return { icon: '🟢', label: 'bien' };
    if (score10 >= 6) return { icon: '🟡', label: 'con margen' };
    if (score10 >= 4) return { icon: '🟠', label: 'a revisar' };
    return { icon: '🔴', label: 'fuga probable' };
  }

  function bloqueDebil(porBloque) {
    var min = Math.min.apply(null, porBloque);
    return { bloque: BLOQUES[porBloque.indexOf(min)], idx: porBloque.indexOf(min) };
  }

  document.getElementById('dx-start').addEventListener('click', function () {
    show(quiz);
    pintarPregunta();
  });

  document.getElementById('dx-prev').addEventListener('click', function () {
    if (actual > 0) { actual--; pintarPregunta(); }
  });

  function pintarResultado(porBloque) {
    var debil = bloqueDebil(porBloque);
    var nivel = nivelDeControl(porBloque);

    document.getElementById('dx-result-title').textContent =
      'Tu fuga principal está en ' + debil.bloque.nombre.toLowerCase() + '.';

    var bars = document.getElementById('dx-bars');
    bars.innerHTML = '';
    BLOQUES.forEach(function (b, i) {
      var t = tier(porBloque[i]);
      var esDebil = i === debil.idx;
      var row = document.createElement('div');
      row.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px">' +
        '<span style="font-family:var(--qv-font-display); font-weight:800; font-size:15px; color:' + (esDebil ? '#E8590C' : '#101319') + '">' +
        t.icon + ' ' + b.nombre + (esDebil ? ' · aquí se te escapa' : '') + '</span>' +
        '<span style="font-size:13px; color:#7A7C82; font-weight:600">' + porBloque[i] + '/10</span></div>' +
        '<div class="dx-bar-track"><div class="dx-bar' + (esDebil ? ' debil' : '') + '" style="width:' + Math.max(porBloque[i] * 10, 4) + '%"></div></div>';
      bars.appendChild(row);
    });

    document.getElementById('dx-nivel-num').textContent = nivel + '/100';
    document.getElementById('dx-nivel-texto').textContent =
      nivel >= 70
        ? 'Tienes buena visibilidad de qué parte de tu sistema genera negocio de verdad.'
        : 'Tienes un sistema de captación funcionando, pero todavía no tienes suficiente visibilidad para saber qué partes están generando negocio de verdad.';

    // "Qué hemos detectado": el bloque débil + los 2 siguientes peor puntuados.
    var orden = porBloque.map(function (s, i) { return { i: i, s: s }; })
      .sort(function (a, b) { return a.s - b.s; }).slice(0, 3);
    var detect = document.getElementById('dx-detectado');
    detect.innerHTML = '';
    orden.forEach(function (o) {
      var t = tier(o.s);
      var li = document.createElement('li');
      li.textContent = t.icon + ' ' + BLOQUES[o.i].nombre;
      detect.appendChild(li);
    });

    document.getElementById('dx-verdict').innerHTML =
      '<p style="margin:0; font-size:16.5px; line-height:1.65; color:#101319">' + VEREDICTOS[debil.bloque.id] + '</p>';
  }

  document.getElementById('dx-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = document.getElementById('dx-nombre').value.trim();
    var email = document.getElementById('dx-email').value.trim();
    var rgpd = document.getElementById('dx-rgpd').checked;
    var honeypot = document.getElementById('dx-website').value;

    var porBloque = scoresPorBloque();

    if (honeypot || Date.now() - loadedAt < 5000) {
      pintarResultado(porBloque);
      show(result);
      return;
    }
    function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }
    errorEl.hidden = true;
    if (!nombre) return showError('Dinos tu nombre.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showError('Revisa el email.');
    if (!rgpd) return showError('Necesitamos tu consentimiento para tratar los datos.');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Un segundo…';

    var debil = bloqueDebil(porBloque);
    var contexto = PREGUNTAS
      .map(function (p, i) {
        if (p.type === 'score') return null;
        var r = respuestas[i];
        var val = Array.isArray(r) ? (r.length ? r.join(', ') : '—') : (r || '—');
        return BLOQUES[p.bloque].nombre + ' — ' + p.texto + ': ' + val;
      })
      .filter(Boolean);

    fetch('/api/autodiagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        rgpd: true,
        scores: {
          captacion: porBloque[0], conversion: porBloque[1], cualificacion: porBloque[2],
          venta: porBloque[3], medicion: porBloque[4]
        },
        nivel_control: nivelDeControl(porBloque),
        etapa_debil: debil.bloque.nombre,
        contexto: contexto,
        origen: window.location.hostname || 'local'
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (window.va) window.va('event', { name: 'autodiagnostico_completado', data: { etapa_debil: debil.bloque.id } });
      if (window.qvTrack) window.qvTrack('autodiagnostico_completado', { etapa_debil: debil.bloque.id });
      pintarResultado(porBloque);
      show(result);
    }).catch(function (err) {
      console.error('[dx] Error guardando el resultado:', err);
      showError('No hemos podido guardar tu resultado. Inténtalo de nuevo en unos segundos.');
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Ver mi resultado →';
    });
  });
})();
