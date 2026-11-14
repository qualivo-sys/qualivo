# Contenido · hipótesis para el banco de noviembre

> **Para:** Growth, que consolida para el Chief of Staff. Encargo del 21-oct, con entrega el viernes 23-oct a las 18:00.
> **Alcance:** solo análisis. No se ha publicado ni cambiado nada para escribir esto. No toca E-01 (formulario de Meta) ni E-02 (confirmaciones).
> **Etiquetas:** **[C]** confirmado con fuente · **[E]** estimación · **[H]** hipótesis.
> **Sin datos personales.** Los prospectos y clientes van sin nombre; cuando hace falta, se remite al documento del Chief of Staff (`docs/chief-of-staff/2026-10-21-icp-cliente-que-compra.md`, rama `claude/festive-darwin-x3ngvj`).
> **ICE:** media de I, C y E, como en el banco v0.

---

## 0. El dato nuevo: el blog no ha traído ni un contacto

**Lectura de solo lectura del CRM (21-oct):**
- **El contexto:** 1.159 contactos en el CRM.
- **La etiqueta:** cada botón del blog y del diccionario lleva `utm_content=<artículo>`. `api/diagnostico.js` (líneas 81-82) lo convierte en la etiqueta `creativo-<artículo>`. **Al menos desde el 6-oct**, todos los botones la llevan (`git log -S`).
- **Ningún contacto** lleva una etiqueta de un artículo [C].
- **El mecanismo funciona:** otros contactos sí la llevan, con 7 etiquetas `creativo-*` distintas, todas de anuncios [C].

**Lo que no dice:** que el blog no tenga visitas. Las páginas cargan Vercel Web Analytics (`/_vercel/insights`), pero desde aquí no puedo leer ese panel. **Pregunta para Maikel:** acceso de lectura a Vercel Analytics, o que Growth exporte las visitas por artículo de octubre.

**Lo que sí dice:** en octubre, el blog no ha llevado a nadie al formulario del diagnóstico por su propio botón. Hay una vía que se escapa a la medición: quien lee, va a la home y rellena el formulario allí pierde el `utm`. Es la principal razón para no dar la C por cerrada.

---

## 1. H-12 corregida

**Original:** «Las piezas con un caso real generan conversaciones con encaje». Sin medición. I3 · C2 · E3 · 2,7.

**Corrección:**
1. **Medición:**
   - **Sí la hay para el blog.** Hay `utm_content` y una etiqueta en el CRM por artículo, y ahora tenemos el primer número: cero (sección 0).
   - **No la hay para redes,** porque están en pausa por la regla R16. Esa parte sigue sin medirse.
2. **El «caso real» está bloqueado por permisos.**
   - `content/casos-permisos.md` no tiene ninguna fila de permiso por escrito [C]. Por la regla R6, ninguna pieza nueva puede usar resultados de un cliente.
   - La hipótesis, tal como está, no se puede probar en noviembre sin antes pedir dos o tres permisos.
3. **Decisión: se descarta como está** y se sustituye por C-1 (el blog), que ya tiene medición y un dato. La parte de los casos queda como **requisito previo** de C-2 y C-4: pedir permiso por escrito a los dos clientes que siguen pagando.

---

## 2. Las cinco hipótesis

### C-1 · El blog atrae a quien aprende, no a quien compra (lead · O1)

> **Creemos que** el blog no trae leads porque responde búsquedas de quien está aprendiendo («qué es», «cómo se hace») y le pide de golpe la acción más cara, una reunión de 30 minutos. **Lo creemos porque** ninguno de los 1.159 contactos lleva una etiqueta del blog, con los botones etiquetados desde al menos el 6-oct, y porque las palabras clave registradas son casi todas informativas (`content/seo-keywords-usadas.md`). **Si** ponemos en los cinco artículos más cercanos al comprador un paso intermedio útil (la auditoría de leads, recurso A de la estrategia, que se descarga dejando el correo) y dejamos el diagnóstico como segundo botón, **esperamos** que aparezcan los primeros contactos con etiqueta del blog y saber si alguno encaja.

- **Etapa:** lead. **Objetivo:** O1.
- **Evidencia:**
  - 0 de 1.159 contactos con etiqueta del blog [C, lectura del CRM del 21-oct];
  - botones con `utm_content` [C, repositorio];
  - las visitas, sin leer [pendiente].
- **Confianza en la causa:** baja-media. No sabemos si el problema es el tráfico o la conversión.
- **Qué la refutaría:**
  - si Vercel Analytics muestra menos de unas 200 visitas al mes en esos cinco artículos, el problema es el tráfico y no el paso intermedio, y la hipótesis cambia;
  - con tráfico suficiente, si en 4 semanas ningún contacto llega por el recurso.
