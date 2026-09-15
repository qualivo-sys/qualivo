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

---

# Versión de post único

`post-unico.html` · `render-post.mjs` · salidas `qualivo-post-organico.png` y
`qualivo-post-pago.png`.

Un post suelto no es una pieza de la serie recortada. Cambia el trabajo que
tiene que hacer la imagen, y por tanto cambian titular y diagrama.

## Qué cambia y por qué

**El titular deja de ser una escena y pasa a ser un reencuadre.** En la serie,
«te pidió precio a las 23:40» funciona porque las otras cinco piezas cubren al
resto del público. Sola, esa escena solo le habla a quien tiene la fuga en la
llamada, o sea a una minoría de quien la ve. El post único necesita un titular
que le sirva a todos: «Tu dinero no se pierde en el anuncio. Se pierde después.»
Reencuadra, crea tensión porque contradice donde mira todo el mundo, y prepara
el diagrama.

**El diagrama deja de localizar la fuga y pasa a ofrecerla.** En la serie se
enciende un nodo porque la pieza ya ha elegido de qué habla. Aquí se muestran
los seis, numerados, con los cinco posteriores al clic rotos por abajo y
goteando. El lector se autodiagnostica. Esa es toda la mecánica del post.

**La numeración no es decorativa.** Da al lector una respuesta de una sola
pulsación, que es lo que convierte una impresión en conversación.

**La llamada a la acción cambia según el canal.** En orgánico, la acción es
responder con el número: fricción mínima, nativa del feed y genera conversación
cualificada. En pago los comentarios no convierten, así que la barra lleva el
diagnóstico y el dominio. Es la única diferencia entre las dos versiones.

## Texto de acompañamiento, versión orgánica

Los seis titulares de la serie no se pierden: bajan al pie de foto y se
convierten en el desarrollo del post.

```
Casi todo el mundo mira el anuncio.

El anuncio es el paso 01 de seis. Los otros cinco no los mira nadie.

02 · La web. Rellena tres campos, ve el cuarto y cierra.
03 · El contacto. Es el tercer formulario que rellena y para ti son tres personas.
04 · La llamada. Te pidió precio a las 23:40 y le contestaste a las 10.
05 · El seguimiento. Te dijo que en marzo no. Nadie ha vuelto a llamarle.
06 · La venta. Cerraste ocho este mes y no sabes de qué anuncio salió ninguno.

Cada uno de esos pasos gotea. Y nadie mide en cuál.

Nosotros lo encontramos y lo arreglamos dentro del sistema que ya tienes.
Sin migrar nada.

15 minutos para decirte qué vemos. Un mes para moverlo.
Si no se mueve, no pagas.

¿En cuál se te va a ti? Dime el número.
```

## Cuál usar

El post único es mejor primera pieza: instala la categoría y mide qué etapa
duele más en la audiencia, leyendo los números que responde la gente. La serie
funciona después, y ese dato decide por cuál de las seis empezar.
