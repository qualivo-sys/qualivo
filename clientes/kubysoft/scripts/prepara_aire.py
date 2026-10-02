# -*- coding: utf-8 -*-
# De las fichas crudas de Maps a una lista revisable para la reunion con Marc.
#
# Reutiliza tal cual la lectura de web (prepara_sector.mira) y el filtro de
# correos (limpia_correos.vale) de captacion/scripts/. Lo unico propio de
# Kubysoft es a quien se descarta, que es lo que cambia por sector.
#
# El orden es el mismo del plan y por el mismo motivo: primero se tira lo que
# nunca deberia entrar y DESPUES se sale a internet. Al reves se gastan minutos
# leyendo webs de empresas que ibamos a tirar igual.
#
# Lo que este script NO hace, a proposito: no carga nada en ninguna campana.
# El brief de Kubysoft esta a medias y no tenemos su fichero de exclusiones, asi
# que la lista se queda en disco para que la mire Marc.
import csv, json, os, re, sys
import concurrent.futures as cf
from collections import Counter

S = os.path.dirname(os.path.abspath(__file__))
KUBY = os.path.dirname(S)
DATOS = os.path.join(KUBY, "datos")
COMPARTIDO = os.path.join(os.path.dirname(os.path.dirname(KUBY)),
                          "captacion", "scripts")
sys.path.insert(0, COMPARTIDO)

from prepara_sector import mira            # noqa: E402
from limpia_correos import vale            # noqa: E402

# Lo que en clima ensucia la extraccion, que no es lo mismo que en clinicas.
# Tres familias, y cada una entra por un motivo distinto:
#
#   fabricantes    Daikin y compania salen en Maps por sus delegaciones y sus
#                  servicios oficiales. No son SAT pequenos, son la marca.
#   mayoristas     suministros y distribuidores. Venden al instalador, no son
#                  el instalador. Es justo la basura que daba Apollo.
#   portales       Habitissimo y similares son mercados de leads. Escribirles no
#                  solo no sirve, ademas reciben correo frio todos los dias y
#                  queman el dominio de envio.
FABRICANTE = re.compile(
    r"\b(daikin|mitsubishi|fujitsu|panasonic|toshiba|hitachi|carrier|lg\s|"
    r"samsung|haier|midea|hisense|gree|saunier\s*duval|vaillant|junkers|"
    r"bosch|ferroli|baxi|ariston|de\s*longhi|airzone|jung|hiyasu)\b", re.I)

MAYORISTA = re.compile(
    r"\b(salvador\s*escoda|suministros|distribuidor|distribuciones|mayorista|"
    r"almacen(es)?|comercial\s+de|recambios|repuestos|import(aciones)?)\b", re.I)

PORTAL = re.compile(
    r"\b(habitissimo|cronoshare|milanuncios|paginasamarillas|paginas\s*amarillas|"
    r"yelp|trovit|indeed|infojobs|certicalia|reformas\.?com|obrasyreformas|"
    r"wikipedia|facebook|instagram|linkedin|tripadvisor|guiaempresas|"
    r"einforma|axesor|iberinform|empresite)\b", re.I)

# Grandes superficies y utilities que tambien instalan clima. No son SAT.
#
# electro depot entro en la lista despues de verlo colado como primera fila del
# primer CSV, con 1451 resenas y una web de localizador de tiendas. Los filtros
# de cadena solo cogen lo que alguien ha visto antes, asi que esta lista crece
# mirando la salida, no adivinando.
GRANDE = re.compile(
    r"\b(leroy\s*merlin|bricodepot|brico\s*depot|bricomart|media\s*markt|worten|"
    r"el\s*corte\s*ingles|carrefour|endesa|iberdrola|naturgy|repsol|holaluz|"
    r"totalenergies|securitas\s*direct|electro\s*depot|electrodepot|conforama|"
    r"ikea|pc\s*componentes|pccomponentes|amazon|milar|tien\s*21|expert)\b", re.I)


# Talleres de coche. Entran porque "servicio tecnico aire acondicionado" tambien
# devuelve quien te recarga el clima del coche. No son el ICP de Kubysoft: son
# taller fijo, no empresa con tecnicos desplazados, avisos y contratos de
# mantenimiento. En el primer lote eran 6 de 146.
# La primera version de esta lista solo cogia "taller" y "automocion", y en las
# ciudades de la fase 2 se colaron Danara Motor, INTER AUTO ANDALUCIA y
# ATLANTICO AUTOCENTROS: ninguno dice taller. Van tambien auto, motor y
# autocentro, que es como se llaman de verdad.
# Ojo con los limites de palabra: la primera version llevaba "\bautocentro\b" y
# ATLANTICO AUTOCENTROS se colaba igual, porque el plural rompe el limite. Los
# prefijos van sin limite por detras a proposito.
AUTOMOCION = re.compile(
    r"\bautomoci[oó]n|\bautom[oó]vil|\btaller(es)?\s|\bneum[aá]tic|"
    r"\bautocent|\bauto\b|\bautos\b|chapa\s*y\s*pintura|"
    r"\b(valvoline|castrol|midas|norauto|feu\s*vert|aurgi|confortauto|"
    r"euromaster|rodi)\b", re.I)

