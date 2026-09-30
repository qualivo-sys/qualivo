#!/usr/bin/env python3
"""Test de dolor para CLÍNICAS: Velocidad, Huecos (plantón de la primera visita) y Prioridad.
Mismo molde que anuncios_s1_build.py (formación): misma estructura, CTA común y una sola música.
Guiones: content/agentes/creative-performance/2026-10-clinicas-test-creativo.md.

   MAQUETA=1 python3 anuncios_clinicas_build.py cvel chue cpri    # maqueta muda; los planos nuevos salen como hueco
   python3 anuncios_clinicas_build.py cvel:a chue:a cpri:a          # con voz (voz-s1/<n>-<toma>.mp3 + .json)

Mientras no existan los planos nuevos de clínica (clips/c1…c5), la escena sale como un hueco
rotulado con lo que hay que generar. Cuando existan, se usan solos."""
import os
import anuncios_s1_build as s1
from anuncios_s1_build import T, tr, plano, pantalla, tarjeta, CHAT, AGENDA

CTA_VOZ = 'Si tu clínica ya invierte en anuncios, te enseñamos en treinta minutos dónde se te escapan los pacientes entre el anuncio y la primera visita.'

def cta(ini):
    return tarjeta(ini, '#27BDB1', [
        T(0, estilo='grande', y=330, tam=78, color='tinta', texto='¿Tu clínica ya invierte en anuncios?'),
        T(1.0, estilo='grande', y=720, tam=58, color='tinta', texto='¿Dónde se te escapan los pacientes?'),
        T(1.8, estilo='boton', y=1080, texto='Diagnóstico gratuito · 30 min'),
        T(2.4, estilo='boton', y=1240, color='blanco', texto='Revisar mis fugas →'),
        T(0, estilo='grande', y=1620, tam=56, color='tinta', texto='Qualivo')])

# Planos nuevos que hay que generar en Kling (9:16, 5 s, sin caras reconocibles ni pantallas legibles, ambiente español).
NUEVOS = {
 'c1': 'Recepción de clínica: teléfono sonando y gente esperando',
 'c2': 'Móvil de la clínica en el mostrador, notificaciones',
 'c3': 'Gabinete dental vacío, sillón con la luz encendida',
 'c4': 'Profesional con bata junto a la puerta, sin cara',
 'c5': 'Recepcionista al teléfono, de espaldas',
}

def toma(ini, clip, textos, t=None, **kw):
    """El plano nuevo si ya existe; si no, un hueco rotulado para la maqueta."""
    if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), f'clips/{clip}.mp4')):
        return plano(ini, f'clips/{clip}.mp4', textos, t, **kw)
    hueco = T(0, estilo='hueco', y=330, alto=820, texto=f'Plano nuevo · {clip}', nota=NUEVOS[clip])
    return tarjeta(ini, '#101319', [hueco] + textos, t, zoom=False)

GUIONES = {
 'cvel': ('Clinicas-Velocidad', [
   'Martes, doce y media. Una paciente escribe al WhatsApp de tu clínica para pedir cita.',
   'Recepción tiene a tres personas delante y el teléfono sonando.',
   'Le contestan a las ocho de la tarde.',
   'Para entonces, ya tiene cita en otra clínica.',
   'No se fue por el precio. Se fue porque nadie le contestó.',
   'Con Qualivo, quien escribe recibe respuesta por WhatsApp en minutos, con sus palabras.',
   'Si no contesta, le llamamos. Y al día siguiente, le volvemos a escribir.',
   'Cuando quiere venir, te llega con la cita en la agenda y sabiendo qué tratamiento busca.',
   CTA_VOZ]),
 'chue': ('Clinicas-Huecos', [
   'Martes, diez y media. El gabinete, preparado.',
   'La primera visita no viene.',
   'No avisó. No coge el teléfono.',
   'Y ese hueco ya lo habías pagado: el anuncio, la llamada y la hora del profesional.',
   'Casi nunca es mala suerte.',
   'Reservó hace dos semanas y nadie volvió a hablar con ella.',
   'Con Qualivo, la cita se confirma al reservar.',
   'La víspera recibe un recordatorio.',
   'Y si no aparece, le llamamos.',
   CTA_VOZ]),
 'cpri': ('Clinicas-Prioridad', [
   'El que quiere un implante y el que pregunta cuánto cuesta una limpieza.',
   'En tu clínica reciben exactamente la misma llamada.',
   'Por orden de llegada.',
   'Y mientras recepción explica el precio de la limpieza, el del implante sigue esperando.',
   'No es que falte gente en recepción. Es que nadie decide a quién se llama primero.',
   'Con Qualivo, antes de llamar, unas preguntas por WhatsApp: qué tratamiento busca y cuándo quiere empezar.',
   'Recepción llama primero a quien quiere tratarse ya.',
   'Y le decimos a Meta quién era un buen contacto, para que busque más como ese.',
   CTA_VOZ]),
}

