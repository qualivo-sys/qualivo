#!/usr/bin/env python3
"""Encuentra respuestas a las que NO hemos contestado.

Por que existe: el 11-sep el triaje de las 108 respuestas acumuladas encontro 6
con interes real, y las 6 llevaban entre 28 y 35 dias sin contestar. Jelen
pregunto precio, Antonio paso sus dos webs, Carvajalinos pidio info y Victor
pidio una propuesta. Nadie contesto a tiempo y ninguna acabo en reunion. En
cambio Sergi Lopez contesto a las 9:17, se le atendio ese dia, y es la unica
reunion y el unico cierre que ha dado el correo frio.

El SDR de respuestas existe desde el 9-sep pero solo mira hacia delante: nadie
leia hacia atras. Esta comprobacion es la que faltaba, y es el equivalente de
atascados.py para el otro lado del hilo.

La senal es simple y no necesita clasificar nada: si el ULTIMO mensaje del hilo
es suyo, no hemos contestado. Da igual que fuera una pregunta de precio o un
"gracias": el hilo esta abierto de su lado.

Uso:
    python3 sin_contestar.py "$SMARTLEAD_KEY" [--horas 4] [--json salida.json]

Codigo de salida 1 si hay algo sin contestar por encima del umbral.
"""
import datetime
import json
import subprocess
import sys

