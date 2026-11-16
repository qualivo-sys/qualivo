// node render.js → propuesta-a.png y propuesta-b.png
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const p of ['a','b']){const pg=await b.newPage({viewport:{width:2200,height:1600}});
await pg.goto('file://'+__dirname+'/propuestas.html?p='+p,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(800);
await pg.screenshot({path:__dirname+'/propuesta-'+p+'.png'});await pg.close();}
await b.close();})();
