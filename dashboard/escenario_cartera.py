#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construye la pestaña «PLAN · cartera y caja»: el escenario de cartera a 18 meses.

Es el escenario que se decidió el 1-oct, y se mueve con dos palancas:

  · **vida media del cliente**, en meses. El churn mensual es 1 ÷ vida media.
  · **altas por mes**, los clientes nuevos que entran cada mes.

Cada alta paga una cuota de entrada el primer mes y una recurrente desde el
segundo. La cartera se modela en continuo, que es como lo hace el resto del
libro:

    clientes(t) = clientes(t-1) x (1 - churn) + altas
    MRR(t)      = MRR(t-1)      x (1 - churn) + altas x recurrente
    factura(t)  = MRR(t) + altas x (entrada - recurrente)

En régimen, el continuo y el discreto coinciden: clientes = altas ÷ churn. Lo
que cambia es el camino. El continuo empieza a perder cartera desde el primer
mes, mientras que contar clientes de uno en uno retrasa la primera baja hasta
que toca; por eso a doce meses el continuo da una cifra algo MÁS BAJA. Es la
lectura prudente, y es la que usa el resto del libro.

Los costes fijos NO se duplican aquí: se leen de la pestaña INPUTS, que sigue
siendo la única fuente. Lo que vive en esta pestaña son las palancas de la
cartera y el reparto del capital.

Tres reglas del libro que esta pestaña también respeta:

  1. Separador de argumentos `;`, porque la hoja está en configuración española.
  2. Ningún decimal literal dentro de una fórmula: va en una celda de entrada.
  3. Valores con RAW y fórmulas con USER_ENTERED, en llamadas acotadas.