API = "https://server.smartlead.ai/api/v1"
UA = ["-H", "User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]

# Un hilo cuyo ultimo mensaje es suyo pero que solo dice esto no es una deuda:
# es una ausencia automatica. En el triaje del 11-sep eran 36 de 108, un tercio.
AUSENCIAS = ("fuera de la oficina", "out of office", "automatic reply",
             "respuesta automatica", "estare fuera", "estoy de vacaciones",
             "autoreply", "no estare disponible", "de baja por")


def get(url):
    r = subprocess.run(["curl", "-s", *UA, url], capture_output=True)
    try:
        return json.loads(r.stdout.decode("utf-8", "replace"))
    except Exception:
        return None


def ahora():
    return datetime.datetime.now(datetime.timezone.utc)


def cuando(s):
    """Las fechas de Smartlead vienen en varias formas. Sin fecha, None."""
    if not s:
        return None
    t = str(s).replace("Z", "+00:00")
    for intento in (t, t.split(".")[0] + "+00:00", t[:19] + "+00:00"):
        try:
            d = datetime.datetime.fromisoformat(intento)
            return d if d.tzinfo else d.replace(tzinfo=datetime.timezone.utc)
        except Exception:
            continue
    return None


def es_ausencia(texto):
    t = (texto or "").lower()
    return any(a in t for a in AUSENCIAS)


def historial(key, cid, lead_id):
    d = get(f"{API}/campaigns/{cid}/leads/{lead_id}/message-history"
            f"?api_key={key}") or {}
    return d.get("history") or d.get("data") or []


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    key = sys.argv[1]
    horas = 4
    if "--horas" in sys.argv:
        horas = int(sys.argv[sys.argv.index("--horas") + 1])
    destino = None
    if "--json" in sys.argv:
        destino = sys.argv[sys.argv.index("--json") + 1]

    camps = get(f"{API}/campaigns?api_key={key}") or []
    if not isinstance(camps, list):
        sys.exit("no he podido leer las campanas; revisa la clave")

    deudas, ausencias, al_dia, sin_fecha = [], 0, 0, 0

    for c in camps:
        cid, nombre = c.get("id"), c.get("name") or ""
        if not cid:
            continue

        # De donde salen los que han contestado.
        #
        # Esto estaba mal hasta el 9-oct-2026 y fallaba en silencio. El codigo
        # recorria /leads y se saltaba a todo el que no trajera "reply_time".
        # Comprobado hoy: /leads NO devuelve ese campo, ni en la fila ni dentro
        # del objeto "lead". Sus claves son campaign_lead_map_id, created_at,
        # lead, lead_category_id y status, y nada mas. Asi que la condicion se
        # cumplia SIEMPRE y el bucle descartaba el 100% de los leads.
        #
        # Resultado: el script imprimia "sin contestar: 0" sin haber mirado un
        # solo hilo, y lo hacia con cara de haber trabajado. Es el mismo fallo
        # que dejo la BAJA de Clara Onraita 24 horas en el aire: una respuesta
        # negativa que viene de no haber mirado, no de no haber nada.
        #
        # Lo que si trae reply_time es /statistics, con lead_email. Se saca de
        # ahi la lista de correos que han contestado y luego se cruza contra
        # /leads para resolver el id, que es justo lo que ya hacian nuevas.py y
        # lee_nuevas.py por la misma razon.
        quien_contesto = set()
        off = 0
        while off <= 20000:
            st = get(f"{API}/campaigns/{cid}/statistics"
                     f"?api_key={key}&offset={off}&limit=1000") or {}
            filas = st.get("data") or []
            if not filas:
                break
            for f in filas:
                if f.get("reply_time") and f.get("lead_email"):
                    quien_contesto.add(str(f["lead_email"]).lower())
            off += 1000
        if not quien_contesto:
            continue

        off = 0
        while off <= 5000:
            p = get(f"{API}/campaigns/{cid}/leads"
                    f"?api_key={key}&offset={off}&limit=100") or {}
            ds = p.get("data") or []
            if not ds:
                break
            for fila in ds:
                lead = fila.get("lead") or fila
                lid = lead.get("id") or fila.get("lead_id")
                if str(lead.get("email") or "").lower() not in quien_contesto:
                    continue
                if not lid:
                    continue
                hist = historial(key, cid, lid)
                if not hist:
                    continue
                ultimo = hist[-1]
                tipo = str(ultimo.get("type") or ultimo.get("email_type") or "").upper()
                # SENT / sent = nuestro. REPLY / received = suyo.
                suyo = ("REPLY" in tipo or "RECEIV" in tipo
                        or ultimo.get("from") == lead.get("email"))
                if not suyo:
                    al_dia += 1
                    continue
                cuerpo = ultimo.get("email_body") or ultimo.get("body") or ""
                asunto = ultimo.get("subject") or ""
                if es_ausencia(asunto + " " + cuerpo):
                    ausencias += 1
                    continue
                t = cuando(ultimo.get("time") or ultimo.get("sent_time")
                           or ultimo.get("created_at"))
                if not t:
                    sin_fecha += 1
                    continue
                esperando = (ahora() - t).total_seconds() / 3600.0
                if esperando < horas:
                    al_dia += 1
                    continue
                deudas.append({
                    "campana": nombre, "campana_id": cid, "lead_id": lid,
                    "quien": lead.get("email"),
                    "nombre": (lead.get("first_name") or "").strip(),
                    "horas_esperando": round(esperando, 1),
                    "dias_esperando": round(esperando / 24.0, 1),
                    "ultimo_asunto": asunto[:120],
                    "lo_que_dijo": " ".join(str(cuerpo).split())[:300],
                })
            off += 100

    deudas.sort(key=lambda d: -d["horas_esperando"])

    print(f"sin contestar: {len(deudas)}   al dia: {al_dia}   "
          f"ausencias automaticas: {ausencias}   sin fecha: {sin_fecha}")
    print(f"umbral: {horas} h\n")
    for d in deudas:
        print(f"  {d['dias_esperando']:>5} dias  {d['quien']:38} {d['campana'][:28]}")
        if d["lo_que_dijo"]:
            print(f"              dijo: {d['lo_que_dijo'][:140]}")

    if sin_fecha:
        print(f"\n{sin_fecha} hilos sin fecha legible en el ultimo mensaje: no los")
        print("cuento como deuda ni como al dia. Si el numero crece, hay que")
        print("mirar que forma trae ese campo, no estimarla.")

    if destino:
        with open(destino, "w") as f:
            json.dump({"umbral_horas": horas, "sin_contestar": deudas,
                       "al_dia": al_dia, "ausencias": ausencias,
                       "sin_fecha": sin_fecha}, f, ensure_ascii=False, indent=2)
        print(f"\nguardado en {destino}")

    return 1 if deudas else 0


if __name__ == "__main__":
    sys.exit(main())
