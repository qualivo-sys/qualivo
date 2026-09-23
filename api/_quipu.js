// Cliente mínimo de la API v1 de Quipu (facturación).
//
// Referencia: https://quipuapp.github.io/api-v1-docs/ (OpenAPI descargado y
// revisado el 23-sep-2026). Auth por OAuth2 Client Credentials Grant.
//
// Variables de entorno necesarias:
//   QUIPU_APP_ID, QUIPU_APP_SECRET  — credenciales de la app (en Vercel;
//     en local, solo en el scratchpad con permisos 600, nunca en el repo).
//   QUIPU_OWNER_SLUG                — slug de la cuenta de Maikel en Quipu
//     (se ve en la URL del panel: getquipu.com/<owner_slug>/...). Sin esto
//     no se puede llamar a ningún endpoint salvo /oauth/token.
//
// Importante, antes de usar esto para facturas reales:
// - Cada factura creada por POST /{owner_slug}/invoices consume un número
//   real de la serie de numeración elegida. No es un borrador inocuo: es
//   el mismo efecto que crearla a mano en el panel de Quipu. El campo
//   `stage` (draft/final) que devuelve la API es de solo lectura, no hay
//   forma de pedir "solo borrador" al crearla.
// - Por eso: esta librería solo debe llamarse con el JSON exacto ya
//   enseñado a Maikel y con su «ok», nunca a modo de prueba o borrador
//   especulativo. El "hacer ya el trabajo" es preparar el payload, no
//   crear facturas de prueba en su cuenta real.

const BASE = 'https://getquipu.com';
const ACCEPT = 'application/vnd.quipu.v1+json';

let tokenCache = null; // { access_token, expires_at }

async function obtenerToken() {
  if (tokenCache && tokenCache.expires_at > Date.now() + 10000) {
    return tokenCache.access_token;
  }
  const appId = process.env.QUIPU_APP_ID;
  const appSecret = process.env.QUIPU_APP_SECRET;
  if (!appId || !appSecret) throw new Error('quipu_sin_credenciales');
  const basic = Buffer.from(appId + ':' + appSecret).toString('base64');
  const r = await fetch(BASE + '/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + basic,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=ecommerce'
  });
  const d = await r.json().catch(function () { return {}; });
  if (!r.ok) throw new Error('quipu_token_' + r.status + ' ' + (d.error || ''));
  tokenCache = { access_token: d.access_token, expires_at: Date.now() + (d.expires_in || 7200) * 1000 };
  return tokenCache.access_token;
}

function ownerSlug() {
  const s = process.env.QUIPU_OWNER_SLUG;
  if (!s) throw new Error('quipu_sin_owner_slug');
  return s;
}

async function llamar(metodo, ruta, cuerpo) {
  const token = await obtenerToken();
  const r = await fetch(BASE + '/' + ownerSlug() + ruta, {
    method: metodo,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: ACCEPT,
      'Content-Type': ACCEPT
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  const d = await r.json().catch(function () { return {}; });
  if (!r.ok) {
    const err = new Error('quipu_' + metodo + '_' + r.status);
    err.detalle = d;
    throw err;
  }
  return d;
}

// Busca un contacto por NIF o email exactos. Devuelve el primero que
// encuentre o null. No crea nada.
async function buscarContacto({ tax_id, email }) {
  const filtro = tax_id ? 'filter[tax_id]=' + encodeURIComponent(tax_id)
    : email ? 'filter[email]=' + encodeURIComponent(email) : '';
  if (!filtro) return null;
  const d = await llamar('GET', '/contacts?' + filtro, null);
  return (d.data || [])[0] || null;
}

// Crea un contacto (cliente). datos: { name, tax_id, email, phone, address,
// town, zip_code, country_code }. No comprueba duplicados: llamar antes a
// buscarContacto si procede.
async function crearContacto(datos) {
  const d = await llamar('POST', '/contacts', {
    data: { type: 'contacts', attributes: Object.assign({ country_code: 'ES' }, datos) }
  });
  return d.data;
}

// Lista las series de numeración aplicables a facturas (para elegir
// `numeracionId` en crearFactura).
async function listarSeriesDeNumeracion() {
  const d = await llamar('GET', '/numbering_series?filter[applicable_to]=invoices', null);
  return d.data || [];
}

// Crea una factura de ingreso (kind: income) con una sola línea.
// datos: {
//   contactId, numeracionId (opcional),
//   issue_date ('AAAA-MM-DD'), due_dates (['AAAA-MM-DD']),
//   concepto, base (string o número, ej. '500.00'),
//   ivaPercent (ej. 21), retencionPercent (ej. 15, se envía en positivo:
//     la API resta la retención, no hay que darla en negativo),
//   payment_method (ej. 'bank_transfer'), notes
// }
async function crearFactura(datos) {
  const item = {
    type: 'items',
    attributes: {
      concept: datos.concepto,
      unitary_amount: String(datos.base),
      quantity: 1,
      vat_percent: datos.ivaPercent != null ? datos.ivaPercent : 21,
      retention_percent: datos.retencionPercent || 0
    }
  };
  const relationships = {
    contact: { data: { id: String(datos.contactId), type: 'contacts' } },
    items: { data: [item] }
  };
  if (datos.numeracionId) {
    relationships.numeration = { data: { id: String(datos.numeracionId), type: 'numbering_series' } };
  }
  const d = await llamar('POST', '/invoices', {
    data: {
      type: 'invoices',
      attributes: {
        kind: 'income',
        issue_date: datos.issue_date,
        due_dates: datos.due_dates || undefined,
        payment_method: datos.payment_method || 'bank_transfer',
        notes: datos.notes || undefined
      },
      relationships: relationships
    }
  });
  return d.data;
}

module.exports = { obtenerToken, buscarContacto, crearContacto, listarSeriesDeNumeracion, crearFactura };
