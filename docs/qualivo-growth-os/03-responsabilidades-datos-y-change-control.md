# 3. Responsabilidades, fuentes de datos y Change Control

## Matriz de responsabilidad

| Área | Observa | Decide / prioriza | Diseña | Implementa | Aprueba | Mide |
|---|---|---|---|---|---|---|
| Fuga de revenue | Revenue Intelligence | Revenue Intelligence + dueño | Growth Architect / Conversion | motor afectado | dueño comercial | Revenue Intelligence |
| Journey / oferta / handoff | Intelligence | dueño comercial | Growth System Architect | RevOps + equipos | dueño comercial | Intelligence |
| Mensaje / fricción / objeción | Intelligence, Sales, Content | dueño comercial | Conversion Psychologist | Paid/Content/Outbound/Sales | dueño comercial | Intelligence |
| CRM, eventos, tracking | RevOps | RevOps propone, no estrategia | RevOps Engineer | RevOps/Automations | responsable de sistema | Intelligence |
| Paid | Paid + Intelligence | dueño de presupuesto | Paid + Conversion | Paid | aprobador de presupuesto | Intelligence |
| Outbound | Outbound + Intelligence | líder comercial | Outbound + Conversion | Business Developer / SDR | aprobador comercial | Intelligence |
| Content | Content + Intelligence | Head of Content | Head of Content + Conversion | Content | aprobador editorial | Intelligence |
| Sales/propuesta | Sales | responsable comercial | Sales + Architect | Sales | aprobador comercial | Intelligence |
| Onboarding/CS | CS + Intelligence | responsable delivery | CS + Architect | CS/Delivery | responsable delivery | Intelligence |
| Seguridad | RevOps / Security owner | Security owner | RevOps | sistema designado | owner de credenciales | auditoría |

## Fuentes de datos y source of truth

| Dato | Source of truth actual/propuesta | Consumidores | Riesgo actual |
|---|---|---|---|
| Identidad de contacto, owner y estado | GHL CRM | Sales, Voice, WhatsApp, RevOps | pipelines y calendarios no totalmente unificados |
| Reserva, asistencia y no-show | Calendario GHL + evento de asistencia | Sales, Intelligence | asistencia/no-show depende de registro manual |
| Mensajes y conversaciones | WhatsApp, email, voz y GHL | Sales, QA, Intelligence | actividades ≠ conversación real |
| Coste/campaña | plataforma Paid + UTMs | Paid, Intelligence | CAPI/reporting parcial y atribución downstream incompleta |
| Outbound account/contact | Apollo/enrichment + GHL | Outbound, Sales | duplicidad de stacks/pipelines |
| Contenido y señales | Head of Content, Notion/social analytics | Content, Intelligence | no hay contrato unificado hacia revenue |
| Propuestas/contratos/pagos | herramienta de propuesta/contrato, Quipu y CRM | Sales, Finance, Intelligence | garantías y condiciones no están unificadas |
| Onboarding, valor y health | workspace CS/Notion/CRM definido en Fase 2 | CS, Intelligence | source of truth aún fragmentado |
| Historia de eventos | **Event store canónico propuesto** | Intelligence, RevOps | todavía no implementado |
| Decisiones/experimentos | **Experiment Memory propuesta** | todo el OS | todavía no implementado |

No se migra ni se cambia source of truth en Fase 1. RevOps deberá generar un plan de reconciliación antes de escribir datos.

## Change Control

| Acción | READ | ANALYZE | PROPOSE | WRITE / EXECUTE |
|---|---:|---:|---:|---:|
| Diagnóstico, auditoría, métrica, investigación | automático | automático | automático | n/a |
| Documento interno / contrato de diseño | automático | automático | automático | aprobación de owner si cambia gobernanza |
| Campos / eventos / dashboards no productivos | automático | automático | automático | aprobación RevOps + owner |
| Workflow / integración / automatización activa | automático | automático | automático | aprobación explícita del owner |
| Copy, mensajes, secuencias comerciales | automático | automático | automático | aprobación comercial/editorial |
| Presupuesto, audiencia, campaña, creatividades live | automático | automático | automático | aprobación explícita de presupuesto |
| Precios, garantías, propuestas, contratos | automático | automático | automático | aprobación explícita comercial/legal |
| Acción masiva o sobre contactos | automático | automático | automático | aprobación explícita + audiencia, consentimiento y rollback |
| Producción / deploy | automático | automático | automático | aprobación explícita de release owner |

### Paquete obligatorio para ejecutar

Toda petición de WRITE/EXECUTE debe incluir: objetivo, evidencia, alcance exacto, owner, riesgo, entidades afectadas, precondiciones, rollback, métrica de éxito, métrica de seguridad y aprobación registrada. Sin esos elementos se conserva como propuesta.

## Guardrails operativos

- Pausar cadencias ante respuesta, baja, queja, reserva, reunión o cambio de prioridad.
- Nunca fingir identidad humana de un agente; revelar naturaleza del sistema cuando proceda y cumplir consentimiento/base legítima.
- Frecuencia, canal y hora se condicionan a preferencia, contexto y normativa, no a una cadencia ciega.
- No crear promesas, resultados, testimonios, precios o garantías sin fuente aprobada.
- Las automatizaciones deben loguear ejecución, resultado y error; una etiqueta no demuestra que una acción ocurrió.
- Handoff de ventas a CS incluye promesa vendida, alcance, exclusiones, pains, stakeholders, riesgos, próximo hito y criterio de primer valor.
