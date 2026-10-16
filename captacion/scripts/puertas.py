#!/usr/bin/env python3
"""Agrupa todas las campanas por PUERTA DE SENAL y aplica la regla de corte de
Maikel para decidir que puerta se cierra y a cual se le mueve el volumen.

Por que existe: el 16-sep la tabla del parte diario mostraba Google Ads 3/40,
Zoho 1/20, LinkedIn Ads 1/20, Salesforce 1/50 y cero respuestas en Pipedrive,
Odoo, Dynamics, Brevo, Mailchimp y ActiveCampaign. Eso es UN dia, y un dia no
cierra nada. Este script no lleva mi conclusion dentro: lee todo el historico y
aplica la regla que ya existe.

LA REGLA (de Maikel, 11-sep):
    con 7 dias y 100+ envios -> >=5% de respuestas reales: doblar volumen
                                2-5%: una semana mas cambiando el angulo
                                <2%: cerrar
    Nunca se decide por aperturas.
Por debajo de 100 envios no se toca nada: se declara muestra insuficiente.

Uso:
    python3 puertas.py "$SMARTLEAD_KEY"                 # solo informa
    python3 puertas.py "$SMARTLEAD_KEY" --aplicar       # mueve topes
    python3 puertas.py "$SMARTLEAD_KEY" --json out.json

NUNCA toca /sequences. Hay un guardia explicito al final del fichero que lo
impide: un POST de secuencia sobre una campana con leads dentro reinicia los
envios, y eso es una prohibicion permanente.
"""
import collections
import json
import re
import subprocess
import sys

