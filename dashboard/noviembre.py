"""Construye la pestaña «NOVIEMBRE · plan y control» en el Sheet de Facturación.

La hoja tiene una sola columna editable, la de «real de noviembre»: lo demás son
el cierre de octubre, el presupuesto y fórmulas. La idea es que controlar el mes
cueste rellenar una columna, no reconstruir una contabilidad.

Las cifras NO están aquí. Este repositorio es público, así que los importes, los
nombres de clientes y los saldos viven en datos_plan.json, que está ignorado.

    GOOGLE_SA_JSON=... PLAN_SHEET_ID=... python3 noviembre.py
"""
import importlib.util, json, os, pathlib, sys

AQUI = pathlib.Path(__file__).resolve().parent
DATOS = pathlib.Path(os.environ.get("PLAN_DATOS", AQUI / "datos_plan.json"))

# El cliente de Sheets (token JWT, reintentos y la clase Hoja) ya está resuelto
# en plan_prestamo.py; no tiene sentido tener dos.
_spec = importlib.util.spec_from_file_location("pp", AQUI / "plan_prestamo.py")
pp = importlib.util.module_from_spec(_spec)
try:
    _spec.loader.exec_module(pp)
except SystemExit:
    pass

D = json.loads(DATOS.read_text())["noviembre"]
FAC, EMP, PER = D["facturacion"], D["empresa"], D["personal"]
OBJ, CAJA = D["objetivos"], D["caja_inicial"]

# Las filas se calculan a partir de los datos: añadir un cliente o un gasto en el
# JSON desplaza los bloques solo, sin tocar ninguna fórmula de aquí abajo.
R_PANEL = 4
R_TIPOS = R_PANEL + 9
R_FAC = R_TIPOS + 3
R_FAC1 = R_FAC + 2
R_FACT = R_FAC1 + len(FAC)
R_EMP = R_FACT + 2
R_EMP1 = R_EMP + 2
R_EMPT = R_EMP1 + len(EMP)
R_PER = R_EMPT + 2
R_PER1 = R_PER + 2
R_PERT = R_PER1 + len(PER)
R_OBJ = R_PERT + 2
R_OBJ1 = R_OBJ + 1
R_CAJA = R_OBJ1 + len(OBJ) + 1
R_CAJA1 = R_CAJA + 1
R_CAJAT = R_CAJA1 + len(CAJA)
FILAS = R_CAJAT + 3

C_IVA, C_RET = f"$C${R_TIPOS + 1}", f"$C${R_TIPOS + 2}"


def construir():
    tok = pp.token()
    h = pp.Hoja(tok, "NOVIEMBRE · plan y control", FILAS, cols=8)
    val, form = [], []

    def v(rango, filas):
        val.append((rango, filas))

    def f(rango, filas):
        form.append((rango, filas))

    v("A1", [["NOVIEMBRE 2026 · plan y control"],
             ["Octubre es el gasto real de los extractos. Solo se rellena la columna E."]])

    # ---- panel -------------------------------------------------------------
    v(f"A{R_PANEL}", [["PANEL", "", "", "", "", "", ""]])
    panel = ["Facturación prevista (base, sin IVA)",
             "Facturación ya cobrada",
             "IVA que hay que apartar",
             "Gasto de empresa · presupuesto",
             "Gasto personal · presupuesto",
             "Caja al empezar noviembre",
             "Caja proyectada a 30-nov"]
    v(f"A{R_PANEL + 1}", [[p] for p in panel])
    f(f"C{R_PANEL + 1}", [
        [f"=SUM(D{R_FAC1}:D{R_FACT - 1})"],
        [f'=SUMIF(G{R_FAC1}:G{R_FACT - 1};"sí";F{R_FAC1}:F{R_FACT - 1})'],
        [f"=C{R_PANEL + 1}*{C_IVA}"],
        [f"=SUM(D{R_EMP1}:D{R_EMPT - 1})"],
        [f"=SUM(D{R_PER1}:D{R_PERT - 1})"],
        [f"=C{R_CAJAT}"],
        [f"=C{R_PANEL + 6}+F{R_FACT}-C{R_PANEL + 3}-C{R_PANEL + 4}-C{R_PANEL + 5}"]])

    v(f"A{R_TIPOS}", [["TIPOS"]])
    v(f"A{R_TIPOS + 1}", [["IVA", "", 0.21], ["Retención de IRPF", "", 0.15]])

    # ---- facturación -------------------------------------------------------
    v(f"A{R_FAC}", [["FACTURACIÓN DE NOVIEMBRE"]])
    v(f"A{R_FAC + 1}", [["Cliente", "Origen", "Tipo", "Base",
                         "IVA", "Al banco", "¿Cobrada?"]])
    v(f"A{R_FAC1}", [[n, o, t, b] for n, o, b, t, _ in FAC])
    f(f"E{R_FAC1}", [[f"=D{r}*{C_IVA}", f"=D{r}+E{r}-D{r}*{C_RET}", ""]
                     for r in range(R_FAC1, R_FACT)])
    v(f"A{R_FACT}", [["TOTAL"]])
    f(f"D{R_FACT}", [[f"=SUM(D{R_FAC1}:D{R_FACT - 1})",
                      f"=SUM(E{R_FAC1}:E{R_FACT - 1})",
                      f"=SUM(F{R_FAC1}:F{R_FACT - 1})"]])

    # ---- gastos ------------------------------------------------------------
    for titulo, datos, r0, r1, rt in (
            ("GASTO DE EMPRESA", EMP, R_EMP, R_EMP1, R_EMPT),
            ("GASTO PERSONAL", PER, R_PER, R_PER1, R_PERT)):
        v(f"A{r0}", [[titulo]])
        v(f"A{r0 + 1}", [["Concepto", "", "Octubre real", "Presupuesto nov",
                          "Real nov", "Desvío", "Nota"]])
        v(f"A{r1}", [[n, "", oct_, pre] for n, oct_, pre in datos])
        # el desvío solo aparece cuando hay un real escrito: así una columna
        # vacía no pinta de rojo todo el bloque el día 1
        f(f"F{r1}", [[f'=IF(E{r}="";"";E{r}-D{r})'] for r in range(r1, rt)])
        v(f"A{rt}", [["TOTAL"]])
        f(f"C{rt}", [[f"=SUM(C{r1}:C{rt - 1})", f"=SUM(D{r1}:D{rt - 1})",
                      f"=SUM(E{r1}:E{rt - 1})", f"=SUM(F{r1}:F{rt - 1})"]])

    # ---- objetivos y caja --------------------------------------------------
    v(f"A{R_OBJ}", [["OBJETIVOS"]])
    v(f"A{R_OBJ1}", [[n, "", x] for n, x, _ in OBJ])

    v(f"A{R_CAJA}", [["CAJA AL EMPEZAR"]])
    v(f"A{R_CAJA1}", [[n, "", x] for n, x in CAJA])
    v(f"A{R_CAJAT}", [["TOTAL DISPONIBLE"]])
    f(f"C{R_CAJAT}", [[f"=SUM(C{R_CAJA1}:C{R_CAJAT - 1})"]])
    v(f"A{R_CAJAT + 2}", [["La reserva de empresa (18.000 €) no entra aquí: "
                           "está bloqueada y no se cuenta como caja operativa."]])

    h.lote(val, "RAW")
    h.lote(form, "USER_ENTERED")
    h.formato(formatos(h.gid))
    return h.gid


