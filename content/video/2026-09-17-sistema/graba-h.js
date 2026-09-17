const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const FPS=25, DUR=48.82, dir='/home/user/frames-sish', MODE=process.env.MODE||'todo';
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/escena-h.html',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
  const el=await p.$('#e');
  const muestras=[1.2,4.2,7.5,12.5,17.5,23.5,27.5,33,39,45.5];
  for(const t of muestras){ await p.evaluate(t=>window.setT(t), t); await el.screenshot({path:__dirname+'/muestras/h-'+String(t).replace('.','_')+'.png'}); }
  console.log('muestras listas');
  if(MODE==='todo'){ fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); const total=Math.round(FPS*DUR);
    for(let i=0;i<total;i++){ await p.evaluate(t=>window.setT(t), i/FPS); await el.screenshot({path:dir+'/f'+String(i).padStart(4,'0')+'.png'}); if(i%250===0) console.log('...',i,'/',total); }
    console.log('fotogramas:',total); }
  await b.close();
})();
