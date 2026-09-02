import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const B = 'http://localhost:8123';
const OUT = 'creatividades/meta';
const FMT = { '4x5':[1080,1350], '1x1':[1080,1080], '9x16':[1080,1920] };

const src = fs.readFileSync('landing/ads/creativos.js','utf8');
const ids = [...src.matchAll(/id:'([0-9A-Z]+)'/g)].map(m=>m[1]);
console.log('creatividades:', ids.join(', '));

const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errs = [];
for (const [fmt,[w,h]] of Object.entries(FMT)) {
  const dir = path.join(OUT, fmt);
  fs.mkdirSync(dir, { recursive:true });
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  p.on('requestfailed', r => errs.push(fmt+' '+r.url()));
  for (const id of ids) {
    await p.goto(`${B}/ads/plantilla.html?id=${id}&fmt=${fmt}`, { waitUntil:'networkidle' });
    await p.waitForTimeout(500);
    const el = await p.$('.ad');
    await el.screenshot({ path: path.join(dir, `AB113_${id}_${fmt}.png`) });
  }
  await ctx.close();
  console.log(fmt, '->', ids.length, 'ficheros');
}
await b.close();
console.log('fallos de recurso:', errs.length ? [...new Set(errs)].slice(0,5) : 'ninguno');
