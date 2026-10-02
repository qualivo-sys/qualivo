// Informes de Qualivo Intelligence (brief content/briefs/intelligence-informes-por-periodo.md,
// Maikel 2-oct-2026): el embudo por mes y por semana, por vertical, con la tabla de tratos abiertos.
//
// Solo lectura: todo son GET a Meta y a GHL. Devuelve registros sueltos (un día de gasto, un lead,
// una cita, un trato) y la pantalla los agrupa por el periodo y la vertical que se elijan, así que
// la cifra de un mes y la suma de sus semanas salen del mismo sitio.
//
// Reglas del brief:
// - Reuniones desde el 1-oct: registro por cita (nota ##QV-CITA## de api/_citas.js). Antes, se
//   reconstruyen con la etiqueta reunion-celebrada / no-presentado, el estado de la cita y la etapa
//   del trato, y se marcan «reconstruido».
// - Diagnósticos y segundas reuniones no se mezclan (tipo de _citas.tipoDe).
// - Lo que no se puede reconstruir sale como «NO MEDIDO», nunca con una cifra inventada.

const ZONA = 'Europe/Madrid';
const MESES = 4;                       // el mes en curso y los 3 anteriores
const REGISTRO_DESDE = Date.parse('2026-10-01T00:00:00+02:00');
const PROSPECCION = 'JaB4LIwUqFn96LLFEhSm';
// Etapas del pipeline de Prospección (prefijo del id, como en el brief) y, por si cambian, el nombre.
const ETAPAS = [
  { k: 'oferta', id: '41c3a02d', re: /oferta|propuesta/i },
  { k: 'segunda', id: 'b853294d', re: /segunda/i },
  { k: 'negociacion', id: '3e12a08f', re: /negociaci/i },
  { k: 'piloto', id: '138c0901', re: /piloto/i },
  { k: 'cliente', id: '673ee555', re: /cliente/i }
];
const MARCA = '##QV-CITA##';

function etapaClave(id, nombre) {
  const e = ETAPAS.filter(function (x) { return String(id || '').indexOf(x.id) === 0; })[0] ||
    ETAPAS.filter(function (x) { return x.re.test(String(nombre || '')); })[0];
  return e ? e.k : '';
}

// Vertical por nombre de campaña o conjunto (Meta) o por la etiqueta sector-* (GHL)
function vertical(txt) {
  const v = String(txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/formaci|academ|escuela|master/.test(v)) return 'formacion';
  if (/clinic|salud|estet|dental|fisio|bienestar/.test(v)) return 'clinica';
  if (/reform|constru|instala/.test(v)) return 'reformas';
  if (/asesor|consult|abogad|gestor|profesional/.test(v)) return 'asesoria';
  return '';
}
function verticalContacto(tags) {
  const s = tags.filter(function (t) { return t.indexOf('sector-') === 0; })[0];
  return s ? (vertical(s) || 'otro') : '';
}

// Día en Madrid «AAAA-MM-DD» de un instante
function diaMadrid(t) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
}

function leerRegistros(notas) {
  const out = {};
  (notas || []).forEach(function (n) {
    const b = String((n && n.body) || '');
    const i = b.indexOf(MARCA);
    if (i === -1) return;
    try { const d = JSON.parse(b.slice(i + MARCA.length).trim()); if (d && d.appointment_id && !out[d.appointment_id]) out[d.appointment_id] = d; } catch (e) { /* nota rota */ }
  });
  return out;
}

// Tipo de cita: el de api/_citas.js si se puede cargar; si no, la misma regla en corto.
let tipoDeCitas = null;
try { tipoDeCitas = require('./_citas.js').tipoDe; } catch (e) { tipoDeCitas = null; }
function tipoCita(ev, contacto, registro) {
  if (registro && registro.tipo) return registro.tipo_manual || registro.tipo;
  if (tipoDeCitas) { try { return tipoDeCitas(ev, contacto, registro).tipo; } catch (e) { /* abajo */ } }
  if (/segunda\s+reuni/i.test(String(ev.title || ''))) return 'segunda';
  return /diagn/i.test(String(ev.title || '')) ? 'diagnostico' : 'otro';
}

function resultadoDe(txt) {
  const s = String(txt || '').toLowerCase();
  if (/cancel/.test(s)) return 'cancelada';
  if (/no.?show|no.?present|no vino|plant/.test(s)) return 'noshow';
  if (/celebr|efectiv|showed|asisti|vino|hecha/.test(s)) return 'efectiva';
  return '';
}

