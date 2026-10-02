# Cold Calling · propuesta para la semana del 5 al 9 de octubre

2 de octubre de 2026. Respuesta al encargo de Maikel sobre los insights de la semana 40.

> **Es una propuesta.** No se ha llamado a nadie para escribirla y no se ha tocado el asistente
> de Vapi en producción. Precios y garantías no se tocan: los decide Maikel. Ninguna cifra está
> estimada: lo que no está medido dice **NO MEDIDO**. Alpha no se cita como caso en ningún guion.

---

## Lo que hay que saber antes de leer el resto

Tres hechos míos, medidos, que condicionan todo lo que propongo:

| | |
|---|---|
| Llamadas en frío reales hechas con el asistente nuevo (30-sep) | **4** |
| De esas, conversaciones que pasaron de recepción | **0** |
| Nombres de decisor conseguidos | **0** |
| Reuniones | **0** |

Las cuatro fueron: eFISIO (recepción, colgó a los 30 s) · Clínica MUSA (buzón) · Famydent (el
número no conecta) · Foxize («no nos interesa», cortando la primera frase a los 13 s).

Y dos cosas más:

1. **La apertura se reescribió la noche del 30-sep y sigue sin probarse.** Cero llamadas desde
   entonces. Era de 23 palabras con tres nombres desconocidos por delante, y decía «buenos días»
   a las siete de la tarde. Ahora es «Hola, buenas. Perdona, ¿con quién puedo hablar de la
   captación de pacientes?». **Que sea mejor es una hipótesis, no un hecho.**
2. **El 647 ya funciona.** Está en Vapi como `+34647118491`, y Maikel lo resolvió editando el
   registro que había en vez de crear uno nuevo: por eso conserva el id `2f99f0e4`, que es el que
   ya usa mi cola. No hay que cambiar nada para salir desde él. Era el bloqueo del 30-sep y está
   cerrado.

**Raquel nunca ha tenido una conversación con un decisor en frío.** Toda la propuesta se apoya en
eso, y por eso no propongo volumen en ninguna parte.

---

## 1 · Dónde encaja la llamada, y quién llama

### Tipo A · equipos comerciales · la llamada del día 10 la hace Maikel

**De acuerdo con el brief, y con tres motivos que lo refuerzan:**

1. **El día 10 no es una llamada en frío.** Llega después de LinkedIn, dos correos y una demo de
   su sector. El prospecto ya sabe quiénes somos. Lo que aporta esa llamada es juicio sobre *su*
   equipo comercial —cuántos son, qué CRM, qué se les escapa— y eso es improvisación, no un
   guion. Es exactamente lo que un agente de voz no hace.
2. **La puerta del tipo A es una centralita.** Empresas de 20 a 500 empleados con dirección
   comercial se contestan por conmutador. Raquel **no sabe marcar un dígito**: no tiene DTMF. De
   mis seis llamadas del 30-sep por la mañana, **tres murieron en una centralita o en una
   locución de espera**, y una de ellas se comió 211 segundos y el 47 % del coste de la tanda
   hablando con el asistente de voz de la propia centralita. Mandar a Raquel a por una dirección
   comercial es gastar dinero en el buzón de recepción.
3. **El tipo A se cierra en la segunda reunión, con quien decide dentro.** Es una venta de
   relación. La llamada del día 10 tiene que poder decir «y como esto toca a tu equipo, ¿quién
   más debería estar?», y responder a lo que contesten. No se puede guionizar.

### Pero Raquel sí tiene un trabajo en el tipo A, y es otro: conseguir el nombre

**El agujero medido del tipo A es que no tenemos el nombre de quien decide.** De los 20 leads
calientes de la lista del 30-sep, **ninguno traía nombre de persona**: todos eran buzones de rol
(`cita@`, `recepcion@`, `datos@`, `admisiones@`). Y el brief dice que en el tipo A se escribe «a
dirección comercial, general o de marketing», que es lo mismo: escribir a nadie.

