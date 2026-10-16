import json, subprocess, sys, collections
K=sys.argv[1]; DESDE=sys.argv[2]; API="https://server.smartlead.ai/api/v1"
UA=["-H","User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]
def get(u):
    r=subprocess.run(["curl","-s",*UA,u],capture_output=True)
    try: return json.loads(r.stdout.decode("utf-8","replace"))
    except Exception: return None
CLI=("kubysoft","dkr")
camps=get(f"{API}/campaigns?api_key={K}") or []
out=[]
for c in camps:
    if c.get("status")!="ACTIVE": continue
    nom=c.get("name") or ""
    if any(x in nom.lower() for x in CLI): continue
    cid=c.get("id"); off=0
    while off<=20000:
        p=get(f"{API}/campaigns/{cid}/statistics?api_key={K}&offset={off}&limit=1000") or {}
        ds=p.get("data") or []
        if not ds: break
        for f in ds:
            cl=f.get("click_count") or 0
            op=f.get("open_count") or 0
            st=f.get("sent_time") or ""
            if f.get("reply_time"): continue
            if (cl>0 or op>=3) and str(st)>=DESDE:
                out.append({"campana":nom,"cid":cid,"lead":f.get("lead_email"),
                            "clics":cl,"aperturas":op,"enviado":st,
                            "paso":f.get("sequence_number")})
        off+=1000
out.sort(key=lambda x:(-x["clics"],-x["aperturas"]))
for r in out: print(json.dumps(r,ensure_ascii=False))
print(f"\ntotal con clic o 3+ aperturas, sin respuesta, desde {DESDE}: {len(out)}")
