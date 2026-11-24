#!/usr/bin/env python3
"""Demo corta de Formación (24-nov): escenas del anuncio original (solicitud, CRM, WhatsApp, seguimiento) + escenas de interfaz del V7
(pipeline, cita, confirmación, Intelligence, cierre), con locución nueva sin acelerar apenas y subtítulos. Sin agente de voz.
Genera t.js y capas.html (capa gráfica del V7 sin titulares, con subtítulos; transparente mientras se ve el vídeo original)."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V7 = f'{A}/../2026-11-24-formacion-v7'
TEMPO, HUECO, COLA = 1.05, 0.12, 1.0; ORDEN = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6']
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
T = {}; X = {}; SUBS = []; t = 0.1
for k in ORDEN:
    d = dur(f'{A}/voz2/{k}.mp3') / TEMPO; T[k] = [round(t, 3), round(d, 3)]; ws = json.load(open(f'{A}/voz2/{k}.json'))
    X[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / TEMPO, 3) for w in reversed(ws)}
    if k not in ('d5', 'd6'):
        tr = []
        for w in ws:
            L = len(' '.join(x['w'] for x in tr[-1])) if tr else 0
            if tr and (L + len(w['w']) > 30 or (tr[-1][-1]['w'][-1] in ',.?' and L >= 16)): tr.append([w])
            elif tr: tr[-1].append(w)
            else: tr.append([w])
        for i, c in enumerate(tr): SUBS.append([round(t + c[0]['s'] / TEMPO - .05, 3), round(t + (tr[i + 1][0]['s'] if i + 1 < len(tr) else ws[-1]['e'] + .25) / TEMPO - .05, 3), ' '.join(x['w'] for x in c)])
    t += d + HUECO
DUR = round(t - HUECO + COLA, 2); E = {k: round(T[k][0] - .1, 3) for k in T}; E['d0'] = 0; r25 = lambda x: round(round(x * 25) / 25, 2); F = DUR + 20
W = {'v0': {'mira': F, 'solicitud': F}, 'v2': {'anuncio': F, 'sistema': F, 'whatsapp': F, 'cualifica': X['d2']['cualifica'], 'actualiza': X['d2']['cualifica'] + .95},
     'v3': {'responde': F, 'podemos': F, 'agente': F}, 'r1': {'ini': F, 'fin': F},
     'v4': {'reserva': X['d3']['gestiona'] + .25, 'reunión': X['d3']['reuniones'], 'sistema': X['d3']['confirmaciones'], 'confirma': X['d3']['confirmaciones'], 'envía': X['d3']['recordatorios'], 'si': F, 'reprograma': F},
     'v5': {'valida': F, 'utilizamos': F, 'no': F},
     'v6': {'captación': X['d5']['captación'], 'seguimiento': X['d5']['todo'], 'mejora': X['d5']['después'], 'solicita': X['d6']['solicita']}}
# [inicio, tipo, segundo de entrada en el vídeo original (None = escena gráfica del V7 o la de Intelligence)]
P = [[0, 'o_ficha', 9.7], [r25(X['d1']['solicita'] - .1), 'o_crm', 13.7], [r25(E['d2']), 'o_wa', 19.2], [r25(X['d2']['cualifica'] + .4), 'pipe', None], [r25(X['d2']['seguimiento']), 'o_seg', 35.2],
     [r25(E['d3']), 'cal', None], [r25(X['d3']['confirmaciones'] + .1), 'conf', None], [r25(E['d4']), 'intel', None], [r25(E['d5']), 'fin', None]]
PX = [[p[0], p[1], None, 0] for p in P] + [[F + i, k, None, 0] for i, k in enumerate(['laura', 'anuncio', 'crm', 'origen', 'wa', 'sinresp', 'llamada', 'repro', 'adm', 'meta'])]
TJ = dict(T, **{k: [F, 0] for k in ['v0', 'v1', 'v2', 'v3', 'v4', 'v4b', 'v5', 'v6']})
open(f'{A}/t2.js', 'w').write('window.T=' + json.dumps(TJ) + ';window.W=' + json.dumps(W, ensure_ascii=False) + ';window.DUR=' + str(DUR) + ';window.P=' + json.dumps(PX) + ';window.SUBS=' + json.dumps(SUBS, ensure_ascii=False) + ';')
json.dump({'T': T, 'DUR': DUR, 'TEMPO': TEMPO, 'P': P, 'X': X, 'SUBS': SUBS}, open(f'{A}/tiempos2.json', 'w'), indent=1, ensure_ascii=False)
h = open(f'{V7}/capas.html').read()
a = '<script src="../2026-11-24-formacion-v7/t.js"></script>'; assert a in h; h = h.replace(a, '<script src="../2026-11-24-formacion-ad03-demo/t2.js"></script>')
css = '''<style>.tt{display:none!important}#g3,#va,#ad1,#q7{display:none!important}
#sub{position:absolute;z-index:60;left:70px;top:286px;max-width:940px;font-family:Anton;font-size:74px;line-height:1.02;text-transform:uppercase;color:#F4F1EB;background:#0A0A0B;padding:14px 24px 16px;border-radius:18px;opacity:0}</style>
<div id="sub"></div><script>{const s0=window.setT;window.setT=t=>{s0(t);const s=SUBS.find(x=>t>=x[0]&&t<x[1]),el=document.getElementById('sub');el.style.opacity=s?1:0;if(s)el.textContent=s[2];};window.setT(0);}</script>'''
h = h.replace('</body>', css + '</body>') if '</body>' in h else h + css
open(f'{A}/capas2.html', 'w').write(h); print('ok', DUR, P)
