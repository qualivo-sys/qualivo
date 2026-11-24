# Batería creativa de Formación · primera entrega (24-nov)

- **Encargo:** de Maikel, vía Paid, 24-nov. Brief en la rama `claude/qualivo-paid`, `paid/experimentos/2026-11-24-bateria-creativa-formacion.md`.
- **Estado:** primera entrega para revisión. No se publica nada.
- **Qué hay:** los tres estáticos (AD01, AD02 y AD03) en 4:5 y 9:16, y los guiones de AD04 y AD05 con su propuesta de montaje.

## Estáticos

| | Archivos | Cómo se distingue sin leer |
|---|---|---|
| AD01 · Sistema completo | `png/ad1-45.png`, `png/ad1-916.png` | Fondo negro con retícula y luz turquesa; ocho módulos unidos por una línea central; titular en mayúsculas. |
| AD02 · Fugas comerciales | `png/ad2-45.png`, `png/ad2-916.png` | Fondo crema, tipografía con serifa, rojo para la pregunta; lista numerada tipo revista. |
| AD03 · Formularios frente a oportunidades | `png/ad3-45.png`, `png/ad3-916.png` | Partido en dos mitades, gris frente a turquesa, con un «VS» en el centro. |

Textos: los del brief, sin cambios. Vista conjunta en `hoja-de-contacto.png`. Se generan con `node render.js` desde `estaticos.html`; el script avisa si algo se sale del lienzo o, en 9:16, de la franja 290-1520 px.

### Avisos sobre los estáticos

1. **AD01 dice «Meta y Google Ads».** Growth indicó el 23-nov que en formación hoy solo se trabaja Meta. Se ha dejado el texto del brief; si no se ofrece Google, hay que cambiarlo a «Meta Ads».
2. **AD01 dice «WhatsApp con IA».** Maikel pidió en su día no vender «IA». Se ha dejado el texto del brief, que es posterior.
3. **AD01 incluye «Agentes de voz».** La línea está caída desde el 13-nov. Paid ya ha dicho que no lo lanza hasta que funcione o se adapte.
4. **AD03 no lleva capturas de Intelligence.** Las capturas que hay en el repo (`../2026-11-10-estaticos-formacion/capturas/`) son del panel con datos de demostración: retornos, matrículas y costes. Ponerlas sería enseñar cifras que no son de ningún cliente. Si Maikel quiere captura real, hace falta una sin cifras o con las cifras tapadas.
5. **AD03 dice «Datos que vuelven a Meta».** Es cierto, pero Growth está corrigiendo qué señal se envía. No hay cifras.
6. **AD02:** las cinco fugas son las del brief. «Citas a las que nadie asiste» es una afirmación fuerte; valdría también «citas a las que no asisten».

## AD04 · Maikel a cámara (25-35 s)

Guion del brief, partido en cinco bloques para grabar por separado. Leído a ritmo normal son unos 30 s.

| # | Dice Maikel | En pantalla | s |
|---|---|---|---|
| 1 | «Si tienes una escuela de formación online y ya inviertes en publicidad, déjame hacerte una pregunta.» | Maikel a cámara. Subtítulo grande. Rótulo fijo arriba: «Para escuelas de formación online». | 0-6 |
| 2 | «¿Sabes qué anuncios te están trayendo alumnos y cuáles simplemente te generan formularios?» | Maikel a cámara; a mitad de frase, corte de 2 s a la tabla de campañas de Intelligence. | 6-12 |
| 3 | «En Qualivo gestionamos tus campañas, conectamos las solicitudes con tu equipo comercial y automatizamos la cualificación, el seguimiento y las reuniones.» | Tres cortes de 2 s sobre su voz: Meta Ads, el CRM con una solicitud entrando, y WhatsApp con la cita. Vuelve a Maikel en «las reuniones». | 12-21 |
| 4 | «Además, utilizamos lo que ocurre en ventas para mejorar continuamente tus campañas.» | Maikel a cámara; corte de 2 s al pipeline con una oportunidad marcada como cualificada. | 21-26 |
| 5 | «Si quieres saber dónde estás perdiendo oportunidades, solicita un diagnóstico gratuito y lo analizamos contigo.» | Maikel a cámara. Últimos 2 s: logo, «Solicita tu diagnóstico gratuito». | 26-32 |

**Montaje:** cortes secos, sin música o con música muy baja; subtítulos de toda la locución, dos líneas como máximo, en el tercio inferior pero por encima de la zona de botones de Reels; ningún efecto de transición. Las capturas entran a pantalla completa, sin marcos de móvil ni animaciones, para que no se parezca al V7.

### Hoja de grabación para Maikel

