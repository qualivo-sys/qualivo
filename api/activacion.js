// El reloj de la capa de activación (cron cada 10 min).
// Lee los contactos marcados con «activacion», mira en qué paso van por sus
// etiquetas y ejecuta el que toque: WhatsApp, llamada o correo.
// El recorrido y los tiempos están en captacion/recorrido-activacion-v2.md.
//
// Se para en seco si el contacto tiene act-agendado, act-respondio o act-baja.
// Esas tres las pone GHL con sus propios workflows (cita creada, mensaje
// entrante, palabra «baja»); aquí solo se leen.

const A = require('./_activacion');
const M = require('./_mensajes');
const S = require('./_secuencias');

const TOPE = 40;          // contactos procesados por ejecución
const PARADAS = ['act-agendado', 'act-respondio', 'act-baja', 'act-fin', 'act-wa1-cancelado'];

// 24-sep-2026: Maikel pidió parar los correos de la cadencia de activación
// (act-email1/2/3, van desde RADIOGRAFIA_FROM). WhatsApp y llamadas siguen igual.
const EMAILS_PAUSADOS = true;

// 24-sep-2026, Maikel (tras ver el wa1 genérico salir a leads reales y
// cruzarse con mensajes que él ya llevaba a mano): el primer WhatsApp tiene
// que construirse de verdad a partir de las respuestas del formulario, con
// IA, no ser el mismo texto para todos. Hasta que ese generador esté listo y
// probado, wa1/wa2/wa3 se saltan por completo (voz, correos ya pausados, y
// el resto de la cadencia siguen igual). Quitar esta pausa cuando el mensaje
// personalizado esté en producción.
const WA_CADENCIA_PAUSADA = false;

// Cadencia del 28-sep-2026 (Maikel, tras el debate con Paid):
//   1. WhatsApp personalizado con IA en cuanto entra (en horario).
//   2. Si a las 2 h 30 no ha contestado, según el nivel (api/_scoring.js), que
//      se recalcula en cada vuelta:
//        A   → aviso al móvil de Maikel para que llame él (ruta-maikel)
//        B/C → una sola llamada de Raquel, en horario de voz (ruta-raquel)
//        D   → sin llamada, solo WhatsApp (ruta-solo-wa)
//   3. D+1: WhatsApp de conversación, sin enlace.
//   4. D+3: WhatsApp con la agenda.
//   5. D+7: se cierra («No responde»).
// Los plazos cuentan desde que salió el primer WhatsApp (act-wa1-h-<sello>),
// no desde que entró: quien entra a las 23:00 recibe el primero a las 8:00 y
// la llamada no puede salir a las 8:01. Sin segunda llamada ni correos.
// Las respuestas no las contesta el agente solo: redacta y avisa a Maikel
// (modo copiloto, api/_agente.js).
//
// Solo entra en esta cadencia quien llegó después de CADENCIA_DESDE. Los
// anteriores los llevó Maikel a mano durante la pausa del 25 al 28-sep y no
// pueden recibir de golpe un primer WhatsApp de hace días.
// Encendido el domingo 27-sep por la tarde (Maikel: «hazlo ahora y reactivemos»).
const CADENCIA_DESDE = Date.parse('2026-09-27T17:16:00Z');

// 27-sep, al quitar la pausa general: los correos de las otras ramas (no-show,
// toque al mes…) y el reenganche automático de conversaciones paradas siguen
// apagados. Primero medimos WhatsApp + Raquel solos, y las respuestas van en
// modo copiloto.
const SECUENCIAS_PAUSADAS = true;
const REENGANCHE_PAUSADO = true;
const ESPERA_PASO2_MIN = 150;

// Nombre de pila limpio: en el formulario la gente escribe «Arq.Ziad» o «Dr. Pérez»
// y el agente de voz lo leía tal cual. Se quita el título y se deja la primera palabra.
function nombrePila(v) {
  const limpio = String(v || '').replace(/^\s*(arq|dra|dr|sra|sr|ing|lic|prof|don|doña)(\.\s*|\s+)/i, '').trim();
  const primera = limpio.split(/\s+/)[0] || '';
  return primera ? primera.charAt(0).toUpperCase() + primera.slice(1) : '';
}

// Minutos desde que entró, leídos de la etiqueta act-ini-AAAAMMDDHHMM.
function minutosDesdeInicio(contacto) {
  const t = (contacto.tags || []).map(String).filter(function (x) { return /^act-ini-\d{12}$/.test(x); })[0];
  if (!t) return A.minutosDesde(contacto.dateAdded);
  const s = t.slice(8);
  const iso = s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) + 'T' + s.slice(8, 10) + ':' + s.slice(10, 12) + ':00Z';
  return A.minutosDesde(iso);
}

