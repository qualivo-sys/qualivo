/** Función programada (cada 20 min). Delega en el trabajador en segundo plano (sin límite de 10 s) con un
 *  presupuesto corto: cada 5 min con 4 min de presupuesto agotó las 100 h/mes de funciones de Netlify (usage_exceeded).
 *  si no conoce la URL del sitio, hace una pasada corta inline. */
import { runSync } from './_lib/sync.mjs';
export const config = { schedule: '*/20 * * * *' };
export default async () => {
  if (!process.env.GHL_TOKEN || !process.env.GHL_LOCATION_ID) return new Response('sin credenciales', { status: 500 });
  const apply = process.env.SYNC_APPLY !== '0';
  const site = process.env.URL, key = process.env.DASHBOARD_PASSWORD;
  if (site && key) {
    try {
      const r = await fetch(`${site}/.netlify/functions/sync-worker-background?key=${encodeURIComponent(key)}&budget=${process.env.SYNC_WORKER_BUDGET_MS || 60000}&max=${process.env.SYNC_WORKER_MAX || 300}`);
      console.log('sync-stages -> worker', r.status);
      return new Response(JSON.stringify({ delegated: true, status: r.status }), { headers: { 'content-type': 'application/json' } });
    } catch (e) { console.error('worker no disponible', String(e).slice(0, 120)); }
  }
  const res = await runSync({ apply, max: Number(process.env.SYNC_MAX || 60), budgetMs: Number(process.env.SYNC_BUDGET_MS || 8500) });
  console.log('sync-stages', JSON.stringify(res));
  return new Response(JSON.stringify(res), { headers: { 'content-type': 'application/json' } });
};
