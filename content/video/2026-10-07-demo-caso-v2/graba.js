// node graba.js <escena.html> <45|916> <muestras|video> [salida.mp4]
// muestras: tira de fotogramas para revisar; video: graba fotograma a fotograma y codifica a 25 fps (sin audio).
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path'), {execFileSync}=require('child_process');
(async () => {
  const [html, fmt, modo, salida] = process.argv.slice(2); const H = fmt==='916'?1920:1350, FPS=25;
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:1080,height:H},deviceScaleFactor:1});
  await p.goto('file://'+path.resolve(html)+(fmt==='916'?'?f=916':''),{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  const el=await p.$('#e'); const DUR=await p.evaluate(()=>DUR); const T=await p.evaluate(()=>T);
  const dir=process.env.FRAMES||'/tmp/frames-v2'; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
  if(modo==='muestras'){ const ks=Object.values(T).map(x=>x+1.6).concat([T.giro+.9, T.s4b+3.6, DUR-1]).sort((a,b)=>a-b);
    for(const [i,t] of ks.entries()){ await p.evaluate(t=>window.setT(t),t); await el.screenshot({path:`${dir}/m${String(i).padStart(2,'0')}.png`}); } }
  else { const n=Math.round(FPS*DUR); for(let i=0;i<n;i++){ await p.evaluate(t=>window.setT(t),i/FPS); await el.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`}); }
    const ff=execFileSync('python3',['-c','import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();
    execFileSync(ff,['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/f%04d.png`,'-c:v','libx264','-pix_fmt','yuv420p','-crf','20',salida]); }
  console.log(modo,'ok',DUR); await b.close();
})();
