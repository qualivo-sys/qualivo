// Entrada del cron de la víspera (18:30 de Madrid). Delega en
// api/recordatorios.js con modo=vispera; existe para que el cron de
// vercel.json no lleve cadena de consulta.
const base = require('./recordatorios.js');
module.exports = function handler(req, res) {
  req.query = Object.assign({}, req.query || {}, { modo: 'vispera' });
  return base(req, res);
};
