# Qué hacer cuando entra un lead A o B

> Playbook de Maikel, del aviso a la firma. v1, 29-sep-2026.
> Sale de `proceso-comercial.md`, `guion-de-venta.md`, `plan-octubre-2026.md`,
> la cadencia de `api/activacion.js` y el simulador del embudo
> (`qualivo.io/intelligence/simulador/`). Donde choque con esos documentos,
> manda lo que diga Maikel; este fichero se ajusta.
>
> Todo lo que va entre `{{ }}` se rellena a mano. Repositorio público: aquí no
> va ningún nombre ni teléfono de lead.

## El recorrido en una tabla

| Cuándo | Qué haces | Canal |
|---|---|---|
| Minuto 0 | Te llega el aviso «LEAD A/B · NO LE HE ESCRITO». Miras la ficha investigada (2 min) | Móvil + correo |
| Antes de 1 h | Primer WhatsApp (plantilla de su sector y su fuga). Si es A, nota de voz de 20 s justo después | WhatsApp |
| +2 h | Si no contesta, le llamas tú | Teléfono |
| D+1 | WhatsApp de conversación, sin enlace. Si es A y no contesta, llamada por la tarde | WhatsApp + teléfono |
| D+3 | WhatsApp con dos huecos y tu agenda | WhatsApp |
| D+7 | Cierre: «¿lo dejamos aquí?» con tres respuestas de una palabra | WhatsApp |
| Al reservar | Dos huecos a menos de 48 h. La confirmación sale sola. Tú mandas las dos preguntas de preparación | WhatsApp |
| Víspera y día | Recordatorios automáticos. Si no confirma la víspera, le llamas por la mañana | Automático + teléfono |
| Hora de la cita +3 min | Si no se ha conectado, le llamas | Teléfono |
| Reunión | Simulador → demo de su etapa más floja → caso → qué incluye → precio → objetivo a 90 días → siguiente paso con fecha | Videollamada |
| Mismo día | Propuesta por escrito y CRM al día | Correo + WhatsApp |
| Después | Seguimiento según el motivo por el que no ha dicho que sí | WhatsApp / correo |

**Reglas que no se saltan** (de `proceso-comercial.md`):
- Lee el hilo entero antes de escribir.
- Mensajes cortos, una sola pregunta.
- Nunca dos mensajes seguidos sin respuesta, ni más de uno cada cuatro horas.
- Nada de «lead», «funnel» ni jerga. Di alumnos, pacientes o clientes.
- Nunca «perdona la tardanza».
- Sin «15 minutos»: la reunión son **unos 30 minutos**.

---

## 0 · Minuto 0: qué te llega y qué miras en 2 minutos

### Qué te llega

- **Aviso al móvil y por correo:** «LEAD A · NO LE HE ESCRITO, espero tu ok»
  (o B). Trae el nombre, la empresa, el teléfono y el **borrador del primer
  WhatsApp** que ha escrito la IA.
- **En el CRM, la ficha investigada:** lo que contestó en el formulario y lo
  que se ha encontrado en internet sobre la empresa (web, anuncios, tamaño,
  quién la lleva).
- **Qué pasa mientras tanto:** nada. El contacto queda con `act-espera-maikel`
  y el reloj no hace nada con él. No sale ni Raquel a las 2 h 30, ni el D+1,
  ni el D+3. **El seguimiento lo llevas tú con este playbook.** Si prefieres
  devolvérselo al sistema, díselo al agente de operaciones. No quites la
  etiqueta a mano.

### Qué miras (2 minutos, en este orden)

1. **Nivel y motivo** (campo «Score · Motivo»). Por qué es A o B: inversión,
   volumen, sector, cuándo quiere empezar, si le encaja el precio.
2. **Sus respuestas:**
   - sector;
   - **dónde se le escapa**: anuncios, web, respuesta, seguimiento o «no lo sé»;
   - peticiones al mes;
   - inversión;
   - cuándo quiere empezar.
3. **La ficha investigada:** una cosa concreta y comprobada de su negocio, si
   la hay. Si no la has comprobado tú en el navegador, no la uses en el mensaje.
4. **El hilo:** si ya le ha escrito alguien, si ha entrado por dos puertas o si
   ya habla contigo por otro lado. Si ya hay conversación, sigues esa y no
   mandas plantilla.
