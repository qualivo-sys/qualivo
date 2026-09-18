// Qué pasa cuando un lead tiene hora (pedido por Maikel, 18-sep-2026):
//
//   1. El trato de Prospección pasa a «Reunión agendada».
//   2. Se avisa a Maikel (correo «ha cogido hora») y se manda el evento
//      «Schedule» a Meta por la Conversions API, para que la campaña aprenda de
//      quién llega a reunión y no solo de quién rellena el formulario.
//   3. El cliente recibe un WhatsApp de confirmación con lo que va a ver en la
//      reunión: un plan hecho para su caso. Ahí se hace la venta.
//
// Da igual por dónde haya entrado la cita: Raquel (api/agendar.js), el
// calendario de GHL (api/cita.js, si el workflow está publicado) o el rastreo
// del reloj (api/activacion.js), que mira el calendario cada diez minutos y
// coge las citas que nadie ha procesado. Se hace una sola vez por contacto y
// cita: la etiqueta act-cita-confirmada es el candado.

const A = require('./_activacion');
const WA = require('./_whatsapp');

const ZONA = 'Europe/Madrid';

function nombrePila(v) {
  const limpio = String(v || '').replace(/^\s*(arq|dra|dr|sra|sr|ing|lic|prof|don|doña)(\.\s*|\s+)/i, '').trim();
  const p = limpio.split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1) : '';
}

function partesFecha(d) {
  const dia = new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const hora = new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, hour: '2-digit', minute: '2-digit' }).format(d);
  return { dia: dia, hora: hora };
}

// Texto libre (cuando hay ventana de 24 h o para el SMS de respaldo). La
// plantilla de Meta dice lo mismo con {{1}} {{2}} {{3}}.
function textoConfirmacion(nombre, dia, hora) {
  return 'Hola ' + (nombre || '') + ', soy Maikel, de Qualivo. Confirmado: hablamos el ' + dia + ' a las ' + hora + '. ' +
    'Son quince minutos por videollamada; el enlace está en la invitación que te ha llegado al correo. ' +
    'Voy a repasar contigo dónde se te está escapando el negocio y te enseño un plan hecho para tu caso. ' +
    'Si te surge algo antes, dímelo por aquí.';
}

async function contactoPorId(id) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + id, { headers: A.cabeceras() });
  if (!r.ok) return null;
  const d = await r.json().catch(function () { return {}; });
  return d.contact || null;
}

