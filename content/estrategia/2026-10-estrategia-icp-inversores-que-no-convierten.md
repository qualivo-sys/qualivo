# Estrategia de contenido y captación · «Ya invierten, no convierten»

> **Para:** Maikel y los agentes de contenido, Paid, vídeo y Growth.
> **Periodo:** del 15-oct al 8-nov de 2026 (resto de octubre y primera semana de noviembre).
> **Base:**
> - `content/posicionamiento-v2-2026-10-12.md`, `content/plan-octubre-2026.md` y `content/content-os-v1.md` (R1-R18);
> - el brief de la semana 42 y lo que ya existe en la web.
>
> **Nada se publica sin el ok de Maikel (R16).**

## 0. En una página

**A quién vamos.** Empresas que ya pagan por captar (2.000-3.000 € al mes o más en Meta o Google), tienen proceso y gente comercial, y aun así venden poco. Les llegan muchos leads de poca calidad, sus comerciales llaman a curiosos y nadie sabe qué campaña trae ventas.

**Qué les decimos.** «Tus anuncios ya funcionan. Lo que falla es lo que pasa después del clic.» No vendemos más leads. Vendemos saber cuáles comprar, no perder los buenos y saber qué campaña trae ventas.

**Cómo los atraemos este mes:**
1. **Tres recursos gratuitos que les dejan ver su propio problema en 10 minutos:**
   - la auditoría de leads (pegas tus leads y ves cuántos valen la pena);
   - el formulario que filtra, por sector;
   - la calculadora de coste por venta.
2. **Contenido que repite cuatro problemas en todos los canales, con datos nuestros:**
   - leads basura;
   - todos los leads tratados igual;
   - la primera hora;
   - no saber qué campaña vende.
3. **Una landing multisector para ese perfil:**
   - con el VSL que ya tenemos;
   - con un formulario que pregunta inversión en anuncios y equipo comercial, además de solicitudes y ticket.
4. **Nurturing por correo para quien baja un recurso:** siete correos en 14 días, un problema por correo.
5. **Prospección uno a uno:** la Biblioteca de anuncios de Meta como lista de empresas que ya invierten.

**Lo que más pesa:** la oferta («mira tus leads con nosotros») y la prueba (casos con permiso). **Sin permisos de casos (R6) el plan pierde la mitad de su fuerza.** Es la primera tarea de Maikel esta semana.

---

## 1. El cliente ideal (ICP)

### 1.1 Quién es

| Criterio | Señal concreta | Cómo lo sabemos |
|---|---|---|
| **Invierte en captación** | 2.000 € al mes o más en Meta o Google | Pregunta del formulario (nueva) y Biblioteca de anuncios de Meta |
| **Tiene proceso comercial** | Comerciales, setters o un equipo que llama, con CRM aunque sea a medias | Pregunta del formulario (nueva): «¿quién atiende a los interesados?» |
| **Volumen o ticket** | 50 solicitudes al mes o más, o ticket de 1.000 € o más, o compra compleja (varias personas deciden o hay varias reuniones) | Ya se pregunta: solicitudes al mes y ticket (funnel v2) |
| **Le duele la conversión, no la captación** | «Entran muchos, pero no compran» | Respuesta a «¿dónde se te escapa?» y la llamada |

**Sectores** (el problema es el mismo, cambia el vocabulario):
- formación y academias;
- reformas y construcción;
- clínicas (estética, dental, cirugía);
- inmobiliarias;
- negocios de lanzamientos, VSL y embudos evergreen (infoproducto, formación online, mentorías);
- servicios B2B.

**Quién decide:**
- **El dueño o el CEO:** le duele el dinero que se va en anuncios.
- **El director comercial:** le duele que su equipo pierde el tiempo.
- **Marketing o la agencia:** le duele que le culpen de leads malos.

El contenido habla a los dos primeros. Al tercero le damos argumentos.

### 1.2 Sus dolores, con sus palabras

