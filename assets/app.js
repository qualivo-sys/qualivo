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
  // Un agente en cada etapa del sistema comercial. Va encendiendo la etapa
  // activa y enseñando, una a una, las cosas que ese agente hace de verdad hoy.
  // Todo lo que se lee aquí está construido y corriendo: nada del grupo "habría
  // que construirlo" del inventario de agentes aparece en esta lista.
  // ───────────────────────────────────────────────────────────────────────────
  var ETAPAS = [
    {
      fase: 'Medios de pago', agente: 'paid', estado: 'piloto',
      hace: [
        'lee las campañas cada día, no cada mes',
        'avisa cuando una creatividad se está cansando',
        'propone el siguiente ángulo y lo pone a competir'
      ]
    },
    {
      fase: 'Contenido y SEO', agente: 'contenido', estado: 'hoy',
      hace: [
        'busca la pregunta que nadie ha respondido bien',
        'escribe y publica',
        'vigila la posición semana a semana'
      ]
    },
    {
      fase: 'Prospección', agente: 'sdr', estado: 'hoy',
      hace: [
        'carga las cuentas del día',
        'sonda su web antes de escribir nada',
        'redacta la secuencia y la deja lista'
      ]
    },
    {
      fase: 'Landing', agente: 'cro', estado: 'piloto',
      hace: [
        'mide en qué punto exacto se cae la página',
        'propone el cambio y lo pone a prueba',
        'se queda con el que gana'
      ]
    },
    {
      fase: 'Conversión', agente: 'radiografía', estado: 'hoy',
      hace: [
        'contesta al instante, sin que nadie esté delante',
        'once preguntas, cinco dimensiones',
        'devuelve el cuello de botella en pantalla'
      ]
    },
    {
      fase: 'Cualificación', agente: 'señal', estado: 'hoy',
      hace: [
        'puntúa la señal de 0 a 100',
        'suma cada apertura, cada clic, cada respuesta',
        'marca tibio al que se está enfriando'
      ]
    },
    {
      fase: 'Seguimiento', agente: 'seguimientos', estado: 'hoy',
      hace: [
        'barre todos los pipelines cada mañana',
        'encuentra lo parado y desde cuántos días',
        'crea la tarea con fecha y con dueño'
      ]
    },
    {
      fase: 'Venta', agente: 'voz', estado: 'hoy',
      hace: [
        'llama al contacto que acaba de entrar',
        'escribe el resumen en el CRM',
        'deja apuntado el siguiente paso'
      ]
    },
    {
      fase: 'Retención', agente: 'reactivación', estado: 'hoy',
      hace: [
        'busca a quien pidió precio y no volvió',
        'un mensaje distinto por cada motivo de parada',
        'y a los que ya fueron clientes'
      ]
    }
  ];

  var ESTADOS = {
    hoy:    { texto: 'en marcha',   clase: 'es-hoy' },
    piloto: { texto: 'en tu piloto', clase: 'es-piloto' }
  };

  function initEtapas() {
    var grid = document.getElementById('qv-etapas-grid');
    if (!grid) return;

    var tarjetas = ETAPAS.map(function (et) {
      var li = document.createElement('li');
      li.className = 'qv-etapa';

      var fase = document.createElement('p');
      fase.className = 'qv-etapa__fase';
      fase.textContent = et.fase;

      // El nombre va partido en dos trozos para que, si no cabe, rompa por los
      // dos puntos y nunca por la mitad de una palabra.
      var ag = document.createElement('p');
      ag.className = 'qv-etapa__agente';
      var punto = document.createElement('i');
      punto.setAttribute('aria-hidden', 'true');
      var pre = document.createElement('span');
      pre.className = 'qv-etapa__pre';
      pre.textContent = 'agente:';
      var id = document.createElement('span');
      id.className = 'qv-etapa__id';
      id.textContent = et.agente;
      ag.appendChild(punto);
      ag.appendChild(pre);
      ag.appendChild(id);

      var acc = document.createElement('p');
      acc.className = 'qv-etapa__accion';
      acc.textContent = et.hace[0];

      // Lo que corre hoy y lo que se construye dentro del piloto se distinguen
      // siempre. Enseñar el mapa entero, sí; darlo por hecho, nunca.
      var est = ESTADOS[et.estado];
      var badge = document.createElement('span');
      badge.className = 'qv-etapa__estado ' + est.clase;
      badge.textContent = est.texto;

      li.appendChild(fase);
      li.appendChild(ag);
      li.appendChild(acc);
      li.appendChild(badge);
      grid.appendChild(li);
      return { li: li, acc: acc, hace: et.hace, n: 0 };
    });

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tarjetas.forEach(function (t) { t.li.className = 'qv-etapa is-on'; });
      return;
    }

    var i = 0, timer = null, corriendo = false;

    function paso() {
      tarjetas.forEach(function (t, k) {
        t.li.className = 'qv-etapa' + (k === i ? ' is-on' : '');
      });

      var t = tarjetas[i];
      // A la vuelta siguiente, esta etapa enseña otra de las cosas que hace.
      timer = window.setTimeout(function () {
        t.li.className += ' is-fade';
        timer = window.setTimeout(function () {
          t.n = (t.n + 1) % t.hace.length;
          t.acc.textContent = t.hace[t.n];
          t.li.className = t.li.className.replace(' is-fade', '');
        }, 260);
      }, 1500);

      i = (i + 1) % tarjetas.length;
      window.setTimeout(function () { if (corriendo) paso(); }, 2100);
    }

    function arrancar() { if (!corriendo) { corriendo = true; paso(); } }
    function parar() {
      corriendo = false;
      if (timer) { window.clearTimeout(timer); timer = null; }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { e.isIntersecting ? arrancar() : parar(); });
      }, { threshold: 0, rootMargin: '200px 0px 200px 0px' }).observe(grid);
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

      var cualificado = true; // la escala se guarda en el CRM; se decide en la llamada, no en el formulario
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
      initSalaControl();
      initMech();
      initEtapas();
      initForm();
    });
  } else {
    initReveal();
    initSalaControl();
    initMech();
    initEtapas();
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
