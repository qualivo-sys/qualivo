#!/usr/bin/env python3
"""Tres anuncios IA (30-sep-2026): velocidad, plantones y curiosos. Voz de Javier en una sola
toma por anuncio; las escenas se atan al inicio de cada frase (transcripción por palabras) y las
pausas se meten en el silencio real entre frases, nunca a mitad de palabra.
   python3 anuncios3_build.py velocidad plantones curiosos"""
import json, subprocess, sys, unicodedata, imageio_ffmpeg, numpy as np, montar
FF = imageio_ffmpeg.get_ffmpeg_exe()
TEMPO = 0.96
COLA = 2.0
import os
MUSICA = os.environ.get('MUSICA', 'musica3/2-deephouse-norm.mp3')
OUT = os.environ.get('OUT', 'out-ads')

def norm(w): return ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if c.isalpha())

def pcm(audio):
    raw = subprocess.run([FF, '-i', audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(float) / 32768

def silencio_antes(P, ts, desde):
    a, b = max(desde, ts - 0.6), ts + 0.1
    mejor, t = None, a
    while t + 0.03 <= b:
        s = P[int(t * 16000):int((t + 0.03) * 16000)]
        e = float(np.sqrt(np.mean(s ** 2))) if len(s) else 1
        if mejor is None or e < mejor[0]: mejor = (e, t + 0.015)
        t += 0.005
    return mejor[1]

def tiempos_frases(words, inicios):
    ws = [norm(w['w']) for w in words]; out, k = [], 0
    for i, frase in inicios:
        p = [norm(x) for x in frase.split()]
        while ws[k:k + len(p)] != p:
            k += 1
            if k > len(ws): raise SystemExit('no encuentro: ' + frase)
        out.append((i, k)); k += len(p)
    res = {}
    for n, (i, k) in enumerate(out):
        fin = words[out[n + 1][1] - 1]['e'] if n + 1 < len(out) else words[-1]['e']
        res[i] = [words[k]['s'], fin, words[k - 1]['e'] if k > 0 else 0.0]
    return res

def T(desde=0, hasta=None, **b):
    o = {'desde': desde, 'bloques': [b]}
    if hasta is not None: o['hasta'] = hasta
    return o
def tr(tipo='fade', d=0.35): return {'tipo': tipo, 'dur': d}
CHAT = {'src': 'clips/intel.mp4', 'desde': 29.0, 'marco': True, 'foco': {'k': 1.22, 'cx': 360, 'cy': 800}}
AGENDA = {'src': 'clips/intel.mp4', 'desde': 36.5, 'marco': True, 'foco': {'k': 1.45, 'cx': 320, 'cy': 860}}
ANUNCIOS = {'src': 'clips/intel-anuncios.mp4', 'desde': 0.0, 'marco': True, 'foco': {'k': 1.18, 'cx': 360, 'cy': 700}}
def plano(ini, src, textos, t=None, **kw):
    e = {'inicio': ini, 'tipo': 'plano', 'src': src, 'textos': textos}; e.update(kw)
    if t: e['transicion'] = t
    return e
def pantalla(ini, base, textos, t=None):
    e = dict(base); e.update({'inicio': ini, 'tipo': 'plano', 'textos': textos})
    if t: e['transicion'] = t
    return e
def tarjeta(ini, fondo, textos, t=None, zoom=True):
    e = {'inicio': ini, 'tipo': 'tarjeta', 'fondo': fondo, 'zoom': zoom, 'textos': textos}
    if t: e['transicion'] = t
    return e
def cta(ini, linea2):
    return tarjeta(ini, '#27BDB1', [
        T(0, estilo='grande', y=360, tam=78, color='tinta', texto='¿Tu centro ya invierte en anuncios?'),
        T(1.0, estilo='grande', y=760, tam=56, color='tinta', texto=linea2),
        T(1.8, estilo='boton', y=1120, texto='Diagnóstico gratuito · 30 min'),
        T(0, estilo='grande', y=1600, tam=56, color='tinta', texto='Qualivo')])

# ---------------------------------------------------------------- guiones
ANUNCIOS_DEF = {
 'velocidad': {
  'inicios': [(0, 'te pidio'), (1, 'tu le contestaste'), (2, 'para entonces'), (3, 'no perdiste'), (4, 'con cualivo'),
              (5, 'si no contesta'), (6, 'y cuando'), (7, 'si tu centro')],
  'pausas': {3: 0.35, 4: 0.4, 7: 0.35},
  'escenas': lambda t, d: [
    plano(t[0][0], 'clips/k1.mp4', [T(0, estilo='etiqueta', y=150, texto='Domingo · 23:00'), T(0.6, estilo='sub', y=1250, tam=54, texto='Pide información de un curso')], tr('smoothleft', .35), brillo=-0.02),
    plano(t[1][0], 'clips/3.mp4', [T(0, estilo='etiqueta', y=150, texto='Lunes · 10:00'), T(0.4, estilo='etiqueta-turquesa', y=250, texto='11 horas después'), T(0.3, estilo='sub', y=1250, texto='Le contestas')], tr('fade', .3)),
    plano(t[2][0], 'clips/k2.mp4', [T(0.2, estilo='sub-turquesa', y=1250, texto='Ya habló con otros dos centros')], tr('fade', .35)),
    tarjeta(t[3][0], '#F2F3F5', [T(0, estilo='grande', y=600, tam=84, color='tinta', texto='No lo perdiste por el precio.'), T(d(3) * 0.5, estilo='grande', y=920, tam=92, color='tinta', texto='*Lo perdiste por llegar tarde.')], tr('wipeup', .4)),
    pantalla(t[4][0], CHAT, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, d(4) * 0.55, estilo='sub', y=1560, tam=56, texto='Respuesta en minutos'), T(d(4) * 0.55, estilo='sub-turquesa', y=1560, tam=50, texto='De noche y en fin de semana')], tr('smoothleft', .35)),
    tarjeta(t[5][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Si no contesta'),
        T(0, d(5) * 0.25, estilo='linea', y=760, items=[['MINUTO 1', 'WhatsApp'], ['+2 H', 'Llamada'], ['DÍA 1', 'WhatsApp'], ['DÍA 3', 'Llamada']], hechos=[0]),
        T(d(5) * 0.25, d(5) * 0.5, estilo='linea', y=760, items=[['MINUTO 1', 'WhatsApp'], ['+2 H', 'Llamada'], ['DÍA 1', 'WhatsApp'], ['DÍA 3', 'Llamada']], hechos=[0, 1]),
        T(d(5) * 0.5, d(5) * 0.75, estilo='linea', y=760, items=[['MINUTO 1', 'WhatsApp'], ['+2 H', 'Llamada'], ['DÍA 1', 'WhatsApp'], ['DÍA 3', 'Llamada']], hechos=[0, 1, 2]),
        T(d(5) * 0.75, estilo='linea', y=760, items=[['MINUTO 1', 'WhatsApp'], ['+2 H', 'Llamada'], ['DÍA 1', 'WhatsApp'], ['DÍA 3', 'Llamada']], hechos=[0, 1, 2, 3]),
        T(0.3, estilo='sub', y=1250, tam=56, texto='El sistema insiste por ti')], tr('smoothleft', .35), zoom=False),
    pantalla(t[6][0], AGENDA, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, estilo='sub-turquesa', y=1560, tam=54, texto='Cita ya en tu agenda')], tr('fade', .35)),
    cta(t[7][0], 'Te enseñamos cuántos alumnos se te enfrían por el camino')]},
 'plantones': {
  'inicios': [(0, 'diez personas'), (1, 'se presentaron'), (2, 'preparaste'), (3, 'y lo peor'), (4, 'con cualivo'),
              (5, 'y quien falta'), (6, 'tu agenda'), (7, 'si tu centro')],
  'pausas': {4: 0.3, 7: 0.3},
  'escenas': lambda t, d: [
    tarjeta(t[0][0], '#101319', [T(0, estilo='grande', y=420, tam=260, texto='10'), T(0.3, estilo='sub', y=900, tam=58, texto='reservaron una llamada')], tr('fade', .25)),
    tarjeta(t[1][0], '#101319', [T(0, estilo='grande', y=420, tam=260, texto='4'), T(0.2, estilo='sub-turquesa', y=900, tam=58, texto='se presentaron')], tr('fade', .3)),
    plano(t[2][0], 'clips/k3.mp4', [T(0.2, estilo='sub', y=1250, texto='Seis reuniones para nadie')], tr('fade', .35)),
    plano(t[3][0], 'clips/2.mp4', [T(0.2, d(3) * 0.5, estilo='sub', y=1180, tam=56, texto='Pagaste por esos leads'), T(d(3) * 0.5, estilo='sub', y=1180, tam=56, texto='…y nadie volvió a escribirles'), T(d(3) * 0.55, estilo='fuga', y=1310, texto='Fuga · Plantón sin recuperar')], tr('smoothleft', .35)),
    tarjeta(t[4][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'),
        T(0, d(4) * 0.33, estilo='linea', y=760, items=[['VÍSPERA', 'Confirma'], ['EL DÍA', 'Recordatorio'], ['+3 MIN', 'Te llamamos']], hechos=[0]),
        T(d(4) * 0.33, d(4) * 0.66, estilo='linea', y=760, items=[['VÍSPERA', 'Confirma'], ['EL DÍA', 'Recordatorio'], ['+3 MIN', 'Te llamamos']], hechos=[0, 1]),
        T(d(4) * 0.66, estilo='linea', y=760, items=[['VÍSPERA', 'Confirma'], ['EL DÍA', 'Recordatorio'], ['+3 MIN', 'Te llamamos']], hechos=[0, 1, 2]),
        T(0.3, estilo='sub', y=1250, tam=48, texto='Le recordamos lo que vais a ver')], tr('smoothleft', .35), zoom=False),
    plano(t[5][0], 'clips/k4.mp4', [T(0.2, estilo='sub-turquesa', y=1250, tam=52, texto='Nueva hora esa misma mañana')], tr('fade', .35)),
    pantalla(t[6][0], AGENDA, [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.3, estilo='sub-turquesa', y=1560, tam=54, texto='Gente que viene de verdad')], tr('fade', .35)),
    cta(t[7][0], 'Te enseñamos cuántas citas se te caen y cómo recuperarlas')]},
 'curiosos': {
  'inicios': [(0, 'tu anuncio'), (2, 'hasta que'), (3, 'un lead barato'), (4, 'nosotros filtramos'), (5, 'y le ensenamos'),
              (6, 'asi sabes'), (7, 'si tu centro')],
  'pausas': {2: 0.25, 3: 0.35, 4: 0.4, 7: 0.35},
  'escenas': lambda t, d: [
    tarjeta(t[0][0], '#101319', [T(0, estilo='etiqueta', y=150, texto='Tu anuncio'), T(0, estilo='grande', y=430, tam=240, texto='5 €'), T(0.3, estilo='sub', y=900, tam=58, texto='por lead'), T(d(0) * 0.6, estilo='sub-turquesa', y=1040, tam=58, texto='Parece una ganga')], tr('fade', .3)),
    plano(t[2][0], 'clips/k5.mp4', [T(d(2) * 0.2, estilo='sub', y=1060, tam=54, texto='Solo quería mirar'), T(d(2) * 0.45, estilo='sub', y=1170, tam=54, texto='No tiene presupuesto'), T(d(2) * 0.7, estilo='sub', y=1280, tam=54, texto='Ni recuerda haberlo pedido')], tr('fade', .35)),
    tarjeta(t[3][0], '#F2F3F5', [T(0, estilo='grande', y=600, tam=84, color='tinta', texto='Un lead barato que no compra'), T(d(3) * 0.5, estilo='grande', y=900, tam=70, color='tinta', texto='*es el más caro de todos')], tr('wipeup', .4)),
    tarjeta(t[4][0], '#101319', [T(0, estilo='etiqueta-turquesa', y=150, texto='Con Qualivo'), T(0.05, estilo='grande', y=275, tam=50, texto='Filtramos antes de que hables con nadie'),
        T(d(4) * 0.2, estilo='pregunta', y=500, texto='¿Qué quieres estudiar?', respuesta='Máster en RR. HH.', senal='Interés concreto'),
        T(d(4) * 0.4, estilo='pregunta', y=740, texto='¿Cuándo te gustaría empezar?', respuesta='Este mes', senal='Urgencia'),
        T(d(4) * 0.6, estilo='pregunta', y=980, texto='¿Cómo lo pagarías?', respuesta='Mi empresa lo bonifica', senal='Capacidad'),
        T(d(4) * 0.8, estilo='medidor', y=1290, texto='Intención de compra', valor='ALTA', fraccion=0.92)], tr('smoothleft', .35), zoom=False),
    tarjeta(t[5][0], '#101319', [T(0, estilo='grande', y=520, tam=72, texto='Meta aprende de'), T(d(5) * 0.35, estilo='grande', y=680, tam=88, texto='*quién se matricula'), T(d(5) * 0.6, estilo='sub', y=1000, tam=46, texto='no de quién rellena un formulario')], tr('fade', .35)),
    pantalla(t[6][0], ANUNCIOS, [T(0, estilo='etiqueta-turquesa', y=150, texto='Qualivo Intelligence'), T(0.3, d(6) * 0.55, estilo='sub-turquesa', y=1560, tam=54, texto='Qué anuncio trae alumnos'), T(d(6) * 0.55, estilo='sub', y=1560, tam=54, texto='no solo interesados')], tr('fade', .35)),
    cta(t[7][0], 'Te enseñamos cuánto te cuesta de verdad cada alumno')]},
}