- **Experimento:**
  - **Paso 0** (1 h de agente, 0 €): leer las visitas por artículo de octubre en Vercel Analytics.
  - **Variable:** botón del recurso encima del botón del diagnóstico, en los artículos lead-scoring, conversiones-offline-meta, cualificar-leads, coste-por-lead y equipo-comercial-no-usa-el-crm.
  - **Métrica principal:** contactos con etiqueta `creativo-<artículo>-recurso`. **Secundaria:** cuántos de ellos encajan.
  - **Duración:** 4 semanas. **Presupuesto:** 0 €.
  - **Tiempo:** 6-8 h de agente (recurso, botón y entrega automática del PDF a quien lo pide, que es un correo transaccional y no un envío masivo) y 15 minutos de Maikel para aprobar el recurso.
  - **Éxito:** al menos 3 contactos por el recurso y al menos 1 que encaja.
  - **Parada:** 0 contactos en 4 semanas con al menos 200 visitas a esos artículos.
  - **Contaminación:** ninguna con E-01 ni E-02, porque son otras páginas y otro formulario.
- **ICE:**
  - **I 4:** aunque funcione, el blog tarda meses en traer volumen, así que pesa poco en el MRR de noviembre.
  - **C 4:** el cero es real, pero no sabemos cuántas visitas hay.
  - **E 7:** coste 0 € y se monta en dos días.
  - **ICE 5,0.**
- **Coste:** 0 €. **Días hasta lanzar:** 3, contando el ok al recurso.

---

### C-2 · Una página para reenviar al que decide (cierre · O2)

> **Creemos que** muchas propuestas no se firman porque quien estuvo en la reunión tiene que convencer después a quien decide, y no tiene con qué. **Lo creemos porque**:
> - 6 de 11 propuestas se presentaron sin el decisor delante [C, Outbound en el banco v0, H-01];
> - la objeción que más pesa en el comprador que paga es «ya me vendieron una implantación que no se usó» [C, Tactiq, documento del CoS §2];
> - en octubre se repitió «lo veo con el equipo y te digo» [C, daily de Growth del 8-oct, `/blog/quien-decide-la-compra/`].
>
> **Si** cada propuesta va con una página corta pensada para reenviarla, con el problema en sus palabras, el piloto con hito de uso, el VSL de 5:38 y un solo paso siguiente, **esperamos** más segundas reuniones con el decisor y más propuestas firmadas.

- **Etapa:** cierre. **Objetivo:** O2.
- **Qué la refutaría:** si en las siguientes 6 propuestas con página la página no se abre (cada una lleva su `utm` y su evento) o se abre sin que haya ninguna segunda reunión con el decisor.
- **Experimento:**
  - **Variable:** página de propuesta reenviable, una por propuesta, generada desde una plantilla. Ya hay propuestas web en `propuestas/`, así que se aprovecha el formato.
  - **Métrica principal:** propuestas con segunda reunión con el decisor. **Secundaria:** aperturas de la página y reproducciones del VSL.
  - **Duración:** las 6 propuestas siguientes o 6 semanas, lo que llegue antes. Es lectura de antes y después, no un A/B (ajuste 2.6 del CoS).
  - **Presupuesto:** 0 €.
  - **Tiempo:** unas 3 h de agente para la plantilla y 1 h por propuesta. Unos 10 minutos de Maikel por propuesta para revisarla.
  - **Éxito:** al menos 3 de 6 propuestas con segunda reunión con el decisor, cuando la base de H-01 es «sin decisor» en 6 de 11.
  - **Parada:** página sin abrir en 4 de las 6 primeras.
  - **Contaminación:** alta con H-01, porque es la misma etapa. **Propuesta:** que forme parte de la regla de propuesta de H-01, no que vaya como experimento aparte.
- **Requisito:** el caso con cifra solo entra si hay permiso por escrito (R6). Sin permiso, la página va sin caso: problema, piloto, hito y vídeo.
- **ICE:**
  - **I 8:** está pegada al cobro, con dos propuestas por semana.
  - **C 5:** la evidencia del decisor ausente es sólida; que una página lo resuelva es una suposición.
  - **E 8:** cuesta 0 € y reutiliza la plantilla y el VSL.
  - **ICE 7,0.**
- **Coste:** 0 €. **Días hasta lanzar:** 4.

---

### C-3 · Un vídeo antes de la reunión (reunión · O2)

