# Carrusel «Domingo, 22:40» · velocidad de respuesta (30 sep 2026)

Nueve láminas 1080 × 1350 para centros de formación y academias que ya invierten en anuncios. P1 VELOCIDAD: te piden información un domingo por la noche y contestas el lunes.

- Molde: `content/guia-carruseles.md` (barra de progreso, numeración, «Pasa →», firma @maikel.echevarria y QUALIVO.IO, sin rótulos encima del titular, cuerpo a 38 px, una idea por lámina).
- Estética tinta (fondo oscuro), pantallas de WhatsApp, rejilla semanal y dato de Harvard Business Review con su fuente en la lámina.
- Sin resultados de clientes (regla editorial del 12-ago en `content/growth-os.md`). Toda pantalla o cifra ilustrativa lleva la etiqueta «Ejemplo».
- La IA aparece solo como mecanismo, en la lámina 8. CTA único: diagnóstico gratuito de 30 minutos, «Escríbeme DIAGNÓSTICO por privado».
- Pie de foto: `caption.md`. Guiones de vídeo y anuncios del mismo dolor: `content/guiones/2026-09-30-guiones-maikel.md`.

**NO PUBLICAR** hasta el ok de Maikel.

Regenerar las láminas (fuente: `carrusel.html` + `base.css`):

```sh
NODE_PATH=/ruta/a/node_modules node render.js   # Playwright + Chromium
```

`render.js` avisa si algún texto desborda su caja o se mete en el pie.
