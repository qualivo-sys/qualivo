#!/usr/bin/env python3
"""Formación · prueba audiovisual de 13 s (9:16): planos de vídeo generados (Higgsfield, Seedance 2.5) + capas gráficas + voz, música y efectos.
Los planos no se guardan en el repo; van en $PL (por defecto /tmp/v7/pl): laura.mp4, escritorio.mp4, admisiones.mp4.
   node render_capas.js /tmp/v7/capas && python3 montar.py"""
import os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'; SP = '/tmp/v7'; PL = os.environ.get('PL', f'{SP}/pl')
C = dict(a=0, b=3.0, c=5.6, d=9.4, fin=13.0)
PLANOS = [('laura', 1.5, C['b'] - C['a']), ('escritorio', 0.9, C['c'] - C['b']), (None, 0, C['d'] - C['c']), ('admisiones', 0.6, C['fin'] - C['d'])]
VOZ = {'v0': 0.15, 'v1': 3.15, 'v2': 5.8, 'v3': 9.6}
SFX = [(2.85, 'aire'), (3.7, 'zum'), (3.72, 'aviso'), (5.45, 'aire2'), (6.7, 'pop'), (6.9, 'toque'), (7.6, 'pop'), (8.05, 'toque'), (8.5, 'pop'), (9.25, 'aire'), (10.3, 'golpe'), (11.3, 'pop')]
GEN = {'aire': "anoisesrc=color=pink:d=0.34:r=44100:a=0.5,highpass=f=700,lowpass=f=5200,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.2",
       'aire2': "anoisesrc=color=brown:d=0.6:r=44100:a=0.8,highpass=f=180,lowpass=f=3200,afade=t=in:st=0:d=0.42,afade=t=out:st=0.42:d=0.18,volume=0.5",
       'toque': "aevalsrc='sin(2*PI*880*t)*exp(-45*t)':d=0.12:s=44100,volume=0.08",
       'pop': "aevalsrc='sin(2*PI*(420+900*t)*t)*exp(-26*t)':d=0.16:s=44100,volume=0.13",
       'golpe': "aevalsrc='sin(2*PI*(110-140*t)*t)*exp(-13*t)':d=0.4:s=44100,volume=0.5",
       'zum': "aevalsrc='sin(2*PI*155*t)*(0.55+0.45*sin(2*PI*27*t))*lt(mod(t,0.42),0.28)':d=0.8:s=44100,afade=t=out:st=0.7:d=0.1,volume=0.3",
       'aviso': "aevalsrc='0.5*sin(2*PI*1175*t)*exp(-9*t)+0.5*sin(2*PI*1568*max(t-0.12,0))*exp(-8*max(t-0.12,0))*gte(t,0.12)':d=0.8:s=44100,volume=0.2"}
def run(*c): subprocess.run(c, check=True)
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
# base: los planos, cortados y escalados a 1080×1920 a 25 fps
lst = []
for i, (n, ss, d) in enumerate(PLANOS):
    o = f'{SP}/b{i}.mp4'
    if n: run('ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-i', f'{PL}/{n}.mp4', '-t', f'{d:.3f}', '-an', '-vf', 'fps=25,scale=1080:1920:flags=lanczos,eq=contrast=1.05:saturation=1.08,setsar=1', '-frames:v', str(round(d * 25)), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
    else: run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x1FA396:s=1080x1920:r=25:d={d:.3f}', '-frames:v', str(round(d * 25)), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
    lst.append(f"file '{o}'")
open(f'{SP}/lista.txt', 'w').write('\n'.join(lst) + '\n')
st = 'aformat=sample_rates=44100:channel_layouts=stereo'; ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; et = ['[m]']
for i, (k, t0) in enumerate(VOZ.items()):
    f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; fc.append(f'[{i+1}:a]{st},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]'); et.append(f'[v{i}]')
fc.append(f"[0:a]{st},atrim=0:{C['fin']},volume=0.36,afade=t=out:st={C['fin']-.8}:d=0.8[m]")
for n, (t0, tipo) in enumerate(SFX): fc.append(f"{GEN[tipo]},{st},adelay={int(t0*1000)}|{int(t0*1000)}[x{n}]"); et.append(f'[x{n}]')
fc.append(''.join(et) + f'amix=inputs={len(et)}:normalize=0:duration=first,alimiter=limit=0.9[o]')
au = f'{SP}/audio.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-t', str(C['fin']), '-c:a', 'aac', '-b:a', '192k', au)
sal = f'{A}/formacion-prueba-audiovisual-916.mp4'
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{SP}/lista.txt', '-framerate', '25', '-i', f'{SP}/capas/f%05d.png', '-i', au,
    '-filter_complex', '[0:v][1:v]overlay=format=auto[v]', '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
print('ok', sal)
