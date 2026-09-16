/**
 * Acceso directo a la hoja de cálculo desde Vercel.
 *
 * Con la cuenta de servicio, la web escribe y lee la hoja por su cuenta. Eso
 * cambia una cosa importante: la captura de leads y el CRM ya no dependen de
 * que nadie despliegue nada en Apps Script.
 *
 * Apps Script sigue haciendo falta para lo único que no se puede hacer desde
 * aquí: mandar correos desde una cuenta de Google y ejecutar tareas a
 * horas fijas. Pero eso ya no bloquea el lanzamiento.
 *
 * Variables de entorno:
 *   GOOGLE_SERVICE_ACCOUNT   el JSON entero de la cuenta de servicio
 *   SHEET_ID                 id de la hoja
 */
import crypto from 'node:crypto';

export const COLUMNAS = [
  'fecha', 'origen', 'nombre', 'telefono', 'email', 'tier',
  'estado', 'responsable', 'proxima_accion', 'fecha_proxima', 'importe',
  'motivo_perdida', 'notas',
  'pieza', 'espacio', 'medidas', 'estilo', 'presupuesto', 'plazo', 'referencias',
  'primer_contacto', 'fecha_cierre',
  'utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid',
  'ip', 'user_agent', 'lead_id', 'sla_avisado', 'email_enviado',
];

export const ESTADOS = ['Nuevo', 'Contactado', 'Visita o llamada',
  'Presupuesto enviado', 'Ganado', 'Perdido'];
export const CERRADOS = ['Ganado', 'Perdido'];

const idx = (n) => COLUMNAS.indexOf(n);
export const letra = (n) => {
  let i = idx(n) + 1, s = '';
  while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = (i - r - 1) / 26; }
  return s;
};
const ULTIMA = letra(COLUMNAS[COLUMNAS.length - 1]);

// ── Autenticación ───────────────────────────────────────────────────────────

let cache = null;   // el token vale una hora: se reaprovecha entre invocaciones

function cuenta() {
  const bruto = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!bruto) throw new Error('GOOGLE_SERVICE_ACCOUNT sin configurar');
  const sa = JSON.parse(bruto);
  // Al pasar por variables de entorno los saltos de línea suelen llegar
  // escapados, y entonces la clave no parsea.
  sa.private_key = sa.private_key.replace(/\\n/g, '\n');
  return sa;
}

async function token() {
  if (cache && cache.caduca > Date.now() + 60e3) return cache.valor;
  const sa = cuenta();
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
  const ahora = Math.floor(Date.now() / 1000);
  const c = b64({ alg: 'RS256', typ: 'JWT' });
  const p = b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: sa.token_uri, iat: ahora, exp: ahora + 3600 });
  const f = crypto.sign('RSA-SHA256', Buffer.from(`${c}.${p}`), sa.private_key).toString('base64url');
  const r = await fetch(sa.token_uri, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${c}.${p}.${f}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('Google no dio token: ' + JSON.stringify(j).slice(0, 200));
  cache = { valor: j.access_token, caduca: Date.now() + (j.expires_in || 3600) * 1000 };
  return cache.valor;
}

