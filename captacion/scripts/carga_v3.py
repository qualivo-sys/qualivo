#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Carga leads en la campana motor V3 (una sola campana, copy por lead).
#
# La campana 3940264 tiene los tres pasos en variables:
#   paso 1  -> {{subject1}} / {{body1}}
#   paso 2 (+3d) -> {{body2}}   (mismo hilo, sin asunto)
#   paso 3 (+7d) -> {{body3}}   (mismo hilo, sin asunto)
# Asi no hay que volver a tocar nunca la secuencia: el copy viaja con el lead.
# Regla de oro tras el incidente de agosto: NUNCA POST de secuencia completa
# sobre una campana con leads dentro.
#
# Uso: python3 carga_v3.py <SMARTLEAD_API_KEY> <leads.json> [--dry]
#
# Formato de leads.json: lista de objetos
#   {"email":"x@y.es","first_name":"Ana","company_name":"Acme","dom":"acme.es",
#    "puerta":"crm", "v":{"crm":"HubSpot"}}
# Puertas validas: anuncios, crm, base, multiservicio, mide, direccion, comercial
# Campos de "v" que usa cada puerta:
#   crm -> crm · base -> anios · multiservicio -> l1,l2,l3 · direccion -> cargo
import json, sys, urllib.request, urllib.error, time

CAMPANA = 3940264
CAL = "https://api.leadconnectorhq.com/widget/bookings/qualivo-20"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}

# --- Email 1: asunto + primera linea por puerta -------------------------------
PUERTAS = {
 "anuncios": (
   "vuestros anuncios",
   "He estado mirando {emp} y he visto que estáis invirtiendo en anuncios. Lo que "
   "casi nadie sabe decirme es qué campaña trajo al último cliente que firmó, no el "
   "último lead."),
 "crm": (
   "vuestro {crm}",
   "He estado mirando {emp} y veo que trabajáis con {crm}. Lo normal es que ahí dentro "
   "haya oportunidades abiertas que nadie ha vuelto a tocar."),
 "base": (
   "los {anios} años de {emp}",
   "He estado mirando {emp} y lleváis {anios} años en el mercado. Eso son cientos de "
   "clientes y contactos que ya os conocen y que hoy no trabaja nadie."),
 "multiservicio": (
   "las líneas de {emp}",
   "He estado mirando {emp} y veo que lleváis varias líneas: {l1}, {l2} y {l3}. Casi "
   "siempre una tira mucho más que las demás, pero eso no se ve hasta que lo miras "
   "con datos."),
 "mide": (
   "la web de {emp}",
   "He estado mirando {dom} y tenéis analítica montada pero un solo formulario en toda "
   "la web. Es decir: alguien entra, mira y se va sin dejar rastro."),
 "direccion": (
   "tu llegada a {emp}",
   "He estado mirando {emp} y vi que llevas poco como {cargo}. Los primeros meses son "
   "cuando uno mira qué heredó y qué toca revisar."),
 "comercial": (
   "vuestro equipo comercial",
   "He estado mirando {emp} y veo que tenéis equipo comercial. Cuando hay equipo, lo "
   "que suele faltar no son oportunidades: es que lleguen bien repartidas y a tiempo."),
}

COMUN = (
 "Nosotros detectamos dónde se pierden clientes en captación y ventas, y lo arreglamos "
 "metiendo IA en el sistema que ya tenéis.\n\n"
 "El primer paso son quince minutos: me cuentas cómo lo tenéis montado y te digo qué "
 "veo. Si sale algo claro, acordamos un número que mover y lo probamos un mes. Si no "
 "se mueve, no pagáis el piloto.\n\n"
 "¿Te va bien esta semana?\n\n"
 "Maikel")

