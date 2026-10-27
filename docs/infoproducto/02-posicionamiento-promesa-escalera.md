# 2-4 · Posicionamiento, promesa y escalera de producto

**Estado:** terminado para decidir el 29-oct (v1, 27-oct-2026). Nada de esto se publica.
**Etiquetas:** **[C]** comprobado con fuente · **[E]** estimación · **[H]** hipótesis.
**Fuentes internas:** instrucción maestra del Chief of Staff (25-oct), ICP del 21-oct, propuesta de valor V1 (10-sep), biblioteca de dolores, plan de contenidos del 27-oct y el estudio de mercado (`01-mercado-y-competidores.md`).

---

## Antes de nada: el problema de fondo

**Quien paga a Qualivo no compra cursos.** El ICP del 21-oct dice que paga una empresa con equipo comercial, CRM infrautilizado y un decisor sin tiempo [C]. Esa persona quiere que se lo hagan.

**Quien compra cursos se parece al «anti-ICP»**: dueño que lo hace casi todo y que no llega a 1.500 € + 800 €/mes (el caso de Vicente) [C].

Esto no es malo. Es la razón para hacer el infoproducto: **monetiza a quien hoy Qualivo descarta**, sin competir por el mismo cliente. Pero obliga a dos cosas:

1. El avatar tiene que ser **el negocio que ya capta y no puede pagar el servicio completo**, no la empresa de 40 personas.
2. El infoproducto tiene que **tener límites de horas cerrados**. Si no, se convierte en un segundo trabajo, que es justo lo que la instrucción maestra prohíbe («la marca no puede convertirse en un segundo negocio»).

---

## 2 · El hueco y el posicionamiento

### 2.1 Avatar principal (uno)

> **Dirección o propiedad de una academia o centro de formación privada en España** (oposiciones, cursos profesionales, idiomas, escuelas técnicas, formación online con asesores) que:
> - ya invierte en anuncios (Meta o Google), entre **500 y 3.000 € al mes** [E];
> - vende cursos de **300 a 5.000 €** [E];
> - atiende las solicitudes con **1 a 3 personas**, o la propia dirección, por teléfono y WhatsApp;
> - tiene un CRM o una hoja de cálculo que nadie mantiene;
> - **no puede o no quiere pagar** una agencia que se lo monte (1.500 € de entrada y 500-900 €/mes) [C, precios de las propuestas actuales].

**Su frase:** «Me entran solicitudes, pero no sé cuántas se pierden ni por qué. Cuando llamamos, ya no se acuerdan».

**Por qué formación y no «pymes de servicios»:**

| Razón | Fuente |
|---|---|
| Los dos clientes que siguen pagando son formación con equipo de admisión | ICP 21-oct, tabla 6.1 [C] |
| Los casos con resultado son de formación o infoproducto: EAC, Eleva, Focus Practical, Nuria Roure | ICP 21-oct y `casos/` [C] |
| Ya existen la landing de formación, el vídeo del sistema de formación, la llamada de demo de formación y el análisis de competencia de anuncios de formación | Rama `claude/qualivo-landing-vercel-nubk1i` [C] |
| Ciclo corto y medible: solicitud → llamada → matrícula. Se puede prometer un indicador sin prometer ingresos | [E] |
| En el mercado nadie vende «el sistema de admisiones» por sector | `01`, hueco H3 [C] |

**Quién no es el avatar (y por qué):**

- **Aspirantes a montar una agencia de IA.** Es el mercado más saturado y vive de promesas de ingresos que chocan con la política de Meta [C]. Además, Qualivo formaría a su competencia.
- **Empresas con equipo comercial de 5 o más y CRM.** Son el ICP del servicio. Se les ofrece el diagnóstico, no el curso.
- **Infoproductores con webinars y closers** (como Nuria Roure). Encajan bien, pero Growth los trabaja como vertical de clientes. **Segundo avatar** para la segunda edición, si la primera funciona.

### 2.2 El problema que resuelve

El dinero de la academia ya está gastado cuando llega la solicitud. Se pierde **después**:

