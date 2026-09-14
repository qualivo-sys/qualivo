const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/reel.html', { waitUntil: 'networkidle' });
  const marcas = [1600, 8200, 13500];
  let prev = 0;
  for (let i = 0; i < marcas.length; i++) {
    await p.waitForTimeout(marcas[i] - prev); prev = marcas[i];
    const c = await p.$eval('#c', e => e.textContent);
    console.log((marcas[i]/1000)+'s · contador: ' + c);
    await p.screenshot({ path: __dirname + '/r-' + (i+1) + '.png' });
  }
  await b.close();
})();
