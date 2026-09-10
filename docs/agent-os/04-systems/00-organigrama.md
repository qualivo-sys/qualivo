# ARQUITECTURA DEL QUALIVO INTERNAL OS

Estado: diseño TO-BE · 10-sep-2026 · decisiones tomadas por el arquitecto, revocables por Maikel.

## La decisión de fondo: siete agentes, no veinte

El Master Brief describe una organización de ~25 agentes. **No la diseño.** Qualivo es hoy una
persona con 4.100 € de recurrente en modo caja estricto. Una organización de 25 agentes en ese
contexto no es ambición, es inflación: cada agente consume atención de Maikel, y la atención es
el recurso que ya está agotado.

Diseño **la organización más pequeña capaz de producir reuniones cualificadas y aprender cada
semana**. Cada agente que no existe todavía tiene escrito qué lo desbloquea.

```
                         MAIKEL
                    decide · vende · firma
                            │
                      QUALIVO BRAIN
              estrategia · prioridad · caja · foco
                            │
      ┌──────────────┬──────┴───────┬──────────────┐
      │              │              │              │
   DEMANDA        CONVERSIÓN      CIERRE        PLATAFORMA
      │              │              │              │
 ┌────┴────┐    ┌────┴────┐         │              │
 │         │    │         │         │              │
CONTENT  DEMAND OUTBOUND  SDR     SALES           OPS
      │              │              │              │
      └──────────────┴──────┬───────┴──────────────┘
                            │
                     CONTROL PLANE
        registry · bus · salud · permisos · memoria
                            │
                   DATA · MEMORY · EVENTS
```

## Mapa de ownership: una transición, un dueño

| Transición del negocio | Owner | Métrica que posee |
|---|---|---|
| Atención → Tráfico | **Content** | visitas de contenido, alcance |
| Tráfico → Lead conocido | **Demand** | radiografías completadas |
| Cuenta → Conversación | **Outbound** | conversaciones iniciadas |
| Conversación → Reunión | **SDR** | reuniones agendadas |
| Reunión → Propuesta → Cliente | **Sales** (copiloto de Maikel) | propuestas enviadas, cierres |
| Cliente → Expansión / Reactivación | **Sales** | recurrente añadido |
| Proceso manual → Workflow · salud del sistema | **Ops** | rutinas verdes, incidencias |
| Estrategia → Prioridad → Caja | **Brain** | recurrente, runway |
| Decisiones de dinero, campaña y contrato | **Maikel** | — |

**Regla:** si dos agentes pueden reclamar la misma decisión, gana el de la tabla. El otro emite
un evento y sigue con lo suyo.

## Qué cambia respecto a hoy

| Hoy | Mañana | Por qué |
|---|---|---|
| Outbound hace prospección + SDR + voz + telefonía | **Outbound** y **SDR** separados | No se puede saber si falla llegar o convertir. Además concentra el 43% de las rutinas |
| Growth hace web + SEO + contenido | **Demand** y **Content** separados | Prueba: el contenido diario se ejecuta y el Growth Review semanal lleva un mes sin correr. El ritmo diario ahoga al semanal |
| Raquel es un agente | **Canal de voz del SDR** | Un lead no puede tener dos memorias. Voz, email y WhatsApp comparten contexto o se pisan |
| Ventas fichado y sin operar | **Sales, redefinido como copiloto** | Maikel cierra. El agente prepara, redacta y persigue |
| Automatización fichado y sin operar | **Ops, con mandato ampliado** | Le falta lo que hoy no tiene dueño: salud, secretos, repo, observabilidad |
| Finanzas dentro del Brain | **Se queda en el Brain** | Un agente que corre una vez al mes es un coste, no un departamento. Es un workflow más una rutina del Brain |
| `cerebro.md` es la constitución, en 3 copias | **`registry.json` + Notion** | La constitución ya se bifurcó. Se parte en capa máquina y capa humana |

## Agentes que NO creo todavía, y qué los desbloquea

| Agente | Se crea cuando |
|---|---|
| ICP Intelligence | Haya 200+ conversaciones cerradas que analizar. Hoy vive en el OUTBOUND BRAIN de Notion |
| Account Intelligence | Outbound demuestre que el cuello está en la calidad de cuenta, no en el volumen |
| Voice of Customer | Haya 30+ llamadas transcritas. Hasta entonces es un workflow semanal que resume y entrega al Brain |
| Market Intelligence | Nunca como agente propio. Es el Radar IA, dentro de Content |
| Revenue Intelligence | El Weekly Review lleve 8 semanas ejecutándose. Es un cuadro de mando antes que un agente |
| Paid Media | Se encienda Google Ads o Meta con presupuesto propio de Qualivo |
| Delivery | Haya 6+ clientes o el primer empleado |

**Regla de creación:** un agente nuevo necesita una transición sin dueño, un KPI propio y un
presupuesto de atención. Si le falta uno de los tres, es un workflow.

## Las tres capas, separadas por `scope`

- **`qualivo`** · Internal OS. Los 7 agentes de arriba.
- **`eac` · `eleva` · `outthink` · `focus` · …** · Client OS. Misma arquitectura, un agente por
  cliente al principio, módulos separados solo cuando el cliente lo pague.
- **`personal`** · SO de Maikel. Inglés, entrenamiento, salud. No entra en el Internal OS, pero
  compite por su atención, así que su coste se contabiliza.
