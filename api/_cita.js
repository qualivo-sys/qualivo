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
// coge las citas que nadie ha procesado.
// Bloque 2 (1-oct): el control es POR CITA (api/_citas.js), no por contacto.
// Cada cita confirma su hora una vez; si la hora cambia, sale un «Cambiada:».
// Solo el diagnóstico recibe mensajes; segunda reunión y «otro», nada.

const A = require('./_activacion');
const WA = require('./_whatsapp');

const ZONA = 'Europe/Madrid';

// Correo de confirmación v2 (29-sep-2026): nada más reservar, un correo al lead
// con qué vamos a ver, los cuatro números que conviene traer y lo que contestó
// en el formulario (api/_correo-cita.js; vista previa en
// content/correos/confirmacion-cita-v2.html).
// APAGADO: se enciende cuando Maikel apruebe los textos. Con false no cambia
// nada de lo que hace este fichero.
const CORREO_CITA_V2 = false;

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
// cuando: 'hoy' | 'mañana' | '' ; enlace: URL de la videollamada si se conoce.
function textoConfirmacion(nombre, dia, hora, cuando, enlace) {
  const fecha = (cuando ? cuando + ', ' : 'el ') + dia + ' a las ' + hora;
  return 'Hola ' + (nombre || '') + ', soy Maikel, de Qualivo. Confirmado: hablamos ' + fecha + '. ' +
    'Es por videollamada y dura unos 30 minutos' + (enlace ? '. Este es el enlace: ' + enlace + ' (también lo tienes en la invitación del correo). ' : '; el enlace está en la invitación que te ha llegado al correo. ') +
    'Voy a repasar contigo dónde se te está escapando el negocio y te enseño un plan hecho para tu caso. ' +
    'Si te surge algo antes, dímelo por aquí.';
}

function relativo(d) {
  const f = function (x) { return new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(x); };
  const hoy = f(new Date()), man = f(new Date(Date.now() + 24 * 3600 * 1000));
  const dd = f(d);
  return dd === hoy ? 'hoy' : dd === man ? 'mañana' : '';
}

// Hora de una cita de GHL como Date. Ojo: /contacts/{id}/appointments devuelve
// «2026-09-28 12:00:00» sin zona, en hora de Madrid (la zona de la location),
// mientras que /calendars/events y /calendars/events/appointments/{id} la dan
// en ISO con desfase. Node leía la primera como UTC y la confirmación salía
// con dos horas de más (Renato: 14:00 en vez de 12:00, 22-sep). Aquí se
// interpreta siempre en hora de Madrid cuando no trae zona.
function desfaseMadridMin(d) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(d).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  const comoUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((comoUTC - d.getTime()) / 60000);
}
function fechaGHL(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/);
  if (m) {
    const bruto = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    const d1 = new Date(bruto - desfaseMadridMin(new Date(bruto)) * 60000);
    return new Date(bruto - desfaseMadridMin(d1) * 60000);
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// El enlace de la videollamada de ESA cita (campo address o meetingLocation en
// GHL). Cada cita tiene su propia sala de Meet: el calendario de GHL la crea
// sola (ubicación «Google Meet» del miembro del equipo).
// Hasta el 23-sep había una sala fija (gom-euxm-btb) para todas las citas que
// agendaban Raquel y el agente de WhatsApp. Esa sala nació en la reunión de
// Grupo Rumy del 18-sep, y cualquiera que entraba veía «Diagnóstico y plan
// Grupo Rumy»; además dos citas seguidas compartían puerta. Ya no se usa: si
// una cita no trae enlace, se busca en GHL y, si aun así no hay, el mensaje
// remite a la invitación del correo.
const SIN_ENLACE = 'en la invitación que te ha llegado al correo';

function enlaceDe(ev) {
  const cand = [ev && ev.address, ev && ev.meetingLocation, ev && ev.meetingUrl];
  for (const c of cand) { const m = String(c || '').match(/https?:\/\/\S+/); if (m) return m[0]; }
  return '';
}

async function contactoPorId(id) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + id, { headers: A.cabeceras() });
  if (!r.ok) return null;
  const d = await r.json().catch(function () { return {}; });
  return d.contact || null;
}