- **Formato:** vertical, móvil a la altura de los ojos, cámara trasera, 4K o 1080p a 30 fps. Plano medio: de la cintura a un palmo por encima de la cabeza, para poder recortar a 4:5.
- **Luz:** de cara a una ventana, de día. Nada de ventana detrás ni luz de techo sola.
- **Fondo:** el despacho, ordenado y sin pantallas encendidas detrás. Sin logos de terceros.
- **Sonido:** micrófono de corbata o los auriculares del móvil. Habitación sin eco; puerta cerrada.
- **Cómo grabar:** cada bloque por separado, tres tomas de cada uno. Mirar al objetivo, no a la pantalla. Dejar un segundo de silencio antes y después de cada frase. No hace falta memorizarlo todo: un bloque cada vez.
- **Ropa:** lisa, sin rayas finas ni blanco puro.
- **Capturas que necesito**, en vertical o en grabación de pantalla de 5-10 s cada una, sin datos personales ni de clientes a la vista:
  1. Intelligence: la tabla de campañas.
  2. El administrador de anuncios de Meta con las campañas.
  3. El CRM con la lista de solicitudes.
  4. Una conversación de WhatsApp del sistema con la cita propuesta (de prueba).
  5. El pipeline con una oportunidad en «Reunión agendada» o cualificada.

## AD05 · Demo rápida (20-30 s)

Guion del brief. Con la voz del narrador de siempre (Javier Rojas) al ritmo del V7 dura unos 27 s. Todo sale de material que ya existe: no se genera ningún plano nuevo.

| # | Voz | Imagen | De dónde sale | s |
|---|---|---|---|---|
| 1 | «¿Tu escuela online ya invierte en publicidad?» | El móvil con el anuncio y el dedo pulsando «Solicitar información». Titular con la misma frase. | V7, escena del anuncio | 0-3 |
| 2 | «Mira lo que ocurre cuando entra una solicitud.» | El CRM: entra la fila de la solicitud. | V7, escena del CRM (o grabación real) | 3-6 |
| 3 | «El sistema responde por WhatsApp, cualifica al contacto y activa el seguimiento.» | WhatsApp en grande, una pregunta y una respuesta; después la tarjeta salta de etapa en el pipeline. | V7, escenas de WhatsApp y pipeline | 6-12 |
| 4 | «Cuando agenda una reunión, envía confirmaciones y recordatorios automáticamente.» | Calendario con la cita y el WhatsApp de confirmación y recordatorio. | V7, escenas de cita | 12-17 |
| 5 | «Y cuando el equipo comercial valida la oportunidad, utilizamos esa información para mejorar las campañas.» | «Reunión cualificada ✓» → Intelligence → los dos anuncios comparados. | V7, escena de Intelligence | 17-23 |
| 6 | «Esto es Qualivo. Captación, seguimiento y mejora continua.» | Las tres piezas unidas. | V7, cierre | 23-26 |
| 7 | «Solicita tu diagnóstico gratuito.» | Logo y botón. | V7, cierre | 26-28 |

**Montaje:** solo interfaz y gráficos, sin planos de personas, para que se distinga del V7 y del AD04. Ritmo de un corte cada 2-3 s. Subtítulos de toda la locución.

**Dos decisiones para Maikel:**

- **Agente de voz.** El guion del brief no lo menciona, así que el AD05 puede quedar sin él y lanzarse aunque la línea siga caída. Paid lo había anotado como bloqueado; con este guion no lo está.
- **Grabaciones reales o las escenas del V7.** El brief pide «sobre todo grabaciones reales del sistema». Las escenas del V7 son recreaciones fieles de la interfaz, no grabaciones. Si se quieren reales, hacen falta las mismas cinco capturas de la hoja del AD04, en grabación de pantalla. Con ellas se montan los dos vídeos.

## Segunda entrega (24-nov, tarde): los cinco creados

| | Archivos | Estado |
|---|---|---|
| AD01 | `png/ad1-45.png`, `png/ad1-916.png` · sin agente de voz: `png/ad1-sin-voz-45.png`, `png/ad1-sin-voz-916.png` | Listo. La variante quita «Agentes de voz» y deja siete módulos. |
| AD02 | `png/ad2-45.png`, `png/ad2-916.png` | Listo. |
| AD03 | `png/ad3-45.png`, `png/ad3-916.png` | Listo, sin capturas de Intelligence (ver aviso 4). |
| AD04 | `png/ad4-rotulo-*.png`, `png/ad4-cierre-*.png`, `ad04-subtitulos.md` | Preparado lo que no depende de Maikel. Faltan su grabación y las cinco capturas reales. |
| AD05 | `../../video/2026-11-24-formacion-ad05/formacion-ad05-demo-916.mp4` y `-45.mp4` (27,8 s) | Listo. Guion del brief, voz de Javier Rojas, subtitulado. |

**Sobre el AD05:**

- Está hecho con las escenas de interfaz del V7 (anuncio, CRM, WhatsApp, pipeline, cita, confirmación y recordatorio, Intelligence y cierre), sin planos de personas. No lleva grabaciones reales del sistema porque no hay ninguna disponible; son recreaciones de la interfaz.
- El guion no menciona el agente de voz y el vídeo no lo enseña, así que no necesita variante.
- Los subtítulos ocupan el sitio de los titulares de escena. En el cierre no hay subtítulo porque el texto en pantalla ya dice lo mismo que la voz.
- Nadie ha escuchado el audio. Verificado con transcripción automática y volumen (-14,0 LUFS).

## Siguiente paso

Con el visto bueno a los estáticos y a los guiones: montar el AD05 (medio día, sin generar nada nuevo) y dejar el AD04 a la espera de la grabación de Maikel.
