#!/usr/bin/env python3
"""Construye la V2 «Las fugas» a partir de las líneas de voz (voz-v2/limpio/N.mp3).
   python3 v2_build.py A  -> 01_Qualivo_Fugas_Hook-Anuncio_9x16.mp4  (líneas 0-16)
   python3 v2_build.py B  -> 02_Qualivo_Fugas_Hook-Laura_9x16.mp4    (líneas 1-16)
Las escenas van atadas a cada línea de voz, así que quitar una línea quita su escena."""
import json, re, subprocess, sys, imageio_ffmpeg, montar
FF = imageio_ffmpeg.get_ffmpeg_exe()
LINEAS = [l.strip() for l in open('guion-v2-lineas.txt', encoding='utf-8') if l.strip()]
GAP = {17: .35, 0: .4, 1: .3, 2: .2, 3: .22, 4: .22, 5: .32, 6: .3, 7: .38, 8: .25, 9: .2, 10: .2, 11: .2, 12: .2, 13: .35, 14: .3, 15: .35, 16: 0}
COLA = 1.6   # pantalla final tras la última palabra

def dur(f):
    o = subprocess.run([FF, '-i', f], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', o); return int(m.group(2)) * 60 + float(m.group(3))

def tempo_de(i, d):
    # Las líneas lentas se aceleran un poco (sin cambiar el tono); objetivo ~2,9 palabras/s.
    rate = len(LINEAS[i].split()) / d
    return max(1.06, min(1.16, 3.2 / rate))

def voz(indices, salida):
    t, tiempos, ent, fc = 0.0, {}, [], ''
    for k, i in enumerate(indices):
        d0 = dur(f'voz-v2/limpio/{i}.mp3'); tp = tempo_de(i, d0); d = d0 / tp
        tiempos[i] = (round(t, 3), round(t + d, 3), tp)
        ent += ['-i', f'voz-v2/limpio/{i}.mp3']
        fc += f'[{k}:a]atempo={tp:.4f},apad=pad_dur={GAP[i]}[a{k}];'
        t += d + GAP[i]
    fc += ''.join(f'[a{k}]' for k in range(len(indices))) + f'concat=n={len(indices)}:v=0:a=1[out]'
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + ent + ['-filter_complex', fc, '-map', '[out]',
                   '-c:a', 'libmp3lame', '-b:a', '160k', salida], check=True)
    return tiempos, round(t - GAP[indices[-1]], 3)

def T(desde=0, hasta=None, **b):
    o = {'desde': desde, 'bloques': [b]};
    if hasta is not None: o['hasta'] = hasta
    return o

