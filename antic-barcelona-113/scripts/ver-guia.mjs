import { chromium } from 'playwright';
import path from 'path';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await (await b.newContext({ viewport:{width:794,height:1123}, deviceScaleFactor:2 })).newPage();
await p.goto('file://' + path.resolve('guia/guia.html'), { waitUntil:'networkidle' });
await p.waitForTimeout(2000);
const pgs = await p.$$('.pg');
for (const [i, el] of pgs.entries()) {
  if (![2,5,7].includes(i)) continue;
  await el.screenshot({ path: `/tmp/shots/gp-${i}.png` });
}
await b.close(); console.log('ok');
