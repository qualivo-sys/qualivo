# -*- coding: utf-8 -*-
# Reactiva los leads dormidos como pidio Maikel: "entra todo, adapta el mensaje
# a cada uno". No despausa las campanas viejas, porque reanudar una campana con
# leads a medias reinicia secuencias y duplica correos. En su lugar reescribe el
# copy en V3 con la senal verificada de cada lead y los carga en las campanas
# de Intelligence, que son las vivas y las que miden 4,9%.
#
# Reglas que se aplican sin excepcion:
#  - sin senal verificada el lead NO entra (no hay primera linea honesta)
#  - email 1 maximo 90 palabras, comprobado con un assert por lead
#  - nunca se hace POST de secuencia: solo se anaden leads
#
# Uso: python3 carga_dormidos.py <clave> [--envia]
import json, sys, time, urllib.request, urllib.error

B = "https://server.smartlead.ai/api/v1"
CAB = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
       "Content-Type": "application/json"}
DESTINO = {"servicios": 4042995, "formacion": 4042994, "clinica": 4042992}

FIRMA = ("\n\nMaikel"
         "\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205"
         "\n\nTus datos de contacto profesional los trato por interés legítimo "
         "(art. 19 LOPDGDD). Si no quieres más correos míos, responde BAJA y te "
         "saco al momento.")
VALOR = ("Nosotros detectamos dónde se pierden clientes en el proceso de captación "
         "y ventas, y lo arreglamos metiendo IA dentro del sistema que ya tenéis.")
PASO_LARGO = ("El primer paso es una llamada corta: me cuentas cómo lo tenéis montado y "
              "te digo qué veo. Si sale algo claro, lo probamos un mes sin coste y luego "
              "decidís si tiene sentido seguir.")
PASO_CORTO = ("El primer paso es una llamada corta: me cuentas cómo lo tenéis y te digo "
              "qué veo. Si sale algo, lo probamos un mes sin coste.")
VALOR_CORTO = ("Nosotros detectamos dónde se pierden clientes en captación y ventas, y lo arreglamos dentro del sistema que ya tenéis.")
CTA = "¿Te va bien esta semana?"
FUGA = {"formacion": "quién persigue al que pide información y no se matricula",
        "servicios": "quién persigue al que pide presupuesto y no cierra",
        "clinica":   "quién persigue al que pide precio y no coge cita"}
CIERRE = {"formacion": "cuántas solicitudes de información se quedan sin cerrar",
          "servicios": "cuántos presupuestos se quedan por el camino",
          "clinica":   "cuántas consultas de precio se quedan sin cita"}
CASO = {
 "formacion": ("Nuria Roure ya tenía captación y ya tenía alumnos entrando. Su problema "
               "no era conseguir más, era saber a cuáles atender primero. Montamos la "
               "priorización y el seguimiento sin subir la inversión: 2.000 euros se "
               "convirtieron en 12.900 en ventas atribuibles al sistema."),
 "servicios": ("Un cliente nuestro tenía el CRM lleno y nadie lo miraba. Al ordenar el "
               "seguimiento aparecieron 25 oportunidades paradas por 34.500 euros, sin "
               "captar un contacto nuevo."),
 "clinica":   ("La Escola Aeronàutica de Catalunya invertía en Meta, Google y TikTok sin "
               "saber qué acababa en matrícula. Conectamos cada euro con la matrícula "
               "final: por cada euro invertido, unos diez de vuelta."),
}
# De mas fuerte a mas debil. Se usa la primera que tenga el lead.
ORDEN = ["hubspot","salesforce","zoho","pipedrive","odoo","mailchimp","brevo",
         "meta","ads","google-ads","ga4","gtm"]
FRASE = {"hubspot":"lleváis HubSpot","salesforce":"lleváis Salesforce",
         "zoho":"lleváis Zoho","pipedrive":"lleváis Pipedrive","odoo":"lleváis Odoo",
         "mailchimp":"lleváis Mailchimp","brevo":"lleváis Brevo",
         "meta":"lleváis el píxel de Meta puesto",
         "ads":"lleváis el tag de Google Ads puesto",
         "google-ads":"lleváis el tag de Google Ads puesto",
         "ga4":"tenéis GA4 instalado","gtm":"tenéis Google Tag Manager instalado"}
