/* Auto-diagnóstico express — qualivo.io/diagnostico-express */
(function () {
  'use strict';

  var ETAPAS = [
    { id: 'captacion', nombre: 'Captación' },
    { id: 'conversion', nombre: 'Conversión' },
    { id: 'cualificacion', nombre: 'Cualificación' },
    { id: 'venta', nombre: 'Venta' },
    { id: 'retencion', nombre: 'Retención' }
  ];

  // 3 preguntas por etapa. Sí = 2 · No lo sé = 1 · No = 0 (máx. 6 por etapa)
  var PREGUNTAS = [
    { etapa: 0, texto: '¿Sabes cuánto te cuesta conseguir un cliente (no un lead) en cada canal?' },
    { etapa: 0, texto: '¿Podrías decir de qué canal salieron tus últimos 10 clientes?' },
    { etapa: 0, texto: 'Si mañana duplicaras la inversión en marketing, ¿sabrías dónde ponerla y qué esperar a cambio?' },
    { etapa: 1, texto: '¿Mides qué porcentaje de tus leads se convierte en oportunidad real de venta?' },
    { etapa: 1, texto: '¿Sabes en qué punto exacto (página, paso, formulario, llamada) pierdes a más gente?' },
    { etapa: 1, texto: '¿Has probado y medido algún cambio para mejorar la conversión en los últimos 3 meses?' },
    { etapa: 2, texto: '¿Tenéis criterios escritos de qué es un lead cualificado (y cuáles no valen la pena)?' },
    { etapa: 2, texto: '¿Tu CRM refleja fielmente en qué fase está cada oportunidad, sin “limpiezas” pendientes?' },
    { etapa: 2, texto: '¿Marketing y ventas están de acuerdo en qué leads hay que trabajar primero?' },
    { etapa: 3, texto: '¿Todos los leads reciben un primer contacto en menos de 24 horas?' },
    { etapa: 3, texto: '¿Conoces tu tasa de cierre por vendedor y por canal de origen?' },
    { etapa: 3, texto: '¿Existe un proceso de venta documentado que el equipo siga de verdad?' },
    { etapa: 4, texto: '¿Sabes cuánto vale un cliente a lo largo del tiempo (LTV), no solo la primera venta?' },
    { etapa: 4, texto: 'Cuando un cliente se va, ¿sabéis por qué y queda registrado?' },
    { etapa: 4, texto: '¿Tenéis acciones sistemáticas de recompra, renovación o referidos (no puntuales)?' }
  ];

  var VEREDICTOS = {
    captacion: 'Tu punto más débil está en captación: estás invirtiendo sin saber qué te devuelve cada canal. El riesgo no es gastar mucho — es no poder decidir dónde meter el siguiente euro. Antes de subir presupuesto o abrir canales nuevos, toca medir coste por cliente real canal a canal.',
    conversion: 'Tu punto más débil está en conversión: te llega tráfico e interés, pero no sabes dónde se cae la gente. Cada mejora aquí multiplica todo lo que ya inviertes en captación — suele ser la palanca más barata de todo el sistema.',
    cualificacion: 'Tu punto más débil está en cualificación: sin criterios claros de qué lead vale la pena, ventas pierde tiempo con quien no va a comprar y marketing celebra volumen que no se convierte en ingresos. Es la fuga más silenciosa — y de las más caras.',
    venta: 'Tu punto más débil está en venta: los leads llegan, pero el seguimiento y el proceso comercial dejan dinero en la mesa. La buena noticia: es la etapa donde los cambios se notan más rápido en la facturación.',
    retencion: 'Tu punto más débil está en retención: consigues clientes pero no estás capitalizando su valor a largo plazo. Cada cliente que se va sin saber por qué encarece todo tu sistema de captación — retener es el multiplicador de todo lo demás.'
  };

  var intro = document.getElementById('dx-intro');
  var quiz = document.getElementById('dx-quiz');
  var gate = document.getElementById('dx-gate');
  var result = document.getElementById('dx-result');
  var errorEl = document.getElementById('dx-error');
  var submitBtn = document.getElementById('dx-submit');

  var actual = 0;
  var respuestas = new Array(PREGUNTAS.length).fill(null);
  var loadedAt = Date.now();

  function show(section) {
    [intro, quiz, gate, result].forEach(function (s) { s.hidden = s !== section; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function pintarPregunta() {
    var p = PREGUNTAS[actual];
    document.getElementById('dx-stage-label').textContent =
      'Etapa ' + (p.etapa + 1) + ' de 5 · ' + ETAPAS[p.etapa].nombre;
    document.getElementById('dx-count').textContent = 'Pregunta ' + (actual + 1) + ' de ' + PREGUNTAS.length;
    document.getElementById('dx-progress').style.width = (actual / PREGUNTAS.length * 100) + '%';
    document.getElementById('dx-question').textContent = p.texto;
    document.getElementById('dx-prev').hidden = actual === 0;
  }

  function scores() {
    var porEtapa = [0, 0, 0, 0, 0];
    PREGUNTAS.forEach(function (p, i) { porEtapa[p.etapa] += respuestas[i] || 0; });
    return porEtapa;
  }

  function etapaDebil(porEtapa) {
    var min = Math.min.apply(null, porEtapa);
    return ETAPAS[porEtapa.indexOf(min)];
  }

  document.getElementById('dx-start').addEventListener('click', function () {
    show(quiz);
    pintarPregunta();
  });

  document.querySelectorAll('.dx-answer').forEach(function (btn) {
    btn.addEventListener('click', function () {
      respuestas[actual] = Number(btn.dataset.val);
      if (actual < PREGUNTAS.length - 1) {
        actual++;
        pintarPregunta();
      } else {
        show(gate);
      }
    });
  });

  document.getElementById('dx-prev').addEventListener('click', function () {
    if (actual > 0) { actual--; pintarPregunta(); }
  });

  function pintarResultado(porEtapa) {
    var debil = etapaDebil(porEtapa);
    var total = porEtapa.reduce(function (a, b) { return a + b; }, 0);

    document.getElementById('dx-result-title').textContent =
      total >= 24
        ? 'Sistema sólido, con margen en ' + debil.nombre.toLowerCase() + '.'
        : 'Tu fuga principal está en ' + debil.nombre.toLowerCase() + '.';

    var bars = document.getElementById('dx-bars');
    bars.innerHTML = '';
    ETAPAS.forEach(function (e, i) {
      var pct = Math.round(porEtapa[i] / 6 * 100);
      var esDebil = e.id === debil.id;
      var row = document.createElement('div');
      row.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px">' +
        '<span style="font-family:var(--qv-font-display); font-weight:800; font-size:15px; color:' + (esDebil ? '#E8590C' : '#101319') + '">' +
        e.nombre + (esDebil ? ' · aquí se te escapa' : '') + '</span>' +
        '<span style="font-size:13px; color:#7A7C82; font-weight:600">' + porEtapa[i] + '/6</span></div>' +
        '<div class="dx-bar-track"><div class="dx-bar' + (esDebil ? ' debil' : '') + '" style="width:' + Math.max(pct, 4) + '%"></div></div>';
      bars.appendChild(row);
    });

    document.getElementById('dx-verdict').innerHTML =
      '<p style="margin:0; font-size:16.5px; line-height:1.65; color:#101319">' + VEREDICTOS[debil.id] + '</p>';
  }

  document.getElementById('dx-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = document.getElementById('dx-nombre').value.trim();
    var email = document.getElementById('dx-email').value.trim();
    var rgpd = document.getElementById('dx-rgpd').checked;
    var honeypot = document.getElementById('dx-website').value;

    var porEtapa = scores();

    if (honeypot || Date.now() - loadedAt < 5000) {
      pintarResultado(porEtapa);
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

    var debil = etapaDebil(porEtapa);
    fetch('/api/autodiagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        rgpd: true,
        scores: {
          captacion: porEtapa[0], conversion: porEtapa[1], cualificacion: porEtapa[2],
          venta: porEtapa[3], retencion: porEtapa[4]
        },
        etapa_debil: debil.nombre,
        fugas: PREGUNTAS.filter(function (p, i) { return respuestas[i] !== 2; })
          .map(function (p) { return ETAPAS[p.etapa].nombre + ': ' + p.texto; }),
        origen: window.location.hostname || 'local'
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (window.va) window.va('event', { name: 'autodiagnostico_completado', data: { etapa_debil: debil.id } });
      pintarResultado(porEtapa);
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
