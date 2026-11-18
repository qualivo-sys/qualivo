// node render.js "<ver=larga&ap=h1&fmt=916>" <dir_fotogramas>  → JPG a 25 fps de escena.html
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const [q,dir]=process.argv.slice(2);fs.mkdirSync(dir,{recursive:true});
const h=q.includes('fmt=45')?1350:1920;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:h}});
await p.goto('file://'+__dirname+'/escena.html?'+q,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
const dur=await p.evaluate(()=>window.DUR),n=Math.round(dur*25),el=await p.$('#e');
for(let i=0;i<n;i++){await p.evaluate(t=>window.setT(t),i/25);await el.screenshot({path:`${dir}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
console.log('fotogramas',n);await b.close();})();