// o: { contactId, contacto?, inicio (Date|string), origen ('Raquel'|'Calendario'|'Reloj'), fuente? }
// Devuelve { ok, hecho: [...] } y nunca lanza.
async function confirmarCita(o) {
  const hecho = [];
  try {
    let c = o.contacto || null;
    if (!c && o.contactId) c = await contactoPorId(o.contactId);
    if (!c || !c.id) return { ok: false, motivo: 'sin_contacto', hecho: hecho };
    if (A.tiene(c, 'act-cita-confirmada')) return { ok: true, repetida: true, hecho: hecho };
    if (A.tiene(c, 'act-baja')) return { ok: false, motivo: 'baja', hecho: hecho };

    const inicio = o.inicio ? new Date(o.inicio) : null;
    const f = inicio && !isNaN(inicio.getTime()) ? partesFecha(inicio) : { dia: '', hora: '' };
    const nombre = nombrePila(c.firstName || c.contactName || c.name || '');

    // Candado primero: si algo de abajo falla, no se repite el WhatsApp.
    await A.etiquetar(c.id, ['act-agendado', 'act-cita-confirmada'], ['activacion']);
    hecho.push('etiquetas');

    // 1. Trato.
    try {
      const T = require('./_tratos.js');
      await T.mover(c.id, 'reunion', {
        nombre: c.contactName || c.firstName || '', email: c.email || '', telefono: c.phone || '',
        empresa: c.companyName || '', origen: 'Agenda', fuente: o.fuente || ('Cita por ' + (o.origen || 'agenda'))
      });
      hecho.push('trato');
    } catch (e) { console.error('[cita] trato:', e && e.message); }

    // 2. WhatsApp de confirmación al cliente (plantilla; si no, GHL y SMS).
    if (c.phone && f.dia) {
      let salida = { ok: false };
      if (WA.configurado()) {
        salida = await WA.enviarPlantilla(c.phone, WA.PLANTILLAS.confirmacionCita, [nombre || 'hola', f.dia, f.hora]);
        if (salida.ok) hecho.push('whatsapp_plantilla');
      }
      if (!salida.ok) {
        try {
          const env = await A.enviarMensaje(c.id, textoConfirmacion(nombre, f.dia, f.hora));
          hecho.push('confirmacion_' + (env.canal || 'enviada'));
          if (env.canal === 'sms') await A.etiquetar(c.id, ['act-por-sms']);
        } catch (e) { console.error('[cita] confirmación no salió:', e && e.message); }
      }
    }

    // 3. Aviso a Maikel y evento «Schedule» a Meta.
    try {
      await require('./_aviso.js').seMovio('agendado', {
        nombre: c.contactName || c.firstName || '', empresa: c.companyName || '', email: c.email || '',
        telefono: c.phone || '', contactId: c.id,
        origen: (o.origen || 'agenda') + (f.dia ? ' · ' + f.dia + ' ' + f.hora : ''),
        texto: ''
      });
      hecho.push('aviso');
    } catch (e) { console.error('[cita] aviso:', e && e.message); }
    try {
      const r = await require('./_meta.js').enviarEvento('Schedule', {
        email: c.email, telefono: c.phone, nombre: c.firstName || c.contactName, contactId: c.id,
        accion: 'other', eventoId: 'cita-' + c.id + '-' + (inicio ? inicio.toISOString().slice(0, 16) : 'x'),
        custom: { content_name: 'diagnostico-cita', origen: o.origen || 'agenda' }
      });
      hecho.push('meta_' + r);
    } catch (e) { console.error('[cita] Meta Schedule:', e && e.message); }

    await A.nota(c.id, 'Cita confirmada (' + (o.origen || 'agenda') + ')' + (f.dia ? ' · ' + f.dia + ' ' + f.hora : '') +
      '\nHecho: ' + hecho.join(', ')).catch(function () {});
    return { ok: true, hecho: hecho };
  } catch (e) {
    console.error('[cita] confirmarCita:', e && e.message);
    return { ok: false, motivo: e && e.message, hecho: hecho };
  }
}

// Citas del calendario que nadie ha procesado (reservas desde el widget, desde
// el propio GHL o desde /llamada/). Se miran las creadas en los últimos días
// con fecha futura o de hoy.
async function citasSinConfirmar(limite) {
  const cal = process.env.AGENDA_CALENDARIO || 'zBlsw8BEKA2zah81YlOl';
  // Solo citas futuras (con una hora de margen) y reservadas en las últimas 24 h:
  // las de antes de existir esto no reciben una confirmación a destiempo.
  const ini = Date.now() - 3600 * 1000;
  const fin = Date.now() + 60 * 24 * 3600 * 1000;
  const r = await fetch(A.GHL_BASE + '/calendars/events?locationId=' + encodeURIComponent(process.env.GHL_LOCATION_ID) +
    '&calendarId=' + cal + '&startTime=' + ini + '&endTime=' + fin, { headers: A.cabeceras() });
  if (!r.ok) return [];
  const d = await r.json().catch(function () { return {}; });
  const hace24h = Date.now() - 24 * 3600 * 1000;
  return (d.events || []).filter(function (e) {
    if (!e.contactId) return false;
    if (/cancelled|noshow|invalid/i.test(String(e.appointmentStatus || ''))) return false;
    const empieza = Date.parse(e.startTime || 0);
    if (empieza && empieza < ini) return false;
    const creada = Date.parse(e.dateAdded || 0);
    return !!creada && creada >= hace24h;
  }).slice(0, limite || 20);
}

// Próxima cita viva del contacto (startTime) o null.
async function primeraCita(contactId) {
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: A.cabeceras() });
    if (!r.ok) return null;
    const d = await r.json().catch(function () { return {}; });
    const vivas = (d.events || d.appointments || []).filter(function (e) {
      return !/cancelled|noshow|invalid/i.test(String(e.appointmentStatus || ''));
    }).sort(function (a, b) { return Date.parse(a.startTime) - Date.parse(b.startTime); });
    return vivas.length ? vivas[0].startTime : null;
  } catch (e) { return null; }
}

module.exports = { confirmarCita: confirmarCita, citasSinConfirmar: citasSinConfirmar, primeraCita: primeraCita, textoConfirmacion: textoConfirmacion };
