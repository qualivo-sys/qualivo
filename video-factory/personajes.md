# Personajes entrenados (Higgsfield Soul)

## Maikel — el de verdad

- **soul_id:** `013da942-1cb0-465a-8dbd-080b1acb7a41`
- **Tipo:** `soul_2` · entrenado el 17-ago-2026 con 5 fotos de estudio
  (pizarra con embudo, sentado en mesa ×2, portátil, brazos cruzados).
- **Estado al crear:** training (~10 min).

## Cómo se usa — y la restricción que importa

Un Soul entrenado **solo funciona con `soul_2` (imágenes) y `soul_cinema_studio`**.
**No se puede pasar directamente a Kling.**

El flujo para tener a Maikel en cualquier escena es de dos pasos:

1. `generate_image` con `model: 'soul_2'` + `soul_id` → una imagen de Maikel en la
   escena que haga falta (oficina, escenario, calle…). ~2 creditos.
2. Esa imagen como `start_image` en Kling → el plano en movimiento. ~10 creditos.

Esto encaja con la Regla 7: la identidad se fija plano a plano con la imagen de
arranque. El Soul lo que resuelve es **generar esa imagen de arranque con su cara
en cualquier escena**, que era justo lo que la Regla 7 dejaba fuera.

## Reglas de uso de la marca (decisión editorial)

El Maikel generado es para **planos de ambiente y apoyo**: caminando, trabajando,
mirando algo. **Nunca afirma nada ni aparenta decir nada** — para las afirmaciones
está su cara real grabada. El posicionamiento es «sin humo»; si un día se nota un
plano generado sin haberlo dicho, el golpe se lo lleva la marca entera.