> **Creemos que** parte de las reuniones no son efectivas porque el contacto llega sin saber qué vamos a mirar ni qué tiene que traer. **Lo creemos porque**:
> - en los diagnósticos grabados, el encaje se descubre dentro de la reunión, y a veces es nulo [C, documento del CoS §2, el anti-ICP];
> - la página de gracias enseña el calendario a todos, sin preparar a nadie (nota de sistema del 15-oct).
>
> **Si** en la página que ve justo después de reservar (no en los WhatsApp de E-02) ponemos un vídeo de 60-90 segundos con qué miramos en 30 minutos y las tres preguntas de encaje (solicitudes al mes, quién las atiende, qué CRM usan), **esperamos** más reuniones con el encaje confirmado antes de empezar.

- **Etapa:** reunión. **Objetivo:** O2.
- **Evidencia:** sobre el efecto, ninguna. Por eso C es baja.
- **Qué la refutaría:** si el porcentaje de reuniones con encaje confirmado (métrica de ICP-4) no cambia en las 15 reuniones siguientes.
- **Experimento:**
  - **Variable:** vídeo y tres preguntas en la confirmación de la web.
  - **Métrica principal:** reuniones con encaje confirmado. **Secundaria:** reproducciones del vídeo.
  - **Duración:** 15 reuniones o 5 semanas. **Presupuesto:** 0 €.
  - **Tiempo:** 4 h de agente y 20 minutos de Maikel para grabar el vídeo.
  - **Éxito:** más reuniones con encaje que en las 15 anteriores.
  - **Parada:** 5 semanas sin diferencia.
  - **Contaminación:** **alta con E-02.** Es el mismo tramo (de la reserva a la reunión), así que se lee mal mientras se miden los plantones. **Solo después de cerrar E-02**, y a la vez que ICP-4.
- **ICE:**
  - **I 6:** una reunión mejor preparada acorta el camino a la propuesta.
  - **C 3:** sin evidencia del efecto.
  - **E 7:** 0 € y la grabación es corta.
  - **ICE 5,3.**
- **Coste:** 0 €. **Días hasta lanzar:** 3, después de E-02.

---

### C-4 · LinkedIn para el comprador real: el proceso después del lead, no la IA (lead · O1)

Es la hipótesis de contenido para el perfil de comprador que pide Maikel.

> **Creemos que** el comprador que paga (dueño o gerente de una empresa con demanda, equipo que atiende y un CRM a medio usar) responde a piezas que nombran su problema con sus palabras («mi equipo no usa el CRM», «el presupuesto que nadie volvió a llamar», «no damos abasto con las solicitudes») y no a piezas sobre IA o agentes. **Lo creemos porque**:
> - es el patrón de quien puede pagar en los ocho diagnósticos grabados [C, documento del CoS §2];
> - lo apoyan el posicionamiento que propone Maikel y la regla de no usar «IA» como argumento en frío [C, propuesta V2 de septiembre].
>
> **Si** publicamos cuatro piezas en el LinkedIn de Maikel (una por semana, con el problema y un dato propio) y comparamos con lo publicado antes de la pausa, **esperamos** conversaciones con perfiles que encajan.

- **Etapa:** lead. **Objetivo:** O1.
- **Qué NO se da por hecho:** la edad del comprador, que no sepa de tecnología ni que sus campañas sean malas. Las piezas no lo dicen ni lo insinúan. Hay perfiles que encajan y miden muy bien sus números (documento del CoS §3).
- **Evidencia del canal:**
  - no hay datos recientes, porque LinkedIn está en pausa por R16;
  - hay borradores listos con dato propio en `content/borradores/`: «dos notas» (14-oct), la tesis del coste por lead (16-oct), «28 cualificados» (20-oct) y el trato sin importe (21-oct).
- **Qué la refutaría:** si ninguna conversación con un perfil que encaja (dueño, gerente o director comercial de una empresa con equipo) llega en 4 piezas.
- **Experimento:**
  - **Variable:** piezas dirigidas al decisor con su problema, frente a lo publicado antes de la pausa.
  - **Métrica principal:** conversaciones iniciadas con perfiles que encajan (comentario con pregunta o mensaje privado), apuntadas a mano en una tabla.
  - **Duración:** 4 semanas. **Presupuesto:** 0 €.
  - **Tiempo:** 2 h de agente por pieza y unos 20 minutos de Maikel por pieza (es la cifra del CoS para ICP-3).
  - **Éxito:** al menos 3 conversaciones que encajan y al menos 1 diagnóstico.
  - **Parada:** 0 conversaciones que encajan en las dos primeras piezas, para revisar el ángulo.
  - **Contaminación:** baja. Es otro canal, y el enlace lleva `utm_source=linkedin`.
- **Es ICP-3 del CoS**, con los ángulos concretos y el criterio de «encaja» escrito.
- **Requisito:** que Maikel levante la pausa de redes por escrito, solo en LinkedIn (R16).
- **ICE:**
  - **I 6:** es el canal natural del decisor, pero lento.
  - **C 4:** el patrón del comprador es sólido; el canal, sin datos.
  - **E 7:** 0 € y piezas ya escritas.
  - **ICE 5,7.**
