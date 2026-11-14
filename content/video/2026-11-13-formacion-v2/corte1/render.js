// node render.js <dir_fotogramas>  → JPG a 25 fps de escena.html
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const dir=process.argv[2];fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/escena.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
const dur=await p.evaluate(()=>window.DUR),n=Math.round(dur*25),el=await p.$('#e');
for(let i=0;i<n;i++){await p.evaluate(t=>window.setT(t),i/25);await el.screenshot({path:`${dir}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
console.log('fotogramas',n);await b.close();})();