5. **Quién decide:** si la ficha dice que hay socios o un director, apúntalo
   para la llamada.

**Decisión:**
- Si el borrador de la IA te vale, das el ok y sale tal cual.
- Si no te vale, mandas tú el tuyo del punto 1. Es lo normal en A.

Si el aviso llega de noche o en fin de semana, el primer mensaje sale a
primera hora (9:00-9:30). Nada antes de las 9:00 ni después de las 21:00.

---

## 1 · Primer contacto: antes de que pase una hora

Estructura: quién eres → lo que dijo él → lo que suele pasar en su sector →
una pregunta con dos huecos concretos a menos de 48 h (uno de mañana y uno de
tarde).

### Formación

**«No lo sé»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que no sabes dónde se os escapan las matrículas. Es lo normal: casi ninguna academia lo tiene medido. Suele estar en uno de tres sitios: lo que se tarda en contestar a quien pide información, la entrevista o la clase de prueba que no se llega a hacer, o el «ya te digo» al que nadie vuelve a escribir.

En media hora lo miramos con tus números y te digo cuál es el tuyo. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

**«En los anuncios y la captación»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que se os escapa en los anuncios y la captación. En formación casi nunca es el anuncio en sí: es no saber qué anuncio trae matrículas y cuál solo curiosos, y que la solicitud que ya has pagado se enfríe mientras se tarda en contestar.

En media hora lo miramos con tus números y te enseño cómo lo veríamos en tu caso. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

**«En el seguimiento y los presupuestos»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que se os escapa en el seguimiento. Es lo que más vemos en academias: alguien pide información, se le contesta una vez, dice «ya te digo»… y nadie le vuelve a escribir. Son matrículas que ya habías pagado con el anuncio.

En media hora lo miramos con tus números y te enseño cómo lo cerraríamos. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

### Clínica

**«No lo sé»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que no sabes dónde se os escapan los pacientes. Es lo normal: casi ninguna clínica lo tiene medido. Suele estar en uno de tres sitios: lo que se tarda en contestar a quien pide cita, la primera visita que no se llega a cerrar, o el paciente que se lleva el presupuesto a casa, dice «me lo pienso» y nadie le vuelve a llamar.

En media hora lo miramos con tus números y te digo cuál es el tuyo. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

**«En los anuncios y la captación»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que se os escapa en los anuncios y la captación. En clínicas casi nunca es el anuncio en sí: es no saber qué anuncio trae tratamientos aceptados y cuál solo consultas de precio, y que el paciente que ya has pagado se vaya a la clínica que le contesta antes.

En media hora lo miramos con tus números y te enseño cómo lo veríamos en tu caso. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

**«En el seguimiento y los presupuestos»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que se os escapa en el seguimiento y los presupuestos. Es lo que más vemos en clínicas: el paciente se lleva el presupuesto a casa, dice «me lo pienso» y nadie le vuelve a llamar. Ese presupuesto ya estaba hecho y ya lo habías pagado con el anuncio.

En media hora lo miramos con tus números y te enseño cómo lo cerraríamos. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

### Reformas

**«No lo sé»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que no sabes dónde se os escapan las obras. Es lo normal: casi nadie lo tiene medido. Suele estar en uno de tres sitios: lo que se tarda en contestar a quien pide presupuesto, la visita que no se llega a cerrar, o el presupuesto que se envía y al que nadie vuelve a llamar.

En media hora lo miramos con tus números y te digo cuál es el tuyo. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

**«En los anuncios y la captación»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que se os escapa en los anuncios y la captación. En reformas casi nunca es el anuncio en sí: es no saber qué anuncio trae obras firmadas y cuál solo gente mirando precios. Además, quien pide tres presupuestos suele quedarse con la primera empresa que le contesta.

En media hora lo miramos con tus números y te enseño cómo lo veríamos en tu caso. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

**«En el seguimiento y los presupuestos»**
```
Hola {{nombre}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y te escribo yo directamente.

Pusiste que se os escapa en el seguimiento y los presupuestos. Es lo que más vemos en reformas: el presupuesto sale, el cliente dice «me lo pienso» y nadie le vuelve a llamar. Son obras ya medidas que se quedan en el cajón.

En media hora lo miramos con tus números y te enseño cómo lo cerraríamos. ¿Te va bien {{hueco 1}} o {{hueco 2}}?
```

