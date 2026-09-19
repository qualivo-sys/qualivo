// Aviso interno: cuando entra un lead, Maikel se entera en el momento.
//
// Por que existe esto y no un workflow de GHL: GHL avisa por correo cuando se
// rellena un formulario NATIVO suyo, y esta landing no usa ninguno. Los leads
// entran por API desde aqui, asi que esa notificacion no se dispara nunca. Los
// dos workflows "Aviso cita Qualivo" que hay en la cuenta estan en borrador y
// no se han publicado. Resultado comprobado el 17-sep-2026: ni el lead de Meta
// del dia 16 ni el del formulario del dia 17 generaron un solo correo, y de los
// dos nos enteramos a mano, leyendo notas de contactos por otro motivo. Uno de
// ellos habia escrito "En el seguimiento de los LEADS" y estuvo horas sin que
// nadie lo supiera.
//
// El correo esta escrito para leerse en el movil de pie: lo primero es el
// telefono, porque lo unico que hay que hacer con esto es llamar. El resto es
// contexto para los diez segundos antes de marcar.
//
// Nunca tumba la peticion: si Resend falla, se anota en el registro y el lead
// sigue su camino. Un aviso que no sale no puede costar un lead.

const F = '-apple-system,Segoe UI,Roboto,sans-serif';

// Aviso al móvil de Maikel por WhatsApp (pasarela Wazzap, que en GHL es «SMS»)
// para los dos momentos que no pueden esperar al correo: lead cualificado
// nuevo y lead que contesta. Va a su contacto de prueba del CRM (su 663).
// Se apaga con AVISO_MOVIL=0. Nunca bloquea.
const MOVIL_CONTACTO = process.env.AVISO_MOVIL_CONTACTO || 'DgkPLaw6fzy4z1bs8HsB';
async function movil(texto) {
  if (process.env.AVISO_MOVIL === '0' || !MOVIL_CONTACTO) return false;
  try {
    await require('./_activacion.js').enviarPorGateway(MOVIL_CONTACTO, String(texto).slice(0, 900));
    return true;
  } catch (e) { console.error('[aviso] móvil:', e && e.message); return false; }
}

