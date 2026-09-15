import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve('out');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 1500 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve('creatives.html'));
await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const boards = await page.$$('.artboard');
for (const b of boards) {
  const { slug, n } = await b.evaluate(el => el.dataset);
  const file = `${OUT}/qualivo-fuga-0${n}-${slug}.png`;
  await b.screenshot({ path: file });
  console.log('rendered', file);
}

// Reporte de ajuste tipográfico para comprobar que la plantilla no se deforma
const sizes = await page.$$eval('.head h1', els =>
  els.map(e => ({ px: e.style.fontSize, lines: Math.round(e.scrollHeight / (parseFloat(e.style.fontSize) * 0.92)) })));
console.log('titulares:', JSON.stringify(sizes));

// Hoja de contactos: la serie completa de un vistazo
const page2 = await browser.newPage({ viewport: { width: 1180, height: 920 }, deviceScaleFactor: 2 });
await page2.goto('file://' + resolve('creatives.html'));
await page2.waitForFunction(() => document.documentElement.dataset.ready === '1');
await page2.evaluate(() => document.fonts.ready);
const SHEET = await page2.evaluate(() => {
  const S = 0.42;
  document.body.style.cssText = `background:#1c1c1c;display:grid;` +
    `grid-template-columns:repeat(3,${1080 * S}px);grid-auto-rows:${1350 * S}px;` +
    `gap:26px;padding:26px;width:max-content`;
  document.querySelectorAll('.artboard').forEach(a => {
    a.style.transform = `scale(${S})`; a.style.transformOrigin = 'top left';
  });
  return { width: Math.ceil(document.body.scrollWidth), height: Math.ceil(document.body.scrollHeight) };
});
await page2.setViewportSize(SHEET);
await page2.waitForTimeout(400);
await page2.screenshot({ path: `${OUT}/qualivo-serie-contactos.png` });
console.log('rendered', `${OUT}/qualivo-serie-contactos.png`);

await browser.close();
