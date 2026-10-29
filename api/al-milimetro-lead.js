// Al Milímetro: recibe el formulario «Calcula tu reforma» de la landing
// (qualivo.io/propuestas/al-milimetro/landing-v2/) y lo deja en la base de datos propia de Al Milímetro.
// Decidido el 29-oct: sistema propio en qualivo.io, sin GHL.
//
//   POST /api/al-milimetro-lead   { nombre, tel, email, rgpd, tipo, cp, mun, m2, cuando, ppto, propia,
//                                   inst, frase, a, m, utm, website (honeypot) }
//
// 1. Repite los descartes del navegador. Si no encaja, NO guarda nada (acuerdo del 23-oct).
// 2. Puntúa A/B/C (api/_am-modelo.js) y guarda el lead con su origen (?a=) en la etapa «nuevo».
// 3. Al momento: email E1 al lead (si dejó email) y aviso a Sonia con la ficha, el botón de WhatsApp con el
//    primer mensaje ya escrito (sale desde su número) y los botones para marcar cómo avanza.
// 4. Programa los seguimientos: E2 (día 3), E3 (día 7) y E4 (día 14) por email, y W5 (día 1) y W6 (día 3)
//    como recordatorios de WhatsApp en el resumen diario de Sonia. Los envía api/al-milimetro-cron.js.
//
// Variables: AM_DATABASE_URL · RESEND_API_KEY · AM_EMAIL_FROM · AM_AVISO_TO · AM_LINK_SECRET · AM_BASE_URL
//            AM_SOLO_PRUEBA=1 mientras Sonia no dé el OK: solo se guardan los leads «PRUEBA QUALIVO».
// Sin AM_DATABASE_URL responde en modo vista previa: puntúa y no guarda nada.

const M = require('./_am-modelo.js');
const DB = require('./_am-db.js');
const C = require('./_am-correo.js');

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ORIGENES = ['pared', 'chalet', 'precio', 'portal'];
const PRUEBA_RE = /prueba qualivo/i;
const DIA = 864e5;

function telefono(t) {
  let d = String(t || '').replace(/[^\d+]/g, '');
  if (/^00/.test(d)) d = '+' + d.slice(2);
  if (/^[6789]\d{8}$/.test(d)) d = '+34' + d;
  return /^\+\d{9,15}$/.test(d) ? d : '';
}
const limpio = function (s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n || 200); };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }
  const b = (typeof req.body === 'string' ? (function () { try { return JSON.parse(req.body); } catch (e) { return {}; } })() : req.body) || {};
  if (b.website) return res.status(200).json({ ok: true });           // honeypot

  const r = {
    tipo: limpio(b.tipo, 10), cp: limpio(b.cp, 5), mun: limpio(b.mun, 80), m2: limpio(b.m2, 10), cuando: limpio(b.cuando, 10),
    ppto: limpio(b.ppto, 10), propia: limpio(b.propia, 12), inst: limpio(b.inst, 10), frase: limpio(b.frase, 500)
  };
  if (!M.OPCIONES.tipo[r.tipo]) return res.status(400).json({ ok: false, error: 'invalid_payload' });

  const motivo = M.descarte(r);
  if (motivo) return res.status(200).json({ ok: true, descartado: motivo });   // no se guarda nada

  const nombre = limpio(b.nombre, 80), email = limpio(b.email, 120).toLowerCase(), tel = telefono(b.tel);
  if (!nombre || !tel || b.rgpd !== true || (email && !EMAIL_RE.test(email)) || !/^\d{5}$/.test(r.cp)) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }
  const origen = ORIGENES.indexOf(String(b.a)) > -1 ? String(b.a) : 'web';
  const prueba = PRUEBA_RE.test(nombre);
  const revision = M.necesitaRevision(r);
  const sc = M.puntuar(r);

  if (!DB.configurada()) return res.status(200).json({ ok: true, modo: 'vista_previa', clase: sc.clase, puntos: sc.puntos, revision: revision, prueba: prueba });
  if (process.env.AM_SOLO_PRUEBA === '1' && !prueba) {
    console.warn('[am-lead] Lead real con AM_SOLO_PRUEBA=1: no se guarda');
    return res.status(200).json({ ok: true, modo: 'solo_prueba' });
  }

  let L;
  try {
    await DB.asegurar();
    const utm = {}; Object.keys(b.utm || {}).forEach(function (k) { if (/^utm_(source|medium|campaign|content|term)$/.test(k)) utm[k] = limpio(b.utm[k], 80); });
    const filas = await DB.sql(
      `INSERT INTO am_leads (nombre, telefono, email, prueba, tipo, cp, mun, m2, cuando, ppto, propia, inst, frase, origen, municipio_anuncio, utm, clase, puntos, motivos, revision)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING row_to_json(am_leads.*) AS j`,
      [nombre, tel, email || null, prueba, r.tipo, r.cp, r.mun, r.m2, r.cuando, r.ppto, r.propia, r.inst || null, r.frase || null,
        origen, limpio(b.m, 40) || null, JSON.stringify(utm), sc.clase, sc.puntos, sc.motivos, revision]);
    L = M.vista(filas[0]);
    // Seguimientos programados (el cron los envía dentro del horario y comprueba antes las paradas)
    const t0 = Date.parse(L.creado);
    const pasos = [['W5', 'wa', 1], ['W6', 'wa', 3]].concat(email ? [['E2', 'email', 3], ['E3', 'email', 7], ['E4', 'email', 14]] : []);
    for (const ps of pasos) {
      await DB.sql('INSERT INTO am_envios (lead_id, paso, canal, programado) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', [L.id, ps[0], ps[1], new Date(t0 + ps[2] * DIA).toISOString()]);
    }
    await DB.evento(L.id, 'alta', { clase: sc.clase, puntos: sc.puntos, origen: origen, revision: revision });
  } catch (err) {
    console.error('[am-lead] No se ha podido guardar:', err.message);
    return res.status(502).json({ ok: false, error: 'db_error' });
  }

  // Envíos inmediatos: si fallan, el lead ya está guardado y queda apuntado para reintentar
  const inmediatos = [];
  if (L.email) inmediatos.push(['E1', function () { const c = C.CORREOS.E1(L); return C.enviar(L.email, c.asunto, c.html, { responder: process.env.AM_AVISO_TO, baja: C.enlaceAccion(L.id, 'baja') }); }]);
  if (process.env.AM_AVISO_TO) inmediatos.push(['AVISO', function () { const c = C.avisoNuevo(L); return C.enviar(process.env.AM_AVISO_TO, c.asunto, c.html); }]);
  for (const [paso, fn] of inmediatos) {
    // Si falla, queda «pendiente» y el cron lo reintenta en su siguiente vuelta
    let estado = 'enviado', detalle = null;
    try { await fn(); } catch (e) { estado = 'pendiente'; detalle = e.message.slice(0, 300); console.error('[am-lead] ' + paso + ' no enviado:', e.message); }
    try {
      await DB.sql(`INSERT INTO am_envios (lead_id, paso, canal, programado, estado, hecho, detalle) VALUES ($1,$2,'email',now(),$3,CASE WHEN $3 = 'enviado' THEN now() END,$4)
                    ON CONFLICT (lead_id, paso) DO UPDATE SET estado = EXCLUDED.estado, hecho = EXCLUDED.hecho, detalle = EXCLUDED.detalle`, [L.id, paso, estado, detalle]);
    } catch (e) { console.error('[am-lead] registro de envío', e.message); }
  }
  return res.status(200).json({ ok: true, clase: sc.clase, revision: revision, prueba: prueba });
};
