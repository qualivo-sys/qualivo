// node render_intel.js <dir> <n fotogramas> → secuencia PNG de la escena de Intelligence
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const dir = process.argv[2], n = +process.argv[3]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/intel.html', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < n; i++) { await p.evaluate(u => window.setU(u), i / (n - 1)); await p.screenshot({ path: dir + '/f' + String(i).padStart(5, '0') + '.png' }); }
  await b.close(); console.log(n); })();
