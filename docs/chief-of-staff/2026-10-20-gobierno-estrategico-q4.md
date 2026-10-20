# Qualivo · Propuesta de gobierno estratégico Q4 2026

**Estado: propuesta para decisión de Maikel. No ejecuta nada.** Ningún agente, rutina, campaña, precio, tarea ni sistema de cliente se ha cambiado para preparar este documento.
Autor: sesión Chief of Staff. Fecha de corte: martes 20-oct-2026, 21:00.
Etiquetas: **[C]** confirmado con fuente · **[E]** estimación con cálculo · **[H]** hipótesis · **[P]** propuesta pendiente de aprobar.

---

## 0. Opinión en una página

**La idea es buena y llega en el momento justo, con una condición: tiene que quitar capas, no añadir una.**

1. **El problema no es que los agentes trabajen por separado. Es que todos terminan en ti.** La auditoría del 19-oct lo mide: 16 decisiones en cola, 17 rutinas, cinco resúmenes diarios y siete avisos antes de las 9:30 [C]. Dirigir por objetivos sirve si cada agente sabe qué resultado mueve y qué puede cerrar solo. No sirve si se convierte en otro informe.
2. **Hoy no hay un objetivo vigente único.** Conviven «Operación 5K» (Growth, 12-oct: 5.000 € de MRR a 31-dic) y el «Plan trimestral comercial v1.1» (15-oct), que dice literalmente «no hay objetivos comerciales numéricos aprobados». El CFO y el informe final recomiendan bajar a 2.500-3.000 € [C]. **Sin fijar esto primero, no hay OKR que asignar.**
3. **El cuello de botella está después del interés, no en la captación.** Meta trajo 10 reuniones y 7 propuestas en 30 días, 0 clientes cobrados [C]. El email frío dio el único cierre, aún sin facturar [C]. Más de 5.500 € están parados entre lo facturable y lo pendiente de cobro [C, CFO]. Por eso propongo que el primer objetivo se mida en **dinero en el banco**, no en leads ni en reuniones.
4. **«Brain» no debería ser una sesión nueva ni un quinto coordinador.** Ya hay cuatro capas (cerebro.md, Agente growt, Outbound Revenue Orchestrator y este Chief of Staff) [C]. Mi recomendación: **la función Brain la ejerce esta sesión fusionada con Chief of Staff**, Growth dirige la operación de Qualivo y el Orchestrator se pausa. Detalle en la sección 2.
5. **Las áreas «nuevas» que mencionas (competidores, contenido…) no necesitan agentes.** Necesitan un dueño entre los existentes y una pregunta ligada a un objetivo. Competencia, por ejemplo, entra como insumo mensual de Growth para el objetivo de conversión (objeciones y posicionamiento), no como un área permanente.
6. **Lo que hay que vigilar:** Equipzilla. El CFO calcula que pesa el 74 % de lo que entra y que, si pasa de nómina a factura, cambia el IVA del 4T a unos 3.900 € [C, CFO 20-oct]. El contrato que revisas mañana afecta directamente al objetivo 4.

---

## 1. Arquitectura actual: qué hay y qué puede ver cada uno

### 1.1 Agentes con actividad real en los últimos 30 días

