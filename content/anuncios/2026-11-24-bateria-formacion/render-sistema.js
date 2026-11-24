// node render-sistema.js → png/sistema-completo-45.png y -916.png
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const f of ['45','916']){const p=await b.newPage({viewport:{width:1080,height:f==='45'?1350:1920}});
 await p.goto('file://'+__dirname+'/sistema.html#'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const o=await p.evaluate(f=>{const R=document.getElementById('e').getBoundingClientRect(),lo=f==='916'?285:20,hi=f==='916'?1525:R.height-20;return [...document.querySelectorAll('.id,h1,.tab,.cie,.of,.lg')].map(c=>c.getBoundingClientRect()).filter(q=>q.top<lo||q.bottom>hi||q.right>R.width-20).length},f);
 await (await p.$('#e')).screenshot({path:`${__dirname}/png/sistema-completo-${f}.png`});console.log(f,o?'⚠ '+o+' fuera':'ok');await p.close();}await b.close();})();