### Si contestó «tiempo de respuesta» o «web y formularios» (landing)

Usa el mensaje de «No lo sé» de su sector y cambia el segundo párrafo por uno
de estos:

- **Tiempo de respuesta:**
  ```
  Pusiste que se os escapa en el tiempo de respuesta. Quien pide {{información / cita / presupuesto}} suele preguntar en varios sitios a la vez y se queda con el primero que le contesta con sentido. De noche y en fin de semana, más.
  ```
- **Web y formularios:**
  ```
  Pusiste que se os escapa en la web y los formularios. Suele ser doble: gente que entra y no deja sus datos, y gente que sí los deja y tarda demasiado en recibir respuesta.
  ```

### Nota de voz de 20 segundos (solo A, justo después del texto)

La grabas de pie, de una sola toma y sin leer. Si citas algo de la ficha
investigada, que sea algo que has visto tú.

```
Hola {{nombre}}, soy Maikel, de Qualivo. Te acabo de escribir, pero prefería que me oyeras. He visto lo que me contaste, que se os escapa en {{su fuga, con sus palabras}}, y he mirado un poco {{empresa}}. Tengo bastante claro por dónde empezaría yo. En media hora te lo enseño con tus números. Dime si te va mejor {{hueco 1}} o {{hueco 2}} y lo dejo cerrado.
```

Si contesta: **respóndele en menos de 5 minutos** y ve directo al punto 3.

---

## 2 · Si no contesta

### +2 h · Llamada tuya

Desde tu móvil. Si es B y no puedes llamar tú, pídele al agente de
operaciones que suelte el contacto para que le llame Raquel.

**Si no coge:**
- Buzón de voz: un mensaje de 10 segundos, como mucho:
  «Soy Maikel, de Qualivo. Te he escrito por WhatsApp; cuando puedas, contéstame por ahí.»
- **No mandes WhatsApp ahora.** Hace menos de cuatro horas del primero.

**Si coge, guion de la llamada (60-90 segundos):**

1. **Permiso:**
   > Hola {{nombre}}, soy Maikel, de Qualivo. Pediste el diagnóstico {{hoy / ayer}}. ¿Te pillo bien un minuto?
2. **Si no le va bien:**
   > ¿Te llamo a las {{hora}} o mejor mañana a primera hora?

   Sale una hora concreta, nunca «ya te llamo».
3. **Si le va bien:**
   > Te llamo por una cosa: pusiste que se te escapa en {{fuga}}. Antes de nada, para no hacerte perder el tiempo: ¿cuántas {{solicitudes / consultas / peticiones de presupuesto}} os entran al mes, más o menos?

   Escucha y apunta sus palabras.
4. **Propuesta:**
   > Con eso ya hay para verlo con números. Son unos 30 minutos por videollamada: metemos tus números, te enseño cuánto se está quedando por el camino y cómo lo cerraríamos. ¿Te va mejor {{hueco 1}} o {{hueco 2}}?
5. **Cierre:**
   > Hecho. Ahora te llega la confirmación por WhatsApp y la invitación al correo. ¿Lo vas a ver tú solo o hay alguien más que decida contigo?

   Y al final:
   > Si puedes, ten a mano cuatro números aproximados: lo que inviertes en anuncios, lo que te entra al mes, cuántos se presentan y lo que vale una venta.

**Objeciones en la llamada**