| Sesión | Función real hoy | Qué puede consultar de verdad | Qué NO puede | Rutinas |
|---|---|---|---|---|
| **Agente growt** | Cerebro operativo de Qualivo: sprint diario, embudo, CRM, landings, Raquel, reuniones, Intelligence | GHL, Meta (lectura), Vapi, Gmail/Calendar, Notion, repo | Twilio, Search Console, GA4, DinoRank, Smartlead [C] | 8 |
| **Agente Paid** | Meta Ads de Qualivo. Construye en pausa, frena, no acelera | API de Meta, formularios, GHL | Subir presupuesto o pujas sin OK [C] | 2 |
| **Agente Outbound** | Smartlead, triaje horario, depósito de leads, informe diario | Smartlead, Apollo, Drive, GHL limitado | Clave de GHL propia; LinkedIn [C] | 7 |
| **Agente Creative Performance** | Creatividades y VSL para Paid | Repo, herramientas de vídeo | Publicar | 0 |
| **Agente de contenido** | Blog diario y borradores de redes (redes en pausa) | Repo, bitácora de Raquel | Medir resultados: sin GSC ni GA4 [C] | 1 |
| **Agente CFO** (antiguo «Cerebro») | Caja, cobros, IVA, plan mensual | Quipu, hoja de caja (credenciales de Google perdidas el 20-oct) [C] | Banco en directo | 4 |
| **Agente LinkedIn Outbound** | Parado: HeyReach con 0 cuentas desde el 2-oct [C] | HeyReach | — | 0 |
| **Outbound Revenue Orchestrator** | Propuesta de coordinación no firmada; nunca ha recibido un encargo | — | — | 0 |
| **Chief of Staff** (esta) | Auditoría, coordinación y piloto EAC/Eleva | Notion, Todoist (token de Maikel), Calendar qualivo.io completo, equipzilla.com solo libre/ocupado, transcripciones de Tactiq, salidas de otras sesiones | Despertar a otra sesión sin tu aprobación en cada envío; programar mis propios controles sin rutina [C] | 0 |
| **Agentes de cliente** | Agente Eleva, Agente EAC, Alpha Media Group · proyecto, Nuria Roure · Intelligence en el directo, Kill & Ramble creator acquisition system, Kubysoft · outbound (piloto), Equipzilla · CRM inteligente (sin actividad desde el 6-oct) | Los sistemas de cada cliente | Ver los objetivos de Qualivo | 0-1 cada uno |

### 1.2 Cómo se coordinan hoy (lo verificado)

- **Encargos entre sesiones:** funcionan por mensaje directo con aprobación tuya en cada envío (probado el 19 y 20-oct con Paid, EAC y Eleva) y por «timbres» programados [C].
- **Lectura de resultados:** esta sesión puede leer las respuestas de cualquier otra [C].
- **No existe un bucle automático:** ningún agente despierta a otro sin un timbre o sin tu aprobación. Esta sesión no tiene rutina [C].
- **Registros compartidos:** Todoist (lo usa Codex; Eleva ya escribe ahí; EAC no tiene acceso), Notion (Decisiones con 10 filas; Iniciativas Q4 con 52 filas, 47 en «Por hacer»), repo y bus por agente [C].

### 1.3 Planes que compiten hoy

| Documento | Fecha | Objetivo | Estado |
|---|---|---|---|
| Q4 2026 · Operación 5K (Notion) | 12-oct | ≥ 5.000 € MRR a 31-dic; 5-6 clientes nuevos; 0 bajas | Fijado con Maikel el 12-oct [C] |
| Plan trimestral comercial Q4 v1.1 + Maestro | 15-oct | «No hay objetivos numéricos aprobados» | Propuesta para revisión [C] |
| Informe final de la auditoría | 19-oct | Recomienda 2.500-3.000 € MRR a 31-dic y 5.000 € como objetivo de Q1 2027 | Pendiente de tu decisión, prevista el 2-nov [C] |

**Recomendación:** un solo documento rige. Propongo que **Operación 5K sea el centro de mando** (ya tiene sistema de trabajo, calendario y bases), que el Plan trimestral v1.1 quede como **anexo de método** (definiciones de KPI, puertas de aprobación) y que el objetivo numérico se corrija allí mismo el 2-nov [P].

---

## 2. Quién manda en qué (sin duplicar autoridad)

| Rol | Quién | Decide | Prepara | No hace |
|---|---|---|---|---|
| **Dirección** | Maikel | Objetivos, precio, oferta, gasto, contratos, credenciales, todo lo que sale a clientes o leads | — | Coordinar agentes |
| **Planificación personal** | Chat de Codex con Maikel | Prioridades semanales, bloques de calendario, estructura de Todoist | La agenda de Maikel | Encargar trabajo a agentes |
| **Brain / Chief of Staff** | Esta sesión | Nada por sí sola | Marcador de objetivos, paquete del lunes y del viernes, registro de decisiones, capacidad entre clientes y Qualivo, encargos a agentes de cliente | Dar prioridades a los agentes de Qualivo por su cuenta; tocar calendario |
| **Dirección operativa de Qualivo** | Agente growt | Reparto interno entre Paid, Outbound, Creative y Contenido | Resumen consolidado de Qualivo | Hablar con agentes de cliente |
| **Guardarraíles financieros** | Agente CFO | Alertas de caja y obligaciones (no gasto) | Cierre mensual, previsión, conciliación | Dirigir agentes |
| **Ejecución de cuenta** | Cada agente de cliente | Lo autorizado en su cuenta | Material de su reunión y tareas de su proyecto | Pedirte lo mismo que otro ya pidió |