// Sello de hora AAAAMMDDHHMM en UTC, para etiquetas act-voz1-h-<sello>.
function selloHora(fecha) {
  return new Date(fecha || Date.now()).toISOString().replace(/[-:T]/g, '').slice(0, 12);
}

// Minutos desde la etiqueta <prefijo><sello>. Sin etiqueta (leads anteriores al
// 21-sep-2026), devuelve un número grande para no bloquear la cadencia.
function minutosDesdeEtiqueta(contacto, prefijo) {
  const t = (contacto.tags || []).map(String).filter(function (x) { return x.indexOf(prefijo) === 0 && /\d{12}$/.test(x); })[0];
  if (!t) return 1e9;
  const s = t.slice(-12);
  const iso = s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) + 'T' + s.slice(8, 10) + ':' + s.slice(10, 12) + ':00Z';
  return A.minutosDesde(iso);
}

function esLeadForm(contacto) {
  return A.tiene(contacto, 'leadform');
}

// Qué paso toca. Devuelve null si no hay nada pendiente todavía.
function siguientePaso(contacto, minutos) {
  const hay = function (t) { return A.tiene(contacto, t); };
  // Lead A o B retenido para Maikel (29-sep): nada automático hasta que él lo suelte.
  if (hay('act-espera-maikel')) return null;
  // Si una puerta (landing, formulario de Meta) está mandando el primer WhatsApp, se espera.
  if (!hay('act-wa1') && minutosDesdeEtiqueta(contacto, 'act-wa1-enviando-') < 15) return null;
  if (!hay('act-wa1')) return minutos >= 0 ? { tipo: 'wa1' } : null;
  let desdeWa1 = minutosDesdeEtiqueta(contacto, 'act-wa1-h-');
  // Sin la hora del primer WhatsApp se cuenta desde que entró, nunca «hace mucho»:
  // el 28-sep a Antonio le salieron D+0, D+1 y D+3 en cincuenta minutos por esto.
  if (desdeWa1 >= 1e9 && (contacto.tags || []).some(function (x) { return /^act-ini-\d{12}$/.test(String(x)); })) desdeWa1 = minutosDesdeInicio(contacto);
  if (!hay('act-paso2') && desdeWa1 >= ESPERA_PASO2_MIN) return { tipo: 'paso2', desdeWa1: desdeWa1 };
  // Llamada de Raquel que cayó fuera de su ventana (1-oct): sale en la siguiente.
  const prog = (contacto.tags || []).map(String).filter(function (x) { return /^act-voz1-prog-\d{12}$/.test(x); })[0];
  if (prog && !hay('act-voz1') && Date.now() >= require('./_horario.js').msDeSello(prog)) return { tipo: 'voz1', ruta: 'ruta-raquel', programada: true };
  if (!hay('act-wa2') && hay('act-paso2') && desdeWa1 >= 24 * 60) return { tipo: 'wa2' };
  if (!hay('act-wa3') && hay('act-wa2') && desdeWa1 >= 3 * 24 * 60) return { tipo: 'wa3' };
  if (hay('act-wa3') && desdeWa1 >= 7 * 24 * 60) return { tipo: 'cerrar' };
  return null;
}

// Nivel actual, calculado en el momento con las etiquetas (quien ha contestado
// ya no llega aquí: la cadencia se para antes).
function nivelAhora(c) {
  const S = require('./_scoring.js');
  return S.nivel(S.tipologia(c).puntos, S.comportamiento(c, []).puntos, c);
}

async function correo(contacto, asunto, html) {
  const email = contacto.email;
  if (!email) return { ok: false, motivo: 'sin_email' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Maikel de Qualivo <onboarding@resend.dev>',
      to: [email],
      subject: asunto,
      html: html
    })
  });
  return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status };
}

function enviarCorreo(contacto, indice) {
  const e = M.EMAILS[indice];
  return correo(contacto, e.asunto(contacto), e.html(contacto));
}

// Las demás ramas del recorrido: no se presentó, después del diagnóstico, fuera
// de alcance y el toque al mes. Cada una se dispara con su etiqueta y se apaga
// sola. Se salta a quien haya respondido o pedido la baja.
// Avisa a Maikel de que el lead se ha movido. Va aquí y no en un workflow de
// GHL porque esos avisos no existen: los dos que hay están en borrador desde
// que se crearon. Se llama SIEMPRE justo después de poner la etiqueta, que es
// lo que garantiza que suene una sola vez: la vuelta siguiente del reloj ya ve
// la etiqueta y ni llega hasta aquí.
//
// No se pone await sobre su resultado ni se comprueba: si el aviso falla, el
// lead sigue su camino igual. Un correo que no sale no puede parar la cadencia.
async function avisar(tipo, c, texto) {
  try {
    await require('./_aviso.js').seMovio(tipo, {
      nombre: c.firstName || c.contactName || c.name || '',
      empresa: c.companyName || '',
      email: c.email || '',
      telefono: c.phone || '',
      texto: texto || '',
      contactId: c.id,
      origen: A.tiene(c, 'leadform') ? 'Formulario de Meta' : 'Landing'
    });
  } catch (err) {
    console.error('[activacion] aviso no salió:', err && err.message);
  }
}

