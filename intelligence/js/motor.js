/* Qualivo Intelligence · motor
 *
 * Un solo motor para todos los sectores. Cada contacto trae datos crudos
 * (qué es, qué ha hecho, qué ha dicho) y aquí se CALCULA todo lo demás:
 *   Encaje (fit), Comportamiento, Intención y Riesgo, de 0 a 100
 *   → Prioridad (baja / media / alta / urgente) con su porqué
 *   → Siguiente mejor acción, quién la hace y por qué
 *   → Señales, línea de tiempo y actividad de los agentes.
 * Nada de números puestos a mano: si cambian los datos, cambia todo.
 *
 * Esquema de un contacto (los sectores lo rellenan en sectores/*.js):
 *   id, n (nombre), rol, emp, tam (empleados), ciudad, prod, seg (segmento),
 *   orig (id de campaña), canal ('wa' | 'email' | 'tel'), etapa (índice del recorrido),
 *   valor (€), creado / act / toque (minutos: alta, su última actividad, nuestro último toque),
 *   s: { precio, visitas, emails, resp, urg, ppto, luego, noshow, cita, citaOk,
 *        prop, propVista, intentos, uso, usoPrev, exp, bloqueo, ... }
 *   conv: [[min, 'c'|'a'|'h'|'v', canal, texto], ...]  (c contacto, a agente, h persona, v voz)
 *   ev:   [[min, tipo, texto], ...] eventos extra para la línea de tiempo
 *   fin:  'ganado' | 'perdido' (si ya se cerró)
 */