1. «Los leads de Facebook son basura.» / «Nos rellenan el formulario y luego no se acuerdan.»
2. «Mis comerciales pierden el día llamando a gente que no va a comprar.»
3. «Contestamos tarde y cuando llamamos ya han hablado con otro.»
4. «Mandamos el presupuesto y desaparecen.» / «En el lanzamiento entraron 2.000 leads y vendimos 40. ¿Y los otros?»
5. «La agencia dice que el coste por lead es bueno, pero las ventas no suben.» / «No sé qué campaña trae ventas.»

### 1.3 Quién no es (anti-ICP)

- Quien no invierte nada y quiere «empezar a captar». Para ellos no es este plan.
- Quien busca solo una agencia de anuncios más barata.
- Ticket bajo, sin volumen y sin equipo, donde no hay a quién mejorar el proceso.

### 1.4 Lo que pide al formulario (propuesta para Growth y Paid)

Hoy el formulario v2 pregunta las solicitudes al mes y el ticket. Para este ICP faltan dos preguntas:
- **«¿Cuánto invertís al mes en anuncios?»** Tramos: menos de 1.000 €, 1.000-3.000 €, 3.000-10.000 €, más de 10.000 €.
- **«¿Quién atiende a los interesados?»** Opciones: yo, una persona, un equipo comercial, una agencia o call center.

Las dos van a etiquetas (`inv-*` ya existe en la puntuación, `equipo-*` sería nueva). **Encaja** si cumple dos de tres: inversión de 1.000 € o más, equipo, y volumen o ticket. La decisión es de Paid y Growth: no se toca el test de formación v2.1 mientras dure.

---

## 2. El mensaje

### 2.1 La idea madre

**«Tus anuncios ya funcionan. Lo que falla es lo que pasa después del clic.»**

Variantes por audiencia:
- **Dueño:** «Inviertes 2.000 € al mes en anuncios. ¿Sabes cuántas ventas te traen?»
- **Director comercial:** «Tu equipo no necesita más leads. Necesita saber a cuáles llamar primero.»
- **Lanzamientos:** «En cada lanzamiento compran pocos. El dinero está en los que no compraron.»

### 2.2 Los cinco problemas (pilares del mes)

Cada pilar es una fuga del Revenue Journey. Cada uno tiene su dato real y su recurso gratuito.

| # | Pilar | Lo que decimos | Dato real que lo sostiene (R1) | Recurso gratuito |
|---|---|---|---|---|
| P1 | **Leads de poca calidad** | Tu formulario pregunta lo fácil, no lo que decide si alguien compra | Formularios v2 desde el 8-oct, con solicitudes y ticket (`api/_funnel-v2.js`). El caso anonimizado de la «A que no era» (daily del 5-oct) | El formulario que filtra |
| P2 | **Todos los leads iguales** | Dos notas: quién es y qué hace. Así cada letra tiene su trato | `api/_scoring.js` (dos notas desde el 21-sep) | Auditoría de leads |
| P3 | **La primera hora** | El lead se enfría en minutos. La respuesta tiene que llegar antes que la competencia | Primer WhatsApp al minuto y llamada de Raquel a las 2 h 30 (`api/activacion.js`). Bitácora de Raquel (llamadas reales) | Guion de las primeras 72 horas |
| P4 | **El seguimiento que muere** | Presupuestos y leads de lanzamiento que nadie vuelve a tocar | Seguimiento por motivo (plan de octubre §8). Nurturing de seis correos desde el 1-oct | Checklist post-lanzamiento |
| P5 | **No saber qué campaña vende** | El coste por lead engaña. Lo que cuenta es el coste por cita y por venta | Campaña de septiembre: 291,90 €, 21 contactos y el coste por cita por sector (`/blog/coste-por-lead/`). Intelligence con datos simulados | Calculadora de coste por venta |

**Regla del mes:** primero el acierto, luego el fallo (R12). De cada cinco piezas, como mucho una cuenta un fallo nuestro.

