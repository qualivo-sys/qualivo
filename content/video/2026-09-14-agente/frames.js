const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + __dirname + '/escena.html', { waitUntil: 'networkidle' });
  const marcas = [1000, 3400, 5000, 6600];
  let prev = 0;
  for (let i = 0; i < marcas.length; i++) {
    await p.waitForTimeout(marcas[i] - prev); prev = marcas[i];
    await p.screenshot({ path: __dirname + '/frame-' + (i + 1) + '.png' });
  }
  await b.close(); console.log('fotogramas listos');
})();
