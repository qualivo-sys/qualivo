// GET  /api/supresion?email=…&dominio=…   → { bloqueado, motivos, avisos, contacto_previo }
// POST /api/supresion?accion=refrescar     → vuelca la foto de Smartlead a la hoja privada
// Autenticación: Authorization: Bearer <SUPRESION_SECRET o CRON_SECRET>.
// Es la supresión V1 de la adenda del 2-oct: cualquier agente la consulta antes
// de escribir, invitar o llamar. Si devuelve bloqueado o un aviso, no se contacta.
const S = require('./_supresion.js');

module.exports = async function handler(req, res) {
  const secreto = process.env.SUPRESION_SECRET || process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const q = req.query || {};
  try {
    if (req.method === 'POST' && q.accion === 'refrescar') {
      const n = await S.refrescarHoja();
      return res.status(200).json({ ok: true, filas: n });
    }
    if (!q.email && !q.dominio) return res.status(400).json({ ok: false, error: 'falta email o dominio' });
    const r = await S.consultar({ email: q.email, dominio: q.dominio });
    return res.status(200).json(Object.assign({ ok: true }, r));
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e && e.message || e).slice(0, 200) });
  }
};
