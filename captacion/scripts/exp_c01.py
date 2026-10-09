#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""EXP-C-01 · cohorte experimental cerrada, estructura de Maikel del 5-oct.

REGLAS DE LA COHORTE, puestas por Maikel y no negociables durante la tanda:

  1. Misma estructura en los tres correos, de principio a fin.
  2. NINGUNA modificacion de copy mientras la tanda este viva.
  3. Nada que sea una inferencia se presenta como hecho. Tener el pixel o GA4
     instalado demuestra TECNOLOGIA INSTALADA, no que midan correctamente las
     solicitudes ni las matriculas.
  4. La ausencia NO es afirmable. Regla del 31-ago: HubSpot inyecta formularios
     por JavaScript, asi que "no teneis formulario" no se puede decir.
  5. Clics y aperturas NO son senal de exito. Se mide respuesta humana,
     respuesta positiva, conversacion, reunion y SQL.

ANATOMIA de los tres correos (HECHO -> DESCONOCIDO -> EVIDENCIA -> PREGUNTA):

  1 (dia 0)  el hecho medido + lo que desde fuera no se puede saber + una
             pregunta contestable + "¿Te la paso?"
  2 (+3 dias) MANDA la idea, no vuelve a pedir permiso + el caso + una pregunta
  3 (+7 dias) cierra sin reproche y deja el esquema a disposicion

ESTRATOS: la cohorte no es homogenea y se registra por separado.
  FUERTE: hecho de medicion (pixel de Meta, GA4, etiqueta de Google Ads, GTM)
  DEBIL:  hecho de canal de contacto (formularios, telefono directo)
Permite leer si la fuerza del hecho cambia la respuesta, sin coste anadido.

    python3 captacion/scripts/exp_c01.py
