const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const FPS=25, SEG=parseFloat(process.env.SEG||'40'), dir='/home/user/frames-v4';
  fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/escena.html',{waitUntil:'networkidle'});
  await p.waitForTimeout(1200);
  const el=await p.$('#e'); const total=Math.round(FPS*SEG);
  const muestras=[]; for(let i=0;i<12;i++) muestras.push(+(SEG*(i+0.55)/12).toFixed(2));
  for(const t of muestras){ await p.evaluate(t=>window.setT(t), t); await el.screenshot({path:__dirname+'/muestra-'+String(t).replace('.','_')+'.png'}); }
  console.log('muestras listas');
  for(let i=0;i<total;i++){ await p.evaluate(t=>window.setT(t), i/FPS);
    await el.screenshot({path:dir+'/f'+String(i).padStart(4,'0')+'.png'});
    if(i%200===0) console.log('...',i,'/',total); }
  console.log('fotogramas:',total); await b.close();
})();
