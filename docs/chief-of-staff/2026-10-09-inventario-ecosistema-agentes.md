# Inventario del ecosistema de agentes de Qualivo · 9 de octubre de 2026

> **Chief of Staff · primera misión · modo auditoría.** Nada de lo que sigue modifica campañas, presupuestos, precios, garantías, mensajes, contratos, automatizaciones ni documentos existentes. No se ha creado ninguna base de datos, agente ni automatización. Este fichero es el único artefacto nuevo.
>
> **Para qué sirve:** revisarlo con Maikel y con ChatGPT antes de aprobar la arquitectura de Qualivo Growth OS V1, sin duplicar lo que ya existe.
>
> **Qué se ha verificado directamente:** 20 páginas de Notion y 6 bases de datos (Sala de Mando y HQ), las 45 ramas del repositorio `qualivo-sys/qualivo` (ficheros de sistema, bus, registry, docs de arquitectura), las 56 sesiones y 53 rutinas programadas de la cuenta de Claude (lectura en vivo, 9-oct 09:00 UTC). Lo que no se ha leído completo se marca como tal en el apartado 9.

---

## 0 · Lo esencial en diez líneas

1. **Qualivo ya tiene un sistema operativo de agentes funcionando.** No es un terreno vacío: hay una constitución (`sistema/cerebro.md`), un bus, un registro, 25 rutinas con cron ejecutándose y un ciclo semanal que, a diferencia de septiembre, ahora sí corre.
2. **El problema no es la falta de diseño, es el exceso.** Hay **tres arquitecturas escritas en cinco semanas** (Agent OS del 10-sep, Codex Growth OS del 25-sep, organigrama con dos leads del 1-oct) más una cuarta capa de dirección creada el 2-oct (Outbound Revenue Orchestrator). Ninguna está firmada; las tres siguen vivas en paralelo.
3. **La capa de coordinación está cuadruplicada.** El Cerebro (CEO advisor, COO, CFO, PM, Chief of Staff), el Orchestrator, Growth como «Revenue Orchestrator» (Plan de octubre en Notion) y los dos team leads «que no existen todavía como sesión». Este Chief of Staff sería la quinta si no se decide antes quién coordina qué.
4. **El CFO no es independiente hoy:** es la misma sesión que el Cerebro. La jerarquía nueva (CFO independiente) choca con la realidad.
5. **Fuente de verdad: declarada en cinco sitios, mantenida en uno y medio.** La Sala de Mando se declara «fuente única de verdad para la ejecución» y no se actualiza desde el 1-sep. Lo que de verdad se mantiene es `cerebro.md` (repo) y las páginas sueltas de los agentes en Notion.
6. **Posicionamiento y oferta: al menos seis definiciones vivas.** La última (7-oct, actualizada 8-oct con mínimo 1.000 €/mes) tiene el acta «por completar».
7. **Presupuesto de Paid: tres cifras en una semana** (250 €/mes en el plan del cerebro, 1.200 €/mes decidido el 1-oct según Paid, 2.000 €/mes × 3 meses según el plan del CFO v2 del mismo día).
8. **Riesgo de seguridad abierto desde el 10-sep:** token de Meta con alcance sobre más de 20 cuentas de clientes sin rotar; token de GoHighLevel expuesto en un chat el 1-oct; cuatro actores tocando Meta con una sola identidad (cinco cambios sin autor en diez días).
9. **Retención es el agujero según el CFO (3,7 meses de vida media) y no tiene ni agente, ni proceso, ni métrica viva.** Los gestores de cuenta están definidos en papel; el cliente que más se queja (EAC, 481 €/mes) recibió 4 commits en diez días frente a 253 de Creative Performance.
10. **Hay un segundo ecosistema de agentes fuera de Claude** (skills de Codex en el ordenador de Maikel, según la rama `codex/`), con credenciales embebidas según su propio informe. No está inventariado ni conectado al resto, y no se ha podido verificar desde aquí.

---

## 1 · Inventario de documentos

Criterio de clasificación: **VIGENTE** (manda hoy), **VIGENTE PARCIAL** (manda en parte, contradicho en otra), **HISTÓRICO** (contexto, no manda), **PROPUESTA** (diseño sin firma).

### 1.1 Los tres documentos de partida

| Documento | Última edición | Qué contiene | Estado | ¿Fuente de verdad? |
|---|---|---|---|---|
| **Plan Maestro Qualivo · El Cerebro de la Agencia** (HQ) | 17-mar-2026 | Diagnóstico de marzo (MRR 5.100 €, 5 clientes, equipo Alba/José/Víctor/Daniela), 5 cuellos de botella, plan de 90 días, hoja de ruta técnica (DeepAgent, n8n), scorecard vacío | **HISTÓRICO** | **No.** El equipo descrito ya no existe (confirmado en `sistema/plan-octubre.md`: «Alba, José y Marilia ya no están»). MRR real a 1-oct: 1.011 €. Ninguna acción del plan de 90 días está marcada. Conservar como archivo del punto de partida de 2026. |
| **QUALIVO · HQ** | Página: 24-mar-2026. Hijos: hasta 8-oct | Índice de 7 áreas + unas 30 páginas sueltas añadidas de abril a octubre (planes Q2, Q3, 18 meses, digests del Radar, Matriculación Pro, Plan de octubre, Paid, Alpha Media…) + 5 bases de datos (Radar IA, Radar Ofertas, Plan Q3, Bandeja solicitudes, QUALIVO DAILY, Llamadas de Raquel) | **HISTÓRICO como estructura · VIGENTE como contenedor** | **Como índice sí, como fuente de decisiones no.** Su cabecera dice «última actualización marzo 2026» y su regla («si algo no está aquí no existe») compite con la de la Sala de Mando («fuente única de verdad para la ejecución»). Mezcla sin marcar lo histórico (Plan Q2 agentes, Plan 18 meses con HTL y Vegliss) con lo vigente (Plan de octubre, Paid, Alpha). Necesita una pasada de curación: etiqueta HISTÓRICO/VIGENTE por página. |
| **Qualivo OS · Sala de Mando** | 1-sep-2026 | Loop ANALYZE→LEARN, «dónde vive cada cosa», sprint de la semana 1-5 sep, ritual semanal, 6 bases de datos (Roadmap, Tareas, Experimentos, Decisiones, Sprints, Agentes) y 10 subpáginas | **VIGENTE PARCIAL · estructura correcta, contenido congelado el 1-sep** | **Debería serlo y no lo es.** Ver 1.2. Decidir: o el Cerebro la vuelve a alimentar cada viernes (decisiones, experimentos, agentes) o se archiva y se deja de citar como fuente única. Mantenerla «declarada» y no mantenida es el peor escenario. |

### 1.2 Las bases de datos de la Sala de Mando (estado real a 9-oct)

