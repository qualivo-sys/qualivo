# VSL Qualivo · versión final (13-oct) · cómo generarla

Montaje aprobado por Maikel el 13-oct: 5:38, grabación del 12-oct en 4K (export de Filmora con su color),
viñeta suave, subtítulos corregidos. Este repo es público: el bruto NO está aquí (está en el Drive de Maikel;
el ID se pasa por mensaje, no se escribe en el repo).

## Qué hay en esta carpeta
- `palabras.json`: transcripción con tiempos por palabra del bruto 4K (faster-whisper medium). Las escenas y
  los cortes salen de aquí.
- `silencios.txt`: pausas detectadas en el bruto (silencedetect −35 dB, 0,3 s).
- `portada.jpg`: fotograma para la portada del vídeo (1920x1080).

## Cómo sacar el vídeo
Requisitos: Python 3 con `imageio-ffmpeg`, `numpy`, `Pillow`; Node con `playwright` y Chromium en
`/opt/pw-browsers/chromium` (los entornos de Claude Code ya lo traen).

```bash
T=/tmp/vsl && mkdir -p $T
# 1) bruto 4K de Drive como $T/bruto2.mp4 (3,3 GB, «Filmora VSL.mp4»)
cp content/video/2026-10-09-vsl/grabacion-12oct/palabras.json $T/pal.json
cp content/video/2026-10-09-vsl/grabacion-12oct/silencios.txt $T/silencios.txt
# 2) montaje (1080p; añade SALIDA=4k para el máster en 4K, tarda el doble)
python3 - <<'PY'
import json, sys, threading
sys.path.insert(0, 'content/video/2026-10-09-vsl'); import vsl_plantilla as v
W = '/tmp/vsl'; B = f'{W}/bruto2.mp4'
planos, total, apoyos = v.construir(json.load(open(f'{W}/pal.json')), B, W)
t = threading.Thread(target=v.capas, args=(W, total)); t.start()
v.base(B, W, planos, total, apoyos); t.join(); v.final(W, total)
PY
# resultado: /tmp/vsl/VSL_Qualivo_plantilla.mp4 (5:38, 30 fps, AAC)
```
Comprobación rápida: duración 5:38,2 y 10.146 fotogramas. Opcional: `revisa_cortes.py` debe dar «cortos 0».

## Versión para la web
```bash
ffmpeg -i VSL_Qualivo_plantilla.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -crf 21 -preset slow \
  -maxrate 6M -bufsize 12M -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart VSL_Qualivo_1080p_web.mp4
```
≈ 106 MB. Mejor alojarlo en una plataforma de vídeo (YouTube oculto, Vimeo o Bunny) y embeberlo que servirlo
desde la propia landing.

## Pendiente antes de publicar
- URL del botón final («Reserva una sesión de diagnóstico»).
- Ok de Maikel/Growth para enseñar Intelligence con «Datos simulados» en una página pública.
