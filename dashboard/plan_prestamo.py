#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construye la pestaña «PRÉSTAMO · plan 12 meses» de un Google Sheet.

Qué es: el destino de un préstamo, mes a mes y línea a línea, con tres bolsillos
separados y la regla que los separa.

  · CAJA OPERATIVA: donde entran los cobros y salen los gastos.
  · HUCHA: el colchón. Solo sale si la operativa cierra por debajo del umbral,
    y solo lo justo para volver al objetivo. Cada salida queda en su columna.
  · DEPÓSITO: bloqueado a plazo. No aparece en el flujo mensual a propósito.

Por qué línea a línea y no agregados: un «software, 599 €» no se puede discutir;
una herramienta con su nombre y sus 62 € sí. Cada celda del mes es un número
editable, así que quitar una línea o cambiar un importe recalcula el plan entero
sin tocar el código.

Las cifras NO están en este fichero. Este repositorio es público: los importes,
los nombres de clientes y los saldos de deuda viven en datos_plan.json, que está
en .gitignore. datos_plan.example.json es la plantilla con la forma que espera.

Variables de entorno:
  GOOGLE_SA_JSON   ruta al JSON de la cuenta de servicio de Google
  PLAN_SHEET_ID    id del documento de Google Sheets
  PLAN_DATOS       ruta a las cifras (por defecto dashboard/datos_plan.json)

