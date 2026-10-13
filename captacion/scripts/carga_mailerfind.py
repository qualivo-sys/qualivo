# -*- coding: utf-8 -*-
# Carga a las campanas de sector los leads que salen del embudo invertido:
# Mailerfind pone el dominio, curl verifica la senal en su web y Apollo saca
# a la persona. Solo entra quien tiene senal que yo mismo he leido en su web.
#
# El copy sigue V3: seis latidos, la senal verificada en la PRIMERA linea y
# como maximo 90 palabras en el email 1. Hay un assert por lead que lo
# comprueba, porque el 9-oct un correo se fue a 93 palabras sin que nadie lo
# viera hasta despues.
#
# NO se toca la secuencia de las campanas: ya tienen leads dentro y un POST
# de secuencia reiniciaria los envios. Solo se anaden leads.
#
# Uso:
#   python3 carga_mailerfind.py <clave_smartlead> <enriquecidos.json> <sondeo.json> [--envia]
import json, sys, time, urllib.request, urllib.error

B = "https://server.smartlead.ai/api/v1"
CAB = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
       "Content-Type": "application/json"}

FIRMA = ("\n\nMaikel"
         "\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205"
         "\n\nTus datos de contacto profesional los trato por interés legítimo "
         "(art. 19 LOPDGDD). Si no quieres más correos míos, responde BAJA y te "
         "saco al momento.")

VALOR = ("Nosotros detectamos dónde se pierden clientes en el proceso de captación "
         "y ventas, y lo arreglamos metiendo IA dentro del sistema que ya tenéis.")
# Dos versiones del latido 4+5. La larga es la de V3 palabra por palabra; la
# corta existe porque con nombres de empresa largos el email 1 se pasa de 90
# palabras, y el limite de palabras manda sobre la redaccion. Se usa la larga
# siempre que quepa.
PASO_LARGO = ("El primer paso es una llamada corta: me cuentas cómo lo tenéis montado y "
              "te digo qué veo. Si sale algo claro, lo probamos un mes sin coste y luego "
              "decidís si tiene sentido seguir.")
PASO_CORTO = ("El primer paso es una llamada corta: me cuentas cómo lo tenéis y te digo "
              "qué veo. Si sale algo, lo probamos un mes sin coste.")
CTA = "¿Te va bien esta semana?"

# La fuga que toca a cada vertical, y el caso del email 2.
FUGA = {
    "formacion": "quién persigue al que pide información y no se matricula",
    "servicios": "quién persigue al que pide presupuesto y no cierra",
}
CIERRE = {
    "formacion": "cuántas solicitudes de información se quedan sin cerrar",
    "servicios": "cuántos presupuestos se quedan por el camino",
}
CASO = {
    "formacion": ("Nuria Roure ya tenía captación y ya tenía alumnos entrando. Su problema "
                  "no era conseguir más, era saber a cuáles atender primero. Montamos la "
                  "priorización y el seguimiento sin subir la inversión: 2.000 euros se "
                  "convirtieron en 12.900 en ventas atribuibles al sistema."),
    "servicios": ("Un cliente nuestro tenía el CRM lleno y nadie lo miraba. Al ordenar el "
                  "seguimiento aparecieron 25 oportunidades paradas por 34.500 euros, sin "
                  "captar un contacto nuevo."),
}

# De la senal verificada a la frase que la afirma. El orden importa: se usa la
# primera que aparezca, de mas fuerte a mas debil.
ORDEN = ["hubspot", "zoho", "salesforce", "pipedrive", "meta", "ads", "ga4", "gtm"]
FRASE = {
    "hubspot": "lleváis HubSpot",
    "zoho": "lleváis Zoho",
    "salesforce": "lleváis Salesforce",
    "pipedrive": "lleváis Pipedrive",
    "meta": "lleváis el píxel de Meta puesto",
    "ads": "lleváis el tag de Google Ads puesto",
    "ga4": "tenéis GA4 instalado",
    "gtm": "tenéis Google Tag Manager instalado",
}
ASUNTO = {
    "hubspot": "vuestro HubSpot", "zoho": "vuestro Zoho",
    "salesforce": "vuestro Salesforce", "pipedrive": "vuestro Pipedrive",
    "meta": "vuestros anuncios", "ads": "vuestros anuncios",
    "ga4": "vuestro seguimiento", "gtm": "vuestro seguimiento",
}
# Por que esa senal me hace pensar que hay margen. Es el latido 2 de V3.
DUDA = {
    "hubspot": "Con el CRM montado,", "zoho": "Con el CRM montado,",
    "salesforce": "Con el CRM montado,", "pipedrive": "Con el CRM montado,",
    "meta": "Si pagáis por cada contacto,", "ads": "Si pagáis por cada contacto,",
    "ga4": "Midiendo el tráfico,", "gtm": "Midiendo el tráfico,",
}


