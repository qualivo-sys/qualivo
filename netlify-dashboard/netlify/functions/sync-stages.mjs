/** Función programada (cada 10 min): mantiene columna = etiqueta en el pipeline. Ventana: contactos actualizados en 48 h. */
import { runSync } from './_lib/sync.mjs';
export const config = { schedule: '*/10 * * * *' };
export default async () => {
  if (!process.env.GHL_TOKEN || !process.env.GHL_LOCATION_ID) return new Response('sin credenciales', { status: 500 });
  const apply = process.env.SYNC_APPLY === '1';   // por defecto solo simula (dry-run)
  const res = await runSync({ apply, max: Number(process.env.SYNC_MAX || 20), hours: Number(process.env.SYNC_HOURS || 48) });
  console.log('sync-stages', JSON.stringify(res));
  return new Response(JSON.stringify(res), { headers: { 'content-type': 'application/json' } });
};
