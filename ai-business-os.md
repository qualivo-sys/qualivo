# AI Business OS — Plan estratégico y operativo

> Documento de trabajo. Diseñado como socio estratégico, no como consultor.
> Objetivo: llevar el negocio a **10k–30k€/mes** en 90 días con foco extremo.

---

## Diagnóstico antes de empezar

Tu prompt es excelente en visión, pero contiene el riesgo #1 de este tipo de proyectos:
**querer vender la orquesta cuando aún no has vendido el primer instrumento.**

Este plan hace lo contrario:
- Vendemos **un dolor concreto**, no "un sistema con 6 subagentes".
- El "AI Business OS" es la narrativa de marca, **no el producto que se firma en el contrato**.
- Todo lo demás (los 6 agentes) se despliega gradualmente por módulos.

---

# PARTE 1 — Posicionamiento y oferta

## Propuesta de valor (1 frase)

> **"Instalamos un sistema operativo con IA que hace el trabajo que hoy hacen 3 personas de tu equipo comercial y de operaciones, por menos de lo que cuesta una."**

## Problema que resolvemos

Empresas de servicios de 10–50 empleados que:
- **Pierden leads** porque no hay seguimiento sistemático.
- **Pierden clientes** porque no hay account management real.
- **Pierden dinero** porque las operaciones dependen del founder.
- Ya usaron "una agencia de marketing" y no les resolvió el fondo.

El dolor real no es "quiero IA". Es: *"no puedo escalar sin contratar y no quiero contratar."*

## Cliente ideal (ICP)

- **Tamaño:** 10–50 empleados, facturación 500k–5M€.
- **Sector:** servicios B2B (consultoras, agencias, despachos, SaaS con ventas, formación premium, salud privada, real estate comercial).
- **Founder-led:** el dueño sigue vendiendo u operando.
- **Ya tiene CRM** (aunque mal usado) y algo de tracción.
- **Duele el margen** porque el equipo escala en costes más rápido que en ingresos.

Anti-ICP: startups sin ventas, e-commerce puro, empresas <5 personas, gigantes >200 personas.

## Oferta principal — Producto único, 3 tiers

**Nombre:** `Qualivo OS` (Qualified + Pivot/OS — sistema que cualifica y decide).
*Alternativas: `Coreflow OS`, `Second Brain Ops`, `Meridian OS`. Elegir el que valide un dominio disponible.*

| Tier | Setup | Mensual | Qué incluye |
|---|---|---|---|
| **Starter — "Sales OS"** | 3.500€ | 900€ | Orquestador + Sales Agent + Account Manager. Reporting básico. |
| **Growth — "Business OS"** | 6.500€ | 1.800€ | Todo Starter + Business Developer + Operaciones + reporting ejecutivo. |
| **Enterprise — "Full OS"** | 12.000€ | 3.500€ | Todo Growth + CFO/Analista + Marketing/Contenido + revisión trimestral con socio. |

**Compromiso mínimo:** 6 meses.
**Descuento:** 15% pagando anual.

### Garantía

> **"Si en 60 días no hemos generado al menos 3× el fee mensual en pipeline atribuible al sistema, seguimos gratis hasta lograrlo."**

Es agresiva pero acotada (pipeline, no revenue → controlable).

## Por qué esto vende

- El precio ancla **al coste de contratar** (un BDR junior = 30–40k€/año + carga social).
- El "3×" es un múltiplo comprensible para founders.
- "OS" comunica sistema, no proyecto.
- El fee mensual convierte el negocio en **recurrente**, no en proyectos.

---

# PARTE 2 — Arquitectura del sistema

## Principio rector

> **Un orquestador. Seis agentes. Una fuente de verdad.**

No son "6 chatbots". Son 6 roles que **leen y escriben en el mismo estado compartido** (CRM + base de conocimiento + tareas). El orquestador es quien decide **quién actúa, cuándo, y con qué prioridad**.

```
                    ┌─────────────────────┐
                    │    ORQUESTADOR      │
                    │  (decisor central)  │
                    └──────────┬──────────┘
                               │
        ┌──────────┬──────────┼──────────┬──────────┬──────────┐
        │          │          │          │          │          │
    ┌───▼──┐  ┌────▼───┐ ┌───▼───┐  ┌───▼───┐  ┌──▼──┐   ┌────▼───┐
    │ BizD │  │ Sales  │ │  Ops  │  │Account│  │ CFO │   │Marketing│
    └──────┘  └────────┘ └───────┘  └───────┘  └─────┘   └────────┘
        │          │          │          │          │          │
        └──────────┴──────────┼──────────┴──────────┴──────────┘
                              │
                    ┌─────────▼─────────┐
                    │  ESTADO COMPARTIDO │
                    │ CRM + KB + Tareas  │
                    └────────────────────┘
```