**Regla anti-duplicado:** un encargo a un agente de Qualivo entra solo por Growth; un encargo a un cliente entra solo por esta sesión; Codex no encarga a agentes [P]. **Pausar el Outbound Revenue Orchestrator** quita la cuarta capa (lo recomiendan el informe final y el de operaciones) [P].

---

## 3. Áreas: todas a un mismo marcador

Una sola regla: **un área existe si tiene dueño, pregunta y objetivo**. Si no, no consume capacidad.

| Área | Dueño (existente) | Pregunta que responde | Objetivo al que sirve |
|---|---|---|---|
| Adquisición de pago | Paid + Creative | ¿Cuánto cuesta una reunión con encaje celebrada? | O1, O4 |
| Outbound y reactivación | Outbound (Growth coordina) | ¿Cuántas conversaciones con encaje salen de la base y de exclientes? | O1 |
| Venta y conversión | Growth (rol SDR) + Maikel | ¿Qué parte de las reuniones acaba en propuesta y en cobro? | O2 |
| Contenido y autoridad | Contenido | ¿Qué pieza generó una conversación con encaje? Hoy no medible sin GSC/GA4 | O2 (prueba social), solo si se mide |
| Competencia y mercado | Growth, una vez al mes | ¿Qué objeciones y precios de la competencia aparecen en nuestras reuniones? | O2 |
| Producto (Intelligence, demos) | Growth | ¿Qué demo acorta el ciclo de venta? | O2 |
| Clientes y retención | Agentes de cliente + Chief of Staff | ¿Cada cliente ve valor y paga a tiempo? | O3 |
| Finanzas | CFO | ¿Hay caja para el mes y las obligaciones? | O4 |
| Operaciones y capacidad | Chief of Staff | ¿Cabe todo en la semana de Maikel? | O4 |

**Lo que propongo dejar fuera hasta noviembre por no estar ligado a un objetivo medible hoy:** LinkedIn (0 reuniones en 90 días), redes sociales (en pausa), blog diario sin medición, compra de buzones, nuevas verticales [C/P].

---

## 4. Objetivos y resultados clave (OKR) propuestos

Líneas base con fecha y fuente. Las metas son **[P]** hasta que las apruebes. Donde falta el dato, lo dice.

### O1 · Al menos un cliente nuevo y cobrado al mes, de forma rentable

| Resultado clave | Línea base | Meta propuesta | Dueño del dato |
|---|---|---|---|
| KR1.1 Clientes nuevos con **primer cobro en banco** en el mes | 0 desde julio [C] | ≥ 1 en octubre (Alpha o Al Milímetro), ≥ 1 en noviembre, ≥ 1 en diciembre | CFO |
| KR1.2 Cuota recurrente de cada cliente nuevo | 9 precios distintos en el CRM [C] | ≥ precio estándar que decidas (el informe propone ~1.000 €/mes en piloto de 3 meses) | Maikel |
| KR1.3 CAC completo (publicidad + herramientas + horas) | No calculable: faltan horas por canal [C] | Recuperación ≤ 3 meses de cuota [P] | CFO + Growth |
| KR1.4 Reuniones con encaje celebradas por semana | ~5 [C, Op 5K] | 4-5, sin subir gasto | Growth |

### O2 · Mejor conversión de oportunidad cualificada a reunión y a venta

| Resultado clave | Línea base | Meta propuesta | Dueño |
|---|---|---|---|
| KR2.1 Respuestas con interés contestadas en menos de 4 h laborables | 6 de 6 sin contestar en email; LinkedIn 16 días [C] | 100 % | Outbound (triaje) + Growth |
| KR2.2 Plantones sobre citas vencidas | ~40 % (8 de 28) [C] | ≤ 20 % | Growth |
| KR2.3 Reunión con encaje → propuesta en menos de 24 h | 7 de 10 en 30 días; tiempo no medido [C] | 100 % en < 24 h | Growth prepara, Maikel envía |
| KR2.4 Propuesta → cliente | ~5 % [C, Op 5K] | 15 % a 31-dic | Maikel |
| KR2.5 Propuestas abiertas con siguiente paso y fecha | No medido; 35 oportunidades paradas [C] | 100 % | Growth |

