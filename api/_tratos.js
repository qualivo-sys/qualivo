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
  reunion: 'd491f3eb-2b82-468b-aab9-60e9cdc7368f',      // Reunión agendada
  oferta: '41c3a02d-a63e-4ef5-a402-7b562bbabfa9',       // Oferta enviada
  seguimiento: '3e12a08f-272b-4817-9bfe-fd83d24ca45e',  // Seguimiento
  masAdelante: '515ba6db-2f03-47ab-9c50-fc10f361192a',  // Más adelante
  cliente: '673ee555-349c-40ea-b4c3-8cc5e4a867b9'       // Cliente
};
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';

function cabeceras() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
}

// Trato abierto del contacto en Prospección, o null.
async function abierto(contactId) {
  const q = '/opportunities/search?location_id=' + encodeURIComponent(process.env.GHL_LOCATION_ID) +
    '&contact_id=' + encodeURIComponent(contactId) +
    '&pipeline_id=' + encodeURIComponent(PIPELINE) + '&status=open';
  const r = await fetch(GHL_BASE + q, { headers: cabeceras() });
  if (!r.ok) throw new Error('ghl_opportunities_search ' + r.status);
  const d = await r.json().catch(function () { return {}; });
  return (d.opportunities || [])[0] || null;
}

function titulo(o) {
  return (o.origen || 'Lead') + ' · ' + (o.nombre || o.email || o.telefono || 'Sin nombre') +
    (o.empresa ? ' (' + o.empresa + ')' : '') +
    (o.detalle ? ' · ' + o.detalle : '');
}

// Crea el trato si el contacto no tiene ninguno abierto en Prospección.
// o: { contactId, nombre, origen, fuente, empresa?, detalle?, etapa? }
async function crear(o) {
  try {
    if (!o || !o.contactId) return { ok: false, motivo: 'sin_contacto' };
    const ya = await abierto(o.contactId);
    if (ya) return { ok: true, id: ya.id, existia: true };
    const r = await fetch(GHL_BASE + '/opportunities/', {
      method: 'POST', headers: cabeceras(),
      body: JSON.stringify({
        pipelineId: PIPELINE,
        pipelineStageId: ETAPAS[o.etapa] || ETAPAS.nuevo,
        locationId: process.env.GHL_LOCATION_ID,
        contactId: o.contactId,
        name: titulo(o).slice(0, 200),
        status: 'open',
        source: o.fuente || o.origen || '',
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
    const op = await abierto(contactId);
    if (!op) {
      if (!crearSi) return { ok: false, motivo: 'sin_trato' };
      return crear(Object.assign({}, crearSi, { contactId: contactId, etapa: etapa }));
    }
    if (op.pipelineStageId === ETAPAS[etapa]) return { ok: true, id: op.id, movido: false };
    if (op.pipelineStageId === ETAPAS.cliente) return { ok: true, id: op.id, movido: false, motivo: 'ya_cliente' };
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

module.exports = { crear: crear, mover: mover, abierto: abierto, PIPELINE: PIPELINE, ETAPAS: ETAPAS };
