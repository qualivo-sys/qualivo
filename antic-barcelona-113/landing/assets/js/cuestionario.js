/* Cuestionario de cualificación — Antic Barcelona 113 */
(function () {
  'use strict';

  // Tramos de presupuesto. Son opciones de respuesta, no una tarifa: en la
  // web y en la guía no decimos lo que cuestan sus piezas, y no es este sitio
  // para empezar a decirlo. Con las horquillas reales del taller este paso
  // filtraría todavía mejor.
  var PRESUPUESTOS = [
    'Menos de 1.500 €',
    'Entre 1.500 y 3.000 €',
    'Entre 3.000 y 5.000 €',
    'Más de 5.000 €',
    'Prefiero hablarlo',
  ];

  // De siete pasos a cuatro.
  //
  // Con los datos de la primera semana: de cada 100 personas que empezaban a
  // contestar, 94 se iban antes del final. Siete pantallas son muchas para
  // alguien que acaba de llegar de un anuncio.
  //
  // No se pierde información para puntuar el lead —pieza, espacio, medidas,
  // presupuesto y plazo siguen estando—, solo se juntan en menos pantallas.
  // El estilo sale del cuestionario: no entra en la puntuación y es justo el
  // tipo de cosa que se resuelve mejor hablando por WhatsApp.
  var STEPS = [
    {
      key: 'pieza', label: 'La pieza', title: '¿Qué necesitas?',
      sub: 'Empecemos por lo básico: qué pieza tienes en mente.',
      kind: 'choice', required: true,
      options: [
        { label: 'Mesa', desc: 'Comedor, salón o cocina', img: '/assets/photos/mesa-madera-encaje.jpg' },
        { label: 'Banco', desc: 'A medida del espacio', img: '/assets/photos/banco-artesanal-de-madera.jpg' },
        { label: 'Cajonera', desc: 'Madera maciza', img: '/assets/photos/cajonera-escalonada-madera.jpg' },
        { label: 'Otra pieza', desc: 'Vitrina, estantería, mesa de centro…', img: '/assets/photos/vitrina-madera-masia.jpg' }
      ]
    },
    {
      key: 'medidas', label: 'El espacio', title: '¿Dónde va y qué medidas tiene?',
      sub: 'Aproximadas es suficiente. Las ajustamos contigo.',
      kind: 'medidas', required: false,
      chipsExtra: {
        key: 'espacio', label: '¿En qué estancia?',
        options: ['Salón', 'Comedor', 'Cocina', 'Restaurante', 'Otro espacio']
      }
    },
    {
      key: 'presupuesto', label: 'Presupuesto y plazo', title: '¿En qué horquilla te mueves?',
      sub: 'Una pieza a medida en madera maciza recuperada no juega en la liga del mueble de catálogo. Dinos tu horquilla y te decimos con franqueza si encaja.',
      kind: 'presupuesto', required: false,
      chipsExtra: {
        key: 'plazo', label: '¿Cuándo la necesitas?',
        options: ['Lo antes posible', 'En los próximos 3 meses', 'Más adelante este año', 'Solo estoy explorando']
      }
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
    // Un presupuesto por debajo del suelo del taller no es un lead caliente
    // por muy definido que esté el proyecto. Pilar entró marcada HOT y se cayó
    // por precio después de que el comercial le dedicara una conversación:
    // marcarlo aquí es lo que evita esa llamada.
    if (a.presupuesto === PRESUPUESTOS[0]) {
      return { tier: 'COLD', note: 'El presupuesto queda por debajo de lo que cuesta una pieza a medida. Contestar con franqueza y sin dedicarle una visita.' };
    }
    if (definido && cerca && a.presupuesto) {
      return { tier: 'HOT', note: 'Proyecto definido, presupuesto y plazo cercano. WhatsApp en menos de 2 h y propuesta de visita al taller.' };
    }
    return { tier: 'WARM', note: 'Tiene proyecto pero sigue explorando. Seguimiento a 7 días con proyectos similares.' };
  }

  // ?demo=1 enseña el panel interno. Sin eso, el lead solo ve su pantalla.
  var DEMO = /(\?|&)demo=1(&|$)/.test(location.search);

  /**
   * El mensaje ya escrito con lo que acaba de contestar. Un lead que escribe
   * él mismo convierte mucho mejor que uno que espera a que le llamen, y así
   * quien lo recibe no tiene que preguntar nada para empezar a presupuestar.
   */
  function mensajeWhatsApp(a) {
    var medidas = a.largo && a.ancho ? a.largo + ' × ' + a.ancho + ' cm'
      : (a.medidasLibres || '');
    var trozos = [
      'Hola, acabo de rellenar el cuestionario de la web.',
      '',
      a.pieza ? '· Pieza: ' + a.pieza : '',
      a.espacio ? '· Para: ' + a.espacio : '',
      medidas ? '· Medidas: ' + medidas : '',
      a.comensales ? '· Comensales: ' + a.comensales : '',
      a.presupuesto ? '· Presupuesto: ' + a.presupuesto : '',
      a.plazo ? '· Plazo: ' + a.plazo : '',
      '',
      '¿Me decís qué encaja?',
    ].filter(function (t, k) { return t !== '' || k === 1 || k === 8; });
    return trozos.join('\n');
  }

  /* ---------- Render ---------- */
  function render() {
    if (i >= STEPS.length) return renderDone();
    var s = STEPS[i], h = '';

    h += '<div class="pane on"><h2>' + s.title + '</h2><p class="sub">' + s.sub + '</p>';

    // Salida hacia la guía.
    //
    // Los anuncios ya no llevan a la guía: los nueve leads que trajo no dieron
    // una sola medida y el comercial no podía presupuestarle a ninguno. Pero
    // quien llega y no se ve contestando un cuestionario no tiene por qué
    // perderse del todo: aquí se le ofrece la guía y entra como lead frío,
    // que es lo que de verdad es.
    //
    // No aparece en el último paso: ahí ya está a un campo de convertir y
    // enseñarle una salida sería tirar piedras contra el propio tejado.

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

    // Bloque de opciones que se añade a un paso de otro tipo. Es lo que
    // permite juntar dos preguntas en una pantalla sin duplicar código.
    var chipsExtra = function () {
      if (!s.chipsExtra) return '';
      var x = s.chipsExtra;
      return '<div style="margin-top:30px"><label style="display:block;font-family:var(--font-label);' +
        'font-size:11px;letter-spacing:var(--tracking-label);text-transform:uppercase;' +
        'color:var(--text-inverse-muted);margin-bottom:12px">' + esc(x.label) + '</label>' +
        '<div class="chips">' + x.options.map(function (o) {
          return '<button class="chip" data-choice="' + esc(x.key) + '" data-val="' + esc(o) +
            '" aria-pressed="' + (a[x.key] === o) + '">' + esc(o) + '</button>';
        }).join('') + '</div></div>';
    };

    if (s.kind === 'medidas') {
      h += '<div class="row" style="max-width:640px">' +
        '<div class="field"><label for="largo">Largo (cm)</label><input id="largo" type="number" inputmode="numeric" min="30" max="800" placeholder="240" value="' + esc(a.largo || '') + '"></div>' +
        '<div class="field"><label for="ancho">Ancho (cm)</label><input id="ancho" type="number" inputmode="numeric" min="30" max="400" placeholder="100" value="' + esc(a.ancho || '') + '"></div>' +
        '<div class="field"><label for="com">Comensales</label><input id="com" type="number" inputmode="numeric" min="1" max="40" placeholder="8" value="' + esc(a.comensales || '') + '"></div>' +
        '</div>' +
        '<div class="field" style="max-width:640px"><label for="libre">O descríbelo</label>' +
        '<textarea id="libre" rows="2" placeholder="No sé las medidas: el comedor mide unos 4 metros de largo…">' + esc(a.medidasLibres || '') + '</textarea></div>' +
        chipsExtra();
    }

    if (s.kind === 'presupuesto') {
      // Tramos en vez de una cifra libre. Escribir un número cuesta y casi
      // nadie lo hace; elegir una horquilla es un toque. Y sobre todo: dos de
      // los primeros siete cualificados se cayeron por precio después de que
      // el comercial les dedicara una conversación. Preguntarlo aquí, antes
      // del contacto, deja que se descarte quien no encaja.
      h += '<div class="chips">' + PRESUPUESTOS.map(function (o) {
        return '<button class="chip" data-choice="presupuesto" data-val="' + esc(o) + '" aria-pressed="' +
          (a.presupuesto === o) + '">' + esc(o) + '</button>';
      }).join('') + '</div>' +
        '<p class="hint" style="margin-top:14px;max-width:52ch">Es orientativo. No es un compromiso ni un precio cerrado.</p>' +
        chipsExtra();
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

    if (s.kind !== 'contacto') {
      h += '<p style="margin-top:38px;font-size:13.5px;color:var(--text-inverse-muted);max-width:52ch">' +
        '¿Prefieres informarte primero? ' +
        '<a href="/guia" style="color:var(--oak-400);text-decoration:underline;text-underline-offset:3px" ' +
        'id="salida-guia">Descarga la guía para elegir la pieza</a> y escríbenos cuando lo tengas claro.</p>';
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
        // No se avanza solo si en la misma pantalla queda otra pregunta por
        // contestar: sería llevarse al usuario a mitad de paso.
        if (a[k] && !s.chipsExtra && (s.kind === 'chips' || (s.kind === 'choice' && !s.extra))) setTimeout(go1, 340);
      });
    });

    var on = function (id, fn) { var el = document.getElementById(id); if (el) el.addEventListener('input', fn); };
    on('largo', function (e) { a.largo = e.target.value; syncNext(); });
    on('ancho', function (e) { a.ancho = e.target.value; });
    on('com', function (e) { a.comensales = e.target.value; });
    on('libre', function (e) { a.medidasLibres = e.target.value; syncNext(); });
    on('x', function (e) { a.referencias = e.target.value; });
    on('nom', function (e) { a.nombre = e.target.value; syncNext(); });
    on('mail', function (e) { a.email = e.target.value; syncNext(); });
    on('wa', function (e) { a.tel = e.target.value; syncNext(); });

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

    // Valor que se le pasa al píxel. Del tramo se toma el punto medio: sirve
    // para que Meta compare unos leads con otros, no para facturar.
    var VALOR = { 'Menos de 1.500 €': 1000, 'Entre 1.500 y 3.000 €': 2250,
      'Entre 3.000 y 5.000 €': 4000, 'Más de 5.000 €': 6500 };
    var val = VALOR[a.presupuesto] || ({ HOT: 3000, WARM: 1500, COLD: 300 })[q.tier];
    window.ab113 && ab113.track('CompleteRegistration', {
      content_name: 'cuestionario_particular', tier: q.tier, pieza: a.pieza || '', espacio: a.espacio || '',
      plazo: a.plazo || '', value: val, currency: 'EUR'
    });
    try { sessionStorage.setItem('ab113_quiz', JSON.stringify({ a: a, tier: q.tier })); } catch (e) {}

    // Enviar al CRM. Si falla, se avisa: un lead cualificado perdido es caro.
    window.ab113 && ab113.enviarLead({
      origen: 'cuestionario',
      nombre: a.nombre, email: a.email, telefono: a.tel,
      tier: q.tier, pieza: a.pieza, espacio: a.espacio,
      medidas: (a.largo && a.ancho) ? a.largo + 'x' + a.ancho + ' cm' + (a.comensales ? ' · ' + a.comensales + ' comensales' : '') : (a.medidasLibres || ''),
      presupuesto: a.presupuesto || '',
      plazo: a.plazo, referencias: a.referencias
    }).catch(function () {
      var av = document.getElementById('avisoenvio');
      if (av) av.style.display = 'block';
    });

    var rows = [
      ['Pieza', a.pieza], ['Espacio', a.espacio],
      ['Medidas', (a.largo && a.ancho) ? a.largo + ' × ' + a.ancho + ' cm' + (a.comensales ? ' · ' + a.comensales + ' comensales' : '') : (a.medidasLibres || '—')],
      ['Presupuesto', a.presupuesto || '—'],
      ['Plazo', a.plazo], ['Contacto', (a.nombre || '') + ' · ' + (a.tel || '')]
    ];

    panes.innerHTML =
      '<div class="pane on done">' +
      '<div class="tick"><svg viewBox="0 0 24 24"><polyline points="4,12.5 9.5,18 20,6.5"/></svg></div>' +
      '<span class="eyebrow eyebrow--inv">Cuestionario completado</span>' +
      '<h2 style="margin-block:14px 14px">Gracias' + (a.nombre ? ', ' + esc(a.nombre.split(' ')[0]) : '') + '.<br><em>Ya sabemos por dónde empezar.</em></h2>' +
      '<p class="sub" style="margin-inline:auto">Te escribimos por WhatsApp para proponerte una pieza para tu espacio y, si encaja, una visita al taller de Terrassa.</p>' +
      '<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:8px">' +
      '<a class="btn btn--inv" href="https://wa.me/34665521684?text=' + encodeURIComponent(mensajeWhatsApp(a)) + '" target="_blank" rel="noopener" id="wabtn">Escribir por WhatsApp ahora <span class="arw">→</span></a>' +
      '<a class="btn btn--ghost" href="/" style="border-color:var(--border-inverse);color:var(--paper-100)">Volver a la web</a></div>' +

      '<p id="avisoenvio" style="display:none;background:rgba(180,67,47,.15);border:1px solid rgba(224,138,114,.4);color:#E08A72;padding:12px 16px;border-radius:3px;font-size:13.5px;max-width:52ch;margin:20px auto 0">No hemos podido guardar tus respuestas. Escríbenos por WhatsApp y lo resolvemos al momento.</p>' +
      // Este panel enseña la puntuación y la nota comercial. Servía para
      // enseñar el funnel en una reunión, pero en producción lo estaba viendo
      // el propio lead: el primero que completó el cuestionario leyó que era
      // «HOT» y que había que llamarle en menos de dos horas. Se queda solo
      // con ?demo=1 en la dirección.
      (DEMO ?
      '<div class="peek"><h4>Vista interna — no visible para el usuario final</h4>' +
      '<p style="margin-bottom:16px"><span class="tier ' + q.tier + '">' + q.tier + '</span></p>' +
      '<p style="font-size:13.5px;color:var(--text-inverse-muted);margin-bottom:16px">' + esc(q.note) + '</p>' +
      '<dl>' + rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1] || '—') + '</dd>'; }).join('') + '</dl>' +
      '<p style="font-size:11.5px;color:var(--ink-400);margin-top:16px;line-height:1.6">Este panel es solo para la demo: muestra cómo llega el lead cualificado al CRM y por qué el comercial sabe a quién llamar primero. En producción se envía al CRM y no se muestra.</p>' +
      '<p style="margin-top:14px"><button class="chip" id="again">Empezar de nuevo</button></p>' +
      '</div>' : '') +
      '</div>';

    var again = document.getElementById('again');
    if (again) again.addEventListener('click', function () { a = {}; i = 0; foot.style.display = ''; render(); });
    document.getElementById('wabtn').addEventListener('click', function () { window.ab113 && ab113.track('Contact', { content_name: 'whatsapp_post_quiz', tier: q.tier }); });
  }

  render();
})();
