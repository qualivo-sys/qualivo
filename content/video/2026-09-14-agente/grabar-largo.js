const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const c = await b.newContext({ viewport: { width: 1080, height: 1350 },
    recordVideo: { dir: __dirname + '/raw3', size: { width: 1080, height: 1350 } } });
  const p = await c.newPage();
  await p.goto('file://' + __dirname + '/largo.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(24500);
  await c.close(); await b.close();
  console.log('grabado 24s');
})();
