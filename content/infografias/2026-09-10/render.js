const { chromium } = require('playwright');
(async () => {
  const dir = '/home/user/qualivo/content/infografias/2026-09-10';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const n of ['no-digas','niveles','malo-bueno-excelente','sobrevalorado']) {
    const p = await b.newPage({ viewport: { width: 1160, height: 1440 } });
    await p.goto('file://' + dir + '/' + n + '.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(700);
    const el = await p.$('.page');
    await el.screenshot({ path: dir + '/' + n + '.png' });
    const over = await p.$eval('.page', pg => { const r = pg.getBoundingClientRect(); let o = []; pg.querySelectorAll('div,ul,li').forEach(d => { const c = d.getBoundingClientRect(); if (c.bottom > r.bottom - 2 && c.height > 0) o.push(d.className + ':' + d.textContent.trim().slice(0, 30)); }); return o; });
    console.log(n, 'desbordes:', over.length ? over.join(' | ') : 'ninguno');
    await p.close();
  }
  await b.close();
})();
