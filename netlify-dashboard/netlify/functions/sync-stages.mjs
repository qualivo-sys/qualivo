/** Función programada (cada 5 min). Alterna: pasada incremental (contactos actualizados en 48 h) y una rebanada del histórico. */
import { runSync, runBacklog, BACKLOG_SLICES } from './_lib/sync.mjs';
export const config = { schedule: '*/5 * * * *' };
export default async () => {
  if (!process.env.GHL_TOKEN || !process.env.GHL_LOCATION_ID) return new Response('sin credenciales', { status: 500 });
  const apply = process.env.SYNC_APPLY !== '0';   // activo por defecto; SYNC_APPLY=0 para solo simular
  const n = Math.floor(Date.now() / 300000);
  const res = (n % 2 === 0)
    ? await runSync({ apply, max: Number(process.env.SYNC_MAX || 25), hours: Number(process.env.SYNC_HOURS || 48) })
    : await runBacklog({ apply, max: Number(process.env.SYNC_BACKLOG_MAX || 40), slice: Math.floor(n / 2) % BACKLOG_SLICES.length });
  console.log('sync-stages', JSON.stringify(res));
  return new Response(JSON.stringify(res), { headers: { 'content-type': 'application/json' } });
};
