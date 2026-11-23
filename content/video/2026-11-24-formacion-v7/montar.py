#!/usr/bin/env python3
"""Formación V7 · borrador interno (9:16): planos de vídeo generados + capa gráfica + voz, música y efectos.
Los planos no se guardan en el repo; van en $PL (por defecto /tmp/v7/pl). Si un plano es más corto que su hueco, se ralentiza.
   python3 hacer_capas.py && node render_capas.js /tmp/v7b/capas && python3 montar.py"""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'; SP = '/tmp/v7b'; PL = os.environ.get('PL', '/tmp/v7/pl'); os.makedirs(SP, exist_ok=True)
J = json.load(open(f'{A}/tiempos.json')); T, DUR, TEMPO, P = J['T'], J['DUR'], J['TEMPO'], J['P']
W = json.loads(open(f'{A}/t.js').read().split('window.W=')[1].split(';window.DUR')[0]); C = {p[1]: p[0] for p in P}
FONDO = {'anuncio': '0x1FA396', 'crm': '0x1FA396', 'origen': '0x1FA396', 'wa': '0x1FA396', 'pipe': '0x1FA396', 'agente': '0x0A0A0B', 'cal': '0x0A0A0B', 'meta': '0x0A0A0B', 'fin': '0x0A0A0B'}
def run(*c): subprocess.run(c, check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
lst = []
for i, (t0, tipo, plano, ss) in enumerate(P):
    d = (P[i + 1][0] if i + 1 < len(P) else DUR) - t0; n = round(d * 25); o = f'{SP}/b{i:02d}.mp4'
    if plano:
        f = f'{PL}/{plano}.mp4'; disp = dur(f) - ss - .1; k = max(1.0, d / disp)      # k > 1: cámara lenta para llenar el hueco
        run('ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-i', f, '-an', '-vf', f'setpts={k:.4f}*PTS,fps=25,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,eq=contrast=1.05:saturation=1.08,setsar=1',
            '-frames:v', str(n), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
    else: run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c={FONDO[tipo]}:s=1080x1920:r=25:d={d + .2:.3f}', '-frames:v', str(n), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
    lst.append(f"file '{o}'")
open(f'{SP}/lista.txt', 'w').write('\n'.join(lst) + '\n')
SFX = [(c - .15, 'aire') for c in list(C.values())[1:]] + [(C['crm'] - .55, 'toque'), (C['crm'] + .4, 'golpe'), (C['crm'] + .45, 'aviso'), (C['origen'] + .25, 'pop'), (C['origen'] + .4, 'pop'), (C['origen'] + .55, 'pop'),
       (C['origen'] + 1.8, 'pop'), (W['v2']['anuncio'] - .25, 'toque'), (W['v2']['sistema'] - .1, 'pop'), (W['v2']['whatsapp'] + .45, 'pop'), (W['v2']['actualiza'] - .1, 'aviso'),
       (W['v3']['responder'] - .1, 'golpe'), (W['v3']['agente'] - .3, 'aviso'), (C['llamada'] - .2, 'tono'), (C['llamada'] + .25, 'pop'), (C['llamada'] + 1.9, 'pop'), (C['agente'] + .3, 'pop'), (C['agente'] + 1.5, 'toque'),
       (W['v4']['reunión'] - .2, 'golpe'), (W['v4']['confirmación'] - .1, 'pop'), (W['v4']['recordatorios'] - .1, 'pop'), (C['adm'] + .9, 'pop'), (W['v5']['celebra'], 'aviso'),
       (C['meta'] + .15, 'pop'), (C['meta'] + 1.0, 'pop'), (C['meta'] + 1.9, 'pop'), (C['meta'] + 2.6, 'aviso'), (W['v6']['captación'] - .1, 'pop'), (W['v6']['seguimiento'] - .1, 'pop'), (W['v6']['mejora'] - .1, 'pop'), (W['v6']['solicita'] + .5, 'pop')]
GEN = {'aire': "anoisesrc=color=pink:d=0.34:r=44100:a=0.5,highpass=f=700,lowpass=f=5200,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.17",
       'toque': "aevalsrc='sin(2*PI*880*t)*exp(-45*t)':d=0.12:s=44100,volume=0.08",
       'pop': "aevalsrc='sin(2*PI*(420+900*t)*t)*exp(-26*t)':d=0.16:s=44100,volume=0.12",
       'golpe': "aevalsrc='sin(2*PI*(110-140*t)*t)*exp(-13*t)':d=0.4:s=44100,volume=0.45",
       'tono': "aevalsrc='0.5*(sin(2*PI*425*t))*lt(t,0.7)':d=0.75:s=44100,afade=t=in:st=0:d=0.03,afade=t=out:st=0.65:d=0.05,volume=0.12",
       'zum_': "aevalsrc='sin(2*PI*155*t)*(0.55+0.45*sin(2*PI*27*t))*lt(mod(t,0.42),0.28)':d=0.8:s=44100,afade=t=out:st=0.7:d=0.1,volume=0.3",
       'aviso': "aevalsrc='0.5*sin(2*PI*1175*t)*exp(-9*t)+0.5*sin(2*PI*1568*max(t-0.12,0))*exp(-8*max(t-0.12,0))*gte(t,0.12)':d=0.8:s=44100,volume=0.17"}
st = 'aformat=sample_rates=44100:channel_layouts=stereo'; ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; et = ['[m]']
V = [k for k in T if k != 'r']; fin = max(T[k][0] + T[k][1] for k in V); r0 = T['r'][0]; r1 = r0 + T['r'][1]
for i, k in enumerate(V):
    f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; t0 = T[k][0]; fc.append(f'[{i+1}:a]{st},atempo={TEMPO},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]'); et.append(f'[v{i}]')
fc.append(f"[0:a]{st},apad,atrim=0:{DUR},volume='0.34-0.2*clip((t-{r0-.4:.2f})/0.5,0,1)+0.2*clip((t-{r1-.3:.2f})/0.5,0,1)+0.34*clip((t-{fin:.2f})/0.4,0,1)':eval=frame,afade=t=out:st={DUR-1.2:.2f}:d=1.2[m]")
for n, (t0, tipo) in enumerate(SFX): fc.append(f"{GEN[tipo]},{st},adelay={int(max(0,t0)*1000)}|{int(max(0,t0)*1000)}[x{n}]"); et.append(f'[x{n}]')
fc.append(''.join(et) + f'amix=inputs={len(et)}:normalize=0:duration=first,alimiter=limit=0.9[o]')
au = f'{SP}/audio.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-t', str(DUR), '-c:a', 'aac', '-b:a', '192k', au)
sal = f'{A}/formacion-v7-borrador-916.mp4'
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{SP}/lista.txt', '-framerate', '25', '-i', f'{SP}/capas/f%05d.png', '-i', au,
    '-filter_complex', '[0:v][1:v]overlay=format=auto[v]', '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
print('ok', os.path.basename(sal), round(dur(sal), 2))
