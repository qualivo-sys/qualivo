# ADR-005 · El bus son ficheros append-only, un escritor por fichero

**Fecha** 2026-09-10 · **Estado** propuesta · **Resuelve** hallazgo H6

**Contexto.** Los timbres son un bus real pero sin schema, sin acuse ni reintento, y el Cerebro se
entera haciendo polling de resúmenes de sesión. Cuatro de los seis canales no se han disparado
nunca.

**Opciones.** (a) Montar un bus de verdad con n8n o una cola. (b) Ficheros JSONL en una rama
compartida, un escritor por fichero.

**Decisión.** (b). `bus/out/<agente>.jsonl` y `bus/tasks/`. Un solo escritor por fichero elimina
los conflictos de merge. Es durable, versionado, auditable y se lee con `grep`. Es el event bus y
el audit log a la vez, sin infraestructura nueva.

Los timbres se mantienen solo para lo urgente, que es lo que no puede esperar a mañana.

**Consecuencias.** Latencia de horas, no de segundos. Es aceptable: ninguna decisión de Qualivo
necesita latencia de segundos. Si algún día la necesita, se revisa esta decisión.
