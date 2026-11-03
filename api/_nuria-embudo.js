// Intelligence de Nuria · embudo completo de UNA puerta de entrada para las
// personas que se registraron en un periodo (cohorte). Lo usa
// api/intelligence-nuria.js (?accion=embudo), solo con sesión.
//
// Exacto (toda la cohorte): registros, bajas de email, citas agendadas,
// llamadas celebradas, ventas (hoja) y etapas del pipeline de la puerta.
// Con muestra (MUESTRA personas repartidas por el periodo): si abren y pulsan
// los emails y si leen y contestan los WhatsApp. Se lee solo el ESTADO de los
// mensajes y el asunto de los emails que envía Nuria; nunca el contenido de lo
// que escribe la persona. Sin nombres, emails ni teléfonos en la respuesta.

const N = require('./_nuria-semana.js');

const MUESTRA = 20;
const DIAS_SECUENCIA = 21;        // emails que cuentan: los de los 21 días tras registrarse
const PIPELINE = {
  'El Círculo': { id: 'bIgnFh4rXCSpZ1bwjQHq', nombre: 'Lanzamiento Perpetuo' },
  'VSL': { id: 'IEQ1AEfkYPzgHtlS29gH', nombre: 'SETTEO GENERAL' },   // «VSL · Funnel Único» está vacío
  'Test y meditación': { id: 'RpUHQDDmHuRVrLDqzGeC', nombre: 'Test de calidad' }
};

function rangoDe(desde, hasta) {
  return { field: 'dateAdded', operator: 'range', value: { gte: N.inicioUTC(desde), lte: new Date(new Date(N.inicioUTC(hasta)).getTime() - 1000).toISOString() } };
}

// Toda la cohorte: id, email, fecha de alta y si se ha dado de baja del email
async function cohorte(fuentes, desde, hasta) {
  const loc = process.env.NURIA_GHL_LOCATION_ID, gente = [];
  for (const f of fuentes) {
    for (let page = 1; page <= 20; page++) {
      const d = await N.ghl('/contacts/search', { cuerpo: { locationId: loc, pageLimit: 500, page: page, filters: [rangoDe(desde, hasta), { field: 'source', operator: 'eq', value: f }] } });
      (d.contacts || []).forEach(function (c) {
        const ds = c.dndSettings || {};
        gente.push({ id: c.id, email: String(c.email || '').toLowerCase(), alta: c.dateAdded, nombre: String(c.firstName || '').trim(), baja: !!(c.dnd || (ds.Email && ds.Email.status === 'active')) });
      });
      if (!d.contacts || d.contacts.length < 500) break;
    }
  }
  return gente;
}