## Los 6 agentes

### 1. Business Developer Agent
- **Función:** detectar oportunidades y proponer acciones de crecimiento.
- **Inputs:** métricas del embudo, señales de mercado (LinkedIn, news, Apollo), histórico de clientes.
- **Outputs:** informe semanal con 3–5 oportunidades priorizadas y next action concreta.
- **Automatiza:** research de cuentas, análisis de embudo, priorización.
- **Valor de negocio:** convierte a *"no sé por dónde crecer"* en un roadmap accionable cada lunes.

### 2. Sales Agent
- **Función:** seguimiento, cualificación y preparación de cierre de leads.
- **Inputs:** leads nuevos, interacciones (emails, calls, formularios), estado del CRM.
- **Outputs:** emails/mensajes personalizados, actualización de stage, agenda de calls, brief pre-call para el humano.
- **Automatiza:** follow-ups, cualificación por criterios BANT/MEDDIC, resurrección de leads dormidos.
- **Valor:** **0 leads perdidos por falta de seguimiento**. Este es el hero del sistema.

### 3. Operaciones Agent (COO IA)
- **Función:** ver el estado real de la operación y detectar bloqueos.
- **Inputs:** tareas, proyectos, tickets, calendarios, entregables.
- **Outputs:** informe diario de bloqueos, sugerencias de reasignación, alertas de SLA en riesgo.
- **Automatiza:** status updates, seguimiento cruzado entre personas, escalado.
- **Valor:** el founder deja de ser el pegamento entre equipos.

### 4. Account Manager Agent
- **Función:** retención, upsell y detección de riesgo de churn.
- **Inputs:** actividad del cliente, NPS/tickets, uso del producto/servicio, calendario de renovaciones.
- **Outputs:** health score, alertas de churn, guiones de check-in, oportunidades de upsell.
- **Automatiza:** check-ins periódicos, QBRs, aviso de renovación.
- **Valor:** protege el LTV, que es donde está el margen real.

### 5. CFO / Analista Agent
- **Función:** interpretar los números y proponer decisiones.
- **Inputs:** facturación, cobros, gastos, cash flow, coste por canal.
- **Outputs:** dashboard semanal + narrativa ("por qué bajó el margen esta semana"), alertas de tesorería, ROI por canal/cliente.
- **Automatiza:** reporting, conciliaciones, análisis de rentabilidad por cliente.
- **Valor:** decisiones basadas en datos, no en la sensación del founder.

### 6. Marketing / Contenido Agent
- **Función:** alimentar el top of funnel con contenido y campañas.
- **Inputs:** ICP, casos de éxito, temas relevantes, calendario editorial.
- **Outputs:** posts LinkedIn, newsletters, ideas de campaña, briefs para diseño.
- **Automatiza:** generación, calendarización, análisis de performance.
- **Valor:** presencia constante sin depender del founder para publicar.

## El Orquestador

- **Qué es:** el cerebro que **decide qué agente actúa, sobre qué, con qué prioridad** — y presenta al humano solo lo que requiere decisión.
- **Cómo coordina:**
  - Lee eventos del estado compartido (nuevo lead → dispara Sales; cliente sin contacto en 30d → dispara Account Manager; caída de MRR → dispara CFO).
  - Aplica **reglas de negocio del cliente** (definidas en onboarding).
  - Reparte carga y evita colisiones (dos agentes escribiendo sobre el mismo lead).
- **Qué decisiones toma solo:**
  - Follow-ups automáticos, informes, actualizaciones de CRM.
- **Qué escala al humano:**
  - Aprobar propuestas comerciales, decisiones >X€, cambios estratégicos.
- **Priorización:** por impacto en revenue + urgencia + facilidad de acción.

### Interfaz humana

- **Un briefing diario** (email + Slack) con: qué se ha hecho, qué requiere tu decisión, qué se hará mañana.
- **Un dashboard** con estado de embudo, ops y finanzas.
- **Un chat** para preguntar cualquier cosa al sistema ("¿cómo va la cuenta X?").

