#!/usr/bin/env python3
"""Test de dolor de la semana 1 (octubre 2026): Velocidad, Plantones y Curiosos v2.
Guiones corregidos: content/agentes/creative-performance/2026-10-s1-test-creativo.md.
Mismo molde que anuncios3_build.py (la escena se ata al inicio de cada frase y la pausa va al
silencio real), con los planos que ya existen en clips/ y un CTA común a los tres.

   python3 anuncios_s1_build.py vel:a pla:a cur:a            # con la voz de Javier (voz-s1/<n>-<toma>.mp3 + .json)
   MAQUETA=1 python3 anuncios_s1_build.py vel pla cur        # sin voz: tiempos a 3,5 palabras/s (ritmo de Javier) y audio mudo

Variables: MUSICA (por defecto la A, electrónica minimalista) y OUT."""
import json, os, subprocess, sys
import anuncios3_build as a3, montar
from anuncios3_build import T, tr, plano, pantalla, tarjeta, CHAT, AGENDA, ANUNCIOS

a3.MUSICA = os.environ.get('MUSICA', 'musica4/a-minimal-norm.mp3')
OUT = os.environ.get('OUT', 'out-s1')
MAQUETA = os.environ.get('MAQUETA') == '1'
VOZ = 'voz-s1'

CTA_VOZ = 'Si tu centro ya invierte en anuncios, te enseñamos en treinta minutos dónde se te escapan los alumnos entre el anuncio y la matrícula.'

def cta(ini):
    return tarjeta(ini, '#27BDB1', [
        T(0, estilo='grande', y=330, tam=78, color='tinta', texto='¿Tu centro ya invierte en anuncios?'),
        T(1.0, estilo='grande', y=720, tam=58, color='tinta', texto='¿Dónde se te escapan los alumnos?'),
        T(1.8, estilo='boton', y=1080, texto='Diagnóstico gratuito · 30 min'),
        T(2.4, estilo='boton', y=1240, color='blanco', texto='Revisar mis fugas →'),
        T(0, estilo='grande', y=1620, tam=56, color='tinta', texto='Qualivo')])

# Texto exacto de la voz (lo que lee Javier). «Qualivo» se escribe «cualivo» en los inicios porque así lo transcribe Whisper.
GUIONES = {
 'vel': ('Velocidad', [
   'Te pidió información el martes a las doce y diez.',
   'Le contestaste a las siete de la tarde.',
   'Para entonces, ya había hablado con otros dos centros.',
   'No lo perdiste por el precio. Lo perdiste por llegar tarde.',
   'Con Qualivo, quien pide información recibe respuesta por WhatsApp en minutos, con sus palabras.',
   'Si no contesta, le llamamos.',
   'Y al día siguiente, le volvemos a escribir.',
   'Cuando está listo para hablar, te llega con la cita en tu agenda y sabiendo qué quiere estudiar.',
   CTA_VOZ]),
 'pla': ('Plantones', [
   'Diez personas reservaron una visita esta semana.',
   'Vinieron cuatro.',
   'Seis huecos en tu agenda para nadie.',
   'Y esas seis ya las habías pagado: el anuncio, el formulario y la llamada para darles cita.',
   'Casi nunca es mala suerte.',
   'Reservaron a varios días vista, nadie volvió a hablar con ellos y el jueves se les cruzó algo.',
   'Con Qualivo, la cita se confirma al reservar.',
   'La víspera le llega un recordatorio.',
   'Y si no aparece, le llamamos.',
   CTA_VOZ]),
 'cur': ('Curiosos', [
   'Tu anuncio te trae leads a cinco euros. Parece una ganga.',
   'Hasta que les llamas.',
   'Uno solo quería mirar. Otro no puede pagarlo. Y otro ni se acuerda de haberlo pedido.',
   'Un lead barato que no se matricula es el más caro de todos.',
   'Con Qualivo, antes de que hables con nadie, unas preguntas por WhatsApp separan al que quiere empezar este mes del que solo está mirando.',
   'Le decimos a Meta quién era un buen contacto, para que busque más como ese.',
   'Y revisamos qué anuncio te trae alumnos, no solo interesados.',
   CTA_VOZ]),
}

