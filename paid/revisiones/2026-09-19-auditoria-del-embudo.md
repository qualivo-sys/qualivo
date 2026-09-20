# AUDITORÍA DEL EMBUDO · del lead a la reunión · 19-sep-2026

```
AGENTE     qualivo.paid
PIDE       Maikel, 19-sep: «tenemos que arreglar el sistema, todo el proceso desde que
           entra hasta que se hace la reunión tiene que funcionar perfecto»
MÉTODO     los leads de pago, uno por uno, leyendo el ESTADO de cada mensaje en
           GoHighLevel, no las etiquetas
DUEÑO      la cadencia es de Growth/Ops. Este documento es el diagnóstico, no el arreglo.
```

> Vendemos que ningún lead se cae por las grietas. Esta auditoría mide si los nuestros se caen.

## El embudo real, medido

| Lead | Entró por | 1er WhatsApp | Qué pasó | Reunión |
|---|---|---|---|---|
| 17-sep 22:12 | landing | ❌ falló | SMS **8 h 22 min** después | ✅ |
| 18-sep 16:40 | formulario | ❌ falló ×3 | nada | — |
| 18-sep 20:15 | formulario | — `act-fuera-fin` | nada | — |
| 19-sep 06:15 | formulario | — `act-fuera-fin` | rescatado 09:09 por el gateway | — |
| 19-sep 06:58 | landing | ❌ falló ×2 | **escribió el lead primero** | ✅ |
| 19-sep 07:15 | formulario | ❌ falló ×2 | SMS a las 08:30 | — |

**El primer WhatsApp falló 6 de 6 veces. Cien por cien.**

De seis leads, el sistema contactó por su cuenta a **uno**, con ocho horas de retraso. De los dos
que llegaron a reunión, uno se salvó por el SMS de respaldo y **el otro se salvó solo**: escribió
él, y eso abrió la ventana de 24 h que permitió todo lo demás.

## Los seis defectos

**1 · El primer WhatsApp no puede funcionar nunca.** 🔴
WhatsApp Business solo permite texto libre dentro de las 24 h siguientes a que el cliente escriba.
Un lead nuevo nunca ha escrito, así que esa ventana **no existe**. El primer toque necesita una
**plantilla aprobada (HSM)**. Mientras sea texto libre, falla siempre.
Error literal: `Message failed to send because more than 24 hours have passed since the customer
last replied to this number.`

**2 · Cuando falla, no hay red.** 🔴
No existe la regla «si el WhatsApp falla, SMS en el mismo minuto». Unos leads tuvieron SMS a las
ocho horas y otros no tuvieron nada.

**3 · `act-fuera-fin` es un agujero, no una espera.** 🔴
Tres leads han caído ahí (18, 19 y 20-sep). No se ve ninguna cola que los recoja. El del 20-sep
no había recibido nada catorce horas después.

**4 · Ocho horas de latencia.** 🟡
Aunque el respaldo salga, sale a la mañana siguiente. Es la contradicción más cara que tenemos:
el anuncio promete respuesta en 4 segundos.

**5 · La etiqueta miente.** 🟡
`activacion` y `act-wa1` se ponen falle o no el envío. Existe `act-wa1-fallido`, que ayuda, pero
nada distingue «contactado» de «intentado». El propio agente cayó en ese error el 18-sep.
**Regla nueva: comprobar el `status` del mensaje, nunca la etiqueta.**

**6 · La cadencia es WhatsApp primero y no tiene salida si el lead no tiene WhatsApp.** 🔴
Descubierto el 19-sep con el mejor lead recibido hasta la fecha: su móvil no está dado de alta en
WhatsApp. El sistema reintenta y vuelve a fallar indefinidamente. **No distingue «el mensaje
falló» de «no hay nadie al otro lado».**

## Dónde vive esto

**No está en n8n.** De los 43 workflows, ninguno menciona `act-wa1`, `act-ini-` ni
`act-fuera-fin`. La cadencia vive en el motor de workflows de **GoHighLevel**.

Allí hay **tres versiones del primer contacto por WhatsApp**, dos apagadas y una encendida, y
**dos «Aviso cita Qualivo»** duplicadas. Conviene limpiarlo: cualquiera enciende el que no toca.

La API de GoHighLevel deja listar workflows pero **no editar sus pasos**, así que la reparación es
a mano en la interfaz.

## Lo que se arregló el 19-sep

Maikel conectó **Wazzap** al canal SMS con su número personal. Aparece la etiqueta
`act-por-gateway` y los envíos pasan a entregarse: **de 6 de 6 fallos a 4 de 4 entregados**.

Resuelve los defectos 1, 2 y 4 en la práctica. **No resuelve el 3 ni el 6.**

Avisos sobre Wazzap: es un cliente no oficial y WhatsApp banea por ello; ocupa el canal SMS, que
era la única red que funcionaba; y depende de un móvil encendido. Es el parche bueno. **La
plantilla oficial sigue siendo la solución.**

## Lo que hay que hacer, por orden

| Qué | Dónde | Quién |
|---|---|---|
| Cola que vacíe los `act-fuera-fin` a primera hora | GoHighLevel | Ops |
| Detectar «no tiene WhatsApp» y saltar a email | GoHighLevel | Ops |
| Plantilla de WhatsApp aprobada para el primer toque | Business Manager | Maikel |
| Que `activacion` solo se ponga cuando un mensaje se **entregue** | GoHighLevel | Growth |
| Limpiar los workflows duplicados | GoHighLevel | Ops |
| Revisar el orden de los campos del formulario | Meta | Paid |

La última es mía y tiene dato: **tres de cinco leads intercambiaron nombre y empresa.** Si tres de
cada cinco se equivocan, el formulario está mal puesto, no la gente.

## Nota sobre datos personales

Este documento no contiene nombres, teléfonos ni correos de ningún lead. Esa información vive en
GoHighLevel, que es su sitio. Aquí solo están las horas, los estados y los identificadores de
formulario.
