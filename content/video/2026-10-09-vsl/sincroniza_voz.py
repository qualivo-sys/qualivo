#!/usr/bin/env python3
"""Encaja una voz regrabada sobre el vídeo original, frase a frase.

   python3 sincroniza_voz.py <palabras_original.json> <palabras_nueva.json> <voz_nueva.wav> <salida.wav>

Alinea las dos transcripciones palabra a palabra y, para cada plano del montaje (vsl_v2.PLANOS, tiempos del bruto),
toma el mismo tramo de la voz nueva, lo ajusta de velocidad (atempo, sin cambiar el tono) para que dure lo mismo
y lo coloca en su sitio. Sale una pista con el tiempo del montaje (no del bruto), lista para vsl_v2.py: la boca y la voz arrancan
y terminan juntas en cada frase.
"""
import difflib, json, subprocess, sys, unicodedata
import imageio_ffmpeg
import vsl_v2

FF = imageio_ffmpeg.get_ffmpeg_exe()
# tramos fijados a mano (inicio del plano en el bruto -> tramo de la voz nueva), cuando la frase se leyó a otro ritmo
# y el plano va tapado por un gráfico, así que no hace falta casar la boca
FIJOS = {25.45: (22.99, 29.57)}

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')

def main(orig_json, nueva_json, voz, salida):
    O, N = json.load(open(orig_json)), json.load(open(nueva_json))
    m = difflib.SequenceMatcher(None, [norm(w['w']) for w in O], [norm(w['w']) for w in N], autojunk=False)
    par = {}
    for bl in m.get_matching_blocks():
        for k in range(bl.size): par[bl.a + k] = bl.b + k
    fil, piezas, total, o = [], [], 0, 0.0
    for i, (a, b, _) in enumerate(vsl_v2.g.PLANOS):
        ini = o; o += b - a
        if a in FIJOS:
            na, nb = FIJOS[a]; tempo = (nb - na) / (b - a)
            fil.append(f'[0:a]atrim={na:.3f}:{nb:.3f},asetpts=PTS-STARTPTS,atempo={tempo:.4f},'
                       f'afade=t=in:d=0.02,afade=t=out:st={b - a - 0.03:.3f}:d=0.03,adelay={int(ini * 1000)}:all=1[p{i}];')
            piezas.append(f'[p{i}]'); total = max(total, o); print(f'{a:6.2f}-{b:6.2f}  fijo {na}-{nb} tempo {tempo:.3f}'); continue
        dentro = [j for j, w in enumerate(O) if w['s'] >= a - 0.05 and w['e'] <= b + 0.05 and j in par]
        if not dentro: sys.exit(f'sin palabras alineadas en {a}-{b}')
        j0, j1 = dentro[0], dentro[-1]
        n0, n1 = N[par[j0]], N[par[j1]]
        na, nb = max(0, n0['s'] - (O[j0]['s'] - a)), n1['e'] + (b - O[j1]['e'])
        tempo = (nb - na) / (b - a)
        print(f'{a:6.2f}-{b:6.2f}  «{O[j0]["w"]} … {O[j1]["w"]}»  voz nueva {na:6.2f}-{nb:6.2f}  tempo {tempo:.3f}')
        if not 0.8 <= tempo <= 1.25: print('   ¡ojo! fuera de margen')
        fil.append(f'[0:a]atrim={na:.3f}:{nb:.3f},asetpts=PTS-STARTPTS,atempo={tempo:.4f},'
                   f'afade=t=in:d=0.02,afade=t=out:st={b - a - 0.03:.3f}:d=0.03,adelay={int(ini * 1000)}:all=1[p{i}];')
        piezas.append(f'[p{i}]'); total = max(total, o)
    fil.append(''.join(piezas) + f'amix=inputs={len(piezas)}:normalize=0:duration=longest,apad=whole_dur={total + 1}[a]')
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', voz, '-filter_complex', ''.join(fil), '-map', '[a]',
                    '-ac', '1', '-ar', '48000', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    main(*sys.argv[1:5])
