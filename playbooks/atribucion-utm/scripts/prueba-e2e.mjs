#!/usr/bin/env node
// Prueba de punta a punta: manda un lead con UTM inventadas, comprueba que
// llegan a los campos del CRM y borra el contacto de prueba.
// Uso: node scripts/prueba-e2e.mjs https://formulario.example.com/api/lead
import { ghl } from './lib.mjs';

const URL_FORM = process.argv[2];
if (!URL_FORM) { console.error('Uso: node scripts/prueba-e2e.mjs <url del endpoint del formulario>'); process.exit(1); }

const email = 'prueba.utm.playbook@example.com';
const utm = '?utm_source=meta&utm_medium=paid&utm_campaign=PRUEBA_CAMP'
          + '&utm_content=PRUEBA_AD&utm_term=PRUEBA_ADSET&fbclid=PRUEBA123';

const r = await fetch(URL_FORM, { method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Prueba UTM', email, telefono: '+34600000000',
                         url: 'https://ejemplo.test/pagina' + utm, utm }) });
console.log('respuesta del formulario:', JSON.stringify(await r.json()).slice(0, 200));

const cf = (await ghl.get(`locations/${ghl.loc}/customFields`)).customFields || [];
const inv = Object.fromEntries(cf.filter(f => /^contact\.(utm_|landing_url|click_id)/.test(f.fieldKey))
  .map(f => [f.id, f.fieldKey.replace('contact.', '')]));

let c = null;                                   // el índice de búsqueda tarda unos segundos
for (let i = 0; i < 6 && !c; i++) {
  await new Promise(s => setTimeout(s, 5000));
  const j = await ghl.get(`contacts/?locationId=${ghl.loc}&query=${encodeURIComponent(email)}`);
  c = (j.contacts || []).find(x => (x.email || '').toLowerCase() === email);
  process.stdout.write(c ? ' ✓\n' : '.');
}
if (!c) { console.log('\nEl contacto no aparece tras 30 s. Revisa el token y el locationId del formulario.'); process.exit(1); }

const puestos = (c.customFields || []).filter(f => inv[f.id]);
puestos.forEach(f => console.log('  ' + inv[f.id].padEnd(14) + '= ' + String(f.value).slice(0, 70)));
console.log(puestos.length >= 5 ? '\n✅ la atribución llega completa' : '\n⚠ llegan solo ' + puestos.length + ' campos');

const d = await fetch(`https://services.leadconnectorhq.com/contacts/${c.id}`, { method: 'DELETE', headers: ghl.headers() });
console.log('contacto de prueba borrado:', d.status);