Uso:  python3 dashboard/plan_prestamo.py
"""
import json, os, pathlib, sys, time, urllib.error, urllib.parse, urllib.request

AQUI   = pathlib.Path(__file__).resolve().parent
DATOS  = pathlib.Path(os.environ.get("PLAN_DATOS", AQUI / "datos_plan.json"))
CRED   = os.environ.get("GOOGLE_SA_JSON", "")
SHEET  = os.environ.get("PLAN_SHEET_ID", "")
BASE   = "https://sheets.googleapis.com/v4/spreadsheets/"
TITULO = "PRÉSTAMO · plan 12 meses"

MESES = ['oct-26', 'nov-26', 'dic-26', 'ene-27', 'feb-27', 'mar-27',
         'abr-27', 'may-27', 'jun-27', 'jul-27', 'ago-27', 'sep-27']
N     = len(MESES)
COLS  = [chr(66 + i) for i in range(N)]      # B..M, un mes por columna


def cargar(ruta):
    """Lee las cifras. Sin el fichero el script no arranca, a propósito: así no
    hay forma de que unos importes de ejemplo acaben pareciendo los de nadie."""
    if not ruta.exists():
        sys.exit(f"Falta {ruta}.\n"
                 f"Copia {AQUI / 'datos_plan.example.json'} a datos_plan.json y "
                 f"pon tus cifras, o apunta PLAN_DATOS a otro fichero.")
    d = json.loads(ruta.read_text())
    if len(d["reparto"]["lineas"]) != 4:
        sys.exit("reparto.lineas debe tener 4 entradas: préstamo, lo que se "
                 "liquida, el depósito y la caja de arranque.")
    if len(d["palancas"]) != 7:
        sys.exit("palancas debe tener 7 entradas, en este orden: altas/mes, alta "
                 "única, cuota del cliente nuevo, vida media, umbral de la hucha, "
                 "objetivo al reponer, % de IRPF.")
    return d


D        = cargar(DATOS)
REPARTO  = D["reparto"]
PALANCAS = D["palancas"]                     # [etiqueta, valor, formato, nota] ×7
INGRESOS = [tuple(x) for x in D["ingresos"]]  # (nombre, importe, meses|None, proc, nota)
SOFTWARE = [tuple(x) for x in D["software"]]  # (nombre, importe, proc, nota)
QUALIVO  = [tuple(x) for x in D["qualivo"]]
PERSONAL = [tuple(x) for x in D["personal"]]
DEUDA    = [tuple(x) for x in D["deuda"]]     # (nombre, cuota, último mes, saldo, nota)
IVA_TRIM = {int(k): v for k, v in D["iva_trimestral"].items()}
PUERTAS  = [tuple(x) for x in D["puertas"]]   # (nombre, cuándo, qué, si bien, si mal)
NO_HACER = [tuple(x) for x in D["no_se_hace"]]  # (qué, por qué)

# ------------------------------------------------------------- filas -------
R_REP  = 5                                   # el reparto del día 1: 5..11
R_PAL  = 15                                  # palancas: 15..22
R_MES  = 26                                  # fila con los nombres de los meses
R_ING  = 28                                  # ingresos, uno por línea
R_CNT  = R_ING + len(INGRESOS)                # nº de clientes nuevos vivos
R_CNA  = R_CNT + 1                            # clientes nuevos · altas
R_CNC  = R_CNA + 1                            # clientes nuevos · cuota
R_INGT = R_CNC + 1                            # TOTAL QUE ENTRA
R_SW   = R_INGT + 3                           # software, línea a línea
R_SWT  = R_SW + len(SOFTWARE)                 # subtotal de software
R_QV   = R_SWT + 1                            # resto del gasto del negocio
R_QVT  = R_QV + len(QUALIVO)                  # TOTAL NEGOCIO
R_PER  = R_QVT + 3                            # gasto personal, línea a línea
R_PERT = R_PER + len(PERSONAL)                # TOTAL PERSONAL
R_DEU  = R_PERT + 3                           # deuda, cuota a cuota
R_DEUT = R_DEU + len(DEUDA)                   # TOTAL DEUDA
R_IMP  = R_DEUT + 3                           # IVA y IRPF
R_IMPT = R_IMP + 2                            # TOTAL IMPUESTOS
R_RES  = R_IMPT + 3                           # resumen y los tres bolsillos: +0..+12
R_GATE = R_RES + 15                           # puertas de decisión
R_NO   = R_GATE + len(PUERTAS) + 2            # lo que no se hace
FILAS  = R_NO + len(NO_HACER) + 2


def token():
    import jwt
    if not CRED or not pathlib.Path(CRED).exists():
        sys.exit("GOOGLE_SA_JSON no apunta a un JSON de cuenta de servicio.")
    c = json.loads(pathlib.Path(CRED).read_text()); now = int(time.time())
    a = jwt.encode({"iss": c["client_email"],
                    "scope": "https://www.googleapis.com/auth/spreadsheets",
                    "aud": "https://oauth2.googleapis.com/token",
                    "iat": now, "exp": now + 3600},
                   c["private_key"], algorithm="RS256")
    d = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                "assertion": a}).encode()
    return json.load(urllib.request.urlopen(
        urllib.request.Request("https://oauth2.googleapis.com/token", data=d),
        timeout=30))["access_token"]


def api(method, path, tok, payload=None, intentos=6):
    """Reintenta con espera creciente: el límite es de 60 escrituras por minuto
    y una pestaña como esta se come varias peticiones grandes seguidas."""
    for i in range(intentos):
        try:
            r = urllib.request.Request(
                BASE + path, method=method,
                headers={"Authorization": "Bearer " + tok,
                         "Content-Type": "application/json"},
                data=json.dumps(payload).encode() if payload else None)
            b = urllib.request.urlopen(r, timeout=90).read()
            return json.loads(b) if b.strip() else {}
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 503) or i == intentos - 1:
                raise
            time.sleep(2 ** i * 3)


class Hoja:
    def __init__(self, tok, titulo, filas, cols=16):
        self.tok, self.t = tok, titulo
        meta = api("GET", SHEET + "?fields=sheets.properties(title,sheetId)", tok)
        h = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
        if titulo in h:
            api("POST", SHEET + ":batchUpdate", tok,
                {"requests": [{"deleteSheet": {"sheetId": h[titulo]}}]})
        r = api("POST", SHEET + ":batchUpdate", tok, {"requests": [{"addSheet": {
            "properties": {"title": titulo, "index": 1,
                           "gridProperties": {"rowCount": filas, "columnCount": cols}}}}]})
        self.gid = r["replies"][0]["addSheet"]["properties"]["sheetId"]

    def lote(self, bloques, modo):
        """Los valores van en RAW y las fórmulas en USER_ENTERED, en llamadas
        distintas: mezclarlos hace que Sheets reinterprete los números."""
        api("POST", SHEET + "/values:batchUpdate", self.tok, {
            "valueInputOption": modo,
            "data": [{"range": f"'{self.t}'!{r}", "values": v} for r, v in bloques]})

    def formato(self, peticiones):
        api("POST", SHEET + ":batchUpdate", self.tok, {"requests": peticiones})


def rango(gid, f1, f2, c1=0, c2=14):
    return {"sheetId": gid, "startRowIndex": f1 - 1, "endRowIndex": f2,
            "startColumnIndex": c1, "endColumnIndex": c2}


def eur(dec=0):
    return {"type": "NUMBER", "pattern": '#,##0.00 "€"' if dec else '#,##0 "€"'}


PATRON = {"eur": eur(), "num": {"type": "NUMBER", "pattern": "0,0"},
          "pct": {"type": "PERCENT", "pattern": "0 %"}}


def construir():
    tok = token()
    h = Hoja(tok, TITULO, FILAS)
    vals, forms = [], []

    # ---------------------------------------------------------- cabecera ---
    vals.append(("A1:N2", [
        ["PRÉSTAMO · PLAN 12 MESES · dónde va el dinero, línea a línea"] + [""] * 13,
        [D["subtitulo"]] + [""] * 13]))

    # ------------------------------------------- el reparto del día 1 ------
    filas = [["EL REPARTO DEL DÍA 1", "€", "", "por qué"] + [""] * 10]
    filas += [[n, v, "", nt] + [""] * 10 for n, v, nt in REPARTO["lineas"]]
    filas += [["= A LA HUCHA", "", "", REPARTO["hucha_nota"]] + [""] * 10,
              ["Caja en el banco antes del préstamo", REPARTO["caja_previa"][0], "",
               REPARTO["caja_previa"][1]] + [""] * 10,
              ["= CAJA OPERATIVA EL DÍA 1", "", "", REPARTO["caja_nota"]] + [""] * 10]
    vals.append((f"A4:N{R_REP + 6}", filas))
    # la hucha es el resto: préstamo menos lo que se liquida, el depósito y el arranque
    forms.append((f"B{R_REP + 4}",
                  [[f"=B{R_REP}-B{R_REP+1}-B{R_REP+2}-B{R_REP+3}"]]))
    forms.append((f"B{R_REP + 6}", [[f"=B{R_REP+3}+B{R_REP+5}"]]))

    # ------------------------------------------------------- palancas ------
    filas = [["PALANCAS · cambia estos ocho números y el plan entero se mueve",
              "valor", "", "procedencia"] + [""] * 10]
    filas += [[n, v, "", nt] + [""] * 10 for n, v, _, nt in PALANCAS]
    filas += [["Depósito a plazo (€)", "", "",
               "espejo del reparto · no entra en el flujo del mes"] + [""] * 10]
    vals.append((f"A14:N{R_PAL + 7}", filas))
    forms.append((f"B{R_PAL + 7}", [[f"=B{R_REP+2}"]]))

    # ------------------------------------------------- fila de los meses ---
    vals.append((f"A{R_MES}:N{R_MES}", [["EL MES A MES"] + MESES + ["nota"]]))

    # ------------------------------------------------------- ingresos ------
    vals.append((f"A{R_ING - 1}", [["LO QUE ENTRA"]]))
    filas = []
    for nombre, importe, cuando, proc, nota in INGRESOS:
        fila = [f"{proc} {nombre}"]
        fila += [importe if (cuando is None or i in cuando) else 0 for i in range(N)]
        filas.append(fila + [nota])
    vals.append((f"A{R_ING}:N{R_ING + len(INGRESOS) - 1}", filas))

    vals.append((f"A{R_CNT}:A{R_INGT}", [
        ["   Clientes nuevos vivos (nº)"], ["   Clientes nuevos · altas"],
        ["   Clientes nuevos · cuota recurrente"], ["TOTAL QUE ENTRA"]]))
    vals.append((f"N{R_CNT}:N{R_CNC}", [
        ["sale de las palancas · la vida media se aplica mes a mes, no de golpe"],
        ["altas × pago único"], ["clientes vivos × cuota"]]))

    # clientes(t) = clientes(t-1) × (1 − 1/vida) + altas. Churn continuo: en
    # régimen coincide con contarlos a mano, pero a 12 meses da menos. Es lo
    # prudente, porque un cliente que entra en el mes 11 no vive 5,4 meses
    # dentro de la ventana.
    bl = {R_CNT: [], R_CNA: [], R_CNC: [], R_INGT: []}
    for i, c in enumerate(COLS):
        ant = COLS[i - 1]
        bl[R_CNT].append(f"=$B${R_PAL}" if i == 0
                         else f"={ant}{R_CNT}*(1-1/$B${R_PAL+3})+$B${R_PAL}")
        bl[R_CNA].append(f"=$B${R_PAL}*$B${R_PAL+1}")
        bl[R_CNC].append(f"={c}{R_CNT}*$B${R_PAL+2}")
        # el nº de clientes es un recuento, no euros: se suma aparte del rango
        bl[R_INGT].append(f"=SUM({c}{R_ING}:{c}{R_ING + len(INGRESOS) - 1})"
                          f"+{c}{R_CNA}+{c}{R_CNC}")
    forms += [(f"B{f}:M{f}", [v]) for f, v in bl.items()]

    # ----------------------------------------------- gasto del negocio -----
    vals.append((f"A{R_SW - 1}", [["LO QUE SALE · NEGOCIO · software"]]))
    vals.append((f"A{R_SW}:N{R_SW + len(SOFTWARE) - 1}",
                 [[f"{p} {n}"] + [v] * N + [nt] for n, v, p, nt in SOFTWARE]))
    vals.append((f"A{R_SWT}", [["   subtotal software"]]))
    vals.append((f"A{R_QV}:N{R_QV + len(QUALIVO) - 1}",
                 [[f"{p} {n}"] + [v] * N + [nt] for n, v, p, nt in QUALIVO]))
    vals.append((f"A{R_QVT}", [["TOTAL NEGOCIO"]]))
    forms.append((f"B{R_SWT}:M{R_SWT}",
                  [[f"=SUM({c}{R_SW}:{c}{R_SWT - 1})" for c in COLS]]))
    forms.append((f"B{R_QVT}:M{R_QVT}",
                  [[f"={c}{R_SWT}+SUM({c}{R_QV}:{c}{R_QVT - 1})" for c in COLS]]))

    # -------------------------------------------------- gasto personal -----
    vals.append((f"A{R_PER - 1}", [["LO QUE SALE · PERSONAL"]]))
    vals.append((f"A{R_PER}:N{R_PER + len(PERSONAL) - 1}",
                 [[f"{p} {n}"] + [v] * N + [nt] for n, v, p, nt in PERSONAL]))
    vals.append((f"A{R_PERT}", [["TOTAL PERSONAL"]]))
    forms.append((f"B{R_PERT}:M{R_PERT}",
                  [[f"=SUM({c}{R_PER}:{c}{R_PERT - 1})" for c in COLS]]))

    # ------------------------------------------------------------ deuda ----
    vals.append((f"A{R_DEU - 1}", [["LO QUE SALE · DEUDA · cuota a cuota"]]))
    filas = []
    for nombre, cuota, ultimo, saldo, nota in DEUDA:
        # el último mes con cuota es lo que apaga la línea: las deudas que se
        # extinguen solas dejan de pesar sin que haya que amortizar nada
        fila = [nombre] + [cuota if i < ultimo else 0 for i in range(N)]
        filas.append(fila + [f"saldo {saldo:,.2f} € · {nota}".replace(",", ".")])
    vals.append((f"A{R_DEU}:N{R_DEU + len(DEUDA) - 1}", filas))
    vals.append((f"A{R_DEUT}:N{R_DEUT}",
                 [["TOTAL DEUDA"] + [""] * N + [D["nota_deuda"]]]))
    forms.append((f"B{R_DEUT}:M{R_DEUT}",
                  [[f"=SUM({c}{R_DEU}:{c}{R_DEUT - 1})" for c in COLS]]))

    # ------------------------------------------------------- impuestos -----
    vals.append((f"A{R_IMP - 1}", [["LO QUE SALE · IMPUESTOS"]]))
    vals.append((f"A{R_IMP}:N{R_IMP}",
                 [["IVA trimestral"] + [IVA_TRIM.get(i, 0) for i in range(N)]
                  + [D["nota_iva"]]]))
    vals.append((f"A{R_IMP + 1}:N{R_IMP + 1}",
                 [["IRPF a provisionar"] + [""] * N
                  + ["sobre el margen del negocio, sin contar la nómina, al % de "
                     "las palancas"]]))
    vals.append((f"A{R_IMPT}", [["TOTAL IMPUESTOS"]]))
    # la nómina ya lleva su IRPF retenido: se descuenta antes de provisionar
    forms.append((f"B{R_IMP + 1}:M{R_IMP + 1}",
                  [[f"=MAX(0;({c}{R_INGT}-{c}{R_ING}-{c}{R_QVT})*$B${R_PAL+6})"
                    for c in COLS]]))
    forms.append((f"B{R_IMPT}:M{R_IMPT}",
                  [[f"=SUM({c}{R_IMP}:{c}{R_IMPT - 1})" for c in COLS]]))

    # ------------------------------------------- resumen y los bolsillos ---
    vals.append((f"A{R_RES - 1}", [["EL RESULTADO Y LOS TRES BOLSILLOS"]]))
    vals.append((f"A{R_RES}:A{R_RES + 12}", [
        ["Entra"], ["Sale · negocio"], ["Sale · personal"], ["Sale · deuda"],
        ["Sale · impuestos"], ["TOTAL QUE SALE"], ["RESULTADO DEL MES"],
        ["Caja antes de tirar de la hucha"], ["Sale de la hucha"],
        ["CAJA OPERATIVA al cierre"], ["HUCHA al cierre"], ["DEPÓSITO"],
        ["TOTAL DISPONIBLE"]]))
    vals.append((f"N{R_RES + 6}:N{R_RES + 12}", [
        ["si es negativo, ese mes se come colchón"], [""],
        [f"solo si cae por debajo del umbral (B{R_PAL+4}), y solo hasta el "
         f"objetivo (B{R_PAL+5})"],
        ["lo que hay en la cuenta para operar"],
        ["el colchón que queda · si llega a 0, el plan se ha roto"],
        ["bloqueado a plazo · fuera del flujo a propósito"],
        ["caja + hucha + depósito"]]))

    bl = {R_RES + k: [] for k in range(13)}
    for i, c in enumerate(COLS):
        ant       = COLS[i - 1]
        caja_ant  = f"$B${R_REP + 6}" if i == 0 else f"{ant}{R_RES + 9}"
        hucha_ant = f"$B${R_REP + 4}" if i == 0 else f"{ant}{R_RES + 10}"
        bl[R_RES + 0].append(f"={c}{R_INGT}")
        bl[R_RES + 1].append(f"={c}{R_QVT}")
        bl[R_RES + 2].append(f"={c}{R_PERT}")
        bl[R_RES + 3].append(f"={c}{R_DEUT}")
        bl[R_RES + 4].append(f"={c}{R_IMPT}")
        bl[R_RES + 5].append(f"=SUM({c}{R_RES + 1}:{c}{R_RES + 4})")
        bl[R_RES + 6].append(f"={c}{R_RES}-{c}{R_RES + 5}")
        bl[R_RES + 7].append(f"={caja_ant}+{c}{R_RES + 6}")
        # la hucha repone hasta el objetivo, nunca más de lo que le queda
        bl[R_RES + 8].append(f"=IF({c}{R_RES + 7}<$B${R_PAL + 4};"
                             f"MIN({hucha_ant};MAX(0;$B${R_PAL + 5}-{c}{R_RES + 7}));0)")
        bl[R_RES + 9].append(f"={c}{R_RES + 7}+{c}{R_RES + 8}")
        bl[R_RES + 10].append(f"={hucha_ant}-{c}{R_RES + 8}")
        bl[R_RES + 11].append(f"=$B${R_PAL + 7}")
        bl[R_RES + 12].append(f"={c}{R_RES + 9}+{c}{R_RES + 10}+{c}{R_RES + 11}")
    forms += [(f"B{f}:M{f}", [v]) for f, v in bl.items()]

    # -------------------------------------------- puertas de decisión ------
    vals.append((f"A{R_GATE - 1}:N{R_GATE + len(PUERTAS) - 1}",
                 [["LAS PUERTAS DE DECISIÓN", "cuándo", "qué se mira",
                   "si sale bien", "si sale mal"] + [""] * 9]
                 + [list(p) + [""] * 9 for p in PUERTAS]))

    # ------------------------------------------- lo que no se hace ---------
    vals.append((f"A{R_NO - 1}:N{R_NO + len(NO_HACER) - 1}",
                 [["LO QUE NO SE HACE CON ESTE DINERO", "por qué"] + [""] * 12]
                 + [[q, pq] + [""] * 12 for q, pq in NO_HACER]))

    # ------------------------------------------------------- escritura -----
    h.lote(vals, "RAW")
    time.sleep(1)
    h.lote(forms, "USER_ENTERED")
    time.sleep(1)
    h.formato(formatos(h.gid))
    print(f"{TITULO}: listo · {FILAS} filas")
    print(f"  entra {R_ING}-{R_INGT} · software {R_SW}-{R_SWT} · "
          f"personal {R_PER}-{R_PERT} · deuda {R_DEU}-{R_DEUT} · "
          f"resumen {R_RES}-{R_RES + 12}")


def formatos(gid):
    cab = {"backgroundColor": {"red": 0.12, "green": 0.14, "blue": 0.18},
           "textFormat": {"bold": True, "fontSize": 10,
                          "foregroundColor": {"red": 1, "green": 1, "blue": 1}}}
    tot = {"backgroundColor": {"red": 0.91, "green": 0.93, "blue": 0.96},
           "textFormat": {"bold": True}}
    p = [
        {"updateSheetProperties": {
            "properties": {"sheetId": gid, "gridProperties": {
                "frozenRowCount": R_MES, "frozenColumnCount": 1}},
            # los dos campos hay que nombrarlos uno a uno o no se aplica ninguno
            "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"}},
        {"repeatCell": {"range": rango(gid, 1, 1), "cell": {"userEnteredFormat": {
            "backgroundColor": {"red": 0.08, "green": 0.09, "blue": 0.12},
            "textFormat": {"bold": True, "fontSize": 13,
                           "foregroundColor": {"red": 1, "green": 1, "blue": 1}}}},
            "fields": "userEnteredFormat(backgroundColor,textFormat)"}},
        {"repeatCell": {"range": rango(gid, R_MES, R_MES),
                        "cell": {"userEnteredFormat": cab},
                        "fields": "userEnteredFormat(backgroundColor,textFormat)"}},
        {"repeatCell": {"range": rango(gid, R_REP, R_REP + 6, 1, 2),
                        "cell": {"userEnteredFormat": {"numberFormat": eur(2)}},
                        "fields": "userEnteredFormat.numberFormat"}},
        {"repeatCell": {"range": rango(gid, R_ING, R_RES + 13, 1, 13),
                        "cell": {"userEnteredFormat": {"numberFormat": eur()}},
                        "fields": "userEnteredFormat.numberFormat"}},
        # el recuento de clientes nuevos no son euros
        {"repeatCell": {"range": rango(gid, R_CNT, R_CNT, 1, 13),
                        "cell": {"userEnteredFormat": {
                            "numberFormat": PATRON["num"]}},
                        "fields": "userEnteredFormat.numberFormat"}},
        {"repeatCell": {"range": rango(gid, R_PAL + 7, R_PAL + 7, 1, 2),
                        "cell": {"userEnteredFormat": {"numberFormat": eur()}},
                        "fields": "userEnteredFormat.numberFormat"}},
    ]
    for ancho, c1, c2 in ((300, 0, 1), (86, 1, 13), (460, 13, 14)):
        p.append({"updateDimensionProperties": {
            "range": {"sheetId": gid, "dimension": "COLUMNS",
                      "startIndex": c1, "endIndex": c2},
            "properties": {"pixelSize": ancho}, "fields": "pixelSize"}})
    # cada palanca con su formato: un plazo en meses no es un importe en euros
    for j, (_, _, fmt, _) in enumerate(PALANCAS):
        p.append({"repeatCell": {
            "range": rango(gid, R_PAL + j, R_PAL + j, 1, 2),
            "cell": {"userEnteredFormat": {"numberFormat": PATRON[fmt]}},
            "fields": "userEnteredFormat.numberFormat"}})
    for f in (4, 14, R_ING - 1, R_SW - 1, R_PER - 1, R_DEU - 1, R_IMP - 1,
              R_RES - 1, R_GATE - 1, R_NO - 1):
        p.append({"repeatCell": {"range": rango(gid, f, f),
                                 "cell": {"userEnteredFormat": cab},
                                 "fields": "userEnteredFormat(backgroundColor,textFormat)"}})
    for f in (R_REP + 4, R_REP + 6, R_INGT, R_SWT, R_QVT, R_PERT, R_DEUT,
              R_IMPT, R_RES + 5, R_RES + 6, R_RES + 9, R_RES + 10, R_RES + 12):
        p.append({"repeatCell": {"range": rango(gid, f, f),
                                 "cell": {"userEnteredFormat": tot},
                                 "fields": "userEnteredFormat(backgroundColor,textFormat)"}})
    # en rojo los meses en que el resultado, la caja o la hucha se van a negativo
    for f in (R_RES + 6, R_RES + 9, R_RES + 10):
        p.append({"addConditionalFormatRule": {"rule": {
            "ranges": [rango(gid, f, f, 1, 13)],
            "booleanRule": {
                "condition": {"type": "NUMBER_LESS",
                              "values": [{"userEnteredValue": "0"}]},
                "format": {"backgroundColor": {"red": 0.96, "green": 0.80, "blue": 0.80},
                           "textFormat": {"bold": True}}}}, "index": 0}})
    # y en ámbar la hucha cuando baja de mil: el aviso llega antes del cero
    p.append({"addConditionalFormatRule": {"rule": {
        "ranges": [rango(gid, R_RES + 10, R_RES + 10, 1, 13)],
        "booleanRule": {
            "condition": {"type": "NUMBER_LESS",
                          "values": [{"userEnteredValue": "1000"}]},
            "format": {"backgroundColor": {"red": 1, "green": 0.92, "blue": 0.78}}}},
        "index": 1}})
    return p


if __name__ == "__main__":
    if not SHEET:
        sys.exit("Falta PLAN_SHEET_ID.")
    construir()
