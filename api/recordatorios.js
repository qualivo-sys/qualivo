// Recordatorios de cita (cron). Dos entradas en vercel.json:
//   /api/recordatorios/            → mismo día. Cron a las 7:00 y 8:00 UTC; solo
//                                    actúa la vuelta que cae a las 9:00 de Madrid
//                                    (cambio de hora de verano/invierno).
//   /api/recordatorios/?modo=vispera → cron a las 16:30 y 17:30 UTC; actúa a las 18:30.
//
// GET ...?dry=1 devuelve lo que haría sin enviar nada (con el secreto).

const A = require('./_activacion');
const R = require('./_recordatorios.js');

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) return res.status(500).json({ ok: false, error: 'not_configured' });

  const q = req.query || {};
  const modo = String(q.modo || '') === 'vispera' ? 'vispera' : 'dia';
  const seco = String(q.dry || '') === '1';
  const t = A.ahoraMadrid();
  const horaBuena = modo === 'vispera' ? t.hora === 18 : t.hora === 9;
  if (!horaBuena && !seco) return res.status(200).json({ ok: true, esperando: 'no es la hora de Madrid (' + t.hora + ':' + String(t.minuto).padStart(2, '0') + ')', modo: modo });

  const resumen = await R.vuelta(modo, { seco: seco });
  console.log('[recordatorios]', JSON.stringify({ modo: modo, citas: resumen.citas, enviados: resumen.enviados, saltados: resumen.saltados, errores: resumen.errores.length }));
  return res.status(200).json(Object.assign({ ok: true, seco: seco }, resumen));
};