Propongo meter a Raquel en el **día 2**, con una llamada de treinta segundos que **no vende
nada**:

> «Hola, buenas. Perdona, ¿con quién puedo hablar de la parte comercial?»
> → «¿Y cómo se llama, para preguntar por él?»
> → «¿Y su correo, para mandarle una cosa?»
> → «Gracias, nada más.»

Sin pitch, sin propuesta, sin mencionar el correo que le mandamos. Solo nombre y, si cae, correo.
Eso es un trabajo que Raquel **puede** hacer: es una pregunta de rutina a recepción, no una venta
a un decisor, y recepción da nombres a quien no le está vendiendo nada.

Qué cambia si funciona: los correos del día 4 y del día 7 van a una persona con nombre en vez de
a `info@`, y la llamada de Maikel del día 10 pregunta por alguien en vez de pedir que le pasen con
el departamento. **Si no funciona, se ve en una tarde y se para**: son 20 llamadas de treinta
segundos.

Y si sale una centralita con menú, Raquel cuelga a los veinte segundos y esa cuenta pasa a la
lista de Maikel. Eso ya está en su guion.

### Tipo B · negocios con volumen · la llamada del día 7, repartida

Aquí sí es terreno de Raquel: escuelas, clínicas y academias, que es exactamente el material que
tengo (20 leads de campaña y 604 fichas de Google Maps con teléfono). Pero con el listón donde
está hoy, no en donde nos gustaría.

**Reparto propuesto, con una puerta medible:**

| Quién | Qué cuentas | Por qué |
|---|---|---|
| **Raquel** | las de señal media: web con formulario, analítica, sin píxel de anuncios | Son muchas y son baratas de gastar. Si Raquel pasa de recepción, aquí se nota primero |
| **Maikel** | las de señal fuerte: anuncios activos en Meta más de 30 días, o 50+ solicitudes declaradas | Son pocas y valen mucho. Hasta que Raquel demuestre que pasa de recepción, no se arriesgan |

**La puerta:** cuando Raquel acumule **tres conversaciones que pasen de recepción** en el tipo B,
pasa a llevar también las de señal fuerte. Hasta entonces, no.

Lo digo así porque el dato que tengo es 0 de 4. No es un juicio sobre el guion nuevo, que no se ha
probado: es que no hay ninguna razón medida para darle los mejores leads todavía.

**Dos leads están guardados a propósito** y son los únicos de la lista con píxel de anuncios
verificado en su propio lead de Smartlead: **Logik Clinic Barcelona** (`meta_ads`) y **Academia
MAGISTER** (`meta_ads` y `google_ads`). Les queda un toque a cada uno. Esos son de Maikel.

---

## 2 · Guiones de 60-90 segundos

Convención: **solo se pronuncia lo que va entre comillas.** El resto son instrucciones. Viene de
un fallo real: el 29-sep el asistente leyó en voz alta una acotación del guion al saltar un buzón.

### Tipo A · la llamada de Maikel, día 10 · unos 75 segundos

**Apertura con la señal** (10-15 s). La señal es la del día 1, la que ya lleva su correo:

> «¿{nombre}? Soy Máikel, de Cuálivo. Te escribí la semana pasada por lo de que estáis buscando
> dos comerciales. ¿Te pillo bien un minuto?»

Y callarse.

Variantes de la primera línea según la señal, y **solo con la señal que tengamos verificada**:

| Señal | La línea |
|---|---|
| Busca comerciales | «...por lo de que estáis buscando {n} comerciales.» |
| Director comercial nuevo | «...por lo de tu llegada a la dirección comercial.» |
| Abre sede o crece | «...por lo de la sede nueva de {ciudad}.» |
| CRM y anuncios a la vez | «...por lo de que trabajáis con {CRM} y además estáis invirtiendo en anuncios.» |

**Si no se acuerda del correo** (5 s), sin incomodar:

