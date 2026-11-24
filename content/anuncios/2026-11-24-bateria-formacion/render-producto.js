// node render-producto.js → png/producto-<a|b>-<formato>.png
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const k of ['a','b'])for(const f of ['45','916']){const p=await b.newPage({viewport:{width:1080,height:f==='45'?1350:1920}});
 await p.goto('file://'+__dirname+'/producto.html#'+k+'-'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await (await p.$('#e')).screenshot({path:`${__dirname}/png/producto-${k}-${f}.png`});await p.close();}await b.close();})();
