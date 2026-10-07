# /recorrido/ · borrador de la landing V1 («¿Dónde se pierden tus oportunidades?»)

Paso 2 del test por patas: primero el anuncio 08 («Quién está entrando»), después esta landing, después la preparación de la reunión.
Vista previa, `noindex`, sin enlazar. **El formulario no se envía**: no crea contactos ni activa ninguna cadencia.

## Qué es
- Continúa literalmente el gancho del anuncio (el título es la frase del anuncio).
- Corta: título con el camino de un contacto (ejemplo), «¿te pasa esto?», reencuadre, datos propios (pendiente de aprobación), filtro «tiene sentido si / todavía no si», enlace al panel de ejemplo, tres preguntas frecuentes y formulario en dos pasos con calendario.
- Sin precio, sin garantía, sin nombres ni resultados de clientes, sin «scoring». El panel de Intelligence solo como enlace a la demo con datos de ejemplo.

## Qué NO hace todavía (V2, necesita aprobación)
- Pantalla de «ahora no es tu caso» y routing por encaje: toca la cadencia de entrada.
- Precio visible.
- Casos de clientes (el de Sonia, con su permiso, a partir del 12-nov).

## Para cablearlo a producción (pendiente de aprobación)
`api/diagnostico.js` hoy exige `sector`, `equipo`, `inversion` y `web`. Este formulario pregunta `sector`, `volumen`, `problema`, `valor`, `cuando` y pide `web` como opcional.
Cambio mínimo y compatible hacia atrás: aceptar un campo `version: 'recorrido-v1'`, relajar `equipo`, `inversion` y `web` solo en ese caso y guardar las respuestas nuevas en etiquetas y en la nota.
Antes de activarlo hay que comprobar que la puntuación A/B/C/D no depende de la etiqueta `inv-` (si falta, no debe degradar al contacto) y que el contacto sigue por la cadencia actual sin cambios.
Medición: UTM del anuncio en cada contacto (`utm_content` = anuncio) y `origen=recorrido`.

## Decisiones pendientes de Maikel
- Rangos de «valor de un cliente» y de volumen (propuesta del 7-oct, sección 14).
- Si se muestran datos de nuestro propio embudo como prueba.
- Que el «no encaja» y el precio visibles queden para V2.
