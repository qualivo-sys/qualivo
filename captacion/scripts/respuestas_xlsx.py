#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Libro de seguimiento de respuestas de Qualivo.
# Pestanas: Respuestas (una fila por persona que contesto, con score, texto
# literal y propuesta de respuesta), Metricas (embudo por canal) y Campanas.
# Uso: python3 respuestas_xlsx.py <SMARTLEAD_API_KEY> [salida.xlsx]
import json, sys, os, re, datetime, urllib.request, collections
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

KEY = sys.argv[1]
SP = os.environ.get("SP", "/tmp/claude-0/-home-user-qualivo/382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad")
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
HOY = datetime.date.today().isoformat()
SALIDA = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, "captacion", "datos", f"respuestas-{HOY}.xlsx")
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126"}
req = lambda u: json.loads(urllib.request.urlopen(urllib.request.Request(u, headers=UA)).read())

NAVY="1F3757"; ACENTO="2E86AB"; GRIS="F2F4F7"; VERDE="1E7A46"; ROJO="B3261E"; AMBAR="B26B00"
F = lambda **k: Font(name="Arial", **k)
TH = Font(name="Arial", bold=True, color="FFFFFF", size=10)
BORDE = Border(bottom=Side(style="thin", color="D9D9D9"))

# --- puntuacion -------------------------------------------------------------
# 100 quiere hablar o pregunta algo concreto · 80 deriva con nombre
# 60 pide informacion · 40 no es ahora · 20 autorespuesta · 0 no
def puntuar(t, clase):
    b = (t or "").lower()
    if clase in ("CABREO / LEGAL",) or re.search(r"lopd|rgpd|ilegal|denunc|bórre|borrar|no me escrib|elimin", b):
        return 0, "Descartar · pidio no ser contactado"
    if re.search(r"no me interesa|no estamos interesad|no nos interesa|no necesito|ya lo tenemos|"
                 r"todo ya organizado|lo tenemos todo|ya lo hacemos|no encaja|no es el momento|"
                 r"prefiero no seguir|no seguir adelante|tenemos todas las necesidades|no vendemos|"
                 r"no tenemos problem|declinamos|no procede", b):
        return 0, "Descartar · no interesado"
    if re.search(r"vacacion|vacaci|vacances|ferias|fuera de la oficina|out of office|estare fuera|estaré fuera|"
                 r"tancat|tancad|romandra|romandrà|de baja|cerrados por|cerrado por|estoy fuera|estic fora|"
                 r"absent|ausente|fora de|no estoy disponible|no me encuentro disponible", b):
        return 20, "Autoreply · reintentar a la vuelta"
    if re.search(r"ha cambiado a|nueva direccion de correo|nueva dirección|dejara de estar activa|dejará de estar activa|mi nueva direccion", b):
        return 20, "Actualizar email y recontactar"
    # OJO: "gracias por contactar con nosotros" aparece en casi toda respuesta
    # educada. La derivacion exige que nos manden a ALGUIEN concreto.
    if re.search(r"pongo en contacto|te pido que contactes|por favor contactar con|contacta con|"
                 r"responsable de marketing|persona adecuada|traslado el email|traslado tu|he derivado|"
                 r"derivado a|project manager (de la empresa )?es|no soy decisor|no soy quien decide|"
                 r"habla con|escribe a|dirigete a|dirígete a", b):
        return 80, "Seguir la derivacion · pedir nombre y correo"
    if re.search(r"cuanto|cuánto|precio|cobras|coste|como crees que|cómo crees que|en que consiste|en qué consiste|mas info|más info|envianos|envíanos|quiero saber|me gustaria saber|me gustaría saber|reunion|reunión|llamada|agenda|\?", b):
        return 100, "Contestar hoy · pregunta abierta"
    if re.search(r"mas adelante|más adelante|ahora no|no es prioridad|reducir la inversion|reducir la inversión|en el futuro", b):
        return 40, "Timing · guardar y retomar"
    return 60, "Revisar"

def propuesta(score, accion, t):
    b = (t or "").lower()
    if score == 0: return "No se contesta. Dominio bloqueado."
    if score == 20 and "email" in accion.lower(): return "Cargar la direccion nueva en el motor como lead nuevo y dar de baja la vieja."
    if score == 20: return "Reintentar cuando vuelva, mismo hilo, sin recordar que ya escribimos."
    if score == 80: return "Gracias + pedir nombre y correo de quien lo lleva, para escribir directamente y no hacer de intermediario."
    if score == 40: return "Aceptar sin insistir + UN caso que no requiera gastar (base recuperada 6,45x) + puerta abierta."
    if re.search(r"cuanto|cuánto|precio|cobras|coste", b):
        return ("Dar la cifra primero y explicar despues: 1.200 EUR de implementacion "
                "y 750 EUR/mes, y si el primer mes no genera citas cualificadas no se "
                "cobra. Y quince minutos antes de nada.")
    if re.search(r"mas info|más info|envianos|envíanos", b):
        return "Rebajar la peticion: que digan en una linea que venden y por donde les llega la gente hoy."
    if re.search(r"como crees que|cómo crees que|puedes ayudar", b):
        return "Nada de discurso: una pregunta que solo ellos puedan contestar (cuantos interesados acaban hablando con su equipo)."
    return "Contestar en el dia con la frase de valor y quince minutos como primer paso."