> «Normal. Te lo resumo en veinte segundos y me dices si tiene sentido.»

**El resumen** (20 s), problema, no producto:

> «Trabajamos con equipos comerciales que tienen el CRM puesto pero donde la mitad de lo que pasa
> vive en el correo de cada uno. Y entonces hay oportunidades abiertas que nadie ha vuelto a
> tocar, y desde dirección no se ve cuáles.»

E inmediatamente la pregunta. **Nunca dos explicaciones seguidas.**

**La pregunta de diagnóstico** (una sola, 25-35 s con su respuesta):

> «De las oportunidades que tenéis abiertas ahora mismo, ¿cuántas dirías que tienen fecha para el
> siguiente paso?»

Por qué esta: se contesta con un número o con «ninguna» o con «no lo sé», y las tres respuestas
sirven. «No lo sé» es la mejor: es el dolor del tipo A, que es falta de visibilidad, no falta de
leads. Y no pregunta por facturación ni por conversión, que es lo que cierra a la gente.

Si da un número, se usa **una vez** y con sus palabras, nunca inventando:

> «Entonces ahí hay oportunidades que ya os costaron conseguir y se están enfriando solas.»

**El cierre, con quien decide dentro** (15 s). Esto es lo que más falló la semana 40: en cinco de
ocho reuniones no estaba quien decide.

> «Te propongo media hora con tu CRM abierto: te digo dónde veo que se está quedando negocio y
> cómo lo dejaríamos. Y como lo que salga toca a tu equipo, ¿quién más debería estar en esa
> llamada?»

**Primero se pregunta quién más, y después el día.** Al revés, se queda para otro día y la segunda
persona nunca entra. Y cuando dé un nombre:

> «Perfecto. ¿Le mando la invitación a él también? ¿Me dices su correo?»

Después, dos huecos concretos. Nunca «¿cuándo te va bien?»: eso se contesta con «mándame un
correo».

### Tipo B · la llamada del día 7 · unos 70 segundos

Vale para Raquel y para Maikel. Cambia quién se presenta, no la estructura.

**Apertura.** Raquel no se presenta en la primera frase: pregunta y punto. Es el arreglo del
30-sep y el motivo está medido, Foxize cortó a mitad de la presentación.

> **Raquel:** «Hola, buenas. Perdona, ¿con quién puedo hablar de la captación de pacientes?»
>
> **Maikel:** «¿{nombre}? Soy Máikel, de Cuálivo. Te escribí hace unos días por lo de vuestros
> anuncios. ¿Te pillo bien un minuto?»

Para Raquel, la presentación entera **en cuanto la pidan**, y nunca antes:

> «Soy Raquel, del equipo de Máikel Echevarría, de Cuálivo.»

**Si recepción pregunta «¿de qué se trata?»** —y lo pregunta siempre—, con la señal verificada:

> «Estamos hablando con clínicas de {ciudad} sobre la gente que pregunta precio y no acaba
> pidiendo cita. Es una pregunta concreta, treinta segundos, y no es para venderos nada.»

**La pregunta de diagnóstico**, una sola, y es el dolor medido del tipo B, que es la velocidad:

> «Cuando os entra una solicitud por la web o por WhatsApp, ¿cuánto se tarda de media en
> contestarle?»

Si contestan en minutos, la fuga no es ahí y se pivota una sola vez:

> «Vale, entonces vais rápido. ¿Y de esos que preguntan y no cierran en el momento, quién les
> vuelve a escribir?»

**El cierre, con quien atiende dentro:**

> «Son treinta minutos con Máikel: le cuentas cómo lo tenéis montado y te dice dónde ve que se
> están quedando pacientes. ¿Y quién más atiende esas solicitudes? Que esté también, que al final
> es quien lo va a usar.»

Y dos huecos concretos, de los que devuelva la agenda. **Nunca una hora inventada**: el calendario
pide dos horas de aviso y no abre fines de semana, y una hora inventada se rechaza y hay que
rectificar en la misma llamada. Pasó el 29-sep.

