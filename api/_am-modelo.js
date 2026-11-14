// Al Milímetro: descartes y puntuación A/B/C del formulario «Calcula tu reforma».
// Lo usan api/al-milimetro-lead.js (autoridad) y las pruebas (scripts/al-milimetro/probar-modelo.js).
// Reglas acordadas el 23-oct y el 29-oct, y respuestas de Sonia del 2-nov. [C] = dicho por Sonia · [E] = estimación nuestra, a confirmar.

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

// Zonas en las que NO trabaja. [C, 2-nov]: Latina, Carabanchel, Usera y Puente de Vallecas enteros
// (28011 va aparte: también es la Colonia del Manzanares, que sí). [E]: el resto del sur (Villaverde,
// Villa de Vallecas, Vallecas y los municipios del sur), que ya estaba fuera.
const SUR = /^(28024|28044|28047|28019|28025|28054|28026|28041|28018|28038|28053|28031|28051|28021|2890\d|2891\d|2893\d|2897\d)$/;
// Códigos postales que mezclan barrios en los que trabaja y en los que no: no se descartan, van a revisión.
// 28011: Puerta del Ángel (no) y Colonia del Manzanares (sí). 28043 y 28037: en Ciudad Lineal no quiere
// San Pascual, San Juan Bautista, Colina, Atalaya ni Costillares, pero 28043 también es Hortaleza. [C, 2-nov]
const ZONA_DUDOSA = /^(28011|28043|28037)$/;
// Zonas prioritarias. [C, 2-nov]: los 7 distritos dentro de la M-30 (Centro, Arganzuela, Retiro, Salamanca,
// Chamartín, Tetuán y Chamberí) y las zonas de chalets (Pozuelo, Majadahonda, La Moraleja, Las Rozas, Boadilla,
// Villaviciosa; en Madrid: Puerta de Hierro, Peñagrande, Fuentelarreina, Mirasierra, El Viso, Aravaca,
// Valdemarín, Conde Orgaz y La Florida-El Plantío). [E]: sus zonas de pisos del 23-oct (Prosperidad,
// Alameda de Osuna, Las Tablas). Los códigos postales los ponemos nosotros [E].
const PRIO = /^(2800[1-9]|2801[0-6]|28020|28028|28029|28036|28039|28045|28046|28023|28034|28035|28040|28042|28050|2822[0-4]|2823[0-2]|28109|2866[0-9]|28670)$/;
const PRIO_TXT = /boadilla|villaviciosa|majadahonda|pozuelo|las rozas|moraleja|aravaca|valdemar[ií]n|plant[ií]o|puerta de hierro|pe[ñn]a ?grande|fuentelarreina|mirasierra|el viso|conde (de )?orgaz|alameda de osuna|las tablas|chamber[ií]|prosperidad|salamanca|retiro|chamart[ií]n|tetu[aá]n|arganzuela|centro/i;

// Precio «desde» que ve la persona [C, Sonia el 2-nov]
const DESDE = { chalet: '80.000 €', piso: '25.000 €', cb: '10.000 €' };
// Cómo se nombra la obra en el WhatsApp: «He recibido tu petición para reformar {{2}}»
const TIPO_TEXTO = { chalet: 'tu chalet', piso: 'tu piso', cb: 'la cocina y el baño' };

const UMBRAL_A = 70, UMBRAL_B = 45;

// Devuelve el motivo si no encaja (no se guarda), o null.
function descarte(r) {
  if (r.tipo === 'local' || r.tipo === 'arreglo') return 'tipo';
  if (r.tipo === 'suelto' || r.tipo === '2b') return 'suelto';  // ni dentro de la M-30 (29-oct); ni dos baños (2-nov)
  if (SUR.test(String(r.cp || ''))) return 'zona';
  if (r.inst === 'acab') return 'acab';                // segundas preguntas: solo acabados
  return null;
}

function necesitaRevision(r) {
  return r.ppto === '<15' || (r.ppto === 'nose' && r.m2 === '<50') || zonaDudosa(r);
}

function zonaDudosa(r) {
  return ZONA_DUDOSA.test(String(r.cp || ''));
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
  else if (r.tipo === 'cb') suma(10, 'cocina y baño');
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

// Ficha legible de un lead guardado (para correos, avisos e Intelligence)
function vista(r) {
  return Object.assign({}, r, {
    tipoTexto: TIPO_TEXTO[r.tipo] || 'tu casa', tipoLargo: OPCIONES.tipo[r.tipo] || 'Reforma',
    m2Txt: OPCIONES.m2[r.m2] || '', cuandoTxt: OPCIONES.cuando[r.cuando] || '', pptoTxt: OPCIONES.ppto[r.ppto] || '',
    propiaTxt: OPCIONES.propia[r.propia] || '', origenTxt: OPCIONES.origen[r.origen] || OPCIONES.origen.web
  });
}

module.exports = { vista, OPCIONES, DESDE, TIPO_TEXTO, UMBRAL_A, UMBRAL_B, MAXIMO, descarte, necesitaRevision, zonaDudosa, zonaPrioritaria, puntuar };
