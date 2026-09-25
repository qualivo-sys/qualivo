/* Qualivo Copilot
 * Capa 1: preguntas sugeridas → respuestas calculadas del estado, al instante y sin red.
 * Capa 2: preguntas libres → /api/intelligence-copilot (Claude con herramientas sobre
 *         el mismo estado). Si tarda más de 9 s o falla, contesta la capa 1 con la
 *         pregunta sugerida más parecida, sin avisar. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor, ico = QV.ico, esc = QV.esc;
  const $ = function (s) { return document.querySelector(s); };
  const E = function () { return QV.estado; };
  const TIEMPO_MAX = 9000;

  // ---------------------------------------------------------------------------
  // Preguntas universales (el texto usa los términos del sector)
  // ---------------------------------------------------------------------------
  function universales(T) {
    return [
      { q: '¿Qué debería trabajar hoy?', h: 'trabajar', obj: ['todo', 'conversion', 'ventas', 'seguimiento'] },
      { q: '¿Dónde estamos perdiendo oportunidades?', h: 'fugas', obj: ['todo', 'captacion', 'conversion'] },
      { q: '¿Qué ' + T.contactos + ' necesitan atención?', h: 'atencion', obj: ['todo', 'seguimiento'] },
      { q: '¿Qué oportunidades llevan demasiado tiempo sin seguimiento?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué ha cambiado esta semana?', h: 'cambios', obj: ['todo'] },
      { q: '¿Qué campañas están trayendo ' + (T.clientesReales || 'clientes reales') + '?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Dónde está la mayor fuga?', h: 'mayorFuga', obj: ['todo', 'captacion', 'conversion'] },
      { q: '¿Qué debería hacer el equipo hoy?', h: 'equipo', obj: ['todo', 'ventas'] },
      { q: '¿Qué anuncio trae ' + (T.recorrido || T).ventas + ' y cuál solo trae ' + (T.recorrido || T).contactos + '?', h: 'anuncios', obj: ['captacion', 'ventas', 'todo'] },
      { q: T.preguntaNota || '¿Qué le diríamos esta semana a la agencia de anuncios?', h: 'agencia', obj: ['captacion', 'todo'] }
    ];
  }
  function todas() {
    const cfg = E().cfg;
    const sec = (cfg.preguntas || []).map(function (p) { return Object.assign({ sector: true }, p); });
    const uni = universales(cfg.t).filter(function (u) { return !sec.some(function (s) { return s.h === u.h && !s.filtro; }); });
    return uni.concat(sec);
  }
  // Orden de las sugeridas: primero las del objetivo elegido, alternando sector y universales.
  function sugeridas() {
    const obj = E().objetivo || 'todo';
    const cfg = E().cfg;
    const sec = cfg.preguntas || [];
    const uni = universales(cfg.t).filter(function (u) { return !sec.some(function (s) { return s.h === u.h && !s.filtro; }); });
    const peso = function (p) { return (p.obj || []).indexOf(obj) >= 0 ? 0 : 1; };
    const a = uni.slice().sort(function (x, y) { return peso(x) - peso(y); });
    const b = sec.slice().sort(function (x, y) { return peso(x) - peso(y); });
    const out = [a[0]];
    let i = 1, j = 0;
    while (out.length < a.length + b.length) {
      if (j < b.length) out.push(b[j++]);
      if (i < a.length) out.push(a[i++]);
    }
    return out.filter(Boolean);
  }

  // ---------------------------------------------------------------------------
  // Bloques de respuesta
  // ---------------------------------------------------------------------------
  function probabilidad(c) {
    const x = c.x;
    return Math.max(3, Math.min(92, Math.round(0.5 * x.int + 0.3 * x.fit + 0.2 * x.comp - 0.35 * x.riesgo)));
  }
  QV.probabilidad = probabilidad;

  function texto(md) { return { tipo: 'texto', md: md }; }
  function tarjetas(lista, max) { return { tipo: 'contactos', ids: lista.slice(0, max || 3).map(function (c) { return c.id; }) }; }
  function metricas(items) { return { tipo: 'metrica', items: items }; }
  function accion(txt) { return { tipo: 'accion', texto: txt }; }
  function tablaContactos(lista, cols) {
    return { tipo: 'tabla', cols: cols.map(function (c) { return c[0]; }), filas: lista.map(function (c) { return { id: c.id, celdas: cols.map(function (k) { return k[1](c); }) }; }) };
  }
  const col = {
    nombre: ['Nombre', function (c) { return c.n; }],
    prio: ['Prioridad', function (c) { return { pill: c.x.prio }; }],
    valor: ['Valor', function (c) { return M.euros(c.valor); }],
    etapa: ['Etapa', function (c) { return c.etapaTxt || E().cfg.etapaTxt(c.etapa); }],
    accion: ['Siguiente acción', function (c) { return c.x.nba.accion; }],
    prob: ['Prob.', function (c) { return probabilidad(c) + ' %'; }],
    sinSeg: ['Sin seguimiento', function (c) { return M.duracion(c.x.k.toque); }],
    cuando: ['Cuándo', function (c) { return c.s.luego || '—'; }],
    intencion: ['Intención', function (c) { return c.x.int; }],
    riesgo: ['Riesgo', function (c) { return c.x.riesgo; }]
  };

  function abiertos() { return E().contactos.filter(function (c) { return !c.fin; }); }
  function suma(lista) { return lista.reduce(function (a, c) { return a + (c.valor || 0); }, 0); }
  function plural(n, s, p) { return M.pl(n, s, p); }

  // ---------------------------------------------------------------------------
  // Manejadores deterministas
  // ---------------------------------------------------------------------------
  const H = {
    trabajar: function () {
      const T = E().cfg.t;
      const at = QV.atencion();
      if (!at.length) return [texto('Hoy no hay nada que requiera atención. El sistema sigue vigilando y te avisa en cuanto cambie algo.')];
      const hum = at.filter(function (c) { return c.x.nba.tipo === 'humano'; });
      const resto = at.length - Math.min(3, at.length);
      const tipos = {};
      at.slice(3).forEach(function (c) { tipos[c.x.nba.quien] = (tipos[c.x.nba.quien] || 0) + 1; });
      const reparto = Object.keys(tipos).map(function (k) { return tipos[k] + ' con ' + k.toLowerCase(); });
      return [
        texto('Hay **' + plural(at.length, T.oportunidades.replace(/s$/, ''), T.oportunidades) + ' que requieren atención** (' + M.euros(suma(at)) + ' en juego). Yo empezaría por estas 3.'),
        tarjetas(at, 3),
        texto(resto > 0 ? 'Las otras ' + resto + ' ya las está moviendo el sistema: ' + M.unir(reparto) + '. ' + (hum.length ? 'De todas, **' + hum.length + ' necesitan a una persona** hoy.' : '') : (hum.length ? '**' + hum.length + ' necesitan a una persona** hoy.' : ''))
      ];
    },

    atencion: function () {
      const T = E().cfg.t;
      const at = QV.atencion();
      return [
        texto('**' + at.length + ' ' + T.oportunidades + '** requieren atención ahora. Suman ' + M.euros(suma(at)) + '. Arriba lo más prioritario; la última columna dice qué va a pasar y quién lo hace.'),
        tablaContactos(at, [col.nombre, col.prio, col.valor, col.accion])
      ];
    },

    sinSeguimiento: function () {
      const T = E().cfg.t;
      const l = abiertos().filter(function (c) { return M.contesto(c) > 0 && c.x.k.toque > 2880 && !c.s.luego && c.x.fit >= 40; }).sort(function (a, b) { return b.x.k.toque - a.x.k.toque; });
      if (!l.length) return [texto('Ninguna. Todas las conversaciones abiertas tienen un siguiente paso con fecha.')];
      return [
        texto('**' + plural(l.length, T.contacto, T.contactos) + '** contestaron y llevan más de 2 días sin que nadie les escriba. Suman ' + M.euros(suma(l)) + '. Es la fuga más barata de arreglar: ya mostraron interés.'),
        tablaContactos(l, [col.nombre, col.sinSeg, col.valor, col.accion]),
        accion('El agente de seguimiento puede retomar hoy las ' + l.filter(function (c) { return c.x.nba.tipo === 'agente'; }).length + ' que no necesitan a una persona, cada una con su contexto.')
      ];
    },

    fugas: function () {
      const cfg = E().cfg, T = QV.TA(), m = M.mes(cfg);
      const fg = M.fugas(cfg);
      const f = fg[0];
      const nombres = cfg.nombresFuga || {};
      const hoy = abiertos();
      const sinSeg = hoy.filter(function (c) { return M.contesto(c) > 0 && c.x.k.toque > 2880 && !c.s.luego && c.x.fit >= 40; });
      const sinResp = hoy.filter(function (c) { return M.contesto(c) === 0 && !c.fin && (c.s.intentos || 0) < 3 && c.x.fit >= 40; });
      const props = hoy.filter(function (c) { return c.s.tProp != null && c.x.k.toque > 2880; });
      const nos = hoy.filter(function (c) { return c.s.noshow; });
      const primera = cfg.recorrido[1].id;
      const out = [
        texto('Donde más se pierde es en **' + ((nombres[f.a.id] || {}).txt || f.a.txt).toLowerCase() + '**: de ' + M.num(m.tot[f.de.id]) + ' ' + (f.de.id === primera ? T.contactos : 'que llegan a «' + f.de.txt.toLowerCase() + '»') + ' en 30 días, solo ' + M.num(m.tot[f.a.id]) + ' pasan a «' + f.a.txt.toLowerCase() + '» (' + M.pct(f.conv) + '). Con un seguimiento bien hecho pasa el ' + M.pct(f.ref) + '.'),
        metricas([{ v: '+' + M.num(f.recuperables), l: T.contactos + ' recuperables al mes', c: 'malo' }, { v: M.pct(f.conv), l: 'pasan hoy', c: '' }, { v: M.pct(f.ref), l: 'con seguimiento', c: 'bueno' }]),
        { tipo: 'tabla', cols: ['Fuga', 'Hoy', 'Bien hecho', 'Recuperables'], filas: fg.map(function (x) { return { celdas: [((nombres[x.a.id] || {}).txt || x.a.txt), M.pct(x.conv), M.pct(x.ref), x.recuperables > 0 ? '+' + M.num(x.recuperables) : '—'] }; }) }
      ];
      const hoyTxt = [];
      if (sinResp.length) hoyTxt.push(sinResp.length + ' sin responder todavía');
      if (sinSeg.length) hoyTxt.push(sinSeg.length + ' sin seguimiento después de contestar');
      if (props.length) hoyTxt.push(props.length + ' ' + (T.propuestas || 'propuestas') + ' sin respuesta (' + M.euros(suma(props)) + ')');
      if (nos.length) hoyTxt.push(nos.length + ' que no se presentaron');
      if (hoyTxt.length) out.push(texto('Hoy mismo, en el sistema: ' + M.unir(hoyTxt) + '.'));
      out.push(accion('Lo primero que taparía: ' + ((nombres[f.a.id] || {}).exp || 'este salto') + '. Es donde un agente rinde antes.'));
      return out;
    },

    mayorFuga: function () {
      const cfg = E().cfg, T = QV.TA(), m = M.mes(cfg);
      const f = M.fugas(cfg)[0];
      const n = (cfg.nombresFuga || {})[f.a.id] || { txt: f.a.txt, exp: '' };
      // Cuántas ventas más, si el resto del recorrido convierte igual que hoy
      const r = cfg.recorrido;
      let tasa = 1;
      for (let i = r.findIndex(function (e) { return e.id === f.a.id; }) + 1; i < r.length; i++) {
        if (r[i].sinFuga) break;
        tasa *= (m.tot[r[i].id] || 0) / Math.max(1, m.tot[r[i - 1].id]);
        if (r[i].id === cfg.ventaEtapa) break;
      }
      const ventas = Math.round(f.recuperables * tasa);
      const ticket = m.ingresos / Math.max(1, m.tot[cfg.ventaEtapa]);
      return [
        texto('La mayor fuga es **' + n.txt.toLowerCase() + '**: ' + n.exp + '. Solo pasa el ' + M.pct(f.conv) + ' de «' + f.de.txt.toLowerCase() + '» a «' + f.a.txt.toLowerCase() + '», cuando lo normal con buen seguimiento es el ' + M.pct(f.ref) + '.'),
        metricas([{ v: '+' + M.num(f.recuperables), l: T.contactos + ' al mes', c: 'malo' }, { v: '≈ ' + M.num(ventas), l: T.ventas + ' más al mes', c: 'bueno' }, { v: '≈ ' + M.euros(ventas * ticket), l: 'al mes, al ticket medio', c: 'bueno' }]),
        texto('Cálculo: los ' + M.num(f.recuperables) + ' que faltan, convirtiendo en el resto del recorrido igual que hoy. No hace falta comprar ni un anuncio más.'),
        accion((cfg.remedioFuga && cfg.remedioFuga[f.a.id]) || 'Respuesta en el minuto uno por WhatsApp, llamada de la agente de voz si no contesta y aviso a una persona cuando hay intención.')
      ];
    },

    cambios: function () {
      const est = E(), T = est.cfg.t, sem = 7 * 1440;
      const nuevos = est.contactos.filter(function (c) { return c.x.k.creado < sem; });
      const sen = []; est.contactos.forEach(function (c) { c.x.senales.forEach(function (s) { if (M.desde(s.t, est.ahora) < sem) sen.push({ s: s, c: c }); }); });
      const porTipo = {}; sen.forEach(function (x) { porTipo[x.s.tipo] = (porTipo[x.s.tipo] || 0) + 1; });
      const subida = est.contactos.filter(function (c) { return !c.fin && c.x.int >= 60 && c.x.k.act < 2 * 1440; }).sort(function (a, b) { return b.x.int - a.x.int; });
      const citas = est.contactos.filter(function (c) { return c.s.tCita != null && c.s.tCita > est.ahora; });
      const ganados = est.contactos.filter(function (c) { return c.fin === 'ganado' && c.x.k.act < sem; });
      return [
        texto('Esta semana han entrado **' + plural(nuevos.length, T.contacto, T.contactos) + ' ' + (nuevos.length === 1 ? (T.nuevos === 'nuevas' ? 'nueva' : 'nuevo') : (T.nuevos || 'nuevos')) + '** y el sistema ha detectado **' + plural(sen.length, 'señal', 'señales') + '**. Lo más importante: ' + (subida.length ? (subida.length === 1 ? '1 ha subido' : subida.length + ' han subido') + ' de intención en los últimos 2 días' : 'nada ha subido de intención') + '.'),
        metricas(Object.keys(porTipo).map(function (k) { return { v: porTipo[k], l: M.TIPOS_SENAL[k].txt }; }).slice(0, 4)),
        subida.length ? tarjetas(subida, 2) : null,
        texto(citas.length + ' ' + T.cita + 's agendadas por delante' + (ganados.length ? ' y ' + ganados.length + ' ' + T.clientes + ' que han vuelto a moverse (' + M.unir(ganados.map(function (c) { return c.n.split(' ')[0]; })) + ')' : '') + '.')
      ].filter(Boolean);
    },

    campanas: function () {
      const cfg = E().cfg, T = QV.TA();
      const filas = cfg.campanas.map(function (c) {
        const v = c.embudo[cfg.ventaEtapa] || 0, entra = c.embudo[cfg.recorrido[1].id] || 0;
        const ing = v * (c.ticket || cfg.ticket);
        return { c: c, v: v, entra: entra, ing: ing, cpv: c.inversion ? c.inversion / Math.max(1, v) : null, roas: c.inversion ? ing / c.inversion : null };
      });
      const pago = filas.filter(function (f) { return f.c.inversion > 0; });
      const masEntra = pago.slice().sort(function (a, b) { return b.entra - a.entra; })[0];
      const mejor = pago.slice().sort(function (a, b) { return b.roas - a.roas; })[0];
      const peor = pago.slice().sort(function (a, b) { return a.roas - b.roas; })[0];
      const out = [
        texto('La que más ' + T.contactos + ' trae no es la que más vende. **' + masEntra.c.nombre + '** trae ' + plural(masEntra.entra, T.contacto, T.contactos) + ' y ' + plural(masEntra.v, T.venta, T.ventas) + '. **' + mejor.c.nombre + '** es la que más devuelve: ' + M.num(mejor.roas, 1) + '× lo invertido.'),
        { tipo: 'tabla', cols: ['Campaña', T.Contactos, T.Ventas, 'Coste por ' + T.venta, 'Retorno'], filas: filas.sort(function (a, b) { return (b.roas || 0) - (a.roas || 0); }).map(function (f) { return { celdas: [f.c.canal + ' · ' + f.c.nombre, f.entra, f.v, f.cpv ? M.euros(f.cpv) : 'orgánico', f.roas ? M.num(f.roas, 1) + '×' : '—'] }; }) }
      ];
      if (peor !== mejor) out.push(accion('Movería presupuesto de «' + peor.c.nombre + '» (' + M.num(peor.roas, 1) + '×) a «' + mejor.c.nombre + '». Se optimiza a ' + T.venta + ' real, no a ' + T.contacto + ' barato.'));
      return out;
    },

    anuncios: function () {
      const T = QV.TA(), a = QV.anuncios();
      const pago = a.filas.filter(function (f) { return f.c.inversion > 0; });
      const mejor = pago.slice().sort(function (x, y) { return y.roas - x.roas; })[0];
      const masEntra = pago.slice().sort(function (x, y) { return y.entra - x.entra; })[0];
      return [
        texto('**' + masEntra.c.nombre + '** es la que más ' + T.contactos + ' trae (' + M.num(masEntra.entra) + ', a ' + M.euros(masEntra.cpl) + ') y deja ' + plural(masEntra.ventas, T.venta, T.ventas) + '. **' + mejor.c.nombre + '** trae menos y devuelve ' + M.num(mejor.roas, 1) + '× lo invertido.'),
        { tipo: 'tabla', cols: ['Campaña', T.Ventas, 'Retorno', 'Veredicto'], filas: pago.sort(function (x, y) { return y.roas - x.roas; }).map(function (f) { return { celdas: [f.c.nombre, M.num(f.ventas), M.num(f.roas, 1) + '×', f.ver.txt] }; }) },
        accion('El sistema no toca las campañas: le devuelve a la agencia qué anuncio acaba en ' + T.venta + ', para que optimice a eso.')
      ];
    },

    agencia: function () {
      return [
        texto(E().cfg.t.notaIntro || 'Esto es lo que le diría esta semana a quien os lleva los anuncios. Sale de unir cada campaña con lo que pasa después en el sistema.'),
        { tipo: 'borrador', texto: QV.notaAgencia().map(function (l) { return '• ' + l; }).join('\n') },
        accion('La agencia sigue llevando las campañas. Recibe mejores datos y cada semana una nota como esta.')
      ];
    },

    equipo: function () {
      const est = E(), T = est.cfg.t;
      const hum = est.contactos.filter(function (c) { return c.x.nba.tipo === 'humano' && c.x.nba.id !== 'asignado'; }).sort(function (a, b) { return b.x.orden - a.x.orden; });
      const solos = est.contactos.filter(function (c) { return ['agente', 'voz', 'auto'].indexOf(c.x.nba.tipo) >= 0 && c.x.nba.estado !== 'cerrado'; });
      const porQuien = {}; solos.forEach(function (c) { porQuien[c.x.nba.quien] = (porQuien[c.x.nba.quien] || 0) + 1; });
      return [
        texto('El equipo solo tiene que hacer **' + plural(hum.length, 'cosa', 'cosas') + '** hoy. Todo lo demás (' + solos.length + ' acciones) lo hace el sistema.'),
        tablaContactos(hum, [col.nombre, ['Qué hacer', function (c) { return c.x.nba.accion; }], col.valor]),
        metricas(Object.keys(porQuien).map(function (k) { return { v: porQuien[k], l: k }; })),
        accion('Cada aviso le llega ' + M.al(T.comercial) + ' con el resumen de la conversación, el porqué y lo que ya se le ha dicho. Nadie empieza de cero.')
      ];
    },

    probables: function () {
      const T = E().cfg.t;
      const l = abiertos().filter(function (c) { return c.x.fit >= 40; }).sort(function (a, b) { return probabilidad(b) - probabilidad(a); });
      return [
        texto('Quién tiene más probabilidad de ' + (T.verbo || 'comprar') + ' ahora mismo. La probabilidad combina intención, encaje y actividad, y resta el riesgo.'),
        tarjetas(l, 3),
        tablaContactos(l.slice(3, 8), [col.nombre, col.prob, col.etapa, col.accion])
      ];
    },

    lista: function (p) {
      const T = E().cfg.t;
      let l = E().contactos.filter(p.filtro);
      const orden = { prob: function (a, b) { return probabilidad(b) - probabilidad(a); }, valor: function (a, b) { return b.valor - a.valor; }, riesgo: function (a, b) { return b.x.riesgo - a.x.riesgo; }, toque: function (a, b) { return b.x.k.toque - a.x.k.toque; }, prio: function (a, b) { return b.x.orden - a.x.orden; } }[p.orden || 'prio'];
      l.sort(orden);
      if (!l.length) return [texto(p.vacio || 'Ahora mismo no hay ninguno.')];
      const out = [texto(p.intro(l, T, M))];
      if (p.vista === 'cards') out.push(tarjetas(l, p.max || 3));
      else out.push(tablaContactos(l, p.cols ? p.cols.map(function (k) { return typeof k === 'string' ? col[k] : k; }) : [col.nombre, p.suma ? col.valor : col.cuando, col.prio, col.accion]));
      if (p.cierre) out.push(accion(typeof p.cierre === 'function' ? p.cierre(l, T, M) : p.cierre));
      return out;
    }
  };

  function responderDet(p) {
    const f = H[p.h];
    if (!f) return [texto('No tengo esa respuesta preparada.')];
    try { return f(p); } catch (e) { console.error(e); return H.trabajar(); }
  }

  // ---------------------------------------------------------------------------
  // Pintado de bloques
  // ---------------------------------------------------------------------------
  function md(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function tarjetaContacto(c) {
    const T = E().cfg.t, x = c.x, us = QV.ultimaSenal(c);
    const humano = x.nba.tipo === 'humano';
    return '<div class="ccard"><div class="cab"><span class="etiq-sm">' + QV.pillPrio(x.prio) + '</span><span class="cifras"><span>ENCAJE <b>' + x.fit + '</b></span>' + (c.fin === 'ganado' ? '<span>RIESGO <b>' + x.riesgo + '</b></span>' : '<span>INTENCIÓN <b>' + x.int + '</b></span>') + '</span></div>' +
      '<div><div class="nombre">' + esc(c.n) + '</div><div class="meta">' + esc(QV.metaContacto(c)) + '</div></div>' +
      '<div class="linea">Última señal: <b>' + esc(us.txt) + '</b> · ' + M.hace(M.desde(us.t, E().ahora)) + '</div>' +
      '<div class="porque"><span class="etiq-sm">Por qué · </span>' + esc(x.porque.replace(/^Prioridad \w+ porque /, '').replace(/^./, function (z) { return z.toUpperCase(); })) + '</div>' +
      '<div class="nba' + (humano ? ' humano' : '') + '"><small>Siguiente mejor acción</small><b>' + esc(x.nba.accion) + '</b> · ' + esc(x.nba.quien) + '</div>' +
      '<div class="botones"><button class="btn btn-mini" data-abrir="' + c.id + '">Ver ficha</button><button class="btn btn-mini" data-timeline="' + c.id + '">Línea de tiempo</button><button class="btn btn-mini" data-generar="' + c.id + '">Generar mensaje</button>' +
      (!c.fin && x.nba.id !== 'asignado' ? '<button class="btn btn-mini btn-primario" data-asignar="' + c.id + '">Asignar ' + esc(M.al(T.comercial)) + '</button>' : '') + '</div></div>';
  }
  function pintarBloques(bloques) {
    return bloques.map(function (b) {
      if (!b) return '';
      if (b.tipo === 'texto') return '<div class="msg-texto">' + md(b.md) + '</div>';
      if (b.tipo === 'contactos') return (b.ids || []).map(function (id) { const c = QV.contacto(id); return c ? tarjetaContacto(c) : ''; }).join('');
      if (b.tipo === 'metrica') return '<div class="metricas">' + (b.items || []).map(function (m) { return '<div class="metrica ' + (m.c || '') + '"><strong>' + esc(m.v) + '</strong><span>' + esc(m.l) + '</span></div>'; }).join('') + '</div>';
      if (b.tipo === 'accion') return '<div class="accion-sug">' + ico('rayo') + '<p>' + md(b.texto) + '</p></div>';
      if (b.tipo === 'borrador') return '<div class="borrador">' + esc(b.texto) + '</div>';
      if (b.tipo === 'tabla') {
        return '<div class="tabla-caja"><table class="tabla"><thead><tr>' + b.cols.map(function (c, i) { return '<th' + (i ? ' class="num"' : '') + '>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          (b.filas || []).map(function (f) {
            return '<tr' + (f.id ? ' class="clic" data-abrir="' + f.id + '"' : '') + '>' + f.celdas.map(function (v, i) {
              const cont = v && v.pill ? QV.pillPrio(v.pill) : esc(v);
              return '<td' + (i ? ' class="num"' : ' style="font-weight:600"') + '>' + cont + '</td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>';
      }
      return '';
    }).join('');
  }

  // ---------------------------------------------------------------------------
  // Hilo
  // ---------------------------------------------------------------------------
  function hilo() { return $('#hilo'); }
  function bajar() { const h = hilo(); h.scrollTop = h.scrollHeight; }
  function pregunta(txt) {
    const el = document.createElement('div');
    el.className = 'msg-yo';
    el.textContent = txt;
    hilo().appendChild(el);
    bajar();
  }
  function respuestaVacia() {
    const el = document.createElement('div');
    el.className = 'msg-ia';
    el.innerHTML = '<div class="quien"><i></i>Qualivo Copilot</div><div class="pensando"><span></span><span></span><span></span></div>';
    hilo().appendChild(el);
    bajar();
    return el;
  }
  function rellenar(el, bloques) {
    el.innerHTML = '<div class="quien"><i></i>Qualivo Copilot</div>' + pintarBloques(bloques);
    const h = hilo();
    h.scrollTop = el.offsetTop - 12;
  }

  function preguntarSugerida(p) {
    pregunta(p.q);
    const el = respuestaVacia();
    setTimeout(function () { rellenar(el, responderDet(p)); }, 380);
  }

  // Parecido entre la pregunta libre y las sugeridas (para la respuesta de respaldo)
  const CLAVES = [
    [/fuga|perd|escap|se nos va|se pierde/, 'fugas'],
    [/mayor|más grande|principal/, 'mayorFuga'],
    [/hoy|trabajar|empez|prioriz|primero/, 'trabajar'],
    [/equipo|comercial|ventas hoy|persona/, 'equipo'],
    [/agencia/, 'agencia'],
    [/anunci|campañ|meta|google|canal|invers|publico/, 'anuncios'],
    [/cambi|novedad|ha pasado|nuevos/, 'cambios'],
    [/seguimiento|olvid|parad|sin contestar|frí/, 'sinSeguimiento'],
    [/atenci|urgent|riesgo/, 'atencion'],
    [/probab|matricul|convert|compr|cerrar|pinta|mas cerca|caliente/, 'probables']
  ];
  function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  const VACIAS = /^(que|quien|quienes|cual|cuales|como|donde|cuando|cuanto|esta|este|estos|estas|tiene|tienen|hay|para|por|con|los|las|del|una|unos|unas|mas|menos|muy|son|ser|estan|debería|deberia|hoy|nos|nuestro|nuestra|todo|todos)$/;
  function masParecida(txt) {
    const t = normal(txt);
    const lista = todas().slice();
    // Respuestas que no están entre las sugeridas pero sirven de respaldo
    ['probables', 'equipo', 'campanas', 'sinSeguimiento'].forEach(function (h) {
      if (!lista.some(function (p) { return p.h === h; })) lista.push({ h: h, q: { probables: '¿Quién tiene más probabilidad de comprar?', equipo: '¿Qué debería hacer el equipo hoy?', campanas: '¿Qué campañas traen clientes?', sinSeguimiento: '¿Quién lleva tiempo sin seguimiento?' }[h] });
    });
    const pal = t.split(/[^a-z0-9ñ]+/).filter(function (w) { return w.length > 3 && !VACIAS.test(w); });
    let mejor = null, max = 0;
    lista.forEach(function (p) {
      const q = normal(p.q);
      let n = pal.filter(function (w) { return q.indexOf(w.slice(0, Math.max(4, w.length - 2))) >= 0; }).length;
      CLAVES.forEach(function (k) { if (k[1] === p.h && k[0].test(t)) n += 1.5; });
      if (n > max) { max = n; mejor = p; }
    });
    return max > 0 ? mejor : lista.filter(function (p) { return p.h === 'trabajar'; })[0] || lista[0];
  }

  // Resumen compacto del estado para Claude (solo datos simulados de la demo)
  function contexto() {
    const est = E(), cfg = est.cfg, T = cfg.t, m = M.mes(cfg);
    return {
      sector: cfg.nombre, empresa: est.empresa || '', objetivo: est.objetivo, hora: M.hora(est.ahora),
      terminos: { contacto: T.contacto, contactos: T.contactos, venta: T.venta, ventas: T.ventas, cita: T.cita, comercial: T.comercial, producto: T.producto },
      recorrido: cfg.recorrido.map(function (e) { return { etapa: e.txt, ultimos30dias: m.tot[e.id] }; }),
      fugas: M.fugas(cfg).map(function (f) { return { de: f.de.txt, a: f.a.txt, hoy: Math.round(f.conv * 100), bienHecho: Math.round(f.ref * 100), recuperablesMes: f.recuperables }; }),
      campanas: cfg.campanas.map(function (c) { return { nombre: c.canal + ' · ' + c.nombre, inversion: c.inversion, entran: c.embudo[cfg.recorrido[1].id], ventas: c.embudo[cfg.ventaEtapa], ticket: c.ticket || cfg.ticket }; }),
      kpis: QV.kpis().map(function (k) { return k.l + ': ' + k.v; }),
      contactos: est.contactos.map(function (c) {
        const x = c.x;
        const u = c.conv.filter(function (mm) { return mm.de === 'c'; }).slice(-1)[0];
        return {
          id: c.id, nombre: c.n, rol: c.rol, empresa: c.emp || '', tam: c.tam || null, ciudad: c.ciudad, producto: c.prod, etapa: cfg.etapaTxt(c.etapa), valor: c.valor,
          estado: c.fin || 'abierto', encaje: x.fit, interes: x.comp, intencion: x.int, riesgo: x.riesgo, prioridad: x.prio, probabilidad: probabilidad(c),
          porque: x.porque, siguienteAccion: x.nba.accion, quien: x.nba.quien, porQueAccion: x.nba.por,
          senales: x.senales.map(function (s) { return M.TIPOS_SENAL[s.tipo].txt; }), requiereAtencion: x.atencion,
          altaHace: M.hace(x.k.creado), ultimaActividad: M.hace(x.k.act), sinSeguimiento: M.duracion(x.k.toque),
          masAdelante: c.s.luego ? (c.s.luegoTxt || c.s.luego) : '', ultimoMensaje: u ? u.texto : ''
        };
      })
    };
  }

  function preguntarLibre(txt) {
    pregunta(txt);
    const el = respuestaVacia();
    const plan = masParecida(txt);
    let hecho = false;
    const respaldo = function () {
      if (hecho) return;
      hecho = true;
      rellenar(el, responderDet(plan));
    };
    const reloj = setTimeout(respaldo, TIEMPO_MAX);
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    fetch('/api/intelligence-copilot/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl ? ctl.signal : undefined,
      body: JSON.stringify({ pregunta: txt, contexto: contexto() })
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (hecho) return;
      if (!d || !Array.isArray(d.bloques) || !d.bloques.length) return respaldo();
      // Nunca contactos inventados: solo ids que existen en el estado.
      const ok = d.bloques.filter(function (b) {
        if (b.tipo === 'contactos') { b.ids = (b.ids || []).filter(function (id) { return !!QV.contacto(id); }); return b.ids.length > 0; }
        if (b.tipo === 'tabla') { (b.filas || []).forEach(function (f) { if (f.id && !QV.contacto(f.id)) delete f.id; }); return Array.isArray(b.cols) && Array.isArray(b.filas); }
        return ['texto', 'metrica', 'accion'].indexOf(b.tipo) >= 0;
      });
      if (!ok.length) return respaldo();
      hecho = true;
      clearTimeout(reloj);
      rellenar(el, ok);
    }).catch(function () { clearTimeout(reloj); respaldo(); });
    setTimeout(function () { if (ctl && hecho) ctl.abort(); }, TIEMPO_MAX + 50);
  }

  // ---------------------------------------------------------------------------
  // Borrador de mensaje para un contacto (según su siguiente acción)
  // ---------------------------------------------------------------------------
  function borrador(c) {
    const T = E().cfg.t, x = c.x, nom = c.n.split(' ')[0];
    const ultimo = c.conv.filter(function (m) { return m.de === 'c'; }).slice(-1)[0];
    const id = x.nba.id;
    if (x.nba.tipo === 'humano') {
      return { canal: 'Nota para ' + T.comercial, texto: 'Llamar a ' + c.n + (c.emp ? ' (' + c.emp + ')' : '') + '.\n\nQué quiere: ' + c.prod + '.\nPor qué ahora: ' + x.porque.replace(/^Prioridad \w+ porque /, '') + '\n' + (ultimo ? 'Lo último que dijo: «' + ultimo.texto + '»\n' : '') + 'Valor: ' + M.euros(c.valor) + '.\n\nQué NO repetir: ya sabe ' + (c.conv.filter(function (m) { return m.de !== 'c'; }).length ? 'lo que le ha contado el agente' : 'quiénes somos') + '. Ir directo a ' + (T.pasoHumano || 'resolver sus dudas y proponer el siguiente paso') + '.' };
    }
    if (id === 'reenganche') return { canal: 'WhatsApp · agente', texto: 'Hola ' + nom + ', retomo lo que hablamos' + (ultimo ? ' («' + ultimo.texto.slice(0, 60) + (ultimo.texto.length > 60 ? '…' : '') + '»)' : '') + '. ¿Te va bien que lo veamos 15 minutos esta semana? Tengo jueves a las 10:00 o viernes a las 16:30.' };
    if (id === 'reprogramar') return { canal: 'WhatsApp · agente', texto: 'Hola ' + nom + ', ayer no pudimos vernos. Pasa, no te preocupes. ¿Te dejo otro hueco? Tengo mañana a las 12:00 o el jueves a las 17:30.' };
    if (id === 'propuesta') return { canal: 'WhatsApp · agente', texto: 'Hola ' + nom + ', ¿pudiste ver ' + T.propuesta + '? Si hay algo que no encaja (fechas, formato o importe), dímelo y lo ajustamos. Suele ser más fácil de lo que parece.' };
    if (id === 'wa' || id === 'wa-seguir') return { canal: 'WhatsApp · agente', texto: ultimo ? 'Hola ' + nom + ', claro. ' + (c.s.precio ? 'Te paso el detalle y las opciones de pago. ' : '') + '¿Lo vemos 15 minutos con ' + T.comercial + '? Así lo ajustamos a lo que necesitas. Tengo hoy a las 17:00 o mañana a las 10:30.' : 'Hola ' + nom + ', te escribo por ' + c.prod + '. ¿Qué te gustaría conseguir? Así te cuento lo que de verdad te sirve.' };
    if (id === 'voz') return { canal: 'Guion · agente de voz', texto: 'Hola ' + nom + ', te llamo de parte del equipo por ' + c.prod + '. ¿Tienes dos minutos? … Te pregunto una cosa para no hacerte perder el tiempo: ¿para cuándo lo necesitarías? … Perfecto, te propongo ver los detalles con ' + T.comercial + '.' };
    if (id === 'esperar') return { canal: 'WhatsApp · programado para ' + c.s.luego, texto: 'Hola ' + nom + ', me dijiste que ' + (c.s.luegoTxt || 'lo retomarías más adelante') + '. Te escribo porque ya estamos en esas fechas. ¿Te guardo sitio?' };
    if (id === 'recordatorio') return { canal: 'Recordatorio · el mismo día', texto: 'Hola ' + nom + ', te recuerdo que hoy tenemos ' + T.cita + '. Te dejo el enlace por aquí. Si te surge algo, dímelo y lo movemos.' };
    if (id === 'caso') return { canal: 'Correo · automatización', texto: 'Asunto: Cómo lo hizo alguien como tú\n\nHola ' + nom + ', te dejo ' + T.casoExito + '. Si te encaja, contéstame a este correo y lo vemos.' };
    return { canal: 'Mensaje', texto: 'Hola ' + nom + ', ¿cómo lo llevas? Si te puedo ayudar en algo con ' + c.prod + ', aquí estoy.' };
  }
  function agencia() {
    pregunta(E().cfg.t.notaBoton || 'Redacta el correo para la agencia de anuncios');
    const el = respuestaVacia();
    setTimeout(function () {
      const T = E().cfg.t;
      const txt = (E().cfg.t.notaAsunto || 'Asunto: Lo que pasa después de vuestros anuncios') + ' · semana del ' + new Date(E().ahora).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) + '\n\nHola,\n\nOs paso lo que vemos cruzando cada campaña con lo que pasa después en el sistema:\n\n' + QV.notaAgencia().map(function (l) { return '• ' + l; }).join('\n') + '\n\nSi os encaja, lo vemos 15 minutos el jueves.\n\nUn saludo';
      rellenar(el, [texto('**' + (E().cfg.t.notaCorreo || 'Correo para la agencia') + '** · generado de los veredictos de la pantalla Anuncios.'), { tipo: 'borrador', texto: txt }, accion('En esta demo no se envía nada. En el sistema real sale cada lunes, o cuando tú lo decidas.')]);
    }, 350);
  }
  function generar(id) {
    const c = QV.contacto(id);
    if (!c) return;
    const b = borrador(c);
    pregunta('Genera el mensaje para ' + c.n);
    const el = respuestaVacia();
    setTimeout(function () {
      rellenar(el, [texto('**' + b.canal + '** · basado en su conversación y en su siguiente acción (' + c.x.nba.accion.toLowerCase() + ').'), { tipo: 'borrador', texto: b.texto }, accion(c.x.nba.tipo === 'humano' ? 'Esto va ' + M.al(E().cfg.t.comercial) + ' junto con el aviso: nadie empieza la conversación de cero.' : 'Lo enviaría ' + c.x.nba.quien.toLowerCase() + ' dentro de su franja horaria. En esta demo no se envía nada.')]);
    }, 350);
  }

  // ---------------------------------------------------------------------------
  // Arranque y reinicio (al cambiar de sector)
  // ---------------------------------------------------------------------------
  function pintarSugeridas() {
    const lista = sugeridas();
    $('#sugeridas').innerHTML = lista.map(function (p, i) { return '<button class="sug" type="button" data-sug="' + i + '">' + esc(p.q) + '</button>'; }).join('');
    $('#sugeridas').onclick = function (e) {
      const b = e.target.closest('[data-sug]');
      if (b) preguntarSugerida(lista[+b.dataset.sug]);
    };
  }
  function reiniciar() {
    const est = E(), T = est.cfg.t;
    hilo().innerHTML = '';
    $('#copilotSub').textContent = 'Conectado a ' + (est.empresa || 'tu negocio') + ' · ' + est.contactos.length + ' ' + T.contactos;
    const at = QV.atencion().length;
    const el = document.createElement('div');
    el.className = 'msg-ia';
    el.innerHTML = '<div class="quien"><i></i>Qualivo Copilot</div>' + pintarBloques([texto('Buenos días. He revisado ' + est.contactos.length + ' ' + T.contactos + ', las campañas del mes y las conversaciones. **' + at + ' ' + T.oportunidades + ' requieren atención.** Pregúntame lo que quieras o elige una pregunta.')]);
    hilo().appendChild(el);
    pintarSugeridas();
  }

  $('#formPregunta').addEventListener('submit', function (e) {
    e.preventDefault();
    const inp = $('#pregunta');
    const t = inp.value.trim();
    if (!t) return;
    inp.value = '';
    const exacta = todas().filter(function (p) { return normal(p.q) === normal(t); })[0];
    if (exacta) preguntarSugerida(exacta); else preguntarLibre(t);
  });
  $('#formPregunta button').innerHTML = ico('enviar');

  QV.copilot = { agencia: agencia, reiniciar: reiniciar, preguntarSugerida: preguntarSugerida, preguntarLibre: preguntarLibre, generar: generar, responderDet: responderDet, todas: todas, masParecida: masParecida, contexto: contexto, pintarBloques: pintarBloques, H: H };
})();
