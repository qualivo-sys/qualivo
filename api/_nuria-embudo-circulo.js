// Intelligence de Nuria · embudo completo de El Círculo por edición (lo que pidió Nuria el 24-nov):
// registros (Meta frente a Kliking) y coste por registro → grupo de WhatsApp (entran y salen) →
// reproducciones de las clases → asistencia al directo → llamadas (agendadas, hechas, no-shows,
// canceladas) → ventas y facturación, con la conversión de cada paso.
//
// - Edición = miércoles del directo. Captación: de viernes a jueves (12 a 6 días antes del directo).
// - Registros Kliking: etiquetas «[registro ads|org] AAAA-MM-DD». Registros Meta: evento
//   complete_registration de las campañas de El Círculo en la captación. Coste: gasto de Meta en
//   esas campañas en la captación.
// - Grupo: «[ingresa a comunidad] AAAA-MM-DD» y, si responde n8n, salidas de Funnelchat.
// - Clases: reproducciones en Presto (del domingo antes al sábado después). No son personas.
// - Asistencia al directo: etiquetas «asiste directo AAAA-MM-DD» (clic en el trigger link del Zoom en los
//   mensajes del día) y «check-in directo AAAA-MM-DD» (clic en «Estoy aquí» durante el directo).
// - Llamadas: citas de cualquier agenda de Kliking de personas de la edición, desde el inicio de la
//   captación hasta 3 semanas después del directo. «invalid» no cuenta.
// - Ventas: hoja de ventas, personas de la edición, desde el inicio de la captación.
// Solo lectura; la respuesta solo lleva recuentos.

const N = require('./_nuria-semana.js');
const CLASES = require('./_nuria-clases.js');
const GRUPOS = require('./_nuria-grupos.js');
const NBSP = ' ';
const LOC = function () { return process.env.NURIA_GHL_LOCATION_ID; };