function escapa(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fila(etiqueta, valor) {
  if (!valor) return '';
  return '<tr><td style="padding:6px 14px 6px 0;color:#7A7C82;white-space:nowrap">' +
    escapa(etiqueta) + '</td><td style="padding:6px 0"><b>' + escapa(valor) + '</b></td></tr>';
}

// El telefono en formato tel: para que se marque de un toque desde el correo.
function paraMarcar(tel) {
  const limpio = String(tel || '').replace(/[^\d+]/g, '');
  if (!limpio) return '';
  return limpio.startsWith('+') ? limpio : (limpio.length === 9 ? '+34' + limpio : limpio);
}

/**
 * Manda el aviso. Devuelve {ok, motivo} y NO lanza nunca.
 *
 * @param {object} d  nombre, empresa, web, email, telefono, sector, equipo,
 *                    inversion, fuga (donde dice el que se pierde), origen,
 *                    cualificado, contactId, utm
 */
async function leadNuevo(d) {
  d = d || {};
  if (d.cualificado !== false) {
    await movil('LEAD NUEVO · ' + (d.nombre || d.empresa || d.email || '?') + (d.empresa ? ' · ' + d.empresa : '') +
      (d.fuga ? '\n«' + String(d.fuga).slice(0, 160) + '»' : '') +
      (d.telefono ? '\nTel ' + d.telefono : '') + (d.origen ? '\n' + d.origen : '') +
      '\nRaquel le llama en unos minutos.');
  }
  const destino = process.env.AVISO_INTERNO_TO || process.env.INFORME_PAID_TO || 'maikel@qualivo.io';
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'sin_resend' };

  const quien = d.nombre || d.empresa || d.web || d.email || 'Alguien';
  const tel = paraMarcar(d.telefono);
  // El asunto es lo unico que se ve en la notificacion del movil, asi que lleva
  // el nombre y la fuga. "Nuevo lead" no dice nada y no hace levantar a nadie.
  const asunto = (d.cualificado === false ? '[fuera de alcance] ' : '') +
    quien + (d.empresa ? ' · ' + d.empresa : '') +
    (d.fuga ? ' · ' + String(d.fuga).slice(0, 70) : ' · pide diagnóstico');

  const html =
    '<div style="font-family:' + F + ';font-size:16px;line-height:1.55;color:#101319;max-width:560px">' +
    '<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#7A7C82;margin:0 0 6px">' +
    escapa(d.origen || 'landing') + (d.cualificado === false ? ' · fuera de alcance' : ' · cualificado') + '</p>' +
    '<h2 style="margin:0 0 4px;font-size:24px;letter-spacing:-.02em">' + escapa(quien) + '</h2>' +
    (d.empresa || d.web
      ? '<p style="margin:0 0 18px;color:#7A7C82">' + escapa(d.empresa || d.web) + '</p>' : '') +
    (tel
      ? '<p style="margin:0 0 20px"><a href="tel:' + escapa(tel) + '" style="display:inline-block;' +
        'background:#0E7C74;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;' +
        'font-size:17px;font-weight:600">Llamar al ' + escapa(d.telefono) + '</a></p>'
      : '<p style="margin:0 0 20px;color:#B4342B"><b>Sin teléfono.</b> Solo queda el correo.</p>') +
    (d.fuga
      ? '<p style="margin:0 0 18px;padding:12px 16px;background:#F4F6F5;border-left:3px solid #0E7C74">' +
        'Dice que se le pierde aquí:<br><b>' + escapa(d.fuga) + '</b></p>' : '') +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Correo', d.email) +
    fila('Web', d.web) +
    fila('Sector', d.sector) +
    fila('Equipo', d.equipo) +
    fila('Invierte al mes', d.inversion) +
    fila('Origen', d.utm) +
    '</table>' +
    (d.contactId
      ? '<p style="margin:22px 0 0;font-size:14px"><a href="https://app.gohighlevel.com/v2/location/' +
        escapa(process.env.GHL_LOCATION_ID || '') + '/contacts/detail/' + escapa(d.contactId) +
        '" style="color:#0E7C74">Abrir la ficha en el CRM</a></p>' : '') +
    '<p style="margin:26px 0 0;font-size:13px;color:#9A9CA2">Ya le ha salido el primer mensaje ' +
    'automático. Esto es para que puedas adelantarte y llamar tú.</p>' +
    '</div>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
        to: [destino],
        // Si contesta al aviso, que le llegue al lead y no a un buzon muerto.
        reply_to: d.email || undefined,
        subject: asunto,
        html: html
      })
    });
    if (!r.ok) console.error('[aviso] resend', r.status, (await r.text()).slice(0, 200));
    return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status };
  } catch (e) {
    console.error('[aviso] no salió:', e && e.message);
    return { ok: false, motivo: 'fetch_' + (e && e.message) };
  }
}

// Los tres momentos en que un lead se mueve por su cuenta. El reloj de
// api/activacion.js ya los detecta y los etiqueta; lo que faltaba era que
// alguien se enterara. Cada uno se avisa UNA vez, porque el reloj pasa cada
// pocos minutos y el tag que se pone en el mismo sitio es lo que evita el bucle.
const MOVIMIENTOS = {
  respondio: {
    prefijo: '', accion: 'HA CONTESTADO',
    color: '#0E7C74',
    pie: 'La cadencia automática se ha parado. A partir de aquí contestas tú.'
  },
  agendado: {
    prefijo: '', accion: 'HA COGIDO HORA',
    color: '#0E7C74',
    pie: 'La cita está en el calendario y el trato movido a Reunión agendada.'
  },
  baja: {
    prefijo: '[baja] ', accion: 'PIDE NO RECIBIR MÁS',
    color: '#B4342B',
    pie: 'Ya no se le escribe más. No hace falta que hagas nada, es para que lo sepas.'
  },
  // Maikel, 19-sep: «avísame al email de todo lo que pase». Cada paso del
  // sistema (WhatsApp enviado, llamada de Raquel, respuesta del agente) deja
  // un correo corto. Solo correo: al móvil van únicamente los tres de arriba.
  actividad: {
    prefijo: '', accion: 'ACTIVIDAD',
    color: '#3D4148',
    pie: 'Solo para que lo sepas. No hace falta hacer nada.'
  }
};

