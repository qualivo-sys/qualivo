const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1180, height: 1450 } });
  await p.goto('file://' + __dirname + '/serie.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const els = await p.$$('.p');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: __dirname + '/s-' + (i+2) + '.png' });
  const over = await p.$$eval('.p', ps => ps.map((pg,i) => { const r=pg.getBoundingClientRect(); let bad=0; pg.querySelectorAll('div').forEach(d=>{const c=d.getBoundingClientRect(); if(c.height>0&&(c.bottom>r.bottom-2||c.right>r.right-2)) bad++;}); return 's-'+(i+2)+(bad?': DESBORDA':': ok'); }));
  console.log(over.join(' | ')); await b.close();
})();
