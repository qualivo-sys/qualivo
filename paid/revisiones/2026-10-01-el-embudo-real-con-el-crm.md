# El embudo real, con el CRM por fin conectado · 1-oct-2026

Maikel me dio acceso a GoHighLevel esta mañana. Es la primera vez que puedo cerrar
el embudo de punta a punta con datos propios en lugar del informe de otro agente.

**Y corrige tres cosas importantes: dos del brief y una mía.**

Fuentes: Meta Marketing API v21.0 (`act_3453332464718877`, 17-sep a 1-oct) y
GoHighLevel API v2 (location `bHGMuZEGUESZmVoNv9HT`, pipeline *Prospección*
`JaB4LIwUqFn96LLFEhSm`), ambos leídos el 1-oct a las 10:15 CEST.
Sin nombres, correos ni teléfonos de ningún lead.

---

## 1 · El webhook no pierde ni un lead

**34 envíos en Meta → 34 oportunidades de paid en el CRM.** Clavado.

Llevábamos días sospechando que se perdían leads entre el formulario y el CRM.
No se pierde ninguno. Esa preocupación queda cerrada.

---

## 2 · El embudo completo de paid

Las 34 oportunidades creadas desde el 17-sep cuyo origen es Meta:

| etapa | cuántas |
|---|---|
| Nuevo Lead (nunca arrancó la cadencia) | 4 |
| En cadencia | 1 |
| **Conversación abierta, sin cita** | **7** |
| Reunión agendada (pendiente) | 6 |
| **NO PRESENTADO** | **4** |
| Oferta enviada | 2 |
| Segunda reunión | 2 |
| Negociación | 1 |
| Más adelante | 3 |
| No responde | 4 |
| **total** | **34** |

```
621,63 €  →  270 aperturas  →  34 envíos  →  34 oportunidades
          →  15 citas (9 resueltas + 6 pendientes)
          →  5 reuniones CELEBRADAS  →  1 negociación abierta
```

| evento | unidades | coste |
|---|---|---|
| envío del formulario | 34 | 18,28 € |
| oportunidad en el CRM | 34 | 18,28 € |
| cita agendada | 15 | 41,44 € |
| **reunión celebrada** | **5** | **124,33 €** |
| negociación abierta | 1 | 621,63 € |

---

## 3 · Corrección al brief: la asistencia es 56 %, no 17 %

El brief de la semana 38 decía **9 citas y 5 plantones**, o sea 1 reunión celebrada
de 6 resueltas: un 17 %. Yo construí sobre eso todo el recorrido 360 del 22-sep y
llevo nueve días repitiendo que el plantón era la fuga principal del sistema.

El CRM dice otra cosa:

| | brief (22-sep) | CRM (1-oct) |
|---|---|---|
| reuniones celebradas | 1 | **5** |
| no presentados | 5 | **4** |
| tasa de asistencia | 17 % | **56 %** |

**El plantón es real pero es la mitad de grande de lo que reportamos.** 4 de 9 no
se presentan: eso sigue siendo malo y merece arreglo. Pero no es el 83 % que
justificaba poner el precio en el formulario, parar el paid y reorganizar media
operación alrededor de la confirmación de la víspera.

Parte de la diferencia es el tiempo: el brief era del 22-sep y desde entonces se
han celebrado reuniones. Pero el brief ya contaba 9 citas, las mismas 9 que están
resueltas ahora, así que el grueso de la diferencia no es tiempo: es que el brief
contó mal las celebradas.

---

## 4 · Corrección mía: el coste por reunión celebrada es 124,33 €, no 302 €

He estado reportando **302,56 € por reunión celebrada** (y luego 400 €) porque
dividía todo el gasto entre UNA reunión, la única que el brief reconocía.

Son **124,33 €**. Dos veces y media mejor de lo que he estado diciendo.

Es el KPI que yo mismo declaré como el que manda, y lo he tenido mal nueve días
por apoyarme en el número de otro sin poder comprobarlo. La lección no es "no te
fíes del brief": es que **un agente que no puede verificar su KPI principal no
debería haberlo declarado principal hasta tener acceso a la fuente.**

---

## 5 · La fuga principal es otra, y es la que nadie estaba mirando

| dónde se pierde | cuántos | % de los 34 |
|---|---|---|
| **nunca llegan a una cita** | **19** | **56 %** |
| → nunca arrancó la cadencia (Nuevo Lead + En cadencia) | 5 | 15 % |
| → conversación abierta que no cuaja en cita | 7 | 21 % |
| → no responde o "más adelante" | 7 | 21 % |
| no se presentan a la cita | 4 | 12 % |
| llegan a reunión | 5 | 15 % |
| pendientes de cita | 6 | 18 % |

**Se pierde cuatro veces más gente antes de la cita que en la cita.** Y el bloque
más doloroso son los **5 que nunca arrancaron la cadencia**: leads pagados a
18,28 € que entraron al CRM y ahí se quedaron.

Esto reordena las prioridades. La confirmación de la víspera sigue siendo buena
idea, pero es la cuarta palanca, no la primera. La primera es que **todo lead que
entra arranque la cadencia**, y la segunda que **las 7 conversaciones abiertas
pidan la cita**.

---

## 6 · Lo que confirmo de lo que dijo Maikel

El 26-sep me dijo que no había entrado ningún **cliente**. Es cierto.

Las 3 oportunidades en etapa *Cliente* del pipeline se crearon el **7-ago** y
pasaron a Cliente el 16 y 17 de septiembre: son **anteriores al paid** y no vienen
de ahí. De paid hay **1 en negociación** y 2 con oferta enviada, pero ningún
cliente cerrado todavía.

---

## 7 · El agujero que queda, y es de medición

De las 34 oportunidades de paid, **solo 6 dicen de qué vertical vienen**:

| lo que pone en `source` | cuántas |
|---|---|
| `formulario instantáneo` (sin decir el vertical) | 28 |
| `Meta · AD · VERT · formacion` | 4 |
| `Meta · AD · VERT · clinicas` | 1 |
| `Meta · AD · 3V · reformas → landing /reformas/` | 1 |

Por eso **sigo sin poder dar coste por reunión celebrada POR VERTICAL**, que es
exactamente el número que decide si reformas vuelve a encenderse o no.

Seis de 34 lo hacen bien, así que el webhook sabe escribirlo: es cuestión de que
lo escriba siempre. Mientras no lo haga, cualquier decisión por vertical se toma
a ciegas en el tramo que importa.

**Pedido concreto a quien lleve el webhook:** que `source` incluya siempre el
`utm_content` (el id del anuncio) o el nombre del vertical. Con eso, mañana mismo
tengo el coste por reunión de cada vertical.

---

## 8 · Qué cambia en mi criterio a partir de hoy

1. **El KPI de referencia sigue siendo coste por reunión celebrada**, y ahora sí
   lo puedo calcular yo. 124,33 € es la línea base del 1-oct.
2. **Dejo de repetir el 17 % de asistencia.** Es 56 %.
3. **La prioridad de arreglo pasa a ser el tramo lead→cita**, donde se pierde el
   56 %, por delante del plantón, donde se pierde el 12 %.
4. Mi recomendación sobre reformas sigue **en suspenso** hasta que la atribución
   por vertical funcione. Con 124,33 € de coste por reunión en el agregado, el
   paid está en una posición bastante mejor de la que yo venía describiendo, y eso
   debilita el argumento de apagar cosas.
