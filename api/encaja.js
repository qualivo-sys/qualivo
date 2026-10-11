// Landing de prueba /encaja/ (11-oct-2026). Formulario por pasos con el precio
// delante y el calendario bloqueado hasta terminar. El enrutado (calendario o
// «ahora mismo probablemente no te compensaría») lo decide la página; aquí se
// vuelve a calcular con la misma regla para etiquetar sin fiarse del navegador.
//
// Etiquetas: las MISMAS del funnel v2 (api/_funnel-v2.js, a partir de las mismas
// respuestas que los formularios nativos) + «landing-encaja», para que
// Intelligence compare las cohortes landing frente a nativo con la misma vara.
//
// Quien encaja entra igual que un lead cualificado de /diagnostico/: «paid»,
// «activacion» y act-ini-* (reloj de api/activacion.js), primer WhatsApp al
// momento (o programado si es de noche) y correo del minuto cero. Quien no
// encaja se guarda con sus etiquetas y NO recibe nada automático: es la regla
// del funnel v2 («no se envía ningún "todavía no" hasta que Maikel lo apruebe»).
//
// Contacto: upsert SIN etiquetas y luego el endpoint de etiquetas, que suma y no
// sustituye (29/30-sep: el upsert con «tags» borraba las que ya tenía).
// Sin secretos nuevos: GHL_API_KEY y GHL_LOCATION_ID, como el resto.

const A = require('./_activacion.js');
const V2 = require('./_funnel-v2.js');

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Claves que manda la página → el texto de la opción, escrito de forma que los
// lectores de _funnel-v2.js lo clasifiquen en el mismo tramo que el nativo.
const VOLUMEN = { '<20': 'Menos de 20', '20-49': '20-49', '50-99': '50-99', '100-250': '100-250', '250+': 'Más de 250' };
const TICKET = { '<300': 'Menos de 300 €', '300-1000': '300-1.000 €', '1000-3000': '1.000-3.000 €', '3000+': 'Más de 3.000 €' };
const DECISOR = { yo: 'Yo', socio: 'Yo con un socio', otro: 'Otra persona' };
const MOMENTO = { mes: 'Este mes', '1-3': 'En 1-3 meses', mirando: 'Más adelante, solo estoy mirando' };
const DOLOR = { captacion: 'No entran suficientes', seguimiento: 'Entran pero no compran', nose: 'No lo sé' };
const PRECIO = { si: 'Sí', depende: 'Necesito entenderlo mejor', no: 'No' };
// El mismo texto de fuga que pone el formulario nativo v2 (api/meta-leadform.js):
// lo leen el primer WhatsApp y la precualificación.
const FUGA = {
  captacion: 'En los anuncios y la captación',
  seguimiento: 'En el seguimiento y los presupuestos',
  nose: 'No lo sé, eso es lo que quiero averiguar'
};

function opcion(mapa, v) { v = String(v || ''); return Object.prototype.hasOwnProperty.call(mapa, v) ? v : ''; }

function rotulo(v, n) {
  return String(v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, n || 30);
}

function telefono(t) {
  t = String(t || '').replace(/[\s\-().]/g, '');
  if (/^00\d/.test(t)) t = '+' + t.slice(2);
  if (/^34[6789]\d{8}$/.test(t)) t = '+' + t;
  if (/^[6789]\d{8}$/.test(t)) t = '+34' + t;
  return /^\+\d{8,15}$/.test(t) ? t : '';
}

// Regla de la landing (la misma que encaja/index.html):
//   no-encaja: precio «no», «solo mirando», o < 20 solicitudes con ticket < 300 €.
//   encaja:    20 o más solicitudes, precio «sí» o «necesito entenderlo».
//   revisar:   < 20 solicitudes con ticket ≥ 300 € y sin ninguna señal de fuera.
//              La regla no lo descarta: ve el calendario y se marca aparte.
function enrutar(vol, tic, momento, precio) {
  if (precio === 'no' || momento === 'mirando' || (vol === 1 && tic === 1)) return 'no-encaja';
  if (vol >= 2) return 'encaja';
  return 'revisar';
}

