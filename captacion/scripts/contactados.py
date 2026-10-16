import json, subprocess, sys, re
K=sys.argv[1]; API="https://server.smartlead.ai/api/v1"
UA=["-H","User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]
def get(u):
    r=subprocess.run(["curl","-s",*UA,u],capture_output=True)
    try: return json.loads(r.stdout.decode("utf-8","replace"))
    except Exception: return None
dom=set(); emp=set()
for c in (get(f"{API}/campaigns?api_key={K}") or []):
    cid=c.get("id"); off=0
    while off<=20000:
        p=get(f"{API}/campaigns/{cid}/leads?api_key={K}&offset={off}&limit=100") or {}
        ds=p.get("data") or []
        if not ds: break
        for f in ds:
            l=f.get("lead") or f
            e=str(l.get("email") or "").lower()
            if "@" in e: dom.add(e.split("@")[1].lstrip("www."))
            n=str(l.get("company_name") or "").lower().strip()
            if n: emp.add(re.sub(r"[^a-z0-9]","",n))
        off+=100
json.dump({"dominios":sorted(dom),"empresas":sorted(emp)},open(sys.argv[2],"w"))
print(f"dominios contactados: {len(dom)}   nombres de empresa: {len(emp)}")
