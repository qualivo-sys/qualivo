#!/usr/bin/env node
/**
 * Manda al cuestionario el tráfico que iba a la guía.
 *
 *   META_TOKEN=… node scripts/meta/repuntar-al-cuestionario.mjs            # simulacro
 *   META_TOKEN=… node scripts/meta/repuntar-al-cuestionario.mjs --aplicar
 *
 * Por qué, con los números de la primera semana:
 *
 *   GUÍA          9 leads · 0 con medidas · 0 con presupuesto · 4 perdidos
 *   CUESTIONARIO  7 leads · 5 con medidas · 6 con presupuesto · 2 perdidos
 *
 * Los tres únicos leads a los que el taller puede mandar un presupuesto
 * vienen del cuestionario. Los nueve de la guía no han dado una sola medida:
 * son contactos, no oportunidades. El comercial lo resumió mejor que ningún
 * panel: «el 89 % de los que entran son curiosos».
 *
 * La guía no se tira. Deja de ser la puerta de entrada y pasa a ser lo que
 * se le ofrece a quien abandona el cuestionario y a quien ya nos conoce.
 *
 * Cuando se diseñó el embudo de dos peldaños, el cuestionario tenía siete
 * pasos y pedirlo en frío era mucho. Ahora tiene cuatro, así que la razón que
 * justificaba la guía como entrada ya no se sostiene.
 *
 * Un enlace de creatividad no se puede editar: hay que crear otra y cambiarla
 * en el anuncio. Eso reinicia el aprendizaje de esos dos anuncios, y es un
 * coste que se asume a cambio de dejar de pagar por curiosos.
 */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'config.json'), 'utf8'));
const estado = JSON.parse(fs.readFileSync(path.join(DIR, '.state.json'), 'utf8'));
const TOKEN = process.env.META_TOKEN;
const APLICAR = process.argv.includes('--aplicar');
const { ad_account_id: ACT, page_id: PAGE, instagram_user_id: IG, api_version: V } = cfg.cuenta;
const BASE = `https://graph.facebook.com/${V}`;
if (!TOKEN) { console.error('Falta META_TOKEN'); process.exit(1); }

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(nodo, cuerpo, metodo = 'POST') {
  await dormir(600);
  const r = await fetch(`${BASE}/${nodo}`, {
    method: metodo, headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...cuerpo, access_token: TOKEN }),
  });
  const j = await r.json();
  if (j.error) throw new Error(`${nodo}: ${j.error.error_user_msg || j.error.message}`);
  return j;
}
const leer = async (nodo, campos) => {
  const r = await fetch(`${BASE}/${nodo}?fields=${encodeURIComponent(campos)}&access_token=${TOKEN}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
};

const DESTINO = `${cfg.landing}/cuestionario?${cfg.utm}`;

// El anuncio prometía «te enseñamos el proceso» y llevaba a la guía. Si ahora
// lleva al cuestionario, lo que promete tiene que ser lo que se encuentra.
const COPY_NUEVO = {
  '5A | FRIO | 4x5 | v1': {
    titular: 'Dinos tu espacio y te decimos qué encaja',
    descripcion: 'Dos minutos · Respuesta por WhatsApp · Taller en Terrassa',
    texto: 'Este roble creció durante más de cien años. Después fue estructura de una casa. ' +
      'Ahora puede ser la mesa donde coma tu familia durante otros cien.\n\n' +
      'No trabajamos con catálogo: cada pieza se hace para el sitio donde va. ' +
      'Cuéntanos las medidas de tu espacio y te decimos qué se puede hacer y qué cuesta.',
  },
};

const ANUNCIOS = ['5A | FRIO | 4x5 | v1', 'POST-PROCESO | FRIO | Reel | v1'];

console.log(APLICAR ? '\n▶  REPUNTANDO AL CUESTIONARIO\n' : '\n▶  SIMULACRO (añade --aplicar)\n');

for (const nombre of ANUNCIOS) {
  const adId = estado[nombre];
  if (!adId) { console.log(`  ! ${nombre}: no está en .state.json`); continue; }

  const ad = await leer(adId, 'name,creative{id,object_story_spec,source_instagram_media_id,call_to_action_type}');
  const oss = ad.creative?.object_story_spec || {};
  const actual = oss.link_data?.link || oss.video_data?.call_to_action?.value?.link ||
    ad.creative?.call_to_action?.value?.link || '(no visible en la API)';
  console.log(`▸ ${nombre}`);
  console.log(`   ahora → ${String(actual).split('?')[0]}`);
  console.log(`   pasa  → ${DESTINO.split('?')[0]}`);

  if (!APLICAR) { console.log(); continue; }

  let nuevaCreatividad;
  if (ad.creative?.source_instagram_media_id) {
    // Reel orgánico: se conserva la publicación, solo cambia a dónde lleva
    nuevaCreatividad = await api(`${ACT}/adcreatives`, {
      name: `${nombre.split(' | ')[0]} | Reel orgánico → cuestionario`,
      instagram_user_id: IG,
      source_instagram_media_id: ad.creative.source_instagram_media_id,
      call_to_action: { type: 'LEARN_MORE', value: { link: DESTINO } },
    });
  } else {
    const ld = oss.link_data || {};
    const nuevo = COPY_NUEVO[nombre] || {};
    nuevaCreatividad = await api(`${ACT}/adcreatives`, {
      name: `${nombre.split(' | ')[0]} | ${nuevo.titular || ld.name} → cuestionario`,
      object_story_spec: {
        page_id: PAGE,
        ...(IG ? { instagram_user_id: IG } : {}),
        link_data: {
          image_hash: ld.image_hash,
          link: DESTINO,
          message: nuevo.texto || ld.message,
          name: nuevo.titular || ld.name,
          description: nuevo.descripcion || ld.description,
          call_to_action: { type: 'LEARN_MORE', value: { link: DESTINO } },
        },
      },
    });
  }
  await api(adId, { creative: { creative_id: nuevaCreatividad.id } });
  console.log(`   ✓ creatividad ${nuevaCreatividad.id} puesta en el anuncio ${adId}\n`);
}

console.log('Tras esto, los cuatro anuncios de frío llevan al cuestionario.');
console.log('La guía sigue viva: es lo que se ofrece a quien abandona y en retargeting.\n');
