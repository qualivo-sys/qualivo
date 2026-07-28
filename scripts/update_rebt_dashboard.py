#!/usr/bin/env python3
# Actualiza el dashboard REBT (Focus Practical) en Google Sheets.
# Lee credenciales de variables de entorno:
#   META_TOKEN  -> token system-user de Meta (no expira)
#   GHL_PIT     -> token PIT de GoHighLevel
#   GOOGLE_SA   -> JSON completo de la cuenta de servicio de Google (una línea)
#   SHEET_ID    -> id del spreadsheet destino
import os,json,subprocess,datetime,tempfile
from collections import Counter

META=os.environ["META_TOKEN"]; GHL=os.environ["GHL_PIT"]
SHEET_ID=os.environ.get("SHEET_ID","1te0epMJ6o6kARZAKx5MAv7Vxt6R7MLxQQ0ScGQ_eUtk")
LOC=os.environ.get("GHL_LOC","C5lBSpxXm5GGZ2B61bNw")
PIPE=os.environ.get("REBT_PIPE","URluuqD6QTg59ezLQV4n")
ACT=os.environ.get("META_ACT","act_1015669670643480")
TAB="Funnel REBT"; GID=int(os.environ.get("FUNNEL_GID","0"))

def sh(args): return subprocess.run(args,capture_output=True,text=True).stdout
def jget(url): 
    try: return json.loads(sh(["curl","-sS",url]))
    except: return {}

# ---- Google token desde SA ----
from google.oauth2 import service_account
import google.auth.transport.requests
sa_info=json.loads(os.environ["GOOGLE_SA"])
cred=service_account.Credentials.from_service_account_info(sa_info,scopes=["https://www.googleapis.com/auth/spreadsheets"])
cred.refresh(google.auth.transport.requests.Request()); GT=cred.token

def gapi(method,path,body):
    a=["curl","-sS","-X",method,f"https://sheets.googleapis.com/v4/spreadsheets/{path}",
       "-H",f"Authorization: Bearer {GT}","-H","Content-Type: application/json","-d",json.dumps(body,ensure_ascii=False)]
    try: return json.loads(sh(a))
    except: return {}

def ghl(path):
    a=["curl","-sS",f"https://services.leadconnectorhq.com{path}",
       "-H",f"Authorization: Bearer {GHL}","-H","Version: 2021-07-28","-H","Content-Type: application/json"]
    try: return json.loads(sh(a))
    except: return {}

# ---- 1) Meta: campañas REBT dinámicamente ----
camps=jget(f"https://graph.facebook.com/v21.0/{ACT}/campaigns?fields=id,name,effective_status&limit=200&access_token={META}")
rebt=[c for c in camps.get("data",[]) if "REBT" in (c.get("name","").upper())]
def label(c):
    n=c["name"]; act="(ACTIVA)" if c.get("effective_status")=="ACTIVE" else "(pausada)"
    if "V2" in n: base="V2 Formulario"
    elif "Din" in n: base="Dinámico web"
    elif "Web Leads" in n: base="Web Leads"
    elif "Formulario" in n: base="Formulario v1"
    else: base=n[:24]
    return f"{base} {act}"
def ins(cid):
    d=jget(f"https://graph.facebook.com/v21.0/{cid}/insights?date_preset=maximum&fields=spend,impressions,clicks,ctr,cpc,cpm,actions&access_token={META}")
    dt=d.get("data",[]); return dt[0] if dt else {}
mrows=[]; tot={"spend":0,"impr":0,"clicks":0,"leads":0}
for c in sorted(rebt,key=lambda x: x.get("effective_status")!="ACTIVE"):
    r=ins(c["id"])
    if not r: continue
    spend=float(r.get("spend",0)); impr=int(r.get("impressions",0)); clicks=int(r.get("clicks",0))
    leads=sum(int(float(a["value"])) for a in r.get("actions",[]) if a.get("action_type")=="lead")
    mrows.append(dict(name=label(c),spend=spend,impr=impr,clicks=clicks,
        ctr=float(r.get("ctr",0)),cpc=float(r.get("cpc",0)),cpm=float(r.get("cpm",0)),
        leads=leads,cpl=spend/leads if leads else 0))
    tot["spend"]+=spend; tot["impr"]+=impr; tot["clicks"]+=clicks; tot["leads"]+=leads
T=dict(spend=tot["spend"],impr=tot["impr"],clicks=tot["clicks"],leads=tot["leads"],
    ctr=(tot["clicks"]/tot["impr"]*100) if tot["impr"] else 0,
    cpc=(tot["spend"]/tot["clicks"]) if tot["clicks"] else 0,
    cpm=(tot["spend"]/tot["impr"]*1000) if tot["impr"] else 0,
    cpl=(tot["spend"]/tot["leads"]) if tot["leads"] else 0)

# ---- 2) GHL pipeline REBT ----
pl=ghl(f"/opportunities/pipelines?locationId={LOC}")
stages={}
for p in pl.get("pipelines",[]):
    if p["id"]==PIPE:
        for s in p.get("stages",[]): stages[s["id"]]=s.get("name")
