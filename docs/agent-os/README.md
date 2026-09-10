# Qualivo Internal Operating System

Estado: **arquitectura TO-BE diseñada · 10-sep-2026 · pendiente de firma de Maikel**

## Léelo en este orden

1. **`04-systems/00-organigrama.md`** — la arquitectura: ocho agentes, quién posee qué.
2. **`02-diagnosis/00-hallazgos-fase0.md`** — los diez hallazgos de la inspección, con evidencia.
3. **`07-operations/10-interfaz-humana.md`** — cómo hablas con ellos y cómo te reportan.
4. **`07-operations/00-ritmo.md`** — cómo es un día, una semana y un mes.
5. **`08-roadmap/10-plan-migracion.md`** — cómo se llega, paso a paso y por riesgo.

## Los ocho agentes

| Agente | Posee | Ficha |
|---|---|---|
| Cerebro | Estrategia → Prioridad → Caja | `03-brain/00-brain.md` |
| Content | Atención → Tráfico | `04-systems/40-content.md` |
| Demand | Tráfico → Lead conocido | `04-systems/30-demand.md` |
| Outbound | Cuenta → Conversación | `04-systems/10-outbound.md` |
| SDR | Conversación → Reunión | `04-systems/20-sdr.md` |
| Sales | Reunión → Propuesta → Cliente | `04-systems/50-sales.md` |
| Ops | Salud, secretos, workflows, repo | `04-systems/60-ops.md` |
| Paid | Presupuesto → Tráfico cualificado | `04-systems/70-paid.md` |

## Decisiones que ha tomado el arquitecto en tu nombre

Todas revocables. Cada una tiene su ADR en `decisions/`.

| # | Decisión | ADR |
|---|---|---|
| 1 | Siete agentes, no veinticinco | ADR-001 |
| 2 | Partir Outbound en Outbound y SDR; partir Growth en Demand y Content | ADR-002 |
| 3 | Ventas pasa a copiloto; Automatización pasa a plataforma. Ninguno se retira | ADR-003 |
| 4 | Notion capa humana, repo capa máquina. `cerebro.md` deja de ser la constitución | ADR-004 |
| 5 | El bus son ficheros, no una plataforma | ADR-005 |
| 6 | Una rama de integración, sin fusionar las 29 | ADR-006 |
| 7 | Finanzas no es un agente: es un workflow más una rutina del Brain | ADR-001 |
| 8 | Raquel deja de ser agente y pasa a ser el canal de voz del SDR | ADR-002 |
| 9 | Techo de 10 decisiones de Maikel por semana | `07-operations/00-ritmo.md` |
| 10 | Paid es agente propio y multi-cliente, no una función de Demand | ADR-007 |
| 11 | El agente de ofertas es un taller que se abre y se cierra, no un departamento | ADR-008 |

## Lo primero que hay que hacer

**Resolver H10: hay dos ofertas escritas a la vez.** La matriz obligatoria del 8-sep dice
Radiografía y Growth System de 1.000-2.500 €/mes. La sesión de ofertas del 10-sep dice Leak Map y
24.000 €. Seis agentes están leyendo la primera. Cuesta más un mes vendiendo dos cosas distintas
que cualquier fallo técnico de la lista.

**Y después, reparar el bucle semanal.** Cuatro rutinas semanales y una mensual no registran ninguna
ejecución, y son justo las que hacen que el sistema aprenda. Diseñar encima de eso no sirve.
Paso 0 del plan de migración.

## Estructura

| Carpeta | Contenido | Estado |
|---|---|---|
| `00-foundation/` | Mandato y anexo de método | ✅ |
| `01-inventory/` | AS-IS: fuentes, sesiones, rutinas, clasificación, incógnitas | ✅ |
| `02-diagnosis/` | Hallazgos y cuellos de botella | ✅ |
| `03-brain/` | Especificación del Cerebro | ✅ |
| `04-systems/` | Organigrama y las siete fichas de agente | ✅ |
| `05-protocols/` | Event, Task, Result, Agent Card, Report | 🟡 borrador |
| `06-control-plane/` | Bus, registry, salud, permisos, memoria, secretos | ✅ |
| `07-operations/` | Interfaz humana, ritmo diario, semanal y mensual | ✅ |
| `08-roadmap/` | Modelo de ejecución y plan de migración | ✅ |
| `registry.json` | Fuente de verdad sobre agentes | ✅ v2 |
| `decisions/` | Ocho ADR | ✅ |
