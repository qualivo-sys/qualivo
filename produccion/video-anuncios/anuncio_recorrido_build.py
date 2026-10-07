#!/usr/bin/env python3
"""Anuncio «El problema empieza en tu anuncio» (7-oct-2026): no es de sector, es la tesis de Qualivo.
El resultado malo viaja hacia atrás por el embudo hasta el anuncio que atrajo a esa persona.
Dos ganchos con el mismo cuerpo: A (dolor) y B (el comercial). Voz de David (ElevenLabs), música H,
solo motion y pantallas: sin Kling y sin Maikel a cámara.

   ELEVENLABS_API_KEY=... python3 anuncio_recorrido_build.py voces        # las dos locuciones (david)
   MUSICA=musica6/h-urbano-norm.mp3 QUIETO=1 python3 anuncio_recorrido_build.py reca recb
"""
import os, sys
import anuncios_s1_build as s1
from anuncios_s1_build import T, tr, tarjeta
from anuncios3_build import plano

GANCHO = {
 'reca': ['Si tus leads no contestan, no vienen o no tienen dinero…',
          'puede que el problema empiece en tu anuncio.'],
 'recb': ['Si tu comercial dice que los leads de Meta son malos,',
          'antes de culparle, mira el anuncio que los trajo.'],
}
CUERPO = [
 'Un anuncio que le habla a todo el mundo trae a todo el mundo.',
 'Curiosos, gente que no encaja, gente que nunca iba a comprar.',
 'Y luego lo intentas arreglar con más llamadas y más seguimiento.',
 'Pero empezó antes.',
 'Nosotros dejamos de hablarle a todo el mundo.',
 'Y filtramos quién entra, qué necesita y quién de verdad debería llegar a una reunión.',
 'Y conectamos todo hasta la venta: qué anuncios traen formularios… y cuáles, oportunidades de verdad.',
 'Si ya inviertes en anuncios y no te compran, te enseñamos dónde falla tu recorrido.',
]
GUIONES = {k: (f'Recorrido-{k[-1].upper()}', v + CUERPO) for k, v in GANCHO.items()}

# Planos de Higgsfield (Kling 3.0, 9:16, 5 s) para la mitad del problema; sin ellos, fondo liso.
CLIPS = {'reca': 'clips/r1.mp4', 'recb': 'clips/r2.mp4', 'todos': 'clips/r3.mp4', 'llamadas': 'clips/r4.mp4'}
AQUI = os.path.dirname(os.path.abspath(__file__))
def fondo(ini, clip, textos, t=None):
    if os.path.exists(os.path.join(AQUI, CLIPS[clip])):
        return plano(ini, CLIPS[clip], textos, t, brillo=-0.28, saturacion=0.8)
    return tarjeta(ini, '#101319', textos, t, zoom=False)

EMBUDO = ['ANUNCIO', 'LANDING', 'CUALIFICACIÓN', 'REUNIÓN']

def gancho(k, t, d):
    """0-6 s: las fichas del resultado malo y el embudo recorrido hacia atrás hasta ANUNCIO."""
    o1 = t[1][0] - t[0][0]
    paso = max(0.35, (o1 + d(1) * 0.5) / 5)
    if k == 'reca':
        arriba = [T(0, estilo='fuga', y=150, tam=40, texto='No responde'),
                  T(0.5, estilo='fuga', y=280, tam=40, texto='Plantón'),
                  T(1.0, estilo='fuga', y=410, tam=40, texto='Sin presupuesto')]
        final = 'Puede que empiece aquí'
    else:
        arriba = [T(0, estilo='etiqueta', y=150, texto='Tu comercial'),
                  T(0.2, estilo='grande', y=280, tam=64, texto='«Los leads de Meta son malos»')]
        final = 'Mira el anuncio que los trajo'
    cad = []
    for n, marcar in enumerate([3, 2, 1, 0]):
        a = paso * (n + 1); b = paso * (n + 2) if n < 3 else None
        cad.append(T(a, b, estilo='cadena', y=640, tam=56, paso=150, items=EMBUDO, marcar=[marcar],
                     apagar=[i for i in range(4) if i > marcar]))
    cad.insert(0, T(0, paso, estilo='cadena', y=640, tam=56, paso=150, items=EMBUDO))
    return fondo(t[0][0], k, arriba + cad + [T(paso * 4 + 0.2, estilo='sub-turquesa', y=1340, tam=58, texto=final)],
                 tr('fade', .3))

