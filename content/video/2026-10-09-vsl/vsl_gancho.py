#!/usr/bin/env python3
"""VSL Qualivo · primeros 30 s (gancho + presentación) en 16:9, prueba de estilo.

El bruto (iPhone 4K, 3840x2160 tras girarlo) NO va al repo, que es público: se pasa como ruta.
   python3 vsl_gancho.py <bruto.mov> <carpeta_trabajo> [voz_limpia.mp3]
Pasos: cortes (pausas y una toma repetida fuera) -> encuadres 16:9 sacados del 4K (abierto, cerrado,
pantalla partida) -> audio limpio + música H baja -> capa de gráficos (capas.html, grabada con Playwright).
"""
import json, os, subprocess, sys
import imageio_ffmpeg

AQUI = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()
MUSICA = os.path.join(AQUI, '../../../produccion/video-anuncios/musica6/h-urbano-norm.mp3')
FPS = 30

# Encuadres sobre el 4K (3840x2160 una vez girado; cara ~ x 2280, y 570). (w, h, x, y) del recorte.
ABIERTO = (3200, 1800, 640, 0)      # abierto, con algo menos de portátil
CERRADO = (2240, 1260, 1160, 90)    # plano cerrado, cara al 38 % de la altura
PARTIDO = (1440, 1620, 1560, 0)     # va a la mitad izquierda (960x1080)

# (desde, hasta) en el bruto, y encuadre. Fuera: silencios largos y la primera toma de «cuántos formularios».
PLANOS = [(1.05, 4.20, 'abierto'), (4.20, 7.95, 'cerrado'),
          (8.36, 10.16, 'partido'), (13.80, 16.88, 'partido'), (17.17, 20.00, 'partido'),
          (20.00, 21.20, 'cerrado'), (21.72, 25.16, 'abierto'), (25.45, 29.55, 'abierto'),
          (30.50, 36.95, 'cerrado'),
          # segundo bloque (30-60 s)
          (37.05, 41.95, 'abierto'), (42.35, 48.30, 'cerrado'),
          (48.75, 52.62, 'partido'), (52.86, 54.60, 'partido'), (55.05, 61.30, 'partido'),
          (61.62, 67.45, 'cerrado')]

def nuevo(x):
    """Tiempo del bruto -> tiempo del montaje."""
    o = 0
    for a, b, _ in PLANOS:
        if a <= x <= b: return round(o + x - a, 2)
        o += b - a
    return None

def tiempos():
    T = lambda x: nuevo(x)
    total = round(sum(b - a for a, b, _ in PLANOS), 2)
    subs = [  # texto del guion (no el de la transcripción), troceado por frase
        (T(1.05), T(4.20), 'Hay empresas que invierten miles de euros en publicidad'),
        (T(4.20), T(7.95), 'y siguen sin saber qué anuncios les están trayendo <b>clientes de verdad.</b>'),
        (T(8.36), T(10.16), 'Saben cuánto cuesta un contacto,'),
        (T(13.80), T(16.88), 'cuántos formularios han recibido y cuánto dinero han gastado,'),
        (T(17.17), T(20.00), 'pero no saben si están atrayendo a las <b>personas adecuadas.</b>'),
        (T(20.00), T(21.20), 'Y ahí está el problema.'),
        (T(21.72), T(25.16), 'Un anuncio que habla a todo el mundo termina atrayendo a todo el mundo.'),
        (T(25.45), T(29.55), 'Y conseguir muchos contactos no significa conseguir <b>buenos clientes.</b>'),
        (T(30.50), T(33.20), 'Soy Maikel, fundador de Qualivo.'),
        (T(33.20), T(36.95), 'Y después de años trabajando en campañas de captación, hay algo que tengo muy claro.'),
        (T(37.05), T(41.95), 'La publicidad no consiste simplemente en lanzar anuncios y conseguir leads baratos.'),
        (T(42.35), T(44.84), 'Consiste en atraer a las personas adecuadas,'),
        (T(44.84), T(48.30), 'con el mensaje adecuado, y conseguir que den el siguiente paso.'),
        (T(48.75), T(52.62), 'Porque puedes tener una campaña que consiga contactos a cinco euros'),
        (T(52.86), T(54.60), 'y que ninguno termine comprando.'),
        (T(55.05), T(58.20), 'O una campaña que consiga contactos a veinte euros,'),
        (T(58.20), T(61.30), 'pero que genere <b>oportunidades comerciales</b> mucho mejores.'),
        (T(61.62), T(64.00), 'Y si solamente estás mirando el coste por lead,'),
        (T(64.00), total, 'puede que estés tomando <b>decisiones equivocadas.</b>'),
    ]
    TL = {'subs': subs,
          'k1': [T(5.40), T(7.95)],
          'split': [T(8.36), T(20.00)],
          'cards': [T(8.50), T(13.95), T(15.70), T(17.30)],
          'todos': [T(21.72), T(25.16)], 'todos2': T(23.55),
          'k2': [T(27.40), T(29.55)],
          'nombre': [T(30.70), T(34.80)],
          'k3': [T(39.50), T(41.95)],
          'pasos': [T(42.35), T(48.30)], 'pasosT': [T(44.00), T(45.20), T(47.60)],
          'split2': [T(48.75), T(61.30)], 'camp': [T(51.80), T(53.30), T(57.40), T(58.90)],
          'k4': [T(65.30), total]}
    open(os.path.join(AQUI, 'tiempos-gancho.js'), 'w').write('window.TL=' + json.dumps(TL, ensure_ascii=False) + ';\n')
    return total