/**
 * Avisa de que un lead se ha movido. Devuelve {ok, motivo} y NO lanza nunca.
 *
 * @param {string} tipo  respondio | agendado | baja
 * @param {object} d     nombre, empresa, email, telefono, texto (lo que dijo),
 *                       contactId, origen
 */
async function seMovio(tipo, d) {
  d = d || {};
  const m = MOVIMIENTOS[tipo];
  if (!m) return { ok: false, motivo: 'tipo_desconocido' };
  if (tipo === 'respondio' || tipo === 'agendado') {
    await movil((tipo === 'respondio' ? 'HA CONTESTADO · ' : 'HA COGIDO HORA · ') + (d.nombre || d.empresa || d.email || '?') +
      (d.empresa ? ' · ' + d.empresa : '') + (d.texto ? '\n«' + String(d.texto).slice(0, 200) + '»' : '') +
      (d.origen ? '\n' + d.origen : '') + (d.telefono ? '\nTel ' + d.telefono : ''));
  }
  const destino = process.env.AVISO_INTERNO_TO || process.env.INFORME_PAID_TO || 'maikel@qualivo.io';
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'sin_resend' };

  const quien = d.nombre || d.empresa || d.email || d.telefono || 'Un lead';
  const tel = paraMarcar(d.telefono);
  // En el movil solo se lee el asunto: nombre + que ha hecho, nada mas.
  const accion = d.accion || m.accion;
  const asunto = m.prefijo + quien + ' · ' + accion.toLowerCase();

  const html =
    '<div style="font-family:' + F + ';font-size:16px;line-height:1.55;color:#101319;max-width:560px">' +
    '<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:' + m.color +
    ';margin:0 0 6px">' + escapa(accion) + '</p>' +
    '<h2 style="margin:0 0 4px;font-size:24px;letter-spacing:-.02em">' + escapa(quien) + '</h2>' +
    (d.empresa ? '<p style="margin:0 0 18px;color:#7A7C82">' + escapa(d.empresa) + '</p>' : '') +
    (d.texto
      ? '<p style="margin:14px 0 18px;padding:12px 16px;background:#F4F6F5;border-left:3px solid ' +
        m.color + '">«' + escapa(d.texto) + '»</p>' : '') +
    (tel && tipo !== 'baja'
      ? '<p style="margin:0 0 20px"><a href="tel:' + escapa(tel) + '" style="display:inline-block;' +
        'background:' + m.color + ';color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;' +
        'font-size:17px;font-weight:600">Llamar al ' + escapa(d.telefono) + '</a></p>' : '') +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Correo', d.email) +
    fila('Entró por', d.origen) +
    '</table>' +
    (d.contactId
      ? '<p style="margin:22px 0 0;font-size:14px"><a href="https://app.gohighlevel.com/v2/location/' +
        escapa(process.env.GHL_LOCATION_ID || '') + '/contacts/detail/' + escapa(d.contactId) +
        '" style="color:' + m.color + '">Abrir la conversación en el CRM</a></p>' : '') +
    '<p style="margin:26px 0 0;font-size:13px;color:#9A9CA2">' + escapa(m.pie) + '</p>' +
    '</div>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
        to: [destino],
        reply_to: d.email || undefined,
        subject: asunto,
        html: html
      })
    });
    if (!r.ok) console.error('[aviso] resend', r.status, (await r.text()).slice(0, 200));
    return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status };
  } catch (e) {
    console.error('[aviso] no salió:', e && e.message);
    return { ok: false, motivo: 'fetch_' + (e && e.message) };
  }
}

module.exports = { leadNuevo: leadNuevo, seMovio: seMovio, movil: movil };