def formatos(gid):
    eur = pp.eur(1)
    gris = {"red": 0.95, "green": 0.95, "blue": 0.95}
    azul = {"red": 0.85, "green": 0.91, "blue": 0.98}
    amar = {"red": 1.0, "green": 0.97, "blue": 0.80}
    neg = lambda **k: {"textFormat": {"bold": True, **k}}
    p = [
        {"updateSheetProperties": {
            "properties": {"sheetId": gid,
                           "gridProperties": {"frozenRowCount": 2}},
            "fields": "gridProperties.frozenRowCount"}},
        {"repeatCell": {"range": pp.rango(gid, 1, 1, 0, 8),
                        "cell": {"userEnteredFormat": neg(fontSize=13)},
                        "fields": "userEnteredFormat.textFormat"}},
        {"updateDimensionProperties": {
            "range": {"sheetId": gid, "dimension": "COLUMNS",
                      "startIndex": 0, "endIndex": 1},
            "properties": {"pixelSize": 300}, "fields": "pixelSize"}},
        {"updateDimensionProperties": {
            "range": {"sheetId": gid, "dimension": "COLUMNS",
                      "startIndex": 6, "endIndex": 7},
            "properties": {"pixelSize": 260}, "fields": "pixelSize"}},
    ]
    # cabeceras de bloque
    for r in (R_PANEL, R_TIPOS, R_FAC, R_EMP, R_PER, R_OBJ, R_CAJA):
        p.append({"repeatCell": {
            "range": pp.rango(gid, r, r, 0, 8),
            "cell": {"userEnteredFormat": {"backgroundColor": azul, **neg()}},
            "fields": "userEnteredFormat(backgroundColor,textFormat)"}})
    # totales
    for r in (R_FACT, R_EMPT, R_PERT, R_CAJAT):
        p.append({"repeatCell": {
            "range": pp.rango(gid, r, r, 0, 8),
            "cell": {"userEnteredFormat": {"backgroundColor": gris, **neg()}},
            "fields": "userEnteredFormat(backgroundColor,textFormat)"}})
    # la única columna que se rellena a mano, en amarillo
    for r1, rt in ((R_EMP1, R_EMPT), (R_PER1, R_PERT)):
        p.append({"repeatCell": {
            "range": pp.rango(gid, r1, rt, 4, 5),
            "cell": {"userEnteredFormat": {"backgroundColor": amar}},
            "fields": "userEnteredFormat.backgroundColor"}})
    # euros
    for r1, r2, c1, c2 in ((R_PANEL + 1, R_PANEL + 7, 2, 3),
                           (R_FAC1, R_FACT, 3, 6),
                           (R_EMP1, R_EMPT, 2, 6),
                           (R_PER1, R_PERT, 2, 6),
                           (R_CAJA1, R_CAJAT, 2, 3)):
        p.append({"repeatCell": {
            "range": pp.rango(gid, r1, r2, c1, c2),
            "cell": {"userEnteredFormat": {"numberFormat": eur}},
            "fields": "userEnteredFormat.numberFormat"}})
    # un desvío por encima del presupuesto se pinta solo
    p.append({"addConditionalFormatRule": {"rule": {
        "ranges": [pp.rango(gid, R_EMP1, R_PERT, 5, 6)],
        "booleanRule": {
            "condition": {"type": "NUMBER_GREATER",
                          "values": [{"userEnteredValue": "0"}]},
            "format": {"backgroundColor": {"red": 0.99, "green": 0.85,
                                           "blue": 0.84}}}}, "index": 0}})
    return p


if __name__ == "__main__":
    gid = construir()
    print(f"hoja creada · gid {gid}")
