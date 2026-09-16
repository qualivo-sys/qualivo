#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Genera el copy de LinkedIn por lead, con la misma logica que el email.
#
# Lo que hace funcionar al email no es el argumentario, es la senal: "veo que
# trabajais con Salesforce". La primera version de LinkedIn decia "he estado
# mirando vuestra empresa", que es lo que escribe todo el mundo y no dice nada.
# Aqui cada lead lleva su senal real, sacada de su campana de Smartlead.
#
# Y va mas contenido que el email a proposito. En LinkedIn escribes desde tu
# perfil con tu cara, y estas frases hunden el mensaje:
#   - "te escribo con una pregunta, no con una presentacion": anunciar que no
#     vendes es vender, y se nota.
#   - "casi siempre es donde esta el dinero": hablar de dinero en el primer
#     mensaje suena a gurú.
#   - "recupero 6,45 veces lo que invirtio": un numero suelto de un desconocido
#     no es prueba, es ruido.
# Lo unico que se deja como prueba es la confesion del CRM propio, que funciona
# porque va en contra de uno mismo: "y yo me dedico a esto".
#
# Los tres campos van como customUserFields de HeyReach y la secuencia los lee
# con llaves simples: {nota}, {msg1}, {msg2}.
#
# Uso: python3 copy_linkedin.py <senales.json> <candidatos.json> --out <fichero>
import json
import re
import sys

# Primera linea por puerta: el hecho observable, igual que en el email.
SENAL = {
 "crm":          "veo que en {emp} trabajáis con {var}",
 "google_ads":   "veo que en {emp} estáis comprando tráfico en Google",
 "meta_ads":     "veo que en {emp} tenéis el píxel de Meta trabajando",
 "linkedin_ads": "veo que en {emp} estáis invirtiendo en LinkedIn",
 "lista":        "veo que en {emp} mandáis campañas con {var}",
}

# Que es lo que suelo encontrar ahi. Observacion, no promesa.
QUE_VEO = {
 "crm":          "Lo que suelo encontrar en un {var} con unos años es "
                 "oportunidades abiertas que nadie ha vuelto a tocar. No por "
                 "dejadez: es que nadie las mira.",
 "google_ads":   "Lo que casi nadie sabe decirme es qué campaña trajo al último "
                 "cliente que firmó. El último lead sí, el último cliente no.",
 "meta_ads":     "Lo que casi nadie sabe decirme es qué campaña trajo al último "
                 "cliente que firmó. El último lead sí, el último cliente no.",
 "linkedin_ads": "Ahí el clic se paga caro, así que lo que duele no es el coste "
                 "por lead: es no saber cuál de esas campañas acabó en cliente.",
 "lista":        "Lo que casi nadie tiene atado es cuál de esos suscriptores "
                 "acabó comprando de verdad.",
}

PREGUNTA = {
 "crm":          "¿Vosotros sabéis cuántas tenéis así?",
 "google_ads":   "¿Vosotros lo tenéis atado?",
 "meta_ads":     "¿Vosotros lo tenéis atado?",
 "linkedin_ads": "¿Vosotros lo medís hasta la venta?",
 "lista":        "¿Vosotros lo sabéis?",
}

# Unica prueba que se usa. Va en contra de uno mismo, por eso no suena a venta.
CIERRE = {
 "crm":          "Una cosa que te sirve aunque no hablemos: hice la prueba en mi "
                 "propio CRM hace unas semanas y me salieron 25 oportunidades "
                 "paradas. Y yo me dedico a esto.\n\n"
                 "Si quieres que mire el vuestro, son quince minutos. Y si no "
                 "toca, sin problema.",
 "default":      "Lo dejo aquí, que tampoco quiero dar la lata.\n\n"
                 "Si alguna vez te apetece que lo mire desde fuera y te diga qué "
                 "veo, son quince minutos. Y si no toca, sin problema.",
}

GENERICO_NOTA = ("Hola, soy Maikel. Me dedico a mirar dónde se quedan parados "
                 "los clientes entre que preguntan y firman. Te conecto por si "
                 "algún día te viene bien preguntar.")
