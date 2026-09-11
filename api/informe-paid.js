// Parte diario de las campañas de pago. Junta lo de Meta con lo que ha pasado
// después en el CRM y lo manda por correo, para no tener que abrir nada.
//
// Solo escribe si hay algo que contar: si no hay gasto, no molesta. Y separa lo
// que va bien de lo que pide una decisión, porque el objetivo es que nadie mire
// el panel un sábado por la mañana.

const GRAPH = 'https://graph.facebook.com/v21.0';
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const CUENTA = 'act_3453332464718877';
const F = '-apple-system,Segoe UI,Roboto,sans-serif';

// Umbrales de aviso. Salen del histórico de la cuenta: por debajo de 17 € de CPL
// es normal, por encima de 35 € algo va mal.
const CPL_MALO = 35;
const GASTO_SIN_LEADS = 25;

function eur(n) { return Number(n || 0).toFixed(2).replace('.', ',') + ' €'; }

async function meta(ruta, params) {
  const q = new URLSearchParams(Object.assign({ access_token: process.env.META_LEADFORM_TOKEN }, params));
  const r = await fetch(GRAPH + ruta + '?' + q.toString());
  if (!r.ok) throw new Error('meta ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}

async function ghlContactos(etiqueta) {
  const r = await fetch(GHL_BASE + '/contacts/search', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.GHL_API_KEY,
      Version: GHL_VERSION, 'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID, pageLimit: 100,
      filters: [{ field: 'tags', operator: 'contains', value: etiqueta }]
    })
  });
  if (!r.ok) return [];
  return (await r.json()).contacts || [];
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (!process.env.META_LEADFORM_TOKEN || !process.env.RESEND_API_KEY) {
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const avisos = [];
  let filas = [], gastoTotal = 0, leadsTotal = 0;

  try {
    const d = await meta('/' + CUENTA + '/insights', {
      level: 'campaign', date_preset: 'today',
      fields: 'campaign_name,spend,impressions,clicks,ctr,cpc,actions', limit: '25'
    });
    for (const r of (d.data || [])) {
      if (!/^QV_DIAG/.test(r.campaign_name || '')) continue;
      const acts = {};
      (r.actions || []).forEach(function (a) { acts[a.action_type] = a.value; });
      const leads = Number(acts.lead || acts['onsite_conversion.lead_grouped'] || 0);
      const gasto = Number(r.spend || 0);
      gastoTotal += gasto; leadsTotal += leads;
      const cpl = leads ? gasto / leads : 0;
      filas.push({ nombre: r.campaign_name, gasto: gasto, clics: r.clicks, ctr: r.ctr, leads: leads, cpl: cpl });
      if (gasto >= GASTO_SIN_LEADS && leads === 0) {
        avisos.push(r.campaign_name + ': ' + eur(gasto) + ' sin un solo lead. Merece mirarla.');
      } else if (leads > 0 && cpl > CPL_MALO) {
        avisos.push(r.campaign_name + ': lead a ' + eur(cpl) + ', el doble de lo normal en esta cuenta.');
      }
    }
  } catch (err) {
    avisos.push('No he podido leer Meta: ' + err.message.slice(0, 120));
  }

  // Qué ha pasado con esos leads después, que es lo que de verdad importa
  let enCadencia = 0, agendados = 0, respondieron = 0, porSMS = 0;
  try {
    enCadencia = (await ghlContactos('activacion')).length;
    agendados = (await ghlContactos('act-agendado')).length;
    respondieron = (await ghlContactos('act-respondio')).length;
    porSMS = (await ghlContactos('act-por-sms')).length;
  } catch (err) {
    avisos.push('No he podido leer el CRM: ' + String(err.message).slice(0, 100));
  }

  // Silencio si no ha pasado nada: no hay parte que dar.
  if (gastoTotal === 0 && enCadencia === 0) {
    return res.status(200).json({ ok: true, enviado: false, motivo: 'sin_actividad' });
  }

  const tabla = filas.map(function (f) {
    return '<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">' + f.nombre.replace('QV_DIAG_', '').replace('_Sep26', '') +
      '</td><td align="right" style="padding:8px 12px;border-bottom:1px solid #eee">' + eur(f.gasto) +
      '</td><td align="right" style="padding:8px 12px;border-bottom:1px solid #eee">' + f.clics +
      '</td><td align="right" style="padding:8px 12px;border-bottom:1px solid #eee">' + Number(f.ctr || 0).toFixed(2) + ' %' +
      '</td><td align="right" style="padding:8px 12px;border-bottom:1px solid #eee"><b>' + f.leads + '</b>' +
      '</td><td align="right" style="padding:8px 12px;border-bottom:1px solid #eee">' + (f.leads ? eur(f.cpl) : '—') + '</td></tr>';
  }).join('');

  const html =
    '<div style="font-family:' + F + ';font-size:15px;line-height:1.55;color:#101319;max-width:620px">' +
    '<p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#7A7C82;margin:0 0 6px">Campañas de hoy</p>' +
    '<h2 style="margin:0 0 18px;font-size:26px;letter-spacing:-.02em">' + eur(gastoTotal) + ' · ' + leadsTotal + ' leads</h2>' +
    (filas.length ? '<table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="text-align:left;color:#7A7C82">' +
      '<th style="padding:8px 12px">campaña</th><th align="right" style="padding:8px 12px">gasto</th>' +
      '<th align="right" style="padding:8px 12px">clics</th><th align="right" style="padding:8px 12px">CTR</th>' +
      '<th align="right" style="padding:8px 12px">leads</th><th align="right" style="padding:8px 12px">CPL</th></tr>' +
      tabla + '</table>' : '<p>Sin gasto todavía.</p>') +
    '<p style="margin:26px 0 8px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#7A7C82">Qué ha pasado después</p>' +
    '<p style="margin:0">' + enCadencia + ' en la cadencia · <b>' + agendados + ' con hora cogida</b> · ' +
    respondieron + ' han contestado' + (porSMS ? ' · ' + porSMS + ' por SMS porque WhatsApp no pudo' : '') + '</p>' +
    (avisos.length
      ? '<div style="margin-top:26px;background:#FFF6E5;border-left:4px solid #E8590C;padding:16px 18px;border-radius:0 10px 10px 0">' +
        '<p style="margin:0 0 8px;font-weight:800">Esto sí pide una decisión</p><ul style="margin:0;padding-left:18px">' +
        avisos.map(function (a) { return '<li style="margin-bottom:6px">' + a + '</li>'; }).join('') + '</ul>' +
        '<p style="margin:12px 0 0;font-size:14px;color:#5A5E66">Se pausa desde la app de Meta en diez segundos. Nada más urgente que eso.</p></div>'
      : '<p style="margin-top:26px;background:#EAF7F5;border-left:4px solid #0E7C74;padding:16px 18px;border-radius:0 10px 10px 0">' +
        'Todo dentro de lo normal. No hay nada que tocar.</p>') +
    '<p style="font-size:12.5px;color:#9AA2AE;margin-top:26px">Parte automático. Si no llega, es que no hubo actividad.</p></div>';

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
      to: [process.env.INFORME_PAID_TO || 'maikel@qualivo.io'],
      subject: (avisos.length ? '⚠ ' : '') + 'Campañas: ' + eur(gastoTotal) + ', ' + leadsTotal + ' leads, ' + agendados + ' citas',
      html: html
    })
  });
  return res.status(200).json({ ok: r.ok, enviado: r.ok, gasto: gastoTotal, leads: leadsTotal, avisos: avisos.length });
};
