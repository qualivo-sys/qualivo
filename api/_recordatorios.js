// Recordatorios de cita (regla de Maikel, 21-sep-2026):
//
//   - El mismo día, a las 9:00, a TODOS los que tienen cita ese día: hora,
//     enlace de la videollamada y qué vamos a ver. Sale por el canal donde
//     está su conversación (WhatsApp oficial, pasarela o correo si no hay
//     WhatsApp).
//   - Si la cita se reservó con dos o más días de antelación, además uno la
//     víspera (18:30) que pide confirmación en una línea.
//
// Antes de mandar nada se lee el hilo: si hoy ya ha salido un mensaje nuestro
// con el enlace (Maikel a mano, la confirmación de la reserva), no se repite.
// Cada envío deja etiqueta (rec-dia-AAAAMMDD / rec-visp-AAAAMMDD) y nota.
//
// Lo llama api/recordatorios.js (cron). `seco: true` cuenta sin enviar.

const A = require('./_activacion');
const CITA = require('./_cita.js');

const ZONA = 'Europe/Madrid';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
const MAX_ENVIOS = 25;

function nombrePila(v) {
  const limpio = String(v || '').replace(/^\s*(arq|dra|dr|sra|sr|ing|lic|prof|don|doña)(\.\s*|\s+)/i, '').trim();
  const p = limpio.split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1) : '';
}

// AAAAMMDD en hora de Madrid.
function claveDia(fecha) {
  const p = new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(fecha).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  return p.year + p.month + p.day;
}

function horaDe(fecha) {
  return new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, hour: '2-digit', minute: '2-digit' }).format(fecha);
}

// Lo que se va a ver en la reunión, en una frase. Es la promesa de la landing
// y de la confirmación: sistema actual, dónde se pierde, qué se automatiza
// primero, plan escrito.
const QUE_VEREMOS = 'Vamos a ver cómo va hoy tu sistema desde que alguien pide información hasta que compra, dónde se pierde y qué automatizamos primero. Sales con un plan escrito.';

function textoDia(nombre, hora, enlace, extra) {
  return 'Hola ' + (nombre || '') + ', soy Maikel. Te recuerdo que hoy a las ' + hora + ' tenemos la videollamada de 15 minutos. Entra por aquí: ' + enlace + '\n' +
    QUE_VEREMOS + (extra ? ' ' + extra : '') + '\n' +
    'Si te surge algo, dímelo por aquí y lo movemos.';
}

function textoVispera(nombre, hora) {
  return 'Hola ' + (nombre || '') + ', soy Maikel. Mañana a las ' + hora + ' tenemos la videollamada de 15 minutos: ' +
    QUE_VEREMOS.charAt(0).toLowerCase() + QUE_VEREMOS.slice(1) + '\n¿Sigue en pie?';
}

function htmlDe(texto) {
  return '<p>' + String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>').replace(/\n/g, '</p><p>') + '</p>';
}

// Citas vivas entre dos instantes. Mira el calendario de Maikel (todas sus
// agendas, incluidas las que sincroniza Google) y, por si acaso, el calendario
// de reservas. Se quitan repetidas por id.
async function citasEntre(iniMs, finMs) {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const urls = [
    A.GHL_BASE + '/calendars/events?locationId=' + loc + '&userId=' + USUARIO_MAIKEL + '&startTime=' + iniMs + '&endTime=' + finMs,
    A.GHL_BASE + '/calendars/events?locationId=' + loc + '&calendarId=' + (process.env.AGENDA_CALENDARIO || 'zBlsw8BEKA2zah81YlOl') + '&startTime=' + iniMs + '&endTime=' + finMs
  ];
  const vistos = {}, lista = [];
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: A.cabeceras() });
      if (!r.ok) continue;
      const d = await r.json().catch(function () { return {}; });
      (d.events || []).forEach(function (e) {
        if (!e || !e.id || vistos[e.id]) return;
        vistos[e.id] = true;
        if (!e.contactId) return;
        if (/cancelled|noshow|invalid/i.test(String(e.appointmentStatus || ''))) return;
        const t = Date.parse(e.startTime || 0);
        if (!t || t < iniMs || t > finMs) return;
        lista.push(e);
      });
    } catch (err) { /* siguiente fuente */ }
  }
  return lista.sort(function (a, b) { return Date.parse(a.startTime) - Date.parse(b.startTime); });
}

