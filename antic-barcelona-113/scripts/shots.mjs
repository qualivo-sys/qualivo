import { chromium } from 'playwright';
const B = 'http://localhost:8123';
const errs = [];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1 });
const p = await ctx.newPage();
p.on('console', m => { if (m.type()==='error') errs.push('CONSOLE '+m.text()); });
p.on('pageerror', e => errs.push('PAGEERROR '+e.message));
p.on('requestfailed', r => errs.push('REQFAIL '+r.url()+' '+(r.failure()?.errorText||'')));

async function shot(path, file, scrolls=[]) {
  await p.goto(B+path, { waitUntil:'networkidle' });
  await p.waitForTimeout(2600);
  await p.screenshot({ path:`/tmp/shots/${file}-top.png` });
  for (const [i,y] of scrolls.entries()) {
    await p.evaluate(v => window.scrollTo({top:v, behavior:'instant'}), y);
    await p.waitForTimeout(1500);
    await p.screenshot({ path:`/tmp/shots/${file}-${i+1}.png` });
  }
}
await shot('/index.html','landing',[900, 2100, 3400, 5200, 6600, 8200]);
await shot('/guia.html','guia',[]);
await shot('/gracias.html','gracias',[]);
await shot('/cuestionario.html','quiz',[]);
await shot('/creatividades.html','board',[1400]);

// recorrido del cuestionario
await p.goto(B+'/cuestionario.html',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
await p.click('[data-val="Mesa"]'); await p.waitForTimeout(700);
await p.click('[data-val="Comedor"]'); await p.waitForTimeout(700);
await p.fill('#largo','240'); await p.fill('#ancho','100'); await p.fill('#com','8');
await p.screenshot({path:'/tmp/shots/quiz-medidas.png'});
await p.click('#next'); await p.waitForTimeout(700);
await p.click('[data-val="Rústico"]'); await p.waitForTimeout(400);
await p.screenshot({path:'/tmp/shots/quiz-estilo.png'});
await p.click('#next'); await p.waitForTimeout(700);
await p.fill('#pres','4500');
await p.click('#next'); await p.waitForTimeout(700);
await p.click('[data-val="Lo antes posible"]'); await p.waitForTimeout(800);
await p.fill('#nom','Marta Puig'); await p.fill('#mail','marta@ejemplo.com'); await p.fill('#wa','+34 600 111 222');
await p.check('#ok'); await p.waitForTimeout(300);
await p.screenshot({path:'/tmp/shots/quiz-contacto.png'});
await p.click('#next'); await p.waitForTimeout(1400);
await p.screenshot({path:'/tmp/shots/quiz-final.png', fullPage:true});
const tier = await p.textContent('.tier').catch(()=>null);
console.log('TIER=', tier && tier.trim());

// móvil
const m = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
const mp = await m.newPage();
await mp.goto(B+'/index.html',{waitUntil:'networkidle'}); await mp.waitForTimeout(2600);
await mp.screenshot({path:'/tmp/shots/m-landing.png'});
await mp.evaluate(()=>scrollTo(0,3200)); await mp.waitForTimeout(1400);
await mp.screenshot({path:'/tmp/shots/m-scene.png'});
await mp.goto(B+'/cuestionario.html',{waitUntil:'networkidle'}); await mp.waitForTimeout(900);
await mp.screenshot({path:'/tmp/shots/m-quiz.png'});
await b.close();
console.log('ERRORES:', errs.length ? errs.slice(0,15).join('\n') : 'ninguno');
