#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Genera el copy de LinkedIn por lead. Formato pedido por Maikel el 16-sep.
#
# El mensaje NO afirma nada sobre su empresa, pregunta. Tres partes:
#   1. "{Nombre}, una duda que me ha surgido mirando {Empresa}."
#   2. La duda, con dos opciones, para que contestar cueste una palabra.
#   3. Por que se pregunta, que es verdad y se puede decir.
#
# Dos versiones anteriores se cayeron por sonar a vendedor. Lo que no vuelve:
#   - "te escribo con una pregunta, no con una presentacion": anunciar que no
#     vendes es vender, y se nota.
#   - "casi siempre es donde esta el dinero": suena a gurú.
#   - un numero suelto en el primer contacto: de un desconocido no es prueba,
#     es ruido. Los numeros van en el segundo mensaje y enlazados a la pagina
#     del caso, que se comprueba en un clic.
#
# La invitacion va SIN nota: la pregunta entera no cabe en 300 caracteres y
# partirla la deja coja. Los dos mensajes van como customUserFields de HeyReach
# y la secuencia los lee con llaves simples: {msg1} y {msg2}.
#
# Uso: python3 copy_linkedin.py <senales.json> <candidatos.json> --out <fichero>
import json
import re
import sys

# La pregunta, en el formato que pidio Maikel: una duda concreta, con dos
# opciones para que contestar cueste poco, y el motivo real de preguntarla.
# No se afirma nada sobre su empresa, se pregunta. Esa es la diferencia con la
# version anterior, que sonaba a vendedor.
PREGUNTA = {
 "crm":          "Con {var}, ¿tenéis bastante control sobre las oportunidades que "
                 "se quedan abiertas sin seguimiento o todavía hay bastante "
                 "revisión manual?",
 "google_ads":   "Con lo que movéis en Google, ¿llegáis a ver qué campaña trajo al "
                 "último cliente que firmó o os quedáis en el lead?",
 "meta_ads":     "Con el píxel de Meta, ¿llegáis a ver qué campaña trajo al último "
                 "cliente que firmó o os quedáis en el lead?",
 "linkedin_ads": "Con lo que invertís en LinkedIn, ¿lo medís hasta la venta o os "
                 "quedáis en el coste por lead?",
 "lista":        "Con {var}, ¿sabéis cuál de vuestros suscriptores acabó comprando "
                 "o eso se queda sin cruzar?",
}

MOTIVO = ("Te lo pregunto porque es precisamente una de las fugas que estamos "
          "detectando últimamente.")

# El segundo mensaje no insiste: ofrece el caso publicado y una salida. El
# enlace es a una pagina real con nombre y numeros, que se comprueba en un clic.
#
# 30-sep: corregido un fallo que llevaba semanas enviando el caso equivocado.
# Solo "crm" y "lista" tenian cierre propio; las tres puertas de anuncios caian
# en "default", que es el caso de EAC y habla de MATRICULAS. Resultado: 35
# empresas ajenas a la formacion (BASQUEVOLT, CrowdFarming, Lleida.net,
# Hospital Capilar, Perelada Chivite...) recibieron un caso de matriculas.
# Es el mismo error que la lista "Academias": una plantilla de un sector
# enviada a otro.
#
# El arreglo no es esconder el sector, es nombrarlo. La seccion 19 del rol
# prohibe dar a entender que hemos trabajado con empresas identicas, asi que
# el cierre de anuncios dice que el caso es de una escuela de formacion y deja
# que el lector juzgue el mecanismo, no la etiqueta. mensajes-v3 ya asignaba
# un caso por puerta para email; esto alinea LinkedIn con esa tabla.
CIERRE = {
 "crm":      "Por si te sirve aunque no hablemos, este es el caso que más se "
             "parece: el problema no era conseguir más leads, era saber cuáles "
             "merecían atención.\n\nhttps://qualivo.io/casos/nuria-roure/\n\n"
             "Y si en algún momento quieres que mire el vuestro, son quince "
             "minutos. Si no toca, sin problema.",
 "lista":    "Por si te sirve aunque no hablemos, este es el caso que más se "
             "parece: el problema no era conseguir más leads, era saber cuáles "
             "merecían atención.\n\nhttps://qualivo.io/casos/nuria-roure/\n\n"
             "Y si en algún momento quieres que mire el vuestro, son quince "
             "minutos. Si no toca, sin problema.",
 # Las tres puertas de anuncios comparten cierre: el caso es el mismo y el
 # sector se dice en voz alta para no dar a entender lo que no es.
 "anuncios": "Por si te sirve aunque no hablemos. El caso que mejor explica lo "
             "que hacemos es de una escuela de formación, así que el sector no "
             "es el vuestro, pero el problema sí: medían hasta el lead y "
             "pasaron a medir hasta la venta real.\n\n"
             "https://qualivo.io/casos/eac/\n\n"
             "Y si en algún momento quieres que mire el vuestro, son quince "
             "minutos. Si no toca, sin problema.",
}

