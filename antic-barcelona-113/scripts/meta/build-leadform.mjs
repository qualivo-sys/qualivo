#!/usr/bin/env node
/**
 * Campaña de formulario instantáneo (Lead Ads) — test paralelo.
 *
 *   node scripts/meta/build-leadform.mjs               # simulacro
 *   META_TOKEN=... node scripts/meta/build-leadform.mjs --apply
 *
 * Por qué merece la pena probarlo:
 *   · El formulario vive dentro de Meta, así que NO depende de la captura de
 *     leads de la web. Puede rodar desde hoy.
 *   · El CPL suele ser la mitad que el de landing.
 *
 * Y por qué lleva preguntas de cualificación:
 *   Un formulario de tres campos genera leads baratos y basura. Estas cuatro
 *   preguntas replican el cuestionario de la web, así que el comercial recibe
 *   lo mismo y se puede comparar la CALIDAD, no solo el precio.
 */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/meta/config.json'), 'utf8'));
const APPLY = process.argv.includes('--apply');
const TOKEN = process.env.META_TOKEN;
const { ad_account_id: ACT, page_id: PAGE, pixel_id: PIXEL, instagram_user_id: IG,
        api_version: V, dsa_beneficiary, dsa_payor } = cfg.cuenta;
const BASE = `https://graph.facebook.com/${V}`;
const ESTADO = path.join(ROOT, 'scripts/meta/.state.json');
const estado = JSON.parse(fs.readFileSync(ESTADO, 'utf8'));
const dormir = ms => new Promise(r => setTimeout(r, ms));
const recordar = (k, v) => { estado[k] = v; if (APPLY) fs.writeFileSync(ESTADO, JSON.stringify(estado, null, 2)); };

async function api(endpoint, body) {
  if (!APPLY) { console.log(`   [simulacro] POST ${endpoint}`); return { id: 'dry_' + Math.random().toString(36).slice(2, 9) }; }
  await dormir(900);
  const r = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: TOKEN }),
  });
  const j = await r.json();
  if (j.error) throw new Error(`${endpoint} → ${j.error.error_user_title || j.error.message}\n      ${j.error.error_user_msg || ''}`);
  return j;
}

const FORM = {
  name: 'AB113 · Diseña tu pieza',
  locale: 'ES_ES',
  // MORE_VOLUME = menos fricción · HIGHER_INTENT añade una pantalla de
  // confirmación. Con ticket alto interesa la intención, no el volumen.
  follow_up_action_url: 'https://antic-barcelona-113.vercel.app/cuestionario',
  context_card: {
    title: '¿Tienes un espacio en mente?',
    style: 'LIST_STYLE',
    content: [
      'Fabricamos cada pieza a medida en nuestro taller de Terrassa',
      'Madera recuperada: roble centenario, teca, vigas con historia',
      'Transporte e instalación incluidos',
    ],
    button_text: 'Empezar',
  },
  questions: [
    { type: 'FULL_NAME' },
    { type: 'EMAIL' },
    { type: 'PHONE' },
    { type: 'CUSTOM', key: 'pieza', label: '¿Qué pieza necesitas?',
      options: [{ key: 'mesa', value: 'Mesa de comedor' }, { key: 'banco', value: 'Banco' },
                { key: 'cajonera', value: 'Cajonera o almacenaje' }, { key: 'otra', value: 'Otra pieza' }] },
    { type: 'CUSTOM', key: 'espacio', label: '¿Dónde irá?',
      options: [{ key: 'comedor', value: 'Comedor' }, { key: 'salon', value: 'Salón' },
                { key: 'cocina', value: 'Cocina' }, { key: 'restaurante', value: 'Restaurante' }, { key: 'otro', value: 'Otro' }] },
    { type: 'CUSTOM', key: 'medidas', label: '¿Qué medidas necesitas, aproximadamente? (ej. 240 × 100 cm)' },
    { type: 'CUSTOM', key: 'plazo', label: '¿Cuándo la necesitas?',
      options: [{ key: 'ya', value: 'Lo antes posible' }, { key: 'tres', value: 'En los próximos 3 meses' },
                { key: 'anyo', value: 'Más adelante este año' }, { key: 'explorando', value: 'Solo estoy explorando' }] },
  ],
  privacy_policy: { url: 'https://antic-barcelona-113.vercel.app/privacidad', link_text: 'Política de privacidad' },
  thank_you_page: {
    title: 'Gracias. Ya sabemos por dónde empezar.',
    body: 'Te escribimos por WhatsApp para proponerte una pieza para tu espacio. Mientras tanto, puedes descargar nuestra guía para elegir la mesa perfecta.',
    button_type: 'VIEW_WEBSITE',
    website_url: 'https://antic-barcelona-113.vercel.app/descargas/guia-mesa-perfecta-antic-barcelona-113.pdf',
    button_text: 'Descargar la guía',
  },
};