---

## 3. Recursos gratuitos (lead magnets)

### 3.1 Lo que ya tenemos (se reaprovecha)

| Recurso | Dónde | Qué hay que hacer |
|---|---|---|
| Checklist de auditoría de funnel | `/recursos/auditoria-de-funnel/` | Nada. Se enlaza desde las piezas de P5 |
| Simulador del embudo y guía de las cinco fugas | `/recursos/simulador-embudo/` (academias) | Versión multisector (ver 3.2-C) |
| Calculadora de fugas | `/calculadora-de-fugas/` | Revisar el texto para el ICP |
| Prueba de Raquel | `/prueba/` | Enlazar desde P3 |
| Demo de Intelligence | `/intelligence/` | Enlazar desde P2 y P5, siempre con «datos simulados» |
| VSL de 5:38 | YouTube oculto | Landing, retargeting y correo 1 del nurturing |

### 3.2 Nuevos (tres este mes, por orden)

**A · «Auditoría de leads en 10 minutos». Plantilla de Google Sheets, el recurso estrella (P1 y P2).**
- **Qué es:** pegas los últimos 50-100 leads (origen, respuesta al formulario, si contestó, si cogió cita, si compró). La hoja los puntúa con dos notas, quién es y qué hace, con la misma lógica que nuestra puntuación, simplificada.
- **Qué devuelve:** el % de leads A/B/C/D, el coste por lead que encaja y la campaña con más basura.
- **Por qué funciona:** el problema que ven es suyo y está en sus números. Y la conversación siguiente es natural: «¿lo miramos juntos?».
- **Entrega:** en la página de gracias, después del email, con un vídeo de 3 minutos de Maikel explicando cómo rellenarla (voz sobre pantalla, R14).
- **Quién:** Head of Content (contenido y lógica), Growth (hoja y captura con `api/recurso.js`, `lm-auditoria-leads`).
- **Plazo:** semana 43.

**B · «El formulario que filtra». Las preguntas por sector, PDF de 6-8 páginas o página web (P1).**
- **Qué es:** las preguntas que separan a quien compra de quien curiosea, con los tramos de cada sector: formación, reformas, clínicas, inmobiliaria, lanzamientos y B2B. Sale de las preguntas del funnel v2.
- **Para cada pregunta:** por qué se hace, qué hacer con cada respuesta y cuántas preguntas como máximo.
- **Quién:** Head of Content.
- **Plazo:** semana 43, y se usa en el carrusel de la semana 42 como adelanto.

**C · «Calculadora de coste por venta». Web interactiva (P5).**
- **Qué pide:** inversión al mes, leads, % que contesta, citas, ventas y ticket.
- **Qué devuelve:** el coste por lead, por cita y por venta, dónde está la mayor caída y cuánto dinero se queda en la mesa si esa etapa mejora a un nivel razonable. El nivel razonable se marca como ejemplo y no promete nada.
- **Base:** la calculadora de fugas y el simulador del embudo ya existentes (reaprovechar código).
- **Captura:** el resultado se ve sin email. Con email se recibe el informe en PDF y una propuesta de revisarlo en 30 minutos.
- **Plazo:** semana 44.

**En la recámara** (noviembre o según demanda):
- **D · Checklist post-lanzamiento:** qué hacer con los leads que no compraron en las dos semanas siguientes (P4, lanzamientos).
- **E · Guion de las primeras 72 horas:** los mensajes y llamadas de los tres primeros días, adaptado del `playbook-lead-ab.md` interno (P3).
- **F · Mini-auditoría en vídeo:** «mándame tus cinco números y te grabo 5 minutos» (idea 4 y 5 de `ideas-octubre-leads-calidad.md`). Uno a uno, para A/B.

---

## 4. Landings

