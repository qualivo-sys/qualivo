#!/usr/bin/env python3
"""Formación V2 · híbrido. Dos tomas largas de Javier (voz/h1 antes de Raquel, voz/h2 después) y la frase de Raquel del anuncio original.
   python3 audio.py → audio-corta-hy.m4a y subs-corta-hy.js. El montaje sigue a la voz: cada cambio de pantalla sale de una palabra."""
import json, os, re, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V = f'{A}/voz'; S = f'{A}/../2026-09-17-sistema'
def lufs(f, t=None):
    r = subprocess.run(['ffmpeg', '-v', 'info'] + (['-t', str(t)] if t else []) + ['-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])
W1 = json.load(open(f'{V}/h1.json')); W2 = json.load(open(f'{V}/h2.json'))
def ix(W, w, desde=0): return next(i for i in range(desde, len(W)) if W[i]['w'].lower().strip('¿?.,:') == w)
RQ = 3.1; OBJ = -17.0
t1 = .15; rq = round(t1 + W1[-1]['e'] + .50, 2); t2 = round(rq + RQ + .55, 2); FIN = round(t2 + W2[-1]['e'] + 1.2, 2)
p1 = lambda w, d=0: round(t1 + W1[ix(W1, w, d)]['s'], 2); p2 = lambda w, d=0: round(t2 + W2[ix(W2, w, d)]['s'], 2)
iw = ix(W1, 'whatsapp'); isol = ix(W1, 'solicitud'); e2 = p1('en') - .12
T = {'a': t1, 'pd': p1('matrículas'), 'e2': e2, 'g': e2 + .2, 'ld': p1('pero') - .1, 'lau': p1('laura') - .1, 'sc': p1('principio') - .1, 'f2': p1('información') + .15,
     'l0': p1('solicitud') - .3, 'og': p1('con', isol) - .1, 'e3': p1('pocos') - .18, 'wr': p1('y', iw) - .1, 'll': p1('si') - .15, 'rq': rq,
     'e4': t2 - .1, 'ops': p2('así') - .15, 'e5': p2('así') - .15, 'ges': p2('gestionamos') - .1, 'e6': p2('mejoramos') - .1, 'sol': p2('solicita'), 'FIN': FIN}
T = {k: round(v, 2) for k, v in T.items()}; T['av'] = p2('avanzan'); T['na'] = p2('necesitan'); T['c4'] = T['e7'] = T['e6']; T['c'] = [T['e6']] * 3; T['cap'] = T['lau']; T['a2'] = T['pd']
subs = []
def trocea(W, t0):
    trozo = []
    for n in range(len(W)):
        p = W[n]; trozo.append(p); txt = ' '.join(x['w'] for x in trozo).replace('Cuálivo', 'Qualivo')
        if p['w'][-1] in '.?!' or n == len(W) - 1 or (len(txt) > 18 and p['w'][-1] in ',:') or len(txt) > 27:
            subs.append({'s': round(t0 + trozo[0]['s'], 2), 'e': round(t0 + p['e'] + .2, 2), 'x': txt}); trozo = []
trocea(W1, t1)
subs.append({'s': round(rq + .1, 2), 'e': round(rq + RQ, 2), 'x': '«Hola, Laura, soy Raquel, de Escuela Norte.»', 'q': 'Raquel'})
trocea(W2, t2)
for a, b in zip(subs, subs[1:]): a['e'] = min(a['e'], b['s'])
g1 = OBJ - lufs(f'{V}/h1.mp3'); g2 = OBJ - lufs(f'{V}/h2.mp3'); gr = OBJ - lufs(f'{S}/voz-formacion/dr.mp3', RQ)
ms = lambda t: int(t * 1000)
fc = (f'[0:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g1:.2f}dB,adelay={ms(t1)}|{ms(t1)}[a0];'
      f'[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={gr:.2f}dB,afade=t=out:st={RQ-.5}:d=0.5,adelay={ms(rq)}|{ms(rq)}[a1];'
      f'[2:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g2:.2f}dB,adelay={ms(t2)}|{ms(t2)}[a2];'
      f'[a0][a1][a2]amix=inputs=3:normalize=0,apad,atrim=0:{FIN},asplit=2[v][sc];'
      f'[3:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{FIN},lowpass=f=2600,volume=0.16,afade=t=in:st=0:d=0.8,afade=t=out:st={FIN-1.6}:d=1.6[m];'
      f'[m][sc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700[md];[v][md]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{V}/h1.mp3', '-t', str(RQ), '-i', f'{S}/voz-formacion/dr.mp3', '-i', f'{V}/h2.mp3', '-stream_loop', '4', '-i', f'{S}/musica-pulso.mp3',
                '-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', f'{A}/audio-corta-hy.m4a'], check=True)
open(f'{A}/subs-corta-hy.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(T); print('ganancias dB', round(g1, 1), round(gr, 1), round(g2, 1), '·', len(subs), 'subtítulos')
