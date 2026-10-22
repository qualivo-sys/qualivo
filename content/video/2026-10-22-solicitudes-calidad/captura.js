// node captura.js <raiz-de-la-web> : sirve la landing v22 en local y guarda capturas de la demo a 390 px (×3 = 1170 px de ancho).
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const RAIZ = path.resolve(process.argv[2]); const OUT = path.join(__dirname, 'capturas');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(RAIZ, p); if (!f.startsWith(RAIZ) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': tipos[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(8765);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  await p.goto('http://localhost:8765/formacion/v22/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  await p.evaluate(() => { document.querySelectorAll('#consent, .consent, [id*=cookie], [class*=cookie], #fijo').forEach(e => e.remove()); document.querySelectorAll('body *').forEach(e => { if (getComputedStyle(e).position === 'fixed') e.remove(); }); });
  const tab = async i => { await p.click('#tab-' + i); await p.waitForTimeout(400); };
  const foto = async (sel, nombre) => { const e = await p.$(sel); await e.screenshot({ path: path.join(OUT, nombre + '.png') }); console.log('ok', nombre); };
  await foto('#hero', 'portada');
  await tab(1); await foto('#vista-1 .claro', 'formulario');
  await tab(2); await p.waitForTimeout(600);
  const quiero = await p.$('xpath=//div[@id="chat"]//button[contains(., "Sí")]');
  if (quiero) { await quiero.click(); await p.waitForTimeout(1200); }
  await foto('#vista-2 .tel', 'whatsapp');
  await tab(4); await foto('#vista-4 .claro', 'ficha');
  await tab(5); await foto('#vista-5 .claro', 'citas');
  await tab(8); await foto('#vista-8 .claro', 'hoy');
  await b.close(); srv.close();
})();
