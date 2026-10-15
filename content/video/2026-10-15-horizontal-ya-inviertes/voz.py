#!/usr/bin/env python3
"""Horizontal «ya inviertes y no cierran» (encargo de Paid, 15-oct): locución de David (ElevenLabs), tiempos y mezcla.

   ELEVENLABS_API_KEY=... python3 voz.py voz        # voz/horizontal.mp3 + .json (palabras con tiempos)
   python3 voz.py tiempos                           # tiempos.js a partir del .json
   python3 voz.py mezcla out/muda.mp4 out/final.mp4
La clave nunca se escribe en el repo: se pasa en la línea de órdenes.
"""
import json, os, subprocess, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
VA = os.path.join(AQUI, '../../../produccion/video-anuncios')
sys.path.insert(0, VA)

# (bloque de la escena, frase). Cambios sobre el encargo de Paid, por las reglas de la casa:
# - nunca «no encaja» a un lead (regla de Maikel): «si todavía no, lo seguimos nosotros»;
# - a Meta se le devuelve la calidad del contacto, no «cuáles acabaron en cliente»;
# - las preguntas del formulario son las del cliente final (qué necesita, cuándo, presupuesto), no las de Qualivo.
# v2 (feedback de Maikel 15-oct): fuera los cortes de sector; entra «diseñamos todo tu sistema de captación»;
#   el gancho se queda como en la v1 (Maikel); el cierre vende la demostración de la reunión (recorrido, fuga y sistema aplicado a su caso).
GUION = [
 ('hook', 'Inviertes más de mil euros al mes en anuncios.'),
 ('h2', 'Tienes comerciales. Y los leads no cierran.'),
 ('giro', 'Tu equipo dice que los leads de Meta no valen. Antes de darles la razón, mira lo que pasa después del clic.'),
 ('dis', 'Por eso diseñamos todo tu sistema de captación: anuncios que atraen a tus mejores clientes, no a gente que no te puede comprar, y landings que convierten mejor.'),
 ('s2', 'El formulario pregunta lo que tu comercial preguntaría en la primera llamada.'),
 ('s3', 'Si encaja, pasa a tu comercial. Si todavía no, lo seguimos nosotros.'),
 ('s4', 'Le respondemos en minutos y lo seguimos hasta que tiene cita con tu comercial.'),
 ('s5', 'Y le decimos a Meta quiénes eran buenos contactos, para que te traiga más como esos.'),
 ('s9', 'En treinta minutos analizamos tu recorrido y dónde está la fuga. Y te enseñamos el sistema que montaríamos para ti, con ejemplos de anuncios, landings y nuestros agentes respondiendo como tu equipo.'),
]
MARCAS = [('g1', 'giro', 'mira'), ('d1', 'dis', 'anuncios'), ('d2', 'dis', 'gente'), ('d3', 'dis', 'landings'),
          ('f1', 's9', 'fuga'), ('f2', 's9', 'sistema'), ('f3', 's9', 'anuncios'), ('f4', 's9', 'landings'), ('f5', 's9', 'agentes')]
COLA = 2.4
ADELANTO = 0.15

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')

def tiempos():
    pal = json.load(open(f'{AQUI}/voz/horizontal.json'))
    ws = [norm(p['w']) for p in pal]
    T, i = {}, 0
    for bloque, frase in GUION:
        cab = [norm(x) for x in frase.split()[:2]]
        while i < len(ws) - 1 and ws[i:i + 2] != cab: i += 1
        if ws[i:i + 2] != cab: sys.exit(f'no encuentro «{" ".join(cab)}» en la locución')
        T[bloque] = round(max(0, pal[i]['s'] - ADELANTO), 2) if bloque != 'hook' else 0
        i += 1
    # marcas finas dentro de un bloque: (nombre, bloque, palabra) → inicio de la primera palabra que coincide tras el bloque
    for nombre, bloque, pal_ in MARCAS:
        j = next(k for k, p in enumerate(pal) if p['s'] >= T[bloque] and norm(p['w']).startswith(pal_))
        T[nombre] = round(pal[j]['s'], 2)
    dur = round(pal[-1]['e'] + COLA, 2)
    # subtítulos: la voz en trozos de 3-6 palabras
    # cortes en la puntuación; los trozos largos se parten en mitades parecidas (máx. 6 palabras)
    trozos, cur = [], []
    for p in pal:
        cur.append(p)
        if p['w'][-1:] in '.?,:': trozos.append(cur); cur = []
    if cur: trozos.append(cur)
    subs = []
    for tr in trozos:
        n = -(-len(tr) // 6); tam = -(-len(tr) // n)
        for k in range(0, len(tr), tam):
            c = tr[k:k + tam]
            subs.append([round(c[0]['s'], 2), round(c[-1]['e'] + .15, 2), ' '.join(x['w'] for x in c)])
    for k in range(len(subs) - 1): subs[k][1] = min(subs[k][1], subs[k + 1][0])
    open(f'{AQUI}/tiempos.js', 'w').write(f'window.TIEMPOS={json.dumps(T)};window.DURACION={dur};window.SUBS={json.dumps(subs, ensure_ascii=False)};\n')
    print(T, dur)

def mezcla(muda, salida):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    musica = os.path.join(VA, 'musica6/h-urbano-norm.mp3')
    dur = float(open(f'{AQUI}/tiempos.js').read().split('DURACION=')[1].split(';')[0])
    fo = dur - 1.6
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', muda, '-i', f'{AQUI}/voz/horizontal.mp3', '-i', musica, '-filter_complex',
        f'[2:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{dur},asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st={fo}:d=1.6,volume=0.55[m];'
        f'[1:a]aformat=sample_rates=44100:channel_layouts=stereo,apad=whole_dur={dur},asplit=2[v][vsc];'
        '[m][vsc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700:makeup=1[md];'
        '[v][md]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,aformat=sample_rates=44100[a]',
        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    orden, *resto = sys.argv[1:]
    if orden == 'voz':
        import voz_elevenlabs as v
        v.tts(' '.join(f for _, f in GUION), 'david', f'{AQUI}/voz/horizontal')
    elif orden == 'tiempos': tiempos()
    elif orden == 'mezcla': mezcla(*resto)
