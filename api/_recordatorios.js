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
const CI = require('./_citas.js');

const ZONA = 'Europe/Madrid';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
const MAX_ENVIOS = 25;

// Correos de recordatorio v2 (29-sep-2026): el correo de la víspera y el del
// mismo día dejan de ser el texto del WhatsApp en párrafos y pasan a ser un
// correo con qué vamos a ver, los cuatro números y lo que contestó en el
// formulario (api/_correo-cita.js; vistas previas en content/correos/).
// APAGADO: se enciende cuando Maikel apruebe los textos. Con false todo sale
// exactamente como hasta ahora. Los WhatsApp no cambian en ningún caso.
const CORREO_CITA_V2 = false;
// Con v2 encendido: true = el correo sale también a quien tiene hilo de
// WhatsApp (la videollamada se suele abrir desde el ordenador, donde está el
// correo); false = solo a quien no tiene WhatsApp, como hoy. Lo decide Maikel.
const V2_CORREO_TAMBIEN_CON_WHATSAPP = true;

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
  return 'Hola ' + (nombre || '') + ', soy Maikel. Te recuerdo que hoy a las ' + hora + ' tenemos la videollamada (unos 30 minutos). ' + (/^https?:/.test(enlace) ? 'Entra por aquí: ' + enlace : 'El enlace está ' + enlace + '.') + '\n' +
    QUE_VEREMOS + (extra ? ' ' + extra : '') + '\n' +
    'Si te surge algo, dímelo por aquí y lo movemos.';
}

// Víspera (19-oct-2026, Revenue Journey V3, WA-07): pide un «sí» y deja el
// enlace y la salida para cambiarla. El enlace no se retiene hasta el «sí».
function textoVispera(nombre, hora, enlace) {
  return 'Hola ' + (nombre || '') + ', soy Maikel. Mañana a las ' + hora + ' (hora de Madrid) tenemos la videollamada de 30 minutos: ' +
    'revisamos cómo os llegan y se pierden las solicitudes y te enseño una demo de vuestro sector.\n' +
    '¿Sigue en pie? Respóndeme con un «sí» o, si necesitas cambiarla, dímelo por aquí y buscamos otra hora.' +
    (/^https?:/.test(String(enlace || '')) ? '\nEl enlace es este: ' + enlace : '');
}