def construir(nombre, toma='a'):
    D = ANUNCIOS_DEF[nombre]
    audio = f'voz-ads/{nombre}-{toma}.mp3'
    words = json.load(open(f'voz-ads/{nombre}-{toma}.json'))
    P = pcm(audio)
    t = tiempos_frases(words, D['inicios'])
    fin = words[-1]['e'] + 0.15
    cortes = sorted((silencio_antes(P, t[i][0], t[i][2]), p) for i, p in D['pausas'].items() if i in t)
    lim = [0.0] + [c for c, _ in cortes] + [fin]; fc = ''; ins = []
    for n in range(len(lim) - 1):
        ins += ['-i', audio]
        pad = cortes[n][1] if n < len(cortes) else 0
        fc += '[%d:a]atrim=%.3f:%.3f,asetpts=PTS-STARTPTS,atempo=%.3f,apad=pad_dur=%.3f[p%d];' % (n, lim[n], lim[n + 1], TEMPO, pad, n)
    fc += ''.join('[p%d]' % n for n in range(len(lim) - 1)) + 'concat=n=%d:v=0:a=1,afade=t=in:d=0.04[out]' % (len(lim) - 1)
    voz = f'voz-ads/{nombre}-final.mp3'
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + ins + ['-filter_complex', fc, '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '192k', voz], check=True)
    extra = lambda ts: sum(p for c, p in cortes if ts >= c)
    tt = {i: (round(max(0, a / TEMPO - 0.05 + extra(a)), 3), round(b / TEMPO + extra(a), 3)) for i, (a, b, _) in t.items()}
    d = lambda i: tt[i][1] - tt[i][0]
    dur = round(fin / TEMPO + sum(p for _, p in cortes) + COLA, 2)
    spec = {'nombre': nombre, 'voz': voz, 'musica': MUSICA, 'musica_volumen': 1.0, 'duracion': dur,
            'tiempos_voz': {str(k): v for k, v in tt.items()}, 'escenas': D['escenas'](tt, d)}
    json.dump(spec, open(f'ads-{nombre}.json', 'w'), ensure_ascii=False, indent=1)
    salida = f'{OUT}/0{list(ANUNCIOS_DEF).index(nombre) + 1}_Qualivo_{nombre.capitalize()}_9x16.mp4'
    print(nombre, 'duración', dur, 'escenas', len(spec['escenas']))
    montar.montar(f'ads-{nombre}.json', salida)
    return salida

if __name__ == '__main__':
    import os; os.makedirs(OUT, exist_ok=True)
    for a in sys.argv[1:]:
        n, _, toma = a.partition(':'); construir(n, toma or 'a')