const ANUNCIOS = ['2A', '3A', '1A'];   // reforma, personalización y anti-catálogo

async function main() {
  console.log(APPLY ? '\n▶  CREANDO CAMPAÑA DE FORMULARIO (PAUSED)\n' : '\n▶  SIMULACRO\n');

  let formId = estado['__leadform__'];
  if (formId) console.log(`1. Formulario ya existía → ${formId}`);
  else {
    const f = await api(`${PAGE}/leadgen_forms`, FORM);
    formId = f.id; recordar('__leadform__', formId);
    console.log(`1. Formulario → ${formId}`);
  }

  const nombreCamp = 'AB113 | FRIO | Formulario';
  let camp = estado[nombreCamp];
  if (camp) console.log(`2. Campaña ya existía → ${camp}`);
  else {
    const c = await api(`${ACT}/campaigns`, {
      name: nombreCamp, objective: 'OUTCOME_LEADS', status: 'PAUSED',
      special_ad_categories: [], daily_budget: 800, bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    });
    camp = c.id; recordar(nombreCamp, camp);
    console.log(`2. Campaña → ${camp} · 8 €/día`);
  }

  const nombreCj = 'CAT80 | Amplio | Formulario';
  let adset = estado[nombreCj];
  if (adset) console.log(`3. Conjunto ya existía → ${adset}`);
  else {
    const a = await api(`${ACT}/adsets`, {
      name: nombreCj, campaign_id: camp, status: 'PAUSED',
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      destination_type: 'ON_AD',                 // el formulario vive dentro de Meta
      promoted_object: { page_id: PAGE },
      targeting: {
        geo_locations: { custom_locations: [{ latitude: 41.561, longitude: 2.0089, radius: 80, distance_unit: 'kilometer' }] },
        age_min: 32, age_max: 65,
        targeting_automation: { advantage_audience: 0 },
        excluded_custom_audiences: [{ id: '120250478253110297' }],   // convertidos 90d
      },
      dsa_beneficiary, dsa_payor,
    });
    adset = a.id; recordar(nombreCj, adset);
    console.log(`3. Conjunto → ${adset}`);
  }

  console.log('4. Anuncios');
  const hashes = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/meta/.image-hashes.json'), 'utf8'));
  for (const id of ANUNCIOS) {
    const c = cfg.creatividades[id];
    const nombre = `${id} | FORM | 4x5 | v1`;
    if (estado[nombre]) { console.log(`   ya existía → ${estado[nombre]} · ${nombre}`); continue; }
    const cr = await api(`${ACT}/adcreatives`, {
      name: `${id} | FORM | ${c.titular}`,
      object_story_spec: {
        page_id: PAGE,
        ...(IG ? { instagram_user_id: IG } : {}),
        link_data: {
          image_hash: hashes[id],
          link: `https://facebook.com/${formId}`,
          message: c.texto, name: c.titular, description: c.descripcion,
          call_to_action: { type: 'SIGN_UP', value: { lead_gen_form_id: formId } },
        },
      },
    });
    const ad = await api(`${ACT}/ads`, { name: nombre, adset_id: adset, creative: { creative_id: cr.id }, status: 'PAUSED' });
    recordar(nombre, ad.id);
    console.log(`   ${id} → ${ad.id}`);
  }

  console.log('\n✔  Campaña de formulario lista, en PAUSED.');
  console.log('\nQué comparar contra la campaña de landing:');
  console.log('   · CPL: el formulario debería salir a la mitad');
  console.log('   · % de leads HOT: es donde el formulario suele perder');
  console.log('   · Coste por presupuesto enviado: la métrica que decide de verdad');
  console.log('\nLos leads del formulario NO llegan a la hoja: hay que descargarlos del');
  console.log('Administrador o conectar la integración (ver README).\n');
}
main().catch(e => { console.error('\n✗', e.message, '\n'); process.exit(1); });
