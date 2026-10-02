# Landings con efecto · para revisar antes de producción (2-oct-2026)

Este cambio lo pidió Growth con el ok de Maikel (encargo 2). Todo sigue en noindex.

## 1. Plantilla /para/ (`herramientas/para.js`, regenerada con `node herramientas/para.js`)

- **Portada oscura.** El nombre de la empresa se escribe solo y debajo aparece el sello «Página hecha solo para vosotros».
- **«Lo que vimos».** Cada punto lleva la etiqueta «Hecho comprobado» y aparece al bajar.
- **«Lo que no sabemos».** Se conserva tal cual.
- **Preguntas.** Llevan la etiqueta «Hipótesis», para que se vea bien qué es hecho y qué es hipótesis.
- **Recorrido en 4 pasos.** Se ilumina paso a paso.
- **Mensaje de ejemplo.** Tiene botones «Aprobar y enviar» y «Lo escribo yo», para enseñar que nada sale solo.
- **Barra fija «Reservar 30 min».** Aparece al bajar y se esconde sobre la demo y sobre el bloque final.
- **Logo real.**
- **La baliza a `/api/visita/` no se ha tocado.** El script es idéntico, comprobado con diff.
- **Aviso para Growth.** La ficha `para/_fichas/ejemplo.json` usa nombres de persona en el mensaje de ejemplo («Laura», «Marta»). La regla dice que en /para/ solo aparece la empresa. Propongo cambiarlos por «vuestro comercial» y «un anunciante» en las fichas reales. No lo he tocado porque la ficha no es mía.

Capturas: `para-escritorio-portada.png`, `para-escritorio-aprobacion.png`, `para-movil-portada.png`, `para-movil-hipotesis.png`.

## 2. Equipos comerciales

La versión con efectos está en `equipos-comerciales/v2/`. `index.html` no se ha tocado, para comparar las dos antes de cambiar la de producción. Si se aprueba, la v2 pasa a `index.html` sin más cambios.

- **Hero oscuro.** Los mensajes se convierten en tareas.
- **«El lunes de dirección».** Comparativa de antes y después con barra deslizante.
- **Demo «Pruébalo».** El visitante aprueba, edita o «escribe una persona».
- **Menos texto.**

Capturas: `equipos-v2-escritorio.png`, `equipos-v2-movil.png`, `equipos-v2-antes-despues.png`, `equipos-v2-demo.png`.

Las dos se han probado en móvil (390 px, sin scroll horizontal) y en escritorio, sin errores de JavaScript. Si el visitante tiene activado «reducir movimiento», la página se ve completa y sin animaciones.
