// Al Milímetro: base de datos propia (Postgres en Neon / Vercel Postgres, capa gratuita).
// Sin dependencias: habla con el endpoint HTTP de Neon («/sql») con fetch.
//
// Variables: AM_DATABASE_URL  postgres://usuario:clave@ep-xxxx.region.aws.neon.tech/basedatos
//            AM_DB_HTTP       (solo pruebas) URL del emulador local del endpoint /sql
//
// Truco para no depender de cómo el endpoint devuelve los tipos: toda consulta que lee
// devuelve UNA columna «j» con row_to_json(...), y aquí se convierte con JSON.parse.

const ESQUEMA = [
  `CREATE EXTENSION IF NOT EXISTS pgcrypto`,
  `CREATE TABLE IF NOT EXISTS am_leads (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     creado timestamptz NOT NULL DEFAULT now(),
     nombre text NOT NULL, telefono text NOT NULL, email text,
     prueba boolean NOT NULL DEFAULT false,
     tipo text, cp text, mun text, m2 text, cuando text, ppto text, propia text, inst text, frase text,
     origen text NOT NULL DEFAULT 'web', municipio_anuncio text, utm jsonb,
     clase text NOT NULL, puntos int NOT NULL, motivos text[], revision boolean NOT NULL DEFAULT false,
     etapa text NOT NULL DEFAULT 'nuevo', etapa_cambio timestamptz NOT NULL DEFAULT now(),
     contesto boolean NOT NULL DEFAULT false, baja boolean NOT NULL DEFAULT false, motivo_perdido text)`,
  `CREATE TABLE IF NOT EXISTS am_envios (
     id bigserial PRIMARY KEY,
     lead_id uuid NOT NULL REFERENCES am_leads(id) ON DELETE CASCADE,
     paso text NOT NULL, canal text NOT NULL, programado timestamptz NOT NULL,
     estado text NOT NULL DEFAULT 'pendiente', hecho timestamptz, detalle text,
     UNIQUE (lead_id, paso))`,
  `CREATE TABLE IF NOT EXISTS am_eventos (
     id bigserial PRIMARY KEY, lead_id uuid, t timestamptz NOT NULL DEFAULT now(), tipo text NOT NULL, detalle jsonb)`,
  `CREATE INDEX IF NOT EXISTS am_envios_pend ON am_envios (estado, programado)`,
  // Fecha y hora de la visita técnica (botón «Visita agendada»): de ella sale el recordatorio W8
  `ALTER TABLE am_leads ADD COLUMN IF NOT EXISTS cita timestamptz`
];

let listo = null;

function destino() {
  const url = process.env.AM_DATABASE_URL;
  if (!url) return null;
  if (process.env.AM_DB_HTTP) return { http: process.env.AM_DB_HTTP, url: url };
  const host = new URL(url).hostname;
  return { http: 'https://' + host + '/sql', url: url };
}

// Igual que el driver de Neon: todos los parámetros viajan como texto (arrays en formato de Postgres)
function texto(v) {
  if (v === null || v === undefined) return null;
  if (Array.isArray(v)) return '{' + v.map(function (x) { return x === null ? 'NULL' : '"' + String(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }).join(',') + '}';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

async function sql(query, params) {
  const d = destino();
  if (!d) throw new Error('Falta AM_DATABASE_URL');
  const r = await fetch(d.http, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Neon-Connection-String': d.url, 'Neon-Raw-Text-Output': 'true', 'Neon-Array-Mode': 'false' },
    body: JSON.stringify({ query: query, params: (params || []).map(texto) })
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('BD ' + r.status + ' ' + txt.slice(0, 300));
  const out = txt ? JSON.parse(txt) : {};
  return (out.rows || []).map(function (row) {
    if (row && row.j !== undefined) return typeof row.j === 'string' ? JSON.parse(row.j) : row.j;
    return row;
  });
}

async function asegurar() {
  if (!listo) listo = (async function () { for (const q of ESQUEMA) await sql(q); })().catch(function (e) { listo = null; throw e; });
  return listo;
}

async function evento(leadId, tipo, detalle) {
  try { await sql('INSERT INTO am_eventos (lead_id, tipo, detalle) VALUES ($1, $2, $3)', [leadId, tipo, JSON.stringify(detalle || {})]); }
  catch (e) { console.error('[am-db] evento no guardado', tipo, e.message); }
}

module.exports = { sql: sql, asegurar: asegurar, evento: evento, configurada: function () { return !!destino(); }, ESQUEMA: ESQUEMA };
