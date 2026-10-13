# Formación V2.1 · optimización de conversión (12-oct-2026)

**Dónde está:** `formacion/v21/index.html` (noindex, canonical a `/formacion/`).

**Qué no se ha tocado:**
- la V2 (`/formacion/v2/`), que se queda para comparar;
- la landing de producción, `/formacion/`.

## Componentes afectados

- **La página `formacion/v21/index.html`.**
- **`formacion/v21/img/`.** Dos capturas de la demo de Intelligence (sector formación, datos simulados): el recorrido y las acciones de «Requieren atención».
- **Sin cambios en:**
  - `diagnostico/landing.js` (formulario, envío al CRM y calendario);
  - `api/diagnostico.js`;
  - `api/prueba.js` (Raquel);
  - `api/huecos.js` (huecos reales);
  - `assets/consent.js`.

## Cambios por sección

1. **Hero.**
   - Subtítulo, CTA («Descubre cómo captar más alumnos») y microcopy («Diagnóstico sin coste · 30 minutos») según el brief.
   - «Plan por escrito» se ha quitado porque no está confirmado.
   - El panel empieza en Solicitudes, y «4 campañas activas» va en la cabecera, no como barra.
   - Lleva la etiqueta «Datos de ejemplo» y el pie «Ejemplo ilustrativo. No son datos de un cliente».
   - Fuera los avisos flotantes, el «En directo», la inclinación con el ratón, el brillo y el latido.
   - Fuera el hueco libre del hero: los huecos reales solo aparecen junto al formulario.
2. **Resultados.**
   - **EAC.** Además de las cifras, cuenta el contexto y qué se hizo: tres cursos, campañas por curso en Meta, Google y TikTok conectadas al CRM y seguimiento hasta la matrícula. «10 matrículas ese mes» sale de `/casos/eac/`.
   - **Nail Boss.** Sin contexto añadido, porque no hay informe en el repo (ver riesgos).
   - **Logos.** Fuera el carrusel: van los 16 en una fila fija y discreta, primero los de formación.
   - **Focus Practical.** Fuera: dos casos como máximo.
3. **Problema y solución en una sola sección.**
   - Los tres problemas con el texto del brief.
   - Un recorrido compacto Atraer → Convertir → Responder → Facilitar la venta → Medir, con una línea por función.
   - Fuera el selector de cinco pestañas y la línea de tiempo del alumno, que repetían.
4. **Demostración.**
   - H2 y texto del brief.
   - Una franja de cifras de ejemplo: solicitudes, conversaciones, reuniones, «requieren atención hoy» y matrículas.
   - Dos capturas reales de la demo con su etiqueta, numeradas: (1) dónde se pierden y (2) qué hacer hoy.
   - Raquel, compacta y en segundo plano. Se presenta como capacidad del sistema, con el texto del brief y la prueba real.
5. **Servicio.**
   - Las tres fases con el texto del brief.
   - El bloque «Lo que podemos llevar por ti» con las seis capacidades y la nota «el alcance se acuerda tras el diagnóstico». No se presentan como incluidas siempre.
   - Una sola oferta y ningún precio.
6. **Conversión.**
   - Progreso en tres pasos: Tu centro → Tus datos → Reserva tu hora.
   - «Qué pasa después» en tres pasos.
   - Los huecos reales de la agenda, si los hay.
   - El botón del paso 2 dice «Ir a elegir hora»: deja claro que la reunión no está hecha hasta reservar.
   - La confirmación «Reunión reservada» solo aparece si el calendario avisa de una reserva completada.

**Tamaño:** unas 660 palabras de texto comercial (antes, unas 700), con menos bloques y menos repetición.

## Integraciones comprobadas (API simuladas, sin CRM ni llamadas reales)

**En escritorio (1440), tablet (820) y móvil (390):**
- sin errores en consola;
- sin desbordamiento horizontal;
- un solo H1, seis secciones y todas las imágenes con alt.

