#!/usr/bin/env node
// Plantilla de seguimiento con UTM completas en las campañas activas de Google Ads.
// Uso: node scripts/gads-utm.mjs --dry   |   node scripts/gads-utm.mjs
import { gads } from './lib.mjs';

const DRY = process.argv.includes('--dry');
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);

const camps = await gads.query(`SELECT campaign.id, campaign.name, campaign.tracking_url_template
  FROM campaign WHERE campaign.status = 'ENABLED'`);

if (!camps.length) { console.log('No hay campañas activas.'); process.exit(0); }

for (const r of camps) {
  const c = r.campaign;
  const previo = c.trackingUrlTemplate || '';
  if (/utm_content/.test(previo)) { console.log(`ok    ${c.name.slice(0, 34).padEnd(36)} ya la tiene`); continue; }

  // conserva los parámetros hsa_* si venían de HubSpot: alimentan sus informes antiguos
  const hsa = (previo.match(/hsa_[a-z]+=\{?[^&]*\}?/g) || []).join('&');
  const tpl = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign=${slug(c.name)}`
            + `&utm_term={keyword}&utm_content={creative}&utm_id={campaignid}`
            + (hsa ? '&' + hsa : '');

  if (DRY) { console.log(`cambiaría  ${c.name.slice(0, 34).padEnd(36)}\n           ${tpl}`); continue; }

  const res = await gads.mutate('campaigns', [{
    updateMask: 'tracking_url_template',
    update: { resourceName: `customers/${process.env.GADS_CID}/campaigns/${c.id}`, trackingUrlTemplate: tpl },
  }]);
  console.log(res.ok ? `✅    ${c.name.slice(0, 34).padEnd(36)} plantilla actualizada`
                     : `❌    ${c.name.slice(0, 34).padEnd(36)} ${JSON.stringify(res.body).slice(0, 180)}`);
}

// Aviso: más de una acción primaria para el mismo formulario multiplica las conversiones
const acts = await gads.query(`SELECT conversion_action.name FROM conversion_action
  WHERE conversion_action.status='ENABLED' AND conversion_action.category='SUBMIT_LEAD_FORM'
  AND conversion_action.primary_for_goal=TRUE AND conversion_action.include_in_conversions_metric=TRUE`);
if (acts.length > 1) {
  console.log(`\n⚠  ${acts.length} acciones de conversión primarias para el mismo formulario:`);
  acts.forEach(a => console.log('   · ' + a.conversionAction.name));
  console.log('   Cada lead cuenta ' + acts.length + ' veces y el CPA objetivo puja con datos falsos.');
  console.log('   Deja una primaria y pasa las demás a secundarias.');
}

if (DRY) console.log('\n(simulación: no se ha tocado nada)');
