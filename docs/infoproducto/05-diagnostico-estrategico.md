# 5 · Diagnóstico estratégico de la oportunidad

**Encargo:** «7. PRIMER ENCARGO» del marco de trabajo de Maikel (27-oct). No incluye temario ni landing.
**Estado:** v1 para la sesión del jueves 29-oct (15:00-17:00). Cierre el viernes 30-oct.
**Relación con lo anterior:** `01` (mercado) sigue valiendo. `02`-`04` partían del avatar «academias»; este diagnóstico **lo revisa y lo cambia**. Quedan como antecedente hasta que Maikel decida.
**Etiquetas:** **[C]** comprobado con fuente · **[E]** estimación · **[H]** hipótesis · **[R]** recomendación.

> **En cinco líneas**
> 1. La idea tal como está («aprende a construir un sistema de captación y ventas con IA») **no tiene cliente definido** y **promete más de lo que hoy se puede demostrar**. Varias piezas siguen siendo experimentales y ningún caso tiene permiso escrito.
> 2. En la matriz ponderada gana **B · propietarios de pequeñas agencias** (69/100), seguido de **E · responsables de marketing y ventas de pymes** (63). **Academias**, mi recomendación anterior, queda cuarta (59): hay leads, pero no hay evidencia de que paguen.
> 3. Conviene vender un **sistema implementable**: componentes probados, método y verificación. Ni herramientas, que caducan y se venden a 10-77 $/mes, ni una metodología sola, que es difícil de diferenciar y se abandona.
> 4. Antes de construir hay que **validar dos cosas en 3-4 semanas**: si las agencias pagan por implantar el sistema en un cliente y si una pyme paga un taller para su equipo comercial. Todo con preventa o depósito, no con «me interesa».
> 5. Hay **dos decisiones que solo puede tomar Maikel** y cambian todo: si acepta enseñar a posibles competidores y qué parte del sistema está dispuesto a abrir.

---

## 1 · Evaluación crítica de la idea inicial

### 1.1 Qué se puede demostrar hoy (verificado en el repositorio)

Maikel pidió separar lo demostrado de lo real y de lo experimental. Resultado de revisar el repositorio y los partes de los agentes:

| Afirmación del contexto | Clasificación | Evidencia | Matiz |
|---|---|---|---|
| «Más de 100 funnels» | **Sin evidencia en el repo** | Se pueden probar unos **21 clientes** (17 que pagaron en 2026 y 4 más en la auditoría de operaciones), **15 propuestas** con landing o demo y **unas 8 landings propias** por sector. En total, 40-50 piezas [C] | La cifra 100 no aparece en ningún documento. Puede venir de la etapa anterior a Qualivo: **pregunta 6** |
| Meta Ads y Google Ads | **Experiencia real** | Cambios de Meta en EAC con identificadores reales; registro de cambios de Meta de Qualivo en el bus de Growth; Google Ads de Eleva y Adigital [C] | En Qualivo hay gasto y pocas reuniones. La auditoría de operaciones menciona incidencias de pago en la cuenta de Meta [H: verificar; **pregunta 10**] |
| Landings, formularios y conversión | **Experiencia real** | `api/_funnel-v2.js`, landings por ciudad de un prospecto, imanes de EAC [C] | El funnel v2 está en modo sombra: solo etiqueta |
| Scoring e IA para cualificar | **Experiencia real**, con una medición | Scoring A-D en `api/_scoring.js`. Playbook de cualificación sobre 428 leads de EAC: responder al WhatsApp multiplica la conversión por 2,3 [C] | No hay medido el efecto del scoring en ventas |
| Email, WhatsApp y seguimiento | **Experiencia real, con fallos** | Seguimiento 2/5/10, activación y rescate de leads [C] | WhatsApp parado 2 días sin aviso, tope de 20 envíos al día y un fallo de la ventana de 24 h sin corregir desde el 18-sep [C] |
| GoHighLevel | **Experiencia real (fuerte)** | En producción en Qualivo, EAC, Eleva y Focus [C] | — |
| Pipedrive | **Sin evidencia** de integración | Solo aparece como señal para prospectar y en Equipzilla [C] | — |
| Brevo | **Experiencia real, débil** | Base antigua de Qualivo y un repositorio de Equipzilla en otra cuenta [C] | — |
| n8n y APIs | **Experiencia real** | n8n llegó al tope de ejecuciones el 24-oct, así que se usa [C] | Los tres flujos de EAC están inactivos [C] |
| Agentes de voz | **Experimental** | 1 conversación útil de 6 en la primera prueba; Twilio caído desde el 15-oct; el agente nuevo, sin probar [C] | No se puede enseñar como pieza probada |
| Agente de WhatsApp | **Experiencia real** | El 22-oct contestó en 1 minuto, propuso hora y el lead cerró 3.600 € [C] | Un caso (n=1) |
| Claude y Claude Code | **Experiencia real** | Panel en vivo de EAC (GHL, Meta, Google, Search Console, GA4), informes automáticos, Intelligence [C] | Intelligence es sobre todo una demo con datos simulados [C] |
| Experimentación | **Experiencia real, en arranque** | Sistema de experimentación del 21-oct, bitácoras [C] | El test «Ya inviertes» cambió tres variables a la vez [C] |