DUDA = {"hubspot":"Con el CRM montado,","salesforce":"Con el CRM montado,",
        "zoho":"Con el CRM montado,","pipedrive":"Con el CRM montado,",
        "odoo":"Con el CRM montado,","mailchimp":"Con la lista montada,",
        "brevo":"Con la lista montada,","meta":"Si pagáis por cada contacto,",
        "ads":"Si pagáis por cada contacto,","google-ads":"Si pagáis por cada contacto,",
        "ga4":"Midiendo el tráfico,","gtm":"Midiendo el tráfico,"}
ASUNTO = {"hubspot":"vuestro HubSpot","salesforce":"vuestro Salesforce",
          "zoho":"vuestro Zoho","pipedrive":"vuestro Pipedrive","odoo":"vuestro Odoo",
          "mailchimp":"vuestro Mailchimp","brevo":"vuestro Brevo",
          "meta":"vuestros anuncios","ads":"vuestros anuncios",
          "google-ads":"vuestros anuncios","ga4":"vuestro seguimiento",
          "gtm":"vuestro seguimiento"}

def palabras(t): return len(t.split())

def mejor(senales):
    for s in ORDEN:
        if s in senales: return s
    return ""

def monta(lead, senales, vertical):
    s = mejor(senales)
    if not s: return None
    def cuerpo1(paso, valor):
        return (f"Hola {lead['nombre']},\n\n"
                f"He mirado {lead['empresa']} y {FRASE[s]}.\n\n"
                f"{DUDA[s]} lo que casi nadie ata es {FUGA[vertical]}.\n\n"
                f"{valor}\n\n{paso}\n\n{CTA}")
    for paso, valor in ((PASO_LARGO, VALOR), (PASO_CORTO, VALOR),
                        (PASO_CORTO, VALOR_CORTO)):
        b1 = cuerpo1(paso, valor)
        if palabras(b1) <= 90:
            break
    n = palabras(b1)
    assert n <= 90, f"{lead['email']}: email 1 con {n} palabras, el limite son 90"
    b2 = (f"Hola {lead['nombre']},\n\nUn ejemplo de lo que te decía.\n\n{CASO[vertical]}\n\n"
          "No hace falta que me creas. Los quince minutos son para mirar vuestro "
          "caso, no para contaros el nuestro.\n\n¿Esta semana o la que viene?")
    b3 = (f"Hola {lead['nombre']},\n\nTe escribí hace unos días y no he tenido "
          "respuesta, así que entiendo que ahora no toca y no insisto más.\n\n"
          f"Si en algún momento te pica la duda de {CIERRE[vertical]} y por qué, el "
          "teléfono sigue siendo el mismo.")
    return {"first_name": lead["nombre"], "last_name": lead.get("apellido") or "",
            "email": lead["email"], "company_name": lead["empresa"],
            "website": lead.get("dominio") or lead["email"].split("@")[-1],
            "custom_fields": {"subject1": ASUNTO[s], "body1": b1 + FIRMA,
                              "body2": b2 + FIRMA, "body3": b3 + FIRMA,
                              "senal": "+".join(senales), "puerta": s,
                              "vertical": vertical,
                              "origen": "reactivacion-dormidos-14oct"},
            "_pal": n, "_puerta": s}


import re as _re
# Muchos "nombres de empresa" de Infoproducto son el usuario de Instagram
# (nomadito_, albaalonso_saludintegrativa). Escribir "He mirado nomadito_"
# delata la maquina, asi que en esos casos se usa el dominio limpio.
def nombre_empresa(lead, dominio):
    e = (lead.get("empresa") or "").strip()
    parece_usuario = bool(_re.fullmatch(r"[a-z0-9._]+", e)) or "_" in e
    if e and not parece_usuario:
        return e
    base = dominio.split(".")[0].replace("-", " ")
    return base[:1].upper() + base[1:]

CLAVES_FORM = ("academia","coach","coaching","formacion","escuela","curso","school",
               "psicolog","mentor","instituto","master","aprend","edu","learn")
