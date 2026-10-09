#!/usr/bin/env python3
"""Don Rodrigo · monta un episodio: clips de Kling + subtítulos grandes + doblaje de una frase + tarjeta de cierre.

   python3 montar_episodio.py cita     # out/rodrigo-cita-fantasma.mp4 (9:16, 1080x1920)

Los subtítulos y la tarjeta quedan dentro de la zona segura de reels (14 %-78 % de la altura).
"""
import os, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()
ANTON = os.path.join(AQUI, '../../anuncios/2026-09-11-v2/fuentes/anton.ttf')
LOGO = os.path.join(AQUI, '../2026-09-17-sistema/rec/logo-blanco.png')
W, H = 1080, 1920

EPISODIOS = {
 'cita': {
  'salida': 'rodrigo-cita-fantasma.mp4',
  'clips': ['clips/cita-a.mp4', 'clips/cita-b.mp4'],
  # (desde, hasta, texto) en segundos del episodio
  'subs': [(0.0, 4.2, '¡Preparad la sala! Hoy viene la primera visita.'),
           (5.0, 7.8, 'Mi señor… son las once menos diez.'),
           (8.1, 10.0, 'Vendrá. Reservó ella misma.'),
           (12.6, 15.6, '¿Hola? ¿Hola?… No lo coge.'),
           (16.1, 19.4, 'Mi señor… ni un cuervo le mandamos la víspera.')],
  # frase doblada: (archivo, desde, hasta del original que se silencia, tempo)
  'doblaje': ('voz/tomas-dani.mp3', 16.0, 19.2, 1.12),
  'cierre': 'Casi nunca es mala suerte.',
 },
}
CIERRE = 2.6

def texto_png(txt, ruta, tam=64, ancho=900, caja=True):
    f = ImageFont.truetype(ANTON, tam)
    palabras, lineas, l = txt.upper().split(), [], ''
    for p in palabras:
        prueba = (l + ' ' + p).strip()
        if f.getlength(prueba) > ancho and l: lineas.append(l); l = p
        else: l = prueba
    lineas.append(l)
    alto = int(tam * 1.12 * len(lineas)) + 40
    im = Image.new('RGBA', (W, alto), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for i, ln in enumerate(lineas):
        x = (W - f.getlength(ln)) / 2; y = 20 + i * tam * 1.12
        if caja:
            d.rounded_rectangle([x - 18, y - 6, x + f.getlength(ln) + 18, y + tam * 1.12], 14, fill=(10, 10, 11, 215))
        d.text((x, y), ln, font=f, fill=(244, 241, 235, 255))
    im.save(ruta)
    return alto

def cierre_png(txt, ruta):
    im = Image.new('RGB', (W, H), (10, 10, 11)); d = ImageDraw.Draw(im)
    f = ImageFont.truetype(ANTON, 104)
    lineas, l = [], ''
    for p in txt.upper().split():
        prueba = (l + ' ' + p).strip()
        if f.getlength(prueba) > 900 and l: lineas.append(l); l = p
        else: l = prueba
    lineas.append(l)
    y = 700
    for ln in lineas:
        d.text(((W - f.getlength(ln)) / 2, y), ln, font=f, fill=(244, 204, 56)); y += 116
    logo = Image.open(LOGO).convert('RGBA'); logo.thumbnail((420, 200))
    im.paste(logo, ((W - logo.width) // 2, y + 80), logo)
    fs = ImageFont.truetype(ANTON, 30); n = 'CONTENIDO CREADO CON IA'
    d.text(((W - fs.getlength(n)) / 2, 1440), n, font=fs, fill=(150, 150, 150))
    im.save(ruta)

def montar(clave):
    ep = EPISODIOS[clave]; tmp = os.path.join(AQUI, 'tmp'); os.makedirs(tmp, exist_ok=True)
    os.makedirs(os.path.join(AQUI, 'out'), exist_ok=True)
    cierre_png(ep['cierre'], f'{tmp}/cierre.png')
    entradas, fil = [], []
    for i, c in enumerate(ep['clips']):
        entradas += ['-i', os.path.join(AQUI, c)]
        fil.append(f'[{i}:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps=25,setsar=1[v{i}];'
                   f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo[a{i}];')
    n = len(ep['clips'])
    entradas += ['-loop', '1', '-t', str(CIERRE), '-i', f'{tmp}/cierre.png']
    fil.append(f'[{n}:v]scale={W}:{H},fps=25,setsar=1,fade=t=in:d=0.25[vc];'
               f'anullsrc=r=44100:cl=stereo,atrim=0:{CIERRE}[ac];')
    fil.append(''.join(f'[v{i}][a{i}]' for i in range(n)) + f'[vc][ac]concat=n={n + 1}:v=1:a=1[vb][ab];')
    # doblaje: se silencia el original en ese tramo y se pone la voz nueva
    dob, d0, d1, tempo = ep['doblaje']
    entradas += ['-i', os.path.join(AQUI, dob)]; k = n + 1
    fil.append(f"[ab]volume=enable='between(t,{d0},{d1})':volume=0.08[abm];"
               f'[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,atempo={tempo},volume=1.6,adelay={int(d0 * 1000)}|{int(d0 * 1000)}[dob];'
               '[abm][dob]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5[a];')
    # subtítulos
    ult = 'vb'
    for j, (a, b, t) in enumerate(ep['subs']):
        alto = texto_png(t, f'{tmp}/s{j}.png')
        entradas += ['-i', f'{tmp}/s{j}.png']; k += 1
        y = int(H * 0.76) - alto
        fil.append(f"[{ult}][{k}:v]overlay=0:{y}:enable='between(t,{a},{b})'[o{j}];"); ult = f'o{j}'
    salida = os.path.join(AQUI, 'out', ep['salida'])
    subprocess.run([FF, '-y', '-loglevel', 'error', *entradas, '-filter_complex', ''.join(fil).rstrip(';'),
                    '-map', f'[{ult}]', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19',
                    '-c:a', 'aac', '-b:a', '192k', salida], check=True)
    print('ok', salida)

if __name__ == '__main__':
    montar(sys.argv[1])
