#!/usr/bin/env python3
"""Demo corta: tramos del anuncio original (sin su marca superior, su reloj ni sus rótulos, bajados 250 px y con un acercamiento lento)
+ fondos de color para las escenas del V7 + capa gráfica con subtítulos + voz, música y efectos. Saca 9:16 y 4:5.
   python3 hacer.py && node render_capas.js /tmp/ad03/capas && python3 montar.py"""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'; SP = '/tmp/ad03'; os.makedirs(SP, exist_ok=True)
ORI = f'{A}/../../../assets/video/qualivo-sistema-formacion-v.mp4'; TEAL = '0x1E9C90'
J = json.load(open(f'{A}/tiempos.json')); T, DUR, TEMPO, P, X = J['T'], J['DUR'], J['TEMPO'], J['P'], J['X']; C = {p[1]: p[0] for p in P}
FONDO = {'pipe': '0x1FA396', 'cal': '0x0A0A0B', 'conf': '0x1FA396', 'meta': '0x0A0A0B', 'fin': '0x0A0A0B'}
def run(*c): subprocess.run(c, check=True)
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
lst = []
for i, (t0, tipo, ss) in enumerate(P):
    d = (P[i + 1][0] if i + 1 < len(P) else DUR) - t0; n = round(d * 25); o = f'{SP}/b{i:02d}.mp4'
    if ss is not None:
        vf = (f"fps=25,drawbox=x=0:y=0:w=1080:h=200:color={TEAL}:t=fill,drawbox=x=0:y=1600:w=1080:h=320:color={TEAL}:t=fill,crop=1080:1670:0:0,pad=1080:1920:0:250:color={TEAL},"
              f"scale=2160:3840:flags=lanczos,zoompan=z='1+0.06*on/{n}':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*0.45':d=1:s=1080x1920:fps=25,setsar=1")
        run('ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-i', ORI, '-an', '-vf', vf, '-frames:v', str(n), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
    else: run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c={FONDO[tipo]}:s=1080x1920:r=25:d={d + .2:.3f}', '-frames:v', str(n), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
    lst.append(f"file '{o}'")
open(f'{SP}/lista.txt', 'w').write('\n'.join(lst) + '\n')
SFX = [(c - .15, 'aire') for k, c in C.items() if k != 'o_ficha'] + [(.35, 'golpe'), (.45, 'aviso'), (C['o_crm'] + .5, 'pop'), (C['o_wa'] + .9, 'pop'), (X['c2']['activa'] - .1, 'aviso'), (C['o_seg'] + .6, 'pop'), (C['o_seg'] + 1.5, 'pop'),
       (X['c4']['reuniones'], 'golpe'), (X['c4']['confirmaciones'] - .1, 'pop'), (X['c4']['recordatorios'] + .1, 'pop'), (C['meta'] + .1, 'pop'), (C['meta'] + .5, 'pop'), (C['meta'] + .9, 'pop'), (C['meta'] + 2.1, 'aviso'),
       (X['c6']['captación'] - .1, 'pop'), (X['c6']['seguimiento'] - .1, 'pop'), (X['c6']['mejora'] - .1, 'pop'), (X['c7']['solicita'] + .5, 'pop')]
GEN = {'aire': "anoisesrc=color=pink:d=0.34:r=44100:a=0.5,highpass=f=700,lowpass=f=5200,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.17",
       'pop': "aevalsrc='sin(2*PI*(420+900*t)*t)*exp(-26*t)':d=0.16:s=44100,volume=0.12",
       'golpe': "aevalsrc='sin(2*PI*(110-140*t)*t)*exp(-13*t)':d=0.4:s=44100,volume=0.45",
       'aviso': "aevalsrc='0.5*sin(2*PI*1175*t)*exp(-9*t)+0.5*sin(2*PI*1568*max(t-0.12,0))*exp(-8*max(t-0.12,0))*gte(t,0.12)':d=0.8:s=44100,volume=0.17"}
st = 'aformat=sample_rates=44100:channel_layouts=stereo'; ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; et = ['[m]']
fin = max(T[k][0] + T[k][1] for k in T)
for i, k in enumerate(T):
    f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; t0 = T[k][0]
    fc.append(f'[{i+1}:a]{st},atempo={TEMPO},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]'); et.append(f'[v{i}]')
fc.append(f"[0:a]{st},atrim=0:{DUR},volume='0.34+0.34*clip((t-{fin:.2f})/0.4,0,1)':eval=frame,afade=t=out:st={DUR-1.2:.2f}:d=1.2[m]")
for n, (t0, tipo) in enumerate(SFX): fc.append(f"{GEN[tipo]},{st},adelay={int(max(0,t0)*1000)}|{int(max(0,t0)*1000)}[x{n}]"); et.append(f'[x{n}]')
fc.append(''.join(et) + f'amix=inputs={len(et)}:normalize=0:duration=first,alimiter=limit=0.9[o]')
au = f'{SP}/audio.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-t', str(DUR), '-c:a', 'aac', '-b:a', '192k', au)
F = {'916': '[0:v][1:v]overlay=format=auto[v]',
     '45': '[0:v]crop=1080:1350:0:285[b];[1:v]format=rgba,scale=950:-1:flags=lanczos,crop=950:1350:0:216,pad=1080:1350:65:0:color=black@0,fillborders=left=65:right=65:mode=smear[c];[b][c]overlay=0:0:format=auto[v]'}
for f, g in F.items():
    sal = f'{A}/formacion-demo-corta-{f}.mp4'
    run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{SP}/lista.txt', '-framerate', '25', '-i', f'{SP}/capas/f%05d.png', '-i', au,
        '-filter_complex', g, '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal); print('ok', os.path.basename(sal))
