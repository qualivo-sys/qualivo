#!/usr/bin/env node
// Pone la misma plantilla de UTM en todos los anuncios de Meta con destino web.
// Un creativo es inmutable: hay que clonar con las UTM nuevas y reasignarlo.
// Uso:  node scripts/meta-utm.mjs --dry     (solo lista)
//       node scripts/meta-utm.mjs           (aplica)
//       node scripts/meta-utm.mjs --filtro EAC_TCP
import { meta, env } from './lib.mjs';

const DRY    = process.argv.includes('--dry');
const FILTRO = (process.argv.find(a => a.startsWith('--filtro=')) || '').split('=')[1]
            || (process.argv[process.argv.indexOf('--filtro') + 1] || '');

const TAGS = 'utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}'
           + '&utm_content={{ad.name}}&utm_term={{adset.name}}'
           + '&utm_id={{campaign.id}}&utm_placement={{placement}}';

const PAGE = env('META_PAGE');
const IG   = process.env.META_IG;

const ads = await meta.all(`${env('META_ACT')}/ads`,
  'name,effective_status,adset{name,destination_type},campaign{name},creative{id}');

const objetivo = ads.filter(a =>
  ['ACTIVE', 'PAUSED'].includes(a.effective_status) &&
  a.adset?.destination_type !== 'ON_AD' &&
  (!FILTRO || a.name.includes(FILTRO) || a.campaign?.name?.includes(FILTRO)));

console.log(`${objetivo.length} anuncios con destino web${FILTRO ? ` que casan con "${FILTRO}"` : ''}\n`);

for (const a of objetivo) {
  const c = await meta.get(`${a.creative.id}?fields=object_story_spec,asset_feed_spec,degrees_of_freedom_spec,url_tags`);
  if (/utm_content/.test(c.url_tags || '')) { console.log(`ok    ${a.name.slice(0, 34).padEnd(36)} ya la tiene`); continue; }
  if (DRY) { console.log(`cambiaría  ${a.name.slice(0, 34).padEnd(36)} ${a.effective_status}`); continue; }

  const body = { name: `${a.name}_UTM_${Date.now().toString(36)}`, url_tags: TAGS,
                 degrees_of_freedom_spec: c.degrees_of_freedom_spec };   // NO mandar standard_enhancements

  if (c.asset_feed_spec) {
    const af = { ...c.asset_feed_spec };
    delete af.additional_data; delete af.reasons_to_shop; delete af.shops_bundle;  // la API los rechaza
    body.asset_feed_spec = af;
    body.object_story_spec = IG ? { page_id: PAGE, instagram_user_id: IG } : { page_id: PAGE };
  } else {
    body.object_story_spec = c.object_story_spec;
  }

  const cr = await meta.post(`${env('META_ACT')}/adcreatives`, body);
  if (!cr.id) { console.log(`❌    ${a.name.slice(0, 34).padEnd(36)} ${JSON.stringify(cr.error?.error_user_msg || cr).slice(0, 140)}`); continue; }
  const up = await meta.post(a.id, { creative: { creative_id: cr.id } });
  console.log(up.success ? `✅    ${a.name.slice(0, 34).padEnd(36)} ${a.creative.id} → ${cr.id}`
                         : `❌    ${a.name.slice(0, 34).padEnd(36)} ${JSON.stringify(up).slice(0, 140)}`);
}

if (DRY) console.log('\n(simulación: no se ha tocado nada)');
else console.log('\nLos anuncios quedan en PENDING_REVIEW unas horas. Es normal.');
