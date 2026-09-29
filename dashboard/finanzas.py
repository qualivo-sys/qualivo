#!/usr/bin/env python3
"""Construye la pestaña `FINANZAS · panel` del Sheet financiero.

Es el contrato de datos del panel de Finanzas de Qualivo Intelligence
(/intelligence/?sector=qualivo&modo=real). Una sola pestaña, plana y legible
por máquina, que colapsa las 25 pestañas del Sheet en los seis bloques que
Maikel pidió el 29-sep: gastos, deudas, MRR, cobros, pagos y préstamo.

Columnas fijas: bloque | concepto | importe | estado | nota

Reglas aprendidas a base de romperlo:
  · Se escribe SIEMPRE con valueInputOption=RAW. Con USER_ENTERED y la
    configuración regional española, "19.01" se interpreta como una fecha.
  · Se lee SIEMPRE con valueRenderOption=UNFORMATTED_VALUE. Sin eso los
    números vuelven como texto y las sumas dejan de contar.

Uso:  python3 dashboard/finanzas.py
"""
import json, time, urllib.request, urllib.parse

CRED  = "/root/.claude/uploads/9036eb51-d77c-5ec5-9939-d4419e0760a9/7db8a765-kineticdream377917c17cfe8d7008.json"
SHEET = "1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0"
BASE  = "https://sheets.googleapis.com/v4/spreadsheets/"
TAB   = "FINANZAS · panel"


def token():
    import jwt  # PyJWT
    c = json.load(open(CRED))
    now = int(time.time())
    a = jwt.encode({"iss": c["client_email"], "scope": "https://www.googleapis.com/auth/spreadsheets",
                    "aud": "https://oauth2.googleapis.com/token", "iat": now, "exp": now + 3600},
                   c["private_key"], algorithm="RS256")
    d = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                "assertion": a}).encode()
    r = urllib.request.Request("https://oauth2.googleapis.com/token", data=d)
    return json.load(urllib.request.urlopen(r, timeout=30))["access_token"]


def api(method, path, tok, payload=None):
    r = urllib.request.Request(BASE + path, method=method,
                               headers={"Authorization": "Bearer " + tok,
                                        "Content-Type": "application/json"},
                               data=json.dumps(payload).encode() if payload else None)
    b = urllib.request.urlopen(r, timeout=60).read()
    return json.loads(b) if b.strip() else {}


def leer(tok, tab, rango="A1:H60"):
    p = SHEET + "/values/" + urllib.parse.quote(tab) + "!" + rango + "?valueRenderOption=UNFORMATTED_VALUE"
    return api("GET", p, tok).get("values", [])


def num(v):
    """Un importe, o None si la celda está vacía o rota (#ERROR!, #NAME?)."""
    if isinstance(v, (int, float)):
        return float(v)
    return None


