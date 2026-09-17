const { chromium } = require('playwright');
(async () => {
  const dir = '/home/user/qualivo/content/infografias/2026-09-17';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const n of ['test-dependencia','ranking-inverso']) {
    const p = await b.newPage({ viewport: { width: 1160, height: 1440 } });
    await p.goto('file://' + dir + '/' + n + '.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(700);
    const el = await p.$('.page');
    await el.screenshot({ path: dir + '/' + n + '.png' });
    const over = await p.$eval('.page', pg => { const r = pg.getBoundingClientRect(); let o = []; pg.querySelectorAll('div').forEach(d => { const c = d.getBoundingClientRect(); if (c.bottom > r.bottom - 2 && c.height > 0) o.push(d.className + ':' + d.textContent.trim().slice(0, 30)); }); return o; });
    const overlap = await p.$eval('.page', pg => { const els=[...pg.querySelectorAll('.q,.r,.res,.pie,.sub')]; let o=[]; for(let i=0;i<els.length;i++){for(let j=i+1;j<els.length;j++){const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect(); if(a.top<b.bottom-1&&b.top<a.bottom-1&&a.height>0&&b.height>0) o.push(els[i].className+'~'+els[j].className);}} return o; });
    console.log(n, 'desbordes:', over.length ? over.join(' | ') : 'ninguno', '| solapes:', overlap.length ? overlap.join(' | ') : 'ninguno');
    await p.close();
  }
  await b.close();
})();