**Los casos con cifra:**

| Caso | Cifra publicada | ¿Hay datos primarios en el repo? | ¿Permiso escrito? |
|---|---|---|---|
| EAC | 10,2× | **No.** El propio panel de EAC dice que no calcula ingresos ni retorno porque no hay columna de matrícula. Además, ningún mes del panel tiene los 559 leads de la página del caso [C] | No [C] |
| Eleva | CPL −61 % | No. La fuente es una nota de septiembre que está fuera del repo [C] | No |
| Nuria Roure | 6,45× | Solo la página del caso. La historia se ha contado con versiones distintas en borradores [C] | No |
| Bellovinilo · Focus Practical | 8,3× · −53 % | Solo la página del caso [C] | No |
| Equipzilla | ROAS 0,1 → 7,6 | No. Además, un inventario interno describe a Equipzilla como **empleador** de Maikel, no como cliente [C], y la instrucción maestra lo lista como cliente de 2.850 €/mes [C] | No · **pregunta 7** |

El registro de permisos (`content/casos-permisos.md`) **está vacío** [C].

**Conclusión:** hoy se puede demostrar **un sistema real en producción, con sus fallos**. No se puede demostrar con datos **un resultado de cliente** que se pueda publicar. Para un infoproducto, la prueba es el activo principal: sin ella, la promesa tiene que ser modesta o hay que conseguir la prueba antes de vender.

### 1.2 Puntos fuertes de la idea

1. **Hay un hueco real.** Nadie vende el recorrido completo después del lead como un sistema [C, `01`].
2. **Experiencia en producción, no de laboratorio.** GHL, WhatsApp, scoring, seguimiento y paneles funcionan con clientes que pagan [C].
3. **Hay piezas ya documentadas para reutilizar:** los playbooks de panel comercial, atribución UTM y cualificación de leads, el informe automático de EAC y el proceso comercial [C].
4. **Hay una venta reciente que ilustra el mecanismo** (respuesta en 1 minuto → cita → 3.600 €) [C], aunque es un solo caso.

### 1.3 Puntos débiles

| # | Debilidad | Por qué importa |
|---|---|---|
| D1 | **Sin cliente definido.** El concepto vale para cualquiera que «quiera aprender» | Un producto para todos no se puede anunciar ni medir |
| D2 | **Promesa más grande que la prueba** (ver 1.1) | Riesgo de publicidad engañosa y de perder credibilidad con compradores técnicos |
| D3 | **Once componentes** en la hipótesis | Construirlos, mantenerlos y dar soporte no cabe en ≤ 4 h/semana [E] |
| D4 | **Mucho sistema sin procedimiento escrito.** Todo `api/`, la configuración de GHL, los agentes de voz e Intelligence solo existen como código o notas [C] | Convertirlo en material didáctico es trabajo nuevo |
| D5 | **Dependencia de herramientas que cambian**: GHL, n8n, la API de WhatsApp (Meta cobra los mensajes de servicio desde el 1-oct-2026 [H]), los modelos de IA | Contradice el principio 11 del marco de Maikel |
| D6 | **Piezas experimentales dentro del temario**: voz y, en parte, WhatsApp | Un alumno que reproduzca la avería pide su dinero |
| D7 | **Confusión entre interés en IA y compra.** En España, la oferta de freelancers de IA creció un 32 % y la demanda de proyectos un 11 % en un año (Malt) [C] | Mucho público quiere «aprender IA» y poco paga por lo que construye |

