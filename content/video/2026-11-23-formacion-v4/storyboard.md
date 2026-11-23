# Formación V4 · «De un anuncio a una oportunidad real» (23-nov)

- **Encargo:** de Maikel, 23-nov. Recorrido completo de una oportunidad, del anuncio a la reunión y al aprendizaje de las campañas. 55-65 s, mismo estilo que la V3.
- **Estado:** storyboard y prueba de montaje en 9:16. No se publica sin revisión y aprobación.
- **Idea:** seguimos a Laura todo el vídeo; cada escena responde a «¿qué le pasa ahora a Laura?». El cierre es lo que diferencia a Qualivo: el resultado comercial vuelve a la campaña que la trajo.

## Guion y escenas (64,2 s) · versión ajustada a lo que Growth confirmó el 23-nov

La voz es la del anuncio antiguo (Javier Rojas), un 8 % más rápida: a su ritmo normal el guion entero se iba a 70 s.

| Tiempo | Voz | Pantalla |
|---|---|---|
| 0-8 | «Tu escuela online invierte en publicidad. Laura ve un anuncio y pide información sobre uno de tus cursos. Y aquí empieza todo.» | Desde el fotograma 0: «Tu escuela invierte en anuncios» y el anuncio. Laura pulsa «Más información», cae la notificación «Nueva solicitud · Laura Vidal» y se convierte en el fondo. |
| 8-14,7 | «En Qualivo trabajamos tus campañas, las páginas de captación y los formularios para atraer solicitudes de calidad.» | Tres piezas encadenadas: Campañas (Meta Ads), Landing, Formulario. |
| 14,7-21 | «Cuando Laura entra, el sistema identifica de qué anuncio viene, registra su interés y la cualifica.» | Ficha de Laura en el CRM: viene de, interés, qué quiere y «Nivel A». |
| 21-26 | «Automáticamente recibe un WhatsApp que resuelve dudas y la ayuda a dar el siguiente paso.» | WhatsApp: mensaje, pregunta de Laura, respuesta y propuesta de llamada. |
| 26-32,5 | «¿No responde? El sistema insiste con nuevos mensajes, sin que nadie tenga que acordarse.» | Sello «Laura no responde» → ficha «El sistema insiste»: WhatsApp a +1 día, correo a +2 días, otro WhatsApp a +3 días. |
| 32,5-40 | «Cuando agenda una reunión, el sistema actualiza su etapa, envía recordatorios y facilita la reprogramación si lo necesita.» | Cita «Jueves 17:00» y tres líneas: etapa, recordatorios la víspera y el mismo día, reprogramar desde la cita. |
| 40-43,5 | «El equipo comercial llega a la llamada con toda la información.» | Ficha «Antes de la llamada»: curso, objetivo, dudas y de qué anuncio viene. |
| 43,5-52,5 | «Y cuando esa oportunidad se confirma como cualificada, el sistema envía la señal a Meta para optimizar las campañas hacia contactos de mayor calidad.» | Abajo, Laura: «Reunión celebrada · Cualificada ✓». Una señal sube hasta la campaña «por las tardes», que se enciende: «Señal de calidad recibida». |
| 52,5-58,6 | «Esto es Qualivo: captación, seguimiento comercial y optimización continua, todo conectado.» | Fondo negro, «Esto es Qualivo» y las tres piezas. |
| 58,6-64,2 | «¿Quieres algo así para tu escuela? Solicita un diagnóstico gratuito.» | Logo, pregunta y botón. |

## Qué confirmó Growth y qué cambió respecto al guion de Maikel

| Punto | Lo real hoy (Growth, 23-nov) | En el vídeo |
|---|---|---|
| Agente de voz | No funciona: la línea da error desde el 13-nov. Cuando funciona, llama a las 2 h si no hay respuesta, salvo nivel D, y en horario. | **Fuera.** En su lugar, el seguimiento que sí ocurre: nuevos mensajes y correo. Vuelve cuando la línea funcione. |
| WhatsApp | El agente contesta al momento, resuelve dudas, cualifica y agenda la reunión solo. Pasa a una persona el precio y lo delicado. | Se mantiene la frase de Maikel. |
| Cualificación | El nivel A/B/C/D se asigna al entrar con las respuestas del formulario. Intelligence es el panel, no el motor. | «el sistema … la cualifica», no «Intelligence». |
| Reunión | La etapa cambia sola; recordatorios la víspera a las 18:30 y el mismo día a las 9:00; el lead reprograma desde la cita. | Se mantiene, con esos datos. |
| Señal a Meta | Funciona por la API de conversiones: contesta, agenda, cualificada y cliente. | «envía la señal», sin «puede». Sale solo tras «Cualificada». |
| Google Ads | No es lo que se vende hoy en formación. | Solo «Meta Ads». |
| Nombre | «Qualivo Intelligence» es el panel de métricas; las fichas y el pipeline son el CRM. | Las fichas dicen «CRM». |

## Las tres decisiones de Maikel

1. **Reunión agendada no es reunión cualificada.** La señal a Meta sale en el vídeo solo después de «Reunión celebrada · Cualificada ✓». Matiz de Growth: hoy el sistema envía también una señal al agendar y marca «cualificada» al pasar a oferta aunque no encaje; lo tiene propuesto para arreglar.
2. **Agente de voz.** No se enseña porque hoy no funciona.
3. **No es un tutorial.** Ninguna pantalla nombra disparadores, API ni integraciones; solo estados de Laura.

## Otros avisos

- La música del antiguo dura 56 s y aquí se repite al final; habrá que escuchar ese empalme o elegir una base más larga.
- Los efectos de sonido son sintetizados. Nadie ha escuchado la mezcla.
- Se mantiene «Caso de ejemplo». No hay cifras de resultados.

## Archivos

- `formacion-v4-prueba-916.mp4`.
- `hacer_escena.py` genera `t.js`, `tiempos.json` y `escena-v4.html` a partir de la locución; `montar.py` monta el vídeo; `guion.json` y `voz/` tienen la locución.
