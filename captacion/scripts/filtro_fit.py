#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# El filtro que le falta a la maquina de senales. Escrito el 30-sep-2026.
#
# POR QUE EXISTE
#
# apify_senal.py cualifica PAIN: mira la web y detecta pixel, CRM, listas. Eso
# funciona y es lo unico que hemos visto mover la tasa de respuesta. Pero la
# seccion 6 del rol pide TRES cosas, no una: FIT + PAIN + INTENT. La maquina
# solo mira PAIN, y por eso la campana 605109 escribe a un Chief People Officer
# de una empresa de baterias con una pregunta sobre su embudo comercial.
#
# La prueba esta medida: de los que respondieron a esa campana, el unico fue
# Carlos B., CTO de Vinoseleccion, y contesto "No lo llevo yo. Gracias." No es
# un fallo de copy. El copy estaba bien. Era la persona.
#
# QUE HACE Y QUE NO HACE
#
# Descarta por CARGO, que es el unico eje de FIT que se puede verificar sin
# Sales Navigator: viene en el propio perfil. Tamano, ticket y volumen NO se
# pueden filtrar aqui y el script no finge que si: los deja marcados como
# DESCONOCIDO para que quien apruebe lo sepa.
#
# Tambien marca dos cosas que ya nos han morddo:
#   - autoetiqueta "Not interested": la reactivacion del 22-sep escribio a dos
#     personas que ya la tenian puesta desde agosto.
#   - empleador posiblemente caducado: el perfil de HeyReach es una foto del dia
#     de la captura. Leticia Martin figura como "Directora comercial en Implika"
#     y hoy implika.es redirige a masterd.es, porque el grupo se vendio en 2022.
#
# Uso:
#   python3 filtro_fit.py candidatos.json                 (informe)
#   python3 filtro_fit.py candidatos.json --out limpio.json
import json
import re
import sys

# Cargos que SI deciden o influyen sobre el recorrido comercial. Son los de la
# seccion 5 del rol, en las formas en que la gente los escribe de verdad.
ACEPTA = [
    r"\bceo\b", r"chief executive", r"consejero delegado", r"managing director",
    # "found(ador)" no existe en castellano: "fundador" se escribe con u. El
    # patron ingles se dejaba fuera a todos los fundadores espanoles.
    r"\bfounder\b", r"\bfundador", r"cofound", r"co-found", r"cofundador",
    r"co-fundador", r"\bsocio\b", r"director[ao] ejecutiv",
    r"propietari", r"\bowner\b", r"gerente", r"director general", r"\bdirector[ao]?\b",
    r"direcci[oó]n\b", r"\bcmo\b", r"\bcro\b", r"chief revenue", r"chief growth",
    r"chief marketing", r"chief commercial", r"\bcco\b",
    r"comercial", r"\bventas\b", r"\bsales\b", r"business development",
    r"\bmarketing\b", r"\bgrowth\b", r"revenue", r"admisio", r"admission",
    r"\brevops\b", r"customer success",
]

# Cargos que NO. No es que sean malos interlocutores: es que la pregunta que
# mandamos (que pasa entre el lead y la venta) no es su terreno, y contestan lo
# que contesto el CTO de Vinoseleccion. El descarte gana al acepta.
RECHAZA = [
    r"\bcto\b", r"\bcio\b", r"\bciso\b", r"chief technolog", r"chief information",
    r"chief technical", r"chief product", r"\bcpo\b",
    r"\bchro\b", r"chief people", r"chief human", r"\brrhh\b", r"recursos humanos",
    r"\bcfo\b", r"chief financial", r"director financier", r"\bfp&a\b",
    r"chief brand", r"chief transformation", r"chief innovation",
    r"innovaci[oó]n", r"\bcalidad\b", r"\bquality\b",
    r"chairman", r"board member", r"consejer[oa] independiente",
    r"\bmentor\b", r"\badvisor\b", r"\binvestor\b", r"\bcoach\b",
    r"\bdesign director\b", r"\bcdo\b", r"data officer",
    r"administraci[oó]n\b", r"\blegal\b", r"\bcompliance officer\b",
    r"\bprofesor\b", r"\bdocente\b", r"\bestudiante\b",
]