def escenas_de(tiempos):
    E = []
    def t0(i): return tiempos[i][0]
    def d(i): return tiempos[i][1] - tiempos[i][0]
    def hay(i): return i in tiempos
    tr = lambda tipo='fade', dur=0.35: {'tipo': tipo, 'dur': dur}
    if hay(0):   # HOOK A · sin cara: manos escribiendo, texto encima
        E.append({'inicio': 0, 'tipo': 'plano', 'src': 'clips/1.mp4', 'brillo': -0.2, 'saturacion': 0.8, 'transicion': tr('fade', .4), 'textos': [
            T(0, estilo='grande', y=330, tam=78, texto='Este lead no se perdió en el anuncio'),
            T(0.4, estilo='pasos', y=760, tam=40, pasos=[['ANUNCIO', 'ok'], ['LEAD', 'ok'], ['RESPUESTA', '']]),
            T(d(0) * 0.58, estilo='grande', y=1150, tam=92, texto='*SE PERDIÓ DESPUÉS'),
        ]})
    if hay(1):   # LAURA · domingo 22:40 → lunes
        b = d(1) * 0.52   # corte del domingo al lunes justo cuando la voz dice «Le contestaron»
        E.append({'inicio': t0(1), 'tipo': 'plano', 'src': 'clips/0.mp4', 'transicion': tr('smoothleft', .45), 'textos': [
            T(0, estilo='etiqueta', y=150, texto='Domingo · 22:40'),
            T(0.9, estilo='sub', y=1250, texto='Laura pide información de un curso'),
        ]})
        E.append({'inicio': t0(1) + b, 'tipo': 'plano', 'src': 'clips/3.mp4', 'transicion': tr('fade', .35), 'textos': [
            T(0, estilo='etiqueta', y=150, texto='Lunes · 11:00'),
            T(0.5, estilo='etiqueta-turquesa', y=250, texto='12 horas después'),
            T(0.3, (d(1) - b) * 0.5, estilo='sub', y=1250, texto='Le contestan el lunes.'),
            T((d(1) - b) * 0.5, estilo='sub-turquesa', y=1250, texto='Ya está hablando con otro centro.'),
        ]})
    if hay(2):   # Y no es la única
        E.append({'inicio': t0(2), 'tipo': 'plano', 'src': 'clips/6.mp4', 'transicion': tr('wipeleft', .35), 'textos': [
            T(0, estilo='sub', y=1250, texto='Y no es la única.')]})
    if hay(3):   # FUGA 1
        E.append({'inicio': t0(3), 'tipo': 'plano', 'src': 'clips/2.mp4', 'transicion': tr('smoothleft', .4), 'textos': [
            T(0.2, estilo='pasos', y=1120, tam=36, pasos=[['ANUNCIO', 'ok'], ['LEAD', 'ok'], ['RESPUESTA', 'ok'], ['SEGUIMIENTO', 'ko']]),
            T(1.0, estilo='sub', y=980, tam=56, texto='Nadie vuelve a escribirle'),
            T(d(3) * 0.55, estilo='fuga', y=1260, texto='Fuga #1 · Sin seguimiento'),
        ]})
    if hay(4):   # FUGA 2
        E.append({'inicio': t0(4), 'tipo': 'plano', 'src': 'clips/5.mp4', 'transicion': tr('smoothleft', .4), 'textos': [
            T(0.2, estilo='sub', y=1080, tam=60, texto='Reserva… y no aparece'),
            T(d(4) * 0.4, estilo='fuga', y=1230, texto='Fuga #2 · No-show'),
        ]})
    if hay(5):   # FUGA 3
        E.append({'inicio': t0(5), 'tipo': 'plano', 'src': 'clips/7.mp4', 'transicion': tr('fade', .45), 'textos': [
            T(0.2, estilo='sub', y=1080, tam=60, texto='Nadie le hace seguimiento'),
            T(d(5) * 0.45, estilo='fuga', y=1230, tam=44, texto='Fuga #3 · Oportunidad olvidada'),
        ]})
    if hay(6):   # GIRO 1 · los leads son malos
        E.append({'inicio': t0(6), 'tipo': 'tarjeta', 'fondo': '#F2F3F5', 'transicion': tr('wipeup', .45), 'textos': [
            T(0, estilo='grande', y=560, tam=84, color='tinta', texto='Y miras la campaña y piensas…'),
            T(d(6) * 0.55, estilo='grande', y=960, tam=96, color='tinta', texto='*los leads son malos.'),
        ]})
    if hay(7):   # GIRO 2 · entre el anuncio y la venta
        items = ['ANUNCIO', 'RESPUESTA', 'SEGUIMIENTO', 'CITA', 'ASISTENCIA', 'VENTA']
        a, b = d(7) * 0.33, d(7) * 0.72
        E.append({'inicio': t0(7), 'tipo': 'tarjeta', 'fondo': '#101319', 'zoom': False, 'transicion': tr('fade', .4), 'textos': [
            T(0, a, estilo='cadena', y=230, tam=56, paso=118, items=items, marcar=[0], apagar=[1, 2, 3, 4, 5]),
            T(a, b, estilo='cadena', y=230, tam=56, paso=118, items=items, marcar=[0], apagar=[5]),
            T(b, estilo='cadena', y=230, tam=56, paso=118, items=items, marcar=[0, 5]),
            T(b, estilo='grande', y=1500, tam=58, texto='*EL LEAD ES SOLO EL PRINCIPIO'),
        ]})
    if hay(8):   # Por eso conectamos todo el recorrido
        E.append({'inicio': t0(8), 'tipo': 'tarjeta', 'fondo': '#101319', 'zoom': False, 'transicion': tr('circleopen', .5), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=110, texto='Con Qualivo'),
            T(0, estilo='cadena', y=230, tam=56, paso=118, items=['ANUNCIO', 'RESPUESTA', 'SEGUIMIENTO', 'CITA', 'ASISTENCIA', 'VENTA'], marcar=[0, 1, 2, 3, 4, 5]),
            T(0.4, estilo='sub-turquesa', y=1500, tam=54, texto='Todo el recorrido, conectado'),
        ]})
    if hay(9):   # 1 · FILTRAR · preguntas que detectan intención de compra
        D9 = t0(10) - t0(9) if hay(10) else d(9)
        q = [dict(estilo='pregunta', y=440, texto='¿Qué quieres estudiar?', respuesta='Máster en RR. HH.', senal='Interés concreto'),
             dict(estilo='pregunta', y=680, texto='¿Cuándo te gustaría empezar?', respuesta='Este mes', senal='Urgencia'),
             dict(estilo='pregunta', y=920, texto='¿Cómo lo pagarías?', respuesta='Mi empresa lo bonifica', senal='Capacidad')]
        pasos = [0.25, 0.75, 1.25]
        med = D9 * 0.62
        E.append({'inicio': t0(9), 'tipo': 'tarjeta', 'fondo': '#101319', 'transicion': tr('smoothleft', .4), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='1 · Filtrar'),
            T(0.05, estilo='grande', y=275, tam=50, texto='Preguntas que detectan intención'),
            T(pasos[0], **q[0]), T(pasos[1], **q[1]), T(pasos[2], **q[2]),
            T(med, med + 0.2, estilo='medidor', y=1230, texto='Intención de compra', valor='', fraccion=0.3),
            T(med + 0.2, med + 0.4, estilo='medidor', y=1230, texto='Intención de compra', valor='', fraccion=0.6),
            T(med + 0.4, estilo='medidor', y=1230, texto='Intención de compra', valor='ALTA', fraccion=0.92),
            T(med + 0.5, estilo='sub-turquesa', y=1450, tam=54, texto='Lead listo · pasa a tu equipo'),
        ]})
    if hay(10):  # 2 · RESPONDER
        E.append({'inicio': t0(10), 'tipo': 'plano', 'src': 'clips/intel.mp4', 'desde': 29.0, 'marco': True, 'foco': {'k': 1.22, 'cx': 360, 'cy': 800}, 'transicion': tr('smoothleft', .4), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='2 · Responder'),
            T(0.8, estilo='sub', y=1560, tam=52, texto='Respuesta en minutos'),
        ]})
    if hay(11):  # 3 · SEGUIR
        items = [['DÍA 0', 'WhatsApp'], ['DÍA 1', 'Llamada'], ['DÍA 3', 'WhatsApp'], ['DÍA 5', 'Llamada']]
        p = d(11) / 4
        E.append({'inicio': t0(11), 'tipo': 'tarjeta', 'fondo': '#101319', 'zoom': False, 'transicion': tr('smoothleft', .4), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='3 · Seguir'),
            T(0, p, estilo='linea', y=760, items=items, hechos=[0]),
            T(p, 2 * p, estilo='linea', y=760, items=items, hechos=[0, 1]),
            T(2 * p, 3 * p, estilo='linea', y=760, items=items, hechos=[0, 1, 2]),
            T(3 * p, estilo='linea', y=760, items=items, hechos=[0, 1, 2, 3]),
            T(0.5, estilo='sub', y=1250, tam=52, texto='Si no contesta, el sistema insiste por ti'),
        ]})
    if hay(12):  # 4 · AGENDAR
        E.append({'inicio': t0(12), 'tipo': 'plano', 'src': 'clips/intel.mp4', 'desde': 36.5, 'marco': True, 'foco': {'k': 1.45, 'cx': 320, 'cy': 860}, 'transicion': tr('fade', .35), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='4 · Agendar'),
            T(0.6, estilo='sub', y=1560, tam=52, texto='Cita cerrada + recordatorios'),
        ]})
    if hay(13):  # 5 · VENDER · entras tú (sin cara: aula)
        E.append({'inicio': t0(13), 'tipo': 'plano', 'src': 'clips/4.mp4', 'brillo': -0.08, 'transicion': tr('fade', .4), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='5 · Vender'),
            T(0.2, d(13) * 0.55, estilo='sub', y=1250, texto='Cuando está preparado para hablar…'),
            T(d(13) * 0.55, estilo='grande', y=1230, tam=96, texto='*ENTRAS TÚ'),
        ]})
    if hay(14):  # INTELLIGENCE · todo el recorrido (vista Recorrido)
        E.append({'inicio': t0(14), 'tipo': 'plano', 'src': 'clips/intel.mp4', 'desde': 43.9, 'marco': True, 'foco': {'k': 1.25, 'cx': 340, 'cy': 560}, 'transicion': tr('smoothleft', .4), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='Qualivo Intelligence'),
            T(0.2, d(14) * 0.42, estilo='sub', y=1560, tam=52, texto='Qué pasa con cada oportunidad'),
            T(d(14) * 0.42, d(14) * 0.72, estilo='sub-turquesa', y=1560, tam=52, texto='Desde qué anuncio llegó…'),
            T(d(14) * 0.72, estilo='sub-turquesa', y=1560, tam=52, texto='…hasta si terminó comprando'),
        ]})
    if hay(17):  # DESPUÉS · analizamos los anuncios
        E.append({'inicio': t0(17), 'tipo': 'plano', 'src': 'clips/intel-anuncios.mp4', 'desde': 0.0, 'marco': True, 'foco': {'k': 1.18, 'cx': 360, 'cy': 700}, 'transicion': tr('smoothleft', .4), 'textos': [
            T(0, estilo='etiqueta-turquesa', y=150, texto='Después · tus anuncios'),
            T(0.3, d(17) * 0.5, estilo='sub', y=1480, tam=52, texto='Analizamos cada anuncio con esos datos'),
            T(d(17) * 0.5, estilo='sub-turquesa', y=1480, tam=52, texto='Cuáles traen ventas'),
            T(d(17) * 0.62, estilo='sub', y=1580, tam=52, texto='no solo interesados'),
        ]})
    if hay(15):  # CIERRE · sin cara: la cadena completa
        E.append({'inicio': t0(15), 'tipo': 'tarjeta', 'fondo': '#101319', 'zoom': False, 'transicion': tr('fade', .4), 'textos': [
            T(0, estilo='cadena', y=230, tam=56, paso=118, items=['ANUNCIO', 'RESPUESTA', 'SEGUIMIENTO', 'CITA', 'ASISTENCIA', 'VENTA'], marcar=[0, 1, 2, 3, 4, 5]),
            T(0.5, estilo='grande', y=1330, tam=64, texto='*EL LEAD ES SOLO EL PRINCIPIO'),
        ]})
    if hay(16):  # CTA
        corte = t0(16)
        E.append({'inicio': corte, 'tipo': 'tarjeta', 'fondo': '#27BDB1', 'textos': [
            T(0, estilo='grande', y=380, tam=84, color='tinta', texto='¿Dónde estás perdiendo tus leads?'),
            T(1.2, estilo='grande', y=820, tam=58, color='tinta', texto='Diagnóstico gratuito · 30 minutos'),
            T(2.2, estilo='boton', y=1060, texto='Ver mis fugas'),
            T(0, estilo='grande', y=1560, tam=56, color='tinta', texto='Qualivo'),
        ]})
    return E

def construir(variante):
    orden = list(range(15)) + [17, 15, 16]
    indices = orden if variante == 'A' else orden[1:]
    nombre = '01_Qualivo_Fugas_Hook-Anuncio_9x16' if variante == 'A' else '02_Qualivo_Fugas_Hook-Laura_9x16'
    tiempos, fin = voz(indices, f'voz-fugas-{variante}.mp3')
    spec = {'nombre': nombre, 'voz': f'voz-fugas-{variante}.mp3', 'musica': 'musica.mp3', 'musica_volumen': 0.12,
            'duracion': round(fin + COLA, 2), 'tiempos_voz': {str(k): v for k, v in tiempos.items()}, 'escenas': escenas_de(tiempos)}
    json.dump(spec, open(f'fugas-{variante}.json', 'w'), ensure_ascii=False, indent=1)
    print(variante, 'voz hasta', fin, 'dur', spec['duracion'], 'escenas', len(spec['escenas']))
    montar.montar(f'fugas-{variante}.json', f'out-fugas/{nombre}.mp4')

if __name__ == '__main__':
    for v in sys.argv[1:]: construir(v)