### 1.4 Veredicto

**La idea es buena como dirección y mala como producto tal como está.** Hay que:
- estrecharla a **un cliente**;
- reducirla a los **componentes que están probados**;
- **conseguir la prueba** (permisos y datos primarios) antes de prometer resultados.

---

## 2 · Las tres oportunidades más prometedoras

| | **O1 · Sistema implementable para pequeñas agencias y consultores** | **O2 · Programa para el equipo comercial de una pyme** | **O3 · Kit y programa vertical para academias** |
|---|---|---|---|
| **Qué es** | La agencia aprende a montar en **su primer cliente** el recorrido después del lead (respuesta, cualificación, seguimiento, panel), con plantillas y verificación | Taller práctico de 1-2 días (o 4 sesiones) con la empresa: que el equipo responda rápido, siga cada oportunidad y use el CRM. Deja plantillas instaladas | Kit de plantillas y edición en grupo para que la academia monte su sistema de admisiones |
| **Para quién** | Agencias de 1-49 personas que ya venden anuncios o webs y quieren vender «lo de después» | Gerencia, dirección comercial o marketing de pymes con equipo y CRM infrautilizado: **el ICP del servicio** | Academias que captan con anuncios y no pueden pagar el servicio |
| **Por qué podría funcionar** | Pueden **revender** lo que aprenden. En España, un WhatsApp con IA se cobra a 2.000-8.000 € por proyecto [C, precio de un proveedor], así que el retorno de un programa de 1.000-1.500 € es evidente. Y nadie vende el recorrido completo [C] | La falta de personal cualificado es la primera barrera a la IA en las empresas españolas (Banco de España) [C]. El uso de IA en empresas de 10 o más pasó del 21,1 % al 33,6 % en un año (INE) [C]. Hay vehículo de pago: FUNDAE, con casi la mitad del crédito sin usar [C] | Ya entran unos 8 leads de formación por semana a ~11 € [C]. Nadie les vende un programa [C] |
| **Evidencia a favor** | Tamaño: 12.396 agencias de 1-9 personas y 1.090 de 10-49 (INE, CNAE 731) [C]. Qualivo ya las encuentra: 20 de 133 prospectos de una muestra eran agencias competidoras [C] | Las objeciones del ICP son de proceso («la gente no usa el CRM») [C, ICP 21-oct] | Leads y conversaciones reales [C] |
| **Evidencia en contra** | Ninguna encuesta española mide si pagan [C: no existe]. El mercado de «monta tu agencia» está saturado, aunque sobre todo de principiantes [C] | No hay dato de formación en IA vía FUNDAE [C]. El crédito de una microempresa es pequeño (~420 €/año [H]). Venta B2B más lenta | 3 de 4 citas de formación fueron plantón; 5 de 8 invierten menos de 500 € [C]. Ninguna evidencia de que paguen por formación [C] |
| **Qué tendría que ser cierto** | Que al menos 1 de cada 10 agencias contactadas con relación previa pague una preventa; que acepten un método ajeno; que Maikel acepte formar a posibles competidores | Que una pyme pague 2.500-4.500 € por un taller; que el taller lleve a contratar el servicio en al menos 1 de cada 5 casos | Que paguen 490-690 € a pesar del bajo compromiso |
| **Cómo validarlo** | 6 entrevistas + taller piloto de pago (2 h, 49-97 €) + preventa | 4 entrevistas con el ICP + oferta de taller a 2-3 empresas que ya han hablado con Qualivo | Preventa ya diseñada en `03` |
| **Coste de validar [E]** | ~6 h de Maikel, 0-150 € | ~3 h de Maikel, 0 € | ~10 h, ≤ 500 € |
| **Cuándo descartarla** | Menos de 3 preventas o depósitos tras 30 conversaciones cualificadas | Ninguna empresa acepta propuesta tras 3 ofertas formales | Menos de 4 preventas (`03`, 7.2) |
| **Riesgo principal** | Formar a la competencia y una marca confusa | Se parece al servicio: es casi consultoría, no infoproducto | Canibalizar el servicio y el soporte a alumnos con poco nivel técnico |

