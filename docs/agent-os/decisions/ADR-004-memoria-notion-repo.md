# ADR-004 · Notion es la capa humana, el repo es la capa máquina

**Fecha** 2026-09-10 · **Estado** propuesta · **Resuelve** hallazgo H4

**Contexto.** `sistema/cerebro.md` declara "solo lo edita el cerebro" y tiene tres copias vivas de
103, 63 y 57 líneas. La estrategia tiene cuatro espejos. Es deuda de memoria activa.

**Decisión.** Un dato, un dueño:

| Capa | Dueño |
|---|---|
| Estrategia, ICPs, copy | Google Doc y Notion, editados por Maikel |
| Tareas, decisiones, sprints, experimentos | Notion Sala de Mando |
| Agentes, permisos, salud | `registry.json` en la rama de integración |
| Código, datos, protocolos, eventos | repo |
| Leads y oportunidades | GoHighLevel |
| Dinero | Google Sheet Cockpit y Quipu |

`cerebro.md` deja de ser la constitución: su contenido se reparte y las tres copias se borran el
mismo día en que el reparto esté hecho, no antes.

**Consecuencias.** Los agentes tienen que aprender a leer del registry. A cambio deja de existir
la pregunta "¿cuál de las tres copias es la buena?".