# --- datos ------------------------------------------------------------------
filas = []
try:
    email = json.load(open(os.path.join(SP, "respuestas_clasificadas.json")))
    estado = {e["email"]: e for e in json.load(open(os.path.join(SP, "hilos_estado.json")))}
except Exception as e:
    email, estado = [], {}
    print("aviso: sin datos de email:", e)
for o in email:
    sc, acc = puntuar(o.get("txt"), o.get("clase"))
    st = estado.get(o["email"], {})
    filas.append({"score": sc, "fecha": o.get("fecha"), "canal": "Email frio",
                  "quien": o.get("nombre") or "", "contacto": o.get("email"),
                  "empresa": "", "campana": o.get("camp"), "texto": o.get("txt") or "",
                  "accion": acc, "propuesta": propuesta(sc, acc, o.get("txt")),
                  "contestado": st.get("contestado") or ""})
try:
    for o in json.load(open(os.path.join(SP, "linkedin_respuestas.json"))):
        sc, acc = puntuar(o.get("texto"), "")
        filas.append({"score": sc, "fecha": o.get("fecha"), "canal": "LinkedIn",
                      "quien": o.get("nombre"), "contacto": o.get("url") or "",
                      "empresa": (o.get("headline") or "")[:40], "campana": "HeyReach",
                      "texto": o.get("texto") or "", "accion": acc,
                      "propuesta": propuesta(sc, acc, o.get("texto")), "contestado": ""})
except Exception as e:
    print("aviso: sin datos de LinkedIn:", e)
filas.sort(key=lambda r: (-r["score"], r["fecha"] or ""), reverse=False)
filas.sort(key=lambda r: (-r["score"], (r["fecha"] or "")), reverse=False)

# --- metricas de Smartlead --------------------------------------------------
camps = req(f"https://server.smartlead.ai/api/v1/campaigns?api_key={KEY}")
cam = []
tot = collections.Counter()
for c in camps:
    n = collections.Counter(); off = 0
    while True:
        d = req(f"https://server.smartlead.ai/api/v1/campaigns/{c['id']}/statistics?api_key={KEY}&offset={off}&limit=500")
        rows = d.get("data") or []
        for r in rows:
            if r.get("sent_time"): n["env"] += 1
            if (r.get("open_count") or 0) > 0: n["ap"] += 1
            if (r.get("click_count") or 0) > 0: n["clic"] += 1
            if r.get("reply_time"): n["resp"] += 1
            if r.get("is_bounced"): n["reb"] += 1
        if len(rows) < 500: break
        off += 500
    if n["env"]:
        cam.append((c["name"][:46], c["status"], n))
        tot.update(n)

# --- libro ------------------------------------------------------------------
wb = Workbook(); wb.remove(wb.active)

def cabecera(ws, fila, cols, anchos):
    for i, (t, a) in enumerate(zip(cols, anchos), 1):
        cel = ws.cell(row=fila, column=i, value=t)
        cel.font = TH; cel.fill = PatternFill("solid", fgColor=NAVY)
        cel.alignment = Alignment(horizontal="center", vertical="center")
        ws.column_dimensions[get_column_letter(i)].width = a
    ws.freeze_panes = ws.cell(row=fila + 1, column=1)

# Metricas
ws = wb.create_sheet("Métricas")
ws["A1"] = "EMBUDO QUALIVO"; ws["A1"].font = F(bold=True, size=15, color=NAVY)
ws["A2"] = f"Actualizado {HOY} · lo que manda es la última fila"; ws["A2"].font = F(size=10, color="777777")
alto = [r for r in filas if r["score"] >= 80]
conv = [r for r in filas if r["score"] == 100]
emb = [("Envíos", tot["env"], ""),
       ("Aperturas", tot["ap"], f"{100*tot['ap']/max(tot['env'],1):.1f}% de los envíos"),
       ("Clics", tot["clic"], f"{100*tot['clic']/max(tot['env'],1):.1f}%"),
       ("Rebotes", tot["reb"], f"{100*tot['reb']/max(tot['env'],1):.1f}% · límite 3%"),
       ("Respuestas totales", tot["resp"], f"{100*tot['resp']/max(tot['env'],1):.2f}% de los envíos"),
       ("Respuestas por LinkedIn", len([r for r in filas if r["canal"]=="LinkedIn"]), "canal aparte"),
       ("De ellas, trabajables (score 80+)", len(alto), "derivaciones y preguntas"),
       ("LEADS · pidieron conversación (score 100)", len(conv), "la cifra que importa"),
       ("Reuniones agendadas", 0, "cero. Aquí se mide todo"),
       ]
