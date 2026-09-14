const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + __dirname + '/largo.html', { waitUntil: 'networkidle' });
  const marcas = [3000, 9500, 16000, 22000];
  let prev = 0;
  for (let i = 0; i < marcas.length; i++) {
    await p.waitForTimeout(marcas[i] - prev); prev = marcas[i];
    const vis = await p.evaluate(() => [...document.querySelectorAll('.esc')]
      .map((e,i) => 'e'+(i+1)+':'+Number(getComputedStyle(e).opacity).toFixed(2)).join('  '));
    console.log((marcas[i]/1000)+'s ->', vis);
    await p.screenshot({ path: __dirname + '/l-' + (i+1) + '.png' });
  }
  await b.close();
})();
