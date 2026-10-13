#!/usr/bin/env node
// Crea en GoHighLevel los 7 campos donde cae la atribución. Idempotente.
import { ghl } from './lib.mjs';

const QUIERO = [
  ['UTM Source',   'utm_source',   'Plataforma de origen: meta, google, tiktok, organico'],
  ['UTM Medium',   'utm_medium',   'paid, cpc, email, organic'],
  ['UTM Campaign', 'utm_campaign', 'Nombre de la campaña'],
  ['UTM Content',  'utm_content',  'Nombre del anuncio o creatividad'],
  ['UTM Term',     'utm_term',     'Conjunto de anuncios o palabra clave'],
  ['Landing URL',  'landing_url',  'Página donde dejó los datos'],
  ['Click ID',     'click_id',     'fbclid / gclid / ttclid'],
];

const ex = (await ghl.get(`locations/${ghl.loc}/customFields`)).customFields || [];
const ids = {};
for (const [name, key, ph] of QUIERO) {
  const f = ex.find(x => x.fieldKey === 'contact.' + key || x.name.toLowerCase() === name.toLowerCase());
  if (f) { ids[key] = f.id; console.log('ya existe  ' + name.padEnd(14) + f.id); continue; }
  const r = await ghl.post(`locations/${ghl.loc}/customFields`,
    { name, dataType: 'TEXT', placeholder: ph, model: 'contact' });
  if (r.customField?.id) { ids[key] = r.customField.id; console.log('✅ creado  ' + name.padEnd(14) + r.customField.id + '  ' + r.customField.fieldKey); }
  else console.log('❌ ' + name + ' → ' + JSON.stringify(r).slice(0, 200));
}
console.log('\nIDs para el backend del formulario:');
console.log(JSON.stringify(ids, null, 1));
