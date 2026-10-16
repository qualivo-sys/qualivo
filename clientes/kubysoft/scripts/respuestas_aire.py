# -*- coding: utf-8 -*-
# Filtro de ruido del piloto de Kubysoft.
#
# El problema que resuelve, y es de ellos, no nuestro: Marc ha cableado
# hola@kubysoft.es para que TODO lo que entre cree un lead en su CRM. En frio la
# mayoria de lo que entra no es una respuesta, son rebotes, fuera de oficina,
# respuestas automaticas y bajas. Sin filtro, su CRM se llena de "Mail delivery
# failed" y de gente de vacaciones, y eso hunde la confianza en el piloto antes
# de que haya una sola reunion.
#
# OJO, LA MITAD DE ESTO NO LA ARREGLA ESTE SCRIPT: el volcado al CRM es una
# regla en el lado de Marc. Lo que hace este script es decidir que merece
# llegarle como lead. Para que no le lleguen las dos cosas, Marc tiene que
# apagar el volcado automatico de hola@ y quedarse solo con lo que le pasemos
# nosotros. Esta pedido.
#
# Lo que si hace, y se hace solo:
#   - Clasifica con el mismo criterio que Qualivo (captacion/scripts/
#     clasifica_respuestas.py). Un clasificador, dos clientes.
#   - Las bajas y el RGPD se ejecutan AL MOMENTO y sin preguntar, y se cuentan
#     despues. Es regla, no criterio.
#   - Deja un CSV con lo que de verdad merece ir a Marc.
#
# Uso: python3 respuestas_aire.py [--ejecutar-bajas]
#      Sin el flag no bloquea nada, solo dice que bloquearia.
import csv, json, os, sys, time, urllib.error, urllib.request

S = os.path.dirname(os.path.abspath(__file__))
KUBY = os.path.dirname(S)
DATOS = os.path.join(KUBY, "datos")
COMPARTIDO = os.path.join(os.path.dirname(os.path.dirname(KUBY)),
                          "captacion", "scripts")
sys.path.insert(0, COMPARTIDO)
from clasifica_respuestas import puntuar          # noqa: E402

B = "https://server.smartlead.ai/api/v1"
CLIENT_ID = 596297          # el cliente de Kubysoft en Smartlead

# Smartlead detras de Cloudflare: SIN User-Agent de navegador responde 403.
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}


def clave():
    t = os.environ.get("SMARTLEAD_KEY", "").strip()
    if t:
        return t
    p = os.environ.get("SMARTLEAD_KEY_FILE", "")
    if p and os.path.exists(p):
        return open(p).read().strip()
    sys.exit("Falta la clave de Smartlead. Exporta SMARTLEAD_KEY o "
             "SMARTLEAD_KEY_FILE apuntando al fichero del scratchpad.")


def get(url, intentos=3):
    for i in range(intentos):
        try:
            with urllib.request.urlopen(
                    urllib.request.Request(url, headers=UA), timeout=90) as f:
                return json.loads(f.read().decode())
        except Exception as e:
            if i == intentos - 1:
                print(f"  [FALLO] {url.split('?')[0]}: {e}")
                return None
            time.sleep(2)


def post(url, cuerpo):
    req = urllib.request.Request(
        url, data=json.dumps(cuerpo).encode(),
        headers={**UA, "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=90) as f:
            return json.loads(f.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode()[:200]}


def campanas_del_cliente(k):
    todas = get(f"{B}/campaigns?api_key={k}") or []
    return [c for c in todas if c.get("client_id") == CLIENT_ID]


def leads(k, cid):
    """Todos los leads de la campana, indexados por correo.

    Se indexa por correo a proposito: /statistics devuelve lead_id a null, asi
    que cruzar por id no vale y hay que cruzar por correo contra /leads.
    """
    fuera, off = {}, 0
    while True:
        d = get(f"{B}/campaigns/{cid}/leads?api_key={k}&offset={off}&limit=100")
        lote = (d or {}).get("data") or []
        for it in lote:
            l = it.get("lead") or it
            e = (l.get("email") or "").lower()
            if e:
                fuera[e] = {"id": l.get("id"), "empresa": l.get("company_name"),
                            "nombre": l.get("first_name"), "email": e,
                            "estado": it.get("status")}
        if len(lote) < 100:
            return fuera
        off += 100


def respuestas(k, cid, lead_id):
    """Los mensajes de un hilo. Devuelve solo lo que escribio la persona."""
    d = get(f"{B}/campaigns/{cid}/leads/{lead_id}/message-history?api_key={k}")
    hist = (d or {}).get("history") or []
    return [m for m in hist if (m.get("type") or "").upper() == "REPLY"]


def texto(m):
    return (m.get("email_body") or m.get("subject") or "")[:4000]


if __name__ == "__main__":
    k = clave()
    ejecutar = "--ejecutar-bajas" in sys.argv
    camp = campanas_del_cliente(k)
    print(f"campanas de Kubysoft (client_id {CLIENT_ID}): {len(camp)}")
    if not camp:
        print("Ninguna todavia. El script queda listo para el dia 1 del piloto.")
        sys.exit(0)

    a_marc, reintentar, bajas, rebotes = [], [], [], []
    for c in camp:
        cid = c["id"]
        idx = leads(k, cid)
        print(f"  {c.get('name')}: {len(idx)} leads")
        for email, l in idx.items():
            # Los rebotes no son respuestas: los marca Smartlead y no llevan
            # texto que clasificar. Se apartan por bandera, no por regex.
            if (l.get("estado") or "").upper() in ("BOUNCED", "BLOCKED"):
                rebotes.append({**l, "campana": c.get("name")})
                continue
            if not l.get("id"):
                continue
            for m in respuestas(k, cid, l["id"]):
                t = texto(m)
                score, accion = puntuar(t, "")
                fila = {**l, "campana": c.get("name"), "score": score,
                        "accion": accion, "texto": t.replace("\n", " ")[:300]}
                if score == 0 and "no ser contactado" in accion:
                    bajas.append(fila)
                elif score == 0:
                    reintentar.append(fila)      # no interesado: no va a Marc
                elif score == 20:
                    reintentar.append(fila)
                else:
                    a_marc.append(fila)

    # Las bajas y el RGPD se ejecutan siempre y sin preguntar. Se cuentan despues.
    if bajas:
        print(f"\nbajas y RGPD: {len(bajas)}")
        for b in bajas:
            if ejecutar:
                r = post(f"{B}/leads/add-domain-block-list?api_key={k}",
                         {"domain_block_list": [b["email"]],
                          "client_id": CLIENT_ID})
                print(f"  bloqueado {b['email']} {r.get('error','')}")
            else:
                print(f"  (en seco) bloquearia {b['email']}")

    os.makedirs(DATOS, exist_ok=True)
    cols = ["score", "accion", "empresa", "nombre", "email", "campana", "texto"]
    destino = os.path.join(DATOS, "respuestas_para_marc.csv")
    with open(destino, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(cols)
        for r in sorted(a_marc, key=lambda x: -x["score"]):
            w.writerow([r.get(c, "") for c in cols])

    print(f"\n{'a Marc':12} {len(a_marc):4}  respuestas de verdad")
    print(f"{'ruido':12} {len(reintentar):4}  automaticos, fuera de oficina y noes")
    print(f"{'rebotes':12} {len(rebotes):4}  no llegan a nadie")
    print(f"{'bajas':12} {len(bajas):4}  {'ejecutadas' if ejecutar else 'en seco'}")
    print(f"-> {destino}")
