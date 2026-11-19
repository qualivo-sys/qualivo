# Gestión académica CANCOMAR (19-nov-2026)

- Demo: https://qualivo.io/propuestas/cancomar/gestion/ (pestañas por enlace: #gru, #pro, #alu, #doc, #ren, #fac)
- Alcance: https://qualivo.io/propuestas/cancomar/gestion/alcance/

Fuente: reunión del 19-nov (demo de Ágora por pantalla), transcripción de Tactiq. No se pudo abrir el vídeo de Drive.

## Qué hay
- Demo: cursos y grupos (nuevo grupo desde plantilla con sesiones rellenas y vista de calendario), profesores con sus grupos y horas, matrícula desde el CRM con un clic, documentación por lotes (PDF reales generados en el navegador con jsPDF: 20 fichas, asistencia, comunicaciones y prácticas), firma en tablet sobre un canvas, renovaciones enviadas al CRM y facturación marcada como «fase posterior · opcional» (exporta un CSV de ejemplo).
- Alcance: tabla con lo que pidieron punto por punto, 3 opciones con plazo e hitos, Ágora (punto 2.8: qué se sincroniza, qué se mantiene y qué se ahorra), riesgos y lo que necesitamos de ellos.
- `base.css` es una copia del CSS del CRM (../demo/) para que las dos páginas compartan estilo.

## Reglas
- Todo son datos de ejemplo: profesores, alumnos, horas, fechas e importes. Solo los nombres de los cursos son reales. En la reunión salió el nombre de un profesor real: no se usa.
- Los importes NO están en el repo. En la página de alcance salen como «Pendiente de confirmar»; se rellenan en `var PRECIOS` al final de alcance/index.html cuando Maikel los apruebe.
- noindex en las dos páginas. Probado con Playwright a 390 y 1440: sin scroll horizontal ni errores de JS.
