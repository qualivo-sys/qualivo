// Al Milímetro: acceso a su Postgres propio (Neon) por HTTP, sin dependencias.
// El repo no tiene package.json: como el resto de api/, todo va con fetch.
//
// Variables (las pone Maikel o Growth en Vercel; nunca en el repo):
//   AM_DATABASE_URL   postgres://usuario:clave@ep-xxx.region.aws.neon.tech/neondb
//   AM_DB_HTTP        (opcional) endpoint SQL por HTTP. Por defecto https://<host>/sql,
//                     el que usa el driver serverless de Neon. VERIFICAR con la primera
//                     consulta real; si falla, ponerlo a mano aquí.
//
// Esquema: scripts/al-milimetro/flujos-integracion.md (am_leads, am_eventos y el índice
// único am_eventos_paso, que es el candado contra envíos dobles).

async function consulta(sql, params) {
  const url = process.env.AM_DATABASE_URL;
  if (!url) throw new Error('Falta AM_DATABASE_URL');
  const ep = process.env.AM_DB_HTTP || 'https://' + new URL(url).hostname + '/sql';
  const r = await fetch(ep, {
    method: 'POST',
    headers: { 'Neon-Connection-String': url, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql, params: params || [] })
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('DB ' + r.status + ' ' + txt.slice(0, 300));
  return (JSON.parse(txt).rows) || [];
}

const ms = (v) => (v == null ? null : new Date(v).getTime());

// Leads con algo pendiente: sin stop/ganado/perdido. soloPrueba: solo los de prueba.
async function leadsActivos(soloPrueba, q) {
  q = q || consulta;
  const leads = await q(
    `select l.* from am_leads l
      where ($1::boolean is false or l.prueba)
        and not exists (select 1 from am_eventos e where e.lead_id = l.id and e.tipo in ('stop','ganado','perdido'))
      order by l.creado limit 500`, [!!soloPrueba]);
  if (!leads.length) return [];
  const ev = await q('select lead_id, tipo, clave, en from am_eventos where lead_id = any($1::text[])', [leads.map((l) => l.id)]);
  const por = {};
  ev.forEach((e) => { (por[e.lead_id] = por[e.lead_id] || []).push({ tipo: e.tipo, clave: e.clave, en: ms(e.en) }); });
  return leads.map((l) => Object.assign({}, l, { creado: ms(l.creado), cita: ms(l.cita), eventos: por[l.id] || [] }));
}

// Reserva un paso antes de enviarlo. Devuelve false si otra vuelta ya lo cogió.
async function reservar(leadId, clave, datos, q) {
  q = q || consulta;
  const r = await q(
    `insert into am_eventos (lead_id, tipo, clave, datos) values ($1, 'enviado', $2, $3::jsonb)
     on conflict (lead_id, clave) where tipo = 'enviado' do nothing returning lead_id`,
    [leadId, clave, JSON.stringify(datos || {})]);
  return r.length === 1;
}

// Si el envío falla, se suelta la reserva para reintentarlo en la vuelta siguiente
// (y a las 36 h caduca solo; ver _am-flujos.js).
async function soltar(leadId, clave, q) {
  q = q || consulta;
  await q(`delete from am_eventos where lead_id = $1 and tipo = 'enviado' and clave = $2`, [leadId, clave]);
}

async function apuntar(leadId, tipo, datos, q) {
  q = q || consulta;
  await q(`insert into am_eventos (lead_id, tipo, datos) values ($1, $2, $3::jsonb)`, [leadId, tipo, JSON.stringify(datos || {})]);
}

async function ponerCita(leadId, citaIso, q) {
  q = q || consulta;
  await q('update am_leads set cita = $2 where id = $1', [leadId, citaIso]);
}

module.exports = { consulta, leadsActivos, reservar, soltar, apuntar, ponerCita };