(function () {
  'use strict';
  const QV = window.QV = window.QV || {};
  const MIN = 60000;

  const clamp = function (v) { return Math.max(0, Math.min(100, Math.round(v))); };

  // ---------------------------------------------------------------------------
  // Tiempo relativo
  // ---------------------------------------------------------------------------
  function hace(min) {
    min = Math.max(0, Math.round(min));
    if (min < 1) return 'ahora';
    if (min < 60) return 'hace ' + min + ' min';
    const h = Math.round(min / 60);
    if (min < 60 * 24) return 'hace ' + h + ' h';
    const d = Math.round(min / 1440);
    if (d === 1) return 'ayer';
    if (d < 14) return 'hace ' + d + ' días';
    const s = Math.round(d / 7);
    if (d < 60) return 'hace ' + s + ' semanas';
    return 'hace ' + Math.round(d / 30) + ' meses';
  }
  function duracion(min) {
    min = Math.max(0, Math.round(min));
    if (min < 60) return min + ' min';
    if (min < 60 * 24) return Math.round(min / 60) + ' h';
    const d = Math.round(min / 1440);
    return d === 1 ? '1 día' : d + ' días';
  }
  function dentroDe(min) {
    if (min < 60) return 'en ' + Math.round(min) + ' min';
    if (min < 60 * 24) return 'en ' + Math.round(min / 60) + ' h';
    const d = Math.round(min / 1440);
    return d === 1 ? 'mañana' : 'en ' + d + ' días';
  }
  function duracionLarga(min) {
    min = Math.round(min);
    if (min < 60) return min + ' min';
    const h = Math.floor(min / 60), m = min % 60;
    return h + ' h' + (m ? ' ' + m + ' min' : '');
  }
  function hora(ms) {
    const d = new Date(ms);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function fechaCorta(ms, ahora) {
    const d = new Date(ms), h = new Date(ahora);
    const mismoDia = d.toDateString() === h.toDateString();
    if (mismoDia) return hora(ms);
    const ayer = new Date(ahora - 86400000);
    if (d.toDateString() === ayer.toDateString()) return 'Ayer ' + hora(ms);
    return d.getDate() + ' ' + ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][d.getMonth()] + ' · ' + hora(ms);
  }
  function euros(v) {
    v = Math.round(v || 0);
    return num(v) + ' €';
  }
  function num(v, dec) {
    // Separador de miles siempre (es-ES no agrupa los números de 4 cifras).
    const n = Number(v || 0), d = dec || 0;
    const partes = Math.abs(n).toFixed(d).split('.');
    const ent = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (n < 0 ? '−' : '') + ent + (d ? ',' + partes[1] : '');
  }
  function pl(n, s, p) { return num(n) + ' ' + (n === 1 ? s : p);
  }
  function pct(v) { return num(v * 100, v < 0.1 ? 1 : 0) + ' %'; }

  // ---------------------------------------------------------------------------
  // Carga: minutos relativos → instantes absolutos, para que el reloj de la
  // demo pueda avanzar y todo envejezca a la vez.
  // ---------------------------------------------------------------------------
  function preparar(crudo, t0) {
    const c = JSON.parse(JSON.stringify(crudo));
    c.s = c.s || {};
    const abs = function (m) { return m == null ? null : t0 - m * MIN; };
    c.tCreado = abs(c.creado);
    c.tAct = abs(c.act != null ? c.act : c.creado);
    c.tToque = abs(c.toque);
    if (c.s.cita != null) c.s.tCita = t0 + c.s.cita * MIN; // la cita es futura (min hasta la cita)
    if (c.s.prop != null) c.s.tProp = abs(c.s.prop);
    c.conv = (c.conv || []).map(function (m) { return { t: abs(m[0]), de: m[1], canal: m[2], texto: m[3] }; });
    c.ev = (c.ev || []).map(function (e) { return { t: abs(e[0]), tipo: e[1], texto: e[2] }; });
    return c;
  }

  // Minutos desde un instante absoluto, con el reloj actual.
  function desde(t, ahora) { return t == null ? null : (ahora - t) / MIN; }

  // ---------------------------------------------------------------------------
  // Reglas por defecto. Cada regla: [condición(c, k, T), puntos, texto(c, k, T)]
  // k trae los minutos ya calculados; T los términos del sector.
  // Los sectores pueden añadir reglas propias (cfg.reglas.fit, etc.).
  // ---------------------------------------------------------------------------
  function ultimoDe(c, de) { const l = c.conv.filter(function (m) { return m.de === de; }); return l[l.length - 1] || null; }
  function ultimoMsg(c) { return c.conv[c.conv.length - 1] || null; }
  function contesto(c) { return c.conv.filter(function (m) { return m.de === 'c'; }).length; }
  function canalTxt(canal) { return canal === 'wa' ? 'WhatsApp' : canal === 'email' ? 'correo' : canal === 'tel' ? 'teléfono' : canal === 'voz' ? 'llamada' : canal; }

  const R = {
    comportamiento: [
      [function (c, k) { return k.act < 60; }, 28, function (c, k) { return 'actividad ' + hace(k.act); }],
      [function (c, k) { return k.act >= 60 && k.act < 1440; }, 16, function () { return 'activo en las últimas 24 h'; }],
      [function (c, k) { return k.act >= 1440 && k.act < 10080; }, 6, function () { return 'activo esta semana'; }],
      [function (c) { return (c.s.visitas || 0) >= 3; }, 22, function (c, k, T) { return 'ha visitado ' + T.paginaVisitas + ' ' + c.s.visitas + ' veces en 7 días'; }],
      [function (c) { return (c.s.visitas || 0) > 0 && c.s.visitas < 3; }, 10, function (c, k, T) { return 'ha visitado ' + T.paginaVisitas; }],
      [function (c) { return (c.s.emails || 0) >= 2; }, 10, function (c) { return 'ha abierto ' + c.s.emails + ' correos'; }],
      [function (c) { return contesto(c) > 0; }, 20, function (c) { const u = c.conv.filter(function (m) { return m.de === 'c'; }); return 'respondió por ' + canalTxt(u[u.length - 1].canal); }],
      [function (c) { return contesto(c) >= 3; }, 10, function () { return 'conversación de varios mensajes'; }]
    ],
    intencion: [
      [function (c) { return !!c.s.precio; }, 20, function (c, k, T) { return T.txtPrecio || 'preguntó por el precio'; }],
      [function (c) { return !!c.s.urg; }, 22, function (c) { return c.s.urgTxt || 'tiene urgencia'; }],
      [function (c) { return c.s.ppto === 'si'; }, 14, function (c) { return c.s.pptoTxt || 'tiene presupuesto'; }],
      [function (c, k) { return c.s.tCita != null && !c.s.noshow; }, 18, function (c, k, T) { return T.cita + ' agendada'; }],
      [function (c) { return (c.s.propVista || 0) >= 2; }, 16, function (c, k, T) { return 'ha abierto ' + T.propuesta + ' ' + c.s.propVista + ' veces'; }],
      [function (c) { return (c.s.visitas || 0) >= 3; }, 8, function () { return 'visitas repetidas'; }],
      [function (c) { return contesto(c) > 0; }, 10, function () { return 'conversación abierta'; }],
      [function (c, k) { const u = ultimoDe(c, 'c'); return u && (k.ahora - u.t) / MIN < 1440; }, 12, function (c, k) { return 'escribió ' + hace((k.ahora - ultimoDe(c, 'c').t) / MIN); }],
      [function (c, k) { return k.creado < 180 && !c.fin; }, 14, function (c, k) { return 'acaba de pedir información (' + hace(k.creado) + ')'; }],
      [function (c) { return !!c.s.luego; }, -18, function (c) { return 'dijo «más adelante» (' + c.s.luego + ')'; }],
      [function (c) { return c.s.ppto === 'no'; }, -16, function () { return 'no tiene presupuesto ahora'; }]
    ],
    riesgo: [
      [function (c, k) { return contesto(c) === 0 && k.creado > 2880 && !c.fin; }, 32, function (c, k) { return 'no responde desde hace ' + duracion(k.creado); }],
      [function (c, k) { return contesto(c) > 0 && k.toque != null && k.toque > 2880 && !c.fin && !c.s.luego; }, 30, function (c, k) { return duracion(k.toque) + ' sin seguimiento'; }],
      [function (c, k) { return contesto(c) > 0 && k.toque != null && k.toque > 5 * 1440 && !c.fin && !c.s.luego; }, 16, null],
      [function (c, k) { const u = ultimoMsg(c); return u && u.de === 'c' && (k.ahora - u.t) / MIN > 120 && !c.fin && !c.s.luego; }, 24, function (c, k) { return 'lleva ' + duracion((k.ahora - ultimoMsg(c).t) / MIN) + ' esperando respuesta'; }],
      [function (c) { return !!c.s.noshow; }, 36, function (c, k, T) { return 'no se presentó a ' + T.laCita; }],
      [function (c, k) { return c.s.tProp != null && !(c.s.propVista > 0) && k.prop > 4320; }, 26, function (c, k, T) { return T.propuesta + ' sin abrir desde hace ' + duracion(k.prop); }],
      [function (c, k) { return c.s.tProp != null && c.s.propVista > 0 && k.toque > 4320 && !c.fin; }, 24, function (c, k, T) { return T.propuesta + ' vista y sin respuesta'; }],
      [function (c, k) { return k.act > 20160 && !c.fin; }, 16, function (c, k) { return 'sin actividad desde hace ' + duracion(k.act); }],
      [function (c, k) { return c.s.tCita != null && !c.s.citaOk && k.cita < 2880 && k.cita > 0; }, 22, function (c, k, T) { return T.cita + ' ' + dentroDe(k.cita) + ' sin confirmar'; }],
      [function (c) { return !!c.s.luego; }, 10, function () { return 'decisión aplazada'; }]
    ]
  };

  function aplicar(reglas, c, k, T, base) {
    let p = base || 0;
    const motivos = [];
    (reglas || []).forEach(function (r) {
      let ok = false;
      try { ok = r[0](c, k, T); } catch (e) { ok = false; }
      if (!ok) return;
      p += r[1];
      const txt = typeof r[2] === 'function' ? r[2](c, k, T) : r[2];
      if (txt) motivos.push({ pts: r[1], txt: txt });
    });
    motivos.sort(function (a, b) { return Math.abs(b.pts) - Math.abs(a.pts); });
    return { v: clamp(p), motivos: motivos };
  }

  // ---------------------------------------------------------------------------
  // Prioridad: combina los cuatro. El riesgo sube la prioridad solo si la
  // oportunidad vale la pena (buen encaje): un contacto frío que no contesta no
  // es urgente, es ruido.
  // ---------------------------------------------------------------------------
  const PRIO = {
    urgente: { n: 4, txt: 'Urgente', clase: 'urg' },
    alta: { n: 3, txt: 'Alta', clase: 'alta' },
    media: { n: 2, txt: 'Media', clase: 'media' },
    baja: { n: 1, txt: 'Baja', clase: 'baja' }
  };

  function prioridad(x, c) {
    if (c.fin === 'perdido') return 'baja';
    const op = 0.35 * x.fit + 0.2 * x.comp + 0.45 * x.int;
    x.oportunidad = Math.round(op);
    if (c.fin === 'ganado') {
      if ((x.fit >= 35 && x.riesgo >= 45) || c.s.exp) return x.riesgo >= 70 ? 'urgente' : 'alta';
      return 'baja';
    }
    if (op >= 72 || (x.fit >= 70 && x.int >= 60 && x.riesgo >= 55)) return 'urgente';
    if (op >= 58 || (x.fit >= 62 && x.riesgo >= 50) || (x.fit >= 50 && x.riesgo >= 65) || (x.k.creado < 180 && x.fit >= 70) || (c.s.bloqueo && x.fit >= 60)) return 'alta';
    if (op >= 42) return 'media';
    return 'baja';
  }

  // «a el asesor» → «al asesor»
  function al(x) { x = String(x || ''); return /^el /i.test(x) ? 'al ' + x.slice(3) : 'a ' + x; }
  function unir(lista) {
    if (lista.length <= 1) return lista.join('');
    return lista.slice(0, -1).join(', ') + ' y ' + lista[lista.length - 1];
  }

  function porque(x, c, T) {
    // Clientes actuales: lo que importa es el riesgo o la ampliación
    if (c.fin === 'ganado' && (x.riesgo >= 45 || c.s.exp)) {
      const r = x.riesgoM.filter(function (mm) { return mm.pts >= 12; }).slice(0, 2).map(function (mm) { return mm.txt; });
      const ex = c.s.exp ? [(c.s.expTxt || 'pide más').replace(/^./, function (z) { return z.toLowerCase(); })] : [];
      return 'Prioridad ' + PRIO[x.prio].txt.toLowerCase() + ' porque ' + unir(r.concat(ex).slice(0, 3)) + '.';
    }
    const partes = [];
    if (x.fit >= 70) partes.push('buen encaje' + (x.fitM[0] ? ' (' + x.fitM[0].txt + ')' : ''));
    else if (x.fit < 40) partes.push('encaje bajo' + (x.fitM.filter(function (m) { return m.pts < 0; })[0] ? ' (' + x.fitM.filter(function (m) { return m.pts < 0; })[0].txt + ')' : ''));
    x.intM.filter(function (m) { return m.pts > 0; }).slice(0, 2).forEach(function (m) { partes.push(m.txt); });
    if (partes.length < 3) x.compM.slice(0, 3 - partes.length).forEach(function (m) { if (partes.indexOf(m.txt) < 0) partes.push(m.txt); });
    const riesgos = x.riesgoM.filter(function (m) { return m.pts >= 20; }).slice(0, 1).map(function (m) { return m.txt; });
    let frase = 'Prioridad ' + PRIO[x.prio].txt.toLowerCase() + ' porque ' + unir(partes.slice(0, 3));
    if (riesgos.length) frase += (partes.length ? '. Ojo: ' : '') + riesgos[0];
    return frase + '.';
  }

  // ---------------------------------------------------------------------------
  // Siguiente mejor acción. Son las acciones que Qualivo hace de verdad:
  // WhatsApp del agente, llamada de la agente de voz, aviso al comercial,
  // recordatorio de cita, recuperación de propuestas, reenganche, esperar.
  // Devuelve { id, accion, quien, tipo (agente|voz|auto|humano|nada), estado, por }
  // ---------------------------------------------------------------------------
  const ESTADOS = {
    vigilando: 'Vigilando', trabajando: 'Trabajando', esperando: 'Esperando respuesta',
    escalado: 'Escalado', humano: 'Requiere persona', cerrado: 'Cerrado'
  };

  function nbaGenerica(c, k, x, T) {
    const canal = c.canal === 'email' ? 'correo' : 'WhatsApp';
    const ultimo = c.conv.filter(function (m) { return m.de === 'c'; }).slice(-1)[0];
    const minUlt = ultimo ? desde(ultimo.t, k.ahora) : null;
    if (c.asignado) {
      return { id: 'asignado', accion: 'En manos de ' + c.asignado, quien: c.asignado, tipo: 'humano', estado: 'escalado',
        por: 'Se lo has asignado a ' + c.asignado + '. El sistema deja de escribirle y le pasa el contexto completo.' };
    }
    if (c.fin === 'perdido') return { id: 'nada', accion: 'No hacer nada', quien: 'Sistema', tipo: 'nada', estado: 'cerrado', por: 'Está cerrado como perdido. Si vuelve a dar señales, el sistema lo detecta y lo reabre.' };
    if (c.fin === 'ganado' && c.s.exp) return { id: 'expansion', accion: 'Pasar ' + al(T.cs || T.comercial), quien: T.CS || T.Comercial, tipo: 'humano', estado: 'humano', por: (c.s.expTxt || 'Pide más') + '. Es ' + T.unCliente + ' contento: la conversación la tiene que llevar una persona, con el historial delante.' };
    if (c.fin === 'ganado' && x.riesgo >= 45) return { id: 'retener', accion: 'Aviso ' + al(T.cs || T.comercial), quien: T.CS || T.Comercial, tipo: 'humano', estado: 'humano', por: 'Hay señales de que se puede ir: ' + unir(x.riesgoM.slice(0, 2).map(function (m) { return m.txt; })) + '. Una llamada ahora vale más que diez correos después.' };
    if (c.fin === 'ganado' && c.s.revision) return { id: 'recordatorio', accion: 'Recordatorio de revisión', quien: 'Automatización', tipo: 'auto', estado: 'esperando', por: (c.s.revisionTxt || 'Tiene una revisión pendiente') + '. Sale un mensaje con dos huecos para reservarla sin llamar: es la parte del negocio que más se olvida.' };
    if (c.fin === 'ganado') return { id: 'nada', accion: 'Nada que hacer ahora', quien: 'Sistema', tipo: 'nada', estado: 'vigilando', por: 'Ya es ' + T.cliente + '. El sistema sigue mirando por si aparece una oportunidad nueva o un riesgo.' };
    if (x.int >= 78 && x.fit >= 62) {
      return { id: 'comercial', accion: 'Avisar ' + al(T.comercial), quien: T.Comercial, tipo: 'humano', estado: 'humano',
        por: 'Está listo para hablar con una persona: ' + unir(x.intM.filter(function (m) { return m.pts > 0; }).slice(0, 2).map(function (m) { return m.txt; })) + '. El agente ya ha hecho la parte que no necesita a nadie; ahora le toca a ' + T.comercial + ', con todo el contexto.' };
    }
    if (x.fit < 25) {
      return { id: 'cerrar', accion: 'Respuesta amable y cerrar', quien: 'Automatización', tipo: 'auto', estado: 'cerrado',
        por: 'No encaja (' + ((x.fitM.filter(function (m) { return m.pts < 0; })[0] || {}).txt || 'perfil fuera de lo que buscáis') + '). Se le contesta con amabilidad y no se gasta tiempo del equipo.' };
    }
    const um = ultimoMsg(c);
    if (um && um.de === 'c' && !c.s.luego && (k.ahora - um.t) / MIN < 1440) {
      const m = (k.ahora - um.t) / MIN;
      if (c.s.tProp != null && c.valor >= (T.valorAlto || 5000)) {
        return { id: 'comercial', accion: 'Avisar ' + al(T.comercial), quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: 'Ha contestado sobre ' + T.propuesta + ' ' + hace(m) + ' («' + um.texto.slice(0, 70) + (um.texto.length > 70 ? '…' : '') + '»). Vale ' + euros(c.valor) + ': esta conversación la tiene que llevar una persona, y hoy.' };
      }
      if (x.int >= 65 && x.fit >= 55) {
        return { id: 'comercial', accion: 'Avisar ' + al(T.comercial), quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: 'Escribió ' + hace(m) + ' y ' + unir(x.intM.filter(function (mm) { return mm.pts > 0 && !/^escribió|^conversación/.test(mm.txt); }).slice(0, 2).map(function (mm) { return mm.txt; })) + '. El agente no da precios ni cierra condiciones: pasa el hilo ' + al(T.comercial) + ' con la conversación resumida.' };
      }
      return { id: 'wa-seguir', accion: 'Contestar por ' + (um.canal === 'email' ? 'correo' : 'WhatsApp'), quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
        por: (um.canal === 'email' ? 'Correo' : 'WhatsApp') + ' porque escribió por este canal ' + hace(m) + ' y está esperando respuesta' + (m > 120 ? ' (demasiado tiempo: aquí se enfría)' : '') + '. El agente contesta con su contexto y lleva la conversación hasta ' + T.objetivoPaso + '.' };
    }
    if (c.s.bloqueo) {
      return { id: 'desbloquear', accion: T.accionBloqueo || 'Ayuda para desbloquearse', quien: T.agenteBloqueo || 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
        por: (c.s.bloqueoTxt || 'Se ha quedado atascado') + '. Una ayuda concreta en el momento en que se atasca vale más que cualquier secuencia de correos.' };
    }
    if (c.s.noshow) {
      return { id: 'reprogramar', accion: 'Reprogramar por WhatsApp', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
        por: 'No vino a ' + T.laCita + ' pero el interés era real. Un mensaje corto con dos huecos nuevos recupera a muchos sin que nadie tenga que llamar.' };
    }
    if (c.s.tCita != null && k.cita > 0) {
      return { id: 'recordatorio', accion: 'Recordatorio de ' + T.cita, quien: 'Automatización', tipo: 'auto', estado: 'esperando',
        por: T.Cita + ' ' + dentroDe(k.cita) + (c.s.citaOk ? ', ya confirmada' : ' y todavía sin confirmar') + '. Sale el recordatorio por ' + canal + ' el mismo día, con la hora y el enlace.' };
    }
    if (c.s.tProp != null && k.toque > 2880) {
      return { id: 'propuesta', accion: 'Recuperar ' + T.propuesta, quien: c.valor >= (T.valorAlto || 5000) ? T.Comercial : 'Agente de WhatsApp', tipo: c.valor >= (T.valorAlto || 5000) ? 'humano' : 'agente', estado: c.valor >= (T.valorAlto || 5000) ? 'humano' : 'trabajando',
        por: (c.s.propVista ? 'Ha abierto ' + T.propuesta + ' ' + c.s.propVista + (c.s.propVista === 1 ? ' vez' : ' veces') : T.Propuesta + ' sigue sin abrir') + ' y nadie le ha escrito en ' + duracion(k.toque) + '. ' + (c.valor >= (T.valorAlto || 5000) ? 'Vale ' + euros(c.valor) + ': mejor una llamada ' + (/^el /.test(T.comercial) ? 'del ' + T.comercial.slice(3) : 'de ' + T.comercial) + ' que un mensaje automático.' : 'Un mensaje del agente con la duda más habitual lo reactiva sin presionar.') };
    }
    if (k.creado < 90 && contesto(c) === 0) {
      if (c.canal === 'tel') return { id: 'voz', accion: T.llamadaVoz || 'Llamada de la agente de voz', quien: T.agenteVoz || 'Agente de voz', tipo: 'voz', estado: 'trabajando', por: 'Acaba de entrar (' + hace(k.creado) + ') y dejó el teléfono como forma de contacto. Llamar en los primeros 5 minutos multiplica las opciones de hablar con él.' };
      return { id: 'wa', accion: 'WhatsApp del agente', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando', por: 'Acaba de entrar (' + hace(k.creado) + '). La respuesta en el minuto uno, con sus palabras, es donde más ' + T.contactos + ' se pierden.' };
    }
    if (c.s.luego) {
      return { id: 'esperar', accion: 'Esperar y reactivar en ' + c.s.luego, quien: 'Agente de reactivación', tipo: 'agente', estado: 'vigilando',
        por: 'Dijo que ' + (c.s.luegoTxt || 'lo retomaría más adelante') + '. Insistir ahora quema la relación; el sistema le vuelve a escribir en ' + c.s.luego + ' con lo que dijo.' };
    }
    if (contesto(c) > 0 && k.toque > 1440) {
      const porCanal = ultimo && ultimo.canal === 'wa' ? 'WhatsApp porque respondió antes por este canal' : 'Mensaje en su canal';
      return { id: 'reenganche', accion: 'Reenganche por ' + (ultimo && ultimo.canal === 'email' ? 'correo' : 'WhatsApp'), quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
        por: porCanal + ' y la conversación se quedó parada hace ' + duracion(k.toque) + '. El agente retoma su contexto, sin plantilla, y propone el siguiente paso.' };
    }
    if (contesto(c) > 0 && minUlt != null && minUlt < 180) {
      return { id: 'wa-seguir', accion: 'Seguir por WhatsApp', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
        por: 'WhatsApp porque respondió por este canal y su último mensaje fue ' + hace(minUlt) + '. El agente sigue la conversación hasta ' + T.objetivoPaso + '.' };
    }
    if (contesto(c) === 0 && ((c.s.intentos || 0) >= 3 || k.creado >= 20160)) {
      return { id: 'nada', accion: 'No hacer nada', quien: 'Sistema', tipo: 'nada', estado: 'cerrado', por: 'Tres intentos sin respuesta. Insistir más cuesta y molesta; queda guardado por si vuelve a dar señales.' };
    }
    if (contesto(c) === 0 && k.creado >= 90) {
      if ((c.s.visitas || 0) >= 2) return { id: 'caso', accion: 'Enviar ' + T.casoExito + ' por correo', quien: 'Automatización', tipo: 'auto', estado: 'esperando', por: 'No contesta a los mensajes pero ha vuelto a mirar ' + T.paginaVisitas + '. Le interesa y todavía no se fía: un caso parecido al suyo pesa más que otro mensaje.' };
      return { id: 'voz', accion: T.llamadaVoz || 'Llamada de la agente de voz', quien: T.agenteVoz || 'Agente de voz', tipo: 'voz', estado: 'trabajando', por: 'No ha contestado al WhatsApp (' + ((c.s.intentos || 1)) + (c.s.intentos === 1 ? ' intento' : ' intentos') + '). La cadencia pasa a voz dentro de su franja: mucha gente no lee, pero coge el teléfono.' };
    }
    if (contesto(c) === 0 && k.creado >= 20160) {
      return { id: 'nada', accion: 'No hacer nada', quien: 'Sistema', tipo: 'nada', estado: 'cerrado', por: 'Tres intentos sin respuesta. Insistir más cuesta y molesta; queda guardado por si vuelve a dar señales.' };
    }
    return { id: 'esperar', accion: 'Seguir observando', quien: 'Sistema', tipo: 'nada', estado: 'vigilando', por: 'No hay una señal que pida actuar ahora. El sistema avisa en cuanto cambie algo.' };
  }

  // ---------------------------------------------------------------------------
  // Señales: lo que el sistema detecta solo. Cada una: tipo, cuándo, qué pasó,
  // por qué importa, acción tomada, y si necesita a una persona.
  // ---------------------------------------------------------------------------
  const TIPOS_SENAL = {
    nueva: { txt: 'Nueva oportunidad', ico: 'nueva', tono: 'teal' },
    intencion: { txt: 'Intención alta', ico: 'diana', tono: 'coral' },
    sinseg: { txt: 'Sin seguimiento', ico: 'pausa', tono: 'amber' },
    noshow: { txt: 'Riesgo de no-show', ico: 'calendario', tono: 'amber' },
    reactivar: { txt: 'Reactivación', ico: 'ciclo', tono: 'lila' },
    baja: { txt: 'Riesgo de baja', ico: 'alerta', tono: 'rojo' },
    expansion: { txt: 'Expansión', ico: 'sube', tono: 'teal' },
    bloqueo: { txt: 'Bloqueado', ico: 'alerta', tono: 'amber' },
    propuesta: { txt: 'Propuesta enfriándose', ico: 'pausa', tono: 'amber' },
    revision: { txt: 'Revisión pendiente', ico: 'calendario', tono: 'lila' }
  };

  // Cada sector puede renombrar señales (p. ej. «Presupuesto enfriándose»).
  const TXT_SENAL = {};
  Object.keys(TIPOS_SENAL).forEach(function (k) { TXT_SENAL[k] = TIPOS_SENAL[k].txt; });
  function nombresSenal(mapa) {
    Object.keys(TIPOS_SENAL).forEach(function (k) { TIPOS_SENAL[k].txt = (mapa && mapa[k]) || TXT_SENAL[k]; });
  }

  function accionTomada(nba, T) {
    if (nba.tipo === 'humano') return 'Aviso enviado ' + (nba.quien === T.Comercial ? al(T.comercial) : al(nba.quien.charAt(0).toLowerCase() + nba.quien.slice(1)));
    if (nba.id === 'wa' || nba.id === 'wa-seguir') return 'WhatsApp del agente enviado';
    if (nba.id === 'voz') return 'Llamada programada en su franja';
    if (nba.id === 'reenganche') return 'Reenganche en marcha';
    if (nba.id === 'reprogramar') return 'Nuevos huecos propuestos';
    if (nba.id === 'recordatorio') return 'Recordatorio programado';
    if (nba.id === 'propuesta') return 'Recuperación en marcha';
    if (nba.id === 'esperar') return 'Reactivación programada';
    if (nba.id === 'caso') return 'Caso enviado por correo';
    if (nba.id === 'desbloquear') return 'Ayuda enviada';
    return 'En observación';
  }

  function senales(c, k, x, T, cfg) {
    const out = [];
    const humano = x.nba.tipo === 'humano';
    const add = function (tipo, t, que, importa) {
      out.push({ tipo: tipo, t: t, que: que, importa: importa, accion: accionTomada(x.nba, T), humano: humano, id: c.id + ':' + tipo });
    };
    if (c.fin !== 'perdido') {
      if (k.creado < 180 && x.fit >= 55 && !c.fin) add('nueva', c.tCreado, 'Pide información de ' + c.prod + ' desde ' + ((cfg.campana(c.orig) || {}).canal || 'la web'), 'Encaje ' + x.fit + '. Si se contesta en el minuto uno, la probabilidad de hablar con él se multiplica.');
      if (x.int >= 75 && !c.fin) add('intencion', c.tAct, x.intM.filter(function (m) { return m.pts > 0; }).slice(0, 2).map(function (m) { return m.txt.charAt(0).toUpperCase() + m.txt.slice(1); }).join(' · '), 'Intención ' + x.int + ' con encaje ' + x.fit + '. Es de los ' + T.contactos + ' que ' + T.convierten + ' si alguien les atiende ahora.');
      if (contesto(c) > 0 && k.toque > 2880 && !c.fin && !c.s.luego && !c.s.tProp && x.fit >= 40) add('sinseg', c.tToque, duracion(k.toque) + ' sin que nadie le escriba después de contestar', 'Ya contestó y mostró interés. Cada día sin seguimiento baja la probabilidad de ' + T.venta + '.');
      if (c.s.tProp != null && k.toque > 2880 && !c.fin) add('propuesta', c.tToque, T.Propuesta + ' de ' + euros(c.valor) + (c.s.propVista ? ' vista ' + c.s.propVista + (c.s.propVista === 1 ? ' vez' : ' veces') : ' sin abrir') + ', sin respuesta', 'Es dinero casi ganado: ya se hizo el trabajo de preparar ' + T.propuesta + '.');
      if (c.s.noshow || (c.s.tCita != null && !c.s.citaOk && k.cita > 0 && k.cita < 2880)) add('noshow', c.s.noshow ? c.tAct : c.tAct, c.s.noshow ? 'No se presentó a ' + T.laCita : T.Cita + ' ' + dentroDe(k.cita) + ' sin confirmar', c.s.noshow ? 'Tenía interés suficiente para reservar. Se recupera con un mensaje, no con una llamada fría.' : 'Las citas sin confirmar son las que más fallan. El recordatorio del mismo día lo evita.');
      if (c.s.luego && !c.fin) add('reactivar', c.tAct, 'Dijo que ' + (c.s.luegoTxt || 'lo retomaría más adelante') + ' (' + c.s.luego + ')', 'No es un no. El sistema le vuelve a escribir en el momento que él mismo dijo.');
      if (c.fin === 'ganado' && x.riesgo >= 45) add('baja', c.tAct, x.riesgoM.slice(0, 2).map(function (m) { return m.txt; }).join(' · '), 'Perder a ' + T.unCliente + ' cuesta más que captar uno nuevo. Se detecta antes de que avise.');
      if (c.s.revision) add('revision', c.tAct, c.s.revisionTxt || 'Revisión pendiente', 'Quien ya confía en vosotros vuelve si se lo recuerdan en el momento justo.');
      if (c.s.exp) add('expansion', c.tAct, c.s.expTxt || 'Señales de que necesita más', 'Crecer con quien ya confía en vosotros es la venta más barata.');
      if (c.s.bloqueo) add('bloqueo', c.tAct, c.s.bloqueoTxt || 'Se ha quedado atascado', 'Si no desbloquea pronto, se va sin haber visto el valor.');
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Línea de tiempo: se construye con los datos. Primero el origen, luego lo
  // que hizo el contacto, lo que hizo el sistema y la conversación.
  // ---------------------------------------------------------------------------
  function timeline(c, cfg, ahora) {
    const T = cfg.t;
    const ev = [];
    const camp = cfg.campanas.filter(function (x) { return x.id === c.orig; })[0];
    const t0 = c.tCreado;
    if (cfg.timelineSinOrigen) {
      ev.push({ t: t0, tipo: 'sistema', texto: cfg.textoAlta ? cfg.textoAlta(c) : 'Alta en el sistema · ' + (c.etapaTxt || c.prod) });
    } else {
      if (camp) ev.push({ t: t0 - 2 * MIN, tipo: 'origen', texto: 'Anuncio · ' + camp.canal + ' · ' + camp.nombre });
      ev.push({ t: t0 - 1 * MIN, tipo: 'web', texto: 'Visita ' + T.paginaVisitas });
      ev.push({ t: t0, tipo: 'form', texto: 'Formulario enviado · ' + c.prod });
    }
    c.conv.forEach(function (m) {
      const quien = m.de === 'c' ? c.n.split(' ')[0] : m.de === 'a' ? 'Agente' : m.de === 'v' ? (T.agenteVoz || 'Agente de voz') : 'Equipo';
      const tipo = m.de === 'c' ? 'respuesta' : 'sistema';
      const canal = m.canal === 'wa' ? 'WhatsApp' : m.canal === 'email' ? 'Correo' : m.canal === 'voz' ? 'Llamada' : m.canal;
      ev.push({ t: m.t, tipo: tipo, texto: canal + (m.de === 'c' ? ' recibido de ' + quien : ' enviado · ' + quien), detalle: m.texto });
    });
    (c.ev || []).forEach(function (e) { ev.push({ t: e.t, tipo: e.tipo, texto: e.texto }); });
    if (c.s.tProp != null) ev.push({ t: c.s.tProp, tipo: 'sistema', texto: T.Propuesta + ' enviada · ' + euros(c.valor) });
    ev.sort(function (a, b) { return a.t - b.t; });
    return ev.filter(function (e) { return e.t <= ahora; });
  }

  // ---------------------------------------------------------------------------
  // Evaluación completa de un contacto
  // ---------------------------------------------------------------------------
  function evaluar(c, cfg, ahora) {
    const T = cfg.t;
    const k = {
      ahora: ahora,
      creado: desde(c.tCreado, ahora),
      act: desde(c.tAct, ahora),
      toque: c.tToque == null ? desde(c.tCreado, ahora) : desde(c.tToque, ahora),
      cita: c.s.tCita != null ? (c.s.tCita - ahora) / MIN : null,
      prop: c.s.tProp != null ? desde(c.s.tProp, ahora) : null
    };
    const rg = cfg.reglas || {};
    const fit = aplicar(rg.fit || [], c, k, T, rg.fitBase != null ? rg.fitBase : 20);
    const comp = aplicar((rg.comportamiento || []).concat(rg.soloPropiasComp ? [] : R.comportamiento), c, k, T, 8);
    const int = aplicar((rg.intencion || []).concat(R.intencion), c, k, T, 6);
    const rie = aplicar((rg.riesgo || []).concat(rg.soloPropiasRiesgo ? [] : R.riesgo), c, k, T, 4);
    const x = { fit: fit.v, comp: comp.v, int: int.v, riesgo: rie.v, fitM: fit.motivos, compM: comp.motivos, intM: int.motivos, riesgoM: rie.motivos, k: k };
    if (c.fin === 'ganado' && cfg.clienteSinIntencion) { x.int = Math.min(x.int, 40); }
    x.prio = prioridad(x, c);
    x.prioN = PRIO[x.prio].n;
    x.nba = (cfg.nba && cfg.nba(c, k, x, T, QV.motor)) || nbaGenerica(c, k, x, T);
    x.porque = porque(x, c, T);
    x.senales = senales(c, k, x, T, cfg);
    x.atencion = (x.prio === 'urgente' || x.prio === 'alta') && ['nada', 'asignado', 'cerrar', 'esperar'].indexOf(x.nba.id) < 0;
    x.orden = x.prioN * 1000 + x.oportunidad + x.riesgo * 0.2;
    return x;
  }

  function evaluarTodos(estado) {
    estado.contactos.forEach(function (c) { c.x = evaluar(c, estado.cfg, estado.ahora); });
    estado.contactos.sort(function (a, b) { return b.x.orden - a.x.orden; });
  }

  // ---------------------------------------------------------------------------
  // KPIs del mes y embudo: salen del volumen del mes del sector (campañas),
  // así que el embudo, el coste por venta y el retorno siempre cuadran.
  // ---------------------------------------------------------------------------
  function mes(cfg) {
    const camps = cfg.campanas;
    const et = cfg.recorrido.map(function (e) { return e.id; });
    const tot = {};
    et.forEach(function (id) { tot[id] = 0; });
    let inversion = 0, ingresos = 0;
    camps.forEach(function (cp) {
      inversion += cp.inversion || 0;
      et.forEach(function (id) { tot[id] += (cp.embudo[id] || 0); });
      ingresos += (cp.embudo[cfg.ventaEtapa] || 0) * (cp.ticket || cfg.ticket);
    });
    return { tot: tot, inversion: inversion, ingresos: ingresos };
  }

  // Dónde se pierde más: el salto entre etapas con peor conversión respecto a
  // lo normal en el sector (cfg.referencia).
  function fugas(cfg) {
    const m = mes(cfg);
    const r = cfg.recorrido;
    const out = [];
    for (let i = 1; i < r.length; i++) {
      const a = m.tot[r[i - 1].id], b = m.tot[r[i].id];
      if (!a || r[i].sinFuga || i === 1) continue;
      const conv = b / a;
      const ref = (cfg.referencia && cfg.referencia[r[i].id]) || conv;
      const perdidos = a - b;
      const recuperables = Math.max(0, Math.round(a * ref - b));
      out.push({ de: r[i - 1], a: r[i], conv: conv, ref: ref, perdidos: perdidos, recuperables: recuperables, gap: ref - conv });
    }
    out.sort(function (x, y) { return y.gap - x.gap; });
    return out;
  }

  QV.motor = {
    preparar: preparar, evaluar: evaluar, evaluarTodos: evaluarTodos, timeline: timeline, mes: mes, fugas: fugas,
    pl: pl, hace: hace, duracion: duracion, duracionLarga: duracionLarga, dentroDe: dentroDe, hora: hora, fechaCorta: fechaCorta, euros: euros, num: num, pct: pct,
    unir: unir, al: al, nombresSenal: nombresSenal, contesto: contesto, ultimoMsg: ultimoMsg, ultimoDe: ultimoDe, desde: desde, PRIO: PRIO, ESTADOS: ESTADOS, TIPOS_SENAL: TIPOS_SENAL, MIN: MIN, nbaGenerica: nbaGenerica
  };
})();