# --- Email 2: el caso, por puerta ---------------------------------------------
CASOS = {
 "anuncios": "Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar el "
             "presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads "
             "baratos que no compraban.",
 "multiservicio": "Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar "
             "el presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads "
             "baratos que no compraban.",
 "crm": "Hice la prueba en mi propio CRM hace unos días: 25 oportunidades paradas, "
        "34.500 euros declarados, en la primera pasada. Y yo me dedico a esto.",
 "direccion": "Hice la prueba en mi propio CRM hace unos días: 25 oportunidades paradas, "
        "34.500 euros declarados, en la primera pasada. Y yo me dedico a esto.",
 "base": "Una clienta tenía años de contactos y nadie detrás. No captamos ni un lead "
         "nuevo: ordenamos la base, priorizamos y perseguimos con fecha. Recuperó 6,45 "
         "veces lo que invirtió.",
 "comercial": "Una clienta tenía años de contactos y nadie detrás. No captamos ni un "
         "lead nuevo: ordenamos la base, priorizamos y perseguimos con fecha. Recuperó "
         "6,45 veces lo que invirtió.",
 "mide": "En un cliente pasamos a medir hasta la venta real en vez de hasta el "
         "formulario. Del anuncio a la matrícula: 10,2 veces.",
}

def render(t, l):
    d = {"emp": l.get("company_name") or "", "dom": l.get("dom") or "", "nom": l.get("first_name") or ""}
    d.update(l.get("v") or {})
    return t.format(**d)

def construir(l):
    p = l["puerta"]
    if p not in PUERTAS:
        raise ValueError(f"puerta desconocida: {p} ({l['email']})")
    asunto, primera = PUERTAS[p]
    nom = l.get("first_name") or ""
    saludo = f"Hola {nom}," if nom else "Hola,"
    b1 = f"{saludo}\n\n{render(primera, l)}\n\n{COMUN}"
    b2 = (f"{saludo}\n\nUn ejemplo de lo que te decía.\n\n{CASOS[p]}\n\n"
          "No hace falta que me creas. Los quince minutos son para mirar vuestro caso, no "
          "para contaros el nuestro.\n\n¿Esta semana o la que viene?\n\nMaikel")
    b3 = (f"{saludo}\n\nLo dejo aquí, pero te hago una última pregunta por si te sirve "
          f"a ti.\n\nSi tuvieras que apostar dónde se pierde más negocio en "
          f"{l.get('company_name') or 'tu empresa'} hoy: ¿captación, conversión o "
          "seguimiento?\n\nContéstame con una palabra y te digo si "
          f"coincide con lo que veo desde fuera.\n\nY si lo prefieres en directo: {CAL}"
          "\n\nMaikel")
    if len(b1.split()) > 110:
        print(f"  aviso: email 1 largo ({len(b1.split())} palabras) para {l['email']}")
    return render(asunto, l), b1, b2, b3

def main():
    key = sys.argv[1]
    leads = json.load(open(sys.argv[2]))
    dry = "--dry" in sys.argv
    payload = []
    for l in leads:
        s, b1, b2, b3 = construir(l)
        payload.append({
            "email": l["email"], "first_name": l.get("first_name") or "",
            "last_name": l.get("last_name") or "", "company_name": l.get("company_name") or "",
            "website": l.get("dom") or "",
            "custom_fields": {"subject1": s, "body1": b1, "body2": b2, "body3": b3,
                              "puerta": l["puerta"]},
        })
    if dry:
        print(json.dumps(payload[:2], ensure_ascii=False, indent=2))
        print(f"\n{len(payload)} leads listos (dry run, no se ha subido nada)")
        return
    subidos = 0
    for i in range(0, len(payload), 100):
        lote = payload[i:i + 100]
        req = urllib.request.Request(
            f"https://server.smartlead.ai/api/v1/campaigns/{CAMPANA}/leads?api_key={key}",
            data=json.dumps({"lead_list": lote,
                             "settings": {"ignore_global_block_list": False,
                                          "ignore_unsubscribe_list": False,
                                          "ignore_duplicate_leads_in_other_campaign": False}}).encode(),
            headers=UA, method="POST")
        r = json.loads(urllib.request.urlopen(req).read())
        print(f"lote {i//100 + 1}: {json.dumps(r.get('upload_count') or r)[:200]}")
        subidos += len(lote)
        time.sleep(1)
    print(f"{subidos} leads enviados a la campana {CAMPANA}")

if __name__ == "__main__":
    main()