// Texto de la confirmación cuando la cita se ha movido (o sustituye a otra).
function textoCambio(nombre, dia, hora, cuando, enlace) {
  const fecha = (cuando ? cuando + ', ' : 'el ') + dia + ' a las ' + hora;
  return 'Hola ' + (nombre || '') + ', soy Maikel, de Qualivo. Cambiada: ahora hablamos ' + fecha + '. ' +
    (enlace ? 'El enlace es el mismo de la invitación: ' + enlace + '. ' : 'Te llega la invitación actualizada al correo. ') +
    'Si te surge algo, dímelo por aquí.';
}

// ¿Ya salió una confirmación de ESTA hora? (transición con el sistema anterior,
// dos relojes a la vez, el agente). Mira los mensajes de las últimas 72 h.
async function yaConfirmadaEnHilo(contactId, hora, dia) {
  try {
    const msgs = await A.mensajesDe(contactId);
    const desde = Date.now() - 72 * 3600 * 1000;
    return msgs.some(function (m) {
      if (String(m.direction) !== 'outbound' || Date.parse(m.dateAdded || 0) < desde) return false;
      if (String(m.status || '').toLowerCase() === 'failed') return false;
      const b = String(m.body || '');
      return /Confirmado: hablamos|Cambiada: ahora hablamos/.test(b) && b.indexOf(hora) > -1 && b.indexOf(dia) > -1;
    });
  } catch (e) { return false; }
}

// Busca la cita concreta del contacto que empieza a esa hora (para las
// entradas que solo traen la hora: webhook de GHL).
async function citaPorHora(contactId, inicio) {
  const t = fechaGHL(inicio);
  if (!t) return null;
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: A.cabeceras() });
    if (!r.ok) return null;
    const d = await r.json().catch(function () { return {}; });
    return (d.events || d.appointments || []).filter(function (e) {
      const s = fechaGHL(e.startTime); return s && Math.abs(s.getTime() - t.getTime()) < 60000;
    }).map(function (e) { return Object.assign({}, e, { contactId: e.contactId || contactId }); })[0] || null;
  } catch (e) { return null; }
}