"""
import json

CLAS = 'captacion/datos/clasificacion-133-2oct.json'
FUENTE = 'captacion/datos/apollo-nuevos-1oct.json'
SONDA_C = None  # se pasa por argumento o se busca en el scratchpad
SALIDA = 'captacion/datos/exp-c01-listos.json'

FIRMA = "\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205"

FORMACION_IDX = {52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 72}

PROHIBIDO = ['estáis midiendo', 'se cae más gente', 'solo quería', 'tendría sentido',
             'me han surgido', '—', 'agentizar', 'transformación digital']


def hecho_fuerte(x):
    """Tecnologia de medicion detectada. Presencia solamente."""
    t = []
    if x.get('meta'):
        t.append('el píxel de Meta')
    if x.get('ga4'):
        t.append('GA4')
    if x.get('ads'):
        t.append('la etiqueta de Google Ads')
    if x.get('gtm') and not t:
        t.append('Google Tag Manager')
    return t


def hecho_debil(s):
    """Canal de contacto observado en su web. Presencia solamente."""
    if not s:
        return None
    if s.get('forms', 0) >= 2:
        return f"{s['forms']} formularios"
    if s.get('forms', 0) == 1:
        return "un formulario"
    if s.get('wa'):
        return "un WhatsApp"
    if s.get('tel'):
        return "el teléfono directo"
    return None


def construir(sonda_c):
    S = json.load(open(CLAS))
    L = {l['dominio']: l for l in json.load(open(FUENTE))}
    SC = {r['empresa']: r for r in sonda_c}
    out = []
    for i, x in enumerate(S, 1):
        if x['clase'] != 'C':
            continue
        src = L.get(x['dominio'], {})
        email = src.get('email')
        if not email:
            continue
        nom = (src.get('nombre') or '').strip()
        emp = x['empresa']
        h = f"Hola{(' ' + nom) if nom else ''},"

        fuerte = hecho_fuerte(x)
        debil = hecho_debil(SC.get(emp))
        if fuerte:
            estrato = 'FUERTE'
            verbo = 'instalados' if len(fuerte) > 1 else 'instalado'
            linea1 = f"he visto que en la web de {emp} tenéis {' y '.join(fuerte)} {verbo}."
            linea2b = f"Tenéis {' y '.join(fuerte)} {verbo}."
        elif debil:
            estrato = 'DEBIL'
            linea1 = f"he visto que en la web de {emp} tenéis {debil}."
            linea2b = f"Tenéis {debil} en la web."
        else:
            continue  # sin hecho verificable no entra. No se inventa.

        if i in FORMACION_IDX:
            pregunta = ("Cuando alguien pide información de un curso y no se matricula a la "
                        "primera, ¿tenéis definido qué seguimiento recibe o depende de cada "
                        "persona?")
            recorrido = "desde que alguien pide información hasta que acaba matriculándose"
            caso = ("Con la Escola Aeronàutica de Catalunya trabajamos precisamente esa conexión "
                    "entre captación, seguimiento y matrícula final. Te dejo el caso aquí: "
                    "https://qualivo.io/casos/eac/")
            cierre = "qué ocurre entre una solicitud y una matrícula"
        else:
            pregunta = ("Cuando alguien pide presupuesto y no cierra a la primera, ¿tenéis "
                        "definido qué seguimiento recibe o depende de cada comercial?")
            recorrido = "desde que alguien pide presupuesto hasta que acaba firmando"
            caso = ("Con una empresa que ya tenía CRM nos encontramos 25 oportunidades abiertas "
                    "sin siguiente paso. No les faltaban clientes: nadie estaba volviendo a ellas.")
            cierre = "qué ocurre entre una solicitud de presupuesto y una firma"

        b1 = (f"{h}\n\n{linea1}\n\nLo que desde fuera no puedo saber es qué pasa después. "
              f"{pregunta}\n\nEstoy trabajando justo esa parte y tengo una idea aplicada a "
              f"vuestro caso.\n\n¿Te la paso?")

        b2 = (f"{h}\n\nTe la paso igual, que es corta.\n\n{linea2b} La parte que desde fuera no "
              f"puedo saber es si podéis seguir el recorrido completo: {recorrido}.\n\n{caso}\n\n"
              f"¿Vosotros podéis ver hoy ese recorrido de principio a fin?")

        b3 = (f"{h}\n\nCierro por aquí.\n\nSi en algún momento queréis revisar {cierre}, es decir "
              f"la respuesta, el seguimiento y la recuperación de quien no decide a la primera, "
              f"tengo el esquema preparado.\n\nSi te interesa verlo, dime y te lo mando.")

        out.append({
            'email': email, 'first_name': nom, 'company_name': emp,
            'custom_fields': {'subject1': f"vuestro seguimiento en {emp}"[:70],
                              'body1': b1 + FIRMA, 'body2': b2 + FIRMA, 'body3': b3 + FIRMA},
            '_cohorte': 'EXP-C-01', '_estrato': estrato,
            '_hecho': ' y '.join(fuerte) if fuerte else debil,
            '_empleados': x['empleados'], '_motivo_c': x['razon'][:90],
        })
    return out


def comprobar(out):
    fallos = []
    for o in out:
        cf = o['custom_fields']
        for k in ('subject1', 'body1', 'body2', 'body3'):
            if not (cf.get(k) or '').strip():
                fallos.append(f"{o['company_name']}: {k} vacio")
        for p in PROHIBIDO:
            for v in cf.values():
                if p.lower() in v.lower():
                    fallos.append(f"{o['company_name']}: prohibido '{p}'")
        if '¿Te la paso?' in cf['body2']:
            fallos.append(f"{o['company_name']}: body2 vuelve a pedir permiso")
    return fallos


if __name__ == '__main__':
    import sys, os
    ruta = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('SONDA_C', '')
    sonda = json.load(open(ruta)) if ruta and os.path.exists(ruta) else []
    out = construir(sonda)
    fallos = comprobar(out)
    json.dump(out, open(SALIDA, 'w'), ensure_ascii=False, indent=1)
    import collections
    c = collections.Counter(o['_estrato'] for o in out)
    print(f"EXP-C-01: {len(out)} leads · {dict(c)}")
    print(f"fallos: {len(fallos)}")
    for f in fallos:
        print(f"  {f}")
    def pal(t):
        return len(t.replace(FIRMA, '').split())
    for k in ('body1', 'body2', 'body3'):
        ps = [pal(o['custom_fields'][k]) for o in out]
        print(f"  {k}: {min(ps)}-{max(ps)} palabras")
    print("\nNO carga nada.")
