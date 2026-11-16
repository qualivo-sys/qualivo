// node render2.js → propuesta-c.png y propuesta-d.png
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const p of ['c','d']){const pg=await b.newPage({viewport:{width:2200,height:1600}});
await pg.goto('file://'+__dirname+'/propuestas2.html?p='+p,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(800);
await pg.screenshot({path:__dirname+'/propuesta-'+p+'.png'});await pg.close();}
await b.close();})();