async function api(ruta, opciones = {}) {
  const id = process.env.SHEET_ID;
  if (!id) throw new Error('SHEET_ID sin configurar');
  const t = await token();
  const ctrl = new AbortController();
  const reloj = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}${ruta}`, {
      ...opciones, signal: ctrl.signal,
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json', ...opciones.headers },
    });
    const j = await r.json();
    if (j.error) throw new Error(j.error.message);
    return j;
  } finally { clearTimeout(reloj); }
}

// ── Lectura y escritura ─────────────────────────────────────────────────────

// ── Fechas ──────────────────────────────────────────────────────────────────
//
// Sheets guarda las fechas como número de serie: días desde el 30/12/1899, en
// la zona horaria del documento (aquí Europe/Madrid). Ni se puede pasar a
// new Date() —lo leería como milisegundos y daría 1970— ni conviene escribir
// texto tipo "14/09/2026", porque entonces depende del idioma de la hoja y,
// si no lo reconoce, entra como texto y las fórmulas del panel cuentan cero.
//
// Así que se escribe y se lee el número directamente. Es lo único que no
// cambia según quién abra la hoja.

const ZONA = 'Europe/Madrid';
const EPOCA = Date.UTC(1899, 11, 30);
const DIA = 86400000;

const PARTES = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONA, hour12: false,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});

/** Qué hora marca un reloj de Madrid en este instante, como marca de tiempo. */
function relojLocal(fecha) {
  const p = Object.fromEntries(PARTES.formatToParts(fecha)
    .filter((x) => x.type !== 'literal').map((x) => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
}

/** Date → número de serie de Sheets. */
export function aSerie(valor) {
  const d = valor ? new Date(valor) : new Date();
  const f = isNaN(d) ? new Date() : d;
  return (relojLocal(f) - EPOCA) / DIA;
}

/** Número de serie → ISO. Se corrige el desfase en dos pasadas porque el
 *  huso de Madrid cambia con el horario de verano. */
export function deSerie(serie) {
  const local = EPOCA + Number(serie) * DIA;
  let utc = local;
  for (let i = 0; i < 2; i++) utc = local - (relojLocal(new Date(utc)) - utc);
  return new Date(utc).toISOString();
}

const aFecha = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  if (typeof v === 'number') return deSerie(v);
  const d = new Date(v);
  return isNaN(d) ? String(v) : d.toISOString();
};

/** Devuelve los leads, el último arriba. */
export async function listar() {
  const j = await api(`/values/Leads!A2:${ULTIMA}?valueRenderOption=UNFORMATTED_VALUE`);
  const filas = j.values || [];
  const fuera = new Set(['ip', 'user_agent', 'fbclid', 'sla_avisado', 'email_enviado']);
  return filas.map((fila, i) => {
    const o = { _fila: i + 2 };
    COLUMNAS.forEach((c, k) => {
      if (fuera.has(c)) return;
      o[c] = /^(fecha|primer_contacto|fecha_cierre|fecha_proxima)$/.test(c)
        ? aFecha(fila[k]) : (fila[k] ?? '');
    });
    return o;
  }).reverse();
}

/** Añade un lead. Devuelve el lead_id con el que quedó guardado. */
export async function anadir(lead) {
  const id = lead.lead_id || `web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const datos = { ...lead, lead_id: id,
    telefono: telefonoE164(lead.telefono) || lead.telefono || '',
    estado: 'Nuevo',
    proxima_accion: primeraAccion(lead),
    fecha_proxima: hoy() + diasDeEspera(lead),
    fecha: aSerie(lead.fecha) };
  const fila = COLUMNAS.map((c) => (datos[c] === undefined || datos[c] === null ? '' : datos[c]));
  // Sin insertDataOption=INSERT_ROWS: escribir en la primera fila libre en vez
  // de insertar una nueva evita que Sheets recoloque las referencias del panel.
  await api(`/values/Leads!A:${ULTIMA}:append?valueInputOption=RAW`,
    { method: 'POST', body: JSON.stringify({ values: [fila] }) });
  return id;
}

const EDITABLES = new Set(['estado', 'responsable', 'proxima_accion', 'fecha_proxima',
  'importe', 'motivo_perdida', 'notas', 'telefono', 'email']);

