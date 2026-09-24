# Carrusel · «Una clínica entró un viernes por la web. Sin anuncio.» (21 sep 2026)

Seis láminas 1080 × 1350, simulación de pantalla (formato aprobado el 14-sep).
Serie **Construyendo Qualivo**. Caso real: una clínica dental que entró el
sábado 19-sep por `qualivo.io/clinicas` sin anuncio, avisó por WhatsApp de que
el calendario no se veía en el iPhone («no puedo bajar en el calendario»),
cerró cita por WhatsApp con Maikel y tuvo el diagnóstico el lunes 21 a las 13:30.

**Fuentes verificadas.** Growth Review 14-20 sep (Notion): lead orgánico de
/clinicas/ con reunión el lunes; «las reuniones reales han venido de WhatsApp».
`diagnostico/landing.js` (comentario del 19-sep): su frase y el fallo del
calendario en iPhone. Commits del 19-sep: 11:18 el agente de WhatsApp deja de
escribir a quien ya tiene cita (`abc6c9f`); 12:02 calendario a pantalla completa
en las cuatro landings (`488cc43`). Copy de la landing: `clinicas/index.html`.

**Lo que falta y solo tiene Maikel.**
1. La lámina 5 lleva un hueco amarillo: la frase de ella en la reunión del
   lunes. Con su permiso.
2. Su respuesta por WhatsApp del viernes no está en el repositorio: en la
   lámina 3 va resumida en cursiva («contesté yo, desde el móvil»), no citada.
3. Nombre y clínica: tapados. Si Maikel tiene permiso, se ponen y la pieza gana.

**Uso.** Instagram (carrusel) y LinkedIn (documento). CTA de conversación.
**NO PUBLICAR**: pausa vigente.

Regenerar: `./render.sh`.
