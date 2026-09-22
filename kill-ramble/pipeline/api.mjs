#!/usr/bin/env node
// Puerta única hacia las dos APIs del proyecto. Existe para que la regla de permisos
// pueda ser estrecha: en vez de autorizar «curl» en general, se autoriza este script,
// y el script solo sabe hablar con Smartlead y con Apify. Ningún argumento puede
// apuntarlo a otro sitio.
//
//   node kill-ramble/pipeline/api.mjs --env <ruta/.env> smartlead GET /campaigns/3974838
//   node kill-ramble/pipeline/api.mjs --env <ruta/.env> apify GET /acts/xxx/runs?limit=3
//   node kill-ramble/pipeline/api.mjs --env <ruta/.env> smartlead POST /campaigns/1/status '{"status":"START"}'
//
// El token nunca se escribe en la línea de comandos: sale del fichero .env.

import { readFileSync } from 'node:fs';

const HOSTS = {
  smartlead: { base: 'https://server.smartlead.ai/api/v1', key: 'SMARTLEAD_API_KEY', param: 'api_key' },
  apify: { base: 'https://api.apify.com/v2', key: 'APIFY_TOKEN', param: 'token' },
};

const argv = process.argv.slice(2);
const envIdx = argv.indexOf('--env');
const envPath = envIdx === -1 ? '.env' : argv[envIdx + 1];
const rest = envIdx === -1 ? argv : [...argv.slice(0, envIdx), ...argv.slice(envIdx + 2)];
const [hostName, method = 'GET', path = '/', body] = rest;

const host = HOSTS[hostName];
if (!host) {
  console.error(`Destino no permitido: ${hostName || '(ninguno)'}. Solo: ${Object.keys(HOSTS).join(', ')}`);
  process.exit(2);
}
if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
  console.error(`Método no permitido: ${method}`);
  process.exit(2);
}

// El .env vive fuera del repo, en el scratchpad, y nunca se commitea.
let token = process.env[host.key];
if (!token) {
  try {
    const line = readFileSync(envPath, 'utf8').split('\n').find((l) => l.startsWith(`${host.key}=`));
    token = line && line.slice(host.key.length + 1).trim().replace(/^["']|["']$/g, '');
  } catch {
    /* sin fichero: se reporta abajo */
  }
}
if (!token) {
  console.error(`Falta ${host.key}: ni en el entorno ni en ${envPath}`);
  process.exit(2);
}

// La ruta se normaliza a un path relativo: un argumento con http:// o // no puede
// sacarnos del host permitido.
const clean = '/' + String(path).replace(/^\/+/, '').replace(/^https?:\/\/[^/]+\/?/i, '');
const url = `${host.base}${clean}${clean.includes('?') ? '&' : '?'}${host.param}=${encodeURIComponent(token)}`;

const res = await fetch(url, {
  method: method.toUpperCase(),
  headers: body ? { 'Content-Type': 'application/json' } : undefined,
  body: body || undefined,
});
const text = await res.text();
if (!res.ok) console.error(`HTTP ${res.status}`);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 1));
} catch {
  console.log(text);
}
process.exit(res.ok ? 0 : 1);
