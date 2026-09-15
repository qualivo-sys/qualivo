const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1180, height: 2020 } });
  await p.goto('file://' + __dirname + '/a916.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const els = await p.$$('.p');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: __dirname + '/v-' + (i+1) + '.png' });
  // prueba de los 4 cm: como se ve de verdad en un feed de movil
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: __dirname + '/vmini-' + (i+1) + '.png', scale: 'css' });
  }
  console.log('piezas:', els.length);
  await b.close();
})();
