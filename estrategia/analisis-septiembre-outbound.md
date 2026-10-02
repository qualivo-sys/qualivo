# Outbound · análisis de septiembre 2026 y qué cambiar en Q4

Ceñido a mi parte: de dónde salieron los leads de outbound, qué funcionó, qué no, y qué hay que
cambiar. Todo medido contra Smartlead y GHL el 30-sep, no contra impresiones.

---

## 1. El mes en una tabla

| | |
|---|---|
| Emails enviados | **4.500** |
| Aperturas registradas | 738 (16,4%) |
| Clics | 15 (0,33%) |
| **Respuestas** | **46 (1,02%)** |
| De esas, con interés cualificado | **≈4** |
| Rebotes | 65 (1,44%) |
| Bajas | **0** |
| Citas en el calendario | 25, de 22 personas |
| Citas atribuibles a outbound | **3** |

Campañas: 74 en total. 7 activas, 22 pausadas, 41 completadas, 3 paradas, 1 borrador.

### Corrección a algo que dije yo

El 30-sep informé de "13 enviados frente a 525 de capacidad" como si la máquina estuviera parada.
Eso era cierto **solo de las dos campañas verticales nuevas**, no del mes. En el mes salieron 4.500
correos. La capacidad teórica es de unos 11.000 (525/día × 21 laborables), así que usamos el **41%**.
Hay margen, pero no estábamos a cero. Mi marco de aquel informe exageraba el problema.

---

## 2. El hallazgo que cambia dónde poner la capacidad

Ordenando las campañas por tasa de respuesta, no por volumen:

| Campaña | Enviados | Respuestas | Tasa |
|---|---:|---:|---:|
| Vuelta al curso · Academias | 42 | 2 | 4,76% |
| **Vuelta al curso · Re-enganche** | 219 | 6 | **2,74%** |
| **V3 · Motor de puertas (copy por lead)** | 492 | 11 | **2,24%** |
| Formación · curso sin cerrar | 215 | 3 | 1,40% |
| Clínicas · precio por WhatsApp | 213 | 2 | 0,94% |
| Campañas de señal (CRM/Ads/Listas) | ~1.100 | 10 | 0,91% |
| **Inmobiliarias ES · Genérica (volumen)** | 557 | 4 | **0,72%** |
| **Solar ES · Genérica (volumen)** | 420 | 2 | **0,48%** |
| Obra · presupuestos (Maps) | 179 | 0 | 0% |

**El copy por lead responde 3 a 5 veces más que el volumen genérico.** V3 al 2,24% contra Solar
genérica al 0,48%.

Y el coste de oportunidad, dicho en crudo: **las dos campañas genéricas de volumen se llevaron 977
envíos, el 22% de todo el mes, y produjeron 6 de las 46 respuestas (13%).** Esa capacidad, aplicada
a copy por lead, habría dado unas 22 respuestas en lugar de 6.

Obra · presupuestos merece mención aparte: 179 envíos desde fichas de Google Maps, cero respuestas
y 7 rebotes. Es la misma conclusión que salió hoy con Apollo por otra vía — los datos de Maps son
de empresa demasiado pequeña.

---

## 3. Lo que está roto y no lo sabíamos: el tracking de aperturas

**V3 · Motor de puertas: 492 enviados, 0 aperturas registradas, 11 respuestas.**

Once personas no pueden responder un correo que nadie abrió. El tracking de aperturas está apagado
o roto en esa campaña. Lo mismo en todas las de señal (CRM Dynamics, Zoho, Salesforce, Pipedrive,
Odoo, Listas, Anuncios) y en Academias ES: cero aperturas registradas, y entre ellas 10 respuestas.

Son **unos 1.800 de los 4.500 envíos sin medición de apertura**, el 40% del mes.

Tres consecuencias, y la tercera es la grave:

