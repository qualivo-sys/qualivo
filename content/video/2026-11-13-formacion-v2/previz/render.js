const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const k of ['f1','f2','f3','f4','f5','f6']){const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/estilo.html#'+k,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await (await p.$('.f.on')).screenshot({path:__dirname+'/'+k+'.png'});await p.close();}
await b.close();})();
