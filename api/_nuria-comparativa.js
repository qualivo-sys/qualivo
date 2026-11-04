// Intelligence de Nuria · comparativa de embudos (lo que pidieron Nuria y Alba):
// leads → agendadas → presentadas → ventas, en número y %, por embudo:
// Lanzamiento Perpetuo, VSL, Test web, Setter Instagram y cada cold caller.
// Lo usa api/intelligence-nuria.js (?accion=comparativa), solo con sesión.
//
// - Agendadas y presentadas: citas de cada agenda de GHL (Kliking) con fecha en
//   el periodo. Las citas «invalid» no cuentan. Presentada = «showed».
// - Ventas: las de la hoja con fecha en el periodo. Cada venta va al embudo de
//   la última cita de esa persona antes de comprar (presentada si la hay). Si no
//   tiene cita, se usa la columna «Fuente» de la hoja.
// - Leads: solo en los embudos que tienen registro (Perpetuo, VSL, Test web).
// - Closers: citas por persona asignada en GHL (agendadas, presentadas, no shows,
//   canceladas) y ventas por la columna «Closer» de la hoja.
// Solo lectura y sin datos personales en la respuesta.

const N = require('./_nuria-semana.js');

const EMBUDOS = [
  { embudo: 'Lanzamiento Perpetuo', agendas: ['calendario-lanzamiento-perpetuo'], fuentesLead: ['Registro Taller ADS - Semana Sueño', 'Registro Taller ORG - Semana Sueño'], hoja: ['lanzamiento'] },
  { embudo: 'VSL', agendas: ['calendario-vsl1-pfd-prueba-b'], fuentesLead: ['Registro VSL - ENERO 26'], hoja: ['vsl'] },
  { embudo: 'Test web', agendas: ['calendario-vsl1-pfd-web'], fuentesLead: ['Quiz Calidad Del Sueño', 'Test patrones web'], hoja: ['web'] },
  { embudo: 'Setter Instagram', agendas: ['sesion-diagnostico-instagram'], hoja: ['instagram', 'setter'] },
  { embudo: 'Cold caller · Lorena', agendas: ['calendario-dg-lorena'], hoja: [] },
  { embudo: 'Cold caller · Sonia', agendas: ['calendario-dg-sonia'], hoja: [] },
  { embudo: 'Cold caller · Pepi', agendas: ['calendario-dg-pepi'], hoja: [] },
  { embudo: 'Webinar', agendas: ['calendario-sesion-diagnostico-julio'], hoja: ['webinar'] },
  { embudo: 'Otras agendas', agendas: [], hoja: [] }
];
const SIN_CITA_BASE = 'Base de datos sin cita';   // ventas «Base de datos» sin cita en ninguna agenda

