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

- **Siempre un recordatorio el mismo día, a las 9:00, a todos los que tienen
  cita ese día** (Maikel, 21-sep: «yo los haría a todos el mismo día a las 9»),
  con la hora, el enlace de la videollamada (https://meet.google.com/gom-euxm-btb)
  y **qué vamos a ver** (Maikel, 21-sep: «recuerda que tienes tu cita a tal
  hora, aquí tienes el enlace de Meet, esto es lo que veremos»). Sale por el
  canal donde esté la conversación del lead (647 → WhatsApp oficial; gateway →
  pasarela; sin hilo de WhatsApp → correo y WhatsApp por la pasarela). Las citas
  que se agenden después de las 9:00 para ese mismo día no llevan recordatorio
  aparte: la confirmación ya lleva el enlace. Texto base: «Hola X, soy Maikel.
  Te recuerdo que hoy a las HH:MM tenemos la videollamada de 15 minutos. Entra
  por aquí: [enlace]. Vamos a ver cómo va hoy tu sistema desde que alguien pide
  información hasta que compra, dónde se pierde y qué automatizamos primero.
  Sales con un plan escrito. Si te surge algo, dímelo por aquí y lo movemos.»
- **Si la cita se agendó con dos o más días de antelación**, además un
  recordatorio la víspera (18:30) que pide confirmación en una línea («¿sigue en
  pie?»). Si no confirma, Raquel llama por la mañana antes de la hora.
- Si el lead cree que es una llamada telefónica (lo cerró Raquel), el
  recordatorio lo aclara: videollamada con enlace, y si prefiere teléfono,
  Maikel le llama al móvil.
- Antes de enviar se lee el hilo: si ese día ya ha salido el enlace o un
  recordatorio (Maikel a mano, la confirmación de la reserva), no se repite.
  Cada recordatorio se anota en la ficha de GHL.
- **En código desde el 21-sep**: `api/recordatorios.js` (cron a las 9:00 y a
  las 18:30 de Madrid; etiquetas `rec-dia-AAAAMMDD` y `rec-visp-AAAAMMDD` para
  no duplicar). El agente de operaciones solo comprueba que han salido.

## 3. Cadencia del lead nuevo (resumen; el detalle está en api/activacion.js)

Entra → WhatsApp corto en dos minutos → si responde, el agente de WhatsApp
conversa para agendar (máximo tres mensajes) → si no responde en veinte minutos
dentro de horario, llamada de Raquel → si no coge, segundo WhatsApp con el enlace
de su vertical → tarde: segunda llamada (cuatro horas después de la primera) →
día 2: WhatsApp + llamada → día 3: correo y a «Seguimiento» con fecha.
Regla de Maikel (19-sep): si el lead contesta al WhatsApp, no se le llama.
Regla de Maikel (21-sep): los que no invierten también se llaman.
Regla de Maikel (21-sep): al que no ha respondido el día anterior se le vuelve
a seguir (WhatsApp y llamada, que es el día 2 de la cadencia).

## 3b. Conversaciones que se quedan paradas (Maikel, 21-sep)

«Los que han contestado pero se ha quedado ahí la cosa: contestar siempre en su
contexto, que el sistema intente generar cita sin ser invasivo ni pesado, y si
tras varios intentos no hay manera, se descarta.»

- Entra quien contestó (etiqueta `act-respondio`), el último mensaje del hilo
  es nuestro, no tiene cita y Maikel no lleva el hilo (`wa-humano`, o el
  último mensaje lo escribió él).
- **Tres intentos como mucho**, escritos por el agente de WhatsApp leyendo toda
  la conversación (nunca plantilla, nunca «¿lo has visto?»): el primero un día
  después de nuestro último mensaje (retoma donde se quedó; dos huecos si ya
  está claro qué le pasa), el segundo tres días después (aporta algo nuevo y
  cierra con una pregunta fácil), el tercero cinco días después (despedida en
  una frase, sin pedir nada).
- Cinco días después del tercero sin respuesta: **descartado** (etiqueta
  `act-descartado`, trato a perdido, nota y aviso). Si más adelante contesta,
  el agente le atiende igual.
- Ritmo: uno por vuelta del reloj (cada diez minutos), entre semana, de 9:30 a
  13:30 y de 16:00 a 19:30, nunca en punto. Cada uno deja nota en GHL y aviso a
  Maikel.
- En código: `api/_reenganche.js`, lo llama `api/activacion.js`. Etiquetas
  `reeng-1`, `reeng-2`, `reeng-3`.

## 3c. No presentados (Maikel, 22-sep)

Etapa «No presentado» en el pipeline de GHL (id d04755f9-…). Entra quien tenía
cita y no se conectó, y también quien la canceló el mismo día. Sirve para
contarlos y para trabajarlos, no para archivarlos.

- **Mismo día, a los 10 minutos**: una línea por el canal de su hilo («no te he
  visto, imagino que se te ha complicado, ¿lo movemos?») con dos huecos
  concretos; si no contesta en 10 minutos, llamada de Raquel. Etiqueta
  `no-presentado`, nota con el motivo (no se conectó / canceló el mismo día).
- **Día 2**: segundo toque con contexto (el agente, o Maikel si el hilo es
  suyo). **Día 5**: tercero y último, sin pedir nada. Si reserva, vuelve a
  «Reunión agendada». Si no, a «Más adelante» con motivo.
- Cada viernes el cuadro de mando cuenta los no presentados de la semana y su
  destino (reagendó / más adelante / perdido).

## 4. Lo que nunca sale sin Maikel

Precio, descuentos, el piloto en abierto, cualquier mensaje a un cliente actual,
y publicar en redes.
