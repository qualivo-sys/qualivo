const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const c = await b.newContext({ viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: __dirname + '/raw', size: { width: 1080, height: 1920 } } });
  const p = await c.newPage();
  await p.goto('file://' + __dirname + '/reel.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(16500);
  await c.close(); await b.close();
  console.log('grabado');
})();
