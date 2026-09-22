#!/usr/bin/env node
// Diagnóstico de atribución en 10 minutos. Solo lee, no cambia nada.
// Uso: node scripts/diagnostico.mjs
import { meta, ghl, gads, dias, env } from './lib.mjs';

const t = (s) => console.log('\n\x1b[1m' + s + '\x1b[0m');
const ok = (s) => console.log('  ✓ ' + s);
const ko = (s) => console.log('  ✗ ' + s);

/* 1 · ¿El píxel recibe eventos HOY? ─────────────────────── */
t('1 · PÍXEL — eventos por día (los últimos 7)');
if (process.env.META_PIXEL) {
  const px = await meta.get(`${env('META_PIXEL')}/stats?aggregation=event&start_time=${dias(7)}&end_time=${dias(0)}`);
  const pd = {};
  for (const x of (px.data || [])) {
    const d = String(x.timestamp || x.start_time || '').slice(0, 10); if (!d) continue;
    pd[d] = pd[d] || {};
    for (const y of (x.data || [])) pd[d][y.value] = (pd[d][y.value] || 0) + (y.count || 0);
  }
  const ds = Object.keys(pd).sort();
  ds.forEach(d => console.log(`  ${d}  PageView ${String(pd[d].PageView || 0).padStart(5)}  Lead ${String(pd[d].Lead || 0).padStart(4)}`));
  const hoy = pd[ds.at(-1)] || {};
  if (!ds.length) ko('el píxel no devuelve nada: ¿existe? ¿el token lo ve?');
  else if (!hoy.Lead && hoy.PageView) ko('PageView vivo pero Lead a CERO — el evento de lead está roto');
  else ok('el píxel registra eventos');
} else console.log('  (sin META_PIXEL, me lo salto)');

/* 2 · ¿Qué anuncios llevan UTM? ──────────────────────────── */
t('2 · META — UTM por anuncio (solo los que van a la web)');
const ads = await meta.all(`${env('META_ACT')}/ads`,
  'name,effective_status,adset{destination_type},campaign{name},creative{url_tags}');
const activos = ads.filter(a => a.effective_status === 'ACTIVE');
const web = activos.filter(a => a.adset?.destination_type !== 'ON_AD');
const sinUtm = web.filter(a => !/utm_content/.test(a.creative?.url_tags || ''));
console.log(`  ${ads.length} anuncios en la cuenta · ${activos.length} ACTIVOS · ${web.length} activos con destino web`);
web.forEach(a => {
  const tags = a.creative?.url_tags || '';
  const v = k => (new RegExp(k + '=([^&]*)').exec(tags) || [, '—'])[1];
  console.log(`  ${/utm_content/.test(tags) ? '✓' : '✗'} ${String(a.name).slice(0, 30).padEnd(32)} source=${v('utm_source').padEnd(9)} content=${v('utm_content').slice(0, 22)}`);
});
sinUtm.length ? ko(`${sinUtm.length} anuncios ACTIVOS con destino web sin utm_content`) : ok('todos los activos con destino web llevan UTM completa');
const onAd = activos.length - web.length;
if (onAd) console.log(`  (${onAd} activos de formulario nativo: no aplican, no hay clic a la web)`);
// los pausados son archivo del cliente: se cuentan, no se listan ni se arreglan
const pausadosSinUtm = ads.filter(a => a.effective_status !== 'ACTIVE' && a.adset?.destination_type !== 'ON_AD'
  && !/utm_content/.test(a.creative?.url_tags || '')).length;
if (pausadosSinUtm) console.log(`  (${pausadosSinUtm} anuncios en pausa sin UTM: archivo antiguo, no se tocan)`);

/* 3 · ¿Qué guarda el CRM? ────────────────────────────────── */
t('3 · CRM — atribución de los últimos contactos');
// OJO: GET /contacts/ devuelve `attributions` (otra forma). La atribución con
// utmSource solo llega por POST /contacts/search.
const cs = (await ghl.post('contacts/search',
  { locationId: ghl.loc, pageLimit: 20, sort: [{ field: 'dateAdded', direction: 'desc' }] })).contacts || [];
let conUtm = 0;
cs.slice(0, 10).forEach(c => {
  const a = c.attributionSource || {};
  if (a.utmSource) conUtm++;
  console.log(`  ${(c.dateAdded || '').slice(0, 10)}  ${String(c.source || '—').slice(0, 22).padEnd(24)} utmSource=${String(a.utmSource || '—').padEnd(10)} campaign=${String(a.campaign || '—').slice(0, 30)}`);
});
conUtm ? ok(`${conUtm}/10 traen utmSource`) : ko('ninguno trae utmSource: o no hay UTM en los anuncios, o todos vienen de formulario nativo');

/* 4 · ¿Existen los campos? ───────────────────────────────── */
t('4 · CRM — campos personalizados de UTM');
const cf = (await ghl.get(`locations/${ghl.loc}/customFields`)).customFields || [];
const quiero = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_url', 'click_id'];
const faltan = quiero.filter(k => !cf.some(f => f.fieldKey === 'contact.' + k));
faltan.length ? ko('faltan: ' + faltan.join(', ') + '  → node scripts/ghl-campos.mjs') : ok('los 7 campos existen');

/* 5 · Google Ads: conversiones primarias ─────────────────── */
t('5 · GOOGLE ADS — acciones de conversión de lead');
if (process.env.GADS_CID) {
  const acts = await gads.query(`SELECT conversion_action.name, conversion_action.primary_for_goal,
    conversion_action.include_in_conversions_metric FROM conversion_action
    WHERE conversion_action.status='ENABLED' AND conversion_action.category='SUBMIT_LEAD_FORM'`);
  let primarias = 0;
  acts.forEach(r => {
    const a = r.conversionAction;
    const p = a.primaryForGoal && a.includeInConversionsMetric;
    if (p) primarias++;
    console.log(`  ${p ? '●' : '○'} ${String(a.name).slice(0, 58).padEnd(60)} primaria=${a.primaryForGoal} cuenta=${a.includeInConversionsMetric}`);
  });
  primarias > 1 ? ko(`${primarias} acciones primarias para el mismo formulario: cada lead cuenta ${primarias} veces`)
                : ok('una sola acción primaria');
  const camp = await gads.query(`SELECT campaign.name, campaign.tracking_url_template FROM campaign WHERE campaign.status='ENABLED'`);
  camp.forEach(r => {
    const tpl = r.campaign.trackingUrlTemplate || '';
    console.log(`  ${/utm_content/.test(tpl) ? '✓' : '✗'} ${String(r.campaign.name).slice(0, 34).padEnd(36)} ${tpl ? tpl.slice(0, 60) : '(sin plantilla)'}`);
  });
} else console.log('  (sin GADS_CID, me lo salto)');

console.log('\nListo. Lo marcado con ✗ es lo que hay que arreglar.\n');