| Etapa | Qué pasa | Dolor de la biblioteca |
|---|---|---|
| Respuesta | Se contesta horas después, o al día siguiente | D-COM-02 |
| Cualificación | Se llama a todos por orden de llegada | D-COM-01 |
| Agenda y asistencia | La cita se da y la persona no aparece | D-OPS-08 y borrador «recordatorio que pide un sí» |
| Propuesta y seguimiento | Se envía el precio y nadie vuelve a escribir | D-COM-10 |
| Medición | El informe acaba en el lead, no en la matrícula | D-MKT-09 |

### 2.3 Por qué Qualivo y no otro

1. **Es lo que Qualivo ya hace con academias reales**, no un curso escrito desde fuera. El sistema que se enseña es el mismo que funciona hoy en clientes [C].
2. **El curso termina en la matrícula, no en el lead.** Los cursos de anuncios acaban en el formulario y los de n8n/GHL enseñan la herramienta [C].
3. **Se entrega montado**: plantillas de GHL importables, flujos de n8n, guiones de WhatsApp y llamada, panel de métricas. No solo vídeos.
4. **Cumple la normativa española**: WhatsApp oficial, consentimiento, LSSI y RGPD. Ningún competidor revisado lo trata [C/H].
5. **El propio lanzamiento es la demo**: quien se apunte recibirá la respuesta en un minuto, el recordatorio que pide un «sí» y el seguimiento. Vive el sistema antes de comprarlo.

### 2.4 Cómo no ser «otro curso de embudos con ChatGPT»

Maikel ve las piezas actuales «muy ChatGPT/Claude». La diferencia no puede venir del tono. Viene de **cosas que solo tiene Qualivo**:

| Regla | Qué significa en la práctica |
|---|---|
| **Cada lección parte de una pantalla real** | Se graba sobre el sistema funcionando (datos simulados o anonimizados), no sobre diapositivas |
| **Cada lección deja algo instalado** | Un flujo, una plantilla, un guion o un indicador. Si no instala nada, sobra |
| **Casos con permiso o no hay caso** | Sin permiso escrito no hay nombre ni cifra (ver 4.5) |
| **Errores propios** | Lo que falló en Qualivo: el anuncio «Ya inviertes» con 0 envíos, los formularios largos, las campañas despausadas. Eso no lo inventa una IA |
| **Voz de Maikel, sin guion leído** | Los agentes preparan esquema y materiales. Maikel graba hablando, en una toma, sobre la pantalla |
| **Nada de «IA» como argumento** | Igual que en la propuesta V1: la IA es el medio, nunca el tema [C] |

---

## 3 · Propuesta de valor y promesa

**Nombre de trabajo:** *Sistema Matrícula* (provisional; el nombre se valida en la encuesta).

### 3.1 La promesa

> **En 6 semanas, tu academia tendrá montado el sistema que va del anuncio a la matrícula:**
> **cada solicitud recibe respuesta en menos de 5 minutos, ninguna se queda sin siguiente paso y sabes cuánto te cuesta cada matrícula por campaña.**
> Con nuestras plantillas, nuestra revisión y sin cambiar de CRM si ya tienes uno.

**Por qué es medible y creíble:**

| Indicador de la promesa | Cómo se mide | ¿Depende del alumno? |
|---|---|---|
| Primera respuesta en menos de 5 minutos, 24 horas al día | Registro del flujo: hora de la solicitud frente a hora del primer mensaje | Solo de que instale el flujo |
| 100 % de solicitudes con siguiente paso y fecha | Informe del CRM o de la hoja: solicitudes sin tarea abierta | Del uso. Se revisa en la semana 5 |
| Coste por matrícula por campaña visible | Panel de 30 días con anuncios y matrículas cruzados | Del registro de matrículas |

**Lo que no se promete:** ni ingresos, ni número de matrículas, ni un retorno concreto. Las cifras de casos se presentan como **resultados de un cliente concreto, no como resultado esperable**, y solo con permiso.

### 3.2 Garantía propuesta

> Si haces las tareas de cada semana y al final de la semana 6 el sistema no cumple los tres indicadores, **te acompañamos en la siguiente edición sin coste o te devolvemos el dinero**, lo que prefieras.

Está ligada a lo que Qualivo controla (que el sistema funcione), no a lo que no controla (las ventas). [H: validar redacción con asesor legal; ver punto 9].

### 3.3 Normativa de publicidad (resumen; detalle en el punto 9)

