# Repaso para conseguir reuniones · 14-oct-2026, tarde

Encargo de Maikel: "haz lo que consideres pero necesitamos reuniones". Esto es
lo que he mirado, lo que he hecho y lo que creo que hay que hacer.

## 1. Lo primero: no hay pipeline caliente escondido

He releído los **130 hilos donde la última palabra es suya** y nadie contestó.
Los tres candidatos que parecían buenos son **noes explícitos** cuando se leen
enteros:

| Quién | Días | Lo que dice de verdad |
|---|---:|---|
| Óscar · Contamar | 47 | "prefiero no seguir adelante" |
| Silvia · Escuela Nómada Digital | 97 | "estamos cubiertos, no necesitamos de estos servicios" |
| Manuel · Gala Formación | 93 | derivó a Dirección Comercial, "en caso de interés contactarían" |

No monto una lista de leads calientes con rechazos educados. De los 130: 39
ausencias automáticas, 25 rechazos, 5 fallos de entrega, 1 rechazo por lista
negra, y el resto ruido.

### Lo que sí sale de ahí, y vale guardarlo

Óscar de Contamar nos dijo por qué dijo no, y es la crítica más útil que hemos
recibido de la radiografía: *"son observaciones genéricas sobre la web que hoy
se obtienen de manera sencilla, y alguna de ellas no es del todo coherente ni
se ajusta a nuestra realidad. Las que sí aplican ya las teníamos identificadas
y priorizadas internamente."*

Tres cosas en una frase: genérico, parcialmente inexacto, y lo que acierta ya
lo sabían. Si la radiografía va a seguir siendo la oferta por escrito, eso hay
que arreglarlo antes de mandar más.

## 2. Dataslayer: la única oportunidad de verdad, y está fría

Reconstruido el hilo completo:

| Fecha | Qué pasó |
|---|---|
| 22-sep | Juan reenvía el correo a Adela Delso (Customer Success). Ella pide la call |
| 23-sep | Adela coge hora ella misma por el calendario |
| **25-sep** | **Reunión celebrada**, 12:00 a 12:30, con Adela y Carolina |
| 25-sep | Resumen y siguiente paso |
| 30-sep | Propuesta de demo |
| 5-oct | Tercer correo: "sigo con esto para que no se enfríe" |
| hoy | **Nueve días sin respuesta** |

**Corrijo lo que yo mismo estaba a punto de reportar:** venía de ver en el hilo
de Smartlead un "ya he agendado para este viernes" de hace 21 días sin nada
detrás, y mi primera lectura fue que se había caído una reunión agendada. Es
falso. La reunión se celebró y hubo tres seguimientos desde tu Gmail. Lo que
hay es un enfriamiento después de reunión, que es otra cosa.

**Un cuarto correo no lo va a mover**, y además sería "solo quería hacer
seguimiento", que está prohibido. Tienes el móvil de Adela en la propia cita:
**+34 667 51 59 89**. Esa llamada es la acción con más probabilidad de reunión
de todo lo que hay hoy encima de la mesa, y no es mía.

## 3. Lo que he ejecutado sin preguntar: doce bajas pendientes

Doce peticiones de baja o RGPD que nadie había ejecutado. Dominios ya estaban
en la lista de exclusión, pero **los leads seguían activos**, es decir podían
recibir los correos 2 y 3 de su secuencia.

| Quién | Días esperando | Lo que pidió |
|---|---:|---|
| Clara Onraita · Hotelverse | 7 | BAJA · **estaba en la tanda ABM viva** |
| Jordi · UpBizor | 33 | Baja |
| Christopher · Panorama | 37 | "molestas mucho, te bloqueo" |
| English Connection | 40 | "no envíes más correos" |
| Irene · Grupo 2000 | 42 | baja de la lista |
| Onexus | 44 | "dejad de mandar correos", cita RGPD |
| José Manuel · Engloba | 57 | Baja |
| Paco · Gesfor Group | 63 | **"Reportado LOPD"** |
| HES Idiomas | 64 | BAJA DEL EMAIL |
| CCTC | 65 | "no me escribas más" |
| Joaquín · Seguridad SI | 85 | **"¿Sabes que esto es ilegal?"** |
| Óscar · SimCrew | 92 | "por favor borrarnos" |

Los doce pausados y los dominios confirmados en la exclusión. Sin respuesta
escrita a los RGPD, como decidiste el 17-sep.

Dos de estas llevaban dos y tres meses. La de Hotelverse es la que más me
preocupa: pidió la baja hace una semana **dentro de la tanda que está viva**.

