#!/usr/bin/env node
// Si alguien de una agencia ya ha respondido, pausa al resto de creadores de esa agencia.
//
//   node kill-ramble/pipeline/pause_agency.mjs --env <ruta/.env> --campanas 3974838,3974839,4025816 [--dry]
//
// Smartlead para la secuencia de un lead cuando ese lead responde, pero no sabe nada de
// sus compañeros de agencia: si el mánager de Valiant contesta por K9KURO, el resto de
// creadores de Valiant seguiría recibiendo recordatorios. Aquí se agrupa por dominio del
// correo (los dominios de correo personal no cuentan) y se pausa a los que aún tienen
// envíos pendientes.

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i === -1 ? d : argv[i + 1]; };
const envPath = opt('--env', '.env');
const campaigns = opt('--campanas', '3974838,3974839,4025816').split(',').map(Number);
const dryRun = argv.includes('--dry');
const API = join(dirname(fileURLToPath(import.meta.url)), 'api.mjs');

const call = (method, path, body) => {
  const args = [API, '--env', envPath, 'smartlead', method, path];
  if (body) args.push(JSON.stringify(body));
  return JSON.parse(execFileSync('node', args, { encoding: 'utf8', maxBuffer: 1e8 }));
};

const PERSONAL = /^(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|me|aol|gmx|web|protonmail|proton|msn|mail|yandex|qq|163|126|uol|bol|terra|ig)\./i;
const domain = (email) => email.split('@')[1];

const leads = [];
for (const c of campaigns) {
  for (let offset = 0; ; offset += 100) {
    const page = call('GET', `/campaigns/${c}/leads?offset=${offset}&limit=100`).data || [];
    for (const x of page) leads.push({ campaign: c, id: x.lead.id, email: x.lead.email.toLowerCase(), status: x.status });
    if (page.length < 100) break;
  }
}

// La bandeja unificada devuelve como mucho 20 por página.
const replied = new Set();
for (let offset = 0; ; offset += 20) {
  const res = call('POST', '/master-inbox/inbox-replies', { offset, limit: 20, filters: { campaignId: campaigns } });
  const page = Array.isArray(res) ? res : res.data || [];
  for (const x of page) replied.add(x.lead_email.toLowerCase());
  if (page.length < 20) break;
}

const agencies = new Set([...replied].map(domain).filter((d) => !PERSONAL.test(d)));
let paused = 0;
for (const l of leads) {
  if (!agencies.has(domain(l.email)) || replied.has(l.email)) continue;
  if (!['STARTED', 'INPROGRESS'].includes(l.status)) continue;
  console.log(`${dryRun ? 'pausaría' : 'pauso'} ${l.email} (campaña ${l.campaign}, ${l.status})`);
  if (!dryRun) call('POST', `/campaigns/${l.campaign}/leads/${l.id}/pause`);
  paused++;
}
console.log(`${leads.length} leads · ${replied.size} con respuesta · agencias que han respondido: ${[...agencies].join(', ') || 'ninguna'} · ${paused} ${dryRun ? 'por pausar' : 'pausados'}`);