API = "https://server.smartlead.ai/api/v1"
UA = ["-H", "User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]

# Nombre de campana -> puerta. El orden importa: gana la primera que encaje.
# Se mira el nombre porque es donde esta la senal; no hay campo de puerta.
PUERTAS = [
    ("google-ads",     r"google\s*ads"),
    ("linkedin-ads",   r"linkedin\s*ads"),
    ("meta-ads",       r"\bmeta\b|facebook"),
    ("salesforce",     r"salesforce"),
    ("zoho",           r"zoho"),
    ("dynamics",       r"dynamics"),
    ("pipedrive",      r"pipedrive"),
    ("odoo",           r"odoo"),
    ("hubspot",        r"hubspot"),
    ("activecampaign", r"activecampaign|active\s*campaign"),
    ("brevo",          r"brevo|sendinblue"),
    ("mailchimp",      r"mailchimp"),
    ("intelligence",   r"intelligence"),
    ("curso-abierto",  r"curso sin cerrar"),
]


def get(url):
    r = subprocess.run(["curl", "-s", *UA, url], capture_output=True)
    try:
        return json.loads(r.stdout.decode("utf-8", "replace"))
    except Exception:
        return None


def puerta_de(nombre):
    n = (nombre or "").lower()
    for etiqueta, patron in PUERTAS:
        if re.search(patron, n):
            return etiqueta
    return "sin-clasificar"


def estadisticas(key, cid):
    """/statistics pagina. Con limit>1000 devuelve 0 filas en silencio."""
    off, filas = 0, []
    while off <= 20000:
        p = get(f"{API}/campaigns/{cid}/statistics"
                f"?api_key={key}&offset={off}&limit=1000") or {}
        ds = p.get("data") or []
        if not ds:
            break
        filas += ds
        off += 1000
    return filas


def veredicto(envios, respuestas):
    """La regla. Devuelve (decision, motivo)."""
    if envios < 100:
        return "insuficiente", f"solo {envios} envios, la regla pide 100"
    tasa = 100.0 * respuestas / envios
    if tasa >= 5:
        return "doblar", f"{tasa:.1f}% de respuesta real"
    if tasa >= 2:
        return "una-semana-mas", f"{tasa:.1f}%, cambiar el angulo antes de volver a medir"
    return "cerrar", f"{tasa:.1f}%, por debajo del 2%"


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    key = sys.argv[1]
    aplicar = "--aplicar" in sys.argv
    destino_json = None
    if "--json" in sys.argv:
        destino_json = sys.argv[sys.argv.index("--json") + 1]

    camps = get(f"{API}/campaigns?api_key={key}") or []
    if not isinstance(camps, list):
        sys.exit("no he podido leer las campanas; revisa la clave")

    por_puerta = collections.defaultdict(
        lambda: {"envios": 0, "respuestas": 0, "campanas": []})

    for c in camps:
        cid, nombre = c.get("id"), c.get("name") or ""
        if not cid:
            continue
        filas = estadisticas(key, cid)
        # Una fila por envio. "reply_time" relleno = contesto una persona o un
        # autorespondedor; Smartlead no los distingue, asi que la cifra es un
        # techo, no una respuesta humana. Queda dicho en la salida.
        env = len(filas)
        resp = sum(1 for f in filas if f.get("reply_time"))
        if not env:
            continue
        p = puerta_de(nombre)
        por_puerta[p]["envios"] += env
        por_puerta[p]["respuestas"] += resp
        por_puerta[p]["campanas"].append(
            {"id": cid, "nombre": nombre, "estado": c.get("status"),
             "envios": env, "respuestas": resp})

    salida = {"puertas": {}, "aviso": (
        "respuestas = filas con reply_time, que incluye autorespondedores. "
        "En el triaje del 11-sep 36 de 108 respuestas eran ausencias "
        "automaticas, o sea un tercio. Trata estas tasas como techo.")}

    orden = sorted(por_puerta.items(),
                   key=lambda kv: (-kv[1]["envios"]))
    print(f"{'puerta':16} {'env':>6} {'resp':>5} {'tasa':>7}  decision")
    for p, d in orden:
        dec, motivo = veredicto(d["envios"], d["respuestas"])
        tasa = 100.0 * d["respuestas"] / d["envios"] if d["envios"] else 0
        print(f"{p:16} {d['envios']:>6} {d['respuestas']:>5} {tasa:>6.1f}%  {dec} ({motivo})")
        salida["puertas"][p] = dict(d, decision=dec, motivo=motivo, tasa=round(tasa, 2))

    cerrar = [p for p, d in salida["puertas"].items() if d["decision"] == "cerrar"]
    doblar = [p for p, d in salida["puertas"].items() if d["decision"] == "doblar"]
    print()
    print(f"cerrar: {', '.join(cerrar) or 'ninguna'}")
    print(f"doblar: {', '.join(doblar) or 'ninguna'}")

    if not doblar and cerrar:
        print("\nOJO: hay puertas que cerrar y ninguna a la que mover el volumen.")
        print("Cerrar sin destino baja el volumen total. Decidelo tu, no lo hago yo.")

    if aplicar:
        if not doblar:
            sys.exit("\nno aplico nada: sin puerta de destino no se mueve volumen")
        for p in cerrar:
            for c in salida["puertas"][p]["campanas"]:
                cuerpo = json.dumps({"max_leads_per_day": 0})
                r = subprocess.run(
                    ["curl", "-s", "-X", "POST", *UA,
                     "-H", "Content-Type: application/json", "-d", cuerpo,
                     f"{API}/campaigns/{c['id']}/settings?api_key={key}"],
                    capture_output=True)
                print(f"  {c['nombre']}: tope a 0 -> {r.stdout.decode('utf-8','replace')[:80]}")
        print("\nLos topes de las puertas buenas los subo solo cuando me digas")
        print("cuanto, porque depende de los buzones limpios que haya ese dia.")

    if destino_json:
        with open(destino_json, "w") as f:
            json.dump(salida, f, ensure_ascii=False, indent=2)
        print(f"\nguardado en {destino_json}")

    return 1 if cerrar else 0


# Guardia: este fichero no debe aprender nunca a construir una llamada a
# secuencias. Mira la forma de la llamada, no la palabra, para no dispararse con
# su propia documentacion.
_fuente = open(__file__).read()
assert not re.search(r"campaigns/\{?[^\n\"]{0,40}/sequences", _fuente), \
    "este script no puede llamar a /sequences: un POST ahi reinicia los envios"

if __name__ == "__main__":
    sys.exit(main())