def recoger(tok):
    """Lee las pestañas de origen y devuelve las filas del panel."""
    filas = []
    def add(bloque, concepto, importe, estado="", nota=""):
        filas.append([bloque, concepto, importe if importe is not None else "", estado, nota])

    # --- CAJA: Situación actual, bloque banco ---
    # OJO: en «Situación actual» y «Gastos mensuales» las etiquetas van en la
    # columna B y los importes en la C. La columna A está vacía.
    sit = leer(tok, "Situación actual", "A1:G45")
    for r in sit:
        c = str(r[1] if len(r) > 1 else "").strip()
        v = num(r[2]) if len(r) > 2 else None
        if v is None or not c:
            continue
        if c.startswith(("Cuenta", "🐷")):
            add("CAJA", c, v, "disponible" if c.startswith("Cuenta") else "reservado")
        elif c.startswith("TOTAL EN BANCO"):
            add("CAJA", "TOTAL en banco", v, "total")

    # --- COBROS pendientes ---
    dentro = False
    for r in sit:
        c = str(r[1] if len(r) > 1 else "").strip()
        if c.startswith("📥"):
            dentro = True; continue
        if dentro:
            if c.startswith(("TOTAL", "Firme", "⚠️", "💰")):
                dentro = False; continue
            v = num(r[2]) if len(r) > 2 else None
            est = str(r[3]).strip() if len(r) > 3 else ""
            if v is not None and c:
                add("COBROS", c, v, est)

    # --- GASTOS fijos mensuales ---
    for r in leer(tok, "Gastos mensuales", "A1:G60"):
        c = str(r[1] if len(r) > 1 else "").strip()
        v = num(r[2]) if len(r) > 2 else None
        if v is None or not c or c.startswith(("Subtotal", "SUBTOTAL", "→")):
            continue
        if c.startswith(("💳", "🔴")):
            add("PAGOS", c.lstrip("💳🔴 "), v, "total")
        else:
            add("GASTOS", c, v)

    # --- DEUDAS: Plan liquidación ---
    for r in leer(tok, "Plan liquidación", "A1:G40"):
        c = str(r[1] if len(r) > 1 else "").strip()
        saldo = num(r[2]) if len(r) > 2 else None
        cuota = num(r[3]) if len(r) > 3 else None
        vence = str(r[4]).strip() if len(r) > 4 else ""
        if not c or c.startswith(("Deuda", "🎯")):
            continue
        est = "TOTAL" if c.startswith("TOTAL") else ("cuota " + f"{cuota:.0f} €/mes" if cuota else "sin cuota")
        add("DEUDAS", c, saldo, est, vence[:60])
        if cuota and not c.startswith("TOTAL"):
            add("PAGOS", c, cuota, "cuota de deuda")

    # --- PRÉSTAMO: escenarios ---
    for r in leer(tok, "Escenarios préstamo", "A1:H20"):
        imp = num(r[0]) if r else None
        if imp is None or imp < 1000:
            continue
        cuota = num(r[1]); interes = num(r[5]); colchon = num(r[6])
        ver = str(r[7]).strip() if len(r) > 7 else ""
        add("PRESTAMO", f"{imp:,.0f} €".replace(",", "."), cuota, ver[:70],
            f"interés total {interes:,.0f} € · colchón {colchon:,.0f} €".replace(",", ".") if interes is not None else "")

    # --- MRR: clientes recurrentes (se mantiene a mano, es una decisión no un dato) ---
    for nombre, importe, estado in [
        ("Equipzilla (nómina)", 2040, "activo · sube a 2.850 en octubre"),
        ("Escola Aeronàutica (EAC)", 800, "activo · subida a 1.200 pendiente de enviar"),
        ("Eleva Academy", 500, "activo · confirmar si sigue facturando"),
        ("Kubysoft", 500, "piloto · suelo, decide el 13-oct"),
        ("Antic Barcelona", 0, "sin facturación viva"),
        ("Don't Kill Rumble", 0, "sin decisión de continuidad"),
    ]:
        add("MRR", nombre, importe, estado)
    add("MRR", "TOTAL recurrente", 3840, "total", "objetivo: 10.000 €/mes")
    return filas


def main():
    tok = token()
    meta = api("GET", SHEET + "?fields=sheets.properties(title,sheetId)", tok)
    hojas = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
    if TAB not in hojas:
        api("POST", SHEET + ":batchUpdate", tok,
            {"requests": [{"addSheet": {"properties": {"title": TAB}}}]})

    filas = recoger(tok)
    cab = [["bloque", "concepto", "importe", "estado", "nota"]]
    sello = [["", f"Generado por dashboard/finanzas.py · {time.strftime('%Y-%m-%d %H:%M')}", "", "", ""]]
    api("POST", SHEET + "/values/" + urllib.parse.quote(TAB) + "!A1:E600:clear", tok, {})
    api("PUT", SHEET + "/values/" + urllib.parse.quote(TAB) +
        f"!A1?valueInputOption=RAW", tok, {"values": cab + filas + sello})

    from collections import Counter
    for b, n in Counter(f[0] for f in filas).most_common():
        print(f"  {b:<10} {n:>3} filas")
    print(f"\n{len(filas)} filas en «{TAB}»")


if __name__ == "__main__":
    main()