| Te dice | Respondes |
|---|---|
| «¿Eres una máquina?» | «No, soy Maikel, en persona. Uso una IA para contestar rápido y para los recordatorios, porque es justo lo que montamos para nuestros clientes. Pero esta llamada y la reunión son conmigo. En la reunión te enseño cómo funciona por dentro.» Nunca lo niegues si le escribió o le llamó la IA. |
| «No tengo tiempo» | «Por eso lo hacemos en media hora y con tus números: si no ves algo concreto que ganar, lo dejamos ahí. ¿Mejor a primera hora o a última?» Si de verdad no puede esta semana: «¿Qué semana la tienes más tranquila?» y sale una fecha. |
| «¿Cuánto cuesta?» | «Depende de lo que haya que montar, y no te quiero dar un número sin saber si te sale a cuenta. En la reunión lo calculamos con tus números: lo que ganarías y lo que cuesta, las dos cosas delante. ¿Te va bien {{hueco 1}}?» |
| «¿Cuánto cuesta?» (insiste) | «Para que te hagas una idea: desde 1.000 € al mes, más la inversión en anuncios, que va en tu cuenta. En la reunión vemos si con tus números te sale a cuenta o no.» Si pregunta por la inversión: «Para que funcione, al menos 600 € al mes en anuncios.» |
| «Mándame información por correo» | «Te la mando, pero sin tus números te va a servir poco. Hagamos una cosa: te mando el resumen y dejamos la media hora puesta el {{hueco 1}}. Si al leerlo no te encaja, me dices y la quito.» |
| «Ya tengo una agencia» | «No la sustituimos. Ella trae a la gente; nosotros entramos en lo que pasa después, que es donde se pierde.» |

### D+1 · WhatsApp sin enlace (10:00-12:00)

```
{{nombre}}, te escribí ayer por lo del diagnóstico, por si se te pasó.

Si me dices qué día te va bien, lo vemos con tu caso delante y te digo por dónde empezaría yo.
```

Si es A y a las 17:00 sigue sin contestar: **una llamada** entre las 17:00 y
las 19:00, con el mismo guion. Sin WhatsApp detrás.

### D+3 · WhatsApp con huecos y agenda

```
{{nombre}}, te guardo {{hueco 1}} o {{hueco 2}} por si te encaja alguno. Si prefieres elegir tú la hora, aquí tienes mi agenda: qualivo.io/llamada

Y si ahora no es el momento, dímelo sin problema y no te escribo más.
```

### D+7 · Cierre

```
{{nombre}}, lo dejo aquí para no ser pesado. Para cerrarlo bien, contéstame con una palabra:

«Ahora»: lo vemos esta semana.
«Más adelante»: te escribo cuando me digas.
«No»: no te escribo más.
```

**En el CRM:**
- Sin respuesta: trato a «No responde» con una nota.
- «Más adelante»: a «Más adelante», con la fecha que diga y una tarea.
- «No»: a perdido, con el motivo.

---

## 3 · Reservar la cita

- **Dos huecos a menos de 48 h**, uno de mañana y otro de tarde. Nunca «¿cuándo
  te va bien?» a secas. Cuantos más días pasan entre la reserva y la cita,
  más plantones (es la hipótesis de la semana 1 de octubre). Si solo puede
  más tarde, se acepta, y la víspera se le pide confirmación.
- **Resérvala en el calendario de reservas de GHL**, no en Google a mano. Así
  se crea su propia sala de Meet y el reloj la coge en menos de 10 minutos:
  - el trato pasa a «Reunión agendada»;
  - te llega el aviso;
  - Meta recibe el evento «Schedule»;
  - sale sola la confirmación por WhatsApp.
- **No mandes tu propia confirmación**: saldría repetida. Comprueba en la nota
  de GHL («Cita confirmada… Hecho: …») que ha salido. Si no ha salido, manda
  esta a mano:

```
Hola {{nombre}}, soy Maikel, de Qualivo. Confirmado: hablamos el {{día}} a las {{hora}}. Es por videollamada y dura unos 30 minutos. Este es el enlace: {{enlace}}. Voy a repasar contigo dónde se te está escapando el negocio y te enseño un plan hecho para tu caso. Si te surge algo antes, dímelo por aquí.
```

### Las dos preguntas de preparación

Sirven para que venga. Quien se compromete a algo antes de la reunión se
presenta más. Además, sabrás quién decide.

**Pregunta 1**, justo después de la confirmación:
```
Para prepararla bien: ¿qué te tendría que enseñar para que la media hora te merezca la pena?
```

**Pregunta 2**, cuando conteste a la primera:
```
Perfecto, lo llevo preparado. ¿Lo vas a ver tú solo o se conecta alguien más que decida contigo? Si es así, pásame su correo y le añado a la invitación.
```

Lo que conteste va a la nota del CRM, con sus palabras. Es lo primero que
dices en la reunión.

