# Estrategia de posicionamiento — Agent for Me (agentforme.io)

> Complementa `agent-to-me-fuente-de-verdad.md` (qué decimos) y se rige por `growth-os.md` + `content-intelligence.md` (cómo operamos). Datos de partida: DinoRank ES, agosto 2026.

## 1. El punto de partida es OPUESTO al de Qualivo

| | Qualivo | Agent for Me |
|---|---|---|
| Demanda de búsqueda | Existía ("consultoría growth marketing" 180/mes, CAC, ROAS…) | **Casi no existe**: "empleado digital" ≈ 0 búsquedas relevantes; "agencia de automatización de IA" ~110/mes (CPC 3-4 € — poca, pero comercial) |
| Prueba | 5 casos con números | **Cero casos** (y la regla sin-resultados-de-clientes tampoco aplicaría: no hay clientes) |
| Categoría | Conocida (consultoría) | **Nueva — hay que definirla** |
| Estrategia dominante | Capturar demanda existente (BOFU primero) | **Crear demanda + poseer la definición de la categoría** |

Conclusión: replicar el playbook de Qualivo tal cual sería un error. Aquí el SEO clásico es la guarnición, no el plato. Los tres motores de Agent for Me son: **LinkedIn (crear demanda) + GEO/LLMs (poseer la categoría) + producto como contenido (build in public)**.

## 2. La regla de los dos vocabularios

La fuente de verdad prohíbe "automatización/agente de IA/workflow" en NUESTRO discurso — pero el mercado busca con ESAS palabras. Resolución:

- **Las URLs y titles SEO usan el vocabulario del que busca** ("automatizar seguimiento de leads", "alternativa a contratar un SDR").
- **El contenido de la página convierte al lector a nuestro marco** en el primer scroll: "esto no es una automatización — es un empleado digital con rol, KPI y ROI".
- El puente es literal: cada página tiene una sección "¿Por qué no lo llamamos automatización?".

## 3. Arquitectura web (en fases, cada una desbloquea la siguiente)

**Fase 0 — Infraestructura de captura (antes que nada de contenido):**
- Formulario → GHL con pipeline/tags propios (`agentforme-landing`, `atm-scan`) + email de aviso. Mismo patrón api/lead que qualivo.io.
- GSC (propiedad agentforme.io), Vercel Analytics, proyecto DinoRank, `llms.txt`.
- Sin esto, todo lo demás genera tráfico que no se convierte ni se mide (regla Growth OS).

**Fase 1 — El producto como web (BOFU propio):**
- **Fichas de contratación** `/empleados/sdr-digital/` (primero SOLO el SDR — "empezamos por UNO"): rol, qué hace cada día, KPIs, ROI esperado, precio de implementación + suscripción, "contrátalo". Schema Service/Product + FAQPage.
- `/que-es-un-empleado-digital/` — **la pieza definicional de la categoría**: qué es, en qué se diferencia de una automatización/un agente/un VA, cuándo tiene sentido. Objetivo: ser LA fuente en español cuando un CEO le pregunte a ChatGPT/Claude. Aquí el GEO importa más que Google: llms.txt agresivo + schema DefinedTerm.
- `/como-funciona/` — el proceso (diagnóstico → diseño → integración → onboarding → KPIs).

**Fase 2 — La red BOFU adyacente (poca demanda, pero toda comercial):**
- **Comparativas** (formato de la biblioteca): "Contratar un SDR vs SDR digital" · "Agencia de automatización vs empleado digital" · "Make/n8n vs empleado digital" · "Asistente virtual vs empleado digital". Cada una con tabla de costes reales.
- **Blog de problemas por proceso** (espejo del "biblioteca de problemas" de Qualivo, pero por TAREA): perseguir impagos · leads sin primer contacto · CRM desactualizado · reporting manual de cada lunes · conciliación. Estructura fija: el trabajo → cuántas veces al mes ocurre → horas → coste → qué empleado digital lo hace → ROI. (Formato "Esto lo haría un empleado" del Content Intelligence.)
- Long-tail "automatizar [proceso]" — única demanda de búsqueda real que existe.