---

# PARTE 3 — MVP (Fase 1)

## Qué vendemos primero

**"Sales OS" — el tier Starter.**
Foco brutal en: **Orquestador + Sales Agent + Account Manager.**

Nada más. Ni CFO, ni marketing, ni BizDev. Se venden luego como upgrade.

## Qué hace el MVP

1. **Ingesta de leads** desde formularios web, LinkedIn, referidos, CRM.
2. **Cualificación automática** contra criterios del cliente (ICP fit + señales de intent).
3. **Follow-up multicanal** (email + LinkedIn) hasta 7 toques, con paradas inteligentes.
4. **Agenda automática de calls** cuando el lead responde interés.
5. **Brief pre-call** al comercial humano 30 min antes.
6. **Post-venta:** el Account Manager toma el lead ganado, agenda onboarding y check-ins.
7. **Reporting semanal ejecutivo** al founder.

## Problema que soluciona

*"Los leads que trabajo tanto en conseguir se me caen porque no puedo darles seguimiento como merecen."*

## Resultado tangible en 30 días

- **+40% de tasa de respuesta** en follow-ups (baseline: humano).
- **+25% de calls booked** sobre el mismo volumen de leads.
- **0 leads sin al menos 5 toques** en 21 días.
- Un dashboard donde el founder ve el estado de cada lead en 10 segundos.

## Qué NO hace el MVP (importante para no dispersarte)

- No genera contenido de marketing.
- No hace análisis financiero.
- No gestiona operaciones internas.
- No crea propuestas comerciales desde cero (sí prepara borradores).

---

# PARTE 4 — Plan de ejecución

## Semana 1 — Construir el MVP mínimo

**Construir:**
- Orquestador básico (n8n / Make / código propio) con event bus.
- Integración con **1 CRM** (elegir uno: HubSpot o Pipedrive — el más común en tu ICP).
- Sales Agent: 4 secuencias de follow-up + regla de cualificación.
- Account Manager: check-in a día 7, 30 y 90 post-cierre.
- Dashboard mínimo (Notion o Retool).
- Briefing diario por email.

**NO construir:**
- Multi-CRM. Uno solo.
- UI custom. Usa Notion/Retool.
- Los otros 4 agentes.
- Integraciones "por si acaso" (Salesforce, Zoho, HubSpot y Pipedrive a la vez).

**A quién vender:**
- **Warm list primero.** Lista de 30 fundadores de tu red que encajen en el ICP.
- Objetivo: **10 conversaciones, 3 pilotos, 1 cliente pagando setup.**

**Mensaje de venta (frío o warm):**
> "Estoy montando un sistema que hace el seguimiento comercial de tus leads como si tuvieras un BDR senior 24/7, pero por 1/3 del coste. Estoy escogiendo 3 empresas para instalarlo con precio de fundador. ¿Te enseño cómo funciona en 20 min?"

## Semana 2 — Implementar en el primer cliente

- **Onboarding en 3 sesiones** (2h cada una): descubrimiento, configuración, activación.
- **Instalar en su CRM real** con sus leads reales.
- **Definir 5 KPIs** con el cliente antes de arrancar (para que la garantía sea medible).
- Activar con **1 comercial humano** en su equipo como "el humano en el bucle".

**Qué medir (baseline vs semana 4):**
- Tasa de respuesta a follow-ups.
- Calls booked / semana.
- Tiempo de respuesta a lead nuevo.
- Leads sin contacto >7 días.
- NPS del comercial humano ("¿te ahorra tiempo? 1–10").

## Semana 3–4 — Convertir en caso de éxito

- **Reunión de resultados** con el cliente al día 21 y día 30.
- **Grabar un video testimonial** de 90 segundos (esto vale oro).
- **Escribir un caso de estudio** de 1 página: contexto, problema, solución, resultados.
- **Iterar la oferta:**
  - Si el 3× de la garantía se cumple fácil → sube el fee 20% para el siguiente cliente.
  - Si cuesta llegar → añade condiciones (número mínimo de leads/mes por su parte).
- **Empezar a escalar:** el caso de éxito abre la puerta a los siguientes 5 clientes.

---

# PARTE 5 — Plan de ventas

## Cómo explicarlo sin hablar de IA técnica

**Regla:** habla del **resultado** y del **rol humano** que reemplaza, no de "agentes multi-modelo con orquestación".

