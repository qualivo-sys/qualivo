# Plantilla de vídeo «Antes / Con el sistema»

Montador de anuncios verticales (1080x1920) a partir de un JSON con escenas, textos con
tiempos y una pista de voz. Cada variante (otro gancho, otro sector, otra voz) es otro JSON.

    python3 montar.py formacion-v1.json salida.mp4

Necesita `imageio-ffmpeg` y `Pillow`, la carpeta `fonts/` con Montserrat 600/700/800 (se
descargan de Google Fonts) y `clips/` con los planos (Kling 3.0 vía Higgsfield, 9:16, 5 s,
sin pantallas legibles: el 29-sep salieron letras chinas en los móviles y se regeneraron con
el teléfono de espaldas o apagado). Los planos y la voz no van en el repo.

Escenas: `tarjeta` (color de fondo) o `plano` (vídeo recortado a 9:16, ralentizado si es más
corto que la escena). Estilos de texto: `grande` (titular; una línea que empieza por `*` va
resaltada en turquesa), `sub` / `sub-turquesa` (subtítulo con fondo), `etiqueta` /
`etiqueta-turquesa` (píldora arriba), `lista` (con check) y `boton`.

Prueba del 29-sep: voz de Raquel (ElevenLabs, con tiempos por carácter para sincronizar los
subtítulos). Maikel decidió grabarse él a cámara: el siguiente paso es un modo del montador que
tome su vídeo como pista principal y meta los planos como cortes.

## V2 «Las fugas» (29-sep-2026)
- `montar.py` ahora trae transiciones (xfade) y estilos nuevos: `hueco` (sitio para el plano a cámara), `pasos` (ANUNCIO ✓ · LEAD ✓ · RESPUESTA ✕), `fuga` (etiqueta coral), `cadena` (ANUNCIO ↓ … ↓ VENTA) y `linea` (DÍA 0 · DÍA 1 · DÍA 3).
- `v2_build.py A B` monta las dos variantes A/B con voz IA a partir de `guion-v2-lineas.txt` (una línea de voz = una escena; la B es la A sin la línea 0).
- `maikel_build.py` monta la versión con la toma de Maikel a cámara: su voz entera, su cara como plano principal e inserts de B-roll e Intelligence.
- Los clips, voces y la toma de Maikel no se suben al repo (repo público); viven en el scratchpad de la sesión.