# "motor" va aparte y con seguro. Caza bien a Danara Motor y Reser Motor, pero
# tambien mataria a una "Climatizacion y Motores del Sur", que es un nombre
# perfectamente posible en el oficio. Asi que motor solo descarta cuando el
# nombre NO dice ya que son de clima. Los 44 talleres del lote del 2-oct caen
# igual, porque todos llevan taller, auto o una marca de neumaticos.
MOTOR = re.compile(r"\bmotor(es)?\b", re.I)
ES_CLIMA = re.compile(r"\bclima|\baire|\bfr[ií]o\b|refriger|calefacc|"
                      r"aerotermia|ventilac|\bcalder", re.I)

# Gimnasios y centros deportivos. Salen por "empresa climatizacion", porque
# tienen instalaciones de clima enormes y hablan de ellas en su web. Son el
# cliente del instalador, no el instalador.
DEPORTE = re.compile(
    r"\b(gofit|go-?fit|forus|gym|gimnasio|fitness|basic\s*fit|altafit|"
    r"viva\s*gym|polideportiv|piscina\s*municipal|club\s*deportiv)\b", re.I)

# Centros de formacion. Tambien aparecen por clima: dan cursos de instalador.
FORMACION = re.compile(
    r"\b(campus\s*training|centro\s*de\s*formaci[oó]n|academia|"
    r"formaci[oó]n\s+(profesional|online)|cursos\s+de|instituto|fp\s*online)\b",
    re.I)


def descarta(nombre, dominio):
    """Devuelve el motivo del descarte, o None si el lead sigue vivo."""
    for etiqueta, patron in (("fabricante", FABRICANTE), ("mayorista", MAYORISTA),
                             ("portal", PORTAL), ("grande", GRANDE),
                             ("automocion", AUTOMOCION), ("deporte", DEPORTE),
                             ("formacion", FORMACION)):
        if patron.search(nombre) or patron.search(dominio):
            return etiqueta
    if (MOTOR.search(nombre) or MOTOR.search(dominio)) and not ES_CLIMA.search(nombre):
        return "automocion"
    return None


def exclusiones():
    """Fichero que tiene que mandar Marc: clientes, oportunidades y nurturing.

    Mientras no llegue esto la lista NO se puede cargar en ninguna campana, solo
    mirar. Acepta CSV con una columna de dominio o de correo, con cabecera o sin
    ella.
    """
    p = os.path.join(DATOS, "excluidos_kubysoft.csv")
    if not os.path.exists(p):
        return set(), False
    doms = set()
    for fila in csv.reader(open(p, encoding="utf-8-sig")):
        for celda in fila:
            c = celda.strip().lower()
            if "@" in c:
                c = c.split("@")[-1]
            c = c.replace("https://", "").replace("http://", "")
            c = c.split("/")[0].replace("www.", "")
            if "." in c and " " not in c:
                doms.add(c)
    return doms, True


