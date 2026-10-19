# 8 · Operaciones y equipo · informe

**Auditoría de crecimiento y rentabilidad · octubre 2026**
Autor: Chief of Staff (sesión «Qualivo Chief of Staff — Auditoría de agentes»).
Fecha: lunes 19-oct-2026. Periodo: 19-sep → 19-oct (últimos 30 días) más foto del día.
Encargo: página central de la auditoría (Notion `3fe56e1ad6ed818da552fbd76a90eed7`), área 8, recibido por rutina programada el 19-oct.
Modo: solo lectura. No se ha cambiado ningún agente, rutina, herramienta ni documento.

**Cómo leer este informe.** Cada dato lleva una etiqueta:
- **[C]** confirmado: leído directamente de una fuente (API de sesiones y rutinas, repositorio, Notion, Google Calendar, Todoist).
- **[E]** estimación: derivada de datos confirmados con un cálculo explícito.
- **[H]** hipótesis: afirmación razonable que nadie ha demostrado.

Lo que no he podido verificar está dicho como tal. No hay datos personales de clientes ni de leads: solo nombres de empresa.

---

## 1. Situación actual (en una página)

Qualivo es hoy una persona (Maikel) operando con **unas 20 sesiones de Claude activas en los últimos 30 días, 17 rutinas recurrentes encendidas y 7 clientes o pilotos en distintos grados de facturación**, para un ingreso recurrente de **unos 800 €/mes** [C, Revisión semanal 19-oct] frente a un objetivo de 5.000 €/mes a 31-dic.

El sistema operativo real no es el que describen los documentos de arquitectura. Lo que funciona de verdad es:

1. **Maikel + Agente growt** («Agente growt», sesión de agosto) como cerebro operativo de facto: 8 rutinas, Sprint diario, revisión de los lunes, preparación de reuniones, cierre del día, llamadas de Raquel. Es el agente con más coste acumulado (10.580 USD equivalentes) y el que más depende de que Maikel abra la sesión.
2. **Tres especialistas con rutina propia que producen sin que Maikel los mire**: Paid (Meta, 2 rutinas), Outbound (Smartlead, 7 rutinas, triaje horario) y Contenido (blog diario).
3. **Sesiones de cliente** (Eleva, EAC, Alpha Media Group, Kubysoft, Kill & Ramble, Nuria Roure, Antic, Adigital) que trabajan a demanda o con una rutina ligera.
4. **Un piloto de coordinación (esta sesión, PM)** probado una sola vez con éxito (PM-TEST-001, 19-oct) y sin rutina.

Lo que **no** funciona o está roto hoy: la voz saliente (Twilio caído desde el 15-oct), LinkedIn outbound (0 cuentas conectadas en HeyReach desde el 2-oct), la rutina de Instagram (sin credenciales), el piloto Kubysoft (clave de Smartlead perdida, campaña sin vigilar), la cuenta de Meta (tercer periodo de gracia por impago) y la entregabilidad de dos dominios (en lista SURBL).

El cuello de botella no es la capacidad de los agentes: es que **cada agente termina su trabajo en una decisión, un pago, una clave o una aprobación que solo puede dar Maikel**, y hoy hay 16 de esas en cola (sección 6).

---

## 2. Clientes activos y qué se les entrega

Horas de Maikel: estimadas desde Google Calendar (eventos recurrentes de los últimos 30 días) más el trabajo fuera de calendario que dejan escrito las sesiones. **No existe ningún registro de horas**; esto es [E] salvo que se indique.