def palabras(t):
    return len(t.split())


def mejor_senal(senales):
    for s in ORDEN:
        if s in senales:
            return s
    return ""


def monta(lead, senales):
    v = lead["vertical"]
    s = mejor_senal(senales)
    if not s:
        raise SystemExit(f"{lead['dominio']}: sin senal verificada, no entra")
    def cuerpo1(paso):
        return (f"Hola {lead['nombre']},\n\n"
                f"He mirado {lead['empresa']} y {FRASE[s]}.\n\n"
                f"{DUDA[s]} lo que casi nadie ata es {FUGA[v]}.\n\n"
                f"{VALOR}\n\n{paso}\n\n{CTA}")

    # El limite de V3 son 90 palabras y la firma no cuenta: es firma, no mensaje.
    b1 = cuerpo1(PASO_LARGO)
    if palabras(b1) > 90:
        b1 = cuerpo1(PASO_CORTO)
    n = palabras(b1)
    assert n <= 90, f"{lead['dominio']}: email 1 con {n} palabras, el limite son 90"
    b2 = (f"Hola {lead['nombre']},\n\nUn ejemplo de lo que te decía.\n\n{CASO[v]}\n\n"
          "No hace falta que me creas. Los quince minutos son para mirar vuestro "
          "caso, no para contaros el nuestro.\n\n¿Esta semana o la que viene?")
    b3 = (f"Hola {lead['nombre']},\n\nTe escribí hace unos días y no he tenido "
          "respuesta, así que entiendo que ahora no toca y no insisto más.\n\n"
          f"Si en algún momento te pica la duda de {CIERRE[v]} y por qué, el "
          "teléfono sigue siendo el mismo.")
    return {
        "first_name": lead["nombre"], "last_name": lead["apellido"],
        "email": lead["email"], "company_name": lead["empresa"],
        "website": lead["dominio"],
        "custom_fields": {
            "subject1": ASUNTO[s],
            "body1": b1 + FIRMA,
            "body2": b2 + FIRMA,
            "body3": b3 + FIRMA,
            "senal": "+".join(senales),
            "puerta": s,
            "vertical": v,
            "origen": "mailerfind+curl+apollo",
        },
        "_palabras": n,
    }


def main():
    key, f_enr, f_son = sys.argv[1], sys.argv[2], sys.argv[3]
    envia = "--envia" in sys.argv
    son = {r["dominio"]: r for r in json.load(open(f_son))}
    leads = json.load(open(f_enr))

    por_campana = {}
    for l in leads:
        s = son.get(l["dominio"])
        if not s:
            print(f"  SIN SONDEO, fuera: {l['dominio']}")
            continue
        fila = monta(l, s["senales"])
        print(f"  {l['email']:44} {fila['custom_fields']['puerta']:9} "
              f"{fila['_palabras']:2} palabras  -> {l['cid']}")
        fila.pop("_palabras")
        por_campana.setdefault(l["cid"], []).append(fila)

    print(f"\nlistos: {sum(len(v) for v in por_campana.values())} leads en "
          f"{len(por_campana)} campanas")
    if not envia:
        print("ensayo. Para subirlos de verdad: --envia")
        return

    for cid, filas in por_campana.items():
        cuerpo = json.dumps({
            "lead_list": filas,
            "settings": {"ignore_global_block_list": False,
                         "ignore_unsubscribe_list": False,
                         "ignore_duplicate_leads_in_other_campaign": False},
        }).encode()
        req = urllib.request.Request(f"{B}/campaigns/{cid}/leads?api_key={key}",
                                     data=cuerpo, headers=CAB, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                print(f"campana {cid}: {r.read().decode()[:300]}")
        except urllib.error.HTTPError as e:
            print(f"campana {cid}: HTTP {e.code} {e.read().decode()[:300]}")
        time.sleep(2)


if __name__ == "__main__":
    main()
