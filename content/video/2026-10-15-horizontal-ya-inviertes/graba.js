// node graba.js <45|916> <muestras|video> [salida.mp4]  (motor de 2026-10-07-demo-caso-v2, muestras en tiempos fijos)
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path'), {execFileSync}=require('child_process');
(async () => {
  const [fmt, modo, salida] = process.argv.slice(2); const H = fmt==='916'?1920:1350, FPS=25;
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:1080,height:H},deviceScaleFactor:1});
  await p.goto('file://'+path.resolve(__dirname,'escena.html')+(fmt==='916'?'?f=916':''),{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  const el=await p.$('#e'); const DUR=await p.evaluate(()=>DUR);
  const dir=process.env.FRAMES||'/tmp/frames-h'+fmt; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
  if(modo==='muestras'){ const ks=(process.env.TS||'1.5,4,9,11.5,19,23,27,31.5,34.5,37,40,44,47,52').split(',').map(Number);
    for(const [i,t] of ks.entries()){ await p.evaluate(t=>window.setT(t),t); await el.screenshot({path:`${dir}/m${String(i).padStart(2,'0')}.png`}); } }
  else { const n=Math.round(FPS*DUR); for(let i=0;i<n;i++){ await p.evaluate(t=>window.setT(t),i/FPS); await el.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`}); }
    const ff=execFileSync('python3',['-c','import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();
    execFileSync(ff,['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/f%04d.png`,'-c:v','libx264','-pix_fmt','yuv420p','-crf','20',salida]); }
  console.log(modo,'ok',DUR); await b.close();
})();
