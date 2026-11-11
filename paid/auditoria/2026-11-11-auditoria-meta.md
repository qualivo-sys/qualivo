# Brief y auditoría completa de Meta Ads de Qualivo · 11-nov-2026

> **Para qué es:** Maikel quiere contrastarlo con ChatGPT. Está escrito para quien no conoce Qualivo.
> **Fuentes:** Meta Marketing API (cuenta de Qualivo), GHL (pipeline Prospección) y los guiones del repo, consultados el 11-nov a las 10:00 de Madrid.
> **Marcas:** [C] dato confirmado · [E] estimación.
> **Sin datos personales:** los nombres de leads se han omitido.

---

## 1. El negocio

### 1.1 Qué vende Qualivo
Qualivo es una agencia española. Monta y opera el sistema comercial completo de sus clientes, de la captación a la matrícula o la venta:
- **Captación:** anuncios en Meta y Google, formularios y landings.
- **Primera respuesta automática:**
  - Un WhatsApp redactado con las palabras del lead, en minutos.
  - Si no contesta, una llamada de voz con IA.
- **Cualificación automática:** puntuación del lead del nivel A al D.
- **Seguimiento:** cadencias de WhatsApp, email y llamadas hasta que reserva o se descarta.
- **CRM:** GoHighLevel. Se monta sobre el CRM del cliente o se le da uno.
- **Medición:** panel propio («Intelligence») que muestra qué campaña trae ventas reales, no solo formularios. Además, las etapas del CRM vuelven a Meta como señales de calidad.

**Cómo se presenta:** «siete agentes de IA sobre el sistema comercial que ya tienes; no sustituimos tu CRM ni a tu equipo».

### 1.2 A quién vende
- **Nicho principal ahora:** academias y centros de formación con cursos de 300 € o más que ya invierten en anuncios.
- **Probados antes:** clínicas (sobre todo dentales y estéticas), empresas de reformas y asesorías.

### 1.3 Ticket y objetivo
- **Cliente ganado en octubre con Meta:** 3.600 € [C].
- **Qué cuenta como éxito:** una RC (reunión cualificada). Es una reunión celebrada con quien decide, con un problema que resolvemos y capacidad de 1.200 €/mes o más, o 1.500 € o más de puesta en marcha. Solo cuenta cuando Maikel la marca en el CRM.
- **Objetivo de Maikel:** unas **20 reuniones al mes**. El objetivo formal de noviembre para Meta es 6 RC.
- **Presupuesto de noviembre:** tope de 1.450 €. Llevamos gastados 499,52 € (del 1 al 11) [C].
- **Restricciones de Maikel:**
  - No usar casos de clientes en los anuncios (desde el 29-oct).
  - Descartar a quien no invierte nada o vende por debajo de 300 €.
  - Ningún cambio ni gasto sin su OK.

### 1.4 La oferta de entrada de los anuncios
Un **diagnóstico gratuito** de 15-30 minutos: revisar «los ocho puntos entre el anuncio y el cierre» y salir con un plan por escrito, se contrate o no.

---

## 2. Qué pasa después del lead

1. **Entra el lead:** el formulario nativo de Meta lo manda por API a GHL en segundos. Se etiqueta con el anuncio, las respuestas y el canal.
2. **Filtro automático (desde el 4-nov):** si declara «no invierto nada» o un ticket menor de 300 €, se marca como perdido, se manda «Disqualified» a Meta y no se le escribe.
3. **WhatsApp 1:** sale al momento. Si el lead entra de noche, sale a las 07:00.
   - Lo escribe un agente de IA con una pregunta abierta.
   - Ejemplos: «¿sabes qué campaña te trajo tu último cliente? El último cliente, no el último lead» o «de los que piden información, ¿cuántos acaban entrando en una llamada?».
