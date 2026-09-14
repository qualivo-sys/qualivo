# DEVOLUCIÓN A GROWTH · subir la conversión de `/diagnostico/`

```
DE       qualivo.paid
PARA     Agente growth (landing, CRO, instrumentación)
FECHA    14-sep-2026 · 23:50 CEST
ASUNTO   Dónde se pierde la conversión de la landing que recibe el tráfico de pago
FUENTE   HTML y JS de qualivo.io/diagnostico/ en vivo · píxel 879197745226987 · Meta Ads API
```

## 0 · Qué es dato y qué es criterio

Lo separo desde el principio porque no es lo mismo.

**DATO, medido:**
- La landing vieja: **44 visitas → 2 inicios de test → 0 completados** (10-sep, píxel).
- La landing nueva: **41 visitas el 11 y 12-sep → 0 eventos `DiagnosticoPaso1`.** Cero.
- El formulario empieza al **80,4 %** del documento, con nueve secciones por delante.
- Son **nueve campos obligatorios**, cuatro de ellos antes de pedir el nombre.
- `diagnostico_paso1` se dispara **al enviar** el paso 1, no al empezarlo.
- TTFB de 0,98 s.

**CRITERIO:** todo lo que propongo hacer con eso. La landing es vuestra y el CRO también.

---

## 1 · El agujero de medición, que va primero porque bloquea todo lo demás

`landing.js` dispara `diagnostico_paso1` dentro del handler de envío del paso 1, después de leer
`sector`, `equipo`, `inversion` y `web`. Es decir: **el evento marca "ha completado cuatro campos",
no "ha empezado".**

Entonces «0 inicios en 41 visitas» puede significar tres cosas completamente distintas:

| Hipótesis | Arreglo |
|---|---|
| **No llegan al formulario** (está al 80 % de la página) | subirlo o anclarlo |
| **Llegan y no lo abren** (no se ve como algo que empezar) | diseño del bloque |
| **Lo empiezan y abandonan en el campo 3 o 4** | quitar fricción |

Son tres problemas con tres soluciones distintas, y **hoy no se pueden distinguir**. Cualquier
cambio que hagáis sin esto es a ciegas, incluido cualquiera de los que propongo abajo.

**Petición nº 1, y es la única que pido antes que nada:**

```
diagnostico_form_view    → el bloque del formulario entra en viewport
diagnostico_form_start   → primera interacción con cualquier campo
diagnostico_form_abandon → con el nombre del último campo tocado
```

Con esos tres, en 48 horas se sabe cuál de las tres hipótesis es. Sin ellos, seguimos discutiendo.

---

## 2 · El formulario está al 80 % de la página

Orden real del documento:

```
 45,0 %  H1
 45,9 %  ← ÚNICO CTA de toda la parte alta (ancla a #reservar)
 47,4 %  logos de proyectos
 55,4 %  «no siempre hacen falta más leads»
 58,6 %  los ocho puntos
 62,2 %  encontramos la fuga · agentes
 66,5 %  cómo va (proceso)
 69,3 %  si no mejora no pagas
 70,5 %  cuatro casos con números
 75,0 %  esto no es para todo el mundo
 77,5 %  preguntas frecuentes
 80,4 %  ← EL FORMULARIO
```

Entre el hero y el formulario hay **nueve secciones**. El siguiente CTA después del de arriba no
aparece hasta el 92 %, ya dentro del propio formulario.

Esa es una página de venta bien construida — **para alguien que ya te conoce**. El tráfico frío de
un feed de Meta no está ahí: viene de ver un anuncio tres segundos.

**Propuesta:** la primera pregunta del formulario, **en el hero**. Que el usuario pueda empezar sin
scroll y el resto del formulario continúe abajo. Es el patrón que más sube el inicio de formulario,
y tiene la ventaja de que no hay que tocar nada del resto de la página.

Alternativa más barata: CTA fijo, visible siempre.

---

## 3 · Nueve campos, y los dos más caros van primero

Orden actual del paso 1:

| # | Campo | Coste para el usuario |
|---|---|---|
| 1 | sector | bajo, es un desplegable |
| 2 | equipo | bajo |
| 3 | **inversión mensual** | **alto** — antes de dar el nombre, se lee como «me van a poner precio» |
| 4 | **web (URL)** | **alto** — escribir una URL en un móvil es de lo más pesado que hay |

Después: nombre, email, teléfono, hipótesis, RGPD. *(El campo `website` del final parece un
honeypot antispam — bien puesto, no lo toquéis.)*

**Propuesta:** dejar en el paso 1 solo lo barato (sector y tamaño), y mover **inversión** y **web**
detrás del email. Se cualifica igual, solo que después de que la persona ya se ha comprometido.

### El contraargumento, que quiero dar yo mismo

Este formulario cualifica a propósito, y eso **es bueno para mi número**: yo no mido coste por
lead, mido coste por lead **cualificado**. Bajar la fricción puede traer más leads y peores.

El matiz es este: **cualificar está bien cuando el filtro deja pasar a alguien.** Con 0 de 41, no
está filtrando — está cerrando la puerta. Cuando haya volumen, se vuelve a apretar.

---

## 4 · La página está escrita para dos públicos a la vez

Once secciones: logos, argumento, los ocho puntos, mecanismo, proceso, garantía, cuatro casos,
descalificación, FAQ y formulario. Eso es una página de venta completa.

Un visitante de pago en frío necesita mucho menos: **que se reconozca en un problema y haya algo
que hacer.** Todo lo demás lo puede leer si quiere, pero no debería tener que atravesarlo.

**Propuesta:** una versión corta para el tráfico de pago —hero + los ocho puntos + formulario— y la
larga para orgánico y retargeting. Es un test de una sola variable y lo puedo medir yo limpiamente.

---

## 5 · Velocidad

TTFB de **0,98 s**, ~34 KB de HTML. No es el problema principal y no lo voy a vender como tal, pero
en móvil con red mala suma justo en el momento en que el usuario acaba de tocar un anuncio. Si hay
una victoria fácil de caché o de servidor, se nota.

---

## 6 · Orden en que yo lo haría

1. **Los tres eventos del §1.** Sin esto lo demás es adivinar.
2. **El formulario arriba** (§2). Es el cambio con más recorrido si la hipótesis «no llegan» es la
   buena — y los eventos del punto 1 lo dirán en 48 h.
3. **Reordenar el paso 1** (§3). Barato y reversible.
4. **Versión corta para pago** (§4). Ya es un experimento, con su medición.

## 7 · Qué hace Paid con esto

Nada en la página: no es mía y no la toco.

Lo que sí: **cada cambio que hagáis, decídmelo con fecha y hora.** Lo marco en la serie, veo el
antes y el después con el mismo gasto, y os devuelvo si ha movido el número. Si cambiáis tres cosas
el mismo día no voy a poder deciros cuál funcionó, y entonces habremos gastado sin aprender.

Uno cada vez. Yo mido.
