# goqualivo.com rechazado por lista negra de URLs · 1-oct-2026

## La evidencia

Correo enviado el 30-sep a las 07:02 desde `maikel.echevarria@goqualivo.com`
a un lead de Formación · Intelligence. El 1-oct a las 07:29 contesta
`mailer-daemon@googlemail.com`:

> **550 A URL in this email (goqualivo.com) is listed on
> https://www.surbl.org/lists**

Es un rechazo de primera mano de **Gmail**, no una inferencia. Nombra el dominio
y nombra la lista.

## Lo que no he podido comprobar, y por qué

Consulté SURBL y Spamhaus por DNS y los dos dieron "limpio". **Ese resultado no
vale nada.** Lo comprobé con las entradas de control que SURBL y Spamhaus
publican para que salgan listadas siempre (`test.surbl.org`,
`surbl-org-permanent-test-point.com`, `dbltest.com`): las tres devuelven vacío
también. La causa es que este contenedor resuelve por 8.8.8.8 y las dos listas
rechazan las consultas desde resolvers públicos.

Así que: **no puedo confirmar ni desmentir el listado desde aquí.** Lo único
sólido es el 550, y con eso basta para actuar. La comprobación hay que hacerla
desde el formulario web de surbl.org, que sí funciona desde un navegador.

## Por dónde entra el dominio en el correo

El cuerpo de los correos de esa campaña **no lleva ningún enlace a
goqualivo.com**: los enlaces propios que hay son a `qualivo.io`. El dominio entra
por el **píxel de seguimiento y el enlace de baja que Smartlead inyecta**, que
usan el dominio del buzón que envía.

Consecuencia: no es un problema de copy ni de plantilla. **Todo correo salido de
un buzón de goqualivo.com lleva una URL de goqualivo.com**, y cualquier receptor
que consulte SURBL lo rechaza.

## El alcance

| | |
|---|---|
| Buzones afectados | 3 (`maikel.echevarria@`, `maikel@`, `echevarria@goqualivo.com`) |
| Capacidad que representan | 165 correos/día |
| Sobre los 525 de Qualivo | **31%** |

Y el receptor que rechaza es Gmail, que en España cubre buena parte del correo
de empresa vía Google Workspace. No es un receptor marginal.

## La trampa de medición

Ese rechazo **entró en las estadísticas de Smartlead como una RESPUESTA**, con
`reply_time` puesto. No como rebote. Es decir: los fallos de entrega de este tipo
**inflan la tasa de respuesta y esconden el problema**.

Lo comprobé sobre las 46 respuestas de septiembre, una a una, buscando
mailer-daemon y variantes en el hilo:

| | |
|---|---|
| Confirmadas de persona | **36** |
| Confirmadas como fallo de entrega | **0** |
| No verificables (lead ya no resoluble) | 10 |

**El 1,02% de septiembre se sostiene.** Ninguna de las verificables era un
rebote disfrazado. La sospecha era mía y era infundada; queda escrito porque el
mecanismo existe y volverá a aparecer.

## Qué hay que hacer

1. **Comprobar y pedir la retirada de goqualivo.com en surbl.org.** Es de Maikel:
   requiere el formulario web y, probablemente, arreglar la causa del listado
   antes de pedir la retirada.
2. **Mientras esté listado, los 3 buzones de goqualivo.com a 0 correos/día.** La
   regla de la rutina diaria es poner a 0 un buzón con rebote >2%; un 550 duro de
   Gmail por lista negra es peor que un rebote. **No lo he hecho**: corta el 31%
   de la capacidad el mismo día que Maikel pidió maximizar envíos, y esa
   contradicción la resuelve él.
3. **Seguir enviando desde ahí empeora el problema**: cada rechazo más es una
   señal negativa adicional y hace más difícil la retirada. Si hay que elegir,
   pausar hoy protege el envío de las próximas semanas.
4. **Revisar si los otros tres dominios están listados**, con el mismo método (web
   de surbl.org, no DNS desde aquí).
