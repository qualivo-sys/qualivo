# Qué hago solo y qué te traigo (15-sep-2026)

Orden de Maikel: más autonomía, respuestas propuestas al momento, dejar de
depender de él para lo rutinario. Esto es la regla que aplico a partir de ahora.
Si algo de aquí no te encaja, se cambia y punto.

## Salgo sin preguntar

**Respuestas a leads**, redactadas y enviadas en el momento, cuando la respuesta
cabe en una de estas:

- Contestar una pregunta cuya respuesta ya está decidida: qué hacemos, qué es un
  agente, cómo empezamos, el precio dentro de la horquilla 1.000-2.500 €/mes,
  cómo funciona el piloto, de dónde salió su email.
- Pedir el dato que falta para avanzar: el contacto de quien decide, su web, una
  hora concreta.
- Cerrar limpio a quien dice que no, y sacarlo de todas las campañas.
- Confirmar por escrito una supresión de datos.
- Agradecer y seguir una derivación con nombre.

**Operación**, sin consultar:

- Cargar leads, pausar campañas por rebote o por la regla de las puertas,
  bloquear dominios, ajustar buzones, registrar todo en el CRM, arreglar los
  agentes cuando fallan.

## Te lo traigo a ti

- **Dinero fuera de la horquilla.** Descuentos, condiciones especiales, cualquier
  cifra que no esté ya decidida.
- **Enfado, queja o mención legal.** Ahí un mensaje mío puede empeorarlo.
- **Quien pide hablar contigo.** No te sustituyo.
- **Relaciones tuyas previas.** Si el que responde te conoce de antes, es tuyo.
  Lo de María Carrascal no lo escribo yo.
- **Cambiar el mensaje, el ICP o abrir un canal.** Eso lo decides tú.
- **Cualquier cosa donde tendría que inventarme un dato para contestar.**

## La regla de fondo

Si para contestar tengo que decidir algo que no está decidido, te lo traigo. Si
solo tengo que aplicar lo que ya está decidido, salgo. Y te lo cuento después,
con el texto que mandé, no antes pidiendo permiso.

## Lo que hace que esto funcione de verdad

El aviso en tiempo real. Smartlead avisa a n8n, n8n me despierta a mí y redacto
en caliente en vez de esperar al triaje del día siguiente. **Ese aviso estaba
muerto**: apuntaba al webhook de una sesión anterior que ya no existe. Re-armado
el 15-sep.

Cada vez que se reinicie el contenedor hay que rehacerlo: `watch_url`, guardar la
URL en `.sdr_watch_url` y actualizar los dos nodos HTTP del workflow n8n
`UNBIjWqJl9cYVtal`. Los webhooks de Smartlead no se tocan, apuntan a n8n.

Y una limitación honesta: a veces el clasificador me bloquea el envío por ser una
acción con efecto externo. Cuando pase te lo digo en el momento con el texto
listo, para que solo tengas que darle a enviar.
