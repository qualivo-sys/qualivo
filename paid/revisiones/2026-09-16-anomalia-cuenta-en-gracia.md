# ANOMALÍA · La cuenta está en periodo de gracia por impago · 16-sep-2026, 06:29 CEST

```
AGENTE    qualivo.paid
QUÉ PASA  QV_CRM_VIDEO_Sep26 lleva 7 h encendida y ha entregado CERO
CAUSA     act_3453332464718877 · account_status = 9 · IN_GRACE_PERIOD
           balance pendiente de cobro: 37,43 €
COLOR     🔴 no lo puede arreglar el agente · es un pago
```

## 1 · Lo que se ve

```
campaña activada      15-sep 23:39 CEST
gasto                 0,00 €
impresiones           0
budget_remaining      2000  (los 20 € intactos)
```

Las tres capas en `ACTIVE / ACTIVE`, sin avisos ni rechazos.

## 2 · Lo que NO es

Descartado uno a uno por API, para no perseguir fantasmas:

| Sospechoso | Comprobación | Resultado |
|---|---|---|
| Anuncio rechazado | `effective_status`, `ad_review_feedback` | ACTIVE, sin feedback |
| Vídeo sin procesar | `/1279317837579988` | `ready`, publicado |
| Creativo roto | `effective_object_story_id` | existe: `359073050620335_122201227676382483` |
| Formulario caído | `/1006694072388659` | ACTIVE, es_ES, página correcta |
| Público inalcanzable | `/delivery_estimate` del conjunto | 2.400.000 – 2.800.000 · `estimate_ready: true` |
| Fecha de inicio futura | `start_time` | 15-sep 23:20, pasada |
| Presupuesto mal puesto | `daily_budget` vs `min_daily_budget` | 2.000 frente a 87 céntimos de mínimo |

**La campaña está bien montada. El problema no está en la campaña.**

## 3 · Lo que sí es

```
account_status  = 9   →  IN_GRACE_PERIOD
disable_reason  = 0
balance         = 37,43 €  pendiente de cobro
método de pago  = VISA *2097
```

Leído dos veces seguidas para descartar un valor transitorio. Los 37,43 € son, casi con seguridad,
los 37,07 € de `QV_DIAG_LEADFORM_Sep26` que se apagó ayer.

### Y cambió esta madrugada

| Hora | `account_status` |
|---|---|
| 15-sep 01:29 CEST | **1 · ACTIVE** |
| 16-sep 06:29 CEST | **9 · IN_GRACE_PERIOD** |

Anoche, cuando dije que la cuenta estaba sana, lo estaba: esa lectura devolvió 1. **Entre las 01:29
y las 06:29 Meta intentó cobrar, no pudo, y puso la cuenta en periodo de gracia.** Es el patrón
típico de un cobro por umbral que rebota.

### Honestidad sobre la causalidad

El periodo de gracia explica la ventana de 01:29 a 06:29. **No explica las dos primeras horas**, de
23:39 a 01:29, en las que la cuenta aún estaba activa y tampoco entregó nada. Esa ventana se explica
sola: madrugada, conjunto nuevo sin historial y público estrecho.

Lo que no se puede afirmar es que el impago sea la causa *única*. Lo que sí: **mientras la cuenta
siga en 9, no va a entregar**, así que hay que resolver el pago antes de sacar ninguna conclusión
sobre la campaña, la creatividad o los intereses.

## 4 · Qué hago y qué no

- **No pauso.** La barandilla dice que se frena lo que sangra, y esto no sangra: gasta cero. Pausar
  no arregla nada y perdería el arranque cuando se resuelva el pago.
- **No toco el pago.** No es mío y no tengo acceso.
- **No cambio nada de la campaña.** Está correcta; tocarla ahora sería perseguir un fallo que no
  existe y perder la lectura limpia.

## 5 · Lo que tiene que hacer Maikel

1. Entrar en **Administrador de anuncios → Facturación** y pagar los **37,43 €** pendientes, o
   actualizar la VISA *2097 si ha caducado o la ha rechazado el banco.
2. Avisarme cuando esté. Compruebo que `account_status` vuelve a 1 y que arranca la entrega.

**El reloj del experimento no empieza hasta que entregue.** La fecha de muerte se recalcula desde el
primer día con entrega real, no desde el 15-sep.

Y el token de Meta sigue sin rotar. Octavo día.
