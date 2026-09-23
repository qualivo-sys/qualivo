import json, urllib.request, urllib.parse, datetime
from pathlib import Path
T=Path("sa_access_token.txt").read_text().strip()
SS="1-UKqrxTObh4ME2LHldlD6eREll1EiIqM9x1ozHVA-MA"
H={"Authorization":f"Bearer {T}","Content-Type":"application/json"}
def api(path, body, method="POST"):
    r=urllib.request.Request(f"https://sheets.googleapis.com/v4/spreadsheets/{SS}{path}",data=json.dumps(body).encode(),headers=H,method=method)
    return json.load(urllib.request.urlopen(r))
D=json.loads(Path("datos_reunion.json").read_text())
TITLE="Reunión 21-09"

# --- crear/limpiar hoja ---
meta=json.load(urllib.request.urlopen(urllib.request.Request(f"https://sheets.googleapis.com/v4/spreadsheets/{SS}?fields=sheets.properties",headers={"Authorization":f"Bearer {T}"})))
sid=next((s["properties"]["sheetId"] for s in meta["sheets"] if s["properties"]["title"]==TITLE), None)
if sid is None:
    res=api(":batchUpdate",{"requests":[{"addSheet":{"properties":{"title":TITLE,"index":0,"gridProperties":{"rowCount":90,"columnCount":9,"hideGridlines":True}}}}]})
    sid=res["replies"][0]["addSheet"]["properties"]["sheetId"]
else:
    api(":batchUpdate",{"requests":[{"updateCells":{"range":{"sheetId":sid},"fields":"*"}}]})

# --- cálculos ---
tot_coste=round(sum(c["coste"] for c in D["campanas"]),2)
tot_conv=int(sum(c["conv"] for c in D["campanas"]))
rest=round(2000-tot_coste,2)
cpl=round(tot_coste/tot_conv,2)
hoy=next((d for d in D["dias"] if d["f"]=="2026-09-21"),{"coste":0})

def dmy(s):
    y,m,dd=s.split("-"); return f"{int(dd)}/{int(m)}"

_d15={}
for x in D["disp"]:
    if x["f"]>="2026-09-15":
        a=_d15.setdefault(x["d"],[0,0.0,0.0]); a[0]+=x["clics"]; a[1]+=x["coste"]; a[2]+=x["conv"]
cpl_esc=round(_d15["DESKTOP"][1]/_d15["DESKTOP"][2],2) if _d15.get("DESKTOP",[0,0,0])[2] else 0
cpl_mov=round(_d15["MOBILE"][1]/_d15["MOBILE"][2],2) if _d15.get("MOBILE",[0,0,0])[2] else 0
_c7=sum(d["coste"] for d in D["dias"] if d["f"]>="2026-09-15"); _v7=sum(d["conv"] for d in D["dias"] if d["f"]>="2026-09-15")
cpl7=round(_c7/_v7,2) if _v7 else cpl
def n(x):
    return f"{x:,.2f}".replace(",","@").replace(".",",").replace("@",".")
coste_ayer_hoy=sum(d['coste'] for d in D['dias'] if d['f']>='2026-09-21')
rows=[]
def R(*c): rows.append(list(c))

R("OutThink 2026 · Cierre de la campaña de Google Ads")
R("Datos en vivo · la campaña se apaga hoy miércoles 23 a las 23:59 · evento mañana jueves 24/9")
R()
R("DÓNDE ESTAMOS")
R("Invertido", tot_coste, f"{round(tot_coste/2000*100)} % de los 2.000 €")
R("Registros", tot_conv, "objetivo inicial del plan: 200-300")
R("Coste por registro", cpl, "objetivo inicial del plan: 8-12 €")
R("Pendiente de invertir", rest, "último día de emisión: hoy hasta las 23:59")
R("Presupuesto consumido", round(coste_ayer_hoy,2), "invertido el 21, el 22 y el 23, tras los cambios de la reunión")
R()
R("POR CAMPAÑA · toda la campaña (31/8 – 23/9)")
R("Campaña","Estado","Impresiones","Clics","Coste","Registros","Coste/registro")
for c in sorted(D["campanas"], key=lambda x:-x["coste"]):
    st={"ENABLED":"Activa","PAUSED":"Pausada"}.get(c["st"],c["st"])
    R(c["n"],st,c["impr"],c["clics"],c["coste"],int(c["conv"]), round(c["coste"]/c["conv"],2) if c["conv"] else "—")