/** Actualiza un lead buscándolo por lead_id, nunca por número de fila. */
export async function actualizar(leadId, campos) {
  const j = await api(`/values/Leads!${letra('lead_id')}2:${letra('lead_id')}`);
  const ids = (j.values || []).map((f) => String(f[0] || ''));
  const i = ids.indexOf(String(leadId));
  if (i < 0) return { ok: false, error: 'lead_no_encontrado' };
  const fila = i + 2;

  // Todo lo que entra aquí queda ya en el formato en el que se escribe: los
  // importes como número y las fechas como serie. Convertir después, al
  // escribir, hacía que las fechas que pone el propio código —que ya son
  // series— se convirtieran dos veces y acabaran en 1970.
  const ES_FECHA = /^(fecha_proxima|primer_contacto|fecha_cierre)$/;
  const datos = {};
  for (const [c, v] of Object.entries(campos)) {
    if (!EDITABLES.has(c)) continue;
    if (c === 'estado' && !ESTADOS.includes(v)) continue;
    if (c === 'importe') datos[c] = numero(v);
    else if (ES_FECHA.test(c)) datos[c] = v ? aSerie(v) : '';
    else datos[c] = v ?? '';
  }

  // Lo que en un CRM de pago pasa al arrastrar la tarjeta de columna
  if (datos.estado) {
    const actual = await api(`/values/Leads!A${fila}:${ULTIMA}${fila}`);
    const previo = (actual.values || [[]])[0];
    const val = (c) => previo[idx(c)] || '';
    if (datos.estado !== 'Nuevo' && !val('primer_contacto')) datos.primer_contacto = ahora();
    if (CERRADOS.includes(datos.estado)) {
      if (!val('fecha_cierre')) datos.fecha_cierre = hoy();
      datos.proxima_accion = '';
      datos.fecha_proxima = '';
    }
  }

  const rangos = Object.entries(datos).map(([c, v]) => ({
    range: `Leads!${letra(c)}${fila}`, values: [[v]] }));
  if (rangos.length) {
    await api('/values:batchUpdate', { method: 'POST',
      body: JSON.stringify({ valueInputOption: 'RAW', data: rangos }) });
  }
  return { ok: true, lead_id: leadId, campos: datos };
}

/**
 * Deja el teléfono en formato internacional, que es el único que entiende
 * wa.me. La gente escribe «636142591», «0034 628 947 648» o «+34 600 00 00 00»
 * y los tres tienen que acabar igual.
 *
 * Se normaliza al guardar y no solo al pintar el botón: así el número queda
 * bien en la hoja, en el correo, en el CRM y en cualquier sitio que venga
 * después, sin repetir esta lógica en cada uno.
 */
export function telefonoE164(valor) {
  let d = String(valor || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);          // 0034… → 34…
  // Nueve cifras es un número español sin prefijo. Con más, o ya lo trae o es
  // de otro país, y ahí no hay que tocar nada.
  if (d.length === 9 && /^[6789]/.test(d)) d = '34' + d;
  return d.length >= 8 && d.length <= 15 ? d : '';
}

// ── Utilidades ──────────────────────────────────────────────────────────────

const ahora = () => aSerie(new Date());
// La próxima acción se fija a hoy, sin hora: es una fecha de agenda.
const hoy = () => Math.floor(aSerie(new Date()));

/**
 * Un importe escrito a mano puede llegar como "4.800 €", "4800", "4.800,50"
 * o "4,800.50". En español el punto agrupa los miles, así que limpiarlo con
 * un replace(',', '.') convierte 4.800 € en 4,8 €: el CRM se queda con el
 * 0,1 % del pipeline y nadie se da cuenta hasta fin de mes.
 *
 * La regla que desambigua: manda el último separador que aparezca, y solo es
 * decimal si le siguen una o dos cifras.
 */
function numero(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : '';
  let t = String(v).replace(/[^\d.,-]/g, '');
  if (!t) return '';
  const ultimo = Math.max(t.lastIndexOf('.'), t.lastIndexOf(','));
  if (ultimo >= 0) {
    const decimales = t.length - ultimo - 1;
    const entero = t.slice(0, ultimo).replace(/[.,]/g, '');
    t = decimales >= 1 && decimales <= 2
      ? `${entero}.${t.slice(ultimo + 1)}`
      : entero + t.slice(ultimo + 1);
  }
  const n = Number(t);
  return Number.isFinite(n) && n !== 0 ? n : '';
}

/**
 * Cuándo toca mirarlo. Un frío que se ha descargado la guía no se llama hoy:
 * si entra en la lista de hoy con todo lo demás, la lista deja de significar
 * «esto hay que hacerlo» y se convierte en «esto ha entrado».
 */
function diasDeEspera(lead) {
  if (lead.tier === 'HOT' || lead.tier === 'WARM') return 0;
  return lead.origen === 'guia' ? 7 : 1;
}

/** El CRM no sirve si al abrirlo hay que decidir qué hacer. */
function primeraAccion(lead) {
  if (lead.tier === 'HOT') return 'WhatsApp hoy + proponer visita al taller';
  if (lead.tier === 'WARM') return 'WhatsApp con 2 proyectos parecidos';
  if (lead.origen === 'guia') return 'Dejar madurar. Revisar en 7 días.';
  return 'WhatsApp para entender el proyecto';
}
