const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1180, height: 1450 } });
  await p.goto('file://' + __dirname + '/carrusel.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const els = await p.$$('.page');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: __dirname + '/m-' + (i + 1) + '.png' });
  console.log('laminas:', els.length);
  await b.close();
})();