async function contactoPorId(id) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + id, { headers: A.cabeceras() });
  if (!r.ok) return null;
  const d = await r.json().catch(function () { return {}; });
  return d.contact || null;
}

// Por dónde va la conversación de este contacto: 'whatsapp' (API oficial),
// 'gateway' (pasarela) o '' (no hay hilo de WhatsApp). Y si hoy ya salió el
// enlace o un recordatorio nuestro.
function leerHilo(mensajes, hoy) {
  let canal = '', ultimoMs = 0, yaHoy = false;
  for (const m of mensajes) {
    const t = Date.parse(m.dateAdded || 0);
    if (String(m.status || '').toLowerCase() === 'failed') continue;
    if (A.esWhatsApp(m) && t >= ultimoMs) {
      ultimoMs = t;
      canal = /WHATSAPP/i.test(String(m.messageType || '')) ? 'whatsapp' : 'gateway';
    }
    if (String(m.direction) === 'outbound' && claveDia(new Date(t)) === hoy && /meet\.google|recuerdo|recordarte|sigue en pie/i.test(String(m.body || ''))) yaHoy = true;
  }
  return { canal: canal, yaHoy: yaHoy };
}

async function enviar(contacto, canal, texto, asunto) {
  const hecho = [];
  if (contacto.phone) {
    if (canal === 'whatsapp') {
      let id = '';
      try { const r = await A.enviarWhatsApp(contacto.id, texto); id = (r && (r.messageId || r.msgId)) || ''; } catch (e) { id = ''; }
      let bien = false;
      if (id) {
        await new Promise(function (ok) { setTimeout(ok, 5000); });
        const est = await A.estadoMensaje(id);
        bien = !!est && est.toLowerCase() !== 'failed';
      }
      if (bien) hecho.push('whatsapp');
      else { await A.enviarPorGateway(contacto.id, texto); hecho.push('gateway (el oficial falló)'); }
    } else if (canal === 'gateway') {
      await A.enviarPorGateway(contacto.id, texto);
      hecho.push('gateway');
    } else {
      const env = await A.enviarMensaje(contacto.id, texto);
      hecho.push(env.canal);
    }
  }
  // Sin hilo de WhatsApp (o sin teléfono): también por correo, que es donde
  // tiene la invitación.
  if ((!canal || !contacto.phone) && contacto.email) {
    const r = await A.enviarCorreo(contacto.email, asunto, htmlDe(texto));
    hecho.push(r.ok ? 'correo' : 'correo fallido (' + r.motivo + ')');
  }
  return hecho;
}

