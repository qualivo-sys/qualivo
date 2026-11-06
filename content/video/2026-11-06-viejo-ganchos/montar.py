#!/usr/bin/env python3
"""Anuncio viejo de formación con gancho nuevo (bucle del 6-nov).

Solo cambia la tarjeta del gancho, de 0 a 5,68 s. El resto es el vídeo original: el mismo cuerpo, la misma
voz (Javier Rojas, ElevenLabs multilingual v2) y la misma música (musica-lofi-b).

Uso:
  python3 hacer_escenas.py                                   # escenas desde ganchos.json
  ELEVENLABS_API_KEY=... python3 montar.py voz g1 g2 g3      # locución de cada gancho (clave solo en el entorno)
  python3 montar.py video g1 g2 g3                           # 9:16 y 4:5 → salida/

Notas:
- Los fotogramas del cuerpo 9:16 se renderizan una vez desde la escena original (CUERPO916).
- El cuerpo 4:5 sale del vídeo publicado (assets/video/qualivo-sistema-formacion-45.mp4).
- Ganancias medidas sobre mezcla-formacion.m4a (6-nov):
  - voz × 1,55 respecto al archivo original d0;
  - música × 0,33 bajo la voz y × 0,68 sin voz.
"""
import json, os, subprocess, sys
A = os.path.dirname(os.path.abspath(__file__)); R = os.path.abspath(f'{A}/../../..'); S = f'{A}/../2026-09-17-sistema'
SP = os.environ.get('SP', '/tmp/ganchos'); CUERPO916 = os.environ.get('CUERPO916', f'{SP}/cuerpo916_v.mp4')
CORTE, CORTE_AUDIO, FPS, VOZ_EN = 5.68, 5.60, 25, 0.15  # vídeo: la tarjeta vieja termina de irse en 5,65 s; audio: antes de que entre la voz del cuerpo (5,65 s)
G = json.load(open(f'{A}/ganchos.json'))
def run(*c): subprocess.run(c, check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))

def voz(ks):
    sys.path.insert(0, f'{R}/produccion/video-anuncios'); import voz_elevenlabs as v
    for k in ks: v.tts(G[k]['voz'], 'javier_rojas', f'{A}/voz/{k}', modelo='eleven_multilingual_v2')

def fotogramas(k, fmt):
    out = f'{SP}/gancho-{k}-{fmt}'; html = f'{A}/escena-gancho{"-45" if fmt == "45" else ""}.html'
    run('node', f'{SP}/r.js', f'{html}#{k}', out, '0', str(CORTE))
    run('ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{out}/f%05d.jpg', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', f'{out}.mp4')
    return f'{out}.mp4'

def audio(k):
    """Audio del gancho (0-5,64 s) y empalme con la mezcla original desde 5,64 s."""
    v = f'{A}/voz/{k}.mp3'; g = 1.55 * rms(f'{S}/voz-formacion/d0.mp3') / rms(v); fin_voz = VOZ_EN + dur(v)
    if fin_voz > CORTE_AUDIO - .15: sys.exit(f'{k}: la voz dura {dur(v):.2f} s y no cabe antes del corte')
    sube = f'0.33+0.35*clip((t-{fin_voz:.2f})/0.35,0,1)'
    out = f'{SP}/audio-{k}.m4a'
    fc = (f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{CORTE_AUDIO},asetpts=PTS-STARTPTS,volume='{sube}':eval=frame[m];"
          f"[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g:.3f},adelay={int(VOZ_EN*1000)}|{int(VOZ_EN*1000)},apad,atrim=0:{CORTE_AUDIO}[v];"
          f"[m][v]amix=inputs=2:normalize=0,atrim=0:{CORTE_AUDIO}[h];"
          f"[2:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=start={CORTE_AUDIO - .1},asetpts=PTS-STARTPTS[c];"
          f"[h][c]acrossfade=d=0.1:c1=tri:c2=tri[out]")
    run('ffmpeg', '-v', 'error', '-y', '-i', f'{S}/musica-lofi-b.mp3', '-i', v, '-i', f'{S}/mezcla-formacion.m4a',
        '-filter_complex', fc, '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', out)
    return out

def video(ks):
    os.makedirs(f'{A}/salida', exist_ok=True)
    cuerpo45 = f'{SP}/cuerpo45.mp4'
    if not os.path.exists(cuerpo45):
        run('ffmpeg', '-v', 'error', '-y', '-ss', str(CORTE), '-i', f'{R}/assets/video/qualivo-sistema-formacion-45.mp4', '-an',
            '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-r', str(FPS), cuerpo45)
    for k in ks:
        au = audio(k)
        for fmt, cuerpo in (('916', CUERPO916), ('45', cuerpo45)):
            gm = fotogramas(k, fmt); lst = f'{SP}/lista-{k}-{fmt}.txt'
            open(lst, 'w').write(f"file '{gm}'\nfile '{cuerpo}'\n")
            sal = f'{A}/salida/viejo-{k}-{fmt}.mp4'
            run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', au, '-map', '0:v', '-map', '1:a',
                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
            print('ok', sal, round(dur(sal), 2))

if __name__ == '__main__':
    orden, *ks = sys.argv[1:]
    {'voz': voz, 'video': video}[orden](ks or list(G))
