#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construye el modelo financiero y de tesorería de Qualivo a 12 meses.

Pestañas: CONTROL TOWER · INPUTS · DEUDA · FUNNEL · PLAN 12 MESES · CAPITAL · ESCENARIOS

Tres reglas aprendidas a base de romperlo, y que este módulo respeta siempre:

  1. La configuración regional del Sheet es española: **el separador de argumentos
     de las fórmulas es `;`, no `,`**. Con coma, toda fórmula con más de un
     argumento devuelve #ERROR!.
  2. **Nunca un decimal literal dentro de una fórmula.** `PMT(0.07/12;...)` falla;
     `PMT(B5/12;...)` funciona. Además es lo correcto en un modelo: todo número
     que se pueda tocar vive en una celda de entrada.
  3. Los valores se escriben con **RAW** y las fórmulas con **USER_ENTERED**, en
     llamadas separadas y acotadas al rango exacto. Un PUT de rejilla completa con
     celdas vacías borra lo que ya había.

Uso:  python3 dashboard/modelo_financiero.py
"""
import json, time, urllib.request, urllib.parse

CRED  = "/root/.claude/uploads/9036eb51-d77c-5ec5-9939-d4419e0760a9/7db8a765-kineticdream377917c17cfe8d7008.json"
SHEET = "1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0"
BASE  = "https://sheets.googleapis.com/v4/spreadsheets/"

MESES = ['oct-26','nov-26','dic-26','ene-27','feb-27','mar-27',
         'abr-27','may-27','jun-27','jul-27','ago-27','sep-27']
N = 12


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
    """La API de Sheets permite 60 escrituras por minuto. Al construir el modelo
    se superan con facilidad, así que el 429 se reintenta con espera creciente."""
    import urllib.error
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
    """Escribe en una pestaña separando valores (RAW) de fórmulas (USER_ENTERED)."""

    def __init__(self, tok, titulo, filas=200, cols=40):
        self.tok, self.t = tok, titulo
        meta = api("GET", SHEET + "?fields=sheets.properties(title,sheetId)", tok)
        h = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
        if titulo in h:
            api("POST", SHEET + ":batchUpdate", tok, {"requests": [{"deleteSheet": {"sheetId": h[titulo]}}]})
        r = api("POST", SHEET + ":batchUpdate", tok, {"requests": [{"addSheet": {"properties": {
            "title": titulo, "gridProperties": {"rowCount": filas, "columnCount": cols}}}}]})
        self.gid = r["replies"][0]["addSheet"]["properties"]["sheetId"]

    def _q(self, rng):
        return SHEET + "/values/" + urllib.parse.quote(f"'{self.t}'!{rng}")

    def val(self, rng, vals):
        """Valores literales. Nunca interpreta: 'oct-26' se queda como texto."""
        api("PUT", self._q(rng) + "?valueInputOption=RAW", self.tok, {"values": vals})

    def fx(self, rng, vals):
        """Fórmulas. Recordatorio: separador `;` y sin decimales literales."""
        api("PUT", self._q(rng) + "?valueInputOption=USER_ENTERED", self.tok, {"values": vals})

    def lote(self, bloques, modo="USER_ENTERED"):
        """Escribe muchos rangos en UNA llamada. Imprescindible: una llamada por
        celda agota la cuota de la API (HTTP 429) en cuanto el modelo crece."""
        api("POST", SHEET + "/values:batchUpdate", self.tok, {
            "valueInputOption": modo,
            "data": [{"range": f"'{self.t}'!{r}", "values": v} for r, v in bloques]})

    def leer(self, rng):
        return api("GET", self._q(rng) + "?valueRenderOption=UNFORMATTED_VALUE", self.tok).get("values", [])


# ---------------------------------------------------------------- INPUTS ----
def inputs(tok):
    """Todas las hipótesis editables. Es la única pestaña donde se escriben números a mano."""
    h = Hoja(tok, "INPUTS", filas=100, cols=16)
    h.val("A1", [["INPUTS · todas las hipótesis del modelo"],
                 ["Edita solo las celdas azules. Lo demás son fórmulas."],
                 ["LEYENDA:  🔵 hipótesis editable   ·   ⚪ dato real   ·   🟡 pendiente de validar   ·   ⚙️ calculado"]])

    h.val("A5", [["FINANCIACIÓN"]])
    h.val("A6", [
        ["Capital", 25000, "🔵", "escenario inicial: 25.000 €"],
        ["TIN (anual)", 0.07, "🟡", "PENDIENTE: condiciones reales sin confirmar"],
        ["TAE (anual)", "", "🟡", "PENDIENTE"],
        ["Plazo (meses)", 60, "🟡", "PENDIENTE"],
        ["Comisión de apertura (%)", 0, "🟡", "PENDIENTE"],
        ["Mes de inicio (1 = oct-26)", 1, "🔵", ""],
        ["Titular del préstamo", "Padre de Maikel", "🟡", "PENDIENTE de confirmar. La cuota es obligación del plan igual"],
    ])
    h.val("A13", [["Cuota mensual", "", "⚙️", "calculada con PMT"],
                  ["Comisión en €", "", "⚙️", ""],
                  ["Intereses totales", "", "⚙️", ""],
                  ["Total a devolver", "", "⚙️", ""]])
    h.fx("B13", [["=IF(B6>0;ROUND(-PMT(B7/12;B9/1;B6);2);0)"], ["=ROUND(B6*B10;2)"],
                 ["=ROUND(B13*B9-B6;2)"], ["=ROUND(B13*B9;2)"]])

    h.val("A19", [["CAPTACIÓN · presupuesto mensual (€)"]])
    h.val("B20", [MESES])
    h.val("B21", [[1200, 1200, 1200, 0, 0, 0, 0, 0, 0, 0, 0, 0]])
    h.val("A21", [["Presupuesto"]])
    h.val("A22", [["Desde enero es 0 a propósito: cada mes es una decisión, no un automatismo."]])

    h.val("A24", [["FUNNEL COMERCIAL"]])
    h.val("A25", [["Escenario activo", "BASE", "🔵", "PRUDENTE / BASE / ACELERADO"]])
    h.val("A27", [["Métrica", "PRUDENTE", "BASE", "ACELERADO", "ACTIVO", "", "Origen"]])
    h.val("A28", [
        ["Coste por lead (€)",        18,   12.77, 10,    "", "", "⚪ 12,77 € real de septiembre"],
        ["% lead cualificado (A/B)",  0.25, 0.35,  0.45,  "", "", "🟡 sin verificar en CRM"],
        ["% cualificado → cita",      0.25, 0.40,  0.55,  "", "", "⚪ 44 % real (15 de 34)"],
        ["Show rate",                 0.45, 0.56,  0.70,  "", "", "⚪ 56 % real (5 de 9)"],
        ["% reunión → propuesta",     0.30, 0.45,  0.60,  "", "", "⚪ 44 % real (4 de 9)"],
        ["Close rate (propuesta→cliente)", 0.10, 0.20, 0.30, "", "", "🟡 HIPÓTESIS · real hoy 0 de 9"],
    ])
    h.fx("E28", [[f'=IF($B$25="PRUDENTE";B{r};IF($B$25="BASE";C{r};D{r}))'] for r in range(28, 34)])
    h.val("A34", [["El close rate desde publicidad NO está validado: hoy son 0 cierres de 9 reuniones."]])

    h.val("A36", [["CLIENTES"]])
    h.val("A37", [
        ["MRR inicial (€)", 1010.87, "⚪", "EAC 480,87 + Eleva 530"],
        ["Clientes activos hoy", 2, "⚪", "EAC y Eleva"],
        ["Ticket medio (€/mes)", 1093, "⚪", "media real de 35 clientes desde 2025"],
        ["Setup medio por cliente (€)", 0, "🔵", "0 por defecto: no hay dato fiable"],
        ["Churn mensual (%)", 0.27, "⚪", "1 ÷ 3,7 meses de duración media real"],
        ["Duración media objetivo (meses)", 12, "🎯", "OBJETIVO del plan a 12 meses"],
        ["Proyectos puntuales (€/mes)", 0, "🔵", "no recurrente, se presupone 0"],
        ["Nómina Equipzilla (€/mes)", 2850, "⚪", "ingreso del hogar. Sube de 2.040 a 2.850 en octubre"],
        ["Cobros puntuales oct (€)", 1028.50, "⚪", "Adigital, factura emitida y vencida el 10-oct"],
        ["Cobros puntuales nov (€)", 1200, "🟡", "Scubalight · SIN FACTURAR todavía"],
    ])

    h.val("A48", [["EQUIPO"]])
    h.val("A49", [
        ["Comercial · seguimiento (€/mes)", 500, "🔵", ""],
        ["Comercial · desde el mes", 1, "🔵", "1 = oct-26"],
        ["Comercial · número de meses", 6, "🔵", "oct → mar"],
        ["PM / Client Success (€/mes)", 1200, "🔵", ""],
        ["PM · trigger de MRR (€)", 5000, "🔵", ""],
        ["PM · trigger de clientes", 5, "🔵", ""],
        ["PM · mes de contratación (0 = no)", 0, "🔵", "MANUAL. El trigger avisa, no contrata"],
        ["Especialistas / colaboradores (€/mes)", 0, "🔵", ""],
    ])

    h.val("A58", [["COSTES FIJOS"]])
    h.val("A59", [
        ["Claude (Anthropic)", 180, "⚪", ""], ["GoHighLevel (CRM)", 107, "⚪", ""],
        ["Smartlead", 100, "⚪", ""], ["n8n (Paddle)", 73, "⚪", ""],
        ["HeyReach", 62, "⚪", ""], ["Google Workspace", 56, "⚪", ""],
        ["ChatGPT", 23, "⚪", ""], ["Vapi (créditos)", 22, "⚪", ""],
        ["Vercel", 21, "⚪", ""], ["Otro software", 0, "🔵", ""],
    ])
    h.val("A69", [["TOTAL SOFTWARE", "", "⚙️", ""]])
    h.fx("B69", [["=SUM(B59:B68)"]])
    h.val("A70", [["Cuota de autónomos", 330, "⚪", ""],
                  ["Vodafone (móvil y fibra)", 101, "⚪", ""],
                  ["Otros de estructura", 0, "🔵", ""]])
    h.val("A73", [["TOTAL ESTRUCTURA", "", "⚙️", ""]])
    h.fx("B73", [["=SUM(B70:B72)"]])
    h.val("A74", [["Gastos personales de Maikel", 1780, "⚪", "vivienda, comida, ocio, salud"]])

    h.val("A76", [["IMPUESTOS · vencimientos previstos (€)"]])
    h.val("B77", [MESES])
    h.val("A78", [["Pagos"]])
    h.val("B78", [[1142, 0, 0, 1150, 0, 0, 1150, 0, 0, 1150, 0, 0]])
    h.val("A79", [["Reserva fiscal inicial (€)", 6900, "🔵", "se aparta el día 1 y no se toca"]])
    h.val("A80", [["El IVA del 3T (1.142 €) es real, calculado en Quipu. El resto son estimados."]])
    h.val("A81", [["🟡 PENDIENTE: el IRPF de 1.165 € del 5-oct no aparece en la AEAT. Sin resolver."]])

    h.val("A83", [["CAJA"]])
    h.val("A84", [["Caja bancaria hoy (€)", 800, "⚪", "29-sep · las cinco huchas, vacías"]])

    h.val("A86", [["POLÍTICA DE REINVERSIÓN · del cash flow positivo"]])
    h.val("A87", [["% a reserva", 0.30, "🔵", ""], ["% a amortizar deuda", 0.30, "🔵", ""],
                  ["% a captación", 0.25, "🔵", ""], ["% a equipo", 0.15, "🔵", ""]])
    h.val("A91", [["SUMA", "", "⚙️", "tiene que dar 100 %"]])
    h.fx("B91", [["=SUM(B87:B90)"]])
    return h


# ----------------------------------------------------------------- DEUDA ----
def deuda(tok):
    """Inventario de deuda con interruptor de cancelación por deuda.

    La matriz de abajo es la que lee PLAN: para cada mes calcula qué cuotas
    siguen vivas, descontando las ya vencidas y las canceladas a mano.
    """
    h = Hoja(tok, "DEUDA", filas=60, cols=22)
    h.val("A1", [["DEUDA · inventario y plan de cancelación"],
                 ["Cambia «Cancelar» a SÍ y pon el mes: el capital sale de la caja ese mes y la cuota desaparece a partir del siguiente."]])
    h.val("A4", [["Deuda", "Saldo pendiente", "Cuota/mes", "TIN/TAE", "Último mes con cuota",
                  "Tipo", "Prioridad", "Cancelar", "Mes cancelación", "Capital necesario",
                  "Cuota liberada", "Libera por 100 €", "Notas"]])
    # mes 1 = oct-26 … mes 12 = sep-27. 13 o más = sigue viva más allá del modelo.
    D = [
        ["Tarjeta crédito BBVA",        930.89, 36.00, 0.20,  99, "Tarjeta",  1, "SÍ", 1, "", "", "", "⚪ dispuesto real 29-sep · la deuda más cara"],
        ["IVA 4T 2025 (aplazado)",     1597.08, 240.00, 0.04,  7, "Hacienda", 2, "NO", "", "", "", "", "⚪ AEAT 29-sep · se extingue sola en abr-27"],
        ["Renta 2025 IRPF (aplazada)", 7333.74, 607.76, 0.04, 13, "Hacienda", 3, "NO", "", "", "", "", "⚪ AEAT 29-sep · se extingue sola en oct-27"],
        ["IVA 2T 2026 (aplazado)",     3789.82, 313.00, 0.04, 13, "Hacienda", 4, "NO", "", "", "", "", "⚪ AEAT 29-sep · se extingue sola en oct-27"],
        ["Ordenador (financiación)",    800.00,  66.00, "",   99, "Consumo",  5, "NO", "", "", "", "", "🟡 SALDO ESTIMADO · pendiente de confirmar"],
        ["Younited",                   1300.00,  96.86, "",   99, "Consumo",  6, "NO", "", "", "", "", "🟡 SALDO ESTIMADO · pendiente de confirmar"],
        ["Préstamo 2 empresa BBVA",    8213.76, 308.31, "",   99, "Banco",    7, "NO", "", "", "", "", "⚪ saldo real 29-sep · vence ene-2029"],
        ["Micro préstamo CaixaBank",   6589.88, 240.00, 0.00, 99, "Banco",    8, "NO", "", "", "", "", "⚪ BONIFICADO, casi 0 % · NUNCA cancelar"],
        ["Préstamo coche BBVA",       13667.10, 339.62, "",   99, "Banco",    9, "NO", "", "", "", "", "⚪ saldo real 29-sep · el peor ratio de la lista"],
    ]
    h.val("A5", D)
    h.fx("J5", [[f'=IF($H{r}="SÍ";$B{r};0)', f'=IF($H{r}="SÍ";$C{r};0)',
                 f'=IF($B{r}>0;ROUND($C{r}/$B{r}*100;1);0)'] for r in range(5, 14)])
    h.val("A14", [["TOTAL", "", "", "", "", "", "", "", "", "", "", ""]])
    h.fx("B14", [["=SUM(B5:B13)", "=SUM(C5:C13)"]])
    h.fx("J14", [["=SUM(J5:J13)", "=SUM(K5:K13)"]])

    h.val("A17", [["MATRIZ MENSUAL · lo que lee PLAN 12 MESES"],
                  ["Cuota viva de cada deuda en cada mes: cero si ya venció o si se canceló."]])
    h.val("B20", [MESES]); h.val("A20", [["Deuda"]])
    for i, row in enumerate(D):
        h.val(f"A{21+i}", [[row[0]]])
    # viva = el mes no supera el último mes con cuota  Y  (no cancelada o aún no llegó la cancelación)
    for i in range(9):
        r = 5 + i
        h.fx(f"B{21+i}", [[f'=IF(AND(B$20<=$E${r};OR($H${r}<>"SÍ";B$20<$I${r}+1));$C${r};0)'
                           .replace("B$20", f"{chr(66+c)}$19") for c in range(N)]])
    h.val("A19", [["(índice de mes)"]])
    h.val("B19", [[i + 1 for i in range(N)]])
    h.val("A30", [["TOTAL CUOTAS DEL MES"]])
    h.fx("B30", [[f"=SUM({chr(66+c)}21:{chr(66+c)}29)" for c in range(N)]])
    h.val("A31", [["CAPITAL AMORTIZADO EN EL MES"]])
    h.fx("B31", [[f'=SUMIF($I$5:$I$13;{chr(66+c)}$19;$J$5:$J$13)' for c in range(N)]])
    h.val("A32", [["CUOTA LIBERADA ACUMULADA"]])
    h.fx("B32", [[f'=$C$14-{chr(66+c)}30' for c in range(N)]])
    h.val("A34", [["Regla del modelo: el micro de CaixaBank y el coche no se cancelan nunca."],
                  ["El micro está bonificado (casi 0 %) y el coche libera 2,5 € por cada 100 pagados."]])
    return h


# ---------------------------------------------------------------- FUNNEL ----
def funnel(tok):
    """De euros invertidos a clientes nuevos. Todo cuelga del escenario de INPUTS."""
    h = Hoja(tok, "FUNNEL", filas=40, cols=16)
    h.val("A1", [["FUNNEL COMERCIAL · de la inversión al cliente"],
                 ["Cambia el escenario en INPUTS!B25 (PRUDENTE / BASE / ACELERADO) y toda la tabla se mueve."],
                 ["", "El close rate es una HIPÓTESIS: hoy son 0 cierres de 9 reuniones celebradas."]])
    h.val("A5", [["Escenario activo"]]); h.fx("B5", [["=INPUTS!B25"]])
    h.val("B7", [MESES]); h.val("A7", [["Etapa"]])
    FILAS = ["Inversión en captación (€)", "Leads", "Leads cualificados (A/B)", "Citas agendadas",
             "Reuniones celebradas", "Propuestas enviadas", "CLIENTES NUEVOS", "MRR nuevo (€)",
             "Coste por reunión celebrada (€)", "CAC · coste por cliente (€)"]
    h.val("A8", [[f] for f in FILAS])
    C = [chr(66 + i) for i in range(N)]
    h.fx("B8",  [[f"=INPUTS!{c}21" for c in C]])
    h.fx("B9",  [[f"=IF(INPUTS!$E$28>0;{c}8/INPUTS!$E$28;0)" for c in C]])
    h.fx("B10", [[f"={c}9*INPUTS!$E$29" for c in C]])
    h.fx("B11", [[f"={c}10*INPUTS!$E$30" for c in C]])
    h.fx("B12", [[f"={c}11*INPUTS!$E$31" for c in C]])
    h.fx("B13", [[f"={c}12*INPUTS!$E$32" for c in C]])
    h.fx("B14", [[f"={c}13*INPUTS!$E$33" for c in C]])
    h.fx("B15", [[f"={c}14*INPUTS!$B$39" for c in C]])
    h.fx("B16", [[f'=IFERROR({c}8/{c}12;0)' for c in C]])
    h.fx("B17", [[f'=IFERROR({c}8/{c}14;0)' for c in C]])
    h.val("A19", [["TOTAL 12 MESES"]])
    h.fx("B19", [["=SUM(B8:M8)", "=SUM(B14:M14)", "=IFERROR(B19/C19;0)"]])
    h.val("B20", [["invertido", "clientes", "CAC medio"]])
    return h


# --------------------------------------------------------- PLAN 12 MESES ----
def plan(tok):
    """El modelo mes a mes. Ninguna celda de resultado está escrita a mano."""
    h = Hoja(tok, "PLAN 12 MESES", filas=40, cols=32)
    h.val("A1", [["PLAN 12 MESES · octubre 2026 → septiembre 2027"],
                 ["Todo son fórmulas. Para cambiar el plan, edita INPUTS o DEUDA."]])
    CAB = ["Mes", "Caja inicial", "Financiación", "MRR inicial", "Clientes iniciales",
           "Captación", "Leads", "Reuniones", "Clientes nuevos", "MRR nuevo", "MRR perdido",
           "MRR final", "Setup", "Proyectos", "FACTURACIÓN", "Comercial", "PM", "Software",
           "Estructura", "Cuotas deuda", "Cuota financiación", "Amortización", "Impuestos",
           "TOTAL GASTOS", "CASH FLOW", "CAJA FINAL", "Reserva fiscal", "CAJA OPERATIVA LIBRE",
           "Runway (meses)", "Clientes finales"]
    h.val("A4", [CAB])
    h.val("A5", [[m] for m in MESES])
    COL = {k: [] for k in ["B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q",
                           "R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD"]}
    for i in range(N):
        r, p, c = 5 + i, 4 + i, chr(66 + i)
        COL["B"].append("=INPUTS!$B$84" if i == 0 else f"=Z{p}")
        COL["C"].append(f'=IF({r}-4=INPUTS!$B$11;INPUTS!$B$6-INPUTS!$B$14;0)')
        COL["D"].append("=INPUTS!$B$37" if i == 0 else f"=L{p}")
        COL["E"].append("=INPUTS!$B$38" if i == 0 else f"=AD{p}")
        COL["F"].append(f"=FUNNEL!{c}8");  COL["G"].append(f"=FUNNEL!{c}9")
        COL["H"].append(f"=FUNNEL!{c}12"); COL["I"].append(f"=FUNNEL!{c}14")
        COL["J"].append(f"=I{r}*INPUTS!$B$39"); COL["K"].append(f"=D{r}*INPUTS!$B$41")
        COL["L"].append(f"=D{r}+J{r}-K{r}");    COL["M"].append(f"=I{r}*INPUTS!$B$40")
        COL["N"].append("=INPUTS!$B$43")
        pun = "+INPUTS!$B$45" if i == 0 else ("+INPUTS!$B$52x" if i == 1 else "")
        COL["O"].append(f"=L{r}+M{r}+N{r}+INPUTS!$B$44" + ("+INPUTS!$B$45" if i == 0 else ""))
        COL["P"].append(f'=IF(AND({r}-4>=INPUTS!$B$50;{r}-4<INPUTS!$B$50+INPUTS!$B$51);INPUTS!$B$49;0)')
        COL["Q"].append(f'=IF(AND(INPUTS!$B$55>0;{r}-4>=INPUTS!$B$55);INPUTS!$B$52;0)')
        COL["R"].append("=INPUTS!$B$69"); COL["S"].append("=INPUTS!$B$73+INPUTS!$B$74")
        COL["T"].append(f"=DEUDA!{c}30")
        COL["U"].append(f'=IF({r}-4>=INPUTS!$B$11;INPUTS!$B$13;0)')
        COL["V"].append(f"=DEUDA!{c}31"); COL["W"].append(f"=INPUTS!{c}78")
        COL["X"].append(f"=F{r}+P{r}+Q{r}+R{r}+S{r}+T{r}+U{r}+V{r}+W{r}")
        COL["Y"].append(f"=O{r}+C{r}-X{r}"); COL["Z"].append(f"=B{r}+Y{r}")
        COL["AA"].append("=IF(C5>0;INPUTS!$B$79;0)" if i == 0
                         else f"=MAX(0;AA{p}-W{p}+IF(C{r}>0;INPUTS!$B$79;0))")
        COL["AB"].append(f"=Z{r}-AA{r}")
        COL["AC"].append(f'=IFERROR(IFS(AB{r}<=0;"SIN CAJA";Y{r}>=0;"no se agota";TRUE;ROUND(AB{r}/-Y{r};1));"nd")')
        COL["AD"].append(f"=E{r}+I{r}-E{r}*INPUTS!$B$41")
    h.lote([(f"{k}5", [[x] for x in v]) for k, v in COL.items()])
    h.val("A18", [["TOTAL / FIN"]])
    h.fx("F18", [["=SUM(F5:F16)"]])
    h.fx("I18", [["=SUM(I5:I16)"]])
    h.fx("O18", [["=SUM(O5:O16)"]])
    h.fx("X18", [["=SUM(X5:X16)"]])
    h.fx("Y18", [["=SUM(Y5:Y16)"]])
    h.fx("L18", [["=L16"]]); h.fx("Z18", [["=Z16"]]); h.fx("AB18", [["=AB16"]]); h.fx("AD18", [["=AD16"]])
    h.val("A20", [["Nota: la facturación se cobra en el mes. Es una simplificación; el desfase real de cobro es de 8 a 15 días."]])
    return h


# --------------------------------------------------------------- CAPITAL ----
def capital(tok):
    """Dónde está cada euro del préstamo, hoy y mes a mes."""
    h = Hoja(tok, "CAPITAL", filas=40, cols=18)
    h.val("A1", [["MOVIMIENTO DEL CAPITAL · ¿dónde está el dinero?"],
                 ["Responde en cualquier momento: de los 25.000 € iniciales, cuánto queda y en qué bolsa."]])
    h.val("A4", [["Concepto", "Importe", "Nota"]])
    h.val("A5", [["Financiación recibida", "", "capital menos comisión de apertura"],
                 ["− Reserva fiscal", "", "se aparta el día 1 y no se toca"],
                 ["− Cancelación de deuda", "", "lo que marques como «Cancelar = SÍ» en DEUDA"],
                 ["− Captación comprometida", "", "suma del presupuesto de los 12 meses"],
                 ["− Comercial comprometido", "", "coste mensual × meses"],
                 ["= Caja libre al empezar", "", "lo que queda sin asignar"]])
    h.fx("B5", [["=INPUTS!B6-INPUTS!B14"], ["=-INPUTS!B79"], ["=-DEUDA!J14"],
                ["=-SUM(INPUTS!B21:M21)"], ["=-INPUTS!B49*INPUTS!B51"], ["=SUM(B5:B9)"]])
    h.val("A12", [["LAS BOLSAS, MES A MES"]])
    h.val("B13", [MESES]); h.val("A13", [["Bolsa"]])
    h.val("A14", [["Reserva fiscal"], ["Caja bancaria total"], ["Caja operativa libre"],
                  ["Captación gastada (acumulada)"], ["Comercial gastado (acumulado)"],
                  ["Cuotas de deuda pagadas (acum.)"]])
    C = [chr(66 + i) for i in range(N)]
    h.fx("B14", [[f"='PLAN 12 MESES'!{c}{5+i}" for i, c in enumerate(['AA'] * N)]])
    h.lote([("B14", [[f"='PLAN 12 MESES'!AA{5+i}" for i in range(N)]]),
            ("B15", [[f"='PLAN 12 MESES'!Z{5+i}" for i in range(N)]]),
            ("B16", [[f"='PLAN 12 MESES'!AB{5+i}" for i in range(N)]]),
            ("B17", [[f"=SUM('PLAN 12 MESES'!$F$5:F{5+i})" for i in range(N)]]),
            ("B18", [[f"=SUM('PLAN 12 MESES'!$P$5:P{5+i})" for i in range(N)]]),
            ("B19", [[f"=SUM('PLAN 12 MESES'!$T$5:T{5+i})+SUM('PLAN 12 MESES'!$U$5:U{5+i})" for i in range(N)]])])
    h.val("A21", [["La caja bancaria total NO es dinero disponible: dentro va la reserva fiscal."],
                  ["La cifra que manda es la caja operativa libre."]])
    return h


# ------------------------------------------------------------ ESCENARIOS ----
def escenarios(tok):
    """Comparativa de los tres escenarios y el test de esfuerzo de cero ventas."""
    h = Hoja(tok, "ESCENARIOS", filas=50, cols=14)
    h.val("A1", [["ESCENARIOS Y TEST DE ESFUERZO"],
                 ["Los tres escenarios se calculan con los parámetros de INPUTS!B28:D33, sin tocar nada."]])
    h.val("A4", [["Métrica", "PRUDENTE", "BASE", "ACELERADO", "Fuente"]])
    h.val("A5", [["Coste por lead (€)", "", "", "", "INPUTS fila 28"],
                 ["Conversión total lead → cliente", "", "", "", "producto de las cinco tasas"],
                 ["CAC · coste por cliente (€)", "", "", "", "CPL ÷ conversión"],
                 ["Clientes nuevos en 12 meses", "", "", "", "con el presupuesto de captación actual"],
                 ["MRR añadido (€)", "", "", "", "clientes × ticket medio"],
                 ["Meses de payback del CAC", "", "", "", "CAC ÷ ticket medio"]])
    for j, col in enumerate("BCD"):
        h.lote([(f"{col}5", [[f"=INPUTS!{col}28"],
                             [f"=INPUTS!{col}29*INPUTS!{col}30*INPUTS!{col}31*INPUTS!{col}32*INPUTS!{col}33"],
                             [f"=IFERROR({col}5/{col}6;0)"],
                             [f"=IFERROR(SUM(INPUTS!B21:M21)/{col}7;0)"],
                             [f"={col}8*INPUTS!$B$39"],
                             [f"=IFERROR({col}7/INPUTS!$B$39;0)"]])])
    h.val("A13", [["TEST DE ESFUERZO · CERO CLIENTES NUEVOS"],
                  ["La línea roja: invertimos en captación, pagamos comercial y deuda, y no entra nadie."]])
    h.val("B15", [MESES]); h.val("A15", [["Concepto"]])
    h.val("A16", [["MRR (solo churn, sin altas)"], ["Facturación"], ["Gastos"],
                  ["Cash flow"], ["Caja operativa libre"]])
    h.lote([("B16", [[("=INPUTS!$B$37" if i == 0 else f"={chr(65+i)}16*(1-INPUTS!$B$41)") for i in range(N)]]),
            ("B17", [[f"={chr(66+i)}16+INPUTS!$B$44" + ("+INPUTS!$B$45" if i == 0 else "") for i in range(N)]]),
            ("B18", [[f"='PLAN 12 MESES'!X{5+i}" for i in range(N)]]),
            ("B19", [[f"={chr(66+i)}17+IF({i+1}=INPUTS!$B$11;INPUTS!$B$6-INPUTS!$B$14;0)-{chr(66+i)}18" for i in range(N)]]),
            ("B20", [[("=INPUTS!$B$84+B19-INPUTS!$B$79" if i == 0 else f"={chr(65+i)}20+{chr(66+i)}19")
                      for i in range(N)]])])
    h.val("A22", [["Mes en que la caja operativa llega a cero"]])
    h.fx("B22", [['=IFERROR(INDEX(B15:M15;MATCH(TRUE;B20:M20<0;0));"no se agota en 12 meses")']])
    return h


# --------------------------------------------------------- CONTROL TOWER ----
def torre(tok):
    """La primera pestaña: lo que hay que mirar un lunes por la mañana."""
    h = Hoja(tok, "QUALIVO · CONTROL TOWER", filas=70, cols=14)
    h.val("A1", [["QUALIVO · FINANCIAL CONTROL TOWER"],
                 ["Modelo a 12 meses · oct-26 → sep-27. Para cambiar el plan, edita INPUTS o DEUDA."]])
    h.val("A4", [["HOY"]])
    h.val("A5", [["Caja bancaria total", "", "Reserva fiscal HOY", "", "Caja operativa libre", ""],
                 ["MRR", "", "Clientes activos", "", "Ticket medio", ""],
                 ["Deuda total", "", "Cuotas de deuda al mes", "", "Cuota del préstamo nuevo", ""]])
    h.lote([("B5", [["=INPUTS!B84"]]), ("D5", [["=0"]]), ("F5", [["=INPUTS!B84"]]),
            ("B6", [["=INPUTS!B37"]]), ("D6", [["=INPUTS!B38"]]), ("F6", [["=INPUTS!B39"]]),
            ("B7", [["=DEUDA!B14"]]), ("D7", [["=DEUDA!C14"]]), ("F7", [["=INPUTS!B13"]])])
    h.val("A9", [["ESTE MES (oct-26)"]])
    h.val("A10", [["Facturación", "", "Gastos", "", "Cash flow", ""],
                  ["Captación", "", "Clientes nuevos", "", "MRR nuevo", ""]])
    h.lote([("B10", [["='PLAN 12 MESES'!O5"]]), ("D10", [["='PLAN 12 MESES'!X5"]]),
            ("F10", [["='PLAN 12 MESES'!Y5"]]), ("B11", [["='PLAN 12 MESES'!F5"]]),
            ("D11", [["='PLAN 12 MESES'!I5"]]), ("F11", [["='PLAN 12 MESES'!J5"]])])
    h.val("A13", [["A 12 MESES (sep-27)"]])
    h.val("A14", [["MRR mes 12", "", "Caja operativa libre", "", "Clientes activos", ""],
                  ["Facturación acumulada", "", "Deuda pendiente", "", "Mes en que la caja llega a 0", ""]])
    h.lote([("B14", [["='PLAN 12 MESES'!L16"]]), ("D14", [["='PLAN 12 MESES'!AB16"]]),
            ("F14", [["='PLAN 12 MESES'!AD16"]]), ("B15", [["='PLAN 12 MESES'!O18"]]),
            ("D15", [["=DEUDA!B14-DEUDA!J14+INPUTS!B6"]]),
            ("F15", [['=IFERROR(INDEX(\'PLAN 12 MESES\'!A5:A16;MATCH(TRUE;\'PLAN 12 MESES\'!AB5:AB16<0;0));"no se agota")']])])
    h.val("A8", [["⚠️ Las huchas están a cero. La reserva fiscal de 6.900 € se crea el día que entre la financiación, no antes."]])
    h.val("A17", [["ALERTAS"]])
    AL = [["Caja operativa por debajo de 5.000 €", "", "umbral de seguridad"],
          ["Runway por debajo de 3 meses", "", "en el mes actual"],
          ["CAC por encima de 3 meses de ticket", "", "payback demasiado largo"],
          ["Close rate sin validar", "", "hoy son 0 cierres de 9 reuniones"],
          ["Churn por encima del 15 % mensual", "", "duración media menor de 7 meses"],
          ["El MRR cae respecto al mes anterior", "", ""],
          ["Se intenta contratar PM demasiado pronto", "", "trigger: MRR ≥ 5.000 € o 5 clientes"],
          ["La reinversión no suma 100 %", "", ""]]
    h.val("A18", AL)
    h.lote([("B18", [
        ['=IF(F5<5000;"🔴 SÍ";"🟢 no")'],
        ['=IF(N(\'PLAN 12 MESES\'!AC5)>0;IF(N(\'PLAN 12 MESES\'!AC5)<3;"🔴 SÍ";"🟢 no");"⚠️ revisar")'],
        ['=IF(ESCENARIOS!C7>INPUTS!B39*3;"🟠 SÍ";"🟢 no")'],
        ['=IF(INPUTS!E33>0;"🟠 HIPÓTESIS";"🟢 validado")'],
        ['=IF(INPUTS!B41>1/7;"🔴 SÍ · duración "&ROUND(1/INPUTS!B41;1)&" meses";"🟢 no")'],
        ['=IF(\'PLAN 12 MESES\'!L6<\'PLAN 12 MESES\'!L5;"🟠 SÍ";"🟢 no")'],
        ['=IF(INPUTS!B55>0;IF(INDIRECT("\'PLAN 12 MESES\'!L"&(4+INPUTS!B55))<INPUTS!B53;"🔴 SÍ";"🟢 no");"🟢 no")'],
        ['=IF(ROUND(INPUTS!B91;4)<>1;"🔴 SÍ";"🟢 no")']])])
    h.val("A28", [["STAGE GATES · las seis preguntas que decide este modelo"]])
    G = [["GATE 1 · ¿La captación genera clientes?", "", "al menos 1 cliente en los 3 primeros meses"],
         ["GATE 2 · ¿El CAC y el payback son aceptables?", "", "payback por debajo de 3 meses de ticket"],
         ["GATE 3 · ¿MRR ≥ 5.000 €?", "", "objetivo del plan a 12 meses"],
         ["GATE 4 · ¿Hace falta ya un PM?", "", "MRR ≥ 5.000 € o 5 clientes activos"],
         ["GATE 5 · ¿Podemos escalar la captación?", "", "caja libre > 10.000 € y gate 1 superado"],
         ["GATE 6 · ¿Podemos amortizar más deuda?", "", "caja libre > 15.000 €"]]
    h.val("A29", G)
    h.lote([("B29", [
        ['=IF(SUM(\'PLAN 12 MESES\'!I5:I7)>=1;"✅ SÍ";"❌ todavía no")'],
        ['=IF(ESCENARIOS!C10<3;"✅ SÍ";"❌ no")'],
        ['=IF(\'PLAN 12 MESES\'!L16>=5000;"✅ SÍ";"❌ no · falta "&TEXT(5000-\'PLAN 12 MESES\'!L16;"#,##0")&" €")'],
        ['=IF(OR(\'PLAN 12 MESES\'!L16>=INPUTS!B53;\'PLAN 12 MESES\'!AD16>=INPUTS!B54);"✅ recomendado";"❌ todavía no")'],
        ['=IF(AND(\'PLAN 12 MESES\'!AB5>10000;SUM(\'PLAN 12 MESES\'!I5:I7)>=1);"✅ SÍ";"❌ no")'],
        ['=IF(\'PLAN 12 MESES\'!AB5>15000;"✅ SÍ";"❌ no")']])])
    h.val("A36", [["Este modelo no predice. Ayuda a decidir: cada lunes se actualizan cinco números reales y las alertas y los gates responden solos."]])
    return h


# ---------------------------------------------------------------- FORMATO ---
def formato(tok, gids, dims=None):
    """Un solo batchUpdate por pestaña: el formato no consume cuota de escritura
    de valores, pero conviene agrupar igual."""
    C = lambda r, g, b: {"red": r, "green": g, "blue": b}
    VERDE, BLANCO, GRIS = C(.06, .42, .36), C(1, 1, 1), C(.47, .54, .52)
    AZUL, TINTA, ROJO = C(.09, .35, .55), C(.08, .13, .12), C(.64, .17, .14)
    EUR, PCT = '#,##0 "€"', "0.0%"
    req = []

    dims = dims or {}

    def R(g, r0, r1, c0, c1, **k):
        """Recorta siempre a las dimensiones reales: un rango que se sale
        devuelve HTTP 400 y tumba el batchUpdate entero."""
        mr, mc = dims.get(g, (1000, 40))
        r1, c1 = min(r1, mr), min(c1, mc)
        if r0 > r1 or c0 > c1:
            return None
        f = {"verticalAlignment": "MIDDLE", "padding": {"top": 2, "bottom": 2, "left": 8, "right": 8},
             "horizontalAlignment": k.get("ha", "LEFT"), "wrapStrategy": k.get("wrap", "CLIP")}
        if "bg" in k: f["backgroundColor"] = k["bg"]
        t = {"fontFamily": k.get("font", "Inter"), "fontSize": k.get("size", 10)}
        if k.get("bold"): t["bold"] = True
        if "fg" in k: t["foregroundColor"] = k["fg"]
        f["textFormat"] = t
        if "num" in k: f["numberFormat"] = {"type": "NUMBER", "pattern": k["num"]}
        return {"repeatCell": {"range": {"sheetId": g, "startRowIndex": r0 - 1, "endRowIndex": r1,
                                         "startColumnIndex": c0 - 1, "endColumnIndex": c1},
                               "cell": {"userEnteredFormat": f},
                               "fields": "userEnteredFormat(backgroundColor,textFormat,numberFormat,"
                                         "horizontalAlignment,wrapStrategy,verticalAlignment,padding)"}}

    def W(g, c0, c1, px):
        c1 = min(c1, dims.get(g, (1000, 40))[1])
        if c0 > c1:
            return None
        return {"updateDimensionProperties": {"range": {"sheetId": g, "dimension": "COLUMNS",
                "startIndex": c0 - 1, "endIndex": c1}, "properties": {"pixelSize": px}, "fields": "pixelSize"}}

    for nom, g in gids.items():
        req += [R(g, 1, 200, 1, 40, bg=BLANCO, fg=TINTA),
                R(g, 1, 1, 1, 40, bg=VERDE, fg=BLANCO, size=15, bold=True),
                R(g, 2, 3, 1, 40, fg=GRIS, size=10),
                {"updateDimensionProperties": {"range": {"sheetId": g, "dimension": "ROWS",
                 "startIndex": 0, "endIndex": 1}, "properties": {"pixelSize": 38}, "fields": "pixelSize"}}]

    g = gids["INPUTS"]
    req += [W(g, 1, 1, 300), W(g, 2, 2, 120), W(g, 3, 3, 40), W(g, 4, 4, 420), W(g, 5, 13, 92),
            R(g, 6, 92, 2, 2, bg=C(.88, .93, .99), fg=AZUL, bold=True, font="Roboto Mono", ha="RIGHT"),
            R(g, 3, 3, 1, 40, fg=GRIS, size=9),
            R(g, 20, 20, 2, 13, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER"),
            R(g, 21, 21, 2, 13, bg=C(.88, .93, .99), fg=AZUL, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 27, 27, 1, 7, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER"),
            R(g, 28, 33, 2, 4, bg=C(.88, .93, .99), fg=AZUL, font="Roboto Mono", ha="RIGHT"),
            R(g, 28, 33, 5, 5, bg=C(.92, .96, .94), fg=VERDE, bold=True, font="Roboto Mono", ha="RIGHT"),
            R(g, 29, 33, 2, 5, num=PCT, font="Roboto Mono", ha="RIGHT"),
            R(g, 77, 77, 2, 13, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER"),
            R(g, 78, 78, 2, 13, bg=C(.88, .93, .99), fg=AZUL, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 13, 16, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 69, 69, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 73, 73, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 91, 91, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, font="Roboto Mono", ha="RIGHT", num=PCT)]
    for r in (5, 19, 24, 36, 48, 58, 76, 83, 86):
        req.append(R(g, r, r, 1, 13, bg=C(.92, .95, .94), fg=VERDE, bold=True, size=11))

    g = gids["DEUDA"]
    req += [W(g, 1, 1, 230), W(g, 2, 12, 96), W(g, 13, 13, 340),
            R(g, 4, 4, 1, 13, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER", wrap="WRAP"),
            R(g, 5, 14, 2, 3, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 5, 13, 8, 8, bg=C(.99, .95, .82), bold=True, ha="CENTER"),
            R(g, 5, 13, 9, 9, bg=C(.99, .95, .82), ha="CENTER", font="Roboto Mono"),
            R(g, 5, 14, 10, 11, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 14, 14, 1, 12, bg=C(.93, .96, .95), bold=True),
            R(g, 20, 20, 2, 13, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER"),
            R(g, 21, 32, 2, 13, num=EUR, font="Roboto Mono", ha="RIGHT", size=9),
            R(g, 30, 32, 1, 13, bg=C(.93, .96, .95), bold=True, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 30, 32, 1, 1, bg=C(.93, .96, .95), bold=True, ha="LEFT", font="Inter"),
            R(g, 5, 13, 13, 13, size=9, fg=GRIS, wrap="WRAP")]

    for nom, cab, anchos in [("FUNNEL", 7, (300, 92)), ("CAPITAL", 13, (260, 100)),
                             ("ESCENARIOS", 4, (300, 110))]:
        g = gids[nom]
        req += [W(g, 1, 1, anchos[0]), W(g, 2, 14, anchos[1]),
                R(g, cab, cab, 1, 14, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER"),
                R(g, cab + 1, cab + 14, 2, 14, font="Roboto Mono", ha="RIGHT", num=EUR)]
    g = gids["FUNNEL"]
    req += [R(g, 14, 14, 1, 14, bg=C(.90, .96, .92), bold=True, font="Roboto Mono", ha="RIGHT", num="0.0"),
            R(g, 14, 14, 1, 1, bg=C(.90, .96, .92), bold=True, ha="LEFT", font="Inter"),
            R(g, 9, 13, 2, 14, num="0.0", font="Roboto Mono", ha="RIGHT")]
    g = gids["ESCENARIOS"]
    req += [R(g, 15, 15, 1, 14, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER"),
            R(g, 6, 6, 2, 4, num=PCT, font="Roboto Mono", ha="RIGHT"),
            R(g, 8, 8, 2, 4, num="0.0", font="Roboto Mono", ha="RIGHT"),
            R(g, 10, 10, 2, 4, num="0.0", font="Roboto Mono", ha="RIGHT"),
            R(g, 20, 20, 1, 14, bg=C(.90, .96, .92), bold=True, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 20, 20, 1, 1, bg=C(.90, .96, .92), bold=True, ha="LEFT", font="Inter")]

    g = gids["PLAN 12 MESES"]
    req += [W(g, 1, 1, 86), W(g, 2, 30, 94),
            R(g, 4, 4, 1, 30, bg=C(.13, .19, .17), fg=BLANCO, bold=True, size=9, ha="CENTER", wrap="WRAP"),
            {"updateDimensionProperties": {"range": {"sheetId": g, "dimension": "ROWS",
             "startIndex": 3, "endIndex": 4}, "properties": {"pixelSize": 54}, "fields": "pixelSize"}},
            R(g, 5, 18, 2, 30, font="Roboto Mono", ha="RIGHT", num=EUR, size=10),
            R(g, 5, 18, 1, 1, bold=True),
            R(g, 4, 4, 2, 15, bg=C(.10, .33, .26)), R(g, 4, 4, 16, 24, bg=C(.38, .16, .14)),
            R(g, 4, 4, 28, 28, bg=C(.06, .42, .36)),
            R(g, 5, 16, 15, 15, bg=C(.94, .98, .95), bold=True, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 5, 16, 24, 24, bg=C(.99, .95, .94), bold=True, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 5, 16, 28, 28, bg=C(.88, .95, .92), bold=True, size=11, num=EUR, font="Roboto Mono", ha="RIGHT"),
            R(g, 5, 16, 29, 29, ha="CENTER", font="Roboto Mono"),
            R(g, 5, 16, 5, 5, num="0.0", font="Roboto Mono", ha="RIGHT"),
            R(g, 5, 16, 7, 9, num="0.0", font="Roboto Mono", ha="RIGHT"),
            R(g, 5, 16, 30, 30, num="0.0", font="Roboto Mono", ha="RIGHT"),
            R(g, 18, 18, 1, 30, bg=C(.93, .96, .95), bold=True, num=EUR, font="Roboto Mono", ha="RIGHT"),
            {"updateSheetProperties": {"properties": {"sheetId": g, "gridProperties": {
                "frozenRowCount": 4, "frozenColumnCount": 1}},
             "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"}}]
    for rg_, c0, c1 in [(g, 26, 26), (g, 28, 28), (g, 25, 25)]:
        req.append({"addConditionalFormatRule": {"rule": {"ranges": [{"sheetId": g, "startRowIndex": 4,
            "endRowIndex": 16, "startColumnIndex": c0 - 1, "endColumnIndex": c1}],
            "booleanRule": {"condition": {"type": "NUMBER_LESS", "values": [{"userEnteredValue": "0"}]},
            "format": {"backgroundColor": C(.98, .87, .86), "textFormat": {"foregroundColor": ROJO, "bold": True}}}},
            "index": 0}})

    g = gids["QUALIVO · CONTROL TOWER"]
    req += [W(g, 1, 1, 330), W(g, 2, 2, 150), W(g, 3, 3, 210), W(g, 4, 4, 150), W(g, 5, 5, 210), W(g, 6, 6, 150),
            R(g, 5, 7, 2, 2, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 5, 7, 4, 4, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 5, 7, 6, 6, bg=C(.92, .96, .94), fg=VERDE, bold=True, size=14, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 10, 11, 2, 2, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 10, 11, 4, 4, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 10, 11, 6, 6, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 14, 15, 2, 2, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 14, 15, 4, 4, bold=True, font="Roboto Mono", ha="RIGHT", num=EUR),
            R(g, 14, 15, 6, 6, bold=True, font="Roboto Mono", ha="RIGHT"),
            R(g, 18, 25, 2, 2, bold=True, ha="LEFT"), R(g, 29, 34, 2, 2, bold=True, ha="LEFT"),
            R(g, 18, 25, 3, 3, fg=GRIS, size=9), R(g, 29, 34, 3, 3, fg=GRIS, size=9),
            R(g, 8, 8, 1, 10, fg=C(.60, .39, .06), bold=True, size=10)]
    for r in (4, 9, 13, 17, 28):
        req.append(R(g, r, r, 1, 10, bg=C(.92, .95, .94), fg=VERDE, bold=True, size=12))
    req = [r for r in req if r]
    for i in range(0, len(req), 60):
        api("POST", SHEET + ":batchUpdate", tok, {"requests": req[i:i + 60]})
    return len(req)