| # | Landing | Para quién | Contenido | Formulario | Estado |
|---|---|---|---|---|---|
| L1 | **Home** (`/`) | Tráfico orgánico, recomendaciones, marca | VSL, casos, formulario de tres pasos | `/api/diagnostico` con funnel v2 | **Hecha** (14-oct) |
| L2 | **Formación** (`/formacion/v21/`) | Paid de formación | Igual, con vocabulario de alumnos | Igual, con solicitudes y ticket | **Hecha**, en test contra el nativo |
| L3 | **ICP multisector**, propuesta: `/ya-inviertes/` | Paid frío y outbound del ICP: «ya invierto y no vendo» | Hero «Inviertes 2.000 € al mes en anuncios. ¿Cuántas ventas te traen?». VSL. Los cinco problemas en una tira. Casos con permiso. Formulario | Funnel v2 más **inversión en anuncios** y **quién atiende**. Precio junto al formulario (decisión de Maikel) | **Nueva**, semana 43 |
| L4 | **Variantes por sector de L3** | Paid por sector (reformas, clínicas, inmobiliaria, lanzamientos) | Misma plantilla. Cambian el titular, los ejemplos y el caso con `?sector=`, sin páginas nuevas que mantener | Igual que L3 | Semana 44 |
| L5 | **Páginas de recurso** (una por recurso) | Quien baja A, B o C | Qué se lleva, captura de email y gracias con vídeo, más la oferta «¿lo miramos juntos?» | `api/recurso.js` (`lm-*`) más preguntas opcionales de cualificación | Con cada recurso |
| L6 | **Prellamada** (`?paso=agenda` y `/confirmado/`) | Quien ya dejó datos | VSL, casos y agenda directa | Ninguno | **Hecha** |
| L7 | **`/para/<empresa>/`** (ya existe, noindex) | Outbound 1:1 | Mini-auditoría de su web y sus anuncios | Agenda | Se usa con la lista del §8 |

**Regla de las landings:** una sola llamada a la acción y la misma medición en todas. Cada landing nueva entra en el test solo después de que el anterior se lea.

---

## 5. Nurturing

### 5.1 Lo que ya funciona (no se toca)

- **Nurturing de seis correos** para leads de formación y clínicas (días 0, 2, 5, 8, 12 y 20). Se para si contesta, reserva o pide la baja (`api/_nurturing.js`).
- **WhatsApp de activación y llamada de Raquel** (`api/activacion.js`).

### 5.2 Nuevo: secuencia para quien baja un recurso («ICP-14»)

Siete correos en 14 días. Un problema por correo, un dato real y una sola llamada a la acción. **Solo para quien dio su email al bajar el recurso**, con su consentimiento. Ningún envío masivo sin ok escrito de Maikel (R17).

| Día | Asunto (borrador) | Problema | Contenido | CTA |
|---|---|---|---|---|
| 0 | «Tu auditoría de leads (y cómo leerla)» | — | El recurso y el vídeo de 3 min | Rellenarla |
| 1 | «El lead no es malo. La pregunta sí» | P1 | La «A que no era», anonimizada | Responder: «¿qué pregunta le falta a tu formulario?» |
| 3 | «Dos notas en vez de una» | P2 | Cómo puntuamos, con la demo de Intelligence (datos simulados) | Ver la demo |
| 5 | «Lo que pasa en la primera hora» | P3 | Lo que hacemos en el primer minuto y a las 2 h 30. Probar a Raquel | Probar la llamada |
| 7 | «Cuánto te cuesta una venta, no un lead» | P5 | Coste por cita frente a coste por lead (campaña de septiembre) | Calculadora |
| 10 | «Los que no compraron» | P4 | Seguimiento por motivo. Post-lanzamiento | Checklist |
| 14 | «¿Lo miramos con tus números?» | — | Qué pasa en el diagnóstico, el VSL y el precio de partida, si Maikel lo aprueba | Reservar diagnóstico |

- **Se para** en cuanto reserva o contesta, igual que el nurturing actual.
- **Después del día 14:** pasa a la newsletter semanal, si Maikel la reabre.

