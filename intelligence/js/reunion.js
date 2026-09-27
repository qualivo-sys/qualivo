/* Qualivo Intelligence · agente de reuniones
 * Antes: documento de preparación (quién es, qué ha dicho, cómo abrir, qué
 * preguntar, objeciones probables, qué ofrecer y qué conseguir).
 * Después: dos líneas de la persona → resumen para el CRM, etapa, tareas con
 * fecha y mensaje de seguimiento redactado.
 * Sale todo de la ficha, la conversación y las señales del mismo estado: no
 * hay nada escrito a mano por contacto, así que funciona en todos los sectores. */
(function () {
  'use strict';
  const QV = window.QV;
  const M = QV.motor;
  const $ = function (s) { return document.querySelector(s); };
  const esc = function (s) { return QV.esc(s); };
  const cap = function (s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  const corto = function (s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); n = n || 110; return s.length > n ? s.slice(0, n - 1).replace(/[ ,.;:]+\S*$/, '') + '…' : s; };
  const sinArt = function (s) { return String(s || '').replace(/^(la|el|los|las) /, ''); };
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function diaHabil(desde, n) {
    const d = new Date(desde);
    let k = 0;
    while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) k++; }
    return DIAS[d.getDay()] + ' ' + d.getDate();
  }
  function decide(c) { return /director|directora|ceo|gerente|fundador|fundadora|socio|socia|dueñ|propietari|president|head|vp|responsable/i.test(c.rol || ''); }
  function contacto(id) { return QV.contacto(id); }
  function empresaCliente() { return (QV.estado.empresa || '').trim(); }

  // ---------------------------------------------------------------------------
  // Antes de la reunión
  // ---------------------------------------------------------------------------
  function preparar(c) {
    const E = QV.estado, cfg = E.cfg, T = cfg.t, x = c.x, s = c.s || {};
    const nombre = c.n.split(' ')[0];
    const camp = cfg.campana(c.orig);
    const suyos = c.conv.filter(function (m) { return m.de === 'c'; });
    const ult = suyos[suyos.length - 1];
    const fitPos = x.fitM.filter(function (m) { return m.pts > 0; }).slice(0, 3).map(function (m) { return m.txt; });
    const intPos = x.intM.filter(function (m) { return m.pts > 0; }).slice(0, 3).map(function (m) { return m.txt; });
    const riesgos = x.riesgoM.filter(function (m) { return m.pts >= 10; }).slice(0, 2).map(function (m) { return m.txt; });
    const emp = empresaCliente();

    const quien = [c.rol, c.emp, c.tam ? c.tam + ' ' + (T.empleados || 'empleados') : '', c.ciudad && c.ciudad !== '—' ? c.ciudad : ''].filter(Boolean).join(' · ');
    const resumen = cfg.real
      ? cap(quien || c.n) + '. Llegó por ' + (camp ? camp.canal + ' («' + camp.nombre + '»)' : (c.prod || 'la web')) + (c.valor ? '. Trato de ' + M.euros(c.valor) : '') + '.'
      : cap(quien || c.n) + '. Le interesa ' + (c.prod ? '«' + c.prod + '»' : T.producto) + (c.valor ? ', ' + M.euros(c.valor) : '') + '. Llegó por ' + (camp ? camp.canal + ' («' + camp.nombre + '»)' : 'la web') + '.';

    const apertura = ult
      ? '«' + nombre + ', antes de nada: me dijiste que «' + corto(ult.texto, 90) + '». ¿Sigue siendo lo más importante para ti?»'
      : '«' + nombre + ', antes de empezar: ¿qué te hizo pedir ' + T.laCita + '? ¿Qué te gustaría llevarte de hoy?»';
    const presentacion = '«Te cuento en 20 segundos cómo trabajamos' + (emp ? ' en ' + emp : '') + ': ' + (c.prod ? 'con «' + c.prod + '» ' : '') + 'buscamos que salgas sabiendo exactamente qué te conviene y qué no. Si al final tiene sentido, te digo cómo seguimos; si no, te lo digo igual.»';

    const preguntas = [];
    if (s.urg && s.urgTxt) preguntas.push('Me dijiste que ' + s.urgTxt + ': ¿qué pasa si no llega a tiempo?');
    else preguntas.push('¿Para cuándo lo necesitarías?');
    if (!decide(c)) preguntas.push('¿Quién más participa en la decisión? ¿Qué le va a preguntar?');
    if (s.ppto === 'si' || s.pptoTxt) preguntas.push('Comentaste que ' + (s.pptoTxt || 'tenéis presupuesto') + ': ¿en qué rango lo tenéis pensado?');
    else preguntas.push('¿Tenéis un presupuesto pensado para esto?');
    if (s.precio) preguntas.push('Has mirado precios: ¿con qué lo estás comparando?');
    preguntas.push('¿Qué habéis probado ya y qué no funcionó?');

    const objeciones = [];
    if (s.precio) objeciones.push(['«Es caro»', 'Compáralo con lo que le cuesta no hacerlo, no con otra oferta. Si el problema es el momento, se mueve la fecha, no el precio.']);
    if (s.luego) objeciones.push(['«Ahora no es el momento»', 'Dijo que ' + (s.luegoTxt || 'lo vería más adelante') + '. Pregunta qué tendría que pasar para que lo fuera y deja una fecha concreta.']);
    if (s.tProp != null && s.propVista >= 2 && x.k.toque > 2880) objeciones.push(['«Lo estoy pensando»', 'Ha abierto ' + sinArt(T.propuesta) + ' ' + s.propVista + ' veces sin contestar: algo le frena. Pregunta: «¿es por si funciona, por el precio o por el momento?»']);
    if (s.noshow) objeciones.push(['No se presentó la otra vez', 'Confírmale una hora antes por su canal y empieza sin reproches: «me alegro de que hayamos encontrado el hueco».']);
    riesgos.forEach(function (r) { objeciones.push(['Riesgo', cap(r) + '.']); });
    if (!objeciones.length) objeciones.push(['«Lo tengo que pensar»', '«Claro. Para ayudarte a pensarlo: ¿es por si funciona, por el precio o por el momento?» Cada una tiene su respuesta.']);

    const tienePropuesta = s.tProp != null;
    const objetivo = c.fin === 'ganado'
      ? (s.exp ? 'Ampliación: ' + (s.expTxt || 'lo que ha pedido') + (s.expValor ? ' (' + M.euros(s.expValor) + ')' : '') + '. Salir con una propuesta y una fecha.' : 'Revisar cómo va y pedir una recomendación.')
      : tienePropuesta ? 'Resolver lo que le frena y salir con una **decisión con fecha** (' + T.verbo + ').'
        : 'Salir con **' + T.propuesta + ' acordada** y una fecha para decidir. Nunca «ya me dices».';

    const lista = function (arr) { return '<ul class="rd-lista">' + arr.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; };
    const md = function (t) { return esc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); };

    return '' +
      '<div class="rd-aviso">' + QV.ico('auto') + '<span>Documento generado por el <b>agente de reuniones</b> con la ficha, la conversación y las señales. Le llega ' + esc(M.al(T.comercial)) + ' la víspera y 30 minutos antes.</span></div>' +
      '<div><p class="bloque-t">En 20 segundos</p><div class="porque-caja">' + esc(resumen) + (x.porque ? '<br><br>' + esc(x.porque) : '') + '</div></div>' +
      (suyos.length ? '<div><p class="bloque-t">Lo que ha dicho, con sus palabras</p>' + suyos.slice(-3).map(function (m) { return '<blockquote class="rd-cita">«' + esc(corto(m.texto, 220)) + '»<small>' + esc(M.fechaCorta(m.t, E.ahora)) + ' · ' + (m.canal === 'email' ? 'correo' : m.canal === 'voz' ? 'llamada' : 'WhatsApp') + '</small></blockquote>'; }).join('') + '</div>' : '') +
      '<div><p class="bloque-t">Por qué es una buena oportunidad</p>' + lista(fitPos.concat(intPos).map(cap).slice(0, 5).concat(fitPos.length + intPos.length ? [] : ['Encaje ' + x.fit + ' e intención ' + x.int + ' sobre 100.'])) + '</div>' +
      '<div><p class="bloque-t">Cómo abrir</p><div class="nba-caja"><p><b>Romper el hielo:</b> ' + esc(apertura) + '</p><p style="margin-top:8px"><b>Presentación:</b> ' + esc(presentacion) + '</p><p style="margin-top:8px"><b>Después, calla y escucha.</b> Lo que conteste es lo que le vas a ofrecer.</p></div></div>' +
      '<div><p class="bloque-t">Qué preguntar</p>' + lista(preguntas.slice(0, 4)) + '</div>' +
      '<div><p class="bloque-t">Objeciones probables</p>' + objeciones.slice(0, 3).map(function (o) { return '<div class="rd-obj"><b>' + esc(o[0]) + '</b><p>' + esc(o[1]) + '</p></div>'; }).join('') + '</div>' +
      '<div><p class="bloque-t">Qué ofrecer</p><div class="porque-caja">' + (cfg.real
        ? 'Diagnóstico en vivo con sus números, demo de su sector y, si encaja, arranque con fecha: implantación y primer mes, y después desde 750 €/mes, sin permanencia. Caso para citar: EAC (10,2×, 44.000 € en un mes) o Nuria Roure (6,45×).'
        : esc(cap(c.prod || T.producto)) + (c.valor ? ' · ' + M.euros(c.valor) : '') + '. Si pregunta por resultados, ' + esc(T.casoExito || 'un caso parecido') + '.') + '</div></div>' +
      '<div><p class="bloque-t">Qué tienes que conseguir</p><div class="nba-caja humano rd-meta">' + QV.ico('diana') + '<p>' + md(objetivo) + '</p></div></div>' +
      '<div class="rd-despues" id="rdDespues"><p class="bloque-t">Después de la reunión</p>' +
        '<p class="gris" style="font-size:13px;margin-bottom:8px">Escribe dos líneas. El agente actualiza la ficha, la etapa y las tareas, y te deja el mensaje de seguimiento redactado.</p>' +
        '<textarea id="rdNotas" rows="3">' + esc(tienePropuesta
          ? 'Le encaja, pero quiere comentarlo con su socio. Decide la semana que viene.'
          : 'Le encaja. Quiere empezar el mes que viene y pide ' + T.propuesta + ' con dos opciones.') + '</textarea>' +
        '<div class="pie" style="margin-top:8px;display:flex;gap:8px"><span style="flex:1"></span><button class="btn btn-primario btn-mini" type="button" data-reunion-despues="' + c.id + '">Actualizar todo</button></div>' +
        '<div id="rdResultado"></div>' +
      '</div>';
  }

  function abrir(id) {
    const c = contacto(id);
    if (!c) return;
    const T = QV.estado.cfg.t;
    QV.abrirFicha(id);
    $('#ficha').innerHTML =
      '<div class="ficha-cab"><div class="l1">' + QV.avatar(c) + '<div><h2>Preparar la reunión</h2><div class="meta" style="font-size:13px">' + esc(c.n) + ' · ' + esc(QV.metaContacto(c)) + '</div></div>' + QV.pillPrio(c.x.prio) +
        '<button class="btn btn-icono" type="button" data-cerrar-ficha aria-label="Cerrar">' + QV.ico('cerrar') + '</button></div>' +
        '<div class="datos"><span><button class="btn btn-mini" type="button" data-abrir="' + c.id + '">← Ficha completa</button></span>' +
        (c.s && c.s.tCita != null && c.x.k.cita > 0 ? '<span>' + esc(T.Cita) + ': <b>' + esc(M.dentroDe(c.x.k.cita)) + '</b></span>' : '') +
        '<span>Encaje <b>' + c.x.fit + '</b></span><span>Intención <b>' + c.x.int + '</b></span><span>Riesgo <b>' + c.x.riesgo + '</b></span></div></div>' +
      '<div class="ficha-cuerpo doc-reunion">' + preparar(c) + '</div>';
  }

  // ---------------------------------------------------------------------------
  // Después de la reunión
  // ---------------------------------------------------------------------------
  function despues(id) {
    const c = contacto(id);
    if (!c) return;
    const E = QV.estado, T = E.cfg.t;
    const nombre = c.n.split(' ')[0];
    const notas = ($('#rdNotas') && $('#rdNotas').value.trim()) || '';
    const n = notas.toLowerCase();
    const socio = /socio|socia|jefe|direcci|comit|consejo|junta|mi mujer|mi marido|pareja/.test(n);
    const noAhora = /no es el momento|más adelante|mas adelante|después de|en enero|en febrero|no le encaja|no encaja/.test(n);
    const opciones = /opcion|opción|dos propuestas|alternativa/.test(n);
    const hoy = new Date(E.ahora);
    const etapa = noAhora ? 'Más adelante' : socio ? T.Propuesta + ' · decide con otra persona' : T.Propuesta;
    const tareas = noAhora
      ? [['Retomar con lo que dijo', diaHabil(hoy, 20)], ['Correo con un caso parecido', diaHabil(hoy, 7)]]
      : [['Enviar ' + T.propuesta + (opciones ? ' con dos opciones' : ''), 'hoy'], ['Seguimiento si no contesta', diaHabil(hoy, 3)], [socio ? 'Llamada de 20 minutos con quien decide' : 'Decisión con fecha', diaHabil(hoy, 5)]];
    const mensaje = noAhora
      ? 'Hola ' + nombre + ', gracias por el rato de hoy. Me quedo con lo que me dijiste y te escribo el ' + diaHabil(hoy, 20) + ', como quedamos. Si antes te surge algo, aquí estoy.'
      : 'Hola ' + nombre + ', gracias por el rato de hoy. Como hablamos, te envío ' + T.propuesta + (opciones ? ' con las dos opciones' : '') + ' hoy mismo.' + (socio ? ' Si te ayuda, lo vemos 20 minutos con quien tenga que decidirlo contigo.' : '') + ' ¿Te va bien que lo comentemos el ' + diaHabil(hoy, socio ? 5 : 3) + '?';

    c.asignado = T.Comercial;
    E.feed.push({ t: E.ahora, ico: 'persona', tono: 't-coral', titulo: 'Reunión resumida por el agente', quien: c.n, id: c.id, detalle: 'Etapa: ' + etapa + ' · ' + tareas.length + ' tareas con fecha · mensaje de seguimiento listo', nuevo: true });
    $('#rdResultado').innerHTML =
      '<div class="rd-hecho">' +
        '<p class="bloque-t" style="margin-top:12px">Hecho en 4 segundos</p>' +
        '<div class="rd-obj"><b>Resumen en la ficha</b><p>' + esc(cap(notas || 'Reunión celebrada.')) + ' Prioridad ' + esc(String(c.x.prio || '').toLowerCase()) + (c.valor ? ', ' + M.euros(c.valor) : '') + '.</p></div>' +
        '<div class="rd-obj"><b>Etapa</b><p>' + esc(etapa) + '</p></div>' +
        '<div class="rd-obj"><b>Tareas</b><ul class="rd-lista">' + tareas.map(function (t) { return '<li>' + esc(t[0]) + ' · <b>' + esc(t[1]) + '</b></li>'; }).join('') + '</ul></div>' +
        '<div class="rd-obj"><b>Mensaje de seguimiento, listo para enviar</b><p class="rd-msg">' + esc(mensaje) + '</p></div>' +
        '<p class="gris" style="font-size:12px">Si no contesta, el agente lo retoma en la fecha con su contexto. Nada sale sin que lo apruebes.</p>' +
      '</div>';
    if (QV.aviso) QV.aviso('Ficha, etapa y tareas actualizadas · mensaje listo', 'persona');
    if (QV.pintarNav) QV.pintarNav();
  }

  document.addEventListener('click', function (e) {
    const a = e.target.closest('[data-reunion]');
    if (a) { e.preventDefault(); e.stopPropagation(); if ($('#humano')) $('#humano').hidden = true; abrir(a.dataset.reunion); return; }
    const d = e.target.closest('[data-reunion-despues]');
    if (d) { e.preventDefault(); despues(d.dataset.reunionDespues); }
  }, true);

  QV.reunion = { abrir: abrir, despues: despues, preparar: preparar };
})();
