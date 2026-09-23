// Tratos (oportunidades) en el pipeline «Prospección» de GoHighLevel.
//
// Todo lead que entra por cualquier puerta (Meta, landing de diagnóstico,
// formulario de la web, radiografía, autodiagnóstico, launch, agente de voz)
// abre un trato aquí, en «Nuevo Lead», con el nombre precedido del origen
// («Meta · Ana García (Reformas Norte)») y la fuente rellenada, para que en el
// tablero se vea de un vistazo de dónde viene cada uno. Cuando coge hora, el
// trato pasa a «Reunión agendada»; cuando la secuencia se agota, a «Más adelante».
//
// Reglas: un contacto tiene como mucho un trato abierto en este pipeline (no se
// duplica); nunca se mueve hacia atrás desde «Cliente»; y ninguna función de
// aquí lanza: si GHL falla, se registra y el flujo que la llamó sigue.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

const PIPELINE = process.env.GHL_PIPELINE_PROSPECCION || 'JaB4LIwUqFn96LLFEhSm';
const ETAPAS = {
  nuevo: 'b312c2cc-cd51-4a4e-8f9f-ac1e27be5784',        // Nuevo Lead
  conversacion: '2f7569b8-d95b-4bfe-8120-0a4d206907ce', // Conversación abierta
  enCadencia: 'b48cf14c-2c0b-4529-81cd-0366f9c3a96d',   // En cadencia (Maikel, 22-sep)
  reunion: 'd491f3eb-2b82-468b-aab9-60e9cdc7368f',      // Reunión agendada
  noPresentado: 'd04755f9-f94c-4c56-ac14-2c6b6356e1d6', // No presentado (Maikel, 22-sep)
  oferta: '41c3a02d-a63e-4ef5-a402-7b562bbabfa9',       // Oferta enviada
  seguimiento: '3e12a08f-272b-4817-9bfe-fd83d24ca45e',  // Negociación (antes «Seguimiento»)
  masAdelante: '515ba6db-2f03-47ab-9c50-fc10f361192a',  // Más adelante
  noResponde: 'fbed9371-d8e1-47a9-a933-2cb32db63c5e',   // No responde (Maikel, 22-sep): cadencia agotada sin reacción
  piloto: '138c0901-981b-4454-8bc1-63260e87f402',       // Piloto (Maikel, 22-sep)
  cliente: '673ee555-349c-40ea-b4c3-8cc5e4a867b9'       // Cliente
};
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';

// Los contactos de reactivación (base antigua: correos de Brevo, tandas de
// septiembre) no van en «Prospección», que es solo para lo que entra ahora por
// anuncios, landing o referencias (Maikel, 23-sep: «me ensucia bastante el
// CRM»). Sus tratos viven en «Qualivo Pipeline», con la etapa equivalente. Si
// un contacto de reactivación también entró por anuncios (paid, leadform),
// manda lo de anuncios y se queda en Prospección.
const PIPELINE_QUALIVO = '980j4DzvOwp7aDmkk2ZA';
const ETAPAS_QUALIVO = {
  nuevo: 'fa70d288-c614-40ad-9e67-df04f4da3443',        // Nuevo Lead
  enCadencia: 'd08bc03a-1b25-4732-9b5f-3cb7295bfd94',   // Contactado
  conversacion: '25c3d5c9-8427-43be-92d3-7b42a8975dd2', // Tibio
  reunion: '1ff12e5f-c007-42e6-8a3c-fc0d77dabaa1',      // Call Agendada
  noPresentado: '25c3d5c9-8427-43be-92d3-7b42a8975dd2', // Tibio
  oferta: '7e8636a4-7066-4488-b423-40d431e54a9d',       // Propuesta Enviada
  seguimiento: '7e8636a4-7066-4488-b423-40d431e54a9d',  // Propuesta Enviada
  masAdelante: '25c3d5c9-8427-43be-92d3-7b42a8975dd2',  // Tibio
  noResponde: '0143fb88-4fdd-48e8-9b3d-97b7cacd2048',   // Perdido
  piloto: 'f1ab191d-569b-485e-b4e3-6e2b7a72dfb8',       // Cliente Activo
  cliente: 'f1ab191d-569b-485e-b4e3-6e2b7a72dfb8'       // Cliente Activo
};
function esReactivacion(tags) {
  const t = (tags || []).map(String);
  const react = t.some(function (x) { return /^reactivacion|^tanda|^reactivado$|brevo/.test(x); });
  const anuncios = t.some(function (x) { return /^(paid|leadform|diagnostico-landing)$/.test(x); });
  return react && !anuncios;
}
async function pipelineDe(contactId) {
  try {
    const r = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: cabeceras() });
    const c = r.ok ? ((await r.json()).contact || {}) : {};
    if (esReactivacion(c.tags)) return { id: PIPELINE_QUALIVO, etapas: ETAPAS_QUALIVO, reactivacion: true };
  } catch (e) { /* si no se puede leer, Prospección */ }
  return { id: PIPELINE, etapas: ETAPAS, reactivacion: false };
}

