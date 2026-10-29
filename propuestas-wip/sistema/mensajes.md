# Al Milímetro · mensajes automáticos (WhatsApp y email)

Borrador del 29-oct-2026 para revisar con Maikel. **Nada se envía ni se activa sin su OK.**
Tono: el de la landing y los anuncios. Habla Sonia en primera persona, de tú, cercana, sin tecnicismos ni agobios («te escribo», nunca «te llamamos»).

[C] = dato confirmado por Sonia · [E] = estimación o propuesta nuestra · [A CONFIRMAR] = no se usa hasta que ella lo diga.

## Reglas de envío

- **Horario de envío** [C]: de lunes a jueves de 9:00 a 19:00 y los viernes de 9:00 a 15:00, hora de Madrid. Fuera de ese horario solo sale el WhatsApp de «fuera de horario» y el email 1; todo lo demás espera a la siguiente franja (máximo a las 9:00 del siguiente día laborable).
- **Se para todo en cuanto la persona contesta** por WhatsApp o email, o cuando Sonia mueve el contacto de etapa. Desde ahí sigue ella.
- **Nunca más de 2 mensajes seguidos sin respuesta** por el mismo canal.
- **Los descartados no entran en la base de datos** [C, 23-oct]: reciben un único mensaje de «no es lo nuestro» y nada más.
- **Sin casos de clientes**, ni con nombre ni anónimos. **Sin cifras que no sean suyas**. Fotos de obras solo cuando Sonia confirme que son suyas.
- **WhatsApp:** salen desde el número nuevo del negocio. Los mensajes que inicia el negocio son **plantillas** que Meta tiene que aprobar antes de usarlas; la categoría (utilidad o marketing) la decide Meta al aprobarlas y cambia el precio por mensaje [E]. Las variables van como `{{1}}`, `{{2}}`… En la tabla de cada plantilla está qué es cada una.
- **Emails:** salen desde una dirección del dominio de Sonia (por ejemplo, sonia@almilimetroreformas.com [A CONFIRMAR]), con su firma y la opción de darse de baja.

## Mapa del recorrido

| Momento | Canal | Mensaje | Para quién |
| --- | --- | --- | --- |
| Al minuto del formulario, en horario | WhatsApp | W1 · Primer WhatsApp | A y B |
| Al minuto del formulario, fuera de horario | WhatsApp | W2 · Fuera de horario | A y B |
| Al minuto, si está por debajo de 15.000 € o es dudoso | WhatsApp | W3 · Segundas preguntas | Revisión |
| Al minuto, si no encaja | WhatsApp | W4 · No es lo nuestro | Descartados |
| Al minuto | Email | E1 · Lo que pasa ahora | A, B y C |
| A las 2 h sin respuesta (en horario) | Llamada | Asistente de voz (B) o aviso para que llame Sonia (A) | A y B |
| Día 1 sin respuesta | WhatsApp | W5 · Día 1 | A y B |
| Día 3 sin respuesta | WhatsApp | W6 · Día 3 | A y B |
| Día 3 | Email | E2 · Lo que reviso antes de presupuestar | A, B y C |
| Día 7 | Email | E3 · Cómo comparar presupuestos | A, B y C |
| Día 14 | Email | E4 · ¿Seguimos? | B y C |
| Al reservar la visita | WhatsApp | W7 · Confirmación de la visita | Con visita |
| Víspera de la visita (en horario) | WhatsApp | W8 · Recordatorio | Con visita |
| Presupuesto + 2 días | WhatsApp | W9 · ¿Lo repasamos? | Presupuesto enviado |
| Presupuesto + 7 días | WhatsApp | W10 · Cómo comparar | Presupuesto enviado |
| Presupuesto + 14 días | WhatsApp | W11 · ¿Algo que ajustar? | Presupuesto enviado |
| Presupuesto + 21 días | WhatsApp | W12 · Cierre amable | Presupuesto enviado |
| Cada 2 semanas durante 3 meses | Email | Nutrición (por escribir) | C |

Contactos C: solo emails (E1 a E4 y después uno cada 2 semanas); a los 3 meses, una pregunta por WhatsApp para ver si se reactivan [E].

---

## WhatsApp

### W1 · Primer WhatsApp (al minuto, en horario)

Plantilla `am_primer_contacto` · categoría probable: utilidad [E]

> Hola {{1}}, soy Sonia, arquitecta de Al Milímetro. He recibido tu petición para reformar {{2}} en {{3}}. Para darte una cifra más ajustada, ¿te viene bien que hablemos 10 minutos hoy o mañana? Si me mandas un par de fotos o el plano, mejor todavía.

