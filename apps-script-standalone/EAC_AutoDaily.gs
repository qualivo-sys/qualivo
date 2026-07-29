/**
 * ═══════════════════════════════════════════════════════════════
 *  EAC · Auto-actualización diaria del panel de métricas
 * ═══════════════════════════════════════════════════════════════
 *  Actualiza solo cada día la pestaña del mes actual + "Curso × Etapa"
 *  con datos EN VIVO de Meta Ads, Google Ads y el CRM (GoHighLevel).
 *
 *  INSTALACIÓN (una sola vez, ~5 min):
 *   1. Abre el sheet → menú Extensiones → Apps Script.
 *   2. Borra lo que haya y pega TODO este archivo. Guarda (💾).
 *   3. En el panel izquierdo: Servicios (＋) → busca "Sheets API" → Añadir.
 *   4. Arriba selecciona la función  setup  y pulsa ▶ Ejecutar.
 *      Google te pedirá autorizar → Permitir (es tu cuenta, tu sheet).
 *   5. Listo. Se ejecutará solo cada día ~07:15 (hora de España).
 *
 *  Para probar al momento: ejecuta  refreshDashboard  manualmente.
 *  TikTok es manual: actualiza TIKTOK_SPEND / TIKTOK_CONV cuando cambien.
 *
 *  ⚠️ META_TOKEN: usa un token de "Usuario del Sistema" (Business Settings
 *     → Usuarios del sistema → Generar token, sin caducidad) para que NO
 *     se rompa. Si pones uno normal, caduca en horas/días.
 * ═══════════════════════════════════════════════════════════════
 */

var CFG = {
  SHEET_ID:      '1Xc3g7fNmmJE5wcQyKIOvVmGHf7hlJRMCxxQ_-46axyM',
  META_TOKEN:    'PEGA_AQUI_TOKEN_META',           // usuario del sistema (no caduca)
  META_ACT:      'act_10151404080652508',
  G_CLIENT_ID:   'PEGA_AQUI',
  G_CLIENT_SECRET:'PEGA_AQUI',
  G_REFRESH:     'PEGA_AQUI',
  G_DEV:         'PEGA_AQUI',
  G_CID:         '8699549656',
  G_MCC:         '9812988446',
  GHL_TOKEN:     'PEGA_AQUI',
  GHL_LOC:       'PEGA_AQUI',
  GHL_PIPE:      'PEGA_AQUI',
  TIKTOK_SPEND:  430.66,   // manual
  TIKTOK_CONV:   37,       // manual
  MATRICULA:     4400,
  BUDGET:        4000,
  TZ:            'Europe/Madrid'
};

// ── Colores (formato) ──
var DARK={red:.06,green:.15,blue:.25}, ACC={red:.12,green:.44,blue:.92}, LIGHT={red:.90,green:.94,blue:.99},
    BAND={red:.965,green:.977,blue:.99}, WHITE={red:1,green:1,blue:1}, MUT={red:.36,green:.44,blue:.54},
    GOOD={red:.07,green:.52,blue:.35}, BAD={red:.76,green:.23,blue:.20},
    GOODBG={red:.89,green:.96,blue:.92}, BADBG={red:.99,green:.92,blue:.91}, ACCBG={red:.90,green:.94,blue:.99};

