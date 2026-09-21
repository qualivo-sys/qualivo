/**
 * sync.mjs — Motor "etiqueta → columna" para el pipeline de Eleva (GoHighLevel).
 * Aplica las 8 reglas del proceso comercial de forma SEGURA:
 *  - nunca toca "Alumna matriculada" ni "Baja" (salvo la propia regla de baja/venta),
 *  - nunca retrocede un trato que ya avanzó (agendada/entrevistado) por una etiqueta antigua,
 *  - reconoce las etiquetas que usa el equipo de verdad (entrevista-realizada, entrevistada…)
 *    además de las del documento (entrevistado, venta, baja…).
 * Vale como respaldo continuo de los workflows de GHL y para recolocar el histórico.
 */
const GHL = 'https://services.leadconnectorhq.com';
const H = () => ({ Authorization: `Bearer ${process.env.GHL_TOKEN}`, Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'qualivo-sync/1.0' });
async function api(method, path, body) {
  const r = await fetch(path.startsWith('http') ? path : GHL + path, { method, headers: H(), body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`GHL ${r.status} ${method} ${path}: ${(await r.text()).slice(0, 160)}`);
  return r.json();
}

const ACTIVE = { 'Nuevo lead (IA)': 1, 'Leads manual': 1, 'Lead manual': 1, 'Llamada agendada': 2, 'Entrevistado': 3, 'Alumna matriculada': 4 };
const NOINT = new Set(['no interesa precio', 'no interesa presencial', 'no interesa otro momento', 'no interesa en otro momento', 'no interesa matrícula en otro centro', 'calligence: no interesado']);
const INV = new Set(['inválido', 'inválido gratis', 'inválido no corresponde', 'inválido no existe', 'inválido no info', 'invalid-wa', 'calligence: inválido']);
const ENTREV = new Set(['entrevistado', 'entrevistada', 'entrevista-realizada']);
const AGEND = new Set(['calligence: éxito', 'llamada-agendada']);

/** Columna destino según etiquetas y columna actual. null = no tocar. */
export function target(tags, cur) {
  const t = new Set((tags || []).map((x) => String(x).toLowerCase()));
  const lvl = ACTIVE[cur] || 0;                       // 0 = columna inactiva
  const has = (s) => [...s].some((x) => t.has(x));
  if (t.has('baja')) return cur === 'Baja' ? null : 'Baja';
  if (cur === 'Baja') return null;
  if (t.has('venta') || t.has('alumna-activa')) return cur === 'Alumna matriculada' ? null : 'Alumna matriculada';
  if (cur === 'Alumna matriculada') return null;
  if (has(NOINT)) return cur === 'No interesa' ? null : 'No interesa';
  if (cur === 'No interesa') return null;
  if (t.has('entrevista nula') && lvl <= 2) return cur === 'Entrev. nula' ? null : 'Entrev. nula';
  if (has(ENTREV) && lvl <= 2) return cur === 'Entrevistado' ? null : 'Entrevistado';
  if (has(AGEND) && lvl <= 1) return cur === 'Llamada agendada' ? null : 'Llamada agendada';
  if (has(INV) && lvl <= 1) return cur === 'Inválido' ? null : 'Inválido';
  if (t.has('ilocalizable') && lvl <= 1) return cur === 'Ilocalizable' ? null : 'Ilocalizable';
  return null;
}

/**
 * Ejecuta una pasada. opts: { apply (bool), max (nº máx. de movimientos), hours (solo contactos
 * actualizados en las últimas N horas; 0 = todos) }. Devuelve resumen.
 */
export async function runSync(opts = {}) {
  const apply = opts.apply !== false, max = opts.max || 20, hours = opts.hours ?? 48;
  const loc = process.env.GHL_LOCATION_ID;
  const pipe = (await api('GET', `/opportunities/pipelines?locationId=${loc}`)).pipelines[0];
  const name2id = {}, id2name = {}; pipe.stages.forEach((s) => { name2id[s.name] = s.id; id2name[s.id] = s.name; });

  // Contactos (con etiquetas). Incremental por fecha de actualización si hours > 0.
  const since = hours > 0 ? new Date(Date.now() - hours * 3600e3).toISOString() : null;
  const tags = {}; let page = 1;
  for (;;) {
    const body = { locationId: loc, pageLimit: 100, page };
    if (since) body.filters = [{ field: 'dateUpdated', operator: 'range', value: { gte: since } }];
    const d = await api('POST', '/contacts/search', body);
    const cs = d.contacts || [];
    cs.forEach((c) => { tags[c.id] = c.tags || []; });
    if (cs.length < 100 || page >= 60) break;
    page++;
  }
  // Oportunidades del pipeline.
  let url = `${GHL}/opportunities/search?location_id=${loc}&pipeline_id=${pipe.id}&limit=100`; const opps = []; let guard = 0;
  while (url && guard < 400) { const d = await api('GET', url); opps.push(...(d.opportunities || [])); url = (d.meta && d.meta.nextPageUrl) || null; guard++; }

  const moves = []; const counts = {};
  for (const o of opps) {
    if (!(o.contactId in tags)) continue;                     // fuera de la ventana incremental
    const cur = id2name[o.pipelineStageId] || '?';
    const to = target(tags[o.contactId], cur);
    if (!to || !name2id[to]) continue;
    moves.push({ id: o.id, name: o.name, from: cur, to });
    counts[`${cur} → ${to}`] = (counts[`${cur} → ${to}`] || 0) + 1;
  }
  let done = 0, errors = 0;
  if (apply) {
    for (const m of moves.slice(0, max)) {
      try { await api('PUT', `/opportunities/${m.id}`, { pipelineStageId: name2id[m.to] }); done++; }
      catch (e) { errors++; console.error('sync move error', m.id, String(e).slice(0, 120)); }
      await new Promise((r) => setTimeout(r, 60));           // respeta el rate limit de GHL
    }
  }
  return { at: new Date().toISOString(), apply, hours, scanned: opps.length, pending: moves.length, applied: done, errors, remaining: Math.max(0, moves.length - done), counts };
}
