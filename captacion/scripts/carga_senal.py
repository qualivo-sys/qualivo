# Carga en las campanas de senal los leads revelados por los agentes (20-oct).
# Orden de Maikel 20-oct: "haz lo que consideres ... las empresas de senales, CRM
# o campanas activas ... igual no haria falta hacer tanto filtro".
# Filtro minimo que se mantiene (entregabilidad y RGPD): verificado, no catch-all,
# mismo dominio, no buzon de rol, no contactado antes, no bloqueado, Espana.
# El copy va por lead con carga_v3.construir(); la secuencia de la campana no se toca.
# Uso: python3 carga_senal_20oct.py <clave> [--dry]
import json, re, sys, time, urllib.request, urllib.error, os
sys.path.insert(0, "/home/user/qualivo/captacion/scripts")
import carga_v3
S = os.environ.get("SP") or os.path.dirname(os.path.abspath(__file__))  # carpeta con los JSON de Apollo
k = sys.argv[1]; dry = "--dry" in sys.argv
B = "https://server.smartlead.ai/api/v1"

CAMP = {"google_ads": 3963336, "meta_ads": 3964316, "linkedin_ads": 3964077,
        ("crm", "Salesforce"): 3963217, ("crm", "Odoo"): 3963237,
        ("crm", "Zoho"): 3964313, ("crm", "Pipedrive"): 3964076, ("crm", "HubSpot"): 3940264}
BLOQ = {"growitschool.com", "growthhackingcourse.io", "anticbarcelona113.es", "formacion.ninja",
        "kubysoft.com", "escolaeronauticadecatalunya.cat", "rfaeco.com", "asimetricconsultores.com",
        "thinkingwithyou.com", "clinicasgoaldental.com", "cosmomedia.es", "hotelverse.tech"}
ROL = re.compile(r"^(info|hola|contacto|admin|administracion|ventas|comercial|marketing|rrhh|office|"
                 r"hello|sales|soporte|support|recepcion|clinica|secretaria|operaciones|academia|"
                 r"formacion|gerencia|direccion|gestion)@")

def pide(m, r, body=None):
    for i in range(4):
        q = urllib.request.Request(f"{B}{r}?api_key={k}", data=json.dumps(body).encode() if body is not None else None,
                                   headers={"User-Agent": "Mozilla/5.0", "Content-Type": "application/json"}, method=m)
        try:
            with urllib.request.urlopen(q, timeout=120) as x: return x.status, x.read().decode()[:400]
        except urllib.error.HTTPError as e: return e.code, e.read().decode()[:300]
        except Exception: time.sleep(2 ** i)

env = json.load(open(f"{S}/enviados_reales.json"))
env = set(e.lower() for e in (env["correos"] if isinstance(env, dict) else env))
envd = {e.split("@")[-1] for e in env}
ya = set(); por = {}; fuera = {}
for f in ("apollo_google_ads_20oct.json", "apollo_meta_ads_20oct.json", "apollo_crm_20oct.json"):
    p = f"{S}/{f}"
    if not os.path.exists(p): print("falta", f); continue
    for l in json.load(open(p)):
        em = (l.get("email") or "").lower(); d = em.split("@")[-1]
        dom = (l.get("dom") or "").lower().removeprefix("www.")
        m = ((not em and "sin correo") or (l.get("email_status") != "verified" and "no verificado")
             or (l.get("catchall") and "catch-all") or (d != dom and "dominio cruzado")
             or (ROL.match(em) and "buzon de rol") or (em in env and "ya contactado")
             or (d in envd and "empresa ya contactada") or (d in BLOQ and "bloqueado")
             or ((l.get("country") or "Spain") != "Spain" and "fuera de Espana")
             or (d in ya and "duplicado")
             or (re.search(r"marketing|advertising|staffing|recruit|computer software|information technology|internet", (l.get("industry") or "").lower()) and "sector fuera (agencia/software/seleccion)"))
        if m: fuera[m] = fuera.get(m, 0) + 1; continue
        ya.add(d)
        clave = l["puerta"] if l["puerta"] != "crm" else ("crm", l["v"]["crm"])
        l["dom"] = dom; l["email"] = em
        por.setdefault(clave, []).append(l)
print("descartes:", fuera)
total = 0
for clave, ls in por.items():
    filas = []
    for l in ls:
        s, b1, b2, b3 = carga_v3.construir(l)
        filas.append({"email": l["email"], "first_name": l.get("first_name") or "", "last_name": l.get("last_name") or "",
                      "company_name": carga_v3.limpia_empresa(l.get("company_name") or ""), "website": l["dom"],
                      "custom_fields": {"subject1": s, "body1": b1, "body2": b2, "body3": b3,
                                        "puerta": l["puerta"], "origen": "senal-20oct"}})
    cid = CAMP[clave]; total += len(filas)
    if dry: print(clave, cid, len(filas)); continue
    st, b = pide("POST", f"/campaigns/{cid}/leads", {"lead_list": filas, "settings": {
        "ignore_global_block_list": False, "ignore_unsubscribe_list": False,
        "ignore_duplicate_leads_in_other_campaign": False}})
    print(clave, cid, len(filas), st, b[:200])
print("total", total)
