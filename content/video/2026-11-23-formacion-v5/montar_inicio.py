#!/usr/bin/env python3
"""Formación V5 · prueba de los primeros segundos (9:16): voz un 8 % más rápida, música del antiguo y efectos por acción."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'; SP = os.environ.get('SP', '/tmp/v5'); os.makedirs(SP, exist_ok=True)
J = json.load(open(f'{A}/tiempos.json')); T, DUR, TEMPO = J['T'], J['DUR'], J['TEMPO']
W = json.loads(open(f'{A}/t.js').read().split('window.W=')[1].split(';window.DUR')[0]); s1 = T['v1'][0] - .12; s2 = W['v1']['ya'] - .25
SFX = [(.12, 'aire'), (.55, 'aviso'), (1.0, 'toque'), (1.55, 'toque'), (2.1, 'toque'), (s1 - .4, 'aire2'), (W['v1']['campaña'] - .15, 'pop'), (W['v1']['landing'] - .15, 'pop'),
       (W['v1']['formulario'] - .15, 'pop'), (s2 - .3, 'aire'), (W['v1']['anuncio'] - .2, 'toque'), (W['v1']['curso'] - .2, 'toque'), (W['v1']['curso'] + .8, 'pop')]
GEN = {'aire': "anoisesrc=color=pink:d=0.34:r=44100:a=0.5,highpass=f=700,lowpass=f=5200,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.16",
       'aire2': "anoisesrc=color=brown:d=0.6:r=44100:a=0.8,highpass=f=180,lowpass=f=3200,afade=t=in:st=0:d=0.42,afade=t=out:st=0.42:d=0.18,volume=0.5",
       'toque': "aevalsrc='sin(2*PI*880*t)*exp(-45*t)':d=0.12:s=44100,volume=0.07",
       'pop': "aevalsrc='sin(2*PI*(420+900*t)*t)*exp(-26*t)':d=0.16:s=44100,volume=0.13",
       'aviso': "aevalsrc='0.5*sin(2*PI*1175*t)*exp(-9*t)+0.5*sin(2*PI*1568*max(t-0.12,0))*exp(-8*max(t-0.12,0))*gte(t,0.12)':d=0.8:s=44100,volume=0.2"}
def run(*c): subprocess.run(c, check=True)
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
st = 'aformat=sample_rates=44100:channel_layouts=stereo'; ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; et = ['[m]']
for i, (k, (t0, d)) in enumerate(T.items()):
    f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; fc.append(f'[{i+1}:a]{st},atempo={TEMPO},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]'); et.append(f'[v{i}]')
fc.append(f"[0:a]{st},atrim=0:{DUR},volume=0.33,afade=t=out:st={DUR-.5}:d=0.5[m]")
for n, (t0, tipo) in enumerate(SFX): fc.append(f"{GEN[tipo]},{st},adelay={int(max(0,t0)*1000)}|{int(max(0,t0)*1000)}[x{n}]"); et.append(f'[x{n}]')
fc.append(''.join(et) + f'amix=inputs={len(et)}:normalize=0:duration=first,alimiter=limit=0.9[o]')
au = f'{SP}/audio.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-t', str(DUR), '-c:a', 'aac', '-b:a', '192k', au)
d = f'{SP}/f'; run('node', f'{A}/render.js', 'escena-v5-inicio.html', d); sal = f'{A}/formacion-v5-inicio-916.mp4'
run('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-i', f'{d}/f%05d.jpg', '-i', au, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
subprocess.run(['rm', '-r', d]); print('ok', sal)
