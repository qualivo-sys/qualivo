const { chromium } = require('playwright');
(async () => {
  const dir = '/home/user/qualivo/content/anuncios/2026-09-11-v2';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1160, height: 1440 } });
  await p.goto('file://' + dir + '/anuncios.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const ads = await p.$$('.ad');
  console.log('anuncios:', ads.length);
  for (let i = 0; i < ads.length; i++) await ads[i].screenshot({ path: dir + '/anuncio-0' + (i + 1) + '.png' });
  const over = await p.$$eval('.ad', ns => ns.map((n, i) => {
    const r = n.getBoundingClientRect(); const o = [];
    n.querySelectorAll('div,ul,li').forEach(d => { const c = d.getBoundingClientRect(); if (c.height > 0 && (c.bottom > r.bottom - 2 || c.top < r.top - 2)) o.push(d.className || '?'); });
    return o.length ? (i + 1) + ':' + o.join(',') : null;
  }).filter(Boolean));
  console.log('desbordes:', over.length ? over.join(' | ') : 'ninguno');
  await b.close();
})();
