#!/usr/bin/env python3
"""VSL Qualivo · V2 del primer minuto (brief de Maikel, 9-oct), 16:9.

   python3 vsl_v2.py <bruto.mov> <carpeta_trabajo> <voz_limpia.mp3> <broll_panel.mp4> <broll_scroll.mp4>

Sobre V1: zoom digital suave en el gancho y en la presentación, dos planos de apoyo de Higgsfield (Kling) y una
capa nueva (capas_v2.html): métricas que se reducen ante la pregunta, flujo de contactos, anuncio genérico frente a
anuncio para el cliente ideal, y comparación neutra 5 €/20 € que acaba en pregunta.
El bruto y la voz no van al repo (es público).
"""
import json, os, subprocess, sys
import imageio_ffmpeg
import vsl_gancho as g

AQUI = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()
FPS = 30

# Mismos cortes que V1; el gancho va en un solo plano con zoom, y la presentación con un zoom más leve.
g.PLANOS = [(1.05, 7.95, 'zoom'),
            (8.36, 10.16, 'partido'), (13.80, 16.88, 'partido'), (17.17, 20.00, 'partido'),
            (20.00, 21.20, 'cerrado'), (21.72, 25.16, 'abierto'), (25.45, 29.55, 'abierto'),
            (30.50, 36.95, 'zoom2'),
            (37.05, 41.95, 'abierto'), (42.35, 48.30, 'cerrado'),
            (48.75, 52.62, 'partido'), (52.86, 54.60, 'partido'), (55.05, 61.30, 'partido'),
            (61.62, 67.45, 'cerrado')]
T = g.nuevo

def zoom(d, z0, z1, cx, fy):
    """Zoom lento de z0 a z1 sobre el 4K (3840x2160); cx = centro horizontal, fy = altura de la cara (0-1 del encuadre)."""
    n = max(1, round(d * FPS))
    return (f"scale=3840:2160,zoompan=z='{z0}+({z1}-{z0})*on/{n}':"
            f"x='max(0,min(iw-iw/zoom,{cx}-iw/zoom/2))':y='max(0,min(ih-ih/zoom,570-ih/zoom*{fy}))':"
            f"d=1:s=1920x1080:fps={FPS}")

def tiempos():
    total = g.tiempos()                       # subtítulos de V1 (texto del guion)
    subs = json.loads(open(os.path.join(AQUI, 'tiempos-gancho.js')).read()[len('window.TL='):-2])['subs']
    TL = {'subs': subs,
          'k1': [T(2.40), T(4.60)],
          'met': [T(8.36), T(20.00)], 'cards': [T(8.50), T(13.95), T(15.70)], 'preg': T(17.20),
          'flujo': [T(23.40), T(29.55)], 'k3': [T(25.60), T(29.55)],
          'nombre': [T(30.70), T(34.80)],
          'ads': [T(39.40), T(48.30)], 'adA': T(39.60), 'adB': T(44.00), 'msg': T(45.20), 'paso': T(47.60),
          'comp': [T(48.75), T(61.30)], 'ca': T(51.80), 'cb': T(57.40),
          'final': [T(61.62), total]}
    open(os.path.join(AQUI, 'tiempos-v2.js'), 'w').write('window.TL=' + json.dumps(TL, ensure_ascii=False) + ';\n')
    # planos de apoyo: (archivo, desde, hasta) en el montaje
    return total, [(T(4.30), T(7.95)), (T(21.72), T(23.40))]

