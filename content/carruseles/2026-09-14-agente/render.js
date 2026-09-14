const { chromium } = require('playwright');
(async () => {
  const dir = __dirname;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1180, height: 1450 } });
  await p.goto('file://' + dir + '/laminas.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const n = await p.$$eval('.page', e => e.length);
  for (let i = 0; i < n; i++) {
    const el = (await p.$$('.page'))[i];
    await el.screenshot({ path: dir + '/lamina-' + (i + 1) + '.png' });
  }
  // desbordes
  const over = await p.$$eval('.page', pages => pages.map((pg, i) => {
    const r = pg.getBoundingClientRect(); const bad = [];
    pg.querySelectorAll('div,p').forEach(d => {
      const c = d.getBoundingClientRect();
      if (c.height > 0 && (c.bottom > r.bottom - 2 || c.right > r.right - 2)) bad.push((d.className||d.tagName) + ':' + d.textContent.trim().slice(0,24));
    });
    return 'lamina ' + (i+1) + ': ' + (bad.length ? bad.join(' | ') : 'ok');
  }));
  over.forEach(o => console.log(o));
  await b.close();
})();