GENERICO_MSG1 = ("Gracias por aceptar.\n\nLo que más me encuentro es gente que no "
                 "sabe qué porcentaje de lo que entra acaba en cliente, ni en qué "
                 "punto se cae el resto.\n\n¿Vosotros lo tenéis medido?")
GENERICO_MSG2 = CIERRE["default"]


def limpia_empresa(n):
    """Mismo criterio que carga_v3: el nombre comercial, no el eslogan."""
    n = re.split(r"\s*[|·•☛►≡]\s*", n or "")[0]
    n = re.sub(r"\s*\([^)]*\)\s*$", "", n)
    if len(n) > 30:
        for sep in (",", " - ", " – "):
            if sep in n and len(n.split(sep)[0].strip()) >= 4:
                n = n.split(sep)[0]
                break
    n = re.sub(r"[®™©]", "", n)
    n = re.sub(r"[\s,]+(S\.?\s?L\.?U?\.?|S\.?\s?A\.?U?\.?)\s*$", "", n, flags=re.I)
    return re.sub(r"\s+", " ", n).strip(" .,-")


def variable(puerta, asunto):
    """El CRM o la herramienta se leen del asunto, que es donde quedaron:
    'vuestro Salesforce', 'vuestra lista de Brevo'."""
    if puerta == "crm":
        m = re.match(r"^vuestro (.+)$", asunto or "")
        return m.group(1).strip() if m else None
    if puerta == "lista":
        m = re.match(r"^vuestra lista de (.+)$", asunto or "")
        return m.group(1).strip() if m else None
    return ""


def construir(nombre, empresa, puerta, asunto):
    emp = limpia_empresa(empresa)
    var = variable(puerta, asunto)
    if puerta not in SENAL or var is None or not emp:
        return None
    d = {"emp": emp, "var": var}
    nom = (nombre or "").strip()
    hola = f"Hola {nom}, " if nom else "Hola, "

    nota = (f"{hola}{SENAL[puerta].format(**d)}. "
            "Me dedico justo a eso, a mirar qué se queda por el camino. "
            "Te conecto por si algún día te viene bien preguntar.")
    # LinkedIn corta la nota de invitacion en 300 caracteres. Si se pasa, se
    # recorta la parte prescindible en vez de mandar una frase partida.
    if len(nota) > 300:
        nota = (f"{hola}{SENAL[puerta].format(**d)}. "
                "Me dedico justo a eso. Te conecto por si te viene bien.")
    if len(nota) > 300:
        nota = GENERICO_NOTA

    msg1 = (f"Gracias por aceptar{', ' + nom if nom else ''}.\n\n"
            f"{QUE_VEO[puerta].format(**d)}\n\n{PREGUNTA[puerta]}")
    msg2 = CIERRE.get(puerta, CIERRE["default"])
    return nota, msg1, msg2


def main():
    senales = json.load(open(sys.argv[1], encoding="utf-8"))
    cand = json.load(open(sys.argv[2], encoding="utf-8"))
    out, sin = [], 0
    for x in cand:
        em = x["email"]
        s = senales.get(em)
        r = construir(s["nombre"] if s else x.get("nombre"),
                      (s or x).get("empresa") or x.get("empresa"),
                      (s or {}).get("puerta"), (s or {}).get("subject1")) if s else None
        if not r:
            sin += 1
            nota, msg1, msg2 = GENERICO_NOTA, GENERICO_MSG1, GENERICO_MSG2
        else:
            nota, msg1, msg2 = r
        out.append({**x, "nota": nota, "msg1": msg1, "msg2": msg2})
    largo = [o for o in out if len(o["nota"]) > 300]
    print(f"{len(out)} leads · {sin} con copy generico (sin señal) · "
          f"{len(largo)} notas pasadas de 300 caracteres")
    if "--out" in sys.argv:
        d = sys.argv[sys.argv.index("--out") + 1]
        json.dump(out, open(d, "w", encoding="utf-8"), ensure_ascii=False)
        print("escrito en", d)
        return
    for o in out[:3]:
        print("=" * 70)
        print(f"{o['email']} · {o.get('empresa')}")
        print(f"\n[NOTA {len(o['nota'])} car.]\n{o['nota']}")
        print(f"\n[MSG 1]\n{o['msg1']}")
        print(f"\n[MSG 2]\n{o['msg2']}")


if __name__ == "__main__":
    main()