R("TOTAL","",sum(c["impr"] for c in D["campanas"]),sum(c["clics"] for c in D["campanas"]),tot_coste,tot_conv,cpl)
R()
R("LOS ÚLTIMOS 9 DÍAS · dónde se pierden las impresiones")
R("Fecha","Clics","Coste","Registros","Cuota de impresión","Perdida por presupuesto","Perdida por puja","")
ismap={x["f"]:x for x in D["is"]}
for d in D["dias"]:
    if d["f"] < "2026-09-12": continue
    i=ismap.get(d["f"],{})
    nota=""
    if d["f"] in ("2026-09-19","2026-09-20"): nota="← fin de semana al 50 % de puja: nos deja fuera de la subasta"
    if d["f"] in ("2026-09-21","2026-09-22"): nota="← tope de CPC a 4,50 €: Google sirve por encima del diario de 81,22 €"
    if d["f"]=="2026-09-23": nota="← último día, en curso"
    def pc(v): return round(float(v)*100,1)/100 if v is not None else ""
    R(dmy(d["f"]), d["clics"], d["coste"], int(d["conv"]), pc(i.get("is")), pc(i.get("pres")), pc(i.get("rank")), nota)
R()
R("ESCRITORIO VS MÓVIL · toda la campaña (31/8 – 23/9, Search)")
R("Dispositivo","Clics","Coste","Registros","Coste/registro","Conversión","")
tot_disp={}
for x in D["disp"]:
    a=tot_disp.setdefault(x["d"],[0,0.0,0.0]); a[0]+=x["clics"]; a[1]+=x["coste"]; a[2]+=x["conv"]
NOM={"DESKTOP":"Escritorio","MOBILE":"Móvil","TABLET":"Tableta"}
for k in ("DESKTOP","MOBILE","TABLET"):
    if k not in tot_disp: continue
    cl,co,cv=tot_disp[k]
    R(NOM[k], cl, round(co,2), int(cv), round(co/cv,2) if cv else "—", round(cv/cl,4) if cl else "", "")
R()
R("ESCRITORIO VS MÓVIL POR SEMANA · cómo ha ido cambiando")
R("Semana","Escritorio: coste/registro","Escritorio: conversión","Móvil: coste/registro","Móvil: conversión","")
sem_d=[("Semana 1 (31/8 – 6/9)","2026-08-31","2026-09-06"),("Semana 2 (7/9 – 13/9)","2026-09-07","2026-09-13"),
       ("Semana 3 (14/9 – 20/9)","2026-09-14","2026-09-20"),("Cierre (21/9 – 23/9)","2026-09-21","2026-09-24"),("Desde el ajuste (15/9 – 23/9)","2026-09-15","2026-09-24")]
for nom,a,b in sem_d:
    fila=[nom]
    for k in ("DESKTOP","MOBILE"):
        cl=sum(x["clics"] for x in D["disp"] if a<=x["f"]<=b and x["d"]==k)
        co=sum(x["coste"] for x in D["disp"] if a<=x["f"]<=b and x["d"]==k)
        cv=sum(x["conv"] for x in D["disp"] if a<=x["f"]<=b and x["d"]==k)
        fila += [round(co/cv,2) if cv else "— (0 reg.)", round(cv/cl,4) if cl else ""]
    fila.append("← el móvil se da la vuelta" if nom.startswith("Desde el ajuste") else "")
    R(*fila)
