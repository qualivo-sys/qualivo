# Reglas del director

> Documento permanente del sistema. Sale de las pruebas reales con Kling del
> 17-ago-2026, no de teoría. Cada regla existe porque un plano falló.

## Lo que aprendimos pagando

**La imagen de referencia mantiene muy bien el escenario.** Arquitectura, mobiliario,
objetos, luz y composición general se repiten con fidelidad entre planos. Tres planos
distintos generados desde la misma referencia dieron la misma oficina: la misma
ventana, los mismos archivadores, el mismo ventilador, el mismo calendario.

**La imagen de referencia NO garantiza la coreografía.** De tres planos generados con
el decorado correcto, **dos hicieron una acción distinta a la pedida**. Se pidió un
plano por encima del hombro de una mujer sentada rellenando un formulario y salió de
espaldas y de pie. Se pidió un primer plano de una mano cogiendo un móvil y salió un
plano general de la oficina sin móvil ni mano.

**Las acciones complejas se desvían más.** A más pasos, más probabilidad de que el
modelo invente.

**Los planos detalle fallan cuando la única referencia es un plano general.** El
modelo se agarra al encuadre de la imagen de referencia.

---

## REGLA 1 · Acciones simples

Priorizar acciones estáticas o movimientos muy sencillos.

**Funciona:** una persona caminando · mirando a cámara · escribiendo · mirando una
pantalla · sentada trabajando · un teléfono sonando sobre una mesa.

**Evitar:** sentarse y coger un objeto y mirarlo y levantarse · interacciones entre
dos personas · movimientos precisos de manos · coreografías largas · cualquier acción
con varios pasos.

## REGLA 2 · Dividir acciones

Si una acción necesita varios pasos, son varios planos.

**No:** «Una mujer se sienta, coge el teléfono, mira la pantalla y empieza a escribir.»

**Sí:** plano 1, mujer **ya sentada** ante el escritorio · plano 2, el teléfono
sonando sobre la mesa sin que nadie lo coja · plano 3, la mujer escribiendo.

Dividir no es un parche: además da material para montar con ritmo.

## REGLA 3 · Planos detalle

Un plano detalle **no** se genera con una referencia de plano general. Hay que crear
una referencia específica del objeto, con el objeto claramente visible, la mano en
posición si la hay, y el encuadre ya cercano. Y describir el encuadre en el prompt.

## REGLA 4 · Una referencia por tipo de plano

El sistema distingue: `establishing` · `medium` · `close_up` · `extreme_close_up` ·
`over_the_shoulder`.

**Una referencia de plano general no se reutiliza automáticamente para todos.** Cada
tipo de plano declara qué referencia usa, y si no existe la adecuada se crea antes.

## REGLA 5 · Coreografía

Si un plano lleva una acción compleja que no se puede simplificar ni dividir, se
marca `reference_required: true` y se explica **qué imagen adicional** haría falta.
No se genera hasta tenerla.

## REGLA 6 · Evaluar antes de gastar

Antes de generar, cada plano declara:

- `action_complexity`: `low` · `medium` · `high`
- `reference_quality`: `low` · `medium` · `high`

Si `action_complexity` es `high`: **simplificar la acción, dividir el plano, o pedir
una segunda referencia.** Nunca generar y confiar.

Si `reference_quality` es `low` para el tipo de plano pedido: crear la referencia
antes. Un plano fallido cuesta 10 creditos; una imagen de referencia cuesta 2.

---

## Justificación obligatoria

Antes de generar un plano, el director escribe en `justificacion`:

1. **Qué quiere conseguir** el plano.
2. **Qué referencia usa** y por qué es la adecuada para ese tipo de plano.
3. **Por qué la acción es suficientemente sencilla.**
4. **Qué riesgo de fallo hay** y cuál es el plan B.

Si no se puede escribir ese párrafo, el plano no está listo para generarse.

## El objetivo económico

**No se gastan creditos intentando arreglar con prompts lo que se arregla con una
referencia mejor o partiendo el plano en dos.**

Referencia: 2 creditos. Plano de vídeo: 10 creditos. Un plano generado tres veces
para acertar la coreografía cuesta 30; la referencia específica que lo habría
resuelto, 2.

## REGLA 7 · La identidad se fija en el vídeo, no en la imagen

Descubierto el 17-ago-2026 gastando creditos.

Se intentó crear una segunda imagen fija del mismo protagonista —sentado, plano por
encima del hombro— pasando su retrato como referencia a `soul_2`. Falló dos veces
en el mismo intento:

- **Copió el encuadre de la referencia** (otro retrato de pie en un pasillo) en vez
  de seguir el prompt, que pedía sentado y por encima del hombro.
- **Cambió la cara.** Salió otro hombre, más joven y sin barba.

Conclusión operativa:

- **Un generador de imágenes con referencia copia la composición, no la identidad.**
- **La identidad solo se sostiene usando la MISMA imagen de referencia como
  `start_image` en Kling, plano a plano.** Eso sí funciona: el plano 1 mantuvo la
  cara exacta del retrato.

Por tanto:

1. Se crea **una sola** imagen de referencia por personaje y no se intenta generar
   más imágenes «del mismo».
2. Todos los planos con ese personaje parten de esa imagen. Y como la referencia
   arrastra el encuadre, **todos esos planos tendrán un encuadre parecido**.
3. Si el guion necesita al personaje en otra situación (sentado, otro sitio, otro
   encuadre), hay dos caminos honestos: **rodarlo**, o **reescribir el plano para que
   no salga su cara** — un plano del puesto de trabajo, de la pantalla o del objeto.

La tercera opción, entrenar un personaje reutilizable con 5-20 fotos, existe pero es
otro proyecto.
