// Webhook de los formularios instantáneos de Meta (lead ads).
// Meta avisa de que hay un lead nuevo; los datos hay que ir a buscarlos a la
// Graph API con el token de la página. De ahí pasa a GHL con la etiqueta
// «leadform» y entra en la capa de activación, igual que el de la landing pero
// con veinte minutos de margen antes de la primera llamada, porque este lead no
// ha leído nada: solo ha pulsado dos veces sin salir de Instagram.
//
// Configuración en Meta: URL de devolución de llamada /api/meta-leadform/ (con
// barra final), token de verificación META_LEADFORM_VERIFY y suscripción al
// campo «leadgen».
//
// AVISO: la suscripción es por página, no por formulario, así que llegan los
// leads de TODOS los formularios activos, incluidos los de campañas viejas.
// Por eso META_LEADFORM_IDS lleva los identificadores de los formularios de
// esta campaña, separados por comas. Un lead de un formulario que no esté en
// esa lista se guarda en el CRM pero NO entra en la cadencia: nadie le escribe
// ni le llama. Sin la lista, no se activa ninguno. Escribir a un lead de una
// campaña de hace seis meses es el error que costó la queja de agosto.

const crypto = require('crypto');

const GRAPH = 'https://graph.facebook.com/v21.0';
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Cada lead de Meta abre también un trato en el pipeline «Prospección», en la
// etapa «Nuevo Lead», con el nombre precedido de «Meta ·» y la fuente
// rellenada, para que en el tablero se vea de un vistazo de dónde viene.
// Identificadores de GHL (pipeline Prospección y su primera etapa).
const PIPELINE_PROSPECCION = process.env.GHL_PIPELINE_PROSPECCION || 'JaB4LIwUqFn96LLFEhSm';
const ETAPA_NUEVO_LEAD = process.env.GHL_ETAPA_PROSPECCION_NUEVO || 'b312c2cc-cd51-4a4e-8f9f-ac1e27be5784';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';

// Las respuestas de las preguntas propias llegan con el nombre convertido en
// slug por Meta, que no siempre coincide con la clave que le dimos. Se buscan
// por trozo del nombre y, si no, por el propio valor.
function respuesta(campos, trozos, valores) {
  for (const c of campos) {
    const n = String(c.name || '').toLowerCase();
    if (trozos.some(function (t) { return n.indexOf(t) !== -1; })) {
      return String((c.values || [])[0] || '').trim();
    }
  }
  if (valores) {
    for (const c of campos) {
      const v = String((c.values || [])[0] || '').trim();
      if (valores.some(function (x) { return v.toLowerCase().indexOf(x) !== -1; })) return v;
    }
  }
  return '';
}

// Meta firma cada entrega con el secreto de la app. Sin esta comprobación
// cualquiera que conozca la URL podría inventarse leads y provocar que les
// escribamos y les llamemos. Se valida cuando hay secreto y firma; si el cuerpo
// no se puede leer tal cual llegó, queda la segunda barrera: los datos del lead
// no salen del webhook, se van a buscar a la Graph API con nuestro token, y un
// identificador inventado no existe allí.
function firmaValida(req) {
  const secreto = process.env.META_APP_SECRET;
  const cabecera = String(req.headers['x-hub-signature-256'] || '');
  if (!secreto) return { ok: true, motivo: 'sin_secreto' };
  if (!cabecera.startsWith('sha256=')) return { ok: false, motivo: 'sin_firma' };

  const crudo = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));
  const esperada = 'sha256=' + crypto.createHmac('sha256', secreto).update(crudo, 'utf8').digest('hex');
  const a = Buffer.from(cabecera);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return { ok: false, motivo: 'firma_distinta' };
  return { ok: crypto.timingSafeEqual(a, b), motivo: 'firma_distinta' };
}

function valor(campos, nombres) {
  for (const n of nombres) {
    const c = campos.filter(function (x) { return String(x.name).toLowerCase() === n; })[0];
    if (c && c.values && c.values[0]) return String(c.values[0]).trim();
  }
  return '';
}

