// node render-limpios.js → png/limpio-<n>-<formato>.png
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const k of ['m1','m2','m3'])for(const f of ['45','916']){
 const p=await b.newPage({viewport:{width:1080,height:f==='45'?1350:1920}});
 await p.goto('file://'+__dirname+'/limpios.html#'+k+'-'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await (await p.$('#e')).screenshot({path:`${__dirname}/png/limpio-${k[1]}-${f}.png`});await p.close();}
await b.close();})();
