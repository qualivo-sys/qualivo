#!/usr/bin/env python3
"""V2 «Las fugas», versión de una sola toma: toda la voz en una pasada (sin cortes entre frases),
guion recortado para quedar por debajo de 60 s y música más animada. Las escenas se atan al inicio
de cada frase, que se saca de la transcripción con marcas por palabra (voz-v3/t0.json)."""
import json, subprocess, sys, unicodedata, imageio_ffmpeg, montar, v2_build
FF = imageio_ffmpeg.get_ffmpeg_exe()
TEMPO = 0.94          # algo más pausada que la toma original
COLA = 1.8
PAUSAS = {1: 0.35, 3: 0.35, 4: 0.25, 5: 0.25, 6: 0.4, 8: 0.3, 10: 0.5, 14: 0.35, 15: 0.3, 16: 0.25}   # segundos de silencio que se meten justo antes de esa frase
# índice de escena (mismos que v2_build) -> primeras palabras de su frase
INICIOS = [(0, 'este lead'), (1, 'laura'), (3, 'uno no'), (4, 'otro reserva'), (5, 'otro recibe'), (6, 'y al final'),
           (7, 'pero mira'), (8, 'por eso'), (9, 'el anuncio filtra'), (10, 'quien pide'), (11, 'si no contesta'),
           (12, 'si reserva'), (13, 'y cuando'), (14, 'ademas'), (17, 'y con esos'), (15, 'porque conseguir'), (16, 'quieres saber')]
def silencio_antes(ts, desde, audio='voz-v3/t0.mp3'):
    """Punto más silencioso entre el final de la palabra anterior y el inicio estimado (+0.1 s),
    para no partir una palabra: la transcripción da los inicios con unas centésimas de error."""
    import numpy as np
    global _PCM
    if '_PCM' not in globals():
        raw = subprocess.run([FF, '-i', audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
        _PCM = np.frombuffer(raw, np.int16).astype(float) / 32768
    a, b = max(desde, ts - 0.6), ts + 0.1
    mejor, t = None, a
    while t + 0.03 <= b:
        s = _PCM[int(t * 16000):int((t + 0.03) * 16000)]
        e = float(np.sqrt(np.mean(s ** 2))) if len(s) else 1
        if mejor is None or e < mejor[0]: mejor = (e, t + 0.015)
        t += 0.005
    return mejor[1]

def norm(w): return ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if c.isalpha())

def tiempos_frases(words):
    ws = [norm(w['w']) for w in words]; out, k = [], 0
    for i, frase in INICIOS:
        p = frase.split()
        while [norm(x) for x in p] != ws[k:k + len(p)]:
            k += 1
            if k > len(ws): raise SystemExit('no encuentro: ' + frase)
        out.append((i, k)); k += len(p)
    res = {}
    for n, (i, k) in enumerate(out):
        ini = words[k]['s']
        fin = words[out[n + 1][1] - 1]['e'] if n + 1 < len(out) else words[-1]['e']
        res[i] = [ini, fin, words[k - 1]['e'] if k > 0 else 0.0]
    return res

def construir(variante):
    words = json.load(open('voz-v3/t0.json'))
    t = tiempos_frases(words)
    corte = silencio_antes(t[1][0], t[1][2]) if variante == 'B' else 0.0
    fin = words[-1]['e'] + 0.15
    voz = f'voz-fugas3-{variante}.mp3'
    # trozos de voz separados por las pausas
    cortes = sorted((c, p) for c, p in ((silencio_antes(t[i][0], t[i][2]), p) for i, p in PAUSAS.items() if i in t) if c > corte + 0.05)
    lim = [corte] + [c for c, _ in cortes] + [fin]; fc = ''; ins = []
    for n in range(len(lim) - 1):
        ins += ['-i', 'voz-v3/t0.mp3']
        pad = cortes[n][1] if n < len(cortes) else 0
        fc += '[%d:a]atrim=%.3f:%.3f,asetpts=PTS-STARTPTS,atempo=%.3f,apad=pad_dur=%.3f[p%d];' % (n, lim[n], lim[n + 1], TEMPO, pad, n)
    fc += ''.join('[p%d]' % n for n in range(len(lim) - 1)) + 'concat=n=%d:v=0:a=1,afade=t=in:d=0.04[out]' % (len(lim) - 1)
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + ins + ['-filter_complex', fc, '-map', '[out]',
                    '-c:a', 'libmp3lame', '-b:a', '192k', voz], check=True)
    def extra(ts):  # cuánto se retrasa un instante por las pausas anteriores
        return sum(p for c, p in cortes if ts >= c)
    tiempos = {}
    for i, (a, b, _) in t.items():
        if variante == 'B' and i == 0: continue
        a2 = max(0.0, (a - corte) / TEMPO - 0.05 + extra(a)); b2 = (b - corte) / TEMPO + extra(a)
        tiempos[i] = (round(a2, 3), round(b2, 3), 1.0)
    if variante == 'B': tiempos[1] = (0.0, tiempos[1][1], 1.0)
    dur_voz = (fin - corte) / TEMPO + sum(p for _, p in cortes)
    nombre = '01_Qualivo_Fugas_Hook-Anuncio_9x16' if variante == 'A' else '02_Qualivo_Fugas_Hook-Laura_9x16'
    spec = {'nombre': nombre, 'voz': voz, 'musica': 'musica3/2-deephouse-norm.wav', 'musica_volumen': 1.0,
            'duracion': round(dur_voz + COLA, 2), 'tiempos_voz': {str(k): v for k, v in tiempos.items()},
            'escenas': v2_build.escenas_de(tiempos)}
    json.dump(spec, open(f'fugas3-{variante}.json', 'w'), ensure_ascii=False, indent=1)
    print(variante, 'dur', spec['duracion'], 'escenas', len(spec['escenas']))
    montar.montar(f'fugas3-{variante}.json', f'out-fugas7/{nombre}.mp4')

if __name__ == '__main__':
    for v in sys.argv[1:]: construir(v)
