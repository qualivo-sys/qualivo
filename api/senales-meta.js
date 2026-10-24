// Señales del CRM a Meta (Paid, 24-oct-2026; cron cada 2 horas, todos los días).
//
// Meta solo aprende quién es nuestro cliente si le contamos qué pasó con cada lead
// del formulario instantáneo. Hasta hoy eso dependía de mover el trato en GHL o del
// barrido de seguimientos.js, que solo mira tratos ABIERTOS y solo de lunes a viernes:
// el primer cliente de E-01 (cerrado el 23-oct) le llegó a Meta como «Contacted» y nada
// más. Aquí se recorren los tratos abiertos y ganados de Prospección y, para cada lead
// con etiqueta meta-lead-<id>, se manda lo que falte, una sola vez (etiqueta meta-<evento>):
//   Schedule   · tiene reunión agendada (etapa de reunión o posterior, o act-agendado)
//   Qualified  · reunión celebrada con encaje (reunion-encaja, oferta, segunda, negociación,
//                piloto o cliente)
//   Converted  · piloto o cliente (etapa, trato ganado o etiqueta cliente/piloto), con el
//                importe del trato
// «Disqualified» lo siguen mandando el agente y la activación, como hasta ahora.
//
// GET /api/senales-meta/?dry=1 devuelve lo que mandaría sin mandar nada.

const T = require('./_tratos.js');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const MAX_ENVIOS = 60;

async function ghlJson(url, headers, opciones) {
  const r = await fetch(url, Object.assign({ headers }, opciones || {}));
  if (!r.ok) throw new Error(url.split('?')[0].split('/').slice(-2).join('/') + ' ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return r.json();
}

// Qué eventos le tocan a un lead, según la etapa del trato, su estado y sus etiquetas.
function eventosQueTocan(nombreEtapa, estado, tags) {
  const n = String(nombreEtapa || '').toLowerCase();
  const tiene = function (t) { return tags.indexOf(t) !== -1; };
  const venta = /piloto|^cliente/.test(n) || estado === 'won' || tiene('cliente') || tiene('piloto');
  const encaja = venta || tiene('reunion-encaja') || /oferta|propuesta|segunda|negociaci/.test(n);
  const reserva = encaja || /reuni|confirmad|no presentad|call agendada/.test(n) || tiene('act-agendado');
  const out = [];
  if (reserva) out.push({ evento: 'Schedule', etapa: 'reserva' });
  if (encaja) out.push({ evento: 'Qualified', etapa: 'celebrada' });
  if (venta) out.push({ evento: 'Converted', etapa: tiene('piloto') && !tiene('cliente') && !/^cliente/.test(n) ? 'piloto' : 'cliente' });
  return out;
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const apiKey = process.env.GHL_API_KEY, locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });
  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };
  const seco = String((req.query || {}).dry || '') === '1';
  const pipeline = process.env.GHL_PIPELINE_PROSPECCION || 'JaB4LIwUqFn96LLFEhSm';
  const resumen = { revisados: 0, leads_meta: 0, enviados: [], pendientes_seco: [], errores: [] };

  try {
    const pls = await ghlJson(GHL_BASE + '/opportunities/pipelines?locationId=' + locationId, ghl);
    const etapa = {};
    (pls.pipelines || []).forEach(function (p) { (p.stages || []).forEach(function (s) { etapa[s.id] = String(s.name); }); });

    const tratos = [];
    for (const estado of ['open', 'won']) {
      let url = GHL_BASE + '/opportunities/search?location_id=' + locationId + '&pipeline_id=' + pipeline + '&status=' + estado + '&limit=100';
      for (let p = 0; p < 10 && url; p++) {
        const d = await ghlJson(url, ghl);
        tratos.push.apply(tratos, d.opportunities || []);
        const sig = d.meta && d.meta.nextPageUrl;
        url = sig && (d.opportunities || []).length === 100 ? sig : null;
      }
    }
    resumen.revisados = tratos.length;

    let enviados = 0;
    for (const op of tratos) {
      if (enviados >= MAX_ENVIOS) break;
      const nombreEtapa = etapa[op.pipelineStageId] || '';
      const contactId = op.contact && op.contact.id ? op.contact.id : op.contactId;
      if (!contactId) continue;
      // Solo se lee el contacto si el trato está más allá de «conversación» o ganado: ahorra llamadas.
      if (op.status !== 'won' && !/reuni|confirmad|presentad|oferta|propuesta|segunda|negociaci|piloto|cliente|adelante|responde/i.test(nombreEtapa)) continue;
      let ct;
      try { ct = (await ghlJson(GHL_BASE + '/contacts/' + contactId, ghl)).contact || {}; }
      catch (e) { resumen.errores.push('contacto ' + contactId + ': ' + String(e.message).slice(0, 80)); continue; }
      const tags = (ct.tags || []).map(String);
      if (!tags.some(function (t) { return t.indexOf('meta-lead-') === 0; })) continue;
      resumen.leads_meta++;
      for (const x of eventosQueTocan(nombreEtapa, op.status, tags)) {
        if (tags.indexOf('meta-' + x.evento.toLowerCase()) !== -1) continue;
        const valor = x.evento === 'Converted' ? Number(op.monetaryValue) || 0 : 0;
        if (seco) { resumen.pendientes_seco.push({ contacto: contactId, etapa: nombreEtapa, evento: x.evento, valor: valor || undefined }); continue; }
        const r = x.evento === 'Schedule'
          ? await enviarReserva(ct, tags)
          : await T.calidadAMeta(ct, x.etapa, x.evento === 'Qualified' ? 'reunión celebrada con encaje' : 'cliente', valor);
        if (r === 'enviado') { enviados++; tags.push('meta-' + x.evento.toLowerCase()); }
        resumen.enviados.push({ contacto: contactId, evento: x.evento, valor: valor || undefined, resultado: r || 'error' });
      }
    }
    return res.status(200).json(Object.assign({ ok: true, seco: seco }, resumen));
  } catch (e) {
    resumen.errores.push(String(e && e.message).slice(0, 200));
    return res.status(500).json(Object.assign({ ok: false }, resumen));
  }
};

// La reserva con el lead_id (integración CRM), una vez. _cita.js manda además su
// «Schedule» de web con email y teléfono hasheados; Meta los trata como fuentes distintas.
async function enviarReserva(ct, tags) {
  try {
    const idMeta = tags.filter(function (t) { return t.indexOf('meta-lead-') === 0; })[0];
    const r = await require('./_meta.js').calidadLead('Schedule', {
      leadgenId: idMeta.slice(10), email: ct.email, telefono: ct.phone, contactId: ct.id, motivo: 'reunión agendada'
    });
    if (r === 'enviado') {
      await fetch(GHL_BASE + '/contacts/' + ct.id + '/tags', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + process.env.GHL_API_KEY, Version: GHL_VERSION, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['meta-schedule'] })
      });
    }
    return r;
  } catch (e) { console.error('[senales-meta] reserva no salió', ct && ct.id, e && e.message); return 'error'; }
}

module.exports.eventosQueTocan = eventosQueTocan;
