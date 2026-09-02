/* Cuestionario de cualificación — Antic Barcelona 113 */
(function () {
  'use strict';

  var STEPS = [
    {
      key: 'pieza', label: 'La pieza', title: '¿Qué necesitas?',
      sub: 'Empecemos por lo básico: qué pieza tienes en mente.',
      kind: 'choice', required: true,
      options: [
        { label: 'Mesa', desc: 'Comedor, salón o cocina', img: '/assets/photos/mesa-madera-encaje.jpg' },
        { label: 'Banco', desc: 'A medida del espacio', img: '/assets/photos/banco-artesanal-de-madera.jpg' },
        { label: 'Cajonera', desc: 'Madera maciza', img: '/assets/photos/cajonera-escalonada-madera.jpg' },
        { label: 'Otra pieza', desc: 'Piedra, vitrinas, puertas…', img: '/assets/photos/banera-de-piedra-vintage.jpg' }
      ]
    },
    {
      key: 'espacio', label: 'El espacio', title: '¿Dónde irá?',
      sub: 'La estancia condiciona el material y el acabado.',
      kind: 'chips', required: true,
      options: [{ label: 'Salón' }, { label: 'Comedor' }, { label: 'Cocina' }, { label: 'Restaurante' }, { label: 'Otro espacio' }]
    },
    {
      key: 'medidas', label: 'Las medidas', title: '¿Qué medidas?',
      sub: 'Aproximadas es suficiente. Las ajustamos contigo.',
      kind: 'medidas', required: false
    },
    {
      key: 'estilo', label: 'El estilo', title: '¿Qué estilo buscas?',
      sub: 'Si no lo tienes claro, dínoslo con referencias.',
      kind: 'choice', required: true,
      options: [
        { label: 'Rústico', desc: 'Canto natural, veta viva', img: '/assets/photos/mesa-tronco-madera.jpg' },
        { label: 'Contemporáneo', desc: 'Líneas limpias, madera protagonista', img: '/assets/photos/mesa-madera-encaje.jpg' },
        { label: 'Industrial', desc: 'Madera + estructura metálica', img: '/assets/photos/mesa-madera-pieza.jpg' },
        { label: 'Aún no lo sé', desc: 'Nos lo enseñas con referencias', img: '/assets/photos/textura-antic-barcelona.jpg' }
      ],
      extra: { key: 'referencias', label: 'Referencias', placeholder: 'Pega enlaces o describe lo que te gusta', multiline: true }
    },
    {
      key: 'presupuesto', label: 'El presupuesto', title: '¿Qué presupuesto tienes en mente?',
      sub: 'Nos ayuda a proponerte material y medidas acordes. No es un compromiso.',
      kind: 'presupuesto', required: false
    },
    {
      key: 'plazo', label: 'El plazo', title: '¿Cuándo la necesitas?',
      sub: 'La fabricación artesanal lleva su tiempo; conviene planificarla.',
      kind: 'chips', required: true,
      options: [{ label: 'Lo antes posible' }, { label: 'En los próximos 3 meses' }, { label: 'Más adelante este año' }, { label: 'Solo estoy explorando' }]
    },
    {
      key: 'contacto', label: 'Contacto', title: '¿Cómo te escribimos?',
      sub: 'Te respondemos por WhatsApp con una propuesta concreta para tu espacio.',
      kind: 'contacto', required: true
    }
  ];

  var a = {};                       // respuestas
  var i = 0;                        // paso actual
  var panes = document.getElementById('panes');
  var crumbs = document.getElementById('crumbs');
  var pbar = document.getElementById('pbar');
  var back = document.getElementById('back');
  var next = document.getElementById('next');
  var count = document.getElementById('count');
  var foot = document.getElementById('foot');
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- Scoring ---------- */
  function qualify() {
    if (a.plazo === 'Solo estoy explorando') {
      return { tier: 'COLD', note: 'Está buscando inspiración. Entra en secuencia de contenido, sin llamada comercial.' };
    }
    var definido = a.pieza && a.espacio && (a.largo || a.medidasLibres);
    var cerca = a.plazo === 'Lo antes posible' || a.plazo === 'En los próximos 3 meses';
    if (definido && cerca && (a.presupuesto || a.presupuestoHablar)) {
      return { tier: 'HOT', note: 'Proyecto definido, presupuesto y plazo cercano. WhatsApp en menos de 2 h y propuesta de visita al taller.' };
    }
    return { tier: 'WARM', note: 'Tiene proyecto pero sigue explorando. Seguimiento a 7 días con proyectos similares.' };
  }

  /* ---------- Render ---------- */
  function render() {
    if (i >= STEPS.length) return renderDone();
    var s = STEPS[i], h = '';

    h += '<div class="pane on"><h2>' + s.title + '</h2><p class="sub">' + s.sub + '</p>';

    if (s.kind === 'choice') {
      h += '<div class="opts">' + s.options.map(function (o) {
        var on = a[s.key] === o.label;
        return '<button class="opt" data-choice="' + esc(s.key) + '" data-val="' + esc(o.label) + '" aria-pressed="' + on + '">' +
          (o.img ? '<span class="opt__img"><img src="' + o.img + '" alt="" loading="lazy"></span>' : '') +
          '<span class="opt__t"><b>' + esc(o.label) + '</b>' + (o.desc ? '<span>' + esc(o.desc) + '</span>' : '') + '</span></button>';
      }).join('') + '</div>';
      if (s.extra) {
        h += '<div class="field" style="margin-top:26px;max-width:600px"><label for="x">' + s.extra.label + '</label>' +
          '<textarea id="x" rows="3" placeholder="' + esc(s.extra.placeholder) + '">' + esc(a[s.extra.key] || '') + '</textarea></div>';
      }
    }

    if (s.kind === 'chips') {
      h += '<div class="chips">' + s.options.map(function (o) {
        return '<button class="chip" data-choice="' + esc(s.key) + '" data-val="' + esc(o.label) + '" aria-pressed="' + (a[s.key] === o.label) + '">' + esc(o.label) + '</button>';
      }).join('') + '</div>';
    }

    if (s.kind === 'medidas') {
      h += '<div class="row" style="max-width:640px">' +
        '<div class="field"><label for="largo">Largo (cm)</label><input id="largo" type="number" inputmode="numeric" min="30" max="800" placeholder="240" value="' + esc(a.largo || '') + '"></div>' +
        '<div class="field"><label for="ancho">Ancho (cm)</label><input id="ancho" type="number" inputmode="numeric" min="30" max="400" placeholder="100" value="' + esc(a.ancho || '') + '"></div>' +
        '<div class="field"><label for="com">Comensales</label><input id="com" type="number" inputmode="numeric" min="1" max="40" placeholder="8" value="' + esc(a.comensales || '') + '"></div>' +
        '</div>' +
        '<div class="field" style="max-width:640px"><label for="libre">O descríbelo</label>' +
        '<textarea id="libre" rows="2" placeholder="No sé las medidas: el comedor mide unos 4 metros de largo…">' + esc(a.medidasLibres || '') + '</textarea></div>';
    }

    if (s.kind === 'presupuesto') {
      h += '<div class="field" style="max-width:400px"><label for="pres">Presupuesto orientativo (€)</label>' +
        '<input id="pres" type="number" inputmode="numeric" min="0" step="100" placeholder="Escribe una cifra aproximada" value="' + esc(a.presupuesto || '') + '">' +
        '<span class="hint">Solo para orientarnos. No es un compromiso ni un precio cerrado.</span></div>' +
        '<button class="chip" id="hablar" aria-pressed="' + !!a.presupuestoHablar + '" style="margin-top:6px">Prefiero hablarlo</button>';
    }

    if (s.kind === 'contacto') {
      h += '<div class="row" style="max-width:640px">' +
        '<div class="field"><label for="nom">Nombre</label><input id="nom" type="text" autocomplete="given-name" placeholder="Tu nombre" value="' + esc(a.nombre || '') + '"><span class="errmsg">Dinos cómo te llamas.</span></div>' +
        '<div class="field"><label for="mail">Email</label><input id="mail" type="email" autocomplete="email" placeholder="tu@email.com" value="' + esc(a.email || '') + '"><span class="errmsg">Revisa el correo.</span></div>' +
        '</div>' +
        '<div class="field" style="max-width:400px"><label for="wa">WhatsApp</label><input id="wa" type="tel" autocomplete="tel" placeholder="+34 600 000 000" value="' + esc(a.tel || '') + '"><span class="hint">Es por donde te respondemos más rápido.</span><span class="errmsg">Necesitamos un teléfono para escribirte.</span></div>' +
        '<label class="checkline" style="max-width:600px"><input type="checkbox" id="ok"' + (a.consent ? ' checked' : '') + '>' +
        '<span>He leído y acepto la <a href="/privacidad" target="_blank">política de privacidad</a> y consiento que me contactéis sobre mi proyecto.</span></label>';
    }

    h += '</div>';
    panes.innerHTML = h;

    // migas y progreso
    crumbs.innerHTML = STEPS.map(function (s2, n) {
      return '<span class="' + (n === i ? 'on' : n < i ? 'done' : '') + '">' + esc(s2.label) + '</span>';
    }).join('');
    pbar.style.width = (i / STEPS.length * 100) + '%';
    count.textContent = 'Paso ' + (i + 1) + ' de ' + STEPS.length;
    back.style.visibility = i === 0 ? 'hidden' : 'visible';
    next.innerHTML = (i === STEPS.length - 1 ? 'Enviar' : 'Siguiente') + ' <span class="arw">→</span>';
    syncNext();
    bind();
    window.scrollTo(0, 0);
  }

  function bind() {
    panes.querySelectorAll('[data-choice]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.choice;
        a[k] = (a[k] === b.dataset.val) ? null : b.dataset.val;
        panes.querySelectorAll('[data-choice="' + k + '"]').forEach(function (o) {
          o.setAttribute('aria-pressed', String(a[k] === o.dataset.val));
        });
        syncNext();
        // avance automático en pasos de una sola elección
        var s = STEPS[i];
        if (a[k] && (s.kind === 'chips' || (s.kind === 'choice' && !s.extra))) setTimeout(go1, 340);
      });
    });

    var on = function (id, fn) { var el = document.getElementById(id); if (el) el.addEventListener('input', fn); };
    on('largo', function (e) { a.largo = e.target.value; syncNext(); });
    on('ancho', function (e) { a.ancho = e.target.value; });
    on('com', function (e) { a.comensales = e.target.value; });
    on('libre', function (e) { a.medidasLibres = e.target.value; syncNext(); });
    on('x', function (e) { a.referencias = e.target.value; });
    on('pres', function (e) { a.presupuesto = e.target.value; if (e.target.value) { a.presupuestoHablar = false; var hb = document.getElementById('hablar'); if (hb) hb.setAttribute('aria-pressed', 'false'); } });
    on('nom', function (e) { a.nombre = e.target.value; syncNext(); });
    on('mail', function (e) { a.email = e.target.value; syncNext(); });
    on('wa', function (e) { a.tel = e.target.value; syncNext(); });

    var hb = document.getElementById('hablar');
    if (hb) hb.addEventListener('click', function () {
      a.presupuestoHablar = !a.presupuestoHablar;
      hb.setAttribute('aria-pressed', String(a.presupuestoHablar));
      if (a.presupuestoHablar) { a.presupuesto = ''; var p = document.getElementById('pres'); if (p) p.value = ''; }
    });
    var ck = document.getElementById('ok');
    if (ck) ck.addEventListener('change', function () { a.consent = ck.checked; syncNext(); });
  }

  function valid() {
    var s = STEPS[i];
    if (!s.required) return true;
    if (s.kind === 'choice' || s.kind === 'chips') return !!a[s.key];
    if (s.kind === 'contacto') {
      return (a.nombre || '').trim().length > 1 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email || '') &&
        (a.tel || '').replace(/\D/g, '').length >= 9 && !!a.consent;
    }
    return true;
  }
  function syncNext() { next.disabled = !valid(); }

  function go1() { if (!valid()) return; if (i === 0) window.ab113 && ab113.track('InitiateCheckout', { content_name: 'cuestionario' }); i++; render(); }
  next.addEventListener('click', go1);
  back.addEventListener('click', function () { if (i > 0) { i--; render(); } });

  /* ---------- Pantalla final ---------- */
  function renderDone() {
    var q = qualify();
    pbar.style.width = '100%';
    foot.style.display = 'none';
    crumbs.innerHTML = STEPS.map(function (s) { return '<span class="done">' + esc(s.label) + '</span>'; }).join('');

    var val = a.presupuesto ? Number(a.presupuesto) : ({ HOT: 3000, WARM: 1500, COLD: 300 })[q.tier];
    window.ab113 && ab113.track('CompleteRegistration', {
      content_name: 'cuestionario_particular', tier: q.tier, pieza: a.pieza || '', espacio: a.espacio || '',
      plazo: a.plazo || '', value: val, currency: 'EUR'
    });
    try { sessionStorage.setItem('ab113_quiz', JSON.stringify({ a: a, tier: q.tier })); } catch (e) {}

    var rows = [
      ['Pieza', a.pieza], ['Espacio', a.espacio],
      ['Medidas', (a.largo && a.ancho) ? a.largo + ' × ' + a.ancho + ' cm' + (a.comensales ? ' · ' + a.comensales + ' comensales' : '') : (a.medidasLibres || '—')],
      ['Estilo', a.estilo], ['Presupuesto', a.presupuesto ? Number(a.presupuesto).toLocaleString('es-ES') + ' €' : (a.presupuestoHablar ? 'Prefiere hablarlo' : '—')],
      ['Plazo', a.plazo], ['Contacto', (a.nombre || '') + ' · ' + (a.tel || '')]
    ];

    panes.innerHTML =
      '<div class="pane on done">' +
      '<div class="tick"><svg viewBox="0 0 24 24"><polyline points="4,12.5 9.5,18 20,6.5"/></svg></div>' +
      '<span class="eyebrow eyebrow--inv">Cuestionario completado</span>' +
      '<h2 style="margin-block:14px 14px">Gracias' + (a.nombre ? ', ' + esc(a.nombre.split(' ')[0]) : '') + '.<br><em>Ya sabemos por dónde empezar.</em></h2>' +
      '<p class="sub" style="margin-inline:auto">Te escribimos por WhatsApp para proponerte una pieza para tu espacio y, si encaja, una visita al taller de Terrassa.</p>' +
      '<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:8px">' +
      '<a class="btn btn--inv" href="https://wa.me/34665521684?text=' + encodeURIComponent('Hola, acabo de completar el cuestionario en la web (' + (a.pieza || 'pieza') + ' para ' + (a.espacio || 'mi espacio') + ').') + '" target="_blank" rel="noopener" id="wabtn">Escribir por WhatsApp ahora <span class="arw">→</span></a>' +
      '<a class="btn btn--ghost" href="/" style="border-color:var(--border-inverse);color:var(--paper-100)">Volver a la web</a></div>' +

      '<div class="peek"><h4>Vista interna — no visible para el usuario final</h4>' +
      '<p style="margin-bottom:16px"><span class="tier ' + q.tier + '">' + q.tier + '</span></p>' +
      '<p style="font-size:13.5px;color:var(--text-inverse-muted);margin-bottom:16px">' + esc(q.note) + '</p>' +
      '<dl>' + rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1] || '—') + '</dd>'; }).join('') + '</dl>' +
      '<p style="font-size:11.5px;color:var(--ink-400);margin-top:16px;line-height:1.6">Este panel es solo para la demo: muestra cómo llega el lead cualificado al CRM y por qué el comercial sabe a quién llamar primero. En producción se envía al CRM y no se muestra.</p>' +
      '<p style="margin-top:14px"><button class="chip" id="again">Empezar de nuevo</button></p>' +
      '</div></div>';

    document.getElementById('again').addEventListener('click', function () { a = {}; i = 0; foot.style.display = ''; render(); });
    document.getElementById('wabtn').addEventListener('click', function () { window.ab113 && ab113.track('Contact', { content_name: 'whatsapp_post_quiz', tier: q.tier }); });
  }

  render();
})();
