const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:2940,height:2430},deviceScaleFactor:1.5});
await pg.goto('file://'+__dirname+'/galeria.html',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(800);
await pg.screenshot({path:__dirname+'/../corte2/rec/gal.png'});await pg.screenshot({path:__dirname+'/galeria.png',scale:'css'});await b.close();})();
