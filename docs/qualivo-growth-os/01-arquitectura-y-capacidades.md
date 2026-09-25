# 1. Arquitectura definitiva y mapa de capacidades

## Principio operativo

La unidad de optimización no es un anuncio, un envío, una llamada o una tarea de CRM. Es el avance verificable de una entidad en el lifecycle y el revenue o valor que se produce después.

```
Fuentes de demanda ─┐
Paid ───────────────┤
Content ────────────┤→ Conversación → Cualificación → Reunión realizada
Outbound ───────────┤                                     ↓
Partners/referidos ─┘                              Propuesta → Decisión → Revenue
                                                                  ↓
                                              Onboarding → Primer valor → Retención → Expansión/referido
```

Revenue Intelligence observa todos los tramos, prioriza una fuga con evidencia y abre una recomendación. El motor o dueño correspondiente ejecuta solo tras el control de cambio aplicable.

## Capacidades y relación entre ellas

| Capa / capacidad | Rol definitivo | Recibe | Devuelve | Estado |
|---|---|---|---|---|
| Revenue Intelligence | Detecta, cuantifica y prioriza fugas; propone experimento | Eventos, CRM, costes, resultados, memoria | Priorización, evidencia, hipótesis, baseline | **EXTEND** a partir de Analytics |
| Growth System Architect | Rediseña oferta, journey, etapas, handoffs y experimentos estructurales | Problemas priorizados | Blueprint, decisiones, SLA, diseño de prueba | **KEEP / REDEFINE** |
| Conversion Psychologist | Diagnostica mensaje, percepción, objeción o fricción en cualquier canal | Hipótesis de Intelligence/Architecture | Recomendación y variantes de experiencia/copy | **KEEP / ACTIVATE** como función transversal |
| RevOps Engineer | Hace operable lo aprobado: CRM, eventos, scoring, QA, integraciones, alertas | Diseño aprobado | Especificación, instrumentación propuesta, QA | **EXTEND** sobre Automations + Analytics; no decide estrategia |
| Paid | Genera y optimiza demanda pagada hacia valor downstream | Prioridades, segmentos, feedback de calidad | Eventos de coste/campaña y resultados por cohort | **KEEP**: capacidad existente, no nuevo agente |
| Outbound Revenue Engine | Opera la prospección existente bajo lifecycle/eventos comunes | ICP, lista validada, límites, insights | Conversaciones y resultado por cuenta/contacto | **MERGE responsabilidades**, no reescribir motor |
| Head of Content | Convierte evidencia y experiencia en autoridad/demanda; mantiene voz y revisión | Insights, experimentos cerrados, señales del mercado | Piezas, señales de intención, desempeño, aprendizajes | **KEEP**: motor existente |
| Sales / SDR / closer | Conversación humana, discovery, propuesta y decisión | Prioridad, contexto y siguiente paso | Resultado de conversación/reunión/propuesta/pérdida | **KEEP / EXTEND** |
| Customer Success / Delivery | Onboarding, primer valor, retención, expansión y referido | Handoff comercial completo | Hitos de valor, riesgo, renovación/expansión | **EXTEND** |
| Change Authority | Aprueba acciones con impacto externo | Propuesta y evidencia | Aprobación, rechazo o condiciones | **KEEP**: Maikel / dueño designado |

## Flujo de decisión

1. **Revenue Intelligence** detecta un cambio significativo o una fuga con impacto económico.
2. Clasifica la causa probable: medición, arquitectura, mensaje/experiencia, operación, capacidad o dato insuficiente.
3. Ruta:
   - Arquitectura → Growth System Architect.
   - Mensaje, fricción, percepción u objeción → Conversion Psychologist.
   - Datos, CRM, automatizaciones, tracking o QA → RevOps Engineer.
   - Ejecución de canal → Paid, Content, Outbound, Sales o CS.
4. Se registra la hipótesis en Experiment Memory.
5. Nadie publica, envía, cambia presupuesto, workflow o producción sin el aprobador exigido.

## Integración de Content existente