SEGUIMIENTO = s1.SEGUIMIENTO
CITA = s1.CITA

def esc_cvel(t, d):
    return [
    toma(t[0][0], 'c2', [T(0, estilo='etiqueta', y=150, texto='Martes · 12:30'), T(0.5, estilo='sub', y=1250, tam=54, texto='Una paciente pide cita')], tr('smoothleft', .35)),
    toma(t[1][0], 'c1', [T(0.2, estilo='sub', y=1250, tam=54, texto='3 personas delante y el teléfono sonando')], tr('fade', .3)),
    tarjeta(t[2][0], '#101319', [T(0, estilo='etiqueta', y=150, texto='Martes · 20:00'), T(0, estilo='grande', y=520, tam=150, texto='7 h 30'), T(0.3, estilo='sub-turquesa', y=900, tam=58, texto='después')], tr('fade', .3)),
    toma(t[3][0], 'c5', [T(0.2, estilo='sub-turquesa', y=1250, tam=54, texto='Ya tiene cita en otra clínica')], tr('fade', .35)),
    tarjeta(t[4][0], '#F2F3F5', [T(0, estilo='grande', y=600, tam=84, color='tinta', texto='No se fue por el precio.'), T(d(4) * 0.45, estilo='grande', y=920, tam=84, color='tinta', texto='*Se fue porque nadie le contestó.')], tr('wipeup', .4)),
    pantalla(t[5][0], CHAT, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, d(5) * 0.55, estilo='sub', y=1560, tam=56, texto='Respuesta en minutos'), T(d(5) * 0.55, estilo='sub-turquesa', y=1560, tam=54, texto='Con sus palabras')], tr('smoothleft', .35)),
    tarjeta(t[6][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Si no contesta'),
        T(0, d(6) * 0.45, estilo='linea', y=760, items=SEGUIMIENTO, hechos=[0, 1]),
        T(d(6) * 0.45, estilo='linea', y=760, items=SEGUIMIENTO, hechos=[0, 1, 2, 3]),
        T(0.3, d(6) * 0.45, estilo='sub', y=1250, tam=56, texto='Le llamamos'),
        T(d(6) * 0.45, estilo='sub', y=1250, tam=56, texto='Y al día siguiente, otro mensaje')], tr('smoothleft', .35), zoom=False),
    pantalla(t[7][0], AGENDA, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, d(7) * 0.5, estilo='sub-turquesa', y=1560, tam=54, texto='Cita en la agenda'), T(d(7) * 0.5, estilo='sub', y=1560, tam=50, texto='Sabiendo qué tratamiento busca')], tr('fade', .35)),
    cta(t[8][0])]

def esc_chue(t, d):
    o7, o8 = t[7][0] - t[6][0], t[8][0] - t[6][0]
    return [
    toma(t[0][0], 'c3', [T(0, estilo='etiqueta', y=150, texto='Martes · 10:30'), T(0.4, estilo='sub', y=1250, tam=54, texto='El gabinete, preparado')], tr('fade', .3)),
    toma(t[1][0], 'c4', [T(0.1, estilo='sub-turquesa', y=1250, tam=58, texto='La primera visita no viene')], tr('fade', .3)),
    tarjeta(t[2][0], '#101319', [T(0, estilo='grande', y=560, tam=96, texto='No avisó.'), T(d(2) * 0.45, estilo='grande', y=760, tam=96, texto='*No coge.')], tr('fade', .3)),
    toma(t[3][0], 'c3', [T(0.2, estilo='sub', y=1060, tam=54, texto='Ese hueco ya lo habías pagado'),
        T(d(3) * 0.35, estilo='pasos', y=1260, pasos=[['Anuncio', 'ok'], ['Llamada', 'ok'], ['Hora del profesional', 'ok'], ['Visita', 'ko']])], tr('smoothleft', .35)),
    tarjeta(t[4][0], '#F2F3F5', [T(0, estilo='grande', y=760, tam=90, color='tinta', texto='*Casi nunca es mala suerte.')], tr('fade', .3)),
    tarjeta(t[5][0], '#101319', [T(0, estilo='etiqueta', y=150, texto='Reserva a 2 semanas'),
        T(0.1, estilo='linea', y=700, items=[['DÍA 1', 'Reserva'], ['SEM 1', '···'], ['SEM 2', '···'], ['MAR 10:30', 'No viene']], hechos=[0]),
        T(d(5) * 0.45, estilo='sub', y=1100, tam=54, texto='Nadie volvió a hablar con ella')], tr('smoothleft', .35), zoom=False),
    tarjeta(t[6][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'),
        T(0, o7, estilo='linea', y=760, items=CITA, hechos=[0]),
        T(o7, o8, estilo='linea', y=760, items=CITA, hechos=[0, 1]),
        T(o8, estilo='linea', y=760, items=CITA, hechos=[0, 1, 2]),
        T(0.3, o7, estilo='sub', y=1250, tam=54, texto='Confirmada al reservar'),
        T(o7, o8, estilo='sub', y=1250, tam=54, texto='Recordatorio la víspera'),
        T(o8, estilo='sub-turquesa', y=1250, tam=54, texto='Si no aparece, le llamamos')], tr('smoothleft', .35), zoom=False),
    cta(t[9][0])]