### 5.3 Newsletter «La fuga de la semana»

- **Cuándo:** jueves.
- **Qué lleva:** un problema, un dato y un recurso.
- **Estado:** el brief la tenía para la semana 45. **Propuesta:** adelantarla a la semana 44, solo a contactos con consentimiento (R17).

### 5.4 Después de la llamada

- **Si no compra:** seguimiento por motivo (plan de octubre §8), con el caso o el recurso que responde a su objeción.
- **En propuesta:** el recurso C con sus números como anexo.

---

## 6. Contenido por canal

### 6.1 Cadencia propuesta (necesita el ok de Maikel: es más de lo que pide el Content OS)

| Canal | Por semana | Formato | Quién | De Maikel |
|---|---|---|---|---|
| **LinkedIn de Maikel** (canal principal) | 5 posts y 1 documento-carrusel | Texto de 150-250 palabras, carrusel PDF de 6-8 láminas y encuesta quincenal | Head of Content y social | 15 min al día para comentar y responder |
| **Instagram** | 3 reels y 2 carruseles, más stories diarias con encuesta o pregunta | Reels de 30-60 s, voz de Maikel sobre pantalla. Carruseles en el molde crema y tinta | Vídeo y diseño | 1 sesión de voz de 45 min a la semana |
| **Blog** | 2 piezas (1 pilar o fuerte y 1 de apoyo o actualización) | Plantilla de `blog/estrategias-marketing-crm/`, con FAQ y un recurso | Head of Content | — |
| **YouTube** | 1 vídeo largo al mes, más los reels como shorts | «Auditoría en directo» de 15-20 min, anonimizada | Vídeo | 1 grabación al mes |
| **Correo** | Nurturing ICP-14 y newsletter desde la semana 44 | §5 | Head of Content y Growth | Ok a la audiencia |
| **Anuncios** | 3 ángulos por semana en test | §7 | Creative Performance y Paid | Ok a cada creativo |

**La regla del Content OS es una pieza fuerte por semana.** Para ir a por todo este mes, la propuesta es **dos piezas fuertes por semana**, una de blog y una de vídeo, con el resto derivado de ellas. Una idea se reparte en cinco formatos.

### 6.2 La máquina: de una idea, cinco piezas

Cada idea fuerte de la semana se convierte en:
1. un artículo o recurso, que es la pieza ancla;
2. 2-3 posts de LinkedIn, con ángulos distintos;
3. un carrusel, con el marco visual;
4. 1-2 reels, el gancho y el dato;
5. un correo del nurturing o de la newsletter, y un argumento para ventas.

### 6.3 Formatos muy visuales (lo que se entiende sin leer)

- **«Antes y después del clic»:** la misma campaña con el coste por lead y con el coste por venta. Es una tabla que gira.
- **Ficha de lead con dos notas:** captura de Intelligence, con datos simulados.
- **El formulario tachado:** las preguntas que no sirven, en rojo, y las que filtran, en verde.
- **Cronómetro de la primera hora:** línea de tiempo del minuto 0 a las 72 h.
- **El embudo con agujeros:** cada fuga, con lo que cuesta.
- **«Lo que dice tu agencia y lo que dice tu caja»:** dos columnas.
- **La auditoría en directo:** pantalla compartida con una hoja real anonimizada.

### 6.4 Ideas concretas (banco del mes, 40 piezas)

**LinkedIn (texto y documento):**

