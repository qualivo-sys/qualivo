#!/usr/bin/env python3
"""El embudo agujereado: monta los planos generados (en /tmp/embudo/, no se suben al repositorio) + la capa gráfica + voz, sonido de los planos y música.
Saca 9:16 (Stories) y 4:5 (Feed) de cada gancho.   python3 hacer.py && python3 montar.py"""
import json, os, subprocess, sys
A = os.path.dirname(os.path.abspath(__file__)); SP = '/tmp/embudo'; MUS = f'{A}/../../../video/2026-09-17-sistema/musica-lofi-b.mp3'
INI = {'pour': 0.0, 'macro': 1.2, 'tape': 0.3}      # segundo de entrada dentro de cada plano generado
def run(*c): subprocess.run(c, check=True)
for V in (sys.argv[1:] or ['A', 'B']):
    J = json.load(open(f'{A}/tiempos-{V}.json')); DUR, P = J['DUR'], J['P']
    run('node', f'{A}/render_capas.js', f'{SP}/capas{V}', f'capas.html?v={V}')
    lst = []; fc = []; ent = ['-i', MUS]; et = []; n = 1
    for i, p in enumerate(P):
        o = f'{SP}/b{V}{i}.mp4'; nf = round(p['d'] * 25)
        if p['tipo'] in INI:
            run('ffmpeg', '-v', 'error', '-y', '-ss', str(INI[p['tipo']]), '-i', f"{SP}/{p['tipo']}.mp4", '-an', '-vf', 'fps=25,scale=1080:1920:flags=lanczos,setsar=1', '-frames:v', str(nf), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
            ent += ['-ss', str(INI[p['tipo']]), '-t', f"{p['d']:.2f}", '-i', f"{SP}/{p['tipo']}.mp4"]; d0 = int(p['t0'] * 1000)
            fc.append(f"[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.55,afade=t=in:st=0:d=0.08,afade=t=out:st={p['d']-.15:.2f}:d=0.15,adelay={d0}|{d0}[f{n}]"); et.append(f'[f{n}]'); n += 1
        else: run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f"color=c=black:s=1080x1920:r=25:d={p['d']+.2:.2f}", '-frames:v', str(nf), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', o)
        lst.append(f"file '{o}'")
        ent += ['-i', f"{A}/voz/{p['voz']}.mp3"]; d0 = int(p['tv'] * 1000)
        fc.append(f"[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo,loudnorm=I=-15:TP=-2:LRA=7,adelay={d0}|{d0}[v{n}]"); et.append(f'[v{n}]'); n += 1
    open(f'{SP}/lista{V}.txt', 'w').write('\n'.join(lst) + '\n')
    m0 = next(p['t0'] for p in P if p['tipo'] == 'wa')            # la música entra con la primera captura
    fc.append(f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{DUR-m0:.2f},volume=0.26,afade=t=in:st=0:d=0.6,afade=t=out:st={DUR-m0-1:.2f}:d=1,adelay={int(m0*1000)}|{int(m0*1000)}[m]")
    fc.append('[m]' + ''.join(et) + f'amix=inputs={len(et)+1}:normalize=0:duration=longest,alimiter=limit=0.9[o]')
    au = f'{SP}/audio{V}.m4a'; run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fc), '-map', '[o]', '-t', str(DUR), '-c:a', 'aac', '-b:a', '192k', au)
    F = {'stories-916': '[0:v][1:v]overlay=format=auto[v]', 'feed-45': '[0:v][1:v]overlay=format=auto,crop=1080:1350:0:285[v]'}
    for f, g in F.items():
        sal = f'{A}/embudo-gancho{V}-{f}.mp4'
        run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{SP}/lista{V}.txt', '-framerate', '25', '-i', f'{SP}/capas{V}/f%05d.png', '-i', au, '-filter_complex', g, '-map', '[v]', '-map', '2:a',
            '-c:v', 'libx264', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal); print('ok', os.path.basename(sal))
