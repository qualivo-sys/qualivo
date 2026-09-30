#!/usr/bin/env python3
"""V2 con el vídeo de Maikel a cámara: su voz de principio a fin, su cara como plano
principal e inserts (B-roll y Qualivo Intelligence) en cada fuga y en el sistema."""
import json, montar
FIN_VOZ = 59.2; COLA = 1.9
def T(desde=0, hasta=None, **b):
    o = {'desde': desde, 'bloques': [b]}
    if hasta is not None: o['hasta'] = hasta
    return o
tr = lambda tipo='fade', d=0.3: {'tipo': tipo, 'dur': d}
def cara(ini, zoom, textos, trans=None):
    e = {'inicio': ini, 'tipo': 'plano', 'src': 'maikel/cara-zoom.mp4' if zoom else 'maikel/cara.mp4',
         'desde': ini, 'brillo': 0.0, 'saturacion': 1.0, 'textos': textos}
    if trans: e['transicion'] = trans
    return e
E = [
 # HOOK (0-4.6)
 cara(0.0, False, [
   T(0.0, estilo='grande', y=200, tam=70, texto='Antes de decir que tus leads son malos…'),
   T(3.3, estilo='grande', y=470, tam=76, texto='*haz una cosa'),
 ]),
 cara(4.6, True, [
   T(0.1, estilo='grande', y=200, tam=72, texto='Coge tus últimos'),
   T(0.9, estilo='grande', y=310, tam=86, texto='*20 leads'),
   T(2.7, estilo='sub-turquesa', y=1560, tam=58, texto='¿Qué pasó con cada uno?'),
 ], tr('smoothleft', .35)),
 # LAS 4 FUGAS (9.1-24.7)
 {'inicio': 9.1, 'tipo': 'plano', 'src': 'clips/0.mp4', 'transicion': tr('smoothleft', .3), 'textos': [
   T(0, estilo='etiqueta', y=150, texto='Lead #1'),
   T(0.3, 2.3, estilo='sub', y=1170, tam=52, texto='Pidió info a las 20:00'),
   T(2.3, estilo='sub', y=1170, tam=52, texto='Contestaste al día siguiente'),
   T(2.6, estilo='fuga', y=1300, texto='Fuga · Respuesta tarde'),
 ]},
 {'inicio': 13.6, 'tipo': 'plano', 'src': 'clips/2.mp4', 'transicion': tr('smoothleft', .3), 'textos': [
   T(0, estilo='etiqueta', y=150, texto='Lead #2'),
   T(0.3, 2.2, estilo='sub', y=1170, tam=52, texto='Respondió al primer WhatsApp'),
   T(2.2, estilo='sub', y=1170, tam=52, texto='…y no volviste a escribirle'),
   T(2.5, estilo='fuga', y=1300, texto='Fuga · Sin seguimiento'),
 ]},
 {'inicio': 17.4, 'tipo': 'plano', 'src': 'clips/5.mp4', 'transicion': tr('smoothleft', .3), 'textos': [
   T(0, estilo='etiqueta', y=150, texto='Lead #3'),
   T(0.3, 1.9, estilo='sub', y=1170, tam=52, texto='Reservó una reunión'),
   T(1.9, estilo='sub', y=1170, tam=52, texto='No apareció. Fin.'),
   T(2.1, estilo='fuga', y=1300, texto='Fuga · No-show'),
 ]},
 {'inicio': 21.4, 'tipo': 'plano', 'src': 'clips/6.mp4', 'transicion': tr('fade', .35), 'textos': [
   T(0, estilo='etiqueta', y=150, texto='Lead #4'),
   T(0.3, 1.9, estilo='sub', y=1170, tam=52, texto='Recibió tu presupuesto'),
   T(1.9, estilo='sub', y=1170, tam=52, texto='…hace tres semanas'),
   T(2.1, estilo='fuga', y=1300, tam=46, texto='Fuga · Oferta olvidada'),
 ]},
 # EL GIRO (24.7-34.9)
 cara(24.7, False, [
   T(0.2, estilo='grande', y=200, tam=80, texto='¿Esos 4 eran malos?'),
   T(2.4, estilo='grande', y=420, tam=66, texto='*¿O estamos mirando mal el problema?'),
 ]),
 cara(29.35, True, [
   T(0.1, 2.0, estilo='sub', y=1520, tam=56, texto='Pagar por conseguir un lead…'),
   T(2.0, estilo='sub', y=1520, tam=56, texto='…y dejar el seguimiento al azar'),
   T(3.9, estilo='grande', y=230, tam=92, texto='*SALE CARO'),
 ], tr('fade', .3)),
 # EL SISTEMA (34.9-50.3)
 cara(34.9, False, [
   T(0.0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'),
   T(0.4, estilo='grande', y=290, tam=70, texto='Cada oportunidad tiene un'),
   T(1.6, estilo='grande', y=490, tam=80, texto='*siguiente paso'),
 ], tr('smoothleft', .3)),
 {'inicio': 38.4, 'tipo': 'plano', 'src': 'clips/intel.mp4', 'desde': 29.0, 'marco': True, 'transicion': tr('smoothleft', .3), 'textos': [
   T(0, estilo='etiqueta-turquesa', y=150, texto='Acaba de entrar'),
   T(0.9, estilo='sub-turquesa', y=1560, tam=60, texto='→ Respuesta'),
 ]},
 {'inicio': 40.45, 'tipo': 'tarjeta', 'fondo': '#101319', 'zoom': False, 'transicion': tr('smoothleft', .3), 'textos': [
   T(0, estilo='etiqueta-turquesa', y=150, texto='No contesta'),
   T(0, 0.5, estilo='linea', y=760, items=[['DÍA 0', 'WhatsApp'], ['DÍA 1', 'Llamada'], ['DÍA 3', 'WhatsApp']], hechos=[0]),
   T(0.5, 1.0, estilo='linea', y=760, items=[['DÍA 0', 'WhatsApp'], ['DÍA 1', 'Llamada'], ['DÍA 3', 'WhatsApp']], hechos=[0, 1]),
   T(1.0, estilo='linea', y=760, items=[['DÍA 0', 'WhatsApp'], ['DÍA 1', 'Llamada'], ['DÍA 3', 'WhatsApp']], hechos=[0, 1, 2]),
   T(0.9, estilo='sub-turquesa', y=1250, tam=60, texto='→ Seguimiento'),
 ]},
 {'inicio': 42.2, 'tipo': 'plano', 'src': 'clips/intel.mp4', 'desde': 36.5, 'marco': True, 'transicion': tr('smoothleft', .3), 'textos': [
   T(0, estilo='etiqueta-turquesa', y=150, texto='Tiene cita'),
   T(0.9, estilo='sub-turquesa', y=1560, tam=60, texto='→ Recordatorio'),
 ]},
 {'inicio': 44.1, 'tipo': 'plano', 'src': 'clips/intel-form-recorrido.mp4', 'desde': 13.3, 'marco': True, 'transicion': tr('fade', .3), 'textos': [
   T(0, estilo='etiqueta-turquesa', y=150, texto='Recibió una oferta'),
   T(1.7, estilo='sub-turquesa', y=1560, tam=60, texto='→ No desaparece'),
 ]},
 cara(46.95, True, [
   T(0.2, estilo='grande', y=230, tam=66, texto='Y cuando está preparado para comprar…'),
   T(2.3, estilo='grande', y=520, tam=86, texto='*entra tu equipo'),
 ], tr('fade', .3)),
 # CIERRE (50.3-59.2)
 cara(50.3, False, [
   T(0.2, 2.6, estilo='grande', y=220, tam=66, texto='Antes de invertir más en conseguir leads…'),
   T(2.6, estilo='grande', y=220, tam=66, texto='asegúrate de no perder'),
   T(3.2, estilo='grande', y=320, tam=74, texto='*los que ya tienes'),
 ], tr('fade', .3)),
 {'inicio': 55.8, 'tipo': 'plano', 'src': 'clips/intel-form-recorrido.mp4', 'desde': 7.3, 'marco': True, 'transicion': tr('fade', .35), 'textos': [
   T(0, estilo='etiqueta-turquesa', y=150, texto='Qualivo Intelligence'),
   T(0.8, estilo='sub-turquesa', y=1560, tam=56, texto='Analizamos contigo todo el recorrido'),
 ]},
 {'inicio': FIN_VOZ, 'tipo': 'tarjeta', 'fondo': '#27BDB1', 'textos': [
   T(0, estilo='grande', y=380, tam=84, color='tinta', texto='¿Dónde estás perdiendo tus leads?'),
   T(0.4, estilo='grande', y=820, tam=58, color='tinta', texto='Diagnóstico gratuito · 30 minutos'),
   T(0.8, estilo='boton', y=1060, texto='Ver mis fugas'),
   T(0, estilo='grande', y=1560, tam=56, color='tinta', texto='Qualivo'),
 ]},
]
spec = {'nombre': '03_Qualivo_Fugas_Maikel-camara_9x16', 'voz': 'maikel/voz.mp3', 'musica': 'musica.mp3',
        'musica_volumen': 0.07, 'duracion': round(FIN_VOZ + COLA, 2), 'escenas': E}
json.dump(spec, open('fugas-maikel.json', 'w'), ensure_ascii=False, indent=1)
montar.montar('fugas-maikel.json', 'out-fugas/03_Qualivo_Fugas_Maikel-camara_9x16.mp4')
