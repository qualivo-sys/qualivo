#!/usr/bin/env python3
"""Formación V6 · borrador interno (9:16). Voz de Javier Rojas un 12 % más rápida. La llamada del agente de voz no lleva audio todavía:
la música baja y se leen los subtítulos, con el aviso de audio pendiente.   python3 hacer_escena.py && python3 montar.py"""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'; SP = os.environ.get('SP', '/tmp/v6'); os.makedirs(SP, exist_ok=True)
J = json.load(open(f'{A}/tiempos.json')); T, DUR, TEMPO = J['T'], J['DUR'], J['TEMPO']
W = json.loads(open(f'{A}/t.js').read().split('window.W=')[1].split(';window.DUR')[0]); E = {k: T[k][0] - .1 for k in T}; r0 = T['r'][0]
SFX = [(.45, 'pop'), (1.15, 'pop'), (1.85, 'pop'), (2.55, 'pop'), (W['v0']['oportunidad'], 'aviso'), (E['v1'], 'aire'), (W['v1']['solicitudes'] - .55, 'aire'), (W['v1']['solicitudes'] - .1, 'pop'),
       (W['v1']['interesadas'] - .1, 'pop'), (E['v2'], 'aire'), (W['v2']['anuncio'] - .2, 'pop'), (W['v2']['whatsapp'] - .2, 'pop'), (W['v2']['preguntas'] + .1, 'pop'), (W['v2']['cualifica'], 'aviso'),
       (W['v2']['actualiza'], 'toque'), (E['v3'] + .15, 'pop'), (W['v3']['responder'] - .1, 'golpe'), (W['v3']['agente'] - .1, 'aviso'), (r0 - .5, 'tono'), (r0 + .25, 'pop'), (r0 + 2.5, 'pop'),
       (r0 + 4.3, 'pop'), (r0 + 5.6, 'toque'), (E['v4'] + .15, 'pop'), (W['v4']['reunión'] - .1, 'golpe'), (W['v4']['confirmación'], 'pop'), (W['v4']['admisiones'], 'pop'), (E['v5'], 'aire'),
       (W['v5']['valida'], 'toque'), (W['v5']['resultado'] - .1, 'aire'), (W['v5']['resultado'] + .8, 'aviso'), (E['v6'] - .3, 'aire2'), (W['v6']['captación'] - .1, 'pop'),
       (W['v6']['seguimiento'] - .1, 'pop'), (W['v6']['mejora'] - .1, 'pop'), (W['v6']['solicita'] - .35, 'aire'), (W['v6']['solicita'] + .5, 'pop')]
GEN = {'aire': "anoisesrc=color=pink:d=0.34:r=44100:a=0.5,highpass=f=700,lowpass=f=5200,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.14",
       'aire2': "anoisesrc=color=brown:d=0.6:r=44100:a=0.8,highpass=f=180,lowpass=f=3200,afade=t=in:st=0:d=0.42,afade=t=out:st=0.42:d=0.18,volume=0.45",
       'toque': "aevalsrc='sin(2*PI*880*t)*exp(-45*t)':d=0.12:s=44100,volume=0.07",
       'pop': "aevalsrc='sin(2*PI*(420+900*t)*t)*exp(-26*t)':d=0.16:s=44100,volume=0.11",
       'golpe': "aevalsrc='sin(2*PI*(110-140*t)*t)*exp(-13*t)':d=0.4:s=44100,volume=0.45",
       'tono': "aevalsrc='0.5*(sin(2*PI*425*t))*lt(t,0.7)':d=0.75:s=44100,afade=t=in:st=0:d=0.03,afade=t=out:st=0.65:d=0.05,volume=0.12",
       'aviso': "aevalsrc='0.5*sin(2*PI*1175*t)*exp(-9*t)+0.5*sin(2*PI*1568*max(t-0.12,0))*exp(-8*max(t-0.12,0))*gte(t,0.12)':d=0.8:s=44100,volume=0.17"}
def run(*c): subprocess.run(c, check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))
st = 'aformat=sample_rates=44100:channel_layouts=stereo'; ref = 1.55 * rms(f'{S}/voz-formacion/d0.mp3'); ent = ['-i', f'{S}/musica-lofi-b.mp3']; fc = []; et = ['[m]']
V = [k for k in T if k != 'r']; fin = max(T[k][0] + T[k][1] for k in V); r1 = r0 + T['r'][1]
for i, k in enumerate(V):
    f = f'{A}/voz/{k}.mp3'; ent += ['-i', f]; t0 = T[k][0]
    fc.append(f'[{i+1}:a]{st},atempo={TEMPO},volume={ref / rms(f):.3f},adelay={int(t0*1000)}|{int(t0*1000)}[v{i}]'); et.append(f'[v{i}]')
fc.append(f"[0:a]{st},atrim=0:{DUR},volume='0.33-0.2*clip((t-{r0-.4:.2f})/0.5,0,1)+0.2*clip((t-{r1-.3:.2f})/0.5,0,1)+0.35*clip((t-{fin:.2f})/0.4,0,1)':eval=frame,afade=t=out:st={DUR-1.2:.2f}:d=1.2[m]")
for n, (t0, tipo) in enumerate(SFX): fc.append(f"{GEN[tipo]},{st},adelay={int(max(0,t0)*1000)}|{int(max(0,t0)*1000)}[x{n}]"); et.append(f'[x{n}]')
fc.append(''.join(et) + f'amix=inputs={len(et)}:normalize=0:duration=first,apad,alimiter=limit=0.9[o]')
au = f'{SP}/audio.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-t', str(DUR), '-c:a', 'aac', '-b:a', '192k', au)
d = f'{SP}/f'; run('node', f'{A}/render.js', 'escena-v6.html', d); sal = f'{A}/formacion-v6-borrador-916.mp4'
run('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-i', f'{d}/f%05d.jpg', '-i', au, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
subprocess.run(['rm', '-r', d]); print('ok', os.path.basename(sal), round(dur(sal), 2))