### Lo que no se dice en ninguno de los dos

Precios. Rangos. «Depende, pero suele estar en». Promesas de resultado. Aperturas de correo,
clics ni nada de telemetría. «Solo quería hacer seguimiento». La inteligencia artificial como
producto («creamos agentes», «hacemos automatizaciones»). Y Alpha, ni como caso ni de pasada.

---

## 3 · Las tres preguntas de tamaño dentro del guion de Raquel

> **Aviso de propiedad:** el guion que llama a los leads de anuncios es el asistente **«Raquel ·
> Landing Diagnóstico»**, que es de Growth y está en producción con citas reales cerradas. Aquí
> propongo **el texto y dónde va**. Aplicarlo es de Growth, con el ok de Maikel. No lo toco.

Las tres: solicitudes al mes, personas que atienden, valor de un cliente.

### La regla que evita el interrogatorio: ninguna va sola, cada una se gana con la anterior

No se preguntan las tres seguidas. Se preguntan **después** de la pregunta de la fuga, cuando ya
ha contado algo, y cada una sale de lo que acaba de decir. Si se ponen antes, la llamada es un
formulario hablado y cuelgan.

**Primera, la fácil.** Va enganchada a su respuesta sobre la fuga, con «como la tuya» para que sea
concreta y no una métrica:

> «¿Y solicitudes como la tuya cuántas os entran al mes, más o menos?»

El «más o menos» es importante: da permiso a contestar a bulto, y a bulto es suficiente para
clasificar.

**Segunda, la natural.** Sale sola de la primera, no parece una pregunta nueva:

> «¿Y eso lo lleváis entre varios o hay alguien específico?»

**Tercera, la que hay que justificar.** Es la intrusiva, va la última, y se justifica **en su
interés**, no en el nuestro:

> «Y la última y te dejo: ¿cuánto os deja de media un cliente? Te lo pregunto para que Máikel no
> te proponga algo que no te salga a cuenta.»

Esa frase final es la que hace que la contesten: deja claro que el número sirve para no venderle
de más.

### Las cuatro reglas que la hacen no sonar a interrogatorio

1. **Una pregunta, y se espera en silencio.** Sin encadenar. Si el silencio se alarga, se espera
   igual: la gente piensa antes de dar un número.
2. **Si no contesta una, se pasa a la siguiente y no se vuelve.** Nunca se repite una pregunta
   que ha esquivado. Se anota **NO MEDIDO** y se sigue.
3. **Si la llamada va mal, no se preguntan.** Si está incómodo, con prisa o cortante, se va
   directo a cuadrar la hora. **La reunión vale más que el dato**: el dato se saca en la reunión y
   la reunión no se recupera.
4. **Si contesta «no lo sé» a las tres, no es un descarte.** Es la señal más clara de que hay algo
   que mirar, y se dice así: «es lo normal, casi nadie lo tiene medido, y es justo lo que mira
   Máikel».

### Qué se hace con las respuestas

Van en la nota del CRM, literales, y en el campo `contexto` de la herramienta de agenda, para que
Maikel entre a la reunión con los tres números delante. **La clasificación A, B o C la hace una
persona mirando esos tres datos, no Raquel en la llamada.** Raquel pregunta y apunta; no decide el
tipo de cliente ni lo menciona en voz alta.

---

## 4 · El buzón de voz en segundas llamadas

### Lo que falla hoy, y por qué

El mensaje de buzón es **un texto fijo** en la configuración del asistente. Dice:

> «Hola, soy Raquel, del equipo de Máikel Echevarría, de Cuálivo. Te llamaba por lo del
> diagnóstico. Máikel te escribe por WhatsApp. Hasta luego.»

Dos fallos, y los dos son del mismo tipo: **el mensaje no sabe en qué intento está.**

