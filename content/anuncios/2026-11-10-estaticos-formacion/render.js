// node render.js  → png/<pieza>-<formato>.png, avisa si algo se sale del lienzo
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();fs.mkdirSync(__dirname+'/png',{recursive:true});
for(const k of ['s1','s2','s3','s4','s5'])for(const f of ['45','916']){
 const p=await b.newPage({viewport:{width:1080,height:f==='45'?1350:1920}});
 await p.goto('file://'+__dirname+'/estaticos.html#'+k+'-'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const el=await p.$('#e');
 const fuera=await p.evaluate(()=>{const e=document.getElementById('e'),R=e.getBoundingClientRect(),cs=getComputedStyle(e),pb=parseFloat(cs.paddingBottom),pt=parseFloat(cs.paddingTop);const o=[];
  const kids=[...e.children];const tot=kids.reduce((s,c)=>s+c.getBoundingClientRect().height,0);if(tot>R.height-pb-pt)o.push('contenido '+Math.round(tot)+' > '+Math.round(R.height-pb-pt));
  for(const c of e.querySelectorAll('*')){const q=c.getBoundingClientRect();if(q.width&&(q.right>R.right-60||q.bottom>R.bottom-pb+2))o.push(c.className+':'+Math.round(q.right)+'/'+Math.round(q.bottom));}return o.slice(0,4)});
 await el.screenshot({path:`${__dirname}/png/${k}-${f}.png`});console.log(k,f,fuera.length?'⚠ '+fuera.join(' | '):'ok');await p.close();}
await b.close();})();