### O3 · Retención y rentabilidad de los clientes existentes

| Resultado clave | Línea base | Meta propuesta | Dueño |
|---|---|---|---|
| KR3.1 Bajas de clientes activos | 14 dejaron de facturar jun-jul [C] | 0 en el trimestre | Chief of Staff |
| KR3.2 Facturas emitidas y cobradas a tiempo | 0 facturas en octubre a día 19; Quipu marca pendientes a Eleva, EAC y Adigital [C] | 100 % emitidas antes del día 5 y conciliadas | CFO |
| KR3.3 Horas de Maikel por cliente dentro de su referencia | Sin registro [C]. Piloto: EAC 55 min/semana, Eleva 95-120 min esta semana [C] | Referencia por cliente aprobada y cumplida 3 de 4 semanas | Chief of Staff |
| KR3.4 Cada cliente con reunión preparada y acuerdos registrados | Piloto EAC y Eleva: sí, 20-oct [C] | Todos los clientes con reunión fija | Agente de cada cliente |
| KR3.5 Exclientes reactivados con conversación | Hunty (900 €/mes, decide el 23-oct) [C] | 1 al mes | Growth |

### O4 · Gasto y carga dentro de límites sostenibles

| Resultado clave | Línea base | Meta propuesta | Dueño |
|---|---|---|---|
| KR4.1 Resultado de caja mensual | Octubre camino de −5.784 € [C, CFO]; noviembre +2.259 € con pagos únicos, diciembre −1.141 € [C, CFO 20-oct] | Diciembre ≥ 0 € solo con recurrente | CFO |
| KR4.2 Inversión comercial mensual | Meta ~1.370 €/30 días [C] | ~600 €/mes hasta el primer cobro de un canal de pago (recomendación CFO + Growth) | Paid |
| KR4.3 Herramientas pagadas sin uso | 150-250 €/mes [E] | 0 € a 30-nov | CFO |
| KR4.4 Decisiones en la cola de Maikel | 16 [C] | ≤ 3 por día y ≤ 10 abiertas | Chief of Staff |
| KR4.5 Mensajes de agentes que Maikel tiene que leer al día | 5 resúmenes + 7 avisos antes de las 9:30 [C] | 1 resumen + avisos de incidencia | Chief of Staff |
| KR4.6 Fin de jornada | Calendario hasta 18:15-18:30 [C] | ≤ 19:00 4 de 5 días | Codex |

---

## 5. Ritmo de dirección

Todo se apoya en bloques que **ya están en tu calendario** y en rutinas que **ya existen**.

| Momento | Duración tuya | Qué recibes | Quién lo prepara | Reutiliza |
|---|---|---|---|---|
| **Daily CEO** · 9:30 | 10 min | Un solo resumen: terminado con enlace · hasta 3 decisiones con recomendación y minutos · en riesgo · siguiente paso | Chief of Staff, con el sprint de Growth y las salidas de clientes | Bloque «Elegir prioridad y revisar bloqueos» 9:30-9:40; rutina Sprint diario Q4 (7:52) |
| **Cierre** · 18:24 | 5 min | Solo las 5 preguntas de cada reunión del día | Growth | Rutina «Resumen de cierre 18:30» recortada |
| **Weekly CEO** · lunes | 45 min | Marcador OKR (semáforo por KR) · qué cambió y por qué · las 3 prioridades propuestas · decisiones pendientes | Chief of Staff consolida; Growth aporta Qualivo; CFO aporta caja | «Revisión semanal Q4» (hoy a las 9:00, dentro de tu tiempo protegido: propongo moverla a 9:45) y «Plan semanal» 17:30 |
| **Revisión de viernes** | 30 min | Qué KR se movió, qué aprendimos con dato, qué se apaga | Chief of Staff | Bloque «Cerrar semana» 16:30; fusiona la revisión de viernes de Growth (7:50) y la Weekly Review del CFO (15:00) |
| **Mensual** · primer lunes | 90 min | Objetivo, P&L, presupuesto del mes, decisiones de canal | CFO + Growth | Rutina de cierre mensual del CFO; el próximo es el **2-nov** |

