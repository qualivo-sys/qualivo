// Fotogramas de la apertura: node render_apertura.js <escena.html#gN> <dir> <duración> <corte original>
// Si la apertura dura más que la tarjeta original, la tarjeta se queda quieta y su salida (los últimos 0,8 s) se desplaza al final.
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [url, dir, L, C] = [process.argv[2], process.argv[3], +process.argv[4], +process.argv[5]], FPS = 25, SAL = 0.8;
  const b = await chromium.launch(); const html = url.split('#')[0];
  const alto = html.includes('-45') ? 1350 : 1920;
  const p = await b.newPage({ viewport: { width: 1080, height: alto }, deviceScaleFactor: 1 });
  await p.goto('file://' + url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const el = await p.$('#e'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const n = Math.round(L * FPS);
  for (let i = 0; i < n; i++) { const t = i / FPS, ts = t < L - SAL ? Math.min(t, C - SAL) : C - (L - t);
    await p.evaluate(t => window.setT(t), ts); await el.screenshot({ path: dir + '/f' + String(i).padStart(5, '0') + '.jpg', type: 'jpeg', quality: 93 }); }
  await b.close(); console.log(n);
})();
