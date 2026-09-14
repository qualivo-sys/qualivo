# Auditoría del sistema de IA de Qualivo · 7 sep 2026

> Escrita por el cerebro (sesión "Quipu billing dashboard 2025-2026") a petición de Maikel. Solo se afirma lo verificado: rutinas listadas por API, código y variables de entorno leídos en las ramas, KPIs tomados de los informes de los agentes. Lo no verificable se marca como tal.

## 1. Arquitectura actual

**Naturaleza del sistema:** no son agentes siempre encendidos. Son sesiones de Claude Code en la nube, cada una con su rama del repo `qualivo-sys/qualivo`, que se despiertan por rutinas cron o por "timbres" (rutinas sin horario disparadas a mano). Entre despertares no ocurre nada.

| Agente (sesión) | Función | Modelo | Rama | Autonomía |
|---|---|---|---|---|
| **Cerebro** (esta sesión) | CFO/COO, orquestador, finanzas, partes a Maikel | Fable 5.1 (hoy; antes Fable 5) | `quipu-billing-dashboard` | 5 rutinas |
| **Outbound / SDR** ("Client acquisition strategy") | Smartlead, LinkedIn, Apollo, ICP, Documento Madre, agente de llamadas (en construcción) | Fable 5 | `client-acquisition-ideas` | **7 rutinas** — el más autónomo |
| **Landing / Growth** ("Landing Qualivo.io en Vercel") | Web, blog SEO, contenido, Growth Review, radar IA | Fable 5 | `qualivo-landing-vercel` | **6 rutinas** |
| **Ventas** | Plantillas, pipeline, seguimientos, reactivación, pricing | Fable 5 | `qualivo-agente-ventas` | 0 rutinas (solo timbre) |
| **Automatización** | Workflows n8n en borrador, auditoría de automatizables | Fable 5 | `qualivo-automatizaciones` | 0 rutinas |
| Google Ads / OutThink | Campañas Google Ads de cliente vía API | Fable 5.1 | `google-ads-expert-prompt` | manual |
| Eleva | SEO content machine, lead magnets, DinoRank | Opus 4.8 | `eleva-academy-metrics` | manual |
| EAC | Dashboard Apps Script con refresco diario | Opus 4.8 | `eac-metrics-dashboard` | 1 rutina (Dashboard REBT diario) |
| Antic Barcelona | Campaña cliente | Opus 5 | `antic-barcelona-campaign` | manual — último turno falló (error 529), nadie lo relanzó |
| ~15 sesiones más | Focus, Nuria, Inspyria, CCO, workout app… | varios | varias | dormidas |

**Cómo se relacionan (hub-and-spoke, sin malla):**
- **Memoria compartida:** `sistema/cerebro.md` en la rama del cerebro (directrices, protocolo, pipeline). Los agentes lo leen por `git show` al arrancar su rutina (verificado en el prompt de "Carga diaria de leads": paso 0 = leer cerebro.md).
- **Cerebro → agente:** timbres (Landing, Ventas, Outbound×2). **Agente → cerebro:** solo Outbound tiene timbre de vuelta; Ventas y Automatización reportan por ficheros `parte-*.md` con prefijo `[PARA CEREBRO]`.
- **Lectura de estado:** el cerebro lee los resúmenes de fin de turno de todas las sesiones (`list_sessions`) cada día a las 9:30.
- **No existe** mensajería directa entre agentes ni entre agente y cerebro fuera de esto.

**Flujo de una tarea:** Maikel o cerebro → timbre/rutina → el agente ejecuta un turno → escribe en su rama + resumen → el cerebro lo lee a las 9:30 → parte a Maikel → Maikel decide → tarea en Todoist → **Maikel ejecuta** (envía, llama, aprueba). Los agentes preparan; Maikel dispara.

## 2. Herramientas y accesos

Leyenda: ✅ verificado en uso · 🟡 referenciado en código/prompt, no verificado desde aquí · ❌ no conectado.

