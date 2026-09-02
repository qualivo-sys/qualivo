import { chromium } from 'playwright';
const B='https://antic-barcelona-113.vercel.app';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const errs=[];
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
p.on('pageerror',e=>errs.push('JS '+e.message));
p.on('requestfailed',r=>errs.push('REQ '+r.url()));
for(const [path,name,ys] of [['/', 'live-landing',[0,2600,5000,7400]],['/creatividades','live-board',[0,1600]],['/cuestionario','live-quiz',[0]]]){
  await p.goto(B+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2800);
  for(const [i,y] of ys.entries()){ await p.evaluate(v=>scrollTo({top:v,behavior:'instant'}),y); await p.waitForTimeout(1400); await p.screenshot({path:`/tmp/shots/${name}-${i}.png`}); }
}
await b.close();
console.log('errores:', errs.length? [...new Set(errs)].slice(0,6).join('\n'):'ninguno');
