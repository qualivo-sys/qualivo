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

## Directrices vigentes (actualizadas 6 sep 2026 · SO Maikel 2026)

- **OBJETIVO SEPTIEMBRE — se mide por ACTIVIDAD, no por dinero: 30 conversaciones comerciales · 8-10 propuestas · 2-4 clientes nuevos.** Rumbo: 10.000 €/mes recurrentes (hoy 4.100).
- **Motor diario de Maikel: 3 contactos nuevos · 5 seguimientos · 1 acción comercial importante.** Semanal: 10 conversaciones · 3 propuestas.
- Prioridad absoluta cuando algo choca: 1) salud y energía 2) ventas 3) clientes 4) IA y aprendizaje 5) inglés 6) administración.
- Las mañanas (09:00-11:00) son bloque comercial profundo: prospección, seguimientos, propuestas. Nada de organizar ni consumir contenido.
- Estructura semanal: lunes CEO Day + comercial · martes ventas y construcción · miércoles growth y contenido · jueves operaciones y proyecto IA · viernes revisión semanal.
- Propuestas en <48h desde la conversación; seguimientos a 3-7-14 días; responder respuestas entrantes en <2h.
- **Modo caja estricto**: la caja libre operativa es mínima (la mayor parte del saldo está reservada para impuestos). Ningún gasto nuevo sin pasar por el cerebro. Decisión de financiación congelada hasta **noviembre**.
- Ingresos recurrentes actuales: Equipzilla 2.040 € nómina (sube a ~2.850 € en octubre) + EAC 800 € + Eleva 400-500 €. Fase actual: estancamiento, no crisis — la misión es el siguiente cliente.

## Posicionamiento en 10 segundos (8 sep 2026) — MATRIZ OBLIGATORIA

Todo mensaje, secuencia, post, anuncio, propuesta y respuesta se alinea a esto. Si un tramo no cabe en la frase, sobra el tramo.

**Documento eje (9 sep 2026):** la estrategia completa (propuesta de valor, ICPs, mensaje por canal, recorrido, medición, plan 30 días) está en `sistema/estrategia-central.md`. La copia que edita Maikel es el Google Doc "Estrategia Central Qualivo v1" (id `1GIDjC9ZeNmyds016UEEeNYCgGx8g9OpLwFMDHhFDT1o`); el cerebro sincroniza Doc → repo → agentes. Si hay discrepancia, manda el Doc.

| | |
|---|---|
| **Dolor principal** | "Invierto en marketing y no sé por dónde se me escapan los clientes." No es falta de leads: es que el dueño no ve dónde se rompe (nadie contesta a tiempo, nadie persigue el presupuesto, todo pasa por él, no sabe qué funciona). |
| **Transformación** | De "hago cosas y espero" a "sé qué falla, qué arreglo primero y cuánto me cuesta cada cliente". Un sistema que capta, cualifica y persigue solo, con un número a fin de mes. |
| **Prueba** | Nadie compró "más marketing"; todos compraron ver la fuga y taparla: Eleva CPL −61% / entrevistas +102% · Equipzilla ROAS 0,1→7,6, CAC −80% · EAC 10,2× · BelloVinilo 8,3× · Focus −53% coste/contacto · Nuria 6,45×. Prueba interna: los 24 clics de 6.874 envíos salen del único mensaje que es un diagnóstico. |
| **Mecanismo único** | La Radiografía: primero la fuga, después qué arreglar, y se arregla con sistemas y agentes de IA que no dependen del dueño. Diagnóstico antes que táctica · implementación, no PowerPoint · agentes de IA como parte del arreglo. |
| **Oferta** | Entrada: Radiografía del crecimiento (gratis, 90 s, qualivo.io/donde-se-rompe-tu-crecimiento/). Núcleo: Growth System, 1.000-2.500 €/mes, garantía 30 días. Ampliación: agentes de IA (Agent For Me). Nada más en la carta. |

**Frase de 10 segundos:** "Encuentro dónde se te escapan los clientes y lo arreglo con sistemas y agentes de IA que trabajan solos. Eleva perdía el 61% de su presupuesto en leads que no cualificaban; hoy hace el doble de entrevistas con la mitad."

**Versión para partners:** "Maikel encuentra por dónde pierdes clientes y lo arregla. Si tu cliente dice 'invierto y no sé si funciona', preséntaselo."

**Lead magnet central:** la Radiografía. Todo canal (outbound, contenido, ads, partners) termina ahí con UTM propia (utm_campaign=radiografia, utm_source=<canal>, utm_content=<pieza o campaña>). Landing instrumenta eventos + UTM + tag `cuello-<valor>` en GHL; el SDR contacta <24h a cada radiografía completada usando SU cuello de botella como gancho.



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

## Infraestructura (para no volver a buscarlo)

- **Dominio qualivo.io:** registrador Dinahosting; zona DNS en sus nameservers de marca blanca (`ns*.gestiondecuenta.com`). La cuenta NO está bajo maikel@qualivo.io (probable info@maikelechevarria.com o Gmail personal). Correo en Google Workspace; web en Vercel (equipo "Qualivo Agency", proyecto de la landing). SPF actual `v=spf1 a mx ~all`: Resend sin verificar hasta que Maikel entre en Dinahosting y pegue DKIM/SPF/MX de Resend.
- **Meta Ads (Marketing API):** Maikel la tiene montada desde hace tiempo. En el repo hay conector de lectura (`src/connectors/MetaAds.gs`, token `META_ACCESS_TOKEN` + `META_AD_ACCOUNT_ID` en Script Properties, permiso `ads_read`) usado en los dashboards de EAC (act_10151404080652508) y Eleva. Para MONTAR campañas hace falta un token con `ads_management` sobre la cuenta publicitaria de Qualivo; pendiente de confirmar por Maikel dónde vive ese token. Regla: el agente construye la campaña por API en PAUSADO, Maikel revisa en el Administrador y la activa él.

## Registro de cambios

- **2026-09-09** · Estrategia central v1 publicada como Google Doc editable (fuente de verdad de Maikel) y enlazada desde `sistema/estrategia-central.md`.
- **2026-09-02** · v3. Estado actualizado por Maikel: objetivo del mes = 1 cliente recurrente 1.000-1.500 €/mes (no escalar); KPIs semanales 10 seguimientos / 1 reunión / 1 oportunidad; nuevas oportunidades Inspyria, Marilia, Antic Barcelona; Equipzilla confirmada al alza (~2.850 € desde octubre); modo caja estricto.

- **2026-09-01** · v2. Qualivo OS creado en Notion (Roadmap, Tareas, Experimentos, Decisiones) y charter del cerebro registrado.
- **2026-09-01** · v1. Creación del fichero. Canal cerebro→Landing activo (Routine). Canal cerebro→Outbound pendiente de cablear desde el lado de Outbound. Revisión diaria 9:30 activa en el cerebro.
