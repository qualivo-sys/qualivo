/* Agente de voz y Agenda.
 * - Llamadas: cada contacto puede traer `llamadas` en su sector
 *   ([minutos, segundos, resultado, resumen, [lo que dijo]]). Si el sector no
 *   las trae, se deducen de su estado (sin cita y sin contestar → no cogió;
 *   con cita → agendó por teléfono; «más adelante» → pidió que le llamaran…),
 *   hasta que entre un 25 % y un 35 % de los contactos tengan llamadas.
 *   En el modo real no se deduce nada: solo lo que dice GHL.
 * - Agenda: la semana en curso con las citas del estado, quién las agendó,
 *   si están confirmadas, los plantones y los huecos libres. */
(function () {
  'use strict';
  const QV = window.QV = window.QV || {};
  const M = QV.motor;
  const MIN = M.MIN;

  const RES = {
    agendo: { txt: 'Agendó', tono: 'verde' },
    hablo: { txt: 'Habló', tono: 'azul' },
    luego: { txt: 'Llamar más tarde', tono: 'ambar' },
    nocontesta: { txt: 'No contestó', tono: 'gris' },
    nointeresa: { txt: 'No le interesa', tono: 'rojo' }
  };

  function hash(s) {
    let h = 2166136261;
    s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16;
    return (h >>> 0) % 100;
  }
  // «Raquel» si el sector le pone nombre; si no, «el agente de voz»
  function nombreVoz(T) { return T.agenteVoz ? T.agenteVoz.replace(/\s*\(.*\)$/, '') : 'el agente de voz'; }
  function tituloVoz(T) { const n = nombreVoz(T); return n.charAt(0).toUpperCase() + n.slice(1); }
  function deVoz(T) { const n = nombreVoz(T); return /^el /.test(n) ? 'del ' + n.slice(3) : 'de ' + n; }
  function duracionTxt(seg) { return !seg ? '' : seg < 60 ? seg + ' s' : Math.round(seg / 60) + ' min'; }
  function diaHora(t) {
    const d = new Date(t);
    return d.toLocaleDateString('es-ES', { weekday: 'long' }) + ' a las ' + M.hora(t);
  }
  function minus(x) { x = String(x || ''); return x.charAt(0).toLowerCase() + x.slice(1); }

  // Lo que dijo el contacto en la llamada (máx. 3 datos)
  function dijo(c, cfg) {
    const out = (cfg.vozDijo ? cfg.vozDijo(c) || [] : []).slice();
    if (c.s.urgTxt) out.push('Urgencia: ' + minus(c.s.urgTxt));
    if (c.s.pptoTxt) out.push('Presupuesto: ' + minus(c.s.pptoTxt));
    else if (c.s.ppto === 'no') out.push('Presupuesto: no lo tiene ahora');
    if (c.s.precio) out.push('Objeción: quiere saber el precio antes de decidir');
    if (c.s.financia) out.push('Pregunta por el pago a plazos');
    if (c.s.luegoTxt) out.push('Cuándo: ' + minus(c.s.luegoTxt));
    return out.filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 3);
  }

  function crear(c, t, seg, res, resumen, lista) {
    return { t: t, dur: seg, res: res, resumen: resumen, dijo: lista || [] };
  }

  // Deduce las llamadas de un contacto a partir de su estado.
  function deducir(c, cfg, ahora) {
    const T = cfg.t;
    const hh = hash(c.id + cfg.id);
    const contesto = M.contesto(c);
    const t10 = c.tCreado + 10 * MIN;
    if (t10 > ahora || c.id === 'demo') return null;
    if (c.fin === 'ganado') return null;
    if (c.conv.some(function (m) { return m.de === 'v'; })) return null; // el sector ya trae la voz en la conversación
    const lista = dijo(c, cfg);
    if (c.fin === 'perdido') {
      if (hh >= 55) return null;
      return [crear(c, t10 + 30 * MIN, 50 + hh, 'nointeresa', 'Cogió y dijo que ya no le interesa. ' + tituloVoz(T) + ' se despide con amabilidad y no se le vuelve a llamar.', [])];
    }
    if (c.s.tCita != null || c.s.noshow) {
      // Si la cita la cerró el agente de WhatsApp después de hablar mucho, no hace falta llamada
      if (c.canal !== 'tel' && contesto >= 2 && hh >= 50) return null;
      const conf = c.conv.filter(function (m) { return m.de !== 'c' && /cita|entrevista|reuni|visita|confirm|te espero|te dejo|agend|sesión|hueco/i.test(m.texto); })[0];
      const seg = 150 + hh * 3;
      let t = conf ? conf.t - (seg / 60 + 3) * MIN : t10;
      if (t < c.tCreado + 5 * MIN) t = c.tCreado + 5 * MIN;
      const cuando = c.s.tCita != null ? ' para el ' + diaHora(c.s.tCita) : '';
      const motivo = cfg.vozMotivo ? cfg.vozMotivo(c) : 'Le interesa ' + c.prod + '.';
      return [crear(c, t, seg, 'agendo', motivo + ' Agendó ' + T.laCita + cuando + ' y le llegó la confirmación por WhatsApp.', lista)];
    }
    if (c.s.luego) {
      if (hh >= 80) return null;
      const t = c.tAct - 20 * MIN > c.tCreado ? c.tAct - 20 * MIN : t10;
      return [crear(c, t, 60 + hh, 'luego', 'Cogió, pero no era buen momento: ' + (c.s.luegoTxt ? 'dijo que ' + minus(c.s.luegoTxt) : 'pidió que le llamaran más adelante') + '. Queda la rellamada programada con lo que contó.', lista)];
    }
    if (contesto === 0 && ((c.s.intentos || 0) >= 1 || c.x0creado > 120)) {
      if (hh >= 55 && c.canal !== 'tel') return null;
      const out = [crear(c, t10, 0, 'nocontesta', 'No cogió. Se deja un mensaje de voz de 15 segundos y la cadencia sigue por WhatsApp.', [])];
      if ((c.s.intentos || 0) >= 2 && hh < 30 && c.tCreado + 30 * 60 * MIN < ahora) out.push(crear(c, c.tCreado + 30 * 60 * MIN, 0, 'nocontesta', 'Segundo intento, en otra franja horaria. Tampoco cogió.', []));
      return out;
    }
    if (contesto > 0 && c.canal === 'tel') {
      const u = c.conv.filter(function (m) { return m.de === 'c'; })[0];
      const t = u ? u.t - 2 * MIN : t10;
      return [crear(c, Math.max(t, c.tCreado + 5 * MIN), 200 + hh * 2, 'hablo', 'Habló con ' + nombreVoz(T) + ' sobre ' + c.prod + ' y pidió que le mandaran la información por WhatsApp para decidir.', lista)];
    }
    return null;
  }

  // Completa las llamadas de todos los contactos del estado.
  function completar(estado) {
    const cfg = estado.cfg, ahora = estado.ahora;
    const cs = estado.contactos;
    if (!cfg.real) cs.forEach(function (c) { if (c.s.tCita != null) c.s.tCita = ajustarHora(c.s.tCita, cfg, ahora); });
    cs.forEach(function (c) {
      c.x0creado = (ahora - c.tCreado) / MIN;
      if (c.llamadas) return; // ya preparadas desde el sector
      c.llamadas = [];
      if (cfg.vozAuto === false) return;
      const l = deducir(c, cfg, ahora);
      if (l) c.llamadas = l;
    });
    if (cfg.vozAuto === false) return;
    // Reparto: entre un 25 % y un 35 % de los contactos con llamadas
    const conLl = function () { return cs.filter(function (c) { return c.llamadas.length; }); };
    const max = Math.ceil(cs.length * 0.35), min = Math.ceil(cs.length * 0.25);
    const soloNo = function (c) { return c.llamadas.length && c.llamadas.every(function (l) { return l.res === 'nocontesta'; }); };
    const maxNo = Math.ceil(max * 0.4);
    cs.filter(soloNo).sort(function (a, b) { return hash(b.id) - hash(a.id); }).slice(maxNo).forEach(function (c) { c.llamadas = []; });
    if (conLl().length > max) {
      conLl().filter(function (c) { return c.llamadas.every(function (l) { return l.res === 'nocontesta'; }); })
        .sort(function (a, b) { return hash(b.id) - hash(a.id); })
        .slice(0, conLl().length - max).forEach(function (c) { c.llamadas = []; });
    }
    if (conLl().length < Math.round((min + max) / 2)) {
      cs.filter(function (c) { return !c.llamadas.length && !c.fin && M.contesto(c) > 0 && c.tCreado + 20 * MIN < ahora && !c.conv.some(function (m) { return m.de === 'v'; }); })
        .sort(function (a, b) { return hash(a.id + 'x') - hash(b.id + 'x'); })
        .slice(0, Math.round((min + max) / 2) - conLl().length).forEach(function (c) {
          const u = c.conv.filter(function (m) { return m.de === 'c'; })[0];
          const t = Math.max(c.tCreado + 10 * MIN, (u ? u.t : c.tCreado + 30 * MIN) - 3 * MIN);
          c.llamadas = [crear(c, Math.min(t, ahora - MIN), 180 + hash(c.id) * 2, 'hablo', 'Habló con ' + nombreVoz(cfg.t) + ': ' + (cfg.vozMotivo ? cfg.vozMotivo(c) : 'le interesa ' + c.prod + '.') + ' Siguió la conversación por WhatsApp.', dijo(c, cfg))];
        });
    }
    cs.forEach(function (c) { c.llamadas.sort(function (a, b) { return a.t - b.t; }); });
  }

  // Convierte las llamadas escritas en el sector (minutos relativos) a instantes.
  function preparar(crudo, c, t0) {
    if (!crudo.llamadas) return;
    c.llamadas = crudo.llamadas.map(function (l) { return { t: t0 - l[0] * MIN, dur: l[1], res: l[2], resumen: l[3], dijo: l[4] || [] }; });
  }

  // ---------------------------------------------------------------------------
  // Agenda de la semana
  // ---------------------------------------------------------------------------
  function slotsDe(cfg) {
    const a = cfg.agenda || {};
    const h = a.horas || [9, 19], pausa = a.pausa || [14, 15];
    const out = [];
    for (let x = h[0]; x < h[1]; x++) if (!(x >= pausa[0] && x < pausa[1])) out.push(x);
    return out;
  }
  // Lleva una cita a una hora de consulta (en punto), de lunes a viernes
  function ajustarHora(t, cfg, ahora) {
    const slots = slotsDe(cfg), sab = (cfg.agenda || {}).sabado;
    const d = new Date(t);
    const dia = d.getDay();
    if (dia === 0 || (dia === 6 && !sab)) { d.setDate(d.getDate() + (dia === 0 ? 1 : 2)); d.setHours(slots[0] + 1, 0, 0, 0); return d.getTime(); }
    const h = d.getHours() + (d.getMinutes() >= 30 ? 1 : 0);
    const cerca = slots.slice().sort(function (x, y) { return Math.abs(x - h) - Math.abs(y - h) || x - y; })[0];
    d.setHours(cerca, 0, 0, 0);
    if (d.getTime() <= ahora && t > ahora) { const fut = slots.filter(function (x) { return x > new Date(ahora).getHours(); })[0]; if (fut != null) d.setHours(fut, 0, 0, 0); else { d.setDate(d.getDate() + 1); d.setHours(slots[0], 0, 0, 0); } }
    return d.getTime();
  }

  function lunes(t) {
    const d = new Date(t); d.setHours(0, 0, 0, 0);
    const dia = (d.getDay() + 6) % 7;
    return d.getTime() - dia * 1440 * MIN;
  }
  function porDe(c) {
    if (c.s.citaPor) return c.s.citaPor;
    if ((c.llamadas || []).some(function (l) { return l.res === 'agendo'; })) return 'voz';
    if (c.conv.some(function (m) { return m.de === 'a'; })) return 'wa';
    return 'persona';
  }

  // Semana que se ve por defecto: la actual; en fin de semana, la siguiente
  function semanaDefecto(ahora) { const d = new Date(ahora).getDay(); return d === 0 || d === 6 ? 1 : 0; }
  function semanaDe(t, ahora) { return Math.round((lunes(t) - lunes(ahora)) / (7 * 1440 * MIN)); }

  function agenda(estado, off) {
    const cfg = estado.cfg, T = cfg.t, a = cfg.agenda || {}, ahora = estado.ahora;
    const slots = slotsDe(cfg);
    const nDias = a.sabado ? 6 : 5;
    if (off == null) off = estado.agendaOff != null ? estado.agendaOff : semanaDefecto(ahora);
    const l0 = lunes(ahora) + off * 7 * 1440 * MIN;
    const dias = [];
    for (let i = 0; i < nDias; i++) dias.push({ i: i, t: l0 + i * 1440 * MIN });
    const fin = l0 + nDias * 1440 * MIN;
    const ocupado = {};
    const items = [];
    const hoyI = Math.floor((ahora - l0) / (1440 * MIN));
    const pasado = function (dia, h) { return l0 + dia * 1440 * MIN + (h + 1) * 60 * MIN <= ahora; };
    function colocar(t, it) {
      if (t < l0 || t >= fin) return false;
      const dia = Math.floor((t - l0) / (1440 * MIN));
      const hr = new Date(t).getHours();
      // hora laborable más cercana, y si está ocupada, la siguiente libre
      const orden = slots.slice().sort(function (x, y) { return Math.abs(x - hr) - Math.abs(y - hr) || x - y; });
      const h = orden.filter(function (x) { return !ocupado[dia + ':' + x]; })[0];
      if (h == null) return false;
      ocupado[dia + ':' + h] = true;
      it.dia = dia; it.h = h; it.t = l0 + dia * 1440 * MIN + h * 60 * MIN;
      items.push(it);
      return true;
    }
    const idxCita = cfg.recorrido.map(function (e) { return e.id; }).indexOf(a.etapa || (cfg.kpiEtapas || {}).entrevistas);
    estado.contactos.forEach(function (c) {
      if (c.s.tCita != null) {
        const riesgo = !c.s.citaOk && c.s.tCita - ahora < 2880 * MIN;
        colocar(c.s.tCita, { c: c, por: porDe(c), estado: c.s.tCita < ahora ? 'asistio' : c.s.citaOk ? 'confirmada' : 'sinconfirmar', riesgo: riesgo });
      }
      if (c.s.noshow) {
        const e = (c.ev || []).filter(function (x) { return /no se present|no vino|plant/i.test(x.texto); })[0];
        const t = e ? e.t : c.tAct;
        if (t < ahora) colocar(t, { c: c, por: porDe(c), estado: c.s.tCita != null || c.x.nba.id === 'reprogramar' ? 'recuperando' : 'planton' });
      }
      if (!cfg.real && idxCita > 0 && c.s.tCita == null && !c.s.noshow && c.fin !== 'perdido' && c.etapa >= idxCita && c.tAct < ahora && c.tAct >= l0) {
        colocar(c.tAct - 60 * MIN, { c: c, por: porDe(c), estado: 'asistio' });
      }
    });
    // Resto de la agenda (otras citas del centro que no están en la muestra)
    if (!cfg.real && a.relleno !== false) {
      const m = M.mes(cfg), md = cfg.mesDatos || {};
      const et = (cfg.kpiEtapas || {}).entrevistas;
      let show = md.agendadas && et ? m.tot[et] / md.agendadas : 0.82;
      show = Math.max(0.65, Math.min(0.94, show || 0.82));
      const ocup = a.ocupacion || 0.5;
      const tipos = a.tipos || [T.Cita];
      dias.forEach(function (d) {
        slots.forEach(function (h) {
          const k = d.i + ':' + h;
          if (ocupado[k]) return;
          const r = hash(cfg.id + k + (off ? 'w' + off : ''));
          const hoyFuturo = d.i > hoyI || (d.i === hoyI && !pasado(d.i, h));
          if (r >= ocup * 100 * (hoyFuturo ? (off > 0 ? 0.8 : 1) : 1.15)) return;
          const r2 = hash(k + cfg.id + 'e' + off), r3 = hash(k + 'p' + cfg.id + off);
          const est = hoyFuturo ? (r2 < 76 ? 'confirmada' : 'sinconfirmar') : (r2 < show * 100 ? 'asistio' : r2 < show * 100 + (100 - show * 100) * 0.55 ? 'recuperando' : 'planton');
          ocupado[k] = true;
          items.push({ relleno: true, tipo: tipos[r3 % tipos.length], por: r3 < 36 ? 'voz' : r3 < 78 ? 'wa' : 'persona', estado: est, dia: d.i, h: h, t: d.t + h * 60 * MIN, riesgo: est === 'sinconfirmar' && d.t + h * 60 * MIN - ahora < 2880 * MIN });
        });
      });
    }
    const libres = [];
    dias.forEach(function (d) { slots.forEach(function (h) { if (!ocupado[d.i + ':' + h] && !pasado(d.i, h)) libres.push({ dia: d.i, h: h }); }); });
    const pasadas = items.filter(function (it) { return ['asistio', 'planton', 'recuperando'].indexOf(it.estado) >= 0; });
    const asistio = pasadas.filter(function (it) { return it.estado === 'asistio'; }).length;
    const plantones = pasadas.filter(function (it) { return it.estado !== 'asistio'; });
    return {
      off: off, l0: l0, porDelante: items.filter(function (it) { return it.t >= ahora; }).length,
      dias: dias, slots: slots, items: items, libres: libres, hoyI: hoyI, pasado: pasado,
      total: items.length,
      voz: items.filter(function (it) { return it.por === 'voz'; }).length,
      asistencia: pasadas.length ? asistio / pasadas.length : null,
      plantones: plantones.length,
      recuperando: plantones.filter(function (it) { return it.estado === 'recuperando'; }).length,
      riesgo: items.filter(function (it) { return it.riesgo; }),
      proximas: items.filter(function (it) { return !it.relleno && it.t >= ahora; }).sort(function (x, y) { return x.t - y.t; })
    };
  }

  // Llamadas de los últimos `dias` días
  function llamadasDe(estado, dias) {
    const desde = estado.ahora - (dias || 7) * 1440 * MIN;
    const out = [];
    estado.contactos.forEach(function (c) {
      (c.llamadas || []).forEach(function (l) { if (l.t >= desde && l.t <= estado.ahora) out.push({ c: c, l: l }); });
    });
    return out.sort(function (a, b) { return b.l.t - a.l.t; });
  }

  // Historia genérica del modo demo para los sectores que no traen la suya:
  // no contesta al WhatsApp → a los 10 minutos le llama el agente de voz → cita.
  function historiaGenerica(cfg) {
    const T = cfg.t;
    const base = (cfg.historias && cfg.historias[cfg.historiaDefecto] && cfg.historias[cfg.historiaDefecto].contacto) || null;
    if (!base) return null;
    const idx = function (id) { return Math.max(1, cfg.recorrido.map(function (e) { return e.id; }).indexOf(id)); };
    const iCita = idx((cfg.agenda || {}).etapa || (cfg.kpiEtapas || {}).entrevistas);
    const c = JSON.parse(JSON.stringify(base));
    const nom = c.n.split(' ')[0];
    const voz = nombreVoz(T);
    const camp = (cfg.campanas || []).filter(function (x) { return x.id === c.orig; })[0];
    const cuando = new Date(); cuando.setDate(cuando.getDate() + (cuando.getDay() >= 4 ? 4 : 2)); cuando.setHours(17, 0, 0, 0);
    const minCita = Math.round((cuando.getTime() - Date.now()) / MIN) - 14;
    const diaTxt = cuando.toLocaleDateString('es-ES', { weekday: 'long' });
    return {
      titulo: 'No contesta al WhatsApp y le llama ' + nombreVoz(T),
      contacto: c,
      pasos: [
        { dur: 5, min: 0, txt: 'Entra una solicitud nueva' + (camp ? ' desde ' + camp.canal : ''), feed: 'Nueva solicitud · ' + c.prod, cambio: {} },
        { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola ' + nom + ', te escribo por ' + c.prod + '. ¿Te va bien que te llamemos dos minutos para ver qué necesitas?'] }, toque: true },
        { dur: 5, min: 9, txt: 'Diez minutos sin respuesta: la cadencia pasa a voz', feed: 'Sin respuesta al WhatsApp · llamada programada', cambio: { s: { intentos: 1 } } },
        { dur: 14, min: 1, txt: tituloVoz(T) + ' le llama y cualifica en la llamada', feed: 'Llamada del agente de voz · 3 min · agendó', act: true,
          llamada: { dur: 190, res: 'agendo', resumen: 'Cogió a la primera: no había visto el WhatsApp. Lo quiere cuanto antes. Agendó ' + T.laCita + ' del ' + diaTxt + ' a las 17:00.', dijo: ['Urgencia: lo quiere cuanto antes', 'Prefiere hablar por teléfono'],
            trans: [['v', 'Hola ' + nom + ', soy ' + (T.nombreAgenteVoz || nombreVoz(T).replace(/^el agente de voz$/, 'Sara')) + '. Te llamo porque pediste información de ' + c.prod + '. ¿Tienes un minuto?'], ['c', 'Sí, dime. No había visto el WhatsApp.'], ['v', '¿Para cuándo lo necesitarías?'], ['c', 'Lo antes posible, la verdad.'], ['v', 'Te propongo ' + T.laCita + ' el ' + diaTxt + ' a las 17:00. ¿Te va bien?'], ['c', 'Perfecto, apúntame.']] },
          cambio: { etapa: Math.min(iCita - 1, 3), s: { urg: true, urgTxt: 'lo quiere cuanto antes' } } },
        { dur: 7, min: 4, txt: T.Cita + ' en la Agenda, confirmada por WhatsApp', feed: T.Cita + ' agendada por el agente de voz · ' + diaTxt + ' 17:00', vista: 'agenda', toque: true,
          cambio: { etapa: iCita, s: { cita: minCita, citaOk: true }, conv: ['a', 'wa', 'Te confirmo ' + T.laCita + ' el ' + diaTxt + ' a las 17:00. El día antes te mando un recordatorio.'] } },
        { dur: 7, min: 1, txt: 'Recordatorio programado para el día antes', feed: 'Recordatorio de ' + T.cita + ' programado' }
      ]
    };
  }

  // Un hueco para las historias del modo demo: dentro de 2-4 días laborables a las 17:00
  function hueco(hora) {
    const d = new Date(); d.setDate(d.getDate() + 2);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    d.setHours(hora || 17, 0, 0, 0);
    return { txt: d.toLocaleDateString('es-ES', { weekday: 'long' }), min: Math.round((d.getTime() - Date.now()) / MIN) };
  }

  QV.voz = { hueco: hueco, semanaDe: semanaDe, semanaDefecto: semanaDefecto, RES: RES, completar: completar, preparar: preparar, agenda: agenda, llamadasDe: llamadasDe, historiaGenerica: historiaGenerica, duracionTxt: duracionTxt, nombreVoz: nombreVoz, tituloVoz: tituloVoz, deVoz: deVoz, porDe: porDe, dijo: dijo };
})();
