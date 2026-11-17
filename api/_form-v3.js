// Formulario Formación V3 (17-nov-2026, Maikel): 4 preguntas (web, solicitudes al mes,
// inversión en publicidad y qué mejorar) + nombre, email de trabajo y teléfono.
// Prioridad operativa A / B / C según autenticidad, volumen, capacidad y necesidad.
// No es una suma de puntos: se mira la coherencia. Reglas de Maikel:
//   - no se descarta a quien no invierte (caso Cancomar: dijo 0 € y llegó a negociación);
//   - el email gratuito es una señal, no un motivo de descarte (32 % frente a 9 % en 77 leads);
//   - lo incoherente o no verificable pasa a revisión (C), nunca a puntuación alta;
//   - C no se descarta solo: hace falta que una persona confirme que es falso o que no encaja.
// Solo añade etiquetas v3-* y un resumen. No cambia la activación ni el nivel A-D del scoring.

const dns = require('dns').promises;

const GRATUITOS = /@(gmail|googlemail|hotmail|outlook|live|msn|yahoo|ymail|icloud|me|mac|aol|gmx|protonmail|proton|telefonica|movistar|terra|orange|vodafone)\./i;
const REDES = /(instagram|facebook|fb|tiktok|linkedin|youtube|wa\.me|whatsapp|linktr\.ee|google\.com\/maps|goo\.gl)/i;

const MEJORA = {
  calidad: { tag: 'mejora-calidad', texto: 'Conseguir solicitudes de mayor calidad', fuga: 'anuncios' },
  conversion: { tag: 'mejora-conversion', texto: 'Convertir más solicitudes en matrículas', fuga: 'seguimiento' },
  seguimiento: { tag: 'mejora-seguimiento', texto: 'Mejorar la atención y el seguimiento', fuga: 'seguimiento' },
  medicion: { tag: 'mejora-medicion', texto: 'Saber qué campañas generan matrículas', fuga: 'anuncios' }
};

function dominioWeb(web) {
  const s = String(web || '').trim().toLowerCase();
  if (!s || REDES.test(s)) return '';
  const m = s.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[\/\s?#]/)[0];
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(m) ? m : '';
}

async function resuelve(dominio, ms) {
  if (!dominio) return false;
  const t = new Promise(function (ok) { setTimeout(function () { ok(null); }, ms || 1500); });
  const r = await Promise.race([
    dns.resolve(dominio).then(function () { return true; }).catch(function () { return false; }),
    t
  ]);
  return r === null ? null : r; // null = no se pudo comprobar a tiempo
}

// v: { web, volumen, inversion, mejora, email }  (claves de Meta tal cual)
async function clasificar(v, opts) {
  const etiquetas = [];
  const motivos = [];
  const web = String(v.web || '').trim();
  const email = String(v.email || '').trim().toLowerCase();
  const dom = dominioWeb(web);
  const domEmail = (email.split('@')[1] || '');
  const gratuito = !!email && GRATUITOS.test(email);
  const coincide = !!dom && !!domEmail && (domEmail === dom || domEmail.endsWith('.' + dom) || dom.endsWith('.' + domEmail));
  const vive = dom ? await ((opts && opts.resolver) || resuelve)(dom) : false;

  // Autenticidad
  let autentico = 'no';
  if (dom && vive === true) { autentico = 'si'; etiquetas.push('v3-web-ok'); }
  else if (dom && vive === null && coincide) { autentico = 'si'; etiquetas.push('v3-web-sin-comprobar'); }
  else if (dom && vive === null) { autentico = 'dudoso'; etiquetas.push('v3-web-sin-comprobar'); motivos.push('no se pudo comprobar la web a tiempo'); }
  else if (web && REDES.test(web)) { autentico = 'dudoso'; etiquetas.push('v3-web-redes'); motivos.push('da una red social en lugar de web'); }
  else if (dom) { etiquetas.push('v3-web-no-existe'); motivos.push('la web no existe'); }
  else { etiquetas.push('v3-web-invalida'); motivos.push('no da una web válida'); }
  etiquetas.push(gratuito ? 'email-gratuito' : (email ? 'email-corporativo' : 'email-sin'));
  if (coincide) etiquetas.push('v3-email-coincide-web');

  // Volumen y capacidad (sin descartar a quien no invierte)
  const volAlto = v.volumen === '50_99' || v.volumen === '100mas';
  const volMedio = v.volumen === '20_49';
  const capacidad = v.inversion === '1000_2999' || v.inversion === '3000mas';
  if (v.inversion === 'no_invertimos' && (volAlto || volMedio)) { etiquetas.push('v3-sin-inversion-con-volumen'); motivos.push('no invierte pero tiene volumen (posible caso Cancomar)'); }

  // Incoherencias: respuestas máximas sin nada que las respalde.
  const todoMax = v.volumen === '100mas' && v.inversion === '3000mas';
  const incoherente = todoMax && autentico !== 'si' && gratuito;
  if (incoherente) { etiquetas.push('v3-incoherente'); motivos.push('respuestas máximas con email gratuito y sin web verificable'); }

  const m = MEJORA[v.mejora];
  if (m) etiquetas.push(m.tag);

  let prioridad;
  if (autentico === 'no' || incoherente) prioridad = 'C';
  else if (autentico === 'si' && (volAlto || capacidad) && (!gratuito || coincide)) prioridad = 'A';
  else prioridad = 'B';
  if (prioridad === 'A') motivos.unshift('centro real con volumen o capacidad');
  if (prioridad === 'B') motivos.unshift('por validar: ' + (autentico !== 'si' ? 'autenticidad' : gratuito ? 'email gratuito' : 'volumen o capacidad'));
  if (prioridad === 'C') motivos.unshift('a revisión');
  etiquetas.push('v3-prio-' + prioridad.toLowerCase());
  if (prioridad === 'C') etiquetas.push('v3-revision');
  return { prioridad: prioridad, etiquetas: etiquetas, motivos: motivos, mejora: m || null };
}

module.exports = { clasificar: clasificar, dominioWeb: dominioWeb, MEJORA: MEJORA, FORM_ID: '1183570324226136', FORMS: ['1183570324226136', '1024313877362865'] };
