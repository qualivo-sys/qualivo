# -*- coding: utf-8 -*-
# Aviso a Marc cuando una empresa acumula clics.
#
# Lo pidio Marc en la reunion del 27-oct, y con un criterio muy concreto que
# conviene no perder: no es lo mismo tres clics en la misma hora que uno ayer,
# uno esta manana y otro esta tarde. Sus palabras: "eso quiere decir que este
# tio tiene un problema, nuestro email ha despertado su problema y quiere
# indagar mas, pero no ha tenido tiempo". El umbral es 3, y vuelve a avisar en
# el 4 y en el 5 ("si hace cuatro tambien, si hace cinco tambien").
#
# LO QUE LA API NO DA, Y HAY QUE DECIRLO: Smartlead devuelve el numero de clics
# y SOLO la fecha del ultimo, y por correo enviado, no por clic. Asi que la
# "fecha del primer, segundo y tercer clic" no se puede sacar del historico: no
# existe en ningun sitio. La unica forma es mirar el contador cada hora y
# apuntar el momento en que sube, que es lo que hace este script. Por eso:
#   - De los clics YA ocurridos tenemos la fecha del ultimo de cada correo.
#   - De los clics futuros tenemos la hora en que los detectamos, con +-1 hora.
# No se puede recuperar el pasado. Marc tiene que saberlo.
#
# EL ESTADO SE GUARDA EN EL REPOSITORIO, no en el scratchpad. El 19-oct se
# reciclo el contenedor y se perdio todo lo que habia en el scratchpad, incluida
# una clave. Un contador que se pierde deja de ser un contador, asi que
# clics-estado.json va versionado y se commitea.
#
# ESTE SCRIPT NO ENVIA NADA. Deja el aviso escrito y listo. Lo manda Maikel,
# que es la regla mientras dure el piloto.
#
# Uso:
#   python3 avisa_clics.py                  # mira, actualiza el estado, escribe avisos
#   python3 avisa_clics.py --umbral 3       # umbral distinto
#   python3 avisa_clics.py --marcar-avisado # apunta que los avisos ya se mandaron
import argparse, csv, json, os, re, sys, time, urllib.request
from datetime import datetime, timezone

S = os.path.dirname(os.path.abspath(__file__))
KUBY = os.path.dirname(S)
DATOS = os.path.join(KUBY, "datos")
ESTADO = os.path.join(KUBY, "clics-estado.json")

B = "https://server.smartlead.ai/api/v1"
# La del piloto de octubre. La de noviembre se pasa con --campana cuando exista.
CAMPANAS = [4071068]
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


def paginado(campana, ruta, k):
    """Todas las paginas de un endpoint que devuelve {'data': [...]}."""
    fuera, off = [], 0
    while True:
        d = get(f"{B}/campaigns/{campana}/{ruta}?api_key={k}&offset={off}&limit=100")
        lote = (d or {}).get("data") or []
        fuera += lote
        if len(lote) < 100:
            return fuera
        off += 100


def cuerpos(campana, k):
    """Texto de cada paso de la secuencia, para poner en el aviso el mensaje
    que se envio. Es la plantilla, con las variables sin sustituir."""
    d = get(f"{B}/campaigns/{campana}/sequences?api_key={k}") or []
    fuera = {}
    for s in d if isinstance(d, list) else []:
        v = (s.get("sequence_variants") or [{}])[0] or {}
        fuera[s.get("seq_number")] = texto_plano(v.get("email_body") or s.get("email_body"))
    return fuera


