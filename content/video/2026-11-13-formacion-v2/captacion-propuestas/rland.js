const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const R=__dirname+'/../corte2/rec/';
for(const e of [0,1,2]){const pg=await b.newPage({viewport:{width:640,height:1200},deviceScaleFactor:2});
await pg.goto('file://'+__dirname+'/landing.html?e='+e,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(600);
await pg.screenshot({path:R+'lp'+e+'.png',fullPage:true});
if(e==2){console.log(JSON.stringify(await pg.evaluate(()=>{const o={H:document.body.scrollHeight};for(const s of ['#form','#btn','.tem','.cal','.hero']){const r=document.querySelector(s).getBoundingClientRect();o[s]=[r.x,r.y+scrollY,r.width,r.height].map(Math.round)}return o})));}
if(e==0){console.log(JSON.stringify(await pg.evaluate(()=>{const o={H:document.body.scrollHeight};for(const s of ['#form','#btn']){const r=document.querySelector(s).getBoundingClientRect();o[s]=[r.x,r.y+scrollY,r.width,r.height].map(Math.round)}return o})));}
await pg.close();}
await b.close();})();