R()
R("ESCRITORIO VS MÓVIL · desde el primer ajuste de móvil (15/9 – 23/9)")
R("Dispositivo","Clics","Coste","Registros","Coste/registro","Conversión","")
agg={}
for x in D["disp"]:
    if x["f"]<"2026-09-15": continue
    a=agg.setdefault(x["d"],[0,0.0,0.0]); a[0]+=x["clics"]; a[1]+=x["coste"]; a[2]+=x["conv"]
for k in ("DESKTOP","MOBILE","TABLET"):
    if k not in agg: continue
    cl,co,cv=agg[k]
    R(NOM[k], cl, round(co,2), int(cv), round(co/cv,2) if cv else "—", round(cv/cl,4) if cl else "",
      "← el segmento más barato de toda la campaña" if k=="MOBILE" else "")
R("", "", "", "", "", "", "")
R(f"Acordamos el 18/9 excluir el móvil si en 3 días no registraba. Ha registrado 3 veces, a {n(cpl_mov)} € frente a los {n(cpl_esc)} € de escritorio. El 21/9 se sube de −70 % a −40 %.")
R()
R("CONVERSIÓN DE LA CAMPAÑA DE SEARCH POR SEMANA")
R("Semana","Clics","Registros","Conversión","")
sem=[("Semana 1 (31/8 – 6/9)","2026-08-31","2026-09-06"),("Semana 2 (7/9 – 13/9)","2026-09-07","2026-09-13"),("Semana 3 (14/9 – 20/9)","2026-09-14","2026-09-20"),("Cierre (21/9 – 23/9)","2026-09-21","2026-09-24")]
for nom,a,b in sem:
    cl=sum(x["clics"] for x in D["disp"] if a<=x["f"]<=b); cv=sum(x["conv"] for x in D["disp"] if a<=x["f"]<=b)
    R(nom, cl, int(cv), round(cv/cl,4) if cl else "", "← recupera tras los frenos y el ajuste de móvil" if nom.startswith("Semana 3") else "")
R()
R("POR GRUPO DE ANUNCIOS · todo el periodo")
R("Grupo","Estado","Clics","Coste","Registros","Coste/registro")
for g in sorted(D["grupos"], key=lambda x:-x["coste"]):
    st={"ENABLED":"Activo","PAUSED":"Pausado"}.get(g["st"],g["st"])
    R(g["n"],st,g["clics"],g["coste"],int(g["conv"]), round(g["coste"]/g["conv"],2) if g["conv"] else "—")
R()
R("CAMBIOS ACORDADOS EN LA REUNIÓN · resultado")
R("1. Tope de CPC","3,00 → 4,50 €","APLICADO el 21/9 · el gasto diario pasa de 12 € el domingo a 164 € y 162 € el lunes y el martes")
R("2. Modificador de móvil","−70 % → −40 %",f"APLICADO el 21/9 · desde el 15/9 el móvil registra a {n(cpl_mov)} € y escritorio a {n(cpl_esc)} €")
R("3. Fin de campaña","miércoles 23 a las 23:59","APLICADO el 21/9 · fecha de finalización en las 4 campañas")
R("4. Presupuesto de Search","no hace falta","Google sirvió por encima del diario (hasta 2x) y el presupuesto se ha consumido entero")
R()
R(f"Cierre previsto: el día de hoy acabará en torno a 103 € (el martes, de esta hora en adelante, gastó 34 €), así que la campaña termina alrededor de 2.015 €, un 0,8 % por encima de los 2.000 comprometidos.")
R()
R("OTROS CAMBIOS APLICADOS EL 21/9")
R("9 negativas nuevas de ferias y eventos de la competencia: digimarcon, accenture, intellisys, techshow, e show,")
R("global fabric day, ifema, ai infra summit, industry x. Van 137 negativas en la campaña.")

api(f"/values/{urllib.parse.quote(TITLE)}!A1?valueInputOption=USER_ENTERED",
    {"values":[[("" if c is None else c) for c in r] for r in rows]}, method="PUT")
print("filas escritas:", len(rows), "sheetId", sid)
Path("sheet_rows.json").write_text(json.dumps({"sid":sid,"n":len(rows),"rows":rows},ensure_ascii=False))