**[R] Orden recomendado:** validar **O1 y O2 en paralelo**, porque comparten material y piden poco tiempo. **O3 queda en reserva**: vale más como vertical o caso dentro de O1 y O2 que como segmento propio.

---

## 3 · Hipótesis principales a validar

Ordenadas por cuánta incertidumbre eliminan.

| # | Hipótesis | Métrica que la confirma | Prueba | Si es falsa |
|---|---|---|---|---|
| H1 | Las pequeñas agencias **pagan** por aprender a implantar el recorrido después del lead | ≥ 3 preventas o depósitos de 100 € en 30 conversaciones cualificadas | Entrevistas + taller piloto de pago + preventa | Se descarta O1 |
| H2 | Una pyme con equipo comercial **paga** 2.500-4.500 € por un taller práctico para su equipo | ≥ 1 propuesta aceptada de 3 enviadas | Oferta a empresas que ya conocen a Qualivo | Se descarta O2 |
| H3 | El comprador valora más **el sistema instalado** que el método o la herramienta | En entrevistas, ≥ 60 % elige «me lo dejas montado y verificado» frente a «aprendo la herramienta» | Pregunta de elección forzada en la entrevista | Se cambia el formato |
| H4 | Maikel puede entregar con **≤ 4 h/semana** de media | Horas registradas en el piloto | Taller piloto | Se reduce el alcance o se para |
| H5 | Los componentes probados son **reproducibles** en la cuenta de otro | Un tercero monta el recorrido mínimo en ≤ 6 h siguiendo el material | Prueba con 1-2 alumnos piloto | Primero se procedimenta y se arreglan fallos |
| H6 | Se pueden conseguir **permisos y datos primarios** de al menos un caso | 1 fila en `casos-permisos.md` con su dato verificado | Petición de Maikel (R6) | Se vende sin casos, con una promesa más modesta |
| H7 | El infoproducto **no quita** clientes al servicio y **trae** alguno | ≥ 1 oportunidad de servicio por cada 10 compradores; 0 clientes del servicio que pasen al curso | Registro en el CRM | Se ajusta el filtro o se para |
| H8 | El canal de Maikel (LinkedIn y su red) basta para la primera edición | ≥ 30 conversaciones cualificadas en 3 semanas sin anuncios | Medición de la validación | Hace falta presupuesto en anuncios |

---

## 4 · Competidores y alternativas que hay que estudiar

**Ya estudiados** en `01`: comunidades de Skool en español (Imperio Agéntico, IA Masters, AI Native Agency Founders, Playground, KERS, VA360), cursos de anuncios (Codina, Vergara), la mentoría de 10.000 € (Scipion), el máster con FUNDAE (Webpositer) y los referentes en inglés (Ottley, Saraev, Hormozi, GHL SaaS, King Kong).

**Pendientes de estudiar, por oportunidad:**

| Para | Qué estudiar | Por qué |
|---|---|---|
| O1 | **AAA Accelerator** (Ottley): 548 reseñas en Trustpilot, 91 % de 5 estrellas; quejas por reembolsos y porque a los principiantes les cuesta vender; precio solo por llamada (5.000-7.150 $ según terceros) [C/H] | Es el modelo de referencia para agencias, y sus quejas son la oportunidad |
| O1 | **AI Native Agency Founders** y **GoHighLevel Español**: plantillas de GHL importables [C] | Competencia directa en el formato «sistema importable» |
| O1 | **Programas de partners** de GHL, HubSpot y Clientify | Gratis, enseñan el producto y certifican. Es la alternativa gratis de una agencia |
| O2 | **Formación bonificada en IA** (academias con FUNDAE, BIG school, consultoras de formación) | Es contra quien compite un taller para empresas |
| O2 | **Formación de los propios CRM** (HubSpot Academy, Clientify, GHL University) | Alternativa gratis para el equipo comercial |
| Todas | **No hacer nada** o **YouTube gratis**, **contratar a un freelancer**, **contratar el servicio de Qualivo** | Son las alternativas reales del comprador |

**Datos que no se han podido conseguir:** tendencias de búsqueda (Google Trends devolvió error 429), datos fiables de LATAM y cuánta formación en IA pasa por FUNDAE (no se publica por temática) [C].

---

## 5 · Clientes ideales posibles: matriz ponderada