| Sistema | Dónde | Consultar | Modificar | Ejecutar | Limitaciones |
|---|---|---|---|---|---|
| **Smartlead** ✅ | Outbound | campañas, stats, respuestas, depósito | pausar campañas, secuencias (POST reemplaza toda la secuencia) | envíos programados | clave en scratchpad (efímero); techo 375 envíos/día |
| **GoHighLevel** ✅ | Outbound, Landing | contactos, pipeline, tareas, social planner | contactos, tags, notas, posts | crear tareas de llamada, publicar | buscador tarda en indexar; `userId` obligatorio en posts |
| **Apollo** ✅ | Outbound (+MCP aquí, sin usar) | búsqueda de empresas/personas | listas | enriquecimiento (consume créditos) | créditos |
| **HeyReach / LinkedIn** ✅ | Outbound (+MCP aquí, sin usar) | campañas, conversaciones | pausar/reanudar, secuencias | mensajes | 4 campañas activas; Fugues pausada |
| **Vercel** ✅ | Landing | — | deploy web | `vercel deploy --prod` | deploy por CLI, no ligado a GitHub |
| **Google Search Console** 🟡 | Landing | consultas, sitemaps (SA `apiclaude` con acceso) | enviar sitemaps | — | no he visto un informe generado con datos GSC |
| **DinoRank** 🟡 | Landing, Eleva | keywords, posiciones (proyecto 141600, API MCP) | tracking | — | 26 keywords cargadas según doc; sin informe verificado |
| **GA4 / Vercel Analytics** 🟡 | Landing | eventos `diagnostico_solicitado`, `lead_fuera_alcance`, `autodiagnostico_completado` | — | — | Admin API pendiente; consentimiento condiciona GA4 |
| **Google Ads API** ✅ | OutThink, referenciado en Eleva/EAC | campañas, rendimiento | crear/editar campañas, anuncios, audiencias | sí (7 anuncios recreados esta semana) | credenciales por sesión |
| **Meta Ads API** 🟡 | referenciado en 5 ramas | — | — | — | píxel pendiente; sin acción verificada |
| **Google Sheets** ✅ | Cerebro (finanzas), Landing (SEO) | todo | todo | fórmulas, pestañas | SA JSON efímero: se perdió hoy y hubo que resubirlo |
| **Quipu** ✅ | Cerebro, Automatización | facturas emitidas/gastos, IVA, retenciones | no probado | — | credenciales en el chat/scratchpad |
| **Todoist** ✅ | Cerebro | tareas, completadas | crear/cerrar/reprogramar | — | cierres masivos requieren aprobación |
| **Notion** ✅ | Cerebro | Qualivo OS (Roadmap, Sprints, Tareas, Experimentos, Decisiones, Agentes), Bitácora | todo | — | solo el cerebro escribe |
| **Google Calendar** ✅ | Cerebro | qualivo.io completo; equipzilla solo libre/ocupado | crear/borrar (cada borrado pide aprobación) | — | Workspace de Equipzilla restringe |
| **Gmail** 🟡 | Cerebro (MCP conectado, nunca usado) | leer, buscar | borradores, enviar | — | sin uso hasta hoy |
| **Vapi + Twilio + n8n** 🟡 | Outbound | — | — | agente de llamadas | bundle regulatorio de Twilio pendiente; workflows n8n con tokens placeholder |
| **n8n (instancia de Maikel)** ❌ | — | — | — | — | los workflows se entregan como JSON; nadie los ha importado |
| **Brevo** ❌ | — | — | — | — | solo aparece en una sesión de julio |
| **Resend** ✅ | Landing | — | — | avisos de lead por email | dominio pendiente de verificar |
| Gamma, Heygen, Higgsfield, Mailerfind | Cerebro (MCP) | — | — | — | conectados, **sin ningún uso** |

## 3. Capacidades reales

**YA PODEMOS HACER AHORA (verificado):**
- Outbound completo salvo el envío final: cargar leads, escribir secuencias, medir envíos/respuestas/clics por campaña a diario, pausar campañas que reinician secuencias, triar respuestas y redactar borradores, generar lista de señales calientes en GHL cada mañana.
- Contenido: 2-3 artículos SEO/día publicados en qualivo.io con deploy, carruseles programados, radar IA diario.
- Finanzas: caja real, presupuesto semanal, IVA trimestral desde facturas reales, escenarios de deuda, alertas.
- Coordinación: parte diario, plan de lunes, review de viernes, cierre mensual, tareas del día en Todoist.
- Google Ads de clientes por API.

