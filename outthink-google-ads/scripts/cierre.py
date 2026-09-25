import json
from pathlib import Path
D=json.loads(Path("datos_reunion.json").read_text())
def n(x): return f"{x:,.2f}".replace(",","@").replace(".",",").replace("@",".")
coste=round(sum(c["coste"] for c in D["campanas"]),2); conv=int(sum(c["conv"] for c in D["campanas"]))
clics=sum(c["clics"] for c in D["campanas"]); impr=sum(c["impr"] for c in D["campanas"])
print(f"CIERRE DEFINITIVO: {n(coste)} € · {impr} impr · {clics} clics · {conv} reg · CPL {n(round(coste/conv,2))} € · CTR {clics/impr*100:.2f} %")
print("\nPOR CAMPAÑA:")
for c in sorted(D["campanas"],key=lambda x:-x["coste"]):
    cpl=n(round(c["coste"]/c["conv"],2)) if c["conv"] else "—"
    cvr=f'{c["conv"]/c["clics"]*100:.1f} %' if c["clics"] else "—"
    print(f'  {c["n"]:28} impr={c["impr"]:>6} clics={c["clics"]:>5} coste={n(c["coste"]):>9} € reg={int(c["conv"]):>2} CPL={cpl:>8} CVR={cvr}')
print("\nPOR GRUPO (Search):")
for g in sorted(D["grupos"],key=lambda x:-x["coste"]):
    cpl=n(round(g["coste"]/g["conv"],2)) if g["conv"] else "—"
    print(f'  {g["n"]:30} {g["st"]:8} clics={g["clics"]:>4} coste={n(g["coste"]):>9} € reg={int(g["conv"]):>2} CPL={cpl}')
print("\nDISPOSITIVO (Search, total):")
agg={}
for x in D["disp"]:
    a=agg.setdefault(x["d"],[0,0.0,0.0]); a[0]+=x["clics"]; a[1]+=x["coste"]; a[2]+=x["conv"]
for k,v in sorted(agg.items()):
    print(f'  {k:8} clics={v[0]:>4} coste={n(round(v[1],2)):>9} € reg={int(v[2]):>2} CPL={n(round(v[1]/v[2],2)) if v[2] else "—":>8} CVR={v[2]/v[0]*100:.1f} %' if v[0] else k)
print("\nPOR SEMANA (Search):")
sem=[("S1 31/8–6/9","2026-08-31","2026-09-06"),("S2 7/9–13/9","2026-09-07","2026-09-13"),("S3 14/9–20/9","2026-09-14","2026-09-20"),("S4 21/9–23/9","2026-09-21","2026-09-25")]
for nom,a,b in sem:
    cl=sum(x["clics"] for x in D["disp"] if a<=x["f"]<=b); co=sum(x["coste"] for x in D["disp"] if a<=x["f"]<=b); cv=sum(x["conv"] for x in D["disp"] if a<=x["f"]<=b)
    print(f'  {nom:14} clics={cl:>4} coste={n(round(co,2)):>9} € reg={int(cv):>2} CPL={n(round(co/cv,2)) if cv else "—":>8} CVR={cv/cl*100:.1f} %')
print("\nTODOS LOS DÍAS:")
for d in D["dias"]: print(f'  {d["f"]} impr={d["impr"]:>6} clics={d["clics"]:>4} coste={n(d["coste"]):>8} € reg={int(d["conv"])}')
