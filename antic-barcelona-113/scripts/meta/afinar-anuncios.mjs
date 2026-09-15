/**
 * Baja el frío de 6 anuncios a 4.
 *
 * Con 15 €/día y un CPM de 9-12 €, seis anuncios se reparten unas 250
 * impresiones diarias cada uno. Para decidir si una creatividad sirve hacen
 * falta del orden de 8.000-10.000 impresiones (unos 50-100 clics a un CTR
 * del 1 %): con seis no se llega en un mes, con cuatro se llega justo.
 *
 * Los cuatro que quedan mantienen el test entero: dos vídeos orgánicos contra
 * dos estáticos diseñados, y dos hacia la guía contra dos hacia el
 * cuestionario. Quitar más rompería la comparación.
 */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'config.json'), 'utf8'));
const estado = JSON.parse(fs.readFileSync(path.join(DIR, '.state.json'), 'utf8'));
const TOKEN = process.env.META_TOKEN;
if (!TOKEN) { console.error('Falta META_TOKEN'); process.exit(1); }

const api = async (nodo, campos) => {
  const r = await fetch(`https://graph.facebook.com/${cfg.cuenta.api_version}/${nodo}`,
    { method: 'POST', body: new URLSearchParams({ ...campos, access_token: TOKEN }) });
  const j = await r.json();
  if (j.error) throw new Error(`${nodo}: ${j.error.error_user_msg || j.error.message}`);
  return j;
};

const APAGAR = [
  ['3A | FRIO | 4x5 | v1',           'Se solapa con 2A: los dos llevan al cuestionario y 2A tiene el gancho más fuerte'],
  ['POST-OLMO | FRIO | Reel | v1',   'El tercer Reel. Con dos ya se ve si el vídeo de taller bate al estático'],
];

console.log('\n── Se apagan ───────────────────────────────────────────────');
for (const [nombre, porque] of APAGAR) {
  const id = estado[nombre];
  if (!id) { console.log(`   ! ${nombre}: no está en .state.json`); continue; }
  await api(id, { status: 'PAUSED' });
  console.log(`   ✕ ${nombre}\n     ${porque}`);
}

console.log('\n── Quedan en frío ──────────────────────────────────────────');
console.log('   POST-PROCESO | Reel   vídeo  → /guia          (el de más alcance orgánico)');
console.log('   POST-CASA    | Reel   vídeo  → /cuestionario  (mueble en casa real, 43 guardados)');
console.log('   5A           | 4x5    estático → /guia          (roble centenario)');
console.log('   2A           | 4x5    estático → /cuestionario  (la pieza que cierra la reforma)');
console.log('\n   2 vídeos contra 2 estáticos · 2 a la guía contra 2 al cuestionario');
console.log('   ~9.000-12.000 impresiones al mes por anuncio: ya es un dato.\n');