---

## 4 · Antes de la reunión

### El correo de confirmación (v2, pendiente de tu ok)

Sale nada más reservar, junto al WhatsApp. Vista previa:
`content/correos/confirmacion-cita-v2.html`. Dice:
- día, hora, que es por videollamada, unos 30 minutos, contigo, y el botón
  del enlace;
- lo que contestó en el formulario («me dijiste que se te escapa en…», y el
  volumen si lo dio);
- **qué vamos a ver**:
  1. sus números en el simulador;
  2. su etapa más floja, funcionando;
  3. un objetivo a 90 días, por escrito ese mismo día;
- **los cuatro números que conviene traer**: inversión, lo que le entra al
  mes, cuántos se presentan y ticket medio. Aproximados valen;
- un caso de su sector, con sus cifras exactas;
- cómo mover la cita.

Está apagado en código (`CORREO_CITA_V2 = false` en `api/_cita.js` y
`api/_recordatorios.js`) hasta que des el ok a los textos.

### Recordatorios (automáticos)

- **Víspera, 18:30**, solo si reservó con dos o más días de antelación. Sale un
  WhatsApp con qué vamos a ver y «¿Sigue en pie?». Con v2 encendido, además
  un correo con los cuatro números (`recordatorio-vispera-v2.html`).
- **El mismo día, 9:00**: WhatsApp con la hora, el enlace y qué vamos a ver.
  Con v2, además un correo con el botón (`recordatorio-dia-v2.html`).
- **Si no ha confirmado la víspera**, a las 10:00 le llamas tú (o Raquel):
  > Hola {{nombre}}, soy Maikel. Solo para confirmar lo de hoy a las {{hora}}: ¿sigue en pie?

  Si no coge, no le escribas: ya tiene el recordatorio de las 9:00.

### Tu preparación (15 minutos por la mañana)

- La ficha investigada y lo que contestó a las dos preguntas.
- El simulador abierto con su sector y lo que ya sabes de él
  (`qualivo.io/intelligence/simulador/`).
- La demo de su etapa más floja lista. Los guiones por sector están en
  `content/intelligence-guiones.md`.
- El caso de su sector, con las cifras exactas (sección 5).
- La plantilla de propuesta a mano (sección 6).

### A la hora de la cita

- **5 minutos antes:** entra en la sala.
- **+3 minutos sin conectarse:** le llamas.
  > Hola {{nombre}}, soy Maikel. Te estoy esperando en la videollamada. ¿Te paso el enlace por WhatsApp o te va mejor que lo hagamos ahora por teléfono?

  Si se le ha olvidado o no puede:
  > Sin problema. ¿Lo movemos a {{hueco 1}} o a {{hueco 2}}?

- **+5 minutos, si no coge:** mandas **un solo WhatsApp, con un solo enlace**.
  ```
  {{nombre}}, te espero en la videollamada hasta las {{hora + 15}}: {{enlace}}

  Si se te ha complicado, sin problema: ¿lo movemos a {{hueco 1}} o a {{hueco 2}}?
  ```
- **+15 minutos:** cierras la sala y lo marcas **«no vino» ese mismo día**:
  etapa «No presentado», etiqueta `no-presentado` y una nota que diga si no
  se conectó o si canceló.

### Recuperar al que no vino

- **El mismo día:**
  - Ya tiene el mensaje de +5 minutos, con dos huecos. No le mandes otro.
  - Si contesta, le das hora ahí mismo.
  - Si es A y a las 3 horas no ha contestado, **una llamada**, sin mensaje:
    > Hola {{nombre}}, soy Maikel. Te llamo solo para buscarte otra hora, que antes no pudimos vernos. ¿Te va mejor {{hueco 1}} o {{hueco 2}}?
- **Al día siguiente (D+1):**
  ```
  {{nombre}}, ayer no pudimos vernos. Te dejo dos huecos por si quieres retomarlo: {{hueco 1}} o {{hueco 2}}. Y si ahora no es el momento, dímelo y lo dejo apuntado para más adelante.
  ```
- **D+5, el último y sin pedir nada:**
  ```
  {{nombre}}, no te escribo más por esto. Si más adelante quieres ver dónde se te escapan los {{alumnos / pacientes / clientes}}, contéstame aquí y lo buscamos.
  ```
