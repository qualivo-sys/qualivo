# Aula · bucle del webhook de pedidos (16 y 17-nov)

Workflow de n8n «Aula · Pedidos de la web → Pago iniciado / Matrícula en CRM» (`7M0xJDao9TQApXL2`).

## Qué pasó [C]

- Del 16-nov a las 12:05 al 17-nov a las 08:51 (hora de Madrid), WooCommerce mandó el mismo pedido (40322, 390 €) cada ~7 s.
- Cada envío fallaba en «GHL · mover trato» con un 400 al crear la oportunidad en Matrícula.
- En total hubo 9.908 ejecuciones fallidas.
- El 17-nov a las 08:51 el workflow se modificó y se **desactivó**. No lo hizo Automatización. Desde entonces no hay ejecuciones nuevas.

## Estado del arreglo (leído el 18-nov)

La versión desactivada ya incluye tres cambios:

- **El HTML se quita del nombre del producto** antes de mandarlo a GHL (`replace(/<[^>]*>/g, '')`).
- **Hay deduplicación**: si llega el mismo pedido con el mismo estado, no se procesa otra vez (`staticData.vistos`).
- **Si el contacto ya tiene la matrícula ganada, no se crea otra oportunidad**: GHL no admite duplicados, que es la causa probable del 400 [E].

Queda un cambio sugerido antes de reactivar:

- En el nodo «GHL · mover trato», poner *Settings → On Error → Continue (using error output)* y llevar esa salida a un aviso, sin reintentos. Así un rechazo de GHL no vuelve a marcar error en cada envío.

## Al reactivar

- Mientras el workflow esté apagado, la URL del webhook responde 404. Después de varios fallos seguidos, WooCommerce **desactiva el webhook** solo: hay que comprobar en WooCommerce › Ajustes › Avanzado › Webhooks que sigue «Activo».
- Revisar en WooCommerce los pedidos pagados desde el 17-nov a las 08:51, porque no han entrado en el CRM. Registrarlos a mano o reenviarlos uno a uno después de reactivar.
- Registrar a mano la matrícula del pedido 40322, si no está ya.

## Borrador para el responsable de la web (NO enviado)

> Hola, Raúl:
>
> Entre el 16 y el 17 de noviembre, el webhook «Pedido actualizado» de la tienda envió el pedido 40322 a nuestro sistema unas 10.000 veces, una cada 7 segundos más o menos. Hemos parado la recepción y ya hemos corregido lo nuestro para que un pedido repetido no se procese dos veces.
>
> ¿Puedes mirar qué estaba actualizando ese pedido en bucle? Puede ser un plugin, una tarea programada o una pasarela de pago que reescribe el pedido. Cada actualización dispara el webhook. Si encuentras la causa, dinos cuál era.
>
> Antes de volver a activar la recepción, comprueba también en WooCommerce › Ajustes › Avanzado › Webhooks que el webhook sigue «Activo»: WooCommerce lo desactiva solo tras varios fallos.
>
> Gracias.
