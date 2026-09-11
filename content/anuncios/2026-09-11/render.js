const { chromium } = require('playwright');
(async () => {
  const dir = '/home/user/qualivo/content/anuncios/2026-09-11';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1160, height: 1440 } });
  await p.goto('file://' + dir + '/anuncios.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  // solapes reales entre bloques dentro de cada anuncio
  const sol = await p.$$eval('.ad', ads => ads.map((ad, i) => {
    const bloques = [...ad.querySelectorAll('.t,.mit,.pie,.cta,.lista,.big,.sub,.chat,.firma')].map(n => ({ c: n.className, r: n.getBoundingClientRect() }));
    const out = [];
    for (let a = 0; a < bloques.length; a++) for (let c = a + 1; c < bloques.length; c++) {
      const A = bloques[a].r, B = bloques[c].r;
      if (A.bottom > B.top + 3 && B.bottom > A.top + 3 && A.right > B.left + 3 && B.right > A.left + 3)
        out.push(bloques[a].c + ' ↔ ' + bloques[c].c);
    }
    return out.length ? (i + 1) + ': ' + out.join(' | ') : null;
  }).filter(Boolean));
  console.log('solapes:', sol.length ? sol.join('\n') : 'ninguno');
  const ads = await p.$$('.ad');
  for (let i = 0; i < ads.length; i++) await ads[i].screenshot({ path: dir + '/anuncio-0' + (i + 1) + '.png' });
  await b.close();
})();