CLAVES_CLIN = ("clinic","dental","estetic","fisio","salud","medic","nutri","podolog",
               "psico","belleza","beauty","brow","spa")
def vertical_de(lead, dominio):
    t = f"{lead.get('empresa','')} {dominio}".lower()
    def hay(claves):
        for k in claves:
            # Las de 4 letras o menos solo valen como palabra suelta; si no,
            # "spa" dentro de "Espana" manda una empresa de software a clinicas.
            pat = rf"\b{k}\b" if len(k) <= 4 else k
            if _re.search(pat, t):
                return True
        return False
    if hay(CLAVES_CLIN): return "clinica"
    if hay(CLAVES_FORM): return "formacion"
    return "servicios"


def main():
    key = sys.argv[1]
    envia = "--envia" in sys.argv

    virgenes = json.load(open("dormidos_virgenes.json"))
    sondeo = {r["email"]: r for r in json.load(open("sondeo_dormidos.json"))}
    # Senal de la campana de origen, cuando la campana ERA la senal.
    DE_ORIGEN = {"meta": ["meta"], "salesforce": ["salesforce"], "mailchimp": ["mailchimp"],
                 "odoo": ["odoo"], "brevo": ["brevo"], "google-ads": ["google-ads"]}

    por_campana = {}
    fuera = []
    for l in virgenes:
        dom = l["email"].split("@")[-1].lower().replace("www.", "")
        s = sondeo.get(l["email"])
        senales = DE_ORIGEN.get(l["senal"]) or (s or {}).get("sondeo") or []
        if not senales:
            motivo = "web no responde" if (s and not str(s.get("http","")).startswith("2")) \
                     else "web sin ninguna senal"
            fuera.append((l["email"], l["senal"], motivo)); continue
        lead = dict(l)
        lead["empresa"] = nombre_empresa(l, dom)
        lead["dominio"] = dom
        v = vertical_de(l, dom)
        fila = monta(lead, senales, v)
        if not fila:
            fuera.append((l["email"], l["senal"], "senal no mapeada")); continue
        por_campana.setdefault(DESTINO[v], []).append(fila)

    tot = sum(len(v) for v in por_campana.values())
    print(f"ENTRAN: {tot} leads")
    for cid, filas in sorted(por_campana.items()):
        pal = [f["_pal"] for f in filas]
        puertas = {}
        for f in filas: puertas[f["_puerta"]] = puertas.get(f["_puerta"], 0) + 1
        print(f"  campana {cid}: {len(filas):4} leads · palabras {min(pal)}-{max(pal)} · {puertas}")
    print(f"\nNO ENTRAN: {len(fuera)}")
    mot = {}
    for _, _, m in fuera: mot[m] = mot.get(m, 0) + 1
    for m, n in sorted(mot.items(), key=lambda x: -x[1]): print(f"  {n:4}  {m}")

    print("\n--- tres correos de muestra, enteros ---")
    for cid, filas in sorted(por_campana.items()):
        f = filas[0]
        print(f"\n### campana {cid} · asunto: {f['custom_fields']['subject1']}")
        print(f["custom_fields"]["body1"].split("\n\n--\n")[0])

    if not envia:
        print("\n\nENSAYO. No se ha cargado nada. Para cargar de verdad: --envia")
        return

    for cid, filas in sorted(por_campana.items()):
        for f in filas: f.pop("_pal", None); f.pop("_puerta", None)
        for i in range(0, len(filas), 100):
            lote = filas[i:i+100]
            cuerpo = json.dumps({"lead_list": lote,
                "settings": {"ignore_global_block_list": False,
                             "ignore_unsubscribe_list": False,
                             "ignore_duplicate_leads_in_other_campaign": True}}).encode()
            req = urllib.request.Request(f"{B}/campaigns/{cid}/leads?api_key={key}",
                                         data=cuerpo, headers=CAB, method="POST")
            try:
                with urllib.request.urlopen(req, timeout=180) as r:
                    print(f"campana {cid} lote {i//100+1}: {r.read().decode()[:220]}")
            except urllib.error.HTTPError as e:
                print(f"campana {cid} lote {i//100+1}: HTTP {e.code} {e.read().decode()[:220]}")
            time.sleep(3)


if __name__ == "__main__":
    main()
