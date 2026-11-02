const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const MODE=process.argv[2]||'muestras', FPS=25;
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/escena.html'+(process.env.VZ?'#'+process.env.VZ:''),{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
  const DUR=await p.evaluate(()=>window.TI.FIN);
  const el=await p.$('#e');
  const shot=async(t,path)=>{await p.evaluate(t=>window.setT(t),t); await el.screenshot({path,type:'jpeg',quality:92});};
  const d=process.argv[3];
  if(MODE==='muestras'){ fs.mkdirSync(d,{recursive:true}); for(const t of process.argv.slice(4).map(Number)) await shot(t,d+'/t'+t+'.jpg'); }
  else { fs.rmSync(d,{recursive:true,force:true}); fs.mkdirSync(d); const n=Math.round(FPS*DUR); for(let i=0;i<n;i++){ await shot(i/FPS,d+'/f'+String(i).padStart(4,'0')+'.jpg'); } console.log(DUR); }
  await b.close();
})();
