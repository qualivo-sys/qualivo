/** Función programada (cada 5 min): recoloca tratos cuya columna no coincide con sus etiquetas. */
import { runSync } from './_lib/sync.mjs';
export const config = { schedule: '*/5 * * * *' };
export default async () => {
  if (!process.env.GHL_TOKEN || !process.env.GHL_LOCATION_ID) return new Response('sin credenciales', { status: 500 });
  const apply = process.env.SYNC_APPLY !== '0';   // activo por defecto; SYNC_APPLY=0 para solo simular
  const res = await runSync({ apply, max: Number(process.env.SYNC_MAX || 60), budgetMs: Number(process.env.SYNC_BUDGET_MS || 8500) });
  console.log('sync-stages', JSON.stringify(res));
  return new Response(JSON.stringify(res), { headers: { 'content-type': 'application/json' } });
};