1. **Habla como si fuera el mismo día.** En un segundo intento, tres días después, «te llamaba por
   lo del diagnóstico» suena a que no sabemos a quién llamamos. Y en el guion de la apertura la
   frase es «acabas de pedir el diagnóstico», que dicha un día después es directamente falsa.
2. **Promete un canal que ya se usó.** «Máikel te escribe por WhatsApp» cuando ya le escribió hace
   dos días es prometer algo que el otro ya ha visto y no ha contestado. Queda a desatención, y es
   el mismo error que el 15-sep, cuando se le escribió «se nos ha cortado la llamada» a un lead
   cuyo teléfono no llegó a sonar.

### El arreglo: que el recado sea una variable, no un texto fijo

`voicemailMessage` acepta variables. Propongo ponerlo en **`{{recado}}`** y calcular el recado por
llamada, igual que ya se hace con el saludo en el asistente de frío.

Tres versiones, y se elige por intento y por lo que ya se le ha mandado:

**Primer intento, el mismo día que pidió el diagnóstico:**

> «Hola, soy Raquel, del equipo de Máikel Echevarría, de Cuálivo. Te llamaba por el diagnóstico
> que has pedido hoy. Te escribo por WhatsApp y lo cuadramos por ahí. Hasta luego.»

**Segundo intento, y ya se le escribió por WhatsApp:**

> «Hola, soy Raquel otra vez, del equipo de Máikel Echevarría, de Cuálivo. Te llamé el {dia} por
> el diagnóstico que pediste. No te llamo más, que no quiero molestar. Te escribí por WhatsApp a
> este mismo número: contéstame ahí cuando puedas y lo cuadramos. Hasta luego.»

**Segundo intento y no se le ha escrito por WhatsApp:**

> «Hola, soy Raquel otra vez, del equipo de Máikel Echevarría, de Cuálivo. Te llamé el {dia} por
> el diagnóstico que pediste. Te escribo ahora por WhatsApp a este número, y si te va mejor
> contéstame ahí. Hasta luego.»

### Las tres reglas que lo sostienen

1. **Nunca prometer un canal que ya se usó sin respuesta.** Si ya hay un WhatsApp sin contestar,
   el recado no anuncia otro: señala el que hay.
2. **Nunca decir «acabas de» en un segundo intento.** Se dice el día: «te llamé el martes».
3. **El segundo recado dice que no habrá un tercero.** «No te llamo más» no es una renuncia: es lo
   que hace que el que lo oye no te ponga en la lista de los que insisten. Y además es verdad,
   porque el máximo son dos toques.

Lo mismo aplica al guion hablado: la frase «acabas de pedir el diagnóstico» necesita una variante
para cuando no es hoy. Propongo «te llamo por el diagnóstico que pediste el {dia}».

---

## 5 · Medidas del viernes 9 y qué tiene que decidir Maikel

### Las medidas, con su punto de partida real

| Medida | Hoy | Objetivo de la semana |
|---|---|---|
| Llamadas en frío hechas | 4 (30-sep) | — |
| Contactos reales (alguien descuelga) | 3 de 4 | — |
| **Conversaciones que pasan de recepción** | **0** | **3** ← el listón de la semana |
| Nombres de decisor conseguidos | 0 | 10 de las 20 cuentas A |
| Reuniones propuestas | 0 | NO MEDIDO, no pongo número sin base |
| Reuniones agendadas | 0 | — |
| Reuniones con quien decide dentro | NO MEDIDO | — |
| Centralitas: cuántas y qué costaron | 3 de 6 el 30-sep por la mañana · 0,30 USD | bajar de 1 de 4 |
| Números que no conectan | 2 de 10 | corregirlos, no descartarlos |
| Coste por conversación | **no calculable: división por cero** | — |

**El objetivo de la semana no es una cita. Son tres conversaciones que pasen de recepción.** Si
eso no pasa en veinte llamadas, el problema no es la apertura y hay que mirar otra cosa: la hora,
la vertical, o que una voz automática no pase un filtro de recepción español. Es mejor saberlo con
veinte llamadas que con doscientas.