// modo: 'dia' | 'vispera'. Devuelve resumen y nunca lanza.
async function vuelta(modo, opciones) {
  opciones = opciones || {};
  const seco = !!opciones.seco;
  const ahora = new Date();
  const hoy = claveDia(ahora);
  const resumen = { modo: modo, citas: 0, enviados: 0, saltados: 0, detalle: [], errores: [] };
  try {
    // Ventana de citas: hoy (desde ahora) o mañana entero, en hora de Madrid.
    const objetivo = modo === 'vispera' ? claveDia(new Date(Date.now() + 24 * 3600 * 1000)) : hoy;
    const ini = modo === 'vispera' ? Date.now() + 2 * 3600 * 1000 : Date.now() - 15 * 60000;
    const fin = Date.now() + 48 * 3600 * 1000;
    const citas = (await citasEntre(ini, fin)).filter(function (e) { return claveDia(new Date(Date.parse(e.startTime))) === objetivo; });
    resumen.citas = citas.length;

    const porContacto = {};
    for (const ev of citas) {
      if (porContacto[ev.contactId]) continue; // dos citas el mismo día: un recordatorio
      porContacto[ev.contactId] = true;
      if (resumen.enviados >= MAX_ENVIOS) break;
      const inicio = new Date(Date.parse(ev.startTime));
      const etiqueta = (modo === 'vispera' ? 'rec-visp-' : 'rec-dia-') + objetivo;
      const fila = { contacto: ev.contactId, hora: horaDe(inicio), titulo: ev.title || '' };
      try {
        // Víspera solo si se reservó con dos o más días de antelación. Si no
        // sabemos cuándo se reservó, se manda (mejor un «¿sigue en pie?» de más).
        if (modo === 'vispera') {
          const creada = Date.parse(ev.dateAdded || ev.createdAt || 0);
          if (creada && inicio.getTime() - creada < 2 * 24 * 3600 * 1000) { fila.motivo = 'reservada hace menos de dos días'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        }
        const c = await contactoPorId(ev.contactId);
        if (!c) { fila.motivo = 'sin contacto'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        fila.nombre = c.contactName || c.firstName || '';
        if (A.tiene(c, etiqueta)) { fila.motivo = 'ya enviado'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        if (A.tiene(c, 'act-baja') || c.dnd === true) { fila.motivo = 'baja'; resumen.saltados++; resumen.detalle.push(fila); continue; }

        const mensajes = await A.mensajesDe(c.id);
        const hilo = leerHilo(mensajes, hoy);
        fila.canal = hilo.canal || 'sin hilo';
        if (hilo.yaHoy) {
          fila.motivo = 'hoy ya salió el enlace o un recordatorio';
          resumen.saltados++; resumen.detalle.push(fila);
          if (!seco) await A.etiquetar(c.id, [etiqueta]);
          continue;
        }
        const nombre = nombrePila(c.firstName || c.contactName || c.name || '');
        const enlace = CITA.enlaceDe(ev) || CITA.ENLACE_FIJO;
        // Si Raquel la cerró como llamada, el lead puede esperar el teléfono.
        const extra = A.tiene(c, 'voz-completada') ? 'Si prefieres por teléfono, te llamo yo al móvil a esa hora.' : '';
        const texto = modo === 'vispera' ? textoVispera(nombre, horaDe(inicio)) : textoDia(nombre, horaDe(inicio), enlace, extra);
        fila.texto = texto;
        if (seco) { resumen.enviados++; resumen.detalle.push(fila); continue; }

        const asunto = modo === 'vispera' ? 'Mañana a las ' + horaDe(inicio) + ' · videollamada con Qualivo' : 'Hoy a las ' + horaDe(inicio) + ' · enlace de la videollamada';
        const hecho = await enviar(c, hilo.canal, texto, asunto);
        fila.enviado = hecho.join(', ');
        await A.etiquetar(c.id, [etiqueta]);
        await A.nota(c.id, 'RECORDATORIO DE CITA (' + (modo === 'vispera' ? 'víspera' : 'mismo día') + ') · ' + ahora.toLocaleString('es-ES', { timeZone: ZONA }) +
          '\nCita: ' + inicio.toLocaleString('es-ES', { timeZone: ZONA }) + ' · por ' + fila.enviado + '\n«' + texto + '»').catch(function () {});
        resumen.enviados++;
        resumen.detalle.push(fila);
        // Que no salgan todos en el mismo segundo.
        await new Promise(function (ok) { setTimeout(ok, 1500 + Math.floor(Math.random() * 2500)); });
      } catch (err) {
        fila.error = String((err && err.message) || err).slice(0, 120);
        resumen.errores.push(fila);
      }
    }
  } catch (err) {
    resumen.errores.push({ error: String((err && err.message) || err).slice(0, 200) });
  }
  return resumen;
}

module.exports = { vuelta: vuelta, textoDia: textoDia, textoVispera: textoVispera, citasEntre: citasEntre, claveDia: claveDia };