opps=[]; page=1
while True:
    d=ghl(f"/opportunities/search?location_id={LOC}&pipeline_id={PIPE}&limit=100&page={page}")
    o=d.get("opportunities",[])
    if not o: break
    opps+=o; page+=1
    if len(o)<100 or page>15: break
cnt=Counter(stages.get(o.get("pipelineStageId"),"?") for o in opps)
stage_order=list(stages.values()); total=sum(cnt.values())

# ---- 3) Construir filas ----
def eur(v): return f"{v:,.2f} €".replace(",","X").replace(".",",").replace("X",".")
def num(v): return f"{v:,}".replace(",",".")
def pct(v): return f"{v:.2f}%".replace(".",",")
today=datetime.datetime.utcnow().strftime("%d/%m/%Y %H:%M")+" UTC"
rows=[["REBT · MÉTRICAS PAID + PIPELINE GHL"],
 [f"Campañas Meta (histórico) + etapas pipeline REBT · Actualizado {today}"],[],
 ["1) ANUNCIOS META · REBT (solo pago)"],
 ["Campaña","Gasto","Impresiones","Clics","CTR","CPC","CPM","Leads","CPL"]]
for r in mrows:
    rows.append([r["name"],eur(r["spend"]),num(r["impr"]),num(r["clicks"]),pct(r["ctr"]),
                 eur(r["cpc"]),eur(r["cpm"]),r["leads"],eur(r["cpl"]) if r["leads"] else "—"])
rows.append(["TOTAL REBT",eur(T["spend"]),num(T["impr"]),num(T["clicks"]),pct(T["ctr"]),eur(T["cpc"]),eur(T["cpm"]),T["leads"],eur(T["cpl"])])
rows+=[[],["2) PIPELINE REBT EN GHL · por etapa"],["Etapa","Tratos","% del total"]]
for s in stage_order:
    if s not in cnt: continue
    rows.append([s,cnt[s],pct(cnt[s]/total*100 if total else 0)])
rows.append(["TOTAL tratos REBT",total,"100,00%"])
enproc=cnt.get("Muy interesados",0)+cnt.get("En conversación",0)+cnt.get("Próxima convocatoria",0)
rows+=[[],["3) EMBUDO PAGO → GHL"],["Métrica","Valor"],
 ["Leads de pago (Meta, histórico)",T["leads"]],
 ["Tratos REBT en pipeline GHL",total],
 ["Sin trabajar (Nuevo lead)",cnt.get("Nuevo lead",0)],
 ["En proceso (interesados+conversación+próx.)",enproc],
 ["No responden",cnt.get("No responden",0)],
 ["Matriculados / Cerrados ganados",cnt.get("Cerrados",0)],[],
 ["4) DIAGNÓSTICO / ESTADO"],
 [f"Anuncios: CTR {pct(T['ctr'])} · CPC {eur(T['cpc'])} · {T['leads']} leads a {eur(T['cpl'])}."],
 [f"Seguimiento: {enproc} en proceso · {cnt.get('No responden',0)} no responden · {cnt.get('Nuevo lead',0)} sin tocar."],
 [f"Nota: Meta {T['leads']} leads vs {total} en pipeline (desfase por integración Meta→GHL)."]]

# ---- 4) Escribir ----
gapi("POST",f"{SHEET_ID}/values:batchClear",{"ranges":[f"'{TAB}'!A1:Z60"]})
w=gapi("POST",f"{SHEET_ID}/values:batchUpdate",
    {"valueInputOption":"USER_ENTERED","data":[{"range":f"'{TAB}'!A1","majorDimension":"ROWS","values":rows}]})
def find(pfx): return [i for i,r in enumerate(rows) if r and str(r[0]).startswith(pfx)]
title=find("1)")+find("2)")+find("3)")+find("4)"); hdr=find("Campaña")+find("Etapa")+find("Métrica"); tt=find("TOTAL")
BLUE={"red":0.82,"green":0.88,"blue":0.98};GREY={"red":0.9,"green":0.9,"blue":0.9};YEL={"red":1,"green":0.95,"blue":0.7}
def fmt(r0,bold=False,bg=None,size=None):
    uf={"textFormat":{}}
    if bold: uf["textFormat"]["bold"]=True
    if size: uf["textFormat"]["fontSize"]=size
    if bg: uf["backgroundColor"]=bg
    fields="userEnteredFormat(textFormat"+(",backgroundColor" if bg else "")+")"
    return {"repeatCell":{"range":{"sheetId":GID,"startRowIndex":r0,"endRowIndex":r0+1,"startColumnIndex":0,"endColumnIndex":9},
            "cell":{"userEnteredFormat":uf},"fields":fields}}
reqs=[fmt(0,bold=True,size=14),fmt(1,size=9)]+[fmt(i,bold=True,bg=BLUE) for i in title]+[fmt(i,bold=True,bg=GREY) for i in hdr]+[fmt(i,bold=True,bg=YEL) for i in tt]
gapi("POST",f"{SHEET_ID}:batchUpdate",{"requests":reqs})
print(f"OK · {w.get('totalUpdatedCells','?')} celdas · Meta {T['leads']} leads / {eur(T['spend'])} · pipeline {total} tratos")