**Fase 3 — La prueba (sustituto de los casos):**
- **Build in public con números PROPIOS**: el SDR Digital de Agent for Me vendiendo Agent for Me (cliente cero = nosotros). Los números propios no violan la regla editorial — no son de clientes. "Nuestro SDR digital contactó X empresas esta semana, agendó Y reuniones, coste Z" es la demo definitiva del producto.
- Cuando haya clientes reales: fichas de caso al estilo qualivo/casos (la evidencia vive en la web).

## 4. Lead magnets (biblioteca objetivo — los activa el mercado)

1. **Company Scan** ⭐ ancla — el hero YA lo promete ("analizamos tu empresa y te decimos qué empleado necesitas"). Quiz de procesos (10-12 preguntas por área) → devuelve el empleado recomendado + horas/€ estimados recuperables → GHL. Es el gemelo del Qualivo Growth Diagnostic.
2. **Calculadora del coste del trabajo manual**: tarea × veces/mes × minutos × coste/hora = € año. Resultado compartible.
3. **Checklist "10 tareas por las que ya no contrataría a nadie"** — derivado del formato "¿Contratarías a alguien para esto?".
4. **Plantilla: la job description de un SDR digital** — pieza curiosa/compartible que materializa el concepto (rol, KPIs, "horario": 24/7).

Regla intacta: se construye el recurso cuyo problema genere señal en contenido — empezando por el Company Scan porque la web ya lo promete.

## 5. Distribución (sin duplicar la máquina)

- **LinkedIn Maikel** es el canal compartido — la semana tipo del Content Intelligence ya reserva martes (Radar IA → AtM) y jueves ("¿contratarías a alguien para esto?" → AtM). No se crea calendario aparte: mismo laboratorio, dos marcas.
- **Página LinkedIn de Agent for Me** (cuando exista): 1/semana, build in public + fichas de empleados.
- **Outbound = el producto**: la historia "un SDR digital te escribió este email" es el mejor gancho de la categoría. Se activa cuando el SDR cliente-cero esté rodado (Apollo/Mailerfind/HeyReach ya conectados).
- Sin GBP (no es negocio local) y sin Instagram por ahora — menos canales, mejor elegidos.

## 6. Medición (Growth OS aplicado)

- **North Star igual: conversaciones comerciales cualificadas.** Métricas de resultado: Company Scans completados, reuniones, implementaciones, MRR.
- Tags GHL: `origen-agentforme`, `atm-scan`, `atm-outbound` — mismo CRM, pipeline separado.
- Entra en el **Growth Review semanal** existente como sección propia (no un informe aparte).
- Experimentos iniciales (base 🧪 de Notion):
  - **E4** — ¿El contenido AtM en LinkedIn de Maikel genera conversaciones ICP? (umbral: ≥2 conversaciones en 4 semanas; si no, revisar problema/mensaje antes que canal)
  - **E5** — Company Scan: conversión visita→scan completado ≥15 % (es más lúdico que un diagnóstico — el listón es más alto)
  - **E6** — Outbound dogfooding: tasa de respuesta del SDR digital ≥ benchmarks humanos

## 7. Orden de ejecución sugerido (30 días)

1. **S1**: Fase 0 completa (form→GHL + GSC + analytics + llms.txt) + ficha SDR Digital + pieza definicional "qué es un empleado digital".
2. **S2**: Company Scan (lead magnet ancla) + primera comparativa ("contratar un SDR vs SDR digital").
3. **S3**: 2 artículos de problema-por-proceso + calculadora de coste manual + primeros posts AtM en el calendario compartido.
4. **S4**: SDR cliente-cero en marcha → primer build in public con números propios → arranque del outbound.

El criterio de siempre: cada semana produce como máximo lo que el mercado puede validar — y el Growth Review decide qué se escala y qué se deja.