| # | Pilar | Gancho | Formato | Dato o fuente |
|---|---|---|---|---|
| 1 | P2 | «Dos notas en vez de una» | Texto | `_scoring.js` (borrador del 14-oct, listo) |
| 2 | P1 | «Mi formulario sabía cuánto invertía en anuncios. No sabía cuánto cobraba a sus clientes» | Texto | Daily del 5-oct (borrador del 13-oct, listo) |
| 3 | P1 | «Lo que tu formulario pregunta y lo que debería preguntar» | Documento | Funnel v2 (carrusel del brief s42) |
| 4 | P5 | «Inviertes 2.000 € al mes. Haz esta cuenta en un papel» | Texto | Campaña de septiembre |
| 5 | P5 | «Dos sectores, el mismo coste por contacto y el doble de citas» | Documento | `/blog/coste-por-lead/` |
| 6 | P3 | «Lo que pasa en nuestro primer minuto» | Texto | `activacion.js` |
| 7 | P3 | «Grabé cómo suena una llamada al lead a las 2 h 30» | Vídeo y texto | Bitácora de Raquel (sin datos del lead) |
| 8 | P4 | «En un lanzamiento, el dinero está en los que no compraron» | Tesis | Experiencia de Maikel: **necesita su fuente (R4)** |
| 9 | P2 | «El lead que más tardó en contestar acabó siendo el mejor» | Historia | **Solo si Maikel lo confirma con un caso real** |
| 10 | P1 | Encuesta: «¿qué % de tus leads de Meta merecen una llamada?» | Encuesta | Conversación (datos para la newsletter) |
| 11 | P5 | «Mi agencia me dice que el coste por lead es bueno» | Tesis contraria | Experiencia de Maikel |
| 12 | P4 | «Presupuestos sin respuesta: el seguimiento por motivo» | Documento | Plan de octubre §8 |

**Instagram (reels de 30-60 s):**

| # | Gancho (primeros 2 s) | Pilar |
|---|---|---|
| R1 | «Este formulario te está trayendo curiosos.» Pantalla con el formulario | P1 |
| R2 | «Tu comercial ha llamado a 40 leads hoy. ¿Cuántos podían comprar?» | P2 |
| R3 | «Cuenta hasta 60.» Cronómetro de la primera hora | P3 |
| R4 | «2.000 € en anuncios, 0 ventas. ¿Dónde está el problema?» El embudo con agujeros | P5 |
| R5 | «El lanzamiento ha terminado. Ahora empieza lo bueno» | P4 |
| R6 | «Llámame y verás.» Prueba de Raquel en pantalla | P3 |

Los tratamientos los escribe el skill `reel-premium` y los revisa `director-creativo`.

**Blog** (huecos del clúster, sin pisar lo que ya existe: cualificar-leads, coste-por-lead, leads-pero-no-ventas, seguimiento-comercial, presupuestos-sin-respuesta, origen-de-los-leads):

| # | Artículo | Búsqueda objetivo | Recurso enlazado |
|---|---|---|---|
| B1 | **Lead scoring: qué es y cómo montarlo con dos notas** (pilar) | lead scoring, cómo puntuar leads | A · auditoría de leads |
| B2 | **Leads de Facebook Ads de mala calidad: las 7 causas y cómo se arreglan** | leads de mala calidad facebook, leads basura meta ads | B · formulario que filtra |
| B3 | **Tiempo de respuesta a un lead: qué pasa en la primera hora** | tiempo de respuesta leads, speed to lead | Prueba de Raquel |
| B4 | **Cómo enviar tus ventas a Meta para que la campaña aprenda (conversiones offline)** | conversiones offline meta, api de conversiones crm | C · calculadora |
| B5 | **Qué hacer con los leads de un lanzamiento que no compraron** | leads lanzamiento, embudo evergreen seguimiento | D · checklist post-lanzamiento |
| B6 | **Leads para inmobiliarias: por qué no se convierten** (sectorial) | leads inmobiliaria | B |

Cada artículo pasa por el estándar (`content/estandar-articulos.md`) y el Master Reviewer.

### 6.5 Anuncios (para Creative Performance y Paid)

**Tres ángulos para el ICP, en un conjunto aparte del test de formación:**

