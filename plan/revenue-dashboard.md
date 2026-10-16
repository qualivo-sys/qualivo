# Revenue Dashboard

Tabla diaria del embudo completo por campaña. Se genera con
`revenue_dashboard.py` (scratchpad): contactos y respuestas salen de
Smartlead; positivas, reuniones, oportunidades, propuestas, ganadas y
revenue salen del overlay manual `pipeline_manual.json`, que se actualiza en
el triaje diario hasta que GHL vuelva a estar conectado.

Indicador estrella: **Revenue / 1.000 contactos**. La regla del charter:
ninguna campaña recibe más volumen por tener capacidad disponible — solo por
demostrar conversión hacia abajo del embudo.

## Snapshot · 17-ago-2026

| Campaña | Contactos | Resp. | Positivas | Reuniones | Oport. | Prop. | Ganadas | Revenue | Rev/1.000 |
|---|---|---|---|---|---|---|---|---|---|
| Academias | 638 | 53 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Construcción | 369 | 9 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Clínicas | 278 | 4 | 1 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Solar | 80 | 0 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Inmobiliarias | 110 | 2 | 1 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Señales v1 (cerrada) | 54 | 3 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Señales v2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Infoproducto | 48 | 3 | 2 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Agent for Me A1 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| ICP Adelantta | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0€ | 0€ |
| Red directa (fuera de máquina) | 1 | - | 1 | 1 | 1 | 1 | 0 | 0€ | 0€ |

## Lo que dice la tabla, sin adornos

1. **Todo el pipeline real está en una sola fila: la red directa.** Un
   contacto (Adelantta) ha producido más embudo que 1.600 contactos de
   máquina juntos. Es la evidencia del principio del charter: la máquina
   genera conversaciones, pero el dinero de momento viene de atención por
   cuenta.
2. **Academias responde mucho (53) y convierte nada (0 positivas).** Sus
   respuestas son bajas, quejas y autorespuestas. Es la campaña ejemplo de
   "60% apertura ≠ negocio": estado OPTIMIZE, no SCALE.
3. **Infoproducto es la campaña más eficiente en positivas** (2 de 48
   contactos, 4,2%) pese a ser la lista más sucia. Las dos positivas
   (Calviño, Carvajalinos) están vivas y en conversación.
4. **Solar confirma su corte**: 0 respuestas de 80 contactos únicos.
5. Las dos apuestas nuevas (A1 y Adelantta) aún no tienen datos — 9-10
   contactos. No sacar conclusiones hasta ~50.

## Reparto de esfuerzo vigente (hasta el primer cliente cerrado)

- **50% Revenue Now**: Adelantta v2, respuestas calientes, follow-ups.
- **35% Revenue Learning**: ICP Adelantta, Señales v2, A1, retador Academias.
- **15% Infrastructure**: GHL, dashboard, supresión, guardias.
