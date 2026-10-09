#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prepara los 29 leads de clase A y B listos para cargar en Smartlead.

Genera subject1, body1, body2 y body3 por lead, segun mensajes-v3.md. Existe
porque la secuencia de Smartlead es una carcasa vacia: el copy viaja dentro de
cada lead, y un lead sin body2 recibe un correo en blanco con solo la firma el
dia 3. Paso el 1-oct con 39 leads.

La senal de la primera linea es un HECHO MEDIDO: las etiquetas de medicion
detectadas en su propia web por la sonda del 2-oct. La regla del 31-ago: con
GTM presente, la AUSENCIA de pixeles no es afirmable, pero la PRESENCIA si.

Salida: captacion/datos/carga-29-listos.json (no se publica: lleva correos).

    python3 captacion/scripts/preparar_carga_29.py
"""
import json

CLAS = 'captacion/datos/clasificacion-133-2oct.json'
FUENTE = 'captacion/datos/apollo-nuevos-1oct.json'
SALIDA = 'captacion/datos/carga-29-listos.json'

FIRMA = "\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205"

CASOS = {
    # El enlace del caso de Equipzilla esta vacio a proposito: comprobado el
    # 9-oct-2026, https://qualivo.io/casos/equipzilla/ devuelve 404. El texto con
    # el numero si vale, que es el que aprobo Maikel para la fuga de captacion.
    # Nunca se llego a enviar porque esta cohorte cayo en el caso de seguimiento,
    # pero habria salido en el primer lead clasificado como 'captacion'.
    # Si se quiere enlace aqui, hay que publicar esa pagina o decidir otra: la de
    # bellovinilo si responde 200 y ya se cita en carga_v3.py y carga_sector.py.
    'captacion': ("Equipzilla pasó de 0,1 a 7,6 de retorno en anuncios sin tocar el presupuesto.",
                  ''),
    'seguimiento': ("Una empresa con CRM propio tenía 25 oportunidades paradas, 34.500 euros, "
                    "que nadie estaba tocando.", ''),
    'formacion': ("La Escola Aeronàutica de Catalunya invertía en Meta, Google y TikTok sin saber "
                  "qué acababa en matrícula. Diez euros de vuelta por cada euro.",
                  'https://qualivo.io/casos/eac/'),
}

# Indices (1-based sobre clasificacion-133) de los leads que imparten formacion.
FORMACION = {52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 72}

PROHIBIDO = ['solo quería hacer seguimiento', 'tendría sentido', 'me han surgido',
             'agentizar', '—', 'transformación digital']


def senal(x):
    """Etiquetas de medicion detectadas en su web. Solo presencia, nunca ausencia."""
    t = []
    if x['meta']:
        t.append('el píxel de Meta')
    if x['ads']:
        t.append('la etiqueta de Google Ads')
    if x['ga4']:
        t.append('GA4')
    if x['gtm'] and not t:
        t.append('Google Tag Manager')
    return t


def construir():
    S = json.load(open(CLAS))
    L = {l['dominio']: l for l in json.load(open(FUENTE))}
    out = []
    for i, x in enumerate(S, 1):
        if x['clase'] not in ('A', 'B'):
            continue
        src = L.get(x['dominio'], {})
        email = src.get('email')
        if not email:
            continue
        nom = (src.get('nombre') or '').strip()
        emp = x['empresa']
        sg = senal(x)
        h = f"Hola{(' ' + nom) if nom else ''},"

        if sg:
            ini = (f"{h}\n\nEn la web de {emp} tenéis {' y '.join(sg)}: estáis midiendo lo que "
                   f"entra.\n\nLo que casi nadie tiene atado es qué pasa después, y ahí suele "
                   f"haber margen.")
            fuga = 'captacion'
        else:
            ini = (f"{h}\n\nHe mirado la web de {emp} y no encuentro medición puesta.\n\n"
                   f"Si entra gente y no sabéis por dónde, cualquier decisión de captación va "
                   f"a ciegas.")
            fuga = 'seguimiento'
        if i in FORMACION:
            fuga = 'formacion'

        b1 = (ini + "\n\nDetectamos dónde se pierden clientes en la captación y en la venta, y lo "
              "arreglamos metiendo IA dentro del sistema que ya tenéis.\n\nEl primer paso es una "
              "llamada corta. Si sale algo claro, lo probamos un mes sin coste y luego decidís."
              "\n\n¿Te va bien esta semana?")

        caso, url = CASOS[fuga]
        b2 = (f"{h}\n\nUn ejemplo de lo que te decía.\n\n{caso}"
              + (f"\n\nAquí lo tienes: {url}" if url else "")
              + "\n\nLa llamada es para mirar vuestro caso, no para contaros el nuestro."
                "\n\n¿Esta semana o la que viene?")

        b3 = (f"{h}\n\nTe escribí hace unos días y no he tenido respuesta, así que entiendo que "
              "ahora no toca y no insisto más.\n\nSi en algún momento te pica la duda, la pregunta "
              "es dónde se pierde la gente: en la captación, en la conversión o en el seguimiento. "
              "Se contesta con una palabra.\n\nEl calendario sigue abierto: "
              "https://api.leadconnectorhq.com/widget/bookings/qualivo-20")

        out.append({
            'email': email, 'first_name': nom, 'company_name': emp,
            'custom_fields': {'subject1': f"vuestra captación en {emp}"[:70],
                              'body1': b1 + FIRMA, 'body2': b2 + FIRMA, 'body3': b3 + FIRMA},
            '_clase': x['clase'], '_cargo': x['cargo'],
            '_senal': ', '.join(sg) or 'sin medición detectada',
        })
    return out


def comprobar(out):
    """Las comprobaciones que el 1-oct no se hicieron y costaron 39 correos en blanco."""
    fallos = []
    for o in out:
        cf = o['custom_fields']
        for k in ('subject1', 'body1', 'body2', 'body3'):
            if not (cf.get(k) or '').strip():
                fallos.append(f"{o['company_name']}: {k} vacio")
    def pal(t):
        return len(t.replace(FIRMA, '').split())
    largos = [o['company_name'] for o in out if pal(o['custom_fields']['body1']) > 90]
    for p in PROHIBIDO:
        for o in out:
            for v in o['custom_fields'].values():
                if p.lower() in v.lower():
                    fallos.append(f"{o['company_name']}: frase prohibida '{p}'")
    return fallos, largos


if __name__ == '__main__':
    out = construir()
    fallos, largos = comprobar(out)
    json.dump(out, open(SALIDA, 'w'), ensure_ascii=False, indent=1)
    print(f"{len(out)} leads preparados en {SALIDA}")
    print(f"campos vacios o frases prohibidas: {len(fallos)}")
    for f in fallos:
        print(f"  {f}")
    if largos:
        print(f"email 1 por encima de 90 palabras: {len(largos)} -> {', '.join(largos)}")
    print("\nNO carga nada. Cargar leads que van a recibir comunicaciones necesita el ok de Maikel.")
