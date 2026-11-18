// node captura.js → ../rec/gal.png, adc.jpg, lp0-2.png (academia ficticia «Escuela Norte», curso de Marketing Digital)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const R=__dirname+'/../rec/';
let pg=await b.newPage({viewport:{width:2940,height:2430},deviceScaleFactor:1.5});
await pg.goto('file://'+__dirname+'/galeria.html',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(800);
await pg.screenshot({path:R+'gal.png'});await (await pg.$('#a1')).screenshot({path:R+'adc.jpg',type:'jpeg',quality:88});await pg.close();
for(const e of [0,1,2]){pg=await b.newPage({viewport:{width:640,height:1200},deviceScaleFactor:2});
await pg.goto('file://'+__dirname+'/landing.html?e='+e,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(600);
await pg.screenshot({path:R+'lp'+e+'.png',fullPage:true});
if(e==0)console.log(JSON.stringify(await pg.evaluate(()=>{const o={H:document.body.scrollHeight};for(const s of ['#form','#btn']){const r=document.querySelector(s).getBoundingClientRect();o[s]=[r.x,r.y+scrollY,r.width,r.height].map(Math.round)}return o})));
await pg.close();}
await b.close();})();