def base(bruto, trabajo, total, voz):
    fil, vs, as_ = [], [], []
    for i, (a, b, enc) in enumerate(g.PLANOS):
        d = b - a
        if enc == 'zoom': v = zoom(d, 1.15, 1.42, 2240, .30)
        elif enc == 'zoom2': v = zoom(d, 1.62, 1.78, 2280, .36)
        elif enc == 'partido':
            w, h, x, y = g.PARTIDO; v = f'crop={w}:{h}:{x}:{y},scale=960:1080,pad=1920:1080:0:0:#0A0F1A'
        else:
            w, h, x, y = g.ABIERTO if enc == 'abierto' else g.CERRADO; v = f'crop={w}:{h}:{x}:{y},scale=1920:1080'
        fil.append(f'[0:v]trim={a}:{b},setpts=PTS-STARTPTS,{v},fps={FPS},setsar=1[v{i}];')
        fil.append(f'[2:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={d - 0.03:.3f}:d=0.03[a{i}];')
        vs.append(f'[v{i}]'); as_.append(f'[a{i}]')
    n = len(g.PLANOS)
    fil.append(''.join(f'{vs[i]}{as_[i]}' for i in range(n)) + f'concat=n={n}:v=1:a=1[vb][ab];')
    fil.append('[ab]acompressor=threshold=0.1:ratio=2.5:attack=10:release=200,'
               'aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[voz][vsc];')
    fil.append(f'[1:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{total},asetpts=PTS-STARTPTS,'
               f'afade=t=in:d=0.6,afade=t=out:st={total - 1.2}:d=1.2,volume=0.22[m];'
               '[m][vsc]sidechaincompress=threshold=0.03:ratio=5:attack=30:release=600[md];'
               '[voz][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=8,aresample=48000[a]')
    salida = os.path.join(trabajo, 'base_v2.mp4')
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', bruto, '-i', g.MUSICA, '-i', voz, '-filter_complex', ''.join(fil),
                    '-map', '[vb]', '-map', '[a]', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
                    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', salida], check=True)

def capas(trabajo, total):
    js = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch({{executablePath:'/opt/pw-browsers/chromium'}});
  const p = await b.newPage({{viewport:{{width:1920,height:1080}}}});
  await p.goto('file://{AQUI}/capas_v2.html', {{waitUntil:'networkidle'}}); await p.waitForTimeout(600);
  const n = Math.round({FPS} * {total});
  for (let i = 0; i < n; i++) {{
    await p.evaluate(t => window.setT(t), i / {FPS});
    await p.screenshot({{path: '{trabajo}/capas2/f' + String(i).padStart(4, '0') + '.png', omitBackground: true}});
  }}
  await b.close();
}})();"""
    os.makedirs(f'{trabajo}/capas2', exist_ok=True)
    open(f'{trabajo}/graba2.js', 'w').write(js)
    np = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    subprocess.run(['node', f'{trabajo}/graba2.js'], check=True, env=dict(os.environ, NODE_PATH=np))

def final(trabajo, apoyos, clips):
    ent, fil, ult = ['-i', f'{trabajo}/base_v2.mp4'], [], '0:v'
    for j, ((a, b), c) in enumerate(zip(apoyos, clips)):
        ent += ['-i', c]
        fil.append(f'[{j + 1}:v]trim=0:{b - a:.2f},setpts=PTS-STARTPTS+{a}/TB,scale=1920:1080:force_original_aspect_ratio=increase,'
                   f'crop=1920:1080,fps={FPS},format=yuv420p[b{j}];'
                   f"[{ult}][b{j}]overlay=0:0:eof_action=pass:enable='between(t,{a},{b})'[o{j}];")
        ult = f'o{j}'
    k = len(clips) + 1
    ent += ['-framerate', str(FPS), '-i', f'{trabajo}/capas2/f%04d.png']
    fil.append(f'[{ult}][{k}:v]overlay=0:0:shortest=1[v]')
    salida = os.path.join(trabajo, 'VSL_Qualivo_60s_V2.mp4')
    subprocess.run([FF, '-y', '-loglevel', 'error', *ent, '-filter_complex', ''.join(fil), '-map', '[v]', '-map', '0:a',
                    '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    bruto, trabajo, voz, c1, c2 = sys.argv[1:6]
    total, apoyos = tiempos(); print('duración', total, 'apoyos', apoyos)
    if os.environ.get('SOLO') != 'capas': base(bruto, trabajo, total, voz)
    capas(trabajo, total); final(trabajo, apoyos, [c1, c2])
