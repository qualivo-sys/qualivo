// Entrada del cron del recordatorio de una hora antes (cada 10 minutos).
// Delega en api/recordatorios.js con modo=hora; existe para que el cron de
// vercel.json no lleve cadena de consulta. Revenue Journey V3, 19-oct-2026.
const base = require('./recordatorios.js');
module.exports = function handler(req, res) {
  req.query = Object.assign({}, req.query || {}, { modo: 'hora' });
  return base(req, res);
};
