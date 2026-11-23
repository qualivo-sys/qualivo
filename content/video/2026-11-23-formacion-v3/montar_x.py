#!/usr/bin/env python3
"""Formación V3 · versión «espectacular» (9:16): escena-v3x.html + la misma locución y música + efectos de sonido en cada acción.
   python3 montar_x.py"""
import os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'; SP = os.environ.get('SP', '/tmp/v3'); os.makedirs(SP, exist_ok=True)
VOZ = {'v0': 0.15, 'v1x': 6.1, 'v2': 13.3, 'v3': 20.8, 'v4': 28.0, 'v5x': 35.8, 'v6x': 47.8}; DUR = 51.5
# efectos sintetizados: (segundo, tipo)
SFX = [(.35, 'aire'), (.82, 'aviso'), (2.25, 'toque'), (5.6, 'aire2'), (8.33, 'aire'), (9.05, 'toque'), (9.35, 'toque'), (9.65, 'toque'), (9.95, 'toque'),
       (12.92, 'aire'), (14.8, 'pop'), (16.5, 'pop'), (18.2, 'pop'), (19.3, 'pop'), (20.97, 'golpe'), (22.0, 'toque'), (24.3, 'toque'), (25.2, 'toque'),
       (27.95, 'aire'), (30.32, 'aire'), (32.22, 'aire'), (33.0, 'toque'), (35.45, 'aire2'), (38.0, 'pop'), (40.85, 'pop'), (42.85, 'pop'), (44.7, 'pop'), (47.4, 'aire'), (48.55, 'pop')]
GEN = {'aire': "anoisesrc=color=pink:d=0.34:r=44100:a=0.5,highpass=f=700,lowpass=f=5200,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.16",
       'aire2': "anoisesrc=color=brown:d=0.6:r=44100:a=0.8,highpass=f=180,lowpass=f=3200,afade=t=in:st=0:d=0.42,afade=t=out:st=0.42:d=0.18,volume=0.5",
       'toque': "aevalsrc='sin(2*PI*880*t)*exp(-45*t)':d=0.12:s=44100,volume=0.07",
       'pop': "aevalsrc='sin(2*PI*(420+900*t)*t)*exp(-26*t)':d=0.16:s=44100,volume=0.13",
       'golpe': "aevalsrc='sin(2*PI*(110-140*t)*t)*exp(-13*t)':d=0.4:s=44100,volume=0.5",
       'aviso': "aevalsrc='0.5*sin(2*PI*1175*t)*exp(-9*t)+0.5*sin(2*PI*1568*max(t-0.12,0))*exp(-8*max(t-0.12,0))*gte(t,0.12)':d=0.8:s=44100,volume=0.2"}
def run(*c): subprocess.run(c, check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
st = 'aformat=sample_rates=44100:channel_layouts=stereo'
ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; fin = 0; et = ['[m]']
for i, (k, t0) in enumerate(VOZ.items()):
    f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; fin = max(fin, t0 + dur(f))
    fc.append(f'[{i+1}:a]{st},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]'); et.append(f'[v{i}]')
fc.append(f"[0:a]{st},atrim=0:{DUR},volume='0.33+0.35*clip((t-{fin:.2f})/0.4,0,1)':eval=frame,afade=t=out:st={DUR-1.2}:d=1.2[m]")
for n, (t0, tipo) in enumerate(SFX):
    fc.append(f"{GEN[tipo]},{st},adelay={int(t0*1000)}|{int(t0*1000)}[x{n}]"); et.append(f'[x{n}]')
fc.append(''.join(et) + f'amix=inputs={len(et)}:normalize=0:duration=first,alimiter=limit=0.95[o]')
au = f'{SP}/audio-x.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-c:a', 'aac', '-b:a', '192k', au)
d = f'{SP}/f-x'; run('node', f'{A}/render.js', 'escena-v3x.html', d)
sal = f'{A}/formacion-v3-espectacular-916.mp4'
run('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-i', f'{d}/f%05d.jpg', '-i', au, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
subprocess.run(['rm', '-r', d]); print('ok', os.path.basename(sal), round(dur(sal), 2))
