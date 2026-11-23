# Formación V4 · «De un anuncio a una oportunidad real» (23-nov)

- **Encargo:** de Maikel, 23-nov. Recorrido completo de una oportunidad, del anuncio a la reunión y al aprendizaje de las campañas. 55-65 s, mismo estilo que la V3.
- **Estado:** storyboard y prueba de montaje en 9:16. No se publica sin revisión y aprobación.
- **Idea:** seguimos a Laura todo el vídeo; cada escena responde a «¿qué le pasa ahora a Laura?». El cierre es lo que diferencia a Qualivo: el resultado comercial vuelve a la campaña que la trajo.

## Guion y escenas (65,4 s)

La voz es la del anuncio antiguo (Javier Rojas), un 8 % más rápida: a su ritmo normal el guion entero se iba a 71 s.

| Tiempo | Voz | Pantalla |
|---|---|---|
| 0-8 | «Tu escuela online invierte en publicidad. Laura ve un anuncio y pide información sobre uno de tus cursos. Y aquí empieza todo.» | Desde el fotograma 0: «Tu escuela invierte en anuncios» y el anuncio. Laura pulsa «Más información», cae la notificación «Nueva solicitud · Laura Vidal» y se convierte en el fondo. |
| 8-14,7 | «En Qualivo trabajamos tus campañas, las páginas de captación y los formularios para atraer solicitudes de calidad.» | Tres piezas encadenadas: Campañas (Meta y Google Ads), Landing, Formulario. |
| 14,7-21,3 | «Cuando Laura entra, Intelligence identifica de qué anuncio viene, registra su interés y la cualifica.» | Ficha de Laura en Intelligence: viene de, interés, qué quiere y «Nivel A». |
| 21,3-26,5 | «Automáticamente recibe un WhatsApp que resuelve dudas y la ayuda a dar el siguiente paso.» | WhatsApp: mensaje, pregunta de Laura, respuesta y propuesta de llamada. |
| 26,5-32,5 | «¿No responde? Según su situación, puede intervenir un agente de voz para recuperar la conversación.» | Sello «Laura no responde» → pantalla de llamada del agente de voz, con el aviso «Solo si se cumple la condición configurada». |
| 32,5-40,2 | «Cuando agenda una reunión, el sistema actualiza su etapa, envía recordatorios y facilita la reprogramación si lo necesita.» | Cita «Jueves 17:00» y tres líneas: etapa, recordatorios, reprogramar. |
| 40,2-43,6 | «El equipo comercial llega a la llamada con toda la información.» | Ficha «Antes de la llamada»: curso, objetivo, dudas y de qué anuncio viene. |
| 43,6-53,8 | «Y cuando esa oportunidad se confirma como cualificada, Intelligence puede enviar la señal a Meta para ayudar a optimizar las campañas hacia contactos de mayor calidad.» | Abajo, Laura: «Reunión celebrada · Cualificada ✓». Una señal sube hasta la campaña «por las tardes», que se enciende: «Señal de calidad recibida». |
| 53,8-59,9 | «Esto es Qualivo: captación, seguimiento comercial y optimización continua, todo conectado.» | Fondo negro, «Esto es Qualivo» y las tres piezas. |
| 59,9-65,4 | «¿Quieres algo así para tu escuela? Solicita un diagnóstico gratuito.» | Logo, pregunta y botón. |

## Las tres decisiones de Maikel, cómo quedan en la prueba

1. **Reunión agendada no es reunión cualificada.** La señal a Meta sale en el vídeo solo después de «Reunión celebrada · Cualificada ✓», nunca al reservar.
2. **Agente de voz.** Aparece 4 s, con el aviso de la condición en pantalla y la voz diciendo «puede intervenir».
3. **No es un tutorial.** Ninguna pantalla nombra disparadores, API ni integraciones; solo estados de Laura.

## Pendiente de confirmar con Growth (preguntado el 23-nov)

Lo que el vídeo enseña y todavía no está confirmado como real hoy:

- Que la línea del agente de voz funciona (estaba caída desde el 13-nov) y con qué condición interviene. El reloj dice «+2 h»: es el dato del 19-nov.
- Que WhatsApp contesta solo a las dudas del lead después del primer mensaje.
- Cuántos recordatorios salen y si el lead puede reprogramar por sí mismo.
- Que existe el envío de la señal de conversión a Meta y qué evento lo dispara.
- Que se gestiona también Google Ads (la pieza «Campañas» dice «Meta y Google Ads»).
- Que «Intelligence» es el nombre que ve el cliente.

## Otros avisos

- La música del antiguo dura 56 s y aquí se repite al final; habrá que escuchar ese empalme o elegir una base más larga.
- Los efectos de sonido son sintetizados. Nadie ha escuchado la mezcla.
- Se mantiene «Caso de ejemplo». No hay cifras de resultados.

## Archivos

- `formacion-v4-prueba-916.mp4`.
- `hacer_escena.py` genera `t.js`, `tiempos.json` y `escena-v4.html` a partir de la locución; `montar.py` monta el vídeo; `guion.json` y `voz/` tienen la locución.
