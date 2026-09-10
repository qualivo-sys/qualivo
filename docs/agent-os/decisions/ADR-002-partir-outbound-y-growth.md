# ADR-002 · Partir Outbound y partir Growth

**Fecha** 2026-09-10 · **Estado** propuesta

**Contexto.** Outbound concentra 10 de 23 rutinas y cuatro funciones. Growth concentra tres
funciones con tres cadencias distintas.

**Evidencia.** El Growth Review semanal no se ejecuta desde el 11 de agosto mientras la content
machine diaria, en el mismo agente, corre todos los días. El ritmo diario ahoga al semanal.

**Decisión.**
- Outbound → **Outbound** (Cuenta → Conversación) + **SDR** (Conversación → Reunión). Raquel y
  WhatsApp pasan a ser canales del SDR, no agentes. La telefonía se va a Ops.
- Growth → **Demand** (semanal: web, CRO, SEO, Radiografía) + **Content** (diario: blog, redes,
  Radar).

**Consecuencias.** Se puede medir dónde se rompe el funnel. Dos sesiones nuevas que crear y
rutinas que reasignar. Riesgo: la partición mal hecha rompe captación, así que se hace con las
rutinas apagadas y se reactivan una a una.