def escenas(k):
    def f(t, d):
        o3 = t[3][0] - t[2][0]
        return [
        gancho(k, t, d),
        fondo(t[2][0], 'todos', [
            T(0, estilo='etiqueta', y=150, texto='Un anuncio para todo el mundo'),
            T(0.2, estilo='grande', y=380, tam=86, texto='Trae a todo el mundo'),
            T(o3, estilo='lista', y=760, texto='Curiosos', color='blanco'),
            T(o3 + d(3) * 0.3, estilo='lista', y=880, texto='Gente que no encaja', color='blanco'),
            T(o3 + d(3) * 0.6, estilo='lista', y=1000, texto='Gente que nunca iba a comprar', color='blanco')], tr('smoothleft', .35)),
        fondo(t[4][0], 'llamadas', [
            T(0, estilo='etiqueta', y=150, texto='Y luego'),
            T(0.1, estilo='lista', y=420, texto='Más llamadas', color='blanco'),
            T(d(4) * 0.35, estilo='lista', y=540, texto='Más seguimiento', color='blanco'),
            T(d(4) * 0.65, estilo='lista', y=660, texto='Culpar al comercial', color='blanco')], tr('wipeup', .35)),
        tarjeta(t[5][0], '#101319', [T(0, estilo='grande', y=860, tam=104, texto='*Pero empezó antes.')], tr('fade', .15), zoom=False),
        tarjeta(t[6][0], '#F2F3F5', [
            T(0, estilo='grande', y=300, tam=72, color='tinta', texto='Dejamos de hablarle a todo el mundo'),
            T(t[7][0] - t[6][0], estilo='pasos', y=760, tam=40, pasos=[['Encaja', 'ok'], ['Necesita info', ''], ['No encaja', 'ko']]),
            T(t[7][0] - t[6][0] + d(7) * 0.45, estilo='sub-turquesa', y=1000, tam=54, texto='Quién de verdad debería llegar a una reunión')], tr('fade', .35), zoom=False),
        tarjeta(t[8][0], '#101319', [
            T(0, estilo='etiqueta-turquesa', y=150, texto='Ejemplo'),
            T(0.2, estilo='cadena', y=330, tam=40, paso=86, items=['ANUNCIO 01', '38 leads', '4 reuniones', '0 clientes'], color='gris'),
            T(d(8) * 0.4, estilo='cadena', y=330, tam=40, paso=86, items=['ANUNCIO 01', '38 leads', '4 reuniones', '0 clientes'], color='gris', apagar=[0, 1, 2, 3]),
            T(d(8) * 0.4, estilo='cadena', y=760, tam=40, paso=86, items=['ANUNCIO 02', '19 leads', '8 reuniones', '3 clientes'], marcar=[3]),
            T(d(8) * 0.55, estilo='sub', y=1230, tam=46, texto='Formularios no es lo mismo que oportunidades'),
            T(0, estilo='etiqueta', y=1560, texto='Datos de ejemplo')], tr('smoothleft', .35), zoom=False),
        tarjeta(t[9][0], '#27BDB1', [
            T(0, estilo='grande', y=330, tam=76, color='tinta', texto='¿Ya inviertes en anuncios?'),
            T(0.9, estilo='grande', y=720, tam=56, color='tinta', texto='¿Y no te compran?'),
            T(1.8, estilo='boton', y=1100, texto='Dónde falla tu recorrido →'),
            T(0, estilo='grande', y=1620, tam=56, color='tinta', texto='Qualivo')])]
    return f

DEF = {k: {'pausas': {1: 0.35, 2: 0.3, 5: 0.25, 6: 0.35, 9: 0.35}, 'escenas': escenas(k)} for k in GANCHO}

if __name__ == '__main__':
    s1.GUIONES.update(GUIONES); s1.DEF.update(DEF)
    if sys.argv[1] == 'voces':
        import voz_elevenlabs as v
        for k, (_, frases) in GUIONES.items(): v.tts(' '.join(frases), 'david', f'voz-s1/{k}-david')
        sys.exit()
    s1.OUT = os.environ.get('OUT', 'out-recorrido'); os.makedirs(s1.OUT, exist_ok=True)
    for arg in sys.argv[1:]:
        n, _, tm = arg.partition(':'); s1.construir(n, tm or 'david')
        viejo = f'{s1.OUT}/S1_{n.upper()}_v2{"_MAQUETA" if s1.MAQUETA else ""}_9x16.mp4'
        nuevo = f'{s1.OUT}/REC_{n[-1].upper()}_v1{"_MAQUETA" if s1.MAQUETA else ""}_9x16.mp4'
        os.replace(viejo, nuevo); print('→', nuevo)
