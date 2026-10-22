// node graba.js <muestras|video> [salida.mp4] [45] · 1080x1920 (o 1080x1350 con 45) a 25 fps; espera a que carguen los fotogramas de los clips.
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path'), {execFileSync}=require('child_process');
(async () => {
  const [modo, salida, fmt] = process.argv.slice(2); const FPS=25; const H=fmt==='45'?1350:1920;
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium', args:['--allow-file-access-from-files']});
  const p=await b.newPage({viewport:{width:1080,height:H},deviceScaleFactor:1});
  await p.goto('file://'+path.resolve(__dirname,process.env.ESCENA||'escena.html')+(fmt==='45'?'?f=45':''),{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  const el=await p.$('#e'); const DUR=await p.evaluate(()=>DURACION);
  const dir=process.env.FRAMES||'/tmp/frames-09'; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
  const ks = modo==='muestras' ? (process.env.TS||'0.5,1.2,3,6,8.3,10,13,16.5,20,23.5,27,31,35,37.5,42,47,50,54.5').split(',').map(Number) : null;
  const ts = ks || Array.from({length:Math.round(FPS*DUR)},(_,i)=>i/FPS);
  for(const [i,t] of ts.entries()){ await p.evaluate(t=>window.setT(t),t); await el.screenshot({path:`${dir}/${modo==='muestras'?'m':'f'}${String(i).padStart(4,'0')}.png`}); }
  if(modo!=='muestras'){ const ff=execFileSync('python3',['-c','import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();
    execFileSync(ff,['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/f%04d.png`,'-c:v','libx264','-pix_fmt','yuv420p','-crf','20',salida]); }
  console.log(modo,'ok',DUR); await b.close();
})();
