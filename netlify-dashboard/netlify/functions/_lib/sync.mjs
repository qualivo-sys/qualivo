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
 * Ejecuta una pasada sobre las oportunidades del pipeline (las etiquetas vienen embebidas en
 * opportunity.contact.tags: no hace falta consultar contactos). opts: { apply, max, stage, budgetMs }.
 */
export async function runSync(opts = {}) {
  const apply = opts.apply !== false, max = opts.max || 60;
  const t0 = Date.now(), budget = opts.budgetMs || 8500; const left = () => Date.now() - t0 < budget;
  const loc = process.env.GHL_LOCATION_ID;
  const pipe = (await api('GET', `/opportunities/pipelines?locationId=${loc}`)).pipelines[0];
  const name2id = {}, id2name = {}; pipe.stages.forEach((s) => { name2id[s.name] = s.id; id2name[s.id] = s.name; });
  let url = `${GHL}/opportunities/search?location_id=${loc}&pipeline_id=${pipe.id}&limit=100`;
  if (opts.stage && name2id[opts.stage]) url += `&pipeline_stage_id=${name2id[opts.stage]}`;
  const opps = []; let guard = 0;
  while (url && guard < 400 && left()) { const d = await api('GET', url); opps.push(...(d.opportunities || [])); url = (d.meta && d.meta.nextPageUrl) || null; guard++; }
  const moves = []; const counts = {};
  for (const o of opps) {
    const cur = id2name[o.pipelineStageId] || '?';
    const to = target((o.contact && o.contact.tags) || [], cur);
    if (!to || !name2id[to]) continue;
    moves.push({ id: o.id, name: o.name, from: cur, to });
    counts[`${cur} → ${to}`] = (counts[`${cur} → ${to}`] || 0) + 1;
  }
  let done = 0, errors = 0;
  if (apply) {
    // Escrituras en lotes pequeños en paralelo (respetando el rate limit de GHL) mientras quede presupuesto.
    const conc = opts.concurrency || 6; const todo = moves.slice(0, max);
    for (let i = 0; i < todo.length && left(); i += conc) {
      const batch = todo.slice(i, i + conc);
      const res = await Promise.allSettled(batch.map((m) => api('PUT', `/opportunities/${m.id}`, { pipelineStageId: name2id[m.to] })));
      res.forEach((r) => { if (r.status === 'fulfilled') done++; else { errors++; console.error('sync move error', String(r.reason).slice(0, 120)); } });
      await new Promise((r) => setTimeout(r, 120));
    }
  }
  return { at: new Date().toISOString(), ms: Date.now() - t0, apply, stage: opts.stage || 'todas', scanned: opps.length, pending: moves.length, applied: done, errors, remaining: Math.max(0, moves.length - done), counts };
}

/* ---------- Modo por columna (para pasadas manuales): mismas reglas, solo una etapa ---------- */
export const BACKLOG_SLICES = ['Nuevo lead (IA)', 'Leads manual', 'Ilocalizable', 'Llamada agendada', 'Entrevistado'];
export async function runBacklog(opts = {}) {
  const idx = ((opts.slice ?? 0) % BACKLOG_SLICES.length + BACKLOG_SLICES.length) % BACKLOG_SLICES.length;
  return runSync({ ...opts, stage: BACKLOG_SLICES[idx] });
}
