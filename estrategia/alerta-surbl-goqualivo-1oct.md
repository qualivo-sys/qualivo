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

---

# AMPLIACIÓN (misma mañana) · son DOS dominios, no uno

## Primero: mi comprobación anterior tampoco valía, por otro motivo

Arriba escribí que no podía consultar SURBL desde aquí. La causa real era más tonta:
**`dig` no está instalado en este contenedor** y el error se lo comía la redirección, así que todas
las consultas devolvían vacío y yo lo leía como "limpio". Instalando `dnspython` y consultando por
la librería, las listas responden perfectamente.

La lección es la misma que ya me costó un informe: **una comprobación sin entrada de control no es
una comprobación.** Ahora las pongo siempre.

## La consulta buena, con sus controles

```
CONTROLES POSITIVOS (deben salir listados)
  test.surbl.org.multi.surbl.org      -> 127.0.0.254   OK, la consulta funciona
  dbltest.com.dbl.spamhaus.org        -> NXDOMAIN      FALLA: Spamhaus no se puede consultar
CONTROL NEGATIVO (debe salir limpio)
  google.com.multi.surbl.org          -> NXDOMAIN      OK, no da falsos positivos

NUESTROS DOMINIOS EN SURBL
  goqualivo.com     -> 127.0.0.64   LISTADO
  gotqualivo.com    -> 127.0.0.64   LISTADO
  qualivoedge.com   -> NXDOMAIN     limpio
  novaqualivo.com   -> NXDOMAIN     limpio
  qualivo.io        -> NXDOMAIN     limpio
```

Sobre Spamhaus **no puedo afirmar nada**: su entrada de control falla, así que ese "limpio" no vale.
Lo que sigue se refiere solo a SURBL, donde los controles salen bien.

El código devuelto es `127.0.0.64` en los dos casos. Qué sublista significa exactamente ese bit hay
que mirarlo en surbl.org; **no lo doy por sabido.**

## El alcance real

| dominio | buzones | correos/día | SURBL |
|---|---:|---:|---|
| goqualivo.com | 3 | 165 | **LISTADO** |
| gotqualivo.com | 2 | 110 | **LISTADO** |
| qualivoedge.com | 5 | 150 | limpio |
| novaqualivo.com | 5 | 100 | limpio |
| **total** | **15** | **525** | **275 listados = 52%** |

**Más de la mitad de la capacidad de envío de Qualivo sale por dominios que están en una lista negra
de URLs**, y Smartlead mete en cada correo un enlace de seguimiento y de baja con el dominio del
buzón emisor, así que no hay forma de enviar desde ahí sin llevar la URL listada dentro.

## El segundo rechazo de hoy, que NO es esto

El mismo barrido trajo un `450 4.1.8 Sender address rejected: Domain not found` desde
gotqualivo.com. Eso **no** es el listado: es un fallo **temporal** del servidor receptor
(clinicasw.com) y Gmail avisó de que reintentaría 46 horas. El DNS de gotqualivo.com está correcto,
comprobado con control: MX a `smtp.google.com` y SPF `v=spf1 include:_spf.google.com ~all`, igual
que los otros tres. No hay que tocar nada por eso.

## Qué hacer

1. **Pedir la retirada de los dos dominios en surbl.org**, no solo de goqualivo.com.
2. Decidir sobre los 5 buzones de esos dos dominios. Mi recomendación sigue siendo pausarlos: con
   los otros dos dominios limpios quedan **250 correos/día**, que es más de lo que estamos enviando
   hoy (37). **Pausar no cuesta volumen real ahora mismo** y evita acumular rechazos.
3. Averiguar por qué están listados antes de pedir la retirada, o volverán a entrar.
