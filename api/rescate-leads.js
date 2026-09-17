// Repesca de leads perdidos.
//
// El webhook de Meta es de un solo intento util: llega el aviso, se lee el lead
// de la Graph API y se guarda. Si algo falla en ese momento, el aviso no vuelve
// y el lead se pierde para siempre. Paso el 14-sep: el token de la Graph API
// llevaba caducado desde el 11 y el primer lead real de la campana no llego al
// CRM. Nadie se entero hasta que Maikel miro el panel de Meta a mano.
//
// Esto compara lo que Meta tiene guardado en el formulario con lo que hay en el
// CRM y crea lo que falte, con la misma logica que el webhook para que un lead
// repescado quede exactamente igual que uno que entro bien.

const { guardar } = require('./meta-leadform.js');

const GRAPH = 'https://graph.facebook.com/v21.0';
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const HORAS = 72;

function cabeceras() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
}

function valor(campos, nombres) {
  for (const c of campos || []) {
    const n = String(c.name || '').toLowerCase();
    if (nombres.some(function (x) { return n.indexOf(x) !== -1; })) {
      return String((c.values || [])[0] || '').trim();
    }
  }
  return '';
}

async function existeEnCrm(email, telefono) {
  for (const [campo, val] of [['email', email], ['phone', telefono]]) {
    if (!val) continue;
    const r = await fetch(GHL_BASE + '/contacts/search', {
      method: 'POST', headers: cabeceras(),
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID, pageLimit: 5,
        filters: [{ field: campo, operator: 'eq', value: val }]
      })
    });
    if (!r.ok) continue;
    const d = await r.json().catch(function () { return {}; });
    if ((d.contacts || []).length) return true;
  }
  return false;
}

async function avisar(asunto, html) {
  if (!process.env.RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
      to: [process.env.INFORME_PAID_TO || 'maikel@qualivo.io'],
      subject: asunto, html: html
    })
  }).catch(function () {});
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const token = process.env.META_LEADFORM_TOKEN;
  const conocidos = Object.keys(require('./meta-leadform.js').FORMULARIOS_SECTOR || {});
  const formularios = String(process.env.META_LEADFORM_IDS || '')
    .split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  conocidos.forEach(function (id) { if (formularios.indexOf(id) === -1) formularios.push(id); });
  if (!token || !formularios.length) {
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const desde = Math.floor(Date.now() / 1000) - HORAS * 3600;
  const parte = { revisados: 0, ya_estaban: 0, rescatados: 0, errores: [] };
  const nuevos = [];

  for (const form of formularios) {
    try {
      const r = await fetch(GRAPH + '/' + form + '/leads?limit=50&access_token=' + encodeURIComponent(token));
      if (!r.ok) {
        const t = (await r.text()).slice(0, 200);
        // Un token caducado es justo lo que provoco la perdida. Que se vea.
        parte.errores.push('form ' + form + ': ' + t);
        continue;
      }
      const d = await r.json();
      for (const lead of (d.data || [])) {
        const t = Math.floor(new Date(lead.created_time).getTime() / 1000);
        if (t < desde) continue;
        parte.revisados++;
        const campos = lead.field_data || [];
        const email = valor(campos, ['email', 'correo']);
        const telefono = valor(campos, ['phone', 'telefono', 'movil']);
        if (await existeEnCrm(email, telefono)) { parte.ya_estaban++; continue; }

        lead.form_id = lead.form_id || form;
        const g = await guardar(lead);
        if (g && g.ok) {
          parte.rescatados++;
          nuevos.push({ nombre: g.nombre || '(sin nombre)', email: email, telefono: telefono, cuando: lead.created_time });
        } else {
          parte.errores.push('lead ' + lead.id + ': ' + ((g && g.motivo) || 'sin_guardar'));
        }
      }
    } catch (e) {
      parte.errores.push('form ' + form + ': ' + String(e && e.message).slice(0, 160));
    }
  }

  if (parte.rescatados || parte.errores.length) {
    const filas = nuevos.map(function (n) {
      return '<tr><td style="padding:4px 14px 4px 0">' + n.nombre + '</td><td style="padding:4px 14px 4px 0">' +
        (n.email || '-') + '</td><td>' + (n.telefono || '-') + '</td></tr>';
    }).join('');
    await avisar(
      parte.rescatados ? 'Rescatados ' + parte.rescatados + ' leads que el webhook perdió' : 'El rescate de leads da error',
      '<p style="font:16px/1.5 system-ui">Revisados ' + parte.revisados + ' · ya estaban ' + parte.ya_estaban +
      ' · <b>rescatados ' + parte.rescatados + '</b></p>' +
      (filas ? '<table style="font:14px/1.6 system-ui">' + filas + '</table>' : '') +
      (parte.errores.length ? '<p style="font:13px/1.5 system-ui;color:#C2410C"><b>Errores:</b><br>' +
        parte.errores.map(function (e) { return String(e).replace(/[<>]/g, ''); }).join('<br>') + '</p>' : '') +
      '<p style="font:13px/1.5 system-ui;color:#666">Si esto rescata leads a menudo, el webhook no está haciendo su trabajo ' +
      'y hay que mirar por qué, no acostumbrarse a la repesca.</p>'
    );
  }

  return res.status(200).json({ ok: true, parte: parte });
};
