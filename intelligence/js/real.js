/* Modo real de Qualivo: /intelligence/?sector=qualivo&modo=real
 * Pide la contraseña, lee /api/intelligence-datos/ (solo con sesión) y monta
 * el sector «qualivo» con los datos de verdad: mismo motor, mismas pantallas,
 * más la pantalla «Hoy». En el código no hay ni un dato real. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor, ico = QV.ico;
  const esc = function (s) { return QV.esc(s); };
  const $ = function (s) { return document.querySelector(s); };
  const API = '/api/intelligence-datos/';
  const MIN = 60000;
  let datos = null;

  const INV_TXT = { nada: 'no invierte', menos500: '< 500 €', '500_2000': '500-2.000 €', '2000_5000': '2.000-5.000 €', mas5000: '> 5.000 €' };
  const SECTOR_TXT = { clinica: 'clínica', formacion: 'formación', reformas: 'reformas', asesoria: 'asesoría', otro: 'otro sector' };

  // ---------------------------------------------------------------------------
  // Acceso
  // ---------------------------------------------------------------------------
  function pantallaClave(mensaje) {
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
    el.innerHTML = '<div class="inicio-caja" style="max-width:420px">' +
      '<img class="inicio-logo" src="/assets/img/qualivo-logo.png" alt="Qualivo" width="132" height="32">' +
      '<p class="eyebrow">Intelligence System · datos reales</p>' +
      '<h1 style="font-size:26px">Qualivo, hoy</h1>' +
      '<form id="formClave" class="inicio-empresa" style="margin-top:8px" autocomplete="on">' +
        '<label for="clave">Contraseña</label>' +
        '<input id="clave" name="password" type="password" autocomplete="current-password" required>' +
        '<p id="claveError" style="color:var(--coral);font-size:13px;min-height:20px;margin-top:8px">' + esc(mensaje || '') + '</p>' +
        '<button class="btn btn-primario btn-grande" type="submit" style="width:100%">Entrar</button>' +
      '</form>' +
      '<p class="inicio-nota">Solo lectura: esta pantalla no envía mensajes ni toca el CRM. Sin contraseña, <a href="/intelligence/">la demo</a> sigue igual.</p></div>';
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

  function cargando(txt) {
    let el = $('#acceso');
    if (!el) { pantallaClave(); el = $('#acceso'); }
    el.hidden = false;
    $('#app').hidden = true;
    el.innerHTML = '<div class="inicio-caja" style="max-width:420px"><img class="inicio-logo" src="/assets/img/qualivo-logo.png" alt="Qualivo" width="132" height="32">' +
      '<p class="eyebrow">Intelligence System · datos reales</p><h1 style="font-size:24px">' + esc(txt) + '</h1><p class="inicio-nota">Leyendo GHL y Meta. La primera vez tarda unos segundos; después se guarda 5 minutos.</p></div>';
  }

  function cargar(fresco) {
    cargando('Leyendo los datos de hoy…');
    return fetch(API + (fresco ? '?fresco=1' : ''), { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) {
        if (r.status === 401) { pantallaClave(); return null; }
        return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; });
      })
      .then(function (d) { return d && QV.cargarSector('qualivo').then(function () { montar(d); }); })
      .catch(function (err) { pantallaClave(err.message); });
  }

  // ---------------------------------------------------------------------------
  // Datos de GHL → sector «qualivo» con datos reales
  // ---------------------------------------------------------------------------
  function hace(t, ahora) { return t == null ? null : Math.round((ahora - t) / MIN); }

  function aContacto(r, ahora) {
    const s = r.s;
    const conv = r.conv.map(function (m) {
      const extra = m.de !== 'c' && m.estado ? (m.estado === 'failed' ? ' (no entregado)' : '') : '';
      return [hace(m.t, ahora), m.de, m.canal, m.texto + extra];
    });
    const ev = [];
    // La llamada de Raquel, tal cual la dicen las etiquetas (sin duración ni resumen: GHL no los guarda)
    const llamadas = [];
    if (s.voz1 && s.vozCuando) {
      const res = s.vozRes === 'completada' ? (s.agendado ? 'agendo' : 'hablo') : s.vozRes ? 'nocontesta' : null;
      if (res) llamadas.push([hace(s.vozCuando, ahora), 0, res, s.vozRes === 'completada' ? 'Llamada completada' + (s.agendado ? '; tiene la reunión reservada.' : '.') : s.vozRes === 'fallo' ? 'La llamada falló.' : 'No cogió.', []]);
      else ev.push([hace(s.vozCuando, ahora), 'sistema', 'Llamada de Raquel programada']);
    }
    if (s.wa1Fallido) ev.push([hace(r.creado, ahora) - 1, 'sistema', 'Primer WhatsApp fallido']);
    if (s.manualWa) ev.push([hace(r.creado, ahora) - 2, 'sistema', 'WhatsApp a mano (Maikel)']);
    if (s.manualVoz) ev.push([hace(r.creado, ahora) - 3, 'sistema', 'Llamada a mano (Maikel)']);
    const partes = [];
    if (r.f.nivel) partes.push('Nivel ' + r.f.nivel);
    if (r.f.sector) partes.push(SECTOR_TXT[r.f.sector] || r.f.sector);
    if (r.f.inv) partes.push(INV_TXT[r.f.inv]);
    return {
      id: r.id, n: r.n, rol: partes.join(' · '), emp: r.emp, seg: 'lead', ciudad: r.ciudad, prod: r.origen,
      orig: r.campana || 'otros', canal: r.canal, etapa: r.etapa, etapaTxt: r.etapaNombre || '', valor: r.valor || 0,
      creado: hace(r.creado, ahora), act: hace(r.act, ahora), toque: r.toque ? hace(r.toque, ahora) : null,
      fin: r.fin || undefined,
      f: { inv: r.f.inv, vol: r.f.vol, sector: r.f.sector, fuga: r.f.fuga, nivel: r.f.nivel, potente: r.f.potente },
      s: {
        raquel: s.raquel, noshow: s.noshow, intentos: s.intentos, luego: s.luego ? 'su momento' : '', luegoTxt: s.luego ? 'lo retomaría más adelante' : '',
        cita: s.cita ? (s.cita - ahora) / MIN : undefined, citaOk: s.citaOk,
        // lo que usa la pantalla Hoy
        wa1: s.wa1, wa1Fallido: s.wa1Fallido, wa2: s.wa2, voz1: s.voz1, vozRes: s.vozRes, manualWa: s.manualWa, manualVoz: s.manualVoz,
        agendado: s.agendado, actFin: s.actFin, primeraRespuestaMin: s.primeraRespuestaMin, esperaDesde: s.esperaDesde ? hace(s.esperaDesde, ahora) : null
      },
      conv: conv, ev: ev, llamadas: llamadas
    };
  }

  function mediana(l) {
    const v = l.filter(function (x) { return x != null; }).sort(function (a, b) { return a - b; });
    return v.length ? v[Math.floor(v.length / 2)] : null;
  }

  function embudoDe(lista) {
    const e = {
      anuncio: 0,
      formulario: lista.length,
      contactado: lista.filter(function (r) { return r.conv.some(function (m) { return m.de === 'c'; }); }).length,
      diagnostico: lista.filter(function (r) { return r.etapa >= 3 || r.s.cita || r.s.agendado; }).length,
      asiste: lista.filter(function (r) { return r.etapa >= 4; }).length,
      plan: lista.filter(function (r) { return r.etapa >= 5; }).length,
      cliente: lista.filter(function (r) { return r.fin === 'ganado'; }).length
    };
    // Que ningún paso tenga más que el anterior
    ['contactado', 'diagnostico', 'asiste', 'plan', 'cliente'].reduce(function (prev, k) { e[k] = Math.min(e[k], e[prev]); return k; }, 'formulario');
    return e;
  }

  function construir(d) {
    const base = window.QV_SECTORES.qualivo;
    const ahora = Date.now();
    const leads = d.contactos;
    // Campañas: las de Meta si la atribución de GHL permite cruzarlas; si no, una fila con todo
    const asignados = leads.filter(function (r) { return r.campana; }).length;
    let campanas;
    const gasto = (d.campanas || []).reduce(function (a, c) { return a + c.gasto; }, 0);
    const clics = (d.campanas || []).reduce(function (a, c) { return a + c.clics; }, 0);
    if (d.campanas && d.campanas.length && asignados >= leads.length * 0.5) {
      campanas = d.campanas.map(function (c) {
        const e = embudoDe(leads.filter(function (r) { return r.campana === c.id; }));
        e.anuncio = c.clics;
        return { id: c.id, canal: 'Meta', nombre: c.nombre, inversion: Math.round(c.gasto), ticket: base.ticket, embudo: e };
      });
      const resto = leads.filter(function (r) { return !r.campana; });
      if (resto.length) campanas.push({ id: 'otros', canal: 'CRM', nombre: 'Sin campaña identificada', inversion: 0, ticket: base.ticket, embudo: embudoDe(resto) });
    } else {
      const e = embudoDe(leads);
      e.anuncio = clics;
      campanas = [{ id: 'otros', canal: 'Meta', nombre: d.campanas && d.campanas.length ? 'Meta · todas las campañas QV (' + d.campanas.length + ')' : 'Leads de anuncios (sin datos de Meta)', inversion: Math.round(gasto), ticket: base.ticket, embudo: e }];
    }
    const resp = mediana(leads.map(function (r) { return r.s.primeraRespuestaMin; }));
    const cfg = Object.assign({}, base, {
      id: 'qualivoReal', nombre: 'Qualivo · datos reales', real: true, _ok: false, vozAuto: false,
      historias: null, historiaDefecto: null,
      campanas: campanas,
      mesDatos: { respuestaAntes: resp || 0, respuestaAhora: resp || 0, agendadas: embudoDe(leads).diagnostico },
      contactos: leads.map(function (r) { return aContacto(r, ahora); }),
      vistasExtra: [{ id: 'hoy', txt: 'Hoy', ico: 'calendario' }],
      timelineSinOrigen: true,
      textoAlta: function (c) { return 'Entra · ' + c.prod; },
      kpiCustom: function (m, c2, Mo, est) {
        const cs = (est && est.contactos) || [];
        const n = { A: 0, B: 0, C: 0, D: 0 };
        cs.forEach(function (c) { if (n[c.f.nivel] != null) n[c.f.nivel]++; });
        return {
          respuesta: { l: 'Primera respuesta (mediana)', v: resp != null ? M.duracionLarga(resp) : '—', em: 'Desde que entra hasta nuestro primer mensaje', clase: resp != null && resp > 60 ? 'mal' : 'bien' },
          niveles: { l: 'Niveles A · B · C · D', v: n.A + ' · ' + n.B + ' · ' + n.C + ' · ' + n.D, em: 'Etiquetas de la puntuación', clase: 'bien' },
          show: { l: 'Plantones', v: cs.filter(function (c) { return c.s.noshow; }).length, em: 'Citas a las que no vinieron', clase: 'mal' }
        };
      },
      preguntas: [
        { q: '¿A quién me toca escribir hoy?', h: 'lista', obj: ['todo', 'ventas'], filtro: teToca, orden: 'prio',
          intro: function (l, T, Mo) { return Mo.pl(l.length, 'oportunidad potente o de nivel A/B sigue', 'oportunidades potentes o de nivel A/B siguen') + ' sin cita. ' + (datos.pausa ? 'Con las automatizaciones en pausa, todo esto es a mano.' : ''); },
          cols: ['nombre', ['Nivel', function (c) { return c.f.nivel || '—'; }], 'accion'], vista: 'tabla' },
        { q: '¿Quién ha contestado y espera respuesta nuestra?', h: 'lista', obj: ['todo', 'seguimiento'], filtro: function (c) { return c.s.esperaDesde != null && !c.fin; }, orden: 'prio',
          intro: function (l, T, Mo) { return Mo.pl(l.length, 'persona espera', 'personas esperan') + ' respuesta nuestra. ' + Mo.pl(l.filter(function (c) { return c.s.esperaDesde > 1440; }).length, 'lleva', 'llevan') + ' más de 24 horas.'; },
          cols: ['nombre', ['Espera', function (c) { return QV.motor.duracion(c.s.esperaDesde); }], 'accion'], vista: 'tabla' }
      ].concat(base.preguntas)
    });
    // Con la pausa puesta, lo que haría un agente lo hace Maikel a mano
    const nbaBase = base.nba;
    cfg.nba = function (c, k, x, T, Mo) {
      const r = (nbaBase && nbaBase(c, k, x, T, Mo)) || Mo.nbaGenerica(c, k, x, T);
      if (!d.pausa || ['agente', 'voz', 'auto'].indexOf(r.tipo) < 0 || r.estado === 'cerrado' && r.id !== 'cerrar') return r;
      const aMano = { wa: 'Escribirle por WhatsApp', 'wa-seguir': 'Contestarle por WhatsApp', voz: 'Llamarle', reenganche: 'Retomar la conversación', reprogramar: 'Proponerle otra hora', recordatorio: 'Recordarle la cita', propuesta: 'Recuperar el plan', caso: 'Mandarle un caso parecido', cerrar: 'Contestar y cerrar' }[r.id];
      if (!aMano) return r;
      const motivo = String(r.por).split(/\.\s/)[0].replace(/\.$/, '');
      return Object.assign({}, r, { accion: aMano, quien: 'Maikel', tipo: 'humano', estado: 'humano', por: motivo + '. Las automatizaciones están en pausa: lo haces tú a mano.' });
    };
    return cfg;
  }

  function teToca(c) {
    return (c.f.potente || c.f.nivel === 'A' || c.f.nivel === 'B') && !c.s.tCita && !c.s.actFin && !c.fin;
  }

  function montar(d) {
    datos = d;
    const cfg = construir(d);
    window.QV_SECTORES.qualivoReal = cfg;
    const acc = $('#acceso'); if (acc) acc.hidden = true;
    QV.iniciar({ sector: 'qualivoReal', empresa: 'Qualivo', objetivo: 'todo', vista: 'hoy' }).then(function () {
      if (d.avisos && d.avisos.length) QV.aviso(d.avisos[0], 'alerta');
    });
  }

  // ---------------------------------------------------------------------------
  // Pantalla «Hoy»
  // ---------------------------------------------------------------------------
  function diaDe(ms) { const x = new Date(ms); return x.getFullYear() + '-' + x.getMonth() + '-' + x.getDate(); }
  function lunes(ahora) {
    const x = new Date(ahora); const dd = x.getDay();
    x.setDate(x.getDate() + ((8 - dd) % 7 || 7));
    return diaDe(x.getTime());
  }
  const ESTADO_MSG = { read: 'leído', delivered: 'entregado', sent: 'enviado', failed: 'no entregado', pending: 'pendiente', completed: 'completada', 'no-answer': 'sin respuesta', busy: 'ocupado' };

  function fila(c, derecha, sub) {
    return '<div class="fila" data-abrir="' + c.id + '"><div class="quien-fila">' + QV.avatar(c) + '<div style="min-width:0"><div class="nombre">' + esc(c.n) + '</div><div class="meta">' + esc(sub || QV.metaContacto(c)) + '</div></div></div>' +
      '<div class="nba-corta" style="font-weight:500">' + derecha + '</div>' + QV.pillPrio(c.x.prio) + '</div>';
  }
  function bloque(titulo, sub, filas, vacio) {
    return '<div class="tarjeta"><h3>' + esc(titulo) + ' <span class="sub">' + esc(sub) + '</span></h3><div class="lista" style="margin-top:8px">' +
      (filas.length ? filas.join('') : '<p class="vacio" style="padding:14px">' + esc(vacio) + '</p>') + '</div></div>';
  }

  function vistaHoy() {
    const E = QV.estado, ahora = E.ahora;
    const cs = E.contactos;
    const hoy = diaDe(ahora), ayer = diaDe(ahora - 86400000), lun = lunes(ahora);
    const entradosHoy = cs.filter(function (c) { return diaDe(c.tCreado) === hoy; });
    const entradosAyer = cs.filter(function (c) { return diaDe(c.tCreado) === ayer; });
    const h48 = ahora - 48 * 3600000;
    // Lo que hemos hecho (48 h): mensajes nuestros y llamadas
    const hecho = cs.map(function (c) {
      const nuestros = c.conv.filter(function (m) { return m.de !== 'c' && m.t >= h48; });
      if (!nuestros.length) return null;
      const u = nuestros[nuestros.length - 1];
      const canal = u.canal === 'voz' ? 'Llamada' : u.canal === 'email' ? 'Correo' : 'WhatsApp';
      const quien = u.de === 'h' ? 'a mano' : u.de === 'v' ? 'Raquel' : 'agente';
      const est = (u.texto.match(/\(no entregado\)$/) ? 'no entregado' : '') || (c.s.vozRes && u.canal === 'voz' ? c.s.vozRes : '');
      return { c: c, t: u.t, txt: nuestros.length + ' · ' + canal + ' (' + quien + ')' + (est ? ' · ' + est : ''), mal: /no entregado|fallo|sin respuesta/.test(est) };
    }).filter(Boolean).sort(function (a, b) { return b.t - a.t; });
    const contestaron = cs.map(function (c) {
      const suyos = c.conv.filter(function (m) { return m.de === 'c' && m.t >= h48; });
      return suyos.length ? { c: c, m: suyos[suyos.length - 1] } : null;
    }).filter(Boolean).sort(function (a, b) { return b.m.t - a.m.t; });
    const citasHoy = cs.filter(function (c) { return c.s.tCita && diaDe(c.s.tCita) === hoy; }).sort(function (a, b) { return a.s.tCita - b.s.tCita; });
    const citasLunes = cs.filter(function (c) { return c.s.tCita && diaDe(c.s.tCita) === lun; }).sort(function (a, b) { return a.s.tCita - b.s.tCita; });
    const esperan = cs.filter(function (c) { return c.s.esperaDesde != null && c.s.esperaDesde >= 1440 && !c.fin; }).sort(function (a, b) { return b.s.esperaDesde - a.s.esperaDesde; });
    const toca = cs.filter(teToca).sort(function (a, b) { return b.x.orden - a.x.orden; });

    const actividad = function (c) {
      const p = [];
      if (c.s.wa1Fallido) p.push('WhatsApp 1 fallido'); else if (c.s.wa1) p.push('WhatsApp 1 enviado');
      if (c.s.manualWa) p.push('WhatsApp a mano');
      if (c.s.wa2) p.push('WhatsApp 2');
      if (c.s.voz1) p.push('Raquel' + (c.s.vozRes ? ': ' + c.s.vozRes : ''));
      if (c.s.manualVoz) p.push('llamada a mano');
      if (!p.length) p.push(c.s.actFin ? 'cadencia cerrada' : 'nadie le ha escrito');
      return p.join(' · ');
    };

    const stat = function (vista, l, v, em, color) { return '<button class="hoy-dato" type="button" data-hoyir="' + vista + '"><span>' + l + '</span><strong' + (color ? ' style="color:' + color + '"' : '') + '>' + v + '</strong><em>' + em + '</em></button>'; };
    return (datos.pausa ? '<div class="tarjeta" style="border-color:#F3C9B3;background:var(--coral-bg);margin-bottom:14px;display:flex;gap:10px;align-items:center">' + ico('alerta') + '<p style="font-weight:700;color:var(--coral)">Automatizaciones en pausa: todo lo que sale lo hace Maikel a mano.</p></div>' : '') +
      (datos.parcial ? '<p class="gris" style="font-size:12.5px;margin-bottom:10px">GHL iba lento: algunas conversaciones no se han leído en esta pasada. Pulsa actualizar en un minuto.</p>' : '') +
      '<div class="hoy" style="grid-template-columns:repeat(4,minmax(0,1fr))">' +
        stat('entrados', 'Entrados hoy', entradosHoy.length, 'Ayer: ' + entradosAyer.length) +
        stat('contestaron', 'Han contestado (48 h)', contestaron.length, esperan.length + ' esperan más de 24 h', esperan.length ? 'var(--coral)' : '') +
        stat('citas', 'Citas hoy', citasHoy.length, 'El lunes: ' + citasLunes.length) +
        stat('toca', 'Te toca a ti', toca.length, 'Potentes o nivel A/B sin cita', 'var(--coral)') +
      '</div>' +
      '<div class="rejilla r-2" style="margin-top:14px">' +
        '<div id="hoy-toca">' + bloque('Te toca a ti', 'Potentes o nivel A/B sin cita', toca.slice(0, 12).map(function (c) { return fila(c, ico(QV.icoAccion(c.x.nba.tipo)) + '<span>' + esc(c.x.nba.accion) + '</span>'); }), 'Nadie potente sin cita. Bien.') + '</div>' +
        '<div id="hoy-entrados">' + bloque('Entrados hoy y ayer', entradosHoy.length + ' hoy · ' + entradosAyer.length + ' ayer', entradosHoy.concat(entradosAyer).map(function (c) { return fila(c, '<span>' + esc(actividad(c)) + '</span>', QV.metaContacto(c) + ' · ' + M.fechaCorta(c.tCreado, ahora)); }), 'Hoy y ayer no ha entrado nadie.') + '</div>' +
        '<div id="hoy-hecho">' + bloque('A quién se ha escrito o llamado', 'Últimas 48 horas', hecho.slice(0, 14).map(function (h) { return fila(h.c, '<span' + (h.mal ? ' style="color:var(--coral)"' : '') + '>' + esc(h.txt) + '</span>', M.fechaCorta(h.t, ahora)); }), 'En 48 horas no ha salido nada.') + '</div>' +
        '<div id="hoy-contestaron">' + bloque('Quién ha contestado', 'Últimas 48 horas', contestaron.slice(0, 14).map(function (x) { return fila(x.c, '<span>«' + esc(x.m.texto.slice(0, 70)) + (x.m.texto.length > 70 ? '…' : '') + '»</span>', M.hace(M.desde(x.m.t, ahora))); }), 'Nadie ha contestado en 48 horas.') + '</div>' +
        '<div id="hoy-citas">' + bloque('Citas de hoy y del lunes', citasHoy.length + ' hoy · ' + citasLunes.length + ' el lunes', citasHoy.concat(citasLunes).map(function (c) { return fila(c, '<span>' + (diaDe(c.s.tCita) === hoy ? 'Hoy ' : 'Lunes ') + M.hora(c.s.tCita) + (c.s.citaOk ? ' · confirmada' : '') + '</span>'); }), 'Sin citas hoy ni el lunes.') + '</div>' +
        '<div id="hoy-esperan">' + bloque('Más de 24 h sin respuesta nuestra', 'Contestaron y el último mensaje es suyo', esperan.map(function (c) { return fila(c, '<span style="color:var(--coral)">Espera desde hace ' + M.duracion(c.s.esperaDesde) + '</span>'); }), 'Nadie espera más de 24 horas.') + '</div>' +
      '</div>';
  }

  function pintarBarra() {
    const chip = $('#chipSector');
    if (chip && datos) chip.textContent = 'Datos reales · ' + M.hora(datos.generado) + (datos.cacheSegundos > 60 ? ' (guardados hace ' + Math.round(datos.cacheSegundos / 60) + ' min)' : '');
    const b = $('#demoBotones');
    if (b) b.innerHTML = '<button class="btn" type="button" data-real="salir">Salir</button>';
    const r = $('#btnReiniciar'); if (r) r.title = 'Actualizar los datos';
    const sel = $('#selSector');
    if (sel) sel.innerHTML = '<option value="qualivoReal" selected>Qualivo · datos reales</option>' + QV.SECTORES.map(function (s) { return '<option value="' + s.id + '">' + esc(s.txt) + ' (demo)</option>'; }).join('');
  }

  document.addEventListener('click', function (e) {
    const s = e.target.closest('[data-real="salir"]');
    if (s) {
      fetch(API + '?accion=salir', { method: 'POST', credentials: 'same-origin' }).finally(function () { datos = null; pantallaClave('Has salido.'); });
      return;
    }
    const h = e.target.closest('[data-hoyir]');
    if (h) { const el = document.getElementById('hoy-' + h.dataset.hoyir); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  QV.VISTA_FN.hoy = vistaHoy;
  QV.real = {
    arrancar: function () { cargar(false); },
    recargar: function () { cargar(true); },
    pintarBarra: pintarBarra,
    activo: function () { return !!(QV.estado.cfg && QV.estado.cfg.real); }
  };
})();
