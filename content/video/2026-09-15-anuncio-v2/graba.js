const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const FPS=25, SEG=58.6, dir='/home/user/frames-v2';
  fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/escena.html',{waitUntil:'networkidle'});
  await p.waitForTimeout(1200);
  const el=await p.$('#e'); const total=Math.round(FPS*SEG);
  for(const t of [2.6,6.2,11.0,15.2,22.5,27.0,30.8,35.5,39.5,45.5,49.5,56.5]){
    await p.evaluate(t=>window.setT(t), t);
    await el.screenshot({path:__dirname+'/muestra-'+String(t).replace('.','_')+'.png'});
  }
  console.log('muestras listas');
  for(let i=0;i<total;i++){ await p.evaluate(t=>window.setT(t), i/FPS);
    await el.screenshot({path:dir+'/f'+String(i).padStart(4,'0')+'.png'});
    if(i%200===0) console.log('...',i,'/',total); }
  console.log('fotogramas:',total); await b.close();
})();
