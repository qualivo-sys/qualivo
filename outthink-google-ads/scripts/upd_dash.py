import json, urllib.request, urllib.parse
from pathlib import Path
T=Path("sa_access_token.txt").read_text().strip()
SS="1-UKqrxTObh4ME2LHldlD6eREll1EiIqM9x1ozHVA-MA"
H={"Authorization":f"Bearer {T}","Content-Type":"application/json"}
D=json.loads(Path("datos_reunion.json").read_text())
coste=round(sum(c["coste"] for c in D["campanas"]),2); conv=int(sum(c["conv"] for c in D["campanas"]))
rest=round(2000-coste,2)
c7=sum(d["coste"] for d in D["dias"] if d["f"]>="2026-09-15"); v7=sum(d["conv"] for d in D["dias"] if d["f"]>="2026-09-15")
cpl7=c7/v7 if v7 else coste/conv
proy=conv+round(rest/cpl7)
def n(x): return f"{x:,.2f}".replace(",","@").replace(".",",").replace("@",".")
vals=[["Actualizado el 21/9 · la campaña se apaga el miércoles 23 a las 23:59"],[],
 ["REGISTROS","","COSTE POR REGISTRO","","INVERTIDO","","PROYECCIÓN","","DÍAS RESTANTES"],
 [conv,"",n(round(coste/conv,2))+" €","",n(coste)+" €","",proy,"",2],
 [f"{round(conv/200*100)} % del objetivo (200)","","objetivo 8-12 €","",f"{round(coste/2000*100)} % de 2.000 €","","si se invierte el resto","","martes 22 y miércoles 23"]]
r=urllib.request.Request(f"https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{urllib.parse.quote('Dashboard')}!A2?valueInputOption=USER_ENTERED",
    data=json.dumps({"values":vals}).encode(),headers=H,method="PUT")
print(json.load(urllib.request.urlopen(r))["updatedRange"], "| registros",conv,"coste",coste,"proy",proy)