**Tres prioridades semanales como máximo.** Si hay más de tres cosas urgentes, el paquete del lunes lo dice y propone qué se aplaza.

---

## 6. Decisiones: quién recomienda, quién ejecuta, quién aprueba

### 6.1 Niveles de autonomía

| Nivel | Qué incluye | Quién |
|---|---|---|
| **0 · Ejecutar y registrar** | Leer datos; preparar borradores; actualizar tareas y comentarios con evidencia; frenar gasto que sangra (regla actual de Paid); ejecutar bajas RGPD (obligación actual de Outbound) | Cualquier agente en su ámbito |
| **1 · Recomendar y ejecutar tras tu OK explícito** | Enviar a leads o clientes; publicar; activar o pausar campañas dentro de un tope ya aprobado; mover etapas del CRM en bloque; crear o apagar rutinas; encargos entre agentes | El agente responsable, con tu OK en el mismo hilo o en el resumen diario |
| **2 · Solo Maikel** | Objetivos, precio y oferta; gasto nuevo o por encima del tope; herramientas nuevas; contratos; credenciales; agentes nuevos; alcance con clientes | Maikel |

### 6.2 Qué puede hacer esta sesión (Brain / Chief of Staff)

- **Recomendar:** todo lo de las secciones 3 a 7.
- **Ejecutar sin preguntar:** actualizar el marcador, Todoist y Notion con evidencia; preparar paquetes; leer salidas de otras sesiones.
- **Ejecutar con tu OK:** cada encargo a un agente (hoy la plataforma ya exige tu aprobación por envío).
- **Nunca:** cambiar calendario (es de Codex), dar prioridades a Paid, Outbound, Creative o Contenido saltándose a Growth, tocar sistemas de cliente.

### 6.3 Escalado (cuándo te interrumpimos fuera del resumen)

Solo si esperar al siguiente control pone en riesgo un compromiso: plazo legal o de pago, incidencia que para la captación, lead A o respuesta con interés, fallo de seguridad, incidencia con un cliente. Todo lo demás espera al resumen.

### 6.4 Registro de decisiones

Reutilizar la base **Decisiones** de Sala de Mando (ya existe; 10 filas). Hoy tiene Decisión, Estado, Fecha, Qué se decidió, Contexto y Revisión [C]. Propongo añadir tres campos, **con tu OK**: Objetivo (O1-O4), Evidencia (enlace) y Aprobado por [P]. Toda decisión de nivel 1 o 2 se registra ahí; el resumen diario la lee.

---

## 7. Automatizaciones y piezas que se reutilizan

| Pieza existente | Uso en el modelo |
|---|---|
| Rutina Sprint diario Q4 (Growth 7:52) | Fuente del Daily CEO para Qualivo |
| Triaje horario de Outbound | Motor de KR2.1 (respuesta < 4 h) |
| Paid · anomalías (8:00, solo si hay algo) | Aviso de incidencia, sin cambios |
| Resumen de cierre (18:24) | Se recorta a las 5 preguntas por reunión |
| Revisión de viernes (Growth) + Weekly Review (CFO) | Se fusionan en una revisión de viernes |
| Growth Review lunes + plan semanal CFO + informe lunes Outbound | Se fusionan en el Weekly CEO |
| Cierre mensual del CFO (día 1) | Revisión mensual |
| Bases Decisiones, Iniciativas Q4 y Sprint diario (Notion) | Registro de decisiones, iniciativas por objetivo, histórico diario |
| Todoist (estructura de Codex: Esta semana / Esperando / Más adelante) | Tareas de Maikel con evidencia |
| Tactiq | Acuerdos de cada reunión sin dictado |
| Intelligence en modo real (pestaña Outbound, 20-oct) | Candidato a panel del marcador **más adelante**, no en el piloto |

