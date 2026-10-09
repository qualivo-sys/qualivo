# Los correos salen sin identificar quién los manda · 7-oct-2026

Lo levanta Maikel sobre el correo de Clara (Hotelverse): «no hay firma ni hay nada, no
pueden saber quiénes somos ni qué hacemos». Tiene razón, el fallo es mío, y al
comprobarlo resulta que no es solo del ABM.

---

## 1 · De dónde sale el fallo

Está escrito por mí en el propio entregable del 6-oct, línea 236:

> «Sin `{{signature}}`: las firmas de los buzones están vacías, pero no quiero que un
> token meta un enlace en el correo 1.»

Quité la firma para proteger la entregabilidad del primer correo **y no devolví la
identificación al cuerpo**. Optimicé una cosa y perdí otra sin darme cuenta.

## 2 · El alcance real: es una regresión de V3, no del ABM

| Plantilla | ¿Dice quién somos? | ¿Dice qué hacemos? |
|---|---|---|
| `captacion/secuencia-maikel-smartlead.md` (la vieja) | **Sí**: «Soy Maikel, fundador de Qualivo» + «Maikel Echevarria · Founder · Qualivo» | Sí |
| `estrategia/mensajes-v3.md` (la que manda hoy) | **No**: cierra con «Maikel» a secas | Sí: «detectamos dónde se pierden clientes… metiendo IA dentro del sistema que ya tenéis» |
| ABM copy v3 (Tarlogic, Hotelverse, INVENTIUM) | **No** | **No**: habla de «una forma de ver qué oportunidades necesitan movimiento», sin nombrar empresa ni actividad |

V3 dice de sí mismo que «sustituye a TODAS las plantillas anteriores». Al sustituirlas
se perdió la identificación, y el ABM heredó el hueco y además se quedó sin la frase que
explica a qué venimos. **Los dos defectos que señala Maikel están juntos solo en el
ABM**, que es justo lo que ha salido hoy.

## 3 · Por qué esto no es una cuestión de estilo

LSSI-CE (Ley 34/2002), artículo 20.1: una comunicación comercial por vía electrónica
tiene que ser identificable como tal **e identificar a la persona por cuenta de la cual
se realiza**. El artículo 22 exige además una vía simple y gratuita de oposición.

La vía de baja la tenemos: «responde BAJA y te saco al momento». La identificación no.
Así que falta la mitad del requisito, no un adorno.

Y por el lado práctico, que es el que afecta a las respuestas: un correo sin firma,
desde `qualivoedge.com`, pidiéndole a una directora comercial que conteste «¿te lo
paso?», se lee como phishing. Arreglarlo no protege solo el expediente, debería subir la
respuesta.

## 4 · La firma que propongo

Cambia **solo el bloque final**. El cuerpo no se toca: Maikel lo aprobó frase por frase
el 6-oct y no hay motivo para reabrirlo.

```
Maikel Echevarría
Qualivo · qualivo.io

Si no quieres recibir más correos míos, responde BAJA y te saco al momento.
```

**Sobre meter el dominio en el correo 1**, que es lo que yo mismo había prohibido: lo
cambio de opinión con un dato del repo. El problema de entregabilidad que tuvimos no
vino de llevar enlaces, vino de que `goqualivo` y `gotqualivo` estaban en SURBL. En la
comprobación del 1-oct (`estrategia/alerta-surbl-goqualivo-1oct.md`, línea 113)
**`qualivo.io` sale limpio**. Un dominio en la firma es lo más normal que existe en un
correo; un correo sin firma, no.

Coste en palabras: el de Clara tiene 70 y el tope son 90. Caben.

## 5 · Una tensión que prefiero nombrar y no puedo arreglar yo

La firma dirá `qualivo.io` pero el `From:` es `qualivoedge.com` o `novaqualivo.com`.
Firma y remitente en dominios distintos es, en sí mismo, una señal de desconfianza
pequeña. Lo limpio sería enviar desde el dominio de marca, y eso está bloqueado porque
`goqualivo` y `gotqualivo` siguen listados. No hay salida buena mientras eso siga así.

## 6 · Qué ya ha pasado y qué no puedo comprobar

El brief decía **primer envío hoy 7-oct a las 09:00 Madrid**. Son las 15:15. Lo más
probable es que los tres correos salieran hace unas seis horas, a Victor (Tarlogic),
Clara (Hotelverse) y Juan (INVENTIUM), con este defecto dentro.

**No lo puedo confirmar: sin la clave de Smartlead no veo la campaña.** Y no voy a
decir que salieron ni que no salieron sin mirarlo.

Lo que sí es seguro: el **correo 2 va a +6 días, o sea el 13-oct, y no ha salido**. Ese
se puede arreglar entero y a tiempo.

## 7 · El correo 2 corregido

> {Nombre},
>
> otra forma de explicarlo.
>
> La mayoría de sistemas comerciales registran bien lo que ya ha pasado. Lo que estamos trabajando nosotros es la capa que ayuda a decidir qué debería ocurrir después: qué oportunidad mover, cuándo y con qué siguiente acción.
>
> El ejemplo que te comentaba es muy corto.
>
> ¿Te lo paso?
>
> Maikel Echevarría
> Qualivo · qualivo.io
>
> Si no quieres recibir más correos míos, responde BAJA y te saco al momento.

## 8 · El experimento congelado: esto no lo descongela

Maikel dijo el 6-oct: «mantendría el experimento congelado una vez salga: nada de
cambiar los mensajes a mitad de cohorte porque los dos primeros no contesten».

Lo respeto, y conviene separar dos cosas. La congelación protege contra **tocar el
ángulo para perseguir respuestas**. Esto es **un defecto legal**, no una optimización.
Arreglar un defecto no es lo que la congelación prohíbe.

Pero sí parte la cohorte, y eso hay que llevarlo con honestidad: **los tres correos que
ya han salido son una subcohorte aparte y no se pueden juntar con los que salgan
firmados.** Si los tres no contestan, eso no dirá nada del mensaje, porque el mensaje
que recibieron no es el que vamos a mandar. Lo apunto ahora para no inventarme una
lectura favorable dentro de dos semanas.

## 9 · Peligro al arreglar la campaña viva

La campaña `4090069` tiene leads dentro. Hacer un POST de secuencia completa sobre ella
**reinicia los envíos**, que es una prohibición permanente. Así que el arreglo del
correo 2 no es un POST y hay que hacerlo con cuidado incluso teniendo la clave.

## 10 · Lo que hace falta de Maikel

1. **La clave de Smartlead.** Sin ella no puedo ni ver si los tres salieron.
2. **Decidir si corrijo también `estrategia/mensajes-v3.md`**, que afecta a las 45
   segundas partes de mañana y a las secuencias de Mentes Expertas y Blu Selection. Ahí
   el hueco es menor (V3 sí dice qué hacemos) pero sigue siendo el mismo
   incumplimiento.
