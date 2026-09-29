#!/usr/bin/env python3
"""Montador de la plantilla de vídeo «Antes / Con el sistema» de Qualivo.

Lee un JSON con las escenas (planos de vídeo o tarjetas de color), los textos
con sus tiempos, la voz y opcionalmente una música, y saca un MP4 vertical
1080x1920. Cada variante nueva es otro JSON.

    python3 montar.py variante.json salida.mp4

Escena: { inicio, tipo: plano|tarjeta, src|fondo, textos: [{desde, hasta, bloques}],
          transicion: { tipo, dur } }   # cómo se pasa a la escena siguiente
Tipos de transición (xfade de ffmpeg): fade, fadeblack, fadegrays, wipeleft, wipeup,
smoothleft, smoothup, circleopen, dissolve… Sin «transicion», corte seco.
Las tarjetas llevan un zoom lento para que no queden como una foto fija.
"""
import json, os, re, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H, FPS = 1080, 1920, 30
AQUI = os.path.dirname(os.path.abspath(__file__))

COL = {
    'tinta': (16, 19, 25), 'blanco': (255, 255, 255), 'turquesa': (39, 189, 177),
    'gris': (120, 125, 134), 'coral': (226, 84, 74), 'grisclaro': (242, 243, 245), 'turquesa-oscuro': (31, 158, 148),
}

def fuente(peso, tam):
    return ImageFont.truetype(os.path.join(AQUI, 'fonts', 'Montserrat-%d.ttf' % peso), tam)

def partir(texto, f, ancho):
    palabras, lineas, actual = texto.split(), [], ''
    for p in palabras:
        prueba = (actual + ' ' + p).strip()
        if f.getlength(prueba) <= ancho: actual = prueba
        else:
            if actual: lineas.append(actual)
            actual = p
    if actual: lineas.append(actual)
    return lineas

