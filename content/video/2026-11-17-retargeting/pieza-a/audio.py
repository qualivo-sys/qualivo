#!/usr/bin/env python3
"""Retargeting · pieza A «No vendemos solo anuncios». Audio y subtítulos.
   python3 audio.py → audio-corta-h3.m4a y subs-corta-h3.js
Una sola toma de Javier Rojas (../voz/rc). Los cuatro bloques cambian en la palabra que los nombra."""
import json, os, re, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V = f'{A}/../voz'; S = f'{A}/../../2026-09-17-sistema'
def lufs(f):
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])
W = json.load(open(f'{V}/rc.json')); t0 = .15
p = lambda w: round(t0 + next(x for x in W if x['w'].lower().strip('¿?.,:') == w)['s'], 2)
ic = next(i for i, x in enumerate(W) if x['w'].startswith('Captación'))
e2 = round(t0 + W[ic - 1]['e'] + .05, 2); e6 = p('conoce') - .2; FIN = round(t0 + W[-1]['e'] + 2.1, 2)
T = {'a': t0, 'a2': p('lo'), 'e2': e2, 'e3': p('respuesta') - .12, 'e4': p('seguimiento') - .12, 'e5': p('y') - .1, 'e6': e6, 'e7': e6,
     'c4': e6, 'c': [e6, e6, e6], 'sol': round(e6 + .5, 2), 'rq': 9999, 'FIN': FIN}
T = {k: (round(v, 2) if not isinstance(v, list) else v) for k, v in T.items()}
subs = []; trozo = []
for n in range(ic, len(W)):
    x = W[n]; trozo.append(x); txt = ' '.join(y['w'] for y in trozo)
    if x['w'][-1] in '.?!,' or n == len(W) - 1 or len(txt) > 27:
        subs.append({'s': round(t0 + trozo[0]['s'], 2), 'e': round(t0 + x['e'] + .2, 2), 'x': txt}); trozo = []
for a, b in zip(subs, subs[1:]): a['e'] = min(a['e'], b['s'])
g = -17.0 - lufs(f'{V}/rc.mp3'); ms = int(t0 * 1000)
fc = (f'[0:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g:.2f}dB,adelay={ms}|{ms},apad,atrim=0:{FIN},asplit=2[v][sc];'
      f'[1:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{FIN},lowpass=f=2600,volume=0.16,afade=t=in:st=0:d=0.6,afade=t=out:st={FIN-1.5}:d=1.5[m];'
      f'[m][sc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700[md];[v][md]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{V}/rc.mp3', '-stream_loop', '2', '-i', f'{S}/musica-pulso.mp3', '-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', f'{A}/audio-corta-h3.m4a'], check=True)
open(f'{A}/subs-corta-h3.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(T, len(subs), 'subtítulos')
