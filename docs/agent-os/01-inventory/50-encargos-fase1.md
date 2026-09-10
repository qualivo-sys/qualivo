# FASE 1 · Encargos a los agentes (listos para disparar)

Cada agente rellena su propia ficha AS-IS. Es más fiable que deducirla desde fuera y es la primera
prueba real del protocolo: encargo estructurado → parte estructurado.

**Cómo se dispara:** por el timbre de cada agente, o pegando el texto en su sesión.
**Qué devuelve:** el bloque de abajo, escrito por el agente en su rama, en `ficha-agente.md`.

---

## Plantilla de respuesta (idéntica para los tres)

```
STATUS
OBJECTIVE
OWNS                 la transición de negocio que posees, UNA sola frase
DOES_NOT_OWN         lo que hoy haces pero crees que no te corresponde
INPUTS               de dónde sacas la información, con ruta o sistema concreto
OUTPUTS              qué produces y quién lo consume
TOOLS                herramientas y APIs que usas de verdad
DATA                 ficheros y fuentes que escribes, con ruta
MEMORY               dónde guardas lo que necesitas recordar entre turnos
SECRETS              dónde vive cada clave que usas, y qué pasa si muere el contenedor
TRIGGERS             qué te despierta hoy
CADENCE              cada cuánto trabajas de verdad
KPIs                 tus métricas, con VALUE + SOURCE + AS_OF, o SIN DATO
DEPENDENCIES         de qué agente o persona dependes para no bloquearte
FAILURE_MODES        cómo fallas, y cómo se enteraría alguien
ESCALATION_RULES     qué escalas al cerebro y qué a Maikel
APPROVAL_REQUIREMENTS  qué haces solo, qué pides aprobar, qué no tocas nunca
ATTENTION_COST_WEEK  nº de decisiones de Maikel que generas por semana
WORKFLOW_CANDIDATES  qué partes de tu trabajo son deterministas y deberían ser un script
ANTI_GOALS           qué deberías negarte a hacer aunque te lo pidan
ISSUES
DECISIONS_REQUIRED
```

**Reglas:** cifra sin fuente se escribe `SIN DATO`. Si dos agentes podéis reclamar lo mismo, se
escribe `CONFLICT`, no se resuelve. No cambies nada de tu operación: esto es un inventario.

---

## Encargo 1 · Outbound / SDR / Voz

> [ARQUITECTURA — Fase 1 del Internal OS, encargo de Maikel del 10-sep]
> Rellena tu ficha AS-IS con la plantilla de `docs/agent-os/01-inventory/50-encargos-fase1.md`
> (rama `claude/dreamy-curie-9on2ct`) y escríbela en tu rama como `ficha-agente.md`.
>
> Contexto: la inspección detecta que concentras 10 de las 23 rutinas de Qualivo y que haces
> cuatro funciones: prospección, SDR, voz (Raquel) e infraestructura de telefonía.
>
> Responde además a esto, que es lo que decide el diseño:
> 1. Si hubiera que partirte en dos agentes, ¿por dónde cortarías y por qué?
> 2. ¿Dónde se rompe hoy tu funnel: en llegar a la cuenta, en la respuesta, o en la reunión? Con
>    cifras de `captacion/datos/funnel-diario.csv`.
> 3. Tus 4 timbres poke no se han disparado nunca. ¿Los usas de otra forma o sobran?
> 4. `guardia_reenvios.py` depende de una clave en el scratchpad. ¿Qué pasa el día que no esté?
> 5. ¿Tu "Informe de los lunes" ha llegado a ejecutarse alguna vez?
> No cambies nada de tu operación.

## Encargo 2 · Growth / Landing / Contenido

> [ARQUITECTURA — Fase 1 del Internal OS, encargo de Maikel del 10-sep]
> Misma plantilla, misma entrega en tu rama como `ficha-agente.md`.
>
> Contexto: haces tres funciones (web y CRO, contenido, SEO y radar) y tienes 275 commits sin
> integrar en la rama principal.
>
> Responde además:
> 1. ¿Cuál de tus tres funciones deberías soltar primero y a quién?
> 2. Estado real de los CSV que el cerebro espera: `web-diario.csv`, `contenido-diario.csv`,
>    `seo-diario.csv`, `seo-keywords-semanal.csv`, `redes-semanal.csv`. ¿Cuáles existen y se
>    actualizan solos?
> 3. La Radiografía es el lead magnet central. ¿Cuántas se han completado y qué pasa después de
>    cada una, paso a paso? Con fuente.
> 4. Tu "Growth Review semanal" no registra ninguna ejecución desde el 11-ago. ¿Lo has hecho a
>    mano o no se ha hecho?

## Encargo 3 · Cerebro

> [ARQUITECTURA — Fase 1 del Internal OS, encargo de Maikel del 10-sep]
> Misma plantilla, entrega en tu rama como `sistema/ficha-cerebro.md`.
>
> Contexto y hallazgo que te afecta directamente: de tus 5 rutinas, la diaria funciona y las
> otras cuatro no registran ninguna ejecución. Weekly Plan, Weekly Review + CEO Brief, cierre
> financiero y el timbre de Outbound.
>
> Responde además:
> 1. ¿Has producido el Weekly Plan del lunes 8 o el CEO Brief del viernes 5? Si los produjiste,
>    ¿fue porque Maikel te lo pidió a mano?
> 2. `sistema/cerebro.md` tiene tres copias divergentes (103, 63 y 57 líneas) pese a la regla de
>    edición única. ¿Cómo propones garantizar una sola copia?
> 3. Separas hoy tres roles: Brain, Finance y Operations. ¿Cuál soltarías primero?
> 4. ¿Cuántas decisiones de Maikel consumes por semana y cuáles podrían ser tuyas?
> 5. Ventas y Automatización: los coordinas y Maikel no los usa. ¿Mantener, fusionar o retirar?
