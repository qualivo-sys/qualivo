// Al Milímetro: descartes y puntuación A/B/C del formulario «Calcula tu reforma».
// Lo usan api/al-milimetro-lead.js (autoridad) y las pruebas (scripts/al-milimetro/probar-modelo.js).
// Reglas acordadas el 23-oct y el 29-oct. [C] = dicho por Sonia · [E] = estimación nuestra, a confirmar.

// Las etiquetas de cada respuesta son EXACTAMENTE las opciones de los campos de GHL.
// Si se cambia un texto aquí, hay que cambiar la opción en GHL (ver scripts/al-milimetro/ghl-preparar.js).
const OPCIONES = {
  tipo: { chalet: 'Chalet o casa entera', piso: 'Piso entero', cb: 'Cocina y baño', '2b': 'Dos baños', suelto: 'Solo un baño o la cocina', local: 'Local u oficina', arreglo: 'Arreglos sueltos' },
  m2: { '<50': 'Menos de 50 m²', '50-80': '50-80 m²', '80-120': '80-120 m²', '120-200': '120-200 m²', '>200': 'Más de 200 m²' },
  cuando: { '3': 'Menos de 3 meses', '6': 'Entre 3 y 6 meses', mas: 'Más adelante', mirando: 'Solo mirando precios' },
  ppto: { '<15': 'Menos de 15.000 €', '15-30': '15.000-30.000 €', '30-60': '30.000-60.000 €', '60-160': '60.000-160.000 €', '>160': 'Más de 160.000 €', nose: 'Todavía no lo sé' },
  propia: { si: 'Sí', comprando: 'La está comprando', no: 'No' },
  inst: { inst: 'Fontanería o electricidad', acab: 'Solo acabados', nose: 'No lo sabe' },
  origen: { pared: 'A · Detrás de la pared', chalet: 'B · Chalet', precio: 'C · Cuánto cuesta', portal: 'D · Sin portales', web: 'Web u orgánico' },
  clase: { A: 'A', B: 'B', C: 'C' }
};

// Sur excluido (M-30 a M-40 y municipios del sur) [E]
const SUR = /^(2803[18]|28041|28051|28053|28021|2890\d|2891\d|2893\d|2897\d)$/;
// Sus 14 zonas prioritarias por código postal [E, a confirmar con Sonia]
const PRIO = /^(28660|28670|2822[0-2]|28250|28023|28008|28040|28042|28050|2803[45]|2804[3]|28033|2800[1-3]|2800[6-7]|28009|28010|28014|28015|28028)$/;
const PRIO_TXT = /boadilla|villaviciosa|majadahonda|torrelodones|aravaca|moncloa|alameda de osuna|las tablas|mirasierra|hortaleza|pe[ñn]a grande|chamber[ií]|prosperidad|salamanca|retiro/i;

// Precio «desde» que ve la persona [C, cifras de Sonia; pendiente de que valide el Excel]
const DESDE = { chalet: '160.000 €', piso: '35.000 €', cb: '15.000 €', '2b': '15.000 €' };
// Cómo se nombra la obra en el WhatsApp: «He recibido tu petición para reformar {{2}}»
const TIPO_TEXTO = { chalet: 'tu chalet', piso: 'tu piso', cb: 'la cocina y el baño', '2b': 'los baños' };

const UMBRAL_A = 70, UMBRAL_B = 45;

// Devuelve el motivo si no encaja (no se guarda), o null.
function descarte(r) {
  if (r.tipo === 'local' || r.tipo === 'arreglo') return 'tipo';
  if (r.tipo === 'suelto') return 'suelto';            // decidido 29-oct: ni dentro de la M-30
  if (SUR.test(String(r.cp || ''))) return 'zona';
  if (r.inst === 'acab') return 'acab';                // segundas preguntas: solo acabados
  return null;
}

function necesitaRevision(r) {
  return r.ppto === '<15' || (r.ppto === 'nose' && r.m2 === '<50');
}

function zonaPrioritaria(r) {
  return PRIO.test(String(r.cp || '')) || PRIO_TXT.test(String(r.mun || ''));
}

function puntuar(r) {
  const motivos = [];
  let p = 0;
  const suma = function (n, txt) { p += n; motivos.push((n > 0 ? '+' : '') + n + ' ' + txt); };
  if (zonaPrioritaria(r)) suma(20, 'zona prioritaria');
  if (r.tipo === 'chalet') suma(25, 'chalet o casa entera');
  else if (r.tipo === 'piso') suma(20, 'piso entero');
  else if (r.tipo === 'cb' || r.tipo === '2b') suma(10, 'cocina y baño o dos baños');
  if (r.ppto === '30-60' || r.ppto === '60-160' || r.ppto === '>160') suma(15, 'presupuesto de 30.000 € o más');
  else if (r.ppto === '15-30') suma(5, 'presupuesto de 15.000 a 30.000 €');
  if (r.cuando === '3') suma(20, 'empieza en menos de 3 meses');
  else if (r.cuando === '6') suma(10, 'empieza en 3-6 meses');
  if (r.propia === 'si' || r.propia === 'comprando') suma(10, 'la vivienda es suya o la está comprando');
  const clase = p >= UMBRAL_A ? 'A' : p >= UMBRAL_B ? 'B' : 'C';
  return { puntos: p, clase: clase, motivos: motivos };
}

// Techo de la escala: si no se puede llegar a A, nadie será A (playbook de cualificación, defecto «a»)
const MAXIMO = 20 + 25 + 15 + 20 + 10;
if (MAXIMO < UMBRAL_A) throw new Error('La puntuación máxima (' + MAXIMO + ') no llega a la clase A (' + UMBRAL_A + ')');

module.exports = { OPCIONES, DESDE, TIPO_TEXTO, UMBRAL_A, UMBRAL_B, MAXIMO, descarte, necesitaRevision, zonaPrioritaria, puntuar };
