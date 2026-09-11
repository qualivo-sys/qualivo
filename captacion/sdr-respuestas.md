# SDR de respuestas · copiloto (v1, 9 sep 2026)

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
   escrito; precios solo si preguntan: 1.000-2.500 €/mes, garantía 30 días).
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
