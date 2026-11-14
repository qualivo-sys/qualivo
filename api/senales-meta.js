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
// 3-nov-2026 (Paid, encargo de Maikel: «el responsable eres tú»). La auditoría del 3-nov
// encontró ~30 de 60 leads de formulario sin ninguna señal: solo se miraban los tratos
// abiertos y ganados, así que los PERDIDOS y los «No responde» nunca le llegaban a Meta
// como malos, y «Contacted» solo salía en algunos casos. Ahora:
//   Contacted    · contestó (act-respondio) o el trato pasó de «Nuevo lead»
//   Disqualified · trato perdido o abandonado, o en «No responde» / «No presentado», o
//                  con la etiqueta no-encaja, siempre que no haya llegado a encajar
// Y además, en cada vuelta:
//   · Un trato en «Reunión agendada» o «Confirmado» cuya última cita ya pasó y GHL la
//     marca como no presentada se mueve solo a «No presentado».
//   · Si GHL la marca como celebrada, se pone reunion-celebrada; el resultado (encaja,
//     oferta, más adelante) lo pone Maikel, y la revisión diaria se lo recuerda.
// Revisión diaria (vuelta de las 6:25 UTC, o ?revision=1): correo a Maikel con lo enviado,
// lo movido y los tratos que piden que alguien ponga qué pasó.
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
  const malo = !encaja && (estado === 'lost' || estado === 'abandoned' || /no responde|no presentad/.test(n) || tiene('no-encaja'));
  const contacto = reserva || tiene('act-respondio') || /conversaci|oferta|segunda|negociaci|adelante/.test(n);
  const out = [];
  if (contacto) out.push({ evento: 'Contacted', etapa: 'contacto', motivo: 'contestó o avanzó en el embudo' });
  if (reserva) out.push({ evento: 'Schedule', etapa: 'reserva', motivo: 'reunión agendada' });
  if (encaja) out.push({ evento: 'Qualified', etapa: 'celebrada' });
  if (malo) out.push({ evento: 'Disqualified', etapa: 'descartado', motivo: estado === 'lost' || estado === 'abandoned' ? 'trato perdido' : /presentad/.test(n) ? 'no se presentó' : /responde/.test(n) ? 'no responde' : 'no encaja' });
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
  const resumen = { revisados: 0, leads_meta: 0, enviados: [], pendientes_seco: [], movidos: [], sin_resultado: [], errores: [] };
  const conRevision = String((req.query || {}).revision || '') === '1' || new Date().getUTCHours() === 6;

  try {
    const pls = await ghlJson(GHL_BASE + '/opportunities/pipelines?locationId=' + locationId, ghl);
    const etapa = {};
    (pls.pipelines || []).forEach(function (p) { (p.stages || []).forEach(function (s) { etapa[s.id] = String(s.name); }); });

    const tratos = [];
    for (const estado of ['open', 'won', 'lost', 'abandoned']) {
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
      // Se salta solo lo que sigue abierto en «Nuevo lead» o «En cadencia» sin más: ahí no hay nada que contar todavía.
      if (op.status === 'open' && /^nuevo|cadencia/i.test(nombreEtapa)) continue;
      // Reunión ya pasada: se mira la cita en GHL (no presentado → se mueve; celebrada → se marca).
      if (op.status === 'open' && /reuni|confirmad/i.test(nombreEtapa)) {
        try {
          const rc = await revisarReunion(op, contactId, ghl, seco);
          if (rc) resumen[rc.lista].push(rc.dato);
        } catch (e) { resumen.errores.push('cita ' + contactId + ': ' + String(e.message).slice(0, 80)); }
      }
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
        const r = (x.evento === 'Schedule' || x.evento === 'Contacted' || x.evento === 'Disqualified')
          ? await enviarDirecto(ct, tags, x.evento, x.motivo)
          : await T.calidadAMeta(ct, x.etapa, x.evento === 'Qualified' ? 'reunión celebrada con encaje' : 'cliente', valor);
        if (r === 'enviado') { enviados++; tags.push('meta-' + x.evento.toLowerCase()); }
        resumen.enviados.push({ contacto: contactId, evento: x.evento, valor: valor || undefined, resultado: r || 'error' });
      }
    }
    if (conRevision && !seco) {
      try { resumen.revision = await correoRevision(resumen, tratos, etapa); }
      catch (e) { resumen.errores.push('revision: ' + String(e.message).slice(0, 120)); }
    }
    return res.status(200).json(Object.assign({ ok: true, seco: seco }, resumen));
  } catch (e) {
    resumen.errores.push(String(e && e.message).slice(0, 200));
    return res.status(500).json(Object.assign({ ok: false }, resumen));
  }
};

// Schedule, Contacted y Disqualified con el lead_id (integración CRM), una vez cada uno
// (etiqueta meta-<evento>). _cita.js manda además su «Schedule» de web con email y teléfono
// hasheados; Meta los trata como fuentes distintas.
async function enviarDirecto(ct, tags, evento, motivo) {
  try {
    const idMeta = tags.filter(function (t) { return t.indexOf('meta-lead-') === 0; })[0];
    const r = await require('./_meta.js').calidadLead(evento, {
      leadgenId: idMeta.slice(10), email: ct.email, telefono: ct.phone, contactId: ct.id, motivo: motivo
    });
    if (r === 'enviado') await ponerEtiqueta(ct.id, 'meta-' + evento.toLowerCase());
    return r;
  } catch (e) { console.error('[senales-meta] ' + evento + ' no salió', ct && ct.id, e && e.message); return 'error'; }
}