// Procesa UNA cita (por su id): registra, detecta cambios y, si es un
// diagnóstico vivo sin confirmar para esa hora, confirma.
// o: { origen, fuente, enlace, contacto? }. Nunca lanza.
async function procesarCita(ev, o) {
  o = o || {};
  const CI = require('./_citas.js');
  const hecho = [];
  try {
    if (!ev || !ev.id || !ev.contactId) return { ok: false, motivo: 'sin_cita', hecho: hecho };
    let c = o.contacto && o.contacto.id === ev.contactId ? o.contacto : await CI.contactoPorId(ev.contactId);
    if (!c) return { ok: false, motivo: 'sin_contacto', hecho: hecho };
    let regs = await CI.registrosDe(c.id);
    if (regs === null) return { ok: false, motivo: 'no_se_leen_notas', hecho: hecho };
    let d = CI.decidir(ev, c, regs);
    if (!d.cambios.length && !d.accion) return { ok: true, sinCambios: true, tipo: d.reg.tipo, hecho: hecho };

    // Candado corto por contacto mientras se decide y se envía (dos relojes,
    // webhook y agente a la vez). Se suelta al final.
    const candado = await A.tomarCandado(c.id, 'qv-cita');
    if (!candado) return { ok: true, ocupado: true, hecho: hecho };
    try {
      c = (await CI.contactoPorId(c.id)) || c;
      regs = await CI.registrosDe(c.id);
      if (regs === null) return { ok: false, motivo: 'no_se_leen_notas', hecho: hecho };
      d = CI.decidir(ev, c, regs);
      const reg = d.reg;

      // Una cita viva con fecha futura para la cadencia, sea del tipo que sea.
      if (CI.VIVA(reg.status) && Date.parse(reg.start_at) > Date.now() && A.tiene(c, 'activacion')) {
        await A.etiquetar(c.id, ['act-agendado'], ['activacion']); hecho.push('cadencia_parada');
      }
      if (d.cambios.indexOf('sustituye') > -1) {
        const vieja = regs[reg._sustituye];
        await require('./_aviso.js').movil('DOS CITAS VIVAS · ' + (c.firstName || c.contactName || '?') + (c.companyName ? ' · ' + c.companyName : '') +
          '\nNueva: ' + CI.legible(reg.start_at) + '\nAnterior (sigue viva en GHL): ' + CI.legible(vieja && vieja.start_at) +
          '\nNo cancelo nada solo. Si la anterior ya no vale, cancélala en GHL.').catch(function () {});
        hecho.push('aviso_dos_citas');
        delete reg._sustituye;
      }

      if (d.accion && A.tiene(c, 'act-baja')) { CI.apuntar(reg, 'no se confirma: baja'); d.accion = null; }
      if (d.accion) {
        const inicio = CI.fecha(reg.start_at);
        const f = partesFecha(inicio);
        const cuando = relativo(inicio);
        let enlace = o.enlace || enlaceDe(ev);
        if (!enlace) { try { const full = await citaPorId(ev.id); enlace = enlaceDe(full); } catch (e) { enlace = ''; } }
        const nombre = nombrePila(c.firstName || c.contactName || c.name || '');
        const cambio = d.accion === 'reconfirmar';
        // ¿Es su primer diagnóstico? (para trato, aviso y Schedule)
        const primera = !A.tiene(c, 'act-cita-confirmada') && !Object.keys(regs).some(function (k) {
          return k !== reg.appointment_id && regs[k].tipo === 'diagnostico' && regs[k].confirmation_sent_at;
        });

        if (await yaConfirmadaEnHilo(c.id, f.hora, f.dia)) {
          reg.confirmation_sent_at = new Date().toISOString(); reg.confirmation_start_at = reg.start_at; reg.confirmation_canal = 'ya estaba en el hilo';
          CI.apuntar(reg, 'confirmación ya enviada (hilo)'); hecho.push('ya_confirmada');
        } else if (c.phone && f.dia) {
          // Se apunta ANTES de enviar: si algo falla después, no se repite.
          reg.confirmation_sent_at = new Date().toISOString(); reg.confirmation_start_at = reg.start_at; reg.confirmation_canal = 'enviando';
          await CI.guardar(reg);
          const texto = cambio ? textoCambio(nombre, f.dia, f.hora, cuando, enlace) : textoConfirmacion(nombre, f.dia, f.hora, cuando, enlace);
          let salida = { ok: false };
          // Plantilla oficial solo si hay enlace y es la primera confirmación
          // (su texto dice «Confirmado: hablamos el {{2}}»: {{2}} va sin «hoy/mañana»).
          if (!cambio && enlace && WA.configurado()) {
            try { await A.camposWA(c.id, { citaDia: f.dia, citaHora: f.hora, citaEnlace: enlace }); } catch (e) { /* no bloquea */ }
            salida = await WA.enviarPlantilla(c.phone, WA.PLANTILLAS.confirmacionCita, [nombre || 'hola', f.dia, f.hora, enlace]);
            if (salida.ok) { reg.confirmation_canal = 'plantilla'; hecho.push('whatsapp_plantilla'); }
          }
          if (!salida.ok) {
            try {
              const env = await A.enviarMensaje(c.id, texto, { transaccional: true });
              reg.confirmation_canal = env.canal || 'enviada';
              hecho.push('confirmacion_' + reg.confirmation_canal);
              if (env.canal === 'gateway') await A.etiquetar(c.id, ['act-por-gateway']);
              if (env.canal === 'whatsapp_fallido') await A.etiquetar(c.id, ['act-cita-sin-confirmar', 'wa-confirmacion-cita']);
            } catch (e) { reg.confirmation_canal = 'error'; console.error('[cita] confirmación no salió:', e && e.message); }
          }
          CI.apuntar(reg, (cambio ? 'cambio confirmado' : 'confirmación') + ' (' + reg.confirmation_canal + ')');
        } else {
          reg.confirmation_sent_at = new Date().toISOString(); reg.confirmation_start_at = reg.start_at; reg.confirmation_canal = 'sin teléfono';
          CI.apuntar(reg, 'sin teléfono: solo invitación de Google');
        }

        // Correo de confirmación v2. Solo con CORREO_CITA_V2 encendido.
        if (CORREO_CITA_V2 && !cambio && c.email && f.dia && c.dnd !== true) {
          try {
            const CC = require('./_correo-cita.js');
            const correo = CC.confirmacion(CC.datosDe(c), { dia: f.dia, hora: f.hora, cuando: cuando, enlace: enlace });
            const r = await A.enviarCorreo(c.email, correo.asunto, correo.html);
            hecho.push(r.ok ? 'correo_confirmacion_v2' : 'correo_confirmacion_v2_fallido (' + r.motivo + ')');
          } catch (e) { console.error('[cita] correo de confirmación v2:', e && e.message); }
        }

        // Etiquetas de compatibilidad (las leen el agente, el scoring y vapi-fin).
        await A.etiquetar(c.id, ['act-agendado', 'act-cita-confirmada'], ['activacion']);

        // Trato: primera cita → «Reunión agendada» (con Qualified como hasta hoy);
        // reagenda de alguien en No presentado / Más adelante / No responde →
        // vuelve a «Reunión agendada» sin mandar nada a Meta.
        try {
          const T = require('./_tratos.js');
          await T.mover(c.id, 'reunion', {
            nombre: c.contactName || c.firstName || '', email: c.email || '', telefono: c.phone || '',
            empresa: c.companyName || '', origen: 'Agenda', fuente: o.fuente || ('Cita por ' + (o.origen || 'agenda'))
          }, primera ? null : { reagenda: true, sinMeta: true });
          hecho.push('trato');
        } catch (e) { console.error('[cita] trato:', e && e.message); }

        try {
          await require('./_aviso.js').seMovio('agendado', {
            nombre: c.contactName || c.firstName || '', empresa: c.companyName || '', email: c.email || '',
            telefono: c.phone || '', contactId: c.id,
            origen: (cambio ? 'CAMBIO DE HORA · ' : primera ? '' : 'VUELVE A COGER HORA · ') + (o.origen || 'agenda') + ' · ' + f.dia + ' ' + f.hora,
            texto: ''
          });
          hecho.push('aviso');
        } catch (e) { console.error('[cita] aviso:', e && e.message); }

        // Schedule a Meta: una vez por persona (su primer diagnóstico).
        if (primera) {
          try {
            const r = await require('./_meta.js').enviarEvento('Schedule', {
              email: c.email, telefono: c.phone, nombre: c.firstName || c.contactName, contactId: c.id,
              accion: 'other', eventoId: 'cita-' + c.id + '-' + inicio.toISOString().slice(0, 16),
              custom: { content_name: 'diagnostico-cita', origen: o.origen || 'agenda' }
            });
            hecho.push('meta_' + r);
          } catch (e) { console.error('[cita] Meta Schedule:', e && e.message); }
        }
      }
      await CI.guardar(reg);
      return { ok: true, accion: d.accion, cambios: d.cambios, tipo: reg.tipo, hecho: hecho };
    } finally {
      await A.soltarCandado(c.id, candado);
    }
  } catch (e) {
    console.error('[cita] procesarCita:', e && e.message);
    return { ok: false, motivo: e && e.message, hecho: hecho };
  }
}

