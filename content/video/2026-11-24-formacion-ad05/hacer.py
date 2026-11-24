#!/usr/bin/env python3
"""AD05 · demo rápida (batería de Formación, 24-nov). Reutiliza la capa gráfica del V7 con otra locución:
genera t.js (mismos anclajes que espera capas.html del V7, calculados con la voz nueva) y capas.html (copia del V7
sin titulares de escena y con subtítulos de toda la locución en su lugar). Solo escenas de interfaz, sin planos de personas."""
import json, os, re, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V7 = f'{A}/../2026-11-24-formacion-v7'
TEMPO, HUECO, COLA = 1.10, 0.18, 1.3
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
T = {}; X = {}; SUBS = []; t = 0.1
for k in ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']:
    d = dur(f'{A}/voz/{k}.mp3') / TEMPO; T[k] = [round(t, 3), round(d, 3)]; ws = json.load(open(f'{A}/voz/{k}.json'))
    X[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / TEMPO, 3) for w in reversed(ws)}
    if k not in ('a5', 'a6'):      # subtítulos: trozos de hasta ~26 caracteres, cortando en las comas
        tr = []; 
        for w in ws:
            L = len(' '.join(x['w'] for x in tr[-1])) if tr else 0
            if tr and (L + len(w['w']) > 30 or (tr[-1][-1]['w'][-1] in ',.?' and L >= 16)): tr.append([w])
            elif tr: tr[-1].append(w)
            else: tr.append([w])
        for i, c in enumerate(tr): SUBS.append([round(t + c[0]['s'] / TEMPO - .05, 3), round(t + (tr[i + 1][0]['s'] if i + 1 < len(tr) else ws[-1]['e'] + .25) / TEMPO - .05, 3), ' '.join(x['w'] for x in c)])
    t += d + HUECO
DUR = round(t - HUECO + COLA, 2); E = {k: round(T[k][0] - .1, 3) for k in T}; r25 = lambda x: round(round(x * 25) / 25, 2); F = DUR + 20
# anclajes con los nombres que usa capas.html del V7
W = {'v0': {'mira': F, 'solicitud': F}, 'v2': {'anuncio': X['a2']['sistema'] - .3, 'sistema': X['a2']['sistema'], 'whatsapp': X['a2']['whatsapp'], 'cualifica': X['a2']['cualifica'], 'actualiza': X['a2']['activa']},
     'v3': {'responde': F, 'podemos': F, 'agente': F}, 'r1': {'ini': F, 'fin': F},
     'v4': {'reserva': X['a3']['agenda'], 'reunión': X['a3']['reunión'], 'sistema': X['a3']['envía'], 'confirma': X['a3']['confirmaciones'], 'envía': X['a3']['recordatorios'], 'si': F, 'reprograma': F},
     'v5': {'valida': X['a4']['valida'], 'utilizamos': X['a4']['utilizamos'], 'no': F},
     'v6': {'captación': X['a5']['captación'], 'seguimiento': X['a5']['seguimiento'], 'mejora': X['a5']['mejora'], 'solicita': X['a6']['solicita']}}
P = [[0, 'anuncio', None, 0], [r25(E['a1']), 'crm', None, 0], [r25(E['a2']), 'wa', None, 0], [r25(X['a2']['cualifica'] - .25), 'pipe', None, 0],
     [r25(E['a3']), 'cal', None, 0], [r25(X['a3']['envía'] - .2), 'conf', None, 0], [r25(E['a4']), 'meta', None, 0], [r25(E['a5']), 'fin', None, 0]]
PX = P + [[F + i, k, None, 0] for i, k in enumerate(['laura', 'origen', 'sinresp', 'llamada', 'repro', 'adm'])]      # escenas del V7 que aquí no salen
TJ = dict(T, **{k: [F, 0] for k in ['v0', 'v1', 'v2', 'v3', 'v4', 'v4b', 'v5', 'v6']})
open(f'{A}/t.js', 'w').write('window.T=' + json.dumps(TJ) + ';window.W=' + json.dumps(W, ensure_ascii=False) + ';window.DUR=' + str(DUR) + ';window.P=' + json.dumps(PX) + ';window.SUBS=' + json.dumps(SUBS, ensure_ascii=False) + ';')
json.dump({'T': T, 'DUR': DUR, 'TEMPO': TEMPO, 'P': P, 'X': X, 'SUBS': SUBS}, open(f'{A}/tiempos.json', 'w'), indent=1, ensure_ascii=False)
h = open(f'{V7}/capas.html').read()
a = '<script src="../2026-11-24-formacion-v7/t.js"></script>'; assert a in h; h = h.replace(a, '<script src="../2026-11-24-formacion-ad05/t.js"></script>')
css = '''<style>.tt{display:none!important}#mv2{margin-top:190px}#g3,#va,#ad1,#q7{display:none!important}
#sub{position:absolute;z-index:60;left:70px;top:286px;max-width:940px;font-family:Anton;font-size:74px;line-height:1.02;text-transform:uppercase;color:#F4F1EB;background:#0A0A0B;padding:14px 24px 16px;border-radius:18px;opacity:0}</style>
<div id="sub"></div><script>{const s0=window.setT;window.setT=t=>{s0(t);const s=SUBS.find(x=>t>=x[0]&&t<x[1]),el=document.getElementById('sub');el.style.opacity=s?1:0;if(s)el.textContent=s[2];};window.setT(0);}</script>'''
a = '</body>'; h = h.replace(a, css + a) if a in h else h + css
open(f'{A}/capas.html', 'w').write(h); print('ok', DUR, P); print(SUBS)