def base(bruto, trabajo, total):
    """Vídeo 16:9 con los cortes y encuadres + audio limpio con música."""
    fil, vs, as_ = [], [], []
    for i, (a, b, enc) in enumerate(PLANOS):
        if enc == 'partido':
            w, h, x, y = PARTIDO
            v = f'crop={w}:{h}:{x}:{y},scale=960:1080,pad=1920:1080:0:0:#0A0F1A'
        else:
            w, h, x, y = ABIERTO if enc == 'abierto' else CERRADO
            v = f'crop={w}:{h}:{x}:{y},scale=1920:1080'
        d = b - a
        fil.append(f'[0:v]trim={a}:{b},setpts=PTS-STARTPTS,{v},fps={FPS},setsar=1[v{i}];')
        fil.append(f'[{VOZ_IN}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={d - 0.03:.3f}:d=0.03[a{i}];')
        vs.append(f'[v{i}]'); as_.append(f'[a{i}]')
    n = len(PLANOS)
    fil.append(''.join(f'{vs[i]}{as_[i]}' for i in range(n)) + f'concat=n={n}:v=1:a=1[vb][ab];')
    limpia = '' if VOZ else 'highpass=f=80,afftdn=nf=-28,'
    fil.append(f'[ab]{limpia}acompressor=threshold=0.1:ratio=2.5:attack=10:release=200,'
               'aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[voz][vsc];')
    fil.append(f'[1:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{total},asetpts=PTS-STARTPTS,'
               f'afade=t=in:d=0.6,afade=t=out:st={total - 1.2}:d=1.2,volume=0.30[m];'
               '[m][vsc]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=600[md];'
               '[voz][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=8[a]')
    salida = os.path.join(trabajo, 'base.mp4')
    extra = ['-i', VOZ] if VOZ else []
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', bruto, '-i', MUSICA, *extra, '-filter_complex', ''.join(fil),
                    '-map', '[vb]', '-map', '[a]', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
                    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', salida], check=True)
    return salida

def capas(trabajo, total):
    """Graba capas.html fotograma a fotograma con fondo transparente."""
    js = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch({{executablePath:'/opt/pw-browsers/chromium'}});
  const p = await b.newPage({{viewport:{{width:1920,height:1080}}}});
  await p.goto('file://{AQUI}/capas.html', {{waitUntil:'networkidle'}}); await p.waitForTimeout(600);
  const n = Math.round({FPS} * {total});
  for (let i = 0; i < n; i++) {{
    await p.evaluate(t => window.setT(t), i / {FPS});
    await p.screenshot({{path: '{trabajo}/capas/f' + String(i).padStart(4, '0') + '.png', omitBackground: true}});
  }}
  await b.close();
}})();"""
    os.makedirs(f'{trabajo}/capas', exist_ok=True)
    open(f'{trabajo}/graba.js', 'w').write(js)
    np = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    subprocess.run(['node', f'{trabajo}/graba.js'], check=True, env=dict(os.environ, NODE_PATH=np))

def final(trabajo):
    salida = os.path.join(trabajo, 'VSL_gancho_16x9.mp4')
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', f'{trabajo}/base.mp4', '-framerate', str(FPS),
                    '-i', f'{trabajo}/capas/f%04d.png', '-filter_complex', '[0:v][1:v]overlay=0:0:shortest=1[v]',
                    '-map', '[v]', '-map', '0:a', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-ar', '48000', '-b:a', '192k', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    bruto, trabajo = sys.argv[1:3]
    VOZ = sys.argv[3] if len(sys.argv) > 3 else None   # voz limpia (mismo tiempo que el bruto)
    VOZ_IN = 2 if VOZ else 0
    total = tiempos(); print('duración', total)
    base(bruto, trabajo, total); capas(trabajo, total); final(trabajo)