No se crea otro Content Agent. El Head of Content existente de `claude/qualivo-landing-vercel-nubk1i` mantiene su rutina, Master Reviewer, guía de voz, diario y conexiones operativas.

**Entrada desde Intelligence:** fuga priorizada, lenguaje de objeciones, señal por vertical, experimento cerrado, datos que pueden citarse y límites de confidencialidad.

**Salida hacia Intelligence:** pieza/publicación, tema, audiencia/vertical, CTA, conversaciones cualificadas, solicitudes, conversiones atribuibles cuando existan, feedback y aprendizaje editorial. No se juzga solo por impresiones.

## Integración de Outbound existente

Se preservan `estrategia/`, `captacion/scripts/`, `captacion/datos/` y `sdr/` de `claude/client-acquisition-ideas-k00f5d`. La consolidación es de responsabilidad y contratos:

- **ABM Outbound** conserva diseño de secuencias y personalización.
- **Business Developer** conserva investigación, enriquecimiento, carga y operación.
- Ambos reportan en una única capacidad: **Outbound Revenue Engine**.
- Una cuenta tiene una única identidad, owner, consentimiento/base legítima, estado lifecycle, próximo paso y resultado.
- Las respuestas, reuniones realizadas, propuestas y revenue cierran el bucle; los envíos no son métrica de éxito.

## Integración de Paid existente

Se preserva la capacidad `paid/` de `claude/qualivo-paid` — estado, ángulos, copy, creatividades, revisiones y experimentos. La optimización evoluciona de:

`CPL → conversación → cualificado → reunión realizada → propuesta → ganado → revenue`

CPL continúa como métrica de diagnóstico, nunca como KPI final aislado. Cada cambio de presupuesto, audiencia, creatividad, formulario o campaña requiere aprobación explícita.

## Inventario de agentes: KEEP / MERGE / EXTEND / DEPRECATE

| Decisión | Agentes / activos |
|---|---|
| **KEEP** | Revenue Journey Architect instalado; Head of Content; Paid; Discovery Call; Pre-call Research; Proposal; Post-call Follow-up; Onboarding Cliente; Sales Pipeline; Analytics; Automations |
| **MERGE** | Agente ABM Outbound + Business Developer → Outbound Revenue Engine; borradores Growth System Architect + Revenue Journey Architect → una sola función de arquitectura |
| **EXTEND** | Analytics → Revenue Intelligence; Automations → ejecución/observabilidad RevOps; Sales Pipeline → lifecycle y win/loss común; Onboarding/QBR/Early Warning → CS lifecycle |
| **DEPRECATE como fuente de verdad** | Pipelines paralelos, calendarios alternos, lead score único que mezcla dimensiones y secuencias sin evento de salida |
| **NO construir** | Otro Content Agent, otro Paid Agent, otro outbound stack, otro CRM, otro agente generalista que compita con el arquitecto instalado |

## Mapa de ramas y estado conocido

| Rama | Evidencia principal | Lectura |
|---|---|---|
| `auditoria/embudo-semana-38` | LANDING, APIs de activación y journey auditado | Base documental más cercana a operación/live; Vercel se despliega por CLI, no por merge automático |
| `claude/qualivo-landing-vercel-nubk1i` | landing, blog y Content Head | Motor de contenido y web; revisar antes de declararlo producción |
| `claude/client-acquisition-ideas-k00f5d` | estrategia, captación y SDR | Sistema outbound existente |
| `claude/qualivo-paid` | carpeta Paid y experimentos | Capacidad paid existente |
| `claude/qualivo-agente-ventas-sq3vnt` | trabajo de ventas | Reutilizar tras conciliación con lifecycle |
| `claude/qualivo-automatizaciones-b7k2m9` | automatizaciones | Reutilizar tras QA y contrato de eventos |
| `claude/eac-metrics-dashboard-qx7fkh` | rama por defecto | No es la base canónica de Qualivo OS |

**Conclusión:** ningún merge masivo ni PR histórico debe considerarse despliegue. Antes de Fase 2 hay que nombrar una rama/repo canónico de Qualivo y un responsable de release.
