// Al Milímetro: rellena los {{HUECOS}} del aviso legal y la privacidad de la landing con los datos del titular.
// Uso: node scripts/al-milimetro/legal.js datos.json      (datos.json fuera del repositorio: lleva datos personales)
//      node scripts/al-milimetro/legal.js --comprobar     (sale con error si queda algún hueco; antes de publicar en real)
// datos.json: { "TITULAR", "NIF", "DIRECCION", "EMAIL", "COLEGIO", "COLEGIADO", "PROVEEDOR_WHATSAPP" }; FECHA se pone sola.
const fs = require('fs');
const path = require('path');

const DIR = process.env.AM_LEGAL_DIR || path.join(__dirname, '../../propuestas/al-milimetro/landing-v2');   // AM_LEGAL_DIR: para probar sobre una copia
const ARCHIVOS = [path.join(DIR, 'index.html'), path.join(DIR, 'privacidad/index.html')];
const CLAVES = ['TITULAR', 'NIF', 'DIRECCION', 'EMAIL', 'COLEGIO', 'COLEGIADO', 'PROVEEDOR_WHATSAPP', 'FECHA'];
const HUECO = /\{\{([A-Z_]+)\}\}/g;

function huecos() {
  const quedan = [];
  ARCHIVOS.forEach(function (f) {
    const s = fs.readFileSync(f, 'utf8');
    let m; while ((m = HUECO.exec(s))) quedan.push(path.relative(DIR, f) + ': {{' + m[1] + '}}');
  });
  return quedan;
}

if (process.argv[2] === '--comprobar') {
  const quedan = huecos();
  if (quedan.length) { console.error('Faltan datos legales:\n  ' + quedan.join('\n  ')); process.exit(1); }
  console.log('Aviso legal y privacidad completos.');
  process.exit(0);
}

const datos = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
datos.FECHA = datos.FECHA || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' });
const faltan = CLAVES.filter(function (k) { return !String(datos[k] || '').trim(); });
if (faltan.length) { console.error('Faltan en ' + process.argv[2] + ': ' + faltan.join(', ')); process.exit(1); }
const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
ARCHIVOS.forEach(function (f) {
  const s = fs.readFileSync(f, 'utf8').replace(HUECO, function (todo, k) { return k in datos ? esc(datos[k]) : todo; });
  fs.writeFileSync(f, s);
});
const quedan = huecos();
if (quedan.length) { console.error('Quedan huecos sin rellenar:\n  ' + quedan.join('\n  ')); process.exit(1); }
console.log('Rellenado: ' + ARCHIVOS.map(function (f) { return path.relative(DIR, f); }).join(', '));
