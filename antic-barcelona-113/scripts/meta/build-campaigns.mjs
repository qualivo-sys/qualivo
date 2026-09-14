#!/usr/bin/env node
/**
 * Crea la estructura de campañas de Meta Ads descrita en config.json.
 *
 * TODO se crea en PAUSED. Este script nunca activa nada ni gasta presupuesto:
 * activar es una decisión manual en el Administrador de anuncios.
 *
 *   node scripts/meta/build-campaigns.mjs              # simulacro, no llama a la API
 *   META_TOKEN=EAAB... node scripts/meta/build-campaigns.mjs --apply
 *
 * Requiere en config.json: ad_account_id, page_id y pixel_id reales.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/meta/config.json'), 'utf8'));
const APPLY = process.argv.includes('--apply');
const TOKEN = process.env.META_TOKEN;
const V = cfg.cuenta.api_version;
const ACT = cfg.cuenta.ad_account_id;
const BASE = `https://graph.facebook.com/${V}`;

const log = (...a) => console.log(...a);
const dormir = ms => new Promise(r => setTimeout(r, ms));

/** Las cuentas publicitarias nuevas tienen un cupo de API muy bajo. Reintenta
 *  con espera creciente en vez de abortar a mitad de la creación. */
const LIMITE = /request limit|rate limit|too many calls|User request limit/i;
async function conReintento(fn, etiqueta) {
  for (let intento = 1; intento <= 6; intento++) {
    try { return await fn(); }
    catch (e) {
      if (!LIMITE.test(e.message) || intento === 6) throw e;
      const espera = Math.min(120, 2 ** intento * 5);
      log(`   ⏳ cupo de API alcanzado en ${etiqueta}; reintento ${intento}/5 en ${espera}s`);
      await dormir(espera * 1000);
    }
  }
}
const eur = n => Math.round(n * 100);   // Meta cobra en la unidad menor de la divisa

function preflight() {
  const faltan = [];
  if (!ACT || ACT.includes('PENDIENTE')) faltan.push('cuenta.ad_account_id');
  if (!cfg.cuenta.page_id || String(cfg.cuenta.page_id).includes('PENDIENTE')) faltan.push('cuenta.page_id');
  if (!cfg.cuenta.pixel_id || String(cfg.cuenta.pixel_id).includes('PENDIENTE')) faltan.push('cuenta.pixel_id');
  if (APPLY && !TOKEN) faltan.push('variable de entorno META_TOKEN');

  for (const [id, c] of Object.entries(cfg.creatividades)) {
    const f = path.join(ROOT, c.imagen);
    if (!fs.existsSync(f)) faltan.push(`imagen de ${id}: ${c.imagen}`);
  }
  return faltan;
}

async function api(endpoint, body, isUpload = false) {
  if (!APPLY) { log(`   [simulacro] POST ${endpoint}`); return { id: `dry_${Math.random().toString(36).slice(2, 10)}` }; }
  const url = `${BASE}/${endpoint}`;
  let opts;
  if (isUpload) {
    body.append('access_token', TOKEN);
    opts = { method: 'POST', body };
  } else {
    opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, access_token: TOKEN }),
    };
  }
  await dormir(700);                       // ritmo suave: no saturar el cupo
  const r = await fetch(url, opts);
  const j = await r.json();
  if (!r.ok || j.error) {
    throw new Error(`${endpoint} → ${j.error?.message || r.status}\n${JSON.stringify(j.error ?? j, null, 2)}`);
  }
  return j;
}

async function apiGet(endpoint, params = {}) {
  if (!APPLY) return { data: [] };
  const qs = new URLSearchParams({ ...params, access_token: TOKEN }).toString();
  const r = await fetch(`${BASE}/${endpoint}?${qs}`);
  const j = await r.json();
  if (j.error) throw new Error(`${endpoint} → ${j.error.message}`);
  return j;
}