Uso:  python3 dashboard/escenario_cartera.py
"""
import json, time, urllib.error, urllib.parse, urllib.request

CRED  = "/root/.claude/uploads/9036eb51-d77c-5ec5-9939-d4419e0760a9/7db8a765-kineticdream377917c17cfe8d7008.json"
SHEET = "1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0"
BASE  = "https://sheets.googleapis.com/v4/spreadsheets/"
TITULO = "PLAN · cartera y caja"

MESES = ['oct-26','nov-26','dic-26','ene-27','feb-27','mar-27','abr-27','may-27','jun-27',
         'jul-27','ago-27','sep-27','oct-27','nov-27','dic-27','ene-28','feb-28','mar-28']
N = len(MESES)

# Inventario de deuda a 29-sep. El TIN en blanco es un dato que falta, no un cero:
# sin él no se puede ordenar «la más cara primero».
DEUDA = [
    ("Tarjeta crédito BBVA",      931,  36, 99, 0.20, "SÍ", "la más cara que conocemos"),
    ("Renta 2025 IRPF (aplaz.)", 7334, 608, 13, 0.04, "SÍ", "se extingue sola en oct-27"),
    ("Ordenador (financiación)",  800,  66, 99, None, "SÍ", "🟡 saldo estimado"),
    ("Younited",                 1300,  97, 99, None, "NO", "🟡 saldo estimado · falta el TIN"),
    ("IVA 4T 2025 (aplaz.)",     1597, 240,  7, 0.04, "NO", "se extingue sola en abr-27"),
    ("IVA 2T 2026 (aplaz.)",     3790, 313, 13, 0.04, "NO", "se extingue sola en oct-27"),
    ("Préstamo 2 empresa BBVA",  8214, 308, 99, None, "NO", "🟡 falta el TIN · payback 27 meses"),
    ("Micro préstamo CaixaBank", 6590, 240, 99, 0.00, "NO", "bonificado · NUNCA cancelar"),
    ("Préstamo coche BBVA",     13667, 340, 99, None, "NO", "🟡 falta el TIN · payback 40 meses"),
]

# Filas de la hoja. Se nombran para no contar a mano al cambiar el diseño.
R_PAL   = 5                       # palancas: 5..12
R_CALC  = 16                      # calculado: 16..22
R_LECT  = 26                      # las tres lecturas: 26..29
R_DEU   = 33                      # inventario de deuda: 33..41
R_DEUT  = R_DEU + len(DEUDA)      # total de la deuda = 39
R_PLAN  = 47                      # primer mes del plan
R_PLANF = R_PLAN + N - 1          # último mes = 60
R_RES   = 67                      # resultado a 12 meses
R_COND  = 71                      # las tres condiciones: 71..73
R_SENS  = 77                      # sensibilidad: 77..82


def token():
    import jwt
    c = json.load(open(CRED)); now = int(time.time())
    a = jwt.encode({"iss": c["client_email"], "scope": "https://www.googleapis.com/auth/spreadsheets",
                    "aud": "https://oauth2.googleapis.com/token", "iat": now, "exp": now + 3600},
                   c["private_key"], algorithm="RS256")
    d = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                "assertion": a}).encode()
    return json.load(urllib.request.urlopen(
        urllib.request.Request("https://oauth2.googleapis.com/token", data=d), timeout=30))["access_token"]


def api(method, path, tok, payload=None, intentos=6):
    """60 escrituras por minuto: el 429 se reintenta con espera creciente."""
    for i in range(intentos):
        try:
            r = urllib.request.Request(BASE + path, method=method,
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
    def __init__(self, tok, titulo, filas=90, cols=24):
        self.tok, self.t = tok, titulo
        meta = api("GET", SHEET + "?fields=sheets.properties(title,sheetId)", tok)
        h = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
        if titulo in h:
            api("POST", SHEET + ":batchUpdate", tok,
                {"requests": [{"deleteSheet": {"sheetId": h[titulo]}}]})
        r = api("POST", SHEET + ":batchUpdate", tok, {"requests": [{"addSheet": {"properties": {
            "title": titulo, "index": 1,
            "gridProperties": {"rowCount": filas, "columnCount": cols}}}}]})
        self.gid = r["replies"][0]["addSheet"]["properties"]["sheetId"]

    def lote(self, bloques, modo="USER_ENTERED"):
        api("POST", SHEET + "/values:batchUpdate", self.tok, {
            "valueInputOption": modo,
            "data": [{"range": f"'{self.t}'!{r}", "values": v} for r, v in bloques]})


def construir(tok):
    h = Hoja(tok, TITULO, filas=90, cols=26)
    V, F = [], []   # bloques de valores (RAW) y de fórmulas (USER_ENTERED)

    V.append(("A1", [
        ["PLAN · CARTERA Y CAJA   ·   18 meses, oct-26 → mar-28"],
        ["Mueve solo las celdas azules. Los costes fijos se leen de INPUTS: si cambian, "
         "cámbialos allí."],
    ]))

    # ----------------------------------------------------------- palancas ----
    V.append((f"A{R_PAL - 1}", [["LAS DOS PALANCAS QUE DECIDEN EL PLAN", "", "", ""]]))
    V.append((f"A{R_PAL}", [
        ["Vida media del cliente (meses)", 7.9, "🔵", "la palanca principal. Tu dato real medido es 5,4"],
        ["Altas por mes", 1, "🔵", "clientes nuevos que entran cada mes"],
        ["Cuota de entrada (€)", 1000, "🔵", "lo que paga el primer mes. Cóbralo por adelantado"],
        ["Cuota recurrente (€/mes)", 800, "🔵", "lo que paga desde el segundo mes"],
        ["Captación · publicidad (€/mes)", 1250, "🔵", "15.000 € repartidos en 12 meses"],
        ["Capital del préstamo (€)", 25000, "🔵", "de tu padre"],
        ["TIN del préstamo (anual)", 0.07, "🟡", "PENDIENTE de confirmar las condiciones reales"],
        ["Plazo del préstamo (meses)", 60, "🟡", "PENDIENTE"],
        ["Tipo de IRPF sobre el beneficio", 0.30, "🔵",
         "con la nómina de Equipzilla encima, tu marginal está en el 37 %"],
    ]))

    V.append((f"A{R_CALC - 1}", [["CALCULADO", "", "", ""]]))
    V.append((f"A{R_CALC}", [
        ["Churn mensual", "", "⚙️", "1 ÷ vida media"],
        ["Cuota del préstamo (€/mes)", "", "⚙️", "obligación del plan, la pague quien la pague"],
        ["Capital que se va en liquidar deuda (€)", "", "⚙️", "las marcadas con SÍ más abajo"],
        ["Cuota de deuda que liberas (€/mes)", "", "⚙️", ""],
        ["Capital sin asignar (€)", "", "⚙️", "capital − deuda − captación de 12 meses. Es tu seguro"],
        ["Vida media REAL medida (meses)", 5.4, "⚪", "19 clientes recurrentes en Quipu. No se toca"],
        ["CAC del escenario BASE (€)", 1810, "⚪", "del FUNNEL. No se toca"],
    ]))
    F.append((f"B{R_CALC}", [
        [f"=IFERROR(1/B{R_PAL};0)"],
        [f"=IF(B{R_PAL+5}>0;ROUND(-PMT(B{R_PAL+6}/12;B{R_PAL+7}/1;B{R_PAL+5});2);0)"],
        [f'=SUMPRODUCT(($F${R_DEU}:$F${R_DEUT-1}="SÍ")*$B${R_DEU}:$B${R_DEUT-1})'],
        [f'=SUMPRODUCT(($F${R_DEU}:$F${R_DEUT-1}="SÍ")*$C${R_DEU}:$C${R_DEUT-1})'],
        [f"=B{R_PAL+5}-B{R_CALC+2}-B{R_PAL+4}*12"],
    ]))

    # ------------------------------------------------------- las lecturas ----
    V.append((f"A{R_LECT - 2}", [
        ["«UNO DE CADA TRES SE CAE» · las tres lecturas. Copia la vida media en B5"]]))
    V.append((f"A{R_LECT - 1}", [["Lectura", "churn/mes", "vida media", "", "Qué sale"]]))
    # Las cifras de «Qué sale» salen del motor de esta misma pestaña, no de un
    # cálculo aparte: si se toca el modelo, hay que volver a leerlas de B63:F63.
    V.append((f"A{R_LECT}", [
        ["Cada mes se cae un tercio de la cartera", "", 3.0, "",
         "3,0 clientes · MRR 2.389 € · caja 2.458 €"],
        ["Cada trimestre se cae un tercio", "", 7.9, "",
         "6,6 clientes · MRR 5.274 € · caja 22.842 €   ← la que elegiste"],
        ["De cada tres que entran, uno se cae", "", 21.0, "",
         "9,9 clientes · MRR 8.008 € · caja 38.072 €"],
        ["TU DATO REAL · 19 clientes recurrentes en Quipu", "", 5.4, "",
         "5,0 clientes · MRR 4.037 € · caja 14.942 €"],
    ]))
    F.append((f"B{R_LECT}", [[f"=IFERROR(1/C{R_LECT + i};0)"] for i in range(4)]))

    # ------------------------------------------------------------- deuda ----
    V.append((f"A{R_DEU - 2}", [
        [f"REPARTO DEL CAPITAL · pon SÍ en la columna F para liquidar esa deuda en octubre"]]))
    V.append((f"A{R_DEU - 1}", [
        ["Deuda", "Saldo", "Cuota/mes", "Último mes con cuota", "TIN",
         "LIQUIDAR", "Payback (meses)", "Notas"]]))
    V.append((f"A{R_DEU}", [[d[0], d[1], d[2], d[3], (d[4] if d[4] is not None else ""),
                             d[5], "", d[6]] for d in DEUDA]))
    F.append((f"G{R_DEU}", [[f"=IFERROR(B{R_DEU + i}/C{R_DEU + i};0)"] for i in range(len(DEUDA))]))
    V.append((f"A{R_DEUT}", [["TOTAL", "", "", "", "", "", "", ""]]))
    F.append((f"B{R_DEUT}", [[f"=SUM(B{R_DEU}:B{R_DEUT-1})", f"=SUM(C{R_DEU}:C{R_DEUT-1})"]]))
    V.append((f"A{R_DEUT + 1}", [
        ["Un payback por encima del plazo que le queda significa que se extingue sola antes de "
         "amortizarse: liquidarla solo adelanta cuotas que ibas a dejar de pagar igual."]]))

    # -------------------------------------------------------- plan mensual ----
    CAB = ["Mes", "Clientes", "MRR inicial", "MRR nuevo", "MRR perdido", "MRR final",
           "Factura clientes", "Nómina + proyectos", "Cobros puntuales", "INGRESOS",
           "Captación", "Software", "Estructura", "Personal", "Comercial",
           "Cuotas de deuda", "Cuota del préstamo", "Impuestos atrasados",
           "Beneficio de autónomo", "IRPF sobre el beneficio", "GASTOS",
           "CASH FLOW", "CAJA", "Runway (meses)"]
    V.append((f"A{R_PLAN - 2}", [["PLAN MES A MES"]]))
    V.append((f"A{R_PLAN - 1}", [CAB]))
    V.append((f"A{R_PLAN}", [[m] for m in MESES]))

    COL = {c: [] for c in "BCDEFGHIJKLMNOPQRSTUVWX"}
    for i in range(N):
        r, p = R_PLAN + i, R_PLAN + i - 1
        # El mes 1 arranca de los datos reales de INPUTS; los demás, del mes anterior.
        COL["B"].append(f"=INPUTS!$B$38*(1-$B${R_CALC})+$B${R_PAL+1}" if i == 0
                        else f"=B{p}*(1-$B${R_CALC})+$B${R_PAL+1}")
        COL["C"].append("=INPUTS!$B$37" if i == 0 else f"=F{p}")
        COL["D"].append(f"=$B${R_PAL+1}*$B${R_PAL+3}")
        COL["E"].append(f"=C{r}*$B${R_CALC}")
        COL["F"].append(f"=C{r}+D{r}-E{r}")
        COL["G"].append(f"=F{r}+$B${R_PAL+1}*($B${R_PAL+2}-$B${R_PAL+3})")
        COL["H"].append("=INPUTS!$B$44+INPUTS!$B$43")
        COL["I"].append("=INPUTS!$B$45" if i == 0 else
                        ("=INPUTS!$B$46" if i == 1 else "=0"))
        COL["J"].append(f"=G{r}+H{r}+I{r}")
        COL["K"].append(f"=IF({i+1}<=12;$B${R_PAL+4};0)")
        COL["L"].append("=INPUTS!$B$69")
        COL["M"].append("=INPUTS!$B$73")
        COL["N"].append("=INPUTS!$B$74")
        COL["O"].append(f"=IF(AND({i+1}>=INPUTS!$B$50;{i+1}<INPUTS!$B$50+INPUTS!$B$51);"
                        f"INPUTS!$B$49;0)")
        # Cuota viva: la deuda no liquidada a la que aún le quedan meses de cuota.
        COL["P"].append(f'=SUMPRODUCT(($F${R_DEU}:$F${R_DEUT-1}<>"SÍ")'
                        f"*($D${R_DEU}:$D${R_DEUT-1}>={i+1})*$C${R_DEU}:$C${R_DEUT-1})")
        COL["Q"].append(f"=$B${R_CALC+1}")
        COL["R"].append(f"=INPUTS!{chr(66+i)}78" if i < 12 else "=0")
        # Beneficio de autónomo: lo que factura Qualivo menos el gasto deducible.
        # Los gastos personales y el principal de las cuotas NO lo son. Tampoco
        # se descuentan aquí los intereses, que sí serían deducibles: el IRPF
        # sale por tanto algo alto, que es el lado prudente.
        COL["S"].append(f"=G{r}+INPUTS!$B$43-K{r}-L{r}-M{r}-O{r}")
        # El modelo 130 es acumulado y trimestral. Aquí se devenga mes a mes
        # sobre el beneficio acumulado, que es la misma carga mejor repartida.
        COL["T"].append(f"=MAX(0;$B${R_PAL+8}*S{r})" if i == 0 else
                        f"=MAX(0;$B${R_PAL+8}*SUM($S${R_PLAN}:S{r})-SUM($T${R_PLAN}:T{p}))")
        COL["U"].append(f"=SUM(K{r}:R{r})+T{r}")
        COL["V"].append(f"=J{r}-U{r}")
        # Octubre arranca con el banco más el capital, menos la reserva fiscal y
        # menos lo que se va en liquidar deuda.
        COL["W"].append(f"=INPUTS!$B$84+$B${R_PAL+5}-INPUTS!$B$79-$B${R_CALC+2}+V{r}"
                        if i == 0 else f"=W{p}+V{r}")
        COL["X"].append(f'=IFERROR(IFS(W{r}<=0;"SIN CAJA";V{r}>=0;"no se agota";'
                        f"TRUE;ROUND(W{r}/-V{r};1));\"nd\")")
    F += [(f"{c}{R_PLAN}", [[v] for v in vals]) for c, vals in COL.items()]

    # ---------------------------------------------------------- resultado ----
    r12 = R_PLAN + 11
    V.append((f"A{R_RES - 1}", [["RESULTADO"]]))
    V.append((f"A{R_RES}", [
        ["Clientes en sep-27", "", "MRR en sep-27", "", "Caja en sep-27", "",
         "Cash flow en sep-27", ""],
        ["Caja mínima de los 18 meses", "", "Cuándo", "", "Mes en que se queda sin caja", "",
         "MRR en régimen", ""],
    ]))
    F.append((f"B{R_RES}", [[f"=ROUND(B{r12};1)", "", f"=F{r12}", "", f"=W{r12}", "", f"=V{r12}"]]))
    F.append((f"B{R_RES + 1}", [
        [f"=MIN(W{R_PLAN}:W{R_PLANF})", "",
         f"=INDEX(A{R_PLAN}:A{R_PLANF};MATCH(MIN(W{R_PLAN}:W{R_PLANF});W{R_PLAN}:W{R_PLANF};0))", "",
         f'=IFERROR(INDEX(A{R_PLAN}:A{R_PLANF};MATCH(TRUE;W{R_PLAN}:W{R_PLANF}<0;0));'
         f'"🟢 no se queda sin caja")', "",
         f"=$B${R_PAL+1}*$B${R_PAL+3}*$B${R_PAL}"]]))

    # -------------------------------------------------------- condiciones ----
    V.append((f"A{R_COND - 1}", [["LAS TRES CONDICIONES · sin estas tres, el plan de arriba no "
                                  "describe tu negocio"]]))
    V.append((f"A{R_COND}", [
        ["1 · Cobrar la cuota de entrada por adelantado, por contrato", "",
         "son 12.000 € al año que no dependen de la retención"],
        ["2 · La vida media tiene que llegar a la que pone en B5", "",
         "hoy son 5,4 meses medidos. Revísalo con la cohorte de octubre"],
        ["3 · Las altas por mes son un compromiso, no una previsión", "",
         "1.250 €/mes a tu CAC base de 1.810 € dan 0,69 altas"],
    ]))
    F.append((f"B{R_COND}", [
        [f'=IF($B${R_PAL+2}>$B${R_PAL+3};"🔵 en el plan";"🔴 sin cuota de entrada")'],
        [f'=IF($B${R_PAL}<=$B${R_CALC+5};"🟢 no asume mejora";'
         f'"🟠 asume "&ROUND($B${R_PAL}/$B${R_CALC+5};1)&" veces tu retención real")'],
        [f'=IF($B${R_PAL+1}<=$B${R_PAL+4}/$B${R_CALC+6};"🟢 cabe en el CAC real";'
         f'"🟠 exige un CAC de "&TEXT($B${R_PAL+4}/$B${R_PAL+1};"#,##0")&" €, y el real es "'
         f'&TEXT($B${R_CALC+6};"#,##0")&" €")'],
    ]))

    # ------------------------------------------------------- sensibilidad ----
    V.append((f"A{R_SENS - 2}", [
        ["SENSIBILIDAD · MRR en régimen (altas × recurrente × vida media)"]]))
    V.append((f"A{R_SENS - 1}", [["Vida media ↓ / altas por mes →", 0.5, 0.7, 1, 1.5, 2]]))
    vidas = [3.0, 5.4, 7.9, 12.0, 18.0, 21.0]
    V.append((f"A{R_SENS}", [[v] for v in vidas]))
    F += [(f"B{R_SENS + i}", [[f"=$A${R_SENS + i}*{chr(66 + j)}${R_SENS - 1}*$B${R_PAL + 3}"
                               for j in range(5)]]) for i in range(len(vidas))]
    V.append((f"A{R_SENS + len(vidas) + 1}", [
        ["El régimen es el techo: con una vida media de 5,4 meses y una alta al mes, el MRR no "
         "pasa de 4.320 € por mucha publicidad que pongas. Subir la vida media sale gratis; "
         "subir las altas cuesta 1.250 € cada una."]]))

    h.lote(V, modo="RAW")
    for i in range(0, len(F), 40):
        h.lote(F[i:i + 40])
    return h


# ---------------------------------------------------------------- formato ----
def formato(tok, gid, filas=90, cols=26):
    C = lambda r, g, b: {"red": r, "green": g, "blue": b}
    VERDE, BLANCO, GRIS = C(.06, .42, .36), C(1, 1, 1), C(.47, .54, .52)
    AZUL, TINTA, ROJO = C(.09, .35, .55), C(.08, .13, .12), C(.64, .17, .14)
    CREMA, SUAVE = C(.99, .97, .91), C(.92, .95, .94)
    EUR, PCT, DEC = '#,##0 "€"', "0.0%", "0.0"

    def R(r0, r1, c0, c1, **k):
        cell, tf = {}, {}
        if "bg" in k: cell["backgroundColor"] = k["bg"]
        if "num" in k: cell["numberFormat"] = {"type": "NUMBER", "pattern": k["num"]}
        if "ha" in k: cell["horizontalAlignment"] = k["ha"]
        if "wrap" in k: cell["wrapStrategy"] = k["wrap"]
        for a, b in (("bold", "bold"), ("size", "fontSize"), ("fg", "foregroundColor"),
                     ("font", "fontFamily"), ("italic", "italic")):
            if a in k: tf[b] = k[a]
        if tf: cell["textFormat"] = tf
        campos = []
        if "bg" in k: campos.append("userEnteredFormat.backgroundColor")
        if "num" in k: campos.append("userEnteredFormat.numberFormat")
        if "ha" in k: campos.append("userEnteredFormat.horizontalAlignment")
        if "wrap" in k: campos.append("userEnteredFormat.wrapStrategy")
        if tf: campos.append("userEnteredFormat.textFormat")
        if not campos: return None
        return {"repeatCell": {"range": {"sheetId": gid, "startRowIndex": r0 - 1,
                                         "endRowIndex": min(r1, filas),
                                         "startColumnIndex": c0 - 1,
                                         "endColumnIndex": min(c1, cols)},
                               "cell": {"userEnteredFormat": cell},
                               "fields": ",".join(campos)}}

    W = lambda c0, c1, px: {"updateDimensionProperties": {
        "range": {"sheetId": gid, "dimension": "COLUMNS",
                  "startIndex": c0 - 1, "endIndex": min(c1, cols)},
        "properties": {"pixelSize": px}, "fields": "pixelSize"}}

    req = [
        W(1, 1, 300), W(2, 2, 110), W(3, 3, 110), W(4, 4, 150), W(5, 8, 150), W(9, 26, 108),
        # portada
        R(1, 1, 1, 10, bg=VERDE, fg=BLANCO, bold=True, size=15),
        R(2, 2, 1, 10, fg=GRIS, size=10, italic=True),
        # palancas: el bloque editable, en crema para que se vea a la primera
        R(R_PAL, R_PAL + 8, 1, 1, bold=True, ha="LEFT"),
        R(R_PAL, R_PAL + 8, 2, 2, bg=CREMA, fg=AZUL, bold=True, size=13,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_PAL, R_PAL + 1, 2, 2, bg=CREMA, fg=AZUL, bold=True, size=13,
          font="Roboto Mono", ha="RIGHT", num=DEC),
        R(R_PAL + 6, R_PAL + 6, 2, 2, bg=CREMA, fg=AZUL, bold=True, size=13,
          font="Roboto Mono", ha="RIGHT", num=PCT),
        R(R_PAL + 8, R_PAL + 8, 2, 2, bg=CREMA, fg=AZUL, bold=True, size=13,
          font="Roboto Mono", ha="RIGHT", num=PCT),
        # el plazo son meses, no euros
        R(R_PAL + 7, R_PAL + 7, 2, 2, bg=CREMA, fg=AZUL, bold=True, size=13,
          font="Roboto Mono", ha="RIGHT", num="0"),
        R(R_PAL, R_PAL + 8, 3, 3, ha="CENTER"),
        R(R_PAL, R_PAL + 8, 4, 8, fg=GRIS, size=9),
        # calculado
        R(R_CALC, R_CALC + 6, 1, 1, ha="LEFT"),
        R(R_CALC, R_CALC + 6, 2, 2, bg=SUAVE, bold=True, font="Roboto Mono",
          ha="RIGHT", num=EUR),
        R(R_CALC + 5, R_CALC + 5, 2, 2, bg=SUAVE, bold=True, font="Roboto Mono",
          ha="RIGHT", num=DEC),
        R(R_CALC, R_CALC, 2, 2, bg=SUAVE, bold=True, font="Roboto Mono", ha="RIGHT", num=PCT),
        R(R_CALC, R_CALC + 6, 3, 3, ha="CENTER"),
        R(R_CALC, R_CALC + 6, 4, 8, fg=GRIS, size=9),
        # lecturas
        R(R_LECT - 1, R_LECT - 1, 1, 6, bg=C(.13, .19, .17), fg=BLANCO, bold=True,
          size=9, ha="CENTER"),
        R(R_LECT, R_LECT + 3, 2, 2, font="Roboto Mono", ha="RIGHT", num=PCT),
        R(R_LECT, R_LECT + 3, 3, 3, font="Roboto Mono", ha="RIGHT", num=DEC),
        R(R_LECT + 1, R_LECT + 1, 1, 6, bold=True),
        R(R_LECT + 3, R_LECT + 3, 1, 6, fg=AZUL, bold=True),
        # deuda
        R(R_DEU - 1, R_DEU - 1, 1, 8, bg=C(.13, .19, .17), fg=BLANCO, bold=True,
          size=9, ha="CENTER", wrap="WRAP"),
        R(R_DEU, R_DEUT, 2, 3, font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_DEU, R_DEUT - 1, 4, 4, font="Roboto Mono", ha="CENTER", num="0"),
        R(R_DEU, R_DEUT - 1, 5, 5, font="Roboto Mono", ha="CENTER", num=PCT),
        R(R_DEU, R_DEUT - 1, 6, 6, bg=CREMA, fg=AZUL, bold=True, ha="CENTER"),
        R(R_DEU, R_DEUT - 1, 7, 7, font="Roboto Mono", ha="RIGHT", num=DEC),
        R(R_DEU, R_DEUT - 1, 8, 8, fg=GRIS, size=9),
        R(R_DEUT, R_DEUT, 1, 8, bg=SUAVE, bold=True),
        R(R_DEUT + 1, R_DEUT + 1, 1, 10, fg=GRIS, size=9, italic=True),
        # plan
        R(R_PLAN - 1, R_PLAN - 1, 1, 24, bg=C(.13, .19, .17), fg=BLANCO, bold=True,
          size=9, ha="CENTER", wrap="WRAP"),
        R(R_PLAN, R_PLANF, 1, 1, bold=True, ha="LEFT"),
        R(R_PLAN, R_PLANF, 2, 2, font="Roboto Mono", ha="RIGHT", num=DEC),
        R(R_PLAN, R_PLANF, 3, 21, font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_PLAN, R_PLANF, 22, 23, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_PLAN, R_PLANF, 24, 24, font="Roboto Mono", ha="RIGHT"),
        R(R_PLAN, R_PLANF, 10, 10, bg=SUAVE, bold=True, font="Roboto Mono",
          ha="RIGHT", num=EUR),
        R(R_PLAN, R_PLANF, 19, 20, bg=CREMA, font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_PLAN, R_PLANF, 21, 21, bg=SUAVE, bold=True, font="Roboto Mono",
          ha="RIGHT", num=EUR),
        R(R_PLAN, R_PLANF, 23, 23, bg=C(.92, .96, .94), fg=VERDE, bold=True,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        # resultado
        R(R_RES, R_RES + 1, 1, 8, bold=True),
        R(R_RES, R_RES + 1, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_RES, R_RES + 1, 4, 4, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_RES, R_RES + 1, 6, 6, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_RES, R_RES, 8, 8, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_RES, R_RES, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14,
          font="Roboto Mono", ha="RIGHT", num=DEC),
        R(R_RES + 1, R_RES + 1, 4, 4, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=12,
          font="Inter", ha="RIGHT"),
        R(R_RES + 1, R_RES + 1, 6, 6, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=11,
          font="Inter", ha="RIGHT"),
        R(R_RES + 1, R_RES + 1, 8, 8, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14,
          font="Roboto Mono", ha="RIGHT", num=EUR),
        # condiciones
        R(R_COND, R_COND + 2, 1, 1, bold=True, ha="LEFT"),
        R(R_COND, R_COND + 2, 2, 2, bold=True, ha="LEFT"),
        R(R_COND, R_COND + 2, 3, 8, fg=GRIS, size=9),
        # sensibilidad
        R(R_SENS - 1, R_SENS - 1, 1, 6, bg=C(.13, .19, .17), fg=BLANCO, bold=True,
          size=9, ha="CENTER"),
        R(R_SENS, R_SENS + 5, 1, 1, bg=SUAVE, bold=True, font="Roboto Mono",
          ha="CENTER", num=DEC),
        R(R_SENS, R_SENS + 5, 2, 6, font="Roboto Mono", ha="RIGHT", num=EUR),
        R(R_SENS + 7, R_SENS + 7, 1, 10, fg=GRIS, size=9, italic=True),
    ]
    # cabeceras de sección
    for r in (R_PAL - 1, R_CALC - 1, R_LECT - 2, R_DEU - 2, R_PLAN - 2,
              R_RES - 1, R_COND - 1, R_SENS - 2):
        req.append(R(r, r, 1, 24, bg=C(.92, .95, .94), fg=VERDE, bold=True, size=12))

    req += [
        {"updateSheetProperties": {"properties": {"sheetId": gid, "gridProperties": {
            "frozenRowCount": 2, "frozenColumnCount": 1}},
         "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"}},
        # el rojo salta solo donde importa: caja, cash flow y la caja mínima
        {"addConditionalFormatRule": {"rule": {
            "ranges": [{"sheetId": gid, "startRowIndex": R_PLAN - 1, "endRowIndex": R_PLANF,
                        "startColumnIndex": 21, "endColumnIndex": 23}],
            "booleanRule": {"condition": {"type": "NUMBER_LESS",
                                          "values": [{"userEnteredValue": "0"}]},
                            "format": {"backgroundColor": C(.98, .87, .86),
                                       "textFormat": {"foregroundColor": ROJO, "bold": True}}}},
            "index": 0}},
        {"addConditionalFormatRule": {"rule": {
            "ranges": [{"sheetId": gid, "startRowIndex": R_RES, "endRowIndex": R_RES + 1,
                        "startColumnIndex": 1, "endColumnIndex": 2}],
            "booleanRule": {"condition": {"type": "NUMBER_LESS",
                                          "values": [{"userEnteredValue": "5000"}]},
                            "format": {"backgroundColor": C(.98, .87, .86),
                                       "textFormat": {"foregroundColor": ROJO, "bold": True}}}},
            "index": 0}},
        # validación: la columna LIQUIDAR solo admite SÍ o NO
        {"setDataValidation": {
            "range": {"sheetId": gid, "startRowIndex": R_DEU - 1, "endRowIndex": R_DEUT - 1,
                      "startColumnIndex": 5, "endColumnIndex": 6},
            "rule": {"condition": {"type": "ONE_OF_LIST",
                                   "values": [{"userEnteredValue": "SÍ"},
                                              {"userEnteredValue": "NO"}]},
                     "showCustomUi": True, "strict": True}}},
    ]
    req = [r for r in req if r]
    for i in range(0, len(req), 50):
        api("POST", SHEET + ":batchUpdate", tok, {"requests": req[i:i + 50]})
    return len(req)


if __name__ == "__main__":
    tok = token()
    print("Construyendo «PLAN · cartera y caja»…")
    h = construir(tok)
    print(f"  · valores y fórmulas escritos")
    n = formato(tok, h.gid)
    print(f"  · formato: {n} peticiones")
    print(f"\n  https://docs.google.com/spreadsheets/d/{SHEET}/edit#gid={h.gid}")
