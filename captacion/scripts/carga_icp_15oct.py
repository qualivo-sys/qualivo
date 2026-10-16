# -*- coding: utf-8 -*-
# Carga de la base ICP del 14-oct (cuentas A con decisor) en las campanas vivas.
# Copy V1: senal comprobada hoy por curl -> la pregunta que casi nadie sabe
# responder -> UN caso -> plan por escrito en 48 h. Sin "IA", sin precios, sin
# rayas largas, email 1 de 90 palabras como maximo (assert por lead).
#
# Entrada: enriquecidos.json  [{email, nombre, empresa, dominio, tipologia,
#                                cargo, email_status}]
#          probe_picks_15oct.json  {dominio: {senales: [...]}}
#          manuales.json (opcional) leads con secuencia escrita a mano
# Uso: python3 carga_icp_15oct.py <clave> <dir_datos> [--envia]
# Nunca hace POST de secuencia: solo anade leads con custom_fields.
import json, sys, time, re, urllib.request, urllib.error

B = "https://server.smartlead.ai/api/v1"
CAB = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
       "Content-Type": "application/json"}
DESTINO = {"Clínicas y salud": 4042992, "Formación": 4042994}
POR_DEFECTO = 4042995  # Servicios B2B · Intelligence

FIRMA = ("\n\nMaikel"
         "\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205"
         "\n\nTus datos de contacto profesional los trato por interés legítimo "
         "(art. 19 LOPDGDD). Si no quieres más correos míos, responde BAJA y te "
         "saco al momento.")
BLOQUEADOS = {"growitschool.com", "growthhackingcourse.io", "anticbarcelona113.es",
              "formacion.ninja", "kubysoft.com", "escolaeronauticadecatalunya.cat"}
ROL = re.compile(r"^(info|hola|contacto|admin|ventas|comercial|marketing|rrhh|"
                 r"office|hello|sales|soporte|support|recepcion|clinica|secretaria)@")

# (ultimo que firma, ultimo que entra, uno que entra, cuantos se pierden, plural)
VOC = {
 "Formación": ("el último alumno que se matriculó", "la última solicitud de información",
               "una solicitud de información", "cuántas solicitudes de información", "solicitudes de información"),
 "Clínicas y salud": ("el último paciente que empezó tratamiento", "la última consulta de precio",
               "una consulta de precio", "cuántas consultas de precio", "consultas de precio"),
 "Reformas y hogar": ("la última obra que firmasteis", "el último presupuesto",
               "un presupuesto", "cuántos presupuestos", "presupuestos"),
 "Inmobiliaria": ("la última operación que cerrasteis", "el último contacto",
               "un contacto", "cuántos contactos", "contactos"),
 "Automoción": ("el último coche que vendisteis", "el último contacto",
               "un contacto", "cuántos contactos", "contactos"),
 "Servicios profesionales": ("el último cliente que firmó", "la última consulta",
               "una consulta", "cuántas consultas", "consultas"),
 "Retail con tienda (hogar)": ("el último cliente que compró", "el último contacto",
               "un contacto", "cuántos contactos", "contactos"),
}
DEF_VOC = ("el último cliente que firmó", "el último contacto", "un contacto",
           "cuántas oportunidades", "oportunidades")

def limpia(e):
    e = re.split(r"\s[|\u2013\u2014-]\s|\s\|", e)[0]
    e = re.sub(r"[#®™]", "", e)
    e = re.sub(r",?\s+(S\.?L\.?U?|S\.?A\.?U?)\.?$", "", e, flags=re.I).strip()
    return e

CRM = {"hubspot": "HubSpot", "salesforce": "Salesforce", "zoho": "Zoho",
       "pipedrive": "Pipedrive", "activecampaign": "ActiveCampaign"}
ADS = {"ads": "la conversión de Google Ads", "meta": "el píxel de Meta"}

def palabras(t): return len(t.split())

def senal_principal(s):
    for c in CRM:
        if c in s: return "crm", CRM[c]
    for a in ADS:
        if a in s: return "ads", ADS[a]
    return None, None

