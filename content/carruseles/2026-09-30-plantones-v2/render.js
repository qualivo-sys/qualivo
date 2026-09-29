// Renderiza cada .page de carrusel.html a lamina-N.png (1080 × 1350).
// Uso: NODE_PATH=/ruta/a/node_modules node render.js
// (Playwright + Chromium; cambia CHROME si el navegador está en otra ruta.)
const path = require('path');
const { chromium } = require('playwright');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const b = await chromium.launch({ executablePath: CHROME });
  const p = await b.newPage({ viewport: { width: 1180, height: 1450 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'carrusel.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  // Aviso de desbordes: texto que se sale de su caja o se mete en el pie.
  const avisos = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      const pr = pg.getBoundingClientRect();
      const inn = pg.querySelector('.in');
      if (inn && inn.scrollHeight > inn.clientHeight + 1) out.push(`lámina ${i + 1}: el contenido desborda (${inn.scrollHeight} > ${inn.clientHeight})`);
      pg.querySelectorAll('.in *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > pr.right - 40 || r.bottom > pr.bottom - 150)) out.push(`lámina ${i + 1}: <${el.tagName.toLowerCase()} class="${el.className}"> se acerca al borde o al pie`);
      });
    });
    return out;
  });
  avisos.forEach(a => console.log('AVISO', a));
  const pages = await p.$$('.page');
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: path.join(__dirname, `lamina-${i + 1}.png`) });
    console.log(`lamina-${i + 1}.png`);
  }
  await b.close();
})();
