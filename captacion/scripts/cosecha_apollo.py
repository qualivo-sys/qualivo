#!/usr/bin/env python3
"""Recoge las tandas de enriquecimiento de Apollo y saca la lista limpia.

Lee todos los ficheros de resultado de apollo_people_bulk_match que el harness
guarda en tool-results/, junta los registros y aplica los filtros de siempre:
buzon de rol fuera, dominio bloqueado fuera, dominio ya contactado fuera,
fuera de Espana fuera, email no verificado fuera.

Uso:
    python3 cosecha_apollo.py <dir_tool_results> <dedupe_31ago.json> <salida.json> [vertical]

El vertical es una etiqueta que se guarda en cada registro; si se omite queda
como "sin_clasificar". Es idempotente: se puede volver a correr cuando hay
tandas nuevas y rehace la lista completa desde cero.
"""
import json
import os
import re
import sys

# Buzones de rol: nunca entran. La lista se amplio el 30-sep al detectar que
# "consultas@" se habia colado por no estar contemplado.
ROL = {
    "info", "contacto", "contact", "hola", "admin", "administracion",
    "administration", "comercial", "ventas", "sales", "marketing", "rrhh",
    "hr", "empleo", "prensa", "press", "soporte", "support", "ayuda",
    "help", "facturacion", "billing", "contabilidad", "direccion",
    "gerencia", "secretaria", "recepcion", "reception", "atencion",
    "clientes", "consultas", "citas", "reservas", "pedidos", "no-reply",
    "noreply", "mail", "correo", "buzon", "general", "oficina", "office",
    "estudios", "matriculas", "admisiones", "admissions", "alumnos",
    "formacion", "cursos", "web", "webmaster", "hello", "team", "equipo",
}

# Clientes y ex clientes. Nunca se contactan.
BLOQUEADOS = {
    "growitschool.com", "growthhackingcourse.io", "anticbarcelona113.es",
    "formacion.ninja", "kubysoft.com", "escolaeronauticadecatalunya.cat",
}

# Dominios de correo personal: si el email del decisor esta en uno de estos,
# no es un email de empresa y no sirve para outbound en frio.
PERSONALES = {
    "gmail.com", "hotmail.com", "hotmail.es", "outlook.com", "outlook.es",
    "yahoo.com", "yahoo.es", "live.com", "icloud.com", "me.com", "aol.com",
    "protonmail.com", "gmx.com", "terra.es", "telefonica.net", "wanadoo.es",
}


def dominio(email):
    return email.split("@")[-1].lower().strip() if email and "@" in email else ""


def buzon(email):
    return email.split("@")[0].lower().strip() if email and "@" in email else ""


def es_rol(email):
    b = buzon(email)
    # "info", "info.madrid", "comercial-bcn": se compara la primera pieza
    primera = re.split(r"[.\-_+]", b)[0]
    return primera in ROL or b in ROL


def cargar_dedupe(ruta):
    """Devuelve el conjunto de dominios ya contactados."""
    if not ruta or not os.path.exists(ruta):
        return set()
    with open(ruta, encoding="utf-8") as fh:
        d = json.load(fh)
    if isinstance(d, dict):
        # puede venir como {dominio: algo} o {"dominios": [...]}
        for clave in ("dominios", "domains", "lista"):
            if clave in d and isinstance(d[clave], list):
                return {str(x).lower().lstrip("www.") for x in d[clave]}
        return {str(k).lower().lstrip("www.") for k in d}
    if isinstance(d, list):
        out = set()
        for x in d:
            if isinstance(x, str):
                out.add(x.lower().lstrip("www."))
            elif isinstance(x, dict):
                for clave in ("domain", "dominio", "primary_domain", "web"):
                    if x.get(clave):
                        out.add(str(x[clave]).lower().lstrip("www."))
                        break
        return out
    return set()


def registros(directorio):
    """Saca todos los registros enriquecidos de los ficheros de resultado."""
    for nombre in sorted(os.listdir(directorio)):
        if "bulk_match" not in nombre:
            continue
        ruta = os.path.join(directorio, nombre)
        try:
            raw = open(ruta, encoding="utf-8").read()
            d = json.loads(raw[raw.find("{"):])
        except Exception as exc:
            print(f"  aviso: no se pudo leer {nombre}: {exc}", file=sys.stderr)
            continue
        for p in d.get("matches") or []:
            if p:
                yield p


# Cargos que hacen bueno a un segundo contacto para la posdata de multi-hilo.
# Si hay varios companeros, se prefiere al que suena a quien decide sobre
# captacion y ventas, no al primero que devuelva la lista.
SEGUNDO_BUENO = ("comercial", "ventas", "sales", "marketing", "director",
                 "gerente", "ceo", "fundador", "founder", "owner", "propietari")


