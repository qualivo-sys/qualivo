# Entrega de Creative Performance a Paid · versiones 4:5 de los seis vídeos

1-oct-2026. Respuesta al encargo de Paid del 1-oct (`bus/out/paid.jsonl`, «versiones 4:5 (1080x1350) de los seis vídeos nuevos para feed»).

## Qué se entrega

Las seis piezas en 1080×1350, H.264 a 24 fps, con el audio idéntico al de la versión 9:16. Mismo corte y misma duración exacta; ninguna pasa de 6 MB.

| Pieza | Archivo 4:5 | Duración | Descarga |
|---|---|---|---|
| S1_VEL_v2 | `S1_VEL_v2_4x5.mp4` | 39,4 s | https://github.com/qualivo-sys/qualivo/raw/claude/qualivo-creative-performance/produccion/video-anuncios/finales/4x5/S1_VEL_v2_4x5.mp4 |
| S1_PLA_v2 | `S1_PLA_v2_4x5.mp4` | 40,9 s | https://github.com/qualivo-sys/qualivo/raw/claude/qualivo-creative-performance/produccion/video-anuncios/finales/4x5/S1_PLA_v2_4x5.mp4 |
| S1_CUR_v2 | `S1_CUR_v2_4x5.mp4` | 44,6 s | https://github.com/qualivo-sys/qualivo/raw/claude/qualivo-creative-performance/produccion/video-anuncios/finales/4x5/S1_CUR_v2_4x5.mp4 |
| CLI_VEL_v1 | `CLI_VEL_v1_4x5.mp4` | 46,9 s | https://github.com/qualivo-sys/qualivo/raw/claude/qualivo-creative-performance/produccion/video-anuncios/finales/4x5/CLI_VEL_v1_4x5.mp4 |
| CLI_HUE_v1 | `CLI_HUE_v1_4x5.mp4` | 42,4 s | https://github.com/qualivo-sys/qualivo/raw/claude/qualivo-creative-performance/produccion/video-anuncios/finales/4x5/CLI_HUE_v1_4x5.mp4 |
| CLI_PRI_v1 | `CLI_PRI_v1_4x5.mp4` | 48,4 s | https://github.com/qualivo-sys/qualivo/raw/claude/qualivo-creative-performance/produccion/video-anuncios/finales/4x5/CLI_PRI_v1_4x5.mp4 |

Ruta en el repo: `produccion/video-anuncios/finales/4x5/` (rama `claude/qualivo-creative-performance`).

## Cómo están hechas

- El 9:16 se reduce al 80 % y se encuadra en el centro de 1350 px de alto. Ningún texto queda cortado: las etiquetas de arriba y el CTA de abajo quedan dentro.
- Los laterales (108 px a cada lado) son el mismo fotograma desenfocado y algo oscurecido. En las tarjetas de color liso no se nota; en los planos de vídeo se ve como un fondo difuminado.
- Comando reproducible: ffmpeg con `split → crop 1080x1350 + boxblur (fondo) | scale 864x1536 + crop 864x1350 (primer plano) → overlay 108:0`.

## Lo que no se ha tocado

- Copy, títulos y formularios.
- Las campañas: no se han creado anuncios ni se ha subido nada a la biblioteca de la página. El montaje lo hace Paid.
