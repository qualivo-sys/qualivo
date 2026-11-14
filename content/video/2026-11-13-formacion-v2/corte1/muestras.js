const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/escena.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const ts=process.argv.slice(2).map(Number);let i=0;for(const t of ts){await p.evaluate(t=>window.setT(t),t);await (await p.$('#e')).screenshot({path:`/tmp/claude-0/-home-user-qualivo/f104f92b-2ae6-5a57-ad4b-fbc3a43f0d92/scratchpad/v2cap/m${String(i++).padStart(2,'0')}.png`});}
await b.close();})();
