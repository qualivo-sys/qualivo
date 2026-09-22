/** Trabajador en segundo plano (hasta 15 min en Netlify): pasada completa del motor de columnas.
 *  Lo invoca la función programada; también a mano: /.netlify/functions/sync-worker-background?key=<DASHBOARD_PASSWORD> */
import { runSync } from './_lib/sync.mjs';
export default async (req) => {
  const u = new URL(req.url);
  const key = u.searchParams.get('key') || req.headers.get('x-sync-key') || '';
  if (!process.env.DASHBOARD_PASSWORD || key !== process.env.DASHBOARD_PASSWORD) return new Response('unauthorized', { status: 401 });
  const apply = process.env.SYNC_APPLY !== '0';
  const res = await runSync({ apply, max: Number(u.searchParams.get('max') || 1500), budgetMs: Number(u.searchParams.get('budget') || 240000), concurrency: 6 });
  console.log('sync-worker', JSON.stringify(res));
  return new Response(JSON.stringify(res), { headers: { 'content-type': 'application/json' } });
};
