#!/usr/bin/env python3
"""Montador de la plantilla de vídeo «Antes / Con el sistema» de Qualivo.

Lee un JSON con las escenas (planos de vídeo o tarjetas de color), los textos
con sus tiempos y la voz, y saca un MP4 vertical 1080x1920. Cada variante nueva
es otro JSON: se cambian los huecos (gancho, sector, contacto, planos, voz) y
se vuelve a montar.

    python3 montar.py variante.json salida.mp4
"""
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H, FPS = 1080, 1920, 30
AQUI = os.path.dirname(os.path.abspath(__file__))

COL = {
    'tinta': (16, 19, 25), 'blanco': (255, 255, 255), 'turquesa': (39, 189, 177),
    'gris': (90, 94, 102), 'grisclaro': (242, 243, 245), 'turquesa-oscuro': (31, 158, 148),
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
            for ln in partir(b['texto'], f, W - 160):
                if ln.startswith('*'):
                    ln = ln[1:]; w = f.getlength(ln); x = (W - w) / 2
                    d.rounded_rectangle([x - 18, y - 6, x + w + 18, y + 118], radius=10, fill=COL['turquesa'])
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
            d.rounded_rectangle([x - 50, y, x + w + 50, y + 110], radius=55, fill=COL['tinta'])
            d.text((x, y + 26), b['texto'], font=f, fill=COL['blanco'])
    return im

def run(args):
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + args, check=True)

def escena(e, dur, tmp, n):
    """Devuelve la ruta de un mp4 sin audio de duración dur."""
    capas = []
    for i, t in enumerate(e.get('textos', [])):
        p = os.path.join(tmp, 'c%d_%d.png' % (n, i)); capa(t['bloques']).save(p)
        capas.append((p, t.get('desde', 0), t.get('hasta', dur)))
    salida = os.path.join(tmp, 'e%02d.mp4' % n)
    if e['tipo'] == 'plano':
        src = os.path.join(AQUI, e['src'])
        info = subprocess.run([FF, '-i', src], capture_output=True, text=True).stderr
        import re
        m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', info)
        dsrc = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
        velocidad = max(1.0, dur / dsrc)  # si el plano es corto, se ralentiza
        base = ('[0:v]setpts=%.4f*PTS,scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,fps=%d,'
                'eq=brightness=%.2f:saturation=%.2f,trim=duration=%.3f,setpts=PTS-STARTPTS[v0]'
                % (velocidad, W, H, W, H, FPS, e.get('brillo', -0.06), e.get('saturacion', 0.9), dur))
        entradas = ['-i', src]
    else:
        base = '[0:v]fps=%d,trim=duration=%.3f,setpts=PTS-STARTPTS[v0]' % (FPS, dur)
        entradas = ['-f', 'lavfi', '-i', 'color=c=%s:s=%dx%d:d=%.3f' % (e.get('fondo', '#101319'), W, H, dur)]
    filtro, ult = [base], 'v0'
    for i, (p, a, b) in enumerate(capas):
        entradas += ['-loop', '1', '-t', '%.3f' % dur, '-i', p]
        filtro.append("[%s][%d:v]overlay=0:0:enable='between(t,%.3f,%.3f)'[v%d]" % (ult, i + 1, a, b, i + 1))
        ult = 'v%d' % (i + 1)
    run(entradas + ['-filter_complex', ';'.join(filtro), '-map', '[%s]' % ult, '-t', '%.3f' % dur,
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20', salida])
    return salida

def montar(spec_path, salida):
    spec = json.load(open(spec_path))
    tmp = tempfile.mkdtemp(prefix='plantilla-')
    partes = []
    esc = spec['escenas']
    for n, e in enumerate(esc):
        fin = esc[n + 1]['inicio'] if n + 1 < len(esc) else spec['duracion']
        partes.append(escena(e, fin - e['inicio'], tmp, n))
    lista = os.path.join(tmp, 'lista.txt')
    open(lista, 'w').write(''.join("file '%s'\n" % p for p in partes))
    run(['-f', 'concat', '-safe', '0', '-i', lista, '-i', os.path.join(AQUI, spec['voz']),
         '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
         '-t', '%.3f' % spec['duracion'], '-movflags', '+faststart', salida])
    print('ok', salida)

if __name__ == '__main__':
    montar(sys.argv[1], sys.argv[2])
