const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const c = await b.newContext({ viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: __dirname + '/rawe', size: { width: 1080, height: 1920 } } });
  const p = await c.newPage();
  await p.goto('file://' + __dirname + '/reel-espera.html', { waitUntil: 'networkidle' });
  const ok = await p.evaluate(() => new Promise(r => { const v = document.getElementById('bg'); v.addEventListener('playing', () => r('playing'), {once:true}); setTimeout(() => r('timeout:' + v.readyState + ':' + (v.error && v.error.code)), 3000); }));
  console.log('video:', ok);
  await p.waitForTimeout(18500);
  await c.close(); await b.close();
})();