if __name__ == "__main__":
    # Junta todas las fases que haya en disco. maps_aire.py escribe un fichero
    # por fase para que relanzar una no pise lo que ya se pago en la otra.
    import glob
    fuentes = sorted(glob.glob(os.path.join(DATOS, "maps_aire_crudo*.json")))
    if not fuentes:
        sys.exit("No hay fichas crudas. Corre antes maps_aire.py")
    crudo = []
    for f in fuentes:
        lote = json.load(open(f))
        crudo.extend(lote)
        print(f"  {os.path.basename(f)}: {len(lote)} fichas")
    excl, hay_excl = exclusiones()
    if not hay_excl:
        print("AVISO: no hay excluidos_kubysoft.csv. La lista se genera para "
              "revisar, pero NO se carga en ninguna campana hasta que llegue.")

    # 1. una ficha por dominio, la de mas resenas
    porDom = {}
    for x in crudo:
        w = x.get("website") or ""
        if not w:
            continue
        dm = w.split("//")[-1].split("/")[0].lower().replace("www.", "")
        if not dm or "." not in dm:
            continue
        v = porDom.get(dm)
        if not v or (x.get("reviewsCount") or 0) > (v.get("reviewsCount") or 0):
            porDom[dm] = x
    sin_web = sum(1 for x in crudo if not x.get("website"))
    print(f"fichas: {len(crudo)} · sin web: {sin_web} · dominios unicos: {len(porDom)}")

    # 2. fuera fabricantes, mayoristas, portales, grandes y multisede
    #
    # Multisede por repeticion, igual que en el script de Qualivo: un dominio que
    # sale cuatro veces o mas en la extraccion es una red con varias sedes, y esa
    # ya tiene quien le lleve los sistemas.
    veces = Counter(w.get("website", "").split("//")[-1].split("/")[0].lower().replace("www.", "")
                    for w in crudo if w.get("website"))
    fuera, cand = Counter(), []
    for dm, x in porDom.items():
        nombre = x.get("title") or ""
        motivo = descarta(nombre, dm)
        if motivo:
            fuera[motivo] += 1; continue
        if veces[dm] >= 4:
            fuera["multisede"] += 1; continue
        if dm in excl:
            fuera["excluido_kubysoft"] += 1; continue
        cand.append({"empresa": nombre, "web": x["website"], "dominio": dm,
                     "telefono": x.get("phone") or "", "ciudad": x.get("_ciudad"),
                     "sector": "aire_acondicionado", "termino": x.get("_termino"),
                     "resenas": x.get("reviewsCount") or 0,
                     "nota": x.get("totalScore")})
    print(f"candidatos tras filtro: {len(cand)} · fuera {dict(fuera)}")

    # 3. ahora si, a leer webs (correo + senales)
    #
    # El resultado se va guardando por tandas y se reanuda: leer 700 webs son
    # 40 minutos y el 2-oct perdimos una corrida de Maps por guardar solo al
    # final. Esto no cuesta dinero, pero cuesta tiempo, y el tiempo tambien se
    # acaba. Para releer una web a proposito, se borra aire_leidos.json.
    cache_p = os.path.join(DATOS, "aire_leidos.json")
    cache = {}
    if os.path.exists(cache_p):
        for r in json.load(open(cache_p)):
            cache[r["dominio"]] = r
        print(f"ya leidas antes: {len(cache)} webs")

    pendientes = [c for c in cand if c["dominio"] not in cache]
    print(f"webs por leer: {len(pendientes)}")
    LOTE = 60
    for i in range(0, len(pendientes), LOTE):
        trozo = pendientes[i:i + LOTE]
        with cf.ThreadPoolExecutor(12) as ex:
            for r in ex.map(mira, trozo):
                cache[r["dominio"]] = r
        tmp = cache_p + ".tmp"
        json.dump(list(cache.values()), open(tmp, "w"), ensure_ascii=False, indent=1)
        os.replace(tmp, cache_p)
        print(f"  leidas {min(i + LOTE, len(pendientes))}/{len(pendientes)}")

    leidos = [cache[c["dominio"]] for c in cand if c["dominio"] in cache]
    caidas = sum(1 for r in leidos if not r["vivo"])

    # 4. el filtro de correos, que es el que quita el correo de la agencia
    buenos, tirados = [], Counter()
    for r in leidos:
        if not r.get("email"):
            tirados["sin correo"] += 1; continue
        e, motivo = vale(r)
        if not e:
            tirados[motivo] += 1; continue
        buenos.append({**r, "email": e})
    print(f"con correo util: {len(buenos)} de {len(leidos)} "
          f"(webs caidas: {caidas}) · tirados {dict(tirados)}")

    # 5. a disco: JSON para la maquina, CSV para que lo mire Marc
    json.dump(buenos, open(os.path.join(DATOS, "aire_leads.json"), "w"),
              ensure_ascii=False, indent=1)
    cols = ["empresa", "ciudad", "web", "email", "telefono", "resenas", "nota",
            "termino", "senales"]
    with open(os.path.join(DATOS, "aire_leads.csv"), "w", newline="",
              encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(cols)
        for r in sorted(buenos, key=lambda x: -(x["resenas"] or 0)):
            w.writerow([r.get("empresa"), r.get("ciudad"), r.get("web"),
                        r.get("email"), r.get("telefono"), r.get("resenas"),
                        r.get("nota"), r.get("termino"),
                        " ".join(r.get("senales") or [])])
    s = Counter(k for r in buenos for k in r["senales"])
    print(f"  -> {os.path.join(DATOS, 'aire_leads.csv')}")
    print(f"  senales: {dict(s.most_common(8))}")
