#!/usr/bin/env python3
"""Formación V2 · corte 9. Pista de audio y subtítulos, con pausas medias entre frases.
   python3 audio.py → audio-corta-h3.m4a y subs-corta-h3.js
Voz: Javier Rojas (../voz-prueba/). Raquel: audio del anuncio original. Dos frases van partidas en dos (n2 y m4)
para dejar aire entre sus mitades; el corte cae en un silencio de la propia locución."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V = f'{A}/../voz-prueba'; S = f'{A}/../../2026-09-17-sistema'
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def pal(f, w): return next(p for p in json.load(open(f'{V}/{f}.json')) if p['w'].lower().startswith(w))
RQ = 3.1
c2 = (pal('n2', 'captación')['e'] + pal('n2', 'y')['s']) / 2; c4 = (pal('m4', 'whatsapp')['e'] + pal('m4', 'si')['s']) / 2
# (clave, archivo, pausa detrás, tramo [inicio, fin] del archivo o None)
orden = [('a', 'h3', .40, None), ('e2', 'n2', 1.30, (0, c2)), ('m2', 'n2', 1.00, (c2, None)), ('cap', 'm3b', 1.50, None),
         ('e3', 'm4', .70, (0, c4)), ('s3', 'm4', .40, (c4, None)), ('rq', 'RAQUEL', .45, None), ('e4', 'm5', .60, None),
         ('e5', 'n6', .70, None), ('e6', 'n7', 2.00, None)]
t = .15; T = {}; ent = []; fil = []; subs = []
for i, (k, f, pausa, tr) in enumerate(orden):
    T[k] = round(t, 2); ms = int(t * 1000)
    if f == 'RAQUEL':
        ent += ['-t', str(RQ), '-i', f'{S}/voz-formacion/dr.mp3']; d = RQ
        fil.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=out:st={RQ-.5}:d=0.5,volume=0.9,adelay={ms}|{ms}[a{i}]')
        subs.append({'s': t + .1, 'e': t + RQ, 'x': '«Hola, Laura, soy Raquel, de Escuela Norte.»', 'q': 'Raquel'})
    else:
        tot = dur(f'{V}/{f}.mp3'); a, b = (tr or (0, None)); b = b or tot; d = b - a
        ent += ['-ss', f'{a:.3f}', '-t', f'{d:.3f}', '-i', f'{V}/{f}.mp3']
        fil.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=0.02,afade=t=out:st={d-.03:.3f}:d=0.03,adelay={ms}|{ms}[a{i}]')
        if k != 'a':
            trozo = []; ps = [p for p in json.load(open(f'{V}/{f}.json')) if a - .01 <= p['s'] < b]
            for n, p in enumerate(ps):
                trozo.append(p); txt = ' '.join(x['w'] for x in trozo).replace('Cuálivo', 'Qualivo')
                if p['w'][-1] in '.?!' or n == len(ps) - 1 or (len(txt) > 20 and p['w'][-1] in ',:') or len(txt) > 27:
                    subs.append({'s': round(t + trozo[0]['s'] - a, 2), 'e': round(t + p['e'] - a + .15, 2), 'x': txt}); trozo = []
    if k == 'cap': T['l0'] = round(t + d + .35, 2)
    t += d + pausa
n = len(orden); FIN = round(t, 2); T['FIN'] = FIN; T['e7'] = T['e6']
T['s5'] = round(T['e5'] + pal('n6', 'sabes')['s'], 2); T['a2'] = round(T['a'] + pal('h3', '¿')['s'], 2)
T['c'] = [round(T['e6'] + pal('n7', w)['s'], 2) for w in ('captación', 'seguimiento', 'mejora')]
ent += ['-stream_loop', '3', '-i', f'{S}/musica-pulso.mp3']
fc = ';'.join(fil) + ';' + ''.join(f'[a{j}]' for j in range(n)) + f'amix=inputs={n}:normalize=0,apad,atrim=0:{FIN},asplit=2[v][sc];' \
     f'[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{FIN},lowpass=f=2200,volume=0.15,afade=t=in:st={T["e2"]-.6}:d=1.2,afade=t=out:st={FIN-2.2}:d=2.2[m];' \
     f'[m][sc]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=600[md];[v][md]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ent + ['-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', f'{A}/audio-corta-h3.m4a'], check=True)
open(f'{A}/subs-corta-h3.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(T, len(subs), 'subtítulos')
