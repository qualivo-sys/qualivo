const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1180, height: 1450 } });
  await p.goto('file://' + __dirname + '/defunciones.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  await (await p.$('.p')).screenshot({ path: __dirname + '/defunciones.png' });
  await b.close(); console.log('ok');
})();
