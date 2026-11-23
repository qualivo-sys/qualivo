// node render.js <escena.html?ap=a> <dir>   → fotogramas a 25 fps de toda la escena (window.DUR)
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const [url, dir] = process.argv.slice(2); const alto = url.includes('-45') ? 1350 : 1920;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: alto }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/' + url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); const el = await p.$('#e');
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const n = Math.round((await p.evaluate(() => window.DUR)) * 25);
  for (let i = 0; i < n; i++) { await p.evaluate(t => window.setT(t), i / 25); await el.screenshot({ path: dir + '/f' + String(i).padStart(5, '0') + '.jpg', type: 'jpeg', quality: 93 }); }
  await b.close(); console.log(n); })();
