#!/usr/bin/env python3
"""Formación V2 · corte 1 (prueba visual). Monta la pista de audio y genera subs.js con los subtítulos.
   python3 audio.py [h1|h2]      → audio-<apertura>.m4a y subs-<apertura>.js
Voz: Javier Rojas (voz-prueba/). Raquel: audio del anuncio original (voz-formacion/dr.mp3)."""
import json, os, subprocess, sys
A = os.path.dirname(os.path.abspath(__file__)); V = f'{A}/../voz-prueba'; S = f'{A}/../../2026-09-17-sistema'
AP = sys.argv[1] if len(sys.argv) > 1 else 'h1'
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
# bloques de voz, con la pausa que va detrás de cada uno
orden = [(AP, .45), ('e2c', .35), ('e3c', .30), ('RAQUEL', .35), ('e4c', .40), ('e5d', .45), ('e6c', 1.6)]
RQ = 4.3
t = .15; T = {}; entradas = []; filtros = []; i = 0
for k, pausa in orden:
    T[k] = round(t, 2)
    if k == 'RAQUEL':
        entradas += ['-t', str(RQ), '-i', f'{S}/voz-formacion/dr.mp3']
        filtros.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=out:st={RQ-.5}:d=0.5,volume=0.9,adelay={int(t*1000)}|{int(t*1000)}[a{i}]'); t += RQ
    else:
        entradas += ['-i', f'{V}/{k}.mp3']
        filtros.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={int(t*1000)}|{int(t*1000)}[a{i}]'); t += dur(f'{V}/{k}.mp3')
    t += pausa; i += 1
FIN = round(t, 2); T['FIN'] = FIN
voces = ''.join(f'[a{j}]' for j in range(i))
# base musical mínima (musica-pulso), muy baja y con sidechain; entra tras la apertura
entradas += ['-stream_loop', '2', '-i', f'{S}/musica-pulso.mp3']
fc = ';'.join(filtros) + f';{voces}amix=inputs={i}:normalize=0,apad,atrim=0:{FIN},asplit=2[v][sc];' \
     f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{FIN},lowpass=f=2200,volume=0.10,afade=t=in:st={T["e2c"]-.6}:d=1.2,afade=t=out:st={FIN-2.2}:d=2.2[m];' \
     f'[m][sc]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=600[md];[v][md]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + entradas + ['-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', f'{A}/audio-{AP}.m4a'], check=True)
# subtítulos: trozos de ~30 caracteres con sus tiempos
subs = []
for k, _ in orden:
    if k == 'RAQUEL':
        subs.append({'s': T[k] + .1, 'e': T[k] + RQ, 'x': '«Hola, Laura, soy Raquel, de Escuela Norte.»', 'q': 'Raquel'}); continue
    pal = json.load(open(f'{V}/{k}.json')); trozo = []
    for n, p in enumerate(pal):
        trozo.append(p); txt = ' '.join(x['w'] for x in trozo).replace('cualivo', 'Qualivo').replace('Cuálivo', 'Qualivo')
        fin_frase = p['w'][-1] in '.?!'; ult = n == len(pal) - 1
        if fin_frase or ult or len(txt) > 30 and p['w'][-1] == ',' or len(txt) > 38:
            subs.append({'s': round(T[k] + trozo[0]['s'], 2), 'e': round(T[k] + p['e'] + .12, 2), 'x': txt}); trozo = []
open(f'{A}/subs-{AP}.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(T); print(len(subs), 'subtítulos')