- **Resultado en el CRM:**
  - si reserva, vuelve a «Reunión agendada»;
  - si no, a «Más adelante», con el motivo.

---

## 5 · La reunión (30 minutos)

| Min | Parte | Qué haces |
|---|---|---|
| 0-3 | Apertura | Agenda, quién decide y lo que te dijo en la pregunta 1 |
| 3-12 | **Simulador** | Sus números: hoy → con Qualivo → coste → lo que le queda |
| 12-17 | **Demo de su etapa más floja** | Solo esa. Como mucho tres pantallas |
| 17-19 | **Caso** | Uno, de su sector, con las cifras exactas |
| 19-22 | **Qué incluye** | En una lista, sin detalle técnico |
| 22-25 | **Precio** | Una vez y en silencio |
| 25-27 | **Objetivo a 90 días** | El del simulador, en voz alta y aceptado por él |
| 27-30 | **Siguiente paso con fecha** | Nunca «ya me dices» |

### 0-3 · Apertura

> En media hora: metemos tus números, te enseño dónde se te escapa y cómo lo cerraríamos. Si tiene sentido, te cuento qué incluye y cuánto cuesta; si no lo tiene, te lo digo igual. ¿Te parece?

Si no lo sabes aún:
> ¿Esto lo decides tú o hay alguien más que lo tenga que ver?

Y dile lo que te contestó en la pregunta 1:
> Me dijiste que querías ver {{sus palabras}}. Vamos a ello.

**En los primeros cinco minutos**, la frase y un ejemplo de su sector. Que
no se nos entienda como un seguimiento de ventas:
> Te decimos dónde se te escapa el dinero entre el anuncio y la venta, y lo arreglamos dentro de lo que ya usas.

### 3-12 · Simulador

Compartes pantalla en `qualivo.io/intelligence/simulador/`.
1. Rellenas **con él**: empresa, sector, inversión, lo que entra, cuántos
   hablan o agendan, cuántos se presentan, cuántos compran y ticket. Si
   trajo los cuatro números, empieza por ahí. Si no, estímalos con él y dilo
   en voz alta.
2. Enseñas «Lo que te deja hoy» y te callas:
   > Esto es lo que te deja hoy cada euro que metes en anuncios. ¿Te cuadra?
3. Aplicas el «Escenario prudente»:
   > Mismas inversión, mismos contactos. Solo mejoramos las etapas que controla el sistema: contestar en minutos, que se presenten y el seguimiento. La compra depende de tu equipo y no la tocamos.
4. Lees «Lo que te queda de más al mes» y «La entrada se recupera en».
5. **La etapa con el porcentaje más bajo es su etapa más floja.** Es la que
   enseñas en la demo.

### 12-17 · Demo de su etapa más floja (solo esa)

| Etapa más floja | Qué enseñas |
|---|---|
| Hablan contigo o agendan (contacto) | Un contacto que entra de noche, recibe el WhatsApp en minutos y le llama Raquel. La cita queda en su agenda |
| Se presentan (asistencia) | Confirmación, recordatorio de la víspera y del día, y cómo se recupera al que falta |
| Compran (seguimiento) | El que dice «me lo pienso»: quién le vuelve a escribir, cuándo, y el aviso al comercial cuando está listo |
| Pregunta por los anuncios | Qualivo Intelligence: qué anuncio trae ventas y cuál solo curiosos |

Lo que más se entiende: **«te prepara el borrador y lo apruebas tú»**.

### 17-19 · Caso

Solo uno, del sector más parecido, y con estas cifras exactas. No hay otras.
- **Clínica:** «Nuria Roure: 6,45 veces lo invertido.»
- **Formación:** «Una academia de formación: 1.160 leads y 21 matrículas en
  cuatro meses.»
- **Reformas:** «Antic Barcelona: 113 visitas agendadas en menos de 24 horas.»

### 19-22 · Qué incluye