def companeros(directorio):
    """Nombres de pila de los demas contactos de cada empresa, de la BUSQUEDA.

    La busqueda de Apollo no cuesta creditos y ya devuelve el nombre de pila
    aunque oculte el apellido y no de el correo. Hasta hoy tirabamos a esa
    gente: en la cosecha del 9-oct-2026 eran 24 personas en 11 empresas y nos
    quedabamos con una por empresa.

    Sirve para la posdata de multi-hilo de preparar_carga_29.py, robada el
    9-oct de un correo de Reachflow. Ataca nuestro fallo mejor documentado:
    en 6 de 11 propuestas el que decidia no estaba en la reunion.
    """
    por_dominio = {}
    for nombre in sorted(os.listdir(directorio)):
        if "search" not in nombre or "bulk_match" in nombre:
            continue
        ruta = os.path.join(directorio, nombre)
        try:
            raw = open(ruta, encoding="utf-8").read()
            d = json.loads(raw[raw.find("{"):])
        except Exception as exc:
            print(f"  aviso: no se pudo leer {nombre}: {exc}", file=sys.stderr)
            continue
        for persona in (d.get("people") or d.get("contacts") or []):
            if not persona:
                continue
            org = persona.get("organization") or {}
            dom = (org.get("primary_domain") or "").lower().lstrip("www.")
            pila = (persona.get("first_name") or "").strip()
            # Apollo ofusca el apellido antes de revelar, pero el nombre de
            # pila viene limpio. Un nombre con mayusculas sueltas o puntos es
            # basura ofuscada y no se pone en un correo.
            if not dom or not pila or "." in pila or len(pila) < 2:
                continue
            por_dominio.setdefault(dom, []).append(
                (pila, (persona.get("title") or "").lower()))
    return por_dominio


def elegir_segundo(companias, dominio_lead, nombre_lead):
    """El mejor companero para la posdata, o cadena vacia si no hay."""
    otros = [(n, t) for n, t in companias.get(dominio_lead, [])
             if n.lower() != (nombre_lead or "").lower()]
    if not otros:
        return ""
    for nom, cargo in otros:
        if any(k in cargo for k in SEGUNDO_BUENO):
            return nom
    return otros[0][0]


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        return 1
    directorio, ruta_dedupe, salida = sys.argv[1], sys.argv[2], sys.argv[3]
    vertical = sys.argv[4] if len(sys.argv) > 4 else "sin_clasificar"

    ya_contactados = cargar_dedupe(ruta_dedupe)
    print(f"dominios ya contactados en el dedupe: {len(ya_contactados)}")

    vistos, buenos = set(), []
    descartes = {
        "sin email": 0, "no verificado": 0, "buzon de rol": 0,
        "dominio bloqueado": 0, "ya contactado": 0, "correo personal": 0,
        "duplicado": 0, "fuera de Espana": 0,
    }

    for p in registros(directorio):
        email = (p.get("email") or "").lower().strip()
        org = p.get("organization") or {}
        dom = dominio(email)

        if not email:
            descartes["sin email"] += 1
            continue
        if (p.get("email_status") or "") != "verified":
            descartes["no verificado"] += 1
            continue
        if dom in PERSONALES:
            descartes["correo personal"] += 1
            continue
        if es_rol(email):
            descartes["buzon de rol"] += 1
            continue
        if dom in BLOQUEADOS or dom.lstrip("www.") in BLOQUEADOS:
            descartes["dominio bloqueado"] += 1
            continue
        if dom.lstrip("www.") in ya_contactados:
            descartes["ya contactado"] += 1
            continue
        pais = (p.get("country") or org.get("country") or "").lower()
        if pais and "spain" not in pais and "espa" not in pais:
            descartes["fuera de Espana"] += 1
            continue
        if email in vistos:
            descartes["duplicado"] += 1
            continue
        vistos.add(email)

        buenos.append({
            "email": email,
            "nombre": p.get("first_name") or "",
            "apellido": p.get("last_name") or "",
            "cargo": p.get("title") or "",
            "empresa": org.get("name") or "",
            "dominio": (org.get("primary_domain") or dom or "").lower(),
            "web": org.get("website_url") or "",
            "empleados": org.get("estimated_num_employees"),
            "ciudad": p.get("city") or org.get("city") or "",
            "linkedin": p.get("linkedin_url") or "",
            "telefono": org.get("phone") or "",
            "vertical": vertical,
            "apollo_id": p.get("id") or "",
        })

    # Segundo contacto de la misma empresa para la posdata de multi-hilo.
    # Sale de la busqueda, que es gratis: no gasta ni un credito mas.
    compas = companeros(directorio)
    for b in buenos:
        b["segundo"] = elegir_segundo(compas, b["dominio"], b["nombre"])
    con_segundo = sum(1 for b in buenos if b["segundo"])
    print(f"con segundo contacto para la posdata: {con_segundo} de {len(buenos)}")

    with open(salida, "w", encoding="utf-8") as fh:
        json.dump(buenos, fh, ensure_ascii=False, indent=1)

    total = len(buenos) + sum(descartes.values())
    print(f"\nregistros leidos: {total}")
    print(f"VALIDOS: {len(buenos)}")
    for motivo, n in sorted(descartes.items(), key=lambda kv: -kv[1]):
        if n:
            print(f"  descartado por {motivo}: {n}")

    # una empresa puede tener varios decisores: cuenta dominios unicos
    print(f"dominios unicos: {len({b['dominio'] for b in buenos})}")
    print(f"escrito en {salida}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
