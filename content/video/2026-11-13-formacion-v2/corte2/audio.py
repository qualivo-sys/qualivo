#!/usr/bin/env python3
"""Formación V2 · corte 2 (prueba visual). Pista de audio y subtítulos.
   python3 audio.py larga h1 | larga h2 | corta h2 | corta h1   → audio-<ver>-<ap>.m4a y subs-<ver>-<ap>.js
Voz: Javier Rojas (../voz-prueba/). Raquel: audio del anuncio original."""
import json, os, subprocess, sys
A = os.path.dirname(os.path.abspath(__file__)); V = f'{A}/../voz-prueba'; S = f'{A}/../../2026-09-17-sistema'
VER = sys.argv[1] if len(sys.argv) > 1 else 'larga'; AP = sys.argv[2] if len(sys.argv) > 2 else 'h1'
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
# (clave del plan, archivo de voz, pausa detrás)
if VER == 'larga':
    orden = [('a', AP, .40), ('e2', 'e2c', .35), ('e3', 'e3c', .30), ('rq', 'RAQUEL', .35), ('e4', 'e4c', .40), ('e5', 'e5d', .45), ('e6', 'e6c', 1.6)]; RQ = 4.3
else:
    orden = [('a', AP, .30), ('e2', 'k2', .30), ('e3', 'k3', .25), ('rq', 'RAQUEL', .30), ('e4', 'k4', .35), ('e5', 'k5', .40), ('e6', 'k6', 1.9)]; RQ = 3.3
t = .15; T = {}; entradas = []; filtros = []; i = 0; subs = []
def trocea(k, f):
    pal = json.load(open(f'{V}/{f}.json')); trozo = []
    for n, p in enumerate(pal):
        trozo.append(p); txt = ' '.join(x['w'] for x in trozo).replace('cualivo', 'Qualivo').replace('Cuálivo', 'Qualivo')
        if p['w'][-1] in '.?!' or n == len(pal) - 1 or (len(txt) > 20 and p['w'][-1] in ',:') or len(txt) > 27:
            subs.append({'s': round(T[k] + trozo[0]['s'], 2), 'e': round(T[k] + p['e'] + .12, 2), 'x': txt}); trozo = []
for k, f, pausa in orden:
    T[k] = round(t, 2)
    if f == 'RAQUEL':
        entradas += ['-t', str(RQ), '-i', f'{S}/voz-formacion/dr.mp3']
        filtros.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=out:st={RQ-.5}:d=0.5,volume=0.9,adelay={int(t*1000)}|{int(t*1000)}[a{i}]')
        subs.append({'s': t + .1, 'e': t + RQ, 'x': '«Hola, Laura, soy Raquel, de Escuela Norte.»', 'q': 'Raquel'}); t += RQ
    else:
        entradas += ['-i', f'{V}/{f}.mp3']
        filtros.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={int(t*1000)}|{int(t*1000)}[a{i}]')
        if k != 'a': trocea(k, f)   # el gancho va en grande, sin subtítulo
        t += dur(f'{V}/{f}.mp3')
    t += pausa; i += 1
FIN = round(t, 2); T['FIN'] = FIN
voces = ''.join(f'[a{j}]' for j in range(i))
entradas += ['-stream_loop', '2', '-i', f'{S}/musica-pulso.mp3']
fc = ';'.join(filtros) + f';{voces}amix=inputs={i}:normalize=0,apad,atrim=0:{FIN},asplit=2[v][sc];' \
     f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{FIN},lowpass=f=2200,volume=0.10,afade=t=in:st={max(0,T["e2"]-.6)}:d=1.2,afade=t=out:st={FIN-2.0}:d=2.0[m];' \
     f'[m][sc]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=600[md];[v][md]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + entradas + ['-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', f'{A}/audio-{VER}-{AP}.m4a'], check=True)
open(f'{A}/subs-{VER}-{AP}.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(VER, AP, T, len(subs), 'subtítulos')
