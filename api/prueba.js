// «Prueba tu agente» (qualivo.io/prueba): el visitante deja nombre, móvil, web y
// sector, y en menos de un minuto le llama la agente de voz de SU negocio,
// montada al vuelo a partir de su web (api/_demo.js). Al colgar, api/vapi-fin.js
// le manda el correo que recibiría como dueño.
//
// Lo que protege este endpoint: una prueba por móvil y día, tope diario, solo
// móviles españoles, solo de 9:00 a 21:00 (fuera de eso se apunta y se le dice
// en pantalla). Los contactos de la demo llevan la etiqueta «demo» y no entran
// en la cadencia de activación (esa mira «paid» y «activacion»).

const A = require('./_activacion');
const D = require('./_demo');

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SECTORES = ['clinicas', 'formacion', 'reformas', 'asesorias', 'otro'];
const DESDE = parseInt(process.env.DEMO_DESDE || '9', 10);
const HASTA = parseInt(process.env.DEMO_HASTA || '21', 10);
const MAX_DIA = parseInt(process.env.DEMO_MAX_DIA || '30', 10);

function telefonoES(t) {
  t = String(t || '').replace(/[\s\-().]/g, '');
  if (/^0034/.test(t)) t = '+' + t.slice(2);
  if (/^34[67]\d{8}$/.test(t)) t = '+' + t;
  if (/^[67]\d{8}$/.test(t)) t = '+34' + t;
  return /^\+34[67]\d{8}$/.test(t) ? t : '';
}

function fechaTag() {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return 'demo-' + p.replace(/-/g, '');
}

async function upsert(d, tags) {
  const r = await fetch(A.GHL_BASE + '/contacts/upsert', {
    method: 'POST', headers: A.cabeceras(),
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID,
      firstName: d.nombre.split(' ')[0], name: d.nombre, phone: d.telefono, email: d.email,
      website: d.web, source: 'Prueba tu agente', tags: tags
    })
  });
  if (!r.ok) throw new Error('ghl upsert ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json().catch(function () { return {}; });
  return (j.contact && j.contact.id) || (j.contact && j.contact.contact && j.contact.contact.id) || '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true, estado: 'llamando' }); // trampa para robots

  const d = {
    nombre: String(b.nombre || '').trim().slice(0, 80),
    telefono: telefonoES(b.telefono),
    email: String(b.email || '').trim().toLowerCase().slice(0, 120),
    web: D.normalizarUrl(String(b.web || '').trim().slice(0, 200)),
    sector: SECTORES.indexOf(String(b.sector || '')) > -1 ? String(b.sector) : 'otro'
  };
  if (d.nombre.length < 2) return res.status(200).json({ ok: false, error: 'nombre' });
  if (!d.telefono) return res.status(200).json({ ok: false, error: 'telefono' });
  if (!EMAIL_RE.test(d.email)) return res.status(200).json({ ok: false, error: 'email' });
  if (!d.web) return res.status(200).json({ ok: false, error: 'web' });

  const hoy = fechaTag();
  // Una por móvil y día, y tope diario para que un anuncio que se dispare no
  // vacíe el saldo de voz.
  let contacto = null;
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/search', { method: 'POST', headers: A.cabeceras(), body: JSON.stringify({ locationId: process.env.GHL_LOCATION_ID, pageLimit: 1, filters: [{ field: 'phone', operator: 'eq', value: d.telefono }] }) });
    if (r.ok) contacto = ((await r.json()).contacts || [])[0] || null;
  } catch (e) { /* si el CRM no contesta, seguimos */ }
  if (contacto && A.tiene(contacto, hoy)) return res.status(200).json({ ok: false, error: 'ya_hoy' });
  try {
    const deHoy = await A.buscarPorEtiqueta(hoy, MAX_DIA + 1);
    if (deHoy.length >= MAX_DIA) return res.status(200).json({ ok: false, error: 'tope' });
  } catch (e) { /* no bloquea */ }

  const t = A.ahoraMadrid();
  const enHorario = t.minutos >= DESDE * 60 && t.minutos < HASTA * 60;
  const tags = ['demo', 'sector-' + d.sector, enHorario ? 'demo-llamada' : 'demo-pendiente', hoy];

  let contactId = '';
  try { contactId = await upsert(d, tags); } catch (e) { console.error('[prueba] CRM:', e.message); }

  if (!enHorario) {
    if (contactId) await A.nota(contactId, 'PRUEBA TU AGENTE · pedida fuera de horario · ' + new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) + '\nWeb: ' + d.web + ' · sector: ' + d.sector).catch(function () {});
    return res.status(200).json({ ok: true, estado: 'fuera_horario', desde: DESDE });
  }

  // La ficha: de su web si se puede leer; si no, del sector (y se dice en el correo).
  let brief;
  try {
    const texto = await D.leerWeb(d.web);
    brief = await D.brief({ web: d.web.replace(/^https?:\/\//, ''), sector: d.sector, nombre: d.nombre, texto: texto });
  } catch (e) {
    console.error('[prueba] ficha con modelo falló, uso la del sector:', e.message);
    brief = D.briefSector({ web: d.web.replace(/^https?:\/\//, ''), sector: d.sector });
  }

  // WhatsApp de «su» agente por el número oficial, justo antes de la llamada.
  // Plantilla qualivo_prueba_agente (pedida a Meta el 22-sep); hasta que esté
  // aprobada, Meta la rechaza y la prueba sigue solo con voz y correo.
  let wa = { ok: false, motivo: 'no_configurado' };
  try {
    const WA = require('./_whatsapp');
    wa = await WA.enviarPlantilla(d.telefono, process.env.META_WA_PLANTILLA_PRUEBA || 'qualivo_prueba_agente', [d.nombre.split(' ')[0], brief.agente, brief.negocio]);
  } catch (e) { wa = { ok: false, motivo: String(e && e.message).slice(0, 120) }; }

  const l = await D.lanzarLlamada({ brief: brief, nombre: d.nombre, telefono: d.telefono, email: d.email, contactId: contactId });
  if (contactId) {
    await A.nota(contactId, 'PRUEBA TU AGENTE · ' + new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) +
      '\nWeb: ' + d.web + ' · sector: ' + d.sector + ' · ficha desde: ' + brief.fuente +
      '\nAgente: ' + brief.agente + ' de ' + brief.negocio +
      '\nWhatsApp (647): ' + (wa.ok ? 'enviado' : 'no enviado · ' + (wa.motivo || '')) +
      (l.ok ? '\nLlamada: https://dashboard.vapi.ai/calls/' + l.id : '\nLA LLAMADA NO SALIÓ: ' + (l.motivo || '') + ' ' + (l.detalle || ''))).catch(function () {});
  }
  if (!l.ok) {
    console.error('[prueba] llamada no salió', l);
    try { await require('./_aviso.js').seMovio('actividad', { nombre: d.nombre, email: d.email, telefono: d.telefono, contactId: contactId, accion: 'Prueba tu agente: la llamada NO salió (' + (l.motivo || '') + ')', texto: d.web, origen: 'Prueba tu agente' }); } catch (e) { /* nada */ }
    return res.status(200).json({ ok: false, error: 'llamada' });
  }
  return res.status(200).json({ ok: true, estado: 'llamando', agente: brief.agente, negocio: brief.negocio, fuente: brief.fuente, whatsapp: !!wa.ok });
};