- ❌ "Tenemos un sistema multi-agente con LLMs orquestados por un router semántico."
- ✅ "Es como contratar un BDR y un Account Manager senior, pero por 1/3 del coste y sin bajas ni rotación."

## Mensaje corto de venta (elevator)

> "Instalamos en tu empresa un sistema que hace el trabajo que hoy hacen tus comerciales cuando están cansados: seguir a cada lead, no dejar que se caiga ninguno, y avisarte solo cuando hace falta que hables tú. Se paga solo con los tres primeros deals que rescata."

## Guión de llamada de 30 min

**0–3 min · Contexto**
"Antes de empezar, cuéntame en 2 frases cómo trabajáis los leads hoy y qué es lo que más te frustra."

**3–10 min · Diagnóstico** (deja hablar)
Preguntas clave:
- ¿Cuántos leads entran al mes?
- ¿Qué % acaba en call?
- ¿Quién hace el follow-up hoy?
- ¿Qué pasa con un lead que no responde a los 3 días?
- ¿Cuánto vale un cliente medio para ti?

**10–20 min · Presentación** (usa su lenguaje)
- Enseña 1 caso de éxito (el que sea, aunque sea el propio).
- Explica qué es Sales OS con **su vocabulario**.
- Enseña el dashboard en pantalla.

**20–27 min · Cierre**
- "Por lo que me cuentas, esto encaja. La inversión son 3.500€ de setup y 900€/mes con compromiso de 6 meses. Y tienes esta garantía: [léela]."
- "¿Cuándo podríamos hacer la sesión de onboarding, esta semana o la próxima?"

**27–30 min · Objeciones**
Ver siguiente sección.

## Objeciones y respuestas

| Objeción | Respuesta |
|---|---|
| **"Es caro."** | "Comparado con contratar un BDR (35k€/año + carga), esto son 14k€/año y trabaja 24/7. Y la garantía cubre el riesgo." |
| **"No confío en la IA para hablar con mis clientes."** | "No habla con tus clientes sin tu aprobación en las primeras 4 semanas. Todo pasa por ti hasta que te fías de la calidad." |
| **"Ya lo hacemos con Zapier / HubSpot workflows."** | "Perfecto, eso significa que ya tienes la base. Lo que te falta es el criterio: qué lead merece qué toque. Ahí es donde entra el sistema." |
| **"Necesito pensarlo."** | "Claro. ¿Qué necesitas ver para decidir? ¿Una demo con tus propios datos, hablar con un cliente actual, o revisar contrato?" |
| **"6 meses es mucho compromiso."** | "El setup son 6 semanas hasta que se ve el impacto. Con menos de 6 meses, la garantía no tiene sentido para ninguno de los dos." |
| **"Y si no funciona?"** | "Por eso está la garantía del 3×. Si en 60 días no te generamos 3× el fee en pipeline, seguimos trabajando gratis. El riesgo lo asumo yo." |

---

# PARTE 6 — Roadmap 30-60-90 días

## Día 0–30

- ✅ MVP funcionando (Sales OS con orquestador + 2 agentes).
- ✅ 1 cliente pagando setup + primer mes.
- ✅ Warm list contactada (30 personas).
- ✅ 10 conversaciones, 3 propuestas enviadas.
- **Ingresos objetivo:** 3.500€ setup + 900€ (mes 1) = **4.400€**.

## Día 30–60

- ✅ 2–5 clientes activos.
- ✅ Caso de éxito documentado (video + PDF).
- ✅ Precios validados o ajustados.
- ✅ Primer upsell propuesto a un cliente (tier Growth).
- ✅ Landing page + LinkedIn del founder posicionando la narrativa.
- **Ingresos objetivo:** 3 clientes × (setup + 2 meses) = **~17.500€ acumulado** / MRR ~2.700€.

## Día 60–90

- ✅ Sales OS estabilizado, Business OS listo para vender.
- ✅ 5–8 clientes activos.
- ✅ Primer contrato tier Growth firmado.
- ✅ Sistema de captación propio en marcha (LinkedIn outbound + contenido).
- ✅ Primera contratación considerada (implementador junior).
- **Ingresos objetivo:** MRR **8–12k€** + setups → mes 3 en **12–18k€**. Camino a 30k€/mes en mes 6.

---

# PARTE 7 — Sistema operativo personal

## Bloques semanales

