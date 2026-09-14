const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1180, height: 1450 } });
  await p.goto('file://' + __dirname + '/lamina.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await (await p.$('.page')).screenshot({ path: __dirname + '/muestra.png' });
  await b.close();
})();
