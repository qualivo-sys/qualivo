import json, subprocess, sys, collections
K=sys.argv[1]; API="https://server.smartlead.ai/api/v1"
UA=["-H","User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]
def get(u):
    r=subprocess.run(["curl","-s",*UA,u],capture_output=True)
    try: return json.loads(r.stdout.decode("utf-8","replace"))
    except Exception: return None
CLI=("kubysoft","dkr")
camps=get(f"{API}/campaigns?api_key={K}") or []
print(f"{'campana':44s} {'STARTED':>8s} {'INPROG':>7s} {'tope':>5s} {'dias':>5s}")
tot_s=0
for c in camps:
    if c.get("status")!="ACTIVE": continue
    cid,nom=c.get("id"),c.get("name") or ""
    cli=any(x in nom.lower() for x in CLI)
    e=collections.Counter(); off=0
    while off<=5000:
        p=get(f"{API}/campaigns/{cid}/leads?api_key={K}&offset={off}&limit=100") or {}
        ds=p.get("data") or []
        if not ds: break
        for f in ds: e[str(f.get("status") or "?")]+=1
        off+=100
    tope=c.get("max_leads_per_day") or 0
    st=e.get("STARTED",0)
    dias=round(st/tope,1) if tope else "-"
    marca=" [cliente]" if cli else ""
    print(f"{(nom[:42]+marca):44s} {st:8d} {e.get('INPROGRESS',0):7d} {str(tope):>5s} {str(dias):>5s}")
    if not cli: tot_s+=st
print(f"\nSTARTED total en campanas ACTIVE propias: {tot_s}")