async function comparativa(desde, hasta) {
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const fila = {};
  EMBUDOS.forEach(function (e) { fila[e.embudo] = { embudo: e.embudo, leads: e.fuentesLead ? 0 : null, agendadas: 0, presentadas: 0, canceladas: 0, pendientes: 0, ventas: 0, facturacion: 0, cobrado: 0, porCita: 0, porHoja: 0 }; });
  fila[SIN_CITA_BASE] = { embudo: SIN_CITA_BASE, leads: null, agendadas: null, presentadas: null, ventas: 0, facturacion: 0, cobrado: 0, porCita: 0, porHoja: 0 };

  // 1) Leads (registros del periodo, exacto)
  const rango = { field: 'dateAdded', operator: 'range', value: { gte: N.inicioUTC(desde), lte: new Date(new Date(N.inicioUTC(hasta)).getTime() - 1000).toISOString() } };
  const consultas = [];
  EMBUDOS.forEach(function (e) { (e.fuentesLead || []).forEach(function (f) { consultas.push({ e: e.embudo, f: f }); }); });
  await N.enParalelo(consultas, 6, async function (c) {
    const r = await N.ghl('/contacts/search', { cuerpo: { locationId: loc, pageLimit: 1, filters: [rango, { field: 'source', operator: 'eq', value: c.f }] } });
    fila[c.e].leads += Number(r.total || 0);
  });

  // 2) Citas por agenda
  const cals = (await N.ghl('/calendars/?locationId=' + loc, { version: '2021-04-15' })).calendars || [];
  const embudoDeCal = {};
  cals.forEach(function (c) {
    const slug = c.widgetSlug || c.slug;
    const e = EMBUDOS.find(function (x) { return x.agendas.indexOf(slug) >= 0; });
    embudoDeCal[c.id] = e ? e.embudo : 'Otras agendas';
  });
  const ini = new Date(N.inicioUTC(desde)).getTime(), fin = new Date(N.inicioUTC(hasta)).getTime();
  // Closers: la persona asignada a cada cita (usuarios de GHL), por nombre de pila
  const usuarios = (await N.ghl('/users/?locationId=' + loc)).users || [];
  const nombreUsuario = {};
  usuarios.forEach(function (u) { nombreUsuario[u.id] = ((u.firstName || '') + ' ' + (u.lastName || '')).trim(); });
  const closers = {};
  const pila = function (n) { return String(n || '').trim().split(/\s+/)[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  const closerDe = function (nombre) {
    const k = pila(nombre) || '—';
    return closers[k] = closers[k] || { closer: k === '—' ? 'Sin closer' : String(nombre).trim().split(/\s+/)[0], agendadas: 0, presentadas: 0, noShow: 0, canceladas: 0, pendientes: 0, ventas: 0, facturacion: 0, cobrado: 0 };
  };
  await N.enParalelo(cals, 4, async function (c) {
    const ev = (await N.ghl('/calendars/events?locationId=' + loc + '&calendarId=' + c.id + '&startTime=' + ini + '&endTime=' + (fin - 1000), { version: '2021-04-15' })).events || [];
    const f = fila[embudoDeCal[c.id]];
    ev.forEach(function (e) {
      const st = e.appointmentStatus || 'new';
      if (st === 'invalid') return;
      f.agendadas++;
      const cl = closerDe(nombreUsuario[e.assignedUserId] || '');
      cl.agendadas++;
      if (st === 'showed') cl.presentadas++;
      else if (st === 'noshow') cl.noShow++;
      else if (st === 'cancelled') cl.canceladas++;
      else if (new Date(e.startTime).getTime() > Date.now()) cl.pendientes++;
      if (st === 'showed') f.presentadas++;
      else if (st === 'cancelled') f.canceladas++;
      else if (st !== 'noshow' && new Date(e.startTime).getTime() > Date.now()) f.pendientes++;
    });
  });

  // 3) Ventas del periodo, asignadas por la cita
  const ventas = ((await N.ventasHoja(desde)) || []).filter(function (v) { return v.dia < hasta; });
  await N.enParalelo(ventas, 4, async function (v) {
    let destino = null, porCita = false;
    if (v.email) {
      const c = ((await N.ghl('/contacts/search', { cuerpo: { locationId: loc, pageLimit: 1, filters: [{ field: 'email', operator: 'eq', value: v.email }] } })).contacts || [])[0];
      if (c) {
        const limite = new Date(v.dia + 'T23:59:59Z').getTime() + 86400000;
        const citas = ((await N.ghl('/contacts/' + c.id + '/appointments')).events || [])
          .map(function (x) { return { cal: x.calendarId, t: new Date(String(x.startTime || '').replace(' ', 'T')).getTime(), st: x.appointmentStatus }; })
          .filter(function (x) { return x.t && x.t <= limite && x.st !== 'invalid' && x.st !== 'cancelled' && embudoDeCal[x.cal]; })
          .sort(function (a, b) { return b.t - a.t; });
        const elegida = citas.find(function (x) { return x.st === 'showed'; }) || citas[0];
        if (elegida) { destino = embudoDeCal[elegida.cal]; porCita = true; }
      }
    }
    if (!destino) {
      const f = String(v.fuente || '').trim().toLowerCase();
      const e = EMBUDOS.find(function (x) { return x.hoja.indexOf(f) >= 0; });
      destino = e ? e.embudo : (f === 'base de datos' ? SIN_CITA_BASE : 'Otras agendas');
    }
    const o = fila[destino];
    o.ventas++; o.facturacion += v.importe || 0; o.cobrado += v.cobrado || 0;
    const cv = closerDe(v.closer || ''); cv.ventas++; cv.facturacion += v.importe || 0; cv.cobrado += v.cobrado || 0;
    if (porCita) o.porCita++; else o.porHoja++;
  });

  const filas = EMBUDOS.map(function (e) { return fila[e.embudo]; }).concat([fila[SIN_CITA_BASE]])
    .filter(function (f) { return f.leads || f.agendadas || f.ventas || EMBUDOS.slice(0, 7).some(function (e) { return e.embudo === f.embudo; }); });
  const listaClosers = Object.keys(closers).map(function (k) { return closers[k]; })
    .filter(function (c) { return c.agendadas || c.ventas; })
    .sort(function (a, b) { return (a.closer === 'Sin closer') - (b.closer === 'Sin closer') || b.facturacion - a.facturacion || b.agendadas - a.agendadas; });
  return { desde: desde, hasta: hasta, generado: Date.now(), filas: filas, closers: listaClosers, ventasTotal: ventas.length };
}

module.exports = { comparativa: comparativa };