async function citaPorId(id) {
  try {
    const r = await fetch(A.GHL_BASE + '/calendars/events/appointments/' + id, { headers: A.cabeceras() });
    if (!r.ok) return null;
    const d = await r.json().catch(function () { return {}; });
    return d.appointment || d.event || null;
  } catch (e) { return null; }
}

// Compatibilidad con las entradas antiguas (Raquel, agente, webhook, reloj).
// o: { contactId, contacto?, inicio, evento?, origen, fuente?, enlace? }
async function confirmarCita(o) {
  try {
    let ev = o.evento && o.evento.id ? Object.assign({}, o.evento) : null;
    if (ev && !ev.contactId) ev.contactId = o.contactId;
    if (ev && (!ev.calendarId || !ev.startTime)) { const full = await citaPorId(ev.id); if (full) ev = Object.assign({}, full, { contactId: full.contactId || ev.contactId }); }
    if (!ev && o.contactId && o.inicio) ev = await citaPorHora(o.contactId, o.inicio);
    if (!ev) return { ok: false, motivo: 'cita_no_encontrada (la recoge el rastreo)', hecho: [] };
    return procesarCita(ev, { origen: o.origen, fuente: o.fuente, enlace: o.enlace, contacto: o.contacto });
  } catch (e) {
    console.error('[cita] confirmarCita:', e && e.message);
    return { ok: false, motivo: e && e.message, hecho: [] };
  }
}