async function upsert(d) {
  const r = await fetch(A.GHL_BASE + '/contacts/upsert', {
    method: 'POST', headers: A.cabeceras(),
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID,
      firstName: d.nombre.split(' ')[0], name: d.nombre,
      email: d.email, phone: d.telefono || undefined,
      companyName: d.empresa || undefined,
      source: 'qualivo.io — /encaja/'
      // Sin «tags»: si el contacto ya existía, GHL SUSTITUYE sus etiquetas.
    })
  });
  if (!r.ok) throw new Error('ghl upsert ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json().catch(function () { return {}; });
  return (j && j.contact) || {};
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true, estado: 'encaja' }); // trampa para robots

  const d = {
    nombre: String(b.nombre || '').trim().slice(0, 80),
    empresa: String(b.empresa || '').trim().slice(0, 120),
    email: String(b.email || '').trim().toLowerCase().slice(0, 160),
    telefono: telefono(b.telefono),
    volumen: opcion(VOLUMEN, b.volumen),
    ticket: opcion(TICKET, b.ticket),
    decisor: opcion(DECISOR, b.decisor),
    momento: opcion(MOMENTO, b.momento),
    dolor: opcion(DOLOR, b.dolor),
    precio: opcion(PRECIO, b.precio),
    utm: String(b.utm || '').trim().slice(0, 400)
  };
  if (d.nombre.length < 2) return res.status(400).json({ ok: false, error: 'nombre' });
  if (!EMAIL_RE.test(d.email)) return res.status(400).json({ ok: false, error: 'email' });
  if (!d.telefono) return res.status(400).json({ ok: false, error: 'telefono' });
  if (!d.volumen || !d.ticket || !d.decisor || !d.momento || !d.dolor || !d.precio) return res.status(400).json({ ok: false, error: 'respuestas' });

  // Las respuestas, con la forma de los campos de un formulario nativo, para que
  // _funnel-v2.js las etiquete exactamente igual.
  const campos = [
    { name: 'solicitudes_al_mes', values: [VOLUMEN[d.volumen]] },
    { name: 'ticket_medio', values: [TICKET[d.ticket]] },
    { name: 'quien_decide', values: [DECISOR[d.decisor]] },
    { name: 'momento', values: [MOMENTO[d.momento]] },
    { name: 'dolor', values: [DOLOR[d.dolor]] }
  ];
  const v2 = V2.desdeCampos(campos) || { etiquetas: [], nota: '', tramos: { vol: 0, tic: 0 } };
  const estado = enrutar(v2.tramos.vol, v2.tramos.tic, d.momento, d.precio);
  const dentro = estado !== 'no-encaja';
  const fuga = FUGA[d.dolor] || '';

  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.error('[encaja] Faltan GHL_API_KEY o GHL_LOCATION_ID');
    return res.status(500).json({ ok: false, error: 'not_configured', estado: estado });
  }

  const etiquetas = ['landing-encaja', 'encaja-' + (estado === 'encaja' ? 'si' : estado === 'revisar' ? 'revisar' : 'no'), 'pagina-encaja']
    .concat(v2.etiquetas)
    .concat(['precio-' + d.precio]);
  if (fuga) etiquetas.push('fuga-' + rotulo(fuga));
  if (dentro) {
    const sello = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
    etiquetas.push('diagnostico-landing', 'diagnostico-cualificado', 'paid', 'activacion', 'act-ini-' + sello);
  } else {
    etiquetas.push('diagnostico-fuera-de-alcance');
  }
  const utmContent = (d.utm.match(/utm_content=([^&]+)/) || [])[1];
  const utmSource = (d.utm.match(/utm_source=([^&]+)/) || [])[1];
  if (utmContent) etiquetas.push('creativo-' + decodeURIComponent(utmContent).slice(0, 40));
  const anuncioId = utmSource && /^meta|^facebook|^instagram|^ig$|^fb$/i.test(decodeURIComponent(utmSource)) && /^\d{8,}$/.test(String(utmContent || ''))
    ? String(utmContent) : '';

  let contactId = '';
  try {
    const c = await upsert(d);
    contactId = c.id || '';
    if (contactId) {
      const tg = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/tags', { method: 'POST', headers: A.cabeceras(), body: JSON.stringify({ tags: etiquetas }) });
      if (!tg.ok) console.error('[encaja] etiquetas no se pusieron', contactId, tg.status);
      // El upsert empareja por email y no rellena el teléfono si ya existía sin él:
      // sin número no hay WhatsApp ni llamada.
      if (d.telefono && !c.phone) {
        await fetch(A.GHL_BASE + '/contacts/' + contactId, { method: 'PUT', headers: A.cabeceras(), body: JSON.stringify({ phone: d.telefono }) })
          .catch(function () {});
      }
    }
  } catch (err) {
    console.error('[encaja] CRM:', err && err.message);
    return res.status(502).json({ ok: false, error: 'crm_error', estado: estado });
  }

  if (contactId) {
    try {
      await require('./_tratos.js').crear({
        contactId: contactId, nombre: d.nombre, email: d.email, telefono: d.telefono,
        origen: anuncioId ? 'Meta' : 'Landing', fuente: 'landing /encaja/', sector: '', adId: anuncioId,
        detalle: dentro ? '' : 'fuera de alcance'
      });
    } catch (e) { /* crear ya registra el fallo */ }

    const nota = ['Landing /encaja/ · ' + (estado === 'encaja' ? 'ENCAJA: ve el calendario' : estado === 'revisar' ? 'REVISAR (< 20 solicitudes, ticket ≥ 300 €): ve el calendario' : 'NO ENCAJA: se le dice en pantalla, sin calendario y sin mensajes automáticos'), '',
      'Empresa: ' + (d.empresa || '—'),
      'Solicitudes al mes: ' + VOLUMEN[d.volumen],
      'Valor de un cliente: ' + TICKET[d.ticket],
      'Quién decide: ' + DECISOR[d.decisor],
      'Cuándo: ' + MOMENTO[d.momento],
      'Dónde cree que se le escapa: ' + DOLOR[d.dolor],
      '«Los proyectos empiezan en 1.200 € + IVA. ¿Encaja ahora?»: ' + PRECIO[d.precio],
      d.utm ? 'Origen: ' + d.utm : null, '',
      v2.nota, '', new Date().toISOString()].filter(function (x) { return x !== null; }).join('\n');
    await A.nota(contactId, nota).catch(function () {});
  }

  // Aviso a Maikel (correo y, si es cualificado y en su horario, el móvil).
  try {
    await require('./_aviso.js').leadNuevo({
      nombre: d.nombre, empresa: d.empresa, email: d.email, telefono: d.telefono,
      fuga: fuga, utm: d.utm, origen: 'Landing /encaja/ · ' + estado,
      cualificado: dentro, contactId: contactId
    });
  } catch (err) { console.error('[encaja] aviso interno no salió:', err && err.message); }

  if (dentro) {
    // Conversions API: el Lead solo cuenta si encaja; mismo event_id que el píxel de la página.
    try {
      const meta = require('./_meta.js');
      const ck = meta.cookiesMeta(req);
      await meta.enviarLead({
        email: d.email, telefono: d.telefono, nombre: d.nombre, contactId: contactId,
        eventoId: 'encaja-' + d.email, url: 'https://qualivo.io/encaja/',
        ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
        ua: req.headers['user-agent'], fbp: ck && ck.fbp, fbc: ck && ck.fbc,
        custom: { content_name: 'landing-encaja' }
      });
    } catch (err) { console.error('[encaja] CAPI falló:', err && err.message); }

    // Primer WhatsApp, el mismo de todas las puertas (de 21:30 a 8:00 queda programado).
    if (contactId && d.telefono) {
      try {
        await A.primerWhatsAppCompleto(contactId, d.telefono, {
          nombre: d.nombre, empresa: d.empresa, origen: 'landing', fuga: fuga, sector: '',
          volumen: VOLUMEN[d.volumen]
        });
      } catch (err) { console.error('[encaja] primer WhatsApp no salió:', err && err.message); }
    }

    // Correo del minuto cero, como en /diagnostico/.
    if (contactId) {
      try {
        const msg = require('./_mensajes.js');
        const e = msg.emailBienvenida({ nombre: d.nombre, email: d.email, telefono: d.telefono, waAhora: !!(d.telefono && A.enVentana('whatsapp')) });
        const r = await A.enviarCorreo(d.email, e.asunto, e.html);
        if (r.ok) await A.etiquetar(contactId, ['act-email0']);
        else console.error('[encaja] correo de bienvenida no salió:', r.motivo);
      } catch (err) { console.error('[encaja] correo de bienvenida no salió:', err && err.message); }
    }
  }

  return res.status(200).json({ ok: true, estado: estado });
};

module.exports.enrutar = enrutar;