**Lo que se propone apagar o fusionar (decisión tuya, no se ejecuta ahora):** rutina de Instagram sin credenciales, revisión de llamadas de Raquel mientras Twilio esté caído, rutina de fin de semana caducada, Radar IA diario (a semanal), ~15 timbres de un solo uso, Orchestrator. Ver informe de operaciones del 19-oct.

---

## 8. Piloto de 30 días · 21-oct a 20-nov

**Objetivo del piloto:** comprobar que el modelo reduce tu carga y mueve los objetivos, antes de extenderlo.

| Semana | Qué pasa | Tu tiempo |
|---|---|---|
| **S1 · 21-27 oct** | Apruebas o corriges este documento y las tres decisiones de arranque (sección 9). Marcador v0 manual, construido por esta sesión con datos de CFO, Growth y Paid. Se sigue con EAC y Eleva. | 30 min de revisión |
| **S2 · 28 oct-3 nov** | Primer Weekly CEO completo. **Revisión mensual del 2-nov:** objetivo trimestral definitivo y presupuesto de noviembre. Fusión de informes aprobada y aplicada por cada agente. | 45 + 90 min |
| **S3 · 4-10 nov** | Marcador semanal estable. Se añade un tercer cliente al piloto (propongo Alpha o Nuria, según su carga). | 45 min |
| **S4 · 11-17 nov** | Marcador y resumen único funcionando. Revisión de viernes del 14 con el balance. | 45 min |
| **Cierre · 20-nov** | Decisión: extender, ajustar o abandonar. | 30 min |

**Criterios de éxito (medibles al 20-nov):**
1. Recibes **un solo resumen diario** y como mucho 3 decisiones por día al menos 15 de 20 días laborables.
2. Decisiones abiertas en tu cola **≤ 10**.
3. **Cero encargos duplicados** o contradictorios entre agentes.
4. Los cuatro objetivos tienen marcador semanal con fuente en las 4 semanas.
5. **≥ 1 cliente nuevo cobrado** en octubre o noviembre (KR1.1).
6. 100 % de las respuestas con interés contestadas en menos de 4 h laborables en las dos últimas semanas (KR2.1).

**Criterio de abandono:** si en la semana 2 el modelo te exige más tiempo de lectura que hoy, se para y se vuelve al esquema actual.

**Límite técnico que hay que asumir:** sin una rutina propia, esta sesión solo prepara el resumen y los paquetes cuando la abres tú. Para que los controles ocurran solos hace falta una rutina mía o una regla de permiso para los encargos. Ninguna se crea sin tu OK.

---

## 9. Lo que necesito de ti para arrancar

Tres decisiones, en este orden:

1. **Qué documento rige y con qué objetivo** (10 min). Recomendación: Operación 5K como centro de mando; mantener 5.000 € como aspiración y fijar el 2-nov el objetivo de MRR con el CFO.
2. **Quién es Brain** (5 min). Recomendación: esta sesión, fusionada con Chief of Staff; Growth como dirección operativa de Qualivo; pausar el Orchestrator.
3. **Aprobar los niveles de autonomía de la sección 6** (10 min). Sin esto, todo sigue pasando por ti.

Lo demás (fusión de informes, campos nuevos en Decisiones, rutina de control) se decide en el Weekly CEO del lunes 26 con esta base aprobada.

---

## Fuentes

- Notion: «Q4 2026 · Operación 5K» (12-oct), «Qualivo · Plan trimestral comercial Q4 2026» v1.1 (15-oct; apartados 13, 15, 23 y 24), «Informe final · diagnóstico y decisiones» de la auditoría (19-oct), «Inventario Qualivo propio y capacidad · 20-30 oct» (Growth, 19-oct), bases Decisiones e Iniciativas Q4.
- Repo: `auditoria/2026-10/08-operaciones.md` y `docs/chief-of-staff/2026-10-09-inventario-ecosistema-agentes.md` (rama `claude/festive-darwin-x3ngvj`).
- Salidas de sesiones del 20-oct: CFO (plan de noviembre), Outbound (informe diario), Paid (experimento), Growth (cierre y Twilio), Eleva y EAC (piloto).
- Google Calendar de maikel@qualivo.io, semana del 19 al 23-oct. Todoist a 20-oct, 20:50.