**CON UNA PEQUEÑA CONFIGURACIÓN (1 tarde, 0 €):**
- Alerta de respuesta entrante <2h (webhook Smartlead → n8n/Telegram).
- Cobros: aviso de facturas impagadas desde Quipu (patrón OAuth ya resuelto).
- Importar el workflow n8n de seguimientos 3-7-14 (JSON listo).
- Informe SEO real (GSC + DinoRank → Sheet) — los accesos existen, falta el script.
- Registro de reuniones/conversaciones (una etapa en GHL + una línea en el informe diario).
- Credenciales persistentes (variables de entorno del environment en vez de scratchpads).
- Gmail desde el cerebro para borradores de cobro.

**TODAVÍA NO PODEMOS:**
- Enviar nada a un cliente sin Maikel (límite deliberado, se mantiene).
- Llamadas automáticas (Vapi/Twilio en construcción; bundle pendiente).
- Ver Meta Ads ni el píxel.
- Que un agente despierte a otro agente (solo cerebro↔Outbound).
- Medir conversión señal → reunión → propuesta → cliente (no hay registro).
- Saber qué cuesta cada canal en € (suscripciones no atribuidas).

## 4. Workflows actuales (24 rutinas)

**Outbound (7):** Carga diaria de leads 7:30 (lee cerebro.md → probe de dominios → carga a Smartlead → mejora continua) · SDR autónomo 8:00 (investiga, cualifica, escribe secuencias para aprobación) · Triaje de respuestas 9:30 (clasifica reales/autorespuestas/rechazos, redacta borradores) · Guardián de reenvíos 12:00 (pausa campañas que reinician) · Reporte de envíos 17:30 (envíos/aperturas/clics/respuestas por campaña) · Informe de los lunes · Timbre → Cerebro.
**Landing/Growth (6):** Radar IA 6:00 · Content machine 7:15 (2-3 artículos, sitemap, llms.txt, deploy) · Growth Review lunes 8:00 (GHL + GSC + DinoRank + GA4) · publicación de carruseles martes/miércoles con backup · Canal ← Cerebro.
**Cerebro (5):** Daily 9:30 · Weekly Plan lunes 9:00 · Weekly Review viernes 15:00 · Cierre financiero día 1 · timbres a Ventas/Outbound.
**Otros:** Dashboard REBT diario (EAC) · Comprobación del bundle de Twilio · Timbre Ventas (reactivación+pricing).
**Inertes:** workflow n8n "Seguimientos 3-7-14" (entregado, no importado) · agente de llamadas Vapi (scripts con placeholders).

## 5. Datos

**No hay fuente única de verdad.** Los datos viven en 9 sitios:

| Dato | Dónde | Estado |
|---|---|---|
| Envíos, respuestas, clics | Smartlead | vivo, diario |
| Contactos, etapas, tareas, señales calientes | **GHL** | el más cercano a un CRM real |
| Pipeline de oportunidades | `ventas/pipeline.md` **y** GHL **y** Notion Tareas | **triplicado** |
| Informes y auditorías | ramas del repo (`captacion/`, `ventas/`, `estrategia/`) | vivo, disperso |
| Finanzas | Google Sheet (Cockpit, Presupuesto) + Quipu | vivo, actualización manual semanal |
| SEO | Sheet "SEO - Qualivo", DinoRank, GSC | instrumentado, sin informe consolidado |
| Web | GA4 + Vercel Analytics | eventos instalados, no reportados |
| Sistema operativo | Notion (Qualivo OS), Todoist | vivo |
| Directrices | `sistema/cerebro.md` | vivo |

## 6. Métricas

| Área | Medimos hoy | Falta |
|---|---|---|
| Outbound | envíos, aperturas, clics, respuestas, rebotes, depósito — por campaña y día (6.874 envíos, 1,56% resp., 24 clics desde julio) | tasa de respuesta por ICP consolidada semana a semana |
| Leads | señales calientes generadas (15-20 en 5 semanas) | leads cualificados como número oficial |
| Reuniones | **no se registran** (1-2 celebradas según el propio agente) | registro de reunión + origen |
| Conversaciones / propuestas | **0 registradas** — el objetivo del mes (30/8-10) no tiene contador | registro en GHL o `ventas/` |
| Ventas / ingresos | recurrente por cliente (Sheet), facturación (Quipu) | ingresos por origen/canal |
| SEO | keywords en DinoRank, artículos publicados | posiciones, clics GSC, leads orgánicos |
| Conversión | — | señal → llamada → reunión → propuesta → cliente |
| Coste | gastos totales (Sheet) | coste por canal (Smartlead, Apollo, HeyReach, ads) |
| ROI | por cliente en casos (10,2x EAC…) | ROI de la máquina de captación y del propio sistema de IA (tokens: Landing ~1.180 $, OutThink ~200 $, cerebro ~96 $ acumulados) |
| Tiempo de respuesta | — | cumplimiento de la regla <2h |

