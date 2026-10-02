# LinkedIn · copy v2 conversacional (2-sep, pendiente de ok)

Feedback de Maikel (2-sep): lo que había sonaba a IA, poco conversacional.
Criterios de la v2, que quedan como regla para todo LinkedIn futuro:
- La nota de conexión no vende. Una o dos frases de las que se escriben
  con el pulgar. La razón real de conectar, dicha en corto.
- Mensaje 1: una sola observación + una pregunta que se contesta en una
  línea. Sin enlaces, sin emojis, sin calendario.
- Mensaje 2: una línea de salida elegante. El calendario solo si el otro
  muestra interés, en conversación, no en secuencia.
- Se permite empezar con "Oye", "Nada,", "Te lo pregunto porque". Se
  prohíbe "Trabajo en cómo...", "Ayudo a empresas a...", "mi hipótesis".

## SDR Growth (572444)

### Ignacio · AEI24 (ya aceptó; esto es lo que le saldría)
- msg1: "Gracias por aceptar. Oye, el otro día estuve en vuestra web y me
  fijé en una cosa rara: no tiene medición de ningún tipo, ni Analytics ni
  nada. ¿Eso es a propósito o se quedó así? Te lo pregunto porque vendiendo
  fuera, saber de qué país te están mirando vale oro."
- msg2: "Nada, no te doy más la lata con esto. Si algún día quieres que le
  eche un ojo a lo de la web, me dices."

### Rafael · Cargo Flores (conexión enviada, sin aceptar; si acepta:)
- msg1: "Gracias Rafael. Una cosa que vi en vuestra web y me quedé con
  ganas de preguntarte: todo lo que entra acaba en info@. ¿Quién abre ese
  buzón? En empresas creciendo como la vuestra ahí se suele perder alguna
  venta sin que nadie se entere."
- msg2: "Te dejo tranquilo. Si un día quieres saber cómo lo resuelven
  otros operadores, silba."

## LI Líneas de servicio (557348) · genérico
- nota: "Hola, te mandé un email hace unos días con una cosa que vi de
  vuestro despacho. Por aquí se habla mejor que por correo. ¿Conectamos?"
- msg1: "Gracias por aceptar. Te lo resumo en una frase: cuando un
  despacho lleva fiscal, laboral y contable a la vez, casi nunca sabe cuál
  de las tres le trae los clientes nuevos. Se puede mirar, y os lo preparo
  por escrito sin coste. ¿Te interesa o te pillo en mal momento?"
- msg2: "¿Lo viste? Si no es el momento me lo dices y listo, sin dramas."

## Cola aprobada (567062) y Señales (562752) · genérico
- nota: "Hola, ando todo el día metido en embudos de venta de empresas B2B
  y me gusta seguir a gente que está en el ajo. ¿Conectamos?"
- msg1: "Gracias por aceptar. Mi tema es este: casi todas las empresas con
  las que hablo saben cuántos clientes cierran, pero no de dónde salió el
  primer contacto de cada uno. Si en tu casa eso está resuelto, enhorabuena
  de verdad. Si no, es más fácil de arreglar de lo que parece."
- msg2: "No insisto más. Si algún día te cuadra comentarlo, aquí me tienes."
  (Fuera el "sé que agosto es agosto": estamos en septiembre.)

## Fugues Andorra i Lleida (569555) · catalán
BLOQUEADA hasta revisión nativa (regla pendiente). Borrador v2:
- nota: "Hola, vaig estar mirant la vostra web i em va picar la curiositat
  per un parell de coses. M'agradaria connectar."
- msg1: "Gràcies per acceptar. T'ho dic ràpid: em va semblar que a la
  vostra web hi entra més gent de la que acaba deixant les dades. Si vols
  t'explico què vaig veure. I si no, cap problema."

## Despliegue cuando Maikel dé el ok
1. Actualizar {nota}/{msg1} de los leads aún sin tocar y los fallbacks de
   las secuencias (campaign/UpdateSequence SOLO en campañas pausadas, nunca
   con leads a mitad de mensaje).
2. Reanudar con campaign/Resume únicamente las que Maikel diga.
3. Los leads que ya recibieron la nota vieja siguen su curso con la v2 en
   los mensajes que les falten.
