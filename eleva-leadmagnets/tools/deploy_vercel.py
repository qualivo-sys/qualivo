#!/usr/bin/env python3
"""Despliega public/ + api/lead.js + vercel.json a Vercel (sin git). Requiere VERCEL_TOKEN en el entorno.
Antes: python3 tools/make_index.py"""
import urllib.request, json, os, base64, time, glob
T=os.environ["VERCEL_TOKEN"]; TEAM="team_uR0OyaeR4gkeEwNLp9hHT7Fa"
ROOT="/home/user/qualivo/eleva-leadmagnets"
def call(method,path,body=None):
    for _ in range(5):
        try:
            data=json.dumps(body).encode() if body is not None else None
            req=urllib.request.Request("https://api.vercel.com"+path,data=data,method=method,
                headers={"Authorization":"Bearer "+T,"Content-Type":"application/json"})
            return json.loads(urllib.request.urlopen(req,timeout=120).read())
        except urllib.error.HTTPError as e: return {"_e":e.code,"_b":e.read().decode()[:400]}
        except Exception: time.sleep(3)
    return {"_e":"net"}
files=[]
def add(abspath, rel):
    files.append({"file":rel,"data":base64.b64encode(open(abspath,'rb').read()).decode(),"encoding":"base64"})
add(ROOT+"/vercel.json","vercel.json")
for p in glob.glob(ROOT+"/public/*"):
    if os.path.isfile(p): add(p, os.path.basename(p))
# ¡la función serverless!
add(ROOT+"/api/lead.js","api/lead.js")
if os.path.exists(ROOT+"/package.json"): add(ROOT+"/package.json","package.json")
print("archivos:",len(files),"| incluye api/lead.js:", any(f["file"]=="api/lead.js" for f in files))
r=call("POST","/v13/deployments?teamId=%s&forceNew=1"%TEAM,{"name":"eleva-calculadora","files":files,"projectSettings":{"framework":None},"target":"production"})
if r.get("_e"): print("ERR",r); raise SystemExit
did=r["id"]; print("deploy",did,r.get("url"))
for _ in range(45):
    time.sleep(6); s=call("GET","/v13/deployments/%s?teamId=%s"%(did,TEAM))
    st=s.get("readyState") or s.get("status")
    if st in ("READY","ERROR","CANCELED"): print("FINAL:",st); break