| Ángulo | Gancho | Formato | Destino |
|---|---|---|---|
| **A · La cuenta** | «Inviertes 2.000 € al mes en anuncios. ¿Cuántas ventas te traen?» | Maikel a cámara (R14, lo decide él) o voz sobre pantalla con la calculadora | L3 |
| **B · El comercial quemado** | «Tu equipo llama a 40 leads al día. Tres podían comprar.» | Reel con texto en pantalla | L3 |
| **C · El recurso** | «Pega tus leads en esta hoja y mira cuántos valen la pena» | Carrusel o vídeo corto | L5 (auditoría de leads) |

- **Retargeting:** quien ve el 50 % del VSL (idea 6 de `ideas-octubre-leads-calidad.md`) y quien baja un recurso y no reserva.
- **Medición:** el coste por lead que encaja (etiqueta `fit-*` más inversión y equipo), no el coste por lead.

---

## 7. Prospección uno a uno (outbound)

1. **Lista:**
   - **Origen:** la Biblioteca de anuncios de Meta (pública), filtrada por España y por los sectores del ICP, con anuncios activos desde hace más de 30 días. Así sabemos que invierten.
   - **Contacto:** se enriquece a mano o con Apollo: dueño y director comercial.
   - **Tamaño:** 30 cuentas por semana.
2. **Toque:**
   - LinkedIn uno a uno: conexión y, a los 2-3 días, un mensaje con una observación concreta de su anuncio o su formulario.
   - Para A/B, una página `/para/<empresa>/` con la mini-auditoría.
3. **Lo que NO se hace:**
   - Correo en frío ni WhatsApp a contactos sin consentimiento (regla vigente).
   - Nada automatizado desde el número de Maikel (R9).
4. **Fragmento de Growth (brief s42, pieza 6):** «Muchos equipos califican por el tamaño de la empresa. Lo que decide suele ser otra cosa: cuánto vale cada venta. ¿Lo tenéis en la ficha?»

---

## 8. Calendario

### 8.1 Esta semana (jueves 15 a domingo 18, cierre de la semana 42 de cualificación)

| Día | Qué | Canal | Quién | Estado |
|---|---|---|---|---|
| **Jue 15** | 9:00-11:00 sesión del ICP (Google Calendar). Sale el perfil cerrado y las preguntas nuevas del formulario | Interno | Maikel y Claude | Agendada |
| Jue 15 | Post B «Dos notas en vez de una» | LinkedIn | Maikel, con su ok | Borrador listo |
| Jue 15 | Carrusel «Lo que tu formulario pregunta y lo que debería preguntar» (adelanto del recurso B) | LinkedIn e Instagram | Diseño | Por producir |
| Jue 15 | Guion del vídeo 5: la ficha con dos notas, 45 s | Interno | Head of Content | Por escribir |
| **Vie 16** | Post A «La A que no era», después de la llamada del 15 | LinkedIn | Maikel | Borrador listo |
| Vie 16 | Grabar la voz del vídeo 5 y de R1-R2 (una sesión de 45 min) | — | Maikel | — |
| Vie 16 | Cuadro de mando del viernes, con los leads del ICP marcados | Interno | Growth | — |
| Fin de semana | Montar la hoja de la auditoría de leads (recurso A) y su página | Web | Growth y Head of Content | — |

**Lo primero de Maikel esta semana:** pedir permiso por escrito a tres clientes (EAC, BelloVinilo y Nuria Roure) para usar su caso (R6). Sin eso no hay prueba social nueva.

### 8.2 El mes, semana a semana

| Semana | Tema (ligado al plan de octubre) | Pieza fuerte | Recurso | Landing | Correo | Anuncios |
|---|---|---|---|---|---|---|
| **S43 · 19-25 oct** | **La primera hora** (que contesten y reserven) | B1 · Lead scoring (pilar) y vídeo «nuestro primer minuto» | A · Auditoría de leads (lanzamiento) y B · Formulario que filtra | L3 `/ya-inviertes/` | ICP-14 activa para quien baja A | Ángulos A y C en test (conjunto aparte, presupuesto pequeño) |
| **S44 · 26-31 oct** | **De lead a venta** (seguimiento y cierre) | B4 · Conversiones offline y B2 · Leads basura | C · Calculadora de coste por venta | L4 variantes por sector | Newsletter n.º 1, si hay ok | Ángulo B y retargeting del VSL |
| **S45 · 2-8 nov** | **Los que no compraron** (lanzamientos y evergreen) | B5 · Post-lanzamiento y directo «auditoría en vivo» | D · Checklist post-lanzamiento | — | Newsletter n.º 2 | Mejor ángulo de S43-44 escalado |

