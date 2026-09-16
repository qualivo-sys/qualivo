#!/usr/bin/env node
/**
 * Pasa los correos que recibe el LEAD a salir del buzón del cliente.
 *
 *   N8N_KEY=... SMTP_PASS=... node scripts/n8n/cambiar-remitente.mjs
 *   ... --simulacro     para ver qué tocaría sin tocar nada
 *
 * Por qué no se puede hacer sin la contraseña: el dominio del cliente tiene
 * SPF «v=spf1 include:mx.ovh.com -all». El «-all» significa que cualquier
 * correo que diga venir de @anticbarcelona113.es y no salga de los
 * servidores de OVH se rechaza. No es una cuestión de escribir otra
 * dirección en el remitente: hay que enviar de verdad desde ese buzón.
 *
 * Solo cambian los dos correos que lee el lead. Los avisos internos siguen
 * saliendo del buzón de la agencia, que es lo correcto: son nuestros.
 */
const K = process.env.N8N_KEY;
const PASS = process.env.SMTP_PASS;
const SIMULACRO = process.argv.includes('--simulacro');
const B = 'https://qualivo.app.n8n.cloud/api/v1';
const FLUJO = 'ACFfAUUNolBIr1DH';

const BUZON = process.env.SMTP_USER || 'info@anticbarcelona113.es';
const HOST = process.env.SMTP_HOST || 'ssl0.ovh.net';   // el de OVH
const PUERTO = Number(process.env.SMTP_PORT || 465);

// Los que ve el lead. El resto se queda como está.
const DEL_CLIENTE = ['Mandar la guía al lead', 'Mandar el recordatorio'];

if (!K) { console.error('Falta N8N_KEY'); process.exit(1); }
const h = { 'X-N8N-API-KEY': K, 'Content-Type': 'application/json' };

const w = await (await fetch(`${B}/workflows/${FLUJO}`, { headers: h })).json();
if (!w.nodes) { console.error('No se pudo leer el flujo:', JSON.stringify(w).slice(0, 200)); process.exit(1); }

console.log('\nCorreos del flujo y de qué buzón salen hoy:');
for (const n of w.nodes.filter((x) => x.type.endsWith('emailSend'))) {
  const marca = DEL_CLIENTE.includes(n.name) ? '  ← pasa al cliente' : '  (interno, se queda)';
  console.log(`  ${n.name.padEnd(26)} ${n.parameters.fromEmail}${marca}`);
}

if (SIMULACRO) { console.log('\nSimulacro: no se ha tocado nada.\n'); process.exit(0); }
if (!PASS) { console.error('\nFalta SMTP_PASS (la contraseña del buzón del cliente).\n'); process.exit(1); }

const cred = await (await fetch(`${B}/credentials`, { method: 'POST', headers: h,
  body: JSON.stringify({ name: `SMTP ${BUZON}`, type: 'smtp',
    data: { user: BUZON, password: PASS, host: HOST, port: PUERTO, secure: PUERTO === 465, disableStartTls: false } }) })).json();
if (!cred.id) { console.error('No se pudo crear la credencial:', JSON.stringify(cred).slice(0, 300)); process.exit(1); }
console.log(`\n  credencial creada: ${cred.id}`);

for (const n of w.nodes) {
  if (!DEL_CLIENTE.includes(n.name)) continue;
  n.parameters.fromEmail = `Antic Barcelona 113 <${BUZON}>`;
  n.parameters.options = { ...(n.parameters.options || {}) };
  delete n.parameters.options.replyTo;           // ya no hace falta: sale de su buzón
  n.credentials = { smtp: { id: cred.id, name: `SMTP ${BUZON}` } };
  console.log(`  ${n.name} → ${BUZON}`);
}

const r = await (await fetch(`${B}/workflows/${FLUJO}`, { method: 'PUT', headers: h,
  body: JSON.stringify({ name: w.name, nodes: w.nodes, connections: w.connections, settings: w.settings }) })).json();
if (!r.id) { console.error('No se pudo guardar:', JSON.stringify(r).slice(0, 300)); process.exit(1); }
await fetch(`${B}/workflows/${FLUJO}/activate`, { method: 'POST', headers: h });
console.log('\n✓ Hecho. Manda un lead de prueba de guía y comprueba la cabecera del correo.\n');
