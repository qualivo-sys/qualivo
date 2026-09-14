#!/usr/bin/env node
/**
 * Junta los cuatro .gs en un solo archivo para pegar.
 *
 *   node scripts/crm/juntar.mjs                        # con huecos por rellenar
 *   SECRETO=... META_TOKEN=... EMAIL_AVISOS=... \
 *     node scripts/crm/juntar.mjs --salida /ruta.gs    # ya relleno
 *
 * El código se mantiene en cuatro archivos porque así se lee. Pero a quien lo
 * tiene que instalar no le importa cómo está organizado: le importa pegar una
 * vez en vez de cuatro. Esto reconcilia las dos cosas sin duplicar código.
 *
 * El archivo relleno lleva el token de Meta dentro, así que NO se guarda en el
 * repositorio: se genera aparte y se entrega por otro canal.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ORDEN = ['Codigo.gs', 'Crm.gs', 'MetaLeads.gs'];

const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : null;
};
const salida = arg('--salida') || path.join(RAIZ, 'apps-script-leads/CRM-completo.gs');

const v = (k, porDefecto) => (process.env[k] || porDefecto);

const cabecera = `/**
 * CRM Antic Barcelona 113 — archivo único
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  QUÉ HAY QUE HACER                                                   │
 * │                                                                      │
 * │  1. Rellenar la línea de abajo que está vacía (tu correo).           │
 * │  2. Arriba, elegir la función «configurar» y darle al ▶.             │
 * │     Pedirá permisos la primera vez: es normal, va a escribir en la   │
 * │     hoja y a mandar correos.                                         │
 * │  3. Implementar → Nueva implementación → Aplicación web              │
 * │       · Ejecutar como: Yo                                            │
 * │       · Quién tiene acceso: Cualquier usuario                        │
 * │  4. Copiar la URL que acaba en /exec y pasársela a Qualivo.          │
 * │                                                                      │
 * │  Esto NO es urgente: los leads ya se están guardando. Lo que          │
 * │  enciende son los correos automáticos y los leads del formulario     │
 * │  de Meta.                                                            │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Generado desde ${ORDEN.join(', ')}. Para cambiar algo, se toca el original
 * y se vuelve a generar: node scripts/crm/juntar.mjs
 */

var CONFIG = {

  // ── Rellenar esto ──────────────────────────────────────────────────

  // Dónde quieres que lleguen los avisos de lead nuevo.
  // Puedes poner varios separados por coma.
  EMAIL_AVISOS: ${JSON.stringify(v('EMAIL_AVISOS', ''))},


  // ── Ya viene puesto, no hace falta tocarlo ─────────────────────────

  EMAIL_AGENCIA: ${JSON.stringify(v('EMAIL_AGENCIA', 'info@maikelechevarria.com'))},
  SECRETO: ${JSON.stringify(v('SECRETO', 'PENDIENTE — lo pone Qualivo'))},
  META_TOKEN: ${JSON.stringify(v('META_TOKEN', 'PENDIENTE — lo pone Qualivo'))},
};

/** Vuelca CONFIG a las propiedades del script. Lo llama configurar(). */
function guardarConfig() {
  var props = PropertiesService.getScriptProperties();
  Object.keys(CONFIG).forEach(function (k) {
    var v = String(CONFIG[k] || '').trim();
    if (v && v.indexOf('PENDIENTE') !== 0) props.setProperty(k, v);
  });
}

`;

const cuerpo = ORDEN.map((f) => {
  const txt = fs.readFileSync(path.join(RAIZ, 'apps-script-leads', f), 'utf8');
  return `\n// ${'═'.repeat(72)}\n// ${f}\n// ${'═'.repeat(72)}\n\n${txt.trim()}\n`;
}).join('\n');

fs.mkdirSync(path.dirname(salida), { recursive: true });
fs.writeFileSync(salida, cabecera + cuerpo);

const relleno = !!(process.env.SECRETO && process.env.META_TOKEN);
console.log(`${salida}\n  ${fs.readFileSync(salida, 'utf8').split('\n').length} líneas · ` +
  (relleno ? 'con las claves dentro (no subir al repositorio)' : 'con huecos por rellenar'));