4. **Si contesta:** el agente conversa y empuja a reservar hora. El calendario está en qualivo.io/diagnostico.
5. **Si no contesta:** WhatsApp 2 al día siguiente, WhatsApp 3 a los 2 días, y fin de la secuencia. Hay llamada de voz con IA en el sistema, pero **no hay llamada humana en los primeros 5 minutos**.
6. **Puntuación:**
   - **Tipología (0-10):** inversión, ticket y volumen.
   - **Comportamiento (0-10):** si contesta, cuánto tarda y cuánto habla.
   - Con eso sale el **nivel A, B, C o D**.
7. **Etapas del pipeline:** Nuevo → En cadencia → Conversación abierta → Reunión agendada → Confirmado → (No presentado) → Oferta enviada → Segunda reunión → Negociación → Piloto → Cliente. También están «No responde» y «Más adelante».
8. **Señales a Meta (Conversions API), desde el 3-nov también para leads antiguos:** Contacted, Schedule, Qualified, Converted y Disqualified. **Pero las campañas siguen optimizando por «lead»**: no hay volumen para optimizar por Qualified.

---

## 3. Los anuncios: qué dicen y cómo son

### 3.1 El anuncio que funciona: «AD · VERT · formacion · FORM CUALIF», activo desde el 19-oct
- **Formato:** vídeo de 70 s, en dos versiones: 4:5 para feed y 9:16 para stories.
- **Vídeo («sistema», hecho en septiembre):**
  - **Imagen:** pantalla partida entre el móvil del lead y el CRM, con un reloj. Sigue a un alumno ficticio desde que pide información hasta el informe de la mañana siguiente. Las pantallas recrean el sistema real.
  - **Voz:** locución con IA y la voz real de la agente de llamadas («Raquel»).
  - **Lo que cuenta:**
    1. Entra en tu CRM ordenado: de dónde viene, qué quiere y si merece la primera llamada.
    2. En dos minutos tiene respuesta, con sus palabras y no con una plantilla.
    3. Si no contesta, le llama una voz que sabe por qué preguntó, y le da hora. Se oye un fragmento de la llamada.
    4. Si se enfría, alguien insiste; si contesta, se para.
    5. Cada mañana sabes qué anuncio te trae clientes y cuál solo formularios.
    6. Siete agentes de IA dentro del CRM que ya tienes.
    7. Pide el diagnóstico gratuito.
- **Texto principal:**
  > Un alumno pide información a las 00:00.
  > A los 4 segundos está en el CRM sin que nadie copie nada. A las 9:30 le ha llamado una voz, le ha resuelto dudas y le ha dado hora. A los 3 días, si no se ha matriculado, hay fecha de seguimiento y siguiente paso, sin que nadie tenga que acordarse.
  > Siete agentes sobre el sistema comercial que ya tienes. No sustituimos tu CRM. No sustituimos a tu equipo.
  > Pide el diagnóstico de tu sistema y te decimos qué parte hay que arreglar.
- **Titular:** «¿Qué pasa cuando un alumno pide información?»
- **Descripción:** «Caso de ejemplo en una academia».
- **Botón:** «Solicitar» (APPLY_NOW).
- **Formulario:** el de cualificación de 5 preguntas (ver 4.2).
- **Es el mismo vídeo y el mismo texto** que el anuncio de septiembre «AD · VERT · formacion». Solo cambia el formulario.

### 3.2 Los vídeos de Javier (30-oct a 8-nov, todos en pausa)
- **Formato:** presentador a cámara («Javier»), 51-54 s.
- **Guion de la versión «arranque»:**
  > «¿Vendes formación? Te llegan contactos… y no compran. Atraes a quien no encaja. No sabes quién quiere comprar de verdad. Y pierdes oportunidades por falta de seguimiento. En Cuálivo conectamos las tres partes: captación, cualificación y seguimiento comercial. Atraemos oportunidades con más potencial. Las atendemos y cualificamos automáticamente, por WhatsApp o por teléfono, y todo queda registrado. Y conectamos el seguimiento con tus datos comerciales, para saber qué está funcionando. Así puedes detectar dónde pierdes oportunidades, mejorar tu proceso de ventas y decidir con datos. ¿Quieres saber dónde está fallando tu proceso? Solicita un diagnóstico de captación y ventas con Cuálivo.»