1. El 16,4% de apertura está **subestimado**. La cifra real no se puede saber.
2. No se puede comparar copy entre campañas si unas miden y otras no.
3. **La lista de llamadas calientes se construye con "3 o más aperturas".** Si el 40% de los envíos
   no registra aperturas, el agente de cold calling está ciego sobre ese 40%. Los 20 leads calientes
   que le pasé hoy salen solo de las campañas que sí miden.

Esto es lo primero que hay que arreglar en octubre, antes de cualquier cosa de copy o de volumen,
porque es el sensor del que dependen los otros dos agentes.

---

## 4. La fuga de mi propio proceso: 28 respuestas sin rastro

De las 46 respuestas, **solo 18 están en el CRM. 28 no dejaron rastro** (61%).

De las 18 que sí están, las etiquetas dicen lo que pasó:

| Etiqueta | Cuántas |
|---|---|
| `merece-respuesta` | 3 |
| `pidio-llamada` | 2 |
| `pidio-precio` | 1 |
| `atasco-conversacion-4` | 2 |
| `respuesta-real` | 1 |

Las 28 que faltan puede que fueran negativas, ausencias automáticas o rebotes suaves. **El problema
es que ya no se puede saber.** Una respuesta se leyó, se decidió algo y no quedó registro. Si entre
esas 28 había una oportunidad, se perdió sin que aparezca en ningún sitio.

No es un problema de herramienta: es que el paso respuesta → CRM lo hago a mano y solo cuando la
respuesta me parece buena. Ese criterio es exactamente el que no debería existir.

---

## 5. La pregunta que hiciste a mitad de mes, y su respuesta incómoda

Preguntaste "de dónde han venido las reuniones". Con los datos tal como están, **no se puede
responder**.

De las 22 personas con cita en septiembre:

| Origen | Personas |
|---|---|
| **Sin etiqueta de canal** | **18** |
| canal-email-frio | 2 |
| motor-v3 | 1 |
| canal-meta-ads | 1 |

**El 82% de las citas del mes no tiene registrado de dónde vino.** Puedo afirmar que 3 son de
outbound. No puedo afirmar que las otras no lo sean.

Eso significa que cualquier comparación de coste por cita entre canales que hayamos hecho este mes
—incluida la de 17 € en formación contra 51 € en reformas— descansa sobre el 18% de los datos.
No digo que esté mal; digo que no está demostrada.

---

## 6. Lo que sí funciona, y conviene no tocarlo

**La entregabilidad.** 1,44% de rebote y **cero bajas** en 4.500 envíos. Con 15 buzones y ese
volumen, eso es una infraestructura sana. No hay problema de dominio, de calentamiento ni de spam.
Cuando el copy no funciona, la tentación es tocar la infraestructura. Aquí no hace falta.

**La secuencia aporta.** De las 46 respuestas, 29 llegaron en el paso 1 y **17 en pasos posteriores**
(9 en el paso 2, 3 en el 3, 2 en el 5). Los seguimientos añaden un 37% más de respuestas sobre lo
que daría el primer correo solo. El paso 5 es marginal: 2 respuestas. Yo mantendría hasta el 3 y
recortaría el 5.

---

## 7. Las cuatro conclusiones principales

1. **El cuello nunca fue encontrar leads.** Medido hoy: 52.327 decisores localizables en los seis
   motores y 2.457 créditos de Apollo. Podemos revelar el 4,7% de lo que existe. El problema es de
   presupuesto de enriquecimiento y de elección, no de mercado.

2. **El copy por lead rinde 3-5 veces más que el volumen genérico, y le dimos el 22% de la capacidad
   al volumen genérico.** Es la decisión con más dinero encima de la mesa y no requiere comprar nada.

3. **Medimos mal lo que más usamos.** El 40% de los envíos sin tracking de aperturas y el 82% de las
   citas sin canal. Los dos agentes nuevos (llamadas y LinkedIn) dependen de esas dos señales.

4. **1,02% de respuesta con 4 cualificadas de 4.500 envíos no es un problema de volumen.** Duplicar
   los envíos con este copy daría 8 cualificadas. El margen está en la tasa, no en la cantidad.

