#!/usr/bin/env python3
"""Formación V2 · corte 12. Pista de audio y subtítulos.
   python3 audio.py → audio-corta-h3.m4a y subs-corta-h3.js
Voz: Javier Rojas (../voz-prueba/). Raquel: audio del anuncio original.
Cada frase es una locución completa (ninguna va cortada a mano) y todas se igualan a -17 LUFS antes de mezclar,
Raquel incluida. La música suena desde el principio, baja bajo la voz y cubre las pausas."""
import json, os, re, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V = f'{A}/../voz-prueba'; S = f'{A}/../../2026-09-17-sistema'
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def lufs(f, t=None):
    r = subprocess.run(['ffmpeg', '-v', 'info'] + (['-t', str(t)] if t else []) + ['-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])
def pal(f, w): return next(p for p in json.load(open(f'{V}/{f}.json')) if p['w'].lower().startswith(w))
RQ = 3.1; OBJ = -17.0
# (clave, archivo, pausa detrás)
orden = [('a', 'h3', .45), ('e2', 'p2a', 1.20), ('m2', 'p2b', 1.00), ('cap', 'm3b', 2.90), ('e3', 'p4a', 1.00), ('s3', 'p4b', .50),
         ('rq', 'RAQUEL', .50), ('e4', 'm5', .70), ('e5', 'n6', .90), ('e6', 'n7', 2.30)]
t = .15; T = {}; ent = []; fil = []; subs = []; G = {}
for i, (k, f, pausa) in enumerate(orden):
    T[k] = round(t, 2); ms = int(t * 1000)
    if f == 'RAQUEL':
        src = f'{S}/voz-formacion/dr.mp3'; d = RQ; g = OBJ - lufs(src, RQ); ent += ['-t', str(RQ), '-i', src]
        fil.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g:.2f}dB,afade=t=out:st={RQ-.5}:d=0.5,adelay={ms}|{ms}[a{i}]')
        subs.append({'s': round(t + .1, 2), 'e': round(t + RQ, 2), 'x': '«Hola, Laura, soy Raquel, de Escuela Norte.»', 'q': 'Raquel'})
    else:
        src = f'{V}/{f}.mp3'; d = dur(src); g = OBJ - lufs(src); ent += ['-i', src]
        fil.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g:.2f}dB,adelay={ms}|{ms}[a{i}]')
        if k != 'a':
            trozo = []; ps = json.load(open(f'{V}/{f}.json'))
            for n, p in enumerate(ps):
                trozo.append(p); txt = ' '.join(x['w'] for x in trozo).replace('Cuálivo', 'Qualivo')
                if p['w'][-1] in '.?!' or n == len(ps) - 1 or (len(txt) > 20 and p['w'][-1] in ',:') or len(txt) > 27:
                    subs.append({'s': round(t + trozo[0]['s'], 2), 'e': round(t + p['e'] + .15, 2), 'x': txt}); trozo = []
    G[k] = round(g, 1)
    if k == 'cap': T['f2'] = round(t + d + .05, 2); T['l0'] = round(t + d + 1.45, 2)
    t += d + pausa
n = len(orden); FIN = round(t, 2); T['FIN'] = FIN; T['e7'] = T['e6']
T['s5'] = round(T['e5'] + pal('n6', 'sabes')['s'], 2); T['a2'] = round(T['a'] + pal('h3', '¿')['s'], 2)
T['c'] = [round(T['e6'] + pal('n7', w)['s'], 2) for w in ('captación', 'seguimiento', 'mejora')]
T['c4'] = round(T['e6'] + pal('n7', 'para')['s'], 2)
ent += ['-stream_loop', '3', '-i', f'{S}/musica-pulso.mp3']
fc = ';'.join(fil) + ';' + ''.join(f'[a{j}]' for j in range(n)) + f'amix=inputs={n}:normalize=0,apad,atrim=0:{FIN},asplit=2[v][sc];' \
     f'[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{FIN},lowpass=f=2600,volume=0.16,afade=t=in:st=0:d=0.8,afade=t=out:st={FIN-1.6}:d=1.6[m];' \
     f'[m][sc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700[md];[v][md]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ent + ['-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', f'{A}/audio-corta-h3.m4a'], check=True)
open(f'{A}/subs-corta-h3.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(T); print('ganancias dB', G); print(len(subs), 'subtítulos')