function cabeceras() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
}

// Trato abierto del contacto en Prospección, o null.
async function abierto(contactId, pipelineId) {
  const q = '/opportunities/search?location_id=' + encodeURIComponent(process.env.GHL_LOCATION_ID) +
    '&contact_id=' + encodeURIComponent(contactId) +
    '&pipeline_id=' + encodeURIComponent(pipelineId || PIPELINE) + '&status=open';
  const r = await fetch(GHL_BASE + q, { headers: cabeceras() });
  if (!r.ok) throw new Error('ghl_opportunities_search ' + r.status);
  const d = await r.json().catch(function () { return {}; });
  return (d.opportunities || [])[0] || null;
}

// El sector como se lee en el tablero: «Reformas», no «Reformas, construcción
// o instalaciones». Devuelve el texto tal cual si no lo reconoce.
const SECTORES = [
  [/reforma|construcci|instalaci/i, 'Reformas'],
  [/formaci|academia|escuela|curso/i, 'Formación'],
  [/salud|cl[ií]nica|bienestar|dental|fisio/i, 'Clínicas'],
  [/asesor|consultor|abogad|gestor|servicios profesionales/i, 'Asesorías'],
  [/inmobil/i, 'Inmobiliaria'],
  [/ecommerce|tienda/i, 'Ecommerce']
];
function sectorCorto(texto) {
  const t = String(texto || '').trim();
  for (const par of SECTORES) if (par[0].test(t)) return par[1];
  return t;
}

// Nombre del anuncio de Meta a partir de su id (utm_content o ad_id del
// formulario). Se lee con el token de la página; si falla, se deja el id, que
// también identifica el anuncio aunque se lea peor.
const cacheAnuncios = {};
async function nombreAnuncio(adId) {
  const id = String(adId || '').replace(/\D/g, '');
  if (!id) return '';
  if (cacheAnuncios[id]) return cacheAnuncios[id];
  const t = process.env.META_LEADFORM_TOKEN;
  if (!t) return id;
  try {
    const r = await fetch('https://graph.facebook.com/v21.0/' + id + '?fields=name&access_token=' + encodeURIComponent(t));
    if (!r.ok) return id;
    const d = await r.json();
    cacheAnuncios[id] = String(d.name || id);
    return cacheAnuncios[id];
  } catch (e) { return id; }
}

// «Meta · Ana García (Reformas Norte) · Reformas · anuncio AD 3V reformas».
// Todo lo que hace falta para saber de un vistazo de dónde viene y de qué va.
function titulo(o) {
  const partes = [(o.origen || 'Lead') + ' · ' + (o.nombre || o.email || o.telefono || 'Sin nombre') +
    (o.empresa ? ' (' + o.empresa + ')' : '')];
  if (o.sector) partes.push(sectorCorto(o.sector));
  if (o.anuncio) partes.push('anuncio ' + o.anuncio);
  if (o.detalle) partes.push(o.detalle);
  return partes.join(' · ');
}