- **La versión «conciso»** es igual, pero el gancho es más largo: «¿Inviertes en publicidad para vender tu formación, te llegan contactos… pero muchos no terminan comprando?»
- **Texto principal:**
  > Si vendes formación e inviertes en anuncios, el problema puede estar en tres sitios: a quién atraes, cómo filtras o qué pasa después del contacto. Conectamos captación, cualificación y seguimiento comercial para que veas dónde se te escapan las ventas. Diagnóstico gratuito para negocios cuyos clientes pagan 500 € o más.
- **Titular:** «¿Dónde está fallando tu proceso?»
- **Descripción:** «Solicita tu diagnóstico de captación y ventas».
- **Usado ahora en el retargeting** (desde el 10-nov), con el formulario de cualificación.

### 3.3 Otros anuncios del histórico
- **Clínicas y reformas (septiembre):** el mismo vídeo «sistema», adaptado al sector. Textos del tipo «Un paciente pide precio a las 00:00…» y «Marta pide presupuesto de una reforma a las 00:00…».
- **«3V2 demo-caso v2» (octubre):**
  - Texto: «Tu comercial dice que los leads de Meta no se matriculan. Antes de darle la razón, mira el anuncio que los trajo…».
  - Vídeo de 60 s.
  - Una versión iba a formulario y otra a landing.
- **«HERO 06» (septiembre):** imagen tipográfica con «Facturas más y no sabes por qué», enlazada a un test web de 90 s, no a un formulario.
- **G1 y G4 (6-nov, en pausa):** el mismo vídeo del viejo con los primeros segundos cambiados:
  - G1: «¿Sabes qué campaña te trae matrículas… y cuál solo formularios?»
  - G4: «¿Ya tienes a alguien con los anuncios? Perfecto: no venimos a sustituirle…»
  - A Maikel no le convencen.
- **Estáticos v3 (10-nov, sin lanzar):** 4 imágenes sobre pantallas reales del panel, con datos simulados:
  - «¿Cuántas matrículas te trajo cada anuncio?»
  - «Sabes con quién hablar primero»
  - «El sistema prepara el mensaje. Tu equipo lo aprueba»
  - «Tu próxima matrícula ya está en tu base de datos»
  - Botón: «Pide tu diagnóstico».

---

## 4. Los formularios, pregunta a pregunta

### 4.1 Formulario de septiembre: «Qualivo_FORMACION_sep2026» (1786744439184083)
- **Portada:** «Formación: te piden información, ¿y después qué?»
  - Para academias y centros de formación que YA invierten en captación.
  - Quince minutos revisando los ocho puntos entre el anuncio y el cierre.
  - Sales con un plan por escrito, lo hagas con nosotros o no.
- **Preguntas (3):**
  1. ¿Cuánto invertís al mes en conseguir clientes? → Más de 5.000 € · 2.000-5.000 € · 500-2.000 € · Menos de 500 € · Todavía no invierto nada
  2. ¿Cuántas solicitudes de información recibes al mes? → Más de 100 · 50-100 · 20-50 · Menos de 20
  3. ¿Dónde crees que se te está escapando el negocio? → Tiempo de respuesta · Seguimiento de presupuestos · Anuncios y captación · Web y formularios · No lo sé, eso es lo que quiero averiguar
- **Después:** nombre, empresa, email y teléfono (rellenados por Meta).
- **Pantalla de «mayor intención»:** sí.
- **Pantalla final propia:** «Hecho. Te escribo en unos minutos. Te mando un WhatsApp con una pregunta para preparar la llamada. Si prefieres coger hueco tú directamente, pulsa abajo», con el botón **«Elegir hora ahora»** (al calendario).
- **Leads totales:** 24.
- **Resultado [C]:**
  - Septiembre: 179,94 € → 14 leads, **13 €/lead**.
  - Octubre: 250,50 € → 11 leads, **23 €/lead**.