**CTAs:** los cuatro llevan a un destino que existe (`#diagnostico` y `#demo`).

**Formulario:**
- **Errores claros:**
  - si falta un campo del paso 1;
  - si falta el RGPD en el paso 2.
- **Envía una vez** aunque se pulse dos veces.
- **Payload correcto:**
  - sector formación;
  - centro y objetivo en `hipotesis`;
  - `origen` `formacion/v21`;
  - UTM conservada.
- **Después del envío** carga el calendario.

**Confirmación de reunión:**
- no aparece antes de reservar ni con mensajes de otros orígenes;
- sí aparece con un aviso de reserva del dominio del calendario.

**Raquel:** un solo envío, con `sector: formacion`.

**Huecos:**
- se ven con datos;
- con la lista vacía, no aparece nada.

**Eventos, en orden y sin duplicar:**
1. `formacion_cta` (navegación, no es lead);
2. `diagnostico_form_view`;
3. `diagnostico_form_start`;
4. `diagnostico_paso1`;
5. `diagnostico_lead` (el lead);
6. `formacion_agenda_abierta` (nuevo);
7. `formacion_reserva` (nuevo, solo si el calendario avisa).

**Reunión reservada en el servidor:** evento Schedule del workflow «Appointment booked» (`api/meta-evento.js`).

**Reunión celebrada:** solo existe en el CRM. No se puede medir desde la página.

## Riesgos y pendientes

1. **Nail Boss (1.160 solicitudes y 21 matrículas en cuatro meses)** no tiene informe ni datos en el repo. Está publicado y es decisión de Maikel del 12-oct, pero falta la trazabilidad: periodo exacto y fuente. Si no se puede respaldar, se quita.
2. **EAC.** El periodo es «un mes de referencia» y no se dice cuál, igual que en `/casos/eac/`. Conviene fijar el mes.
3. **El aviso de reserva del calendario de GHL no está comprobado con una reserva real.** El código es tolerante: si no hay aviso, no confirma nada y la reserva se sigue midiendo en el CRM. Hay que comprobarlo con una reserva de prueba.
4. **Cuando falla el envío,** `landing.js` restaura el botón con el texto «Quiero ver dónde está la fuga →». Es cosmético. Se arregla en `landing.js` si se lleva a producción.
5. **«Plan por escrito»** no aparece hasta que se confirme que se entrega.
6. **El formulario y Raquel son reales** en la URL de vista previa. Si se usan, entra un lead o llama Raquel.

## VSL en la portada (13-oct)

- **Qué cambia:** el vídeo de Maikel (5:38, grabado en 4K el 12-oct) ocupa la columna derecha del hero. Sustituye al panel «Recorrido de un mes», cuyas cifras de ejemplo ya están en la franja de la demostración.
- **Dónde se aloja:** en YouTube como oculto, «El sistema Qualivo». Se inserta con `youtube-nocookie.com/embed/WrWcO7SwYKY` (`data-embed` del `#vsl`).
- **Cómo carga:**
  - de entrada solo hay una portada de texto de 78 KB (`img/vsl-portada.jpg`, la misma miniatura que en YouTube) y la duración;
  - el reproductor se carga al pulsar, así que antes del clic no hay ninguna petición a YouTube, ni cookies, ni autoplay con sonido.
- **Probado** en escritorio y móvil, con YouTube simulado:
  - ninguna petición a YouTube antes del clic;
  - después del clic, iframe con autoplay y el evento `formacion_vsl_play`;
  - sin errores y sin desbordamiento.
- **Alternativa propia:** `data-mp4` sirve un MP4 propio. No se usa en Vercel por el tamaño.
- **Pendiente de Maikel:**
  - el destino del botón del final del vídeo. Propuesta: el formulario de esta página;
  - el ok para enseñar Intelligence con «Datos simulados» (sale en el vídeo).

## Versión para tráfico de pago (13-oct, revisión antes de invertir)