async function procesarSecuencias(resumen) {
  for (const sec of S.SECUENCIAS) {
    let lista;
    try {
      lista = await A.buscarPorEtiqueta(sec.disparador, 300);
    } catch (err) {
      console.error('[activacion] búsqueda de ' + sec.id + ' falló:', err.message);
      continue;
    }
    for (const c of lista) {
      if (A.tiene(c, sec.final) || A.tiene(c, 'act-baja') || A.tiene(c, 'act-respondio')) {
        await A.etiquetar(c.id, null, [sec.disparador]);
        resumen.cerrados++;
        continue;
      }
      const minutos = minutosDesdeInicio(c);
      const rr = await A.revisarRespuesta(c.id, Date.now() - minutos * 60000);
      if (rr.baja || rr.respondio) {
        await A.etiquetar(c.id, [rr.baja ? 'act-baja' : 'act-respondio'], [sec.disparador]);
        await avisar(rr.baja ? 'baja' : 'respondio', c, rr.texto);
        resumen.cerrados++;
        continue;
      }
      let paso = null;
      for (const p of sec.pasos) {
        if (!A.tiene(c, p.etiqueta) && minutos >= p.dias * 24 * 60) { paso = p; break; }
      }
      if (!paso) {
        const ultimo = sec.pasos[sec.pasos.length - 1];
        if (A.tiene(c, ultimo.etiqueta)) {
          await A.etiquetar(c.id, [sec.final], [sec.disparador]);
          resumen.cerrados++;
        } else {
          resumen.esperando++;
        }
        continue;
      }
      // Sin clave de correo no se puede mandar nada. Contarlo como «esperando»
      // era mentir: el contacto se queda clavado en este paso para siempre y el
      // resumen dice que todo va bien. Se registra como error para que salga.
      if (!process.env.RESEND_API_KEY) {
        resumen.errores++;
        console.error('[activacion] falta RESEND_API_KEY: ' + sec.id + '/' + paso.etiqueta + ' no sale para ' + c.id);
        continue;
      }
      try {
        const r = await correo(c, paso.asunto(c), paso.html(c));
        if (r.ok) { await A.etiquetar(c.id, [paso.etiqueta]); resumen.email++; }
        else { resumen.errores++; console.error('[activacion] ' + sec.id + ' ' + paso.etiqueta, r.motivo); }
      } catch (err) {
        resumen.errores++;
        console.error('[activacion] ' + sec.id + ' falló en ' + c.id + ':', err.message);
      }
    }
  }
}