async function traerLead(leadgenId, token) {
  const r = await fetch(GRAPH + '/' + leadgenId + '?access_token=' + encodeURIComponent(token));
  if (!r.ok) throw new Error('graph ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}

// Respaldo de la lista blanca. Cada vez que hay que corregir el texto de un
// formulario hay que duplicarlo, porque Meta acepta la edicion de un formulario
// con leads y la ignora en silencio (devuelve success y no cambia nada). El
// duplicado trae identificador nuevo, y si nadie se acuerda de actualizar la
// variable de entorno los leads entran al CRM y no los activa nadie.
//
// Por eso, si el identificador no esta en la lista, se mira el nombre: los
// formularios de esta campana empiezan por este prefijo y los de campanas
// viejas no. Sigue siendo seguro porque la suscripcion ya es solo de nuestra
// pagina y el nombre lo ponemos nosotros.
const PREFIJO_FORM = 'Qualivo_Diagnostico';

async function nombreFormulario(formId) {
  try {
    const t = process.env.META_LEADFORM_TOKEN;
    if (!t || !formId) return '';
    const r = await fetch(GRAPH + '/' + formId + '?fields=name&access_token=' + encodeURIComponent(t));
    if (!r.ok) return '';
    const d = await r.json();
    return String(d.name || '');
  } catch (e) { return ''; }
}

// Trato en Prospección para el lead de Meta. Si el contacto ya tiene uno
// abierto en ese pipeline (lead repetido, rescate que repesca lo mismo), no se
// duplica. Nunca tumba el guardado del lead: si falla, se registra y sigue.
async function crearTratoProspeccion(o) {
  const q = '/opportunities/search?location_id=' + encodeURIComponent(o.locationId) +
    '&contact_id=' + encodeURIComponent(o.contactId) +
    '&pipeline_id=' + encodeURIComponent(PIPELINE_PROSPECCION) + '&status=open';
  const sr = await fetch(GHL_BASE + q, { headers: o.headers });
  if (sr.ok) {
    const sd = await sr.json().catch(function () { return {}; });
    if ((sd.opportunities || []).length) return { ok: true, id: sd.opportunities[0].id, existia: true };
  }
  const nombre = 'Meta · ' + (o.nombre || o.email || o.telefono || 'Lead') +
    (o.empresa ? ' (' + o.empresa + ')' : '') +
    (o.invierte === false ? ' · nada todavía' : '');
  const r = await fetch(GHL_BASE + '/opportunities/', {
    method: 'POST', headers: o.headers,
    body: JSON.stringify({
      pipelineId: PIPELINE_PROSPECCION,
      pipelineStageId: ETAPA_NUEVO_LEAD,
      locationId: o.locationId,
      contactId: o.contactId,
      name: nombre,
      status: 'open',
      source: 'Meta — formulario instantáneo',
      assignedTo: USUARIO_MAIKEL
    })
  });
  if (!r.ok) throw new Error('ghl_opportunity ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json().catch(function () { return {}; });
  return { ok: true, id: d && d.opportunity ? d.opportunity.id : null, existia: false };
}

async function guardar(lead) {
  const headers = {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
  const permitidos = String(process.env.META_LEADFORM_IDS || '')
    .split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  let deEstaCampana = permitidos.length > 0 && permitidos.indexOf(String(lead.form_id || '')) !== -1;
  let porNombre = '';
  if (!deEstaCampana && lead.form_id) {
    const n = await nombreFormulario(lead.form_id);
    if (n && n.indexOf(PREFIJO_FORM) === 0) {
      deEstaCampana = true;
      porNombre = n;
      console.warn('[leadform] ' + lead.form_id + ' («' + n + '») no esta en META_LEADFORM_IDS pero coincide con el prefijo. Se activa igual. Conviene anyadirlo a la variable.');
    }
  }

  const campos = lead.field_data || [];
  const nombre = valor(campos, ['full_name', 'nombre', 'nombre_completo', 'first_name']);
  const email = valor(campos, ['email', 'correo', 'correo_electronico']);
  const telefono = valor(campos, ['phone_number', 'telefono', 'teléfono', 'movil']);
  const empresa = valor(campos, ['company_name', 'empresa']);
  const web = valor(campos, ['website', 'web', 'sitio_web']);
  // Meta devuelve la CLAVE de la opción elegida, no el texto que ve el usuario.
  const CLAVES_INV = {
    nada: 'Nada todavía', menos500: 'Menos de 500 €', '500_2000': 'Entre 500 y 2.000 €',
    '2000_5000': 'Entre 2.000 y 5.000 €', mas5000: 'Más de 5.000 €'
  };
  const CLAVES_FUGA = {
    anuncios: 'En los anuncios y la captación', web: 'En la web y los formularios',
    respuesta: 'En el tiempo de respuesta al lead',
    seguimiento: 'En el seguimiento y los presupuestos',
    nose: 'No lo sé, eso es lo que quiero averiguar'
  };
  const inversionCruda = respuesta(campos, ['invers', 'presupuesto'], ['nada todav', '€']);
  const fugaCruda = respuesta(campos, ['escapa', 'fuga', 'donde_crees'], ['anuncios', 'web', 'respuesta', 'seguimiento', 'no lo s']);
  const inversion = CLAVES_INV[inversionCruda] || inversionCruda;
  const fuga = CLAVES_FUGA[fugaCruda] || fugaCruda;

  if (!telefono && !EMAIL_RE.test(email)) return { ok: false, motivo: 'sin_contacto' };

  // Mismo corte que la landing: queda fuera quien todavia no invierte nada en
  // captacion. Sin eso, el formulario marcaba como cualificado a cualquiera de
  // la campana y le llamaba el agente de voz, mientras la landing al mismo
  // perfil le decia con claridad que todavia no. Dos puertas, dos respuestas
  // distintas al mismo lead.
  const invierte = !!inversion && String(inversionCruda) !== 'nada' &&
    !/^nada/i.test(String(inversion));

  const sello = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
  const etiquetas = ['leadform'];
  if (deEstaCampana && !invierte) {
    // Se guarda y se le contesta con honestidad, pero no entra en la cadencia
    // de llamadas. La secuencia «fuera» es un solo correo, no un nurture eterno.
    etiquetas.push('diagnostico-landing', 'paid', 'act-fuera');
  } else if (deEstaCampana) {
    etiquetas.push('diagnostico-landing', 'diagnostico-cualificado', 'paid',
      'activacion', 'act-ini-' + sello);
  } else {
    // Formulario que no es de esta campaña: se guarda y se queda quieto.
    etiquetas.push('leadform-otra-campana');
  }
  const rotulo = function (v) {
    return String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
  };
  if (inversion) etiquetas.push('inv-' + rotulo(inversion));
  if (fuga) etiquetas.push('fuga-' + rotulo(fuga));
  if (lead.form_id) etiquetas.push('form-' + String(lead.form_id).slice(0, 30));
  if (lead.ad_id) etiquetas.push('creativo-' + String(lead.ad_id).slice(0, 34));

  const up = await fetch(GHL_BASE + '/contacts/upsert', {
    method: 'POST', headers: headers,
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID,
      name: nombre || email || telefono,
      email: EMAIL_RE.test(email) ? email : undefined,
      phone: telefono || undefined,
      companyName: empresa || undefined,
      website: web || undefined,
      source: 'Meta — formulario instantáneo',
      tags: etiquetas
    })
  });
  if (!up.ok) throw new Error('ghl_upsert ' + up.status + ' ' + (await up.text()).slice(0, 200));
  const d = await up.json().catch(function () { return {}; });
  const contactId = d && d.contact ? d.contact.id : null;

  // El upsert empareja por email y no rellena los campos que el contacto ya
  // tenía vacíos. Si el lead trae teléfono y en el CRM no hay, se completa: sin
  // número no hay WhatsApp ni llamada, y el lead se queda muerto sin avisar.
  const guardado = (d && d.contact) || {};
  const faltaTelefono = telefono && !guardado.phone;
  const faltaEmail = EMAIL_RE.test(email) && !guardado.email;
  if (contactId && (faltaTelefono || faltaEmail)) {
    const parche = {};
    if (faltaTelefono) parche.phone = telefono;
    if (faltaEmail) parche.email = email;
    const pr = await fetch(GHL_BASE + '/contacts/' + contactId, {
      method: 'PUT', headers: headers, body: JSON.stringify(parche)
    });
    if (!pr.ok) console.error('[leadform] no se pudo completar el contacto', contactId, pr.status);
  }
  if (contactId) {
    try {
      const t = await crearTratoProspeccion({
        headers: headers, locationId: process.env.GHL_LOCATION_ID, contactId: contactId,
        nombre: nombre, email: EMAIL_RE.test(email) ? email : '', telefono: telefono,
        empresa: empresa, invierte: invierte
      });
      if (t.existia) console.log('[leadform] trato en Prospección ya existía', contactId, t.id);
    } catch (err) {
      console.error('[leadform] no se pudo crear el trato en Prospección', contactId, err && err.message);
    }
  }
  if (contactId && (inversion || fuga)) {
    await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
      method: 'POST', headers: headers,
      body: JSON.stringify({
        body: ['Lead del formulario instantáneo de Meta', '',
          inversion ? 'Inversión mensual en captación: ' + inversion : '',
          fuga ? 'Dónde cree que se le escapa: ' + fuga : '',
          lead.form_id ? 'Formulario: ' + lead.form_id + (porNombre ? ' (' + porNombre + ', reconocido por el nombre)' : '') : '',
          '', new Date().toISOString()].filter(Boolean).join('\n')
      })
    }).catch(function () {});
  }

  return {
    ok: true, contactId: contactId, nombre: nombre, telefono: telefono,
    email: EMAIL_RE.test(email) ? email : '', invierte: invierte,
    inversion: inversion, fuga: fuga, campos: campos, activar: deEstaCampana
  };
}