**Escala:** 1 (peor) a 5 (mejor). En «competencia», «coste de soporte» y «riesgo de abandono», 5 significa poca competencia, poco soporte y poco abandono. Las puntuaciones son **[E]**, cada una con su evidencia abajo. Añado un criterio que el marco no pide y que la instrucción maestra exige: **encaje con Qualivo** (que no canibalice, que no forme competencia directa y que pueda llevar al servicio).

| Criterio | Peso | A · Freelancers | B · Pequeñas agencias | C · Consultores | D · Dueños de pymes | E · Responsables de pymes | F · Reconversión | G · Academias |
|---|---|---|---|---|---|---|---|---|
| Problema urgente | 12 | 3 | 4 | 3 | 4 | 3 | 3 | 4 |
| Disposición a pagar (con evidencia) | 15 | 3 | 4 | 3 | 3 | 3 | 2 | 2 |
| Poder adquisitivo | 10 | 2 | 4 | 3 | 3 | 4 | 2 | 2 |
| Facilidad para que Maikel lo alcance | 12 | 3 | 3 | 3 | 3 | 2 | 3 | 4 |
| Competencia | 8 | 1 | 2 | 3 | 3 | 3 | 1 | 4 |
| Capacidad de obtener resultados | 12 | 3 | 4 | 3 | 2 | 3 | 1 | 3 |
| Potencial de recomendación | 5 | 4 | 3 | 3 | 2 | 3 | 3 | 3 |
| Coste de soporte | 8 | 2 | 3 | 3 | 1 | 3 | 1 | 2 |
| Riesgo de abandono | 6 | 3 | 4 | 3 | 2 | 4 | 1 | 2 |
| Encaje con Qualivo | 12 | 2 | 3 | 3 | 3 | 4 | 1 | 3 |
| **Total sobre 100** | **100** | **52** | **69** | **60** | **55** | **63** | **37** | **59** |

**Por qué cada puntuación clave:**
- **B, disposición a pagar 4:** venden a sus clientes implantaciones de 2.000-8.000 € [C, precio de un proveedor]. Que paguen es una **hipótesis**, porque no hay encuesta [C]. Es el número más frágil de la matriz.
- **B, capacidad de resultados 4:** tienen clientes reales donde implantar y nivel técnico medio [E].
- **B, encaje 3:** son competencia parcial. Pero una agencia que vende webs o anuncios no compite con Qualivo por el mismo cliente, y puede derivar implantaciones complejas [H].
- **E, encaje 4:** su empresa es el ICP del servicio. Un taller es la puerta de entrada natural [C, ICP 21-oct].
- **E, alcance 2:** venta B2B a empresas, con más pasos y más lenta [E].
- **G, disposición a pagar 2:** bajo compromiso medido (plantones) y presupuesto bajo [C]. Ninguna fuente sobre su gasto en formación [C].
- **G, alcance 4:** ya entran leads a ~11 € [C].
- **A y F, competencia 1:** oferta de freelancers de IA creciendo el triple que la demanda en España [C, Malt]. Mercado de Skool a 10-77 $/mes [C].
- **F, resultados 1:** sin clientes ni experiencia donde aplicar el sistema [E].

**Sensibilidad:**
- Si la disposición a pagar de B baja a 3, B saca 66,4 y sigue primero.
- Si su encaje baja a 2 (Maikel no quiere formar agencias), B saca 67 y sigue primero en números. Pero entonces la decisión es de principios, no de puntos: **pregunta 1**.
- Si el alcance de E sube a 4 (por ejemplo, con un socio que venda formación bonificada), E saca 68. Supera a B si, además, la disposición a pagar de B baja a 3.

**[R] Segmento principal: B · propietarios de pequeñas agencias**, incluidos consultores de growth con equipo (lo mejor de C).
**[R] Segmento secundario: E · responsables de marketing y ventas de pymes**, en formato taller para empresas. Es el que mejor alimenta el servicio.
**Academias (G):** no como segmento. Se usan como **sector de ejemplo** dentro de B (agencias que trabajan para academias) y de E.

**Reconozco el cambio:** recomendé academias el 27-oct por el flujo de leads. La matriz muestra que **flujo de leads no es disposición a pagar**: es el mismo error de confundir interés con compra que el marco de Maikel prohíbe.

---

## 6 · ¿Herramientas, metodología o sistema implementable?