### 4.2 Formulario actual: «Qualivo_FORMACION_cualif_oct2026-copy» (2063720777591278)
- **Portada:** la misma que la de septiembre.
- **Preguntas que ve el usuario (5):**
  1. ¿Cuántas solicitudes comerciales recibís al mes? → Menos de 20 · 20-49 · 50-99 · 100 o más
  2. Una de tres variantes de «¿Cuánto vale un cliente para vosotros?», según la respuesta anterior (pregunta condicional) → Menos de 300 € · 300-999 € · 1.000-4.999 € · 5.000 € o más
  3. ¿Cuánto invertís en publicidad al mes? → Menos de 500 € · 500-999 € · 1.000-2.999 € · 3.000 € o más · Captamos por otros canales o no lo sé
  4. ¿Qué os gustaría mejorar? → Calidad de los leads · Conversión en ventas · Seguimiento comercial · Volumen de solicitudes · No sabemos dónde está el problema
  5. ¿Cuándo queréis mejorarlo? → Próximos 30 días · Próximos 3 meses · Más adelante · Solo explorando
- **Después:** nombre, empresa, email y teléfono.
- **Pantalla de «mayor intención»:** sí.
- **Pantalla final propia:** **ninguna** (la API la devuelve vacía). Meta muestra su pantalla por defecto con un enlace a qualivo.io/diagnostico/?paso=agenda.
  - **Es una diferencia con septiembre:** antes había un mensaje que anunciaba el WhatsApp y un botón grande de «Elegir hora ahora».
- **Leads totales:** 11.
- **Resultado [C]:** del 20-oct al 11-nov, 532,02 € → 11 leads, **48 €/lead**.

### 4.3 Formularios de prueba de noviembre (todos en pausa)
- **Corto, 2 preguntas (1426444132403939):**
  - ¿Cuánto paga un alumno? (<300 · 300-999 · 1.000+)
  - ¿Cuánto invertís en publicidad? (Nada · <500 · 500-1.500 · >1.500)
  - Sin pantalla de «mayor intención». 3 leads.
- **4 preguntas (1656098466017561):** inversión · precio medio del curso · cuándo · qué problema tenéis. 1 lead.
- **4 preguntas con filtro y redirección a landing (1904975540667086 y 1159030153221849):** 0 leads.
- **Reformas, 4 preguntas (1448120514052614):** 1 lead.

---

## 5. Segmentación y estructura actuales

- **Campaña:** QV_VERTICALES_Sep26, con objetivo Leads. Presupuesto por conjunto (ABO) y puja al menor coste. Atribución: 1 día después del clic.
- **Conjunto «VIEJO»** (el que funciona), 40 €/día:
  - **Público:** España, 25-65 años, sin intereses, con Advantage+ audience.
  - **Exclusiones:** quien abrió formularios antiguos, quien vio vídeos y un lookalike (de 1 % a 1 % de España).
  - **Ubicaciones:** feed y stories de Facebook e Instagram. Reels se añadió el 10-nov.
  - **Aprendizaje:**
    - Antes del 10-nov: «aprendizaje limitado».
    - Desde el 10-nov: «LEARNING», reiniciado por el cambio de Reels.
- **Conjunto de retargeting** (desde el 10-nov), 10 €/día hasta el 24-nov:
  - **Públicos de 90 días:**
    - visitantes de la web (unas 20 personas);
    - interacción en Instagram y en la página de Facebook;
    - quien abrió un formulario sin enviarlo;
    - quien vio el 25 % de los vídeos.
  - **Excluye** a quien ya envió el formulario y a quien ya compró.
  - **Ubicaciones:** feed, stories y Reels.
  - **Anuncio:** vídeo «arranque» de Javier con el formulario actual.

---

## 6. Resultados

### 6.1 Por mes, toda la cuenta [C]

| Mes | Gasto | Impresiones | Precio por mil impresiones | Clics al enlace | Leads (Meta) | Coste por lead |
|---|---|---|---|---|---|---|
| Septiembre | 697,99 € | 27.053 | 25,80 € | 341 | 38 | **18 €** |
| Octubre | 1.142,79 € | 39.381 | 29,01 € | 401 | 29 | **39 €** |
| Noviembre (1-11) | 499,52 € | 21.900 | 22,80 € | 161 | 11 | **45 €** |

