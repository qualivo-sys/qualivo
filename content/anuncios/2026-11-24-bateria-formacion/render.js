// node render.js → png/<ad>-<formato>.png · avisa si algo se sale del lienzo o de la zona segura del 9:16 (290-1520 px)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const k of ['ad1','ad2','ad3'])for(const f of ['45','916']){
 const p=await b.newPage({viewport:{width:1080,height:f==='45'?1350:1920}});
 await p.goto('file://'+__dirname+'/estaticos.html#'+k+'-'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const av=await p.evaluate(f=>{const e=document.getElementById('e'),R=e.getBoundingClientRect(),o=[];const lo=f==='916'?285:20,hi=f==='916'?1525:R.height-20;
  for(const c of e.querySelectorAll('h1,.ant,.t,li,.cie,.cta,.lg,.caja,h2')){const q=c.getBoundingClientRect();if(q.left<20||q.right>R.width-20||q.top<lo||q.bottom>hi)o.push((c.className||c.tagName)+' '+Math.round(q.left)+','+Math.round(q.top)+'-'+Math.round(q.right)+','+Math.round(q.bottom));}return o.slice(0,5)},f);
 await (await p.$('#e')).screenshot({path:`${__dirname}/png/${k}-${f}.png`});console.log(k,f,av.length?'⚠ '+av.join(' | '):'ok');await p.close();}
await b.close();})();