### Cómo se mide sin inventar nada

Cada llamada deja un resultado de una lista cerrada —reunión, rellamada, gatekeeper, contestador,
centralita, correo pedido, fuera de perfil, no interesa, baja solicitada, número erróneo— más dos
cosas: **el número que dijo el prospecto**, si lo dijo, y **qué pregunta se le hizo**. Sin lo
segundo no se puede saber nunca si funcionó el guion o funcionó la lista.

Eso lo escribo yo leyendo la transcripción de Vapi después de cada llamada. Raquel no escribe en
el CRM.

### Lo que tiene que decidir Maikel antes del lunes

**De esta área:**

1. **¿Raquel entra en el tipo A como cazanombres el día 2?** Son 20 llamadas de treinta segundos,
   sin pitch. Es la propuesta con más potencial de la semana y la más barata de descartar.
2. **¿El reparto del tipo B es el que propongo** —Raquel en señal media, Maikel en señal fuerte,
   con la puerta de tres conversaciones— o quiere que Raquel lo lleve todo desde el principio?
3. **Logik Clinic y Magister:** confirmo que los llama él, no Raquel. Son los dos únicos con píxel
   de anuncios verificado y les queda un toque.
4. **Las tres preguntas de tamaño y el `{{recado}}` del buzón** son cambios en el asistente de
   Growth, que está en producción. Necesitan su ok además del tuyo. Yo no lo toco.
5. **DTMF sigue sin resolver.** Mientras no esté, **los fijos con centralita salen de la cola
   automática** y van a la lista de Maikel. Confirmar que se acepta.
6. **El horario.** `diseno.md` dice 10:00–18:00 y el 30-sep llamamos a las 18:09, cosa mía. Si
   vamos a llamar hasta las ocho, hay que cambiar la regla escrita; una regla que nos saltamos
   cada vez no es una regla.

**Que arrastramos y siguen abiertas:**

7. **SPF y DMARC de qualivo.io.** Los correos caen en spam. Afecta a la invitación de cualquier
   reunión que cerremos esta semana, y la asistencia de septiembre fue del 54 %. Cerrar reuniones
   sin esto es llenar un cubo con un agujero.
8. **Retirar `Qualivo SDR`** (el asistente roto que hizo las seis llamadas del 30-sep por la
   mañana): renombrarlo a «NO USAR» y apagar lo que lo dispare.
9. **Escuchar treinta segundos de grabación** y decir si suena «Máikel» o «Michael», y «Cuálivo»
   o «Cuálibo». Las transcripciones no sirven para esto: Deepgram normaliza, y en la misma llamada
   escribió «30 segundos» donde el guion dice «treinta segundos». Es lo único que no puedo
   averiguar yo, y decide si el arreglo es de guion o de diccionario de pronunciación.
10. **El umbral de aperturas.** `diseno.md` dice que los de ocho o más los llama Maikel en
    persona. **KALU Institute tiene 18 aperturas**, el triple que el siguiente, y está parado
    porque su teléfono (`790697761`) no es un número español válido. Si la regla sigue en pie, ese
    es de Maikel, y lo primero es sacarle el número bueno de su web.

---

## Lo primero que haría el lunes, si hay luz verde

1. Una llamada de un céntimo al móvil de Maikel como canario, antes de cualquier lead. El 30-sep
   detectó que ElevenLabs se había quedado sin crédito a cambio de 0,0008 dólares, en vez de
   quemar diez leads en llamadas mudas.
2. Tres llamadas del tipo B con la apertura nueva, a leads flojos y a buena hora, para saber de
   una vez si la apertura de doce palabras pasa de recepción.
3. Según eso, las 20 llamadas de nombre del tipo A el martes, o una reunión para replantear.

---

**Rama de trabajo: `claude/cold-calling-agent`.**