// ═══════════════ SETUP / TRIGGER ═══════════════
function setup(){
  ScriptApp.getProjectTriggers().forEach(function(t){
    if(t.getHandlerFunction()==='refreshDashboard') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('refreshDashboard').timeBased().everyDays(1).atHour(7).nearMinute(15)
    .inTimezone(CFG.TZ).create();
  refreshDashboard();
  SpreadsheetApp.getActive().toast('✅ Auto-actualización diaria activada (~07:15).','EAC',8);
}

// ═══════════════ MAIN ═══════════════
function refreshDashboard(){
  var r = monthRange();
  var meta = pullMeta(r), goog = pullGoogle(r), crm = pullGHL(r);
  writeMonthTab(r, meta, goog, crm);
  writeMatrixTab(r, crm);
  Logger.log('OK '+r.name+' · Meta €'+meta.tot.s.toFixed(0)+'/'+meta.tot.l+' · Google €'+goog.s.toFixed(0)+' · CRM '+crm.creadas+' matr '+crm.matriculas);
}

// ═══════════════ HELPERS ═══════════════
function pad(n){return (n<10?'0':'')+n;}
function monthRange(){
  var now=new Date(), tz=CFG.TZ;
  var y=Number(Utilities.formatDate(now,tz,'yyyy')), mo=Number(Utilities.formatDate(now,tz,'MM'));
  var lastDay=new Date(y,mo,0).getDate();
  var names=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return {first:y+'-'+pad(mo)+'-01', last:y+'-'+pad(mo)+'-'+pad(lastDay), ym:y+'-'+pad(mo), name:names[mo-1], day:Number(Utilities.formatDate(now,tz,'dd'))};
}
function course(t){var s=(t||'').toLowerCase();
  if(/azafata.?de.?tierra|tierra|\bat\b/.test(s))return'AT';
  if(/despachad|dispatch|\bfd\b/.test(s))return'FD';
  if(/tcp|tripulante|auxiliar|cabina|de.?vuelo|azafata/.test(s))return'TCP';
  return'General';}
function chan(s){s=(s||'').toLowerCase();
  if(s.indexOf('meta')>=0||s.indexOf('facebook')>=0||s.indexOf('[ad]')===0)return'Meta';
  if(s.indexOf('google')>=0)return'Google';
  if(s.indexOf('tik')>=0)return'TikTok';
  return'Otros/web';}
function eur(n){return '€'+Math.round(n).toLocaleString('es-ES');}
function eur2(n){return '€'+n.toFixed(2).replace('.',',');}
function cpl(sp,l){return l>0? '€'+(sp/l).toFixed(2).replace('.',','):'—';}
function getJSON(url,opt){var res=UrlFetchApp.fetch(url,Object.assign({muteHttpExceptions:true},opt||{}));return JSON.parse(res.getContentText());}

// ═══════════════ PULLS ═══════════════
function pullMeta(r){
  var params={level:'campaign',time_range:JSON.stringify({since:r.first,until:r.last}),time_increment:'all_days',
    fields:'campaign_name,spend,impressions,clicks,actions',limit:'500',access_token:CFG.META_TOKEN};
  var q=Object.keys(params).map(function(k){return k+'='+encodeURIComponent(params[k]);}).join('&');
  var d=getJSON('https://graph.facebook.com/v21.0/'+CFG.META_ACT+'/insights?'+q);
  var tot={s:0,i:0,c:0,l:0}, camp=[];
  if(d.error){Logger.log('META ERR '+d.error.message); return {tot:tot,camp:camp,err:d.error.message};}
  (d.data||[]).forEach(function(x){
    var m={}; (x.actions||[]).forEach(function(a){m[a.action_type]=+a.value;});
    var l=m['lead']||0, sp=+x.spend;
    camp.push({n:x.campaign_name,s:sp,l:l,cu:course(x.campaign_name)});
    tot.s+=sp; tot.i+=+x.impressions; tot.c+=+x.clicks; tot.l+=l;
  });
  return {tot:tot,camp:camp};
}
function pullGoogle(r){
  var tk=getJSON('https://oauth2.googleapis.com/token',{method:'post',payload:{
    client_id:CFG.G_CLIENT_ID,client_secret:CFG.G_CLIENT_SECRET,refresh_token:CFG.G_REFRESH,grant_type:'refresh_token'}});
  if(!tk.access_token){Logger.log('GOOGLE AUTH ERR'); return {s:0,l:0};}
  var q='SELECT metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date BETWEEN "'+r.first+'" AND "'+r.last+'"';
  var res=getJSON('https://googleads.googleapis.com/v21/customers/'+CFG.G_CID+'/googleAds:searchStream',{
    method:'post',contentType:'application/json',
    headers:{Authorization:'Bearer '+tk.access_token,'developer-token':CFG.G_DEV,'login-customer-id':CFG.G_MCC},
    payload:JSON.stringify({query:q})});
  var s=0,l=0;
  if(res instanceof Array) res.forEach(function(b){(b.results||[]).forEach(function(x){s+=(+x.metrics.costMicros||0)/1e6; l+=+x.metrics.conversions||0;});});
  return {s:s,l:l};
}
function pullGHL(r){
  var H={Authorization:'Bearer '+CFG.GHL_TOKEN,Version:'2021-07-28',Accept:'application/json'};
  var pj=getJSON('https://services.leadconnectorhq.com/opportunities/pipelines?locationId='+CFG.GHL_LOC,{headers:H});
  var sn={}; (pj.pipelines||[]).forEach(function(p){ if(p.id===CFG.GHL_PIPE)(p.stages||[]).forEach(function(s){sn[s.id]=s.name;});});
  // creadas en el mes
  var url='https://services.leadconnectorhq.com/opportunities/search?location_id='+CFG.GHL_LOC+'&pipeline_id='+CFG.GHL_PIPE+'&limit=100', cre=[], pg=0;
  while(url && pg<90){
    var d=getJSON(url,{headers:H}); var o=d.opportunities||[]; pg++;
    o.forEach(function(x){var dt=(x.createdAt||'').slice(0,10); if(dt>=r.first && dt<=r.last) cre.push(x);});
    var mn=o.reduce(function(m,x){var dt=(x.createdAt||'').slice(0,10); return dt<m?dt:m;},'9999');
    if(mn<r.first) break;
    url=(d.meta&&d.meta.nextPageUrl)?d.meta.nextPageUrl:null;
  }
  // ganadas (matrículas por fecha de cierre en el mes)
  var u2='https://services.leadconnectorhq.com/opportunities/search?location_id='+CFG.GHL_LOC+'&pipeline_id='+CFG.GHL_PIPE+'&status=won&limit=100', won=[];
  while(u2){var d=getJSON(u2,{headers:H}); won.push.apply(won,(d.opportunities||[])); u2=(d.meta&&d.meta.nextPageUrl)?d.meta.nextPageUrl:null;}
  var wJ=won.filter(function(x){return (x.lastStatusChangeAt||'').slice(0,7)===r.ym;});
  var wNew=wJ.filter(function(x){return (x.createdAt||'').slice(0,7)===r.ym;}).length;

  var OPEN=['Nuevo Lead','Llamados','Cita Programada','Entrevistado','Negociación','Más adelante','Plantón','No localizado'];
  var CO=['TCP','AT','FD','General'];
  var byStage={}; ['Nuevo Lead','No localizado','Llamados','Cita Programada','Plantón','Entrevistado','Negociación','Más adelante','PERDIDO'].forEach(function(s){byStage[s]=0;});
  var open=0,lost=0,ab=0;
  var coL={TCP:0,AT:0,FD:0,General:0}, chL={Meta:0,Google:0,TikTok:0,'Otros/web':0}, chE={Meta:0,Google:0,TikTok:0,'Otros/web':0};
  var M={}; OPEN.concat(['Won (matrícula)','Lost','Abandoned']).forEach(function(s){M[s]={}; CO.forEach(function(c){M[s][c]=0;});});
  cre.forEach(function(o){
    var st=(o.status||'').toLowerCase(), s=(sn[o.pipelineStageId]||'').trim(), cu=course((o.name||'')+' '+(o.source||'')), c=chan(o.source);
    if(byStage[s]!=null) byStage[s]++;
    coL[cu]++; chL[c]++;
    if(s==='Entrevistado'||s==='Negociación'||st==='won') chE[c]++;
    if(st==='lost')lost++; else if(st==='abandoned')ab++; else if(st!=='won')open++;
    if(st==='won')M['Won (matrícula)'][cu]++; else if(st==='lost')M['Lost'][cu]++; else if(st==='abandoned')M['Abandoned'][cu]++; else if(M[s])M[s][cu]++;
  });
  var coM={TCP:0,AT:0,FD:0,General:0}, chM={Meta:0,Google:0,TikTok:0,'Otros/web':0};
  wJ.forEach(function(o){coM[course((o.name||'')+' '+(o.source||''))]++; chM[chan(o.source)]++;});
  // matriz filas
  var ROWS=OPEN.concat(['Won (matrícula)','Lost','Abandoned']);
  var mat=[]; ROWS.forEach(function(s){var t=CO.reduce(function(a,c){return a+M[s][c];},0);
    if(t>0||s==='Entrevistado'||s==='Won (matrícula)') mat.push([s,''+M[s].TCP,''+M[s].AT,''+M[s].FD,''+M[s].General,''+t]);});
  var tt=CO.map(function(c){return ROWS.reduce(function(a,s){return a+M[s][c];},0);});
  mat.push(['TOTAL',''+tt[0],''+tt[1],''+tt[2],''+tt[3],''+(tt[0]+tt[1]+tt[2]+tt[3])]);

  return {creadas:cre.length, byStage:byStage, open:open, lost:lost, ab:ab,
    matriculas:wJ.length, wonNew:wNew, wonCarry:wJ.length-wNew,
    coLeads:coL, coMat:coM, chLeads:chL, chEntrev:chE, chMat:chM, matrix:mat};
}

// ═══════════════ ESCRITURA (mes actual) ═══════════════
function writeMonthTab(r, meta, goog, crm){
  var ss=SpreadsheetApp.openById(CFG.SHEET_ID);
  var sh=ss.getSheetByName(r.name)||ss.insertSheet(r.name);
  var GID=sh.getSheetId();

  var tik={s:CFG.TIKTOK_SPEND,l:CFG.TIKTOK_CONV};
  var totInv=meta.tot.s+goog.s+tik.s, totLeads=meta.tot.l+goog.l+tik.l;
  var fact=crm.matriculas*CFG.MATRICULA, roas=totInv>0?fact/totInv:0;

  // por curso (Meta)
  var mc={TCP:{s:0,l:0},AT:{s:0,l:0},FD:{s:0,l:0},General:{s:0,l:0}};
  meta.camp.forEach(function(x){mc[x.cu].s+=x.s; mc[x.cu].l+=x.l;});
  function crow(c){return [c, eur(mc[c].s), ''+mc[c].l, ''+crm.coLeads[c], ''+crm.coMat[c]];}

  // embudo por canal
  function frow(c){var L=crm.chLeads[c],E=crm.chEntrev[c],M=crm.chMat[c];
    return [c, ''+L, ''+E, (L>0?(E/L*100).toFixed(1).replace('.',','):'0')+'%', ''+M];}
  var totL=crm.creadas, totE=crm.chEntrev.Meta+crm.chEntrev.Google+crm.chEntrev.TikTok+crm.chEntrev['Otros/web'];

  // campañas (Meta + TikTok + Google) ordenadas por CPL
  var camps=meta.camp.map(function(x){return {n:x.n,plat:'Meta',cu:x.cu,s:x.s,l:x.l};});
  camps.push({n:'TikTok (manual)',plat:'TikTok',cu:'TCP',s:tik.s,l:tik.l});
  camps.push({n:'Google Ads (TCP)',plat:'Google',cu:'TCP',s:goog.s,l:goog.l});
  camps.sort(function(a,b){var ca=a.l?a.s/a.l:1e9, cb=b.l?b.s/b.l:1e9; return ca-cb;});
  var campRows=camps.map(function(x){return [x.n,x.plat,x.cu,eur(x.s),''+x.l,cpl(x.s,x.l)];});

  var bs=crm.byStage;
  var cfg={
    title:r.name+' '+r.ym.slice(0,4)+' (día '+r.day+' · en vivo)',
    sub:'Actualización automática diaria · Meta+Google API · TikTok manual · CRM GoHighLevel · matrícula '+eur(CFG.MATRICULA),
    resumen:[['Inversión total',eur(totInv)],['Leads',''+totLeads],['CPL blended',cpl(totInv,totLeads)],
      ['Oportunidades CRM',''+crm.creadas],['Matrículas',''+crm.matriculas],['Facturación',eur(fact)],
      ['ROAS',roas.toFixed(1).replace('.',',')],['CPA (coste/matrícula)',crm.matriculas?eur(totInv/crm.matriculas):'—'],
      ['% Budget ('+eur(CFG.BUDGET)+')',Math.round(totInv/CFG.BUDGET*100)+'%']],
    plataforma:[['Meta',eur(meta.tot.s),''+meta.tot.l,cpl(meta.tot.s,meta.tot.l)],
      ['Google',eur(goog.s),''+goog.l,cpl(goog.s,goog.l)],
      ['TikTok',eur(tik.s),''+tik.l,cpl(tik.s,tik.l)],
      ['TOTAL',eur(totInv),''+totLeads,cpl(totInv,totLeads)]],
    curso:[crow('TCP'),crow('AT'),crow('FD'),crow('General'),
      ['TOTAL',eur(meta.tot.s),''+meta.tot.l,''+crm.creadas,''+crm.matriculas]],
    embudo:[frow('Meta'),frow('Google'),frow('TikTok'),frow('Otros/web'),
      ['TOTAL',''+totL,''+totE,(totL>0?(totE/totL*100).toFixed(1).replace('.',','):'0')+'%',''+crm.matriculas]],
    campanas:campRows,
    pipeline:[['Oportunidades creadas',''+crm.creadas],['Nuevo Lead',''+bs['Nuevo Lead']],['Llamados',''+bs['Llamados']],
      ['Cita Programada',''+bs['Cita Programada']],['Entrevistado',''+bs['Entrevistado']],['Más adelante',''+bs['Más adelante']],
      ['Plantón',''+bs['Plantón']],['No localizado',''+bs['No localizado']],['Open (activas)',''+crm.open],
      ['Lost',''+crm.lost],['Abandoned',''+crm.ab],['Matrículas cerradas',''+crm.matriculas],
      ['  · nuevas / arrastre',crm.wonNew+' / '+crm.wonCarry]],
    footer:'Actualizado automáticamente el '+Utilities.formatDate(new Date(),CFG.TZ,'dd/MM/yyyy HH:mm')+'. TikTok manual ('+eur2(tik.s)+' / '+tik.l+'). Matrícula = '+eur(CFG.MATRICULA)+'.'
  };
  renderMonth(GID, r.name, cfg);
}

function renderMonth(GID, tabName, cfg){
  var rows=[], reqs=[], R=0, NC=6;
  function push(a){rows.push(a); return R++;}
  function fill(r0,r1,c0,c1,col){reqs.push({repeatCell:{range:rg(r0,r1,c0,c1),cell:{userEnteredFormat:{backgroundColor:col}},fields:'userEnteredFormat.backgroundColor'}});}
  function fmt(r0,r1,c0,c1,f){reqs.push({repeatCell:{range:rg(r0,r1,c0,c1),cell:{userEnteredFormat:f},fields:'userEnteredFormat('+Object.keys(f).join(',')+')'}});}
  function rg(r0,r1,c0,c1){return {sheetId:GID,startRowIndex:r0,endRowIndex:r1,startColumnIndex:c0,endColumnIndex:c1};}
  function merge(r,c0,c1){reqs.push({mergeCells:{range:rg(r,r+1,c0,c1),mergeType:'MERGE_ALL'}});}
  function rowH(r,px){reqs.push({updateDimensionProperties:{range:{sheetId:GID,dimension:'ROWS',startIndex:r,endIndex:r+1},properties:{pixelSize:px},fields:'pixelSize'}});}
  function title(t){var r=push([t]);merge(r,0,NC);fill(r,r+1,0,NC,DARK);fmt(r,r+1,0,NC,{textFormat:{bold:true,fontSize:16,foregroundColor:WHITE},verticalAlignment:'MIDDLE'});rowH(r,38);}
  function sub(t){var r=push([t]);merge(r,0,NC);fmt(r,r+1,0,NC,{textFormat:{italic:true,fontSize:9,foregroundColor:MUT}});}
  function section(t){var r=push([t]);merge(r,0,NC);fill(r,r+1,0,NC,DARK);fmt(r,r+1,0,NC,{textFormat:{bold:true,fontSize:11,foregroundColor:WHITE},verticalAlignment:'MIDDLE'});rowH(r,25);}
  function blank(){push(['']);}
  function header(a){var r=push(a);fill(r,r+1,0,a.length,ACC);fmt(r,r+1,0,a.length,{textFormat:{bold:true,foregroundColor:WHITE},horizontalAlignment:'CENTER'});fmt(r,r+1,0,1,{horizontalAlignment:'LEFT'});}
  function data(a,o){o=o||{};var r=push(a);if(o.total){fill(r,r+1,0,a.length,LIGHT);fmt(r,r+1,0,a.length,{textFormat:{bold:true}});}else if(o.band)fill(r,r+1,0,a.length,BAND);fmt(r,r+1,o.rightFrom||1,a.length,{horizontalAlignment:'RIGHT'});return r;}
  function note(t){var r=push([t]);merge(r,0,NC);fmt(r,r+1,0,NC,{textFormat:{italic:true,fontSize:9,foregroundColor:MUT},wrapStrategy:'WRAP'});}

  title('EAC · '+cfg.title); sub(cfg.sub); blank();
  section('RESUMEN GENERAL'); header(['Métrica','Valor','','','','']); cfg.resumen.forEach(function(x,i){data([x[0],x[1],'','','',''],{band:i%2===1});}); blank();
  section('POR PLATAFORMA'); header(['Plataforma','Inversión','Leads','CPL','','']); cfg.plataforma.forEach(function(x,i,a){data(x.concat(['','']),{total:i===a.length-1,band:i%2===1});}); blank();
  section('POR CURSO  (inversión = Meta · oport./matríc = CRM)'); header(['Curso','Inv. Meta','Leads','Oport.','Matríc.','']); cfg.curso.forEach(function(x,i,a){data(x.concat(['']),{total:i===a.length-1,band:i%2===1});}); note('Google y TikTok son todo TCP.'); blank();
  section('EMBUDO POR CANAL — Leads → Entrevistados → Matrículas'); header(['Canal','Leads','Entrev.','% L→E','Matríc.','']);
  cfg.embudo.forEach(function(x,i,a){var r=data(x.concat(['']),{total:i===a.length-1,band:i%2===1});
    if(x[0]==='Otros/web'){fill(r,r+1,3,4,GOODBG);fmt(r,r+1,3,4,{textFormat:{bold:true,foregroundColor:GOOD}});}
    if(x[0]==='Meta'){fill(r,r+1,3,4,BADBG);fmt(r,r+1,3,4,{textFormat:{bold:true,foregroundColor:BAD}});}});
  note('Leads = oportunidades CRM por fuente. Calidad = % que llega a entrevista.'); blank();
  section('CPL POR CAMPAÑA'); header(['Campaña','Plataforma','Curso','Inversión','Leads','CPL']); cfg.campanas.forEach(function(x,i){data(x,{band:i%2===1,rightFrom:3});}); blank();
  section('PIPELINE CRM'); header(['Etapa / Estado','#','','','','']); cfg.pipeline.forEach(function(x,i){data([x[0],x[1],'','','',''],{band:i%2===1});}); blank();
  note(cfg.footer);

  var pre=[{unmergeCells:{range:rg(0,400,0,26)}},{repeatCell:{range:rg(0,400,0,26),cell:{userEnteredFormat:{}},fields:'userEnteredFormat'}},
    {repeatCell:{range:rg(0,rows.length,0,NC),cell:{userEnteredFormat:{textFormat:{fontFamily:'Arial',fontSize:10},verticalAlignment:'MIDDLE'}},fields:'userEnteredFormat(textFormat,verticalAlignment)'}}];
  var post=[]; [[0,1,290],[1,2,120],[2,3,95],[3,4,90],[4,5,90],[5,6,90]].forEach(function(w){post.push({updateDimensionProperties:{range:{sheetId:GID,dimension:'COLUMNS',startIndex:w[0],endIndex:w[1]},properties:{pixelSize:w[2]},fields:'pixelSize'}});});
  post.push({updateSheetProperties:{properties:{sheetId:GID,gridProperties:{hideGridlines:true}},fields:'gridProperties.hideGridlines'}});

  Sheets.Spreadsheets.Values.clear({}, CFG.SHEET_ID, "'"+tabName+"'!A1:Z400");
  var vals=rows.map(function(r){var c=r.slice(); while(c.length<6)c.push(''); return c;});
  Sheets.Spreadsheets.Values.update({values:vals}, CFG.SHEET_ID, "'"+tabName+"'!A1", {valueInputOption:'RAW'});
  Sheets.Spreadsheets.batchUpdate({requests:pre.concat(reqs).concat(post)}, CFG.SHEET_ID);
}

// ═══════════════ ESCRITURA (Curso × Etapa) ═══════════════
function writeMatrixTab(r, crm){
  var TAB='Curso × Etapa';
  var ss=SpreadsheetApp.openById(CFG.SHEET_ID);
  var sh=ss.getSheetByName(TAB)||ss.insertSheet(TAB);
  var GID=sh.getSheetId();
  var rows=[], reqs=[], R=0, NC=6;
  function push(a){rows.push(a); return R++;}
  function rg(r0,r1,c0,c1){return {sheetId:GID,startRowIndex:r0,endRowIndex:r1,startColumnIndex:c0,endColumnIndex:c1};}
  function fill(r0,r1,c0,c1,col){reqs.push({repeatCell:{range:rg(r0,r1,c0,c1),cell:{userEnteredFormat:{backgroundColor:col}},fields:'userEnteredFormat.backgroundColor'}});}
  function fmt(r0,r1,c0,c1,f){reqs.push({repeatCell:{range:rg(r0,r1,c0,c1),cell:{userEnteredFormat:f},fields:'userEnteredFormat('+Object.keys(f).join(',')+')'}});}
  function merge(r,c0,c1){reqs.push({mergeCells:{range:rg(r,r+1,c0,c1),mergeType:'MERGE_ALL'}});}
  function rowH(r,px){reqs.push({updateDimensionProperties:{range:{sheetId:GID,dimension:'ROWS',startIndex:r,endIndex:r+1},properties:{pixelSize:px},fields:'pixelSize'}});}
  function title(t){var r=push([t]);merge(r,0,NC);fill(r,r+1,0,NC,DARK);fmt(r,r+1,0,NC,{textFormat:{bold:true,fontSize:16,foregroundColor:WHITE},verticalAlignment:'MIDDLE'});rowH(r,38);}
  function sub(t){var r=push([t]);merge(r,0,NC);fmt(r,r+1,0,NC,{textFormat:{italic:true,fontSize:9,foregroundColor:MUT}});}
  function section(t){var r=push([t]);merge(r,0,NC);fill(r,r+1,0,NC,DARK);fmt(r,r+1,0,NC,{textFormat:{bold:true,fontSize:11,foregroundColor:WHITE},verticalAlignment:'MIDDLE'});rowH(r,25);}
  function blank(){push(['']);}
  function header(a){var r=push(a);fill(r,r+1,0,a.length,ACC);fmt(r,r+1,0,a.length,{textFormat:{bold:true,foregroundColor:WHITE},horizontalAlignment:'CENTER'});fmt(r,r+1,0,1,{horizontalAlignment:'LEFT'});}
  function note(t){var r=push([t]);merge(r,0,NC);fmt(r,r+1,0,NC,{textFormat:{italic:true,fontSize:9,foregroundColor:MUT},wrapStrategy:'WRAP'});}
  function matrixTable(label,mm){section(label);header(['Etapa','TCP','AT','FD','General','TOTAL']);
    mm.forEach(function(x,i){var r=push(x);var isTot=x[0]==='TOTAL';
      if(isTot){fill(r,r+1,0,NC,LIGHT);fmt(r,r+1,0,NC,{textFormat:{bold:true}});}else if(i%2===1)fill(r,r+1,0,NC,BAND);
      fmt(r,r+1,1,NC,{horizontalAlignment:'CENTER'});
      if(x[0].indexOf('Won')===0){fill(r,r+1,0,NC,GOODBG);fmt(r,r+1,0,1,{textFormat:{bold:true,foregroundColor:GOOD}});}
      if(x[0]==='Entrevistado'){fill(r,r+1,0,1,ACCBG);fmt(r,r+1,0,1,{textFormat:{bold:true,foregroundColor:ACC}});}
      if(['No localizado','Lost','Abandoned'].indexOf(x[0])>=0)fmt(r,r+1,0,1,{textFormat:{foregroundColor:{red:.55,green:.25,blue:.22}}});
    });blank();}

  title('EAC · Pipeline por Curso × Etapa');
  sub('Oportunidades CRM (GHL) por curso y etapa/estado actual · '+r.name+' en vivo · actualizado '+Utilities.formatDate(new Date(),CFG.TZ,'dd/MM HH:mm'));
  blank();
  matrixTable(r.name.toUpperCase()+' '+r.ym.slice(0,4)+' (día '+r.day+')', crm.matrix);
  note('Won = ganadas por estado actual del cohorte del mes. Entrevistado = etapa actual. Rojo = etapas donde se pierde el lead.');

  var pre=[{unmergeCells:{range:rg(0,400,0,26)}},{repeatCell:{range:rg(0,400,0,26),cell:{userEnteredFormat:{}},fields:'userEnteredFormat'}},
    {repeatCell:{range:rg(0,rows.length,0,NC),cell:{userEnteredFormat:{textFormat:{fontFamily:'Arial',fontSize:10},verticalAlignment:'MIDDLE'}},fields:'userEnteredFormat(textFormat,verticalAlignment)'}}];
  var post=[]; [[0,1,180],[1,2,80],[2,3,70],[3,4,70],[4,5,80],[5,6,80]].forEach(function(w){post.push({updateDimensionProperties:{range:{sheetId:GID,dimension:'COLUMNS',startIndex:w[0],endIndex:w[1]},properties:{pixelSize:w[2]},fields:'pixelSize'}});});
  post.push({updateSheetProperties:{properties:{sheetId:GID,gridProperties:{hideGridlines:true}},fields:'gridProperties.hideGridlines'}});

  Sheets.Spreadsheets.Values.clear({}, CFG.SHEET_ID, "'"+TAB+"'!A1:Z400");
  var vals=rows.map(function(r){var c=r.slice(); while(c.length<6)c.push(''); return c;});
  Sheets.Spreadsheets.Values.update({values:vals}, CFG.SHEET_ID, "'"+TAB+"'!A1", {valueInputOption:'RAW'});
  Sheets.Spreadsheets.batchUpdate({requests:pre.concat(reqs).concat(post)}, CFG.SHEET_ID);
}
