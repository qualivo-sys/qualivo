const { chromium } = require('playwright');
const path=require('path');
(async()=>{
  const dir=process.argv[2];
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1200,height:2000}});
  await p.goto('file://'+path.join(dir,'piezas.html'),{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  const ids=await p.$$eval('.s',e=>e.map(x=>x.id));
  for(const id of ids){ await (await p.$('[id="'+id+'"]')).screenshot({path:path.join(dir,'png',id+'.png')}); }
  console.log(ids.join(' ')); await b.close();
})();
