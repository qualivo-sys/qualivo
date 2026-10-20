#!/usr/bin/env python3
"""Lanza una llamada de Raquel con las variables validadas antes de salir.

Existe por el postmortem del 30-sep: aquel dia se lanzaron seis llamadas sin la
variable `apertura` (el firstMessage del asistente es "Hola, buenos dias.
{{apertura}}", asi que Raquel saludaba y se quedaba muda) y con instrucciones
metidas dentro de `dato_concreto`, que es un campo que se pronuncia. Este script
no deja hacer ninguna de las dos cosas.

Uso:
    python3 lanzar_llamada.py brief.json [--de-verdad]

Sin --de-verdad solo valida e imprime lo que se enviaria. Esto es a proposito:
nada sale hacia fuera por descuido.

brief.json es una lista de objetos con:
    telefono       obligatorio, en formato +34...
    apertura       OBLIGATORIO, lo primero que dice, texto pronunciable
    nombre         nombre de pila de la persona, si se conoce
    empresa        nombre de la empresa
    dato_corto     UN hecho, corto, pronunciable. Nada mas.
    dias_ofrecidos huecos que puede ofrecer
    email          para el historial de no repetir en 7 dias
"""
import json
import os
import re
import subprocess
import sys
import datetime

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
AQUI = os.path.dirname(os.path.abspath(__file__))
HIST = os.path.join(AQUI, "historial_llamadas.json")

# Si una variable que se pronuncia contiene esto, es una instruccion, no un dato.
INSTRUCCION = re.compile(
    r"\b(reconoce|recon[oó]celo|pregunta|di\s|dile|menciona|usa\s|utiliza|"
    r"no\s+digas|recuerda|ten\s+en\s+cuenta|si\s+te\s+dicen|colgar|cuelga|"
    r"esta\s+persona\s+no\s+es|haz\b|evita)\b", re.I)

# Las aperturas de email NO se mencionan nunca. Seccion 2 del rol de cold calling.
APERTURAS = re.compile(r"\b(abri[oó]|aperturas?|ha\s+abierto|le[ií]do\s+el\s+correo|"
                       r"no\s+ha\s+contestado|veces\s+el\s+correo)\b", re.I)

# La voz lee lo que se escribe: sin tilde suena "Michael", y "Qualivo" suena "Qualibo".
MAL_ESCRITO = [("Maikel", "Máikel"), ("Qualivo", "Cualivo"), ("Qualibo", "Cualivo")]

PRONUNCIABLES = ("apertura", "dato_corto", "nombre", "empresa", "dias_ofrecidos")


def valida(b, i):
    """Devuelve la lista de problemas de un briefing. Vacia = se puede lanzar."""
    fallos = []
    if not b.get("telefono", "").startswith("+"):
        fallos.append("el telefono tiene que ir en formato internacional, con +")
    if not (b.get("apertura") or "").strip():
        fallos.append("FALTA 'apertura'. Sin ella Raquel saluda y se queda muda "
                      "(es el fallo del 30-sep)")
    for campo in PRONUNCIABLES:
        v = (b.get(campo) or "").strip()
        if not v:
            continue
        if INSTRUCCION.search(v):
            fallos.append(f"'{campo}' contiene una instruccion y es un campo que "
                          f"se pronuncia: {INSTRUCCION.search(v).group(0)!r}")
        if APERTURAS.search(v):
            fallos.append(f"'{campo}' menciona las aperturas del correo. La "
                          f"seccion 2 del rol lo prohibe")
        for mal, bien in MAL_ESCRITO:
            if re.search(rf"\b{mal}\b", v):
                fallos.append(f"'{campo}' escribe {mal!r}: la voz lo pronuncia mal, "
                              f"tiene que ir {bien!r}")
        if len(v.split()) > 45:
            fallos.append(f"'{campo}' tiene {len(v.split())} palabras: demasiado "
                          f"largo para decirlo en voz alta")
    return fallos


def historial():
    try:
        with open(HIST, encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return {}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    de_verdad = "--de-verdad" in sys.argv
    with open(sys.argv[1], encoding="utf-8") as fh:
        briefs = json.load(fh)
    if isinstance(briefs, dict):
        briefs = [briefs]

    hist = historial()
    hoy = datetime.date.today()
    bloqueados = set()
    for em, f in hist.items():
        try:
            if (hoy - datetime.date.fromisoformat(f)).days < 7:
                bloqueados.add(em.lower())
        except Exception:
            pass

    listos, rechazados = [], []
    for i, b in enumerate(briefs):
        fallos = valida(b, i)
        em = (b.get("email") or "").lower()
        if em and em in bloqueados:
            fallos.append(f"se le llamo hace menos de 7 dias ({hist.get(em)})")
        (rechazados if fallos else listos).append((b, fallos))

    print(f"briefings: {len(briefs)} | validos: {len(listos)} | rechazados: {len(rechazados)}\n")
    for b, fallos in rechazados:
        print(f"  RECHAZADO {b.get('telefono','?')} ({b.get('empresa','?')})")
        for f in fallos:
            print(f"     - {f}")
    if rechazados:
        print()

    for b, _ in listos:
        vv = {k: b[k] for k in PRONUNCIABLES if b.get(k)}
        print(f"  LISTO {b['telefono']} ({b.get('empresa','?')})")
        print(f"     dira primero: \"{b['apertura']}\"")
        if not de_verdad:
            continue
        key, aid, pid = (open(f"{os.environ['SP']}/.{n}").read().strip()
                         for n in ("vapi_key", "vapi_assistant_id", "vapi_phone_id"))
        payload = {"assistantId": aid, "phoneNumberId": pid,
                   "customer": {"number": b["telefono"]},
                   "assistantOverrides": {"variableValues": vv}}
        o = subprocess.run(["curl", "-s", "-X", "POST", "-A", UA,
                            "https://api.vapi.ai/call",
                            "-H", f"Authorization: Bearer {key}",
                            "-H", "Content-Type: application/json",
                            "-d", json.dumps(payload, ensure_ascii=False)],
                           capture_output=True, text=True)
        print(f"     lanzada: {o.stdout[:140]}")
        if b.get("email"):
            hist[b["email"].lower()] = hoy.isoformat()

    if de_verdad and listos:
        with open(HIST, "w", encoding="utf-8") as fh:
            json.dump(hist, fh, ensure_ascii=False, indent=1)
        print(f"\nhistorial actualizado: {len(hist)} registros")
    elif not de_verdad:
        print("\n(ensayo: no se ha llamado a nadie. Con --de-verdad se lanza)")
    return 0 if not rechazados else 1


if __name__ == "__main__":
    sys.exit(main())