| Cliente (empresa) | Servicio que se entrega | Ingreso | Horas Maikel / semana [E] | Sesión y herramientas que consume | Estado |
|---|---|---|---|---|---|
| **Eleva Academy** | Gestión de campañas (Meta y Google), informes | 530 €/mes [C, CFO 1-oct] | 0,5 h reunión semanal (lunes) + ~1 h operación | Agente Eleva (1.883 USD acum.); Meta Ads, Google Ads | Activo. Sesión sin actividad desde 16-oct |
| **Escola Aeronàutica de Catalunya (EAC)** | Campañas de captación de alumnos, informes | 481 €/mes [C, CFO 1-oct] | 0,5 h (martes 13:30) + ~1 h | Agente EAC (798 USD acum.); Meta Ads, GHL | Activo. Sesión sin actividad desde 15-oct |
| **Alpha Media Group** | Construcción del módulo de marketing e IA dentro de su desarrollo propio (Nexus); Zoho como CRM | 1.200 € primer mes propuesto; **factura y contrato sin enviar** [C, página Notion 8-oct] | Bloque semanal (lunes 17:00) + desarrollo: lo gestiona Maikel directamente; estimo 4-6 h | Sesión «Alpha Media Group · proyecto» (199 USD; hoy REQUIRES_ACTION esperando permiso de Notion); comparte rama con Agente growt | Activo, **fuera del perímetro de este PM** por decisión de Maikel |
| **Al Milímetro Reformas** | Sistema comercial (propuesta aceptada verbalmente) | 1.200 € + 800 €/mes [C, Sprint diario]; **anticipo sin cobrar**, sesión de cobro miércoles 21 17:30 | 0 h hasta cobrar | Ninguna sesión propia | Pendiente de arranque |
| **Kubysoft** | Piloto de outbound (Smartlead) | **No facturado** [C, sesión 19-oct] | 1,5 h/semana compartidas con Antic (bloque de calendario) | Sesión «Kubysoft · outbound (piloto)» (254 USD), rutina diaria 7:00 L-V; Smartlead | **Degradado**: clave de Smartlead perdida en un reinicio del contenedor; campaña sin monitorizar |
| **Scubalight Studios (Don't Kill Rumble)** | Sistema de captación de creadores y prensa para el lanzamiento del juego (29-oct / 3-nov) | Sin dato de precio en las fuentes leídas | Bajo; el trabajo lo hace la sesión | Sesión «Kill & Ramble» (2.924 USD acum.), rutina diaria 9:52; Apify, Drive | Bloqueado: «falta OK del estudio y API key» [C, sesión] |
| **Antic Barcelona** | Campaña (efecto wow) | Sin dato | Compartidas con Kubysoft | Sesión (460 USD), última actividad 8-oct | Baja actividad |
| **Adigital / OutThink** | Google Ads (campañas OT26) | Sin dato | Bajo | Sesión (482 USD), última actividad 16-oct | A demanda |
| **Nuria Roure** | Intelligence para el directo del 22-oct + agente de voz del webinar | Sin precio cerrado; opción A o B pendiente de Maikel [C, Revisión 19-oct] | Alto esta semana (directo el 22-oct) | Sesión nueva 14-oct (90 USD, **411 commits en 5 días**) | En construcción, sin acuerdo de tratamiento de datos firmado |

**Coste de entrega.** No hay dato de coste por cliente. Las herramientas son compartidas (GHL, Meta, Smartlead, Claude) y nadie las imputa por cliente. Lo único imputable con certeza: DinoRank se comparte con Equipzilla [C, CFO 1-oct].

**Lectura.** Dos clientes pagan de verdad (Eleva y EAC, 1.011 €/mes nominales, ~800 € netos según la cifra del Q4). Los otros cinco frentes consumen horas y sesiones y hoy no entran en caja: Alpha (sin factura), Al Milímetro (sin anticipo), Kubysoft (piloto gratis), DKR (bloqueado), Nuria Roure (sin precio). [C]

---

## 3. Capacidad: cuántos clientes más y qué se rompe primero

**Carga actual de Maikel (30 días, Google Calendar)** [C]:

| Concepto | Dato |
|---|---|
| Eventos en 30 días | 128 |
| Horas en eventos con hora | 112,8 h (≈ 26 h/semana en calendario) |
| Reuniones «Diagnóstico» (ventas) | ~34 (≈ 17 h a 30 min) |
| Rituales propios fijos | Sprint diario 8:45 (L-V), Plan semanal lunes 17:30, Ritual viernes, OPS+Finanzas 1,5 h lunes, Inglés 45 min diario |
| Bloques cliente fijos | Eleva 0,5 h, EAC 0,5 h, Kubysoft+Antic 1,5 h, Equipzilla 2 h (L y M), Alpha lunes 17:00 |

Fuera del calendario quedan: operar campañas, aprobar copies, cobrar, responder WhatsApp de leads, revisar lo que producen 20 sesiones. Nada de eso está medido. [C: no existe registro]

**Estimación de capacidad [E].** Con el modelo actual (Maikel opera cada cliente y además hace todas las reuniones de venta), un cliente de gestión de campañas cuesta entre 1,5 y 3 h/semana de Maikel. Con ~26 h de calendario ya ocupadas y sin tiempo de operación medido, el margen realista es de **2 a 3 clientes más del tipo Eleva/EAC**, o **1 proyecto del tipo Alpha** (construcción a medida). Más allá, el primer cuello no es el tiempo de trabajo, es el tiempo de decisión: ya hay 16 decisiones en cola.

**Qué se rompe primero, por orden [E]:**
1. **La cola de aprobaciones de Maikel.** Ya pasa: copies esperando desde el 13-oct, invitaciones sin enviar, factura de Alpha sin mandar desde el 7-oct. Cada cliente nuevo añade 3-5 decisiones/semana a una cola que no se vacía.
2. **La caja y las cuentas de herramientas.** Meta en periodo de gracia por tercera vez por 9,71 € [C, Paid]. Un impago pequeño ya ha parado campañas. Con más clientes en Meta, el riesgo pasa a cuentas de cliente.
3. **La atención a los leads propios.** El seguimiento automático falla en los momentos clave (lead A recibió una respuesta inadecuada; Raquel manda «se nos ha cortado» cuando nunca conectó) [C, Revisión 19-oct]. Con más clientes, Maikel contesta menos a sus propios leads.
4. **La memoria operativa.** Cerebro.md sin tocar desde el 1-oct; ningún `clientes/*/ESTADO.md` existe aunque cerebro.md lo exige; cada sesión guarda su estado en su rama. Un cliente nuevo multiplica ramas, no conocimiento. [C, repositorio]

---

## 4. Inventario de agentes y automatizaciones

### 4.1 Sesiones activas en los últimos 30 días [C, API de sesiones, 19-oct]

Coste = uso acumulado a precio de lista que reporta la API (`usage.cost_usd`), **de toda la vida de la sesión**, no de 30 días. Qualivo paga una suscripción (Claude 180 €/mes, CFO 1-oct), no ese importe. Ver 4.4.

| Sesión | Creada | Rol real | Rutinas | Coste acum. (USD eq.) | Estado 19-oct |
|---|---|---|---|---|---|
| Agente growt | 11-ago | Cerebro operativo de facto: sprint, reuniones, Raquel, cierre del día, revisión semanal | 8 | 10.580 | IDLE; rama landing (468 commits/30 d) |
| Agente Outbound | 7-jul | Smartlead, triaje de respuestas, depósito de leads | 7 | 5.653 | IDLE |
| Agente Paid | 10-sep | Meta Ads Qualivo; construye en pausado, frena, no acelera | 2 (+1 timbre a Growth) | 3.261 | IDLE; 116 commits/30 d |
| Kill & Ramble | 15-sep | Cliente DKR | 1 diaria (+1 desactivada) | 2.924 | Bloqueado por el estudio |
| Agente de contenido | 21-sep | Blog diario, borradores de redes (redes en pausa desde el 9-sep) | 1 | 2.052 | Produce cada día laborable |
| Agente Eleva | 6-jul | Cliente | 0 | 1.883 | Último uso 16-oct |
| Agente CFO | 8-jul | Finanzas; misma sesión que el antiguo «Cerebro» | 4 | 1.185 | IDLE; avisa «IVA 1.142 € vence, spend_cap sin poner» |
| Agente EAC | 29-jun | Cliente | 0 | 798 | Último uso 15-oct |
| Agente Adigital | 28-ago | Cliente (Google Ads) | 0 | 482 | Último uso 16-oct |
| Campaña Antic Barcelona | 2-sep | Cliente | 0 | 460 | Último uso 8-oct |
| Kubysoft · outbound (piloto) | 17-sep | Cliente piloto | 1 diaria 7:00 | 254 | Degradado (clave perdida) |
| Agente Creative Performance | 30-sep | Creativos para Paid | 0 (POKEs) | 200 | IDLE; 319 commits/30 d |
| Alpha Media Group · proyecto | 6-oct | Cliente (fuera del PM) | 0 | 199 | REQUIRES_ACTION (permiso Notion) |
| Nuria Roure · Intelligence | 14-oct | Cliente, directo 22-oct | 0 | 90 | 411 commits en 5 días |
| Validación de productos ecommerce | 11-oct | Exploración (Ruta Perruna) | 0 | 86 | Último uso 16-oct |
| Qualivo Intelligence · demo comercial | 25-sep | Producto/demo | 0 | 61 | Último uso 16-oct |
| Outbound Revenue Orchestrator | 1-oct | Coordinación outbound (propuesta no firmada) | 0; su «Canal con el Orchestrator» nunca ha disparado | 47 | RUNNING sin rama |
| Chief of Staff (esta sesión) | 9-oct | Auditoría y PM piloto | 0 | 41 | Manual |
| Mailerfind: qué saca y si nos sirve | 12-oct | Prueba de herramienta | 0 | 37 | Cerrada 13-oct |
| LinkedIn Outbound | — | HeyReach | 0 | — | RUNNING; **0 cuentas de LinkedIn conectadas desde el 2-oct** |

Sesiones de 2026 anteriores a septiembre sin actividad en 30 días: ~39 más en la cuenta (59 en total). [C]

### 4.2 Rutinas recurrentes encendidas [C, API de rutinas, 19-oct]

| Agente | Rutina | Horario (Madrid) | Último estado |
|---|---|---|---|
| Growth | Sprint diario Q4 | 7:52 L-V | OK 19-oct |
| Growth | Preparación de reuniones | 7:22 L-V | OK 19-oct (prompt escrito el 28-sep, cita reuniones de septiembre) |
| Growth | Seguidores nuevos de Instagram | 8:30 diario | «OK» pero **sin credenciales de Apify ni Google desde el 17-oct**: corre y no produce |
| Growth | Revisión semanal del viernes | 7:50 viernes | OK 16-oct |
| Growth | Revisión diaria de llamadas de Raquel | 19:30 L-S | OK 17-oct; 0 llamadas reales por Twilio |
| Growth | Resumen de cierre | 18:24 L-V | OK 16-oct (prompt fija «Semana 40», ya caducado) |
| Growth | Daily Paid → Growth (timbre del bus) | 21:15 diario | OK 18-oct |
| Growth | Leads del fin de semana | «26 y 27 de septiembre» | **Zombi**: encendida, próximo disparo sep-2027 |
| Paid | Anomalías (solo si hay algo) | 8:00 diario | OK 19-oct |
| Paid | Revisión de hipótesis | 21:00 diario | OK 18-oct (prompt cita hipótesis que «mueren» el 28-sep y 1-oct) |
| Outbound | Triaje de respuestas | cada hora 9-18 L-V | OK 19-oct |
| Outbound | 6 rutinas más (carga de leads, depósito, informes) | varias | OK |
| CFO | 4 rutinas (cierre, caja, cobros, IVA) | varias | OK |
| Contenido | Trabajo del día | 7:15 L-V | OK 19-oct |
| Kubysoft | Piloto outbound | 7:00 L-V | «OK» pero sin clave de Smartlead |
| Kill & Ramble | Diaria | 9:52 | OK; bloqueada por el estudio |
| Personal | Inglés diario (sesión nueva cada día) | 12:45 L-V | OK. No es Qualivo |

Además: ~15 «timbres» de un solo disparo (POKEs Paid↔Creative↔Growth, Cerebro→agentes) que siguen marcados como habilitados sin cron; son inertes. Dos recordatorios desactivados. [C]

### 4.3 Agentes de voz y WhatsApp [C]

| Pieza | Estado | Fuente |
|---|---|---|
| **Raquel (Vapi) saliente** | **Caída desde el 15-oct**: trunk SIP de Twilio sin servicio. 0 llamadas reales 16-18 oct. Antes: ~18 llamadas/semana → 1 conversación real | Growth cierre diario 15-17 oct; Revisión 19-oct |
| Raquel SMS de respaldo | Manda «se nos ha cortado la llamada» cuando la llamada nunca conectó | Revisión 19-oct |
| WhatsApp primer toque (GHL) | Falla con todo lead nuevo por la ventana de 24 h de WhatsApp Business; la etiqueta se pone igual (parece contactado sin estarlo). Documentado desde el 18-sep, **sin corregir un mes después** | Prompt rutina Paid |
| Aviso de diagnóstico nuevo | GHL no avisa (workflows en borrador). Lo suple la rutina horaria de Outbound con PushNotification | Prompt rutina Outbound |
| Agente de voz webinar Nuria Roure | En construcción (prompt y guion en Notion) | Notion 14-oct |
| Agente de WhatsApp Alpha | Especificación en borrador, no desplegado | Notion Alpha 8-oct |

### 4.4 Coste de los agentes [E/H]

- **Confirmado [C]:** suscripción Claude 180 €/mes (CFO 1-oct). Uso acumulado reportado por la API en sesiones activas desde el 19-sep: **31.170 USD equivalentes** a precio de lista (toda la vida de esas sesiones; Growth desde agosto, Outbound desde julio).
- **Estimación [E]:** la sesión de Contenido, creada el 21-sep, suma 2.052 USD eq. en 4 semanas: ~500 USD eq./semana para producir un artículo diario y borradores de redes que no se publican (redes en pausa). Nuria Roure: 90 USD eq. y 411 commits en 5 días.
- **Hipótesis [H]:** el modelo operativo entero depende de que la suscripción siga permitiendo este volumen. Si el proveedor limitara el uso o hubiera que pasar a API, el coste real de los agentes superaría con mucho el ingreso recurrente actual. No hay plan B escrito en ningún sitio.

### 4.5 Qué se podría apagar sin perder nada hoy [E]

| Candidato | Por qué | Ahorro |
|---|---|---|
| Rutina «Leads del fin de semana» (Growth) | Zombi: no dispara hasta 2027 | Limpieza, 0 € |
| Rutina Instagram (Growth) | Sin credenciales desde el 17-oct: ejecuta y no produce. Apagar hasta que Maikel decida si vuelve a dar claves | Tiempo de sesión diario |
| Rutina Kubysoft 7:00 | Sin clave de Smartlead: ejecuta y no vigila nada | Tiempo de sesión diario |
| ~15 timbres POKE de un disparo | Inertes | Limpieza |
| «Canal con el Orchestrator» | Nunca ha disparado; el Orchestrator es una propuesta no firmada | Limpieza |
| Sesiones anteriores a septiembre (~39) | Sin actividad en 30 días | Archivar; reduce ruido, 0 € |
| Contenido: borradores de redes | Redes en pausa desde el 9-sep; se producen 5 borradores/semana que nadie publica | Reducir la rutina a blog + newsletter hasta levantar la pausa |
| Rutinas Paid y Growth con prompts caducados | Hipótesis «mueren el 1-oct», «Semana 40», reuniones de septiembre: siguen ejecutándose con contexto viejo | Reescribir o apagar; evita decisiones sobre datos viejos |

Ninguna de estas acciones se ha ejecutado. Son candidatas para la fase de decisión.

---

## 5. Herramientas y suscripciones (para cruzar con Finanzas)

Fuente única encontrada: lista del CFO del 1-oct [C]. Uso real: observado en sesiones y rutinas [C]. No he leído facturas.

| Herramienta | €/mes (CFO 1-oct) | Uso real observado | Veredicto [E] |
|---|---|---|---|
| Claude (suscripción) | 180 | Toda la operación (20 sesiones, 17 rutinas) | Núcleo. Ver riesgo 4.4 |
| GoHighLevel | 107 | CRM, pipeline, WhatsApp/SMS pasarela, calendarios | Núcleo. Pero workflows de aviso en borrador, etiquetas incoherentes |
| Smartlead | 100 | Outbound Qualivo (1.199 emails, 24 respuestas, 1 reunión en 30 días) + Kubysoft (clave perdida) | En uso. Rendimiento bajo: 2 dominios en SURBL, 1 email/día en octubre hasta la regla del 14-oct |
| n8n | 73 | Secuencias y webhooks; informe OutThink | **Uso no verificado en 30 días**. Candidato a revisar |
| HeyReach | 62 | **0 cuentas de LinkedIn conectadas desde el 2-oct** | **Pagando por nada desde hace 17 días** |
| Google Workspace | 56 | Correo, Calendar, Drive, Sheets (Cockpit Caja, Revisión semanal) | Núcleo |
| ChatGPT | 23 | Dirección estratégica de Maikel | Personal/dirección |
| Vapi | 22 | Raquel. Sin llamadas desde el 15-oct por Twilio | Parado de facto |
| Vercel | 21 | Landing, Intelligence, blog | Núcleo |
| **Subtotal lista CFO** | **644** | | |
| Apify | ~19 $ | Instagram (sin credenciales) y DKR | Uso parcial |
| Twilio | sin dato | Trunk SIP caído | Verificar factura y estado |
| Mailerfind | sin dato | Probado 12-13 oct, sesión cerrada | ¿Sigue pagándose? |
| ElevenLabs, Kie, Tactiq, Dinorank (compartido Equipzilla), Todoist, Resend, Meta/Google Ads (medios) | sin dato | Tactiq se usa en reuniones; Dinorank: Growth no tiene acceso | Finanzas debe cerrar la lista |

**Para Finanzas:** la lista del CFO suma 644 €/mes y la estimación de gastos de octubre pone «herramientas ~500 €». Una de las dos cifras está incompleta. Faltan al menos Twilio, Apify, Mailerfind, ElevenLabs, Tactiq, Todoist y Dinorank. [C]

**Herramientas con cuenta pero sin uso por el agente que las necesita [C]:** Growth no tiene acceso a Search Console, DinoRank, GA4, Vercel Analytics ni Smartlead (lo pide por escrito). Kubysoft no tiene Smartlead. Instagram no tiene Apify ni Google. DKR no tiene la API key del estudio.

---

## 6. Tareas que dependen solo de Maikel y bloquean crecimiento [C]

Recogidas del Sprint diario, Iniciativas Q4, Revisión semanal 19-oct, Outbound y Growth Review. Ordenadas por impacto en caja.

**Caja directa**
1. Cobrar el anticipo de Al Milímetro Reformas (sesión miércoles 21, 17:30).
2. Enviar factura y contrato a Alpha Media Group (borrador en Gmail desde el 7-oct; 600 € + IVA primer pago).
3. Decidir precio de Nuria Roure (opción A o B) antes del directo del 22-oct.
4. Fijar el precio estándar (propuesto «desde 800 €/mes»): se han ofrecido 4 precios en una semana.
5. Preparar y cerrar Hunty (reunión de decisión viernes 23, 900 €/mes).
6. Pagar Meta y poner spend_cap (tercer periodo de gracia; CFO lleva semanas pidiendo el tope).

**Herramientas rotas (cada día parado es capacidad perdida)**
7. Twilio: reactivar el trunk SIP o decidir apagar Raquel hasta arreglo.
8. Reconectar LinkedIn en HeyReach (o cancelar HeyReach).
9. Dar clave de Smartlead a la sesión de Kubysoft (o cerrar el piloto).
10. Credenciales Apify/Google para la rutina de Instagram (o apagarla).
11. Comprar 3 dominios + 9 buzones para outbound (dominios actuales en SURBL).
12. Clave de GHL para el Agente Outbound.

**Aprobaciones de texto (desde el 13-oct)**
13. Copies: WhatsApp nuevo, secuencias de outbound, A/B del correo 1.
14. Invitaciones de calendario: Hunty (viernes 23, 10:00) y CANCOMAR (10-nov).

**Higiene**
15. Marcar el resultado de las 19 reuniones pasadas (5 minutos; sin eso Paid no puede medir qué score predice cierre).
16. Rotar tokens: Meta (alcance sobre 20+ cuentas de clientes, pendiente desde el 7-oct), GHL, Todoist (pegado en chat el 19-oct).

Patrón: **ningún agente puede cerrar su ciclo**. Todos terminan en Maikel, y el Sprint diario se lo recuerda cada mañana sin que la cola baje.

---

## 7. Problemas por impacto (top 3 cuellos de botella)

### 1. La cola de decisiones de Maikel es el límite del sistema
**Impacto en caja [E]:** al menos 1.800 € de ingreso ya aceptado o propuesto (anticipo Al Milímetro + factura Alpha) lleva más de 10 días sin facturarse por falta de un envío. Más los 900 €/mes de Hunty si el material del viernes no está listo.
**Impacto en capacidad [E]:** 16 items en cola; 17 rutinas que producen informes que acaban en «qué pide el OK de Maikel». Cada rutina añade lectura sin añadir decisión.
**Evidencia [C]:** copies esperando desde el 13-oct; factura Alpha en borrador desde el 7-oct; spend_cap pedido por CFO y Paid desde septiembre; token de Meta sin rotar desde el 7-oct.

### 2. Herramientas pagadas y agentes encendidos que no producen
**Impacto en caja [C/E]:** HeyReach 62 €/mes sin cuentas conectadas 17 días (~35 € tirados hasta hoy); Vapi 22 €/mes + Twilio sin llamadas desde el 15-oct; Smartlead 100 €/mes rindiendo 1 reunión en 30 días con dominios quemados; n8n 73 €/mes de uso no verificado. Entre 150 y 250 €/mes de herramientas que hoy no producen nada [E].
**Impacto en capacidad [C]:** la voz era el canal que convertía formulario en conversación (1 conversación real/semana) y lleva 4 días apagada en la semana con 5 leads nuevos.
**Evidencia [C]:** sesiones LinkedIn Outbound, Kubysoft, cierre diario Growth 15-17 oct, Revisión semanal 19-oct.

### 3. Cuatro capas de coordinación y ninguna fuente de verdad viva
**Impacto en capacidad [E]:** cada decisión se escribe en un sitio distinto (cerebro.md congelado desde el 1-oct, Notion Q4, Sprint diario, bus/out/*.jsonl por agente, prompts de rutinas con fechas de septiembre). Los agentes leen contextos viejos: Paid revisa hipótesis que «murieron» el 1-oct; Growth prepara reuniones con un prompt del 28-sep; el Orchestrator existe como sesión RUNNING sin que nadie le haya dado una rama ni un timbre.
**Impacto en caja [H]:** indirecto, pero real: 4 precios distintos en una semana es el síntoma de que no hay un documento de oferta vigente que todos lean.
**Evidencia [C]:** inventario del 9-oct (tres arquitecturas sin firmar), rutinas leídas el 19-oct, repositorio (sin `clientes/*/ESTADO.md`; cerebro.md sin cambios).

---

## 8. Hipótesis no demostradas (lo que el sistema asume y nadie ha comprobado)

| Hipótesis | Quién la asume | Qué haría falta para comprobarla |
|---|---|---|
| H1. Los agentes ahorran tiempo neto a Maikel | Todo el diseño | Una semana de registro de horas de Maikel: horas leyendo/aprobando salidas de agentes vs. horas de venta y cliente. Hoy no existe el dato |
| H2. Más rutinas = más control | Growth, Paid, Outbound (17 rutinas) | Contar cuántas salidas de rutina generaron una acción de Maikel en 30 días. Mi lectura de las sesiones: la mayoría generan lectura, no acción |
| H3. El blog diario trae leads | Agente de contenido (≈500 USD eq./semana) | Growth no tiene Search Console ni GA4: **no se puede medir hoy**. Es la hipótesis más cara sin medición |
| H4. La voz (Raquel) convierte mejor que el WhatsApp manual | Growth | 18 llamadas/semana → 1 conversación. Comparar con la tasa de respuesta cuando Maikel escribe él (los leads A de esta semana) |
| H5. El modelo de suscripción de Claude seguirá soportando 31k USD eq. de uso | Toda la operación | Nadie lo ha escrito como riesgo. Pedir a Finanzas un escenario «si el coste de IA fuera el 10 % del uso reportado» |
| H6. Un PM (esta sesión) reduce la cola de Maikel | Growth OS V1 | PM-TEST-001 demostró el canal técnico. No demuestra que quite decisiones a Maikel: los especialistas tratan al PM como «otro agente» y siguen pidiendo su OK |
| H7. Outbound en frío puede llegar a 5.000 € MRR a tiempo | Outbound, Orchestrator | 1.199 emails, 24 respuestas, 1 reunión en 30 días. Las mejores oportunidades de la semana vinieron de excliente (Hunty) y referencias, no de frío [C, Revisión 19-oct] |

---

## 9. Oportunidades de simplificación

1. **Una sola cola de decisiones**, no 17 informes. Que todas las rutinas escriban lo que necesita de Maikel en una única base (Decisiones de Sala de Mando ya existe y está vacía de uso) y que el Sprint diario la lea, en vez de que cada agente mande su parte. Coste: reescribir el cierre de 8-10 prompts. Ahorro: lectura diaria de Maikel [E: 30-45 min/día].
2. **Regla de «herramienta sin uso 7 días → se apaga o se cancela»** con revisión mensual del CFO. Hoy aplica a HeyReach, Vapi/Twilio, posiblemente n8n y Mailerfind.
3. **Un `ESTADO.md` por cliente** (ya es obligación escrita en cerebro.md y nadie la cumple). Cinco ficheros, 20 líneas cada uno. Es lo que permitiría imputar horas y herramientas por cliente.
4. **Apagar los zombis** (sección 4.5): una tarde, cero riesgo, menos ruido en el panel de rutinas.
5. **Decidir qué es el cerebro.** Hoy hay cuatro candidatos (cerebro.md, Agente growt, Orchestrator, este PM). Mientras no se firme uno, cada agente elige el que le conviene.
6. **Contenido: cortar lo que no se publica.** Mantener blog + newsletter, parar los borradores de redes hasta que se levante la pausa. Mitad de uso de la sesión más cara por hora de valor entregado [E].

---

## 10. Recomendación

Formato pedido: mantener / optimizar / pausar / escalar, con coste y horas. Las horas son de Maikel salvo indicación. Todo esto es **propuesta**: ninguna se ejecuta sin su OK explícito.

| Elemento | Recomendación | Por qué | Coste / esfuerzo |
|---|---|---|---|
| Agente growt (cerebro operativo de facto) | **Mantener y nombrarlo**: es el sistema real. Actualizar los 3 prompts caducados (reuniones, cierre, fin de semana) | Es lo que funciona cada día | 1 h de Maikel para validar; el agente reescribe |
| Agente Paid | **Mantener**. Actualizar el prompt de hipótesis (fechas de sep) | Disciplina probada: construye en pausado, frena, no acelera | 30 min |
| Agente Outbound | **Optimizar**: comprar dominios + buzones ya decididos, o bajar a mantenimiento | 1 reunión en 30 días con la infraestructura quemada; la regla «nunca a cero» del 14-oct ya está escrita | ~150-250 € dominios y buzones [E]; 1 h de Maikel |
| LinkedIn / HeyReach | **Pausar la suscripción** hasta que Maikel reconecte su cuenta, o reconectar hoy | 0 cuentas desde el 2-oct | 0 € si se pausa; 15 min si se reconecta |
| Raquel (Vapi + Twilio) | **Pausar el paso de voz** en la cadencia hasta arreglar Twilio; apagar el SMS «se nos ha cortado» | Está mandando mensajes falsos a leads | 30 min (arreglo Twilio o pausa en GHL) |
| Agente de contenido | **Optimizar**: blog + newsletter sí; borradores de redes no, hasta levantar la pausa. Pedir acceso a Search Console para medir | Produce lo que no se publica; coste eq. más alto por valor entregado | 15 min cambiar la rutina; 10 min dar acceso GSC |
| Kubysoft piloto | **Decidir**: dar la clave y poner fecha de fin y precio, o cerrar | Piloto gratis sin vigilancia | 15 min |
| Kill & Ramble | **Mantener en espera**; no gastar más hasta el OK del estudio | Bloqueado externamente; lanzamiento 29-oct | 0 |
| Alpha Media Group | Fuera del perímetro del PM. Solo señalo: **factura y contrato sin enviar desde el 7-oct** | Caja | 20 min |
| Nuria Roure | **Mantener hasta el 22-oct**; firmar precio y acuerdo de datos antes de leer su CRM | Directo en 3 días; riesgo RGPD si se leen datos sin acuerdo | 30 min |
| Outbound Revenue Orchestrator | **Pausar**: sesión sin rama, canal nunca disparado, arquitectura no firmada | Cuarta capa de coordinación | 0 |
| Chief of Staff / PM (esta sesión) | **Mantener en piloto** solo para la cola de decisiones (punto 9.1), sin rutina hasta que Maikel decida Growth OS V1 | H6 sin demostrar | 0 hasta decisión |
| Rutinas zombi y POKEs inertes | **Apagar** | Ruido | 1 h de agente, 10 min de OK |
| Suscripciones sin uso (HeyReach, posiblemente n8n, Mailerfind, Vapi) | **Revisar con Finanzas** antes del cierre de octubre | 150-250 €/mes [E] | 30 min CFO + Maikel |
| Escalar | **Nada se escala este mes.** Antes: precio estándar, cobrar lo aceptado, arreglar voz y LinkedIn | Sin eso, cada cliente nuevo entra en una cola que no se vacía | — |

**Las tres acciones con más retorno por hora de Maikel [E]:**
1. Dos envíos de 20 minutos: factura Alpha y recordatorio del anticipo Al Milímetro → hasta 1.800 € en caja esta semana.
2. Una decisión de 10 minutos: precio estándar → deja de haber 4 precios y los agentes pueden preparar propuestas solos.
3. Una tarde de higiene (con un agente ejecutando y Maikel aprobando la lista): apagar zombis, pausar voz y HeyReach, rotar los tres tokens → menos ruido, menos riesgo, 60-100 €/mes menos.

---

## Anexo A · Fuentes consultadas (todas en modo lectura)

- API de sesiones de Claude Code (59 sesiones; metadatos de uso y estado) y API de rutinas (4 páginas, 19-oct).
- Repositorio `qualivo-sys/qualivo`: commits por rama 19-sep → 19-oct; `sistema/cerebro.md` (rama cerebro); `bus/out/paid.jsonl` y `bus/out/demand.jsonl`; `docs/agent-os/`; `docs/qualivo-growth-os/`; `content/`.
- Notion: página central de la auditoría; Q4 2026 · Operación 5K; Revisión semanal 19-oct; Sprint diario; Iniciativas Q4; Alpha Media Group · puesta en marcha (8-oct); Nuria Roure · Plan de Intelligence (14-oct); Sala de Mando (Tareas, Decisiones, Agentes).
- Google Calendar de Maikel, 19-sep → 19-oct (128 eventos).
- Informe del CFO del 1-oct (lista de software) y estimación de gastos de octubre.
- Inventario del ecosistema de agentes del 9-oct (`docs/chief-of-staff/2026-10-09-inventario-ecosistema-agentes.md`).

## Anexo B · Lo que no he podido verificar

- Facturas reales de herramientas (no he leído Quipu ni el banco).
- Horas reales de Maikel por cliente (no hay registro).
- Estado actual del trunk de Twilio y de la cuenta de Meta a 19-oct por la tarde (leído de informes de agentes, no de las APIs).
- Si n8n, Mailerfind, ElevenLabs y Kie siguen cobrándose.
- Precio y contrato de Scubalight, Antic y Adigital.
- Uso de las rutinas del CFO y Outbound más allá de su estado «SUCCEEDED» (no he leído sus salidas una por una).