fila = 4
cabecera(ws, fila, ["Métrica", "Número", "Lectura"], [42, 12, 34])
for j, (k, v, nota) in enumerate(emb):
    fila += 1
    ws.cell(row=fila, column=1, value=k).font = F(size=10, bold=(j >= 6))
    c = ws.cell(row=fila, column=2, value=v); c.alignment = Alignment(horizontal="center")
    c.font = F(size=11, bold=True, color=(VERDE if j == 7 and v else (ROJO if j == 8 else "000000")))
    ws.cell(row=fila, column=3, value=nota).font = F(size=9, color="777777")
    for i in range(1, 4):
        ws.cell(row=fila, column=i).border = BORDE
        if j % 2: ws.cell(row=fila, column=i).fill = PatternFill("solid", fgColor=GRIS)

# Respuestas
ws = wb.create_sheet("Respuestas")
ws["A1"] = "RESPUESTAS · una fila por persona"; ws["A1"].font = F(bold=True, size=15, color=NAVY)
ws["A2"] = "Ordenadas por score. 100 = pidió conversación · 80 = derivó con nombre · 40 = timing · 20 = autorespuesta · 0 = no"
ws["A2"].font = F(size=10, color="777777")
cabecera(ws, 4, ["Score", "Fecha", "Canal", "Quién", "Contacto", "Empresa",
                 "Qué dijo (literal)", "Acción", "Propuesta de respuesta", "¿Contestado?"],
         [7, 11, 11, 24, 34, 26, 62, 30, 58, 13])
fila = 4
for j, r in enumerate(filas):
    fila += 1
    col = {100: ROJO, 80: AMBAR, 60: "000000", 40: "777777", 20: "999999", 0: "BBBBBB"}[r["score"]]
    vals = [r["score"] if r["score"] else "NO", r["fecha"], r["canal"], r["quien"], r["contacto"],
            r["empresa"], r["texto"][:220], r["accion"], r["propuesta"],
            ("sí " + r["contestado"]) if r["contestado"] else ("—" if r["score"] < 60 else "NO")]
    for i, v in enumerate(vals, 1):
        c = ws.cell(row=fila, column=i, value=v)
        c.font = F(size=9, bold=(i == 1), color=(col if i == 1 else "000000"))
        c.alignment = Alignment(wrap_text=(i in (7, 9)), vertical="top",
                                horizontal=("center" if i in (1, 2, 10) else "left"))
        c.border = BORDE
        if j % 2: c.fill = PatternFill("solid", fgColor=GRIS)
    if r["score"] >= 80 and not r["contestado"]:
        ws.cell(row=fila, column=10).font = F(size=9, bold=True, color=ROJO)
    ws.row_dimensions[fila].height = 46

# Campanas
ws = wb.create_sheet("Campañas")
ws["A1"] = "CAMPAÑAS · acumulado"; ws["A1"].font = F(bold=True, size=15, color=NAVY)
cabecera(ws, 3, ["Campaña", "Estado", "Envíos", "Aperturas", "Clics", "Respuestas", "% resp.", "Rebotes", "% reb."],
         [48, 11, 9, 11, 8, 12, 9, 9, 8])
fila = 3
for j, (nom, st, n) in enumerate(sorted(cam, key=lambda x: -x[2]["env"])):
    fila += 1
    pr = 100*n["resp"]/max(n["env"],1); pb = 100*n["reb"]/max(n["env"],1)
    for i, v in enumerate([nom, st, n["env"], n["ap"], n["clic"], n["resp"],
                           round(pr,2), n["reb"], round(pb,2)], 1):
        c = ws.cell(row=fila, column=i, value=v)
        c.font = F(size=10); c.border = BORDE
        if i > 1: c.alignment = Alignment(horizontal="center")
        if j % 2: c.fill = PatternFill("solid", fgColor=GRIS)
    if pb > 3 and n["env"] >= 50: ws.cell(row=fila, column=9).font = F(size=10, bold=True, color=ROJO)
    if n["resp"]: ws.cell(row=fila, column=6).font = F(size=10, bold=True, color=VERDE)

wb.save(SALIDA)
print(SALIDA)
print(f"respuestas: {len(filas)} · score 100: {len(conv)} · score 80: {len([r for r in filas if r['score']==80])}")

# Nota de operacion (15-sep): este libro se genera cada dia junto al embudo y se
# sube a Drive con el reporte de las 17:30. La conversion a Google Sheet falla
# con ficheros de este tamano, asi que sube como xlsx y se abre igual con Hojas
# de calculo. Pasar el base64 por el chat para subirlo cuesta 20.000 tokens y no
# aporta nada: se manda el fichero directamente.
