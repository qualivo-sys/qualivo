// Webhook de los formularios instantáneos de Meta (lead ads).
// Meta avisa de que hay un lead nuevo; los datos hay que ir a buscarlos a la
// Graph API con el token de la página. De ahí pasa a GHL con la etiqueta
// «leadform» y entra en la capa de activación, igual que el de la landing pero
// con veinte minutos de margen antes de la primera llamada, porque este lead no
// ha leído nada: solo ha pulsado dos veces sin salir de Instagram.
//
// Configuración en Meta: URL de devolución de llamada /api/meta-leadform,
// token de verificación META_LEADFORM_VERIFY y suscripción al campo «leadgen».

const GRAPH = 'https://graph.facebook.com/v21.0';
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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
  const campos = lead.field_data || [];
  const nombre = valor(campos, ['full_name', 'nombre', 'nombre_completo', 'first_name']);
  const email = valor(campos, ['email', 'correo', 'correo_electronico']);
  const telefono = valor(campos, ['phone_number', 'telefono', 'teléfono', 'movil']);
  const empresa = valor(campos, ['company_name', 'empresa']);
  const web = valor(campos, ['website', 'web', 'sitio_web']);

  if (!telefono && !EMAIL_RE.test(email)) return { ok: false, motivo: 'sin_contacto' };

  const sello = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
  const etiquetas = ['diagnostico-landing', 'diagnostico-cualificado', 'paid', 'leadform',
    'activacion', 'act-ini-' + sello];
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
  return { ok: true, contactId: contactId, nombre: nombre, telefono: telefono, campos: campos };
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

      if (r.contactId && r.telefono) {
        try {
          const act = require('./_activacion.js');
          const msg = require('./_mensajes.js');
          if (act.enVentana('whatsapp')) {
            await act.enviarWhatsApp(r.contactId, msg.whatsapp1({ nombre: r.nombre, origen: 'leadform' }));
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