module.exports = async function handler(req, res) {
  // Verificación del webhook: Meta llama una vez con un reto que hay que devolver.
  if (req.method === 'GET') {
    const q = req.query || {};
    if (q['hub.mode'] === 'subscribe' && q['hub.verify_token'] === process.env.META_LEADFORM_VERIFY) {
      return res.status(200).send(String(q['hub.challenge'] || ''));
    }
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const firma = firmaValida(req);
  if (!firma.ok) {
    console.error('[leadform] entrega rechazada:', firma.motivo);
    return res.status(200).json({ ok: false, error: firma.motivo });
  }

  const token = process.env.META_LEADFORM_TOKEN;
  if (!token || !process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.error('[leadform] falta META_LEADFORM_TOKEN, GHL_API_KEY o GHL_LOCATION_ID');
    return res.status(200).json({ ok: false, error: 'not_configured' });
  }

  const cuerpo = req.body || {};
  const parte = { recibidos: 0, guardados: 0, sin_activar: 0, descartados: 0, errores: [] };
  const avisos = [];
  (cuerpo.entry || []).forEach(function (e) {
    (e.changes || []).forEach(function (ch) {
      const v = ch.value || {};
      if (v.leadgen_id) avisos.push(v);
    });
  });

  // A Meta se le contesta siempre 200: si devolvemos error, reintenta y acabamos
  // escribiendo dos veces al mismo lead. El fallo se registra y se mira aquí.
  for (const av of avisos) {
    try {
      const lead = await traerLead(av.leadgen_id, token);
      // El identificador del formulario y del anuncio viajan en el aviso, no en
      // la respuesta de la Graph API. Sin esto la lista blanca nunca acierta.
      lead.form_id = lead.form_id || av.form_id;
      lead.ad_id = lead.ad_id || av.ad_id;
      const r = await guardar(lead);
      if (!r.ok) {
        console.error('[leadform] descartado', av.leadgen_id, r.motivo);
        parte.descartados++;
        continue;
      }
      parte.guardados++;

      if (!r.activar) {
        console.log('[leadform] guardado sin activar (formulario fuera de la lista)',
          av.leadgen_id, 'form', lead.form_id || '?');
        parte.sin_activar++;
        continue;
      }

      if (r.contactId && r.telefono && r.activar && r.invierte) {
        try {
          const act = require('./_activacion.js');
          const msg = require('./_mensajes.js');
          if (act.enVentana('whatsapp')) {
            const env = await act.enviarMensaje(r.contactId, msg.whatsapp1({
              nombre: r.nombre, origen: 'leadform', inversion: r.inversion, fuga: r.fuga
            }));
            await act.etiquetar(r.contactId, ['act-wa1'].concat(env.canal === 'sms' ? ['act-por-sms'] : []));
          }
        } catch (err) {
          console.error('[leadform] primer WhatsApp no salió:', err && err.message);
        }
      }

      // Correo del minuto cero. Sin ventana horaria a proposito: el WhatsApp de
      // arriba no sale de madrugada, asi que un lead que entra a las 23:00 se
      // quedaba sin nada hasta la manana siguiente. Un correo a esa hora no
      // molesta a nadie y le confirma que su peticion ha llegado.
      if (r.contactId && r.email) {
        try {
          const act = require('./_activacion.js');
          const msg = require('./_mensajes.js');
          const e = msg.emailBienvenida({ nombre: r.nombre, email: r.email, telefono: r.telefono,
            waAhora: !!(r.telefono && act.enVentana('whatsapp')) });
          const env = await act.enviarCorreo(r.email, e.asunto, e.html);
          if (env.ok) await act.etiquetar(r.contactId, ['act-email0']);
          else console.error('[leadform] correo de bienvenida no salio:', env.motivo);
        } catch (err) {
          console.error('[leadform] correo de bienvenida no salio:', err && err.message);
        }
      }
      console.log('[leadform] lead guardado', av.leadgen_id, r.contactId || '');
    } catch (err) {
      console.error('[leadform] error con', av.leadgen_id, err && err.message);
      parte.errores.push(String(err && err.message).slice(0, 160));
    }
  }

  parte.recibidos = avisos.length;
  return res.status(200).json({ ok: true, parte: parte });
};

// Expuesto para el cron de rescate: si el webhook falla una vez, el aviso de
// Meta no vuelve y el lead se pierde para siempre. El rescate repesca los que
// faltan usando exactamente esta misma logica, para que un lead recuperado
// quede igual que uno que entro bien.
module.exports.guardar = guardar;
module.exports.crearTratoProspeccion = crearTratoProspeccion;
