# Subcuenta de demostración · anuncio de formación V2

Encargo de Creative v2 (13-nov), con decisiones de Maikel: sin automatización nueva, con datos ficticios, y las grabaciones las hace Maikel.

## Antes de grabar

1. **Maikel crea la subcuenta** «Qualivo · Demo» en GHL (el nombre tiene que llevar «demo»). Crea también su *Private Integration* con permisos de contactos, oportunidades, custom fields y locations (solo lectura). La clave va al entorno como `DEMO_GHL_API_KEY` y `DEMO_GHL_LOCATION_ID`, nunca al chat ni al repo.
2. En la subcuenta, crear un pipeline «Admisiones» con estas etapas: Nueva solicitud → Contactada → Llamada hecha → Más adelante → Matriculada.
3. Automatización lanza `node automatizaciones/demo/escenario-laura.js --qualivo` (13-nov, decisión de Maikel: en GHL de Qualivo y borrar al terminar). Laura sin teléfono ni email (nadie puede recibir nada), sin `meta-lead-*` (no hay señales a Meta) y con la etiqueta `demo-anuncio`. Oportunidad en Prospección → Nuevo Lead. Borrado: `--qualivo --borrar`.
4. **Llamada de prueba de Raquel:** solo al número controlado por Qualivo que dé Maikel, con su OK expreso. Si no funciona, la escena de la llamada sale del vídeo.

## Pasos de grabación (Maikel)

Navegador limpio en una ventana de incógnito, solo con la subcuenta de demostración abierta, a pantalla completa y con el zoom al 100 %.

1. **Lista:** Contactos (u Oportunidades → Admisiones). Graba unos 5 s con Laura arriba del todo. Pantalla 1.
2. **Ficha:** clic en Laura. Muestra el origen, el curso y «Pregunta del formulario». Haz scroll lento. Pantalla 2.
3. **Historial:** pestaña de notas o actividad, con la nota de historial y la de llamada. Pantalla 5.
4. **«Más adelante»:** arrastra la oportunidad a «Más adelante» y crea una tarea «Volver a escribir en enero» para el equipo. Se enseña como recordatorio al equipo, no como envío automático. Pantalla 7.
5. **WhatsApp y llamada** (pantallas 3 y 4): solo si la llamada de prueba ha funcionado y Maikel da el OK. Se graba en el móvil de prueba de Qualivo.

Al terminar, Laura se puede quedar en la subcuenta de demostración, porque no tiene datos de nadie.
