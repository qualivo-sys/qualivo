# El 0 de Smartlead no para un buzón: lo deja sin límite · 2-oct-2026

> Corrección de lo que escribí el 1-oct. **Afirmé que los cinco buzones de SURBL estaban
> parados y verificados. Era falso**, y lo que hice fue lo contrario de lo que quería.

## Lo que pasó

El 1-oct puse `max_email_per_day: 0` en los cinco buzones de `goqualivo.com` y `gotqualivo.com`,
leí el campo de vuelta, vi `message_per_day = 0` en los cinco y lo declaré hecho.

Hoy, mirando el historial de mensajes lead a lead:

| Día | goqualivo + gotqualivo | novaqualivo + qualivoedge | Total inspeccionado |
|---|---:|---:|---:|
| 1-oct | **32** | 44 | 76 |
| 2-oct | **15** | 15 | 30 |
| **Total** | **47 (44%)** | 59 | **106** |

**El 44% de los envíos de ayer y hoy salieron por los dominios listados en SURBL**, con el campo
a 0 y un día entero después de mi cambio.

La prueba directa está en el propio objeto del buzón: `message_per_day = 0` y a la vez
`daily_sent_count = 3`.

## Por qué

**En Smartlead, 0 en el tope diario significa «sin límite», no «no enviar».** Esos buzones tenían
55 al día cada uno. Al ponerlos a 0 no los frené: **les quité el tope.**

Dos trampas más del mismo campo, las dos comprobadas hoy:
- Se **escribe** `max_email_per_day` y se **lee** `message_per_day`. Un POST con
  `message_per_day` devuelve `400 Bad Request`.
- `max_email_per_day` se lee siempre como `None`, así que leer de vuelta el campo que escribiste
  no sirve: hay que leer el otro.
- `campaign_count = 0` e `is_connected_to_campaign = None` en un buzón que **sí** está dentro de
  tres campañas activas. Esos dos campos no se pueden usar para saber si un buzón envía.

## Qué está puesto ahora

Tope a **1 al día** en los cinco, leído de vuelta como `message_per_day = 1`. Control: un buzón
limpio (`maikel@qualivoedge.com`) sigue en 30, sin tocar.

**Esto no está verificado todavía.** Está verificado el valor, que es justo lo que ayer me engañó.
La comprobación de verdad es contar los dominios emisores del próximo día de envío, que es el
**lunes 5**, con el mismo método de arriba: historial de mensajes lead a lead, no la fila de
estadística, que no trae el buzón emisor.

## El arreglo de verdad, que no he hecho

Quitar los cinco buzones de las campañas. Con el tope a 1 siguen saliendo 5 correos al día con una
URL listada dentro.

**No lo hago solo porque tiene un efecto que no es mío de decidir:** los pasos 2 y 3 de estas
secuencias responden en el hilo y no llevan asunto. Un lead cuyo paso 1 salió por goqualivo y cuyo
paso 2 saliera por qualivoedge rompe la continuidad del hilo. Hay unos 15 leads a mitad de
secuencia en esa situación.

## La lección, por segunda vez en dos días

Esta mañana escribí *«una comprobación sin entrada de control no es una comprobación»* a cuenta de
`dig`. Y por la tarde había dado por bueno un cambio **leyendo el ajuste en vez de midiendo el
resultado**. El ajuste decía 0. El sistema enviaba.

Para los topes de buzón, la comprobación válida no es leer el campo. Es contar de qué dominio
salieron los correos del día siguiente.