| Base | Filas | Última entrada | Lectura |
|---|---|---|---|
| **Agentes** | 8 | 1-sep | Desactualizada: Outbound «pendiente conexión», CFO y Data «cubierto por otro», SEO «cubierto». No aparecen Paid, Creative Performance, Contenido, Intelligence, Orchestrator, Cold Calling, LinkedIn, Arquitectura ni los gestores de cuenta. Es el único «inventario de agentes» en Notion y no refleja ninguno de los agentes creados después del 1-sep. |
| **Decisiones** | 10 | 3-sep | Todas «Vigente». Cuatro tenían revisión el 30-sep y no se actualizaron (septiembre no escalar, inglés/IA al parking, formación/low-ticket al parking, recuperar control). Las decisiones reales de septiembre y octubre (posicionamiento V2, precio mínimo 1.000 €, Meta solo Maikel, Orchestrator, Content OS) no están aquí: viven en `cerebro.md`, en páginas sueltas y en Claude Docs. |
| **Sprints semanales** | 17 (S1 sep → S4 dic) | 1-sep | Solo S1 sep tiene resultado. S2 a S5 de septiembre siguen en «Próximo». Los sprints de octubre (escalar lo validado, partnerships, SEO, pre-decisión noviembre) se escribieron el 1-sep y no coinciden con el plan de octubre vigente (arreglar, no escalar). |
| **Tareas** | 18 | 2-sep | 14 de Maikel, 4 del Cerebro. Ninguna desde el 2-sep. |
| **Experimentos** | 4 | 8-sep | Ninguno cerrado. Los experimentos reales de Paid (EXP-001, H-CRM-01, H-VERT-01, H-FORM-01, H-CREATIVO-02…) viven en la bitácora de Paid y en `paid/experimentos/`, no aquí. |
| **Roadmap Sep-Dic** | 4 | 1-sep | Coherente con la época; octubre decía «Acquisition Engine: escalar», el plan vigente dice lo contrario. |

**Conclusión:** la Sala de Mando se diseñó bien y se abandonó a los diez días, cuando el trabajo real pasó al repo y a páginas sueltas. Hay otra «QUALIVO OS» de julio (17-jul, con 11 bases de datos: OKRs, Tareas, Clientes, Creative Lab, QLAB, SOP, Producto, Pipeline & ABM, Journal, KPIs, Contenido) que es la generación anterior del mismo intento. Dos generaciones de sistema operativo en Notion, ninguna viva.

### 1.3 Documentación de estrategia, oferta y posicionamiento

| Documento | Dónde | Fecha | Estado | Nota |
|---|---|---|---|---|
| `sistema/propuesta-valor.md` V2 | repo, rama del cerebro | 10-sep | **VIGENTE · congelado** «hasta 8-10 propuestas enviadas» | Deroga la matriz del 8-sep. ICP 5-50 personas, suelo 500 €/mes de captación, nunca precio en frío ni en web. Espejo en `main:sistema/propuesta-de-valor.md`. |
| Google Doc «Estrategia Central Qualivo v1» + `sistema/estrategia-central.md` | Drive + repo | 9-sep | **VIGENTE PARCIAL** | `main/sistema/README.md` y el control plane dicen que el Doc manda sobre estrategia. `cerebro.md` dice que el único documento válido de posicionamiento es `propuesta-valor.md`. Dos reglas de precedencia distintas en el mismo repo. |
| **OUTBOUND BRAIN** (Notion) | Sala de Mando | 8-sep | **VIGENTE para outbound** · parcialmente superado | 18 ICPs, Growth Score 0-50, reglas de copy, gobernanza, winners/losers con datos reales. La adenda del 2-oct (Orchestrator, Type A/B/C, señales) y la V2 signal-led sustituyen la lógica de secuencias. El Brain no se ha actualizado con eso. Espejo `estrategia/outbound-brain.md`. |
| `sistema/outbound-b2b.md` + `sistema/posicionamiento-growth.md` | ramas Outbound y Cold Calling | 27-ago | VIGENTE PARCIAL | Marco de 8 fugas A-H, 8 ejes 0-10. Convive con el Growth Score 0-50 del Brain: **dos sistemas de puntuación de cuentas**. |
| Documento Madre · Qualivo (Notion) | suelto | 12-ago | HISTÓRICO | Encargado por el cerebro al Outbound el 1-sep (trigger nunca disparado). No leído en detalle. |
| **Decisión sobre la arquitectura de oferta · 7-oct** (+ nota 8-oct) | Notion, suelta | 8-oct | **VIGENTE · es lo más reciente sobre oferta y precio** | ATTRACT→FILTER→CONVERT→PREPARE→CLOSE + Intelligence; Managed, Managed+Acquisition, Build & Transfer, Seasonal, Advisory. Nota de Maikel 8-oct: mínimo de proyecto 1.000 €/mes, Managed+Acquisition 1.200 €/mes. **El checklist de 12 decisiones está sin marcar y el acta «por completar».** Incluye además «Revenue Acquisition & Sales Journey v1 · propuesta para revisión» con preguntas abiertas a cada agente. |
| Insights del 2-oct + Adenda operativa + V2 Signal-led (Notion) | HQ / 04 Captación | 2-oct, ed. 6-oct | **VIGENTE para outbound/ABM** | Tres modelos comerciales A/B/C, Orchestrator como capa de dirección, Identity V1, stop conditions, §19 aprobado por Maikel. Tabla de 8 reuniones con **8 precios y garantías distintos**. |
| Plan Q2 2026 · Agentes IA (15 agentes .md) | HQ | 15-abr | HISTÓRICO | Olas abril-junio. Ninguno de esos 15 agentes coincide con los agentes reales de hoy. |
| Plan Estratégico 18m → Trimestre → Semana | HQ | 1-jun | HISTÓRICO | HTL Servicio, HTL Formación, Vegliss, Equipzilla. Ninguna de esas líneas aparece en los planes de octubre. |
| Plan Qualivo → 1M€, Qualivo 5.0, Manual Comercial 5.0, Manual Outreach 5.0, Estrategia 2025-2026, Plan Q2 abril-junio, Manual de Crecimiento de Agencia | HQ / 01 y 04 | nov-25 a mar-26 | HISTÓRICO | Generaciones anteriores. Útiles como biblioteca, no como fuente. |
| Los nueve puestos de Qualivo · catálogo para clientes | Sala de Mando | 10-sep | VIGENTE como catálogo · anexo interno útil | El anexo «qué está construido de verdad» es la mejor foto honesta del producto a 10-sep. Debería refrescarse (el agente de WhatsApp ya existe, el Content está rediseñado). |

### 1.4 Documentación del proceso comercial y del Revenue Journey

