// node render-final.js → png/sistema-completo-FINAL-45.png y -916.png
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const f of ['45','916']){const p=await b.newPage({viewport:{width:1080,height:f==='45'?1350:1920}});
 await p.goto('file://'+__dirname+'/final.html#'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const o=await p.evaluate(f=>{const lo=f==='916'?285:20,hi=f==='916'?1525:1330;return [...document.querySelectorAll('.id,h1,.sub,.col,.cie,.cta,.lg')].map(c=>[c.className||c.tagName,c.getBoundingClientRect()]).filter(([n,q])=>q.top<lo||q.bottom>hi||q.right>1060).map(([n,q])=>n+' '+Math.round(q.top)+'-'+Math.round(q.bottom))},f);
 await (await p.$('#e')).screenshot({path:`${__dirname}/png/sistema-completo-FINAL-${f}.png`});console.log(f,o.length?'⚠ '+o.join(' | '):'ok');await p.close();}await b.close();})();
