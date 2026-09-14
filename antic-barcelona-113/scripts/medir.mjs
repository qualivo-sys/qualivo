import { chromium } from 'playwright';
import path from 'path';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await (await b.newContext()).newPage();
await p.goto('file://' + path.resolve('guia/guia.html'), { waitUntil:'networkidle' });
await p.waitForTimeout(2000);
const r = await p.evaluate(() => {
  const A4 = 297 * (96/25.4);
  return [...document.querySelectorAll('.pg')].map((el, i) => {
    const prev = el.style.overflow; el.style.overflow = 'visible';
    const real = el.scrollHeight;                       // alto sin recortar
    el.style.overflow = prev;
    // ¿el último bloque de contenido invade el pie?
    const pie = el.querySelector('.pie');
    const hijos = [...el.children].filter(c => !c.classList.contains('pie'));
    const ultimo = hijos[hijos.length - 1];
    const finContenido = ultimo ? ultimo.getBoundingClientRect().bottom : 0;
    const topPie = pie ? pie.getBoundingClientRect().top : 0;
    return { i, realPx: Math.round(real), A4: Math.round(A4),
      sobra: Math.max(0, Math.round(real - A4)),
      pisaPie: pie && finContenido > topPie ? Math.round(finContenido - topPie) : 0 };
  });
});
console.table(r);
const mal = r.filter(x => x.sobra || x.pisaPie);
console.log(mal.length ? '⚠ páginas con problema: ' + mal.map(x=>x.i).join(', ') : '✔ las 9 páginas caben sin recortar');
await b.close();
