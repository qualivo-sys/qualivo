/** Pasada manual (HTTP, protegida): /.netlify/functions/sync-stages-run?pw=...&full=1[&apply=1][&max=150] */
import { runSync } from './_lib/sync.mjs';
export default async (req) => {
  const u = new URL(req.url);
  const pw = u.searchParams.get('pw') || req.headers.get('x-dash-pw') || '';
  if (!process.env.DASHBOARD_PASSWORD || pw !== process.env.DASHBOARD_PASSWORD) return new Response('{"error":"unauthorized"}', { status: 401, headers: { 'content-type': 'application/json' } });
  const res = await runSync({ apply: u.searchParams.get('apply') === '1', max: Number(u.searchParams.get('max') || 150), hours: u.searchParams.get('full') === '1' ? 0 : Number(u.searchParams.get('hours') || 48) });
  return new Response(JSON.stringify(res, null, 1), { headers: { 'content-type': 'application/json' } });
};
