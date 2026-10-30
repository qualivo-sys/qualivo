#!/usr/bin/env python3
"""E-01 versión concisa (guion de Maikel, 30-oct): locución de David (ElevenLabs v3) y tiempos de la escena.
   ELEVENLABS_API_KEY=... python3 voz.py voz [javier]   # voz/principal.* (David) o voz/javier.*
   python3 voz.py tiempos [javier]                      # tiempos.js o tiempos_javier.js
La clave nunca se escribe en el repo."""
import json, os, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '../../../produccion/video-anuncios'))
GUION = json.load(open(f'{AQUI}/guion.json'))
ADELANTO, COLA = 0.15, 2.6
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')
VZ = sys.argv[2] if len(sys.argv) > 2 else ''
ARCH = VZ or 'principal'
if sys.argv[1] == 'voz':
    import voz_elevenlabs as v
    v.tts(' '.join(f for _, f in GUION), VZ or 'david', f'{AQUI}/voz/{ARCH}', ajustes={'stability': 1.0} if VZ == 'javier' else None)
else:
    pal = json.load(open(f'{AQUI}/voz/{ARCH}.json')); ws = [norm(p['w']) for p in pal]; T, i = {}, 0
    for k, frase in GUION:
        cab = [norm(x).replace('qualivo','cualivo') for x in frase.split()[:2]]
        while i < len(ws) - 1 and ws[i:i+2] != cab: i += 1
        if ws[i:i+2] != cab: sys.exit(f'no encuentro «{" ".join(cab)}»')
        T[k] = 0 if k == 'gancho' else round(max(0, pal[i]['s'] - ADELANTO), 2); i += 1
    T['W'] = {}
    for p in pal: T['W'].setdefault(norm(p['w']), p['s'])
    T['FIN'] = round(pal[-1]['e'] + COLA, 2)
    open(f'{AQUI}/tiempos' + (f'_{VZ}' if VZ else '') + '.js', 'w').write('window.TI=' + json.dumps(T, ensure_ascii=False) + ';'); print({k: T[k] for k in T if k != 'W'})
