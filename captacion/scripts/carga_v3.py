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
# Puertas validas: anuncios, google_ads, linkedin_ads, meta_ads, crm, base,
#                  multiservicio, mide, direccion, comercial
#
# Filtro de buzones de rol (aplicar ANTES de enriquecer en Apollo): quedan fuera
# info, contacto, hola, admin, ventas, comercial, soporte, marketing, rrhh,
# secretaria, gestion, DIRECCION y GERENCIA. Los dos ultimos se anadieron el
# 14-sep: direccion@empleabilidadett.es reboto y ese rebote se paga en
# reputacion de dominio, no en un lead perdido.
# Campos de "v" que usa cada puerta:
#   crm -> crm · base -> anios · multiservicio -> l1,l2,l3 · direccion -> cargo
import json, re, sys, urllib.request, urllib.error, time

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

 "google_ads": (
   "vuestro Google Ads",
   "He estado mirando {emp} y veo que estáis comprando tráfico en Google. Lo que casi "
   "nadie sabe decirme es qué campaña trajo al último cliente que firmó, no el último "
   "lead."),
 "linkedin_ads": (
   "vuestros anuncios en LinkedIn",
   "He estado mirando {emp} y veo que estáis invirtiendo en LinkedIn. Ahí el clic se "
   "paga caro, así que lo que duele no es el coste por lead: es no saber cuál de esas "
   "campañas acabó en cliente."),
 "meta_ads": (
   "vuestros anuncios en Meta",
   "He estado mirando {emp} y veo que tenéis el píxel de Meta trabajando. Lo que casi "
   "nadie sabe decirme es qué campaña trajo al último cliente que firmó, no el último "
   "lead."),
 "comercial": (
   "vuestro equipo comercial",
   "He estado mirando {emp} y veo que tenéis equipo comercial. Cuando hay equipo, lo "
   "que suele faltar no son oportunidades: es que lleguen bien repartidas y a tiempo."),
}

# Texto literal de estrategia/mensajes-v3.md (orden de Maikel del 11-sep).
# El desriesgo es "un mes sin coste", NO "no pagais el piloto": el piloto no se
# ofrece en frio (propuesta-valor-v1.md). Corregido el 16-sep.
# Las dos URLs van enteras y a la vista, no escondidas tras un texto: un enlace
# que tapa su destino es el patron del phishing. Viendo qualivo.io en las dos se
# lee que hay una empresa detras. Las dos son del mismo dominio desde el 16-sep,
# cuando se monto qualivo.io/llamada (mismo calendario zBlsw8BEKA2zah81YlOl).
DIAG = "https://qualivo.io/diagnostico/"
LLAMADA = "https://qualivo.io/llamada/"

# Firma en texto. No lleva logo ni iconos de redes a proposito: son imagenes, y
# las imagenes en un correo frio cuestan bandeja de entrada.
FIRMA = ("--\n"
         "Maikel Echevarría · CEO\n"
         "Qualivo · qualivo.io\n"
         "663 375 205")

COMUN = (
 "Nosotros detectamos dónde se pierden clientes en el proceso de captación y ventas, "
 "y lo arreglamos metiendo IA dentro del sistema que ya tenéis.\n\n"
 "El primer paso es una llamada corta: me cuentas cómo lo tenéis montado y te digo "
 "qué veo. Si sale algo claro, lo probamos un mes sin coste y luego decidís si tiene "
 "sentido seguir.\n\n"
 f"Puedes ver cómo funciona aquí: {DIAG}\n"
 f"Y si prefieres que hablemos, son quince minutos: {LLAMADA}\n\n"
 "¿Te va bien esta semana?\n\n"
 f"{FIRMA}")

# --- Email 2: el caso, por puerta ---------------------------------------------
CASOS = {
 "anuncios": "Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar el "
             "presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads "
             "baratos que no compraban.",
 "multiservicio": "Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar "
             "el presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads "
             "baratos que no compraban.",

 "google_ads": "Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar el "
             "presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads "
             "baratos que no compraban.",
 "meta_ads": "Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar el "
             "presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads "
             "baratos que no compraban.",
 "linkedin_ads": "En un cliente pasamos a medir hasta la venta real en vez de hasta el "
             "formulario. Del anuncio a la matrícula: 10,2 veces.",
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

def limpia_empresa(n):
    """Deja el nombre comercial, no el eslogan. Apollo devuelve cosas como
    'Translinguo Global, Agencia de Traduccion y Localizacion': el email suena
    a robot si le metes eso dentro de una frase."""
    n = re.split(r"\s*[|·•☛►≡]\s*", n)[0]
    n = re.sub(r"\s*\([^)]*\)\s*$", "", n)
    if len(n) > 30:
        for sep in (",", " - ", " – "):
            if sep in n and len(n.split(sep)[0].strip()) >= 4:
                n = n.split(sep)[0]
                break
    n = re.sub(r"[®™©]", "", n)
    # la forma juridica solo se quita si va suelta: "URBINCASA" no es "URBINCA" + SA
    n = re.sub(r"[\s,]+(S\.?\s?L\.?U?\.?|S\.?\s?A\.?U?\.?)\s*$", "", n, flags=re.I)
    return re.sub(r"\s+", " ", n).strip(" .,-")

def render(t, l):
    d = {"emp": limpia_empresa(l.get("company_name") or ""), "dom": l.get("dom") or "", "nom": l.get("first_name") or ""}
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
          f"para contaros el nuestro.\n\n¿Esta semana o la que viene?\n\n{FIRMA}")
    b3 = (f"{saludo}\n\nLo dejo aquí, pero te hago una última pregunta por si te sirve "
          f"a ti.\n\nSi tuvieras que apostar dónde se pierde más negocio en "
          f"{limpia_empresa(l.get('company_name') or '') or 'tu empresa'} hoy: ¿captación, conversión o "
          "seguimiento?\n\nContéstame con una palabra y te digo si "
          f"coincide con lo que veo desde fuera.\n\nY si lo prefieres en directo: {LLAMADA}"
          f"\n\n{FIRMA}")
    # el limite de 90 palabras de Maikel es sobre la PROSA: las URLs y la firma
    # no son texto que nadie lea como frase, y contarlas daba falsos avisos.
    prosa = b1.split(f"Puedes ver cómo funciona")[0]
    if len(prosa.split()) > 95:
        print(f"  aviso: email 1 largo ({len(prosa.split())} palabras) para {l['email']}")
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
    if "--out" in sys.argv:
        destino = sys.argv[sys.argv.index("--out") + 1]
        json.dump(payload, open(destino, "w", encoding="utf-8"), ensure_ascii=False)
        print(f"{len(payload)} leads escritos en {destino} (no se ha subido nada)")
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
