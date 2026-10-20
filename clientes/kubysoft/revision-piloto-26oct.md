# Kubysoft · revisión del piloto

Pedido por la sesión «Qualivo Chief of Staff» el 20-oct para el lunes 26.
Escrito el 20-oct. Solo análisis: no se ha enviado nada a Kubysoft ni se ha
reactivado ninguna campaña por este encargo.

---

## 1. Estado real, con fuente

**Fuente**: API de Smartlead, campaña 4071068, cliente 596297. **Última lectura
verificada el 16-oct a las 07:08 UTC.**

**Desde el 19-oct no se puede leer nada.** El contenedor de la sesión se recicló
y con él se perdieron las claves del scratchpad (Smartlead, Apify, Todoist y la
del buzón). Las claves no estaban en el repositorio a propósito, que es la regla,
así que se fueron con el contenedor. El aviso diario sigue disparando a las 7 y
fallando por falta de clave: ha fallado el 19 y el 20. **Pedida a Maikel los dos
días, sin respuesta todavía.**

Eso significa que la campaña lleva **cuatro días sin vigilancia**, y que el
último dato fiable tiene cuatro días.

### El embudo, al 16-oct

| | |
|---|---|
| Piloto aprobado | 17-sep |
| Primer envío | **6-oct** (19 días de montaje) |
| Empresas contactadas | 34 |
| Correos enviados | 61 (34 del correo 1, 27 del correo 2) |
| Empresas que abrieron | 12 |
| Con aperturas repetidas | 3 |
| **Respuestas** | **0** |
| **Reuniones** | **0** |
| Rebotes | 3 (4,9%) |
| Bajas o quejas | 0 |
| Reputación del buzón | 60%, desde 85% el 4-oct |
| Leads cargados | 140 de 274. Sin empezar: 111 |

Las tres con aperturas repetidas: MANALTAIR (Madrid, 4 veces), Mairo Valenciana
(Valencia, 3) y Climar (Barcelona, 2). Nadie las ha llamado.

### Lo que nunca arrancó

De los tres canales del plan, **solo arrancó uno**.

| canal | estado | por qué |
|---|---|---|
| Correo | arrancó el 6-oct | único canal activo |
| LinkedIn | **nunca** | falta la URL del perfil de Marc |
| Teléfono | **nunca** | falta un número para Kubysoft y la clave de Vapi |

### Autopausas

La campaña se pausó sola el **9-oct** (6,9% de rebotes) y estuvo parada hasta el
15, seis días, porque no había aviso montado. Se volvió a pausar el **16-oct**
(4,9%). El umbral está al 3% y **Smartlead no deja cambiarlo por API** ni en
PAUSED ni en ACTIVE, así que seguirá saltando.

---

## 2. Hipótesis

### H1 · El mensaje no mueve a nadie a contestar

Creemos que **el ángulo operativo** (planificación de técnicos, partes,
material) **provoca cero respuestas** porque observamos **61 correos con dos
ángulos distintos, 12 empresas que abren, 0 bajas y 0 respuestas**: lo abren, no
les molesta, y no les mueve. Si modificamos el ángulo a uno que duela en dinero
y quepa en una frase, esperamos pasar de **0 a entre 2 y 4 respuestas por cada
60 envíos**.

| | | |
|---|---:|---|
| Impacto | **9** | Sin respuestas no hay piloto, da igual todo lo demás |
| Confianza | **5** | El cero es señal, pero 61 envíos es muestra corta y no permite separar copy de canal |
| Facilidad | **8** | Reescribir el copy son horas y cero euros. Ya hay dos versiones de cargo escritas |

### H2 · Un solo buzón impide generar muestra suficiente para decidir

Creemos que **tener un dominio y un buzón provoca que el piloto no pueda
medirse** porque observamos **34 empresas en 10 días hábiles, un tope de 30
envíos diarios, la reputación cayendo de 85% a 60% y dos autopausas por
rebotes**. Si modificamos a **2 o 3 dominios con 2 o 3 buzones cada uno**,
esperamos pasar de **5 a entre 40 y 60 empresas nuevas al día**, y poder decidir
con 300 envíos en vez de con 61.