| Documento | Fecha | Estado | Nota |
|---|---|---|---|
| **Sistema comercial Qualivo · cómo funciona hoy** (11 páginas, Notion) | 24-sep | **VIGENTE como AS-IS** | Sacado del código y las plantillas. Marca ⚙️ automático / 🙋 manual / 🟡 propuesto. Es la mejor documentación del embudo inbound real. Incluye «11 · Cosas que no cuadran (para decidir)». |
| Sistema comercial v1 · 12 etapas (Notion) | 24-sep | PROPUESTA | Diseño TO-BE del desconocido al promotor. 8 decisiones pedidas a Maikel (garantía única, Raquel en catalán, reabrir LinkedIn…), sin respuesta registrada. |
| **Recorrido completo del lead · formación y clínicas · octubre** (Notion) | 1-oct | **VIGENTE · «decisiones aprobadas»** | P0 (WA1 corto, Booked→Show, no-show recovery, NEXT STEP universal, segunda reunión = decisión, seguimiento por bloqueo), P1 (FIT/INTENT/PRIORITY), P2. Instrucción explícita a Claude de implementar sin rediscutir. Es la fuente operativa del inbound hoy. |
| Plan de octubre 2026 · para revisar (Notion) | 30-sep | **VIGENTE PARCIAL** | Versión «operativa»: Revenue→Growth→Build, Growth como Revenue Orchestrator, bloque 9:30-11:30, §11 arquitectura de oferta (superado por el 7-oct). Baseline: 40 leads, 17 citas, 7 reuniones, ~80 €/reunión. |
| `sistema/plan-octubre.md` (repo, cerebro) | 29-sep | **VIGENTE PARCIAL** | **Corrige el baseline de la versión Notion con datos de GHL:** 57 leads de Paid, 0 citas desde Paid, 124 €/reunión, 56 leads sin trabajar, 130 oportunidades abiertas. Presupuesto 250 €/mes. Sustituye a `plan-septiembre.md`. **Las dos versiones del plan de octubre no dicen lo mismo y ninguna remite a la otra.** |
| Plan de negocio 12 meses (CFO, Notion, privado) | 1-oct | **VIGENTE · fuente financiera** | Verificado contra Quipu (653 facturas). 1.011 € MRR, 3,7 meses de vida media, 43.327 € deuda, 800 € caja. Parte 5 (v2, mismo día) cambia la tesis a 10k/15k MRR y fija «2.000 €/mes de captación durante oct-nov-dic» como decisión del fundador. |
| Paid · Bitácora, conclusiones e hipótesis | 1-oct, ed. 7-oct | **VIGENTE** | Registro ejemplar: cifra+fuente+fecha, hipótesis con fecha de muerte, errores propios reconocidos. Presupuesto 1.200 €/mes (decisión Maikel 1-oct). Pendientes de Maikel incluyen rotar tokens. |
| Content OS Qualivo v1 | 6-oct | **VIGENTE para contenido** | Constitución R1-R18, gobernanza, 13 documentos declarados históricos, 8 decisiones D1-D8 pendientes de Maikel. Declara el Revenue Journey de 7 etapas como marco oficial de marca. |
| Paid · Funnel v2 (8-oct), Eleva weekly, Alpha Media puesta en marcha, Andrea Acha brief | 6 a 8-oct | VIGENTE (operativo) | Trabajo de la semana; no leídos en detalle. |

**Cuatro taxonomías del recorrido conviven:** 5 etapas (ATTRACT…CLOSE, 7-oct), 7 etapas (Revenue Journey de Content OS), 8 fugas A-H (outbound-b2b), 12 etapas (24-sep), más el lifecycle de 16 estados del Codex y los 13 estados del Outbound Brain. **Tres sistemas de cualificación:** A/B/C/D (en producción), FIT/INTENT/PRIORITY (aprobado P1 el 1-oct y también en Codex), Growth Score 0-50 (Brain) y 8 ejes (outbound-b2b).

### 1.5 Documentación del propio ecosistema de agentes (la que importa para Growth OS V1)

