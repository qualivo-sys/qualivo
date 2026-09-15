# Qualivo · Serie «Dónde está la fuga»

Rediseño de la serie de creativos de embudo. Seis piezas, una por etapa,
con la misma plantilla y un único elemento variable: dónde se rompe la cadena.

Formato 1080 × 1350 px, vertical 4:5, para feed de Instagram y LinkedIn.

## Archivos

| Archivo | Qué es |
|---|---|
| `creatives.html` | Plantilla y textos. Fuente única de verdad. |
| `render.mjs` | Exporta los seis PNG y la hoja de contactos. |
| `fonts/` | Anton y Poppins servidas en local para que el render sea determinista. |
| `out/` | PNG generados. |

## Editar y reexportar

Los textos viven en el array `PIECES` y las constantes de la serie en
`FIX`, `RISK`, `CTA` y `FOOT`, todo en `creatives.html`. Después:

```bash
npm i playwright        # o usar la instalación global
node render.mjs
```

El titular se autoajusta al ancho, así que se puede reescribir sin tocar el diseño.

## Qué cambia respecto a la versión anterior

Siete correcciones, en el orden de impacto del diagnóstico.

1. **Hay llamada a la acción.** Barra naranja sólida con la acción y el destino.
   Antes el dominio aparecía como firma en el pie y no pedía nada.
2. **«Si no se mueve, no pagas» sube a segundo elemento más fuerte.** Es el único
   activo que un competidor no puede copiar sin asumir el mismo riesgo. Estaba
   en cuerpo pequeño abajo a la derecha.
3. **El resaltado naranja se mueve al diferenciador.** Ahora marca «dentro del
   sistema que ya tienes», que mata la objeción de migrar. «Con IA» se elimina:
   no diferencia y se llevaba el énfasis.
4. **Titulares 01, 02, 03 y 06 reescritos como escena concreta.** La versión
   anterior de la pieza 02 afirmaba «la mitad se va», un dato sobre el negocio
   del lector que nadie había demostrado. Ahora describe la escena sin afirmar
   estadística. La 01 pasa de acusar de dejadez a mostrar un hecho.
5. **Se reserva un hueco de prueba, vacío a propósito.** Campo `proof` en cada
   pieza. No se rellena con cifras inventadas. Mientras no exista un dato real
   de Qualivo, la confianza la sostiene la inversión del riesgo del punto 2.
6. **La plantilla ya no deja un agujero en el centro.** El bloque de titular es
   de alto automático y el espacio sobrante se reparte entre todos los
   separadores en proporción, en lugar de acumularse en un único hueco. El gris
   del cuerpo sube a `#A8A39B`, con contraste 7,7:1 sobre el fondo.
7. **El diagrama lee avería, no progreso.** La etiqueta dice FUGA en vez de
   AQUÍ, la cadena se rompe con extremos rasgados y un hueco ancho, la fuga cae
   bajo el corte y todo lo posterior queda apagado. Antes era un indicador de
   paso de checkout, que significa lo contrario de lo que quiere decir la pieza.

Extra: marcador de serie `FUGA 0N / 06` arriba a la derecha. Da a cada pieza
identidad propia y crea motivo para ver las demás.

## Pendiente de decisión del equipo

- Qué significa «se mueve», en cuánto tiempo y quién lo mide.
- Qué es Qualivo en una frase y en palabras del comprador.
- El dato real que va en el hueco `proof`.
- Si la campaña es de marca personal o corporativa. Hoy el handle y el dominio
  conviven sin jerarquía resuelta.
