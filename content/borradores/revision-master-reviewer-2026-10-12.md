# Master Reviewer · lunes 12-oct-2026

**Piezas revisadas:**
- actualización de `/blog/cualificar-leads/` (pieza 1 del brief de la semana 42);
- re-apunte de `/blog/formulario-de-facebook-o-landing-page/`;
- corrección de fecha de la prueba del funnel v2 (ahora «desde el 8-oct» en lugar de «prevista el lunes 12»);
- piezas 6 y 7 del brief.

**Fuentes:**
- `bus/out/demand.jsonl` (5, 8, 9 y 11-oct);
- `api/_funnel-v2.js`, `api/meta-leadform.js` y `api/_cita.js`;
- `confirmado/index.html`.

| Pieza | Nota | Veredicto |
|---|---|---|
| cualificar-leads | 6 | Publicar con cambios |
| formulario-de-facebook (re-apunte) | 7 | Publicar con cambios |
| Corrección de fecha (HTML) | 8 | Publicar |
| Corrección de fecha (llms.txt y tesis) | — | Con cambios |
| Piezas 6 y 7 | 5 | Usar con cambios |

## Lo que dice el código (R2)

- **Precio:** el formulario v2 pregunta el ticket en 4 tramos.
- **Etiquetas `ticket-*` y `fit-dinero-*`:** no las lee ningún código de mensajes. La respuesta del precio solo deja marca.
- **La prueba sí cambia mensajes:**
  - el dolor marcado entra en el primer WhatsApp (c9de117);
  - el momento se pasa a `cuando-*`, que leen la puntuación y el agente;
  - la confirmación de cita lleva el enlace a `/confirmado/` (solo `funnel-v2`).

## Críticos (aplicados el 12-oct)

**cualificar-leads**
- **R2.** «Solo marca: no cambia ningún mensaje» pasa a «esa respuesta, por ahora, solo deja la marca: no cambia lo que le escribimos».
- **R2.** La marca sale del precio por el volumen declarado.
- **R1.** «Cada pregunta quita contactos» pasa a «puede quitar».

**formulario-de-facebook**
- **R1/R2.** Son dos formularios nuevos, y la lista completa de preguntas incluye el dolor.

**llms.txt**
- **R1/R5.** Fuera «no le salía la cuenta»: el daily dice «justa» y el trato sigue abierto. Pasa a «cuyo precio de servicio cambiaba la cuenta».

**Tesis**
- **R3.** La ficha dice que la prueba está en marcha desde el 8-oct.

**Piezas 6 y 7**
- **R1/R5.** «Que no podía salir a cuenta» pasa a «un precio que cambiaba toda la cuenta».
- **R1.** Fuera el «suele».
- **R2.** «En los formularios de una prueba», porque los formularios viejos siguen activos.
- **R1.** El plazo pasa de «una semana» a «dos o tres semanas».

## Mejoras aplicadas

- **cualificar-leads:**
  - resumen más claro;
  - «es lo que declara: confírmalo en la llamada»;
  - «más de un 30 %» en la FAQ (es la regla del 8-oct, no un resultado).
- **formulario-de-facebook:**
  - enlaces a cualificar-leads y a quien-decide-la-compra;
  - recupera una línea sobre lo que hacemos.
- **primera-reunion:** sin la fecha repetida.
- **Pieza 6:** nota sobre R9 si va por WhatsApp.

## Fuera de lo pedido, también aplicado (R2)

`/blog/cuanto-invertir-en-publicidad/` (6-oct) y `/blog/objecion-de-precio/` (8-oct) decían que la pregunta del precio estaba «pendiente». Desde el 8-oct está en los formularios de la prueba. Corregidos y con `dateModified` del 12-oct.