| Variable | Qué es | Ejemplo |
| --- | --- | --- |
| {{1}} | Nombre | Laura |
| {{2}} | Tipo de obra, en minúscula | tu piso / tu chalet / la cocina y el baño |
| {{3}} | Municipio o barrio | Chamberí |

Botones rápidos: «Hoy me viene bien» · «Mejor mañana». La respuesta avisa a Sonia.

### W2 · Fuera de horario

Plantilla `am_fuera_horario` · categoría probable: utilidad [E]

> Hola {{1}}, soy Sonia, de Al Milímetro. Me ha llegado tu petición para reformar {{2}}, gracias. Ahora estoy fuera de horario: te escribo {{3}} para que lo hablemos con calma. Si mientras tanto quieres mandarme fotos o el plano, me vienen genial.

{{3}}: «mañana por la mañana» (lunes a jueves) o «el lunes por la mañana» (viernes desde las 15:00 y fin de semana).

### W3 · Segundas preguntas (menos de 15.000 € o caso dudoso)

Plantilla `am_segundas_preguntas` · categoría probable: utilidad [E]

> Hola {{1}}, soy Sonia, de Al Milímetro. Gracias por contarme tu proyecto. Para saber si te puedo ayudar bien, ¿me cuentas en una frase qué te gustaría cambiar? Si me mandas 2 o 3 fotos, mejor.

Si ya contestó las segundas preguntas en la página, este mensaje no sale y el caso va directo a Sonia.

### W4 · «Esto no es lo nuestro»

Plantilla `am_no_encaja` · categoría probable: utilidad [E]

> Hola {{1}}, gracias por confiar en nosotros. Te soy sincera: me dedico a reformas completas de viviendas, y para lo que necesitas no te voy a poder dar el mejor precio. Te recomiendo que hables con un albañil o un oficial de confianza de tu zona: te va a salir mejor. ¡Mucha suerte con tu casa!

Sale una sola vez. El contacto no se guarda.

### W5 · Día 1 sin respuesta

Plantilla `am_dia1` · categoría probable: marketing [E]

**Versión mientras no haya fotos suyas confirmadas:**

> {{1}}, ¿pudiste ver mi mensaje de ayer? Cuando te venga bien, lo hablamos en 10 minutos y, si encaja, voy a ver tu casa esta semana. Sin compromiso.

**Versión con fotos suyas** [A CONFIRMAR que las fotos son suyas]:

> {{1}}, te dejo una reforma parecida a la tuya que hice hace poco. Si te apetece, lo hablamos y voy a ver tu casa esta semana. (+ foto del antes y el después)

### W6 · Día 3 sin respuesta

Plantilla `am_dia3` · categoría probable: marketing [E]

> ¿Sigues con la idea de reformar en los próximos meses, {{1}}? Si ahora no es el momento, dímelo sin problema y te escribo más adelante.

Botones rápidos: «Sí, hablamos» · «Más adelante». «Más adelante» pasa el contacto a C.

### W7 · Confirmación de la visita (al reservar)

Plantilla `am_visita_confirmada` · categoría probable: utilidad [E]

> ¡Perfecto, {{1}}! Nos vemos el {{2}} a las {{3}} en {{4}}. Si puedes, ten a mano planos o fotos de cómo está ahora y alguna idea de lo que te gusta. Cualquier cambio, me escribes por aquí.

{{2}} día («jueves 12»), {{3}} hora («10:00»), {{4}} dirección corta («tu casa de Majadahonda»).

### W8 · Recordatorio la víspera

Plantilla `am_visita_recordatorio` · categoría probable: utilidad [E]

> Hola {{1}}, te recuerdo que mañana a las {{2}} paso a ver tu casa. ¿Sigue en pie?

Botones rápidos: «Sí, te espero» · «Necesito cambiarla». «Necesito cambiarla» avisa a Sonia.

### W9 · Presupuesto + 2 días

Plantilla `am_ppto_d2` · categoría probable: marketing [E]

> {{1}}, ¿has podido ver el presupuesto? Si quieres, lo repasamos en 10 minutos y te resuelvo cualquier duda de partidas o plazos.

### W10 · Presupuesto + 7 días

Plantilla `am_ppto_d7` · categoría probable: marketing [E]

> Si estás comparando con otros presupuestos, {{1}}, te paso las 3 cosas que yo miraría: que venga por partidas, que tenga fechas y qué pasa si algo cambia en obra. Así comparas igual con igual.

[A CONFIRMAR] Si Sonia confirma que «la oferta tiene una validez de 15 días» (lo dice en su Instagram), este es el sitio para recordarlo con suavidad.

### W11 · Presupuesto + 14 días

Plantilla `am_ppto_d14` · categoría probable: marketing [E]

