# ADR-006 · Una rama de integración, sin fusionar las 29

**Fecha** 2026-09-10 · **Estado** propuesta · **Resuelve** hallazgo H3

**Contexto.** 29 ramas, ninguna integrada, y la rama por defecto del repo de la empresa es la de
un cliente. Fusionarlas todas es arriesgado: son ramas de agentes vivos.

**Decisión.** Crear `main` como rama de integración con **solo lo compartido**: `sistema/`,
`docs/agent-os/`, `registry.json`, `bus/` y `src/connectors/`. Cada agente conserva su rama de
trabajo y **lee** la constitución de `main`. No se fusiona nada más por ahora.

**Consecuencias.** Migración de riesgo bajo: una rama nueva, cero merges, nadie se rompe. Sigue
habiendo 29 ramas, pero deja de haber 29 fuentes de verdad. La consolidación del código compartido
se hace después, pieza a pieza, cuando Ops tenga capacidad.

**Pendiente de Maikel:** cambiar la rama por defecto del repositorio a `main`.
