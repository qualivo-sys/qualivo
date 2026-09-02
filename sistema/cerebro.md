# Cerebro Qualivo · Estado y directrices

> Fichero de coordinación entre agentes. Lo escribe el **cerebro** (sesión "Quipu billing dashboard 2025-2026", `session_014JU3v9jX3ErSbc6ZSTe5wa`, rama `claude/quipu-billing-dashboard-g2s2ap`).
> Los demás agentes lo leen en su rutina diaria con:
> `git fetch origin claude/quipu-billing-dashboard-g2s2ap && git show origin/claude/quipu-billing-dashboard-g2s2ap:sistema/cerebro.md`
>
> Última actualización: **2026-09-01**

## Quién es quién

| Rol | Sesión | Rama |
|---|---|---|
| **Cerebro (CFO/COO)** | Quipu billing dashboard 2025-2026 | `claude/quipu-billing-dashboard-g2s2ap` |
| Outbound / SDR | Client acquisition strategy | `claude/client-acquisition-ideas-k00f5d` |
| Landing / Growth / Contenido | Landing Qualivo.io en Vercel | `claude/qualivo-landing-vercel-nubk1i` |
| Ventas / Closer | Agente de Ventas Qualivo (`session_01EsVfarsm7LwubAYY6Kis9s`) | su propia rama, carpeta `ventas/` |
| Automatización | Agente de Automatización Qualivo (`session_01DAmUZHTVFxPG37QyuAMQvr`) | su propia rama, carpeta `automatizaciones/` — entrega n8n en borrador, nunca autoenvía a clientes |
| Eleva | Eleva Academy metrics dashboard | `claude/eleva-academy-metrics-jm8msg` |
| EAC | EAC metrics dashboard | `claude/eac-metrics-dashboard-qx7fkh` |

El cerebro revisa todas las sesiones cada día laborable a las 9:30 (Europe/Madrid) y prepara el parte para Maikel.

## Protocolo

1. **Reporting**: cada agente cierra sus bloques de trabajo con cifras concretas (respuestas, conversaciones, propuestas, € de pipeline, leads, visitas). El cerebro las lee de vuestros resúmenes de sesión y de vuestros ficheros en el repo (`captacion/`, `sdr/`, `plan/`…).
2. **Urgencias**: lo que necesite al cerebro se marca con el prefijo `[PARA CEREBRO]` en la primera línea del resumen de turno (lead caliente, problema de deliverability, decisión de dinero).
3. **Decisiones**: las decisiones de dinero y de campaña las toma **Maikel**, no los agentes ni el cerebro. Los agentes las dejan planteadas; el cerebro se las lleva a Maikel en el parte diario.
4. **Este fichero**: solo lo edita el cerebro. Si un agente quiere proponer un cambio de estrategia, lo escribe en su propia carpeta y lo marca `[PARA CEREBRO]`.

## Directrices vigentes (actualizadas 2 sep 2026)

- **OBJETIVO DEL MES, único y claro: 1 cliente recurrente nuevo de 1.000-1.500 €/mes.** NO escalar, NO reinventar Qualivo. Todo lo que no acerque a ese cliente es secundario.
- Objetivos semanales de Maikel: **10 seguimientos · 1 reunión nueva · 1 oportunidad comercial seria**.
- Propuestas en <48h desde la conversación; seguimientos a 3-7-14 días; responder respuestas entrantes en <2h.
- **Modo caja estricto**: la caja libre operativa es mínima (la mayor parte del saldo está reservada para impuestos). Ningún gasto nuevo sin pasar por el cerebro. Decisión de financiación congelada hasta **noviembre**.
- Ingresos recurrentes actuales: Equipzilla 2.040 € nómina (sube a ~2.850 € en octubre) + EAC 800 € + Eleva 400-500 €. Fase actual: estancamiento, no crisis — la misión es el siguiente cliente.

## Pipeline y oportunidades vivas (2 sep 2026)

| Cuenta | Detalle | Estado |
|---|---|---|
| Inspyria | Han pedido hablar — entender qué necesitan | Reunión por agendar |
| Marilia | Propone colaboración al 50%, visita clientes presencialmente | Conversación abierta |
| Antic Barcelona | Cliente nuevo a comisión | Arrancando |
| Equilibrha | 1.500 € | abierto |
| Grup Montaner | 1.500 € | abierto |
| Emana | 1.000 € | abierto |
| Prospectos antiguos | Reactivar con seguimiento | 10 seguimientos/semana |

Cualquier cambio de fase (propuesta / negociación / cerrado / perdido) se reporta con importe — alimenta la previsión de caja. Cobros clave de septiembre: Eleva agosto (pendiente), Eleva sept (~día 20), EAC 800 € (~día 20).

## Qualivo OS (Notion)

La ejecución vive en Notion, página **"Qualivo OS · Sala de Mando"**, con cuatro bases: Roadmap Sep–Dic, Tareas, Experimentos y Decisiones. Las finanzas NO se duplican en Notion: viven en el Google Sheet del cerebro. Los agentes proponen tareas/experimentos vía `[PARA CEREBRO]`; el cerebro las registra y asigna.

Mandato del cerebro (charter de Maikel, 2026-09-01): actuar como operating brain — CEO advisor, COO, CFO, orquestador de agentes. Regla de prioridad cuando haya conflicto: 1) revenue inmediato, 2) pipeline, 3) adquisición, 4) conversión, 5) retención, 6) automatización. No se automatiza una operación que no funcione manualmente primero.

## Registro de cambios

- **2026-09-02** · v3. Estado actualizado por Maikel: objetivo del mes = 1 cliente recurrente 1.000-1.500 €/mes (no escalar); KPIs semanales 10 seguimientos / 1 reunión / 1 oportunidad; nuevas oportunidades Inspyria, Marilia, Antic Barcelona; Equipzilla confirmada al alza (~2.850 € desde octubre); modo caja estricto.

- **2026-09-01** · v2. Qualivo OS creado en Notion (Roadmap, Tareas, Experimentos, Decisiones) y charter del cerebro registrado.
- **2026-09-01** · v1. Creación del fichero. Canal cerebro→Landing activo (Routine). Canal cerebro→Outbound pendiente de cablear desde el lado de Outbound. Revisión diaria 9:30 activa en el cerebro.