async function ponerEtiqueta(contactId, tag) {
  await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.GHL_API_KEY, Version: GHL_VERSION, 'Content-Type': 'application/json' },
    body: JSON.stringify({ tags: [tag] })
  });
}

// Trato en «Reunión agendada» o «Confirmado»: ¿la última cita ya pasó? Si GHL la marca como
// no presentada, se mueve a «No presentado». Si la marca como celebrada, etiqueta
// reunion-celebrada. Si pasó hace más de 24 h sin marcar, va a la lista de «sin resultado».
// Si hay otra cita viva por delante, no se toca.
async function revisarReunion(op, contactId, ghl, seco) {
  const C = require('./_cita.js');
  const d = await ghlJson(GHL_BASE + '/contacts/' + contactId + '/appointments', ghl);
  const citas = (d.events || d.appointments || []).map(function (e) {
    return { ini: C.fechaGHL(e.startTime), estado: String(e.appointmentStatus || e.status || '').toLowerCase() };
  }).filter(function (c) { return c.ini && !/cancel|invalid/.test(c.estado); });
  const ahora = Date.now();
  if (citas.some(function (c) { return c.ini.getTime() > ahora - 2 * 3600 * 1000; })) return null;
  const pasadas = citas.sort(function (a, b) { return b.ini - a.ini; });
  const nombre = (op.contact && (op.contact.companyName || op.contact.name)) || op.name || contactId;
  const dias = Math.round((ahora - Date.parse(op.lastStageChangeAt || op.updatedAt || op.createdAt)) / 86400000);
  if (!pasadas.length) {
    return dias >= 7 ? { lista: 'sin_resultado', dato: { contacto: contactId, nombre: nombre, motivo: 'en reunión agendada desde hace ' + dias + ' días y sin cita en el calendario' } } : null;
  }
  const ult = pasadas[0];
  if (/noshow|no_show/.test(ult.estado)) {
    if (!seco) await T.mover(contactId, 'noPresentado');
    return { lista: 'movidos', dato: { contacto: contactId, nombre: nombre, a: 'No presentado', cita: ult.ini.toISOString().slice(0, 10), seco: seco || undefined } };
  }
  if (/showed/.test(ult.estado)) {
    if (!seco) await ponerEtiqueta(contactId, 'reunion-celebrada');
    return { lista: 'sin_resultado', dato: { contacto: contactId, nombre: nombre, motivo: 'reunión celebrada el ' + ult.ini.toISOString().slice(0, 10) + ': falta poner si encaja, oferta o más adelante' } };
  }
  if (ahora - ult.ini.getTime() > 24 * 3600 * 1000) {
    return { lista: 'sin_resultado', dato: { contacto: contactId, nombre: nombre, motivo: 'cita del ' + ult.ini.toISOString().slice(0, 10) + ' sin marcar en GHL (¿se celebró?)' } };
  }
  return null;
}

// Correo diario a Maikel: lo enviado a Meta, lo movido y lo que pide su mano.
async function correoRevision(r, tratos, etapa) {
  const cuenta = {};
  r.enviados.forEach(function (e) { if (e.resultado === 'enviado') cuenta[e.evento] = (cuenta[e.evento] || 0) + 1; });
  const fallos = r.enviados.filter(function (e) { return e.resultado !== 'enviado'; }).length;
  const li = function (xs, f) { return xs.length ? '<ul style="margin:6px 0 0;padding-left:18px">' + xs.map(function (x) { return '<li>' + f(x) + '</li>'; }).join('') + '</ul>' : '<p style="margin:6px 0 0;color:#5A5E66">Nada.</p>'; };
  const esc = function (t) { return String(t || '').replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }); };
  const html = '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.55;color:#101319;max-width:620px">' +
    '<p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#7A7C82;margin:0 0 6px">Revisión diaria · CRM → Meta</p>' +
    '<p><b>' + r.revisados + '</b> tratos revisados, <b>' + r.leads_meta + '</b> de formulario de Meta.</p>' +
    '<p style="margin:18px 0 0;font-weight:800">Señales enviadas a Meta en esta vuelta</p>' +
    li(Object.keys(cuenta), function (k) { return k + ': ' + cuenta[k]; }) +
    (fallos ? '<p style="color:#B42318">' + fallos + ' señales no salieron; se reintentan en la próxima vuelta.</p>' : '') +
    '<p style="margin:18px 0 0;font-weight:800">Tratos movidos solos</p>' +
    li(r.movidos, function (m) { return esc(m.nombre) + ' → ' + m.a + ' (cita del ' + m.cita + ')'; }) +
    '<p style="margin:18px 0 0;font-weight:800">Necesitan que pongas qué pasó en GHL</p>' +
    li(r.sin_resultado, function (m) { return esc(m.nombre) + ': ' + esc(m.motivo); }) +
    (r.errores.length ? '<p style="margin-top:18px;color:#B42318">Errores: ' + esc(r.errores.slice(0, 5).join(' · ')) + '</p>' : '') +
    '<p style="font-size:12.5px;color:#9AA2AE;margin-top:22px">Lo manda /api/senales-meta cada día a las 7:25 (Madrid). Responsable: Paid.</p></div>';
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
      to: [process.env.INFORME_PAID_TO || 'maikel@qualivo.io'],
      subject: (r.sin_resultado.length ? '⚠ ' + r.sin_resultado.length + ' tratos sin resultado · ' : '') + 'Revisión CRM → Meta',
      html: html
    })
  });
  return resp.ok ? 'enviado' : 'error ' + resp.status;
}

module.exports.eventosQueTocan = eventosQueTocan;
