# Las cuatro acciones · qué he hecho y qué me ha desmontado · 7-oct-2026

Maikel: «haz todo esto tú mismo». Resultado honesto: **dos estaban mal planteadas por
mí, una ya estaba hecha, y la cuarta la he construido.**

---

## 1 · Matar las puertas de herramienta barata · NO LO HAGO, y la culpa es mía

Le dije: «está medido, no es una corazonada». **Era una corazonada.**

He escrito `captacion/scripts/puertas.py`, que agrupa las campañas por puerta y aplica la
regla de corte que Maikel fijó el 11-sep: con 7 días y 100+ envíos, ≥5% dobla, 2-5% una
semana más cambiando el ángulo, <2% cierra, y nunca se decide por aperturas.

Luego lo probé contra los números que yo mismo había citado, los del 16-sep:

| Puerta | Envíos | Resp. | Veredicto de la regla |
|---|---:|---:|---|
| Google Ads | 40 | 3 | **insuficiente**, la regla pide 100 |
| Salesforce | 50 | 1 | **insuficiente** |
| ActiveCampaign | 60 | 0 | **insuficiente** |
| Zoho | 20 | 1 | **insuficiente** |
| LinkedIn Ads | 20 | 1 | **insuficiente** |
| Pipedrive | 30 | 0 | **insuficiente** |

**Ninguna puerta llega al mínimo de la propia regla.** Ni una. Yo recomendé cerrar siete
campañas con 20 a 60 envíos cada una, un solo día, y lo presenté como medición.

Es el mismo error que ya cometí dos veces esta semana: mi criterio por delante del dato.
El 2-oct filtré por una regla que no existía y el 7-oct descarté 22 empresas por un
motivo inventado. Hoy he hecho la versión contraria: decidir con menos dato del que mi
propia regla exige.

**El único caso con algo de fundamento es ActiveCampaign:** 60 envíos y 0 respuestas el
16-sep, más 60 y 0 en el informe del lunes. Si son envíos distintos, suman 120 y 0, que
sí pasa el umbral y daría «cerrar». Si son los mismos 60, no. **No lo puedo distinguir
sin la clave**, así que tampoco cierro esa.

El script queda listo. En cuanto haya clave da el veredicto con el histórico completo, y
entonces cerrar será una decisión y no una opinión.

Un detalle del script: lleva un guardia que impide que alguna vez aprenda a llamar a
`/sequences`, porque un POST ahí reinicia los envíos. El guardia mira la forma de la
llamada, no la palabra, para no dispararse con su propia documentación.

## 2 · Responder en horas · HECHO, a falta de clave para correrlo

`captacion/scripts/sin_contestar.py`. Es el equivalente de `atascados.py` para el otro
lado del hilo.

La señal no necesita clasificar nada: **si el último mensaje del hilo es suyo, no hemos
contestado.** Da igual si preguntó precio o dijo gracias; el hilo está abierto de su
lado.

Descarta ausencias automáticas por texto, que en el triaje del 11-sep eran 36 de 108, un
tercio. Probado: distingue «estaré fuera de la oficina» y «automatic reply» de las frases
reales de Jelen («me gustaría saber cómo cobras por tu trabajo») y de Víctor («si tienes
alguna propuesta mándamela por mail»). El lector de fechas aguanta las tres formas que
devuelve Smartlead y no inventa cuando no puede leer una: las cuenta aparte.

## 3 · Dejar de sumar canales · YA ESTABA HECHO

No hay nada que arreglar. `funnel_diario.py` escribe una fila por canal y su `agrega()`
indexa por canal, así que **no existe un total mezclado en ninguna parte del script**.

Y en el parte que te llega ya se ve: el del 16-sep decía «Semana: 543 envíos y 11
respuestas», mezclado. El del 5-oct dice «email frío 285 envíos y 8 respuestas ·
WhatsApp 10 y 14 · LinkedIn 18 y 0», separado. Se corrigió entre esas dos fechas.

**Lo que sí sigue roto** es lo que yo mismo señalé como límite: las reuniones no llevan
etiqueta de canal. Y la herramienta para arreglarlo ya existe y nunca se enganchó:
`origen_tratos.py` normaliza los trece valores distintos de `source` de GHL a cinco
canales reales y puede etiquetar los contactos. Nadie lo ha metido en el informe diario.
Eso es trabajo de verdad pendiente y necesita la clave de GHL para probarse.

## 4 · Contestar a Jelen, Antonio, Carvajalinos y Víctor · YA SE MANDARON

**Me equivoqué y es un error que cambiaba lo que ibas a hacer.** Dije que estaban
redactadas desde el 14-sep y que nunca salieron. Leí la sección de borradores y no leí la
de abajo del mismo fichero, que dice:

> **EJECUTADO · lunes 14-sep, 12:4x.** Los ocho correos salieron por la API de Smartlead,
> cada uno en su hilo y desde el buzón que escribió en su día.

Y lista a Lara, Jelen, Antonio y Carvajalinos como **enviado**, más las cuatro
confirmaciones de supresión. Víctor también: *«se le contestó el 9-sep»*.

**No los mando.** Reenviar hoy lo mismo a quien ya lo recibió hace 23 días es peor que no
hacer nada.

### Pero sí hay algo vivo ahí, y es un problema de precio

El correo que se le mandó a Jelen el 14-sep le dio **«entre 1.000 y 2.500 euros al
mes»**.

Desde el 21-sep el precio es otro y `estrategia/precio.md` dice que manda sobre cualquier
cifra: **1.200 € de implementación una vez, 750 €/mes, y garantía de no cobrar el primer
mes si no hay citas cualificadas.**

Así que Jelen tiene encima de la mesa un precio que no existe, con un tramo alto que se
desvía 1.750 € al mes. Si contesta, contesta a eso.

Y queda el pendiente que `precio.md` ya dejaba escrito y que no es mío: **el texto de las
rutinas programadas sigue diciendo la horquilla vieja.** Eso no está en el repo y solo lo
puedes cambiar tú.

---

## Lo que de verdad hace falta de ti

1. **La clave de Smartlead.** Es lo que convierte `puertas.py` y `sin_contestar.py` de
   código a decisiones. Sin ella las cuatro acciones se quedan en dos.
2. **Corregir la horquilla de precio en el texto de las rutinas.**
3. **Decidir si a Jelen se le corrige el precio** por escrito o se espera a que conteste.
