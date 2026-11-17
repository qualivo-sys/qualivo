// node muestras.js "<query>" <salida.png> t1 t2 …  → hoja de fotogramas
const {chromium}=require('playwright');(async()=>{const [q,out,...ts]=process.argv.slice(2);const h=q.includes('fmt=45')?1350:1920;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:h}});
await p.goto('file://'+__dirname+'/escena.html?'+q,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(900);
const bufs=[];for(const t of ts){await p.evaluate(t=>window.setT(t),+t);bufs.push((await (await p.$('#e')).screenshot()).toString('base64'));}
await p.setViewportSize({width:ts.length*366,height:Math.round(360*h/1080)+6});
await p.setContent('<body style="margin:0;background:#fff;display:flex;gap:6px">'+bufs.map(x=>'<img style="width:360px" src="data:image/png;base64,'+x+'">').join('')+'</body>');
await p.screenshot({path:out});await b.close();})();
