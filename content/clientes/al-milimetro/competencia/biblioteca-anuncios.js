const { chromium } = require('playwright');
(async()=>{
  const q=process.argv[2], out=process.argv[3];
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1300,height:2400},locale:'es-ES'});
  const url=`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ES&q=${encodeURIComponent(q)}&search_type=keyword_unordered&media_type=all`;
  await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>console.log('goto',e.message));
  await p.waitForTimeout(15000);
  for(let i=0;i<14;i++){ await p.mouse.wheel(0,3000); await p.waitForTimeout(2500); }
  const txt=await p.evaluate(()=>document.body.innerText);
  require('fs').writeFileSync(out+'.txt',txt);
  await p.screenshot({path:out+'.png',fullPage:false});
  console.log(txt.length); await b.close();
})();