# Que cierre le toca a cada puerta. Explicito a proposito: si manana aparece
# una puerta nueva, este diccionario falla en alto en vez de mandar en silencio
# el caso de otro sector, que es justo lo que paso en septiembre.
CIERRE_POR_PUERTA = {
 "crm":          "crm",
 "lista":        "lista",
 "google_ads":   "anuncios",
 "meta_ads":     "anuncios",
 "linkedin_ads": "anuncios",
}

GENERICO_MSG1 = ("Una duda que me ha surgido: cuando entra una petición por "
                 "vuestra web, ¿sabéis qué porcentaje acaba en cliente o eso se "
                 "queda sin medir?\n\n" + MOTIVO)
# Tercer sitio donde vivia el mismo fallo: el lead sin senal detectada tambien
# recibia el caso de matriculas. Se usa el cierre de anuncios porque es el unico
# que no da por supuesto nada del destinatario: dice de que sector es el caso y
# deja que juzgue el mecanismo.
#
# Aun asi, esto es una red de seguridad, no una via normal: herramientas.md dice
# "sin senal verificada el lead no entra". Si este texto se esta usando mucho,
# el problema esta antes, en la carga.
GENERICO_MSG2 = CIERRE["anuncios"]


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
    """Devuelve (msg1, msg2). La invitacion va SIN nota a proposito.

    La pregunta entera no cabe en los 300 caracteres de la nota de invitacion, y
    partirla en dos la deja coja. Ademas las invitaciones sin nota se aceptan
    mas, asi que la pregunta se manda completa en cuanto aceptan."""
    emp = limpia_empresa(empresa)
    var = variable(puerta, asunto)
    if puerta not in PREGUNTA or var is None or not emp:
        return None
    nom = (nombre or "").strip()
    cabecera = (f"{nom}, una duda que me ha surgido mirando {emp}."
                if nom else f"Una duda que me ha surgido mirando {emp}.")
    msg1 = f"{cabecera}\n\n{PREGUNTA[puerta].format(emp=emp, var=var)}\n\n{MOTIVO}"
    clave = CIERRE_POR_PUERTA.get(puerta)
    if clave is None:
        # Sin cierre asignado no se manda nada: antes caia en el caso de EAC
        # y por eso 35 empresas sin relacion con la formacion recibieron un
        # caso de matriculas.
        raise SystemExit(
            f"puerta sin cierre asignado: {puerta!r}. "
            "Anadela a CIERRE_POR_PUERTA antes de generar copy.")
    msg2 = CIERRE[clave]
    return msg1, msg2


def main():
    senales = json.load(open(sys.argv[1], encoding="utf-8"))
    cand = json.load(open(sys.argv[2], encoding="utf-8"))
    out, sin = [], 0
    for x in cand:
        s = senales.get(x["email"])
        r = construir(s["nombre"], s["empresa"], s["puerta"], s["subject1"]) if s else None
        if not r:
            # Sin senal no hay pregunta concreta, y la pregunta ES el mensaje.
            # Se marcan para dejarlos fuera en vez de mandarles un generico.
            sin += 1
            continue
        out.append({**x, "msg1": r[0], "msg2": r[1]})
    print(f"{len(out)} leads con señal · {sin} descartados por no tenerla")
    if "--out" in sys.argv:
        d = sys.argv[sys.argv.index("--out") + 1]
        json.dump(out, open(d, "w", encoding="utf-8"), ensure_ascii=False)
        print("escrito en", d)
        return
    for o in out[:6]:
        print("=" * 70)
        print(f"{o['email']} · {o.get('empresa')}")
        print(f"\n[MENSAJE 1 · al aceptar]\n{o['msg1']}")
        print(f"\n[MENSAJE 2 · +4 dias]\n{o['msg2']}")


if __name__ == "__main__":
    main()
