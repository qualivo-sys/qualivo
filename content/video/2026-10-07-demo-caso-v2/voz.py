#!/usr/bin/env python3
"""Demo-caso v2: locución de David (ElevenLabs), tiempos de cada bloque para la escena y mezcla con la música H.

   ELEVENLABS_API_KEY=... python3 voz.py clinicas voz     # genera voz/clinicas.mp3 + .json (palabras con tiempos)
   python3 voz.py clinicas tiempos                        # escribe tiempos-clinicas.js a partir del .json
   python3 voz.py clinicas mezcla out/QV_3V2_clinicas_45_muda.mp4 out/QV_3V2_clinicas_45.mp4
"""
import json, os, subprocess, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
VA = os.path.join(AQUI, '../../../produccion/video-anuncios')
sys.path.insert(0, VA)

# (bloque de la escena, frase). Cada bloque arranca en la primera palabra de su frase.
GUIONES = {
 'clinicas': [
  ('hook', 'Tu recepción dice que los pacientes de Instagram solo preguntan precio.'),
  ('giro', 'Antes de darle la razón, mira el anuncio que los trajo.'),
  ('s1', 'Este anuncio no le habla a todo el mundo: le habla a quien quiere empezar un implante este mes.'),
  ('s2', 'El formulario pregunta tres cosas: qué le interesa, cuándo quiere empezar y si ya le han valorado en otra clínica.'),
  ('s3', 'Con eso, cada contacto cae en su sitio antes de que nadie descuelgue.'),
  ('s4', 'Si no encaja, no ocupa una hora de tu agenda, y la puerta queda abierta.'),
  ('s4b', 'Si encaja, reserva su valoración en el momento, le llega la confirmación y, la víspera, un recordatorio.'),
  ('s5', 'Y cuando viene, le decimos a Meta quién era un buen contacto, para que busque más como ese.'),
  ('s6', 'Cada mañana sabes qué anuncio te trae pacientes y cuál solo preguntas.'),
  ('s7', 'No son siete automatizaciones. Es un sistema.'),
  ('s9', '¿Tu clínica ya invierte en anuncios y no te compran? Te enseñamos dónde falla tu recorrido.'),
 ],
 'formacion': [
  ('hook', 'Tu comercial dice que los leads de Meta no se matriculan.'),
  ('giro', 'Antes de darle la razón, mira el anuncio que los trajo.'),
  ('s1', 'Este anuncio no le habla a todo el mundo: le habla a quien quiere empezar el curso de electricista en noviembre.'),
  ('s2', 'El formulario pregunta tres cosas: qué curso le interesa, cuándo quiere empezar y si puede venir por las tardes.'),
  ('s3', 'Con eso, cada contacto cae en su sitio antes de que nadie descuelgue.'),
  ('s4', 'Si no encaja, no ocupa una hora de tu equipo, y la puerta queda abierta.'),
  ('s4b', 'Si encaja, reserva su llamada de admisión en el momento, le llega la confirmación y, la víspera, un recordatorio.'),
  ('s5', 'Y cuando viene, le decimos a Meta quién era un buen contacto, para que busque más como ese.'),
  ('s6', 'Cada mañana sabes qué anuncio te trae alumnos y cuál solo curiosos.'),
  ('s7', 'No son siete automatizaciones. Es un sistema.'),
  ('s9', '¿Tu centro ya invierte en anuncios y no te compran? Te enseñamos dónde falla tu recorrido.'),
 ],
}
COLA = 2.6          # segundos de cierre después de la última palabra
ADELANTO = 0.15     # la pantalla entra un pelo antes que la voz

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')

def tiempos(n):
    pal = json.load(open(f'{AQUI}/voz/{n}.json'))
    ws = [norm(p['w']) for p in pal]
    T, i = {}, 0
    for bloque, frase in GUIONES[n]:
        cab = [norm(x) for x in frase.split()[:2]]
        while i < len(ws) - 1 and ws[i:i + 2] != cab: i += 1
        if ws[i:i + 2] != cab: sys.exit(f'no encuentro «{" ".join(cab)}» en la locución')
        T[bloque] = round(max(0, pal[i]['s'] - ADELANTO), 2) if bloque != 'hook' else 0
        i += 1
    dur = round(pal[-1]['e'] + COLA, 2)
    open(f'{AQUI}/tiempos-{n}.js', 'w').write(f'window.TIEMPOS={json.dumps(T)};window.DURACION={dur};\n')
    print(T, dur)

def mezcla(n, muda, salida):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    musica = os.path.join(VA, 'musica6/h-urbano-norm.mp3')
    dur = float(open(f'{AQUI}/tiempos-{n}.js').read().split('DURACION=')[1].split(';')[0])
    fo = dur - 1.6
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', muda, '-i', f'{AQUI}/voz/{n}.mp3', '-i', musica, '-filter_complex',
        f'[2:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{dur},asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st={fo}:d=1.6,volume=0.55[m];'
        '[1:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[v][vsc];'
        '[m][vsc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700:makeup=1[md];'
        '[v][md]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,aformat=sample_rates=44100[a]',
        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    n, orden, *resto = sys.argv[1:]
    if orden == 'voz':
        import voz_elevenlabs as v
        os.makedirs(f'{AQUI}/voz', exist_ok=True)
        v.tts(' '.join(f for _, f in GUIONES[n]), 'david', f'{AQUI}/voz/{n}')
    elif orden == 'tiempos': tiempos(n)
    elif orden == 'mezcla': mezcla(n, *resto)
