const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = '/home/user/qualivo/content/carruseles/2026-09-10-primero-luego';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1160, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto('file://' + dir + '/carrusel.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const pages = await p.$$('.page');
  console.log('laminas:', pages.length);
  for (let i = 0; i < pages.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    await pages[i].screenshot({ path: path.join(dir, 'lamina-' + n + '.png') });
  }
  // desbordes de texto
  const malos = await p.$$eval('.page', ns => ns.map((n, i) => {
    const r = n.getBoundingClientRect();
    let out = [];
    n.querySelectorAll('div').forEach(d => {
      const c = d.getBoundingClientRect();
      if (c.bottom > r.bottom - 4 || c.right > r.right - 4 || c.top < r.top - 4) out.push((d.className||'?') + ':' + d.textContent.slice(0,28));
    });
    return out.length ? (i + 1) + ' -> ' + out.join(' | ') : null;
  }).filter(Boolean));
  console.log('desbordes:', malos.length ? malos.join('\n') : 'ninguno');
  await b.close();
})();