// Crea el trato si el contacto no tiene ninguno abierto en Prospección.
// o: { contactId, nombre, origen, fuente, empresa?, detalle?, etapa? }
async function crear(o) {
  try {
    if (!o || !o.contactId) return { ok: false, motivo: 'sin_contacto' };
    const pl = await pipelineDe(o.contactId);
    const ya = await abierto(o.contactId, pl.id);
    if (ya) return { ok: true, id: ya.id, existia: true };
    if (o.adId && !o.anuncio) o.anuncio = await nombreAnuncio(o.adId);
    // Si viene de un anuncio, la fuente lo dice aunque haya entrado por la landing.
    const fuente = o.anuncio
      ? 'Meta · ' + o.anuncio + (o.fuente && o.origen !== 'Meta' ? ' → ' + o.fuente : '')
      : (o.fuente || o.origen || '');
    const r = await fetch(GHL_BASE + '/opportunities/', {
      method: 'POST', headers: cabeceras(),
      body: JSON.stringify({
        pipelineId: pl.id,
        pipelineStageId: pl.etapas[o.etapa] || pl.etapas.nuevo,
        locationId: process.env.GHL_LOCATION_ID,
        contactId: o.contactId,
        name: titulo(o).slice(0, 200),
        status: 'open',
        source: fuente.slice(0, 200),
        assignedTo: USUARIO_MAIKEL
      })
    });
    if (!r.ok) throw new Error('ghl_opportunity ' + r.status + ' ' + (await r.text()).slice(0, 200));
    const d = await r.json().catch(function () { return {}; });
    return { ok: true, id: d && d.opportunity ? d.opportunity.id : null, existia: false };
  } catch (err) {
    console.error('[tratos] no se pudo crear el trato', o && o.contactId, err && err.message);
    return { ok: false, motivo: err && err.message };
  }
}

// Mueve el trato abierto del contacto a la etapa indicada. Si no hay trato y
// se pasa `crearSi` ({ nombre, origen, fuente, empresa? }), lo crea ya en esa
// etapa. No baja nunca desde «Cliente».
async function mover(contactId, etapa, crearSi) {
  try {
    if (!contactId || !ETAPAS[etapa]) return { ok: false, motivo: 'parametros' };
    const pl = await pipelineDe(contactId);
    const op = await abierto(contactId, pl.id);
    if (!op) {
      if (!crearSi) return { ok: false, motivo: 'sin_trato' };
      return crear(Object.assign({}, crearSi, { contactId: contactId, etapa: etapa }));
    }
    if (pl.reactivacion) {
      // Qualivo Pipeline: se mueve a la etapa equivalente, sin bajar de Cliente Activo.
      if (op.pipelineStageId === pl.etapas[etapa]) return { ok: true, id: op.id, movido: false };
      if (op.pipelineStageId === pl.etapas.cliente) return { ok: true, id: op.id, movido: false, motivo: 'ya_cliente' };
      const rq = await fetch(GHL_BASE + '/opportunities/' + op.id, {
        method: 'PUT', headers: cabeceras(), body: JSON.stringify({ pipelineStageId: pl.etapas[etapa] })
      });
      if (!rq.ok) throw new Error('ghl_opportunity_put ' + rq.status + ' ' + (await rq.text()).slice(0, 200));
      return { ok: true, id: op.id, movido: true, pipeline: 'qualivo' };
    }
    if (op.pipelineStageId === ETAPAS[etapa]) return { ok: true, id: op.id, movido: false };
    if (op.pipelineStageId === ETAPAS.cliente) return { ok: true, id: op.id, movido: false, motivo: 'ya_cliente' };
    // Nunca hacia atrás: el 18-sep la agenda puso un trato en «Reunión agendada» y
    // el final de la llamada lo devolvió a «Conversación abierta».
    const ORDEN = ['nuevo', 'enCadencia', 'conversacion', 'reunion', 'noPresentado', 'oferta', 'seguimiento', 'masAdelante', 'noResponde', 'piloto', 'cliente'];
    const actual = Object.keys(ETAPAS).filter(function (k) { return ETAPAS[k] === op.pipelineStageId; })[0];
    if (actual && ORDEN.indexOf(actual) > ORDEN.indexOf(etapa) && etapa !== 'masAdelante') {
      return { ok: true, id: op.id, movido: false, motivo: 'no_retrocede' };
    }
    const r = await fetch(GHL_BASE + '/opportunities/' + op.id, {
      method: 'PUT', headers: cabeceras(), body: JSON.stringify({ pipelineStageId: ETAPAS[etapa] })
    });
    if (!r.ok) throw new Error('ghl_opportunity_put ' + r.status + ' ' + (await r.text()).slice(0, 200));
    return { ok: true, id: op.id, movido: true };
  } catch (err) {
    console.error('[tratos] no se pudo mover el trato', contactId, etapa, err && err.message);
    return { ok: false, motivo: err && err.message };
  }
}

module.exports = { crear: crear, mover: mover, abierto: abierto, sectorCorto: sectorCorto, nombreAnuncio: nombreAnuncio, esReactivacion: esReactivacion, pipelineDe: pipelineDe, PIPELINE: PIPELINE, ETAPAS: ETAPAS, PIPELINE_QUALIVO: PIPELINE_QUALIVO, ETAPAS_QUALIVO: ETAPAS_QUALIVO };
