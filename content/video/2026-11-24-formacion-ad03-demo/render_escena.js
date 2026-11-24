// node render_escena.js <html> <dir> <n fotogramas> [carpeta de fotogramas de origen] → secuencia PNG de una escena con window.setF(i,n)
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const [html, dir, n, f] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/' + html + (f ? '?f=file://' + f : ''), { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < +n; i++) { await p.evaluate(([i, n]) => window.setF(i, n), [i, +n]); await p.screenshot({ path: dir + '/f' + String(i).padStart(5, '0') + '.png' }); }
  await b.close(); console.log(n); })();
