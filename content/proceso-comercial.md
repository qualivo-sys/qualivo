# Proceso comercial de Qualivo · reglas de operación (v0, 21-sep-2026)

Documento vivo. Lo mantiene el agente de operaciones. Cada regla lleva fecha y
quién la fijó. Lo que no está aquí no se hace por defecto.

## 1. Antes de escribir a cualquier persona (Maikel, 21-sep)

- **Leer la conversación entera** (WhatsApp 647, gateway 663, correo y notas de
  GHL) antes de redactar. Si ya se le ha dicho algo, no se repite; si Maikel ha
  escrito en ese hilo en las últimas 24 h, el agente no entra salvo que Maikel
  se lo pase.
- Mensajes cortos, una sola pregunta, sin párrafos. Nunca dos mensajes seguidos
  sin respuesta. Nunca más de un mensaje cada cuatro horas al mismo lead.
- Nada que parezca automatizado desde el 663: nunca más de 30 al día, nunca más
  de 5 seguidos, nunca a la misma hora en punto. Cada respuesta se contesta a
  mano o por el agente de WhatsApp, sin plantilla.

## 2. Recordatorios de cita (Maikel, 21-sep)

- **Siempre un recordatorio el mismo día**, entre 45 y 75 minutos antes, con el
  enlace de la videollamada (https://meet.google.com/gom-euxm-btb), por el canal
  donde esté la conversación del lead (647 → type WhatsApp; gateway → type SMS;
  sin WhatsApp → correo). Texto base: «Hola X, soy Maikel. Te recuerdo que hoy a
  las HH:MM tenemos la videollamada de 15 minutos. Entra por aquí: [enlace]. Si
  te surge algo, dímelo por aquí y lo movemos.»
- **Si la cita se agendó con dos o más días de antelación**, además un
  recordatorio la víspera (18:00-19:00) que pide confirmación en una línea
  («¿sigue en pie mañana a las HH:MM?»). Si no confirma, Raquel llama por la
  mañana antes de la hora.
- Si el lead cree que es una llamada telefónica (lo dijo Raquel o lo entendió
  así), el recordatorio lo aclara: videollamada con enlace, y si prefiere
  teléfono, Maikel le llama al móvil.
- Antes de enviar, leer el hilo: si Maikel ya ha mandado el enlace ese día, no
  se repite. Cada recordatorio se anota en la ficha de GHL.
- Pendiente de implementar en código (`api/activacion.js`): recordatorio del
  mismo día automático (T−60 min) y recordatorio de víspera cuando
  `cita − agendado ≥ 2 días`, con etiquetas `recordatorio-dia` y
  `recordatorio-vispera` para no duplicar. Hasta entonces, lo hace el agente de
  operaciones a mano con recordatorios programados.

## 3. Cadencia del lead nuevo (resumen; el detalle está en api/activacion.js)

Entra → WhatsApp corto en dos minutos → si responde, el agente de WhatsApp
conversa para agendar (máximo tres mensajes) → si no responde en veinte minutos
dentro de horario, llamada de Raquel → si no coge, segundo WhatsApp con el enlace
de su vertical → tarde: segunda llamada (cuatro horas después de la primera) →
día 2: WhatsApp + llamada → día 3: correo y a «Seguimiento» con fecha.
Regla de Maikel (19-sep): si el lead contesta al WhatsApp, no se le llama.
Regla de Maikel (21-sep): los que no invierten también se llaman.

## 4. Lo que nunca sale sin Maikel

Precio, descuentos, el piloto en abierto, cualquier mensaje a un cliente actual,
y publicar en redes.
