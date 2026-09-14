/**
 * Prueba del CRM sin tocar producción.
 *
 *   node scripts/crm/servidor-simulado.mjs &
 *   node scripts/crm/probar.mjs
 *
 * Levanta la landing con una hoja falsa y recorre el CRM entero en un
 * móvil de 390 px: acceso, listado, ficha, guardado y panel. Deja las
 * capturas en /tmp para poder mirarlas.
 */
import { chromium } from 'playwright';
const errores=[];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
p.on('console',m=>{ if(m.type()==='error') errores.push('consola: '+m.text()); });
p.on('pageerror',e=>errores.push('js: '+e.message));
p.on('response',r=>{if(r.status()>=400)errores.push('HTTP '+r.status()+' '+r.url());});
await p.goto('http://localhost:4321/crm',{waitUntil:'networkidle'});

// 1. la pantalla de acceso aparece porque el listado devuelve ok sin sesión real…
//    en el simulacro sí devuelve ok, así que entra directo. Forzamos el login:
await p.evaluate(()=>{document.querySelector('#acceso').hidden=false;document.querySelector('#app').hidden=true;});
await p.screenshot({path:'/tmp/crm-1-acceso.png'});
await p.fill('#pass','mal'); await p.click('#formAcceso button'); await p.waitForTimeout(400);
console.log('error de contraseña:', await p.textContent('#errAcceso'));
await p.fill('#pass','1234'); await p.click('#formAcceso button'); await p.waitForTimeout(600);

const tabs=await p.$$eval('#pestanas button',bs=>bs.map(b=>b.textContent.trim()));
console.log('pestañas:',tabs.join(' | '));
console.log('tarjetas en Hoy:',(await p.$$('.tarjeta')).length);
await p.screenshot({path:'/tmp/crm-2-hoy.png',fullPage:true});

await p.click('.tarjeta'); await p.waitForTimeout(450);
console.log('ficha abierta:', await p.isVisible('#ficha .hoja'), '· nombre:', await p.textContent('#ficha h3'));
await p.screenshot({path:'/tmp/crm-3-ficha.png',fullPage:true});
await p.selectOption('#fEstado','Presupuesto enviado');
await p.fill('#fImporte','4800');
await p.click('#bGuardar'); await p.waitForTimeout(700);
console.log('aviso tras guardar:', await p.textContent('#aviso'));
console.log('tarjetas en Hoy tras guardar:',(await p.$$('.tarjeta')).length);

// motivo de pérdida aparece solo al elegir Perdido
await p.click('[data-t="todos"]'); await p.waitForTimeout(300);
await p.click('.tarjeta'); await p.waitForTimeout(400);
console.log('motivo oculto de inicio:', await p.getAttribute('#cajaMotivo','hidden')!==null);
await p.selectOption('#fEstado','Perdido'); await p.waitForTimeout(150);
console.log('motivo visible al perder:', await p.isVisible('#fMotivo'));
await p.keyboard.press('Escape'); await p.waitForTimeout(300);

await p.click('[data-t="panel"]'); await p.waitForTimeout(400);
await p.screenshot({path:'/tmp/crm-4-panel.png',fullPage:true});
const cifras=await p.$$eval('.cifra',cs=>cs.map(c=>c.querySelector('b').textContent+' '+c.querySelector('span').textContent));
console.log('panel:',cifras.join(' | '));

// desbordamiento horizontal en móvil
// Comparar contra innerWidth no vale: si la página desborda, el propio
// innerWidth crece con ella y la comprobación siempre pasa. Se compara
// contra el ancho de pantalla que se pidió.
for (const t of ['hoy','abiertos','todos','panel']) {
  await p.click(`[data-t="${t}"]`); await p.waitForTimeout(250);
  const w = await p.evaluate(()=>document.documentElement.scrollWidth);
  console.log(`  ${t.padEnd(9)} scrollWidth ${w} vs 390 ->`, w<=391?'✓':'✗ DESBORDA');
}

// escritorio
const p2=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
await p2.goto('http://localhost:4321/crm',{waitUntil:'networkidle'});
await p2.waitForTimeout(500); await p2.click('[data-t="panel"]'); await p2.waitForTimeout(400);
await p2.screenshot({path:'/tmp/crm-5-escritorio.png',fullPage:true});

console.log(errores.length?'ERRORES:\n'+errores.join('\n'):'✓ sin errores de consola');
await b.close();