// Mensajes de una persona: estado de emails (con asunto) y de WhatsApp
async function mensajes(p) {
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const convs = (await N.ghl('/conversations/search?locationId=' + loc + '&contactId=' + p.id, { version: '2021-04-15' })).conversations || [];
  const alta = new Date(p.alta).getTime(), limite = alta + DIAS_SECUENCIA * 86400000;
  const out = { emails: [], waEnviados: 0, waLeidos: 0, waContesta: false };
  for (const co of convs) {
    const ms = (((await N.ghl('/conversations/' + co.id + '/messages?limit=100', { version: '2021-04-15' })).messages) || {}).messages || [];
    const emails = [];
    ms.forEach(function (m) {
      const t = new Date(m.dateAdded).getTime();
      if (m.messageType === 'TYPE_WHATSAPP') {
        if (m.direction === 'outbound') { out.waEnviados++; if (m.status === 'read') out.waLeidos++; }
        else if (m.direction === 'inbound') out.waContesta = true;
      } else if (m.messageType === 'TYPE_EMAIL' && m.direction === 'outbound' && t >= alta && t <= limite) {
        const ids = ((m.meta || {}).email || {}).messageIds;
        emails.push({ id: (ids && ids[0]) || m.id, t: t });
      }
    });
    await N.enParalelo(emails, 3, async function (e) {
      const d = await N.ghl('/conversations/messages/email/' + e.id, { version: '2021-04-15' }).catch(function () { return null; });
      const em = d && (d.emailMessage || d);
      if (!em) return;
      let asunto = String(em.subject || '(sin asunto)');
      if (p.nombre.length > 1) asunto = asunto.split(p.nombre).join('{nombre}').replace(new RegExp(p.nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '{nombre}');
      out.emails.push({ asunto: asunto, dia: Math.floor((e.t - alta) / 86400000), abierto: em.status === 'opened' || em.status === 'clicked', clic: em.status === 'clicked', origen: em.source || '' });
    });
  }
  return out;
}

async function embudo(puerta, desde, hasta) {
  const P = N.PUERTAS.find(function (x) { return x.puerta === puerta; });
  if (!P) throw new Error('Puerta desconocida');
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const hoy = N.diaMadrid(new Date());
  const gente = await cohorte(P.fuentes, desde, hasta);
  const porId = new Map(gente.map(function (g) { return [g.id, g]; }));
  const porEmail = new Set(gente.map(function (g) { return g.email; }).filter(Boolean));

  // Citas de la cohorte en todas las agendas (desde el inicio del periodo hasta dentro de 30 días)
  const cals = ((await N.ghl('/calendars/?locationId=' + loc, { version: '2021-04-15' })).calendars || []);
  const ini = new Date(N.inicioUTC(desde)).getTime(), fin = new Date(N.inicioUTC(N.sumaDias(hoy, 30))).getTime();
  const agenda = new Set(), celebra = new Set();
  await N.enParalelo(cals, 4, async function (c) {
    const ev = (await N.ghl('/calendars/events?locationId=' + loc + '&calendarId=' + c.id + '&startTime=' + ini + '&endTime=' + fin, { version: '2021-04-15' })).events || [];
    ev.forEach(function (e) {
      if (!porId.has(e.contactId)) return;
      if (e.appointmentStatus !== 'cancelled' && e.appointmentStatus !== 'invalid') agenda.add(e.contactId);
      if (e.appointmentStatus === 'showed') celebra.add(e.contactId);
    });
  });

  // Ventas de la hoja de personas de la cohorte (vendidas desde el inicio del periodo)
  const ventas = ((await N.ventasHoja(desde).catch(function () { return null; })) || []).filter(function (v) { return v.email && porEmail.has(v.email); });

  // Etapas del pipeline de la puerta (oportunidades creadas en el periodo; etapa de hoy)
  const pipe = PIPELINE[puerta];
  let etapas = null;
  if (pipe) {
    const pipes = (await N.ghl('/opportunities/pipelines?locationId=' + loc)).pipelines || [];
    const pp = pipes.find(function (x) { return x.id === pipe.id; });
    const mdY = function (d) { return d.slice(5, 7) + '-' + d.slice(8, 10) + '-' + d.slice(0, 4); };
    if (pp) etapas = await N.enParalelo(pp.stages || [], 4, async function (st) {
      const r = await N.ghl('/opportunities/search?' + new URLSearchParams({ location_id: loc, pipeline_id: pipe.id, pipeline_stage_id: st.id, limit: 1, date: mdY(desde), endDate: mdY(N.sumaDias(hasta, -1)) }));
      return { etapa: st.name, n: Number(((r.meta) || {}).total || 0) };
    });
  }

  // Muestra repartida por todo el periodo
  const paso = gente.length / Math.min(MUESTRA, gente.length || 1);
  const muestra = [];
  for (let i = 0; i < Math.min(MUESTRA, gente.length); i++) muestra.push(gente[Math.floor(i * paso)]);
  const msj = (await N.enParalelo(muestra, 4, function (p) { return mensajes(p).catch(function () { return null; }); })).filter(Boolean);
  const pct = function (f) { return msj.length ? msj.filter(f).length / msj.length : null; };
  const correos = {};
  msj.forEach(function (m) {
    m.emails.forEach(function (e) {
      const o = correos[e.asunto] = correos[e.asunto] || { asunto: e.asunto, enviados: 0, abiertos: 0, clics: 0, dias: 0, campana: e.origen === 'campaign' };
      o.enviados++; if (e.abierto) o.abiertos++; if (e.clic) o.clics++; o.dias += e.dia;
    });
  });
  const listaCorreos = Object.keys(correos).map(function (k) { const o = correos[k]; o.dia = Math.round(o.dias / o.enviados); delete o.dias; return o; })
    .filter(function (o) { return o.enviados >= 2; })
    .sort(function (a, b) { return a.dia - b.dia || b.enviados - a.enviados; });
  const conEmail = msj.filter(function (m) { return m.emails.length; });
  const conWa = msj.filter(function (m) { return m.waEnviados; });

  const registros = gente.length;
  return {
    puerta: puerta, desde: desde, hasta: hasta, generado: Date.now(),
    registros: registros,
    bajas: gente.filter(function (g) { return g.baja; }).length,
    agendan: agenda.size, celebran: celebra.size,
    compran: new Set(ventas.map(function (v) { return v.email; })).size,
    facturacion: ventas.reduce(function (s, v) { return s + v.importe; }, 0),
    muestra: {
      personas: msj.length,
      conEmail: conEmail.length,
      abren: conEmail.length ? conEmail.filter(function (m) { return m.emails.some(function (e) { return e.abierto; }); }).length / conEmail.length : null,
      pulsan: conEmail.length ? conEmail.filter(function (m) { return m.emails.some(function (e) { return e.clic; }); }).length / conEmail.length : null,
      emailsPorPersona: conEmail.length ? conEmail.reduce(function (s, m) { return s + m.emails.length; }, 0) / conEmail.length : 0,
      conWhatsapp: conWa.length,
      leenWa: conWa.length ? conWa.filter(function (m) { return m.waLeidos > 0; }).length / conWa.length : null,
      contestanWa: conWa.length ? conWa.filter(function (m) { return m.waContesta; }).length / conWa.length : null,
      sinMensajes: pct(function (m) { return !m.emails.length && !m.waEnviados; })
    },
    correos: listaCorreos,
    pipeline: pipe ? { nombre: pipe.nombre, etapas: etapas } : null
  };
}

module.exports = { embudo: embudo, PUERTAS_EMBUDO: Object.keys(PIPELINE) };
