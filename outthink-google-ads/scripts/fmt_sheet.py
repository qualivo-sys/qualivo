import json, urllib.request, urllib.parse
from pathlib import Path
T=Path("sa_access_token.txt").read_text().strip()
SS="1-UKqrxTObh4ME2LHldlD6eREll1EiIqM9x1ozHVA-MA"
H={"Authorization":f"Bearer {T}","Content-Type":"application/json"}
def bu(reqs):
    r=urllib.request.Request(f"https://sheets.googleapis.com/v4/spreadsheets/{SS}:batchUpdate",data=json.dumps({"requests":reqs}).encode(),headers=H)
    return json.load(urllib.request.urlopen(r))
S=json.loads(Path("sheet_rows.json").read_text()); sid=S["sid"]; rows=S["rows"]
EUR={"type":"CURRENCY","pattern":'#,##0.00\\ "€"'}
PCT={"type":"PERCENT","pattern":"0.0%"}
NUM={"type":"NUMBER","pattern":"#,##0"}
INK="#1a1a1a"; MUT="#6b7280"; ACC="#0b5fff"
def hx(h): h=h.lstrip("#"); return {"red":int(h[0:2],16)/255,"green":int(h[2:4],16)/255,"blue":int(h[4:6],16)/255}
def cell(r,c,**f): return {"repeatCell":{"range":{"sheetId":sid,"startRowIndex":r,"endRowIndex":r+1,"startColumnIndex":c,"endColumnIndex":c+1},"cell":{"userEnteredFormat":f},"fields":"userEnteredFormat("+",".join(f)+")"}}
def rng(r,c0,c1,**f): return {"repeatCell":{"range":{"sheetId":sid,"startRowIndex":r,"endRowIndex":r+1,"startColumnIndex":c0,"endColumnIndex":c1},"cell":{"userEnteredFormat":f},"fields":"userEnteredFormat("+",".join(f)+")"}}
R=[]
R.append({"updateSheetProperties":{"properties":{"sheetId":sid,"gridProperties":{"frozenRowCount":2,"hideGridlines":True}},"fields":"gridProperties.frozenRowCount,gridProperties.hideGridlines"}})
R.append({"repeatCell":{"range":{"sheetId":sid},"cell":{"userEnteredFormat":{"textFormat":{"fontFamily":"Inter","fontSize":10,"foregroundColor":hx(INK)},"verticalAlignment":"MIDDLE"}},"fields":"userEnteredFormat(textFormat,verticalAlignment)"}})
for c,w in enumerate([300,140,140,120,160,150,160,340,120]):
    R.append({"updateDimensionProperties":{"range":{"sheetId":sid,"dimension":"COLUMNS","startIndex":c,"endIndex":c+1},"properties":{"pixelSize":w},"fields":"pixelSize"}})
R.append(rng(0,0,9,textFormat={"fontFamily":"Inter","fontSize":16,"bold":True,"foregroundColor":hx(INK)}))
R.append(rng(1,0,9,textFormat={"fontFamily":"Inter","fontSize":10,"foregroundColor":hx(MUT)}))

HEADS={"Campaña","Fecha","Dispositivo","Semana","Grupo"}
hdr=None
for i,row in enumerate(rows):
    if not row: hdr=None; continue
    first=str(row[0]) if row else ""
    is_sec = len(row)==1 and first and first==first.upper() and len(first)<70
    if is_sec:
        R.append(rng(i,0,9,textFormat={"fontFamily":"Inter","fontSize":11,"bold":True,"foregroundColor":hx(ACC)}))
        hdr=None; continue
    if first in HEADS:
        hdr=[str(x) for x in row]
        R.append(rng(i,0,9,textFormat={"fontFamily":"Inter","fontSize":9,"bold":True,"foregroundColor":hx(MUT)},
                     backgroundColor=hx("#f3f4f6"),wrapStrategy="WRAP"))
        continue
    if first=="TOTAL":
        R.append(rng(i,0,9,textFormat={"fontFamily":"Inter","fontSize":10,"bold":True,"foregroundColor":hx(INK)},backgroundColor=hx("#eef2ff")))
    # notas en la última columna
    for c,v in enumerate(row):
        if isinstance(v,str) and v.startswith("←"):
            R.append(cell(i,c,textFormat={"fontFamily":"Inter","fontSize":9,"italic":True,"foregroundColor":hx("#b45309")}))
    if hdr:
        for c,v in enumerate(row):
            if c>=len(hdr) or not isinstance(v,(int,float)): continue
            h=hdr[c].lower()
            f = EUR if ("coste" in h or "€" in h) else (PCT if ("conversión" in h or "cuota" in h or "perdida" in h) else NUM)
            R.append(cell(i,c,numberFormat=f,horizontalAlignment="RIGHT"))
    elif len(row)>=2 and isinstance(row[1],(int,float)):
        f = NUM if "Registros" in first else EUR
        R.append(cell(i,1,numberFormat=f,horizontalAlignment="RIGHT",textFormat={"fontFamily":"Inter","fontSize":13,"bold":True,"foregroundColor":hx(INK)}))
        R.append(cell(i,0,textFormat={"fontFamily":"Inter","fontSize":10,"bold":True,"foregroundColor":hx(INK)}))
        if len(row)>2: R.append(cell(i,2,textFormat={"fontFamily":"Inter","fontSize":9,"foregroundColor":hx(MUT)}))
    elif first[:2] in ("1.","2.","3.","4.","5."):
        R.append(cell(i,0,textFormat={"fontFamily":"Inter","fontSize":10,"bold":True,"foregroundColor":hx(INK)}))
        R.append(cell(i,1,textFormat={"fontFamily":"Inter","fontSize":10,"bold":True,"foregroundColor":hx("#047857")}))
        R.append(cell(i,2,textFormat={"fontFamily":"Inter","fontSize":9,"foregroundColor":hx(MUT)}))
    elif first.startswith(("Acordamos","Proyección","9 negativas","global fabric")):
        R.append(rng(i,0,9,textFormat={"fontFamily":"Inter","fontSize":9,"italic":True,"foregroundColor":hx(MUT)}))
for k in range(0,len(R),40):
    bu(R[k:k+40])
print("formato aplicado:", len(R), "peticiones")
