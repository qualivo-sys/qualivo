#!/usr/bin/env python3
"""E-01 versión corta (A dolor / B pérdida): voz de David (ElevenLabs v3) y tiempos.
   ELEVENLABS_API_KEY=... python3 voz.py voz a|b
   python3 voz.py tiempos a|b      # tiempos_<v>.js
La clave nunca se escribe en el repo."""
import json, os, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '../../../produccion/video-anuncios'))
G = json.load(open(f'{AQUI}/guion.json')); orden, v = sys.argv[1], sys.argv[2]; GUION = G[v] + G['comun']
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')
if orden == 'voz':
    import voz_elevenlabs as ve
    ve.tts(' '.join(f for _, f in GUION), 'david', f'{AQUI}/voz/{v}')
else:
    pal = json.load(open(f'{AQUI}/voz/{v}.json')); ws = [norm(p['w']) for p in pal]; T, i = {}, 0
    for k, frase in GUION:
        cab = [norm(x).replace('qualivo', 'cualivo') for x in frase.split()[:2]]
        while i < len(ws) - 1 and ws[i:i+2] != cab: i += 1
        if ws[i:i+2] != cab: sys.exit(f'no encuentro «{" ".join(cab)}»')
        T[k] = 0 if k == 'gancho' else round(max(0, pal[i]['s'] - 0.15), 2); i += 1
    T['W'] = {}   # primera aparición de cada palabra (para micro-sincronías)
    for p in pal: T['W'].setdefault(norm(p['w']), p['s'])
    T['FIN'] = round(pal[-1]['e'] + 2.6, 2)
    open(f'{AQUI}/tiempos_{v}.js', 'w').write('window.TI=' + json.dumps(T, ensure_ascii=False) + ';'); print({k: T[k] for k in T if k != 'W'})