// D = utilidades del endpoint: { ghl, meta, leer, fecha, fechaEtiqueta, origenDe, enParalelo }
async function informe(D) {
  const ahora = Date.now();
  const hasta = ahora + 45000;
  const avisos = [];
  const hoy = diaMadrid(ahora).split('-').map(Number);
  const m0 = new Date(Date.UTC(hoy[0], hoy[1] - 1 - (MESES - 1), 1));
  const desdeDia = m0.toISOString().slice(0, 10);
  const desde = D.fecha(desdeDia + ' 00:00:00');
  // La semana del día 1 empieza antes: se lee desde su lunes para que esa semana salga entera.
  const lunesDesde = desde - ((new Date(desde + 12 * 3600000).getUTCDay() + 6) % 7) * 86400000;
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);

  // ---------- Meta: gasto y leads por día y conjunto ----------
  const gasto = [];
  let metaOk = true;
  try {
    let d = await D.meta('/act_3453332464718877/insights', {
      level: 'adset', time_increment: '1', limit: '500',
      time_range: JSON.stringify({ since: diaMadrid(lunesDesde), until: diaMadrid(ahora) }),
      fields: 'campaign_id,campaign_name,adset_name,spend,actions'
    });
    for (let p = 0; p < 20; p++) {
      (d.data || []).forEach(function (r) {
        if (!/^QV_/.test(r.campaign_name || '')) return;
        const lead = (r.actions || []).filter(function (a) { return a.action_type === 'lead'; })[0];
        const g = Number(r.spend || 0), l = lead ? Number(lead.value || 0) : 0;
        if (!g && !l) return;
        gasto.push({ d: r.date_start, c: String(r.campaign_id), v: vertical(r.adset_name) || vertical(r.campaign_name) || 'general', g: Math.round(g * 100) / 100, l: l });
      });
      if (!(d.paging && d.paging.next) || Date.now() > hasta - 30000) break;
      d = await D.leer(d.paging.next, { 'User-Agent': 'QualivoIntelligence/1.0' });
    }
  } catch (e) { metaOk = false; avisos.push('No se ha podido leer Meta: la inversión, las campañas y los leads de la plataforma salen como NO MEDIDO.'); }

  // ---------- GHL: contactos (leads del CRM y datos para las citas) ----------
  const contactos = {};
  const leads = [];
  let crmOk = true;
  try {
    let url = '/contacts/?locationId=' + loc + '&limit=100';
    for (let p = 0; p < 40 && Date.now() < hasta - 25000; p++) {
      const d = await D.ghl(url);
      const lote = d.contacts || [];
      lote.forEach(function (c) { contactos[c.id] = c; });
      const m = d.meta || {};
      if (lote.length < 100 || !m.startAfterId) break;
      const ultima = D.fecha(lote[lote.length - 1].dateAdded);
      if (ultima && ultima < lunesDesde && D.fecha(lote[0].dateAdded) >= ultima) break;
      url = '/contacts/?locationId=' + loc + '&limit=100&startAfterId=' + encodeURIComponent(m.startAfterId) + (m.startAfter ? '&startAfter=' + encodeURIComponent(m.startAfter) : '');
    }
  } catch (e) { crmOk = false; avisos.push('No se han podido leer los contactos de GHL: los leads del CRM salen como NO MEDIDO.'); }
  const fuera = function (c) {
    const tags = (c.tags || []).map(String);
    return tags.indexOf('demo') >= 0 || /\b(prueba|test)\b/i.test([c.firstName, c.lastName, c.contactName].join(' '));
  };
  const esPago = function (c) { const tags = ((c && c.tags) || []).map(String); return tags.indexOf('paid') >= 0 || tags.indexOf('leadform') >= 0; };
  Object.keys(contactos).forEach(function (id) {
    const c = contactos[id];
    if (fuera(c) || !esPago(c)) return;
    const tags = (c.tags || []).map(String);
    const t = D.fechaEtiqueta(tags, 'act-ini-') || D.fecha(c.dateAdded);
    if (t && t >= lunesDesde) leads.push({ t: t, v: verticalContacto(tags) || 'sin' });
  });

  // ---------- Tratos de Prospección ----------
  const tratos = [];
  const tratoDe = {};
  let tratosOk = true;
  let nombresEtapa = {};
  try {
    const pl = await D.ghl('/opportunities/pipelines?locationId=' + loc);
    (pl.pipelines || []).forEach(function (p) { (p.stages || []).forEach(function (s) { nombresEtapa[s.id] = s.name; }); });
  } catch (e) { /* se clasifica por id */ }
  try {
    for (let page = 1; page <= 10 && Date.now() < hasta - 20000; page++) {
      const d = await D.ghl('/opportunities/search?location_id=' + loc + '&pipeline_id=' + PROSPECCION + '&limit=100&page=' + page);
      const lista = d.opportunities || [];
      lista.forEach(function (o) {
        const cid = o.contactId || (o.contact && o.contact.id);
        const nombreEt = nombresEtapa[o.pipelineStageId] || '';
        const k = etapaClave(o.pipelineStageId, nombreEt);
        const tr = { id: o.id, cid: cid, k: k, etapa: nombreEt, estado: String(o.status || ''), importe: Number(o.monetaryValue || 0),
          cambio: D.fecha(o.lastStageChangeAt) || D.fecha(o.updatedAt) || D.fecha(o.createdAt), o: o };
        tratos.push(tr);
        if (cid) tratoDe[cid] = tr;
      });
      if (lista.length < 100) break;
    }
  } catch (e) { tratosOk = false; avisos.push('No se han podido leer los tratos de GHL: propuestas, pilotos, clientes y dinero en juego salen como NO MEDIDO.'); }

  // ---------- Citas ----------
  const eventos = [];
  let citasOk = true;
  try {
    const cals = await D.ghl('/calendars/?locationId=' + loc);
    for (const cal of (cals.calendars || [])) {
      const d = await D.ghl('/calendars/events?locationId=' + loc + '&calendarId=' + encodeURIComponent(cal.id) + '&startTime=' + lunesDesde + '&endTime=' + (ahora + 60 * 86400000));
      (d.events || []).forEach(function (e) { if (e.contactId && D.fecha(e.startTime)) eventos.push(e); });
    }
  } catch (e) { citasOk = false; avisos.push('No se ha podido leer el calendario de GHL: las reuniones salen como NO MEDIDO.'); }
  // Contactos con cita que no estaban en la lista (más antiguos)
  const faltan = eventos.map(function (e) { return e.contactId; }).filter(function (id, i, a) { return !contactos[id] && a.indexOf(id) === i; }).slice(0, 80);
  if (faltan.length) {
    const tr = await D.enParalelo(faltan, 5, function (id) { return D.ghl('/contacts/' + encodeURIComponent(id)).then(function (d) { return d.contact || null; }); }, hasta - 15000);
    tr.forEach(function (c) { if (c) contactos[c.id] = c; });
  }
  // Registro por cita (desde el 1-oct): una lectura de notas por contacto con cita desde esa fecha
  const conRegistro = eventos.filter(function (e) { return D.fecha(e.startTime) >= REGISTRO_DESDE; }).map(function (e) { return e.contactId; })
    .filter(function (id, i, a) { return a.indexOf(id) === i; }).slice(0, 80);
  const registros = {};
  const notas = await D.enParalelo(conRegistro, 5, function (id) { return D.ghl('/contacts/' + encodeURIComponent(id) + '/notes'); }, hasta - 8000);
  conRegistro.forEach(function (id, i) { if (notas[i]) Object.assign(registros, leerRegistros(notas[i].notes)); });

  // Cada cita con su tipo y resultado
  const porContacto = {};
  eventos.forEach(function (e) { (porContacto[e.contactId] = porContacto[e.contactId] || []).push(e); });
  const citas = [];
  Object.keys(porContacto).forEach(function (cid) {
    const c = contactos[cid] || { tags: [] };
    if (fuera(c)) return;
    const tags = (c.tags || []).map(String);
    const tr = tratoDe[cid];
    const lista = porContacto[cid].sort(function (a, b) { return D.fecha(a.startTime) - D.fecha(b.startTime); });
    // El tipo se decide como el día de la cita: sin las etiquetas que puso esa misma reunión
    // (reunion-celebrada, cliente…), que si no convertirían el diagnóstico en «otro».
    const sinPrevia = Object.assign({}, c, { tags: tags.filter(function (t) { return !/^(reunion-celebrada|segunda-reunion|cliente|cliente-.+|piloto|piloto-.+)$/.test(t); }) });
    const conTipo = lista.map(function (e) { const reg = registros[e.id]; return { e: e, reg: reg, tipo: tipoCita(e, sinPrevia, reg), t: D.fecha(e.startTime) }; });
    let huboNoshow = false, huboEfectiva = false;
    conTipo.forEach(function (x, i) {
      if (huboEfectiva && x.tipo === 'diagnostico' && !(x.reg && x.reg.tipo)) x.tipo = 'otro';
      const estado = String((x.reg && x.reg.status) || x.e.appointmentStatus || x.e.status || '').toLowerCase();
      // Desde el 1-oct manda el registro por cita; antes, todo lo que ya pasó cuenta como reconstruido.
      let res = '', fuente = x.t >= REGISTRO_DESDE && x.reg ? 'registro' : 'reconstruido';
      if (/cancel|invalid/.test(estado)) res = 'cancelada';
      else if (x.t > ahora) { res = 'pendiente'; fuente = 'futura'; }
      else {
        res = (x.reg && resultadoDe(x.reg.resultado)) || resultadoDe(estado);
        if (!res) {
          fuente = 'reconstruido';
          const mismas = conTipo.filter(function (y) { return y.tipo === x.tipo && y.t <= ahora && !/cancel|invalid/.test(String(y.e.appointmentStatus || '')); });
          const ultima = mismas[mismas.length - 1] === x;
          if (!ultima) res = 'noshow';                              // hubo otra del mismo tipo después: no se celebró
          else if (x.tipo === 'segunda' && (tags.indexOf('segunda-reunion') >= 0 || (tr && ['negociacion', 'piloto', 'cliente'].indexOf(tr.k) >= 0))) res = 'efectiva';
          else if (tags.indexOf('no-presentado') >= 0 && x.tipo !== 'segunda') res = 'noshow';
          else if (tags.indexOf('reunion-celebrada') >= 0) res = 'efectiva';
          else if (tr && tr.k && x.tipo !== 'segunda') res = 'efectiva';  // ya está en oferta o más allá
          else if (tr && /no presentado/i.test(tr.etapa)) res = 'noshow';
          else res = 'nomedido';
        }
      }
      const recuperada = res === 'efectiva' && x.tipo === 'diagnostico' && huboNoshow;
      if (res === 'noshow' && x.tipo === 'diagnostico') huboNoshow = true;
      if (res === 'efectiva') huboEfectiva = true;
      if (x.t < lunesDesde) return;
      citas.push({ t: x.t, tipo: x.tipo, res: res, fuente: fuente, pago: esPago(c), v: verticalContacto(tags) || 'sin', rec: recuperada || undefined });
    });
  });

  // ---------- Tratos: cambios de etapa por periodo y foto de hoy ----------
  const cambios = tratos.filter(function (tr) { return tr.k && tr.cambio && tr.cambio >= lunesDesde && !/lost|abandon/.test(tr.estado); })
    .map(function (tr) { const c = contactos[tr.cid]; return { t: tr.cambio, k: tr.k, v: verticalContacto(((c && c.tags) || (tr.o.contact && tr.o.contact.tags) || []).map(String)) || 'sin' }; });
  const abiertos = tratos.filter(function (tr) { return /open/.test(tr.estado) && tr.importe > 0; }).map(function (tr) {
    const c = contactos[tr.cid] || tr.o.contact || {};
    const tags = (c.tags || []).map(String);
    const prox = (porContacto[tr.cid] || []).map(function (e) { return { t: D.fecha(e.startTime), e: e }; })
      .filter(function (x) { return x.t > ahora && !/cancel|invalid/.test(String(x.e.appointmentStatus || '')); }).sort(function (a, b) { return a.t - b.t; })[0];
    return {
      empresa: String(c.companyName || tr.o.name || c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || '—').slice(0, 60),
      etapa: tr.etapa || tr.k, k: tr.k, importe: tr.importe, v: verticalContacto(tags) || 'sin', origen: D.origenDe(tags), cambio: tr.cambio,
      siguiente: prox ? { t: prox.t, tipo: tipoCita(prox.e, c, registros[prox.e.id]) } : null
    };
  }).sort(function (a, b) { return b.importe - a.importe; });
  const foto = tratosOk ? {
    enJuego: tratos.filter(function (tr) { return /open/.test(tr.estado) && ['oferta', 'segunda', 'negociacion'].indexOf(tr.k) >= 0; }).reduce(function (a, tr) { return a + tr.importe; }, 0),
    enNegociacion: tratos.filter(function (tr) { return /open/.test(tr.estado) && tr.k === 'negociacion'; }).length,
    clientesActivos: tratos.filter(function (tr) { return tr.k === 'cliente' && !/lost|abandon/.test(tr.estado); }).length,
    pilotos: tratos.filter(function (tr) { return tr.k === 'piloto' && !/lost|abandon/.test(tr.estado); }).length
  } : null;

  return {
    generado: ahora, desde: desdeDia, avisos: avisos,
    ok: { meta: metaOk, crm: crmOk, tratos: tratosOk, citas: citasOk },
    gasto: gasto, leads: leads, citas: citas, cambios: cambios, foto: foto, abiertos: abiertos
  };
}

module.exports = { informe: informe, vertical: vertical, etapaClave: etapaClave, resultadoDe: resultadoDe };