# Senales de que el empleador del perfil puede estar caducado o no ser el de hoy.
SOSPECHA_EMPLEADOR = [
    (r"\bex[- ]", "el cargo empieza por ex-"),
    (r"\bformer\b", "el cargo dice former"),
    (r"\bjubilad", "parece jubilado"),
    (r"\bfreelance\b|\bindependiente\b|\bautónomo\b|\bautonomo\b", "parece freelance, no empresa"),
]


# Cargos de dueno. Si uno de estos esta en el campo "position" (no solo en el
# titular, que es texto libre y mete de todo), gana a un descarte: un fundador
# que ademas es CTO o que se sienta en un consejo sigue decidiendo. No se acepta
# a ciegas, se manda a revisar, que es lo honesto.
DECISOR_FUERTE = [
    r"\bceo\b", r"chief executive", r"consejero delegado", r"managing director",
    r"\bfounder\b", r"\bfundador", r"cofound", r"co-found", r"cofundador",
    r"co-fundador", r"director[ao] ejecutiv",
    r"propietari", r"\bowner\b", r"gerente", r"director general", r"\bsocio\b",
]


def _c(patrones, texto):
    return [p for p in patrones if re.search(p, texto, re.I)]


def evalua(lead):
    """Devuelve (veredicto, motivos). veredicto: acepta | rechaza | revisar."""
    cargo = (lead.get("position") or "") + " " + (lead.get("headline") or "")
    cargo = cargo.strip()
    motivos = []

    if not cargo:
        return "revisar", ["sin cargo ni titular: no se puede valorar FIT"]

    malos = _c(RECHAZA, cargo)
    if malos:
        lista = ", ".join(m.strip("\\b") for m in malos)
        # El descarte solo gana si no es tambien el dueno del negocio.
        if _c(DECISOR_FUERTE, lead.get("position") or ""):
            motivos.append(f"CARGO MIXTO: manda en la empresa pero su funcion "
                           f"declarada es otra ({lista}). Decidir a mano si es "
                           f"el interlocutor del recorrido comercial")
            return "revisar", motivos
        motivos.append("cargo fuera del recorrido comercial: " + lista)
        return "rechaza", motivos

    if not _c(ACEPTA, cargo):
        motivos.append("el cargo no encaja en ningun decisor de la seccion 5")
        return "rechaza", motivos

    # Aceptado por cargo. A partir de aqui, avisos que no descartan solos.
    for tag in lead.get("autoTags") or []:
        nombre = tag.get("name") if isinstance(tag, dict) else str(tag)
        if nombre and "not interested" in nombre.lower():
            motivos.append("YA ETIQUETADO 'Not interested': no se le vuelve a escribir")
            return "rechaza", motivos

    for patron, aviso in SOSPECHA_EMPLEADOR:
        if re.search(patron, cargo, re.I):
            motivos.append("empleador dudoso: " + aviso)

    if not (lead.get("companyName") or "").strip():
        motivos.append("sin empresa en la ficha: verificar antes de escribir")

    motivos.append("DESCONOCIDO sin verificar a mano: tamano, ticket, volumen, "
                   "inversion, CRM")
    return ("revisar" if len(motivos) > 1 else "acepta"), motivos


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__ or "uso: filtro_fit.py candidatos.json [--out f]")
    leads = json.load(open(sys.argv[1], encoding="utf-8"))
    if isinstance(leads, dict):                      # acepta el volcado de HeyReach
        leads = [i.get("correspondentProfile", i) for i in leads.get("items", [])]

    cuenta = {"acepta": 0, "revisar": 0, "rechaza": 0}
    limpio = []
    for l in leads:
        v, motivos = evalua(l)
        cuenta[v] += 1
        quien = " ".join(filter(None, [l.get("firstName"), l.get("lastName")])) or "?"
        if v == "rechaza":
            print(f"  RECHAZA  {quien:34} {(l.get('position') or '?')[:38]:40} {motivos[0]}")
        else:
            limpio.append({**l, "_veredicto": v, "_motivos": motivos})

    tot = sum(cuenta.values()) or 1
    print(f"\n  total {tot} · acepta {cuenta['acepta']} · "
          f"revisar {cuenta['revisar']} · rechaza {cuenta['rechaza']} "
          f"({cuenta['rechaza'] * 100 // tot}%)")

    if "--out" in sys.argv:
        destino = sys.argv[sys.argv.index("--out") + 1]
        json.dump(limpio, open(destino, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print(f"  {len(limpio)} guardados en {destino}")


if __name__ == "__main__":
    main()