- **Coste:** 0 €. **Días hasta lanzar:** 1 desde el ok.

---

### C-5 · «Te lo paso por privado», versión que cabe en la guía de voz (lead · O1)

Es el reel de «comenta X» que preguntó Maikel, reformulado.

> **Creemos que** la mecánica de pedir algo por privado funciona si lo que se ofrece es una herramienta para el decisor y no un cebo. **Lo creemos porque** la mecánica tiene tracción en general [H, sin dato propio]. Pero Growth opina, con razón, que el público del reel de Instagram no compra, y la guía de voz prohíbe el «comenta y te lo mando» como cebo [C]. **Si** en LinkedIn (no en Instagram) ofrecemos la plantilla de auditoría de leads (el mismo recurso de C-1) con «si la quieres, escríbeme y te la paso», sin pedir el comentario como condición, **esperamos** peticiones de perfiles que encajan y alguna conversación que acabe en diagnóstico.

- **Etapa:** lead. **Objetivo:** O1.
- **Qué la refutaría:** si las peticiones llegan casi todas de perfiles que no encajan (autónomos, agencias o estudiantes), aunque sean muchas.
- **Experimento:**
  - **Variable:** una pieza con oferta de recurso por privado.
  - **Métrica principal:** peticiones de perfiles que encajan. **Secundaria:** diagnósticos que salen de esas peticiones.
  - **Duración:** 2 semanas desde la publicación. **Presupuesto:** 0 €.
  - **Tiempo:** 2 h de agente si ya existe el recurso de C-1, y 30-60 minutos de Maikel para contestar los mensajes uno a uno (sin respuestas automáticas, R9).
  - **Éxito:** al menos 3 peticiones que encajan.
  - **Parada:** peticiones que encajan por debajo del 20 % del total.
  - **Contaminación:** comparte recurso y canal con C-1 y C-4. **Va como una de las cuatro piezas de C-4, no aparte.**
- **ICE:**
  - **I 5:** puede abrir conversaciones con el decisor.
  - **C 3:** la mecánica no está probada con este comprador.
  - **E 6:** necesita el recurso y tiempo de Maikel para contestar.
  - **ICE 4,7.**
- **Coste:** 0 €. **Días hasta lanzar:** depende de C-1, unos 5.

---

## 3. Resumen para el consolidado

| ID | Etapa | Objetivo | I | C | E | ICE | € | Días | Nota |
|---|---|---|---|---|---|---|---|---|---|
| H-12 | — | — | — | — | — | — | — | — | **Se descarta como está.** Sustituida por C-1. Los casos quedan como requisito (permisos) |
| **C-2** | Cierre | O2 | 8 | 5 | 8 | **7,0** | 0 | 4 | Mejor dentro de la regla de H-01 |
| C-4 | Lead | O1 | 6 | 4 | 7 | 5,7 | 0 | 1 desde el ok | Necesita levantar R16 solo en LinkedIn |
| C-3 | Reunión | O2 | 6 | 3 | 7 | 5,3 | 0 | 3 después de E-02 | No antes de cerrar E-02 |
| C-1 | Lead | O1 | 4 | 4 | 7 | 5,0 | 0 | 3 | El paso 0 (leer las visitas) va ya, fuera de la cartera |
| C-5 | Lead | O1 | 5 | 3 | 6 | 4,7 | 0 | ~5 | Dentro de C-4 |

**Mi orden:**
1. **C-2,** dentro de H-01: es lo más cerca del cobro y no gasta hueco de experimento.
2. **El paso 0 de C-1** ya: es una corrección (leer datos), no un experimento.
3. **C-4 con C-5 dentro,** si Maikel levanta la pausa de LinkedIn.
4. **C-3** cuando cierre E-02.

---

## 4. Preguntas que quedan escritas (no se le piden a Maikel aparte)

1. **Vercel Analytics:** ¿quién tiene acceso para leer las visitas por artículo de octubre? Sin eso, C-1 no tiene base.
2. **Permisos por escrito de los dos clientes que siguen pagando.** Sin ellos, ningún caso con cifra en contenido nuevo (R6).
3. **¿Se levanta la pausa de redes solo en LinkedIn?** Bloquea C-4 y C-5.

## 5. Aviso de privacidad sobre el documento base

El documento del CoS `docs/chief-of-staff/2026-10-21-icp-cliente-que-compra.md` está en una rama de este repositorio, que es **público**. Lleva:
- nombres de clientes y prospectos;
- frases literales de reuniones grabadas;
- importes de propuestas abiertas.

Recomiendo pasarlo a Notion y dejar en la rama solo los códigos. Este documento no copia nada de eso.
