import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const OUT = resolve('out'); mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 1500 } });
await page.goto('file://' + resolve('post-unico.html'));
await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
for (const b of await page.$$('.artboard')) {
  const { slug } = await b.evaluate(el => el.dataset);
  await b.screenshot({ path: `${OUT}/qualivo-post-${slug}.png` });
  console.log('rendered', `qualivo-post-${slug}.png`);
}
console.log('titular:', await page.$eval('.head h1', e => e.style.fontSize));
await browser.close();
