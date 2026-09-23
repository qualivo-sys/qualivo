# SDR de respuestas · copiloto (v1, 9 sep 2026)

> ## ⛔ EL PASO 2 NUNCA HA FUNCIONADO (comprobado el 23-sep)
>
> El router de n8n tiene **cuatro ejecuciones en toda su vida, las cuatro con
> error**, la última el 16-sep. El nodo "Avisar agente smartlead-reply" recibe
> siempre un **401 unauthorized** de `api.anthropic.com`.
>
> No es un fallo de configuración que se arregle pegando una URL nueva. El
> webhook de sesión (`watch_url`) devuelve la URL **y una credencial sellada**,
> y esa credencial dice literalmente que solo la puede abrir el servicio de
> artefactos y **no es utilizable fuera de la conversación**. n8n no puede
> firmar esas peticiones, así que no puede autenticarse contra ese extremo.
> La arquitectura del paso 2 está montada sobre un mecanismo que no admite un
> tercero.
>
> **Lo que sí funciona y es lo que ha estado sosteniendo el canal:** el barrido
> horario (`trig_01WicDvQNMvVT7YqUJCaUMj8`). Ha encontrado todas las respuestas
> de esta semana, incluida la de Dataslayer del 22-sep. Una hora de latencia
> cumple de sobra la regla de responder en menos de dos horas.
>
> Nadie se dio cuenta antes porque el workflow falla en silencio: n8n registra
> el error y Smartlead da la entrega por buena. Conviene revisar el historial de
> ejecuciones de cualquier workflow que se dé por vivo, no solo que esté ACTIVO.
>
> **Decisión pendiente de Maikel y Automatización:** o se busca un extremo que
> n8n sí pueda autenticar, o se asume el barrido horario como el mecanismo
> bueno y se retira el paso 2 en vez de dejarlo fallando.

Agente que responde en tiempo casi real a (a) respuestas de campañas Smartlead
y (b) radiografías completadas, con el objetivo de llevar al lead a una reunión
de 15-20 min o a un plan por escrito. Regla madre del cerebro: no se pide
reunión, se le pone número a la fuga.

## Arquitectura

1. **Smartlead → n8n**: webhook `EMAIL_REPLY` registrado en las 23 campañas
   activas (todas las categorías) apuntando a
   `https://qualivo.app.n8n.cloud/webhook/sdr-respuestas`.
2. **n8n router** (workflow `UNBIjWqJl9cYVtal`, "SDR · Router de respuestas y
   radiografías", ACTIVO): reenvía el payload al webhook de la sesión del
   agente Outbound (watch_url, guardado en scratchpad `.sdr_watch_url`).
   Segunda entrada `https://qualivo.app.n8n.cloud/webhook/radiografia-dia1`
   lista para que el workflow de GHL de Landing la llame al completarse una
   radiografía.
3. **El agente (esta sesión)** se despierta con el payload: lee el hilo
   completo (message-history de Smartlead), la ficha del lead, el probe de su
   web y el Outbound Brain, y redacta el borrador en el estilo validado de
   Maikel (natural, análisis gratis primero, dos salidas: 20 min o por
   escrito; precios solo si preguntan: 1.200 € de implementación y 750 €/mes,
   y si el primer mes no genera citas cualificadas no se cobra).
4. **Copiloto**: el borrador se presenta a Maikel en el chat. Con su ok se
   envía con `POST campaigns/{cid}/reply-email-thread` (mismo buzón, mismo
   hilo). Registro en GHL: oportunidad "Conversación abierta" + nota con el
   texto literal + tarea a 3 días (igual que el triaje diario).
5. **Fase autónoma** (cuando Maikel la active por tipo de respuesta): los
   tipos aprobados salen solos; precio, cabreo, cliente actual o "quiero
   hablar con Maikel" van SIEMPRE a Maikel con mini-brief.

## Si se reinicia el contenedor

El watch_url muere con la sesión. Re-armar: `watch_url` → guardar la URL nueva
en `.sdr_watch_url` → actualizar el nodo HTTP del workflow n8n `UNBIjWqJl9cYVtal`
(los webhooks de Smartlead no se tocan: apuntan a n8n, que es estable).

## Pendiente

- Lado Landing del `radiografia-dia1` (workflow GHL con etiqueta
  `diagnostico-completo` → POST a la URL de arriba con contacto + cuello +
  puntuación).
- WhatsApp día 1: esperando alta del add-on de WhatsApp en GHL (decisión de
  Maikel) y número dedicado.
- Autorización por tipos de respuesta (regla "plantilla aprobada una vez").

## Correos que salen por Gmail: SIEMPRE en HTML

Comprobado el 23-sep enviando una prueba y leyendo el mensaje guardado.

Si el cuerpo va en **texto plano con URLs desnudas**, Gmail las reescribe al
enviar y el destinatario recibe esto **como texto visible**:

```
(https://www.google.com/url?q=https://qualivo.io/casos/eac/&source=gmail&ust=1790187053081000&sa=E)
```

No es un efecto de como lo ve el remitente: esta dentro del mensaje enviado,
en la parte de texto y en la de HTML. Parece spam o rastreo y en un correo frio
se carga la credibilidad de golpe. Les paso a Remi Roman y a Loli Murillo el
22-sep, que eran dos referencias que habia costado conseguir.

Con **HTML y etiqueta `<a href>`** Gmail sigue metiendo su redirector en el
enlace interno (eso lo hace con todo correo enviado desde Gmail y no se ve),
pero el texto visible queda limpio:

```
Prueba 1, enlace con texto: qualivo.io/casos/eac
Prueba 2, enlace desnudo:   https://qualivo.io/casos/nuria-roure/
Prueba 3, dominio:          qualivo.io
```

Regla: en `send_message` de Gmail se usa `htmlBody`, nunca `body` con URLs
sueltas. No afecta a Smartlead, que no pasa por Gmail.
