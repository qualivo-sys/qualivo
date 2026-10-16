import json, re, subprocess, sys, concurrent.futures as cf
S="/tmp/claude-0/-home-user-qualivo/382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad"
cand=json.load(open(f"{S}/candidatas_12oct.json"))
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"
HUELLAS={
 "hubspot":(r"js\.hs-scripts\.com|hs-analytics\.net|hsforms\.(net|com)|js\.hsforms",),
 "salesforce":(r"pardot\.com|pi\.pardot|salesforce\.com/form|web-to-lead|d\.la\d+-core",),
 "pipedrive":(r"pipedrive(webforms)?\.com|webforms\.pipedrive",),
 "zoho":(r"zohopublic|zoho\.com/(crm|salesiq)|salesiq\.zoho|crm\.zoho",),
 "ga4":(r"gtag\('config',\s*'G-|googletagmanager\.com/gtag/js\?id=G-",),
 "gtm":(r"googletagmanager\.com/gtm\.js|GTM-[A-Z0-9]{5,}",),
 "meta":(r"connect\.facebook\.net/.*/fbevents\.js|fbq\('init'",),
 "ads":(r"googleadservices\.com|googletagmanager\.com/gtag/js\?id=AW-|AW-\d{9}",),
}
def mira(par):
    nom,dom=par
    out={"empresa":nom,"dominio":dom,"http":None,"senales":[]}
    for url in (f"https://{dom}/", f"https://www.{dom}/"):
        r=subprocess.run(["curl","-sL","--max-time","25","-A",UA,"-w","\n@@%{http_code}",url],
                         capture_output=True)
        t=r.stdout.decode("utf-8","replace")
        cod=t.rsplit("@@",1)[-1].strip() if "@@" in t else "0"
        out["http"]=cod
        if cod.startswith("2") and len(t)>500:
            for k,(pat,) in HUELLAS.items():
                if re.search(pat,t,re.I): out["senales"].append(k)
            break
    return out
with cf.ThreadPoolExecutor(max_workers=8) as ex:
    res=list(ex.map(mira,cand))
json.dump(res,open(f"{S}/probe_12oct.json","w"),ensure_ascii=False,indent=1)
CRM={"hubspot","salesforce","pipedrive","zoho"}
con,sin,caidas=[],[],[]
for r in res:
    crm=[s for s in r["senales"] if s in CRM]
    if not str(r["http"]).startswith("2"): caidas.append(r)
    elif crm: r["crm"]=crm; con.append(r)
    else: sin.append(r)
print(f"CON CRM verificado en la web: {len(con)}")
for r in con: print(f"   {r['dominio']:34s} {'+'.join(r['crm']):22s} otras: {','.join(s for s in r['senales'] if s not in CRM)}")
print(f"\nsin CRM visible: {len(sin)}  ({', '.join(r['dominio'] for r in sin)})")
print(f"web caida o bloqueada: {len(caidas)}  ({', '.join(r['dominio'] for r in caidas)})")
