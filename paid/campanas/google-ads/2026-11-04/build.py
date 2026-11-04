import csv,os
os.chdir('/home/user/qualivo/paid/campanas/google-ads/2026-11-04')
S='QV_SEARCH_AltaIntencion'; P='QV_PMAX_Captacion'
U=lambda path,camp:f"https://qualivo.io/{path}?utm_source=google&utm_medium=cpc&utm_campaign={camp}&utm_content={{creative}}&utm_term={{keyword}}"
with open('campanas.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['Campaign','Campaign Status','Campaign Type','Networks','Budget','Bid Strategy Type','Max CPC','Languages','Location','Ad Schedule'])
    w.writerow([S,'Paused','Search','Google search',"10.00",'Maximize clicks','6.00','es','Spain','Mon-Fri 08:00-20:00'])
    w.writerow([P,'Paused','Performance Max','All',"10.00",'Maximize conversions','','es','Spain','Mon-Sun 00:00-24:00'])
kw={
 'Agencia captación de leads':['agencia de generación de leads','agencia de generacion de leads','agencia captación de clientes','agencia de captación de leads','empresa generación de leads','generacion de leads b2b','captación de leads para empresas'],
 'Seguimiento y CRM como servicio':['automatizar seguimiento de leads','implantar crm con whatsapp','seguimiento comercial de leads','automatización de ventas para empresas'],
 'Clínicas':['agencia marketing clínicas','agencia marketing médico','agencia marketing salud','agencia marketing sanitario','marketing para clínicas','marketing digital para clínicas','marketing para clínicas estéticas','marketing clínica estética','marketing para clínicas dentales','marketing digital para clínicas dentales'],
}
with open('palabras-clave.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['Campaign','Ad group','Keyword','Criterion Type','Max CPC'])
    for g,ks in kw.items():
        for k in ks: w.writerow([S,g,k,'Phrase','6.00'])
neg=['gratis','gratuito','gratuita','curso','cursos','máster','master','grado','empleo','trabajo','sueldo','prácticas','qué es','que es','definición','ejemplos','pdf','plantilla','tipos','etapas','hubspot','salesforce','zoho','pipedrive','odoo','clientify','descargar','app','software','estudiar','universidad','tfg','odontología','para pacientes','agencia marketing dental','agencia para dentistas']
with open('negativas.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['Campaign','Keyword','Criterion Type'])
    for c in (S,P):
        for n in neg:
            if c==P and n in('agencia marketing dental','agencia para dentistas'): continue
            w.writerow([c,n,'Negative phrase'])
H={
'Agencia captación de leads':["Leads que acaban en clientes","Captación y seguimiento","Diagnóstico gratis 30 min","Respuesta al lead en minutos","Del anuncio a la reunión","Sistema de captación con IA","Para negocios que ya invierten","Medido hasta la venta","Sin perder ni un lead","WhatsApp que cualifica","Qué anuncio trae clientes","Seguimiento automático","Tickets de 500 € o más","Dónde se escapan tus ventas","Reserva tu diagnóstico"],
'Seguimiento y CRM como servicio':["Seguimiento que sí se hace","CRM y WhatsApp conectados","Diagnóstico gratis 30 min","Respuesta al lead en minutos","Ningún lead sin respuesta","Lo montamos por ti","Del lead a la reunión","Sistema comercial con IA","Medido hasta la venta","Para negocios que ya invierten","Tickets de 500 € o más","Dónde se escapan tus ventas","Sin cambiar de herramienta","Agenda llena, no solo leads","Reserva tu diagnóstico"],
'Clínicas':["Pacientes, no solo leads","Captación para clínicas","Diagnóstico gratis 30 min","Del anuncio al paciente","Respuesta en minutos","Seguimiento de presupuestos","Medido hasta el paciente","Para clínicas que invierten","Estética, médico y dental","WhatsApp que agenda","Ningún lead sin llamar","Sistema de captación con IA","Dónde se escapan pacientes","Tratamientos de 500 € o más","Reserva tu diagnóstico"],
}
D={
'Agencia captación de leads':["Sistemas de captación y venta con IA: del anuncio a la reunión, sin perder leads.","Diagnóstico de 30 minutos con tus datos: dónde se pierden las ventas y qué hacer.","Anuncios, formularios que filtran, WhatsApp que cualifica y seguimiento en tu CRM.","Para negocios cuyos clientes pagan 500 € o más y ya invierten en captar."],
'Seguimiento y CRM como servicio':["Cada lead con respuesta en minutos, ficha en el CRM y siguiente paso. Lo medimos.","Diagnóstico de 30 minutos: dónde se enfrían tus leads y cómo recuperarlos.","WhatsApp, llamadas y CRM conectados: el seguimiento no depende de acordarse.","Para negocios cuyos clientes pagan 500 € o más y ya invierten en captar."],
'Clínicas':["Captación, respuesta y seguimiento de presupuestos conectados, hasta el paciente.","Diagnóstico de 30 minutos con tus datos: dónde se pierden pacientes y qué hacer.","Formularios que filtran, WhatsApp que agenda y seguimiento de cada presupuesto.","Para clínicas con tratamientos de 500 € o más que ya invierten en anuncios."],
}
paths={'Agencia captación de leads':('','captacion'),'Seguimiento y CRM como servicio':('','seguimiento'),'Clínicas':('clinicas/','clinicas')}
with open('anuncios-rsa.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['Campaign','Ad group','Ad type','Final URL']+[f'Headline {i}' for i in range(1,16)]+[f'Description {i}' for i in range(1,5)]+['Path 1','Path 2'])
    for g in kw:
        hs,ds=H[g],D[g]
        assert len(hs)==15 and all(len(h)<=30 for h in hs),[h for h in hs if len(h)>30]
        assert all(len(d)<=90 for d in ds),[(len(d),d) for d in ds if len(d)>90]
        w.writerow([S,g,'Responsive search ad',U(paths[g][0],'qv_search_altaintencion')]+hs+ds+[paths[g][1],'diagnostico'])
# PMax assets
PH=["Leads que acaban en clientes","Captación con IA","Diagnóstico gratis 30 min","Del anuncio a la reunión","Respuesta en minutos","Seguimiento automático","Medido hasta la venta","Ningún lead sin respuesta","Para negocios que invierten","Dónde se escapan tus ventas","Academias, clínicas, reformas","WhatsApp que cualifica","Agenda llena, no solo leads","Tickets de 500 € o más","Reserva tu diagnóstico"]
PL=["Diseñamos sistemas de captación y procesos de venta impulsados con IA","Del anuncio a la reunión: captación, respuesta en minutos y seguimiento medido","¿Entran leads pero no se convierten? Te enseñamos dónde se escapan en 30 minutos","Para negocios cuyos clientes pagan 500 € o más y ya invierten en anuncios","Formularios que filtran, WhatsApp que cualifica y seguimiento hasta la venta"]
PD=["Diagnóstico gratis de 30 min: dónde se pierden tus ventas.","Anuncios, formularios que filtran, WhatsApp que cualifica y seguimiento en tu CRM.","Cada lead con respuesta en minutos, ficha completa y siguiente paso. Lo medimos todo.","Para academias, clínicas y reformas con tickets de 500 € o más.","Sistemas de captación y venta con IA, medidos hasta el cliente."]
assert all(len(x)<=30 for x in PH),[x for x in PH if len(x)>30]
assert all(len(x)<=90 for x in PL),[(len(x),x) for x in PL if len(x)>90]
assert all(len(x)<=90 for x in PD) and len(PD[0])<=60,[(len(x),x) for x in PD]
with open('pmax-recursos.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['Campaign','Asset group','Tipo','Texto','Caracteres'])
    for t,l in (('Título',PH),('Título largo',PL),('Descripción',PD)):
        for x in l: w.writerow([P,'Captación · general',t,x,len(x)])
print('ok')
