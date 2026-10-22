#!/usr/bin/env python3
"""Anuncio 09 «Solicitudes de calidad» (formación): locución de Javier · Qualivo (ElevenLabs), tiempos y mezcla.
   ELEVENLABS_API_KEY=... python3 voz.py voz [extra]   # voz/principal.* (y con «extra», las pistas aparte)
   python3 voz.py tiempos                               # tiempos.js
   python3 voz.py mezcla out/muda.mp4 out/final.mp4
La clave nunca se escribe en el repo. Guion v2: content/copy/2026-11-guion-anuncio-formacion-calidad.md (rama de la landing).
Pista principal = gancho A + prueba B + CTA de Meta (decisiones pendientes de Maikel)."""
import json, os, subprocess, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
VA = os.path.join(AQUI, '../../../produccion/video-anuncios'); sys.path.insert(0, VA)
GUION = [
 ('gancho', 'Si vendes formación y ya inviertes en publicidad, ya lo sabes: el reto no es conseguir más solicitudes. Es que sean de calidad.'),
 ('dolor', 'Porque admisiones acaba llamando a quien no contesta.'),
 ('d2', 'Reserva gente que luego no aparece.'),
 ('d3', 'Y quien sí encajaba con el curso… se enfría esperando su turno.'),
 ('cambia', 'La calidad se trabaja en todo el recorrido.'),
 ('p1', 'Un anuncio que habla a quien encaja con cada curso.'),
 ('p2', 'Un formulario con cuatro preguntas que separa a quien está listo.'),
 ('p3', 'Una respuesta por WhatsApp en minutos, que resuelve lo básico y recoge lo que falta.'),
 ('p4', 'Y admisiones llama con la ficha delante: qué quiere, qué le preocupa y por dónde empezar.'),
 ('prueba', 'Y cada solicitud tiene su siguiente paso. Nadie se queda esperando a que alguien se acuerde.'),
 ('cta', 'Si ya inviertes en anuncios para vender formación, toca en Más información y responde cuatro preguntas. Lo vemos en treinta minutos, con tus números.'),
]
EXTRA = {
 'gancho_b': 'Lunes, nueve de la mañana. Admisiones abre el CRM: treinta solicitudes nuevas. ¿A quién llama primero?',
 'prueba_a': 'En una escuela de aviación, en un mes: diez matrículas y diez veces lo invertido en publicidad.',
 'cta_landing': 'Si tu centro ya invierte en anuncios, pide tu diagnóstico: treinta minutos, con tus números, y vemos dónde se te están quedando las matrículas.',
}
# marcas finas: (nombre, bloque, palabra)
MARCAS = [('g2', 'gancho', 'calidad'), ('g1', 'gancho', 'reto'), ('c1', 'cta', 'toca'), ('c2', 'cta', 'lo')]
COLA, ADELANTO, AJUSTES = 1.6, 0.15, {'stability': 1.0}

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')

def tiempos():
    pal = json.load(open(f'{AQUI}/voz/principal.json')); ws = [norm(p['w']) for p in pal]; T, i = {}, 0
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
    open(f'{AQUI}/tiempos.js', 'w').write(f'window.TIEMPOS={json.dumps(T)};window.DURACION={dur};window.SUBS={json.dumps(subs, ensure_ascii=False)};\n')
    print(T, dur)

def mezcla(muda, salida):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe(); musica = os.path.join(VA, 'musica6/h-urbano-norm.mp3')
    dur = float(open(f'{AQUI}/tiempos.js').read().split('DURACION=')[1].split(';')[0]); fo = dur - 1.4
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', muda, '-i', f'{AQUI}/voz/principal.mp3', '-i', musica, '-filter_complex',
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
        v.tts(' '.join(f for _, f in GUION), 'javier', f'{AQUI}/voz/principal', ajustes=AJUSTES)
        if resto[:1] == ['extra']:
            for k, t in EXTRA.items(): v.tts(t, 'javier', f'{AQUI}/voz/{k}', ajustes=AJUSTES)
    elif orden == 'tiempos': tiempos()
    elif orden == 'mezcla': mezcla(*resto)
