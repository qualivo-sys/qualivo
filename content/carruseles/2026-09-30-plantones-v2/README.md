# Carrusel «Reservan la visita. Y no aparecen» · plantones v2 (30 sep 2026)

Nueve láminas 1080 × 1350 para centros de formación y academias que ya invierten en anuncios. P2 PLANTONES: reservan la visita o la llamada y no aparecen. No sustituye a 2026-09-24-plantones (las cinco causas), que se queda como está: esta versión cuenta el protocolo antes y después de la cita.

- Molde: `content/guia-carruseles.md` (barra de progreso, numeración, «Pasa →», firma @maikel.echevarria y QUALIVO.IO, sin rótulos encima del titular, cuerpo a 38 px, una idea por lámina).
- Estética crema, agenda con sello NO VINO, semana de silencio, pantallas de WhatsApp y de llamada.
- Sin resultados de clientes (regla editorial del 12-ago en `content/growth-os.md`). Toda pantalla o cifra ilustrativa lleva la etiqueta «Ejemplo».
- La IA aparece solo como mecanismo, en la lámina 8. CTA único: diagnóstico gratuito de 30 minutos, «Escríbeme DIAGNÓSTICO por privado».
- Pie de foto: `caption.md`. Guiones de vídeo y anuncios del mismo dolor: `content/guiones/2026-09-30-guiones-maikel.md`.

**NO PUBLICAR** hasta el ok de Maikel.

Regenerar las láminas (fuente: `carrusel.html` + `base.css`):

```sh
NODE_PATH=/ruta/a/node_modules node render.js   # Playwright + Chromium
```

`render.js` avisa si algún texto desborda su caja o se mete en el pie.
