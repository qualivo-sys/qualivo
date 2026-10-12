# uso: python3 revisa_cortes.py <carpeta_trabajo con bruto2.mp4 y pal.json> [todo]
# Revisa la línea de tiempo del montaje: qué se ve en cada momento (cámara y encuadre, tarjeta o gráfico que tapa)
# y marca los tramos de cara de menos de 2 s y los cambios de encuadre sin motivo.
import json, sys
sys.path.insert(0, '/home/user/qualivo/content/video/2026-10-09-vsl'); import vsl_plantilla as v
W = sys.argv[1]
pl, tot, ap = v.construir(json.load(open(W + '/pal.json')), W + '/bruto2.mp4', W)
s = open('/home/user/qualivo/content/video/2026-10-09-vsl/tiempos-plantilla.js').read(); d = json.loads(s[s.index('{'):s.rindex('}') + 1])
TAPA = ('lista', 'cadena', 'ads3', 'ads2', 'landing', 'pantalla', 'grande', 'fin')
o = 0; segs = []
for a, b, e in pl: segs.append((o, o + b - a, e)); o += b - a
def T(x):
    o = 0
    for a, b, _ in pl:
        if x < a: return o
        if x <= b: return o + x - a
        o += b - a
    return o
H = [(e['t0'], e['t1'], e['tipo']) for e in d['esc'] if e['tipo'] in TAPA] + [(T(a[0]), T(a[1]), 'kling') for a in ap]
C = [(e['t0'], e['t1']) for e in d['esc'] if e['tipo'] in ('tarjeta', 'cta')]
def st(t):
    for a, b, k in H:
        if a <= t < b: return 'H:' + k
    for a, b in C:
        if a <= t < b: return 'C'
    return 'V'
prev = None; runs = []; t = 0
while t < tot:
    enc = next((e for a, b, e in segs if a <= t < b), segs[-1][2]); s_ = st(t)
    key = s_ if s_.startswith('H') else s_ + ':' + enc
    if key != prev: runs.append([round(t, 1), key]); prev = key
    t = round(t + 0.05, 2)
malos = 0
for i, (t, k) in enumerate(runs):
    nxt = runs[i + 1][0] if i + 1 < len(runs) else tot
    flag = '  <-- CORTO' if nxt - t < 2.0 and not k.startswith('H') and nxt - t > 0.16 else ''
    malos += bool(flag)
    if len(sys.argv) > 2 or flag: print(f'{t:6.1f} {nxt - t:5.1f} {k}{flag}')
print('tramos', len(runs), 'cortos', malos)
# mismo encuadre antes y después de un gráfico = «vuelve a la misma cámara»
vis = [(t, k) for t, k in runs if not k.startswith('H')]
for i in range(1, len(runs) - 1):
    if runs[i][1].startswith('H') and not runs[i - 1][1].startswith('H'):
        j = i
        while j < len(runs) and runs[j][1].startswith('H'): j += 1
        if j < len(runs) and runs[j][1] == runs[i - 1][1]: print('MISMO ENCUADRE tras gráfico en', runs[i][0], runs[j][1])
