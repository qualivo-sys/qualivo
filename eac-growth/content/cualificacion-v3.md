# EAC · Cualificación v3 · formulario, clasificación y eventos

13-oct-2026. Implementa lo acordado en la reunión: formulario único en todas las
campañas, clasificación automática A/B/C/D y señal de calidad a Meta.

## Lo que ya está hecho

| Pieza | Estado | Dónde |
|---|---|---|
| Campo «En que punto estas» en GHL | ✅ creado | `YKMq7SBDywgKuExGLd3c` |
| Formulario de Meta con las 5 preguntas | ✅ creado | `1625782112285020` |
| Scoring A/B/C/D en n8n | ✅ en producción | `ACW2C85sKeVXqNNv` |
| Señal de calidad a Meta (CAPI) | ✅ desde 13-oct | `vkV67LyK3JQ88jvl` |
| Formulario puesto en los anuncios | ⏳ pendiente de permiso | — |

## El formulario

`EAC · Cualificación v3 · oct26` — ocho campos, de los que tres son de contacto.

| Pregunta | Opciones |
|---|---|
| Nombre, teléfono, email | — |
| ¿Qué edad tienes? | Menor de 18 · 18-21 · 22-30 · 31-40 · Mayor de 40 |
| ¿Cuál es tu nivel de inglés? | A1-A2 · B1 · B2 · C1 o superior · No estoy seguro |
| ¿Sabes nadar? | Sí · No, pero puedo aprender · No |
| ¿Cuándo te gustaría empezar la formación? | Lo antes posible · En 1-3 meses · En 3-6 meses · Solo busco info |
| ¿En qué punto estás? | Quiero matricularme · Comparando escuelas · Consultando requisitos · Solo explorando |

**Se quita «nivel de estudios»**: medido contra 428 leads, Bachillerato convertía
peor que ESO. Ocupaba un campo y no decía nada.

### Por qué las opciones están escritas así y no como en la presentación

Las opciones del formulario de Meta son **carácter a carácter** las de los
desplegables de GHL. No es un detalle cosmético: si no coinciden, GHL guarda un
valor que su propio desplegable no reconoce, el scoring lo lee vacío y las
automatizaciones no se disparan.

Eso ya estaba pasando en la cuenta, de antes:

| Campo | El formulario mandaba | GHL esperaba |
|---|---|---|
| Edad | `16-25` `26-35` `36-45` | `Menor de 18` `18-21` `22-30` `31-40` `Mayor de 40` |
| Inglés | `Si` `No, pero puedo aprender` `No` | `A1-A2` `B1` `B2` `C1 o superior` `No estoy seguro` |

Si se prefiere la redacción de la presentación («18–24 años», «Alto (B2 o
superior)»), lo que hay que cambiar son **las opciones del desplegable de GHL**,
no las del formulario. En ese orden, nunca al revés.

## La clasificación

| Criterio | Respuesta | Puntos |
|---|---|---|
| Cuándo empezar | Lo antes posible | 40 |
| | En 1-3 meses | 30 |
| | En 3-6 meses | 15 |
| | Solo busco info | 0 |
| En qué punto está | Quiero matricularme | 40 |
| | Comparando escuelas | 30 |
| | Consultando requisitos | 15 |
| | Solo explorando | 0 |
| Inglés | B2 o superior | 10 · B1 8 · A1-A2 4 |
| Natación | Sí 10 · puedo aprender 5 · No 0 |

| Clase | Puntos | Se escribe en GHL como | Acción |
|---|---|---|---|
| **A** | 75-100 | `Caliente` | Etapa 🔥 Lead caliente + tarea de llamada inmediata |
| **B** | 50-74 | `Tibio` | Contactar el mismo día |
| **C** | 25-49 | `Frio` | Secuencia de nutrición |
| **D** | 0-24 | `Congelado` | Información automatizada |

Las cuatro clases encajan una a una con el desplegable `Lead Temperature`, que
solo admite `Caliente` · `Tibio` · `Frio` · `Congelado`. Así no hace falta un
campo nuevo y la etapa 🔥 sigue disparándose con `Caliente`.

## Dos cosas que el modelo acordado no cubre, y cómo quedan resueltas

### 1. El lead que nadie preguntó

Las dos preguntas que más pesan solo existen en el formulario nuevo. Un lead del
formulario viejo deja las dos vacías, saca 0 puntos y sale **clase D**. Serían
unos 600 leads al mes marcados como basura por una pregunta que no se les hizo.

Para esos el workflow usa el **modelo medido** de la cuenta (natación, teléfono,
canal, respuesta por WhatsApp), parte de 50 puntos y etiqueta
`sin-formulario` para saber qué modelo puntuó a quién. Comprobado en las dos
ramas antes de subirlo.

### 2. Quien no sabe nadar puede salir clase A

De 88 leads que contestaron que no saben nadar, **0 llegaron a entrevista**. El
modelo acordado solo les quita 10 puntos, así que alguien que quiere matricularse
ya y no sabe nadar saca 88 puntos y sale clase A.

No se toca la puntuación pactada. Se marca con la etiqueta `req-nadar-no` y la
tarea de llamada empieza con el aviso. Si se quiere que tope en clase C, es una
línea.

## Pendiente de permiso de escritura

1. **Reescribir 51 contactos** cuyo `Lead Temperature` quedó con un valor que el
   desplegable no admite (29 en `templado`, que no existe como opción). Solo toca
   `customFields`; las etiquetas no se tocan.
2. **Poner el formulario nuevo en los anuncios.** Los creatives de Meta son
   inmutables: hay que clonar cada uno cambiando el `lead_gen_form_id` y
   reapuntar el anuncio. Probado en seco sobre los 3 de IMG_CUALIFICADO, que es
   el banco de pruebas de menos riesgo (€10/día, €13,50/lead).
3. **Mover presupuesto**: pausar DINAMICA y subir Clientes Potenciales a €40/día.