> Te lo monto y lo llevamos nosotros, dentro de lo que ya usas:
> - Las campañas, en tu cuenta, midiendo qué anuncio trae {{matrículas / tratamientos / obras}} y no solo contactos.
> - El agente de WhatsApp, que contesta en minutos, de día y de noche, con tu tono y tus reglas.
> - Raquel, la agente de voz, que llama a quien no contesta y le deja la cita en tu agenda.
> - Confirmaciones, recordatorios y recuperar al que falta.
> - El seguimiento del que se lo piensa, y un aviso para ti cuando alguien está listo.
> - Qualivo Intelligence: un panel donde ves qué anuncio te trae ventas, de principio a fin.

Plazos (los del guion de venta):
- diagnóstico completo y plan por escrito en 48 horas;
- primer agente funcionando en dos semanas;
- el primer número, antes y después, en cuatro semanas.

### 22-25 · Precio

Lo dices una vez, sin rodeos, y te callas.

> Son 1.200 € de entrada, que es la puesta en marcha, y después 1.000 € al mes. La publicidad va aparte, en tu cuenta, y necesita al menos 600 € al mes para que esto funcione.

**Ojo:** el formulario de Meta todavía dice «Nuestros proyectos empiezan desde
750 €/mes» (`api/meta-leadform.js`, `api/_scoring.js`). Mientras no se cambie,
habrá quien llegue con esa cifra en la cabeza. Mira en la ficha si tiene la
etiqueta `precio-si`, `precio-depende` o `precio-no` antes de la reunión.

**Defensa del precio** (solo si hace falta, una línea cada vez):
- **Qué sustituye:**
  > Esto hace el trabajo de tres piezas: alguien que conteste en minutos a cada {{alumno / paciente / cliente}} y le persiga hasta la cita, que es un comercial; alguien que mida qué anuncio trae ventas, que es marketing; y quien lleve las campañas, que es la agencia. ¿Cuánto te costaría hoy tener esas tres cosas?

  Deja que diga él la cifra.
- **Cuánto tarda en pagarse** (con sus números, redondeando hacia arriba 1.000 € ÷ su ticket):
  > Con tu ticket de {{ticket}} €, la cuota se paga con {{n}} {{matrículas / tratamientos / obras}} al mes. El simulador dice que con el sistema serían {{X}} más.
- **«Es caro»:**
  > ¿Comparado con qué? Con tus números, hoy se queda por el camino {{cifra del simulador}} al mes.

  El precio no se baja. Si el problema es la caja, **se mueve la fecha de
  arranque y el primer cobro va con el arranque**.
- **La garantía, solo si la pregunta.** Es la que tiene plegada el simulador
  («Si pregunta por la garantía»), leída tal cual.

### 25-27 · Objetivo a 90 días

Lees el objetivo del simulador («El objetivo que pactamos a 90 días») y
preguntas:
> ¿Te parece un objetivo razonable?

Si lo corrige, lo cambias delante de él. Lo copias con «Copiar para la
propuesta».

### 27-30 · Siguiente paso con fecha

> ¿Qué te parece?

- **Si es sí:**
  > ¿Cuándo te encaja arrancar?

  El cobro va con el arranque. Después, proceso de «cliente que dice que sí»
  (`proceso-comercial.md`, apartado 5).
- **Si no es sí todavía:**
  > ¿Qué necesitarías ver para decidirlo?

  Y **una fecha concreta** para volver a hablar, puesta en el calendario
  antes de colgar.
- **Si decide otra persona:**
  > ¿Nos vemos 20 minutos los tres el {{hueco}}?

---

## 6 · Después de la reunión

### El mismo día (antes de 2 horas)

**1. En el CRM:**
- marca «vino»;
- rellena los cuatro campos: contactado en, resultado, motivo si no encaja y
  ticket estimado;
- una frase con su objeción o su duda;
- la etapa;
- una tarea con fecha.

**2. Propuesta por correo:**

