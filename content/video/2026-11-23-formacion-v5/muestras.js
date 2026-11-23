// node muestras.js <escena.html?ap=a> <salida.png> t1 t2 …   (hoja de fotogramas)
const { chromium } = require('playwright');
(async () => { const [url, out, ...ts] = process.argv.slice(2); const alto = url.includes('-45') ? 1350 : 1920;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: alto } });
  await p.goto('file://' + __dirname + '/' + url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1000); const el = await p.$('#e'); const bufs = [];
  for (const t of ts) { await p.evaluate(t => window.setT(t), +t); bufs.push((await el.screenshot({ type: 'jpeg', quality: 80 })).toString('base64')); }
  const w = 300, h = Math.round(w * alto / 1080); await p.setViewportSize({ width: Math.min(ts.length, 8) * (w + 6), height: Math.ceil(ts.length / 8) * (h + 6) });
  await p.setContent('<body style="margin:0;display:flex;flex-wrap:wrap;gap:6px;background:#333">' + bufs.map(x => `<img style="width:${w}px" src="data:image/jpeg;base64,${x}">`).join('') + '</body>');
  await p.screenshot({ path: out }); await b.close(); })();
