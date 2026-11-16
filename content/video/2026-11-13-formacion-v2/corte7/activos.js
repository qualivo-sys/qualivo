// node activos.js → rec/ad.png, land.png, land2.png, land3.png (anuncio y landing de Escuela Norte, propuesta C; caso de ejemplo)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const R=__dirname+'/rec/';
const pg=await b.newPage({viewport:{width:2200,height:1600},deviceScaleFactor:2});
await pg.goto('file://'+__dirname+'/../captacion-propuestas/propuestas2.html?p=c',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(800);
await pg.evaluate(()=>{document.querySelector('.tel').style.cssText+='border-radius:0;padding:0;background:none';document.querySelector('.pan').style.borderRadius='0';});
await (await pg.$('.ig')).screenshot({path:R+'ad.png'});
await (await pg.$('.pan')).screenshot({path:R+'land.png'});
await pg.evaluate(()=>{document.querySelector('.ck').remove();const v=['Laura Vidal','600 000 000','laura@correo.es','Tardes, a partir de las 18:00'];
 document.querySelectorAll('.cam').forEach((c,i)=>{c.style.color='#1a1a1a';(c.firstElementChild||c).textContent=v[i];if(!c.firstElementChild)c.textContent=v[i];});
 const k=document.querySelector('.chk i');k.style.cssText+='background:#12337A;border-color:#12337A;color:#fff;font-style:normal;font-size:14px;line-height:16px;text-align:center';k.textContent='✓';});
await (await pg.$('.pan')).screenshot({path:R+'land2.png'});
await pg.evaluate(()=>{const f=document.querySelector('.form');f.querySelector('.btn').style.cssText+='background:#1E8E5A';f.querySelector('.btn').textContent='✓ Solicitud enviada';
 f.querySelector('h3').textContent='¡Gracias, Laura!';const p=document.createElement('div');p.style.cssText='font-size:16px;color:#333;margin:-4px 0 12px;line-height:1.4';p.textContent='Hemos recibido tu solicitud. Te escribimos por WhatsApp en unos minutos.';f.querySelector('h3').after(p);});
await (await pg.$('.pan')).screenshot({path:R+'land3.png'});
const r=await pg.evaluate(()=>{const o={};for(const s of ['.pan','.form','.hero','.btn']){const e=document.querySelector(s).getBoundingClientRect();o[s]=[e.x,e.y,e.width,e.height].map(Math.round)}return o});console.log(JSON.stringify(r));
const r2=await pg.evaluate(()=>{const o={};for(const s of ['.ig','.cre','.bar']){const e=document.querySelector(s).getBoundingClientRect();o[s]=[e.x,e.y,e.width,e.height].map(Math.round)}return o});console.log(JSON.stringify(r2));
await b.close();})();