def esc_cpri(t, d):
    o1, o2 = t[1][0] - t[0][0], t[2][0] - t[0][0]
    o7 = t[7][0] - t[6][0]
    return [
    tarjeta(t[0][0], '#101319', [T(0, estilo='sub', y=520, tam=58, texto='Quiere un implante'), T(d(0) * 0.5, estilo='sub', y=760, tam=58, texto='Pregunta el precio de una limpieza'),
        T(o1, estilo='grande', y=1020, tam=66, texto='*La misma llamada.'), T(o2, estilo='etiqueta', y=150, texto='Por orden de llegada')], tr('fade', .3)),
    toma(t[3][0], 'c5', [T(0.2, d(3) * 0.5, estilo='sub', y=1170, tam=54, texto='Explicando el precio de la limpieza'), T(d(3) * 0.5, estilo='sub-turquesa', y=1170, tam=54, texto='El del implante, esperando')], tr('fade', .35)),
    tarjeta(t[4][0], '#F2F3F5', [T(0, estilo='grande', y=560, tam=78, color='tinta', texto='No falta gente en recepción.'), T(d(4) * 0.45, estilo='grande', y=900, tam=74, color='tinta', texto='*Falta decidir a quién se llama primero.')], tr('wipeup', .4)),
    tarjeta(t[5][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.05, estilo='grande', y=275, tam=50, texto='Unas preguntas antes de llamar'),
        T(d(5) * 0.25, estilo='pregunta', y=560, texto='¿Qué tratamiento buscas?', respuesta='Implante', senal='Ticket alto'),
        T(d(5) * 0.5, estilo='pregunta', y=820, texto='¿Cuándo te gustaría empezar?', respuesta='Este mes', senal='Urgencia'),
        T(d(5) * 0.75, estilo='medidor', y=1120, texto='Prioridad', valor='ALTA', fraccion=0.92),
        T(0, estilo='etiqueta', y=1560, texto='Ejemplo')], tr('smoothleft', .35), zoom=False),
    tarjeta(t[6][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Recepción llama primero a'),
        T(0.2, estilo='lista', y=520, texto='Implante · este mes', check=True),
        T(0.5, estilo='lista', y=680, texto='Ortodoncia · en 2 meses', color='grisclaro'),
        T(0.8, estilo='lista', y=840, texto='Limpieza · solo precio', color='gris'),
        T(0, estilo='etiqueta', y=1560, texto='Ejemplo'),
        T(o7, estilo='grande', y=1080, tam=60, texto='Le decimos a Meta'), T(o7 + d(7) * 0.3, estilo='grande', y=1180, tam=66, texto='*quién era un buen contacto')], tr('fade', .35), zoom=False),
    cta(t[8][0])]

DEF = {
 'cvel': {'pausas': {2: 0.3, 4: 0.35, 5: 0.4, 8: 0.35}, 'escenas': esc_cvel},
 'chue': {'pausas': {1: 0.5, 4: 0.3, 6: 0.35, 9: 0.35}, 'escenas': esc_chue},
 'cpri': {'pausas': {2: 0.25, 4: 0.35, 5: 0.4, 8: 0.35}, 'escenas': esc_cpri},
}

if __name__ == '__main__':
    import sys
    s1.GUIONES.update(GUIONES); s1.DEF.update(DEF)
    s1.OUT = os.environ.get('OUT', 'out-clinicas')
    os.makedirs(s1.OUT, exist_ok=True)
    for arg in sys.argv[1:]:
        n, _, tm = arg.partition(':'); s1.construir(n, tm or 'a')
        viejo = f'{s1.OUT}/S1_{n.upper()}_v2{"_MAQUETA" if s1.MAQUETA else ""}_9x16.mp4'
        nuevo = f'{s1.OUT}/CLI_{n[1:].upper()}_v1{"_MAQUETA" if s1.MAQUETA else ""}_9x16.mp4'
        os.replace(viejo, nuevo); print('→', nuevo)