## 7. Puntos débiles (crítico)

1. **El cuello de botella es Maikel como único ejecutor.** Los agentes producen borradores que esperan días: 3 datos sin responder 7 días, llamadas a señales calientes (A-House y Nexitum con 11 aperturas) sin hacer, la auditoría de outbound lo dice literalmente: "el agujero no está en generar interés, está en cosecharlo".
2. **Credenciales en scratchpads efímeros.** Hoy el SA JSON del cerebro desapareció al reciclarse el contenedor; `.smartlead_key` y `.twilio_auth` viven igual. Un reciclado en Outbound para las 7 rutinas.
3. **Pipeline triplicado** (repo, GHL, Notion) y **Apps Script duplicado** (`src/` copiado en 5 ramas).
4. **Tres informes de lunes** (Growth Review 8:00, Informe Outbound 9:00, Weekly Plan 9:00) + Daily 9:30 el mismo día. Ruido para Maikel.
5. **Agentes sin canal de vuelta** (Ventas, Automatización) y **Antic caído** sin reintento: nadie vigila fallos de rutina.
6. **Agente de Automatización prematuro:** su propia auditoría concluye que casi nada debe automatizarse aún. Y Ventas sin rutina solo trabaja al ser tocado.
7. **La North Star (oportunidades cualificadas) no se mide.** Todo el sistema optimiza arriba del embudo porque es lo único que tiene contador.
8. **Dispersión:** 27 ramas, ~15 sesiones dormidas con preguntas abiertas, 4 MCP conectados sin uso (Gamma, Heygen, Higgsfield, Mailerfind).
9. **Decisiones humanas triviales bloquean semanas:** borrar un email de una secuencia esperó 7 días. Lo de dinero debe seguir siendo de Maikel; lo operativo con criterio escrito no.
10. **Automatizable ya:** alerta de respuesta <2h, guardián ya programado (ok), cola de llamadas (Vapi), sync GHL→Notion, registro automático de reuniones desde el calendario, aviso de cobros.

## 8. GPT-6 Astra: reparto de papeles

Aviso honesto: no tengo especificaciones verificadas de GPT-6 Astra (mi conocimiento llega a junio de 2026). Lo que sigue es un reparto por principios, no por benchmarks.

| Tarea | Quién | Por qué |
|---|---|---|
| Orquestación, memoria del sistema, rutinas, repo, herramientas conectadas | **Fable** | ya está integrado (sesiones, triggers, MCP); cambiarlo es rehacer el sistema |
| Redacción operativa (secuencias, artículos, partes) | **Fable** | vive en el contexto de cada agente |
| **Revisión adversarial** de borradores antes de enviar (copy de outbound, propuestas, guiones de subida de precio) | **Astra** | un segundo modelo sin el sesgo del autor detecta lo que el primero no ve |
| Puntuación independiente de leads/señales y de hipótesis del Documento Madre | **Astra** | evaluación sin contexto previo = menos confirmación |
| Red-team de decisiones financieras grandes (préstamo, pricing) | **Astra revisa, Fable decide con Maikel** | donde el coste del error es alto, dos opiniones |
| Investigación de mercado/ICP, radar IA | **Compartida** | comparar salidas y quedarse con la unión |
| Evaluación semanal de contenido (qué pieza funcionó y por qué) | **Astra evalúa, Fable ejecuta el cambio** | separa quien hace de quien juzga |
| Acceso de escritura a Smartlead/GHL/Sheet | **Solo Fable** | dos modelos escribiendo en los mismos sistemas = doble apunte y conflictos |

Regla: **Astra no ejecuta, revisa.** Recibe input + rúbrica, devuelve puntuación y correcciones. Así se prueba sin tocar la arquitectura.

## 9. Arquitectura ideal: Qualivo Growth OS

```
DATOS ──► ANÁLISIS ──► DECISIÓN ──► EJECUCIÓN ──► MEDICIÓN ──► APRENDIZAJE
```

