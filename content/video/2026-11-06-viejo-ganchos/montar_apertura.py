#!/usr/bin/env python3
"""Anuncio viejo de formación con apertura nueva de duración libre (22-nov).

Como montar.py, pero la apertura puede durar más que la tarjeta original (5,68 s): el cuerpo entra entero y sin tocar
justo después. Si la apertura es más larga, la música de fondo arranca antes y enlaza con la del original.

  python3 montar_apertura.py g5 g6        # 9:16 y 4:5 → salida/viejo-<k>-916.mp4 y -45.mp4
"""
import json, os, subprocess, sys
A = os.path.dirname(os.path.abspath(__file__)); R = os.path.abspath(f'{A}/../../..'); S = f'{A}/../2026-09-17-sistema'
SP = os.environ.get('SP', '/tmp/apertura'); os.makedirs(SP, exist_ok=True)
CORTE, CORTE_AUDIO, FPS, VOZ_EN, PAUSA = 5.68, 5.60, 25, 0.15, 0.32
def run(*c): subprocess.run(c, check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def rms(f):
    import numpy as np
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    fr = x[:len(x)//160*160].reshape(-1, 160); e = (fr**2).mean(1); return float(np.sqrt(e[e > e.max()*.02].mean()))

def voz_ajustada(k):
    """Recorta las pausas entre frases a PAUSA s y devuelve (archivo, duración)."""
    import re
    src = f'{A}/voz/{k}.mp3'; tr = []; a = 0.0
    o = subprocess.run(['ffmpeg', '-v', 'info', '-i', src, '-af', 'silencedetect=noise=-35dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
    sil = list(zip(map(float, re.findall(r'silence_start: ([\d.]+)', o)), map(float, re.findall(r'silence_end: ([\d.]+)', o))))
    for x, y in sil:                                   # silencios medidos dentro de la locución
        if x > .2 and y < dur(src) - .2 and y - x > PAUSA + .05: tr.append((a, x + PAUSA / 2)); a = y - PAUSA / 2
    tr.append((a, min(dur(src), (sil[-1][0] + .12) if sil and sil[-1][1] > dur(src) - .25 else dur(src))))
    out = f'{SP}/voz-{k}.wav'
    fc = ';'.join(f'[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b-a-.02:.3f}:d=0.02[p{i}]' for i, (a, b) in enumerate(tr))
    fc += ';' + ''.join(f'[p{i}]' for i in range(len(tr))) + f'concat=n={len(tr)}:v=0:a=1[o]'
    run('ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', fc, '-map', '[o]', out)
    return out, dur(out)

def audio(k, L):
    v, dv = voz_ajustada(k); g = 1.55 * rms(f'{S}/voz-formacion/d0.mp3') / rms(v); fin_voz = VOZ_EN + dv
    La = L - (CORTE - CORTE_AUDIO); d = La - CORTE_AUDIO       # d: lo que la apertura alarga al original
    sube = f'0.33+0.35*clip((t-{fin_voz:.2f})/0.35,0,1)'
    st = 'aformat=sample_rates=44100:channel_layouts=stereo'
    if d > .05:   # la música suena d s de más al principio y vuelve a empezar, fundida, para llegar al empalme donde llega el original
        mus = (f"[0:a]{st},atrim=0:{d+.4:.3f},asetpts=PTS-STARTPTS[m0];[3:a]{st},atrim=0:{CORTE_AUDIO},asetpts=PTS-STARTPTS[m1];"
               f"[m0][m1]acrossfade=d=0.4:c1=tri:c2=tri,atrim=0:{La:.3f},volume='{sube}':eval=frame[m];")
    else:
        mus = f"[0:a]{st},atrim=0:{La:.3f},asetpts=PTS-STARTPTS,volume='{sube}':eval=frame[m];"
    fc = (mus + f"[1:a]{st},volume={g:.3f},adelay={int(VOZ_EN*1000)}|{int(VOZ_EN*1000)},apad,atrim=0:{La:.3f}[v];"
          f"[m][v]amix=inputs=2:normalize=0,atrim=0:{La:.3f}[h];"
          f"[2:a]{st},atrim=start={CORTE_AUDIO - .1},asetpts=PTS-STARTPTS[c];[h][c]acrossfade=d=0.1:c1=tri:c2=tri[out]")
    out = f'{SP}/audio-{k}.m4a'
    run('ffmpeg', '-v', 'error', '-y', '-i', f'{S}/musica-lofi-b.mp3', '-i', v, '-i', f'{S}/mezcla-formacion.m4a', '-i', f'{S}/musica-lofi-b.mp3',
        '-filter_complex', fc, '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', out)
    return out, fin_voz

def main(ks):
    os.makedirs(f'{A}/salida', exist_ok=True)
    for k in ks:
        _, dv = voz_ajustada(k)
        L = max(CORTE, round((VOZ_EN + dv + .30) * FPS) / FPS + (CORTE - CORTE_AUDIO))    # la voz acaba 0,3 s antes del empalme de audio
        au, fin_voz = audio(k, L)
        for fmt, base in (('916', 'v'), ('45', '45')):
            cuerpo = f'{SP}/cuerpo{fmt}.mp4'
            if not os.path.exists(cuerpo):
                run('ffmpeg', '-v', 'error', '-y', '-ss', str(CORTE), '-i', f'{R}/assets/video/qualivo-sistema-formacion-{base}.mp4', '-an',
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-r', str(FPS), cuerpo)
            out = f'{SP}/gancho-{k}-{fmt}'
            run('node', f'{A}/render_apertura.js', f'{A}/escena-gancho{"-45" if fmt == "45" else ""}.html#{k}', out, f'{L:.2f}', str(CORTE))
            run('ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{out}/f%05d.jpg', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', f'{out}.mp4')
            lst = f'{SP}/lista-{k}-{fmt}.txt'; open(lst, 'w').write(f"file '{out}.mp4'\nfile '{cuerpo}'\n")
            sal = f'{A}/salida/viejo-{k}-{fmt}.mp4'
            run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', au, '-map', '0:v', '-map', '1:a',
                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', sal)
            print('ok', sal, 'apertura', round(L, 2), 'voz acaba en', round(fin_voz, 2), 'total', round(dur(sal), 2))
if __name__ == '__main__': main(sys.argv[1:])
