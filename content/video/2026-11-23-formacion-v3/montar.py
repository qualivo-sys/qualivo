#!/usr/bin/env python3
"""Formación V3 · prueba de montaje. Dos versiones, cada una en 9:16 y 4:5:
  A · apertura nueva (el CRM en movimiento desde el primer fotograma), 45 s
  B · apertura original del anuncio antiguo (0-5,68 s, sin tocar) + el mismo cuerpo
Voz: Javier Rojas (la del antiguo). Música: la del antiguo.   python3 montar.py"""
import os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); R = os.path.abspath(f'{A}/../../..'); S = f'{A}/../2026-09-17-sistema'
SP = os.environ.get('SP', '/tmp/v3'); os.makedirs(SP, exist_ok=True)
VOZ = {'v0': 0.15, 'v1': 6.1, 'v2': 12.4, 'v3': 19.9, 'v4': 27.1, 'v5': 34.9}; DUR = 45.0; CORTE, CORTE_AUDIO, CUERPO = 5.68, 5.60, 6.0
def run(*c): subprocess.run(c, check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
st = 'aformat=sample_rates=44100:channel_layouts=stereo'
def audio_a():
    ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; fin = 0
    for i, (k, t0) in enumerate(VOZ.items()):
        f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; fin = max(fin, t0 + dur(f))
        if i + 1 < len(VOZ) and t0 + dur(f) > list(VOZ.values())[i + 1] - .1: raise SystemExit(f'{k} pisa a la siguiente')
        fc.append(f'[{i+1}:a]{st},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]')
    fc.append(f"[0:a]{st},atrim=0:{DUR},volume='0.33+0.35*clip((t-{fin:.2f})/0.4,0,1)':eval=frame,afade=t=out:st={DUR-1.2}:d=1.2[m]")
    fc.append('[m]' + ''.join(f'[v{i}]' for i in range(len(VOZ))) + f'amix=inputs={len(VOZ)+1}:normalize=0:duration=first[o]')
    out = f'{SP}/audio-a.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-c:a', 'aac', '-b:a', '192k', out); return out
def audio_b(a):
    out = f'{SP}/audio-b.m4a'   # apertura original (mezcla del antiguo) + cuerpo de la versión A
    fc = (f'[0:a]{st},atrim=0:{CORTE_AUDIO},asetpts=PTS-STARTPTS[h];[1:a]{st},atrim=start={CUERPO - (CORTE - CORTE_AUDIO) - .1:.3f},asetpts=PTS-STARTPTS[c];'
          '[h][c]acrossfade=d=0.1:c1=tri:c2=tri[o]')
    run('ffmpeg', '-v', 'error', '-y', '-i', f'{S}/mezcla-formacion.m4a', '-i', a, '-filter_complex', fc, '-map', '[o]', '-c:a', 'aac', '-b:a', '192k', out); return out
aa = audio_a(); ab = audio_b(aa)
for fmt, esc, orig in (('916', 'escena-v3.html', 'v'), ('45', 'escena-v3-45.html', '45')):
    for ap, au in (('a', aa), ('b', ab)):
        d = f'{SP}/f-{ap}-{fmt}'; run('node', f'{A}/render.js', f'{esc}?ap={ap}', d)
        v = f'{SP}/v-{ap}-{fmt}.mp4'; run('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-i', f'{d}/f%05d.jpg', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', v)
        subprocess.run(['rm', '-r', d])
        if ap == 'b':
            cab = f'{SP}/cab-{fmt}.mp4'; run('ffmpeg', '-v', 'error', '-y', '-i', f'{R}/assets/video/qualivo-sistema-formacion-{orig}.mp4', '-an', '-frames:v', str(round(CORTE * 25)),
                                            '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-r', '25', cab)
            lst = f'{SP}/l-{fmt}.txt'; open(lst, 'w').write(f"file '{cab}'\nfile '{v}'\n"); ent = ['-f', 'concat', '-safe', '0', '-i', lst]
        else: ent = ['-i', v]
        sal = f'{A}/formacion-v3-prueba-{ap.upper()}-{fmt}.mp4'
        run('ffmpeg', '-v', 'error', '-y', *ent, '-i', au, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
        print('ok', os.path.basename(sal), round(dur(sal), 2))
