/** Pasada manual (HTTP, protegida): /.netlify/functions/sync-stages-run?pw=...&full=1[&apply=1][&max=150] */
import { runSync, runBacklog } from './_lib/sync.mjs';
export default async (req) => {
  const u = new URL(req.url);
  const pw = u.searchParams.get('pw') || req.headers.get('x-dash-pw') || '';
  if (!process.env.DASHBOARD_PASSWORD || pw !== process.env.DASHBOARD_PASSWORD) return new Response('{"error":"unauthorized"}', { status: 401, headers: { 'content-type': 'application/json' } });
  const res = u.searchParams.get('backlog') === '1'
    ? await runBacklog({ apply: u.searchParams.get('apply') === '1', max: Number(u.searchParams.get('max') || 40), slice: Number(u.searchParams.get('slice') || 0) })
    : await runSync({ apply: u.searchParams.get('apply') === '1', max: Number(u.searchParams.get('max') || 150), budgetMs: Number(u.searchParams.get('budget') || 8500) });
  return new Response(JSON.stringify(res, null, 1), { headers: { 'content-type': 'application/json' } });
};
