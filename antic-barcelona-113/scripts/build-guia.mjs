import { chromium } from 'playwright';
import path from 'path';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await (await b.newContext()).newPage();
await p.goto('file://' + path.resolve('guia/guia.html'), { waitUntil:'networkidle' });
await p.waitForTimeout(2500);
await p.pdf({
  path: 'landing/descargas/guia-mesa-perfecta-antic-barcelona-113.pdf',
  format: 'A4', printBackground: true,
  margin: { top:0, right:0, bottom:0, left:0 },
});
// miniaturas para revisar
for (const [i, y] of [0,1,2,3,4,5,6,7,8].entries()) {
  await p.setViewportSize({ width: 794, height: 1123 });
  await p.evaluate(v => window.scrollTo(0, v*1123), y);
  await p.waitForTimeout(250);
  if (i < 3) await p.screenshot({ path: `/tmp/shots/guia-${i}.png` });
}
await b.close();
console.log('PDF generado');