**DATOS (una capa, no nueve):**
- **GHL = CRM y fuente única de verdad comercial**: contactos, etapa (señal → conversación → reunión → propuesta → cliente), origen, reunión celebrada (sí/no), importe. El repo deja de guardar pipeline; Notion deja de duplicar tareas de oportunidad.
- **Sheet finanzas** = fuente única de caja/deuda (ya lo es). **Quipu** = facturación (ya lo es).
- **`kpis/`** en el repo: un fichero diario `YYYY-MM-DD.json` escrito por una rutina "Colector de KPIs" (8:00) que lee Smartlead, GHL, GSC, DinoRank, GA4 y Sheet, y escribe una sola fila: envíos, respuestas, señales, conversaciones, reuniones, propuestas, clientes, tráfico, leads web, caja. **Todo lo demás lee de aquí.**
- Credenciales en variables de entorno del environment (persistentes), no en scratchpads.

**ANÁLISIS:** un único **Growth Review semanal** (lunes 8:00, Landing) que solo lee `kpis/` y el Documento Madre, y sustituye a los tres informes de lunes. Astra revisa el review antes de que lo vea Maikel.

**DECISIÓN:** cerebro, lunes 9:00, a partir del review: 3 prioridades, experimentos que siguen/paran, aprobaciones agrupadas en **una cola** (proyecto "Aprobar" en Todoist con enlace al borrador). Maikel despacha la cola una vez al día, no borrador a borrador.

**EJECUCIÓN:** 4 agentes, no 6: **Cerebro** · **Growth/Contenido** (Landing) · **Revenue** (Outbound + Ventas fusionados: de señal a propuesta en una sola rama) · **Clientes** (OutThink/EAC/Eleva como sub-ramas de trabajo pagado). Automatización se pliega en Revenue. Todo borrador con criterio escrito y aprobado se envía sin volver a preguntar (plantillas pre-aprobadas); dinero y clientes nuevos siguen pasando por Maikel.

**MEDICIÓN:** el colector diario + registro de reuniones automático (evento de calendario con etiqueta → etapa en GHL).

**APRENDIZAJE:** viernes: Documento Madre actualizado con las frases textuales de las conversaciones; base Experimentos con SCALE/ITERATE/KILL; `cerebro.md` v(n+1). Un vigilante de rutinas: si una falla (error 529), se relanza y se avisa.

## 10. Próximo experimento (esta semana)

**Nombre:** Cosecha de señales calientes con doble revisión.

- **Objetivo:** convertir las señales calientes ya generadas (A-House 11 aperturas, Nexitum 11, Watios2 10, AIO 10, Otefisa 2 clics, Grup Montaner 2 clics, Equilibrha, Contamar, Mario Losada, Carol Zauma…) en reuniones.
- **Hipótesis:** una señal caliente + un toque personalizado revisado por un segundo modelo + llamada o respuesta en <24h produce ≥3 reuniones de ~15 señales en 7 días. Hipótesis secundaria: los borradores revisados por Astra obtienen ≥1,5× la tasa de respuesta de los no revisados.
- **Herramientas:** Smartlead (stats de señales), GHL (lista caliente diaria, ya se genera), repo `ventas/`, Astra vía API o chat, Todoist (cola "Aprobar").
- **Agentes:** Outbound (lista + borrador Fable), Astra (revisión con rúbrica: claridad del gancho, dato real del prospecto, paso pequeño, ausencia de venta directa; puntuación 1-5 y reescritura), Cerebro (mide y reporta el viernes), Maikel (envía y llama).
- **Pasos:** (1) martes: Outbound saca las 15 señales más calientes con su borrador; (2) se dividen al azar en dos mitades: A = borrador Fable tal cual, B = borrador Fable revisado y reescrito por Astra; (3) Maikel envía las 15 el miércoles por la mañana y llama a las 5 con más aperturas; (4) toda respuesta se contesta en <2h; (5) viernes: recuento.
- **Input:** 15 señales con historial (aperturas, clics, campaña, dato del probe) + rúbrica de revisión.
- **Output esperado:** 15 mensajes enviados, 5 llamadas hechas, ≥3 reuniones agendadas, tabla A/B de respuestas.
- **KPI:** reuniones agendadas (principal) · respuestas por grupo A/B (secundario) · tiempo medio de respuesta de Maikel.
- **Éxito:** ≥3 reuniones **o** grupo B ≥1,5× respuestas que A. **Fracaso:** <1 reunión → el cuello de botella no es el copy sino la ejecución (llamadas), y Astra no aporta en esta fase; el siguiente experimento sería la cola de llamadas Vapi.
