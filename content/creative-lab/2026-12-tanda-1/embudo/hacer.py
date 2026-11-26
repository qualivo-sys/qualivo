#!/usr/bin/env python3
"""El embudo agujereado (Creative Lab, tanda 1): tiempos de cada plano a partir de la locución. Genera t-A.js y t-B.js (un gancho cada uno).
   python3 hacer.py && node render_capas.js /tmp/embudo/capasA capas.html?v=A ... (lo lanza montar.py)"""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__))
def dur(k): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{A}/voz/{k}.mp3']))
TXT = {'gA': '¿De qué sirve conseguir más alumnos potenciales si los pierdes por el camino?', 'gB': 'Antes de invertir más en publicidad, mira por dónde se te escapan.', 'l2': 'La mayoría no llega al final.', 'l3': 'Unos se van porque nadie les contesta a tiempo.',
       'l4': 'Otros, porque nadie comprueba qué necesitan.', 'l5': 'Y otros se enfrían sin que nadie les haga seguimiento.', 'l6': 'En Qualivo llevamos tus campañas y tapamos los agujeros.', 'l7': 'Solicita tu diagnóstico gratuito.'}
for v in 'AB':
    g = 'g' + v; esc = [('pour', g, 5.0, .25), ('macro', 'l2', None, .35), ('wa', 'l3', None, .45), ('conv', 'l4', None, .45), ('intel', 'l5', None, .45), ('tape', 'l6', None, .45), ('fin', 'l7', 3.6, .5)]
    t = 0; P = []
    for tipo, k, fijo, pre in esc:
        d = fijo or round((dur(k) + pre + .45) * 25) / 25; P.append({'tipo': tipo, 'voz': k, 't0': round(t, 2), 'd': d, 'tv': round(t + pre, 2), 'dv': round(dur(k), 2), 'txt': TXT[k]}); t += d
    J = {'v': v, 'DUR': round(t, 2), 'P': P}
    json.dump(J, open(f'{A}/tiempos-{v}.json', 'w'), indent=1, ensure_ascii=False); open(f'{A}/t-{v}.js', 'w').write('window.J=' + json.dumps(J, ensure_ascii=False) + ';'); print(v, J['DUR'], [(p['tipo'], p['t0'], p['d']) for p in P])
