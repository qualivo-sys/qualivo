/**
 * Hoja de cálculo falsa + la landing, para probar el CRM en local.
 * Contraseña del simulacro: 1234.
 */
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const RAIZ='/home/user/qualivo/antic-barcelona-113/landing';
const TIPOS={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css',
  '.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf'};
const hace=(d)=>new Date(Date.now()-d*36e5).toISOString();
const LEADS=[
 {lead_id:'w1',fecha:hace(1),origen:'cuestionario',nombre:'Marta Ribas',telefono:'+34600111222',email:'m@x.es',tier:'HOT',estado:'Nuevo',pieza:'Mesa de comedor',espacio:'Comedor',medidas:'240 × 100 cm',presupuesto:'3.000-5.000 €',plazo:'Lo antes posible',proxima_accion:'WhatsApp hoy + proponer visita al taller',fecha_proxima:new Date().toISOString(),utm_campaign:'AB113 | FRIO | Lead',utm_content:'2A | FRIO | 4x5 | v1',notas:''},
 {lead_id:'w2',fecha:hace(30),origen:'guia',nombre:'Jordi Puig i Serrallonga',telefono:'+34600333444',tier:'COLD',estado:'Contactado',pieza:'Banco',plazo:'Solo estoy explorando',proxima_accion:'Revisar en 7 días',fecha_proxima:hace(48).slice(0,10),utm_content:'POST-CASA | FRIO | Reel | v1',notas:'Pidió fotos'},
 {lead_id:'m1',fecha:hace(5),origen:'meta_form',nombre:'Nuria Castells',telefono:'+34600555666',tier:'WARM',estado:'Presupuesto enviado',pieza:'Mesa de comedor',medidas:'200 × 90',plazo:'En los próximos 3 meses',importe:4200,utm_content:'3A | FORM | 4x5 | v1',utm_campaign:'AB113 | FRIO | Formulario',notas:''},
 {lead_id:'w3',fecha:hace(200),origen:'cuestionario',nombre:'Albert Solé',telefono:'+34600777888',tier:'HOT',estado:'Ganado',pieza:'Mesa de comedor',importe:5800,utm_content:'POST-OLMO | FRIO | Reel | v1',notas:''},
 {lead_id:'w4',fecha:hace(300),origen:'guia',nombre:'Laia Ferrer',tier:'WARM',estado:'Perdido',motivo_perdida:'Precio',pieza:'Cajonera',utm_content:'5A | FRIO | 4x5 | v1',notas:''},
];
http.createServer((req,res)=>{
  const u=new URL(req.url,'http://x');
  if(u.pathname==='/api/crm'){
    let c=''; req.on('data',d=>c+=d); req.on('end',()=>{
      const b=JSON.parse(c||'{}');
      res.setHeader('Content-Type','application/json');
      if(b.accion==='entrar') return res.end(JSON.stringify({ok:b.password==='1234'}));
      if(b.accion==='listar') return res.end(JSON.stringify({ok:true,leads:LEADS}));
      if(b.accion==='actualizar'){
        const l=LEADS.find(x=>x.lead_id===b.lead_id); Object.assign(l,b.campos);
        if(b.campos.estado&&b.campos.estado!=='Nuevo'&&!l.primer_contacto) l.primer_contacto=new Date().toISOString();
        return res.end(JSON.stringify({ok:true,lead:l}));
      }
      res.end(JSON.stringify({ok:false}));
    }); return;
  }
  let f=u.pathname==='/'?'/index.html':u.pathname;
  if(!path.extname(f)) f+='.html';
  const abs=path.join(RAIZ,f);
  if(!fs.existsSync(abs)){res.statusCode=404;return res.end('404');}
  res.setHeader('Content-Type',TIPOS[path.extname(abs)]||'application/octet-stream');
  fs.createReadStream(abs).pipe(res);
}).listen(4321,()=>console.log('listo en 4321'));
