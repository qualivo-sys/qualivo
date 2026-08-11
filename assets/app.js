/* Qualivo landing — animación del hero + formulario. Sin dependencias. */
(function () {
  'use strict';

  // ───────────────────────────────────────────────────────────────────────────
  // Configuración
  // ───────────────────────────────────────────────────────────────────────────
  var CONFIG = {
    // URL del webhook que recibe el formulario (Make, Zapier, n8n…).
    // Sin URL, el formulario funciona en modo prueba: no envía nada
    // y avisa por consola.
    WEBHOOK_URL: '',
    // URL de un calendario embebible (Calendly, Cal.com…). Si se define,
    // se incrusta como iframe en la pantalla de confirmación.
    CALENDAR_EMBED_URL: ''
  };

  var TEAL = '#0E7C74';
  var CORAL = '#E8590C';
  var INK = '#101319';
  var MONO = 'ui-monospace,SFMono-Regular,Menlo,monospace';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // ───────────────────────────────────────────────────────────────────────────
  // Hero: flujo ADS → LEADS → CRM → SALES → € con un atasco que se detecta
  // y se libera en ciclos de 9 s
  // ───────────────────────────────────────────────────────────────────────────
  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function initHeroFlow() {
    var host = document.getElementById('hero-flow');
    if (!host) return;

    var W = 1040, H = 210, y = 92;
    var nodes = ['ADS', 'LEADS', 'CRM', 'SALES', '€'];
    var xs = [90, 300, 520, 740, 950];

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' });
    svg.setAttribute('aria-label', 'Flujo de anuncios a ingresos con un punto donde el sistema se atasca');

    var lines = [], dots = [];
    for (var k = 0; k < 4; k++) {
      var ax = xs[k] + 46, bx = xs[k + 1] - 46;
      var line = el('line', { x1: ax, y1: y, x2: bx, y2: y, stroke: 'rgba(16,19,25,.22)', 'stroke-width': 1.5 });
      lines.push(line);
      svg.appendChild(line);
      for (var j = 0; j < 3; j++) {
        var dot = el('circle', { cy: y, r: 3.4, fill: TEAL, opacity: 0.9 });
        dots.push({ node: dot, k: k, j: j, ax: ax, bx: bx });
        svg.appendChild(dot);
      }
    }

    var mx = (xs[2] + xs[3]) / 2;
    var pulse = el('circle', { cx: mx, cy: y, fill: 'none', stroke: CORAL, 'stroke-width': 1.5, visibility: 'hidden' });
    svg.appendChild(pulse);
    var label = el('text', {
      x: mx, y: y - 30, 'text-anchor': 'middle', 'font-size': 12,
      'letter-spacing': '.16em', 'font-weight': 800, 'font-family': MONO, visibility: 'hidden'
    });
    svg.appendChild(label);

    nodes.forEach(function (n, i) {
      var isEuro = i === 4;
      var g = el('g', {});
      g.appendChild(el('rect', {
        x: xs[i] - 46, y: y - 26, width: 92, height: 52, rx: 12,
        fill: isEuro ? TEAL : '#fff', stroke: isEuro ? TEAL : 'rgba(16,19,25,.16)', 'stroke-width': 1.2
      }));
      var t = el('text', {
        x: xs[i], y: y + 5.5, 'text-anchor': 'middle', fill: isEuro ? '#fff' : INK,
        'font-size': isEuro ? 19 : 14, 'letter-spacing': '.08em', 'font-weight': 800, 'font-family': MONO
      });
      t.textContent = n;
      g.appendChild(t);
      svg.appendChild(g);
    });

    host.appendChild(svg);

    function render(t) {
      var cyc = (t % 9000) / 9000;
      var clogged = cyc > 0.3 && cyc < 0.75;

      lines.forEach(function (line, i) {
        var isClog = i === 2 && clogged;
        line.setAttribute('stroke', isClog ? CORAL : 'rgba(16,19,25,.22)');
        line.setAttribute('stroke-width', isClog ? 2 : 1.5);
        if (isClog) line.setAttribute('stroke-dasharray', '5 5');
        else line.removeAttribute('stroke-dasharray');
      });

      dots.forEach(function (d) {
        var isClog = d.k === 2 && clogged;
        var f = ((t / 1700) + d.j / 3 + d.k * 0.21) % 1;
        if (isClog) f = Math.min(f, 0.32 + d.j * 0.07);
        d.node.setAttribute('cx', d.ax + (d.bx - d.ax) * f);
        d.node.setAttribute('fill', isClog ? CORAL : TEAL);
      });

      if (clogged) {
        pulse.setAttribute('r', 13 + 5 * Math.sin(t / 300));
        pulse.setAttribute('visibility', 'visible');
        label.textContent = 'AQUÍ SE ATASCA';
        label.setAttribute('fill', CORAL);
        label.setAttribute('visibility', 'visible');
      } else if (cyc >= 0.75) {
        pulse.setAttribute('visibility', 'hidden');
        label.textContent = 'RESUELTO';
        label.setAttribute('fill', TEAL);
        label.setAttribute('visibility', 'visible');
      } else {
        pulse.setAttribute('visibility', 'hidden');
        label.setAttribute('visibility', 'hidden');
      }
    }

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      render(5200); // fotograma fijo: fase de atasco detectado
      return;
    }
    var t0 = performance.now();
    (function tick(now) {
      render(now - t0);
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
        fecha: new Date().toISOString()
      };

      clearError();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      sendToWebhook(payload)
        .then(function () {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initHeroFlow();
      initForm();
    });
  } else {
    initHeroFlow();
    initForm();
  }
})();