- **Ley General de Publicidad y Ley de Competencia Desleal:** nada de cifras que no sean representativas sin decir que no lo son ([Ley 34/1988](https://www.boe.es/buscar/act.php?id=BOE-A-1988-26156), art. 3) [C].
- **Política de Meta sobre resultados irreales:** prohibido prometer ingresos o hacerse rico rápido. Revisa también la página de destino ([Meta](https://transparency.meta.com/policies/ad-standards/deceptive-content/unrealistic-outcomes)) [C vía índice].
- **Testimonios:** reales, con permiso escrito y sin editar el sentido.
- **Precio:** si se vende a particulares, se muestra con IVA incluido [H: confirmar con asesor; el avatar es empresa, pero muchos serán autónomos].

### 3.4 Mensajes de trabajo (borradores para probar, no para publicar)

| Uso | Borrador |
|---|---|
| Titular | «Tus anuncios ya traen solicitudes. Las matrículas se pierden después.» |
| Subtítulo | «Monta en 6 semanas el sistema que responde en un minuto, da a cada solicitud un siguiente paso y te dice cuánto te cuesta cada matrícula.» |
| Para quién | «Para academias que ya invierten en anuncios y atienden con una a tres personas.» |
| Para quién no | «Si no inviertes en captación, este programa no es para ti. Empieza por ahí.» |
| Objeción «ya lo hacemos» | «Sí, cuando os acordáis. El sistema no depende de que alguien se acuerde.» |

---

## 4 · Escalera de producto y precios

**Regla que manda:** el infoproducto **no puede pasar de 4 horas semanales de Maikel** de media [E, límite propuesto]. Cada escalón dice sus horas.

### 4.1 La escalera

| Escalón | Qué incluye | Precio orientativo | Margen [E] | Horas de Maikel |
|---|---|---|---|---|
| **0 · Imán** · *Simulador del embudo para academias* + *guía de las 5 fugas* | **Ya existen** en `recursos/simulador-embudo/` (Excel con fórmulas y PDF), sin indexar y pendientes del ok de Maikel desde el 29-sep [C]. Solo hace falta revisarlos y publicarlos | **0 €** | — | ~1 h de revisión, una vez |
| **1 · Entrada** · *Kit Primeras 72 horas* | Plantillas listas: secuencia de respuesta y seguimiento (día 0, 2, 5, 10), guion de cualificación de 3 preguntas, recordatorio que pide un «sí», hoja de métricas. Vídeo de 45 min montándolo | **47 € IVA incl.** (38,84 € de base) | ~97 % (Stripe ≈ 1 €) | ~3 h para grabar, una vez. Soporte: 0 (preguntas por email, las filtra un agente) |
| **2 · Principal** · *Sistema Matrícula*, edición en grupo | 6 semanas. 6 módulos grabados + 6 sesiones en directo de 75 min (una por semana) + 2 revisiones en vídeo del sistema de cada alumno + grupo privado durante la edición y 30 días más. Plantillas de GHL, flujos de n8n, guiones, prompts de agentes y panel de métricas. **Máximo 15 alumnos por edición** | **690 € + IVA**. Edición fundadora: **490 € + IVA** | ~95 % antes de horas (Stripe y herramientas ≈ 15 €/alumno) [E] | ~25 h para montar, una vez. **~4 h/semana durante la edición** (ver 4.3) |
| **3 · Alta** · *Implantación hecha contigo* | Qualivo monta el sistema en la cuenta del alumno en 4 semanas, con sus anuncios y su CRM. Incluye el programa | **2.900 € + IVA** [E] | ~70 % [E] | ~12 h por cliente. **Máximo 2 al mes** |
| **Salida** · Servicio de Qualivo | Para quien crece y tiene equipo: diagnóstico → piloto → sistema, con los precios actuales | Los actuales: piloto ~1.500 € y recurrente 447-900 €/mes [C] | El del servicio | El del servicio |

**Lo que no se hace en la primera versión:** comunidad de pago mensual. Exige presencia diaria y es el formato más barato y saturado del mercado (10-77 $/mes) [C]. Se revisa tras la tercera edición.

### 4.2 Por qué estos precios

- **47 €** está en la franja de los cursos grabados (37-197 €) [C] y es una compra impulsiva. Su función es convertir seguidores en compradores, no ganar dinero.
- **690 €** queda en el tramo vacío entre 197 € y 2.995 € [C]. Es menos que un mes de agencia y menos que una sola matrícula media del avatar [E].
- **2.900 €** es la mitad de lo que cuesta un año de servicio recurrente, pero sin recurrencia. Sirve a quien quiere que se lo hagan una vez.

### 4.3 Horas de Maikel por edición del programa principal

| Tarea | Horas | Quién más ayuda |
|---|---|---|
| 6 sesiones en directo de 75 min | 7,5 h | Agente de Contenido prepara guion y resumen |
| 2 revisiones en vídeo de 10 min por alumno (15 alumnos) | 5 h | Un agente prepara la lista de fallos del sistema del alumno antes de cada revisión |
| Soporte en el grupo | 6 × 1 h = 6 h | Un agente responde primero con el material; Maikel solo lo que el agente no resuelve [H: se prueba en la primera edición] |
| Preparación y cierre | 3 h | — |
| **Total** | **~21,5 h en 6 semanas ≈ 3,6 h/semana** | |

**Rentabilidad por hora [E]:** 12 alumnos × 690 € = 8.280 € de base por edición. Con ~21,5 h de entrega son **~385 €/hora**. Si se suman las ~25 h de montaje, la primera edición queda en **~180 €/hora** y las siguientes mejoran. **Con el precio fundador** (12 × 490 € = 5.880 €) la primera edición queda en **~125 €/hora**: es el precio de validar.

### 4.4 Cómo evitar canibalizar el servicio

1. **No se vende el programa a clientes activos** de Qualivo.
2. **Filtro en la compra:** si el comprador tiene 5 o más personas en ventas o invierte más de 3.000 €/mes, se le propone el diagnóstico antes que el curso.
3. **El programa enseña a montar, no opera.** Qualivo sigue vendiendo lo que el alumno no quiere hacer: operar, medir, optimizar.
4. **Riesgo aceptado [E]:** alguna academia que hoy pagaría 500 €/mes comprará el programa. Se mide en cada edición cuántos alumnos encajaban en el servicio.

### 4.5 Casos que pueden servir de prueba y permisos necesarios

**Ninguno se cita con nombre ni cifras sin permiso escrito.** Ya existe el procedimiento: la regla R6 y el registro `content/casos-permisos.md`. A 27-oct **el registro no tiene ninguna fila**: no hay ningún permiso escrito [C]. Los casos que ya publica `qualivo.io/casos/` los revisa el Chief of Staff con Growth. Este documento solo trata su uso en el infoproducto.

| Caso | Qué aportaría | Permiso que haría falta | Alternativa sin permiso |
|---|---|---|---|
| **EAC** (escuela aeronáutica) | El caso de formación más completo: del anuncio a la matrícula | Escrito de la gerencia que autorice: nombre, logo, cifras concretas, capturas del sistema (sin datos personales) y uso en anuncios de pago | «Una escuela técnica privada» con el sistema y sin cifras |
| **Eleva** (academia) | Equipo de 3 comerciales: encaja con el avatar | Igual que EAC. Más permiso de cada comercial si aparece su voz o su imagen | «Una academia con tres asesoras» y el antes y el después cualitativo |
| **Nuria Roure** (webinars) | Seguimiento de la base sin captar más. Útil para el segundo avatar | Escrito que autorice nombre y cifras **y** que se hable de su modelo de webinars. Las 273 ventas desde abril necesitan permiso aparte y verificación contra su CRM | «Una formadora con webinars» sin cifras |
| **Equipzilla** | Rescate de una cuenta. No es formación | Escrito. Ojo: hay un canal de órdenes abierto; la petición pasa por Maikel | No usar en este producto |
| **El sistema de Qualivo** | Su propio CRM, el vigía de los 15 minutos, el recordatorio que pide un «sí» | No hace falta | — |

**Propuesta:** usar el procedimiento R6 tal como está: Maikel enseña al cliente el texto exacto y el cliente contesta «sí» por escrito. Este agente prepara el texto exacto para EAC y Eleva. Para el infoproducto hay que añadir dos usos al texto: **en anuncios de pago** y **en material de un curso de pago**. **No se envía sin Maikel.**
