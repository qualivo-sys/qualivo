# -*- coding: utf-8 -*-
# Monta el copy por lead y lo sube a las campanas de sector.
#
# El gancho de la primera linea es la ficha de Google, que es lo que de verdad
# hemos mirado: numero de resenas, nota y barrio. Es el que ya esta enviandose
# en Obra y es el unico dato del que estamos seguros, porque viene de la misma
# extraccion. Cuando la ficha tiene pocas resenas el dato no impresiona a nadie,
# asi que ahi se entra por la senal de su web.
#
# La firma va DENTRO del cuerpo: comprobado en un correo ya enviado de Obra,
# {{signature}} resuelve a vacio en esta cuenta, asi que no se duplica.
#
# NO se toca la secuencia. Las dos campanas ya la tienen creada y vacia de
# leads; en cuanto entre el primer lead, un POST de secuencia reiniciaria los
# envios. Solo se anaden leads y se activa.
import json, os, sys, time, urllib.request

S = os.path.dirname(os.path.abspath(__file__))
K = open(os.path.join(S, ".smartlead_key")).read().strip()
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
B = "https://server.smartlead.ai/api/v1"
ENVIA = "--envia" in sys.argv

CAMPANAS = {"clinicas": 3976199, "asesorias": 3976201, "formacion": 3976197}
FIRMA = "\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205"

TEXTOS = {
 "clinicas": {
   "asunto": "vuestras citas",
   "landing": ("https://qualivo.io/clinicas/?utm_source=email&utm_medium=outbound"
               "&utm_campaign=QV_OUT_CLINICAS"),
   "fuga": ("Cuando alguien pregunta precio por WhatsApp o deja sus datos en la "
            "web, lo que casi nadie tiene atado es cuántos de esos acaban "
            "pidiendo cita, ni por qué se caen los demás."),
   "caso": ("La Escola Aeronàutica de Catalunya invertía en Meta, Google y TikTok "
            "sin saber qué acababa en matrícula. Conectamos cada euro con la "
            "matrícula final: por cada euro invertido, unos diez de vuelta.\n\n"
            "Lo tienes contado aquí: https://qualivo.io/casos/eac/"),
   "cierre": "cuántas consultas de precio se están quedando sin cita",
 },
 "formacion": {
   "asunto": "vuestras matrículas",
   "landing": ("https://qualivo.io/formacion/?utm_source=email&utm_medium=outbound"
               "&utm_campaign=QV_OUT_FORMACION"),
   "fuga": ("Cuando alguien pide información de un curso y no se matricula ese "
            "mismo día, lo que casi nadie tiene atado es cuántos de esos vuelven "
            "solos, ni por qué se caen los demás."),
   # Nuria Roure es formacion y servicios online: aqui SI es el caso que toca.
   "caso": ("Nuria Roure ya tenía captación y ya tenía ventas. Su problema no era "
            "conseguir más alumnos, era saber cuáles merecían atención. Montamos "
            "la priorización y el seguimiento sin subir la inversión: 2.000 euros "
            "se convirtieron en 12.900 en ventas atribuibles al sistema.\n\n"
            "Lo tienes contado aquí: https://qualivo.io/casos/nuria-roure/"),
   "cierre": "cuántas solicitudes de información se están quedando sin cerrar",
 },
 "asesorias": {
   "asunto": "vuestros presupuestos",
   "landing": ("https://qualivo.io/asesorias/?utm_source=email&utm_medium=outbound"
               "&utm_campaign=QV_OUT_ASESORIAS"),
   "fuga": ("Cuando entra una petición por la web o os la pasa un conocido, lo "
            "que casi nadie tiene atado es cuántos de esos presupuestos acaban "
            "en alta, ni por qué se caen los demás."),
   "caso": ("BelloVinilo no tenía un sistema que arreglar, había que construirlo "
            "entero: captación, conversión, CRM, seguimiento y medición "
            "conectados de punta a punta. 3.600 euros de inversión se "
            "convirtieron en 30.000 en ventas.\n\n"
            "Lo tienes contado aquí: https://qualivo.io/casos/bellovinilo/"),
   "cierre": "cuántos presupuestos se están quedando por el camino",
 },
}


# Palabras de relleno que los negocios locales meten en la ficha de Google para
# posicionar. Se cortan por el final: "DEA Gestoria Asesoria FISCAL LABORAL
# CONTABLE LEGAL Barcelona" se queda en "DEA". Si se dejan, el correo empieza
# llamandoles por un nombre que nadie usa y canta a extraccion automatica.
RELLENO = {"fiscal", "laboral", "contable", "legal", "juridico", "jurídico",
           "mercantil", "asesoria", "asesoría", "gestoria", "gestoría",
           "consultoria", "consultoría", "abogados", "clinica", "clínica",
           "dental", "dentista", "estetica", "estética", "fisioterapia",
           "academia", "formacion", "formación", "centro", "escuela", "cursos",
           "odontologia", "odontología", "barcelona", "madrid", "y", "de",
           "en", "para", "empresas", "autonomos", "autónomos", "online"}


