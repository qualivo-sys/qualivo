# FILTRO EN EL FORMULARIO · v3 · 16-sep-2026

```
AGENTE    qualivo.paid
PIDE      Maikel: «haz un condicional en el form»
RESULTADO condicionales existen en Meta pero están capadas para este token ·
          filtro construido por otra vía y ya conectado al anuncio
```

## 1 · Sobre el condicional, con la prueba delante

**Meta sí tiene preguntas condicionales en formularios.** No es opinión, lo dice la API al
rechazar el intento:

```
(#100) Param questions[1][conditional_questions_group_id]
       is not a valid LeadGen Conditional Questions Group ID
```

El campo se reconoce. Hay que crear antes un grupo de condicionales, y ahí está el muro:

```
POST /359073050620335/leadgen_conditional_questions_group
→ (#100) The parameter conditional_questions_group_csv is required
→ (#3)   Application does not have the capability to make this API call
```

**La app de este token no tiene la capacidad.** Es una función restringida. No sé si está
disponible en el Administrador a mano; no lo he comprobado y no lo afirmo.

### Y aunque estuviera disponible, no resolvería el problema

Las condicionales de Meta **muestran preguntas distintas según la respuesta. No bloquean el envío.**
Quien conteste «no invierto nada» seguiría enviando el formulario y seguiría siendo un lead pagado.
El filtro de verdad no está en la lógica: está en el orden y en la puerta.

## 2 · El fallo de diseño que había, y que no era una hipótesis

En el formulario v1, la opción **«Nada todavía» estaba la PRIMERA** de la lista. En un formulario
móvil, la primera opción se lleva una parte desproporcionada de los clics. Y las preguntas de
cualificación iban **después** del nombre, el email y el teléfono: para cuando se les preguntaba por
el presupuesto, ya eran un lead pagado.

El primer lead de pago contestó exactamente eso: *«Nada todavía»*.

## 3 · Lo que hace el v3 · `1585884733268750`

### El dinero se pregunta ANTES que el contacto

```
v1                          v3
1. Nombre                   1. ¿Cuánto invertís al mes?      ← el filtro
2. Email                    2. ¿Dónde se te escapa?
3. Teléfono                 3. Nombre
4. ¿Cuánto invertís?        4. Email
5. ¿Dónde se te escapa?     5. Teléfono
```

Quien no encaja abandona **antes** de dejar el contacto. Y un abandono no se paga como lead: Meta
solo cobra el lead cuando se envía. **Ese es el condicional que sí se puede construir.**

### Las opciones van de mayor a menor

```
Más de 5.000 €
Entre 2.000 y 5.000 €
Entre 500 y 2.000 €
Menos de 500 €
Todavía no invierto nada      ← ahora la última, ya no la primera
```

No se elimina la opción a propósito: si la quitas, el que no invierte miente y marca «menos de 500»,
y entonces pierdes el dato. Mejor que conteste la verdad, pero sin ponérsela de primera.

### La puerta de entrada dice la barrera en voz alta

```
antes                              ahora
«Quince minutos revisando...»      «Para negocios que YA invierten en captación
                                    y quieren que rinda más.»           ← línea 1
[botón] «Pedir mi diagnóstico»     [botón] «Ver si encajo»
```

El botón deja de prometer un regalo y pasa a proponer una comprobación de encaje. Es el cambio más
barato contra el imán de la gratuidad.

Se conserva: `is_optimized_for_quality: true` (ya estaba), solo público objetivo, y la página de
gracias con el enlace a agenda.

## 4 · Conectado al anuncio

```
CREATIVO  1384277089973914   (sustituye a 1043001498794857)
ANUNCIO   120245657153380358 · ACTIVE · apunta al formulario v3
```

Vistas previas comprobadas en feed móvil y en stories: renderizan.

**Momento elegido:** el día iba por 16,67 € de 20, el 83 %. Cambiar ahora deja el corte casi
exactamente en la frontera del día, así que **el día 1 es formulario v1 y el día 2 será formulario
v3, limpiamente separados.** Eso importa: mi propio modo de fallo dice «tocar varias cosas a la vez
y no saber cuál funcionó».

## 5 · Lo que esto cambia en los números, y el aviso

Esto **va a bajar el número de leads**, y eso es lo que se busca. Si mañana entran menos leads pero
contestan «500 €» o más, el cambio ha funcionado aunque el CPL suba. El número de este agente es el
coste por lead **cualificado**: un lead a 16,67 € que no compra es más caro que uno a 50 € que sí.

**Lo que hay que mirar mañana no es cuántos leads entran, sino qué contestan.**

## 6 · Lo que sigue pendiente

- **GoHighLevel:** ¿entró el lead de hoy en la cadencia? Y ojo, el formulario nuevo
  `1585884733268750` **tiene que añadirse a `META_LEADFORM_IDS`** o sus leads se guardarán sin que
  nadie los contacte. Lo avisa el propio `api/meta-leadform.js`.
- **El token de Meta sigue sin rotar.** Octavo día.
