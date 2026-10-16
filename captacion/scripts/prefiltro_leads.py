#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prefiltro obligatorio antes de cargar leads en Smartlead.

Nace del 2-oct-2026: de 133 leads de Apollo etiquetados como "nuevos", 39 ya
estaban en Smartlead y 20 eran agencias de marketing, es decir competidores
directos. El mismo fallo habia aparecido el 1-oct en la lista de LinkedIn.
La causa no era la lista, era que nadie filtraba antes de cargar.

Uso:
    python3 prefiltro_leads.py leads.json "$(cat .smartlead_key)" [--salida limpios.json]

Devuelve codigo 1 si algun lead cae, para poder encadenarlo en un pipeline.
"""
import json, re, sys, subprocess, collections, argparse

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# Dominios de clientes y ex-clientes: nunca se contactan.
LISTA_NEGRA = {
    'growitschool.com', 'growthhackingcourse.io', 'anticbarcelona113.es',
    'formacion.ninja', 'kubysoft.com', 'escolaeronauticadecatalunya.cat',
}

# Competidores: agencias de marketing, growth, SEO, publicidad, branding.
# No se les escribe porque venden lo mismo que nosotros.
#
# Control del 2-oct: contra el nombre de empresa solamente, este patron cazaba
# 17 de los 20 competidores de la lista. Se le escapaban WeRise, Snowball y
# Windup, cuyo nombre no dice nada: solo su web lo dice. Por eso se aplica
# tambien al texto sondeado (titulo, h1, descripcion), que es donde la empresa
# se describe con sus propias palabras.
COMPETIDOR = re.compile(
    r'\b(agencia|agency|growth\s*(marketing|hacking)?|seo|sem|ppc|adtech|'
    r'branding|publicidad|marketing|inbound|leadgen|lead\s*gen|'
    r'consultora\s+digital|digital\s+consulting|media\s+group|roas|'
    r'generacion\s+de\s+demanda|capta(cion|r)\s+de\s+clientes)\b',
    re.I)

# Agencias que NO son competencia nuestra: reclutamiento, seleccion, talento,
# eventos, viajes, creativas de produccion. Llevan "agencia" en el nombre pero
# venden otra cosa. (Blu Selection fue el falso positivo que lo descubrio.)
NO_COMPETIDOR = re.compile(
    r'\b(recruit\w*|reclutamiento|seleccion|headhunt\w*|talent\w*|rrhh|'
    r'staffing|empleo|eventos|viajes|travel|seguros|inmobiliari\w*)\b', re.I)

ROL = re.compile(r'^(info|hola|contacto|contact|admin|ventas|comercial|marketing|'
                 r'rrhh|hr|soporte|support|administracion|secretaria|general|'
                 r'direccion|office|sales|team|hello|no-?reply)@', re.I)

BANDA_MIN, BANDA_MAX, TECHO_DURO = 5, 50, 150

# Descartes manuales: dominios ya rechazados a mano, con fecha y motivo.
# Existe porque el pool de Apollo devuelve lo ya rechazado: el 2-oct volvio a
# salir Lizarte, descartado a mano el 1-oct por ser fabricacion.
DESCARTES = 'captacion/datos/descartes-manuales.json'


def descartes_manuales(ruta=DESCARTES):
    try:
        return json.load(open(ruta))
    except Exception:
        print(f"AVISO: no encuentro {ruta}. Sin el, el prefiltro vuelve a "
              f"proponer lo que ya se rechazo a mano.")
        return {}


def emails_en_smartlead(key):
    """Todos los emails que ya existen en Smartlead, en cualquier campana."""
    def get(u):
        r = subprocess.run(["curl", "-s", "-H", f"User-Agent: {UA}", u],
                           capture_output=True, text=True)
        try:
            return json.loads(r.stdout)
        except Exception:
            return None
    emails, dominios = set(), set()
    for c in (get(f"https://server.smartlead.ai/api/v1/campaigns?api_key={key}") or []):
        off = 0
        while off <= 8000:
            p = get(f"https://server.smartlead.ai/api/v1/campaigns/{c['id']}"
                    f"/leads?api_key={key}&offset={off}&limit=100") or {}
            ds = p.get('data') or []
            if not ds:
                break
            for d in ds:
                e = ((d.get('lead') or {}).get('email') or '').lower().strip()
                if e:
                    emails.add(e)
                    dominios.add(e.split('@')[-1])
            off += 100
    return emails, dominios


def revisar(leads, ya_emails, ya_dominios, descartados=None):
    """Anota en cada lead lo que no pasa. Distingue dos cosas:

    - `fallos`: puertas duras. El lead no sale, y no es opinable.
    - `avisos`: cosas que hay que mirar a mano. El lead sigue vivo.

    El encaje de sector NO lo decide este script.
    """
    descartados = descartados if descartados is not None else descartes_manuales()
    por_dominio = collections.Counter(l.get('dominio', '') for l in leads)
    vistos = set()
    for l in leads:
        d = (l.get('dominio') or '').lower()
        e = (l.get('email') or '').lower().strip()
        emp = l.get('empleados') or 0
        # El texto que se juzga incluye lo que la empresa dice de si misma en su
        # web, si se ha sondeado. Sin eso, el filtro se queda corto (ver arriba).
        texto = " ".join(str(l.get(k) or '') for k in
                         ('empresa', 'vertical', 'title', 'h1', 'desc'))
        f = []
        if d in LISTA_NEGRA:
            f.append('LISTA-NEGRA')
        if e in ya_emails:
            f.append('EMAIL-YA-ENVIADO')
        elif d in ya_dominios or e.split('@')[-1] in ya_dominios:
            f.append('DOMINIO-YA-TOCADO')
        if ROL.match(e):
            f.append('BUZON-DE-ROL')
        avisos = []
        if d in descartados:
            dd = descartados[d]
            f.append(f"DESCARTE-MANUAL[{dd.get('fecha','?')}]")
        m = COMPETIDOR.search(texto)
        if m and not NO_COMPETIDOR.search(texto):
            # NO es un fallo. Corregido el 2-oct: el unico cierre de la semana
            # (Alpha Media Group, 14 comerciales y Zoho) es una agencia de
            # medios. El discriminante del tipo A es tener de 3 a 30 personas
            # en ventas, no el sector. Este script no puede medir eso, asi que
            # avisa y lo mira una persona.
            avisos.append(f'AGENCIA[{m.group(0)}]·comprobar equipo comercial 3-30')
        if emp and emp > TECHO_DURO:
            f.append(f'TAMANO-{emp}p')
        elif emp and not (BANDA_MIN <= emp <= BANDA_MAX):
            f.append(f'FUERA-DE-BANDA-{emp}p')
        if d in vistos:
            f.append('DUPLICADO-INTERNO')
        vistos.add(d)
        if por_dominio[d] > 1:
            f.append(f'MISMO-DOMINIO-x{por_dominio[d]}')
        l['fallos'] = f
        l['avisos'] = avisos
    return leads


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('leads')
    ap.add_argument('smartlead_key')
    ap.add_argument('--salida', default=None)
    a = ap.parse_args()

    leads = json.load(open(a.leads))
    print(f"leads de entrada: {len(leads)}")
    ya_e, ya_d = emails_en_smartlead(a.smartlead_key)
    print(f"ya en Smartlead: {len(ya_e)} emails, {len(ya_d)} dominios")

    leads = revisar(leads, ya_e, ya_d)
    limpios = [l for l in leads if not l['fallos']]
    c = collections.Counter(z.split('[')[0] for l in leads for z in l['fallos'])
    av = collections.Counter(z.split('[')[0] for l in leads for z in l.get('avisos', []))

    print("\n=== PUERTAS QUE NO PASAN ===")
    for k, v in c.most_common():
        print(f"  {k:24} {v}")
    if av:
        print("\n=== AVISOS (el lead sigue vivo, pero hay que mirarlo) ===")
        for k, v in av.most_common():
            print(f"  {k:24} {v}")
    print(f"\npasan el prefiltro: {len(limpios)} de {len(leads)}")
    print("El prefiltro NO verifica encaje de sector ni que inviertan en")
    print("captacion. Eso se revisa a mano sobre estos, antes de cargar.")
    if not any(l.get('title') or l.get('h1') for l in leads):
        print("\nAVISO: ninguno de estos leads trae texto sondeado de su web.")
        print("El filtro de competidor solo ha podido leer el nombre de la")
        print("empresa, y asi se le escapo 1 de cada 7 el 2-oct. Sondea las")
        print("webs antes y mete title/h1/desc en cada lead.")

    if a.salida:
        json.dump(limpios, open(a.salida, 'w'), ensure_ascii=False, indent=1)
        print(f"escritos los limpios en {a.salida}")
    return 1 if len(limpios) < len(leads) else 0


if __name__ == '__main__':
    sys.exit(main())