def texto_plano(html):
    """El cuerpo del correo sin etiquetas, para que Marc lo lea de un vistazo."""
    t = re.sub(r"(?is)<br\s*/?>|</p>", "\n", html or "")
    t = re.sub(r"(?s)<[^>]+>", "", t)
    t = re.sub(r"&nbsp;", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def carga_estado():
    if os.path.exists(ESTADO):
        return json.load(open(ESTADO))
    return {"version": 1, "creado": datetime.now(timezone.utc).isoformat(),
            "correos": {}, "avisados": {}}


def guarda_estado(e):
    """Fichero temporal y rename, para no dejar medio JSON si nos cortan."""
    tmp = ESTADO + ".tmp"
    with open(tmp, "w") as f:
        json.dump(e, f, ensure_ascii=False, indent=1, sort_keys=True)
    os.replace(tmp, ESTADO)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--umbral", type=int, default=3)
    ap.add_argument("--marcar-avisado", action="store_true")
    ap.add_argument("--campana", type=int, action="append",
                    help="id de campana de Smartlead; se puede repetir")
    a = ap.parse_args()
    campanas = a.campana or CAMPANAS

    k = clave()
    ahora = datetime.now(timezone.utc).isoformat(timespec="seconds")
    est = carga_estado()
    primera_vez = not est["correos"]

    # Los leads, para el nombre de la empresa y el telefono. Se indexa por
    # correo porque /statistics devuelve lead_id a null.
    leads, textos, filas = {}, {}, []
    for cp in campanas:
        for it in paginado(cp, "leads", k):
            l = it.get("lead") or it
            e = (l.get("email") or "").lower()
            if e:
                leads[e] = {"empresa": l.get("company_name") or "",
                            "tel": l.get("phone_number") or "",
                            "web": l.get("website") or "",
                            **(l.get("custom_fields") or {})}
        textos[cp] = cuerpos(cp, k)
        filas += [dict(r, campana=cp) for r in paginado(cp, "statistics", k)]

    nuevos_por_lead = {}          # correo -> cuantos clics nuevos hemos visto
    for r in filas:
        sid = r.get("stats_id")
        if not sid:
            continue
        correo = (r.get("lead_email") or "").lower()
        n = int(r.get("click_count") or 0)
        prev = est["correos"].get(sid)

        if prev is None:
            # Primera vez que vemos este envio. Los clics que ya trae son
            # historicos: la unica fecha que hay es la del ultimo, asi que se
            # apunta como tal y se marca de donde viene.
            est["correos"][sid] = {
                "lead": correo, "paso": r.get("sequence_number"),
                "campana": r["campana"],
                "asunto": r.get("email_subject") or "",
                "enviado": r.get("sent_time"),
                "clics": n,
                "fechas": ([{"cuando": r.get("click_time"), "origen": "historico"}]
                           if n else []),
            }
            if n and not primera_vez:
                nuevos_por_lead[correo] = nuevos_por_lead.get(correo, 0) + n
        elif n > prev["clics"]:
            # El contador ha subido: son clics de ahora. Apuntamos el momento
            # en que los hemos detectado, que es lo mas preciso que existe.
            for _ in range(n - prev["clics"]):
                prev["fechas"].append({"cuando": ahora, "origen": "detectado"})
            prev["clics"] = n
            nuevos_por_lead[correo] = nuevos_por_lead.get(correo, 0) + 1

    # Clics totales por empresa, sumando los tres correos de la secuencia.
    total, fechas_lead, detalle = {}, {}, {}
    for sid, c in est["correos"].items():
        e = c["lead"]
        total[e] = total.get(e, 0) + c["clics"]
        fechas_lead.setdefault(e, []).extend(c["fechas"])
        if c["clics"]:
            detalle.setdefault(e, []).append(c)

    # Avisa al llegar al umbral, y otra vez con cada clic nuevo por encima.
    # Con 1 o 2 clics no hay aviso: van a la lista de revision manual.
    avisos, revisar = [], []
    for e, n in total.items():
        if n == 0:
            continue
        i = leads.get(e, {})
        fechas = sorted(f["cuando"] for f in fechas_lead.get(e, []) if f["cuando"])
        envios = sorted(c["enviado"] for c in est["correos"].values()
                        if c["lead"] == e and c.get("enviado"))
        fila = {
            "empresa": i.get("empresa", ""), "email": e,
            "telefono": i.get("tel", ""), "ciudad": i.get("ciudad", ""),
            "clics": n,
            "fecha_envio": envios[0] if envios else "",
            "clic_1": fechas[0] if len(fechas) > 0 else "",
            "clic_2": fechas[1] if len(fechas) > 1 else "",
            "clic_3": fechas[2] if len(fechas) > 2 else "",
            "primer_clic": fechas[0] if fechas else "",
            "ultimo_clic": fechas[-1] if fechas else "",
            "fechas_clics": " · ".join(fechas),
            "correos": detalle.get(e, []),
        }
        if n < a.umbral:
            revisar.append(fila)
            continue
        ya = est["avisados"].get(e, 0)
        if n <= ya:
            continue                      # ya avisado con este numero de clics
        fila["clics_nuevos"] = n - ya
        avisos.append(fila)
        if a.marcar_avisado:
            est["avisados"][e] = n

    guarda_estado(est)
    os.makedirs(DATOS, exist_ok=True)

    if primera_vez:
        print("PRIMERA EJECUCION: se ha guardado la foto de partida.\n"
              "Los clics que ya existian quedan con la fecha del ultimo de cada\n"
              "correo, marcada como 'historico'. A partir de ahora, cada clic\n"
              "nuevo queda con la hora en que se detecta.\n")

    cols = ["clics", "clics_nuevos", "empresa", "ciudad", "telefono", "email",
            "fecha_envio", "clic_1", "clic_2", "clic_3", "ultimo_clic", "fechas_clics"]
    destino = os.path.join(DATOS, "avisos_clics.csv")
    with open(destino, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for v in sorted(avisos, key=lambda x: -x["clics"]):
            w.writerow({c: v.get(c, "") for c in cols})
    destino_rev = os.path.join(DATOS, "revisar_1_2_clics.csv")
    with open(destino_rev, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for v in sorted(revisar, key=lambda x: -x["clics"]):
            w.writerow({c: v.get(c, "") for c in cols})

    # Un fichero de texto por aviso, con el correo a Marc ya escrito. Es lo que
    # se manda tal cual cuando el envio este encendido (diseno-alerta-clics.md).
    dir_avisos = os.path.join(DATOS, "avisos")
    os.makedirs(dir_avisos, exist_ok=True)
    print(f"empresas con {a.umbral}+ clics y aviso pendiente: {len(avisos)}")
    print(f"empresas con 1 o 2 clics para revisar a mano: {len(revisar)}")
    for v in sorted(avisos, key=lambda x: -x["clics"]):
        lineas = [
            f"ASUNTO: Lead caliente: {v['empresa'] or v['email']} ha hecho {v['clics']} clics",
            "",
            f"Empresa:          {v['empresa']}",
            f"Ciudad:           {v['ciudad']}",
            f"Teléfono:         {v['telefono']}",
            f"Email:            {v['email']}",
            f"Número de clics:  {v['clics']}  (nuevos desde el último aviso: {v['clics_nuevos']})",
            f"Fecha de envío:   {v['fecha_envio']}",
            f"Primer clic:      {v['clic_1'] or 'sin fecha'}",
            f"Segundo clic:     {v['clic_2'] or 'sin fecha'}",
            f"Tercer clic:      {v['clic_3'] or 'sin fecha'}",
            f"Todos los clics:  {v['fechas_clics'] or 'sin fecha'}",
            "",
            "Las fechas marcadas como histórico son la del último clic de ese correo;",
            "las detectadas tienen una precisión de una hora.",
        ]
        for c in v["correos"]:
            lineas += ["", f"--- Mensaje enviado: correo {c['paso']} · enviado {c['enviado']} · "
                           f"{c['clics']} clics ---", f"Asunto: {c['asunto']}",
                       textos.get(c.get("campana", campanas[0]), {}).get(c["paso"], "")]
        texto = "\n".join(lineas)
        print("\n" + "=" * 68 + "\n" + texto)
        nombre = re.sub(r"[^a-z0-9]+", "-", v["email"].lower()) + ".txt"
        with open(os.path.join(dir_avisos, nombre), "w", encoding="utf-8") as f:
            f.write(texto + "\n")
    print(f"\n-> {destino}")
    print(f"-> {destino_rev}")
    print(f"-> estado en {ESTADO}")
    if avisos and not a.marcar_avisado:
        print("\nEn seco: no se ha marcado como avisado y no se ha enviado nada.")
        print("Los avisos los manda Maikel. Con --marcar-avisado se apunta que salieron.")
