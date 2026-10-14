# Sonda de senal para los dormidos que no traen ninguna (infoproducto y
# construccion). Sin senal verificada no hay primera linea honesta, y sin
# primera linea honesta el lead no entra. Es gratis: solo curl contra su web.
import json, re, subprocess, concurrent.futures as cf
from collections import Counter
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"
HUELLAS = {
    "ga4":        r"gtag\('config',\s*'G-|googletagmanager\.com/gtag/js\?id=G-|\"G-[A-Z0-9]{8,}\"",
    "gtm":        r"googletagmanager\.com/gtm\.js|GTM-[A-Z0-9]{5,}",
    "meta":       r"connect\.facebook\.net/[^\"']*/fbevents\.js|fbq\(\s*['\"]init",
    "ads":        r"googleadservices\.com|googletagmanager\.com/gtag/js\?id=AW-|AW-\d{9}",
    "hubspot":    r"js\.hs-scripts\.com|hs-analytics\.net|hsforms\.(net|com)",
    "salesforce": r"pardot\.com|pi\.pardot|web-to-lead",
    "pipedrive":  r"pipedrive(webforms)?\.com",
    "zoho":       r"zohopublic|salesiq\.zoho|crm\.zoho",
    "mailchimp":  r"list-manage\.com|chimpstatic\.com|mailchimp\.com/",
    "brevo":      r"sibforms\.com|sendinblue\.com|brevo\.com/",
}
def dominio(e): return e.split("@")[-1].lower().replace("www.", "")

def mira(lead):
    dom = dominio(lead["email"])
    out = dict(lead); out["dominio"] = dom; out["http"] = None; out["sondeo"] = []
    for url in (f"https://{dom}/", f"https://www.{dom}/"):
        r = subprocess.run(["curl", "-sL", "--max-time", "20", "-A", UA,
                            "-w", "\n@@%{http_code}", url], capture_output=True)
        t = r.stdout.decode("utf-8", "replace")
        cod = t.rsplit("@@", 1)[-1].strip() if "@@" in t else "0"
        out["http"] = cod
        if cod.startswith("2") and len(t) > 800:
            out["sondeo"] = [k for k, p in HUELLAS.items() if re.search(p, t, re.I)]
            break
    return out

lim = json.load(open("dormidos_limpios.json"))
sin_senal = [x for x in lim if x["senal"] in ("infoproducto", "construccion", "obra", "asesoria")]
print(f"sondeando {len(sin_senal)} dominios sin senal de herramienta", flush=True)
with cf.ThreadPoolExecutor(max_workers=14) as ex:
    res = list(ex.map(mira, sin_senal))
json.dump(res, open("sondeo_dormidos.json", "w"), ensure_ascii=False, indent=1)
vivas = [r for r in res if str(r["http"]).startswith("2")]
con = [r for r in vivas if r["sondeo"]]
print(f"web responde: {len(vivas)} de {len(res)} · con alguna senal: {len(con)}")
c = Counter()
for r in con:
    for s in r["sondeo"]: c[s] += 1
print("senales:", dict(c.most_common()))
