#!/usr/bin/env node
// Informe semanal para el estudio: saca las métricas reales de Smartlead y las deja
// listas para enviar. Mide lo que mueve el juego, no lo que infla el informe.
//
//   node pipeline/report.mjs --campaigns 3974838,3974839 --out ./out
//
// Variables: SMARTLEAD_API_KEY. Opcional NOTION_API_KEY + NOTION_REPORT_DB para archivar.

import { writeFileSync, mkdirSync } from 'node:fs';
import { retry, notionCreate, P } from './lib.mjs';

const SL = 'https://server.smartlead.ai/api/v1';
const key = process.env.SMARTLEAD_API_KEY;
if (!key) { console.error('Falta SMARTLEAD_API_KEY'); process.exit(1); }

const arg = (n, d) => {
  const i = process.argv.findIndex((a) => a === `--${n}` || a.startsWith(`--${n}=`));
  if (i === -1) return d;
  const a = process.argv[i];
  if (a.includes('=')) return a.split('=').slice(1).join('=');
  const nx = process.argv[i + 1];
  return nx && !nx.startsWith('--') ? nx : true;
};
const ids = String(arg('campaigns', '')).split(',').filter(Boolean);
const outDir = String(arg('out', './out'));
mkdirSync(outDir, { recursive: true });
const get = (p) => retry(() => fetch(`${SL}${p}${p.includes('?') ? '&' : '?'}api_key=${key}`).then((r) => r.json()));

const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)} %` : '—');
const totals = { sent: 0, replies: 0, bounces: 0, unsub: 0, leads: 0 };
const perCampaign = [];

for (const id of ids) {
  const [c, s] = await Promise.all([get(`/campaigns/${id}`), get(`/campaigns/${id}/analytics`)]);
  const row = {
    id, nombre: c.name, estado: c.status,
    leads: +(s.campaign_lead_stats?.total ?? s.total_count ?? 0),
    enviados: +(s.sent_count ?? 0),
    respuestas: +(s.reply_count ?? 0),
    rebotes: +(s.bounce_count ?? 0),
    bajas: +(s.unsubscribed_count ?? 0),
  };
  perCampaign.push(row);
  totals.sent += row.enviados; totals.replies += row.respuestas;
  totals.bounces += row.rebotes; totals.unsub += row.bajas; totals.leads += row.leads;
}

// Respuestas reales, con el texto, para que el estudio vea qué dice la gente.
const replies = [];
for (const id of ids) {
  const r = await get(`/campaigns/${id}/statistics?limit=200&offset=0`);
  for (const x of r.data || []) {
    if (x.reply_time || x.is_replied) replies.push({ campaña: id, creador: x.lead_name || x.lead_email, email: x.lead_email, cuando: (x.reply_time || '').slice(0, 16) });
  }
}

const hoy = new Date().toISOString().slice(0, 10);
const md = `# Don't Kill Rumble · informe de creadores
**${hoy}**

## Lo que importa

| | |
|---|---|
| Creadores contactados | ${totals.sent} |
| Respuestas | ${totals.replies} |
| **Tasa de respuesta** | **${pct(totals.replies, totals.sent)}** |
| Rebotes | ${totals.bounces} (${pct(totals.bounces, totals.sent)}) |
| Bajas | ${totals.unsub} |
| En cola por contactar | ${totals.leads - totals.sent} |

${totals.bounces / Math.max(1, totals.sent) > 0.03 ? '> Aviso: la tasa de rebote pasa del 3 %. Hay que revisar la lista antes de seguir enviando.\n' : ''}
## Por campaña

| Campaña | Estado | Contactados | Respuestas | Tasa |
|---|---|---|---|---|
${perCampaign.map((c) => `| ${c.nombre} | ${c.estado} | ${c.enviados} | ${c.respuestas} | ${pct(c.respuestas, c.enviados)} |`).join('\n')}

## Quién ha respondido

${replies.length ? replies.map((r) => `- **${r.creador}** · ${r.cuando}`).join('\n') : '_Todavía nadie._'}

## Lo que no medimos, y por qué

No hay tasa de apertura. El seguimiento de aperturas mete un píxel invisible en cada correo
que Gmail y Outlook detectan y penalizan, y con un buzón nuevo eso significa acabar en spam.
Preferimos llegar a la bandeja de entrada antes que saber quién abrió.

Lo que sí cuenta, y se añade a mano cada semana desde Steamworks y el calendario:
franjas reservadas, sesiones jugadas, vídeos y streams publicados, y wishlists por creador.

## Franjas, sesiones y contenido

_Rellenar desde el calendario de reservas y el informe UTM de Steamworks._

| Franjas reservadas | Sesiones jugadas | Piezas publicadas | Wishlists atribuidas |
|---|---|---|---|
| | | | |
`;

writeFileSync(`${outDir}/informe_${hoy}.md`, md);
console.log(md);
console.error(`\nInforme en ${outDir}/informe_${hoy}.md`);

const { NOTION_API_KEY: nk, NOTION_REPORT_DB: ndb } = process.env;
if (nk && ndb) {
  const r = await notionCreate(nk, ndb, {
    Semana: P.title(hoy), Contactados: P.num(totals.sent), Respuestas: P.num(totals.replies),
    'Tasa de respuesta': P.num(totals.sent ? +(totals.replies / totals.sent * 100).toFixed(1) : 0),
    Rebotes: P.num(totals.bounces), 'En cola': P.num(totals.leads - totals.sent),
  });
  console.error(r.object === 'page' ? 'Archivado en Notion' : 'Notion: ' + (r.message || 'error'));
}