---

## 8. Qué cambiaría en Q4, por orden

**Primero, arreglar el sensor.** Activar tracking de aperturas en todas las campañas y poner el
canal como campo obligatorio en GHL. Sin esto, todo lo demás se decide a ciegas y el agente de cold
calling trabaja sobre una lista parcial. Coste: cero. Es configuración.

**Segundo, mover la capacidad.** Apagar las dos campañas genéricas de volumen (Inmobiliarias y
Solar) y pasar esos 977 envíos/mes a copy por lead sobre los seis motores. Con la tasa medida de
V3, son unas 22 respuestas al mes en lugar de 6.

**Tercero, automatizar respuesta → CRM.** Toda respuesta entra en el CRM con su etiqueta, sea buena
o mala. Sobre todo las malas: el motivo del no es el dato que hoy no tenemos y el que diría qué
motor descartar.

**Cuarto, resolver el cuello de la señal.** El email 1 de `mensajes-v3` exige una señal verificada
de la empresa en 90 palabras, y el cuerpo común ya ocupa 65. Verificar una señal por empresa a mano
es lo que impide escalar. La salida es la que escribiste tú: la hipótesis del vertical en lugar del
hecho de la empresa. Es cambio de copy y lo decides tú.

**Quinto, gastar los créditos con el reparto del ICP Operating System.** 850 formación, 550
servicios B2B, 380 clínicas, 280 reformas, 140 SaaS, 100 inmobiliario. Hoy van 60 de formación
enriquecidos, con 10 de 10 verificados en la muestra.

**Sexto, recortar el paso 5 de la secuencia.** 2 respuestas de 46. Ese hueco de envío vale más en un
lead nuevo.

---

## 9. Lo que no recomiendo, y por qué

**No subir volumen todavía.** Con 1,02% de respuesta, más envíos es más ruido y más riesgo de
dominio. Primero la tasa.

**No abrir más verticales.** Hay siete campañas verticales abiertas del 29-sep y ninguna ha llegado
a los 100 envíos que exige la propia regla de decisión. Abrir más repite el error de las trece
puertas del Brain: ninguna evaluable.

**No comprar Sales Navigator por esto.** Hace falta para LinkedIn, no para email. Es una decisión
del otro canal y con otros números.

---

## Mis propios errores del mes, para que estén escritos

1. **Falsa alarma de bloqueo (30-sep).** Informé de que las campañas nuevas estaban rotas mirando
   `total_stats` a las 09:40, cuarenta minutos después de abrirse la ventana de envío. Estaban
   enviando. Te pedí que abrieras Smartlead sin necesidad.
2. **Inferencia inválida de sonda estática (29-sep).** Afirmé que unas empresas no usaban Google Ads
   porque no salía el tag en el HTML. Lo cargaba Dataslayer por JavaScript. Retiré la recomendación
   de volumen que dependía de eso.
3. **"Reformas 0 de 14 nivel A".** Salió de una muestra de los últimos 100 contactos. En el mes
   completo fueron 3 A + 2 B de 15, un 33%. El argumento para formación es el precio, no la calidad.
4. **"Apollo no cubre la empresa española" (hoy).** Mal atribuido: las 10 que fallaron venían de
   Maps con 1-6 empleados. Sobre 11-200 empleados salieron 10 de 10.
5. **"Cero respuestas en septiembre" (hoy, hace dos horas).** Mi script buscaba un campo
   `reply_count` que no existe en la API; el campo es `reply_time`. Estuve a punto de meter un cero
   en este informe. Eran 46.
6. **"1.266 emails ya pagados" (hoy).** Cosechados de los ficheros de resultado y contados como
   volumen disponible. Cruzados contra Smartlead, 1.159 ya estaban cargados. Limpios había 64.

Los seis tienen el mismo patrón: **medí sobre una muestra o un campo y lo conté como el total.**
Es el error que más me repito y el que más cuidado me va a llevar en Q4.