### 8.3 Ritmo semanal de LinkedIn (desde la semana 43)

| Lun | Mar | Mié | Jue | Vie |
|---|---|---|---|---|
| «Agentizando»: lo que hemos cambiado en nuestro sistema y por qué | «Sin humo»: un dato y una lección | Bandera roja: el síntoma de una fuga | Documento-carrusel de la semana | Tesis contraria o encuesta |

---

## 9. Medición (cada viernes)

| Qué | Meta orientativa del mes | Fuente |
|---|---|---|
| Leads que encajan con el ICP (inversión y equipo, o `fit-*` B) | Primer número la semana 43; luego, que crezca | GHL (etiquetas) |
| Recursos descargados y % que encaja | 50 descargas acumuladas, 30 % ICP | `api/recurso.js` (`lm-*`) |
| Diagnósticos reservados desde contenido (UTM de blog, LinkedIn, recurso) | Medido por pieza | GHL, nota «Origen» |
| Comentarios de dueños o directores comerciales en LinkedIn | Contados a mano | LinkedIn |
| Coste por lead que encaja y coste por cita (paid ICP) | Frente al test de formación | Meta y GHL |

**Se mata** lo que en dos semanas no genere ni una conversación con alguien del ICP. **Se escala** lo que trae diagnósticos de ICP.

---

## 10. Quién hace qué

| Rol | Qué |
|---|---|
| **Maikel** | Permisos de casos (R6). Ok a cada pieza. 45 min de voz a la semana. 15 min al día en LinkedIn. Decisiones del §11 |
| **Head of Content (Claude)** | Briefs semanales, artículos, recursos A y B, correos ICP-14, guiones y revisión |
| **Social y diseño** | Carruseles, stories y programación |
| **Vídeo** | Reels, VSL cortado en piezas y vídeo largo mensual |
| **Creative Performance y Paid** | Ángulos, conjunto ICP, retargeting y lectura semanal |
| **Growth** | Preguntas del formulario, etiquetas, landing L3, captura de recursos, lista de prospección y cuadro de mando |

---

## 11. Decisiones que necesito de Maikel

| # | Decisión | Mi recomendación |
|---|---|---|
| 1 | **Permisos de casos** (R6): EAC, BelloVinilo y Nuria Roure | Pedirlos esta semana, con el texto exacto. Es lo que más mueve el plan |
| 2 | **Cadencia por encima del Content OS:** dos piezas fuertes por semana | Sí, solo este mes, y se revisa el 31-oct con los números |
| 3 | **Preguntas nuevas del formulario** (inversión en anuncios y quién atiende) | Sí en L3, no en el test de formación hasta que se lea |
| 4 | **Conjunto de anuncios ICP aparte** con presupuesto pequeño (p. ej. 15 €/día) | Sí, desde la semana 43 |
| 5 | **Precio en contenido** (R10 lo prohíbe; tú lo pusiste en las landings) | Solo en landings y en el correo 14. Nunca en redes ni en el blog |
| 6 | **Maikel a cámara** (R14) para el ángulo A | Sí para anuncios. En redes, voz sobre pantalla |
| 7 | **Newsletter en la semana 44**, en lugar de la 45 | Sí, solo a contactos con consentimiento (R17) |
| 8 | **Nombre de la landing L3** | `/ya-inviertes/`, o `/convertir-mas/` si prefieres algo más neutro |
