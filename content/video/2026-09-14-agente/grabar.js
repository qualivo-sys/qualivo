const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const c = await b.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
    recordVideo: { dir: __dirname + '/raw2', size: { width: 1080, height: 1350 } }
  });
  const p = await c.newPage();
  await p.goto('file://' + __dirname + '/escena-v2.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(8600);   // deja terminar la animacion y respirar el remate
  await c.close();
  await b.close();
  console.log('grabado');
})();
