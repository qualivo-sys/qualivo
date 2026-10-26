#!/usr/bin/env python3
"""Anuncio 11 «Dónde se pierden» (formación): locución de Javier · Qualivo (ElevenLabs), tiempos y mezcla.
   ELEVENLABS_API_KEY=... python3 voz.py voz   # voz/principal.*
   python3 voz.py tiempos                     # tiempos.js
   python3 voz.py mezcla out/muda.mp4 out/final.mp4
La clave nunca se escribe en el repo. Imagen: pantallas reales de Intelligence (sector formación, datos simulados)."""
import json, os, subprocess, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
VA = os.path.join(AQUI, '../../../produccion/video-anuncios'); sys.path.insert(0, VA)
GUION = [
 ('gancho', 'Inviertes en anuncios para vender formación. ¿Sabes cuántas solicitudes acaban en matrícula?'),
 ('antes', 'Muchas veces, el problema empieza en el anuncio: si habla para todos, atrae a cualquiera.'),
 ('metodo', 'Nosotros empezamos antes: definimos a tu alumno ideal, sus dolores, y lo que le frustra en el día a día.'),
 ('angulos', 'Cada anuncio toca un dolor distinto.'),
 ('filtro', 'Y el formulario filtra quién encaja de verdad.'),
 ('nos', 'Es lo mismo que hacemos con nuestros propios anuncios.'),
 ('despues', 'Pero el anuncio es solo el principio: después, piden información… y nadie les contesta a tiempo.'),
 ('sis', 'Por eso cada solicitud recibe respuesta en minutos, se ordena por intención de compra, y admisiones sabe a quién llamar primero.'),
 ('meta', 'Y tus anuncios aprenden de quién se matricula de verdad.'),
 ('cta', 'Si ya inviertes en captar alumnos, toca en Más información. Te enseñamos dónde se pierden los tuyos.'),
]
EXTRA = {}
# marcas finas: (nombre, bloque, palabra)
VAR = os.environ.get('VARIANTE', ''); SUF = f'_{VAR}' if VAR else ''
if VAR == 'nolose':   # gancho con la respuesta literal más repetida del formulario (Growth, 26-oct)
    GUION = [('gancho', '¿Dónde se te pierden los alumnos? La respuesta que más nos dan es: no lo sé.'), ('aver', 'Vamos a averiguarlo.')] + GUION[1:]
MARCAS = [('g2', 'gancho', 'sabes' if not VAR else 'respuesta'), ('a2', 'antes', 'atrae'), ('m2', 'metodo', 'dolores'), ('d2', 'despues', 'piden'), ('s2', 'sis', 'ordena'), ('s3', 'sis', 'admisiones'), ('c1', 'cta', 'toca'), ('c2', 'cta', 'te')]
COLA, ADELANTO, AJUSTES = 1.6, 0.15, {'stability': 1.0}

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')

def tiempos():
    pal = json.load(open(f'{AQUI}/voz/principal{SUF}.json')); ws = [norm(p['w']) for p in pal]; T, i = {}, 0
    for bloque, frase in GUION:
        cab = [norm(x) for x in frase.split()[:2]]
        while i < len(ws) - 1 and ws[i:i + 2] != cab: i += 1
        if ws[i:i + 2] != cab: sys.exit(f'no encuentro «{" ".join(cab)}»')
        T[bloque] = round(max(0, pal[i]['s'] - ADELANTO), 2) if bloque != 'gancho' else 0; i += 1
    for nombre, bloque, w in MARCAS:
        T[nombre] = round(next(p['s'] for p in pal if p['s'] >= T[bloque] and norm(p['w']) == w), 2)
    dur = round(pal[-1]['e'] + COLA, 2)
    trozos, cur = [], []
    for p in pal:
        cur.append(p)
        if p['w'][-1:] in '.?,:…': trozos.append(cur); cur = []
    if cur: trozos.append(cur)
    subs = []
    for tr in trozos:
        n = -(-len(tr) // 5); tam = -(-len(tr) // n)
        for k in range(0, len(tr), tam):
            c = tr[k:k + tam]; subs.append([round(c[0]['s'], 2), round(c[-1]['e'] + .15, 2), ' '.join(x['w'] for x in c)])
    for k in range(len(subs) - 1): subs[k][1] = min(subs[k][1], subs[k + 1][0])
    open(f'{AQUI}/tiempos{SUF}.js', 'w').write(f'window.TIEMPOS={json.dumps(T)};window.DURACION={dur};window.SUBS={json.dumps(subs, ensure_ascii=False)};\n')
    print(T, dur)

def mezcla(muda, salida):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe(); musica = os.path.join(VA, 'musica6/h-urbano-norm.mp3')
    dur = float(open(f'{AQUI}/tiempos{SUF}.js').read().split('DURACION=')[1].split(';')[0]); fo = dur - 1.4
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', muda, '-i', f'{AQUI}/voz/principal{SUF}.mp3', '-i', musica, '-filter_complex',
        f'[2:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{dur},asetpts=PTS-STARTPTS,afade=t=in:d=0.3,afade=t=out:st={fo}:d=1.4,volume=0.5[m];'
        f'[1:a]aformat=sample_rates=44100:channel_layouts=stereo,apad=whole_dur={dur},asplit=2[v][vsc];'
        '[m][vsc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700:makeup=1[md];'
        '[v][md]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,aformat=sample_rates=44100[a]',
        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    orden, *resto = sys.argv[1:]
    if orden == 'voz':
        import voz_elevenlabs as v
        v.tts(' '.join(f for _, f in GUION), 'javier', f'{AQUI}/voz/principal{SUF}', ajustes=AJUSTES)
        if resto[:1] == ['extra']:
            for k, t in EXTRA.items(): v.tts(t, 'javier', f'{AQUI}/voz/{k}', ajustes=AJUSTES)
    elif orden == 'tiempos': tiempos()
    elif orden == 'mezcla': mezcla(*resto)