// Rastreo (reloj de activación, cada 10 min): todas las citas de la agenda
// de Maikel desde hace una hora hasta dentro de 60 días. Registra las nuevas,
// detecta cambios de hora y de estado, y confirma los diagnósticos pendientes.
async function revisarCitas(opciones) {
  opciones = opciones || {};
  const CI = require('./_citas.js');
  const limiteMs = Date.now() + (opciones.presupuestoMs || 30000);
  const res = { vistas: 0, confirmadas: 0, cambios: 0, errores: 0 };
  const lista = await CI.citasAgenda(Date.now() - 3600 * 1000, Date.now() + 60 * 24 * 3600 * 1000);
  res.vistas = lista.length;
  for (const ev of lista) {
    if (Date.now() > limiteMs) break;
    const r = await procesarCita(ev, { origen: 'Calendario' });
    if (!r.ok) res.errores++;
    if (r.accion) res.confirmadas++;
    if (r.cambios && r.cambios.length) res.cambios++;
  }
  return res;
}

// Próxima cita viva del contacto (startTime) o null.
async function primeraCita(contactId) {
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: A.cabeceras() });
    if (!r.ok) return null;
    const d = await r.json().catch(function () { return {}; });
    const vivas = (d.events || d.appointments || []).filter(function (e) {
      if (/cancelled|noshow|invalid/i.test(String(e.appointmentStatus || ''))) return false;
      const s = fechaGHL(e.startTime);
      return !!s && s.getTime() > Date.now() - 3600 * 1000; // las pasadas no cuentan
    }).map(function (e) {
      // Se devuelve con la hora en ISO real para que nadie la vuelva a leer como UTC.
      const ini = fechaGHL(e.startTime), fin = fechaGHL(e.endTime);
      return Object.assign({}, e, { startTime: ini ? ini.toISOString() : e.startTime, endTime: fin ? fin.toISOString() : e.endTime });
    }).sort(function (a, b) { return Date.parse(a.startTime) - Date.parse(b.startTime); });
    return vivas.length ? vivas[0] : null;
  } catch (e) { return null; }
}

module.exports = { CORREO_CITA_V2: CORREO_CITA_V2, confirmarCita: confirmarCita, procesarCita: procesarCita, revisarCitas: revisarCitas, textoCambio: textoCambio, primeraCita: primeraCita, textoConfirmacion: textoConfirmacion, enlaceDe: enlaceDe, SIN_ENLACE: SIN_ENLACE, fechaGHL: fechaGHL };
