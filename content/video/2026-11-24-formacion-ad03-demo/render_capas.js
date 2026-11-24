// node render_capas.js <dir>  → secuencia PNG con transparencia de capas.html, a 25 fps
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const dir = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/'+(process.argv[3]||'capas.html'), { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const n = Math.round((await p.evaluate(() => window.DUR)) * 25);
  for (let i = 0; i < n; i++) { await p.evaluate(t => window.setT(t), i / 25); await p.screenshot({ path: dir + '/f' + String(i).padStart(5, '0') + '.png', omitBackground: true }); }
  await b.close(); console.log(n); })();
