/**
 * Prueba el tablero contra los datos reales de producción.
 *
 *   node scripts/crm/espejo.mjs &          (sirve la landing y reenvía la API)
 *   SP=<scratchpad> node scripts/crm/probar-tablero.mjs
 */
import { chromium } from 'playwright'; import fs from 'node:fs';
const PASS = fs.readFileSync(process.env.SP + '/.crm_password', 'utf8').trim();
const errores = [];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const entrar = async (p) => {
  await p.goto('http://localhost:4399/crm', { waitUntil: 'networkidle' });
  if (await p.isVisible('#pass')) {
    await p.fill('#pass', PASS); await p.click('#formAcceso button'); await p.waitForTimeout(2500);
  }
  await p.click('[data-t="tablero"]'); await p.waitForTimeout(700);
};

// ── Escritorio: arrastrar y soltar ──
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
p.on('pageerror', (e) => errores.push('js: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errores.push('consola: ' + m.text()); });
await entrar(p);
const cols = await p.$$eval('.col', (cs) => cs.map((c) => c.dataset.estado + ':' + c.querySelectorAll('.mini').length));
console.log('columnas:', cols.join(' | '));
console.log('¿arrastrable?', await p.getAttribute('.mini', 'draggable'));
await p.screenshot({ path: '/tmp/tablero-escritorio.png', fullPage: true });

// dragTo vive en Locator, no en ElementHandle
const origen = p.locator('.col[data-estado="Nuevo"] .mini').first();
const nombre = await origen.locator('b').textContent();
await origen.dragTo(p.locator('.col[data-estado="Contactado"] .pila'));
await p.waitForTimeout(3500);
const llegó = await p.$$eval('.col[data-estado="Contactado"] .mini b', (bs) => bs.map((x) => x.textContent));
console.log(`arrastrado «${nombre}» → Contactado:`, llegó.includes(nombre) ? '✓' : '✗ no llegó');
console.log('columnas tras mover:', (await p.$$eval('.col', (cs) => cs.map((c) => c.dataset.estado + ':' + c.querySelectorAll('.mini').length))).join(' | '));

// ── Móvil: se toca, no se arrastra ──
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
await entrar(m);
console.log('en móvil, ¿arrastrable?', await m.getAttribute('.mini', 'draggable'), '(null = no, correcto)');
console.log('aviso:', (await m.textContent('.nota')).slice(0, 62));
const w = await m.evaluate(() => document.documentElement.scrollWidth);
console.log('scrollWidth', w, 'vs 390 ->', w <= 391 ? '✓' : '✗ DESBORDA');
await m.screenshot({ path: '/tmp/tablero-movil.png' });

console.log(errores.length ? 'ERRORES:\n' + errores.join('\n') : '✓ sin errores de consola');
await b.close();