> ¿Hay algo del presupuesto (el plazo, alguna partida, la forma de pago) que podamos ajustar para que te encaje, {{1}}?

### W12 · Presupuesto + 21 días

Plantilla `am_ppto_d21` · categoría probable: marketing [E]

> {{1}}, no te escribo más para no agobiarte. Si más adelante retomas la idea, aquí estoy.

Después de W12, el contacto pasa a «perdido» con el motivo que apunte Sonia.

### Avisos a Sonia (a su WhatsApp personal)

- **Contacto A nuevo** (al momento, en horario): «Nuevo contacto A: {{nombre}}, {{tipo}} en {{zona}}, {{metros}} m², quiere empezar {{cuándo}}. Llámale hoy. Ficha: {{enlace al panel}}».
- **Alguien ha contestado** (W1-W12): «{{nombre}} te ha contestado por WhatsApp: "{{primeras palabras}}"».
- **Resumen diario** (lunes a viernes a las 9:00 [E]): «Buenos días, Sonia. Ayer entraron {{n}} contactos ({{a}} A, {{b}} B). Hoy tienes {{v}} visitas y {{p}} presupuestos por enviar.»

---

## Emails

Remite: Sonia · Al Milímetro. Pie: dirección del negocio [A CONFIRMAR], enlace a la web y «Si no quieres recibir más correos, pulsa aquí».

### E1 · Al minuto · «Lo que pasa ahora con tu reforma»

> Hola {{nombre}}:
>
> Gracias por contarme tu proyecto. Te explico cómo trabajo para que sepas qué esperar.
>
> Primero voy a ver tu casa, mido y escucho lo que quieres. Reviso también lo que no se ve (instalaciones, bajantes, suelo), que es lo que suele disparar una reforma a mitad de obra.
>
> A los 7 días de la visita tienes el presupuesto por partidas, con materiales y plazo. Si decides seguir, coordino toda la obra: hablas solo conmigo, de la primera visita a la entrega.
>
> Si quieres reservar ya la visita, contesta a este correo o escríbeme por WhatsApp al {{número del negocio}}.
>
> Sonia · Al Milímetro
> Tu reforma, sin agobios

### E2 · Día 3 · «Lo que reviso antes de darte un precio»

> Hola {{nombre}}:
>
> El presupuesto que entra bajo y luego sube casi siempre falla en lo que no se ve. Antes de darte una cifra, miro cuatro cosas:
>
> - **La luz y el agua:** el cuadro, el cableado y las tuberías.
> - **Las bajantes:** en pisos antiguos son la sorpresa más cara.
> - **El suelo:** si se puede poner encima o hay que levantar.
> - **Las ventanas:** si conviene cambiarlas, te lo digo ahora y no cuando ya está pintado.
>
> Si algo de esto hay que hacerlo, va en el presupuesto desde el principio. Así el precio no cambia a mitad de obra.
>
> Sonia

### E3 · Día 7 · «Cómo comparar presupuestos sin equivocarte»

> Hola {{nombre}}:
>
> Si estás pidiendo varios presupuestos, dos con el mismo total pueden ser obras muy distintas. Yo miraría tres cosas:
>
> 1. **Que venga por partidas.** Cada trabajo con su precio y su material. Un total sin desglose no se puede comparar.
> 2. **Que tenga fechas.** Cuándo empieza, cuánto dura y qué pasa si se retrasa.
> 3. **Qué pasa si algo cambia.** Cómo se valora un cambio en obra y si se aprueba por escrito antes de hacerlo.
>
> Aunque al final no lo hagas conmigo, con esto vas a elegir mejor.
>
> Sonia

### E4 · Día 14 · «¿Seguimos con tu reforma?»

> Hola {{nombre}}:
>
> Hace un par de semanas me contaste que querías reformar {{tipo}} en {{zona}}. ¿Sigue en pie la idea?
>
> Si te viene bien, voy a verla esta semana o la que viene y en 7 días tienes el presupuesto por partidas. Y si ahora no es el momento, no pasa nada: contéstame «más adelante» y te escribo dentro de unos meses.
>
> Sonia

---

## Pendiente de confirmar con Sonia (viernes 30)

- La dirección de email que firma los correos y la dirección postal del pie.
- Si podemos usar «la oferta tiene una validez de 15 días» (W10) y «remates pautados por contrato».
- Qué fotos de su Instagram son suyas, para la versión con fotos de W5.
- La hora del resumen diario (propuesta: 9:00).

## Pendiente técnico

- Dar de alta el número nuevo en la API de WhatsApp y verificar el negocio en Meta (ver el guion del portfolio).
- Enviar las 12 plantillas a Meta para su aprobación (entre unas horas y un par de días).
- Verificar el dominio de Sonia para los emails (registros SPF y DKIM).
