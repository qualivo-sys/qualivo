// Al Milímetro: recibe el formulario «Calcula tu reforma» de la landing
// (qualivo.io/propuestas/al-milimetro/landing-v2/) y lo deja en la subcuenta de GHL de Sonia.
//
//   POST /api/al-milimetro-lead   { nombre, tel, email, rgpd, tipo, cp, mun, m2, cuando, ppto, propia,
//                                   inst, frase, a, m, utm, website (honeypot) }
//
// Qué hace:
//   1. Repite los descartes del navegador. Si no encaja, NO guarda nada (acuerdo del 23-oct:
//      que las campañas no aprendan a traer más de esos) y responde { descartado: motivo }.
//   2. Puntúa A/B/C (api/_am-modelo.js).
//   3. Crea o actualiza el contacto con sus campos, le suma etiquetas (am-lead, am-a|b|c, am-revision,
//      am-origen-<a>, am-prueba si el nombre lleva «PRUEBA QUALIVO»), abre la oportunidad en la etapa
//      «Nuevo» del pipeline y deja una nota con todas las respuestas.
//   Los flujos de GHL (WhatsApp, emails y aviso a Sonia) se disparan con esas etiquetas.
//
// Variables en Vercel (las pone Maikel o Growth; nunca en el repo):
//   AM_GHL_API_KEY      token privado de la subcuenta de Al Milímetro
//   AM_GHL_LOCATION_ID  id de la subcuenta
//   AM_GHL_PIPELINE_ID  (opcional) id del pipeline; si falta, se busca por nombre («Al Milímetro»)
//   AM_SOLO_PRUEBA      «1» mientras Sonia no dé el OK: solo se guardan los leads «PRUEBA QUALIVO»
// Sin AM_GHL_API_KEY responde en modo vista previa: puntúa y no guarda nada.

const M = require('./_am-modelo.js');

const GHL = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ORIGENES = ['pared', 'chalet', 'precio', 'portal'];
const PRUEBA_RE = /prueba qualivo/i;

let cacheCampos = null, cacheEtapa = null;

function cab(key) {
  return { Authorization: 'Bearer ' + key, Version: VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };
}
async function ghl(key, metodo, ruta, cuerpo) {
  for (let intento = 0; ; intento++) {
    const r = await fetch(GHL + ruta, { method: metodo, headers: cab(key), body: cuerpo ? JSON.stringify(cuerpo) : undefined });
    if (r.status === 429 && intento < 3) { await new Promise(function (ok) { setTimeout(ok, 1200 * (intento + 1)); }); continue; }
    const txt = await r.text();
    if (!r.ok) throw new Error('GHL ' + metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ' ' + txt.slice(0, 300));
    return txt ? JSON.parse(txt) : {};
  }
}

// Campos personalizados por su clave (fieldKey «contact.am_…»), leídos una vez por instancia
async function campos(key, loc) {
  if (cacheCampos) return cacheCampos;
  const d = await ghl(key, 'GET', '/locations/' + loc + '/customFields?model=contact');
  const m = {};
  (d.customFields || []).forEach(function (f) { m[String(f.fieldKey || '').replace(/^contact\./, '')] = f.id; });
  cacheCampos = m;
  return m;
}
async function etapaNuevo(key, loc) {
  if (cacheEtapa) return cacheEtapa;
  const d = await ghl(key, 'GET', '/opportunities/pipelines?locationId=' + loc);
  const ps = d.pipelines || [];
  const p = ps.filter(function (x) { return process.env.AM_GHL_PIPELINE_ID ? x.id === process.env.AM_GHL_PIPELINE_ID : /al mil[ií]metro/i.test(x.name); });
  if (p.length !== 1) throw new Error('Pipeline de Al Milímetro: se esperaba 1 y hay ' + p.length);
  const st = (p[0].stages || []).filter(function (s) { return /^nuevo$/i.test(String(s.name).trim()); });
  if (st.length !== 1) throw new Error('Etapa «Nuevo»: se esperaba 1 y hay ' + st.length);
  cacheEtapa = { pipelineId: p[0].id, stageId: st[0].id };
  return cacheEtapa;
}

