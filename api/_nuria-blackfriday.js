// Intelligence de Nuria · Black Friday de A 11 Pasos del Sueño (noviembre 2026).
// Lista VIP (etiqueta de Kliking), personas en el grupo de Telegram (página pública de la invitación),
// estado y resultados de cada email del plan, y compras con la etiqueta de diciembre.
// Solo lectura y sin datos personales.

const N = require('./_nuria-semana.js');

const TAG_VIP = 'lista vip black friday 2026';
const TAG_COMPRA = 'cliente 11 pasos dic2026';
const TELEGRAM = 'https://t.me/+JtDEw4RKL-lhN2Fk';
const PLAN = [
  { n: 1, dia: '2026-11-16', nombre: 'VIP 1 · «Este Black Friday, primero tú»', a: 'Toda la base, sin El Círculo activo' },
  { n: 2, dia: '2026-11-19', nombre: 'VIP 2 · «¿Ya estás dentro?»', a: 'Toda la base, sin El Círculo activo' },
  { n: 3, dia: '2026-11-21', nombre: 'VIP 3 · «Mañana lo desvelo»', a: 'Toda la base, sin El Círculo activo' },
  { n: 4, dia: '2026-11-22', nombre: 'Oferta 4 · la propuesta, con regalo solo ese día', a: 'Solo la lista VIP' },
  { n: 5, dia: '2026-11-27', nombre: 'Oferta 5 · Black Friday', a: 'Toda la base, sin El Círculo activo' },
  { n: 6, dia: '2026-11-30', nombre: 'Oferta 6 · último día a 175 €', a: 'Toda la base, sin El Círculo activo' }
];

async function total(tag) {
  const r = await N.ghl('/contacts/search', { cuerpo: { locationId: process.env.NURIA_GHL_LOCATION_ID, pageLimit: 1, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
  return Number(r.total || 0);
}

async function telegram() {
  try {
    const r = await fetch(TELEGRAM, { headers: { 'User-Agent': 'Mozilla/5.0 (QualivoNuria)' } });
    const t = await r.text();
    const m = /tgme_page_extra">\s*([\d\s.,]+)\s*members?(?:,\s*([\d\s.,]+)\s*online)?/i.exec(t);
    if (!m) return null;
    const n = function (x) { return x ? Number(String(x).replace(/[^\d]/g, '')) : null; };
    return { miembros: n(m[1]), enLinea: n(m[2]) };
  } catch (e) { return null; }
}

function fechaDe(x) {
  const v = x.dateScheduled || x.scheduledAt || x.createdAt;
  const d = typeof v === 'number' || /^\d+$/.test(String(v)) ? new Date(Number(v)) : new Date(v);
  return isNaN(d) ? '' : new Date(d.getTime() + 3600000).toISOString().slice(0, 16).replace('T', ' ');
}

async function campanas() {
  const loc = process.env.NURIA_GHL_LOCATION_ID, out = [];
  for (let off = 0; off < 400; off += 100) {
    const d = await N.ghl('/emails/schedule?locationId=' + loc + '&limit=100&offset=' + off + '&showStats=true');
    const s = d.schedules || [];
    s.forEach(function (x) {
      if (x.deleted || !/black\s*friday/i.test(String(x.name || '') + ' ' + String(x.subject || ''))) return;
      out.push({
        nombre: String(x.name || ''), asunto: String(x.subject || ''), estado: String(x.status || ''), fecha: fechaDe(x),
        seleccionados: Number(x.totalCount || 0), entregados: Number(x.delivered || 0), abiertos: Number(x.opened || 0), clics: Number(x.clicked || 0)
      });
    });
    if (s.length < 100) break;
  }
  return out;
}

// Une cada email del plan con su campaña en Kliking (por el número «· N ·» o «VIP N» en el nombre).
function cruzar(lista) {
  return PLAN.map(function (p) {
    const tipo = p.n <= 3 ? /vip/i : /oferta|11 pasos/i, num = new RegExp('(·|#|n\\.?º?|email)\\s*' + p.n + '(\\s*·|\\b)', 'i');
    const cs = lista.filter(function (c) { return tipo.test(c.nombre) && num.test(c.nombre.replace(/20\d\d/g, '')); });
    const hecha = cs.find(function (c) { return c.estado === 'complete'; });
    const prog = cs.find(function (c) { return c.estado !== 'complete' && c.estado !== 'draft'; });
    const c = hecha || prog || null;
    return Object.assign({}, p, { estado: hecha ? 'enviado' : (prog ? 'programado' : (cs.length ? 'borrador' : 'sin programar')), campana: c });
  });
}

// Detalle de las compras de diciembre: cuántas venían de la lista VIP y el día de compra (= día del
// email de bienvenida «Ya estás dentro…»; si no tiene, el día en que se dio de alta el contacto).
// Ingresos estimados: 175 € hasta el 30-nov y 185 € después (no hay importes en Kliking).
async function detalleCompras() {
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const r = await N.ghl('/contacts/search', { cuerpo: { locationId: loc, pageLimit: 200, filters: [{ field: 'tags', operator: 'eq', value: TAG_COMPRA }] } });
  const cs = r.contacts || [];
  const filas = await N.enParalelo(cs, 4, async function (c) {
    let dia = null;
    try {
      const cv = await N.ghl('/conversations/search?locationId=' + loc + '&contactId=' + c.id, {});
      for (const co of (cv.conversations || [])) {
        const m = await N.ghl('/conversations/' + co.id + '/messages?limit=60', {});
        const ems = (((m.messages || {}).messages) || []).filter(function (x) { return x.messageType === 'TYPE_EMAIL' && x.direction === 'outbound' && x.dateAdded >= '2026-11-01'; });
        for (const x of ems) {
          const d = await N.ghl('/conversations/messages/email/' + ((x.meta || {}).email || {}).messageIds[0], {}).catch(function () { return null; });
          if (d && d.emailMessage && /ya est[áa]s dentro/i.test(d.emailMessage.subject || '')) { const f = N.diaMadrid(new Date(x.dateAdded)); if (!dia || f < dia) dia = f; }
        }
      }
    } catch (e) { }
    if (!dia && c.dateAdded && c.dateAdded >= '2026-11-01') dia = N.diaMadrid(new Date(c.dateAdded));
    return { vip: (c.tags || []).indexOf(TAG_VIP) >= 0, dia: dia };
  });
  const porDia = {};
  let sinFecha = 0, ingresos = 0;
  filas.forEach(function (f) {
    if (f.dia) porDia[f.dia] = (porDia[f.dia] || 0) + 1; else sinFecha++;
    ingresos += f.dia && f.dia > '2026-11-30' ? 185 : 175;
  });
  return { total: filas.length, deLaVip: filas.filter(function (f) { return f.vip; }).length, porDia: porDia, sinFecha: sinFecha, ingresosEstimados: ingresos };
}

async function blackfriday() {
  const [vip, compras, tg, lista, det] = await Promise.all([total(TAG_VIP), total(TAG_COMPRA), telegram(), campanas().catch(function () { return null; }), detalleCompras().catch(function () { return null; })]);
  return { generado: Date.now(), vip: vip, compras: compras, detalle: det, telegram: tg, plan: lista ? cruzar(lista) : null };
}

module.exports = { blackfriday: blackfriday };