def inicios(frases):
    out = []
    for i, f in enumerate(frases):
        w = f.replace('Qualivo', 'cualivo').replace(',', '').split()[:2]
        out.append((i, ' '.join(w)))
    return out

SEGUIMIENTO = [['MINUTOS', 'WhatsApp'], ['+2 H 30', 'Llamada'], ['DÍA 1', 'WhatsApp'], ['DÍA 3', 'WhatsApp']]
CITA = [['AL RESERVAR', 'Confirmación'], ['LA VÍSPERA', 'Recordatorio'], ['SI NO VIENE', 'Le llamamos']]

def esc_vel(t, d):
    o6 = t[6][0] - t[5][0]
    return [
    plano(t[0][0], 'clips/2.mp4', [T(0, estilo='etiqueta', y=150, texto='Martes · 12:10'), T(0.5, estilo='sub', y=1250, tam=54, texto='Pide información de un curso')], tr('smoothleft', .35), brillo=0.0),
    plano(t[1][0], 'clips/3.mp4', [T(0, estilo='etiqueta', y=150, texto='Martes · 19:30'), T(0.4, estilo='etiqueta-turquesa', y=250, texto='7 horas después'), T(0.3, estilo='sub', y=1250, texto='Le contestas')], tr('fade', .3)),
    plano(t[2][0], 'clips/k2.mp4', [T(0.2, estilo='sub-turquesa', y=1250, texto='Ya habló con otros dos centros')], tr('fade', .35)),
    tarjeta(t[3][0], '#F2F3F5', [T(0, estilo='grande', y=600, tam=84, color='tinta', texto='No lo perdiste por el precio.'), T(d(3) * 0.5, estilo='grande', y=920, tam=92, color='tinta', texto='*Lo perdiste por llegar tarde.')], tr('wipeup', .4)),
    pantalla(t[4][0], CHAT, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, d(4) * 0.55, estilo='sub', y=1560, tam=56, texto='Respuesta en minutos'), T(d(4) * 0.55, estilo='sub-turquesa', y=1560, tam=54, texto='Con sus palabras')], tr('smoothleft', .35)),
    tarjeta(t[5][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Si no contesta'),
        T(0, d(5) * 0.4, estilo='linea', y=760, items=SEGUIMIENTO, hechos=[0]),
        T(d(5) * 0.4, o6, estilo='linea', y=760, items=SEGUIMIENTO, hechos=[0, 1]),
        T(o6, o6 + d(6) * 0.5, estilo='linea', y=760, items=SEGUIMIENTO, hechos=[0, 1, 2]),
        T(o6 + d(6) * 0.5, estilo='linea', y=760, items=SEGUIMIENTO, hechos=[0, 1, 2, 3]),
        T(0.3, o6, estilo='sub', y=1250, tam=56, texto='Le llamamos'),
        T(o6, estilo='sub', y=1250, tam=56, texto='Y al día siguiente, otro mensaje')], tr('smoothleft', .35), zoom=False),
    pantalla(t[7][0], AGENDA, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, d(7) * 0.5, estilo='sub-turquesa', y=1560, tam=54, texto='Cita en tu agenda'), T(d(7) * 0.5, estilo='sub', y=1560, tam=50, texto='Sabiendo qué quiere estudiar')], tr('fade', .35)),
    cta(t[8][0])]

