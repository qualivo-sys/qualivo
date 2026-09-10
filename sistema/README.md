# Dónde vive cada cosa

Esta rama (`main`) es la **rama de integración**: lo compartido por todos los agentes.
Cada agente conserva su rama de trabajo y lee de aquí.

## Fuente de verdad, una por dato

| Dato | Manda | Espejo |
|---|---|---|
| Estrategia, posicionamiento, oferta | Google Doc "Estrategia Central Qualivo v1" | repo, solo lectura |
| ICPs y copy de outbound | Notion, OUTBOUND BRAIN | repo, solo lectura |
| Qué agentes existen, qué poseen, permisos, salud | `docs/agent-os/registry.json` | ninguno |
| Tareas, decisiones, sprints, experimentos | Notion, Qualivo OS · Sala de Mando | ninguno |
| Leads, contactos, oportunidades | GoHighLevel | CSV derivados |
| Caja, cobros, gastos | Google Sheet del Cerebro + Quipu | ninguno en Notion |
| Eventos y partes de agente | `bus/` | ninguno |
| Código, protocolos, arquitectura | esta rama | ninguno |

**Un dato tiene un dueño. Un espejo lo escribe un proceso, nunca una persona.**

## Sobre `sistema/cerebro.md`

Sigue siendo la constitución vigente y vive en la rama del CEO Agent:

```
git show origin/claude/quipu-billing-dashboard-g2s2ap:sistema/cerebro.md
```

**No se copia aquí a propósito.** A 10-sep-2026 tenía tres copias vivas y divergentes de 103, 63
y 57 líneas, y añadir una cuarta empeoraría el problema. Su contenido se reparte según la tabla de
arriba y entonces se retira. Ver `docs/agent-os/decisions/ADR-004-memoria-notion-repo.md`.

## Arquitectura

Todo en `docs/agent-os/`. Empieza por su `README.md`.