### 6.2 Embudo en GHL, solo leads de Meta [C]

| Mes | Leads | A | B | C | D | Reunión agendada | Reunión celebrada | Qualified | Cliente |
|---|---|---|---|---|---|---|---|---|---|
| Septiembre | 33 | 12 | 2 | 7 | 12 | **21** | **9** | 3 | 1 |
| Octubre | 27 | 8 | 7 | 6 | 3 | 12 | 3 | 8 | 1 (3.600 €) |
| Noviembre (1-11) | 11 | 2 | 3 | 2 | 4 | **2** | 0 (y 1 no presentado) | 0 | 0 |

RC marcadas en noviembre: 0.

### 6.3 Por anuncio, de septiembre a noviembre (los de más gasto) [C]

| Anuncio | Gasto | Leads | Coste por lead |
|---|---|---|---|
| Formación · formulario de cualificación (actual) | 532,02 € | 11 | 48 € |
| Formación · formulario de septiembre | 430,44 € | 25 | 17 € |
| Clínicas · septiembre | 405,89 € | 11 | 37 € |
| Reformas · septiembre | 186,38 € | 15 | 12 € |
| Formación · demo-caso v2 | 134,28 € | 5 | 27 € |
| Javier, 7 versiones (noviembre) | 146,53 € | 4 | 37 € |
| HERO 06, estático | 11,48 € | 2 | 6 € |

### 6.4 El anuncio actual, semana a semana [C]

| Semana | Gasto | Impresiones | Frecuencia | Precio por mil | Clics | Leads | Vio el 25 % | Vio el 100 % |
|---|---|---|---|---|---|---|---|---|
| 20-26 oct | 128,27 € | 6.673 | 1,70 | 19,22 € | 46 | 3 | 282 | 56 |
| 27 oct-2 nov | 119,41 € | 6.947 | 1,53 | 17,18 € | 38 | 2 | 275 | 51 |
| 3-9 nov | 214,30 € | 11.927 | 1,57 | 17,96 € | 43 | 6 | 408 | 81 |
| **10-11 nov** | 70,04 € | 1.780 | 1,11 | **39,34 €** | 4 | **0** | 48 | 8 |

- **Retención del vídeo:** solo un 3-4 % de quien lo ve llega al 25 %, y menos del 1 % lo ve entero.
- **Clic al enlace:** en torno al 0,5 %.
- **Del clic al lead:** alrededor del 8 %.

### 6.5 Ubicaciones y público del anuncio actual (20-oct a 9-nov) [C]
- **Feed de Instagram:** 258,75 € → 8 leads (32 €).
- **Feed de Facebook:** 116,67 € → 1 lead (117 €).
- **Stories de Instagram:** 78,58 € → 1 lead.
- **Por edad y sexo:**
  - Hombres de 45-54: 4 leads con 78 €.
  - Mujeres de 25-34: 3 leads con 29 €.
  - Mujeres de 35-44: 0 leads con 62 €.

---

## 7. Historial de cambios (por qué Meta no ha podido aprender)

- **17-18 sep:** lanzamiento por sector (formación, clínicas, reformas y asesorías) con formularios de 3 preguntas.
- **8-13 oct:** «demo-caso v2», con formulario de 5 preguntas y con landing.
- **19-oct:** se duplica el anuncio de formación con el formulario de cualificación largo. Pasa a ser el principal.
- **27-oct:** E-02, prueba de ganchos QV_11 (0 leads).
- **30-oct a 8-nov:** Javier en 7 versiones y 5 formularios nuevos, con cambios casi diarios.
- **3-nov:** se amplían las señales del CRM a Meta.
- **4-nov:** filtro automático de inversión y ticket. Se reactiva el viejo.
- **5-nov:** el viejo pasa a 36 €/día. Luego, a 40 €/día.
- **6-nov:** se montan G1 y G4 en pausa.
- **10-nov:** Reels en el viejo (reinicia el aprendizaje), retargeting nuevo y tope de 1.450 €.

