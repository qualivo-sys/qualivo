# Encargo Paid → Creative · Anuncio 09 «Solicitudes de calidad»: el sistema en vivo (22-oct-2026)

Lo pide Maikel tras ver `QV_09_calidad_916_prueba1.mp4`.

**Lo que dice Maikel:** el guion, la voz y el ritmo le gustan y **no se cambian**. Lo que no le convence es que el sistema se enseñe con **capturas estáticas**. Lo ve «cutrillo» al lado del vídeo de la landing, donde todo se ve funcionando en tiempo real.

## Qué cambia

Solo la imagen del tramo del sistema. En la prueba 1 va más o menos del segundo 18 al 46: «La calidad se trabaja en todo el recorrido», anuncio, 4 preguntas, WhatsApp, ficha y siguiente paso.

- **Hoy:** el montaje usa `capturas/*.png` (portada, formulario, whatsapp, ficha, citas, hoy) de vuestra rama, `content/video/2026-10-22-solicitudes-calidad/`.
- **Lo que queremos:** que esas pantallas **se vean funcionando**, como en el vídeo de la landing (`content/video/2026-10-07-demo-caso-v2/escena-formacion.html` y los `qualivo-sistema-formacion-*.mp4`). Por ejemplo:
  - El formulario se rellena tocando las opciones.
  - En WhatsApp los mensajes entran escribiéndose.
  - La ficha se completa campo a campo y aparece la nota.
  - La lista de «Hoy» se ordena y salta el «Urgente».
- **Reutilizad las escenas animadas que ya existen** (demo-caso-v2 y la demo interactiva de la landing v22), sincronizadas con `voz/principal.mp3` y `tiempos.js`. **La voz no se regraba.**
- La etiqueta «Ejemplo · datos simulados» se mantiene en cada pantalla.

## Se mantiene igual

- El gancho con «CENTROS DE FORMACIÓN», los sellos «NO CONTESTA», la agenda y Laura.
- La llamada a la acción «Toca en Más información» y el cierre con el logo y «Diagnóstico sin coste · 30 min».
- La voz de Javier y la música.

## Tres propuestas de Paid (Maikel decide; ninguna cambia la voz)

1. **Un rótulo en los segundos 0-3:** «¿Ya invertís en publicidad?», debajo de «CENTROS DE FORMACIÓN». Hoy esa frase solo está en el subtítulo, y quien ve el vídeo sin sonido no la recibe. Es la frase que filtra.
2. **El hueco del segundo 18:** casi 2 s de pantalla negra con «La calidad se trabaja». Que entren ya los 4 pasos o que arranque la primera escena animada.
3. **La prueba con datos reales** (EAC: 10 matrículas en un mes, 10,2 veces lo invertido, ya publicada en la landing). **Esta sí añade voz**, unos 3-4 s, así que solo se hace si Maikel lo aprueba. Si no, puede ir solo como rótulo sobre la escena de la ficha.

## Entregables

- **9:16 y 4:5**, con la misma duración aproximada (unos 56 s) y la zona segura de siempre (14-78 %).
- **Fecha:** en cuanto podáis. La prueba en Meta entra desde el 1-nov, en el conjunto de formación, con el formulario E-01, como segundo anuncio y comparando por anuncio.
- **Horas:** decidnos vuestra estimación antes de empezar, si pasa de 4 h.

Respuesta por el bus (`bus/out/creative.jsonl`) o con un trigger a Paid (session_01U6fb4Lc12iG7egcZNiv5SX).
