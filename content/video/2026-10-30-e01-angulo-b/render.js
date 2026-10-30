const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const MODE=process.argv[2]||'muestras', FPS=25, DUR=17.0;
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/escena.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
  const el=await p.$('#e');
  const shot=async(t,path)=>{await p.evaluate(t=>window.setT(t),t); await el.screenshot({path,type:'jpeg',quality:92});};
  if(MODE==='muestras'){ fs.mkdirSync(__dirname+'/muestras',{recursive:true}); for(const t of [1.0,3.2,5.5,8.5,11.5,13.0,16.5]) await shot(t,__dirname+'/muestras/t'+t+'.jpg'); }
  else { const d=process.argv[3]; fs.rmSync(d,{recursive:true,force:true}); fs.mkdirSync(d); const n=Math.round(FPS*DUR); for(let i=0;i<n;i++){ await shot(i/FPS,d+'/f'+String(i).padStart(4,'0')+'.jpg'); } }
  await b.close();
})();