| | Herramientas | Metodología | Sistema implementable |
|---|---|---|---|
| Qué se vende | Cómo usar n8n, GHL, Claude Code | Un método: fugas, etapas, métricas | Componentes probados + método + verificación de que funciona en la cuenta del alumno |
| Precio de mercado | 10-77 $/mes en Skool; 10-200 € el curso [C] | Libros, mentorías caras sin implantación [C] | Tramo 500-3.000 € casi vacío en España [C] |
| Vida útil | Meses: las herramientas cambian | Años | Años en el método; meses en las piezas, que se actualizan |
| Diferenciación de Qualivo | Baja: lo hace todo el mundo | Media: hay muchos «métodos» | **Alta:** sale de un sistema en producción |
| Riesgo | Obsolescencia y competencia de lo gratis | Poca implantación y abandono (mediana del 12,6 % de finalización en cursos masivos [H]) | Soporte técnico y fallos de las piezas |
| Encaje con el principio 11 (no depender de herramientas) | Malo | Bueno | **Bueno, si la arquitectura es agnóstica** (cada pieza con su alternativa) |

**[R] Sistema implementable**, con tres condiciones:
1. **Solo componentes probados** en la primera versión: respuesta en el minuto uno por WhatsApp, cualificación con preguntas de encaje y puntuación, seguimiento 2/5/10, recordatorio que pide un «sí», panel comercial y atribución UTM. **Fuera, de momento:** agentes de voz e Intelligence como producto.
2. **Arquitectura agnóstica:** cada pieza descrita como función (captar, responder, cualificar, seguir, medir) con dos implementaciones (GHL o n8n + otro CRM).
3. **Verificación:** el alumno termina con una lista de comprobación superada en su cuenta o en la de su cliente. Eso es lo que se promete, no las ventas.

---

## 7 · Modelo de negocio provisional

**No se construye nada hasta validar.** Precios e ingresos son hipótesis [H/E], no previsiones.

### 7.1 Marca

| Opción | A favor | En contra | [R] |
|---|---|---|---|
| Qualivo | Una sola marca y prueba directa del sistema | Qualivo vende a pymes. Vender a agencias bajo la misma marca confunde al cliente del servicio | No para O1 |
| **Marca personal de Maikel** | La autoridad en formación es personal; LinkedIn ya es suyo; sirve para O1 y O2 | Depende de que Maikel aparezca | **Sí**, con «el sistema que usamos en Qualivo» como prueba |
| Marca independiente | Separa riesgos | Empieza de cero, sin audiencia ni prueba | No |

### 7.2 Escalera provisional (segmento B; O2 aparte)

| Escalón | Qué es | Precio [H] | Horas de Maikel [E] | Papel |
|---|---|---|---|---|
| Imán | Lista de comprobación «12 fugas después del lead» para auditar a un cliente | 0 € | Una vez, ~1 h | Captar y cualificar |
| Taller piloto | 2 h en directo: auditar el recorrido de un cliente real de la agencia | 49-97 € | 3 h por taller | **Validar** y generar los primeros casos de alumno |
| **Programa principal** | 6 semanas en grupo (máx. 12): montar el sistema en su primer cliente, con plantillas, revisión y verificación | 1.200-1.800 € + IVA | ~4 h/semana durante la edición | Ingreso principal |
| Licencia anual | Actualizaciones de plantillas y prompts + 1 sesión mensual de preguntas | 600-1.200 €/año | ~2 h/mes | Recurrencia sin comunidad diaria |
| Derivación | Implantaciones complejas que la agencia pasa a Qualivo, con comisión o marca blanca | Precio del servicio | El del servicio | Salida hacia Qualivo |

**O2 (taller para empresas):** 2.500-4.500 € + IVA por empresa (2 días o 4 sesiones), con plantillas instaladas. Puede bonificarse por FUNDAE si se cumplen sus requisitos [H: requiere entidad organizadora y trámites; pregunta a un asesor]. ~12-16 h de Maikel por empresa [E]. Es casi consultoría: **máximo 1 al mes**.

### 7.3 Números de orientación (no son previsiones)