---

## 8. Incidencia actual (10 y 11 de noviembre)

- **Reels no ha entregado nunca:** 0 impresiones desde que se añadió. El creativo asigna la versión 4:5 a feed y la 9:16 a stories, pero ninguna a Reels [C sobre la configuración, E sobre la causa].
- **Tras el cambio, el anuncio rinde mucho peor:**
  - El precio por mil impresiones pasa de unos 18 € a 39 €.
  - El 60 % del gasto se va al feed de Facebook, la peor ubicación del histórico.
  - Stories de Facebook: 7,22 € por 11 impresiones, una cifra anómala.
- **Llevamos más de 50 h sin leads.** El último entró el 9-nov a las 07:16.
- **Decisión de Maikel:** esperar hasta el viernes 13 sin tocar nada. Si sigue sin leads, quitar Reels.

---

## 9. Diagnóstico de Paid

1. **El problema es el volumen, no la calidad.** Con 40 €/día y el formulario largo salen unos 0,8 leads al día. Ni con un 100 % de buenos llegaríamos a 20 reuniones al mes.
2. **Septiembre fue el mejor mes en reuniones:** 21 agendadas y 9 celebradas con 698 €. Se hizo con formularios de 3 preguntas y una pantalla final que empujaba a reservar hora. Desde entonces se ha añadido fricción (más preguntas, filtros, sin pantalla final propia) y el embudo se ha secado.
3. **Hemos cambiado demasiado.** Meta no ha tenido ni una semana estable desde el 30-oct, salvo el anuncio viejo, y ahora también lo hemos tocado.
4. **El vídeo engancha poco:** un 3-4 % llega al 25 %. El mismo vídeo funcionó en septiembre por volumen, pero tiene 2 meses y no se ha renovado.
5. **Del lead a la reunión se pierde gente:** leads buenos que no contestan al WhatsApp, y nadie los llama.
6. **No hay segundo anuncio ganador.** Todo depende de un solo anuncio.

## 10. Opciones sobre la mesa

- **A) No tocar el viejo hasta el viernes 13.** Si no entra ningún lead, quitar Reels. Es lo que se ha decidido.
- **B) Recuperar el formulario de septiembre** (3 preguntas y pantalla final con «Elegir hora ahora») con el mismo vídeo, en un conjunto nuevo a 15-20 €/día. Se mantiene el filtro de «no invierto nada» en el CRM.
- **C) Lanzar los estáticos v3** en un conjunto nuevo a 8 €/día.
- **D) Ubicaciones Advantage+** en un conjunto aparte, con una versión del vídeo asignada a Reels.
- **E) Llamada humana en los primeros 5 minutos** a los leads A y B. No cuesta nada.
- **F) Renovar el vídeo con un gancho nuevo** en los primeros 3 segundos.
- **G) Google Search de alta intención.** El paquete está listo, pero no hay cuenta.

## 11. Preguntas para ChatGPT

1. Con 1.400 €/mes y el objetivo de unas 20 reuniones al mes, ¿formulario corto con volumen (septiembre) o largo con calidad (ahora)? ¿Cómo combinarías los dos?
2. ¿Esperarías a que el viejo se estabilice tras el cambio de Reels, o lo devolverías ya a como estaba?
3. ¿Qué estructura de campaña y conjuntos recomiendas para probar sin romper lo que funciona? ¿Presupuesto por conjunto (ABO) o por campaña (CBO)?
4. ¿Advantage+ en ubicaciones y público, o acotar a Instagram?
5. ¿Cómo mejorarías un gancho de vídeo que solo retiene al 3-4 % hasta el 25 %? ¿Qué creativo probarías primero?
6. ¿Optimizarías por «lead» o por un evento del CRM (Qualified o Schedule) con este volumen?
7. ¿Qué harías en los próximos 7 días, en orden?