## 4. Otro fallo silencioso, y este era mío

`sin_contestar.py` guardaba el texto de cada respuesta cortando el **HTML
crudo** a 300 caracteres. En los correos hechos con tablas, los primeros 300
caracteres son `<html><head><style><table>`, así que **el contenido no se veía
nunca**. Por eso ocho hilos aparecían como `<td` y por eso las bajas de arriba
llevaban meses sin detectarse.

Lo encontré leyendo a mano el hilo de Service Design College: el servidor había
rechazado el correo con `550 A URL in this email (goqualivo.com) is listed on
https://www.surbl.org/lists`. **Un rechazo por lista negra escondido detrás de
una etiqueta HTML.** Arreglado: ahora limpia y luego corta, a 600.

Es el cuarto fallo del mismo tipo esta semana. Todos iguales: un campo que no
trae lo que crees, leído con un valor por defecto detrás que convierte el fallo
en un cero o un vacío creíble.

### Y de rebote, buena noticia sobre SURBL

Esta mañana te dije que cinco buzones seguían a 1 al día por la SURBL. Es
cierto, pero me quedé corto en lo importante: **los cinco están ya fuera de
todas nuestras campañas.** Comprobado uno a uno: las ocho campañas nuestras
envían solo desde novaqualivo.com y qualivoedge.com. El rechazo del 1-oct es
anterior a ese arreglo. No estamos metiendo URLs listadas en los correros de
hoy.

## 5. Lo que propongo para tener reuniones

Los números de la máquina: 512 envíos, 12 respuestas (2,34%), y las reuniones
tardan entre dos y cuatro semanas desde el primer correo. Faraday tardó 27
días. **Cargar leads hoy no da reunión esta semana.** Es aritmética, no pereza.

Y la capacidad está parada: 191 envíos/día de tope entre las campañas activas,
255/día de buzones, y estamos mandando 15. El freno son los leads, y el freno
de los leads es que Apollo no conoce a la gente de las empresas pequeñas.

### La cola de Raquel, montada y lista

He cruzado las dos cohortes de Mailerfind con los teléfonos verificados y los
filtros de siempre. Resultado: **145 negocios con señal leída en su web Y
teléfono**, ninguno contactado antes.

| Puerta | Cuántos |
|---|---:|
| Anuncios (píxel de Meta o tag de Google Ads) | 124 |
| CRM (Zoho o HubSpot) | 21 |

Los primeros por volumen de reseñas: Camino Barcelona (2.290 reseñas, 4,9),
IEPP (1.503), Salud Dental Blanco (1.424 y Zoho), AIP Language Institute (895),
Curso Genius (721), Clínica Dental Albufera 98 (456 y píxel de Meta).

Está en `captacion/datos/cola-llamadas-14oct.json` con teléfono, señal,
categoría y dirección de cada uno. **No la lanzo**: encender el canal de voz es
tuyo, y además hay que mirar el guion de Raquel antes.

La lista pide un repaso de cinco minutos: se ha colado un coworking y un par
de grandes (CCC, EDEM) que se caen por plantilla.

### Por qué esta lista y no la de aperturas

El paso 5 del triaje manda alimentar a Raquel con los leads de 3 o más
aperturas. Lo he mirado: **31 leads, y los 31 con cero clics**, igual que el
mes entero. Lo único que los distingue es que su servidor abrió el correo
varias veces, y el píxel de esta cuenta está contaminado por escáneres. Encima
solo el 32% de los leads de las campañas de sector tiene teléfono.

La lista de Mailerfind es mejor por las dos cosas: el teléfono está en casi
todos y la señal la he leído yo en su web, no me la cuenta un píxel.

## 6. Lo que necesito de ti, en orden de impacto

1. **Llamar a Adela Delso de Dataslayer** (+34 667 51 59 89). Reunión
   celebrada, fría nueve días, tres correos ya mandados. El teléfono es lo que
   queda.
2. **Decir si lanzo la cola de Raquel** sobre los 145. Es lo único que puede
   dar conversación esta semana.
3. **Mirar SURBL y Spamhaus** para goqualivo.com y gotqualivo.com. Si están
   limpios, son +275 envíos/día que hoy están muertos.
4. **Reconectar LinkedIn en HeyReach.** Trece días.
5. **La clave de GHL**, que bloquea pipeline, citas y el aviso de diagnósticos.
6. **Arreglar la radiografía** antes de volver a ofrecerla por escrito, por lo
   que dice Óscar de Contamar.