def capa(bloques):
    """Una capa transparente con bloques de texto. Cada bloque:
    {texto, estilo: sub|sub-turquesa|grande|etiqueta|etiqueta-turquesa|lista|boton, y (px), color?}"""
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for b in bloques:
        est, y = b.get('estilo', 'sub'), b.get('y', 1100)
        if est in ('sub', 'sub-turquesa'):
            f = fuente(800, b.get('tam', 62)); fondo = COL['turquesa'] if est == 'sub-turquesa' else COL['blanco']
            for ln in partir(b['texto'], f, W - 200):
                w = f.getlength(ln); x = (W - w) / 2
                d.rounded_rectangle([x - 22, y - 12, x + w + 22, y + 78], radius=10, fill=fondo)
                d.text((x, y), ln, font=f, fill=COL['tinta']); y += 100
        elif est == 'grande':
            f = fuente(800, b.get('tam', 96)); color = COL[b.get('color', 'blanco')]
            todo = b['texto'].startswith('*'); texto = b['texto'][1:] if todo else b['texto']
            for ln in partir(texto, f, W - 200):
                if todo or ln.startswith('*'):
                    ln = ln.lstrip('*'); w = f.getlength(ln); x = (W - w) / 2
                    d.rounded_rectangle([x - 18, y - 6, x + w + 18, y + int(b.get('tam', 96) * 1.2)], radius=10, fill=COL['turquesa'])
                    d.text((x, y), ln, font=f, fill=COL['tinta'])
                else:
                    w = f.getlength(ln); d.text(((W - w) / 2, y), ln, font=f, fill=color)
                y += int(b.get('tam', 96) * 1.25)
        elif est in ('etiqueta', 'etiqueta-turquesa'):
            f = fuente(800, 46); t = b['texto'].upper(); w = f.getlength(t)
            fondo = COL['turquesa'] if est == 'etiqueta-turquesa' else COL['tinta']
            tinta = COL['tinta'] if est == 'etiqueta-turquesa' else COL['blanco']
            d.rounded_rectangle([70, y, 70 + w + 64, y + 86], radius=43, fill=fondo)
            d.text((102, y + 18), t, font=f, fill=tinta)
        elif est == 'lista':
            f = fuente(700, 54)
            for ln in partir(b['texto'], f, W - 300):
                d.text((200, y), ln, font=f, fill=COL[b.get('color', 'blanco')]); y += 70
            if b.get('check'):
                cy = b['y'] + 28
                d.ellipse([100, cy - 30, 160, cy + 30], fill=COL['turquesa'])
                d.line([(114, cy), (126, cy + 13), (147, cy - 12)], fill=COL['tinta'], width=8)
        elif est == 'boton':
            f = fuente(700, 50); w = f.getlength(b['texto']); x = (W - w) / 2
            fondo = COL[b.get('color', 'tinta')]; tinta = COL['tinta'] if fondo != COL['tinta'] else COL['blanco']
            d.rounded_rectangle([x - 50, y, x + w + 50, y + 110], radius=55, fill=fondo)
            d.text((x, y + 26), b['texto'], font=f, fill=tinta)
        elif est == 'hueco':
            # Hueco para el plano de Maikel a cámara: marco discontinuo + rótulo. Se sustituye en edición.
            alto = b.get('alto', 900); x0, x1 = 90, W - 90
            for (ax, ay, bx, by) in [(x0, y, x1, y), (x0, y + alto, x1, y + alto), (x0, y, x0, y + alto), (x1, y, x1, y + alto)]:
                largo = (bx - ax) if by == ay else (by - ay); n = int(largo / 36)
                for k in range(n):
                    if k % 2: continue
                    if by == ay: d.line([(ax + k * 36, ay), (ax + (k + 1) * 36, ay)], fill=COL['gris'], width=6)
                    else: d.line([(ax, ay + k * 36), (ax, ay + (k + 1) * 36)], fill=COL['gris'], width=6)
            f = fuente(700, 38); t = b.get('texto', 'PLANO A CÁMARA').upper(); w = f.getlength(t)
            d.text(((W - w) / 2, y + alto / 2 - 24), t, font=f, fill=COL['gris'])
            if b.get('nota'):
                f2 = fuente(600, 32); yy = y + alto / 2 + 40
                for ln in partir(b['nota'], f2, W - 320):
                    w2 = f2.getlength(ln); d.text(((W - w2) / 2, yy), ln, font=f2, fill=COL['gris']); yy += 44
        elif est == 'pasos':
            # Línea del recorrido: ANUNCIO ✓ – LEAD ✓ – RESPUESTA ✕
            tam = b.get('tam', 34); items = b['pasos']
            while True:
                f = fuente(700, tam); r = int(tam * 0.55); sep = int(tam * 0.7); alto = int(tam * 2.1)
                anchos = [20 + f.getlength(t) + 12 + 2 * r + 14 for t, _ in items]
                total = sum(anchos) + sep * (len(items) - 1)
                if total <= W - 90 or tam <= 20: break
                tam -= 1
            x = (W - total) / 2
            for n, ((t, ok), an) in enumerate(zip(items, anchos)):
                d.rounded_rectangle([x, y, x + an, y + alto], radius=alto // 2, fill=(16, 19, 25, 225))
                d.text((x + 20, y + alto / 2 - tam * 0.62), t, font=f, fill=COL['blanco'])
                cx, cy = x + an - 14 - r, y + alto / 2
                if ok == 'ok':
                    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=COL['turquesa'])
                    d.line([(cx - r * .5, cy), (cx - r * .12, cy + r * .42), (cx + r * .55, cy - r * .42)], fill=COL['tinta'], width=max(3, r // 4))
                elif ok == 'ko':
                    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=COL['coral'])
                    k = r * .42
                    d.line([(cx - k, cy - k), (cx + k, cy + k)], fill=COL['blanco'], width=max(3, r // 4))
                    d.line([(cx - k, cy + k), (cx + k, cy - k)], fill=COL['blanco'], width=max(3, r // 4))
                else:
                    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=COL['gris'], width=3)
                x += an
                if n < len(items) - 1:
                    d.line([(x + 5, y + alto / 2), (x + sep - 5, y + alto / 2)], fill=COL['blanco'], width=3); x += sep
        elif est == 'pregunta':
            # Tarjeta de pregunta del formulario con la respuesta marcada
            x0, x1 = 90, W - 90; alto = b.get('alto', 200)
            d.rounded_rectangle([x0, y, x1, y + alto], radius=26, fill=COL['blanco'])
            fq = fuente(700, b.get('tam', 42)); d.text((x0 + 40, y + 30), b['texto'], font=fq, fill=COL['tinta'])
            fa = fuente(800, 40); t = b['respuesta']; wa = fa.getlength(t); ya = y + alto - 92
            d.rounded_rectangle([x0 + 40, ya, x0 + 40 + 64 + wa + 34, ya + 64], radius=32, fill=COL['turquesa'])
            cx, cy = x0 + 40 + 34, ya + 32
            d.line([(cx - 12, cy), (cx - 3, cy + 10), (cx + 13, cy - 10)], fill=COL['tinta'], width=6)
            d.text((x0 + 40 + 64, ya + 10), t, font=fa, fill=COL['tinta'])
            if b.get('senal'):
                fs = fuente(700, 32); ts = b['senal']; ws = fs.getlength(ts)
                d.text((x1 - 40 - ws, ya + 16), ts, font=fs, fill=COL['turquesa-oscuro'])
        elif est == 'medidor':
            # Barra de intención: etiqueta, valor y relleno
            x0, x1 = 90, W - 90; f = fuente(800, 40)
            d.text((x0, y), b['texto'].upper(), font=f, fill=COL['blanco'])
            v = b.get('valor', ''); wv = f.getlength(v); d.text((x1 - wv, y), v, font=f, fill=COL['turquesa'])
            d.rounded_rectangle([x0, y + 70, x1, y + 110], radius=20, fill=(60, 64, 72))
            fr = max(0.04, min(1.0, b.get('fraccion', 0.5)))
            d.rounded_rectangle([x0, y + 70, x0 + (x1 - x0) * fr, y + 110], radius=20, fill=COL['turquesa'])
        elif est == 'fuga':
            # Etiqueta grande centrada: FUGA #1 · SIN SEGUIMIENTO
            f = fuente(800, b.get('tam', 50)); t = b['texto'].upper(); w = f.getlength(t)
            x = (W - w) / 2; fondo = COL[b.get('color', 'coral')]
            d.rounded_rectangle([x - 40, y, x + w + 40, y + 104], radius=18, fill=fondo)
            d.text((x, y + 22), t, font=f, fill=COL['blanco'] if b.get('color', 'coral') == 'coral' else COL['tinta'])
        elif est == 'cadena':
            # Cadena vertical ANUNCIO ↓ LEAD ↓ … ↓ VENTA
            f = fuente(800, b.get('tam', 60)); paso = b.get('paso', 128); color = COL[b.get('color', 'blanco')]
            marcados = set(b.get('marcar', [])); apagados = set(b.get('apagar', []))
            for i, t in enumerate(b['items']):
                w = f.getlength(t); x = (W - w) / 2; yy = y + i * paso
                if i in marcados:
                    d.rounded_rectangle([x - 22, yy - 8, x + w + 22, yy + int(b.get('tam', 60) * 1.25)], radius=12, fill=COL['turquesa'])
                    d.text((x, yy), t, font=f, fill=COL['tinta'])
                else:
                    d.text((x, yy), t, font=f, fill=COL['gris'] if i in apagados else color)
                if i < len(b['items']) - 1:
                    ay = yy + int(b.get('tam', 60) * 1.25) + 12; cx = W / 2
                    d.line([(cx, ay), (cx, ay + 28)], fill=COL['gris'], width=5)
                    d.polygon([(cx - 11, ay + 24), (cx + 11, ay + 24), (cx, ay + 40)], fill=COL['gris'])
        elif est == 'linea':
            # Fila de hitos: DÍA 0 · WhatsApp   DÍA 1 · Llamada   DÍA 3 · WhatsApp
            f1 = fuente(800, 34); f2 = fuente(600, 34); items = b['items']; n = len(items)
            ancho = (W - 160) / n; hechos = set(b.get('hechos', range(n)))
            d.line([(80 + ancho / 2, y + 30), (W - 80 - ancho / 2, y + 30)], fill=COL['gris'], width=4)
            for i, (a, c) in enumerate(items):
                cx = 80 + ancho * i + ancho / 2
                d.ellipse([cx - 22, y + 8, cx + 22, y + 52], fill=COL['turquesa'] if i in hechos else COL['gris'])
                if i in hechos: d.line([(cx - 10, y + 30), (cx - 3, y + 38), (cx + 11, y + 22)], fill=COL['tinta'], width=5)
                w1 = f1.getlength(a); d.text((cx - w1 / 2, y + 74), a, font=f1, fill=COL['blanco'])
                w2 = f2.getlength(c); d.text((cx - w2 / 2, y + 122), c, font=f2, fill=COL['grisclaro'])
    return im

def run(args):
    r = subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + args, capture_output=True, text=True)
    if r.returncode: raise RuntimeError('ffmpeg: ' + r.stderr[-1500:])

def duracion_de(src):
    info = subprocess.run([FF, '-i', src], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', info)
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

def escena(e, dur, tmp, n):
    """Devuelve la ruta de un mp4 sin audio de duración dur (ya incluye la cola de transición)."""
    capas = []
    for i, t in enumerate(e.get('textos', [])):
        p = os.path.join(tmp, 'c%d_%d.png' % (n, i)); capa(t['bloques']).save(p)
        capas.append((p, t.get('desde', 0), t.get('hasta', dur)))
    salida = os.path.join(tmp, 'e%02d.mp4' % n)
    if e['tipo'] == 'plano':
        src = os.path.join(AQUI, e['src'])
        desde = float(e.get('desde', 0))
        velocidad = max(1.0, dur / (duracion_de(src) - desde))  # si el plano es corto, se ralentiza
        if e.get('marco'):
            # Grabación de pantalla: la app dentro de un marco con esquinas redondeadas sobre fondo tinta.
            fo = e.get('foco')
            if fo:
                # Zoom lento hacia lo que cuenta la voz (coordenadas de la grabación 720x1280).
                k0, k1, cx, cy = fo.get('k0', 1.0), fo['k'], fo['cx'], fo['cy']
                u = 'min(t/%.3f,1)' % dur
                K = '(%.4f+%.4f*(3*pow(%s,2)-2*pow(%s,3)))' % (k0, k1 - k0, u, u)
                zoom = ("scale=720:1280,fps=%d,scale=w='trunc(960*%s/2)*2':h='trunc(1706*%s/2)*2':eval=frame:flags=bicubic,"
                        "crop=960:1706:x='max(0,min(960*%s-960,%.1f*1.33333*%s-480))':y='max(0,min(1706*%s-1706,%.1f*1.33333*%s-853))'"
                        % (FPS, K, K, K, cx, K, K, cy, K))
            else:
                zoom = 'scale=960:1706:force_original_aspect_ratio=increase,crop=960:1706,fps=%d' % FPS
            base = ('[0:v]setpts=%.4f*PTS,%s,'
                    'pad=%d:%d:60:107:#101319,trim=duration=%.3f,setpts=PTS-STARTPTS[v00];'
                    "[v00][%d:v]overlay=0:0[v0]" % (velocidad, zoom, W, H, dur, 99))
            entradas = ['-ss', '%.3f' % desde, '-i', src]
        else:
            base = ('[0:v]setpts=%.4f*PTS,scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,fps=%d,'
                    'eq=brightness=%.2f:saturation=%.2f,trim=duration=%.3f,setpts=PTS-STARTPTS[v0]'
                    % (velocidad, W, H, W, H, FPS, e.get('brillo', -0.06), e.get('saturacion', 0.9), dur))
            entradas = ['-ss', '%.3f' % desde, '-i', src]
    else:
        base = '[0:v]fps=%d,trim=duration=%.3f,setpts=PTS-STARTPTS[v0]' % (FPS, dur)
        entradas = ['-f', 'lavfi', '-i', 'color=c=%s:s=%dx%d:d=%.3f' % (e.get('fondo', '#101319'), W, H, dur)]
    filtro, ult = [base], 'v0'
    for i, (p, a, b) in enumerate(capas):
        entradas += ['-loop', '1', '-t', '%.3f' % dur, '-i', p]
        filtro.append("[%d:v]format=rgba,fade=t=in:st=%.3f:d=0.18:alpha=1[t%d]" % (i + 1, a, i + 1))
        filtro.append("[%s][t%d]overlay=x=0:y='if(lt(t,%.3f),26*(1-max(t-%.3f,0)/0.22),0)':enable='between(t,%.3f,%.3f)'[v%d]"
                      % (ult, i + 1, a + 0.22, a, a, b, i + 1))
        ult = 'v%d' % (i + 1)
    if e.get('marco'):
        entradas += ['-loop', '1', '-t', '%.3f' % dur, '-i', os.path.join(AQUI, 'marco.png')]
        filtro[0] = filtro[0].replace('[%d:v]overlay' % 99, '[%d:v]overlay' % (len(capas) + 1))
    if e['tipo'] == 'tarjeta' and e.get('zoom', True):
        # Zoom lento (5 % a lo largo de la escena) para que la tarjeta respire.
        N = int(dur * FPS)
        filtro.append("[%s]zoompan=z='1+0.05*on/%d':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=%dx%d:fps=%d[vz]" % (ult, N, W, H, FPS))
        ult = 'vz'
    # Misma cadencia y misma base de tiempos en todas las escenas: xfade lo exige.
    filtro.append('[%s]fps=%d,settb=AVTB,format=yuv420p[vf]' % (ult, FPS))
    run(entradas + ['-filter_complex', ';'.join(filtro), '-map', '[vf]', '-t', '%.3f' % dur, '-r', str(FPS),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20', salida])
    return salida

def montar(spec_path, salida):
    spec = json.load(open(spec_path))
    tmp = tempfile.mkdtemp(prefix='plantilla-')
    esc = spec['escenas']
    partes, duras, trans = [], [], []
    for n, e in enumerate(esc):
        fin = esc[n + 1]['inicio'] if n + 1 < len(esc) else spec['duracion']
        dur = fin - e['inicio']
        tr = e.get('transicion') if n + 1 < len(esc) else None
        cola = tr['dur'] if tr else 0.0
        partes.append(escena(e, dur + cola, tmp, n)); duras.append(dur); trans.append(tr)
    # Cadena de transiciones: cada escena lleva cola de T segundos y la siguiente empieza
    # en su frontera, así los textos siguen sincronizados con la voz.
    entradas = []
    for p in partes: entradas += ['-i', p]
    filtro, ult, acum = [], 'i0', 0.0
    for n in range(len(partes)): filtro.append('[%d:v]settb=AVTB,fps=%d[i%d]' % (n, FPS, n))
    for n in range(len(partes) - 1):
        acum += duras[n]; tr = trans[n]
        if tr:
            filtro.append('[%s][i%d]xfade=transition=%s:duration=%.3f:offset=%.3f[x%d]' % (ult, n + 1, tr['tipo'], tr['dur'], acum, n + 1))
        else:
            filtro.append('[%s][i%d]concat=n=2:v=1:a=0,settb=AVTB,fps=%d[x%d]' % (ult, n + 1, FPS, n + 1))
        ult = 'x%d' % (n + 1)
    filtro.append('[%s]format=yuv420p[vout]' % ult)
    # Audio: voz + música por debajo, que baja sola cuando habla la voz.
    iv = len(partes); entradas += ['-i', os.path.join(AQUI, spec['voz'])]
    if spec.get('musica'):
        im = iv + 1; entradas += ['-stream_loop', '-1', '-i', os.path.join(AQUI, spec['musica'])]
        vol = spec.get('musica_volumen', 0.16); fin = spec['duracion']
        filtro.append('[%d:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=%.2f,afade=t=in:d=1.5,afade=t=out:st=%.2f:d=2.5[m0]' % (im, vol, fin - 2.5))
        filtro.append('[%d:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit[va][vb]' % iv)
        filtro.append('[m0][vb]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=500[md]')
        filtro.append('[va][md]amix=inputs=2:duration=first:normalize=0,apad=pad_dur=3[aout]')
    else:
        filtro.append('[%d:a]apad=pad_dur=3[aout]' % iv)
    run(entradas + ['-filter_complex', ';'.join(filtro), '-map', '[vout]', '-map', '[aout]',
                    '-t', '%.3f' % spec['duracion'], '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '19',
                    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', salida])
    print('ok', salida)

if __name__ == '__main__':
    montar(sys.argv[1], sys.argv[2])
