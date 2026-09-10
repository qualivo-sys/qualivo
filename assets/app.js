/* Qualivo landing — animación del hero + formulario. Sin dependencias. */
(function () {
  'use strict';

  // ───────────────────────────────────────────────────────────────────────────
  // Configuración
  // ───────────────────────────────────────────────────────────────────────────
  var CONFIG = {
    // Endpoint que recibe el formulario. /api/lead es la función serverless
    // del propio dominio que crea el contacto en GoHighLevel.
    WEBHOOK_URL: '/api/lead',
    // Widget de reservas de GoHighLevel, incrustado como iframe en la
    // pantalla de confirmación.
    CALENDAR_EMBED_URL: 'https://api.leadconnectorhq.com/widget/booking/XSaUhWyjh2p6PoIsLDdJ'
  };

  var TEAL = '#0E7C74';
  var CORAL = '#E8590C';
  var INK = '#101319';
  var MONO = 'ui-monospace,SFMono-Regular,Menlo,monospace';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // ───────────────────────────────────────────────────────────────────────────
  // Hero: la cadena de captación y ventas, con la fuga cambiando de sitio en
  // cada vuelta. El mensaje no es «hay un atasco», es «no sabes en cuál de las
  // seis piezas está» — que es justo lo que responde el diagnóstico.
  // ───────────────────────────────────────────────────────────────────────────
  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function initHeroFlow() {
    var host = document.getElementById('mech-flow') || document.getElementById('hero-flow');
    if (!host) return;

    var W = 1040, H = 250, y = 128;

    // Tres entradas — no todo el mundo capta con anuncios — que confluyen en
    // la misma cadena. A partir de ahí, una sola fila hasta los ingresos.
    var FUENTES = ['ANUNCIOS', 'CONTENIDO', 'PROSPECCIÓN'];
    var fx = 96, fhalf = 88, fys = [y - 58, y, y + 58];
    var bus = 232;

    var nodes = ['CONTACTOS', 'CRM', 'SEGUIMIENTO', 'VENTAS', '€'];
    var xs = [340, 506, 678, 864, 1002];
    var halfs = [72, 46, 78, 60, 34];

    var FUGAS = [1, 3, 2];   // el tramo que falla cambia en cada vuelta; la entrada no, ahi no se pierde nada
    var CICLO = 7000;

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' });
    svg.setAttribute('aria-label', 'Anuncios, contenido y prospección alimentan una cadena de contactos, CRM, seguimiento y ventas hasta los ingresos, con una fuga que cambia de sitio');

    // Confluencia de las tres entradas
    fys.forEach(function (fy) {
      svg.appendChild(el('path', {
        d: 'M' + (fx + fhalf) + ' ' + fy + ' H' + (bus - 18) + ' Q' + bus + ' ' + fy + ' ' + bus + ' ' + (fy < y ? fy + 18 : fy > y ? fy - 18 : fy),
        fill: 'none', stroke: 'rgba(16,19,25,.22)', 'stroke-width': 1.5
      }));
    });
    svg.appendChild(el('line', { x1: bus, y1: fys[0], x2: bus, y2: fys[2], stroke: 'rgba(16,19,25,.22)', 'stroke-width': 1.5 }));

    var lines = [], dots = [];
    var tramos = [[bus, xs[0] - halfs[0]]];
    for (var k = 0; k < 4; k++) tramos.push([xs[k] + halfs[k], xs[k + 1] - halfs[k + 1]]);

    tramos.forEach(function (t, k) {
      var line = el('line', { x1: t[0], y1: y, x2: t[1], y2: y, stroke: 'rgba(16,19,25,.22)', 'stroke-width': 1.5 });
      lines.push(line);
      svg.appendChild(line);
      for (var j = 0; j < 4; j++) {
        var dot = el('circle', { cy: y, r: 3.6, fill: TEAL, opacity: 0.9 });
        dots.push({ node: dot, k: k, j: j, ax: t[0], bx: t[1] });
        svg.appendChild(dot);
      }
    });

    var pulse = el('circle', { cy: y, fill: 'none', stroke: CORAL, 'stroke-width': 1.5, visibility: 'hidden' });
    svg.appendChild(pulse);
    var label = el('text', {
      y: y - 40, 'text-anchor': 'middle', 'font-size': 12,
      'letter-spacing': '.16em', 'font-weight': 800, 'font-family': MONO, visibility: 'hidden'
    });
    svg.appendChild(label);

    function caja(cx, cy, half, texto, destacada, tam) {
      var g = el('g', {});
      var r = el('rect', {
        x: cx - half, y: cy - (destacada ? 26 : 21), width: half * 2, height: destacada ? 52 : 42, rx: destacada ? 12 : 10,
        fill: destacada === 'euro' ? TEAL : '#fff',
        stroke: destacada === 'euro' ? TEAL : 'rgba(16,19,25,.16)', 'stroke-width': 1.2
      });
      g.appendChild(r);
      var t = el('text', {
        x: cx, y: cy + (destacada === 'euro' ? 6 : 4.5), 'text-anchor': 'middle',
        fill: destacada === 'euro' ? '#fff' : INK,
        'font-size': tam, 'letter-spacing': '.07em', 'font-weight': 800, 'font-family': MONO
      });
      t.textContent = texto;
      g.appendChild(t);
      svg.appendChild(g);
      return r;
    }

    FUENTES.forEach(function (f, i) { caja(fx, fys[i], fhalf, f, false, 12); });

    var cajas = nodes.map(function (n, i) {
      return caja(xs[i], y, halfs[i], n, i === nodes.length - 1 ? 'euro' : true, i === nodes.length - 1 ? 19 : 12.5);
    });

    host.appendChild(svg);

    function render(t) {
      var vuelta = Math.floor(t / CICLO);
      var cyc = (t % CICLO) / CICLO;
      var fuga = FUGAS[vuelta % FUGAS.length];
      var atascado = cyc > 0.16 && cyc < 0.74;
      var cierre = cyc >= 0.74;
      var mx = (tramos[fuga][0] + tramos[fuga][1]) / 2;

      lines.forEach(function (line, i) {
        var mal = i === fuga && atascado;
        line.setAttribute('stroke', mal ? CORAL : 'rgba(16,19,25,.22)');
        line.setAttribute('stroke-width', mal ? 2 : 1.5);
        if (mal) {
          line.setAttribute('stroke-dasharray', '5 5');
          line.setAttribute('stroke-dashoffset', -(t / 42) % 10);
        } else {
          line.removeAttribute('stroke-dasharray');
          line.removeAttribute('stroke-dashoffset');
        }
      });

      dots.forEach(function (d) {
        var mal = d.k === fuga && atascado;
        var f = ((t / 1350) + d.j / 4 + d.k * 0.17) % 1;
        if (mal) f = Math.min(f, 0.32 + d.j * 0.07);
        d.node.setAttribute('cx', d.ax + (d.bx - d.ax) * f);
        d.node.setAttribute('fill', mal ? CORAL : TEAL);
      });

      var euro = cajas[cajas.length - 1];
      euro.setAttribute('transform', atascado ? '' : 'translate(0,' + (Math.sin(t / 420) * 1.6).toFixed(2) + ')');

      cajas.forEach(function (r, i) {
        var senala = cierre && i === fuga;
        r.setAttribute('stroke', senala || i === cajas.length - 1 ? TEAL : 'rgba(16,19,25,.16)');
        r.setAttribute('stroke-width', senala ? 2.4 : 1.2);
      });

      if (atascado) {
        pulse.setAttribute('cx', mx);
        pulse.setAttribute('r', 12 + 4 * Math.sin(t / 300));
        pulse.setAttribute('visibility', 'visible');
        label.setAttribute('x', mx);
        label.textContent = 'AQUÍ SE PIERDE';
        label.setAttribute('fill', CORAL);
        label.setAttribute('visibility', 'visible');
      } else if (cierre) {
        pulse.setAttribute('visibility', 'hidden');
        label.setAttribute('x', xs[fuga]);
        label.textContent = 'EMPIEZA POR AQUÍ';
        label.setAttribute('fill', TEAL);
        label.setAttribute('visibility', 'visible');
      } else {
        pulse.setAttribute('visibility', 'hidden');
        label.setAttribute('visibility', 'hidden');
      }
    }

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      render(CICLO * 0.5);
      return;
    }
    var t0 = performance.now();
    (function tick(now) {
      // El primer fotograma puede llegar con marca anterior a t0 y dejar
      // el tiempo en negativo: la vuelta saldria -1 y no hay tramo -1.
      render(Math.max(0, now - t0));
      requestAnimationFrame(tick);
    })(t0);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Formulario: validación, honeypot, envío por fetch y tres estados
  // ───────────────────────────────────────────────────────────────────────────
  var FACT_LABELS = {
    '0': 'Menos de 500k €',
    '1': '500k–1M €',
    '2': '1M–3M €',
    '3': '3M–10M €',
    '4': '+10M €'
  };
  var QUIEN_LABELS = {
    interno: 'Equipo interno',
    agencia: 'Agencia',
    freelance: 'Freelancers',
    mixto: 'Agencia + equipo interno',
    direccion: 'Fundador / equipo directivo',
    otro: 'Otro'
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Sala de control del hero: los ocho agentes que ya funcionan, trabajando a
  // la vez sobre el mismo CRM. Es una simulación de un día — así se anuncia en
  // el pie del panel — y las cifras que salen son de ejecuciones reales:
  // 4 pipelines, 30 oportunidades abiertas, 25 paradas, 34.500 € declarados y
  // 25 tareas creadas (agente de seguimientos, 10-sep-2026); 16 llamadas del
  // agente de voz; 11 preguntas y 5 dimensiones de la Radiografía; secuencia de
  // días 1, 3 y 7. No se inventa ningún número.
  // ───────────────────────────────────────────────────────────────────────────
  var AGENTES = [
    { id: 'radiografia',  nombre: 'radiografía' },
    { id: 'senal',        nombre: 'señal' },
    { id: 'seguimientos', nombre: 'seguimientos' },
    { id: 'reactivacion', nombre: 'reactivación' },
    { id: 'secuencia',    nombre: 'secuencia' },
    { id: 'sdr',          nombre: 'sdr' },
    { id: 'voz',          nombre: 'voz' },
    { id: 'informe',      nombre: 'informe' }
  ];

  var DIA = [
    { a: 'sdr',          t: 'cargando las cuentas del día y sondando sus webs',        e: 720 },
    { a: 'radiografia',  t: 'diagnóstico nuevo · 11 preguntas, 5 dimensiones',          e: 700 },
    { a: 'senal',        t: 'puntuación de la señal',              v: '78/100',         e: 620 },
    { a: 'senal',        t: 'cuello de botella detectado: seguimiento', tipo: 'warn',    e: 700 },
    { a: 'secuencia',    t: 'correo del día 1 programado con su pregunta',              e: 660 },
    { a: 'voz',          t: 'llamada lanzada al contacto que acaba de entrar',          e: 720 },
    { a: 'voz',          t: 'resumen y siguiente paso escritos en el CRM',              e: 680 },
    { a: 'seguimientos', t: 'barriendo todos los pipelines',        v: '4',             e: 560 },
    { a: 'seguimientos', t: 'oportunidades abiertas',               v: '30',            e: 560 },
    { a: 'seguimientos', t: 'paradas sin siguiente paso',           v: '25', tipo: 'warn', e: 640 },
    { a: 'seguimientos', t: 'importe declarado que estaba parado',  v: '34.500 €', tipo: 'warn', e: 780 },
    { a: 'seguimientos', t: 'tareas creadas, con fecha y con dueño', v: '25', tipo: 'done', e: 720 },
    { a: 'reactivacion', t: 'buscando a quien pidió precio y nunca volvió',             e: 700 },
    { a: 'reactivacion', t: 'un mensaje distinto por cada motivo real de parada',       e: 720 },
    { a: 'secuencia',    t: 'día 3 y día 7 en cola · se paran si contesta', tipo: 'done', e: 680 },
    { a: 'sdr',          t: 'respuestas triadas · las buenas suben a Maikel',           e: 700 },
    { a: 'informe',      t: 'anuncios, visitas y posiciones al Sheet',                  e: 640 },
    { a: 'informe',      t: 'informe de la mañana enviado', tipo: 'done',               e: 4600 }
  ];

  var VISIBLES = 9;   // cuántas líneas caben en el panel sin recortarse

  function initSalaControl() {
    var log = document.getElementById('qv-log');
    var roster = document.getElementById('qv-roster');
    if (!log || !roster) return;

    var pills = {};
    AGENTES.forEach(function (ag) {
      var li = document.createElement('li');
      li.textContent = ag.nombre;
      roster.appendChild(li);
      pills[ag.id] = li;
    });

    var nombres = {};
    AGENTES.forEach(function (ag) { nombres[ag.id] = ag.nombre; });

    function evento(paso) {
      var row = document.createElement('div');
      row.className = 'qv-ev' + (paso.tipo ? ' qv-ev--' + paso.tipo : '');
      var w = document.createElement('span');
      w.className = 'qv-ev__who';
      w.textContent = nombres[paso.a];
      var t = document.createElement('span');
      t.className = 'qv-ev__txt';
      t.textContent = paso.t;
      row.appendChild(w);
      row.appendChild(t);
      if (paso.v) {
        var v = document.createElement('span');
        v.className = 'qv-ev__val';
        v.textContent = paso.v;
        row.appendChild(v);
      }
      return row;
    }

    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sin animación: las últimas líneas del día, ya escritas, y todos los
    // agentes marcados como activos. Mismo contenido, sin movimiento.
    if (reducido) {
      DIA.slice(-VISIBLES).forEach(function (paso) {
        var row = evento(paso);
        row.className += ' is-in';
        log.appendChild(row);
      });
      AGENTES.forEach(function (ag) { pills[ag.id].className = 'is-act'; });
      return;
    }

    var caret = document.createElement('span');
    caret.className = 'qv-caret';
    caret.setAttribute('aria-hidden', 'true');

    var i = 0, timer = null, corriendo = false, apagar = {};

    function siguiente() {
      if (i >= DIA.length) {
        timer = window.setTimeout(function () {
          log.style.transition = 'opacity 420ms ease';
          log.style.opacity = '0';
          timer = window.setTimeout(function () {
            log.innerHTML = '';
            log.style.opacity = '1';
            i = 0;
            siguiente();
          }, 440);
        }, DIA[DIA.length - 1].e);
        return;
      }

      var paso = DIA[i++];
      var row = evento(paso);
      log.appendChild(row);
      row.appendChild(caret);
      while (log.children.length > VISIBLES) log.removeChild(log.firstChild);
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { row.className += ' is-in'; });
      });

      // El agente que acaba de actuar se enciende y se apaga solo al rato.
      var pill = pills[paso.a];
      if (pill) {
        pill.className = 'is-act';
        if (apagar[paso.a]) window.clearTimeout(apagar[paso.a]);
        apagar[paso.a] = window.setTimeout(function () { pill.className = ''; }, 2600);
      }

      timer = window.setTimeout(siguiente, paso.e);
    }

    function arrancar() { if (!corriendo) { corriendo = true; siguiente(); } }
    function parar() {
      corriendo = false;
      if (timer) { window.clearTimeout(timer); timer = null; }
    }

    // No gastar batería con el panel fuera de pantalla o la pestaña de fondo,
    // pero arrancarlo un poco antes de que entre para que no se vea vacío.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { e.isIntersecting ? arrancar() : parar(); });
      }, { threshold: 0, rootMargin: '260px 0px 260px 0px' }).observe(log);
    } else {
      arrancar();
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? parar() : arrancar();
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Tira del mecanismo: detectar → agentizar → operar → medir → aprender →
  // escalar. Va encendiendo el paso activo mientras la sección está a la vista.
  // ───────────────────────────────────────────────────────────────────────────
  function initMech() {
    var lista = document.getElementById('qv-mech');
    if (!lista) return;
    var pasos = lista.querySelectorAll('li');
    if (!pasos.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (var k = 0; k < pasos.length; k++) pasos[k].className += ' is-on';
      return;
    }
    var n = 0, timer = null;
    function tic() {
      for (var k = 0; k < pasos.length; k++) {
        pasos[k].className = (k === n % pasos.length) ? 'is-on' : '';
      }
      n++;
      timer = window.setTimeout(tic, 1100);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { if (!timer) tic(); }
          else if (timer) { window.clearTimeout(timer); timer = null; }
        });
      }, { threshold: 0.3 }).observe(lista);
    } else { tic(); }
  }

  function initForm() {
    var form = document.getElementById('lead-form');
    if (!form) return;

    var panelThanks = document.getElementById('panel-thanks');
    var panelReject = document.getElementById('panel-reject');
    var errorEl = document.getElementById('form-error');
    var submitBtn = document.getElementById('submit-btn');
    var backBtn = document.getElementById('back-btn');
    var loadedAt = Date.now();

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }
    function clearError() {
      errorEl.hidden = true;
    }
    form.addEventListener('input', clearError);

    function show(panel) {
      form.hidden = panel !== form;
      panelThanks.hidden = panel !== panelThanks;
      panelReject.hidden = panel !== panelReject;
      var contacto = document.getElementById('contacto');
      if (contacto) window.scrollTo({ top: contacto.offsetTop - 60, behavior: 'smooth' });
    }

    function mountCalendar() {
      if (!CONFIG.CALENDAR_EMBED_URL) return;
      var slot = document.getElementById('calendar-slot');
      if (!slot || slot.querySelector('iframe')) return;
      slot.style.border = 'none';
      slot.style.padding = '0';
      slot.innerHTML = '';
      var iframe = document.createElement('iframe');
      iframe.src = CONFIG.CALENDAR_EMBED_URL;
      iframe.title = 'Reserva una hora';
      iframe.style.cssText = 'width:100%; height:640px; border:none; border-radius:12px;';
      iframe.loading = 'lazy';
      slot.appendChild(iframe);
    }

    function leerSesion(k) {
      try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; }
    }

    function sendToWebhook(payload) {
      if (!CONFIG.WEBHOOK_URL) {
        console.warn('[qualivo] WEBHOOK_URL sin configurar: el formulario no envía datos. Payload:', payload);
        return Promise.resolve();
      }
      return fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('Webhook respondió ' + res.status);
      });
    }

    if (backBtn) backBtn.addEventListener('click', function () { show(form); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre = document.getElementById('f-nombre').value.trim();
      var email = document.getElementById('f-email').value.trim();
      var empresa = document.getElementById('f-empresa').value.trim();
      var fact = document.getElementById('f-fact').value;
      var quien = document.getElementById('f-quien').value;
      var hipotesis = document.getElementById('f-hipotesis').value.trim();
      var rgpd = document.getElementById('f-rgpd').checked;
      var honeypot = document.getElementById('f-website').value;

      // Anti-spam: honeypot relleno o envío en menos de 3 segundos desde la
      // carga → se descarta en silencio mostrando la pantalla de éxito.
      if (honeypot || Date.now() - loadedAt < 3000) {
        show(panelThanks);
        mountCalendar();
        return;
      }

      if (!nombre) return showError('Necesitamos tu nombre y cargo para preparar la llamada.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showError('Revisa el email: ahí es donde te llega la confirmación.');
      if (!empresa) return showError('Dinos la empresa. Miramos tu web antes de la llamada.');
      if (!fact) return showError('Sin la escala del negocio no podemos decirte si esto te encaja.');
      if (!quien) return showError('Falta quién lleva hoy la captación.');
      if (!hipotesis) return showError('Escribe tu hipótesis, aunque sea a medias.');
      if (!rgpd) return showError('Necesitamos tu consentimiento para tratar los datos.');

      var cualificado = fact !== '0';
      var payload = {
        nombre: nombre,
        email: email,
        empresa: empresa,
        facturacion: FACT_LABELS[fact] || fact,
        facturacion_valor: fact,
        quien_capta: QUIEN_LABELS[quien] || quien,
        hipotesis: hipotesis,
        rgpd: true,
        cualificado: cualificado,
        origen: window.location.hostname || 'local',
        fecha: new Date().toISOString(),
        hero: leerSesion('qv_hero'),
        utm: leerSesion('qv_utm')
      };

      clearError();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      sendToWebhook(payload)
        .then(function () {
          if (window.va) window.va('event', { name: cualificado ? 'diagnostico_solicitado' : 'lead_fuera_alcance' });
          if (window.qvTrack) window.qvTrack(cualificado ? 'diagnostico_solicitado' : 'lead_fuera_alcance', { facturacion: payload.facturacion });
          if (cualificado) {
            show(panelThanks);
            mountCalendar();
          } else {
            show(panelReject);
          }
        })
        .catch(function (err) {
          console.error('[qualivo] Error enviando el formulario:', err);
          // El lead fuera de alcance ve su pantalla aunque falle el webhook:
          // no hay siguiente paso que dependa del envío.
          if (!cualificado) {
            show(panelReject);
            return;
          }
          showError('No hemos podido enviar tus datos. Inténtalo de nuevo en unos segundos.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Solicitar diagnóstico →';
        });
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Aparición al hacer scroll (elementos con data-reveal)
  // ───────────────────────────────────────────────────────────────────────────
  function initReveal() {
    document.documentElement.classList.add('js');
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReveal();
      initHeroFlow();
      initSalaControl();
      initMech();
      initForm();
    });
  } else {
    initReveal();
    initHeroFlow();
    initSalaControl();
    initMech();
    initForm();
  }
})();

/* === Claims rotativos del hero (el primero queda estático en HTML para SEO/GEO) === */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Todas abren por la fuga, nunca por la IA (propuesta de valor V1, §11).
  // La primera es la misma que va estática en el HTML.
  var frases = [
    'Tu sistema comercial funciona. Lo que falla es lo que depende de que alguien se acuerde.',
    'El presupuesto que enviaste hace tres semanas sigue abierto. Nadie ha vuelto.',
    'Cada oportunidad que se enfría ya la habías pagado.',
    'No te falta demanda. Te falta que alguien vuelva a llamar.',
    'Más leads encima del mismo agujero no es un plan.'
  ];
  var i = 0, prepared = false;
  setInterval(function () {
    var el = document.querySelector('main h1') || document.querySelector('h1');
    if (!el) return;
    if (!prepared) {
      el.style.transition = 'opacity .35s ease';
      el.style.minHeight = el.getBoundingClientRect().height + 'px';
      prepared = true;
    }
    el.style.opacity = '0';
    setTimeout(function () {
      i = (i + 1) % frases.length;
      el.textContent = frases[i];
      el.style.opacity = '1';
    }, 360);
  }, 5200);
})();