def monta(l, senales):
    tipo, nombre_senal = senal_principal(senales)
    if not tipo: return None
    firma_cli, entra, uno, cuantos, plural = VOC.get(l["tipologia"], DEF_VOC)
    n, e = l["nombre"], limpia(l["empresa"])
    if tipo == "crm":
        asunto = f"vuestro {nombre_senal}"
        a = f"He mirado {e} y trabajáis con {nombre_senal}."
        b = (f"Una prueba que hago mucho: contar {cuantos} se han quedado sin "
             "siguiente paso.")
        c = ("En nuestro propio CRM aparecieron 25 oportunidades paradas con 34.500 "
             "euros declarados, en el primer repaso. ¿Cuántas habría en el vuestro?")
    else:
        asunto = "vuestros anuncios"
        a = f"He mirado {e} y lleváis {nombre_senal}: pagáis por cada {uno.split(' ',1)[1]}."
        b = (f"La pregunta que casi nadie sabe responder: ¿qué campaña trajo "
             f"{firma_cli}? No {entra}.")
        c = "A una cuenta así le dimos la vuelta: de 0,1 a 7,6 de retorno con el mismo presupuesto."
    d = "Si te sirve, lo miro desde fuera y te paso lo que vea por escrito, en 48 horas. Gratis."
    b1 = f"Hola {n},\n\n{a}\n\n{b}\n\n{c}\n\n{d}"
    assert palabras(b1) <= 90, f"{l['email']}: {palabras(b1)} palabras"
    assert "—" not in b1 and "–" not in b1 and not re.search(r"\bIA\b", b1)
    b2 = (f"Hola {n},\n\nUn caso parecido. A una clienta le hicimos solo una cosa: perseguir "
          "bien lo que ya tenía, sin captar un solo contacto más. Recuperó 6,45 veces lo "
          f"invertido.\n\nEn {e} seguro que hay {plural} de este año que nadie ha vuelto a "
          "llamar.\n\n¿Lo vemos esta semana o la que viene?")
    b3 = (f"Hola {n},\n\nÚltima y te dejo tranquilo. Cuando {uno} se pierde en {e}, "
          "¿dónde suele ser? ¿En la respuesta, en el seguimiento o en la propuesta?\n\n"
          "Si me dices cuál, te cuento cómo lo hemos cerrado en otros casos. O si "
          "prefieres hablarlo, 20 minutos aquí: "
          "https://api.leadconnectorhq.com/widget/bookings/qualivo-20")
    return {"first_name": n, "last_name": l.get("apellido") or "", "email": l["email"],
            "company_name": e, "website": l["dominio"],
            "custom_fields": {"subject1": asunto, "body1": b1 + FIRMA, "body2": b2 + FIRMA,
                              "body3": b3 + FIRMA, "senal": "+".join(senales),
                              "puerta": tipo, "vertical": l["tipologia"],
                              "origen": "base-icp-14oct"}}

def main():
    key, d = sys.argv[1], sys.argv[2]
    envia = "--envia" in sys.argv
    gente = json.load(open(f"{d}/enriquecidos.json"))
    probe = json.load(open(f"{d}/probe_picks_15oct.json"))
    enviados = set(json.load(open(f"{d}/enviados_reales.json"))["correos"])
    try: manuales = json.load(open(f"{d}/manuales.json"))
    except FileNotFoundError: manuales = []
    por, fuera = {}, []
    for l in gente:
        em = (l.get("email") or "").lower()
        dom = l["dominio"]
        motivo = (not em and "sin correo") or (l.get("email_status") != "verified" and "correo no verificado") \
            or (ROL.match(em) and "buzón de rol") or (em.split("@")[-1] != dom and "dominio cruzado") \
            or (dom in BLOQUEADOS and "cliente bloqueado") or (em in enviados and "ya contactado")
        if motivo: fuera.append((em or l["empresa"], motivo)); continue
        fila = monta(l, probe.get(dom, {}).get("senales", []))
        if not fila: fuera.append((em, "web sin señal comprobable")); continue
        por.setdefault(DESTINO.get(l["tipologia"], POR_DEFECTO), []).append(fila)
    for m in manuales:
        por.setdefault(POR_DEFECTO, []).append(m)
    print(f"ENTRAN {sum(len(v) for v in por.values())}: " + ", ".join(f"{c}={len(v)}" for c, v in por.items()))
    mot = {}
    for _, m in fuera: mot[m] = mot.get(m, 0) + 1
    print("NO ENTRAN", len(fuera), mot)
    for c, v in por.items():
        print(f"\n### {c} · asunto: {v[0]['custom_fields']['subject1']}\n{v[0]['custom_fields']['body1'].split(chr(10)+chr(10)+'--')[0]}")
    if not envia:
        print("\nENSAYO: no se ha cargado nada. Para cargar: --envia"); return
    for c, filas in por.items():
        cuerpo = json.dumps({"lead_list": filas, "settings": {"ignore_global_block_list": False,
                 "ignore_unsubscribe_list": False, "ignore_duplicate_leads_in_other_campaign": True}}).encode()
        r = urllib.request.Request(f"{B}/campaigns/{c}/leads?api_key={key}", data=cuerpo, headers=CAB, method="POST")
        try:
            with urllib.request.urlopen(r, timeout=180) as x: print(c, x.read().decode()[:220])
        except urllib.error.HTTPError as e:
            print(c, "HTTP", e.code, e.read().decode()[:220])
        time.sleep(3)

if __name__ == "__main__":
    main()
