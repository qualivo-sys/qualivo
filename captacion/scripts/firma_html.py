#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Convierte el copy de UNA campana a HTML con firma, para medir si una firma
# con formato responde mejor que el texto plano.
#
# Por que una sola campana: si se cambian las ocho no se puede saber si el
# movimiento viene de la firma o de la senal. La de Google Ads es la unica con
# leads suficientes en cola (104) para pasar el minimo de 100 envios del Brain
# antes de decidir. Las otras siete se quedan en plano y hacen de control.
#
# Sin logo ni iconos de redes: son imagenes, y las imagenes en frio cuestan
# bandeja de entrada. La firma es texto con formato, que es lo que se mide.
#
# Uso: python3 firma_html.py <API_KEY> <campaign_id> [--dry]
import html as H
import json
import re
import sys
import time
import urllib.request
import importlib.util

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
B = "https://server.smartlead.ai/api/v1"
NARANJA = "#E14504"
CAL = "https://api.leadconnectorhq.com/widget/bookings/qualivo-20"
DIAG = "https://qualivo.io/diagnostico/"

FIRMA = (
    '<div style="margin-top:22px;font-family:Arial,Helvetica,sans-serif;'
    'font-size:14px;line-height:1.5;color:#222222">'
    f'<div style="border-top:2px solid {NARANJA};width:190px;margin-bottom:10px">'
    '</div>'
    '<div><strong>Maikel Echevarría</strong>'
    f'<span style="color:{NARANJA}"> · CEO</span></div>'
    '<div style="color:#555555">Qualivo · '
    f'<a href="https://qualivo.io" style="color:{NARANJA};text-decoration:none">'
    'qualivo.io</a></div>'
    '<div style="color:#555555">663 375 205</div>'
    '</div>'
)


def a_html(texto, con_enlaces):
    """Pasa el cuerpo en texto a parrafos HTML. El ultimo parrafo es la firma
    de texto ('Maikel'), que se sustituye por la firma con formato."""
    parrafos = [p.strip() for p in texto.split("\n\n") if p.strip()]
    if parrafos and parrafos[-1].strip() == "Maikel":
        parrafos = parrafos[:-1]
    trozos = []
    for p in parrafos:
        # el email 3 lleva el calendario en crudo: se convierte en enlace
        p = p.replace(f"Y si lo prefieres en directo: {CAL}", "")
        if not p.strip():
            continue
        trozos.append(
            '<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;'
            'font-size:15px;line-height:1.55;color:#222222">'
            + H.escape(p).replace("\n", "<br>") + "</p>")
    if con_enlaces:
        enlaces = (
            '<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;'
            'font-size:15px;line-height:1.55;color:#222222">'
            f'Puedes ver cómo funciona <a href="{DIAG}" '
            f'style="color:{NARANJA}">en este enlace</a>, y si prefieres que '
            f'hablemos, <a href="{CAL}" style="color:{NARANJA}">agendamos '
            'quince minutos</a>.</p>')
        # los enlaces van ANTES del cierre, no despues: la pregunta final
        # tiene que ser lo ultimo que se lee.
        trozos.insert(max(len(trozos) - 1, 0), enlaces)
    return "".join(trozos) + FIRMA


def call(m, u, b=None):
    r = urllib.request.Request(u, data=json.dumps(b).encode() if b else None,
                               headers=UA, method=m)
    for i in range(3):
        try:
            with urllib.request.urlopen(r, timeout=45) as f:
                t = f.read().decode()
                try:
                    return json.loads(t)
                except ValueError:
                    return {"raw": t}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(2)


def main():
    K, cid = sys.argv[1], sys.argv[2]
    dry = "--dry" in sys.argv
    spec = importlib.util.spec_from_file_location("cv", "captacion/scripts/carga_v3.py")
    cv = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cv)

    n = saltados = 0
    off = 0
    muestra = None
    while True:
        d = call("GET", f"{B}/campaigns/{cid}/leads?api_key={K}&offset={off}&limit=100")
        b = (d or {}).get("data") or []
        for it in b:
            l = it.get("lead") or it
            if (it.get("status") or "").upper() != "STARTED":
                saltados += 1
                continue
            cf = l.get("custom_fields") or {}
            if not cf.get("body1"):
                saltados += 1
                continue
            campos = {
                "subject1": cf.get("subject1") or "",
                "body1": a_html(cf["body1"], True),
                "body2": a_html(cf.get("body2") or "", False),
                "body3": a_html(cf.get("body3") or "", True),
                "puerta": cf.get("puerta") or "",
            }
            if muestra is None:
                muestra = (l.get("email"), campos)
            if dry:
                n += 1
                continue
            r = call("POST", f"{B}/campaigns/{cid}/leads/{l['id']}?api_key={K}",
                     {"email": l.get("email"), "custom_fields": campos})
            if not r.get("err"):
                n += 1
        if len(b) < 100:
            break
        off += 100

    if muestra:
        print("=== MUESTRA ·", muestra[0], "===")
        print("asunto:", muestra[1]["subject1"])
        print(muestra[1]["body1"])
        print()
    if dry:
        print(f"[dry] {n} leads se convertirian · {saltados} ya enviados o sin copy")
        return
    r = call("POST", f"{B}/campaigns/{cid}/settings?api_key={K}",
             {"send_as_plain_text": False})
    print("plano desactivado:", r)
    print(f"{n} leads pasados a HTML · {saltados} ya enviados, sin tocar")


if __name__ == "__main__":
    main()