// Una hora antes (19-oct-2026, V3): solo el enlace y la salida para cambiarla.
function textoHora(nombre, hora, enlace) {
  return 'Nos vemos a las ' + hora + ', ' + (nombre || '') + '. ' +
    (/^https?:/.test(String(enlace || '')) ? 'Este es el enlace: ' + enlace : 'El enlace está ' + enlace + '.') +
    '\nSi te surge algo, dímelo por aquí y lo movemos.';
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

// correoV2: { asunto, html } o null. Con null, el correo es el de siempre.
async function enviar(contacto, canal, texto, asunto, correoV2) {
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
  if (correoV2) {
    if (contacto.email && (V2_CORREO_TAMBIEN_CON_WHATSAPP || !canal || !contacto.phone)) {
      const r = await A.enviarCorreo(contacto.email, correoV2.asunto, correoV2.html);
      hecho.push(r.ok ? 'correo v2' : 'correo v2 fallido (' + r.motivo + ')');
    }
    return hecho;
  }
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
    // Modo 'hora': las que empiezan dentro de 45-75 minutos (cron cada 10 min).
    const objetivo = modo === 'vispera' ? claveDia(new Date(Date.now() + 24 * 3600 * 1000)) : hoy;
    const ini = modo === 'vispera' ? Date.now() + 2 * 3600 * 1000 : modo === 'hora' ? Date.now() + 45 * 60000 : Date.now() - 15 * 60000;
    const fin = modo === 'hora' ? Date.now() + 75 * 60000 : Date.now() + 48 * 3600 * 1000;
    const citas = (await citasEntre(ini, fin)).filter(function (e) {
      const t = CITA.fechaGHL(e.startTime) || new Date(0);
      if (modo === 'hora') return t.getTime() >= ini && t.getTime() <= fin;
      return claveDia(t) === objetivo;
    });
    resumen.citas = citas.length;

    const porContacto = {};
    for (const ev of citas) {
      if (porContacto[ev.contactId]) continue; // dos citas el mismo día: un recordatorio
      porContacto[ev.contactId] = true;
      if (resumen.enviados >= MAX_ENVIOS) break;
      const inicio = CITA.fechaGHL(ev.startTime) || new Date(NaN);
      const etiqueta = (modo === 'vispera' ? 'rec-visp-' : modo === 'hora' ? 'rec-h1-' : 'rec-dia-') + objetivo;
      const cual = modo === 'vispera' ? 'vispera' : modo === 'hora' ? 'h1' : 'dia';
      const fila = { contacto: ev.contactId, cita: ev.id, hora: horaDe(inicio), titulo: ev.title || '' };
      try {
        // Víspera solo si se reservó con al menos 20 h de antelación (19-oct, V3:
        // antes eran dos días y la mayoría de citas se quedaban sin confirmar).
        // Si no sabemos cuándo se reservó, se manda (mejor un «¿sigue en pie?» de más).
        if (modo === 'vispera') {
          const creada = Date.parse(ev.dateAdded || ev.createdAt || 0);
          if (creada && inicio.getTime() - creada < 20 * 3600 * 1000) { fila.motivo = 'reservada hace menos de 20 h'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        }
        // Una hora antes: no si se reservó hace menos de 2 h (acaba de recibir la confirmación).
        if (modo === 'hora') {
          const creada = Date.parse(ev.dateAdded || ev.createdAt || 0);
          if (creada && Date.now() - creada < 2 * 3600 * 1000) { fila.motivo = 'reservada hace menos de 2 h'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        }
        const c = await contactoPorId(ev.contactId);
        if (!c) { fila.motivo = 'sin contacto'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        fila.nombre = c.contactName || c.firstName || '';
        // Bloque 2: solo el diagnóstico recibe recordatorios. Segunda reunión y
        // cualquier otra cita, nada (mejor silencio que un mensaje incorrecto).
        const regs = (await CI.registrosDe(c.id)) || {};
        const reg = regs[ev.id] || null;
        const tipo = CI.tipoDe(ev, c, reg);
        fila.tipo = tipo.tipo;
        if (tipo.tipo !== 'diagnostico') { fila.motivo = 'no es diagnóstico (' + tipo.motivo + ')'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        if (reg && reg.resultado) { fila.motivo = 'cita con resultado (' + reg.resultado + ')'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        // Un envío por cita y hora: el registro de la cita manda (las etiquetas
        // rec-* antiguas se siguen respetando, ya no se ponen).
        if ((reg && reg.reminder_sent_at && reg.reminder_sent_at[cual]) || A.tiene(c, etiqueta)) { fila.motivo = 'ya enviado'; resumen.saltados++; resumen.detalle.push(fila); continue; }
        if (A.tiene(c, 'act-baja') || c.dnd === true) { fila.motivo = 'baja'; resumen.saltados++; resumen.detalle.push(fila); continue; }

        const mensajes = await A.mensajesDe(c.id);
        const hilo = leerHilo(mensajes, hoy);
        fila.canal = hilo.canal || 'sin hilo';
        // El de una hora antes sale aunque hoy ya haya salido otro mensaje: es el que lleva el enlace a mano.
        if (hilo.yaHoy && modo !== 'hora') {
          fila.motivo = 'hoy ya salió el enlace o un recordatorio';
          resumen.saltados++; resumen.detalle.push(fila);
          if (!seco && reg) await CI.marcarRecordatorio(c.id, ev.id, cual);
          else if (!seco) await A.etiquetar(c.id, [etiqueta]);
          continue;
        }
        const nombre = nombrePila(c.firstName || c.contactName || c.name || '');
        const enlace = CITA.enlaceDe(ev) || CITA.SIN_ENLACE;
        // Si Raquel la cerró como llamada, el lead puede esperar el teléfono.
        const extra = A.tiene(c, 'voz-completada') ? 'Si prefieres por teléfono, te llamo yo al móvil a esa hora.' : '';
        const texto = modo === 'vispera' ? textoVispera(nombre, horaDe(inicio), enlace) : modo === 'hora' ? textoHora(nombre, horaDe(inicio), enlace) : textoDia(nombre, horaDe(inicio), enlace, extra);
        fila.texto = texto;
        if (seco) { resumen.enviados++; resumen.detalle.push(fila); continue; }

        const asunto = modo === 'vispera' ? 'Mañana a las ' + horaDe(inicio) + ' · videollamada con Qualivo' : 'Hoy a las ' + horaDe(inicio) + ' · enlace de la videollamada';
        let correoV2 = null;
        if (CORREO_CITA_V2 && modo !== 'hora') {
          try {
            const CC = require('./_correo-cita.js');
            const datosCita = { hora: horaDe(inicio), enlace: CITA.enlaceDe(ev), porTelefono: !!extra };
            correoV2 = modo === 'vispera' ? CC.vispera(CC.datosDe(c), datosCita) : CC.dia(CC.datosDe(c), datosCita);
          } catch (e) { correoV2 = null; console.error('[recordatorios] correo v2:', e && e.message); }
        }
        const hecho = await enviar(c, hilo.canal, texto, asunto, correoV2);
        fila.enviado = hecho.join(', ');
        // Sin registro de la cita (aún no la ha visto el rastreo) queda la etiqueta antigua.
        if (reg) await CI.marcarRecordatorio(c.id, ev.id, cual); else await A.etiquetar(c.id, [etiqueta]);
        await A.nota(c.id, 'RECORDATORIO DE CITA (' + (modo === 'vispera' ? 'víspera' : modo === 'hora' ? 'una hora antes' : 'mismo día') + ') · ' + ahora.toLocaleString('es-ES', { timeZone: ZONA }) +
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

module.exports = { CORREO_CITA_V2: CORREO_CITA_V2, vuelta: vuelta, textoDia: textoDia, textoVispera: textoVispera, textoHora: textoHora, citasEntre: citasEntre, claveDia: claveDia };
