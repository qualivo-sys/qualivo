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
const PARADAS = ['act-agendado', 'act-respondio', 'act-baja', 'act-fin'];

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

function esLeadForm(contacto) {
  return A.tiene(contacto, 'leadform');
}

// Qué paso toca. Devuelve null si no hay nada pendiente todavía.
function siguientePaso(contacto, minutos) {
  const hay = function (t) { return A.tiene(contacto, t); };
  const esperaVoz1 = esLeadForm(contacto) ? 20 : 10;

  if (!hay('act-wa1')) return minutos >= 0 ? { tipo: 'wa1' } : null;
  if (!hay('act-voz1') && minutos >= esperaVoz1) return { tipo: 'voz1' };
  if (!hay('act-wa2') && hay('act-voz1') && minutos >= 120) return { tipo: 'wa2' };
  if (!hay('act-voz2') && hay('act-wa2') && minutos >= 60 * 24) return { tipo: 'voz2' };

  for (let i = 0; i < M.EMAILS.length; i++) {
    const e = M.EMAILS[i];
    if (!hay(e.etiqueta) && minutos >= e.dias * 24 * 60) {
      // El WhatsApp final se cuela entre el primer y el segundo correo.
      if (i === 1 && !hay('act-wa3') && minutos >= 4 * 24 * 60) return { tipo: 'wa3' };
      return { tipo: 'email', indice: i };
    }
  }
  if (!hay('act-wa3') && minutos >= 4 * 24 * 60) return { tipo: 'wa3' };
  if (hay('act-email3')) return { tipo: 'cerrar' };
  return null;
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

module.exports = async function handler(req, res) {
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
      await A.etiquetar(c.id, ['act-respondio'], ['activacion']);
      await require('./_tratos.js').mover(c.id, 'conversacion');
      await avisar('respondio', c, r.texto);
      resumen.cerrados++;
      continue;
    }
    if (await A.tieneCitaGHL(c.id)) {
      await A.etiquetar(c.id, ['act-agendado'], ['activacion']);
      await require('./_tratos.js').mover(c.id, 'reunion');
      await avisar('agendado', c, '');
      resumen.cerrados++;
      continue;
    }

    // WhatsApps que se quedaron en «failed» después de la comprobación de los
    // cinco segundos (ventana de 24 h de Meta). Salen por SMS aquí, sin esperar
    // al siguiente paso: el siguiente paso puede ser la llamada, y llamar a
    // alguien a quien no le ha llegado nada es empezar con el pie cambiado.
    if (A.tiene(c, 'act-wa1') || A.tiene(c, 'act-wa2') || A.tiene(c, 'act-wa3')) {
      try {
        const n = await A.reenviarFallidos(c.id, inicioMs);
        if (n) {
          await A.etiquetar(c.id, ['act-por-sms']);
          await A.nota(c.id, 'WhatsApp fallido (ventana de 24 h). El mismo texto ha salido por SMS (' + n + ').');
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
      sector: '', inversion: '',
      origen: esLeadForm(c) ? 'leadform' : 'landing'
    };
    // El contexto del lead viaja en las etiquetas que puso el formulario.
    (c.tags || []).forEach(function (t) {
      const s = String(t);
      if (s.startsWith('sector-')) datos.sector = s.slice(7).replace(/-/g, ' ');
      if (s.startsWith('inv-')) datos.inversion = s.slice(4).replace(/-/g, ' ');
      if (s.startsWith('fuga-')) datos.fuga = s.slice(5).replace(/-/g, ' ');
    });
    if (c.website) datos.web = c.website;

    try {
      if (paso.tipo === 'wa1' || paso.tipo === 'wa2' || paso.tipo === 'wa3') {
        if (!A.enVentana('whatsapp')) { resumen.esperando++; continue; }
        const texto = paso.tipo === 'wa1' ? M.whatsapp1(datos) : paso.tipo === 'wa2' ? M.whatsapp2(datos) : M.whatsapp3(datos);
        const env = await A.enviarMensaje(c.id, texto);
        await A.etiquetar(c.id, ['act-' + paso.tipo].concat(env.canal === 'sms' ? ['act-por-sms'] : []));
        resumen.wa++; hechos++;
      } else if (paso.tipo === 'voz1' || paso.tipo === 'voz2') {
        if (!A.enVentana('voz')) { resumen.esperando++; continue; }
        if (await A.tieneCitaGHL(c.id)) {
          await A.etiquetar(c.id, ['act-agendado'], ['activacion']);
          await require('./_tratos.js').mover(c.id, 'reunion');
          await avisar('agendado', c, '');
          resumen.cerrados++; continue;
        }
        const r = await A.lanzarLlamada({
          telefono: c.phone,
          nombre: datos.nombre,
          contexto: {
            nombre: datos.nombre,
            email: c.email || '',
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
          await A.etiquetar(c.id, ['act-' + paso.tipo]);
          resumen.voz++; hechos++;
        } else if (r.motivo === 'sin_credenciales') {
          // Sin Vapi no se pierde el lead: se anota y la cadencia sigue.
          await A.etiquetar(c.id, ['act-' + paso.tipo, 'act-voz-pendiente']);
          await A.nota(c.id, 'Llamada ' + paso.tipo + ' pendiente: falta VAPI_API_KEY o VAPI_ASSISTANT_ID en el entorno.');
          resumen.sin_vapi++; hechos++;
        } else {
          await A.etiquetar(c.id, ['act-' + paso.tipo]);
          await A.nota(c.id, 'Llamada ' + paso.tipo + ' no salió: ' + r.motivo + ' ' + (r.detalle || ''));
          resumen.errores++; hechos++;
        }
      } else if (paso.tipo === 'email') {
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
        resumen.cerrados++;
      }
    } catch (err) {
      resumen.errores++;
      console.error('[activacion] ' + paso.tipo + ' falló en ' + c.id + ':', err.message);
    }
  }

  await procesarSecuencias(resumen);

  console.log('[activacion]', JSON.stringify(resumen));
  return res.status(200).json({ ok: true, resumen: resumen });
};

// Se exporta para poder probar la cadencia sin tocar el CRM.
module.exports.siguientePaso = siguientePaso;
module.exports.minutosDesdeInicio = minutosDesdeInicio;