/** Estado local de lo ya creado. En cuentas de nivel `development_access`
 *  listar /adsets y /ads está fuertemente limitado (devuelve "User request
 *  limit reached") aunque crear sí funcione, así que la idempotencia no puede
 *  depender de consultar a Meta: se apoya en este fichero, y la consulta a la
 *  API queda solo como respaldo que nunca aborta. */
const ESTADO = path.join(ROOT, 'scripts/meta/.state.json');
const estado = fs.existsSync(ESTADO) ? JSON.parse(fs.readFileSync(ESTADO, 'utf8')) : {};
function recordar(nombre, id) {
  estado[nombre] = id;
  if (APPLY) fs.writeFileSync(ESTADO, JSON.stringify(estado, null, 2));
}
async function buscarPorNombre(edge, nombre) {
  if (estado[nombre]) return { id: estado[nombre], name: nombre };
  try {
    const j = await apiGet(edge, { fields: 'id,name', limit: 200 });
    const hit = (j.data || []).find(x => x.name === nombre) || null;
    if (hit) recordar(nombre, hit.id);
    return hit;
  } catch (e) {
    log(`   (no se pudo consultar ${edge}: ${e.message.split('→').pop().trim()} — sigo y creo)`);
    return null;
  }
}

async function subirImagen(rel) {
  const file = path.join(ROOT, rel);
  const fd = new FormData();
  fd.append('filename', new Blob([fs.readFileSync(file)]), path.basename(file));
  const j = await api(`${ACT}/adimages`, fd, true);
  if (!APPLY) return `dry_hash_${path.basename(file)}`;
  return Object.values(j.images)[0].hash;
}

