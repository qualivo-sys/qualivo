// Prepara la subcuenta de GHL de Al Milímetro: crea los campos personalizados que faltan
// (con las opciones EXACTAS de api/_am-modelo.js) y comprueba el pipeline y sus etapas.
// Uso: AM_GHL_API_KEY=… AM_GHL_LOCATION_ID=… node scripts/al-milimetro/ghl-preparar.js [--aplicar]
// Sin --aplicar solo enseña lo que haría. No borra ni cambia nada que ya exista.
const M = require('../../api/_am-modelo.js');
const GHL = 'https://services.leadconnectorhq.com';
const key = process.env.AM_GHL_API_KEY, loc = process.env.AM_GHL_LOCATION_ID, aplicar = process.argv.includes('--aplicar');
if (!key || !loc) { console.error('Faltan AM_GHL_API_KEY y AM_GHL_LOCATION_ID'); process.exit(1); }
const cab = { Authorization: 'Bearer ' + key, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' };
async function ghl(m, ruta, cuerpo) {
  const r = await fetch(GHL + ruta, { method: m, headers: cab, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const t = await r.text(); if (!r.ok) throw new Error(m + ' ' + ruta + ' → ' + r.status + ' ' + t.slice(0, 300)); return t ? JSON.parse(t) : {};
}
const ops = function (o) { return Object.values(o); };
const CAMPOS = [
  ['am_tipo_obra', 'AM · Tipo de obra', 'SINGLE_OPTIONS', ops(M.OPCIONES.tipo)],
  ['am_tipo_texto', 'AM · Obra (texto para mensajes)', 'TEXT'],
  ['am_codigo_postal', 'AM · Código postal', 'TEXT'],
  ['am_zona', 'AM · Municipio o barrio', 'TEXT'],
  ['am_metros', 'AM · Metros', 'SINGLE_OPTIONS', ops(M.OPCIONES.m2)],
  ['am_cuando', 'AM · Cuándo quiere empezar', 'SINGLE_OPTIONS', ops(M.OPCIONES.cuando)],
  ['am_presupuesto', 'AM · Presupuesto orientativo', 'SINGLE_OPTIONS', ops(M.OPCIONES.ppto)],
  ['am_vivienda_propia', 'AM · Vivienda propia', 'SINGLE_OPTIONS', ops(M.OPCIONES.propia)],
  ['am_clase', 'AM · Clase', 'SINGLE_OPTIONS', ops(M.OPCIONES.clase)],
  ['am_puntos', 'AM · Puntos', 'NUMERICAL'],
  ['am_origen', 'AM · Origen (anuncio)', 'SINGLE_OPTIONS', ops(M.OPCIONES.origen)],
  ['am_revision', 'AM · Segundas preguntas', 'SINGLE_OPTIONS', ['Sí', 'No']],
  ['am_desde', 'AM · Precio «desde» mostrado', 'TEXT'],
  ['am_instalaciones', 'AM · Instalaciones', 'SINGLE_OPTIONS', ops(M.OPCIONES.inst)],
  ['am_que_cambiar', 'AM · Qué quiere cambiar', 'LARGE_TEXT']
];
const ETAPAS = ['Nuevo', 'Contactado', 'Visita técnica', 'Presupuesto enviado', 'Seguimiento', 'Firmado', 'Perdido'];
(async function () {
  const d = await ghl('GET', '/locations/' + loc + '/customFields?model=contact');
  const hay = {}; (d.customFields || []).forEach(function (f) { hay[String(f.fieldKey).replace(/^contact\./, '')] = f; });
  for (const [k, nombre, tipo, opciones] of CAMPOS) {
    const f = hay[k];
    if (f) {
      const lee = (f.picklistOptions || []).map(String);   // en LECTURA se llama picklistOptions
      const mal = (opciones || []).filter(function (o) { return lee.indexOf(o) < 0; });
      console.log((mal.length ? '⚠ ' : '✓ ') + k + (mal.length ? ' · faltan opciones: ' + mal.join(' | ') : ''));
      continue;
    }
    console.log((aplicar ? '+ creo ' : '· crearía ') + k + ' (' + tipo + ')');
    // En ESCRITURA se llama options; GHL genera la clave a partir del nombre, así que se comprueba después
    if (aplicar) await ghl('POST', '/locations/' + loc + '/customFields', Object.assign({ name: nombre, dataType: tipo, model: 'contact' }, opciones ? { options: opciones } : {}));
  }
  if (aplicar) {
    const d2 = await ghl('GET', '/locations/' + loc + '/customFields?model=contact');
    const claves = (d2.customFields || []).map(function (f) { return String(f.fieldKey).replace(/^contact\./, ''); });
    const sin = CAMPOS.map(function (c) { return c[0]; }).filter(function (k) { return claves.indexOf(k) < 0; });
    if (sin.length) console.log('⚠ GHL ha puesto otra clave a: ' + sin.join(', ') + '. Renombra la clave en GHL a la de esta lista.');
  }
  const p = await ghl('GET', '/opportunities/pipelines?locationId=' + loc);
  const am = (p.pipelines || []).filter(function (x) { return /al mil[ií]metro/i.test(x.name); });
  if (am.length !== 1) { console.log('⚠ Pipeline «Al Milímetro»: hay ' + am.length + '. Créalo a mano en GHL con las etapas: ' + ETAPAS.join(' → ')); return; }
  const tiene = (am[0].stages || []).map(function (s) { return s.name.trim(); });
  const faltan = ETAPAS.filter(function (e) { return tiene.indexOf(e) < 0; });
  console.log((faltan.length ? '⚠ Faltan etapas: ' + faltan.join(', ') : '✓ Pipeline con sus 7 etapas') + ' · id ' + am[0].id);
})().catch(function (e) { console.error(e.message); process.exit(1); });