| Supuesto [E] | Valor |
|---|---|
| Edición del programa principal | 10 alumnos × 1.500 € = **15.000 €** de base |
| Costes directos (pagos, herramientas, asesor) | ~5 % |
| Horas de Maikel por edición | ~25 h de entrega + ~40 h de montaje la primera vez |
| Ingreso por hora, primera edición | ~230 €/h; ~600 €/h en las siguientes |
| Coste de adquisición máximo sostenible por alumno | ~300-450 € (20-30 % del precio) |
| Punto de equilibrio de la primera edición (40 h de montaje valoradas a 100 €/h) | **3 alumnos** |

**Lo que tendría que ser cierto:** que se consigan 10 alumnos sin anuncios caros (H8) y que el soporte quepa en ~4 h/semana (H4).

---

## 8 · Hoja de ruta de investigación y validación (30 días, desde el 2-nov)

**Regla:** nada se graba ni se construye hasta superar la semana 3. Solo cuentan como validación **dinero, depósito o propuesta aceptada**. Likes, comentarios o registros gratis no.

| Semana | Qué | Quién | Horas de Maikel | Coste |
|---|---|---|---|---|
| **S1 · 2-8 nov** | **10 entrevistas de 25 min:** 6 propietarios de agencias o consultores y 4 responsables de pymes del ICP. Guion de descubrimiento con elección forzada (H3). Elegidos de la red de Maikel y de contactos con relación previa, nunca en frío por email. **En paralelo:** inventario de los componentes probados y de lo que falta procedimentar, que sirve también al objetivo 3 de la instrucción maestra (procedimentar Qualivo). Y petición de permisos de casos (R6) si Maikel lo aprueba | Growth: lista de entrevistados. Infoproducto: guion, síntesis e inventario. Maikel: entrevistas | **~4,5 h** | 0 € |
| **S2 · 9-15 nov** | **Taller piloto de pago para agencias** (2 h, 49-97 €, máx. 15), anunciado solo en LinkedIn y en la red de Maikel. **Para O2:** propuesta formal de taller a 2-3 empresas que ya han hablado con Qualivo | Contenido: anuncio del taller. Infoproducto: material del taller desde componentes existentes. Maikel: revisión | **~2 h** | 0 € |
| **S3 · 16-22 nov** | **Taller** (martes 17 o jueves 19). Al final, **preventa** del programa principal: depósito de 100 € descontable, con devolución total si no se abre la edición. Seguimiento de las propuestas de O2 | Maikel: taller y llamadas. Agentes: secuencia con consentimiento | **~4 h** | 0-150 € |
| **S4 · 23-29 nov** | **Decisión** con los números (ver criterios) y, si se sigue, diseño de la fase 5 | Maikel y Chief of Staff | **~1 h** | — |

**Total: ~11,5 h de Maikel y ≤ 150 € en caja.**

**Criterios de decisión (a 22-nov):**

| | Seguir | Pivotar | Parar |
|---|---|---|---|
| **O1 · agencias** | ≥ 8 asistentes de pago al taller **y** ≥ 3 depósitos | 4-7 asistentes de pago o 1-2 depósitos: se cambia oferta o precio y se repite una vez | ≤ 3 asistentes de pago y 0 depósitos |
| **O2 · empresas** | ≥ 1 propuesta aceptada | Interés, pero sin firma: se prueba otro formato (4 sesiones cortas) | 0 de 3 |
| **Las dos** | Si las dos pasan, se elige por margen por hora y por encaje (pregunta 3) | — | Si las dos fallan, se para y lo hecho se queda como contenido y procedimientos de Qualivo |

**Qué se quita para que quepa:** se mantiene la propuesta del apartado 8.1 de `03` (adaptaciones a Instagram, artículos nuevos del blog y landings nuevas de vertical, hasta enero). **Está pendiente de que Maikel lo decida el jueves**; no está aprobada.

---

## 9 · Preguntas estratégicas

Están en **`06-preguntas-priorizadas.md`**, ordenadas por impacto. Las tres primeras deciden el segmento y la forma del producto.

---

## Registro de decisiones

| Fecha | Decisión | Quién | Estado |
|---|---|---|---|
| 27-oct | El marco de Maikel pasa a ser la instrucción principal; `02`-`04` quedan como antecedente | Maikel, vía Chief of Staff | Hecho |
| 27-oct | Este diagnóstico recomienda B (principal) y E (secundario) en lugar de academias | Agente de Infoproducto | **Propuesta**, pendiente del 29-oct |
| 29-oct | Segmento, líneas rojas, horas y plan de validación | Maikel | Pendiente |