```
Asunto: {{empresa}} · lo que vimos hoy y el objetivo a 90 días

Hola {{nombre}}:

Gracias por la media hora. Te lo dejo por escrito, con tus palabras y tus números.

Lo que me contaste: {{sus palabras, una o dos frases}}.

Tus números hoy: {{inversión}} € al mes en anuncios, {{contactos}} contactos, {{presentan}} se presentan y {{compran}} compran. Te deja {{facturación hoy}} al mes.

Dónde se escapa: {{etapa más floja}}, del {{% hoy}}.

El objetivo a 90 días: {{objetivo copiado del simulador}}.

Qué incluye: las campañas en tu cuenta, el agente de WhatsApp, Raquel (la agente de voz), confirmaciones y recordatorios, el seguimiento del que se lo piensa y el panel de Qualivo Intelligence para ver qué anuncio trae ventas.

Precio: 1.200 € de entrada y 1.000 € al mes. La publicidad va aparte, en tu cuenta (mínimo 600 € al mes).

El simulador con tus datos, para enseñárselo a quien quieras: {{enlace del simulador}}

Siguiente paso: {{lo acordado}}, el {{fecha}}.

Maikel
```

**3. WhatsApp corto**, justo después del correo:
```
{{nombre}}, te acabo de mandar al correo lo que vimos, con tus números y el objetivo a 90 días. Quedamos en {{siguiente paso}} el {{fecha}}.
```

### Seguimiento según el motivo

Nunca «¿has podido mirar la propuesta?». Cada mensaje aporta algo y termina
con una sola pregunta.

**Precio** (a los 2 días). Se mueve el cobro o el alcance, no el precio.
```
{{nombre}}, le he dado una vuelta a lo del precio. No lo bajo, porque es lo que cuesta hacerlo bien, pero sí puedo mover cuándo empiezas a pagarlo: arrancamos el {{fecha}} y el primer cobro va con el arranque. ¿Así te encaja?
```

**No es prioridad / no es el momento.** El día que acordasteis, un solo
mensaje con algo útil.
```
{{nombre}}, quedamos en hablar hoy. Antes de nada, un dato tuyo: con tus números, cada mes se quedan por el camino {{cifra del simulador}}. ¿Lo retomamos esta semana o lo muevo a {{fecha}}?
```

**No entiende el retorno** (al día siguiente). Su cifra, en tres números.
```
{{nombre}}, te lo resumo en tres números, los tuyos: hoy facturas {{hoy}} al mes con lo que inviertes; con el escenario prudente serían {{con el sistema}}; Qualivo cuesta 1.000 € al mes. Te dejo el simulador con tus datos para que lo mires con calma: {{enlace}}. ¿Qué número no te cuadra?
```

**Lo tiene que hablar con su socio o su jefe** (el mismo día).
```
{{nombre}}, para {{socio / jefe}} te he dejado en el correo una página con lo que vimos: el problema, sus números y el objetivo a 90 días. Si le ayuda, lo vemos 20 minutos los tres. ¿Os va bien {{hueco 1}} o {{hueco 2}}?
```

**Está comparando** (a los 2 días). Un caso parecido, con números.
```
{{nombre}}, mientras comparas, te dejo el caso más parecido al tuyo: {{caso de su sector, con la cifra exacta}}. Y una pregunta para comparar bien: ¿la otra opción te dice qué anuncio acaba en {{matrícula / tratamiento / obra}}, o solo cuántos contactos entran?
```

**No confía todavía** (a los 2 días). Una primera parte pequeña que se pueda
comprobar.
```
{{nombre}}, una idea para que no tengas que fiarte de mí: empezamos por {{su etapa más floja}} y a las cuatro semanas te enseño el primer número, antes y después, con tus datos del CRM. ¿Lo vemos así?
```

**Ghosting.** A los 3 días, un mensaje útil y sin pedir nada:
```
{{nombre}}, una cosa que me quedó pendiente de la reunión: {{dato o idea concreta de su caso}}. Te sirve lo hagas con nosotros o no.
```

A los 7 días, el cierre con tres respuestas de una palabra:
```
{{nombre}}, para no dejarlo a medias: ¿lo montamos, lo dejamos para más adelante o no es para vosotros? Con una palabra me vale.
```

**No le duele lo suficiente.** Se cierra con respeto y se le escribe dentro
de 60 días, con una tarea en el CRM.
```
{{nombre}}, entiendo que ahora no es prioridad y me parece bien. Te escribo dentro de un par de meses por si ha cambiado algo. Si antes quieres retomarlo, aquí estoy.
```

**Regla de la cartera:** ningún A/B ni ninguna propuesta pasa tres días sin
una razón escrita en el CRM (`plan-octubre-2026.md`, sección 6).