| Día | Mañana (9–13h) | Tarde (14–18h) | Noche |
|---|---|---|---|
| **Lun** | **Construcción** (product) | **Ventas** (calls, propuestas) | Off |
| **Mar** | **Ejecución cliente** (delivery) | **Ventas** (outbound + calls) | Off |
| **Mié** | **Construcción** | **Contenido** (1 post + 1 video corto) | Off |
| **Jue** | **Ejecución cliente** | **Ventas** (calls + follow-ups) | Off |
| **Vie** | **Ejecución cliente** | **Semana + KPIs + planificación** | Off |
| **Sáb** | Off / vida | Off / vida | Off |
| **Dom** | Off / vida | 45 min: preparar semana | Off |

## Prioridades no negociables

1. **Ventas > todo.** Sin clientes no hay producto que construir.
2. **Delivery > construcción.** El cliente activo pesa más que el feature futuro.
3. **1 hora al día de contenido / posicionamiento.** No opcional.
4. **Domingo tarde: 45 min de planificación.** Define las 3 cosas de la semana.

## Reglas de equilibrio

- **Cero trabajo después de las 19h** salvo emergencia real de cliente.
- **Sábado sagrado.** Fuera del móvil.
- **Deporte 4×/semana**, en el hueco 13–14h o 18–19h.
- **Un día de la semana sin calls internas** (Miércoles → construcción y contenido).

---

# PARTE 8 — Errores y riesgos

## Los 5 errores que matan este modelo

### 1. Vender los 6 agentes a la vez.
**Síntoma:** el prospect no entiende qué compra, tú tardas 3 meses en entregar, el cliente cancela.
**Antídoto:** MVP = Sales OS. Los otros 5 son upsell.

### 2. Construir antes de vender.
**Síntoma:** 3 meses puliendo el orquestador, 0 ingresos.
**Antídoto:** 3 clientes pagando antes de escribir una línea de código nueva más allá del MVP.

### 3. Sobre-personalización.
**Síntoma:** cada cliente pide su versión, se vuelve una agencia disfrazada.
**Antídoto:** 80% común, 20% configurable. Todo lo demás es "upgrade a Enterprise".

### 4. Vender IA en vez de resultado.
**Síntoma:** conversaciones eternas sobre modelos, prompts, técnica.
**Antídoto:** habla de €, de calls booked, de horas ahorradas. La IA no aparece en la propuesta comercial.

### 5. Perder al founder-humano-crítico.
**Síntoma:** el cliente firma esperando magia, el sistema necesita input humano y no lo tiene, falla.
**Antídoto:** contrato explicita "responsable interno" (owner del cliente) desde día 1. Sin owner → no arrancamos.

## Riesgos estructurales del modelo multi-agente

| Riesgo | Mitigación |
|---|---|
| Los agentes se pisan escribiendo en el CRM. | Orquestador con locks y prioridades explícitas. |
| Alucinaciones en emails a clientes. | Aprobación humana obligatoria las primeras 4 semanas. |
| Deuda técnica del MVP. | Refactor programado al llegar a 5 clientes, no antes. |
| Dependencia de un modelo/vendor. | Abstracción del LLM por debajo (interfaz común, swap si sube el precio). |
| Que un cliente exija SLA imposibles. | Contrato con SLA claros y realistas (respuesta <2h, no <5min). |

## Señales de alerta que debes atender ya

- Si a las 4 semanas no has cerrado 1 cliente → **la oferta no es la buena. Cambia el mensaje, no el producto.**
- Si a las 8 semanas tienes 3 clientes pero cada uno pide cosas distintas → **estás construyendo 3 productos. Fuerza estandarización o sube precios brutalmente.**
- Si a las 12 semanas facturas <5k€/mes → **el problema es distribución (no llegas a suficientes prospects). Sube volumen outbound o busca partner.**

---

# Anexo — Decisiones que necesito de ti antes de mover ficha

1. **Nombre definitivo** (Qualivo OS u otro).
2. **CRM inicial** (HubSpot o Pipedrive).
3. **Stack de orquestación** (n8n vs código propio vs Make).
4. **Lista de 30 warm contacts** para semana 1.
5. **Precio de fundador** para los 3 primeros (¿mantener 3.500€ o bajar a 1.500€ setup a cambio de caso público?).

---

**Regla final:** cuando dudes entre construir algo nuevo o hacer una llamada de ventas → **haz la llamada.**
