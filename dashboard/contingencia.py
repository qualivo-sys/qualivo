#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construye «CONTINGENCIA · si no entra nadie».

La pregunta que responde no es «qué deuda pago si esto se tuerce», sino otra:
qué libera más caja al mes por cada euro que cuesta hacerlo. Puesta así, la
respuesta cambia de orden entera.

Amortizar deuda es la peor forma de bajar el gasto mensual, porque cuesta
capital por adelantado para ahorrar cuotas después. Cortar un gasto cuesta
cero y libera lo mismo desde el primer mes. Por eso la escalera empieza por lo
gratis y lo que toca capital queda fuera.

Las cifras y los textos NO están aquí: este repositorio es público. Salen de
dashboard/datos_plan.json, ignorado por git, igual que en el plan.

Uso:  python3 dashboard/contingencia.py
"""
import json, os, pathlib, sys, time

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from plan_prestamo import (D, DEUDA, INGRESOS, PERSONAL, QUALIVO, REPARTO,
                           SHEET, SOFTWARE, Hoja, eur, rango, token)

TITULO = "CONTINGENCIA · si no entra nadie"

SW  = {n: v for n, v, _, _ in SOFTWARE}
QV  = {n: v for n, v, _, _ in QUALIVO}
PER = {n: v for n, v, _, _ in PERSONAL}
TABLA = {"software": SW, "qualivo": QV, "personal": PER}

C = D["contingencia"]
# El escenario que dispara todo: se cae el ingreso dudoso y no entra nadie más.
ENTRA = sum(v for n, v, cuando, _, _ in INGRESOS
            if cuando is None and C["excluir_ingreso"] not in n)
# Solo las cuotas que siguen vivas pasados tres meses: la contingencia se
# dispara a los tres meses, así que una deuda que se liquida antes no forma
# parte del gasto mensual que hay que recortar.
SALE  = sum(SW.values()) + sum(QV.values()) + sum(PER.values()) \
        + sum(c for _, c, u, _, _ in DEUDA if u > 3)


def libera(p):
    """Lo que ahorra un peldaño. Apunta a líneas de gasto por su nombre, así
    que cambiar un importe en el fichero de datos lo recalcula solo."""
    if "fijo" in p:
        return float(p["fijo"])
    v = sum(TABLA[t][n] for t, n in p["libera"])
    return v - p.get("menos", 0)


ESCALERA = [(p["titulo"], libera(p), 0, p["por_que"], p["pierdes"])
            for p in C["escalera"]]
NO_SE_HACE   = [tuple(x) for x in C["no_se_hace"]]
DISPARADORES = [tuple(x) for x in C["disparadores"]]

R_ESC   = 7                                   # el escenario: cifras en 8, 9 y 10
R_DIS   = R_ESC + 6                           # disparadores
R_LAD   = R_DIS + len(DISPARADORES) + 3       # la escalera
R_AGU   = R_LAD + len(ESCALERA) + 3           # cuánto aguantas
R_NO    = R_AGU + len(ESCALERA) + 4           # lo que no se hace
FILAS   = R_NO + len(NO_SE_HACE) + 8


def construir():
    tok = token()
    h = Hoja(tok, TITULO, FILAS, cols=10)
    vals, forms = [], []
    colchon = REPARTO["entrada"][1] - sum(v for _, v, _ in REPARTO["salidas"]) \
        + sum(v for n, v, _ in REPARTO["salidas"] if n != REPARTO["bloqueada"]) \
        + sum(v for n, v, _ in REPARTO["salidas"] if n == REPARTO["bloqueada"])

    vals.append(("A1:H3", [
        ["CONTINGENCIA · QUÉ SE HACE SI NO ENTRA NADIE"] + [""] * 7,
        ["La pregunta no es qué deuda pago. Es qué libera más caja al mes por cada euro "
         "que cuesta hacerlo."] + [""] * 7,
        ["Puesta así, amortizar deuda sale la última, no la primera: cuesta capital hoy "
         "para ahorrar cuotas mañana."] + [""] * 7]))

    # ------------------------------------------------- el escenario malo ---
    vals.append((f"A5:H{R_ESC + 3}", [
        ["EL ESCENARIO QUE DISPARA ESTO", "€/mes", "", "supuesto"] + [""] * 4,
        [C["escenario"], "", "",
         "el peor caso realista, no el catastrófico"] + [""] * 4,
        ["", "", "", ""] + [""] * 4,
        ["Entra cada mes", ENTRA, "",
         "los ingresos recurrentes que quedan, sin el dudoso"] + [""] * 4,
        ["Sale cada mes (sin impuestos)", SALE, "",
         "software + publi + cuotas + personal + deuda"] + [""] * 4,
        ["DÉFICIT MENSUAL", "", "", "lo que te come la hucha cada mes si no haces nada"]
        + [""] * 4]))
    forms.append((f"B{R_ESC + 3}", [[f"=B{R_ESC + 1}-B{R_ESC + 2}"]]))

    # ----------------------------------------------------- disparadores ----
    vals.append((f"A{R_DIS - 1}:H{R_DIS + len(DISPARADORES) - 1}",
                 [["LOS DISPARADORES · cada uno tiene fecha, no se decide al calor del mes",
                   "cuándo", "qué se mira", "qué se hace"] + [""] * 4]
                 + [["", c, q, a] + [""] * 4 for c, q, a in DISPARADORES]))

    # -------------------------------------------------------- escalera -----
    vals.append((f"A{R_LAD - 1}:H{R_LAD + len(ESCALERA) - 1}",
                 [["LA ESCALERA · en orden, y se baja un peldaño cada vez",
                   "libera €/mes", "cuesta €", "déficit tras darlo", "por qué ahora",
                   "qué pierdes"] + [""] * 2]
                 + [[q, lib, coste, "", pq, pierde] + [""] * 2
                    for q, lib, coste, pq, pierde in ESCALERA]))
    for i in range(len(ESCALERA)):
        r = R_LAD + i
        ant = f"$B${R_ESC + 3}" if i == 0 else f"D{r - 1}"
        forms.append((f"D{r}", [[f"={ant}+B{r}"]]))

    # --------------------------------------------- cuánto aguantas ---------
    vals.append((f"A{R_AGU - 1}:H{R_AGU + len(ESCALERA) - 1}",
                 [["CUÁNTO AGUANTAS EN CADA PELDAÑO", "déficit €/mes",
                   "meses hasta quedarte a cero", "", "con todo el colchón: "
                   "hucha disponible + Reserva"] + [""] * 3]
                 + [[q, "", "", "", ""] + [""] * 3 for q, *_ in ESCALERA]))
    # el colchón entero: lo que no está ya gastado ni en la cuenta corriente
    bolsa = sum(v for n, v, _ in REPARTO["salidas"] if "Hucha" in n)
    vals.append((f"B{R_AGU - 2}", [[bolsa]]))
    vals.append((f"A{R_AGU - 2}", [["Colchón total disponible hoy (las cinco huchas)"]]))
    for i in range(len(ESCALERA)):
        r, rl = R_AGU + i, R_LAD + i
        forms.append((f"B{r}", [[f"=D{rl}"]]))
        # si el peldaño ya deja superávit, no hay cuenta atrás
        forms.append((f"C{r}", [[f'=IF(B{r}>=0;"ya no te comes el colchón";'
                                 f"$B${R_AGU - 2}/-B{r})"]]))

    # ------------------------------------------------ lo que no se hace ----
    vals.append((f"A{R_NO - 1}:H{R_NO + len(NO_SE_HACE) - 1}",
                 [["LO QUE NO SE HACE, POR MUCHO QUE APETEZCA", "liberaría €/mes",
                   "costaría €", "meses en recuperarlo", "por qué no"] + [""] * 3]
                 + [[q, lib, coste, round(coste / lib, 1), pq] + [""] * 3
                    for q, lib, coste, pq in NO_SE_HACE]))
    vals.append((f"A{R_NO + len(NO_SE_HACE) + 1}:H{R_NO + len(NO_SE_HACE) + 3}", [
        ["EL PUNTO DE NO RETORNO"] + [""] * 7,
        ["El peldaño 6 es el último: sin Claude ni n8n no hay agencia que operar, "
         "solo gastos que bajar."] + [""] * 7,
        ["Si llegas ahí y Qualivo sigue sin cubrirse, el problema ya no es de caja y "
         "no se arregla con una hoja de cálculo."] + [""] * 7]))

    h.lote(vals, "RAW"); time.sleep(1)
    h.lote(forms, "USER_ENTERED"); time.sleep(1)
    h.formato(formatos(h.gid))
    print(f"{TITULO}: listo · {FILAS} filas")
    print(f"  déficit de partida {ENTRA - SALE:,.2f} €/mes · "
          f"con los 5 primeros peldaños {ENTRA - SALE + sum(l for _, l, *_ in ESCALERA[:5]):,.2f} €/mes")


def formatos(gid):
    cab = {"backgroundColor": {"red": 0.12, "green": 0.14, "blue": 0.18},
           "textFormat": {"bold": True, "fontSize": 10,
                          "foregroundColor": {"red": 1, "green": 1, "blue": 1}}}
    p = [{"repeatCell": {"range": rango(gid, 1, 1, 0, 10), "cell": {"userEnteredFormat": {
            "backgroundColor": {"red": 0.08, "green": 0.09, "blue": 0.12},
            "textFormat": {"bold": True, "fontSize": 13,
                           "foregroundColor": {"red": 1, "green": 1, "blue": 1}}}},
          "fields": "userEnteredFormat(backgroundColor,textFormat)"}}]
    for ancho, c1, c2 in ((340, 0, 1), (105, 1, 4), (300, 4, 6)):
        p.append({"updateDimensionProperties": {
            "range": {"sheetId": gid, "dimension": "COLUMNS",
                      "startIndex": c1, "endIndex": c2},
            "properties": {"pixelSize": ancho}, "fields": "pixelSize"}})
    for f in (5, R_DIS - 1, R_LAD - 1, R_AGU - 1, R_NO - 1,
              R_NO + len(NO_SE_HACE) + 1):
        p.append({"repeatCell": {"range": rango(gid, f, f, 0, 10),
                                 "cell": {"userEnteredFormat": cab},
                                 "fields": "userEnteredFormat(backgroundColor,textFormat)"}})
    for f1, f2, c1, c2 in ((R_ESC + 1, R_ESC + 3, 1, 2), (R_LAD, R_LAD + len(ESCALERA) - 1, 1, 4),
                           (R_AGU - 2, R_AGU - 2, 1, 2), (R_AGU, R_AGU + len(ESCALERA) - 1, 1, 2),
                           (R_NO, R_NO + len(NO_SE_HACE) - 1, 1, 3)):
        p.append({"repeatCell": {"range": rango(gid, f1, f2, c1, c2),
                                 "cell": {"userEnteredFormat": {"numberFormat": eur()}},
                                 "fields": "userEnteredFormat.numberFormat"}})
    # los meses que aguantas no son euros · patrón con punto, que es el canónico
    # de la API: el locale ya lo pinta con coma
    p.append({"repeatCell": {
        "range": rango(gid, R_AGU, R_AGU + len(ESCALERA) - 1, 2, 3),
        "cell": {"userEnteredFormat": {"numberFormat": {
            "type": "NUMBER", "pattern": '0.0 "meses"'}}},
        "fields": "userEnteredFormat.numberFormat"}})
    # el déficit en rojo mientras lo sea, y en verde en cuanto deje de serlo
    for f1, f2, c1, c2 in ((R_LAD, R_LAD + len(ESCALERA) - 1, 3, 4),
                           (R_AGU, R_AGU + len(ESCALERA) - 1, 1, 2),
                           (R_ESC + 3, R_ESC + 3, 1, 2)):
        for cond, color, idx in (("NUMBER_LESS", (0.96, 0.80, 0.80), 0),
                                 ("NUMBER_GREATER_THAN_EQ", (0.82, 0.93, 0.82), 1)):
            p.append({"addConditionalFormatRule": {"rule": {
                "ranges": [rango(gid, f1, f2, c1, c2)],
                "booleanRule": {"condition": {"type": cond,
                                              "values": [{"userEnteredValue": "0"}]},
                                "format": {"backgroundColor": dict(
                                    zip(("red", "green", "blue"), color)),
                                    "textFormat": {"bold": True}}}}, "index": idx}})
    return p


if __name__ == "__main__":
    if not os.environ.get("PLAN_SHEET_ID"):
        sys.exit("Falta PLAN_SHEET_ID.")
    construir()