def esc_pla(t, d):
    o7, o8 = t[7][0] - t[6][0], t[8][0] - t[6][0]
    return [
    tarjeta(t[0][0], '#101319', [T(0, estilo='grande', y=420, tam=260, texto='10'), T(0.3, estilo='sub', y=900, tam=58, texto='reservaron una visita')], tr('fade', .25)),
    tarjeta(t[1][0], '#101319', [T(0, estilo='grande', y=420, tam=260, texto='4'), T(0.2, estilo='sub-turquesa', y=900, tam=58, texto='vinieron')], tr('fade', .3)),
    plano(t[2][0], 'clips/5.mp4', [T(0.2, estilo='sub', y=1250, texto='6 huecos para nadie')], tr('fade', .35), brillo=-0.02),
    plano(t[3][0], 'clips/k3.mp4', [T(0.2, estilo='sub', y=1060, tam=54, texto='Ya los habías pagado'),
        T(d(3) * 0.35, estilo='pasos', y=1260, pasos=[['Anuncio', 'ok'], ['Formulario', 'ok'], ['Llamada', 'ok'], ['Visita', 'ko']])], tr('smoothleft', .35)),
    tarjeta(t[4][0], '#F2F3F5', [T(0, estilo='grande', y=760, tam=90, color='tinta', texto='*Casi nunca es mala suerte.')], tr('fade', .3)),
    tarjeta(t[5][0], '#101319', [T(0, estilo='etiqueta', y=150, texto='Reserva a 4 días'),
        T(0.1, estilo='linea', y=700, items=[['LUN', 'Reserva'], ['MAR', '···'], ['MIÉ', '···'], ['JUE 18:00', 'No viene']], hechos=[0]),
        T(d(5) * 0.45, estilo='sub', y=1100, tam=54, texto='Nadie volvió a hablar con él')], tr('smoothleft', .35), zoom=False),
    tarjeta(t[6][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'),
        T(0, o7, estilo='linea', y=760, items=CITA, hechos=[0]),
        T(o7, o8, estilo='linea', y=760, items=CITA, hechos=[0, 1]),
        T(o8, estilo='linea', y=760, items=CITA, hechos=[0, 1, 2]),
        T(0.3, o7, estilo='sub', y=1250, tam=54, texto='Confirmada al reservar'),
        T(o7, o8, estilo='sub', y=1250, tam=54, texto='Recordatorio la víspera'),
        T(o8, estilo='sub-turquesa', y=1250, tam=54, texto='Si no aparece, le llamamos')], tr('smoothleft', .35), zoom=False),
    cta(t[9][0])]

def esc_cur(t, d):
    o2 = t[2][0] - t[1][0]
    return [
    tarjeta(t[0][0], '#101319', [T(0, estilo='etiqueta', y=150, texto='Tu anuncio'), T(0, estilo='grande', y=430, tam=240, texto='5 €'), T(0.3, estilo='sub', y=900, tam=58, texto='por lead'), T(d(0) * 0.6, estilo='sub-turquesa', y=1040, tam=58, texto='Parece una ganga')], tr('fade', .3)),
    plano(t[1][0], 'clips/k5.mp4', [T(0.1, o2, estilo='sub', y=1170, tam=54, texto='Hasta que les llamas…'),
        T(o2 + d(2) * 0.05, estilo='sub', y=1060, tam=54, texto='Solo quería mirar'), T(o2 + d(2) * 0.35, estilo='sub', y=1170, tam=54, texto='No puede pagarlo'), T(o2 + d(2) * 0.65, estilo='sub', y=1280, tam=54, texto='Ni se acuerda de haberlo pedido')], tr('fade', .35)),
    tarjeta(t[3][0], '#F2F3F5', [T(0, estilo='grande', y=560, tam=80, color='tinta', texto='Un lead barato que no se matricula'), T(d(3) * 0.5, estilo='grande', y=900, tam=70, color='tinta', texto='*es el más caro de todos')], tr('wipeup', .4)),
    tarjeta(t[4][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.05, estilo='grande', y=275, tam=50, texto='Unas preguntas antes de hablar'),
        T(d(4) * 0.2, estilo='pregunta', y=500, texto='¿Qué quieres estudiar?', respuesta='Máster en RR. HH.', senal='Interés concreto'),
        T(d(4) * 0.4, estilo='pregunta', y=740, texto='¿Cuándo te gustaría empezar?', respuesta='Este mes', senal='Urgencia'),
        T(d(4) * 0.6, estilo='pregunta', y=980, texto='¿Cómo lo pagarías?', respuesta='Mi empresa lo bonifica', senal='Capacidad'),
        T(d(4) * 0.8, estilo='medidor', y=1290, texto='Intención', valor='ALTA', fraccion=0.92),
        T(0, estilo='etiqueta', y=1560, texto='Ejemplo')], tr('smoothleft', .35), zoom=False),
    tarjeta(t[5][0], '#101319', [T(0, estilo='grande', y=520, tam=72, texto='Le decimos a Meta'), T(d(5) * 0.3, estilo='grande', y=680, tam=84, texto='*quién era un buen contacto'), T(d(5) * 0.6, estilo='sub', y=1060, tam=46, texto='para que busque más como ese')], tr('fade', .35)),
    pantalla(t[6][0], ANUNCIOS, [T(0, estilo='etiqueta-turquesa', y=150, texto='Datos de ejemplo'), T(0.3, d(6) * 0.55, estilo='sub-turquesa', y=1560, tam=54, texto='Qué anuncio trae alumnos'), T(d(6) * 0.55, estilo='sub', y=1560, tam=54, texto='no solo interesados')], tr('fade', .35)),
    cta(t[7][0])]

