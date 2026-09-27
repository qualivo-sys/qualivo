const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const MODE=process.argv[2]||'muestras', FPS=25, DUR=16.0;
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/escena.html',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  // precarga de fotogramas de Maikel
  await p.evaluate(async()=>{const ps=[];for(let i=1;i<=225;i++){const im=new Image();im.src='mk/m'+String(i).padStart(3,'0')+'.jpg';ps.push(im.decode().catch(()=>{}));}await Promise.all(ps);});
  const el=await p.$('#e');
  const shot=async(t,path)=>{await p.evaluate(t=>window.setT(t),t); await p.evaluate(()=>Promise.all([...document.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})))); await el.screenshot({path,type:'jpeg',quality:92});};
  if(MODE==='muestras'){ fs.mkdirSync(__dirname+'/muestras',{recursive:true}); for(const t of [1.5,3.4,5.2,7.0,8.5,10.2,12.0,13.5,15.6]) await shot(t,__dirname+'/muestras/t'+t+'.jpg'); }
  else { const d=__dirname+'/frames'; fs.rmSync(d,{recursive:true,force:true}); fs.mkdirSync(d); const n=Math.round(FPS*DUR); for(let i=0;i<n;i++){ await shot(i/FPS,d+'/f'+String(i).padStart(4,'0')+'.jpg'); if(i%100===0) console.log(i,'/',n);} }
  await b.close();
})();
