# Producción de vídeo · anuncios de septiembre (material para editar)

Todo lo que se usó para montar los anuncios del 29 y 30 de septiembre, con la misma estructura de
carpetas con la que se montaron. Los scripts funcionan desde esta carpeta:
`cd produccion/video-anuncios`.

> ⚠️ Los MP4 de `finales/anuncios-30sep/` llevan promesas que el sistema no cumple
> («también de noche», «quien falta recibe esa misma mañana una hora nueva»). **No se suben a Meta.**
> Están aquí solo como referencia de estilo, ritmo y montaje.

## Qué hay

| Carpeta o archivo | Qué es |
|---|---|
| `montar.py` | El montador. Recibe un JSON de escenas y saca el MP4 a 1080×1920 y 24 fps. Monta planos (`marco` con zoom suave), tarjetas de texto por capas y estilos de interfaz (chat, agenda, pasos, medidor, pregunta, fuga, cadena, línea, hueco). Mezcla la música con compresión lateral bajo la voz. Los textos nuevos entran con fundido y deslizamiento; los que sustituyen a otro, en seco, para que no parpadeen. |
| `anuncios3_build.py` | Montador de los 3 anuncios del 30-sep (velocidad, plantones y curiosos). En `ANUNCIOS_DEF`, cada anuncio define: las primeras palabras de cada frase (así encuentra dónde empieza en la locución), las pausas y las escenas. Las escenas se atan al inicio de cada frase y las pausas se meten en el silencio real, nunca a mitad de palabra. Uso: `python3 anuncios3_build.py velocidad:b plantones:c curiosos:b` (anuncio:toma). Variables: `MUSICA=ruta` y `OUT=carpeta`. |
| `anuncios_s1_build.py` | Test de dolor de la semana 1 (octubre): Velocidad, Plantones y Curiosos **v2**, con las promesas corregidas y un CTA común. Solo usa planos que ya existen en `clips/`. Voces en `voz-s1/<vel\|pla\|cur>-<toma>.mp3` + `.json`; se monta con `python3 anuncios_s1_build.py vel:a pla:a cur:a`. Sin voz, `MAQUETA=1 python3 anuncios_s1_build.py vel pla cur` saca una maqueta muda a 3,5 palabras/s. Tomas buenas (30-sep): **vel b, pla b, cur b** (`cur-a` se come una frase). Whisper escribe los números en cifras y «lead» como «lid»: en los `.json` se han pasado a palabras («diez», «cinco»…) para que casen los inicios. Música por defecto: la A. Salida en `out-s1/` (no se sube al repo). Guiones en `content/agentes/creative-performance/2026-10-s1-test-creativo.md`. |
| `v3_build.py` · `v2_build.py` | Montador de «Las fugas» V2: la locución en una sola toma (`voz-v3/`) y las escenas de `v2_build.escenas_de()`. |
| `maikel_build.py` | Versión 03 de «Las fugas» con Maikel a cámara. **Necesita `maikel/`** (su grabación en crudo), que no está aquí porque el repo es público. Si hace falta, pídesela a Maikel. |
| `clips/` | Planos de vídeo. En `kling-tira.jpg` tienes una hoja de contactos. |
| `voz-ads/` | Locuciones de los 3 anuncios. `<anuncio>-<toma>.mp3` son las tomas en bruto, `.json` su transcripción por palabras y `-final.mp3` la versión montada con pausas. Tomas usadas: velocidad **b**, plantones **c** y curiosos **b**. |
| `voz-v3/` | Locución de «Las fugas» V2 (t0 y t1) con su transcripción. |
| `musica3/2-deephouse-norm.mp3` | La música de ahora (deep house), normalizada a −27 LUFS. |
| `musica4/*-norm.mp3` | Alternativas (A electrónica minimalista, B lo-fi, C afro house), normalizadas igual y en bucle a 90 s. La B dura 43 s de origen: el empalme puede notarse. |
| `finales/` | Los MP4 montados. `anuncios-30sep/`: los 3 anuncios (no subir). `fugas-v2/`: gancho del anuncio, gancho de Laura y la versión de Maikel. `opciones-musica/`: plantones con A, B y C. |
| `fonts/` · `marco.png` | Montserrat 600/700/800 y el marco de móvil para los planos. |

**Los planos de `clips/`:**
- `k1`: móvil de noche.
- `k2`: chica en el sofá.
- `k3`: hombre esperando.
- `k4`: mujer al teléfono.
- `k5`: hombre frustrado.
- `k6`: aula.
- `0`-`7`: los planos de «Las fugas» V2.
- `intel*`: grabaciones de pantalla de la demo de Intelligence (datos de ejemplo).

Todos los de Kling son 9:16, de 5 s y a 24 fps.

## Cómo se hizo (para repetirlo)

**Requisitos:** python3 con `numpy`, `Pillow`, `imageio_ffmpeg` y `faster-whisper`. Usa el ffmpeg de `imageio_ffmpeg`.

1. **Voz (Higgsfield, voz clonada «Javier»):** generación de audio con `seed_audio` y la referencia de la voz de Javier. El ID del medio de referencia es `aba29c8d-8eec-4d98-bcee-16478e46a94a`.
   - **Todo el guion en una sola toma**, no frase a frase: así no hay cortes de tono entre frases.
   - Haz 2-3 tomas y quédate con la limpia. A veces mete sílabas inventadas: la toma «a» de curiosos salió con basura.
2. **Transcripción por palabras** con faster-whisper (modelo `small`, `word_timestamps=True`). Se guarda como `voz-ads/<anuncio>-<toma>.json`, con una lista de palabras `{w, s, e}`.
   - Whisper escribe «cualivo» en vez de «Qualivo»: en `inicios` se busca así.
3. **Montaje:** `anuncios3_build.py` busca dónde empieza cada frase y mete las pausas en el silencio real (el punto de menos energía entre palabras). Aplica `atempo` 0,96 (o 0,94 en «Las fugas») y monta.
4. **Planos (Kling 3.0 en Higgsfield):** 9:16, 5 s, sin pantallas legibles, sin caras reconocibles, sin texto en la imagen y ambiente español. Los prompts exactos de septiembre no se guardaron; las descripciones de arriba sirven de referencia.
5. **Música:** catálogo de HeyGen (`search_audio_sounds`), normalizada a −27 LUFS. **La licencia está sin comprobar**: hay que confirmarla antes de pagar anuncios con ella.

## Lo que se aprendió montando (no repetir)

- A 30 fps los planos de Kling (24 fps) duplicaban fotogramas y daban tirones: todo va a 24 fps.
- `zoompan` de ffmpeg tiembla: el zoom se hace con escala y recorte por fotograma.
- Si un texto sustituye a otro y entra con fundido, parpadea: los que sustituyen entran en seco.
- Si se corta la locución justo al inicio que da Whisper, se come la primera sílaba («entras tú» se tropezaba): se corta en el silencio real de antes.