def limpia(n):
    import re
    n = re.split(r"\s*[|·•]\s*", n or "")[0]
    n = re.split(r"\s+[-–]\s+", n)[0]
    n = re.sub(r"[\s,]+(S\.?\s?L\.?U?\.?|S\.?\s?A\.?U?\.?)\s*$", "", n, flags=re.I)
    n = re.sub(r"\s+", " ", n).strip(" .,-")
    trozos = n.split(" ")
    # Solo se poda si el nombre es largo: "Clinica Dental Riera" se queda como
    # esta, que es como se llaman ellos.
    if len(trozos) > 3:
        while len(trozos) > 1 and trozos[-1].lower().strip(",.") in RELLENO:
            trozos.pop()
    return " ".join(trozos).strip(" .,-")


def gancho(r):
    """Primera linea. Resenas si las hay de verdad, si no la senal de su web."""
    n, nota = r.get("resenas") or 0, r.get("nota")
    emp = limpia(r["empresa"])
    if n >= 25 and nota:
        return (f"He visto la ficha de {emp} en Google: {n} reseñas y "
                f"{str(nota).replace('.', ',')} de media en {r['ciudad']}. "
                "Eso no se consigue sin que entre gente.")
    s = set(r.get("senales") or [])
    if "meta_ads" in s or "google_ads" in s:
        return (f"He estado mirando {emp} y veo que estáis invirtiendo en "
                "anuncios para traer clientes.")
    if "cita_online" in s:
        return f"He estado mirando {emp} y veo que dais cita online."
    if "whatsapp" in s:
        return f"He estado mirando {emp} y veo que atendéis por WhatsApp."
    return f"He estado mirando {emp} y veo que pedís el contacto por la web."


def copia(r):
    t = TEXTOS[r["sector"]]
    b1 = (f"Hola,\n\n{gancho(r)}\n\n"
          f"Por eso os escribo. {t['fuga']}\n\n"
          "Nosotros detectamos dónde se pierden clientes en captación y ventas, "
          "y lo arreglamos con IA dentro del sistema que ya tenéis.\n\n"
          "El primer paso es una llamada corta: me contáis cómo lo lleváis ahora "
          "y os digo qué veo.\n\n"
          f"Puedes ver cómo funciona aquí: {t['landing']}\n\n"
          f"¿Os va bien esta semana?{FIRMA}")
    b2 = (f"Hola,\n\nUn ejemplo de lo que os decía.\n\n{t['caso']}\n\n"
          "No hace falta que me creáis. Los quince minutos son para mirar "
          f"vuestro caso, no para contaros el nuestro.\n\n¿Esta semana o la que "
          f"viene?{FIRMA}")
    b3 = (f"Hola,\n\nOs escribí hace unos días y no he tenido respuesta, así que "
          "entiendo que ahora no toca y no insisto más.\n\n"
          f"Si en algún momento os pica la duda de {t['cierre']} y por qué, el "
          f"teléfono sigue siendo el mismo.{FIRMA}")
    return {"subject1": t["asunto"], "body1": b1, "body2": b2, "body3": b3}


def api(metodo, ruta, cuerpo=None):
    url = f"{B}{ruta}{'&' if '?' in ruta else '?'}api_key={K}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, headers=UA, method=metodo)
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as f:
                return json.loads(f.read().decode())
        except urllib.error.HTTPError as e:
            return {"err": f"{e.code} {e.read().decode()[:200]}"}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(3)


if __name__ == "__main__":
    for sector, cid in CAMPANAS.items():
        datos = json.load(open(os.path.join(S, f"sector_{sector}.json")))
        lote = []
        for r in datos:
            c = copia(r)
            lote.append({"email": r["email"], "company_name": limpia(r["empresa"]),
                         "website": r["web"], "phone_number": r.get("telefono") or "",
                         "custom_fields": {**c, "ciudad": r["ciudad"],
                                           "senales": ",".join(r.get("senales") or [])}})
        print(f"\n{sector}: {len(lote)} leads para la campana {cid}")
        if not ENVIA:
            print("  [seco] ejemplo:\n")
            print("  ASUNTO:", lote[0]["custom_fields"]["subject1"])
            print("  " + lote[0]["custom_fields"]["body1"].replace("\n", "\n  "))
            continue
        ok = 0
        for i in range(0, len(lote), 25):
            r = api("POST", f"/campaigns/{cid}/leads",
                    {"lead_list": lote[i:i + 25],
                     "settings": {"ignore_global_block_list": False,
                                  "ignore_unsubscribe_list": False,
                                  "ignore_duplicate_leads_in_other_campaign": False}})
            if r.get("err"):
                print("  [FALLO]", r["err"])
            else:
                ok += r.get("upload_count") or 0
                print(f"  subidos {r.get('upload_count')} · "
                      f"duplicados {r.get('already_added_to_campaign')} · "
                      f"invalidos {r.get('invalid_emails_count')}")
            time.sleep(2)
        print(f"  TOTAL cargados: {ok}")