| Documento | Autor / dónde | Fecha | Estado | Qué aporta |
|---|---|---|---|---|
| **`sistema/cerebro.md`** | Cerebro · rama `claude/quipu-billing-dashboard-g2s2ap` | cabecera 21-sep, contenido 1-oct | **VIGENTE · constitución de facto** | Organigrama con dos team leads (1-oct), regla Meta solo Maikel, un dueño por activo, puerta de entrada para agentes nuevos, encargo del fundador 30 días, ritual del viernes, protocolo `[PARA CEREBRO]`, directrices, registro de cambios. **ADR-004 (10-sep) decía que debía dejar de ser la constitución y repartirse; no ha ocurrido.** Copias divergentes en las ramas de Ventas y Automatización. |
| **Auditoría del sistema de IA · 7-sep** (`sistema/auditoria-2026-09-07.md`) | Cerebro | 7-sep | HISTÓRICO · base del Agent OS | Primera foto: sesiones, 24 rutinas, accesos, el ciclo semanal roto, «arquitectura ideal: Qualivo Growth OS» (§9). |
| **Qualivo Internal Operating System · Agent OS TO-BE** (`docs/agent-os/`, 30 ficheros, `registry.json`, 10 ADRs) | sesión Arquitectura · rama `claude/dreamy-curie-9on2ct` | 10-sep | **PROPUESTA · «pendiente de firma de Maikel»** | 8 agentes (Brain, Content, Demand, Outbound, SDR, Sales, Ops, Paid), control plane (bus en ficheros, registry, salud, escalera de confianza, radio de impacto), 13 hallazgos con evidencia, plan de migración, «pendiente de Maikel». **Parcialmente ejecutado:** `main` creada como rama de integración, `bus/` creado, Paid creado, Content separado (21-sep). **No ejecutado:** SDR, registry en uso, retirada de `cerebro.md`, Ops. |
| **Qualivo Growth OS · Fase 1** (`docs/qualivo-growth-os/`, 5 ficheros) | **Codex**, commit de `qualivo-sys <maikel@qualivo.io>` · rama `codex/qualivo-growth-os-phase-1` | 25-sep | **PROPUESTA · «diseño para revisión»** | Revenue Intelligence, Growth System Architect, Conversion Psychologist, RevOps Engineer, Outbound Revenue Engine, lifecycle de 16 estados, Event Contract v1 (JSON), change control READ/ANALYZE/PROPOSE/WRITE, Experiment Memory, backlog P0-P2. **Inventaria agentes que no existen en Claude** (Discovery Call, Pre-call Research, Proposal, Post-call Follow-up, Onboarding Cliente, Sales Pipeline, Analytics, Automations, Business Developer) y los sitúa como skills en `C:\Users\User\.agents\skills\` con **credenciales embebidas** (hallazgo P0 del propio documento). |
| Organigrama 1-oct (en `cerebro.md`) | Maikel vía Cerebro | 1-oct | VIGENTE en papel | Cerebro = PM y CFO; Lead de Adquisición (Paid + Creative); Lead de Outbound (Email, Raquel, LinkedIn); Growth = mano derecha comercial; gestores de cuenta. **Los dos leads «no existen todavía como sesión»** (deuda reconocida en el propio fichero). |
| Adenda 2-oct §11 «Arquitectura de agentes: una sola dirección» | Notion | 2-oct | VIGENTE para outbound | Maikel → **Outbound Revenue Orchestrator** → especialistas (Research, Email, LinkedIn, Calling, Growth, Paid, Creative). Aprobado por Maikel (§19). No menciona a los dos leads del 1-oct ni al Cerebro. |
| Plan Q2 Agentes IA (15 agentes) | HQ | 15-abr | HISTÓRICO | Primera generación. |
| Design AI Business OS (sesión 10-ago), CCO agent (13-ago, `.claude/agents/chief-content-officer.md`, `radar-scout.md`) | ramas antiguas | agosto | HISTÓRICO | Generación cero. |
| **Qualivo · Llaves y Documentos** (Notion) | Cerebro | 11-sep | VIGENTE como inventario · **estado de rotación sin actualizar** | Inventario correcto de 10 llaves (sin valores), 9 sesiones, 10 triggers, infraestructura. Dice «rotar ya» las cuatro rojas; a 7-oct Paid sigue listando Meta y GHL como pendientes de rotar. |
| `main/sistema/README.md` «Dónde vive cada cosa» | Arquitectura | 10-sep | VIGENTE PARCIAL | Tabla de fuente de verdad por dato. Dice que agentes/permisos/salud viven en `docs/agent-os/registry.json`, que **no existe en `main`** (solo en la rama de Arquitectura). |

**Veredicto sobre «qué debe mantenerse como fuente de verdad» para el diseño de Growth OS V1:**

- **Mantener:** `cerebro.md` (reglas vigentes), `propuesta-valor.md` V2 + decisión de oferta 7-oct/8-oct (oferta y precio), Recorrido completo del lead 1-oct (inbound), Adenda 2-oct + V2 signal-led (outbound), Content OS v1 (contenido), Plan de negocio del CFO (finanzas), Paid bitácora (paid), Llaves y Documentos (accesos), Sistema comercial «cómo funciona hoy» (AS-IS).
- **Reconciliar antes de diseñar:** las dos versiones del plan de octubre; las tres cifras de presupuesto; el documento de estrategia que manda (Doc vs `propuesta-valor.md`); quién dirige (Cerebro vs Orchestrator vs Leads vs Growth).
- **Marcar HISTÓRICO explícitamente:** Plan Maestro, Plan Q2 agentes, Plan 18m, Plan Q3, Qualivo 5.0, QUALIVO OS de julio, Documento Madre, Máquina de Contenido, los 13 documentos de contenido ya listados por Content OS, y las dos arquitecturas no firmadas (Agent OS 10-sep, Codex 25-sep) como **insumos** de la V1, no como alternativas vivas.

---

## 2 · Inventario de agentes (verificado en vivo, 9-oct)

Fuente: lista de sesiones y de rutinas de la cuenta (56 sesiones, 53 rutinas: 47 activas, 6 desactivadas; 25 con cron, el resto timbres o avisos únicos). Un «agente» aquí es una sesión de Claude Code con rama y, normalmente, rutinas. **Entre despertares no ocurre nada**: no son procesos siempre encendidos.

**Perímetro real (confirmado por Maikel, 9-oct):** las sesiones con las que habla habitualmente son trece: Agente CFO, Agente Outbound, Agente growt, Agente de contenido Qualivo, Agente Paid, Agente Creative Performance, Qualivo Intelligence · demo comercial, Alpha Media Group · proyecto, Kill & Ramble, Agente EAC, Campaña Antic Barcelona, Agente Eleva y Equipzilla · CRM inteligente sobre Pipedrive. Las otras 43 sesiones de la cuenta no las abre, incluidas las que los organigramas presentan como capas de dirección (Orchestrator, leads) y las fichadas con encargo (Ventas, Automatización).

### 2.1 Qualivo interno · operando (con rutinas que se ejecutan)

| Agente (sesión) | Rama | Modelo | Rutinas cron (hora UTC) | Posee hoy | Observación |
|---|---|---|---|---|---|
| **Agente CFO** («el Cerebro», antes CEO Agent / Quipu billing) | `quipu-billing-dashboard-g2s2ap` | opus-5 | Daily 9:30 revisión de agentes · lunes Weekly Plan · viernes 13:00 Weekly Review + CEO Brief · día 1 cierre financiero. **Las cuatro ejecutadas en octubre** (1, 2, 5 y 9-oct). | Sheet financiero, Quipu, Todoist, Notion Sala de Mando, `cerebro.md`, parte diario | Acumula CEO advisor + COO + CFO + Chief of Staff + PM. El ciclo semanal, roto en septiembre (H2), **ya funciona**. |
| **Agente Outbound** | `client-acquisition-ideas-k00f5d` | opus-5 | 7 crons: carga de leads 5:30 · SDR 6:00 · triaje 7:30 · triaje cada hora 7-16 · guardián Smartlead 10:00 · reporte envíos 15:30 · informe lunes 7:00 | Smartlead, HeyReach, Apollo, buzones y dominios, `captacion/`, `sdr/`, `estrategia/` | El más autónomo y el más concentrado (prospección + SDR + triaje + infra). La separación Outbound/SDR propuesta el 10-sep no se hizo. En RUNNING en el momento de la lectura. |
| **Agente growth** (Landing / Growth) | `qualivo-landing-vercel-nubk1i` | **sonnet-5-5** | 9 crons: Radar IA 4:00 · Growth Review lunes 6:00 · seguidores IG 6:30 · **preparación de reuniones 7:22** · **revisión semanal viernes 5:50** · revisión llamadas de Raquel 17:30 · Daily Paid→Growth 19:15 · resumen de cierre 18:24 · leads fin de semana (sept) + 6 timbres recibidos | qualivo.io, código de `/api` (WhatsApp, cadencias, informes), demos, Intelligence web, preparación de reuniones, Alpha Media | **El agente con más rutinas y más responsabilidad operativa corre en el modelo más pequeño de la cuenta.** Su rol cambia según el documento: «mano derecha comercial, no fábrica» (`cerebro.md` 1-oct), «Revenue Orchestrator» (Plan oct Notion), «dueño del sistema: cadencias, CRM y Meta» (Content OS). La sesión «Alpha Media Group · proyecto» trabaja **en la misma rama**. |
| **Agente de contenido Qualivo** (Head of Content) | `qualivo-landing-vercel-nubk1i` (misma rama que Growth) | opus-5-5 | 5:15 L-V trabajo del día | Blog, LinkedIn, carruseles, newsletter, Master Reviewer, `content/` | Separado de Growth el 21-sep. Comparte rama con Growth y Alpha: tres sesiones escribiendo en una rama. |
| **Agente Paid** | `qualivo-paid` | fable-5-1 | 6:00 anomalías · 19:00 revisión de hipótesis · timbres con Creative y Growth | Lectura de la cuenta de Meta de Qualivo, GHL de Qualivo (según `cerebro.md`), `paid/`, `bus/out/paid.jsonl` (104 entradas) | Barandilla: construye en pausado, no activa, no pausa, no mueve presupuesto. Único que escribe el bus de forma sostenida. |
| **Agente Creative Performance** | `qualivo-creative-performance` | opus-5-5 | Sin cron; timbres Paid↔Creative (7 y 8-oct) | Anuncios, voces (clon), música, storyboards, skills creativas | **Estado REQUIRES_ACTION** (bloqueado esperando algo). 253 commits en 10 días según el CFO. |

### 2.2 Qualivo interno · creados y sin operar, o dormidos

| Sesión | Rama | Creado / último uso | Estado | Nota |
|---|---|---|---|---|
| **Qualivo · Outbound Revenue Orchestrator** | sin rama | ~2-oct / 4-oct | **Diseñado, no conectado** | Capa de dirección del outbound según la adenda del 2-oct. Su timbre «Canal con el Orchestrator» nunca se ha disparado. Sin rutinas. |
| Qualivo · Agente LinkedIn Outbound | `linkedin-outbound-agent` | 2-oct | Idle desde el 2-oct | Especialista nuevo. Sin rutinas. HeyReach en pausa a la espera de supresión e identidad. |
| Qualivo · Agente Cold Calling | `cold-calling-agent` | 30-sep / 2-oct | Idle | Recibió «rol completo» el 30-sep. Propuesta para la semana 5-9 oct. Sin rutinas. Solapa con la rutina «revisión diaria de llamadas de Raquel» de Growth y con Vapi en Outbound. |
| Qualivo Intelligence · demo comercial (+ ramas `qualivo-intelligence`, `intelligence-informes`, `intelligence-prospeccion`) | 3 ramas | 25-sep a 8-oct | Activo a demanda | Producto y demo. 136 commits en 10 días. Tres ramas para una cosa. |
| **Agente de Ventas Qualivo** | `qualivo-agente-ventas-sq3vnt` (copia vieja de `cerebro.md`) | 1-sep / 6-sep | **Dormido** | Fichado en el Agentes DB, encargo «reactivación de cartera + subidas de precio» con timbre nunca disparado. H9 de la auditoría sigue abierta. |
| **Agente de Automatización Qualivo** | `qualivo-automatizaciones-b7k2m9` | 1-sep / 9-sep | **Dormido** | Secuencia 3-7 en n8n y workflow de parada total construidos en borrador. Sin mapa único de n8n. |
| Arquitectura de agentes Qualivo | `dreamy-curie-9on2ct` | 10-sep | Dormido | Meta-agente que diseñó el Agent OS. Correcto que no opere. |
| Agente de ofertas | `hormozi-irresistible-offers-6hqhm4` | 10-sep | Dormido («taller», ADR-008) | Origen del conflicto H10 de dos ofertas. |
| Agente revisor de ads (`.claude/agents/qualivo-creative-review.md`) | `vigilant-sagan-mj705e` | 15-sep | Dormido | Solapa con el Master Reviewer de contenido. |
| Auditoría del embudo · semana 38 | `auditoria/embudo-semana-38` | 24-sep | Trabajo puntual | Produjo «Sistema comercial · cómo funciona hoy» y las 12 etapas. |
| Red team · Hero lead magnet · Agente revisor lead magnets | sin rama | 8-sep | Dormido / archivado | — |

### 2.3 Client OS · un agente por cliente

| Cliente | Sesión | Rama | Último uso | Rutinas | Nota |
|---|---|---|---|---|---|
| Escola Aeronàutica (EAC) · 481 €/mes | Agente EAC | `eac-metrics-dashboard-qx7fkh` (**rama por defecto del repo**) | 8-oct | 0 | 4 commits en 10 días; cliente que pide trazabilidad. Esta sesión de Chief of Staff ha arrancado sobre una copia de esa rama. |
| Eleva Academy · 530 €/mes | Agente Eleva | `eleva-academy-metrics-jm8msg` | 6-oct | 0 | Dashboard Netlify + weekly 6-oct. |
| Adigital / OutThink | Agente Adigital | `google-ads-expert-prompt-uqmo9m` | 26-sep | 0 (n8n diario externo) | Campaña 2.000 € cerrada el 24-sep; H11 «hay medición, no hay gobierno». |
| Antic Barcelona (a comisión) | Campaña Antic Barcelona | `antic-barcelona-campaign-627pq7` | 8-oct | 0 | Sin facturación viva (CFO). |
| Kubysoft (piloto, decide 13-oct) | Kubysoft · outbound (piloto) | sin rama (`clientes/kubysoft/` según cerebro) | 8-oct | 0 | Piloto sin facturar. |
| Don't Kill Rumble | Kill & Ramble creator acquisition | `kill-ramble-creator-strategy-knzcwu` | 9-oct | cron diario 9:52 (creadores) · aviso 16-oct · una rutina desactivada | Sin decisión de continuidad (CFO). Es el único cliente con rutina diaria. |
| **Alpha Media Group (cliente desde 2-oct, 1.200 €)** | Alpha Media Group · proyecto | **`qualivo-landing-vercel-nubk1i`** | 9-oct | 0 | Trabaja sobre la rama de Growth. Objetivo: sistema y panel antes del 16-oct. |
| Equipzilla (empleador de Maikel, no cliente) | Equipzilla · CRM inteligente sobre Pipedrive | sin rama · rama `equipzilla` | 6-oct | 0 | Comparte cuenta, Dinorank y token de Vercel con Qualivo. |
| Nuria Roure, Focus Practical, Inspyria, TPV Redsys | sesiones antiguas | jun-sep | 0 | Dormidas; Focus tenía cron REBT (no aparece ya). |

### 2.4 Personal OS (compite por la atención, no es Qualivo)

Inglés diario (cron 10:45 L-V, sesión nueva cada vez), plan de inglés, app de entrenamientos, Tibia bot, notificaciones de pisos, mapas conceptuales. Seis sesiones.

### 2.5 Histórico (sin rama viva ni rutinas)

Unas 25 sesiones de marzo a agosto: lead magnets (×2), Instagram ABM y publicación, carruseles virales, Klaviyo/Vegliss, dropshipping, job prospecting, campaign creation, Andorra SEO, Skills Scout, CCO agent, Design System, FEMXA Excel, competitor analysis… Candidatas a archivar tras comprobar que no guardan la única copia de algo (el repositorio conserva sus ramas).

### 2.6 Lo que dicen los registros frente a lo que hay

| Registro | Fecha | Agentes que lista | Coincide con la realidad del 9-oct |
|---|---|---|---|
| Notion · Agentes DB | 1-sep | 8 (Cerebro, Automation, Outbound, Growth, SEO, CFO, Ventas, Data) | **No.** Faltan 10 sesiones internas posteriores. |
| `cerebro.md` organigrama | 1-oct | Cerebro, 2 leads, Paid, Creative, Email, Raquel, LinkedIn, Growth, 7 gestores | **Parcial.** Los leads no existen; no menciona Contenido, Intelligence, Orchestrator, Cold Calling como sesiones. |
| `docs/agent-os/registry.json` | 10-sep (TO-BE) | 8 internos + 6 «not_yet» + clientes | **No.** Es diseño; SDR, Content, Ops nunca se crearon como define. |
| Llaves y Documentos · tabla de sesiones | 11-sep | 9 | **Parcial.** Faltan 8 posteriores. |
| Codex Growth OS · KEEP/MERGE | 25-sep | ~15 skills locales + 6 ramas | **No verificable desde aquí.** Nombra agentes que no existen como sesiones de Claude. |

**No hay hoy un inventario de agentes que coincida con los agentes que existen.** Este documento es el primero desde el 11-sep.

---

## 3 · Responsabilidades: quién posee qué (y dónde chocan)

| Activo o decisión | Según `cerebro.md` (1-oct) | Según otros documentos vigentes | Conflicto |
|---|---|---|---|
| Encender, pausar, mover presupuesto en Meta | **Solo Maikel.** Paid lee y recomienda | Codex: «aprobador de presupuesto»; Paid bitácora: lo mismo | Sin conflicto. Bien resuelto. |
| GoHighLevel de Qualivo | **Paid** | Content OS: «Growth es el dueño del sistema: cadencias, CRM y Meta»; Plan oct Notion: «CRM, cadencia, medición y marcador → Growth»; Recorrido del lead (P0) lo implementa Growth | **Conflicto.** El código de cadencias y WhatsApp vive en la rama de Growth; `cerebro.md` da el CRM a Paid. |
| Raquel (voz, Vapi) | Lead de Outbound | Auditoría 7-sep: Outbound; Growth tiene la rutina diaria de revisión de llamadas; Cold Calling agent recibió «rol completo» el 30-sep; registry: canal del SDR | **Cuatro dueños posibles.** |
| Dirección del outbound | Lead de Outbound (no existe) | Adenda 2-oct: Outbound Revenue Orchestrator (existe, no opera) | **Dos capas de dirección distintas en 24 horas, ninguna operativa.** El agente Outbound sigue dirigiéndose solo. |
| Dirección de adquisición (Paid + Creative) | Lead de Adquisición (no existe) | Paid y Creative se coordinan por timbres directos | Funciona de facto sin lead. |
| Coordinación general / prioridades | Cerebro (PM, COO) | Plan oct Notion: Growth como Revenue Orchestrator; mandato nuevo: Chief of Staff | **Tres coordinadores.** |
| Finanzas | Cerebro (CFO) | Jerarquía nueva: CFO independiente | **Hoy no es independiente.** |
| Web y contenido | Growth (web) · Head of Content (contenido) | Content OS: Head decide tema; Growth no toca contenido | Resuelto el 6-oct, pendiente D6 de Maikel. |
| Cuenta de cada cliente | Su gestor, full-stack, `clientes/<cliente>/ESTADO.md` obligatorio | — | No se ha verificado que exista ningún `ESTADO.md` actualizado. Alpha trabaja en la rama de Growth, no en una propia. |
| Propuestas y precio | Maikel decide; agente de propuestas con reglas (Plan oct Notion §11) | Decisión 7-oct: mínimo 1.000 €/mes | Sin agente de propuestas operativo (Ventas dormido). Lo hace Growth/Maikel a mano. |
| Retención, onboarding, informe al cliente | Gestores de cuenta | CFO: «informe semanal por cliente de una página que envía Maikel» (Q1 2027); Codex: Customer Success «EXTEND» | **Nadie lo hace hoy.** |
| Notion Sala de Mando | «Solo el cerebro escribe» | — | El cerebro no escribe desde el 1-sep. |

---

## 4 · Integraciones y permisos

### 4.1 Mapa de herramientas (quién las usa, con qué alcance)

| Herramienta | Quién | Alcance observado | Estado del acceso |
|---|---|---|---|
| **GoHighLevel** (CRM, pipelines Qualivo / Prospección / Radiografía) | Growth (código `/api`), Paid (lectura desde 1-oct), Outbound (contactos, tareas), gestores de cliente (EAC, Eleva, Alpha vía Zoho→Nexus) | Token PIT con contactos, oportunidades, tags, calendarios, formularios; datos personales de leads | **Expuesto en una transcripción el 1-oct.** Pendiente de rotar (Paid 7-oct). Variables en Vercel y en scratchpads efímeros. |
| **Meta Marketing API** | Paid (Qualivo), Growth (CAPI), EAC, Eleva, Focus | Token «Twin Integration» con `ads_read` sobre **más de 20 cuentas de clientes** | **Sin rotar desde el 10-sep.** Cuatro actores con la misma identidad: 5 cambios no atribuibles en 10 días (presupuestos, pausas, un conjunto duplicado). |
| Google Ads API | Adigital/OutThink, EAC, Eleva | Lectura y escritura de campañas | Credenciales por sesión. |
| Google cuenta de servicio (Sheets, GSC, GA4) | Cerebro (Cockpit), Growth (SEO, informe diario), EAC | Clave privada JSON | Pendiente de rotar (11-sep). Se perdió del scratchpad y se resubió (7-sep). |
| Smartlead, HeyReach, Apollo | Outbound | Campañas, secuencias, envíos, enriquecimiento (créditos) | Credenciales en n8n y scratchpad. HeyReach en pausa. |
| Vapi (Raquel) | Outbound / Growth | Llamadas salientes | Credencial en n8n. |
| n8n | Automatización (borradores), Adigital (informe diario), Outbound (SDR de respuestas) | Workflows; «sin mapa único» | Mapa `automatizaciones/mapa-n8n.md` pendiente desde el 9-sep. |
| Vercel | Growth | Despliegue de qualivo.io por CLI (no ligado a GitHub); crons web 6:45, 7:15, 8:00 | **Mismo token para Qualivo y Equipzilla.** Plan gratuito al 100 % de almacenamiento. |
| Resend | Growth | Email transaccional (secuencias) | Verificado en `maikelechevarria.com`, no en `qualivo.io`. SPF/DMARC de qualivo.io comprobados 6-oct. |
| Notion (MCP) | Cerebro, Growth, Content, Paid y esta sesión | **Lectura y escritura total del workspace**, incluida la página de llaves | La propia página de llaves lo advierte. |
| Quipu, Todoist, Google Calendar, Gmail | Cerebro | Facturas, tareas, calendario; Gmail conectado y nunca usado | — |
| Tactiq | Cerebro / Growth | Transcripciones de reuniones (base del «informe de patrones») | — |
| Apify, Kie, Dinorank | Growth, Creative | Scraping (presupuesto del mes agotado 25-sep, renueva 17-oct), creatividades, SEO | **Dinorank compartido con Equipzilla.** |
| GitHub `qualivo-sys/qualivo` | todos | **Repositorio público**, 45 ramas, ninguna fusionada, rama por defecto = cliente EAC | PII y claves fuera del repo por regla; `.vercelignore` protege `content/`. |

### 4.2 Permisos de esta sesión (Chief of Staff)

Esta sesión tiene conectados, además de Notion y GitHub: Apollo (incluye envío de emails y secuencias), HeyReach (incluye `send_message` y arrancar campañas), Gmail (enviar), Google Calendar (crear/borrar), Drive/Docs (escribir), Gamma, Heygen, Higgsfield, Tactiq. **Para un rol en modo auditoría es más de lo necesario.** No se ha usado ninguna capacidad de escritura externa. Recomendación para la V1: el Chief of Staff con conectores de solo lectura, o sin Apollo/HeyReach/Gmail.

### 4.3 El bus entre agentes

Diseñado el 10-sep (ADR-005: ficheros `bus/out/<agente>.jsonl`, un escritor por fichero). Realidad: `paid.jsonl` 104 líneas (rama Paid), `demand.jsonl` 38 líneas (rama Growth), `outbound.jsonl` 1 línea, `main` con todos los ficheros a cero, el Cerebro sin carpeta `bus/`. **Tres copias divergentes y ningún lector automático.** La coordinación real sigue siendo: timbres (POKE) de sesión a sesión en texto libre + el Cerebro leyendo resúmenes a las 9:30. Funciona, pero es frágil (sin acuse, sin trazabilidad fuera de la transcripción).

---

## 5 · Duplicidades

| # | Duplicidad | Dónde | Coste |
|---|---|---|---|
| D1 | **Coordinación:** Cerebro (COO/PM) · Outbound Revenue Orchestrator · Growth «Revenue Orchestrator» · dos team leads · (Chief of Staff) | `cerebro.md`, adenda 2-oct, plan oct Notion, mandato nuevo | Nadie sabe a quién reportar; Maikel acaba coordinando a mano. |
| D2 | **Arquitectura del OS:** Agent OS 8 agentes (10-sep) · Codex Growth OS (25-sep) · organigrama 2 leads (1-oct) · Orchestrator (2-oct) | 4 fuentes | Cuatro vocabularios (Brain/Demand/SDR vs Revenue Intelligence/RevOps vs Leads vs Orchestrator). |
| D3 | **Registro de agentes:** Notion Agentes DB · `cerebro.md` · `registry.json` · Llaves (tabla sesiones) · Codex | 5 fuentes, ninguna al día | Este documento es la sexta. Debe sustituir, no sumar. |
| D4 | **Posicionamiento y oferta:** Google Doc · `estrategia-central.md` · `propuesta-valor.md` V2 · espejo en `main` · `content/propuesta-de-valor-v1.md` · Outbound Brain · Documento Madre · decisión 7-oct · Revenue Journey (Content OS) | ≥9 ficheros | Ocho precios distintos dichos en ocho reuniones (semana 40). |
| D5 | **Recorrido comercial:** 5 etapas · 7 etapas · 8 fugas · 12 etapas · lifecycle Codex 16 estados · Brain 13 estados | 6 taxonomías | Imposible medir «la misma fuga» igual en Paid, Outbound y Contenido. |
| D6 | **Cualificación:** A/B/C/D · FIT/INTENT/PRIORITY · Growth Score 0-50 · 8 ejes 0-10 | 4 sistemas | «Reunión celebrada» tiene dos definiciones en el CRM (etapa vs etiqueta) sin unificar desde el 22-sep. |
| D7 | **Plan de octubre:** Notion (30-sep) · repo cerebro (29-sep) · Claude Docs original · plan CFO 12m · adenda 2-oct · temas Content OS · sprints de octubre del 1-sep | 7 | Tres cifras de presupuesto Paid (250 / 1.200 / 2.000 €/mes). Dos baselines de septiembre (40 leads/17 citas/7 reuniones vs 57 leads/0 citas desde Paid). |
| D8 | **Rituales:** viernes 5:50 Growth «revisión semanal + cuadro de mando + patrones + 3 decisiones» y viernes 13:00 Cerebro «Weekly Review + CEO Brief»; lunes 6:00 Growth Review + 7:00 Weekly Plan (Cerebro) + 7:00 Informe de los lunes (Outbound); diarios: 9:30 Cerebro, 7:22 preparación reuniones, 18:24 cierre, 8:00 SDR, 17:30 envíos, 19:00 Paid | 3 informes de lunes, 2 revisiones de viernes, 6 partes diarios | Maikel recibe más partes de los que puede leer en el bloque de ventas que el propio sistema le protege. |
| D9 | **Cuadros de mando:** Cockpit Caja · informe diario del embudo · embudo multicanal · dashboard operativo clientes · Intelligence · Growth Dashboard (Notion, 14-20 sep) · QUALIVO DAILY (Notion) · marcador del viernes · cuadro de growth del 12-sep | 9 | Mismo número en varios sitios con criterios distintos. |
| D10 | **Revisores creativos:** Master Reviewer de contenido · Agente revisor de ads · Agente revisor de lead magnets (archivado) · Red team | 4 | — |
| D11 | **Voz / llamadas:** Outbound (Raquel/Vapi) · Growth (revisión diaria) · Cold Calling agent · SDR (diseño) | 4 | — |
| D12 | **Ramas:** 3 ramas de Intelligence; EAC en `eac-metrics-dashboard` + esta copia; Growth, Contenido y Alpha en una sola rama; `cerebro.md` en 3 ramas | — | 45 ramas, 0 merges, default = cliente. |
| D13 | **Sistemas operativos en Notion:** QUALIVO OS (julio, 11 DB) · Sala de Mando (sep, 6 DB) · HQ (marzo, 7 áreas) | 3 | Tres «empieza aquí». |

---

## 6 · Dependencias críticas

1. **Maikel es el único ejecutor externo** (envía, llama, aprueba, activa Meta, firma). Correcto por diseño; el riesgo es que también sea el único coordinador entre agentes porque las capas de dirección no operan.
2. **Una sesión (Outbound) concentra la captación outbound entera**: si se degrada, no hay prospección, SDR ni triaje.
3. **Una rama (`qualivo-landing-vercel-nubk1i`) concentra web, CRM, cadencias, WhatsApp, contenido y el proyecto Alpha**, con tres sesiones escribiendo en ella. Un push malo afecta a todo.
4. **Credenciales en scratchpads efímeros**: una rutina puede fallar en silencio al reiniciarse un contenedor (ya pasó con la cuenta de servicio de Google el 7-sep).
5. **El ciclo de aprendizaje depende de que las transcripciones existan** (Tactiq) y de que el viernes se lea. Hoy el viernes corre dos veces (D8).
6. **El 74 % de los ingresos del hogar es la nómina de Equipzilla** (CFO): el ecosistema de Qualivo comparte cuenta, tokens (Vercel) y herramientas (Dinorank) con ese empleador.
7. **Kubysoft (13-oct), Alpha (16-oct) y la revisión de oferta (6-nov)** son las tres fechas que condicionan el trimestre y dependen de agentes sin rama propia (Kubysoft, Orchestrator) o compartida (Alpha).

---

## 7 · Riesgos

| Riesgo | Evidencia | Gravedad |
|---|---|---|
| Token de Meta con alcance sobre 20+ cuentas de clientes, sin rotar desde el 10-sep; pasó por chat | H12, Llaves (11-sep), Paid 7-oct | **Alta** (datos y dinero de terceros) |
| Token de GHL (RGPD, datos personales de leads) expuesto el 1-oct | Paid 7-oct | **Alta** |
| Un token, cuatro actores: cambios en Meta sin autor | Paid: 5 incidentes 20-sep a 30-sep | Alta |
| Notion con lectura/escritura total desde varias sesiones, incluida la de llaves | Llaves 11-sep; esta sesión lo confirma | Media-alta |
| Repositorio público con 45 ramas y contenido comercial sensible (propuestas con nombres de empresa, `clientes/`) | `SESSION.md`: «el repositorio es público» | Media |
| Ocho precios y garantías distintos en una semana; formulario de Meta y contrato decían 750 € el 30-sep | Insights 2-oct, Madrugada 29→30-sep | **Alta** (comercial) |
| La fuente de verdad declarada (Sala de Mando) no se mantiene; las decisiones viven en 4 sitios | Apartado 1.2 | Alta (gobierno) |
| Dos leads inexistentes + Orchestrator sin conectar: el outbound opera sin dirección formal mientras se le exige «no cambiar la estrategia por su cuenta» | `cerebro.md`, adenda §11 | Media |
| Growth en sonnet-5-5 con las rutinas más críticas (preparación de reuniones, cadencias) | lista de sesiones | Media (decisión no documentada) |
| Creative Performance en REQUIRES_ACTION; timbres nunca disparados (Cerebro→Outbound, Outbound→Cerebro, Ventas, Documento Madre, Orchestrator) | lista de rutinas | Media |
| Agentes abiertos sin pasar la «puerta de entrada» (4 entre el 21-sep y el 1-oct, según el propio cerebro) | `cerebro.md` | Media |
| Esfuerzo invertido al revés del negocio: 970 commits en 10 días, 4 para el cliente que paga y se queja | CFO 1-oct | Alta (retención) |
| Segundo ecosistema (skills Codex en Windows) con credenciales embebidas, no inventariado | `docs/qualivo-growth-os/04` | **Alta si es real** · sin verificar |
| Equipzilla y Qualivo comparten cuenta, Vercel y Dinorank | Llaves | Media |
| El Chief of Staff llega con permisos de escritura en Apollo, HeyReach y Gmail | esta sesión | Media (fácil de corregir) |

---

## 8 · Oportunidades de simplificación (sin construir nada nuevo)

Ordenadas por «qué desbloquea más con menos»:

1. **Una sola capa de dirección.** Decidir entre: (a) el Cerebro coordina y el Orchestrator desaparece; (b) el Orchestrator dirige outbound y el Cerebro se queda en finanzas y prioridades; (c) los dos leads se crean y el Orchestrator es el Lead de Outbound con otro nombre. Hoy coexisten las tres. **El Chief of Staff no debería ser una cuarta:** su valor es registrar, seguir y hacer cumplir, no dirigir.
2. **CFO independiente = separar la rutina financiera del Cerebro**, no crear otro agente. El Agent OS ya lo dijo (ADR-001: «Finanzas no es un agente, es un workflow más una rutina»). Basta mover el cierre del día 1 y el Cockpit a una sesión con solo lectura de Quipu y Sheets.
3. **Un registro de agentes, y que sea el que se mantiene.** Candidatos: la base Agentes de Notion (ya existe, lo lee Maikel) o `registry.json` (lo leen las máquinas). Elegir uno, actualizarlo con el apartado 2 de este informe y retirar los otros cuatro. No crear uno nuevo.
4. **Un documento de oferta.** Firmar el checklist del 7-oct (acta) y declarar históricos los otros ocho. Hasta entonces, la regla «congelado hasta 8-10 propuestas» del 10-sep sigue siendo la mejor regla que tiene Qualivo.
5. **Una taxonomía de recorrido y una de cualificación.** Lo aprobado el 1-oct (P0 + FIT/INTENT/PRIORITY) ya decide: mapear las 5 etapas del 7-oct y las 7 del Content OS sobre él, y dejar las 12 etapas y las 8 fugas como lenguaje interno de diagnóstico.
6. **Un plan de octubre.** Reconciliar la versión Notion y la del repo en una (baseline del CRM, presupuesto único) y enlazarlas.
7. **Un viernes y un lunes.** El Growth del viernes 5:50 alimenta al Cerebro de las 13:00; el Informe de los lunes de Outbound alimenta al Weekly Plan. Hoy son seis partes en dos días.
8. **Retirar lo dormido.** Ventas, Automatización, Arquitectura, Ofertas, Revisor de ads y las ~25 sesiones históricas: archivar sesión, conservar rama. Si el encargo de Ventas importa (reactivación de cartera, subidas de precio), reasignarlo a Growth o a Maikel; si no, cerrarlo.
9. **Rotar hoy las dos llaves rojas y una identidad por actor en Meta.** Es la medida más barata del informe.
10. **Sala de Mando: revivir o archivar**, con fecha. Si se revive, el único cambio es que el Cerebro escriba allí las 3 decisiones del viernes y el estado de agentes.
11. **Rama por defecto → `main`** y una rama propia para Alpha y para Kubysoft. Sin fusionar nada todavía.
12. **Aclarar el ecosistema Codex/ChatGPT.** Qué skills existen de verdad en el ordenador de Maikel, cuáles se usan, dónde están sus credenciales. Hasta entonces, el Codex Growth OS se trata como un documento de diseño con buenas ideas (Event Contract, change control, Experiment Memory) y no como un sistema en producción.

---

## 9 · Vacíos de información (lo que no se ha podido verificar)

- **Estado real de rotación de credenciales** (Meta, GHL, Google SA, Vercel) a 9-oct. Última evidencia: pendientes (Paid, 7-oct).
- **Precio y garantía vigentes hoy** en formulario de Meta, contrato, web, Raquel y agente de WhatsApp tras la nota del 8-oct (mínimo 1.000 €/mes).
- **Presupuesto de Paid realmente aprobado** (250, 1.200 o 2.000 €/mes) y si el préstamo de 40.000 € se ha pedido.
- **Si existen `clientes/<cliente>/ESTADO.md`** actualizados para EAC, Eleva, Antic, Kubysoft, DKR y Alpha.
- **Los skills de Codex** y sus credenciales (`C:\Users\User\.agents\skills\`): existencia, uso, exposición.
- **Qué recibe Maikel cada día y qué lee:** número de partes diarios y semanales que llegan (esta auditoría cuenta al menos seis diarios).
- **Decisiones de Maikel pendientes acumuladas en documentos distintos:** 8 (12 etapas, 24-sep), 7 bloques (Madrugada 29→30-sep), lista por urgencia (2-oct), 12 del checklist (7-oct), 8 de Content OS (6-oct). No hay una lista única de decisiones pendientes con fecha.
- **Documentos no leídos completos:** Plan de octubre (Notion), 12 etapas, Todo lo del 2-oct y Recorrido completo del lead se han leído por índice y secciones clave, no al 100 %. Documento Madre, Máquina de Contenido, SO Maikel 2026, Growth Dashboard 14-20 sep, Después de validar Qualivo, Plan Q3 DB, QUALIVO DAILY DB, Llamadas de Raquel DB y Bandeja de solicitudes: solo metadatos. Claude Docs externos (Plan de octubre original, Cierre del trimestre, ¿Pedir el préstamo?, Escalera de mensajes, Insights, ABM): no accesibles desde aquí.
- **Autoría y uso de ChatGPT:** la única huella verificable es el commit del 25-sep (`codex/qualivo-growth-os-phase-1`, autor `qualivo-sys <maikel@qualivo.io>`) y una suscripción de 23 €/mes en los costes. No hay evidencia de que ChatGPT tenga ninguna integración, rutina o capacidad de ejecución sobre Notion, el CRM o el repo. **No se le atribuye ninguna.**

---

## 10 · Preguntas para la revisión con Maikel y ChatGPT (antes de aprobar la V1)

1. ¿Quién dirige? Cerebro, Orchestrator, dos leads o una combinación. Una respuesta, con nombre de sesión.
2. ¿El CFO se separa del Cerebro? Si sí, ¿como rutina con lectura de Quipu/Sheets o como sesión propia?
3. ¿Qué registro de agentes es el oficial a partir de hoy, y quién lo actualiza cada viernes?
4. ¿Se firma el acta del 7-oct como oferta única? ¿Qué pasa con las propuestas ya enviadas a precios anteriores?
5. ¿Qué cifra de presupuesto de Paid es la vigente para octubre?
6. ¿Se revive la Sala de Mando o se archiva? ¿Se curan las páginas de HQ con una etiqueta HISTÓRICO/VIGENTE?
7. ¿Qué agentes se archivan esta semana (lista del 2.2 y 2.5) y qué encargos se reasignan?
8. ¿Existen y se usan los skills de Codex? ¿Dónde viven sus credenciales?
9. ¿Qué modelo debe correr Growth, dado lo que hace?
10. ¿Qué permisos debe tener el Chief of Staff? Propuesta: Notion y GitHub en lectura, Calendar en lectura, nada de envío.

---

*Elaborado por el Chief of Staff (sesión «Qualivo Chief of Staff — Auditoría de agentes», rama `claude/festive-darwin-x3ngvj`) el 9 de octubre de 2026. Solo lectura. Próxima revisión: tras la sesión de diseño «Maikel OS + Qualivo · Documento maestro y organigrama» de hoy.*
