// Formulario de /diagnostico/ (tráfico de pago).
// Dos pasos: el paso 1 llega siempre, aunque no cualifique, porque ese contacto
// puede encajar más adelante. El paso 2 solo llega de quien ha pasado el corte.
// Al entrar un lead cualificado se le mete en la capa de activación: se marca
// con «activacion» y sale el primer WhatsApp, que es el único mensaje con la
// hipótesis del lead escrita con sus palabras. El resto lo lleva el reloj de
// api/activacion.js. Recorrido en captacion/recorrido-activacion-v2.md.
// Claves en variables de entorno de Vercel; nunca llegan al navegador.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[diagnostico] Faltan GHL_API_KEY o GHL_LOCATION_ID');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};
  const cualificado = b.cualificado === true;

  const sector = String(b.sector || '').trim().slice(0, 120);
  const equipo = String(b.equipo || '').trim().slice(0, 60);
  const inversion = String(b.inversion || '').trim().slice(0, 60);
  const web = String(b.web || '').trim().slice(0, 160);
  const nombre = String(b.nombre || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().slice(0, 160);
  const telefono = String(b.telefono || '').trim().slice(0, 40);
  const hipotesis = String(b.hipotesis || '').trim().slice(0, 1200);
  const utm = String(b.utm || '').trim().slice(0, 400);

  if (!sector || !equipo || !inversion || !web) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }
  // De quien cualifica exigimos los datos de contacto; del que no, no hay.
  if (cualificado && (!nombre || !telefono || !EMAIL_RE.test(email))) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const headers = {
    Authorization: 'Bearer ' + apiKey,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };

  // Sin datos de contacto no hay nada que crear en el CRM: se deja constancia
  // en el registro para poder contar cuántos llegan y no pasan el corte.
  if (!cualificado && !EMAIL_RE.test(email)) {
    console.log('[diagnostico] fuera de alcance', JSON.stringify({ sector, equipo, inversion, web, utm }));
    return res.status(200).json({ ok: true, cualificado: false });
  }

  const rotulo = function (v) {
    return String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 34);
  };
  const etiquetas = ['diagnostico-landing']
    .concat(cualificado ? ['diagnostico-cualificado', 'paid'] : ['diagnostico-fuera-de-alcance']);
  const utmContent = (utm.match(/utm_content=([^&]+)/) || [])[1];
  if (utmContent) etiquetas.push('creativo-' + decodeURIComponent(utmContent).slice(0, 40));

  // Contexto que necesita el reloj para escribir el siguiente mensaje, en
  // etiquetas porque es lo único que devuelve la búsqueda de contactos de GHL.
  if (cualificado) {
    const sello = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
    etiquetas.push('activacion', 'act-ini-' + sello);
    if (sector) etiquetas.push('sector-' + rotulo(sector));
    if (inversion) etiquetas.push('inv-' + rotulo(inversion));
  }

  try {
    const upsertRes = await fetch(GHL_BASE + '/contacts/upsert', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        locationId: locationId,
        name: nombre || web,
        email: email || undefined,
        phone: telefono || undefined,
        website: web,
        source: 'qualivo.io — landing diagnóstico',
        tags: etiquetas
      })
    });
    if (!upsertRes.ok) {
      const detalle = await upsertRes.text();
      console.error('[diagnostico] GHL upsert falló', upsertRes.status, detalle.slice(0, 400));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        'Diagnóstico solicitado — landing de pago',
        '',
        'Sector: ' + sector,
        'Equipo: ' + equipo,
        'Inversión mensual en captación: ' + inversion,
        'Web: ' + web,
        'Cualificado: ' + (cualificado ? 'sí' : 'no (por tamaño o inversión)'),
        utm ? 'Origen: ' + utm : '',
        '',
        hipotesis ? 'Dónde cree él que se está perdiendo:\n' + hipotesis : '',
        '',
        new Date().toISOString()
      ].filter(Boolean).join('\n');

      const notaRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST', headers: headers, body: JSON.stringify({ body: nota })
      });
      if (!notaRes.ok) {
        console.error('[diagnostico] Nota no creada', notaRes.status);
      }
    }

    // Conversions API: el Lead solo cuenta cuando ha pasado el corte.
    if (cualificado) {
      try {
        const meta = require('./_meta.js');
        const ck = meta.cookiesMeta(req);
        await meta.enviarLead({
          email: email,
          telefono: telefono,
          nombre: nombre,
          contactId: contactId,
          // Mismo identificador que manda el navegador en landing.js, para que
          // Meta deduplique el Lead en vez de contarlo dos veces.
          eventoId: 'diag-' + email,
          url: 'https://qualivo.io/diagnostico/',
          ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
          ua: req.headers['user-agent'],
          fbp: ck && ck.fbp,
          fbc: ck && ck.fbc,
          custom: { content_name: 'diagnostico-landing-paid' }
        });
      } catch (err) {
        console.error('[diagnostico] CAPI falló:', err && err.message);
      }
    }

    // Primer WhatsApp: sale ya, con su hipótesis tal cual la ha escrito. Si
    // falla, el reloj lo reintenta en el siguiente paso sin la cita textual.
    if (cualificado && contactId && telefono) {
      try {
        const act = require('./_activacion.js');
        const msg = require('./_mensajes.js');
        const env = await act.enviarMensaje(contactId, msg.whatsapp1({
          nombre: nombre, hipotesis: hipotesis, sector: sector, inversion: inversion, origen: 'landing'
        }));
        await act.etiquetar(contactId, ['act-wa1'].concat(env.canal === 'sms' ? ['act-por-sms'] : []));
      } catch (err) {
        console.error('[diagnostico] primer WhatsApp no salió:', err && err.message);
      }
    }

    return res.status(200).json({ ok: true, cualificado: cualificado });
  } catch (err) {
    console.error('[diagnostico] Error inesperado:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};
