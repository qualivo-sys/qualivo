# -*- coding: utf-8 -*-
# Ultimo filtro antes de cargar. Mirando el primer lote a mano salieron cuatro
# tipos de basura que el extractor da por buenos, y cada uno tiene su motivo:
#
#   kyqu@pky.uvh                        web que ofusca el correo con un cifrado
#                                       de sustitucion; se descarta por TLD
#   %20%2013asuntos@13asuntos.es        el correo venia dentro de un href con
#                                       espacios codificados; se limpia
#   contacto@creatuweb.xyz              es el correo de la agencia que les hizo
#                                       la web, no el suyo; se descarta por
#                                       dominio cruzado
#   manuel@asemaresme.e.telefon         cortado a mitad; se descarta por TLD
#
# El filtro fuerte es el del dominio cruzado. Escribir al de la agencia no solo
# no sirve, es que ademas quema el dominio de envio con alguien que recibe
# correo frio todos los dias.
import json, os, re

S = os.path.dirname(os.path.abspath(__file__))
TLD = re.compile(r"\.(com|es|cat|net|org|eu|io|clinic|dental|barcelona|madrid|"
                 r"info|online|shop|pro|health|care|group|agency|digital)$", re.I)
CORREO = re.compile(r"^[a-z0-9._%+-]{2,40}@[a-z0-9.-]{3,50}$", re.I)


def limpia(e):
    e = (e or "").strip().lower()
    e = re.sub(r"^(%20|%09|\s|\.|,|;)+", "", e)
    e = re.sub(r"%20", "", e)
    return e.strip(" .,;:")


def raiz(d):
    """Dominio sin www ni subdominio de primer nivel, para comparar."""
    d = d.lower().replace("www.", "")
    partes = d.split(".")
    return ".".join(partes[-2:]) if len(partes) > 2 else d


def vale(r):
    e = limpia(r.get("email"))
    if not e or not CORREO.match(e) or not TLD.search(e.split("@")[-1]):
        return None, "formato"
    dom_correo = raiz(e.split("@")[-1])
    dom_web = raiz(r["dominio"])
    # Mismo nombre y distinta extension NO es dominio cruzado: muchos negocios
    # tienen la web en .com y el correo en .es. En el primer lote esto me tiro
    # a la basura a mercatsantsdental, que era bueno.
    if dom_correo != dom_web and dom_correo.split(".")[0] == dom_web.split(".")[0]:
        return e, None
    if dom_correo != dom_web:
        # Se da una segunda oportunidad a los "otros" correos encontrados, por
        # si el bueno estaba ahi y el elegido era el de la agencia.
        for otro in r.get("otros") or []:
            o = limpia(otro)
            if (CORREO.match(o) and TLD.search(o.split("@")[-1])
                    and raiz(o.split("@")[-1]) == dom_web):
                return o, None
        return None, "dominio cruzado"
    return e, None


if __name__ == "__main__":
    from collections import Counter
    for sec in ("clinicas", "asesorias", "formacion"):
        p = os.path.join(S, f"sector_{sec}.json")
        d = json.load(open(p))
        fuera, buenos = Counter(), []
        for r in d:
            e, motivo = vale(r)
            if not e:
                fuera[motivo] += 1
                continue
            buenos.append({**r, "email": e})
        json.dump(buenos, open(p, "w"), ensure_ascii=False, indent=1)
        print(f"{sec}: {len(buenos)} buenos de {len(d)} · fuera {dict(fuera)}")