| | | |
|---|---:|---|
| Impacto | **8** | Es la diferencia entre un piloto medible y una anécdota |
| Confianza | **8** | Es aritmética de topes de envío, no opinión |
| Facilidad | **4** | Depende de que Kubysoft compre, y los dominios nuevos tardan dos semanas en calentar: **no da resultado dentro del piloto actual** |

### H3 · Lo que pone en riesgo la cuenta es la dependencia de entregas del cliente

Creemos que **la falta de entregas de Kubysoft provoca que el piloto no se pueda
ejecutar como se diseñó** porque observamos que, **33 días después de la
aprobación**, siguen sin llegar el fichero de exclusiones, el perfil de LinkedIn,
un número de teléfono y el número del piloto por escrito, y que **dos de los tres
canales nunca arrancaron por eso**. Si modificamos el acuerdo a que **el reloj
del piloto no corre hasta que lleguen esas cuatro cosas**, esperamos o
desbloquear la cuenta en una semana, o tener un motivo documentado para cerrarla
sin discusión.

| | | |
|---|---:|---|
| Impacto | **9** | Es la causa de que falten dos canales, no un detalle administrativo |
| Confianza | **9** | Está documentado con fechas en el brief desde el 17-sep |
| Facilidad | **7** | Es una conversación comercial, no trabajo técnico. Pero la tiene que tener Maikel |

---

## 3. Recomendación para decidir

**Ni seguir igual ni cerrar hoy. Reiniciar con condiciones por escrito, y cerrar
en una semana si no llegan.**

El motivo es que **ahora mismo no se puede concluir nada**. Contra el número
propuesto, 3 reuniones cualificadas en 30 días, el piloto ha fallado: 0
reuniones. Pero el piloto **nunca se ejecutó como se diseñó**, así que lo que ha
fallado no es el método, es el montaje. Cerrar hoy sería cerrar sin haber
probado, y seguir igual sería gastar más en el mismo montaje insuficiente.

### Qué propongo decirle a Kubysoft

1. **Lo hecho hasta ahora no se cobra.** Es lo que ya estaba propuesto y además
   es lo honesto: 0 reuniones.
2. **El piloto se reinicia con fecha nueva de 30 días**, y el reloj arranca el
   día que lleguen las cuatro entregas suyas, no antes.
3. **Dos o tres dominios más**, comprados por ellos, porque sin eso el volumen
   no llega para medir.
4. **Si en una semana no llegan las cuatro cosas, se cierra.**

### Coste y lo que se pierde

| | |
|---|---|
| Gasto medido en herramientas | **3,46 dólares** de Apify. Smartlead y el buzón van en suscripciones ya pagadas |
| Dominio `kubysoft.es` | lo pagó Kubysoft |
| Días transcurridos | 33 desde la aprobación, 14 desde el primer envío |
| Horas de trabajo | **no instrumentadas.** No hay registro de horas por cuenta, así que no lo invento. Queda como pregunta abierta |

**Si se sigue:** se arriesgan más días y más gasto de herramientas sobre un
cliente que no entrega sus propios insumos. El coste en euros es despreciable;
el coste real es el tiempo y el coste de oportunidad frente a la captación de
Qualivo, que sí está produciendo.

**Si se cierra:** se pierde el activo construido, que no es poco y es reutilizable
casi entero: la lista de 274 empresas de clima en España, la cadena de
extracción de Maps con sus filtros por sector, el clasificador de respuestas
(que ya es compartido y usa Qualivo) y el guion de llamada. Lo único
específicamente perdido sería el copy de Kubysoft y la infraestructura de envío
de su dominio.

**Lo que no se pierde en ninguno de los dos casos** es el aprendizaje de que, en
este sector, el correo frío con ángulo operativo no genera respuesta. Eso vale
para el siguiente cliente SAT.

---

## Preguntas abiertas para Maikel

1. **La clave de Smartlead.** Bloquea todo: no hay estado real ni vigilancia, y
   la campaña puede estar pausada desde el 16.
2. **¿Se acordó un precio para este piloto?** No hay nada por escrito en el
   brief, solo la propuesta de "si no se llega al mínimo no se cobra".
3. **¿Marc eligió cargo y aprobó el copy?** Maikel dijo el 15-oct que Marc lo
   había visto, pero no hay registro de qué versión eligió, así que la campaña
   corre con la del responsable de servicio por defecto.
4. **¿Se registran horas por cuenta en algún sitio?** Sin eso no se puede poner
   coste real a la decisión.
