// Vigía del primer mensaje (22-oct-2026).
//
// Maikel, tras el lead de E-01 que estuvo tres horas sin nada: «no puede pasar
// que entre un lead y no le enviemos nada». El rescate ya mete en el CRM a todo
// lead de Meta; esto vigila el paso siguiente: un contacto en activación que,
// con el horario de WhatsApp abierto, lleva más de 15 minutos sin primer
// WhatsApp. Puede pasar si la pasarela llega a su tope diario, si el teléfono
// no vale o si algo falla en silencio. Avisa a Maikel una sola vez por contacto
// (etiqueta act-vigia-wa1), por correo y al móvil, para que escriba a mano.
//
// Solo lee y avisa: no envía nada al lead.

const A = require('./_activacion.js');

const MIN_SIN_MENSAJE = 15;
const VENTANA_MIN = 20;          // el horario tiene que llevar abierto al menos esto
const MAX_HORAS = 48;            // más antiguos no son «recién entrados»
const ETIQUETA = 'act-vigia-wa1';
const PARADAS = ['act-wa1', 'act-agendado', 'act-respondio', 'act-baja', 'act-fin', 'act-wa1-cancelado', ETIQUETA];

function minutosDesdeInicio(c) {
  const t = (c.tags || []).map(String).filter(function (x) { return /^act-ini-\d{12}$/.test(x); })[0];
  if (!t) return A.minutosDesde(c.dateAdded);
  const s = t.slice(8);
  return A.minutosDesde(s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) + 'T' + s.slice(8, 10) + ':' + s.slice(10, 12) + ':00Z');
}

// Contactos que deberían tener ya su primer WhatsApp y no lo tienen.
function pendientes(contactos, ahora) {
  const ms = ahora || Date.now();
  // Lo que entra de noche sale a la apertura; se da margen desde que abre.
  if (!A.enVentana('whatsapp', new Date(ms)) || !A.enVentana('whatsapp', new Date(ms - VENTANA_MIN * 60000))) return [];
  return (contactos || []).filter(function (c) {
    if (PARADAS.some(function (t) { return A.tiene(c, t); })) return false;
    const m = minutosDesdeInicio(c);
    return m >= MIN_SIN_MENSAJE && m <= MAX_HORAS * 60;
  });
}

async function vuelta(contactos) {
  const lista = pendientes(contactos);
  const avisados = [];
  for (const c of lista) {
    const nombre = c.firstName || c.contactName || c.name || '(sin nombre)';
    const motivo = !c.phone ? 'no tiene teléfono' : 'el WhatsApp no ha salido';
    const enlace = 'https://app.gohighlevel.com/v2/location/' + process.env.GHL_LOCATION_ID + '/contacts/detail/' + c.id;
    const texto = '⚠️ Lead sin primer mensaje: ' + nombre + (c.companyName ? ' (' + c.companyName + ')' : '') +
      ' entró hace ' + minutosDesdeInicio(c) + ' min y ' + motivo + '. Escríbele a mano. ' + enlace;
    // Primero la etiqueta: si el aviso falla, mejor uno de menos que uno cada 10 minutos.
    try { await A.etiquetar(c.id, [ETIQUETA]); } catch (e) { continue; }
    try { await A.nota(c.id, 'Vigía: ' + motivo + ' ' + minutosDesdeInicio(c) + ' min después de entrar, con el horario de WhatsApp abierto. Avisado Maikel.'); } catch (e) { /* sigue */ }
    try {
      await A.enviarCorreo(process.env.INFORME_PAID_TO || 'maikel@qualivo.io', 'Lead sin primer mensaje: ' + nombre,
        '<p style="font:16px/1.5 system-ui">' + texto.replace(/[<>]/g, '') + '</p>');
    } catch (e) { console.error('[vigia] correo:', e && e.message); }
    try { await require('./_aviso.js').movil(texto); } catch (e) { console.error('[vigia] móvil:', e && e.message); }
    avisados.push(c.id);
  }
  return { pendientes: lista.length, avisados: avisados.length };
}

module.exports = { vuelta: vuelta, pendientes: pendientes };