async function handler(req, res) {
  // Pausa general (api/_pausa.js): esta vuelta no hace nada.
  if (require('./_pausa.js').PAUSA_TOTAL) return res.status(200).json({ ok: true, pausa_total: true });
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const resumen = { revisados: 0, wa: 0, sms_rescate: 0, voz: 0, email: 0, cerrados: 0, esperando: 0, errores: 0, sin_vapi: 0 };
  let contactos;
  try {
    contactos = await A.buscarPorEtiqueta('activacion', 400);
  } catch (err) {
    console.error('[activacion] búsqueda falló:', err.message);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }

  // Respaldo del reloj de 2 minutos (api/wa-agente-reloj.js): los A/B retenidos
  // salen solos a los 10 min. El candado de primerWhatsAppCompleto evita dobles.
  try { const sr = await A.soltarRetenidos(); if (sr.revisados) resumen.retenidos = { enviados: sr.enviados, humano: sr.humano, cancelados: sr.cancelados, esperando: sr.esperando }; }
  catch (err) { console.error('[activacion] soltar retenidos:', err && err.message); }

  let hechos = 0;
  for (const c of contactos) {
    resumen.revisados++;
    if (hechos >= TOPE) break;

    const parado = PARADAS.filter(function (t) { return A.tiene(c, t); })[0];
    if (parado) {
      await A.etiquetar(c.id, null, ['activacion']);
      resumen.cerrados++;
      continue;
    }

    const minutos = minutosDesdeInicio(c);
    if (Date.now() - minutos * 60000 < CADENCIA_DESDE) { resumen.anteriores = (resumen.anteriores || 0) + 1; continue; }

    // Antes de tocar nada: ¿ha contestado, ha cogido hora o ha pedido la baja?
    // Se mira aquí y no en un workflow de GHL para que no dependa de que ese
    // workflow exista: escribir a quien ya ha respondido es el peor fallo
    // posible de esta cadencia.
    const inicioMs = Date.now() - minutos * 60000;
    const r = await A.revisarRespuesta(c.id, inicioMs);
    if (r.baja) {
      await A.etiquetar(c.id, ['act-baja'], ['activacion']);
      await A.nota(c.id, 'Pide no recibir más contacto: «' + (r.texto || '') + '». Cadencia detenida.');
      await avisar('baja', c, r.texto);
      resumen.cerrados++;
      continue;
    }
    if (r.respondio) {
      // El primero salió por una plantilla fija (Meta no deja personalizar fuera
      // de la ventana de 24 h). Al contestar, la ventana se abre: ahora sí sale
      // el mensaje con lo que él escribió y la pregunta. Después se para.
      // Con el agente de WhatsApp activo (clave de Anthropic), contesta él y
      // lleva la conversación hasta la cita; el mensaje general de aquí sobra.
      const agenteActivo = !!process.env.ANTHROPIC_API_KEY;
      if (agenteActivo) {
        try { await require('./_agente.js').atender(c.id); } catch (err) { console.error('[activacion] agente:', err.message); }
      }
      if (!agenteActivo && !A.tiene(c, 'act-wa1-personal') && (A.tiene(c, 'act-por-plantilla') || A.tiene(c, 'act-wa1-fallido') || A.tiene(c, 'act-por-gateway'))) {
        try {
          const v = A.leerCamposWA(c);
          const d = { nombre: nombrePila(c.firstName || c.contactName || ''), hipotesis: v.loQueEscribio || '', sector: '', inversion: '' };
          (c.tags || []).forEach(function (t) {
            const s2 = String(t);
            if (s2.startsWith('sector-')) d.sector = s2.slice(7).replace(/-/g, ' ');
            if (s2.startsWith('inv-')) d.inversion = s2.slice(4).replace(/-/g, ' ');
            if (s2.startsWith('fuga-')) d.fuga = s2.slice(5).replace(/-/g, ' ');
          });
          let textoTA = M.whatsappTrasApertura(d);
          if (A.saldriaPorGateway()) {
            const v = await require('./_agente.js').variar({ texto: textoTA, contacto: c, datos: d }).catch(function (e) { return { texto: '', motivo: e && e.message }; });
            if (!v.texto) throw new Error('sin variante (' + v.motivo + '): no sale por la pasarela');
            textoTA = v.texto;
          }
          const env = await A.enviarMensaje(c.id, textoTA);
          if (env.canal === 'whatsapp') { await A.etiquetar(c.id, ['act-wa1-personal']); resumen.wa++; }
        } catch (err) { console.error('[activacion] mensaje personalizado tras respuesta:', err.message); }
      }
      await A.etiquetar(c.id, ['act-respondio'].concat(r.primeraMs ? ['act-respondio-h-' + selloHora(r.primeraMs)] : []), ['activacion']);
      await require('./_tratos.js').mover(c.id, 'conversacion');
      await avisar('respondio', c, r.texto);
      resumen.cerrados++;
      continue;
    }
    if (await A.tieneCitaGHL(c.id)) {
      // Trato, aviso, evento a Meta y WhatsApp de confirmación, todo en _cita.js.
      // Solo cuenta una cita FUTURA: con una pasada, la cadencia sigue (Bloque 2).
      const CITA = require('./_cita.js');
      const ev = await CITA.primeraCita(c.id);
      if (ev) {
        await CITA.confirmarCita({ contactId: c.id, contacto: c, inicio: ev.startTime, evento: ev, origen: 'Reloj' });
        resumen.cerrados++;
        continue;
      }
    }

    // WhatsApps que se quedaron en «failed» después de la comprobación de los
    // cinco segundos (ventana de 24 h de Meta). Salen por la pasarela aquí, sin esperar
    // al siguiente paso: el siguiente paso puede ser la llamada, y llamar a
    // alguien a quien no le ha llegado nada es empezar con el pie cambiado.
    // Primer WhatsApp que falló por la ventana de 24 h: en cuanto la plantilla de
    // Meta esté configurada, sale por ella (una sola vez).
    if (A.tiene(c, 'act-wa1-fallido') && !A.tiene(c, 'act-por-plantilla') && require('./_whatsapp.js').configurado() && c.phone) {
      try {
        const WA = require('./_whatsapp.js');
        const datosP = { nombre: nombrePila(c.firstName || c.contactName || c.name || ''), origen: esLeadForm(c) ? 'leadform' : 'landing', sector: '', inversion: '', fuga: '' };
        (c.tags || []).forEach(function (t) {
          const s = String(t);
          if (s.startsWith('sector-')) datosP.sector = s.slice(7).replace(/-/g, ' ');
          if (s.startsWith('fuga-')) datosP.fuga = s.slice(5).replace(/-/g, ' ');
        });
        const r = await WA.enviarPlantilla(c.phone, WA.PLANTILLAS.primerContacto, [datosP.nombre || 'hola', datosP.fuga || datosP.sector || 'el diagnóstico', M.pregunta(datosP)]);
        if (r.ok) { await A.etiquetar(c.id, ['act-por-plantilla'], ['act-wa1-fallido']); resumen.wa++; }
      } catch (err) { console.error('[activacion] plantilla de rescate falló en ' + c.id + ':', err.message); }
    }

    if (A.tiene(c, 'act-wa1') || A.tiene(c, 'act-wa2') || A.tiene(c, 'act-wa3')) {
      try {
        const n = await A.reenviarFallidos(c.id, inicioMs);
        if (n) {
          await A.etiquetar(c.id, ['act-por-gateway']);
          await A.nota(c.id, 'WhatsApp oficial fallido (ventana de 24 h). El mismo texto ha salido por la pasarela de WhatsApp (' + n + ').');
          resumen.sms_rescate += n;
        }
      } catch (err) {
        console.error('[activacion] rescate por SMS falló en ' + c.id + ':', err.message);
      }
    }

    const paso = siguientePaso(c, minutos);
    if (!paso) { resumen.esperando++; continue; }

    // El primer WhatsApp con la hipótesis textual lo manda el formulario, que es
    // quien la tiene fresca. Si aquel falló, aquí sale la versión sin cita.
    const datos = {
      nombre: nombrePila(c.firstName || c.contactName || c.name || ''),
      sector: '', inversion: '', volumen: '',
      origen: esLeadForm(c) ? 'leadform' : 'landing',
      entro: c.dateAdded || '',
      precualificar: require('./_scoring.js').precualificar(c).si
    };
    // El contexto del lead viaja en las etiquetas que puso el formulario.
    (c.tags || []).forEach(function (t) {
      const s = String(t);
      if (s.startsWith('sector-')) datos.sector = s.slice(7).replace(/-/g, ' ');
      if (s.startsWith('inv-')) datos.inversion = s.slice(4).replace(/-/g, ' ');
      if (s.startsWith('fuga-')) datos.fuga = s.slice(5).replace(/-/g, ' ');
      if (s.startsWith('vol-')) datos.volumen = s.slice(4).replace(/-/g, ' ');
    });
    if (c.website) datos.web = c.website;

    try {
      if (paso.tipo === 'wa1') {
        if (WA_CADENCIA_PAUSADA) { continue; }
        // 1-oct-2026 (Bloque 1): el primer WhatsApp del reloj pasa por la misma
        // función que las puertas (api/_activacion.js primerWhatsAppCompleto):
        // horario, A/B con 10 min de supervisión, variante corta/larga, arranque
        // según la hora, candado contra dobles envíos y trazabilidad.
        const env = await A.primerWhatsAppCompleto(c.id, c.phone, {
          nombre: datos.nombre, empresa: c.companyName || '', sector: datos.sector, fuga: datos.fuga,
          inversion: datos.inversion, volumen: datos.volumen, entro: c.dateAdded || '', origen: datos.origen
        });
        if (env.ok === false) {
          if (env.canal === 'espera_maikel') resumen.espera_maikel = (resumen.espera_maikel || 0) + 1;
          else resumen.esperando++;
          if (env.canal === 'espera_maikel' || env.motivo === 'quiet_hours') hechos++;
          continue;
        }
        if (A.tiene(c, 'aviso-movil-pendiente')) {
          await A.etiquetar(c.id, null, ['aviso-movil-pendiente']);
          // El lead entró de noche y el móvil no sonó (api/_aviso.js): se avisa ahora.
          try {
            const entro = c.dateAdded ? new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(c.dateAdded)) : '';
            await require('./_aviso.js').movil('LEAD NUEVO (entró ' + (entro || 'de noche') + ') · ' + (c.firstName || c.contactName || '?') + (c.companyName ? ' · ' + c.companyName : '') +
              (datos.fuga ? '\n«' + datos.fuga + '»' : '') + (c.phone ? '\nTel ' + c.phone : '') +
              '\nLe acaba de salir el primer WhatsApp' + (env.canal === 'whatsapp_fallido' ? ' (ha fallado, revisa el CRM)' : '') + '.');
          } catch (e) { console.error('[activacion] aviso pendiente no salió:', e && e.message); }
        }
        if (env.canal === 'whatsapp_fallido') resumen.wa_fallidos = (resumen.wa_fallidos || 0) + 1; else resumen.wa++;
        if (env.canal !== 'whatsapp_fallido') {
          await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
            accion: 'WhatsApp enviado (wa1 · ' + (env.variante || '') + ' · ' + (env.modo || '') + (env.canal === 'gateway' ? ', por Wazzap' : '') + ')', texto: env.texto || '', origen: esLeadForm(c) ? 'Formulario de Meta' : 'Landing' }).catch(function () {});
        }
        hechos++;
      } else if (paso.tipo === 'wa2' || paso.tipo === 'wa3') {
        if (WA_CADENCIA_PAUSADA) { continue; }
        if (!A.enVentana('whatsapp')) { resumen.esperando++; continue; }
        let texto = paso.tipo === 'wa2' ? M.whatsappDia1(datos) : M.whatsappDia3(datos);
        // Regla de Maikel (22-sep): por la pasarela nunca el mismo texto dos
        // veces. Se reescribe para esta persona; si no se puede, este paso
        // espera a la siguiente vuelta en vez de salir igual.
        if (A.saldriaPorGateway()) {
          const v = await require('./_agente.js').variar({ texto: texto, contacto: c, datos: datos }).catch(function (e) { return { texto: '', motivo: e && e.message }; });
          if (!v.texto) { console.warn('[activacion] sin variante para ' + c.id + ' (' + v.motivo + '): no sale por la pasarela'); resumen.esperando++; continue; }
          texto = v.texto;
        }
        const env = await A.enviarMensaje(c.id, texto);
        const extra = env.canal === 'gateway' ? ['act-por-gateway'] : env.canal === 'plantilla' ? ['act-por-plantilla']
          : env.canal === 'whatsapp_fallido' ? ['act-' + paso.tipo + '-fallido'] : [];
        await A.etiquetar(c.id, ['act-' + paso.tipo, 'act-' + paso.tipo + '-h-' + selloHora()].concat(extra));
        if (env.canal === 'whatsapp_fallido') resumen.wa_fallidos = (resumen.wa_fallidos || 0) + 1; else resumen.wa++;
        if (env.canal !== 'whatsapp_fallido') {
          await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
            accion: 'WhatsApp enviado (' + paso.tipo + (env.canal === 'gateway' ? ', por Wazzap' : '') + ')', texto: texto, origen: esLeadForm(c) ? 'Formulario de Meta' : 'Landing' }).catch(function () {});
        }
        hechos++;
      } else if (paso.tipo === 'paso2') {
        const HH = require('./_horario.js');
        const nivel = nivelAhora(c);
        if (nivel === 'A') {
          // Lo llama Maikel. En su horario de supervisión, aviso al móvil; fuera,
          // siguiente acción con fecha para el siguiente tramo (1-oct).
          const tel = c.phone || '';
          const texto = 'LLÁMALE · nivel A · ' + (c.firstName || c.contactName || '?') + (c.companyName ? ' · ' + c.companyName : '') +
            '\nNo ha contestado al WhatsApp en 2 h 30.' + (datos.fuga ? '\nDónde se le escapa: ' + datos.fuga : '') + (tel ? '\nTel ' + tel : '');
          if (HH.supervision(Date.now())) await require('./_aviso.js').movil(texto, { forzar: true });
          else await A.siguienteAccion(c, 'Llamar · nivel A sin respuesta', texto);
          await A.etiquetar(c.id, ['act-paso2', 'ruta-maikel']);
          await A.nota(c.id, 'CADENCIA · nivel A sin respuesta a las 2 h 30: le llama Maikel (no Raquel)' + (HH.supervision(Date.now()) ? ', aviso al móvil.' : ', tarea para el siguiente tramo de supervisión.'));
          resumen.aviso_a = (resumen.aviso_a || 0) + 1; hechos++;
          continue;
        }
        if (nivel === 'D' || !c.phone || A.tiene(c, 'sin-canal')) {
          await A.etiquetar(c.id, ['act-paso2', 'ruta-solo-wa']);
          continue;
        }
        // B y C: llamada de Raquel. Fuera de su ventana (L-V 9:30-14:00 y
        // 16:00-19:30, sin festivos) se programa para la siguiente y la cadencia
        // de WhatsApp sigue mientras tanto.
        if (!HH.ventanaVoz(Date.now())) {
          const cuando = HH.siguienteVoz(Date.now());
          await A.etiquetar(c.id, ['act-paso2', 'ruta-raquel', 'act-voz1-prog-' + selloHora(cuando), 'act-voz-motivo-fuera-ventana']);
          await A.nota(c.id, 'CADENCIA · llamada de Raquel fuera de su ventana: programada para el ' + HH.cuandoTexto(cuando) + '.');
          resumen.voz_programada = (resumen.voz_programada || 0) + 1; hechos++;
          continue;
        }
        paso.tipo = 'voz1';
        paso.ruta = 'ruta-raquel';
      }
      if (paso.tipo === 'voz1' || paso.tipo === 'voz2') {
        if (!A.enVentana('voz')) { resumen.esperando++; continue; }
        // Regla «sin canal» (19-sep-2026, tras Francisco y Carmen): si la
        // llamada anterior no llegó a sonar y el WhatsApp tampoco entró, el
        // número está muerto. No se gasta otra llamada: se marca, se avisa a
        // Maikel, se le dice a Meta que el lead no vale, y sigue solo el correo.
        if (A.tiene(c, 'voz-no-conecto') && (A.tiene(c, 'act-wa1-fallido') || A.tiene(c, 'act-wa2-fallido'))) {
          await A.etiquetar(c.id, ['sin-canal', 'act-' + paso.tipo].concat(paso.ruta ? ['act-paso2', 'ruta-solo-wa'] : []));
          await A.nota(c.id, 'SIN CANAL: la llamada anterior no llegó a sonar y el WhatsApp no se entregó. No se llama más; sigue solo el correo.');
          await avisar('respondio', c, 'SIN CANAL: número que no coge llamadas ni WhatsApp. Solo queda el correo.');
          try {
            const idMeta = (c.tags || []).map(String).filter(function (t) { return t.indexOf('meta-lead-') === 0; })[0];
            if (idMeta) await require('./_meta.js').calidadLead('Disqualified', { leadgenId: idMeta.slice(10), email: c.email, telefono: c.phone, contactId: c.id, motivo: 'sin canal' });
          } catch (e) { console.error('[activacion] Disqualified:', e && e.message); }
          resumen.cerrados++; hechos++;
          continue;
        }
        if (await A.tieneCitaGHL(c.id)) {
          const CITA = require('./_cita.js');
          const ev = await CITA.primeraCita(c.id);
          if (ev) {
            await CITA.confirmarCita({ contactId: c.id, contacto: c, inicio: ev.startTime, evento: ev, origen: 'Reloj' });
            resumen.cerrados++; continue;
          }
        }
        const r = await A.lanzarLlamada({
          telefono: c.phone,
          nombre: datos.nombre,
          contexto: {
            nombre: datos.nombre,
            email: c.email || '',
            // Raquel no lee el correo entero (la voz lo pronuncia en inglés): solo el dominio.
            email_dominio: String(c.email || '').split('@')[1] || '',
            empresa: c.companyName || '',
            // Raquel dice «Acabas de pedir el diagnóstico de crecimiento en {{origen}}».
            // Antes decía «en el anuncio del diagnóstico», que suena a bucle. Ahora:
            // «en el anuncio de reformas» si viene de un anuncio y se sabe el sector,
            // «en el anuncio» si no, y «en la web» si entró por la landing sin anuncio.
            origen: (function () {
              const deAnuncio = esLeadForm(c) || (c.tags || []).some(function (t) { return String(t).indexOf('creativo-') === 0; });
              if (!deAnuncio) return 'la web';
              const corto = datos.sector ? require('./_tratos.js').sectorCorto(datos.sector).toLowerCase() : '';
              return corto && corto !== datos.sector.toLowerCase() ? 'el anuncio de ' + corto : 'el anuncio';
            })(),
            fuga: datos.fuga || datos.sector || ''
          }
        });
        if (r.ok) {
          // La hora de la llamada va en una etiqueta para que la segunda no salga
          // veinte minutos después de la primera (pasó el 21-sep a las 9:20).
          await A.etiquetar(c.id, ['act-' + paso.tipo, 'act-' + paso.tipo + '-h-' + selloHora()].concat(paso.ruta ? ['act-paso2', paso.ruta] : []));
          await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
            accion: 'Raquel le está llamando (' + paso.tipo + ')', texto: '', origen: esLeadForm(c) ? 'Formulario de Meta' : 'Landing' }).catch(function () {});
          resumen.voz++; hechos++;
        } else if (r.motivo === 'sin_credenciales') {
          // Sin Vapi no se pierde el lead: se anota y la cadencia sigue.
          await A.etiquetar(c.id, ['act-' + paso.tipo, 'act-voz-pendiente'].concat(paso.ruta ? ['act-paso2', 'ruta-solo-wa'] : []));
          await A.nota(c.id, 'Llamada ' + paso.tipo + ' pendiente: falta VAPI_API_KEY o VAPI_ASSISTANT_ID en el entorno.');
          resumen.sin_vapi++; hechos++;
        } else {
          await A.etiquetar(c.id, ['act-' + paso.tipo].concat(paso.ruta ? ['act-paso2', 'ruta-solo-wa'] : []));
          await A.nota(c.id, 'Llamada ' + paso.tipo + ' no salió: ' + r.motivo + ' ' + (r.detalle || ''));
          resumen.errores++; hechos++;
        }
      } else if (paso.tipo === 'email') {
        if (EMAILS_PAUSADOS) { continue; }
        if (!process.env.RESEND_API_KEY) {
          resumen.errores++;
          console.error('[activacion] falta RESEND_API_KEY: el correo ' + paso.indice + ' no sale para ' + c.id);
          continue;
        }
        const r = await enviarCorreo(c, paso.indice);
        if (r.ok) { await A.etiquetar(c.id, [M.EMAILS[paso.indice].etiqueta]); resumen.email++; hechos++; }
        else { resumen.errores++; console.error('[activacion] correo', c.id, r.motivo); }
      } else if (paso.tipo === 'cerrar') {
        await A.etiquetar(c.id, ['act-fin'], ['activacion']);
        // Cadencia agotada sin reacción: al tablero, etapa «No responde» (Maikel, 22-sep).
        try { await require('./_tratos.js').mover(c.id, 'noResponde'); } catch (e) { /* no bloquea */ }
        resumen.cerrados++;
      }
    } catch (err) {
      resumen.errores++;
      console.error('[activacion] ' + paso.tipo + ' falló en ' + c.id + ':', err.message);
    }
  }

  // Bloque 2: todas las citas de la agenda, una a una por su id. Registra las
  // nuevas, detecta cambios de hora y de estado y confirma los diagnósticos
  // pendientes (widget, GHL a mano, /llamada/, reagendas).
  try {
    const rc = await require('./_cita.js').revisarCitas({ presupuestoMs: 25000 });
    resumen.citas = (resumen.citas || 0) + rc.confirmadas;
    resumen.citasRevisadas = rc;
  } catch (err) {
    console.error('[activacion] rastreo de citas falló:', err && err.message);
  }

  // Confirmaciones de cita que Meta rechazó por falta de plantilla: en cuanto la
  // plantilla exista, salen por ella.
  try {
    const WA = require('./_whatsapp.js');
    if (WA.configurado()) {
      const CITA = require('./_cita.js');
      const pendientes = await A.buscarPorEtiqueta('act-cita-sin-confirmar', 50);
      for (const c of pendientes) {
        const ev = await CITA.primeraCita(c.id);
        if (!ev || !c.phone) { await A.etiquetar(c.id, null, ['act-cita-sin-confirmar']); continue; }
        const d = new Date(ev.startTime);
        if (isNaN(d.getTime()) || d.getTime() < Date.now() || !CITA.enlaceDe(ev)) { await A.etiquetar(c.id, null, ['act-cita-sin-confirmar']); continue; }
        const dia = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' }).format(d);
        const hora = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(d);
        const r = await WA.enviarPlantilla(c.phone, WA.PLANTILLAS.confirmacionCita, [nombrePila(c.firstName || c.contactName || ''), dia, hora, CITA.enlaceDe(ev)]);
        if (r.ok) { await A.etiquetar(c.id, ['act-por-plantilla'], ['act-cita-sin-confirmar']); resumen.citas = (resumen.citas || 0) + 1; }
      }
    }
  } catch (err) {
    console.error('[activacion] confirmaciones pendientes:', err && err.message);
  }

  if (!SECUENCIAS_PAUSADAS) await procesarSecuencias(resumen);

  // Puntuación (Maikel, 22-sep): tipología y comportamiento de los leads
  // tocados en las últimas 24 h; aviso cuando uno pasa a A.
  try {
    const t = A.ahoraMadrid();
    const completa = t.minuto < 10 || (t.minuto >= 30 && t.minuto < 40); // dos veces por hora, con la hoja
    const sc = await require('./_scoring.js').puntuarTodos(completa ? {} : { desdeMs: Date.now() - 24 * 3600 * 1000 });
    resumen.puntuados = sc.total;
  } catch (err) {
    console.error('[activacion] puntuación falló:', err && err.message);
  }

  // Conversaciones que se quedaron paradas tras contestar el lead: un
  // reenganche por vuelta, escrito por el agente en su contexto; tres intentos
  // y descarte (Maikel, 21-sep). Ver api/_reenganche.js.
  try {
    const rg = REENGANCHE_PAUSADO ? {} : await require('./_reenganche.js').vuelta();
    if (rg.enviados || rg.descartados) resumen.reenganche = { enviados: rg.enviados, descartados: rg.descartados };
  } catch (err) {
    console.error('[activacion] reenganche falló:', err && err.message);
  }

  console.log('[activacion]', JSON.stringify(resumen));
  return res.status(200).json({ ok: true, resumen: resumen });
};

// Se exporta para poder probar la cadencia sin tocar el CRM.
module.exports = handler;
module.exports.siguientePaso = siguientePaso;
module.exports.minutosDesdeInicio = minutosDesdeInicio;
module.exports.nivelAhora = nivelAhora;