async function main() {
  const faltan = preflight();
  if (faltan.length) {
    log('\n⚠  Falta por rellenar antes de poder ejecutar:\n');
    faltan.forEach(f => log('   ·', f));
    if (APPLY) { log('\nAbortado: --apply necesita todo lo anterior.\n'); process.exit(1); }
    log('\nSigo en modo simulacro para que veas la estructura completa.\n');
  }

  log(APPLY ? '\n▶  CREANDO EN META (todo en PAUSED)\n' : '\n▶  SIMULACRO — no se llama a la API\n');

  // Las subidas consumen cupo de API y Meta deduplica por contenido: se cachean
  // los hashes para que un reintento no vuelva a gastar 10 llamadas.
  const CACHE = path.join(ROOT, 'scripts/meta/.image-hashes.json');
  const hashes = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  log('1. Imágenes');
  for (const [id, c] of Object.entries(cfg.creatividades)) {
    if (hashes[id]) { log(`   ${id} → ${hashes[id]} (cacheado)`); continue; }
    hashes[id] = await conReintento(() => subirImagen(c.imagen), `imagen ${id}`);
    log(`   ${id} → ${hashes[id]}`);
    if (APPLY) fs.writeFileSync(CACHE, JSON.stringify(hashes, null, 2));
  }

  const resumen = [];
  for (const camp of cfg.campanas) {
    log(`\n2. Campaña «${camp.nombre}» · ${camp.presupuesto_diario_eur} €/día`);
    if (camp._nota) log(`   nota: ${camp._nota}`);

    let campaign = await buscarPorNombre(`${ACT}/campaigns`, camp.nombre);
    if (campaign) log(`   ya existía → ${campaign.id}`);
    else campaign = await conReintento(() => api(`${ACT}/campaigns`, {
      name: camp.nombre,
      objective: camp.objetivo,
      status: 'PAUSED',
      special_ad_categories: [],
      daily_budget: eur(camp.presupuesto_diario_eur),   // CBO
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    }), 'campaign');
    recordar(camp.nombre, campaign.id);
    log(`   campaign_id = ${campaign.id}`);

    for (const cj of camp.conjuntos) {
      if (cj._audiencias) log(`   ⚠ ${cj._audiencias}`);
      let adset = await buscarPorNombre(`${ACT}/adsets`, cj.nombre);
      if (adset) log(`   ya existía → ${adset.id}`);
      else adset = await conReintento(() => api(`${ACT}/adsets`, {
        name: cj.nombre,
        campaign_id: campaign.id,
        status: 'PAUSED',
        billing_event: cj.billing_event,
        optimization_goal: cj.optimization_goal,
        promoted_object: { pixel_id: cfg.cuenta.pixel_id, custom_event_type: cj.custom_event_type },
        attribution_spec: [
          { event_type: 'CLICK_THROUGH', window_days: 7 },
          { event_type: 'VIEW_THROUGH', window_days: 1 },
        ],
        targeting: { ...cj.targeting, publisher_platforms: undefined },
        // Ley de Servicios Digitales (UE): anunciante y pagador declarados
        dsa_beneficiary: cfg.cuenta.dsa_beneficiary,
        dsa_payor: cfg.cuenta.dsa_payor,
      }), 'adsets');
      recordar(cj.nombre, adset.id);
      log(`   adset_id = ${adset.id} · ${cj.nombre}`);

      for (const adId of cj.anuncios) {
        const c = cfg.creatividades[adId];
        if (!c) { log(`   ⚠ sin creatividad para ${adId}, saltando`); continue; }
        const link = `${cfg.landing}${c.destino}?${cfg.utm}`;
        const creative = await conReintento(() => api(`${ACT}/adcreatives`, {
          name: `${adId} | ${c.titular}`,
          object_story_spec: {
            page_id: cfg.cuenta.page_id,
            ...(cfg.cuenta.instagram_actor_id ? { instagram_actor_id: cfg.cuenta.instagram_actor_id } : {}),
            link_data: {
              image_hash: hashes[adId],
              link,
              message: c.texto,
              name: c.titular,
              description: c.descripcion,
              call_to_action: { type: c.cta, value: { link } },
            },
          },
          // Nota: 'standard_enhancements' quedó obsoleto en la API. Si se quiere
          // evitar que Meta retoque imagen y texto, hay que desactivar cada
          // función por separado desde el Administrador de anuncios.
        }), `adcreative ${adId}`);
        const adName = `${adId} | ${camp.nombre.includes('RTG') ? 'RTG' : 'FRIO'} | 4x5 | v1`;
        const yaExiste = await buscarPorNombre(`${ACT}/ads`, adName);
        if (yaExiste) { log(`      anuncio ${adId} ya existía → ${yaExiste.id}`); resumen.push({ campana: camp.nombre, conjunto: cj.nombre, anuncio: adId, ad_id: yaExiste.id }); continue; }
        const ad = await conReintento(() => api(`${ACT}/ads`, {
          name: adName,
          adset_id: adset.id,
          creative: { creative_id: creative.id },
          status: 'PAUSED',
        }), `ad ${adId}`);
        recordar(adName, ad.id);
        log(`      anuncio ${adId} → ${ad.id}`);
        resumen.push({ campana: camp.nombre, conjunto: cj.nombre, anuncio: adId, ad_id: ad.id });
      }
    }
  }

  log(`\n✔  ${resumen.length} anuncios en ${cfg.campanas.length} campañas. Todo PAUSED.`);
  log('\nAntes de activar, comprobar a mano:');
  log('   · Dominio verificado y los 8 eventos priorizados (AEM)');
  log('   · Conversions API activa y deduplicando con event_id');
  log('   · Públicos de retargeting creados (ver nota del conjunto RTG)');
  log('   · Límite de gasto de la cuenta puesto');
  log('   · Exclusión de conversores de los últimos 90 días\n');

  if (APPLY) {
    const out = path.join(ROOT, 'scripts/meta/ultimo-despliegue.json');
    fs.writeFileSync(out, JSON.stringify(resumen, null, 2));
    log(`Resumen guardado en ${path.relative(ROOT, out)}\n`);
  }
}

main().catch(e => { console.error('\n✗', e.message, '\n'); process.exit(1); });