DEF = {
 'vel': {'pausas': {1: 0.3, 3: 0.35, 4: 0.4, 8: 0.35}, 'escenas': esc_vel},
 'pla': {'pausas': {1: 0.5, 4: 0.3, 6: 0.35, 9: 0.35}, 'escenas': esc_pla},
 'cur': {'pausas': {1: 0.3, 3: 0.35, 4: 0.4, 7: 0.35}, 'escenas': esc_cur},
}

def maqueta(n):
    """Sin voz: una palabra cada 1/3,5 s (el ritmo real de Javier), un respiro de 0,25 s entre frases y audio mudo."""
    words, t = [], 0.3
    for f in GUIONES[n][1]:
        for w in f.replace('Qualivo', 'cualivo').split():
            words.append({'w': w, 's': round(t, 3), 'e': round(t + 0.33, 3)}); t += 1 / 3.5
        t += 0.25
    os.makedirs(VOZ, exist_ok=True)
    audio = f'{VOZ}/{n}-maqueta.mp3'
    json.dump(words, open(f'{VOZ}/{n}-maqueta.json', 'w'), ensure_ascii=False)
    subprocess.run([a3.FF, '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
                    '-t', '%.2f' % (t + 0.5), '-c:a', 'libmp3lame', '-b:a', '64k', audio], check=True)
    return 'maqueta'

def construir(n, toma):
    nombre, frases = GUIONES[n]
    if MAQUETA: toma = maqueta(n)
    a3.ANUNCIOS_DEF[n] = {'inicios': inicios(frases), **DEF[n]}
    # anuncios3_build.construir lee de voz-ads/: se apunta a voz-s1/ con un enlace por anuncio y toma.
    for ext in ('mp3', 'json'):
        dst = f'voz-ads/{n}-{toma}.{ext}'
        if os.path.lexists(dst): os.remove(dst)
        os.symlink(os.path.abspath(f'{VOZ}/{n}-{toma}.{ext}'), dst)
    a3.OUT = OUT
    salida = a3.construir(n, toma)
    final = f'{OUT}/S1_{n.upper()}_v2{"_MAQUETA" if MAQUETA else ""}_9x16.mp4'
    os.replace(salida, final)
    for ext in ('mp3', 'json'): os.remove(f'voz-ads/{n}-{toma}.{ext}')
    print('→', final)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for arg in sys.argv[1:]:
        n, _, toma = arg.partition(':'); construir(n, toma or 'a')