1. **Fuera lo de borrador.**
   - Sin la barra amarilla.
   - Los dos campos ocultos ya no dicen «No preguntado (formación v2.1)» sino «No se pregunta en esta landing». Era lo que llegaba al CRM, al aviso y al primer WhatsApp.
2. **Preguntas de tamaño del funnel v2 en el paso 1:** solicitudes al mes (5 tramos) y precio medio de un curso (4 tramos), con los mismos tramos que el formulario nativo.
   - `landing.js` las manda si la página las tiene. Las demás landings no cambian.
   - `api/diagnostico.js` pasa por `_funnel-v2.js` (`desdeCampos(..., { landing: true })`) y pone las mismas etiquetas que el nativo (`funnel-v2`, `vol-*`, `vol2-*`, `ticket-*`, `fit-paid-*` y `fit-dinero-*`), más `funnel-v2-landing`.
   - La nota del CRM lleva los dos tramos y su clasificación. El primer WhatsApp recibe las solicitudes al mes.
   - `FUNNEL_V2=0` también lo apaga aquí.
3. **Más corta para tráfico frío.** Orden: portada con VSL, casos, formulario. Debajo van el sistema, la demo con el panel y Raquel, el alcance y las preguntas. En móvil el formulario empieza en la pantalla 3,8 (antes, unas 8).
4. **Precio junto al formulario:** «Trabajamos con proyectos que empiezan en 1.200 € + IVA. El diagnóstico no tiene coste.» Es el mismo texto que la variante A de `/gracias/`. La pregunta frecuente del presupuesto lo repite.
5. **Casos.** EAC lleva fuente: medido en el CRM del centro, del anuncio a la matrícula, en un mes de campaña. **Pendiente:**
   - el mes exacto de EAC;
   - el periodo y la fuente de Nail Boss, que no constan en el repo.
   Los logos se quedan (decisión de Maikel).
6. **Medición:**
   - **Lead del píxel** al enviar el paso 2 (`diagnostico_lead`, con el mismo id que la Conversions API).
   - **Reserva:** el `Schedule` estándar lo manda el servidor al entrar la cita (`api/_cita.js`). En el navegador van como eventos propios, para no contarla dos veces: `FormacionAgenda`, `FormacionReserva` y `VSLPlay`.
   - **UTM completas:** en la nota del CRM («Origen: …»), con las etiquetas `pagina-formacion-v21` y `creativo-*`.
7. **Velocidad:** Lighthouse en móvil, en local, da 94 (LCP 2,4 s, CLS 0, TBT 190 ms). Conviene repetirlo en PageSpeed con la URL pública.

**Variante sin formulario** (`?paso=agenda`) para quien ya lo ha rellenado:
- Muestra el VSL, los casos, Raquel y el calendario directo, con el progreso en el paso 3 y los botones en «Elige tu hora».
- Acepta `nombre`, `email` y `telefono` por URL para rellenar el calendario.
- No crea ningún lead.
- Es para el WhatsApp de confirmación y para el segundo mensaje a quien no ha reservado. Ejemplo: `/formacion/v21/?paso=agenda&nombre=…&email=…&telefono=…&utm_source=whatsapp`.

**Probado** con las API simuladas, sin CRM:
- envío único y carga útil correcta;
- etiquetas en el servidor con datos grandes y pequeños, y con el interruptor apagado;
- `/diagnostico/` sin cambios;
- sin errores en escritorio ni en móvil.

## Experimentos siguientes (uno cada vez, métrica principal: reunión cualificada celebrada)

- **A. CTA del hero:** «Descubre cómo captar más alumnos» frente a «Descubre tu plan de captación» (la V2).
- **B. Formulario:** flujo actual (3 pasos con agenda) frente a una versión simplificada (un paso con 4 campos y agenda).
- **C. Prueba social:** cifras solas (V2) frente a cifras con contexto y trabajo realizado (V2.1).

**Secundarias:**
- visita → lead;
- lead → reunión;
- asistencia;
- coste por reunión cualificada;
- oportunidades.

No se cambian dos cosas a la vez.
