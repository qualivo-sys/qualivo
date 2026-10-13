# EAC · Lead scoring v2 — lo que de verdad predice una entrevista

Medido el 6-oct-2026 sobre los datos reales de la cuenta. La versión anterior
puntuaba lo que el lead **declara** en el formulario. No funcionaba.

## Lo que no funciona

Sobre **428 leads de Meta** que contestaron el formulario completo y tienen
oportunidad en el CRM, cruzados con quién acabó entrevistándose:

| Pregunta del formulario | Respuesta | n | Entrevistas | % |
|---|---|---|---|---|
| Nivel de estudios | ESO o equivalente | 221 | 5 | 2,3 % |
| | Bachillerato | 124 | 1 | **0,8 %** |
| | Estudios Superiores | 83 | 3 | 3,6 % |
| ¿Sabes inglés? | Sí | 261 | 7 | 2,7 % |
| | No, pero puedo aprender | 145 | 2 | 1,4 % |
| | No | 13 | 0 | 0 % |

**Los estudios no ordenan nada**: Bachillerato convierte peor que la ESO. Con
el scoring v1 aplicado a toda la base, los que sí se entrevistaron puntuaban
**37,5 de media y los que no, 44,7** — es decir, puntuaba al revés.

La edad ni siquiera entra: el formulario la pregunta pero **Meta no la mapea al
campo `edad_rango` de GHL**. De 428 leads, 419 la tienen vacía. Y los pocos
valores que llegan (`22-30`, `menor_18`) vienen de otro formulario distinto al
que está activo, con opciones que no coinciden.

## Lo que sí funciona

### Responder al WhatsApp — la señal fuerte

Sobre **475 leads** que recibieron un WhatsApp:

| | n | Consiguen cita | Entrevistas |
|---|---|---|---|
| **Respondió** | 100 | 28 (28,0 %) | **15 (15,0 %)** |
| No respondió | 375 | 51 (13,6 %) | 24 (6,4 %) |

**Responder multiplica por 2,3 la probabilidad de entrevista.** Ninguna respuesta
del formulario se acerca ni de lejos a eso. Es comportamiento, no declaración:
cuesta algo hacerlo, y por eso significa algo.

### No saber nadar — el filtro duro

| ¿Sabes nadar? | n | Entrevistas |
|---|---|---|
| Sí | 340 | 9 |
| No, pero puedo aprender | 70 | **0** |
| No | 18 | **0** |

**88 leads, cero entrevistas.** Es el 20 % de la base y puede bajar al final de
la cola sin perder nada. Tiene sentido: nadar es requisito real del curso.

## Cómo queda el scoring

| Señal | Puntos | Por qué |
|---|---|---|
| Ha respondido por WhatsApp | **+40** | x2,3 en entrevistas |
| Sabe nadar | +10 | |
| No, pero puede aprender | −20 | 0 de 70 |
| No sabe nadar | −40 | 0 de 18 |
| Inglés sí / no | +10 / −10 | señal débil pero en la dirección esperada |
| Estudios superiores | +5 | lo único del bloque de estudios que suma |
| Teléfono español | +10 | |
| Teléfono extranjero | −15 | |
| Sin teléfono válido | −30 | no hay nada que trabajar |
| Viene de la web | +15 | el orgánico se presenta al 29 %, el instantáneo al 25 % |

Umbrales: **caliente ≥ 45**, templado ≥ 20. Pensados para que un lead de pago
que responde al WhatsApp llegue a caliente, que era justo lo que el v1 hacía
imposible: cuatro de los cinco imanes tenían techo 65 con el umbral en 70.

## Los dos workflows

| Workflow | Qué hace |
|---|---|
| `EAC · Precalificación y prioridad de leads` | Al entrar: trae el contacto de GHL, puntúa, guarda `Lead Score` y `Lead Temperature`, etiqueta y, si sale caliente, mueve a 🔥 y crea tarea de llamada a 1 h |
| `EAC · Lead respondió → recalcular scoring` | Cuando el lead contesta: le pone `respondio-whatsapp` y vuelve a lanzar el scoring, que ahora le suma los 40 |

Disparadores en GHL: *Opportunity Created* para el primero, *Customer Replied*
para el segundo. Los dos mandan solo el `contactId`: el workflow se trae el resto
él mismo, así no hay nada que mapear mal en GHL.

## Un fallo que costó caro en la prueba

`PUT /contacts/{id}` con `tags` **reemplaza el array entero**, no añade. En la
primera prueba borró `lead-tcp`, `lead paid` y `seq-tcp` de un contacto real —
y `seq-tcp` es la que dispara su secuencia de emails. Arreglado: los campos van
por `PUT` sin tocar `tags`, y la etiqueta por `POST /contacts/{id}/tags`, que sí
añade. Restaurado el contacto afectado.

## Lo que esto no arregla

De los 428 leads de Meta con formulario contestado, **9 llegaron a entrevista:
el 2,1 %**. El scoring reordena la cola para que Luz empiece por arriba, pero no
cambia esa tasa. Para eso están las otras palancas: los recordatorios de cita,
la entrevista online por defecto y devolverle a Meta la señal de calidad.