async function contactos(tag) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const r = await N.ghl('/contacts/search', { cuerpo: { locationId: LOC(), pageLimit: 500, page: page, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
    (r.contacts || []).forEach(function (c) { out.push({ id: c.id, email: c.email ? String(c.email).toLowerCase() : null }); });
    if (!r.contacts || r.contacts.length < 500) break;
  }
  return out;
}
async function total(tag) {
  const r = await N.ghl('/contacts/search', { cuerpo: { locationId: LOC(), pageLimit: 1, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
  return Number(r.total || 0);
}

async function metaDiario(desde, hasta) {
  const token = process.env.NURIA_META_TOKEN, cuenta = process.env.NURIA_META_CUENTA;
  if (!token || !cuenta) return null;
  const q = new URLSearchParams({ access_token: token, level: 'campaign', fields: 'campaign_name,spend,actions', time_increment: '1', time_range: JSON.stringify({ since: desde, until: hasta }), limit: '500' });
  let url = 'https://graph.facebook.com/v21.0/' + cuenta + '/insights?' + q;
  const out = [];
  while (url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('Meta ' + r.status);
    const d = await r.json();
    (d.data || []).forEach(function (x) {
      if (!/C[ÍI]RCULO/i.test(String(x.campaign_name || ''))) return;
      const reg = (x.actions || []).filter(function (a) { return a.action_type === 'complete_registration'; }).reduce(function (s, a) { return s + Number(a.value || 0); }, 0);
      out.push({ dia: x.date_start, gasto: Number(x.spend || 0), registros: reg });
    });
    url = d.paging && d.paging.next;
  }
  return out;
}

async function citas(desde, hasta) {
  const cals = ((await N.ghl('/calendars/?locationId=' + LOC(), {})).calendars || []);
  const a = Date.parse(desde + 'T00:00:00+01:00'), b = Date.parse(hasta + 'T23:59:59+01:00');
  const out = [];
  await N.enParalelo(cals, 3, async function (c) {
    const ev = (await N.ghl('/calendars/events?locationId=' + LOC() + '&calendarId=' + c.id + '&startTime=' + a + '&endTime=' + b, {})).events || [];
    ev.forEach(function (e) { out.push({ contacto: e.contactId, estado: e.appointmentStatus || '' }); });
  });
  return out;
}

function claseDe(t) { t = String(t || ''); if (/audio/i.test(t)) return 'audio'; const m = /clase[_\s-]*(\d)/i.exec(t); if (m) return 'clase' + m[1]; if (/directo|grabaci/i.test(t)) return 'directo'; return null; }

async function embudoCirculo(directos) {
  const hoy = N.diaMadrid(new Date());
  const desdeTodo = N.sumaDias(directos[0], -12), hastaTodo = directos[directos.length - 1];
  const [meta, ventas, grupos, todasCitas] = await Promise.all([
    metaDiario(desdeTodo, hoy < hastaTodo ? hoy : hastaTodo).catch(function () { return null; }),
    N.ventasHoja(desdeTodo).catch(function () { return null; }),
    GRUPOS.grupos().catch(function () { return null; }),
    citas(desdeTodo, N.sumaDias(hastaTodo, 21) < hoy ? N.sumaDias(hastaTodo, 21) : hoy).catch(function () { return null; })
  ]);
  const ediciones = [];
  for (const d of directos) {
    const desde = N.sumaDias(d, -12), hasta = N.sumaDias(d, -6);
    const [ads, org, grupo, clicZoom, checkin] = await Promise.all([contactos('[registro ads]' + NBSP + d), contactos('[registro org]' + NBSP + d), total('[ingresa a comunidad]' + NBSP + d), total('asiste directo ' + d), total('check-in directo ' + d)]);
    const personas = ads.concat(org);
    if (!personas.length) continue;
    const ids = new Set(personas.map(function (p) { return p.id; }));
    const mails = new Set(personas.map(function (p) { return p.email; }).filter(Boolean));
    const m = meta ? meta.filter(function (x) { return x.dia >= desde && x.dia <= hasta; }) : null;
    const gasto = m ? m.reduce(function (s, x) { return s + x.gasto; }, 0) : null;
    const regMeta = m ? m.reduce(function (s, x) { return s + x.registros; }, 0) : null;
    let vistas = null;
    try {
      const v = await CLASES.porVideo(N.sumaDias(d, -3), N.sumaDias(d, 3));
      if (v) { vistas = {}; v.forEach(function (x) { const k = claseDe(x.titulo); if (k) vistas[k] = (vistas[k] || 0) + x.vistas; }); }
    } catch (e) { vistas = null; }
    let ll = null;
    if (todasCitas) {
      const mias = todasCitas.filter(function (c) { return ids.has(c.contacto) && c.estado !== 'invalid'; });
      const pers = function (f) { return new Set(mias.filter(f).map(function (c) { return c.contacto; })).size; };
      ll = {
        agendadas: pers(function () { return true; }),
        hechas: pers(function (c) { return c.estado === 'showed'; }),
        noShow: pers(function (c) { return c.estado === 'noshow'; }),
        canceladas: pers(function (c) { return c.estado === 'cancelled'; }),
        pendientes: pers(function (c) { return c.estado === 'confirmed' || c.estado === 'new'; })
      };
    }
    const vs = ventas ? ventas.filter(function (v) { return v.email && mails.has(v.email) && v.dia >= desde; }) : null;
    const g = grupos && grupos.ediciones ? grupos.ediciones[d] : null;
    ediciones.push({
      directo: d, estado: d < hoy ? 'directo hecho' : (hoy <= hasta ? 'captando' : 'clases'),
      registrosMeta: regMeta, registrosKliking: personas.length, ads: ads.length, org: org.length,
      gasto: gasto, costeRegistro: gasto != null && personas.length ? gasto / ads.length : null,
      grupoEntran: g ? g.entran : grupo, grupoSalen: g ? g.salen : null, fuenteGrupo: g ? 'funnelchat' : 'etiqueta',
      vistas: vistas, asistencia: (clicZoom || checkin) ? { clicZoom: clicZoom, checkin: checkin } : null, llamadas: ll,
      compras: vs ? new Set(vs.map(function (v) { return v.email; })).size : null,
      facturacion: vs ? vs.reduce(function (s, v) { return s + (v.importe || 0); }, 0) : null
    });
  }
  return { generado: Date.now(), hoy: hoy, n8n: !!grupos, ediciones: ediciones };
}

module.exports = { embudoCirculo: embudoCirculo };
