# Bus · eventos, partes y tareas

Un fichero por agente. **Un solo escritor por fichero**, y por eso no hay conflictos de merge.
Es a la vez el bus de eventos y el registro de auditoría. Se lee con `grep`.

```
bus/out/<agente>.jsonl    lo escribe SOLO ese agente, al cerrar cada bloque de trabajo
bus/tasks/<mes>.jsonl     lo escribe SOLO el Cerebro
```

Una línea por evento o parte, JSON en una sola línea. Esquemas en
`docs/agent-os/05-protocols/00-borrador-protocolos.md`.

Regla: toda métrica lleva `value`, `source` y `as_of`. Si no hay dato, `SIN DATO`.