function telefono(t) {
  let d = String(t || '').replace(/[^\d+]/g, '');
  if (/^00/.test(d)) d = '+' + d.slice(2);
  if (/^[6789]\d{8}$/.test(d)) d = '+34' + d;
  return /^\+\d{9,15}$/.test(d) ? d : '';
}
const limpio = function (s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n || 200); };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });           // honeypot

  const r = {
    tipo: limpio(b.tipo, 10), cp: limpio(b.cp, 5), mun: limpio(b.mun, 80), m2: limpio(b.m2, 10), cuando: limpio(b.cuando, 10),
    ppto: limpio(b.ppto, 10), propia: limpio(b.propia, 12), inst: limpio(b.inst, 10), frase: limpio(b.frase, 500)
  };
  if (!M.OPCIONES.tipo[r.tipo]) return res.status(400).json({ ok: false, error: 'invalid_payload' });

  const motivo = M.descarte(r);
  if (motivo) return res.status(200).json({ ok: true, descartado: motivo });   // no se guarda nada

  const nombre = limpio(b.nombre, 80), email = limpio(b.email, 120), tel = telefono(b.tel);
  if (!nombre || !tel || b.rgpd !== true || (email && !EMAIL_RE.test(email)) || !/^\d{5}$/.test(r.cp)) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }
  const origen = ORIGENES.indexOf(String(b.a)) > -1 ? String(b.a) : 'web';
  const prueba = PRUEBA_RE.test(nombre);
  const revision = M.necesitaRevision(r);
  const sc = M.puntuar(r);

  const key = process.env.AM_GHL_API_KEY, loc = process.env.AM_GHL_LOCATION_ID;
  if (!key || !loc) {
    return res.status(200).json({ ok: true, modo: 'vista_previa', clase: sc.clase, puntos: sc.puntos, revision: revision, prueba: prueba });
  }
  if (process.env.AM_SOLO_PRUEBA === '1' && !prueba) {
    console.warn('[am-lead] Lead real recibido con AM_SOLO_PRUEBA=1: no se guarda');
    return res.status(200).json({ ok: true, modo: 'solo_prueba' });
  }

  try {
    const ids = await campos(key, loc);
    const valores = {
      am_tipo_obra: M.OPCIONES.tipo[r.tipo], am_tipo_texto: M.TIPO_TEXTO[r.tipo] || 'tu casa', am_codigo_postal: r.cp, am_zona: r.mun || r.cp,
      am_metros: M.OPCIONES.m2[r.m2] || '', am_cuando: M.OPCIONES.cuando[r.cuando] || '', am_presupuesto: M.OPCIONES.ppto[r.ppto] || '',
      am_vivienda_propia: M.OPCIONES.propia[r.propia] || '', am_clase: sc.clase, am_puntos: sc.puntos,
      am_origen: M.OPCIONES.origen[origen], am_revision: revision ? 'Sí' : 'No', am_desde: M.DESDE[r.tipo] || '',
      am_instalaciones: M.OPCIONES.inst[r.inst] || '', am_que_cambiar: r.frase
    };
    const faltan = Object.keys(valores).filter(function (k) { return !ids[k]; });
    if (faltan.length) console.error('[am-lead] Faltan campos en GHL (ejecutar scripts/al-milimetro/ghl-preparar.js):', faltan.join(', '));
    const customFields = Object.keys(valores).filter(function (k) { return ids[k] && valores[k] !== ''; })
      .map(function (k) { return { id: ids[k], field_value: valores[k] }; });

    // Sin «tags» en el upsert: si el contacto ya existía, GHL sustituiría sus etiquetas. Se suman después.
    const up = await ghl(key, 'POST', '/contacts/upsert', {
      locationId: loc, firstName: nombre, phone: tel, email: email || undefined,
      source: 'Landing Al Milímetro · ' + M.OPCIONES.origen[origen], customFields: customFields
    });
    const contactId = up && up.contact && up.contact.id;
    if (!contactId) throw new Error('upsert sin id');

    const tags = ['am-lead', 'am-' + sc.clase.toLowerCase(), 'am-origen-' + origen]
      .concat(revision ? ['am-revision'] : []).concat(prueba ? ['am-prueba'] : []);
    await ghl(key, 'POST', '/contacts/' + contactId + '/tags', { tags: tags });

    try {
      const et = await etapaNuevo(key, loc);
      await ghl(key, 'POST', '/opportunities/', {
        locationId: loc, pipelineId: et.pipelineId, pipelineStageId: et.stageId, contactId: contactId, status: 'open',
        name: (prueba ? '[PRUEBA] ' : '') + nombre + ' · ' + M.OPCIONES.tipo[r.tipo] + ' · ' + (r.mun || r.cp)
      });
    } catch (e) { console.error('[am-lead] Oportunidad no creada:', e.message); }

    const nota = [
      'Formulario «Calcula tu reforma» · ' + new Date().toISOString(),
      'Clase ' + sc.clase + ' · ' + sc.puntos + ' puntos (' + sc.motivos.join(', ') + ')' + (revision ? ' · pasa por segundas preguntas' : ''),
      'Obra: ' + M.OPCIONES.tipo[r.tipo] + ' · ' + (M.OPCIONES.m2[r.m2] || '—') + ' · ' + (r.mun || '') + ' (' + r.cp + ')',
      'Cuándo: ' + (M.OPCIONES.cuando[r.cuando] || '—') + ' · Presupuesto: ' + (M.OPCIONES.ppto[r.ppto] || '—') + ' · Vivienda propia: ' + (M.OPCIONES.propia[r.propia] || '—'),
      r.inst ? 'Instalaciones: ' + M.OPCIONES.inst[r.inst] : '',
      r.frase ? 'Qué quiere cambiar: ' + r.frase : '',
      'Origen: ' + M.OPCIONES.origen[origen] + (b.m ? ' · municipio del anuncio: ' + limpio(b.m, 40) : ''),
      'Consentimiento: sí'
    ].filter(Boolean).join('\n');
    try { await ghl(key, 'POST', '/contacts/' + contactId + '/notes', { body: nota }); } catch (e) { console.error('[am-lead] Nota no creada:', e.message); }

    return res.status(200).json({ ok: true, clase: sc.clase, revision: revision, prueba: prueba });
  } catch (err) {
    console.error('[am-lead] Error:', err.message);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};
