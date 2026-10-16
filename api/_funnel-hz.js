// Formulario horizontal «ya inviertes» (15-oct-2026, Qualivo_HZ_demo 1593733452501786):
// cinco preguntas, sin precio. Diseño: paid/revisiones/2026-10-15-montaje-hz-demo-en-pausado.md
// (rama de Paid). Claves: inversion, atiende, sector, volumen, momento.
//
// MODO SOMBRA, igual que el funnel v2: solo etiquetas y nota. No cambia mensajes,
// cadencia ni llamadas. El «C sin agenda, recurso y nurturing» de Paid queda
// anotado en la etiqueta y lo decide Maikel antes de tocar la cadencia.
//
// Regla de encaje de Paid:
//   B     = inversión ≥ 1.000 € y atiende alguien más que él (1-2 personas o equipo)
//   medio = inversión 500-1.000 €, o ≥ 1.000 € atendido por él solo
//   C     = todavía no invierte o menos de 500 €
// Apagado de urgencia: FUNNEL_HZ=0.

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function campo(campos, clave) {
  for (const c of campos || []) {
    if (norm(c.name) === clave) return String(((c.values || [])[0]) || '').trim();
  }
  return '';
}

// Meta devuelve la clave de la opción (todavia_no, 1000_3000…); se acepta también el texto.
function inversion(v) {
  const s = norm(v);
  if (!s) return '';
  if (/todavia|^nada/.test(s)) return 'nada';
  if (/menos_(de_)?500/.test(s)) return 'menos-500';
  if (/^(entre_)?500_(y_)?1_?000/.test(s)) return '500-1000';
  if (/^(entre_)?1_?000_(y_)?3_?000/.test(s)) return '1000-3000';
  if (/mas_(de_)?3_?000/.test(s)) return 'mas-3000';
  return '';
}

function atiende(v) {
  const s = norm(v);
  if (!s) return '';
  if (/^yo/.test(s)) return 'yo';
  if (/^1_2|una_o_dos/.test(s)) return '1-2';
  if (/equipo/.test(s)) return 'equipo';
  return '';
}

const SECTORES = {
  formacion: { sector: 'Formación o academia', etiqueta: 'sector-formacion' },
  clinica: { sector: 'Salud, clínica o bienestar', etiqueta: 'sector-clinicas' },
  reformas: { sector: 'Reformas, construcción o instalaciones', etiqueta: 'sector-reformas' },
  inmobiliaria: { sector: 'Inmobiliaria', etiqueta: 'sector-inmobiliaria' },
  otro: { sector: '', etiqueta: 'sector-otro' }
};
function sector(v) {
  const s = norm(v);
  if (!s) return null;
  if (/formacion|academia/.test(s)) return SECTORES.formacion;
  if (/clinica|salud/.test(s)) return SECTORES.clinica;
  if (/reforma|instalacion/.test(s)) return SECTORES.reformas;
  if (/inmobiliaria/.test(s)) return SECTORES.inmobiliaria;
  if (/otro/.test(s)) return SECTORES.otro;
  return null;
}

// Mismos tramos que leen la puntuación y el agente (vol-*).
function volumen(v) {
  const s = norm(v);
  if (!s) return '';
  if (/menos_(de_)?20/.test(s)) return '5-15';
  if (/^(entre_)?20_(y_)?50/.test(s)) return '20-50';
  if (/^(entre_)?50_(y_)?100/.test(s)) return '50-100';
  if (/mas_(de_)?100/.test(s)) return 'mas-de-100';
  return '';
}

function momento(v) {
  const s = norm(v);
  if (!s) return '';
  if (/adelante|mirando/.test(s)) return 'mirando';
  if (/1_(a_)?3/.test(s)) return '1-3-meses';
  if (/este_mes/.test(s)) return 'este-mes';
  return '';
}

function encaje(inv, quien) {
  if (!inv) return '';
  if (inv === 'nada' || inv === 'menos-500') return 'c';
  if (inv === '500-1000') return 'medio';
  if (!quien) return '';
  return quien === 'yo' ? 'medio' : 'b';
}

// Texto que entienden la puntuación (inv-*) y la nota del CRM.
const TEXTO_INV = {
  nada: 'Nada todavía', 'menos-500': 'Menos de 500 €', '500-1000': 'Entre 500 y 1.000 €',
  '1000-3000': 'Entre 1.000 y 3.000 €', 'mas-3000': 'Más de 3.000 €'
};
const TEXTO_ATIENDE = { yo: 'él mismo', '1-2': 'una o dos personas', equipo: 'un equipo comercial' };

function esHZ(campos) {
  if (process.env.FUNNEL_HZ === '0') return false;
  const nombres = (campos || []).map(function (c) { return norm(c.name); });
  return nombres.indexOf('inversion') !== -1 && nombres.indexOf('atiende') !== -1;
}

// Devuelve null si no es el formulario horizontal.
function desdeCampos(campos) {
  if (!esHZ(campos)) return null;
  const inv = inversion(campo(campos, 'inversion'));
  const quien = atiende(campo(campos, 'atiende'));
  const sec = sector(campo(campos, 'sector'));
  const vol = volumen(campo(campos, 'volumen'));
  const mom = momento(campo(campos, 'momento'));
  const fit = encaje(inv, quien);

  const etiquetas = ['funnel-hz'];
  if (inv) etiquetas.push('inv2-' + inv);
  if (quien) etiquetas.push('atiende-' + quien);
  if (sec) etiquetas.push(sec.etiqueta);
  if (vol) etiquetas.push('vol-' + vol);
  if (mom) etiquetas.push('momento-' + mom);
  if (fit) etiquetas.push('fit-hz-' + fit);

  const nota = ['Formulario horizontal «ya inviertes» (modo sombra: solo etiquetas, la cadencia no cambia)', '',
    inv ? 'Inversión mensual en anuncios: ' + TEXTO_INV[inv] : '',
    quien ? 'Quién atiende a los interesados: ' + TEXTO_ATIENDE[quien] : '',
    sec && sec.sector ? 'Sector: ' + sec.sector : (sec ? 'Sector: otro' : ''),
    vol ? 'Interesados al mes: ' + vol.replace(/-/g, ' ') : '',
    mom ? 'Cuándo lo quiere: ' + mom.replace(/-/g, ' ') : '',
    fit ? 'Encaje (regla de Paid): ' + fit.toUpperCase() : 'Encaje: sin datos suficientes'].filter(Boolean).join('\n');

  return {
    etiquetas: etiquetas, nota: nota, encaje: fit,
    inversionTexto: inv ? TEXTO_INV[inv] : '',
    sector: sec ? sec.sector : '',
    volumen: vol, cuando: mom
  };
}

module.exports = { desdeCampos: desdeCampos, esHZ: esHZ, encaje: encaje, inversion: inversion, atiende: atiende };
