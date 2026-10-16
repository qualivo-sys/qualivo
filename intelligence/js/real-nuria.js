/* Cuenta privada de Nuria Roure: /intelligence/?cuenta=nuria
 * Pide su contraseña, lee /api/intelligence-nuria/?accion=tablero (solo con sesión)
 * y monta el sector «sueno» con las inscritas reales al directo del 22 de octubre:
 * mismas pantallas que la demo, más la pantalla «Directo».
 * Solo lectura: no envía mensajes, no llama ni mueve tratos. Sin Copilot con IA
 * (son datos de salud): las preguntas se responden con el motor de la demo.
 * En el código no hay ni un dato real. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor;
  const esc = function (s) { return QV.esc(s); };
  const $ = function (s) { return document.querySelector(s); };
  const API = '/api/intelligence-nuria/';
  const MIN = 60000;
  const PROG = 'Por Fin Duermo';
  let datos = null;

  // ---------------------------------------------------------------------------
  // Acceso
  // ---------------------------------------------------------------------------
  function caja(html) {
    $('#app').hidden = true;
    $('#inicio').hidden = true;
    let el = $('#acceso');
    if (!el) {
      el = document.createElement('section');
      el.id = 'acceso';
      el.className = 'inicio';
      document.body.insertBefore(el, document.body.firstChild);
    }
    el.hidden = false;
    el.innerHTML = '<div class="inicio-caja" style="max-width:420px"><img class="inicio-logo" src="/assets/img/qualivo-logo.png" alt="Qualivo" width="132" height="32">' +
      '<p class="eyebrow">Intelligence System · Nuria Roure</p>' + html + '</div>';
    return el;
  }
  function pantallaClave(mensaje) {
    caja('<h1 style="font-size:26px">Directo del 22 de octubre</h1>' +
      '<form id="formClave" class="inicio-empresa" style="margin-top:8px" autocomplete="on">' +
        '<label for="clave">Contraseña</label>' +
        '<input id="clave" name="password" type="password" autocomplete="current-password" required>' +
        '<p id="claveError" style="color:var(--coral);font-size:13px;min-height:20px;margin-top:8px">' + esc(mensaje || '') + '</p>' +
        '<button class="btn btn-primario btn-grande" type="submit" style="width:100%">Entrar</button>' +
      '</form>' +
      '<p class="inicio-nota">Solo lectura: desde aquí no se envía nada a nadie ni se cambia nada en GHL.</p>');
    $('#clave').focus();
    $('#formClave').addEventListener('submit', function (e) {
      e.preventDefault();
      const b = e.target.querySelector('button');
      b.disabled = true; b.textContent = 'Entrando…';
      fetch(API + '?accion=entrar', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clave: $('#clave').value }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (x) {
          if (!x.ok) { b.disabled = false; b.textContent = 'Entrar'; $('#claveError').textContent = x.d.error || 'No se ha podido entrar.'; return; }
          cargar(false);
        })
        .catch(function () { b.disabled = false; b.textContent = 'Entrar'; $('#claveError').textContent = 'Sin conexión. Prueba otra vez.'; });
    });
  }

  function cargar(fresco) {
    caja('<h1 style="font-size:24px">Leyendo las inscritas…</h1><p class="inicio-nota">Leyendo GHL. La primera vez tarda hasta medio minuto; después se guarda 3 minutos.</p>');
    return fetch(API + '?accion=tablero' + (fresco ? '&fresco=1' : ''), { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) {
        if (r.status === 401) { pantallaClave(); return null; }
        return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; });
      })
      .then(function (d) { return d && QV.cargarSector('sueno').then(function () { montar(d); }); })
      .catch(function (err) { pantallaClave(err.message); });
  }

  // ---------------------------------------------------------------------------
  // Datos de GHL → sector «sueno» con datos reales
  // ---------------------------------------------------------------------------
  function hace(t, ahora) { return t == null ? null : Math.round((ahora - t) / MIN); }
  // Pasos del embudo (api) → etapas del recorrido del sector «sueno»
  const ETAPA = [1, 3, 4, 5, 6];
  const ORIGEN_TXT = { MetaAds: 'Anuncios de Meta', GoogleAds: 'Google', ig: 'Instagram', Instagram_Stories: 'Instagram', 'CRM UI': 'Email a la base', 'Email o directo': 'Email o directo' };
  function origenTxt(o) { return ORIGEN_TXT[o] || o || 'Sin origen'; }

  function aContacto(r, ahora) {
    const s = r.s;
    const conv = r.conv.map(function (m) {
      return [hace(m.t, ahora), m.de, m.canal, m.texto + (m.de !== 'c' && m.estado === 'failed' ? ' (no entregado)' : '')];
    });
    const contesto = r.conv.some(function (m) { return m.de === 'c'; });
    let etapa = ETAPA[r.paso] || 1;
    if (etapa === 1 && contesto) etapa = 2;
    const ev = [];
    if (s.e1) ev.push([hace(r.creado, ahora) - 1, 'sistema', 'Email de plaza confirmada']);
    if (s.w1) ev.push([hace(r.creado, ahora) - 2, 'sistema', 'WhatsApp de bienvenida']);
    if (s.atender) ev.push([0, 'sistema', 'El asistente de WhatsApp la ha pasado al equipo (atender · persona)']);
    if (s.baja) ev.push([0, 'sistema', 'Ha pedido no recibir más WhatsApp']);
    const futura = s.cita && s.cita > ahora - 2 * 3600000;
    const partes = [origenTxt(r.origen)];
    if (s.closer) partes.push('Closer: ' + s.closer);
    if (!s.movil) partes.push('sin móvil');
    return {
      id: r.id, n: r.n, rol: partes.join(' · '), emp: '', seg: 'particular', ciudad: '—', prod: PROG,
      orig: 'o-' + (r.origen || 'sin'), canal: 'wa', etapa: etapa, etapaTxt: r.etapaNombre || '', valor: r.valor || 1795,
      tratoId: r.tratoId, etapaId: r.etapaId, tel: '', email: '', web: '', ghl: r.ghl,
      creado: hace(r.creado, ahora), act: hace(r.conv.length ? r.conv[r.conv.length - 1].t : r.creado, ahora),
      toque: (function () { const n = r.conv.filter(function (m) { return m.de === 'h'; }).slice(-1)[0]; return n ? hace(n.t, ahora) : null; })(),
      fin: r.fin || undefined,
      f: {},
      s: {
        directo: r.paso >= 1, solicitud: r.paso >= 2, sinLlamada: r.paso === 2 && !futura, solMin: hace(r.cambioEtapa, ahora),
        cita: futura ? (s.cita - ahora) / MIN : undefined, citaOk: s.citaEstado === 'confirmed',
        citas: (s.citas || []).map(function (e) { return { m: (e.t - ahora) / MIN, estado: e.estado }; }),
        noshow: s.citaEstado === 'noshow',
        esperaDesde: s.esperaDesde ? hace(s.esperaDesde, ahora) : null,
        atender: s.atender, e1: s.e1, w1: s.w1, baja: s.baja
      },
      conv: conv, ev: ev, llamadas: []
    };
  }

  function embudoDe(lista) {
    const e = {
      anuncio: 0, info: lista.length,
      contactado: lista.filter(function (r) { return r.conv.some(function (m) { return m.de === 'c'; }) || r.paso >= 1; }).length,
      cualificado: lista.filter(function (r) { return r.paso >= 1; }).length,
      solicitud: lista.filter(function (r) { return r.paso >= 2; }).length,
      llamada: lista.filter(function (r) { return r.paso >= 3; }).length,
      alta: lista.filter(function (r) { return r.fin === 'ganado'; }).length
    };
    ['contactado', 'cualificado', 'solicitud', 'llamada', 'alta'].reduce(function (prev, k) { e[k] = Math.min(e[k], e[prev]); return k; }, 'info');
    return e;
  }

  function construir(d) {
    const base = window.QV_SECTORES.sueno;
    const ahora = Date.now();
    const leads = d.contactos;
    const grupos = {};
    leads.forEach(function (r) { const k = r.origen || 'sin'; (grupos[k] = grupos[k] || []).push(r); });
    const campanas = Object.keys(grupos).sort(function (a, b) { return grupos[b].length - grupos[a].length; }).map(function (k) {
      return { id: 'o-' + k, canal: origenTxt(k), nombre: 'Inscritas desde ' + origenTxt(k).toLowerCase(), inversion: 0, ticket: 1795, embudo: embudoDe(grupos[k]) };
    });
    const conCita = leads.filter(function (r) { return r.s.cita; }).length;
    const esperan = function (c) { return c.s.esperaDesde != null && !c.fin; };
    const T = Object.assign({}, base.t, {
      nombreAgenteVoz: 'Laura', agenteVoz: 'Laura (agente de voz)', llamadaVoz: 'Llamada de Laura',
      anunciosIntro: 'Datos reales. Cada fila es un origen de las inscritas al directo del 22 de octubre (según la atribución de GHL) y lo que pasa después: quién viene al directo, quién pide la llamada y quién entra en el programa.',
      notaIntro: 'Datos reales del directo del 22 de octubre, cruzando cada origen con lo que pasa después.'
    });
    const cfg = Object.assign({}, base, {
      id: 'nuriaReal', nombre: 'Nuria Roure · datos reales', real: true, cuenta: 'nuria', _ok: false, vozAuto: false,
      t: T,
      columnasCrm: d.etapasCrm || [],
      historias: null, historiaDefecto: null,
      campanas: campanas,
      mesDatos: { respuestaAntes: 0, respuestaAhora: 0, agendadas: conCita, enDirecto: 0, cierreClosers: [0, 0] },
      contactos: leads.map(function (r) { return aContacto(r, ahora); }),
      vistasExtra: [{ id: 'directo', txt: 'Directo', ico: 'calendario' }],
      vistasOcultas: ['informes', 'agentes'],
      bannerAnuncios: false,
      // Reglas reales: todas las inscritas encajan; sube quien escribe y espera, o lo que pasa al equipo
      reglas: {
        fitBase: 55, soloPropiasRiesgo: true, soloPropiasComp: true,
        fit: [[function (c) { return c.conv.some(function (m) { return m.de === 'c'; }); }, 10, 'ha contestado a los mensajes', 'Ha contestado']],
        comportamiento: [],
        intencion: [
          [function (c) { return c.s.esperaDesde != null && !c.fin; }, 30, 'ha escrito y espera respuesta'],
          [function (c) { return c.s.atender; }, 25, 'el asistente la ha pasado al equipo'],
          [function (c) { return c.s.directo && !c.fin; }, 25, 'vio la clase'],
          [function (c) { return c.s.solicitud && !c.fin; }, 30, 'quiere la llamada'],
          [function (c) { return c.s.cita != null; }, 20, 'tiene la llamada agendada']
        ],
        riesgo: [
          [function (c) { return c.s.esperaDesde != null && c.s.esperaDesde > 120 && !c.fin; }, 70, function (c) { return 'lleva ' + M.duracion(c.s.esperaDesde) + ' esperando respuesta'; }],
          [function (c) { return c.s.atender && !c.fin; }, 60, 'el asistente de WhatsApp la ha pasado al equipo'],
          [function (c) { return c.s.sinLlamada; }, 60, 'quiere la llamada y no tiene hora'],
          [function (c) { return c.s.noshow && !c.fin; }, 55, 'no vino a la llamada']
        ]
      },
      textoAlta: function (c) { return 'Se inscribe al directo del 22 de octubre · ' + (c.rol.split(' · ')[0] || 'origen desconocido'); },
      remedioFuga: Object.assign({}, base.remedioFuga, {
        contactado: 'Email de plaza confirmada y WhatsApp de bienvenida en el minuto uno; recordatorios por email el sábado, el martes y el miércoles, y por WhatsApp el día antes, 2 horas antes y al empezar. Las respuestas las atiende el asistente de WhatsApp y lo delicado pasa al equipo.',
        cualificado: 'Recordatorios a 24 h, 2 h y al empezar, por email y WhatsApp. A quien no se conecta, la grabación el viernes por la mañana con el enlace para pedir la llamada.'
      }),
      kpiCustom: function (m, c2, Mo, est) {
        const cs = (est && est.contactos) || [];
        const esp = cs.filter(esperan).length;
        return {
          cualificados: { l: 'Vieron la clase', v: Mo.num(m.tot.cualificado), em: 'Se marca después del directo' },
          solicitudes: { l: 'Piden la llamada', v: Mo.num(m.tot.solicitud), em: 'Pendientes de agendar o con llamada' },
          entrevistas: { l: 'Llamadas', v: Mo.num(conCita), em: 'Agendadas en el calendario' },
          show: { l: 'Esperan respuesta', v: esp, em: 'Su último mensaje es suyo', clase: esp ? 'mal' : 'bien' },
          carrito: { l: 'Directo', v: 'Jue 22 · 18:00', em: 'Las 3 trampas que te mantienen en el insomnio' },
          respuesta: { l: 'Para el equipo', v: cs.filter(function (c) { return c.s.atender; }).length, em: 'Etiqueta «atender · persona»', clase: 'mal' },
          noahora: { l: 'Bajas de WhatsApp', v: cs.filter(function (c) { return c.s.baja; }).length, em: 'Piden no recibir más mensajes' }
        };
      },
      preguntas: [
        { q: '¿Quién nos ha escrito y espera respuesta?', h: 'lista', obj: ['todo', 'seguimiento', 'conversion'], filtro: esperan, orden: 'prio',
          intro: function (l, T2, Mo) { return Mo.pl(l.length, 'persona ha escrito y su último mensaje sigue sin respuesta', 'personas han escrito y su último mensaje sigue sin respuesta') + '. Contestad desde GHL (botón «Abrir en GHL» en la ficha).'; },
          cols: ['nombre', ['Espera', function (c) { return M.duracion(c.s.esperaDesde); }], 'accion'], vista: 'tabla' },
        { q: '¿Quién tiene que atender el equipo?', h: 'lista', obj: ['todo', 'seguimiento'], filtro: function (c) { return c.s.atender && !c.fin; }, orden: 'prio',
          intro: function (l, T2, Mo) { return Mo.pl(l.length, 'conversación ha pasado', 'conversaciones han pasado') + ' del asistente de WhatsApp al equipo: salud, precio, programa o bajas.'; },
          cols: ['nombre', 'accion'], vista: 'tabla' }
      ].concat(base.preguntas.filter(function (p) { return p.h !== 'campanas'; }))
    });
    cfg.nba = function (c, k, x, T2, Mo) {
      if (c.fin) return Mo.nbaGenerica(c, k, x, T2);
      if (c.s.atender) return { id: 'equipo', accion: 'Contestarle desde GHL', quien: 'Equipo de Nuria', tipo: 'humano', estado: 'humano', por: 'El asistente de WhatsApp le ha pasado la conversación al equipo: pregunta por su caso, el precio, el programa o pide una persona. Se contesta desde GHL.' };
      if (c.s.esperaDesde != null) return { id: 'wa-seguir', accion: 'Contestarle por WhatsApp', quien: 'Equipo de Nuria', tipo: 'humano', estado: 'humano', por: 'Escribió hace ' + Mo.duracion(c.s.esperaDesde) + ' y su último mensaje sigue sin respuesta. Si es una duda práctica, la contesta el asistente; si no, el equipo desde GHL.' };
      if (c.s.noshow) return { id: 'reprogramar', accion: 'Proponerle otra hora para la llamada', quien: T2.Comercial, tipo: 'humano', estado: 'humano', por: 'Tenía la llamada y no vino. Un mensaje con dos huecos nuevos.' };
      if (c.s.cita != null && c.s.cita > 0) return { id: 'esperar', accion: 'Preparar la llamada', quien: T2.Comercial, tipo: 'humano', estado: 'humano', por: 'Llamada ' + Mo.dentroDe(c.s.cita) + (c.s.citaOk ? ', confirmada.' : ', sin confirmar.') + ' Se habla del método, nunca de resultados médicos.' };
      if (c.s.sinLlamada) return { id: 'agendar', accion: 'Agendarle la llamada', quien: T2.Comercial, tipo: 'humano', estado: 'humano', por: 'Quiere la llamada y todavía no tiene hora.' };
      if (c.etapa <= 2) return { id: 'directo', accion: 'Que llegue al directo', quien: 'Recordatorios automáticos', tipo: 'auto', estado: 'vigilando', por: 'Recibe los recordatorios por email' + (c.rol.indexOf('sin móvil') >= 0 ? '' : ' y WhatsApp') + ': el día antes, 2 horas antes y al empezar.' };
      return Mo.nbaGenerica(c, k, x, T2);
    };
    return cfg;
  }

  function montar(d) {
    datos = d;
    window.QV_SECTORES.nuriaReal = construir(d);
    const acc = $('#acceso'); if (acc) acc.hidden = true;
    QV.iniciar({ sector: 'nuriaReal', empresa: 'Nuria Roure', objetivo: 'todo', vista: 'directo' }).then(function () {
      if (d.parcial) QV.aviso('GHL iba lento: algunas conversaciones no se han leído. Actualiza en un minuto.', 'alerta');
    });
  }

  // ---------------------------------------------------------------------------
  // Pantalla «Directo»
  // ---------------------------------------------------------------------------
  function num(n) { return Number(n || 0).toLocaleString('es-ES'); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) + ' %' : '—'; }
  const MADRID = { timeZone: 'Europe/Madrid' };
  function fechaHora(t) {
    const x = new Date(t);
    return x.toLocaleDateString('es-ES', Object.assign({ weekday: 'short', day: 'numeric', month: 'short' }, MADRID)) + ' · ' + x.toLocaleTimeString('es-ES', Object.assign({ hour: '2-digit', minute: '2-digit' }, MADRID));
  }

  function vistaDirecto() {
    const d = datos, r = d.resumen, E = QV.estado;
    const ms = Date.parse(d.directo) - Date.now();
    const falta = ms > 0 ? (Math.floor(ms / 864e5) ? Math.floor(ms / 864e5) + ' d ' : '') + Math.floor(ms % 864e5 / 36e5) + ' h para el directo' : ms > -75 * MIN ? 'En directo ahora' : 'Clase terminada: toca agendar llamadas';
    const esperan = E.contactos.filter(function (c) { return c.s.esperaDesde != null && !c.fin; }).sort(function (a, b) { return b.s.esperaDesde - a.s.esperaDesde; });
    const kpi = function (l, v, em, cl) { return '<div class="kpi' + (cl ? ' ' + cl : '') + '"><span>' + esc(l) + '</span><strong>' + v + '</strong><em>' + (em || '&nbsp;') + '</em></div>'; };
    const maxE = Math.max.apply(null, d.embudo.map(function (p) { return p.personas; }).concat([1]));
    const embudo = d.embudo.map(function (p, i) {
      const ant = i ? d.embudo[i - 1].personas : 0;
      return '<div class="nr-paso"><div>' + esc(p.paso) + (i && ant ? '<small>' + pct(p.personas, ant) + ' del paso anterior</small>' : '') + '</div><div class="nr-pista"><div style="width:' + Math.round(p.personas * 100 / maxE) + '%"></div></div><b>' + num(p.personas) + '</b></div>';
    }).join('');
    const maxD = Math.max.apply(null, d.porDia.map(function (x) { return x.personas; }).concat([1]));
    const dias = d.porDia.slice(-10).map(function (x) {
      const dd = new Date(x.dia + 'T12:00:00Z').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
      return '<div class="nr-dia"><b>' + num(x.personas) + '</b><i style="height:' + Math.round(x.personas * 110 / maxD) + 'px"></i><span>' + esc(dd) + '</span></div>';
    }).join('');
    const citas = (d.citas || []).filter(function (c) { return Date.parse(c.cuando) > Date.now() - 3600000; }).slice(0, 12);
    const fila = function (c, der) { return '<div class="fila" data-abrir="' + c.id + '"><div class="quien-fila">' + QV.avatar(c) + '<div style="min-width:0"><div class="nombre">' + esc(c.n) + '</div><div class="meta">' + esc(c.rol) + '</div></div></div><div class="nba-corta" style="font-weight:500">' + der + '</div>' + QV.pillPrio(c.x.prio) + '</div>'; };
    return QV.cabecera('Directo', 'Las 3 trampas que te mantienen en el insomnio', 'Jueves 22 de octubre, 18:00 h. ' + falta + '.') +
      (r.porAtender ? '<div class="tarjeta" style="border-color:#F3C9B3;background:var(--coral-bg);margin-bottom:14px"><p style="font-weight:700;color:var(--coral)">' + num(r.porAtender) + ' ' + (r.porAtender === 1 ? 'conversación espera' : 'conversaciones esperan') + ' al equipo (etiqueta «atender · persona»).</p></div>' : '') +
      '<div class="kpis nr-kpis">' +
        kpi('Inscritas', num(r.inscritas), num(r.hoy) + ' hoy · ' + num(r.ayer) + ' ayer', 'destacado') +
        kpi('Email de confirmación', num(r.emailConfirmacion), pct(r.emailConfirmacion, r.inscritas) + ' de las inscritas') +
        kpi('WhatsApp de bienvenida', num(r.whatsappBienvenida), num(r.conMovil) + ' con móvil') +
        kpi('Esperan respuesta', num(esperan.length), 'Su último mensaje es suyo', esperan.length ? 'mal' : '') +
        kpi('Ventas', num(r.ventas), r.facturado ? M.euros(r.facturado) : 'todavía no') +
      '</div>' +
      '<div class="rejilla r-2" style="margin-top:14px">' +
        '<div class="tarjeta"><h3>Del registro a la venta</h3>' + embudo + '</div>' +
        '<div class="tarjeta"><h3>Inscripciones por día</h3><div class="nr-dias">' + dias + '</div></div>' +
        '<div class="tarjeta"><h3>Esperan respuesta <span class="sub">las que más llevan, primero</span></h3><div class="lista" style="margin-top:8px">' +
          (esperan.length ? esperan.slice(0, 12).map(function (c) { return fila(c, '<span style="color:var(--coral)">Hace ' + esc(M.duracion(c.s.esperaDesde)) + '</span>'); }).join('') : '<p class="vacio" style="padding:14px">Nadie espera respuesta.</p>') + '</div></div>' +
        '<div class="tarjeta"><h3>Próximas llamadas</h3><div class="lista" style="margin-top:8px">' +
          (citas.length ? citas.map(function (c) { return '<div class="fila"><div class="nombre">' + esc(c.quien) + '</div><div class="nba-corta">' + esc(fechaHora(Date.parse(c.cuando))) + ' · ' + esc(c.closer) + '</div></div>'; }).join('') : '<p class="vacio" style="padding:14px">Todavía no hay llamadas. Se abren después del directo.</p>') + '</div></div>' +
      '</div>' +
      '<p class="gris" style="font-size:12px;margin-top:14px">Datos de GHL · solo lectura · actualizados ' + esc(M.hora(d.generado)) + '. Las personas excluidas de los envíos no aparecen.</p>';
  }

  // Estilos de la pantalla «Directo»
  const css = document.createElement('style');
  css.textContent = '.nr-kpis{grid-template-columns:repeat(5,minmax(0,1fr))}.nr-paso{display:grid;grid-template-columns:150px minmax(0,1fr) 44px;gap:10px;align-items:center;margin:10px 0;font-size:13px}.nr-paso small{display:block;color:var(--gris-2);font-size:11px}.nr-paso b{text-align:right}.nr-pista{height:20px;background:var(--borde-2);border-radius:6px;overflow:hidden}.nr-pista div{height:100%;background:var(--verde-2);border-radius:6px;min-width:2px}.nr-dias{display:flex;align-items:flex-end;gap:6px;height:150px;padding-top:10px}.nr-dia{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0}.nr-dia i{display:block;width:100%;max-width:38px;background:var(--verde);border-radius:5px 5px 0 0;min-height:2px}.nr-dia b{font-size:12px}.nr-dia span{font-size:11px;color:var(--gris-2);white-space:nowrap}@media (max-width:760px){.nr-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.nr-kpis .kpi:last-child{grid-column:1/-1}.nr-paso{grid-template-columns:110px minmax(0,1fr) 40px}}';
  document.head.appendChild(css);

  function pintarBarra() {
    const chip = $('#chipSector');
    if (chip && datos) chip.textContent = 'Nuria Roure · datos reales · ' + M.hora(datos.generado);
    const b = $('#demoBotones');
    if (b) b.innerHTML = '<button class="btn" type="button" data-nuria="salir">Salir</button>';
    const r = $('#btnReiniciar'); if (r) r.title = 'Actualizar los datos';
    const sel = $('#selSector');
    if (sel) sel.innerHTML = '<option value="nuriaReal" selected>Nuria Roure · datos reales</option>';
  }

  document.addEventListener('click', function (e) {
    const s = e.target.closest && e.target.closest('[data-nuria="salir"]');
    if (!s) return;
    fetch(API + '?accion=salir', { method: 'POST', credentials: 'same-origin' }).finally(function () { datos = null; pantallaClave('Has salido.'); });
  });

  QV.VISTA_FN.directo = vistaDirecto;
  QV.cuentas = QV.cuentas || {};
  QV.cuentas.nuria = {
    arrancar: function () { cargar(false); },
    recargar: function () { cargar(true); },
    pintarBarra: pintarBarra
  };
})();
