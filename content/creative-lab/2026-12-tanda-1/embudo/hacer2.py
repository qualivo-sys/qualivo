#!/usr/bin/env python3
"""El embudo agujereado, versión 2 (26-nov): guion nuevo de Maikel. Argumento: rentabilizar la inversión publicitaria.
Mismos planos generados que la v1; cambian el mensaje, la demostración (campañas → seguimiento → qué anuncios generan matrículas) y el montaje."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__))
def dur(k): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{A}/voz2/{k}.mp3']))
W = {w['w'].strip('.,').lower(): w['s'] for w in reversed(json.load(open(f'{A}/voz2/s.json')))}
esc = [('pour', 'h', 4.3, .3, ['Tu escuela paga por cada lead.', '¿Cuántos acaba perdiendo?']), ('macro', 'p', 5.9, .3, ['Solicitudes sin responder,', 'contactos sin cualificar', 'y oportunidades sin seguimiento.']),
       ('sol', 's', 10.0, .25, ['En Qualivo gestionamos tus campañas,', 'automatizamos el seguimiento', 'y conectamos marketing y ventas', 'para saber qué anuncios generan matrículas.']),
       ('tape', 'r', 4.7, .35, ['No se trata solo de captar más.', 'Se trata de perder menos.']), ('fin', 'c', 3.9, .45, [])]
LT = {'h': [0, 1.87], 'p': [0, 1.62, 3.04], 's': [0, 2.30, 4.46, 6.62], 'r': [0, 2.11], 'c': []}
t = 0; P = []
for tipo, k, d, pre, lin in esc: P.append({'tipo': tipo, 'voz': k, 't0': round(t, 2), 'd': d, 'tv': round(t + pre, 2), 'dv': round(dur(k), 2), 'lin': lin, 'lt': LT[k]}); t += d
s = next(p for p in P if p['tipo'] == 'sol')
J = {'DUR': round(t, 2), 'P': P, 'B': {'b2': round(s['tv'] + W['automatizamos'] - .12, 2), 'b3': round(s['tv'] + W['conectamos'] - .2, 2), 'para': round(s['tv'] + W['para'] - .1, 2), 'mat': round(s['tv'] + W['generan'] - .1, 2)}}
json.dump(J, open(f'{A}/tiempos-2.json', 'w'), indent=1, ensure_ascii=False); open(f'{A}/t-2.js', 'w').write('window.J=' + json.dumps(J, ensure_ascii=False) + ';'); print(J['DUR'], [(p['tipo'], p['t0'], p['d']) for p in P], J['B'])
