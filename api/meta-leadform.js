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

async function guardar(lead) {
  const headers = {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
  const permitidos = String(process.env.META_LEADFORM_IDS || '')
    .split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  const deEstaCampana = permitidos.length > 0 && permitidos.indexOf(String(lead.form_id || '')) !== -1;

  const campos = lead.field_data || [];
  const nombre = valor(campos, ['full_name', 'nombre', 'nombre_completo', 'first_name']);
  const email = valor(campos, ['email', 'correo', 'correo_electronico']);
  const telefono = valor(campos, ['phone_number', 'telefono', 'teléfono', 'movil']);
  const empresa = valor(campos, ['company_name', 'empresa']);
  const web = valor(campos, ['website', 'web', 'sitio_web']);
  const inversion = respuesta(campos, ['invers', 'presupuesto'], ['nada todav', '€']);
  const fuga = respuesta(campos, ['escapa', 'fuga', 'donde_crees'], ['anuncios y la captaci', 'web y los formul', 'tiempo de respuesta', 'seguimiento y los presu', 'no lo sé']);

  if (!telefono && !EMAIL_RE.test(email)) return { ok: false, motivo: 'sin_contacto' };

  const sello = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
  const etiquetas = ['leadform'];
  if (deEstaCampana) {
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
  if (contactId && (inversion || fuga)) {
    await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
      method: 'POST', headers: headers,
      body: JSON.stringify({
        body: ['Lead del formulario instantáneo de Meta', '',
          inversion ? 'Inversión mensual en captación: ' + inversion : '',
          fuga ? 'Dónde cree que se le escapa: ' + fuga : '',
          lead.form_id ? 'Formulario: ' + lead.form_id : '',
          '', new Date().toISOString()].filter(Boolean).join('\n')
      })
    }).catch(function () {});
  }

  return {
    ok: true, contactId: contactId, nombre: nombre, telefono: telefono,
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
      lead.ad_id = lead.ad_id || av.ad_id;
      const r = await guardar(lead);
      if (!r.ok) { console.error('[leadform] descartado', av.leadgen_id, r.motivo); continue; }

      if (!r.activar) {
        console.log('[leadform] guardado sin activar (formulario fuera de la lista)',
          av.leadgen_id, 'form', lead.form_id || '?');
        continue;
      }

      if (r.contactId && r.telefono) {
        try {
          const act = require('./_activacion.js');
          const msg = require('./_mensajes.js');
          if (act.enVentana('whatsapp')) {
            await act.enviarWhatsApp(r.contactId, msg.whatsapp1({
              nombre: r.nombre, origen: 'leadform', inversion: r.inversion, fuga: r.fuga
            }));
            await act.etiquetar(r.contactId, ['act-wa1']);
          }
        } catch (err) {
          console.error('[leadform] primer WhatsApp no salió:', err && err.message);
        }
      }
      console.log('[leadform] lead guardado', av.leadgen_id, r.contactId || '');
    } catch (err) {
      console.error('[leadform] error con', av.leadgen_id, err && err.message);
    }
  }

  return res.status(200).json({ ok: true, recibidos: avisos.length });
};
