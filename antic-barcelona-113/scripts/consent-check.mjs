import { chromium } from 'playwright';
const B='http://localhost:8123';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});

// 1) primera visita: banner visible y SIN llamadas a Facebook
let ctx=await b.newContext({viewport:{width:1440,height:900}});
let p=await ctx.newPage(); const fb=[];
p.on('request',r=>{ if(/facebook|fbevents/.test(r.url())) fb.push(r.url()); });
await p.goto(B+'/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
const visible=await p.isVisible('.cookiebar');
await p.screenshot({path:'/tmp/shots/cookiebar.png'});
console.log('1) banner visible:', visible, '| peticiones a Facebook antes de aceptar:', fb.length);

// 2) rechazar -> sigue sin cargar
await p.click('[data-consent="no"]'); await p.waitForTimeout(1500);
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(2000);
console.log('2) tras "Solo lo necesario" · banner:', await p.isVisible('.cookiebar').catch(()=>false), '| peticiones FB:', fb.length);

// 3) aceptar en contexto limpio -> el píxel carga
await ctx.close(); ctx=await b.newContext({viewport:{width:1440,height:900}});
p=await ctx.newPage(); const fb2=[];
p.on('request',r=>{ if(/facebook|fbevents/.test(r.url())) fb2.push(r.url()); });
await p.goto(B+'/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
await p.click('[data-consent="si"]'); await p.waitForTimeout(3000);
console.log('3) tras "Aceptar" · peticiones FB:', fb2.length, fb2.length? '→ '+fb2[0].slice(0,60):'');
console.log('   fbq definido:', await p.evaluate(()=>typeof window.fbq));
await b.close();
