// Aviso de visita humana a una página de cuenta (/para/<empresa>/).
// La página manda aquí, al salir o al tocar la demo, lo que hizo la persona.
// Regla de la adenda (punto 5): un clic o una carga no es intención. Solo se
// avisa a Maikel cuando hay comportamiento humano: demo abierta, o al menos
// 20 segundos con scroll, o al menos 60 segundos. Según la V2 (punto 13), es
// una señal, no una orden de llamar: candidata a revisión si el encaje es alto. Los escáneres de seguridad
// cargan el enlace y se van: no llegan aquí o no pasan el umbral.
const AVISO = require('./_aviso.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://qualivo.io');
  if (req.method !== 'POST') return res.status(405).end();
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const cuenta = String(b.cuenta || '').replace(/[^a-z0-9-]/g, '').slice(0, 60);
  const segundos = Math.max(0, Math.min(3600, parseInt(b.segundos, 10) || 0));
  const scroll = Math.max(0, Math.min(100, parseInt(b.scroll, 10) || 0));
  const demo = !!b.demo;
  if (!cuenta) return res.status(400).json({ ok: false });
  const fuerte = demo || (segundos >= 20 && scroll >= 40) || segundos >= 60;
  if (!fuerte) return res.status(200).json({ ok: true, aviso: false });
  const texto = 'PÁGINA DE CUENTA · ' + cuenta + '\n' +
    (demo ? 'Ha abierto la demo. ' : '') + segundos + ' s en la página, scroll ' + scroll + ' %.\n' +
    'Señal de comportamiento humano (no un clic). Si la cuenta encaja, es candidata a llamada o revisión; no se llama en automático. qualivo.io/para/' + cuenta + '/';
  const r = await AVISO.movil(texto, { forzar: true });
  return res.status(200).json({ ok: true, aviso: r === true });
};
